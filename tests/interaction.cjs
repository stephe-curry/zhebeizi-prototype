'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
require('../content.js');
require('../interaction.js');
require('../engine.js');
require('../save.js');
const {LifeContent:C, LifeEngine:E, LifeInteraction:I, LifeSave:S} = globalThis;

// Test-only cards. The shipped content table and its historical IDs stay intact.
function fixture(id, scene) {
  const event = {id,slot:3,title:id,body:'',interaction:scene,choices:['finish','alternate'].map(key => ({
    id:id+'-'+key,label:key,outcome:key,delta:{money:1},commands:[]
  }))};
  C.cards.push(event);
  return event;
}
const coins = fixture('test-coins',{
  sceneId:'counter',situation:'手里有两枚硬币',goal:'安排两枚硬币',
  objects:{purse:{},left:{},right:{},tool:{itemId:'lamp'}},
  balances:{purse:2,left:0,right:0},requiresPreview:true,
  actions:[
    {actionId:'look',kind:'observe',objectId:'purse',feedback:'看到了两枚硬币'},
    {actionId:'allocate-left',kind:'arrange',sourceId:'purse',objectId:'left',transfer:1},
    {actionId:'pass-right',kind:'manipulate',sourceId:'purse',objectId:'right',transfer:1},
    {actionId:'use-tool',kind:'manipulate',sourceId:'tool',objectId:'left'},
    {actionId:'missing-target',kind:'manipulate',sourceId:'purse',objectId:'nowhere'}
  ],
  outcomes:[{balances:{left:2},choiceId:'test-coins-alternate'},
    {balances:{purse:0},choiceId:'test-coins-finish'}]
});
const person = fixture('test-person',{
  sceneId:'conversation',situation:'有人在等回应',goal:'作出回应或自然结束',
  objects:{speaker:{},self:{}},
  actions:[
    {actionId:'watch',kind:'observe',objectId:'speaker'},
    {actionId:'recall',kind:'manipulate',sourceId:'self',objectId:'speaker',
      afterObservation:'speaker',experienceId:'repair',feedback:'说起修灯的事'},
    {actionId:'finish',kind:'arrange',objectId:'self'}
  ],
  outcomes:[{after:'recall',choiceId:'test-person-alternate'},{after:'finish',choiceId:'test-person-finish'}]
});

const instance = 'fixture-session';
function start(event, repair=false) {
  const run = E.create(1);
  // Earn repair through the real choice/command path.
  run.draft.main = 'life-1-2';
  assert(E.commit(run) && E.advance(run));
  run.entered = true;
  run.draft.main = repair ? 'life-2-0' : 'life-2-2';
  assert(E.commit(run) && E.advance(run));
  run.eventId = event.id;
  assert(I.create(run,instance));
  return run;
}
const act = (run,id) => I.update(run,instance,'act',id);
const open = run => I.update(run,instance,'open');
const clone = E.copy;

test('intro, stable IDs, missing and unowned objects, harmless observation',()=>{
  const run=start(coins);
  assert.equal(I.preview(run).phase,'intro');
  assert.equal(act(run,'look'),false);
  assert(open(run));
  assert.equal(I.preview(run).phase,'explore');
  assert.equal(I.update(run,'stale-session','act','look'),false);
  for (const state of ['given','discarded']) {
    run.items.lamp={state};
    const before=clone(run);
    for(const id of ['missing-target','use-tool','purse','test-coins-finish']) assert.equal(act(run,id),false);
    assert.deepEqual(run,before);
  }
  const before=clone(run);
  assert(act(run,'look'));
  assert.deepEqual(run.stats,before.stats);
  assert.deepEqual(run.facts,before.facts);
  assert.deepEqual(I.preview(run).balances,{purse:2,left:0,right:0});
  assert.equal(I.preview(run).feedback,'看到了两枚硬币');
});

test('bounded allocation, pure preview, deterministic undo/rearrange/cancel',()=>{
  const run=start(coins);
  const previous=clone(run);
  open(run);
  assert(act(run,'allocate-left') && act(run,'pass-right'));
  const split=clone(run);
  assert.equal(act(run,'allocate-left'),false);
  assert.equal(E.commit(run),false);
  assert.deepEqual(I.preview(run).balances,{purse:0,left:1,right:1});
  assert.deepEqual(run,split);
  assert(I.update(run,instance,'undo'));
  assert(act(run,'allocate-left'));
  assert.equal(I.preview(run).choiceId,'test-coins-alternate');
  assert.equal(I.preview(run).phase,'preview');
  assert.deepEqual(I.preview(run).balances,{purse:0,left:2,right:0});
  assert(I.update(run,instance,'cancel'));
  assert.deepEqual(run,previous);
  open(run);
  act(run,'allocate-left'); act(run,'pass-right');
  assert.deepEqual(run,split);
});

test('engine is the only commit boundary; confirmed result survives round trip',()=>{
  const run=start(coins);
  open(run);
  run.draft.main='test-coins-alternate';
  assert.equal(E.commit(run),false);
  act(run,'allocate-left'); act(run,'pass-right');
  assert(I.update(run,instance,'review'));
  assert.equal(I.preview(run).phase,'ready');
  const before=clone(run);
  E.preview(run); I.preview(run);
  assert.deepEqual(run,before);
  assert.equal(I.confirm(run,'wrong-instance'),false);
  assert(I.confirm(run,instance));
  assert.equal(run.stats.money,before.stats.money+1);
  assert.equal(run.facts.length,before.facts.length+1);
  assert.equal(run.facts.at(-1).choiceId,'test-coins-finish');
  assert.deepEqual(I.preview(clone(run)).balances,{purse:0,left:1,right:1});
  assert.equal(I.preview(clone(run)).phase,'resolved');
  const done=clone(run);
  assert.equal(I.confirm(run,instance),false);
  assert.equal(E.commit(run),false);
  assert.equal(I.update(run,instance,'undo'),false);
  assert.deepEqual(run,done);
  assert(E.advance(run));
  assert.equal(run.draft.interaction,undefined);
});

test('real experience and observed person gate recall; ordinary exit always works',()=>{
  for (const earned of [true,false]) {
    const run=start(person,earned);
    assert.equal(Object.hasOwn(run.experience,'repair'),earned);
    open(run);
    assert.equal(act(run,'recall'),false);
    const before=clone(run.facts);
    assert(act(run,'watch'));
    assert.equal(act(run,'recall'),earned);
    if (!earned) assert(act(run,'finish'));
    assert.deepEqual(run.facts,before);
    assert(I.confirm(run,instance));
    assert.equal(run.facts.at(-1).choiceId,earned?'test-person-alternate':'test-person-finish');
  }
});

test('isolated storage never reads/writes the old key; reload and import preserve draft',()=>{
  const oldKey='zhebeizi-1.3-workbench';
  const old={...S.fresh(),version:1,points:4};
  delete old.format;
  const bytes=JSON.stringify(old);
  const values=new Map([[oldKey,bytes]]);
  const storage={
    getItem(key){assert.equal(key,'zhebeizi-1.3.2-prototype');return values.get(key) ?? null;},
    setItem(key,value){assert.equal(key,'zhebeizi-1.3.2-prototype');values.set(key,value);}
  };
  const data=S.read(storage) ?? S.fresh();
  assert.deepEqual(data.branches,{});
  assert.equal(data.points,0);
  assert.equal(S.validateImport(old),false);
  assert.throws(()=>S.write(storage,old));
  values.set(S.key,bytes);
  assert.equal(S.read(storage),null);
  const run=start(coins);
  open(run); act(run,'allocate-left');
  data.active='one'; data.trees.tree={birth:run.birth,reward:false};
  data.branches.one={tree:'tree',run};
  S.write(storage,data);
  const loaded=S.read(storage);
  assert(S.validateImport(loaded));
  const invalid=clone(loaded);
  invalid.branches.one.run.draft.interaction.actions.push('unknown');
  assert.equal(S.validateImport(invalid),false);
  const restored=loaded.branches.one.run;
  assert.deepEqual(I.preview(restored),I.preview(run));
  assert.equal(restored.facts.length,2);
  assert(act(restored,'pass-right') && I.update(restored,instance,'review') && I.confirm(restored,instance));
  S.write(storage,loaded);
  assert.deepEqual(S.read(storage).branches.one.run.result.fact.interaction,restored.result.fact.interaction);
  assert.equal(values.get(oldKey),bytes);
});

test('replay rejects stale event IDs and impossible persisted steps',()=>{
  const run=start(coins);
  open(run);
  for (const change of [s=>s.eventId='test-person',s=>s.actions=['unknown'],
    s=>s.actions=Array(3).fill('allocate-left')]) {
    const copy=clone(run);
    change(copy.draft.interaction);
    const before=clone(copy);
    assert.equal(I.preview(copy),null);
    assert.equal(E.commit(copy),false);
    assert.deepEqual(copy,before);
  }
});
