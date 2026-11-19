'use strict';
const fs=require('node:fs'),path=require('node:path');
require('../../../../tests/p32.cjs');
const data=require('./causal-evidence.generated.json');
const {lives}=require('../../../../tests/p33-lives.cjs');
const output=(name,lines)=>fs.writeFileSync(path.join(__dirname,name),lines.join('\n')+'\n');
const routes=LifeChapters.routes.filter(r=>['02','07','08','11','12','25','30','J05','J08','MED'].includes(r.id));
const matrix=['# 实际场景与覆盖','', '从本次 Chrome 导出和正式路线声明读取。每项资源依次为时间段、精力、个人资金。空白见证用「另有入口」标记，可与专项 Node 测试对照。'];
const witnesses=['# 从首页走到终章的 21 段人生','','每一行都是浏览器提交后的回合记录。槽位后的来源序号可在同一人生的事实数组中定位。完整主线选择、命运外因、原始收据及班表见同目录 JSON。'];
for(const route of routes){
  matrix.push('','## '+route.id+' '+route.goal,'','|操作|槽位|资源|职责或现场|21 局中的结果|','|---|---|---|---|---|');
  for(const a of route.actions){
    const hits=data.flatMap(l=>l.facts.flatMap(f=>(f.actions??[]).filter(h=>h.actionId===route.id+'-'+a.id)));
    const result=hits.length?[...new Set(hits.map(h=>h.result.outcome??(h.result.achieved?'达成':h.result.mode??'已提交')))].join('、'):'另有入口';
    matrix.push('|'+[a.label,(a.window??route.window).join('–'),[a.time,a.energy,a.money].join(' / '),a.station??a.feedback,result].join('|')+'|');
  }
}
for(const l of data){
  const spec=lives.find(x=>x.name===l.name),birth=LifeContent.origins.find(o=>o.id===l.birth).name;
  witnesses.push('','## '+l.name,'', '种子 '+l.seed+'，'+birth+'。目标状态 '+l.dreams[spec.id].state+'。第 '+l.facts.at(-1).slot+' 槽进入《'+l.ending+'》。','','|槽 / 年龄|主线选择|实际操作|已提交反馈|来源槽|','|---|---|---|---|---|');
  for(const f of l.facts)for(const a of f.actions??[]){
    witnesses.push('|'+[f.slot+' / '+f.age,f.choiceId,a.actionId+' '+(a.payload.method??''),[a.result.outcome,a.result.detail??a.result.state].filter(Boolean).join(' · '),a.sourceRefs.map(s=>s.slot).join('、')||'首次接触／岗位入口'].join('|')+'|');
  }
}
output('route-coverage.generated.md',matrix);output('branch-witnesses.md',witnesses);
