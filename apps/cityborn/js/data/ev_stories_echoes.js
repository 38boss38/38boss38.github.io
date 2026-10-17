/* 交织网（批次 16）：把前面批次留下的选择叫回来。
 * 两个故事包走 route 'human'，入口只要求“你曾经做过其中一件事”，
 * 因此不同出身的玩家会以不同的前情进入同一场对话。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  // 入口条件：任意一条前情都能进。
  const PAST = {
    anyflag: ['cargo_confessed', 'cargo_silent', 'cargo_evidence', 'cargo_lied',
      'fed_thief', 'took_from_child', 'turned_away_child',
      'kept_serials', 'gave_serials', 'lied_to_fixer',
      'refunded_medicine', 'clinic_lied', 'paid_lu_debt'],
  };

  // ============ 故事包 1：敲门的人 ============
  p({ id: 'echo_knock', pack: 'B16', title: '敲门的人', route: 'human', person: 'echo_stranger', theme: '前情', age: [20, 70], sources: ['S01'], req: PAST, fixture: S => { S.flags.fed_thief = true; } }, [
    ['楼下有人等你',
      S => {
        if (S.flags.cargo_confessed || S.flags.cargo_silent) return '楼下有人等你，站的位置正好是当年那批货卸车的地方。\n\n他手里没有包，也没有拿伞。\n\n“货场那年少了一箱。”他说，“你还记得是谁的名字被写在表上吗。”';
        if (S.flags.kept_serials || S.flags.gave_serials) return '楼下有人等你，手里捏着一张折过很多次的纸。\n\n“你抄过一串编号。”他说，“我想知道你还留着没有。”\n\n他的指甲缝里有很细的铁屑。';
        if (S.flags.fed_thief || S.flags.took_from_child) return '楼下有人等你，比你记忆里高出一个头。\n\n“你以前在一家便利店上夜班。”他说，“我拿过一罐东西。”\n\n他说这话的时候没有低头。';
        return '楼下有人等你，穿着一件洗得很旧的外套。\n\n“你不认识我。”他说，“但我记得你做过的一件事。”\n\n他没有说是什么事。';
      },
      [
        o('下楼，站在他面前', '你们隔着三步远。\n\n他没有先开口，只是把手里的东西换到另一只手上。', { met: 'down' }, { mind: -1 }),
        o('让他上楼来说', '他进门时在门口蹭了两下鞋，蹭得很仔细。\n\n屋里只有一把椅子，他站着。', { met: 'up' }, { mind: -1 }),
        o('装作不在，从窗口看他走', '他在楼下站了四十分钟。\n\n中间抬起过一次头，正好看见这扇窗。\n\n他没有挥手。', { met: 'hide' }, { mind: -2 }, { goto: 3 }),
      ]],
    ['他记得的那件事',
      S => (S.flags.cargo_confessed ? '“那天表上写的不是你的名字。”他说，“后来改成了你的。”\n\n“改的人是谁，我打听了很多年。”'
        : S.flags.kept_serials ? '“那串编号最后一对不上。”他说，“差的那一位，是有人自己划掉的。”\n\n他把纸摊开，缺口的位置和你的记忆一样。'
        : S.flags.fed_thief ? '“那一罐东西我妹妹没喝完。”他说，“她第二天就好了。”\n\n“我不欠你什么。”他补了一句，“我只是想让你知道。”'
        : '“你大概早就忘了。”他说，“我记了七年。”'),
      [
        o('让他说完', '他说得很慢，中间停了两次。\n\n第二次停的时候，他在数自己的手指。', { heard: 'all' }, { mind: -1 }),
        o('打断他，问他要什么', '他停下来，看了你一会儿。\n\n“要什么。”他重复了一遍，“我还没想好。”', { heard: 'cut' }, { wit: 1 }, { goto: 3 }),
        o('告诉他记错了', '他点点头，把话收了回去。\n\n“那可能是我记错了。”\n\n他走的时候，脚步比来的时候快。', { heard: 'deny' }, { mind: -2 }, { end: '你说那个人记错了，他没有争辩。' }),
      ]],
    ['他要的东西',
      '他要的东西很小。\n\n一句承认，或者一份证明，或者只是让他把那句话说完。\n\n他不肯说哪一种更值钱。',
      [
        o('给他一句承认', '你说完之后，他没有显得轻松。\n\n他把这句话在心里过了一遍，说“不一样”。\n\n“我要的不是这个。”', { gave: 'words' }, { mind: 1, flag: 'echo_admitted' }, { trust: 1 }),
        c('给他钱', ['social', 'wit'], 45,
          o('给他钱', '他数了两遍，退回来一半。\n\n“这一半是我这些年花掉的。”他说，“剩下那一半我没花。”', null, { money: -8000, mind: -1, flag: 'echo_paid' }),
          o('给他钱', '他没有接。\n\n“我不是来要钱的。”\n\n他把钱推回来，推得很慢，推到桌子中间就停了。', null, { mind: -2, flag: 'echo_refused_money' })),
        o('给他一份写着名字的纸', '你写了那张纸，签了名，日期空着。\n\n他看了很久，问能不能把日期也写上。\n\n“否则以后没人信。”', { gave: 'paper' }, { wit: 2, flag: 'echo_gave_paper' }, { trust: 2 }),
      ]],
    ['他走以后',
      '他走后你在原地站了一会儿。\n\n楼道的声控灯灭了一次，又被你一声咳嗽点亮。\n\n他留下的东西还在桌上，或者什么也没留下。',
      [
        o('把他留下的东西收好', '你把它放进抽屉最里面，和别的旧东西放在一起。\n\n抽屉关上的时候，你听见里面轻轻响了一下。', null, { mind: 1, flag: 'echo_kept_it' }, { end: '你把那个人留下的东西收进抽屉，和别的旧东西放在一起。' }),
        c('追下楼去', 'body', 40,
          o('追下楼去', '你在巷口追上他。\n\n他回头，你先说的话。\n\n说完你们两个都站了一会儿，谁也没再往前。', null, { body: -1, mind: 2, flag: 'echo_caught_up' }),
          o('追下楼去', '楼下已经没有人了。\n\n声控灯在你头顶亮了一次，又灭了。', null, { mind: -2 })),
        o('什么也不做，回去睡觉', '你躺下，很快就睡着了。\n\n第二天早上，你想起的第一件事就是他站在楼下的样子。', null, { mind: -1, flag: 'echo_slept' }, { end: '你没有追，也没有收好什么，第二天照常上班。' }),
      ]],
  ]);

  // ============ 故事包 2：没有寄件人的信 ============
  p({ id: 'echo_letter', pack: 'B16', title: '没有寄件人的信', route: 'human', person: 'echo_sender', theme: '前情', age: [24, 75], sources: ['S01'], req: PAST, fixture: S => { S.flags.clinic_lied = true; } }, [
    ['信封',
      S => (S.flags.clinic_lied || S.flags.lied_to_fixer ? '信封里没有信，只有一张纸片，上面抄着一个日期。\n\n那个日期，是有人来问过你、而你说没有的那一天。'
        : S.flags.turned_away_child ? '信封里是一张过期的面包标签，被仔细压平过。\n\n背面用铅笔写了两个字：没关系。'
        : '信封里只有一张纸，写着一句话：\n\n“你那天做的，我后来又做了一次。”'),
      [
        o('把信封收起来', '你把它夹进一本书里，书是随便拿的。\n\n之后每次翻到那一页，都会先停一下。', { kept: true }, { mind: 1, flag: 'echo_kept_letter' }),
        c('去找邮戳', 'wit', 44,
          o('去找邮戳', '信封角上有一个很浅的印，是某个区的邮局。\n\n你去过一次，窗口的人说这种信不用邮戳也能投。', null, { wit: 2, flag: 'echo_found_postmark' }),
          o('去找邮戳', '你对着灯看了很久，什么也没有。\n\n纸是普通的纸，字是普通的字。', null, { mind: -1 })),
        o('烧掉', '你在水槽里点的火。\n\n纸烧起来的时候，那两个字最后才黑。', { burned: true }, { mind: -2, flag: 'echo_burned_letter' }),
      ]],
    ['第二封',
      '第二封信来得比第一封快。\n\n这次里面有称呼，只有一个字。\n\n地址写得很详细，详细到门牌和楼层都对。',
      [
        o('按地址去一趟', '那栋楼在另一个区，坐车要一个多小时。\n\n门是开着的，里面在搬东西。\n\n没有人认得那个名字。', { went: true }, { body: -1, mind: -1, flag: 'echo_went_address' }),
        o('照着地址回一封信', '你写得很短，写完读了三遍。\n\n投进邮筒的时候，你才想起来没有写自己的地址。', { replied: true }, { mind: 2, flag: 'echo_replied' }),
        o('把两封放在一起', '你把它们叠在一起，比了比厚度。\n\n第二封比第一封薄。', { together: true }, { wit: 1, flag: 'echo_two_letters' }),
      ]],
    ['第三封',
      S => (S.flags.echo_replied ? '第三封信里只有一句话：谢谢你写了那么短。' : '第三封信里什么也没有，信封是空的。\n\n但封口是开着的，被人开过。') + '\n\n这一次，信封上有了寄件人的名字。',
      [
        o('把名字记住', '你在纸上写了一遍，写得很正。\n\n写完之后你才发现，这个名字你好像在哪儿听过。', null, { wit: 1, flag: 'echo_knows_sender' }, { end: '你记住了那个名字，虽然还说不清在哪儿听过。' }),
        o('写第四封，问他是谁', '你写了四行，划掉三行。\n\n最后寄出去的那封只有一句：你是谁。', null, { mind: 1, flag: 'echo_asked_who' }, { end: '你寄出了第四封信，只写了一句话。' }),
        o('不再收信', '你在门上贴了一张纸：查无此人。\n\n之后的信都被退回去了。\n\n退信的人来敲过一次门，你没有开。', null, { mind: -1, flag: 'echo_stopped_letters' }, { end: '你在门上贴了“查无此人”，之后没有再收到信。' }),
      ]],
  ]);

  // ============ 15 个事件 ============
  C.addEvents('echoes', [
    { id: 'ec_same_walk', age: [20, 80], w: 10, repeat: true, cd: 14,
      text: '你走的还是那条路，只是路边换了两家店。\n\n有一家的招牌字体和原来那家一模一样。\n\n你没有进去。' },
    { id: 'ec_old_voice', age: [24, 85], w: 9, repeat: true, cd: 14,
      text: '有人叫你的名字，用的还是很多年前的叫法。\n\n你回头，是个不认识的人，他在叫别人。\n\n那个别人和你同名。' },
    { id: 'ec_smell', age: [20, 80], w: 9, repeat: true, cd: 15,
      text: '路过一个巷口，闻见一股很旧的味道。\n\n说不上是什么，可能是机油，也可能是雨前的土。\n\n你在那儿站了一会儿才想起要去哪。' },
    { id: 'ec_receipt_drawer', age: [22, 80], w: 9, repeat: true, cd: 14,
      text: '抽屉里有七张收据，日期都在同一个月。\n\n你不记得那个月为什么留这么多。\n\n最下面那张的字已经看不清了。' },
    { id: 'ec_stranger_nod', age: [24, 85], w: 9, repeat: true, cd: 15,
      text: '街上有人朝你点了一下头。\n\n你确定不认识他，还是回了礼。\n\n他走过去以后，你才想起他可能认错了人。' },

    { id: 'ec_wrong_person', age: [22, 80], req: { loc: 'backstreet' }, w: 9, title: '认错的人',
      text: '有人拦住你，说你是他找了很多年的人。\n\n他说的名字不是你的。\n\n他说完自己也愣了一下。',
      choices: [
        { t: '说不是，帮他一起想', check: { s: 'social', dc: 42 },
          ok: { r: '你们在巷口站了半个小时，把可能的地点排了一遍。\n\n他道谢的时候，眼睛还是红的。', eff: { social: 1, mind: 1, flag: 'ec_helped_wrong' } },
          no: { r: '他说了声抱歉，转身走了。\n\n走了几步又回头看了一眼，像在确认。', eff: { mind: -1 } } },
        { t: '说是我', eff: { mind: -2, flag: 'ec_pretended' }, r: '他抓住你的手，说了很久的话。\n\n你没有听清，只一直在想该怎么结束。\n\n最后是他自己松开的。' },
        { t: '摇头走开', eff: { mind: -1 }, r: '你走得很快。\n\n到街口回头看，他还站在原地，手还抬着。' },
      ] },

    { id: 'ec_old_debt', age: [24, 80], w: 8, title: '一张欠条',
      text: '整理旧东西时翻出一张欠条。\n\n签名的人你还有印象，钱不多。\n\n日期是十一年前。',
      choices: [
        { t: '撕掉', eff: { mind: 1, flag: 'ec_tore_iou' }, r: '纸很脆。\n\n撕完你在垃圾桶边站了一会儿。' },
        { t: '去找他', check: { s: 'social', dc: 44 },
          ok: { r: '他还住在原来的区。\n\n开门看见欠条，他先笑了，说“你还留着这个”。\n\n钱他给了，多给了一点。', eff: { money: 6000, social: 1, flag: 'ec_collected_iou' } },
          no: { r: '那个地址现在是一家卖旧家电的。\n\n老板说不知道以前住的是谁。', eff: { mind: -1 } } },
        { t: '收起来，留着', eff: { wit: 1, flag: 'ec_kept_iou' }, r: '你把它夹回原处。\n\n夹的时候想起他签字的手很稳。' },
      ] },

    { id: 'ec_bread_tag', age: [22, 80], req: { flag: 'fed_thief' }, w: 9, title: '另一个孩子',
      text: '店里又来了一个孩子，站在同一排货架前。\n\n手插在口袋里，站得很久。\n\n你没有立刻过去。',
      choices: [
        { t: '把过期的面包推到手边', eff: { money: -600, mind: 2, flag: 'ec_fed_again' }, r: '他拿了，走了两步又回来，把面包放回原处。\n\n“我不用。”他说。\n\n他走的时候，背挺得很直。' },
        { t: '过去问他需要什么', check: { s: 'social', dc: 40 },
          ok: { r: '他说要找一份活干，什么都行。\n\n你给了他一个搬货的地址，写在一张收据背面。', eff: { social: 1, flag: 'ec_gave_work' } },
          no: { r: '他说了句没什么，转身就走。\n\n口袋里的手一直没有拿出来。', eff: { mind: -1 } } },
        { t: '站在收银台后面看着', eff: { mind: -1, flag: 'ec_watched_child' }, r: '他最后什么也没拿。\n\n出门的时候和我当年一样，风铃没有响。' },
      ] },

    { id: 'ec_serials_use', age: [24, 80], req: { flag: 'kept_serials' }, w: 9, title: '本子的用处',
      text: '本子上的那串编号，今天在一个完全不相干的地方出现了。\n\n一张委托单的附表上，末尾的两位一样。\n\n对方不知道你有这个本子。',
      choices: [
        { t: '把本子拿出来', eff: { wit: 2, mind: -1, flag: 'ec_showed_book' }, r: '你把两页并在一起。\n\n对方看了很久，说这张附表是抄的，抄错了两位。\n\n他没问你为什么会有原件。' },
        { t: '什么也不说，记下来', eff: { wit: 1, flag: 'ec_recorded_again' }, r: '你把那一行抄进本子，抄在原来那串的下面。\n\n两串差两位，像是同一个人的另一种写法。' },
        { t: '把本子烧了', eff: { mind: 1, flag: 'ec_burned_book' }, r: '你在水槽边烧的。\n\n烧到最后一页，你认出那页纸上有一个很小的缺口。' },
      ] },

    { id: 'ec_visit_old', age: [30, 90], w: 8, title: '回原来的地方',
      text: '你回了一趟很多年前住过的地方。\n\n楼道刷过漆，门牌换过。\n\n三楼那户的窗台上还摆着同一种花。',
      choices: [
        { t: '上楼敲门', check: { s: 'social', dc: 46 },
          ok: { r: '开门的人年纪很大。\n\n她说那户人家早搬走了，花是她自己养的，养了十年。\n\n她请你喝了水。', eff: { mind: 2, flag: 'ec_met_old_neighbor' } },
          no: { r: '你敲了三次，没有人应。\n\n下楼的时候，三楼那扇窗的花不见了。', eff: { mind: -2 } } },
        { t: '在楼下站一会儿就走', eff: { mind: 1 }, r: '你数了数楼层，还是七层。\n\n走的时候没有回头。' },
      ] },

    // —— 3 组跨年回响 ——
    { id: 'ec_gave_back', age: [24, 80], w: 8, title: '还回来的东西',
      text: '门口放着一只纸包，包上没有字。\n\n里面是你很多年前给出去的某样东西，被还了回来。\n\n东西比原来旧，但还在。',
      choices: [
        { t: '收下，登记在册', eff: { queue: ['ec_gave_back_back', 9], flag: 'ec_received_back' }, r: '你把它放进抽屉，和其他旧东西放在一起。\n\n抽屉越来越满了。' },
        { t: '转手给需要的人', eff: { mind: 2, queue: ['ec_gave_back_back', 9], flag: 'ec_passed_on' }, r: '你把它给了另一个正在需要的人。\n\n没有说是谁给的。' },
      ] },
    { id: 'ec_gave_back_back', manual: true, age: [30, 95], w: 1,
      text: '九年后，那件东西又回来了。\n\n这次附了一张纸条：\n\n“用过一阵子，还能用。下一个人可能需要。”',
      eff: { mind: 2, flag: 'ec_circulating' } },

    { id: 'ec_name_written', age: [26, 85], w: 8, title: '名字被写下来',
      text: '一份旧名单上，有人把你的名字写在了中间。\n\n不是写在需要你签字的那一栏。\n\n是写在“经手人”下面。',
      choices: [
        { t: '去向写名单的人要个解释', eff: { queue: ['ec_name_back', 7], social: -1, flag: 'ec_asked_list' }, r: '他说是照抄的，抄的是更早的一份。\n\n更早的那份在哪儿，他想不起来了。' },
        { t: '把自己的名字划掉', eff: { queue: ['ec_name_back', 7], wit: 1, flag: 'ec_crossed_name' }, r: '你划了一道，很轻。\n\n划完发现下面还有你的名字，是别人代签的。' },
      ] },
    { id: 'ec_name_back', manual: true, age: [32, 95], w: 1,
      text: '七年后，那份名单被当作证物收走了。\n\n收的人说，上面有你的名字，也有你划的那一道。\n\n“划掉也算。”他说。',
      eff: { mind: -2, flag: 'ec_list_seized' } },

    { id: 'ec_last_room', age: [50, 95], w: 8, title: '旧屋',
      text: '你年轻时住过的那栋楼要拆了。\n\n公告贴在楼下，最后一行写着“请住户按时搬离”。\n\n你不在住户名单上。',
      choices: [
        { t: '进去看一眼', eff: { queue: ['ec_room_back', 5], mind: 1, flag: 'ec_saw_old_room' }, r: '楼道还是那么窄。\n\n门锁换了，从窗口往里看，什么都摆得不一样。' },
        { t: '不进去', eff: { queue: ['ec_room_back', 5], mind: -1, flag: 'ec_skipped_old_room' }, r: '你在楼下站到天黑。\n\n拆楼的日期印在公告上，很清楚。' },
      ] },
    { id: 'ec_room_back', manual: true, age: [56, 99], w: 1,
      text: '五年后，那栋楼的位置立起了一面新的广告牌。\n\n牌子上画着一家三口，在明亮的客厅里笑。\n\n你路过的时候，正好有一盏灯亮起来。',
      eff: { mind: -1, flag: 'ec_place_gone' } },
  ]);
})();
