'use strict';

globalThis.LifeGift = (() => {
  const art=(frame,extra='')=>'<i aria-hidden="true" class="gift-art '+extra+'" style="--cel:'+frame+'"></i>';
  const character=(frame)=>art(frame,'gift-person');
  const forms={box:0,family:5,drawer:2};

  function render(event,view,guide,button,esc) {
    const scene=event.interaction;
    const saving=scene.sceneId==='spring-envelope';
    const done=view?.phase==='resolved';
    const decision=done?view.performed[0]:null;
    const bought=decision==='buy';
    const place=scene.place;
    const frame=forms[place];
    function target(id,visual,label,position){
      const caption=done && saving?'':('<small>'+esc(label)+'</small>');
      const content=visual+caption;
      const classes='gift-target '+position+(guide?.recommendedObjectIds.includes(id)?' suggested':'');
      if(done)return '<span class="'+classes+'">'+content+'</span>';
      return '<button class="'+classes+'" data-action="gift-act" data-id="'+id+'" data-object-id="'+id+'" aria-label="'+esc(label)+'">'+content+'</button>';
    }
    const packet=art(4,'gift-packet');
    const home=art(7,'lantern left')+art(7,'lantern right')+
      '<span class="gift-child">'+character(21)+'</span>'+
      target('box',art(decision==='box'?1:0),'自己藏好','box')+
      target('family',character(scene.caregiver==='外婆'?23:22),'交给'+scene.caregiver,'family')+
      target('drawer',art(decision==='drawer'?2:3),'放进抽屉','drawer')+
      (decision==='family'?art(5,'wrapped'): '')+packet;
    const money=art(bought?(place==='box'?0:place==='drawer'?3:24):frame,bought?'emptied':'')+
      (!bought && place==='box'?art(4,'nest'): '');
    const school='<small class="gate-sign">校门口</small><div class="gift-memory"><small>家里的'+({box:'小盒子',family:'红纸包',drawer:'抽屉'}[place]||'')+'</small></div>'+
      target('keep',money,done?'压岁钱 ¥'+view.balance:'继续留着 · ¥'+scene.price,'keep')+
      '<span class="classmate">'+character(20)+art(8,'spinning')+'</span>'+
      (bought?'':'<span class="playmate">'+character(21)+'</span>')+
      target('buy',bought?'':art(6),done?(bought?'柜台已空':'同款悠悠球'):'买下它 · ¥'+scene.price,'buy')+
      (bought?art(4,'gift-payment')+'<span class="gift-owner">'+character(21)+art(8,'spinning')+'</span>':'');
    const feedback=done?event.choices.find(c=>c.id===view.choiceId).outcome:
      saving?'你的压岁钱 · ¥'+scene.price:'你想起'+scene.caregiver+'提醒过你：“留着，以后上初中用。”';
    return '<section class="surface event-panel gift-panel"><h1>'+event.title+'</h1><p>'+esc(scene.situation)+'</p>'+
      (!done?'<strong>'+esc(guide?.goalText||scene.goal)+'</strong>':'')+
      '<div class="gift-scene '+(saving?'spring':'school')+'" data-decision="'+(decision||'')+'" data-level="'+(guide?.hintLevel||0)+'">'+
      (saving?home:school)+'</div><p role="status">'+esc(feedback)+'</p>'+
      (guide?.hintText?'<p class="fine">'+esc(guide.hintText)+'</p>':'')+
      (done?'':button('我能做什么？','guide-help','','small'))+'</section>';
  }
  return {render};
})();
