/* 边狱时代：事件数 65（带选项 57），成就数 14。
 * 连锁线：LCCB 入职→清场→回收→同事扭曲→系长→失联任务→赔付→去留→晋级文书→旧路线（逐年）。
 * 连锁线：金枝耳语→黑市订金→货物查验→争夺→证物→旧账（每段间隔两年）。
 * 连锁线：游乐园传单→失踪邻居→寻人→讨伐后勤→遗物→旧摊（每段间隔两年）。
 * 连锁线：血魔饥饿→血棒→眷属→被追猎→旧住址→长眠（累计十六年）。
 * 连锁线：大湖货单→裴廓德号传闻→双钩货箱→避让→赔单→返港（逐年）。
 * 连锁线：鸿园送货→黑兽经过→贾家退货→家主传闻→旧收据→重开铺面（每段间隔两年）。
 * 连锁线：钉与锤传单→不洁指控→义体伤者→讨伐运输→证言→失去的手（逐年）。
 * 连锁线：20区工资单→借时→圣愚涂字→被查封的铺面→旧钟→欠条结算（每段间隔两年）。
 * 连锁线：K公司治疗账单→伤员回访→来历不明的安瓿→追索→旧伤（逐年）。
 * 译名依据：docs/glossary.md 与 parallel.tsv；人物只作远景，不介入原作剧情。
 */
CITY.addEvents('limbus', [
  // LCCB：职业事件只在仍然任职时继续；辞职会终止未完成的派遣。
  { id: 'lc_recruit', age: [18, 55], req: { wy: [3, null], job: ['none', 'labor', 'clerk', 'fixer'], noflag: 'lc_left' }, w: 1,
    title: '缺人的公司', text: '边狱公司的招聘纸贴在诊所门口：LCCB招外勤职员，列出的外勤年薪从二十五万眼起。\n\n岗位写着事前观测、路线勘察与外围封锁，紧急联系人却要填两位。',
    choices: [
      { t: '签下外勤合同', r: '你领到一件制服和一本空白报告册。人事把你填的紧急联系人那页单独抽出来，锁进了铁柜。', eff: { job: { id: 'lccb', org: '边狱公司', rank: 0 }, flag: 'lc_staff', ach: 'lc_badge', queue: ['lc_clear', 1] } },
      { t: '替他们搬一天纸箱', r: '你搬了一天纸箱，领到临时工钱。箱里全是制服，尺寸各不相同，胸前都没有名字。', eff: { money: 5000, body: -1 } },
    ] },
  { id: 'lc_clear', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '第一道封锁线',
    text: '你第一次参加清场，负责封住一栋楼的侧门。楼上已经没人说话，只有家具一下下撞墙的声音。\n\n系长让你确认撤离人数，可表上的住户比门牌多出两个。',
    eff: { queue: ['lc_recover', 1] }, choices: [
      { t: '逐户核对名单', check: { s: 'wit', dc: 40 }, ok: { r: '多出来的是两个没登记的地下室租客。你把他们带到街口；封条刚贴上，身后的楼梯就塌了。', eff: { merit: 2, mind: 1, money: 8000 } }, no: { r: '你敲开了不该敲的门。队友把你拖出走廊时，你的耳朵还在流血。', eff: { body: -8, mind: -3, dist: 2 } } },
      { t: '照门牌填写', r: '你照门牌填完表，准时交了上去。系长没问多出的两行，你也没问地下室的人去了哪儿。', eff: { money: 12000, mind: -2, merit: 1 } },
    ] },
  { id: 'lc_recover', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '不得拆封',
    text: '送往下一个观测点的封装器材只标了箱号，未经许可不得拆开。\n\n你们抬着它穿过积水通道，箱底传来很轻的刮擦声。前方分出两条路，旧图纸上的出口已经砌成了墙。',
    eff: { queue: ['lc_colleague', 1] }, choices: [
      { t: '停下重新测路', check: { s: ['wit', 'body'], dc: 45 }, ok: { r: '你找到一架检修梯，箱子完整送达。验收员只看封条，从头到尾没抬眼看你们。', eff: { merit: 2, money: 16000 } }, no: { r: '检修梯锈断了，箱子被队友接住，你摔了下去。医药费从你的津贴里扣。', eff: { body: -9, money: -10000 } } },
      { t: '申请原路返回', r: '任务转给了别的小队。你在报告里抄了三遍“路线资料失效”，这个月少领一笔津贴。', eff: { money: -4000, mind: 1 } },
    ] },
  { id: 'lc_colleague', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '缺勤说明',
    text: '常坐你旁边的职员连续三天没交报告。你去宿舍找他，门缝里塞满了纸，纸边长着指甲。\n\n他在门后一遍遍念着箱号，声音已经分辨不出从哪里发出。',
    eff: { queue: ['lc_lead', 1] }, choices: [
      { t: '隔门呼叫支援', check: { s: 'mind', dc: 45 }, ok: { r: '你撑着把地址念完，才弯腰吐了出来。处理队到场后，你坐在楼梯上，口述了一段很短的目击记录。', eff: { mind: -3, dist: 3, merit: 2 } }, no: { r: '你慌得说不清门牌，只能扶着墙爬出去。支援找到这里时，整层楼都已被封死。', eff: { body: -6, mind: -6, dist: 4 } } },
      { t: '立即封锁楼道', r: '你从外面锁上了楼道铁门。第二天，柜子里多了一个袋子，装着他的饭盒，标签写着“待认领”。', eff: { mind: -4, dist: 2, merit: 1 } },
    ] },
  { id: 'lc_lead', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '系长的钥匙',
    text: '办公室空了两张桌子。上级把系长的柜子钥匙放在你面前，下面压着下一次出勤名单。\n\n接下钥匙，你就要负责检查全队装备，也要负责给没回来的人写报告。',
    eff: { queue: ['lc_silence', 1] }, choices: [
      { t: '接下钥匙', r: '你把自己排在队尾，重新核对了一遍备用电池。薪水涨了，你的紧急联系人一栏还是旧的。', eff: { job: { rank: 2 }, social: 2, ach: 'lc_keys' } },
      { t: '保留职员岗位', r: '钥匙交给了别人。你替新系长补齐库存，少写两份报告，也少拿一份薪水。', eff: { job: { rank: 1 }, skill: 2, money: -8000 } },
    ] },
  { id: 'lc_silence', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '没有应答',
    text: '先行小队进楼后，对讲机里只剩沙沙的摩擦声。你被留在外面守车，约定的撤离时间已经过了。\n\n门缝里淌出一道黑色的水，备用频道也没人回答。',
    eff: { flag: 'lc_missing_team', queue: ['lc_claim', 1] }, choices: [
      { t: '系绳探到门口', check: { s: ['skill', 'body'], dc: 65 }, ok: { r: '你腰上系着绳子摸到门口。绳子拉回来时，末端缠着一只记录器。你没找到活人，手套里灌满了冰冷的污水。', eff: { body: -5, mind: -5, dist: 3, flag: 'lc_recorder', money: 18000 } }, no: { r: '绳子突然绷直，把你往门里拽。车边的人割断你被卡住的袖子，才把你从门框里拖了出来。', eff: { body: -12, mind: -5, dist: 4, risk: [0.04, '在失联小队的任务现场未能撤离。'] } } },
      { t: '按时撤离并上报', r: '你按时开着空车撤离。后来的通报写着小队全员遇难，你的名字在“外围值守”一栏。', eff: { mind: -5, dist: 3, money: 6000 } },
    ] },
  { id: 'lc_claim', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_missing_team' }, title: '遗属窗口',
    text: '一年后，失联小队的赔付材料被退回到你手上，理由是缺少一位死者的现场确认。\n\n遗属坐在走廊里，膝上放着一双新鞋，说他出勤前答应过回来换掉旧的。',
    eff: { queue: ['lc_leave', 1] }, choices: [
      { t: '提交记录器副本', req: { flag: 'lc_recorder' }, r: '办公室收下了记录器副本。几周后遗属领到第一笔赔付，你则被叫去解释这台设备为什么一直在你手里。', eff: { social: -1, mind: 2, money: -5000 } },
      { t: '替遗属补交证词', check: { s: 'social', dc: 45 }, ok: { r: '你的证词被采纳了。鞋盒终于从走廊里拿走，下一批家属坐到了同一排椅子上。', eff: { mind: 2, social: 1 } }, no: { r: '材料又被退了回来。你请了几天假来回跑窗口，丢了工钱，什么也没换到。', eff: { money: -12000, mind: -2 } } },
      { t: '交回原始材料', r: '你原样交回材料，只在经手人一栏写了名字。下次路过窗口，那双鞋还放在椅子底下。', eff: { merit: 1, mind: -3 } },
    ] },
  { id: 'lc_leave', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '续约日期',
    text: '续约通知和体检报告一起发了下来。医生在你受伤的部位画了圈，办公室要你月底前决定去留。\n\n隔壁桌的新职员正在填紧急联系人，抄的是你的名字。',
    choices: [
      { t: '交还制服离职', r: '你交回制服，离开了LCCB。袖口拆下的名字条被你带回了家，几年后才舍得拿它垫松动的桌脚。', eff: { job: { id: 'none' }, flag: 'lc_left', unflag: 'lc_staff', money: 30000, mind: 3, ach: 'lc_exit', queue: ['lc_old_route', 3] } },
      { t: '续约并申请调任', r: '你续了约，调任申请压在出勤表底下。下一次任务的日期，比审批结果早了三周。', eff: { money: 24000, mind: -2, queue: ['lc_desk', 2] } },
    ] },
  { id: 'lc_desk', manual: true, req: { wy: [3, null], job: 'lccb', flag: 'lc_staff' }, title: '晋级文书',
    text: '晋升科长后的调任文书终于到了。桌上摆着一支没拆封的笔，窗外另一队人正在装车。\n\n名单最后一栏要由你判断：现场情况是否符合原定情报——你点头，他们就出发。',
    eff: { queue: ['lc_old_route', 2] }, choices: [
      { t: '逐条退回不明项', r: '你把说不清的条目逐条退回，在办公室补材料，直到楼下的车灯熄灭。有几笔津贴因此没批下来。', eff: { job: { rank: 3 }, money: -18000, wit: 2, mind: 1 } },
      { t: '签署附条件同意', r: '你在边栏写满限制条件，然后同意放行。车照常开走，司机顺手带走了你多备的一箱绷带。', eff: { job: { rank: 3 }, money: 22000, mind: -3, social: 1 } },
    ] },
  { id: 'lc_old_route', manual: true, req: { wy: [3, null], anyflag: ['lc_staff', 'lc_left'] }, title: '巴士经过',
    text: '你走过从前清场的街口，一辆巴士正好驶过。隔着反光的车窗，你瞥见一个乘客的头是一只钟表。\n\n车没有停，路边新装的玻璃上只映出你空着的两只手。', choices: [
      { t: '记下路面损坏的位置', r: '你把路面被压坏的位置告诉修路的人。他问是什么车压的，你说没看清车牌。', eff: { wit: 1, money: -2000 } },
      { t: '去街角吃碗面', r: '车声远了，你才发觉面汤已经凉了。店里换了菜单，老板也不再认得你。', eff: { mind: 2, money: -1000 } },
    ] },

  // 金枝：货物只验到赝品；不让玩家持有真正的金枝。
  { id: 'lc_gold_rumor', age: [18, 70], req: { wy: [3, null] }, w: 9, title: '金色的货',
    text: '旧货摊主用铜丝缠出一根树枝，说最近有人高价收“金枝”。\n\n真货他没见过，但这条收购消息已经转卖了三次，每转一手，就多出一座不同的仓库。', choices: [
      { t: '买下消息的来源', r: '你花钱买到一个联络号码，当场就打不通了。摊主把铜枝送给你，叮嘱你以后别在白天来找他。', eff: { money: -3000, flag: 'lc_gold_tip', queue: ['lc_gold_deposit', 2] } },
      { t: '替他辨别铜锈', r: '你刮开镀层，下面还是铜。摊主把树枝收回去，示意你别挡着下一位客人。', eff: { wit: 1 } },
    ] },
  { id: 'lc_gold_deposit', manual: true, req: { wy: [3, null], flag: 'lc_gold_tip' }, title: '两年后的订金',
    text: '两年前那个打不通的号码，忽然发来一条消息：有人租了仓库出售“金枝”，愿意出钱请你去验封条，但要你先垫一笔订金。\n\n地址和当年的传闻对不上。', choices: [
      { t: '收钱只验外箱', r: '你只收报酬，不肯垫钱。中间人改了交货时间，让你到时候从后门进。', eff: { money: 6000, queue: ['lc_gold_crate', 2] } },
      { t: '查清仓库租客', check: { s: 'social', dc: 45 }, ok: { r: '仓库租客登记的全是假名。你把这个消息卖给另一位买家，对方让你等下一批货。', eff: { social: 2, money: 4000, queue: ['lc_gold_crate', 2] } }, no: { r: '问到第三个人时，有人开始跟着你。你塞出一把零钱，才得以离开那片仓库。', eff: { money: -7000, mind: -2 } } },
    ] },
  { id: 'lc_gold_crate', manual: true, req: { wy: [3, null], flag: 'lc_gold_tip' }, title: '验货灯',
    text: '仓库里只开着一盏灯。箱中的“金枝”焊口粗糙，发光的是藏在底下的灯管。\n\n卖家把门拉上，说你已经看过货了，现在该当着买家的面说它是真的。',
    eff: { queue: ['lc_gold_fight', 2] }, choices: [
      { t: '借故切断灯管', check: { s: 'wit', dc: 45 }, ok: { r: '你扯断电线，灯一灭，买家先吵了起来。你把焊口的位置记在验货单上揣进怀里，从卸货口钻了出去。', eff: { wit: 2, flag: 'lc_gold_proof' } }, no: { r: '电线缠住了你的手，电得你发麻。买家破门进来时，你的拇指还弯不下去。', eff: { body: -7, money: -4000 } } },
      { t: '赔掉报酬退出', r: '你把收来的报酬全放回桌上。卖家把门拉开一条缝，刚够你侧身出去。', eff: { money: -10000, mind: -1 } },
    ] },
  { id: 'lc_gold_fight', manual: true, req: { wy: [3, null], flag: 'lc_gold_tip' }, title: '空仓库的争夺',
    text: '两年后，那座仓库被人拆掉了一面墙。两伙人还在争金枝被谁拿走，地上滚着你见过的那根灯管。\n\n你回来取当年落下的工具，发现门口贴着一张纸，正在找那天的验货人。',
    eff: { queue: ['lc_gold_evidence', 2] }, choices: [
      { t: '从排水沟取工具', check: { s: 'body', dc: 40 }, ok: { r: '你从排水沟爬出两条街才敢站起来。工具还在，箱盖上多了一个弹孔。', eff: { body: -2, skill: 1 } }, no: { r: '沟口被堵死了。你扔下工具，擦破后背才从铁栅下退了出来。', eff: { body: -6, money: -8000 } } },
      { t: '放弃工具另买一套', r: '你另买了一套工具，比旧的贵。路过仓库时，你把门口那张找人的纸揭下来，塞进了下水道口。', eff: { money: -12000, mind: 1 } },
    ] },
  { id: 'lc_gold_evidence', manual: true, req: { wy: [3, null], flag: 'lc_gold_tip' }, title: '证物保管费',
    text: '一家事务所在调查当年的假金枝交易，请你去说明那根灯管。\n\n调查员把镀铜的树枝放在桌上，问你愿不愿意留下署名证词。\n\n真金枝在哪里，所有卷宗都只写着“不明”。',
    eff: { queue: ['lc_gold_receipt', 2] }, choices: [
      { t: '附上验货记录', req: { flag: 'lc_gold_proof' }, r: '调查员把赝品装进证物袋。你的字迹和四年前一样，握笔的手却比那时抖得厉害。', eff: { money: 12000, mind: -1, ach: 'lc_false_gold' } },
      { t: '口述见过的焊口', r: '他付了一半的证言费。你不肯猜测货的去向，笔录因此少了整整一页。', eff: { money: 6000, mind: 1, ach: 'lc_false_gold' } },
      { t: '拒绝留下姓名', r: '你没拿钱就走了。下楼后你特意换了条路，确认没人跟着才回家。', eff: { money: -2000, social: -1 } },
    ] },
  { id: 'lc_gold_receipt', manual: true, req: { wy: [3, null], flag: 'lc_gold_tip' }, title: '退不了的订金',
    text: '旧货摊换成了修鞋铺。\n\n鞋匠从柜脚下抽出一沓旧订金条，问你认不认得上面的签名——每年都有人来这里讨那笔订金，最近开始带着孩子来了。', choices: [
      { t: '留下调查事务所的地址', r: '你顺便修了鞋。鞋匠用粉笔把地址写在墙上，旁边还挂着那根蒙了灰的铜枝。', eff: { money: -3000, social: 1 } },
      { t: '抄下订金条的签名', r: '你付钱抄下几张订金条的签名，收进旧笔记。鞋匠没多问，低头继续给一只进水的靴子换底。', eff: { money: -5000, mind: 2 } },
    ] },

  // 拉·曼却领：普通人的寻人与后勤，始终停留在原作舞台外侧。
  { id: 'lc_park_leaflet', age: [16, 75], req: { wy: [3, null], noflag: 'bloodfiend' }, w: 10, title: '免费入场',
    text: '有人把拉·曼却领的传单塞进门缝，纸上画着游乐设施，写着“免费入场”。\n\n邻居在背面记了采购清单，说下次休息就去看看，还能省下一顿饭钱。', choices: [
      { t: '请她回来后敲门', r: '她答应回来时给你带一张票根。你把传单夹进账本，给她装了一小碗腌菜。', eff: { social: 1, flag: 'lc_park_neighbor', queue: ['lc_park_missing', 2] } },
      { t: '拿传单补窗缝', r: '你用传单塞住窗缝，挡住了一点风。楼道里的脚步声停了片刻，又往下一层去了。', eff: { mind: 1 } },
    ] },
  { id: 'lc_park_missing', manual: true, req: { wy: [3, null], flag: 'lc_park_neighbor' }, title: '门里的碗',
    text: '邻居去了游乐园，一直没回来。房东撬开她的门，那碗腌菜已经干在桌上。\n\n她的亲属拿着传单来问你：最后一次见她时，她穿的是什么鞋？',
    eff: { queue: ['lc_park_search', 2] }, choices: [
      { t: '帮忙印寻人纸', r: '你想不起鞋的颜色，只记得鞋底漏水。印出来的寻人纸，有一半很快被招工广告盖住了。', eff: { money: -5000, mind: -2, flag: 'lc_park_searching' } },
      { t: '交出夹在账本的传单', r: '亲属把传单折好收进衣袋。你洗掉碗底的硬块，却找不到可以还碗的人。', eff: { mind: -3, wit: 1 } },
    ] },
  { id: 'lc_park_search', manual: true, req: { wy: [3, null], flag: 'lc_park_neighbor' }, title: '寻人费用',
    text: '你们委托的寻人事务所又来收续期费。墙上贴着越来越多相似的脸，有的照片只有工作证那么大。\n\n接待员说“尚无可靠消息”，说完用笔把“尚无”两个字描了一遍。',
    eff: { queue: ['lc_park_supply', 2] }, choices: [
      { t: '再付一轮费用', check: { s: 'social', dc: 40 }, eff: { money: -12000 }, ok: { r: '你磨到几份能互相核对的失踪记录。她的去向仍不清楚，但这次至少不是把旧报告重新复印一遍。', eff: { flag: 'lc_park_records', wit: 2 } }, no: { r: '新报告只换了日期，正文一字没改。接待员递给你一杯温水，水里有股铁锈味。', eff: { mind: -2 } } },
      { t: '带走已有材料', r: '你没再续费。接待员抽走续期表，你把她的照片压平，放回那个起了毛边的信封。', eff: { mind: 1, social: -1 } },
    ] },
  { id: 'lc_park_supply', manual: true, req: { wy: [3, null], flag: 'lc_park_neighbor' }, title: '讨伐的后勤单',
    text: '你听说一桩讨伐血魔的委托在招搬运工，只缺运绷带和饮水的人，不许家属随队。\n\n报名桌旁，一名收尾人正用小刀刮掉靴底暗红色的硬块。',
    eff: { queue: ['lc_park_box', 2] }, choices: [
      { t: '只接仓库内搬运', r: '你把水箱推到装车线前就停下。车回来时少了人，车上的水却一瓶没动。', eff: { money: 14000, body: -3, mind: -2 } },
      { t: '随车送到交接点', check: { s: 'body', dc: 50 }, ok: { r: '你停在交接线外，没往里走。撤回时车厢挤满了伤员，绷带很快就用光了。', eff: { money: 26000, body: -3, mind: -3 } }, no: { r: '交接点临时改了位置，你在废路上摔断了手腕。车厢里多出来的血迹，没人说得清是谁的。', eff: { money: 6000, body: -10, dist: 3 } } },
    ] },
  { id: 'lc_park_box', manual: true, req: { wy: [3, null], flag: 'lc_park_neighbor' }, title: '无人认领',
    text: '一箱来路不明的随身物品被送到事务所等人认领。\n\n你翻到一把和邻居那把很像的钥匙，但钥匙圈上没有她缠的那圈线。\n\n登记员说，相似不能当作确认死亡的依据。',
    eff: { queue: ['lc_park_stall', 2] }, choices: [
      { t: '照实留下辨认记录', r: '你只写了钥匙的形状，没写她的名字。登记员把东西装回袋子，贴上原来的编号。', eff: { mind: -2, ach: 'lc_unclaimed' } },
      { t: '请亲属再来核对', r: '亲属坐了半天车赶来，看过后也摇了头。那把钥匙留在箱里，回程的车上谁都没说话。', eff: { money: -5000, social: 1, ach: 'lc_unclaimed' } },
    ] },
  { id: 'lc_park_stall', manual: true, req: { wy: [3, null], flag: 'lc_park_neighbor' }, title: '旧摊位',
    text: '邻居以前买菜的摊位换了遮雨布。新摊主拿旧传单垫秤盘，画上的笑脸被鱼水泡开了。\n\n你认出秤下还压着一角寻人纸，上面的电话少了最后两位。', choices: [
      { t: '换一张完整的寻人纸', req: { flag: 'lc_park_searching' }, r: '摊主让你把新的贴在柱子背面。你买了一把青菜，接过找零时又看了一遍那个号码。', eff: { money: -2000, mind: -1, social: 1 } },
      { t: '买菜回家', r: '你把菜装进自己的布袋。摊主追上来补给你一根葱，说刚才称少了。', eff: { money: -1000, mind: 1 } },
    ] },

  // 血魔身份由世界模块建立；此线不赋予额外眷属数量、世代或力量。
  { id: 'lc_blood_hunger', age: [18, 110], req: { wy: [3, null], flag: 'bloodfiend' }, force: true, title: '闻得到的晚饭',
    text: '隔壁诊所今晚收了伤员。你关了两道门，还是闻得到血味。\n\n桌上的饭菜早就凉了，你发现自己把叉子捏弯了一点，只好把手缩回袖子里。',
    eff: { flag: 'lc_blood_days', queue: ['lc_blood_bar', 1] }, choices: [
      { t: '离开诊所所在的街', r: '你走到别的街区，一直绕到天亮。鞋磨破了，血味总算淡了，兜里的干粮被压成一团。', eff: { money: -4000, body: -3, mind: 1 } },
      { t: '买来历可疑的存血', res: [
        { w: 3, r: '卖家让你自己带瓶子。你没问血从哪来，回家洗瓶子时，冲出来的水一直是淡红色。', eff: { money: -12000, mind: -2 } },
        { w: 2, r: '瓶里掺了太多别的东西。饥饿没有消退，你吐了一地，还得赔房东清洗地板的钱。', eff: { money: -18000, body: -5, dist: 2 } },
      ] },
    ] },
  { id: 'lc_blood_bar', manual: true, req: { wy: [3, null], flag: ['bloodfiend', 'lc_blood_days'] }, title: '血棒的碎屑',
    text: '一个同类递给你一小截血棒，说有人靠这东西撑过饥饿。你掰开它，掉下几粒碎屑。\n\n对方盯着那些渣，等你咽下去了，才肯开口报剩下那些的价钱。',
    eff: { queue: ['lc_blood_kindred', 2] }, choices: [
      { t: '买下一小份慢慢吃', r: '那味道让你很难咽下去。你把碎屑也包进纸里收好，到了晚上，还是忍不住望向诊所的灯。', eff: { money: -9000, mind: 1, ach: 'lc_dry_supper' } },
      { t: '只尝递来的那一截', r: '你只吃了那一截，把包装折好还给他。饥饿还在，他没再劝，把剩下的放回了袋底。', eff: { mind: -2, social: 1 } },
    ] },
  { id: 'lc_blood_kindred', manual: true, req: { wy: [3, null], flag: ['bloodfiend', 'lc_blood_days'] }, title: '眷属的座位',
    text: '几个血魔挤在一间关了门的铺子里等人。\n\n有人谈起眷属的辈分，顺手把你的椅子往后挪了挪——在这里，你排得很靠后。\n\n桌上摆着空杯，窗外每走过一个人，谈话就停一下。',
    eff: { queue: ['lc_blood_hunt', 2] }, choices: [
      { t: '按对方示意换座', r: '你坐到离门最远的位置。散场时没人给你讲规矩，只让你下回自己带杯子。', eff: { mind: -2, social: 2 } },
      { t: '趁还没点名离开', r: '你起身时碰倒了一只杯子，赔了钱就走。门外的街很安静，你连夜换了住处才敢停下。', eff: { money: -14000, social: -1, mind: 1 } },
    ] },
  { id: 'lc_blood_hunt', manual: true, req: { wy: [3, null], flag: ['bloodfiend', 'lc_blood_days'] }, title: '门缝里的刀影',
    text: '一名收尾人拿着委托照片在街口打听。照片很模糊，你认不出上面是不是自己。\n\n房东已经开始清点住户，你的门牌被他用粉笔圈了起来。',
    eff: { queue: ['lc_blood_address', 8] }, choices: [
      { t: '从屋顶换一条街', check: { s: ['body', 'skill'], dc: 55 }, ok: { r: '你越过晾衣绳，没碰响铁梯。第二天有人踹开你住过的房门，屋里早就空了。', eff: { money: -10000, body: -3 } }, no: { r: '刀锋擦过你的后背。你滚进一辆货车底下，死死抓着车架，直到车开出那条街才松手。', eff: { body: -12, mind: -5, dist: 3, money: -18000, risk: [0.1, '在针对血魔的追猎中倒在了出租屋外。'] } } },
      { t: '付人带走全部家当', r: '你雇人搬走全部家当，自己躲在家具中间一起出了街。预付的半年房租没要回来，房东也没追出来。', eff: { money: -45000, mind: -2 } },
    ] },
  { id: 'lc_blood_address', manual: true, req: { wy: [3, null], flag: ['bloodfiend', 'lc_blood_days'] }, title: '变旧的人像',
    text: '多年后，你在旧住址附近遇见房东的孩子。他两鬓已经白了，却说你长得很像当年的一个租客。\n\n店里挂着一张旧合影，你和照片里的自己几乎一模一样。',
    eff: { queue: ['lc_blood_sleep', 3] }, choices: [
      { t: '说自己是那人的亲属', r: '他信了，把一摞积压多年的旧信交给你。墨水早已洇开，有一封的署名，你已经想不起是谁。', eff: { money: -6000, mind: -2, ach: 'lc_old_portrait' } },
      { t: '付钱买走合影', r: '他拆开相框，背板落下一层灰。你把照片反扣在包里，走上一条你不认识的新路。', eff: { money: -10000, mind: 1, ach: 'lc_old_portrait' } },
    ] },
  { id: 'lc_blood_sleep', manual: true, req: { wy: [3, null], flag: ['bloodfiend', 'lc_blood_days'] }, title: '长眠的安排',
    text: '同类给你留了一个封闭地下室的地址，说你可以试着在那里长眠。\n\n门内没有钟，只有上一位住客留下的空箱子。你量了量箱子的长度，头顶的水管一滴一滴地漏着水。', choices: [
      { t: '租下地下室准备长眠', r: '你预付了很久的租金，在黑暗里躺下。还没睡着，就听见门外有人在量隔壁那间的尺寸。', eff: { money: -40000, mind: 4, dist: -3 } },
      { t: '留下地址继续谋生', r: '你把地址缝进衣服内侧，继续过日子。今晚还得出门干活，桌上剩着半截没吃完的血棒。', eff: { mind: -1, money: 6000 } },
    ] },

  // 大湖：衔接已出海者，裴廓德号只存在于码头传闻。
  { id: 'lc_lake_manifest', age: [18, 75], req: { wy: [3, null], anyflag: ['lake', 'lake_job'] }, w: 18, title: '返潮的货单',
    text: '大湖码头的记账员请你辨认一张泡过水的货单。\n\n船名糊了一半，卸货工已经按单上的数目领了工钱，仓库里的箱子却对不上。\n\n少掉的箱子，总得算在某个人头上。', choices: [
      { t: '按箱底压痕重数', check: { s: 'wit', dc: 40 }, ok: { r: '你数出两只被重复登记的箱子。记账员付了你辛苦钱，让你下次再来帮忙。', eff: { money: 10000, flag: 'lc_lake_ledger', queue: ['lc_lake_pequod', 1] } }, no: { r: '盐渍让每道压痕看上去都像新的。你忙了半天，只换到一顿凉掉的饭。', eff: { body: -2, flag: 'lc_lake_ledger', queue: ['lc_lake_pequod', 1] } } },
      { t: '只证明自己搬过的数目', r: '你只报出自己搬过的那几箱。记账员皱着眉去找别人，塞给你几张零钞。', eff: { money: 3000 } },
    ] },
  { id: 'lc_lake_pequod', manual: true, req: { wy: [3, null], flag: 'lc_lake_ledger' }, title: '船名的余音',
    text: '酒馆里有人在讲裴廓德号，讲到一半忽然闭了嘴。\n\n听众给他添酒，他却反问你有没有注意空泊位上新钉的牌子。你看过去，牌子上只写着“待租”。',
    eff: { queue: ['lc_lake_hooks', 1] }, choices: [
      { t: '替他结掉那杯酒', r: '你替他付了酒钱，他还是没讲完。走之前他叮嘱你，别把酒馆里的闲话写进货单。你答应了。', eff: { money: -2000, social: 1, mind: -1 } },
      { t: '回去整理装卸记录', r: '纸页在潮气里卷了边。你用杯底压住，不去想那条船后来去了哪里。', eff: { wit: 1, money: 3000 } },
    ] },
  { id: 'lc_lake_hooks', manual: true, req: { wy: [3, null], flag: 'lc_lake_ledger' }, title: '双钩标记',
    text: '一只货箱被冲到栈桥下，箱角画着双钩海盗团的标记。\n\n搬运头目说把标记擦掉就能卖；守夜的人却把拖箱的绳头塞到你手里，自己先退开两步。',
    eff: { queue: ['lc_lake_detour', 1] }, choices: [
      { t: '登记位置后放开绳子', r: '你记下位置，松开了绳子。箱子卡在桥墩旁，里面的东西你一样没拿，仍被扣了半天的打捞工钱。', eff: { money: -4000, mind: 1 } },
      { t: '检查箱外的编号', check: { s: 'wit', dc: 50 }, ok: { r: '你在漆下找到原来的货号，只抄下号码。有人出钱买走了这个消息，没再让你靠近箱子。', eff: { money: 16000, wit: 1 } }, no: { r: '绳子勒破了掌心，箱子沉了下去。守夜人让你自己去跟头目解释，货为什么没拖上来。', eff: { body: -5, money: -8000 } } },
    ] },
  { id: 'lc_lake_detour', manual: true, req: { wy: [3, null], flag: 'lc_lake_ledger' }, title: '绕航',
    text: '你搭的货船临时改了航线。有人说远处看到了海盗，船长关上舱门，不许任何人出去看。\n\n货主给的期限只剩两天，误了就要扣工钱。',
    eff: { queue: ['lc_lake_claim', 1] }, choices: [
      { t: '留在舱内捆牢货物', check: { s: 'body', dc: 45 }, ok: { r: '你在舱里把货捆牢，箱角把肩膀磨得发青。靠岸时货物完好，你多拿到一笔护货钱。', eff: { body: -3, money: 18000 } }, no: { r: '船身猛地一晃，最后一摞箱子塌了。你的腿被压住，等同伴用铁杆一点点撬开。', eff: { body: -9, money: -6000 } } },
      { t: '记下绕航时间', r: '你隔着舱门听水声，把每次转向的时间记在纸边。靠岸时工钱少了一截，但这张记录留了下来。', eff: { money: -6000, flag: 'lc_lake_time' } },
    ] },
  { id: 'lc_lake_claim', manual: true, req: { wy: [3, null], flag: 'lc_lake_ledger' }, title: '损耗归属',
    text: '那次绕航的损失，最后成了赔偿单上的一行小字。货主说船方擅自延误，船方说是为了保住所有人的命。\n\n两边都把责任往下推，要你承认是自己装卸出了错。',
    eff: { queue: ['lc_lake_return', 1] }, choices: [
      { t: '拿出当时的时间记录', req: { flag: 'lc_lake_time' }, r: '他们划掉了你那一栏，转头去争下一项。你带着没被扣掉的工钱出了门。', eff: { money: 12000, wit: 1 } },
      { t: '找同船人共同申诉', check: { s: 'social', dc: 45 }, ok: { r: '三个人都记得同一声警报。双方各退一步，你们领回了一部分被扣的钱。', eff: { money: 10000, social: 2 } }, no: { r: '有人临时改了口。你的异议没人理会，找人代写申诉的钱，比追回来的还多。', eff: { money: -10000, mind: -2 } } },
      { t: '接受折价结清', r: '你认了，按下手印。手上被盐水泡开的裂口沾到印泥，疼得很清楚。', eff: { money: 4000, mind: -1 } },
    ] },
  { id: 'lc_lake_return', manual: true, req: { wy: [3, null], flag: 'lc_lake_ledger' }, title: '陆地上的床',
    text: '旧码头拆掉了一段栈桥，酒馆也换了桌椅。你回到陆地上睡觉，躺下时仍觉得床在晃。\n\n第二天有人上门，拿着一张新的湿货单，问你认不认得上面的货号。', choices: [
      { t: '接下白天的记账活', r: '你接下了活，把湿纸晾在窗边，等字迹显出来再抄。这一天听到的水声，只来自楼下的洗衣盆。', eff: { money: 14000, mind: 2, ach: 'lc_dry_bed' } },
      { t: '收起账本歇几天', r: '你推掉了这份活，花钱换了一张不会吱呀响的床。睡着以前，晃动总算停了一会儿。', eff: { money: -8000, body: 3, ach: 'lc_dry_bed' } },
    ] },

  // 鸿园：借送货与收据写普通人的远景，不参与家主更替。
  { id: 'lc_h_delivery', age: [18, 70], req: { wy: [3, null] }, w: 8, title: '送往鸿园',
    text: '一批灯罩要送往H公司后巷，缺一个押货的人。货单抬头写着鸿园，收货地址却只到一条窄街。\n\n承包商反复叮嘱：只送到单子上写的门口，别替客人往里搬。', choices: [
      { t: '按单押运灯罩', r: '你坐在货车后厢护着纸箱。路上碎了两只，到了地方，先从你的报酬里扣。', eff: { money: 12000, flag: 'lc_h_route', queue: ['lc_h_beast', 2] } },
      { t: '只在本地打包', r: '你包完最后一层纸，看着车开走。工钱按件算，回家时袖子里全是碎纸屑。', eff: { money: 4000, body: -1 } },
    ] },
  { id: 'lc_h_beast', manual: true, req: { wy: [3, null], flag: 'lc_h_route' }, title: '先收摊',
    text: '你又押货来到H公司后巷。茶摊忽然开始收杯子，有人低声说黑兽要从这里过。\n\n店主把你没吃完的点心包起来，手一直在抖，街上却安静得没有一声吆喝。',
    eff: { queue: ['lc_h_return', 2] }, choices: [
      { t: '付账从侧门走', r: '店主顾不上找零。你从侧门沿排水沟绕出去，隔着墙只听见几下靴底落地的声音。', eff: { money: -3000, mind: 1 } },
      { t: '收起货车等他们过去', check: { s: 'mind', dc: 45 }, ok: { r: '你低头盯着地面，直到店主重新摆出杯子。灯罩完好无损，你的掌心却掐出了几道指甲印。', eff: { mind: -2, money: 6000 } }, no: { r: '车轮碰响了一只铁桶。有人一把将你拽进门里，外面的货箱被撞碎一角，没人告诉你是谁干的。', eff: { body: -4, money: -9000, dist: 2 } } },
    ] },
  { id: 'lc_h_return', manual: true, req: { wy: [3, null], flag: 'lc_h_route' }, title: '贾家的退货',
    text: '一批以贾家名义收下的灯罩被退回承包商手里。没写破损，只写了“更换式样”四个字。\n\n承包商想让你在旧验收单上改填日期，说只是账面上的处理。',
    eff: { queue: ['lc_h_heir', 2] }, choices: [
      { t: '只签今天的收货数', r: '你只确认今天收回的数目。他沉着脸付了搬运费；你把当年那张验收底联收好，纸边的油渍还在。', eff: { money: 5000, flag: 'lc_h_receipt', social: -1 } },
      { t: '折价买下退货', check: { s: 'social', dc: 45 }, ok: { r: '你把灯罩转卖给几家小旅店，钱分三次才收齐。最后一只，你挂在了自己床头。', eff: { money: 10000, social: 1 } }, no: { r: '这些灯罩配不上常见的灯座。你占着仓库好几个月，最后按碎料价卖掉。', eff: { money: -15000 } } },
    ] },
  { id: 'lc_h_heir', manual: true, req: { wy: [3, null], flag: 'lc_h_route' }, title: '换家主的传闻',
    text: '鸿园家主更替的传闻传到了茶摊。有人说货价要变，有人劝先别进货。茶摊老板问你肯不肯垫钱替他订一批新灯罩，利息按月算。',
    eff: { queue: ['lc_h_audit', 2] }, choices: [
      { t: '只做已付定金的单', r: '你只做客人已付过钱的单子，生意少了一半。传闻天天换说法，仓库里只堆着有人等着取的纸箱。', eff: { money: 6000, wit: 1 } },
      { t: '垫钱订一批常用货', res: [
        { w: 1, r: '几家店重新开张，常用尺寸正好缺货。你赚到了差价，始终没弄清传闻里哪句是真的。', eff: { money: 24000 } },
        { w: 1, r: '客人推迟开张，货全压在你手里。你按月交仓租，一只灯罩也没卖出去。', eff: { money: -20000, mind: -2 } },
      ] },
    ] },
  { id: 'lc_h_audit', manual: true, req: { wy: [3, null], flag: 'lc_h_route' }, title: '旧账核对',
    text: '承包商倒闭后，有人拿着旧账上门。\n\n账上把那批退货的损失记成了你的欠款，日期正好是当年让你改填的那天。\n\n来人很年轻，只认印章，不听解释。',
    eff: { queue: ['lc_h_shop', 2] }, choices: [
      { t: '出示保留的旧收据', req: { flag: 'lc_h_receipt' }, r: '底联上的日期让他停下了笔。他把你的名字从欠款栏划掉，临走时还替你带上了门。', eff: { money: -1000, mind: 2, ach: 'lc_paper_shade' } },
      { t: '请原茶摊主作证', check: { s: 'social', dc: 45 }, ok: { r: '摊主认得那批灯罩的包装，替你作了证。作为回报，你帮他把当天的煤炉搬完。', eff: { body: -2, social: 2, ach: 'lc_paper_shade' } }, no: { r: '摊主早就搬走了。你只能分几次还清这笔不属于你的欠款，每还一次，都要穿过那条窄街。', eff: { money: -22000, mind: -2 } } },
    ] },
  { id: 'lc_h_shop', manual: true, req: { wy: [3, null], flag: 'lc_h_route' }, title: '还亮着的灯',
    text: '你再次经过那条窄街，旧茶摊变成了修灯铺。\n\n新店主不谈鸿园的传闻，只问你箱里的灯罩配不配他的灯座。铺子里飘着焊锡和陈茶混在一起的味道。', choices: [
      { t: '试好尺寸再卖', r: '你们试好尺寸，灯亮了，不再晃。你收了钱，把箱底最后一层旧报纸抽出来扔掉。', eff: { money: 8000, mind: 1 } },
      { t: '留一只抵修理费', r: '你留下一只灯罩，他替你修好了手电。回去时你照着脚下，躲开了路中间新挖的坑。', eff: { skill: 1, money: -2000 } },
    ] },

  // 钉与锤：不洁是他们的指控，不作为世界规则认定玩家有罪。
  { id: 'lc_n_poster', age: [18, 70], req: { wy: [3, null] }, w: 8, title: '没有盖章的告示',
    text: '街头贴出了钉与锤的传单，店主说是N公司那帮狂热者的东西。\n\n有人用红笔把“不洁”二字圈在义体诊所的广告上。\n\n护士请你帮忙揭掉，街对面却有人在记揭纸人的长相。', choices: [
      { t: '遮住护士先揭广告', r: '你挡在护士前面，连底下的旧广告一起揭掉。她关了门口的灯，让你过些日子再来拿剩下的工钱。', eff: { money: 3000, flag: 'lc_n_seen', queue: ['lc_n_accuse', 1] } },
      { t: '通知街口店家关门', r: '你去提醒街口的店家，有三家听了。卷帘门一扇扇落下，你没拿到钱，只带回一身铁锈味。', eff: { social: 1, flag: 'lc_n_seen', queue: ['lc_n_accuse', 1] } },
    ] },
  { id: 'lc_n_accuse', manual: true, req: { wy: [3, null], flag: 'lc_n_seen' }, title: '袖口',
    text: '一群自称异端审判官的人堵住路口，要每个行人露出关节，查看有没有义体。\n\n他们盯了一眼你袖口下的金属扣，又看向你同伴的手——那只手的指节发出很轻的机械声。',
    eff: { queue: ['lc_n_patient', 1] }, choices: [
      { t: '退回人群寻找侧路', check: { s: 'wit', dc: 45 }, ok: { r: '你拉着同伴从一辆推货车后面退出人群。走过两条街，他才松开攥着你衣服的手。', eff: { money: -4000, social: 1, flag: 'lc_n_witness' } }, no: { r: '有人揪住你的衣领。你挣脱外套才逃出来，同伴被人群挤到了别处。', eff: { body: -6, money: -5000, mind: -3 } } },
      { t: '丢开货物翻过矮墙', r: '你扔下货翻过矮墙，落地时扭了脚。货滚了一地，再回头，已经找不到那只机械手。', eff: { money: -16000, body: -5, mind: -2 } },
    ] },
  { id: 'lc_n_patient', manual: true, req: { wy: [3, null], flag: 'lc_n_seen' }, title: '拆掉的手',
    text: '后巷诊所里，一个伤员把自己拆下来的义体抱在怀里。他宁可卸掉它，也不愿戴着它上街被人看见。\n\n护士让你去买止痛药，前门那张旧传单还剩半截没揭干净。',
    eff: { queue: ['lc_n_convoy', 1] }, choices: [
      { t: '从熟悉的药铺赊药', check: { s: 'social', dc: 40 }, ok: { r: '药铺老板认得你，肯先赊药。伤员睡着后，手臂仍紧紧抱着那块金属。过了几天，你才把药钱补上。', eff: { money: -7000, mind: 1, flag: 'lc_n_helped' } }, no: { r: '药铺不赊账。你凑齐零钱把药带回去时，伤员已经疼得说不清自己的名字。', eff: { money: -11000, mind: -2, flag: 'lc_n_helped' } } },
      { t: '替护士守住后门', r: '你替护士守了一夜后门，没见到有人来。她给了你一点值班钱，药是她自己去买的。', eff: { body: -2, money: 3000 } },
    ] },
  { id: 'lc_n_convoy', manual: true, req: { wy: [3, null], flag: 'lc_n_seen' }, title: '改道的救护车',
    text: '一场讨伐把运货的道路堵死了。你的车临时装上了伤员，司机说要卸掉最重的货，车才过得了窄桥。\n\n货单上没有“救护”这一项——丢了货，损失得你自己担。',
    eff: { queue: ['lc_n_statement', 1] }, choices: [
      { t: '卸货让车先走', r: '你把货卸在桥头，让车先走。货主后来扣了你的工钱；你留下了那张卸货清单，上面印着伤员带血的指印。', eff: { money: -18000, mind: 1, flag: 'lc_n_manifest' } },
      { t: '冒险分两趟运送', check: { s: 'body', dc: 55 }, ok: { r: '你背着最后一箱过了桥，车还在另一头等着。回到家时，你的腰已经直不起来。', eff: { money: 8000, body: -5 } }, no: { r: '桥头的打斗蔓延了过来。你扔下货跳进沟里，膝盖被石头划开一道口子。', eff: { body: -10, mind: -4, dist: 2, money: -10000 } } },
    ] },
  { id: 'lc_n_statement', manual: true, req: { wy: [3, null], flag: 'lc_n_seen' }, title: '证词的空白',
    text: '收尾人来核实那场讨伐中的伤者。表格问你有没有亲眼看到钉与锤的标记。\n\n你只记得袖口、墙头和药袋；报纸上登的画面，比你自己的记忆清楚得多。',
    eff: { queue: ['lc_n_hand', 1] }, choices: [
      { t: '只写亲眼看见的事', r: '你划掉报纸上的说法，只写自己看到的。收尾人让那一栏空着，没逼你补上没见过的脸。', eff: { wit: 2, mind: -1, ach: 'lc_blank_testimony' } },
      { t: '附上救护时的清单', req: { flag: 'lc_n_manifest' }, r: '他抄下伤者的名字，把清单原件还给你。纸上那些暗褐色的指印，复印出来只是一团团灰影。', eff: { money: 5000, social: 1, ach: 'lc_blank_testimony' } },
    ] },
  { id: 'lc_n_hand', manual: true, req: { wy: [3, null], flag: 'lc_n_seen' }, title: '修好的指节',
    text: '诊所的招牌换了颜色。你在柜台上看到一只修好的旧义手，护士说主人攒够钱就会来取。\n\n门外又有人在贴传单，她先去试了试后门能不能顺利打开。', choices: [
      { t: '帮忙给后门上油', r: '你给后门的门轴上了油，它不再吱呀作响。护士留你吃饭，桌边有个位子一直空着。', eff: { skill: 1, body: -1, mind: 1 } },
      { t: '替伤员付一部分修理费', req: { flag: 'lc_n_helped' }, r: '护士把钱收进抽屉。那名伤员未必会回来，你让她到时候别说是谁付的。', eff: { money: -12000, mind: 2 } },
      { t: '买一卷干净绷带', r: '你买了一卷绷带。出门前回头看了一眼，柜台上那只手的手指仍然蜷着。', eff: { money: -2000, body: 1 } },
    ] },

  // T公司与20区：时间按普通人的合同体验描写，不另造计量规则。
  { id: 'lc_t_pay', age: [18, 70], req: { wy: [3, null] }, w: 8, title: '20区的短工',
    text: '20区一家T公司辖下的小店请你打短工。\n\n工资单把现金和“时间”分成两栏，店里的钟也走得让你很不习惯。\n\n老板提醒你看清扣款条目——排队等候不算工时。', choices: [
      { t: '签一份最短的合同', r: '你签了最短的一份。干完活才发觉饭早凉了；工钱算得很细，只有排队候工的那一段，哪一栏都没写。', eff: { money: 12000, body: -2, flag: 'lc_t_contract', queue: ['lc_t_loan', 2] } },
      { t: '只卖带来的旧货', r: '你只把带来的旧货换成现金，没在那里多留。离开时，街上的钟依然让你看不明白。', eff: { money: 4000 } },
    ] },
  { id: 'lc_t_loan', manual: true, req: { wy: [3, null], flag: 'lc_t_contract' }, title: '借来的空闲',
    text: '旧雇主叫你回去补班，有人建议你先“借一点时间”来用。\n\n借约上的收费条目挤得密密麻麻，讲解的人却一直催你快签。你刚买的热饭还没来得及打开。',
    eff: { queue: ['lc_t_chalk', 2] }, choices: [
      { t: '付咨询费逐项核对', check: { s: 'wit', dc: 45 }, eff: { money: -5000 }, ok: { r: '你找出一笔重复收费，最后没有借。补班照做，工钱至少没再少一截。', eff: { money: 12000, wit: 2, flag: 'lc_t_terms' } }, no: { r: '没有重复收费，只是名目起得很像。你最终没借，核对的钱却一分不退。', eff: { mind: -2 } } },
      { t: '不借时间减少班次', r: '你没借时间，少排了几个班，少挣了些钱。吃饭时对面的人换了两拨，你还在慢慢拆包装。', eff: { money: -6000, mind: 2 } },
    ] },
  { id: 'lc_t_chalk', manual: true, req: { wy: [3, null], flag: 'lc_t_contract' }, title: '墙上的字',
    text: '20区一堵墙上出现了新的涂字。有人说是圣愚留下的，店主只关心谁来出清洗的钱。\n\n字迹还没干，街口就排起了一列长队，没人说得清在等什么。',
    eff: { queue: ['lc_t_seal', 2] }, choices: [
      { t: '替店主清洗墙面', r: '你洗掉了字，砖缝里仍留着颜色。店主只付了一半工钱，说剩下的等确定没人追究再给。', eff: { money: 5000, body: -2, flag: 'lc_t_cleaner' } },
      { t: '绕路回去交班', r: '你绕路回去交班，迟到被扣了点钱。后来队伍散了，没人知道排在最前面的人等到了什么。', eff: { money: -4000, mind: 1 } },
    ] },
  { id: 'lc_t_seal', manual: true, req: { wy: [3, null], flag: 'lc_t_contract' }, title: '半开的卷帘门',
    text: '那间店被查封了。有人说是因为圣愚，也有人说只是欠了债。老板从半开的卷帘门底下递出你的旧工资单，求你先别去登记欠薪。',
    eff: { queue: ['lc_t_clock', 2] }, choices: [
      { t: '按期登记欠薪', r: '你还是去登记了。等候室的灯管一直在闪，你坐了一下午，只等来一句“回去等通知”。', eff: { money: -3000, flag: 'lc_t_claim' } },
      { t: '收一件工具折价结清', r: '你挑走一只旧工具箱抵了工钱。老板说它比欠你的钱值钱，你没有当面戳穿。', eff: { money: 4000, skill: 1 } },
    ] },
  { id: 'lc_t_clock', manual: true, req: { wy: [3, null], flag: 'lc_t_contract' }, title: '旧钟',
    text: '那家倒闭小店的旧钟出现在当铺里，钟面上有一道你熟悉的裂缝。当铺老板说它走不准，只能当摆设卖。\n\n你想起那几张把候工时间空着不写的工资单。',
    eff: { queue: ['lc_t_settlement', 2] }, choices: [
      { t: '买下来拆开修理', check: { s: 'wit', dc: 40 }, eff: { money: -6000 }, ok: { r: '你拆开一看，只缺一个普通零件。补好后你把它挂在屋里，只用它提醒自己按时吃饭。', eff: { skill: 2, mind: 1 } }, no: { r: '发条一碰就断了。你把碎件收好，那只钟永远停在了买回来的时刻。', eff: { mind: -1, skill: 1 } } },
      { t: '用钱买一顿热饭', r: '你没买钟，吃了一顿热饭才起身。这家店不挂钟，老板听着锅里的水声添柴。', eff: { money: -2000, mind: 2 } },
    ] },
  { id: 'lc_t_settlement', manual: true, req: { wy: [3, null], flag: 'lc_t_contract' }, title: '结算顺序',
    text: '那家旧店终于清算出一笔残余资产。名单上有你的名字，分到的钱只够吃几顿饭。\n\n经办人要你确认金额，并声明从此不再向店主追讨剩下的欠款。', choices: [
      { t: '核对工资单后签字', req: { flag: 'lc_t_claim' }, r: '你写下实收的数目，在没付的部分划线注明。经办人叹了口气，重新打印了一页。', eff: { money: 5000, wit: 1, ach: 'lc_time_stub' } },
      { t: '说明已经用工具抵账', req: { noflag: 'lc_t_claim' }, r: '经办人查到你当年拿工具抵了账，把你的名字划掉。你只领到一点车钱，那只旧工具箱还在家里。', eff: { money: 1000, mind: 1, ach: 'lc_time_stub' } },
      { t: '先请人审看结清条款', req: { flag: 'lc_t_terms' }, r: '请人看条款的钱几乎吃掉了全部款项。但你带回一份读得懂的结清书，不用再等下一个日期。', eff: { money: 1000, mind: 2, ach: 'lc_time_stub' } },
    ] },

  // K公司：只写治疗结果及费用，不解释奇点来源或制造方法。
  { id: 'lc_k_bill', age: [18, 80], req: { wy: [3, null] }, w: 9, title: '再生的价格',
    text: '诊所给一个受伤的搬运工开出治疗账单，说用了K公司的HP安瓿，伤口已经长好了。\n\n他在病床上一遍遍摸自己的腿，雇主只问他什么时候能回去把货搬完。', choices: [
      { t: '陪他核对治疗项目', check: { s: 'wit', dc: 40 }, ok: { r: '你发现账单多算了一晚床位。他能下地后请你吃了碗面，走路时仍习惯性地护着那条腿。', eff: { wit: 1, social: 1, flag: 'lc_k_bill_seen', queue: ['lc_k_visit', 1] } }, no: { r: '没有多算，只是价格又涨了。你替他先垫了一部分，换回一张薄薄的收据。', eff: { money: -10000, flag: 'lc_k_bill_seen', queue: ['lc_k_visit', 1] } } },
      { t: '替他付一趟回家车费', r: '你付了他回家的车钱，没替他回复雇主。车开走时他还在摸膝盖，像在确认那还是不是自己的腿。', eff: { money: -3000, mind: 1 } },
    ] },
  { id: 'lc_k_visit', manual: true, req: { wy: [3, null], flag: 'lc_k_bill_seen' }, title: '旧工伤',
    text: '一年后，那个搬运工又来诊所了，这次伤的是手。那条腿从外面看已经没有一点痕迹。\n\n他掏出去年的收据，问能不能凭老病号的身份便宜一点。',
    eff: { queue: ['lc_k_offer', 1] }, choices: [
      { t: '帮他与雇主谈工伤费', check: { s: 'social', dc: 45 }, ok: { r: '雇主答应出一部分钱，条件是他下周照常上工。你让雇主当着护士的面，把这话又说了一遍。', eff: { social: 2, flag: 'lc_k_record' } }, no: { r: '雇主说腿去年就治好了，这次不算同一次工伤。你记下这句话，给他买了些吃的。', eff: { money: -5000, mind: -2 } } },
      { t: '找便宜一些的包扎方案', r: '医生重新列了几种便宜的治法。他戴着固定夹板出了门，省下的钱刚够几天的饭。', eff: { wit: 1, mind: -1 } },
    ] },
  { id: 'lc_k_offer', manual: true, req: { wy: [3, null], flag: 'lc_k_bill_seen' }, title: '无盒安瓿',
    text: '有人在街边兜售一支没有包装盒的安瓿，说是K公司的货。瓶身上的字被磨花了，价钱不到诊所的一半。\n\n卖家想让你帮他牵线，旁边已经站着一个裹着手的买家。',
    eff: { queue: ['lc_k_trace', 1] }, choices: [
      { t: '请诊所核对来历', r: '诊所不肯替它担保。你花钱请人看过，把没开封的东西退还卖家，也没替他拉客。', eff: { money: -4000, flag: 'lc_k_refused' } },
      { t: '提醒买家不要急着付款', check: { s: 'social', dc: 40 }, ok: { r: '买家把钱收了回去。卖家记住了你的脸，你只好绕远路离开那片摊位。', eff: { social: 1, money: -3000, flag: 'lc_k_refused' } }, no: { r: '卖家一把推倒你，提着箱子跑了。买家也不见了，你磕掉一颗牙，装零钱的袋子也丢了。', eff: { body: -5, money: -7000 } } },
    ] },
  { id: 'lc_k_trace', manual: true, req: { wy: [3, null], flag: 'lc_k_bill_seen' }, title: '货款追索',
    text: '那个卖家失踪了。有人拿着一摞伪造的收据挨家挨户地问，想查清那些安瓿经过了哪些人的手。\n\n其中一张印着那家诊所的名字，印章却和你留着的那张不一样。',
    eff: { queue: ['lc_k_scar', 1] }, choices: [
      { t: '出示真正的治疗收据', r: '你拿出真收据，只让他抄编号，不让他带走原件。查访的人离开后，你把门后的插销也扣上了。', eff: { wit: 1, mind: -1, ach: 'lc_healing_bill' } },
      { t: '付费请事务所代交说明', r: '说明很短，写清你没有经手过货款。事务所留了底，收的钱够你吃半个月的饭。', eff: { money: -12000, mind: 1, ach: 'lc_healing_bill' } },
    ] },
  { id: 'lc_k_scar', manual: true, req: { wy: [3, null], flag: 'lc_k_bill_seen' }, title: '看不见的旧伤',
    text: '搬运工换了份轻活，替诊所送洗干净的床单。\n\n他说那条腿早就不疼了，只是半夜常常醒来，伸手去摸膝盖。\n\n你手里那张旧收据，已经快从折痕处断开了。', choices: [
      { t: '替旧收据做一份副本', r: '你重抄了一份，两人各留一张。纸上写得清花了多少钱，写不清他后来少睡了多少个晚上。', eff: { money: -1000, wit: 1, mind: 1 } },
      { t: '帮他送完这一车床单', r: '你帮他送完了这一车，两人平分当天的工钱。床单干燥、洁白，推过破路时一包也没掉。', eff: { money: 5000, body: -2, social: 1 } },
    ] },

  // 时代小事件：不给原作人物安排对话，也不规定都市统一的新制度。
  { id: 'lc_notice_layers', age: [16, 100], req: { wy: [3, null] }, w: 12,
    text: '协会公告栏贴满了与扭曲有关的委托。\n\n新纸盖着旧纸，胶水还没干，就有家属来问能不能把照片贴在旁边。\n\n值班的人挪出一小块地方，没撕掉底下的旧照片。', eff: { mind: -1, flag: 'lc_notice_seen' } },
  { id: 'lc_insurance', age: [18, 90], req: { wy: [3, null] }, w: 10,
    text: '推销员坐在扭曲事故的封锁线外兜售私人保险。\n\n条款写明：投保人自己发生扭曲的不赔，无法确认形态的尸体也不赔。\n\n他坐的折叠椅上，印着另一家公司的名字。', eff: { wit: 1, ach: 'lc_small_print' } },
  { id: 'lc_remains_shift', age: [18, 85], req: { wy: [3, null] }, w: 10,
    text: '残骸回收工蹲在路边刷胶靴。桶里的水越刷越稠，他倒掉换一桶，又倒掉再换一桶。\n\n旁边的招工牌写着按重量计酬，有个孩子蹲在牌下，数着回收车开过了几趟。', eff: { mind: -1, dist: 1 } },
  { id: 'lc_neighbor_knock', age: [14, 100], req: { wy: [3, null], loc: 'backstreet' }, w: 11,
    text: '楼里的住户约好：谁家传出不正常的声音，就敲三下水管报信。\n\n第一晚有人失手把锅掉在地上，整栋楼的水管响了很久。第二天大家凑钱，换掉了一截被敲漏的管子。', eff: { money: -1000, social: 1, flag: 'lc_pipe_rule' } },
  { id: 'lc_pipe_reply', age: [16, 110], req: { wy: [3, null], flag: 'lc_pipe_rule', used: 'lc_neighbor_knock', fn: (S) => S.age - S.last.lc_neighbor_knock >= 2 }, w: 16,
    text: '又有人敲了三下水管。你照规矩关灯，把鞋摆在门边。天亮后才知道是楼上的孩子闹着玩。\n\n住户们没骂他，只让他挨家挨户去记住：哪些门后已经没人应声了。', eff: { mind: -1, ach: 'lc_three_knocks' } },
  { id: 'lc_bus_window', age: [10, 105], req: { wy: [3, null] }, w: 8,
    text: '街口停了一辆巴士，只停了一小会儿。你看不清乘客，只看见车窗后晃过几件深色的衣服。\n\n摊主说最近总有人打听这辆车，说完便把摊子往人行道里挪了半尺。', eff: { wit: 1 } },
  { id: 'lc_empty_uniform', age: [18, 100], req: { wy: [3, null] }, w: 9,
    text: '二手店里挂出一件LCCB制服，原本缝名牌的位置只剩几个针孔。袖子太长，店主让你试试。\n\n你摸到口袋里有一张揉皱的装备清单，最后打了勾的一项是“备用绷带”。', eff: { mind: -1 } },
  { id: 'lc_distortion_rent', age: [18, 100], req: { wy: [3, null], loc: 'backstreet' }, w: 10,
    text: '房东在租约上加了一行：“扭曲造成的墙面损坏另计。”有住户问，人都变成那样了，该找谁收钱。\n\n房东没回答，量完墙上新的裂缝，把这个月的房租往上调了一点。', eff: { money: -3000, mind: -1 } },
]);

CITY.addAch({
  lc_badge: { name: '紧急联系人', desc: '成为LCCB外勤职员。', tier: 'common', group: '边狱时代' },
  lc_keys: { name: '空桌的钥匙', desc: '接下LCCB系长岗位。', tier: 'uncommon', group: '边狱时代' },
  lc_exit: { name: '交还制服', desc: '走过失联任务与赔付流程后离开LCCB。', tier: 'rare', group: '边狱时代' },
  lc_false_gold: { name: '焊口', desc: '为一场假金枝交易留下可靠证言。', tier: 'rare', group: '边狱时代' },
  lc_unclaimed: { name: '相似不足以确认', desc: '辨认失踪邻居可能留下的物品。', tier: 'uncommon', group: '边狱时代' },
  lc_dry_supper: { name: '碎屑也收好', desc: '作为血魔买下难以下咽的血棒。', tier: 'rare', group: '边狱时代' },
  lc_old_portrait: { name: '照片里的租客', desc: '在旧住址看到未曾变老的自己。', tier: 'epic', group: '边狱时代', hidden: true, hint: '有些老照片会在多年后变得难以解释。' },
  lc_dry_bed: { name: '不再晃动', desc: '结束大湖货单与赔付的多年往返。', tier: 'uncommon', group: '边狱时代' },
  lc_paper_shade: { name: '灯罩与印章', desc: '用当年的记录或见证处理鸿园货运旧账。', tier: 'rare', group: '边狱时代' },
  lc_blank_testimony: { name: '空白的证词', desc: '只为讨伐中亲眼看见的事作证。', tier: 'uncommon', group: '边狱时代' },
  lc_time_stub: { name: '余款', desc: '等到20区旧雇主的残余资产结算。', tier: 'rare', group: '边狱时代' },
  lc_healing_bill: { name: '再生之后', desc: '保留治疗收据，说明自己与可疑安瓿的关系。', tier: 'uncommon', group: '边狱时代' },
  lc_small_print: { name: '不在承保范围', desc: '看清一份扭曲保险的排除条款。', tier: 'common', group: '边狱时代' },
  lc_three_knocks: { name: '仍有人应声', desc: '几年后仍记得楼里的水管暗号。', tier: 'uncommon', group: '边狱时代' },
});
