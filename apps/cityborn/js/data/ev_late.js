/* 余生：50 个事件，37 个带选项；14 个成就。
 * 连锁：重大体检 → 三年后复查。
 * 连锁：更换义体 → 四年后停产维护。
 * 连锁：中年转行 → 三年后第一位回头客。
 * 连锁：收尾人退休 → 五年后旧事务所的封套。
 * 连锁：翼员工退休 → 三年后退休金 → 两年后申诉答复。
 * 连锁：帮派退隐 → 四年后仇家登门。
 * 连锁：教导年轻人 → 五年后学徒来信。
 * 连锁：订立遗嘱 → 六年后更改受益人 → 临终分配。
 * 连锁：封存积蓄 → 四年后拆开信封。
 * 连锁：留下通信地址 → 三年后最后一封信。
 * 连锁：整理旧工具 → 三年后处理遗物。
 * 连锁：深宵守门 → 两年后更换门闩。
 */
(function () {
  'use strict';
  const livingKids = (S) => S.kids.filter((k) => k.alive);
  // 退休效果执行前保存职业，避免引擎换职时丢失旧组织信息。
  const retire = (kind) => (S) => {
    S.vars.lt_oldJob = S.job.id;
    S.vars.lt_oldOrg = S.job.org || '原来的单位';
    S.flags['曾任_' + S.job.id] = true;
    CITY.apply(S, { job: { id: 'retired' }, flag: 'lt_retired_' + kind });
  };
  const distribute = (S) => {
    const kids = livingKids(S);
    const total = Math.max(0, Math.floor(S.money));
    S.vars.lt_estate = total;
    S.vars.lt_inheritance = kids.map((k, i) => ({
      name: k.name, amount: Math.floor(total / kids.length) + (i < total % kids.length ? 1 : 0),
    }));
    S.money -= total;
    S.flags.lt_distributed = true;
  };
  CITY.addEvents('late', [
    { id: 'lt_exam', age: [40, 65], w: 16, title: '整张检查单',
      text: '你的检查单长得要用胶带接起来。医生圈出几个超标的数字，问你上一次完整体检是什么时候。\n\n你想了很久，只记得那天在下雨。他说要查清楚，还得再花四万眼。',
      choices: [
        { t: '付钱做进一步检查', req: { money: [40000, null] }, eff: { money: -40000, queue: ['lt_review', 3], flag: 'lt_exam_paid' }, res: [
          { w: 3, r: '查出的毛病暂时压得住。医生在药袋上写下三年后复查的日子，叮嘱你少爬楼梯。', eff: { body: 5 } },
          { w: 1, r: '你在诊所住了两周，原定的几笔进账都耽搁了。出院时，你还得花钱补齐复工材料。', eff: { body: 2, money: -15000, mind: -3 } },
        ] },
        { t: '只拿止痛药', eff: { money: -3000, body: -2, flag: 'lt_exam_delayed', queue: ['lt_review', 3] }, r: '药袋很轻。医生把检查单折好交还给你，没有再劝。' },
      ] },
    { id: 'lt_review', manual: true, title: '旧检查单',
      text: '三年后，你带着发黄的旧检查单去复查。\n\n医生换了人，他把新旧两张片子叠在一起对着灯看，说病灶比当年大了一圈，要治得先付五万眼。',
      choices: [
        { t: '接受治疗', req: { money: [50000, null] }, eff: { money: -50000 }, check: { s: 'body', dc: 40 },
          ok: { r: '治疗起了作用，新片子上的阴影淡了下去。回家的路上，你走得比来时快。', eff: { body: 7, flag: 'lt_health_managed' } },
          no: { r: '治疗只挡住了恶化。你带着一盒每天都要吃的药回家。', eff: { body: 1, mind: -2 } } },
        { t: '带着结果回去', r: '你没有治，把片子折好塞进口袋。从那以后，爬楼要比以前多歇一次。', eff: { body: -5, mind: -2 } },
      ] },
    { id: 'lt_prosthetic', age: [40, 70], req: { nojob: ['retired', 'book', 'distorted'] }, w: 12, title: '继续工作的部件',
      text: '你的手又一次没握住重物，箱子砸在脚边。工坊说换一条义体手臂要十二万眼，装好就能接着干活。\n\n演示的店员比你年轻得多，单手就提起了一整箱零件。',
      choices: [
        { t: '换上义体', req: { money: [120000, null] }, eff: { money: -120000, pros: 1, body: 6, flag: 'lt_work_pros', queue: ['lt_service', 4] }, r: '新手臂没有颤抖。你按约定回去上工，第一周还会下意识地甩掉并不存在的酸痛。' },
        { t: '减少接活', eff: { money: -20000, body: 2, merit: -2 }, r: '你推掉了几份重活，收入少了一截。手腕不再疼得睡不着，每月的开销却一样也没少。' },
      ] },
    { id: 'lt_service', manual: true, title: '停产通知',
      text: '你那款义体手臂的配件停产了，关节开始发出细响。\n\n当年替你安装的技师还留着一个旧纸箱，里面是最后几套原装接头，一套三万五千眼。',
      choices: [
        { t: '购买原装接头', req: { money: [35000, null] }, eff: { money: -35000, body: 2 }, r: '技师换掉接头，又把旧件装回纸箱。你问他为什么留着，他说以后也许还能拆。' },
        { t: '改用便宜的转接件', check: { s: 'wit', dc: 45 },
          ok: { r: '你逐个核对接口，挑出一组能用的。手腕转动时多了一点阻力。', eff: { money: -8000, skill: -1 } },
          no: { r: '转接处忽然卡死。技师把电源拔掉，你的手还保持着握杯的姿势。', eff: { money: -8000, body: -5, skill: -3 } } },
      ] },
    { id: 'lt_replaced', age: [40, 59], req: { job: ['clerk', 'research', 'wing', 'labor', 'shop', 'mech'] }, w: 14, title: '交接',
      text: '主管让你把手上的活教给新来的年轻人。他学得很快，连你绕开坏开关的手势都学会了。\n\n第三天，你的名牌被收进抽屉，主管给你两条路：降薪留下，或者拿一笔补偿走人。',
      choices: [
        { t: '接受降薪留任', eff: { money: -20000, merit: -3, mind: -3 }, r: '你接受了降薪。新人坐进你原来的位置，你的桌子被挪到通风口下面，整天吹着冷风。' },
        { t: '拿补偿离开', eff: { money: 40000, job: { id: 'none' }, mind: -2 }, r: '补偿只算了最近几年的工龄。你带走自己的杯子，清洁员等你腾出椅子。' },
        { t: '提出保留技术岗位', check: { s: ['wit', 'social'], dc: 55 },
          ok: { r: '你留下处理没人肯接的故障。名牌重新贴好，下面加了“临时”两个字。', eff: { merit: 2, mind: -1 } },
          no: { r: '主管说已经讨论过了。你多教了新人两天，没有拿到这两天的工资。', eff: { money: -5000, mind: -4 } } },
      ] },
    { id: 'lt_retrain', age: [40, 65], req: { job: ['none', 'labor', 'shop', 'clerk', 'retired'] }, w: 13, title: '夜间学徒',
      text: '街角工坊开夜课，学费两万五千眼，深宵前下课。\n\n你走进教室，坐在最前排。桌下的护目镜带子短了，得重新放长。',
      choices: [
        { t: '交费重新学手艺', req: { money: [25000, null] }, eff: { money: -25000, wit: 2, flag: 'lt_retrained', queue: ['lt_trade', 3] }, r: '同桌问你是不是来接孩子的。你把护目镜戴上，开始认桌上的零件。' },
        { t: '继续找熟悉的活', eff: { money: 5000, body: -2 }, r: '老雇主还缺一个搬货的人。你答应了，工坊的报名表拿来垫了漏水的鞋。' },
      ] },
    { id: 'lt_trade', manual: true, title: '回头客',
      text: '客人推来一台坏水泵，正是三年前夜课上那种。\n\n“别处要两万，能便宜些吗？”他一边问，一边接着泵口还在漏的水。',
      choices: [
        { t: '接下维修委托', check: { s: 'wit', dc: 40 },
          ok: { r: '水泵重新转了起来。客人走后又介绍来两个邻居，你在街角支起了修理铺的牌子。', eff: { job: { id: 'mech', org: '街角修理铺' }, money: 20000, flag: 'lt_new_trade' } },
          no: { r: '泵修好了，可你把零件价报低了，扣掉成本只剩一小把零钱，手背上还多了一道划口。', eff: { money: 2000, wit: 1, body: -2 } } },
        { t: '转给年轻技师', eff: { money: 4000, social: 2 }, r: '你收一笔介绍费，把课本也借给了他。客人推着泵去了下一条街。' },
      ] },
    { id: 'lt_fixer_retire', age: [45, 80], req: { job: 'fixer', flag: 'office_member', noflag: ['office_own', 'assoc', 'freelance'] }, w: 18, title: '不再续约',
      text: '事务所又到了续约的时候。代表问你还能接多少夜间委托，你看着自己发僵的指节，没有马上回答。\n\n门口几个新来的收尾人正互相缠绷带，最小的那个还不到二十岁。',
      choices: [
        { t: '办完交接退休', eff: [{ fn: retire('fixer') }, { money: 25000, queue: ['lt_office_seal', 5] }], r: '钥匙放回前台。你在门外站了一会儿，发现今天不必等电话了。' },
        { t: '再签几年', eff: { money: 30000, body: -3, mind: -2 }, r: '你又续了几年。代表照顾你的年纪，只派白天的委托，但路程一次比一次远。' },
      ] },
    { id: 'lt_office_seal', manual: true, title: '旧事务所的封套',
      text: '退休五年后，有人送来一只封套。\n\n旧事务所关门清点时，发现还欠你一笔委托分成；封套里除了欠款单，还有一把你早已交还的钥匙。',
      choices: [
        { t: '托人查清欠款', check: { s: 'social', dc: 50 },
          ok: { r: '钱从另一家事务所转来，只够结清一半。那把钥匙已经打不开任何一扇门。', eff: { money: 40000, mind: 1 } },
          no: { r: '你托的人白跑一趟：欠你钱的那家事务所已经注销，账也跟着没了。那把钥匙你留在了抽屉里。', eff: { money: -6000, mind: -2 } } },
        { t: '卖掉还能用的旧装备', eff: { money: 12000, skill: -2 }, r: '商人逐件称重。你报出它们的来历，他只记录金属的重量。' },
      ] },
    { id: 'lt_wing_retire', age: [45, 78], req: { job: ['wing', 'clerk', 'research'] }, w: 16, title: '离职窗口',
      text: '人事窗口递来退休方案：退休金分期领，第一笔要等三年；要一次结清，金额就得砍掉一大半。\n\n你的工牌还挂在胸前，职员已经把回收工牌的盒子推了过来。',
      choices: [
        { t: '接受分期退休金', eff: [{ fn: retire('wing') }, { flag: 'lt_pension_claim', queue: ['lt_pension', 3] }], r: '你选了分期。走出大楼时，身后的门禁灯由绿转红，你的工牌已经刷不开了。' },
        { t: '要求一次结清离开', eff: [{ fn: retire('wing') }, { money: 100000 }], r: '金额被划去一大半。你确认到账后才交出工牌，回收盒里已经有好几张。' },
        { t: '续签工作合同', eff: { merit: 2, body: -3 }, r: '你说还想再干几年。职员收回退休方案，像早料到似的，从抽屉里拿出续签的表格。' },
      ] },
    { id: 'lt_pension', manual: true, title: '第一笔退休金',
      text: '三年到了，第一笔退休金却没有进账。你带着旧合同去问，柜员翻到附件，指着一行小字：发放须视公司经营状况而定。',
      choices: [
        { t: '按原合同申请领取', res: [
          { w: 2, r: '隔周到账了第一笔钱。你又去查了一次，确认数字没有被撤回。', eff: { money: 90000, flag: 'lt_pension_honored' } },
          { w: 3, r: '你的申请被转去另一个部门，没人说得清要等多久。', eff: { mind: -3, queue: ['lt_appeal', 2] } },
        ] },
        { t: '折价转让领取权', eff: { money: 30000, unflag: 'lt_pension_claim' }, r: '你把领取权折价卖给中介，换到三万眼现钱。他把合同收进防水袋，像是做成了一笔好买卖。' },
      ] },
    { id: 'lt_appeal', manual: true, title: '申诉编号',
      text: '等了两年，申诉终于有了答复。接待处已经搬了地方，职员要你先证明自己确实在旧部门干过——可当年的主管早就查无此人。',
      choices: [
        { t: '补齐证明追讨', check: { s: ['wit', 'social'], dc: 55 },
          ok: { r: '你翻出压箱底的旧工资单，证明了自己的身份。补发的退休金够你宽裕地过上一阵。', eff: { money: 70000, flag: 'lt_pension_honored' } },
          no: { r: '你拿出的证明盖的是旧章，现在已经不认了。你来回跑了几趟，只换回一个新的排队号码。', eff: { money: -5000, mind: -3 } } },
        { t: '签字放弃申诉', eff: { money: 10000, mind: -1 }, r: '他们称这笔钱为慰问金，要求你在“双方再无争议”下面签名。' },
      ] },
    { id: 'lt_gang_retire', age: [45, 75], req: { job: ['syndicate', 'kurokumo'] }, w: 16, title: '退出饭桌',
      text: '聚餐时，年轻人坐进了你常坐的门边。有人替你倒酒，问要不要回家歇着。\n\n他伸手接你的钥匙，酒杯还没斟满。',
      choices: [
        { t: '交钱退隐', eff: [{ fn: retire('gang') }, { money: -60000, queue: ['lt_revenge', 4] }], r: '对方收下钱，说旧事到此为止。你把这句话和对方的名字一起记住。' },
        { t: '保住原来的位置', check: { s: ['skill', 'social'], dc: 60 },
          ok: { r: '酒倒回年轻人的杯里。那晚没人再提退休，你回家后敷了一夜的膝盖。', eff: { fame: 2, body: -3 } },
          no: { r: '你被扶出了门。分到的钱比答应的少，肋骨也折了两根。', eff: [{ fn: retire('gang') }, { body: -8, money: 10000, queue: ['lt_revenge', 4] }] } },
      ] },
    { id: 'lt_revenge', manual: true, title: '旧账找到了门',
      text: '退隐四年后，有人把一张旧合照塞进门缝。被圈出的是当年死在你们手里的一个人，背面写着他的忌日。\n\n门外的人敲了敲门：“以为不干了，这笔账就能勾掉？”',
      choices: [
        { t: '花钱雇人交涉', req: { money: [50000, null] }, eff: { money: -50000 }, res: [
          { w: 3, r: '你雇的收尾人替你谈妥了。对方收下钱，条件是你永远不许再踏进那条街。', eff: { mind: -2 } },
          { w: 1, r: '对方只答应这次不来。你连夜加固了门锁，钱也没有退。', eff: { mind: -5, body: -2 } },
        ] },
        { t: '拿起旧武器', check: { s: 'skill', dc: 60 },
          ok: { r: '门外的人倒下了。你拖着旧伤擦净门槛，又多了一笔不会退休的账。', eff: { body: -6, mind: -4, flag: 'killed', cnt: { kills: 1 } } },
          no: { r: '你握住了武器，手却没有年轻时快。合照落在了门槛里面。', eff: { death: '死在退隐多年后找上门的旧仇手中。' } } },
      ] },
    { id: 'lt_mentor', age: [50, 80], w: 13, title: '教一个人',
      text: '一个年轻人连续几天坐在你门口，带着自己的午饭，想学你在都市里活到今天的本事。\n\n第一天他问怎样出名，第二天问怎样挣钱，今天问怎样才能不死。',
      choices: [
        { t: '收下他慢慢教', eff: { money: -12000, mind: 2, flag: 'lt_mentor', queue: ['lt_apprentice', 5] }, r: '你先让他学会检查出口。午饭摊在两人中间，油渍浸透了包纸。' },
        { t: '卖给他几条经验', eff: { money: 8000, social: -1 }, r: '你按条收费。他听完一条就记一条，没有钱听到最后。' },
      ] },
    { id: 'lt_apprentice', manual: true, title: '五年后的字迹',
      text: '当年那个年轻人寄来一封信，用的仍是你教的缩写。\n\n他没死，也不再问怎样出名；信里附着一笔钱，说是当年的饭费，现在才凑齐。\n\n还夹着两张照片，是他自己带的新人。',
      choices: [
        { t: '收下迟来的饭费', eff: { money: 20000, mind: 3, flag: 'lt_pupil_survived' }, r: '你在回信里改了两处危险的做法。照片收进抽屉，没有放在旧讣告旁边。' },
        { t: '退回钱并提醒他', eff: { mind: 4, social: 2, flag: 'lt_pupil_survived' }, r: '你把钱寄了回去，让他用在新人身上。寄信时柜员问你在笑什么，你说没什么。' },
      ] },
    { id: 'lt_will', age: [55, 90], w: 17, title: '写清楚归谁',
      text: '邻居死后，三个自称是他亲戚的人为了他的东西撬开了房门。\n\n你回到屋里，找出一张白纸写遗嘱，把账户和工具放在哪里都列清楚。\n\n写到“留给谁”时，笔尖停了很久。',
      choices: [
        { t: '指定孩子继承', req: { kids: [1, null] }, eff: { money: -3000, flag: 'lt_will', set: { lt_beneficiary: '在世的孩子' }, queue: ['lt_will_review', 6] }, r: '副本交给保管人。你特地加上“在世”两个字，再把可能争执的物件逐件编号。' },
        { t: '指定身边的人', eff: { money: -3000, flag: 'lt_will', set: { lt_beneficiary: '届时仍肯来收拾的人' }, queue: ['lt_will_review', 6] }, r: '你没写具体的名字，只写了“届时仍肯来收拾的人”。保管人看了一眼，没有多问。' },
        { t: '先留下手写清单', eff: { mind: -1, set: { lt_draft: '未签署的财物清单' } }, r: '你把清单折好塞进床垫底下。没有见证人，也没有副本，只有你知道它在那里。' },
      ] },
    { id: 'lt_will_review', manual: true, title: '六年前的名单',
      text: '保管人拿来六年前的遗嘱。上面有些名字已经不能再用，有些物件早就卖了。你逐项画掉过时的条目，纸上留出的空白比原来多。',
      choices: [
        { t: '重新指定孩子', req: { kids: [1, null] }, eff: { money: -2000, set: { lt_beneficiary: '在世的孩子' }, flag: 'lt_will_current' }, r: '你要求按届时在世的人数均分，不让纸上的死人占一份。新版压在旧版上，盖了日期。' },
        { t: '指定最后照顾自己的人', eff: { money: -2000, set: { lt_beneficiary: '最后照顾自己的人' }, flag: 'lt_will_current' }, r: '保管人加了一条：由邻居作证，确认谁是最后照顾你的人。旧版遗嘱你亲手撕碎，扔进了炉子。' },
      ] },
    { id: 'lt_deposit', age: [45, 75], req: { money: [40000, null] }, w: 10, title: '另装一个信封',
      text: '你数完这个月剩下的钱，想存一笔应急的——万一哪天病倒了，手边总得有点。你找来一个厚信封，封面只写了日期。',
      choices: [
        { t: '存下四万眼防病', eff: { money: -40000, set: { lt_reserve: 40000 }, queue: ['lt_envelope', 4] }, r: '钱藏进上锁的铁盒。你告诉自己，这笔钱不能拿去补别的窟窿。' },
        { t: '用来过一阵好日子', eff: { money: -12000, mind: 4 }, r: '你修了椅子，换了床单，买了一袋不需要挑掉坏粒的米。那晚的饭你吃得很慢。' },
      ] },
    { id: 'lt_envelope', manual: true, title: '封口的四年',
      text: '四年后，你打开铁盒。信封边缘已经发脆，钱一张没少。可物价涨了，四年前够住一次院的钱，现在只够看几回病。',
      choices: [
        { t: '取出钱治旧病', eff: { body: 6, set: { lt_reserve: 0 } }, r: '诊所收走整只信封。你带回一袋药，把铁盒留着装检查单。' },
        { t: '取出钱付账', eff: { money: 40000, mind: 1, set: { lt_reserve: 0 } }, r: '你把这笔钱拿去填了日常的窟窿。铁盒空了，你拆下它的锁，用来装纽扣。' },
      ] },
    { id: 'lt_address', age: [50, 78], w: 10, title: '通讯录最后一页',
      text: '旧通讯录上还有几个没有划掉的号码。你试着拨通一个，接电话的人问你找谁。\n\n窗边晾着刚洗的衣服，话筒里的杂音像雨落在铁皮上。',
      choices: [
        { t: '给旧相识留下地址', eff: { money: -2000, social: 2, queue: ['lt_letter', 3] }, r: '你托人转交便条，只写收信处，不写每天回家的时间。' },
        { t: '合上通讯录', eff: { mind: -2, social: -1 }, r: '你说打错了。对方很快挂断，下一通电话一直没有人接。' },
      ] },
    { id: 'lt_letter', manual: true, title: '转寄三次',
      text: '一封信转寄了三次才找到你。对方说自己也停了工，问你那家便宜的面馆还开不开。\n\n落款旁的日期已经过去半年，回邮地址涂改过两次。',
      choices: [
        { t: '去约定的地方等', res: [
          { w: 2, r: '你们坐到店家催关门。谁也没问对方没写在信里的事，面钱各付一半。', eff: { money: -2000, mind: 4 } },
          { w: 1, r: '对面一直空着。你带走两份已经凉了的面，赶在夜里之前回家。', eff: { money: -4000, mind: -3 } },
        ] },
        { t: '寄回一份菜单', eff: { money: -500, mind: 1 }, r: '你没去赴约，只寄回一份那家面馆的新菜单，把涨过的价格圈了出来。' },
      ] },
    { id: 'lt_chronic', age: [60, 100], w: 12, title: '阴天之前',
      text: '膝盖发酸，半夜下起雨。你侧着身把腿放直，楼下诊所的扩音器已经在播长期服药折扣。\n\n同一句话，播到早饭还没停。',
      choices: [
        { t: '买足疗程', req: { money: [18000, null] }, eff: { money: -18000, body: 4 }, r: '药片按星期分进小盒。你每天打开一格，饭桌上多了一件不能收走的东西。' },
        { t: '按疼的时候吃', eff: { money: -2000, body: -2, mind: -1 }, r: '一板药能撑很久。你开始按楼梯的级数决定今天要不要出门。' },
      ] },
    { id: 'lt_pills', age: [60, 110], w: 8,
      text: '两种药，一种饭前，一种饭后。你把吃过的包装压在碗底，省得再数。\n\n水一开，碗底的铝箔被蒸汽吹得轻轻响。', eff: { body: -1, mind: 1 } },
    { id: 'lt_spouse', age: [60, 100], req: { spouse: true }, w: 12, title: '两只杯子',
      text: '你和伴侣同时去拿那只好杯子，热水洒了一桌。\n\n两个人都说自己来擦，手又撞到一起。最后一人擦一半，留着桌缝里的水。',
      choices: [
        { t: '一起换掉旧杯子', eff: { money: -2000, mind: 3 }, r: '店里便宜的只剩不同花纹。你们一人拿一只，回家还是认错了。' },
        { t: '把钱留给下月药费', eff: { mind: 1, body: 1 }, r: '你没买新杯，用砂纸磨平了缺口。伴侣擦干桌上的水，晚饭后又数了一遍剩下的药。' },
      ] },
    { id: 'lt_widow', age: [60, 115], req: { flag: 'widowed', spouse: false }, w: 10,
      text: '你洗完一只碗，才发现锅里的量又做多了。原来放另一副碗筷的地方如今堆着药盒。\n\n你把多出的饭装好，在盖子上写了明天的日期。', eff: { mind: -2 } },
    { id: 'lt_killed_memory', age: [60, 110], req: { flag: 'killed' }, w: 9, title: '想不起来的脸',
      text: '你又想起死在自己手里的人，伤口记得，脸却记不清。\n\n拿纸写名字，第一个字就写错了。你划掉它，旁边再写一个，笔尖停在第二笔。',
      choices: [
        { t: '留下记得的那部分', eff: { mind: -3, dist: -2, set: { lt_unfinished_name: '一个没有写全的名字' } }, r: '纸没有烧。你把它放到自己的证件下面，免得被当成欠条。' },
        { t: '撕掉这张纸', eff: { mind: 1, dist: 3 }, r: '碎纸落进垃圾袋。你睡下后还是看见那个伤口，只是没有脸。' },
      ] },
    { id: 'lt_library_memory', age: [60, 115], req: { flag: 'library_returned' }, w: 10,
      text: '你在二手摊看见一本封皮相似的书，手指先于眼睛缩了回来。摊主把它翻开，里面只是过时的价目表。\n\n你站在日光下，等手不再发抖。', eff: { mind: -2, dist: -1 } },
    { id: 'lt_ego_memory', age: [60, 115], req: { flag: 'ego' }, w: 8, title: '不必给谁看',
      text: '有人问起你身上的E.G.O，想让你再展示一次。他把录制设备架得很稳，付钱的信封摆在桌边。\n\n你看见自己的手映在镜头上，比记忆里瘦了。',
      choices: [
        { t: '拒绝这次展示', eff: { mind: 3 }, r: '镜头被盖上，对方带走了信封。你把椅子挪回原来的位置。' },
        { t: '答应有偿录制', eff: { money: 30000 }, check: { s: 'mind', dc: 55 },
          ok: { r: '录制顺利结束，他付完钱就走了。那天晚上你没有开灯。', eff: { mind: -2 } },
          no: { r: '设备被掀翻，对方匆忙逃走。钱留在桌上，你一夜没能入睡。', eff: { mind: -7, dist: 7 } } },
      ] },
    { id: 'lt_color_memory', age: [60, 115], req: { flag: 'color' }, w: 8,
      text: '年轻的收尾人念出你的名号，随后又核对了一遍你的脸。\n\n他原本准备好的话没有说完，只问要不要替你拿包。你把装着蔬菜的袋子换到另一只手。', eff: { mind: 1 } },
    { id: 'lt_finger_memory', age: [60, 110], req: { flag: 'finger_quit' }, w: 8, title: '不会忘的规矩',
      text: '隔壁搬来的人在饭桌上说了一句熟悉的话。你下意识坐直，等他把下一句说完。他只是在责骂孩子，没留意你的筷子悬了很久。',
      choices: [
        { t: '继续吃完这顿饭', eff: { mind: 2, dist: -1 }, r: '没有人向你下令。你夹起一块已经凉掉的菜，把碗里的饭慢慢吃净。' },
        { t: '换一家店吃', eff: { money: -1500, mind: -1 }, r: '你留下饭钱。下一家店没有空位，你端着纸碗站在灯下。' },
      ] },
    { id: 'lt_tools', age: [55, 90], w: 10, title: '用不上的工具',
      text: '旧工具贴着你的掌纹，最顺手的那把却已锈死。废品商报了整箱价钱，伸手来提。\n\n你按住箱盖，让他等一下。',
      choices: [
        { t: '留下并逐件作标记', eff: { mind: 2, flag: 'lt_labeled_tools', queue: ['lt_relics', 3] }, r: '你写清用途，连容易伤人的地方也标出来。标签比有些工具还新。' },
        { t: '整箱卖掉', eff: { money: 6000, mind: -2 }, r: '箱子搬走，地板露出一块浅色。你拿别的东西遮了几次，都不合适。' },
      ] },
    { id: 'lt_relics', manual: true, title: '把遗物先交出去',
      text: '三年前封起的工具箱搬了几回家，今天才再打开。\n\n买家看标签，你试握柄。最旧那把缺了齿，他反倒先挑出来。',
      choices: [
        { t: '按实用的价格卖出', eff: { money: 12000, mind: 1 }, r: '对方把标签也带走了。你留下一把已经坏掉的，放回空箱子里。' },
        { t: '交给愿意学的人', eff: { social: 2, mind: 3, flag: 'lt_tools_passed' }, r: '你演示最后一次，接着坐在旁边看他动手。指正的时候，你没有接过工具。' },
      ] },
    { id: 'lt_last_words', age: [65, 120], w: 13, title: '提前留下的话',
      text: '录音器只剩很短的存储空间。你试了几次声音，回放里都是呼吸和椅子的响动。\n\n若真到说不出话的时候，别人能听见的就只有接下来这一小段。',
      choices: [
        { t: '交代钥匙和账单', eff: { set: { lt_lastWords: '钥匙在床脚，未付的账单在最下面。' }, fn: (S) => { S.lastWords = S.vars.lt_lastWords; } }, r: '你报清位置，又听一遍，确定自己的话没有被杂音盖住。' },
        { t: '请他们按时回家', eff: { mind: 2, set: { lt_lastWords: '早些回去，门一定要锁好。' }, fn: (S) => { S.lastWords = S.vars.lt_lastWords; } }, r: '录音只用了几秒。你关掉机器，剩下的空间没有再填。' },
      ] },
    { id: 'lt_stone', age: [65, 120], w: 12, title: '按字收费',
      text: '做墓牌的人给你看样板，名字之外每多刻一个字都要加钱。\n\n你面前的样板用的是一个陌生人的名字，出生年份和你相同，后面已经刻满了。',
      choices: [
        { t: '只刻姓名和年份', eff: { money: -3000, flag: 'lt_stone', set: { lt_epitaph: '姓名，出生年份，死亡年份。' } }, r: '死亡年份那一格先空着。刻字的人用指甲在样板上比了比宽度：“够刻四个数字。”' },
        { t: '添一句自己选的话', eff: { money: -6000, flag: 'lt_stone', set: { lt_epitaph: '曾在此处居住。' } }, r: '你删去职业和名号，只留下“曾在此处居住”。刻字的人念了一遍，点点头，开始磨凿子。' },
        { t: '把样板退回去', eff: { mind: -1 }, r: '你不留订金。店主擦掉试写的粉笔字，给下一个客人腾出位置。' },
      ] },
    { id: 'lt_inheritance', age: [70, 125], req: { flag: 'lt_will', kids: [1, null], fn: (S) => S.vars.lt_beneficiary === '在世的孩子' }, w: 10, title: '最后一次对账',
      text: '你让在世的孩子们坐到床边，把遗嘱和账户一项项念完。\n\n医生在走廊上等答复，床头还放着后续治疗的报价。谁也没有先碰那张纸。',
      choices: [
        { t: '结清遗产，留在家里', eff: { fn: distribute, death: '分好留给孩子的余款后，在家中停止了呼吸。' }, r: '钱按在世人数均分，零头从名单第一人起各补一眼。你确认每人收到的数目，合上了账本。' },
        { t: '先付钱继续治疗', eff: { money: -50000, body: 4 }, res: [
          { w: 3, r: '遗嘱被放回抽屉。你又在这张床上过了一季，药盒换了一种。', eff: { mind: -1 } },
          { w: 1, r: '治疗没有留住你。孩子们拿着遗嘱，等窗口重新核算余款。', eff: { fn: distribute, death: '在最后一次治疗后未能醒来，余款按遗嘱分给了在世的孩子。' } },
        ] },
      ] },
    { id: 'lt_night_view', age: [70, 125], w: 10, title: '亮着灯的都市',
      text: '你想再上一次屋顶。楼梯间的灯坏了一半，扶手被摸得发亮。\n\n隔着铁门已经能看见远处的楼群，广告牌每隔几秒就换一个年轻人的脸。',
      choices: [
        { t: '慢慢走到屋顶', check: { s: 'body', dc: 35 },
          ok: { r: '你坐在水箱旁，等一整轮广告播完。回去前看了表，还来得及锁门。', eff: { body: -1, mind: 4, flag: 'lt_saw_lights' } },
          no: { r: '你在最后一层坐下，透过门缝看灯。回来时手心蹭破了皮。', eff: { body: -3, mind: 1 } } },
        { t: '请人搬椅子到窗前', eff: { money: -1000, mind: 2 }, r: '窗框遮住了一部分楼群。你把头稍微偏过去，就能看见那块最亮的招牌。' },
      ] },
    { id: 'lt_sleep', age: [75, 125], req: { nojob: ['book', 'distorted'] }, w: (S) => (S.age - 72) * 0.25,
      text: '你把明天的药放在床边，水杯压着一张未写完的购物单。\n\n楼下关门的声音传上来，你听了一会儿，将毯子拉到肩头。那一夜没有电话响。',
      eff: { death: '在睡梦中安静地停止了呼吸。', flag: 'lt_sleep_death' } },
    { id: 'lt_door', age: [60, 115], req: { loc: 'backstreet', spouse: false }, w: 12, title: '三点十三分',
      text: '凌晨三点十三分，你独自坐在门后，听着清道夫经过的动静。\n\n门闩在细微地颤，门外偶尔有分不清来源的声响。膝上的毯子滑落，你没有弯腰。',
      choices: [
        { t: '等到深宵结束', eff: { mind: -2, flag: 'lt_kept_door', queue: ['lt_door_repair', 2] }, r: '你记着时间，直到四点三十三分过后又等了一阵。毯子落在脚边，门仍然锁着。' },
        { t: '关掉灯回床上等', check: { s: 'mind', dc: 40 },
          ok: { r: '你摸黑回床，手里还攥着钥匙。天亮后，水杯里的水一口没少。', eff: { mind: 1 } },
          no: { r: '你又回到门后，坐到腿发麻。早餐的水烧开时，你才想起毯子还在地上。', eff: { body: -2, mind: -3 } } },
      ] },
    { id: 'lt_door_repair', manual: true, title: '磨薄的门闩',
      text: '两年后，锁匠拆下那根门闩，指给你看被磨薄的一面。你坐在旁边盯着尚未装好的锁孔。\n\n走廊里每有人经过，你都会先抬头看时间。',
      choices: [
        { t: '换上厚门闩', eff: { money: -8000, mind: 3, flag: 'lt_door_renewed' }, r: '锁匠让你试了三遍。每一遍关上的声音都很实，那天夜里你一觉睡到了天亮。' },
        { t: '只修好旧的', eff: { money: -1500, mind: -1 }, r: '旧件焊上补片。锁匠没有保证还能用几年，你把椅子继续留在门边。' },
      ] },
    { id: 'lt_sixty', age: [60, 79], w: 18,
      text: '年轻人问你早年那条街。店名说了几个，他都摇头。\n\n你比划出淹到脚踝的水，他接上话：“现在也淹，换条沟罢了。”', eff: { mind: 2 } },
    { id: 'lt_eighty', age: [80, 99], w: 22,
      text: '登记员看了三遍你的出生年份，又叫同事来核对。\n\n你把证件往前推，同事先拉了张椅子。坐下才发现椅面比膝盖还低。', eff: { mind: 2 } },
    { id: 'lt_century', age: [100, 125], w: 30, star: true,
      text: '年龄写到第三位，表格没地方了。登记员找纸，你指指空着的职业栏。\n\n他犹豫片刻，把“另附说明”写进了那里。', eff: { mind: 3 } },
    { id: 'lt_market', age: [60, 115], w: 10,
      text: '菜贩把东西分成两袋，免得你提不动。回去却漏了一袋，豆子滚下台阶。\n\n你用鞋挡住几颗，弯腰时，另一袋也滑到了肘弯。', eff: { money: -300, body: -1 } },
    { id: 'lt_soup', age: [60, 115], w: 10,
      text: '薄锅里的汤刚冒泡，你就把火调小。有人在门外闻着味问，今天煮什么。\n\n你报完菜名，隔壁说比他锅里的好听。', eff: { money: -500, mind: 2 } },
    { id: 'lt_empty_chair', age: [60, 115], req: { spouse: false, kids: [0, 0] }, w: 10,
      text: '你把对面的空椅子挪去堵住漏风的门缝。吃饭时不用再绕过它，屋里也暖了一点。碗洗净倒扣，桌上留不下第二个人用过的痕迹。', eff: { mind: -1 } },
    { id: 'lt_stairs', age: [60, 115], w: 10,
      text: '你靠在二楼歇脚，楼上孩子抱着纸箱跑过三趟。\n\n第三趟他停下来问要不要帮忙。你让他先把挡着扶手的箱子搬开。', eff: { body: -1 } },
    { id: 'lt_rain', age: [60, 115], w: 9,
      text: '雨从窗框渗进来，接水盆在床边响。你挪到桌脚，声音更脆了。\n\n隔壁敲墙问哪儿漏，你们各报了一个位置，都在同一面墙上。', eff: { money: -200, mind: 1 } },
    { id: 'lt_family_photo', age: [60, 105], req: { fn: (S) => livingKids(S).filter((k) => S.age - k.born >= 25).length >= 2 }, w: 12, title: '照片里的第三排',
      text: '孩子们带着各自的孩子来吃饭。屋里坐不下，最小的几个挤到床沿，轮流摸你手上的斑。\n\n有人提议合照，先把桌上的药盒收到镜头外。',
      choices: [
        { t: '请他们都留下吃饭', eff: { money: -8000, mind: 4, set: { lt_grandchildren: 3 }, flag: 'lt_family_gathered' }, r: '三个小孩为多分一块肉吵起来。照片拍了两次，第二次你也没看镜头。' },
        { t: '拍完照就让他们回去', eff: { mind: 2, set: { lt_grandchildren: 3 }, flag: 'lt_family_gathered' }, r: '你把剩菜装进盒子，催他们赶在夜里之前到家。门关上，床单上留下三个浅脚印。' },
      ] },
    { id: 'lt_care_contract', age: [65, 110], w: 12, title: '按次上门',
      text: '照护员把服务表贴在墙上：送饭、换药、陪诊，分别计价。表格最下面是备用钥匙的保管条款。\n\n她等你看完，低头检查下一位住户的门牌。',
      choices: [
        { t: '购买定期照护', req: { money: [30000, null] }, eff: { money: -30000, body: 3, mind: 2, flag: 'lt_care' }, r: '她把上门日期圈出来。你开始按那些日期洗净一只额外的杯子，虽然她从不喝水。' },
        { t: '只留紧急联络号码', eff: { money: -1000, mind: -1 }, r: '号码贴在床头。你试着躺下伸手，发现还得再往低处贴一点。' },
      ] },
  ]);
  CITY.addAch({
    lt_age60: { name: '六十年的证件', desc: '活到六十岁。', tier: 'uncommon', group: '余生', test: (S) => S.age >= 60 },
    lt_age80: { name: '再核对一次', desc: '活到八十岁。', tier: 'epic', group: '余生', test: (S) => S.age >= 80 },
    lt_age100: { name: '填不下的年龄', desc: '活到一百岁。', tier: 'myth', group: '余生', test: (S) => S.age >= 100 },
    lt_asleep: { name: '没有响过的电话', desc: '六十岁以后在睡梦中离世。', tier: 'rare', group: '余生', hidden: true, hint: '床边已经备好明天的水。', test: (S) => !S.alive && S.age >= 60 && (S.flags.lt_sleep_death || /睡梦中/.test(S.death || '')) },
    lt_family: { name: '镜头外的药盒', desc: '晚年与至少两个在世的孩子和三个孙辈合照。', tier: 'rare', group: '余生', test: (S) => S.age >= 60 && livingKids(S).length >= 2 && S.vars.lt_grandchildren >= 3 && !!S.flags.lt_family_gathered },
    lt_alone: { name: '一副碗筷', desc: '六十岁以后离世，没有在世的伴侣和孩子。', tier: 'uncommon', group: '余生', hidden: true, hint: '桌上只用摆一只碗。', test: (S) => !S.alive && S.age >= 60 && !(S.spouse && S.spouse.alive) && !livingKids(S).length },
    lt_poor: { name: '连零钱也没有', desc: '六十岁以后离世，没有积蓄或已分出的遗产。', tier: 'uncommon', group: '余生', hidden: true, hint: '最后一次查账。', test: (S) => !S.alive && S.age >= 60 && S.money <= 0 && !(S.vars.lt_reserve > 0) && !(S.vars.lt_estate > 0) },
    lt_rich: { name: '账户继续亮着', desc: '离世时仍拥有至少一亿眼现金。', tier: 'legend', group: '余生', test: (S) => !S.alive && S.age >= 40 && S.money >= 100000000 },
    lt_pension: { name: '合同兑现', desc: '领到等待多年的退休金。', tier: 'rare', group: '余生', test: (S) => !!S.flags.lt_pension_honored },
    lt_pupil: { name: '五年后的回信', desc: '教过的年轻人在五年后仍能亲自写信。', tier: 'rare', group: '余生', test: (S) => !!S.flags.lt_pupil_survived },
    lt_estate: { name: '零头也算清', desc: '按遗嘱将余款分给在世的孩子。', tier: 'rare', group: '余生', test: (S) => !!S.flags.lt_distributed && S.vars.lt_estate > 0 && S.vars.lt_inheritance.length > 0 },
    lt_marker: { name: '自己选的字', desc: '提前确定墓牌文字并留下副本。', tier: 'common', group: '余生', test: (S) => !!S.flags.lt_stone },
    lt_bolt: { name: '门还锁着', desc: '晚年独自守过后巷深宵，两年后换好门闩。', tier: 'rare', group: '余生', test: (S) => !!S.flags.lt_kept_door && !!S.flags.lt_door_renewed },
    lt_new_life: { name: '另一种饭碗', desc: '中年学艺，三年后靠新手艺接下工作。', tier: 'uncommon', group: '余生', test: (S) => !!S.flags.lt_new_trade },
  });
})();
