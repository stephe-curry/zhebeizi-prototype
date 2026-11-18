'use strict';

(() => {
  const groups = [
    ['人物', [
      ['child-pass','童年递物','child-pass','once'],['adult-pass','青年递物','adult-pass','once'],['elder-pass','晚年递物','elder-pass','once'],
      ['child','童年伏案写字','child-writing','loop'],
      ['adult','青年敲键盘','adult-typing','loop'],
      ['elder','晚年翻相册','elder-album','loop']
    ]],
    ['道具', [
      ['lamp','台灯微闪','lamp-flicker','loop'],
      ['letter','拆开信封','letter-opening','once'],
      ['box','打开纪念箱','keepsake-box-opening','once'],
      ['album','人生回忆录翻页','memoir-album-page','once'],
      ['phone','手机亮屏通知','phone-notification','once'],
      ['console','掌机开机','handheld-startup','once'],
      ['planner','展开日历本','planner-page','once']
    ]],
    ['环境', [
      ['rain','窗前降雨','window-rain','loop'],
      ['dust','光尘浮动','window-motes','loop'],
      ['leaves','窗外落叶','window-leaves','loop'],
      ['light','窗边光斑','window-light','loop']
    ]]
  ];
  const root = document.querySelector('#clips');
  const motion = document.querySelector('#motion');
  const scenes = globalThis.LifeScenes;
  let paused = scenes.motion.matches;
  let generation = 0;
  root.innerHTML = groups.map(([title,group]) => '<section><h2>'+title+'</h2><div class="cards">'+
    group.map(([tag,label,file,play]) => {
      const frames = globalThis.LifeSprites.tags[tag];
      const duration = frames.reduce((sum,frame) => sum+frame[2],0);
      return '<article><div class="stage">'+scenes.sprite(tag,'',play)+'</div><h3>'+label+'</h3>'+
        '<p class="info">'+frames.length+' 帧 · '+duration+' 毫秒 · '+(play === 'loop' ? '循环' : '单次')+'</p>'+
        '<div class="actions"><a href="animations/'+file+'.aseprite" download>下载源文件</a>'+
        (play === 'once' ? '<button type="button" data-replay="'+tag+'">播放</button>' : '')+'</div></article>';
    }).join('')+'</div></section>').join('');

  function update() {
    motion.textContent = paused ? '播放动画' : '暂停动画';
    motion.setAttribute('aria-pressed',String(paused));
    scenes.animate(root,paused || document.hidden ? 'off' : 'on','catalog-'+generation);
  }
  motion.addEventListener('click',() => {
    paused = !paused;
    update();
  });
  root.addEventListener('click',event => {
    const replay = event.target.closest('[data-replay]');
    if (!replay) return;
    const once = root.querySelectorAll('[data-play="once"], [data-play=""]');
    for (const sprite of once) {
      sprite.dataset.play = sprite.dataset.sprite === replay.dataset.replay ? 'once' : '';
    }
    paused = false;
    generation++;
    update();
  });
  document.addEventListener('visibilitychange',update);
  update();
})();
