/* 在既有内容上补分歧和主题标签，不增算为新节点。 */
(function () {
  const C = window.CITY, o = C.storyOption;
  // 这些选择改变后续经过的节点，不只改结算数值。索引均对应作者节点顺序。
  const branches = [
    ['rainhand', 0, 1, (S, d) => d.fault === 'load' ? 2 : 1],
    ['cinq_name', 3, 1, 5], ['oufi_signature', 2, 0, 4],
    ['gang_cart', 0, 0, 2],
    ['family_evening', 3, 1, 5], ['nest_hobby', 3, 1, 5],
  ];
  for (const [id, step, choice, target] of branches) C.STORIES[id].nodes[step].options[choice].goto = target;
  C.STORIES.ice.appendOption(1, o('先售冷柜贵货，不另开灶', '你把人手全钉在冷柜与提货窗口，没去凑门口大锅饭的热闹。\n\n高价罐头赶在断电前出了大半，街坊的热汤则由隔壁摊子接了过去。', { meal: 'cold', kept: true }, { money: 6500, social: -1 }, { req: { fn: S => C.storyData(S, 'ice').data.stock === 'price' }, goto: 3 }));
  C.STORIES.ice.appendOption(2, o('让合用冷藏的邻店接应', '靠着先前拼车的交情，隔壁黑诊所腾出保温箱帮你兜住了大半鲜货。\n\n剩下的热食由你当面交到主顾手里，多贴了一笔脚力钱，没让一个熟客在黑灯瞎火里空等。', { kept: true }, { money: 500, body: -1 }, { req: { fn: S => C.storyData(S, 'ice').data.stock === 'shared' }, trust: 1 }));
  C.STORIES.zwei_exit.appendOption(2, o('从清出的后门分批撤离', '早上蒙眼练熟的领班们死死卡住楼梯拐角，没让惊慌的主顾往正门乱挤。\n\n提前清出来的后楼梯救了全楼的命，三层人马按哨音一批接一批撤进了安全巷。', { protected: true }, { money: 23000, merit: 2 }, { req: { fn: S => { const d = C.storyData(S, 'zwei_exit').data; return d.plan === 'back' && d.drill === 'route'; } }, trust: 1 }));
  C.STORIES.zwei_exit.appendOption(2, o('按预定增援的分工接应', '雇主提前花钱请来的两名同僚准时锁死了后巷两侧，你和搭档不用分心两头跑。\n\n增援费走的是商行公账，整栋楼连一块玻璃柜台都没多碎。', { protected: true }, { money: 21000, merit: 2 }, { req: { fn: S => C.storyData(S, 'zwei_exit').data.plan === 'help' }, trust: 1 }));
  C.STORIES.dieci_morning.appendOption(2, o('保留知识，配合同伴完成', '凭着昨晚拆章互背攒下的深厚储备，你只动用最表层的常识便封死了侧翼，将正面破敌的重任交给了同伴。\n\n昨晚背熟的古籍一页没烧，明早醒来依然历历在目。', { spent: 0 }, { money: 15000, merit: 1 }, { req: { fn: S => C.storyData(S, 'dieci_morning').data.reserve >= 2 } }));
  C.STORIES.seven_return.appendOption(1, o('与信任的联系人共同核验', '联络人记得你上回替两名年轻学徒隐去真名的厚道，破例打开了支部的内部比对档。\n\n你们一页页筛掉掺水的假口供，下一次联手办案再也不用从头试探彼此的底线了。', null, { money: 5000, wit: 2 }, { req: { fn: S => { const x = C.storyData(S, 'seven_return'); return S.contacts[x.person].trust >= 1; } }, end: '你凭着先前结下的厚道信誉，与Seven协会联络人打开了深度核查的默契。' }));
  C.STORIES.thumb_rounds.appendOption(4, o('用确实留下的余量补这次', '你从兜里掏出上回严丝合缝保下的两发实弹，当着军需官的面咔哒按进空槽。\n\n账目一发不差，既没靠假签名糊弄上面，也没让身后的新兵替空弹匣背黑锅。', (S, d) => ({ ammo: d.ammo - 1, teach: true }), { money: -2000, merit: 1 }, { req: { fn: S => C.storyData(S, 'thumb_rounds').data.ammo > 0 } }));
  // 八条旧怪谈各补一个清晰的参与或退出办法，仍使用原来的后续与结局。
  const alternatives = {
    st_hour_shop: { t: '只问现付价格，不赊账', r: '掌柜耷拉着眼皮，死活不肯报出现钱结清的实数。你心里一凛，把还没动筷子的面碗轻轻推回柜台，转身去街角买了块冷硬的合成面包。\n\n凌晨两点前，那扇窄门洞里的红灯笼还在雾里晃荡。', eff: { money: -300, mind: 1 }, req: { money: [300, null] } },
    st_arm: { t: '抄下刻字，交给原摊主查询', r: '你没敢把那条乱动的手臂拎回家，只拿铅笔拓下金属腕上的门牌号塞给旧货摊主。\n\n走出半条街回头看，那五根铁指头还在柜台上笃笃敲着，摊主脸色发白地把价签翻到了背面。', eff: { wit: 1, social: 1 } },
    st_lift: { t: '不留名，只观察后退回', r: '你一眼瞥见轿厢里每个人的后领下方都打着一块一模一样的灰补丁，伸向访客簿的手硬生生缩了回来。\n\n等电梯门合拢，你退回正常楼层的灯光下摸了摸自己的后领——那里干干净净，没有针脚。', eff: { wit: 2, mind: -1 } },
    st_lamps: { t: '先和邻居补一处普通照明', r: '你们没去深究消失的路灯究竟走去了哪条巷子，只凑钱买来一盏带铁丝网的普通矿灯钉在单元门头。\n\n至少今天夜里赶路回家的人，不用先数清地上有几道影子才敢迈步了。', eff: { money: -1000, social: 1, mind: 1 } },
    st_letter: { t: '封好信，照常安排自己的事', r: '你记下了信纸上那个尚未到来的日子，却没打算为了它提前把日子过成守灵。\n\n火漆重新封死、锁进抽屉最底层，明早该出的工一趟不落。', eff: { flag: 'st_letter_kept', queue: ['st_letter_date', 3], mind: 1 } },
    st_lottery: { t: '放弃奖金，取回未签的票据', r: '你盯着协议背面那行“中奖者须定期提供生理样本追踪”的小字，一言不发地抽回了还没签字的奖券。\n\n走出兑奖窗口时，身后的强光灯咔嚓亮起，对准了下一个欢天喜地凑上去的幸运儿。', eff: { mind: 2 } },
    st_memory: { t: '只谈清交易范围，再决定不卖', r: '你逼着店员先写明抽取器会连带刮走哪几年的记忆，对方支支吾吾地始终不肯画押。\n\n你拔掉额角的吸盘推门而出——那点回忆确实卖不出几个钱，但好歹还长在你自己脑子里。', eff: { wit: 1, mind: 1 } },
    st_night_job: { t: '只做白天能核清的搬运', r: '你只赶在日落前替仓库卸完了外院的三车明面货，当场点清白班工钱。\n\n至于那份高薪的守夜合约，你在天擦黑前拍拍屁股走出了大铁门，连名字都没往花名册上留。', eff: { money: 1500, body: -1 } },
  };
  const groups = [
    ['hour', ['st_hour_shop', 'st_hour_bill', 'st_hour_guest']], ['arm', ['st_arm', 'st_arm_knock', 'st_arm_box']],
    ['lift', ['st_lift', 'st_lift_notice', 'st_lift_seal']], ['lamps', ['st_lamps', 'st_lamp_plan', 'st_lamp_last']],
    ['letter', ['st_letter', 'st_letter_date', 'st_letter_reply']], ['lottery', ['st_lottery', 'st_lottery_list', 'st_lottery_stub']],
    ['memory', ['st_memory', 'st_memory_buyer', 'st_memory_return']], ['night', ['st_night_job', 'st_night_renew', 'st_night_vacant']],
  ];
  for (const [group, ids] of groups) for (const id of ids) C.getEvent(id).content = { group: 'strange:' + group, theme: '怪谈', sources: ['S29'] };
  for (const [id, spec] of Object.entries(alternatives)) C.getEvent(id).choices.push({ ...spec, req: { ...spec.req, fn: S => S.rulesVersion >= 4 } });
  // 接受线索才得到来历明确的实物；把旧“永久加属性”换成可持有的工具。
  const tools = C.getEvent('st_arm_box').choices[0];
  const before = tools.eff;
  tools.eff = S => { if (S.rulesVersion >= 4) C.apply(S, { item: ['patched_case', 'work_gloves'], ach: 'st_hand_home' }); else C.apply(S, before); };
  const oldResult = tools.r;
  tools.r = S => S.rulesVersion >= 4 ? '木箱底层的旧工具箱与防滑手套还算趁手，你抖掉灰尘收进随身行囊。\n\n至于箱角那袋泛着甜腥气的灰白面粉，你连封口都没敢拆，原样钉死在了旧木箱里。' : oldResult;
})();

