'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
for(const name of ['content','interaction','engine','save','guidance','shop']) require('../'+name+'.js');
const E=LifeEngine,I=LifeInteraction;

function reload(run){
  const save=LifeSave.fresh();
  save.active='b';
  save.trees.t={birth:run.birth,reward:false};
  save.branches.b={tree:'t',run};
  const loaded=LifeSave.decode(JSON.stringify(save));
  assert(LifeSave.validateImport(loaded));
  return loaded.branches.b.run;
}

function open(run){
  const session=run.eventId;
  assert(I.create(run,session));
  assert(I.update(run,session,'open'));
}
function act(run,id){
  const session=run.eventId;
  if(!run.draft.interaction)open(run);
  assert(I.update(run,session,'act',id));
  run=reload(run);
  assert(I.confirm(run,session));
  assert(!E.commit(run));
  assert(!I.confirm(run,session));
  return reload(run);
}

for(const place of ['box','family','drawer'])for(const id of ['buy','keep']){
  test(place+' then '+id,()=>{
    let run=E.create(place==='family'?2:1,{childhood:'spring-gift'});
    const money=run.stats.money;
    assert.equal(run.eventId,'spring-envelope');
    run=act(run,place);
    const first=run.facts[0];
    assert.equal(first.interaction.balance,10);
    assert.equal(first.interaction.place,place);
    assert.equal(first.interaction.custodian,place==='family'?'外婆':'player');
    assert.equal(first.choiceId,'spring-envelope-'+place);
    assert(E.advance(run));
    assert.equal(run.eventId,'school-yoyo');
    assert.equal(E.currentCard(run).interaction.place,place);
    open(run);
    const homeBeat={box:'open-box',family:'ask-family',drawer:'open-drawer'}[place];
    const prefix=['see-price','go-home',homeBeat];
    for(const step of prefix){
      const view=I.preview(run);
      assert.deepEqual(view.allowed.map(action=>action.actionId),[step]);
      assert.equal(LifeGuidance.describe(view,{manual:true}).recommendedObjectIds[0],step);
      assert(!I.update(run,run.eventId,'act',id));
      assert(!E.commit(run));
      assert(I.update(run,run.eventId,'act',step));
      const staged=I.preview(run);
      run=reload(run);
      assert.deepEqual(I.preview(run),staged);
      assert.equal(run.facts.length,1);
      assert.equal(run.stats.money,money);
      assert(!run.items.yoyo);
    }
    const scene=E.currentCard(run).interaction;
    assert.equal(scene.keeper,first.interaction.custodian);
    if(place==='family'){
      assert.match(scene.homeBeat.request,/能把我的压岁钱拿出来吗/);
      assert.match(scene.homeBeat.line,/外婆给你收着.*你自己拿主意/);
    }
    run=act(run,id);
    const fact=run.facts[1],receipt=fact.interaction,bought=id==='buy';
    assert.deepEqual(fact.sourceSlots,[1]);
    assert.equal(fact.choiceId,'school-yoyo-'+id);
    assert.deepEqual(receipt.performed,[...prefix,id]);
    assert.equal(receipt.retrievedBy,homeBeat);
    assert.equal(receipt.place,place);
    assert.equal(receipt.owner,'player');
    assert.equal(receipt.storedAt,bought?null:place);
    assert.equal(receipt.custodian,bought?null:first.interaction.custodian);
    assert.equal(receipt.sourceCustodian,first.interaction.custodian);
    assert.doesNotMatch(fact.text,/考试|成绩|拒绝/);
    assert.equal(receipt.price,first.interaction.amount);
    assert.equal(receipt.spent,bought?10:0);
    assert.equal(receipt.balance,bought?0:10);
    assert.equal(!!E.held(run.items.yoyo),bought);
    assert.equal(run.stats.money,money);
    assert.equal(run.experience.repair,undefined);
    assert(E.advance(run));
    assert.equal(run.eventId,'life-3');
    run=act(run,'leave-shop');
    assert.equal(run.facts[2].interaction.balances.purse,2);
    assert(E.advance(run));
    assert.equal(E.currentCard(run).interaction.variant,'last-fish');
    run=act(run,'keep-eating');
    while(run.stage!=='memoir'){
      assert(E.advance(run));
      if(run.stage==='memoir')break;
      run.entered=true;
      const card=E.currentCard(run);
      run.draft.main=card.choices[run.slot===11?2:run.slot===14?1:0].id;
      if(LifeContent.familySlots.includes(run.slot))run.draft.parent=2;
      assert(E.commit(run));
    }
    assert.equal(run.facts.length,46);
    assert(!run.items.lamp);
    assert.deepEqual(reload(run).facts.slice(0,2),[first,fact]);
  });
}

test('a missing deposit cannot fund a yoyo',()=>{
  const run=E.create(1,{childhood:'spring-gift'});
  run.eventId='school-yoyo';run.slot=2;
  assert(I.create(run,'test')&&I.update(run,'test','open'));
  assert(!I.update(run,'test','act','buy'));
  assert(!E.commit(run));
});

test('unversioned saves continue both original lamp histories',()=>{
  for(const drew of [true,false]){
    // This is the original serialized shape, including the absence of an edition marker.
    let run=reload(E.create(1));
    assert(!Object.hasOwn(run,'childhood'));
    assert.equal(run.eventId,'life-1');
    run.draft.main=drew?'life-1-2':'life-1-0';
    assert(E.commit(run));
    run=reload(run);
    assert(E.advance(run));
    run=reload(run);
    assert.equal(run.eventId,'life-2');
    assert.equal(E.currentCard(run).title,drew?'台灯接触不好':'把桌子让出一角');
    run.entered=true;
    run.draft.main='life-2-0';
    assert(E.commit(run));
    run=reload(run);
    assert(E.held(run.items.lamp));
    assert.equal(run.experience.repair,drew?2:undefined);
    assert(!run.items.yoyo);
    assert(run.facts.every(f=>!f.interaction));
  }
});

test('previous yoyo drafts restart and previous finished results keep their facts',()=>{
  let run=act(E.create(2,{childhood:'spring-gift'}),'family');
  assert(E.advance(run));
  const old={eventId:run.eventId,interactionId:'old',opened:true,reviewed:false,actions:['buy']};
  run.draft.interaction=old;
  run=reload(run);
  assert.equal(run.draft.interaction,undefined);
  open(run);
  assert.deepEqual(I.preview(run).allowed.map(action=>action.actionId),['see-price']);
  for(const step of ['see-price','go-home','ask-family'])assert(I.update(run,run.eventId,'act',step));
  run=act(run,'buy');
  // Model the committed representation emitted by the previous release.
  for(const fact of [run.facts[1],run.result.fact]){
    fact.text='旧版已经买下悠悠球。';
    const receipt=fact.interaction;
    delete receipt.story;
    delete receipt.retrievedBy;
    delete receipt.storedAt;
    receipt.performed=['buy'];
  }
  run.draft.interaction=old;
  const history=structuredClone(run.facts);
  run=reload(run);
  assert.deepEqual(run.facts,history);
  assert(E.held(run.items.yoyo));
  assert(!I.confirm(run,'old'));
  assert(!E.commit(run));
  assert(E.advance(run));
  assert.equal(run.eventId,'life-3');
});

test('generic caregiver remains a family member throughout, without an invented identity',()=>{
  const run=act(E.create(1,{childhood:'spring-gift'}),'family');
  assert.equal(run.facts[0].interaction.custodian,'家人');
  assert(E.advance(run));
  const scene=E.currentCard(run).interaction;
  assert.equal(scene.keeper,'家人');
  assert.equal(scene.homeBeat.label,'问家人');
  assert.equal(scene.homeBeat.line,'这是你的压岁钱。给，你自己拿主意。');
});
