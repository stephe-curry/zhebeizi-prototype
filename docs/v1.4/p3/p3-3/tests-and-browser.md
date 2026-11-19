# 实际执行与验收边界

运行位置为项目根目录。Chrome 使用本机 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome，经调试管道打开正式 index.html。每段新的浏览器人生清空本次测试配置的本地存档，从首页生成指定种子，再通过页面控件操作、提交和推进。

|套件|结果与日志|
|---|---|
|旧引擎|acceptance 与 lifecycle 独立通过。其余 112 个 node:test 用例通过。[旧 Node 日志](evidence/regression-node.log)|
|新引擎|73 个用例通过，其中 21 段完整人生、42 个出生入口、10 项专项反例与交汇测试。一个用例可含多个断言；这里按测试用例计数。[新 Node 日志](evidence/new-node.log)|
|原竖屏 Chrome|覆盖 320×568、360×640、390×844、430×932、1366×768 的尺寸基线，以及触摸、鼠标、键盘、草稿恢复与合法提前终章。[竖屏日志](evidence/regression-portrait.log)|
|旧阶段 Chrome|P2 检查 86 个重点场景和 126 个可玩回响。P3-1 走 46 槽双梦想与分支；P3-2 走完 18 段人生。[P2](evidence/regression-p2.log) · [P3-1](evidence/regression-p3.log) · [P3-2](evidence/regression-p32.log)|
|P3-3 Chrome|21 段人生共 964 个正式回合，20 段到第 46 槽，1 段在第 44 槽进入提前终章。每条见证有截图，首栏场景另测刷新后草稿和系统减少动画。[新 Chrome 日志](evidence/new-chrome.log) · [逐局选择](branch-witnesses.md)|

执行命令如下。旧 Chrome 阶段的证据输出在运行时重定向到临时目录，以保护原阶段的历史截图。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/{continuity,gift,interaction,guidance,shop,dinner,dinner-fish,p2,p3,p32}.cjs tests/childhood/routes.cjs
node --test tests/p33.cjs
node tests/portrait-browser.cjs
node tests/portrait-browser.cjs --p2
node tests/portrait-browser.cjs --p3
node tests/portrait-browser.cjs --p32
node tests/portrait-browser.cjs --p33
node docs/v1.4/p3/p3-3/export.cjs
```

自动化能确认按钮可达、步骤反馈、提交、工资、实际结局及历史重放。文件导入验证直接调用正式校验器。新路线主要使用 DOM 控件操作，旧竖屏套件另外发送真实浏览器输入事件。本轮没有进行实体手机 Safari、真人初次理解或玩家满意度测试。
