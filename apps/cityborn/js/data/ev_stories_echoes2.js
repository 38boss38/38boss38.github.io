/* 交织网二（批次 20）：把中段批次的选择接到世界线上。
 * 《还人情的人》读事务所/面摊/便利店几条线；《那箱货》读货场线，并把它接到收尾人与协会那一侧。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  const FAVOR = { anyflag: ['of_paid_su', 'of_covered_junior', 'of_fixed_it', 'lu_debt', 'paid_lu_debt', 'fed_thief', 'clinic_lied', 'stayed_with_wei'] };
  const CASE = { anyflag: ['cargo_confessed', 'cargo_silent', 'cargo_lied', 'cargo_evidence', 'cargo_covered', 'cargo_vague'] };

  // ============ 故事包 1：还人情的人 ============
  p({ id: 'echo_favor', pack: 'B20', title: '还人情的人', route: 'human', person: 'favor_man', theme: '前情', age: [22, 70], sources: ['S01'], req: FAVOR, fixture: S => { S.flags.of_paid_su = true; } }, [
    ['他记得',
      S => (S.flags.of_paid_su || S.flags.of_half_su ? '来的人自称姓苏的远亲。\n\n“他提过你的名字。”他说，“说那年押金是你先垫的。”\n\n他手里没有东西，是空着手来的。'
        : S.flags.lu_debt || S.flags.paid_lu_debt ? '来的人在巷口那家面摊坐了很久。\n\n“摊子换了人。”他说，“但账还在。”\n\n他从口袋里摸出一张纸，纸上是{old_lu}的字。'
        : S.flags.fed_thief ? '来的人是当年那个孩子的哥哥。\n\n他现在比当年那个孩子高，说话也慢。\n\n“我一直想问一件事。”他说。'
        : '来人报了自己的名字，你没有印象。\n\n“那年你替我说过一句话。”他说，“我一直记着。”'),
      [
        o('请他进屋坐下说', '他坐得很直，手放在膝盖上。\n\n屋里的灯有点暗，他没有要求换。', { met: 'in' }, { mind: -1 }),
        o('在门口听他说完', '他站在门口说，说了很久。\n\n中间有两层楼的邻居经过，都放慢了脚步。', { met: 'door' }, { mind: -1 }),
        o('说自己不记得了', '他把话停在一半。\n\n“那可能是我认错人了。”\n\n他退了一步，才转身。', { met: 'deny' }, { mind: -2 }, { end: '你说不记得了，他没有再解释。' }),
      ]],
    ['他要的那件事',
      '他不是来还钱的。\n\n他要的是一件你现在不太方便给的东西：一个名字、一份签字、或者一次替他说话。\n\n“不用现在答。”他说，“我等得起。”',
      [
        o('先问清楚会有谁受牵连', '他说了两个名字，一个是他自己，一个是别人。\n\n说到第二个名字时，他换了一口气。', { ask: 'who' }, { wit: 2 }),
        o('直接答应', '他愣了一下，说“你都不问清楚”。\n\n“不用问。”你说。\n\n他没再说什么，把帽子拿在手里转了一圈。', { ask: 'yes' }, { mind: 1, flag: 'echo2_promised' }, { trust: 1 }),
        c('问他为什么现在才来', 'social', 44,
          o('他说一直在等自己混出个样子', '“没混出来。”他说得很干脆，“所以现在来了。”\n\n他说完自己笑了。', null, { wit: 1, mind: -1 }, { trust: 1 }),
          o('他说是有人让他来的', '“有人跟我说，这事只有你能帮。”\n\n他不肯说是谁。\n\n你问了三遍。', null, { mind: -2, flag: 'echo2_sent_by' })),
      ]],
    ['代价',
      '这件事要花的，是你攒了很久的某样东西。\n\n不是钱，是更麻烦的那种：一个位置、一次机会、一个还没用掉的人情。',
      [
        o('拿出去', '你把它拿出去，办得很干净。\n\n回来的时候天已经黑了，路上没有人。', { gave: 'yes' }, { money: -12000, mind: 2, flag: 'echo2_gave' }, { trust: 2 }),
        o('只办一半', '你办了一半，另一半推给了时间。\n\n对方没有催，但也没有再来。\n\n后来那半件自己长出了别的结果。', { gave: 'half' }, { money: -5000, mind: -1, flag: 'echo2_half' }),
        o('反悔', '你把话收回去，收回得很慢。\n\n他听完，点了点头，说“我明白”。\n\n他走的时候还替你把门带上了。', { gave: 'no' }, { mind: -3, flag: 'echo2_refused' }, { trust: -2 }),
      ]],
    ['后来的事',
      S => (S.flags.echo2_gave ? '他后来真的做成了那件事。' : S.flags.echo2_half ? '那件事做成了半件，剩下半件悬着。' : '那件事最后没成。') + '\n\n一年后你才听说，他把自己那份也拿出来了。\n\n“他说欠着不舒服。”说这话的人笑了一下。',
      [
        o('去见他一面', '他在一间很小的屋子里，桌上摊着账。\n\n“你来了。”他说，“我以为你不会来。”\n\n你们喝了茶，谁都没提那件事。', null, { mind: 2, flag: 'echo2_met_again' }, { end: '你去见了那个还人情的人，谁都没提那件事。' }),
        o('不去，把那页账合上', '你把那页合上，和其他的一起放进抽屉。\n\n抽屉已经很满了。', null, { mind: 1, flag: 'echo2_closed' }, { end: '你没有去见他，把那一页账合上了。' }),
      ]],
  ]);

  // ============ 故事包 2：那箱货 ============
  p({ id: 'echo_case', pack: 'B20', title: '那箱货', route: 'human', person: 'case_fixer', theme: '前情', age: [24, 70], sources: ['S02'], req: CASE, fixture: S => { S.flags.cargo_confessed = true; } }, [
    ['有人还在查',
      S => (S.flags.cargo_confessed ? '一个收尾人找上门，先报了自己的名字和事务所。\n\n“那箱货。”他说，“当年有个孩子在表上被写过名字。”\n\n“他现在要一个说法。”'
        : S.flags.cargo_lied ? '一个收尾人找上门，手里拿着一份时间表。\n\n“那天晚上有人问过你时间。”他说，“你说了。”\n\n表上圈着一行。'
        : '一个收尾人找上门，把一张照片放在桌上。\n\n照片里是那批货的卸货点，箱子摆成一排，少了一箱的位置很显眼。\n\n“这案子还没结。”他说。'),
      [
        o('请他坐下，把知道的都说了', '他记了四页，最后一页只写了两个名字。\n\n写完之后他把本子合上，问你还有没有。\n\n你说没有了。', { talk: 'all' }, { mind: -2, flag: 'echo2_told_case', wit: 1 }),
        o('问这案子为什么现在才查', '“有人一直在递材料。”他说，“递了七年。”\n\n他没有说是谁。', { talk: 'why' }, { wit: 2 }),
        o('说不知道', '他看了你一会儿，把照片收起来。\n\n“那我下次再来。”\n\n他下次真的来了。', { talk: 'no' }, { mind: -2, flag: 'echo2_denied_case' }, { goto: 2 }),
      ]],
    ['他要的东西',
      '他要的不是口供，是一份可以放进卷宗的书面说明。\n\n写就得署名。\n\n“署名的人以后要在协会那边留档。”他说，“这一点我先讲清楚。”',
      [
        o('署自己的名字', '你写了两页，署了名。\n\n他看完，说这份很有用。\n\n“有用”这两个字，他说得很轻。', { sign: 'yes' }, { fame: 2, mind: 1, flag: 'echo2_signed_case' }, { trust: 2 }),
        c('先看一遍卷宗里已有的材料', 'wit', 46,
          o('你在材料里看见自己的名字', '夹在其他十几个名字中间，写的是“在场”。\n\n你说要回去想一想。\n\n他没有催。', null, { wit: 2, mind: -1, flag: 'echo2_saw_file' }, { trust: 1 }),
          o('材料里少了一页', '页码从十一跳到十三。\n\n你问他，他说“原件不在我这里”。\n\n他合上卷宗的速度很快。', null, { mind: -2, flag: 'echo2_missing_page' }, { goto: 2 })),
        o('不署名，但把能说的都说了', '他照你说的记，记完念了一遍给你听。\n\n念到某一句时，你让他停了一下。\n\n他把那句划掉了，没有问为什么。', { sign: 'no' }, { mind: -1, flag: 'echo2_unspoken' }),
      ]],
    ['卷宗合上之前',
      S => (S.flags.echo2_saw_file ? '他说卷宗会在下个月归档。' : S.flags.echo2_missing_page ? '他说卷宗可能要重做，缺的那一页找不回来。' : '他说卷宗会在下个月归档。') + '\n\n归档之后，名字就定在上面了。\n\n“要不要再看一眼。”他问。',
      [
        o('看', '你从头看到尾，看得很慢。\n\n看到自己那一行，停了很久。\n\n那一行写得很短，短得像一句公文。', null, { mind: -2, wit: 2, flag: 'echo2_read_file' }, { end: '你把卷宗从头看到尾，自己那一行写得很短。' }),
        o('不看了', '他把卷宗合上，夹在腋下。\n\n“那就这样。”\n\n他走到门口，又回头补了一句：那个孩子现在在读夜校。', null, { mind: 1, flag: 'echo2_did_not_read' }, { end: '你没有再看那份卷宗，只记住了那个孩子现在在读夜校。' }),
      ]],
  ]);

  // ============ 12 个事件 ============
  C.addEvents('echoes2', [
    { id: 'e2_same_coat', age: [22, 80], w: 10, repeat: true, cd: 14,
      text: '街上有人穿着和你一样的外套，颜色旧成同一种。\n\n他走在你前面，步子比你快。\n\n你跟着走了一段，才发现自己在跟。' },
    { id: 'e2_two_receipts', age: [22, 80], w: 9, repeat: true, cd: 14,
      text: '口袋里有同一笔账的两张收据，日期差一天。\n\n一张是你自己放的，另一张不记得。\n\n两张的字迹都是你的。' },
    { id: 'e2_letter_unopened', age: [24, 85], w: 9, repeat: true, cd: 15,
      text: '抽屉里有一封没拆的信，边角已经磨毛了。\n\n你每次整理都会把它拿出来，再放回去。\n\n放回去的时候，位置一点没变。' },
    { id: 'e2_same_question', age: [24, 85], w: 9, repeat: true, cd: 15,
      text: '有人问你一个和很多年前一样的问题。\n\n这次你答得很快。\n\n答完才发现，快是因为早就想过了。' },
    { id: 'e2_shop_gone', age: [26, 85], w: 9, repeat: true, cd: 15,
      text: '你常去的那家店关门了，卷闸上贴着纸条。\n\n纸条只写了“有事”，没有电话，没有日期。\n\n卷闸下面塞着两张传单，被雨泡软了。' },

    { id: 'e2_offer_silence', age: [24, 80], w: 9, title: '封口',
      text: '有人出一笔钱，让你以后不要再提某件事。\n\n他说得很客气，还问你现在住得远不远。\n\n钱装在一只没有标志的信封里。',
      choices: [
        { t: '收下', eff: { money: 20000, mind: -3, flag: 'e2_took_silence' }, r: '他走之后你数了一遍，数完把信封放进米缸。\n\n那袋米你吃了很久。' },
        { t: '退回去', eff: { mind: 1, flag: 'e2_refused_silence' }, r: '他没有坚持，把信封收进内袋。\n\n“那就当我没来过。”\n\n他走的时候，脚步比来的时候轻。' },
        { t: '问他要封谁的口', check: { s: 'social', dc: 46 },
          ok: { r: '他报了一个名字，报得很自然。\n\n那个名字你很熟。\n\n“所以你该明白我为什么来。”', eff: { wit: 2, mind: -1, flag: 'e2_knew_who' } },
          no: { r: '他笑了笑，说“你何必知道”。\n\n他把信封留在了桌上。\n\n你没有动它，也没有还回去。', eff: { mind: -2, flag: 'e2_envelope_left' } } },
      ] },

    { id: 'e2_old_photo', age: [26, 85], w: 9, title: '多出来的一个人',
      text: '一张旧照片上有六个人，你只认得出四个。\n\n第五个是拍照的人，第六个站在最边上。\n\n你完全不记得那天有第六个人。',
      choices: [
        { t: '拿去问还认得出的人', check: { s: 'social', dc: 44 },
          ok: { r: '他看了很久，说那是“临时来的”。\n\n“临时来做什么？”\n\n他说不记得了。', eff: { wit: 2, flag: 'e2_asked_sixth' } },
          no: { r: '能问的人都不在了。\n\n你翻到最后一家，门牌换了。', eff: { mind: -2 } } },
        { t: '把照片翻过来看背面', eff: { wit: 1, flag: 'e2_photo_back' }, r: '背面写着日期和一行字。\n\n字被水泡开过，只认得出“别让他”。' },
        { t: '不再看它', eff: { mind: 1 }, r: '你把照片夹回原来的本子里。\n\n那天之后你很少翻那本。' },
      ] },

    { id: 'e2_debt_cleared', age: [26, 85], w: 9, title: '有人替你还了',
      text: '你去还钱，对方说已经还清了。\n\n“上个月有人来还的。”他说，“没留名字。”\n\n他把收条找出来，上面的字是陌生的。',
      choices: [
        { t: '把收条要过来', eff: { wit: 1, mind: -1, flag: 'e2_kept_receipt' }, r: '收条上的字很好看，是一笔一笔写的。\n\n你把它对着灯看，纸里有很细的纤维。' },
        { t: '问是谁来还的', check: { s: 'social', dc: 42 },
          ok: { r: '他说是个年轻人，穿得不坏。\n\n“他问我你最近怎么样。”\n\n说到这里他停了一下。', eff: { social: 1, flag: 'e2_knew_payer' } },
          no: { r: '他说记不清了，来的人很多。\n\n他把收条收回去，说你不用管了。', eff: { mind: -1 } } },
        { t: '算了，就当还了', eff: { mind: 2, flag: 'e2_accepted_payment' }, r: '你出门的时候，天正在放晴。\n\n那笔钱你没有花掉，留着。' },
      ] },

    { id: 'e2_last_word', age: [30, 90], w: 8, title: '一句话',
      text: '有人在最后的时候想见你。\n\n传话的人说，他只说了一句话：“有些事我该早点说。”\n\n他住在很远的地方。',
      choices: [
        { t: '去', eff: { body: -2, mind: 2, queue: ['e2_word_back', 6], flag: 'e2_went_last' }, r: '你赶到的时候他还醒着。\n\n他说话很吃力，说了三句。\n\n第三句没有说完。' },
        { t: '不去', eff: { mind: -3, queue: ['e2_word_back', 6], flag: 'e2_skipped_last' }, r: '你没有去。\n\n传话的人后来又来了一次，说他已经走了。\n\n他说这话时没有责怪你的意思，这让你更难受。' },
      ] },
    { id: 'e2_word_back', manual: true, age: [36, 95], w: 1,
      text: '六年后，有人交给你一封信，说是当年托他保管的。\n\n信里只有一句：\n\n“那件事不是你的错。”\n\n字很抖，但每个字都写完了。',
      eff: { mind: 3, flag: 'e2_last_letter' } },

    { id: 'e2_pawn_ticket', age: [24, 80], w: 8, title: '过期的当票',
      text: '一张当票过期了三天。\n\n柜台后面的人说，过期的东西已经处理掉了。\n\n“处理”两个字他念得很轻。',
      choices: [
        { t: '问能不能找回来', check: { s: 'social', dc: 46 },
          ok: { r: '他翻了很久，从最下面一只箱子里拿出来。\n\n“这次算你运气好。”\n\n他要加收一笔，你给了。', eff: { money: -6000, mind: 1, flag: 'e2_recovered_pawn' } },
          no: { r: '他摇头，说这一批已经出了柜。\n\n你再问，他就去招呼别人了。', eff: { mind: -2 } } },
        { t: '把当票撕了', eff: { mind: 1, flag: 'e2_tore_pawn' }, r: '撕完你才想起来，那张票上的字是你自己写的。' },
      ] },

    { id: 'e2_found_box', age: [26, 85], req: { flag: 'cargo_evidence' }, w: 9, title: '那张底',
      text: '你收了很多年的那张底，纸已经发黄。\n\n上面的编号还清楚。\n\n今天有人在门上塞了一张纸条，问“东西还在不在”。',
      choices: [
        { t: '把纸取出来，对一遍', eff: { wit: 2, queue: ['e2_box_back', 8], flag: 'e2_checked_slip' }, r: '编号还是那串，末尾两位没有变。\n\n你把它放回去，位置换了，换成更靠里的地方。' },
        { t: '把纸条烧了', eff: { mind: -1, queue: ['e2_box_back', 8], flag: 'e2_burned_note' }, r: '纸条烧得很快，灰落在水槽里。\n\n那张底你没有动。' },
      ] },
    { id: 'e2_box_back', manual: true, age: [34, 95], w: 1,
      text: '八年后，一个不认识的人在楼下等你，手里拿着一只旧纸袋。\n\n“有人让我把这个还给你。”\n\n纸袋里是那张底，被塑封过，边角很整齐。',
      eff: { mind: 1, flag: 'e2_slip_returned' } },
  ]);
})();
