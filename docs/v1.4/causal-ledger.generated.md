# 因果台账（机器投影）
每个测试文件按事件、选择、动作与部分变体保留首次成功提交的样本。种子不包含完整输入。规则测试含定点夹具，尤其 shop 的旧卡遍历；成功 commit 不能单独证明从首页可达。未采样不等于不可达。浏览器走测不并入此计数。
采到成功提交的注册事件 101/101；去重前按测试文件分别保留的见证 417 条。缺少未呈现候选的运行日志。


## life-1 · 1 / 6岁 · A · 公共兜底
- 声明 life-1-0：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-1-1：{"body":4,"health":2} 
- 声明 life-1-2：{"charm":4,"skill":2,"mood":3} 
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-1-2","action":"画一张寻物纸条","text":"下课时，多了三个小孩来问你画的是什么","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-1-1","action":"先跑去楼下","text":"你赶在铁门关上前踢完了最后一球","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-1-2","action":"画一张寻物纸条","text":"下课时，多了三个小孩来问你画的是什么","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-1-1","action":"先跑去楼下","text":"你赶在铁门关上前踢完了最后一球","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 1：{"choice":"life-1-2","action":"画一张寻物纸条","text":"下课时，多了三个小孩来问你画的是什么","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-1-0","action":"留下帮忙找","text":"水壶卡在窗帘后面，阿宁把一颗糖分给你","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/interaction.cjs，seed 1：{"choice":"life-1-2","action":"画一张寻物纸条","text":"下课时，多了三个小孩来问你画的是什么","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## spring-envelope · 1 / 6岁 · S · spring-gift 新人生
- 声明 spring-envelope-box：{} 
- 声明 spring-envelope-family：{} meet:parent
- 声明 spring-envelope-drawer：{} 
未采到正式提交的基础选项：无
- tests/gift.cjs，seed 1：{"choice":"spring-envelope-box","action":"自己藏好","text":"你把红包藏进自己的小盒子，轻轻扣好搭扣。这个位置你记住了。","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"spring-envelope","interactionId":"spring-envelope","sceneId":"spring-envelope","choiceId":"spring-envelope-box","balances":{},"observed":[],"performed":["box"],"owner":"player","place":"box","custodian":"player","amount":10,"balance":10},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"spring-envelope-family","action":"交给家人","text":"外婆接过红包，用红纸包好，放进柜子：“想用的时候就跟我说。”","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"spring-envelope","interactionId":"spring-envelope","sceneId":"spring-envelope","choiceId":"spring-envelope-family","balances":{},"observed":[],"performed":["family"],"owner":"player","place":"family","custodian":"外婆","amount":10,"balance":10},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"spring-envelope-drawer","action":"放进抽屉","text":"你拉开抽屉，把红包放在最前面。每天拿铅笔时都能看见它。","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"spring-envelope","interactionId":"spring-envelope","sceneId":"spring-envelope","choiceId":"spring-envelope-drawer","balances":{},"observed":[],"performed":["drawer"],"owner":"player","place":"drawer","custodian":"player","amount":10,"balance":10},"items":[],"people":[],"job":null,"highlights":[]}

## life-2 · 2 / 8岁 · A · 公共兜底
- 声明 life-2-0：{"skill":5,"stress":3} gain:lamp, exp:repair, meet:parent
- 声明 life-2-1：{"family":5,"mood":2} gain:lamp, meet:parent
- 声明 life-2-2：{"mind":4,"stress":-6,"mood":4} meet:parent
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"mood":1},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-2-2","action":"把灯让给家里","text":"明早窗边光线更好，你给自己留了张便条","delta":{"mind":4,"stress":-9,"mood":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 9：{"choice":"life-2-0","action":"跟着家人修灯","text":"把最后一颗螺丝拧紧以后，你决定一直用它","delta":{"skill":5,"mood":1},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-2-0","action":"跟着家人修灯","text":"把最后一颗螺丝拧紧以后，你决定一直用它","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-2-0","action":"跟着家人修灯","text":"把最后一颗螺丝拧紧以后，你决定一直用它","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-2-1","action":"给灯换个位置","text":"灯还能用，你把它搬到离插座更近的桌角","delta":{"mood":2,"family":5},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-2-0","action":"跟着家人修灯","text":"把最后一颗螺丝拧紧以后，你决定一直用它","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-2-0","action":"把作业本推到灯下","text":"家人把灯留给你，纸上终于能看清格子","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}
- tests/interaction.cjs，seed 1：{"choice":"life-2-2","action":"把灯让给家里","text":"明早窗边光线更好，你给自己留了张便条","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/interaction.cjs，seed 1：{"choice":"life-2-0","action":"跟着家人修灯","text":"把最后一颗螺丝拧紧以后，你决定一直用它","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["lamp"],"people":["parent"],"job":null,"highlights":[]}

## school-yoyo · 2 / 8岁 · S · spring-gift 新人生
- 声明 school-yoyo-keep：{} 
- 声明 school-yoyo-buy：{} gain:yoyo
未采到正式提交的基础选项：无
- tests/gift.cjs，seed 1：{"choice":"school-yoyo-buy","action":"买下它","text":"第二天，你用这十块钱买下悠悠球。第一次甩得有点歪，同学说：“你先慢一点，我教你。”","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-buy","balances":{},"observed":["see-price","go-home","open-box"],"performed":["see-price","go-home","open-box","buy"],"owner":"player","place":"box","custodian":null,"amount":10,"balance":0,"sourceCustodian":"player","price":10,"spent":10,"purchased":true,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"open-box","storedAt":null},"items":["yoyo"],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-yoyo-keep","action":"继续留着","text":"你把十块钱放回小盒子，扣好搭扣。","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-keep","balances":{},"observed":["see-price","go-home","open-box"],"performed":["see-price","go-home","open-box","keep"],"owner":"player","place":"box","custodian":"player","amount":10,"balance":10,"sourceCustodian":"player","price":10,"spent":0,"purchased":false,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"open-box","storedAt":"box"},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"school-yoyo-buy","action":"买下它","text":"第二天，你用这十块钱买下悠悠球。第一次甩得有点歪，同学说：“你先慢一点，我教你。”","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-buy","balances":{},"observed":["see-price","go-home","ask-family"],"performed":["see-price","go-home","ask-family","buy"],"owner":"player","place":"family","custodian":null,"amount":10,"balance":0,"sourceCustodian":"外婆","price":10,"spent":10,"purchased":true,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"ask-family","storedAt":null},"items":["yoyo"],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"school-yoyo-keep","action":"继续留着","text":"你说先不买了。外婆把十块钱重新包好，放回柜子。","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-keep","balances":{},"observed":["see-price","go-home","ask-family"],"performed":["see-price","go-home","ask-family","keep"],"owner":"player","place":"family","custodian":"外婆","amount":10,"balance":10,"sourceCustodian":"外婆","price":10,"spent":0,"purchased":false,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"ask-family","storedAt":"family"},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-yoyo-buy","action":"买下它","text":"第二天，你用这十块钱买下悠悠球。第一次甩得有点歪，同学说：“你先慢一点，我教你。”","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-buy","balances":{},"observed":["see-price","go-home","open-drawer"],"performed":["see-price","go-home","open-drawer","buy"],"owner":"player","place":"drawer","custodian":null,"amount":10,"balance":0,"sourceCustodian":"player","price":10,"spent":10,"purchased":true,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"open-drawer","storedAt":null},"items":["yoyo"],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-yoyo-keep","action":"继续留着","text":"你把十块钱放回练习本下面，轻轻推上抽屉。","delta":{},"from":[1],"opportunity":[],"echo":[],"interaction":{"eventId":"school-yoyo","interactionId":"school-yoyo","sceneId":"school-yoyo","choiceId":"school-yoyo-keep","balances":{},"observed":["see-price","go-home","open-drawer"],"performed":["see-price","go-home","open-drawer","keep"],"owner":"player","place":"drawer","custodian":"player","amount":10,"balance":10,"sourceCustodian":"player","price":10,"spent":0,"purchased":false,"sourceSlot":1,"story":"yoyo-story","retrievedBy":"open-drawer","storedAt":"drawer"},"items":[],"people":[],"job":null,"highlights":[]}

## life-3 · 3 / 10岁 · S · 公共兜底
- 声明 life-3-0：{"skill":5,"stress":3} 
- 声明 life-3-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-3-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-3-0","action":"换一把旧积木","text":"回家以后，你用一只空盒拼出了一座站台","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-3-2","action":"留作车钱","text":"下了一场阵雨，你坐车回家时鞋还是干的","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-3-0","action":"换一把旧积木","text":"回家以后，你用一只空盒拼出了一座站台","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-3-2","action":"留作车钱","text":"下了一场阵雨，你坐车回家时鞋还是干的","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-3","interactionId":"life-3","sceneId":"school-shop","choiceId":"life-3-2","balances":{"yuanA":0,"yuanB":0,"blocks":0,"ice":0,"purse":2},"observed":[],"performed":["leave-shop"]},"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-3-1","action":"请同学吃冰棍","text":"那个人把木棍洗干净，说想做书签","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-3","interactionId":"shop","sceneId":"school-shop","choiceId":"life-3-1","balances":{"yuanA":0,"yuanB":0,"blocks":0,"ice":1,"purse":1},"observed":[],"performed":["yuanA-ice"]},"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-3-0","action":"换一把旧积木","text":"回家以后，你用一只空盒拼出了一座站台","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-3","interactionId":"shop","sceneId":"school-shop","choiceId":"life-3-0","balances":{"yuanA":0,"yuanB":0,"blocks":2,"ice":0,"purse":0},"observed":[],"performed":["yuanA-blocks","yuanB-blocks"]},"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-3-2","action":"留作车钱","text":"下了一场阵雨，你坐车回家时鞋还是干的","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-3","interactionId":"shop","sceneId":"school-shop","choiceId":"life-3-2","balances":{"yuanA":0,"yuanB":0,"blocks":0,"ice":0,"purse":2},"observed":[],"performed":["leave-shop"]},"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-3-1","action":"请同学吃冰棍","text":"那个人把木棍洗干净，说想做书签","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-3-2","action":"留作车钱","text":"下了一场阵雨，你坐车回家时鞋还是干的","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-3-0","action":"换一把旧积木","text":"回家以后，你用一只空盒拼出了一座站台","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-4 · 4 / 12岁 · S · 公共兜底
- 声明 life-4-0：{"charm":4,"skill":2,"mood":3} 
- 声明 life-4-1：{"family":5,"mood":2} 
- 声明 life-4-2：{"social":4,"network":3,"mood":2} 
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-4-0","action":"讲纸飞机落到哪儿了","text":"大家笑起来，有人问你纸飞机怎么折","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-4-2","action":"给没赶回来的人留一份","text":"你把碗倒扣好，夹了一双干净筷子","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-4-0","action":"讲纸飞机落到哪儿了","text":"大家笑起来，有人问你纸飞机怎么折","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-4-keep-eating","action":"继续吃饭","text":"你吃完碗里的饭，鱼还留在原来的盘里。","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"life-4","sceneId":"family-dinner","choiceId":"life-4-keep-eating","balances":{"fish":1,"reserve-bowl":0,"own-bowl":0},"observed":[],"performed":["keep-eating"],"variant":"last-fish","npcId":null,"steps":[],"decisionId":"keep-eating","recipientId":null,"tags":["last-fish","fish-left-on-plate"],"outcome":"你吃完碗里的饭，鱼还留在原来的盘里。"},"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-4-0","action":"讲纸飞机落到哪儿了","text":"大家笑起来，有人问你纸飞机怎么折","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-story","action":"讲一段真实往事","text":"家人放下筷子：“最近放学，有什么好玩的事吗？” 家人说：“我还记得那颗螺丝，还是你亲手拧紧的。” 家人说：“吃完还把木棍收起来做书签，阿宁挺会想的。”","delta":{"social":2},"from":[2,3],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-story","balances":{"beats":1,"parent":2,"fish":0,"rice":0},"observed":["parent"],"performed":["listen","story-2","story-3","finish"],"npcId":"parent","steps":[{"actionId":"listen","label":"听家人说话","feedback":"家人放下筷子：“最近放学，有什么好玩的事吗？”"},{"actionId":"story-2","label":"和家人修台灯","feedback":"家人说：“我还记得那颗螺丝，还是你亲手拧紧的。”","sourceSlot":2,"witnessed":true},{"actionId":"story-3","label":"请阿宁吃冰棍","feedback":"家人说：“吃完还把木棍收起来做书签，阿宁挺会想的。”","sourceSlot":3,"witnessed":false}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-turn","action":"给家人转一道菜","text":"转盘慢了下来，家人伸手接过那盘鱼。","delta":{"family":2},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-turn","balances":{"beats":2,"parent":0,"fish":1,"rice":0},"observed":[],"performed":["turn","finish"],"npcId":"parent","steps":[{"actionId":"turn","label":"转菜","feedback":"转盘慢了下来，家人伸手接过那盘鱼。"}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-1","action":"先把饭盛给家人","text":"热饭端上来以后，话题慢了下来","delta":{"mood":2,"family":5},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-1","balances":{"beats":2,"parent":0,"fish":0,"rice":1},"observed":[],"performed":["serve","finish"],"npcId":"parent","steps":[{"actionId":"serve","label":"盛饭","feedback":"热饭端上来以后，话题慢了下来"}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-humor","action":"开个玩笑","text":"家人放下筷子：“最近放学，有什么好玩的事吗？” 你说这条鱼转了三圈，比自己跑步还勤快。桌边有人笑出了声。","delta":{"mood":2},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-humor","balances":{"beats":2,"parent":1,"fish":0,"rice":0},"observed":["parent"],"performed":["listen","humor","finish"],"npcId":"parent","steps":[{"actionId":"listen","label":"听家人说话","feedback":"家人放下筷子：“最近放学，有什么好玩的事吗？”"},{"actionId":"humor","label":"开个玩笑","feedback":"你说这条鱼转了三圈，比自己跑步还勤快。桌边有人笑出了声。"}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-ask","action":"问家人小时候的事","text":"家人放下筷子：“最近放学，有什么好玩的事吗？” 家人讲起从前放学总绕去看河里的小鱼。","delta":{"family":1},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-ask","balances":{"beats":2,"parent":1,"fish":0,"rice":0},"observed":["parent"],"performed":["listen","ask","finish"],"npcId":"parent","steps":[{"actionId":"listen","label":"听家人说话","feedback":"家人放下筷子：“最近放学，有什么好玩的事吗？”"},{"actionId":"ask","label":"问家人小时候的事","feedback":"家人讲起从前放学总绕去看河里的小鱼。"}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-reply","action":"接一句近况","text":"家人放下筷子：“最近放学，有什么好玩的事吗？” 你说最近放学路上挺热闹，家人笑着点了点头。","delta":{"social":1},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-reply","balances":{"beats":2,"parent":1,"fish":0,"rice":0},"observed":["parent"],"performed":["listen","reply","finish"],"npcId":"parent","steps":[{"actionId":"listen","label":"听家人说话","feedback":"家人放下筷子：“最近放学，有什么好玩的事吗？”"},{"actionId":"reply","label":"接一句近况","feedback":"你说最近放学路上挺热闹，家人笑着点了点头。"}]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-quiet","action":"安静吃完这顿饭","text":"你慢慢吃完碗里的饭，碗筷声也渐渐轻了。","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"dinner","sceneId":"family-dinner","choiceId":"life-4-quiet","balances":{"beats":3,"parent":0,"fish":0,"rice":0},"observed":[],"performed":["finish"],"npcId":"parent","steps":[]},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-4-2","action":"给没赶回来的人留一份","text":"你把碗倒扣好，夹了一双干净筷子","delta":{"social":4,"mood":3,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-4-save-fish","action":"给晚归的家人留鱼","text":"家人把空碗往里挪了挪：“行，我盖上。明早还能配粥。”","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"fish-test","sceneId":"family-dinner","choiceId":"life-4-save-fish","balances":{"fish":0,"reserve-bowl":1,"own-bowl":0},"observed":["fish"],"performed":["select-fish","save-fish"],"variant":"last-fish","npcId":"parent","steps":[],"decisionId":"save-fish","recipientId":"dinner-late-family","tags":["last-fish","fish-saved-for-family"],"outcome":"家人把空碗往里挪了挪：“行，我盖上。明早还能配粥。”"},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-4-eat-fish","action":"夹走最后一块鱼","text":"家人递来一双筷子：“趁热吃。他说在外面吃过了，不用等。”","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"fish-test","sceneId":"family-dinner","choiceId":"life-4-eat-fish","balances":{"fish":0,"reserve-bowl":0,"own-bowl":1},"observed":["fish"],"performed":["select-fish","eat-fish"],"variant":"last-fish","npcId":"parent","steps":[],"decisionId":"eat-fish","recipientId":null,"tags":["last-fish","last-fish-eaten"],"outcome":"家人递来一双筷子：“趁热吃。他说在外面吃过了，不用等。”"},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-4-keep-eating","action":"继续吃饭","text":"你继续吃碗里的饭。家人见鱼还在，顺手拿小碟盖上。","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"fish-test","sceneId":"family-dinner","choiceId":"life-4-keep-eating","balances":{"fish":1,"reserve-bowl":0,"own-bowl":0},"observed":[],"performed":["keep-eating"],"variant":"last-fish","npcId":"parent","steps":[],"decisionId":"keep-eating","recipientId":null,"tags":["last-fish","fish-left-on-plate"],"outcome":"你继续吃碗里的饭。家人见鱼还在，顺手拿小碟盖上。"},"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner-fish.cjs，seed 1：{"choice":"life-4-save-fish","action":"把鱼留到下顿","text":"外婆说：“我吃饱了。你要吃就趁热，吃不下就搁小碗里，明早配粥。” 外婆找来一个小碟盖上：“明天配粥正好。”","delta":{},"from":[],"opportunity":[],"echo":[],"interaction":{"eventId":"life-4","interactionId":"fish-test","sceneId":"family-dinner","choiceId":"life-4-save-fish","balances":{"fish":0,"reserve-bowl":1,"own-bowl":0},"observed":["parent"],"performed":["ask-family","save-fish"],"variant":"last-fish","npcId":"parent","steps":[{"actionId":"ask-family","label":"问问外婆","feedback":"外婆说：“我吃饱了。你要吃就趁热，吃不下就搁小碗里，明早配粥。”"}],"decisionId":"save-fish","recipientId":null,"tags":["last-fish","fish-saved-for-later"],"outcome":"外婆找来一个小碟盖上：“明天配粥正好。”"},"items":[],"people":["parent"],"job":null,"highlights":[]}

## life-5 · 5 / 13岁 · B · 公共兜底
- 声明 life-5-0：{"body":4,"health":2} 
- 声明 life-5-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-5-2：{"knowledge":5,"stress":4} 
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-5-0","action":"步行熟悉路线","text":"第三天，你找到一条有树荫的小路","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-5-2","action":"留在教室多读一会儿","text":"人少以后，才听清吊扇转起来的声音","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-5-0","action":"步行熟悉路线","text":"第三天，你找到一条有树荫的小路","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-5-1","action":"跟阿宁一起坐车","text":"等车时，你们约好互相借课堂笔记","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-5-0","action":"步行熟悉路线","text":"第三天，你找到一条有树荫的小路","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-5-0","action":"步行熟悉路线","text":"第三天，你找到一条有树荫的小路","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-5-0","action":"步行熟悉路线","text":"第三天，你找到一条有树荫的小路","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-6 · 6 / 13岁 · S · 公共兜底
- 声明 life-6-0：{"skill":5,"stress":3} 
- 声明 life-6-1：{"social":4,"network":3,"mood":2} 
- 声明 life-6-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-6-1
- tests/acceptance.cjs，seed 1：{"choice":"life-6-0","action":"去补网","text":"你很快认出包装袋上那种结","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-6-2","action":"照常午休","text":"下午的课上，你第一次没有打瞌睡","delta":{"mind":4,"stress":-5,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-6-0","action":"去补网","text":"你很快认出包装袋上那种结","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-6-yoyo","action":"带上悠悠球去练一轮","text":"你带上八岁时买的悠悠球。你们轮流试对方的花式，收线失败了就换个人示范。","delta":{},"from":[2],"opportunity":[],"echo":[],"gift":{"sourceSlot":2,"branch":"buy","status":"taken","spent":0,"balance":0},"items":["yoyo"],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-6-shuttlecocks","action":"用留下的十元买球去打双打","text":"你回家从小盒子里取出十元，在文具店买了两个羽毛球。隔天借到球拍，你们两两搭档打完了一局。","delta":{},"from":[2],"opportunity":[],"echo":[],"gift":{"sourceSlot":2,"branch":"keep","status":"taken","spent":10,"balance":0},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"life-6-2","action":"照常午休","text":"下午的课上，你第一次没有打瞌睡","delta":{"mind":4,"stress":-6,"mood":4},"from":[2],"opportunity":[],"echo":[],"gift":{"sourceSlot":2,"branch":"buy","status":"passed","spent":0,"balance":0},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"life-6-2","action":"照常午休","text":"下午的课上，你第一次没有打瞌睡","delta":{"mind":4,"stress":-6,"mood":4},"from":[2],"opportunity":[],"echo":[],"gift":{"sourceSlot":2,"branch":"keep","status":"passed","spent":0,"balance":10},"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"life-6-0","action":"去补网","text":"你很快认出包装袋上那种结","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-6-0","action":"去补网","text":"你很快认出包装袋上那种结","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-6-0","action":"去补网","text":"你很快认出包装袋上那种结","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-7 · 7 / 14岁 · A · 公共兜底
- 声明 life-7-0：{"knowledge":5,"stress":4} gain:notes, thread:school, exp:practice
- 声明 life-7-1：{"social":4,"network":3,"mood":2} gain:notes, thread:school, exp:practice, meet:friend
- 声明 life-7-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-7-1
- tests/acceptance.cjs，seed 1：{"choice":"life-7-0","action":"做一本错题册","text":"你先把反复错的类型圈成了三组","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":["notes"],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-7-2","action":"先把小题写稳","text":"一周以后，留给最后一题的时间多了五分钟","delta":{"mind":4,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-7-0","action":"做一本错题册","text":"你先把反复错的类型圈成了三组","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":["notes"],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-7-0","action":"做一本错题册","text":"你先把反复错的类型圈成了三组","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":["notes"],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-7-0","action":"做一本错题册","text":"你先把反复错的类型圈成了三组","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":["notes"],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-7-0","action":"做一本错题册","text":"你先把反复错的类型圈成了三组","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":["notes"],"people":[],"job":null,"highlights":[]}

## life-8 · 8 / 14岁 · B · 公共兜底
- 声明 life-8-0：{"charm":4,"skill":2,"mood":3} 
- 声明 life-8-1：{"skill":5,"stress":3} 
- 声明 life-8-2：{"social":4,"network":3,"mood":2} meet:friend
未采到正式提交的基础选项：life-8-1
- tests/acceptance.cjs，seed 1：{"choice":"life-8-2","action":"留下帮忙撑伞","text":"鞋湿了一半，今天却多了个一起回家的人","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-8-0","action":"给下课铃配一段提示","text":"走廊里有人跟着节奏慢下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## school-prep · 8 / 14岁 · A · rule(school)
- 声明 school-prep-0：{"knowledge":5,"stress":4} thread:school, exp:practice
- 声明 school-prep-1：{"social":4,"network":3,"mood":2} meet:friend, exp:practice
- 声明 school-prep-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：school-prep-1、school-prep-2
- tests/acceptance.cjs，seed 1：{"choice":"school-prep-0","action":"试着在白天做完","text":"你记下三处需要问老师的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-prep-0","action":"试着在白天做完","text":"你记下三处需要问老师的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-prep-0","action":"试着在白天做完","text":"你记下三处需要问老师的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"school-prep-0","action":"试着在白天做完","text":"你记下三处需要问老师的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"school-prep-0","action":"试着在白天做完","text":"你记下三处需要问老师的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-9 · 9 / 15岁 · A · 公共兜底
- 声明 life-9-0：{"knowledge":5,"stress":4} thread:school, direction:学术
- 声明 life-9-1：{"skill":5,"stress":3} direction:手艺
- 声明 life-9-2：{"family":5,"mood":2} 
未采到正式提交的基础选项：life-9-1
- tests/acceptance.cjs，seed 1：{"choice":"life-9-0","action":"选远一点的学校","text":"你答应每天到家报一声平安","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-9-2","action":"选能走回家的学校","text":"你留下了放学后帮家里的时间","delta":{"mood":2,"family":8,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-9-0","action":"选远一点的学校","text":"你答应每天到家报一声平安","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-9-0","action":"选远一点的学校","text":"你答应每天到家报一声平安","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-9-0","action":"选远一点的学校","text":"你答应每天到家报一声平安","delta":{"knowledge":5,"stress":4,"family":1,"expect":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-9-0","action":"选远一点的学校","text":"你答应每天到家报一声平安","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}

## life-10 · 10 / 15岁 · B · 公共兜底
- 声明 life-10-0：{"charm":4,"skill":2,"mood":3} direction:文艺
- 声明 life-10-1：{"skill":5,"stress":3} thread:indie, exp:teamwork, meet:friend
- 声明 life-10-2：{"body":4,"health":2} 
未采到正式提交的基础选项：life-10-1
- tests/acceptance.cjs，seed 1：{"choice":"life-10-0","action":"试一段原创节目","text":"你把算错拍子的那一段保留了下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-10-2","action":"去跑操场","text":"你第一次把最后一圈跑得和第一圈一样快","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-10-0","action":"试一段原创节目","text":"你把算错拍子的那一段保留了下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-10-0","action":"试一段原创节目","text":"你把算错拍子的那一段保留了下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-10-0","action":"试一段原创节目","text":"你把算错拍子的那一段保留了下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-10-0","action":"试一段原创节目","text":"你把算错拍子的那一段保留了下来","delta":{"skill":2,"charm":4,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-11 · 11 / 16岁 · A · 公共兜底
- 声明 life-11-0：{"body":4,"health":2} gain:console, thread:esport, meet:friend, wish:rank
- 声明 life-11-1：{"skill":5,"stress":3} gain:console, thread:indie, exp:teamwork, meet:friend, wish:make
- 声明 life-11-2：{"knowledge":5,"stress":4} thread:school
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-11-2","action":"把游戏机还回去","text":"你把周末留给复习，阿宁收好机器","delta":{"knowledge":5,"stress":1,"mood":1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-11-1","action":"记下想做的玩法","text":"你留下游戏机，画出自己想加的一关","delta":{"skill":5,"mood":1},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-11-0","action":"修好，试着报名参赛","text":"你们约了第一周的练习时间","delta":{"body":4,"stress":-3,"mood":1,"health":2},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-11-2","action":"把游戏机还回去","text":"你把周末留给复习，阿宁收好机器","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-11-0","action":"修好，试着报名参赛","text":"你们约了第一周的练习时间","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-11-1","action":"记下想做的玩法","text":"你留下游戏机，画出自己想加的一关","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-11-2","action":"把游戏机还回去","text":"你把周末留给复习，阿宁收好机器","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-11-0","action":"修好，试着报名参赛","text":"你们约了第一周的练习时间","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-11-0","action":"修好，试着报名参赛","text":"你们约了第一周的练习时间","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":["console"],"people":["friend"],"job":null,"highlights":[]}

## life-12 · 12 / 17岁 · B · 公共兜底
- 声明 life-12-0：{"knowledge":5,"stress":4} thread:school, exp:practice
- 声明 life-12-1：{"body":4,"health":2} 
- 声明 life-12-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-12-1、life-12-2
- tests/shop.cjs，seed 1：{"choice":"life-12-0","action":"跟同学过一道难题","text":"讲到第三遍，两个人都明白了","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## school-sprint · 12 / 17岁 · A · rule(school)
- 声明 school-sprint-0：{"knowledge":5,"stress":4} thread:school
- 声明 school-sprint-1：{"knowledge":5,"stress":4} thread:school, exp:practice
- 声明 school-sprint-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：school-sprint-1
- tests/acceptance.cjs，seed 1：{"choice":"school-sprint-0","action":"重点补弱项","text":"你划掉一些熟悉的练习，把时间留给没学懂的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"school-sprint-2","action":"把两晚睡足","text":"读完题目再下笔的时间，比上次多了","delta":{"mind":4,"stress":-1,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-sprint-0","action":"重点补弱项","text":"你划掉一些熟悉的练习，把时间留给没学懂的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-sprint-0","action":"重点补弱项","text":"你划掉一些熟悉的练习，把时间留给没学懂的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"school-sprint-0","action":"重点补弱项","text":"你划掉一些熟悉的练习，把时间留给没学懂的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"school-sprint-0","action":"重点补弱项","text":"你划掉一些熟悉的练习，把时间留给没学懂的地方","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-13 · 13 / 18岁 · A · 公共兜底
- 声明 life-13-0：{"knowledge":5,"stress":4} thread:school
- 声明 life-13-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-13-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-13-1、life-13-2
- tests/shop.cjs，seed 1：{"choice":"life-13-0","action":"温一下最弱的科目","text":"你在候场的时候把难题的第一步捋顺了","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## school-exam · 13 / 18岁 · A · rule(school)
- 声明 school-exam-0：{"knowledge":5,"stress":4} thread:school
- 声明 school-exam-1：{"mind":4,"stress":-6,"mood":4} 
- 声明 school-exam-2：{"skill":5,"stress":3} exp:practice
未采到正式提交的基础选项：school-exam-1
- tests/acceptance.cjs，seed 1：{"choice":"school-exam-0","action":"先过自己熟的部分","text":"你做完以后认真回头看了未答完的题","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"school-exam-2","action":"把想起的解法写下来","text":"一些步骤后来被你用在了别的题上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-exam-0","action":"先过自己熟的部分","text":"你做完以后认真回头看了未答完的题","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-exam-0","action":"先过自己熟的部分","text":"你做完以后认真回头看了未答完的题","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"school-exam-0","action":"先过自己熟的部分","text":"你做完以后认真回头看了未答完的题","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"school-exam-0","action":"先过自己熟的部分","text":"你做完以后认真回头看了未答完的题","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-14 · 14 / 18岁 · S · 公共兜底
- 声明 life-14-0：{"knowledge":5,"stress":4} admit:reach, wish:admit, direction:学术
- 声明 life-14-1：{"knowledge":5,"stress":4} admit:steady
- 声明 life-14-2：{"skill":5,"stress":3} admit:trade, direction:手艺
未采到正式提交的基础选项：life-14-2
- tests/acceptance.cjs，seed 1：{"choice":"life-14-1","action":"填更稳的专业","text":"你按专业内容和能承担的学费排好顺序 录取结果出来了，接下来就是新的生活。","delta":{"knowledge":5,"stress":1,"mood":1,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-14-0","action":"冲自己准备过的学校","text":"你把这一所写在第一行，也填好了备选 录取页面更新了。那所填在第一行的学校递来了录取消息。","delta":{"knowledge":5,"stress":1,"mood":1,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":["school"]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-14-1","action":"填更稳的专业","text":"你按专业内容和能承担的学费排好顺序 录取结果出来了，接下来就是新的生活。","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-14-0","action":"冲自己准备过的学校","text":"你把这一所写在第一行，也填好了备选 录取页面更新了。那所填在第一行的学校递来了录取消息。","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":["school"]}
- tests/gift.cjs，seed 1：{"choice":"life-14-1","action":"填更稳的专业","text":"你按专业内容和能承担的学费排好顺序 录取结果出来了，接下来就是新的生活。","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-14-0","action":"冲自己准备过的学校","text":"你把这一所写在第一行，也填好了备选 录取页面更新了。那所填在第一行的学校递来了录取消息。","delta":{"knowledge":5,"stress":4,"family":1,"expect":3},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":["school"]}
- tests/dinner.cjs，seed 9：{"choice":"life-14-1","action":"填更稳的专业","text":"你按专业内容和能承担的学费排好顺序 录取结果出来了，接下来就是新的生活。","delta":{"knowledge":5,"stress":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":["letter"],"people":["parent"],"job":null,"highlights":[]}

## life-15 · 15 / 18岁 · B · 公共兜底
- 声明 life-15-0：{"social":4,"network":3,"mood":2} 
- 声明 life-15-1：{"skill":5,"stress":3} 
- 声明 life-15-2：{"family":5,"mood":2} meet:parent
未采到正式提交的基础选项：life-15-1、life-15-2
- tests/acceptance.cjs，seed 1：{"choice":"life-15-0","action":"约定轮流使用","text":"你们把各自的时间写在一张班表上","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-15-0","action":"约定轮流使用","text":"你们把各自的时间写在一张班表上","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-15-0","action":"约定轮流使用","text":"你们把各自的时间写在一张班表上","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-15-0","action":"约定轮流使用","text":"你们把各自的时间写在一张班表上","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-15-0","action":"约定轮流使用","text":"你们把各自的时间写在一张班表上","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## school-result · 15 / 18岁 · S · rule(school)
- 声明 school-result-0：{"family":5,"mood":2} meet:parent
- 声明 school-result-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 school-result-2：{"knowledge":5,"stress":4} 
未采到正式提交的基础选项：school-result-1、school-result-2
- tests/acceptance.cjs，seed 1：{"choice":"school-result-0","action":"把消息讲给家里听","text":"你也讲了填在它后面的两个备选","delta":{"mood":2,"family":5},"from":[14],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-result-0","action":"把消息讲给家里听","text":"你也讲了填在它后面的两个备选","delta":{"mood":2,"family":5},"from":[14],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"school-result-0","action":"把消息讲给家里听","text":"你也讲了填在它后面的两个备选","delta":{"mood":2,"family":5},"from":[14],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}

## life-16 · 16 / 19岁 · A · 公共兜底
- 声明 life-16-0：{"body":4,"health":2} thread:esport, meet:coach
- 声明 life-16-1：{"skill":5,"stress":3} thread:indie, exp:teamwork, wish:make
- 声明 life-16-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-16-1
- tests/acceptance.cjs，seed 1：{"choice":"life-16-0","action":"去试训","text":"你留下联系方式和一段比赛录像","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-16-2","action":"把两个晚上还给自己","text":"你把没睡够的几个早上补回来","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-16-0","action":"去试训","text":"你留下联系方式和一段比赛录像","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-16-0","action":"去试训","text":"你留下联系方式和一段比赛录像","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-16-0","action":"去试训","text":"你留下联系方式和一段比赛录像","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}

## arena-club · 16 / 19岁 · A · rule(esport)
- 声明 arena-club-0：{"body":4,"health":2} thread:esport, meet:coach
- 声明 arena-club-1：{"skill":5,"stress":3} thread:esport
- 声明 arena-club-2：{"mind":4,"stress":-6,"mood":4} pause:esport
未采到正式提交的基础选项：arena-club-1
- tests/acceptance.cjs，seed 1：{"choice":"arena-club-0","action":"按场次练配合","text":"教练记下你愿意补上的位置","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"arena-club-2","action":"保留为课余兴趣","text":"周四晚上仍有空和同学打一场","delta":{"mind":4,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-club-0","action":"按场次练配合","text":"教练记下你愿意补上的位置","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-club-0","action":"按场次练配合","text":"教练记下你愿意补上的位置","delta":{"body":4,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":null,"highlights":[]}

## life-17 · 17 / 19岁 · B · 公共兜底
- 声明 life-17-0：{"skill":5,"stress":3} thread:indie
- 声明 life-17-1：{"social":4,"network":3,"mood":2} gain:photo, meet:friend
- 声明 life-17-2：{"family":5,"mood":2} meet:parent
未采到正式提交的基础选项：life-17-1
- tests/acceptance.cjs，seed 1：{"choice":"life-17-0","action":"继续改程序","text":"明早才能试，你先把问题逐条写在纸上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-17-2","action":"听家里一段语音","text":"你一边听一边把电话下次要说的事记下","delta":{"mood":2,"family":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-17-0","action":"继续改程序","text":"明早才能试，你先把问题逐条写在纸上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-17-0","action":"继续改程序","text":"明早才能试，你先把问题逐条写在纸上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-17-0","action":"继续改程序","text":"明早才能试，你先把问题逐条写在纸上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-17-0","action":"继续改程序","text":"明早才能试，你先把问题逐条写在纸上","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-18 · 18 / 20岁 · A · 公共兜底
- 声明 life-18-0：{"skill":5,"stress":3} exp:workshop
- 声明 life-18-1：{"money":900,"stress":6} 
- 声明 life-18-2：{"social":4,"network":3,"mood":2} exp:safety
未采到正式提交的基础选项：life-18-1、life-18-2
- tests/acceptance.cjs，seed 1：{"choice":"life-18-0","action":"去学校机房","text":"你学会把故障整理成别人看得懂的步骤","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-18-0","action":"去学校机房","text":"你学会把故障整理成别人看得懂的步骤","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-18-0","action":"去学校机房","text":"你学会把故障整理成别人看得懂的步骤","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-18-0","action":"去学校机房","text":"你学会把故障整理成别人看得懂的步骤","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-18-0","action":"去学校机房","text":"你学会把故障整理成别人看得懂的步骤","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-19 · 19 / 20岁 · A · 公共兜底
- 声明 life-19-0：{"skill":5,"stress":3} thread:indie, exp:teamwork
- 声明 life-19-1：{"money":900,"stress":6} 
- 声明 life-19-2：{"social":4,"network":3,"mood":2} meet:friend
未采到正式提交的基础选项：life-19-2
- tests/lifecycle.cjs，seed 1：{"choice":"life-19-1","action":"接一份临时活","text":"你第一次用自己挣的钱换了把椅子","delta":{"money":900,"stress":6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-19-0","action":"参加联合调试","text":"反馈最后一条说，希望下个版本还能玩","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## indie-kit · 19 / 20岁 · A · rule(indie)
- 声明 indie-kit-0：{"skill":5,"stress":3} gain:prototype, thread:indie, exp:teamwork, meet:friend
- 声明 indie-kit-1：{"social":4,"network":3,"mood":2} gain:prototype, meet:friend
- 声明 indie-kit-2：{"mind":4,"stress":-6,"mood":4} pause:indie
未采到正式提交的基础选项：indie-kit-1、indie-kit-2
- tests/acceptance.cjs，seed 1：{"choice":"indie-kit-0","action":"把第一关做完整","text":"阿宁把收来的意见写在名字旁边","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["prototype"],"people":["friend"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-kit-0","action":"把第一关做完整","text":"阿宁把收来的意见写在名字旁边","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["prototype"],"people":["friend"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-kit-0","action":"把第一关做完整","text":"阿宁把收来的意见写在名字旁边","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["prototype"],"people":["friend"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-kit-0","action":"把第一关做完整","text":"阿宁把收来的意见写在名字旁边","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["prototype"],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"indie-kit-0","action":"把第一关做完整","text":"阿宁把收来的意见写在名字旁边","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["prototype"],"people":["friend"],"job":null,"highlights":[]}

## life-20 · 20 / 21岁 · A · 公共兜底
- 声明 life-20-0：{"skill":5,"stress":3} exp:workshop
- 声明 life-20-1：{"charm":4,"skill":2,"mood":3} thread:indie
- 声明 life-20-2：{"body":4,"health":2} exp:safety
未采到正式提交的基础选项：life-20-1、life-20-2
- tests/shop.cjs，seed 1：{"choice":"life-20-0","action":"练习交接技能","text":"你试着把一项临时任务讲给没做过的人","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## school-degree · 20 / 21岁 · A · rule(school)
- 声明 school-degree-0：{"skill":5,"stress":3} thread:indie, exp:teamwork
- 声明 school-degree-1：{"knowledge":5,"stress":4} exp:workshop
- 声明 school-degree-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：school-degree-2
- tests/acceptance.cjs，seed 1：{"choice":"school-degree-0","action":"约人做一个小项目","text":"第一次停机时，搭档帮你把坏掉的部分写成清单","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-degree-1","action":"去看一份真实的工作","text":"你看见专业之外真正要学的几件事","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"school-degree-0","action":"约人做一个小项目","text":"第一次停机时，搭档帮你把坏掉的部分写成清单","delta":{"skill":4,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"school-degree-0","action":"约人做一个小项目","text":"第一次停机时，搭档帮你把坏掉的部分写成清单","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"school-degree-0","action":"约人做一个小项目","text":"第一次停机时，搭档帮你把坏掉的部分写成清单","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"school-degree-0","action":"约人做一个小项目","text":"第一次停机时，搭档帮你把坏掉的部分写成清单","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-21 · 21 / 22岁 · A · 公共兜底
- 声明 life-21-0：{"knowledge":5,"stress":4} route:office
- 声明 life-21-1：{"skill":5,"stress":3} route:factory
- 声明 life-21-2：{"body":4,"health":2} route:delivery
未采到正式提交的基础选项：life-21-2
- tests/acceptance.cjs，seed 1：{"choice":"life-21-0","action":"找办公室岗位","text":"招聘会结束前，你记下了两种不同的班次","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-21-1","action":"去看制造班组","text":"机床旁的人指给你看新手先从哪里学","delta":{"skill":4,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-21-0","action":"找办公室岗位","text":"招聘会结束前，你记下了两种不同的班次","delta":{"knowledge":4,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-21-0","action":"找办公室岗位","text":"招聘会结束前，你记下了两种不同的班次","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-21-0","action":"找办公室岗位","text":"招聘会结束前，你记下了两种不同的班次","delta":{"knowledge":4,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-21-0","action":"找办公室岗位","text":"招聘会结束前，你记下了两种不同的班次","delta":{"knowledge":5,"stress":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}

## life-22 · 22 / 22岁 · B · 公共兜底
- 声明 life-22-0：{"social":4,"network":3,"mood":2} meet:friend, gain:photo, gain:yearbook
- 声明 life-22-1：{"skill":5,"stress":3} thread:indie, gain:prototype
- 声明 life-22-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-22-1
- tests/acceptance.cjs，seed 1：{"choice":"life-22-0","action":"给阿宁留新地址","text":"阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":["photo","yearbook"],"people":["friend"],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-22-2","action":"告别后慢慢回家","text":"你坐了最慢的一趟车，打算看看中间的站","delta":{"mind":3,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":null,"highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-22-0","action":"给阿宁留新地址","text":"阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":["photo","yearbook"],"people":["friend"],"job":null,"highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-22-0","action":"给阿宁留新地址","text":"阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包","delta":{"social":4,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":["photo","yearbook"],"people":["friend"],"job":null,"highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-22-0","action":"给阿宁留新地址","text":"阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":["photo","yearbook"],"people":["friend"],"job":null,"highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-22-0","action":"给阿宁留新地址","text":"阿宁在地址边画了半只猫，你添上另一只耳朵。你把留言册和合照收进书包","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":["photo","yearbook"],"people":["friend"],"job":null,"highlights":[]}

## life-23 · 23 / 23岁 · S · 公共兜底
- 声明 life-23-0：{"knowledge":5,"stress":4} job:office, gain:badge, meet:colleague
- 声明 life-23-1：{"skill":5,"stress":3} job:factory, gain:tools, meet:colleague
- 声明 life-23-2：{"body":4,"health":2} job:delivery, gain:gloves, meet:colleague
- 声明 life-23-3：{"social":4,"network":3,"mood":2} job:sanitation, gain:map, meet:colleague
未采到正式提交的基础选项：无
- tests/acceptance.cjs，seed 1：{"choice":"life-23-0","action":"进办公室","text":"小周先教你把常用文件分到两个文件夹 毕业前问过的安排这时用上了，入职的第一周从容一些。","delta":{"knowledge":4,"money":300,"stress":-3,"mood":1},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"派上用场","detail":"提前看过排班和岗位，会少一些入职压力。"}],"echo":[],"items":["badge"],"people":["colleague"],"job":"office","highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-23-1","action":"进制造班组","text":"你跟着同事认清了交接时要问的三件事","delta":{"skill":4,"money":300,"stress":-1,"mood":1},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":["tools"],"people":["colleague"],"job":"factory","highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-23-2","action":"入职配送站","text":"小周带你认了第一个危险的路口","delta":{"body":3,"money":300,"stress":-4,"mood":1,"health":2},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":["gloves"],"people":["colleague"],"job":"delivery","highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"life-23-3","action":"加入环卫班组","text":"你沿着还未开门的店铺走完第一趟","delta":{"social":3,"money":300,"stress":-4,"mood":3,"network":3},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":["map"],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-23-1","action":"进制造班组","text":"你跟着同事认清了交接时要问的三件事 毕业前问过的安排这时用上了，入职的第一周从容一些。","delta":{"skill":5,"money":300,"stress":-1},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"派上用场","detail":"提前看过排班和岗位，会少一些入职压力。"}],"echo":[],"items":["tools"],"people":["colleague"],"job":"factory","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-23-3","action":"加入环卫班组","text":"你沿着还未开门的店铺走完第一趟","delta":{"social":4,"money":300,"stress":-1,"mood":2,"network":3},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":["map"],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-23-0","action":"进办公室","text":"小周先教你把常用文件分到两个文件夹 毕业前问过的安排这时用上了，入职的第一周从容一些。","delta":{"knowledge":4,"money":300},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"派上用场","detail":"提前看过排班和岗位，会少一些入职压力。"}],"echo":[],"items":["badge"],"people":["colleague"],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-23-0","action":"进办公室","text":"小周先教你把常用文件分到两个文件夹 毕业前问过的安排这时用上了，入职的第一周从容一些。","delta":{"knowledge":5,"money":300},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"派上用场","detail":"提前看过排班和岗位，会少一些入职压力。"}],"echo":[],"items":["badge"],"people":["colleague"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-23-0","action":"进办公室","text":"小周先教你把常用文件分到两个文件夹 毕业前问过的安排这时用上了，入职的第一周从容一些。","delta":{"knowledge":4,"money":300},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"派上用场","detail":"提前看过排班和岗位，会少一些入职压力。"}],"echo":[],"items":["badge"],"people":["colleague"],"job":"office","highlights":[]}

## arena-offer · 23 / 23岁 · A · rule(esport)
- 声明 arena-offer-0：{"body":4,"health":2} job:player, meet:coach, thread:esport
- 声明 arena-offer-1：{"knowledge":5,"stress":4} job:office, meet:colleague, gain:badge
- 声明 arena-offer-2：{"skill":5,"stress":3} job:factory, meet:colleague, gain:tools
- 声明 arena-offer-3：{"body":4,"health":2} job:delivery, meet:colleague, gain:gloves
- 声明 arena-offer-4：{"social":4,"network":3,"mood":2} job:sanitation, meet:colleague, gain:map
未采到正式提交的基础选项：arena-offer-1、arena-offer-2、arena-offer-3、arena-offer-4
- tests/acceptance.cjs，seed 1：{"choice":"arena-offer-0","action":"签短期战队协议","text":"陈姐在合同边写下了休息和试用期","delta":{"body":4,"money":300,"stress":-4,"mood":1,"health":2},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-offer-0","action":"签短期战队协议","text":"陈姐在合同边写下了休息和试用期","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-offer-0","action":"签短期战队协议","text":"陈姐在合同边写下了休息和试用期","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[21],"opportunity":[{"title":"毕业前的准备","status":"选择了另一条路","detail":"原来的走访留作参考，这次按新岗位的要求从头熟悉。"}],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}

## life-24 · 24 / 24岁 · A · 公共兜底
- 声明 life-24-0：{"money":900,"stress":6} wish:save
- 声明 life-24-1：{"family":5,"mood":2} meet:parent
- 声明 life-24-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-24-1、life-24-2
- tests/shop.cjs，seed 1：{"choice":"life-24-0","action":"留一笔应急钱","text":"你把第一笔钱单独记进账本","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## office-24 · 24 / 24岁 · A · 职业 office
- 声明 office-24-0：{"skill":5,"stress":3} gain:notebook, exp:workshop
- 声明 office-24-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 office-24-2：{"knowledge":5,"stress":4} 
未采到正式提交的基础选项：office-24-1、office-24-2
- tests/acceptance.cjs，seed 1：{"choice":"office-24-0","action":"查清退件原因","text":"下次你把例子贴在打印机上","delta":{"skill":5,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"office-24-0","action":"查清退件原因","text":"下次你把例子贴在打印机上","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"office-24-0","action":"查清退件原因","text":"下次你把例子贴在打印机上","delta":{"skill":5,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"office-24-0","action":"查清退件原因","text":"下次你把例子贴在打印机上","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"player","highlights":[]}

## factory-24 · 24 / 24岁 · A · 职业 factory
- 声明 factory-24-0：{"skill":5,"stress":3} exp:workshop, gain:tools
- 声明 factory-24-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 factory-24-2：{"knowledge":5,"stress":4} 
未采到正式提交的基础选项：factory-24-1、factory-24-2
- tests/acceptance.cjs，seed 1：{"choice":"factory-24-0","action":"一起对清工具清单","text":"晚上换班的人找到了缺的那一把","delta":{"skill":5,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"factory","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"factory-24-0","action":"一起对清工具清单","text":"晚上换班的人找到了缺的那一把","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["tools"],"people":[],"job":"player","highlights":[]}

## delivery-24 · 24 / 24岁 · A · 职业 delivery
- 声明 delivery-24-0：{"body":4,"health":2} gain:map, exp:safety, meet:colleague
- 声明 delivery-24-1：{"social":4,"network":3,"mood":2} 
- 声明 delivery-24-2：{"knowledge":5,"stress":4} 
未采到正式提交的基础选项：delivery-24-1、delivery-24-2
- tests/acceptance.cjs，seed 1：{"choice":"delivery-24-0","action":"记下安全路线","text":"你多走了四分钟，回来把坡度画在纸上","delta":{"body":4,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":["map"],"people":["colleague"],"job":"delivery","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"delivery-24-0","action":"记下安全路线","text":"你多走了四分钟，回来把坡度画在纸上","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":["map"],"people":["colleague"],"job":"player","highlights":[]}

## sanitation-24 · 24 / 24岁 · A · 职业 sanitation
- 声明 sanitation-24-0：{"body":4,"health":2} exp:safety, gain:map
- 声明 sanitation-24-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 sanitation-24-2：{"skill":5,"stress":3} exp:workshop
未采到正式提交的基础选项：sanitation-24-1、sanitation-24-2
- tests/acceptance.cjs，seed 1：{"choice":"sanitation-24-0","action":"雨后先看背街","text":"你把树根旁容易打滑的位置加进路线","delta":{"body":4,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"sanitation-24-0","action":"雨后先看背街","text":"你把树根旁容易打滑的位置加进路线","delta":{"body":4,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"sanitation-24-0","action":"雨后先看背街","text":"你把树根旁容易打滑的位置加进路线","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":["map"],"people":[],"job":"player","highlights":[]}

## arena-start · 24 / 24岁 · A · rule(esport-job)
- 声明 arena-start-0：{"social":4,"network":3,"mood":2} thread:esport, meet:coach
- 声明 arena-start-1：{"skill":5,"stress":3} thread:esport, gain:notebook
- 声明 arena-start-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：arena-start-1、arena-start-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-start-0","action":"向队友说明当时看见什么","text":"队友把另一个角度的录像同步过来","delta":{"social":4,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-start-0","action":"向队友说明当时看见什么","text":"队友把另一个角度的录像同步过来","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-start-0","action":"向队友说明当时看见什么","text":"队友把另一个角度的录像同步过来","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}

## life-25 · 25 / 25岁 · B · 公共兜底
- 声明 life-25-0：{"money":900,"stress":6} wish:save
- 声明 life-25-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 life-25-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-25-1、life-25-2
- tests/acceptance.cjs，seed 1：{"choice":"life-25-0","action":"还一笔小账","text":"关掉银行页面后，你终于记得买一双干袜子","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-25-0","action":"还一笔小账","text":"关掉银行页面后，你终于记得买一双干袜子","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-25-0","action":"还一笔小账","text":"关掉银行页面后，你终于记得买一双干袜子","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-25-0","action":"还一笔小账","text":"关掉银行页面后，你终于记得买一双干袜子","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-25-0","action":"还一笔小账","text":"关掉银行页面后，你终于记得买一双干袜子","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-26 · 26 / 25岁 · B · 公共兜底
- 声明 life-26-0：{"skill":5,"stress":3} 
- 声明 life-26-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-26-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-26-1、life-26-2
- tests/lifecycle.cjs，seed 1：{"choice":"life-26-0","action":"整理常用工具","text":"最常用的三件东西都摸得着了","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-26-0","action":"整理常用工具","text":"最常用的三件东西都摸得着了","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## indie-weekend · 26 / 25岁 · A · rule(indie)
- 声明 indie-weekend-0：{"skill":5,"stress":3} thread:indie, wish:make, meet:friend
- 声明 indie-weekend-1：{"knowledge":5,"stress":4} gain:notebook, thread:indie
- 声明 indie-weekend-2：{"mind":4,"stress":-6,"mood":4} pause:indie
未采到正式提交的基础选项：indie-weekend-1、indie-weekend-2
- tests/acceptance.cjs，seed 1：{"choice":"indie-weekend-0","action":"约两个短晚上","text":"你给现有版本留了一次真正的测试","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-weekend-0","action":"约两个短晚上","text":"你给现有版本留了一次真正的测试","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-weekend-0","action":"约两个短晚上","text":"你给现有版本留了一次真正的测试","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-weekend-0","action":"约两个短晚上","text":"你给现有版本留了一次真正的测试","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"indie-weekend-0","action":"约两个短晚上","text":"你给现有版本留了一次真正的测试","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"player","highlights":[]}

## life-27 · 27 / 26岁 · A · 公共兜底
- 声明 life-27-0：{"skill":5,"stress":3} gain:notebook, exp:workshop
- 声明 life-27-1：{"social":4,"network":3,"mood":2} exp:mentor, meet:colleague
- 声明 life-27-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-27-1、life-27-2
- tests/shop.cjs，seed 1：{"choice":"life-27-0","action":"记下工作的方法","text":"下次交接时你把重要的一栏画得更大","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"player","highlights":[]}

## office-27 · 27 / 26岁 · A · 职业 office
- 声明 office-27-0：{"skill":5,"stress":3} exp:workshop
- 声明 office-27-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 office-27-2：{"money":900,"stress":6} 
未采到正式提交的基础选项：office-27-1、office-27-2
- tests/acceptance.cjs，seed 1：{"choice":"office-27-0","action":"把重复步骤合在一起","text":"两位同事提前收工，你把方法记了下来","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"office-27-0","action":"把重复步骤合在一起","text":"两位同事提前收工，你把方法记了下来","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"office-27-0","action":"把重复步骤合在一起","text":"两位同事提前收工，你把方法记了下来","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"office-27-0","action":"把重复步骤合在一起","text":"两位同事提前收工，你把方法记了下来","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## factory-27 · 27 / 26岁 · A · 职业 factory
- 声明 factory-27-0：{"skill":5,"stress":3} gain:notebook, exp:workshop
- 声明 factory-27-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 factory-27-2：{"money":-250,"health":3,"stress":-4} exp:safety
未采到正式提交的基础选项：factory-27-1、factory-27-2
- tests/acceptance.cjs，seed 1：{"choice":"factory-27-0","action":"改成交接清单","text":"两班各留三分钟，误报慢慢少了","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"factory","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"factory-27-0","action":"改成交接清单","text":"两班各留三分钟，误报慢慢少了","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"player","highlights":[]}

## delivery-27 · 27 / 26岁 · A · 职业 delivery
- 声明 delivery-27-0：{"money":-250,"health":3,"stress":-4} protect:2, exp:safety
- 声明 delivery-27-1：{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- 声明 delivery-27-2：{"money":900,"stress":6} protect:0
未采到正式提交的基础选项：delivery-27-1、delivery-27-2
- tests/acceptance.cjs，seed 1：{"choice":"delivery-27-0","action":"提前换到熟悉的片区","text":"钱少一点，回站时还能把灯擦干","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"delivery","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"delivery-27-0","action":"提前换到熟悉的片区","text":"钱少一点，回站时还能把灯擦干","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## sanitation-27 · 27 / 26岁 · A · 职业 sanitation
- 声明 sanitation-27-0：{"skill":5,"stress":3} exp:workshop
- 声明 sanitation-27-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 sanitation-27-2：{"money":-250,"health":3,"stress":-4} protect:2
未采到正式提交的基础选项：sanitation-27-1、sanitation-27-2
- tests/acceptance.cjs，seed 1：{"choice":"sanitation-27-0","action":"同班组重排顺序","text":"早点出来的那一趟明显顺了一点","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"sanitation-27-0","action":"同班组重排顺序","text":"早点出来的那一趟明显顺了一点","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"sanitation-27-0","action":"同班组重排顺序","text":"早点出来的那一趟明显顺了一点","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## arena-lineup · 27 / 26岁 · A · rule(esport-job)
- 声明 arena-lineup-0：{"body":4,"health":2} thread:esport, meet:coach
- 声明 arena-lineup-1：{"mind":4,"stress":-6,"mood":4} exp:recovery
- 声明 arena-lineup-2：{"skill":5,"stress":3} thread:indie
未采到正式提交的基础选项：arena-lineup-1、arena-lineup-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-lineup-0","action":"练首发配合","text":"第二周队友认得出你报点的声音","delta":{"body":4,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-lineup-0","action":"练首发配合","text":"第二周队友认得出你报点的声音","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-lineup-0","action":"练首发配合","text":"第二周队友认得出你报点的声音","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["coach"],"job":"player","highlights":[]}

## life-28 · 28 / 26岁 · A · 公共兜底
- 声明 life-28-0：{"family":5,"mood":2} moveitems:keep
- 声明 life-28-1：{"mind":4,"stress":-6,"mood":4} moveitems:store
- 声明 life-28-2：{"social":4,"network":3,"mood":2} moveitems:give
未采到正式提交的基础选项：life-28-2
- tests/acceptance.cjs，seed 1：{"choice":"life-28-0","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。带走1件，收起7件。","delta":{"money":300,"stress":-4,"mood":3,"family":5},"from":[2],"opportunity":[],"echo":[{"id":"lamp","text":"旧台灯换了一张桌子，亮处刚好容得下一张纸。","weight":26}],"items":["notes","letter","prototype","photo","yearbook","badge","notebook"],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-28-0","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。带走1件，收起3件。","delta":{"money":300,"stress":-1,"mood":2,"family":5},"from":[2],"opportunity":[],"echo":[{"id":"lamp","text":"旧台灯换了一张桌子，亮处刚好容得下一张纸。","weight":28}],"items":["notes","letter","map"],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-28-1","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。收起4件，送出1件。","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":["lamp","notes","console","letter","map"],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-28-0","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。带走1件，收起7件。","delta":{"money":300,"stress":-1,"mood":2,"family":5},"from":[],"opportunity":[],"echo":[],"items":["notes","letter","prototype","photo","yearbook","badge","notebook"],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-28-0","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。带走1件，收起6件。","delta":{"money":300,"stress":-1,"mood":2,"family":5},"from":[2],"opportunity":[],"echo":[{"id":"lamp","text":"旧台灯换了一张桌子，亮处刚好容得下一张纸。","weight":3}],"items":["notes","console","letter","prototype","photo","yearbook"],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-28-0","action":"给旧物安排去处","text":"这次搬家，你把旧物逐件安顿好。带走1件，收起6件。","delta":{"money":300,"stress":-1,"mood":2,"family":5},"from":[2],"opportunity":[],"echo":[{"id":"lamp","text":"那盏台灯换了一张桌子，白痕还在原来的地方。","weight":27}],"items":["notes","console","letter","prototype","photo","yearbook"],"people":[],"job":"player","highlights":[]}

## life-29 · 29 / 27岁 · A · 公共兜底
- 声明 life-29-0：{"money":900,"stress":6} 
- 声明 life-29-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-29-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-29-1、life-29-2
- tests/acceptance.cjs，seed 1：{"choice":"life-29-0","action":"先答复工作","text":"值班计划定了下来，你把私人事往后挪","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-29-0","action":"先答复工作","text":"值班计划定了下来，你把私人事往后挪","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-29-0","action":"先答复工作","text":"值班计划定了下来，你把私人事往后挪","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-29-0","action":"先答复工作","text":"值班计划定了下来，你把私人事往后挪","delta":{"money":1200,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-29-0","action":"先答复工作","text":"值班计划定了下来，你把私人事往后挪","delta":{"money":1200,"stress":5,"mood":1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## chance-old-friend · 29 / 27岁 · A · rule(chance)
- 声明 chance-old-friend-0：{"skill":5,"stress":3} thread:indie, meet:friend, exp:teamwork
- 声明 chance-old-friend-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 chance-old-friend-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：chance-old-friend-1
- tests/acceptance.cjs，seed 1：{"choice":"chance-old-friend-0","action":"用半晚把草稿做出来","text":"最后你们留下一份能互相交接的草稿","delta":{"skill":5,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"chance-old-friend-0","action":"用半晚把草稿做出来","text":"最后你们留下一份能互相交接的草稿","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"chance-old-friend-2","action":"告诉他最近没有余力","text":"他把文件留给你，说有空再看","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 2：{"choice":"chance-old-friend-0","action":"用半晚把草稿做出来","text":"最后你们留下一份能互相交接的草稿","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"chance-old-friend-0","action":"用半晚把草稿做出来","text":"最后你们留下一份能互相交接的草稿","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"player","highlights":[]}

## life-30 · 30 / 27岁 · B · 公共兜底
- 声明 life-30-0：{"body":4,"health":2} exp:safety
- 声明 life-30-1：{"skill":5,"stress":3} exp:mentor
- 声明 life-30-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-30-2
- tests/acceptance.cjs，seed 1：{"choice":"life-30-0","action":"一起对照天气和路线","text":"两个临时任务挪到了路况好一点的时候","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-30-0","action":"一起对照天气和路线","text":"两个临时任务挪到了路况好一点的时候","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-30-1","action":"把经验贴在墙上","text":"同事在纸边加了一条以前没想到的提示 你多检查了一遍袖口和雨具，也记住了下次出门前要检查的三件事。","delta":{"skill":4,"money":300,"stress":2,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-30-0","action":"一起对照天气和路线","text":"两个临时任务挪到了路况好一点的时候","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-30-0","action":"一起对照天气和路线","text":"两个临时任务挪到了路况好一点的时候","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-30-0","action":"一起对照天气和路线","text":"两个临时任务挪到了路况好一点的时候","delta":{"body":3,"money":300,"stress":-1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-31 · 31 / 28岁 · B · 公共兜底
- 声明 life-31-0：{"money":-600,"mood":4} 
- 声明 life-31-1：{"social":4,"network":3,"mood":2} 
- 声明 life-31-2：{"family":5,"mood":2} meet:parent
未采到正式提交的基础选项：life-31-1、life-31-2
- tests/acceptance.cjs，seed 1：{"choice":"life-31-0","action":"先续租","text":"你们跟房东谈好分两次付款","delta":{"money":-300,"stress":-1,"mood":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-31-0","action":"先续租","text":"你们跟房东谈好分两次付款","delta":{"money":-300,"stress":-1,"mood":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-31-0","action":"先续租","text":"你们跟房东谈好分两次付款","delta":{"money":-300,"stress":-1,"mood":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-31-0","action":"先续租","text":"你们跟房东谈好分两次付款","delta":{"money":-300,"stress":-1,"mood":4,"family":1,"expect":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-31-0","action":"先续租","text":"你们跟房东谈好分两次付款","delta":{"money":-300,"stress":-1,"mood":4,"family":3,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"player","highlights":[]}

## life-32 · 32 / 29岁 · A · 公共兜底
- 声明 life-32-0：{"skill":5,"stress":3} exp:workshop
- 声明 life-32-1：{"knowledge":5,"stress":4} exp:safety
- 声明 life-32-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-32-1、life-32-2
- tests/shop.cjs，seed 1：{"choice":"life-32-0","action":"把交接再写清楚","text":"有人终于知道周二交不出材料该找谁","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## office-32 · 32 / 29岁 · A · 职业 office
- 声明 office-32-0：{"skill":5,"stress":3} exp:workshop
- 声明 office-32-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 office-32-2：{"mind":4,"stress":-6,"mood":4} setback:office
未采到正式提交的基础选项：office-32-1、office-32-2
- tests/acceptance.cjs，seed 1：{"choice":"office-32-0","action":"交出可接手的资料","text":"对方问你能否留下帮助一周","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"office-32-0","action":"交出可接手的资料","text":"对方问你能否留下帮助一周","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"office-32-0","action":"交出可接手的资料","text":"对方问你能否留下帮助一周","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"office-32-0","action":"交出可接手的资料","text":"对方问你能否留下帮助一周","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## factory-32 · 32 / 29岁 · A · 职业 factory
- 声明 factory-32-0：{"money":-250,"health":3,"stress":-4} setback:factory, protect:2
- 声明 factory-32-1：{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- 声明 factory-32-2：{"money":900,"stress":6} protect:0
未采到正式提交的基础选项：factory-32-1、factory-32-2
- tests/acceptance.cjs，seed 1：{"choice":"factory-32-0","action":"先报告并换工位","text":"工时少了一点，你花了两周适应另一道工序 日常收入暂时中断，生活支出仍在继续。","delta":{"money":-1850,"stress":2,"health":-3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"factory","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"factory-32-0","action":"先报告并换工位","text":"工时少了一点，你花了两周适应另一道工序 日常收入暂时中断，生活支出仍在继续。","delta":{"money":-1850,"stress":2,"health":-3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## delivery-32 · 32 / 29岁 · A · 职业 delivery
- 声明 delivery-32-0：{"social":4,"network":3,"mood":2} exp:safety, meet:colleague
- 声明 delivery-32-1：{"money":-250,"health":3,"stress":-4} protect:2
- 声明 delivery-32-2：{"money":900,"stress":6} protect:0
未采到正式提交的基础选项：delivery-32-1、delivery-32-2
- tests/acceptance.cjs，seed 1：{"choice":"delivery-32-0","action":"提交真实的绕行时间","text":"站里先把两处积水点划成慢行段","delta":{"social":4,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"delivery","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"delivery-32-0","action":"提交真实的绕行时间","text":"站里先把两处积水点划成慢行段","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"player","highlights":[]}

## sanitation-32 · 32 / 29岁 · A · 职业 sanitation
- 声明 sanitation-32-0：{"social":4,"network":3,"mood":2} meet:colleague, protect:1
- 声明 sanitation-32-1：{"money":-250,"health":3,"stress":-4} setback:sanitation, protect:2
- 声明 sanitation-32-2：{"money":900,"stress":6} protect:0
未采到正式提交的基础选项：sanitation-32-1、sanitation-32-2
- tests/acceptance.cjs，seed 1：{"choice":"sanitation-32-0","action":"提出增补班组","text":"负责的人同意先试两周，原来的问题要继续记","delta":{"social":3,"money":300,"stress":-1,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"sanitation-32-0","action":"提出增补班组","text":"负责的人同意先试两周，原来的问题要继续记","delta":{"social":3,"money":300,"stress":-1,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"sanitation-32-0","action":"提出增补班组","text":"负责的人同意先试两周，原来的问题要继续记","delta":{"social":3,"money":300,"stress":-1,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"player","highlights":[]}

## arena-injury · 32 / 29岁 · A · rule(esport-job)
- 声明 arena-injury-0：{"money":-250,"health":3,"stress":-4} protect:2, exp:recovery
- 声明 arena-injury-1：{"body":4,"health":2} protect:1, thread:esport
- 声明 arena-injury-2：{"money":900,"stress":6} protect:0, thread:esport
未采到正式提交的基础选项：arena-injury-1、arena-injury-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-injury-0","action":"减量，留出恢复时间","text":"陈姐把一场训练改成你可以参加的复盘","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-injury-0","action":"减量，留出恢复时间","text":"陈姐把一场训练改成你可以参加的复盘","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-injury-0","action":"减量，留出恢复时间","text":"陈姐把一场训练改成你可以参加的复盘","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-33 · 33 / 30岁 · S · 公共兜底
- 声明 life-33-0：{"money":900,"stress":6} priority:work
- 声明 life-33-1：{"skill":5,"stress":3} thread:indie, meet:friend, project:sketch, priority:project
- 声明 life-33-2：{"mind":4,"stress":-6,"mood":4} priority:rest
未采到正式提交的基础选项：无
- tests/lifecycle.cjs，seed 1：{"choice":"life-33-1","action":"抽时间和阿宁做项目","text":"你们留了第一个能坐下来做事的晚上","delta":{"skill":4,"money":150,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":["friend"],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-33-0","action":"承担新的工作","text":"排班稳定了，其他事再约时间","delta":{"money":1200,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"优先安排","detail":"排班补贴和任务一起确认。"},{"id":"project","title":"做游戏","status":"报名截止","detail":"这次试玩展的报名窗口会关上，想法仍能留下。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-33-2","action":"把周末留给身体","text":"周日下午你没有设闹钟","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"报名截止","detail":"这次试玩展的报名窗口会关上，想法仍能留下。"},{"id":"rest","title":"留出休息","status":"优先安排","detail":"先保下一次休息，下一轮排班会少接一些活。"}],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-33-0","action":"承担新的工作","text":"排班稳定了，其他事再约时间","delta":{"money":1200,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"优先安排","detail":"排班补贴和任务一起确认。"},{"id":"project","title":"做游戏","status":"报名截止","detail":"这次试玩展的报名窗口会关上，想法仍能留下。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## indie-budget · 33 / 30岁 · A · rule(indie)
- 声明 indie-budget-0：{"skill":5,"stress":3} project:polish, wish:make, priority:project
- 声明 indie-budget-1：{"knowledge":5,"stress":4} project:repair, wish:make, priority:project
- 声明 indie-budget-2：{"money":900,"stress":6} project:wait, priority:work
- 声明 indie-budget-3：{"mind":4,"stress":-6,"mood":4} pause:indie, priority:rest
未采到正式提交的基础选项：indie-budget-1、indie-budget-2、indie-budget-3
- tests/acceptance.cjs，seed 1：{"choice":"indie-budget-0","action":"先把玩法做完整","text":"你删了一张地图，试玩真的可以打通了","delta":{"skill":4,"money":-150,"stress":2,"mood":1},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-budget-0","action":"先把玩法做完整","text":"你删了一张地图，试玩真的可以打通了 日常收入暂时中断，生活支出仍在继续。","delta":{"skill":4,"money":-2050,"stress":13,"health":-6},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-budget-0","action":"先把玩法做完整","text":"你删了一张地图，试玩真的可以打通了","delta":{"skill":4,"money":-150,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-budget-0","action":"先把玩法做完整","text":"你删了一张地图，试玩真的可以打通了","delta":{"skill":4,"money":-150,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"indie-budget-0","action":"先把玩法做完整","text":"你删了一张地图，试玩真的可以打通了","delta":{"skill":4,"money":-150,"stress":5},"from":[],"opportunity":[{"id":"work","title":"接新工作","status":"顺延一轮","detail":"等这轮忙完再问名额。"},{"id":"project","title":"做游戏","status":"优先安排","detail":"安排一晚完成原型，留出制作开支。"},{"id":"rest","title":"留出休息","status":"顺延一轮","detail":"休息排进下一轮，眼下要靠余力照顾身体。"}],"echo":[],"items":["prototype"],"people":[],"job":"player","highlights":[]}

## life-34 · 34 / 31岁 · B · 公共兜底
- 声明 life-34-0：{"family":5,"mood":2} meet:parent
- 声明 life-34-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-34-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-34-1、life-34-2
- tests/acceptance.cjs，seed 1：{"choice":"life-34-0","action":"把自己的计划说清楚","text":"家人听完，问能不能下周继续聊","delta":{"money":300,"stress":-1,"mood":2,"family":8,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-34-0","action":"把自己的计划说清楚","text":"家人听完，问能不能下周继续聊","delta":{"money":300,"stress":-1,"mood":2,"family":8,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-34-0","action":"把自己的计划说清楚","text":"家人听完，问能不能下周继续聊","delta":{"money":300,"stress":-1,"mood":2,"family":8,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-34-0","action":"把自己的计划说清楚","text":"家人听完，问能不能下周继续聊","delta":{"money":300,"stress":-1,"mood":2,"family":6,"expect":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-34-0","action":"把自己的计划说清楚","text":"家人听完，问能不能下周继续聊","delta":{"money":300,"stress":-1,"mood":2,"family":8,"expect":-2},"from":[],"opportunity":[],"echo":[],"items":[],"people":["parent"],"job":"player","highlights":[]}

## life-35 · 35 / 31岁 · A · 公共兜底
- 声明 life-35-0：{"money":900,"stress":6} wish:save
- 声明 life-35-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 life-35-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-35-2
- tests/lifecycle.cjs，seed 1：{"choice":"life-35-1","action":"问同事能不能换班","text":"小周告诉你他哪天能接，另外两天你还得自己想办法 前一轮选下的临时工作已经交接，你拿到额外的补贴，这周也少了一点休息。","delta":{"social":3,"money":750,"stress":1,"mood":2,"network":3},"from":[33],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"life-35-0","action":"找一个现金缓冲","text":"你核对了要付的账单，先谈成了两周的临时班 前一轮选下的临时工作已经交接，你拿到额外的补贴，这周也少了一点休息。","delta":{"money":1650,"stress":7},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-35-0","action":"找一个现金缓冲","text":"你核对了要付的账单，先谈成了两周的临时班 之前答应的试玩排期仍在。你要为下一次提交留出时间。","delta":{"money":1200,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## indie-rights · 35 / 31岁 · A · rule(indie-active)
- 声明 indie-rights-0：{"skill":5,"stress":3} project:repair
- 声明 indie-rights-1：{"social":4,"network":3,"mood":2} project:polish, meet:friend
- 声明 indie-rights-2：{"mind":4,"stress":-6,"mood":4} pause:indie
未采到正式提交的基础选项：indie-rights-1、indie-rights-2
- tests/acceptance.cjs，seed 1：{"choice":"indie-rights-0","action":"换掉配乐继续迭代","text":"你们用了可授权的声音，晚交了一天 之前答应的试玩排期仍在。你要为下一次提交留出时间。","delta":{"skill":4,"money":-150,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-rights-0","action":"换掉配乐继续迭代","text":"你们用了可授权的声音，晚交了一天 之前答应的试玩排期仍在。你要为下一次提交留出时间。 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"skill":4,"money":-950,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-rights-0","action":"换掉配乐继续迭代","text":"你们用了可授权的声音，晚交了一天 之前答应的试玩排期仍在。你要为下一次提交留出时间。","delta":{"skill":4,"money":-150,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-rights-0","action":"换掉配乐继续迭代","text":"你们用了可授权的声音，晚交了一天 之前答应的试玩排期仍在。你要为下一次提交留出时间。","delta":{"skill":4,"money":-150,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"indie-rights-0","action":"换掉配乐继续迭代","text":"你们用了可授权的声音，晚交了一天 之前答应的试玩排期仍在。你要为下一次提交留出时间。","delta":{"skill":4,"money":-150,"stress":5},"from":[33],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-36 · 36 / 32岁 · S · 公共兜底
- 声明 life-36-0：{"social":4,"network":3,"mood":2} protect:1
- 声明 life-36-1：{"money":900,"stress":6} protect:0
- 声明 life-36-2：{"money":-250,"health":3,"stress":-4} protect:2
未采到正式提交的基础选项：life-36-1、life-36-2
- tests/shop.cjs，seed 1：{"choice":"life-36-0","action":"找同事接一班","text":"你把交接时间谈清楚，收入少了一点","delta":{"social":3,"money":300,"stress":-1,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## arena-tactics · 36 / 32岁 · A · rule(esport-job)
- 声明 arena-tactics-0：{"skill":5,"stress":3} thread:esport, arena:steady
- 声明 arena-tactics-1：{"body":4,"health":2} thread:esport, arena:attack
- 声明 arena-tactics-2：{"mind":4,"stress":-6,"mood":4} arena:mentor
未采到正式提交的基础选项：arena-tactics-1、arena-tactics-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-tactics-0","action":"先稳住可以配合的位置","text":"队友知道第一波该为谁留出空档","delta":{"skill":5,"money":300,"stress":-1,"mood":1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-tactics-0","action":"先稳住可以配合的位置","text":"队友知道第一波该为谁留出空档","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-tactics-0","action":"先稳住可以配合的位置","text":"队友知道第一波该为谁留出空档","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## rain-shift · 36 / 32岁 · A · rule(delivery)
- 声明 rain-shift-0：{"money":-250,"health":3,"stress":-4} protect:2, rain:2
- 声明 rain-shift-1：{"body":4,"health":2} protect:1, rain:1
- 声明 rain-shift-2：{"money":900,"stress":6} protect:0, rain:0
未采到正式提交的基础选项：rain-shift-1
- tests/acceptance.cjs，seed 1：{"choice":"rain-shift-0","action":"暂停高风险路段","text":"你通知站点延时，先交接路况 这一趟平安收工。你仍给接下来的排班留下了恢复时间。","delta":{"money":50,"stress":-9,"mood":1,"health":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"delivery","highlights":[]}
- tests/acceptance.cjs，seed 12：{"choice":"rain-shift-2","action":"照原排班完成","text":"这次收入保住了，你还得承担更长的湿滑路段 日常收入暂时中断，生活支出仍在继续。","delta":{"money":-700,"stress":14,"health":-8},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"delivery","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"rain-shift-0","action":"暂停高风险路段","text":"你通知站点延时，先交接路况 这一趟平安收工。你仍给接下来的排班留下了恢复时间。","delta":{"money":50,"stress":-6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## office-pivot · 36 / 32岁 · A · rule(office)
- 声明 office-pivot-0：{"social":4,"network":3,"mood":2} setback:office, protect:1
- 声明 office-pivot-1：{"mind":4,"stress":-6,"mood":4} setback:office, protect:2
- 声明 office-pivot-2：{"money":900,"stress":6} setback:office, protect:0
未采到正式提交的基础选项：office-pivot-1、office-pivot-2
- tests/acceptance.cjs，seed 1：{"choice":"office-pivot-0","action":"找交接和转岗机会","text":"你向能联系到的同事说清了自己会做什么 日常收入暂时中断，生活支出仍在继续。","delta":{"social":3,"money":-2400,"stress":4,"mood":3,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"office-pivot-0","action":"找交接和转岗机会","text":"你向能联系到的同事说清了自己会做什么 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"social":3,"money":-500,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"office-pivot-0","action":"找交接和转岗机会","text":"你向能联系到的同事说清了自己会做什么 日常收入暂时中断，生活支出仍在继续。","delta":{"social":3,"money":-2400,"stress":7,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"office-pivot-0","action":"找交接和转岗机会","text":"你向能联系到的同事说清了自己会做什么 日常收入暂时中断，生活支出仍在继续。","delta":{"social":3,"money":-2400,"stress":7,"mood":2,"health":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## factory-pivot · 36 / 32岁 · A · rule(factory)
- 声明 factory-pivot-0：{"money":-250,"health":3,"stress":-4} setback:factory, protect:2
- 声明 factory-pivot-1：{"social":4,"network":3,"mood":2} protect:1
- 声明 factory-pivot-2：{"money":900,"stress":6} setback:factory, protect:0
未采到正式提交的基础选项：factory-pivot-1、factory-pivot-2
- tests/acceptance.cjs，seed 1：{"choice":"factory-pivot-0","action":"要求暂停重复工序","text":"调班审批下来以前，你先按更短时段工作","delta":{"money":-250,"stress":-8,"mood":1,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"factory","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"factory-pivot-0","action":"要求暂停重复工序","text":"调班审批下来以前，你先按更短时段工作 日常收入暂时中断，生活支出仍在继续。","delta":{"money":-1850,"stress":2,"health":-6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## city-pivot · 36 / 32岁 · A · rule(sanitation)
- 声明 city-pivot-0：{"money":-250,"health":3,"stress":-4} protect:2
- 声明 city-pivot-1：{"social":4,"network":3,"mood":2} protect:1, meet:colleague
- 声明 city-pivot-2：{"money":900,"stress":6} setback:sanitation, protect:0
未采到正式提交的基础选项：city-pivot-1、city-pivot-2
- tests/acceptance.cjs，seed 1：{"choice":"city-pivot-0","action":"先补防护和临时线路","text":"你花了半班看路线，把新边界写回值班表","delta":{"money":50,"stress":-9,"mood":1,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"city-pivot-0","action":"先补防护和临时线路","text":"你花了半班看路线，把新边界写回值班表","delta":{"money":50,"stress":-6,"health":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"city-pivot-0","action":"先补防护和临时线路","text":"你花了半班看路线，把新边界写回值班表","delta":{"money":50,"stress":-6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-37 · 37 / 33岁 · B · 公共兜底
- 声明 life-37-0：{"mind":4,"stress":-6,"mood":4} exp:recovery
- 声明 life-37-1：{"knowledge":5,"stress":4} exp:workshop
- 声明 life-37-2：{"social":4,"network":3,"mood":2} meet:colleague
未采到正式提交的基础选项：life-37-1、life-37-2
- tests/acceptance.cjs，seed 1：{"choice":"life-37-0","action":"按短班复工","text":"第一周留出了恢复时间，你把班表贴得很低","delta":{"mind":4,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-37-0","action":"按短班复工","text":"第一周留出了恢复时间，你把班表贴得很低","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-37-0","action":"按短班复工","text":"第一周留出了恢复时间，你把班表贴得很低","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## office-37 · 37 / 33岁 · A · 职业 office
- 声明 office-37-0：{"knowledge":5,"stress":4} gain:notebook
- 声明 office-37-1：{"mind":4,"stress":-6,"mood":4} exp:recovery
- 声明 office-37-2：{"social":4,"network":3,"mood":2} meet:colleague
未采到正式提交的基础选项：office-37-1、office-37-2
- tests/acceptance.cjs，seed 1：{"choice":"office-37-0","action":"带交接笔记去面谈","text":"你能清楚解释自己解决过什么 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"knowledge":4,"money":-500,"stress":6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"office-37-0","action":"带交接笔记去面谈","text":"你能清楚解释自己解决过什么","delta":{"knowledge":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"office-37-0","action":"带交接笔记去面谈","text":"你能清楚解释自己解决过什么 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"knowledge":4,"money":-500,"stress":6},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"office-37-0","action":"带交接笔记去面谈","text":"你能清楚解释自己解决过什么","delta":{"knowledge":4,"money":300,"stress":3},"from":[],"opportunity":[],"echo":[],"items":["notebook"],"people":[],"job":"player","highlights":[]}

## factory-37 · 37 / 33岁 · A · 职业 factory
- 声明 factory-37-0：{"social":4,"network":3,"mood":2} exp:mentor
- 声明 factory-37-1：{"knowledge":5,"stress":4} exp:recovery
- 声明 factory-37-2：{"skill":5,"stress":3} exp:workshop
未采到正式提交的基础选项：factory-37-1、factory-37-2
- tests/acceptance.cjs，seed 1：{"choice":"factory-37-0","action":"带新人过检查项","text":"他学会了遇到异响先停再问","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"factory","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"factory-37-0","action":"带新人过检查项","text":"他学会了遇到异响先停再问","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## delivery-37 · 37 / 33岁 · A · 职业 delivery
- 声明 delivery-37-0：{"money":-250,"health":3,"stress":-4} exp:recovery, job:delivery
- 声明 delivery-37-1：{"knowledge":5,"stress":4} job:dispatcher, exp:recovery
- 声明 delivery-37-2：{"social":4,"network":3,"mood":2} meet:colleague, exp:recovery
未采到正式提交的基础选项：delivery-37-1、delivery-37-2
- tests/shop.cjs，seed 1：{"choice":"delivery-37-0","action":"用短班慢慢恢复","text":"第一周少跑几单，第二周身体仍需要休息","delta":{"money":50,"stress":-5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"delivery","highlights":[]}

## sanitation-37 · 37 / 33岁 · A · 职业 sanitation
- 声明 sanitation-37-0：{"social":4,"network":3,"mood":2} exp:mentor
- 声明 sanitation-37-1：{"skill":5,"stress":3} gain:map, exp:workshop
- 声明 sanitation-37-2：{"mind":4,"stress":-6,"mood":4} exp:recovery
未采到正式提交的基础选项：sanitation-37-1、sanitation-37-2
- tests/acceptance.cjs，seed 1：{"choice":"sanitation-37-0","action":"陪他雨后重走一遍","text":"你把原来省略的两条支路也讲了","delta":{"social":4,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"sanitation-37-0","action":"陪他雨后重走一遍","text":"你把原来省略的两条支路也讲了","delta":{"social":3,"money":300,"stress":-1,"mood":1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"sanitation-37-0","action":"陪他雨后重走一遍","text":"你把原来省略的两条支路也讲了","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## delivery-routine · 37 / 33岁 · A · rule(delivery-routine)
- 声明 delivery-routine-0：{"body":4,"health":2} exp:safety
- 声明 delivery-routine-1：{"knowledge":5,"stress":4} job:dispatcher, exp:workshop
- 声明 delivery-routine-2：{"social":4,"network":3,"mood":2} meet:colleague
未采到正式提交的基础选项：delivery-routine-1、delivery-routine-2
- tests/acceptance.cjs，seed 1：{"choice":"delivery-routine-0","action":"留下熟悉路线","text":"你在值班表上留了一格供临时调整","delta":{"body":4,"money":300,"stress":-1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"delivery","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"delivery-routine-0","action":"留下熟悉路线","text":"你在值班表上留了一格供临时调整","delta":{"body":3,"money":300,"stress":-1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## life-38 · 38 / 34岁 · A · 公共兜底
- 声明 life-38-0：{"skill":5,"stress":3} reopen:choose
- 声明 life-38-1：{"family":5,"mood":2} meet:parent
- 声明 life-38-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-38-1
- tests/acceptance.cjs，seed 1：{"choice":"life-38-0","action":"给手边的旧物一个位置","text":"你把柜子擦了两遍，终于挑出一格","delta":{"skill":5,"money":300,"stress":2},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"少数题已经认不出解法，你仍认得是谁陪你解过。","weight":0}],"items":["notes"],"people":[],"job":"delivery","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"life-38-0","action":"给手边的旧物一个位置","text":"你把柜子擦了两遍，终于挑出一格 日常收入暂时中断，生活支出仍在继续。","delta":{"skill":4,"money":-1600,"stress":10,"health":-6},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"少数题已经认不出解法，你仍认得是谁陪你解过。","weight":0}],"items":["notes"],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-38-2","action":"先打扫桌面","text":"你留下一张干净的纸，给今天写两句","delta":{"mind":3,"money":300,"stress":-7,"mood":1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-38-0","action":"给手边的旧物一个位置","text":"你把柜子擦了两遍，终于挑出一格","delta":{"skill":4,"money":300,"stress":2},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"少数题已经认不出解法，你仍认得是谁陪你解过。","weight":0}],"items":["notes"],"people":[],"job":"player","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-38-0","action":"给手边的旧物一个位置","text":"你把柜子擦了两遍，终于挑出一格","delta":{"skill":4,"money":300,"stress":2},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"少数题已经认不出解法，你仍认得是谁陪你解过。","weight":0}],"items":["notes"],"people":[],"job":"player","highlights":[]}

## active-recovery · 38 / 34岁 · A · rule(recover)
- 声明 active-recovery-0：{"money":-250,"health":3,"stress":-4} recover:short, exp:recovery
- 声明 active-recovery-1：{"knowledge":5,"stress":4} recover:change, exp:recovery
- 声明 active-recovery-2：{"social":4,"network":3,"mood":2} recover:help, exp:recovery, meet:colleague
未采到正式提交的基础选项：active-recovery-1
- tests/acceptance.cjs，seed 1：{"choice":"active-recovery-0","action":"试一轮短班复工","text":"你按承受得住的时间重新上手，还保留了休息日","delta":{"money":-150,"stress":-8,"health":5},"from":[19,36],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":29}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"active-recovery-2","action":"请人共担一段","text":"小周说只能帮到月底，你据此改过日程","delta":{"social":3,"money":100,"stress":-4,"mood":2,"health":2,"network":3},"from":[19],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":2}],"items":[],"people":["colleague"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"active-recovery-0","action":"试一轮短班复工","text":"你按承受得住的时间重新上手，还保留了休息日","delta":{"money":-150,"stress":-8,"health":5},"from":[19,33],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":2}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"active-recovery-0","action":"试一轮短班复工","text":"你按承受得住的时间重新上手，还保留了休息日","delta":{"money":-150,"stress":-8,"health":5},"from":[19,36],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":29}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"active-recovery-0","action":"试一轮短班复工","text":"你按承受得住的时间重新上手，还保留了休息日","delta":{"money":-150,"stress":-8},"from":[19,37],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":13}],"items":[],"people":[],"job":"player","highlights":[]}

## life-39 · 39 / 35岁 · A · 公共兜底
- 声明 life-39-0：{"social":4,"network":3,"mood":2} exp:mentor, meet:colleague
- 声明 life-39-1：{"skill":5,"stress":3} gain:notebook, exp:workshop
- 声明 life-39-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-39-1、life-39-2
- tests/lifecycle.cjs，seed 57：{"choice":"life-39-0","action":"陪新同事走一遍","text":"他在表后写了下次能独立处理的三件事 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"social":3,"money":-500,"stress":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-39-0","action":"陪新同事走一遍","text":"他在表后写了下次能独立处理的三件事","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"player","highlights":[]}

## arena-final · 39 / 35岁 · S · rule(esport-job)
- 声明 arena-final-0：{"skill":5,"stress":3} final:play
- 声明 arena-final-1：{"social":4,"network":3,"mood":2} final:assist
- 声明 arena-final-2：{"mind":4,"stress":-6,"mood":4} final:leave
未采到正式提交的基础选项：arena-final-1
- tests/acceptance.cjs，seed 1：{"choice":"arena-final-0","action":"执行和队友定下的打法","text":"手贴到桌上时，你先听见队友报位置 比分停了下来。你回头看向队友，知道这次站在了最后。","delta":{"skill":5,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["medal"],"people":[],"job":"player","highlights":["world"]}
- tests/acceptance.cjs，seed 1：{"choice":"arena-final-2","action":"准备退役","text":"错过这一场以后，你想清楚仍想带走什么 这一场结束了。你开始想下一段生活需要什么。","delta":{"mind":4,"money":300,"stress":-7,"mood":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-final-0","action":"执行和队友定下的打法","text":"手贴到桌上时，你先听见队友报位置 比分停了下来。你回头看向队友，知道这次站在了最后。","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":["medal"],"people":[],"job":"player","highlights":["world"]}
- tests/dinner.cjs，seed 9：{"choice":"arena-final-0","action":"执行和队友定下的打法","text":"手贴到桌上时，你先听见队友报位置 你们没能拿下最后一场。训练留下的东西仍可以带走。","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## indie-launch · 39 / 35岁 · S · rule(indie-active)
- 声明 indie-launch-0：{"skill":5,"stress":3} release:now
- 声明 indie-launch-1：{"knowledge":5,"stress":4} release:later
- 声明 indie-launch-2：{"mind":4,"stress":-6,"mood":4} release:stop
未采到正式提交的基础选项：indie-launch-1
- tests/acceptance.cjs，seed 1：{"choice":"indie-launch-2","action":"只留在制作组","text":"你把现有可用的文件整理到同一个目录 正式发布计划没有走完，你们留下可再次打开的版本。","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[33,35],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/acceptance.cjs，seed 1：{"choice":"indie-launch-0","action":"提交现在的版本","text":"你在说明里写明已知的问题和更新计划 一位主播偶然玩到这款游戏，第二天多了整整一屏陌生人的留言。","delta":{"skill":4,"money":300,"stress":2},"from":[33,35],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":["published"]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-launch-0","action":"提交现在的版本","text":"你在说明里写明已知的问题和更新计划 一位主播偶然玩到这款游戏，第二天多了整整一屏陌生人的留言。","delta":{"skill":4,"money":300,"stress":2},"from":[33,35],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":["published"]}
- tests/gift.cjs，seed 1：{"choice":"indie-launch-0","action":"提交现在的版本","text":"你在说明里写明已知的问题和更新计划 首周只有零星下载。一封手写反馈标出了最难懂的地方。","delta":{"skill":4,"money":300,"stress":2},"from":[33,35],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":["published"]}
- tests/shop.cjs，seed 1：{"choice":"indie-launch-0","action":"提交现在的版本","text":"你在说明里写明已知的问题和更新计划 首周只有零星下载。一封手写反馈标出了最难懂的地方。","delta":{"skill":4,"money":300,"stress":2},"from":[33,35],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":["published"]}

## life-40 · 40 / 35岁 · S · 公共兜底
- 声明 life-40-0：{"skill":5,"stress":3} priority:work
- 声明 life-40-1：{"knowledge":5,"stress":4} job:dispatcher, priority:change
- 声明 life-40-2：{"mind":4,"stress":-6,"mood":4} priority:rest
未采到正式提交的基础选项：life-40-1、life-40-2
- tests/acceptance.cjs，seed 1：{"choice":"life-40-0","action":"留下并调整工作方式","text":"你把想继续的事写成一行，交接时间更清楚了 两次排班后，先前选的恢复安排渐渐稳定下来。已经付掉的账单和少掉的工时仍留在记录里。 阿宁以前留的号码已经很久没有消息，这段联系慢慢断了。","delta":{"skill":4,"money":300,"stress":-1,"mood":1},"from":[1],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"life-40-0","action":"留下并调整工作方式","text":"你把想继续的事写成一行，交接时间更清楚了 这段时间仍有 500 元生活支出要从储蓄中支付。","delta":{"skill":4,"money":-500,"stress":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-40-0","action":"留下并调整工作方式","text":"你把想继续的事写成一行，交接时间更清楚了 两次排班后，先前选的恢复安排渐渐稳定下来。已经付掉的账单和少掉的工时仍留在记录里。 阿宁以前留的号码已经很久没有消息，这段联系慢慢断了。","delta":{"skill":4,"money":300,"stress":2},"from":[19],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-40-0","action":"留下并调整工作方式","text":"你把想继续的事写成一行，交接时间更清楚了","delta":{"skill":4,"money":300,"stress":2},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"player","highlights":[]}

## arena-retire · 40 / 35岁 · A · rule(esport-job)
- 声明 arena-retire-0：{"social":4,"network":3,"mood":2} job:office, exp:mentor, pause:esport
- 声明 arena-retire-1：{"skill":5,"stress":3} job:office, thread:indie, wish:make, pause:esport
- 声明 arena-retire-2：{"mind":4,"stress":-6,"mood":4} job:office, pause:esport
未采到正式提交的基础选项：arena-retire-1、arena-retire-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-retire-0","action":"留下来给新人带训练","text":"相同的失误，你试着用更易听懂的话重讲一次 阿宁以前留的号码已经很久没有消息，这段联系慢慢断了。","delta":{"social":4,"money":300,"stress":-4,"mood":2,"network":3},"from":[1],"opportunity":[{"title":"办公室职员","status":"换一份工作","detail":"三十五岁的履历会记录这次转岗，以后的岗位事件也会随之改变。"}],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-retire-0","action":"留下来给新人带训练","text":"相同的失误，你试着用更易听懂的话重讲一次","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[],"opportunity":[{"title":"办公室职员","status":"换一份工作","detail":"三十五岁的履历会记录这次转岗，以后的岗位事件也会随之改变。"}],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-retire-0","action":"留下来给新人带训练","text":"相同的失误，你试着用更易听懂的话重讲一次 阿宁以前留的号码已经很久没有消息，这段联系慢慢断了。","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[1],"opportunity":[{"title":"办公室职员","status":"换一份工作","detail":"三十五岁的履历会记录这次转岗，以后的岗位事件也会随之改变。"}],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}

## life-41 · 41 / 38岁 · B · 公共兜底
- 声明 life-41-0：{"mind":4,"stress":-6,"mood":4} wish:rest
- 声明 life-41-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-41-2：{"skill":5,"stress":3} wish:make
未采到正式提交的基础选项：life-41-2
- tests/acceptance.cjs，seed 1：{"choice":"life-41-0","action":"定个能坚持的小目标","text":"你把日期选在最容易空出来的那一天","delta":{"mind":3,"money":300,"stress":-7,"mood":1},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-41-0","action":"定个能坚持的小目标","text":"你把日期选在最容易空出来的那一天","delta":{"mind":4,"money":300,"stress":-7},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-41-1","action":"留下几句心里话","text":"你把想说的话写了下来，夹在自己的记录里。","delta":{"social":3,"money":300,"stress":-1,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-41-1","action":"试着联系失联的阿宁","text":"你按旧地址留下消息。过了一阵，阿宁回信说也记得你们认识的那段日子。","delta":{"social":3,"money":300,"stress":-1,"network":3},"from":[1],"opportunity":[],"echo":[],"items":[],"people":["friend"],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-41-0","action":"定个能坚持的小目标","text":"你把日期选在最容易空出来的那一天","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-41-0","action":"定个能坚持的小目标","text":"你把日期选在最容易空出来的那一天","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[19],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":6}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-41-0","action":"定个能坚持的小目标","text":"你把日期选在最容易空出来的那一天","delta":{"mind":3,"money":300,"stress":-7,"mood":4},"from":[19],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":13}],"items":[],"people":[],"job":"office","highlights":[]}

## indie-second-desk · 41 / 38岁 · A · rule(former-player)
- 声明 indie-second-desk-0：{"skill":5,"stress":3} project:polish, wish:make
- 声明 indie-second-desk-1：{"knowledge":5,"stress":4} project:repair, wish:make
- 声明 indie-second-desk-2：{"mind":4,"stress":-6,"mood":4} pause:indie
未采到正式提交的基础选项：indie-second-desk-1、indie-second-desk-2
- tests/shop.cjs，seed 1：{"choice":"indie-second-desk-0","action":"先把一关做出来","text":"你把当队员时最熟悉的一个问题做成了关卡","delta":{"skill":4,"money":-150,"stress":5},"from":[19],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":29}],"items":[],"people":[],"job":"office","highlights":[]}

## late-recovery · 41 / 38岁 · A · rule(recover)
- 声明 late-recovery-0：{"money":-250,"health":3,"stress":-4} recover:short, exp:recovery
- 声明 late-recovery-1：{"knowledge":5,"stress":4} recover:change, exp:recovery
- 声明 late-recovery-2：{"social":4,"network":3,"mood":2} recover:help, exp:recovery, meet:colleague
未采到正式提交的基础选项：late-recovery-1、late-recovery-2
- tests/lifecycle.cjs，seed 57：{"choice":"late-recovery-0","action":"约一个可试行的短班","text":"你先谈好什么时候做得到、什么时候需要停下","delta":{"money":-150,"stress":-8,"health":5},"from":[38],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"late-recovery-0","action":"约一个可试行的短班","text":"你先谈好什么时候做得到、什么时候需要停下","delta":{"money":-150,"stress":-8},"from":[19,40],"opportunity":[],"echo":[{"id":"prototype","text":"旧版本启动得慢。第一个能正常走动的小人还在那里。","weight":15}],"items":[],"people":[],"job":"office","highlights":[]}

## life-42 · 42 / 45岁 · B · 公共兜底
- 声明 life-42-0：{"skill":5,"stress":3} 
- 声明 life-42-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 life-42-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-42-1、life-42-2
- tests/acceptance.cjs，seed 1：{"choice":"life-42-0","action":"记录变化","text":"你用旧纸记下为什么那条路后来变宽了","delta":{"skill":4,"money":300,"stress":2},"from":[2],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"life-42-0","action":"记录变化","text":"你用旧纸记下为什么那条路后来变宽了","delta":{"skill":4,"money":300,"stress":2},"from":[23,38],"opportunity":[],"echo":[{"person":"colleague","sourceSlot":23,"text":"同事小周发来一条问候，也提起你23岁时「第一份工牌」那件事。"}],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-42-0","action":"记录变化","text":"你用旧纸记下为什么那条路后来变宽了","delta":{"skill":4,"money":300,"stress":2},"from":[1],"opportunity":[],"echo":[{"person":"friend","sourceSlot":1,"text":"同学阿宁发来一条问候，也提起你6岁时「放学后等一等」那件事。"}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-42-0","action":"记录变化","text":"你用旧纸记下为什么那条路后来变宽了","delta":{"skill":4,"money":300,"stress":2},"from":[2],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「台灯接触不好」那件事。"}],"items":[],"people":[],"job":"office","highlights":[]}

## indie-feedback · 42 / 45岁 · A · rule(indie-echo)
- 声明 indie-feedback-0：{"social":4,"network":3,"mood":2} meet:player, exp:launch
- 声明 indie-feedback-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 indie-feedback-2：{"skill":5,"stress":3} wish:make
未采到正式提交的基础选项：indie-feedback-1、indie-feedback-2
- tests/acceptance.cjs，seed 1：{"choice":"indie-feedback-0","action":"把回信留给这份作品","text":"你记下玩家在哪一刻终于明白了规则","delta":{"social":3,"money":300,"stress":-1,"network":3},"from":[23],"opportunity":[],"echo":[{"person":"colleague","sourceSlot":23,"text":"同事小周发来一条问候，也提起你23岁时「第一份工牌」那件事。"}],"items":[],"people":["player"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-feedback-0","action":"把回信留给这份作品","text":"你记下玩家在哪一刻终于明白了规则","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[1],"opportunity":[],"echo":[{"person":"friend","sourceSlot":1,"text":"同学阿宁发来一条问候，也提起你6岁时「放学后等一等」那件事。"}],"items":[],"people":["player"],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-feedback-0","action":"把回信留给这份作品","text":"你记下玩家在哪一刻终于明白了规则","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[9],"opportunity":[],"echo":[{"person":"parent","sourceSlot":9,"text":"家人发来一条问候，也提起你15岁时「中考志愿单」那件事。"}],"items":[],"people":["player"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-feedback-0","action":"把回信留给这份作品","text":"你记下玩家在哪一刻终于明白了规则","delta":{"social":3,"money":300,"stress":-1,"mood":2,"network":3},"from":[1],"opportunity":[],"echo":[{"person":"friend","sourceSlot":1,"text":"同学阿宁发来一条问候，也提起你6岁时「放学后等一等」那件事。"}],"items":[],"people":["player"],"job":"office","highlights":[]}

## life-43 · 43 / 52岁 · A · 公共兜底
- 声明 life-43-0：{"mind":4,"stress":-6,"mood":4} meet:colleague
- 声明 life-43-1：{"skill":5,"stress":3} thread:indie
- 声明 life-43-2：{"social":4,"network":3,"mood":2} meet:friend
未采到正式提交的基础选项：life-43-1、life-43-2
- tests/acceptance.cjs，seed 1：{"choice":"life-43-0","action":"给工作减量","text":"你和同事重新对好交接","delta":{"mind":3,"stress":-6},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 57：{"choice":"life-43-0","action":"给工作减量","text":"你和同事重新对好交接 两次排班后，先前选的恢复安排渐渐稳定下来。已经付掉的账单和少掉的工时仍留在记录里。","delta":{"mind":3,"stress":-6},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-43-0","action":"给工作减量","text":"你和同事重新对好交接","delta":{"mind":3,"stress":-6,"mood":4},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-43-0","action":"给工作减量","text":"你和同事重新对好交接","delta":{"mind":3,"stress":-6,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-43-0","action":"给工作减量","text":"你和同事重新对好交接","delta":{"mind":3,"stress":-6,"mood":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":["colleague"],"job":"office","highlights":[]}

## early-diagnosis · 43 / 52岁 · A · rule(early)
- 声明 early-diagnosis-0：{"social":4,"network":3,"mood":2} early:contact
- 声明 early-diagnosis-1：{"skill":5,"stress":3} early:object
- 声明 early-diagnosis-2：{"mind":4,"stress":-6,"mood":4} early:quiet
未采到正式提交的基础选项：early-diagnosis-1、early-diagnosis-2
- tests/acceptance.cjs，seed 139：{"choice":"early-diagnosis-0","action":"告诉能联系到的人","text":"你说出了想要怎样度过接下来的日子","delta":{"social":3,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"early-diagnosis-0","action":"告诉能联系到的人","text":"你说出了想要怎样度过接下来的日子","delta":{"social":3,"mood":2,"network":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}

## life-44 · 44 / 58岁 · A · 公共兜底
- 声明 life-44-0：{"social":4,"network":3,"mood":2} exp:mentor, wish:pass
- 声明 life-44-1：{"skill":5,"stress":3} reopen:choose
- 声明 life-44-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-44-2
- tests/acceptance.cjs，seed 1：{"choice":"life-44-0","action":"带一个人做一遍","text":"对方学会后又解释给另一个人听","delta":{"social":4,"stress":-3,"network":3},"from":[19,2],"opportunity":[],"echo":[{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":21},{"id":"lamp","text":"灯下又摊开了一本新书。","weight":24}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-44-1","action":"重新拿出一件旧物","text":"你把它放在看得见的地方，补了一张日期签","delta":{"skill":5,"stress":3},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"错题本的边上还是那道折角。","weight":0}],"items":["notes"],"people":[],"job":"sanitation","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-44-0","action":"带一个人做一遍","text":"对方学会后又解释给另一个人听","delta":{"social":3,"mood":2,"network":3},"from":[19,2],"opportunity":[],"echo":[{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":11},{"id":"lamp","text":"灯下又摊开了一本新书。","weight":24}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-44-0","action":"带一个人做一遍","text":"对方学会后又解释给另一个人听","delta":{"social":3,"mood":2,"network":3},"from":[19],"opportunity":[],"echo":[{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":25}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-44-0","action":"带一个人做一遍","text":"对方学会后又解释给另一个人听","delta":{"social":4,"network":3},"from":[2,7],"opportunity":[],"echo":[{"id":"lamp","text":"灯下又摊开了一本新书。","weight":12},{"id":"notes","text":"错题本的边上还是那道折角。","weight":19}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-44-0","action":"带一个人做一遍","text":"对方学会后又解释给另一个人听","delta":{"social":4,"network":3},"from":[19,2],"opportunity":[],"echo":[{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":19},{"id":"lamp","text":"灯光照到白痕时，你认出了第一次修灯的位置。","weight":27}],"items":[],"people":[],"job":"office","highlights":[]}

## indie-second-launch · 44 / 58岁 · A · rule(late-release)
- 声明 indie-second-launch-0：{"skill":5,"stress":3} release:later
- 声明 indie-second-launch-1：{"knowledge":5,"stress":4} release:now
- 声明 indie-second-launch-2：{"mind":4,"stress":-6,"mood":4} release:stop
未采到正式提交的基础选项：indie-second-launch-1、indie-second-launch-2
- tests/shop.cjs，seed 1：{"choice":"indie-second-launch-0","action":"再打磨一下再提交","text":"你按试玩反馈重新调整了关卡开头 首周只有零星下载。一封手写反馈标出了最难懂的地方。 测试时卡住的那一关，这次有人一口气走完了。","delta":{"skill":5,"stress":3},"from":[33,35],"opportunity":[],"echo":[{"id":"lamp","text":"灯下又摊开了一本新书。","weight":9},{"id":"notes","text":"错题本的边上还是那道折角。","weight":27}],"items":[],"people":[],"job":"office","highlights":["published"]}

## early-goodbye · 44 / 58岁 · S · rule(early-next)
- 声明 early-goodbye-0：{"mind":4,"stress":-6,"mood":4} earlyEnd:note
- 声明 early-goodbye-1：{"family":5,"mood":2} earlyEnd:item
- 声明 early-goodbye-2：{"mind":4,"stress":-6,"mood":4} earlyEnd:quiet
未采到正式提交的基础选项：early-goodbye-1、early-goodbye-2
- tests/acceptance.cjs，seed 139：{"choice":"early-goodbye-0","action":"写下现在想到的话","text":"你在最后一行写上了日期","delta":{"mind":3,"stress":-9},"from":[2,19],"opportunity":[],"echo":[{"id":"lamp","text":"灯下又摊开了一本新书。","weight":8},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":28}],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"early-goodbye-0","action":"写下现在想到的话","text":"你在最后一行写上了日期","delta":{"mind":4,"stress":-6},"from":[19,7],"opportunity":[],"echo":[{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":18},{"id":"notes","text":"错题本的边上还是那道折角。","weight":23}],"items":[],"people":[],"job":"office","highlights":[]}

## life-45 · 45 / 64岁 · A · 公共兜底
- 声明 life-45-0：{"body":4,"health":2} 
- 声明 life-45-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 life-45-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：life-45-1、life-45-2
- tests/shop.cjs，seed 1：{"choice":"life-45-0","action":"看看熟悉的街区","text":"地图上认得出一处转弯，剩下的留给下一次","delta":{"body":4},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":3}],"items":[],"people":[],"job":"office","highlights":[]}

## office-45 · 45 / 64岁 · A · 职业 office
- 声明 office-45-0：{"skill":5,"stress":3} shine:office
- 声明 office-45-1：{"mind":4,"stress":-6,"mood":4} gain:badge
- 声明 office-45-2：{"social":4,"network":3,"mood":2} meet:colleague
未采到正式提交的基础选项：office-45-1、office-45-2
- tests/shop.cjs，seed 1：{"choice":"office-45-0","action":"补齐索引给后来的人","text":"半年后小周收到一张谢谢的便条","delta":{"skill":5,"stress":3},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":11}],"items":[],"people":[],"job":"office","highlights":["office"]}

## factory-45 · 45 / 64岁 · A · 职业 factory
- 声明 factory-45-0：{"social":4,"network":3,"mood":2} exp:mentor, shine:factory
- 声明 factory-45-1：{"skill":5,"stress":3} gain:tools
- 声明 factory-45-2：{"mind":4,"stress":-6,"mood":4} meet:colleague
未采到正式提交的基础选项：factory-45-1、factory-45-2
- tests/shop.cjs，seed 1：{"choice":"factory-45-0","action":"把方法演示给新人","text":"他跟着做完一遍，又主动重新检查了一次","delta":{"social":4,"network":3},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":27}],"items":[],"people":[],"job":"office","highlights":["factory"]}

## delivery-45 · 45 / 64岁 · A · 职业 delivery
- 声明 delivery-45-0：{"skill":5,"stress":3} gain:map, shine:delivery
- 声明 delivery-45-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 delivery-45-2：{"mind":4,"stress":-6,"mood":4} gain:gloves
未采到正式提交的基础选项：delivery-45-1、delivery-45-2
- tests/shop.cjs，seed 1：{"choice":"delivery-45-0","action":"在地图上补齐三处慢行点","text":"新人下一趟主动绕开了积雪","delta":{"skill":5,"stress":3},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":22}],"items":["map"],"people":[],"job":"office","highlights":["delivery"]}

## sanitation-45 · 45 / 64岁 · A · 职业 sanitation
- 声明 sanitation-45-0：{"skill":5,"stress":3} gain:map, shine:sanitation
- 声明 sanitation-45-1：{"social":4,"network":3,"mood":2} meet:colleague
- 声明 sanitation-45-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：sanitation-45-1、sanitation-45-2
- tests/lifecycle.cjs，seed 1：{"choice":"sanitation-45-0","action":"给新班组留一张路线图","text":"图贴上去的第二天，有人补了一个树荫点","delta":{"skill":5,"stress":3},"from":[2],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"}],"items":[],"people":[],"job":"sanitation","highlights":["sanitation"]}
- tests/shop.cjs，seed 1：{"choice":"sanitation-45-0","action":"给新班组留一张路线图","text":"图贴上去的第二天，有人补了一个树荫点","delta":{"skill":5,"stress":3},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":30}],"items":["map"],"people":[],"job":"office","highlights":["sanitation"]}

## arena-quiet · 45 / 64岁 · A · rule(esport-echo)
- 声明 arena-quiet-0：{"social":4,"network":3,"mood":2} meet:coach
- 声明 arena-quiet-1：{"mind":4,"stress":-6,"mood":4} 
- 声明 arena-quiet-2：{"skill":5,"stress":3} exp:mentor
未采到正式提交的基础选项：arena-quiet-1、arena-quiet-2
- tests/acceptance.cjs，seed 1：{"choice":"arena-quiet-0","action":"和旧队伍见一面","text":"大家聊了半小时各自在忙的事","delta":{"social":4,"network":3},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"错题本的边上还是那道折角。","weight":9}],"items":[],"people":["coach"],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"arena-quiet-0","action":"和旧队伍见一面","text":"大家聊了半小时各自在忙的事","delta":{"social":4,"network":3},"from":[2,19],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":28}],"items":[],"people":["coach"],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"arena-quiet-0","action":"和旧队伍见一面","text":"大家聊了半小时各自在忙的事","delta":{"social":4,"network":3},"from":[7],"opportunity":[],"echo":[{"id":"notes","text":"错题本的边上还是那道折角。","weight":13}],"items":[],"people":["coach"],"job":"office","highlights":[]}

## indie-memory · 45 / 64岁 · A · rule(indie-history)
- 声明 indie-memory-0：{"skill":5,"stress":3} reopen:prototype
- 声明 indie-memory-1：{"social":4,"network":3,"mood":2} meet:friend
- 声明 indie-memory-2：{"mind":4,"stress":-6,"mood":4} 
未采到正式提交的基础选项：indie-memory-1、indie-memory-2
- tests/acceptance.cjs，seed 1：{"choice":"indie-memory-0","action":"给最早的画面留张照片","text":"你把截图打印出来，背面写上当时的日期","delta":{"skill":5,"stress":3},"from":[19,23],"opportunity":[],"echo":[{"person":"colleague","sourceSlot":23,"text":"同事小周发来一条问候，也提起你23岁时「第一份工牌」那件事。"}],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"indie-memory-0","action":"给最早的画面留张照片","text":"你把截图打印出来，背面写上当时的日期","delta":{"skill":4,"stress":3},"from":[19,23],"opportunity":[],"echo":[{"person":"colleague","sourceSlot":23,"text":"同事小周发来一条问候，也提起你23岁时「第一份工牌」那件事。"}],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"indie-memory-0","action":"给最早的画面留张照片","text":"你把截图打印出来，背面写上当时的日期","delta":{"skill":4,"stress":3},"from":[19,23],"opportunity":[],"echo":[{"person":"colleague","sourceSlot":23,"text":"同事小周发来一条问候，也提起你23岁时「第一份工牌」那件事。"}],"items":["prototype"],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"indie-memory-0","action":"给最早的画面留张照片","text":"你把截图打印出来，背面写上当时的日期","delta":{"skill":5,"stress":3},"from":[19,2],"opportunity":[],"echo":[{"person":"parent","sourceSlot":2,"text":"家人发来一条问候，也提起你8岁时「把桌子让出一角」那件事。"},{"id":"prototype","text":"你把试玩版本夹在更近的一个文件夹中，后来一直没有删。","weight":0}],"items":["prototype"],"people":[],"job":"office","highlights":[]}

## life-46 · 46 / 72岁 · S · 公共兜底
- 声明 life-46-0：{"skill":5,"stress":3} ending:open
- 声明 life-46-1：{"mind":4,"stress":-6,"mood":4} ending:natural
- 声明 life-46-2：{"social":4,"network":3,"mood":2} ending:natural
未采到正式提交的基础选项：life-46-1、life-46-2
- tests/acceptance.cjs，seed 1：{"choice":"life-46-0","action":"继续手头这一件","text":"待办纸压在盒子下面，明天还能接着做","delta":{"skill":5},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/lifecycle.cjs，seed 1：{"choice":"life-46-0","action":"继续手头这一件","text":"待办纸压在盒子下面，明天还能接着做","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"sanitation","highlights":[]}
- tests/gift.cjs，seed 1：{"choice":"life-46-0","action":"继续手头这一件","text":"待办纸压在盒子下面，明天还能接着做","delta":{"skill":4,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/shop.cjs，seed 1：{"choice":"life-46-0","action":"继续手头这一件","text":"待办纸压在盒子下面，明天还能接着做","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
- tests/dinner.cjs，seed 9：{"choice":"life-46-0","action":"继续手头这一件","text":"待办纸压在盒子下面，明天还能接着做","delta":{"skill":5,"stress":3},"from":[],"opportunity":[],"echo":[],"items":[],"people":[],"job":"office","highlights":[]}
