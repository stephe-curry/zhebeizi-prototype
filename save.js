'use strict';

globalThis.LifeSave = (() => {
  const C = globalThis.LifeContent;
  const key = 'zhebeizi-1.3.2-prototype';
  const version = 2;
  const isCurrent = value => value?.format === key && value.version === version;
  const fresh = () => ({version,format:key,revision:'',points:0,talents:[],trees:{},branches:{},active:null,motion:'auto',sound:false});

  function decode(json) {
    const value = JSON.parse(json);
    if (!isCurrent(value)) return null;
    for (const branch of Object.values(value.branches ?? {})) {
      const run = branch?.run;
      const session = run?.draft?.interaction;
      // The previous yoyo draft allowed a direct purchase. Restart only unfinished
      // sessions from that version, keeping the deposit and all committed facts.
      if (run?.childhood === 'spring-gift' && run.slot === 2 && run.eventId === C.giftEvents[1] &&
          run.stage === 'event' && !run.committed && session?.eventId === run.eventId &&
          session.variant === undefined) {
        delete run.draft.interaction;
        continue;
      }
      if (run?.stage !== 'event' || run.committed || run.slot !== 4 || run.eventId !== 'life-4' ||
          session?.eventId !== 'life-4' || session.variant !== undefined ||
          !Array.isArray(session.actions) || !session.actions.includes('story-2')) continue;
      const scene = globalThis.LifeEngine.currentCard(run)?.interaction;
      if (scene?.sceneId !== 'family-dinner' || scene.actions.some(action => action.actionId === 'story-2')) continue;
      // Keep the other beats. The old finish confirmed a story that is no longer eligible.
      session.actions = session.actions.filter(id => id !== 'story-2' && id !== 'finish');
    }
    return value;
  }

  function read(storage) {
    return decode(storage.getItem(key));
  }

  function write(storage,value) {
    if (!isCurrent(value)) throw Error('存档格式不匹配');
    storage.setItem(key,JSON.stringify(value));
  }

  function validateImport(incoming) {
    const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
    const id = value => typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
    const slot = value => Number.isInteger(value) && value>=1 && value<=46;
    const fact = value => record(value) && slot(value.slot) && Number.isFinite(value.age)
      && ['people','echoes','items','highlights'].every(key=>Array.isArray(value[key]))
      && value.items.every(key=>Object.hasOwn(C.items,key))
      && value.echoes.every(echo=>record(echo)&&typeof echo.text==='string')
      && (value.relations===undefined||Array.isArray(value.relations)&&value.relations.every(change=>record(change)&&Object.hasOwn(C.people,change.id)));
    const activity = value => !value || (value.kind==='study'
      ? Number.isFinite(value.deadline)&&Array.isArray(value.tiles)&&value.tiles.length===42&&value.tiles.every(tile=>Number.isInteger(tile)&&tile>=0&&tile<5)
      : value.kind==='duel'&&Array.isArray(value.rounds)&&value.rounds.length<3);
    const validRun = run => record(run) && run.scenario==='life' && C.origins.some(origin=>origin.id===run.birth)
      && slot(run.slot)
      && ['event','result','memoir'].includes(run.stage) && C.cards.some(card=>card.id===run.eventId&&card.slot===run.slot)
      && record(run.stats) && Object.keys(C.labels).every(key=>Number.isFinite(run.stats[key]))
      && ['items','people','draft','experience','highlights','project','threads'].every(key=>record(run[key]))
      && ['facts','forks','careerLog','wishLog'].every(key=>Array.isArray(run[key]))
      && Object.keys(run.items).every(id=>Object.hasOwn(C.items,id))
      && Object.keys(run.people).every(id=>Object.hasOwn(C.people,id))
      && Object.keys(run.experience).every(id=>Object.hasOwn(C.experience,id))
      && Array.isArray(run.draft.support) && run.draft.support.every(id=>Object.hasOwn(C.supports,id))
      && Array.isArray(run.draft.memory) && Array.isArray(run.draft.order)
      && run.facts.every(fact) && activity(run.activity)
      && (run.stage!=='event' || run.draft.interaction===undefined || !!globalThis.LifeInteraction.preview(run))
      && (run.stage!=='result' || record(run.result)&&record(run.result.deltas)&&fact(run.result.fact))
      && Object.values(run.items).every(item=>record(item)&&slot(item.first)&&Array.isArray(item.trail)&&item.trail.every(entry=>slot(entry.slot)))
      && (run.stage!=='memoir'||record(run.memo))
      && (!run.memo || ['timeline','career','highlights','forks','token'].every(key=>Array.isArray(run.memo[key]))
        && run.memo.timeline.every(fact) && run.memo.token.every(id=>Object.hasOwn(C.items,id))
        && record(run.memo.related) && typeof run.memo.line==='string');
    const playtest = incoming?.playtest;
    const validPlaytest = playtest===undefined || record(playtest)&&record(playtest.counts)&&Number.isFinite(playtest.turnMs)
      && Object.values(playtest.counts).every(Number.isFinite);
    return record(incoming)&&validPlaytest&&isCurrent(incoming)&&typeof incoming.revision==='string'
      && Number.isInteger(incoming.points)&&incoming.points>=0&&Array.isArray(incoming.talents)&&incoming.talents.every(id=>Object.hasOwn(C.talents,id))
      && record(incoming.trees)&&record(incoming.branches)&&Object.entries(incoming.trees).every(([name,tree])=>id(name)&&record(tree)&&C.origins.some(origin=>origin.id===tree.birth))
      && Object.entries(incoming.branches).every(([name,branch])=>id(name)&&record(branch)&&id(branch.tree)&&Object.hasOwn(incoming.trees,branch.tree)&&validRun(branch.run))
      && (incoming.active===null || Object.hasOwn(incoming.branches,incoming.active));
  }

  return {key,fresh,decode,read,write,validateImport};
})();
