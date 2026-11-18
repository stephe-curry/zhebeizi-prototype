'use strict';
// A small, in-memory playtest fixture. IDs never enter a production save.
globalThis.Childhood = (() => {
  const actions = {
    find:['长凳下的红色','查看长凳下面','你从长凳底下找出红水壶，递给阿宁。他接过壶，笑着说：“原来在这儿！谢谢你。”'],
    tell:['老师','请值日老师帮忙','你告诉值日老师阿宁丢了水壶，还指给她看长凳下的红色。老师走过去说：“我来找。你先去找接你的人吧。”'],
    lead:['低年级孩子','陪孩子去找老师','你陪他走到老师身边。他终于松开攥紧的衣角。'],
    friend:['阿宁','请阿宁一起帮忙','阿宁拎着熟悉的壶跑过来，陪孩子去找老师。'],
    teacher:['老师','请附近的老师过来','老师走下台阶，俯身听孩子把话讲完。']
  };
  function start(){return {age:6,facts:[]};}
  function recognition(s){
    return s.age===8?s.facts.find(f=>f.age===6 && f.action==='find'):undefined;
  }
  function options(s){
    if(s.facts.some(f=>f.age===s.age))return [];
    return s.age===6?['find','tell']:['lead',...(recognition(s)?['friend']:[]),'teacher'];
  }
  function choose(s,id){
    if(!options(s).includes(id))return false;
    s.facts.push({age:s.age,action:id,id:'school-gate-'+s.age+'-'+id,source:s.age===8?s.facts[0].id:null});
    return true;
  }
  function next(s){if(s.age!==6||!s.facts.length)return false;s.age=8;return true;}
  return {actions,start,recognition,options,choose,next};
})();
