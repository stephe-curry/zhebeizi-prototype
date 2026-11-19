'use strict';
globalThis.LifeKitchenBalance=function(r){
    const balance={cash:0,orders:0,supplier:0,wages:0,delivered:0};
    for(const f of r.facts)for(const a of f.actions??[])if(a.result.kitchenLedger){
      for(const key of Object.keys(balance))balance[key]+=a.result.kitchenLedger[key]??0;
    }
    return balance;
  };

globalThis.LifeOwnsKitchen=function(r){
  for(const f of r.facts.slice().reverse()){
    for(const a of f.actions??[]){
      if(a.actionId==='J04-endfood')return false;
      if(['J04-ownkitchen','J04-reopenfood'].includes(a.actionId))return true;
    }
  }
  return false;
};
globalThis.LifeTeacherCampus=function(r){
  for(let i=r.facts.length-1;i>=0;i--){
    for(const a of r.facts[i].actions??[]){
      if(!['J08','25'].includes(a.routeIds[0])||!a.result.school)continue;
      return ({city:'城南小学',village:'石桥小学'})[a.result.school]??a.result.school;
    }
  }
  return null;
};
globalThis.LifeCareerChapters=function(routes,{desk,exam,age,last,src,method,has,passed,shift,activeStudy}){
  const get=id=>routes.find(r=>r.id===id);
  for(const [id,job,goal] of [['J04','vendor','街口文具摊'],['J06','civil','街道综合服务岗'],['J07','cook','河街饭馆厨师']]){
    routes.push({id,job,goal,type:'job',version:1,window:[23,45],contact:f=>f.careerAfter===job,wages:{full:job==='vendor'?0:300,part:job==='vendor'?0:150,leave:0,study:0},actions:[...shift(id,job)]});
  }
  function add(id,key,label,station,choices,requires=[],cfg={}){
    const {min=24,max=42,visitor=false,repeat=false,when=()=>true,result=()=>({}),test,...rest}=cfg;
    const ids=requires.map(k=>k.startsWith('J')||k.startsWith('03-')?k:id+'-'+k);
    const campus=id==='J08'&&!visitor?'城南小学':null;
    const settings={route:id,visitor,repeat,campus,when:r=>ids.every(k=>has(r,k))&&when(r),proof:r=>src(r,...ids),...rest,resolve:result};
    const methods=choices.map(([k,l,d,retry])=>method(k,l,d,retry));
    const a=test?exam(key,label,[min,max],id,station,methods,r=>src(r,...ids),test,settings):desk(key,label,[min,max],rest.kind??'investment',station,methods,settings);
    get(id).actions.push(a);
  }
  const one=(l,d)=>[['do',l,d]];
  const val=(r,id)=>last(r,id)?.a.result;
  const chance=(p,x)=>p.length+x>=2;
  function exit(id){add(id,'leavework'+id,'交还当期班表与岗位权限','离岗桌 · 完成手头交接，停止原岗收入。',one('交接并离岗','停止本岗工资，原交付与人物记录仍在。'),[],{administrative:true,repeat:true,result:()=>({newJob:null})});}
  // Inventory is a projection of committed stock movements, including returns.
  const stock=(r,product)=>r.facts.reduce((n,f)=>n+(f.actions??[]).filter(a=>a.routeIds.includes('J04')&&(!product||a.result.product===product)).reduce((s,a)=>s+(a.result.stockDelta??0),0),0);
  const open=r=>r.career!=='civil'&&val(r,'J04-openstall')&&(!has(r,'J04-close')||last(r,'J04-openstall').f.slot>last(r,'J04-close').f.slot);
  add('J04','help','帮林姨核对找零','林姨文具摊 · 一本本子售价8元，客人递来10元。',[['do','找回2元，递出本子','林姨把实收8元记进自己的账本。'],['wrong','找回8元','10减8才是找零，交易还没有完成。',true]],[],{visitor:true,min:23,result:()=>({owner:'林姨',servicePay:0})});
  add('J04','openstall','申请街口指定摊位，登记经营品类','摊位窗口 · 选用指定场所销售普通文具，核验本地登记与场所管理确认。',[['side','河街晚间摊，保留当前工作','摊位和文具供货档案已核验，个人资金独立支付进货。'],['full','迁到站口日间摊，交回原岗独立经营','结束旧聘约，往后只按实际交易取得经营收入。']],['help'],{visitor:true,repeat:true,when:r=>r.career!=='civil'&&!activeStudy(r)&&!open(r),kind:'qualification',result:(r,m)=>({place:m.id==='full'?'站口指定日间摊':'河街指定晚间摊',owner:'本人',...(m.id==='full'?{newJob:'vendor'}:{})})});
  add('J04','stock','向纸厂采购十本横线本','进货单 · 十本，每本成本3元，运费2元，现金合计32元。',[['do','订横线本，核对纸厂交货单','十本横线本验收入库。32元从个人现金付出。'],['grid','订方格本，核对纸厂交货单','十本方格本验收入库。32元从个人现金付出。']],['openstall'],{visitor:true,repeat:true,money:32,when:r=>open(r),result:(r,m)=>({product:m.id==='grid'?'方格本':'横线本',stockDelta:10,cost:30,transport:2,servicePay:0})});
  add('J04','sell','给顾客阿棠装两本库存本子','摊台 · 可用库存从进货与退货单核算。阿棠想买两本。',[['fair','每本5元，收10元交两本','阿棠拿走两本。销售收入10元，结转货物成本6元。'],['high','每本6元，收12元交两本','阿棠比较过纸质后接受价格。收入12元，结转成本6元。']],['stock'],{visitor:true,repeat:true,when:r=>open(r)&&stock(r,val(r,'J04-stock').product)>=2,result:(r,m)=>({customer:'阿棠',product:val(r,'J04-stock').product,stockDelta:-2,quantity:2,revenue:m.id==='high'?12:10,costOfGoods:6,margin:m.id==='high'?6:4,servicePay:m.id==='high'?12:10})});
  add('J04','refund','处理阿棠退回的一本未用本子','退货台 · 封面完整，来源是最近那次购买。',one('核对原价，退款并重新入库','退回一本完整商品；退款进入本期支出，成本结转冲回3元。'),['sell'],{visitor:true,repeat:true,costs:r=>({money:val(r,'J04-sell').revenue/2}),money:0,when:r=>open(r)&&(last(r,'J04-refund')?.f.slot??0)<last(r,'J04-sell').f.slot,result:r=>({product:val(r,'J04-sell').product,stockDelta:1,revenue:-val(r,'J04-sell').revenue/2,costOfGoods:-3,margin:3-val(r,'J04-sell').revenue/2,servicePay:0,customer:'阿棠'})});
  add('J04','count','收摊盘点，决定留下多少货','摊位账本 · 已收现金与还在架上的本子分别计数。',[['keep','保留本子，下次再卖','未卖库存保留原成本，现金不增加。'],['loss','受潮两本，记损耗','两本移出库存，记成本损失6元，没有收入。']],['stock'],{visitor:true,repeat:true,when:r=>open(r)&&stock(r,val(r,'J04-stock').product)>=2,result:(r,m)=>({product:val(r,'J04-stock').product,remaining:stock(r)-(m.id==='loss'?2:0),stockDelta:m.id==='loss'?-2:0,loss:m.id==='loss'?6:0})});
  add('J04','close','注销本轮摆摊安排，暂存剩余货','收摊处 · 未售本子装箱，往后可重新申请开摊。',one('停业，保留存货账','本轮停止销售。库存仍有清楚来历。'),['openstall'],{visitor:true,repeat:true,when:open,result:r=>({closed:true,remaining:stock(r),...(r.career==='vendor'?{newJob:null}:{})})});
  const foodStock=r=>r.facts.reduce((n,f)=>n+(f.actions??[]).reduce((q,a)=>q+(a.result.foodDelta??0),0),0);
  const till=globalThis.LifeKitchenBalance;
  const ownsKitchen=globalThis.LifeOwnsKitchen;
  const operating=r=>r.career==='vendor'&&ownsKitchen(r);
  const kitchen=(when=()=>true)=>r=>operating(r)&&when(r);
  const foodAction=(key,label,place,choices,requires,cfg)=>add('J04',key,label,place,choices,requires,{
    visitor:true,repeat:true,max:45,...cfg,proof:r=>{
      const opening=Math.max(last(r,'J04-ownkitchen')?.f.slot??0,last(r,'J04-reopenfood')?.f.slot??0);
      const sources=src(r,...requires.map(k=>'J04-'+k));
      for(const f of r.facts){
        if(f.slot<opening||sources.some(s=>s.slot===f.slot))continue;
        for(const a of f.actions??[])if(a.result.kitchenLedger||a.result.foodDelta||a.result.foodOwner||a.actionId==='J04-reopenfood')
          sources.push({branch:f.branch??null,slot:f.slot,eventId:f.eventId,choiceId:f.choiceId,actionId:a.actionId});
      }
      return sources;
    }
  });
  function refundableOrder(r){
    const orders=new Set();
    for(const f of r.facts)for(const a of f.actions??[]){
      if(a.actionId==='J04-endfood')orders.clear();
      if(a.actionId==='J04-servefood')orders.add(a.result.order);
      if(a.actionId==='J04-returnfood')orders.delete(a.result.order);
    }
    return [...orders].at(-1);
  }
  foodAction('depositfood','将个人现金存入食堂周转箱','周转箱 · 个人支出20元，店铺现金同额增加。',one('存入20元','周转箱增加20元。'),['ownkitchen'],{money:20,when:kitchen(),result:()=>({kitchenLedger:{cash:20}})});
  foodAction('creditfood','签收赊购食材与帮工单','验收桌 · 两份食材赊价12元，帮工已完成验收搬运，应付4元。',one('签收两份，登记两笔应付','入库两份，应付供应商12元、帮工4元。'),['ownkitchen'],{when:kitchen(),result:()=>({foodDelta:2,kitchenLedger:{supplier:12,wages:4}})});
  foodAction('prepayfood','接下两份预付订单','收银台 · 顾客预付36元，款项暂留店内。每次只接一桌待交付订单。',one('开预收回执','店内收款36元，未出菜，个人收入为零。'),['ownkitchen'],{when:kitchen(r=>!till(r).orders),result:r=>({order:'桥东-'+r.slot,kitchenLedger:{cash:36,orders:1}})});
  foodAction('servefood','交付预付订单','出菜口 · 核对预收回执、两份现有食材与桌号。',one('交付两份并注销待办','库存减二，应履约数减一。顾客此前已付款。'),['prepayfood'],{when:kitchen(r=>till(r).orders===1&&foodStock(r)>=2),result:r=>({order:val(r,'J04-prepayfood').order,foodDelta:-2,kitchenLedger:{orders:-1,delivered:1}})});
  foodAction('returnfood','按原回执退菜退款','退菜口 · 核对已交付的预付单。熟食弃置，不回到原料架。',one('退回36元，记录成菜损耗','店款退回36元，原食材已出库，不再增加库存。'),['servefood'],{when:kitchen(r=>till(r).delivered>0&&till(r).cash>=36),result:r=>({order:refundableOrder(r),kitchenLedger:{cash:-36,delivered:-1},foodLoss:12})});
  foodAction('spoilfood','清理不能再使用的食材','冷柜 · 一份食材验收后已变质。',one('登记报损，移出可用库存','报损一份，成本6元。'),['ownkitchen'],{when:kitchen(r=>foodStock(r)>0),result:()=>({foodDelta:-1,foodLoss:6})});
  function liquidation(r){const b=till(r);return b.cash-b.orders*36-b.supplier-b.wages;}
  foodAction('endfood','清算小食堂并交还场所','闭店桌 · 先退预收，再清供应商货款与帮工尾薪。余款归经营者，缺口由个人补足。',[['close','剩余食材报损，关闭场所','已清退预付款、货款和尾薪，库存清零。'],['transfer','剩余食材无偿交接给合格接手人','按清单无偿交接余料，经营责任至此结束。']],['ownkitchen'],{when:ownsKitchen,costs:r=>({money:Math.max(0,-liquidation(r))}),result:(r,m)=>{
    const b=till(r),quantity=foodStock(r);return {...(r.career==='vendor'?{newJob:null}:{}),servicePay:Math.max(0,liquidation(r)),foodDelta:-quantity,foodLoss:m.id==='close'?quantity*6:0,transferred:m.id==='transfer'?quantity:0,refunds:b.orders*36,refundedOrders:b.orders?[val(r,'J04-prepayfood').order]:[],finalWages:b.wages,paidSupplier:b.supplier,kitchenLedger:Object.fromEntries(Object.entries(b).map(([k,v])=>[k,-v]))};
  }});
  foodAction('reopenfood','重新申请场所并开业','新场所 · 重核经营许可、健康资料与租约，支付120元。',one('签新约重新开业','本次开业从空库存和零店款开始。'),['endfood'],{money:120,when:r=>!ownsKitchen(r)&&r.career!=='civil'&&!activeStudy(r),result:()=>({newJob:'vendor'})});
  foodAction('cookagain','清算后应聘受雇厨房','招聘桌 · 核验原从业经历与健康资料，按半班聘任。',one('接受受雇班表','本期按员工聘约结算，原店款已清。'),['endfood'],{when:r=>!r.career&&!ownsKitchen(r)&&!activeStudy(r),result:()=>({newJob:'cook'})});
  add('J04','ownkitchen','承租厨房，核验餐饮经营许可','经营窗口 · 受雇经验不能替代经营许可。核验场所、设备分区、食品经营许可和健康管理后才能开张。',one('办妥许可和原岗交接，支付首期场地费','桥东小食堂正式开业，结束厨师雇佣工资；食材与文具库存分别记账。'),['J07-rush'],{visitor:true,money:120,min:30,when:r=>r.career==='cook'&&!ownsKitchen(r),kind:'qualification',result:()=>({newJob:'vendor',foodOwner:true,license:'本期场所核验',owner:'本人'})});
  add('J04','foodbuy','查验并采购两份小桌食材','小食堂验收台 · 两份食材合计12元，独立记入食品库存。',one('查验来源及品质后付货款','两份食材入库，个人经营现金支出12元。'),['ownkitchen'],{visitor:true,repeat:true,money:12,when:kitchen(),result:()=>({foodDelta:2,foodCost:12})});
  add('J04','foodsell','完成小食堂一桌订单','小食堂 · 两份时蔬订单，沿用后厨规范，出菜后收取36元。',one('现炒两份，核对出菜和收款','两份实际交付，营业额36元，结转食材成本12元；本桌毛利24元，场地费另算。'),['foodbuy'],{visitor:true,repeat:true,when:kitchen(r=>foodStock(r)>=2),result:()=>({foodDelta:-2,revenue:36,costOfGoods:12,margin:24,servicePay:36,customer:'小食堂当桌客人'})});
  add('J04','regular','给多年后再来的阿棠留一本本子','街口 · 阿棠指着当年本子上那条红边。',one('翻出原购货记录，按新单交货','阿棠又买了一本，旧订单连着今天的新单。'),['sell'],{visitor:true,min:35,max:45,when:r=>open(r)&&stock(r,val(r,'J04-sell').product)>=1&&age(r)-last(r,'J04-sell').f.age>=3,result:r=>({product:val(r,'J04-sell').product,stockDelta:-1,revenue:5,costOfGoods:3,margin:2,servicePay:5,customer:'阿棠'})});
  add('J05','requirement','和站务确定夜班显示需求','工单台 · 空值表示尚未上报，0表示车已到站。',one('用空值、0和旧字符串各做一个例子','三种输入和预期输出写进公司工单。'),['workticket']);
  add('J05','debug','修复夜班显示的兼容问题','公司分支 · Number(null)得到0，旧数据还有字符串"0"。',[['fix','先判空，再转换有效数字','空值→待更新，0→到站，字符串0→到站，三例通过。'],['fast','先用Number转换所有输入','空值变成到站，测试失败，尚不能发布。',true]],['requirement']);
  add('J05','review','请同事小周审查兼容修改','审查台 · 旧终端只接受文本输出。',one('保留文本协议，补上旧终端样例','小周批准兼容修改，测试报告附在公司分支。'),['debug']);
  add('J05','deploy','选择夜班系统的发布策略','发布台 · 一个旧终端会拒绝新协议。',[['gray','先灰度两台，保留旧协议','两台灰度正常，站务确认后扩大发布。'],['rollback','试新协议，发现拒绝后回滚','旧终端拒绝新协议，回滚到上一版。需要修改后再交付。']],['review'],{repeat:true,result:(r,m)=>({project:'夜班站牌',deployed:m.id==='gray',rollback:m.id==='rollback',owner:'公交信息公司'})});
  add('J05','support','跟夜班站务复查现场反馈','站台 · 旧终端偶尔断线，但值仍显示最后一班已到。',one('显示更新时间，标记过期值','站务能分清刚到的车和昨晚留存的数据。'),['deploy'],{repeat:true,min:30,when:r=>val(r,'J05-deploy').deployed});
  add('J05','bigtest','参加大型企业客户端岗位技术面试','招聘台 · 要求真实受雇交付、旧数据兼容和线上维护经验。',one('用公司授权的脱敏报告解释回滚','技术面试和岗位匹配进入竞争评定。'),['support'],{visitor:true,test:(p,x)=>x>=0,min:31,max:38,repeat:true});
  add('J05','bigoffer','接受大型企业客户端岗位聘任','新公司 · 核对录用结果、原项目交接与新工时。',one('交接站牌项目，签新岗位','从本期在大型企业客户端组任职，仍按同一聘约机制结算。'),['bigtest'],{when:r=>passed(r,'J05-bigtest'),result:()=>({employer:'大型企业客户端组',newJob:'programmer'})});
  add('J05','redundant','项目撤并后办理离岗','人事处 · 当前岗位撤销，交付记录仍属于公司项目。',one('交接权限，领取离岗证明','原岗停止发薪。你的技术报告可以用于之后合法求职。'),['deploy'],{administrative:true,min:35,result:()=>({newJob:null})});
  add('J05','reapply','凭旧交付记录再应聘公交公司','招聘桌 · 小周还记得你留下的兼容样例。',one('复核技能，签维护岗聘约','你再次接下维护岗。收入从新的聘任开始。'),['redundant'],{visitor:true,when:r=>!r.career,result:()=>({newJob:'programmer'})});
  add('J05','handover','与下一位维护者打开旧测试','维护室 · 新人准备删掉字符串0的用例。',one('请新人对照当年的站牌输入','新人保留了样例，给你看旧站牌仍在使用的输出。'),['support'],{visitor:true,min:40,max:45});
  add('J06','notice','去招录咨询台读岗位表','公告台 · 以2026国考条件为样例推演未来街道综合服务职位，本科、不限专业，18至38岁，须核政治、国籍及其他报考条件。',one('核对岗位与已有学历','你把岗位条件记在纸上，咨询没有产生录用。'),[],{visitor:true});
  const degree=r=>has(r,'03-degree')||has(r,'J08-teachdegree');
  add('J06','registercivil','核验学历后正式报名','报名窗口 · 核对学历、身份、年龄、政治条件和职位限制。',one('核验原件，提交本届报名','本届报名确认，下一年龄年度参加考试。'),['notice'],{visitor:true,repeat:true,max:40,when:r=>degree(r)&&!activeStudy(r)&&r.career!=='civil'&&age(r)<=37,result:r=>({examAge:age(r)+1,rule:'2026国考样例未来岗位推演'})});
  add('J06','preparecivil','用公开样题练材料归纳','备考桌 · 三份申请有同一处信息缺项。',one('区分事实、规则和待核事项','归纳稿附着可核查材料，留下一次准备。'),['notice'],{visitor:true,repeat:true});
  add('J06','written','参加本届公共科目笔试','考场 · 试卷要求先找明确事实，再判断适用规则。',one('完成试卷交回答题卡','本届笔试已结束。'),['registercivil','preparecivil'],{visitor:true,repeat:true,when:r=>val(r,'J06-registercivil').examAge===age(r),test:chance});
  add('J06','interview','面试后核验体检考察与公示','面试台 · 先解释材料补正，再提出权限内的转交方案。',one('完成面试并接受后续核验','面试、体检、考察与公示流程核验完成，取得待报到通知。'),['written'],{visitor:true,kind:'qualification',when:r=>passed(r,'J06-written')});
  add('J06','appoint','凭录用通知到街道报到','机关人事 · 核验录用和试用安排，交还旧工作。',one('办理录用报到，签收职责清单','正式进入街道综合服务岗，收入改从当前岗位结算。'),['interview'],{visitor:true,kind:'qualification',when:r=>age(r)-last(r,'J06-interview').f.age<=1,result:()=>({newJob:'civil',agency:'河街街道',authority:'受理与转交'})});
  add('J06','acceptcase','受理无障碍通道整修申请','服务窗 · 市民带来路口照片，却缺准确位置。',[['map','在公共地图核对路口，再一次告知补正','来访者指出巷口位置，你给出完整补正清单。'],['pass','先盖办结章','资料不足且不属本岗审批权限，不能办结。',true]],['appoint'],{when:r=>!has(r,'J06-rotation')});
  add('J06','transfercase','把完整申请转给有权部门','流转台 · 核对补正材料，生成不含公开身份信息的回执。',[['do','先转急需通行材料，再按序发其他回执','承办部门签收HS-04，其他窗口同事接手排队材料。'],['colleague','请同事接急件，自己一次告知补正','同事登记急件转交，你向余下申请人完整解释补正项目。']],['acceptcase']);
  add('J06','followcase','按回执查询处理进度','回执台 · HS-04已由主管部门确认施工时间。',one('核对进度，告知时间和异议渠道','来访者知道下一步找哪个部门，未把转交当审批。'),['transfercase'],{min:30});
  add('J06','rotation','轮岗接手公共咨询协调','轮岗交接 · 旧办件保留编号，新岗只处理公开流程咨询。',one('交回原权限，领取新职责','转到咨询协调岗，旧受理材料交给继任者。'),['followcase'],{min:34,result:()=>({post:'咨询协调'})});
  add('J06','publicecho','在改好的通道旁看公开验收记录','街口 · 公开施工公示里写着HS-04的处理时间。',one('沿通道走一遍，查阅公开记录','你认得最初那张地图上的路口。公共记录未公开申请人资料。'),['followcase'],{visitor:true,min:41,max:45});
  add('J07','apprentice','应聘河街饭馆厨房学徒','后厨 · 核验健康与岗位培训，按食材分区与熟食交接职责上岗。',one('完成入岗核验，接学徒班表','师傅老沈把你的班表贴到备料台。'),[],{visitor:true,when:r=>!activeStudy(r),kind:'qualification',result:()=>({newJob:'cook',employer:'河街饭馆'})});
  add('J07','prep','给清炒时蔬订单核原料','备料台 · 订单两份，净菜只够一份。',[['wait','通知前厅缺一份，等补料','前厅改了出菜预估。补料验收后只登记足量订单。'],['fake','照两份出菜单记完成','原料不足，出菜单没有交给前厅。',true]],['apprentice']);
  add('J07','cookorder','按顺序完成时蔬小桌订单','灶台 · 已验收净菜两份，桌号A3；先备齐配料再下锅。',[['batch','分两次现炒，核对桌号出菜','A3收到两份现炒菜，前厅确认交付。'],['hold','一锅炒好久放，再交付','等待太久，前厅退回重做。厨房记本次损耗，员工工资按班表支付。']],['prep'],{repeat:true,steps:[{prompt:'净菜两份，原料盒与熟食盘摆在同一侧。',choices:[method('separate','分开原料和熟食用具','用具分区完成，可以接着备料。'),method('mix','共用用具省时间','交叉接触风险，先分区。',true)]},{prompt:'大火空锅持续冒烟，配料已经备好。',choices:[method('adjust','先调热源，按厨房规范分批现炒','温度调整后操作，出菜前核对成品与订单。'),method('burn','继续加火催快','火候不合适，先调整。',true)]}],result:(r,m)=>({order:'A3',delivered:m.id==='batch',returned:m.id==='hold',restaurantRevenue:m.id==='batch'?36:0,restaurantLoss:m.id==='hold'?8:0,servicePay:0})});
  add('J07','remake','按退单重做，更新出菜时间','前厅退单 · 重新验收两份净菜，旧菜按餐厅制度弃置。',one('通知前厅，重新备料出菜','A3重新签收，餐厅承担8元旧菜损耗，未向员工重复发营业额。'),['cookorder'],{when:r=>val(r,'J07-cookorder').returned,result:()=>({delivered:true,restaurantLoss:8,servicePay:0})});
  add('J07','rush','在晚高峰重排两桌工序','灶台 · A5要求少盐，A6等候时间更长。',[['order','先备A6，再单独处理A5少盐','两桌的要求分别写在出菜单，前厅按桌核收。'],['split','请老沈接A6，自己重核A5','老沈接走一桌，你留出时间核对少盐要求。']],['cookorder'],{min:30,repeat:true,when:r=>val(r,'J07-cookorder').delivered||has(r,'J07-remake')});
  add('J07','teachcook','带小许核对两张出菜单','备料台 · 小许把A5和A6的口味栏写反了。',one('请小许对照原单自己改','小许逐项读回桌号和口味，老沈让你负责下一次带班。'),['rush'],{min:34});
  add('J07','newkitchen','老店歇业，交接后应聘另一间厨房','旧灶间 · 结清原班表，新店核验经历和健康资料。',one('交还旧班表，签新店聘约','原店停止支付，你在桥东饭馆开始新班。'),['teachcook'],{min:36,result:()=>({newJob:'cook',employer:'桥东饭馆'})});
  add('J07','tasteecho','和小许再做一份老桌少盐菜','桥东饭馆 · 当年A5的客人跟小许核对过旧菜单。',one('按客人今天的要求重新核单出菜','客人认出那道菜的清脆，小许把当年的纠错单收在自己的本子里。'),['teachcook'],{visitor:true,min:41,max:45});
  add('J08','planlesson','为城南二班设计下一节课','备课本 · 乐乐算23+18时，把个位11全写在个位。',one('用十根小棒捆一束，留一根','进位的示例放进城南二班教案。'),['lesson']);
  add('J08','markwork','核对乐乐和小川的作业','作业桌 · 乐乐已会进位，小川仍把横式当竖式看。',[['different','给乐乐迁移题，给小川对齐格','两人拿到不同反馈，下一次课要分别观察。'],['same','全部重抄十遍','小川的对齐困难仍没得到说明，先改反馈再发。',true]],['planlesson']);
  add('J08','familytalk','和小川家长商量作业时间','放学门口 · 家长晚班，孩子只能独自看格纸。',one('约定一张示范卡，次晨在校核对','家长确认安排，小川第二天带着卡来询问。'),['markwork'],{min:29});
  add('J08','newclass','新学年接手城南三班','教研室 · 新班的乐乐与旧二班学生是两个人。',one('按新班册建观察记录','城南三班新名册登记，旧二班作业独立归档。'),['familytalk'],{min:32,result:()=>({classId:'城南三班',students:['小雨','阿泽']})});
  add('J08','colleague','与新老师共同修订示范卡','教研桌 · 同事提出把借位和进位画成同一种箭头。',[['colors','用方向和捆棒区分两种变化','新老师能解释两种箭头，修改进入下一版示范卡。'],['objects','保留实物操作，少画一张图','下一次教研先听学生怎样解释实物，再决定画法。']],['newclass'],{min:35});
  add('J08','returncity','核验资格后重新应聘城南小学','招聘台 · 核对有效资格、离岗记录、试教与本期空岗。',one('通过试教，签新聘约','重新在城南小学工作，旧二班材料仍独立保存。'),['credential'],{visitor:true,repeat:true,when:r=>!r.career&&has(r,'J08-exitteacher'),result:()=>({newJob:'teacher',school:'city'})});
  add('J08','cityecho','翻开旧二班留下的格纸','校友开放日 · 小川带来当年的示范卡，其他孩子未必还联系。',one('请小川讲讲现在怎样用格纸','他讲的是自己后来学会的整理办法，你认得当年那张卡的折痕。'),['familytalk'],{visitor:true,min:41,max:45});
  for(const id of ['J04','J06','J07'])exit(id);
  return {stock};
};
if(typeof module!=='undefined')module.exports=globalThis.LifeCareerChapters;
