'use strict';

globalThis.LifeDinner = (() => {
  function renderLegacy(scene, view, guide, button, esc) {
    const done = view.phase === 'resolved';
    const allowed = id => view.allowed.some(action => action.actionId===id);
    const listened = view.observed.includes(scene.npcId);
    const recommended = guide?.recommendedObjectIds[0];
    const turn = view.performed.includes('turn');
    const served = view.performed.includes('serve');
    const feedback = view.feedback ?? '';
    const speaker = scene.objects[scene.npcId].label;
    function entity(id, action, position, art) {
      const label = esc(scene.objects[id].label);
      const canTalk = id===scene.npcId && listened;
      const canAct = canTalk || allowed(action);
      const suggested = canAct && recommended===id;
      const classes = 'dinner-entity '+position+(suggested?' suggested':'');
      if (done) return '<span class="'+classes+'">'+art+'</span>';
      return '<button type="button" class="'+classes+'" data-action="dinner-act" data-id="'+action+'" data-object-id="'+id+
        '" aria-label="'+label+(suggested?'（建议）':'')+'" aria-disabled="'+!canAct+'">'+art+'</button>';
    }
    const pose = done ? 0 : view.performed.at(-1)==='turn' ? 2 : listened ? 1 : 0;
    const actor = '<i aria-hidden="true" style="--pose:'+((scene.elder?3:0)+pose)+'"></i>';
    const answers = view.allowed.filter(action=>action.objectId===scene.npcId && action.actionId!=='listen');
    const spoken = answers.filter(action=>!action.sourceSlot);
    const stories = answers.filter(action=>action.sourceSlot);
    const respond = action => button(action.label,'dinner-act',action.actionId,'chip');
    return '<section class="surface event-panel dinner-panel" data-guide-level="'+(guide?.hintLevel ?? 0)+'">'+
      '<h1 tabindex="-1">圆桌坐哪边</h1><p class="dinner-goal">'+esc(done?'碗筷声渐渐轻了。':listened?
        '听完'+speaker+'的问题，可以接话、帮忙，也可以安心吃饭。':guide?.goalText ?? scene.goal)+'</p>'+
      '<div class="dinner-room">'+
        entity(scene.npcId,'listen','dinner-speaker',actor)+
        entity('fish','turn','dinner-fish'+(turn?' passed':''),'<i aria-hidden="true"></i>')+
        entity('rice','serve','dinner-rice'+(served?' served':''),'<i aria-hidden="true"></i>')+
      '</div>'+
      (done?'': '<p class="dinner-feedback" role="status">'+esc(feedback || '转盘上还剩一块鱼。')+'</p>'+
        (spoken.length?'<div class="groups dinner-replies">'+spoken.map(respond).join('')+'</div>':'')+
        (stories.length?'<details class="dinner-recall"><summary>讲一段往事</summary><div class="groups">'+stories.map(respond).join('')+'</div></details>':'')+
        (guide?.hintText?'<p class="fine">'+esc(guide.hintText)+'</p>':'')+
        '<div class="groups dinner-controls">'+button('我能做什么？','guide-help','','small')+
          button(view.balances.beats===3?'安静吃完':'散席','dinner-act','finish','secondary')+'</div>')+
      '</section>';
  }
  function renderFish(scene, view, guide, button, esc) {
    const done = view.phase==='resolved';
    const allowed = id => view.allowed.some(action=>action.actionId===id);
    const asked = view.performed.includes('ask-family');
    const selected = !done && allowed('save-fish');
    const decision = view.decisionId;
    const moved = decision==='save-fish' || decision==='eat-fish';

    function target(id, actionId, position, art, caption='') {
      const name = esc(scene.objects[id].label);
      const suggested = guide?.recommendedObjectIds.includes(id);
      const classes = 'fish-target '+position+(suggested?' suggested':'');
      if (done) return '<span class="'+classes+'">'+art+'</span>';
      const label = caption?'<small aria-hidden="true">'+esc(caption)+'</small>':'';
      const pressed = id==='fish'?' aria-pressed="'+view.observed.includes('fish')+'"':'';
      const availability = allowed(actionId)?'':id==='own-bowl'||id==='reserve-bowl'?' disabled':' aria-disabled="true"';
      return '<button type="button" class="'+classes+'" data-action="dinner-act" data-id="'+actionId+
        '" data-object-id="'+esc(id)+'" aria-label="'+name+'"'+pressed+availability+'>'+art+label+'</button>';
    }

    const sprite = (name,index) => '<i aria-hidden="true" class="fish-art '+name+'" style="--cel:'+index+'"></i>';
    const speaker = scene.npcId ? target(scene.npcId,'ask-family','fish-speaker',
      '<i aria-hidden="true" class="fish-adult" style="--pose:'+((scene.elder?3:0)+(asked?1:0))+'"></i>') : '';
    const plate = target('fish','select-fish','fish-plate'+(selected?' selected':''),
      sprite('fish-dish',6)+(!moved?sprite('fish-piece',7):''));
    const own = target('own-bowl','eat-fish','fish-own',sprite('own-bowl-art',5),selected?'我的碗':'');
    const reserve = target('reserve-bowl','save-fish','fish-reserve',sprite('reserve-bowl-art',4),
      selected?(scene.gathering?'空碗':'留到下顿'):'');
    const movedFish = moved ? '<span class="fish-target '+(decision==='save-fish'?'fish-reserve fish-placed':'fish-own fish-eaten')+
      '" aria-hidden="true">'+sprite('fish-piece',7)+'</span>' : '';
    const guest = scene.gathering?'<span class="fish-target fish-guest" aria-hidden="true">'+sprite('guest-art',3)+'</span>':'';
    const seat = scene.gathering?'<span class="fish-target fish-seat" aria-hidden="true">'+sprite('seat-art',8)+'</span>':'';
    return '<section class="surface event-panel dinner-panel last-fish" data-guide-level="'+(guide?.hintLevel ?? 0)+'">'+
      '<h1 tabindex="-1">最后一块鱼</h1>'+
      (done?'':'<p class="dinner-goal">'+esc(guide?.goalText ?? scene.goal)+'</p>')+
      '<p class="fish-dialogue" role="status">'+esc(done?view.outcome:
        view.feedback ?? (asked?scene.actions.find(a=>a.actionId==='ask-family').feedback:scene.intro))+'</p>'+
      '<div class="dinner-room fish-room" data-decision="'+(decision ?? '')+'">'+guest+speaker+seat+plate+own+reserve+movedFish+
        '<span class="fish-target fish-player" aria-hidden="true">'+sprite('player-art',decision==='eat-fish'?2:0)+'</span></div>'+
      (!done?((guide?.hintText && guide.hintText!==guide.goalText?
        '<p class="fish-hint fine" role="status">'+esc(guide.hintText)+'</p>':'')+
        '<div class="groups dinner-controls">'+button('继续吃饭','dinner-act','keep-eating','secondary')+
        button('我能做什么？','guide-help','','small')+'</div>'):'')+'</section>';
  }

  function render(scene,view,guide,button,esc) {
    return scene.variant==='last-fish'?renderFish(scene,view,guide,button,esc):renderLegacy(scene,view,guide,button,esc);
  }

  function animateDecision(root,decision) {
    const room = root.querySelector('.fish-room');
    if (room && ['save-fish','eat-fish'].includes(decision)) room.classList.add('settling');
  }

  return {render,animateDecision};
})();
