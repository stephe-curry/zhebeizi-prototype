'use strict';
globalThis.LifeDreamChapters=function({desk,exam,age,last,src,method,has,passed,shift,activeStudy}){
  const routes=[];
  function route(id,goal,job){
    const actions=[], window=[7,46];
    routes.push({id,goal,version:1,window,actions,contact:job?f=>f.careerAfter===job:()=>false,
      type:job?'job':'dream',...(job?{job,wages:{full:300,part:150,study:0,leave:0}}:{})});
    function add(key,label,station,choices,requires=[],config={}){
      const {when=()=>true,kind='investment',min=8,max=45,result=()=>({}),test,finish=false,steps,...extra}=config;
      const ids=requires.map(k=>k.includes('-')?k:id+'-'+k);
      const gate=r=>ids.every(k=>has(r,k))&&when(r);
      const methods=choices.map(([k,name,feedback,retry])=>method(k,name,feedback,retry));
      const settings={route:id,visitor:!!job,when:gate,proof:r=>src(r,...ids),...extra,
        steps:steps?.map(([prompt,yes,feedback,no,again])=>({prompt,choices:[method('check',yes,feedback),method('again',no,again,true)]})),
        resolve:(r,m,v)=>({...result(r,m,v),...(finish&&!test?{achieved:true}:{})})};
      const action=test?exam(key,label,[min,max],id,station,methods,r=>src(r,...ids),test,{...settings,completeOnPass:finish}):
        desk(key,label,[min,max],kind,station,methods,settings);
      actions.push(action);
    }
    return add;
  }
  const one=(label,detail)=>[['do',label,detail]];
  const outcome=(v,yes,no)=>v.outcome==='通过'?yes:no;
  const waited=(r,id,years)=>age(r)-(last(r,id)?.f.age??Infinity)>=years;
  const value=(r,id)=>last(r,id)?.a.result;
  const chance=(p,x)=>p.length+x>=2;
  const freeStudy=r=>!activeStudy(r);
  const h=route('02','站上奥运跨栏最高领奖台');
  h('lane','去公共跑道试跨低栏','器材室外，体育老师把软栏放在白线前。',one('用粉笔记第一步','鞋尖落在白线前半掌。老师把你的脚印留给下一组看。'),[],{kind:'contact',max:25});
  h('stride','测起跑至第一栏的步点','跑道边 · 录像里最后一步挤到了栏前。',[['do','把起点后移半脚再跑','对照两次分段，第一栏从 2.78 秒到 2.65 秒。'],['short','缩短头两步，提前进入加速','第一栏 2.70 秒。速度慢一点，却不用在栏前临时碎步。']],['lane'],{max:28,result:(r,m)=>({firstHurdle:m.id==='short'?2.70:2.65,baseline:2.78}),steps:[['慢放定格：最后两步突然变碎。','标出倒数第三个落点','教练沿粉笔线找到了步幅开始变化的位置。','只抄终点时间','终点表看不出哪一步变碎。']]});
  h('sets','给栏间三步排训练组','教练看着第四组拖长的分段，等你排下一组。',[['rest','做三组，留一段恢复','三栏分段 1.31 / 1.32 / 1.32 秒，最后一组保持了节奏。'],['push','加第四组','第四组拉到 1.48 秒。腿有不适，测评前须回队复查。']],['stride'],{max:29,result:(r,m)=>({fatigue:m.id==='push'})});
  h('recoverleg','回队做恢复测评','队医和教练重新核对活动反馈。',one('交回训练日志、降量复测','复测通过，恢复正常训练。'),['sets'],{when:r=>value(r,'02-sets').fatigue,result:()=>({healthDelta:1})});
  h('timed','在公开测评跑完全程','终点电子计时台 · 风速和全程读数分两行。',one('核对道次和读数','公开测评 14.10 秒。队里给了你一张正式赛季报名表。'),['sets'],{max:29,when:r=>!value(r,'02-sets').fatigue||has(r,'02-recoverleg')});
  h('qualmeet','参加资格期男子110米栏比赛','2035 赛季 · 本作推演的2036赛届采用巴黎样例。合法风速下以全自动计时登记。',one('压住末栏节奏，跑过终点线','本期正式成绩与风速已交技术代表。'),['timed'],{min:29,max:29,when:r=>!has(r,'02-coach'),test:chance,result:(r,m,v)=>({seconds:v.outcome==='通过'?13.26:13.48,wind:1.2,edition:2036,detail:outcome(v,'13.26 秒，顺风 1.2。成绩进入本届选派材料。','13.48 秒，本次成绩没有达到样例标准。')})});
  h('selection','向协会确认本届选派与报名','选派处 · 核对项目、成绩期、代表资格及剩余名额。',one('接受代表队名额并确认参赛','参赛名单核准，你领到了本届男子110米栏号码布。'),['qualmeet'],{min:30,max:30,kind:'qualification',when:r=>passed(r,'02-qualmeet')&&!has(r,'02-coach')});
  h('podium','上场跑预赛、半决赛和决赛','2036赛会场 · 最后一栏前，邻道已经提速。',one('守住自己的步点，压线冲刺','计时裁判复核终点照片。'),['selection'],{min:31,max:31,test:(p,x)=>p.length+x>=3,finish:true,steps:[['预赛检录：号码布与道次相符。','进本组跑道完成预赛','预赛有效，晋级半决赛。','直接去领奖区','先要上场取得成绩。'],['半决赛对手起跑很快，自己到第一栏还有半步。','用训练时记下的步点跨过第一栏','计时有效，以本组晋级成绩进入决赛。','追邻道的脚印','步幅不同，先看自己的标记。']],result:(r,m,v)=>({edition:2036,medal:v.outcome==='通过'?'gold':'silver',detail:outcome(v,'终点照片确认第一。你站上奥运男子110米栏最高一级。','终点照片确认第二。你把这枚银牌带回了公共跑道。')})});
  h('coach','收起钉鞋，回公共跑道带新人','塑胶跑道 · 当年那半掌粉笔印早就褪了。',one('给新人重画第一步','新人弯腰看了很久，把自己的第一步也描了下来。'),['timed'],{min:20,after:true,kind:'qualification'});
  const j=route('J05','公交信息公司程序员','programmer');
  j('devhire','应聘公交信息公司的维护岗','合同桌 · 入职先排半班，每期150元，之后可申请整班，公司乘车系统的源文件归公司。',one('签约并交接原岗位','领到公司工单权限，旧岗位工资停止。'),[],{min:24,max:39,kind:'qualification',when:r=>r.career!=='programmer'&&freeStudy(r),result:()=>({newJob:'programmer',owner:'公交信息公司'})});
  j('workticket','修公司站牌显示工单','公司仓库 · 末班车的空到站栏被显示为零分钟。',one('把空值显示成待更新','测试站牌显示「待更新」，变更留在公司仓库。'),['devhire'],{visitor:false});
  const d=route('07','让别人能接手自己维护的开源项目');
  d('issue','去图书馆看盲文站名表的报错','小禾在公共工具「站名簿」查首站，却看见「没有找到」。',one('拿空白站名表做最小样例','两行公开站名就能复现。小禾把预期结果 0 写在纸边。'),[],{kind:'contact'});
  d('patch','修改索引并运行公开样例','个人仓库 · findIndex 已返回 0，旧表达式 index || -1 却输出 -1。',[['fix','改成 return index，运行两例','首站 → 0；不存在 → -1。两例都通过，补丁进入个人分支。'],['offset','改成 return index + 1，运行两例','测试失败。首站预期 0 得到 1，缺站预期 -1 得到 0。补丁尚不能提交。',true]],['issue'],{steps:[['失败样例：首站实际 -1，预期 0。','检查 0 被当作假的分支','找到错误发生在查找之后。','给所有下标加一','使用者约定首站下标从零开始。']],result:()=>({project:'站名簿',owner:'本人',tests:[['首站',0],['缺站',-1]].map(([input])=>[input,['首站','次站'].indexOf(input)])})});
  d('licensework','在公司取得公开适配器的贡献许可','法务确认 · 私有站牌代码留在公司，只允许在公共接口上重写适配器。',one('从空文件重写适配器，并由公司签许可','公开适配器只有这一份提交，接口可供站名簿使用。公司按原聘约付薪。'),['patch','J05-workticket'],{workRoute:'J05',when:r=>r.career==='programmer',result:()=>({project:'站名簿',component:'公开适配器',license:'MIT',owner:'公交信息公司授权',servicePay:0})});
  d('reviewpr','按审查意见提交补丁','小禾回信：两个同名站，该保留哪一个？',one('加同名站测试，保留第一次匹配','三条测试随 PR 合并，作者栏保留你的名字。'),['patch']);
  d('releaseoss','给站名簿打公开版本','发布台 · 代码来自个人仓库，样例由二人同意公开。',one('附 MIT 许可与署名，发布 v1.0','首个公开版本附着合并记录与许可。'),['reviewpr'],{kind:'qualification',result:()=>({version:'1.0',license:'MIT',project:'站名簿'})});
  d('adopt','陪读者把旧表迁到公开版','图书馆借阅台 · 使用者的小屏漏了一列站名。',one('用读者两行样例复查','图书馆在自己的站牌上采用了 v1.0。小禾寄来适配小屏的贡献。'),['releaseoss'],{when:r=>waited(r,'07-releaseoss',1)&&!has(r,'07-transfer')});
  d('maintain','评审外部贡献并发布兼容版','维护台 · 小禾的补丁能装进小屏，旧格式也要能读。',one('跑新旧格式测试并署名发布','合作者和图书馆一起等迁移结果。'),['adopt'],{test:chance,finish:true,when:r=>waited(r,'07-adopt',1)&&!has(r,'07-transfer'),result:(r,m,v)=>({version:v.outcome==='通过'?'1.1':'1.1-rc',detail:outcome(v,'图书馆回报迁移成功。v1.1 里有小禾自己的贡献，你们约好轮值维护。','读者仍需旧格式，候选版撤回。旧版继续可用。')})});
  d('transfer','交出站名簿维护权','项目页 · 把待复核的样例和版本历史交给下一位维护者。',one('移交权限并保留贡献记录','接手人从你留下的失败样例开始工作。'),['releaseoss'],{after:true,kind:'qualification'});
  const med=route('08','成为在医院外科团队执业的医生');
  med('observe','在医院开放日听一次交班','带教陈老师递过一份匿名模拟病历，两页的编号不一样。',one('圈出不一致的编号','陈老师留下你的便签，让你看看团队怎样暂停交接、重新核对。'),[],{kind:'contact'});
  med('medexam','报名并参加临床医学本科入学考试','报名台 · 本场景核验高中毕业资格、选科、非在籍状态，提交本届志愿。',one('核材料、交卷并等待录取','本届考试和志愿已经归档。'),['observe'],{min:13,max:33,test:(p,x)=>x>=-1,repeat:true,when:freeStudy,result:(r,m,v)=>({year:2008+age(r),detail:outcome(v,'五年制临床医学专业发来本届录取通知。','本届未获录取，可以重新参加后续年度考试。')})});
  med('medentry','到临床医学院办理入学','注册处 · 五年全日制学习，需要结束旧岗位。',one('交回班表，领取培养手册','临床医学本科正式注册。'),['medexam'],{kind:'qualification',when:r=>freeStudy(r)&&passed(r,'08-medexam')&&age(r)-last(r,'08-medexam').f.age<=1,result:r=>({newJob:null,entryYear:2008+age(r)})});
  med('inventory','在模拟室与带教核对器械包','学习台 · 清单六件，摆台五件，一件仍在回收盒。',one('暂停签字，与带教逐项复点','六件确认齐全。带教在你的训练手册上签了名。'),['medentry'],{when:r=>LifeChapters.specialStudy(r)});
  med('diploma','提交临床轮转档案完成毕业考核','答辩室 · 带教要看轮转签章和当年的清点记录。',one('核验五学年、轮转和毕业考核','临床医学本科毕业证进入学历档案。'),['medentry','inventory'],{kind:'qualification',when:r=>LifeChapters.specialStudy(r)&&waited(r,'08-medentry',5)});
  med('practice','进入基地参加有指导的临床实践','教学病区 · 交班夹里一张观察单缺复核签名。',one('标记未签栏，请陈老师复核','陈老师补做核对，监督实践从这期开始登记。'),['diploma']);
  med('licexam','参加临床类别医师资格考试','考务台 · 核验相应本科学历、满一年指导实践与考核证明。',one('核验实践期，完成两部分考试','成绩按本届考试结算。'),['practice'],{kind:'fate-result',when:r=>waited(r,'08-practice',1),test:chance,repeat:true});
  med('registermed','向执业地点办理注册','登记台 · 资格、健康材料、机构与外科执业范围分别核对。',one('核对机构及范围，领取注册记录','注册完成，仍需完成岗位培训与院内授权。'),['licexam'],{kind:'qualification',when:r=>passed(r,'08-licexam')});
  med('residency','进入外科住培基地轮转','带教室 · 交接顺序中，身份待核的一页混入了已核材料。',one('将待核项移到交班首位','你在指导下完成病例讨论，基地开始记录轮转年限。'),['registermed']);
  med('appointmed','核验住培结业并接受医院聘任','医院聘任处 · 三年外科住培、结业考核、注册与团队职责逐项确认。初聘半班150元，可改签整班。',one('签外科团队聘约与排班表','正式受聘。你负责经授权的交班、查对与团队工作。'),['residency'],{max:42,kind:'qualification',when:r=>waited(r,'08-residency',3),result:()=>({newJob:'surgeon'})});
  med('handoff','在外科病区完成正式交班','夜班交接 · 先确认编号，再和下一班复述未完成事项。',one('请接班同事复述待核项','同事准确复述，陈老师在远处朝你点头。'),['appointmed'],{workRoute:'MED',kind:'qualification',finish:true,when:r=>r.career==='surgeon',steps:[['两张记录同姓，编号分别为 041、014。','按编号分别归夹','交接对象确认。','按姓氏叠到一起','编号不一致，交接暂停。']]});
  med('medreview','离岗后申请重新核验执业条件','医务处 · 核对原注册、离岗时长及适用考核，重新取得本院授权。',one('补齐复核与培训档案','主管部门依中止年限核验，符合重新注册条件时办妥重新注册。本次可再应聘。'),['appointmed','MED-exitsurgeon'],{result:r=>({renewedRegistration:waited(r,'MED-exitsurgeon',2),registrationChecked:true}),after:true,kind:'qualification',repeat:true,when:r=>r.career!=='surgeon'&&(!has(r,'08-medreview')||last(r,'08-medreview').f.slot<last(r,'MED-exitsurgeon').f.slot)});
  med('medreturn','凭复核记录重签外科岗位','聘任窗口 · 旧权限已回收，再次签订团队岗位聘约。',one('签新聘约，交接现在的岗位','从本期回到外科团队工作。'),['medreview'],{after:true,kind:'qualification',repeat:true,max:42,when:r=>r.career!=='surgeon'&&last(r,'08-medreview').f.slot>last(r,'MED-exitsurgeon').f.slot,result:()=>({newJob:'surgeon'})});
  med('round','带新人复查一次交班记录','病区白板 · 新同事只抄了完成项，还有一处待确认。',one('两班对读，把待核项目留下','新同事用自己的话复述了未完成的一项。'),['handoff'],{workRoute:'MED',after:true,repeat:true,when:r=>r.career==='surgeon'});
  const song=route('11','在万人现场唱自己的歌');
  song('verse','记下街口雨棚下的一句歌','雨打在两只倒扣的铁盆上，一轻一重。',one('把「等雨停，再走」哼给自己','第一句写在收据背面。曲名暂定《雨棚》。'),[],{kind:'contact'});
  song('compose','为《雨棚》排重音','排练桌 · 四拍里留出一个能听见雨的空拍。',[['rain','重音放在「雨」，尾拍留白','第一版慢下来，第四拍只有铁盆声。'],['walk','重音放在「走」，末拍上行','第一版往前推，收尾的音比前句高。']],['verse'],{result:(r,m)=>({work:'雨棚',version:1,motif:m.id,writer:'本人'})});
  song('record','与鼓手重录第二版','耳返慢了一拍。鼓手阿意举起鼓棒等你给起拍。',one('关掉延迟返送，按手势合一遍','第二版录音留下两个人的起拍，词曲署你，编曲署阿意。'),['compose'],{money:0,result:r=>({work:'雨棚',version:2,motif:value(r,'11-compose').motif,credits:['本人','阿意']})});
  song('club','签小场邀约，带乐队实际演出','麦仓小厅 · 售出 68 张票，核销 61 张。劳务费合计80元。',one('试听耳返，向61位到场听众唱完','唱到空拍时有人轻敲桌面。主办按合同付了80元。'),['record'],{min:15,result:()=>({venue:'麦仓',role:'签约演唱者',attended:61,servicePay:80,unpaidShift:true})});
  song('invite','带录音去谈体育馆专场','主办桌 · 许可场馆容量12000，制作方要求完整小场履约单。',one('提交录音与履约证明','主办核验档期和巡演预算。'),['club'],{test:chance,repeat:true});
  song('contractgig','在专场合同上确认档期','制作办公室 · 签约不等于演出。场馆验票后再结算。',one('约定演期与一次性演出费','主办留出场馆档期，演出必须在下一年龄年度内完成。'),['invite'],{kind:'qualification',when:r=>passed(r,'11-invite'),result:r=>({until:age(r)+1})});
  song('headline','到场完成《雨棚》专场','体育馆后台 · 核销 10216，鼓手在黑场里寻找你的手势。',one('给鼓手起拍，与听众唱完返场','10216 人实际入场。末拍落下，万人的回声慢了一拍回来。'),['contractgig'],{kind:'qualification',when:r=>age(r)<=value(r,'11-contractgig').until,finish:true,result:()=>({role:'签约演唱者',attended:10216,work:'雨棚',version:2,servicePay:450,unpaidShift:true})});
  song('reprise','重返麦仓，演出《雨棚》的双人版','阿意把旧收据放回鼓上。当年坐在窗边的听众来听返场。',one('按原来停顿给阿意一个空拍','小厅这晚验票49人，按新场次结清60元。'),['club'],{after:true,min:29,when:r=>waited(r,'11-club',2),result:()=>({work:'雨棚',version:3,attended:49,servicePay:60,unpaidShift:true,role:'签约演唱者'})});
  const film=route('12','从群演走到最佳演员领奖台');
  film('extra','在《渡口》招募处接背景角色','渡口外景 · 正规招募，成年群演一个班次，现场结费。',one('按场记的标记走过镜头','你在第三排提着篮子走过码头。领到当天40元，有背景出演记录。'),[],{kind:'contact',min:13,result:()=>({film:'渡口',role:'背景行人',servicePay:40,unpaidShift:true})});
  film('partner','与对手排练那句「船还没来」','剧本里妹妹已经买好了两张票，却把一张藏在袖口。',[['wait','望向袖口，停半拍再回答','对手把手缩回去。这次停顿留下两个人之间的秘密。'],['turn','背过身，压低声音再回答','对手把票摊开，你在她开口以前没有回头。']],['extra']);
  film('audition','试镜新片《潮痕》的姐姐','导演把第二遍留给你，要求听见妹妹的话以后再动。',one('接住对手最后一个字再转身','试镜带和角色意图一起交给选角组。'),['partner'],{test:(p,x)=>p.length+x>=1,repeat:true,result:()=>({unpaidShift:true})});
  film('shoot','签角色合同并拍第二场','机位右移了一米，第一次走到遮挡里。场记亮出第二条。',one('沿新标记重拍，收工签单','《潮痕》第二场第二条完成，按角色合同领取120元。'),['audition'],{when:r=>passed(r,'12-audition'),result:()=>({film:'潮痕',role:'签约演员',take:2,servicePay:120,unpaidShift:true}),steps:[['机位画幅里，近侧门框遮住脸。','移动到远侧粉笔线','焦点落回眼睛。','照第一条原样走','监视器里仍被门框挡住。']]});
  film('cut','与制片核对终剪及署名','剪辑房 · 放映方提供影院长版与无姐姐段落的短版。',[['long','确认长版署名和使用授权','长版采用第二条，你在角色表中署名「姐姐」。'],['short','只授权不含该段的短版','发行拷贝删去了这一段，已付片酬仍归你。']],['shoot'],{kind:'qualification',result:(r,m)=>({credited:m.id==='long',edition:m.id})});
  film('releasefilm','交付成片并参加国内首映','影院放映室 · 锁定完成日期、拷贝和首映范围，版权方可选择是否随后上网。',[['local','只在本国影院首映','国内首映结束，发行拷贝有明确完成日期，海外及网络首映权仍在。'],['stream','影院首映后授权网络播放','网上也能看到这部片，已使用网络首映权。']],['cut'],{kind:'qualification',result:(r,m)=>({film:'潮痕',edition:value(r,'12-cut').edition,completionYear:2008+age(r),internet:m.id==='stream',abroad:false})});
  film('festival','由制片方向主竞赛递交长片','选片室 · 以戛纳2026章程为本作未来赛季样本。6月完成的国内首映长片可报次年5月场，核对权利、字幕、法国院线承诺和参赛版。',one('由权利人送审并确认主竞赛邀请','选片委员会邀请《潮痕》进入本届主竞赛，留存有署名的长片拷贝。'),['releasefilm'],{kind:'qualification',when:r=>{const cut=value(r,'12-releasefilm');return value(r,'12-cut').credited&&!cut.internet&&!cut.abroad&&2008+age(r)===cut.completionYear+1;},result:r=>({edition:2008+age(r),section:'主竞赛',film:'潮痕',rule:'Cannes-2026',frenchRelease:true})});
  film('jury','随主竞赛剧组出席本届表演奖终评','影节放映厅 · 本作推演赛季，参评表演是《潮痕》中实际采用的姐姐。终评由评审团决定。',one('随剧组看完参评拷贝，等待终评','评审看完同一版拷贝，进行终评。'),['festival'],{when:r=>value(r,'12-festival').edition===2008+age(r),test:(p,x)=>p.length+x>=2,finish:true,result:(r,m,v)=>({award:outcome(v,'戛纳主竞赛最佳女演员（游戏推演）',null),detail:outcome(v,'评审将最佳女演员颁给《潮痕》的姐姐。妹妹的扮演者从观众席向你举起两张票。','终评选中了另一位演员。你和对手演员一起看完片尾。')})});
  film('againfilm','跟当年的对手演员读新戏','旧片放映结束，扮妹妹的演员拿来一页新剧本。',[['read','接一场有偿围读','两人重新找回那半拍停顿，这次围读按约结付50元。'],['family','谢绝围读，留出家庭时间','你把旧票还给她，约好等下次档期。']],['releasefilm'],{after:true,min:27,result:(r,m)=>({role:m.id==='read'?'签约演员':null,servicePay:m.id==='read'?50:0,unpaidShift:m.id==='read'})});
  const teacher=route('J08','取得小学教师聘任','teacher');
  teacher('college','报读四年制小学教育本科','招生桌 · 核对应届或往届报考资格，完成本届考试、录取核验与报到。',one('凭录取材料办理报到','四年制小学教育本科注册，班表交回原单位。'),[],{min:15,max:32,when:freeStudy,kind:'qualification',result:r=>({newJob:null,entryYear:2008+age(r)})});
  teacher('practicum','在导师旁试讲分数','实习课 · 有孩子把长短不同的两张纸各折一半。',one('先对齐相同纸条，再比较','导师在实习记录上写下「先说明整体」。'),['college'],{when:r=>LifeChapters.specialStudy(r)});
  teacher('teachdegree','核验本科修业和实习档案','教务处 · 学分、毕业考核和小学实习须全部核验。',one('提交实习记录，完成毕业核验','拿到小学教育本科毕业证。'),['practicum'],{when:r=>LifeChapters.specialStudy(r)&&waited(r,'J08-college',4),kind:'qualification'});
  teacher('credential','参加小学教师资格考试和认定','认定窗口 · 完成笔面试，核对学历、普通话、体检与认定材料。',one('完成试讲，提交认定材料','本场小学教师资格认定通过，等待具体学校招聘。'),['teachdegree'],{kind:'qualification'});
  teacher('hireteach','接受学校小学岗位聘任','区内招聘 · 两所学校各有空缺，初聘半班150元，可改签整班。试教和材料核验通过后选一所。',[['city','签城南小学聘约','从本期起在城南小学按班表工作。'],['village','签石桥小学聘约','从本期起在石桥小学按班表工作。']],['credential'],{kind:'qualification',max:40,result:(r,m)=>({newJob:'teacher',school:m.id})});
  teacher('lesson','给自己班上的孩子上第一堂课','班上两张纸一样长，学生把折出来的四份当成四张纸。',one('让同桌合回原来的整体','你和学生一起在板上记下「一张纸」的单位。'),['hireteach'],{visitor:false});
  const t=route('25','在乡村学校留下多年课堂');
  t('visit','到石桥小学旁听一节课','石桥小学开放日 · 年级组正在收集能带进课堂的旧包装纸。',one('坐在后排，记下纸条长短不同的问题','老师把一张用过的教案交给你，邀请你下次再来。'),[],{kind:'contact'});
  t('vschool','到石桥小学办理到岗或调动','办公室 · 核对小学资格、原校交接和石桥空岗。',one('与两校核对班表，接下石桥三班','班册上有阿苇与小田。你在石桥接班，工资只从当前聘约结算。'),['J08-hireteach'],{kind:'qualification',when:r=>r.career==='teacher',result:()=>({school:'石桥小学',classId:'石桥三班',students:['阿苇','小田']})});
  t('paperlesson','用两张包装纸改阿苇的讲法','石桥三班 · 阿苇说「四分之一一定比二分之一短」，手里却拿着两根长度不同的纸。',one('让阿苇选相同的整体再折','阿苇重新比过，把「同一张纸」补进了自己的解释。'),['vschool'],{workRoute:'J08',money:5,when:r=>r.career==='teacher'&&posted(r)==='石桥小学',steps:[['桌上只有一大一小两张纸。','裁出两根等长纸条','全班有了相同的比较起点。','直接按折痕个数比','两根原本不同长，结果解释不通。']]});
  t('housevisit','放学后去家访','小田最近早走，家里只有天黑前的一班车。',one('先听车次，再和家人约早读补讲','小田在早班车的车票背面记下了下次见面时间。'),['paperlesson'],{when:r=>r.career==='teacher'&&posted(r)==='石桥小学'});
  t('reunion','几年后听同一班学生再讲一次','石桥教室 · 阿苇带来两根等长纸条，小田已搬家。',one('让阿苇自己讲，给小田留一封信','阿苇讲完了当年的题，信能不能寄到还要等。'),['housevisit'],{when:r=>r.career==='teacher'&&posted(r)==='石桥小学'&&waited(r,'25-paperlesson',3),test:chance,finish:true,result:(r,m,v)=>({student:'阿苇',detail:outcome(v,'阿苇给低年级讲明白了那道题。小田的信退了回来，你仍记得两个孩子不同的路。','这次话讲到一半铃就响了。阿苇把纸条留给了你。')})});
  const posted=r=>[last(r,'25-vschool'),last(r,'25-backcity'),last(r,'25-backvillage')].filter(Boolean).sort((a,b)=>b.f.slot-a.f.slot)[0]?.a.result.school;
  t('backcity','交班后调回城南小学','石桥校务处 · 保存三班教案，跟接班人核对学生名册。',one('交还班册，签城南的新班表','原班教案留在石桥。调动后的工资只从现学校结算。'),['vschool'],{after:true,kind:'qualification',repeat:true,when:r=>r.career==='teacher'&&posted(r)==='石桥小学',result:()=>({school:'城南小学'})});
  t('backvillage','重新应聘石桥小学空缺','石桥校务处 · 核验在职资格与本期空岗。',one('交接城南岗位，签新班表','石桥再次接收你的聘任。旧班册按年份保管。'),['backcity'],{after:true,kind:'qualification',repeat:true,when:r=>r.career==='teacher'&&posted(r)==='城南小学',result:()=>({school:'石桥小学'})});
  const world=route('30','分三段走过六国四区，再把路线合起来');
  world('board','到车站听旅人讲一张换乘票','站台 · 旅人把票根翻过来，背后是未接上的两段线。',one('问清换乘和回程的区别','你在自己本子上画下第一段空线。'),[],{kind:'contact'});
  world('atlas','在地图上圈出三段环线','路线本 · 东亚双城、欧洲双城，再接东非与北美。',[['rail','优先公共交通与合住','在六个落点旁分别留了交通与床位预算。'],['room','预留单间与改约金','住宿费用较高，给中断旅程留了退路。']],['board'],{result:(r,m)=>({plan:m.id})});
  const legs=[['日本','韩国','东亚','东亚','渡船','港口绘图员','潮汐手绘图'],['法国','德国','欧洲','欧洲','列车','旧书摊主','双语书签'],['肯尼亚','加拿大','东非','北美','航班','车站志愿者','两地候车笔记']];
  legs.forEach(([a,b,ra,rb,vehicle,person,item],i)=>{
    const n=i+1,book='book'+n,travel='leg'+n,back='back'+n,prior=i?'back'+i:'atlas';
    for(const [plan,rate] of [['rail',120],['room',180]]){
      world(book+plan,'预订'+a+'—'+b+'往返与住宿','售票台 · 查验两地适用证件与过境材料。此为预约下一次出发的预算单，出发当期重新核验有效证件。',one('确认住宿及票价，付不可退订金','票据已付款。下个出行窗口凭票核验，逾期重新订。'),[prior],{min:23,max:44,money:rate+n*25,repeat:true,kind:'qualification',when:r=>value(r,'30-atlas').plan===plan&&!passed(r,'30-'+travel)&&(!has(r,'30-'+book+plan)||waited(r,'30-'+book+plan,2)||(last(r,'30-cancel'+n)?.f.slot??0)>last(r,'30-'+book+plan).f.slot),result:r=>({expires:LifeContent.ages[Math.min(r.slot,45)],countries:[a,b],paid:rate+n*25})});
    }
    const booking=r=>last(r,'30-'+book+value(r,'30-atlas')?.plan);
    const openBooking=r=>{const b=booking(r);return b&&b.a.result.expires>=age(r)&&b.f.slot>(last(r,'30-cancel'+n)?.f.slot??0)&&b.f.slot>(last(r,'30-'+travel)?.f.slot??0);};
    world('cancel'+n,'取消第'+n+'段预订','票务柜台 · 不可退订金已经支付，注销两站名单并保留取消凭据。',one('取消车票与床位','这次没有出发，也没有产生旅伴或照片。'),[prior],{kind:'qualification',repeat:true,when:openBooking,proof:r=>[booking(r).source],result:()=>({cancelled:true,countries:[]})});
    world(travel,'从'+a+'接上去'+b+'的'+vehicle,'行程现场 · 原班次因天气中断，下一班仍可换乘。核对单列明两地护照、准入许可与回程预订。',[['draw','抵达后与'+person+'一起绘图','在'+a+'和'+b+'停留后，你与'+person+'比对了两张图，把'+item+'贴进旅途本。'],['ask','跟'+person+'沿街走，记下声音','在'+a+'和'+b+'停留后，你跟着'+person+'走过候车区，在'+item+'背后记下沿街听见的声音。']],[prior],{money:45,min:24,when:openBooking,proof:r=>[booking(r).source,...src(r,'30-'+prior)],test:(p,x)=>p.length+x>=0,repeat:true,steps:[['原班次已停，地图有一条可换乘线。','连上下一班并留出住宿','换乘段连通，回程座位仍有效。','沿原票登车','该班次已经停运。'],['抵达'+a+'后，路线图指向'+b+'；行李上还贴着去程标签。','在图上接到'+b+'并核对换乘单','第二段目的地与车票相符。','接回出发地','少了一段，无法抵达约定地点。'],['边检需要核对两站及过境材料。','出示两地许可并复核有效期','证件材料核对完毕，等待实际放行。','只出示付款页','订票页无法替代准入材料。']],result:(r,m,v)=>({unpaidShift:true,activity:v.outcome==='通过'?m.id:null,countries:v.outcome==='通过'?[a,b]:[],regions:v.outcome==='通过'?[ra,rb]:[],person:v.outcome==='通过'?person:null,detail:outcome(v,m.detail,'天气延误超过末班，行程取消。订金与补给已花去，没有新增到访。')})});
    world(back,'结束第'+n+'段，带着'+item+'返家','回程台 · 把两地到访与返程票依次贴回路线本。',one('接上返程线并收好票根','第'+n+'段回到出发地。'+item+'被留在这一页。'),[travel],{when:r=>passed(r,'30-'+travel),kind:'qualification',finish:n===3,result:()=>({returned:true,item,unpaidShift:true})});
  });
  world('oldmap','把三张归程票展开给家人看','饭后桌边 · 从同一段实际到访里挑一件能讲清来历的东西。',one('沿第一段票根给家人重画换乘','你记得那个港口绘图员。家人认出了票背上当年记的线。'),['back1'],{after:true,min:35,when:r=>waited(r,'30-back1',2)});
  for(const [id,job] of [['J05','programmer'],['J08','teacher'],['MED','surgeon']]){
    if(id==='MED')route(id,'医院外科工作','surgeon');
    const target=routes.find(q=>q.id===id);
    target.actions.push(...shift(id,job));
    target.actions.push(desk('exit'+job,'办理离岗交接',[24,44],'qualification','人事处 · 交回班表和岗位权限。',one('交接手头工作','原岗位停止发薪。').map(c=>method(...c)),{route:id,administrative:true,repeat:true,when:r=>r.career===job,resolve:()=>({newJob:null})}));
  }
  (globalThis.LifeCareerChapters??require("./career-chapters.js"))(routes,{desk,exam,age,last,src,method,has,passed,shift,activeStudy});
  return routes;
};
if(typeof module!=='undefined')module.exports=globalThis.LifeDreamChapters;
