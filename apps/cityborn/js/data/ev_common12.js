/* 手里有什么（批次 38）：70 条以"随身带着的那样东西"为引子的事件。
 * 一只打火机、一串钥匙、一张单据、一副手套——东西比人活得久。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'ch_' + id, age: age || [16, 95], req: req || {}, w: 11, repeat: true, cd: 13, text, ...(eff ? { eff } : {}),
  });

  // ---------- 26 条无选项 ----------
  amb('lighter', '打火机是别人的，借了没还。\n\n火苗很小，风一吹就灭。\n\n你还是每次都用它。');
  amb('keys', '钥匙串上多了一把，不知道开哪扇门。\n\n你不敢扔，也不敢试。\n\n它和别的钥匙一起响，声音比原来碎。');
  amb('receipt_wallet', '钱包里有一张收据，字已经看不清了。\n\n金额那一栏还能认出来。\n\n你不记得那一天为什么花这笔钱。');
  amb('gloves_pair', '一副手套，一只比另一只旧。\n\n旧的那只是右手。\n\n说明你干活的时候总是先用右手。', { body: -1 });
  amb('coin_pocket', '口袋里有一枚硬币，一直在那儿。\n\n洗衣服的时候也没被洗掉。\n\n你后来把它当成一个习惯。');
  amb('photo_small', '一张很小的照片，边角剪成了圆的。\n\n上面两个人的脸都模糊了。\n\n你认得其中一个，另一个要猜。');
  amb('string', '一段绳子，长度大概一臂。\n\n你捆过东西，也用过它量距离。\n\n现在它只是缠在手指上。');
  amb('badge_old', '旧工牌上的照片是很多年前的。\n\n照片里的人没笑。\n\n你现在也不怎么笑。');
  amb('spare_buttons', '抽屉里有五颗扣子，没有一件衣服配得上。\n\n它们被放在一个小铁盒里。\n\n铁盒原本装的是别的。');
  amb('dead_pen', '笔不出水了，你还是带着。\n\n有时候拿它拧螺丝，正好。\n\n它比好用的那几支待得久。');
  amb('folded_note', '一张纸条折成很小的方块。\n\n你带着它很多年，从来没有打开。\n\n折痕已经磨白了。');
  amb('thread_needle', '针线盒里少一根针。\n\n你记得它掉在哪儿，但没去拿。\n\n那一块地方后来铺了新的地砖。');
  amb('bandage_roll', '一卷用了一半的绷带。\n\n边上有剪刀剪过的齿痕。\n\n你一直带着，希望用不上。');
  amb('cracked_lens', '眼镜片上有一道细划痕，正好在右眼的位置。\n\n看东西的时候总有一道斜线。\n\n你已经习惯把视线偏一点。');
  amb('map_fragment', '一截地图，只有四条街。\n\n那条河画得很粗，实际上很窄。\n\n你按它走过一次，走错了。');
  amb('spoon_tin', '饭盒里插着一把勺子。\n\n勺柄弯过，又被掰直过。\n\n掰的那一处已经没有光泽。');
  amb('cap_worn', '帽子的檐磨破了，露出里面的硬纸。\n\n你还是戴着它。\n\n太阳大的时候，那一块正好挡着眼睛。');
  amb('ticket_pocket', '外套内袋里有一张车票，早就过期了。\n\n票上的终点站后来改了名字。\n\n你没有把它拿出来。');
  amb('medicine_split', '药片按天分好，装在一板铝箔里。\n\n今天那一格是空的，你没有补。\n\n明天再说。', { body: -1 }, [40, 95]);
  amb('scissors', '剪刀钝了，剪布要来回磨三次。\n\n你一直没去磨。\n\n剪出来的边不齐，没人看得出来。');
  amb('boot_lace', '鞋带断过一次，接了再接。\n\n打结的地方比别处粗。\n\n走起来有一点硌脚。');
  amb('cup_handle', '杯子的把手粘过一次。\n\n粘的地方颜色比杯身深。\n\n装热水的时候，你还是用另一只手托着底。');
  amb('tape_roll', '一卷胶带的头找不到了。\n\n你用指甲抠了半天，抠出一小段。\n\n那一段刚好够用。');
  amb('umbrella_broken', '伞骨断了一根，撑起来一面塌着。\n\n下小雨还能用。\n\n下大雨你会把它收起来淋着走。');
  amb('box_string', '盒子外面还系着当年的绳。\n\n绳结是你自己打的，打法很特别。\n\n你没有解开。');

  // ---------- 26 条带选项 ----------
  E.push({ id: 'ch_borrowed_thing', age: [18, 85], w: 10, title: '借来的东西',
    text: '一样东西借来半年，主人一直没来要。\n\n东西一直放在同一个位置。\n\n你每次看见它，都会想一下这件事。',
    choices: [
      { t: '送回去', eff: { mind: 2, social: 1, flag: 'ch_returned_thing' }, r: '他接过去，看了两眼，说“我都忘了”。\n\n“那你怎么不早说。”\n\n“也是忘了。”' },
      { t: '继续放着', eff: { mind: -1 }, r: '东西还在原来的位置。\n\n你后来搬过一次家，它跟着搬了过去。' },
      { t: '问他是不是送给你了', check: { s: 'social', dc: 42 },
        ok: { r: '“你留着吧。”他说得很干脆。\n\n你反倒不知道该拿它做什么了。', eff: { mind: 1, flag: 'ch_was_gift' } },
        no: { r: '“那么久的事。”\n\n他把话停在那儿，意思很明白。', eff: { mind: -2 } } },
    ] });

  E.push({ id: 'ch_lost_wallet', age: [18, 85], w: 9, title: '钱包丢了',
    text: '钱包丢了，里面有一张你舍不得扔的旧照片。\n\n钱倒不多。\n\n你在走过的每一段路上都想了一遍。',
    choices: [
      { t: '回去一条街一条街找', check: { s: 'body', dc: 42 },
        ok: { r: '在第三段路上，一个摊主把它压在秤底下。\n\n钱少了，照片还在。', eff: { body: -1, money: -600, mind: 1, flag: 'ch_found_wallet' } },
        no: { r: '走了两个小时，走到天黑。\n\n什么都没找到。', eff: { body: -2, mind: -2 } } },
      { t: '挂失，重新办', eff: { money: -1500, wit: 1, flag: 'ch_remade_cards' }, r: '办证的地方排队。\n\n轮到你时，工作人员问你“丢了多久”，你说三天。\n\n“那不算久。”' },
      { t: '算了', eff: { mind: -1, flag: 'ch_gave_up_wallet' }, r: '你慢慢就不想了。\n\n只是每次摸口袋，还会先摸那个位置。' },
    ] });

  E.push({ id: 'ch_dead_mans_ring', age: [24, 85], w: 8, title: '留下的东西',
    text: '有人把一样东西留给了你，没说是谁的意思。\n\n东西不值钱，是他一直在用的。\n\n交东西的人说“他提过你的名字”。',
    choices: [
      { t: '收下，用起来', eff: { mind: 2, flag: 'ch_used_it' }, r: '你用它做了第一件事，做得不好。\n\n第二件好一点。\n\n之后就一直用着。' },
      { t: '收下，收起来', eff: { wit: 1, mind: -1, flag: 'ch_stored_it' }, r: '你把它包好，放进抽屉最里面。\n\n包东西的纸是你随手找的。' },
      { t: '问他提过我什么', check: { s: 'social', dc: 44 },
        ok: { r: '“他说东西要给人用，不能放着。”\n\n对方说完就走了。', eff: { mind: 1, flag: 'ch_knew_why' } },
        no: { r: '“就那么一句。”\n\n那人把手插进口袋，走了。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'ch_found_key', age: [18, 85], w: 9, title: '捡到一把钥匙',
    text: '地上有一把钥匙，单把，没有牌。\n\n钥匙齿是新的，几乎没磨。\n\n周围没有锁。',
    choices: [
      { t: '挂在路边的钉子上', eff: { mind: 1, wit: 1, flag: 'ch_hung_key' }, r: '那个钉子上本来就挂着别的东西：一只手套的残片。\n\n第二天钥匙不在了。' },
      { t: '带走，试试能开什么', check: { s: 'wit', dc: 46 },
        ok: { r: '你试了五扇门，第六扇转开了。\n\n里面是空的，墙上有一道新的划痕。', eff: { wit: 2, mind: -2, flag: 'ch_opened_door' } },
        no: { r: '一把都开不了。\n\n钥匙被你放进抽屉，和别的不知道用的东西放在一起。', eff: { mind: -1 } } },
      { t: '交给巡街的', eff: { social: 1, flag: 'ch_gave_key' }, r: '他接了，随手放进上衣口袋。\n\n“丢了会有人来问。”他说。\n\n没有人来问。' },
    ] });

  E.push({ id: 'ch_wrong_bag', age: [18, 85], w: 9, title: '拿错的袋子',
    text: '回家才发现拿错了袋子。\n\n里面是别人的东西：一双鞋、一份文件、一瓶药。\n\n文件上有地址。',
    choices: [
      { t: '按地址送过去', check: { s: 'body', dc: 40 },
        ok: { r: '开门的人一看袋子就笑了，说“我一直以为丢了”。\n\n他给你倒了水，你只喝了一半。', eff: { body: -1, social: 2, mind: 1, flag: 'ch_returned_bag' } },
        no: { r: '地址上的楼已经拆了。\n\n你站在空地上提着一只别人的袋子。', eff: { mind: -2 } } },
      { t: '看那份文件', eff: { wit: 2, mind: -1, flag: 'ch_read_file' }, r: '文件是一份证明，写着一个你不认识的名字。\n\n最后一页盖了章，章很新。' },
      { t: '放回原处，等别人来拿', eff: { mind: -1 }, r: '你把袋子放在门口。\n\n第二天它不见了。\n\n你一直不知道是谁拿走的。' },
    ] });

  E.push({ id: 'ch_pawn_thing', age: [20, 80], w: 8, title: '当掉的东西',
    text: '抽屉里有一张当票，日期过了。\n\n当掉的东西是你年轻时买的，当时很贵。\n\n现在要么花钱赎，要么就当没了。',
    choices: [
      { t: '去赎', check: { s: 'social', dc: 44 },
        ok: { r: '东西还在，包在一张旧报纸里。\n\n你把钱数给他，他把报纸一起递给你。', eff: { money: -9000, mind: 2, flag: 'ch_redeemed' } },
        no: { r: '“已经处理了。”他说。\n\n“什么时候处理的。”\n\n他去招呼下一个人了。', eff: { mind: -2 } } },
      { t: '不赎，让它过去', eff: { money: 0, mind: 1, flag: 'ch_let_pawn_go' }, r: '你把当票撕了，撕成两半。\n\n后来你还是能想起那样东西的样子。' },
    ] });

  E.push({ id: 'ch_child_present', age: [24, 85], w: 8, title: '孩子给你的',
    text: '孩子把一样东西塞到你手里。\n\n是他自己做的，做得很难看。\n\n“放在你那里。”他说完就跑了。',
    choices: [
      { t: '放在看得见的地方', eff: { mind: 3, flag: 'ch_displayed' }, r: '你把它摆在柜子上。\n\n来的人问这是什么，你说“小孩做的”。\n\n说了很多年。' },
      { t: '收进盒子', eff: { mind: 1, flag: 'ch_boxed_gift' }, r: '盒子里已经有几件这样的东西。\n\n你合上盖子，盒子有点关不严。' },
    ] });

  E.push({ id: 'ch_tool_broken', age: [20, 85], w: 9, title: '工具断了',
    text: '干了半辈子的工具今天断在地上。\n\n断口很干净。\n\n你蹲下去捡，捡起来才想起来它跟了你好多年。',
    choices: [
      { t: '去修', check: { s: 'skill', dc: 46 },
        ok: { r: '焊回去之后，短了一截。\n\n用起来要重新掌握分寸。', eff: { money: -2000, skill: 2, mind: 1, flag: 'ch_repaired_tool' } },
        no: { r: '焊不上。\n\n你把它放在工具箱最上面，一直没扔。', eff: { mind: -1 } } },
      { t: '买新的', eff: { money: -6000, mind: -1, flag: 'ch_bought_new_tool' }, r: '新的用起来不顺手。\n\n第一周你做坏了两件东西。' },
      { t: '留着断的那半截', eff: { wit: 1, flag: 'ch_kept_half' }, r: '剩下那半截还能当楔子用。\n\n你用了很多年。' },
    ] });

  E.push({ id: 'ch_borrowed_from_dead', age: [28, 85], w: 8, title: '来不及还',
    text: '你手里有一样东西，是跟人借的。\n\n那个人没了。\n\n东西成了你的，可是借这件事没有结束。',
    choices: [
      { t: '还给他家里人', eff: { mind: 2, social: 1, flag: 'ch_returned_family' }, r: '家里人接过东西，说不认识。\n\n“他一直带着的。”你说。\n\n他们互相看了一眼。' },
      { t: '留着', eff: { mind: -1, flag: 'ch_kept_borrowed' }, r: '你用它的时候会想一下。\n\n想完接着用。' },
    ] });

  E.push({ id: 'ch_gift_unopened', age: [24, 85], w: 8, title: '没拆的盒子',
    text: '盒子上没有写名字，只画了一个圈。\n\n放了很多年，包装纸已经脆了。\n\n你不知道是谁送的。',
    choices: [
      { t: '现在拆开', check: { s: 'mind', dc: 44 },
        ok: { r: '里面是一只杯子，和柜子里那只一模一样。\n\n你把两只摆在一起，分不出哪只是哪只。', eff: { wit: 1, mind: 2, flag: 'ch_opened_box' } },
        no: { r: '拆到一半，你停下来了。\n\n纸还在，盒子还是那个盒子。', eff: { mind: -1 } } },
      { t: '不拆', eff: { mind: 1 }, r: '你把它推回柜子顶上。\n\n那一块地方是干净的。' },
    ] });

  // ---------- 18 条回响 ----------
  E.push({ id: 'ch_left_note', age: [18, 42], w: 8, title: '留给下一个人的纸条',
    text: '你要搬走了，屋里有一样东西带不走。\n\n可以留一张纸条，也可以什么都不留。\n\n抽屉里那行字是上一个人写的，你看过。',
    choices: [
      { t: '写一张', eff: { queue: ['ch_left_note_back', 9], mind: 1, flag: 'ch_wrote_for_next' }, r: '你写了两行，写得很短。\n\n写完压在那个东西下面，位置和上一个人压的一样。' },
      { t: '什么都不留', eff: { queue: ['ch_left_note_back', 9], mind: -1, flag: 'ch_left_nothing' }, r: '你把东西留在原处，抽屉关上。\n\n后来的人会不会打开，不关你的事。' },
    ] });
  E.push({ id: 'ch_left_note_back', manual: true, age: [27, 95], w: 1,
    text: '九年后你回到那间屋，已经住着别人。\n\n开门的人说，抽屉里有一张纸条，写了很短两行。\n\n“我以为是谁的。”她说，“一直没扔。”',
    eff: { mind: 3, flag: 'ch_note_survived' } });

  E.push({ id: 'ch_name_tag', age: [18, 42], w: 8, title: '写名字',
    text: '工牌上的名字可以用笔改。\n\n改错一个字很容易，改回来也不难。\n\n但改过的地方会留下印子。',
    choices: [
      { t: '改回正确的写法', eff: { queue: ['ch_name_tag_back', 7], wit: 1, flag: 'ch_fixed_name' }, r: '你改得很小心。\n\n改完对着光看，那一处还是有点深。' },
      { t: '任它错着', eff: { queue: ['ch_name_tag_back', 7], mind: 1, flag: 'ch_left_wrong_name' }, r: '错的那个写法被叫了很多年。\n\n后来你听别人叫正确的写法，反倒不习惯了。' },
    ] });
  E.push({ id: 'ch_name_tag_back', manual: true, age: [25, 95], w: 1,
    text: '七年后档案里有一张表，名字写的是你工牌上那个错的。\n\n“改不改？”工作人员问。\n\n你想了一下，说不用。',
    eff: { mind: -1, flag: 'ch_name_kept_wrong' } });

  E.push({ id: 'ch_gave_tool', age: [24, 55], w: 8, title: '把工具给人',
    text: '有个年轻人缺工具，你手上正好多一副。\n\n多的那副是旧的，还能用。\n\n他说“我买”，你说“拿去用”。',
    choices: [
      { t: '给他', eff: { queue: ['ch_gave_tool_back', 6], social: 2, flag: 'ch_lent_tools' }, r: '他接过去，先看刃口，再看柄。\n\n“这个好。”他说。\n\n“旧了。”\n\n“旧的才好。”' },
      { t: '卖给他', eff: { money: 3000, queue: ['ch_gave_tool_back', 6], flag: 'ch_sold_tools' }, r: '他数了钱，数目正好。\n\n拿东西的时候，他道了谢，说“这样我才好意思用”。' },
    ] });
  E.push({ id: 'ch_gave_tool_back', manual: true, age: [30, 95], w: 1,
    text: '六年后，那副工具被送回来。\n\n刃口重新开过，柄上多缠了一圈布。\n\n“用完了。”送的人说，“他说该还了。”',
    eff: { mind: 2, flag: 'ch_tools_returned' } });

  E.push({ id: 'ch_kept_letter', age: [20, 50], w: 8, title: '一封信',
    text: '一封信写完，没有寄。\n\n不是不想寄，是不知道地址有没有变。\n\n信封上只写了名字。',
    choices: [
      { t: '按记忆里的地址寄出去', eff: { queue: ['ch_letter_back', 8], mind: 1, flag: 'ch_sent_letter' }, r: '你把信投进邮筒，投完在门口站了一会儿。\n\n邮筒上有一层灰。' },
      { t: '收着', eff: { queue: ['ch_letter_back', 8], mind: -1, flag: 'ch_kept_letter' }, r: '你把它夹进一本书里。\n\n书后来被人借走，还回来的时候，信还在。' },
    ] });
  E.push({ id: 'ch_letter_back', manual: true, age: [28, 95], w: 1,
    text: '八年后，那封信被退回。\n\n信封上盖了一个章：“地址不详”。\n\n拆开看，字迹比现在用力，写完的那些句子，你现在写不出来。',
    eff: { mind: -1, wit: 1, flag: 'ch_letter_returned' } });

  E.push({ id: 'ch_pocket_thing', age: [18, 45], w: 8, title: '一直带在身上的',
    text: '有一样东西你带了很久，小到可以握在手里。\n\n没有人问过那是什么。\n\n有一天你发现它不见了。',
    choices: [
      { t: '找一遍', eff: { queue: ['ch_pocket_back', 5], body: -1, flag: 'ch_searched' }, r: '你把衣服全翻了一遍。\n\n东西不在。\n\n收拾完，衣服叠得比平时整齐。' },
      { t: '不找了', eff: { queue: ['ch_pocket_back', 5], mind: 1, flag: 'ch_stopped_searching' }, r: '你把手插进口袋，摸到的只有布。' },
    ] });
  E.push({ id: 'ch_pocket_back', manual: true, age: [23, 95], w: 1,
    text: '五年后整理旧衣服，那样东西从内衬的破口里掉出来。\n\n它在里面待了五年。\n\n你把它放在手心里，比记忆里轻。',
    eff: { mind: 2, flag: 'ch_pocket_found' } });

  E.push({ id: 'ch_bought_for_other', age: [20, 55], w: 8, title: '买给别人的东西',
    text: '你买了一样东西，是给别人的。\n\n买完才知道那个人已经不在了。\n\n东西还包着，没有拆。',
    choices: [
      { t: '自己用', eff: { queue: ['ch_for_other_back', 7], mind: 1, flag: 'ch_used_gift' }, r: '第一次用的时候不太顺手。\n\n第二次就习惯了。' },
      { t: '放着', eff: { queue: ['ch_for_other_back', 7], mind: -1, flag: 'ch_stored_gift' }, r: '你把它放进柜子，包装没有拆。\n\n柜子里那一样东西的位置一直没有变。' },
    ] });
  E.push({ id: 'ch_for_other_back', manual: true, age: [27, 95], w: 1,
    text: '七年后，那样东西被一个孩子翻出来。\n\n“这是谁的？”\n\n你说是很久以前买的。\n\n他问能不能给他，你说能。',
    eff: { mind: 2, flag: 'ch_gift_passed' } });

  E.push({ id: 'ch_broken_promise_item', age: [20, 55], w: 8, title: '答应过的东西',
    text: '你答应过给人带一样东西。\n\n后来没带成。\n\n那件事过去了很久，你还记得东西的名字。',
    choices: [
      { t: '现在补上', eff: { queue: ['ch_promise_back', 6], money: -2000, mind: 2, flag: 'ch_made_good' }, r: '你把东西送到。\n\n对方愣了一下，说“我早忘了”。\n\n他还是收下了。' },
      { t: '就让它过去', eff: { queue: ['ch_promise_back', 6], mind: -1, flag: 'ch_let_promise_go' }, r: '你后来见过那个人几次。\n\n你们都没有提这件事。' },
    ] });
  E.push({ id: 'ch_promise_back', manual: true, age: [26, 95], w: 1,
    text: '六年后，有人给你带来一样东西，说是替人转交的。\n\n“他说你以前答应过他这个。”\n\n东西和你当年要带的不是同一样，但用途一样。',
    eff: { mind: 2, flag: 'ch_promise_returned' } });

  E.push({ id: 'ch_lost_ring', age: [24, 60], w: 8, title: '掉进下水道',
    text: '一样小东西掉进了下水道。\n\n格子缝很窄，看得见，够不着。\n\n你在那儿蹲了很久。',
    choices: [
      { t: '找根铁丝钩', check: { s: 'wit', dc: 44 },
        ok: { r: '钩了十几分钟，钩上来了。\n\n东西上面全是黑的，你用水冲干净。', eff: { wit: 2, mind: 2, flag: 'ch_fished_out' } },
        no: { r: '铁丝太软，弯了。\n\n你把铁丝留在那儿，站起来了。', eff: { mind: -2 } } },
      { t: '走开', eff: { queue: ['ch_lost_thing_back', 8], mind: -1, flag: 'ch_left_it_below' }, r: '你走了。\n\n后来每次经过那个格子，你都会低头看一眼。' },
    ] });
  E.push({ id: 'ch_lost_thing_back', manual: true, age: [32, 95], w: 1,
    text: '八年后那条下水道改造，格子被掀开。\n\n有人在里面捡到过东西，摆了一段时间，没人认领。\n\n现在不知道去哪儿了。',
    eff: { mind: -1, flag: 'ch_grid_replaced' } });

  E.push({ id: 'ch_kept_uniform', age: [24, 60], w: 8, title: '旧制服',
    text: '一件旧制服挂在柜子里，早就不穿了。\n\n袖口磨破过，补丁是自己缝的。\n\n扔了可惜，穿着也不合适。',
    choices: [
      { t: '剪开当抹布', eff: { queue: ['ch_uniform_back', 6], wit: 1, flag: 'ch_cut_uniform' }, r: '剪的时候要先拆线。\n\n拆开之后，它就不像一件衣服了。' },
      { t: '留着', eff: { queue: ['ch_uniform_back', 6], mind: 1, flag: 'ch_kept_uniform' }, r: '你把它往里推了推，推到最后面。\n\n柜子里那一块地方一直没动。' },
    ] });
  E.push({ id: 'ch_uniform_back', manual: true, age: [30, 95], w: 1,
    text: '六年后，一个年轻人问你能不能给他一件旧制服。\n\n“我没有。”你说。\n\n他没有再问，点了点头就走了。',
    eff: { mind: -1, flag: 'ch_no_uniform' } });

  C.addEvents('carry', E);
})();
