'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {settle}=require('./p2-paths.cjs');
const {main}=require('./p32-lives.cjs');
const E=LifeEngine,R=LifeRoutes;
const strategies=['ordinary','dream','work','random','save','switch','decline','resume'];
const results=[];
for(let seed=1001;seed<=1060;seed++)for(const strategy of strategies){
 let r=E.create(seed,{childhood:'spring-gift'});r.branchId='walk';
 let rejected=0;
 while(!r.memo){
   assert(r.slot<=46);
   const config={name:'exploration',job:['office','factory','delivery'][seed%3],actions:{}};
   const selected=main(r,config);
   if(selected.inspect!=null)E.inspectSample(r,selected.inspect);
   const card=E.currentCard(r);
   let options=R.options(r);
   if(strategy==='ordinary')options=[];
   if(strategy==='dream')options=options.filter(o=>!o.key.startsWith('J'));
   if(strategy==='work')options=options.filter(o=>o.key.startsWith('J'));
   if(strategy==='save')options=options.filter(o=>!o.receipt.costs.money);
   if(strategy==='switch')options.sort((a,b)=>Number(Object.hasOwn(b.receipt.result,'newJob'))-Number(Object.hasOwn(a.receipt.result,'newJob')));
   if(strategy==='resume')options.sort((a,b)=>Number(/resume|pause/.test(b.key))-Number(/resume|pause/.test(a.key)));
   if(!['switch','resume'].includes(strategy)&&options.length){
     const offset=E.hash(seed,r.slot,strategy)%options.length;
     options=options.slice(offset).concat(options.slice(0,offset));
   }
   let done=false;
   for(const o of options.slice(0,5)){
     const trial=E.copy(r);
     R.choose(trial,...o.key.split('/'));
     for(const step of o.steps??[])R.chooseStep(trial,step.choices.find(c=>!c.retry).id);
     if(o.methods)R.chooseMethod(trial,o.methods.find(c=>!c.retry).id);
     if(strategy==='decline')R.decline(trial);
     try{settle(trial,selected.id);}catch(error){
       // Only a refused transaction is recoverable. A partial write is a defect.
       assert.equal(trial.facts.length,r.facts.length,error.message);
       rejected++;continue;
     }
     r=trial;done=true;break;
   }
   if(!done)settle(r,selected.id);
   const fact=r.facts.at(-1);
   assert.equal(fact.slot,r.slot);
   let food=0;
   for(const f of r.facts)for(const a of f.actions??[]){
     food+=a.result.foodDelta??0;assert(food>=0);
     assert(a.sourceRefs.every(s=>s.slot<f.slot));
     if(a.result.outcome==='通过'&&a.kind==='fate-result')assert(a.result.qualification.length);
   }
   const frozen=E.copy(r);assert(!E.commit(r));assert.deepEqual(r,frozen);
   assert(E.advance(r));
 }
 const backup=LifeSave.fresh();backup.active='walk';backup.trees.t={birth:r.birth};backup.branches.walk={tree:'t',run:r};
 assert(LifeSave.validateImport(LifeSave.decode(JSON.stringify(backup))),seed+'/'+strategy+' import');
 results.push({seed,strategy,birth:r.birth,ending:r.memo.kind,slots:r.facts.length,rejected,dreams:R.dreams(r),facts:r.facts.filter(f=>f.actions).map(f=>({slot:f.slot,age:f.age,career:f.careerAfter,actions:f.actions,pay:f.pay}))});
}
fs.writeFileSync('docs/v1.4/p3/p3-6/evidence/exploration.json',JSON.stringify(results)+'\n');
console.log('PASS',results.length,'unique seed/strategy lives',new Set(results.map(r=>r.birth)).size,'origins');
