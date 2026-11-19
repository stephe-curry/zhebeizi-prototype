# 共享机制缺口与最小增量

2026-11-19，基于当前工作树。状态“已实现”只针对该项子能力，不能代指十梦八职已完成。代码行号为本轮快照，函数名优先作为后续定位依据。

|项|状态|真实证据/代码|缺口与 P3-1 要求|
|---|---|---|---|
|真实经历记录|已实现|engine.js:660 `commit`、continuity.js `settle/ref/evidence`；fact.trace.commands/sources/fundsDelta|保持唯一事实权威；新动作使用来源引用，不从文案推断专业经历|
|从接触产生候选 A|部分实现|engine.js:572 `wishCandidate` 从选择命令或槽14/25/36/44直接返回admit/save/rest/pass；content.js:53 wishes 是6个生活心愿|没有10梦候选协议、独立候选列表；固定槽可以在无专属接触时给心愿。新增基于真实事实的只读 candidates；观看只能作接触，不能作训练|
|候选与确立分离、暂不选 A/B|部分实现|app.js:251 `wishPicker` 提供take/skip/pause；engine.js:675仅take提交|有主动操作，但目标是旧单心愿；新增10梦确立动作、来源事实、确立年龄；成年接触同样可候选；无来源不可确立|
|重复确立幂等 B|部分实现|engine.js:316 `updateWish` 对当前相同id/status return；E.commit防同槽重复|单wish幂等不等于每梦跨槽确立幂等；新协议重复不重复扣费、不重置首次年龄、不新增虚假训练；拒绝重复payload或安全no-op|
|多个已确立梦想 C|未实现|engine.js:282 wish:null；updateWish 将旧active写paused后覆盖run.wish；app.js:170显示一个心愿|新增基于facts派生的按routeId列表；确立07不暂停03；允许各自active/paused，不设任意数量上限|
|线程独立投入 C|部分实现|run.threads有school/esport/indie；continuity.thread 从命令、职业变化、高光投影|thread是经历史，entered不等于established；旧direction会被换职覆盖；新目标、投入与职业分别投影，同一来源去重|
|暂停与重拾 C|部分实现|commitCommand thread/pause、continuity.thread的paused/resumed；indie规则验paused，esport不验paused|不是所有梦通用；暂停保留资格作品但不自动积累；resumed重查当前年纪、资格有效期与人物/物件，不补失去的机会|
|职业真实事实 D|部分实现|changeJob/careerLog、fact.careerBefore/After；office/factory/delivery/sanitation/player/developer/dispatcher/retired|单一career可表示主要工作，不足兼职/失业/培训/休学；扩展有时间段的岗位安排，仍由career事实投影，保留旧日志/ID|
|薪资和安排 D|部分实现|engine.js:720 在career且<=42且非active低谷时+300；choice.delta、低谷生活费|已有钱和风险，尚无按职业/工作安排结算、请假扣薪、全职读医停止旧薪。新岗位支付策略明确替代旧+300，旧档旧卡保留原行为，不能两套都发|
|职业梦想并行 D|部分实现|电竞/独游与普通工作已有选择和日程，职业变更不清旧facts；P2 seed425|无新版多梦资源预算及专业同步；教师/程序员/医师/歌手/演员无完整身份链，必须增量开发|
|教师与25 D|未实现|C.jobs无teacher，C.threads无25；同桌讲题只为study/teamwork|职业资格/聘任与主动赴乡分开，同次课堂一条收据多方引用；P3-3先做资格基底，P3-4补完整J08|
|程序员与07 D|未实现|jobs.developer标“独立游戏制作人”，不是程序员；direction大厂只是方向|新增受雇programmer及雇主项目，保留developer；私人开源许可与公司成果分别归属|
|电竞职业与01 D|部分实现|arena-offer实际job:player，arena-retire改职；final写world|已有职业同步，不等于新版01主动确立；补晚试训/资格/训练，旧player/world不倒推主动梦想|
|医师/演艺职业 D|未实现|C.jobs不含外科医师/歌手/演员|资格+实际聘约/接约+工作场景同步career，愿望或高光单独不授职业/工资|
|时间与资源冲突 C/D|部分实现|energy=4/5/6；hotspot mainCost 2或3；followup耗1；dayPlan成本2格可加一项extra；家庭9/14/31/34|非hotspot预览used为0，不能外推全局时间；不以6精力允许无限活动。新增有版本的每槽时间预算与收费，保留旧卡成本，跨系统合并预检|
|同事实服务多方向 C|部分实现|单fact已有多commands/多个来源；evidence与growth按槽去重|缺route/action/成果域去重规则，单槽多动作会冲突；计数用(branch,slot,event,choice,actionId)，同成果共享只引用，资金/物件只入一次|
|命运检验 E|部分实现|hash(seed/historyKey/event/commands)，admit看knowledge+roll；final看steps/health/tactic/prep+roll；release看项目门槛，audience有hash|确定性基础可复用，未有通用资格/证据/可解释有界外因/attempt协议；录取过度依赖单属性；暂停和新教育资格不支持|
|不刷新重抽 E|已实现（旧行为）/新协议待验|hash与已提交historyKey稳定；活动随机用活动seed，刷新不使用Math.random发奖；原测试通过|新命运锁attemptId/规则版本/准备来源；UI观察/草稿重排不能形成新考次；真正下一届需新window|
|资格与成长|部分实现|growth只返回history与不同槽>=2；admission是结果；无正式degree/license注册表|不同投入可影响现有电竞结果，但非所有梦通用。学历/资格/有效期/执业范围/聘任分别有事实，属性不授证；声明资格不足原因|
|机会状态|已实现（既有范围）|continuity.plan/seen/opportunity/settle；eligible/offered/resolved等，seen只在视口或操作|新增窗口仍须沿用未见≠拒绝；不能将accepted落盘伪称resolved|
|机会延期|部分实现|pending/resumeWindow重检；engine.followups 槽46续indie-memory，content窗口[45,46]|除该真实内容外无通用任意跨槽重排；card.slot固定，扩window不令该卡自动在别槽出现。需合法承接变体/action，年龄跨度重检、硬截止明确取舍|
|存档/分支|部分实现|save.js outer version=2，trace.schema=1，decode不造历史；validateImport；fork恢复checkpoint，facts保留来源branch|新草稿/schema验证与迁移未有。旧wish不能自动映射正式梦；旧事实缺来源保留unknown；新投影可重建，不能另存可写route进度作为权威|
|人物/物件/终章|已实现基础，路线内容缺失|held/transitionItem、responses.legal/detailsAt、memoir读取真实facts、claimEnding|新人物知识时界、作品归属与多梦回忆录需接线，不能通过UI列表反推真实参加/成功|

## 最小扩展边界

沿用现有模块。content.js 增加目标/资格/活动声明（先少量真实接线，不批量空入口）；engine.js 增加统一草稿命令预检和结算适配；continuity.js 增加候选、梦想及资格/工作安排投影与证据查询；responses.js 接已有回响和专属动作来源；app.js 增加候选/已确立列表、暂停重拾与冲突预览；save.js 增量验证与旧草稿安全恢复。正式脚本载入顺序暂不变，不强制拆出十八个全局文件。

共享协议只负责来源、投入、资源、窗口、检验及保存。跨栏的步点/计时、代码的失败用例/review、医学的受监督任务、原创音乐的试听、演员的角色行动、厨师的火候、骑手的订单和公务员材料办理各有独立scene/action内容。共享协议不得把它们变成同一套“训练+1”。

facts 中拟新增的结构化动作收据是同一日志的扩展。run上的聚合若为渲染缓存，必须可从facts重建、不可独立编辑，遇到不一致丢弃重建。现有旧career/threads/highlights保留兼容，由旧commit逻辑继续生成；新资格与新成果必须有实际来源再进入这些投影，不把旧聚合无证升级成新专业事实。
