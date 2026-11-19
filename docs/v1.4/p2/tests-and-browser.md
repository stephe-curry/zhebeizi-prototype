# 工程复验与正式 Chrome 走测

2026-11-19，在项目根目录使用本机 Node 与 Google Chrome。验收、生命周期两个独立脚本均通过；Node 子测试 **74 通过、0 失败、0 跳过**，其中 14 项为 P2 专项。改造前同一套原有专项为 60 通过、0 失败。原 Chrome 回归和新增 P2 走测都真实运行，使用专用临时浏览器配置。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/continuity.cjs tests/gift.cjs tests/interaction.cjs tests/guidance.cjs tests/shop.cjs tests/dinner.cjs tests/dinner-fish.cjs tests/p2.cjs tests/childhood/routes.cjs
node tests/portrait-browser.cjs
node tests/portrait-browser.cjs --p2
node docs/v1.4/export.cjs docs/v1.4/p2
node docs/v1.4/reach.cjs docs/v1.4/p2
node docs/v1.4/p2-export.cjs
```

## 玩家从首页走过的路线

- **种子 1，6 至 72 岁。** 从正式 `index.html` 新生，经历红包、悠悠球、小卖部、最后一块鱼、十三岁。第 14 槽选实训，第 15 槽进实训楼认工位。第 23 槽入办公室，第 24 槽在报销单圈出成本中心。第 36 槽受岗位损失，38 槽选择自己承担账单，40 槽换到调度，41 槽再参加岗位培训。64 岁打开旧项目场景，72 岁写信，进入普通回忆录，再从人生树分支回去另作选择。断言父人生仍有原回忆录，子人生新事实记在子分支。
- **种子 425。** 从正常决策生成的第 39 槽前缀恢复，实际点击换约，分别试过立即交版、修整后发布、在原赛场退役。只有修整后发布的这条得到发行高光。[现场](screens/collision-425.png)
- **种子 474 和 473。** 实际前缀进入第 45 槽，分别选办公室、制造交接。下一槽选择打开旧文件，在草稿中刷新，验证所选动作和静态减动帧，再确认并进回忆录。两条各有职业交接事实与一张截图。[三件旧事相遇](screens/collision-474.png) · [制造交接](screens/collision-473.png) · [72 岁的旧试玩](screens/old-build-at-72.png)
- **种子 465。** 在站点先谈排班与短班之间改选，实际提交 `delivery-37-0`。平安出勤的事实没有新增停工恢复经历。[站点班次](screens/collision-465.png)

## 按场景回放

同一批代码另在真实 Chrome 中恢复各自合法的入场存档，逐一提交 86 张 S/A 卡，另实际提交 126 种带来源的短行动。144 个 A 级前情细节分别滚动到真实视口，等待可见记录后再提交。校验动作读取的来源槽、最终事实和结果。日常控件复演通过真实 DOM 事件，命名路线的换约、刷新及分支另有浏览器输入操作。取样不要求把互斥选择塞在同一生中。[原始浏览器记录](chrome.generated.json)

|检查面|实际覆盖|
|---|---|
|童年、历史兼容|压岁钱三种保管处、买球和留钱、十三岁参与或休息、小卖部硬币、旧饭桌及新版最后一块鱼、旧开局、真假修灯与旧存档继续。|
|结果和保存|可撤回草稿、刷新继续、重复确认单次入账、旧物打包及持有人、末页和提前谢幕、分支奖励及随机复现。只观察页面、提示或播放动画不会形成一次正式决定。|
|屏幕和输入|320×568、360×640、390×844、430×932 及桌面 1366×768。覆盖竖屏、滚动、鼠标、模拟触屏、键盘、拖动和减少动画。P2 走测检查脚本异常与远程请求均为空。|
|职业像素反馈|三种岗位都先试错，再核对正确位置，检查结果画面。`appointment-stamp` 有 9 帧，`shift-desk` 有 3 段各 7 帧。核对 32×32 未裁切帧、标签边界、不同帧时长以及减动静态画面。[单据](screens/checked-office-24.png) · [工具](screens/checked-factory-24.png) · [路线](screens/checked-delivery-24.png)|

## 覆盖口径

480 路使用固定默认选法，实际结果为 476 条到 46 槽、4 条合法提前结束、97 张不同卡。另从相同种子集出发，通过日程改约走到全部 101 张。逐选项复演有 318 种实际结算，含旧版兼容操作。报表只将运行中实际取得的收据计入。模型没有屏幕，模型里的“装入页面”不会增加 Chrome 曝光数。[调度样本](scheduler-samples.md) · [逐卡见证](event-coverage.generated.md) · [短行动及终章](redemption.generated.md)

首次在沙箱内启动系统 Chrome 未成功，随后使用本机 Chrome 重新完成两套验收。这里的触屏是 Chrome 模拟输入，尚无实体手机 Safari 或真人盲测结果。自动走测可确认动作能完成、物件有去向与反馈可见；动机是否一眼可懂、分支值不值得重玩，仍待真人评价。[逐场体验审阅](experience-review.md)
