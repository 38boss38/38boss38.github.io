/* 钱这一条线（批次 29）：40 个不分身份的事件。
 * 从第一次拿到工钱，到借、被欠、还清、以及给不出去。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'mon_' + id, age: age || [16, 95], req: req || {}, w: 11, repeat: true, cd: 13, text, ...(eff ? { eff } : {}),
  });

  // ---------- 12 个无选项 ----------
  amb('first_pay', '第一次拿到工钱，是一叠薄薄的纸。\n\n你在巷口数了两遍，数完塞进最里面的口袋。\n\n走路的时候，你一直用手按着那个口袋。', { money: 2000 }, [16, 24]);
  amb('coin_jar', '罐子里的硬币满了，倒出来铺了一桌。\n\n你按面值排好，排到最后差一点。\n\n差的这一点，你已经攒了三个月。');
  amb('wrong_note', '一张钞票的边角发毛，摸上去比别的软。\n\n你对着灯照了照，水印浅得像褪色。\n\n你还是把它花出去了。');
  amb('split_bill', '吃完结账，六个人，账单一张。\n\n有人算得快，有人一直说自己没吃那道菜。\n\n最后每个人多出了几十眼。');
  amb('raise_slip', '工资条上多了一栏，字很小。\n\n加起来比上月多两百眼。\n\n你把那张纸条折起来，折得比平时整齐。');
  amb('fine_notice', '罚款单贴在更衣室门上，写着工号，没有写名字。\n\n那个工号是你的。\n\n“原因”那一栏印着“违反规定”，后面的编号是几号规定，没人知道。', { money: -1500 });
  amb('pawn_window', '当铺的窗口很小，只能递进一只手。\n\n里面的人接过东西，翻过来看背面。\n\n他看的永远不是你希望他看的那一面。');
  amb('empty_wallet', '钱包里只剩一张纸，是上个月的收据。\n\n你把它抽出来看了看，又放回去。\n\n至少钱包还是鼓的。');
  amb('paid_forward', '有人替你把面钱付了，只留一句“下次你请”。\n\n你端着碗站了一会儿。\n\n下次是哪次，他没有说。', { money: 500 });
  amb('count_twice', '数钱的时候，你习惯数两遍。\n\n第二遍总比第一遍慢。\n\n有人问你在数什么，你说没什么。');
  amb('borrowed_coat', '借来的一件外套，口袋里有一张折好的纸币。\n\n不是你的，也不是主人忘的——折得很整齐，像特意留的。\n\n你还了外套，没有提那张钱。');
  amb('savings_plan', '你在一张纸上算了三遍。\n\n按这个数，两年能攒够；按那个数，三年。\n\n算完你把纸贴在柜门内侧，朝里。');

  // ---------- 14 个带选项 ----------
  E.push({ id: 'mon_lend_friend', age: [18, 85], w: 10, title: '借出去的钱',
    text: '一个以前一起干活的人来借钱，数目不小。\n\n他说三个月还，说得很快。\n\n他手上有一道新伤，没有包扎。',
    choices: [
      { t: '借给他', check: { s: 'social', dc: 44 },
        ok: { r: '他把钱数完，说了两遍“三个月”。\n\n走的时候在门口回了下头。', eff: { money: -8000, mind: 1, flag: 'mon_lent_friend' } },
        no: { r: '你把钱给他，他接过去的时候手在抖。\n\n“三个月。”他说。\n\n之后你再没见过他。', eff: { money: -8000, mind: -2, flag: 'mon_lent_badly' } } },
      { t: '借一半', eff: { money: -4000, wit: 1, flag: 'mon_lent_half' }, r: '他接了，说了声谢谢，声音比刚才低。\n\n“一半也行。”\n\n他说这话的时候没有看你。' },
      { t: '说自己也紧', eff: { mind: -1 }, r: '他点点头，说“那我再问问”。\n\n他在门口站了一会儿才走。' },
    ] });

  E.push({ id: 'mon_owed', age: [18, 85], w: 9, title: '欠了三个月',
    text: '借出去的钱，三个月到了。\n\n对方没有提，也没有躲。\n\n你们在同一个地方干活，每天见面。',
    choices: [
      { t: '当面问', check: { s: 'social', dc: 42 },
        ok: { r: '他愣了一下，说“我以为是下个月”。\n\n当天下午他把钱送来，一张一张数给你。', eff: { money: 8000, wit: 1, flag: 'mon_collected' } },
        no: { r: '“再等等。”他说，“再给我一个月。”\n\n他说完就去搬东西了，没有再看你。', eff: { mind: -2, flag: 'mon_waited_more' } } },
      { t: '不提，等他自己说', eff: { mind: -1, flag: 'mon_waited' }, r: '又过了两个月。\n\n有一天他递给你一包烟，说是别人给的。\n\n钱的事谁也没提。' },
      { t: '跟别人打听他最近怎么样', eff: { wit: 2, flag: 'mon_asked_around' }, r: '有人说他家里出了事，也有人说他把钱输掉了。\n\n两种说法都是听来的。' },
    ] });

  E.push({ id: 'mon_pay_back', age: [18, 85], w: 9, title: '还钱',
    text: '你欠的那笔，今天能还上了。\n\n钱数了三遍，用纸包好。\n\n对方说过不急，但一直没说不还。',
    choices: [
      { t: '当面还，说清利息', eff: { money: -9000, mind: 2, flag: 'mon_repaid_full' }, r: '他数完，把多出来的那部分退给你。\n\n“这个不用。”\n\n你说该给的。他还是推回来了。' },
      { t: '只还本钱', eff: { money: -8000, mind: -1, flag: 'mon_repaid_principal' }, r: '他接了，没说什么。\n\n你把纸包收回来的时候，他还站在那儿。' },
      { t: '问他当时为什么肯借', check: { s: 'social', dc: 44 },
        ok: { r: '“不顺眼的不借。”他说得很轻松。\n\n后来你才知道，他借出去的钱大部分没回来。', eff: { wit: 2, mind: 1, flag: 'mon_asked_why' } },
        no: { r: '“那么久的事。”\n\n他把钱收进抽屉，抽屉里有好几只这样的纸包。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'mon_give_refused', age: [24, 90], w: 9, title: '给不出去',
    text: '你想给一个人钱。\n\n不是借，也不是还，就是想给。\n\n他说不要，说得很客气，也很坚决。',
    choices: [
      { t: '换成东西给他', eff: { money: -3000, social: 1, mind: 2, flag: 'mon_gave_goods' }, r: '你买了他一直舍不得买的那样东西，放在他门口。\n\n第二天他把它带来，说“太贵了”。\n\n他说着，没有放下。' },
      { t: '坚持给钱', eff: { mind: -2 }, r: '他最后收了，收得很勉强。\n\n之后你们见面少了一些。' },
      { t: '收回去', eff: { mind: 1, flag: 'mon_kept_it' }, r: '你把钱收起来。\n\n“那我留着。”你说。\n\n他笑了一下，说“对，留着”。' },
    ] });

  E.push({ id: 'mon_installment', age: [20, 85], w: 9, title: '分期',
    text: '分期要签一张单子。\n\n单子上有十二个小格，每付一次划掉一个。\n\n空格旁边印着一行小字：逾期按日计息。',
    choices: [
      { t: '签', eff: { money: 12000, mind: -2, flag: 'mon_signed_installment' }, r: '你把名字写在最后。\n\n对方把单子对折，说“第一格下个月一号”。' },
      { t: '问逾期一天怎么算', check: { s: 'wit', dc: 44 },
        ok: { r: '他算给你听，算得很快。\n\n你听完，把期限往后挪了两天再签。', eff: { money: 12000, wit: 2, flag: 'mon_better_terms' } },
        no: { r: '他含糊了一句，说“都是这么算的”。\n\n你签了。第一个月就明白那句话的意思。', eff: { money: 12000, mind: -3, flag: 'mon_bad_terms' } } },
      { t: '不签，少花一点', eff: { mind: 1 }, r: '你把东西放回货架。\n\n店员说可以留着，你说不用。' },
    ] });

  E.push({ id: 'mon_send_home', age: [18, 75], w: 9, title: '寄回去的钱',
    text: '这个月能寄回家一笔。\n\n汇款单要写地址和收件人，字要写清楚。\n\n你在“附言”那一栏停住了。',
    choices: [
      { t: '写上“我很好”', eff: { money: -6000, mind: 2, flag: 'mon_told_fine' }, r: '三个字写得很正。\n\n窗口的人扫了一眼，说“都这么写”。' },
      { t: '写上具体做了什么', eff: { money: -6000, wit: 1, flag: 'mon_told_work' }, r: '你写了两行，写完发现太长了，又划掉一半。\n\n剩下的那半读起来像是另一个人的日子。' },
      { t: '不写附言', eff: { money: -6000, mind: -1 }, r: '你把单子递进去。\n\n对方问“空的？”，你说空的。\n\n钱照样会到。' },
    ] });

  E.push({ id: 'mon_short', age: [24, 85], w: 9, title: '差一点',
    text: '要交的钱凑到最后，还差一点。\n\n差的不多，一千二。\n\n能借的人这两天都问过了。',
    choices: [
      { t: '把不用的东西卖掉', check: { s: 'social', dc: 42 },
        ok: { r: '你把旧工具卖了，价钱被压了一半。\n\n钱凑齐了，工具没了。', eff: { money: 0, wit: 1, flag: 'mon_sold_tools' } },
        no: { r: '收旧货的只肯给三百。\n\n你把东西抱回去，放在门口，没有再收起来。', eff: { mind: -2, money: -900 } } },
      { t: '去借一天的钱', eff: { money: 1200, mind: -2, flag: 'mon_borrowed_day' }, r: '借钱的人只问了一句“明天还？”。\n\n你说还。\n\n他笑了，把日期往后写了一天。' },
      { t: '跟收钱的说明天补', eff: { money: -600, mind: -1, flag: 'mon_promised_later' }, r: '对方在单子上写了“欠一千二”，写完让你签字。\n\n“签在这儿。”\n\n他指的位置很小。' },
    ] });

  E.push({ id: 'mon_found_money', age: [16, 85], w: 8, title: '捡到的钱',
    text: '楼梯拐角有一叠钱，用一根橡皮筋捆着。\n\n不厚，但也不是小数目。\n\n旁边没有人，也没有纸条。',
    choices: [
      { t: '交给楼下的摊主', eff: { social: 1, mind: 1, flag: 'mon_turned_in' }, r: '摊主接过去，压在柜台下面。\n\n“有人来问就给他。”\n\n一个星期之后，那叠钱还在。' },
      { t: '自己留下', eff: { money: 3000, mind: -2, flag: 'mon_kept_found' }, r: '你把钱塞进口袋，快步上了楼。\n\n之后每次经过那个拐角，你都会看一眼地面。' },
      { t: '在原地等一会儿', eff: { mind: -1, flag: 'mon_waited_owner' }, r: '你站了十几分钟。\n\n上楼的人看了你一眼，没有停。\n\n你把钱放回原处，走了。' },
    ] });

  E.push({ id: 'mon_boss_loan', age: [22, 80], w: 8, title: '老板愿意借',
    text: '老板说可以借你，不用利息。\n\n“从工钱里扣就行。”\n\n他说这话的时候在签别的单子，没有抬头。',
    choices: [
      { t: '借', eff: { money: 10000, mind: -2, flag: 'mon_borrowed_boss' }, r: '他让你在一张纸上签了名。\n\n纸上只写了数目和“同意从工钱扣除”。\n\n没有写扣多少、扣多久。' },
      { t: '问清楚每月扣多少', check: { s: 'social', dc: 46 },
        ok: { r: '他报了个数，报得很快。\n\n你说这个数要扣两年。\n\n他想了一下，把数改了。', eff: { money: 10000, wit: 2, flag: 'mon_clear_terms' } },
        no: { r: '“放心吧。”他说。\n\n他没有再解释，你也没有再问。', eff: { money: 10000, mind: -3 } } },
      { t: '不借', eff: { mind: 1 }, r: '他“嗯”了一声，继续签单子。\n\n你出门的时候，听见他在跟下一个人说话。' },
    ] });

  E.push({ id: 'mon_tip', age: [18, 85], w: 8, title: '小费',
    text: '客人多放了一点钱在桌上。\n\n不多，正好是一顿饭。\n\n他已经走到门口了。',
    choices: [
      { t: '收下', eff: { money: 800, mind: 1 }, r: '你把钱收进围裙口袋。\n\n那天收工，你用这笔钱买了两斤肉。' },
      { t: '追出去还给他', eff: { body: -1, social: 1, flag: 'mon_returned_tip' }, r: '他回头，愣了一下，说“你留着吧”。\n\n你说不用。\n\n他把钱收回去的时候，说了声谢谢。' },
    ] });

  E.push({ id: 'mon_split_win', age: [20, 80], w: 8, title: '分账',
    text: '一单活干完，钱放在桌上。\n\n三个人，按出力分。\n\n出力最多的那个今天没来。',
    choices: [
      { t: '给他留一份', eff: { money: -2000, social: 2, mind: 2, flag: 'mon_kept_share' }, r: '你把他的那份单独包好。\n\n第二天他来了，没有先说钱，先问活干完没有。' },
      { t: '三个人平分', eff: { money: 0, social: -1, flag: 'mon_split_even' }, r: '钱是平分了。\n\n出力最多的那个人后来很少再来。' },
      { t: '照出力分，他少一份', eff: { money: 2000, social: -2, mind: -1, flag: 'mon_cut_share' }, r: '你把他的那份压到最少。\n\n没有人反对。\n\n桌上安静了一会儿，然后有人开始收工具。' },
    ] });

  E.push({ id: 'mon_owe_dead', age: [26, 90], w: 8, title: '他死了',
    text: '欠你钱的那个人没了。\n\n不是跑掉，是没了。\n\n他家里人在整理东西，你在楼下碰见。',
    choices: [
      { t: '提那笔钱', check: { s: 'social', dc: 48 },
        ok: { r: '对方愣了一下，说“我不知道有这回事”。\n\n她翻了很久，从抽屉里找出一个信封。', eff: { money: 6000, mind: -2, flag: 'mon_asked_widow' } },
        no: { r: '她哭了。\n\n你说算了，说完就走了。\n\n那笔钱再也没有提过。', eff: { mind: -3, flag: 'mon_let_debt_go' } } },
      { t: '不提', eff: { mind: -1, flag: 'mon_silent_debt' }, r: '你帮她搬了一只箱子下楼。\n\n楼下风很大，纸箱的盖子一直响。' },
      { t: '反过来给她一点', eff: { money: -3000, mind: 2, flag: 'mon_gave_widow' }, r: '她不肯收。\n\n你放在门口就走了。\n\n走了两条街，你才想起来那是他欠你的钱。' },
    ] });

  E.push({ id: 'mon_savings_broken', age: [30, 90], w: 8, title: '存的钱',
    text: '存了很久的一笔钱，今天要动用了。\n\n不是为自己。\n\n你把包钱的纸一层层拆开，纸上有几处已经磨破。',
    choices: [
      { t: '全部拿出去', eff: { money: -20000, mind: 2, flag: 'mon_spent_savings' }, r: '你把钱数好，交出去。\n\n回来时天已经黑了，屋里没有开灯。' },
      { t: '只拿一半', eff: { money: -10000, mind: -1, flag: 'mon_half_savings' }, r: '你把另一半包回去，包得比原来紧。\n\n那块地方在柜子里空了一截。' },
      { t: '说拿不出来', eff: { money: 0, mind: -3, flag: 'mon_refused_savings' }, r: '话说完，对方很久没有出声。\n\n“我知道了。”\n\n他走的时候，替你把门带上了。' },
    ] });

  // ---------- 8 个跨年回响（4 起点 + 4 manual） ----------
  E.push({ id: 'mon_first_coin', age: [16, 26], w: 8, title: '第一枚',
    text: '第一次挣到的钱里，你留了一枚硬币。\n\n不是舍不得花，是想留个证据。\n\n你把它放进一只空药瓶。',
    choices: [
      { t: '把瓶子封起来', eff: { queue: ['mon_coin_back', 12], mind: 2, flag: 'mon_sealed_coin' }, r: '你把瓶盖拧紧，用蜡封了一圈。\n\n瓶子放进抽屉最里面。' },
      { t: '随手放着', eff: { queue: ['mon_coin_back', 12], wit: 1, flag: 'mon_loose_coin' }, r: '瓶子在抽屉里滚来滚去。\n\n后来它滚到了最里面，就再没动过。' },
    ] });
  E.push({ id: 'mon_coin_back', manual: true, age: [28, 95], w: 1,
    text: '十二年后搬家，那只药瓶从抽屉里滚出来。\n\n蜡还在，瓶里的硬币黑了一层。\n\n你把它倒在手心，掂了掂，还是原来那个重量。',
    eff: { mind: 2, flag: 'mon_coin_again' } });

  E.push({ id: 'mon_bad_debt', age: [22, 80], w: 8, title: '要不回来的',
    text: '有一笔钱，你已经不指望要回来了。\n\n数目不小，欠的人还在这一区。\n\n你们偶尔还会碰见，都点头。',
    choices: [
      { t: '把欠条烧了', eff: { queue: ['mon_debt_back', 8], mind: 2, flag: 'mon_burned_iou' }, r: '纸烧起来很快。\n\n灰落在水槽里，你用水冲掉。' },
      { t: '把欠条收好', eff: { queue: ['mon_debt_back', 8], wit: 1, flag: 'mon_kept_iou' }, r: '你把它夹进一个本子里，翻到那一页时总会看见。\n\n之后很多年，你都没有再翻开那个本子。' },
    ] });
  E.push({ id: 'mon_debt_back', manual: true, age: [30, 95], w: 1,
    text: '八年后，那个人的儿子找上门，手里拿着一个信封。\n\n“我父亲走之前让我送来。”\n\n信封里的钱，是按当年的数目，一分没多。',
    eff: { money: 8000, mind: 1, flag: 'mon_debt_paid_son' } });

  E.push({ id: 'mon_helped_once', age: [20, 80], w: 8, title: '垫过一次',
    text: '有个人付不出钱，你替他垫了。\n\n数目不大，他当时一直在说“下周还”。\n\n后来他搬走了。',
    choices: [
      { t: '记着这件事', eff: { queue: ['mon_helped_back', 9], mind: -1, flag: 'mon_remembered' }, r: '你没有跟别人提过。\n\n偶尔想起，也只是想起。' },
      { t: '忘掉', eff: { queue: ['mon_helped_back', 9], mind: 1, flag: 'mon_forgot' }, r: '过了几个月，你已经想不起他长什么样。\n\n只记得那天很冷。' },
    ] });
  E.push({ id: 'mon_helped_back', manual: true, age: [30, 95], w: 1,
    text: '九年后，有人在你门口放了一袋东西。\n\n是一袋米，还有一张纸：\n\n“当年那笔，我一直记着。现在只能还这个。”',
    eff: { money: 1000, mind: 3, flag: 'mon_rice_returned' } });

  E.push({ id: 'mon_pay_envelope', age: [18, 75], w: 8, title: '信封里的钱',
    text: '发工钱的是个信封，比上个月厚。\n\n加班的那几夜算进去了。\n\n信封上用铅笔画了一道，不知道是谁画的。',
    choices: [
      { t: '把多出来的存起来', eff: { queue: ['mon_envelope_back', 7], money: 3000, flag: 'mon_saved_extra' }, r: '你把多出来的那部分单独放好。\n\n用一个和别的钱不一样的地方。' },
      { t: '当天就花掉', eff: { queue: ['mon_envelope_back', 7], money: 0, mind: 2, flag: 'mon_spent_extra' }, r: '你买了一样一直想买的东西。\n\n拿回家放在桌上，看了很久。' },
    ] });
  E.push({ id: 'mon_envelope_back', manual: true, age: [26, 95], w: 1,
      text: '七年后，那只放钱的铁盒被人翻出来。\n\n里面的钱还在，纸钞旧得发软。\n\n你数了数，正好是当年多出来的那些。',
      eff: { money: 3000, mind: 2, flag: 'mon_extra_found' } });

  C.addEvents('money', E);
})();
