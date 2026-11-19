'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {reach,settle}=require('./p2-paths.cjs');
const E=LifeEngine,R=LifeRoutes,S=LifeSave;
const proof=[],boundaries=[];
function choice(r){
  if(r.slot===7)return 'life-7-0';
  if(r.slot===11)return 'life-11-0';
  if(r.slot===23)return E.currentCard(r).choices.find(c=>c.commands.includes('job:office')).id;
  const c=E.currentCard(r),day=LifeContent.dayPlans[c.id];
  return c.choices[day?Math.max(0,day.costs.indexOf(1)):0].id;
}
function main(r){r.entered=true;r.draft.main=choice(r);r.draft.parent=0;}
function step(r,key){
  if(key)assert(E.chooseDream(r,...key.split('/')),key+' at '+r.slot);
  main(r);
  const f=settle(r,r.draft.main);
  if(key)proof.push(f);
  assert(E.advance(r));return f;
}
function to(r,slot){while(r.slot<slot&&!r.memo)step(r);return r;}
function start(){return reach(1,12,r=>[7,11].includes(r.slot)?choice(r):undefined);}
function both(){const r=start();step(r,'01/establish');step(r,'03/establish');return r;}
function file(r){const s=S.fresh();s.active='walk';s.trees.t={birth:r.birth};s.branches.walk={tree:'t',run:r};return s;}
function rejected(r){const before=E.copy(r);assert(!E.canApply(r));assert(!E.commit(r));assert.deepEqual(r,before);}
test('M01 prior contact is required',()=>{const r=reach(1,7);assert(!E.chooseDream(r,'03','establish'));assert.deepEqual(R.candidates(r),[]);});
test('M02 discovered goals wait, adult consultation creates a sourced alternative',()=>{
  const r=to(start(),24);assert.deepEqual(R.dreams(r),{});const contact=step(r,'03/ask-grad');assert.match(contact.actions[0].result.detail,/学历/);
  assert(R.candidates(r).find(c=>c.id==='03').sources.some(s=>s.slot===24&&s.actionId));step(r,'03/establish');
  assert.equal(R.dreams(r)['03'].age,LifeContent.ages[24]);
});
test('M03 independent goals, draft cancellation and duplicate establishment',()=>{
  const r=both();assert(!E.chooseDream(r,'03','establish'));assert(E.chooseDream(r,'01','pause'));assert(E.chooseDream(r,'01','cancel'));assert.equal(R.dreams(r)['01'].state,'active');
  step(r,'01/pause');assert.equal(R.dreams(r)['03'].state,'active');
});
test('M04 resumption rechecks availability and preserves investments',()=>{
  const r=both();step(r,'01/replay');step(r,'01/pause');assert(!E.chooseDream(r,'01','replay'));step(r,'01/resume');
  const d=R.dreams(r)['01'];assert.equal(d.changes.length,3);assert.equal(d.investments[0].slot,14);
  to(r,41);assert(!E.chooseDream(r,'01','resume'));
});
function declaration(id){return {id,type:'dream',version:1,goal:'测试排练',window:[11,32],contact:f=>f.choiceId==='life-11-0',actions:[
  {id:'practice-'+id,label:'记录节奏',kind:'investment',feedback:'节奏已记下',shareWith:['01'],time:1,energy:1,money:17,available:r=>r.slot<32}]};}
test('E01 declarations reject collisions, unsupported versions, missing conditions and invalid amounts',()=>{
  for(const mutate of [r=>r.version=2,r=>r.id='01',r=>delete r.contact,r=>r.actions[0].money=-1,r=>r.actions[0].kind='free-win']){const d=declaration('invalid');mutate(d);assert.throws(()=>R.register(d));}
});
test('E02 E03 M05 declarative extension has its own history and one shared practice cost',()=>{
  R.register(declaration('test-stage'));const r=both();step(r,'test-stage/establish');to(r,24);const control=E.copy(r);const f=step(r,'test-stage/practice-test-stage');step(control);
  assert.equal(control.stats.money-r.stats.money,17);assert.deepEqual(f.actions[0].routeIds,['test-stage','01']);
  assert.deepEqual(R.dreams(r)['01'].investments,R.dreams(r)['test-stage'].investments);assert.equal(R.dreams(r)['03'].investments.length,0);
  assert(S.validateImport(file(r)));
});
test('M06 conflicts reject the entire transaction for time, energy and personal cash',()=>{
  const r=both();to(r,16);main(r);const card=E.currentCard(r);r.draft.main=card.choices[0].id;assert(E.chooseDream(r,'01','replay'));assert.match(E.preview(r).route.error,/时间/);rejected(r);
  const cash=to(both(),24);main(cash);cash.stats.money=49;assert(E.chooseDream(cash,'01','scrimmage'));assert.match(E.preview(cash).route.error,/存款/);rejected(cash);
  const tired=both();main(tired);tired.stats.body=20;tired.draft.support=['rest','family'];assert(E.chooseDream(tired,'01','replay'));assert.match(E.preview(tired).route.error,/精力/);rejected(tired);
});
test('M07 E04 working time and one salary for shared job and study evidence',()=>{
  const source=to(both(),24),control=E.copy(source);step(control);
  for(const [mode,amount] of Object.entries({full:300,part:150,study:0,leave:0})){
    const r=E.copy(source);const f=step(r,'J01/shift-'+mode);assert.equal(f.pay.amount,amount);assert.equal(f.pay.paySourceId,'office-24');
    assert.equal(r.stats.money,control.stats.money-300+amount);
    main(r);assert(E.chooseDream(r,'03','revise'));
    const forged=E.copy(r);forged.facts.at(-1).pay.amount+=100;assert(!S.validateImport(file(forged)));
    if(mode==='full'){rejected(r);continue;}
    const next=step(r,'03/revise');assert.equal(next.pay.amount,amount);assert.equal(R.dreams(r)['03'].investments.at(-1).slot,next.slot);assert(S.validateImport(file(r)));
  }
});
function attempt(seed,count){
  const r=reach(seed,12,r=>[7,11].includes(r.slot)?choice(r):undefined);step(r,'01/establish');
  for(let i=0;i<count;i++)step(r,'01/replay');to(r,24);main(r);assert(E.chooseDream(r,'01','scrimmage'));return r;
}
test('M08 qualification, bounded deterministic external factor and real preparation',()=>{
  const no=attempt(1,0);no.stats.skill=100;assert.equal(E.preview(no).route.receipt.result.outcome,'资格不足');
  let improved=false,failed=false;
  for(let seed=1;seed<=18;seed++){const a=E.preview(attempt(seed,2)).route.receipt.result,b=E.preview(attempt(seed,3)).route.receipt.result;
    boundaries.push({seed,attempt:a.attemptId,external:a.external,two:a.outcome,three:b.outcome});
    assert.equal(a.external,b.external);assert(Math.abs(a.external)<=2);improved||=a.outcome!==b.outcome;failed||=b.outcome==='本次未通过';}
  assert(improved&&failed);
});
test('M09 immutable attempt, restored draft, invalid imports and obsolete draft cleanup',()=>{
  const r=attempt(1,3);const before=E.preview(r).route.receipt;const restored=S.decode(JSON.stringify(file(r))).branches.walk.run;assert.deepEqual(E.preview(restored).route.receipt,before);
  assert(E.commit(r));assert(!E.commit(r));proof.push(r.facts.at(-1));assert.deepEqual(r.facts.at(-1).actions[0],before);
  assert(S.validateImport(file(r)));for(const change of [a=>a.costs.money=0,a=>a.routeIds=['07'],a=>a.result.outcome='冠军',a=>a.sourceRefs=[],a=>a.payload.ruleVersion=2]){
    const fake=E.copy(r);change(fake.facts.at(-1).actions[0]);assert(!S.validateImport(file(fake)));}
  restored.draft.route='gone/act';assert(!S.decode(JSON.stringify(file(restored))).branches.walk.run.draft.route);
});
test('M10 visible deferral, unseen, expired, invalidated and real continuation',()=>{
  const r=to(both(),24);R.see(r,'03/ask-grad');R.see(r,'03/ask-undergrad');R.see(r,'01/scrimmage');const f=step(r);assert(f.routeOffers.some(e=>e.status==='unseen'));assert(f.routeOffers.some(e=>e.status==='expired'));assert(f.routeOffers.some(e=>e.key==='03/ask-grad'&&e.status==='deferred'));
  const g=step(r,'03/ask-grad');assert.equal(g.routeOffers.find(e=>e.key==='03/ask-grad').continuedFrom.slot,24);
  const h=step(r);assert(h.routeOffers.some(o=>o.key==='03/ask-undergrad'&&o.status==='invalidated'&&o.previous.slot===24));
});
test('M11 M12 E05 legacy life and memoir survive route registration and isolated forks',()=>{
  const life=()=>{const r=reach(1,46);settle(r);E.advance(r);return r;};const old=life();assert.equal(old.facts.length,46);assert.deepEqual(R.dreams(old),{});assert(S.validateImport(file(old)));
  const collisions=()=>[[425,39],[474,45]].map(([seed,slot])=>reach(seed,slot));
  const original=collisions();R.register(declaration('test-other'));assert.deepEqual(collisions(),original);assert.deepEqual(life(),old);
  const r=both();to(r,46);step(r);const fork=E.fork(r,23);assert(fork);const state=E.copy(r);step(fork,'03/pause');assert.deepEqual(r,state);assert.equal(R.dreams(fork)['03'].state,'paused');
});
test('adult first contact without a school candidate; distinct methods and absent route code',()=>{
  const r=reach(1,24,x=>x.slot===7?'life-7-2':x.eventId.startsWith('school-')?E.currentCard(x).choices.at(-1).id:undefined);
  assert(!R.candidates(r).some(c=>c.id==='03'));step(r,'03/ask-undergrad');step(r,'03/establish');
  assert(E.chooseDream(r,'03','revise'));assert(R.chooseMethod(r,'check'));assert(!R.chooseMethod(r,'fake'));
  const receipt=step(r,'03/revise').actions[0];assert.equal(receipt.payload.method,'check');
  R.register(declaration('test-archive'));const fixture=both();step(fixture,'test-archive/establish');assert(E.chooseDream(fixture,'test-archive','practice-test-archive'));
  const input=JSON.stringify(file(fixture));
  const code="require('./tests/p2-paths.cjs');const s=LifeSave.decode(require('fs').readFileSync(0,'utf8'));process.stdout.write(JSON.stringify(s.branches.walk.run))";
  const offline=JSON.parse(require('node:child_process').execFileSync(process.execPath,['-e',code],{input,cwd:path.resolve(__dirname,'..')}));
  assert.deepEqual(offline.facts,fixture.facts);assert.equal(offline.draft.route,undefined);
});
test('E04 one inspected work sample supports a later goal without a second wage or duplicate item',()=>{
  const route=declaration('test-archive-work');route.contact=f=>f.inspected==='cost-center';
  route.window=[24,32];R.register(route);
  const r=to(both(),24),no=E.copy(r);
  step(no,'J01/shift-part');assert(!R.candidates(no).some(c=>c.id===route.id));
  assert(E.inspectSample(r,1));const f=step(r,'J01/shift-part');
  const source=R.candidates(r).find(c=>c.id===route.id).sources[0];assert.equal(source.slot,f.slot);assert.equal(f.inspected,'cost-center');
  const control=E.copy(r);step(control);step(r,route.id+'/establish');
  assert.deepEqual(r.items,control.items);assert.equal(r.stats.money,control.stats.money);assert.equal(f.pay.amount,150);
  assert.equal(R.dreams(r)[route.id].investments.length,0);
});
test('route-defined qualifications, terminal outcome and eligibility to resume are replayable',()=>{
  const d=declaration('test-assessment');d.canPursue=r=>r.slot!==15;
  d.actions.push({id:'tryout-badge',kind:'qualification',label:'交验样卷',feedback:'样卷核对通过',available:r=>r.slot>=24,time:1,energy:1,money:0},
    {id:'final-reading',kind:'fate-result',label:'参加朗读',available:r=>r.slot>=25,
     attempt:()=>'reading-one',qualification:r=>R.history(r,d.id,'qualification').map(h=>h.source),
     judge:()=>true,completeOnPass:true,next:'留存录音',time:1,energy:1,money:0});
  R.register(d);const r=start();step(r,d.id+'/establish');step(r,d.id+'/pause');step(r);
  assert(!E.chooseDream(r,d.id,'resume'));step(r);step(r,d.id+'/resume');to(r,24);step(r,d.id+'/tryout-badge');
  step(r,d.id+'/final-reading');assert.equal(R.dreams(r)[d.id].state,'achieved');assert(S.validateImport(file(r)));
  assert(!E.chooseDream(r,d.id,'final-reading'));
});
test('a two-block professional action must own the matching main scene',()=>{
  const d=declaration('test-full-day');d.actions[0].time=2;d.actions[0].money=0;
  d.actions[0].mainChoices=['office-24-0'];R.register(d);
  const r=start();step(r,d.id+'/establish');to(r,24);
  assert(E.chooseDream(r,d.id,d.actions[0].id));main(r);r.draft.main='office-24-1';rejected(r);
  r.draft.main='office-24-0';assert.equal(E.preview(r).route.usedTime,2);assert(E.commit(r));assert(S.validateImport(file(r)));
});
test.after(()=>{
  if(!process.env.P3_EVIDENCE)return;
  fs.writeFileSync(path.join(path.dirname(process.env.P3_EVIDENCE),'evidence','fate-boundaries.json'),JSON.stringify(boundaries,null,2)+'\n');
  const samples=new Map();
  for(const f of proof){
    const a=f.actions[0];
    samples.set([a.actionId,a.payload.method,a.result.outcome,f.pay?.mode].join('/'),{
      branch:f.branch,slot:f.slot,age:f.age,eventId:f.eventId,choiceId:f.choiceId,actions:f.actions,pay:f.pay,sourceSlots:f.sourceSlots});
  }
  fs.writeFileSync(path.resolve(process.env.P3_EVIDENCE),JSON.stringify([...samples.values()],null,2)+'\n');
});
