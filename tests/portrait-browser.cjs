'use strict';

// Usage: node prototype/v1.3/tests/portrait-browser.cjs
// CHROME_BIN can override the macOS Chrome path (or select Chromium on Linux).
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {existsSync, mkdtempSync, rmSync, writeFileSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {resolve, join} = require('node:path');
const {pathToFileURL} = require('node:url');
const {setTimeout:delay} = require('node:timers/promises');

const chrome = process.env.CHROME_BIN ?? (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : '/usr/bin/chromium');
const url = pathToFileURL(resolve(__dirname,'../index.html')).href;
const profile = mkdtempSync(join(tmpdir(),'life13-portrait-'));
let stderr='', id=0, sessionId, buffer='';
const pending = new Map(), faults=[], remoteRequests=[];
const browser = spawn(chrome,[
  '--headless','--disable-gpu','--disable-background-networking','--no-default-browser-check','--no-first-run',
  '--remote-debugging-pipe', '--user-data-dir='+profile, 'about:blank'
],{stdio:['ignore','ignore','pipe','pipe','pipe']});
browser.stderr.setEncoding('utf8').on('data',chunk=>{stderr=(stderr+chunk).slice(-2500);});

function rejectPending(error) {
  for(const reply of pending.values()) reply.reject(error);
  pending.clear();
}
browser.on('error',rejectPending);
browser.on('exit',(code,signal)=>rejectPending(new Error('Chrome exited '+(code??signal)+'\n'+stderr)));
browser.stdio[3].on('error',rejectPending);
browser.stdio[4].setEncoding('utf8').on('data',chunk=>{
  buffer+=chunk;
  const lines=buffer.split('\0');
  buffer=lines.pop();
  for(const line of lines) {
    if(!line)continue;
    const reply=JSON.parse(line);
    const promise=pending.get(reply.id);
    if(promise) {
      pending.delete(reply.id);
      if(reply.error)promise.reject(new Error(reply.error.message));
      else promise.resolve(reply.result);
    }
    if(reply.method==='Runtime.exceptionThrown') {
      const detail=reply.params.exceptionDetails;
      faults.push(detail.exception?.description??detail.text);
    }
    if(reply.method==='Network.requestWillBeSent' && /^https?:/.test(reply.params.request.url)) remoteRequests.push(reply.params.request.url);
  }
});

function send(method,params={},attach=true) {
  const current=++id;
  return new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{
      pending.delete(current);
      reject(new Error(method+' timed out\n'+stderr));
    },method==='Target.createTarget'?20000:5000);
    pending.set(current,{
      resolve:value=>{clearTimeout(timeout);resolve(value);},
      reject:error=>{clearTimeout(timeout);reject(error);}
    });
    browser.stdio[3].write(JSON.stringify({id:current,method,params,sessionId:attach?sessionId:undefined})+'\0');
  });
}

async function evaluate(expression) {
  const {result,exceptionDetails}=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(exceptionDetails)throw new Error(exceptionDetails.exception?.description??exceptionDetails.text);
  return result.value;
}

async function wait(expression,message) {
  for(let attempt=0;attempt<75;attempt++) {
    if(await evaluate(expression))return;
    await delay(30);
  }
  const heading=await evaluate('document.querySelector("h1")?.textContent');
  throw new Error((message??expression)+' · '+heading+(faults.length?'\n'+faults.join('\n'):''));
}

const query=selector=>'document.querySelector('+JSON.stringify(selector)+')';
const action=name=>'[data-action="'+name+'"]';
const has=selector=>'Boolean('+query(selector)+')';

async function touch(type,x,y) {
  const touchPoints=type==='touchEnd' ? [] : [{x,y,id:1,radiusX:4,radiusY:4}];
  await send('Input.dispatchTouchEvent',{type,touchPoints});
}

async function point(selector,scroll=true) {
  const location=await evaluate(`(()=>{
    const target=${query(selector)};
    if(!target||target.disabled)return null;
    if(${scroll})target.scrollIntoView({block:'center'});
    const box=target.getBoundingClientRect();
    const x=Math.round(box.left+box.width/2), y=Math.round(box.top+box.height/2);
    return target.contains(document.elementFromPoint(x,y)) ? {x,y} : null;
  })()`);
  assert(location,'Visible, enabled, reachable control '+selector);
  return location;
}

async function tap(selector) {
  const {x,y}=await point(selector);
  await touch('touchStart',x,y);
  await touch('touchEnd');
}

async function pressEnter(selector) {
  assert(await evaluate(`(()=>{const el=${query(selector)}; el?.focus(); return el===document.activeElement})()`));
  const key = {key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:process.platform==='darwin'?36:13};
  await send('Input.dispatchKeyEvent',{...key,type:'keyDown',text:'\r',unmodifiedText:'\r'});
  await send('Input.dispatchKeyEvent',{...key,type:'keyUp'});
}

async function mouseClick(selector) {
  const {x,y}=await point(selector);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});
}

async function resize(width,height,mobile) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await send('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:1});
}

async function portrait(label) {
  const geometry=await evaluate(`(()=>{
    const frame=document.querySelector('.game-frame');
    const scroll=frame?.querySelector('.game-scroll');
    if(!scroll)return null;
    const {x,y,width,height}=frame.getBoundingClientRect();
    const footer=frame.querySelector('.turn-footer');
    const dialog=frame.querySelector('dialog[open]')?.getBoundingClientRect();
    return {x,y,width,height, viewWidth:innerWidth,viewHeight:innerHeight, horizontal:scroll.scrollWidth-scroll.clientWidth,
      pageHorizontal:document.documentElement.scrollWidth-innerWidth,
      footerTop:footer?.getBoundingClientRect().top, footerBottom:footer?.getBoundingClientRect().bottom,
      dialogBounds:dialog ? [dialog.left,dialog.top,dialog.right,dialog.bottom] : null};
  })()`);
  assert(geometry,label+' game frame contains its own scrolling area');
  const {x,y,width,height,viewWidth,viewHeight,horizontal,pageHorizontal,footerTop,footerBottom,dialogBounds}=geometry;
  assert(Math.abs(width-height*9/16)<=1,label+' frame ratio: '+width+' × '+height);
  assert(width>0 && x>=-1 && y>=-1 && x+width<=viewWidth+1 && y+height<=viewHeight+1,label+' frame fits viewport');
  assert(horizontal<=1 && pageHorizontal<=1,label+' no horizontal overflow');
  if(footerTop!==undefined)assert(footerTop>=y && footerBottom<=y+height+1,label+' footer stays in frame');
  if(dialogBounds) {
    const [left,top,right,bottom]=dialogBounds;
    assert(left>=x-1 && right<=x+width+1 && top>=y-1 && bottom<=y+height+1,label+' dialog stays in frame');
  }
  return {viewport:[viewWidth,viewHeight],frame:[Math.round(width),Math.round(height)]};
}

async function load() {
  await send('Page.navigate',{url});
  await wait('location.protocol === "file:" && '+has(action('setup')+','+action('resume')));
}

async function main() {
  assert(existsSync(chrome),'Cannot find Chrome. Set CHROME_BIN.');
  const {targetId}=await send('Target.createTarget',{url:'about:blank'},false);
  ({sessionId}=await send('Target.attachToTarget',{targetId,flatten:true},false));
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await resize(360,640,true);
  await load();
  const dimensions=[await portrait('small phone')];
  for(const [width,height,mobile] of [[320,568,true],[390,844,true],[430,932,true],[1366,768,false]]) {
    await resize(width,height,mobile);
    dimensions.push(await portrait(width+'×'+height));
  }
  await resize(360,640,true);
  await tap('.start-panel '+action('setup'));
  await wait(has(action('birth')));
  await pressEnter(action('birth'));
  await wait(has('.day-track')+' && '+has('.day-card'));
  await tap('.day-card[data-id="life-1-0"]');
  await wait("document.querySelector('.day-track').textContent.includes('由主要安排占用')");
  assert(await evaluate("!document.querySelector('.day-extra')"),'two-slot action leaves no second action');
  await tap('.day-card[data-id="life-1-1"]');
  await wait(has('[data-action="day-extra"]'));
  await pressEnter('[data-action="day-extra"][data-id="quiet"]');
  await wait("document.querySelector('.day-track').textContent.includes('在楼下歇一歇')");
  await wait(has('.turn-footer '+action('commit')+':enabled'));
  await portrait('two-slot day planner');
  await tap('.turn-footer '+action('commit'));
  await wait(has('.turn-footer '+action('next')));
  assert(await evaluate("document.querySelector('.event-panel').textContent.includes('台阶上坐了一小会儿')"),'second action appears in life story');
  await pressEnter('.turn-footer '+action('next'));
  await wait(has('.scene '+action('enter')));
  await portrait('lamp scene');
  await tap('.scene '+action('enter'));
  await wait(has('.choice .drag-grip'));

  await resize(720,1280,true);
  const handle=await point('.choice .drag-grip');
  const drop=await point('[data-drop="main"]',false);
  await touch('touchStart',handle.x,handle.y);
  for(let i=1;i<=6;i++)await touch('touchMove',handle.x+(drop.x-handle.x)*i/6,handle.y+(drop.y-handle.y)*i/6);
  await touch('touchEnd');
  await wait('document.querySelector(\'.choice[aria-pressed="true"]\')?.dataset.id === document.querySelector(\'.choice\')?.dataset.id','real touch drag selects primary workbench card');
  const draft=await evaluate('document.querySelector(\'.choice[aria-pressed="true"]\').dataset.id');
  await resize(390,844,true);
  await send('Page.reload',{ignoreCache:true});
  await wait(has('.start-panel '+action('resume')));
  await tap('.start-panel '+action('resume'));
  await wait('document.querySelector(\'.choice[aria-pressed="true"]\')?.dataset.id === '+JSON.stringify(draft),'workbench draft restored after reload');
  await tap('.turn-footer '+action('commit'));
  await wait(has('.turn-footer '+action('next')));
  assert(await evaluate('Boolean(document.querySelector(\'.room-prop[data-id="lamp"]\'))'),'lamp gained by confirmation');
  await portrait('workbench result');
  assert.deepEqual(faults,[],'no browser runtime errors');
  assert.deepEqual(remoteRequests,[],'offline game never requests a remote resource');
  const screenshot=process.env.PORTRAIT_SCREENSHOT;
  if(screenshot) {
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    writeFileSync(screenshot,Buffer.from(data,'base64'));
  }

  await tap(action('keepsake'));
  await wait(has('[data-action="keepsake"]:disabled'));
  await tap(action('history'));
  await wait(has('dialog [data-action="share-memory"]'));
  await tap('dialog '+action('close'));
  await wait('!'+has('dialog[open]'));
  await tap('.turn-footer '+action('next'));
  async function shopShot(name) {
    if (!process.env.SHOP_SHOTS) return;
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    writeFileSync(join(process.env.SHOP_SHOTS,name+'.png'),Buffer.from(data,'base64'));
  }
  const shopObject=id=>'[data-action="shop-object"][data-id="'+id+'"]';
  await wait(has(shopObject('ice')));
  await shopShot('01-counter');
  await resize(320,568,true);
  await portrait('small shop');
  await shopShot('02-small-phone');
  await tap(shopObject('ice'));
  await wait("document.querySelector('.shop-info strong').textContent.includes('¥1')");
  await shopShot('03-price');
  await tap(shopObject('yuanA'));
  await wait(has('.shop-entity.picked[data-id="yuanA"]'));
  await tap(shopObject('ice'));
  await wait(has('.shop-entity.paid'));
  await shopShot('04-one-yuan');
  await send('Page.reload',{ignoreCache:true});
  await wait(has('.start-panel '+action('resume')));
  await tap('.start-panel '+action('resume'));
  await wait(has('.shop-entity.paid'));
  const iceSummary="document.querySelector('.shop-info small').textContent==='冰棍 ¥1 · 留下 ¥1'";
  await wait(iceSummary);
  await wait(has(action('commit')+':enabled'));
  await tap(action('shop-undo'));
  await wait(has(action('shop-leave')));
  const coinPoint=await point(shopObject('yuanA'));
  const icePoint=await point(shopObject('ice'),false);
  await touch('touchStart',coinPoint.x,coinPoint.y);
  await touch('touchMove',icePoint.x,icePoint.y);
  await touch('touchEnd');
  await wait(has(action('commit')+':enabled'));
  await wait(iceSummary);
  await shopShot('05-ready');
  await tap(action('commit'));
  await wait(has(action('next')));
  await wait("document.querySelector('.shop-info p').textContent.includes('剩下的一元放进口袋')");
  await shopShot('06-settled');
  await tap(action('next'));
  const dinnerAct=id=>'.dinner-panel [data-action="dinner-act"][data-id="'+id+'"]';
  async function dinnerShot(name){
    if (!process.env.DINNER_SHOTS) return;
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    writeFileSync(join(process.env.DINNER_SHOTS,name+'.png'),Buffer.from(data,'base64'));
  }
  async function reloadDinner(){
    await send('Page.reload',{ignoreCache:true});
    await wait(has('.start-panel '+action('resume')));
    await tap('.start-panel '+action('resume'));
    await wait(has('.dinner-panel'));
  }
  await wait(has('.last-fish .fish-plate.suggested'));
  const dinnerSave = await evaluate('localStorage.getItem(LifeSave.key)');
  async function loadDinnerSave(raw, update='') {
    await evaluate(`(()=>{
      const save=JSON.parse(${JSON.stringify(raw)});
      const branch=save.branches[save.active], run=branch.run;
      ${update}
      localStorage.setItem(LifeSave.key,JSON.stringify(save));
    })()`);
    await reloadDinner();
  }
  // Use a regular family setting for the scene captures, independent of the random origin.
  await loadDinnerSave(dinnerSave,`
    if(run.birth==='grandma') {
      run.birth='scholar';
      save.trees[branch.tree].birth='scholar';
    }
  `);
  const fishSave = await evaluate('localStorage.getItem(LifeSave.key)');
  async function fishShot(name){
    if (!process.env.FISH_SHOTS) return;
    await evaluate("document.querySelector('.game-scroll').scrollTop=0");
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    writeFileSync(join(process.env.FISH_SHOTS,name+'.png'),Buffer.from(data,'base64'));
  }
  async function countDinnerCommits(){
    await evaluate(`(()=>{
      const commit=LifeEngine.commit;
      window.dinnerCommitCount=0;
      LifeEngine.commit=run=>{
        if(run.slot===4) window.dinnerCommitCount++;
        return commit(run);
      };
    })()`);
  }
  async function assertDinnerSettled(id){
    await wait(has(action('next')));
    assert.equal(await evaluate('window.dinnerCommitCount'),1);
    assert.equal(await evaluate(has(action('commit'))),false,'the final action already committed');
    assert.equal(await evaluate(has(action('guide-help'))),false,'resolved scenes stop helping');
    const facts=await evaluate(`(()=>{
      const save=LifeSave.read(localStorage);
      return save.branches[save.active].run.facts.filter(f=>f.slot===4);
    })()`);
    assert.equal(facts.length,1);
    assert.equal(facts[0].choiceId,'life-4-'+id);
  }
  await portrait('last fish 320×568');
  assert(await evaluate(`Array.from(document.querySelectorAll('.fish-room button')).every(b=>b.clientWidth>=44&&b.clientHeight>=44)`));
  assert(await evaluate(has('.fish-player')+' && '+has('.fish-guest')+' && '+has('.fish-seat')));
  await fishShot('01-initial-320');
  await tap('.last-fish '+action('guide-help'));
  await wait(has('.fish-hint'));
  await tap(dinnerAct('select-fish'));
  await wait(has('.fish-own.suggested')+' && '+has('.fish-reserve.suggested'));
  await fishShot('02-selected-320');
  await reloadDinner();
  await wait(has('.fish-plate.selected'));
  await countDinnerCommits();
  await tap(dinnerAct('save-fish'));
  await assertDinnerSettled('save-fish');
  await wait(has('.fish-placed')+' && '+has('.fish-room.settling'));
  await wait("document.querySelector('.fish-dialogue').textContent.includes('明早还能配粥')");
  await wait("document.querySelector('.fish-room').getAnimations({subtree:true}).length===0");
  await resize(390,844,true);
  await portrait('last fish reserve result 390×844');
  await fishShot('04-saved-phone');
  await reloadDinner();
  await wait(has('.fish-placed')+' && '+has(action('next')));

  await loadDinnerSave(fishSave);
  await pressEnter(dinnerAct('ask-family'));
  await wait("document.querySelector('.fish-dialogue').textContent.includes('在外面吃过了')");
  await fishShot('03-asked-phone');
  await reloadDinner();
  await wait("document.querySelector('.fish-dialogue').textContent.includes('在外面吃过了')");
  await resize(1366,768,false);
  await portrait('last fish desktop');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await countDinnerCommits();
  await mouseClick(dinnerAct('eat-fish'));
  await assertDinnerSettled('eat-fish');
  await wait("document.querySelector('.fish-dialogue').textContent.includes('趁热吃')");
  assert.equal(await evaluate(has('.fish-room.settling')),false,'reduced motion skips dinner animation');
  await fishShot('05-eaten-desktop');
  await mouseClick(action('next'));
  await wait("document.querySelector('.life-hud .kicker').textContent.includes('第 5 / 46 回合')");
  await resize(320,568,true);

  await loadDinnerSave(fishSave);
  await countDinnerCommits();
  await tap(dinnerAct('keep-eating'));
  await assertDinnerSettled('keep-eating');
  console.log('PASS · last fish, two-tap decisions, one-tap quiet route, guidance, save restore and reduced motion');

  // A pre-T4.2 draft must still render and complete the original T4 dinner.
  await loadDinnerSave(dinnerSave,`
    run.draft.interaction={eventId:'life-4',interactionId:'t4-legacy',opened:true,reviewed:false,actions:[]};
  `);
  await wait(has('.dinner-room .dinner-speaker.suggested'));
  await portrait('dinner 320×568');
  assert(await evaluate("Array.from(document.querySelectorAll('.dinner-room button')).every(b=>b.clientWidth>=44&&b.clientHeight>=44)"));
  await dinnerShot('01-initial-320');
  await reloadDinner();
  await tap('.dinner-panel '+action('guide-help'));
  await wait(has('.dinner-panel .fine'));
  await evaluate("document.querySelector('.game-scroll').scrollTop=0");
  await dinnerShot('02-recommended-320');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await tap(dinnerAct('turn'));
  await wait(has('.dinner-fish.passed'));
  await dinnerShot('03-passed-320');
  await reloadDinner();
  await wait(has('.dinner-fish.passed'));
  await pressEnter(dinnerAct('listen'));
  await wait(has('.dinner-replies'));
  await resize(390,844,true);
  await portrait('dinner phone');
  await dinnerShot('04-listening-phone');
  await tap('.dinner-recall summary');
  await tap(dinnerAct('story-3'));
  await wait("document.querySelector('.dinner-feedback').textContent.includes('书签')");
  await reloadDinner();
  await wait("document.querySelector('.dinner-feedback').textContent.includes('书签')");
  await resize(1366,768,false);
  await portrait('dinner desktop');
  await dinnerShot('05-story-desktop');
  await mouseClick(dinnerAct('finish'));
  await wait(has(action('next')));
  assert.equal(await evaluate(has(action('commit'))),false,'there is no second dinner confirmation');
  await reloadDinner();
  await wait(has(action('next')));
  await dinnerShot('06-ended-desktop');
  await send('Emulation.setEmulatedMedia',{features:[]});
  await mouseClick(action('next'));
  await wait('!'+has('.dinner-panel'));
  await resize(390,844,true);
  console.log('PASS · dinner touch, keyboard, reduced motion, draft recovery and single settlement');

  await evaluate(`(()=>{
    const run=LifeEngine.create(1);
    while(run.slot<28){
      const event=LifeEngine.currentCard(run);
      run.entered=Boolean(event.hotspot);
      run.draft.main=event.choices[0].id;
      if(LifeContent.familySlots.includes(run.slot))run.draft.parent=2;
      if(!LifeEngine.commit(run)||!LifeEngine.advance(run))throw Error('packing fixture failed');
    }
    const key=LifeSave.key;
    const save=JSON.parse(localStorage.getItem(key));
    save.branches[save.active].run=run;
    localStorage.setItem(key,JSON.stringify(save));
    return true;
  })()`);
  await resize(390,844,true);
  await send('Page.reload',{ignoreCache:true});
  await wait(has('.start-panel '+action('resume')));
  await tap('.start-panel '+action('resume'));
  await wait(has('.turn-footer '+action('enter')));
  await tap('.turn-footer '+action('enter'));
  await wait(has('.packing-board [data-id="lamp"]'));
  await tap('.packing-board [data-action="pack-item"][data-id="lamp"]');
  await wait(has('.packing-zone [data-id="store"]:enabled'));
  await tap('.packing-zone [data-id="store"]');
  await wait("document.querySelector('[data-drop=store] .packed-preview')?.getAttribute('aria-label').includes('旧台灯')");
  const packGrip=await point('.pack-item[data-id="lamp"] .drag-grip');
  const packTarget=await point('[data-drop=keep]',false);
  await touch('touchStart',packGrip.x,packGrip.y);
  for(let i=1;i<=6;i++)await touch('touchMove',packGrip.x+(packTarget.x-packGrip.x)*i/6,packGrip.y+(packTarget.y-packGrip.y)*i/6);
  await touch('touchEnd');
  await wait("document.querySelector('[data-drop=keep] .packed-preview')?.getAttribute('aria-label').includes('旧台灯')",'real touch drag moves the lamp to another destination');
  await portrait('packing board at phone width');

  await resize(320,568,true);
  await tap(action('settings'));
  await wait(has('dialog[open]'));
  await portrait('small-phone settings');
  await tap('dialog details summary');
  await tap('dialog '+action('test'));
  await wait(has(action('choose'))+' && !'+has('dialog[open]'));
  assert(await evaluate('document.querySelector("[role=progressbar]").getAttribute("aria-valuenow") === "43"'));
  for(let i=0;i<2;i++) {
    const enter='.turn-footer '+action('enter');
    await wait(has(enter+','+action('choose')));
    if(await evaluate(has(enter)))await tap(enter);
    await wait(has(action('choose')));
    await tap(action('choose'));
    await wait(has('.turn-footer '+action('commit')+':enabled'));
    await tap('.turn-footer '+action('commit'));
    await wait(has('.turn-footer '+action('next')));
    await tap('.turn-footer '+action('next'));
  }
  await wait(has('.memoir'));
  await portrait('small-phone memoir');
  await resize(1366,768,false);
  await mouseClick('.book-nav '+action('memo')+'[data-id="3"]');
  await wait(has(action('fork-preview')));
  await mouseClick(action('fork-preview'));
  await wait(has('dialog[open]'));
  await portrait('desktop fork confirmation');
  assert.deepEqual(faults,[],'no browser runtime errors through early memoir');
  assert.deepEqual(remoteRequests,[],'game flow never requests a remote resource');

  await evaluate(`(()=>{
    const key=LifeSave.key, save=JSON.parse(localStorage.getItem(key));
    const finish=(run,alternate=false)=>{
      while(!run.memo){
        const event=LifeEngine.currentCard(run);
        run.entered=true;run.draft.main=event.choices[alternate?1:0].id;
        if(LifeContent.familySlots.includes(run.slot))run.draft.parent=2;
        if(!LifeEngine.commit(run))throw Error('fixture failed: '+event.id);
        if(run.slot===3)run.facts.at(-1).saved=true;
        LifeEngine.advance(run);
      }
      return run;
    };
    const first=finish(LifeEngine.create(2));
    const slot=first.memo.forks[0].slot, second=finish(LifeEngine.fork(first,slot),true);
    const parent=save.active, tree=save.branches[parent].tree;
    save.branches[parent].run=first;
    save.branches['second-test']={tree,parent,from:slot,run:second};
    localStorage.setItem(key,JSON.stringify(save));
  })()`);
  await send('Page.reload',{ignoreCache:true});
  await wait(has(action('archive')));
  await evaluate(`(()=>{
    window.cardSizes=[];
    HTMLAnchorElement.prototype.click=function(){
      const image=new Image();image.onload=()=>window.cardSizes.push([image.width,image.height]);image.src=this.href;
    };
  })()`);
  await mouseClick(action('archive'));
  await wait(has('#compare'));
  await evaluate("const select=document.querySelector('#compare');select.value='second-test';select.dispatchEvent(new Event('change',{bubbles:true}));");
  await wait(has(action('share-pair')));  await mouseClick(action('share-pair'));
  await wait('window.cardSizes.length===1');
  await mouseClick(action('open-branch'));
  await wait(has(action('share-memory')));
  await mouseClick(action('share-memory'));
  await wait('window.cardSizes.length===2');
  assert.deepEqual(await evaluate('window.cardSizes'),[[720,1280],[720,1280]]);

  const gallery=pathToFileURL(resolve(__dirname,'../art/index.html')).href;
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await send('Page.navigate',{url:gallery});
  await wait("document.querySelectorAll('#clips a[download]').length === 17",'seventeen independent source links load offline');
  const links=await evaluate("Array.from(document.querySelectorAll('#clips a[download]'),link=>link.href)");
  const {fileURLToPath}=require('node:url');
  assert(links.every(link=>existsSync(fileURLToPath(link))),'each animation points to an existing Aseprite source');
  const actor="document.querySelector('[data-sprite=child]').style.backgroundPosition";
  const startingFrame=await evaluate(actor);
  await wait(actor+' !== '+JSON.stringify(startingFrame),'child advances visibly in the offline gallery');
  await mouseClick('#motion');
  await wait("document.querySelector('#motion').textContent === '播放动画'");
  const pausedFrame=await evaluate(actor);
  await delay(260);
  assert.equal(await evaluate(actor),pausedFrame,'paused gallery stays on one frame');
  assert.deepEqual(faults,[],'no browser runtime errors through the gallery');
  assert.deepEqual(remoteRequests,[],'gallery never requests a remote resource');
  await resize(320,568,true);
  const demo=pathToFileURL(resolve(__dirname,'guidance.html')).href;
  await send('Page.navigate',{url:demo});
  const recommended='[data-object-id="note"][data-recommended="true"]';
  await wait(has(recommended));
  await portrait('guidance demo');
  await tap('[data-id="file-note"]');
  await wait(has(action('guide-undo')));
  await tap(action('guide-undo'));
  await wait(has('[data-guide-level="0"] '+recommended));
  await tap(action('guide-help'));
  await wait("document.querySelector('.guide-hint')?.textContent.includes('收好便签')");
  await tap('[data-id="file-photo"]');
  await wait(has(recommended)+' && '+has('.event-panel')+" && document.querySelector('.event-panel').textContent.includes('还有一张便签')");
  await pressEnter('[data-id="file-note"]');
  await wait(has('[data-action="commit"]:enabled'));
  await tap(action('commit'));
  await wait("document.querySelector('.play')?.textContent.includes('这次互动已结束')");
  assert.equal(await evaluate(has(action('guide-help'))),false);
  await tap(action('home'));
  await wait(has('.start-panel'));
  await send('Page.reload',{ignoreCache:true});
  await wait(has(recommended));
  // Advance the browser clock without making the player wait during the test.
  async function advanceGuideTime(ms) {
    await send('Emulation.setVirtualTimePolicy',{policy:'advance',budget:ms});
  }
  await advanceGuideTime(8500);
  await wait(has('[data-guide-level="1"] '+recommended));
  await advanceGuideTime(10500);
  await wait(has('[data-guide-level="2"] .guide-hint'));
  assert.deepEqual(faults,[],'guidance demo without runtime errors');
  console.log('PASS · narrow guidance demo, help, alternative action, redraw, keyboard, confirmation and exit');
  console.log('PASS · local file, 9:16 layout, no sideways overflow, touch, mouse, keyboard, drag, reload, day planner, packing board, object settlement, early memoir, fork dialog and 17 animation previews');
  console.log(JSON.stringify(dimensions));
}

main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser.exitCode===null && browser.signalCode===null && browser.pid) {
    const exited = new Promise(resolve=>browser.once('exit',resolve));
    browser.stdio[3].write(JSON.stringify({id:++id,method:'Browser.close'})+'\0');
    const closed = await Promise.race([exited.then(()=>true),delay(1500,false)]);
    if (!closed) {
      browser.kill();
      await Promise.race([exited,delay(1500)]);
    }
  }
  rmSync(profile,{recursive:true,force:true,maxRetries:6,retryDelay:150});
});
