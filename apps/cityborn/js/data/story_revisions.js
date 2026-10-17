/* 在既有内容上补分歧和主题标签，不增算为新节点。 */
(function () {
  const C = window.CITY, o = C.storyOption;
  // 这些选择改变后续经过的节点，不只改结算数值。索引均对应作者节点顺序。
  const branches = [
    ['rainhand', 0, 1, (S, d) => d.fault === 'load' ? 2 : 1],
    ['cinq_name', 3, 1, 5], ['oufi_signature', 2, 0, 4],
    ['r_roll', 3, 1, 5], ['t_hours', 3, 1, 5], ['k_seals', 3, 1, 5],
    ['l_check', 3, 1, 5], ['u_dinner', 3, 1, 5], ['h_garden', 3, 1, 5],
    ['j_pawn', 3, 0, 5], ['gang_cart', 0, 0, 2],
    ['family_evening', 3, 1, 5], ['nest_hobby', 3, 1, 5],
  ];
  for (const [id, step, choice, target] of branches) C.STORIES[id].nodes[step].options[choice].goto = target;
  C.STORIES.ice.appendOption(1, o('先售冷柜贵货，不另开灶', '你把有限人手留给冷柜与提货，没再承诺一顿来不及做的热饭。贵货卖完一些，街坊的灶位由别人接下。', { meal: 'cold', kept: true }, { money: 6500, social: -1 }, { req: { fn: S => C.storyData(S, 'ice').data.stock === 'price' }, goto: 3 }));
  C.STORIES.ice.appendOption(2, o('让合用冷藏的邻店接应', '你们提前分过车位，邻店把留出的那部分接进冷藏。剩余热食仍由你当面交清，多付一次搬运，没有再让顾客等车。', { kept: true }, { money: 500, body: -1 }, { req: { fn: S => C.storyData(S, 'ice').data.stock === 'shared' }, trust: 1 }));
  C.STORIES.zwei_exit.appendOption(2, o('从清出的后门分批撤离', '带路的人按演练站好，你们不用临场把人全挤在正门。后门留出的空间真正派上用场，人和接应顺序都按准备接上。', { protected: true }, { money: 23000, merit: 2 }, { req: { fn: S => { const d = C.storyData(S, 'zwei_exit').data; return d.plan === 'back' && d.drill === 'route'; } }, trust: 1 }));
  C.STORIES.zwei_exit.appendOption(2, o('按预定增援的分工接应', '雇主先前确认的增援接到明确位置，你和搭档不用独自守完两边。新增费用由原约承担，保护也按约完成。', { protected: true }, { money: 21000, merit: 2 }, { req: { fn: S => C.storyData(S, 'zwei_exit').data.plan === 'help' }, trust: 1 }));
  C.STORIES.dieci_morning.appendOption(2, o('保留知识，配合同伴完成', '你按准备过的分工完成外围，让更适合的人承担正面。留住的知识明天仍能用，今天也确实接住了自己的那一段。', { spent: 0 }, { money: 15000, merit: 1 }, { req: { fn: S => C.storyData(S, 'dieci_morning').data.reserve >= 2 } }));
  C.STORIES.seven_return.appendOption(1, o('与信任的联系人共同核验', '对方知道你上次怎样处理证人，愿意开放先前保留的一处普通材料。你们只核其中能确认的部分，下一次合作也终于不全从陌生开始。', null, { money: 5000, wit: 2 }, { req: { fn: S => { const x = C.storyData(S, 'seven_return'); return S.contacts[x.person].trust >= 1; } }, end: '你以先前留下的信任换来了一次更可靠的核验。' }));
  C.STORIES.thumb_rounds.appendOption(4, o('用确实留下的余量补这次', '你交出先前保住的实际余量，领用按真实数量登记。少掉的那部分不再算作仍在你枪里，也没让新人替空缺签字。', (S, d) => ({ ammo: d.ammo - 1, teach: true }), { money: -2000, merit: 1 }, { req: { fn: S => C.storyData(S, 'thumb_rounds').data.ammo > 0 } }));
  C.STORIES.camp_guide.appendOption(0, o('出示营地木片，核当前可走的路', '向导认得那片普通木片，愿意直接告诉你这几天变过的土路。你们仍逐段确认，不把一次认识当成穿过所有未知的许可。', { scope: 'partner' }, { wit: 1 }, { req: { item: 'route_token' } }));
  // 八条旧怪谈各补一个清晰的参与或退出办法，仍使用原来的后续与结局。
  const alternatives = {
    st_hour_shop: { t: '只问现付价格，不赊账', r: '老板始终不肯说付多少就能结清，你把碗放回去，改到街角买了普通热食。两点之前，门洞里的灯还亮着。', eff: { money: -300, mind: 1 }, req: { money: [300, null] } },
    st_arm: { t: '抄下刻字，交给原摊主查询', r: '你只把已看见的地址交给摊主，没领走手臂。走远时，它还在柜台上敲，摊主终于把方向正常那张标签翻了过去。', eff: { wit: 1, social: 1 } },
    st_lift: { t: '不留名，只观察后退回', r: '你看见每件外套的补口都在同一处，没把手伸向访客簿。门合上以后，你在正常楼层看了看自己的袖口，那里没有补丁。', eff: { wit: 2, mind: -1 } },
    st_lamps: { t: '先和邻居补一处普通照明', r: '你们不解开灯为什么消失，只把确实能用的小灯装到门边。那一夜有人从光下回家，没被要求先看懂所有影子。', eff: { money: -1000, social: 1, mind: 1 } },
    st_letter: { t: '封好信，照常安排自己的事', r: '你记下日期，不替它预先放弃那几天。信封封好放进抽屉，明天该做的普通活仍照常接下。', eff: { flag: 'st_letter_kept', queue: ['st_letter_date', 3], mind: 1 } },
    st_lottery: { t: '放弃奖金，取回未签的票据', r: '你没有签样本追踪，奖金也没有领取。走出窗口时听见补光灯又亮了，自己手上仍只有那张不再打算兑现的彩票。', eff: { mind: 2 } },
    st_memory: { t: '只谈清交易范围，再决定不卖', r: '你让店员先说究竟会取走哪段，对方始终不肯保证。那点记忆仍不值多少，却没有为了一个价钱立刻从你这里消失。', eff: { wit: 1, mind: 1 } },
    st_night_job: { t: '只做白天能核清的搬运', r: '你在仓库外做完一趟普通搬运，领清当天工钱。夜班邀请没有签下，天黑以前，你也没有留在那扇门前。', eff: { money: 1500, body: -1 } },
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
  tools.r = S => S.rulesVersion >= 4 ? '箱里的普通工具与手套还能用，你收进随身物品。你没有尝那袋面粉，将它留在已经封好的旧箱角。' : oldResult;
})();
