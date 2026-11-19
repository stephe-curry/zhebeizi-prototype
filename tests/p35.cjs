'use strict';
const assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
const {walk}=require('./p32.cjs');
const all=['p32','p33','p34'].flatMap(n=>require('./'+n+'-lives.cjs').lives);
const pick=n=>all.find(l=>l.name===n);
const specs=[
 ['在职重考',26,'J01/shift-full'],['少年赛场',24,'J01/shift-part'],['第一栏·重拾',26,'J02/training:hold'],['雨棚·重拾',26,'J03/drop:receipt'],['回程线·直路',24,'J03/drop:receipt'],['J04·交汇',31,'J04/count'],['J05·交汇',32,'J05/support'],['J06·交汇',37,'J06/rotation'],['J07·交汇',35,'J07/rush'],['J08·交汇',33,'J08/newclass'],['潮痕·重拾',28,'J01/shift-part'],['两张交班单·重拾',27,'J02/training:hold'],['J05·交汇',32,'J05/support']
];
const lives=[];
for(const [i,[n,slot,b]] of specs.entries()){
 const base=pick(n),group='X'+String(i+1).padStart(2,'0'),actions={...base.actions};
 if(i===12)Object.assign(actions,{8:'03/establish',9:'03/revise',35:'03/pause',36:'07/adopt',38:'03/resume',39:'J05/support',40:'03/revise:check'});
 const prefix=Object.fromEntries(Object.entries(actions).filter(([k])=>+k<slot));
 for(const [suffix,selected] of [['A',actions],['B',{...prefix,[slot]:b}],['C',prefix]])lives.push({...base,group,slot,name:group+suffix,job:i===4?'delivery':base.job,decline:suffix==='C'?actions[slot].split(':')[0]:null,actions:selected});
}
const ordinary=['办公室交接','制造带教','街区老客',...['J04','J05','J06','J07','J08'].map(n=>n+'·普通')].map(n=>({...pick(n),ordinary:true}));
const middle=['J01/trace-copy','J02/lot-card','J03/detour'];
ordinary.slice(0,3).forEach((l,i)=>{l.actions={...l.actions,[i===1?31:34]:middle[i]};});
ordinary[0].actions[42]='J01/archive-copy';ordinary[1].actions[42]='J02/recall-lot';
lives.push(...ordinary);
const food={24:'J07/apprentice',25:'J07/prep',26:'J07/cookorder',30:'J07/rush',31:'J04/ownkitchen',32:'J04/creditfood',33:'J04/prepayfood',34:'J04/endfood',35:'J04/cookagain'};
lives.push({name:'食堂闭店',seed:1,job:'office',actions:food,shot:'J04/endfood'});
lives.push({...pick('雨棚·直路'),name:'歌手暂停后旅行',seed:3,actions:{...pick('雨棚·直路').actions,18:'11/pause',19:'30/board',20:'30/establish',21:'30/atlas',24:'30/book1rail',25:'30/leg1',26:'30/back1',27:'11/resume'}});
const oss=pick('站名簿·直路').actions,home=pick('工厂附近的家').actions;
lives.push(
 {name:'成家与开源',job:'office',seed:1,actions:{...oss,...home},expected:{'07':'achieved','29':'achieved'}},
 {name:'开源完成后继续找家',job:'office',seed:1,actions:{...oss,...home,35:null},expected:{'07':'achieved','29':'active'}},
 {name:'换岗后重拾站名簿',job:'office',seed:1,actions:{...oss,18:'07/pause',24:null,25:'J01/resign-office',26:'J02/hire-factory',27:'07/resume',28:'07/adopt',29:'07/maintain',30:'J02/training:hold'},expected:{'07':'achieved'}},
 {name:'分别放下两件事',job:'office',seed:1,actions:{8:'07/issue',9:'07/establish',10:'07/patch',24:'29/walk-block',25:'29/establish',26:'07/redirect',27:'29/redirect'},expected:{'07':'redirected','29':'redirected'}},
 {...pick('两张交班单·直路'),name:'外科离岗再就业',actions:{...pick('两张交班单·直路').actions,35:'MED/exitsurgeon',36:'J01/hire-office'}});
lives.push({name:'较早的一页',seed:2,job:'office',actions:{},early:true});
function checkLife(l,r){assert(r.memo);
 if(l.early)assert.equal(r.memo.kind,'early');
 const dreams=LifeRoutes.dreams(r);
 assert.equal(r.facts.length,r.finalType==='early'?44:46);
 for(const [id,state] of Object.entries(l.expected??{}))assert.equal(dreams[id]?.state,state);
 for(const f of r.facts)for(const a of f.actions??[])assert(a.sourceRefs.every(x=>x.slot<f.slot));
 if(l.ordinary){
   assert.deepEqual(dreams,{});
   assert(r.facts.some(f=>f.slot>=30&&f.slot<=40&&f.actions?.length));
   assert(r.facts.some(f=>f.slot>=41&&f.actions?.some(a=>a.sourceRefs.some(s=>s.actionId))));
 }
 if(l.name==='X13A'){
   assert(dreams['03'].investments.some(s=>s.slot>dreams['07'].source.slot));
   assert(dreams['07'].investments.length>0);
 }
 if(l.name==='食堂闭店'){
   const v=LifeChapters.records(r,'J04-endfood')[0].a;
   assert.equal(r.facts[34].pay.paySourceId,'cook-35');
   assert.equal(v.costs.money,16);
   assert.equal(v.result.refunds,36);
   assert.equal(v.result.finalWages,4);
   assert.equal(v.result.foodDelta,-2);
 }
}
if(require.main===module){
 for(const l of lives)test(l.name,()=>{
   if(!l.early)return checkLife(l,walk(l,48));
   const r=LifeEngine.create(l.seed,{childhood:'spring-gift'}),{settle}=require('./p2-paths.cjs'),{main}=require('./p32-lives.cjs');
   while(!r.memo){
     const o=main(r,l);
     if(o.inspect!=null)assert(LifeEngine.inspectSample(r,o.inspect));
     settle(r,['spring-envelope-box','school-yoyo-buy','life-3-2','life-4-keep-eating'][r.slot-1]??o.id);
     assert(LifeEngine.advance(r));
   }
   checkLife(l,r);
 });
 for(let i=0;i<39;i+=3)test('同前缀 '+lives[i].group,()=>{const paths=lives.slice(i,i+3).map(l=>walk(l,l.slot+1));for(const p of paths.slice(1))assert.deepEqual(p.facts.slice(0,-1),paths[0].facts.slice(0,-1));assert.equal(new Set(paths.map(p=>p.facts.at(-1).actions?.[0].actionId)).size,3);});
}
module.exports={lives,browser:{integration:true,lives,checkLife,out:path.resolve(__dirname,'../docs/v1.4/p3/p3-5/evidence')}};
if(require.main===module){
 for(const seed of [1,2,3,4,9,12])for(const [id,contact] of Object.entries({'01':'open-room','02':'lane','03':'ask-undergrad','07':'issue','08':'observe','11':'verse','12':'extra','25':'visit','29':'walk-block','30':'board'})){
 test('接触 '+seed+'/'+id,()=>{const r=walk({seed,job:'office',actions:{24:id+'/'+contact,25:id+'/establish'}},26);assert.equal(LifeRoutes.dreams(r)[id].state,'active');assert(LifeChapters.records(r,id+'-'+contact).length);});
 }
 const kitchen=(extra,end)=>walk({seed:1,job:'office',actions:{...food,34:null,35:null,...extra}},end);
 test('履约后退款，已出库或报损原料不能再次交付',()=>{
 const r=kitchen({34:'J04/servefood',35:'J04/returnfood'},36);assert.equal(LifeChapters.records(r,'J04-returnfood')[0].a.result.foodLoss,12);
 const keys=LifeRoutes.options(r).map(o=>o.key);assert(!keys.includes('J04/foodsell'));assert(!keys.includes('J04/returnfood'));assert(!keys.includes('J04/servefood'));
 const spoiled=kitchen({34:'J04/spoilfood'},35);assert(!LifeRoutes.options(spoiled).some(o=>o.key==='J04/servefood'));
 });
 test('转让余料、店款净额和尾薪各清一次，重新开业需重新付款',()=>{
 const r=kitchen({34:'J04/depositfood',35:'J04/endfood:transfer',36:'J04/reopenfood'},37);const a=LifeChapters.records(r,'J04-endfood')[0].a;
 assert.equal(a.result.servicePay,4);assert.equal(a.result.transferred,2);assert.equal(a.result.foodDelta,-2);assert.equal(a.result.paidSupplier,12);
 assert(!LifeRoutes.options(r).some(o=>o.key==='J04/foodsell'));assert.equal(LifeChapters.records(r,'J04-reopenfood')[0].a.costs.money,120);
 });
 test('清算资金不足无部分退款；结清后不能重复提取资金',()=>{
 const r=kitchen({},34);r.stats.money=0;assert(LifeEngine.chooseDream(r,'J04','endfood'));assert(LifeRoutes.chooseMethod(r,'close'));r.entered=true;r.draft.main=LifeEngine.currentCard(r).choices[0].id;
 const before=LifeEngine.copy(r);assert(!LifeEngine.commit(r));assert.deepEqual(r,before);
 const closed=kitchen({34:'J04/endfood'},35);for(const key of ['endfood','foodsell','creditfood','returnfood'])assert(!LifeRoutes.options(closed).some(o=>o.key==='J04/'+key));
 });
}

const contactActions={'01':'open-room','02':'lane','03':'ask-undergrad','07':'issue','08':'observe','11':'verse','12':'extra','25':'visit','29':'walk-block','30':'board'};
if(require.main===module){
 const jobs=['office','factory','delivery','vendor','programmer','civil','cook','teacher'];
 for(const [i,worker] of ordinary.entries())for(const [dream,op] of Object.entries(contactActions)){
   test(jobs[i]+' 任职期间确立 '+dream,()=>{
     const actions={...worker.actions,30:dream+'/'+op,31:dream+'/establish'};
     if(['02','03'].includes(dream)){delete actions[30];if(dream==='02')actions[8]='02/lane';actions[30]=dream+'/establish';delete actions[31];}
     const r=walk({...worker,actions},32);
     assert.equal(r.career,jobs[i]);
     assert.equal(LifeRoutes.dreams(r)[dream].state,'active');
   });
 }
 test('明确谢绝、撤回和未见分别记录',()=>{
   const r=walk(pick('办公室交接'),30);
   assert(LifeRoutes.choose(r,'J01','trace-copy'));assert(LifeRoutes.decline(r));
   assert.equal(LifeRoutes.offers(r).find(o=>o.key==='J01/trace-copy').status,'declined');
   assert(LifeRoutes.choose(r,'J01','trace-copy'));assert.equal(LifeRoutes.offers(r).find(o=>o.key==='J01/trace-copy').status,'resolved');
   assert(LifeRoutes.offers(r).some(o=>!o.seen&&o.status==='unseen'));
 });
}
if(require.main===module){
 test('有食堂待退预收时不能直接签新工作，原聘约与店账保持原值',()=>{
   const r=walk({seed:1,job:'office',actions:food},34);
   assert(LifeEngine.chooseDream(r,'J05','devhire'));assert(LifeRoutes.chooseMethod(r,'do'));
   const before=LifeEngine.copy(r);
   assert.match(LifeEngine.preview(r).route.error,/清算小食堂/);
   assert(!LifeEngine.commit(r));assert.deepEqual(before,r);
   assert.deepEqual(LifeKitchenBalance(r),{cash:36,orders:1,supplier:12,wages:4,delivered:0});
 });
 test('既有房租优先预留，订票不能花同一笔钱',()=>{
   const actions={...pick('工厂附近的家').actions,24:'30/board',28:'30/establish',31:'30/atlas'};
   const r=walk({seed:9,job:'factory',actions},32);
   assert(LifeEngine.chooseDream(r,'30','book1rail'));assert(LifeRoutes.chooseMethod(r,'do'));
   const option=LifeRoutes.options(r).find(o=>o.key==='30/book1rail');
   r.stats.money=option.receipt.costs.money;
   assert.match(LifeEngine.preview(r).route.error,/房租/);
 });
}
if(require.main===module)test('两张预收回执分别交付与退款，不能重复核销同一桌',()=>{
 const r=walk({seed:1,job:'office',actions:{...food,34:'J04/servefood',35:'J04/creditfood',36:'J04/prepayfood',37:'J04/servefood',38:'J04/returnfood',39:'J04/returnfood'}},40);
 const orders=id=>LifeChapters.records(r,'J04-'+id).map(v=>v.a.result.order);
 assert.deepEqual(orders('servefood'),orders('prepayfood'));
 assert.deepEqual(orders('returnfood'),orders('prepayfood').reverse());
 assert.equal(new Set(orders('returnfood')).size,2);
 assert.deepEqual(LifeKitchenBalance(r),{cash:0,orders:0,supplier:24,wages:8,delivered:0});
 assert(!LifeRoutes.options(r).some(o=>o.key==='J04/returnfood'));
});
if(require.main===module)test('食堂清算旧账重放及伪造退款的导入反例',()=>{
 const r=walk({seed:1,job:'office',actions:food},36);
 const backup=LifeSave.fresh();
 backup.active='walk';backup.trees.t={birth:r.birth};backup.branches.walk={tree:'t',run:r};
 assert(LifeSave.validateImport(LifeSave.decode(JSON.stringify(backup))));
 const forged=structuredClone(backup);
 forged.branches.walk.run.facts[33].actions[0].result.refunds=72;
 assert(!LifeSave.validateImport(forged));
});
if(require.main===module)test('赴乡后保留城南资料，不能在石桥当班时接城南的新班',()=>{
 const life=pick('J08·交汇'),r=walk(life,34);
 assert.equal(LifeTeacherCampus(r),'石桥小学');
 assert(LifeEngine.chooseDream(r,'J08','newclass'));assert(LifeRoutes.chooseMethod(r,'do'));
 assert.match(LifeEngine.preview(r).route.error,/城南小学/);
 assert(!LifeEngine.commit(r));
 assert(LifeChapters.records(r,'J08-familytalk').length);
});
