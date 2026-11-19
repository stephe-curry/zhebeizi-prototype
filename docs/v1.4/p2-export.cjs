'use strict';
// Run the existing export/reach suites and Chrome --p2 first. Reports are
// projections of committed facts; the runtime never consults these files.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {verify}=require('../../tests/p2-evidence.cjs');
const {prefixes,extraResponses}=require('../../tests/p2-paths.cjs');
const C=LifeContent,dir=path.join(__dirname,'p2');
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const write=(name,lines)=>fs.writeFileSync(path.join(dir,name),lines.join('\n')+'\n');
const {events,responses,closures,readings}=verify(),paths=prefixes();
const chrome=read('chrome.generated.json'),natural=read('opportunities.generated.json'),interactions=read('interaction-actions.generated.json');
const bySource=new Map(responses.map(r=>[r.id,r])),ending=new Map(closures.map(r=>[r.id,r])),details=new Map(readings.map(r=>[r.id,r]));
const browserActions=new Set(chrome.responses.map(r=>r.followup));
for(const r of responses)if(r.receipt.startsWith('again-'))assert(browserActions.has(r.receipt),r.receipt);
for(const r of readings.filter(r=>!r.unseen))assert(chrome.details.some(d=>d.choice===r.id && d.slot===r.to),r.id);
const pageCards=new Set(chrome.scenes.map(f=>f.event));
for(const c of C.cards)if(c.grade!=='B')assert(pageCards.has(c.id),'Missing Chrome scene '+c.id);
const summary=['# 46 槽事件与行动覆盖','',
  '正式配置 '+C.cards.length+' 张、基础选项 '+C.cards.reduce((n,c)=>n+c.choices.length,0)+' 个。按 choiceId 去重，有 '+events.length+' 个在正式结算入口取得见证。包含新旧童年、旧饭桌、专款动作和延后复工。相同 ID 的合法变体另见事件清单及交互收据。','',
  '等级沿用 P0 的责任划分。S 承诺跨回合行动或终章，A 影响关系、资源、岗位或机会，B 以当下生活为重。按卡统计 '+['S','A','B'].map(g=>g+' '+C.cards.filter(c=>c.grade===g).length+' 张／'+events.filter(e=>e.grade===g).length+' 个实测选项').join('，')+'。','',
  '见证种子与策略组合使用。tests/p2-paths.cjs 从出生逐槽走到注册事件，必要时使用正式换约入口。tests/p2-evidence.cjs 在同一前缀分开尝试各选项。旧交互另恢复相应年代的草稿。每行的结果取自已提交事实。'];
for(const [i,age] of C.ages.entries()){
  summary.push('','## 第 '+(i+1)+' 槽 · '+age+' 岁','');
  for(const c of C.cards.filter(c=>c.slot===i+1)){
    const run=paths.cards.get(c.id);
    summary.push('### '+c.grade+' · '+c.id+' · '+c.title,'',
      '入场见证 seed '+run.seed+'，'+(run.pageTrace.menu?.includes(c.id)?'可在同窗安排中选择':c.rule?'规则 '+c.rule:c.job?'职业 '+c.job:c.childhoodGift?'新童年专用':'公共场景')+
      '。'+(pageCards.has(c.id)?'Chrome 已提交该场景。':'日常结算已在引擎复演。'),'',
      '|实际选择|现场操作与结果|可定位的未来读法|','|---|---|---|');
    for(const e of events.filter(e=>e.event===c.id)){
      const follow=bySource.get(e.id),last=ending.get(e.id),detail=details.get(e.id);
      const venue=follow?'槽 '+follow.to+' · '+follow.action:last?'槽 '+last.slot+' 终章 · '+last.artifact:
        detail&&!detail.unseen?'槽 '+detail.to+' · '+detail.text:detail?detail.reason:'当场收束';
      summary.push('|'+e.id+'|'+e.label+' → '+e.outcome+'|'+venue+'|');
    }
    summary.push('');
  }
}
summary.push('## 复合交互输入','','下表逐个列出已装配的动作 ID。见证来自实际确认的收据。','',
  '|场景／变体|动作 ID|有提交见证|未获提交见证|','|---|---|---:|---|');
for(const [scene,{declared,performed}] of Object.entries(interactions)){
  const missing=declared.filter(id=>!performed[id]);
  summary.push('|'+scene+'|'+declared.join('、')+'|'+declared.filter(id=>performed[id]).length+'/'+declared.length+'|'+(missing.join('、')||'无')+'|');
}
summary.push('','另有工作台余力、家庭回应、两格日程、限时练习、饭桌接话、打包去向和记忆选物。它们调整本回合的草稿与收据，同一主选项可以有多个组合；此处没有把组合数当成事件数。','',
 '## 五张旧样本空缺','','|事件|固定 480 路入选数|正常入场见证|','|---|---:|---|');
for(const id of ['life-24','life-27','life-32','life-36','late-recovery']){
  const r=paths.cards.get(id);summary.push('|'+id+'|'+natural.coverage[id].selected+'|seed '+r.seed+' · '+(r.pageTrace.menu?.includes(id)?r.pageTrace.menu.join(' ／ '):'仍在停工恢复期')+'|');
}
write('event-coverage.generated.md',summary);
const sIds=new Set(events.filter(e=>e.grade==='S').map(e=>e.id));
const core=responses.filter(r=>sIds.has(r.id)),real=new Set(core.map(r=>r.id));
const missing=[...sIds].filter(id=>!real.has(id)&&!ending.has(id));
const redemption=['# 核心结果的可玩兑现','','按原 choiceId 去重，'+sIds.size+' 个 S 级结果中，'+real.size+' 个具备可实际操作的后续，'+closures.length+' 个经终章合法收束。不同测试人生可以各自取得见证。一名玩家每槽只结算一项主行动和至多一项短回响。','',
 '|来源 choiceId|槽／年龄 → 合法窗口|实际接收事件|实际采取的动作|种子与结果证据|','|---|---|---|---|---|'];
for(const r of core.sort((a,b)=>a.from-b.from||a.id.localeCompare(b.id))){
  const delta=Object.entries(r.changes??{}).map(([k,v])=>C.labels[k]+(v>0?'+':'')+v).join('、');
  redemption.push('|'+r.id+'|'+r.from+'／'+C.ages[r.from-1]+' 岁 → '+r.to+'／'+C.ages[r.to-1]+' 岁|'+r.event+'|'+r.action+'|seed '+r.seed+' · '+r.receipt+(delta?' · '+delta:'')+'|');
}
redemption.push('','## 已实际操作的职业与晚年延伸','','|可追溯的原动作|接收槽／年龄|现场动作和结果|浏览器结算见证|','|---|---|---|---|');
for(const [run,id] of extraResponses()){
  const a=LifeEngine.followups(run).find(a=>a.id===id);
  const receipt=chrome.responses.find(r=>r.event===run.eventId && r.followup===id);
  assert(receipt?.source.includes(a.source.slot),id);
  redemption.push('|'+(a.source.followup?.id??a.source.choiceId)+'|'+run.slot+'／'+LifeContent.ages[run.slot-1]+' 岁|'+a.label+'。'+a.outcome+'|seed '+run.seed+' · '+id+'|');
}
redemption.push('','## 合法终止','','|来源|末槽|实得终章|见证|','|---|---:|---|---|');
for(const r of closures)redemption.push('|'+r.id+'|'+r.slot+'|'+r.artifact+'|seed '+r.seed+' · '+r.terminal+'|');
redemption.push('','## 未取得合法后续或终止的既有 S 结果','',missing.join('、')||'无。','',
 '完整清北生涯、奥运专项、民宿与非民宿经营、安家及三职业的深做结局未列入上述数字。','',
 '## 候选、屏幕曝光与行动收据','',
 '固定 480 人生仅使用正常调度和结算。下列数字逐个计入事件或行动候选，同窗展示控件要以另行浏览器证据为准。','');
const totals={examined:0,eligible:0,seen:0,selected:0},statuses={};
for(const n of Object.values(natural.coverage)){
  for(const k of Object.keys(totals))totals[k]+=n[k];
  for(const [status,v] of Object.entries(n.status))statuses[status]=(statuses[status]??0)+v;
}
redemption.push('|核验数|有资格|装入页面|模型实测曝光|有资格但无实测曝光|','|---:|---:|---:|---:|---:|',
 '|'+[totals.examined,totals.eligible,totals.selected,totals.seen,totals.eligible-totals.seen].join('|')+'|','',
 '|模型结算时的状态|条数|','|---|---:|');
for(const k of ['ineligible','eligible','deferred','offered','resolved','declined','expired','invalidated'])redemption.push('|'+k+'|'+(statuses[k]??0)+'|');
const shown={};for(const f of [...chrome.scenes,...chrome.responses,...chrome.routes.flat()])for(const e of f.seen){
  const kind=e.reason?e.status+' · '+e.reason:e.status;
  shown[kind]=(shown[kind]??0)+1;
}
redemption.push('','deferred 包含同槽结束的公共兜底。resolved 只指完成了该项决定，冠军、发布要另读实际高光。单槽部分未见行动保留 eligible 并带 windowEnded。延期的历史记录保持原样，续接记录另带 continuationOf。','',
 'Chrome 已在 '+chrome.scenes.length+' 张 S/A 卡提交正式选择，还额外提交 '+chrome.responses.length+' 个带来源的可玩短行动，并逐条确认 '+chrome.details.length+' 个情境细节进入视口。','',
 '下列曝光终态计数来自逐场决定、短行动复演及命名人生路线的已见候选。另测的情境细节按单独阅读见证计数。重走同一前缀会计为独立试次。','',
 '|已曝光候选的终态|条数|','|---|---:|',...Object.entries(shown).map(([k,n])=>'|'+k+'|'+n+'|'),
 '','失效反例以原本合格、后来改变持有状态的专门测试验证；实际结果见 tests/p2.cjs。');
write('redemption.generated.md',redemption);
console.log('Verified '+events.length+' choices, '+real.size+' core results, '+closures.length+' endings, '+readings.filter(x=>!x.unseen).length+' situated readings.');
