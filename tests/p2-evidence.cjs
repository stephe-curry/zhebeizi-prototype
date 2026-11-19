'use strict';
const assert=require('node:assert/strict');
const {prefixes,settle,reach}=require('./p2-paths.cjs');
const C=LifeContent,E=LifeEngine,L=LifeContinuity;
const grade=c=>c.grade;

function verify(onOffer,onDetail){
  const {cards,choices}=prefixes(),events=[],responses=[],closures=[],readings=[];
  for(const card of C.cards){
    const prefix=cards.get(card.id);
    assert(prefix,'no legal prefix for '+card.id);
    const ids=[...choices.keys()].filter(id=>choices.get(id).eventId===card.id);
    for(const id of ids){
      let run=E.copy(choices.get(id));
      // The original T4 conversation can refer to purchased blocks or shared ice.
      if(id==='life-4-story')run=reach(2,4,r=>r.slot===3?'life-3-0':undefined);
      if(id==='early-goodbye-1')run=reach(157,44);
      const fact=settle(run,id);
      assert.equal(fact.eventId,card.id);assert.equal(fact.slot,card.slot);
      events.push({id,event:card.id,seed:run.seed,label:fact.action,outcome:fact.text,slot:run.slot,grade:grade(card)});
      const detail=LifeResponses.detailsByChoice.get(id);
      if(detail){
        while(run.slot<detail.slot && !run.memo){
          assert(E.advance(run));if(run.slot<detail.slot && !run.memo)settle(run);
        }
        const onDesk=LifeResponses.detailsAt(run).find(d=>d.choiceId===id);
        if(onDesk && !run.memo){
          onDetail?.(run,onDesk);
          const later=settle(run);
          assert(later.echoes.some(e=>e.sceneDetail && e.sourceSlot===fact.slot));
          assert(later.sourceSlots.includes(fact.slot));
          readings.push({id,to:later.slot,event:later.eventId,seed:run.seed,text:onDesk.text});
        }else readings.push({id,to:detail.slot,seed:run.seed,unseen:true,reason:run.memo?'提前谢幕':'该路径的物件、会面或当期照护条件不符'});
      }
      if(['early-goodbye','life-46'].includes(card.id)){
        assert(E.advance(run));assert(run.memo?.lastPage);assert.equal(run.facts.length,card.slot);
        if(fact.entrusted)assert.equal(run.items[fact.entrusted].state,'given');
        closures.push({id,seed:run.seed,slot:card.slot,terminal:run.memo.kind,artifact:run.memo.lastPage});
      }
    }
  }
  for(const row of LifeResponses.rows){
    let run=E.copy(choices.get(row.choice));
    if(row.choice==='life-4-story')run=reach(2,4,r=>r.slot===3?'life-3-0':undefined);
    if(row.requires==='reused' && !Object.values(run.items).some(E.held)){
      for(let seed=1;seed<=480;seed++){
        const prefix=reach(seed,38,r=>r.slot===28?'life-28-0':undefined);
        if(prefix.eventId==='life-38' && Object.values(prefix.items).some(E.held)){run=prefix;break;}
      }
    }
    const alternate=E.copy(run);
    const options=E.currentCard(alternate).choices;
    const other=alternate.eventId==='life-4'?(row.choice==='life-4-keep-eating'?'life-4-eat-fish':'life-4-keep-eating'):
      options.find(c=>c.id!==row.choice).id;
    settle(alternate,other);E.advance(alternate);
    while(alternate.slot<row.slot && !alternate.memo){settle(alternate);E.advance(alternate);}
    assert(!E.followups(alternate).some(a=>a.id==='again-'+row.choice),'spurious response '+row.choice);
    const source=settle(run,row.choice);
    assert(E.advance(run));
    while(run.slot<row.slot && !run.memo){
      let id;
      if(run.slot===28)id='life-28-0';
      if(run.slot===6 && row.choice.startsWith('school-yoyo'))id='life-6-2';
      settle(run,id);assert(E.advance(run));
    }
    const action=E.followups(run).find(a=>a.id==='again-'+row.choice);
    assert(action,'missing playable response '+row.choice+' at '+row.slot+' seed '+run.seed);
    assert.equal(action.source.slot,source.slot);
    onOffer?.(run,action);
    const without=E.copy(run);
    assert(L.seen(run,action.id));
    run.draft.followup=action.id;
    const f=settle(run),control=settle(without);
    assert.equal(f.choiceId,control.choiceId);
    assert(!control.followup);assert(f.followup);
    assert(f.sourceSlots.includes(source.slot));
    const entry=f.trace.candidates.find(e=>e.id===action.id);
    assert.equal(entry.status,'resolved');assert.equal(entry.sources[0].choiceId,source.choiceId);
    assert.notEqual(run.historyKey,without.historyKey);
    responses.push({id:row.choice,from:source.slot,to:f.slot,event:f.eventId,action:action.label,seed:run.seed,
      changes:Object.fromEntries(Object.keys(action.delta).filter(k=>run.stats[k]!==without.stats[k]).map(k=>[k,run.stats[k]-without.stats[k]])),
      receipt:action.id,source:entry.sources[0],result:entry.result});
  }
  for(const place of ['box','family','drawer']){
    const run=reach(1,1),source=settle(run,'spring-envelope-'+place);assert(E.advance(run));
    const f=settle(run,'school-yoyo-buy');
    assert(f.interaction.performed.includes(({box:'open-box',family:'ask-family',drawer:'open-drawer'})[place]));
    assert.equal(f.interaction.sourceSlot,source.slot);assert.equal(f.interaction.purchased,true);
    responses.push({id:source.choiceId,from:1,to:2,event:f.eventId,action:f.interaction.retrievedBy,seed:1,receipt:f.choiceId});
  }
  for(const decision of ['buy','keep']){
    const run=reach(1,1);settle(run,'spring-envelope-box');E.advance(run);
    const source=settle(run,'school-yoyo-'+decision);
    while(run.slot<6){E.advance(run);if(run.slot<6)settle(run);}
    const id=E.currentCard(run).giftEcho.choiceId;
    const f=settle(run,id);assert.equal(f.giftEcho.status,'taken');assert.equal(f.giftEcho.sourceSlot,2);
    responses.push({id:source.choiceId,from:2,to:6,event:f.eventId,action:f.action,seed:1,receipt:f.choiceId});
  }
  const credited=new Set([...responses,...closures].map(r=>r.id));
  const uncovered=events.filter(e=>e.grade==='S'&&!credited.has(e.id));
  assert.deepEqual(uncovered,[]);
  assert(C.cards.filter(c=>c.grade==='A').every(c=>responses.some(r=>r.source?.eventId===c.id)));
  return {events,responses,closures,readings};
}
module.exports={verify};
