# 测试、证据与复跑

开工基线为 acceptance、lifecycle、旧 Node 74 项与 P3-1 的 16 项，以及普通 Chrome、P2 和 P3-1 三套浏览器回归。基线均通过。最终版本重跑原 90 项，新增 P3-2 共 22 项，其中 18 项逐条走到终章并验证特有结果，另外 4 项集中验证负例。浏览器对这 18 条人生分别从正式首页重新出生，逐槽走正式 DOM 操作，不注入职业、学历或结果。

| 验收 | 实际证据 |
| --- | --- |
| 原引擎、童年、正常及合法提前终章、恢复、物件、人生树 | [acceptance](evidence/acceptance.log)、[lifecycle](evidence/lifecycle.log)、[90 项旧 Node](evidence/legacy-node.log) |
| 新路线的结果、资格、收入、房租、入档及失败事务 | [22 项 P3-2 Node](evidence/p32-node.log) |
| 320×568、360×640、390×844、430×932、1366×768，触摸、鼠标、键盘、拖放、刷新、减少动画和分支 | [原 Chrome](evidence/portrait.log) |
| 425 决赛与独游、474 岗位与旧试玩、465 排班与短班，45→46 延期，以及原 P2 的 86 个 S/A 场景、126 个短行动、144 次可见阅读 | [P2 日志](evidence/p2.log)、[逐场数据](evidence/p2/chrome.generated.json) |
| 既有多梦想并行、工资、暂停与重拾 | [P3-1 日志](evidence/p3.log)、[实际操作](evidence/p3/p3-chrome.json) |
| 六线实际 DOM 工作台、18 次新人生与终章，种子和出生身份逐条保存 | [Chrome 日志](evidence/chrome.log)、[分支索引](branch-witnesses.md)、[逐槽事实](causal-evidence.generated.json) |

负例包括拿错封签后不能跳过取餐；整班没有空档、停薪不能交生产记录；没有样单不能续写流转单；入住前不能有多年回望、搬迁后需要重新布置；未亲自出场不能认领邀请赛个人胜利。原 P3-1 继续检查整笔失败前后人生深比较、重复提交、确定性外因与分支隔离。

调试中曾发现三个具体问题。第一次办公室晚年样本在 35 岁主动转了调度，核对履历后改用留任选择验证长期交接。一次退租后维修的见证余额不足，保留拒绝逻辑，另从可负担的安排走通。证据脚本曾因嵌套引号无法启动，改为读取正式页面的完整人生后直接生成对象，并重新运行。首轮截图中工作台落在操作列表下面，调整位置后重拍。旧断言保留。

## 复跑

从仓库根目录运行，Chrome 使用独立临时配置。后两份旧回归证据显式输出到本阶段目录。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/continuity.cjs tests/gift.cjs tests/interaction.cjs tests/guidance.cjs tests/shop.cjs tests/dinner.cjs tests/dinner-fish.cjs tests/p2.cjs tests/p3.cjs tests/childhood/routes.cjs
node --test tests/p32.cjs
node tests/portrait-browser.cjs --p32
node tests/portrait-browser.cjs
LIFE_P2_EVIDENCE=docs/v1.4/p3/p3-2/evidence/p2 node tests/portrait-browser.cjs --p2
LIFE_P3_EVIDENCE=docs/v1.4/p3/p3-2/evidence/p3 node tests/portrait-browser.cjs --p3
node docs/v1.4/p3/p3-2/export.cjs
```

## 招生制度依据

北京考试院 2026 文件用于确定普通高考的毕业资格、报名地、在校／保留入学资格的排除条件和现场确认。北大 2026 招生简章与计算机学院的培养说明用于区分本科毕业资格、硕士考试及学习年限。本作只实现这些文件中一个有明确资格的考生情景，后续模拟年份继续按这一版本演算。[北京市 2026 年普通高等学校招生工作规定](https://www.bjeea.cn/html/gkgz/tzgg/2026/0505/88114.html) · [北大 2026 硕士招生简章](https://admission.pku.edu.cn/docs/20251009102223204061.pdf) · [计算机学院研究生培养说明](https://cs.pku.edu.cn/info/1172/1903.htm)
