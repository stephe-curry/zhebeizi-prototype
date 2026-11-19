'use strict';
const assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
const {walk}=require('./p32.cjs'),{lives}=require('./p33-lives.cjs');
const shots={'02':'stride','07':'patch','08':'inventory','11':'compose','12':'shoot','25':'paperlesson','30':'leg1'};
for(const life of lives)life.shot=Object.values(life.actions).find(a=>a.startsWith(life.id+'/'+shots[life.id]))??Object.values(life.actions)[0];
function checkLife(life,r){
  assert(r.memo);assert.equal(r.facts.length,r.finalType==='early'?44:46);const dreams=LifeRoutes.dreams(r);
  assert.equal(['redirected','paused'].includes(dreams[life.id].state),life.form==='未竟');
  if(life.form!=='未竟')assert.equal(dreams[life.id].state,'achieved');
  const s=LifeSave.fresh();s.active='walk';s.trees.t={birth:r.birth};s.branches.walk={tree:'t',run:r};assert(LifeSave.validateImport(s),'历史重放失败 '+life.name);
  for(const f of r.facts){
    for(const a of f.actions??[]){
      assert(a.sourceRefs.every(ref=>ref.slot<f.slot));
      if(a.result.unpaidShift&&f.careerAfter)assert.equal(f.pay.amount,0);
      if(a.result.external!=null)assert(Math.abs(a.result.external)<=2);
    }
  }
  if(life.id==='08'&&life.form==='直路')assert.equal(r.facts[22].careerAfter,null);
  const hits=id=>LifeChapters.records(r,id);
  if(life.id==='02')assert.equal(!!r.highlights.olympic,hits('02-podium').some(e=>e.a.result.medal==='gold'));
  if(life.id==='08'&&hits('08-handoff').length){assert(hits('08-diploma')[0].f.age-hits('08-medentry')[0].f.age>=5);assert(hits('08-appointmed')[0].f.age-hits('08-residency')[0].f.age>=3);}
  if(life.id==='30'&&dreams['30'].state==='achieved'){const legs=[1,2,3].map(n=>hits('30-leg'+n).at(-1).a.result);assert.equal(new Set(legs.flatMap(a=>a.countries)).size,6);assert.equal(new Set(legs.flatMap(a=>a.regions)).size,4);}
}
if(require.main===module){
  for(const life of lives)test(life.name,()=>checkLife(life,walk(life)));
  for(const seed of [1,2,3,4,9,12])for(const [id,op] of Object.entries({'02':'lane','07':'issue','08':'observe','11':'verse','12':'extra','25':'visit','30':'board'})){
    test('出生 '+seed+' 可接触并主动确立 '+id,()=>{const life={seed,job:'office',actions:{15:id+'/'+op,16:id+'/establish'}};const r=walk(life,17);
      assert.equal(LifeRoutes.dreams(r)[id].state,'active');assert.equal(r.facts[15].actions[0].sourceRefs[0].actionId,id+'-'+op);});
  }
}
module.exports={browser:{out:process.env.LIFE_P33_EVIDENCE??path.resolve(__dirname,'../docs/v1.4/p3/p3-3/evidence'),lives,checkLife}};
if(require.main===module){
  const by=name=>lives.find(l=>l.name===name);
  const keys=r=>LifeRoutes.options(r).map(o=>o.key);
  const veto=(r,...ids)=>ids.forEach(id=>assert(!keys(r).includes(id),id+' 不应可用'));
  test('起跑、伤病、有效期和本届名单分别约束参赛',()=>{
    const l=by('第一栏·直路');veto(walk({...l,actions:{8:'02/lane',9:'02/establish'}},29),'02/qualmeet','02/selection','02/podium');
    const tired=walk({...l,actions:{...l.actions,11:'02/sets:push'}},13);veto(tired,'02/timed');
    const missed=walk({...l,actions:{...l.actions,29:null,30:null}},31);veto(missed,'02/qualmeet','02/podium');
    for(let seed=1;seed<100;seed++){let r;try{r=walk({...l,seed},32);}catch{continue;}
      if(LifeChapters.records(r,'02-podium').at(-1)?.a.result.medal==='silver'){assert(!r.highlights.olympic);return;}
    }assert.fail('未找到银牌见证');
  });
  test('公司权限和个人公开版本分开，离岗后可继续合法维护',()=>{
    const l=by('站名簿·重拾'),r=walk(l,26);veto(r,'07/releaseoss','07/maintain');assert.equal(LifeRoutes.dreams(r)['07'],undefined);
    const plain=walk({...l,actions:{...l.actions,31:'J05/exitprogrammer'}},35);
    assert.equal(plain.career,null);assert.equal(LifeRoutes.dreams(plain)['07'].state,'achieved');
    const licensed=walk({...l,actions:{...l.actions,29:'07/licensework'}},30);
    const a=licensed.facts.at(-1).actions[0];assert.deepEqual(a.routeIds,['07','J05']);assert.equal(a.result.servicePay,0);assert.equal(licensed.facts.at(-1).pay.amount,150);
  });
  test('医学不能借护理或师范资格；离开全日制学程会中断毕业资格',()=>{
    const l=by('两张交班单·直路');veto(walk(l,17),'08/diploma','08/licexam','08/appointmed','J08/college','03/enrol');
    const r=walk({...l,mainChoices:{23:1},actions:{...l.actions,24:null}},25);assert(r.facts[22].careerAfter);veto(r,'08/diploma','08/appointmed');
    const untrained=walk(by('两根纸条·直路'),24);veto(untrained,'08/registermed','08/handoff');
  });
  test('万人票数只取现场，小场不能支付大场费用；无发行或网络发行不能进赛',()=>{
    const r=walk(by('雨棚·未竟'),26);veto(r,'11/headline');const club=LifeChapters.records(r,'11-club');assert.equal(club.length,1);assert.equal(club[0].a.result.attended,61);
    const l=by('潮痕·直路');veto(walk(l,24),'12/jury','12/festival');veto(walk({...l,actions:{...l.actions,24:'12/releasefilm:stream'}},25),'12/festival','12/jury');
    veto(walk(by('潮痕·未竟'),25),'12/festival','12/jury');
    for(let seed=1;seed<100;seed++){let r;try{r=walk({...l,seed},27);}catch{continue;}
      if(LifeChapters.records(r,'12-jury').at(-1)?.a.result.outcome==='本次未通过'){assert.equal(LifeRoutes.dreams(r)['12'].state,'active');return;}
    }assert.fail('未找到入围落选见证');
  });
  test('普通小学聘任、乡村学生和调动各自保留真实历史',()=>{
    const l=by('两根纸条·重拾');const city=walk(l,29);assert(!LifeRoutes.dreams(city)['25']);veto(city,'25/reunion');
    const away=walk({...l,actions:{...l.actions,35:'25/backcity'}},38);veto(away,'25/reunion');assert.equal(LifeChapters.records(away,'25-paperlesson').length,1);
    assert.equal(LifeChapters.records(away,'25-paperlesson')[0].f.pay.amount,150);
  });
  test('过期、取消和未抵达都不给足迹，旅费不足不部分结算',()=>{
    const l=by('回程线·直路'), booked=walk(l,25);veto(booked,'30/back1','30/back3');assert.equal(LifeChapters.records(booked,'30-leg1').length,0);
    const cancel=walk({...l,actions:{...l.actions,25:'30/cancel1'}},26);veto(cancel,'30/leg1','30/back1');assert.deepEqual(cancel.facts.at(-1).actions[0].result.countries,[]);
    const expired=walk({...l,actions:{...l.actions,25:null,26:null}},27);veto(expired,'30/leg1');
    const r=walk(l,24);r.stats.money=0;assert(LifeEngine.chooseDream(r,'30','book1rail'));assert(LifeRoutes.chooseMethod(r,'do'));
    r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;const before=LifeEngine.copy(r);assert(!LifeEngine.commit(r));assert.deepEqual(r,before);
  });
  test('跨梦想、满班和家庭附加安排共用日程；伪造多人署名的收据不能导入',()=>{
    const l=by('雨棚·重拾'),r=walk({...l,actions:{23:'07/issue',24:'11/verse',25:'11/establish',26:'07/establish',27:'J03/delivery-full'}},28);
    assert.equal(LifeRoutes.dreams(r)['07'].state,'active');assert(LifeEngine.chooseDream(r,'11','compose'));assert(LifeRoutes.chooseMethod(r,'rain'));
    r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;assert.match(LifeEngine.preview(r).route.error,/排满/);
    const done=walk(by('雨棚·直路'));const s=LifeSave.fresh();s.active='walk';s.trees.t={birth:done.birth};s.branches.walk={tree:'t',run:done};assert(LifeSave.validateImport(s));
    LifeChapters.records(done,'11-record')[0].a.result.credits.push('陌生人');assert(!LifeSave.validateImport(s));
  });
}
if(require.main===module){
  test('旅行准备与同一人生的租约、实际租金和出发当期工资逐项结算',()=>{
    const base=lives.find(l=>l.name==='回程线·直路');
    const actions={8:'30/board',9:'30/establish',12:'30/atlas',18:'29/walk-block:lane',19:'29/establish',24:'29/lease-lane:solo',25:'30/book1rail',26:'30/leg1'};
    const r=walk({...base,actions},27);const trip=r.facts.at(-1);
    assert.equal(trip.rent.amount,50);assert.equal(trip.rent.source.actionId,'29-lease-lane');assert.equal(trip.pay.amount,0);assert.equal(trip.actions[0].costs.money,45);
    assert.equal(LifeRoutes.dreams(r)['29'].state,'active');
  });
  test('年度检验的种子、准备和资格复核后相同，低体力无法出发',()=>{
    const base=lives.find(l=>l.name==='回程线·直路'),r=walk(base,25);const key='30/leg1';
    const outcome=r=>LifeRoutes.options(r).find(o=>o.key===key).receipt.result;
    assert.deepEqual(outcome(r),outcome(LifeEngine.copy(r)));assert(LifeEngine.chooseDream(r,'30','leg1'));
    const op=LifeRoutes.options(r).find(o=>o.key===key);for(const step of op.steps)assert(LifeRoutes.chooseStep(r,step.choices[0].id));
    assert(LifeRoutes.chooseMethod(r,'draw'));r.stats.health=20;r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;
    assert.match(LifeEngine.preview(r).route.error,/体力/);const before=LifeEngine.copy(r);assert(!LifeEngine.commit(r));assert.deepEqual(r,before);
  });
}
if(require.main===module)test('医院停薪期间仍可交接离岗；两年后重新核验注册，重聘只发当前岗位工资',()=>{
  const original=lives.find(l=>l.name==='两张交班单·直路');
  const life={...original,actions:{...original.actions,35:'MED/surgeon-leave',36:'MED/exitsurgeon',38:'08/medreview',39:'08/medreturn',40:'MED/exitsurgeon'}};
  const r=walk(life,41);assert.equal(r.facts[34].pay.amount,0);assert.equal(r.facts[35].careerAfter,null);
  assert.equal(LifeChapters.records(r,'08-medreview')[0].a.result.renewedRegistration,true);
  assert.equal(r.facts[38].pay.amount,150);assert.equal(r.facts[39].careerAfter,null);
});
