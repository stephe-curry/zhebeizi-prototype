'use strict';

// The demo uses the production renderer with an in-memory branch and save adapter.
const demoData=LifeSave.fresh();
demoData.active='demo';
demoData.branches.demo={tree:'demo',run:createGuidanceDemo()};
demoData.trees.demo={birth:demoData.branches.demo.run.birth,reward:false};
globalThis.LifeSave={...LifeSave,key:'demo-guidance',fresh:()=>demoData,read:()=>null,write:()=>{}};
document.addEventListener('DOMContentLoaded',()=>document.querySelector('.start-panel [data-action="resume"]').click());
