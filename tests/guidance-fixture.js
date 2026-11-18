'use strict';

// Loaded only in the isolated demo and its tests.
function createGuidanceDemo() {
  const actions = [['note','便签'],['photo','照片']].map(([id,label])=>({
    actionId:'file-'+id, kind:'manipulate',sourceId:id,objectId:'folder',guideObjectId:id,
    transfer:1,label:'收好'+label,feedback:label+'已放好。',goalText:'还有一张'+label+'，可以收进夹子。',
    hintText:'点「收好'+label+'」，把它放进夹子。'
  }));
  const event = {id:'demo-filing',slot:1,title:'整理桌面',body:'',
    choices:[{id:'demo-done',label:'收好桌上的纸张',outcome:'两张纸都收好了。',delta:{},commands:[]}],
    interaction:{sceneId:'desk',goal:'把桌上的两张纸收进夹子，先收哪张都可以。',
      objects:{note:{label:'便签'},photo:{label:'照片'},folder:{label:'夹子'}},
      balances:{note:1,photo:1,folder:0},actions,outcomes:[{balances:{folder:2},choiceId:'demo-done'}]}};
  if (!LifeContent.cards.some(card=>card.id===event.id)) LifeContent.cards.push(event);
  const run=LifeEngine.create(1);
  run.eventId=event.id;
  LifeInteraction.create(run,'demo');
  LifeInteraction.update(run,'demo','open');
  return run;
}
if (typeof module !== 'undefined') module.exports={createGuidanceDemo};
