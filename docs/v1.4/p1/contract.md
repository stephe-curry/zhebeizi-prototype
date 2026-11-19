# v1.4 P1 人生留痕契约

## 保存与结算

`engine.js` 的 `prepare/schedule` 在原有优先级和随机输入上选卡，同时生成本回合的 `run.pageTrace`。其中列出本槽注册卡、资格判定、胜出者、规则名、窗口及可定位的来源。公共回退卡也在列表内。无特殊前因的公共卡可以没有来源。条件的实际阈值仍由 `engine.rule` 决定。

场景动作仍经过已有草稿和预览。`LifeContinuity.opportunity` 结合当前合法草稿派生 accepted，可以改选或撤回。只有 `E.commit` 将本槽候选、选择执行的命令、一般资金净变化、物件去向及来源收进本回合唯一的 `fact.trace`，随后移除 pageTrace。命令表示执行过对应规则；比赛获胜、项目发布等结果要查实得的 highlights。专款使用对应交互收据的 amount、spent、balance、custodian 或硬币分配余额；fundsDelta 只代表一般资金净变化。

新事实引用由 branch、slot、eventId、choiceId 定位。席间行动与复合交互保留 performed、observed、steps 等原收据。物件状态 display/stored 表示玩家持有；given 表示已经送出，具体受赠人需要独立的人物证据。discarded 无持有人。人物关系变化沿用 fact.relations；台灯和旧物回调要核对实际来源。任何日后只读查询都不发放奖励。

## 机会与窗口

|状态或字段|运行含义|
|---|---|
|ineligible|本回合检查过，资格不足。|
|eligible|当前合法候选已入选，缺少可见证据。|
|deferred|资格成立，但被另一张卡占用。|
|offered / seen|对应真实控件或事件标题已进入活动页面视口，或玩家直接操作了该控件。|
|accepted|当前合法草稿明确选择，存档恢复后从相同草稿重算。|
|resolved|该事件决定或动作已经结算；result 指向事实。scope 区分事件与其中的一项行动。|
|declined|已见互斥行动后选了别项，或对已见邀约明确退出。|
|expired|已呈现的时限安排，到窗口结束仍未落实。|
|invalidated|例如已赠送悠悠球，原先已成立的物件资格消失。|
|windowEnded / reason|未呈现的单槽候选关闭时保留 seen=false；没有主动拒绝记录。|

scope=event 表示本回合事件，scope=action 表示已装配进该页的动作。selected 只表示被装入，seen 才是视口或输入证据。引擎模拟可以完成决定，但没有浏览器曝光证据。决赛中选择退役会留下明确退出原因，不能推导出参赛或夺冠。

默认窗口为登记槽。未来卡可声明 opportunityWindow；pending 按槽和传入的实时资格函数筛选，resumeWindow 只能连接到当前真实存在的选项，保留原机会与来源引用，重复接线无效。本次没有给成年故事擅加补偿窗口。相关测试中的跨槽延期是接口夹具。

## 成长与回响

`evidence(run,kind)` 返回事实引用。purchase、observation、sports-practice、sideline-assist、project-work、teamwork、job-entry 分别读取交互收据、执行命令或真实职业变化。精确命令也可查询。`growth` 对不同回合去重，repeated 仅表示出现多次。`thread` 根据真实投入、会面、暂停、恢复、失效、改行、成果及终章生成线史。原有职业、经历、愿望、六维和方向数据继续承担原职责。

`echoes` 区分历史被读取、提示文字被看见、具体动作可见、参与，以及新结果引用。器材室可看见介绍而未看到额外选项；此时改选午休不会被计为拒绝该选项。普通结果页物件或人物回响只增加阅读证据，不能增加训练。视口阈值为 50%，导航离开、页面隐藏和模态框会停止观测。此信号表示屏幕展示，无法测量真人是否读懂。

## 兼容

存档键与外层版本沿用 v1.3.2；新增记录带 trace.schema=1。旧事实缺少的候选、曝光或来源保持未知。恢复旧回合时，仅能确认当前卡与现有可验证动作，不复算并冒充当年的竞争结果。已完成旧档保持原记录。分叉复制先前事实，后续决定在新分支记账。调度追踪、动画、视口与求助不进入历史随机哈希。
