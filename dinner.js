'use strict';

globalThis.LifeDinner = (() => {
  function render(scene, view, guide, button, esc) {
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
  return {render};
})();
