/* 六段个人经历：不同的童年入口，选择留下的关系延续到成年和中年。
 * 所有转行、搬家和花钱都由玩家决定；生死仍沿用原有风险。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const threads = [
    { id: 'tools', intro: '住处附近有个修东西的人，干活时不许人替他数零件。', mods: ['backstreet', 'fixer2', 'minor'], w: { nest: 8, backstreet: 16, outskirts: 14 } },
    { id: 'neighbor', intro: '你住的地方共用一个水龙头，谁家欠了水钱，大家都知道。', mods: ['love', 'backstreet', 'late'], w: { nest: 10, backstreet: 16, outskirts: 12 } },
    { id: 'study', intro: '楼里有人在傍晚教认字，用粉笔写完一面墙，再擦掉。', mods: ['wing', 'child2', 'world'], w: { nest: 18, backstreet: 12, outskirts: 6 } },
    { id: 'road', intro: '这里常有运货的人停脚。你先记住了口音，后来才知道地名。', mods: ['outskirts', 'limbus', 'world'], w: { nest: 8, backstreet: 12, outskirts: 20 } },
    { id: 'debt', intro: '附近的当铺隔几天就换一批东西，只有秤上的砝码从来不换。', mods: ['syndicate', 'backstreet', 'fixer'], w: { nest: 8, backstreet: 16, outskirts: 8 } },
    { id: 'voices', intro: '你睡觉的地方靠着一根旧管道，夜深时能听见另一头的人说话。', mods: ['strange', 'beyond', 'world'], w: { nest: 12, backstreet: 12, outskirts: 10 } },
  ];
  C.initLifeThread = function (S) {
    const t = C.varietyPick(S, threads, (x) => x.w[S.loc], 'thread', (x) => x.id);
    S.life = { id: t.id, intro: t.intro, mods: t.mods.slice(), firstAge: S.rng.int(6, 10), recentMods: [] };
    const coin = S.rng.chance(0.5) ? 'm' : 'f';
    S.vars.lf_name = C.randName(S.rng, S.rulesVersion >= 7 ? 'm' : coin); // 个人经历的正文都用“他”
  };
  C.lifeSummary = function (S) {
    if (S.vars.lifeLegacy) return S.vars.lifeLegacy;
    const f = S.flags, name = S.vars.lf_name;
    if (f.lf_bench) return '你接手过街角的那张旧工作台。';
    if (f.lf_mark) return '有一盏灯的底下，刻着你的名字。';
    if (f.lf_hands || f.lf_sales) return '你小时候，替' + name + '修好过一台风扇。';
    if (f.lf_kept_house) return '你出钱修过共用的炉子和门闩。';
    if (f.lf_moved_together) return '你和旧邻居换过一个共同的住址。';
    if (f.lf_doors) return '起烟的夜里，你和' + name + '叫醒过楼里的人。';
    if (f.lf_shared_water) return '你和' + name + '曾轮流提过水。';
    if (f.lf_shared_book) return '你和' + name + '轮流读完过一本缺页的书。';
    if (f.lf_work_first) return '该读书的那些夜晚，你先去挣了工钱。';
    if (f.lf_study_pair) return '那面墙上，有你和' + name + '一起补过的字。';
    if (f.lf_new_address) return '你买过一张单程的位置，在别处重新住下。';
    if (f.lf_local_contact) return '运输线停了以后，仍有人找你打听零活。';
    if (f.lf_return_time) return '你坐过一次货车，赶在天黑前回来了。';
    if (f.lf_loan) return '你曾借给' + name + '三万眼，替对方赎回工具。';
    if (f.lf_deposit) return '你用一笔工作订金，替旧人解过围。';
    if (f.lf_trusted) return '你替' + name + '送到过一笔赎金。';
    if (f.lf_original) return '你留下过一盘有空白处的旧录音。';
    if (f.lf_device) return '你拆出过墙内的传声装置，后来又装了回去。';
    if (f.lf_listener || f.lf_pipe_route) return '你小时候，和' + name + '一起听过墙后的声音。';
    return '';
  };
  const human = { nojob: ['distorted', 'book'] };
  const first = (thread) => ({ ...human, fn: (S) => S.rulesVersion >= 2 && S.life && S.life.id === thread && S.age >= S.life.firstAge });
  const follow = (id, years, extra = {}) => ({ queue: [id, years], ...extra });
  const end = (text, extra = {}) => ({ ...extra, set: { ...(extra.set || {}), lifeLegacy: text } });
  const move = (S) => {
    let d; do { d = S.rng.int(1, 25); } while (d === S.d);
    S.loc = 'backstreet'; S.d = d; S.home = d + '区后巷'; S.wing = '';
  };

  C.addEvents('lifelines', [
    { id: 'lf_tools_child', force: true, age: [6, 11], req: first('tools'), title: '拆开的风扇',
      text: '修理摊的{lf_name}把一台风扇拆得满地都是，让你别踩丢垫圈。\n\n有人来催，说今晚之前修不好，就把整个摊子拖走。你看见桌腿下面卡着一枚一样的垫圈。', choices: [
        { t: '蹲下帮忙找齐零件', r: '你们在天黑前装好了风扇。他让你记住装配的顺序，下次还可以来帮忙。', eff: follow('lf_tools_youth', 7, { skill: 2, flag: 'lf_hands' }) },
        { t: '去把催债的人支开', r: '你带那人绕了半条街，回来的时候风扇已经转起来。他给了你一枚硬币，说你很适合做生意。', eff: follow('lf_tools_youth', 8, { social: 2, flag: 'lf_sales' }) },
        { t: '把垫圈指出来就走', r: '他应了一声。你在路口听见扇叶开始刮擦护网，没再回头。', eff: { wit: 1 } },
      ] },
    { id: 'lf_tools_youth', manual: true, req: human, title: '第一件修好的东西',
      text: '{lf_name}把一盏旧台灯交给你，说接点又松了。这次他没有指给你看。\n\n他已经开始把一部分客人交给你接待，自己坐在后面揉手腕。', choices: [
        { t: '试着修好再交还', check: { s: ['wit', 'skill'], dc: 36 }, ok: { r: '灯亮了。他让你把名字刻在灯座下面，修坏了也得认。', eff: follow('lf_tools_adult', 10, { skill: 3, flag: 'lf_mark' }) }, no: { r: '灯泡闪了一下就灭了。他没有收你的学费，只让你把烧坏的线一段段剪下来留着。', eff: follow('lf_tools_adult', 12, { wit: 2 }) } },
        { t: '帮他谈妥一批维修单', req: { flag: 'lf_sales' }, r: '你先谈清零件由谁提供，再谈价钱。他说早该让你来接电话。', eff: follow('lf_tools_adult', 9, { social: 3, money: 3000 }) },
        { t: '告诉他自己另有打算', r: '他把灯收回去，说别忘了拔掉插头。此后你们很少再见。', eff: end('你学会修的第一盏灯，没有带走。', { mind: 1 }) },
      ] },
    { id: 'lf_tools_adult', manual: true, req: human, title: '空出来的工作台',
      text: '{lf_name}准备关掉修理摊，问你要不要接手那张工作台。\n\n抽屉里工具齐全，只缺一个抽屉把手。接手得付五万眼，也得自己处理今后的客人。', choices: [
        { t: '接手，靠维修谋生', req: { money: [50000, null], nojob: ['finger', 'wing', 'heishou', 'kurokumo', 'blade', 'syndicate'] }, r: '你付清价钱，把自己的工具摆上去。第一天开门，客人指着没把手的抽屉，问你到底会不会修。', eff: follow('lf_tools_late', 14, { money: -50000, job: { id: 'mech', org: '街角修理摊', rank: 1 }, flag: 'lf_bench' }) },
        { t: '只买下用惯的那把钳子', req: { money: [2000, null] }, r: '钳口已经磨平了一点。他把价钱收进衣袋，摊位第二天就被搬空了。', eff: follow('lf_tools_late', 16, { money: -2000, skill: 2, flag: 'lf_pliers' }) },
        { t: '帮他搬完最后一趟', r: '你们抬着工作台走过街口。他几次想说些什么，最后只说慢一点，这边台阶高。', eff: follow('lf_tools_late', 15, { body: -1, social: 2 }) },
      ] },
    { id: 'lf_tools_late', manual: true, req: human, title: '又一枚垫圈', star: true,
      text: '一个孩子蹲在你脚边找垫圈，满手黑油。旁边那台拆开的风扇很旧了，你仍然记得它的装配顺序。\n\n孩子问你，这种东西修好了还能值多少钱。', choices: [
        { t: '让孩子从装配顺序学起', r: '你先让孩子洗净手，把零件依次摆在布上。风扇转起来的时候，你们都没有急着说话。', eff: end('后来有人从你这里学会了装回一台风扇。', { mind: 4, social: 2 }) },
        { t: '谈好价钱再动手', r: '你把零件费和工钱分开报，孩子认真听完，说还差一点钱，明天再来。你把风扇留在桌角。', eff: end('你报出的维修价里，零件和工钱一直分开算。', { money: 5000, wit: 2 }) },
      ] },

    { id: 'lf_neighbor_child', force: true, age: [6, 11], req: first('neighbor'), title: '没拧紧的水龙头',
      text: '你和邻家的{lf_name}轮流提水。水龙头总也拧不紧，负责收钱的人却把漏掉的水一并记了账。\n\n对方让你帮忙举着桶，自己踩上砖头够那只阀门。', choices: [
        { t: '扶稳砖头，轮流来', r: '水终于不漏了。你们把湿透的鞋并排放在门外，第二天仍旧没干。', eff: follow('lf_neighbor_youth', 7, { social: 2, flag: 'lf_shared_water' }) },
        { t: '叫来收钱的人一起修', r: '对方不肯踩砖头，你们就站在旁边不走。阀门换好时，他给你们看了很久的坏脸色。', eff: follow('lf_neighbor_youth', 8, { wit: 2, flag: 'lf_water_bill' }) },
        { t: '提够自己的水就走', r: '桶很沉，你没有回头。走廊里的滴水声又响了一个冬天。', eff: { body: 1 } },
      ] },
    { id: 'lf_neighbor_youth', manual: true, req: human, title: '楼道里的烟',
      text: '夜里有人烧坏了共用炉子，烟从门缝灌进来。\n\n{lf_name}敲你的门，说要挨户叫人起来，可几户人家早已搬走，你们并不知道换了谁住。', choices: [
        { t: '一户一户敲到有人回应', r: '你们敲开了几扇门，也挨了几声骂。最后有人抬来水，有人把炉子拖到了室外。', eff: follow('lf_neighbor_adult', 10, { body: -2, social: 3, flag: 'lf_doors' }) },
        { t: '先带对方从安全出口走', r: '你们在外面等到烟散。第二天，新搬来的一家问昨晚怎么没人告诉他们，你低头擦了擦鞋。', eff: follow('lf_neighbor_adult', 11, { mind: -2 }) },
      ] },
    { id: 'lf_neighbor_adult', manual: true, req: human, title: '有人搬走，有人留下',
      text: '{lf_name}要搬家了，东西只装了两只袋子。\n\n对方问你要不要一起租别处的房子，或者留下来，把现有的门闩和炉子彻底修好。两笔钱都不便宜。', choices: [
        { t: '凑钱修好这里', req: { money: [20000, null] }, r: '你找人重新接好炉管，替门闩加了一道铁片。邻居们把欠你的钱分别写在灶台边，擦了又补。', eff: follow('lf_neighbor_late', 15, { money: -20000, social: 4, flag: 'lf_kept_house' }) },
        { t: '付押金，换一个住处', req: { money: [30000, null] }, r: '你把名字写在新的租单上。搬过去才发现水龙头在走廊另一端，还得轮流提水。', eff: follow('lf_neighbor_late', 14, { money: -30000, fn: move, flag: 'lf_moved_together' }) },
        { t: '替对方提袋子到路口', r: '你们没有约好下次见面的日子。回去时，空房门上的旧划痕还在。', eff: follow('lf_neighbor_late', 16, { mind: -1 }) },
      ] },
    { id: 'lf_neighbor_late', manual: true, req: human, title: '轮到你敲门', star: true,
      text: '住处的炉管又开始漏烟。你先看了出口，再看走廊两边那些门。新邻居站在原地，问要不要等负责收钱的人来。', choices: [
        { t: '叫人起来，一起处理', r: '你们从几户人家凑来了工具。天亮以后，有人给你留了一份热饭，没说是哪户送的。', eff: end('漏烟的那一夜，你敲开过走廊里的门。', { social: 3, mind: 3 }) },
        { t: '关掉炉子，留下修理费', req: { money: [8000, null] }, r: '你把钱压在炉子旁，贴了张“别点火”。有人添了一张小钞，也有人拿走了找零。', eff: end('你替住过的地方换过一段炉管。', { money: -8000, mind: 2 }) },
        { t: '带新邻居先撤出去', r: '你没有等到谁下命令。到外面以后，那人才发现自己没穿外衣，回头看了很久。', eff: end('你记得出口在哪里，也带别人走出去过。', { wit: 2 }) },
      ] },

    { id: 'lf_study_child', force: true, age: [6, 11], req: first('study'), title: '半面墙的字',
      text: '教认字的人今天没来。{lf_name}拿着最后一截粉笔，问你记不记得昨天教到哪里。\n\n墙上半个字被水浸掉了，底下刚好有人贴了招工启事。', choices: [
        { t: '一起把缺的字补上', r: '你们拿招工启事对照着写，写错了两个。教字的人回来后没有擦掉，只在旁边写了正确的。', eff: follow('lf_study_youth', 8, { wit: 2, flag: 'lf_study_pair' }) },
        { t: '先学会看懂招工条件', r: '年龄、识字、担保人。你一个字一个字问清楚，回去时已经能读懂最下面那行小字。', eff: follow('lf_study_youth', 7, { wit: 1, social: 1 }) },
        { t: '把粉笔收好，等老师回来', r: '等了很久。墙上的字还没补齐，来贴新广告的人已经到了。', eff: { mind: 1 } },
      ] },
    { id: 'lf_study_youth', manual: true, req: human, title: '轮流读一章',
      text: '{lf_name}借来一本旧教材。书缺了封面，最后十几页被人撕去包东西了。\n\n对方说白天要干活，只能夜里读，问你愿不愿意轮流保管。', choices: [
        { t: '轮流读，互相讲一遍', r: '你们把看不懂的地方记在纸边，争论了几个夜晚。书交还时，纸边已经写满了。', eff: follow('lf_study_adult', 9, { wit: 4, social: 1, flag: 'lf_shared_book' }) },
        { t: '付钱复印一份自己读', req: { money: [4000, null] }, r: '复印店按页收费，缺的页也算在内。你第一次为了少付一点钱，重新数了一整本书。', eff: follow('lf_study_adult', 10, { money: -4000, wit: 5 }) },
        { t: '现在还是挣钱要紧', r: '对方点点头，把书裹进衣服里。那天以后，你们谈起的更多是工钱。', eff: follow('lf_study_adult', 12, { money: 3000, flag: 'lf_work_first' }) },
      ] },
    { id: 'lf_study_adult', manual: true, req: human, title: '考场外的人',
      text: '你又见到了{lf_name}。对方在招考大厅外替人核对材料，桌上放着那本缺页的教材。\n\n有人因为少一个签名被请出队伍，笔却一直攥在手里。', choices: [
        { t: '把自己的材料也递进去', req: { age: [18, 48], nojob: ['wing', 'retired', 'distorted', 'book', 'finger'], noflag: ['wg_exam_wait', 'wg_offer'] }, r: '对方替你查了一遍，最后把笔交还给你。进不进去，这次要由你自己决定。', eff: follow('lf_study_late', 16, { next: 'wg_exam', flag: 'lf_took_exam' }) },
        { t: '帮被赶出来的人补材料', r: '你们站在大厅外填写了半天。那人没有再被请出来，但你也不知道后来有没有考上。', eff: follow('lf_study_late', 14, { social: 3, wit: 1 }) },
        { t: '请老同学吃顿饭', r: '对方把教材收好，说已经很久没有完整吃过一顿午饭。你们没有谈分数。', eff: follow('lf_study_late', 15, { money: -2000, mind: 3 }) },
      ] },
    { id: 'lf_study_late', manual: true, req: human, title: '这次你来讲', star: true,
      text: '有人请你教几个孩子识字，只借到一面能写字的墙。\n\n你握住粉笔的时候，突然想起教材最后那些不见了的页。孩子们等着你写第一个字。', choices: [
        { t: '先教姓名，再教招工启事', r: '有人写得很慢。你把自己的名字留在旁边，让他们照着辨认笔画，擦墙时最后才擦掉。', eff: end('有几个孩子，曾照着你的字学写自己的名字。', { mind: 4, social: 2 }) },
        { t: '买齐教材，交给合适的人', req: { money: [15000, null] }, r: '这次每本书都从第一页数到最后一页。你付了款，把粉笔也一起留下了。', eff: end('你送出去的那批教材，没有缺页。', { money: -15000, mind: 3 }) },
        { t: '只教他们读清楚合同', r: '你先写“费用”，再写“责任”。有个孩子问能不能学别的，你让他先把这两处圈出来。', eff: end('你教人读合同时，总先指给他们看费用和责任。', { wit: 3 }) },
      ] },

    { id: 'lf_road_child', force: true, age: [6, 11], req: first('road'), title: '停在路口的车',
      text: '运货的{lf_name}在路口换轮胎。\n\n你听出车上几个人的口音都不同，可他们提起同一个地方时，神情却一模一样。\n\n司机问你能不能替他看着地上的螺母。', choices: [
        { t: '帮忙，问问他们从哪来', r: '司机只说那里风很大。车开走前，他给你指了方向，没有说路程。', eff: follow('lf_road_youth', 8, { social: 2, flag: 'lf_asked_road' }) },
        { t: '学着把轮胎装回去', r: '你用了全身的力气才拧动扳手。司机说车轮一松，车上的人就都得倒霉，别学一半。', eff: follow('lf_road_youth', 7, { skill: 2 }) },
        { t: '站远一点看完', r: '车厢从你面前驶过，风里有陌生的食物气味。你没问他们什么时候回来。', eff: { wit: 1 } },
      ] },
    { id: 'lf_road_youth', manual: true, req: human, title: '另一端的口音',
      text: '{lf_name}又来运货，车漆换了，嗓音没变。\n\n这次有半天的零活，帮忙卸货就能到附近另一处住地看看，天黑之前必须跟车回来。', choices: [
        { t: '跟车，把回程时间记牢', r: '你搬了一下午，手指都伸不直。返程时，你已经能分清路边哪些灯是店铺，哪些是警告。', eff: follow('lf_road_adult', 10, { money: 2000, body: -1, wit: 2, flag: 'lf_return_time' }) },
        { t: '只替他们在本地找人手', r: '你找到几个人，先把工钱说清楚。司机等他们全部下车，才把中间人的那份钱给你。', eff: follow('lf_road_adult', 11, { money: 3000, social: 2 }) },
      ] },
    { id: 'lf_road_adult', manual: true, req: human, title: '单程的位置',
      text: '{lf_name}说熟悉的运输线要停了，最后一班车还剩一个位置。\n\n目的地是另一处后巷，车钱加头一个月押金要三万眼。留下也行，那边正缺一个本地联络人。', choices: [
        { t: '买下位置，换个地方生活', req: { money: [30000, null] }, r: '你把行李搬上车。到站后，司机替你指了出租屋的位置，随后去卸最后一批货。', eff: follow('lf_road_late', 15, { money: -30000, fn: move, flag: 'lf_new_address' }) },
        { t: '留下，帮忙联络零活', r: '你把愿意接活的人的名字一个个核实过。运输线停了以后，仍有人来找你问消息。', eff: follow('lf_road_late', 14, { social: 4, money: 5000, flag: 'lf_local_contact' }) },
        { t: '替司机卸完最后一批货', r: '你们把车厢扫净，落地的只剩灰尘。司机没有说再见，只问你往哪边走。', eff: follow('lf_road_late', 16, { body: -1, mind: 2 }) },
      ] },
    { id: 'lf_road_late', manual: true, req: human, title: '问路的人', star: true,
      text: '一个拖着行李的人向你问路，口音和你小时候听过的很像。对方只知道旧地名，街口早已换过几次招牌，最后一班车也快到了。', choices: [
        { t: '送到能接下一程的地方', r: '你们赶在收摊之前到了。对方想给钱，你先问清楚下一班车的时间，才把行李放下。', eff: end('有人初到这里时，是你替他们接上了下一程。', { social: 3, mind: 2 }) },
        { t: '把新地名和费用写清楚', r: '你连临时加价的地方也写了进去。那人读了两遍，把纸折好收进贴身的衣袋。', eff: end('你给过陌生人一条把费用写明的路。', { wit: 2, money: 1000 }) },
      ] },

    { id: 'lf_debt_child', force: true, age: [6, 11], req: first('debt'), title: '秤盘里的积木',
      text: '你在当铺门口捡到一块积木，正想带走，{lf_name}叫住了你。\n\n对方说那是别人的典当物，可整袋积木刚才已经被当铺按重量卖了，只落下这一块。', choices: [
        { t: '一起找来赎东西的人', r: '你们守到傍晚，只等来一个问价的买家。对方留下地址，说以后遇到原主可以带过去。', eff: follow('lf_debt_youth', 8, { social: 2, flag: 'lf_owner' }) },
        { t: '问清当铺到底怎么算价', r: '掌柜先说成色，后来又说重量。你记住同一袋东西拿进来和拿出去，算法并不一样。', eff: follow('lf_debt_youth', 7, { wit: 2, flag: 'lf_prices' }) },
        { t: '放回秤盘就走', r: '掌柜嫌占地方，把积木扫进了抽屉。你听见木头撞在金属上的声音。', eff: { mind: 1 } },
      ] },
    { id: 'lf_debt_youth', manual: true, req: human, title: '替人带一笔钱',
      text: '{lf_name}找你帮忙，把一笔赎金带到当铺。\n\n钱已经凑齐，可限期今天到，对方正被雇主扣着加班。你也有自己的事，跑这一趟要绕很远。', choices: [
        { t: '数清钱，替对方跑一趟', r: '掌柜又添了一项保管费。你记下明细，带着赎回的东西和剩下的零钱，一起交还给对方。', eff: follow('lf_debt_adult', 10, { money: -1000, social: 3, flag: 'lf_trusted' }) },
        { t: '谈好跑腿费再接', r: '对方把你的那份单独放好。事情办完以后，你们当面点清，没有多也没有少。', eff: follow('lf_debt_adult', 9, { money: 2000, flag: 'lf_paid_work' }) },
        { t: '告诉对方自己赶不及', r: '对方没有再求，只把钱重新裹紧。后来东西有没有赎回，你没再问。', eff: follow('lf_debt_adult', 12, { mind: -1 }) },
      ] },
    { id: 'lf_debt_adult', manual: true, req: human, title: '缺的一部分',
      text: '{lf_name}拿着另一张典当单来找你。这次缺三万眼，押着的是吃饭用的工具。\n\n对方说可以写借条，也可以替你做活；你知道两种说法都有落空的可能。', choices: [
        { t: '借出钱，约好分期还', req: { money: [30000, null] }, r: '你们把每期数目写得很小。对方拿回工具时试了两下，才敢放进包里。', eff: follow('lf_debt_late', 14, { money: -30000, flag: 'lf_loan' }) },
        { t: '付一笔实在的工作订金', req: { money: [12000, null] }, r: '你找了一件确实需要做的活，没有把整笔缺口都揽过来。对方看过要求，才收下订金。', eff: follow('lf_debt_late', 13, { money: -12000, skill: 2, flag: 'lf_deposit' }) },
        { t: '陪对方和掌柜谈期限', check: { s: 'social', dc: 45 }, ok: { r: '你们谈到关门前，换来了更长的期限。利息没少，对方至少不用明天就失去工具。', eff: follow('lf_debt_late', 15, { social: 2 }) }, no: { r: '掌柜在单子上又盖了一个章。对方把单子收好，说已经耽误你够久了。', eff: follow('lf_debt_late', 16, { mind: -2 }) } },
      ] },
    { id: 'lf_debt_late', manual: true, req: human, title: '最后一笔怎么算', star: true,
      text: '{lf_name}托人送来一个小包，里面是这些年剩下的钱、工具和几笔一直说不清的旧账。\n\n送件人说，对方搬去别处了，包里的东西由你处理。', choices: [
        { t: '按借条收下能收回的部分', req: { flag: 'lf_loan' }, r: '你把收到的六千眼记进最后一行，没有把其余的数抹掉。那一行一直没有再变。', eff: end('你借出过三万眼，最后收回了六千。', { money: 6000, wit: 2 }) },
        { t: '留工具，把余钱寄还', r: '你替工具找了个能放稳的位置。寄件时，对方的新地址比旧地址长了很多。', eff: end('你收下过旧人的一套工具，没有继续追那笔账。', { skill: 2, mind: 3 }) },
        { t: '卖掉东西，结清跑腿费用', r: '你把收入和支出分开记好，多出来四千眼。账终于对上了，人没有回来。', eff: end('你结清过一笔拖了很多年的旧账。', { money: 4000, mind: -1 }) },
      ] },

    { id: 'lf_voices_child', force: true, age: [6, 11], req: first('voices'), title: '管道另一头',
      text: '靠着旧管道睡觉时，你听见另一头有人背一串数字。\n\n第二天，{lf_name}问是不是你一直在念，扰得人睡不着。你们凑近听了一会儿，声音却停了。', choices: [
        { t: '约好下次一起听', r: '你们轮流守过几个夜晚，只听见水流。有一天临睡前，另一头的人清楚地咳了两声。', eff: follow('lf_voices_youth', 8, { wit: 2, flag: 'lf_listener' }) },
        { t: '顺着管道找接到哪里', r: '管道穿过几道墙，最后埋进封死的地面。你记下了拐弯的位置，没人肯告诉你以前接着什么。', eff: follow('lf_voices_youth', 7, { body: 1, wit: 1, flag: 'lf_pipe_route' }) },
        { t: '挪开床，别再听了', r: '你在枕头下面垫了厚布。后来真的听不清了，也可能是另一头的人搬走了。', eff: { mind: 2 } },
      ] },
    { id: 'lf_voices_youth', manual: true, req: human, title: '录下来的杂音',
      text: '{lf_name}借来一台录音机。\n\n你们把话筒贴在旧管道上，回放时只听见水响和一个数到一半的声音。\n\n数字像门牌，也像欠款，谁都不敢说认得。', choices: [
        { t: '保留原带，另抄一份', r: '你们没有把猜测填进去，空下听不清的地方。多年后拿出来，那些空白仍然在。', eff: follow('lf_voices_adult', 11, { money: -1000, wit: 3, flag: 'lf_original' }) },
        { t: '拆开管道的旧接头', check: { s: 'skill', dc: 36 }, ok: { r: '你取出一只废弃的传声装置。它没有电池，可线路仍通往墙里。你把接头按原样装回去。', eff: follow('lf_voices_adult', 10, { skill: 3, flag: 'lf_device' }) }, no: { r: '接头漏了整夜的水。你们赔了维修费，修理的人说这段管道早就不该有人再碰。', eff: follow('lf_voices_adult', 12, { money: -3000, body: -2 }) } },
        { t: '把录音机还掉', r: '你们都说听不出什么。回去以后，各自把床挪远了一点。', eff: end('你听过墙后的声音，后来把录音机还了回去。', { mind: 2 }) },
      ] },
    { id: 'lf_voices_adult', manual: true, req: human, title: '声音的住址',
      text: '一处旧楼要拆。{lf_name}说施工图上有那条管道，末端曾经是一个值班间。\n\n你们到了才发现门口坐着卖茶的人，正用熟悉的节奏数零钱。', choices: [
        { t: '请对方说说值班间的事', r: '对方记得这里轮过很多夜班，认不出声音属于谁。你第一次知道，隔着墙听见的数字也可能只是换班时点数。', eff: follow('lf_voices_late', 15, { money: -1000, mind: 3, flag: 'lf_explained' }) },
        { t: '比对录音，保留没解开的部分', req: { flag: 'lf_original' }, r: '节奏相近，声音却对不上。你们把两段声音分开保存，没有替任何一段写上名字。', eff: follow('lf_voices_late', 14, { wit: 3, flag: 'lf_unanswered' }) },
        { t: '把墙内的旧线路拆下来', req: { flag: 'lf_device' }, r: '断线时，远处有人敲了敲管道。你等了一会儿，没有再听见回声。', eff: follow('lf_voices_late', 16, { skill: 3, mind: -1 }) },
        { t: '陪对方喝完茶就走', r: '你们等到拆楼的人来，把杯子交还摊主。身后的墙比想象中薄得多。', eff: follow('lf_voices_late', 15, { mind: 2 }) },
      ] },
    { id: 'lf_voices_late', manual: true, req: human, title: '轮到你留下声音', star: true,
      text: '你修理住处的管道，发现墙两边说话都能听见。\n\n那一头传来一个年轻人的询问，问是不是有人被关在里面。你停下手，等对方把话说完。', choices: [
        { t: '报出住址，说明自己在修管道', r: '隔壁的人敲开你的门，你们第一次见面。等接头修好，墙里只剩水响。', eff: end('你替墙后的声音，补上过一个可以敲门的住址。', { social: 3, mind: 3 }) },
        { t: '记下此刻，再把接头封好', r: '你录下了工具放地上的声音和自己的回答。标签只写日期，没有写别的。', eff: end('你留过一段标着日期的录音，里面有自己的回答。', { wit: 2, mind: 1 }) },
      ] },
  ]);
})();
