# 《这辈子》v1.4 P1 工程验收记录

## 交付范围

在现有工作区叠加人生留痕机制。分支 main，起点 3ce57a24d6a3749ff4b821eeb4144b4d40587307。开工前 app.js、content.js、engine.js、tests/gift.cjs、tests/portrait-browser.cjs 已有开发修改，docs/v1.4 已有未跟踪的 P0 成果。Git 对 HEAD 的总差异同时包含这些改动。

- continuity.js、engine.js、save.js 实现调度候选、结算来源、实际呈现、成长与回响查询，以及存档兼容。index.html 和 tests/guidance.html 显式装入模块。
- app.js 在正式游戏观察真实呈现，保存到当前分支；页面隐藏和弹窗期间不累计。修正内容与晚年回忆中缺少共同经历依据的表述，保留原事件和历史选择。
- style.css、art/echo-play.aseprite、assets/echo-play.png 为两种实际参与结果提供收势反馈。Aseprite 原稿为 20×20、每种动作六帧，采用不同的起势、运动和收势时长。静态减动帧和结果文字均可独立使用。
- tests/continuity.cjs、tests/gift.cjs、tests/portrait-browser.cjs 覆盖新合同。docs/v1.4 下的 export.cjs、reach.cjs 从当前配置和真实运行重复生成本目录的数据。

## 竞争与覆盖

|种子、槽|实际入选|主要落选候选|实际证据|
|---|---|---|---|
|425、39|arena-final|indie-launch|竞技职业来自槽 23；独游项目来自槽 33。该规则采样最终选择退役。项目窗口结束，玩家从未看到发布机会。|
|474、45|arena-quiet|office-45、indie-memory|职业交接可追到槽 40，独游旧物可追到槽 33；旧队伍回访优先。两个落选机会均未曝光。|

公共回退卡另记。完整资格、逐条来源及终态见 opportunities.generated.json。两个种子保留原来的胜出者，没有自动增加一轮或补发成果。480 条自然路线出现 287 种已提交选择，475 条满 46 槽，5 条提前谢幕。自然命中 96/101 张；life-24、life-27、life-32、life-36、late-recovery 未入选。只有 late-recovery 在这批样本中一次也未满足资格。规则测试与定点夹具合计在 101 张卡上取得过正式结算。样本覆盖和体验质量应分别验收。

## 重现

在项目根目录运行以下命令。浏览器脚本创建专用的临时 Chrome 用户配置。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/continuity.cjs tests/gift.cjs tests/interaction.cjs tests/guidance.cjs tests/shop.cjs tests/dinner.cjs tests/dinner-fish.cjs tests/childhood/routes.cjs
node tests/portrait-browser.cjs
node docs/v1.4/export.cjs docs/v1.4/p1
node docs/v1.4/reach.cjs docs/v1.4/p1
```

Node 基础和生命周期两个脚本通过。子测试 60 项通过，0 失败，0 跳过。Chrome 从正式主页新生，操作压岁钱与悠悠球，通过小卖部、最后一块鱼和普通日程进入十三岁。验证买球与留钱的两种参与结果，以及看见邀请后选择普通行动；刷新后的分支仍有相同收据、来源和机会终态。竖屏还覆盖输入、减少动画、旧饭桌、分支对话框和提前谢幕。运行文本见 chrome-results.txt。screens/ 保留两张 320×568 参与结果截图。视觉检查能确认画面显示；玩家能否感受到跨年联系仍需要真人评价。

causal-ledger.generated.md 包含声明和测试提交，部分夹具按指定情境运行；observed-links.generated.md 列出正式来源回合的实际读取；scheduler-samples.md 只统计从开局逐槽推进的隔离模拟。测试使用的未来延期窗口没有正式剧情。覆盖详情包含未达资格、进入候选、入选、实际曝光等计数。无浏览器的自然路线不贡献曝光。

## P2 内容接入顺序

1. 给第 39 槽的竞技决赛和发布、第 45 槽的旧队伍和职业交接分别确定年龄窗口、延期时仍需具备的物件／人物条件、不可延期时的自然收束。用本次两个种子的正常路线做前后对照，确认补偿没有多发奖励。
2. 从已有 S/A 决定优先连接一条可见后果。器材室的真实练习可提供下次尝试的资格；购买本身只能提供物件。岗位交接应让具体同事使用以前真实完成的东西。每条都保留可主动放下及无该经历的对照人生。
3. 四梦想、三职业按产品范围逐个验收。现有 school-degree 读学习步数；direction 也能由一次选择或换岗写入。二者单独使用都不能证明具体录取、长期方向或专项资质。奥运选拔、经营履约与安家的多年兑现仍需正式内容；现有电竞冠军与独游发布继续保留各自语义。
4. 对五张未自然入选的卡分别查公共回退优先级、职业覆盖或恢复资格，先取得合法路径或记录合理不可达原因，再决定是否调整调度。P1 没有改变这些牌的入选概率。
