'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
for(const name of ['content','interaction','engine','save']) require('../'+name+'.js');
const E=LifeEngine,I=LifeInteraction,L=LifeContinuity,C=LifeContent;

// Same choices as the isolated P0 reachability run; never assign permanent facts.
function play(run){
  const c=E.currentCard(run),pick=E.hash(run.seed,run.slot,'audit');
  if(c.interaction){
    assert(I.create(run,'audit'));
    assert(I.update(run,'audit','open'));
    while(I.preview(run).phase!=='ready'){
      const v=I.preview(run);
      if(v.phase==='preview'){assert(I.update(run,'audit','review'));continue;}
      const a=v.allowed.find(a=>['leave-shop','keep-eating'].includes(a.actionId))??v.allowed[pick%v.allowed.length];
      assert(I.update(run,'audit','act',a.actionId));
    }
  }else{
    run.entered=true;run.draft.main=c.choices[pick%c.choices.length].id;
  }
  if(C.familySlots.includes(run.slot))run.draft.parent=pick%3;
  assert(E.commit(run));assert(!E.commit(run));
}
function reach(seed,slot){
  const r=E.create(seed,seed%2?{childhood:'spring-gift'}:{});
  r.branchId='parent';
  while(r.slot<slot){play(r);assert(E.advance(r));}
  return r;
}
for(const [seed,slot,winner,losers] of [[425,39,'arena-final',['indie-launch']],[474,45,'arena-quiet',['indie-memory','office-45']]]){
  test('real scheduler competition '+seed,()=>{
    const r=reach(seed,slot), copy=JSON.parse(JSON.stringify(r));
    assert.equal(r.eventId,winner);
    for(const id of losers){
      const e=L.opportunity(r,id);
      assert(e.eligible&&!e.seen&&!e.selected);assert.equal(e.status,'deferred');
      assert(e.sources.length>0);
      for(const src of e.sources)assert(r.facts.some(f=>f.choiceId===src.choiceId&&f.slot===src.slot&&f.branch===src.branch));
    }
    assert(L.seen(r,winner));assert(!L.seen(r,winner));
    play(r);play(copy);assert.equal(copy.historyKey,r.historyKey);
    for(const id of losers){
      const [e]=L.windows(r,id);
      if(id==='indie-memory'){assert.equal(e.window[1],46);assert(!e.windowEnded&&!e.seen);continue;}
      assert(e.windowEnded&&!e.seen);assert.equal(e.reason,'window-ended-unseen');
      assert.equal(e.status,'deferred');
    }
    assert.deepEqual(L.pending(r,slot+1,()=>true).map(p=>p.entry.id),seed===474?['indie-memory']:[]);
    assert.equal(r.facts.at(-1).choiceId,copy.facts.at(-1).choiceId);
  });
}
test('presentation, revocable acceptance, expiry and loss of qualification are distinct',()=>{
  const r=reach(425,39),id='arena-final-0',e=L.opportunity(r,id);
  assert.equal(e.status,'eligible');assert(L.seen(r,id));assert.equal(e.status,'offered');
  r.draft.main=id;assert.equal(L.opportunity(r,id).status,'accepted');
  r.draft.main=null;assert.equal(L.opportunity(r,id).status,'offered');
  const known=structuredClone(e);L.close(known,40);assert.equal(known.status,'expired');
  L.close(e,39,false);assert.equal(e.status,'invalidated');
});
test('growth needs separate commitments and archived branch receipts stay isolated',()=>{
  const r=reach(425,46);play(r);assert(E.advance(r));
  const history=L.growth(r,'thread:indie');
  assert(history.repeated);assert(history.history.length>=2);
  const saved=JSON.stringify(r), point=r.memo.forks[0], child=E.fork(r,point.slot);
  assert(child);child.branchId='child';assert(L.seen(child,child.eventId));play(child);
  assert.equal(child.facts.at(-1).branch,'child');
  assert(child.facts.slice(0,-1).every(f=>f.branch==='parent'));
  assert.equal(JSON.stringify(r),saved);
  assert.deepEqual(r.memo.timeline.map(f=>f.choiceId),r.memo.timeline.map(f=>r.facts.find(src=>src.slot===f.slot).choiceId));
});
test('old history has no inferred exposure and an old pending event has unknown candidate history',()=>{
  const r=reach(474,3);for(const f of r.facts){delete f.trace;delete f.branch;}
  delete r.pageTrace;const old=structuredClone(r.facts);
  assert(L.current(r).legacyCandidatesUnknown);
  assert.equal(L.opportunity(r,r.eventId).seen,false);
  assert.deepEqual(L.thread(r,'esport'),[]);assert.deepEqual(r.facts,old);
});

test('completed narration records reading separately from actual exposure',()=>{
  const r=reach(474,46);
  // Use an actual committed callback with a source on its original branch.
  const event=r.facts.find(f=>f.echoes.length);
  assert(event);
  const replay=reach(474,event.slot);play(replay);
  const before=JSON.stringify(replay.facts);
  const narration=()=>L.echoes(replay).find(e=>e.slot===replay.slot && e.id===(event.echoes[0].id??event.echoes[0].person) && !e.result);
  assert.equal(narration().seen,false);
  assert(L.seeResult(replay,0));assert(!L.seeResult(replay,0));
  assert.equal(narration().seen,true);assert.equal(narration().participated,false);
  assert.equal(JSON.stringify(replay.facts),before);assert(narration().sources.length);
});

test('a declared later window requires an open opportunity and fresh qualification',()=>{
  const r=reach(425,39);
  // Future P2 configuration contract, not an authored extra release.
  r.pageTrace.entries.find(e=>e.id==='indie-launch').window[1]=40;
  play(r);
  assert.equal(L.pending(r,40,e=>e.id==='indie-launch').length,1);
  assert.equal(L.pending(r,40,()=>false).length,0);
  assert.equal(L.pending(r,41,()=>true).length,0);
  assert(E.advance(r));const choice=E.currentCard(r).choices[0].id;
  assert(!L.resumeWindow(r,'indie-launch',choice,()=>false));
  assert(L.resumeWindow(r,'indie-launch',choice,()=>true));
  assert(!L.resumeWindow(r,'indie-launch',choice,()=>true));
  assert.equal(L.opportunity(r,choice).sources.at(-1).slot,39);
  play(r);assert.deepEqual(L.pending(r,40,()=>true),[]);
});
