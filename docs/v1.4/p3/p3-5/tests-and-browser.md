# 复验命令与证据

在 v1.3 根目录运行。项目使用本地 Node 和 Chrome；测试从正式 index.html 打开。各 Chrome 套件顺序执行，避免同机多份无头浏览器争用窗口或调试管道。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/{continuity,gift,interaction,guidance,shop,dinner,dinner-fish,p2,p3,p32,p33,p34}.cjs tests/childhood/routes.cjs
node --test tests/p35.cjs
```

前两项为独立断言脚本。第三项基线及最终均为 239 项通过；第四项为 217 项通过。新测试含 55 条人生、13 组分叉前缀、60 个出生入口、80 个任职期间确立目标的组合，以及 9 项专门反例和守恒断言。日志在 evidence/baseline.log、evidence/final-node.log、evidence/new-node.log。

```sh
out=$(mktemp -d)
mkdir -p "$out"/{p2/screens,p3,p32/evidence,p33/evidence,p34/evidence}
export LIFE_P2_EVIDENCE="$out/p2" LIFE_P3_EVIDENCE="$out/p3"
export LIFE_P32_EVIDENCE="$out/p32/evidence" LIFE_P33_EVIDENCE="$out/p33/evidence"
export LIFE_P34_EVIDENCE="$out/p34/evidence"
node tests/portrait-browser.cjs --p35
node tests/portrait-browser.cjs --p34
node tests/portrait-browser.cjs --p33
node tests/portrait-browser.cjs --p32
node tests/portrait-browser.cjs --p3
node tests/portrait-browser.cjs --p2
node tests/portrait-browser.cjs
node docs/v1.4/p3/p3-5/export.cjs
```

|页面验收|证据|
|---|---|
|55 条新人生，2,528 个已提交回合；54 条至 46 槽，1 条在 44 槽合法提前谢幕|evidence/chrome-p35.log 和 causal-evidence.generated.json|
|P3-4 的 15 条职业人生、P3-3 的 21 条梦想人生、P3-2 的 18 条人生|evidence/chrome-p34.log、chrome-p33.log、chrome-p32.log|
|双梦、刷新草稿、分支隔离与减少动态效果|evidence/chrome-p3.log|
|86 个 S/A 场景、126 项可玩承接、144 次可见读数及特定冲突种子|evidence/chrome-p2.log|
|320×568 等手机模拟视口、桌面、触摸与键盘、拖动、提前谢幕|evidence/chrome-portrait.log|

13 组共 39 条人生分别复用本组同一份正式备份。A 通过设置页导出 JSON，测试捕获下载内容；B 和 C 通过文件输入控件导入相同字节。该回合的菜单、三种选择、现金、工资、来源和后续操作均可查。C 在工作台使用「这次明确谢绝」后完成主事。人生树真正创建子分支另由 P3-1 页面回归验证。

测试中曾遇到设置弹窗尚未完成渲染就导出，以及触摸谢绝后立即提交的时序问题。驱动现在等待弹窗和存档锁。多套 Chrome 同时运行曾出现调试管道超时，顺序执行后重验。竖屏引导回归还遇到虚拟时间推进未稳定触发第二级提示的问题，改为观察真实前台经过 8 秒、18 秒时的两个 DOM 状态，保留原来的两项断言。制造第 34 槽在一条低谷样本不能出勤，故使用该人生可真实到岗的第 31 槽复核 B9。出生窗口审计也保留了奥运的早年接触和清北的原始候选来源。

截图为 [清算前工作台](evidence/食堂闭店.png) 和 [清算后结果页](evidence/清算结果.png)。动画源在 art/kitchen-closing.aseprite，图集含 4 个 96×48 像素帧，时长依次为 180、120、160、260 毫秒。减少动态效果时使用封存完成的最后一帧。
