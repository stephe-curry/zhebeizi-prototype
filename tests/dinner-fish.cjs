'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
for (const name of ['content','engine','interaction','guidance','save']) require('../'+name+'.js');
const E=LifeEngine, I=LifeInteraction, G=LifeGuidance;

function dinner(birth='craft-child') {
  const run=E.create(1);
  run.birth=birth;
  while (run.slot<4) {
    run.entered=true;
    run.draft.main=E.currentCard(run).choices[0].id;
    assert(E.commit(run)&&E.advance(run));
  }
  assert.equal(E.age(run),12);
  assert.equal(E.currentCard(run).title,'最后一块鱼');
  return run;
}

function open(run) {
  assert(I.create(run,'fish-test'));
  assert(I.update(run,'fish-test','open'));
  assert.equal(run.draft.interaction.variant,'last-fish');
  return run;
}

const act=(run,id)=>I.update(run,'fish-test','act',id);

function restore(run) {
  const value=LifeSave.fresh();
  value.trees.tree={birth:run.birth};
  value.branches.branch={tree:'tree',run};
  value.active='branch';
  const data=new Map();
  const storage={getItem:key=>data.get(key),setItem:(key,json)=>data.set(key,json)};
  LifeSave.write(storage,value);
  const saved=LifeSave.read(storage);
  assert(LifeSave.validateImport(saved));
  return saved.branches.branch.run;
}

for (const [label,opening,decision,tag,balance] of [
  ['directly save the fish','select-fish','save-fish','fish-saved-for-family','reserve-bowl'],
  ['directly eat the fish','select-fish','eat-fish','last-fish-eaten','own-bowl'],
  ['ask first and save the fish','ask-family','save-fish','fish-saved-for-family','reserve-bowl'],
  ['ask first and eat the fish','ask-family','eat-fish','last-fish-eaten','own-bowl'],
  ['keep eating quietly',null,'keep-eating','fish-left-on-plate','fish']
]) {
  test(label,()=>{
    let run=restore(open(dinner()));
    const originalStats=E.copy(run.stats);
    const originalFacts=E.copy(run.facts);
    for (const invalid of ['turn','serve','finish','save-fish','eat-fish','invent-fish']) assert.equal(act(run,invalid),false);
    assert(!E.canApply(run));
    if (opening) {
      if (opening==='ask-family') assert.deepEqual(G.describe(I.preview(run),{elapsed:0}).recommendedObjectIds,['fish']);
      assert(act(run,opening));
      assert.equal(act(run,opening),false);
      run=restore(run);
      assert.deepEqual(I.preview(run).performed,[opening]);
      if (opening==='ask-family') assert.match(I.preview(run).feedback,/在外面吃过了/);
    }
    assert.deepEqual(run.facts,originalFacts);
    assert.deepEqual(run.stats,originalStats);
    assert(act(run,decision));
    const ready=I.preview(run);
    assert.equal(ready.phase,'ready');
    assert.deepEqual(ready.allowed,[]);
    assert.equal(ready.balances[balance],1);
    assert.equal(act(run,decision),false);
    assert(I.confirm(run,'fish-test'));
    const fact=run.result.fact;
    assert.equal(fact.choiceId,'life-4-'+decision);
    assert.equal(fact.interaction.decisionId,decision);
    assert.deepEqual(fact.interaction.performed,[opening,decision].filter(Boolean));
    assert.deepEqual(fact.interaction.tags,['last-fish',tag]);
    assert.equal(fact.interaction.npcId,'parent');
    assert.deepEqual(fact.people,['parent']);
    assert.equal(fact.interaction.recipientId,decision==='save-fish'?'dinner-late-family':null);
    assert(fact.text.includes(fact.interaction.outcome));
    assert.deepEqual(run.stats,originalStats);
    assert.equal(I.confirm(run,'fish-test'),false);
    run=restore(run);
    const result=I.preview(run);
    assert.equal(result.phase,'resolved');
    assert.deepEqual(G.describe(result,{elapsed:18000,manual:true}).recommendedObjectIds,[]);
    assert.equal(G.describe(result,{elapsed:18000,manual:true}).hintText,'');
    assert.equal(E.commit(run),false);
    assert.equal(run.facts.filter(item=>item.slot===4).length,1);
    assert(E.advance(run));
    assert.equal(run.slot,5);
  });
}

test('guidance starts on the fish and offers both bowls after selection',()=>{
  const run=open(dinner()), clock=G.clock();
  const describe=now=>{
    const view=I.preview(run);
    return G.describe(view,clock.sample(view,now,true));
  };
  let guide=describe(0);
  assert.equal(guide.goalText,'最后一块鱼，你想怎么处理？');
  assert.deepEqual(guide.recommendedObjectIds,['fish']);
  assert.equal(describe(7999).hintLevel,0);
  assert.equal(describe(8000).hintLevel,1);
  assert.equal(describe(17999).hintText,'');
  assert.equal(describe(18000).hintText,'点一下鱼盘，可以决定留给谁；也可以先问问家人。');
  assert(act(run,'select-fish'));
  guide=describe(18001);
  assert.equal(guide.hintLevel,0);
  assert.deepEqual(guide.recommendedObjectIds,['reserve-bowl','own-bowl']);
  assert.equal(guide.goalText,'可以点空碗留给晚归的人，也可以点自己的碗。');
  clock.help();
  assert.equal(describe(18002).hintText,guide.goalText);
});

test('family state controls guests and the meaning of the reserve bowl',()=>{
  const ordinary=dinner();
  assert(E.currentCard(ordinary).interaction.gathering);
  const elder=dinner('grandma');
  assert(E.currentCard(elder).interaction.elder);
  assert(!E.currentCard(elder).interaction.gathering);
  open(elder);
  assert(act(elder,'ask-family'));
  assert.match(I.preview(elder).feedback,/外婆.*明早配粥/);
  assert(act(elder,'save-fish')&&I.confirm(elder,'fish-test'));
  assert(elder.result.fact.interaction.tags.includes('fish-saved-for-later'));
  assert.equal(elder.result.fact.interaction.recipientId,null);
  const absent=dinner('grandma');
  absent.people.parent.status='dead';
  open(absent);
  assert.equal(E.currentCard(absent).interaction.npcId,null);
  assert.equal(act(absent,'ask-family'),false);
  assert(act(absent,'select-fish')&&act(absent,'save-fish')&&I.confirm(absent,'fish-test'));
  assert.deepEqual(absent.result.fact.people,[]);
  assert.doesNotMatch(absent.result.fact.text,/晚归|外婆/);
});
