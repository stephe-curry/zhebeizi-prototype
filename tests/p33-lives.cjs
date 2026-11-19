'use strict';
const {main}=require('./p32-lives.cjs');
function life(id,title,form,job,entries,seed=1){
  return {id,name:title+'·'+form,form,job,seed,actions:Object.fromEntries(entries.map(([slot,key])=>[slot,key.includes('/')?key:id+'/'+key]))};
}
const lives=[];
function three(id,title,job,straight,late,unfinished){
  for(const [form,entries] of [['直路',straight],['重拾',late],['未竟',unfinished]])lives.push(life(id,title,form,job,entries));
}
const track=[[8,'lane'],[9,'establish'],[10,'stride'],[11,'sets'],[13,'timed'],[29,'qualmeet'],[30,'selection'],[31,'podium'],[35,'coach']];
three('02','第一栏','office',track,[[24,'lane'],[25,'establish'],[26,'stride'],[27,'sets'],[28,'timed'],...track.slice(-4)],[[8,'lane'],[9,'establish'],[10,'stride'],[11,'sets:push'],[13,'recoverleg'],[15,'timed'],[29,'qualmeet'],[32,'redirect']]);
const oss=[[8,'issue'],[9,'establish'],[10,'patch'],[12,'reviewpr'],[15,'releaseoss'],[18,'adopt'],[24,'maintain']];
three('07','站名簿','office',oss,[[24,'J05/devhire'],[25,'J05/workticket'],[26,'issue'],[27,'establish'],[28,'patch'],[29,'reviewpr'],[30,'releaseoss'],[32,'adopt'],[34,'maintain']], [...oss.slice(0,5),[21,'transfer'],[22,'redirect']]);
const med=[[8,'observe'],[9,'establish'],[13,'medexam'],[14,'medentry'],[17,'inventory'],[24,'diploma'],[25,'practice'],[27,'licexam'],[28,'registermed'],[29,'residency'],[33,'appointmed'],[34,'handoff']];
three('08','两张交班单','factory',med,[[24,'observe'],[25,'establish'],[26,'medexam'],[27,'medentry'],[29,'inventory'],[34,'diploma'],[35,'practice'],[36,'licexam'],[37,'registermed'],[38,'residency'],[41,'appointmed'],[42,'handoff']], [...med.slice(0,3),[16,'redirect']]);
const song=[[8,'verse'],[9,'establish'],[11,'compose:rain'],[14,'record'],[17,'club'],[24,'invite'],[25,'contractgig'],[26,'headline']];
three('11','雨棚','delivery',song,[[24,'verse'],[25,'establish'],[26,'compose:walk'],[27,'record'],[28,'club'],[29,'invite'],[30,'contractgig'],[31,'headline']], [...song.slice(0,5),[26,'pause']]);
const film=[[13,'extra'],[14,'establish'],[16,'partner'],[18,'audition'],[20,'shoot'],[22,'cut:long'],[24,'releasefilm'],[25,'festival'],[26,'jury']];
three('12','潮痕','office',film,[[24,'extra'],[25,'establish'],[26,'partner'],[27,'audition'],[28,'shoot'],[29,'cut:long'],[33,'releasefilm'],[34,'festival'],[35,'jury']], [...film.slice(0,5),[22,'cut:short'],[24,'releasefilm'],[25,'redirect']]);
const degree=[[15,'J08/college'],[17,'J08/practicum'],[21,'J08/teachdegree'],[22,'J08/credential']];
const teach=[[8,'visit'],[9,'establish'],...degree,[24,'J08/hireteach:village'],[25,'vschool'],[26,'paperlesson'],[27,'housevisit'],[33,'reunion']];
three('25','两根纸条','office',teach,[...degree,[24,'J08/hireteach:city'],[25,'J08/lesson'],[29,'visit'],[30,'establish'],[31,'vschool'],[32,'paperlesson'],[34,'housevisit'],[38,'reunion']],[[8,'visit'],[9,'establish'],...degree,[24,'J08/hireteach:city'],[25,'J08/lesson'],[26,'redirect']]);
const trip=[[8,'board'],[9,'establish'],[12,'atlas'],[24,'book1rail'],[25,'leg1'],[26,'back1'],[27,'book2rail'],[28,'leg2'],[29,'back2'],[30,'book3rail'],[31,'leg3'],[32,'back3']];
three('30','回程线','office',trip,[[30,'board'],[31,'establish'],[32,'atlas:room'],[35,'book1room'],[36,'leg1'],[37,'back1'],[38,'book2room'],[39,'leg2'],[40,'back2'],[41,'book3room'],[42,'leg3'],[43,'back3']], [...trip.slice(0,6),[29,'pause']]);
const seeds={'雨棚·直路':2,'潮痕·直路':5,'潮痕·重拾':2,'潮痕·未竟':2,'两根纸条·重拾':3,'回程线·直路':3,'回程线·重拾':5,'回程线·未竟':3};
for(const l of lives){l.seed=seeds[l.name]??1;if(l.name==='回程线·重拾'||l.name==='第一栏·重拾')l.job='factory';}
lives.find(l=>l.name==='回程线·重拾').mainChoices={31:1,32:1,33:2,35:2};
module.exports={lives,main};
