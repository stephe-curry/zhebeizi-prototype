# 执行记录

当前本机 Node、macOS Chrome，正式 index.html 文件入口。所有日志保存在 evidence，未替换业务断言。

```sh
node tests/acceptance.cjs
node tests/lifecycle.cjs
node --test tests/{continuity,gift,interaction,guidance,shop,dinner,dinner-fish,p2,p3,p32,p33,p34,p35}.cjs tests/childhood/routes.cjs
node tests/p36.cjs
```

历史专项共 456 项通过。acceptance、lifecycle 分别通过；初次日志 node.log，最终专项 final-node.log。独立探索 480 个 seed/strategy 组合、8 条合法提前谢幕，全部最终导入成功。脚本候选提交可能依法被拒绝，拒绝数见 exploration-and-stress.md。

```sh
mkdir -p /tmp/p36/{p2/screens,p3,p32/evidence,p33/evidence,p34/evidence}
export LIFE_P2_EVIDENCE=/tmp/p36/p2 LIFE_P3_EVIDENCE=/tmp/p36/p3
export LIFE_P32_EVIDENCE=/tmp/p36/p32/evidence
export LIFE_P33_EVIDENCE=/tmp/p36/p33/evidence LIFE_P34_EVIDENCE=/tmp/p36/p34/evidence
node tests/portrait-browser.cjs --p35
node tests/portrait-browser.cjs --p34
node tests/portrait-browser.cjs --p33
node tests/portrait-browser.cjs --p32
node tests/portrait-browser.cjs --p3
node tests/portrait-browser.cjs --p2
node tests/portrait-browser.cjs
node docs/v1.4/p3/p3-6/export.cjs
```

P3-2 18 条、P3-3 21 条、P3-4 15 条、P3-5 55 条，共 109 条正式页面人生与 5,010 条已提交事实。另有 P2、P3-1 和竖屏综合回归。日志为 chrome-p32 至 chrome-p35、chrome-p2、chrome-p3、chrome-portrait。UI 修改后另外复跑 55 条，日志 chrome-final.log；新断言检查专属弹窗确有时间说明。

机器证据 route-evidence.generated.json 由本轮浏览器运行导出。54 个覆盖目标分别索引到具体人生与收据。截图 evidence/清算结果.png；更多场景截图按浏览器套件输出目录保存于 /tmp/p36，各阶段历史目录仍可查看源图。临时目录可能随系统清理，机器事实已复制到本阶段目录。

Aseprite 打开实际源文件核验四图层、四帧及 180／120／160／260 ms，日志 aseprite.log。减少动态效果的梦想场景改为最后一帧。路线制作指南中的独立注册示例实际执行成功，日志 extension.log。

本轮没有测试失败后删断言；候选拒绝属于探索结果。当前主事选择仍复用既有合法生活策略，独立探索重点覆盖新种子和路线选择。实体设备、Safari 和真人首次体验未执行。
