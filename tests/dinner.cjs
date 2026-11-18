'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
for(const name of ['content','engine','interaction','guidance','save']) require('../'+name+'.js');
const E=LifeEngine,I=LifeInteraction;
function dinner(choices=[0,0,1]){
  const run=E.create(1,{talent:null});
  // Force the repair variant when the fixture requests the repair story.
  run.birth='craft-child';
  for(const index of choices){
    run.entered=true;
    run.draft.main=E.currentCard(run).choices[index].id;
    assert(E.commit(run)&&E.advance(run));
  }
  assert.equal(run.eventId,'life-4');
  return run;
}
function open(run){
  // T4 saves predate the scene variant field. Leave it out to replay their original rules.
  run.draft.interaction={eventId:'life-4',interactionId:'dinner',opened:false,reviewed:false,actions:[]};
  assert(I.update(run,'dinner','open'));
  return run;
}
const act=(run,id)=>I.update(run,'dinner','act',id);
function restore(run){
  const data=LifeSave.fresh();
  data.branches.local={tree:'tree',run};
  data.trees.tree={birth:run.birth};
  data.active='local';
  const items=new Map();
  const storage={getItem:key=>items.get(key),setItem:(key,value)=>items.set(key,value)};
  LifeSave.write(storage,data);
  const loaded=LifeSave.read(storage);
  assert(LifeSave.validateImport(loaded));
  return loaded.branches.local.run;
}
function finish(run,choose){
  if(I.preview(run).phase!=='ready') assert(act(run,'finish'));
  assert(I.confirm(run,'dinner'));
  assert.equal(run.facts.length,4);
  assert.equal(run.result.fact.choiceId,choose);
  assert.equal(I.confirm(run,'dinner'),false);
  assert.equal(E.commit(run),false);
  return run.result.fact;
}

test('listen, reload, cite real stories with distinct witness-aware responses, settle once',()=>{
  let run=restore(open(dinner()));
  const stats=E.copy(run.stats);
  assert.equal(LifeGuidance.describe(I.preview(run),{elapsed:0}).recommendedObjectIds[0],'parent');
  assert.equal(act(run,'story-3'),false);
  assert(act(run,'listen'));
  run=restore(run);
  assert.match(I.preview(run).feedback,/放学/);
  assert.equal(act(run,'story-99'),false);
  assert(act(run,'story-2'));
  run=restore(run);
  assert.match(I.preview(run).feedback,/还记得.*螺丝/);
  assert(act(run,'story-3'));
  run=restore(run);
  assert.match(I.preview(run).feedback,/书签/);
  assert.deepEqual(run.stats,stats);
  assert.equal(run.facts.length,3);
  const fact=finish(run,'life-4-story');
  assert.deepEqual(fact.sourceSlots,[2,3]);
  assert.deepEqual(fact.people,['parent']);
  assert.equal(fact.interaction.npcId,'parent');
  assert.deepEqual(fact.interaction.steps.filter(step=>step.sourceSlot).map(step=>step.witnessed),[true,false]);
  assert.match(fact.text,/螺丝.*书签/);
  run=restore(run);
  assert.equal(I.preview(run).phase,'resolved');
  assert(E.advance(run));
  assert.equal(run.slot,5);
  assert(!run.draft.interaction);
});

test('free exploration, one beat, helping, humor and quiet have distinct outcomes',()=>{
  for(const [actions,choice,changes] of [
    [['turn'],'life-4-turn',{family:2}],
    [['serve'],'life-4-1',{family:5,mood:2}],
    [['listen','humor'],'life-4-humor',{mood:2}],
    [['listen','ask'],'life-4-ask',{family:1}],
    [['listen','reply'],'life-4-reply',{social:1}],
    [[], 'life-4-quiet',{}]
  ]){
    const run=open(dinner([1,1,2]));
    for(const id of actions) assert(act(run,id));
    assert(I.preview(run).allowed.every(action=>!action.sourceSlot));
    finish(run,choice);
    assert.deepEqual(run.result.deltas,changes);
  }
});

test('three beats end the scene and replay rejects post-ending actions',()=>{
  const run=open(dinner());
  for(const id of ['listen','turn','serve','humor']) assert(act(run,id));
  assert.equal(I.preview(run).phase,'ready');
  assert.deepEqual(I.preview(run).allowed,[]);
  assert.equal(act(run,'finish'),false);
  const forged=E.copy(run);
  forged.draft.interaction.actions.push('finish');
  assert.equal(I.preview(forged),null);
  finish(run,'life-4-humor');
});

test('lost objects cannot appear, but a true memory still can',()=>{
  const run=dinner();
  run.items.lamp.state='discarded';
  open(run);
  assert(!Object.values(E.currentCard(run).interaction.objects).some(object=>object.itemId==='lamp'));
  assert(act(run,'listen'));
  assert(act(run,'story-2'));
  assert.deepEqual(finish(run,'life-4-story').sourceSlots,[2]);
});

test('legacy choice IDs, suspended and resolved saves, later duel, memoir and branch history',()=>{
  const old=dinner(), choices=LifeContent.cards.find(card=>card.id==='life-4').choices;
  assert.deepEqual(E.currentCard(old).choices.slice(0,3),choices);
  assert.deepEqual(choices.map(c=>c.label),['讲纸飞机落到哪儿了','先把饭盛给家人','给没赶回来的人留一份']);
  old.activity={kind:'duel',seed:1,step:0,rounds:['listen']};
  let legacy=restore(old);
  assert(!E.currentCard(legacy).interaction);
  assert(E.activityMove(legacy,'leave'));
  legacy=restore(legacy);
  legacy.draft.main=choices[2].id;
  assert(E.commit(legacy));
  legacy=restore(legacy);
  assert.deepEqual(legacy.result.fact.table,['listen','leave']);
  assert.equal(E.commit(legacy),false);
  assert(E.advance(legacy));

  const run=open(dinner());
  assert(act(run,'listen')&&act(run,'story-3'));
  const recorded=finish(run,'life-4-story');
  while(run.stage!=='memoir'){
    assert(E.advance(run));
    if(run.stage==='memoir') break;
    if(run.slot===29){
      assert(E.beginActivity(run,'duel'));
      assert(E.activityMove(run,'leave'));
    }
    run.entered=true;
    const card=E.currentCard(run);
    run.draft.main=card.choices[run.slot===14?1:0].id;
    if(LifeContent.familySlots.includes(run.slot)) run.draft.parent=2;
    assert(E.commit(run),card.id);
  }
  assert.deepEqual(run.memo.timeline.find(fact=>fact.slot===4),recorded);
  const branch=E.fork(run,run.memo.forks[0].slot);
  assert.deepEqual(branch.facts.find(fact=>fact.slot===4),recorded);
  assert.equal(branch.facts.filter(fact=>fact.slot===4).length,1);
});
