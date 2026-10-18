/* 家里的两个人（批次 7）：孩子长大、晚年独居两个故事包 + 16 个事件。
 * 写法见 docs/STYLE_REFERENCE.md。跨包咬合：kin_* / late_* 的旗标留给后续批次读取。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;

  // family 路线的 person id 会被拼上家庭身份，contactName 查不到时退回孩子的名字。
  const KID = S => {
    const n = C.contactName(S, 'kin_child');
    if (n && n !== '对方') return n;
    const fit = S.kids.filter(k => k.alive && S.age - k.born >= 12 && S.age - k.born <= 28);
    const k = fit[0] || S.kids.find(k => k.alive);
    return k ? k.name : '孩子';
  };
  // late 路线的 id 不拼接，直接用 contactName，取不到时用“邻居”。
  const NEI = S => C.contactName(S, 'kin_neighbor') === '对方' ? '邻居' : C.contactName(S, 'kin_neighbor');

  // ============ 故事包 1：孩子长大（family） ============
  p({
    id: 'kin_child', pack: 'B7', title: '大一号的鞋', route: 'family', person: 'kin_child',
    theme: '羁绊', age: [26, 70], sources: ['S01'],
    req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 12 && S.age - k.born <= 28) },
    // 供测试工具构造入口状态：造一个十四岁的孩子。
    fixture: S => { S.kids.push({ name: '测试孩子', g: 'f', alive: true, born: S.age - 14, id: 'kid:test' }); },
  }, [
    ['缴费单',
      S => KID(S) + '把一张单子压在饭碗底下。\n\n学徒班的报名费，两万眼，五号以前交。\n\n单子背面有人用铅笔写了一行小字：可以先交一半。那几个字不是孩子写的。',
      [
        o('把两万眼点出来', '你数了两遍，用旧报纸包好，让孩子自己拿去交。\n\n报纸的角被捏得很紧，到窗口才松开。',
          { paid: true }, { money: -20000, mind: 1 }, { trust: 1 }),
        o('让孩子自己挣一半', '孩子把话听完，穿上外套就出去了。\n\n半夜回来，鞋底沾着货场的灰，手里的钱数不够。\n\n差的那一截，你还是补了。',
          { half: true }, { money: -10000, mind: -1, flag: 'kin_child_half_earned' }, { trust: -1, goto: 2 }),
        o('先跟孩子去班里看看', '教室在地下室，墙上贴着上一届的名册。\n\n最下面一行被划掉了，划得很用力，纸都起了毛。\n\n来回的车钱八百眼。',
          { looked: true }, { money: -800, wit: 1 }, { trust: 1 }),
      ]],
    ['没动的那顿饭',
      S => '饭在锅里，没有人动。\n\n' + KID(S) + '把那套工具一样一样摆开，又一样一样放回去。\n\n“我不想学这个。”\n\n筷子横在碗边，没有拿起来。',
      [
        o('把工具收进柜子', '你把工具一件件收进去，上了锁。\n\n那天夜里，孩子屋里的灯亮到很晚。\n\n你没有过去问。',
          { tools: 'away' }, { mind: 1, flag: 'kin_child_tools_away' }, { trust: 1 }),
        o('把手艺能挣多少算一遍', '料钱、工钱、一年能接几单，你一笔一笔算在纸上。\n\n孩子听完，把工具推回来，推得很整齐。\n\n第二天，那张报名单不见了。',
          { tools: 'counted' }, { mind: -1, wit: 1, flag: 'kin_child_counted' }, { trust: -1, goto: 3 }),
        c('问孩子想学什么', 'social', 44,
          o('孩子说了一个你没听过的行当', '说得很慢，像怕你打断。\n\n你把工具柜的钥匙放到桌子那边，推过去。',
            { plan: true }, { wit: 2, flag: 'kin_child_plan' }, { trust: 1 }),
          o('孩子说不知道', '说完就低头吃饭，吃得很慢。\n\n那顿饭剩下半碗，第二天倒了。',
            { plan: false }, { mind: -2, flag: 'kin_child_no_words' }, { trust: -1 })),
      ]],
    ['三点十三分',
      '凌晨三点十三分，孩子那间屋的门还开着。\n\n后巷深宵的水声从街口漫过来，一下，又一下。\n\n门口的鞋架空了一格。\n\n你把灯全打开了。',
      [
        c('照孩子平时的路去找', 'body', 46,
          o('在卸货口下面找到人', '蹲在墙根避水，鞋是干的。\n\n回去的路上谁都没说话。走到门口，孩子把外套脱下来搭在你肩上。',
            { found: true }, { body: -2, mind: 2, flag: 'kin_child_found_night' }, { trust: 2 }),
          o('你被水枪逼了回来', '水已经漫到第二条街，你退回屋里，坐到天亮。\n\n门是从里面开的。孩子翻后窗进屋，比你先到家。\n\n那扇后窗，此后一直没有关严。',
            { found: false }, { body: -3, mind: -2, flag: 'kin_child_back_window' }, { trust: -1 })),
        o('搬张凳子坐在门口等', '你把凳子搬到门里，把灯全开着。\n\n四点半，脚步从巷子那头过来，看见灯，慢了一下，又快起来。',
          { found: 'wait' }, { body: -1, mind: 1 }, { trust: 1 }),
        o('锁门，回屋睡', '你把门闩推到底。\n\n第二天早上，门是从外面开的。孩子有钥匙。\n\n早饭在桌上，没有动。',
          { found: 'lock' }, { mind: -2, flag: 'kin_child_locked_out' }, { trust: -2 }),
      ]],
    ['大一号的鞋',
      '学徒班要站一整天。\n\n你去接人的时候，孩子坐在台阶上脱鞋，脚后跟磨破了一层，袜子粘在伤口上。\n\n鞋是这个月买的，便宜，也大了一号。你当时说，大一点能穿两年。',
      [
        o('去对面买一双合脚的', '新鞋三千眼，比上个月那双贵一倍。\n\n旧的那双你提在手里，走到巷口才扔。\n\n孩子穿上走了两步，没说合不合脚。',
          { shoe: 'new' }, { money: -3000, mind: 1 }, { trust: 1 }),
        o('退了新的，剪开旧的当拖鞋', '你把新鞋退回店里，换回一千五百眼。\n\n回来用刀把旧鞋后跟剪开，边剪边磨。\n\n孩子穿着它站完那一期，鞋底两边磨得不一样薄。',
          { shoe: 'cut' }, { money: 1500, mind: -1, flag: 'kin_child_cut_shoe' }, { trust: -1 }),
        o('去问招工处要一只凳子', '管报名的人翻了翻册子，说上一届也有人问过。\n\n“下个月再来。”\n\n你在门口站了一会儿，蹲下把孩子松开的鞋带重新系好。',
          { shoe: 'ask' }, { money: -200, social: 1, flag: 'kin_child_asked_stool' }, { trust: 1 }),
      ], 2],
    ['这个区',
      S => '招工处的人说，学徒期满要调去别的区，一去三年。\n\n' + KID(S) + '把通知折成小块，压在桌上，没有说是去还是不去。\n\n桌上还有一把这个区的钥匙，早就配不上任何一扇门了。',
      [
        o('说去吧，家里这边有我', '你把通知重新折好，塞进孩子的口袋。\n\n送站那天站台上很挤，你只看见车窗里抬起的一只手。',
          { leave: true }, { money: -2000, mind: 1, flag: 'kin_child_left' }, { trust: 2 }),
        o('说留下，区里也有活', '你把那把旧钥匙推过去。\n\n孩子在桌边坐到天黑，通知一直没有收。\n\n第二天早上，钥匙不在了。',
          { leave: false }, { mind: -1, flag: 'kin_child_stayed' }, { trust: -1 }),
        c('问三年以后回不回来', 'social', 48,
          o('孩子问屋子还在不在', '你说在。\n\n这个字出口，你才发现自己一直攥着桌角。',
            { leave: 'ask' }, { mind: 2, wit: 1, flag: 'kin_child_asked_back' }, { trust: 1 }),
          o('孩子反问你这三年怎么办', '你没有答上来。\n\n通知摊在桌上，摊到边角发毛。\n\n第二天它还在原处。',
            { leave: 'ask' }, { mind: -2, flag: 'kin_child_unanswered' }, { trust: -1 })),
      ]],
    ['柜子最下面',
      '柜子最下面那套工具，三年没有动过。\n\n今天你把它拿出来，用布擦了一遍，又放回去。\n\n擦的时候，最小的那一把掉在地上，声音很响。',
      [
        o('把工具放在门边', '工具装进旧布袋，放在门边。\n\n过了两天，袋子轻了一半。\n\n拿走的是哪几件，你看不出来。',
          { out: 'door' }, { mind: 2, flag: 'kin_child_tools_door' }, { trust: 1, end: '你把一套用旧的工具放在门边，被拿走了一半。' }),
        o('卖给收旧货的', '四千眼，整套装上车。\n\n钱收进抽屉。\n\n谁也没有提这套工具原本是给谁备的。',
          { out: 'sold' }, { money: 4000, mind: -1, flag: 'kin_child_sold_tools' }, { trust: -1, end: '你把那套工具卖掉了，钱留下了，话没有说开。' }),
        o('锁回柜子里', '换了锁，三百眼。\n\n钥匙挂回原来的钉子。\n\n孩子问过一次里面是什么，你说，旧东西。',
          { out: 'kept' }, { money: -300, mind: 1, flag: 'kin_child_kept_tools' }, { end: '那套工具还锁在柜子里，谁也没有再提过。' }),
      ]],
  ]);

  // ============ 故事包 2：晚年独居（late） ============
  p({
    id: 'late_room', pack: 'B7', title: '门口的碗', route: 'late', person: 'kin_neighbor',
    theme: '余生', age: [55, 95], sources: ['S01'],
    req: { fn: S => !(S.spouse && S.spouse.alive) },
  }, [
    ['门口的碗',
      S => NEI(S) + '照例敲两下，放下午饭。你隔着门说碗还没洗，她说先端进去。\n\n盘子底下夹着街道的表，要本人签字，汤汽已把纸角蒸卷了。',
      [
        o('把碗洗干净，明天还回去', '第二天碗放在隔壁门口，碗底压着两个鸡蛋。\n\n中午门响了两下，碗又回来了，鸡蛋没有了。',
          { bowl: 'wash' }, { money: -600, mind: 1 }, { trust: 1 }),
        o('请她进屋一起吃', '邻居站在门口不肯进来，说鞋上有泥。\n\n你把两双鞋并到门里，饭桌往门口挪了半步。\n\n那顿饭吃得很快。',
          { bowl: 'in' }, { money: -400, mind: 1, social: 1 }, { trust: 2 }),
        o('说以后别送了', '你把话说得很轻，邻居点头，把碗端走了。\n\n第三天中午没有敲门声。\n\n你在门口坐到一点，才把门关上。',
          { bowl: 'stop' }, { money: -500, mind: -2, flag: 'late_refused_food' }, { trust: -2, goto: 2 }),
      ]],
    ['空下来的那间',
      S => '靠里屋空了一冬，旧工作台正好挨着窗。\n\n' + NEI(S) + '带孩子来比了比桌子高矮，问放学后能不能在这儿写作业。孩子先把手上的墨擦了。',
      [
        o('去配一把钥匙给她', '配钥匙三百眼。她接过去的手很小心，像拿一件还要还的东西。\n\n下午屋里有了翻书声。\n\n灰里的印子被人擦掉了。',
          { room: 'lend' }, { money: -300, mind: 1, flag: 'late_room_lent' }, { trust: 2 }),
        o('收一点钱再借', '你报了个数。邻居愣了一下，说回去商量。\n\n第二天钱送过来，纸币的角是湿的。\n\n中午的碗还是照旧。',
          { room: 'rent' }, { money: 3000, mind: -1, flag: 'late_room_rented' }, { trust: -1 }),
        o('不借，屋里还有东西', '邻居牵孩子回去。你花四百眼换锁芯，试转两次。\n\n门里传出锁舌声，孩子还以为你改了主意，又在走廊停下来。',
          { room: 'no' }, { money: -400, mind: -1, flag: 'late_room_kept' }, { trust: -1, goto: 3 }),
      ]],
    ['一栏空着',
      '紧急联系人一栏，空了三天。要求是“能够及时到场”。\n\n你翻过通讯录，能打通的都离得远。隔壁洗碗的水声穿墙传来，笔就放在手边。',
      [
        o('先去问过她，再填名字', '邻居想了很久，说“你半夜敲墙，我听得见”。\n\n她把名字念了一遍，让你照着写。\n\n回来时你在小卖部塑封了一张写着号码的卡片，八百眼。',
          { form: 'neighbor' }, { money: -800, mind: 2, flag: 'late_form_neighbor' }, { trust: 2 }),
        o('空着不填，压回抽屉', '你把表夹在通讯录里，空栏对着那几个远处的号码。\n\n下个月没人来催，这页也没再翻开。',
          { form: 'blank' }, { mind: -2, flag: 'late_form_blank' }, { trust: -1, goto: 4 }),
        o('去窗口问这一栏能不能空', '窗口说可以，但真出了事，他们只能按登记地址上门。\n\n你问会等多久，职员指了指外头的队伍。回来时花了两百眼车钱。',
          { form: 'asked' }, { money: -200, wit: 1, flag: 'late_form_asked' }),
      ]],
    ['那天中午',
      '过了午饭点，隔壁还没敲门。你放在她门口的净碗也没收。\n\n你扶门站着，先喊了一声。平时总会应的人，今天屋里一点声也没有。',
      [
        c('扶墙走过去敲三下', 'body', 44,
          o('门开了，她坐在地上', '脚边翻着一只凳子。\n\n她第一句话是：饭在锅里，还没盛。\n\n你把她扶到椅子上，锅确实还温着。',
            { checked: true }, { body: -2, mind: 2, flag: 'late_found_her' }, { trust: 2 }),
          o('门一直没有开', '你回到自己屋里，坐在靠门那把椅子上。\n\n天黑前，楼下上来一个年轻人，说是她孙子。\n\n他敲门的时候看了你一眼，没有问你是谁。',
            { checked: false }, { body: -3, mind: -2, flag: 'late_saw_grandson' }, { trust: -1 })),
        o('烧一壶热水放在门口', '壶很沉，你走两步歇一步。\n\n放在门口，敲了两下，没有等。\n\n晚上壶回来了，里面是满的。',
          { checked: 'water' }, { money: -300, body: -1, mind: 1 }, { trust: 1 }),
        o('再等等，也许她出门了', '你把碗端回自己屋里，热了一遍，没有吃。\n\n那碗东西最后倒了。\n\n第二天中午，敲门声又响了两下。她什么也没说，你也没有问。',
          { checked: 'wait' }, { money: -400, mind: -1, flag: 'late_waited' }, { trust: -1 }),
      ]],
    ['搬不动的机器',
      S => '那台旧机器，两个人才抬得动。收旧货的只肯给三千眼，楼下的学徒却天天来打听。\n\n' + NEI(S) + '说是她外孙，刚学到这型号，还没摸过真的。',
      [
        o('把机器送给他', '他叫了两个人来抬，在楼梯口卡了半个钟头。\n\n搬运的钱他出的，你只添了一壶茶。\n\n那间屋子从此空得很彻底。',
          { machine: 'give' }, { money: -400, mind: 2, flag: 'late_machine_given' }, { trust: 2 }),
        o('卖给出三千眼的收旧货的', '车来的时候，那个学徒站在楼梯口看。\n\n三千眼数清，机器抬走，地上留下一圈灰印，比旁边的灰白。\n\n钱你收进抽屉，没有马上花。',
          { machine: 'sell' }, { money: 3000, mind: -1, flag: 'late_machine_sold' }, { trust: -1 }),
        o('盖上布，留着', '布是从旧床单上裁的。\n\n学徒又来门口站过一次，你没有开门。\n\n布上很快落了一层灰。',
          { machine: 'keep' }, { money: -200, mind: -1, flag: 'late_machine_kept' }, { trust: -1 }),
      ]],
    ['换了一只手',
      S => '又过两年，隔壁的孩子已能帮着端午饭。碗放得太快，汤沿盘子滴下来。\n\n' + (S.flags.late_machine_kept ? '旧机器还盖着布。' : '机器搬走后，靠里屋宽敞了。') + (S.flags.late_room_lent || S.flags.late_room_rented ? '工作台上堆着课本，你得先腾出吃饭的地方。' : '你把门边的小桌挪开一点，给端碗的人让路。'),
      [
        o('再配一把钥匙给她', '配了两把，一把给她，一把挂在门后。\n\n邻居说，以后中午不敲了，直接进来。',
          { after: 'key' }, { money: -300, mind: 2, flag: 'late_gave_key' }, { trust: 2, end: '你把家里的一把钥匙给了每天送饭的邻居。' }),
        o('请她教你煮那锅汤', '她在灶边说了三遍，你记了半页纸。\n\n第一次自己煮，咸了。第二次刚好。',
          { end: 'soup' }, { money: -600, wit: 1, mind: 1, flag: 'late_learned_soup' }, { trust: 1, end: '你学会了邻居那锅汤，往后换你多做一份。' }),
        o('把碗洗好放回去，不留话', '碗里放了一包糖，用纸包着。\n\n第二天碗回来了，糖少了半包。\n\n你没有问她吃没吃。',
          { end: 'bowl' }, { money: -200, mind: 1, flag: 'late_left_candy' }, { trust: 1, end: '你和送饭的邻居各留着一只碗，谁也没有说明天怎么办。' }),
      ]],
  ]);

  // ============ 16 个事件 ============
  C.addEvents('kin', [
    // —— 6 个无选项 ——
    { id: 'kn_shoe_worn', age: [24, 58], req: { kids: [1, null] }, w: 10,
      text: '门口的鞋一双一双摆着，鞋跟都朝外。\n\n有一双的鞋底磨偏了一边，比另一边薄。\n\n你把它翻过来看了看，又照原样摆好。' },
    { id: 'kn_bowl_chip', age: [52, 95], w: 10,
      text: '碗上盖的那只盘子缺了一个角。\n\n缺角朝里，汤不会顺着流出来。\n\n还回来的时候，缺角还是朝里。' },
    { id: 'kn_light_self', age: [20, 60], req: { kids: [1, null] }, w: 9,
      text: '凌晨三点过，楼道的声控灯自己亮了。\n\n没有人上来。灯亮了一会儿，又灭了。\n\n你数着，它一共亮了三次。' },
    { id: 'kn_receipt_stack', age: [26, 62], req: { kids: [1, null] }, w: 9,
      text: '抽屉里有一沓收据，最早那张的字已经褪成浅黄。\n\n日期是开学那天。金额后面多写了两个零，写错了，没有改。\n\n你把它按原来的顺序放回去。' },
    { id: 'kn_keys_four', age: [52, 95], w: 10,
      text: '抽屉里有一串钥匙，一共四把。\n\n四把都配不上现在这扇门。\n\n你还是每天出门前摸一下，摸到的那把最凉。' },
    { id: 'kn_stair_crack', age: [52, 95], w: 10,
      text: '楼梯第七级有一道裂缝，扫地的说修不了。\n\n你上下楼都踩左边。\n\n后来邻居也踩左边，没有人说过为什么。' },

    // —— 6 个抉择（前四个带跨年回响）——
    { id: 'kn_tuition_slip', age: [26, 58], req: { kids: [1, null] }, w: 9, title: '垫一笔',
      eff: { queue: ['kn_tuition_back', 12] },
      text: '收费窗口只收现钱，收据要三天后来取。\n\n孩子手里还差一截，站在窗口前不肯让开。\n\n后面排队的人开始看表。',
      choices: [
        { t: '把钱补上', eff: { money: -12000, mind: 1, flag: 'kin_paid_tuition' }, r: '你把钱数进窗口，收据开的是你的名字。\n\n回去的路上，孩子走在前面，走得很慢，像在等你跟上。' },
        { t: '让孩子自己跟窗口说', check: { s: 'social', dc: 44 },
          ok: { r: '孩子把情况说清了，窗口的人翻了翻册子，让先交一半。\n\n剩下的下个月补，写在收据背面。', eff: { money: -6000, social: 1, flag: 'kin_tuition_half' } },
          no: { r: '孩子说了两遍，第二遍声音更小。\n\n窗口关了。出来的时候，那张单子还在孩子手里。', eff: { mind: -2, flag: 'kin_tuition_failed' } } },
        { t: '先带回去，改天再来', eff: { mind: -1 }, r: '你们让开了窗口。\n\n后面的人立刻补上，收据开给了别人。\n\n那张单子在你口袋里折了三天。' },
      ] },
    { id: 'kn_night_light', age: [24, 55], req: { kids: [1, null] }, w: 9, title: '留一盏灯',
      eff: { queue: ['kn_night_back', 10] },
      text: '孩子还没回来。\n\n你把楼道的灯泡换成了一只更亮的，瓦数比原来大，也费电。\n\n换完你坐在门口，听见楼下有人在锁门。',
      choices: [
        { t: '把灯一直开着', eff: { money: -900, mind: 1, flag: 'kin_kept_light' }, r: '那一夜灯亮到天亮。\n\n电费多了九百眼，是三个月后才知道的。\n\n孩子后来问过一句，灯是不是一直开着。' },
        { t: '按点关灯，锁门', eff: { money: 600, mind: -2, flag: 'kin_dark_hall' }, r: '你到点拉闸，门闩推到底。\n\n楼道黑下来以后，声音反而更清楚。\n\n你听见有人在楼下站了很久。' },
        { t: '下楼去巷口看一眼', check: { s: 'body', dc: 42 },
          ok: { r: '巷口只有水声。\n\n回来时孩子正站在门口，手插在兜里。\n\n两个人一起上了楼。', eff: { body: -1, mind: 2, flag: 'kin_met_at_corner' } },
          no: { r: '你在楼梯上滑了一级，膝盖磕在棱上。\n\n等你自己爬起来，孩子已经从后门上来了，屋里的灯亮着。\n\n第二天，门口的鞋上全是灰，没有人提。', eff: { body: -4, mind: -2, flag: 'kin_knee_hurt' } } },
      ] },
    { id: 'kn_return_favor', age: [56, 92], w: 9, title: '回什么礼',
      text: '门口的碗又换了花样，是炖了很久的那种。\n\n碗柜里能拿得出手的东西不多：一包没开封的茶叶，两只别人送来的罐头。\n\n你站在柜子前想了很久。',
      choices: [
        { t: '把茶叶送过去', eff: { money: -1500, mind: 1, flag: 'gave_leaf_tea' }, r: '邻居把纸包拆开闻了闻，说这茶太贵，留着待客。\n\n第二天，茶出现在了你自己的杯子里。' },
        { t: '把罐头留着自己吃', eff: { mind: 1 }, r: '你开了罐头，吃了半罐。\n\n另一半放进碗柜，第二天还是那半罐。\n\n碗照旧中午送到门口。' },
        { t: '直接问她想要什么', check: { s: 'social', dc: 40 },
          ok: { r: '她想了一会儿，说要你这屋里的旧椅子。\n\n“坐着比站着好。”\n\n你把椅子搬过去，她当场坐下了。', eff: { mind: 2, flag: 'gave_chair' } },
          no: { r: '她说不要，语气客气得像隔着一道门。\n\n之后几天，碗放在门口，敲两下，人已经下楼了。', eff: { mind: -2, flag: 'late_cooled' } } },
      ] },
    { id: 'kn_form_old', age: [58, 90], w: 8, title: '再填一次',
      eff: { queue: ['kn_form_back', 6] },
      text: '街道送来一张表，一页，格子印得很紧。\n\n“是否独居”那一格在最下面，方格比别的都小。\n\n笔压在桌上，笔帽没有盖。',
      choices: [
        { t: '在“是”上打勾', eff: { money: 1200, mind: -1, flag: 'late_alone_marked' }, r: '你打了勾，笔画很直。\n\n送表的人在门口看了一眼屋里的桌子，说“一个人住，好办”。\n\n下个月起，账上多了一千二百眼。' },
        { t: '把格子空着交上去', eff: { money: -300, mind: -1, flag: 'late_form_rejected' }, r: '表退回来了，上面多了一道红笔的圈。\n\n你重填了一遍，错在同一个格子。\n\n第二次是花钱请楼下的人代填的。' },
        { t: '问送表的人这一格填了会怎样', check: { s: 'social', dc: 42 },
          ok: { r: '他说填“是”每月有一笔补贴，填“否”得写同住人。\n\n两种你都问了，回来自己填。', eff: { wit: 2, flag: 'late_form_explained' } },
          no: { r: '他说“你看着填”，然后就下楼了。\n\n表在桌上摊到天黑，你才拿起笔。', eff: { mind: -1, flag: 'late_form_unsure' } } },
      ] },
    { id: 'kn_machine_out', age: [58, 90], w: 8, title: '两人才抬得动',
      eff: { queue: ['kn_machine_back', 7] },
      text: '屋角那台机器要挪出来。\n\n两个人才抬得动，收旧货的出三千眼，还价还到三千二。\n\n楼下住着一个学徒，在门口站过两回。',
      choices: [
        { t: '卖给他，三千二就三千二', eff: { money: 3200, mind: -1, flag: 'late_sold_machine' }, r: '车开走以后，地上剩一圈灰印。\n\n你把掉下来的那颗螺丝捡起来，放进抽屉。\n\n抽屉里已经有三颗一样的。' },
        { t: '留下，改天再想', eff: { money: -500, mind: 1, flag: 'late_kept_machine' }, r: '你付了两个人抬回去的钱。\n\n机器重新靠回墙上，地上那圈印子被它盖住了。\n\n螺丝还在缝里。' },
        { t: '问楼下那个学徒要不要', check: { s: 'social', dc: 38 },
          ok: { r: '他上来看了一遍，摸了摸齿轮，说要，但得等三天。\n\n三天后他带两个人来抬，抬得很慢。', eff: { mind: 2, flag: 'late_gave_machine' } },
          no: { r: '他说学不会，怕弄坏。\n\n收旧货的车第二天就来了。\n\n你看着机器被抬走，没有还价。', eff: { money: 3000, mind: -2 } } },
      ] },
    { id: 'kn_key_lost', age: [26, 56], req: { kids: [1, null] }, w: 9, title: '钥匙丢了',
      text: '门锁换过之后，只配了两把钥匙。\n\n一把在你身上，另一把挂在门后。\n\n孩子说自己的那把不见了，问能不能把门后这把拿走。',
      choices: [
        { t: '给，让他自己再配一把', eff: { money: -300, mind: 1, flag: 'kin_key_given' }, r: '孩子把钥匙从钉子上取下来，挂进自己的钥匙串。\n\n那一串上还有别的钥匙，你没有问是哪些门。' },
        { t: '不给，先用自己的', eff: { money: -800, mind: -2, flag: 'kin_key_refused' }, r: '你说的理由是丢过一把。\n\n门后那把还挂在钉子上，锁芯你先换了，八百眼。\n\n接下来的半个月，孩子回来得比原先晚。' },
        { t: '让孩子把丢的那把找回来', check: { s: 'wit', dc: 42 },
          ok: { r: '你们把可能的地方过了一遍，最后在书包最里层摸到。\n\n钥匙一直没丢，只是忘了放在哪。', eff: { wit: 2, mind: 1, flag: 'kin_key_found' } },
          no: { r: '找了一晚上，把家里翻得乱七八糟。\n\n最后在垃圾桶底下找到，已经压弯。\n\n门后那把还是给了出去，另配一把三百眼。', eff: { money: -300, body: -1, mind: -1, flag: 'kin_key_bent' } } },
      ] },

    // —— 4 个跨年回响（manual 后续）——
    { id: 'kn_tuition_back', manual: true, age: [38, 85], w: 1,
      text: S => (S.flags.kin_tuition_failed
        ? '十二年后，柜子顶上翻出一张没有交成的单子，纸都脆了。'
        : '十二年后，孩子带回来一张纸，是当年那笔学费的收据。')
        + '\n\n背面有一行铅笔字：下月补。\n\n没有被补上的那一笔，就这样过了十二年。',
      eff: { mind: 3, flag: 'kin_tuition_back_seen' } },
    { id: 'kn_night_back', manual: true, age: [34, 85], w: 1,
      text: S => '十年后停电，楼里只有楼梯口点着一截蜡烛。\n\n孩子从别的区回来，站在楼下按了两下喇叭。\n\n'
        + (S.flags.kin_kept_light ? '“那几年我回来，总看见灯亮着。”' : '“有一年，灯是黑的。”\n\n说完就没有再说别的。'),
      eff: { mind: 3, flag: 'kin_light_remembered' } },
    { id: 'kn_form_back', manual: true, age: [64, 96], w: 1,
      text: '六年后，那张表在抽屉里被翻出来，纸边发了黄。\n\n“紧急联系人”那一栏空着，“是否独居”还是那个勾。\n\n新的表又送来了，这次的格子更大，笔也换了新的。',
      eff: { mind: -2, flag: 'late_form_again' } },
    { id: 'kn_machine_back', manual: true, age: [65, 96], w: 1,
      text: '七年后，楼下有人在修一台同款的旧机器，声音跟当年一样。\n\n他抬头看见你，说这台的齿轮是从别处拆来的，很好用。\n\n你没有问是从哪里拆的。',
      eff: { mind: 2, flag: 'late_machine_seen_again' } },
  ]);
})();
