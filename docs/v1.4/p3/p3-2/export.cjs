'use strict';
// Rebuild the Markdown indices from production definitions and the completed Chrome run.
const fs=require('node:fs'),path=require('node:path');
require('../../../../content.js');require('../../../../chapters.js');
const rows=JSON.parse(fs.readFileSync(path.join(__dirname,'causal-evidence.generated.json')));
const configs={...LifeChapters.additions,...Object.fromEntries(LifeChapters.routes.map(r=>[r.id,r.actions]))};
const lines=['# 正式路线、窗口与运行覆盖','','时间、精力、个人现金三项成本按列中顺序排列。见证取自正式页面。未在这组人生选择的可选动作也列出。','','| 路线 | 正式动作 | 可用槽 | 类别 | 成本 | 在哪条人生确认过 |','| --- | --- | --- | --- | --- | --- |'];
for(const id of ['01','03','29','J01','J02','J03'])for(const a of configs[id]){
  const witness=rows.find(r=>r.facts.some(f=>f.actions?.some(x=>x.actionId===id+'-'+a.id)));
  lines.push('| '+[id,a.label+'（`'+a.id+'`）',(a.window??[24,40]).join('–'),a.kind,[a.time,a.energy,a.money].join(' / '),witness?.name??'此组未选择'].join(' | ')+' |');
}
lines.push('','早期接触、原职业卡、原工作样单和旧电竞决赛延续既有配置。实际主事件与主选择逐槽保存在机器记录中。共同前置条件还包括确立状态、当前岗位、专业资格和剩余日程。','');
fs.writeFileSync(path.join(__dirname,'route-coverage.generated.md'),lines.join('\n'));
const names=Object.fromEntries(LifeContent.origins.map(o=>[o.id,o.name]));
const witnesses=['# 从出生到终章的路线见证','','以下每条记录从正式首页新建。括号中的槽号用于在机器证据中查具体事件、主选择、方法、前置来源和费用。','','[完整逐槽数据](causal-evidence.generated.json)',''];
for(const r of rows){
  witnesses.push('## '+r.name,'','种子 '+r.seed+'，出身「'+names[r.birth]+'」。第 '+r.facts.at(-1).slot+' 槽、'+r.facts.at(-1).age+' 岁翻到《'+r.ending+'》。','','| 槽／年龄 | 当期主选择 | 正式动作 | 结果 |','| --- | --- | --- | --- |');
  for(const f of r.facts)for(const a of f.actions??[]){
    const v=a.result;const detail=[v.school,v.level==='ug'?'本科':v.level==='ms'?'硕士':'',v.outcome,v.detail??v.state,v.achieved?'完成目标':''].filter(Boolean).join(' · ');
    witnesses.push('| '+[f.slot+'／'+f.age,f.choiceId,a.actionId,detail].join(' | ')+' |');
  }
  witnesses.push('');
}
fs.writeFileSync(path.join(__dirname,'branch-witnesses.md'),witnesses.join('\n'));
