'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const rows=require('./causal-evidence.generated.json'),{lives}=require('../../../../tests/p35.cjs');
const {walk}=require('../../../../tests/p32.cjs');
const byName=new Map(rows.map(r=>[r.name,r]));
assert.equal(byName.size,lives.length);
const write=(name,lines)=>fs.writeFileSync(path.join(__dirname,name),lines.join('\n')+'\n');
const table=(...cells)=>'|'+cells.map(v=>String(v??'—').replaceAll('|','／')).join('|')+'|';
const state=r=>Object.values(r.dreams).map(d=>d.goal+' '+({active:'继续',paused:'暂停',redirected:'放下',achieved:'达成'})[d.state]).join('、')||'无正式梦想';
const dreamRules={
 '01':['电竞','训练队、本人出场单、职业合同','签职业短约须交回原岗','录像室／赛场','整班与合练争时'],
 '02':['奥运','专项训练、计时、选拔与当届名额','运动员的比赛记录属于本人','跑道／赛场','体力与赛届窗口'],
 '03':['清北','本科报名核验；硕士另需本科学历','全日制注册影响原聘约','自习桌／考场','停薪、考试年度与培养年限'],
 '07':['开源','个人补丁、评审、发布与使用者','公司工单与个人仓库分别归属','站名簿维护台','维护排班与发布'],
 '08':['外科','医学教育、注册、住培及医院聘任','任职前结束全日制培养；聘任接替原岗','教学医院／交班室','长期停薪与资格年限'],
 '11':['原创歌手','原创、排练、小厅经验和演出合同','单场履约费与未出勤工资分别核算','排练室／舞台','演出档期和停班'],
 '12':['演员','试镜、角色合同、发行及评奖','片酬以实际完成的拍摄为据','摄影棚／放映室','出勤与拍摄撞期'],
 '25':['乡村教师','学历、教师资格、任教或调动','城乡聘约按实际学校切换','学校／教室','备课、家访及岗位地点'],
 '29':['安家','勘察、租约、入住和后续居住记录','持有租约可继续工作','看房处／房间','押金与持续租金'],
 '30':['环游','预订、证件、实走及每段返程','实际长途出行停发原岗本期工资','车站／换乘图','订金、体力与过期车票']
};
const jobs=[
 ['J01','办公室','退件夹与流转单','原岗班表'],
 ['J02','制造','工具柜与复检台','站线体力及岗位授权'],
 ['J03','配送','订单与站点','路费、交付费与时段'],
 ['J04','经营','文具摊或自营食堂','进货现金、顾客订单与店账'],
 ['J05','程序员','公司工单台','值班、公司产权'],
 ['J06','公务员','街道窗口','现职身份、公共权限与地点'],
 ['J07','厨师','河街后厨','旺季排班及受雇资产归属'],
 ['J08','教师','学校教务处','教师资格、班级与校区']
];
const combos=['03/J01','01/J01','02/J02','11/J03','30/J03','29/J04','07/J05','29/J06','30/J07','25/J08','12/J01','08/J02','07/J05'];
const matrix=['# 十梦想 × 八职业','','80 个格子均另有引擎实测，在岗时凭当期或早年接触确立目标。下表的进阶条件依正式章节定义。代表性完整页面见证列标 X；两条路线同时成立并不授予第二份工资。','','|组合|在岗目标／资格|后续身份与收入边界|场景|竞争及风险依据|本轮核验／修复|','|---|---|---|---|---|---|'];
for(const [id,[name,qual,identity,place,cost]] of Object.entries(dreamRules).sort())for(const [jid,job,desk,pressure] of jobs){
 const key=id+'/'+jid,examples=combos.flatMap((v,i)=>v===key?['X'+String(i+1).padStart(2,'0')]:[]);
 const risk=['01','03','08','25'].includes(id)||examples.length?'高':id==='29'&&jid!=='J04'?'低':'中';
 const fix=examples.length?examples.join('、')+(key==='29/J04'?'；房租优先预留':'；正式三分叉'): '在岗确立实测；后续按共用日程结算';
 matrix.push(table(id+' '+name+' × '+jid+' '+job,'可以；'+qual,identity,place+'／'+desk,risk+'：'+cost+'；'+pressure,fix));
}
write('intersection-matrix.generated.md',matrix);
const branches=['# 十三组正式页面同前缀对照','','A 从首页出生，在分叉槽通过设置页导出备份。B、C 通过设置页文件导入同一备份。C 明确谢绝 A 的机会后完成主事。下面的工资列仅显示专门工资收据；普通工资及同回合其他来源合在个人现金净变动中。'];
for(let i=0;i<39;i+=3){
 const samples=lives.slice(i,i+3),slot=samples[0].slot;
 const [a,b,c]=samples.map(l=>byName.get(l.name));
 for(const r of [b,c])assert.deepEqual(r.facts.slice(0,slot-1),a.facts.slice(0,slot-1));
 const menu=a.menus.find(m=>m.slot===slot).keys;
 branches.push('','## '+samples[0].group+' · '+combos[i/3]+(i===36?' ＋03':''),'','种子 '+a.seed+'，出生 '+a.birth+'，前 '+(slot-1)+' 槽导出事实逐项相等。分叉时 '+menu.length+' 项可选；A、B 的动作均在该菜单内。','','|分支|槽／年龄、动作|时间／精力／现金费用|工资单／当期现金净变动|后续路线操作|终章|','|---|---|---|---|---|---|');
 for(const r of [a,b,c]){
   const f=r.facts[slot-1],act=f.actions?.[0],future=r.facts.slice(slot).flatMap(f=>(f.actions??[]).map(a=>a.actionId));
   if(act)assert(menu.includes(act.routeIds[0]+'/'+act.actionId.slice(act.routeIds[0].length+1)));
   branches.push(table(r.name,f.slot+'/'+f.age+' '+(act?.actionId??'谢绝后 '+f.choiceId),act?[act.costs.time,act.costs.energy,act.costs.money].join('/'):'0/0/0',String(f.pay?.amount??'普通结算')+'／'+f.trace.fundsDelta,future.join(' → ')||'继续主事件',r.ending+'；'+state(r)));
 }
 const next=samples.map(l=>LifeRoutes.options(walk(l,slot+1)).map(o=>o.key));
 branches.push('','下一槽在引擎对照中，A 独有的合法安排：'+(next[0].filter(k=>!next[1].includes(k)&&!next[2].includes(k)).join('、')||'无')+'。B 独有：'+(next[1].filter(k=>!next[0].includes(k)&&!next[2].includes(k)).join('、')||'无')+'。');
 const traces=[a,b,c].map(r=>{
   const tail=r.facts.slice(slot-1);
   return {people:[...new Set(tail.flatMap(f=>f.people??[]))].sort(),items:Object.assign({},...tail.map(f=>f.trace.items))};
 });
 const shared=traces.every(t=>JSON.stringify(t)===JSON.stringify(traces[0]));
 branches.push('',shared?'从分叉到终章，三路的主事件人物交集和物件变动相同。具体路线人物、作品及回执另见 actions.result。':'从分叉到终章的主事件人物和物件变动：'+traces.map((t,j)=>'ABC'[j]+' '+JSON.stringify(t)).join('；')+'。');
}
write('branch-comparisons.md',branches);
const ordinary=['# 八种无梦职业','','每项来自实际浏览器人生。窗口内逐槽列出职业工作台菜单与已提交动作。菜单表示可查看，能否结算还取决于当前主事、精力和出勤。'];
for(const [i,l] of lives.filter(l=>l.ordinary).entries()){
 const r=byName.get(l.name),[id,job]=jobs[i];assert.deepEqual(r.dreams,{});
 ordinary.push('','## '+id+' '+job,'','|槽位|实际主场景|本职候选|完成的工作／资金净变动|','|---|---|---|---|');
 for(const m of r.menus){const f=r.facts[m.slot-1];ordinary.push(table(m.slot,f.eventId,m.keys.filter(k=>k.startsWith(id+'/')).map(k=>k.slice(4)).join('、'),(f.actions?.[0]?.result.detail??'本期优先主事')+'／'+f.trace.fundsDelta));}
 const echoes=r.facts.filter(f=>f.slot>=41&&f.actions);
 ordinary.push('','后续记录：'+echoes.map(f=>f.age+' 岁 '+f.actions[0].result.detail+'（来源槽 '+f.actions[0].sourceRefs.map(s=>s.slot).join('、')+'）').join('；')+'。');
}
write('ordinary-life-coverage.generated.md',ordinary);
const multi=['# 多线人生与终章对照','','以下顺序来自提交记录。完整动作、人物与物件来源可用人生名和槽位在 JSON 中查找。'];
for(const name of ['X13A','歌手暂停后旅行','换岗后重拾站名簿','开源完成后继续找家','成家与开源','分别放下两件事','外科离岗再就业','办公室交接','X11A','较早的一页']){
 const r=byName.get(name);multi.push('','## '+name,'',state(r)+'。《'+r.ending+'》，'+r.memo.age+' 岁。'+r.memo.summary,'','|槽／年龄|动作|本次事实|','|---|---|---|');
 for(const f of r.facts)for(const a of f.actions??[])multi.push(table(f.slot+'/'+f.age,a.actionId,a.result.detail??a.result.state));
}
write('multi-dream-witnesses.md',multi);
const counts={},ages=[38,45,64,72];
for(const r of rows)for(const e of r.opportunities)for(const o of e.offers)counts[o.status]=(counts[o.status]??0)+1;
const capacity=['# 时段、窗口与跨年事实','','每槽沿用两段日程上限。匹配本岗主事的专业动作可占用同一工作时段；异岗活动另占时段。已签整班会挤占空档。具体成本见分叉报告。','',
 '本批 Chrome 观察：'+Object.entries(counts).map(([k,v])=>k+' '+v).join('，')+'。一个机会在不同人生、不同槽可出现多次。没有曝光采样的整页不能计作拒绝。','',
 '明确谢绝由玩家操作；普通撤回仍允许改选。已见的可延后事项保留来源；硬截止命运检验限当槽。资格、合同或车票失效后重新判定。','',
 '|人生|38岁|45岁|64岁|72岁|','|---|---|---|---|---|'];
for(const r of rows.filter(r=>['外科离岗再就业','成家与开源','办公室交接','较早的一页','J08·普通'].includes(r.name))){
 capacity.push(table(r.name,...ages.map(age=>{const f=r.facts.find(f=>f.age===age);return f?f.eventId+' '+(f.actions?.[0]?.result.detail??f.choiceId):'此前已谢幕';})));
}
capacity.push('','年度比较以年龄和实际动作核对。大学毕业读取入学年龄与培养年限，医学任用另查住培起点。奥运按赛届，演出按场次，电影按发行与评奖，教师按聘约与校区，旅行按分段预订和返回。38→45 与 64→72 之间没有日程的年份不生成工作量或训练次数。');
write('opportunity-and-capacity.md',capacity);
