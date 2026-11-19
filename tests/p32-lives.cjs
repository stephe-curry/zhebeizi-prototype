'use strict';
const youth={8:'03/establish',9:'03/revise',10:'03/revise',12:'03/register-school:verify',13:'03/paper:domain'};
const study={...youth,15:'03/enrol:compute',16:'03/course:compare',17:'03/project:repeat',21:'03/degree:defend'};
const adult={...youth,13:'03/paper:both',24:'03/ask-undergrad:check',25:'J01/shift-part',26:'03/apply-ug:check',27:'03/revise',28:'03/exam-ug:submit',29:'03/offer-ug:number',30:'03/enrol:compute',31:'03/course:compare',32:'03/project:repeat',34:'03/degree:defend'};
const esports={12:'01/establish',13:'01/replay',14:'01/pair:cover',15:'01/replay',16:'01/pair:swap',18:'01/trial:side',19:'01/roster:sub',24:'01/pro:sign',25:'01/regional:scout',27:'01/cup:play',28:'01/world-entry:list',29:'01/world-series:rotate',30:'01/retire:mentor'};
const home={25:'29/walk-block:lane',26:'29/establish',27:'29/lease-lane:solo',29:'29/settle-room:shelf',30:'29/return-home:seal',35:'29/stay:open'};
const factory={24:'J02/training:hold',25:'J02/authorize:limit',26:'J02/quality:isolate',27:'J02/release:sign',30:'J02/light-bench:sit',39:'J02/teach:second'};
const courier={24:'J03/drop:receipt',42:'J03/street:blue'};
const lives=[
 ['少年赛场','office',esports],['成年试训','office',{24:'01/open-room:fill',25:'01/establish',26:'01/replay',27:'01/pair:swap',28:'01/replay',29:'01/pair:cover',30:'01/trial:side',31:'01/roster:sub',32:'01/pro:sign',33:'01/regional:scout',34:'01/cup:play'}],
 ['竞技未竟','office',{12:'01/establish',18:'01/trial:side',20:'01/redirect'}],
 ['少年本科','office',{...study,11:'03/tutorial:explain'}],['在职重考','office',adult],['重考落选','office',{...youth,9:null,10:null,13:'03/paper:both',24:'03/ask-undergrad',25:'03/apply-ug:check',26:'03/revise',27:'03/exam-ug:submit',29:'03/redirect'}],
 ['本科后读研','factory',{...study,13:'03/paper:both',24:'03/ask-grad',25:'03/apply-ms:check',26:'03/revise',27:'03/exam-ms:submit',28:'03/offer-ms:number',29:'03/enrol-ms:compute',30:'03/course:compare',31:'03/project:repeat',33:'03/degree:defend'}],
 ['工厂附近的家','factory',home],['搬离再安顿','delivery',{...courier,...home,32:'29/lease-river:solo',33:'29/settle-room:chair',34:'29/return-home:seal',35:null,38:'29/stay:open'}],
 ['退租再寻找','delivery',{...home,30:'29/give-notice:return',31:'29/walk-block:river',32:'29/lease-river:solo',33:'29/settle-room:drawer',34:'29/return-home:seal',35:null,38:'29/stay:open'}],['租住未竟','delivery',{...courier,25:'29/walk-block:river',26:'29/establish',27:'29/lease-river:solo',29:'29/settle-room:chair',30:'29/pause'}],
 ['办公室交接','office',{25:'J01/sheet:owners',26:'J01/reuse-sheet:receipt',45:'J01/handover-sheet:file'}],
 ['并组撤岗','office',{36:'J01/redundancy:close',37:'J03/hire-delivery:accept'}],['离职再聘','office',{25:'J01/resign-office:hand',26:'J02/hire-factory:accept',27:'J02/training:hold'}],
 ['制造带教','factory',factory],['工位转向','factory',{24:'J02/training:hold',25:'J02/factory-part',26:'J02/resign-factory:hand',27:'J03/hire-delivery:accept',28:'J03/drop:receipt'}],
 ['街区老客','delivery',courier],['站点调度','delivery',{24:'J03/drop:return',41:'J03/dispatch:near'}]
].map(([name,job,actions])=>({name,job,actions,seed:({'成年试训':4,'竞技未竟':3,'工厂附近的家':9,'办公室交接':12,'街区老客':2})[name]??1}));
function main(r,life){
  const c=LifeEngine.currentCard(r),slot=r.slot;
  if(slot<=4)return {};
  const day=LifeContent.dayPlans[c.id];
  let idx=day?Math.max(0,day.costs.indexOf(1)):0;
  if(slot===7)idx=life.name==='少年本科'?1:0;
  if(slot===11)idx=life.name==='成年试训'?2:0;
  if(slot===14)idx=0;
  if(slot===23)idx=c.choices.findIndex(v=>life.id&&v.id.endsWith('-continue-study'));
  if(slot===23&&idx<0)idx=c.choices.findIndex(v=>v.commands.includes('job:'+life.job));
  if(slot===36&&c.id==='office-pivot')idx=1;
  if(slot===37&&c.id==='delivery-37'&&life.name==='站点调度')idx=1;
  if(slot===40&&c.id==='life-40')idx=life.name==='站点调度'?1:0;
  return {id:c.choices[life.mainChoices?.[slot]??Math.max(0,idx)].id,...(slot===24&&c.id==='office-24'?{inspect:1}:{})};
}
module.exports={lives,main};
