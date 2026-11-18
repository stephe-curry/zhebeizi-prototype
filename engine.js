'use strict';

globalThis.LifeEngine = (() => {
  const C = globalThis.LifeContent;
  const base = {knowledge:16,skill:16,social:17,body:24,charm:17,mind:20,money:0,stress:16,mood:65,health:85,family:65,network:5,face:0,budget:12000,expect:50,parentHealth:86,affinity:0};
  const attributes = Object.keys(base).slice(0,6);
  const copy = value => JSON.parse(JSON.stringify(value));
  const emptyDraft = () => ({main:null,support:[],experience:null,items:{},reuse:null,dayExtra:null,memory:[],wish:null,parent:null,order:[]});
  const age = run => C.ages[run.slot-1];
  const energy = run => run.stats.body < 40 ? 4 : run.stats.body < 70 ? 5 : 6;
  const stage = slot => slot <= 4 ? '童年' : slot <= 22 ? '求学' : slot <= 40 ? '职场' : '后半生';
  const room = slot => slot <= 22 ? 0 : slot <= 40 ? 1 : 2;
  const job = id => C.jobs[id]?.[0] ?? '求学';
  const held = item => item && ['display','stored'].includes(item.state);

  function currentCard(run) {
    const card = C.cards.find(card => card.id === run.eventId);
    if (!card) return;
    if(card.id==='life-2'){
      const repair=run.birth==='craft-child'||run.facts[0]?.choiceId==='life-1-2';
      if(!repair)return {...card,title:'把桌子让出一角',body:'家人放下一盏旧灯，桌上只空出一角。作业本摊在哪里？',
        choices:card.choices.map((c,i)=>({...c,label:['把作业本推到灯下','把灯移到窗边','把亮处让给家人'][i],
          outcome:['家人把灯留给你，纸上终于能看清格子','窗边腾出了写字的位置','你把书合上，留了一张明早再写的便条'][i],
          commands:c.commands.filter(k=>k!=='exp:repair')}))};
    }
    if(card.id==='life-8'){
      const rainy={'grandma':['接过外婆的菜袋','你接过菜袋，外婆腾出手把伞往你这边挪了挪。','meet:parent'],
        'craft-child':['拿家里的边角木搭桥','一块旧木板跨过积水，同学们扶着你走了过去。','exp:repair'],
        'athlete':['扶同学绕过积水','你先试好落脚处，回身拉了同学一把。','meet:friend']}[run.birth];
      if(rainy)return {...card,choices:card.choices.map((c,i)=>i===1?{...c,label:rainy[0],outcome:rainy[1],commands:[rainy[2]]}:c)};
    }
    if(card.id==='life-28' && held(run.items.yearbook)){
      const together=run.people.friend?.status==='in-touch';
      return {...card,body:together?'阿宁来帮忙，翻开留言册，认出那只怪猫。床头只够摆一件。':'房间终于安静。你在两张纸箱之间翻到了当年的留言册。床头只够摆一件。'};
    }
    const missedShow = card.id === 'indie-rights' && run.opportunities?.some(opportunity => opportunity.id === 'project' && opportunity.status === '报名截止');
    const choices = card.choices.map(choice => {
      const contact = choice.commands.find(command => command.startsWith('meet:'));
      const id = contact?.split(':')[1];
      const person = run.people[id];
      if (person?.status === 'dead') return {...choice,label:'留下几句心里话',outcome:'你把想说的话写了下来，夹在自己的记录里。',commands:choice.commands.filter(command => command !== contact)};
      if (id === 'friend' && run.slot >= 41) {
        if (!person) return {...choice,label:'写一页自己的近况',outcome:'你写下这几年的变化，把信收在了手边。',commands:choice.commands.filter(command => command !== contact)};
        if (person.status === 'lost') return {...choice,label:'试着联系失联的阿宁',outcome:'你按旧地址留下消息。过了一阵，阿宁回信说也记得你们认识的那段日子。'};
      }
      if (choice.commands.includes('reopen:choose') && !Object.values(run.items).some(held)) {
        return {...choice,label:'把空出的位置留着',outcome:'你清出一格，眼下没有要摆回去的旧物。',commands:choice.commands.filter(command => command !== 'reopen:choose')};
      }
      if (choice.commands.includes('earlyEnd:item') && !Object.values(run.items).some(held)) {
        return {...choice,label:'说一件想告诉照护者的事',outcome:'你留下一句话，然后听了一会儿外面的声音。',commands:['earlyEnd:note']};
      }
      if (card.id === 'arena-quiet' && choice.id === 'arena-quiet-1' && !held(run.items.medal)) {
        return {...choice,label:'记下今天的比赛',outcome:'你在赛程纸上圈出一局，想起训练室里练过的那个回合。'};
      }
      if (missedShow && choice.id === 'indie-rights-0') return {...choice,outcome:'你换用了可授权的声音，给下一轮小范围测试留了个版本。'};
      return choice;
    });
    if (missedShow) return {...card,title:'错过试玩展之后',body:'上次先守住了本职收入，试玩展报名已经截止。还有别的发布机会，但这次配乐的使用方式仍要谈清。',choices};
    return choices.some((choice,index) => choice !== card.choices[index]) ? {...card,choices} : card;
  }

  function hash(...parts) {
    let value = 2166136261;
    for (const letter of parts.join('␟')) value = Math.imul(value ^ letter.charCodeAt(0),16777619);
    value ^= value >>> 16;
    value = Math.imul(value,0x7feb352d);
    value ^= value >>> 15;
    value = Math.imul(value,0x846ca68b);
    return (value ^ value >>> 16) >>> 0;
  }

  function modify(stats, changes = {}) {
    for (const [id, delta] of Object.entries(changes)) {
      if (!Object.hasOwn(stats,id)) continue;
      const total = stats[id] + delta;
      stats[id] = id === 'money' ? total : id === 'budget' ? Math.max(0,total) : Math.max(0, Math.min(100,total));
    }
  }

  function origin(seed) {
    let counter = 0, value;
    do { value = hash(seed,'birth',counter++); } while (value >= 2**32 - 2**32 % C.origins.length);
    return C.origins[value % C.origins.length];
  }

  function rule(run,id) {
    const score = id => run.threads[id]?.steps ?? 0;
    switch(id) {
      case 'school': return run.slot === 15 ? Boolean(run.admission?.reach) : score('school') > 0;
      case 'esport': return score('esport') >= (run.slot === 23 ? 2 : 1) && run.people.coach?.status !== 'lost';
      case 'esport-job': return run.career === 'player';
      case 'esport-echo': return run.careerLog.some(record => record.to === 'player') && run.people.coach?.status === 'in-touch';
      case 'indie': return score('indie') >= (run.slot === 33 ? 2 : 1) && run.threads.indie.status !== 'paused';
      case 'former-player': return run.careerLog.some(record => record.from === 'player') && score('indie') > 0 && !run.project.started;
      case 'late-release': return run.project.startedAt === 41 && !run.project.closed;
      case 'delivery-routine': return run.career === 'delivery' && run.low?.type !== 'delivery';
      case 'indie-active': return run.project.started && !run.project.closed;
      case 'indie-echo': return run.project.published;
      case 'indie-history': return held(run.items.prototype) && run.project.started;
      case 'recover': return !!run.low && run.low.status === 'active' && run.slot > run.low.slot;
      case 'chance': return run.people.friend?.status === 'in-touch' && hash(run.seed,run.historyKey,'open-door') % 3 === 0;
      case 'early': return run.scenario === 'early' || (run.scenario === 'life' && (!run.low || run.low.status !== 'active') && hash(run.seed,run.historyKey,'unforeseen') % 100 === 0);
      case 'early-next': return !!run.early && run.slot === 44;
      default: return run.career === id;
    }
  }

  function schedule(run) {
    const matching = C.cards.filter(card => card.slot === run.slot && card.rule && rule(run,card.rule));
    const story = matching.find(card => card.rule === 'early-next' || card.rule === 'early')
      ?? matching.find(card => card.id === 'arena-final')
      ?? matching.find(card => card.rule === 'recover')
      ?? matching[0];
    const pastDelivery = run.careerLog.some(record => record.to === 'delivery');
    const occupationId = run.career === 'dispatcher' && pastDelivery ? 'delivery' : run.career;
    const occupation = C.cards.find(card => card.slot === run.slot && card.job && card.job === occupationId);
    return story ?? occupation ?? C.shared[run.slot-1];
  }

  function snapshot(run) {
    const {facts, forks, draft, result, memo, ...state} = run;
    return copy(state);
  }

  function prepare(run,slot) {
    run.slot = slot;
    run.eventId = schedule(run).id;
    run.stage = 'event';
    run.activity = null;
    run.draft = emptyDraft();
    run.result = null;
    run.committed = false;
    run.entered = false;
    run.checkpoint = null;
    if (currentCard(run).hotspot) run.checkpoint = snapshot(run);
    return run;
  }

  function create(seed,{scenario='life',points={},talent=null}={}) {
    seed >>>= 0;
    const birth = origin(seed);
    const stats = {...base};
    modify(stats,birth.delta);
    modify(stats,points);
    if (talent) modify(stats,C.talents[talent]?.[2]);
    return prepare({
      seed,scenario,birth:birth.id,stats,points,talent,career:null,direction:null,careerLog:[],items:{},people:{},
      threads:{},experience:{},highlights:{},facts:[],forks:[],wish:null,wishLog:[],historyKey:hash(seed,'story'),
      project:{points:0},low:null,early:null,age35:null
    },1);
  }

  function reconnect(run,id,events) {
    const person = run.people[id];
    if (person?.status === 'dead') return;
    run.people[id] = {...person,status:'in-touch',last:run.slot,first:person?.first ?? run.slot,seasons:(person?.seasons ?? 0)+1};
    events.people.add(id);
    if (!person || person.status === 'lost') events.relations.push({id,status:person ? 'reconnected' : 'met'});
  }

  function ageContacts(run,events) {
    const friend = run.people.friend;
    if (![40,41].includes(run.slot) || friend?.status !== 'in-touch' || run.slot-friend.last <= 12) return;
    friend.status = 'lost';
    friend.lostSince = run.slot;
    events.relations.push({id:'friend',status:'lost'});
    events.lines.push('阿宁以前留的号码已经很久没有消息，这段联系慢慢断了。');
  }

  function transitionItem(run,id,state,events) {
    const prior = run.items[id];
    if (!C.items[id] || ['given','discarded'].includes(prior?.state) || prior?.state === state) return;
    const item = prior ?? {first:run.slot,trail:[]};
    item.state = state;
    item.last = run.slot;
    item.trail.push({slot:run.slot,state});
    run.items[id] = item;
    events.items.add(id);
  }

  function updateWish(run,id,status) {
    if (run.wish?.id === id && run.wish.status === status) return;
    if (run.wish?.status === 'active' && run.wish.id !== id) {
      run.wishLog.push({...run.wish,slot:run.slot,status:'paused'});
    }
    if (!id) { run.wish = null; return; }
    run.wish = {id,status,since:run.wish?.id === id ? run.wish.since : run.slot};
    run.wishLog.push({...run.wish,slot:run.slot});
  }

  function earn(run,id,label,events) {
    if (run.highlights[id]) return;
    run.highlights[id] = {label,slot:run.slot};
    events.highlights.push(id);
  }

  function changeJob(run,next) {
    if (next === run.career) return;
    run.careerLog.push({from:run.career,to:next,slot:run.slot});
    run.career = next;
    const direction = C.jobs[next][1];
    if (C.directions.includes(direction)) run.direction = direction;
  }

  function preparedFor(run,next) {
    return run.prepared && (run.prepared === next || run.prepared === 'delivery' && next === 'sanitation');
  }

  function opportunityPreview(run,choice) {
    if (!choice) return [];
    const jobId = choice.commands.find(command => command.startsWith('job:'))?.split(':')[1];
    if (run.slot === 23 && run.prepared && jobId) {
      const matches = preparedFor(run,jobId);
      return [{title:'毕业前的准备',status:matches?'派上用场':'选择了另一条路',detail:matches?'提前看过排班和岗位，会少一些入职压力。':'原来的走访留作参考，这次按新岗位的要求从头熟悉。'}];
    }
    const focus = choice.commands.find(command => command.startsWith('priority:'))?.split(':')[1];
    if (run.slot === 33 && Object.hasOwn(C.opportunities,focus)) return Object.entries(C.opportunities).map(([id,[title,selected,deferred]]) => ({
      id,title,status:id===focus?'优先安排':id==='project'?'报名截止':'顺延一轮',detail:id===focus?selected:deferred
    }));
    if (run.slot === 40 && jobId && jobId !== run.career) return [{title:job(jobId),status:'换一份工作',detail:'三十五岁的履历会记录这次转岗，以后的岗位事件也会随之改变。'}];
    return [];
  }

  function followOpportunity(run,events) {
    if (run.slot !== 35) return;
    const focus = run.opportunities?.find(opportunity => opportunity.status === '优先安排')?.id ?? run.priority;
    if (focus === 'work') {
      modify(run.stats,{money:450,stress:2});
      events.lines.push('前一轮选下的临时工作已经交接，你拿到额外的补贴，这周也少了一点休息。');
    }
    if (focus === 'rest') {
      modify(run.stats,{money:-240,stress:-5,health:2});
      events.lines.push('先前留出的休息生效了。你缓过来一些，这个月也少结了一段工钱。');
    }
    if (focus === 'project') events.lines.push('之前答应的试玩排期仍在。你要为下一次提交留出时间。');
  }

  function markLow(run,type,events) {
    if (run.low?.status === 'active' || run.lastLow && run.slot-run.lastLow < 3) return;
    const cost = type === 'office' ? 2400 : run.draft.support.includes('money') ? 1100 : 1600;
    run.low = {type,slot:run.slot,status:'active'};
    run.lastLow = run.slot;
    modify(run.stats,{money:-cost,health:type === 'office' ? 0 : -6,stress:7});
    events.lines.push('日常收入暂时中断，生活支出仍在继续。');
  }

  function commitCommand(run,key,value,events) {
    const roll = hash(run.historyKey,run.eventId,key) % 100;
    switch(key) {
      case 'meet': reconnect(run,value,events); break;
      case 'gain': if (!run.items[value]) transitionItem(run,value,'display',events); break;
      case 'exp': run.experience[value] ??= run.slot; break;
      case 'thread': {
        const previous = run.threads[value];
        run.threads[value] = {steps:(previous?.steps ?? 0)+1,status:'active',slot:run.slot};
        break;
      }
      case 'pause':
        if(run.threads[value]) run.threads[value].status = 'paused';
        if (value === 'indie' && run.project.started) run.project.closed = 'paused';
        break;
      case 'wish': break; // Presented as a candidate before confirmation.
      case 'direction': run.direction = value; break;
      case 'route': run.prepared = value; break;
      case 'job':
        changeJob(run,value);
        if (run.slot === 23 && preparedFor(run,value)) {
          modify(run.stats,{stress:-3});
          events.lines.push('毕业前问过的安排这时用上了，入职的第一周从容一些。');
        }
        break;
      case 'admit': {
        const qualified = value === 'reach' && run.stats.knowledge + (run.threads.school?.steps ?? 0)*2 + roll/6 >= 48;
        run.admission = {name:qualified ? '清北录取' : value === 'trade' ? '实训专业录取' : '备选院校录取',qualified,reach:value === 'reach'};
        events.lines.push(qualified ? '录取页面更新了。那所填在第一行的学校递来了录取消息。' : value === 'reach' ? '第一志愿没有录取，你收到备选学校的通知。' : '录取结果出来了，接下来就是新的生活。');
        transitionItem(run,'letter','display',events);
        if (qualified) earn(run,'school','清北录取',events);
        if (run.wish?.id === 'admit') updateWish(run,'admit','done');
        break;
      }
      case 'moveitems': {
        const packing = packingPlan(run,value);
        const counts = {keep:0,store:0,give:0,discard:0};
        for (const [id,item] of Object.entries(run.items)) {
          if (!held(item)) continue;
          const destination = packing[id];
          counts[destination]++;
          transitionItem(run,id,packingStates[destination],events);
        }
        const verbs = {keep:'带走',store:'收起',give:'送出',discard:'丢弃'};
        const list = Object.entries(counts).filter(([,count])=>count>0).map(([id,count])=>verbs[id]+count+'件');
        events.packSummary = list.length ? '这次搬家，你把旧物逐件安顿好。'+list.join('，')+'。' : '箱子里没有需要处理的旧物。';
        break;
      }
      case 'reopen': {
        const selected = value === 'choose' || value === '1' ? selectedReuse(run) : value;
        if (held(run.items[selected])) {
          transitionItem(run,selected,'display',events);
          const item = run.items[selected];
          if (item.last !== run.slot) {
            item.last = run.slot;
            item.trail.push({slot:run.slot,state:'display'});
          }
          events.items.add(selected);
          events.reused.push(selected);
        }
        break;
      }
      case 'protect':
        run.protection = Number(value);
        modify(run.stats,{health:Number(value)-2,stress:1-Number(value)});
        break;
      case 'setback': markLow(run,value,events); break;
      case 'rain': {
        const cover = Number(value) + Number(run.draft.experience === 'safety');
        if (events.hazard < 78 - cover*21) markLow(run,'delivery',events);
        else events.lines.push('这一趟平安收工。你仍给接下来的排班留下了恢复时间。');
        break;
      }
      case 'recover':
        run.low.status = value === 'help' ? 'adjusted' : 'recovering';
        run.low.response = {kind:value,slot:run.slot};
        modify(run.stats,{money:value === 'change' ? -400 : -200,stress:-3,health:2});
        if (value === 'change' && run.career === 'delivery') changeJob(run,'dispatcher');
        break;
      case 'priority':
        run.priority = value;
        if (run.slot === 33) run.opportunities = opportunityPreview(run,currentCard(run).choices.find(choice => choice.id === run.draft.main));
        break;
      case 'arena':
        run.tactic = value;
        run.matchPrep = run.draft.order[0] === 1 ? 6 : run.draft.order[0] === 0 ? 4 : 0;
        if (run.draft.order[0] === 2) modify(run.stats,{stress:-3});
        break;
      case 'final':
        if (value === 'play' && run.tactic !== 'mentor' && (run.threads.esport?.steps ?? 0)*6 + run.stats.health/3 + roll/4 + (run.matchPrep ?? 0) >= 77) {
          earn(run,'world','电竞世界冠军',events);
          transitionItem(run,'medal','display',events);
          events.lines.push('比分停了下来。你回头看向队友，知道这次站在了最后。');
          if (run.wish?.id === 'rank') updateWish(run,'rank','done');
        } else {
          events.lines.push(value === 'play' ? '你们没能拿下最后一场。训练留下的东西仍可以带走。' : '这一场结束了。你开始想下一段生活需要什么。');
          if (run.wish?.id === 'rank') updateWish(run,'rank','unfinished');
        }
        break;
      case 'project':
        run.project.started = true;
        run.project.startedAt ??= run.slot;
        if (value === 'wait') { run.project.points += 0; events.lines.push('收入暂时稳定下来，试玩窗口往后挪。'); }
        else {
          run.project.points += value === 'polish' ? 2 : 1;
          if (run.draft.experience === 'teamwork') run.project.points++;
          modify(run.stats,{money:value === 'sketch' ? -150 : -450,stress:3});
          transitionItem(run,'prototype','display',events);
        }
        break;
      case 'release':
        run.project.closed = value;
        if (value !== 'stop' && run.project.points + (value === 'later' ? 1 : 0) >= 3) {
          run.project.published = true;
          transitionItem(run,'prototype','display',events);
          earn(run,'published','独立游戏正式发布',events);
          if (run.wish?.id === 'make') updateWish(run,'make','done');
          const audience = hash(run.seed,run.historyKey,'release-audience') % 3;
          events.lines.push(['首周只有零星下载。一封手写反馈标出了最难懂的地方。',
            '有玩家把通关录像转给了朋友，留言区慢慢热闹起来。',
            '一位主播偶然玩到这款游戏，第二天多了整整一屏陌生人的留言。'][audience]);
          if(value==='later')events.lines.push('测试时卡住的那一关，这次有人一口气走完了。');
        } else {
          if (run.wish?.id === 'make') updateWish(run,'make','unfinished');
          events.lines.push('正式发布计划没有走完，你们留下可再次打开的版本。');
        }
        break;
      case 'early': run.early = value; break;
      case 'earlyEnd': run.finalType = 'early'; run.goodbye = value; break;
      case 'ending': run.finalType = value; break;
      case 'shine': {
        const moments = {office:'留下一份清楚的交接',factory:'把机台的经验教给新人',delivery:'补齐街区的安全地图',sanitation:'给下一班留下一条路'};
        earn(run,value,moments[value],events);
        break;
      }
    }
  }

  const echoes = [
    ['lamp', '那盏台灯换了一张桌子，白痕还在原来的地方。','灯光照到白痕时，你认出了第一次修灯的位置。'],
    ['console','擦掉旧游戏机上的薄灰，手指还知道怎么找到开始键。','你又翻过旧游戏机，背面那颗生锈的螺丝还在。'],
    ['notes','少数题已经认不出解法，你仍认得是谁陪你解过。','错题本的边上还是那道折角。'],
    ['letter','信封上的地址，后来成了你最早认识的一条新路。','那封录取信里的学年，如今看起来比当时短。'],
    ['badge','把工牌拿在手里，你先想起那扇每天要刷卡的门。','工牌照片里的领口，是来不及熨平的那件。'],
    ['tools','工具的握把变深了，摸起来还是很顺手。','工具盒后来修过家里比机台更多的东西。'],
    ['gloves','换季时旧手套又露出来，反光条在暗处仍能找到。','一只手套袖口的线头，是你最后一次补的。'],
    ['map','窗外换了一排招牌，那张手绘图还记着旧入口。','路上有人补了一条近道，你认出它绕开了老坡。'],
    ['prototype','旧版本启动得慢。第一个能正常走动的小人还在那里。','你把试玩版本夹在更近的一个文件夹中，后来一直没有删。'],
    ['photo','照片背面的署名没补完，纸上的人都年轻得出奇。','你决定翻过照片再看一眼背面的日期。']
  ];

  function callbacks(run,events) {
    if (run.slot < 41 && run.slot !== 28 && run.slot !== 38) return [];
    const related = relationshipEcho(run,events);
    const candidates = echoes.flatMap(([id,first,later],index) => {
      const item = run.items[id];
      if (!held(item) || item.first >= run.slot-2 || item.state !== 'display') return [];
      const unmarked=id==='lamp' && !run.facts.some(f=>f.slot===2 && f.action==='跟着家人修灯');
      const text=unmarked?(run.slot>43?'灯下又摊开了一本新书。':'旧台灯换了一张桌子，亮处刚好容得下一张纸。'):(run.slot>43?later:first);
      return [{id,text,weight:events.items.has(id) ? 0 : 1+hash(run.historyKey,run.slot,index)%30}];
    });
    const available = candidates.sort((a,b) => a.weight-b.weight).filter(candidate => !run.facts.some(fact => fact.echoes?.some(echo => echo.text === candidate.text)));
    if (related) return [related,...available.slice(0,1)];
    return available.slice(0,run.slot >= 41 ? 2 : 1);
  }

  function relationshipEcho(run,events) {
    if (![42,45].includes(run.slot)) return null;
    for (const id of ['friend','colleague','parent','coach']) {
      const person = run.people[id];
      if (person?.status !== 'in-touch' || person.seasons < 2 || events.people.has(id)) continue;
      const fact = run.facts.find(fact => fact.people.includes(id) && age(run)-fact.age >= 10);
      if (!fact || run.facts.some(fact => fact.echoes?.some(echo => echo.person === id))) continue;
      return {person:id,sourceSlot:fact.slot,text:C.people[id]+'发来一条问候，也提起你'+fact.age+'岁时「'+fact.title+'」那件事。'};
    }
    return null;
  }

  function wishCandidate(run,choice) {
    return choice?.commands.find(command => command.startsWith('wish:'))?.split(':')[1]
      ?? ({14:'admit',25:'save',36:'rest',44:'pass'})[run.slot] ?? null;
  }

  function mainCost(run) { return run.slot < 15 || run.slot === 46 ? 2 : 3; }

  function permittedExperience(run) {
    const related = {
      2:['repair'],11:['repair','teamwork'],14:['practice'],23:['workshop','safety','teamwork'],28:['repair'],
      33:['teamwork','launch','workshop'],36:['safety','workshop','recovery','teamwork'],40:['recovery','workshop','safety','teamwork'],
      44:['repair','mentor','launch','recovery'],46:['mentor','repair']
    };
    return (related[run.slot] ?? []).filter(id => Object.hasOwn(run.experience,id));
  }

  function reuseChoices(run) {
    return Object.keys(run.items).filter(id => held(run.items[id])).sort((a,b) =>
      Number(run.items[b].state === 'stored')-Number(run.items[a].state === 'stored') || run.items[a].first-run.items[b].first
    );
  }

  function selectedReuse(run) {
    const eligible = reuseChoices(run);
    return eligible.includes(run.draft.reuse) ? run.draft.reuse : eligible[0];
  }

  function dayPlan(run,event,choice) {
    const schedule = C.dayPlans[event.id];
    if (!schedule) return null;
    const mainBlocks = choice ? schedule.costs[event.choices.indexOf(choice)] : 0;
    const extra = mainBlocks === 1 ? schedule.extras.find(card => card.id === run.draft.dayExtra) ?? null : null;
    return {...schedule,mainBlocks,extra,used:mainBlocks+Number(!!extra)};
  }

  function chooseDayExtra(run,id) {
    if (run.stage !== 'event' || run.activity) return false;
    const day = preview(run).day;
    if (day?.mainBlocks !== 1 || !day.extras.some(card => card.id === id)) return false;
    run.draft.dayExtra = day.extra?.id === id ? null : id;
    return true;
  }

  const packingStates = {keep:'display',store:'stored',give:'given',discard:'discarded'};

  function packingPlan(run,fallback='store') {
    const ids=Object.keys(run.items).filter(id=>held(run.items[id]));
    const destinations=Object.fromEntries(ids.map(id=>[id,run.draft.items[id]??fallback]));
    const bedside=ids.find(id=>run.draft.items[id]==='keep')??ids.find(id=>destinations[id]==='keep');
    for(const id of ids) if(id!==bedside && destinations[id]==='keep')destinations[id]='store';
    return destinations;
  }

  function placeItem(run,id,destination) {
    if (run.slot !== 28 || run.stage !== 'event' || !run.entered || !held(run.items[id])) return false;
    if (destination === 'default') delete run.draft.items[id];
    else if (Object.hasOwn(packingStates,destination)) {
      if(destination==='keep') {
        for(const key of Object.keys(run.draft.items)) if(run.draft.items[key]==='keep')run.draft.items[key]='store';
      }
      run.draft.items[id] = destination;
    }
    else return false;
    return true;
  }

  function preview(run) {
    const event = currentCard(run);
    const interaction = event.interaction && run.draft.interaction ? globalThis.LifeInteraction.preview(run) : null;
    const legacyShopChoice = event.id==='life-3' && !run.draft.interaction;
    const main = event.interaction && !legacyShopChoice ? interaction?.choiceId : run.draft.main;
    const choice = event.choices.find(choice => choice.id === main);
    const used = event.hotspot && choice ? mainCost(run) + run.draft.support.reduce((total,id) => total+C.supports[id][1],0) : 0;
    const reuse = choice?.commands.includes('reopen:choose') ? reuseChoices(run) : [];
    return {choice,interaction,used,remaining:energy(run)-used,options:permittedExperience(run),wish:wishCandidate(run,choice),reuse,day:dayPlan(run,event,choice),
      reuseSelected:reuse.length?selectedReuse(run):null,opportunities:opportunityPreview(run,choice)};
  }

  function canApply(run) {
    const event = currentCard(run);
    const draft = preview(run);
    return run.stage === 'event' && !run.committed && !run.activity && draft.choice &&
      (!event.interaction || event.id==='life-3' && !run.draft.interaction || draft.interaction?.phase === 'ready') &&
      (!event.hotspot || run.entered) && draft.remaining >= 0 &&
      (!C.familySlots.includes(run.slot) || run.draft.parent !== null);
  }

  function commit(run) {
    if (!canApply(run)) return false;
    const event = currentCard(run);
    const {choice,interaction,wish,reuse,reuseSelected,opportunities,day} = preview(run);
    const actionResult = interaction && globalThis.LifeInteraction.settlement(interaction);
    const before = {...run.stats};
    const careerBefore = run.career;
    const events = {items:new Set(),people:new Set(),lines:[],highlights:[],relations:[],reused:[],hazard:hash(run.historyKey,event.id,'hazard')%100};
    const changes = {...choice.delta};
    if (run.stats.stress >= 60) for (const id of attributes) if (changes[id] > 0) changes[id] = Math.floor(changes[id]*0.8);
    modify(run.stats,changes);
    for (const id of run.draft.support) modify(run.stats,C.supports[id][3]);
    if (run.draft.support.includes('experience') && permittedExperience(run).includes(run.draft.experience)) modify(run.stats,C.experience[run.draft.experience][2]);
    if (run.draft.wish === 'take' && wish) updateWish(run,wish,'active');
    if (run.draft.wish === 'pause' && run.wish) updateWish(run,run.wish.id,'paused');
    if (C.familySlots.includes(run.slot)) {
      const perspective = run.draft.parent;
      modify(run.stats,perspective === 0 ? {expect:3,family:1} : perspective === 1 ? {budget:-300,family:2} : {expect:-2,family:3});
      reconnect(run,'parent',events);
    }
    if (run.minigame?.slot === run.slot && run.minigame.kind === 'study') modify(run.stats,{knowledge:run.minigame.bonus});
    if (run.minigame?.slot === run.slot && run.minigame.kind === 'duel') modify(run.stats,{mood:run.minigame.rounds.filter(id => id === 'humor').length+1,face:run.minigame.rounds.includes('reply') ? 2 : 0});
    const decisions = [
      [...run.draft.support].sort(),run.draft.experience,Object.entries(run.draft.items).sort(),run.draft.wish,run.draft.parent,run.draft.order,run.minigame?.slot === run.slot ? run.minigame : null
    ];
    if (actionResult) decisions.push(actionResult.performed);
    if(run.draft.postcard)decisions.push(['postcard',run.draft.postcard]);
    if (reuseSelected && reuseSelected !== reuse[0]) decisions.push(reuseSelected);
    if (day?.extra) decisions.push(['day-extra',day.extra.id]);
    run.historyKey = hash(run.historyKey,event.id,choice.id,JSON.stringify(decisions));
    for (const command of choice.commands) commitCommand(run,...command.split(':'),events);
    if (day?.extra) {
      modify(run.stats,day.extra.delta);
      for (const command of day.extra.commands) commitCommand(run,...command.split(':'),events);
      events.lines.push(day.extra.outcome);
    }
    followOpportunity(run,events);
    if (run.low?.status === 'active' && run.slot > run.low.slot && run.slot < run.low.slot+4) {
      modify(run.stats,{money:-500,stress:2});
      events.lines.push('这段时间仍有 500 元生活支出要从储蓄中支付。');
    }
    if (!run.low && run.stats.stress >= 85 && run.slot > 23 && run.slot < 40 && run.career !== 'player') markLow(run,'overload',events);
    if (run.low?.response && run.low.status !== 'resolved' && run.slot >= run.low.response.slot+2) {
      run.low.status = 'resolved';
      events.lines.push('两次排班后，先前选的恢复安排渐渐稳定下来。已经付掉的账单和少掉的工时仍留在记录里。');
    }
    if (run.career && run.slot <= 42 && run.low?.status !== 'active') modify(run.stats,{money:300,stress:-1});
    if (run.slot === 40) run.age35 = {job:run.career,stats:{...run.stats}};
    ageContacts(run,events);
    if (run.wish?.status === 'active') {
      if (run.wish.id === 'save' && run.stats.money >= 3000 || run.wish.id === 'rest' && run.stats.health >= 78 && run.stats.stress <= 45 || run.wish.id === 'pass' && Object.hasOwn(run.experience,'mentor')) updateWish(run,run.wish.id,'done');
    }
    const echo = callbacks(run,events);
    const fact = {
      slot:run.slot,age:age(run),eventId:event.id,choiceId:choice.id,title:event.title,action:events.packSummary?'给旧物安排去处':choice.label,
      text:[events.packSummary??choice.outcome,...events.lines].join(' '),important:!!event.hotspot || !!event.job || !!event.rule,
      people:[...events.people],items:[...events.items],highlights:events.highlights,
      relations:events.relations,reused:events.reused,opportunities,
      careerBefore,careerAfter:run.career,echoes:echo,
      wish:run.wish ? {...run.wish} : null,parent:run.draft.parent,
      plan:event.hotspot ? {support:[...run.draft.support],experience:run.draft.experience,order:[...run.draft.order]} : null
    };
    const origins=[event.id==='school-result' && run.facts.findLast(f=>f.slot===14)?.slot,
      run.slot===35 && run.opportunities?.length && run.facts.findLast(f=>f.slot===33)?.slot,
      run.slot===23 && run.prepared && run.facts.findLast(f=>f.slot===21)?.slot,
      run.draft.experience && run.experience[run.draft.experience],
      ...events.reused.map(id=>run.items[id]?.first),...events.relations.map(r=>run.people[r.id]?.first),
      ...echo.map(e=>e.sourceSlot??run.items[e.id]?.first),run.low?.status==='recovering' && run.low.slot];
    fact.sourceSlots=[...new Set(origins.filter(slot=>Number.isInteger(slot)&&slot>0&&slot<run.slot))];
    if(choice.commands.some(command=>command.startsWith('release:'))) {
      fact.sourceSlots=run.facts.filter(old=>C.cards.find(card=>card.id===old.eventId)?.choices
        .find(option=>option.id===old.choiceId)?.commands.some(command=>command.startsWith('project:'))).map(old=>old.slot);
    }
    if(run.minigame?.slot===run.slot && run.minigame.kind==='duel')fact.table=[...run.minigame.rounds];
    if(run.draft.postcard && run.people.friend?.status==='in-touch' && held(run.items[run.draft.postcard])){
      fact.postcard=run.draft.postcard;
      fact.text+=' 阿宁收到你拍的'+C.items[fact.postcard][0]+(fact.postcard==='yearbook'?'，回了一句：“耳朵是你添的，我只画了一只。”':'，回了句：“原来你一直留着。”');
      reconnect(run,'friend',events);
      if(!fact.people.includes('friend'))fact.people.push('friend');
    }
    if (day?.extra) fact.dayExtra = day.extra.id;
    if (actionResult) fact.interaction = actionResult;
    run.facts.push(fact);
    if (run.checkpoint && event.choices.length > 1 && !run.finalType) run.forks.push({
      slot:run.slot,eventId:event.id,title:event.title,choiceId:choice.id,action:choice.label,point:run.checkpoint
    });
    run.checkpoint = null;
    run.committed = true;
    run.stage = 'result';
    run.result = {fact,deltas:Object.fromEntries(Object.keys(before).filter(id => run.stats[id] !== before[id]).map(id => [id,run.stats[id]-before[id]]))};
    if (run.slot === 46) run.selectedMemory = run.draft.memory.filter(id => held(run.items[id])).slice(0,3);
    if (run.finalType === 'early' && run.goodbye === 'item') run.selectedMemory = Object.keys(run.items).filter(id => held(run.items[id])).slice(0,1);
    return true;
  }

  function candidateForks(run) {
    const meaningful = [40,36,33,28,23,14,44,11,2];
    return run.forks.filter(fork => meaningful.includes(fork.slot) && fork.slot < run.slot)
      .sort((a,b) => meaningful.indexOf(a.slot)-meaningful.indexOf(b.slot)).slice(0,5).sort((a,b) => a.slot-b.slot);
  }

  function memoir(run) {
    const kind = run.finalType || 'natural';
    const originName = C.origins.find(item => item.id === run.birth).name;
    const career = run.careerLog.map(record => job(record.to)).filter((name,index,all) => index === 0 || name !== all[index-1]);
    const timeline = run.facts.filter(fact => fact.important || fact.highlights.length || fact.careerAfter !== fact.careerBefore);
    const token = (run.selectedMemory ?? []).filter(id => held(run.items[id]));
    const priority = fact => Number(fact.items.some(id => token.includes(id)))*5 + fact.highlights.length*3 + Number(fact.careerAfter !== fact.careerBefore)*2
      + Number(!!fact.relations?.some(relation => relation.status === 'lost' || relation.status === 'reconnected'))*2;
    const chosen = [...timeline].sort((a,b) => priority(b)-priority(a) || a.slot-b.slot).slice(0,5);
    const last = run.facts.at(-1);
    if (last && !chosen.includes(last)) chosen.push(last);
    const narrators = Object.entries(run.people).filter(([,person]) => person.status === 'in-touch' && person.seasons >= 2)
      .sort(([,a],[,b]) => (b.last-b.first)-(a.last-a.first) || b.seasons-a.seasons);
    const [person] = narrators[0] ?? [];
    const shared = run.facts.findLast(fact => fact.people.includes(person));
    const memoryVoice={friend:'后来我们说起那年，我总会先想起你',colleague:'那一班的事我还记得，你',
      parent:'你大概没留意，我一直记得你',coach:'那些年一起练过，我还记得你',player:'我是从作品认识你的。那回，你'};
    const memoryText=shared ? (memoryVoice[person]??'我还记得你')+'「'+shared.action+'」。'+
      (shared.postcard==='yearbook'?'那只歪耳朵的猫，我现在都认得。':'') : last?.text??'今天把这一页留下来。';
    const title = kind === 'early' ? '窗边最后一点光' : kind === 'open' ? '还有几件小事' : token.includes('lamp') ? '灯照过的地方' : '把这一页留着';
    const latestWish = run.wishLog.findLast(wish => wish.status === 'done' || wish.status === 'unfinished' || wish.status === 'paused');
    const line = run.highlights.world ? '命运会反复出题，直到你给出新的答案。'
      : kind === 'early' ? '窗外还有光。那一天过去得很慢。'
      : latestWish?.status === 'done' ? '「'+C.wishes[latestWish.id]+'」曾经是一桩想做的事。做到的那一天，你是怎么记住的？'
      : latestWish ? '你记得自己曾想「'+C.wishes[latestWish.id]+'」。那一页和后来的日子都还在。'
      : token.length ? '手边有件旧东西。还记得它是什么时候放到这里的吗？'
      : kind === 'open' ? '手里的事还有下一步。今天先把窗留着。' : '有些事是当时做的，有些回声是后来才听见的。';
    const portrait = career.length ? '后来做过的事，从'+career.join('，到')+'。' : '那时，很多事还只是想过。';
    return {
      kind,title,line,token,origin:originName,career,age:age(run),summary:'六岁那年，你以「'+originName+'」的身份开始自己的故事。'+portrait+(last ? '最后，你选择了「'+last.action+'」。' : ''),
      timeline:chosen.sort((a,b) => a.slot-b.slot),
      related:shared ? {person:C.people[person],text:memoryText,event:shared.title,age:shared.age} : {person:'这一本·自述',text:last?.text ?? '今天把这一页留下来。'},
      highlights:Object.values(run.highlights),forks:candidateForks(run).map(({point,...fork}) => fork)
    };
  }

  function advance(run) {
    if (run.stage !== 'result') return false;
    if (run.finalType === 'early' || run.slot === 46) {
      run.memo = memoir(run);
      run.stage = 'memoir';
      return true;
    }
    prepare(run,run.slot+1);
    return true;
  }

  function fork(run,slot) {
    const record = run.memo && candidateForks(run).find(fork => fork.slot === slot);
    if (!record) return null;
    const state = copy(record.point);
    return {
      ...state,stage:'event',draft:emptyDraft(),activity:null,entered:false,committed:false,
      facts:copy(run.facts.filter(fact => fact.slot < slot)),forks:copy(run.forks.filter(fork => fork.slot < slot)),
      checkpoint:copy(record.point),result:null
    };
  }

  function nearby(tiles,index) {
    const value = tiles[index], seen = new Set([index]), queue = [index];
    for (let i = 0; i < queue.length; i++) {
      const cell = queue[i], adjacent = [cell-6,cell+6];
      if (cell%6) adjacent.push(cell-1);
      if (cell%6 < 5) adjacent.push(cell+1);
      for (const next of adjacent) if (tiles[next] === value && !seen.has(next)) { seen.add(next); queue.push(next); }
    }
    return queue;
  }

  function puzzleTile(puzzle) {
    return hash(puzzle.seed,puzzle.step++)%5;
  }

  function ensureMoves(puzzle) {
    if (!puzzle.tiles.some((_,index) => nearby(puzzle.tiles,index).length > 1)) puzzle.tiles[1] = puzzle.tiles[0];
  }

  function beginActivity(run,kind,now=Date.now()) {
    const allowed = (kind === 'study' && run.slot === 12) || (kind === 'duel' && [4,29].includes(run.slot));
    if (!allowed || run.committed || run.minigame?.slot === run.slot || run.activity) return false;
    const activity = {kind,seed:hash(run.historyKey,kind),step:0};
    if (kind === 'study') {
      activity.deadline = now+30000;
      activity.cleared = 0;
      activity.tiles = Array.from({length:42},() => puzzleTile(activity));
      ensureMoves(activity);
    } else activity.rounds = [];
    run.activity = activity;
    return true;
  }

  function activityMove(run,move,now=Date.now()) {
    const a = run.activity;
    if (!a) return false;
    if (a.kind === 'study') {
      if (move === 'finish' || now >= a.deadline) {
        run.minigame = {kind:a.kind,slot:run.slot,bonus:Math.min(12,Math.floor(a.cleared/4))};
        run.activity = null;
        return true;
      }
      if (!Number.isInteger(move) || move < 0 || move >= 42) return false;
      const group = nearby(a.tiles,move);
      if (group.length < 2) return false;
      for (const index of group) a.tiles[index] = null;
      for (let column=0;column<6;column++) {
        const kept = [];
        for (let row=0;row<7;row++) if (a.tiles[row*6+column] !== null) kept.push(a.tiles[row*6+column]);
        const tiles = Array.from({length:7-kept.length},() => puzzleTile(a)).concat(kept);
        tiles.forEach((tile,row) => { a.tiles[row*6+column] = tile; });
      }
      a.cleared += group.length;
      ensureMoves(a);
      return true;
    }
    if (!['humor','listen','reply','leave','dish'].includes(move) && !(typeof move==='string' && move.startsWith('fact-') && run.facts.some(f=>'fact-'+f.slot===move))) return false;
    a.rounds.push(move);
    if (a.rounds.length === 3 || move === 'leave' || move==='dish' && a.rounds.length>1) {
      run.minigame = {kind:a.kind,slot:run.slot,rounds:[...a.rounds]};
      run.activity = null;
    }
    return true;
  }

  function claimEnding(tree,run) {
    if (run.scenario !== 'life' || !run.memo || tree.reward) return 0;
    tree.reward = true;
    return 1;
  }

  return {claimEnding,attributes,age,stage,room,energy,job,origin,held,currentCard,preview,packingPlan,chooseDayExtra,placeItem,mainCost,canApply,create,commit,advance,fork,beginActivity,activityMove,nearby,hash,copy,modify,emptyDraft};
})();
