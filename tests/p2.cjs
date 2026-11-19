'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs'),path=require('node:path');
const {reach,settle,prefixes}=require('./p2-paths.cjs');
const E=LifeEngine,L=LifeContinuity;

test('every registered decision, core callback, terminal action and important scene has an executable witness',()=>{
  const proof=require('./p2-evidence.cjs').verify();
  assert.equal(new Set(proof.events.map(f=>f.event)).size,LifeContent.cards.length);
  assert.equal(proof.closures.length,6);
});
test('425 books one evening; assistance, retirement, failed submission and real release stay distinct',()=>{
  const source=reach(425,39);
  const outcomes=[];
  for(const [card,index] of [['arena-final',1],['arena-final',2],['indie-launch',0],['indie-launch',1],['indie-launch',2]]){
    const r=E.copy(source);
    for(const id of r.pageTrace.menu)L.seen(r,id);
    assert(E.chooseAppointment(r,card));
    assert(!E.chooseAppointment(r,'office-45'));
    const fact=settle(r,card+'-'+index);
    const other=fact.trace.candidates.find(e=>e.id===(card==='arena-final'?'indie-launch':'arena-final'));
    assert.equal(other.reason,'booked-other-appointment');
    const e=fact.trace.candidates.find(e=>e.id===card);
    outcomes.push(e.outcome);
    assert(!r.highlights.world);assert.equal(!!r.highlights.published,e.outcome==='published');
    if(['retired','kept-in-team'].includes(e.outcome))assert.equal(e.status,'declined');
    assert(E.advance(r));assert.equal(r.slot,40);
  }
  assert.deepEqual(outcomes,['assisted','retired','unpublished','published','kept-in-team']);
  const r=E.copy(source);settle(r,'arena-final-2');
  const [unseen]=L.windows(r,'indie-launch');assert.equal(unseen.reason,'window-ended-unseen');assert.equal(unseen.seen,false);
});
test('474 occupational handover and rescheduled keepsake require two actual decisions; revocation, refresh and changed custody',()=>{
  const r=reach(474,45);
  assert(E.chooseAppointment(r,'office-45'));const office=settle(r,'office-45-0');
  assert(office.highlights.includes('office'));assert(!r.highlights.published);
  const lost=E.copy(r);lost.items.prototype.state='given'; // live condition counterexample
  assert(E.advance(lost));assert(!E.followups(lost).some(a=>a.prior==='indie-memory'));
  assert.equal(lost.pageTrace.entries.find(e=>e.continuationOf?.id==='indie-memory').status,'invalidated');
  assert(E.advance(r));const a=E.followups(r).find(a=>a.prior==='indie-memory');
  assert(a);assert.equal(L.opportunity(r,a.id).seen,false);assert(L.seen(r,a.id));
  r.draft.followup=a.id;assert.equal(L.opportunity(r,a.id).status,'accepted');
  const passed=E.copy(r);delete passed.draft.followup;
  const pass=settle(passed,'life-46-1');assert(!passed.items.screenshot);
  assert.equal(pass.trace.candidates.find(e=>e.id===a.id).reason,'seen-not-taken');
  const restored=JSON.parse(JSON.stringify(r)),last=settle(restored,'life-46-1');
  assert(E.held(restored.items.screenshot));assert(!restored.highlights.published);
  assert(last.sourceSlots.includes(33)&&last.sourceSlots.includes(45));
  assert(E.advance(restored)&&restored.memo && restored.facts.length===46);
});
test('a visible old build can wait while each eligible occupation uses its own appointment',()=>{
  for(const [seed,card] of [[444,'office-45'],[473,'factory-45'],[480,'delivery-45'],[478,'sanitation-45']]){
    const run=reach(seed,45);
    assert(L.seen(run,'indie-memory'));assert(E.chooseAppointment(run,card));
    const f=settle(run,card+'-0'),prior=f.trace.candidates.find(e=>e.id==='indie-memory');
    assert.equal(prior.status,'deferred');assert.equal(prior.reason,'booked-other-appointment');
    assert(E.advance(run));run.draft.followup='again-indie-memory';
    assert.equal(settle(run).followup.id,'again-indie-memory');assert(E.held(run.items.screenshot));
  }
  const earlier=reach(473,45);settle(earlier,'indie-memory-0');
  assert(E.held(earlier.items.screenshot));assert(E.advance(earlier));
  assert(!E.followups(earlier).some(a=>a.id==='again-indie-memory'));
});
test('actual physical workplace inspection changes a later handover; entry or a wrong mark supplies no sample',()=>{
  const {cards}=prefixes();
  for(const card of ['office-24','factory-24','delivery-24']){
    const sample=LifeContent.sampleTasks[card],history=cards.get(card),matched=E.copy(history),miss=E.copy(history);
    assert(E.inspectSample(matched,sample.correct));assert(E.inspectSample(miss,1-sample.correct));
    assert.equal(settle(matched,card+'-0').inspected,sample.id);assert(!settle(miss,card+'-0').inspected);
    for(const [r,expected] of [[matched,true],[miss,false]]){
      for(E.advance(r);r.slot<39;E.advance(r)){
        const stop=r.eventId==='indie-rights'?'indie-rights-2':undefined;
        settle(r,stop);
      }
      assert.equal(r.eventId,'life-39');
      assert.equal(E.followups(r).some(a=>a.id==='handover-'+sample.id),expected);
      if(expected){r.draft.followup='handover-'+sample.id;const f=settle(r);assert(f.trace.commands.includes('exp:mentor'));assert(f.sourceSlots.includes(24));}
    }
  }
});
test('source and live item checks separate own practice, first practice and borrowing a returned prop',()=>{
  for(const decision of ['buy','keep']){
    const r=reach(1,10,x=>x.slot===2?'school-yoyo-'+decision:x.slot===6?'life-6-2':undefined);
    assert(!L.growth(r,'sports-practice').history.length);
    const id='again-school-yoyo-'+decision;
    assert(E.followups(r).some(a=>a.id===id));r.draft.followup=id;settle(r);
    assert.equal(L.growth(r,'sports-practice').history.length,1);assert(!L.growth(r,'sports-practice').repeated);
    assert.equal(E.held(r.items.yoyo)||false,decision==='buy');
  }
});
test('alternate schedule is reached from eligible cards; low can stay active until the later recovery',()=>{
  const {cards}=prefixes();
  for(const id of ['life-24','life-27','life-32','life-36']){
    const r=E.copy(cards.get(id));assert(r.pageTrace.menu.includes(id));
    assert.equal(settle(r,id+'-0').eventId,id);
  }
  const r=E.copy(cards.get('active-recovery'));settle(r,'active-recovery-wait');
  while(r.slot<41){assert(E.advance(r));if(r.slot<41)settle(r);}
  assert.equal(r.eventId,'late-recovery');const f=settle(r,'late-recovery-0');
  assert(f.sourceSlots.includes(38));assert.equal(r.low.response.kind,'short');
});
test('physical sheets use intact frame dimensions, nonuniform timings, tags and reduced motion endpoints',()=>{
  const root=path.resolve(__dirname,'..'),css=fs.readFileSync(path.join(root,'style.css'),'utf8');
  for(const [file,count,tags] of [['appointment-stamp',9,1],['shift-desk',21,3]]){
    const meta=JSON.parse(fs.readFileSync(path.join(root,'assets',file+'.json')));
    const png=fs.readFileSync(path.join(root,'assets',file+'.png'));
    assert.equal(meta.frames.length,count);assert.equal(meta.meta.frameTags.length,tags);
    meta.meta.frameTags.forEach((tag,i)=>assert.deepEqual([tag.from,tag.to],[i*count/tags,(i+1)*count/tags-1]));
    assert.equal(meta.meta.size.w,png.readUInt32BE(16));assert.equal(meta.meta.size.h,png.readUInt32BE(20));
    assert(meta.frames.every(f=>!f.trimmed&&!f.rotated&&f.frame.w===32&&f.frame.h===32&&f.duration>0));
    assert(new Set(meta.frames.map(f=>f.duration)).size>3);
    assert(css.includes(file+'.png'));assert(fs.existsSync(path.join(root,'art',file+'.aseprite')));
  }
});
test('a new sketch at 29 can recall shared study only after the actual conversation',()=>{
  for(const choice of ['life-7-0','life-7-1','life-7-2']){
    let r;
    for(let seed=1;seed<100;seed++){
      const prefix=reach(seed,29,x=>x.slot===7?choice:undefined);
      if(prefix.eventId==='chance-old-friend'){r=prefix;break;}
    }
    assert(r);
    const card=E.currentCard(r);
    assert.equal(card.readFrom===7,choice==='life-7-1');
    assert.equal(card.body.includes('轮流讲题'),choice==='life-7-1');
    if(choice==='life-7-0')assert(!LifeContent.experience.practice[1].includes('同学'));
    const f=settle(r,'chance-old-friend-0');assert(f.trace.commands.includes('exp:teamwork'));
    assert.equal(f.sourceSlots.includes(7),choice==='life-7-1'||r.facts[6].people.includes('friend')&&r.facts[6].slot===r.people.friend.first);
  }
});
test('a retirement keepsake is entrusted to an actual carer, and closed items cannot be brought home',()=>{
  const {cards}=prefixes(),r=reach(157,44);assert.equal(r.eventId,'early-goodbye');
  const held=Object.keys(r.items).filter(id=>E.held(r.items[id]));
  assert(held.length);
  r.draft.reuse=held.at(-1);
  const f=settle(r,'early-goodbye-1');
  assert.equal(f.entrusted,held.at(-1));assert.equal(r.items[f.entrusted].recipient,'caregiver');
  assert.equal(r.items[f.entrusted].state,'given');assert(E.advance(r));assert(!r.memo.token.includes(f.entrusted));
  const ending=E.copy(cards.get('factory-45'));ending.items.tools={first:23,state:'given',trail:[{slot:28,state:'given'}]};
  const option=E.currentCard(ending).choices[1];assert(!option.commands.includes('gain:tools'));
  settle(ending,option.id);assert(!E.held(ending.items.tools));
});
test('future study, business and home hooks require the specific action and confer no dream completion',()=>{
  const r=reach(2,32,x=>x.slot===18?'life-18-1':x.slot===31?'life-31-1':undefined);
  assert.equal(L.evidence(r,'paid-stall-shift')[0].slot,18);assert.equal(L.evidence(r,'housing-visit')[0].slot,31);
  assert.equal(L.evidence(r,'rental-renewal').length,0);assert.equal(L.evidence(r,'admission')[0].slot,14);
  assert(!r.highlights.business&&!r.highlights.home&&!r.highlights.olympic);assert.deepEqual(L.evidence(r,'work-sample'),[]);
});
test('every counter observation and both coin identities can settle; the original shared water-bottle story can be told',()=>{
  const I=LifeInteraction,seen=new Set();
  for(const actions of [
    ['yuanA-blocks','yuanB-blocks'],['yuanA-ice','yuanB-purse'],['yuanB-ice','yuanA-purse'],['leave-shop']
  ]){
    const r=reach(2,3);assert(I.create(r,'coins')&&I.update(r,'coins','open'));
    for(const id of [...I.preview(r).allowed.filter(a=>a.kind==='observe').map(a=>a.actionId),...actions]){
      assert(I.update(r,'coins','act',id));seen.add(id);
    }
    assert(E.commit(r));
  }
  assert.deepEqual([...seen].sort(),LifeContent.shared[2].interaction.actions.map(a=>a.actionId).sort());
  const r=reach(2,4,x=>x.slot===1?'life-1-0':undefined);
  r.draft.interaction={eventId:'life-4',interactionId:'old-table',opened:false,reviewed:false,actions:[]};
  assert(I.update(r,'old-table','open'));
  for(const a of ['listen','story-1','finish'])assert(I.update(r,'old-table','act',a));
  assert(E.commit(r));assert.equal(r.facts.at(-1).choiceId,'life-4-story');assert(r.facts.at(-1).sourceSlots.includes(1));
});
test('professional work and midlife work, retraining and rest each have playable later responses',()=>{
  for(const [r,id] of require('./p2-paths.cjs').extraResponses()){
    const a=E.followups(r).find(a=>a.id===id);assert(a,id);
    const copy=E.copy(r);r.draft.followup=id;const f=settle(r);
    const plain=settle(copy,f.choiceId);assert(!plain.followup);
    assert.equal(f.followup.id,id);assert(f.sourceSlots.includes(a.source.slot));
    if(id.startsWith('later-'))assert.equal(f.age,64);
  }
});
test('routine short shifts can lead to dispatch training without creating a past injury or recovery qualification',()=>{
  for(const suffix of [0,1,2]){
    const r=reach(465,37);assert(E.chooseAppointment(r,'delivery-37'));
    const f=settle(r,'delivery-37-'+suffix);assert(!f.trace.commands.includes('exp:recovery'));
    if(suffix===1){assert.equal(r.career,'dispatcher');assert(f.trace.commands.includes('exp:workshop'));}
  }
});
