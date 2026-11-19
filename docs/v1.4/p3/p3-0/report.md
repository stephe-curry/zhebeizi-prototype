# 《这辈子》v1.4 P3-0 审计与施工规划报告

日期：2026-11-19（Asia/Shanghai）。交付状态：**P3-0审计与规划已完成；P3共享增量及十八条完整路线尚未实现。** 本阶段只新增本目录报告、只读导出与证据，未修改正式游戏行为、未暂存/提交/推送。

## 一、仓库与真实基线

仓库：`/Users/stephen/Desktop/project/game/prototype/v1.3`。分支`main`，HEAD `3ce57a24d6a3749ff4b821eeb4144b4d40587307`。开工暂存区为空，正式源码、测试、P0–P2文档/素材已有大量未提交成果，本轮保留。开工完整状态见[evidence/git-before.txt](evidence/git-before.txt)，原有文件内容前后哈希比较见[evidence/protection-check.json](evidence/protection-check.json)。本轮新增文件均在`docs/v1.4/p3/p3-0/`，不把原有10个已跟踪文件的711增/66删归为本轮开发。

开工已跟踪未暂存：app.js、content.js、engine.js、index.html、save.js、style.css、tests/acceptance.cjs、tests/gift.cjs、tests/guidance.html、tests/portrait-browser.cjs。未跟踪含continuity.js、responses.js、docs/、P2测试与日程/职业动画源文件/导出；详细名单见状态附件。未发现适用AGENTS.md。无reset/clean/stash/add/commit/push操作。

正式入口为index.html，加载content/interaction/guidance/save/continuity/responses/engine/sprite-data/scenes/audio/shop/dinner/gift/app。app负责出生、场景草稿、视口曝光、persist、人生树；engine负责create/prepare/schedule/currentCard/preview/canApply/commit/advance/fork/memoir/claimEnding；continuity与responses负责事实来源、证据、机会/回响；save是外层v2与旧草稿兼容；interaction及gift/shop/dinner是实际对象交互，scenes/assets/art为表现资源。主要测试为acceptance、lifecycle、九组专项与portrait-browser/--p2，P2可达路径由p2-paths/p2-evidence生成。

P0交付真实存在：docs/v1.4/p0-audit-report.md、兼容/职业梦想审计及导出清单；P1 report/contract及候选/成长/曝光基底；P2 report、逐卡兑现、竞争/修复/体验及浏览器记录均存在。P2报告仍基于旧三项修订版的“四梦三职”，仅作工程历史；这不是当前产品范围。

### 最新产品依据与读取结果

已定位并读取仓库相邻`../v1.4/`的：

- `这辈子_游戏产品文档_v1.4_梦想职业统一完成版.md`（691行）；
- `这辈子_v1.4_完整原型开发执行书_梦想职业统一完成版.md`（225行）。

已读取指定的P1 report/contract；P2 report、p3-handoff、event-coverage.generated、redemption.generated、opportunity-collisions、content-fixes、experience-review、tests-and-browser，并对照当前事件/规则与实际verify见证。来源路径、大小和SHA256附[read-manifest.generated.json](read-manifest.generated.json)。指定资料无缺失。未修改原始v1.3.1或相邻产品资料。

最新决议优先：10梦+8职同质完成；从生活接触产生候选→玩家主动确立→多梦可并行；职业是实际谋生/履职，不能替代梦想目标；普通人生、旧人旧物、家庭和未竟继续生活同样完整。旧“四梦三职/L2-L3”不再作为制作等级。

### 本轮实际命令和结果

|命令|结果|证据/口径|
|---|---|---|
|`node tests/acceptance.cjs`|通过|[日志](evidence/p30-acceptance.log)；输出中的four jobs/three dreams描述旧覆盖，不是新10/8覆盖|
|`node tests/lifecycle.cjs`|通过|[日志](evidence/p30-lifecycle.log)；日程第二行动、草稿恢复、物件、机会与随机|
|`node --test tests/continuity.cjs tests/gift.cjs tests/interaction.cjs tests/guidance.cjs tests/shop.cjs tests/dinner.cjs tests/dinner-fish.cjs tests/p2.cjs tests/childhood/routes.cjs`|74通过，0失败，0跳过|[完整TAP](evidence/p30-node.log)，含P2的425/474等专项|
|`node tests/portrait-browser.cjs`|首次沙箱启动失败SIGABRT；使用专用临时Chrome配置重跑通过|[启动失败](evidence/p30-chrome.log)与[通过日志](evidence/p30-chrome-retry.log)；没有为通过修改测试|
|`node tests/portrait-browser.cjs --p2`|通过|为保护原P2报告与截图，在`/tmp/p30-browser-workspace`相同源码副本执行原命令（测试硬编码输出p2）；[通过日志](evidence/p30-chrome-p2.log)、[源码一致性](evidence/browser-copy-source-match.json)、[新原始浏览器记录](evidence/chrome-p2.generated.json)|
|`node docs/v1.4/p3/p3-0/export.cjs`|通过|[日志](evidence/p30-export.log)，调用原verify/prefixes并重跑480种子，不写旧P2导出|

Chrome原回归验证320/360/390/430竖屏及桌面、鼠标/模拟触摸/键盘/拖动、刷新/减动/终章/分支。P2专项重新实跑86张S/A、126项短回响、144项可见情境读取，并含普通全人生、恢复、425/474/473/465等路径。测试输出和Chrome收据证明可执行/可见，不证明首次玩家喜欢、全部18路线已成或实体手机Safari通过。本轮无真人盲测。

### 数字复核

|指标|P2历史报告|当前重算|差异|
|---|---|---|---|
|固定槽/注册卡/基础选择|46 / 101 / 306|46 / 101 / 306|无|
|动态/兼容主选择ID|318|318|无|
|S/A/B|15 / 71 / 15|15 / 71 / 15|无|
|S实际选择/可玩后续/合法终章|56 / 50 / 6|56 / 50 / 6|无|
|480默认策略满程/提前|476 / 4|476 / 4|无|
|默认自然事件/主选择|97 / 292|97 / 292|无；含合法改约的前缀仍达101卡|
|Node子测试|74通过|74通过|无|

本轮未发现旧机制回归。基线复核基于当前工作树，不把Git HEAD当作P2已提交快照，也没有修改断言凑历史数字。

## 二、机制结论

**尚未支持新版“主动确立多个梦想”。** 现有run.wish只保存一个当前生活心愿，updateWish在切换时暂停旧心愿；wishCandidate有固定槽回退且不是十条目标。LifeContinuity.thread是事实经历的投影，不能当玩家主动确立。已有school/esport/indie多线程不等于十梦独立确立、成年候选、暂停重拾和共享资源合同。

可复用：同一E.commit、facts.trace来源/资金/命令、机会曝光与终态、evidence/growth、人物物件归属、P2改约/短回响、少量真实跨槽窗口、旧档/分支及确定性hash。需增加：接触驱动候选、明确多目标动作/投影、专业证据与资格、时间/薪资/兼职离岗、统一检验attempt/规则版本和合法承接，保持事实单源。[逐项状态与代码](mechanism-gap.md)。

职业教师/乡村教师与程序员/开源均无完整现成实体；旧developer是独游制作人，不能改名当程序员。电竞已有职业短约/成绩/退役，但需要新主动目标与成年训练；医生/歌手/演员需要真实资格/聘约和工作同步，不能只有梦想荣誉。

## 三、46回合容量结论

十八条路线作为同一游戏的可选内容池可在固定46槽内规划；**当前系统不能直接兑现全部内容或可靠多梦资源竞争**。现有每槽一主卡、至多一短回响，部分dayPlan可加次级行动；主菜单改约局限特定槽，单扩大窗口并不会让卡跨槽出现。必须做小范围共享扩展与各路线专属操作，再用真实内容实测容量，不需新第47槽。

规划用有成本的主事/余段/重活动、合法预约与跨槽承接；多梦可跨阶段接力或共享同一课堂/作品来源，收益不重复。单梦+职业大多需新窗口/操作，多梦组合还须时间/财务取舍；全日学业/全职竞技/拍摄/跨国旅行不能与满班工作全部免费兼得。硬截止只能主动取舍，失去某届仍有生活或合法下次窗口。[46槽自动地图](slot-capacity.generated.md) · [十三情境压力表](opportunity-pressure.md)。

特别保护5/6槽均13岁、6体育器材室；39/35岁决赛与独游；45/64岁赴约与46/72岁旧文件续接。延期八年只对文件等可保存对象合法，不能套给当日赛事/见面。新线不替换P2已兑现内容。

## 四、十八条路线规划

[完整合同](route-contracts.md)含10×20字段与8×15字段，另有[结构化规划](route-plan.json)，严格标为待开发。十梦覆盖01电竞、02奥运、03清北、07开源、08外科、11原创歌手、12演员、25乡村教师、29安家、30环游；八职J01办公室、J02制造、J03外卖、J04小微经营、J05程序员、J06公务员、J07厨师、J08教师。

每梦具体列接触/确立、资格、专属操作、持续投入与阶段成果、命运检验、资源、直/弯/重拾/错失、达成/未竟生活、旧人旧物及测试；每职列入行、任务/成果/收入/关系、风险、继续/改行、资源交汇与长期人生。代码已有只计资产，不能以规划文字冒充完成。

六身份×十梦入口矩阵见[origin-access.md](origin-access.md)：六身份均已实测电竞接触、错题、看房三个片段；其余接触/专业发展和全部正式梦想候选待做。公共器材/机房/公开咨询+有来源助学/储蓄保证入口可制作，不让家境自动决定荣誉。

## 五、关键风险

1. 单心愿/方向/职业聚合被误当多梦事实；必须以facts新动作投影，不建第二事实权威。
2. 工资旧+300与新职业收入重复、全日求学/离岗仍领满薪、同课多梦双收益；需要单支付来源与原子预检。
3. 年龄跳跃、学历学制、专业资格、招录公告/竞技赛历/演艺奖项/跨国证件有版本限制；本轮官方可读/失败/待核验分开记录于[professional-rules.md](professional-rules.md)。不能给未知法规编数字。
4. 新规则注册顺序挤掉P2回响、家庭、风险/恢复、普通人生；必须菜单明示/合法延期/硬窗取舍，并回归425/474/465。
5. 旧wish/indie/环卫等历史误迁移或擅自删入口；保留旧事实和旧语义，未证实不回填专业资格/主动梦想。
6. 晚年窗口拥挤、内容过密与30–50分钟目标未被真人确认；通过具体动作与少量余段控制，不用18套模板或免费无限行动解决。

## 六、全阶段施工

详见[p3-master-plan.md](p3-master-plan.md)：P3-1先共享多梦/资源/规则/兼容；P3-2补01/03/29/J01–03；P3-3完整七梦并提前接必要J05/J08及梦想职业基底；P3-4完整J04–08；P3-5交汇/成年求学/换职重拾/普通人生与回忆录；P3-6全量内部验收。至少30类梦想路径+24类职业路径（可合法重叠但逐线索引）、60出生接触组合、原机制与全新S/A浏览器见证；任何一条缺失不宣布P3完成。

## 七、P3-1直接开发要求

按[p3-1-contract.md](p3-1-contract.md)修改现有模块，新增结构化动作收据、只读candidates/dreams/qualifications投影与草稿接口；统一预检时间/精力/资金/工资/资格与命运attempt，再一次commit。使用两条真实纵向接线证明机制，无内容目标不放空按钮。完成M01–M12并保留全部旧回归，输出真实接口、存档/分支/收入反例、Node及Chrome证据。

## 八、尚未实现/无法证实

十八条完整路线尚未制作；新共享能力、预算、薪资策略与新版命运协议尚未编码。提议的窗口与旅行范围不是已发生事件；当前不能声称所有新梦可达、每出生都能取得最高荣誉、多梦平衡已通过或全局节奏已验证。具体制度/学校/地区/赛届与作品奖项仍有待核验项，见专业规则表；真实操作资产与素材需求见逐线合同。实体手机Safari、真人首次理解/喜好与整局时长没有本轮结果。

本轮没有被技术问题阻塞而漏交的核心文档；上述未实现内容是P3-1至6的明确开发工作，不是P3-0漏做。下一阶段可以直接依据合同编码，本次在P3-0结束。
