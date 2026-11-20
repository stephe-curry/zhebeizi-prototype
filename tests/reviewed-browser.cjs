'use strict';
const assert=require('node:assert/strict');
const {settle}=require('./p2-paths.cjs');

module.exports=async function({load,resize,send,evaluate,wait,tap,portrait,faults}){
  await resize(320,568,true);
  await load();
  const run=LifeEngine.create(1,{childhood:'spring-gift',reviewedVersion:1});
  while(run.slot<5){settle(run);LifeEngine.advance(run);}
  settle(run);LifeEngine.advance(run);
  const save=LifeSave.fresh();
  save.active='walk';save.trees.t={birth:run.birth};save.branches.walk={tree:'t',run};
  await evaluate('localStorage.setItem(LifeSave.key,'+JSON.stringify(JSON.stringify(save))+')');
  const reload=async()=>{
    await send('Page.reload',{ignoreCache:true});
    await wait('!!document.querySelector(".start-panel [data-action=resume]")');
    await tap('.start-panel [data-action=resume]');
  };
  await reload();
  for(const [eventId,id] of [['P-S01','B'],['P-E01','C'],['P-S02','A']]){
    const scene=LifeApprovedText[eventId];
    await wait('!!document.querySelector("[data-action=reviewed-choice]")');
    const getText=()=>evaluate('Array.from(document.querySelectorAll("main .event-panel p"),p=>p.textContent)');
    assert.deepEqual(await getText(),scene.body);
    assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("[data-action=reviewed-choice]"),b=>b.textContent)'),Object.values(scene.choices).map(c=>c.label));
    const query='[data-id="'+[eventId,scene.variantId,id].join('/')+'"]';
    await evaluate('document.querySelector('+JSON.stringify(query)+').scrollIntoView({block:"center"})');
    await tap(query);
    await wait('!!document.querySelector("[data-action=reviewed-next]")');
    if(eventId==='P-S01'){
      const chart=await evaluate('getComputedStyle(document.querySelector(".seat-chart")).animationDuration');
      assert.equal(chart,'1.51s');
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".seat-chart")).animationName'),'none');
    }
    if(eventId==='P-E01')await reload();
    await wait('!!document.querySelector("[data-action=reviewed-next]")');
    assert.deepEqual(await getText(),[...scene.choices[id].reply,...scene.closing]);
    await portrait(eventId);
    await evaluate('document.querySelector("[data-action=reviewed-next]").scrollIntoView({block:"center"})');
    await tap('[data-action=reviewed-next]');
  }
  await wait('!document.querySelector("[data-action=reviewed-next],[data-action=reviewed-choice]")');
  assert.deepEqual(faults,[]);
  console.log('PASS reviewed text, touch, reload, 320x568');
};
