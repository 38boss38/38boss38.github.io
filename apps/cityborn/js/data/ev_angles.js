/* 一件事的三种人（批次 32）：同一个处境，从三个位置看到。
 * 每个处境三版：干活的人 / 拿主意的人 / 站在旁边的人。不同职业遇到的是不同的那一版。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const T = (id, title, text, choices, age, req) => E.push({
    id: 'an_' + id, title, text, choices, age: age || [18, 85], req: req || {}, w: 10,
  });
  const LABOR = { job: 'labor' }, BOSS = { job: 'mech' }, SIDE = {};

  // ===== 处境一：塌板 =====
  T('collapsed_worker', '塌下来的那一块',
    '板子塌了，压住的是老陈的腿。\n\n工头在喊人抬，抬之前要先把上面的东西挪开。\n\n挪的人里，有两个昨天还在跟老陈借工具。',
    [
      { t: '先去挪上面的东西', check: { s: 'body', dc: 46 },
        ok: { r: '你们挪开了，老陈被抬出来，腿还在。\n\n他一直在说话，说的是“我的鞋”。', eff: { body: -3, social: 1, flag: 'an_saved_chen' } },
        no: { r: '你抬了一下，腰上像被别住。\n\n别人把你推开，接着抬。\n\n老陈的腿后来没保住。', eff: { body: -4, mind: -3, flag: 'an_failed_rescue' } } },
      { t: '先去叫车', eff: { body: -1, wit: 1, flag: 'an_called_car' }, r: '你跑到路口，拦了一辆。\n\n回去的时候已经有人在抬了。\n\n车白叫了，钱还是给了。' },
      { t: '站在外面等吩咐', eff: { mind: -2, flag: 'an_stood_outside' }, r: '你站在外面，脚底下全是碎料。\n\n有人喊你的名字，你没有动。\n\n后来也没有人再喊。' },
    ], [18, 62], LABOR);

  T('collapsed_boss', '报上去的那一行',
    '事故表要填。\n\n第一栏是“事故原因”，可以写“操作不当”，也可以写“材料老化”。\n\n写前一种，扣的钱少；写后一种，这一批材料要全换。',
    [
      { t: '写材料老化', eff: { money: -20000, mind: 2, flag: 'an_wrote_material' }, r: '你把那一栏写完，签了名。\n\n改料的钱从你这一年的账上出。\n\n老陈的家里后来拿到一笔补偿。' },
      { t: '写操作不当', check: { s: 'social', dc: 44 },
        ok: { r: '表交上去了，没有人追问。\n\n你在名单上划掉了老陈的名字，划得很轻。', eff: { money: 5000, mind: -3, flag: 'an_blamed_worker' } },
        no: { r: '审查的人问了一句“谁操作的”。\n\n你说“还在查”。\n\n这句话你说得很熟。', eff: { money: 5000, mind: -2, flag: 'an_under_investigation' } } },
      { t: '空着交上去', eff: { money: -3000, wit: 1, flag: 'an_blank_report' }, r: '表被退回来两次。\n\n第三次你在旁边加了一行小字：“待查”。\n\n那一行后来被人用红笔圈了。' },
    ], [24, 65], BOSS);

  T('collapsed_side', '路过的人',
    '你路过的时候，人已经被抬走了。\n\n地上有一块板，边上还压着一只鞋。\n\n围观的人已经散了，有两个还在小声说话。',
    [
      { t: '问那两个人出了什么事', check: { s: 'social', dc: 40 },
        ok: { r: '他们说了几句，说得很快。\n\n“这种事一个月两回。”\n\n说完他们就走了。', eff: { wit: 1, mind: -1, flag: 'an_heard_story' } },
        no: { r: '他们看了你一眼，说“不知道”。\n\n然后一起走了。', eff: { mind: -1 } } },
      { t: '把那只鞋踢到边上', eff: { mind: 1 }, r: '鞋子被你踢到墙根，靠得很正。\n\n第二天再路过，鞋不在了。' },
      { t: '什么也不做，走过去', eff: { mind: -1 }, r: '你走过去，走了很远。\n\n那块板的样子你记了很久。' },
    ]);

  // ===== 处境二：涨租 =====
  T('rent_tenant', '涨了四成',
    '房东来通知，下个月起涨四成。\n\n他说得很快，说完就往门口走。\n\n“你要是不租，后面有人问。”',
    [
      { t: '当场跟他算', check: { s: 'social', dc: 44 },
        ok: { r: '你把这一年修过的东西一件件数出来。\n\n他听到第三件的时候停下来了，说“涨两成”。', eff: { money: -4000, wit: 2, flag: 'an_argued_rent' } },
        no: { r: '“那你搬。”他说。\n\n门关得不重，但很快。', eff: { mind: -2, flag: 'an_threatened_move' } } },
      { t: '答应，继续住', eff: { money: -8000, mind: -1, flag: 'an_accepted_rent' }, r: '你答应了。\n\n那天晚上你把屋里能卖的东西看了一遍。' },
      { t: '开始找新住处', eff: { body: -1, wit: 1, flag: 'an_started_looking' }, r: '你看了三处。\n\n一处更贵，一处更远，一处不能做饭。' },
    ], [18, 80], LABOR);

  T('rent_owner', '后面有人问',
    '你这栋楼有三户没交。\n\n其中一户住了七年，从没晚过。\n\n另外两户上个月刚搬进来。',
    [
      { t: '只催那两户', eff: { money: 6000, social: 1, flag: 'an_spared_old_tenant' }, r: '你去敲了门，说得很难听。\n\n那户住了七年的，你一次也没去。\n\n他后来自己把钱送来了。' },
      { t: '三户一起催', check: { s: 'social', dc: 42 },
        ok: { r: '三家都给了，有一家给得慢。\n\n钱收齐那天，你在楼下站了一会儿。', eff: { money: 9000, mind: -1, flag: 'an_collected_all' } },
        no: { r: '那户住了七年的说“我明天搬”。\n\n第二天他真的搬了，房间打扫得很干净。', eff: { money: 5000, mind: -3, flag: 'an_old_tenant_left' } } },
      { t: '告诉他们下个月再说', eff: { money: 0, mind: 1, flag: 'an_gave_month' }, r: '你说“下个月再说”，三家都松了一口气。\n\n下个月你没有再提。' },
    ], [26, 80], BOSS);

  T('rent_side', '同一层的人',
    '你听见对门在跟人吵，吵的是房租。\n\n门开着一条缝，能看见一个男人站在里面，手里拿着一串钥匙。\n\n对门的人说话很大声，声音在抖。',
    [
      { t: '把门关上', eff: { mind: -1 }, r: '争吵声被隔在外面，还是听得到。\n\n后来有东西被摔了一下。' },
      { t: '过去问需不需要帮忙', check: { s: 'social', dc: 42 },
        ok: { r: '你站在门口说了两句。\n\n拿钥匙的人看了你一眼，说“不关你事”，走了。\n\n对门的人把门关上了，没有说谢谢。', eff: { social: 1, mind: -1, flag: 'an_helped_neighbor' } },
        no: { r: '你刚开口，两边一起看你。\n\n你退了回来。', eff: { mind: -2 } } },
      { t: '等他们吵完再说', eff: { mind: 1 }, r: '吵了大概十分钟。\n\n之后是安静，再之后是搬东西的声音。' },
    ]);

  // ===== 处境三：葬礼 =====
  T('funeral_worker', '一起去',
    '工地上有人没了。\n\n大家凑钱，凑出来的数不够办一场。\n\n有人说“按最低的办”，说完就没人说话了。',
    [
      { t: '多出一点', eff: { money: -3000, social: 2, mind: 1, flag: 'an_gave_more' }, r: '你多出了三千。\n\n收钱的人看了你一眼，把钱单独放一边。\n\n那天去了七个人。' },
      { t: '按凑出来的办', eff: { social: 1 }, r: '办得很简单，两个人抬，一辆车。\n\n路口换车的时候，你们站着看了一会儿。' },
      { t: '问能不能先欠着', eff: { mind: -2, flag: 'an_owed_funeral' }, r: '收钱的人说“不急”。\n\n后来那笔钱你一直没给。' },
    ], [18, 80], LABOR);

  T('funeral_boss', '名字要不要写',
    '名单上要写“生前所属”。\n\n他做过三家，最后一家干了四个月。\n\n写哪一家，要有人点头。',
    [
      { t: '写最后那一家', eff: { money: -2000, mind: 2, flag: 'an_wrote_last_job' }, r: '你打了电话，那边的人沉默了一会儿，说“写吧”。\n\n他们后来也来了人。' },
      { t: '写“自由”', eff: { money: 0, wit: 1, flag: 'an_wrote_free' }, r: '登记的人问了一句，你说“他没有单位”。\n\n他就在那一栏画了一道横线。' },
      { t: '让他自己家里人定', eff: { mind: 1 }, r: '他母亲想了一晚上。\n\n第二天她说“写我们家的姓就行”。' },
    ], [26, 80], BOSS);

  T('funeral_side', '路口的车',
    '路口停着一辆车，车上两个人。\n\n没有人哭，也没有人说话。\n\n车开走之后，地上留着一小堆纸灰。',
    [
      { t: '站着等车开走', eff: { mind: -1 }, r: '车停了三分钟。\n\n开走的时候，车斗里那块布被风掀起一角。' },
      { t: '把纸灰扫到路边', eff: { mind: 1, wit: 1 }, r: '你扫的时候，扫帚碰到一小块没烧透的纸。\n\n上面有个字，你认出是“陈”。' },
      { t: '问这是送谁', check: { s: 'social', dc: 38 },
        ok: { r: '路边的人说了一个名字，还说了他在哪儿干活。\n\n那个地方你去过。', eff: { wit: 2, flag: 'an_knew_name' } },
        no: { r: '“不知道。”\n\n他转身进了店。', eff: { mind: -1 } } },
    ]);

  // ===== 处境四：封路检查 =====
  T('check_worker', '通行证',
    '路口设了检查，过一个人要刷一次。\n\n你的证上写的还是上上个厂。\n\n前面还有十一个人。',
    [
      { t: '硬着头皮刷', check: { s: 'social', dc: 44 },
        ok: { r: '机器响了一声，绿灯亮起。\n\n刷的人没有看证上的字。\n\n你走过去，腿有点软。', eff: { wit: 1, mind: -1, flag: 'an_passed_gate' } },
        no: { r: '机器没响。\n\n他让你退到一边，问你在哪儿干活。\n\n后面的人开始往前挤。', eff: { mind: -2, flag: 'an_stopped_gate' } } },
      { t: '绕路走', eff: { body: -2, mind: 1, flag: 'an_took_detour' }, r: '你绕了两条街，多走了四十分钟。\n\n到的时候，别人已经开始干了。' },
      { t: '回去把证换了', eff: { money: -1500, wit: 1, flag: 'an_renewed_pass' }, r: '换证要照片，要原单位的一个章。\n\n原单位已经关了门。' },
    ], [18, 75], LABOR);

  T('check_boss', '名单上多一个人',
    '检查的人说，你的名单比实际多一个人。\n\n多出来的那个，上个月就走了。\n\n你没有把他划掉。',
    [
      { t: '说还在请假', check: { s: 'social', dc: 46 },
        ok: { r: '他看了看名单，没有再问。\n\n“下个月对不上就不行。”\n\n你点头。他走了。', eff: { money: 4000, mind: -1, flag: 'an_kept_ghost' } },
        no: { r: '他把名单带走了。\n\n三天后有人来问你那个人的事。\n\n你说不清。', eff: { money: -6000, mind: -2, flag: 'an_ghost_found' } } },
      { t: '当场划掉', eff: { money: -4000, mind: 1, flag: 'an_struck_ghost' }, r: '你当着他们的面把那一行划了。\n\n笔压得很重，纸破了一点。' },
      { t: '把那个人的家人找来', eff: { mind: 2, flag: 'an_called_family' }, r: '他妻子来了，带着一张死亡证明。\n\n检查的人看完，把名单退了回来，什么也没说。' },
    ], [24, 65], BOSS);

  T('check_side', '排队的人',
    '检查口排了很长。\n\n有个女人一直在发抖，手里攥着一张纸。\n\n她的证被退回来两次了。',
    [
      { t: '让她站到自己前面', eff: { mind: 2, flag: 'an_let_ahead' }, r: '她站到你前面，回头说了两遍谢谢。\n\n第三次她进去了。' },
      { t: '告诉她差什么', check: { s: 'wit', dc: 42 },
        ok: { r: '你看了一眼那张纸，说少一个章。\n\n她愣了一下，说“那在另一个区”。\n\n她走了。', eff: { wit: 2, mind: -1, flag: 'an_told_her' } },
        no: { r: '你没看出来。\n\n她第三次被退回来的时候，已经不抖了。', eff: { mind: -1 } } },
      { t: '不管', eff: { mind: -1 }, r: '队伍往前挪。\n\n你进去的时候，她还在后面。' },
    ]);

  // ===== 12 条普通日常（填空用，不分身份） =====
  const amb = (id, text, eff, age) => E.push({ id: 'an_' + id, age: age || [16, 95], req: {}, w: 10, repeat: true, cd: 13, text, ...(eff ? { eff } : {}) });
  amb('tin_roof', '铁皮棚顶下了一夜雨，早上还在滴水。\n\n地上摆着三只盆，一只满了，两只还空着。\n\n满的那只被人端走了。');
  amb('coal_stove', '炉子里的火要灭了。\n\n有人往里添了一块，火又起来一点。\n\n添火的人没有说这块是最后一块。', { body: 1 }, [16, 90]);
  amb('wet_gloves', '手套湿了，第二天早上还是湿的。\n\n你还是戴上它干活。\n\n到中午，它自己暖了。', { body: -1 });
  amb('street_queue', '街上排队的人绕了半圈。\n\n队伍里有人在吃早饭，有人蹲着。\n\n没有人知道前面在发什么。');
  amb('three_kinds', '货架上摆着三种，价钱差一倍。\n\n最贵的那种盒子上印着字，最便宜的什么也没有。\n\n你拿起来，又放下。');
  amb('neon_off', '招牌的灯管坏了一根，字缺了一笔。\n\n那一笔正好在中间。\n\n路过的人都按缺了那一笔念。');
  amb('cart_wheel', '推车的轮子卡住了，转半圈就停。\n\n你踢了一脚，好了两步，又卡。\n\n后来你学会了斜着推它。');
  amb('cut_finger', '手指被划了一道，不深。\n\n你用布条缠上，接着干。\n\n布条后来黑了，你也没换。', { body: -1 });
  amb('night_shift_end', '夜班结束，天刚亮。\n\n街上的早点摊正在支棚子。\n\n你站了一会儿，觉得这个时间不属于自己。');
  amb('same_meal', '你已经连着很多天吃同一样东西。\n\n今天吃着，忽然觉得味道变了。\n\n其实是你自己的问题。');
  amb('broken_buckle', '腰带的扣断了。\n\n你用一根绳系着，系了一整天。\n\n晚上才发现绳头露在外面。');
  amb('cold_room', '屋里比外面还冷。\n\n你把手放在灯下，灯是热的。\n\n这一点热，够撑到水烧开。');

  C.addEvents('angles', E);
})();
