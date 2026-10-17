/* 都市的字（批次 36）：40 条以"城里写着的字"为引子的事件。
 * 广播、告示、价目表、票据背面、门牌、警告牌——先给一段字，再给人。
 */
(function () {
  'use strict';
  const C = window.CITY;
  const E = [];
  const amb = (id, text, eff, age, req) => E.push({
    id: 'ct_' + id, age: age || [16, 95], req: req || {}, w: 11, repeat: true, cd: 13, text, ...(eff ? { eff } : {}),
  });

  // ---------- 14 条无选项 ----------
  amb('broadcast', '广播里在念一串数字，念到一半停了一下。\n\n“重复一遍。”\n\n第二遍的数字和第一遍不一样。');
  amb('poster_corner', '墙上的招贴撕了一半，剩下那半写着“包治”。\n\n底下一行小字被雨泡开了：见效再付。\n\n没有人撕掉它，也没有人在旁边站着。');
  amb('price_tag', '摊上的木牌写着价钱，数字被改过三次。\n\n最下面那一层用刀刮过，露出新木头。\n\n现在的价钱比最早那个高，但比中间的便宜。');
  amb('sign_warning', '拐角立着一块牌子：前方施工，请绕行。\n\n绕行的箭头被人掰到了反方向。\n\n所有的人都照着箭头走。');
  amb('ticket_print', '票的背面印着一行小字，写着“过期不退”。\n\n下面还有一行更小的，字被油墨盖住，只看得出“如遇”。\n\n你把票对着光，还是看不清。');
  amb('doorplate', '门牌上写着两个数字，一个在上一个在下。\n\n下面的那个是后钉的，钉子比上面的新。\n\n送信的人每次都要抬头看两遍。');
  amb('menu_board', '菜单上最后一行被划掉了，划得很粗。\n\n旁边有人用手写补了一行，字比印刷的小。\n\n“今天没有。”老板说。');
  amb('queue_number', '取号机的纸片上印着零一七。\n\n屏幕上停在三。\n\n你把纸片折成两折，又展开。');
  amb('wanted_notice', '公告栏上贴着一张“寻人”，照片被水泡得看不清脸。\n\n特征那一栏写着“左手无名指有伤”。\n\n“最后见面地点”那一栏是空的。');
  amb('floor_sign', '楼道里的楼层牌少了一块，二层的“二”掉了。\n\n新搬来的人总在三层停一下。\n\n没有人补。');
  amb('hospital_sign', '医院的指示牌上，“急诊”的箭头指向左边。\n\n左边的通道被一张床堵住了。\n\n没有人把牌子转过来。');
  amb('receipt_line', '收据最后一行印着“本单可作凭证”。\n\n下面盖的章已经褪成了浅红。\n\n你把它折好放进钱包——钱包里已经有七张这样的。');
  amb('ad_rent', '租房广告上写着“采光好、安静、可短租”。\n\n电话号码最后两位被撕掉了。\n\n底下有人用笔补了两个数字，笔迹和上面不一样。');
  amb('graffiti_word', '巷子深处的墙上写着一个字，写得很高，要抬头才看得见。\n\n字迹被人反复覆盖过，最外面一层是新的。\n\n那个字是“等”。', undefined, [16, 95], { loc: 'backstreet' });

  // ---------- 14 条带选项 ----------
  E.push({ id: 'ct_notice_change', age: [18, 85], w: 10, title: '改了的那一行',
    text: '墙上贴着一张通知，说这一片下个月起要登记。\n\n通知贴在旧通知上面，旧的那张露着一角，上面写着“免费”。\n\n新的这张没有写钱的事。',
    choices: [
      { t: '把旧的撕下来看清楚', eff: { wit: 2, mind: -1, flag: 'ct_read_old' }, r: '旧通知上写得很清楚：登记免费，但要交一份住址证明。\n\n新通知没有提这一条。\n\n你去问，对方说“以新的为准”。' },
      { t: '去问登记要多少钱', check: { s: 'social', dc: 42 },
        ok: { r: '“不要钱。”他说。\n\n“那要什么。”\n\n他想了一下，说“要等”。', eff: { wit: 2, flag: 'ct_asked_fee' } },
        no: { r: '“到时候就知道了。”\n\n他把窗口的挡板往下放了一半。', eff: { mind: -1 } } },
      { t: '不管', eff: { mind: -1, flag: 'ct_ignored_notice' }, r: '下个月你还是去排了队。\n\n排在第七十几位，前面的人手里都拿着住址证明。' },
    ] });

  E.push({ id: 'ct_wrong_sign', age: [18, 85], w: 9, title: '指错的路牌',
    text: '路牌上标着“往市场”，箭头指的方向是一条封了的路。\n\n问了三个人，三个人都照着牌子指。\n\n“上面写着呢。”他们说。',
    choices: [
      { t: '照着走，看看', eff: { body: -2, wit: 1, flag: 'ct_followed_sign' }, r: '走了二十分钟，前面是一道铁皮围挡。\n\n围挡上贴着一张纸：路已于去年改道。\n\n纸的日期被雨水冲淡了。' },
      { t: '往反方向走', check: { s: 'wit', dc: 42 },
        ok: { r: '你走对了。\n\n市场在两条街之外，门口堆着新的塑料筐。\n\n你回头看了一眼路牌，它还指着那边。', eff: { wit: 2, body: 1, flag: 'ct_went_against_sign' } },
        no: { r: '反方向走进了一片住宅区。\n\n你在里面绕了半小时才出来。', eff: { body: -2, mind: -1 } } },
      { t: '问一个正在收摊的人', eff: { social: 1, flag: 'ct_asked_vendor' }, r: '“路牌是旧的。”他说。\n\n他一边说一边把桌子折起来，动作很熟练。\n\n“我也是猜的。”' },
    ] });

  E.push({ id: 'ct_ledger_line', age: [20, 85], w: 9, title: '账上那一行',
    text: '账本上有一行不是你写的字。\n\n写的是一个数目，后面跟着一个日期，日期是下周。\n\n笔迹很稳，像是常常写。',
    choices: [
      { t: '按日期等，看会发生什么', eff: { money: -6000, mind: -1, queue: ['ct_ledger_back', 5], flag: 'ct_waited_ledger' }, r: '那天真的有人来收。\n\n数目和账上写的一样，一分不差。\n\n他没有解释，你也没有问。' },
      { t: '把那一行划掉', eff: { wit: 1, mind: -2, queue: ['ct_ledger_back', 5], flag: 'ct_struck_line' }, r: '你划得很干净，划完把本子合上。\n\n那一页后来总是先从本子里掉出来。' },
      { t: '问家里谁知道这本账', check: { s: 'social', dc: 44 },
        ok: { r: '“那本账很早以前就有了。”老人说，“有些字不是你写的，也不是我写的。”\n\n他说完就不说了。', eff: { wit: 2, flag: 'ct_asked_ledger' } },
        no: { r: '没有人认。\n\n本子被放回柜子里，位置比原来靠里。', eff: { mind: -1 } } },
    ] });

  E.push({ id: 'ct_ledger_back', manual: true, age: [25, 95], w: 1,
    text: '五年后，这本账翻到了最后一页。\n\n最后一页只有一行字，写的是日期，没有数目。\n\n那个日期就是今天。',
    eff: { mind: -1, flag: 'ct_ledger_end' } });

  E.push({ id: 'ct_sticker', age: [16, 80], w: 9, title: '贴纸',
    text: '灯柱上贴着一张巴掌大的贴纸，画着一个歪掉的圆。\n\n同一张在三条街上都有，位置都一样高。\n\n撕下来以后，下面那一层还有一张。',
    choices: [
      { t: '一路撕过去', check: { s: 'body', dc: 40 },
        ok: { r: '你撕了三张，越撕越觉得有人在看你。\n\n第四张的时候你停了。\n\n回头一路看，撕过的地方都留着浅色的印。', eff: { body: -1, wit: 1, flag: 'ct_tore_stickers' } },
        no: { r: '第二张撕到一半，指甲翻了一块。\n\n你把手插进口袋，走了。', eff: { body: -1, mind: -1 } } },
      { t: '记住位置，以后再看', eff: { wit: 2, flag: 'ct_noted_stickers' }, r: '三个月后，其中两处换成了别的贴纸。\n\n第三处还是那一张，边角卷起来了。' },
      { t: '不管', eff: { mind: 1 }, r: '你从它前面走过去。\n\n后来它被雨泡烂，只剩一圈胶印。' },
    ] });

  E.push({ id: 'ct_phone_number', age: [18, 85], w: 9, title: '写在墙上的号码',
    text: '墙上有一个人用记号笔写的电话号码。\n\n后面跟着两个字：急用。\n\n号码的最后一位被雨水冲淡了，像是六，也像是八。',
    choices: [
      { t: '两个都打一次', eff: { money: -300, mind: -1, flag: 'ct_called_both' }, r: '第一个是空号。\n\n第二个有人接，是个女人，她说“你打错了”，然后挂了。\n\n你站在电话亭里又待了一会儿。' },
      { t: '只打像六的那个', check: { s: 'wit', dc: 38 },
        ok: { r: '通了。对面很吵，有人在喊价。\n\n“谁。”他问。\n\n你说不清楚。他挂了。', eff: { wit: 1, mind: -1 } },
        no: { r: '空号。\n\n听筒里的忙音一直响到你放下它。', eff: { mind: -1 } } },
      { t: '记下来，不打', eff: { wit: 1, flag: 'ct_copied_number' }, r: '你把号码抄在一张纸上，纸后来混进了别的纸里。\n\n再找的时候，那面墙已经被刷白了。' },
    ] });

  E.push({ id: 'ct_contract_fine', age: [20, 85], w: 9, title: '合同最下面那行',
    text: '合同最后一页的空白处，有人用很小的字印了一行。\n\n那一行比上面的正文小一半，不特意看会当成装饰。\n\n“如双方另有约定的，以另有约定为准。”',
    choices: [
      { t: '问“另有约定”是什么', check: { s: 'social', dc: 46 },
        ok: { r: '对方说“就是口头说好的”。\n\n你说那写下来。\n\n他想了一下，说“可以”。', eff: { wit: 2, mind: 1, flag: 'ct_asked_fine' } },
        no: { r: '“都是这么写的。”\n\n他把笔递给你，笔是热的。', eff: { mind: -1 } } },
      { t: '自己划掉那一行再签', eff: { wit: 2, mind: -1, flag: 'ct_struck_fine' }, r: '你划了两道，划得很直。\n\n对方看了一眼，没有说话，把合同收下了。\n\n一年后，他拿出来的是一份新的。' },
      { t: '直接签', eff: { money: 6000, mind: -1, flag: 'ct_signed_fine' }, r: '签得很快。\n\n那一行小字在纸的最下面，你后来再也没有看过那一页。' },
    ] });

  E.push({ id: 'ct_ad_work', age: [16, 70], w: 9, title: '招工纸的下半截',
    text: '招工纸被人撕走了下半截，只剩下“包吃住”和“工资面议”。\n\n撕口很整齐，是有人特意撕的。\n\n上半截本来写着什么，没有人知道。',
    choices: [
      { t: '按地址去一趟', check: { s: 'social', dc: 44 },
        ok: { r: '那地方是个院子，院子里坐着八九个人。\n\n“先坐着。”有人说。\n\n你坐了三个小时，没有人来。', eff: { body: -1, wit: 1, mind: -1, flag: 'ct_waited_yard' } },
        no: { r: '门口的牌子写着“不招”。\n\n你把招工纸的照片给门房看，他说“那是旧的”。', eff: { mind: -2 } } },
      { t: '问撕纸的人为什么撕', eff: { wit: 1, flag: 'ct_asked_tearer' }, r: '“下半截写着要押金。”他说，“写着就没人来了。”\n\n他说完把剩下的半张也撕了。' },
      { t: '撕下剩下的半张', eff: { mind: -1 }, r: '你把剩下的那半撕下来。\n\n电线杆上留下一块长方形，比周围干净。\n\n第二天那里又贴上新的，连撕口的位置都一样。' },
    ] });

  E.push({ id: 'ct_bill_due', age: [20, 85], w: 9, title: '催缴单',
    text: '催缴单上写着“逾期将按日计收”。\n\n下面的空白处有人用红笔写了“已告知”。\n\n日期是三天前，那时候你不在家。',
    choices: [
      { t: '去问红字是谁写的', check: { s: 'social', dc: 42 },
        ok: { r: '是楼下的邻居写的。\n\n“他们来贴，我看见了。”\n\n“你替我写的？”\n\n“写了他们就会以为你知道了。”', eff: { social: 1, mind: 1, flag: 'ct_knew_neighbor' } },
        no: { r: '没有人认。\n\n管理的人说“这都是流程”。', eff: { mind: -1 } } },
      { t: '当天去交', eff: { money: -4000, mind: 1, flag: 'ct_paid_same_day' }, r: '交完你在收据上签了名。\n\n窗口的人说“下次别拖”。\n\n你说单子是我回来才看见的。' },
      { t: '把它贴在门上', eff: { mind: -1, flag: 'ct_posted_bill' }, r: '你把它贴在门的正面，让人一眼就看见。\n\n第二天它不见了。\n\n门上留着一小片胶印。' },
    ] });

  E.push({ id: 'ct_map_wrong', age: [18, 80], w: 8, title: '地图上的空白',
    text: '车站的地图上有一块空白，不是留白，是被人刮掉的。\n\n刮痕很整齐，四条边都是直的。\n\n那一块正好在两条主干道中间。',
    choices: [
      { t: '去那一块看看', eff: { body: -2, wit: 1, mind: -1, flag: 'ct_visited_blank' }, r: '那里是一片围起来的空地。\n\n围挡贴着一张很旧的施工许可，日期是三年前。\n\n空地上什么都没有，只有一处压平的草。' },
      { t: '问站务员', check: { s: 'social', dc: 40 },
        ok: { r: '“那一块在重新规划。”他说。\n\n“规划三年了？”\n\n他低头去看别的地方。', eff: { wit: 2, flag: 'ct_asked_staff' } },
        no: { r: '“不知道。”\n\n他把手里的伞收起来，走进了值班室。', eff: { mind: -1 } } },
      { t: '照着地图的空白画一个圈', eff: { wit: 1, flag: 'ct_circled_blank' }, r: '你用铅笔画了个圈，圈得很圆。\n\n后来那张地图被换掉了，新的那张有那一块，画的是树。' },
    ] });

  E.push({ id: 'ct_lost_notice', age: [18, 85], w: 8, title: '寻物启事',
    text: '墙上有一张寻物启事：一只旧表，表带是棕色的。\n\n“有拾到者重谢。”下面留了地址。\n\n那张纸已经贴了很久，边角翘起来又被人按平过。',
    choices: [
      { t: '顺着地址去问一句', eff: { body: -1, social: 1, mind: -1, flag: 'ct_asked_lost' }, r: '开门的人听了一半，说“找到了”。\n\n“什么时候？”\n\n“上个月。”\n\n他没有去把那张纸撕掉。' },
      { t: '把启事按平', eff: { mind: 1 }, r: '你把翘起来的那一角按回墙上，按了两次才粘住。\n\n走过去的时候，你回头看了一眼。' },
      { t: '记下那只表的样子', eff: { wit: 1, flag: 'ct_knew_watch' }, r: '棕色表带，表盘有一道裂纹。\n\n之后你在很多人的手腕上找过。\n\n没有找到。' },
    ] });

  E.push({ id: 'ct_name_list', age: [20, 85], w: 8, title: '名单',
    text: '公告栏上贴着一张名单，二十几个名字。\n\n其中有三个被划掉了。\n\n名单的标题写的是“已安排”，没有说安排什么。',
    choices: [
      { t: '找自己的名字', eff: { mind: -1, flag: 'ct_found_name' }, r: '你在第十七个位置找到了它。\n\n不是划掉的三个之一。\n\n你站在那儿看了很久。' },
      { t: '问划掉是什么意思', check: { s: 'social', dc: 44 },
        ok: { r: '“已经办完了。”那人说。\n\n“办完什么。”\n\n“你不用知道。”\n\n他说完就把名单揭下来了。', eff: { wit: 1, mind: -2, flag: 'ct_asked_crossed' } },
        no: { r: '没有人回答。\n\n第二天名单不见了，公告栏空着。', eff: { mind: -1 } } },
      { t: '把三个划掉的名字记下来', eff: { wit: 2, flag: 'ct_recorded_names' }, r: '你抄在纸上，抄完发现其中一个名字你在别处见过。\n\n在哪儿见的，想不起来。' },
    ] });

  E.push({ id: 'ct_old_sign', age: [24, 85], w: 8, title: '褪色的招牌',
    text: '一间关了门的店，招牌上只剩两个半字。\n\n剩下的半笔还能看出原来是什么。\n\n玻璃上贴着一张手写的“转让”，纸上没有电话。',
    choices: [
      { t: '猜剩下的字', eff: { wit: 1, mind: 1 }, r: '你猜了三个，都不对。\n\n后来有人告诉你原来那家卖什么，你才发现自己猜的方向全错。' },
      { t: '拍下来', eff: { wit: 1, flag: 'ct_photo_sign' }, r: '照片洗出来之后，招牌上的字比现场更看不清。\n\n你还是留着。' },
      { t: '透过玻璃看里面', eff: { mind: -1, flag: 'ct_peered_shop' }, r: '里面什么都没有，地上一只倒着的纸箱。\n\n墙上有一块地方比周围干净，是挂过什么东西的。' },
    ] });

  E.push({ id: 'ct_quoted_rule', age: [20, 85], w: 8, title: '有人引用规定',
    text: '有人拦住你，说这里不许停。\n\n他引用了一条规定的编号，念得很顺。\n\n那块地方没有划线，也没有牌子。',
    choices: [
      { t: '问他规定在哪儿能看', check: { s: 'social', dc: 46 },
        ok: { r: '他愣了一下，说“网上有”。\n\n“那你现在给我看看。”\n\n他看了半天手机，然后说“算了”。', eff: { wit: 2, mind: 1, flag: 'ct_challenged_rule' } },
        no: { r: '“你跟我争这个？”\n\n他往前站了半步。\n\n你让开了。', eff: { mind: -2 } } },
      { t: '让开', eff: { mind: -1 }, r: '你往旁边走了几步。\n\n他站在原地，看着你把东西放好。\n\n那块地方一直空着。' },
      { t: '说自己马上就走', eff: { social: 1, flag: 'ct_moved_along' }, r: '“马上”用了二十分钟。\n\n他一直在旁边站着，没有催。' },
    ] });

  // ---------- 12 条回响（6 起点 + 6 manual） ----------
  E.push({ id: 'ct_graffiti_kept', age: [16, 40], req: { loc: 'backstreet' }, w: 8, title: '把那个字描一遍',
    text: '墙上那个“等”字又被盖上了新的颜色。\n\n你手里正好有笔。\n\n描一遍不难。',
    choices: [
      { t: '描', eff: { queue: ['ct_graffiti_back', 9], mind: 1, flag: 'ct_traced_word' }, r: '你描完退开两步看。\n\n比原来的清楚，也比原来的难看。' },
      { t: '不描，看着它被盖住', eff: { queue: ['ct_graffiti_back', 9], mind: -1, flag: 'ct_let_covered' }, r: '新颜色很厚。\n\n那个字后来只剩下一竖。' },
    ] });
  E.push({ id: 'ct_graffiti_back', manual: true, age: [25, 95], w: 1,
    text: '九年后那面墙拆了。\n\n砖被运走，其中一块被谁捡回来，立在原来的位置上。\n\n上面还有一个字，颜色很旧。',
    eff: { mind: 2, flag: 'ct_brick_kept' } });

  E.push({ id: 'ct_kept_ticket', age: [18, 60], w: 8, title: '留住那张票',
    text: '一张票根，日期已经过去很久。\n\n背面那行小字你终于看清了：如遇改期，另行通知。\n\n“另行”在哪儿，票上没写。',
    choices: [
      { t: '留着它', eff: { queue: ['ct_ticket_back', 7], wit: 1, flag: 'ct_kept_stub' }, r: '你把它夹在一本从来不看第二遍的书里。\n\n书脊上有一道折痕。' },
      { t: '扔掉', eff: { queue: ['ct_ticket_back', 7], mind: 1, flag: 'ct_tossed_stub' }, r: '纸很轻，落进垃圾桶时没有声音。' },
    ] });
  E.push({ id: 'ct_ticket_back', manual: true, age: [25, 95], w: 1,
    text: '七年后，同一场演出重新排了。\n\n主办方说旧票可以换。\n\n你翻遍了所有放纸的地方，没有找到那张。',
    eff: { mind: -1, flag: 'ct_ticket_missed' } });

  E.push({ id: 'ct_wrote_number', age: [18, 60], w: 8, title: '把号码写上墙',
    text: '你手里有一支笔，墙上有一块空的地方。\n\n写上去，就会有人打。\n\n也可能一个都没有。',
    choices: [
      { t: '写', eff: { queue: ['ct_number_back', 6], social: 1, flag: 'ct_wrote_wall' }, r: '你写得很大，写完退开看。\n\n那天下午有人站在墙前面看了很久。' },
      { t: '写小一点，靠下', eff: { queue: ['ct_number_back', 6], wit: 1, flag: 'ct_wrote_small' }, r: '你写在最下面，要蹲下来才看得见。\n\n这样只有真的在找的人才会看见。' },
    ] });
  E.push({ id: 'ct_number_back', manual: true, age: [24, 95], w: 1,
    text: '六年后那面墙刷过一次。\n\n你去看，字没有了。\n\n但有一处被另外一支笔重新写过，写在旁边一点的位置。',
    eff: { mind: 1, flag: 'ct_number_rewritten' } });

  E.push({ id: 'ct_saved_notice', age: [20, 60], w: 8, title: '把通知收起来',
    text: '一张已经失效的通知，写着某年某月起执行。\n\n那件事后来没有执行。\n\n通知还贴在墙上，边角卷了。',
    choices: [
      { t: '揭下来收好', eff: { queue: ['ct_notice_back', 8], wit: 1, flag: 'ct_kept_notice' }, r: '纸背面有胶，粘着一层灰。\n\n你把它夹进本子，灰落了一桌。' },
      { t: '让它贴着', eff: { queue: ['ct_notice_back', 8], mind: 1, flag: 'ct_left_notice' }, r: '一年后它掉了一半，只剩上面两个角粘着。' },
    ] });
  E.push({ id: 'ct_notice_back', manual: true, age: [28, 95], w: 1,
    text: '八年后，同样的通知又贴了出来。\n\n编号变了，措辞几乎一样。\n\n你从本子里翻出旧的那张，两张并在一起看。',
    eff: { wit: 2, mind: -1, flag: 'ct_notice_compared' } });

  E.push({ id: 'ct_read_aloud', age: [20, 60], w: 8, title: '念给不识字的人听',
    text: '有人在公告栏前面站了很久，没有说话。\n\n他不识字，但也不肯开口请人念。\n\n你把那张纸上的内容念出了声。',
    choices: [
      { t: '接着念完', eff: { queue: ['ct_aloud_back', 10], social: 2, flag: 'ct_read_aloud' }, r: '念到最后一行，他说“停”。\n\n他没有说为什么。' },
      { t: '念一半就停', eff: { queue: ['ct_aloud_back', 10], mind: -1, flag: 'ct_read_half' }, r: '他等着。\n\n你说太长了。\n\n他说“那就算了”。' },
    ] });
  E.push({ id: 'ct_aloud_back', manual: true, age: [30, 95], w: 1,
    text: '十年后，你在一张纸上看到一行字，念了两遍才认出来。\n\n字迹很生，写得慢。\n\n署名是你当年念过的那张纸上的名字。',
    eff: { mind: 2, flag: 'ct_learned_letter' } });

  E.push({ id: 'ct_bought_wrong', age: [18, 60], w: 8, title: '照着牌子买的',
    text: '牌子写的是这个价钱，结账的时候多了三成。\n\n对方指着牌子最下面一行：小字，另计。\n\n那一行确实在，只是比上面的小一半。',
    choices: [
      { t: '要求按牌子上的价格', eff: { queue: ['ct_price_back', 5], money: -2000, wit: 1, flag: 'ct_argued_price' }, r: '他们商量了一会儿，按牌子的价钱收。\n\n牌子当天下午被换掉了。' },
      { t: '照付，把牌子拍下来', eff: { queue: ['ct_price_back', 5], money: -3000, wit: 2, flag: 'ct_photographed_price' }, r: '照片存在手机里。\n\n后来你翻到它，才想起那家店已经关了。' },
    ] });
  E.push({ id: 'ct_price_back', manual: true, age: [23, 95], w: 1,
    text: '五年后，同样的牌子出现在另一家店。\n\n你一眼就看见了那行小字。\n\n这次你什么都没买。',
    eff: { wit: 2, flag: 'ct_knew_trick' } });

  C.addEvents('citytext', E);
})();
