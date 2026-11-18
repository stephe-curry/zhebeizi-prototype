'use strict';

const assert = require('node:assert/strict');
require('../content.js');
require('../engine.js');
const C = globalThis.LifeContent;
const E = globalThis.LifeEngine;

function choose(run,index=0,extend=()=>{}) {
  const event = E.currentCard(run);
  run.entered = true;
  run.draft.main = event.choices[index].id;
  if (C.familySlots.includes(run.slot)) run.draft.parent = 2;
  extend(run);
  assert(E.commit(run),event.id);
  assert.equal(E.commit(run),false,'Each event settles once');
  assert(E.advance(run));
}

function play(seed, decide, extend, run=E.create(seed)) {
  while (run.stage !== 'memoir') choose(run,decide(run,E.currentCard(run)),extend);
  return run;
}

const defaultChoice = run => run.slot === 14 ? 1 : run.slot === 11 ? 2 : 0;
const freshPath = (jobIndex=0) => (run,event) => run.slot===23 ? jobIndex : event.id==='indie-launch' ? 2 : defaultChoice(run);
const rest = run => { if (C.keySlots[run.slot]) run.draft.support=['rest']; };
assert.equal(C.ages.length,46);
assert.equal(new Set(C.cards.map(card => card.id)).size,C.cards.length);
assert(C.cards.length>=90&&C.cards.length<=110);
for (const card of C.cards) {
  assert(C.ages[card.slot-1] && card.choices.length >= 2, card.id);
  assert(card.choices.every(choice=>choice.delta&&choice.outcome&&choice.label),card.id);
}

const jobs = ['office','factory','delivery','sanitation'];
jobs.forEach((job,i) => {
  const run = play(1,freshPath(i),rest);
  assert.equal(run.facts.length,46);
  assert.equal(run.careerLog[0].to,job);
  assert(run.facts.some(fact=>fact.eventId.startsWith(job+'-')));
  assert(!run.highlights.world&&!run.highlights.school&&!run.highlights.published);
  assert.equal(run.memo.kind,'open');
});

const multiPolicy = (run,event) => {
  if (run.slot===11) return 1;
  if (run.slot===38 && event.id==='active-recovery') return 2;
  return 0;
};
const search = (policy,predicate,limit=200) => {
  for (let seed=1;seed<=limit;seed++) {
    const run=play(seed,policy,rest);
    if(predicate(run))return run;
  }
  throw Error('No matching path for '+policy.name+' within '+limit+' seeds');
};
const multi=search(multiPolicy,run=>run.highlights.school&&run.highlights.published);
assert.equal(multi.facts.length,46);
assert(multi.memo.highlights.length>=2);
const missedAdmission=search(run=>run.slot<14?2:0,run=>run.admission?.reach&&!run.admission.qualified);
assert(missedAdmission.facts.some(fact=>fact.slot===16),'Missed first choice continues into adult life');
const stoppedProject=search((run,event)=>event.id==='indie-launch'?2:multiPolicy(run,event),run=>run.project.closed==='stop');
assert(!stoppedProject.highlights.published);
const esport=(run,event)=>event.id==='arena-final'?0:defaultChoice(run);
const champ=search((run,event)=>run.slot===11?0:esport(run,event),run=>run.highlights.world);
assert.equal(champ.memo.line,'命运会反复出题，直到你给出新的答案。');
assert(champ.careerLog.some(record=>record.from==='player'));
const pastFinal=search((run,event)=>run.slot===11?0:event.id==='arena-final'?2:defaultChoice(run),run=>run.facts.some(fact=>fact.eventId==='arena-final'));
assert.equal(pastFinal.facts.length,46);
assert(!pastFinal.highlights.world);

const early=search(freshPath(),run=>run.memo.kind==='early',1500);
assert(early.facts.length<46);
assert.equal(early.facts.at(-1).eventId,'early-goodbye');
const testEarly = play(85017,freshPath(),rest,E.create(85017,{scenario:'early'}));
assert.equal(testEarly.memo.kind,'early');

const keep = (run) => { rest(run); if (run.slot===28)run.draft.items={lamp:'keep',console:'keep'}; };
const discard = (run) => { rest(run); if (run.slot===28)run.draft.items={lamp:'discard',console:'give'}; };
const both = (run,event)=>run.slot===11?1:event.id==='indie-launch'?2:defaultChoice(run);
const kept=play(1,both,keep), removed=play(1,both,discard);
assert.equal(kept.items.lamp.state,'display');
assert(kept.facts.filter(fact=>fact.echoes.some(item=>item.id==='lamp')).length>=2);
assert.equal(removed.items.lamp.state,'discarded');
assert.equal(removed.items.console.state,'given');
assert(!removed.facts.some(fact=>fact.slot>28&&fact.echoes.some(item=>item.id==='lamp'||item.id==='console')));

const before = JSON.stringify(kept);
const forkA=E.fork(kept,28);
const forkB=E.fork(kept,28);
assert(forkA&&forkB);
assert.deepEqual(forkA.facts,kept.facts.slice(0,27));
assert.deepEqual(play(1,both,keep,forkA).facts,kept.facts);
assert.notDeepEqual(play(1,both,discard,forkB).facts,kept.facts);
assert.equal(JSON.stringify(kept),before,'Source life and its snapshots remain intact');

const tree={reward:false};
assert.equal(E.claimEnding(tree,kept),1);
assert.equal(E.claimEnding(tree,forkB),0);
assert.equal(E.claimEnding(tree,JSON.parse(JSON.stringify(kept))),0);
assert.equal(E.claimEnding({reward:false},early),1);
assert.equal(E.claimEnding({reward:false},testEarly),0);

const routeToRain = E.create(12);
while(routeToRain.slot<36)choose(routeToRain,freshPath(2)(routeToRain,E.currentCard(routeToRain)),rest);
assert.equal(E.currentCard(routeToRain).id,'rain-shift');
const cautious=E.copy(routeToRain), unprotected=E.copy(routeToRain);
choose(cautious,0);
choose(unprotected,2);
assert(cautious.stats.health>unprotected.stats.health);
assert(cautious.stats.money<unprotected.stats.money || unprotected.low?.type==='delivery');

const puzzle=E.create(88);
while(puzzle.slot<12)choose(puzzle,defaultChoice(puzzle));
assert(E.beginActivity(puzzle,'study',5000));
const cell=puzzle.activity.tiles.findIndex((_,i)=>E.nearby(puzzle.activity.tiles,i).length>1);
assert(E.activityMove(puzzle,cell,5500));
const reloaded=JSON.parse(JSON.stringify(puzzle));
assert.equal(reloaded.activity.tiles.length,42);
assert(E.activityMove(reloaded,'finish',35001));
assert.equal(E.activityMove(reloaded,'finish',35002),false);

console.log('PASS · '+C.cards.length+' cards, four jobs, three dreams, multiple highlights, natural and debug early endings, item history, fork reproducibility, puzzle resume.');
console.log('Seed examples · school + indie',multi.seed,'champion',champ.seed,'early',early.seed);

const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
let time = 0, nextFrame;
const media = {matches:false};
const context = vm.createContext({
  performance:{now:()=>time},matchMedia:()=>media,
  requestAnimationFrame:callback=>{nextFrame=callback;return 1;},
  cancelAnimationFrame:()=>{nextFrame=null;}
});
for(const filename of ['sprite-data.js','scenes.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..',filename),'utf8'),context);
}
const pixels = ['child','adult','elder','rain','dust','leaves','album'].map(tag=>({
  dataset:{sprite:tag,play:tag==='album'?'once':'loop'},style:{}
}));
const board={querySelectorAll:()=>pixels};
context.LifeScenes.animate(board,'auto','room');
const firstPositions=pixels.map(sprite=>sprite.style.backgroundPosition);
time=1150;nextFrame(time);
assert(pixels.every((sprite,i)=>sprite.style.backgroundPosition!==firstPositions[i]));
media.matches=true;
context.LifeScenes.animate(board,'auto','room');
assert.deepEqual(pixels.map(sprite=>sprite.style.backgroundPosition),firstPositions);
assert.equal(nextFrame,null);
context.LifeScenes.animate(board,'on','room');
assert.equal(typeof nextFrame,'function');
console.log('PASS · character, room and prop frames advance and respect motion settings.');
