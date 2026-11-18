'use strict';

globalThis.LifeContent = (() => {
  const ages = [6,8,10,12,13,13,14,14,15,15,16,17,18,18,18,19,19,20,20,21,22,22,23,24,25,25,26,26,27,27,28,29,30,31,31,32,33,34,35,35,38,45,52,58,64,72];
  const keySlots = {2:'lamp',11:'console',14:'letter',23:'badge',28:'box',33:'phone',36:'planner',40:'planner',44:'album',46:'box'};
  const familySlots = [9,14,31,34];
  const labels = {knowledge:'知识',skill:'技能',social:'情商',body:'体魄',charm:'魅力',mind:'心态',money:'存款',stress:'压力',mood:'心情',health:'健康',family:'亲情',network:'人脉',face:'面子',budget:'家庭预算',expect:'父母期望',parentHealth:'父母健康',affinity:'伴侣关系'};
  const origins = [
    ['scholar','学霸','老师把练习本还给你。页角那只红笔画的小星星，回家一路都舍不得折。',{knowledge:12,expect:14,stress:5}],
    ['leader','孩子王','楼下五个孩子为一根跳绳吵架。有人往楼上喊你的名字。',{social:12,network:5,knowledge:-4}],
    ['athlete','运动苗子','放学后你跑上六层楼，还能替慢一步的同学扶着铁门。',{body:13,health:5,knowledge:-4}],
    ['wealthy','富二代','家里买了台新电脑。大人把说明书留给你，先问了声想拿它做什么。',{budget:28000,expect:10}],
    ['craft-child','手艺人家的孩子','饭桌的一角永远放着一只工具罐。最短的螺丝刀终于轮到你用。',{skill:12,budget:-4000}],
    ['grandma','外婆带大的孩子','外婆把你的校牌重新别好，跟你说放学站在有树荫的那边等。',{mind:10,mood:4,family:-8}]
  ].map(([id,name,text,delta]) => ({id,name,text,delta}));
  const profiles = {
    learn:{knowledge:5,stress:4}, make:{skill:5,stress:3}, help:{social:4,network:3,mood:2},
    family:{family:5,mood:2}, move:{body:4,health:2}, art:{charm:4,skill:2,mood:3},
    rest:{mind:4,stress:-6,mood:4}, pay:{money:900,stress:6}, spend:{money:-600,mood:4},
    care:{money:-250,health:3,stress:-4}
  };

  const items = {
    lamp:['旧台灯','玻璃灯罩上有一道白痕，只有开灯时才显出来。','lamp'],
    console:['旧游戏机','背面的小螺丝生了锈。存档还记着第一次通关的日子。','console'],
    notes:['错题本','每个折角都留给一道曾经不会的题。','book'],
    letter:['录取信封','写着学校名字的那一页被夹在最里面。','letter'],
    badge:['旧工牌','透明夹子里夹过姓名和一段每天走过的路。','badge'],
    tools:['工具盒','一根扳手的握把被换过两次。','box'],
    gloves:['反光手套','湿过几次的反光条依然亮。','glove'],
    map:['街区手绘图','有些拐角标了树荫，有些标了雨天会滑的坡。','book'],
    prototype:['第一份试玩存档','文件名里的“最终版”后面还有三个数字。','console'],
    medal:['比赛徽章','别针弯了一点。当时谁也顾不上把它掰直。','badge'],
    yearbook:['毕业留言册','最后一页有一只歪耳朵的猫，尾巴绕过了两个签名。','yearbook'],
    photo:['旧合照','照片背面有日期，还有一笔没写完的署名。','photo'],
    notebook:['工作笔记','字写得最大的一页是留给交接的人看的。','book']
  };
  const experience = {
    repair:['修灯的手艺','加入后可以自己检修旧物，少付 250 元。',{money:250,skill:1}],
    practice:['一起解题','加入后能找同学一起准备，减轻压力。',{stress:-3,knowledge:1}],
    teamwork:['合作调试','加入后可以请旧搭档提前测试玩版。',{stress:-2,skill:2}],
    safety:['街头安全经验','加入后可用熟悉的安全路线降低暴露。',{stress:-2,health:2}],
    workshop:['班组交接经验','加入后能改用熟悉的交接清单，减少加班。',{stress:-3,skill:1}],
    recovery:['停工恢复经验','加入后能沿用复工计划，降低本次负荷。',{health:2,stress:-3}],
    launch:['上线后的用户回信','加入后可回访第一批玩家，省下部分测试费用。',{money:250,network:1}],
    mentor:['带新人','加入后可与新人一起分担现场任务。',{stress:-3,social:2}]
  };
  const wishes = {admit:'把志愿填好',rank:'认真打一场比赛',make:'做完一款小游戏',save:'给自己留一笔生活备用金',rest:'把身体养回来',pass:'把会的事教给别人'};
  const jobs = {office:['办公室职员','大厂'],factory:['制造业技工','手艺'],delivery:['配送骑手','手艺'],sanitation:['环卫工','体制'],player:['职业电竞选手','电竞'],developer:['独立游戏制作人','创作'],dispatcher:['站点调度','手艺'],retired:['退休','生活']};
  const directions = ['学术','体制','大厂','手艺','文艺','电竞','创业','躺平','出国'];
  const people = {parent:'家人',friend:'同学阿宁',colleague:'同事小周',coach:'教练陈姐',player:'玩家小叶'};
  const threads = {school:'升学',esport:'竞技',indie:'游戏制作'};
  const opportunities = {
    work:['接新工作','排班补贴和任务一起确认。','等这轮忙完再问名额。'],
    project:['做游戏','安排一晚完成原型，留出制作开支。','这次试玩展的报名窗口会关上，想法仍能留下。'],
    rest:['留出休息','先保下一次休息，下一轮排班会少接一些活。','休息排进下一轮，眼下要靠余力照顾身体。']
  };

  function options(id, lines) {
    return lines.split('~').map((line, index) => {
      const [label,outcome,profile,commands = ''] = line.split('|');
      return {id:id+'-'+index,label,outcome,delta:profiles[profile],commands:commands.split(',').filter(Boolean)};
    });
  }

  function card(id, slot, headline, body, lines, extra = {}) {
    return {id,slot,title:headline,body,hotspot:keySlots[slot],choices:options(id,lines),...extra};
  }

  const sharedRows = [
    ['放学后等一等','轮到你们组擦黑板。窗边的同学还没找到自己的水壶。','留下帮忙找|水壶卡在窗帘后面，阿宁把一颗糖分给你|help|meet:friend~先跑去楼下|你赶在铁门关上前踢完了最后一球|move~画一张寻物纸条|下课时，多了三个小孩来问你画的是什么|art'],
    ['台灯接触不好','写字写到一半，桌上的灯灭了。家里只有一盒旧零件。','跟着家人修灯|把最后一颗螺丝拧紧以后，你决定一直用它|make|gain:lamp,exp:repair,meet:parent~给灯换个位置|灯还能用，你把它搬到离插座更近的桌角|family|gain:lamp,meet:parent~把灯让给家里|明早窗边光线更好，你给自己留了张便条|rest|meet:parent'],
    ['集市上的两元钱','兜里只剩两个硬币。有人在摊子前演示会跑的铁皮青蛙。','换一把旧积木|回家以后，你用一只空盒拼出了一座站台|make~请同学吃冰棍|那个人把木棍洗干净，说想做书签|help|meet:friend~留作车钱|下了一场阵雨，你坐车回家时鞋还是干的|rest'],
    ['圆桌坐哪边','亲戚问谁愿意讲一件学校里的趣事。转盘上的最后一块鱼还没有人夹。','讲纸飞机落到哪儿了|大家笑起来，有人问你纸飞机怎么折|art~先把饭盛给家人|热饭端上来以后，话题慢了下来|family~给没赶回来的人留一份|你把碗倒扣好，夹了一双干净筷子|help'],
    ['走读的新路线','学校搬到马路对面。公交站没有遮雨棚，骑车要经过一段坡。','步行熟悉路线|第三天，你找到一条有树荫的小路|move~跟阿宁一起坐车|等车时，你们约好互相借课堂笔记|help|meet:friend~留在教室多读一会儿|人少以后，才听清吊扇转起来的声音|learn'],
    ['体育器材室','球网坏了，体育老师问有没有人愿意午休时修一修。','去补网|你很快认出包装袋上那种结|make~借出备用球|大家提前十分钟凑齐了人|help~照常午休|下午的课上，你第一次没有打瞌睡|rest'],
    ['试卷翻到背面','这次空题都集中在最后一页。老师给你一张方格纸。','做一本错题册|你先把反复错的类型圈成了三组|learn|gain:notes,thread:school,exp:practice~约同桌讲题|你们轮流讲，谁讲卡住就重画一遍|help|gain:notes,thread:school,exp:practice,meet:friend~先把小题写稳|一周以后，留给最后一题的时间多了五分钟|rest'],
    ['雨后的广播站','雨停了，还有人不敢走过进校门那段积水。','给下课铃配一段提示|走廊里有人跟着节奏慢下来|art~找一块旧木板|你们一起给最窄的位置搭了道小桥|make~留下帮忙撑伞|鞋湿了一半，今天却多了个一起回家的人|help|meet:friend'],
    ['中考志愿单','近的学校可以走读，远的学校有你想去的社团。家里正在算交通费。','选远一点的学校|你答应每天到家报一声平安|learn|thread:school,direction:学术~看有实训课的学校|实训室的开放日让你第一次摸到车床|make|direction:手艺~选能走回家的学校|你留下了放学后帮家里的时间|family'],
    ['第一次自己排练','同学借到一间空教室。门口贴着下午五点交钥匙。','试一段原创节目|你把算错拍子的那一段保留了下来|art|direction:文艺~做一个投影小工具|阿宁发现图上的小人可以左右动|make|thread:indie,exp:teamwork,meet:friend~去跑操场|你第一次把最后一圈跑得和第一圈一样快|move'],
    ['借来的一台游戏机','阿宁拿来一台按键发涩的旧游戏机，说修好了就送你。校内比赛也正在招人。','修好，试着报名参赛|你们约了第一周的练习时间|move|gain:console,thread:esport,meet:friend,wish:rank~记下想做的玩法|你留下游戏机，画出自己想加的一关|make|gain:console,thread:indie,exp:teamwork,meet:friend,wish:make~把游戏机还回去|你把周末留给复习，阿宁收好机器|learn|thread:school'],
    ['高三的午饭票','午间复习群很快刷满消息。食堂过一会儿才开门。','跟同学过一道难题|讲到第三遍，两个人都明白了|learn|thread:school,exp:practice~趁天晴走一圈|回来时，你把群消息静音了一小时|move~买份热饭给自己|这两个月第一次坐着吃完午饭|rest'],
    ['考场外的树荫','监考老师说还有一刻钟。有人还在背最后一页笔记。','温一下最弱的科目|你在候场的时候把难题的第一步捋顺了|learn|thread:school~和熟人说两句话|你发现阿宁比你先开始紧张|help|meet:friend~把书放进袋子|进场前喝完半瓶水，后来记得的是窗上的光|rest'],
    ['志愿截止的晚上','书桌上摊着三张简章。外地生活费、想学的东西和回家的时间都要考虑。','冲自己准备过的学校|你把这一所写在第一行，也填好了备选|learn|admit:reach,wish:admit,direction:学术~填更稳的专业|你按专业内容和能承担的学费排好顺序|learn|admit:steady~选带实习的专业|录取后你先查了实训楼开放时间|make|admit:trade,direction:手艺'],
    ['把桌子让出一半','新的房间很小，书桌要和别人共用。窗台上正好能放一只杯子。','约定轮流使用|你们把各自的时间写在一张班表上|help~练习自己整理工具|用到哪件就挂回去，桌面慢慢空出来|make~给家里打个电话|家人问窗户朝哪边，还记得给你留了床旧被子|family|meet:parent'],
    ['社团的一张空位','一个小组刚腾出位置。每周两晚，周末还可能加练。','去试训|你留下联系方式和一段比赛录像|move|thread:esport,meet:coach~去做校园游戏展|你第一次让陌生人坐下来玩了自己做的关卡|make|thread:indie,exp:teamwork,wish:make~把两个晚上还给自己|你把没睡够的几个早上补回来|rest'],
    ['停电后的走廊','宿舍突然断电，走廊还够亮。有人把节目的纸样拿了出来。','继续改程序|明早才能试，你先把问题逐条写在纸上|make|thread:indie~跟阿宁拍一张合照|你洗了两张，把歪的一张留给自己|help|gain:photo,meet:friend~听家里一段语音|你一边听一边把电话下次要说的事记下|family|meet:parent'],
    ['第一份临时工','夜市摊主、学校机房和社区站点都在找一周的帮手。','去学校机房|你学会把故障整理成别人看得懂的步骤|make|exp:workshop~去夜市帮忙|收摊时，老板算清了每晚的工钱|pay~去社区登记|有人告诉你哪条巷子下雨会积水|help|exp:safety'],
    ['贴在门上的招募','工作室征求试玩，有家店想请你做小工具。有人的消息只写了两行。','参加联合调试|反馈最后一条说，希望下个版本还能玩|make|thread:indie,exp:teamwork~接一份临时活|你第一次用自己挣的钱换了把椅子|pay~给朋友看机会|隔天也有人转发了一条适合你的消息|help|meet:friend'],
    ['毕业前的一个月','大家把课桌上的书分成两摞。面试前，还有几件事可以先准备。','练习交接技能|你试着把一项临时任务讲给没做过的人|make|exp:workshop~整理作品集|你补上了试玩者注意到的问题|art|thread:indie~去职业体验日|有人带你沿街走了一圈，讲了三个常见的风险点|move|exp:safety'],
    ['就业市场','你把四张岗位单分别折了角。几份工作的排班和通勤很不一样。','找办公室岗位|招聘会结束前，你记下了两种不同的班次|learn|route:office~去看制造班组|机床旁的人指给你看新手先从哪里学|make|route:factory~看走上街道的工作|你问了站点和班组什么时段最忙|move|route:delivery'],
    ['散伙前留个地址','毕业要打包退宿。留言本里还夹着两张尚未寄出的明信片。','给阿宁留新地址|阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包|help|meet:friend,gain:photo,gain:yearbook~留一份试制文件|发给同伴之前，你删掉了所有无用的临时文件|make|thread:indie,gain:prototype~告别后慢慢回家|你坐了最慢的一趟车，打算看看中间的站|rest'],
    ['第一份工牌','工作机会摆在桌上。四份工作都有起薪、值班和不同的上手时间。','进办公室|小周先教你把常用文件分到两个文件夹|learn|job:office,gain:badge,meet:colleague~进制造班组|你跟着同事认清了交接时要问的三件事|make|job:factory,gain:tools,meet:colleague~入职配送站|小周带你认了第一个危险的路口|move|job:delivery,gain:gloves,meet:colleague~加入环卫班组|你沿着还未开门的店铺走完第一趟|help|job:sanitation,gain:map,meet:colleague'],
    ['第一次领到月薪','工资到账，月底还要交房租。回家的车票已经开售。','留一笔应急钱|你把第一笔钱单独记进账本|pay|wish:save~请家里吃饭|回来时你把空饭盒带去洗了|family|meet:parent~留一个周末给自己|你睡到自然醒，打开窗通了风|rest'],
    ['夜班后的便利店','雨把上班的路打湿了。店员在加热最后一份便当。','还一笔小账|关掉银行页面后，你终于记得买一双干袜子|pay|wish:save~找同事坐一会儿|小周给你留出靠窗的位置|help|meet:colleague~下周少排一次晚班|你把空出来的那一晚留在日历最上面|rest'],
    ['桌上又多了一只插座','你把自己的东西摆好，床边没有合适的地方放总响的闹钟。','整理常用工具|最常用的三件东西都摸得着了|make~联系一个很久没见的人|过了两天，阿宁才发来两张街角照片|help|meet:friend~把房间留白一点|回家第一晚，你在干净的桌前喝了杯水|rest'],
    ['换班的人来了','小周在交接纸背面记了几个电话。你有时间再跟一趟旧流程。','记下工作的方法|下次交接时你把重要的一栏画得更大|make|gain:notebook,exp:workshop~帮新来的同事|他把你说的话另抄在袖珍本上|help|exp:mentor,meet:colleague~按自己的节奏完成|回家时还来得及买一份晚饭|rest'],
    ['新家的床头','东西都能带走，床头只摆得下一件。抽屉里垫着一张旧报纸。','把熟悉的东西带走|搬进去第一晚，你找到了旧物的位置|family|moveitems:keep~把旧物收进储物柜|你在纸箱上写好日期，以后仍能找回|rest|moveitems:store~把旧物转送出去|你交给来取货的人，桌面留下了空位|help|moveitems:give'],
    ['周三的临时消息','工作群的消息和朋友的邀约同时亮了起来。你盯着日历空格看了一会儿。','先答复工作|值班计划定了下来，你把私人事往后挪|pay~给朋友留一小时|你们关掉聊天框，真的把计划说清楚了|help|meet:friend~给自己空一天|到晚上，手机最后一条消息也没催第二次|rest'],
    ['雨衣放在哪里','新同事问为什么你出门前总绕着窗边走一圈。今天的天很低。','一起对照天气和路线|两个临时任务挪到了路况好一点的时候|move|exp:safety~把经验贴在墙上|同事在纸边加了一条以前没想到的提示|make|exp:mentor~把余下的活分出去|你少了一笔收入，也多了一晚完整的睡眠|rest'],
    ['租金单折了个角','房东发来续租单。家里问需不需要凑一笔钱，晚点也能再答复。','先续租|你们跟房东谈好分两次付款|spend~找合适的合租房|看房那天下雨，你记下了窗户有没有漏水|help~请家人先别打钱|电话里多说了会儿以后想住什么样的房子|family|meet:parent'],
    ['这份工作还有别的做法','例会散了，桌上留下别人不愿接的任务和一张培训表。','把交接再写清楚|有人终于知道周二交不出材料该找谁|make|exp:workshop~去听培训|下次整理日程时，你开始把休息也排进去|learn|exp:safety~先做眼前的一件事|下班时还留着一小时自己的时间|rest'],
    ['三条未读消息','值班表今晚更新，阿宁问这周能否一起做游戏原型。你也有一个很久没歇过的周末。','承担新的工作|排班稳定了，其他事再约时间|pay|priority:work~抽时间和阿宁做项目|你们留了第一个能坐下来做事的晚上|make|thread:indie,meet:friend,project:sketch,priority:project~把周末留给身体|周日下午你没有设闹钟|rest|priority:rest'],
    ['谁来一起吃晚饭','家里想知道你打算和谁一起过。问话很轻，屋里却忽然安静下来。','把自己的计划说清楚|家人听完，问能不能下周继续聊|family|meet:parent~认真回应那个人的邀约|你们只约定了下次见面的地点|help|meet:friend~留着自己的饭点|你把这件事留到自己愿意开口的时候|rest'],
    ['手里的活慢下来','旧安排突然变了，接下来几周的收入可能少一截。','找一个现金缓冲|你核对了要付的账单，先谈成了两周的临时班|pay|wish:save~问同事能不能换班|小周告诉你他哪天能接，另外两天你还得自己想办法|help|meet:colleague~先减少几项开支|一周后你在表上划掉了没必要的费用|rest'],
    ['把余下这一周排好','手上的活仍在等人，身体和收入都需要考虑。继续硬撑会加重负担。','找同事接一班|你把交接时间谈清楚，收入少了一点|help|protect:1~按原计划完成|钱先保住了，你给下一周留了一张体检单|pay|protect:0~安排休假和交接|你申请晚些复工，账款暂时由储蓄垫付|care|protect:2'],
    ['再试一次上手','停了几天后，你重新把上班需要的东西摆在桌边。','按短班复工|第一周留出了恢复时间，你把班表贴得很低|rest|exp:recovery~找站点学一点调度|你开始能解释一条时间表为什么总出问题|learn|exp:workshop~跟同事过一遍流程|小周告诉你可以共担的部分，也说了他自己的限制|help|meet:colleague'],
    ['柜子底下的旧东西','家里要换一只柜子。底层有一叠边角变黄的纸。','给手边的旧物一个位置|你把柜子擦了两遍，终于挑出一格|make|reopen:choose~和家人聊纸上的事|一件事被你们记成了两个版本|family|meet:parent~先打扫桌面|你留下一张干净的纸，给今天写两句|rest'],
    ['没人提醒的交接日','旧同事换班以后，新来的那个人接过了你的值班表。','陪新同事走一遍|他在表后写了下次能独立处理的三件事|help|exp:mentor,meet:colleague~补齐少一步的流程|两天后有人回来说现在容易找了|make|gain:notebook,exp:workshop~先把自己的活做稳|过了这周，你才报上一直想去的课|rest'],
    ['三十五岁重新排表','你把合同、手机和这几年的账单摊开。接下来五年还有别的安排。','留下并调整工作方式|你把想继续的事写成一行，交接时间更清楚了|make|priority:work~学习新的岗位|先试办三周，你决定等做完再给自己结论|learn|job:dispatcher,priority:change~给自己缓冲一阵|这几个月少存一点钱，你换来一段可安排的时间|rest|priority:rest'],
    ['新日历','日历翻过几页。有的约定已经变了，有的现在终于有时间。','定个能坚持的小目标|你把日期选在最容易空出来的那一天|rest|wish:rest~联系一个以前常见的人|没马上碰面，你们先交换了一点近况|help|meet:friend~接一件早年想做的事|这次你把预期写在最短的那行|make|wish:make'],
    ['街角换了招牌','上一次来，这间店还在卖练习本。路过的人已经习惯新的站牌。','记录变化|你用旧纸记下为什么那条路后来变宽了|make~请熟人走一圈|你们走错一次，回头时发现还是原来那棵树|help|meet:colleague~留一段自己的路|下午在公园坐够半小时才回家|rest'],
    ['留出体力的日子','有些事情做起来没有以前快了。你想把白天最清醒的一段留给什么？','给工作减量|你和同事重新对好交接|rest|meet:colleague~留给小项目|你把作品的一部分做成了能寄到别人手里的东西|make|thread:indie~留给想见的人|行程只排了下午，可那天聊到了天黑|help|meet:friend'],
    ['把会的事留下','有人说想学你以前做的事。桌上还有一格，够放一件旧物和一张纸。','带一个人做一遍|对方学会后又解释给另一个人听|help|exp:mentor,wish:pass~重新拿出一件旧物|你把它放在看得见的地方，补了一张日期签|make|reopen:choose~给自己留这段记忆|你在纸上写下还有什么想记住|rest'],
    ['离家一趟','有空再走远一点。有人邀请你去看旧地方，也有几件事可以留到以后。','看看熟悉的街区|地图上认得出一处转弯，剩下的留给下一次|move~回一封来信|写到第三句你才想起对方最初的问题|help|meet:friend~在家做一顿慢饭|饭后你听完一整张盘里的歌|rest'],
    ['剩下的一格','桌上有个空盒。打开之前，先想想这段日子还有什么放不下的事。','继续手头这一件|待办纸压在盒子下面，明天还能接着做|make|ending:open~把桌上的东西慢慢收好|你擦完桌子，正好赶上房间里的最后一点日光|rest|ending:natural~把一段经验写给后来的人|信末没有写道理，你留了一个日期和地址|help|ending:natural']
  ];

  const shared = sharedRows.map(([title,body,lines], index) => card('life-'+(index+1),index+1,title,body,lines));

  const shopObjects = {
    yuanA:{label:'第一枚一元硬币'}, yuanB:{label:'第二枚一元硬币'},
    blocks:{label:'旧积木',price:2,description:'木块的边角磨得发亮，正好能拼一座小站台。'},
    ice:{label:'冰棍',price:1,description:'给放学同行的同学买一根，剩下的一元可以留作车钱。'},
    purse:{label:'零钱袋',description:'把零钱留下，等下雨时坐车回家。'}
  };
  const shopActions = Object.entries(shopObjects).map(([id,obj])=>({
    actionId:'look-'+id,kind:'observe',objectId:id,requireBalance:id==='yuanA'||id==='yuanB',label:'看看'+obj.label,
    hintText:'点一下硬币，再点货架上的商品或零钱袋。'
  }));
  for (const sourceId of ['yuanA','yuanB']) {
    for (const objectId of ['blocks','ice','purse']) {
      shopActions.push({actionId:sourceId+'-'+objectId,kind:'arrange',sourceId,objectId,transfer:1,
        guideObjectId:sourceId,label:'安排一元',hintText:'点一枚还在手边的硬币，再点它的去处。',
        capacity:shopObjects[objectId].price ?? 2,
        incompatible:objectId==='blocks'?['ice','purse']:['blocks']});
    }
  }
  shopActions.push({actionId:'leave-shop',kind:'arrange',objectId:'purse',incompatible:['blocks','ice'],label:'今天不买了'});
  shared.find(event=>event.id==='life-3').interaction={
    sceneId:'school-shop',situation:'放学经过校门口的小卖部。',goal:'手里有两元钱。看看柜台，想想怎么花。',
    objects:shopObjects,actions:shopActions,balances:{yuanA:1,yuanB:1,blocks:0,ice:0,purse:0},
    retainRemainder:{sources:['yuanA','yuanB'],target:'purse'},
    outcomes:[{balances:{blocks:2},choiceId:'life-3-0'},{balances:{ice:1},choiceId:'life-3-1'},
      {balances:{purse:2},choiceId:'life-3-2'},{after:'leave-shop',balances:{ice:0,blocks:0},choiceId:'life-3-2'}]
  };

  // A story requires the actual historical choice, never just an item or an age.
  const dinnerStories = {
    'life-1-0':['帮阿宁找水壶','原来你们那天一起找了半天。阿宁还分了糖给你呀。'],
    'life-2-0':['和家人修台灯','拧紧最后一颗螺丝，灯就亮了。你现在说起来还记得这么清楚。'],
    'life-3-0':['用积木拼站台','用空盒做站台？下次我也给你留几个纸盒。'],
    'life-3-1':['请阿宁吃冰棍','吃完还把木棍收起来做书签，阿宁挺会想的。']
  };
  const dinnerChoices = [
    ['turn','给家人转一道菜','转盘慢了下来，家人伸手接过那盘鱼。',{family:2}],
    ['reply','接一句近况','你说最近放学路上挺热闹，家人笑着点了点头。',{social:1}],
    ['ask','问家人小时候的事','家人讲起从前放学总绕去看河里的小鱼。',{family:1}],
    ['humor','开个玩笑','你说这条鱼转了三圈，比自己跑步还勤快。桌边有人笑出了声。',{mood:2}],
    ['story','讲一段真实往事','你把先前发生的事讲给家人听。',{social:2}],
    ['quiet','安静吃完这顿饭','你慢慢吃完碗里的饭，碗筷声也渐渐轻了。',{}]
  ].map(([id,label,outcome,delta])=>({id:'life-4-'+id,label,outcome,delta,commands:[]}));

  function dinner(run,card) {
    const known = run.people.parent && run.people.parent.status!=='dead';
    const npcId = known ? 'parent' : 'relative';
    const speaker = known ? people.parent : run.birth==='grandma' && !run.people.parent ? '外婆' : '桌边的亲戚';
    const objects = {[npcId]:{label:speaker},fish:{label:'转盘上的鱼'},rice:{label:'饭碗和饭勺'},'table-exit':{label:'散席'}};
    const actions = [{
      actionId:'listen',kind:'observe',objectId:npcId,once:true,label:'听'+speaker+'说话',
      feedback:speaker+'放下筷子：“最近放学，有什么好玩的事吗？”',
      hintText:'可以点桌边的人听听，也可以直接转菜、盛饭或散席。'
    }];
    function beat(actionId,objectId,label,feedback,choiceId,extra={}) {
      actions.push({actionId,objectId,label,feedback,choiceId,kind:'arrange',once:true,sourceId:'beats',transfer:1,...extra});
    }
    objects.beats={label:'交流余量'};
    beat('turn','fish','转菜',dinnerChoices[0].outcome,'life-4-turn');
    beat('serve','rice','盛饭',card.choices[1].outcome,'life-4-1');
    for(const choice of dinnerChoices.slice(1,4)) {
      beat(choice.id.slice('life-4-'.length),npcId,choice.label,choice.outcome,choice.id,{afterObservation:npcId});
    }
    for(const fact of run.facts) {
      if(fact.slot>=run.slot) continue;
      // The homework variant shares this choice and lamp, but never earns repair here.
      if(fact.choiceId==='life-2-0' && !(fact.eventId==='life-2' && fact.slot===2 && run.experience.repair===fact.slot)) continue;
      const story = Object.hasOwn(dinnerStories,fact.choiceId) && dinnerStories[fact.choiceId];
      if(!story) continue;
      const [label,newReply] = story;
      const witnessed = known && fact.people.includes(npcId);
      const response = witnessed && fact.choiceId==='life-2-0'
        ? '“我还记得那颗螺丝，还是你亲手拧紧的。”' : '“'+newReply+'”';
      beat('story-'+fact.slot,npcId,label,speaker+'说：'+response,'life-4-story',
        {afterObservation:npcId,sourceSlot:fact.slot,witnessed});
    }
    actions.push({actionId:'finish',kind:'arrange',objectId:'table-exit',label:'散席'});
    const balances = {beats:3,[npcId]:0,fish:0,rice:0};
    return {...card,choices:[...card.choices,...dinnerChoices],interaction:{
      sceneId:'family-dinner',npcId,elder:run.birth==='grandma' && speaker==='外婆',objects,actions,balances,terminal:true,
      goal:'家人问起放学后的趣事。你想怎么参与这顿饭？',
      resolve(state) {
        if(state.balances.beats && !state.performed.includes('finish')) return null;
        const lastBeat = state.performed.map(id=>actions.find(action=>action.actionId===id)).findLast(action=>action?.choiceId);
        return {choiceId:lastBeat?.choiceId ?? 'life-4-quiet'};
      },
      record(view) {
        const steps = view.performed.map(id=>actions.find(action=>action.actionId===id))
          .filter(action=>action?.feedback).map(({actionId,label,feedback,sourceSlot,witnessed})=>
            ({actionId,label,feedback,...(sourceSlot?{sourceSlot,witnessed}:{})}));
        return {npcId,steps};
      }
    }};
  }

  function lastFish(run,card) {
    const family = run.people.parent;
    const atTable = family?.status === 'in-touch';
    const elder = run.birth==='grandma' && (!family || atTable);
    // The relationship model tracks one aggregate family contact. Other seats
    // are local to this meal, and are only used in the established family setting.
    const gathering = atTable && !elder;
    const npcId = atTable ? 'parent' : elder ? 'dinner-grandma' : null;
    const speaker = elder ? '外婆' : '家人';
    const goal = '这块鱼，你想怎么处理？';
    const serveHint = gathering ? '可以点空碗留给晚归的人，也可以点自己的碗。'
      : '可以点小碗留到下顿，也可以点自己的碗。';
    const intro = gathering ? '一家人吃到最后，盘里只剩一块鱼。还有人没回来，空位前摆着他的碗。'
      : elder ? '你和外婆吃到最后，盘里只剩一块鱼。外婆把装剩菜的小碗放在盘边。'
        : '饭快吃完了，盘里只剩一块鱼。旁边的小碗可以装起来，留到下顿。';
    const objects = {
      fish:{label:'最后一块鱼'},
      'reserve-bowl':{label:gathering?'空碗，留给晚归的人':'小碗，留到下顿'},
      'own-bowl':{label:'自己的碗'},
      'table-exit':{label:'继续吃饭'}
    };
    const decisions = [
      {id:'save-fish',target:'reserve-bowl',label:gathering?'给晚归的家人留鱼':'把鱼留到下顿',
        outcome:gathering?'家人把空碗往里挪了挪：“行，我盖上。明早还能配粥。”'
          : elder?'外婆找来一个小碟盖上：“明天配粥正好。”':'你找了个小碟盖住碗，把鱼留到下顿。',
        tag:gathering?'fish-saved-for-family':'fish-saved-for-later',recipientId:gathering?'dinner-late-family':null},
      {id:'eat-fish',target:'own-bowl',label:'夹走最后一块鱼',
        outcome:gathering?'家人递来一双筷子：“趁热吃。他说在外面吃过了，不用等。”'
          : elder?'外婆把自己的筷子收了回去：“好，慢慢吃，小心鱼刺。”':'你把鱼夹到碗里，剔了刺，趁热吃完。',
        tag:'last-fish-eaten'},
      {id:'keep-eating',target:'table-exit',label:'继续吃饭',
        outcome:gathering?'你继续吃碗里的饭。家人见鱼还在，顺手拿小碟盖上。'
          : elder?'外婆见你还在吃饭，就把鱼盘往桌里收了收。':'你吃完碗里的饭，鱼还留在原来的盘里。',
        tag:'fish-left-on-plate'}
    ];
    const choices = decisions.map(decision=>({
      id:'life-4-'+decision.id,label:decision.label,outcome:decision.outcome,delta:{},commands:[]
    }));
    const readyAfter = ['select-fish','ask-family'];
    const actions = decisions.slice(0,2).map(decision=>({
      actionId:decision.id,kind:'manipulate',sourceId:'fish',objectId:decision.target,transfer:1,
      afterAnyAction:readyAfter,goalText:serveHint,hintText:serveHint,guideObjectIds:['reserve-bowl','own-bowl']
    }));
    actions.push({actionId:'select-fish',kind:'observe',objectId:'fish',once:true,label:'选中鱼盘',
      hintText:npcId?'点一下鱼盘，可以决定留给谁；也可以先问问家人。':'点一下鱼盘，再决定现在吃还是留到下顿。'});
    if (npcId) {
      objects[npcId]={label:speaker};
      actions.push({actionId:'ask-family',kind:'observe',objectId:npcId,once:true,label:'问问'+speaker,
        feedback:gathering?'家人说：“他刚来过电话，在外面吃过了，不用给他留饭。你想现在吃，还是留着明早配粥，都行。”'
          :'外婆说：“我吃饱了。你要吃就趁热，吃不下就搁小碗里，明早配粥。”'});
    }
    actions.push({actionId:'keep-eating',kind:'arrange',objectId:'table-exit',label:'继续吃饭'});
    return {...card,title:'最后一块鱼',choices:[...card.choices,...dinnerChoices,...choices],interaction:{
      sceneId:'family-dinner',variant:'last-fish',npcId,elder,gathering,objects,actions,
      balances:{fish:1,'reserve-bowl':0,'own-bowl':0},goal,intro,terminal:true,
      resolve(state) {
        const index = decisions.findIndex(decision=>state.performed.includes(decision.id));
        return index===-1 ? null : {choiceId:choices[index].id};
      },
      record(view) {
        const decision = decisions.find(item=>'life-4-'+item.id===view.choiceId);
        const steps = actions.filter(action=>action.feedback && view.performed.includes(action.actionId))
          .map(({actionId,label,feedback})=>({actionId,label,feedback}));
        return {variant:'last-fish',npcId,steps,decisionId:decision.id,recipientId:decision.recipientId ?? null,
          tags:['last-fish',decision.tag],outcome:decision.outcome};
      }
    }};
  }

  const occupationRows = {
    office:[
      ['进门后的第一张表','小周提醒你，报销表总是退在同一列。','查清退件原因|下次你把例子贴在打印机上|make|gain:notebook,exp:workshop~请小周看一遍|他圈了一栏，问你为什么认为应该填在那里|help|meet:colleague~把自己的第一单做对|交单以后终于有空记一个门禁号码|learn'],
      ['午休只剩二十分钟','领导临时把上午的两张表拼到一起。三个人都在等新的版本。','把重复步骤合在一起|两位同事提前收工，你把方法记了下来|make|exp:workshop~问清哪张必须先交|有一张被推到明天，你还吃得上午饭|help|meet:colleague~按原样赶完|当天交得及时，后来才想起没见到阳光|pay'],
      ['工作被并到另一个组','新组只留一个人负责旧项目。小周的岗位也要调整。','交出可接手的资料|对方问你能否留下帮助一周|make|exp:workshop~打听有无内部空位|两人把各自知道的招聘信息贴在一起|help|meet:colleague~按短薪安排下一月|你第一次把房租和交通记在同一张表|rest|setback:office'],
      ['原来的座位没了','你熟悉的那一排工位暗了两盏灯。有人约你谈下一份工作。','带交接笔记去面谈|你能清楚解释自己解决过什么|learn|gain:notebook~试一个边界清楚的岗位|你问清哪几天可以准点走|rest|exp:recovery~跟小周交换招聘页|你们约定看到合适的就各发一份|help|meet:colleague'],
      ['交回门禁以前','有人问从哪里找一份已经没人认识的文件。','补齐索引给后来的人|半年后小周收到一张谢谢的便条|make|shine:office~留一张旧工牌|你终于知道自己为什么记得第一扇门|rest|gain:badge~叫上曾经的同事吃饭|你们谈了很多与这栋楼无关的话|help|meet:colleague']
    ],
    factory:[
      ['扳手该挂在哪儿','班组的工具板上少了一把合适的扳手。小周带你去看料箱。','一起对清工具清单|晚上换班的人找到了缺的那一把|make|exp:workshop,gain:tools~请小周讲一遍停机流程|他说了一个纸面说明没写到的情形|help|meet:colleague~先练自己的那道工序|第二趟就知道什么时候该停下来检查|learn'],
      ['夜班的交接铃','交接早到五分钟就能说清温度异常，晚一点却能多睡一会儿。','改成交接清单|两班各留三分钟，误报慢慢少了|make|gain:notebook,exp:workshop~跟同事调班|他答应临时换一天，也提前说了下周有事|help|meet:colleague~按防护流程结束|多花了一会儿，你回家给手腕敷了热毛巾|care|exp:safety'],
      ['手腕开始发木','换批次后手上的动作变密。产量和休息很难同时保住。','先报告并换工位|工时少了一点，你花了两周适应另一道工序|care|setback:factory,protect:2~和同事轮换操作|小周帮了两班，余下时间还需要重新安排|help|protect:1,meet:colleague~先完成这一批|产量顶住了，夜里手腕更难放松|pay|protect:0'],
      ['离开熟悉的机台','班里有个新人才来几天。你还没决定要不要拿新的岗位证。','带新人过检查项|他学会了遇到异响先停再问|help|exp:mentor~去学新的工序|实训期没有原来熟练，你接受缓一点|learn|exp:recovery~把旧机台做稳|你把几项容易漏的检查补进了说明|make|exp:workshop'],
      ['工具板空出一格','钥匙要交给下一班。那把握把换过两次的扳手还在你手里。','把方法演示给新人|他跟着做完一遍，又主动重新检查了一次|help|exp:mentor,shine:factory~自己留着工具盒|你回去给松动的椅腿上了颗新螺丝|make|gain:tools~和小周整理旧表|翻到交接日那一页时，你们都认出了旧字迹|rest|meet:colleague']
    ],
    delivery:[
      ['第一条绕行建议','站点的地图看不出那座桥有多滑。小周等你一起骑第一趟。','记下安全路线|你多走了四分钟，回来把坡度画在纸上|move|gain:map,exp:safety,meet:colleague~请教取餐的少一个台阶的入口|老板隔天就认出你在找哪里|help~多熟悉两处楼门|第三趟时，你已经能提前放慢速度|learn'],
      ['雨里少跑一单','预报比平时更急，站点同时多了一批订单。手上的雨衣还没干。','提前换到熟悉的片区|钱少一点，回站时还能把灯擦干|care|protect:2,exp:safety~同同事交换一段路线|两人各跑熟悉的那半边|help|protect:1,meet:colleague~按原单量继续|这一晚收入够了，衣服到夜里还湿着|pay|protect:0'],
      ['站点调整配送范围','远处的地址多了一截上坡。时效和原来一样，熟悉的路线变少了。','提交真实的绕行时间|站里先把两处积水点划成慢行段|help|exp:safety,meet:colleague~减少高负荷订单|这半个月收入少了，你留出看恢复情况的时间|care|protect:2~先接这批新范围的单|你记熟地址的同时也多付了一次修车钱|pay|protect:0'],
      ['坐在站点等复工','收入还没有回到原来。小周只有两天能换给你，站里说可以先短班或去学调度。','用短班慢慢恢复|第一周少跑几单，第二周身体仍需要休息|care|exp:recovery,job:delivery~到站里学调度|头一次改完排班表，你留了应急的一列|learn|job:dispatcher,exp:recovery~找小周试新的路线|他只能陪一上午，后半趟你自己走稳|help|meet:colleague,exp:recovery'],
      ['路还是那条路','坡底多了一排路灯。一个新人停下，问地图上怎么找安全的转弯处。','在地图上补齐三处慢行点|新人下一趟主动绕开了积雪|make|gain:map,shine:delivery~和小周走一次旧路线|你们到了第一个路口才认出当年的取餐店|help|meet:colleague~把手套留给自己|反光条还能亮，你把它和新雨衣分开放|rest|gain:gloves']
    ],
    sanitation:[
      ['第一趟街区清晨','旧书店还没开门，清洁车轮子一直响。小周把站点的备用车推出来。','雨后先看背街|你把树根旁容易打滑的位置加进路线|move|exp:safety,gain:map~问问沿街商户|店主帮你留出清洁车能临停的地方|help|meet:colleague~给车轮做个检查|第二天转进小巷时，车终于不响了|make|exp:workshop'],
      ['垃圾车换了时刻','早市和清运时间撞在一起。搬桶的时候还要留出人行道。','同班组重排顺序|早点出来的那一趟明显顺了一点|make|exp:workshop~和摊主约一段时间|赶早的人少绕了一次路|help|meet:colleague~先停下来设好防护|速度慢一点，来往的人有了清楚的通道|care|protect:2'],
      ['街口开始围挡','施工挡住了半条人行道，绕行增加作业量。排班表还没换。','提出增补班组|负责的人同意先试两周，原来的问题要继续记|help|meet:colleague,protect:1~先改作业时段|你把旧线路缩短了，工时也少了|care|setback:sanitation,protect:2~维持原来范围|旧习惯帮你完成任务，晚上肩背却更紧|pay|protect:0'],
      ['把街区交给熟悉的人','新人认得路，却没赶上雨水从旧坡往下冲的时候。','陪他雨后重走一遍|你把原来省略的两条支路也讲了|help|exp:mentor~做一张换班图|工地收工后，图上的细线还能派上用场|make|gain:map,exp:workshop~申请轻一点的作业段|腾下的时间让你每天都能按点吃早饭|rest|exp:recovery'],
      ['旧书店又开了门','书店原址后来变成奶茶店，又开了一家二手书店。见到门口的树，你还认得。','给新班组留一张路线图|图贴上去的第二天，有人补了一个树荫点|make|gain:map,shine:sanitation~和小周坐门口等雨停|两个人想不起哪年换的第一辆车|help|meet:colleague~挑本书带回去|你记下一个仍在这条街生活的人|rest']
    ]
  };
  const jobSlots = [24,27,32,37,45];
  const occupations = Object.entries(occupationRows).flatMap(([job,rows]) => rows.map(([title,body,lines], i) =>
    card(job+'-'+jobSlots[i],jobSlots[i],title,body,lines,{job})));

  const storyRows = [
    ['school-prep',8,'school','老师留了一套题','有些题重复出现过。也有人提醒你，期末以后还有别的安排。','试着在白天做完|你记下三处需要问老师的地方|learn|thread:school,exp:practice~和同学分开准备|两人约好回来各讲最难的那一题|help|meet:friend,exp:practice~先留着题|你在卷子外面套了张封皮|rest'],
    ['school-sprint',12,'school','竞赛和模拟考只隔一天','两边都能参加，但休息和补习至少要放掉一项。','重点补弱项|你划掉一些熟悉的练习，把时间留给没学懂的地方|learn|thread:school~报一项竞赛|遇到难题时，大家才知道原来第一步能换一种写法|learn|thread:school,exp:practice~把两晚睡足|读完题目再下笔的时间，比上次多了|rest'],
    ['school-exam',13,'school','走进最后一场考场','试卷发下去时，外面正好有一辆公交停站。','先过自己熟的部分|你做完以后认真回头看了未答完的题|learn|thread:school~按卷面顺序来|下笔前你把最后大题也从头读了一遍|rest~把想起的解法写下来|一些步骤后来被你用在了别的题上|make|exp:practice'],
    ['school-result',15,'school','查到录取结果以后','录取页面已经更新。家人问你要不要现在一起看。','把消息讲给家里听|你也讲了填在它后面的两个备选|family|meet:parent~找阿宁走一圈|这段路后来成了你们说毕业时最常想起的地方|help|meet:friend~先看看接下来学什么|你在原来夹志愿草稿的地方放了新课表|learn'],
    ['school-degree',20,'school','校名印在项目通行证上','学校开放了一间机房，也开放了一个周末试岗名额。','约人做一个小项目|第一次停机时，搭档帮你把坏掉的部分写成清单|make|thread:indie,exp:teamwork~去看一份真实的工作|你看见专业之外真正要学的几件事|learn|exp:workshop~临时退出把课补上|腾出来的周末让你听完了一堂以前没听懂的课|rest'],
    ['arena-club',16,'esport','试训有一张计分纸','两晚训练以后，只会留两个人。排课表也在桌上。','按场次练配合|教练记下你愿意补上的位置|move|thread:esport,meet:coach~录一份练习再交|你自己看到了几处容易慌乱的判断|make|thread:esport~保留为课余兴趣|周四晚上仍有空和同学打一场|rest|pause:esport'],
    ['arena-offer',23,'esport','战队给过一次试训回话','有一个短期竞技位置，也有几份日常岗位申请。','签短期战队协议|陈姐在合同边写下了休息和试用期|move|job:player,meet:coach,thread:esport~去办公室，把训练留给周末|同事的工位离窗只有两步，周末你照常练习|learn|job:office,meet:colleague,gain:badge~选制造班组|周末的队伍通知仍在，你暂时没接|make|job:factory,meet:colleague,gain:tools~选配送站|你先去认安全的路口，再答复伙伴|move|job:delivery,meet:colleague,gain:gloves~进环卫班组|早班前你关掉了竞技群的自动提示|help|job:sanitation,meet:colleague,gain:map'],
    ['arena-start',24,'esport-job','睡前复盘最后五分钟','陈姐说你的失误可以改，但先要承认哪一步决定太急。','向队友说明当时看见什么|队友把另一个角度的录像同步过来|help|thread:esport,meet:coach~把失误写进战术本|下一次你们做了不止一套演练|make|thread:esport,gain:notebook~先补几天觉|队里改用较短训练，你在第二天精神好了些|rest'],
    ['arena-lineup',27,'esport-job','首发和替补的名单','首发需要多两场配合训练。替补也能参赛，还能留出恢复时间。','练首发配合|第二周队友认得出你报点的声音|move|thread:esport,meet:coach~做稳定的替补|你按时复盘，也给手腕留了恢复时间|rest|exp:recovery~开始想退役之后|在朋友的新项目里，你第一次考虑怎么做观战工具|make|thread:indie'],
    ['arena-injury',32,'esport-job','手腕发紧的时候','还有一轮选拔。继续超量练习可能加重负担，减练会影响磨合。','减量，留出恢复时间|陈姐把一场训练改成你可以参加的复盘|care|protect:2,exp:recovery~调整位置和动作|队里改了一套战术，你需要重新熟悉节奏|move|protect:1,thread:esport~先坚持到这场打完|你记了一场完整录像，手腕的不适还在|pay|protect:0,thread:esport'],
    ['arena-tactics',36,'esport-job','出场前三步','三张战术纸只能确定一张作为开局。还可以用余力和队友对一次细节。','先稳住可以配合的位置|队友知道第一波该为谁留出空档|make|thread:esport,arena:steady~抢先打开空间|你们练了一套高投入战术，早段必须保持清醒|move|thread:esport,arena:attack~把这一场交给替补|你把对手录像的时间点留在桌上|rest|arena:mentor'],
    ['arena-final',39,'esport-job','最后一张比赛用纸','纸上画着上一局失误的位置。对手也还没有坐稳。','执行和队友定下的打法|手贴到桌上时，你先听见队友报位置|make|final:play~在场边做协助|你把两处观察发给了队友，比赛由他们继续|help|final:assist~准备退役|错过这一场以后，你想清楚仍想带走什么|rest|final:leave'],
    ['arena-retire',40,'esport-job','书包里多了一块替补牌','下一季还没有签。有人邀请你带训练，也有人问要不要一起做项目。','留下来给新人带训练|相同的失误，你试着用更易听懂的话重讲一次|help|job:office,exp:mentor,pause:esport~去做游戏项目|你把竞技所学变成一份玩法说明|make|job:office,thread:indie,wish:make,pause:esport~离开后先休息|第一次周末回来，没人问你今天训练几小时|rest|job:office,pause:esport'],
    ['arena-quiet',45,'esport-echo','这次比赛坐看台','陈姐转来了一张入场券。票上的日期让你想起以前发训练表的时候。','和旧队伍见一面|大家聊了半小时各自在忙的事|help|meet:coach~把比赛徽章收好|你把它和第一次写的战术放在一起|rest~给新人写一条建议|你删掉了“应该”，留下一个当时学会的方法|make|exp:mentor'],
    ['indie-kit',19,'indie','一份能玩的旧文件','阿宁发现上回做的小人还有两个动作没接上。你们只有一周时间。','把第一关做完整|阿宁把收来的意见写在名字旁边|make|gain:prototype,thread:indie,exp:teamwork,meet:friend~把源文件交给阿宁|你保留了一份能开起来的副本|help|gain:prototype,meet:friend~先停止更新|你留了份笔记，写下当时想做的东西|rest|pause:indie'],
    ['indie-weekend',26,'indie','下班后的联调','阿宁做出了一个小关卡。第二天你还要早起。','约两个短晚上|你给现有版本留了一次真正的测试|make|thread:indie,wish:make,meet:friend~先做预算表|你们把目前做得到的范围缩了下来|learn|gain:notebook,thread:indie~请搭档先停一下|项目还留在桌上，彼此有时间想清楚|rest|pause:indie'],
    ['indie-budget',33,'indie','第一份可发出去的试玩','试玩展下月开，工作也排到了同一周。还需要留一点资金和休息时间。','先把玩法做完整|你删了一张地图，试玩真的可以打通了|make|project:polish,wish:make,priority:project~优先处理程序问题|三种机型的问题只剩下一种难以重现|learn|project:repair,wish:make,priority:project~先守住本职收入|试玩延期，你把现有版本留在电脑里|pay|project:wait,priority:work~把休息排进日历|你和搭档约好，等身体缓过来再看试玩|rest|pause:indie,priority:rest'],
    ['indie-rights',35,'indie-active','谁能用这段声音','一段配乐没有谈清使用方式。展会要收的是可以正式发布的版本。','换掉配乐继续迭代|你们用了可授权的声音，晚交了一天|make|project:repair~和原作者谈约定|两人把署名、配合时间和能用的部分讲清楚|help|project:polish,meet:friend~先收起项目|你们把还能继续的文件整理好再各自关机|rest|pause:indie'],
    ['indie-launch',39,'indie-active','发布按钮下面还有一行字','仍有一个会影响部分玩家的故障。发布后也需要时间回复问题。','提交现在的版本|你在说明里写明已知的问题和更新计划|make|release:now~延迟，做最后一轮修复|你又做了一遍测试，把还没解决的事列在提交单上|learn|release:later~只留在制作组|你把现有可用的文件整理到同一个目录|rest|release:stop'],
    ['indie-second-desk',41,'former-player','后来重新坐到桌前','曾经的队友问你想不想把比赛里学到的东西做进一关游戏。你能拿出的时间有限。','先把一关做出来|你把当队员时最熟悉的一个问题做成了关卡|make|project:polish,wish:make~和搭档试一个较小的版本|试玩文件已经能打开，你们还需要谈清接下来的安排|learn|project:repair,wish:make~把计划留在纸上|晚上你还愿意看以前的战术，不需要马上变成作品|rest|pause:indie'],
    ['indie-second-launch',44,'late-release','隔了这么久，仍有人试玩','最后一轮试玩还有留言。可以在保留休息时间的同时，给作品一个去处。','再打磨一下再提交|你按试玩反馈重新调整了关卡开头|make|release:later~提交并说明现在的范围|帮助文档多了一段当年比赛学来的东西|learn|release:now~和合作者分享最终文件|这次作品留在你们之间，各自都收到了可玩的版本|rest|release:stop'],
    ['indie-feedback',42,'indie-echo','以前的留言地址','邮箱里有一封和许多年前长得很像的回信。今天你可以按自己的节奏答复。','把回信留给这份作品|你记下玩家在哪一刻终于明白了规则|help|meet:player,exp:launch~给阿宁看看|两个人想起有段玩法第一次试时完全跑不通|help|meet:friend~记下下一件想做的事|这次目标写得很小，几页纸就装得下|make|wish:make'],
    ['indie-memory',45,'indie-history','第一份试玩重新打开了','屏幕比例不太对，按两下还能进到起始关卡。存档日期没有改。','给最早的画面留张照片|你把截图打印出来，背面写上当时的日期|make|reopen:prototype~再和一位旧搭档说声谢谢|对方以为你早把那个版本删了|help|meet:friend~把文件归进自己的档案|晚上你另建了个空文件夹，暂时没给它起名|rest']
  ];
  const stories = storyRows.map(([id,slot,rule,title,body,lines]) => card(id,slot,title,body,lines,{rule}));

  const risks = [
    card('rain-shift',36,'路口的雨没有停','远处订单仍在等。看得清楚的路变少，延时和收入摆在一起。','暂停高风险路段|你通知站点延时，先交接路况|care|protect:2,rain:2~改跑熟悉的近线|钱会少一点，熟路给你留了减速的空间|move|protect:1,rain:1~照原排班完成|这次收入保住了，你还得承担更长的湿滑路段|pay|protect:0,rain:0',{rule:'delivery',risk:'持续降雨可能使路面更难判断。减少暴露有帮助，仍需要留出恢复时间。'}),
    card('office-pivot',36,'部门给了两周的调整期','要决定是否跟岗位走。原来熟悉的人不一定都能留下。','找交接和转岗机会|你向能联系到的同事说清了自己会做什么|help|setback:office,protect:1~接受暂时缩时|收入变少，你把一项固定支出延后|rest|setback:office,protect:2~把现有工作赶完|这周做完能收到尾款，下个月还需要新安排|pay|setback:office,protect:0',{rule:'office',risk:'组织调整可能中断原收入。缓冲可以减轻压力。'}),
    card('factory-pivot',36,'排班里多了一道工序','最近手腕的恢复时间不够。工序调整可以协商。','要求暂停重复工序|调班审批下来以前，你先按更短时段工作|care|setback:factory,protect:2~找同事轮岗|你们约好交接频率，也写下做不到时找谁|help|protect:1~照老班表继续|这周奖金够了，之后也需要为劳损留时间|pay|setback:factory,protect:0',{rule:'factory',risk:'重复负荷可能加重不适。轮换和降低负荷有帮助。'}),
    card('city-pivot',36,'半条街暂时封起来','绕行道路狭窄，原来的防护工具也需要先更换。','先补防护和临时线路|你花了半班看路线，把新边界写回值班表|care|protect:2~和相邻组合作|手边的计划必须再改一次，两边各调出一个时段|help|protect:1,meet:colleague~按原计划先完成|工作范围没少，明天需要处理今天留下的积压|pay|setback:sanitation,protect:0',{rule:'sanitation',risk:'施工增加绕行和作业暴露。协作可以留出安全距离。'}),
    card('delivery-routine',37,'站里有人在等一份新排班','风雨过后，站点让你选下个月要怎样接班。小周的班也有变动。','留下熟悉路线|你在值班表上留了一格供临时调整|move|exp:safety~去了解调度岗位|新人问到一条路线，你知道该先解释哪个时间段|learn|job:dispatcher,exp:workshop~和小周约好交接时间|你们把各自需要提前说的事写在一起|help|meet:colleague',{rule:'delivery-routine'}),
    card('active-recovery',38,'下一张账单还会到','前一段停工的代价还在。恢复情况允许你重新排计划。','试一轮短班复工|你按承受得住的时间重新上手，还保留了休息日|care|recover:short,exp:recovery~学一个新岗位|适应期工资还没回到原来，已经能看见新的安排|learn|recover:change,exp:recovery~请人共担一段|小周说只能帮到月底，你据此改过日程|help|recover:help,exp:recovery,meet:colleague',{rule:'recover'}),
    card('late-recovery',41,'还有一段日子要重新安排','三十五岁的转折已经过去，之前停工的账单还留下了一部分。新一段生活允许你慢慢重新安排。','约一个可试行的短班|你先谈好什么时候做得到、什么时候需要停下|care|recover:short,exp:recovery~从岗位培训重新开始|收入还没补齐，手里已有一份新的时间表|learn|recover:change,exp:recovery~请能联系到的人分担|你们先对清哪些事可以一起做，哪些还要另想办法|help|recover:help,exp:recovery,meet:colleague',{rule:'recover'}),
    card('chance-old-friend',29,'阿宁发来一页旧笔记','那一页上还有十年前的涂改。阿宁问你想不想把想法说完。','用半晚把草稿做出来|最后你们留下一份能互相交接的草稿|make|thread:indie,meet:friend,exp:teamwork~把消息留到周末|对方回了一个时间，也问你最近如何|help|meet:friend~告诉他最近没有余力|他把文件留给你，说有空再看|rest',{rule:'chance'}),
    card('early-diagnosis',43,'把最近这段日子安排好','一次突发的严重病情让长远计划变得不确定。医生说接下来需要留院照护。','告诉能联系到的人|你说出了想要怎样度过接下来的日子|help|early:contact~把重要的物件和文件放在手边|你写下哪里还能找到没交接的东西|make|early:object~先留一段安静的时间|没有要立刻回的消息，你把窗边的位置留给下午|rest|early:quiet',{rule:'early'}),
    card('early-goodbye',44,'今天窗边有光','病情继续恶化。还能安排的时间变短了，你想留下一件小事。','写下现在想到的话|你在最后一行写上了日期|rest|earlyEnd:note~把一件旧物托付给照护的人|你说清楚它为什么留到了今天|family|earlyEnd:item~让这个下午安静过去|当天的最后一个画面是窗边挪动的一点光|rest|earlyEnd:quiet',{rule:'early-next'})
  ];

  const cards = [...shared,...occupations,...stories,...risks];
  const talents = {
    patient:['缓一点再出发','初始心态 +3、压力 −4',{mind:3,stress:-4}],
    maker:['手上有办法','初始技能 +4',{skill:4}],
    neighbor:['熟悉的街坊','初始情商 +3、人脉 +2',{social:3,network:2}]
  };
  const supports = {
    rest:['留给休息',1,'休息的时间能减轻压力。',{stress:-3,mood:1}],
    family:['联系在意的人',1,'给关系留一点能回应的时间。',{family:2,mood:1}],
    money:['接一小段额外工作',2,'增加可用的钱，也增加负担。',{money:350,stress:2}],
    experience:['调用相关经历',1,'用此前真的发生过的经历改变做法。',{}]
  };
  function extra(id,label,sprite,delta,outcome,commands=[]) {
    return {id,label,sprite,delta,outcome,commands};
  }
  const dayPlans = {
    'life-1': {label:'放学后的两段时间', icons:['box','glove','book'], costs:[2,1,1], extras:[
      extra('home','回家说说学校的事','phone',{family:2},'回家以后你把学校的事从头讲了一遍，家人听完才收碗。',['meet:parent']),
      extra('quiet','在楼下歇一歇','lamp',{stress:-2,mood:2},'你在台阶上坐了一小会儿，才跑上楼。')
    ]},
    'life-5': {label:'走读前的两个空档', icons:['glove','badge','book'], costs:[2,1,1], extras:[
      extra('prepare','抄好末班车时间','planner',{stress:-2},'你抄下末班车时间，第二天出门时心里踏实了一点。'),
      extra('tidy','回家理好书包','box',{skill:2},'你把最常拿的两本书放到一摸就能找到的位置。')
    ]},
    'life-7': {label:'自习课的前后半段', icons:['book','photo','planner'], costs:[2,2,1], extras:[
      extra('review','把容易错的地方圈出来','book',{knowledge:2,stress:1},'下课前你圈出了两类常犯的错，留着以后再看。'),
      extra('stretch','去窗边活动一下','glove',{stress:-3},'你在窗边伸了个懒腰，回来时手已经不那么僵了。')
    ]},
    'life-16': {label:'可以支配的两个晚上', icons:['console','box','lamp'], costs:[2,2,1], extras:[
      extra('home','回家人的消息','phone',{family:2},'家人回了一条简短的语音，提醒你回来路上慢一点。',['meet:parent']),
      extra('sleep','早点熄灯','lamp',{stress:-3,health:1},'你把灯提早关了，第二天闹钟响前就醒了。')
    ]},
    'life-20': {label:'毕业前的两个空档', icons:['planner','console','badge'], costs:[2,2,1], extras:[
      extra('questions','写三条想问的问题','book',{knowledge:2,stress:1},'你把最想弄明白的三件事记在一张便签上。'),
      extra('break','到楼下走一圈','glove',{stress:-3},'回到桌边时，你发现先前没写完的那行已经有了头绪。')
    ]},
    'life-26': {label:'下班后的两段时间', icons:['box','phone','lamp'], costs:[2,1,1], extras:[
      extra('fix','把松动的插线板固定好','box',{skill:2},'插头不再跟着线一起晃，你把最后一根线也理顺了。'),
      extra('dinner','留出时间好好吃顿饭','lamp',{health:2,stress:-1},'这次你把热饭吃完，没急着接着忙。')
    ]},
    'life-30': {label:'出工前的两个空档', icons:['glove','planner','badge'], costs:[2,1,1], extras:[
      extra('gear','备好干手套和雨具','glove',{health:2},'你多检查了一遍袖口和雨具，也记住了下次出门前要检查的三件事。',['exp:safety']),
      extra('rest','给中途留一段休息','lamp',{stress:-3},'你留出了能脱下雨衣、喝口水的时间。')
    ]},
    'life-42': {label:'今天还空着两段时间', icons:['book','photo','glove'], costs:[2,2,1], extras:[
      extra('postcard','写一张给自己的明信片','letter',{mind:2},'你把今天看到的招牌颜色写下来，带回屋里。'),
      extra('slow','绕路慢慢走回家','glove',{health:2,stress:-1},'你走得慢了一点，终于认出了路口那棵树。')
    ]}
  };
  for (const [variant,base,costs,icons] of [
    ['arena-club','life-16',[2,1,1],['console','phone','lamp']],
    ['school-degree','life-20',[2,2,1],['console','badge','book']],
    ['indie-weekend','life-26',[2,1,1],['console','planner','phone']],
    ['indie-feedback','life-42',[2,1,1],['letter','photo','book']]
  ]) dayPlans[variant]={...dayPlans[base],costs,icons};
  return {ages,keySlots,familySlots,labels,origins,items,experience,wishes,jobs,directions,people,threads,opportunities,shared,cards,talents,supports,dayPlans,dinner,lastFish};
})();
