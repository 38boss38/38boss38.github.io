/* 长大这件事（批次 34）：学校那张小椅子、搬出去的两只箱子。
 * 写法见 docs/STYLE_REFERENCE.md：短句、具体物件、结果只给后果、失败也写成剧情。
 * family 路线必须给 fixture 造孩子；旗标 gw_* 只在本批内互读，留给后续批次。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;

  // family 路线的 person id 会被拼上家庭身份；老师与搬东西的人自己仍按身份称呼。
  const FACE = (S, id, fallback) => {
    const n = C.contactName(S, id);
    return n && n !== '对方' ? n : fallback;
  };
  const TEA = S => FACE(S, 'school_teacher', '老师');
  const MOVER = S => FACE(S, 'move_helper', '搬东西的人');
  const KID = S => {
    const fit = S.kids.filter(k => k.alive && S.age - k.born >= 8 && S.age - k.born <= 30);
    const k = fit[0] || S.kids.find(k => k.alive);
    return k ? k.name : '孩子';
  };

  // ============ 故事包 1：学校那张小椅子（family） ============
  p({
    id: 'grow_school', pack: 'B34', title: '那张小椅子', route: 'family', person: 'school_teacher',
    theme: '成长', age: [26, 66], sources: ['S01'],
    req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 8 && S.age - k.born <= 20) },
    // 供测试工具构造入口状态：造一个十二岁的孩子。
    fixture: S => { S.kids.push({ name: '测试孩子', g: 'm', alive: true, born: S.age - 12, id: 'kid:test' }); },
    endings: {
      record: '你在记过那一栏签了字，那一页跟着档案封进了袋子。',
      transfer: '你把孩子转去了另一所学校，原来那张处理单留在了原校。',
      child: '孩子自己去办公室说完了整件事，回来时只带了一张纸。',
    },
  }, [
    ['走廊上的椅子',
      S => '办公室外面摆着一排小椅子，椅面只有巴掌宽。\n\n你坐下，膝盖顶到墙，通知单在手里折了三道。\n\n'
        + TEA(S) + '从门里出来，手里夹着一张纸，先说了结果：孩子打了人，对方家长今天要一个说法。\n\n那张纸没有递给你。',
      [
        c('先把那张纸要过来看', 'wit', 46,
          o('记录上写着事情发生在第二节课', '另一张名单上，那节课孩子不在教室。\n\n你把两张纸并在一起，老师的手停了一下。',
            null, { wit: 1, flag: 'gw_sc_time_gap' }, { trust: 1 }),
          o('老师把纸对折，收进夹子', '“已经定了。”他说，“明天来签个字。”\n\n走廊的窗子开着，通知单在手里响。',
            null, { mind: -1, flag: 'gw_sc_decided' }, { trust: -1 })),
        o('问孩子人在哪里', '“在走廊尽头。”\n\n你回头，孩子坐在长凳上，书包放在脚边，校服袖口破了一道。\n\n孩子没有抬头。',
          { saw: 'child' }, { mind: 1, flag: 'gw_sc_saw_child' }, { trust: 1 }),
        o('先把孩子领回去', '你签了临时离校的单子，把孩子领出来。\n\n路上孩子走在后面两步。\n\n到家门口，孩子说了一句“不是我”，声音很小。',
          { saw: 'took' }, { mind: -1, flag: 'gw_sc_took_home' }, { trust: -1, goto: 2 }),
      ]],
    ['另一份说法',
      S => (S.flags.gw_sc_decided
        ? '老师把那张纸从夹子里抽出来，已经对折过，折痕压得很实。'
        : '老师把那张纸从夹子里抽出来，摊平在桌上。')
        + '\n\n上面是对方孩子母亲写的：鼻子破了，缝了两针，医院收据附在后面。\n\n纸的末尾写着两个数：医药费八千，误工三天。\n\n“学校这边只有一份记录。”老师说，“别的你们自己谈。”',
      [
        c('问误工三天是怎么算的', 'social', 46,
          o('老师把纸翻过来，背面有一行小字', '“三天的工钱按日结算。”\n\n老师停了停，又说：“她那天本来不上工。”\n\n医药费那一栏没有动。',
            { told: 'wage' }, { wit: 1, flag: 'gw_sc_cut_wage' }, { trust: 1 }),
          o('老师说这个不归学校管', '“你们当面谈。”\n\n纸推回你面前，边角翘着。\n\n孩子那间教室的灯已经灭了。',
            { told: 'self' }, { mind: -2, flag: 'gw_sc_talk_yourselves' }, { trust: -1 })),
        o('先不表态，等对方来了再说', '你把纸推回去。\n\n老师把纸夹回本子，说人明天上午来。\n\n走廊上有人在拖地，水痕一直拖到门口。',
          { told: 'wait' }, { mind: -1, flag: 'gw_sc_wait_other' }),
        o('让孩子自己说那天的事', S => '老师去把' + KID(S) + '叫了进来。\n\n孩子站在门口，把那天的事从头说了一遍，声音不大。\n\n老师在本子上记了两行。',
          { told: 'child' }, { mind: 1, wit: 1, flag: 'gw_sc_child_account' }),
      ]],
    ['走廊尽头',
      S => '走廊尽头是一条长凳，' + KID(S) + '坐在最边上，两只脚并着。\n\n书包拉链坏了一半，用绳子捆着。\n\n'
        + '你在孩子旁边坐下，长凳比办公室的椅子还矮。\n\n“他们先动的手。”孩子说，眼睛看着地面。',
      [
        o('问孩子手有没有事', '孩子把手翻过来，指关节蹭破一块，已经结了一层薄皮。\n\n“不疼。”\n\n你说回家上点药，孩子嗯了一声。',
          { hand: 'asked' }, { mind: 1, flag: 'gw_sc_asked_hands' }),
        c('问孩子为什么不还手', 'social', 44,
          o('孩子想了很久，说还手就要两个人一起记过', '“我不想让你来。”\n\n说完孩子把脸转开，耳朵红了一块。',
            { hand: 'told' }, { wit: 1, mind: 1, flag: 'gw_sc_reason' }),
          o('孩子站起来，说“我不去了”', '书包从长凳上滑下来，绳子散开一半。\n\n再怎么问，孩子都不再开口。',
            { hand: 'quit' }, { mind: -2, flag: 'gw_sc_child_quit' })),
        o('带孩子回家，明天再来', '你把孩子的书包提起来，比想的轻。\n\n下楼时孩子跟在后面，没有再说那句话。\n\n校门口的风把两张单子吹得贴在腿上。',
          { hand: 'home' }, { mind: -1, flag: 'gw_sc_left_early' }, { goto: 4 }),
      ]],
    ['门卫室',
      S => '第二天在门卫室，对方孩子的母亲来了，手里拎着一只塑料袋，里面是医院的收据和一双鞋。\n\n她把鞋放在桌上，摆正。\n\n'
        + (S.flags.gw_sc_child_quit ? '孩子没有来。门卫说孩子今天没有进校门。' : '孩子站在你身后，校服袖口的破口朝外。')
        + '\n\n“我儿子缝了两针。”她说，“我不缺这八千。”',
      [
        c('让孩子当面道歉', 'social', 48,
          o('孩子站直了，把那句话说完', '她把鞋收回袋里，说钱不要了，让学校把记录留着。\n\n出门时她走得很慢。',
            { sorry: 'child' }, { mind: 1, flag: 'gw_sc_apology' }, { trust: 1 }),
          o('孩子只说了半句，声音卡在喉咙里', '她等了一会儿，把鞋装回袋子。\n\n“那就走程序。”她说。',
            { sorry: 'none' }, { mind: -2, flag: 'gw_sc_apology_failed' }, { trust: -1 })),
        o('把钱压在收据上', '钱压在收据下面，她没有数。\n\n她把袋子收好，说这事到此为止。\n\n走出门卫室，孩子问是不是不用再说了。',
          { sorry: 'money' }, { money: -8000, flag: 'gw_sc_paid_quiet' }, { trust: -1 }),
        o('不谈了，回家', '你把门卫室的门推开，先走了出去。\n\n身后没有人叫住你。\n\n回到家，孩子把校服翻到反面叠好。',
          { sorry: 'walk' }, { mind: -1, flag: 'gw_sc_walked' }, { trust: -1, goto: 5 }),
      ]],
    ['家长会',
      S => '家长会开在教室里，桌椅往后挪，家长坐孩子的椅子。\n\n老师念了几个名字，念到' + KID(S) + '时停了一下。\n\n黑板上贴着一张转学说明，四角用磁铁压着。\n\n散会以后，家长们从后门出去。',
      [
        o('散会后留下来问老师', '你在教室里等到人走完。\n\n老师说记录会跟着档案走，转不转学由家长定。\n\n“我不替你们拿主意。”老师说。',
          { meet: 'ask' }, { mind: -1, flag: 'gw_sc_asked_teacher' }, { trust: 1 }),
        o('去窗口把转学的材料问清', '窗口的人报了三样，最后一样要去原班主任那里拿。\n\n回来的车钱二百眼。\n\n你把三样写在烟盒背面。',
          { meet: 'ask' }, { money: -200, wit: 1, flag: 'gw_sc_transfer_info' }, { trust: -1 }),
        o('什么也不问，先回家', '你从后门出去，没有跟老师打招呼。\n\n回到家，孩子问家长会说了什么。\n\n你说，跟往年一样。',
          { meet: 'leave' }, { mind: -1, flag: 'gw_sc_waiting' }, { trust: -1 }),
      ]],
    ['学期末',
      S => (S.flags.gw_sc_asked_teacher ? '家长会那天你留到了最后，老师把处理结果从头念了一遍。'
        : S.flags.gw_sc_transfer_info ? '转学要的三样材料你问清了，写在烟盒背面。'
          : '这半个月，孩子每天照常出门，回来得很晚。')
        + '\n\n学期末，学校把处理结果和一封转学说明一起寄来。\n\n说明最上面一行是空着的报到日期。\n\n'
        + KID(S) + '把两张纸并排放在桌上，等你先开口。',
      [
        o('在记过那一栏签字', '你在那一栏签了字。\n\n六百眼的档案袋和回执，收据是一条窄纸条。\n\n寄走以后，孩子把校服挂回了门后。',
          null, { money: -600, flag: 'gw_sc_signed_final' }, { trust: 1, end: 'record' }),
        o('去办转学', '新学校要三千眼报名费，窗口收钱时没有抬头。\n\n原校把档案封好交给你，信封上盖了一个方章。\n\n孩子在校门口站了一会儿。',
          null, { money: -3000, flag: 'gw_sc_transfer_final' }, { trust: -1, end: 'transfer' }),
        o('让孩子自己去说', '你把两张纸推到孩子面前，又给了三百眼的车钱。\n\n孩子去了，回来时手里只剩一张。\n\n另外一张留在办公室，谁也没有再提。',
          null, { money: -300, mind: 1, flag: 'gw_sc_child_spoke' }, { trust: 1, end: 'child' }),
      ]],
  ]);

  // ============ 故事包 2：两只箱子（family） ============
  p({
    id: 'grow_move', pack: 'B34', title: '两只箱子', route: 'family', person: 'move_helper',
    theme: '离别', age: [26, 66], sources: ['S01'],
    req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 16 && S.age - k.born <= 26) },
    // 供测试工具构造入口状态：造一个十八岁的孩子。
    fixture: S => { S.kids.push({ name: '测试孩子', g: 'f', alive: true, born: S.age - 18, id: 'kid:test' }); },
    endings: {
      back: '孩子搬回来了，两只箱子还是原来那两只。',
      key: '孩子拿了钥匙，自己开了门，此后进进出出都用自己的钥匙。',
      days: '孩子回来住了几天，又回去上工，箱子一直放在那间屋里。',
    },
  }, [
    ['两只箱子',
      S => KID(S) + '把两只箱子拖到门口，一只是帆布的，拉链坏了一半。\n\n另一只用绳子捆着，绳结打了三道。\n\n'
        + '楼下按了一声喇叭，很短。\n\n“东西就这些。”孩子说，“钥匙放在桌上了。”',
      [
        c('先把两只箱子打开看看', 'wit', 44,
          o('箱底压着一条旧毯子和一只相框', '相框里是很多年前的照片。\n\n“这个忘了拿。”孩子说，没有伸手。\n\n你把毯子折好，塞回箱角。',
            { box: 'looked' }, { wit: 1, mind: 1, flag: 'gw_mv_took_blanket' }),
          o('孩子把箱子合上，说不用看', '“都是衣服。”\n\n绳子重新捆了一遍，比原来紧。\n\n你站在门口，看着那个绳结。',
            { box: 'shut' }, { mind: -1, flag: 'gw_mv_boxes_closed' })),
        o('下楼跟搬东西的人说价', '你先下了楼。\n\n搬东西的人把烟按灭在车门上，报了一个数。\n\n楼上传来箱子拖过门槛的声音，一下，两下。',
          { box: 'down' }, { mind: -1, flag: 'gw_mv_driver_first' }, { goto: 2 }),
        o('问孩子钥匙带没带', '孩子摸了摸口袋，说带了。\n\n“还有一把留在这儿。”孩子说，“万一。”\n\n说完就去看楼下，没有等你接话。',
          { box: 'key' }, { mind: 1, flag: 'gw_mv_asked_key' }),
      ]],
    ['那把钥匙',
      '桌上放着一把钥匙，钥匙圈上挂着一块木牌，是小时候那个储物柜的。\n\n孩子把钥匙推到你面前。门后的钉子上还挂着另一把，用红绳系着。\n\n“这把留给你。”孩子说。\n\n孩子没有伸手。',
      [
        o('把备用钥匙给孩子', '你把红绳解下来，把备用钥匙放进孩子手心。\n\n孩子攥了一下，说用不上。\n\n还是收进了口袋。',
          { key: 'give' }, { mind: 1, flag: 'gw_mv_gave_key' }),
        o('收回钥匙，换把锁', '第二天你叫人来换了锁，四百眼。\n\n新钥匙两把，一把挂在门后。\n\n旧的那把放进抽屉，没有扔。',
          { key: 'lock' }, { money: -400, mind: -1, flag: 'gw_mv_changed_lock' }),
        o('把钥匙留在桌上', '你把钥匙推回桌子中间。\n\n孩子看了它一会儿，转身去拖箱子。\n\n门开着，钥匙一直放在那里。',
          { key: 'left' }, { mind: -1, flag: 'gw_mv_left_key' }, { goto: 3 }),
      ]],
    ['楼下的车',
      S => '楼下停着一辆小货车，车斗里垫着旧纸板。\n\n' + MOVER(S) + '说跑这一趟四千眼，两头都要爬楼，不加钱就不搬。\n\n'
        + '孩子从口袋里数出一千八，数到一半停了。\n\n“剩下的我自己搬。”孩子说。',
      [
        o('把差的钱补上', '你把差的补上，司机收了钱，把纸板往边上踢了踢。\n\n箱子抬上车，绳子勒得吱吱响。\n\n孩子扶着车斗，没有坐进去。',
          { fare: 'pay' }, { money: -2200, flag: 'gw_mv_paid_fare' }, { trust: 1 }),
        c('跟司机讲价', 'social', 46,
          o('你说了三条街的价钱', '司机最后让了五百。\n\n“下不为例。”\n\n省下的五百，孩子接过去，塞回你口袋。',
            { fare: 'haggle' }, { money: -3500, wit: 1, flag: 'gw_mv_haggled' }, { trust: 1 }),
          o('司机把车斗的挡板扣上，说不搬了', '司机坐回驾驶室，等了一会儿才发动。\n\n孩子自己把两只箱子拖下台阶，一级一级。',
            { fare: 'left' }, { mind: -2, flag: 'gw_mv_car_left' }, { trust: -1 })),
        o('让他们走，饭不吃了', '车倒出巷子，孩子坐在车斗里，扶着箱子。\n\n你站在楼下，直到车拐弯。\n\n灶上的锅还是凉的。',
          { fare: 'go' }, { mind: -2, flag: 'gw_mv_no_meal' }, { trust: -1, goto: 4 }),
      ]],
    ['那顿饭',
      S => '锅里的水开了，你下了三把面，又打了一个蛋。\n\n' + KID(S) + '坐在桌边，筷子摆在碗上，没有动。\n\n'
        + '“吃完再走。”你说。\n\n孩子低头吃了一口，说盐放多了。',
      [
        o('把剩下的面都盛给孩子', '碗添得满满的，孩子吃完了。\n\n吃完把碗放进水池，说下个月回来拿剩下的书。\n\n楼道的灯闪了两下。',
          { meal: 'more' }, { mind: 1, flag: 'gw_mv_ate_meal' }),
        c('问孩子那边有没有锅灶', 'social', 44,
          o('孩子说有一个灶眼，和别人合用', '“能做饭。”孩子补了一句。\n\n你把柜子里那口旧锅拿下来，放在孩子脚边。',
            { meal: 'pot' }, { wit: 1, mind: 1, flag: 'gw_mv_gave_pot' }),
          o('孩子说不知道，到那边再看', '筷子停在半空，汤面上结了一层薄膜。\n\n谁也没有再说话。',
            { meal: 'quiet' }, { mind: -2, flag: 'gw_mv_no_words' })),
        o('起身去把碗洗了', '水开得很小。\n\n碗洗完，孩子已经站在门口了。\n\n孩子说的那句“走了”，你隔了一会儿才应。',
          { meal: 'wash' }, { mind: -1, flag: 'gw_mv_washed' }),
      ]],
    ['空出来的房间',
      S => '那间屋的门开着。\n\n床板露出来，床脚垫着两块砖。\n\n'
        + (S.flags.gw_mv_no_meal ? '灶上的锅一直凉着，没有人洗。' : '桌上还留着两只碗，一只没有洗。')
        + (S.flags.gw_mv_car_left ? '\n\n门口的地上有两道拖痕，箱子最后是借板车拉走的。' : '')
        + '\n\n墙上有一块地方比别处干净，是原来贴东西的位置。',
      [
        o('把床板收起来', '床板靠到墙上，屋里空出一大块地。\n\n你扫了两遍，把窗打开。\n\n晚上回来，那间屋的灯没有开。',
          { room: 'empty' }, { mind: 1, flag: 'gw_mv_room_empty' }),
        o('收拾出来，租出去', '来看房的是一对年轻夫妻，当场交了押金。\n\n他们把床搬进来那天，你在门口站着。\n\n钥匙又配了一把。',
          { room: 'rent' }, { money: 2000, flag: 'gw_mv_rented_room' }),
        o('什么也不动，把门关上', '门关上以后，屋里还是那个样子。\n\n你每天路过，会停一下。\n\n门缝里的灰越来越厚。',
          { room: 'keep' }, { mind: -1, flag: 'gw_mv_room_kept' }),
      ]],
    ['回来那天',
      S => (S.flags.gw_mv_rented_room ? '租出去的那间屋还没到期，合同一年一签。'
        : S.flags.gw_mv_room_kept ? '那间屋一直空着，门关着。'
          : '那间屋空着，床板靠在墙上。')
        + '\n\n第三年冬天，' + MOVER(S) + '上来敲门，说楼下有个孩子，两只箱子，上楼的钱还差一截。\n\n'
        + '你下楼去，看见' + KID(S) + '站在车边。\n\n“住几天。”孩子说。',
      [
        o('把箱子拎进来', '箱子比走的时候重，里面多了两本书和一只旧锅。\n\n你下楼买了一套被褥，一千二。\n\n那天夜里，屋里的灯亮到很晚。',
          null, { money: -1200, flag: 'gw_mv_back_home' }, { trust: 1, end: 'back' }),
        o('把钥匙给孩子', '你把门后那把钥匙取下来，放进孩子手里，又把五百眼给了搬东西的人。\n\n孩子自己开了门，站在门口没有马上进去。\n\n楼道的灯亮着。',
          null, { money: -500, flag: 'gw_mv_key_back' }, { trust: 1, end: 'key' }),
        o('说住几天可以', '你买了二斤肉，三百眼。\n\n孩子把箱子拖进屋里，没有多说。\n\n第二天一早孩子就出门了，晚上回来，身上有油味。',
          null, { money: -300, mind: -1, flag: 'gw_mv_few_days' }, { trust: -1, end: 'days' }),
      ]],
  ]);

  // ============ 16 个事件 ============
  C.addEvents('grow', [
    // —— 5 个无选项 ——
    { id: 'gw_school_chair', age: [26, 66], w: 10,
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 7 && S.age - k.born <= 18) },
      eff: { queue: ['gw_school_chair_back', 9] },
      text: '办公室里给你搬了一把小椅子，坐下去膝盖顶到桌沿。\n\n老师翻本子的声音很轻。\n\n你把手放在膝盖上，等那一页翻完。' },
    { id: 'gw_school_shoes', age: [26, 66], w: 9,
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 7 && S.age - k.born <= 18) },
      eff: { queue: ['gw_school_shoes_back', 6] },
      text: '孩子把鞋脱在门口，鞋底磨穿了一个洞，袜子上是黑的。\n\n家长会的通知单压在鞋里，折成很小一块。\n\n你把它展开，展了三遍才看清日期。' },
    { id: 'gw_school_report', age: [26, 66], w: 9,
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 7 && S.age - k.born <= 18) },
      text: '成绩单从书包里露出一角，压在一本旧杂志下面。\n\n名次那一栏用铅笔改过，前一次擦得很干净。\n\n你把单子放回去，位置摆得和原来一样。' },
    { id: 'gw_move_boxes', age: [28, 68], w: 9,
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 16 && S.age - k.born <= 30) },
      eff: { queue: ['gw_move_boxes_back', 7] },
      text: '两只纸箱放在门口，一只写着“书”，另一只什么也没写。\n\n箱角用胶带缠了两圈，缠得歪。\n\n你伸手掂了掂，两只都不沉。' },
    { id: 'gw_move_key', age: [28, 68], w: 9,
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 16 && S.age - k.born <= 30) },
      text: '门后的钉子上多了一串钥匙，两把，一把是新的。\n\n旧的那把还挂在你自己的钥匙圈上。\n\n晚上你锁门，试了两次才对准锁孔。' },

    // —— 5 个抉择（各带 2–3 个选项，均含判定）——
    { id: 'gw_school_bill', age: [28, 60], w: 9, title: '赔偿那一栏',
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 8 && S.age - k.born <= 18) },
      eff: { queue: ['gw_school_bill_back', 7] },
      text: '老师把一张单子推过来：医药费、误工费、校服清洗费，三项加起来一万二千眼。\n\n“今天交，就不走程序。”\n\n孩子的书包还挂在椅背上，拉链开着。\n\n单子最下面一行留着签名的位置。',
      choices: [
        { t: '把钱数齐，今天交', eff: { money: -12000, mind: -1, flag: 'gw_paid_school_bill' },
          r: '钱在窗口点完，收据打了两份。\n\n老师把其中一份夹进本子，另一份给你。\n\n出门时孩子问，是不是可以不去了。' },
        { t: '问这三项各是怎么算的', check: { s: 'social', dc: 46 },
          ok: { r: '老师把每一项念了一遍，念到误工费时停了。\n\n“这项可以不收。”\n\n最后交了八千。', eff: { money: -8000, wit: 1, flag: 'gw_cut_school_bill' } },
          no: { r: '老师合上单子，说都是按规矩算的。\n\n你再问，老师就去看电话。\n\n第二天单子上的数没有变。', eff: { mind: -2, flag: 'gw_bill_unclear' } } },
        { t: '把单子收起来，改天再说', eff: { money: -200, mind: -1, flag: 'gw_bill_deferred' },
          r: '你把单子折好，放进内袋。\n\n老师没有拦，说月底以前都可以。\n\n月底再去，单子上多了一行滞纳，二百眼。' },
      ] },
    { id: 'gw_school_fight', age: [28, 60], w: 9, title: '谁的错',
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 8 && S.age - k.born <= 18) },
      text: '放学的时候，孩子和另一个男孩被留在教室里。\n\n两个人的书包都放在讲台上，谁也不去拿。\n\n老师说，谁先动手的，现在说清楚。\n\n孩子看着你，没有说话。',
      choices: [
        { t: '让老师按校规处理', eff: { mind: -1, flag: 'gw_left_to_school' },
          r: '老师在本子上写了两个人的名字，一边一个。\n\n回家的路上孩子走在前面，书包带子拖得很长。\n\n第二天孩子说，那个男孩换了座位。' },
        { t: '问值班的保安看见了什么', check: { s: 'social', dc: 44 },
          ok: { r: '保安说，是那个男孩先推的书包。\n\n老师把本子上的顺序改了。\n\n孩子抬头看了你一眼，又低下去。', eff: { wit: 1, flag: 'gw_fight_witness' } },
          no: { r: '保安说没有看见，当时在门口。\n\n老师把本子合上，说按两个人一起算。\n\n那一栏写的是“互殴”。', eff: { mind: -2, flag: 'gw_fight_both' } } },
        { t: '把孩子带出去，自己问', eff: { mind: 1, flag: 'gw_asked_child_first' },
          r: '你把孩子带到走廊尽头，蹲下来问。\n\n孩子说的和老师说的不一样。\n\n你听完，没有说要信谁。' },
      ] },
    { id: 'gw_school_expel', age: [28, 60], w: 8, title: '劝退信',
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 8 && S.age - k.born <= 18) },
      text: '学校寄来一封信，开头写着“劝退”。\n\n下面列了三条，最后一条是“家长须在五日内签字确认”。\n\n信封里还夹着另一张纸，印着转学窗口的地址。\n\n孩子站在门口，没有进来。',
      choices: [
        { t: '先去窗口问转学要办什么', check: { s: 'wit', dc: 46 },
          ok: { r: '窗口的人说要三样材料，其中一样在原来的班主任手里。\n\n你把三样写在收据背面。\n\n回去的路上，孩子跟在你后面半步。', eff: { wit: 1, flag: 'gw_transfer_steps' } },
          no: { r: '窗口已经下班，卷帘门放下一半。\n\n你从缝里看见里面有人在扫地。\n\n第二天再去，队排到了门外。', eff: { mind: -2, flag: 'gw_transfer_queue' } } },
        { t: '在劝退信上签字', eff: { mind: -2, money: -500, flag: 'gw_signed_expel' },
          r: '你签了字，信封交回去，收了五百眼的档案代办费。\n\n孩子那句话一直没有问出口。\n\n第二天孩子没有穿校服。' },
        { t: '把信收起来，谁也不说', eff: { mind: -1, flag: 'gw_hid_expel' },
          r: '信压在你床垫下面，压了三天。\n\n三天里学校没有再来人。\n\n第四天，孩子问起信的事情。' },
      ] },
    { id: 'gw_move_deposit', age: [30, 62], w: 9, title: '押一付三',
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 16 && S.age - k.born <= 28) },
      eff: { queue: ['gw_move_deposit_back', 8] },
      text: '孩子看中一间房，在货车场后面，月租八百，押一付三。\n\n房东说要先交三千二，钥匙才给。\n\n孩子的钱数出来是两千一。\n\n钱摊在桌上，一张一张抹平。',
      choices: [
        { t: '把差的补上', eff: { money: -1100, flag: 'gw_paid_deposit' },
          r: '你把一千一补进去，钱一起装进旧信封。\n\n房东数完，把钥匙放在桌上，钥匙上贴着门牌号。\n\n孩子把信封口折了两道。' },
        { t: '跟房东讲押一付一', check: { s: 'social', dc: 46 },
          ok: { r: '房东说看在你孩子的面子上，先付一。\n\n押金八百，你先垫上；第一个月的房租，孩子自己交。\n\n收据上写的是“押一付一”。', eff: { money: -800, wit: 1, flag: 'gw_deposit_cut' } },
          no: { r: '房东把钥匙收回去，说少一分都不行。\n\n孩子把两千一重新数了一遍。\n\n最后孩子把钱收起来，说再看看别处。', eff: { mind: -2, flag: 'gw_deposit_failed' } } },
        { t: '让孩子先住家里，钱慢慢攒', eff: { mind: 1, flag: 'gw_stay_home' },
          r: '你把钱推回去。\n\n孩子坐在桌边，把两千一数了两遍，才收进口袋。\n\n那间房后来租给了别人。' },
      ] },
    { id: 'gw_move_load', age: [30, 62], w: 9, title: '下楼',
      req: { kids: [1, null], fn: S => S.kids.some(k => k.alive && S.age - k.born >= 16 && S.age - k.born <= 28) },
      eff: { queue: ['gw_move_load_back', 6] },
      text: '两只箱子要搬到楼下，楼道窄，转角还要抬高。\n\n孩子拎起大的那只，走了两步，箱子磕在扶手上。\n\n“我自己来。”孩子说。\n\n楼下有人按喇叭，按得很短。',
      choices: [
        { t: '接过来，两个人抬', check: { s: 'body', dc: 44 },
          ok: { r: '你抬前面，孩子在后面。\n\n到二楼转角，两个人都停了半拍，又一起抬起来。\n\n箱子落地时，手心里全是木屑。', eff: { body: -1, mind: 1, flag: 'gw_carried_together' } },
          no: { r: '箱子在转角滑了下来，砸在你的脚背上。\n\n孩子在楼上喊了一声。\n\n那一下之后，箱子是你一个人拖下去的。', eff: { body: -3, mind: -1, flag: 'gw_foot_hurt' } } },
        { t: '花钱请人搬', eff: { money: -800, flag: 'gw_hired_porter' },
          r: '楼下的人上来两个，一人一只，走得比你们快。\n\n八百眼，当场结清。\n\n孩子站在楼梯口，看着箱子下去。' },
        { t: '让孩子自己搬，你在下面等', eff: { mind: -1, flag: 'gw_kid_carried_alone' },
          r: '你在楼下等。\n\n孩子跑了两趟，第二趟下来时，手背上一道红印。\n\n孩子说不疼，接着把箱子往车上推。' },
      ] },

    // —— 3 个跨年回响（日常布种，manual 后续）——
    { id: 'gw_school_chair_back', manual: true, age: [34, 95], w: 1, title: '旧桌椅',
      req: { kids: [1, null] },
      text: '学校翻修，旧桌椅堆在门口，等着装车。\n\n你认出其中一把小椅子，椅面只有巴掌宽。\n\n你站了一会儿，没有走近。',
      eff: { mind: 1, flag: 'gw_chair_seen_again' } },
    { id: 'gw_school_shoes_back', manual: true, age: [33, 95], w: 1, title: '大一号的鞋',
      req: { kids: [1, null] },
      text: '六年后，孩子用第一次工钱给你买了一双鞋。\n\n尺码大了一号。\n\n你说大一点好，走路不挤脚。说完把鞋放回盒子里。',
      eff: { mind: 1, flag: 'gw_shoes_bought_back' } },
    { id: 'gw_move_boxes_back', manual: true, age: [34, 95], w: 1, title: '又两只纸箱',
      req: { kids: [1, null] },
      text: '七年后，孩子托人捎回两只纸箱。\n\n一只写着“书”，另一只什么也没写，胶带缠得歪。\n\n你把它们摞在门后，没有打开。',
      eff: { mind: 1, flag: 'gw_boxes_back' } },

    // —— 3 个跨年回响（抉择布种，manual 后续）——
    { id: 'gw_school_bill_back', manual: true, age: [34, 95], w: 1, title: '七年后的一张收据',
      req: { kids: [1, null] },
      text: S => '七年后整理柜子，你翻出一张收据。\n\n'
        + (S.flags.gw_paid_school_bill ? '金额是一万二千，字被水泡过，还能认。'
          : S.flags.gw_cut_school_bill ? '金额是八千，旁边多了一行手写的“免误工”。'
            : '金额那一栏是后来补上的，字比日期深。')
        + '\n\n收据背面有一行铅笔字，是孩子的笔迹：已经交了。',
      eff: { mind: 1, flag: 'gw_school_receipt_back' } },
    { id: 'gw_move_deposit_back', manual: true, age: [36, 95], w: 1, title: '八年后的一只信封',
      req: { kids: [1, null] },
      text: S => '八年后，孩子把一只信封放在桌上。\n\n里面的钱数得很平，一共三千二。\n\n'
        + (S.flags.gw_paid_deposit ? '“当年你补的那一千一，我一直记着。”'
          : S.flags.gw_deposit_cut ? '“押一付一省下的钱，后来还是花在别处了。”'
            : '“那年没租成，这笔钱我攒下来了。”')
        + '\n\n信封没有封口。',
      eff: { money: 3200, mind: 1, flag: 'gw_deposit_returned' } },
    { id: 'gw_move_load_back', manual: true, age: [36, 95], w: 1, title: '六年后的一次搬家',
      req: { kids: [1, null] },
      text: S => '六年后你又搬了一次家。\n\n箱子还是两只，抬到三楼时，你的手开始抖。\n\n'
        + (S.flags.gw_carried_together ? '你想起来那次两个人抬一只箱子，转角停了半拍。'
          : S.flags.gw_foot_hurt ? '脚背上那道旧伤在阴天里发酸。'
            : '那次是孩子一个人把箱子搬下去的，你在楼下等。')
        + '\n\n你在楼梯上坐了一会儿，才把箱子拖进门。',
      eff: { body: -2, mind: 1, flag: 'gw_back_strain' } },
  ]);
})();
