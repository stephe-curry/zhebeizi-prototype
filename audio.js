'use strict';

globalThis.LifeAudio = (() => {
  const Context = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  const songs = {
    daily: {
      pace:.32, voice:'triangle',
      melody:[60,null,64,67,69,null,67,64,62,null,65,69,71,null,69,65,64,null,67,72,71,null,67,64,65,null,62,67,60,null,null,null],
      bass:[48,53,48,50,52,55,53,48]
    },
    memoir: {
      pace:.54, voice:'sine',
      melody:[64,null,67,69,67,null,64,null,62,null,64,67,64,null,62,null,60,null,64,67,69,null,67,null,65,null,64,62,60,null,null,null],
      bass:[48,53,45,50,48,52,53,48]
    }
  };
  const cues = {
    choose:[[72,0,.055]],
    open:[[64,0,.075],[67,.055,.11]],
    commit:[[60,0,.11],[64,.075,.11]],
    tile:[[76,0,.055],[81,.035,.07]],
    page:[[55,0,.16],[62,.08,.18]],
    keepsake:[[69,0,.12],[74,.07,.15]]
  };
  let context, music, effects, enabled=false, timer=null, mode='silent', step=0, next=0;
  function note(bus,midi,when,length,level,wave) {
    const source=context.createOscillator(), envelope=context.createGain();
    source.type=wave;
    source.frequency.value=440*2**((midi-69)/12);
    envelope.gain.setValueAtTime(0,when);
    envelope.gain.linearRampToValueAtTime(level,when+.011);
    envelope.gain.exponentialRampToValueAtTime(.0001,when+length);
    source.connect(envelope);
    envelope.connect(bus);
    source.start(when);
    source.stop(when+length+.015);
  }
  function schedule() {
    if(!enabled||!context||context.state!=='running'||!songs[mode])return;
    const song=songs[mode], now=context.currentTime;
    if(next<now)next=now+.04;
    while(next<now+.2) {
      const pitch=song.melody[step%song.melody.length];
      if(pitch!==null) {
        note(music,pitch,next,song.pace*(mode==='memoir'?1.75:.75),.24,song.voice);
        if(mode==='memoir')note(music,pitch+12,next,.24,.035,'sine');
      }
      if(step%4===0)note(music,song.bass[Math.floor(step/4)%song.bass.length],next,song.pace*2.3,.16,'sine');
      step++;
      next+=song.pace;
    }
  }
  function enable(value) {
    enabled=!!value;
    if(!enabled) {
      if(context){music.gain.value=0;effects.gain.value=0;}
      clearInterval(timer);timer=null;
      return;
    }
    if(!Context)return;
    if(!context) {
      try {
        context=new Context();
        music=context.createGain();
        effects=context.createGain();
        music.connect(context.destination);effects.connect(context.destination);
      } catch { context=null; return; }
    }
    music.gain.value=mode==='silent'?0:.09;
    effects.gain.value=.13;
    if(context.state==='suspended')context.resume().catch(()=>{});
    if(timer===null)timer=setInterval(schedule,100);
  }
  function mood(nextMode) {
    if(mode===nextMode)return;
    mode=nextMode;
    step=0;
    next=context?.currentTime ?? 0;
    if(context)music.gain.value=enabled&&mode!=='silent'?.09:0;
  }
  function play(id) {
    if(!enabled||!context||context.state!=='running'||!cues[id])return;
    for(const [pitch,offset,length] of cues[id])note(effects,pitch,context.currentTime+offset,length,.26,'sine');
  }
  return {enable,mood,play};
})();
