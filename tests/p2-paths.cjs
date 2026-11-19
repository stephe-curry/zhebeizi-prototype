'use strict';
const assert=require('node:assert/strict');
for(const file of ['content','interaction','engine','save'])require('../'+file+'.js');
const C=LifeContent,E=LifeEngine,I=LifeInteraction;

function settle(run,id){
  let card=E.currentCard(run);
  const pick=E.hash(run.seed,run.slot,'audit');
  const legacy=card.id==='life-4' && id && !['life-4-save-fish','life-4-eat-fish','life-4-keep-eating'].includes(id);
  if(legacy && /-\d$/.test(id)){run.draft.main=id;card=E.currentCard(run);}
  if(card.interaction){
    const key='walk';
    if(legacy)run.draft.interaction={eventId:card.id,interactionId:key,opened:false,reviewed:false,actions:[]};
    else assert(I.create(run,key));
    assert(I.update(run,key,'open'));
    card=E.currentCard(run);
    let moves=[];
    if(id){
      const suffix=id.slice(card.id.length+1);
      if(card.id==='school-yoyo')moves=['see-price','go-home',card.interaction.homeBeat.action,suffix];
      if(card.id==='spring-envelope')moves=[suffix];
      if(card.id==='life-3')moves=[['yuanA-blocks','yuanB-blocks'],['yuanA-ice','yuanB-purse'],['leave-shop']][Number(suffix)];
      if(card.id==='life-4'){
        if(legacy){
          const beat=suffix==='story'?card.interaction.actions.find(a=>a.actionId.startsWith('story-'))?.actionId:suffix;
          moves=suffix==='quiet'?['finish']:['turn','serve'].includes(beat)?[beat,'finish']:['listen',beat,'finish'];
        }else moves=suffix==='keep-eating'?[suffix]:['select-fish',suffix];
      }
    }
    for(let i=0;I.preview(run).phase!=='ready';i++){
      assert(i<18,card.id);
      const v=I.preview(run);
      if(v.phase==='preview'){assert(I.update(run,key,'review'));continue;}
      const action=moves.shift()??(v.allowed.find(a=>['leave-shop','keep-eating'].includes(a.actionId))??v.allowed[pick%v.allowed.length]).actionId;
      assert(I.update(run,key,'act',action),card.id+' '+action);
    }
  }else{
    run.entered=true;run.draft.main=id??card.choices[pick%card.choices.length].id;
  }
  if(C.familySlots.includes(run.slot))run.draft.parent=pick%3;
  assert(E.commit(run),card.id);
  assert(!E.commit(run));
  const fact=run.facts.at(-1);
  if(id)assert.equal(fact.choiceId,id);
  return fact;
}
function reach(seed,slot,choose){
  const run=E.create(seed,seed%2?{childhood:'spring-gift'}:{});
  run.branchId='walk';
  while(run.slot<slot && !run.memo){settle(run,choose?.(run));assert(E.advance(run));}
  return run;
}

function prefixes(){
  const cards=new Map(),choices=new Map();
  function record(run){
    const card=E.currentCard(run);
    const unseen=card.choices.filter(c=>!choices.has(c.id));
    if(!unseen.length && cards.has(card.id))return;
    const snapshot=E.copy(run);
    if(!cards.has(card.id))cards.set(card.id,snapshot);
    for(const choice of unseen)choices.set(choice.id,snapshot);
  }
  for(let seed=1;seed<=480;seed++){
    const run=reach(seed,1);
    while(!run.memo){
      record(run);
      for(const id of run.pageTrace?.menu??[]){
        if(cards.has(id))continue;
        const branch=E.copy(run);assert(E.chooseAppointment(branch,id));record(branch);
      }
      settle(run);assert(E.advance(run));
    }
    if(cards.size===C.cards.length && choices.has('life-6-yoyo') && choices.has('life-6-shuttlecocks'))break;
  }
  return {cards,choices};
}
module.exports={settle,reach,prefixes};

function extraResponses(){
  const {cards}=prefixes(),witnesses=[];
  for(const card of ['office-24','factory-24','delivery-24']){
    const sample=LifeContent.sampleTasks[card],r=E.copy(cards.get(card));
    assert(E.inspectSample(r,sample.correct));settle(r,card+'-0');
    for(E.advance(r);r.slot<39;E.advance(r))settle(r,r.eventId==='indie-rights'?'indie-rights-2':undefined);
    witnesses.push([r,'handover-'+sample.id]);
  }
  for(let i=0;i<3;i++){
    // Choose a legal non-terminal life after the 35-year decision.
    for(let seed=1;seed<100;seed++){
      const run=reach(seed,40);if(run.eventId!=='life-40')continue;
      const id='life-40-'+i;settle(run,id);E.advance(run);
      run.draft.followup='again-'+id;settle(run);E.advance(run);
      while(run.slot<45&&!run.memo){settle(run);E.advance(run);}
      if(run.slot===45){witnesses.push([run,'later-'+id]);break;}
    }
  }
  assert.equal(witnesses.length,6);
  return witnesses;
}
module.exports.extraResponses=extraResponses;
