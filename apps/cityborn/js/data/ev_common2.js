/* 都市日常二（批次 21）：40 个不分身份的事件。
 * 这批专门给“人人都能遇到”的池子加厚：不要求职业、不要求剧情旗标，只按地点和年龄分化。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'cmn_' + id, age: age || [14, 95], req: req || {}, w: 11, repeat: true, cd: 12, text, ...(eff ? { eff } : {}),
  });

  // ---------- 14 个无选项 ----------
  amb('wet_stairs', '楼道的台阶永远是湿的。\n\n没有人知道水从哪儿来，拖地的人也不承认。\n\n下楼的人都扶着同一根扶手，那根扶手被扶得发亮。');
  amb('two_lamps', '这条巷子有两盏灯，只亮一盏。\n\n另一盏的灯泡早就没了，灯罩还在，下面积着一层灰。\n\n没有人提议换。');
  amb('bus_window', '班车的窗上有一道很长的划痕，像谁用钥匙写了一半的字。\n\n车开起来的时候，划痕后面的街景被切成一条一条。\n\n你看了很多年，也没认出那是什么字。');
  amb('frozen_pipe', '水管冻住了。\n\n楼上的人敲了三下管子，楼下的人敲回两下。\n\n水在中午回来，先是一阵气，然后才是水。', { body: -1 }, [14, 95], { loc: 'backstreet' });
  amb('one_shoe', '路边有一只鞋，鞋带系着。\n\n第二天它还在，位置没变。\n\n第三天不见了，地上留着一小片干净的地方。');
  amb('hospital_queue', '医院的队从窗口排到楼梯口。\n\n有人带着折叠凳，有人坐着自己的包。\n\n叫号的声音很小，念到第三遍才有人应。', { mind: -1 });
  amb('old_frame', '墙上的相框里换过好几张照片。\n\n最早那张的钉子孔还在，没有人堵。\n\n新照片比旧的小一圈，边上露出底下的墙。');
  amb('cold_medicine', '药盒里的药片按天排好，一天一格。\n\n有一天那一格是空的，你没有补。\n\n第二天你补上了，位置没有变。', { body: 1 }, [40, 95]);
  amb('door_number', '门牌上的数字被换过一次。\n\n旧数字留下的四个钉眼还在，新牌子比旧的小。\n\n送信的人每次都要抬头看两遍。');
  amb('radio_static', '收音机在夜里能收到一个没有人的频道。\n\n背景里有很轻的沙沙声，像是有人在很远的地方翻纸。\n\n你听了很久，没有等到说话。');
  amb('farewell_shop', '对面的店在搬东西。\n\n搬出来的是货架，最后是一块招牌，抬的时候两个人换了一次手。\n\n第二天那里贴上了“出租”。', undefined, [18, 95], { loc: ['backstreet', 'nest'] });
  amb('thin_wall', '隔壁的说话声透过墙传过来，听不清内容，只听得清语气。\n\n有一段是两个人在争，后来停了。\n\n再后来是水声。', { mind: -1 });
  amb('salt_road', '门口的路面上撒过盐，白了一小片。\n\n雪化之后那片白还在，被踩进缝里。\n\n扫地的人扫不掉，就绕开了。', undefined, [14, 95], { loc: 'outskirts' });
  amb('old_glove', '工作台上有一只手套，只有一只。\n\n另一只不知道去哪儿了，也没有人找。\n\n那只手套一直摆在原位，指头朝着门口。', undefined, [18, 95]);

  // ---------- 14 个带选项 ----------
  E.push({ id: 'cmn_wallet', age: [16, 90], w: 10, title: '掉在地上的钱包',
    text: '地上有一只钱包，皮面磨得发白。\n\n里面没有多少钱，有一张折成三折的纸，还有一个地址。\n\n路上的风把钱包的开口吹得一开一合。',
    choices: [
      { t: '按地址送回去', check: { s: 'social', dc: 40 },
        ok: { r: '开门的人看了你半天，才伸手接。\n\n“里面的纸。”他说，“还在吗。”\n\n你把纸递给他，他没有打开看。', eff: { social: 1, mind: 1, flag: 'cmn_returned_wallet' } },
        no: { r: '那个地址是一间锁着的空房。\n\n门上的锁是新的，缝里塞着三张传单。', eff: { mind: -1 } } },
      { t: '把现金拿走，钱包放回原处', eff: { money: 2000, mind: -2, flag: 'cmn_took_cash' }, r: '钱不多，刚好够两顿饭。\n\n你把钱包摆回原来的位置，摆得很正。' },
      { t: '交给巷口的摊主', eff: { social: 1, mind: 1 }, r: '摊主接过去，放在柜台上压着。\n\n“有人来问就给他。”他说。\n\n之后你每次路过都看一眼，那只钱包一直在。' },
    ] });

  E.push({ id: 'cmn_borrow_power', age: [18, 90], req: { loc: 'backstreet' }, w: 10, title: '借个插座',
    text: '隔壁的人敲门，说家里跳了闸，想借一个插座充一会儿。\n\n他手里拿着一只快没电的灯，电线缠得很整齐。\n\n“十分钟。”他说。',
    choices: [
      { t: '让他进来充', eff: { money: -300, mind: 1, flag: 'cmn_lent_power' }, r: '灯亮起来以后他一直看着它，没有说话。\n\n走的时候他把线绕回去，绕得比来的时候还整齐。' },
      { t: '把插排递到门口', check: { s: 'social', dc: 36 },
        ok: { r: '他道了谢，蹲在门口等。\n\n电充到一半，楼道灯灭了，他就自己回去了。', eff: { social: 1 } },
        no: { r: '他接了插排，半天才说“那我拿过去”。\n\n插排第二天才还回来，线被踩脏了一截。', eff: { mind: -1 } } },
      { t: '说自己也跳闸了', eff: { mind: -1 }, r: '他点点头，说“那我再问问”。\n\n他转身去敲下一家。\n\n这一层的门，一家一家都没有开。' },
    ] });

  E.push({ id: 'cmn_wrong_parcel', age: [18, 90], w: 9, title: '送错的包裹',
    text: '门口放着一只包裹，收件人不是你。\n\n上面的门牌号和你的只差一位。\n\n包裹很轻，晃起来没有声音。',
    choices: [
      { t: '送到隔壁单元去', eff: { body: -1, social: 1, flag: 'cmn_delivered_parcel' }, r: '开门的人看了一眼，说“这个我早就退了”。\n\n他还是收下了，把门关得很轻。' },
      { t: '拆开看是什么', eff: { wit: 1, mind: -1, flag: 'cmn_opened_parcel' }, r: '里面是一只空盒子，盒底有一张纸，写着一串数字。\n\n数字有十一位，像是编号。' },
      { t: '放在原处，等它被拿走', eff: { mind: 1 }, r: '第三天包裹不见了。\n\n门口地面上留着一块比周围干净的长方形。' },
    ] });

  E.push({ id: 'cmn_old_classmate', age: [24, 80], w: 9, title: '认出来的人',
    text: '街上有人叫你的名字，用的是很多年前那个称呼。\n\n他老了很多，你还是认出来了。\n\n他说他现在做点小生意，问你还在不在原来那儿。',
    choices: [
      { t: '照实说 ', eff: { social: 1, mind: 1 }, r: '他听完点点头，说“也行”。\n\n你们站在路边又说了几句，说的都是别人。' },
      { t: '问他这些年怎么样', check: { s: 'social', dc: 42 },
        ok: { r: '他说了十分钟，中间笑了两次。\n\n笑完他说“其实也没那么好”。', eff: { social: 2, flag: 'cmn_old_friend' } },
        no: { r: '他说“就那样”，然后就问你要去哪儿。\n\n你们各走各的。', eff: { mind: -1 } } },
      { t: '说不记得了', eff: { mind: -1 }, r: '他愣了一下，说“也是，那时候人多”。\n\n他先走的，走得比你快。' },
    ] });

  E.push({ id: 'cmn_rentcheap', age: [18, 80], req: { loc: 'backstreet' }, w: 9, title: '太便宜的房',
    text: '有人介绍一间房，租金只有市价的一半。\n\n“上一个住户搬得急。”中介说。\n\n他带你去看，门开着，里面打扫得很干净。',
    choices: [
      { t: '问上一个住户为什么搬', check: { s: 'social', dc: 44 },
        ok: { r: '他说是因为工作调动，说得很快。\n\n你又问了一句，他改口说是“家里有事”。', eff: { wit: 2, flag: 'cmn_asked_tenant' } },
        no: { r: '他说“这我不清楚”。\n\n然后他开始讲采光和朝向。', eff: { mind: -1 } } },
      { t: '当天就付钱', eff: { money: -6000, mind: 1, flag: 'cmn_took_flat' }, r: '你拿到钥匙，钥匙上有两道旧划痕。\n\n第一晚楼上一直在挪东西，挪到天亮。' },
      { t: '不租', eff: { mind: 1 }, r: '中介没有多劝，把钥匙收回口袋。\n\n你下楼时，那间房的门还开着。' },
    ] });

  E.push({ id: 'cmn_strange_job', age: [18, 70], w: 9, title: '招工纸',
    text: '电线杆上贴着一张招工纸，字是手写的。\n\n“要一个人，夜里来，天亮前走。不问，不看，不记。”\n\n下面只有一个地址，没有电话。',
    choices: [
      { t: '去看看', check: { s: 'mind', dc: 46 },
        ok: { r: '那地方是一间空仓库。\n\n有人给了你一副手套和一句话：“搬完就走。”\n\n天亮前你走了，钱装在信封里。', eff: { money: 9000, mind: -2, flag: 'cmn_night_job' } },
        no: { r: '你走到半路就掉头了。\n\n身后没有脚步声，但你走得很快。', eff: { mind: -1 } } },
      { t: '撕下来带走', eff: { wit: 1, flag: 'cmn_kept_notice' }, r: '你把纸撕下来折好。\n\n第二天再看，电线杆上贴了同样的一张，字迹一样。' },
      { t: '不管', eff: { mind: 1 }, r: '之后几天你都会看一眼那根电线杆。\n\n纸一直在，边角被雨泡软了。' },
    ] });

  E.push({ id: 'cmn_skipped_queue', age: [16, 90], w: 9, title: '插队的人',
    text: '队排得很长。\n\n一个人从后面走上来，站到了你前面。\n\n他手里抱着一个孩子，孩子睡着了。',
    choices: [
      { t: '算了', eff: { mind: 1 }, r: '后面有人小声说了句什么，声音很快就没了。\n\n你往前挪了半步，把位置让得更开。' },
      { t: '提醒他后面排队', check: { s: 'social', dc: 40 },
        ok: { r: '他回头说了声对不起，抱着孩子退到了队尾。\n\n队尾的人往里让了让。', eff: { social: 1 } },
        no: { r: '他没有动，也没有回头。\n\n后面的人开始说话，说的是你。', eff: { mind: -2 } } },
      { t: '把自己的号让给他', eff: { mind: 2, flag: 'cmn_gave_number' }, r: '他接了号，连说了两遍谢谢。\n\n你重新去队尾排，队尾比刚才更长。' },
    ] });

  E.push({ id: 'cmn_night_knock', age: [18, 90], w: 8, title: '门外的两下',
    text: '半夜有人敲门，两下，很轻。\n\n你不出声，门外也不出声。\n\n过一会儿，又有两下。',
    choices: [
      { t: '开门', check: { s: 'mind', dc: 48 },
        ok: { r: '门外站着一个孩子，手里抱着一个纸包。\n\n他把纸包放在地上就走了，走的时候没有跑。', eff: { mind: -1, flag: 'cmn_opened_door' } },
        no: { r: '门开到一半，你停住了。\n\n外面什么也没有，楼道灯是灭的。', eff: { mind: -2, dist: 1 } } },
      { t: '从猫眼看', eff: { wit: 1, flag: 'cmn_peeped' }, r: '外面太黑，什么也看不见。\n\n但你听见了呼吸声，很近，很慢。' },
      { t: '把门链挂上，回床上', eff: { mind: -1 }, r: '你把被子拉到下巴。\n\n敲门声没有再响，你却到天亮才睡着。' },
    ] });

  E.push({ id: 'cmn_fixed_phone', age: [18, 85], w: 9, title: '修机器的人',
    text: '修机器的人把后盖拆开，里面的线被虫蛀过一段。\n\n“能修。”他说，“但修好也不一定能用。”\n\n他报了一个价，比买新的便宜一半。',
    choices: [
      { t: '修', eff: { money: -3000, wit: 1, flag: 'cmn_fixed_it' }, r: '他换了一小段线，用烙铁烫上。\n\n机器又能开了，屏幕上有一道新的亮线。' },
      { t: '不修，问他那段线能不能给自己', check: { s: 'social', dc: 38 },
        ok: { r: '他把线头剪齐了递给你。\n\n“这个不值钱。”他说，“留着当个记号。”', eff: { wit: 2, flag: 'cmn_kept_wire' } },
        no: { r: '他说“这得留着做凭证”。\n\n你把机器留在了店里。', eff: { mind: -1 } } },
      { t: '走人', eff: { mind: 1 }, r: '你把机器揣回去。\n\n它现在还能开着，只是开一会儿就发烫。' },
    ] });

  E.push({ id: 'cmn_lost_key', age: [16, 90], w: 9, title: '丢了钥匙的孩子',
    text: '楼道里有个孩子蹲在门口，书包放在脚边。\n\n“钥匙丢了。”他说，“家里没人。”\n\n他没有哭，只是一直摸自己的口袋。',
    choices: [
      { t: '帮他找', check: { s: 'wit', dc: 40 },
        ok: { r: '钥匙卡在楼梯缝里，缝很窄。\n\n你用一根铁丝勾出来，他在旁边一直看着。', eff: { wit: 2, social: 1, flag: 'cmn_found_key' } },
        no: { r: '你们找了很久，找到的都是别人的东西：一枚扣子、一张票根。\n\n天黑了，他还蹲在那儿。', eff: { mind: -1 } } },
      { t: '让他在你家等', eff: { money: -800, mind: 2, flag: 'cmn_took_child_in' }, r: '他坐在门口的凳子上，一直没往里走。\n\n吃了半碗面，说“我家里人会还你”。' },
      { t: '告诉他去找巡街的', eff: { mind: -1 }, r: '他点点头，背上书包走了。\n\n你上楼的时候，听见他还在楼道里走。' },
    ] });

  E.push({ id: 'cmn_fight_floor', age: [18, 90], w: 9, title: '楼道里的争吵',
    text: '楼下在吵，两个人的声音都很大。\n\n有东西被摔了，摔完之后安静了两秒。\n\n然后又吵起来。',
    choices: [
      { t: '下去看看', check: { s: 'social', dc: 44 },
        ok: { r: '你插进去说了几句，两边都停了。\n\n其中一个开始收拾地上的碎片，另一个站着没动。', eff: { social: 2, mind: 1 } },
        no: { r: '他们一起转向你。\n\n“关你什么事。”\n\n你退回去，门关得很轻。', eff: { mind: -2 } } },
      { t: '关上门，把声音隔在外面', eff: { mind: -1 }, r: '争吵持续了很久，后来变成一个人的声音。\n\n再后来，只有脚步声在楼道里上来下去。' },
      { t: '打楼下的公用电话', eff: { flag: 'cmn_called', mind: 1 }, r: '电话接通了，对面问地址。\n\n你报完地址，那边说“知道了”。\n\n没有人来。' },
    ] });

  E.push({ id: 'cmn_move_again', age: [20, 80], w: 8, title: '又一次搬家',
    text: '这个箱子底磨破了一个角，是上次搬家的时候。\n\n你没有补。\n\n这一次装进去的东西比上次少。',
    choices: [
      { t: '把破的地方补上', eff: { money: -600, wit: 1, flag: 'cmn_patched_box' }, r: '你找了一块硬纸板垫进去，用胶带缠了两圈。\n\n箱子现在比以前结实。' },
      { t: '换成新的', eff: { money: -2000, flag: 'cmn_new_box' }, r: '新箱子是硬的，搬起来硌手。\n\n旧的那个留在门口，不知道谁拿走了。' },
      { t: '就这样，反正还要搬', eff: { mind: -1 }, r: '一路走一路掉东西。\n\n到了新住处清点，少了一把梳子。' },
    ] });

  // ---------- 6 组跨年回响（3 事件 + 3 manual） ----------
  E.push({ id: 'cmn_borrowed', age: [18, 80], w: 8, title: '借出去的东西',
    text: '有人来借一样东西，说用完就还。\n\n那样东西你自己也不常用。\n\n他伸手来接的时候，手心是朝上的。',
    choices: [
      { t: '借给他', eff: { queue: ['cmn_borrowed_back', 7], mind: 1, flag: 'cmn_lent_thing' }, r: '他拿走了，走得很轻快。\n\n你把这件事记在了纸条上，纸条压在抽屉里。' },
      { t: '说自己要用', eff: { mind: -1 }, r: '他说“那算了”，走的时候把手插进了口袋。\n\n那样东西你后来一次也没用过。' },
    ] });
  E.push({ id: 'cmn_borrowed_back', manual: true, age: [25, 90], w: 1,
    text: '七年后，那样东西被还了回来。\n\n放在门口，包得很仔细。\n\n包东西的纸上是别人的字：“他一直记着。”',
    eff: { mind: 2, flag: 'cmn_thing_returned' } });

  E.push({ id: 'cmn_unfinished', age: [18, 85], w: 8, title: '没说完的一句',
    text: '临走的时候，他想说什么，被别的声音打断了。\n\n后来你们各自走了。\n\n那句话的后半截，一直在你耳朵里。',
    choices: [
      { t: '回去问清楚', eff: { body: -1, queue: ['cmn_unfinished_back', 5], mind: -1, flag: 'cmn_went_back_ask' }, r: '你回到原处，人已经不在。\n\n旁边的人说他往那个方向走了，走得很急。' },
      { t: '算了', eff: { queue: ['cmn_unfinished_back', 5], mind: 1, flag: 'cmn_let_it_go' }, r: '你往前走。\n\n走出两条街，那几个字还在，像卡在门缝里的纸。' },
    ] });
  E.push({ id: 'cmn_unfinished_back', manual: true, age: [24, 95], w: 1,
    text: '五年后，你在殡仪馆外的名单上看见那个名字。\n\n名单很短，名字后面写着年龄。\n\n那句话到底是什么，现在没人能答了。',
    eff: { mind: -2, flag: 'cmn_never_asked' } });

  E.push({ id: 'cmn_address_paper', age: [18, 80], w: 8, title: '一张地址',
    text: '旧外套的口袋里有一张纸，上面是一个地址。\n\n字是你写的，写法很用力。\n\n你不记得为什么要留着它。',
    choices: [
      { t: '去一趟', eff: { body: -1, queue: ['cmn_address_back', 9], flag: 'cmn_went_address' }, r: '那地方是一家关了门的铺子。\n\n卷闸上贴着一张招租，电话号码被撕掉了一角。' },
      { t: '扔掉', eff: { queue: ['cmn_address_back', 9], mind: 1, flag: 'cmn_threw_address' }, r: '纸掉进垃圾桶的时候，你听见它碰到桶底。\n\n很轻。' },
    ] });
  E.push({ id: 'cmn_address_back', manual: true, age: [27, 95], w: 1,
    text: '九年后，同一片街区拆了。\n\n你在废墟边上遇见一个人，他说他以前在这儿开铺子。\n\n“那时候有个年轻人来过，站在门口看了很久。”',
    eff: { mind: -1, flag: 'cmn_address_gone' } });

  C.addEvents('common2', E);
})();
