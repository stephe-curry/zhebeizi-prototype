'use strict';
// Read-only audit. Writes only this directory; production never imports it.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const {verify}=require(path.join(root,'tests/p2-evidence.cjs'));
const {reach,settle,prefixes}=require(path.join(root,'tests/p2-paths.cjs'));
const C=LifeContent,E=LifeEngine;
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const sourceFiles=['content.js','engine.js','continuity.js','responses.js','app.js','save.js','interaction.js','guidance.js','scenes.js','tests/p2-evidence.cjs','tests/p2-paths.cjs'];
const code=fs.readFileSync(path.join(root,'engine.js'),'utf8');
const evidence=verify();
const samples=prefixes();
const contacts=C.origins.map(o=>{
 const seed=Array.from({length:480},(_,i)=>i+1).find(s=>E.origin(s).id===o.id);
 const row={origin:o.id,seed};
 for(const [id,slot,choice] of [['01',11,'life-11-0'],['03',7,'life-7-0'],['29',31,'life-31-1']]){
  const run=reach(seed,slot); const fact=settle(run,choice);
  row[id]={slot:run.slot,event:fact.eventId,choice:fact.choiceId};
 }
 return row;
});
fs.writeFileSync(path.join(__dirname,'contact-witnesses.generated.json'),JSON.stringify(contacts,null,2)+'\n');
const natural={complete:0,early:0,events:new Set(),choices:new Set(),collisions:[]};
for(let seed=1;seed<=480;seed++){
 const r=reach(seed,1);
 while(!r.memo){
  const menu=r.pageTrace?.menu??[];
  if(menu.length>1)natural.collisions.push({seed,slot:r.slot,age:C.ages[r.slot-1],selected:r.eventId,menu});
  const f=settle(r);natural.events.add(f.eventId);natural.choices.add(f.choiceId);E.advance(r);
 }
 if(r.facts.length===46)natural.complete++;else natural.early++;
}
const slots=C.ages.map((age,i)=>({slot:i+1,age,stage:E.stage(i+1),family:C.familySlots.includes(i+1),cards:C.cards.filter(c=>c.slot===i+1).map(c=>({id:c.id,title:c.title,body:c.body,interaction:E.currentCard(samples.cards.get(c.id))?.interaction??null,grade:c.grade,rule:c.rule??null,job:c.job??null,childhood:!!c.childhoodGift,hotspot:c.hotspot??null,window:c.opportunityWindow??[c.slot,c.slot],plan:C.dayPlans[c.id]??null,commands:c.choices.map(ch=>({id:ch.id,label:ch.label,outcome:ch.outcome,commands:ch.commands,delta:ch.delta})),people:[...new Set(c.choices.flatMap(ch=>ch.commands.filter(x=>x.startsWith('meet:')).map(x=>x.slice(5))))],items:[...new Set(c.choices.flatMap(ch=>ch.commands.filter(x=>x.startsWith('gain:')).map(x=>x.slice(5))))],shortActions:LifeResponses.rows.filter(r=>r.slot===i+1).map(r=>({...r})),prefixWitness:evidence.events.find(e=>e.event===c.id)?.seed}))}));
const summary={slots:slots.length,cards:C.cards.length,baseChoices:C.cards.reduce((n,c)=>n+c.choices.length,0),committedChoiceIds:new Set(evidence.events.map(e=>e.id)).size,grades:Object.fromEntries(['S','A','B'].map(g=>[g,C.cards.filter(c=>c.grade===g).length])),sFollowups:new Set(evidence.responses.filter(r=>evidence.events.some(e=>e.id===r.id&&e.grade==='S')).map(r=>r.id)).size,sClosures:evidence.closures.length,natural:{complete:natural.complete,early:natural.early,events:natural.events.size,choices:natural.choices.size}};
const snapshot={scope:'CURRENT_CODE_NOT_P3_IMPLEMENTATION',sources:Object.fromEntries(sourceFiles.map(p=>[p,sha(p)])),summary,origins:C.origins,jobs:C.jobs,wishes:C.wishes,slots,rules:code.slice(code.indexOf('  function rule('),code.indexOf('  function snapshot(')),collisions:natural.collisions,evidence};
fs.writeFileSync(path.join(__dirname,'baseline.generated.json'),JSON.stringify(snapshot,null,2)+'\n');
const esc=s=>String(s??'—').replaceAll('|','／').replaceAll('\n',' ');
const lines=['# 46 槽容量地图（当前代码自动导出）','','运行：`node docs/v1.4/p3/p3-0/export.cjs`。来源哈希、完整谓词、选项命令、资源、出生配置及逐选项见证见 baseline.generated.json。表中全为现有声明／引擎测试结果，不表示 P3 已实现，不包含新的梦想事实。动态交互由 E.currentCard 按历史派生；主卡注册表不等于必然入选。','','当前统计：`'+JSON.stringify(summary)+'`。','','调度：spring-gift 前两槽独占；early/early-next > arena-final > recover > 首张命中规则 > 当前职业 > 公共兜底。同级按 C.cards 注册顺序。实际谓词在 JSON rules。改约只在 37/39/45 的合法多候选、24/27/32 岗位与公共、arena-tactics 与公共之间启用；不是全局队列。','','每槽一主卡；可选一项 followup（1 精力）。dayPlans 主行动占 1 格时可加一项 extra，不能将 followup、extra 和工作台支持重复当成免费完整训练。家庭必选槽：9/14/31/34。','','|槽|年龄／阶段|现有候选、资格、窗口（声明）|实际场景载体|人物／物件（基础命令）|P2 短行动／后续关联（声明）|竞争（实测菜单）|','|---|---|---|---|---|---|---|'];
for(const s of slots){
 const cards=s.cards.map(c=>c.id+' ['+(c.childhood?'spring-gift':c.rule?'rule:'+c.rule:c.job?'job:'+c.job:'公共')+'; '+c.window.join('–')+']').join('<br>');
 const scene=s.cards.map(c=>c.id+':'+(c.childhood?'红包／取钱买球':c.interaction?'实体互动 '+c.interaction.sceneId+': '+(c.interaction.goal??''):c.id==='life-3'?'两元交易':c.id==='life-4'?'鱼盘／旧饭桌':c.plan?'日程 '+JSON.stringify(c.plan):c.hotspot?'热点工作台 '+c.hotspot:'选择／房间热点')).join('<br>');
 const entities=s.cards.map(c=>c.id+': '+c.people.join(',')+' / '+c.items.join(',')).join('<br>');
 const shorts=LifeResponses.rows.filter(r=>r.slot===s.slot).map(r=>r.choice+' → '+r.label);
 const future=evidence.responses.filter(r=>r.from===s.slot).map(r=>r.id+'→槽'+r.to);
 const menus=[...new Set(natural.collisions.filter(c=>c.slot===s.slot).map(c=>c.menu.join(' / ')))];
 lines.push('|'+[s.slot,s.age+'／'+s.stage+(s.family?'；家庭必选':''),cards,scene,entities,[...shorts,...future].join('<br>')||'无已登记短回响',menus.join('<br>')||'无实测改约菜单；仍受优先级竞争'].map(esc).join('|')+'|');
}
lines.push('','## P3 待开发窗口（人工规划，非当前事实）','','精确路线窗口、动作和前置见 [route-contracts.md](route-contracts.md)。下表是可替代的内容池，不是同一人生全部获得。所有新窗口由 P3-1 的资格重检、预算与主卡换约接入；不能覆盖原卡。','','|规划槽／真实年龄|计划内容|载体与限制|','|---|---|---|','|5–10／13–15|田径、解题、音乐、戏剧、教学、旅行及住处接触|现有主卡变体／付费时短活动；第6槽器材室不可替换|','|11–15／16–18|确立、训练、招生备考与资格分流|保留原升学与电竞；专业招生用主活动|','|16–22／19–22|专项、医学／师范课程、代码、原创、试镜、旅程筹备、招聘|课程与作品多槽证据；短操作不得代替多年学业|','|23–28／23–26|八职业入口、医学实践、乡村任教、作品初成果、安家与短旅|新招聘菜单与专业场景，已就业者用真实换岗／兼职安排|','|29–35／27–31|多梦投入、成年再考、赛事、巡演、角色、社区维护、赴乡、分段旅行|主卡可改约；每槽预算；31/34家庭成本保留|','|36–40／32–35|风险与检验、第二次考试／赛事、转职、暂停重拾|风险不隐藏；39决赛／独游硬冲突继续存在；40有新生活|','|41–44／38/45/52/58|晚起教育、维护、乡村学生、巡演、旅程、职业传承|38→45跨度不可假称短延期；诊断／提前谢幕优先|','|45–46／64/72|真实旧人旧物、归航／归家、职业回访与终章|保留45→46旧文件；新预约不得默认延8年；无47槽|');
fs.writeFileSync(path.join(__dirname,'slot-capacity.generated.md'),lines.join('\n')+'\n');
console.log(JSON.stringify(summary,null,2));
