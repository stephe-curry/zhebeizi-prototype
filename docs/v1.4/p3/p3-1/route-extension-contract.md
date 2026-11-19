# 注册和扩展边界

模块在 engine.js 之前载入。LifeRoutes.register 接受一个内部受信任的声明。必填字段为 id、type、goal、version、window、contact 和 actions。window 使用 1–46 闭区间。现行版本为 1。动作 ID 全局唯一，生命周期操作名保留。非法版本、撞名、负数或非整数费用、超过两段的时间和错误动作种类都在注册时失败。

| 声明 | 含义 |
| --- | --- |
| contact(fact) | 从已提交事实识别真实接触。对旧素材应匹配实际选项或操作成果 |
| canPursue(context) | 可选条件，用于确立与重拾；已在进行的目标仍可主动搁置 |
| available(context) | 当前场景、时段、身份、历史资格均符合才开放专属动作 |
| kind | contact、investment、qualification、employment 或 fate-result |
| time / energy / money | 两段日程、精力及个人现金的非负整数成本 |
| mainChoices | 可选的真实主选择 ID 列表。专属操作与当期主选择匹配时可承担主时段，例如两段正式评估；其他主选择会被拒绝 |
| methods | 可选专属操作分支，每项有 id、label 和 detail，结果收据保留选择 |
| shareWith | 预先注册的其他目标 ID；只关联当时 active 的目标 |
| attempt / qualification / judge | 届次稳定标识、资格事实引用数组、专属评判。judge 读取准备和有界外因 |
| until / next / completeOnPass | 本操作最后可续时段、检验后续说明、此项通过能否实现路线最高目标 |
| job / wages | 职业声明的主岗位键及 full、part、leave、study 四档定额 |
| mode | 聘约动作选用的合法工资档 |

context 仅含 seed、slot、eventId、career、facts。规则必须是纯函数。接触、资格和准备分别归属明确的历史事实。增加剧情时可在现有场景中实现专业操作，由主场景结算其结果，路线再通过来源条件读取。可见反馈使用正式结果中的 detail；长期承接可复用 P2 的机会和短行动机制。

存档导入按历史前缀重算可执行动作，再逐字段核对版本、结果、目标、成本、来源和合法性。已发布的 ID 和版本 1 规则应保持历史语义。撤下入口时保留历史规则读取能力；彻底移除定义后，本地读取可保留旧事实，外部导入会拒绝无法验证的收据。引入新的规则版本时需增加对应历史解释器和双版本样本。

触达边界包括新增迷你游戏、专业学历、牌照、分期债务或持续多年课程。这些业务需要真实操作、资格及来源，再交给共享结算。没有此类专业内容的路线不要注册到正式菜单。
