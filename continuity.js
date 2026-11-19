'use strict';

// The pending page belongs to this turn. On commit it moves into the fact.
globalThis.LifeContinuity = (() => {
  const ref=f=>({branch:f.branch??null,slot:f.slot,eventId:f.eventId,choiceId:f.choiceId});
  function sources(run,card){
    const rule=card.rule||card.job;
    const slots=new Set();
    const add=n=>{if(Number.isInteger(n))slots.add(n);};
    if(rule==='recover'){add(run.low?.slot);add(run.facts.findLast(f=>f.choiceId==='active-recovery-wait')?.slot);}
    if(rule==='school'&&run.slot===15)add(14);
    if(rule==='chance')add(run.people.friend?.last);
    if(['esport','esport-job','esport-echo'].includes(rule))add(run.people.coach?.last);
    if(rule==='early-next')add(43);
    if(rule?.includes('indie')||['former-player','late-release'].includes(rule))add(run.project.startedAt);
    if(rule==='indie-history')add(run.items.prototype?.first);
    if(rule==='indie-echo')add(run.highlights.published?.slot);
    for(const f of run.facts){
      if(f.trace?.commands?.includes('thread:'+rule))add(f.slot);
      if(f.careerBefore!==f.careerAfter){
        if(card.rule && Object.hasOwn(LifeContent.jobs,card.rule) && f.careerAfter===card.rule)add(f.slot);
        if(card.job && (f.careerAfter===card.job || card.job==='delivery'&&f.careerAfter==='dispatcher'))add(f.slot);
        if(['delivery-routine','esport-job','esport-echo','former-player'].includes(rule) &&
            (rule==='delivery-routine'?f.careerAfter==='delivery':f.careerAfter==='player'||f.careerBefore==='player'))add(f.slot);
      }
    }
    return run.facts.filter(f=>slots.has(f.slot)).map(ref);
  }
  function plan(run,rows,selected){
    return {schema:1,slot:run.slot,selected,entries:rows.map(({card,eligible})=>({
      id:card.id,scope:'event',rule:card.rule??card.job??null,eligible,selected:card.id===selected,
      status:!eligible?'ineligible':card.id===selected?'eligible':'deferred',
      window:card.opportunityWindow?.slice()??[run.slot,run.slot],ages:[LifeContent.ages[run.slot-1],LifeContent.ages[(card.opportunityWindow?.[1]??run.slot)-1]],seen:false,sources:sources(run,card)
    }))};
  }
  function current(run){
    if(run.stage!=='event')return null;
    if(run.pageTrace?.slot!==run.slot||run.pageTrace.selected!==run.eventId){
      run.pageTrace=plan(run,[{card:{id:run.eventId},eligible:true}],run.eventId);
      run.pageTrace.legacyCandidatesUnknown=true;
    }
    return run.pageTrace;
  }
  function offers(run,event){
    const page=current(run), echo=event.giftEcho;
    if(!page)return;
    for(const e of page.entries)if(e.rule==='gift-history' && e.id!==echo?.choiceId)close(e,run.slot,false);
    const provenance=page.entries.find(e=>e.id===event.id)?.sources??[];
    const actions=globalThis.LifeEngine?.followups(run)??[];
    for(const e of page.entries){
      if((e.rule==='followup'||e.continuationOf?.id==='indie-memory') && !actions.some(a=>a.id===e.id))close(e,run.slot,false);
    }
    for(const a of actions){
      if(a.prior){resumeWindow(run,a.prior,a.id,()=>true);continue;}
      if(!page.entries.some(e=>e.id===a.id))page.entries.push({id:a.id,scope:'action',rule:'followup',eligible:true,selected:true,
        status:'eligible',window:[run.slot,run.slot],seen:false,sources:[ref(a.source)]});
    }
    for(const choice of event.choices){
      const rule=choice.commands.find(c=>c.startsWith('priority:')||c.startsWith('release:')||c.startsWith('final:'));
      if(!rule)continue;
      const existing=page.entries.find(e=>e.id===choice.id);
      if(existing){existing.selected=true;continue;}
      page.entries.push({id:choice.id,host:event.id,scope:'action',rule,eligible:true,selected:true,status:'eligible',
        window:[run.slot,run.slot],seen:false,sources:provenance});
    }
    if(!echo)return;
    if(page.entries.some(e=>e.id===echo.choiceId))return;
    page.entries.push({id:echo.choiceId,scope:'action',rule:'gift-history',eligible:true,selected:true,
      status:'eligible',window:[run.slot,run.slot],seen:false,sources:run.facts.filter(f=>f.slot===echo.sourceSlot).map(ref)});
  }
  function seen(run,id){
    const page=current(run);
    const entry=page?.entries.find(e=>e.id===id && (e.selected||page.menu?.includes(id)) && e.eligible);
    if(!entry||entry.seen||!['deferred','eligible'].includes(entry.status))return false;
    entry.seen=true;entry.status='offered';return true;
  }
  function seeClue(run,id){
    const e=current(run)?.entries.find(e=>e.id===id && e.rule==='gift-history' && e.eligible);
    if(!e || e.clueSeen)return false;
    e.clueSeen=true;return true;
  }
  function close(entry,slot,legal=true){
    if(entry.windowEnded||['resolved','declined','expired','invalidated'].includes(entry.status))return;
    if(!legal){entry.previouslyEligible=entry.eligible;entry.eligible=false;entry.status='invalidated';entry.reason='qualification-changed';}
    else if(slot>entry.window[1]){
      entry.windowEnded=true;
      if(entry.seen)entry.status='expired';
      else entry.reason='window-ended-unseen';
    }
  }
  function opportunity(run,id){
    const entry=run.pageTrace?.entries.find(e=>e.id===id);
    if(!entry?.seen || entry.status!=='offered')return entry;
    const main=run.draft.main??(run.draft.interaction && globalThis.LifeInteraction?.preview(run)?.choiceId);
    if(run.draft.followup===id && globalThis.LifeEngine.followups(run).some(a=>a.id===id))return {...entry,status:'accepted'};
    if(main===id || main && run.eventId===id){
      const choice=globalThis.LifeEngine.currentCard(run).choices.find(c=>c.id===main);
      if(choice && !(id===run.eventId && choice.commands.some(c=>['final:leave','release:stop'].includes(c))))
        return {...entry,status:'accepted'};
    }
    return entry;
  }
  function settle(run,event,choice,fact,commands,before){
    const page=current(run);
    fact.branch=run.branchId??null;
    fact.trace={schema:1,commands:[...commands],fundsDelta:run.stats.money-before.money,
      sources:run.facts.filter(f=>fact.sourceSlots.includes(f.slot)).map(ref),
      items:Object.fromEntries(fact.items.map(id=>[id,run.items[id]?.state??null])),
      candidates:page.entries,legacyCandidatesUnknown:!!page.legacyCandidatesUnknown};
    for(const e of page.entries){
      if(!e.eligible||e.status==='invalidated')continue;
      if(!e.selected){
        if(page.menu?.includes(e.id) && e.seen){
          e.status=e.window[1]>run.slot?'deferred':'expired';
          e.reason='booked-other-appointment';e.result=ref(fact);
        }else close(e,run.slot+1);
        continue;
      }
      if(e.id===event.id||e.id===choice.id||e.id===fact.followup?.id){
        const optedOut=e.id===event.id && (commands.includes('final:leave')||commands.includes('release:stop'));
        e.status=optedOut&&e.seen?'declined':'resolved';
        e.accepted=!optedOut;e.result=ref(fact);
        if(optedOut)e.reason='explicit-opt-out';
        if(e.id===event.id && commands.some(c=>c.startsWith('release:')))
          e.outcome=fact.highlights.includes('published')?'published':optedOut?'kept-in-team':'unpublished';
        if(e.id===event.id && commands.some(c=>c.startsWith('final:')))
          e.outcome=fact.highlights.includes('world')?'won':commands.includes('final:play')?'played-lost':optedOut?'retired':'assisted';
      }else if(e.seen && (e.rule==='followup'||e.continuationOf)){e.status='expired';e.reason='seen-not-taken';}
      else if(e.seen && !e.rule?.startsWith('priority:')){e.status='declined';e.reason='chose-alternative';}
      else close(e,run.slot+1);
    }
    delete run.pageTrace;
  }
  function evidence(run,kind){
    return run.facts.filter(f=>{
      // P3 can ask for an actual shift, visit or checked sample without
      // interpreting a job title or an interest as the corresponding achievement.
      if(kind==='paid-stall-shift')return f.eventId==='life-18' && f.choiceId==='life-18-1';
      if(kind==='rental-renewal')return f.eventId==='life-31' && f.choiceId==='life-31-0';
      if(kind==='housing-visit')return f.eventId==='life-31' && f.choiceId==='life-31-1';
      if(kind==='admission')return f.slot===14 && f.trace?.commands.some(c=>c.startsWith('admit:'));
      if(kind==='work-sample')return ['cost-center','missing-socket','river-detour'].includes(f.inspected);
      if(kind==='handover')return f.followup?.id?.startsWith('handover-');
      if(kind==='observation')return !!f.interaction?.observed?.length;
      if(kind==='purchase')return f.interaction?.purchased===true || f.interaction?.sceneId==='school-shop' && (f.interaction.balances.blocks>0||f.interaction.balances.ice>0) || f.giftEcho?.spent>0;
      if(kind==='sports-practice')return f.giftEcho?.status==='taken'||['again-life-6-1','again-life-6-yoyo','again-life-6-shuttlecocks','again-school-yoyo-buy','again-school-yoyo-keep'].includes(f.followup?.id);
      if(kind==='job-entry')return f.careerAfter && f.careerAfter!==f.careerBefore;
      if(kind==='sideline-assist')return f.trace?.commands.includes('final:assist');
      if(kind==='project-work')return f.trace?.commands.some(c=>c.startsWith('project:')&&c!=='project:wait');
      if(kind==='teamwork')return f.trace?.commands.includes('exp:teamwork');
      return f.trace?.commands?.includes(kind);
    }).map(ref);
  }
  function thread(run,id){
    const steps=[];
    for(const f of run.facts){
      const cmds=f.trace?.commands??[];
      const add=state=>steps.push({state,source:ref(f)});
      const matches=rule=>rule===id || id==='esport'&&['esport-job','esport-echo'].includes(rule) ||
        id==='indie'&&['indie-active','indie-history','indie-echo','late-release','former-player'].includes(rule);
      for(const e of f.trace?.candidates??[])if(matches(e.rule)){
        if(e.seen)add('encountered');
        if(['expired','invalidated','declined'].includes(e.status))add(e.status);
      }
      if(cmds.includes('thread:'+id) || id==='indie'&&cmds.some(c=>c.startsWith('project:')&&c!=='project:wait')){
        const prior=steps.findLast(s=>['seeded','continued','paused','resumed'].includes(s.state));
        add(!prior?'seeded':prior.state==='paused'?'resumed':'continued');
      }
      if(cmds.includes('pause:'+id)||id==='indie'&&cmds.includes('release:stop'))add('paused');
      const job=id==='esport'?'player':id;
      if(f.careerAfter!==f.careerBefore){
        if(f.careerBefore===job)add('redirected');
        if(f.careerAfter===job)add('entered');
      }
      if(f.highlights.includes(({esport:'world',indie:'published'})[id]??id))add('achieved');
    }
    if(steps.length && run.memo)steps.push({state:'closed',source:ref(run.facts.at(-1))});
    return steps;
  }
  function seeDetail(run,slot){
    const page=current(run);
    if(!page||!LifeResponses.detailsAt(run).some(d=>d.sourceSlot===slot))return false;
    page.detailsSeen??=[];
    if(page.detailsSeen.includes(slot))return false;
    page.detailsSeen.push(slot);return true;
  }
  function seeResult(run,index){
    const fact=run.result?.fact;
    if(run.stage!=='result'||!fact?.echoes[index])return false;
    const key=run.slot+'/'+index;
    run.seenResults??={};
    if(run.seenResults[key])return false;
    run.seenResults[key]=true;
    return true;
  }
  function legacyEcho(run,f){
    if(!f.giftEcho || f.trace?.candidates?.some(e=>e.rule==='gift-history'))return [];
    return [{sources:run.facts.filter(src=>src.slot===f.giftEcho.sourceSlot).map(ref),
      read:true,seen:null,participated:f.giftEcho.status==='taken',slot:f.slot,eventId:f.eventId,
      status:f.giftEcho.status==='taken'?'resolved':'unknown',result:f.giftEcho.status==='taken'?ref(f):null}];
  }
  function echoes(run){
    return run.facts.flatMap(f=>(f.trace?.candidates??[]).filter(e=>e.rule==='gift-history'||e.rule==='followup'||e.continuationOf).map(e=>({
      slot:f.slot,eventId:f.eventId,id:e.id,reason:e.reason??null,sources:e.sources,read:true,seen:e.seen||!!e.clueSeen,actionSeen:e.seen,clueSeen:!!e.clueSeen,participated:e.status==='resolved',status:e.status,result:e.result??null
    })).concat(legacyEcho(run,f),f.echoes.map((echo,index)=>({
      sources:run.facts.filter(source=>source.slot===(echo.sourceSlot??run.items[echo.id]?.first)).map(ref),
      read:true,seen:echo.seenOnPage||run.seenResults?.[f.slot+'/'+index]||(f.trace?false:null),participated:false,result:null,slot:f.slot,eventId:f.eventId,id:echo.id??echo.person
    }))));
  }
  function windows(run,id){
    return [...run.facts.flatMap(f=>f.trace?.candidates??[]),...(run.pageTrace?.entries??[])].filter(e=>e.id===id);
  }
  // Only declared future windows may be offered again; a caller rechecks live eligibility.
  function pending(run,slot,qualifies){
    const used=run.facts.flatMap(f=>f.trace?.candidates??[]).flatMap(e=>e.continuationOf??[]);
    return run.facts.flatMap(f=>(f.trace?.candidates??[]).filter(e=>
      e.status==='deferred' && !e.windowEnded && e.window[0]<=slot && slot<=e.window[1] &&
      !used.some(u=>u.id===e.id && u.slot===f.slot) && qualifies(e)
    ).map(entry=>({entry,origin:ref(f)})));
  }
  // A content adapter may attach a displaced opportunity to a real, legal choice.
  function resumeWindow(run,priorId,choiceId,qualifies){
    const page=current(run);
    if(!page || !globalThis.LifeEngine.currentCard(run).choices.some(c=>c.id===choiceId) &&
        !globalThis.LifeEngine.followups(run).some(a=>a.id===choiceId && a.prior===priorId))return false;
    const prior=pending(run,run.slot,e=>e.id===priorId && qualifies(e))[0];
    if(!prior || page.entries.some(e=>e.id===choiceId || e.continuationOf?.id===priorId))return false;
    page.entries.push({id:choiceId,scope:'action',eligible:true,selected:true,status:'eligible',seen:false,
      rule:prior.entry.rule,window:[run.slot,run.slot],sources:[...prior.entry.sources,prior.origin],
      continuationOf:{id:priorId,slot:prior.origin.slot}});
    return true;
  }
  function growth(run,kind){
    const history=evidence(run,kind);
    return {history,repeated:new Set(history.map(f=>f.slot)).size>=2};
  }
  return {pending,resumeWindow,growth,plan,current,offers,seen,seeClue,seeResult,opportunity,windows,close,settle,seeDetail,evidence,thread,echoes};
})();
