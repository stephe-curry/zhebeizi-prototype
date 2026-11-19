'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {prefixes,reach}=require('./p2-paths.cjs');
const out=process.env.LIFE_P2_EVIDENCE??path.resolve(__dirname,'../docs/v1.4/p2');

// Executed inside the page; every mutation enters the production DOM handler.
async function playPage(options){
  const read=()=>{const d=LifeSave.read(localStorage);return d.branches[d.active].run;};
  const find=(a,id)=>document.querySelector('[data-action="'+a+'"]'+(id==null?'':'[data-id="'+id+'"]')+':not(:disabled)');
  async function click(a,id){
    const el=find(a,id);if(!el)throw Error(read().eventId+' missing '+a+'/'+id);
    el.scrollIntoView({block:'center'});el.click();
    await navigator.locks.request(LifeSave.key,()=>{});
  }
  let run=read();
  if(options.readSlot){
    const detail=document.querySelector('[data-scene-source="'+options.readSlot+'"]');
    if(!detail)throw Error('missing scene detail '+run.eventId);
    detail.scrollIntoView({block:'center'});
    for(let i=0;i<45 && !read().pageTrace?.detailsSeen?.includes(options.readSlot);i++)await new Promise(r=>setTimeout(r,20));
    if(!read().pageTrace?.detailsSeen?.includes(options.readSlot))throw Error('not visible '+run.eventId);
  }
  if(options.appointment)await click('appointment',options.appointment);
  run=read();const event=LifeEngine.currentCard(run),pick=LifeEngine.hash(run.seed,run.slot,'audit');
  if(event.interaction){
    if(event.id==='spring-envelope')await click('gift-act',options.place??'box');
    else if(event.id==='school-yoyo'){
      for(const id of ['see-price','go-home',event.interaction.homeBeat.action,options.buy??'buy'])await click('gift-act',id);
    }else if(event.id==='life-3')await click('shop-leave');
    else await click('dinner-act','keep-eating');
  }else{
    if(find('enter') && !run.entered)await click('enter');
    if(options.followup)await click('followup',options.followup);
    if(options.inspect!=null){
      await click('inspect-sample',1-options.inspect);if(read().draft.inspection!=='retry')throw Error('missing retry');
      await click('inspect-sample',options.inspect);if(read().draft.inspection!=='matched')throw Error('missing inspection');
    }
    const id=options.id??event.choices[pick%event.choices.length].id;
    if(find('parent'))await click('parent',pick%3);
    if(find('choose',id))await click('choose',id);
    else {await click('touch-object',id);await click('do-object',id);}
    if(read().stage==='event')await click('commit',event.id);
  }
  run=read();
  if(run.stage!=='result'||run.facts.length!==run.slot)throw Error(event.id+' incomplete');
  const f=run.facts.at(-1);
  return {slot:f.slot,event:f.eventId,id:f.choiceId,followup:f.followup?.id,inspected:f.inspected,
    seen:f.trace.candidates.filter(e=>e.seen).map(e=>({id:e.id,status:e.status,reason:e.reason})),
    low:run.low?.status,job:run.career,source:f.sourceSlots,highlights:f.highlights};
}

module.exports=async function({load,resize,send,evaluate,wait,tap,portrait,faults,remoteRequests}){
  const {cards}=prefixes(),scenes=[],routes=[],screens=[],responses=[],details=[];
  await resize(320,568,true);await load();
  const button=(a,id)=>'[data-action="'+a+'"]'+(id?'[data-id="'+id+'"]':'');
  async function reload(){
    await send('Page.reload',{ignoreCache:true});await wait('!!document.querySelector(".start-panel [data-action=resume]")');
    await tap('.start-panel '+button('resume'));await wait('!!document.querySelector("main.play")');
  }
  async function restore(run){
    const save=LifeSave.fresh();save.revision='p2';save.active='walk';save.trees.tree={birth:run.birth,reward:false};
    save.branches.walk={tree:'tree',run};
    assert(LifeSave.validateImport(save));
    await evaluate('localStorage.setItem(LifeSave.key,'+JSON.stringify(JSON.stringify(save))+')');
    await reload();
  }
  async function shot(name,selector){
    await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"center"})');
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(path.join(out,'screens',name+'.png'),Buffer.from(data,'base64'));screens.push(name);
  }
  async function scene(options={}){
    return evaluate('('+playPage.toString()+')('+JSON.stringify(options)+')');
  }
  async function next(){
    await evaluate('(async()=>{document.querySelector("[data-action=next]").click();await navigator.locks.request(LifeSave.key,()=>{});})()');
  }
  // From the actual new-life button through every slot and the ordinary memoir.
  await evaluate('(()=>{const original=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{original(a);a[0]=1;delete crypto.getRandomValues;return a;};})()');
  await tap('.start-panel '+button('setup'));await wait('!!document.querySelector("[data-action=birth]")');
  await tap(button('birth'));await wait('!!document.querySelector(".gift-panel")');
  const life=[];
  for(let slot=1;slot<=46;slot++){
    const options={};
    if(slot===14)options.id='life-14-2';
    if(slot===15)options.followup='again-life-14-2';
    if(slot===23)options.id=await evaluate('LifeEngine.currentCard((d=>d.branches[d.active].run)(LifeSave.read(localStorage))).choices.find(c=>c.commands.includes("job:office")).id');
    if(slot===24){options.id='office-24-0';options.inspect=1;}
    if(slot===38 && life[35]?.event==='office-pivot')options.id='active-recovery-wait';
    if(slot===40)options.id='life-40-1';
    const row=await scene(options);life.push(row);await next();
    if(await evaluate('!!document.querySelector(".memoir")'))break;
  }
  assert.equal(life.at(-1).slot,46);
  assert(life.some(x=>x.event==='late-recovery'));assert(life.some(x=>x.job==='dispatcher'));
  routes.push(life);
  await tap(button('memo','3'));await wait('!!document.querySelector("[data-action=fork-preview]")');
  await tap(button('fork-preview'));await wait('!!document.querySelector("dialog [data-action=fork]")');
  await tap('dialog '+button('fork'));await wait('!!document.querySelector("main.play")');
  await scene();assert(await evaluate('(()=>{const d=LifeSave.read(localStorage),b=d.branches[d.active];return !!b.parent && !!d.branches[b.parent].run.memo && b.run.facts.at(-1).branch===d.active})()'));

  for(const [id,run] of cards){
    const c=LifeContent.cards.find(c=>c.id===id);
    if(c.grade==='B')continue;
    await restore(run);
    await portrait(id);
    const checks={'factory-24':0,'office-24':1,'delivery-24':1,'life-14':1,'arena-final':0,'indie-launch':1};
    if(checks[id]!=null && c.slot===24){
      await shot('shift-'+id,'.sample-desk');
    }
    const picked=c.childhoodGift||c.id==='life-4'||c.id==='life-3'?{}:{id:c.choices[0].id};
    scenes.push(await scene({...picked,inspect:checks[id]}));
    if(checks[id]!=null && c.slot===24)await shot('checked-'+id,'.event-panel .shift-clip.played');
  }
  const offers=[],notes=[];
  require('./p2-evidence.cjs').verify((r,a)=>offers.push([LifeEngine.copy(r),a.id]),
    (r,d)=>notes.push([LifeEngine.copy(r),d.sourceSlot]));
  offers.push(...require('./p2-paths.cjs').extraResponses());
  for(const [run,id] of offers){
    await restore(run);
    const result=await scene({followup:id});
    assert.equal(result.followup,id);
    responses.push(result);
  }
  for(const [run,slot] of notes){
    await restore(run);
    const result=await scene({readSlot:slot});
    assert(result.source.includes(slot));details.push({slot:result.slot,source:slot,event:result.event,choice:run.facts.find(f=>f.slot===slot).choiceId});
  }
  for(const [seed,slot,appointment,index] of [[425,39,'indie-launch',0],[425,39,'indie-launch',1],[425,39,'arena-final',2],[474,45,'office-45',0],[465,37,'delivery-37',0],[473,45,'factory-45',0]]){
    await restore(reach(seed,slot));if(!screens.includes('collision-'+seed))await shot('collision-'+seed,'.appointment');
    if(appointment!==reach(seed,slot).eventId)await tap(button('appointment',appointment));
    await wait('document.querySelector(".appointment [aria-pressed=true]").dataset.id==='+JSON.stringify(appointment));
    const row=await scene({id:appointment+'-'+index});assert.equal(row.event,appointment);
    const route=[row];await next();
    if(slot===45){
      await tap('.turn-footer '+button('enter'));await wait('!!document.querySelector("[data-action=followup][data-id=again-indie-memory]")');
      await tap(button('followup','again-indie-memory'));
      await wait('!!document.querySelector(".stamp-play")');
      if(seed===474)await shot('old-build-at-72','.stamp-play');
      await reload();await wait('!!document.querySelector(".stamp-play")');
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".stamp-play")).animationName'),'none');
      const last=await scene({id:'life-46-1'});assert.equal(last.followup,'again-indie-memory');route.push(last);
      await next();await wait('!!document.querySelector(".memoir")');
    }
    routes.push(route);
  }
  assert.deepEqual(faults,[]);assert.deepEqual(remoteRequests,[]);
  const proof={screens,scenes,routes,responses,details};
  fs.writeFileSync(path.join(out,'chrome.generated.json'),JSON.stringify(proof,null,2)+'\n');
  console.log('PASS · '+scenes.length+' S/A scenes, '+responses.length+' playable callbacks, '+details.length+' visible readings, full life, recovery, fork and collision routes.');
};

module.exports.playPage=playPage;
