/* 第二遍（批次 34）：同一处地方、同一件事，二十年后再来一次。
 * 每对的第一版在青年/中年，写下旗标；第二版在更晚的年纪才出现，读到旗标就换成另一段文本。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  // 成对：early 置旗，late 依据旗标改写。
  const pair = (key, early, late, lateIfOther) => {
    E.push({ id: 'sp_' + key + '_1', age: early.age || [18, 32], req: early.req || {}, w: 11, title: early.title,
      text: early.text, choices: early.choices, ...(early.eff ? { eff: early.eff } : {}) });
    // 第二版必须真的经历过第一版：否则文本里那件外套、那张纸就没有来处。
    E.push({ id: 'sp_' + key + '_2', age: late.age || [42, 85], req: { ...(late.req || {}), flag: 'sp_' + key + '_seen' }, w: 11, title: late.title,
      text: late.text, choices: late.choices });
  };

  // 1. 巷口那家面摊
  pair('stall', {
    age: [18, 30], title: '面摊的价钱',
    text: '面摊墙上没有价目表。\n\n老板说多少就是多少，你从来不问。\n\n今天他多收了你两百眼，说明天要涨。',
    choices: [
      { t: '照给', eff: { money: -200, flag: 'sp_stall_seen', mind: 1 }, r: '你多给了两百。\n\n他收了，多抓了一把葱放进碗里。' },
      { t: '问为什么涨', check: { s: 'social', dc: 38 },
        ok: { r: '他说面粉涨了。\n\n“你要是不信，明天自己去看看。”', eff: { money: -200, flag: 'sp_stall_seen', wit: 1 } },
        no: { r: '他把手在围裙上擦了擦，说“不吃可以走”。\n\n你还是吃了。', eff: { money: -200, flag: 'sp_stall_seen', mind: -1 } } },
    ],
  }, {
    age: [45, 85], title: '同一张桌子',
    text: '你路过以前常去的那家面摊。\n\n摊子还在，桌子换了，墙上多了一张打印的价目表。\n\n价钱是你记忆里的十一倍。',
    choices: [
      { t: '坐下来吃一碗', eff: { money: -2200, mind: 2, flag: 'sp_stall_returned' }, r: '味道不像了，也可能是你记错。\n\n吃完你把碗端回去，老板说了声谢谢。' },
      { t: '站着看完价目表就走', eff: { mind: -1 }, r: '你把每一行都看了。\n\n最下面那一行写着“另加葱不收钱”。' },
    ],
  });

  // 2. 修东西的人
  pair('repair', {
    age: [18, 30], title: '第一次修',
    text: '你把坏掉的东西拿去修。\n\n修的人说你其实自己能修，只是没试过。\n\n“错了也不要紧，反正它本来就坏了。”',
    choices: [
      { t: '自己动手', eff: { wit: 2, flag: 'sp_repair_seen', skill: 1 }, r: '你弄了一个下午。\n\n最后它能用了，但多出一个零件。\n\n你把它收进抽屉。' },
      { t: '让他修', eff: { money: -1200, flag: 'sp_repair_seen' }, r: '他修得很快，快到你没看清。\n\n“看明白了没有。”他问。\n\n你说没有。' },
    ],
  }, {
    age: [46, 88], title: '多出来的那个零件',
    text: '抽屉里那个零件还在。\n\n你现在知道它是哪儿的了。\n\n当年那件东西，你后来又用了十几年。',
    choices: [
      { t: '把它装回去', check: { s: 'skill', dc: 46 },
        ok: { r: '装进去之后，那件东西声音变了。\n\n变轻了，像少了一点负担。', eff: { skill: 2, mind: 2, flag: 'sp_repair_fixed' } },
        no: { r: '装不进去。\n\n你把零件放回抽屉，位置没变。', eff: { mind: -1 } } },
      { t: '留着', eff: { mind: 1 }, r: '你把抽屉关上。\n\n它在那里待了二十多年，不差这几年。' },
    ],
  });

  // 3. 楼道里的灯
  pair('lamp', {
    age: [18, 34], title: '楼道的灯',
    text: '楼道的灯又坏了。\n\n这已经是今年第三次。\n\n有人说归物业，有人说归住户自己。',
    choices: [
      { t: '自己换一个', eff: { money: -500, social: 1, flag: 'sp_lamp_seen' }, r: '你踩着椅子换完，楼道亮起来。\n\n有人上楼时说了声谢谢，没有问是谁换的。' },
      { t: '去找物业', eff: { body: -1, flag: 'sp_lamp_seen', wit: 1 }, r: '物业登记了，说“三天内”。\n\n三天后灯还是坏的。\n\n第二十天，灯自己亮了。' },
    ],
  }, {
    age: [48, 90], title: '这盏灯',
    text: '楼道的灯还是那一盏。\n\n灯罩换过，灯泡换过，电线整条换过一次。\n\n只有换灯的那个人一直没换。',
    choices: [
      { t: '再换一次', eff: { money: -800, body: -1, mind: 1, flag: 'sp_lamp_again' }, r: '你上椅子的时候扶了两次墙。\n\n灯亮起来，楼道里空着。' },
      { t: '这次让别人来', eff: { social: 1, flag: 'sp_lamp_asked' }, r: '你在楼下说了这件事。\n\n第二天灯亮了。\n\n你不知道是谁换的。' },
    ],
  });

  // 4. 借钱的人
  pair('borrow', {
    age: [18, 34], title: '第一次有人向你借钱',
    text: '来借钱的人比你大几岁，说话很客气。\n\n数目是你大半个月的工钱。\n\n他说“你要是不方便就当我没说”。',
    choices: [
      { t: '借', eff: { money: -6000, flag: 'sp_borrow_seen', mind: -1 }, r: '他数了三遍，谢了两遍。\n\n走的时候在门口回了一下头。' },
      { t: '不借', eff: { mind: -1, flag: 'sp_borrow_seen' }, r: '他说“没事”，笑了一下。\n\n之后见面还是会点头，只是点得比以前快。' },
    ],
  }, {
    age: [44, 85], title: '又有人来借',
    text: '来的人比你孩子还小。\n\n他说得很快，像是背过。\n\n数目比当年那笔多，也比当年的钱不值钱。',
    choices: [
      { t: '借', eff: { money: -15000, mind: 1, flag: 'sp_borrow_lent_again' }, r: '你数钱的时候，想起当年那个人数了三遍。\n\n这个人数得很快。' },
      { t: '借一半', eff: { money: -8000, wit: 1, flag: 'sp_borrow_half' }, r: '“一半也行。”他说。\n\n这句话你听过一次，是别人说的。' },
      { t: '不借，给他指一条路', check: { s: 'social', dc: 44 },
        ok: { r: '你说了一个地方，那里招人。\n\n他记了下来，问要押金吗。\n\n你说要。他就不去了。', eff: { wit: 2, flag: 'sp_borrow_gave_advice' } },
        no: { r: '他听完说“谢谢”，转身就走。\n\n你知道他不会去。', eff: { mind: -1 } } },
    ],
  });

  // 5. 一件外套
  pair('coat', {
    age: [18, 33], title: '买的第一件外套',
    text: '你买了第一件自己挑的外套。\n\n不是最便宜的，也不是最好的。\n\n试的时候，店员说“这件很衬你”。',
    choices: [
      { t: '买下', eff: { money: -6000, mind: 2, flag: 'sp_coat_seen' }, r: '你穿着它走出店门，把标签撕下来塞进口袋。\n\n那天不算冷。' },
      { t: '买更便宜的那件', eff: { money: -3000, wit: 1, flag: 'sp_coat_seen' }, r: '便宜那件袖子短一点。\n\n你穿着它过了三个冬天。' },
    ],
  }, {
    age: [46, 90], title: '袖子',
    text: '年轻时挑的外套已经穿不下了。两回补过的袖口，一深一浅。\n\n你试着套上，胳膊还没伸直，肩头先绷出了线响。',
    choices: [
      { t: '拿出来穿一次', eff: { mind: 2, flag: 'sp_coat_wore_again' }, r: '袖子短了。\n\n你把袖口往里卷了一圈，出门走了一圈，就回来了。' },
      { t: '送给收旧衣服的', eff: { mind: -1, flag: 'sp_coat_given' }, r: '收的人看了一眼，说这个还能穿。\n\n他把它上面的灰拍了两下。' },
    ],
  });

  // 6. 一条近路
  pair('shortcut', {
    age: [18, 32], title: '一条近路',
    text: '有人带你走了一条近路，穿过两栋楼之间。\n\n他说这条路不要跟别人讲。\n\n路口有一块砖是松的，踩上去会响。',
    choices: [
      { t: '记住这条路', eff: { body: 1, flag: 'sp_shortcut_seen', wit: 1 }, r: '你后来走了很多次。\n\n每次踩到那块砖，你都会跳过去。' },
      { t: '还是走大路', eff: { flag: 'sp_shortcut_seen' }, r: '你没有再走那条。\n\n过了几年，那两栋楼之间砌了墙。' },
    ],
  }, {
    age: [44, 88], title: '那两栋楼之间',
    text: '当年那条近路封了一半，墙上写着要拆。你踩到熟悉的松砖，还是同一声空响。\n\n墙后的推车停了，拉车的人问外头是谁。',
    choices: [
      { t: '踩上去试试', eff: { body: -1, mind: 2, flag: 'sp_stepped_brick' }, r: '砖响了。\n\n声音和二十多年前一样。\n\n你站在墙边笑了很久。' },
      { t: '绕过去', eff: { mind: -1 }, r: '你走过大路。\n\n大路上人多，灯亮，走得比近路慢十分钟。' },
    ],
  });

  // 7. 一个名字
  pair('name', {
    age: [18, 34], title: '记住一个名字',
    text: '有人帮过你一次，走之前报了名字。\n\n你没有记下来。\n\n后来想找他的时候，只记得他穿什么颜色的外套。',
    choices: [
      { t: '到处打听', eff: { body: -1, flag: 'sp_name_seen', wit: 1 }, r: '你问了很多人。\n\n有人说认识一个差不多的人，说得不太确定。' },
      { t: '算了', eff: { flag: 'sp_name_seen', mind: -1 }, r: '你慢慢就不找了。\n\n那件外套的颜色也记混了。' },
    ],
  }, {
    age: [46, 90], title: '他说了一个名字',
    text: '街上有人叫住你，说当年你帮过他。\n\n他说了自己的名字。\n\n这个名字你没有印象，但外套的颜色你记得。',
    choices: [
      { t: '说我也帮过别人，可能记错了', eff: { mind: 1, social: 1, flag: 'sp_name_honest' }, r: '他笑了，说“那就是别人”。\n\n他还是请你喝了一杯水。' },
      { t: '说记得', eff: { wit: 1, mind: 2, flag: 'sp_name_pretended' }, r: '他讲了很多当年的事。\n\n你一边听一边点头，把那些事安在你记得的那个人身上。' },
    ],
  });

  // 8. 一场雨
  pair('rain', {
    age: [18, 34], title: '那场雨',
    text: '雨来得很快，你没有地方躲，就站在一个卷闸下面。\n\n旁边还站着一个人，也淋湿了。\n\n你们谁也没说话，雨停了就各走各的。',
    choices: [
      { t: '开口说一句', check: { s: 'social', dc: 38 },
        ok: { r: '你们说了几句，说的是这雨。\n\n雨停了他先走，走的时候点了下头。', eff: { social: 1, flag: 'sp_rain_seen' } },
        no: { r: '你刚开口，他往旁边挪了半步。\n\n你把话咽回去了。', eff: { mind: -1, flag: 'sp_rain_seen' } } },
      { t: '什么也不说', eff: { flag: 'sp_rain_seen', mind: 1 }, r: '雨下了二十分钟。\n\n他先走的，走的时候把卷闸的铁钩挂好了。' },
    ],
  }, {
    age: [44, 88], title: '又是一个卷闸',
    text: '你又在那道卷闸下躲雨，门漆换了颜色。旁边的人往里挤，你往外让，肩头很快湿透。\n\n当年这里够站两个人，如今多装了一台排风机。',
    choices: [
      { t: '把伞给他', eff: { mind: 2, flag: 'sp_gave_umbrella' }, r: '他愣了一下，说不用。\n\n你把伞塞过去就走了。\n\n走到街口才发现自己淋着。' },
      { t: '什么也不说', eff: { mind: -1, flag: 'sp_rain_again' }, r: '雨下了二十分钟。\n\n你先走的，走的时候把卷闸的铁钩挂好了。' },
    ],
  });

  // 9. 排队
  pair('queue', {
    age: [18, 34], title: '排到最后',
    text: '你来晚了，队已经排到门外。\n\n前面的人回头看了你一眼，往旁边让了半个位置。\n\n“今天应该能排到。”他说。',
    choices: [
      { t: '道谢', eff: { social: 1, flag: 'sp_queue_seen' }, r: '他摆摆手，说“都是这么排的”。\n\n最后你们都没排到。' },
      { t: '问他要等多久', eff: { wit: 1, flag: 'sp_queue_seen' }, r: '他算了算，给了一个数。\n\n那个数不准。但你心里有了底。' },
    ],
  }, {
    age: [44, 88], title: '又排到最后',
    text: '队又排到了门外。年轻人给你让出半个位置，接着踮脚看窗口。\n\n等叫到你，他比你先应了一声，随即红着脸退开。',
    choices: [
      { t: '接下来', eff: { mind: 1, social: 1, flag: 'sp_queue_took' }, r: '你站进那半个位置。\n\n二十分钟后，你把位置又让给了一个更后面的人。' },
      { t: '说不用，我站后面', eff: { mind: 2, flag: 'sp_queue_declined' }, r: '他愣了一下，说“那也行”。\n\n你站到队尾，队尾比你记得的长。' },
    ],
  });

  // 10. 一张纸
  pair('paper', {
    age: [18, 34], title: '第一份合同',
    text: '一张纸推到你面前，让你签。\n\n字很小，行距很密。\n\n对方说“都一样的，随便看看就行”。',
    choices: [
      { t: '从头看到尾', eff: { wit: 2, flag: 'sp_paper_seen', mind: -1 }, r: '你看了很久，看到对方开始看表。\n\n有两条你没有看懂，但你看到了。' },
      { t: '直接签', eff: { flag: 'sp_paper_seen' }, r: '你签得很快。\n\n他收起来的时候说“爽快”。' },
    ],
  }, {
    age: [44, 88], title: '又是一张纸',
    text: '合同还是密密的小字，对方仍说“都一样，随便看”。\n\n你戴上眼镜，顺着行找。当年没有的那笔费用，就加在第二页。',
    choices: [
      { t: '从头看到尾，还问', check: { s: 'wit', dc: 46 },
        ok: { r: '你问了两处，对方改了一处。\n\n改的那一处，正好是你当年吃过亏的那一条。', eff: { money: 8000, wit: 2, flag: 'sp_paper_caught' } },
        no: { r: '你问了，对方说“都是标准文本”。\n\n你签了。\n\n回家路上你想起这句话，觉得在哪儿听过。', eff: { mind: -2, flag: 'sp_paper_again' } } },
      { t: '直接签', eff: { mind: -1, flag: 'sp_paper_signed_again' }, r: '你签得很快。\n\n快到你想起当年那个人。' },
    ],
  });

  // 10 条单独的日常（补池）
  const amb = (id, text, eff, age) => E.push({ id: 'sp_' + id, age: age || [20, 95], req: {}, w: 10, repeat: true, cd: 14, text, ...(eff ? { eff } : {}) });
  amb('kettle', '水壶盖一开锅就跳，客人伸手想按住。\n\n你拿勺柄把盖子拨偏一点，壶安静了，蒸汽直冲他刚坐的位置。');
  amb('cracked_mug', '杯子遇热就从裂纹渗水，你只用它盛冷的。\n\n有人想倒热茶，你赶紧换杯。桌上仍留下一个冷水圈。');
  amb('door_gap', '门底的缝正对床脚，走廊灯一灭，屋里立刻黑下来。\n\n你摸到鞋边，外头又有人按亮开关，一串脚步停在隔壁。');
  amb('shelf_leg', '书架短腿下的纸垫又潮了。你抽出来，露出一层层不同时年的字。\n\n换上木楔，架子稳了，最上面的空罐却滚了下来。', undefined, [20, 90]);
  amb('same_boots', '同一双靴子穿了四年。\n\n底换过两次，鞋面还是那块。\n\n你认出它是因为左脚外侧有一道旧划痕。');
  amb('phone_booth', '电话亭玻璃上写着一个号码，旁边添了“修好了”。\n\n你拿起听筒，先听见电流声，随后里面传来一句：“别拍机子。”');
  amb('frozen_lock', '锁冻住了，钥匙拧不动。\n\n你对着锁孔呵了几口气，拧开了。\n\n手已经冻得没感觉。', { body: -1 }, [20, 90]);
  amb('two_chairs', '小桌两边的椅子，一把坐人，一把堆东西。客人来了，你抱起那堆衣服。\n\n椅面上落着一圈灰，得先擦过才能坐。');
  amb('old_ticket_stub', '抽屉里的票根排不到一起，有几次出门中间隔了好几年。\n\n最旧那张褪了色，背面还能认出你当时算的车费。');
  amb('light_bulb', '拖了很久的灯泡彻底灭了。你搬椅子换好，亮光一下照出墙上的油手印。\n\n椅子没搬回去，又去取抹布。');

  C.addEvents('secondpass', E);
})();
