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

function finishSchoolEntry(run){
  assert(E.advance(run));
  run=act(run,'leave-shop');
  assert(E.advance(run));
  run=act(run,'keep-eating');
  assert(E.advance(run));
  run.draft.main='life-5-0';
  assert(E.commit(run));
  assert(E.advance(run));
  assert.equal(run.eventId,'life-6');
  return run;
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
    assert(E.advance(run));
    run.draft.main='life-5-0';
    assert(E.commit(run));
    assert(E.advance(run));
    assert.equal(run.eventId,'life-6');
    assert.equal(E.age(run),13);
    const extra=bought?'life-6-yoyo':'life-6-shuttlecocks';
    const other=bought?'life-6-shuttlecocks':'life-6-yoyo';
    assert.deepEqual(E.currentCard(run).choices.map(choice=>choice.id),['life-6-0','life-6-1','life-6-2',extra]);
    const beforeEcho=structuredClone(run);
    run.draft.main=other;
    assert(!E.commit(run));
    assert.deepEqual(run.facts,beforeEcho.facts);
    run.draft.main=extra;
    run=reload(run);
    const settled=structuredClone(run);
    assert(E.commit(run));
    assert(E.commit(settled));
    assert.deepEqual(run,settled,'refresh must lead to identical settlement');
    const after=reload(run);
    const echo=after.facts[5];
    assert(!E.commit(after));
    assert.deepEqual(after.result.fact,echo);
    assert.deepEqual(echo.sourceSlots,[2]);
    assert.deepEqual(echo.giftEcho,{sourceSlot:2,branch:id,status:'taken',spent:bought?0:10,balance:0});
    assert.deepEqual(echo.reused,bought?['yoyo']:[]);
    assert.deepEqual(after.facts.slice(0,5),beforeEcho.facts);
    assert.equal(!!E.held(after.items.yoyo),bought);
    assert.equal(after.stats.money,beforeEcho.stats.money);
    for(const key of ['career','direction','wish','threads','experience','project'])
      assert.deepEqual(after[key],beforeEcho[key],key);
    if(bought){
      assert.equal(after.items.yoyo.trail.at(-1).slot,6);
      assert.match(echo.text,/八岁时买的悠悠球/);
    }else{
      assert.match(echo.text,/两个羽毛球.*打完了一局/);
      assert.match(echo.text,place==='family'?/外婆.*红纸包/:place==='box'?/小盒子/:/抽屉/);
      assert.doesNotMatch(echo.text,/悠悠球/);
    }
    run=after;
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
    assert.deepEqual(run.facts.filter(f=>f.giftEcho),[echo]);
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

function arriveAtEcho(branch){
  const run=act(E.create(2,{childhood:'spring-gift'}),'family');
  assert(E.advance(run));
  open(run);
  for(const step of ['see-price','go-home','ask-family'])assert(I.update(run,run.eventId,'act',step));
  return finishSchoolEntry(act(run,branch));
}

test('declining either offer keeps the ordinary outcome and never debits the envelope',()=>{
  for(const branch of ['buy','keep']){
    const run=arriveAtEcho(branch);
    const prior=structuredClone(run.facts);
    run.draft.main='life-6-2';
    assert(E.commit(run));
    const fact=run.facts.at(-1);
    assert.equal(fact.text,LifeContent.shared[5].choices[2].outcome);
    assert.deepEqual(fact.giftEcho,{sourceSlot:2,branch,status:'passed',spent:0,balance:branch==='keep'?10:0});
    assert.deepEqual(reload(run).facts.slice(0,5),prior);
    assert(E.advance(run));
    assert.equal(E.currentCard(run).giftEcho,undefined);
  }
});

test('only consistent settled receipts and current ownership can offer the callback',()=>{
  for(const [branch,damage] of [
    ['buy',run=>delete run.items.yoyo],
    ['buy',run=>run.items.yoyo.state='given'],
    ['buy',run=>run.items.yoyo.first=3],
    ['buy',run=>run.facts[1].items=[]],
    ['buy',run=>delete run.facts[1].interaction],
    ['buy',run=>run.facts[1].interaction.choiceId='school-yoyo-keep'],
    ['keep',run=>run.facts[1].sourceSlots=[]],
    ['keep',run=>run.facts[1].interaction.balance=0],
    ['keep',run=>run.facts[1].interaction.storedAt='box'],
    ['keep',run=>run.facts[1].interaction.retrievedBy='open-drawer'],
    ['keep',run=>run.facts[0].interaction.custodian='player'],
    ['keep',run=>run.facts[1].interaction.sourceSlot=3]
  ]){
    const run=arriveAtEcho(branch);
    damage(run);
    assert.equal(E.currentCard(run),LifeContent.shared[5]);
    run.draft.main=branch==='buy'?'life-6-yoyo':'life-6-shuttlecocks';
    assert(!E.commit(run));
  }
  const stored=arriveAtEcho('buy');
  stored.items.yoyo.state='stored';
  stored.draft.main='life-6-yoyo';
  assert(E.commit(stored));
  assert.equal(stored.items.yoyo.state,'display');
});

test('older committed gift receipts can offer the echo without rewriting history',()=>{
  for(const branch of ['buy','keep']){
    const run=arriveAtEcho(branch);
    const receipt=run.facts[1].interaction;
    for(const key of ['story','retrievedBy','storedAt'])delete receipt[key];
    receipt.performed=[branch];
    const history=structuredClone(run.facts);
    assert.equal(E.currentCard(reload(run)).giftEcho.branch,branch);
    assert.deepEqual(reload(run).facts,history);
    // Old saves already past the slot do not gain a retroactive opportunity.
    const past=structuredClone(run);
    delete past.facts[1].interaction;
    past.draft.main='life-6-0';
    assert(E.commit(past));
    past.facts[1]=history[1];
    assert.equal(E.currentCard(reload(past)).giftEcho,undefined);
    assert.equal(E.advance(past),true);
    assert.equal(E.currentCard(past).giftEcho,undefined);
  }
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

test('equipment-room evidence and visibility come from distinct receipts',()=>{
  const L=LifeContinuity;
  for(const branch of ['buy','keep']){
    const run=arriveAtEcho(branch),event=E.currentCard(run),id=event.giftEcho.choiceId;
    assert.equal(L.evidence(run,'purchase').length,branch==='buy'?1:0);
    assert.deepEqual(L.evidence(run,'sports-practice'),[]);
    assert.deepEqual(L.evidence(run,'job-entry'),[]);
    assert(L.seen(run,id));assert(!L.seen(run,id));run.draft.main=id;
    assert.equal(L.opportunity(reload(run),id).status,'accepted');
    const decline=reload(run);decline.draft.main='life-6-0';
    assert(E.commit(decline));assert.equal(L.echoes(decline).at(-1).status,'declined');
    assert.equal(L.evidence(decline,'sports-practice').length,0);
    if(branch==='buy'){
      const lost=reload(run);lost.items.yoyo.state='given';
      L.offers(lost,E.currentCard(lost));assert.equal(L.opportunity(lost,id).status,'invalidated');
      assert(!E.commit(lost));
    }
    assert(E.commit(run));assert(!E.commit(run));
    const echo=L.echoes(run).at(-1);assert(echo.seen&&echo.participated);
    assert.equal(echo.sources[0].slot,2);assert.equal(echo.result.slot,6);
    assert.equal(L.evidence(run,'sports-practice').length,1);
    assert(!L.growth(run,'sports-practice').repeated);
    const old=reload(run);delete old.facts.at(-1).trace;
    assert.equal(L.echoes(old).at(-1).seen,null);
  }
});

test('reading the invitation text does not mean its offscreen action was offered or rejected',()=>{
  const r=arriveAtEcho('keep'),id=E.currentCard(r).giftEcho.choiceId;
  assert(LifeContinuity.seeClue(r,id));assert(!LifeContinuity.seeClue(r,id));
  r.draft.main='life-6-2';assert(E.commit(r));
  const echo=LifeContinuity.echoes(r).at(-1);
  assert(echo.clueSeen && echo.seen && !echo.actionSeen);
  assert(!echo.participated);assert.equal(echo.reason,'window-ended-unseen');
  assert.notEqual(echo.status,'declined');
});
