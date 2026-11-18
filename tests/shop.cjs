'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
for(const file of ['content','engine','interaction','shop','save']) require('../'+file+'.js');
const E=LifeEngine,I=LifeInteraction;
for(const [first,second,choice] of [['blocks','blocks','life-3-0'],['ice','purse','life-3-1'],['purse','purse','life-3-2']]){
  test('two coins settle once: '+choice,()=>{
    const run=E.create(1);
    while(run.slot<3){
      run.entered=true;
      run.draft.main=E.currentCard(run).choices[0].id;
      assert(E.commit(run)&&E.advance(run));
    }
    assert(I.create(run,'shop')&&I.update(run,'shop','open'));
    const cash=run.stats.money;
    assert(LifeShop.input(run,first,'yuanA'));
    assert.equal(LifeShop.input(run,second,'yuanA'),false);
    assert.equal(E.commit(run),false);
    assert(I.update(run,'shop','undo'));
    assert.deepEqual(I.preview(run).balances,{yuanA:1,yuanB:1,blocks:0,ice:0,purse:0});
    assert(LifeShop.input(run,first,'yuanA'));
    const restored=E.copy(run);
    assert(LifeShop.input(restored,second,'yuanB'));
    assert.equal(restored.stats.money,cash);
    assert(E.commit(restored));
    assert.equal(restored.result.fact.choiceId,choice);
    assert.equal(restored.facts.length,3);
    assert.equal(E.commit(restored),false);
  });
}
