'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {playPage}=require('./p2-browser.cjs');
const out=process.env.LIFE_P3_EVIDENCE??path.resolve(__dirname,'../docs/v1.4/p3/p3-1/evidence');
module.exports=async function({load,resize,send,evaluate,wait,tap,pressEnter,mouseClick,portrait,faults,remoteRequests}){
  const log=[],frames=[];
  const data='LifeSave.read(localStorage)';
  const read='(d=>d.branches[d.active].run)('+data+')';
  const btn=(act,id)=>'[data-action="'+act+'"]'+(id?'[data-id="'+id+'"]':'');
  const has=s=>evaluate('!!document.querySelector('+JSON.stringify(s)+')');
  const sync=()=>evaluate('navigator.locks.request(LifeSave.key,()=>true)');
  async function open(){
    const enter=btn('enter');
    if(await has(enter)) {await tap(enter);await sync();}
    if(!await has('.route-desk[open]')){await tap('.route-desk summary');await sync();}
  }
  async function select(key,input=tap){await open();await input(btn('route',key));await sync();assert.equal(await evaluate(read+'.draft.route'),key==='draft/cancel'?undefined:key);}
  async function shot(file,selector){
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');
    const {data}=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,file+'.png'),Buffer.from(data,'base64'));
  }
  await resize(320,568,true);await load();
  await evaluate('(()=>{const orig=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{orig(a);a[0]=1;delete crypto.getRandomValues;return a}})()');
  await tap('.start-panel '+btn('setup'));await wait('!!document.querySelector("[data-action=birth]")');
  await tap(btn('birth'));await wait('!!document.querySelector(".gift-panel")');
  for(let slot=1;slot<=46;slot++){
    const current=await evaluate('LifeEngine.currentCard('+read+')');
    const opts={};
    if(slot===7)opts.id='life-7-0';
    if(slot===8){await open();assert(await has(btn('route','03/establish')));assert(!await has('[data-id^="test-"]'));await shot('candidate','.route-desk');}
    if(slot===11)opts.id='life-11-0';
    if(slot===12){
      await select('01/establish',pressEnter);
      await send('Page.reload',{ignoreCache:true});await wait('!!document.querySelector(".start-panel [data-action=resume]")');
      await tap('.start-panel '+btn('resume'));await wait('!!document.querySelector("main.play")');assert.equal(await evaluate(read+'.draft.route'),'01/establish');
    }
    if(slot===13)await select('03/establish');
    if(slot===14){
      await open();
      await tap(btn('choose',current.choices[0].id));await sync();
      for(const support of ['rest','family']){await tap(btn('support',support));await sync();}
      await select('01/replay');assert.match(await evaluate('document.querySelector(".route-desk").innerText'),/精力不足/);
      assert(await has('[data-action=commit]:disabled'));await shot('energy-conflict','.route-desk p:last-child');
      for(const support of ['rest','family']){await tap(btn('support',support));await sync();}
      await pressEnter(btn('route-method','after'));await sync();
      assert.equal(await evaluate(read+'.draft.routeMethod'),'after');
    }
    if(slot===15)await select('01/pause');
    if(slot===16){
      await select('01/resume');assert(await evaluate('LifeRoutes.dreams('+read+')["03"].state==="active"'));
    }
    if(slot===23)opts.id=current.choices.find(c=>c.commands.includes('job:office')).id;
    if(slot===24)await select('J01/shift-full');
    if(slot===25){
      await select('03/revise');assert.match(await evaluate('document.querySelector(".route-desk").innerText'),/排满/);
      await shot('full-shift-conflict','.route-desk p:last-child');await select('draft/cancel');await select('J01/shift-part');
    }
    if(slot===26){
      await resize(1366,768,false);frames.push(await portrait('desktop'));
      await select('03/ask-grad',mouseClick);await resize(320,568,true);
    }
    if(slot===27){
      const dreams=await evaluate('LifeRoutes.dreams('+read+')');assert.equal(dreams['01'].investments.length,1);
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      await select('03/revise');
    }
    if(slot===40 && current.id==='life-40')opts.id='life-40-1';
    const row=await evaluate('('+playPage.toString()+')('+JSON.stringify(opts)+')');
    const f=await evaluate(read+'.facts.at(-1)');log.push({slot,event:row.event,choice:f.choiceId,actions:f.actions,pay:f.pay});
    if(slot===14)assert.equal(f.actions[0].payload.method,'after');
    if(slot===13){frames.push(await portrait('320×568'));await shot('two-dreams-result','.dream-note');}
    if(slot===27)assert.equal(await evaluate('getComputedStyle(document.querySelector(".dream-note")).animationName'),'none');
    await evaluate('(async()=>{document.querySelector("[data-action=next]").click();await navigator.locks.request(LifeSave.key,()=>{});})()');
    if(await has('.memoir'))break;
  }
  assert.equal(log.at(-1).slot,46);
  const saved=await evaluate(data);assert(LifeSave.validateImport(saved));
  await tap(btn('memo','3'));await wait('!!document.querySelector("[data-action=fork-preview]")');
  await tap(btn('fork-preview'));await wait('!!document.querySelector("dialog [data-action=fork]")');
  await tap('dialog '+btn('fork'));await wait('!!document.querySelector("main.play")');
  const child=await evaluate(read);assert.deepEqual(child.facts,saved.branches[saved.active].run.facts.filter(f=>f.slot<child.slot));
  assert.deepEqual(faults,[]);assert.deepEqual(remoteRequests,[]);
  fs.writeFileSync(path.join(out,'p3-chrome.json'),JSON.stringify({frames,log,fork:child.slot},null,2)+'\n');
  console.log('PASS · 46 slots, two dreams, suspend/resume, adult contact, shift conflict, persisted draft, isolated fork and reduced motion');
};
