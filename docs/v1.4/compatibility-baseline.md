# 工作树与兼容基线

- pwd：/Users/stephen/Desktop/project/game/prototype/v1.3。main，HEAD 3ce57a24d6a3749ff4b821eeb4144b4d40587307，本地跟踪引用 origin/main 与 HEAD 一致；未联网核查。
- 开工时未暂存 app.js、content.js、engine.js、tests/gift.cjs、tests/portrait-browser.cjs。差异共233增、8删；器材室 echo 资格、提交与测试在这部分。无暂存、无未跟踪；tests/childhood/ 本次开工时干净。原文件与索引均保留。新增输出全部在 docs/v1.4/。
- 保留隔离实验 tests/childhood/index.html、play.html、routes.cjs、screens/ 及 tests/guidance.html、guidance-demo.js、guidance-fixture.js。tests/screens/gift 与 gift-story 是已有视觉样本，P0 未覆盖。
- 旧浏览器键 zhebeizi-1.3-workbench 与现行 zhebeizi-1.3.2-prototype 不同。保留现行格式标记与 version=2；无 spring-gift 标记的老人生保留水壶和台灯卡。未完成旧悠悠球交互可在本回合重开，已完成八岁沿用旧收据。旧饭桌会剔除不再合法的修灯草稿，合法其他动作仍可完成。不得重写已提交事实。
- 保留13岁样本：新旧格式买/留收据，原物件去向与来源、未参加、来源损坏、礼金与10岁两元独立、刷新、重复结算。六岁三个旧保管 ID 与八岁 buy/keep 不改名；旧 life-2-0 不能单凭选项 ID 或持灯推定修灯。新饭桌与29槽旧活动分别保护。
- 自动化均在本机独立进程运行。Chrome 由脚本创建临时 profile；没有读取真实用户存档，也没有设置写截图的环境变量。

|实际命令（仓库根）|结果|
|---|---|
|node tests/acceptance.cjs|退出0，101卡、四个普通岗位、三个历史高光、分支、自然和提前谢幕、刷题恢复|
|node tests/lifecycle.cjs|退出0，帧动画／减少动画、准备／机会／低谷／旧物／人际／回忆录、额外日程和搬家|
|node --test tests/interaction.cjs tests/guidance.cjs tests/shop.cjs tests/dinner.cjs tests/dinner-fish.cjs tests/gift.cjs tests/childhood/routes.cjs|分别6、3、10、9、8、13、2，合计51通过，0失败、0跳过|
|node tests/portrait-browser.cjs|退出0；320×568等移动视口、桌面竖屏、触控、键盘、刷新、饭桌／小卖部／器材室、减少动画及归档|
|git diff --check|通过|

两个无 TAP 编号的 Node 脚本与浏览器脚本各按脚本报告，不与51个 TAP 子测试混成“53项”。无失败日志或无法启动的脚本。测试夹具中有强制设置 eventId 的情况；不要用逐卡可提交代替合法到达。单独的自然调度采样见 scheduler-samples.md。

## 可复现方式

在仓库根运行 node docs/v1.4/export.cjs EMPTY_DIRECTORY 和 node docs/v1.4/reach.cjs EMPTY_DIRECTORY（指向已有空目录）。前者读取真实配置，在独立测试进程中旁听成功的 commit；后者在隔离 JS 环境给原调度器增加只读观察点，走完480个种子。输出采用独占创建，避免覆盖报告。没有浏览器画面可见性日志时只记录规则采样；不从文本猜测玩家确实看到了邀请。
