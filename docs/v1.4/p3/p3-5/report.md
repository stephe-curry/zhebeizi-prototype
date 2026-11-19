# P3-5 多线人生整合

玩家现在可以在继续在职、减班追梦、明确谢绝本次机会之间取舍。十个梦想与八类普通职业的 80 个在职确立组合和六种出生身份的 60 个入口均通过引擎走测。另在正式页面完成 13 组同前缀三分叉，八种无梦职业都走到了终章。55 条 Chrome 人生共 2,528 个回合。

|发现及改动|落点与证据|
|---|---|
|闭店时原料、预付款、供应商应付与帮工尾薪缺少共同清算入口。现在每桌有独立回执编号，退款、履约、损耗、转让和二次开业都从已提交历史重算。|career-chapters.js、app.js；[金额与反例](economy-liquidation.md)|
|租金与订票可争用同一笔可用现金。在预检中保留当期租金；经营者签新工作前先交还食堂。|routes.js；房租、欠款与换岗原子拒绝用例|
|城南教务依赖在职身份，赴乡后校区也应参与校验。预检按最近一次实际聘任或调动识别当前校区；仍可查阅旧教案。|career-chapters.js、routes.js；城南新班与石桥在岗反例|
|普通职业第 30—40 槽缺少可决定的具体工作。增加副联核销、批次卡复核、施工期间配送及两项后续查档。|chapters.js；[逐槽菜单与实际选择](ordinary-life-coverage.generated.md)|
|撤回安排、明确谢绝、未曝光及跨槽失效需要区别。增加本次谢绝及已见延期事项逾期的记录。|routes.js、app.js、save.js；[机会、成本与年龄](opportunity-and-capacity.md)|
|回忆录的动作很难看出与前史的关系。现在用来源收据连接两次具体经历；无正式梦想也可翻到当年的工作。|app.js；[多梦想及终章样本](multi-dream-witnesses.md)|
|闭店结果缺少视觉反馈。增加分层 Aseprite 账本、回执和信封动画，确认结算后播放一次，支持静态末帧。|style.css、art/kitchen-closing.aseprite、assets/kitchen-closing.png、JSON 和 GIF 预览|

历史 Node 专项 239 项、新增 217 项，另有 acceptance 与 lifecycle 独立脚本。Chrome 回归涵盖普通竖屏、P2、P3-1、P3-2、P3-3、P3-4 和本阶段。[命令、截图与日志](tests-and-browser.md)

矩阵的进阶资格、身份冲突与资源风险按路线规则审计。80 个组合各自实测到了任职期间确立梦想；完整多线分叉使用 13 个代表情境。相同的单期工资可能对应不同作品与权限，未观察到差异的项目在对照表单独注明。[交汇矩阵](intersection-matrix.generated.md) · [分叉对照](branch-comparisons.md) · [原始页面事实](causal-evidence.generated.json)

本轮在原有 main 工作树继续开发，起点 HEAD 为 3ce57a24d6a3749ff4b821eeb4144b4d40587307。开始时已有未提交和未跟踪成果，记录见 evidence/start.log。新增 tests/p35.cjs，并扩展既有 Chrome 驱动及证据目录选项。未暂存、提交或推送。

验收边界包括仓库历史样本以外的玩家备份、实体设备和真人初见。本轮没有衡量趣味、实际游玩时长或 Safari 手感。后续验收入口见 [兼容范围](compatibility.md)、[体验审阅](experience-review.md) 与 [P3-6 执行合同](p3-6-handoff.md)。
