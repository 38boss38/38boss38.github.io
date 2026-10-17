/* 都市日常三（批次 26）：40 个不分身份的事件。
 * 与 common2 错开题材：通勤、排队、修东西、租、病、丧、促销与年末。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'cm3_' + id, age: age || [14, 95], req: req || {}, w: 11, repeat: true, cd: 13, text, ...(eff ? { eff } : {}),
  });

  // ---------- 18 个无选项 ----------
  amb('rush_hour', '早高峰的扶梯上，所有人都站在同一侧。\n\n另一侧空着，一路空到底。\n\n有人试过往上跑，跑到一半被自己的鞋绊了一下。');
  amb('queue_shuffle', '队伍每隔十分钟往前挪一步。\n\n有人带着折叠凳，有人靠在墙上闭着眼。\n\n没有人问还要多久。');
  amb('two_prices', '同一件东西，两家店差三成。\n\n贵的那家在灯下摆得很整齐，便宜的那家堆在门口的纸箱里。\n\n你站在中间看了一会儿。', undefined, [14, 95], { loc: ['nest', 'backstreet'] });
  amb('fixed_lamp', '巷口的灯修好了。\n\n亮了三天，第四天又开始闪。\n\n修灯的人说这不是灯的问题，是线的问题；线要整条换。');
  amb('winter_coat', '冬天的大衣拿出来，兜里有一张去年的车票。\n\n日期是去年最冷的那天。\n\n你没有扔，又塞回了兜里。', undefined, [16, 95]);
  amb('glass_door', '商店的玻璃门上贴着一张打印纸：本店不设监控。\n\n纸下面还有一行小字，被人撕掉了。\n\n玻璃上倒映着街上的人，一个一个走过去。');
  amb('hot_water', '澡堂的热水今天供到十点。\n\n十点整，水变凉，没有人喊。\n\n大家默默地起来，默默地穿衣服。', { body: 1 }, [16, 95], { loc: 'backstreet' });
  amb('empty_chair', '候诊室多了一把椅子，摆在过道上。\n\n没有人坐，也没有人搬走。\n\n来的人从它旁边侧身过去。');
  amb('dead_phone', '公用电话亭的电话坏了，话筒垂在半空。\n\n亭子里的号码簿被人撕走了一半。\n\n剩下那半本上，有一页被反复翻过，纸边发黑。');
  amb('sale_banner', '商场挂出“年末清仓”的横幅，红底黄字。\n\n横幅下面，店员正在把最后一批货摆回原位。\n\n“明天还要卖。”他说。');
  amb('old_building', '这栋楼的门厅贴过七次通知，一层压一层。\n\n最早那张只剩“拆迁”两个字。\n\n最新的那张写着“请勿在此张贴”。');
  amb('rain_gutter', '雨顺着排水沟流下去，声音很大。\n\n沟口的铁栅少了两根，水面翻着小泡。\n\n有人蹲在旁边，用树枝拨里面的东西。');
  amb('child_chalk', '地上有粉笔画的一排格子，被踩掉了一半。\n\n旁边放着半截粉笔，用石头压着。\n\n没有人来收。');
  amb('night_bus', '末班车上的人都在看手机，屏幕照着脸。\n\n靠窗那个没有看，一直看着窗外。\n\n窗外是黑的，什么也没有。');
  amb('hospital_smell', '医院走廊里有一股味道，说不清是消毒水还是别的。\n\n有人用围巾捂住口鼻。\n\n护士经过时脚步很快，没有人抬头。', { mind: -1 });
  amb('repair_shop', '修东西的人把零件摊在一块布上，一个不缺地摆好。\n\n修完之后，那块布上会多出一样东西。\n\n他说那是“多出来的”，从不解释从哪儿多出来。');
  amb('stair_window', '楼梯间的窗户打不开，玻璃上落了一层灰。\n\n有人在灰上画了一个圈，圈里写着数字。\n\n数字每天减一。');
  amb('winter_hands', '冬天的手老是裂口子，抹什么都不管用。\n\n你把手指含在嘴里暖一下，再去干活。\n\n天黑之前，口子又裂开了。', { body: -1 }, [20, 95]);

  // ---------- 14 个带选项 ----------
  E.push({ id: 'cm3_lost_child', age: [18, 90], w: 10, title: '找不到家的人',
    text: '街上有个老人在原地转圈，转了很多遍。\n\n他不说话，手里攥着一张纸条。\n\n纸条上的字被汗浸花了，只认得出一个门牌号。',
    choices: [
      { t: '照门牌号带他过去', check: { s: 'social', dc: 42 },
        ok: { r: '门牌号的那户人家搬走了。\n\n邻居说他常来，每次都找同一个门。\n\n你陪他站了一会儿，他自己转身走了。', eff: { social: 1, mind: -1, flag: 'cm3_walked_old_man' } },
        no: { r: '你们走错了两次。\n\n第三次他不肯再走，蹲在路边。\n\n后来是巡街的人把他带走的。', eff: { mind: -2 } } },
      { t: '去问巡街的人', eff: { mind: 1 }, r: '巡街的人看了一眼纸条，说“又跑出来了”。\n\n他们把他扶上车，动作很熟练。' },
      { t: '把自己看到的告诉旁边的摊主', eff: { wit: 1 }, r: '摊主点点头，说会留意。\n\n第二天那张纸条被贴在摊子的柱子上，字迹更花了。' },
    ] });

  E.push({ id: 'cm3_back_door', age: [18, 85], req: { loc: 'backstreet' }, w: 9, title: '后门',
    text: '楼里的后门锁了很多年。\n\n今天它开着一条缝，缝里透出光。\n\n门外是一条你不认识的巷子。',
    choices: [
      { t: '推开门看看', check: { s: 'mind', dc: 44 },
        ok: { r: '巷子很短，尽头是一堵墙。\n\n墙边堆着旧家具，其中一把椅子上落着灰，只有扶手是干净的。', eff: { wit: 2, mind: -1, flag: 'cm3_behind_door' } },
        no: { r: '你推开门，光就没了。\n\n门外是一堵刚砌好的新墙，砂浆还没干。', eff: { mind: -2, dist: 1 } } },
      { t: '把门关上', eff: { mind: 1 }, r: '你把门推回去，锁舌咔了一声。\n\n之后每次上下楼，你都会看一眼那扇门。' },
      { t: '去叫邻居一起看', eff: { social: -1, mind: 1 }, r: '邻居来了，门已经关上了。\n\n“这扇门一直是锁着的。”他说。\n\n他看你的眼神有点奇怪。' },
    ] });

  E.push({ id: 'cm3_overcharge', age: [16, 90], w: 9, title: '多算的钱',
    text: '账算出来了，比你预期的多三成。\n\n对方一项一项念给你听，念得很清楚。\n\n最后一项叫“手续费”，没有写具体做什么。',
    choices: [
      { t: '付了', eff: { money: -4000, mind: -1 }, r: '他收钱的时候数得很快。\n\n收完在单子上盖了一个章，章印很淡。' },
      { t: '问那一项是什么', check: { s: 'social', dc: 42 },
        ok: { r: '“跑腿的钱。”他说。\n\n然后他把那一项划掉了，重新写了一个更小的数。', eff: { money: -2500, wit: 2, flag: 'cm3_asked_fee' } },
        no: { r: '“一直都是这么收的。”\n\n他把笔放下了，等你决定。\n\n后面排队的人开始叹气。', eff: { money: -4000, mind: -2 } } },
      { t: '说自己没带够钱，改天再来', eff: { wit: 1, flag: 'cm3_deferred_pay' }, r: '他把单子收进抽屉，说“保留三天”。\n\n三天之后是不是还要这三成，他也会保留。' },
    ] });

  E.push({ id: 'cm3_blank_sign', age: [18, 85], w: 9, title: '没有字的招牌',
    text: '一间新开的店，招牌是空的。\n\n玻璃里面有人在擦柜台，擦得很仔细。\n\n门口的脚垫是新的，上面印着一个你不认得的标志。',
    choices: [
      { t: '进去看看', eff: { wit: 1, flag: 'cm3_entered_shop' }, r: '里面的东西摆得很整齐，价钱都没写。\n\n你说想看看，对方说“还没定”。\n\n他把你送出门时，招牌还是空的。' },
      { t: '在门口站一会儿', eff: { mind: -1 }, r: '擦柜台的人一直没有抬头。\n\n过了很久，他把灯关了一半。' },
      { t: '问邻居这是家什么店', check: { s: 'social', dc: 38 },
        ok: { r: '邻居说已经换了三次招牌，每次都没写字。\n\n“开了关，关了开。”', eff: { wit: 2, social: 1, flag: 'cm3_asked_neighbor' } },
        no: { r: '邻居摇摇头，说自己也是刚搬来。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'cm3_sick_leave', age: [20, 80], w: 9, title: '请一天假',
    text: '你发烧了，头很沉。\n\n请假要提前一天报，或者找一个人替班。\n\n电话簿上能打的人，你翻了两遍。',
    choices: [
      { t: '自己撑过去', eff: { body: -4, money: 2000, flag: 'cm3_worked_sick' }, r: '你在工位上坐了一整天，中间去了四趟洗手间。\n\n下班时账上多了一天工资。' },
      { t: '找人替班', check: { s: 'social', dc: 40 },
        ok: { r: '有人答应了，条件是你下次替他一次。\n\n“记住啊。”他说了两次。', eff: { body: 2, mind: 1, flag: 'cm3_swapped_shift' } },
        no: { r: '打出去的电话都没人接。\n\n最后一个接了，说他也在发烧。', eff: { body: -3, mind: -2 } } },
      { t: '直接不去', eff: { money: -3000, mind: 1, flag: 'cm3_absent' }, r: '你在家睡了一整天。\n\n醒来时天已经黑了，手机上有三个未接。' },
    ] });

  E.push({ id: 'cm3_funeral_cost', age: [24, 90], w: 9, title: '一笔丧事的账',
    text: '办丧事的人拿出一张价目表。\n\n最便宜的那一档写着“简办”，后面的括号里有一行小字：不设灵堂。\n\n去世的人你不熟，是你替别人来问的。',
    choices: [
      { t: '问简办具体是什么样', check: { s: 'social', dc: 40 },
        ok: { r: '他念了一遍：两个人抬，一辆车，路口换一次。\n\n“没有告别。”他说，“但该有的都有。”', eff: { money: -8000, wit: 2, flag: 'cm3_asked_simple' } },
        no: { r: '他说“就是简办”。\n\n再问，他就把价目表收起来了。', eff: { money: -12000, mind: -1 } } },
      { t: '按中间那档办', eff: { money: -20000, mind: 1 }, r: '中间那档有一间小灵堂，可以站六个人。\n\n最后来了四个。' },
      { t: '说回去再商量', eff: { mind: -1 }, r: '他把价目表推给你，说可以带走。\n\n纸张很薄，透得出背面的字。' },
    ] });

  E.push({ id: 'cm3_neighbor_burn', age: [20, 90], w: 8, title: '烧东西的味道',
    text: '楼道里有烧东西的味道，从一户的门缝里出来。\n\n不像是做饭，也不像烟。\n\n那户人家的门镜是黑的。',
    choices: [
      { t: '敲门问一句', check: { s: 'social', dc: 44 },
        ok: { r: '开门的是个老人，手里拿着一个铁盆。\n\n“烧点旧纸。”他说，“不碍事。”\n\n屋里很干净，干净得没有别的东西。', eff: { social: 1, mind: -1 } },
        no: { r: '你敲了三下，里面停了很久，然后说“没事”。\n\n味道过了半小时才散。', eff: { mind: -2 } } },
      { t: '不管', eff: { mind: -1 }, r: '第二天楼道里多了一股灰味。\n\n门口的地上有一小片黑，扫不掉。' },
      { t: '在门口放一桶水', eff: { money: -300, mind: 2, flag: 'cm3_left_water' }, r: '你把水桶放在他门口，没有敲门。\n\n第二天桶空了，桶边放着一小把干菜。' },
    ] });

  E.push({ id: 'cm3_old_ticket', age: [20, 90], w: 8, title: '过期的票',
    text: '抽屉里有一张旧票，日期已经过去很久。\n\n那是一场你没去成的演出，或者一趟没上成的车。\n\n票根撕口很整齐。',
    choices: [
      { t: '扔掉', eff: { mind: 2, flag: 'cm3_tossed_ticket' }, r: '纸很轻，落进垃圾桶时没有声音。\n\n你把抽屉关上了。' },
      { t: '夹进书里', eff: { mind: 1, wit: 1, flag: 'cm3_kept_ticket' }, r: '你把它夹在一本不会再看第二遍的书里。\n\n合上书的时候，纸角露在外面一点点。' },
      { t: '照着票上的日期想一想那天在做什么', eff: { mind: -1 }, r: '你想不起来。\n\n那天好像和平常一样，也可能什么都不一样。' },
    ] });

  E.push({ id: 'cm3_broken_clock', age: [20, 90], w: 8, title: '停了的钟',
    text: '墙上的钟停在四点二十。\n\n没有人换电池，也没有人取下来。\n\n你后来发现，这个房间里的事都按这个时间算。',
    choices: [
      { t: '把电池换了', eff: { money: -200, wit: 1, flag: 'cm3_fixed_clock' }, r: '钟走了起来，指针从四点二十跳到现在。\n\n房间忽然显得比以前吵。' },
      { t: '留着不动', eff: { mind: 1 }, r: '四点二十成了一个大家都认的时间。\n\n“四点二十见”这句话，在这个房间里意思是“照旧”。' },
      { t: '取下来', eff: { mind: -1 }, r: '墙上的钉子孔还在。\n\n那块位置比周围白一点。' },
    ] });

  E.push({ id: 'cm3_day_off', age: [20, 85], w: 8, title: '休一天',
    text: '你有一天假。\n\n早上醒来，发现没有地方要去。\n\n窗外的人都在往同一个方向走。',
    choices: [
      { t: '睡回去', eff: { body: 2, mind: 1 }, r: '再醒来是中午。\n\n你听见楼下有人在搬东西，声音停了一会儿又继续。' },
      { t: '出门走走', eff: { body: -1, mind: 2, flag: 'cm3_walked_off_day' }, r: '你走了很远，走到不认识的街区。\n\n回来的路上，你在心里记了一条近路。' },
      { t: '把该修的东西修一遍', eff: { money: -600, wit: 1 }, r: '门轴、凳子腿、漏水的水龙头。\n\n修完天还没黑，你有点不知道下一步做什么。' },
    ] });

  E.push({ id: 'cm3_stranger_door', age: [22, 90], w: 8, title: '隔壁搬来的人',
    text: '隔壁搬来一户新邻居，搬东西搬到很晚。\n\n第二天他们门口多了一双鞋，摆得很正。\n\n第三天，鞋还在，人没有出来过。',
    choices: [
      { t: '敲门问需不需要帮忙', check: { s: 'social', dc: 40 },
        ok: { r: '开门的是个女人，眼睛很红。\n\n“不用。”她说，“就是在收拾。”\n\n门后堆着没拆的纸箱。', eff: { social: 1, mind: 1 } },
        no: { r: '里面没有人应。\n\n你回屋的时候，听见那边有搬箱子的声音。', eff: { mind: -1 } } },
      { t: '不多管', eff: { mind: 1 }, r: '第四天，那双鞋被收进去了。\n\n之后你们在楼道里遇见过几次，点点头。' },
      { t: '把一袋米放在他们门口', eff: { money: -800, mind: 2, flag: 'cm3_left_rice' }, r: '第二天米不见了，门口放着一小瓶腌菜。\n\n瓶子上没有标签。' },
    ] });

  E.push({ id: 'cm3_last_wage', age: [24, 80], w: 8, title: '最后一笔',
    text: '结工钱的时候，账上少了三天。\n\n管账的人说是“试岗期不计”。\n\n你记得试岗期是两天。',
    choices: [
      { t: '当场争', check: { s: 'social', dc: 46 },
        ok: { r: '他把单子翻过来，指着一行很小的字。\n\n你说那一行没人给你看过。\n\n他想了一会儿，把三天补上了两天。', eff: { money: 3000, wit: 1, flag: 'cm3_got_two_days' } },
        no: { r: '“规定就是这样。”\n\n他把钱推给你，让你数清楚。\n\n你数完了，一分不少，一分不多。', eff: { money: -2000, mind: -2 } } },
      { t: '算了，拿钱走人', eff: { money: -3000, mind: -1 }, r: '钱不厚，捏在手里没有感觉。\n\n出了门，你回头看了一眼那个窗口。' },
      { t: '要求写一份结算说明', eff: { wit: 2, flag: 'cm3_got_statement' }, r: '他写了一张，写得很简单。\n\n“以后有用。”你说。\n\n他笑了一下，说不一定。' },
    ] });

  E.push({ id: 'cm3_photo_booth', age: [18, 85], w: 8, title: '照相亭',
    text: '街角的照相亭还开着，四张一张。\n\n里面贴着提示：请勿拍摄他人。\n\n你坐下时，屏幕上是别人的半张脸，停在那儿没动。',
    choices: [
      { t: '拍完就走', eff: { money: -400, mind: 1 }, r: '照片出来，四张都一样，你笑得很僵。\n\n背景里的帘子是灰的。' },
      { t: '等那半张脸消失', eff: { mind: -1, dist: 1, flag: 'cm3_waited_face' }, r: '屏幕上的脸一直没有动。\n\n你等了一会儿，掀帘子走了。\n\n身后传来快门声。' },
      { t: '告诉管亭子的人', eff: { social: 1, mind: 1 }, r: '他过来看了看，拍了拍机器。\n\n“老毛病。”他说，“存的东西没清干净。”\n\n他把机器断了电，重新开。' },
    ] });

  E.push({ id: 'cm3_gift_wrap', age: [18, 90], w: 8, title: '包装',
    text: '店员问要不要包起来。\n\n包装费要加一成。\n\n你买的东西本来就有一个纸袋。',
    choices: [
      { t: '不用包，就这样', eff: { mind: 1 }, r: '你把纸袋的提手绕了两圈，提在手里。\n\n出门时纸袋的底有点鼓。' },
      { t: '包起来', eff: { money: -500, social: 1 }, r: '纸包得很整齐，角上折成了三角。\n\n拿在手里，忽然有点像送礼。' },
      { t: '问能不能只包一角', eff: { wit: 1 }, r: '店员愣了一下，笑着说没有这种包法。\n\n他还是给你多套了一层纸。' },
    ] });

  // ---------- 4 组跨年回响（4 + 4 manual） ----------
  E.push({ id: 'cm3_left_umbrella', age: [18, 85], req: { loc: 'backstreet' }, w: 8, title: '借出去的伞',
    text: '下雨，你把伞借给了一个在门口等雨停的人。\n\n他说“明天还”。\n\n第二天雨停了，伞没有回来。',
    choices: [
      { t: '算了', eff: { queue: ['cm3_umbrella_back', 6], mind: 1, flag: 'cm3_lent_umbrella' }, r: '你没再想那把伞。\n\n只是后来下雨，你偶尔会想起伞骨上有一处补过的地方。' },
      { t: '去那条街问问', eff: { body: -1, queue: ['cm3_umbrella_back', 6], mind: -1, flag: 'cm3_sought_umbrella' }, r: '你在那条街问了四家店。\n\n没有人记得那天有谁在门口等雨。' },
    ] });
  E.push({ id: 'cm3_umbrella_back', manual: true, age: [24, 90], w: 1,
    text: '六年后，一把伞被放在门口。\n\n伞骨上那处补过的地方还在，补线比原来密。\n\n没有字条。',
    eff: { mind: 2, flag: 'cm3_umbrella_returned' } });

  E.push({ id: 'cm3_promise_meal', age: [20, 85], w: 8, title: '说好的一顿',
    text: '你说过要请人吃一顿饭。\n\n对方说“等你不忙”。\n\n这句话说了很多年。',
    choices: [
      { t: '今天就去请', eff: { money: -2000, queue: ['cm3_meal_back', 7], mind: 2, flag: 'cm3_had_meal' }, r: '你们吃了很简单的一顿。\n\n对方一直说“其实不用”。\n\n结账时他把零钱推回来一半。' },
      { t: '再等等', eff: { queue: ['cm3_meal_back', 7], mind: -1, flag: 'cm3_still_waiting' }, r: '你把这件事又记了一次。\n\n记事本上那一行被描了很多遍。' },
    ] });
  E.push({ id: 'cm3_meal_back', manual: true, age: [28, 95], w: 1,
    text: '七年后，那顿饭还是没有吃成。\n\n对方搬走了，地址留在记事本上，没有人来取。\n\n你把那一页翻过去，后面还有很多空白。',
    eff: { mind: -2, flag: 'cm3_meal_never' } });

  E.push({ id: 'cm3_fixed_chair', age: [18, 85], w: 8, title: '修好的椅子',
    text: '楼下的长椅少了一条腿，垫着砖头用了两年。\n\n你找来一截旧木头，量了三次。\n\n装上以后，椅子不晃了。',
    choices: [
      { t: '顺手把扶手也钉紧', eff: { queue: ['cm3_chair_back', 8], wit: 1, social: 1, flag: 'cm3_fixed_chair' }, r: '钉子进去的时候，木头裂了一小道。\n\n你换了个角度，又敲进去一根。' },
      { t: '就修到能坐为止', eff: { queue: ['cm3_chair_back', 8], mind: 1, flag: 'cm3_chair_minimal' }, r: '椅子不晃了。\n\n扶手还是有点松，坐着的人都不提。' },
    ] });
  E.push({ id: 'cm3_chair_back', manual: true, age: [26, 95], w: 1,
    text: '八年后，那条长椅换了新的，旧的那条不知去向。\n\n新椅子没有扶手。\n\n有人坐在上面，把包放在腿边，和从前一样。',
    eff: { mind: -1, flag: 'cm3_chair_gone' } });

  E.push({ id: 'cm3_wrote_name', age: [20, 85], w: 8, title: '写在墙上',
    text: '楼道的墙上有一行铅笔字，是很多年前写的。\n\n写的是一个名字和一个日期。\n\n字迹很浅，像是怕被人看见。',
    choices: [
      { t: '把字描深', eff: { queue: ['cm3_name_back', 9], wit: 1, flag: 'cm3_deepened_name' }, r: '你描得很仔细，描完退开一步看。\n\n那行字现在比周围都清楚。' },
      { t: '擦掉', eff: { queue: ['cm3_name_back', 9], mind: 1, flag: 'cm3_erased_name' }, r: '橡皮擦过的地方起了毛。\n\n墙皮掉了一小块，露出底下的水泥。' },
    ] });
  E.push({ id: 'cm3_name_back', manual: true, age: [28, 95], w: 1,
    text: '九年后，楼道重新粉刷。\n\n刷墙的人在那一块多刷了两遍，还是能看出一点印子。\n\n“底子太深。”他说。',
    eff: { mind: -1, flag: 'cm3_name_through' } });

  C.addEvents('common3', E);
})();
