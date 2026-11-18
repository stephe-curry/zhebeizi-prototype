'use strict';

globalThis.LifeGift = (() => {
  const art=(frame,extra='')=>'<i aria-hidden="true" class="gift-art '+extra+'" style="--cel:'+frame+'"></i>';
  const character=(frame,position)=>'<span class="'+position+'">'+art(frame,'gift-person')+'</span>';
  const household={box:0,drawer:4,family:8};

  function render(event,view,guide,button,esc,savedText) {
    const scene=event.interaction;
    const saving=scene.sceneId==='spring-envelope';
    const done=view?.phase==='resolved';
    const performed=view?.performed ?? [];
    const decision=done?performed.at(-1):null;
    const place=scene.place;
    const caregiver=scene.caregiver==='外婆'?23:22;
    function target(id,visual,label,position,interactive=!done){
      const caption=label?'<small>'+esc(label)+'</small>':'';
      const classes='gift-target '+position+(interactive&&guide?.recommendedObjectIds.includes(id)?' suggested':'');
      if(!interactive)return '<span class="'+classes+'">'+visual+caption+'</span>';
      return '<button class="'+classes+'" data-action="gift-act" data-id="'+id+'" data-object-id="'+id+'" aria-label="'+esc(label || scene.homeBeat?.label || '')+'">'+visual+caption+'</button>';
    }
    function control(id,label,style='small') {
      const recommended=guide?.recommendedObjectIds.includes(id);
      return button(label,'gift-act',id,style+(recommended?' gift-suggested':''));
    }
    const home=art(7,'lantern left')+art(7,'lantern right')+
      character(21,'gift-child')+
      target('box',art(decision==='box'?1:0),done?'':'自己藏好','box')+
      target('family',art(caregiver,'gift-person'),done?'':'交给'+scene.caregiver,'family')+
      target('drawer',art(decision==='drawer'?2:3),done?'':'放进抽屉','drawer')+
      (decision==='family'?art(5,'wrapped'): '')+art(4,'gift-packet');
    const nextDay=done && decision==='buy';
    const legacy=done && !saving && view.story!==LifeContent.yoyoStory;
    const priced=performed.includes('see-price');
    const atHome=performed.includes('go-home');
    const retrieved=performed.includes(scene.homeBeat?.action);
    let setting='spring', beat='spring', shot=home, controls='', line='', status='', request='';
    if(saving){
      line=scene.situation;
      status=done?savedText:'你的压岁钱 · ¥'+scene.price;
    }else if(legacy){
      // Previous results keep the narration and facts that actually committed.
      beat='legacy';
      setting=nextDay?'school':'spring';
      shot=nextDay
        ? character(21,'gift-owner')+art(6,'legacy-yoyo')
        : character(21,'yoyo-child')+target('keep',art(({box:0,drawer:3,family:5})[place]??4),
          '压岁钱 ¥'+view.balance,place==='family'?'cabinet':place,false);
      line='八岁 · 已完成';
      status=savedText;
    }else if(!atHome || nextDay){
      beat=nextDay?'purchase':priced?'thought':'school';
      setting='school';
      shot='<small class="gate-sign">'+(nextDay?'第二天 · 校门口':'两年后 · 校门口')+'</small>'+
        '<span class="classmate">'+art(20,'gift-person')+art(8,'spinning')+'</span>'+
        character(21,nextDay?'gift-buyer':'playmate')+
        target('see-price',art(6),nextDay?'':'¥'+scene.price,'buy '+(nextDay?'stock':''),!priced&&!done&&!!view?.allowed.some(action=>action.actionId==='see-price'))+
        (nextDay?'<i aria-hidden="true" class="yoyo-wood yoyo-cash" style="--wood:12"></i>'+art(6,'yoyo-handoff')+art(8,'yoyo-first-try'):'');
      line=nextDay?'第二天放学，你又来到柜台前。':priced?'柜台上，是同学玩的那一款。':'同学甩出悠悠球，又稳稳收回来。';
      request=nextDay||priced?'':'同学：“你的呢？”　你：“我还没有。”';
      status=nextDay?'十块钱递到柜台，你接过悠悠球，第一次甩得有点歪。同学说：“你先慢一点，我教你。”':
        priced?'同款要十块。你想：“我好像还有十块压岁钱……”':'';
      if(priced&&!done)controls=control('go-home','回家找压岁钱');
    }else{
      beat=done?'put-back':retrieved?'retrieved':'arrived';
      const family=place==='family';
      const stored=done || retrieved;
      const prop='<i aria-hidden="true" class="yoyo-wood" style="--wood:'+household[place]+'"></i>';
      const sourcePos=family?'cabinet':place;
      const adult=scene.keeper==='外婆'?23:22;
      shot='<small class="gate-sign">两年后 · 家里</small>'+character(21,'yoyo-child')+
        (family?target('ask-family',art(adult,'gift-person'),scene.keeper,'yoyo-carer',!stored):'')+
        target(scene.homeBeat.action,prop,'',sourcePos+' yoyo-source',!family&&!stored)+
        (stored?art(family?5:4,'yoyo-envelope'):'');
      line=done?'仍有 ¥10 · '+(family?'由'+scene.keeper+'保管':place==='box'?'收在小盒子里':'收在抽屉里') : !stored
        ? (family?scene.keeper+'在家，你想起那包请'+scene.keeper+'收着的钱。':place==='box'?'小盒子还在原来的地方，搭扣磨旧了一点。':'抽屉还在原来的地方，里面多了几本练习本。')
        : '当年收好的十块钱还在。';
      if(family && retrieved && !done)line='你：“'+scene.homeBeat.request+'”';
      status=done?savedText:retrieved?(family?scene.keeper+'从柜子里拿出红纸包：“'+scene.homeBeat.line+'”':scene.homeBeat.line):'';
      if(retrieved&&!done)controls=control('buy','明天去买','primary')+control('keep','继续留着','secondary');
    }
    return '<section class="surface event-panel gift-panel" data-beat="'+beat+'"><h1 tabindex="-1">'+esc(event.title)+'</h1><p'+(beat==='retrieved' && place==='family'?' class="gift-dialogue"':'')+'>'+esc(line)+'</p>'+
      '<div class="gift-scene '+setting+'" data-beat="'+beat+'" data-place="'+(place??'')+'" data-decision="'+(decision??'')+'" data-level="'+(guide?.hintLevel||0)+'">'+shot+'</div>'+
      (request?'<p class="gift-dialogue">'+esc(request)+'</p>':'')+
      (status?'<p role="status">'+esc(status)+'</p>':'')+
      (!done?'<p><strong>'+esc(guide?.goalText||scene.goal)+'</strong></p>':'')+
      (controls?'<div class="groups gift-controls">'+controls+'</div>':'')+
      (guide?.hintText?'<p class="fine">'+esc(guide.hintText)+'</p>':'')+
      (done?'':button('我能做什么？','guide-help','','small'))+'</section>';
  }
  return {render};
})();
