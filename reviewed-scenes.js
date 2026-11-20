'use strict';

globalThis.LifeReviewed = (() => {
  if (!globalThis.LifeApprovedText && typeof require === 'function') require('./approved-text.js');
  const text = globalThis.LifeApprovedText;
  // Local school calendar. Separate dates within one host slot never consume another life turn.
  const calendar = {
    'D-H01':[11,'2024-11-01T17:00'], 'D-H01@practice':[11,'2024-11-08T17:00'],
    'D-H01@review':[11,'2024-11-22T17:00'],
    E16:[14,'2026-07-03T09:00'], E17:[14,'2026-07-03T10:00'], E18:[14,'2026-07-03T11:00'],
    E19:[14,'2026-07-04T09:00'], E20:[14,'2026-07-04T09:00'], E21:[22,'2030-06-14T09:00'],
    'E-A02':[29,'2035-04-14T19:00'], 'E-A03':[30,'2035-09-07T19:00'],
    'E-A03@practice':[30,'2035-09-14T19:00'], 'E-A03@finish':[30,'2035-09-28T19:00'],
    'E-A04':[31,'2036-04-12T14:00'],
    'Q-U01':[15,'2026-09-01T09:00'],
    'O-A01':[24,'2032-05-14T18:00'], 'O-A02':[25,'2033-04-15T18:00'],
    'O-A02@session2':[25,'2033-04-22T18:00'], 'O-A03':[26,'2033-06-18T10:00'], 'E-A01':[27,'2034-04-15T19:00'],
    'P-S01':[5,'2021-08-30T08:00'], 'P-E01':[5,'2021-08-31T10:00'], 'P-S02':[5,'2021-09-02T16:00'],
    O01:[6,'2022-02-28T14:00'], O02:[6,'2022-02-28T14:15'], O03:[6,'2022-03-18T15:00'],
    O04:[6,'2022-03-18T16:00'], O05:[6,'2022-03-25T16:00'], O06:[6,'2022-04-08T16:00'],
    O07:[6,'2022-04-15T16:00'], O08:[6,'2022-05-06T15:00'],
    Q01:[7,'2022-09-05T15:00'], Q02:[7,'2022-09-06T10:00'], Q03:[7,'2022-09-06T16:00'], Q04:[7,'2022-09-07T15:00'],
    E01:[11,'2024-09-06T16:00'], E02:[11,'2024-09-07T10:00'], E03:[11,'2024-09-07T10:10'],
    E04:[11,'2024-09-07T11:00'], E05:[11,'2024-09-14T10:00'], E06:[11,'2024-09-21T10:00'],
    E07:[11,'2024-09-21T11:00'], E08:[11,'2024-09-21T12:00'], E09:[11,'2024-10-03T16:00'],
    E10:[11,'2024-10-04T16:00'], E11:[11,'2024-10-05T10:00'], E12:[11,'2024-10-12T10:00'],
    E13:[11,'2024-10-12T10:20'], E14:[11,'2024-10-12T11:00'], E15:[11,'2024-10-16T16:00']
  };
  Object.assign(calendar,{
    'E19@assessment':[14,'2026-07-05T09:00'],E22:[14,'2026-07-06T09:00'],
    'E22@negotiate':[14,'2026-07-06T10:00'],E23:[14,'2026-07-13T09:00'],
    'E23@season':[14,'2026-08-24T09:00']
  });
  calendar['D-H01@arrival']=[11,'2024-11-02T17:00'];
  calendar['D-H01@practice']=[11,'2024-11-09T17:00'];
  calendar['C-DH01-2']=[11,'2024-11-22T17:00'];
  calendar['C-DH01-2@partial']=calendar['C-DH01-2'];
  calendar['E10@overlap']=calendar.E10;
  const libraryThursday='2024-10-03T16:30';
  const libraryLater=run=>run.seed%2===0;
  const history = run => run.facts.flatMap(f=>f.reviewed??[]);
  const host = run => run.facts.at(-1);
  const schoolTeam = ['lin','zhou','jie','tang'];
  const byId = (run,id)=>history(run).find(r=>(r.node??r.eventId)===id);

  const trialRound=id=>['E16','E17','E18','E19','E20','E21'].includes(id.split('@')[0]) || ['E22','E23'].includes(id.split('@')[0]);
  function visited(run,id){
    const pool=trialRound(id)?host(run)?.reviewed??[]:history(run);
    return pool.some(r=>(r.node??r.eventId)===id);
  }
  function dateOf(run,id){
    if(id==='P-S02' && libraryLater(run))return libraryThursday;
    if(!trialRound(id)||host(run).trialOffer?.eventId!=='E21')return calendar[id][1];
    if(id==='E21')return host(run).trialOffer.starts;
    const delta=Date.parse(calendar[id][1]+'Z')-Date.parse(calendar.E16[1]+'Z');
    return new Date(Date.parse(host(run).trialOffer.starts+'Z')+delta).toISOString().slice(0,16);
  }

  function first(run) {
    if (run.reviewedVersion!==1 || run.finalType || run.stage!=='result') return;
    const f=host(run);
    if(f?.slot!==run.slot)return;
    if(f.trialOffer)return f.trialOffer.eventId;
    if(f.communityActivity)return f.communityActivity.eventId;
    if(f.slot===15 && run.facts.some(x=>x.slot===14 && x.trace?.commands.includes('admit:steady')) &&
      run.admission?.name==='备选院校录取' && LifeEngine.held(run.items.letter))return 'Q-U01';
    if(f.eventId==='life-5')return 'P-S01';
    if(f.eventId==='life-6' && run.stats.health>0)return 'O01';
    if(f.eventId==='life-7' && byId(run,'P-S01'))return 'Q01';
    if(f.slot===11 && f.schoolMatch && byId(run,'P-E01') && LifeEngine.held(run.items.console))return 'E01';
    if(f.slot===11 && libraryLater(run) && byId(run,'P-S01'))return 'P-S02';
  }

  const trialWindows={
    14:{eventId:'E16',season:'2026',starts:calendar.E16[1],club:'club-a'},
    22:{eventId:'E21',season:'2030',starts:calendar.E21[1],club:'club-b'},
    28:{eventId:'E21',season:'2034',starts:'2034-08-12T09:00',club:'club-c'}
  };
  function communityPlayers(seed){
    return Array.from({length:9},(_,i)=>'community-'+(i+1)).filter(id=>
      LifeEngine.hash(seed,id,calendar['E-A01'][1],'signup')%16!==0);
  }
  function recordOpportunity(run,f) {
    if(run.reviewedVersion!==1)return;
    const trained=byId(run,'D-H01@review');
    const trials=history(run).filter(r=>r.attempt);
    const lastTrial=trials.at(-1);
    const nextWindow=trialWindows[run.slot];
    const wantsRetry=lastTrial && history(run).some(r=>r.opportunityId===lastTrial.opportunityId &&
      r.eventId==='E20' && r.choiceId==='B');
    const quit=history(run).some(r=>r.terminal==='QUIT');
    if(nextWindow && !quit && trained && !f.actions && !f.dayExtra &&
       (!run.career || f.pay?.mode==='part') && LifeEngine.held(run.items.console) &&
       (nextWindow.eventId==='E16'?trials.length===0:wantsRetry && trials.length<3)){
      f.trialOffer={...nextWindow,source:trained.approvedTextId};
    }
    const adult={24:'O-A01',25:'O-A02',26:'O-A03',27:'E-A01',29:'E-A02',30:'E-A03',31:'E-A04'}[run.slot];
    if(adult && run.career && run.low?.status!=='active' && (f.pay?.workBlocks??0)<2 && !f.actions?.length && !f.dayExtra){
      const active=run.stats.health>=60 && !byId(run,'O02');
      const trained=!!byId(run,'O-A02@session2')?.practiceDate;
      const introductory=byId(run,'O-A01')?.choiceId==='A';
      const gamer=LifeEngine.held(run.items.console) && !byId(run,'E02');
      const gameReady=gamer && (adult==='E-A01' ||
        adult==='E-A02' && byId(run,'E-A01')?.outcome==='played' ||
        adult==='E-A03' && byId(run,'E-A02')?.played ||
        adult==='E-A04' && byId(run,'E-A03@finish')?.attended);
      if(adult==='O-A01' && active || adult==='O-A02' && active && introductory ||
        adult==='O-A03' && active && trained || gameReady){
        const esports=adult.startsWith('E');
        f.communityActivity={eventId:adult,starts:calendar[adult][1],sourceSlot:run.slot,
          venue:esports?'community-game-room':'public-track',
          ...(esports?{players:adult==='E-A01'?communityPlayers(run.seed):byId(run,'E-A01').players,capacity:10}:{supervised:true})};
        if(adult==='E-A04'){
          f.communityActivity.team=byId(run,'E-A01').players.slice(0,4);
          f.communityActivity.opponents=Array.from({length:5},(_,i)=>'open-cup-team-'+(i+1));
        }
      }
    }
    if(f.choiceId==='life-11-0' && LifeEngine.held(run.items.console) && byId(run,'P-E01')){
      // The class runs its own finite practice calendar. Only consecutive
      // booked meetings qualify for the second-session and later review text.
      const sessions=['D-H01@arrival','D-H01@practice','D-H01@review'];
      const free=[];
      for(const node of sessions){
        const starts=calendar[node][1];
        if(schoolTeam.some(person=>LifeEngine.hash(run.seed,person,starts,'school-calendar')%12===0))break;
        free.push(starts);
      }
      f.trainingWindow={sessions:free};
      f.schoolMatch={roster:[...schoolTeam],opponent:'adjacent-class',opponentCount:5,
        starts:calendar.E02[1],deviceSource:run.items.console.first};
    }
  }

  const next = {
    'E-A03':['E-A03@practice','E-A03@practice'], 'E-A03@practice':['E-A03@finish'],
    'O-A02':['O-A02@session2','O-A02@session2'],
    'P-S01':['P-E01','P-E01','P-E01'], 'P-E01':['P-S02','P-S02','P-S02'],
    O01:['O02','O02'], O02:['O03','O03'], O03:['O04','O04','O04'], O04:['O05'],
    O05:['O06','O06','O06'], O06:['O07'], O07:['O08','O08','O08'],
    Q01:['Q02','Q02'], Q02:['Q03','Q03'], Q03:['Q04','Q04'],
    E01:['E02'], E02:['E03','E03','E03'], E03:['E04','E04','E04'], E04:['E05'],
    E05:['E06','E06','E06'], E06:['E07','E07','E07'], E07:['E08','E08','E08'],
    E08:['E09','E09','E09'], E09:['E10','E10'], E10:['E11','E12'], E11:['E12','E12','E12'],
    E12:['E13','E13','E13'], E13:['E14','E14','E14'], E14:['E15'], E15:['D-H01'], 'D-H01':['D-H01@practice','D-H01@practice'],
    'D-H01@practice':['D-H01@review','D-H01@review','D-H01@review'], E16:['E17'],
    E21:['E17'], E17:['E18','E18','E18']
  };
  function successor(receipt,run) {
    if(receipt.eventId==='D-H01' && receipt.variantId==='plan'){
      if(receipt.choiceId==='C')return;
      return host(run).trainingWindow.sessions.length?'D-H01@arrival':'C-DH01-2';
    }
    if(receipt.node==='D-H01@arrival')return host(run).trainingWindow.sessions.length>=2?'D-H01@practice':undefined;
    if(receipt.node==='D-H01@practice')return host(run).trainingWindow.sessions.length>=3?'D-H01@review':'C-DH01-2@partial';
    if(receipt.eventId==='P-E01' && libraryLater(run))return;
    if(receipt.eventId==='E09' && receipt.choiceId!=='C' && libraryLater(run))return 'P-S02';
    if(receipt.eventId==='P-S02' && host(run).slot===11 && byId(run,'E09') && byId(run,'E09').choiceId!=='C')
      return receipt.appointment===calendar.E11[1]?'E10@overlap':'E10';
    if(receipt.node==='E10@overlap')return 'E12';
    if(receipt.node==='E19@assessment')return receipt.outcome==='pass'?'E22':undefined;
    if(receipt.eventId==='E19' && receipt.choiceId!=='C')return 'E19@assessment';
    if(receipt.eventId==='E22' && !receipt.node)return receipt.choiceId==='A'?'E23':receipt.choiceId==='B'?'E22@negotiate':undefined;
    if(receipt.node==='E22@negotiate')return 'E23';
    if(receipt.eventId==='E23' && !receipt.node)return 'E23@season';
    if(receipt.eventId==='E18')return receipt.outcome==='pass'?'E19':'E20';
    return next[receipt.node??receipt.eventId]?.[{A:0,B:1,C:2,read:0}[receipt.choiceId]];
  }

  function view(run) {
    if (!run.readingReviewed || run.stage!=='result')return;
    const {eventId,feedback}=run.readingReviewed, scene=text[eventId];
    if(!scene)return;
    const variant=eventId==='E14'?byId(run,'E13')?.outcome:
      eventId==='E11' && byId(run,'E03')?.outcome==='won'?'no-loss':scene.variantId;
    const choices={...scene.choices};
    if(variant==='no-loss')choices.C={label:scene.alternateC,reply:[]};
    const receipt=feedback?host(run).reviewed?.at(-1):null;
    return {opportunityId:trialRound(eventId)?host(run).trialOffer.club+'/'+host(run).trialOffer.season:null,
      date:dateOf(run,eventId),eventId:eventId.split('@')[0],node:eventId,variantId:variant,title:scene.title,choices,feedback,
      body:feedback?[...(choices[receipt.choiceId]?.reply??[]),...(scene.endings?.[receipt.outcome]??[]),...scene.closing]:
        scene.variants?.[variant]??scene.body};
  }

  // Resolve a local team engagement against the same five opponents for
  // every alternative. Players can reconverge, warn teammates, or hold a lane.
  function engagement(run,id,choice){
    const trial=id==='E18';
    const roster=trial?['trial-1','trial-2','trial-3','trial-4']:host(run).schoolMatch.roster;
    const opportunity=trial?host(run).trialOffer.club+'/'+host(run).trialOffer.season:calendar[id][1];
    const start=id==='E03'?byId(run,'E02').choiceId:id==='E13'?byId(run,'E12').choiceId:
      host(run).reviewed.find(r=>r.eventId==='E17').choiceId;
    const action=(id==='E03'?{A:'report',B:'advance',C:'rally'}:
      id==='E13'?{A:'hold',B:'rotate',C:'rally'}:{A:'advance',B:'rally',C:'report'})[choice];
    const clock=(name)=>LifeEngine.hash(run.seed,opportunity,id,name)%5;
    const enemy=Array.from({length:5},(_,i)=>({id:'opponent-'+i,arrival:2+clock('opponent-'+i)}));
    const deadline=enemy.map(p=>p.arrival).sort((a,b)=>a-b)[2];
    const observed=start==='A';
    const coordinated=start==='B'&&!trial || start==='C'&&trial || id==='E13'&&byId(run,'E08').outcome==='improved';
    const allies=roster.map(name=>{
      const travel=1+clock(name);
      const signal=action==='report'&&observed || action==='rally'&&coordinated?0:1;
      const spread=action==='advance'?2:action==='rotate'&&!observed?1:0;
      return {id:name,arrival:travel+signal+spread};
    });
    allies.push({id:'player',arrival:action==='hold'?0:action==='report'?2:1});
    const arrived=list=>list.filter(p=>p.arrival<=deadline).length;
    return {opportunity,action,deadline,allies,opponents:enemy,won:arrived(allies)>arrived(enemy)};
  }

  function receiptFor(run,scene,choiceId) {
    const {eventId,variantId}=scene;
    const receipt={eventId,variantId,choiceId,date:dateOf(run,scene.node),
      approvedTextId:[eventId,variantId,choiceId].join('/'),sourceHash:text[scene.node].fingerprint,textHash:text[scene.node].textSha256};
    if(trialRound(eventId)){
      const offer=host(run).trialOffer;
      receipt.opportunityId=offer.club+'/'+offer.season;
    }
    if(scene.node!==eventId)receipt.node=scene.node;
    if(scene.node==='D-H01@arrival')receipt.attended=receipt.date;
    if(eventId==='D-H01' && scene.variantId==='practice')receipt.previousDate=byId(run,'D-H01@arrival').date;
    if(eventId==='D-H01' && scene.variantId==='review')receipt.previousDate=byId(run,'D-H01@practice').date;
    if(['E16','E21'].includes(eventId) && choiceId==='A'){
      const offer=host(run).trialOffer;
      receipt.attempt={dreamId:'E',index:history(run).filter(r=>r.attempt?.dreamId==='E').length,opportunityId:offer.club+'/'+offer.season,
        started:receipt.date,qualificationSource:offer.source,environment:'pro-trial-v1',
        fate:fate(run,'E',receipt.opportunityId,'pro-trial-v1')};
    }
    if(['E03','E13','E18'].includes(eventId)){
      receipt.engagement=engagement(run,eventId,choiceId);
      receipt.outcome=eventId==='E18'?(receipt.engagement.won?'pass':'fail'):(receipt.engagement.won?'won':'lost');
    }
    if(eventId==='E16' && choiceId==='C' || ['E19','E20'].includes(eventId) && choiceId==='C' ||
        eventId==='E21' && choiceId==='B')receipt.terminal='QUIT';
    if(scene.node==='E19@assessment'){
      const rounds=['report','rally','hold'].map((action,i)=>({
        action,completed:host(run).reviewed.some(r=>r.eventId==='E18'&&r.outcome==='pass'),
        responsive:LifeEngine.hash(run.seed,receipt.opportunityId,'assessment',i)%5>0}));
      receipt.rounds=rounds;
      receipt.outcome=rounds.every(r=>r.completed)&&rounds.filter(r=>r.responsive).length>=2?'pass':'fail';
      if(receipt.outcome==='fail')receipt.closed=true;
    }
    if(eventId==='E22' && choiceId==='C')receipt.terminal='QUIT';
    if(eventId==='E22' && choiceId==='A' || scene.node==='E22@negotiate')
      receipt.contract={signed:true,source:host(run).reviewed.find(r=>r.node==='E19@assessment').approvedTextId,
        starts:dateOf(run,'E23'),season:host(run).trialOffer.season,role:'trainee'};
    if(scene.node==='E23@season'){
      receipt.trainingDates=[dateOf(run,'E23'),'2026-07-20T09:00','2026-08-03T09:00'];
      const year=receipt.date.slice(0,4);
      receipt.trainingDates=receipt.trainingDates.map(date=>year+date.slice(4));
      receipt.roster={status:'UNVERIFIED'};
      receipt.blocked='LEAGUE_REGISTRATION_NOT_IMPLEMENTED';
      receipt.closed=true;
    }
    if(eventId==='P-S01')receipt.met=['lin','zhou'];
    if(eventId==='P-E01')receipt.met=['jie'];
    if(eventId==='P-S02' && choiceId!=='C')receipt.appointment=(libraryLater(run)?'2024-10-05':'2021-09-04')+(choiceId==='A'?'T10:00':'T15:00');
    if(scene.node==='E10@overlap'){
      receipt.keptAppointment=byId(run,'P-S02').appointment;
      if(choiceId==='B')receipt.rescheduled=false;
    }
    if(eventId==='O-A02' && choiceId!=='C')receipt.practiceDate=receipt.date;
    if(eventId==='O-A03' && choiceId!=='C')receipt.blocked='NO_HIGHER_MEET_QUALIFICATION';
    if(eventId==='E-A01' && choiceId==='A'){
      const {players,capacity}=host(run).communityActivity;
      receipt.outcome=players.length+1===capacity?'played':'cancelled-short-roster';
      if(receipt.outcome==='played')receipt.players=[...players];
    }
    if(eventId==='E-A02' && choiceId!=='C')receipt.played=true;
    if(scene.node==='E-A03@practice'||scene.node==='E-A03@finish')receipt.attended=receipt.date;
    if(eventId==='E-A04' && choiceId!=='C'){
      receipt.match={played:true,teammates:host(run).communityActivity.team,opponents:host(run).communityActivity.opponents};
      receipt.blocked='NO_VERIFIED_ADULT_PRO_TRIAL';
    }
    if(eventId==='Q-U01')receipt.enrollment={admissionSlot:14,school:'备选院校录取'};
    if(eventId==='E08')receipt.outcome=byId(run,'E06').choiceId==='A'&&choiceId==='A'||
      byId(run,'E07').choiceId==='B'?'improved':'mixed';
    if(eventId==='O08')receipt.blocked='COUNTY_SELECTION_RESULT_UNAVAILABLE';
    if(eventId==='Q04')receipt.blocked='NO_COMPARABLE_STAGE_EXAM_RESULT';
    return receipt;
  }

  function commit(run,key,opportunityId) {
    const scene=view(run);
    if(!scene || scene.feedback || typeof key!=='string' || scene.opportunityId!==(opportunityId??null))return false;
    const choiceId=key.split('/')[2];
    if(key!==[scene.eventId,scene.variantId,choiceId].join('/') || visited(run,scene.node) ||
       !(Object.hasOwn(scene.choices,choiceId)||choiceId==='read'&&!Object.keys(scene.choices).length))return false;
    const f=host(run), receipt=receiptFor(run,scene,choiceId);
    (f.reviewed??=[]).push(receipt);
    run.result.fact=f;
    run.readingReviewed.feedback=true;
    if(!view(run).body.length)step(run);
    return true;
  }

  function step(run) {
    const id=run.readingReviewed?.eventId;
    let target;
    if(id){
      if(!run.readingReviewed.feedback)return false;
      target=successor(host(run).reviewed.at(-1),run);
      delete run.readingReviewed;
    }else if(!host(run)?.reviewed)target=first(run);
    if(target && (calendar[target][0]===run.slot || target==='P-S02'&&run.slot===11&&libraryLater(run) || trialRound(target)&&host(run).trialOffer) && !visited(run,target)){
      run.readingReviewed={eventId:target,feedback:false};
      return true;
    }
    return false;
  }
  // Only completed actions map to milestones. Offers and promises have no weight.
  function historicalScore(run,dreamId) {
    const sources=new Map();
    const levels=[2,3,5,5];
    function credit(receipt,dim,index){
      const key=dim+index;
      if(!sources.has(key))sources.set(key,{dimension:dim,points:levels[index],source:receipt.approvedTextId,date:receipt.date});
    }
    for(const r of history(run)){
      const {eventId:id,choiceId:c}=r;
      if(dreamId==='E'){
        if(id==='E02'){credit(r,'A',0);credit(r,'B',0);}
        if(id==='E03')credit(r,'C',0);
        if(id==='E05')credit(r,'D',0);
        if(id==='E07' && c!=='C')credit(r,'B',1);
        if(id==='E08' && r.outcome==='improved')credit(r,'B',2);
        if(id==='E19' && r.variantId==='assessment' && r.outcome==='pass')credit(r,'A',2);
        if(id==='E23' && r.variantId==='season' && r.trainingDates?.length>=3)credit(r,'D',3);
        if(id==='E-A01' && r.outcome==='played')credit(r,'A',0);
        if(id==='E-A02' && r.played)credit(r,'B',0);
        if(id==='E-A04' && r.match?.played)credit(r,'A',1);
        if(id==='E11')credit(r,'D',1);
        if(id==='D-H01' && r.variantId==='review' && c!=='C')credit(r,'D',2);
        if(id==='E13'){credit(r,'A',1);if(r.outcome==='won')credit(r,'C',2);}
      }else if(dreamId==='O'){
        if(id==='O02' && c!=='C' || id==='O-A01' && c==='A')credit(r,'A',0);
        if(id==='O03' && c!=='C' || id==='O-A03' && c!=='C')credit(r,'C',0);
        if(id==='O05')credit(r,'D',0);
        if(id==='O07')credit(r,'A',1);
        if(id==='O08')credit(r,'C',1);
      }else if(dreamId==='Q'){
        if(id==='Q01' && c!=='C')credit(r,'A',0);
        if(id==='Q02' && c!=='C')credit(r,'B',0);
        if(id==='Q03' && c!=='C')credit(r,'D',0);
        if(id==='Q04')credit(r,'C',0);
      }
    }
    const evidence=[...sources.values()];
    return {total:evidence.reduce((sum,s)=>sum+s.points,0),evidence};
  }

  function attemptHistory(run){
    const records=history(run);
    return records.filter(r=>r.attempt).map(r=>{
      const last=records.findLast(f=>f.opportunityId===r.opportunityId);
      const ended=last.terminal || last.blocked || last.closed || last.eventId==='E20';
      return {...r.attempt,status:last.terminal??(ended?'CLOSED':'ACTIVE'),end:ended?last.approvedTextId:null};
    });
  }

  function fate(run,dreamId,opportunityId,environmentVersion){
    if(!['E','O','Q'].includes(dreamId) || !opportunityId || !environmentVersion)throw Error('Invalid competition identity');
    return LifeEngine.hash('reviewed-v1',run.seed,dreamId,opportunityId,environmentVersion)%11;
  }

  function validHistory(run){
    // Imported JSON can contain invalid intermediate cursor/receipt shapes.
    try{return replayHistory(run);}catch{return false;}
  }
  function replayHistory(run) {
    if(run.reviewedVersion!==1)return run.reviewedVersion===undefined && !run.readingReviewed &&
      run.facts.every(f=>!f.reviewed && !f.communityActivity && !f.schoolMatch);
    const prefix={...run,stage:'result',finalType:null,facts:[],result:{}};
    delete prefix.readingReviewed;
    for(const f of run.facts){
      const hostCopy={...f};
      delete hostCopy.reviewed;
      prefix.facts.push(hostCopy);
      prefix.slot=f.slot;
      const records=f.reviewed??[];
      if(!Array.isArray(records))return false;
      if(f.schoolMatch && (!Array.isArray(f.trainingWindow?.sessions) || f.schoolMatch.starts!==calendar.E02[1] ||
          f.choiceId!=='life-11-0'||!byId(prefix,'P-E01')||
          !schoolTeam.every((id,i)=>f.schoolMatch.roster?.[i]===id)||f.schoolMatch.opponentCount!==5))return false;
      if(f.communityActivity){
        const id=f.communityActivity.eventId;
        if(!['O-A01','O-A02','O-A03','E-A01','E-A02','E-A03','E-A04'].includes(id)||calendar[id][0]!==f.slot||
           f.communityActivity.starts!==calendar[id][1] || !f.careerAfter)return false;
        if(f.communityActivity.sourceSlot!==f.slot || f.actions?.length || f.dayExtra || (f.pay?.workBlocks??0)>=2 ||
           (id.startsWith('E')?JSON.stringify(f.communityActivity.players)!==JSON.stringify(communityPlayers(run.seed)):!f.communityActivity.supervised))return false;
        if(id==='O-A02' && byId(prefix,'O-A01')?.choiceId!=='A' ||
           id==='O-A03' && !byId(prefix,'O-A02@session2')?.practiceDate)return false;
      }
      if(f.trialOffer && (!byId(prefix,'D-H01@review') || !['E16','E21'].includes(f.trialOffer.eventId) ||
         trialWindows[f.slot]?.eventId!==f.trialOffer.eventId || f.trialOffer.starts!==trialWindows[f.slot].starts ||
         history(prefix).some(r=>r.terminal==='QUIT')))return false;
      let expected=f.trialOffer?.eventId??f.communityActivity?.eventId??({'life-5':'P-S01','life-6':'O01','life-7':'Q01'})[f.eventId];
      if(f.slot===11)expected=f.schoolMatch?'E01':libraryLater(prefix)&&byId(prefix,'P-S01')?'P-S02':undefined;
      if(f.slot===15&&prefix.facts.some(x=>x.slot===14&&x.trace?.commands.includes('admit:steady')))expected='Q-U01';
      for(const r of records){
        if(!r||!expected||(r.node??r.eventId)!==expected||visited(prefix,expected))return false;
        prefix.readingReviewed={eventId:expected,feedback:false};
        const scene=view(prefix);
        if(!scene||!commit(prefix,r.approvedTextId,r.opportunityId))return false;
        const computed=hostCopy.reviewed.at(-1);
        if(JSON.stringify(computed)!==JSON.stringify(r))return false;
        expected=successor(r,prefix);
      }
      if(f.slot===run.slot && run.readingReviewed){
        const {eventId,feedback}=run.readingReviewed;
        if(run.stage!=='result'||typeof feedback!=='boolean'||
          eventId!==(feedback?(records.at(-1)?.node??records.at(-1)?.eventId):expected)||!text[eventId])return false;
      }else if(records.length && expected && f.slot<run.slot)return false;
      delete prefix.readingReviewed;
    }
    if(run.readingReviewed && run.facts.at(-1)?.slot!==run.slot)return false;
    return run.stage!=='result' || JSON.stringify(run.result?.fact?.reviewed)===JSON.stringify(host(run)?.reviewed);
  }
  return {first,view,step,commit,recordOpportunity,history,validHistory,historicalScore,attemptHistory,fate,calendar};
})();
