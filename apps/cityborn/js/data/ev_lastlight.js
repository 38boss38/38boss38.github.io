/* 收摊（批次 39）：24 条以"一天结束"为引子的事件。
 * 最后一位客人、最后一班车、关灯之前的那几分钟。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'll_' + id, age: age || [16, 95], req: req || {}, w: 11, repeat: true, cd: 13, text, ...(eff ? { eff } : {}),
  });

  amb('last_customer', '最后一个客人走了。\n\n桌上的碗还热着，人已经拐过街口。\n\n你把椅子一张一张翻到桌上。');
  amb('closing_light', '关灯之前，你总要看一眼屋里。\n\n看的是有没有东西忘了收。\n\n其实从来没有忘过。');
  amb('shutter', '卷闸门放下来的时候，声音很长。\n\n放到一半卡住，要抬一下再放。\n\n这条街上的人都认得这个声音。');
  amb('last_bus_missed', '末班车在你跑到站台前开走了。\n\n尾灯拐了个弯，就看不见了。\n\n站牌下面还有两个人在等，他们也不确定还有没有下一班。');
  amb('count_cash', '收摊之后数钱。\n\n数完记在本子上，字写得很小。\n\n最后一笔总是记“余”。');
  amb('empty_street', '这个点街上只剩三种人：收摊的、赶路的、没地方去的。\n\n你不属于后两种。\n\n所以你走得慢一点。');
  amb('trash_run', '倒垃圾的时候，桶边已经堆了一小堆。\n\n有人比你早一步。\n\n他把能站的地方让出来一半。');
  amb('night_sign_off', '招牌的灯一格一格灭下去，不是同时灭。\n\n最后灭的是最上面那一格。\n\n那格亮着的时候，字是完整的。');
  amb('chair_stack', '椅子摞起来，摞到第七张就开始歪。\n\n你换了个方向摞，稳了。\n\n这个办法是别人教你的。');
  amb('key_handover', '钥匙交出去之前，你在手里掂了一下。\n\n它比想象中轻。\n\n接手的人接过去，也掂了一下。');
  amb('morning_shift', '收摊的人回家，摆摊的人出来。\n\n你们在同一个位置错身。\n\n谁也不说话，都赶时间。');
  amb('count_till', '钱箱里有一枚硬币卡在缝里，怎么倒都倒不出来。\n\n你用刀尖挑了很久。\n\n最后它自己掉出来了。');

  E.push({ id: 'll_late_guest', age: [18, 85], w: 10, title: '迟来的那位',
    text: '已经收摊了，卷闸放到一半。\n\n外面站着一个人，问还卖不卖。\n\n他没有说赶时间，也没有说别的。',
    choices: [
      { t: '重新打开', eff: { money: 800, body: -1, mind: 1, flag: 'll_reopened' }, r: '你把他要的东西做出来，他已经等了很久。\n\n吃完他说了句“麻烦了”。\n\n走的时候，你把卷闸放到底。' },
      { t: '说已经收了', eff: { mind: -1 }, r: '他点点头，说“那我明天来”。\n\n第二天他没有来。' },
      { t: '问他要不要就着剩下的', check: { s: 'social', dc: 42 },
        ok: { r: '剩下的不多。\n\n他吃得很干净，连汤都喝了。\n\n“今天没吃饭。”他说。', eff: { money: 300, mind: 2, flag: 'll_fed_late' } },
        no: { r: '他退了半步，说“我再找找”。\n\n往前走了一段，又停下来看别家的灯。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'll_short_count', age: [20, 85], w: 9, title: '少了',
    text: '收摊数钱，比该有的少了一笔。\n\n不多，正好是一个人一顿饭的钱。\n\n今天来的人你大概都记得。',
    choices: [
      { t: '算了', eff: { money: -1500, mind: 1, flag: 'll_let_short' }, r: '你把差额记在本子上，写在最下面。\n\n那一行没有写原因。' },
      { t: '回想是哪一单', check: { s: 'wit', dc: 44 },
        ok: { r: '你想起来了，是有一个人付钱的时候你正接着别人说话。\n\n他大概以为给了。', eff: { wit: 2, flag: 'll_found_gap' } },
        no: { r: '想了很久，想不起来。\n\n这笔账就这么过去了。', eff: { mind: -1 } } },
      { t: '算在自己头上', eff: { money: -1500, mind: -1, flag: 'll_blamed_self' }, r: '你从自己的钱里补上，把账做平。\n\n本子上那一行写得很正。' },
    ] });

  E.push({ id: 'll_same_guest', age: [20, 85], w: 9, title: '每天都来的那位',
    text: '有一个客人每天都来，总在收摊前二十分钟。\n\n点一样的东西，坐同一个位置。\n\n今天他没有来。',
    choices: [
      { t: '把那个位置留着', eff: { wit: 1, mind: -1, flag: 'll_held_seat' }, r: '你把那张椅子翻下来，留着。\n\n到十点，你自己把它翻上去了。' },
      { t: '问旁边的人认不认识他', check: { s: 'social', dc: 44 },
        ok: { r: '“他搬走了。”那人说，“上个月。”\n\n“没听他说过。”\n\n“他那人，不说。”', eff: { wit: 2, mind: -1, flag: 'll_learned_guest' } },
        no: { r: '你问了三个人，都对不上号。\n\n原来他一直只是坐在那儿，谁也没记住他。', eff: { mind: -2 } } },
      { t: '不放在心上', eff: { mind: 1 }, r: '你照常收摊。\n\n十点关灯，一天结束。' },
    ] });

  E.push({ id: 'll_handover', age: [24, 85], w: 9, title: '把摊子交出去',
    text: '有人想接你的摊子。\n\n价钱谈得差不多了，只剩一句话没说清：\n\n那些老客人算不算在价钱里。',
    choices: [
      { t: '说他们自己会来', eff: { money: 12000, mind: 1, flag: 'll_sold_goodwill' }, r: '接手的人点点头，把定金数出来。\n\n他数得很快，一张一张。' },
      { t: '把每个客人的事说一遍', check: { s: 'social', dc: 46 },
        ok: { r: '你说了两个小时。\n\n他一边听一边记，记满了三页。\n\n“这些比摊子值钱。”他说。', eff: { money: 15000, wit: 2, mind: 2, flag: 'll_told_all' } },
        no: { r: '说到一半，他说“我大概明白了”。\n\n后来他还是按原来的做法干，客人走了一半。', eff: { money: 12000, mind: -1 } } },
      { t: '不交，自己再干几年', eff: { mind: 2, flag: 'll_kept_stall' }, r: '你把定金还回去。\n\n“再干几年。”你说。\n\n他也没有多劝。' },
    ] });

  E.push({ id: 'll_last_night', age: [40, 90], w: 9, title: '最后一晚',
    text: '这个地方明天就要交回去。\n\n今天照常开门，照常收摊。\n\n来的客人不知道这是最后一天。',
    choices: [
      { t: '不说，照常做', eff: { mind: 2, flag: 'll_normal_last' }, r: '最后一位客人吃完，说了句“明天见”。\n\n你说“慢走”。\n\n门关上的时候，你没有回头。' },
      { t: '告诉每一个来的人', eff: { social: 2, mind: -1, flag: 'll_told_all_guest' }, r: '有几个人愣住了，说要留个联系方式。\n\n写在纸上的字，后来你一张都没有拿出来过。' },
      { t: '把最后一份做得多一点', check: { s: 'skill', dc: 46 },
        ok: { r: '那份东西比平时大一圈。\n\n客人吃完说“今天怎么这么多”。\n\n你说“剩下的”。', eff: { skill: 1, mind: 2, flag: 'll_last_extra' } },
        no: { r: '你手有点抖。\n\n客人没有说什么，吃完了，付了钱。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'll_borrowed_light', age: [18, 85], w: 8, title: '借光',
    text: '你收摊的时候，隔壁还开着。\n\n他们的灯照到你这半边来。\n\n你借这个光收拾东西。',
    choices: [
      { t: '过去说声谢谢', eff: { social: 1, mind: 1, flag: 'll_thanked_light' }, r: '“顺手的事。”他说。\n\n后来他也开始晚收半小时。\n\n两个人都没有提为什么。' },
      { t: '收完就走', eff: { mind: -1 }, r: '你把东西收好，走出那片光。\n\n回头看，那盏灯还亮着。' },
      { t: '下次也把灯留给他们', eff: { money: -300, social: 2, flag: 'll_left_light' }, r: '第二天你多留了半小时的灯。\n\n他收摊的时候，往你这边看了一眼。' },
    ] });

  E.push({ id: 'll_dawn_shift', age: [18, 90], w: 8, title: '天快亮的时候',
    text: '收摊收得太晚，天已经有点亮了。\n\n扫街的人开始干活。\n\n你们互相看了一眼，谁也没有让路。',
    choices: [
      { t: '把自家门口的扫了', eff: { body: -1, social: 1, flag: 'll_swept_own' }, r: '你扫到一半，他把扫帚伸过来帮着扫。\n\n扫完他说“明天别这么晚”。' },
      { t: '让开，走人', eff: { mind: 1 }, r: '你从扫帚边上过去。\n\n身后是扫帚刮地的声音，一下一下。' },
    ] });

  E.push({ id: 'll_forgot_thing', age: [18, 85], w: 8, title: '落下的东西',
    text: '客人落下一把伞，或者一只手套。\n\n放在柜台后面等了两天。\n\n第三天这里要清一次。',
    choices: [
      { t: '再多放几天', eff: { mind: 1, flag: 'll_kept_lost' }, r: '你把它挂在门后。\n\n后来挂了三样，都是没人来拿的。' },
      { t: '扔了', eff: { mind: -1 }, r: '你把它放进垃圾桶。\n\n扔进去之前犹豫了一下，还是扔了。' },
      { t: '自己用', eff: { wit: 1, flag: 'll_used_lost' }, r: '伞还能用，手套太小。\n\n伞你用了一个雨季，后来不知丢在哪儿了。' },
    ] });

  E.push({ id: 'll_closed_sign', age: [18, 85], w: 8, title: '挂上牌子',
    text: '门上有一块牌，一面写“营业”，一面写“休息”。\n\n挂了几年，正面比背面脏。\n\n今天你要把它翻过来。',
    choices: [
      { t: '翻过来，挂正', eff: { mind: 1, flag: 'll_flipped_sign' }, r: '你把牌子翻过来，正了正。\n\n退开两步看，那个字有点歪。\n\n你没有再动它。' },
      { t: '摘下来收好', eff: { mind: -1, wit: 1, flag: 'll_took_sign' }, r: '牌子拿在手里，比想象中重。\n\n门上剩下两个钉眼。' },
    ] });

  E.push({ id: 'll_night_road', age: [20, 90], w: 8, title: '回家的路',
    text: '回家的路上有一段没有灯。\n\n走了很多年，闭着眼也知道哪儿有个坑。\n\n今天那个坑被填上了。',
    choices: [
      { t: '踩一踩新填的地方', eff: { wit: 1, mind: 2, flag: 'll_tested_road' }, r: '填得很实。\n\n你踩了两下，站住，又踩了一下。\n\n不知道是谁填的。' },
      { t: '照旧绕过去', eff: { mind: 1 }, r: '你走到那儿，习惯性地往左让了半步。\n\n让完才发现坑已经没了。' },
    ] });

  E.push({ id: 'll_last_order', age: [20, 85], w: 8, title: '最后一份',
    text: '还剩一份材料，做不出第二份了。\n\n来的客人要了两份。\n\n你说只剩一份。',
    choices: [
      { t: '给他一份，钱按两份收', eff: { money: 600, mind: -1, flag: 'll_charged_two' }, r: '他付了，没有看价钱。\n\n吃完他说“下次还来”。' },
      { t: '把剩下的都给他', check: { s: 'skill', dc: 42 },
        ok: { r: '你把边角料也用上了，凑出了两份的一半。\n\n他看了一眼，说“这算什么”。\n\n你说“剩下的”。', eff: { money: 500, skill: 2, flag: 'll_stretched' } },
        no: { r: '凑不出来，最后还是只有一份。\n\n他把那一份留给同伴吃。', eff: { money: 300, mind: -1 } } },
      { t: '说今天卖完了', eff: { mind: 1 }, r: '他走了。\n\n你把最后一份自己吃了，吃得很慢。' },
    ] });

  E.push({ id: 'll_empty_till', age: [24, 90], w: 8, title: '钱箱空了',
    text: '钱箱里一分钱都没有。\n\n今天没有人来。\n\n你照常开门，照常收摊。',
    choices: [
      { t: '明天照常开', eff: { mind: 1, flag: 'll_open_tomorrow' }, r: '第二天来了三个人。\n\n第三个买走的东西，够交三天的租金。' },
      { t: '想一想还要不要开', eff: { mind: -1, flag: 'll_doubted' }, r: '你在关着灯的店里坐了很久。\n\n后来你把椅子翻下来，一个人坐了一会儿。' },
    ] });

  C.addEvents('lastlight', E);
})();
