'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
require('../../../../tests/p32.cjs');
const root=__dirname;
const write=(name,lines)=>fs.writeFileSync(path.join(root,name),lines.join('\n')+'\n');
const load=p=>JSON.parse(fs.readFileSync(p));
const data=[...load('/tmp/p36/p32/causal-evidence.generated.json'),...load('/tmp/p36/p33/causal-evidence.generated.json'),...load('/tmp/p36/p34/career-evidence.generated.json'),...load('../p3-5/causal-evidence.generated.json'.replace('../',root+'/../'))];
fs.writeFileSync(path.join(root,'route-evidence.generated.json'),JSON.stringify(data)+'\n');
const cases={
'01':['少年赛场','成年试训','竞技未竟'],'02':['第一栏·直路','第一栏·重拾','第一栏·未竟'],
'03':['少年本科','在职重考','重考落选'],'07':['站名簿·直路','站名簿·重拾','站名簿·未竟'],
'08':['两张交班单·直路','两张交班单·重拾','两张交班单·未竟'],
'11':['雨棚·直路','雨棚·重拾','雨棚·未竟'],'12':['潮痕·直路','潮痕·重拾','潮痕·未竟'],
'25':['两根纸条·直路','两根纸条·重拾','两根纸条·未竟'],
'29':['工厂附近的家','搬离再安顿','租住未竟'],'30':['回程线·直路','回程线·重拾','回程线·未竟'],
J01:['办公室交接','并组撤岗','X01A'],J02:['制造带教','工位转向','X03A'],J03:['街区老客','站点调度','X04A'],
...Object.fromEntries(['J04','J05','J06','J07','J08'].map(id=>[id,['普通','改变','交汇'].map(k=>id+'·'+k)]))
};
const witnesses=['# 54 项路线覆盖索引','', '本轮 Chrome 实际提交记录。每行索引具体人生、槽位、动作和结果。'];
const matrix=['# 十八路线实际覆盖','','|路线|直路／长期|弯路／改变|未竟／竞争|接触到结果的已提交动作|','|---|---|---|---|---|'];
for(const [id,names] of Object.entries(cases)){
 const lives=names.map(name=>{const r=data.find(r=>r.name===name);assert(r,name);return r});
 matrix.push('|'+id+'|'+names.join('|')+'|'+new Set(lives.flatMap(r=>r.facts.flatMap(f=>f.actions??[]).filter(a=>a.routeIds.includes(id)).map(a=>a.actionId))).size+'|');
 for(const [i,r] of lives.entries()){
 witnesses.push('','## '+id+' / '+['A','B','C'][i]+' / '+r.name,'','种子 '+r.seed+'，出生 '+r.birth+'，'+r.facts.length+' 个实际回合，终章《'+r.ending+'》。梦想状态 '+JSON.stringify(r.dreams?.[id]?.state??'无正式梦想')+'。');
 for(const f of r.facts)for(const a of f.actions??[])if(a.routeIds.includes(id))
 witnesses.push('- '+f.slot+' 槽／'+f.age+' 岁，主选择 '+f.choiceId+'，'+a.actionId+'／'+(a.payload.method??'')+'，费用 '+JSON.stringify(a.costs)+'，来源 '+a.sourceRefs.map(s=>s.slot).join(',')+'；'+(a.result.detail??a.result.state));
 }
}
const defs=[...LifeChapters.routes,...Object.keys(LifeChapters.additions).map(id=>({id,actions:LifeChapters.additions[id]}))];
matrix.push('','主事件 '+LifeContent.cards.length+'，主选择 ID '+new Set(LifeContent.cards.flatMap(c=>c.choices.map(c=>c.id))).size+'。章节动作 '+defs.reduce((n,r)=>n+r.actions.length,0)+'（基础注册动作另列于 routes.js）。统计按当前配置生成。');
write('route-matrix.generated.md',matrix);write('branch-witnesses.md',witnesses);
const {walk}=require('../../../../tests/p32.cjs');
const contact={'01':'open-room','02':'lane','03':'ask-undergrad','07':'issue','08':'observe','11':'verse','12':'extra','25':'visit','29':'walk-block','30':'board'};
const origins=['# 60 个出生入口','','以下证据止于接触后主动确立，不代表最高成就。'];
for(const seed of [1,2,3,4,9,12])for(const [id,op] of Object.entries(contact)){
 const r=walk({seed,job:'office',actions:{24:id+'/'+op,25:id+'/establish'}},26);
 assert.equal(LifeRoutes.dreams(r)[id].state,'active');
 origins.push('- '+seed+'／'+r.birth+'／'+id+'：24 槽 '+op+'，25 槽 establish，来源 '+JSON.stringify(r.facts[24].actions[0].sourceRefs));
}
write('origin-fairness.generated.md',origins);
