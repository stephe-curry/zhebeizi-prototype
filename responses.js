'use strict';

// A short action in an existing scene. Eligibility comes from a committed decision.
// The first column is the source choice; the number is the receiving slot.
globalThis.LifeResponses = (() => {
  const rows = [];
  const add = (choice, slot, kind, label, outcome, requires) =>
    rows.push({choice,slot,kind,label,outcome,requires});
  const many = (source, slot, actions) => actions.forEach(([kind,label,outcome,requires], index) =>
    add(source+'-'+index,slot,kind,label,outcome,requires));

  many('life-3',5,[
    ['make','用课本搭一个换车站台','两本书当月台，橡皮当车。换乘的方向摆顺了。'],
    ['talk','约冰棍摊边的同学一起认路','你们从摊位出发，各指一条近道，走到路口才分开。','person:friend'],
    ['plan','沿车站逐站核对回家路线','你在最容易坐过头的那站旁画了个圈。']
  ]);
  const meal = [
    ['0','make','用餐巾折一架桌上的飞机','机翼压平，纸飞机从两只空碗中间滑过去。'],
    ['1','care','先把盛饭的位置腾出来','盛汤的人可以把碗平放，汤没有再洒出来。'],
    ['2','care','给迟到的人倒扣一只碗','你给桌边留出一人份的地方，来晚的人也能坐下。'],
    ['turn','talk','把大家够不到的菜转过去','对面的人接住菜盘，回手把汤勺递了过来。'],
    ['reply','talk','用一件今天的小事接话','隔座的人也说起放学路上的事，这次饭吃慢了。'],
    ['ask','talk','问同桌小时候最爱吃什么','对方说了个菜名，伸手在餐巾上比画做法。'],
    ['humor','talk','拿转盘的糗事逗同桌','对方笑出了声，险些碰翻自己的空杯。'],
    ['story','talk','把那顿饭上讲过的事讲给同桌','你说完自己的那一段，旁边的人接着讲起他家的饭桌。'],
    ['quiet','rest','挑个能安静吃饭的位子','你在窗边坐下来，饭吃完才起身去还盘子。'],
    ['save-fish','care','给分菜的同学递一只干净小碗','最后一份菜盛好，盖上了盖子。'],
    ['eat-fish','care','把今天想吃的那份夹进自己碗里','你挑好鱼刺，慢慢吃完那块肉。'],
    ['keep-eating','rest','把午休留给一顿热饭','等身边的人都起身了，你才收好碗筷。']
  ];
  for(const [suffix,...action] of meal)add('life-4-'+suffix,12,...action);
  many('life-6',10,[
    ['make','给排练室松开的网袋补个结','装球的网袋重新兜住了球。'],
    ['sport','借公用球凑一场传接','今天当面借、当面还，球落在下一双手里。'],
    ['rest','在加练前留出一段午休','哨声响起时，你已经把呼吸歇匀了。']
  ]);
  add('life-6-yoyo',10,'sport','带自己的球给排练试一段','你接住收回的悠悠球，把动作卡在最后一拍。','item:yoyo');
  add('life-6-shuttlecocks',10,'sport','借场边的拍再配一次双打','你让出中线，搭档接到了落向后场的球。');
  many('life-14',15,[
    ['study','拿第一志愿和实际录取课表对照','你圈出开学后能去旁听的一节课。'],
    ['plan','按稳选专业的学费排第一周开销','把书费单列以后，你留出了够用的车费。'],
    ['make','去实训楼试着读一张工位图','你找对了材料柜。值班老师指给你看用完要归还的格子。']
  ]);
  many('school-result',17,[
    ['care','给家里报一次新课表','电话那头记下你课少的那一天，约好了下次通话。','person:parent'],
    ['talk','和阿宁按上次的步子再走一段','你们认出了以前停下来聊天的那个街角。','person:friend'],
    ['study','照课表找下一堂课的教室','你提前找到了侧门，开课时还有时间把笔记摊开。']
  ]);
  many('life-23',24,[
    ['make','试着把今天的材料分进两个文件夹','原件和待补件分开，新来的同事一次就拿对了。'],
    ['make','交班时逐项问清机台状态','停机牌交到下一双手里，两个人一起核对了编号。'],
    ['plan','把第一次认过的路口圈在站点图上','你给转弯前的减速处画了记号。'],
    ['plan','按第一趟早班的顺序排街区','店还没开门，推车经过最窄的一段时不用折返。']
  ]);
  many('life-33',35,[
    ['plan','对着已接的班次核一遍工钱','你在账单旁写下补贴到账的日期。'],
    ['make','打开约好要做的原型，试一遍开场','你记下第一个卡住的地方，改完再试，小人走出了门。'],
    ['rest','把留下的半天从排班表上划出来','手机放到另一间屋，你睡过了平常出门的时间。']
  ]);
  many('life-36',37,[
    ['plan','按谈好的钟点交一班','你和接班的人同时到场，交接单上补齐了时间。'],
    ['care','带着上周的体检单去预约','预约号夹进日历，你挪开了那天上午的安排。'],
    ['rest','照假期预算留出复工前的一天','预留款付了这天的开支，你把闹钟关掉。']
  ]);
  many('arena-final',40,[
    ['study','停在决赛录像的最后一次报点','你从两个视角对齐了那一秒，在时间轴上标出判断的先后。'],
    ['make','把场边的两处观察剪给队伍','两段短片并排放好，训练时可以来回切着看。'],
    ['rest','把旧赛程里的训练时段空出来','周末第一次没有开赛提醒，你安排了一顿不赶时间的饭。']
  ]);
  many('indie-launch',42,[
    ['make','核对提交说明里留下的问题','你把能复现的那一步记进修订单，给现有版本编号。'],
    ['study','重跑最后一轮修复的测试用例','测到转场时你停了一下，把新旧结果并排记下。'],
    ['plan','把组内版本的交接说明补全','你写清了如何启动和退出，文件留在制作组里。']
  ]);
  many('life-40',41,[
    ['make','把调整过的交接时间排进新班表','两班之间多出十分钟，可以当面交代未完的活。'],
    ['plan','给试办的调度表填一个空班','你看到了两个班次的空隙，在中间留了应急位。'],
    ['rest','用缓冲期的空下午走一条近路','你在树下坐够了一会儿，回家时天还亮着。']
  ]);

  // Each line describes a specific piece of work that can actually be used again.
  const details = `
life-1 5 talk 约找过水壶的阿宁认公交站|你们在站牌旁各认了一遍线路。|person:friend
life-2 7 study 把错题摊到旧台灯下面|光落在方格纸上，挤在页边的小字也看得清。|item:lamp
life-7 8 study 按自己分出的三组错题复查|你找到两道题共有的那个漏步。|item:notes
school-prep 9 study 带着标过的三处疑问去答疑|老师在第二问旁画了条辅助线，你自己补完余下的步骤。
life-9 11 plan 把返家的报平安时间写进排练表|你赶上原来约定的时间，到了家才放下书袋。
life-11 13 make 检查游戏机发涩的按键|你在桌边按了几次，找到了容易卡住的那个角。|item:console
school-sprint 13 study 临进场前只过那一道弱项|你合上复习纸时，已经能不看答案写出第一步。
life-13 15 study 把候场时想通的第一步写出来|第一行写得很短，后面的推导接得上了。
school-exam 15 study 把先易后难的顺序试在练习纸上|你先留白再回头，纸上最难的那格也落了笔。
life-16 17 sport 回放试训的一段配合|你停在自己抢早的一拍，照着节奏重练了一轮。
arena-club 17 sport 给练过的位置补一次报点|短局结束前，队友听清了你报的方向。
life-18 20 make 按机房的故障步骤教人排查|指示灯在第三步亮起，对方自己接着做完了。
life-19 20 make 按联调时收到的问题再跑一遍|输入到一半画面停了，你留下能重复出错的步骤。
indie-kit 20 make 开第一关给路过的人试玩|对方在同一个台阶跌了两次，你在草图旁记下高度。|item:prototype
life-20 21 talk 把交接步骤讲给招工的人|你说到第二步时，对方递过一张实际样单。
school-degree 21 make 用停机清单演示怎么找故障|你把问题缩小到一个环节，对面的人跟得上了。
life-21 23 plan 拿两份办公室班次算通勤|你用末班车时间划掉了一班赶不上的车。
arena-offer 24 plan 对着短约标出休息日|你把两次训练之间的空档留了下来。
life-24 26 plan 核对第一笔应急钱|你把固定支出先列出来，算清还留得住多少。
office-24 27 make 用打印机旁的样表改一张退件|你对着自己贴的例子把金额填回正确的一栏，小周拿走了改好的单。
factory-24 27 make 按工具清单点一次夜班工具|最后一把扳手归了位，下一班不用再找。
delivery-24 27 plan 对照画过的坡度改绕行线|你在上坡前拐弯，多留了几分钟给湿滑路面。
sanitation-24 27 plan 把背街树根标到早班图上|推车在湿滑处绕开，新记号留给下一班。
arena-start 27 study 把两份视角停在同一秒|你看清当时屏幕边缘漏掉了什么。
indie-weekend 27 make 用联调时留下的版本重测|你关掉多余的窗口，把能重现的问题留在清单上。
life-27 29 make 给交接笔记加一行联络方式|值班的人翻开第一页就找到了电话。|item:notebook
office-27 29 make 把合并过的步骤教给接班的人|对方少抄了一行，两张表的合计仍然对得上。
factory-27 29 make 对着旧清单核对温度记录|你找到漏写的那格，让交班的人补上读数。
delivery-27 29 plan 照熟悉片区安排一段雨天短线|绕开那片坡以后，你给还车留出了时间。
sanitation-27 29 plan 沿重排的顺序试一次收运|推车到路口时正好接上车，你记下新的出发时间。
arena-lineup 29 sport 用练过的报点带一次配合|你话音刚落，队友已经移到空出来的位置。
life-28 38 make 给留下的床头物重新找位置|你擦净一角，把仍在手边的旧物摆稳。|display
life-29 30 plan 对着定下的值班计划查空档|你把一个私人安排移到真正空出来的那天。
chance-old-friend 32 make 打开一起完成的草稿补交接说明|你写清了哪一页还能改，把草稿的下一步留给搭档。
life-32 33 make 把周二的材料转给接手的人|交接说明起了作用，对方找到了材料的去处。
office-32 33 make 用交接资料回答新组的问题|你在目录上标出两个入口，对方找到了要接手的文件。
factory-32 33 care 给新工位安排一次间歇|你停下来活动手腕，到点才开始下一批。
delivery-32 33 plan 用报过的慢行时间排两单|你把积水路段留足，第二单不用再抢这几分钟。
sanitation-32 33 plan 核对增补班组后的空档|你把仍没人顾到的街角画进下一班。
arena-injury 33 rest 把一段训练换成坐着看录像|手腕歇下来，你在复盘时记下一个位置。
indie-budget 35 make 让同伴从头跑通精简过的地图|终点可以正常抵达，你把这次试玩的范围写在页首。|item:prototype
life-35 37 plan 用谈下的两周临时班重算账单|你把这笔工钱和固定支出逐项对过一遍。
indie-rights 37 make 用换过的声音重测转场|转场时旧音乐没有再响，你把版本号记好。
arena-tactics 39 plan 把稳开局的位置画给队友|第一波留出的空档在纸上一目了然。
rain-shift 37 plan 把停过的高风险路段标给站点|接班的人拿到标好的路图，出了站先绕了一个弯。
office-pivot 38 talk 核对交接时留下的岗位要求|你把能接的任务划出来，写下可面谈的时段。
factory-pivot 38 care 对着短班记录调整休息段|你在重复工序之间画了两格空白。
city-pivot 38 plan 带接班的人走一遍临时边界|走到封路牌前你们折回，图上添了一条支路。
office-37 39 make 把面谈时讲过的步骤做成索引|后来的人按编号找到材料，你收回了摊开的纸。
factory-37 39 make 请新人独立过一次检查项|你没有抢着接手，他在有异响的那一步停了下来。
delivery-37 39 care 把短班后的恢复时间圈起来|日历上两段高负荷时段终于错开了。
sanitation-37 39 plan 给走过的支路补个雨天记号|雨水冲下旧坡时，图上还能看清第二个出口。
delivery-routine 38 plan 在原路线的空档试排临时班|改完一个班次，其余几站还能准时交接。
life-38 41 make 把重摆的旧物收进顺手的位置|你腾出了最上面一格，拿取时不用再翻整柜。|reused
active-recovery 40 care 拿短班记录谈下一次排班|你把连续工作天数写清，留出恢复间隔。
life-39 41 talk 让接手的人自己走一遍|你等他讲完才补一句，下次可以由他独立交班。
arena-retire 41 study 给新人拆解一次常见失误|你把报点分成两个时刻，让新人试着接第二拍。
indie-second-desk 42 make 给重做的一关找一位试玩者|试玩的人停在第一道障碍前，你把这一处圈了出来。|item:prototype
late-recovery 42 care 按试行短班的边界调日历|你把下班时间写在班表边，给休息留出了地方。
indie-feedback 43 make 把玩家的回信变成一条测试题|你重走那处容易误解的规则，把反馈贴在测试页上。
life-43 44 rest 给减下来的工时留一道界线|你在日历上合起工作本，余下半天可以自己安排。
early-diagnosis 44 care 把想说的话再念给照护者|床边的人替你把最要紧的那句话记完整。
life-44 45 talk 让学过的人反过来演示|你在旁边看完，最后只提醒了一步。
indie-second-launch 45 study 对照最后一轮试玩复查开头|你找到了改动过的入口，把演示停在第一步。
life-45 46 plan 在新地图圈出认得的街角|你补上上次走到的位置，折起地图放在一旁。
office-45 46 make 顺着补齐的索引查一份旧资料|收到查询时你报出了目录号，对方顺利找到了文件。
factory-45 46 make 画下上次教过的检查顺序|你在纸上留了一格，让后来的人自己复查。
delivery-45 46 plan 把三处慢行点抄到社区图上|新图上标出了转弯前该放慢的地方。
sanitation-45 46 plan 给班组留下的路线图补树荫|你在复印件上添了盛夏可以歇脚的那一段。
arena-quiet 46 talk 给刚重逢的队友留条语音|你说起看台上的那一局，聊到一半两个人都笑了。
indie-memory 46 make 给打印的截图补上背注|你写上关卡名，把照片夹进自己的纸页。
`;
  for(const line of details.trim().split('\n')){
    const [head,outcome,requires]=line.split('|');
    const [id,slot,kind,label]=head.split(' ');
    add(id+'-0',Number(slot),kind,label,outcome,requires);
  }
  add('life-7-1',8,'talk','和阿宁交换那道重画过的题','你指第一页，他接着讲第二步，两处笔迹写到一起。','person:friend');
  add('life-7-2',8,'study','再试一次先做小题的顺序','你在卡住的空格旁做记号，给后面留出了时间。');
  add('school-yoyo-buy',10,'sport','用自己的悠悠球试一次收线','你把线绕回轴上，甩出去再慢慢收回来。','item:yoyo');
  add('school-yoyo-keep',10,'sport','向同桌借一只悠悠球试收线','你照着同桌的示范收回球，当面把它还了回去。');
  // A second reading of the work itself, years after the initial shift.
  const handovers = {
    'cost-center':['用盖过章的退件样单给新人讲成本中心','新人照你当年的圈注填对了空栏，自己把单据送去复核。'],
    'missing-socket':['按空钩的位置教新人盘点套筒','新人先报挂钩编号，再清点料箱，丢下的那一格终于对上。'],
    'river-detour':['把雨天走过的河边线交给新骑手','你在地图上指出那四分钟的绕行，新人自己找到了接回主路的路口。']
  };
  // Quieter A outcomes change what is on the desk or how the day is arranged.
  // Share the same receiving slot as the corresponding practical follow-up.
  const detailsByChoice=new Map();
  for(const line of `
life-1 book 放学后那场球让你认得操场入口，走读图上先圈了球门。|画过寻物纸条，这次你用箭头给新路线标了方向。
life-2 lamp 搬灯后留出的桌角，今天够摊开一整张卷子。|上次把亮处让出去，今天你提前挑了靠窗的位置。
school-prep book 你和同学约的那道难题还在，自习的最后几分钟留给互讲。|那套留着的题还没做，翻开封皮时里面依旧是空白。
life-9 planner 你在开放日摸过车床，翻简章时先找实训室的开放时间。|放学可以走回家，参加活动的时间表上少了一段车程。
life-11 console 画玩法时留下的那一关，成了你练习拆步骤的例子。|还机那天腾出来的周末，你用来给难题排了顺序。
school-sprint book 竞赛里见过换第一步的解法，你先在草稿纸上试了另一条路。|考前两晚留给了睡眠，这次你有余力把题干读第二遍。
life-13 planner 候场时聊过天，想起那棵树时你先记起一句让人放松的话。|那次提前收书，你记住了给进门前留几分钟空白。
school-exam book 做卷子时从头读到尾的习惯，帮你发现新表格还有背面。|自己写过的那套解法，这次换了个题目还能试第一步。
life-16 console 校园展上有人停在关卡入口，这次画交互草图时你先画入口。|原来要加练的两晚腾了出来，你给自己留了一顿不赶的晚饭。
arena-club planner 录过练习以后，你再看配合时会先找自己慌乱的那一秒。|把竞技留在课余，你没有把这一周的晚上都填满。
life-18 planner 摊主跟你按晚算过工钱，看到临时岗位时你先问怎么算工时。|在社区登记时听过积水巷，走访路线绕过了那个街口。
life-19 book 临时活换来的那把椅子，使你算报酬时有了一个实在的参照。|给朋友转过招聘消息，这次看见合适岗位，你顺手记下了联系人。
indie-kit console 交给阿宁的是源文件，你知道要先说清哪份副本还能改。|停止更新时写下的想法，今天可以先当作草稿谈谈。
life-20 book 整理作品集时讲过试玩问题，今天你先讲改过哪一步。|走访过街区风险点，你发现招聘单上的路线要过其中一个路口。
school-degree badge 周末试岗见过工作现场，今天你先问新手由谁带。|补过那堂课，你翻到同一主题时已经认得几个词。
life-21 badge 制造班组介绍过第一道工序，岗位单上的术语你能认出一行。|问过街区最忙的时段，这次你能把早高峰圈出来。
arena-offer badge 周末训练留在工作安排之外，你的办公室排班表留着那个空档。|进班组以后，工序交接的时间排在了竞技通知前面。|进站时认过路口，你知道早高峰要多留一段车程。|你把竞技群提示关了，早班集合的提醒留在最上面。
life-24 planner 请家里吃过饭，算下月开支时你记得要把往返也算进去。|留给自己的周末过得从容，下一张日历上你又空出半天。
office-24 book 小周圈过的那一栏你还认得，这次先看表头再填数。|自己交过第一单，你知道哪一张要留下核对联。
factory-24 box 班里解释过停机顺序，这次你先找交接单上对应的检查栏。|独立练过那道工序，你知道该在哪一步停下来复查。
delivery-24 planner 问到过少一级台阶的入口，新单送到附近时你从那边绕。|那两处楼门已经走熟，看到地址你能先在路口减速。
sanitation-24 planner 商户说过开门时段，今天的推车路线避开了卸货时间。|检查过车轮以后，你习惯在装满前先推空车走几步。
arena-start book 把失误写进过战术本，你能把这回的问题拆成两个位置来看。|那几天短训练让你睡够了，再排班时你给晚间留了上限。
indie-weekend planner 算过小项目的预算，新安排一挤进来你就先算一晚的工钱。|跟搭档谈过暂停，你给空下来的时段排进自己的事。
life-27 book 新同事抄过你讲的流程，这次交代事情时你把关键一步慢慢说。|那次按节奏完成工作赶上了晚饭，你算班次时也算了买饭的时间。
office-27 planner 你问清过哪张表必须先交，这次两份材料没有一起压在午休前。|上次两张表赶在当天交出，这次你先在旁边写下吃饭时间。
factory-27 planner 上次只换成了一天班，你没有把同事下周的时间也算进来。|走完防护流程用过几分钟，今天你把那几分钟写进交接时间。
delivery-27 planner 换过半段熟路，你知道要在交界路口说清谁送后半段。|那一晚衣服很久才干，你给新班表多留了一段换衣时间。
sanitation-27 planner 和摊主约过时间，这次清运避开了摊车最挤的那会儿。|先设防护用掉的时间记得清楚，新班次提前了几分钟出门。
arena-lineup planner 替补时给手腕留过余地，这次赛程表上也留着一个恢复时段。|想过观战工具，你看录像时多记了一个观众看不清的角度。
life-28 box 搬家时用过收纳格，这次翻柜子你先看自己当时分好的去向。|搬家后桌面腾出了位置，你先查去向，再决定这一格放什么。
life-29 planner 上次关掉聊天框认真谈过计划，这次你先约一段能说完话的时间。|你记得那天静音后的清净，今天把提醒留到散班以后。
life-32 planner 听培训时记住了安排休息，这张日历先空出一格。|做稳手头工作留下过一个空小时，你没有把最后一段也许给别人。
office-32 planner 打听过内部空位，手边有一项明确的工作要求可用来比较。|按短薪重算过房租和交通，新接任务时你先核到手的金额。
factory-32 planner 小周只帮了两班，你没有把临时轮换写成长期安排。|完成那批工以后手腕仍不舒服，你把间歇时间留在新表上。
delivery-32 planner 减过高负荷订单，你能把少跑的工钱和省下的体力一起算。|新范围的修车开支已经付过，接临时班时你另留了一笔修车钱。
sanitation-32 planner 移过作业时段，你对清晨能避开的那段车流有了数。|维持原范围时耽搁的折返，这次也算进了排班。
arena-injury planner 换过位置以后，你停下来认了认新的配合距离。|打完那场手腕仍紧，你在下次安排里另外留了休息段。
indie-budget console 程序问题缩小到一种机型，配乐迭代时你把那种机型单列出来。|试玩延期后，你把本职排班写在第一行，项目另约时间。|在日历里留过休息，这一周先照顾好能工作的时段。
life-35 planner 同事说过哪些天能换，这次你只把谈妥的那一天算进去。|把支出删减过一轮，重算工时前你先看还少多少。
indie-rights book 跟原作者谈清过使用范围，你核对文件时先翻授权说明。|项目收起以后，你没有把下一次提交写成已定的差事。
arena-tactics planner 抢开局的战术已经练过，决赛用纸上先留了第一波的位置。|你把录像时间点留给替补，场边的座位也能做观察。
rain-shift planner 改过一次近线，你给熟悉路段留的减速时间还在班表里。|跑完原排班的路况还记得，站里问到耗时时你能说出那段坡。
office-pivot planner 缩时后延过一项固定支出，谈复工时你先对照到账日。|赶出的尾款进了旧账，下一份安排得另外算收入。
factory-pivot planner 谈过轮岗的频率，恢复时你把连续重复工序分成两段。|旧班表走完一轮，你能指出最需要停手休息的那一段。
city-pivot planner 跟相邻组对过时间，你知道交界处要给哪一班留出通道。|上次做完原计划留下过积压，这回你把收尾也排进班次。
office-37 planner 问清过准点下班的日子，这次交接单上写明了最后接件时间。|跟小周交换过招聘页，面谈时你能拿岗位要求逐条问。
factory-37 box 学新工序时慢下来过，今天带人时你也多给了一次试手的时间。|把漏检项补进说明以后，交班时能直接指给下一位看。
delivery-37 planner 你亲手改过调度表，交接时先指出留给应急的那一列。|走新路线时小周只陪过一上午，后半程你能自己指路。
sanitation-37 planner 你画过换班图，遇见临时封路时先找原来那条支线。|申请过轻作业段，你把吃饭时间也算进下一次交接。
delivery-routine planner 去站里看过调度以后，新班次有了按时段拆开的办法。|和小周约过交接时间，这次先把两人重叠的钟点圈好。
life-38 book 那次同家人聊起纸上的事，提醒你把自己的版本也记下来。|清过桌面以后，写今天的新计划时终于有了一块空地方。
active-recovery planner 试新岗的适应期开销还在账上，重排工作时你没有用原先的工资估算。|临时帮忙有截止日，你把之后必须自己接手的事另列一栏。
late-recovery planner 岗位培训刚开始时领到的时间表，帮你算清这一周的余力。|上次说清了能分担的边界，这次你只把谈好的那部分交出去。
life-39 book 补过那一步流程的人来问进度，你知道该从哪一格查。|按自己的节奏报上了课，你在日历上留出了上课的傍晚。
arena-retire console 退下后写过玩法说明，再看赛场时你先想起观众能懂哪一步。|退下后有过没有训练提醒的周末，新日历也有一格可以留白。
indie-second-desk console 那个小版本已经能打开，你知道今天给别人看多长一段就够。|上次把关卡留在纸上，今天有一段时间可以重新估算范围。
indie-feedback book 给阿宁看过一封玩家留言，你记下作品该向外行解释的地方。|下一件想做的事只写了几页，今天的空档正好够翻完它。
life-43 book 手里的小项目曾经做出能寄的一部分，临交接时有了具体例子。|把那天下午留给想见的人以后，你记得约见也要给返程留时间。
early-diagnosis book 床边的文件已经交代过，照护者把记录放到你手能指到的地方。|上次说想安静一会儿，今天照护者把谈话留到你愿意开口时。
life-44 box 你知道哪些旧物仍在手边，出门前先核对一遍去向。|写给自己的那一页还记在心里，今天可以给行程多留一点空白。
indie-second-launch console 提交时把作品范围交代过，你能说清哪些是后来再做的部分。|文件留在合作者之间，你把那次分享和公开发布分开记着。
life-45 letter 回过信以后，今天要写的第一句比上次落笔时更从容。|记得上次慢慢吃完一顿饭，你没有把今天最后的空档也排满。
office-45 badge 门禁已经交接，你在桌边留的是自己的生活记录。|跟同事在工作之外吃过一顿饭，想起那栋楼时也能想起桌边的闲话。
factory-45 box 上次用扳手拧紧过椅腿，这次坐下时椅子稳稳当当。|翻过旧表之后，你知道要把哪些交班日期写在自己的记录里。
delivery-45 planner 那次走过旧路线，你能把熟悉的转弯画给来问路的人。|你记得检查反光袖口的手势，整理出门的东西时会多看一眼。
sanitation-45 book 在书店门口等过雨，再看到街角时先想起的反倒是檐下的座位。|那次从街边挑回一本书，你想起翻到第一页时的纸味。
arena-quiet planner 看台那天记住的那一局，现在还能在纸上画出两个位置。|写给新人的建议很短，这次整理经验时你保留了那种写法。
indie-memory console 道过谢以后，你知道自己的记录里应该给合作的人留一行。|给文件分过目录，今天整理时知道从哪里查那次归档。
chance-old-friend planner 阿宁回过一个周末时段，空档安排时你可以先看那天。|你跟阿宁说清了余力有限，这次排表没把草稿当成欠下的工作。
`.trim().split('\n')){
    const [event,sprite,...words]=line.split(' ');
    const slot=rows.find(r=>r.choice===event+'-0').slot;
    words.join(' ').split('|').forEach((text,i)=>detailsByChoice.set(event+'-'+(i+1),{slot,sprite,text}));
  }
  detailsByChoice.set('active-recovery-wait',{slot:41,sprite:'planner',text:'前次约谈时你把复工推迟了。这次账单还在，短班和培训可以重新谈。'});
  function detailsAt(run){
    return run.facts.flatMap(source=>{
      const detail=detailsByChoice.get(source.choiceId);
      if(source.variant==='solitary'||detail?.slot!==run.slot || run.eventId==='early-goodbye' && source.eventId!=='early-diagnosis' ||
         run.eventId==='early-diagnosis')return [];
      // Some old choices keep their ID when replaced by a solitary or lost-item variant.
      const original=LifeContent.cards.find(c=>c.id===source.eventId)?.choices.find(c=>c.id===source.choiceId);
      if(!original && source.choiceId!=='active-recovery-wait' || original?.commands.some(c=>c.startsWith('meet:') && !source.people.includes(c.slice(5))))return [];
      let text=detail.text;
      if(source.choiceId==='indie-memory-1' && source.variant==='first-view')
        text='阿宁上次问过开头的按钮，你在纪念页上留了一处能把玩法讲清楚的空白。';
      if(source.choiceId==='indie-memory-1' && source.variant==='recontact')
        text='你按旧地址等来过一封回信，把回信日期记在今天的纪念页上。';
      if(source.choiceId==='office-45-1' && !['display','stored'].includes(run.items.badge?.state))
        text='旧工牌的去向没有变。你上次抄下的门禁号码，今天可以留在纪念页里。';
      if(source.choiceId==='factory-45-1' && !['display','stored'].includes(run.items.tools?.state))
        text='班组的扳手已经归还，家里的椅腿是你上次用借来的工具拧紧的。';
      return [{...detail,text,sourceSlot:source.slot,choiceId:source.choiceId}];
    });
  }
  const effects = {
    make:{skill:2,stress:1},study:{knowledge:2,stress:1},plan:{mind:2,stress:-1},
    talk:{social:2,network:1},rest:{health:1,stress:-2},care:{mind:1,mood:2},sport:{body:2,mood:1}
  };
  function legal(run,source,condition){
    if(!condition)return true;
    const [kind,id]=condition.split(':');
    const held=item=>['display','stored'].includes(item?.state);
    if(kind==='person')return run.people[id]?.status==='in-touch';
    if(kind==='item')return held(run.items[id]);
    if(kind==='display')return Object.values(run.items).some(item=>item.state==='display');
    if(kind==='reused')return source.reused?.some(id=>held(run.items[id]));
    return false;
  }
  function available(run){
    const result=rows.filter(row=>row.slot===run.slot).flatMap(row=>{
      const source=run.facts.find(f=>f.choiceId===row.choice && f.slot<run.slot);
      if(row.choice.startsWith('school-yoyo-') && (!source?.interaction || run.facts.some(f=>f.giftEcho?.status==='taken')))return [];
      if(['life-6-yoyo','life-6-shuttlecocks'].includes(row.choice) && source?.giftEcho?.status!=='taken')return [];
      if(!source||source.variant==='solitary'||!legal(run,source,row.requires))return [];
      if(run.eventId==='early-goodbye' && source.eventId!=='early-diagnosis')return [];
      if(run.eventId==='early-diagnosis' && row.kind!=='rest')return [];
      const variant=row.choice==='life-14-0' && !run.admission?.qualified ?
        {label:'用备选学校的课表重排第一周',outcome:'你把想听的方向留在选修栏，找到一节可以先去的课。'}:{};
      if(row.choice==='life-33-1' && !legal(run,source,'item:prototype')){
        variant.label='照新项目的草稿试一次开场';
        variant.outcome='你按这次约好的玩法在纸上走了一遍，把第一步卡住的地方圈了出来。';
      }
      return [{...row,...variant,id:'again-'+row.choice,source,delta:effects[row.kind]}];
    });
    if(run.slot===39 && run.eventId==='life-39'){
      const source=run.facts.find(f=>Object.hasOwn(handovers,f.inspected));
      if(source){
        const [label,outcome]=handovers[source.inspected];
        result.push({id:'handover-'+source.inspected,source,kind:'make',label,outcome,delta:effects.make,commands:['exp:mentor']});
      }
    }
    if(run.slot===45){
      const source=run.facts.find(f=>f.slot===41 && f.followup?.sourceSlot===40);
      const later={
        'again-life-40-0':['make','把用过的交接间隔画给接班人','你画出两班重叠的十分钟，对方在图边写下谁先到场。'],
        'again-life-40-1':['plan','用试办过的排班方法给社区排值班','你把临时替班留成空格，志愿者可以自己填能来的钟点。'],
        'again-life-40-2':['rest','给今天的行程留一次半途折返','你在车站旁圈出休息的地方，走到那里时还有慢慢回家的余力。']
      }[source?.followup.id];
      if(later){
        const [kind,label,outcome]=later;
        result.push({id:'later-'+source.followup.id.slice(6),source,kind,label,outcome,delta:effects[kind]});
      }
    }
    return result;
  }
  return {rows,available,detailsAt,detailsByChoice};
})();
