/* U/H/L 三个翼的外围岗位（批次 11）：码头的货单、鸿园的规矩、脑叶公司的交接单。
 * 只写岸上、园子外院与地下层外围；不写大湖生态、家族成员身世、异想体图鉴。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  // ============ 故事包 1：U公司 受潮那一栏（码头） ============
  p({ id: 'u_tide', pack: 'B11', title: '受潮那一栏', route: 'wing_U', person: 'u_dock_clerk', theme: '风险', age: [20, 58], sources: ['S17'] }, [
    ['受潮两个字',
      S => '天没亮，码头上先起雾。\n\n一只从大湖上回来的木箱摆在秤上，箱底在滴水。\n\n' + NM(S, 'u_dock_clerk') + '把货单推过来，指着最后一栏：“写受潮，别开。”',
      [
        o('照他说的写', '你写下“受潮”两个字，笔尖在纸上压出一个坑。\n\n他把箱子推到墙角，那里已经堆着四只一样湿的箱子，字也一模一样。', { wet: 'wrote' }, { money: 2000, flag: 'wu_wrote_wet' }, { trust: 1 }),
        c('撬开箱盖点数', 'wit', 46,
          o('箱里是空的。', '你把水舀出去，箱底是空的，内壁结着一圈盐。\n\n单子上写的是十二件。', { wet: 'empty' }, { wit: 2, flag: 'wu_saw_empty' }),
          o('箱底粘着一张旧单子。', '水先流出来，漫过你的鞋面。\n\n箱底粘着一张旧装卸单，签字那一栏是你的名字，日期在七年前。', { wet: 'old_slip' }, { mind: -3, flag: 'wu_saw_signature' })),
        o('拿着单子去找签收的人', '你没签字。单子夹在腋下，走到仓房尽头。\n\n门开着，桌上有一杯还热的茶，人不在。', { wet: 'asked' }, { wit: 1, flag: 'wu_asked_office' }, { goto: 3 }),
      ]],
    ['多出来的一只',
      '秤上还多着一只箱子。\n\n箱盖上没有号码，只有一道粉笔画的横线，被水泡得发白。\n\n管货单的人说：“这一只不在单子上。”',
      [
        o('报给当班的人', '值班的人来看了很久，没有碰箱盖。\n\n他让你把箱子单独挪进仓房，锁上，钥匙记在你名下。', { extra: 'reported' }, { merit: 1, flag: 'wu_reported_extra' }, { trust: 1 }),
        o('推回水里', '箱子下水时几乎没有溅起水花，像是早就灌满了。\n\n你站在岸边数到十，它没有浮上来。', { extra: 'pushed' }, { mind: -2, flag: 'wu_pushed_back' }),
        o('盖上帆布，等天亮再说', '你把帆布拉到箱角，压上两块砖。\n\n夜里的风把一角掀了两次，第二次你没有再出去。', { extra: 'waited' }, { body: -1, flag: 'wu_covered' }, { goto: 4 }),
      ]],
    ['口风',
      '傍晚收工，管货单的人请你在摊子上喝一碗汤。\n\n汤很咸，他自己那碗没有动。\n\n“早上那箱，你跟他们说十二件就行。”',
      [
        o('答应他', '你点头，把汤喝完了。\n\n第二天早班点名，他真的报了十二件，声音很稳。', { word: 'kept' }, { money: 3000, flag: 'wu_kept_quiet' }, { trust: 1 }),
        c('问他为什么是十二', 'social', 44,
          o('他讲了半句。', '他说上一回多报一件的人，第二天没有来上工。\n\n说完他把汤钱压在碗底，先走了。', { word: 'asked' }, { wit: 2, flag: 'wu_heard_thirteen' }),
          o('他把碗推开。', '“喝你的。”\n\n他起身走了。那碗汤钱他付了，你的没有。', { word: 'silent' }, { money: -300, mind: -1, flag: 'wu_asked_wrong' }), { trust: -1 }),
        o('不接话，回码头去', '你把汤钱放在桌上，起身。\n\n雾已经散了，码头上的灯还亮着。', { word: 'left' }, { mind: 1 }, { goto: 3 }),
      ]],
    ['缆绳',
      '一条船提前回来了。\n\n船头没有灯，甲板上没有人。\n\n港口的规矩是数两遍缆绳，数完之前不喊话。',
      [
        c('蹲下数缆绳', 'mind', 48,
          o('第二遍多出一根。', '你把两遍的数写到手心里，差一根。\n\n那根绳的另一头系在岸上，绳结是从船那头打的。', { rope: 'extra' }, { wit: 2, flag: 'wu_extra_rope' }),
          o('你数到一半抬了头。', '船头站着一个人，看不清脸。\n\n等你低下头再数，缆绳已经是十二根，和你第一遍数的一样。', { rope: 'looked' }, { mind: -3, flag: 'wu_saw_deck' })),
        o('去叫值班的人', '值班室的门锁着，窗里亮着灯。\n\n你敲了三次，里面的灯灭了。\n\n回到码头，船已经靠好，缆绳也系好了。', { rope: 'called' }, { body: -2, mind: -1, flag: 'wu_called_watch' }, { trust: -1 }),
        o('走开，等早班来', '你绕到仓房后面，坐在空箱上等天亮。\n\n早班的人来时，船已经不在，泊位上空着。', { rope: 'left' }, { mind: -1, flag: 'wu_left_boat' }, { goto: 5 }),
      ]],
    ['空着的那一栏',
      S => '货单最下面留着一栏“回港件数”，空着。\n\n' + NM(S, 'u_dock_clerk') + '把笔递给你：“照昨天的写，十二。”\n\n昨天那张单子压在最底下，边角还是湿的。',
      [
        o('照他说的写', '你写了十二。\n\n笔迹和下面那张旧单子压在一起，两道横几乎重叠。', { count: 'twelve' }, { money: 2500, mind: -1, flag: 'wu_wrote_twelve' }, { trust: 1 }),
        o('空着交上去', '你把单子交上去，那一栏空着。\n\n他看了一眼，没说好也没说不好，把单子塞进最下面。', { count: 'blank' }, { wit: 1, flag: 'wu_left_blank' }, { trust: -1 }),
        o('在备注里写“未清点”', '你写了三个字，写完把笔帽扣上。\n\n这一次他看了你很久，最后在经手人那一栏签了自己的名字。', { count: 'noted' }, { merit: 1, flag: 'wu_wrote_unchecked' }),
      ]],
    ['下次潮水',
      S => '一个月后，码头换了新的告示牌。\n\n上面写着“禁止夜间开箱”，落款下面还有一行更小的字。\n\n' + (S.flags.wu_saw_signature ? '你认得那行小字的笔迹。七年前那张装卸单上，也是这么写的。' : '你没有凑近看那行小字。潮水每天两次，箱子每天少一只。'),
      [
        o('留在码头，接着签单', '你签完一叠单子，把笔放回原处。\n\n第二天雾还是那么大，秤上换了一只箱子。', null, { money: 12000, flag: 'wu_stayed_dock' }, { end: '你留在U公司的码头上，继续一笔一笔签那些湿了的货单。' }),
        o('申请调去陆上的仓房', '调令下来得比想象中快。\n\n最后一天你把柜子清空，钥匙交回去，没有人问你为什么。', null, { money: 4000, mind: 1, flag: 'wu_moved_inland' }, { end: '你从U公司的码头调去了陆上的仓房，再没在夜里听过缆绳响。' }),
        o('把旧单子交上去', '你把那张单子放在值班室的桌上，用茶杯压住一角。\n\n后来没有人来找你问过湖上的事。', null, { wit: 1, mind: -1, flag: 'wu_handed_slip' }, { req: { flag: 'wu_saw_signature' }, end: '你把那张泡烂的装卸单交了上去，之后没有人再问过湖上的事。' }),
      ]],
  ]);

  // ============ 故事包 2：H公司 族谱的边（鸿园） ============
  // 既有批次已占用 h_garden 这个剧情包 id，此处改用 h_garden2，避免重复注册。
  p({ id: 'h_garden2', pack: 'B11', title: '族谱的边', route: 'wing_H', person: 'h_garden_keeper', theme: '规矩', age: [20, 58], sources: ['S18'] }, [
    ['一份要抄的族谱',
      '鸿园东厢腾出一张桌子，让你抄一份族谱。\n\n第一页是家主那一支，纸比别处厚。\n\n原稿上有两行被墨涂掉了，涂得很厚，纸背却还能摸到字。\n\n管园子的人说：“照着能看见的抄。”',
      [
        o('只抄没被涂的', '你抄到第三页，手腕开始酸。\n\n涂掉的那两行你没有看第二眼，交上去时他一页一页对着光看过。', { copy: 'clean' }, { money: 3000, flag: 'wh_copied_clean' }, { trust: 1 }),
        c('把涂掉的两行也抄上', 'wit', 47,
          o('纸背的字认得出来。', '你照着纸背描下那两行，字很淡。\n\n交上去时他停在那一页，手指按在纸上，很久没有动。', { copy: 'all' }, { wit: 2, flag: 'wh_copied_all' }),
          o('墨透了，你抄错一个字。', '他把那一页抽出来，没有责备，只说“重抄”。\n\n重抄的纸比原来的厚，涂掉的那两行被裁掉了。', { copy: 'wrong' }, { mind: -2, flag: 'wh_copy_wrong' }), { trust: -1 }),
        o('说这活自己干不了', '他把原稿合上，用一块蓝布包好。\n\n“干不了也好。”他说，“这园子里，抄错一个字比不抄麻烦。”', { copy: 'refused' }, { mind: 1, flag: 'wh_refused_copy' }, { goto: 3 }),
      ]],
    ['不能碰的那一件',
      '侧厅的多宝格上摆着一只白瓷瓶，瓶口朝下扣着。\n\n规矩是不擦、不挪、不指。\n\n管事的把抹布塞给你：“落灰了，趁人不在，挪开擦一擦。”',
      [
        o('把抹布还回去', '你说这瓶子不能动。\n\n管事自己搬了凳子，站上去擦，擦完把瓶放回原处。\n\n木面上留着一圈没有擦掉的印。', { vase: 'refused' }, { mind: 1, flag: 'wh_refused_dust' }),
        c('戴手套挪开一角', 'body', 46,
          o('瓶底是干的。', '你擦完放回去，瓶口仍然朝下。\n\n手套上沾了一点白粉，洗了两遍才掉。', { vase: 'moved' }, { body: 1, flag: 'wh_moved_dust' }),
          o('瓶口磕在格子上。', '声音不大。缺口在里侧。\n\n你把那一面转向墙，抹布盖在上面。', { vase: 'chipped' }, { mind: -3, flag: 'wh_chipped_dust' })),
        o('去问管园子的人', '他在账房里，听完只说：“这园子里，动过的东西都记在册上。”\n\n然后让你回去，把门带上。', { vase: 'asked' }, { wit: 1, flag: 'wh_asked_dust' }, { goto: 4 }),
      ]],
    ['当作没看见',
      '夜里从库房出来，有个人抱着东西从侧门出去。\n\n布包经过廊下时碰响了一声。\n\n管园子的人站在廊柱后面，对你摇了摇头。',
      [
        o('点头，回屋', '你把门关上，插好门闩。\n\n第二天早上，侧门的门闩断在地上，断口很新。\n\n月底的赏钱多了一小叠，没有人说明。', { night: 'blind' }, { money: 2000, mind: -1, flag: 'wh_looked_away' }, { trust: 1 }),
        c('问那是什么', 'social', 46,
          o('他答得很慢。', '“园子里的旧东西。”\n\n他说完就走开了，没有让你跟。\n\n布包上的结是活结，一拉就开。', { night: 'asked' }, { wit: 2, flag: 'wh_asked_night' }),
          o('他反问你看见了什么。', '你说没看清。\n\n他盯了你一会儿，说“那就好”。\n\n第二天，那个人没有再来上工。', { night: 'counter' }, { mind: -3, flag: 'wh_questioned_night' }), { trust: -1 }),
        o('在墙上划一道，记下时间', '你回屋用指甲在墙上划了一道。\n\n第二天那道痕还在。\n\n侧门换了新锁，旧锁没有扔，挂在门房墙上。', { night: 'marked' }, { wit: 1, flag: 'wh_marked_night' }, { goto: 4 }),
      ]],
    ['门房的本子',
      '门房的本子摊在桌上，昨夜子时那一栏空着。\n\n管园子的人把笔递给你：“写你的名字，写出去拿药。”\n\n你昨夜没有出去。',
      [
        o('写下自己的名字', '你写了。\n\n字落在纸上以后，他拿本子去对另一本册子，两本对得上。', { gate: 'signed' }, { money: 4000, mind: -1, flag: 'wh_signed_gate' }, { trust: 1 }),
        o('把笔放下', '“我不在。”\n\n他看了你一会儿，把本子合上，说改天再问。\n\n后来他没有再问。', { gate: 'refused' }, { mind: 1, flag: 'wh_refused_gate' }, { trust: -1 }),
        o('问昨夜出去的是谁', '他没有回答，只把那一页撕了下来，折成很小的一块。\n\n纸角从他指缝里露出来，上面有一个墨点。', { gate: 'asked' }, { wit: 1, flag: 'wh_asked_gate' }),
      ]],
    ['裁掉的一页',
      S => '族谱抄完之后，贾家的原稿要在园子里烧掉。\n\n' + (S.flags.wh_copied_all ? '你抄过的那两行，就在你要交的那一叠里。' : '你交上去的那一叠，比原稿薄。') + '\n\n管园子的人把火盆端出来，让你自己放进去。',
      [
        o('把纸放进火盆', '纸边先卷起来，字一个一个变黑。\n\n烧完他用水把灰浇透，灰里还有一小块没有烧干净的纸角。', { burn: 'burned' }, { money: 2000, flag: 'wh_burned_copy' }, { trust: 1 }),
        c('抽回一页', 'wit', 49,
          o('火盆里的纸少了一张。', '你把抽出来的那页塞进袖子，火盆里的纸照样烧完。\n\n他看了一眼灰，没有数。', { burn: 'kept' }, { wit: 2, flag: 'wh_kept_page' }),
          o('他看见了。', '他伸手的时候，纸角已经烧着了。\n\n他从火里把纸抢出来，踩灭，然后让你出去。', { burn: 'caught' }, { body: -2, mind: -2, flag: 'wh_caught_page' }), { trust: -1 }),
        o('问他能不能不烧', '他没有答，把火盆往你面前推了一寸。\n\n火苗照着他的手，手背上有一道旧疤。', { burn: 'asked' }, { mind: -1, flag: 'wh_asked_burn' }),
      ]],
    ['半年后',
      S => (S.flags.wh_kept_page ? '半年后，你收拾柜子，那页纸还在夹层里。\n\n纸上的字淡了，边上有一点焦黄。' : '半年后，园子里的巷子重新铺过一遍。\n\n侧厅的多宝格换了位置，白瓷瓶不在上面了。') + '\n\n' + (S.flags.wh_signed_gate ? '门房的册子里，你的名字还在那一页上。' : '门房的册子换了新的，旧的不知道收到哪里去了。'),
      [
        o('留在园子里，接着抄写', '新的一份原稿又抬进来，纸比上次的更旧。\n\n你磨好墨，先看了看有没有涂掉的地方。', null, { money: 9000, flag: 'wh_stayed' }, { end: '你留在鸿园，接着抄那些总有两行被涂掉的纸。' }),
        o('求个外院的差事', '管园子的人看了你一会儿，在你的名字后面画了一个圈。\n\n你搬去外院，内院的钥匙收了回去。', null, { money: 3000, mind: 1, flag: 'wh_outer' }, { end: '你从鸿园的内院调去了外院，夜里不再走那条廊子。' }),
        o('辞了这份差事', '你把抄好的纸码齐，压在镇纸下面。\n\n出门时门房没有拦你，只问了一句要不要叫车。', null, { money: -1000, mind: 2, flag: 'wh_left_garden' }, { end: '你辞了鸿园的差事，出门时没有回头看一眼那座园子。' }),
      ]],
  ]);

  // ============ 故事包 3：L公司 本班产出（地下层） ============
  p({ id: 'l_light', pack: 'B11', title: '本班产出', route: 'wing_L', person: 'l_shift_lead', theme: '工作', age: [18, 50], sources: ['S16'] }, [
    ['本班产出',
      S => '交接单摊在桌上，本班产出那一栏空着。\n\n上面一栏是“异想体：无异常”，勾已经被人打好了。\n\n' + NM(S, 'l_shift_lead') + '把上一班的单子压在旁边：“照这个数抄，表还没有归零。”\n\n上一班的数比前几班都高。',
      [
        o('照抄', '你抄完，把两张单子叠在一起。\n\n数字一模一样，连他写歪的那个零也一样。', { sheet: 'copied' }, { money: 2500, flag: 'wl2_copied_output' }, { trust: 1 }),
        c('去配电间自己看表', 'wit', 46,
          o('表比单子低。', '你抄下真实读数，回来重新填。\n\n他看了一眼，划掉，又填回原来的数。', { sheet: 'meter' }, { wit: 2, flag: 'wl2_saw_meter' }),
          o('配电间的门锁着。', '你贴着门听了一会儿，里面的风扇在转，转得很慢。\n\n回来时单子已经被他填好了。', { sheet: 'locked' }, { mind: -2, flag: 'wl2_meter_locked' }), { trust: -1 }),
        o('问上一班的人呢', '“调走了。”\n\n他说完把笔帽扣上，像是这句话已经说过很多遍。', { sheet: 'asked' }, { wit: 1, flag: 'wl2_asked_prev' }, { goto: 3 }),
      ]],
    ['撕掉的那半张',
      '电梯口贴了一张新告示。\n\n“非本层人员不得在本层停留。”\n\n下面还有一行小字，被撕掉了一半，只剩“听见”和“不要”几个字。',
      [
        o('不看了，去交班', '你移开眼睛，按了下行的按钮。\n\n门关上前，那半行字还贴在原处。\n\n你在交班表上签了名，笔尖把那半行字划掉了。', { notice: 'ignored' }, { mind: -1, flag: 'wl2_ignored_note' }, { trust: 1 }),
        c('把剩下的字抠下来看', 'mind', 47,
          o('纸背还有一层字。', '撕掉的那半张后面压着上一版。\n\n上面写着“听见铃声，不要应”。\n\n你把两版都拍了下来。', { notice: 'read' }, { wit: 2, flag: 'wl2_read_note' }),
          o('纸一揭就碎。', '碎屑粘在指腹上。\n\n身后电梯叮了一声，回头时门已经开了。', { notice: 'torn' }, { mind: -3, flag: 'wl2_tore_note' })),
        o('去找贴告示的人', '行政的窗口关着，玻璃后面没有人。\n\n窗台上压着一卷胶带，撕口是新的。\n\n你把那半张纸的边角撕齐，放进口袋。', { notice: 'asked' }, { mind: -1, flag: 'wl2_took_scrap', queue: ['wl2_echo_notice', 7] }, { goto: 4 }),
      ]],
    ['地下的声音',
      '休息的时候，地板底下有人在敲。\n\n三下，停一停，再三下。\n\n和换班的铃声一个节奏。',
      [
        o('说是管道', '你说这是管道热胀冷缩。\n\n旁边的人跟着点头，没有人再说话。\n\n敲声一直跟到你们换班。', { sound: 'pipes' }, { mind: -1, flag: 'wl2_said_pipes' }, { trust: 1 }),
        o('跟着敲回去', '你蹲下，在同样的位置敲了三下。\n\n底下停了很久。\n\n然后换了另一种节奏，是你没有听过的。', { sound: 'answered' }, { mind: -3, flag: 'wl2_answered' }),
        o('换个地方休息', '你端着杯子去了走廊尽头。\n\n这一头听不见，只是地板也是热的。', { sound: 'moved' }, { body: 1, flag: 'wl2_moved_break' }, { goto: 4 }),
      ]],
    ['不要去的那一层',
      '电梯在某一层停下，门开了。\n\n外面没有灯，只有一辆手推车停在门口，车上放着一块夹板。\n\n按钮板上，这一层的数字被人用胶带盖住了。',
      [
        o('按关门', '门合上，电梯继续往下。\n\n到下一层时，夹板上的纸少了一张。', { floor: 'closed' }, { mind: -1, flag: 'wl2_closed_door' }, { trust: 1 }),
        c('把车推进来', 'body', 45,
          o('车很轻。', '你把它拉进电梯，夹板上的纸被风吹起来一角，是空的。\n\n门关上时，外面有人按了一下按钮。', { floor: 'pulled' }, { body: -1, wit: 1, flag: 'wl2_pulled_cart' }),
          o('车轮卡在门缝里。', '你用力一拽，车轮卡住，电梯门反复开了三次。\n\n第三次，门外站着一个人，穿着和你一样的制服。', { floor: 'stuck' }, { body: -3, mind: -3, flag: 'wl2_cart_stuck' })),
        o('按最近的一层出去', '你没有碰那辆车，按了上面一层。\n\n走出去的时候，走廊里很亮，亮得眼睛发酸。', { floor: 'left' }, { mind: 1, flag: 'wl2_left_floor' }, { goto: 5 }),
      ]],
    ['面板上的数',
      S => '本班结束前，面板上的产出数往上跳了一格。\n\n那时候没有人进过工作区，也没有人按过按钮。\n\n' + NM(S, 'l_shift_lead') + '让你把这一格也记上。',
      [
        o('记上', '你写了。\n\n数字刚好够这一班的定额，一分不多，一分不少。', { filled: 'wrote' }, { money: 3000, flag: 'wl2_logged_extra' }, { trust: 1 }),
        o('空着不写', '你把那一格留着，交上去。\n\n第二天早上，那一格被人用另一种笔迹补上了。', { filled: 'blank' }, { wit: 1, flag: 'wl2_left_gap' }),
        o('在备注里写“无人操作”', '你写了四个字。\n\n他看了很久，最后把单子折起来放进内袋，没有签字。', { filled: 'noted' }, { mind: 1, flag: 'wl2_wrote_unmanned' }),
      ]],
    ['门口的灯',
      S => '门口的灯还亮着，和来时一样。\n\n' + (S.flags.wl2_read_note ? '你记住了那半张告示上的字，没有对任何人说。' : '你没有再去揭那张告示。') + '\n\n换班的人从你身边过去，没有人抬头看那一层。',
      [
        o('接着上这个班', '你把工牌挂回胸前，走进更衣室。\n\n柜子里有一张新的排班表，你的名字还在原来的位置。', null, { money: 14000, flag: 'wl2_stayed' }, { end: '你继续在脑叶公司上班，照旧在交接单上填那些数。' }),
        o('申请调去地面上', '申请递上去，三个月后批了下来。\n\n最后一天你把柜子清空，工牌交回窗口，没有人和你握手。', null, { money: 5000, mind: 1, flag: 'wl2_transferred' }, { end: '你调离了脑叶公司的地下层，到地面上做一份看得见天的工作。' }),
        o('把最后一张单子留一份', '你把单子折好，塞进鞋垫底下。\n\n走出大门时，安检的灯没有响。', null, { wit: 1, mind: -1, flag: 'wl2_kept_sheet' }, { end: '你留下了一张交接单，上面有一格数字没有人能解释。' }),
      ]],
  ]);

  // ============ 12 个事件 ============
  C.addEvents('wings5', [
    // —— U公司：4 个 ——
    { id: 'wu_tide_mark', age: [20, 58], req: { job: 'wing', fn: S => S.vars.wg_route === 'U' }, w: 10, repeat: true, cd: 10,
      text: S => '退潮以后，石阶上留着一圈白印。\n\n比昨天的位置高了两指。\n\n' + NM(S, 'u_dock_clerk') + '蹲下看了一眼，站起来说：“今天不走这条道。”' },
    { id: 'wu_night_shift', age: [20, 58], req: { job: 'wing', fn: S => S.vars.wg_route === 'U' }, w: 9, repeat: true, cd: 10,
      text: '夜班的灯只开一半。\n\n湖面上有雾，雾里有船，船上的灯不亮。\n\n规矩是听见汽笛就数自己的步子，数到一百再停。\n\n今晚没有汽笛。' },
    { id: 'wu_extra_crate', age: [20, 58], req: { job: 'wing', fn: S => S.vars.wg_route === 'U' }, w: 10, title: '多出来的一只',
      text: '仓房门口多了一只木箱，箱盖上没有号。\n\n早班的人说不是他们的，晚班的人说没见过。\n\n箱子底下压着一张货单的角，字被水泡开了。',
      choices: [
        { t: '报给值班的人', eff: { merit: 1, flag: 'wu_logged_unclaimed' },
          r: '值班的人来得很慢。\n\n他把箱子翻过来看底，然后让你登记一只“无主”，签在备注栏。\n\n第二天那只箱子还在原处。' },
        { t: '撬开看看', check: { s: 'wit', dc: 47 },
          ok: { r: '箱里是空的，底上积着一层浅水。\n\n水里有半张纸，印着上个月的日期。', eff: { wit: 2, flag: 'wu_seen_empty_crate' } },
          no: { r: '你把箱盖撬开一条缝，水先流出来，漫过鞋面。\n\n当天下午你被调去搬空箱，手上的口子泡得发白。', eff: { body: -3, mind: -2, flag: 'wu_opened_alone' } } },
        { t: '推回水里，等下一班', eff: { mind: -2, flag: 'wu_pushed_crate', queue: ['wu_echo_crate', 6] },
          r: '箱子入水时几乎没有溅起水花。\n\n你数到十，它没有浮上来。\n\n第二天，秤上又摆着一只同样大小的空箱。' },
      ] },
    { id: 'wu_echo_crate', manual: true, age: [26, 90], req: { job: 'wing', fn: S => S.vars.wg_route === 'U' }, w: 1,
      text: '六年后，仓房翻修，工人从墙里搬出一只没有号的木箱。\n\n箱盖上用粉笔写着你的名字，字被水泡过又干了。\n\n没有人认领。',
      eff: { money: 2500, mind: -2, flag: 'wu_echo_found' } },

    // —— H公司：4 个 ——
    { id: 'wh_copy_line', age: [20, 58], req: { job: 'wing', fn: S => S.vars.wg_route === 'H' }, w: 10, repeat: true, cd: 11,
      text: '新送来一叠纸，最上面那页被裁掉一半。\n\n裁口很齐，剩下的半行是“以下不录”。\n\n你把纸翻过去，从背面开始抄。',
      eff: { mind: -1, flag: 'wh_saw_cut_page', queue: ['wh_echo_page', 5] } },
    { id: 'wh_echo_page', manual: true, age: [26, 90], req: { job: 'wing', fn: S => S.vars.wg_route === 'H' }, w: 1,
      text: '五年后，园子整修，工人从夹墙里清出一叠受潮的纸。\n\n摊在院里晒的时候，你认出其中一页是自己抄的。\n\n纸背上有一行很淡的铅笔字，不是你写的。',
      eff: { money: 1500, mind: -2, flag: 'wh_echo_page' } },

    // —— L公司：4 个 ——
    { id: 'wl2_blank', age: [18, 50], req: { job: 'wing', fn: S => S.vars.wg_route === 'L' }, w: 10, repeat: true, cd: 10,
      text: '交接单上有一栏“本班产出”，空着。\n\n上一班的数字写在旁边，比前几班都高。\n\n灯管闪了两下，你听见墙里有很轻的电流声。',
      eff: { mind: -1, flag: 'wl2_saw_blank', queue: ['wl2_echo_blank', 4] } },
    { id: 'wl2_echo_blank', manual: true, age: [22, 90], req: { job: 'wing', fn: S => S.vars.wg_route === 'L' }, w: 1,
      text: '四年后，你翻到一张旧交接单，是刚入职那年的。\n\n本班产出那一栏还是空的。\n\n背面有一行铅笔写的数字，比你现在填的高出很多。',
      eff: { mind: -1, money: 2000, flag: 'wl2_echo_blank' } },
    { id: 'wl2_echo_notice', manual: true, age: [26, 90], req: { job: 'wing', fn: S => S.vars.wg_route === 'L' }, w: 1,
      text: '七年后，那栋楼封了一半。\n\n新来的保安把旧告示一张张铲下来，堆在门口。\n\n你从纸堆里翻出半张，胶带还粘在上面。',
      eff: { mind: -2, wit: 1, flag: 'wl2_echo_notice' } },
  ]);
})();
