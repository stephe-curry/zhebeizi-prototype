'use strict';

// The saved draft contains input only. Replay validates it against the current
// scene and life history before a preview or a settlement can be produced.
globalThis.LifeInteraction = (() => {
  function create(run, interactionId) {
    const scene = globalThis.LifeEngine.currentCard(run)?.interaction;
    if (!scene || !interactionId || typeof interactionId !== 'string' ||
        run.stage !== 'event' || run.committed || run.activity || run.draft.interaction) return false;
    run.draft.interaction = {eventId:run.eventId, interactionId, opened:false, reviewed:false, actions:[]};
    return true;
  }

  function available(run, scene, objectId) {
    if (!Object.hasOwn(scene.objects,objectId)) return false;
    const object = scene.objects[objectId];
    return !object.itemId || globalThis.LifeEngine.held(run.items[object.itemId]);
  }

  function permits(run, scene, state, action) {
    if (!['observe','manipulate','arrange'].includes(action.kind)) return false;
    if (action.kind === 'manipulate' && !action.sourceId) return false;
    if (!available(run,scene,action.objectId)) return false;
    if (action.sourceId && !available(run,scene,action.sourceId)) return false;
    if (action.afterObservation && !state.observed.includes(action.afterObservation)) return false;
    if (action.experienceId && !Object.hasOwn(run.experience,action.experienceId)) return false;
    if (action.requireBalance && !state.balances[action.objectId]) return false;
    if (action.incompatible?.some(id=>state.balances[id]>0)) return false;
    if (action.capacity !== undefined && state.balances[action.objectId]+action.transfer>action.capacity) return false;
    if (action.transfer !== undefined) {
      if (action.kind === 'observe') return false;
      const {sourceId,objectId,transfer} = action;
      if (!Number.isSafeInteger(transfer) || transfer <= 0 || sourceId === objectId ||
          !Object.hasOwn(state.balances,sourceId) || !Object.hasOwn(state.balances,objectId) ||
          state.balances[sourceId] < transfer) return false;
    }
    return true;
  }

  function replay(run, scene, session) {
    if (!session || session.eventId !== run.eventId || typeof session.interactionId !== 'string' ||
        !session.interactionId || typeof session.opened !== 'boolean' ||
        typeof session.reviewed !== 'boolean' || !Array.isArray(session.actions) ||
        (!session.opened && (session.reviewed || session.actions.length))) return null;
    const state = {balances:{...scene.balances}, observed:[], performed:[], feedback:null};
    for (const actionId of session.actions) {
      const action = scene.actions.find(candidate => candidate.actionId === actionId);
      if (!action || !permits(run,scene,state,action)) return null;
      if (action.kind === 'observe' && !state.observed.includes(action.objectId)) state.observed.push(action.objectId);
      if (action.transfer) {
        state.balances[action.sourceId] -= action.transfer;
        state.balances[action.objectId] += action.transfer;
      }
      state.performed.push(actionId);
      state.feedback = action.feedback ?? null;
    }
    return state;
  }

  function preview(run) {
    const event = globalThis.LifeEngine.currentCard(run);
    const scene = event?.interaction;
    if (!scene) return null;
    if (run.stage !== 'event') {
      const result = run.result?.fact?.interaction ?? run.facts.find(f => f.slot === run.slot)?.interaction;
      return result ? {...globalThis.LifeEngine.copy(result),phase:'resolved',allowed:[]} : null;
    }
    const session = run.draft.interaction;
    const state = replay(run,scene,session);
    if (!state || run.committed || run.activity) return null;
    const outcome = session.opened && scene.outcomes.find(rule =>
      (!rule.after || state.performed.includes(rule.after)) &&
      Object.entries(rule.balances ?? {}).every(([id,value]) => state.balances[id] === value) &&
      event.choices.some(choice => choice.id === rule.choiceId));
    const phase = !session.opened ? 'intro' : !outcome ? 'explore' :
      scene.requiresPreview && !session.reviewed ? 'preview' : 'ready';
    const allowed = session.opened ? scene.actions.filter(action => permits(run,scene,state,action)) : [];
    return {eventId:event.id,interactionId:session.interactionId,sceneId:scene.sceneId,
      situation:scene.situation,goal:scene.goal,phase,choiceId:outcome?.choiceId ?? null,
      ...state,allowed:globalThis.LifeEngine.copy(allowed)};
  }

  // Source, target and cost belong to the declaration. Input selects one legal
  // action ID, so a caller cannot replace its target or supply its own cost.
  function update(run, interactionId, command, actionId) {
    const view = preview(run);
    if (!view || view.interactionId !== interactionId || view.phase === 'resolved') return false;
    const session = run.draft.interaction;
    switch (command) {
      case 'open':
        if (session.opened) return false;
        session.opened = true;
        break;
      case 'act':
        if (!view.allowed.some(action => action.actionId === actionId)) return false;
        session.actions.push(actionId);
        session.reviewed = false;
        break;
      case 'undo':
        if (!session.actions.length) return false;
        session.actions.pop();
        session.reviewed = false;
        break;
      case 'cancel':
        session.actions = [];
        session.opened = false;
        session.reviewed = false;
        break;
      case 'review':
        if (view.phase !== 'preview') return false;
        session.reviewed = true;
        break;
      default: return false;
    }
    return true;
  }

  function settlement(view) {
    if (view?.phase !== 'ready') return null;
    const {eventId,interactionId,sceneId,choiceId,balances,observed,performed} = view;
    return {eventId,interactionId,sceneId,choiceId,balances,observed,performed};
  }

  function confirm(run, interactionId) {
    const view = preview(run);
    return view?.phase === 'ready' && view.interactionId === interactionId &&
      globalThis.LifeEngine.commit(run);
  }

  return {create,preview,update,settlement,confirm};
})();
