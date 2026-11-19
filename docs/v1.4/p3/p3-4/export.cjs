'use strict';
const fs=require('node:fs'),path=require('node:path');require('../../../../tests/p32.cjs');
const data=require('./career-evidence.generated.json'),{lives}=require('../../../../tests/p34-lives.cjs');
const write=(n,a)=>fs.writeFileSync(path.join(__dirname,n),a.join('\n')+'\n');
const coverage=['# 职业活动矩阵','','按正式路线定义与浏览器提交事实生成。窗口为槽位，费用依次为时间、精力和现金。动态退款金额取原成交单。'];
const witnesses=['# 15 段职业人生','','正式首页生成种子，通过页面操作提交。完整主线选择和工资在 career-evidence.generated.json。'];
for(const id of ['J04','J05','J06','J07','J08']){
 const route=LifeChapters.routes.find(r=>r.id===id);coverage.push('','## '+id+' '+route.goal,'','|动作|窗口|费用|实际提交数|','|---|---|---|---|');
 for(const a of route.actions){const n=data.flatMap(l=>l.facts.flatMap(f=>f.actions??[])).filter(a2=>a2.actionId===id+'-'+a.id).length;
 coverage.push('|'+[a.label,a.window?.join('–'),[a.time,a.energy,a.money].join('/'),n].join('|')+'|');}
}
for(const l of data){
 witnesses.push('','## '+l.name,'','种子 '+l.seed+'，出生 '+l.birth+'，第 '+l.facts.at(-1).slot+' 槽进入《'+l.ending+'》。梦想状态 '+JSON.stringify(l.dreams)+'。','','|槽位/年龄|主线选择|职业或梦想行动|反馈|现金与来源|','|---|---|---|---|---|');
 for(const f of l.facts)for(const a of f.actions??[])witnesses.push('|'+[f.slot+'/'+f.age,f.choiceId,a.actionId+' '+(a.payload.method??''),a.result.detail??a.result.state,'费用'+a.costs.money+'；合同收款'+(a.result.servicePay??0)+'；工资'+(f.pay?.amount??'沿旧机制')+'；来源'+a.sourceRefs.map(s=>s.slot).join(',')].join('|')+'|');
}
write('career-coverage.generated.md',coverage);write('branch-witnesses.md',witnesses);
