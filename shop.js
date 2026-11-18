'use strict';

globalThis.LifeShop = (() => {
  const coins=['yuanA','yuanB'];
  const goods=['blocks','ice','purse'];
  const cells={yuanA:0,yuanB:0,blocks:1,ice:2,purse:3};
  const positions={blocks:18,ice:48,purse:80};
  function render(run,view,guide,button,esc,message) {
    const scene=LifeEngine.currentCard(run).interaction;
    const done=run.stage==='result';
    const balance=view?.balances ?? scene.balances;
    const performed=view?.performed ?? [];
    const selected=done?null:run.draft.shopFocus;
    const object=scene.objects[selected];
    const recommended=guide?.recommendedObjectIds[0] ?? (!done?'yuanA':null);
    const selectedCoin=coins.includes(selected);
    function entity(id,x,y,small=false) {
      const name=scene.objects[id].label;
      const target=selectedCoin && view?.allowed.some(a=>a.sourceId===selected && a.objectId===id);
      const style='--x:'+x+'%;--y:'+y+'%;--cell:'+cells[id];
      const cls='shop-entity'+(small?' paid':'')+(selected===id?' picked':'')+
        (!done && (target || !selectedCoin && recommended===id)?' suggested':'');
      const sprite='<i aria-hidden="true"></i>';
      if(done || small)return '<span class="'+cls+'" style="'+style+'">'+sprite+'</span>';
      return '<button type="button" data-action="shop-object" data-id="'+id+'" data-object-id="'+id+
        '" aria-label="'+esc(name)+'" aria-pressed="'+(selected===id)+'" class="'+cls+'" style="'+style+'">'+sprite+'</button>';
    }
    const sold=id=>id!=='purse' && balance[id]===scene.objects[id].price;
    const items=goods.map(id=>entity(id,sold(id)?80:positions[id],sold(id)?85:id==='purse'?51:48)).join('');
    const money=coins.map((id,i)=>{
      const move=scene.actions.find(a=>a.sourceId===id && performed.includes(a.actionId));
      return move?entity(id,positions[move.objectId]+(i?4:-4),move.objectId==='purse'?55:64,true):
        entity(id,30+i*24,85);
    }).join('');
    const details=object?.price?object.label+' · ¥'+object.price:object?.label;
    const remaining=balance.yuanA+balance.yuanB;
    const goal=remaining===1 ? (balance.blocks?'积木还差一元。可以付清，也可以撤回。':
      balance.ice?'冰棍已取出。剩下一元可以放进零钱袋。':'一元已留下。另一元可以买冰棍，也可以留下。') : guide?.goalText ?? scene.goal;
    const summary=balance.blocks===2?'带走一把旧积木。':balance.ice===1?'请同学吃冰棍'+(balance.purse?'，留下一元车钱。':'。'):
      balance.purse===2?'两元都留作车钱。':balance.blocks?'积木已付 ¥1，还差 ¥1。':'';
    return '<section class="shop-panel event-panel" data-guide-level="'+(guide?.hintLevel??0)+'"><h1 tabindex="-1">校门口的小卖部</h1><p class="shop-goal">'+
      esc(done?'这次安排已收好。':goal)+'</p><div class="shop-scene">'+
      '<span class="shop-keeper">'+LifeScenes.sprite('adult-pass','','')+'</span>'+items+money+
      '</div><div class="shop-info" role="status"><strong>'+esc(done?'离开柜台':details ?? '手边的零钱')+'</strong><p>'+
      esc(done?summary:message || (selectedCoin?'拿好这一元，再点想支付的商品或零钱袋。':object?.description ?? (summary || '点商品看价格，点硬币安排去处。')))+
      '</p><small>'+esc('积木 ¥'+balance.blocks+'/2　冰棍 ¥'+balance.ice+'/1　留下 ¥'+balance.purse)+'</small></div>'+
      (guide?.hintText?'<p class="fine">'+esc(guide.hintText)+'</p>':'')+
      (done?'':'<div class="groups">'+button('我能做什么？','guide-help','','small')+
        (performed.some(id=>!id.startsWith('look-'))?button('撤回支付','shop-undo','','secondary'):'')+
        (view?.phase==='ready'?button('确认安排','commit',run.eventId,'primary'):'')+'</div>')+'</section>';
  }
  function input(run,id,source) {
    const session=run.draft.interaction;
    const view=LifeInteraction.preview(run);
    if (!session || !view || run.stage!=='event') return false;
    const move=view.allowed.find(a=>a.sourceId===source && a.objectId===id);
    if(move){
      if(!LifeInteraction.update(run,session.interactionId,'act',move.actionId))return false;
      run.draft.shopFocus=null;
      return true;
    }
    if(source && goods.includes(id)) return false;
    if(coins.includes(id) && !view.balances[id])return false;
    if(!LifeInteraction.update(run,session.interactionId,'act','look-'+id))return false;
    run.draft.shopFocus=id;
    return true;
  }
  return {render,input,coins};
})();
