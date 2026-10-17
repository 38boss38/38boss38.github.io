/* 三个翼的岗位线（批次 B9）：K公司封装段的配额、T公司征收班的时数、W公司清扫班的清单。
 * 结构照 ev_stories_office2.js；写法照 docs/STYLE_REFERENCE.md。
 * 跨批次：读 wing 线已有的 wg_nda_signed（W公司那一包的一个追加选项）。
 * 注意：批次 C 的 ev_stories_wings.js 已经注册过剧情包 t_hours，addStory 撞名会直接抛错，
 * 所以这里保留原名，运行到重名时退回 t_hours_ledger。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const TID = C.STORIES && C.STORIES.t_hours ? 't_hours_ledger' : 't_hours';
  const reqK = { job: 'wing', fn: S => S.vars.wg_route === 'K' };
  const reqT = { job: 'wing', fn: S => S.vars.wg_route === 'T' };
  const reqW = { job: 'wing', fn: S => S.vars.wg_route === 'W' };

  // ============ 故事包 1：K公司封装段的配额 ============
  p({ id: 'k_quota', pack: 'B9', title: '少二十支', route: 'wing_K', person: 'k_line_lead', theme: '工作', age: [20, 58], sources: ['S15'] }, [
    ['当班的单子',
      '线长把当班的配额单按在台面上。\n\n三百支，下班前交，料只发了二百八。\n\n他说这是上个月的老数，让线上先干着。',
      [
        o('按实数报上去', '他听完没有抬头，把单子上的数字改成二百八。\n\n改完他说，这个数明天还会有人来问。', { count: 'real' }, { flag: 'wk_reported_real', merit: -1, mind: 1 }, { trust: 1 }),
        o('先签三百，等补料', '你签了名，月底多拿三千眼。补料的车到下午才来，晚了四十分钟。\n\n那四十分钟里，线上所有人都在等同一只空箱。', { count: 'signed' }, { money: 3000, mind: -1, flag: 'wk_signed_quota' }, { trust: -1 }),
        c('先查扣料记在哪一段', 'wit', 45,
          o('少的二十支记在上一班的报废里', '你对着交接本数到第三段，少的二十支记在上一班的报废里。\n\n报废单上的签名是别人的。', { count: 'traced' }, { wit: 2, flag: 'wk_found_shortfall' }, { trust: 1, goto: 2 }),
          o('只翻出两张一样的交接单', '你从头翻到尾，只翻出两张一模一样的交接单。\n\n线长把单子抽走，说这种事不归你管。', { count: 'blind' }, { mind: -1, flag: 'wk_lost_paper' }, { goto: 2 })),
      ]],
    ['报废的那一支',
      '第三段送来一支，外壁有一道裂，裂在标签底下。\n\n按规程，它该进报废箱。\n\n线长把笔递过来，笔尖朝着你。',
      [
        o('签字，进报废箱', '你把那一支放进箱子，标签朝下。\n\n箱子满了才封。封之前，没有人再打开看过。', { scrap: 'box' }, { merit: 1, flag: 'wk_scrapped_one' }, { trust: 1 }),
        o('送去复检', '那一支单独摆上台面。复检排到第二天，第二天它又回到了线上。\n\n裂还在。', { scrap: 'recheck' }, { wit: 1, flag: 'wk_rechecked' }, { goto: 3 }),
        c('对着灯看那道裂', 'wit', 48,
          o('裂只走到一半', '你把它翻过来对着灯，光没有透过去。\n\n你签了字，签得比平时慢。', { scrap: 'lit' }, { wit: 2, flag: 'wk_read_crack' }, { trust: 1 }),
          o('灯太暗，什么也看不清', '你举起又放下。线长替你签了，签的是你的名字。\n\n他的字比你写得好。', { scrap: 'signed_by_other' }, { mind: -2, flag: 'wk_other_signed' }, { trust: -1, goto: 3 })),
      ]],
    ['返工间',
      '上一班判废的整箱推回来，标签上写着“待返工”。\n\n返工间没有窗，四个人，一盏灯。\n\n清单上三十七支，箱子里三十八。',
      [
        o('照单全过一遍手', '三十八支你一支一支过。\n\n多出来的那一支被塞回箱底，标签上没有它。', { rework: 'all' }, { body: -2, flag: 'wk_extra_in_box' }, { trust: 1 }),
        o('把多的那支记在单子上', '你在清单末尾添了一行，写的是“多一支，来源不明”。\n\n月底这一行还在，没有人来问。', { rework: 'noted' }, { wit: 1, merit: -1, flag: 'wk_wrote_extra' }),
      ]],
    ['多出来的一支',
      S => NM(S, 'k_line_lead') + '在更衣室门口叫住你。\n\n“我女儿在楼下等着。”他说，“就一支。”\n\n他没说这一支记在谁头上。',
      [
        o('装作没看见', '你转身去关灯。出来的时候，他已经不在更衣室了。\n\n第二天报废单上多了一行，签的是你的名字。', { ampule: 'blind' }, { money: -3000, mind: -1, merit: -1, flag: 'wk_let_him_take' }, { trust: 1 }),
        o('报给当班的负责人', '负责人去了一趟更衣室。\n\n线长回来时抽屉是开着的。月底你多了一笔四千眼，名目写的是协助核查。他没有看你。', { ampule: 'reported' }, { money: 4000, merit: 2, social: -2, flag: 'wk_reported_lead' }, { trust: -3 }),
        c('让他走申领单', 'social', 48,
          o('单子三天后批下来了', '他愣了一会儿，把那一支放回台面。\n\n申领单要三天，加急要垫一千眼。三天后他拿到了，签收栏里写的是他女儿的名字。', { ampule: 'form' }, { flag: 'wk_form_granted', wit: 1, money: -1000 }, { trust: 2 }),
          o('他在门岗被拦下', '他把单子折了两折塞进工作服。\n\n那天夜里他被门岗拦下，搜出来的时候，那一支已经不在包装里。', { ampule: 'caught' }, { mind: -3, social: -1, flag: 'wk_ampule_caught' }, { trust: -2 })),
      ]],
    ['门口的人',
      '厂门口每天早上都有人等。\n\n他们不进厂，看见穿工作服的出来就往前一步。\n\n本地人说，被安瓿拉回来的人，走路会先迈同一条腿。',
      [
        o('从侧门走', '你绕到后门，多走七分钟。\n\n那七分钟里，没有人朝你走近一步。', { door: 'side' }, { body: -1, mind: 1, flag: 'wk_side_door' }),
        o('照常走正门', '有人拦住你，问今天有没有多的。\n\n你说没有。他说了声谢谢，退回去继续站着。', { door: 'front' }, { mind: -1, wit: 1, flag: 'wk_front_door' }),
      ]],
    ['第二年',
      S => (S.flags.wk_reported_lead ? '你报上去的那件事，最后写成了一张“内部调剂”。\n\n' : S.flags.wk_let_him_take ? '那张多出来的报废单，年底被翻出来重算过一次。\n\n' : '线上的人换了两个，机器的响声没有变。\n\n') + '第二年，配额单上的数字没有变过。\n\n新来的线长第一件事，是把报废箱的钥匙挂在自己腰上。',
      [
        o('把交接本继续写下去', '你把每一支的去向都写在那一栏。\n\n写满一本要一年。第二年，你换了个新本子。', null, { wit: 1, flag: 'wk_kept_book' }, { end: '你把每一支安瓿的去向都记在交接本上，一直记到换新本子。' }),
        o('争取调去复检那一段', '复检的灯比线上亮，工钱一个月多六千眼。\n\n你在那里学会看裂，也学会不把看见的说给每一个人听。', null, { merit: 1, skill: 1, money: 6000, flag: 'wk_moved_check' }, { end: '你调去了复检那一段，学会了对着灯看一道裂。' }),
        o('申请调出这条线', '手续办了一个月，走的时候结清八千眼。\n\n最后一个班，你把工牌交回去，背面还沾着一点干掉的药液。', null, { money: 8000, mind: 1, flag: 'wk_left_line' }, { end: '你调离了K公司这条生产线，工牌背面沾着一点干掉的药液。' }),
      ]],
  ]);

  // ============ 故事包 2：T公司征收班的时数 ============
  p({ id: TID, pack: 'B9', title: '多出来的四分钟', route: 'wing_T', person: 't_collector', theme: '工作', age: [20, 58], sources: ['S14'] }, [
    ['对不上的账',
      S => NM(S, 't_collector') + '把账簿推过来，翻到中间那一页。\n\n这个月的时数少了四分钟。\n\n“四分钟不算少。”他说，“算在谁头上才算。”',
      [
        o('记在自己那一栏', '你在自己名下添了四分钟。\n\n下班时街钟比你的表快四分钟，你多站了一会儿才走。', { gap: 'self' }, { mind: -1, merit: 1, flag: 'wt_paid_self' }, { trust: 1 }),
        o('往上一栏追', '你把上个月的账翻出来，一笔一笔对。\n\n对到第三户，天已经黑了。', { gap: 'chase' }, { body: -1, wit: 1, flag: 'wt_chased_gap' }),
        c('问那四分钟是从哪一段没的', 'social', 45,
          o('他说了等门那一段', '他想了很久，说那一段是在楼里等一个人开门。\n\n“等门不算工作。”他说这话时，手里还在算。', { gap: 'asked' }, { wit: 2, flag: 'wt_asked_gap' }, { trust: 1 }),
          o('他把账簿合上了', '他说这件事到此为止。\n\n第二天账簿换了一本新的，中间那一页没有抄过去。', { gap: 'closed' }, { mind: -2, flag: 'wt_book_replaced' }, { trust: -1, goto: 2 })),
      ]],
    ['三楼那户',
      '三楼那户欠了十一天。\n\n门开一条缝，里面在煮东西，蒸汽从缝里出来。\n\n“再等两天。”门里的人说。征收单上的日期是今天。',
      [
        o('按单收，不多说', '你把读数写进单子，门关上了。\n\n下楼时你听见那锅东西还在响。', { visit: 'strict' }, { money: 9000, merit: 1, social: -1, flag: 'wt_collected_hard' }),
        o('把自己的时数垫进去', '你按当月市价把这十一天买了下来，花了六千眼，单子上写“已清”。\n\n你没有告诉他自己垫了什么，他也没有问。', { visit: 'cover' }, { money: -6000, mind: 2, flag: 'wt_covered_debt' }, { trust: 1, goto: 3 }),
        c('先核读数再说话', 'wit', 50,
          o('读数比单上少了半天', '你改了单子，改完让他看了一眼。\n\n他看了很久，才把门开大一点。', { visit: 'checked' }, { wit: 2, flag: 'wt_reading_fixed' }, { trust: 1 }),
          o('两遍读数不一样', '门里的人说你们连自己的表都读不准，然后把门关上了。\n\n单子只能写“拒缴”。', { visit: 'failed' }, { mind: -2, flag: 'wt_refused_entry' }, { goto: 3 })),
      ]],
    ['负一层的核算室',
      S => '核算室在负一层，桌上只有一盏台灯。\n\n一叠单子摊开着，最长的那张只写了两个字：累计。\n\n' + NM(S, 't_collector') + '说，累计到一定的数，人就不来上班了。',
      [
        o('把累计那一栏核完', '你核到最后一页，合计和分项差了七分钟。\n\n这七分钟不属于任何一户。', { audit: 'done' }, { wit: 2, merit: 1, flag: 'wt_audit_done' }),
        o('只核自己经手的那几张', '你把自己那一叠抽出来，其余推回原处。\n\n推回去时，最上面那张滑了下来。', { audit: 'part' }, { mind: -1, flag: 'wt_audit_part' }),
        o('把差额写成技术调整', '你写完，把笔放下。\n\n这四个字在账上很常见，常见到没有人会为它多问一句。', { audit: 'adjust' }, { merit: 1, mind: -1, flag: 'wt_adjusted' }),
      ]],
    ['今天剩下的四分钟',
      S => '收工前，' + NM(S, 't_collector') + '问你今天的余数怎么算。\n\n余数是四分钟。\n\n“可以留给自己。”他说，“也可以交给下一班。”',
      [
        o('留给自己', '你在门口站了四分钟，什么也没做。\n\n四分钟里，街钟走过四格。', { spare: 'self' }, { mind: 2, wit: 1, flag: 'wt_kept_minutes' }, { trust: -1 }),
        o('交给下一班', '你在交接栏里写下四分钟，签了名。\n\n下一班的人不知道这四分钟是谁的。', { spare: 'next' }, { merit: 1, social: 1, flag: 'wt_gave_minutes' }, { trust: 2 }),
        c('问他这四分钟原来属于谁', 'social', 46,
          o('他解下了护手', '他把护手放在桌上，说这四分钟属于一个不再来上班的人。\n\n他没有说是哪一个。', { spare: 'asked' }, { wit: 2, flag: 'wt_asked_owner' }, { trust: 1 }),
          o('他说问得太晚', '他笑了一下，说这个问题问得太晚。\n\n“你算过账了，就该知道问不出名字。”', { spare: 'late' }, { mind: -2, flag: 'wt_asked_too_late' }, { trust: -1 })),
      ]],
    ['公告栏换了一张表',
      S => (S.flags.wt_covered_debt ? '垫过的那一户在楼下等你。\n\n' : '那户的门到月底都没有再开。\n\n') + '公告栏换了一张新表，表上有一栏叫“恢复”，字很小，用铅笔填。',
      [
        o('去看那一栏写了什么', '那一栏写着一个数，后面跟着一个日期。\n\n日期是今天。', { recover: 'seen' }, { wit: 1, mind: 1, flag: 'wt_saw_recover' }),
        o('不看，直接走过', '你从公告栏旁边过去，走了两步又停下来。\n\n停下来时，已经想不起自己为什么要停。', { recover: 'skip' }, { mind: -1, flag: 'wt_skipped_recover' }),
      ]],
    ['交上去的账',
      S => (S.flags.wt_audit_done ? '那七分钟的差额，最后写成一张单独的说明，附在账本后面。\n\n' : '账本照旧交上去，核账的人照旧往下翻。\n\n') + '第二年仪表换了新的，记录方式没有换。\n\n每条街上还是有人在等下一班来收。',
      [
        o('把余数一笔一笔写清', '你在每一张单子上都留了余数那一格。\n\n格子填满了，账上不再差那几分钟。', null, { wit: 1, mind: 1, flag: 'wt_kept_remainder' }, { end: '你把每一笔余数都写进单子，账上不再差那几分钟。' }),
        o('申请换一条街段', '调班批下来，你换了街段，一个月多七千眼。\n\n新街段的门更难敲，余数也更多。', null, { money: 7000, mind: -1, flag: 'wt_changed_beat' }, { end: '你换了一条街征收，那里的门更难敲，余数也更多。' }),
        o('照旧收，照旧交', '你每天按单上门，回来把账簿合上。\n\n合上之前，看一眼最后那一格。', null, { merit: 1, body: -1, flag: 'wt_kept_going' }, { end: '你照旧上门征收，每天合上账簿前看一眼最后那一格。' }),
      ]],
  ]);

  // ============ 故事包 3：W公司清扫班的清单 ============
  p({ id: 'w_clean', pack: 'B9', title: '不许外传的清单', route: 'wing_W', person: 'w_cleaner', theme: '工作', age: [20, 58], sources: ['S12'] }, [
    ['最后一节车厢',
      '最后一节车厢有三盏灯是坏的，剩下的那盏照不到尽头。\n\n按规程，清扫从车头开始，到车尾结束。\n\n今天车尾的座位是热的。',
      [
        o('照规程从车头扫起', '你一段一段往前推，推到最后一排，座位已经凉了。\n\n你没有掀开座垫。', { order: 'rule' }, { skill: 1, flag: 'ww_followed_rule' }),
        o('先去看最后一排', '座垫下面压着一张折过的票，票面日期是昨天。\n\n昨天这趟车还没有发。', { order: 'last' }, { wit: 1, flag: 'ww_ticket_found' }, { goto: 2 }),
        c('先确认这一节清空了没有', 'wit', 46,
          o('数了三遍都是零', '你在记录上写了“已清空”。\n\n签字的时候，手很稳。', { order: 'counted' }, { wit: 2, merit: 1, flag: 'ww_checked_empty' }),
          o('数到第二遍被打断', '车厢那头有声音。你回头看了一眼，再低头时已经不记得数到几。\n\n记录上写的是“已清空”。', { order: 'broken' }, { mind: -2, flag: 'ww_lost_count' }, { goto: 2 })),
      ]],
    ['座位底下的一只鞋',
      '邻座底下有一只鞋。\n\n鞋带还系着，鞋头朝着过道。\n\n规程写着：遗留物登记，交到车头的仓里，不许带走，不许拆开。',
      [
        o('登记，交到仓里', '你在单子上写了“鞋，一只”。\n\n仓里的人接过去，扔进一个没有编号的箱子。', { thing: 'logged' }, { merit: 1, flag: 'ww_logged_shoe' }),
        o('先看看里面有没有东西', '鞋里塞着一张对折的纸。\n\n纸上是手写的时刻表，比这趟车早两个小时。', { thing: 'looked' }, { wit: 2, mind: -1, flag: 'ww_paper_in_shoe' }),
        o('照原样留在原地', '你绕过去，扫完旁边那两排。\n\n收工时那只鞋还在，第二天不在了。', { thing: 'left' }, { mind: -1, flag: 'ww_left_shoe' }),
      ]],
    ['折成四折的单子',
      S => NM(S, 'w_cleaner') + '把一张单子折成四折塞给你。\n\n上面列着十一样东西，第十一行被划掉。\n\n“这一张不许带出车厢。”他说。',
      [
        o('当场看完再还给他', '你记住了前十样，和最后那一行的形状。\n\n最后一行只剩一道横线，画得很用力。', { list: 'read' }, { wit: 2, flag: 'ww_read_list' }, { trust: 1 }),
        o('把单子推回去', '他把单子收回去，说你这样最好。\n\n那天他一个人留到了最后。', { list: 'refused' }, { mind: 1, flag: 'ww_refused_list' }, { trust: -1 }),
        o('问那一行为什么划掉', '他看了你一会儿，说划掉的东西不算东西。\n\n说完把单子塞进自己的靴筒。', { list: 'asked' }, { mind: -1, flag: 'ww_asked_line' }, { trust: 1 }),
      ]],
    ['擦不掉的那一片',
      '车厢尽头的地板上有一片痕迹，擦不掉。\n\n培训里说过：遇到擦不掉的，封起来，报上去，不要描述。\n\n单子上只有一格：有无异常。',
      [
        o('在那一格写“无”', '你写完就封了。\n\n封条贴上去，那一片被压在玻璃纸底下，看上去像一块污点。\n\n当月津贴里多了六千眼。', { report: 'none' }, { merit: 1, money: 6000, flag: 'ww_wrote_none' }),
        c('把看见的写清楚', 'wit', 50,
          o('写了两行', '你写了位置和大小。\n\n单子交上去第三天，那一段被划进了检修区。', { report: 'clear' }, { wit: 2, merit: -1, flag: 'ww_wrote_clear' }),
          o('写到一半笔没水了', '换了一支笔以后，你已经不想再写一遍。\n\n交上去的那张，只有一个“有”字。', { report: 'half' }, { mind: -2, social: -1, flag: 'ww_wrote_half' })),
        o('报上去，要求检修', '检修的人隔着门看了一眼，说不是这一段。\n\n他走的时候，封条还贴在那里。', { report: 'ask' }, { social: 1, flag: 'ww_asked_inspect' }),
      ]],
    ['排班表上的空位',
      S => (S.flags.ww_read_list ? '那张单子上的前十样，后来陆续在仓里出现了。\n\n' : '那张单子你再没见到。\n\n') + NM(S, 'w_cleaner') + '说，下一班车尾没人接。\n\n“你要接，夜补归你。”他说，“不接，就空着。”',
      [
        o('接下夜班的车尾', '夜补八千眼当天就记在你名下。\n\n车尾的灯还是那三盏坏的，座位已经凉了。', { tail: 'take' }, { money: 8000, body: -2, flag: 'ww_took_tail' }, { trust: 1 }),
        o('不接，让他自己排', '他把排班表往墙上一按，说那就空着。\n\n第二天那一格写了别人的名字，字很小，像是补上去的。\n\n夜补没有记在你名下。', { tail: 'left' }, { mind: -1, flag: 'ww_left_tail' }, { trust: -2 }),
        o('问他那个人到底去哪了', '他看着排班表，说调走了。\n\n说完把手从表上拿开，那个空位还在。', { tail: 'asked' }, { wit: 1, mind: -1, flag: 'ww_asked_where' }, { trust: 1 }),
      ]],
    ['下一班的车',
      S => (S.flags.ww_wrote_clear ? '那一段检修了半个月，重新开放时地板换过。\n\n' : S.flags.ww_wrote_none ? '那张封条一直贴到你离开那一节。\n\n' : '车厢照常编组，照常发车。\n\n') + '新来的清扫人员问你，最后那几节为什么不排班。\n\n你说不知道。他把问题收回去了。',
      [
        o('把规程抄一份给自己', '你抄在工具袋内侧，抄到“不许描述”那一条停了一下。\n\n还是抄完了。', null, { wit: 1, flag: 'ww_kept_rules' }, { end: '你把清扫规程抄了一份，留在工具袋内侧。' }),
        o('照着问，不再往下问', '新来的人再问起，你就说那几节不归我们。\n\n他点点头，把问题收起来。', null, { mind: -1, social: 1, flag: 'ww_passed_question' }, { end: '你学会了把那几节车厢的问题原样收起来。' }),
        o('自己去找那张清单', '你在仓里翻到第三只箱子，箱子上没有编号。\n\n里面是空的，底下压着一张折成四折的纸。', null, { wit: 2, mind: -2, flag: 'ww_found_box' }, { end: '你在没有编号的箱子里找到一张折成四折的纸。' }),
      ]],
  ]);

  // ============ 12 个事件（另加 4 个 manual 后续） ============
  C.addEvents('wings3', [
    // —— 4 个无选项 ——
    { id: 'wk_tray_ring', age: [20, 58], req: reqK, w: 10, repeat: true, cd: 12,
      text: '托盘上洒过一点药液，没有人擦。\n\n干了以后留下一个白圈，圈里比托盘干净。\n\n交接的时候，两边的人都绕着那个圈放东西。' },
    { id: 'wt_clock_minutes', age: [20, 58], req: reqT, w: 10, repeat: true, cd: 12,
      text: '街钟和你的表差两分钟。\n\n你按街钟上班，按自己的表算下班。\n\n这两分钟一直在，没有人来对过。' },
    { id: 'ww_glove_single', age: [20, 58], req: reqW, w: 10, repeat: true, cd: 12,
      text: '手套发下来是一双，用久了只有一只合手。\n\n另一只你塞在工具袋最底下。\n\n规程没有写单只手套该怎么报废。' },
    { id: 'ww_light_flicker', age: [20, 58], req: reqW, w: 9, repeat: true, cd: 13,
      text: '车厢里有一盏灯闪得很规律。\n\n一闪，一停，再闪。\n\n你扫到那一节的时候，它会多停两秒，像在等你走过去。' },

    // —— 4 个带选项 ——
    { id: 'wk_extra_quota', age: [20, 58], req: reqK, w: 10, title: '再加二十支',
      text: '下午三点，线长又推来一张单子。\n\n“这一批加二十支。”他说，“今天的机会。”\n\n线上的灯亮了一整天，有一个人的手一直在抖。',
      choices: [
        { t: '接下来，排到下一班', eff: { money: 6000, body: -3, merit: 1, flag: 'wk_took_extra_run' },
          r: '二十支在收工前做完了，加班费六千眼当天记上。\n\n最后几支封口不齐，你没有再看第二遍。' },
        { t: '说做不完', eff: { mind: 1, merit: -1, flag: 'wk_said_no' },
          r: '线长把单子折起来塞进口袋。\n\n那二十支由夜班补上。夜班比你少两个人。' },
        { t: '先去看那个手抖的人', check: { s: 'social', dc: 44 },
          ok: { r: '他把手伸出来，指头在抖，停不下来。\n\n线长看了一眼，把二十支改成十支。', eff: { social: 1, mind: 2, flag: 'wk_ten_instead' } },
          no: { r: '他说没事，把手插进兜里。\n\n半小时后那台机器停了，是他的手卡在了里面。', eff: { body: -2, mind: -3, flag: 'wk_hand_caught' } } },
      ] },
    { id: 'wk_rework_box', age: [20, 58], req: reqK, w: 9, title: '没有签名的封条',
      text: '返工的那一箱推回来了，箱口的封条换过。\n\n清单上写着“已处理”，后面没有签名。\n\n照规矩，没有签名的箱子不能上线。',
      choices: [
        { t: '退回去，要一个签名', eff: { money: -1000, merit: 1, flag: 'wk_sent_back' },
          r: '箱子在门口放了三天，退回的运费一千眼记在你这一班。\n\n第三天它又回来了，封条上是同一个记号，还是没有名字。' },
        { t: '自己签，先上线', eff: { money: 5000, mind: -2, flag: 'wk_signed_no_name' },
          r: '你签了，当月的产量奖五千眼照发。那一批的报废率比平时高一成。\n\n一成没有人来问。' },
        { t: '打开数一遍再上线', check: { s: 'wit', dc: 46 },
          ok: { r: '三十七支，和清单一样。\n\n数到第三十六支时你停了一下，那一支的标签贴反了。', eff: { wit: 2, flag: 'wk_counted_box' } },
          no: { r: '数到一半，线长过来把箱子推走了。\n\n“都这个点了。”他说。你手里还剩三支没数。', eff: { mind: -1, flag: 'wk_count_cut' } } },
      ] },
    { id: 'wt_ledger_gap', age: [20, 58], req: reqT, w: 10, title: '差四分钟',
      text: '这个月的账核到最后一页，差了四分钟。\n\n四分钟不够一户，不够一趟路，也不够一次申诉。\n\n账本明天早上要交上去。',
      choices: [
        { t: '在自己那一栏扣掉', eff: { mind: -2, merit: 1, flag: 'wt_filled_self' },
          r: '你在自己名下写了“补足”。\n\n交上去时，核账的人往下看了一眼，没有说什么。' },
        { t: '照实写差额四分钟', eff: { merit: -1, wit: 1, money: -2000, flag: 'wt_wrote_gap' },
          r: '单子退回来时，上面多了一行红字：请补足后重交。\n\n你补了，扣掉两千眼，红字还在。' },
        { t: '去查那四分钟落在哪一户', check: { s: 'wit', dc: 48 },
          ok: { r: '查到第三户，那一段被记了两次。\n\n第四分钟在下一页，是撕掉的那一天留下的。', eff: { wit: 2, flag: 'wt_found_gap' } },
          no: { r: '你把三个月的账翻了一遍，只翻出一张没盖章的收据。\n\n第二天账本照旧交上去，差额还是四分钟。', eff: { mind: -2, flag: 'wt_gap_unfound' } } },
      ] },
    { id: 'ww_hand_case', age: [20, 58], req: reqW, w: 9, title: '座位上的一只手提箱',
      text: '收尾的那一节，座位上留着一只手提箱。\n\n箱子没有锁，只扣着。\n\n规程写的是登记、上交，不许打开。车厢的钟已经走到交班的点了。',
      choices: [
        { t: '登记，搬到车头', eff: { merit: 1, body: -2, flag: 'ww_carried_case' },
          r: '箱子比看上去重，搬完手心出了一层汗。\n\n仓里的人只问了一句锁着没有，你说扣着。' },
        { t: '先打开看一眼', check: { s: 'mind', dc: 46 },
          ok: { r: '里面是一叠没拆的票，最上面那张写着今天的日期。\n\n你把箱子扣回去，标签贴得比刚才正。', eff: { wit: 1, mind: -1, flag: 'ww_saw_tickets' } },
          no: { r: '扣子弹起来，箱盖砸在扶手上。\n\n里面的东西散了一地，等你收好，已经分不清原来的位置。', eff: { mind: -3, flag: 'ww_spilled_case' } } },
        { t: '交班时写无遗留', eff: { mind: -2, money: 3000, flag: 'ww_wrote_no_item' },
          r: '你按规程锁上那一节的车门。\n\n第二天早上箱子不在座位上了，单子上也没有它。津贴照发，三千眼。' },
      ] },

    // —— 4 组跨年回响 ——
    { id: 'wk_seal_pocket', age: [20, 58], req: reqK, w: 8, title: '工具袋里的那一支',
      text: '下班前，你在工具袋里摸到一支安瓿。\n\n是白天从报废箱边上滚下来的，封口完好。\n\n工牌还在胸前，门岗在二十米外。',
      choices: [
        { t: '放回去，把袋子翻个底', eff: { queue: ['wk_seal_back', 4], mind: 1, flag: 'wk_returned_ampule' },
          r: '你把那一支放回报废箱，放得很靠里。\n\n出门时门岗只看了工牌，没有看袋子。' },
        { t: '带出去', eff: { queue: ['wk_seal_back', 4], mind: -2, flag: 'wk_took_ampule' },
          r: '门岗拦了一下，看的是你后面那个人。\n\n你把袋子换到另一只手里，走了出去。' },
      ] },
    { id: 'wk_seal_back', manual: true, age: [24, 75], req: reqK, w: 1,
      text: '四年后，巷子里的墙上挂着一只安瓿的空壳，被人当成了装饰。\n\n里面的东西早没了，标签还在。\n\n你认得那个标签的排版，那不是外面买得到的那种。',
      eff: { mind: -1, flag: 'wk_ampule_wall' } },

    { id: 'wt_borrow_six', age: [20, 58], req: reqT, w: 8, title: '借六分钟',
      text: '仪器上还剩六分钟的余量。\n\n同事说可以先把这六分钟记在你名下，明天再还。\n\n明天你的班表上本来就没有空。',
      choices: [
        { t: '记在自己名下', eff: { queue: ['wt_minute_back', 5], mind: -1, flag: 'wt_borrowed_self' },
          r: '你签了字。\n\n那天回家的路上，你走得比平时快一点，说不上为什么。' },
        { t: '不借，按实际读数交', eff: { queue: ['wt_minute_back', 5], merit: -1, flag: 'wt_refused_borrow' },
          r: '他叹了口气，把六分钟划掉。\n\n这一户的单子上写的是“未清”。' },
      ] },
    { id: 'wt_minute_back', manual: true, age: [24, 75], req: reqT, w: 1,
      text: '五年后，你在一本旧账簿里又看见那六分钟。\n\n它被记在一栏叫“待还”的下面，后面跟着你的名字，字不是你写的。\n\n那一页的纸已经发黄。',
      eff: { mind: -2, flag: 'wt_six_found' } },

    { id: 'wt_four_days', age: [20, 58], req: reqT, w: 8, title: '一个月里的四天',
      text: '排班表贴在墙上，一个月里有四天是自己的。\n\n这四天被红笔圈过，圈是上一个人画的。\n\n新表发下来，红圈还在原来的位置。',
      choices: [
        { t: '在红圈里请一天假', eff: { queue: ['wt_week_back', 6], money: -4000, mind: 2, flag: 'wt_asked_day' },
          r: '假批下来了，当月的补时扣掉四千眼。\n\n那一天你在家里坐了很久，什么也没做。' },
        { t: '把红圈划掉', eff: { queue: ['wt_week_back', 6], merit: 1, mind: -1, flag: 'wt_erased_red' },
          r: '你用黑笔把四个圈全划了。\n\n组长看了一眼，说这样也好，省得有人误会。' },
      ] },
    { id: 'wt_week_back', manual: true, age: [24, 75], req: reqT, w: 1,
      text: '六年后，那面墙重新粉刷过。\n\n排班表还在原来的位置，红笔的圈换成了打印的方框。\n\n方框里没有日期，只有一行小字：按需调整。',
      eff: { mind: -1, flag: 'wt_printed_box' } },

    { id: 'ww_list_kept', age: [20, 58], req: reqW, w: 8, title: '抄下来的那几行',
      text: '那张单子在工具箱里放了三天。\n\n你抄了前十样，最后那一行没有抄。\n\n第四天，组长问有没有人动过那张单子。',
      choices: [
        { t: '把抄的那一页交出去', eff: { queue: ['ww_list_back', 5], merit: 1, mind: -2, flag: 'ww_gave_copy' },
          r: '组长把纸对折，再对折，塞进内袋。\n\n“这件事到这里。”他说。他没有说哪件事。' },
        { t: '说没有动过', eff: { queue: ['ww_list_back', 5], money: 5000, mind: -1, flag: 'ww_denied_copy' },
          r: '他看了你一眼，没有追问。\n\n那周的班表上你多排了两趟车尾，车尾津贴五千眼。' },
        { t: '翻出保密协议那一页', req: { flag: 'wg_nda_signed' }, eff: { queue: ['ww_list_back', 5], mind: 1, flag: 'ww_showed_nda' },
          r: '你把那一页摊在工具箱上。\n\n组长读了两遍，说按上面写的办。上面写的是不许外传，没有写不许问。' },
      ] },
    { id: 'ww_list_back', manual: true, age: [24, 75], req: reqW, w: 1,
      text: '五年后，车尾那几节重新编了号，原来的一节改成了两节。\n\n新的编号里没有十一。\n\n你在单子上写“已清空”，写完看了一眼那个空号。',
      eff: { mind: -1, flag: 'ww_number_gone' } },
  ]);
})();
