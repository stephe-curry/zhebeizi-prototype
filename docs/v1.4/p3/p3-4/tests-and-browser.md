# 实际测试记录

执行日期为2026-11-19。本机Node运行正式引擎，Chrome使用 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome，通过调试管道打开正式index.html。浏览器每段人生从首页开始，指定种子后通过DOM操作步骤、方法、确认与下一回合，未直接填写职业或成果到存档。

|检查|实测结果|证据|
|---|---|---|
|旧Node|acceptance与lifecycle通过；185个专题用例通过|evidence/regression-node.log|
|P3-4 Node|54个用例通过，其中15段人生、30个出生接触入口、9组资格和经济等专项|evidence/new-node.log|
|旧竖屏Chrome|手机尺寸、桌面、触摸、鼠标、键盘、减少动画、草稿与人生树|evidence/chrome-portrait.log|
|P2 Chrome|86个场景、126个回响及关键机会|evidence/chrome-p2.log|
|P3-1 Chrome|双梦想、容量、分支与恢复|evidence/chrome-p3.log|
|P3-2 Chrome|18段完整人生|evidence/chrome-p32.log|
|P3-3 Chrome|21段完整人生|evidence/chrome-p33.log|
|P3-4 Chrome|15段完整人生，五段普通人生无梦想|evidence/chrome-p34.log|

命令在项目根目录执行。旧浏览器证据使用LIFE_P2_EVIDENCE、LIFE_P3_EVIDENCE、LIFE_P32_EVIDENCE指向临时目录。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/{continuity,gift,interaction,guidance,shop,dinner,dinner-fish,p2,p3,p32,p33}.cjs tests/childhood/routes.cjs
node --test tests/p34.cjs
node tests/portrait-browser.cjs
node tests/portrait-browser.cjs --p2
node tests/portrait-browser.cjs --p3
node tests/portrait-browser.cjs --p32
node tests/portrait-browser.cjs --p33
node tests/portrait-browser.cjs --p34
node docs/v1.4/p3/p3-4/export.cjs
```

开发中发现教师重新求职不能重复使用首次聘任入口，增加有离岗及资格来源的returncity。退款最初只支持5元成交价，已改按原价计算正式现金成本。大厂竞争最初被准备量覆盖到必过，专项测试后改为明确有界竞争，资格仍是硬门槛。这些修正都重新运行对应用例。

浏览器证据主要通过DOM控件完成操作；实体手机Safari、真人首次理解和玩家趣味评价尚未测试。出生入口30项验证接触和准备机会，完整学历、笔面试及录用另由代表人生与反例验证。
