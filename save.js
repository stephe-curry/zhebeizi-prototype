'use strict';

globalThis.LifeSave = (() => {
  const C = globalThis.LifeContent;
  const key = 'zhebeizi-1.3.2-prototype';
  const version = 2;
  const isCurrent = value => value?.format === key && value.version === version;
  const fresh = () => ({version,format:key,revision:'',points:0,talents:[],trees:{},branches:{},active:null,motion:'auto',sound:false});

  function decode(json) {
    const value = JSON.parse(json);
    if (!isCurrent(value)) return null;
    for (const [branchId,branch] of Object.entries(value.branches ?? {})) {
      const run = branch?.run;
      if(run?.reviewedVersion!==undefined || run?.readingReviewed){
        if(!Array.isArray(run.facts) || !LifeReviewed.validHistory(run))return null;
      }
      if(run && run.branchId===undefined && run.stage==='event')run.branchId=branchId;
      if(run?.stage==='event'&&run.draft?.route&&!LifeRoutes.options(run).some(o=>o.key===run.draft.route)){
        delete run.draft.route;run.draft.routeNotice='此前的手记安排已过期，请重新选择。';
      }
      const session = run?.draft?.interaction;
      // The previous yoyo draft allowed a direct purchase. Restart only unfinished
      // sessions from that version, keeping the deposit and all committed facts.
      if (run?.childhood === 'spring-gift' && run.slot === 2 && run.eventId === C.giftEvents[1] &&
          run.stage === 'event' && !run.committed && session?.eventId === run.eventId &&
          session.variant === undefined) {
        delete run.draft.interaction;
        continue;
      }
      if (run?.stage !== 'event' || run.committed || run.slot !== 4 || run.eventId !== 'life-4' ||
          session?.eventId !== 'life-4' || session.variant !== undefined ||
          !Array.isArray(session.actions) || !session.actions.includes('story-2')) continue;
      const scene = globalThis.LifeEngine.currentCard(run)?.interaction;
      if (scene?.sceneId !== 'family-dinner' || scene.actions.some(action => action.actionId === 'story-2')) continue;
      // Keep the other beats. The old finish confirmed a story that is no longer eligible.
      session.actions = session.actions.filter(id => id !== 'story-2' && id !== 'finish');
    }
    return value;
  }

  function read(storage) {
    return decode(storage.getItem(key));
  }

  function write(storage,value) {
    if (!isCurrent(value)) throw Error('存档格式不匹配');
    storage.setItem(key,JSON.stringify(value));
  }

  function validateImport(incoming) {
    const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
    const id = value => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
    const slot = value => Number.isInteger(value) && value>=1 && value<=46;
    const entries = list => Array.isArray(list) && list.every(e=>record(e) && id(e.id)
      && ['ineligible','eligible','deferred','offered','invalidated','expired','declined','resolved'].includes(e.status)
      && typeof e.seen==='boolean' && typeof e.selected==='boolean' && typeof e.eligible==='boolean'
      && Array.isArray(e.sources) && e.sources.every(r=>record(r)&&slot(r.slot)) && Array.isArray(e.window)
      && e.window.length===2 && e.window.every(slot));
    const fact = value => record(value) && slot(value.slot) && Number.isFinite(value.age)
      && ['people','echoes','items','highlights'].every(key=>Array.isArray(value[key]))
      && (value.trace===undefined || record(value.trace)&&value.trace.schema===1&&entries(value.trace.candidates)&&Array.isArray(value.trace.commands)&&value.trace.commands.every(c=>typeof c==='string'))
      && value.items.every(key=>Object.hasOwn(C.items,key))
      && value.echoes.every(echo=>record(echo)&&typeof echo.text==='string')
      && (value.relations===undefined||Array.isArray(value.relations)&&value.relations.every(change=>record(change)&&Object.hasOwn(C.people,change.id)));
    const activity = value => !value || (value.kind==='study'
      ? Number.isFinite(value.deadline)&&Array.isArray(value.tiles)&&value.tiles.length===42&&value.tiles.every(tile=>Number.isInteger(tile)&&tile>=0&&tile<5)
      : value.kind==='duel'&&Array.isArray(value.rounds)&&value.rounds.length<3);
    function routeHistory(run) {
      const prefix={...run,stage:'event',committed:false,activity:null,facts:[]};
      let previous=0,interrupted=false;
      for(const f of run.facts){
        if(f.slot<=previous)return false;
        previous=f.slot;
        Object.assign(prefix,{slot:f.slot,eventId:f.eventId,career:f.careerBefore});
        if(typeof f.text==='string'&&f.text.includes('日常收入暂时中断，生活支出仍在继续。'))interrupted=true;
        if(f.trace?.commands.some(c=>c.startsWith('recover:')))interrupted=false;
        if(f.incomeChange!==undefined&&f.incomeChange!==(interrupted?'interrupted':'restored'))return false;
        if(f.routeOffers!==undefined&&(!Array.isArray(f.routeOffers)||!f.routeOffers.every(o=>record(o)&&typeof o.key==='string'&&typeof o.seen==='boolean'&&['unseen','resolved','deferred','expired','invalidated','declined'].includes(o.status))))return false;
        if(f.actions!==undefined){
          if(!Array.isArray(f.actions)||f.actions.length!==1||!record(f.actions[0])||f.age!==C.ages[f.slot-1])return false;
          const event=C.cards.find(c=>c.id===f.eventId&&c.slot===f.slot);
          const choice=f.slot===23&&event&&f.choiceId===event.id+'-continue-study'&&LifeChapters.specialStudy(prefix)?event.choices.length:event?.choices.findIndex(c=>c.id===f.choiceId);
          if(choice===undefined||choice<0)return false;
          const actual=f.actions[0];
          if(f.plan?.support!==undefined&&!Array.isArray(f.plan.support))return false;
          if(actual.payload?.steps!==undefined&&!Array.isArray(actual.payload.steps))return false;
          prefix.draft={support:f.plan?.support,routeSteps:actual.payload?.steps,route:actual.routeIds?.[0]+'/'+String(actual.actionId).slice(String(actual.routeIds?.[0]).length+1),routeMethod:actual.payload?.method};
          const option=LifeRoutes.options(prefix).find(o=>o.receipt.actionId===actual.actionId);
          const expected=option?.receipt;
          if(option&&(!LifeRoutes.validSteps(option)||option.methods?.find(m=>m.id===actual.payload?.method)?.retry))return false;
          if(expected&&Object.hasOwn(expected.result,'newJob')&&f.careerAfter!==expected.result.newJob)return false;
          if(!expected||!same(expected,actual))return false;
          for(const source of expected.sourceRefs){
            const host=prefix.facts.find(h=>h.slot===source.slot);
            if(!host||host.age!==C.ages[host.slot-1]||!C.cards.some(c=>c.id===host.eventId&&c.slot===host.slot))return false;
          }
          const mainBlocks=C.dayPlans[f.eventId]?.costs[choice]??1;
          if(actual.payload.mainChoices&&!actual.payload.mainChoices.includes(f.choiceId))return false;
          if(LifeRoutes.budget(prefix,{choice:{id:f.choiceId},day:{mainBlocks,extra:f.dayExtra},response:f.followup},actual)>2)return false;
        }
        const contract=f.actions?.find(a=>a.kind==='employment')??(f.careerBefore===f.careerAfter?LifeRoutes.contract(prefix):null);
        const expectedPay=LifeRoutes.payment({...prefix,career:f.careerAfter},contract,interrupted,f.actions?.[0]?.result.unpaidShift);
        if(expectedPay?!same(expectedPay,f.pay):f.pay!==undefined)return false;
        const home=LifeChapters.residence(prefix);
        const rent=home&&!f.actions?.[0]?.result.rent?{amount:home.a.result.rent,source:home.source}:undefined;
        if(!same(rent,f.rent))return false;
        prefix.facts.push(f);
      }
      if((run.result?.fact?.actions||run.result?.fact?.pay||run.stage==='result'&&run.facts.at(-1)?.actions)&&!same(run.result?.fact,run.facts.at(-1)))return false;
      return !run.memo||Array.isArray(run.memo.timeline)&&!run.memo.timeline.some(f=>(!f||((f.actions||f.pay)&&!same(f,run.facts.find(h=>h.slot===f.slot)))));
    }
    function same(a,b){
      if(a===b)return true;
      if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
      return Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));
    }
    const validRun = run => record(run) && run.scenario==='life' && C.origins.some(origin=>origin.id===run.birth)
      && (run.pageTrace===undefined || record(run.pageTrace)&&run.pageTrace.schema===1&&entries(run.pageTrace.entries)
        && (run.pageTrace.menu===undefined || Array.isArray(run.pageTrace.menu) && run.pageTrace.menu.includes(run.eventId)
          && run.pageTrace.menu.every(id=>C.cards.some(c=>c.id===id&&c.slot===run.slot)&&run.pageTrace.entries.some(e=>e.id===id&&e.eligible))))
      && slot(run.slot)
      && ['event','result','memoir'].includes(run.stage) && C.cards.some(card=>card.id===run.eventId&&card.slot===run.slot)
      && record(run.stats) && Object.keys(C.labels).every(key=>Number.isFinite(run.stats[key]))
      && ['items','people','draft','experience','highlights','project','threads'].every(key=>record(run[key]))
      && ['facts','forks','careerLog','wishLog'].every(key=>Array.isArray(run[key]))
      && Object.keys(run.items).every(id=>Object.hasOwn(C.items,id))
      && Object.keys(run.people).every(id=>Object.hasOwn(C.people,id))
      && Object.keys(run.experience).every(id=>Object.hasOwn(C.experience,id))
      && Array.isArray(run.draft.support) && run.draft.support.every(id=>Object.hasOwn(C.supports,id))
      && Array.isArray(run.draft.memory) && Array.isArray(run.draft.order)
      && (run.draft.routeDeclined===undefined||Array.isArray(run.draft.routeDeclined)&&run.draft.routeDeclined.every(k=>run.draft.routeSeen?.includes(k)))
      && (run.draft.routeSeen===undefined||Array.isArray(run.draft.routeSeen)&&run.draft.routeSeen.every(k=>typeof k==='string'))
      && (run.draft.routeSteps===undefined||Array.isArray(run.draft.routeSteps)&&run.draft.routeSteps.every(s=>typeof s==='string'))
      && run.facts.every(fact) && LifeReviewed.validHistory(run) && routeHistory(run) && activity(run.activity)
      && (run.stage!=='event' || run.draft.interaction===undefined || !!globalThis.LifeInteraction.preview(run))
      && (run.stage!=='result' || record(run.result)&&record(run.result.deltas)&&fact(run.result.fact))
      && Object.values(run.items).every(item=>record(item)&&slot(item.first)&&Array.isArray(item.trail)&&item.trail.every(entry=>slot(entry.slot)))
      && (run.stage!=='memoir'||record(run.memo))
      && (!run.memo || ['timeline','career','highlights','forks','token'].every(key=>Array.isArray(run.memo[key]))
        && run.memo.timeline.every(fact) && run.memo.token.every(id=>Object.hasOwn(C.items,id))
        && record(run.memo.related) && typeof run.memo.line==='string');
    const playtest = incoming?.playtest;
    const validPlaytest = playtest===undefined || record(playtest)&&record(playtest.counts)&&Number.isFinite(playtest.turnMs)
      && Object.values(playtest.counts).every(Number.isFinite);
    return record(incoming)&&validPlaytest&&isCurrent(incoming)&&typeof incoming.revision==='string'
      && Number.isInteger(incoming.points)&&incoming.points>=0&&Array.isArray(incoming.talents)&&incoming.talents.every(id=>Object.hasOwn(C.talents,id))
      && record(incoming.trees)&&record(incoming.branches)&&Object.entries(incoming.trees).every(([name,tree])=>id(name)&&record(tree)&&C.origins.some(origin=>origin.id===tree.birth))
      && Object.entries(incoming.branches).every(([name,branch])=>id(name)&&record(branch)&&id(branch.tree)&&Object.hasOwn(incoming.trees,branch.tree)&&validRun(branch.run))
      && (incoming.active===null || Object.hasOwn(incoming.branches,incoming.active));
  }

  return {key,fresh,decode,read,write,validateImport};
})();
