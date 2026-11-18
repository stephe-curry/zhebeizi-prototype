'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
for(const file of ['content','engine','interaction','guidance','shop','save']) require('../'+file+'.js');
const E=LifeEngine,I=LifeInteraction;
function start(){
  const run=E.create(1);
  while(run.slot<3){
    run.entered=true;
    run.draft.main=E.currentCard(run).choices[0].id;
    assert(E.commit(run)&&E.advance(run));
  }
  assert(I.create(run,'shop')&&I.update(run,'shop','open'));
  return run;
}
for(const [label,targets,leave,choice,retained] of [
  ['ice and automatic change',['ice'],false,'life-3-1',1],
  ['ice and explicit change',['ice','purse'],false,'life-3-1',1],
  ['explicit change then ice',['purse','ice'],false,'life-3-1',1],
  ['blocks',['blocks','blocks'],false,'life-3-0',0],
  ['leave immediately',[],true,'life-3-2',2],
  ['leave with partial reservation',['blocks'],true,'life-3-2',2],
  ['leave with one coin saved',['purse'],true,'life-3-2',2],
  ['both coins explicitly saved',['purse','purse'],false,'life-3-2',2]
]){
  test(label,()=>{
    const run=start(), originalStats=E.copy(run.stats);
    targets.forEach((target,i)=>{
      assert(LifeShop.input(run,target,LifeShop.coins[i]));
      assert.equal(LifeShop.input(run,target,LifeShop.coins[i]),false);
      assert.equal(Object.values(I.preview(run).balances).reduce((a,b)=>a+b),2);
    });
    if(leave) assert(LifeShop.leave(run));
    const view=I.preview(run);
    assert.equal(view.phase,'ready');
    assert.equal(view.choiceId,choice);
    const help=LifeGuidance.describe(view,{manual:true});
    assert.match(help.hintText,/确认安排/);
    assert.deepEqual(help.recommendedObjectIds,[]);
    const restored=JSON.parse(JSON.stringify(run));
    assert.deepEqual(I.preview(restored),view);
    assert.deepEqual(restored.stats,originalStats);
    assert.equal(restored.facts.length,2);
    assert(I.confirm(restored,'shop'));
    const fact=restored.result.fact;
    assert.equal(fact.choiceId,choice);
    assert.deepEqual(fact.interaction.balances,{yuanA:0,yuanB:0,blocks:choice==='life-3-0'?2:0,ice:choice==='life-3-1'?1:0,purse:retained});
    assert.equal(restored.facts.length,3);
    const settled=JSON.stringify(restored);
    assert.equal(I.confirm(restored,'shop'),false);
    assert.equal(E.commit(restored),false);
    assert.equal(JSON.stringify(restored),settled);
  });
}
test('undo a purchase and choose another item',()=>{
  const run=start();
  assert(LifeShop.input(run,'ice','yuanA'));
  assert(I.update(run,'shop','undo'));
  assert.deepEqual(I.preview(run).balances,{yuanA:1,yuanB:1,blocks:0,ice:0,purse:0});
  assert(LifeShop.input(run,'blocks','yuanA'));
  assert.equal(E.commit(run),false);
  assert(LifeShop.input(run,'blocks','yuanB'));
  assert.equal(I.preview(run).choiceId,'life-3-0');
});
test('the other 98 cards still settle through their existing choice',()=>{
  const history=E.create(1);
  const otherCards=LifeContent.cards.filter(card=>card.id!=='life-3');
  assert.equal(otherCards.length,98);
  function choose(run){
    run.entered=true;
    run.draft.main=E.currentCard(run).choices[0].id;
    if(LifeContent.familySlots.includes(run.slot)) run.draft.parent=0;
    assert(E.commit(run),run.eventId);
  }
  while(history.stage==='event'){
    for(const card of otherCards.filter(card=>card.slot===history.slot)){
      const run=E.copy(history);
      run.eventId=card.id;
      if(card.rule==='recover') run.low={type:'delivery',slot:run.slot-1,status:'active'};
      choose(run);
      assert.equal(run.result.fact.eventId,card.id);
      assert.equal(E.commit(run),false);
    }
    choose(history);
    assert(E.advance(history));
  }
  assert.equal(history.slot,46);
});
