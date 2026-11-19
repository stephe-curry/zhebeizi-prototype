'use strict';
// node docs/v1.4/export.cjs [empty output directory]. No production imports this file.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'../..');
require(path.join(root,'content.js'));
require(path.join(root,'engine.js'));
const C=LifeContent,E=LifeEngine;
if(process.env.LIFE_AUDIT_TRACE){
  const samples=new Map(), commit=E.commit;
  E.commit=function(run){
    const card=E.currentCard(run);
    const ok=commit(run);
    if(ok && C.cards.some(c=>c.id===card.id)){
      const f=run.facts.at(-1);
      const key=[f.eventId,f.choiceId,f.action,f.giftEcho?.branch,f.interaction?.variant, f.interaction?.place,...(f.interaction?.performed??[])].join('/');
      if(!samples.has(key))samples.set(key,{seed:run.seed,fact:f,delta:run.result.deltas,actions:card.interaction?.actions.map(a=>a.actionId)??[],choices:card.choices.map(c=>[c.id,c.label])});
    }
    return ok;
  };
  process.on('exit',()=>fs.writeFileSync(process.env.LIFE_AUDIT_TRACE,JSON.stringify([...samples.values()])));
}else{
  const dir=process.argv[2]||path.join(__dirname,'p1');
  fs.mkdirSync(dir,{recursive:true});
  const write=(name,lines)=>fs.writeFileSync(path.join(dir,name),lines.join('\n')+'\n');
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'life-p0-'));
  const traces=[];
  const suites=['acceptance','lifecycle','gift','shop','dinner','dinner-fish','interaction','guidance','continuity'];
  if(path.basename(dir)==='p2')suites.push('p2');
  for(const suite of suites){
    const file=path.join(temp,suite+'.json');
    const p=require('node:child_process').spawnSync(process.execPath,['--require',__filename,'tests/'+suite+'.cjs'],{cwd:root,env:{...process.env,LIFE_AUDIT_TRACE:file},encoding:'utf8'});
    if(p.status!==0)throw Error(suite+' '+p.stdout+' '+p.stderr);
    for(const row of JSON.parse(fs.readFileSync(file)))if(C.cards.some(c=>c.id===row.fact.eventId))traces.push({...row,suite});
  }
  if(path.basename(dir)==='p2'){
    const scenes={};
    for(const {fact,actions,suite,seed} of traces){
      if(!fact.interaction)continue;
      const key=[fact.eventId,fact.interaction.variant??'original'].join('/');
      const scene=scenes[key]??={declared:[],performed:{}};
      scene.declared=[...new Set([...scene.declared,...actions])].sort();
      for(const action of fact.interaction.performed)scene.performed[action]??={suite,seed,choice:fact.choiceId};
    }
    fs.writeFileSync(path.join(dir,'interaction-actions.generated.json'),JSON.stringify(scenes,null,2)+'\n');
  }
  const inv=['# 正式事件清单','来源为当前工作区 C.cards、C.ages、E.stage、E.currentCard 及实测变体。序号为注册表顺序，同级取首张。动态变体和活动不另计卡。','优先级：新童年前两槽独占；之后 early/early-next → arena-final → recover → 其他命中 rule 的注册顺序 → 职业 → 公共。调度员有配送履历时映射配送卡。同窗时正式场景可在 pageTrace.menu 内换约，未入选的试玩旧文件有 46 槽短窗口。精确谓词见下方引擎摘录。'];
  const ledger=['# 因果台账（机器投影）','每个测试文件按事件、选择、动作与部分变体保留首次成功提交的样本。种子不包含完整输入。规则测试含定点夹具，尤其 shop 的旧卡遍历；成功 commit 不能单独证明从首页可达。未采样不等于不可达。浏览器走测不并入此计数。',''];
  const review=['# 逐卡产品审阅','分级从正式卡读取。下列检查问题沿用 P0 审阅底稿；P2 实测结论另见 experience-review.md。每行列出当下动机、输入、结果、判断空间与待验证点。',''];
  const observed=new Set();
  for(const [i,age] of C.ages.entries()){
    const slot=i+1;inv.push('\n## '+slot+' / '+age+' 岁 / '+E.stage(slot));
    for(const c of C.cards.filter(c=>c.slot===slot)){
      const g=c.grade;
      const condition=c.childhoodGift?'spring-gift 新人生':c.rule?'rule('+c.rule+')':c.job?'职业 '+c.job:'公共兜底';
      const ui=c.childhoodGift?'实体红包／悠悠球':c.id==='life-3'?'硬币分配':c.id==='life-4'?'鱼盘与碗，旧档走原桌':c.slot===28?'工作台／物件去向':c.hotspot?'热点与精力工作台':C.dayPlans[c.id]?'日程主次行动':'普通选项或房间热点';
      inv.push('\n### '+c.id+' · '+c.title+'（'+g+'）',condition+'；注册序 '+C.cards.indexOf(c)+'；'+ui,'',c.body||'进入时由 giftCard 生成情境。');
      const rows=traces.filter(r=>r.fact.eventId===c.id);
      ledger.push('\n## '+c.id+' · '+slot+' / '+age+'岁 · '+g+' · '+condition);
      for(const ch of c.choices){
        inv.push('- '+ch.id+' '+ch.label+' → '+ch.outcome+'；'+JSON.stringify(ch.delta)+' '+ch.commands.join(', '));
        ledger.push('- 声明 '+ch.id+'：'+JSON.stringify(ch.delta)+' '+ch.commands.join(', '));
      }
      const variants=new Set(rows.flatMap(r=>r.choices.map(([id,label])=>id+' '+label)).filter(line=>!c.choices.some(ch=>ch.id+' '+ch.label===line)));
      if(variants.size)inv.push('运行时额外／改义选项（采样）：'+[...variants].join('；'));
      ledger.push('未采到正式提交的基础选项：'+(c.choices.filter(ch=>!rows.some(r=>r.fact.choiceId===ch.id)).map(ch=>ch.id).join('、')||'无'));
      for(const {suite,seed,fact,delta} of rows){
        observed.add(fact.eventId);
        ledger.push('- tests/'+suite+'.cjs，seed '+seed+'：'+JSON.stringify({choice:fact.choiceId,action:fact.action,text:fact.text,delta,from:fact.sourceSlots,trace:fact.trace,opportunity:fact.opportunities,echo:fact.echoes,gift:fact.giftEcho,interaction:fact.interaction,items:fact.items,people:fact.people,job:fact.careerAfter,highlights:fact.highlights}));
      }
      review.push('### '+g+' · '+c.id+' '+c.title,c.body||'当年的钱由谁保管，或是否用它换球。','- 操作：'+ui+'。可选意图：'+c.choices.map(ch=>ch.label).join('／')+'。','- 即时反馈样例：'+c.choices[0].outcome+'。'+(c.childhoodGift||['life-3','life-4'].includes(c.id)?'另有场景结果；检查孩子能否认出归属。':'文本结果可读；尚不能由此证明画面独立传达了变化。'),'- 后效：'+(rows.some(r=>r.fact.sourceSlots?.length)?'样本有来源回合，详见同 ID 台账；被引用与开放新动作须分别验证。':'此卡样本不足以证明可识别的跨年后果。')+' '+(g==='S'?'优先验证两端真实投入与每种结局的回访窗口。':g==='A'?'应验证所选投入在后续至少一次被同一关系、资源或岗位实际读取。':'允许当场收束，重点检验一次操作的反馈。'),'');
    }
  }
  const src=fs.readFileSync(path.join(root,'engine.js'),'utf8');
  inv.push('\n## 精确匹配与覆盖规则','```js',src.slice(src.indexOf('  function rule('),src.indexOf('  function snapshot(')),'```');
  ledger.splice(2,0,'采到成功提交的注册事件 '+observed.size+'/'+C.cards.length+'；去重前按测试文件分别保留的见证 '+traces.length+' 条。trace.candidates 包含未呈现候选；无浏览器展示证据时 seen 为 false。');
  write('event-inventory.generated.md',inv); write('causal-ledger.generated.md',ledger);write('event-quality-index.md',review);
}
