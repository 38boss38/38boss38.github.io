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
  amb('lighter', '借来的打火机一直没还，火苗得用手拢着。\n\n今天主人来借火，按了两次，说这只也该换了。');
  amb('keys', '钥匙串里混着一把来路不明的钥匙。你挨个试过家里的锁，都不合。\n\n去配钥匙时，师傅看了一眼：“这是旧式电箱的。”');
  amb('receipt_wallet', '钱包里那张收据只剩金额能认。你腾地方装证件，抽出收据，发现背面记着一趟车的换乘站。\n\n其中两站已经停了。');
  amb('gloves_pair', '右手套的掌心又磨穿了，左手那只还好。你把两只掉了个方向戴。\n\n拇指卡在小指的位置，干半天活，手背也酸了。', { body: -1 });
  amb('coin_pocket', '洗衣机甩干时，里面忽然响得像在打铁。\n\n你停机掏出那枚常忘在兜里的硬币。隔壁敲了敲墙，机器停了，他还在敲。');
  amb('photo_small', '小照片被剪成圆角，正好塞进钱包。你借来放大镜认那张模糊的脸。\n\n脸仍看不清，后面面馆的招牌倒是认出来了。');
  amb('string', '随身那截绳子又派上用场。提手断了，你把袋口一扎，提着往回走。\n\n走到家，绳结越勒越死，最后连袋子一起剪开。');
  amb('badge_old', '旧工牌的挂绳烂了，你把它夹进镜子边。早晨梳头时，照片里那张年轻的脸总在旁边。\n\n今天你把工牌转了过去，露出背面的门禁须知。');
  amb('spare_buttons', '铁盒里攒了五颗扣子，终于有一颗配得上今天掉的那颗。\n\n你穿好线缝上，扣到胸前才发现，背面朝外了。');
  amb('dead_pen', '不出水的笔拿来拧小螺丝，比手指好使。\n\n今天笔尖终于断了。你倒出弹簧，拿笔杆吹掉键缝里的灰，呛得直咳。');
  amb('folded_note', '随身的纸条折痕磨白了，打开就要裂。你隔着台灯照，认出自己早年的字。\n\n写的是尺寸，量的什么，已经想不起来。');
  amb('thread_needle', '针掉在地砖缝里，新铺地面时也没找出来。\n\n今天你光脚踩到一小段金属，跳着去拿磁铁。吸起来的是订书钉。');
  amb('bandage_roll', '你展开随身的半卷绷带检查，最外一层已经起毛。\n\n重新卷时没卷紧，一松手滚到桌下，得跪下去追。');
  amb('cracked_lens', '右镜片的划痕总把细线看成两条。你偏着头穿针，旁边的人跟着偏。\n\n针穿好了，他的脖子还没转回来。');
  amb('map_fragment', '那截旧地图把排水渠画成了河。你照着找桥，走到一条横铺的铁板前。\n\n两个人并排过不去，只好侧身让一个。');
  amb('spoon_tin', '饭盒里的勺柄掰直过，今天又弯在原处。\n\n你抵着桌沿慢慢压。对面的人把自己的递来：“顺便。”');
  amb('cap_worn', '帽檐磨破，里头的硬纸被汗泡软了。你戴着它出门，一阵风把帽檐吹到眼前。\n\n托着走过半条街，旁人以为你在招手。');
  amb('ticket_pocket', '清理外套内袋，摸出一张过期车票。终点站已改名，你报旧名，售票员想了想，指向反方向的月台。\n\n“现在从那边上。”');
  amb('medicine_split', '药板上今天那格空了，杯底却躺着一片泡开的药。\n\n你把它倒掉，重新看了一遍服药时间。早饭已经凉了。', { body: -1 }, [40, 95]);
  amb('scissors', '钝剪刀来回磨了三次，布才断。你举起剪下的袖口，两边差出半指。\n\n再修一遍，又短了半指。');
  amb('boot_lace', '接过两回的鞋带又断在旧结旁。你把剩下的穿过最下面两个孔，上头的留空。\n\n走到路口，鞋跟已经磨红了。');
  amb('cup_handle', '粘过的杯把今天脱了。你还捏着把，杯身落在另一只托底的手里。\n\n热水没洒，来串门的人先叫出了声。');
  amb('tape_roll', '胶带头找不到，你拿指甲抠出半层，越撕越窄。\n\n最后扯下细细一条，正好把裂开的镜框缠住。');
  amb('umbrella_broken', '断了一根骨的伞被风翻过去，你顶着伞柄往墙边退。\n\n屋檐下的人替你按回伞面。雨停后，那一侧还是翘着。');
  amb('box_string', '盒外的绳结已经压进纸壳。你想解开看看，刚拉一头，盒底先散了。\n\n一堆小零件滚到脚边，绳子还保持着方盒的形状。');

  // ---------- 26 条带选项 ----------
  E.push({ id: 'ch_borrowed_thing', age: [18, 85], w: 10, title: '借来的东西',
    text: '借来的钳子放了半年。今天整理工具，你伸手就拿到它，才想起这不是自己的。\n\n主人住在隔街，天黑前还来得及过去。',
    choices: [
      { t: '送回去', eff: { mind: 2, social: 1, flag: 'ch_returned_thing' }, r: '他接过去，看了两眼，说“我都忘了”。\n\n“那你怎么不早说。”\n\n“也是忘了。”' },
      { t: '继续放着', eff: { mind: -1 }, r: '东西还在原来的位置。\n\n你后来搬过一次家，它跟着搬了过去。' },
      { t: '问他是不是送给你了', check: { s: 'social', dc: 42 },
        ok: { r: '“留着，我换了新的。”他拿新钳子给你看，旧的连链条都剪不断。\n\n回去你试了试，夹细线还行。', eff: { mind: 1, flag: 'ch_was_gift' } },
        no: { r: '他伸手等着。你解释钳子没带，他让你明天一早送来。\n\n原本想说的半句话，你又咽了回去。', eff: { mind: -2 } } },
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
    text: '来人递给你一只磨偏了柄的扳手，说是死去的工友留下的。\n\n“他提过你的名字。”说完，来人就开始套外衣。',
    choices: [
      { t: '收下，用起来', eff: { mind: 2, flag: 'ch_used_it' }, r: '扳手的柄偏着，头一回拧滑了。你换个角度握，第二颗螺母终于松开。\n\n此后它挂在最顺手的位置。' },
      { t: '收下，收起来', eff: { wit: 1, mind: -1, flag: 'ch_stored_it' }, r: '你擦掉扳手上的油，用布缠住磨偏的柄，放进抽屉深处。\n\n干活时手伸过去，摸到的总是空位。' },
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
    text: '小孩塞给你一只用废线绕的鸟，翅膀一长一短。\n\n“放在你那里。”他跑出两步，又回来把鸟嘴捏尖了一点。',
    choices: [
      { t: '放在看得见的地方', eff: { mind: 3, flag: 'ch_displayed' }, r: '线鸟摆在柜上，总有人说像把坏扫帚。\n\n你拿下来比划翅膀，再摆回去，鸟嘴朝外。' },
      { t: '收进盒子', eff: { mind: 1, flag: 'ch_boxed_gift' }, r: '鸟翅膀顶住盒盖，你又弯低一点。\n\n小孩回来检查，你只好重新掰开给他看。' },
    ] });

  E.push({ id: 'ch_tool_broken', age: [20, 85], w: 9, title: '工具断了',
    text: '用了多年的钳子断在地上，半边柄弹到柜底。\n\n你捡出两截比了比。旧焊口旁又裂了一道，明早的活还等着它。',
    choices: [
      { t: '去修', check: { s: 'skill', dc: 46 },
        ok: { r: '钳柄焊短一截。你重新试力，夹坏两根废线，第三根剥得干净。\n\n师傅这才递来要修的那截。', eff: { money: -2000, skill: 2, mind: 1, flag: 'ch_repaired_tool' } },
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
