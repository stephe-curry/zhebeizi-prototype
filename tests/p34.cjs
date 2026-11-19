'use strict';
const assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
const {walk}=require('./p32.cjs'),{lives}=require('./p34-lives.cjs');
const shot={J04:'sell',J05:'debug',J06:'acceptcase',J07:'cookorder',J08:'markwork'};
lives.forEach(l=>l.shot=Object.values(l.actions).find(k=>k.startsWith(l.id+'/'+shot[l.id])));
function checkLife(l,r){
 assert(r.memo);const s=LifeSave.fresh();s.active='walk';s.trees.t={birth:r.birth};s.branches.walk={tree:'t',run:r};assert(LifeSave.validateImport(s));
 if(l.form==='普通')assert.deepEqual(LifeRoutes.dreams(r),{});
 const a=id=>LifeChapters.records(r,id);
 assert(a(l.id+'-'+({J04:'regular',J05:'handover',J06:'publicecho',J07:'tasteecho',J08:'cityecho'}[l.id])).length);
 if(l.id==='J04'){let stock=0;for(const f of r.facts){const v=f.actions?.[0]?.result;stock+=v?.stockDelta??0;assert(stock>=0);if(v?.revenue>0)assert.equal(v.servicePay,v.revenue);}}
 if(l.id==='J07')for(const f of r.facts)if(f.actions?.[0].routeIds.includes('J07'))assert(!f.actions[0].result.servicePay);
}
if(require.main===module){
 for(const l of lives)test(l.name,()=>checkLife(l,walk(l)));
 for(const seed of [1,2,3,4,9,12])for(const [id,key] of Object.entries({J04:'help',J05:'devhire',J06:'notice',J07:'apprentice',J08:'college'})){
  test('出生 '+seed+' 接触 '+id,()=>{const min=id==='J08'?15:24;const r=walk({seed,job:'office',actions:{[min]:id+'/'+key}},min+1);assert(LifeChapters.records(r,id+'-'+key).length);});
 }
 test('库存付款、退货和停业的门槛来自原始收据',()=>{
 const r=walk(lives[0],26);assert(!LifeRoutes.options(r).some(o=>o.key==='J04/sell'));
 const closed=walk(lives.find(l=>l.name==='J04·改变'),31);assert(!LifeRoutes.options(closed).some(o=>o.key==='J04/sell'));
 });
 test('无学历不能报考，无聘任不能办件；未试教不能产生旧生回忆',()=>{
 const r=walk({seed:1,job:'office',actions:{24:'J06/notice'}},25);
 for(const key of ['J06/registercivil','J06/appoint','J06/acceptcase','J08/cityecho'])assert(!LifeRoutes.options(r).some(o=>o.key===key));
 });
}
module.exports={browser:{evidence:'../career-evidence.generated.json',out:process.env.LIFE_P34_EVIDENCE??path.resolve(__dirname,'../docs/v1.4/p3/p3-4/evidence'),lives,checkLife}};
if(require.main===module){
 test('摊位库存、利润、重复提交与原始现金一致',()=>{
 const l=lives[0],r=walk(l,27);assert(LifeEngine.chooseDream(r,'J04','sell'));assert(LifeRoutes.chooseMethod(r,'fair'));
 r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;assert(LifeEngine.commit(r));const before=LifeEngine.copy(r);
 assert(!LifeEngine.commit(r));assert.deepEqual(r,before);
 const sale=r.facts.at(-1).actions[0].result;assert.equal(sale.revenue,10);assert.equal(sale.margin,4);assert.equal(sale.stockDelta,-2);assert.equal(r.facts.at(-1).pay.amount,0);
 });
 test('高价销售退货按原价回退现金和成本，破坏利润拒绝导入',()=>{
 const l={...lives[0],actions:{...lives[0].actions,27:'J04/sell:high'}},r=walk(l,29);
 const refund=r.facts.at(-1).actions[0].result;assert.equal(r.facts.at(-1).actions[0].costs.money,6);assert.equal(refund.servicePay,0);assert.equal(refund.stockDelta,1);assert.equal(refund.margin,-3);
 const s=LifeSave.fresh();s.active='walk';s.trees.t={birth:r.birth};s.branches.walk={tree:'t',run:r};assert(LifeSave.validateImport(s));refund.margin=500;assert(!LifeSave.validateImport(s));
 });
 test('发布失败仍需修复后部署，大厂申请有历史条件',()=>{
 const l=lives.find(x=>x.name==='J05·改变'),r=walk(l,30);assert(!LifeRoutes.options(r).some(o=>o.key==='J05/support'));
 const untrained=walk({seed:1,job:'office',actions:{}},31);assert(!LifeRoutes.options(untrained).some(o=>o.key==='J05/bigtest'));
 });
 test('离岗权限、未出菜与退单补救各自核验',()=>{
 const r=walk(lives.find(x=>x.name==='J06·改变'),37);assert(!LifeRoutes.options(r).some(o=>o.key==='J06/acceptcase'));
 const cook=walk(lives.find(x=>x.name==='J07·改变'),27);assert(LifeRoutes.options(cook).some(o=>o.key==='J07/remake'));
 assert(!LifeRoutes.options(cook).some(o=>o.key==='J07/rush'));
 });
 test('资金不足时进货整笔拒绝，满班不能额外摆摊',()=>{
 const r=walk(lives[0],26);r.stats.money=0;assert(LifeEngine.chooseDream(r,'J04','stock'));assert(LifeRoutes.chooseMethod(r,'do'));
 r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;const before=LifeEngine.copy(r);assert(!LifeEngine.commit(r));assert.deepEqual(r,before);
 });
}
if(require.main===module)test('厨师转自营需许可、食材付款和交付，原厨师工资停止',()=>{
 const l=lives.find(l=>l.name==='J07·普通'),r=walk({...l,actions:{...l.actions,32:'J04/ownkitchen',33:'J04/foodbuy',34:'J04/foodsell'}},35);
 assert.equal(r.facts[31].careerAfter,'vendor');assert.equal(r.facts[31].pay.amount,0);
 const sold=r.facts.at(-1).actions[0].result;assert.equal(sold.foodDelta,-2);assert.equal(sold.revenue,36);assert.equal(sold.margin,24);assert.equal(r.facts.at(-1).pay.amount,0);
});
if(require.main===module)test('大厂招聘有真实技术条件，落选保留原项目；公务员笔试不能代替录用',()=>{
 const l=lives.find(l=>l.name==='J05·普通');
 let passed=false,failed=false;
 for(let seed=1;seed<30&&(!passed||!failed);seed++){
  const r=walk({...l,seed,actions:{...l.actions,33:'J05/bigtest'}},34);
  const outcome=LifeChapters.records(r,'J05-bigtest').at(-1).a.result.outcome;
  assert(LifeChapters.records(r,'J05-deploy').length);assert.equal(r.career,'programmer');
  if(outcome==='通过')passed=true;else failed=true;
 }
 assert(passed&&failed);
 const c=lives.find(l=>l.name==='J06·普通'),r=walk(c,28);assert.notEqual(r.career,'civil');assert(!LifeRoutes.options(r).some(o=>o.key==='J06/acceptcase'));
});
