'use strict';

const assert = require('node:assert/strict');
require('../content.js');
require('../engine.js');
const C = globalThis.LifeContent;
const E = globalThis.LifeEngine;

function plan(run,choice) {
  const card = E.currentCard(run);
  run.entered = true;
  run.draft.main = typeof choice === 'number' ? card.choices[choice].id : choice;
  if (C.familySlots.includes(run.slot)) run.draft.parent = 2;
  return E.preview(run);
}

function settle(run) {
  assert(E.commit(run),run.eventId);
  const fact = run.facts.at(-1);
  assert(E.advance(run),run.eventId);
  return fact;
}

function ordinary(run,career='sanitation') {
  const card = E.currentCard(run);
  if(run.slot === 14) return card.choices[1].id;
  if(run.slot === 23) return card.choices.find(choice => choice.commands.includes('job:'+career)).id;
  return card.choices.find(choice => !choice.commands.some(command => ['thread:indie','thread:esport','meet:friend','setback:office','setback:sanitation','setback:factory','rain:0'].includes(command))).id;
}

function through(run,until,policy=ordinary) {
  while (run.stage !== 'memoir' && run.slot < until) {
    plan(run,policy(run));
    settle(run);
  }
  return run;
}

const admissions = through(E.create(1),14);
const steady = E.copy(admissions), reach = E.copy(admissions);
plan(steady,1); settle(steady);
plan(reach,0); settle(reach);
assert.equal(steady.eventId,'life-15');
assert.equal(reach.eventId,'school-result');

const beforePreparation = through(E.create(1),21);
const trained = E.copy(beforePreparation), untrained = E.copy(beforePreparation);
plan(trained,1); settle(trained);
plan(untrained,0); settle(untrained);
through(trained,23); through(untrained,23);
const schoolStress = trained.stats.stress, otherStress = untrained.stats.stress;
assert.equal(plan(trained,ordinary(trained,'factory')).opportunities[0].status,'派上用场');
assert.equal(plan(untrained,ordinary(untrained,'factory')).opportunities[0].status,'选择了另一条路');
assert.match(settle(trained).text,/毕业前问过的安排/);
settle(untrained);
assert.equal(trained.stats.stress-schoolStress,untrained.stats.stress-otherStress-3);

const invitations = through(E.create(1),33);
assert.equal(invitations.eventId,'life-33');
const project = E.copy(invitations), work = E.copy(invitations), rest = E.copy(invitations);
assert.deepEqual(plan(project,1).opportunities.map(opportunity => [opportunity.id,opportunity.status]),[
  ['work','顺延一轮'],['project','优先安排'],['rest','顺延一轮']
]);
const projectMoney = project.stats.money;
assert.equal(settle(project).opportunities[1].status,'优先安排');
assert.equal(project.project.points,1);
assert.equal(project.stats.money,projectMoney+150);
plan(work,0); assert.equal(settle(work).opportunities[1].status,'报名截止');
plan(rest,2); assert.equal(settle(rest).opportunities[2].status,'优先安排');
through(work,35); through(rest,35); through(project,35);
assert.equal(project.eventId,'indie-rights');
const workCash=work.stats.money, restCash=rest.stats.money;
plan(work,1); assert.match(settle(work).text,/拿到额外的补贴/);
plan(rest,1); assert.match(settle(rest).text,/先前留出的休息生效/);
assert.equal(work.stats.money-workCash,750);
assert.equal(rest.stats.money-restCash,60);

const slow = through(E.create(57),38);
assert.equal(slow.low,null);
slow.stats.stress = 82; // Exercise the exact state at the documented 85-point threshold.
plan(slow,0); assert.match(settle(slow).text,/收入暂时中断/);
assert.deepEqual(slow.low,{type:'overload',slot:38,status:'active'});
plan(slow,ordinary(slow)); assert.match(settle(slow).text,/500 元生活支出/);
through(slow,41);
assert.equal(slow.eventId,'late-recovery');
plan(slow,0); settle(slow);
assert.equal(slow.low.status,'recovering');
through(slow,44);
assert.equal(slow.low.status,'resolved');
assert.match(slow.facts.find(fact=>fact.slot===43).text,/恢复安排渐渐稳定/);

const moving = through(E.create(1),28,run=>run.slot===11?0:ordinary(run));
assert.equal(moving.items.lamp.state,'display');
assert.equal(moving.items.console.state,'display');
plan(moving,1);
moving.draft.items = {lamp:'give',console:'store'};
settle(moving);
through(moving,44,run=>run.slot===38?2:ordinary(run));
const archivePlan = plan(moving,1);
assert(archivePlan.reuse.includes('console'));
assert(!archivePlan.reuse.includes('lamp'));
const oldDraft = E.copy(moving);
delete oldDraft.draft.reuse;
assert(archivePlan.reuse.includes(E.preview(oldDraft).reuseSelected));
const defaultClick = E.copy(moving);
defaultClick.draft.reuse = archivePlan.reuseSelected;
assert.deepEqual(settle(defaultClick),settle(oldDraft));
assert.equal(defaultClick.historyKey,oldDraft.historyKey);
moving.draft.reuse='console';
const reuseFact = settle(moving);
assert.deepEqual(reuseFact.reused,['console']);
assert.equal(moving.items.console.state,'display');
assert.equal(moving.items.console.last,44);
assert.equal(moving.items.lamp.state,'given');

const independent = through(E.create(1),45,run=>run.slot===11?1:0);
assert.equal(independent.eventId,'indie-memory');
assert.equal(independent.items.lamp.state,'display');
plan(independent,0);
assert.deepEqual(settle(independent).reused,['prototype']);
assert.equal(independent.items.lamp.last,2);

const earlierRelationship = through(E.create(1),41,run=>[1,5].includes(run.slot) ? (run.slot===1 ? 0 : 1) : ordinary(run));
assert.equal(earlierRelationship.people.friend.status,'lost');
assert(earlierRelationship.facts[39].relations.some(relation=>relation.id==='friend'&&relation.status==='lost'));
const distant = E.copy(earlierRelationship), reconnected = E.copy(earlierRelationship);
const former = E.copy(earlierRelationship);
former.people.friend.status='dead';
assert.equal(plan(former,1).choice.commands.includes('meet:friend'),false);
settle(former);
through(former,47);
assert(!former.facts.filter(fact=>fact.slot>=41).some(fact=>fact.people.includes('friend')||fact.echoes.some(echo=>echo.person==='friend')));
assert.notEqual(former.memo.related.person,C.people.friend);
assert.match(plan(reconnected,1).choice.label,/失联/);
assert(settle(reconnected).relations.some(relation=>relation.id==='friend'&&relation.status==='reconnected'));
assert.equal(reconnected.people.friend.first,1);
plan(reconnected,ordinary(reconnected));
const echo = settle(reconnected).echoes.find(echo=>echo.person==='friend');
assert.equal(echo.sourceSlot,1);
through(distant,47); through(reconnected,47);
assert.notEqual(distant.memo.related.person,C.people.friend);
assert.equal(reconnected.memo.related.person,C.people.friend);
assert(reconnected.facts.some(fact=>fact.age === reconnected.memo.related.age && fact.people.includes('friend')));

const snapshot = JSON.stringify(reconnected);
const alternate = E.fork(reconnected,40);
assert(alternate);
assert.deepEqual(alternate.facts,reconnected.facts.slice(0,39));
plan(alternate,ordinary(alternate)); settle(alternate);
plan(alternate,1); settle(alternate);
through(alternate,47);
assert.deepEqual(alternate.facts,reconnected.facts);
assert.equal(JSON.stringify(reconnected),snapshot);

const wishes = through(E.create(1),14);
plan(wishes,1);
// Use a current wish whose resolution does not depend on this choice.
wishes.wish = {id:'rank',status:'active',since:11};
wishes.draft.wish = 'pause';
settle(wishes);
assert.equal(wishes.wishLog.filter(wish=>wish.id==='rank'&&wish.status==='paused').length,1);

console.log('PASS · preparation, opportunity windows, lasting recovery, targeted reuse, contact continuity, factual memoir, deterministic replay.');

const firstDay=E.create(17);
assert.equal(plan(firstDay,0).day.mainBlocks,2);
assert.equal(E.chooseDayExtra(firstDay,'quiet'),false,'Full-day plans cannot take a second action');
const shortDay=plan(firstDay,1).day;
assert.equal(shortDay.mainBlocks,1);
const oneAction=E.copy(firstDay);
assert(E.chooseDayExtra(firstDay,'quiet'));
const twoActions=JSON.parse(JSON.stringify(firstDay));
assert.equal(E.preview(twoActions).day.extra.id,'quiet');
assert.equal(E.preview(twoActions).day.used,2);
assert.deepEqual(settle(firstDay),settle(twoActions),'Reloading a planned second action preserves the result');
assert(settle(oneAction).dayExtra===undefined);
assert.equal(twoActions.stats.stress,oneAction.stats.stress-2);
assert.equal(twoActions.stats.mood,oneAction.stats.mood+2);
assert.notEqual(twoActions.historyKey,oneAction.historyKey);

const rainPrep=through(E.create(1),30);
assert.equal(plan(rainPrep,1).day.mainBlocks,1);
assert(E.chooseDayExtra(rainPrep,'gear'));
settle(rainPrep);
assert(Object.hasOwn(rainPrep.experience,'safety'));
through(rainPrep,36);
assert(E.preview(rainPrep).options.includes('safety'),'A short preparation can be called on in a later risk turn');

const pack=through(E.create(1),28,run=>run.slot===11?0:ordinary(run));
plan(pack,0);
assert.equal(E.placeItem(pack,'lamp','bad-target'),false);
assert.equal(E.placeItem(pack,'missing','store'),false);
assert(E.placeItem(pack,'lamp','store'));
assert(E.placeItem(pack,'console','give'));
assert(E.placeItem(pack,'lamp','default'));
assert(E.placeItem(pack,'lamp','store'));
const packReload=JSON.parse(JSON.stringify(pack));
assert.deepEqual(settle(pack),settle(packReload));
assert.equal(pack.items.lamp.state,'stored');
assert.equal(pack.items.console.state,'given');
assert.equal(E.placeItem(pack,'lamp','keep'),false,'Packing closes when the event settles');
console.log('PASS · day capacity, real second-action effects, draft reload, and old-item placements.');

const keepsakes=through(E.create(1),28,run=>[11,22].includes(run.slot)?0:ordinary(run));
assert(E.held(keepsakes.items.yearbook));
assert.match(E.currentCard(keepsakes).body,/阿宁来帮忙/);
const solo=E.copy(keepsakes);
solo.people.friend.status='lost';
assert.match(E.currentCard(solo).body,/独自|安静/);
plan(keepsakes,0);
assert(E.placeItem(keepsakes,'lamp','keep'));
assert(E.placeItem(keepsakes,'yearbook','keep'));
assert.equal(E.packingPlan(keepsakes,'keep').lamp,'store');
settle(keepsakes);
assert.equal(keepsakes.items.yearbook.state,'display');
assert.equal(keepsakes.items.lamp.state,'stored');

const table=through(E.create(5),4);
assert(E.beginActivity(table,'duel'));
assert.equal(E.activityMove(table,'fact-99'),false);
assert(E.activityMove(table,'fact-1'));
assert(E.activityMove(table,'dish'));
assert.equal(table.activity,null);
plan(table,0);
assert.deepEqual(settle(table).table,['fact-1','dish']);

const beforeMail=through(E.create(1),41,run=>[1,22].includes(run.slot)?0:ordinary(run));
plan(beforeMail,1);
settle(beforeMail);
assert.equal(beforeMail.people.friend.status,'in-touch');
plan(beforeMail,0);
beforeMail.draft.postcard='yearbook';
const photoReply=settle(beforeMail);
assert.match(photoReply.text,/耳朵/);
assert.equal(photoReply.postcard,'yearbook');
console.log('PASS · one bedside place, moving alone or together, lived-experience dinner and an old friend replying to the yearbook.');
