'use strict';
const {main}=require('./p32-lives.cjs');
const lives=[];
function three(id,base,change,competition){
 for(const [form,actions] of [['普通',base],['改变',change],['交汇',competition]])lives.push({id,name:id+'·'+form,form,job:'office',seed:1,actions:Object.fromEntries(actions.map(([s,k])=>[s,k.includes('/')?k:id+'/'+k]))});
}
const vendor=[[24,'help'],[25,'openstall:full'],[26,'stock'],[27,'sell'],[28,'refund'],[29,'count'],[32,'sell'],[35,'count'],[41,'regular']];
three('J04',vendor,[...vendor.slice(0,6),[30,'close'],[32,'openstall:side'],[33,'stock'],[35,'sell'],[41,'regular']],[...vendor.slice(0,5),[29,'29/walk-block:lane'],[30,'29/establish'],[31,'29/lease-lane:solo'],[35,'sell'],[41,'regular']]);
const dev=[[24,'devhire'],[25,'workticket'],[26,'requirement'],[27,'debug'],[28,'review'],[29,'deploy'],[31,'support'],[35,'support'],[42,'handover']];
three('J05',dev,[...dev.slice(0,6),[29,'deploy:rollback'],[30,'deploy:gray'],[31,'support'],[35,'redundant'],[36,'reapply'],[38,'support'],[42,'handover']],[...dev.slice(0,6),[30,'07/issue'],[31,'07/establish'],[32,'07/patch'],[33,'07/reviewpr'],[34,'07/releaseoss'],[36,'support'],[42,'handover']]);
const edu=[[15,'J08/college'],[17,'J08/practicum'],[21,'J08/teachdegree'],[22,'J08/credential']];
const civil=[...edu,[24,'notice'],[25,'registercivil'],[26,'preparecivil'],[27,'written'],[28,'interview'],[29,'appoint'],[30,'acceptcase'],[31,'transfercase'],[33,'followcase'],[36,'rotation'],[42,'publicecho']];
three('J06',civil,[...civil.slice(0,-2),[36,'leaveworkJ06'],[37,'J03/hire-delivery:accept'],[42,'publicecho']],[...civil.slice(0,-2),[35,'29/walk-block:lane'],[36,'29/establish'],[37,'29/lease-lane:solo'],[42,'publicecho']]);
const cook=[[24,'apprentice'],[25,'prep'],[26,'cookorder:batch'],[30,'rush'],[34,'teachcook'],[38,'newkitchen'],[42,'tasteecho']];
three('J07',cook,[[24,'apprentice'],[25,'prep'],[26,'cookorder:hold'],[27,'remake'],[30,'rush'],[34,'teachcook'],[38,'newkitchen'],[42,'tasteecho']],[...cook.slice(0,4),[31,'30/board'],[32,'30/establish'],[33,'30/atlas'],[34,'30/book1rail'],[35,'30/leg1'],[36,'30/back1'],[38,'teachcook'],[42,'tasteecho']]);
const teach=[...edu,[24,'hireteach:city'],[25,'lesson'],[26,'planlesson'],[27,'markwork'],[30,'familytalk'],[33,'newclass'],[36,'colleague'],[42,'cityecho']];
three('J08',teach,[...teach.slice(0,-2),[36,'exitteacher'],[37,'returncity'],[39,'colleague'],[42,'cityecho']],[...teach.slice(0,9),[31,'25/visit'],[32,'25/establish'],[33,'25/vschool'],[34,'25/paperlesson'],[35,'25/housevisit'],[39,'25/reunion'],[42,'cityecho']]);
module.exports={lives,main};
