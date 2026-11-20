'use strict';
const assert=require('node:assert/strict');
const {settle}=require('./p2-paths.cjs');
const E=LifeEngine, R=LifeReviewed;
const seen=new Set(), choicesTested=new Set();
function walk(overrides={},main={},seed=5,partTime=false){
  let run=E.create(seed,{childhood:'spring-gift',reviewedVersion:1});
  const save=LifeSave.fresh();
  save.active='walk';save.trees.t={birth:run.birth};
  for(let actions=0;!run.memo;actions++){
    assert(actions<240,'bounded life');
    const scene=R.view(run);
    if(scene){
      seen.add(scene.node);
      if(scene.feedback){assert(E.advance(run));continue;}
      for(const letter of Object.keys(scene.choices).length?Object.keys(scene.choices):['read']){
        const key=[scene.eventId,scene.variantId,letter].join('/');
        if(choicesTested.has(key))continue;
        const trial=E.copy(run);
        assert(E.commit(trial,key,scene.opportunityId),key);
        const receipt=trial.facts.at(-1).reviewed.at(-1);
        assert.equal(receipt.approvedTextId,key);
        assert(!E.commit(trial,key,scene.opportunityId));
        choicesTested.add(key);
      }
      const choice=overrides[scene.node]??(scene.node===scene.eventId?overrides[scene.eventId]:undefined)??Object.keys(scene.choices)[0]??'read';
      const key=[scene.eventId,scene.variantId,choice].join('/');
      assert(!E.advance(run),'cannot bypass a choice');
      assert(E.commit(run,key,scene.opportunityId),key);assert(!E.commit(run,key,scene.opportunityId),key);
      save.branches.walk={tree:'t',run};
      const loaded=LifeSave.decode(JSON.stringify(save));
      assert(LifeSave.validateImport(loaded),key);
      if(scene.eventId==='P-S01'){
        const bogus=E.copy(save);
        bogus.branches.walk.run.facts.at(-1).reviewed[0].choiceId='outside-reviewed-script';
        assert(!LifeSave.validateImport(bogus));
        assert.equal(LifeSave.decode(JSON.stringify(bogus)),null);
      }
      run=loaded.branches.walk.run;
    }else if(run.stage==='event'){
      assert(!LifeRoutes.options(run).some(o=>/^\d/.test(o.key)));
      if(partTime && run.slot===25){
        const part=LifeRoutes.options(run).find(o=>o.receipt.kind==='employment' && o.receipt.result.mode==='part');
        assert(part);assert(LifeRoutes.choose(run,...part.key.split('/')));
      }
      if(partTime && run.slot===28){run.entered=true;assert(E.placeItem(run,'console','store'));}
      settle(run,main[run.slot]??({11:'life-11-0',14:'life-14-1'})[run.slot]);
    }else assert(E.advance(run));
  }
  assert.equal(run.facts.length,46);
  const receipts=R.history(run);
  assert.equal(new Set(receipts.map(r=>[r.opportunityId,r.node??r.eventId].join('/'))).size,receipts.length);
  assert.deepEqual(receipts.map(r=>r.date),receipts.map(r=>r.date).sort());
  return Object.fromEntries(receipts.map(r=>[r.node??r.eventId,r]));
}
const a=walk();
assert.equal(a.E14.variantId,a.E13.outcome);
assert.equal(a['P-S02'].appointment,'2021-09-04T10:00');
assert.equal(a.O08.blocked,'COUNTY_SELECTION_RESULT_UNAVAILABLE');
assert.equal(a.Q04.blocked,'NO_COMPARABLE_STAGE_EXAM_RESULT');
const b=walk({O01:'C',E01:'B',Q01:'C','P-S02':'B'});
assert(!b.O02&&!b.E02&&!b.Q02);
assert.equal(b['P-S02'].appointment,'2021-09-04T15:00');
const c=walk({E03:'B',E02:'A',E10:'B',E13:'B',O03:'C',Q03:'C','P-S02':'C'});
assert(!c['P-S02'].appointment&&!c.E11&&!c.Q04);
assert.equal(c.E03.outcome,'lost');assert.equal(c.E13.outcome,'won');
const retry=walk({E17:'B',E18:'A',E20:'B',E21:'B'});
assert.equal(retry.E16.attempt.index,0);
assert.equal(retry.E21.terminal,'QUIT');
const reentered=walk({E17:'B',E18:'A',E20:'B',E21:'A'});
assert.equal(reentered.E21.attempt.index,1);
assert.equal(reentered.E17.opportunityId,reentered.E21.opportunityId);
assert(reentered.E17.date>reentered.E21.date);
const overlap=walk({}, {}, 2);
assert.equal(overlap['E10@overlap'].keptAppointment,overlap['P-S02'].appointment);
assert(!overlap.E11);
const shortCycle=walk({}, {}, 13);
assert(shortCycle['C-DH01-2@partial'] && !shortCycle['D-H01@review'] && !shortCycle.E16);
const oneSession=walk({}, {}, 9);
assert(oneSession['D-H01@arrival'] && !oneSession['C-DH01-2'] && !oneSession['D-H01@practice']);
assert(overlap['C-DH01-2'] && !overlap['D-H01@arrival']);
const third=walk({E17:'B',E18:'A',E20:'B',E21:'A'}, {23:'life-23-0'},5,true);
assert.equal(third.E21.attempt.index,2);
const adult=walk({E01:'C',O01:'C'},{23:'life-23-0',28:'life-28-0'},7,true);
assert.equal(adult['E-A01'].players.length,9);
assert(adult['E-A04']);
const assessed=walk({E17:'A',E18:'C'});
assert.equal(assessed.E18.outcome,'pass');
assert(assessed['E19@assessment']);
assert.equal(assessed['E23@season'].closed,true);
assert.equal(assessed['E23@season'].roster.status,'UNVERIFIED');
const negotiated=walk({E17:'A',E18:'C',E22:'B'});
assert(negotiated['E22@negotiate'].contract.signed);
assert.deepEqual([...seen].sort(),Object.keys(LifeApprovedText).sort());
console.log('PASS',choicesTested.size,'unique keyed choices and read receipts,',seen.size,'reachable scenes, 12 complete lives, mid-scene save/import, branch outcomes and duplicate rejection');
const snapshot={seed:1,facts:[{reviewed:Object.values(a)}]};
assert.equal(R.historicalScore(snapshot,'Q').total,8);
for(const dream of ['E','O','Q']){
  const points=R.historicalScore(snapshot,dream);
  assert.deepEqual(R.historicalScore({...snapshot,facts:[...snapshot.facts,...snapshot.facts]},dream),points);
  assert.equal(R.fate(snapshot,dream,'test-opportunity','rules-v1'),R.fate(E.copy(snapshot),dream,'test-opportunity','rules-v1'));
  assert(points.total<=60);
}
