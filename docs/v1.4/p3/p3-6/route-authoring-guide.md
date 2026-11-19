# 新路线制作示例

下面的样例可在仓库根目录运行。在独立 Node 进程内注册练习路线，使用正式童年进入第 12 槽，并通过正式主选择提交。进程退出后样例即消失。

```sh
node <<'JS'
const assert = require('node:assert/strict');
const {reach, settle} = require('./tests/p2-paths.cjs');
const E = LifeEngine;
LifeRoutes.register({
  id: 'rehearsal', type: 'dream', version: 1, goal: '为校赛剪一段解说',
  window: [12, 22], contact: f => f.choiceId === 'life-11-0',
  actions: [{
    id: 'mark-cue', kind: 'investment', label: '在录像上标出换人时刻',
    time: 1, energy: 1, money: 0,
    available: r => r.slot >= 13 && r.slot <= 21, until: 21,
    feedback: '你在画面切换前写下了第一个提示词。'
  }]
});
const r = reach(1, 12, r => r.slot === 11 ? 'life-11-0' : undefined);
assert(E.chooseDream(r, 'rehearsal', 'establish'));
settle(r);
assert(E.advance(r));
assert(E.chooseDream(r, 'rehearsal', 'mark-cue'));
settle(r);
const [entry] = LifeRoutes.history(r, 'rehearsal', 'investment');
assert.equal(entry.source.slot, 13);
console.log(entry.action.result.detail);
JS
```

1. 先写一句玩家愿意追求的具体目标，再决定哪件经历会让人想到它。在六种出生身份下核对接触条件。
2. 在场景中制作可做错、可重做或可放下的具体动作。简单操作可声明 methods。需要空间、物件或时间轴操作时复用场景交互。只有实际确认的反馈可作后续来源。
3. 声明动作窗口和成本。想把动作留到下槽，需要在那个槽位真正开放它。正式考试或比赛指定独立届次。
4. 发资格时使用 qualification 动作，available 检查所需经历。检验的 qualification 返回凭据引用。长线回访通过 history 查询已完成的具体动作，再核对物件仍在、人与岗位仍可达。
5. 测试无接触、资金不足、完整提交、草稿刷新、取消、失去资格、结果不可重抽与分叉隔离。示例用例在 tests/p3.cjs。内容与美术能从正式页面完成之后再加入生产注册。

## 十八路线后的边界

新增职业必须声明 job 与四种工资模式，沿用 newJob 交接。新增异地岗位需要校区或地点预检。独立活动应有明确的场景、成本及结果标题。现有餐饮通过结果中的库存与店账增量投影，不另建存档权威。

正式发布的 route/action ID 与版本需要持续保留。当前导入会重新计算动作，直接移除已发布配置会使含该动作的旧档失败。维护者应保留旧规则的解析能力，在明确迁移方案实施前禁止删除已发布规则。这是现有机制的扩展边界。
