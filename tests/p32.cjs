'use strict';
const assert=require('node:assert/strict'),test=require('node:test');
const {settle}=require('./p2-paths.cjs');
const {lives,main}=require('./p32-lives.cjs');
const E=LifeEngine,R=LifeRoutes;
function walk(life,until=47){
  const r=E.create(life.seed,{childhood:'spring-gift'});r.branchId='walk';
  while(!r.memo&&r.slot<until){
    const o=main(r,life);
    if(o.inspect!=null)assert(E.inspectSample(r,o.inspect));
    const instruction=life.actions[r.slot];
    if(instruction){
      const [key,m]=instruction.split(':');assert(E.chooseDream(r,...key.split('/')),r.slot+' unavailable '+key+' '+r.eventId);
      const selected=R.options(r).find(o=>o.key===key);
      for(const s of selected.steps??[])assert(R.chooseStep(r,s.choices.find(c=>!c.retry).id));
      if(selected.methods)assert(R.chooseMethod(r,m&&selected.methods.some(c=>c.id===m)?m:selected.methods.find(c=>!c.retry).id));
      r.entered=true;r.draft.main=o.id;r.draft.parent=0;
      assert(E.canApply(r),r.slot+' '+key+' '+E.preview(r).route?.error);
    }
    settle(r,o.id);assert(E.advance(r));
  }
  if(until===47)assert.equal(r.slot,46);
  return r;
}
function checkLife(life,r){
  const row=(id)=>LifeChapters.records(r,id).at(-1)?.a.result;
  const dream=LifeRoutes.dreams(r);
  const save=LifeSave.fresh();save.active='walk';save.trees.t={birth:r.birth};save.branches.walk={tree:'t',run:r};assert(LifeSave.validateImport(save));
  switch(life.name){
    case '少年赛场': case '成年试训':
      if(life.name==='少年赛场')assert.equal(row('01-world-series').achieved,true);
      assert.equal(row('01-cup').outcome,'通过');assert(row('01-regional').played);assert.equal(row('01-pro').newJob,'player');break;
    case '竞技未竟':assert.equal(row('01-trial').outcome,'资格不足');assert.equal(dream['01'].state,'redirected');break;
    case '少年本科':case '在职重考':case '本科后读研':{
      const diploma=row('03-degree');assert.equal(diploma.school,'北京大学');assert.equal(diploma.level,life.name==='本科后读研'?'ms':'ug');
      assert(diploma.graduationYear-diploma.entryYear>=(diploma.level==='ms'?3:4));
      assert.equal(r.facts[13].highlights.includes('school'),life.name==='少年本科');
      assert.equal(dream['03'].state,'achieved');break;
    }
    case '重考落选':assert.equal(row('03-exam-ug').outcome,'本次未通过');assert(!row('03-degree'));break;
    case '工厂附近的家':case '搬离再安顿':case '退租再寻找':assert.equal(dream['29'].state,'achieved');assert.equal(row('29-stay').place,life.name==='工厂附近的家'?'里巷':'河街');break;
    case '租住未竟':assert.equal(dream['29'].state,'paused');assert(!row('29-stay'));break;
    case '办公室交接':assert(row('J01-handover-sheet'));assert.deepEqual(dream,{});break;
    case '并组撤岗':assert.equal(row('J01-redundancy').newJob,null);assert.equal(row('J03-hire-delivery').newJob,'delivery');break;
    case '离职再聘':assert.equal(row('J01-resign-office').newJob,null);assert.equal(row('J02-hire-factory').newJob,'factory');break;
    case '制造带教':assert(row('J02-teach'));assert.deepEqual(dream,{});break;
    case '工位转向':assert(row('J02-resign-factory'));assert.equal(row('J03-drop').servicePay,18);break;
    case '街区老客':assert(row('J03-street'));assert.deepEqual(dream,{});break;
    case '站点调度':assert(!row('J03-drop').delivered);assert.equal(row('J03-drop').servicePay,0);assert(row('J03-dispatch'));break;
  }
}
if(require.main===module){
  for(const life of lives)test(life.name,()=>checkLife(life,walk(life)));
  test('送餐草稿可刷新，错误封签、跳过路线、改写回执都不能正式交付',()=>{
    const r=walk(lives.find(l=>l.name==='街区老客'),24);assert(E.chooseDream(r,'J03','drop'));
    r.entered=true;r.draft.main=E.currentCard(r).choices[0].id;r.draft.parent=0;
    assert(R.chooseStep(r,'eta'));assert(R.chooseStep(r,'white'));assert.deepEqual(r.draft.routeSteps,['eta']);
    const draft=E.copy(r);assert(!E.commit(r));assert.deepEqual(r,draft);
    for(const id of ['blue','east'])assert(R.chooseStep(r,id));assert(R.chooseMethod(r,'receipt'));assert(E.commit(r));assert(!E.commit(r));
    const s=LifeSave.fresh();s.active='walk';s.trees.t={birth:r.birth};s.branches.walk={tree:'t',run:r};
    assert(LifeSave.validateImport(s));r.facts.at(-1).actions[0].payload.steps[1]='white';assert(!LifeSave.validateImport(s));
  });
  test('工艺权限、实际样单与本科资格必须各有出处，停班与满班争用资源',()=>{
    const r=walk(lives.find(l=>l.name==='制造带教'),24);
    assert(!E.chooseDream(r,'J02','release'));assert(!E.chooseDream(r,'J02','quality'));assert(!E.chooseDream(r,'03','apply-ms'));
    assert(E.chooseDream(r,'J02','factory-full'));settle(r,E.currentCard(r).choices[0].id);E.advance(r);
    assert(E.chooseDream(r,'29','walk-block'));R.chooseMethod(r,'river');assert.match(E.preview(r).route.error,/排满/);
    assert(E.chooseDream(r,'J02','factory-study'));settle(r,E.currentCard(r).choices[0].id);E.advance(r);
    assert(E.chooseDream(r,'J02','training'));R.chooseMethod(r,'hold');assert.match(E.preview(r).route.error,/出勤/);
    const o=walk(lives.find(l=>l.name==='离职再聘'),24);settle(o,'office-24-0');E.advance(o);assert(!E.chooseDream(o,'J01','sheet'));
  });
  test('搬迁不会确立梦想，缺少入住不能产生回望，第二处住处需要独立布置',()=>{
    const l=lives.find(l=>l.name==='搬离再安顿');
    for(const [slot,op] of [[26,'stay'],[27,'settle-room'],[33,'stay']]){const r=walk(l,slot);assert(!E.chooseDream(r,'29',op));}
    const r=walk(l,33);const home=LifeChapters.residence(r);assert.equal(home.a.result.name,'河街');assert.equal(home.a.result.depositBack,50);
  });
  test('没有个人上场记录不能得到个人赛果，训练不足者保留未竟人生',()=>{
    const l=lives[0];const r=walk({...l,actions:{...l.actions,25:'01/regional:bench'}},27);
    assert(E.chooseDream(r,'01','cup'));R.chooseMethod(r,'play');assert.equal(E.preview(r).route.receipt.result.outcome,'资格不足');
    assert(!r.highlights.olympic);
  });
}
module.exports={walk,checkLife};
