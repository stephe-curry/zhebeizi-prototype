'use strict';
// Isolated model runs. The scheduler observer only reads local values.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.resolve(__dirname,'../..'),ctx=vm.createContext({});
const contests=new Map(),seen=new Map(),choices=new Set(),routes=[];
const reads=new Map(), coverage=new Map();
const collisions=[], eligibleIds=new Set(), ineligibleIds=new Set();
for(const file of ['content','interaction','continuity','responses','engine']){
  vm.runInContext(fs.readFileSync(path.join(dir,file+'.js'),'utf8'),ctx);
}
const E=ctx.LifeEngine,I=ctx.LifeInteraction,C=ctx.LifeContent;
for(let seed=1;seed<=480;seed++){
  const run=E.create(seed,seed%2?{childhood:'spring-gift'}:{});
  while(run.stage!=='memoir'){
    const c=E.currentCard(run),pick=E.hash(seed,run.slot,'audit');
    if(c.interaction){
      I.create(run,'p0'); I.update(run,'p0','open');
      for(let step=0;I.preview(run).phase!=='ready'&&step<12;step++){
        const v=I.preview(run);
        if(v.phase==='preview'){I.update(run,'p0','review');continue;}
        const a=v.allowed.find(a=>['leave-shop','keep-eating'].includes(a.actionId))??v.allowed[pick%v.allowed.length];
        if(!a||!I.update(run,'p0','act',a.actionId))throw Error(c.id);
      }
    }else{
      run.entered=true;
      run.draft.main=c.choices[pick%c.choices.length].id;
    }
    if(C.familySlots.includes(run.slot))run.draft.parent=pick%3;
    if(!E.commit(run))throw Error(c.id+' commit');
    const fact=run.facts.at(-1);
    const entries=fact.trace.candidates;
    for(const e of entries)(e.eligible?eligibleIds:ineligibleIds).add(e.id);
    for(const e of entries){
      if(!coverage.has(e.id))coverage.set(e.id,{examined:0,eligible:0,selected:0,seen:0,status:{}});
      const n=coverage.get(e.id);n.examined++;n.eligible+=Number(e.eligible);n.selected+=Number(e.selected);
      n.seen+=Number(e.seen);n.status[e.status]=(n.status[e.status]??0)+1;
    }
    const skipped=entries.filter(e=>e.eligible&&!e.selected&&e.id!==C.shared[run.slot-1].id);
    if(skipped.length)contests.set([c.id,...skipped.map(e=>e.id)].join(' > '),seed);
    if(seed===425&&run.slot===39||seed===474&&run.slot===45)
      collisions.push({seed,slot:run.slot,selected:c.id,entries,threads:Object.fromEntries(['indie','esport'].map(id=>[id,ctx.LifeContinuity.thread(run,id)]))});
    for(const slot of fact.sourceSlots??[]){
      const source=run.facts.find(f=>f.slot===slot);
      if(!source)continue;
      const key=source.choiceId+' → '+fact.choiceId;
      if(!reads.has(key))reads.set(key,[source.slot,fact.slot,seed,fact.giftEcho?.status??'正式事实引用；未证明画面可见']);
    }
    seen.set(c.id,seed);choices.add(run.facts.at(-1).choiceId);
    if(!E.advance(run))throw Error(c.id+' advance');
  }
  routes.push(run.facts.length);
}
const missing=C.cards.filter(c=>!seen.has(c.id)).map(c=>c.id);
const out=['# 调度器自然路径抽样','工作区 E.create → E.currentCard → E.commit → E.advance；固定 seed 1–480，奇数新童年、偶数兼容旧童年。无直接跳槽或编造事实。模型选择与真实人群频率无关。','完整46回合 '+routes.filter(n=>n===46).length+'，提前谢幕 '+routes.filter(n=>n<46).length+'；命中注册卡 '+seen.size+'/'+C.cards.length+'；不同提交 choiceId '+choices.size+'。','未命中：'+missing.join('、')+'。未命中不代表死卡。','## 同窗竞争实证','左为实际入选，右为当时也符合条件的候选；seed 为可复现样本。公共回退卡不列为落选机会。',...[...contests].map(([pair,seed])=>'- '+pair+'，seed '+seed),'## 入选见证',...[...seen].map(([id,seed])=>'- '+id+'：'+seed)];
fs.writeFileSync(path.join(process.argv[2]||path.join(__dirname,'p1'),'scheduler-samples.md'),out.join('\n')+'\n');
const links=['# 自然路径中的后续读取','来源是本分支 run.facts 中的实际 choiceId。只有显式 sourceSlots 才进入此表；通过数值、物件或线程间接读到的条件不在此计数。','|实际先前决定 → 后续决定|来源槽|读取槽|复现种子|读取证据|','|---|---:|---:|---:|---|',...[...reads].map(([key,fields])=>'|'+[key,...fields].join('|')+'|')];
fs.writeFileSync(path.join(process.argv[2]||path.join(__dirname,'p1'),'observed-links.generated.md'),links.join('\n')+'\n');

fs.writeFileSync(path.join(process.argv[2]||path.join(__dirname,'p1'),'opportunities.generated.json'),JSON.stringify({samples:routes.length,coverage:Object.fromEntries(coverage),missing,neverEligible:C.cards.filter(c=>!eligibleIds.has(c.id)).map(c=>c.id),collisions},null,2)+'\n');
