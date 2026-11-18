const test=require('node:test'),assert=require('node:assert/strict');
require('./model.js');
for(const first of ['find','note','tell'])test(first,()=>{
  for(const last of ['lead','teacher','friend']){
    const run=Childhood.start();
    assert(Childhood.choose(run,first));assert(!Childhood.choose(run,first));
    assert(Childhood.next(run));assert(!Childhood.next(run));
    const legal=last!=='friend'||first==='find';
    assert.equal(Childhood.choose(run,last),legal);
    if(legal){assert.equal(run.facts[1].source,run.facts[0].id);assert(!Childhood.choose(run,last));}
  }
});
