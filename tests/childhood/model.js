'use strict';
// A small, in-memory playtest fixture. IDs never enter a production save.
globalThis.Childhood = (() => {
  const actions = {
    find:['阿宁','帮阿宁一起找','阿宁从长凳旁拎出水壶，朝你晃了晃。'],
    note:['留言板','画张寻物纸条','你画的红水壶贴上了留言板。放学的孩子停下来看看。'],
    tell:['老师','告诉老师后回家','老师点点头，走到长凳旁接手寻找。你先回家了。'],
    lead:['低年级孩子','陪孩子去找老师','你陪他走到老师身边。他终于松开攥紧的衣角。'],
    friend:['阿宁','请阿宁一起帮忙','阿宁拎着熟悉的壶跑过来，陪孩子去找老师。'],
    teacher:['老师','请附近的老师过来','老师走下台阶，俯身听孩子把话讲完。']
  };
  function start(){return {age:6,facts:[]};}
  function options(s){
    if(s.facts.some(f=>f.age===s.age))return [];
    return s.age===6?['find','note','tell']:['lead',...(s.facts[0]?.action==='find'?['friend']:[]),'teacher'];
  }
  function choose(s,id){
    if(!options(s).includes(id))return false;
    s.facts.push({age:s.age,action:id,id:'school-gate-'+s.age+'-'+id,source:s.age===8?s.facts[0].id:null});
    return true;
  }
  function next(s){if(s.age!==6||!s.facts.length)return false;s.age=8;return true;}
  return {actions,start,options,choose,next};
})();
