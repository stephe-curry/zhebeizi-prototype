'use strict';

globalThis.LifeScenes = (() => {
  const {size,tags} = globalThis.LifeSprites;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const position = ([x,y]) => (100*x/(size.w-32))+'% '+(size.h === 32 ? 0 : 100*y/(size.h-32))+'%';
  const clips = Object.fromEntries(Object.entries(tags).map(([id,frames]) => [id,{
    frames:frames.map(frame=>({position:position(frame),duration:frame[2]})),
    total:frames.reduce((sum,frame)=>sum+frame[2],0)
  }]));

  function sprite(id,style='',play='') {
    if(id==='yoyo')return '<span aria-hidden="true" class="sprite gift-inventory '+style+'"></span>';
    return '<span aria-hidden="true" class="sprite '+style+'" data-sprite="'+id+'" data-play="'+play+'" style="--atlas:'+
      100*size.w/32+'% '+100*size.h/32+'%;background-position:'+clips[id].frames[0].position+'"></span>';
  }

  let raf = 0, previousView = '';
  let starts = new Map();
  function animate(root,preference,view) {
    cancelAnimationFrame(raf);
    const reduced = preference === 'off' || preference !== 'on' && motion.matches;
    const sprites = [...root.querySelectorAll('[data-play]:not([data-play=""])')];
    if (reduced) {
      for (const element of sprites) element.style.backgroundPosition = clips[element.dataset.sprite].frames[0].position;
      starts.clear();
      return;
    }
    if (previousView !== view) { previousView = view; starts = new Map(); }
    if (!sprites.length) return;
    const now = performance.now(), counts = {};
    const players = sprites.map(element => {
      const id=element.dataset.sprite, kind=element.dataset.play, group=id+'-'+kind;
      const index=counts[group] ?? 0, key=group+'-'+index;
      counts[group]=index+1;
      if (!starts.has(key)) starts.set(key,now);
      return {element,clip:clips[id],loop:kind==='loop',start:starts.get(key),last:''};
    });

    function frame(time) {
      let again = false;
      for (const player of players) {
        const {frames,total} = player.clip, elapsed=time-player.start;
        let cursor = player.loop ? elapsed%total : Math.min(elapsed,total-1);
        const next = frames.find(frame => { cursor -= frame.duration; return cursor<0; });
        if (next.position !== player.last) {
          player.element.style.backgroundPosition=next.position;
          player.last=next.position;
        }
        again ||= player.loop || elapsed<total;
      }
      if (again) raf=requestAnimationFrame(frame);
    }
    frame(now);
  }
  return {sprite,animate,motion};
})();
