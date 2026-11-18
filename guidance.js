'use strict';

globalThis.LifeGuidance = (() => {
  const defaults = {emphasize:8000, explain:18000};

  // Only foreground time belongs to the current interval without progress.
  function clock() {
    let signature, elapsed = 0, since = null, manual = false;
    return {
      sample(view, now, active) {
        if (since !== null) elapsed += Math.max(0,now-since);
        const next = view && JSON.stringify([view.interactionId,view.phase,view.observed,
          view.balances,[...new Set(view.performed)],view.allowed.map(a=>a.actionId)]);
        if (signature !== next) {
          signature = next;
          elapsed = 0;
          manual = false;
        }
        since = active && view && view.phase !== 'resolved' ? now : null;
        return {elapsed,manual};
      },
      help() { manual = true; }
    };
  }

  function describe(view, timing, thresholds=defaults) {
    if (!view) return null;
    const complete = view.phase === 'resolved';
    const next = view.phase === 'explore' && view.allowed.find(a =>
      a.kind === 'observe' ? !view.observed.includes(a.objectId) :
      !view.performed.includes(a.actionId) || a.transfer);
    const goalText = {ready:'可以确认这次安排了。',preview:'看看当前安排，再决定是否确认。'}[view.phase]
      ?? (view.performed?.length && next?.goalText || view.goal);
    const instructions = next?.hintText || ({intro:'进入情境后，可自由选择可操作的对象。',
      ready:'选择「确认安排」结束本次互动。',preview:'选择「查看安排」复核当前选择。'}[view.phase])
      || (next?.label ? '可以试试「'+next.label+'」。' : '可以查看当前可用操作，或撤回上一步。');
    const hintLevel = complete ? 0 : timing.manual || timing.elapsed >= thresholds.explain ? 2 :
      timing.elapsed >= thresholds.emphasize ? 1 : 0;
    return {goalText:complete?'':goalText,recommendedObjectIds:next?[next.guideObjectId ?? next.objectId]:[],
      hintLevel,hintText:hintLevel===2?instructions:'',feedback:view.feedback,
      completionText:complete?'这次互动已结束。':'',availableHelp:!complete};
  }
  return {defaults,clock,describe};
})();
