'use strict';

(() => {
  const C = globalThis.LifeContent, E = globalThis.LifeEngine, S = globalThis.LifeScenes, A = globalThis.LifeAudio;
  const root = document.querySelector('#app');
  const announcement = document.querySelector('#announcement');
  const save = globalThis.LifeSave, key = save.key;
  const places = ['小时候的家','青年住处','中晚年的家'];
  const labels = {lamp:'桌上的旧台灯',console:'借来的游戏机',letter:'桌上的志愿简章',badge:'桌上的岗位单',box:'桌边的纸箱',phone:'手机上的新消息',planner:'摊开的日程本',album:'架上的相册'};
  const states = {display:'摆在房间',stored:'收在箱中',given:'已经赠出',discarded:'已经丢弃'};
  const signs = ['语','数','英','理','化'];
  const animatedItems = ['console','letter','box','album','phone','planner'];
  const experienceName = id => C.experience[id][0];
  const price = value => new Intl.NumberFormat('zh-CN').format(value);
  const esc = (value='') => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const button = (name,action,id='',cls='',attributes='') =>
    '<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+esc(id)+'" '+attributes+'>'+esc(name)+'</button>';
  const token = () => globalThis.crypto?.getRandomValues
    ? Array.from(crypto.getRandomValues(new Uint32Array(2)),value => value.toString(36)).join('-') : Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  let saving = true;
  function read() {
    try {
      return save.read(localStorage);
    } catch {
      saving = false;
      return null;
    }
  }
  let data = read() ?? save.fresh();
  let page = 'home', selected = data.active, modal = null, memoPage = 0, compare = '', notice = '', setup = null;
  let testBranch = null, modalReturn = null, packingFocus = null;
  const entry = () => selected === 'test' ? testBranch : data.branches[selected];
  const nowRun = () => entry()?.run;
  let activeTurn = null;

  function measure(id, amount=1) {
    if (selected==='test') return;
    data.playtest ??= {counts:{},turnMs:0};
    data.playtest.counts[id]=(data.playtest.counts[id]??0)+amount;
  }

  function persist() {
    data.revision = token();
    try { save.write(localStorage,data); saving = true; }
    catch { saving = false; }
  }

  function edit(action) {
    const expected = data.revision;
    const transact = () => {
      const saved = saving ? read() : null;
      if (saved && saved.revision !== expected) {
        data = saved;
        notice = '另一窗口已保存进度。请重新确认这一步。';
        render(true);
        return;
      }
      action();
    };
    if (navigator.locks?.request && saving) {
      let started = false;
      navigator.locks.request(key,() => { started = true; transact(); }).catch(error => {
        if (started) console.error(error);
        else transact();
      });
    } else transact();
  }

  window.addEventListener('storage',event => {
    if (event.key !== key || !saving) return;
    const incoming = read();
    if (!incoming || incoming.revision === data.revision) return;
    data = incoming;
    if (selected !== 'test') {
      if (!entry()) { page='home'; selected=data.active; }
      render(true);
    }
  });

  function heading(kicker,title,body='') {
    return '<div class="heading"><p class="kicker">'+esc(kicker)+'</p><h1 tabindex="-1">'+esc(title)+'</h1>'+(body ? '<p class="intro">'+esc(body)+'</p>' : '')+'</div>';
  }

  function header() {
    return '<header class="top"><div class="top-inner"><button type="button" class="brand" data-action="home"><span class="stamp">生</span><span>这辈子<small>人生工作台</small></span></button><nav aria-label="主导航">'+
      button('生活','resume','','nav-btn',page === 'home' || page === 'play' ? 'aria-current="page"' : '')+
      button('人生年轮','archive','','nav-btn',page === 'archive' ? 'aria-current="page"' : '')+
      button('设置','settings','','nav-btn')+'</nav></div></header>';
  }

  // Objects in the room carry the actual event choice. Long-term decisions still use the workbench.
  const roomObjects={
    3:['积木','冰棍','车票'],4:['纸飞机','饭勺','空碗'],6:['破球网','备用球','午休椅'],
    8:['广播话筒','木板','雨伞'],10:['排练本','投影机','跑鞋'],12:['练习册','窗边','饭票'],
    13:['错题本','同学','书袋'],15:['班表','工具','电话'],17:['电脑','合照','语音'],
    18:['机房钥匙','摊车','登记册'],19:['测试机','招工单','联络簿'],21:['简历','工位图','街区图'],
    22:['明信片','磁盘','慢车票'],24:['存折','饭桌','日历'],25:['欠条','空座','班表'],
    27:['笔记本','新同事','工具台'],29:['排班表','朋友留言','日历'],32:['交接本','培训表','工作桌'],
    35:['存折','同事电话','账本'],37:['班表','站点地图','交接本'],38:['抽屉','旧信','抹布'],
    39:['新人','清单','工位'],41:['日历','通讯录','旧提案'],43:['排班表','小项目','通讯录'],45:['地图','信纸','锅铲']
  };
  function roomTargets(run,event){
    return event?.id==='life-'+run.slot && roomObjects[run.slot];
  }
  function objectActions(run,event){
    const names=roomTargets(run,event);
    if(!names||run.activity||run.stage!=='event')return '';
    const picked=event.choices.find(c=>c.id===run.draft.objectFocus);
    const action=picked?button(picked.label,'do-object',picked.id,'object-verb'):'';
    return '<div class="room-actions">'+event.choices.map((choice,i)=>button(run.slot===8 && i===1 && event.choices[i].label!=='找一块旧木板'?event.choices[i].label:names[i],'touch-object',choice.id,'room-action',picked===choice?'aria-pressed="true"':'' )).join('')+action+'</div>';
  }

  function scene(run=null,hero=false) {
    const index = run ? E.room(run.slot) : 0;
    const cover = run ? E.currentCard(run) : null;
    const available = run?.stage === 'event' && cover?.hotspot && !run.entered;
    const displayed = run ? Object.entries(run.items).filter(([,item]) => item.state === 'display')
      .sort(([id,a],[other,b]) => Number(['lamp','console'].includes(other))-Number(['lamp','console'].includes(id)) || b.last-a.last).slice(0,5) : [];
    const hotspot = available ? '<button class="hotspot" type="button" data-action="enter" data-id="'+cover.hotspot+'">'+S.sprite(cover.hotspot,'prop',['lamp','phone'].includes(cover.hotspot)?'loop':'')+'<span>'+esc(labels[cover.hotspot])+'</span></button>' : '';
    const response=run?.stage==='result'?run.result.fact:null;
    const passing=response && /递|转送|交给|夹菜|寄出|借出/.test(response.text) || run?.activity?.rounds?.at(-1)==='dish';
    const actor=['child','adult','elder'][index]+(passing?'-pass':'');
    const props = displayed.map(([id],i) => '<button type="button" class="room-prop" style="--place:'+i+'" data-action="item" data-id="'+id+'" aria-label="'+esc(C.items[id][0])+'" title="'+esc(C.items[id][0])+'">'+S.sprite(C.items[id][2],'prop',id==='lamp'?'loop':'')+'</button>').join('');
    const lampActions=available && run.slot===2?'<div class="lamp-actions">'+cover.choices.slice(0,2).map((c,i)=>button(cover.title==='台灯接触不好'?['递螺丝刀','挪到插座旁'][i]:c.label,'lamp-act',c.id,'chip')).join('')+'</div>':'';
    return '<figure class="scene scene-'+index+(hero?' hero-scene':'')+(run?.activity?.kind==='duel'?' dinner-scene':'')+'"><div class="scene-image"></div><div class="scene-shade"></div>'+
      '<figcaption><span class="scene-dot"></span>'+esc(run ? places[index] : '从小时候的家开始')+'</figcaption>'+
      S.sprite(['dust','rain','leaves'][index],'window-effect','loop')+
      (index!==1 ? S.sprite('light','light-effect','loop') : '')+
      (run || hero ? '<div class="resident">'+S.sprite(actor,'',passing?'once':'loop')+'</div>' : '')+
      (response?'<div class="room-response">'+esc(response.text.split(/[。！]/)[0])+'</div>':'')+
      '<div class="desk-items">'+props+'</div>'+hotspot+lampActions+(run?objectActions(run,cover):'')+
      (run && Object.values(run.items).some(item=>item.state==='stored')?button('翻找旧物','drawer','','drawer-handle'):'')+
      (run?.activity?.kind==='duel'?activities(run):'')+
      (run?.career ? '<span class="job-in-room">'+esc(E.job(run.career))+'</span>' : '')+'</figure>';
  }

  function home() {
    const active = data.branches[data.active]?.run;
    return '<main class="home layout">'+scene(null,true)+'<section class="surface start-panel">'+
      heading('人生模拟 · 独立试玩版','这辈子','从第一张课桌到晚年手边的相册。你留下的东西，会在后来的日子里等你。')+
      '<div class="start-actions">'+(active ? button(active.memo?'查看上一次回忆录':'续玩 · '+E.age(active)+' 岁','resume','','primary wide') : button('开始新的人生','setup','','primary wide'))+
      (active ? button('开启新的一世','setup','','secondary wide') : '')+button('翻看人生年轮','archive','','secondary wide')+'</div>'+
      '<footer class="quiet-line">46 回合 · 六种出身 · '+(saving ? '本地自动存档' : '当前会话可玩')+'</footer></section>'+
      '<footer class="home-footer"><a href="../full/index.html">打开 v1.2 试玩与路线对照 ↗</a></footer></main>';
  }

  function setupPage() {
    const total = Object.values(setup.points).reduce((a,b)=>a+b,0);
    return '<main class="narrow"><section class="surface">'+heading('新的出生','在这里开始',E.origin(setup.seed).text)+
      '<div class="birth-note">'+S.sprite('child','portrait')+'<div><span class="kicker">这次的出身</span><strong>'+esc(E.origin(setup.seed).name)+'</strong></div></div>'+
      (data.points ? '<h2>分配自由点</h2><p class="fine">可用 '+price(data.points)+' 点，本次选了 '+total+' / '+Math.min(data.points,6)+' 点。</p><div class="attribute-list">'+
      E.attributes.map(id => '<div><span>'+C.labels[id]+'</span>'+button('−','point-down',id,'step','aria-label="减少'+C.labels[id]+'"')+'<strong>'+(setup.points[id]??0)+'</strong>'+button('＋','point-up',id,'step','aria-label="增加'+C.labels[id]+'"')+'</div>').join('')+'</div>' : '')+
      (data.talents.length ? '<label class="talent">带入一个结局天赋<select data-input="talent"><option value="">暂不携带</option>'+data.talents.map(id=>'<option value="'+id+'" '+(setup.talent===id?'selected':'')+'>'+esc(C.talents[id][0]+' · '+C.talents[id][1])+'</option>').join('')+'</select></label>' : '')+
      '<div class="actions">'+button('开始这段生活','birth','','primary')+button('返回','home','','secondary')+'</div></section></main>';
  }

  function resources(run) {
    return '<div class="life-hud"><div><span class="kicker">'+E.stage(run.slot)+' · 第 '+run.slot+' / 46 回合</span><span class="age">'+E.age(run)+'<small> 岁</small></span></div><div class="pills"><span>精力 '+E.energy(run)+'</span><span>¥ '+price(run.stats.money)+'</span><span'+(run.stats.stress>=60?' class="caution"':'')+'>压力 '+run.stats.stress+'</span></div></div>'+
      '<div class="progress" role="progressbar" aria-label="人生进度" aria-valuemin="0" aria-valuemax="46" aria-valuenow="'+run.slot+'"><i style="--progress:'+run.slot/46*100+'%"></i></div>';
  }

  function tools(run) {
    const counts = Object.values(run.items).filter(E.held).length;
    return '<div class="shelf-actions">'+button('物件 '+counts,'objects','','small')+button('履历','history','','small')+(run.eventId==='life-3'?'':button('我能做什么？','help','','small'))+button('六维与状态','stats','','small')+'</div>'+
      (run.wish ? '<p class="wish"><span>心愿</span> '+esc(C.wishes[run.wish.id])+' <small>· '+({active:'在做',done:'已达成',unfinished:'未竟',paused:'已搁置'}[run.wish.status])+'</small></p>' : '');
  }

  function choices(run,event) {
    const family = C.familySlots.includes(run.slot);
    const drag = !!event.hotspot;
    return '<div class="choices" aria-label="'+(drag?'安排主投入':'选择当期行动')+'">'+event.choices.map((choice,index) =>
      '<button type="button" class="choice" '+(drag?'draggable="true" ':'')+'data-action="choose" data-id="'+choice.id+'" aria-pressed="'+(run.draft.main===choice.id)+'"><span class="choice-key">'+(index+1)+'</span><span>'+esc(choice.label)+'</span>'+(drag?'<span class="choice-arrow drag-grip" aria-hidden="true">⠿</span>':'<span class="choice-arrow">→</span>')+'</button>').join('')+'</div>'+
      (family ? '<details class="family" '+(run.draft.parent===null?'open':'')+'><summary>听听家里的想法'+(run.draft.parent!==null?' · 已选择':'')+'</summary><p class="fine">家里也在权衡钱和时间。先从家里选一种回应，再做自己的决定。</p><div class="groups">'+
        ['提醒现实开支','愿意实际帮一点','先听你的考虑'].map((label,index)=>button(label,'parent',index,'chip','aria-pressed="'+(run.draft.parent===index)+'"')).join('')+'</div></details>' : '');
  }

  function dayPlanner(event,plan) {
    const day=plan.day;
    const first=plan.choice?.label ?? '待安排';
    const second=day.mainBlocks===2 ? '由主要安排占用' : day.extra?.label ?? '留空';
    const tiles=event.choices.map((choice,i)=>
      '<button type="button" class="day-card" draggable="true" data-action="choose" data-id="'+choice.id+
      '" aria-pressed="'+(plan.choice?.id===choice.id)+'">'+S.sprite(day.icons[i])+
      '<strong data-drag-label>'+esc(choice.label)+'</strong><small>'+day.costs[i]+' 格</small>'+
      '<span class="drag-grip" aria-hidden="true">⠿</span></button>').join('');
    const extras=day.mainBlocks===1 ? '<div class="day-extras" aria-label="安排剩下的一格">'+day.extras.map(card=>
      '<button type="button" class="day-extra" data-action="day-extra" data-id="'+card.id+'" aria-pressed="'+
      (day.extra?.id===card.id)+'">'+S.sprite(card.sprite)+'<span>'+esc(card.label)+'</span><small>'+
      esc([effectLabels(card.delta),...card.commands.map(command=>command.startsWith('exp:')?'获得'+experienceName(command.split(':')[1]):'留下共同经历')].join(' · '))+
      '</small></button>').join('')+'</div>' : '';
    return '<section class="day-plan"><div class="bench-top"><h2>'+esc(day.label)+'</h2><span>'+day.used+' / 2 格</span></div>'+
      '<div class="day-track" data-drop="main" aria-label="日程"><div class="'+(plan.choice?'scheduled':'')+
      '"><small>第一格</small><strong>'+esc(first)+'</strong></div><div class="'+(day.used===2?'scheduled':'')+
      '"><small>第二格</small><strong>'+esc(second)+'</strong></div></div>'+
      '<p class="fine">'+(day.mainBlocks===2?'这项安排占用两格。':day.mainBlocks===1?'还有一格可安排，也可以留空。':'点选或拖动一张卡到日程。')+'</p>'+
      '<div class="day-cards">'+tiles+'</div>'+extras+'</section>';
  }

  const packingPlaces = {
    keep:['摆在床头','planner'],store:['收进抽屉','box'],give:['送给别人','letter'],discard:['丢弃','badge']
  };

  function packingBoard(run,items) {
    const picked=items.some(([id])=>id===packingFocus)?packingFocus:null;
    const fallback=E.preview(run).choice?.commands.find(command=>command.startsWith('moveitems:'))?.split(':')[1];
    const destinations=E.packingPlan(run,fallback);
    const bedside=items.find(([id])=>destinations[id]==='keep');
    const objects=items.map(([id])=>
      '<button type="button" class="pack-item" draggable="true" data-action="pack-item" data-id="'+id+
      '" aria-pressed="'+(picked===id)+'">'+S.sprite(C.items[id][2])+'<strong data-drag-label>'+esc(C.items[id][0])+
      '</strong><small>'+esc(packingPlaces[destinations[id]]?.[0]??'随主安排')+
      '</small><span class="drag-grip" aria-hidden="true">⠿</span></button>').join('');
    return '<section class="packing-board"><h3>新家的床头</h3><div class="bedside-preview">'+(bedside?S.sprite(C.items[bedside[0]][2])+esc(C.items[bedside[0]][0]):'床头空着')+'</div><p class="fine">'+
      (picked?'已选 '+esc(C.items[picked][0])+'，再点它的去处。':'左右翻看旧物，点选后选去处。床头只有一格，收起的东西还能翻找。')+
      '</p><div class="packing-objects">'+objects+'</div><div class="packing-zones">'+Object.entries(packingPlaces).map(([id,[label,sprite]])=>{
        const group=items.filter(([key])=>destinations[key]===id);
        return '<div class="packing-zone" data-drop="'+id+'"><button type="button" data-action="pack-place" data-id="'+id+
          '" '+(picked?'':'disabled')+'>'+S.sprite(sprite)+'<strong>'+label+'</strong><small>'+group.length+' 件</small></button>'+
          (group.length?'<div class="packed-preview" aria-label="'+esc(group.map(([key])=>C.items[key][0]).join('、'))+'">'+
          group.map(([key])=>S.sprite(C.items[key][2])).join('')+'</div>':'')+'</div>';
      }).join('')+'</div>'+
      (picked&&run.draft.items[picked]?button('这件物品随主安排','pack-place','default','chip'):'')+'</section>';
  }

  function itemPlanner(run) {
    if (run.slot !== 28 && run.slot !== 46) return '';
    const items = Object.entries(run.items).filter(([,item])=>E.held(item));
    if (!items.length) return '<p class="fine">'+(run.slot===28?'这次没有旧物需要整理。':'纪念盒可以空着。')+'</p>';
    if (run.slot === 46) {
      return '<section class="small-section"><h3>放进纪念盒 · '+run.draft.memory.length+' / 3</h3><div class="groups">'+items.map(([id])=>
        '<button class="pack-item" data-action="memory" data-id="'+esc(id)+'" aria-pressed="'+run.draft.memory.includes(id)+'">'+S.sprite(C.items[id][2])+esc(C.items[id][0])+'</button>').join('')+'</div></section>';
    }
    return packingBoard(run,items);
  }

  function wishPicker(run,plan) {
    if (!plan.wish && !run.wish) return '';
    return '<div class="small-section wish-picker"><span>'+(plan.wish?'这次可以立下的心愿':'手边的心愿')+'</span><div class="groups">'+
      (plan.wish ? button(C.wishes[plan.wish],'wish','take','chip','aria-pressed="'+(run.draft.wish==='take')+'"') : '')+
      button(run.wish?.status==='active'?'先搁置当前心愿':'先不决定','wish',run.wish?.status==='active'?'pause':'skip','chip','aria-pressed="'+['pause','skip'].includes(run.draft.wish)+'"')+'</div></div>';
  }

  function effectLabels(delta) {
    return Object.entries(delta).map(([id,value])=>C.labels[id]+' '+(value>0?'+':'−')+price(Math.abs(value))).join(' · ');
  }

  function previewText(run,event,choice,day=null) {
    const then = {
      14:'志愿有结果前，先做好备选的准备。',
      23:'新的岗位将改变通勤、收入和后续机会。',
      28:'留下的物件可以在以后使用。转送与丢弃会腾出桌上的位置。',
      33:'你优先推进这项安排，其他机会可能要延期。',
      36:'准备会改变接下来的负担，实际结果还要看当时的处境。',
      40:'接下来可遇见的工作、同事和生活节奏会随之变化。',
      44:'这件事可能会被后来的人记住。',
      46:'选择会影响回忆录记录的最后一页。'
    };
    const after={...run.stats};
    const base={...choice.delta};
    if(run.stats.stress>=60)for(const id of E.attributes)if(base[id]>0)base[id]=Math.floor(base[id]*.8);
    E.modify(after,base);
    if(day?.extra) E.modify(after,day.extra.delta);
    for(const id of run.draft.support)E.modify(after,C.supports[id][3]);
    if(run.draft.experience)E.modify(after,C.experience[run.draft.experience][2]);
    for(const id of choice.commands){
      if(id==='project:sketch')E.modify(after,{money:-150,stress:2});
      if(id==='project:polish'||id==='project:repair')E.modify(after,{money:-450,stress:3});
    }
    const change=effectLabels(Object.fromEntries(Object.keys(after).filter(id=>after[id]!==run.stats[id]).map(id=>[id,after[id]-run.stats[id]])));
    return '<div class="plan-preview"><strong>'+esc(day?'日程预计影响':choice.label)+'</strong>'+
      (day?'':'<p>'+esc(then[run.slot]??'这项安排会改变现在的资源和当期结果。')+'</p>')+
      '<small>'+esc(change)+'</small></div>';
  }

  function optionsConsequences(plan) {
    if (!plan.opportunities?.length) return '';
    return '<ul class="opportunities" aria-label="机会去向">'+plan.opportunities.map(option=>
      '<li><strong>'+esc(option.title)+'</strong><span>'+esc(option.status)+'</span><p>'+esc(option.detail)+'</p></li>').join('')+'</ul>';
  }

  function reusePicker(run,plan) {
    if (!plan.reuse?.length) return '';
    return '<section class="small-section"><h3>哪件旧物要重新摆出来？</h3><div class="groups">'+plan.reuse.map(id=>
      button(C.items[id][0],'reuse',id,'chip','aria-pressed="'+((plan.reuseSelected??run.draft.reuse)===id)+'"')).join('')+'</div></section>';
  }

  function workbench(run,event,plan) {

    const reorder = event.id === 'arena-tactics' && plan.choice;
    const cards = ['先看对手习惯','对齐队伍位置','给替补留余地'];
    const invitations=run.slot===33 && event.choices.some(choice=>choice.commands.some(cmd=>cmd.startsWith('priority:')));
    const allocation=invitations?'<div class="calendar-slot" data-drop="main"><strong>周六下午 · 一个时段</strong><span>'+esc(plan.choice?.label??'点选邀约或拖到这里')+'</span></div>':
      '<div class="drop-slot" data-drop="main"><div><span>主时段</span><strong>'+esc(plan.choice?.label??'点选或拖入一项安排')+
      '</strong></div><small>'+E.mainCost(run)+' 精力</small></div>';
    return '<div class="bench"><div class="bench-top"><h2>把这一段日子排好</h2><span>'+plan.used+' / '+E.energy(run)+' 精力</span></div>'+
      allocation+choices(run,event)+
      (plan.choice ? previewText(run,event,plan.choice)+optionsConsequences(plan)+reusePicker(run,plan) : '')+
      (reorder ? '<div class="small-section"><h3>安排战术顺序</h3><div class="groups">'+cards.map((name,i)=>button(name,'order',i,'chip','aria-pressed="'+run.draft.order.includes(i)+'"')).join('')+'</div><p class="fine">'+esc(run.draft.order.map(i=>cards[i]).join(' → ') || '先排的战术决定开局侧重点。')+'</p></div>' : '')+
      (plan.choice ? '<div class="small-section"><h3>把余力留给</h3><div class="groups">'+Object.entries(C.supports).filter(([id])=>id!=='experience'&&(id!=='money'||run.slot>=23)).map(([id,[text,cost]])=>
        button(text+' · '+cost,'support',id,'chip','aria-pressed="'+run.draft.support.includes(id)+'" '+(plan.remaining<cost&&!run.draft.support.includes(id)?'disabled':''))
      ).join('')+'</div></div>' : '')+
      (plan.choice && plan.options.length ? '<details class="small-section" '+(run.draft.experience?'open':'')+'><summary>调用经历 · 1 精力</summary><div class="groups">'+plan.options.map(id=>
        button(experienceName(id),'experience',id,'chip','aria-pressed="'+(run.draft.experience===id)+'" '+(plan.remaining<1&&!run.draft.experience?'disabled':''))
      ).join('')+'</div>'+(run.draft.experience?'<p class="fine">'+esc(C.experience[run.draft.experience][1])+'</p>':'')+'</details>' : '')+
      itemPlanner(run)+'</div>';
  }

  function activities(run) {
    if (run.activity?.kind === 'study') {
      return '<div class="activity"><h2>课前练习 <span id="timer">'+Math.max(0,Math.ceil((run.activity.deadline-Date.now())/1000))+' 秒</span></h2><p class="fine">点相邻同科的题块分组清除。</p><div class="puzzle">'+
        run.activity.tiles.map((cell,index)=>button(signs[cell],'tile',index,'tile tile-'+cell,'aria-label="第 '+(index+1)+' 格 '+signs[cell]+'科"')).join('')+'</div>'+button('结束练习','activity-move','finish','secondary wide')+'</div>';
    }
    if (run.activity?.kind === 'duel') {
      const last=run.activity.rounds.at(-1);
      const response=last?.startsWith('fact-')?'大家看向你。有人记起那时候的事，轻声问：后来呢？':last==='listen'?'他抬起头，终于讲到了自己喜欢的那门课。':last==='dish'?'转盘慢下来，有人接过菜，话题也松了。':
        last==='humor'?'大家笑起来。有人看向你，等你接着说。':last?'话题转到了你身上。还有人等着把话说完。':'他放下筷子，像是有话没说完。';
      const memories=run.facts.filter(f=>f.important||f.saved).slice(-3);
      if(!memories.length && run.facts.length)memories.push(run.facts.at(-1));
      const moves=[['listen','听他说'],['dish','转一道菜'],['humor','讲个糗事']];
      const recall='<details class="dinner-memories"><summary>说起一段往事</summary>'+memories.map(f=>button(f.age+' 岁 · '+f.action,'activity-move','fact-'+f.slot,'chip')).join('')+'</details>';
      moves.push(['leave','继续吃饭']);
      return '<div class="activity"><h2>饭桌接话</h2><p>'+esc(response)+'</p>'+(last?'':'<small>点带字的人或物，接这一拍。</small>')+'<div class="groups">'+moves.map(([id,label])=>button(label,'activity-move',id,'chip')).join('')+'</div>'+(memories.length?recall:'')+'</div>';
    }
    if (run.minigame?.slot === run.slot) return '<p class="fine">已完成'+(run.minigame.kind==='study'?'练习 · 知识 +'+run.minigame.bonus:'饭桌互动')+'，可继续安排当期的事。</p>';
    return run.slot===12 ? button('做一次课前练习 · 最多 30 秒','activity','study','secondary wide') :
      [4,29].includes(run.slot) ? button('坐下来聊几句','activity','duel','secondary wide') : '';
  }

  function eventPanel(run) {
    const event = E.currentCard(run);
    const origin = C.origins.find(item=>item.id===run.birth);
    const oldMessage=run.slot===42 && E.held(run.items.yearbook) && run.people.friend?.status==='in-touch'?'<p class="echo">阿宁发来一句：“你还记得毕业时画的那只猫吗？”</p>':'';
    const birthText = run.slot===1 ? '<p class="birth-context">'+esc(origin.name+' · '+origin.text)+'</p>' : '';
    const school = run.slot===15 && run.admission ? '<p class="birth-context">'+esc(run.admission.name)+'</p>' : '';
    const risk = event.risk ?? (run.slot===36?'继续维持原有安排会累积负担。也可以先交接、调整投入或休息。':'');
    if (event.hotspot && !run.entered) {
      return '<section class="surface event-panel">'+heading('当期的消息',event.title,event.body)+
        (risk?'<p class="risk"><strong>风险提示</strong> '+esc(risk)+'</p>':'')+'</section>';
    }
    const plan = E.preview(run);
    return '<section class="surface event-panel">'+heading(event.hotspot?'人生工作台':'当期的消息',event.title,event.body)+birthText+school+oldMessage+
      (risk?'<p class="risk"><strong>风险提示</strong> '+esc(risk)+'</p>':'')+
      (run.entered&&event.hotspot?'<div class="interaction-flash">'+S.sprite(event.hotspot,'large-sprite',animatedItems.includes(event.hotspot)?'once':event.hotspot==='lamp'?'loop':'')+'</div>':'')+
      (run.activity?.kind==='duel'?'':activities(run))+(!run.activity ? (event.hotspot?workbench(run,event,plan):plan.day?dayPlanner(event,plan):roomTargets(run,event)?'<p class="fine">轻点房间里的物件，看看手边能做什么。</p>':choices(run,event))+wishPicker(run,plan)+
      (plan.choice && !event.hotspot ? previewText(run,event,plan.choice,plan.day)+optionsConsequences(plan)+reusePicker(run,plan) : '') : '')+'</section>';
  }

  function resultPanel(run) {
    const {fact,deltas} = run.result;
    return '<section class="surface event-panel">'+heading('这一次之后',fact.action,fact.text)+
      '<div class="groups changes">'+Object.entries(deltas).filter(([id])=>!['budget','expect','parentHealth','affinity'].includes(id)).map(([id,value])=>
        '<span class="tag '+(value<0?'drop':'')+'">'+esc(C.labels[id])+' '+(value>0?'+':'−')+price(Math.abs(value))+'</span>').join('')+'</div>'+
      fact.highlights.map(id=>'<div class="echo"><strong>人生高光</strong><p>'+esc(run.highlights[id].label)+'</p></div>').join('')+
      fact.echoes.map(echo=>'<div class="echo"><strong>多年回响</strong><p>'+esc(echo.text)+'</p></div>').join('')+
      ((fact.relations??[]).length?'<div class="groups">'+fact.relations.map(({id,status})=>
        '<span class="tag">'+esc(C.people[id])+' · '+esc(({met:'第一次留下交集',lost:'渐渐失联',reconnected:'重新联系'})[status])+'</span>').join('')+'</div>':'')+
      button(run.facts.at(-1)?.saved?'已留在纪念册':'留个纪念','keepsake',fact.slot,'chip',run.facts.at(-1)?.saved?'disabled':'')+
      (fact.items.length?'<div class="groups">'+fact.items.map(id=>button(C.items[id][0]+' · '+states[run.items[id].state],'item',id,'chip')).join('')+'</div>':'')+'</section>';
  }

  const guideClock = LifeGuidance.clock();
  let shopMessage='';
  let guideTimer;
  let guideView;
  let guide;

  function updateGuide(run) {
    clearTimeout(guideTimer);
    const scene = run && E.currentCard(run)?.interaction;
    if (page==='play' && scene?.sceneId==='school-shop' && run.stage==='event' && !run.draft.interaction) {
      LifeInteraction.create(run,token());
      LifeInteraction.update(run,run.draft.interaction.interactionId,'open');
    }
    guideView = scene ? LifeInteraction.preview(run) : null;
    const active = page==='play' && !document.hidden && !modal && !run?.activity;
    const timing = guideClock.sample(guideView,performance.now(),active);
    const thresholds = scene?.guidanceTiming ?? LifeGuidance.defaults;
    guide = LifeGuidance.describe(guideView,timing,thresholds);
    if (active && guide?.availableHelp && guide.hintLevel<2) {
      const deadline = guide.hintLevel===0 ? thresholds.emphasize : thresholds.explain;
      guideTimer = setTimeout(()=>render(),Math.max(1,deadline-timing.elapsed));
    }
  }

  function guidedPanel(run,event) {
    const scene = event.interaction;
    if (!guideView) return '<section class="surface">'+heading('当前目标',event.title,scene.goal)+
      button('进入情境','guide-open',event.id,'primary')+'</section>';
    if (guide.completionText) return '<section class="surface" role="status">'+esc(guide.completionText)+'</section>';
    const controls = Object.entries(scene.objects).map(([objectId,object])=>{
      const actions = guideView.allowed.filter(a=>
        (Object.hasOwn(scene.objects,a.guideObjectId) ? a.guideObjectId : a.objectId)===objectId);
      if (!actions.length) return '';
      const recommended = guide.recommendedObjectIds.includes(objectId);
      return '<div class="guide-object" data-object-id="'+esc(objectId)+'" data-recommended="'+recommended+'"><strong>'+
        esc(object.label ?? objectId)+'</strong>'+(recommended?' <small>建议查看</small>':'')+
        '<div class="groups">'+actions.map(a=>button(a.label ?? a.actionId,'guide-act',a.actionId,'chip')).join('')+'</div></div>';
    }).join('');
    return '<section class="surface event-panel" data-guide-level="'+guide.hintLevel+'">'+heading('当前目标',event.title,guide.goalText)+
      controls+'<p role="status">'+esc(guide.feedback ?? '')+'</p>'+
      (guide.hintText?'<p class="guide-hint" role="status">'+esc(guide.hintText)+'</p>':'')+
      button('我能做什么？','guide-help','','small')+
      (guideView.performed.length?button('撤回上一步','guide-undo','','secondary'):'')+
      (guideView.phase==='preview'?button('查看安排','guide-review','','secondary'):'')+
      (guideView.phase==='intro'?button('进入情境','guide-open',event.id,'primary'):'')+
      (guideView.phase==='ready'?button('确认安排','commit',event.id,'primary',E.canApply(run)?'':'disabled'):'')+'</section>';
  }

  function play(run) {
    const event = E.currentCard(run);
    if (event.interaction?.sceneId==='school-shop') return '<main class="layout play shop-layout">'+resources(run)+
      LifeShop.render(run,guideView,guide,button,esc,shopMessage)+tools(run)+(run.stage==='result'?resultPanel(run):'')+'</main>';
    if (event.interaction) return '<main class="layout play">'+resources(run)+guidedPanel(run,event)+
      (run.stage==='result'?resultPanel(run):'')+'</main>';
    return '<main class="layout play"><section class="place" aria-label="当前生活空间">'+resources(run)+scene(run)+tools(run)+'</section>'+
      (run.stage==='result'?resultPanel(run):eventPanel(run))+'</main>';
  }

  function turnFooter(run) {
    if (run.activity || run.memo) return '';
    const event = E.currentCard(run);
    if (event.interaction && run.stage==='event') return '';
    let primary, secondary = '', status = '';
    if (run.stage === 'result') {
      primary = button(run.slot===46||run.finalType==='early'?'翻开回忆录':'进入下一回合','next',run.eventId,'primary');
      if (run.slot===46 || run.finalType==='early') secondary = button('稍后翻阅','skip-memoir',run.eventId,'secondary');
    } else if (event.hotspot && !run.entered) {
      primary = button('查看'+labels[event.hotspot],'enter',event.hotspot,'primary');
    } else {
      const plan = E.preview(run);
      primary = button(event.hotspot?'确认这份安排':plan.day?'按日程行动':'确认选择','commit',event.id,'primary',E.canApply(run)?'':'disabled');
      if (event.hotspot) secondary = button('返回场景','cancel','','secondary');
      if (plan.choice && (event.hotspot||plan.day)) status = '<p class="turn-status">'+esc(plan.choice.label)+' <span>'+
        (plan.day?plan.day.used+' / 2 格':plan.used+' / '+E.energy(run)+' 精力')+'</span></p>';
    }
    return '<footer class="turn-footer" aria-label="回合操作">'+status+'<div class="turn-actions">'+secondary+primary+'</div></footer>';
  }

  function archive() {
    const trees = Object.entries(data.trees);
    const memoirs=Object.values(data.branches).filter(branch=>branch.run.memo).map(branch=>branch.run.memo);
    const highlights=[...new Set(memoirs.flatMap(memo=>memo.highlights.map(item=>item.label)))];
    const endings=[...new Set(memoirs.map(memo=>memo.title))];
    const runs=Object.values(data.branches).map(b=>b.run);
    const clues=[['esport','world','训练室里还留着你的位置。'],['school','school','错题本里有一页反复改过。'],['indie','published','有人在等下一份试玩。']]
      .filter(([thread,key])=>runs.some(r=>r.threads[thread]?.steps) && !runs.some(r=>r.highlights[key]));
    return '<main class="narrow"><section class="surface">'+heading('人生档案','人生年轮','查看走过的人生，或从已经完成的人生再做一次决定。')+
      '<p class="quiet-line">自由点余额 '+data.points+'</p>'+clues.map(([, ,hint])=>'<p class="echo">'+esc(hint)+'</p>').join('')+
      (memoirs.length?'<details class="small-section"><summary>已经留下的高光与终章</summary><h3>高光</h3><div class="groups">'+
        (highlights.length?highlights.map(label=>'<span class="tag">'+esc(label)+'</span>').join(''):'<small>目前没有单独收录的高光。</small>')+
        '</div><h3>终章</h3><div class="groups">'+endings.map(label=>'<span class="tag">'+esc(label)+'</span>').join('')+'</div></details>':'')+
      (trees.length ? trees.map(([treeId,tree]) => {
        const members=Object.entries(data.branches).filter(([,branch])=>branch.tree===treeId);
        const endings=members.filter(([,branch])=>branch.run.memo);
        return '<section class="tree"><h2>'+esc(C.origins.find(item=>item.id===tree.birth).name)+' · '+members.length+' 段人生</h2>'+
          members.map(([id,branch])=>'<article class="leaf"><div><strong>'+esc(branch.run.memo?.title??'第 '+branch.run.slot+' 回合 · '+E.age(branch.run)+' 岁')+'</strong>'+
          '<small>'+esc(branch.parent ? '从 '+C.ages[branch.from-1]+' 岁分岔' : '从 6 岁出发')+'</small></div>'+button(branch.run.memo?'翻阅':'继续','open-branch',id,'secondary')+'</article>').join('')+
          (endings.length>1?'<div class="small-section"><label for="compare">并排看两段人生</label><select id="compare" data-input="compare"><option value="">选择一段分支</option>'+
          endings.slice(1).map(([id,branch])=>'<option value="'+esc(id)+'" '+(compare===id?'selected':'')+'>'+esc(branch.run.memo.title+' · '+C.ages[branch.from-1]+' 岁分岔')+'</option>').join('')+'</select>'+
          (endings.some(([id])=>compare===id)?'<div class="comparison">'+[data.branches[data.branches[compare].parent]??endings[0][1],data.branches[compare]].map(branch=>'<div><h3>'+esc(branch.run.memo.title)+'</h3><p>'+esc(branch.run.memo.career.join(' → '))+'</p><p>'+esc(branch.run.facts.find(fact=>fact.slot===data.branches[compare].from)?.action??'')+'</p><p>'+esc(branch.run.memo.line)+'</p></div>').join('')+button('分享这两段人生','share-pair',compare,'chip')+'</div>':'')+
          '</div>':'')+'</section>';
      }).join('') : '<div class="empty"><p>第一段人生结束后，回忆录会留在这里。游玩中的进度也可以从这里继续。</p></div>')+
      '<div class="actions">'+button('开启新的一世','setup','','primary')+button('返回生活','resume','','secondary')+'</div></section></main>';
  }

  function relatedFacts(run,fact) {
    const prior=(Array.isArray(fact.sourceSlots)?fact.sourceSlots:[]).map(slot=>run.facts.find(f=>f.slot===slot)).filter(Boolean);
    return '<details><summary>看看来路</summary><p>'+esc(fact.text)+'</p>'+prior.map(f=>'<p>'+esc(f.age)+' 岁 · '+esc(f.title)+' · '+esc(f.action)+'</p>').join('')+'</details>';
  }

  function memories(run) {
    return run.facts.filter(f=>f.saved).map(f=>'<article><strong>'+f.age+' 岁 · '+esc(f.title)+'</strong><p>'+esc(f.text)+'</p>'+button('分享这一刻','share-memory',f.slot,'chip')+'</article>').join('');
  }

  function memoirPage(run) {
    const memo=run.memo;
    const pages=['你成为了谁','重要时间轴','谁记得你','这一世的寄语'];
    const content=[
      '<p class="book-copy">'+esc(memo.summary)+'</p>'+memories(run)+
      (memo.highlights.length?'<div class="groups">'+memo.highlights.map(moment=>'<span class="tag">'+C.ages[moment.slot-1]+' 岁 · '+esc(moment.label)+'</span>').join('')+'</div>':'')+
      (memo.token.length?'<div class="keepsakes">'+memo.token.map(id=>button(C.items[id][0],'item',id,'chip')).join('')+'</div>':''),
      '<ol class="timeline">'+memo.timeline.map(fact=>'<li><time>'+esc(fact.age)+' 岁</time><div><strong>'+esc(fact.title)+'</strong><p>'+esc(fact.text)+'</p></div></li>').join('')+'</ol>'+button('翻阅完整履历','history','','secondary'),
      '<p class="book-copy">'+esc(memo.related.text)+'</p><p class="book-sign">— '+esc(memo.related.person)+(memo.related.age?' · '+esc(memo.related.age)+' 岁的记忆':'')+'</p>',
      '<blockquote>'+esc(memo.line)+'</blockquote><div class="groups">'+button('保存 9:16 分享卡','share','','secondary')+
      button('回到人生年轮','archive','','secondary')+'</div><h3>从过去的某一天重新出发</h3>'+
      (memo.forks.length?'<div class="forks">'+memo.forks.map(item=>'<article><div><strong>'+C.ages[item.slot-1]+' 岁 · '+esc(item.title)+'</strong><p>当时选择了「'+esc(item.action)+'」。</p></div>'+button('从这里分岔','fork-preview',item.slot,'secondary')+'</article>').join('')+'</div>':'<p class="fine">这段人生暂时没有可以重走的节点。</p>')+
      '<div class="actions">'+button('开启新的一世','setup','','secondary')+'</div>'
    ];
    return '<main class="narrow memoir"><section class="surface book">'+S.sprite('album','book-icon','once')+
      heading(({early:'提前谢幕',normal:'自然谢幕',natural:'自然谢幕',open:'开放式谢幕'})[memo.kind]+' · '+memo.age+' 岁',memo.title)+
      '<nav class="book-nav" aria-label="回忆录章节">'+pages.map((label,index)=>button(label,'memo',index,'chip',memoPage===index?'aria-current="page"':'')).join('')+'</nav>'+
      '<h2>'+pages[memoPage]+'</h2>'+content[memoPage]+
      '<div class="book-controls">'+(memoPage>0?button('← 上一页','memo',memoPage-1,'secondary'):'<span></span>')+
      (memoPage<3?button('下一页 →','memo',memoPage+1,'primary'):'')+'</div></section></main>';
  }

  function overlay(run) {
    if (!modal) return '';
    let title, body;
    if (modal.type==='settings') {
      title='设置与本地存档';
      body='<p>'+ (saving?'此浏览器会在有效操作后保存进度。':'此浏览器当前无法保存。你可以导出备份，再用它恢复进度。')+'</p>'+
        '<label class="motion-choice">像素动画<select data-input="motion">'+
        [['auto','跟随系统设置'],['on','播放动画'],['off','减少动态效果']].map(([id,label])=>'<option value="'+id+'" '+(motionPreference()===id?'selected':'')+'>'+label+'</option>').join('')+
        '</select></label><label class="switch"><input type="checkbox" data-input="sound" '+(data.sound?'checked':'')+'> 播放音乐和音效</label><p><a href="art/index.html">查看人物、物件和环境动画样片</a></p>'+
        '<div class="groups">'+button('导出 JSON 备份','export','','secondary')+'<label class="file-pick">导入 JSON 备份<input type="file" accept=".json,application/json" data-input="import"></label></div>'+
        '<p class="fine">导入会替换这个浏览器里的 v1.3.2 进度。</p><details class="small-section"><summary>独立走测</summary><p class="fine">走测只保留当前页面会话，可以复现提前谢幕。</p>'+
        button('体验提前谢幕','test','','secondary')+
        button('导出本机走测统计','playtest-export','','secondary')+'</details>';
    } else if (modal.type==='fork') {
      const point=run.memo.forks.find(item=>item.slot===modal.id);
      title='把这一段重新走过';
      body='<p>从 '+C.ages[point.slot-1]+' 岁的「'+esc(point.title)+'」开始。此前的事实与资源带入分支，原回忆录仍在年轮中。</p>'+
        button('开启平行人生','fork',point.slot,'primary');
    } else if (modal.type==='item') {
      const id=modal.id, item=run.items[id];
      if(!item) return '';
      title=C.items[id][0];
      const canSend=run.stage==='event' && run.slot>=41 && run.people.friend?.status==='in-touch' && E.held(item);
      const spriteId=C.items[id][2];
      const patched=id==='lamp' && run.facts.some(f=>f.slot===2 && f.action==='跟着家人修灯');
      body=S.sprite(spriteId,patched?'large-sprite patched-lamp':'large-sprite',animatedItems.includes(spriteId)?'once':spriteId==='lamp'?'loop':'')+'<p>'+esc(id==='lamp'?(patched?'灯罩边留着修灯那天压紧的补痕。':'灯光照亮了桌面的一角。'):C.items[id][1])+'</p>'+(canSend?button('拍给阿宁','postcard',id,'chip'):'')+'<p class="quiet-line">'+states[item.state]+' · '+C.ages[item.first-1]+' 岁获得</p>'+
        '<ol class="item-trail">'+item.trail.map(record=>'<li>'+C.ages[record.slot-1]+' 岁 · '+states[record.state]+'</li>').join('')+'</ol>'+
        (run.facts.some(fact=>fact.echoes.some(echo=>echo.id===id))?'<h3>多年回响</h3>'+run.facts.flatMap(fact=>fact.echoes.filter(echo=>echo.id===id).map(echo=>'<p>'+esc(fact.age)+' 岁 · '+esc(echo.text)+'</p>')).join(''):'');
    } else if(modal.type==='help'){
      title='手边可以做什么';
      const event=E.currentCard(run);
      const text=run.activity?.kind==='study'?'点相邻的同科题块，可随时结束练习。':run.activity?'看桌边的提示；点人物听他说，点菜可以让话题缓一缓。':
        run.stage==='result'?'可以留下这次纪念，再进入下一年。':
        roomTargets(run,event)?'点房间里带名字的东西，再决定如何用它。':
        run.slot===28?'把一样东西试摆在床头，其他可以收进抽屉。确认前随时换。':
        event.hotspot?'点房间里的物件进入安排，试一试不同投入，再确认。':'轻点一个安排查看代价，再决定这一年怎么过。';
      body='<p>'+esc(text)+'</p>';
    } else if (modal.type==='drawer') {
      title='打开抽屉';
      body=Object.entries(run.items).filter(([,item])=>item.state==='stored').map(([id])=>
        '<button class="pack-item" data-action="item" data-id="'+esc(id)+'">'+S.sprite(C.items[id][2])+esc(C.items[id][0])+'</button>').join('');
    } else if (modal.type==='objects') {
      title='手边的物件';
      body=Object.keys(run.items).length?'<div class="object-list">'+Object.entries(run.items).map(([id,item])=>'<button type="button" data-action="item" data-id="'+id+'">'+S.sprite(C.items[id][2])+
        '<span>'+esc(C.items[id][0])+'<small>'+states[item.state]+'</small></span></button>').join('')+'</div>':'<p>生活里留下的物件，以后会在这里找到。</p>';
    } else if (modal.type==='stats') {
      title='六维与生活状态';
      body='<div class="stats">'+Object.entries(run.stats).map(([id,value])=>'<div><span>'+C.labels[id]+'</span><strong>'+price(value)+'</strong></div>').join('')+'</div>';
    } else {
      title='这段人生的履历';
      const people=Object.entries(run.people).sort(([,a],[,b])=>b.last-a.last);
      body='<h3>职业</h3><p>'+esc(run.careerLog.map(job=>E.job(job.to)).join(' → ')||'还在求学')+'</p>'+
        (run.age35?'<p class="fine">35 岁职业小结 · '+esc(E.job(run.age35.job))+' · 存款 ¥'+price(run.age35.stats.money)+'</p>':'')+
        (run.wishLog.length?'<h3>心愿</h3><ul>'+run.wishLog.map(wish=>'<li>'+C.ages[wish.slot-1]+' 岁 · '+esc(C.wishes[wish.id])+' · '+({active:'定下',done:'达成',unfinished:'未竟',paused:'搁置'})[wish.status]+'</li>').join('')+'</ul>':'')+
        (Object.keys(run.experience).length?'<h3>以后可以调用的经历</h3><div class="groups">'+Object.keys(run.experience).map(id=>'<span class="tag">'+esc(experienceName(id))+'</span>').join('')+'</div>':'')+
        (people.length?'<h3>遇见的人</h3><ul class="relationship-list">'+people.map(([id,person])=>
          '<li><strong>'+esc(C.people[id])+'</strong> <small>'+esc(({'in-touch':'仍有联系',lost:'已失联',dead:'已离世'})[person.status])+
          '</small><p>'+esc(C.ages[person.first-1])+' 岁初识 · '+esc(C.ages[person.last-1])+' 岁最近一次留下共同经历</p></li>').join('')+'</ul>':'')+
        memories(run)+'<h3>走过的事</h3><ol class="timeline">'+[...run.facts].reverse().map(fact=>'<li><time>'+esc(fact.age)+' 岁</time><div><strong>'+esc(fact.title)+'</strong><p>'+esc(fact.action)+'</p>'+(fact.important||fact.highlights.length||fact.relations?.length||fact.sourceSlots?.length?relatedFacts(run,fact):'')+'</div></li>').join('')+'</ol>';
    }
    return '<dialog data-modal aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title">'+esc(title)+'</h2>'+button('关闭','close','','small')+'</div>'+body+'</dialog>';
  }

  const motionPreference=()=>data.motion ?? (data.reduced?'off':'auto');

  function animate() {
    const run=nowRun();
    S.animate(root,motionPreference(),[page,selected,run?.slot,run?.stage,run?.entered,memoPage,modal?.type,modal?.id].join('/'));
  }

  function render(focus=false) {
    const previous=document.activeElement;
    const hadDialog=!!root.querySelector('dialog[open]');
    const scrolled=root.querySelector('.game-scroll')?.scrollTop ?? 0;
    const dialogScrolled=root.querySelector('dialog')?.scrollTop ?? 0;
    if(modal&&!hadDialog&&previous?.dataset.action) modalReturn={...previous.dataset};
    const details=[...root.querySelectorAll('details[open]')].map(item=>item.querySelector('summary')?.textContent);
    const branch=entry();
    if (page==='play'&&!branch) page='home';
    const run=branch?.run;
    updateGuide(run);
    const turn=page==='play'&&run?.stage==='event'?selected+':'+run.slot:null;
    if(turn!==activeTurn?.key)activeTurn=turn?{key:turn,started:performance.now()}:null;
    root.innerHTML='<div class="game-frame">'+header()+'<div class="game-scroll">'+
      (notice||!saving?'<div class="notice" role="status">'+esc(notice||'此浏览器暂时无法保存。可在设置里导出进度。')+'</div>':'')+
      (page==='setup'?setupPage():page==='archive'?archive():page==='play'&&run?run.memo?memoirPage(run):play(run):home())+
      '</div>'+(page==='play'&&run?turnFooter(run):'')+overlay(run)+'</div>';
    const scroll=root.querySelector('.game-scroll');
    const dialog=root.querySelector('dialog');
    for(const detail of root.querySelectorAll('details')) if(details.includes(detail.querySelector('summary')?.textContent)) detail.open=true;
    scroll.scrollTop=focus?0:scrolled;
    if(dialog) {
      dialog.showModal();
      dialog.scrollTop=dialogScrolled;
      dialog.addEventListener('cancel',event=>{event.preventDefault();modal=null;render();});
    } else if(focus) {
      const title=root.querySelector('h1');
      if(focus==='event') {
        const panel=root.querySelector('.event-panel');
        if(panel) scroll.scrollTop=panel.getBoundingClientRect().top-scroll.getBoundingClientRect().top;
      }
      title?.focus({preventScroll:true});
      modalReturn=null;
    } else {
      const restore=hadDialog?modalReturn:previous?.dataset;
      if(restore?.action) [...root.querySelectorAll('[data-action]')].find(item=>
        item.dataset.action===restore.action&&item.dataset.id===restore.id&&!item.disabled)?.focus({preventScroll:true});
      if(hadDialog) modalReturn=null;
    }
    animate();
    if(!data.sound)A.enable(false);
    A.mood(page==='play'&&run&&(run.early||E.currentCard(run)?.rule==='early')?'silent':page==='play'&&run?.memo?'memoir':'daily');
  }

  function start(run,parent=null,from=null) {
    const id=token(), tree=parent?data.branches[parent].tree:token();
    if (!parent) data.trees[tree]={birth:run.birth,reward:false};
    data.branches[id]={tree,parent,from,run};
    data.active=selected=id;
    packingFocus=null;
    page='play';
    memoPage=0;
    modal=null;
    measure(parent?'fork_selected':'run_started');
    persist();
  }

  function reward(branch) {
    if (branch===testBranch) return;
    const run=branch.run, tree=data.trees[branch.tree];
    data.points += E.claimEnding(tree,run);
    const talent=run.highlights.published || run.careerLog.some(job=>job.to==='factory') ? 'maker' :
      run.careerLog.some(job=>['delivery','sanitation','dispatcher'].includes(job.to)) ? 'neighbor' : 'patient';
    if (!data.talents.includes(talent)) data.talents.push(talent);
  }

  function download(contents,type,filename) {
    const blob = new Blob([contents],{type}),url=URL.createObjectURL(blob);
    const link=document.createElement('a'); link.href=url;link.download=filename;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  }

  function share(run,title=run.memo.title,subtitle=run.memo.origin+' · '+run.memo.age+' 岁',line=run.memo.line) {
    const canvas=document.createElement('canvas'); canvas.width=720;canvas.height=1280;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ede0c4';ctx.fillRect(0,0,720,1280);
    ctx.fillStyle='#26342c'; ctx.fillRect(32,32,656,1216);
    ctx.strokeStyle='#b89763';ctx.strokeRect(56,56,608,1168);
    ctx.textAlign='center';ctx.fillStyle='#edd6a6';ctx.font='26px system-ui';ctx.fillText('这辈子 · 人生回忆录',360,205);
    ctx.fillStyle='#fff0ca';ctx.font='bold 54px system-ui';ctx.fillText(title,360,390,600);
    ctx.font='24px system-ui';ctx.fillText(subtitle,360,462,600);
    ctx.fillStyle='#dbb47c';ctx.fillRect(298,528,124,2);
    ctx.fillStyle='#fff0ca';ctx.font='28px system-ui';
    const chars=[...line].slice(0,153); for(let i=0;i<chars.length;i+=17) ctx.fillText(chars.slice(i,i+17).join(''),360,625+i/17*45);
    ctx.font='22px system-ui';ctx.fillText('把这一页留着',360,1090);
    const link=document.createElement('a');link.href=canvas.toDataURL('image/png');link.download='这辈子-回忆录.png';link.click();
  }

  function birthTest() {
    const run=E.create(85017,{scenario:'early'});
    while(run.slot<43){
      run.entered=true;
      run.draft.main=E.currentCard(run).choices[0].id;
      if(C.familySlots.includes(run.slot))run.draft.parent=2;
      if(!E.commit(run)||!E.advance(run))throw new Error('走测前缀结算失败');
    }
    testBranch={tree:null,run};selected='test';page='play';modal=null;memoPage=0;
  }

  function mutate(action,id,itemId) {
    const run=nowRun(), branch=entry();
    notice='';
    const globalActions={
      'share-pair':()=>{
        const later=data.branches[id];
        if(!later?.run.memo)return;
        const first=data.branches[later.parent]??Object.values(data.branches).find(b=>b.tree===later.tree && b.run.memo);
        if(first && first!==later)share(later.run,'同一个决定，两种后来',C.ages[later.from-1]+' 岁的分岔',
          [first,later].map(b=>(b.run.facts.find(f=>f.slot===later.from)?.action??'')+' · '+b.run.memo.title).join('　／　'));
      },
      home:()=>{page='home';modal=null;},
      resume:()=>{selected=data.active;page=entry()?'play':'home';modal=null;memoPage=0;},
      setup:()=>{setup={seed:parseInt(token().split('-')[0],36)>>>0,points:{},talent:null};page='setup';modal=null;},
      archive:()=>{page='archive';modal=null;},
      settings:()=>{modal={type:'settings'};},
      close:()=>{modal=null;},
      'open-branch':()=>{if(data.branches[id]) {selected=data.active=id;page='play';memoPage=0;persist();}},
      test:birthTest,
      export:()=>download(JSON.stringify(data,null,2),'application/json','这辈子-v1.3.2-备份.json'),
      'playtest-export':()=>download(JSON.stringify(data.playtest??{counts:{},turnMs:0},null,2),'application/json','这辈子-v1.3.2-走测统计.json')
    };
    if(Object.hasOwn(globalActions,action)) {globalActions[action]();render(!['settings','export','playtest-export','close'].includes(action));return;}
    if (page==='setup') {
      const n=Object.values(setup.points).reduce((a,b)=>a+b,0);
      if(action==='birth' && n<=Math.min(data.points,6)){
        data.points-=n;
        start(E.create(setup.seed,{points:setup.points,talent:setup.talent}));
        render(true);
      } else if(action==='point-up'&&E.attributes.includes(id)&&n<Math.min(data.points,6)) {
        setup.points[id]=(setup.points[id]??0)+1;render();
      } else if(action==='point-down'&&setup.points[id]>0) {setup.points[id]--;render();}
      return;
    }
    if(!run)return;
    if (page==='play' && run.eventId==='life-3' && run.stage==='event') {
      if(action==='help') action='guide-help';
      if(action==='shop-undo'){
        shopMessage='';
        const session=run.draft.interaction;
        let last;
        do {
          last=session.actions.at(-1);
          if(!LifeInteraction.update(run,session.interactionId,'undo'))return;
        } while(last.startsWith('look-'));
        run.draft.shopFocus=null;
      } else if(action==='shop-object'){
        const focus=itemId ?? run.draft.shopFocus;
        shopMessage='';
        if(!LifeShop.input(run,id,LifeShop.coins.includes(focus)?focus:null)){
          shopMessage='这枚硬币不能这样放。可以换个去处，或先撤回上一次支付。';
          render();return;
        }
      }
      if(action==='shop-object' || action==='shop-undo'){
        if(branch!==testBranch)persist();
        render();
        return;
      }
    }
    if (action.startsWith('guide-') && page==='play' && run.stage==='event') {
      if (action==='guide-help') { guideClock.help(); render(); return; }
      if (action==='guide-open' && !run.draft.interaction) LifeInteraction.create(run,token());
      const command = {'guide-open':'open','guide-act':'act','guide-review':'review','guide-undo':'undo'}[action];
      if (!LifeInteraction.update(run,run.draft.interaction?.interactionId,command,id)) return;
      if (command==='open') run.entered=true;
      if (branch!==testBranch) persist();
      render();
      return;
    }
    if(['stats','history','objects','item','drawer','help'].includes(action)) {
      if(action==='item'&&run.items[id]&&branch!==testBranch){measure('item_interaction');persist();}
      modal={type:action,id};render();return;
    }
    if(action==='postcard' && modal?.type==='item' && modal.id===id && run.stage==='event' && run.slot>=41 && run.people.friend?.status==='in-touch' && E.held(run.items[id])){
      run.draft.postcard=id;modal=null;notice='照片已选好，和这次安排一起寄出。';if(branch!==testBranch)persist();render();return;
    }
    if(action==='lamp-act' && run.slot===2 && run.stage==='event'){
      const event=E.currentCard(run);
      if(!event.choices.some(c=>c.id===id))return;
      run.entered=true;run.draft.main=id;return mutate('commit',run.eventId);
    }
    if(action==='touch-object' && run.stage==='event' && roomTargets(run,E.currentCard(run)) && E.currentCard(run).choices.some(c=>c.id===id)){
      run.draft.objectFocus=id;render();return;
    }
    if(action==='do-object' && run.stage==='event' && run.draft.objectFocus===id && E.currentCard(run).choices.some(c=>c.id===id)){
      modal=null;run.draft.main=id;
      const plan=E.preview(run);
      if(!plan.wish && !run.wish && !(run.slot===38 && plan.reuse.length) && !plan.choice.commands.some(c=>c.startsWith('job:')))
        return mutate('commit',run.eventId);
      if(branch!==testBranch)persist();render('event');return;
    }
    if(action==='keepsake' && run.stage==='result' && run.facts.at(-1)?.slot===Number(id)){
      run.facts.at(-1).saved=true;run.result.fact.saved=true;if(branch!==testBranch)persist();render();return;
    }
    if(action==='share-memory'){
      const fact=run.facts.find(f=>f.saved && f.slot===Number(id));
      if(fact)share(run,fact.title,fact.age+' 岁 · '+fact.action,fact.text);
      return;
    }
    if(run.memo) {
      if(action==='memo' && Number(id)>=0 && Number(id)<=3) {
        if(branch!==testBranch){
          const pages=branch.memoirPages??1;
          branch.memoirPages=pages|1<<Number(id);
          if(pages!==15&&branch.memoirPages===15)measure('memoir_read_completion');
          if(pages!==branch.memoirPages)persist();
        }
        memoPage=Number(id);render(true);
      }
      if(action==='share') {
        share(run);
        if(branch!==testBranch){measure('memoir_share');persist();}
      }
      if(action==='fork-preview' && run.memo.forks.some(point=>point.slot===Number(id))) {
        if(branch!==testBranch){measure('fork_open');persist();}
        modal={type:'fork',id:Number(id)};render();
      }
      if(action==='fork') {
        const fork=E.fork(run,Number(id));
        if(!fork)return;
        if(branch===testBranch) {testBranch={tree:null,run:fork};modal=null;render(true);return;}
        if(Object.values(data.branches).filter(branch=>branch.tree===entry().tree&&!branch.run.memo).length>=3) {
          modal=null;notice='这棵人生树已有三段在进行的人生。完成其中一段后可以再开分支。';render(true);return;
        }
        start(fork,selected,Number(id));render(true);
      }
      return;
    }
    let focus = false;
    const event=E.currentCard(run),draft=run.draft;
    if(['next','skip-memoir'].includes(action)&&run.stage==='result'&&id===run.eventId){
      const skip=action==='skip-memoir';
      if(skip && run.slot!==46 && run.finalType!=='early')return;
      if(!E.advance(run))return;
      packingFocus=null;
      if(run.memo){
        memoPage=skip && branch===testBranch?3:0;
        reward(branch);
        measure('branch_completed');
        if(skip && branch!==testBranch)page='archive';
      }
      focus=true;
      announcement.textContent=run.memo?'打开人生回忆录':'进入 '+E.age(run)+' 岁，第 '+run.slot+' 回合';
    } else if(run.stage==='event') {
      if(action==='enter'&&event.hotspot&&id===event.hotspot&&!run.entered) {run.entered=true;measure('workbench_open');focus='event';}
      else if(action==='cancel'&&run.entered) {run.entered=false;run.draft=E.emptyDraft();packingFocus=null;focus=true;}
      else if(action==='choose'&&(!event.hotspot||run.entered)&&event.choices.some(choice=>choice.id===id)) {
        if(draft.main!==id){
          draft.main=id;
          draft.wish=null;
          draft.reuse=null;
          if(E.preview(run).day?.mainBlocks!==1)draft.dayExtra=null;
        }
      } else if(action==='day-extra') {
        if(!E.chooseDayExtra(run,id))return;
      } else if(action==='pack-item'&&run.slot===28&&run.entered&&E.held(run.items[id])) {
        packingFocus=packingFocus===id?null:id;
        render();
        return;
      } else if(action==='pack-place') {
        if(!E.placeItem(run,itemId??packingFocus,id))return;
        packingFocus=itemId??packingFocus;
      } else if(action==='reuse'&&E.preview(run).reuse?.includes(id)) draft.reuse=id;
      else if(action==='parent'&&C.familySlots.includes(run.slot)&&['0','1','2'].includes(id)) draft.parent=Number(id);
      else if(action==='support'&&event.hotspot&&draft.main&&Object.hasOwn(C.supports,id)&&id!=='experience') {
        if(draft.support.includes(id))draft.support=draft.support.filter(key=>key!==id);
        else if(E.preview(run).remaining>=C.supports[id][1])draft.support.push(id);
      } else if(action==='experience'&&event.hotspot&&draft.main&&E.preview(run).options.includes(id)) {
        if(draft.experience===id){draft.experience=null;draft.support=draft.support.filter(id=>id!=='experience');}
        else if(draft.experience||E.preview(run).remaining>=1){if(!draft.experience)draft.support.push('experience');draft.experience=id;}
      } else if(action==='wish'&&['skip','pause','take'].includes(id)) draft.wish=id;
      else if(action==='memory'&&run.slot===46&&E.held(run.items[id])) {
        if(draft.memory.includes(id))draft.memory=draft.memory.filter(key=>key!==id);
        else if(draft.memory.length<3)draft.memory.push(id);
      } else if(action==='order'&&event.id==='arena-tactics'&&['0','1','2'].includes(id)) {
        const index=Number(id);draft.order=draft.order.includes(index)?draft.order.filter(id=>id!==index):[...draft.order,index];
      } else if(action==='activity') {if(!E.beginActivity(run,id))return;}
      else if(action==='tile'||action==='activity-move') {if(!E.activityMove(run,action==='tile'?Number(id):id))return;}
      else if(action==='commit'&&id===run.eventId) {
        const previousWish=run.wish?.id;
        const previousThreads=Object.keys(run.threads);
        if(!E.commit(run)) return;
        if(branch!==testBranch){
          measure('turn_completed');
          if(activeTurn)data.playtest.turnMs+=Math.round(Math.min(performance.now()-activeTurn.started,5*60*1000));
          if(event.hotspot)measure('workbench_commit');
          if(event.risk||run.slot===36)measure('risk_choice');
          if(run.wish?.id!==previousWish)measure(previousWish?'wish_changed':'wish_selected');
          if(Object.keys(run.threads).some(key=>!previousThreads.includes(key)))measure('dream_clue_unlocked');
          if(run.result.fact.echoes.length)measure('fact_echo_presented',run.result.fact.echoes.length);
        }
        announcement.textContent=run.result.fact.text;
        focus='event';
      } else return;
    } else return;
    if(branch!==testBranch)persist();
    render(focus);
  }

  let shopDrag=null, suppressShopClick=0;
  root.addEventListener('pointerdown',e=>{
    const coin=e.target.closest('.shop-entity[data-object-id]');
    if(!coin || !LifeShop.coins.includes(coin.dataset.id))return;
    coin.setPointerCapture(e.pointerId);
    shopDrag={coin,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
  });
  root.addEventListener('pointermove',e=>{
    if(shopDrag?.id!==e.pointerId)return;
    const dx=e.clientX-shopDrag.x, dy=e.clientY-shopDrag.y;
    if(Math.hypot(dx,dy)>6)shopDrag.moved=true;
    if(shopDrag.moved)shopDrag.coin.style.translate=dx+'px '+dy+'px';
  });
  root.addEventListener('pointerup',e=>{
    if(shopDrag?.id!==e.pointerId)return;
    const {coin,moved}=shopDrag;
    shopDrag=null;
    coin.style.translate='';
    if(!moved)return;
    suppressShopClick=performance.now()+250;
    coin.style.pointerEvents='none';
    const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-object-id]');
    coin.style.pointerEvents='';
    if(target && !LifeShop.coins.includes(target.dataset.id))edit(()=>mutate('shop-object',target.dataset.id,coin.dataset.id));
  });
  root.addEventListener('pointercancel',()=>{if(shopDrag)shopDrag.coin.style.translate='';shopDrag=null;});
  let lastTouchDrop=null;
  root.addEventListener('click',event=>{
    const target=event.target.closest('[data-action]');
    if(!target||target.disabled)return;
    const {action,id=''}=target.dataset;
    if(action==='shop-object' && event.detail && performance.now()<suppressShopClick)return;
    if(['choose','pack-item'].includes(action)&&event.detail>0&&lastTouchDrop?.id===id&&performance.now()<lastTouchDrop.until)return;
    if(data.sound)A.enable(true);
    edit(()=>{
      const run=nowRun();
      const quiet=page==='play'&&(run?.early||run&&E.currentCard(run)?.rule==='early');
      const cue={choose:'choose',enter:'open',commit:'commit',tile:'tile',memo:'page',item:'keepsake'}[action];
      if(cue&&!quiet)A.play(cue);
      mutate(action,id);
    });
  });
  root.addEventListener('change',event=>{
    const input=event.target, {input:type,id}=input.dataset;
    if(type==='import') {
      const file=input.files[0];
      if(!file)return;
      file.text().then(text=>{
        const incoming=JSON.parse(text);
        if(!save.validateImport(incoming))throw Error('备份结构不完整');
        edit(()=>{data=incoming;selected=data.active;page='home';modal=null;notice='已载入 v1.3.2 备份。';persist();render(true);});
      }).catch(()=>{notice='无法载入备份。请选择有效的 v1.3.2 JSON 文件。';render();});
      return;
    }
    if(type==='sound')A.enable(input.checked);
    edit(()=>{
      if(type==='sound'){data.sound=input.checked;persist();}
      if(type==='motion'&&['auto','on','off'].includes(input.value)){data.motion=input.value;persist();animate();}
      if(type==='talent')setup.talent=data.talents.includes(input.value)?input.value:null;
      if(type==='compare'){compare=input.value;render();}

    });
  });

  const dragSelector='[data-action="choose"][draggable], [data-action="pack-item"][draggable]';
  const packTargets=['keep','store','give','discard'];
  function dropZone(card,target) {
    const zone=target?.closest('[data-drop]');
    if(!zone)return null;
    const type=zone.dataset.drop;
    return (card.action==='pack-item'?packTargets.includes(type):type==='main')?zone:null;
  }
  function finishDrop(card,zone) {
    if(card.action==='pack-item')edit(()=>mutate('pack-place',zone.dataset.drop,card.id));
    else edit(()=>mutate('choose',card.id));
  }

  let dragged=null;
  root.addEventListener('dragstart',event=>{
    const card=event.target.closest(dragSelector);
    if(!card)return;
    dragged={...card.dataset};
    event.dataTransfer.setData('text/plain',dragged.id);
    event.dataTransfer.effectAllowed='move';
  });
  root.addEventListener('dragend',()=>{dragged=null;});
  root.addEventListener('dragover',event=>{
    if(dragged&&dropZone(dragged,event.target)){event.preventDefault();event.dataTransfer.dropEffect='move';}
  });
  root.addEventListener('drop',event=>{
    const zone=dragged&&dropZone(dragged,event.target);
    if(!zone)return;
    event.preventDefault();
    finishDrop(dragged,zone);
    dragged=null;
  });
  let touchDrag=null;
  function clearTouchDrag() {
    if(!touchDrag)return;
    touchDrag.ghost?.remove();
    touchDrag.zone?.classList.remove('over');
    touchDrag=null;
  }
  root.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'||!event.target.closest('.drag-grip'))return;
    const card=event.target.closest(dragSelector);
    if(!card)return;
    card.setPointerCapture(event.pointerId);
    const label=card.querySelector('[data-drag-label]')??card.children[1];
    touchDrag={pointer:event.pointerId,card:{...card.dataset},label:label.textContent,x:event.clientX,y:event.clientY};
  });
  root.addEventListener('pointermove',event=>{
    if(touchDrag?.pointer!==event.pointerId)return;
    if(!touchDrag.ghost){
      if(Math.hypot(event.clientX-touchDrag.x,event.clientY-touchDrag.y)<8)return;
      touchDrag.ghost=document.createElement('div');
      touchDrag.ghost.className='drag-ghost';
      touchDrag.ghost.textContent=touchDrag.label;
      document.body.append(touchDrag.ghost);
    }
    touchDrag.ghost.style.left=event.clientX+'px';
    touchDrag.ghost.style.top=event.clientY+'px';
    const zone=dropZone(touchDrag.card,document.elementFromPoint(event.clientX,event.clientY));
    if(zone!==touchDrag.zone){
      touchDrag.zone?.classList.remove('over');
      zone?.classList.add('over');
      touchDrag.zone=zone;
    }
  });
  root.addEventListener('pointerup',event=>{
    if(touchDrag?.pointer!==event.pointerId)return;
    const card=touchDrag.card;
    const moved=!!touchDrag.ghost;
    const zone=moved&&dropZone(card,document.elementFromPoint(event.clientX,event.clientY));
    if(moved)lastTouchDrop={id:card.id,until:performance.now()+120};
    clearTouchDrag();
    if(zone)finishDrop(card,zone);
  });
  root.addEventListener('pointercancel',clearTouchDrag);
  document.addEventListener('visibilitychange',()=>{if(guideView)render();});
  S.motion.addEventListener('change',()=>render());
  setInterval(()=>{
    const run=nowRun(),timer=document.querySelector('#timer');
    if(page!=='play'||run?.activity?.kind!=='study'||!timer)return;
    const remaining=run.activity.deadline-Date.now();
    if(remaining<=0&&!modal)edit(()=>mutate('activity-move','finish'));
    else timer.textContent=Math.max(0,Math.ceil(remaining/1000))+' 秒';
  },250);
  render();
})();
