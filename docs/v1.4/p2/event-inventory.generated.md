# 正式事件清单
来源为当前工作区 C.cards、C.ages、E.stage、E.currentCard 及实测变体。序号为注册表顺序，同级取首张。动态变体和活动不另计卡。
优先级：新童年前两槽独占；之后 early/early-next → arena-final → recover → 其他命中 rule 的注册顺序 → 职业 → 公共。调度员有配送履历时映射配送卡。同窗时正式场景可在 pageTrace.menu 内换约，未入选的试玩旧文件有 46 槽短窗口。精确谓词见下方引擎摘录。

## 1 / 6 岁 / 童年

### life-1 · 放学后等一等（A）
公共兜底；注册序 0；日程主次行动

轮到你们组擦黑板。窗边的同学还没找到自己的水壶。
- life-1-0 留下帮忙找 → 水壶卡在窗帘后面，阿宁把一颗糖分给你；{"social":4,"network":3,"mood":2} meet:friend
- life-1-1 先跑去楼下 → 你赶在铁门关上前踢完了最后一球；{"body":4,"health":2} 
- life-1-2 画一张寻物纸条 → 下课时，多了三个小孩来问你画的是什么；{"charm":4,"skill":2,"mood":3} 

### spring-envelope · 这笔钱，我想自己管（S）
spring-gift 新人生；注册序 99；实体红包／悠悠球

进入时由 giftCard 生成情境。
- spring-envelope-box 自己藏好 → 自己藏好；{} 
- spring-envelope-family 交给家人 → 交给家人；{} meet:parent
- spring-envelope-drawer 放进抽屉 → 放进抽屉；{} 

## 2 / 8 岁 / 童年

### life-2 · 台灯接触不好（A）
公共兜底；注册序 1；热点与精力工作台

写字写到一半，桌上的灯灭了。家里只有一盒旧零件。
- life-2-0 跟着家人修灯 → 把最后一颗螺丝拧紧以后，你决定一直用它；{"skill":5,"stress":3} gain:lamp, exp:repair, meet:parent
- life-2-1 给灯换个位置 → 灯还能用，你把它搬到离插座更近的桌角；{"family":5,"mood":2} gain:lamp, meet:parent
- life-2-2 把灯让给家里 → 明早窗边光线更好，你给自己留了张便条；{"mind":4,"stress":-6,"mood":4} meet:parent
运行时额外／改义选项（采样）：life-2-0 把作业本推到灯下；life-2-1 把灯移到窗边；life-2-2 把亮处让给家人

### school-yoyo · 我也想玩那个（S）
spring-gift 新人生；注册序 100；实体红包／悠悠球

进入时由 giftCard 生成情境。
- school-yoyo-keep 继续留着 → 继续留着；{} 
- school-yoyo-buy 买下它 → 买下它；{} gain:yoyo

## 3 / 10 岁 / 童年

### life-3 · 集市上的两元钱（S）
公共兜底；注册序 2；硬币分配

兜里只剩两个硬币。有人在摊子前演示会跑的铁皮青蛙。
- life-3-0 换一把旧积木 → 回家以后，你用一只空盒拼出了一座站台；{"skill":5,"stress":3} 
- life-3-1 请同学吃冰棍 → 那个人把木棍洗干净，说想做书签；{"social":4,"network":3,"mood":2} meet:friend
- life-3-2 留作车钱 → 下了一场阵雨，你坐车回家时鞋还是干的；{"mind":4,"stress":-6,"mood":4} 

## 4 / 12 岁 / 童年

### life-4 · 圆桌坐哪边（S）
公共兜底；注册序 3；鱼盘与碗，旧档走原桌

亲戚问谁愿意讲一件学校里的趣事。转盘上的最后一块鱼还没有人夹。
- life-4-0 讲纸飞机落到哪儿了 → 大家笑起来，有人问你纸飞机怎么折；{"charm":4,"skill":2,"mood":3} 
- life-4-1 先把饭盛给家人 → 热饭端上来以后，话题慢了下来；{"family":5,"mood":2} 
- life-4-2 给没赶回来的人留一份 → 你把碗倒扣好，夹了一双干净筷子；{"social":4,"network":3,"mood":2} 
运行时额外／改义选项（采样）：life-4-turn 给家人转一道菜；life-4-reply 接一句近况；life-4-ask 问家人小时候的事；life-4-humor 开个玩笑；life-4-story 讲一段真实往事；life-4-quiet 安静吃完这顿饭；life-4-save-fish 把鱼留到下顿；life-4-eat-fish 夹走最后一块鱼；life-4-keep-eating 继续吃饭；life-4-save-fish 给晚归的家人留鱼

## 5 / 13 岁 / 求学

### life-5 · 走读的新路线（B）
公共兜底；注册序 4；日程主次行动

学校搬到马路对面。公交站没有遮雨棚，骑车要经过一段坡。
- life-5-0 步行熟悉路线 → 第三天，你找到一条有树荫的小路；{"body":4,"health":2} 
- life-5-1 跟阿宁一起坐车 → 等车时，你们约好互相借课堂笔记；{"social":4,"network":3,"mood":2} meet:friend
- life-5-2 留在教室多读一会儿 → 人少以后，才听清吊扇转起来的声音；{"knowledge":5,"stress":4} 

## 6 / 13 岁 / 求学

### life-6 · 体育器材室（S）
公共兜底；注册序 5；普通选项或房间热点

球网坏了，体育老师问有没有人愿意午休时修一修。
- life-6-0 去补网 → 你很快认出包装袋上那种结；{"skill":5,"stress":3} 
- life-6-1 借出备用球 → 大家提前十分钟凑齐了人；{"social":4,"network":3,"mood":2} 
- life-6-2 照常午休 → 下午的课上，你第一次没有打瞌睡；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-6-yoyo 带上悠悠球去练一轮；life-6-shuttlecocks 用留下的十元买球去打双打

## 7 / 14 岁 / 求学

### life-7 · 试卷翻到背面（A）
公共兜底；注册序 6；日程主次行动

这次空题都集中在最后一页。老师给你一张方格纸。
- life-7-0 做一本错题册 → 你先把反复错的类型圈成了三组；{"knowledge":5,"stress":4} gain:notes, thread:school, exp:practice
- life-7-1 约同桌讲题 → 你们轮流讲，谁讲卡住就重画一遍；{"social":4,"network":3,"mood":2} gain:notes, thread:school, exp:practice, meet:friend
- life-7-2 先把小题写稳 → 一周以后，留给最后一题的时间多了五分钟；{"mind":4,"stress":-6,"mood":4} 

## 8 / 14 岁 / 求学

### life-8 · 雨后的广播站（B）
公共兜底；注册序 7；普通选项或房间热点

雨停了，还有人不敢走过进校门那段积水。
- life-8-0 给下课铃配一段提示 → 走廊里有人跟着节奏慢下来；{"charm":4,"skill":2,"mood":3} 
- life-8-1 找一块旧木板 → 你们一起给最窄的位置搭了道小桥；{"skill":5,"stress":3} 
- life-8-2 留下帮忙撑伞 → 鞋湿了一半，今天却多了个一起回家的人；{"social":4,"network":3,"mood":2} meet:friend
运行时额外／改义选项（采样）：life-8-1 接过外婆的菜袋；life-8-1 拿家里的边角木搭桥；life-8-1 扶同学绕过积水

### school-prep · 老师留了一套题（A）
rule(school)；注册序 66；普通选项或房间热点

有些题重复出现过。也有人提醒你，期末以后还有别的安排。
- school-prep-0 试着在白天做完 → 你记下三处需要问老师的地方；{"knowledge":5,"stress":4} thread:school, exp:practice
- school-prep-1 和同学分开准备 → 两人约好回来各讲最难的那一题；{"social":4,"network":3,"mood":2} meet:friend, exp:practice
- school-prep-2 先留着题 → 你在卷子外面套了张封皮；{"mind":4,"stress":-6,"mood":4} 

## 9 / 15 岁 / 求学

### life-9 · 中考志愿单（A）
公共兜底；注册序 8；普通选项或房间热点

近的学校可以走读，远的学校有你想去的社团。家里正在算交通费。
- life-9-0 选远一点的学校 → 你答应每天到家报一声平安；{"knowledge":5,"stress":4} thread:school, direction:学术
- life-9-1 看有实训课的学校 → 实训室的开放日让你第一次摸到车床；{"skill":5,"stress":3} direction:手艺
- life-9-2 选能走回家的学校 → 你留下了放学后帮家里的时间；{"family":5,"mood":2} 

## 10 / 15 岁 / 求学

### life-10 · 第一次自己排练（B）
公共兜底；注册序 9；普通选项或房间热点

同学借到一间空教室。门口贴着下午五点交钥匙。
- life-10-0 试一段原创节目 → 你把算错拍子的那一段保留了下来；{"charm":4,"skill":2,"mood":3} direction:文艺
- life-10-1 做一个投影小工具 → 阿宁发现图上的小人可以左右动；{"skill":5,"stress":3} thread:indie, exp:teamwork, meet:friend
- life-10-2 去跑操场 → 你第一次把最后一圈跑得和第一圈一样快；{"body":4,"health":2} 

## 11 / 16 岁 / 求学

### life-11 · 借来的一台游戏机（A）
公共兜底；注册序 10；热点与精力工作台

阿宁拿来一台按键发涩的旧游戏机，说修好了就送你。校内比赛也正在招人。
- life-11-0 修好，试着报名参赛 → 你们约了第一周的练习时间；{"body":4,"health":2} gain:console, thread:esport, meet:friend, wish:rank
- life-11-1 记下想做的玩法 → 你留下游戏机，画出自己想加的一关；{"skill":5,"stress":3} gain:console, thread:indie, exp:teamwork, meet:friend, wish:make
- life-11-2 把游戏机还回去 → 你把周末留给复习，阿宁收好机器；{"knowledge":5,"stress":4} thread:school

## 12 / 17 岁 / 求学

### life-12 · 高三的午饭票（B）
公共兜底；注册序 11；普通选项或房间热点

午间复习群很快刷满消息。食堂过一会儿才开门。
- life-12-0 跟同学过一道难题 → 讲到第三遍，两个人都明白了；{"knowledge":5,"stress":4} thread:school, exp:practice
- life-12-1 趁天晴走一圈 → 回来时，你把群消息静音了一小时；{"body":4,"health":2} 
- life-12-2 买份热饭给自己 → 这两个月第一次坐着吃完午饭；{"mind":4,"stress":-6,"mood":4} 

### school-sprint · 竞赛和模拟考只隔一天（A）
rule(school)；注册序 67；普通选项或房间热点

两边都能参加，但休息和补习至少要放掉一项。
- school-sprint-0 重点补弱项 → 你划掉一些熟悉的练习，把时间留给没学懂的地方；{"knowledge":5,"stress":4} thread:school
- school-sprint-1 报一项竞赛 → 遇到难题时，大家才知道原来第一步能换一种写法；{"knowledge":5,"stress":4} thread:school, exp:practice
- school-sprint-2 把两晚睡足 → 读完题目再下笔的时间，比上次多了；{"mind":4,"stress":-6,"mood":4} 

## 13 / 18 岁 / 求学

### life-13 · 考场外的树荫（A）
公共兜底；注册序 12；普通选项或房间热点

监考老师说还有一刻钟。有人还在背最后一页笔记。
- life-13-0 温一下最弱的科目 → 你在候场的时候把难题的第一步捋顺了；{"knowledge":5,"stress":4} thread:school
- life-13-1 和熟人说两句话 → 你发现阿宁比你先开始紧张；{"social":4,"network":3,"mood":2} meet:friend
- life-13-2 把书放进袋子 → 进场前喝完半瓶水，后来记得的是窗上的光；{"mind":4,"stress":-6,"mood":4} 

### school-exam · 走进最后一场考场（A）
rule(school)；注册序 68；普通选项或房间热点

试卷发下去时，外面正好有一辆公交停站。
- school-exam-0 先过自己熟的部分 → 你做完以后认真回头看了未答完的题；{"knowledge":5,"stress":4} thread:school
- school-exam-1 按卷面顺序来 → 下笔前你把最后大题也从头读了一遍；{"mind":4,"stress":-6,"mood":4} 
- school-exam-2 把想起的解法写下来 → 一些步骤后来被你用在了别的题上；{"skill":5,"stress":3} exp:practice

## 14 / 18 岁 / 求学

### life-14 · 志愿截止的晚上（S）
公共兜底；注册序 13；热点与精力工作台

书桌上摊着三张简章。外地生活费、想学的东西和回家的时间都要考虑。
- life-14-0 冲自己准备过的学校 → 你把这一所写在第一行，也填好了备选；{"knowledge":5,"stress":4} admit:reach, wish:admit, direction:学术
- life-14-1 填更稳的专业 → 你按专业内容和能承担的学费排好顺序；{"knowledge":5,"stress":4} admit:steady
- life-14-2 选带实习的专业 → 录取后你先查了实训楼开放时间；{"skill":5,"stress":3} admit:trade, direction:手艺

## 15 / 18 岁 / 求学

### life-15 · 把桌子让出一半（B）
公共兜底；注册序 14；普通选项或房间热点

新的房间很小，书桌要和别人共用。窗台上正好能放一只杯子。
- life-15-0 约定轮流使用 → 你们把各自的时间写在一张班表上；{"social":4,"network":3,"mood":2} 
- life-15-1 练习自己整理工具 → 用到哪件就挂回去，桌面慢慢空出来；{"skill":5,"stress":3} 
- life-15-2 给家里打个电话 → 家人问窗户朝哪边，还记得给你留了床旧被子；{"family":5,"mood":2} meet:parent

### school-result · 查到录取结果以后（S）
rule(school)；注册序 69；普通选项或房间热点

录取页面已经更新。家人问你要不要现在一起看。
- school-result-0 把消息讲给家里听 → 你也讲了填在它后面的两个备选；{"family":5,"mood":2} meet:parent
- school-result-1 找阿宁走一圈 → 这段路后来成了你们说毕业时最常想起的地方；{"social":4,"network":3,"mood":2} meet:friend
- school-result-2 先看看接下来学什么 → 你在原来夹志愿草稿的地方放了新课表；{"knowledge":5,"stress":4} 

## 16 / 19 岁 / 求学

### life-16 · 社团的一张空位（A）
公共兜底；注册序 15；日程主次行动

一个小组刚腾出位置。每周两晚，周末还可能加练。
- life-16-0 去试训 → 你留下联系方式和一段比赛录像；{"body":4,"health":2} thread:esport, meet:coach
- life-16-1 去做校园游戏展 → 你第一次让陌生人坐下来玩了自己做的关卡；{"skill":5,"stress":3} thread:indie, exp:teamwork, wish:make
- life-16-2 把两个晚上还给自己 → 你把没睡够的几个早上补回来；{"mind":4,"stress":-6,"mood":4} 

### arena-club · 试训有一张计分纸（A）
rule(esport)；注册序 71；日程主次行动

两晚训练以后，只会留两个人。排课表也在桌上。
- arena-club-0 按场次练配合 → 教练记下你愿意补上的位置；{"body":4,"health":2} thread:esport, meet:coach
- arena-club-1 录一份练习再交 → 你自己看到了几处容易慌乱的判断；{"skill":5,"stress":3} thread:esport
- arena-club-2 保留为课余兴趣 → 周四晚上仍有空和同学打一场；{"mind":4,"stress":-6,"mood":4} pause:esport

## 17 / 19 岁 / 求学

### life-17 · 停电后的走廊（B）
公共兜底；注册序 16；普通选项或房间热点

宿舍突然断电，走廊还够亮。有人把节目的纸样拿了出来。
- life-17-0 继续改程序 → 明早才能试，你先把问题逐条写在纸上；{"skill":5,"stress":3} thread:indie
- life-17-1 跟阿宁拍一张合照 → 你洗了两张，把歪的一张留给自己；{"social":4,"network":3,"mood":2} gain:photo, meet:friend
- life-17-2 听家里一段语音 → 你一边听一边把电话下次要说的事记下；{"family":5,"mood":2} meet:parent

## 18 / 20 岁 / 求学

### life-18 · 第一份临时工（A）
公共兜底；注册序 17；普通选项或房间热点

夜市摊主、学校机房和社区站点都在找一周的帮手。
- life-18-0 去学校机房 → 你学会把故障整理成别人看得懂的步骤；{"skill":5,"stress":3} exp:workshop
- life-18-1 去夜市帮忙 → 收摊时，老板算清了每晚的工钱；{"money":900,"stress":6} 
- life-18-2 去社区登记 → 有人告诉你哪条巷子下雨会积水；{"social":4,"network":3,"mood":2} exp:safety

## 19 / 20 岁 / 求学

### life-19 · 贴在门上的招募（A）
公共兜底；注册序 18；普通选项或房间热点

工作室征求试玩，有家店想请你做小工具。有人的消息只写了两行。
- life-19-0 参加联合调试 → 反馈最后一条说，希望下个版本还能玩；{"skill":5,"stress":3} thread:indie, exp:teamwork
- life-19-1 接一份临时活 → 你第一次用自己挣的钱换了把椅子；{"money":900,"stress":6} 
- life-19-2 给朋友看机会 → 隔天也有人转发了一条适合你的消息；{"social":4,"network":3,"mood":2} meet:friend

### indie-kit · 一份能玩的旧文件（A）
rule(indie)；注册序 80；普通选项或房间热点

桌上的试玩文件里，小人还有两个动作没接上。你们只有一周时间。
- indie-kit-0 把第一关做完整 → 阿宁把收来的意见写在名字旁边；{"skill":5,"stress":3} gain:prototype, thread:indie, exp:teamwork, meet:friend
- indie-kit-1 把源文件交给阿宁 → 你保留了一份能开起来的副本；{"social":4,"network":3,"mood":2} gain:prototype, meet:friend
- indie-kit-2 先停止更新 → 你留了份笔记，写下当时想做的东西；{"mind":4,"stress":-6,"mood":4} pause:indie

## 20 / 21 岁 / 求学

### life-20 · 毕业前的一个月（A）
公共兜底；注册序 19；日程主次行动

大家把课桌上的书分成两摞。面试前，还有几件事可以先准备。
- life-20-0 练习交接技能 → 你试着把一项临时任务讲给没做过的人；{"skill":5,"stress":3} exp:workshop
- life-20-1 整理作品集 → 你补上了试玩者注意到的问题；{"charm":4,"skill":2,"mood":3} thread:indie
- life-20-2 去职业体验日 → 有人带你沿街走了一圈，讲了三个常见的风险点；{"body":4,"health":2} exp:safety

### school-degree · 校名印在项目通行证上（A）
rule(school)；注册序 70；日程主次行动

学校开放了一间机房，也开放了一个周末试岗名额。
- school-degree-0 约人做一个小项目 → 第一次停机时，搭档帮你把坏掉的部分写成清单；{"skill":5,"stress":3} thread:indie, exp:teamwork
- school-degree-1 去看一份真实的工作 → 你看见专业之外真正要学的几件事；{"knowledge":5,"stress":4} exp:workshop
- school-degree-2 临时退出把课补上 → 腾出来的周末让你听完了一堂以前没听懂的课；{"mind":4,"stress":-6,"mood":4} 

## 21 / 22 岁 / 求学

### life-21 · 就业市场（A）
公共兜底；注册序 20；普通选项或房间热点

你把四张岗位单分别折了角。几份工作的排班和通勤很不一样。
- life-21-0 找办公室岗位 → 招聘会结束前，你记下了两种不同的班次；{"knowledge":5,"stress":4} route:office
- life-21-1 去看制造班组 → 机床旁的人指给你看新手先从哪里学；{"skill":5,"stress":3} route:factory
- life-21-2 看走上街道的工作 → 你问了站点和班组什么时段最忙；{"body":4,"health":2} route:delivery

## 22 / 22 岁 / 求学

### life-22 · 散伙前留个地址（B）
公共兜底；注册序 21；普通选项或房间热点

毕业要打包退宿。留言本里还夹着两张尚未寄出的明信片。
- life-22-0 给阿宁留新地址 → 阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包；{"social":4,"network":3,"mood":2} meet:friend, gain:photo, gain:yearbook
- life-22-1 留一份试制文件 → 发给同伴之前，你删掉了所有无用的临时文件；{"skill":5,"stress":3} thread:indie, gain:prototype
- life-22-2 告别后慢慢回家 → 你坐了最慢的一趟车，打算看看中间的站；{"mind":4,"stress":-6,"mood":4} 

## 23 / 23 岁 / 职场

### life-23 · 第一份工牌（S）
公共兜底；注册序 22；热点与精力工作台

工作机会摆在桌上。四份工作都有起薪、值班和不同的上手时间。
- life-23-0 进办公室 → 小周先教你把常用文件分到两个文件夹；{"knowledge":5,"stress":4} job:office, gain:badge, meet:colleague
- life-23-1 进制造班组 → 你跟着同事认清了交接时要问的三件事；{"skill":5,"stress":3} job:factory, gain:tools, meet:colleague
- life-23-2 入职配送站 → 小周带你认了第一个危险的路口；{"body":4,"health":2} job:delivery, gain:gloves, meet:colleague
- life-23-3 加入环卫班组 → 你沿着还未开门的店铺走完第一趟；{"social":4,"network":3,"mood":2} job:sanitation, gain:map, meet:colleague

### arena-offer · 战队给过一次试训回话（A）
rule(esport)；注册序 72；热点与精力工作台

有一个短期竞技位置，也有几份日常岗位申请。
- arena-offer-0 签短期战队协议 → 陈姐在合同边写下了休息和试用期；{"body":4,"health":2} job:player, meet:coach, thread:esport
- arena-offer-1 去办公室，把训练留给周末 → 同事的工位离窗只有两步，周末你照常练习；{"knowledge":5,"stress":4} job:office, meet:colleague, gain:badge
- arena-offer-2 选制造班组 → 周末的队伍通知仍在，你暂时没接；{"skill":5,"stress":3} job:factory, meet:colleague, gain:tools
- arena-offer-3 选配送站 → 你先去认安全的路口，再答复伙伴；{"body":4,"health":2} job:delivery, meet:colleague, gain:gloves
- arena-offer-4 进环卫班组 → 早班前你关掉了竞技群的自动提示；{"social":4,"network":3,"mood":2} job:sanitation, meet:colleague, gain:map

## 24 / 24 岁 / 职场

### life-24 · 第一次领到月薪（A）
公共兜底；注册序 23；普通选项或房间热点

工资到账，月底还要交房租。回家的车票已经开售。
- life-24-0 留一笔应急钱 → 你把第一笔钱单独记进账本；{"money":900,"stress":6} wish:save
- life-24-1 请家里吃饭 → 回来时你把空饭盒带去洗了；{"family":5,"mood":2} meet:parent
- life-24-2 留一个周末给自己 → 你睡到自然醒，打开窗通了风；{"mind":4,"stress":-6,"mood":4} 

### office-24 · 进门后的第一张表（A）
职业 office；注册序 46；普通选项或房间热点

小周提醒你，报销表总是退在同一列。
- office-24-0 查清退件原因 → 下次你把例子贴在打印机上；{"skill":5,"stress":3} gain:notebook, exp:workshop
- office-24-1 请小周看一遍 → 他圈了一栏，问你为什么认为应该填在那里；{"social":4,"network":3,"mood":2} meet:colleague
- office-24-2 把自己的第一单做对 → 交单以后终于有空记一个门禁号码；{"knowledge":5,"stress":4} 

### factory-24 · 扳手该挂在哪儿（A）
职业 factory；注册序 51；普通选项或房间热点

班组的工具板上少了一把合适的扳手。小周带你去看料箱。
- factory-24-0 一起对清工具清单 → 晚上换班的人找到了缺的那一把；{"skill":5,"stress":3} exp:workshop, gain:tools
- factory-24-1 请小周讲一遍停机流程 → 他说了一个纸面说明没写到的情形；{"social":4,"network":3,"mood":2} meet:colleague
- factory-24-2 先练自己的那道工序 → 第二趟就知道什么时候该停下来检查；{"knowledge":5,"stress":4} 

### delivery-24 · 第一条绕行建议（A）
职业 delivery；注册序 56；普通选项或房间热点

站点的地图看不出那座桥有多滑。小周等你一起骑第一趟。
- delivery-24-0 记下安全路线 → 你多走了四分钟，回来把坡度画在纸上；{"body":4,"health":2} gain:map, exp:safety, meet:colleague
- delivery-24-1 请教取餐的少一个台阶的入口 → 老板隔天就认出你在找哪里；{"social":4,"network":3,"mood":2} 
- delivery-24-2 多熟悉两处楼门 → 第三趟时，你已经能提前放慢速度；{"knowledge":5,"stress":4} 

### sanitation-24 · 第一趟街区清晨（A）
职业 sanitation；注册序 61；普通选项或房间热点

旧书店还没开门，清洁车轮子一直响。小周把站点的备用车推出来。
- sanitation-24-0 雨后先看背街 → 你把树根旁容易打滑的位置加进路线；{"body":4,"health":2} exp:safety, gain:map
- sanitation-24-1 问问沿街商户 → 店主帮你留出清洁车能临停的地方；{"social":4,"network":3,"mood":2} meet:colleague
- sanitation-24-2 给车轮做个检查 → 第二天转进小巷时，车终于不响了；{"skill":5,"stress":3} exp:workshop

### arena-start · 睡前复盘最后五分钟（A）
rule(esport-job)；注册序 73；普通选项或房间热点

陈姐说你的失误可以改，但先要承认哪一步决定太急。
- arena-start-0 向队友说明当时看见什么 → 队友把另一个角度的录像同步过来；{"social":4,"network":3,"mood":2} thread:esport, meet:coach
- arena-start-1 把失误写进战术本 → 下一次你们做了不止一套演练；{"skill":5,"stress":3} thread:esport, gain:notebook
- arena-start-2 先补几天觉 → 队里改用较短训练，你在第二天精神好了些；{"mind":4,"stress":-6,"mood":4} 

## 25 / 25 岁 / 职场

### life-25 · 夜班后的便利店（B）
公共兜底；注册序 24；普通选项或房间热点

雨把上班的路打湿了。店员在加热最后一份便当。
- life-25-0 还一笔小账 → 关掉银行页面后，你终于记得买一双干袜子；{"money":900,"stress":6} wish:save
- life-25-1 找同事坐一会儿 → 小周给你留出靠窗的位置；{"social":4,"network":3,"mood":2} meet:colleague
- life-25-2 下周少排一次晚班 → 你把空出来的那一晚留在日历最上面；{"mind":4,"stress":-6,"mood":4} 

## 26 / 25 岁 / 职场

### life-26 · 桌上又多了一只插座（B）
公共兜底；注册序 25；日程主次行动

你把自己的东西摆好，床边没有合适的地方放总响的闹钟。
- life-26-0 整理常用工具 → 最常用的三件东西都摸得着了；{"skill":5,"stress":3} 
- life-26-1 联系一个很久没见的人 → 过了两天，阿宁才发来两张街角照片；{"social":4,"network":3,"mood":2} meet:friend
- life-26-2 把房间留白一点 → 回家第一晚，你在干净的桌前喝了杯水；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-26-1 和阿宁交换联系方式

### indie-weekend · 下班后的联调（A）
rule(indie)；注册序 81；日程主次行动

阿宁做出了一个小关卡。第二天你还要早起。
- indie-weekend-0 约两个短晚上 → 你给现有版本留了一次真正的测试；{"skill":5,"stress":3} thread:indie, wish:make, meet:friend
- indie-weekend-1 先做预算表 → 你们把目前做得到的范围缩了下来；{"knowledge":5,"stress":4} gain:notebook, thread:indie
- indie-weekend-2 请搭档先停一下 → 项目还留在桌上，彼此有时间想清楚；{"mind":4,"stress":-6,"mood":4} pause:indie

## 27 / 26 岁 / 职场

### life-27 · 换班的人来了（A）
公共兜底；注册序 26；普通选项或房间热点

小周在交接纸背面记了几个电话。你有时间再跟一趟旧流程。
- life-27-0 记下工作的方法 → 下次交接时你把重要的一栏画得更大；{"skill":5,"stress":3} gain:notebook, exp:workshop
- life-27-1 帮新来的同事 → 他把你说的话另抄在袖珍本上；{"social":4,"network":3,"mood":2} exp:mentor, meet:colleague
- life-27-2 按自己的节奏完成 → 回家时还来得及买一份晚饭；{"mind":4,"stress":-6,"mood":4} 

### office-27 · 午休只剩二十分钟（A）
职业 office；注册序 47；普通选项或房间热点

领导临时把上午的两张表拼到一起。三个人都在等新的版本。
- office-27-0 把重复步骤合在一起 → 两位同事提前收工，你把方法记了下来；{"skill":5,"stress":3} exp:workshop
- office-27-1 问清哪张必须先交 → 有一张被推到明天，你还吃得上午饭；{"social":4,"network":3,"mood":2} meet:colleague
- office-27-2 按原样赶完 → 当天交得及时，后来才想起没见到阳光；{"money":900,"stress":6} 

### factory-27 · 夜班的交接铃（A）
职业 factory；注册序 52；普通选项或房间热点

交接早到五分钟就能说清温度异常，晚一点却能多睡一会儿。
- factory-27-0 改成交接清单 → 两班各留三分钟，误报慢慢少了；{"skill":5,"stress":3} gain:notebook, exp:workshop
- factory-27-1 跟同事调班 → 他答应临时换一天，也提前说了下周有事；{"social":4,"network":3,"mood":2} meet:colleague
- factory-27-2 按防护流程结束 → 多花了一会儿，你回家给手腕敷了热毛巾；{"money":-250,"health":3,"stress":-4} exp:safety

### delivery-27 · 雨里少跑一单（A）
职业 delivery；注册序 57；普通选项或房间热点

预报比平时更急，站点同时多了一批订单。手上的雨衣还没干。
- delivery-27-0 提前换到熟悉的片区 → 钱少一点，回站时还能把灯擦干；{"money":-250,"health":3,"stress":-4} protect:2, exp:safety
- delivery-27-1 同同事交换一段路线 → 两人各跑熟悉的那半边；{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- delivery-27-2 按原单量继续 → 这一晚收入够了，衣服到夜里还湿着；{"money":900,"stress":6} protect:0

### sanitation-27 · 垃圾车换了时刻（A）
职业 sanitation；注册序 62；普通选项或房间热点

早市和清运时间撞在一起。搬桶的时候还要留出人行道。
- sanitation-27-0 同班组重排顺序 → 早点出来的那一趟明显顺了一点；{"skill":5,"stress":3} exp:workshop
- sanitation-27-1 和摊主约一段时间 → 赶早的人少绕了一次路；{"social":4,"network":3,"mood":2} meet:colleague
- sanitation-27-2 先停下来设好防护 → 速度慢一点，来往的人有了清楚的通道；{"money":-250,"health":3,"stress":-4} protect:2

### arena-lineup · 首发和替补的名单（A）
rule(esport-job)；注册序 74；普通选项或房间热点

首发需要多两场配合训练。替补也能参赛，还能留出恢复时间。
- arena-lineup-0 练首发配合 → 第二周队友认得出你报点的声音；{"body":4,"health":2} thread:esport, meet:coach
- arena-lineup-1 做稳定的替补 → 你按时复盘，也给手腕留了恢复时间；{"mind":4,"stress":-6,"mood":4} exp:recovery
- arena-lineup-2 开始想退役之后 → 在朋友的新项目里，你第一次考虑怎么做观战工具；{"skill":5,"stress":3} thread:indie

## 28 / 26 岁 / 职场

### life-28 · 新家的床头（A）
公共兜底；注册序 27；工作台／物件去向

东西都能带走，床头只摆得下一件。抽屉里垫着一张旧报纸。
- life-28-0 把熟悉的东西带走 → 搬进去第一晚，你找到了旧物的位置；{"family":5,"mood":2} moveitems:keep
- life-28-1 把旧物收进储物柜 → 你在纸箱上写好日期，以后仍能找回；{"mind":4,"stress":-6,"mood":4} moveitems:store
- life-28-2 把旧物转送出去 → 你交给来取货的人，桌面留下了空位；{"social":4,"network":3,"mood":2} moveitems:give

## 29 / 27 岁 / 职场

### life-29 · 周三的临时消息（A）
公共兜底；注册序 28；普通选项或房间热点

工作群的消息和朋友的邀约同时亮了起来。你盯着日历空格看了一会儿。
- life-29-0 先答复工作 → 值班计划定了下来，你把私人事往后挪；{"money":900,"stress":6} 
- life-29-1 给朋友留一小时 → 你们关掉聊天框，真的把计划说清楚了；{"social":4,"network":3,"mood":2} meet:friend
- life-29-2 给自己空一天 → 到晚上，手机最后一条消息也没催第二次；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-29-1 和阿宁交换联系方式

### chance-old-friend · 阿宁发来一页旧笔记（A）
rule(chance)；注册序 96；普通选项或房间热点

阿宁发来的纸页上有几处旧涂改。阿宁问你想不想把想法说完。
- chance-old-friend-0 用半晚把草稿做出来 → 最后你们留下一份能互相交接的草稿；{"skill":5,"stress":3} thread:indie, meet:friend, exp:teamwork
- chance-old-friend-1 把消息留到周末 → 对方回了一个时间，也问你最近如何；{"social":4,"network":3,"mood":2} meet:friend
- chance-old-friend-2 告诉他最近没有余力 → 他把文件留给你，说有空再看；{"mind":4,"stress":-6,"mood":4} 

## 30 / 27 岁 / 职场

### life-30 · 雨衣放在哪里（B）
公共兜底；注册序 29；日程主次行动

新同事问为什么你出门前总绕着窗边走一圈。今天的天很低。
- life-30-0 一起对照天气和路线 → 两个临时任务挪到了路况好一点的时候；{"body":4,"health":2} exp:safety
- life-30-1 把经验贴在墙上 → 同事在纸边加了一条以前没想到的提示；{"skill":5,"stress":3} exp:mentor
- life-30-2 把余下的活分出去 → 你少了一笔收入，也多了一晚完整的睡眠；{"mind":4,"stress":-6,"mood":4} 

## 31 / 28 岁 / 职场

### life-31 · 租金单折了个角（B）
公共兜底；注册序 30；普通选项或房间热点

房东发来续租单。家里问需不需要凑一笔钱，晚点也能再答复。
- life-31-0 先续租 → 你们跟房东谈好分两次付款；{"money":-600,"mood":4} 
- life-31-1 找合适的合租房 → 看房那天下雨，你记下了窗户有没有漏水；{"social":4,"network":3,"mood":2} 
- life-31-2 请家人先别打钱 → 电话里多说了会儿以后想住什么样的房子；{"family":5,"mood":2} meet:parent

## 32 / 29 岁 / 职场

### life-32 · 这份工作还有别的做法（A）
公共兜底；注册序 31；普通选项或房间热点

例会散了，桌上留下别人不愿接的任务和一张培训表。
- life-32-0 把交接再写清楚 → 有人终于知道周二交不出材料该找谁；{"skill":5,"stress":3} exp:workshop
- life-32-1 去听培训 → 下次整理日程时，你开始把休息也排进去；{"knowledge":5,"stress":4} exp:safety
- life-32-2 先做眼前的一件事 → 下班时还留着一小时自己的时间；{"mind":4,"stress":-6,"mood":4} 

### office-32 · 工作被并到另一个组（A）
职业 office；注册序 48；普通选项或房间热点

新组只留一个人负责旧项目。小周的岗位也要调整。
- office-32-0 交出可接手的资料 → 对方问你能否留下帮助一周；{"skill":5,"stress":3} exp:workshop
- office-32-1 打听有无内部空位 → 两人把各自知道的招聘信息贴在一起；{"social":4,"network":3,"mood":2} meet:colleague
- office-32-2 按短薪安排下一月 → 你第一次把房租和交通记在同一张表；{"mind":4,"stress":-6,"mood":4} setback:office

### factory-32 · 手腕开始发木（A）
职业 factory；注册序 53；普通选项或房间热点

换批次后手上的动作变密。产量和休息很难同时保住。
- factory-32-0 先报告并换工位 → 工时少了一点，你花了两周适应另一道工序；{"money":-250,"health":3,"stress":-4} setback:factory, protect:2
- factory-32-1 和同事轮换操作 → 小周帮了两班，余下时间还需要重新安排；{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- factory-32-2 先完成这一批 → 产量顶住了，夜里手腕更难放松；{"money":900,"stress":6} protect:0

### delivery-32 · 站点调整配送范围（A）
职业 delivery；注册序 58；普通选项或房间热点

远处的地址多了一截上坡。时效和原来一样，熟悉的路线变少了。
- delivery-32-0 提交真实的绕行时间 → 站里先把两处积水点划成慢行段；{"social":4,"network":3,"mood":2} exp:safety, meet:colleague
- delivery-32-1 减少高负荷订单 → 这半个月收入少了，你留出看恢复情况的时间；{"money":-250,"health":3,"stress":-4} protect:2
- delivery-32-2 先接这批新范围的单 → 你记熟地址的同时也多付了一次修车钱；{"money":900,"stress":6} protect:0

### sanitation-32 · 街口开始围挡（A）
职业 sanitation；注册序 63；普通选项或房间热点

施工挡住了半条人行道，绕行增加作业量。排班表还没换。
- sanitation-32-0 提出增补班组 → 负责的人同意先试两周，原来的问题要继续记；{"social":4,"network":3,"mood":2} meet:colleague, protect:1
- sanitation-32-1 先改作业时段 → 你把旧线路缩短了，工时也少了；{"money":-250,"health":3,"stress":-4} setback:sanitation, protect:2
- sanitation-32-2 维持原来范围 → 旧习惯帮你完成任务，晚上肩背却更紧；{"money":900,"stress":6} protect:0

### arena-injury · 手腕发紧的时候（A）
rule(esport-job)；注册序 75；普通选项或房间热点

还有一轮选拔。继续超量练习可能加重负担，减练会影响磨合。
- arena-injury-0 减量，留出恢复时间 → 陈姐把一场训练改成你可以参加的复盘；{"money":-250,"health":3,"stress":-4} protect:2, exp:recovery
- arena-injury-1 调整位置和动作 → 队里改了一套战术，你需要重新熟悉节奏；{"body":4,"health":2} protect:1, thread:esport
- arena-injury-2 先坚持到这场打完 → 你记了一场完整录像，手腕的不适还在；{"money":900,"stress":6} protect:0, thread:esport

## 33 / 30 岁 / 职场

### life-33 · 三条未读消息（S）
公共兜底；注册序 32；热点与精力工作台

值班表今晚更新，阿宁问这周能否一起做游戏原型。你也有一个很久没歇过的周末。
- life-33-0 承担新的工作 → 排班稳定了，其他事再约时间；{"money":900,"stress":6} priority:work
- life-33-1 抽时间和阿宁做项目 → 你们留了第一个能坐下来做事的晚上；{"skill":5,"stress":3} thread:indie, meet:friend, project:sketch, priority:project
- life-33-2 把周末留给身体 → 周日下午你没有设闹钟；{"mind":4,"stress":-6,"mood":4} priority:rest

### indie-budget · 第一份可发出去的试玩（A）
rule(indie)；注册序 82；热点与精力工作台

试玩展下月开，工作也排到了同一周。还需要留一点资金和休息时间。
- indie-budget-0 先把玩法做完整 → 你删了一张地图，试玩真的可以打通了；{"skill":5,"stress":3} project:polish, wish:make, priority:project
- indie-budget-1 优先处理程序问题 → 三种机型的问题只剩下一种难以重现；{"knowledge":5,"stress":4} project:repair, wish:make, priority:project
- indie-budget-2 先守住本职收入 → 试玩延期，你把现有版本留在电脑里；{"money":900,"stress":6} project:wait, priority:work
- indie-budget-3 把休息排进日历 → 你和搭档约好，等身体缓过来再看试玩；{"mind":4,"stress":-6,"mood":4} pause:indie, priority:rest

## 34 / 31 岁 / 职场

### life-34 · 谁来一起吃晚饭（B）
公共兜底；注册序 33；普通选项或房间热点

家里想知道你打算和谁一起过。问话很轻，屋里却忽然安静下来。
- life-34-0 把自己的计划说清楚 → 家人听完，问能不能下周继续聊；{"family":5,"mood":2} meet:parent
- life-34-1 认真回应那个人的邀约 → 你们只约定了下次见面的地点；{"social":4,"network":3,"mood":2} meet:friend
- life-34-2 留着自己的饭点 → 你把这件事留到自己愿意开口的时候；{"mind":4,"stress":-6,"mood":4} 

## 35 / 31 岁 / 职场

### life-35 · 手里的活慢下来（A）
公共兜底；注册序 34；普通选项或房间热点

旧安排突然变了，接下来几周的收入可能少一截。
- life-35-0 找一个现金缓冲 → 你核对了要付的账单，先谈成了两周的临时班；{"money":900,"stress":6} wish:save
- life-35-1 问同事能不能换班 → 小周告诉你他哪天能接，另外两天你还得自己想办法；{"social":4,"network":3,"mood":2} meet:colleague
- life-35-2 先减少几项开支 → 一周后你在表上划掉了没必要的费用；{"mind":4,"stress":-6,"mood":4} 

### indie-rights · 谁能用这段声音（A）
rule(indie-active)；注册序 83；普通选项或房间热点

一段配乐没有谈清使用方式。展会要收的是可以正式发布的版本。
- indie-rights-0 换掉配乐继续迭代 → 你们用了可授权的声音，晚交了一天；{"skill":5,"stress":3} project:repair
- indie-rights-1 和原作者谈约定 → 两人把署名、配合时间和能用的部分讲清楚；{"social":4,"network":3,"mood":2} project:polish, meet:friend
- indie-rights-2 先收起项目 → 你们把还能继续的文件整理好再各自关机；{"mind":4,"stress":-6,"mood":4} pause:indie

## 36 / 32 岁 / 职场

### life-36 · 把余下这一周排好（S）
公共兜底；注册序 35；热点与精力工作台

手上的活仍在等人，身体和收入都需要考虑。继续硬撑会加重负担。
- life-36-0 找同事接一班 → 你把交接时间谈清楚，收入少了一点；{"social":4,"network":3,"mood":2} protect:1
- life-36-1 按原计划完成 → 钱先保住了，你给下一周留了一张体检单；{"money":900,"stress":6} protect:0
- life-36-2 安排休假和交接 → 你申请晚些复工，账款暂时由储蓄垫付；{"money":-250,"health":3,"stress":-4} protect:2

### arena-tactics · 出场前三步（A）
rule(esport-job)；注册序 76；热点与精力工作台

三张战术纸只能确定一张作为开局。还可以用余力和队友对一次细节。
- arena-tactics-0 先稳住可以配合的位置 → 队友知道第一波该为谁留出空档；{"skill":5,"stress":3} thread:esport, arena:steady
- arena-tactics-1 抢先打开空间 → 你们练了一套高投入战术，早段必须保持清醒；{"body":4,"health":2} thread:esport, arena:attack
- arena-tactics-2 把这一场交给替补 → 你把对手录像的时间点留在桌上；{"mind":4,"stress":-6,"mood":4} arena:mentor

### rain-shift · 路口的雨没有停（A）
rule(delivery)；注册序 89；热点与精力工作台

远处订单仍在等。看得清楚的路变少，延时和收入摆在一起。
- rain-shift-0 暂停高风险路段 → 你通知站点延时，先交接路况；{"money":-250,"health":3,"stress":-4} protect:2, rain:2
- rain-shift-1 改跑熟悉的近线 → 钱会少一点，熟路给你留了减速的空间；{"body":4,"health":2} protect:1, rain:1
- rain-shift-2 照原排班完成 → 这次收入保住了，你还得承担更长的湿滑路段；{"money":900,"stress":6} protect:0, rain:0

### office-pivot · 部门给了两周的调整期（A）
rule(office)；注册序 90；热点与精力工作台

要决定是否跟岗位走。原来熟悉的人不一定都能留下。
- office-pivot-0 找交接和转岗机会 → 你向能联系到的同事说清了自己会做什么；{"social":4,"network":3,"mood":2} setback:office, protect:1
- office-pivot-1 接受暂时缩时 → 收入变少，你把一项固定支出延后；{"mind":4,"stress":-6,"mood":4} setback:office, protect:2
- office-pivot-2 把现有工作赶完 → 这周做完能收到尾款，下个月还需要新安排；{"money":900,"stress":6} setback:office, protect:0

### factory-pivot · 排班里多了一道工序（A）
rule(factory)；注册序 91；热点与精力工作台

最近手腕的恢复时间不够。工序调整可以协商。
- factory-pivot-0 要求暂停重复工序 → 调班审批下来以前，你先按更短时段工作；{"money":-250,"health":3,"stress":-4} setback:factory, protect:2
- factory-pivot-1 找同事轮岗 → 你们约好交接频率，也写下做不到时找谁；{"social":4,"network":3,"mood":2} protect:1
- factory-pivot-2 照老班表继续 → 这周奖金够了，之后也需要为劳损留时间；{"money":900,"stress":6} setback:factory, protect:0

### city-pivot · 半条街暂时封起来（A）
rule(sanitation)；注册序 92；热点与精力工作台

绕行道路狭窄，原来的防护工具也需要先更换。
- city-pivot-0 先补防护和临时线路 → 你花了半班看路线，把新边界写回值班表；{"money":-250,"health":3,"stress":-4} protect:2
- city-pivot-1 和相邻组合作 → 手边的计划必须再改一次，两边各调出一个时段；{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- city-pivot-2 按原计划先完成 → 工作范围没少，明天需要处理今天留下的积压；{"money":900,"stress":6} setback:sanitation, protect:0

## 37 / 33 岁 / 职场

### life-37 · 再试一次上手（B）
公共兜底；注册序 36；普通选项或房间热点

停了几天后，你重新把上班需要的东西摆在桌边。
- life-37-0 按短班复工 → 第一周留出了恢复时间，你把班表贴得很低；{"mind":4,"stress":-6,"mood":4} exp:recovery
- life-37-1 找站点学一点调度 → 你开始能解释一条时间表为什么总出问题；{"knowledge":5,"stress":4} exp:workshop
- life-37-2 跟同事过一遍流程 → 小周告诉你可以共担的部分，也说了他自己的限制；{"social":4,"network":3,"mood":2} meet:colleague
运行时额外／改义选项（采样）：life-37-0 给下一周排个短班

### office-37 · 原来的座位没了（A）
职业 office；注册序 49；普通选项或房间热点

你熟悉的那一排工位暗了两盏灯。有人约你谈下一份工作。
- office-37-0 带交接笔记去面谈 → 你能清楚解释自己解决过什么；{"knowledge":5,"stress":4} gain:notebook
- office-37-1 试一个边界清楚的岗位 → 你问清哪几天可以准点走；{"mind":4,"stress":-6,"mood":4} exp:recovery
- office-37-2 跟小周交换招聘页 → 你们约定看到合适的就各发一份；{"social":4,"network":3,"mood":2} meet:colleague
运行时额外／改义选项（采样）：office-37-0 把自己做过的事写成面谈提纲

### factory-37 · 离开熟悉的机台（A）
职业 factory；注册序 54；普通选项或房间热点

班里有个新人才来几天。你还没决定要不要拿新的岗位证。
- factory-37-0 带新人过检查项 → 他学会了遇到异响先停再问；{"social":4,"network":3,"mood":2} exp:mentor
- factory-37-1 去学新的工序 → 实训期没有原来熟练，你接受缓一点；{"knowledge":5,"stress":4} exp:recovery
- factory-37-2 把旧机台做稳 → 你把几项容易漏的检查补进了说明；{"skill":5,"stress":3} exp:workshop

### delivery-37 · 坐在站点等复工（A）
职业 delivery；注册序 59；普通选项或房间热点

收入还没有回到原来。小周只有两天能换给你，站里说可以先短班或去学调度。
- delivery-37-0 用短班慢慢恢复 → 第一周少跑几单，第二周身体仍需要休息；{"money":-250,"health":3,"stress":-4} exp:recovery, job:delivery
- delivery-37-1 到站里学调度 → 头一次改完排班表，你留了应急的一列；{"knowledge":5,"stress":4} job:dispatcher, exp:recovery
- delivery-37-2 找小周试新的路线 → 他只能陪一上午，后半趟你自己走稳；{"social":4,"network":3,"mood":2} meet:colleague, exp:recovery
运行时额外／改义选项（采样）：delivery-37-0 先试一周短班

### sanitation-37 · 把街区交给熟悉的人（A）
职业 sanitation；注册序 64；普通选项或房间热点

新人认得路，却没赶上雨水从旧坡往下冲的时候。
- sanitation-37-0 陪他雨后重走一遍 → 你把原来省略的两条支路也讲了；{"social":4,"network":3,"mood":2} exp:mentor
- sanitation-37-1 做一张换班图 → 工地收工后，图上的细线还能派上用场；{"skill":5,"stress":3} gain:map, exp:workshop
- sanitation-37-2 申请轻一点的作业段 → 腾下的时间让你每天都能按点吃早饭；{"mind":4,"stress":-6,"mood":4} exp:recovery

### delivery-routine · 站里有人在等一份新排班（A）
rule(delivery-routine)；注册序 93；普通选项或房间热点

风雨过后，站点让你选下个月要怎样接班。小周的班也有变动。
- delivery-routine-0 留下熟悉路线 → 你在值班表上留了一格供临时调整；{"body":4,"health":2} exp:safety
- delivery-routine-1 去了解调度岗位 → 新人问到一条路线，你知道该先解释哪个时间段；{"knowledge":5,"stress":4} job:dispatcher, exp:workshop
- delivery-routine-2 和小周约好交接时间 → 你们把各自需要提前说的事写在一起；{"social":4,"network":3,"mood":2} meet:colleague

## 38 / 34 岁 / 职场

### life-38 · 柜子底下的旧东西（A）
公共兜底；注册序 37；普通选项或房间热点

家里要换一只柜子。底层有一叠边角变黄的纸。
- life-38-0 给手边的旧物一个位置 → 你把柜子擦了两遍，终于挑出一格；{"skill":5,"stress":3} reopen:choose
- life-38-1 和家人聊纸上的事 → 一件事被你们记成了两个版本；{"family":5,"mood":2} meet:parent
- life-38-2 先打扫桌面 → 你留下一张干净的纸，给今天写两句；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-38-0 把空出的位置留着

### active-recovery · 下一张账单还会到（A）
rule(recover)；注册序 94；普通选项或房间热点

前一段停工的代价还在。恢复情况允许你重新排计划。
- active-recovery-0 试一轮短班复工 → 你按承受得住的时间重新上手，还保留了休息日；{"money":-250,"health":3,"stress":-4} recover:short, exp:recovery
- active-recovery-1 学一个新岗位 → 适应期工资还没回到原来，已经能看见新的安排；{"knowledge":5,"stress":4} recover:change, exp:recovery
- active-recovery-2 请人共担一段 → 小周说只能帮到月底，你据此改过日程；{"social":4,"network":3,"mood":2} recover:help, exp:recovery, meet:colleague
运行时额外／改义选项（采样）：active-recovery-wait 带着账单再休养一段

## 39 / 35 岁 / 职场

### life-39 · 没人提醒的交接日（A）
公共兜底；注册序 38；普通选项或房间热点

旧同事换班以后，新来的那个人接过了你的值班表。
- life-39-0 陪新同事走一遍 → 他在表后写了下次能独立处理的三件事；{"social":4,"network":3,"mood":2} exp:mentor, meet:colleague
- life-39-1 补齐少一步的流程 → 两天后有人回来说现在容易找了；{"skill":5,"stress":3} gain:notebook, exp:workshop
- life-39-2 先把自己的活做稳 → 过了这周，你才报上一直想去的课；{"mind":4,"stress":-6,"mood":4} 

### arena-final · 最后一张比赛用纸（S）
rule(esport-job)；注册序 77；普通选项或房间热点

纸上画着上一局失误的位置。对手也还没有坐稳。
- arena-final-0 执行和队友定下的打法 → 手贴到桌上时，你先听见队友报位置；{"skill":5,"stress":3} final:play
- arena-final-1 在场边做协助 → 你把两处观察发给了队友，比赛由他们继续；{"social":4,"network":3,"mood":2} final:assist
- arena-final-2 准备退役 → 错过这一场以后，你想清楚仍想带走什么；{"mind":4,"stress":-6,"mood":4} final:leave

### indie-launch · 发布按钮下面还有一行字（S）
rule(indie-active)；注册序 84；普通选项或房间热点

仍有一个会影响部分玩家的故障。发布后也需要时间回复问题。
- indie-launch-0 提交现在的版本 → 你在说明里写明已知的问题和更新计划；{"skill":5,"stress":3} release:now
- indie-launch-1 延迟，做最后一轮修复 → 你又做了一遍测试，把还没解决的事列在提交单上；{"knowledge":5,"stress":4} release:later
- indie-launch-2 只留在制作组 → 你把现有可用的文件整理到同一个目录；{"mind":4,"stress":-6,"mood":4} release:stop

## 40 / 35 岁 / 职场

### life-40 · 三十五岁重新排表（S）
公共兜底；注册序 39；热点与精力工作台

你把合同、手机和这几年的账单摊开。接下来五年还有别的安排。
- life-40-0 留下并调整工作方式 → 你把想继续的事写成一行，交接时间更清楚了；{"skill":5,"stress":3} priority:work
- life-40-1 学习新的岗位 → 先试办三周，你决定等做完再给自己结论；{"knowledge":5,"stress":4} job:dispatcher, priority:change
- life-40-2 给自己缓冲一阵 → 这几个月少存一点钱，你换来一段可安排的时间；{"mind":4,"stress":-6,"mood":4} priority:rest

### arena-retire · 书包里多了一块替补牌（A）
rule(esport-job)；注册序 78；热点与精力工作台

下一季还没有签。有人邀请你带训练，也有人问要不要一起做项目。
- arena-retire-0 留下来给新人带训练 → 你转入队务办公室，从带新人复盘做起，把那次失误讲得更易懂；{"social":4,"network":3,"mood":2} job:office, exp:mentor, pause:esport
- arena-retire-1 去做游戏项目 → 你在项目办公室做协调，也把竞技所学变成一份玩法说明；{"skill":5,"stress":3} job:office, thread:indie, wish:make, pause:esport
- arena-retire-2 离开后先休息 → 新安排先做日间队务。第一个空出来的周末，没人问你今天训练几小时；{"mind":4,"stress":-6,"mood":4} job:office, pause:esport

## 41 / 38 岁 / 后半生

### life-41 · 新日历（B）
公共兜底；注册序 40；普通选项或房间热点

日历翻过几页。有的约定已经变了，有的现在终于有时间。
- life-41-0 定个能坚持的小目标 → 你把日期选在最容易空出来的那一天；{"mind":4,"stress":-6,"mood":4} wish:rest
- life-41-1 联系一个以前常见的人 → 没马上碰面，你们先交换了一点近况；{"social":4,"network":3,"mood":2} meet:friend
- life-41-2 接一件早年想做的事 → 这次你把预期写在最短的那行；{"skill":5,"stress":3} wish:make
运行时额外／改义选项（采样）：life-41-1 试着联系失联的阿宁；life-41-1 留下几句心里话

### indie-second-desk · 后来重新坐到桌前（A）
rule(former-player)；注册序 85；普通选项或房间热点

曾经的队友问你想不想把比赛里学到的东西做进一关游戏。你能拿出的时间有限。
- indie-second-desk-0 先把一关做出来 → 你把当队员时最熟悉的一个问题做成了关卡；{"skill":5,"stress":3} project:polish, wish:make
- indie-second-desk-1 和搭档试一个较小的版本 → 试玩文件已经能打开，你们还需要谈清接下来的安排；{"knowledge":5,"stress":4} project:repair, wish:make
- indie-second-desk-2 把计划留在纸上 → 晚上你还愿意看以前的战术，不需要马上变成作品；{"mind":4,"stress":-6,"mood":4} pause:indie

### late-recovery · 还有一段日子要重新安排（A）
rule(recover)；注册序 95；普通选项或房间热点

三十五岁的转折已经过去，之前停工的账单还留下了一部分。新一段生活允许你慢慢重新安排。
- late-recovery-0 约一个可试行的短班 → 你先谈好什么时候做得到、什么时候需要停下；{"money":-250,"health":3,"stress":-4} recover:short, exp:recovery
- late-recovery-1 从岗位培训重新开始 → 收入还没补齐，手里已有一份新的时间表；{"knowledge":5,"stress":4} recover:change, exp:recovery
- late-recovery-2 请能联系到的人分担 → 你们先对清哪些事可以一起做，哪些还要另想办法；{"social":4,"network":3,"mood":2} recover:help, exp:recovery, meet:colleague

## 42 / 45 岁 / 后半生

### life-42 · 街角换了招牌（B）
公共兜底；注册序 41；日程主次行动

上一次来，这间店还在卖练习本。路过的人已经习惯新的站牌。
- life-42-0 记录变化 → 你用旧纸记下为什么那条路后来变宽了；{"skill":5,"stress":3} 
- life-42-1 请熟人走一圈 → 你们走错一次，回头时发现还是原来那棵树；{"social":4,"network":3,"mood":2} meet:colleague
- life-42-2 留一段自己的路 → 下午在公园坐够半小时才回家；{"mind":4,"stress":-6,"mood":4} 

### indie-feedback · 以前的留言地址（A）
rule(indie-echo)；注册序 87；日程主次行动

邮箱里有一封和许多年前长得很像的回信。今天你可以按自己的节奏答复。
- indie-feedback-0 把回信留给这份作品 → 你记下玩家在哪一刻终于明白了规则；{"social":4,"network":3,"mood":2} meet:player, exp:launch
- indie-feedback-1 给阿宁看看 → 阿宁看完，问这条留言说的是哪一段玩法；{"social":4,"network":3,"mood":2} meet:friend
- indie-feedback-2 记下下一件想做的事 → 这次目标写得很小，几页纸就装得下；{"skill":5,"stress":3} wish:make
运行时额外／改义选项（采样）：indie-feedback-1 试着联系失联的阿宁

## 43 / 52 岁 / 后半生

### life-43 · 留出体力的日子（A）
公共兜底；注册序 42；普通选项或房间热点

有些事情做起来没有以前快了。你想把白天最清醒的一段留给什么？
- life-43-0 给工作减量 → 你和同事重新对好交接；{"mind":4,"stress":-6,"mood":4} meet:colleague
- life-43-1 留给小项目 → 你把作品的一部分做成了能寄到别人手里的东西；{"skill":5,"stress":3} thread:indie
- life-43-2 留给想见的人 → 行程只排了下午，可那天聊到了天黑；{"social":4,"network":3,"mood":2} meet:friend
运行时额外／改义选项（采样）：life-43-2 试着联系失联的阿宁；life-43-2 写一页自己的近况

### early-diagnosis · 把最近这段日子安排好（A）
rule(early)；注册序 97；普通选项或房间热点

一次突发的严重病情让长远计划变得不确定。医生说接下来需要留院照护。
- early-diagnosis-0 告诉能联系到的人 → 你说出了想要怎样度过接下来的日子；{"social":4,"network":3,"mood":2} early:contact
- early-diagnosis-1 把重要的物件和文件放在手边 → 你写下哪里还能找到没交接的东西；{"skill":5,"stress":3} early:object
- early-diagnosis-2 先留一段安静的时间 → 没有要立刻回的消息，你把窗边的位置留给下午；{"mind":4,"stress":-6,"mood":4} early:quiet

## 44 / 58 岁 / 后半生

### life-44 · 把会的事留下（A）
公共兜底；注册序 43；热点与精力工作台

有人说想学你以前做的事。桌上还有一格，够放一件旧物和一张纸。
- life-44-0 带一个人做一遍 → 对方学会后又解释给另一个人听；{"social":4,"network":3,"mood":2} exp:mentor, wish:pass
- life-44-1 重新拿出一件旧物 → 你把它放在看得见的地方，补了一张日期签；{"skill":5,"stress":3} reopen:choose
- life-44-2 给自己留这段记忆 → 你在纸上写下还有什么想记住；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-44-1 把空出的位置留着

### indie-second-launch · 隔了这么久，仍有人试玩（A）
rule(late-release)；注册序 86；热点与精力工作台

最后一轮试玩还有留言。可以在保留休息时间的同时，给作品一个去处。
- indie-second-launch-0 再打磨一下再提交 → 你按试玩反馈重新调整了关卡开头；{"skill":5,"stress":3} release:later
- indie-second-launch-1 提交并说明现在的范围 → 帮助文档多了一段当年比赛学来的东西；{"knowledge":5,"stress":4} release:now
- indie-second-launch-2 和合作者分享最终文件 → 这次作品留在你们之间，各自都收到了可玩的版本；{"mind":4,"stress":-6,"mood":4} release:stop

### early-goodbye · 今天窗边有光（S）
rule(early-next)；注册序 98；热点与精力工作台

病情继续恶化。还能安排的时间变短了，你想留下一件小事。
- early-goodbye-0 写下现在想到的话 → 你在最后一行写上了日期；{"mind":4,"stress":-6,"mood":4} earlyEnd:note
- early-goodbye-1 把一件旧物托付给照护的人 → 你说清楚它为什么留到了今天；{"family":5,"mood":2} earlyEnd:item
- early-goodbye-2 让这个下午安静过去 → 当天的最后一个画面是窗边挪动的一点光；{"mind":4,"stress":-6,"mood":4} earlyEnd:quiet
运行时额外／改义选项（采样）：early-goodbye-1 说一件想告诉照护者的事

## 45 / 64 岁 / 后半生

### life-45 · 离家一趟（A）
公共兜底；注册序 44；普通选项或房间热点

有空再走远一点。有人邀请你去看旧地方，也有几件事可以留到以后。
- life-45-0 看看熟悉的街区 → 地图上认得出一处转弯，剩下的留给下一次；{"body":4,"health":2} 
- life-45-1 回一封来信 → 写到第三句你才想起对方最初的问题；{"social":4,"network":3,"mood":2} meet:friend
- life-45-2 在家做一顿慢饭 → 饭后你听完一整张盘里的歌；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：life-45-1 试着联系失联的阿宁

### office-45 · 交回门禁以前（A）
职业 office；注册序 50；普通选项或房间热点

有人问从哪里找一份已经没人认识的文件。
- office-45-0 补齐索引给后来的人 → 半年后小周收到一张谢谢的便条；{"skill":5,"stress":3} shine:office
- office-45-1 留一张旧工牌 → 你终于知道自己为什么记得第一扇门；{"mind":4,"stress":-6,"mood":4} gain:badge
- office-45-2 叫上曾经的同事吃饭 → 你们谈了很多与这栋楼无关的话；{"social":4,"network":3,"mood":2} meet:colleague
运行时额外／改义选项（采样）：office-45-1 记下当年的门禁号码

### factory-45 · 工具板空出一格（A）
职业 factory；注册序 55；普通选项或房间热点

钥匙要交给下一班。工具板上挂着一把换过握把的公用扳手。
- factory-45-0 把方法演示给新人 → 他跟着做完一遍，又主动重新检查了一次；{"social":4,"network":3,"mood":2} exp:mentor, shine:factory
- factory-45-1 自己留着工具盒 → 你回去给松动的椅腿上了颗新螺丝；{"skill":5,"stress":3} gain:tools
- factory-45-2 和小周整理旧表 → 翻到交接日那一页时，你们都认出了旧字迹；{"mind":4,"stress":-6,"mood":4} meet:colleague
运行时额外／改义选项（采样）：factory-45-1 用班组的工具拧紧椅腿

### delivery-45 · 路还是那条路（A）
职业 delivery；注册序 60；普通选项或房间热点

坡底多了一排路灯。一个新人停下，问地图上怎么找安全的转弯处。
- delivery-45-0 在地图上补齐三处慢行点 → 新人下一趟主动绕开了积雪；{"skill":5,"stress":3} gain:map, shine:delivery
- delivery-45-1 和小周走一次旧路线 → 你们到了第一个路口才认出当年的取餐店；{"social":4,"network":3,"mood":2} meet:colleague
- delivery-45-2 把手套留给自己 → 反光条还能亮，你把它和新雨衣分开放；{"mind":4,"stress":-6,"mood":4} gain:gloves
运行时额外／改义选项（采样）：delivery-45-2 看看站点新换的手套

### sanitation-45 · 旧书店又开了门（A）
职业 sanitation；注册序 65；普通选项或房间热点

书店原址后来变成奶茶店，又开了一家二手书店。见到门口的树，你还认得。
- sanitation-45-0 给新班组留一张路线图 → 图贴上去的第二天，有人补了一个树荫点；{"skill":5,"stress":3} gain:map, shine:sanitation
- sanitation-45-1 和小周坐门口等雨停 → 两个人想不起哪年换的第一辆车；{"social":4,"network":3,"mood":2} meet:colleague
- sanitation-45-2 挑本书带回去 → 你记下一个仍在这条街生活的人；{"mind":4,"stress":-6,"mood":4} 

### arena-quiet · 这次比赛坐看台（A）
rule(esport-echo)；注册序 79；普通选项或房间热点

陈姐转来了一张入场券。票上的日期让你想起以前发训练表的时候。
- arena-quiet-0 和旧队伍见一面 → 大家聊了半小时各自在忙的事；{"social":4,"network":3,"mood":2} meet:coach
- arena-quiet-1 把比赛徽章收好 → 你把它放在今天带回来的赛程纸旁；{"mind":4,"stress":-6,"mood":4} 
- arena-quiet-2 给新人写一条建议 → 你删掉了“应该”，留下一个当时学会的方法；{"skill":5,"stress":3} exp:mentor
运行时额外／改义选项（采样）：arena-quiet-1 记下今天的比赛

### indie-memory · 第一份试玩重新打开了（A）
rule(indie-history)；注册序 88；普通选项或房间热点

屏幕比例不太对，按两下还能进到起始关卡。存档日期没有改。
- indie-memory-0 给最早的画面留张照片 → 你把截图打印出来，背面写上当时的日期；{"skill":5,"stress":3} reopen:prototype, gain:screenshot
- indie-memory-1 再和一位旧搭档说声谢谢 → 对方以为你早把那个版本删了；{"social":4,"network":3,"mood":2} meet:friend
- indie-memory-2 把文件归进自己的档案 → 晚上你另建了个空文件夹，暂时没给它起名；{"mind":4,"stress":-6,"mood":4} 
运行时额外／改义选项（采样）：indie-memory-1 试着联系失联的阿宁；indie-memory-1 把旧画面给阿宁看

## 46 / 72 岁 / 后半生

### life-46 · 剩下的一格（S）
公共兜底；注册序 45；热点与精力工作台

桌上有个空盒。打开之前，先想想这段日子还有什么放不下的事。
- life-46-0 继续手头这一件 → 待办纸压在盒子下面，明天还能接着做；{"skill":5,"stress":3} ending:open
- life-46-1 把桌上的东西慢慢收好 → 你擦完桌子，正好赶上房间里的最后一点日光；{"mind":4,"stress":-6,"mood":4} ending:natural
- life-46-2 把一段经验写给后来的人 → 信末没有写道理，你留了一个日期和地址；{"social":4,"network":3,"mood":2} ending:natural

## 精确匹配与覆盖规则
```js
  function rule(run,id) {
    const score = id => run.threads[id]?.steps ?? 0;
    switch(id) {
      case 'school': return run.slot === 15 ? Boolean(run.admission?.reach) : score('school') > 0;
      case 'esport': return score('esport') >= (run.slot === 23 ? 2 : 1) && run.people.coach?.status !== 'lost';
      case 'esport-job': return run.career === 'player';
      case 'esport-echo': return run.careerLog.some(record => record.to === 'player') && run.people.coach?.status === 'in-touch';
      case 'indie': return score('indie') >= (run.slot === 33 ? 2 : 1) && run.threads.indie.status !== 'paused';
      case 'former-player': return run.careerLog.some(record => record.from === 'player') && score('indie') > 0 && !run.project.started;
      case 'late-release': return run.project.startedAt === 41 && !run.project.closed;
      case 'delivery-routine': return run.career === 'delivery' && run.low?.type !== 'delivery';
      case 'indie-active': return run.project.started && !run.project.closed;
      case 'indie-echo': return run.project.published;
      case 'indie-history': return held(run.items.prototype) && run.project.started;
      case 'recover': return !!run.low && run.low.status === 'active' && run.slot > run.low.slot;
      case 'chance': return run.people.friend?.status === 'in-touch' && hash(run.seed,run.historyKey,'open-door') % 3 === 0;
      case 'early': return run.scenario === 'early' || (run.scenario === 'life' && (!run.low || run.low.status !== 'active') && hash(run.seed,run.historyKey,'unforeseen') % 100 === 0);
      case 'early-next': return !!run.early && run.slot === 44;
      default: return run.career === id;
    }
  }

  function schedule(run) {
    const giftId=run.childhood==='spring-gift' && C.giftEvents[run.slot-1];
    const matching = C.cards.filter(card => card.slot === run.slot && card.rule && rule(run,card.rule));
    const story = matching.find(card => card.rule === 'early-next' || card.rule === 'early')
      ?? matching.find(card => card.id === 'arena-final')
      ?? matching.find(card => card.rule === 'recover')
      ?? matching[0];
    const pastDelivery = run.careerLog.some(record => record.to === 'delivery');
    const occupationId = run.career === 'dispatcher' && pastDelivery ? 'delivery' : run.career;
    const occupation = C.cards.find(card => card.slot === run.slot && card.job && card.job === occupationId);
    const fallback=C.shared[run.slot-1];
    const winner=(giftId && C.cards.find(c=>c.id===giftId)) || story || occupation || fallback;
    const rows=C.cards.filter(c=>c.slot===run.slot).map(card=>({card,
      eligible:matching.includes(card)||card===occupation||card===winner||card===fallback&&!giftId}));
    run.pageTrace=continuity.plan(run,rows,winner.id);
    // Only concurrent, discretionary appointments can exchange the main time block.
    const local=rows.filter(r=>r.eligible && (r.card.rule||r.card.job)).map(r=>r.card.id);
    let menu=[];
    if([37,39,45].includes(run.slot) && local.length>1){
      menu=local.length>2?local.filter(id=>id!=='indie-memory'):local;
    }else if(([24,27,32].includes(run.slot) && occupation) || winner.id==='arena-tactics'){
      menu=[winner.id,fallback.id];
    }
    if(menu.length>1){
      run.pageTrace.menu=menu;
      const endCondition=({37:'站点敲定本轮班次',39:'决赛当晚与本轮版本交付时段重合',45:'同日的交接与见面只能赴一处'})[run.slot]??'本期时段已作安排';
      for(const entry of run.pageTrace.entries)if(menu.includes(entry.id))entry.endCondition=endCondition;
    }
    return winner;
  }

  function liveCandidate(run,card){
    if(!card || card.slot!==run.slot)return false;
    if(card.rule)return rule(run,card.rule);
    if(card.job)return card.job===run.career || card.job==='delivery' && run.career==='dispatcher' && run.careerLog.some(r=>r.to==='delivery');
    return card===C.shared[run.slot-1];
  }

  function chooseAppointment(run,id){
    const page=continuity.current(run);
    const card=C.cards.find(c=>c.id===id);
    if(!page?.menu?.includes(id)||!page.entries.some(e=>e.id===id&&e.eligible)||run.activity||run.committed||!liveCandidate(run,card))return false;
    continuity.seen(run,id);
    if(run.eventId===id)return true;
    const previous=run.eventId;
    for(const entry of page.entries){
      if(entry.scope==='event' && page.menu.includes(entry.id)){
        entry.selected=entry.id===id;
        entry.status=entry.seen?'offered':entry.selected?'eligible':'deferred';
      }else if(entry.host===previous){
        entry.selected=false;
      }
    }
    page.selected=run.eventId=id;
    run.entered=false;
    run.draft=emptyDraft();
    continuity.offers(run,currentCard(run));
    run.checkpoint=card.hotspot?snapshot(run):null;
    return true;
  }

  function inspectSample(run,index){
    const sample=C.sampleTasks[run.eventId];
    if(run.stage!=='event'||run.committed||run.activity||!sample||!Number.isInteger(index)||!sample.targets[index])return false;
    const match=index===sample.correct;
    run.draft.sampleAnswer=index;
    run.draft.inspection=match?'matched':'retry';
    if(match){
      run.draft.main=currentCard(run).choices[0].id;
      continuity.seen(run,run.draft.main);
    }
    return true;
  }

  function followups(run){
    const actions=LifeResponses.available(run);
    if(run.slot===46){
      const pending=continuity.pending(run,46,e=>e.id==='indie-memory')[0];
      if(pending && rule(run,'indie-history')){
        actions.push({id:'again-indie-memory',prior:'indie-memory',source:pending.origin,
          kind:'make',label:'打开当年的试玩，存下起始画面',outcome:'旧比例的画面亮起来。你按下截图键，把第一关夹进相册。',delta:{mood:2},commands:['gain:screenshot']});
      }
    }
    return actions;
  }


```
