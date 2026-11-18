'use strict';
const M=Childhood,G=LifeGuidance,s=M.start(),clock=G.clock(),atlas=new Image();
const $=q=>document.querySelector(q),ctx=$('canvas').getContext('2d');
const preferred={A:'find',B:'tell'}[location.hash.slice(1)]||'find';
let timer;
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function actor(tag,x,y,size){
  if(!atlas.naturalWidth)return;
  const [sx,sy]=LifeSprites.tags[tag][0];ctx.drawImage(atlas,sx,sy,32,32,x-size/2,y-size,size,size);
}
function bottle(x,y){rect(x+2,y,4,2,'#533d37');rect(x,y+2,8,10,'#71463c');rect(x+1,y+3,6,8,'#bf5e46');rect(x+2,y+4,2,4,'#f6c99b');}
function paint(first,last){
  ctx.imageSmoothingEnabled=false;
  rect(0,0,160,112,'#edcf9a');rect(0,13,160,46,'#b98b6d');rect(0,17,160,39,'#efd8a7');
  for(const x of [6,37,69]){rect(x,21,24,24,'#705747');rect(x+2,23,20,20,'#a6babc');rect(x+11,23,2,20,'#e7cf9e');rect(x,34,24,2,'#ddbd91');}
  rect(119,18,26,42,'#765749');rect(122,21,20,38,'#68594e');rect(122,22,15,36,'#a67c55');rect(118,59,30,4,'#a28c77');
  rect(0,64,160,48,'#c8ad8a');for(let y=74;y<112;y+=14){rect(0,y,160,1,'#b79a7d');for(let x=(y%3)*9;x<160;x+=33)rect(x,y,1,14,'#b79a7d');}
  rect(1,0,4,81,'#765842');rect(0,0,38,9,'#758562');rect(0,8,22,7,'#889263');
  rect(7,82,34,4,'#795544');rect(10,86,3,12,'#684c3d');rect(36,86,3,12,'#684c3d');
  const six=s.age===6;
  const helped=six?first==='find':Boolean(M.recognition(s));
  const friendX=last==='friend'?114:57;
  actor('child-pass',friendX,89,33);
  if(helped)bottle(friendX+6,77);
  if(six&&!helped){
    // Only a sliver of the bottle is visible behind the bench apron.
    rect(23,88,5,6,'#a94f3d');rect(24,88,2,4,'#db8761');
  }
  actor('adult-pass',last==='teacher'?85:six&&first==='tell'?30:135,
    last==='teacher'||six&&first==='tell'?101:76,40);
  if(six&&first!=='tell')actor('child',helped?43:94,105,27);
  if(!six)actor('child',last==='lead'||last==='friend'?130:88,last==='lead'||last==='friend'?89:101,27);
}
function render(){
  clearTimeout(timer);
  const six=s.age===6,ids=M.options(s),done=!ids.length,first=s.facts[0]?.action,last=s.facts.at(-1)?.action;
  paint(first,last);
  const goal=six?'放学了，阿宁找不到红水壶，你瞥见长凳下露出一点红色，接你的人也快到了。':'低年级孩子站在门口，想找老师又不敢过去。你想怎么帮他？';
  const recommended=six?preferred:'lead';
  const view={phase:done?'resolved':'explore',goal,interactionId:'school-'+s.age,observed:[],performed:[],allowed:[...ids].sort((a,b)=>Number(b===recommended)-Number(a===recommended)).map(id=>({kind:'observe',actionId:id,objectId:id,hintText:ids.map(k=>M.actions[k][0]+'：'+M.actions[k][1]).join('；')}))};
  const timing=clock.sample(view,performance.now(),!document.hidden),g=G.describe(view,timing);
  $('#age').textContent=s.age+' 岁';$('h1').textContent=six?'放学后等一等':'又经过那条路';$('#goal').textContent=done?M.actions[last][2]:goal;
  const objects=$('#objects');objects.replaceChildren();
  function button(parent,label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;parent.append(b);return b;}
  const positions={find:[26,100],tell:[135,76],friend:[57,89],lead:[88,101],teacher:[135,76]};
  for(const id of ids){const [x,y]=positions[id],b=button(objects,'',()=>{if(M.choose(s,id))render();});b.dataset.id=id;b.setAttribute('aria-label',M.actions[id][1]);b.style.left=x/160*100+'%';b.style.top=y/112*100+'%';if(g.recommendedObjectIds.includes(id))b.className=g.hintLevel?'rec strong':'rec';}
  $('#feedback').textContent=done?(six?'放学铃响了。':'孩子和老师说上话了。'):g.hintText||(six?'你想点长凳下的红色找一找，还是点值日老师请她帮忙？':M.recognition(s)?'阿宁朝你举起红水壶：“是你呀！上次就是你从长凳下找到它，还递给我。”':'点孩子陪他过去，或点老师请她过来。');
  const foot=$('footer');foot.replaceChildren();
  if(!done)button(foot,'我能做什么？',()=>{clock.help();render();});
  else if(six)button(foot,'两年后 →',()=>{M.next(s);render();});
  else button(foot,'再走一次',()=>location.reload());
  if(!done&&!document.hidden&&g.hintLevel<2)timer=setTimeout(render,Math.max(1,(g.hintLevel?18000:8000)-timing.elapsed));
}
atlas.onload=render;atlas.src='../../assets/objects.png';document.addEventListener('visibilitychange',render);render();
