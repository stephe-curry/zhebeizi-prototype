'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {checkLife}=require('./p32.cjs');
const {main,lives}=require('./p32-lives.cjs');
const {playPage}=require('./p2-browser.cjs');
const defaultOut=process.env.LIFE_P32_EVIDENCE??path.resolve(__dirname,'../docs/v1.4/p3/p3-2/evidence');
async function operate(o){
  const read=()=>{const d=LifeSave.read(localStorage);return d.branches[d.active].run;};
  const r=read(),card=LifeEngine.currentCard(r);
  const get=(a,id)=>document.querySelector('[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'')+':not(:disabled)');
  async function click(a,id){const el=get(a,id);if(!el)throw Error('missing '+a+'/'+id);el.scrollIntoView({block:'center'});el.click();await navigator.locks.request(LifeSave.key,()=>{});}
  if(card.hotspot&&!r.entered)await click('enter');
  const details=document.querySelector('.route-desk');if(!details)throw Error('missing desk');
  if(!details.open)details.querySelector('summary').click();
  const [key,method]=o.split(':');
  await click('route',key);
  if(get('dream-enter'))await click('dream-enter');
  const option=LifeRoutes.options(read()).find(x=>x.key===key);
  for(const step of option.steps??[])await click('route-step',step.choices.find(c=>!c.retry).id);
  if(option.methods)await click('route-method',option.methods.some(c=>c.id===method)?method:option.methods.find(c=>!c.retry).id);
}
module.exports=async function({load,resize,send,evaluate,wait,tap,portrait,faults,remoteRequests},config={}){
  const out=config.out??defaultOut;
  const read='(d=>d.branches[d.active].run)(LifeSave.read(localStorage))',evidence=[];
  const prefixes=new Map();
  for(const life of config.lives??lives){
    await resize(320,568,true);await load();await evaluate('localStorage.clear()');await load();
    await evaluate('(()=>{const orig=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{orig(a);a[0]='+life.seed+';delete crypto.getRandomValues;return a;}})()');
    await tap('.start-panel [data-action=setup]');await wait('!!document.querySelector("[data-action=birth]")');
    await tap('[data-action=birth]');await wait('!!document.querySelector(".gift-panel")');
    let shotTaken=false;
    const menus=[];
    const prefix=prefixes.get(life.group);
    if(prefix){
      await tap('[data-action=settings]');
      await wait('!!document.querySelector("dialog[open] [data-action=export]")');
      await evaluate('('+function(json){
        const upload=document.querySelector('[data-input=import]'),files=new DataTransfer();
        files.items.add(new File([json],'分叉前.json',{type:'application/json'}));
        upload.files=files.files;upload.dispatchEvent(new Event('change',{bubbles:true}));
      }.toString()+')('+JSON.stringify(prefix)+')');
      await wait('!!document.querySelector(".start-panel [data-action=resume]")');
      await tap('.start-panel [data-action=resume]');await wait('!!document.querySelector("main.play")');
      assert.equal(await evaluate(read+'.slot'),life.slot);
    }
    for(let slot=prefix?life.slot:1;slot<=46;slot++){
      if(life.group&&slot===life.slot&&!prefix){
        await tap('[data-action=settings]');
      await wait('!!document.querySelector("dialog[open] [data-action=export]")');
        const backup=await evaluate('('+async function(){
          const original=HTMLAnchorElement.prototype.click;
          let output;
          HTMLAnchorElement.prototype.click=function(){output=fetch(this.href).then(r=>r.text());};
          try{document.querySelector('[data-action=export]').click();await navigator.locks.request(LifeSave.key,()=>{});return await output;}
          finally{HTMLAnchorElement.prototype.click=original;}
        }.toString()+')()');
        assert.equal(JSON.parse(backup).branches[JSON.parse(backup).active].run.slot,slot);
        prefixes.set(life.group,backup);
        await tap('dialog [data-action=close]');
        await wait('!document.querySelector("dialog[data-modal][open]")');
      }
      try{
        const choices=await evaluate('('+main.toString()+')('+read+','+JSON.stringify(life)+')');
        if(config.integration&&(life.slot===slot||life.ordinary&&slot>=30&&slot<=40)){
          menus.push({slot,keys:await evaluate('LifeRoutes.options('+read+').map(o=>o.key)')});
        }
        const instruction=life.actions[slot];
        if(life.decline&&slot===life.slot){
          await evaluate('('+operate.toString()+')('+JSON.stringify(life.decline)+')');
          if(await evaluate('!!document.querySelector(".dream-place[open]")'))await evaluate('document.querySelector("[data-action=dream-back]").click()');
          await evaluate('(async()=>{document.querySelector("[data-action=route-decline]").click();await navigator.locks.request(LifeSave.key,()=>{});})()');
          await wait('!'+read+'.draft.route');
        }
        if(instruction)await evaluate('('+operate.toString()+')('+JSON.stringify(instruction)+')');
        if(instruction&&!shotTaken&&(!config.lives||instruction===life.shot)&&await evaluate('!!document.querySelector(".chapter-station")')){
          shotTaken=true;
          if(config.lives){
            assert(await evaluate('!!document.querySelector(".dream-place[open]")'));
            if(config.integration)assert((await evaluate('document.querySelector(".dream-place[open]").innerText')).includes('时间 '));
            if(life.name==='第一栏·直路'){
              const before=await evaluate(read+'.draft');
              await send('Page.reload',{ignoreCache:true});await wait('!!document.querySelector(".start-panel [data-action=resume]")');
              await tap('.start-panel [data-action=resume]');await wait('!!document.querySelector("[data-action=dream-enter]")');
              assert.deepEqual((await evaluate(read+'.draft')).routeSteps,before.routeSteps);
              await tap('[data-action=dream-enter]');await wait('!!document.querySelector(".dream-place[open]")');
              await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
              assert.equal(await evaluate("getComputedStyle(document.querySelector('.dream-art')).animationName"),'none');
              await send('Emulation.setEmulatedMedia',{features:[]});
            }
          }
          await portrait(life.name);
          await evaluate('document.querySelector(".chapter-station").scrollIntoView({block:"center"})');
          const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,life.name+'.png'),Buffer.from(shot.data,'base64'));
        }
        if(instruction&&await evaluate('!!document.querySelector(".dream-place[open]")'))await evaluate('document.querySelector("[data-action=dream-back]").click()');
        await evaluate('('+playPage.toString()+')('+JSON.stringify(choices)+')');
        if(config.integration&&instruction==='J04/endfood'){
          assert(await evaluate('!!document.querySelector(".closing-clip")'));
          const image=await send('Page.captureScreenshot',{format:'png'});
          fs.writeFileSync(path.join(out,'清算结果.png'),Buffer.from(image.data,'base64'));
        }
        await evaluate('(async()=>{document.querySelector("[data-action=next]").click();await navigator.locks.request(LifeSave.key,()=>{});})()');
        if(config.lives&&await evaluate('!!document.querySelector(".memoir")'))break;
      }catch(e){throw Error(life.name+' slot '+slot+' '+e.message);}
    }
    const actual=await evaluate(read);(config.checkLife??checkLife)(life,actual);
    assert(await evaluate('!!document.querySelector(".memoir")'));
    const row={seed:actual.seed,birth:actual.birth,ending:actual.memo.title,
      facts:actual.facts.map(f=>({slot:f.slot,age:f.age,eventId:f.eventId,choiceId:f.choiceId,career:f.careerAfter,
        actions:f.actions,pay:f.pay,rent:f.rent,inspected:f.inspected,highlights:f.highlights})),
      opportunities:actual.facts.filter(f=>f.actions).map(f=>({slot:f.slot,offers:f.routeOffers?.filter(o=>o.status==='resolved'||o.continuedFrom)})),
      dreams:LifeRoutes.dreams(actual)};
    if(config.integration){
      row.menus=menus;
      row.memo={kind:actual.memo.kind,summary:actual.memo.summary,age:actual.memo.age,line:actual.memo.line,token:actual.memo.token};
      if(life.decline)assert(actual.facts[life.slot-1].routeOffers.some(o=>o.key===life.decline&&o.status==='declined'));
      for(const dream of Object.values(row.dreams))assert((await evaluate('document.querySelector(".memoir").innerText')).includes(dream.goal));
      row.opportunities=actual.facts.filter(f=>f.routeOffers?.length).map(f=>({slot:f.slot,offers:f.routeOffers}));
      actual.facts.forEach((f,i)=>Object.assign(row.facts[i],{people:f.people,items:f.items,relations:f.relations,echoes:f.echoes,careerBefore:f.careerBefore,trace:f.trace}));
    }
    evidence.push({name:life.name,...row});
    console.log('PASS',life.name,row.seed,row.birth,row.ending);
  }
  assert.deepEqual(faults,[]);assert.deepEqual(remoteRequests,[]);
  const json=config.integration?'[\n'+evidence.map(life=>JSON.stringify(life)).join(',\n')+'\n]':JSON.stringify(evidence,null,2);
  fs.writeFileSync(path.join(out,config.evidence??'../causal-evidence.generated.json'),json+'\n');
};
