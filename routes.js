'use strict';
globalThis.LifeRoutes = (() => {
  const registry = new Map();
  const actionIds = new Set();
  const operations = {establish:'dream-established',pause:'dream-paused',resume:'dream-resumed',redirect:'dream-redirected'};
  const states = {establish:'active',pause:'paused',resume:'active',redirect:'redirected'};
  const zero = {time:0,energy:0,money:0};
  const validId = id => typeof id==='string' && !Object.hasOwn(Object.prototype,id) && /^[A-Za-z0-9-]+$/.test(id);
  function register(route) {
    const additions=LifeChapters.additions[route.id];
    if(additions)route={...route,actions:[...route.actions,...additions]};
    if (!validId(route.id) || registry.has(route.id) || !['dream','job'].includes(route.type) ||
        route.version!==1 || typeof route.goal!=='string' || !route.goal.trim() || typeof route.contact!=='function' || !Array.isArray(route.actions) ||
        !Array.isArray(route.window) || route.window.length!==2 || !route.window.every(s=>Number.isInteger(s)&&s>=1&&s<=46) ||
        route.window[0]>route.window[1]) throw Error('路线声明不合法');
    if(route.type==='job' && (!route.job || !route.wages || !['full','part','leave','study'].every(k=>Number.isSafeInteger(route.wages[k])&&route.wages[k]>=0)))throw Error('缺少聘约或薪资规则');
    const ids=new Set(actionIds);
    for (const a of route.actions) {
      if (!validId(a.id)||ids.has(a.id)||Object.hasOwn(operations,a.id)||!a.label||a.shareWith&&(!Array.isArray(a.shareWith)||new Set(a.shareWith).size!==a.shareWith.length||!a.shareWith.every(id=>registry.has(id)))||
          !['contact','investment','qualification','employment','fate-result'].includes(a.kind)||
          ![a.time,a.energy,a.money].every(n=>Number.isSafeInteger(n)&&n>=0)||a.time>2||
          typeof a.available!=='function'||a.kind==='employment'&&!['full','part','leave','study'].includes(a.mode)||a.kind==='fate-result'&&[a.judge,a.qualification,a.attempt].some(fn=>typeof fn!=='function')) throw Error('动作声明不合法 '+route.id+'/'+a.id);
      if(a.mainChoices && (!Array.isArray(a.mainChoices)||!a.mainChoices.length||!a.mainChoices.every(id=>
        LifeContent.cards.some(c=>c.choices.some(choice=>choice.id===id)))))throw Error('主活动需要已有的场景选项');
      if(a.methods && (!Array.isArray(a.methods)||!a.methods.length||new Set(a.methods.map(m=>m.id)).size!==a.methods.length||
        !a.methods.every(m=>validId(m.id)&&m.label&&m.detail)))throw Error('专属操作声明不合法');
      ids.add(a.id);
    }
    registry.set(route.id,route);
    route.actions.forEach(a=>actionIds.add(a.id));
    return route;
  }
  function ref(f,a) {
    return {branch:f.branch??null,slot:f.slot,eventId:f.eventId,choiceId:f.choiceId,...(a?{actionId:a.actionId}:{})};
  }
  function history(run,id,kind) {
    return run.facts.flatMap(f=>(f.actions??[]).filter(a=>a.routeIds.includes(id)&&(!kind||a.kind===kind)).map(a=>({action:a,source:ref(f,a)})));
  }
  function candidates(run) {
    return [...registry.values()].filter(r=>r.type==='dream').flatMap(r=>{
      const sources=run.facts.filter(r.contact).map(f=>ref(f)).concat(history(run,r.id,'contact').map(h=>h.source));
      return sources.length?[{id:r.id,goal:r.goal,window:[...r.window],sources}]:[];
    });
  }
  function dreams(run) {
    const result={};
    for(const f of run.facts) for(const a of f.actions??[]) {
      const id=a.routeIds[0];
      if(a.kind==='dream-established') result[id]={id,age:f.age,source:ref(f,a),goal:a.payload.goal,state:'active',investments:[],changes:[ref(f,a)],outcomes:[]};
      else if(a.kind.startsWith('dream-')&&result[id]) {result[id].state=a.result.state;result[id].changes.push(ref(f,a));}
      else if(['qualification','fate-result'].includes(a.kind)&&result[id]) {result[id].outcomes.push(ref(f,a));if(a.result.achieved)result[id].state='achieved';}
      else if(a.kind==='investment') for(const target of a.routeIds) result[target]?.investments.push(ref(f,a));
    }
    return result;
  }
  function contract(run) {
    const entry=run.facts.findLast(f=>f.actions?.some(a=>a.kind==='employment')||f.careerBefore!==f.careerAfter);
    if(!entry||entry.careerAfter!==run.career)return null;
    return entry.actions?.find(a=>a.kind==='employment')??null;
  }
  function employment(run){return contract(run)?.result.mode??null;}
  function payment(run,action,interrupted,unpaidShift){
    if(unpaidShift&&run.career)return {paySourceId:run.career+'-'+run.slot,routeId:action?.routeIds[0]??null,mode:'leave',interrupted,workBlocks:0,amount:0};
    if(!action){
      const current=[...registry.values()].find(r=>['J04','J05','J06','J07','J08','MED'].includes(r.id)&&r.job===run.career);
      return current?{paySourceId:run.career+'-'+run.slot,routeId:current.id,mode:'part',interrupted,workBlocks:interrupted||run.slot>42?0:1,amount:run.slot<=42&&!interrupted?current.wages.part:0}:null;
    }
    const route=registry.get(action.routeIds[0]),mode=action.result.mode;
    if(!route||run.career!==route.job)return null;
    return {paySourceId:route.job+'-'+run.slot,routeId:route.id,mode,interrupted,workBlocks:interrupted?0:({full:2,part:1,leave:0,study:0})[mode],
      amount:run.slot<=42&&!interrupted?route.wages[mode]:0};
  }
  function resolveFate(run,route,action) {
    const prepared=history(run,route.id,'investment');
    const attempt=action.attempt(run);
    const qualification=action.qualification(run,prepared);
    const outside=LifeEngine.hash(run.seed,route.id,route.version,attempt)%5-2;
    const passed=qualification.length>0&&action.judge(prepared,outside,run);
    return {...(passed&&action.completeOnPass?{achieved:true}:{}),qualification,externalSource:[run.seed,route.id,route.version,attempt],attemptId:attempt,opportunityId:action.id,external:outside,preparation:prepared.map(p=>p.source),
      outcome:!qualification.length?'资格不足':passed?'通过':'本次未通过',next:action.next??'可在后续训练窗口继续练习'};
  }
  function options(run) {
    if(run.stage!=='event'||run.committed||run.activity||['early-diagnosis','early-goodbye'].includes(run.eventId))return [];
    const known=dreams(run), contacts=candidates(run), list=[];
    const context={seed:run.seed,slot:run.slot,eventId:run.eventId,career:run.career,facts:run.facts};
    for(const route of registry.values()) {
      const inWindow=run.slot>=route.window[0]&&run.slot<=route.window[1];
      if(!inWindow&&!route.actions.some(a=>a.window&&a.window[0]<=run.slot&&a.window[1]>=run.slot))continue;
      const candidate=contacts.find(c=>c.id===route.id), dream=known[route.id];
      function add(op,label,kind,costs,result,sources,payload={},targets=[route.id]) {
        list.push({key:route.id+'/'+op,label,receipt:{schema:1,actionId:route.id+'-'+op,kind,routeIds:targets,sourceRefs:sources,
          payload:{ruleVersion:route.version,goal:route.goal,...payload},costs:{...costs},result}});
      }
      if(inWindow && candidate && (dream?.state==='active'||!route.canPursue||route.canPursue(context))) {
        const ops=!dream?['establish']:dream.state==='active'?['pause','redirect']:dream.state==='achieved'?[]:['resume'];
        for(const op of ops)add(op,({establish:'记下目标',pause:'先搁置',resume:'重新拾起',redirect:'放下这个目标'})[op]+' · '+route.goal,operations[op],zero,{state:states[op]},dream?[dream.source]:candidate.sources);
      }
      for(const a of route.actions) {
        if(!inWindow&&!a.window)continue;
        if(a.mainChoices&&!LifeContent.cards.find(c=>c.id===run.eventId)?.choices.some(c=>a.mainChoices.includes(c.id)))continue;
        if(route.type==='job'&&!a.visitor&&(route.job!==run.career||!run.facts.some(route.contact))||!a.available(context)||route.type==='dream'&&a.kind!=='contact'&&dream?.state!=='active'&&!(a.after&&dream?.state==='achieved'))continue;
        const sources=dream?[dream.source]:run.facts.filter(route.contact).slice(-1).map(f=>ref(f));
        const result=a.kind==='fate-result'?resolveFate(context,route,a):{detail:a.feedback,...(a.mode?{mode:a.mode}:{})};
        if(a.kind==='fate-result')sources.push(...result.preparation);
        if(a.station&&a.kind==='fate-result')for(const s of result.qualification)if(!sources.some(x=>x.slot===s.slot&&x.actionId===s.actionId))sources.push(s);
        if(a.kind==='fate-result'&&history(run,route.id,a.kind).some(h=>h.action.result.attemptId===result.attemptId))continue;
        const targets=[route.id,...(a.workRoute&&registry.get(a.workRoute)?.job===run.career?[a.workRoute]:[]),...(a.shareWith??[]).filter(id=>known[id]?.state==='active')];
        const duty=(a.workRoute&&registry.get(a.workRoute)?.job===run.career)||(route.type==='job'&&a.station&&!a.visitor&&!a.administrative&&!a.id.startsWith('resign-'));
        const current=run.draft?.route===route.id+'/'+a.id;
        const steps=current?(run.draft.routeSteps??[]):[];
        const method=a.methods?.find(m=>m.id===run.draft?.routeMethod&&run.draft?.route===route.id+'/'+a.id)??a.methods?.[0];
        if(method)result.detail=method.detail;
        if(a.proof)sources.push(...a.proof(context));
        if(a.resolve)Object.assign(result,a.resolve(context,method,result));
        add(a.id,a.label,a.kind,{time:a.time,energy:a.energy,money:a.money,...(a.costs?.(context)??{})},result,sources,{...(duty?{duty:route.job??run.career}:{}),...(method?{method:method.id}:{}),...(a.steps?{steps:[...steps]}:{}),...(a.mainChoices?{mainChoices:[...a.mainChoices]}:{})},targets);
        if(a.campus)list.at(-1).campus=a.campus;
        if(method)list.at(-1).methods=a.methods;
        if(a.station)list.at(-1).station=a.station;
        if(a.steps)list.at(-1).steps=a.steps;
      }
    }
    return list;
  }
  function see(run,key) {
    if(run.draft.routeSeen?.includes(key)||!options(run).some(o=>o.key===key))return false;
    (run.draft.routeSeen??=[]).push(key);
    return true;
  }
  function offers(run){
    const seen=run.draft.routeSeen??[];
    const pending=new Map();
    for(const fact of run.facts){
      for(const previous of fact.routeOffers??[]){
        if(previous.status==='deferred')pending.set(previous.key,{source:ref(fact),until:previous.until});
        else if(previous.status!=='unseen')pending.delete(previous.key);
      }
    }
    if(!seen.length&&!run.draft.route&&!pending.size)return [];
    const available=options(run);
    const rows=[];
    if(seen.length||run.draft.route)for(const o of available){
      const route=registry.get(o.receipt.routeIds[0]);
      const action=route.actions.find(a=>o.key===route.id+'/'+a.id);
      const until=action?.kind==='fate-result'?run.slot:(action?.until??route.window[1]);
      const selected=o.key===run.draft.route;
      const exposed=seen.includes(o.key);
      const declined=run.draft.routeDeclined?.includes(o.key);
      const status=selected?'resolved':declined?'declined':!exposed?'unseen':run.slot<until?'deferred':'expired';
      const prior=pending.get(o.key);
      rows.push({key:o.key,seen:exposed||selected,status,until,...(selected&&prior?{continuedFrom:prior.source}:{})});
    }
    for(const key of new Set([...pending.keys(),...seen])){
      const prior=pending.get(key);
      if(available.some(o=>o.key===key)){
        if(prior&&run.slot>=prior.until&&!rows.some(o=>o.key===key&&o.status!=='unseen')){
          const unseen=rows.find(o=>o.key===key);
          const expiry={key,seen:false,status:'expired',until:prior.until,previous:prior.source};
          if(unseen)Object.assign(unseen,expiry);else rows.push(expiry);
        }
        continue;
      }
      rows.push({key,seen:seen.includes(key),status:prior?.until<run.slot?'expired':'invalidated',
        ...(prior?{previous:prior.source}:{})});
    }
    return rows;
  }
  function decline(run){
    const key=run.draft.route;
    if(!key||!options(run).some(o=>o.key===key))return false;
    see(run,key);
    if(!run.draft.routeDeclined?.includes(key))(run.draft.routeDeclined??=[]).push(key);
    return choose(run,'draft','cancel');
  }
  function choose(run,id,op) {
    if(run.stage!=='event'||run.committed||run.activity)return false;
    if(op==='cancel'){delete run.draft.routeSteps;delete run.draft.stepNote;delete run.draft.route;delete run.draft.routeMethod;return true;}
    const key=id+'/'+op;
    if(!options(run).some(o=>o.key===key))return false;
    if(run.draft.routeDeclined?.includes(key))run.draft.routeDeclined=run.draft.routeDeclined.filter(previous=>previous!==key);
    if(run.draft.route!==key){delete run.draft.routeMethod;delete run.draft.routeSteps;delete run.draft.stepNote;}
    run.draft.route=key;return true;
  }
  function chooseStep(run,id){
    const selected=options(run).find(o=>o.key===run.draft.route);
    const steps=run.draft.routeSteps??[];
    const choice=selected?.steps?.[steps.length]?.choices.find(c=>c.id===id);
    if(!choice)return false;
    run.draft.stepNote=choice.detail;
    if(!choice.retry)run.draft.routeSteps=[...steps,id];
    return true;
  }
  function validSteps(option){
    if(!option.steps)return true;
    const actual=option.receipt.payload.steps;
    return actual.length===option.steps.length&&option.steps.every((s,i)=>s.choices.some(c=>!c.retry&&c.id===actual[i]));
  }
  function chooseMethod(run,id){
    const current=options(run).find(o=>o.key===run.draft.route);
    if(!current?.methods?.some(m=>m.id===id))return false;
    run.draft.routeMethod=id;return true;
  }
  function budget(run,base,receipt){
    const mode=receipt?.kind==='employment'?receipt.result.mode:employment(run);
    const mainTime=base.day?.mainBlocks||1;
    const replacesMain=receipt?.payload.mainChoices?.includes(base.choice?.id)||receipt?.payload.duty===run.career&&!!run.career&&LifeContent.cards.find(c=>c.id===run.eventId)?.job===run.career;
    const main=replacesMain?Math.max(mainTime,receipt.costs.time,mode==='full'?2:1):Math.max(mainTime,mode==='full'?2:1);
    return main+Number(!!base.day?.extra)+Number(!!base.response)+Number(!!run.draft?.support?.includes('money'))+(replacesMain?0:receipt?.costs.time??0);
  }
  function plan(run,base) {
    if(!run.draft.route)return null;
    const selected=options(run).find(o=>o.key===run.draft.route);
    if(run.draft.routeMethod&&!selected?.methods?.some(m=>m.id===run.draft.routeMethod))return {error:'此前的操作已过期，请重新选择'};
    if(!selected)return {error:'这次安排已经不合适了'};
    const {costs}=selected.receipt;
    const usedTime=budget(run,base,selected.receipt);
    const spending=[base.choice,base.day?.extra,base.response].reduce((sum,a)=>sum+Math.min(0,a?.delta?.money??0),0);
    let error=null;
    if(run.draft.followup&&!base.response||run.draft.dayExtra&&!base.day?.extra)error='先撤回失效的日程';
    else if(selected.campus&&LifeTeacherCampus(run)!==selected.campus)error='这项当班工作需要在'+selected.campus+'任教';
    else if(selected.receipt.payload.duty&&(['leave','study'].includes(employment(run))||run.low?.status==='active'))error='本期没有出勤，先复工或改签班次';
    else if(selected.receipt.actionId!=='J04-endfood'&&Object.hasOwn(selected.receipt.result,'newJob')&&selected.receipt.result.newJob!==run.career&&LifeOwnsKitchen(run))error='请先清算小食堂，交接店款、余料与未履约订单';
    else if(Object.hasOwn(selected.receipt.result,'newJob')&&base.choice?.commands.some(c=>c.startsWith('job:')&&c.slice(4)!==selected.receipt.result.newJob))error='两份岗位安排时间重叠，请先选一份';
    else if(!validSteps(selected))error='请先完成工作台上的步骤';
    else if(selected.station&&(!run.draft.routeMethod||selected.methods.find(m=>m.id===run.draft.routeMethod)?.retry))error='请在工作台上完成这次操作';
    else if(selected.receipt.payload.mainChoices&&!selected.receipt.payload.mainChoices.includes(base.choice?.id))error='请先把对应的专业活动选为主事';
    else if(usedTime>2)error='这段时间已排满';
    else if(/^30-leg[1-3]$/.test(selected.receipt.actionId)&&run.stats.health<30)error='长程换乘超过本期体力，可改约或取消已订行程';
    else if(costs.energy>base.remaining)error='精力不足';
    else if(costs.money){
      const dueRent=selected.receipt.result.rent?0:LifeChapters.residence(run)?.a.result.rent??0;
      if(costs.money>run.stats.money+spending-dueRent)error=dueRent?'扣除本期房租后存款不够':'手边的存款不够';
    }
    return {...selected,error,usedTime};
  }
  const shift=r=>r.slot>=24&&r.slot<=40&&r.career==='office'&&!['office-pivot','active-recovery','late-recovery','life-40'].includes(r.eventId);
  const practice=(id,label,feedback,money,available)=>({id,label,feedback,money,time:1,energy:1,kind:'investment',available});
  register({id:'01',type:'dream',goal:'争取电竞世界赛',version:1,window:[11,40],contact:f=>['life-11-0','life-16-0','arena-club-0'].includes(f.choiceId),
    actions:[{...practice('replay','回放失位的一拍，重报队友位置','录像停在拐角，你把报点提前了一拍。',0,r=>r.slot<=38),until:38,methods:[
      {id:'corner',label:'把报点放在拐角前',detail:'队友还没出拐角就听到位置，及时收住了脚步。'},
      {id:'after',label:'等对手露面再报点',detail:'位置报准了，队友却已过了拐角。你把两句话在录像上对了一遍。'}]},
    {...practice('scrimmage','参加本期配合测评','',50,r=>[24,32].includes(r.slot)),kind:'fate-result',attempt:r=>'club-round-'+r.slot,qualification:(r,p)=>p.length>=2?p.slice(0,2).map(e=>e.source):[],judge:(p,x)=>p.length+x>=3}]});
  register({id:'03',type:'dream',goal:'争取清华或北大录取',version:1,window:[7,44],contact:f=>['life-7-0','life-7-1','school-prep-0','school-exam-0'].includes(f.choiceId),
    actions:[...['本科','硕士'].map((level,i)=>({id:i?'ask-grad':'ask-undergrad',kind:'contact',until:29,label:'下班去问'+level+'报考条件',feedback:i?'咨询老师请你先核对已有学历和目标专业的简章。':'你记下普通高考报名地和当年资格核对事项。',time:1,energy:1,money:0,available:r=>r.slot>=24&&r.slot<=29&&!!r.career&&!history(r,'03','contact').length})),
    {after:true,...practice('revise','遮住答案，重写漏掉的推导','你把漏掉的条件补在等式左边。',0,r=>r.slot<=43),until:43,methods:[
      {id:'domain',label:'先补分母取值范围',detail:'你在第一行标出分母不能为零，划掉了那个不成立的解。'},
      {id:'check',label:'把答案代回原式',detail:'等号两边对不上。你沿着草稿往回找，在约分那一行圈出了漏掉的条件。'}]}]});
  register({id:'J01',type:'job',job:'office',wages:{full:300,part:150,leave:0,study:0},goal:'办公室工作',version:1,window:[24,40],contact:f=>f.careerAfter==='office',actions:
    [['full','约定整班出勤（300 元）'],['part','签档案室半班聘约，停领整班薪水'],['leave','申请离岗'],['study','停薪学习']].map(([mode,label])=>({id:'shift-'+mode,kind:'employment',mode,label,feedback:label+'的安排写进了班表。',time:mode==='part'?1:0,energy:0,money:0,available:shift}))});
  LifeChapters.routes.forEach(register);
  return {register,decline,see,offers,candidates,dreams,budget,employment,contract,payment,chooseStep,validSteps,chooseMethod,history,options,plan,choose,resolveFate};
})();
