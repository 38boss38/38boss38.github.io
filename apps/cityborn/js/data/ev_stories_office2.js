/* 事务所（批次 5）：自营代表的账、带新人的代价。两个故事包 + 18 个事件。
 * 跨批次咬合：读工坊线的 kept_serials / lied_to_fixer，读诊所线的 clinic_lied。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  // ============ 故事包 1：自营事务所的账（owner） ============
  p({ id: 'office_ledger', pack: 'B8', title: '押金', route: 'owner', person: 'partner_su', theme: '生计', age: [22, 60], sources: ['S02'] }, [
    ['押金',
      S => '房东把新租约推过来，押金那一栏是去年的两倍。\n\n' + NM(S, 'partner_su') + '把账本摊在中间，最后一页只剩三行，最下面一行画了一道横。\n\n“这个月只够付一个人的工钱。”他说，“你签还是我签？”',
      [
        o('先把自己的装备抵出去', '你把那把用了六年的刀留在当铺，换回的钱刚好补上差额。\n\n回来时苏看了你一眼，说“下个月赎”。\n\n他没有说下个月的钱从哪儿来。', { money: 'kept' , pledge: 'weapon' }, { money: -8000, flag: 'of_pledged_weapon', skill: -1 }),
        o('去借', '借钱的地方在巷子最里面，柜台很高。\n\n签完字，对方把一张小纸条塞进你口袋，上面只写了一个日期。', { money: 'borrowed', debt: true }, { money: 15000, flag: ['of_borrowed', 'debt'], mind: -2 }),
        o('裁掉一个人', '名单上有三个人，你划掉了那个刚来两个月的。\n\n他收拾东西的时候一直说“没事”，说了四遍。', { money: 'cut', cut: true }, { money: 9000, social: -2, mind: -3, flag: 'of_cut_junior' }, { goto: 2 }),
      ]],
    ['尾款',
      '委托人是个有头脸的人，尾款拖了三个月。\n\n每次去，门房都说“先生不在”。\n\n账本上这一笔已经被苏用红笔圈过两次。',
      [
        o('第三次上门，坐在门口不走', '你从下午坐到天黑。\n\n门房最后端了一杯水出来，说先生明天见你。\n\n明天他确实见了你，也给了钱，只是下不为例。', { tail: 'sit' }, { money: 20000, body: -2, flag: 'of_sat_door' }, { trust: 1 }),
        c('走协会的投诉流程', 'social', 46,
          o('协会的人收了材料', '受理单上盖了一个章，说十五个工作日。\n\n第十二天，尾款到了，少了一成，附一句“手续费”。', { tail: 'guild' }, { money: 18000, wit: 2, flag: 'of_guild_claim' }),
          o('材料被退回', '退回的理由是“缺少委托结束的书面确认”。\n\n那份确认从来没给过你。', { tail: 'guild' }, { mind: -2, flag: 'of_guild_refused' })),
        o('认了，当这单没做', '苏把红圈划掉，在旁边写了个很小的“损”。\n\n那三个月的账，事务所自己扛。', { tail: 'drop' }, { mind: -2, money: -4000 }),
      ]],
    ['不干净的活',
      '有人出三倍的价钱，说要把一件东西“拿回来”。\n\n“别问是谁的。”他把订金摆在桌上，压着一张写了地址的纸。\n\n地址在这一区，门牌号是三位数。',
      [
        o('接，但先问清是什么', '他笑了，说“问了就不止三倍”。\n\n订金留下了，人走了。\n\n苏把订金数了两遍，说这钱不能花。', { job: 'ask' }, { money: 12000, wit: 1, flag: 'of_asked_job' }),
        o('接，不问', '你按地址去了。\n\n东西在一只没上锁的抽屉里，拿的时候抽屉里还有一张全家照。\n\n你把它摆回原位。', { job: 'take' }, { money: 36000, mind: -3, flag: 'of_took_job' }),
        o('转给别家', '你介绍了两个人，第一个听完价就走了，第二个接了。\n\n三天后你听说那家的门被泼了东西。', { job: 'pass' }, { money: 3000, social: -1, flag: 'of_passed_job' }),
      ]],
    ['苏',
      S => NM(S, 'partner_su') + '把账本合上，手一直按在上面。\n\n“我妹妹要动手术。”他说，“我那一份，我想拿走。”\n\n那笔钱正好是下个月的押金。',
      [
        o('给他，事务所先撑着', '他数完钱，把账本推给你，翻开到新的一页。\n\n“下一笔我记在最后。”\n\n他走的时候没有带走椅子上的外套。', { su: 'paid' }, { money: -20000, mind: 2, flag: 'of_paid_su' }, { trust: 2 }),
        o('让他等一个月', '他点点头，把账本放回原位。\n\n那个月他来得比谁都早，走得比谁都晚。\n\n月底他妹妹的病历放在桌上，没有打开。', { su: 'wait' }, { mind: -2, flag: 'of_made_su_wait' }, { trust: -1 }),
        o('问他能不能只拿一半', '他的手在账本上停了一会儿。\n\n“一半不够。”\n\n他还是拿了一半。', { su: 'half' }, { money: -10000, mind: -1, flag: 'of_half_su' }),
      ]],
    ['招牌',
      S => (S.flags.of_paid_su ? '一年后，事务所的招牌换了新的，底漆是苏自己刷的。' : '一年后，事务所还在原来的位置，招牌没有换，只是把“事务所”三个字重新描过。') + '\n\n房东来收租时多问了一句：还开得下去吗。\n\n你说开得下去。他说那就好，下个月涨。',
      [
        o('接着开，把价钱往上提', '你把委托的报价改了一张纸。\n\n来的客人少了一半，剩下的一半付得比以前痛快。', null, { money: 18000, mind: -1, flag: 'of_raised_price' }, { end: '你把事务所的报价提了上去，接活的人少了一半。' }),
        o('接着开，不涨价', '你把旧价目表贴在门上，纸角用胶带压了四层。\n\n每天有人来问，多半只是来问。', null, { money: 9000, social: 2, flag: 'of_kept_price' }, { end: '你把旧价目表贴在门上，一直没换。' }),
        o('关掉，把钥匙交回去', '你把钥匙放在房东手里。\n\n他掂了掂，说这锁该换了。\n\n苏的那本账你留着，最后一页还是空白的。', null, { mind: -2, flag: 'of_closed' }, { end: '你关掉了自己的事务所，留下的只有苏那本没写完的账。' }),
      ]],
  ]);

  // ============ 故事包 2：你带的新人（office） ============
  p({ id: 'office_junior', pack: 'B8', title: '他第一天', route: 'office', person: 'junior_he', theme: '人情', age: [22, 58], sources: ['S02'] }, [
    ['他第一天',
      S => '新人叫' + NM(S, 'junior_he') + '，十九岁，进来时把自己的刀用布裹着，抱在怀里。\n\n代表让你带他，说“先看三个月”。\n\n他问你第一个问题是：事务所的委托，会不会有写错地址的那种。',
      [
        o('照实告诉他', '他听完，把布解开，刀放在桌上。\n\n“那我记着。”\n\n他记得很认真，认真地让你有点后悔说了。', { taught: 'true' }, { wit: 1, flag: 'of_told_truth' }, { trust: 1 }),
        o('说先跟着看，别问这么多', '他点点头，把刀重新裹上。\n\n之后三天他没再问过任何问题，连午饭吃什么都不问。', { taught: 'quiet' }, { mind: -1 }, { trust: -1 }),
        o('反问他为什么这么问', '他愣了一下，说自己以前给人送过信，送错过一次。\n\n“那家后来搬走了。”', { taught: 'ask' }, { wit: 1, flag: 'of_knew_his_past' }, { trust: 2 }),
      ]],
    ['他搞砸了',
      '第一次单独跑委托，他回来时手在抖。\n\n委托人投诉：东西拿错了，人也惊了。\n\n代表把投诉单放在你桌上，说“你带的人”。',
      [
        o('替他顶下来', '你说是自己交代错了。\n\n代表看了你一会儿，把投诉单收进抽屉。\n\n{junior_he}站在门外，一直站到你出来。', { cover: 'self' }, { money: -6000, mind: -1, flag: 'of_covered_junior' }, { trust: 2 }),
        o('让他自己去解释', '他进去了二十分钟，出来时眼睛是红的。\n\n“说完了。”他说，“扣三个月。”\n\n他照常来上班，只是不再走正门。', { cover: 'him' }, { mind: -1, flag: 'of_made_him_face' }, { trust: 1 }),
        c('先去把委托人的东西换回来', 'body', 48,
          o('东西换回来了，人也赔了不是', '你回来时天已经黑了。\n\n代表看了一眼东西，把投诉单撕了。\n\n{junior_he}在你桌上放了一瓶没开封的药。', { cover: 'fixed' }, { money: -3000, body: -3, flag: 'of_fixed_it' }, { trust: 2 }),
          o('东西没换回来', '你在门口站了很久，最后把身上的钱都留下了。\n\n回来时代表已经在写处理意见，笔尖压得很重。', { cover: 'failed' }, { money: -9000, body: -4, mind: -2, flag: 'of_fix_failed' })),
      ]],
    ['代表的话',
      '代表把两个人的名字写在一张纸上，圈了其中一个。\n\n“这一批要开掉一个。”他说，“你是带他的人。”\n\n“你说开谁。”',
      [
        o('说开我', '代表捏着笔停了很久。\n\n“你走了，他更留不住。”\n\n他还是把你的名字留下了，把纸折好放进内袋。', { pick: 'self' }, { money: -12000, mind: 2, flag: 'of_offered_self' }, { trust: 2 }),
        o('说开他', '他收拾东西的时候，把刀还是用那块布裹好。\n\n“谢了。”他说，“这三个月。”\n\n他走的时候没有回头。', { pick: 'him' }, { money: 6000, mind: -3, flag: 'of_let_him_go' }, { trust: -3 }),
        o('说两个都不开，我去谈', '你去找代表谈了两次。\n\n第二次他让你出去。\n\n名单最后被压了一个月，压到下个月又拿出来。', { pick: 'both' }, { mind: -1, social: 1, flag: 'of_both_pushed' }),
      ]],
    ['他来找你',
      S => (S.flags.of_let_him_go ? '三个月后，' + NM(S, 'junior_he') + '在事务所楼下等你。' : '{junior_he}还在所里，只是被调去跑最远的几条线。这天他提前回来，在楼下等你。') + '\n\n他手里拿着一张纸，是别的所的招募。\n\n“他们给的比这里多。”他说，“但我不知道那边是不是也这样。”',
      [
        o('让他去', '他把纸折好收起来，问你有没有什么话要带给他。\n\n你说没有。\n\n他走了两步又回来，把刀上的布解下来，塞给你。', { junior: 'left' }, { mind: -1, item: 'jr_cloth', flag: 'of_junior_left' }, { trust: 1 }),
        o('让他留下，我去争', '你去找代表争了一次，争下来的是一成的加薪和一句话：\n\n“下次不一定。”\n\n他留下了，把那张招募纸贴在柜子里面。', { junior: 'stay' }, { social: 1, flag: 'of_junior_stayed' }, { trust: 2 }),
        o('问他那边到底哪里好', '他想了很久，说那边不用自己填投诉单。\n\n“就这个。”\n\n他把纸收起来了，没再说走不走。', { junior: 'asked' }, { wit: 1, flag: 'of_junior_asked' }, { trust: 1 }),
      ]],
    ['三年后',
      S => (S.flags.of_junior_left ? '三年后，你在另一区的公告栏上看见他的名字，写在“代表”后面。' : '三年后，事务所换了招牌，{junior_he}的名字和你的名字排在同一行。') + '\n\n他见了你还是先把手在裤子上擦一下，才伸手。\n\n有些习惯改不掉。',
      [
        o('把手也擦一下再握', '他笑了，笑得很轻。\n\n“你也是。”\n\n那天你们聊的是价钱和天气，没有聊当年那张投诉单。', null, { mind: 2, social: 1, flag: 'of_shook_hands' }, { end: '三年后，你和何在同一条街上，握手前都先把手擦了一下。' }),
        o('先问他现在带的那个新人怎么样', '他说那孩子比他当年强，也比他会问问题。\n\n“我照你说的那样，先看他三个月。”', null, { mind: 1, flag: 'of_passed_on' }, { end: '三年后，何开始带自己的新人，照你当年的样子看三个月。' }),
      ]],
  ]);

  // ============ 18 个事件 ============
  C.addEvents('office', [
    // —— 6 个无选项 ——
    { id: 'of_board_empty', age: [20, 75], req: { job: 'fixer' }, w: 11, repeat: true, cd: 12,
      text: '公告栏上今天只贴了两张委托。\n\n一张是找猫，一张的报酬栏被撕掉了。\n\n有人在找猫那张下面写了“已接”，字迹和找猫的人一样。' },
    { id: 'of_stamp_dry', age: [20, 75], req: { job: 'fixer' }, w: 10, repeat: true, cd: 12,
      text: '事务所的公章陷进印泥里，按下去只剩半个圆。\n\n代表说将就用。\n\n于是每一份交出去的委托书，都缺着最后那半个圆。' },
    { id: 'of_door_glass', age: [20, 75], req: { job: 'fixer' }, w: 10, repeat: true, cd: 12,
      text: '玻璃门上有一道裂纹，从角上斜着走到底。\n\n底下用胶带贴着，贴了三年。\n\n新来的客人总会先摸一下那道胶带，再推门。' },
    { id: 'of_queue_chairs', age: [22, 80], req: { job: 'fixer' }, w: 9, repeat: true, cd: 12,
      text: '候客的两把椅子不一样高。\n\n坐矮的那把要抬头说话，坐高的那把要低头。\n\n有人进来先看一眼，再挑椅子。' },
    { id: 'of_night_ledger', age: [24, 80], req: { job: 'fixer' }, w: 9, repeat: true, cd: 13,
      text: '夜里关灯之前，代表总要把账本翻一遍。\n\n他不写，只看。\n\n看完把书签夹回同一页，书签是一片磨圆了的铁片。' },
    { id: 'of_badge_worn', age: [22, 85], req: { job: 'fixer' }, w: 10, repeat: true, cd: 12,
      text: '收尾人徽章的边缘磨平了。\n\n代表说这样好，别再磨了，磨掉的是字。\n\n你把徽章翻过来，背面的字确实比正面浅。' },

    // —— 6 个带选项 ——
    { id: 'of_split_fee', age: [22, 70], req: { job: 'fixer' }, w: 10, title: '分成',
      text: '一单委托结了，钱装在一只信封里。\n\n按规矩，带的人是三成。\n\n代表把信封推给你，说“这次你自己分”。',
      choices: [
        { t: '照规矩，三成', eff: { money: 9000, mind: 1 }, r: '你把三成数出来，剩下的推回去。\n\n代表看了数目，说“你数得比上一任准”。' },
        { t: '多留一成，理由是自己担了风险', check: { s: 'social', dc: 45 },
          ok: { r: '代表没说什么，把剩下的钱收起来。\n\n第二天你的名字出现在下一单的“主责”那一栏。', eff: { money: 12000, social: 1, flag: 'of_took_extra' } },
          no: { r: '他把信封重新数了一遍，数完放在桌上，没有推给你。\n\n“再数一次。”\n\n你数完，扣掉的不止一成。', eff: { money: 3000, mind: -2 } } },
        { t: '把自己那三成让给新人', eff: { money: 0, social: 2, flag: 'of_gave_fee' }, r: '新人拿着信封不敢收，看了代表一眼。\n\n代表说“收着”。\n\n那天晚上他请你吃了一顿最便宜的面。' },
      ] },
    { id: 'of_wrong_address', age: [22, 70], req: { job: 'fixer' }, w: 10, title: '写错的地址',
      text: '委托单上的门牌和实际的门牌差了一个数字。\n\n那一户人家门开着，里面有人在切东西。\n\n你手里的委托写着“带回一件东西，不要惊动人”。',
      choices: [
        { t: '先退出去核对', check: { s: 'wit', dc: 44 },
          ok: { r: '你回到街口问了杂货铺，老板说那家早搬走了。\n\n再回头，门已经关上了。', eff: { wit: 2, flag: 'of_checked_address' } },
          no: { r: '你核对了两次，还是走错。\n\n里面的人放下刀，问你是谁。', eff: { body: -6, mind: -3, flag: 'of_walked_in' } } },
        { t: '照单子办', eff: { money: 7000, mind: -2, flag: 'of_did_as_told' }, r: '你把东西拿了，摆回原位的是一只空盒子。\n\n委托人验货时只说“不是这个”，然后扣了一半的钱。' },
        { t: '回去问委托人是哪一户', eff: { mind: -1, social: 1 }, r: '他很不耐烦，改了口供，说“你看着办”。\n\n最后那一单没有做成，钱也没退。' },
      ] },
    { id: 'of_junior_question', age: [24, 70], req: { job: 'fixer' }, w: 9, title: '他问的那句',
      text: '新人问你：如果委托人给的地址是对的，但里面的人不该死，怎么办。\n\n他问得很轻，像怕被别人听见。\n\n事务所里还有三个人。',
      choices: [
        { t: '说按委托办，别多想', eff: { mind: -2, flag: 'of_told_him_rules' }, r: '他点点头，把这个问题收起来了。\n\n后来他又问过一次，问的是别的。' },
        { t: '说那要看你之后还睡不睡得着', eff: { mind: 2, flag: 'of_told_him_truth' }, r: '他想了一会儿，说他睡得着。\n\n“我妈还在。”他说。' },
        { t: '反问他为什么问这个', check: { s: 'social', dc: 40 },
          ok: { r: '他说他上一份活里，写错地址的那个人还活着。\n\n“我不想再有第二次。”', eff: { wit: 2, flag: 'of_heard_his_past' } },
          no: { r: '他摇头，说随便问问。\n\n那天之后他不再问你问题。', eff: { mind: -1 } } },
      ] },
    { id: 'of_broken_blade', age: [22, 75], req: { job: 'fixer' }, w: 9, title: '断在里面的刀',
      text: '刀断在对方身体里，拔不出来。\n\n委托人要的是“确认”，不是尸体。\n\n地上还有别人的脚印，正往巷子里延伸。',
      choices: [
        { t: '先把刀拔出来', check: { s: 'body', dc: 50 },
          ok: { r: '刀出来了，刃上缺了一块。\n\n你把缺的那块也带走了。', eff: { body: -4, skill: 1, flag: 'of_broken_blade' } },
          no: { r: '你用力过猛，刀身又断了一截。\n\n留下的那截，后来成了别人的证物。', eff: { body: -6, mind: -2, flag: 'of_left_blade' } } },
        { t: '不管刀，先追脚印', eff: { body: -3, flag: 'of_left_blade' }, r: '脚印通向一扇开着的后门。\n\n门里是空的，桌上有一杯还热着的水。' },
        { t: '照委托办，确认就走', eff: { money: 5000, mind: -1, flag: 'of_walked_away' }, r: '你在单子上打了勾。\n\n刀留在原地，第二天再去看，已经不在了。' },
      ] },
    { id: 'of_rate_drop', age: [22, 70], req: { job: 'fixer' }, w: 9, title: '降级',
      text: '协会的通知下来了：本季度起，这一片的委托评级下调。\n\n同样一单，报酬按新评级算。\n\n通知末尾写着“鼓励良性竞争”。',
      choices: [
        { t: '照新价接', eff: { money: 6000, mind: -1 }, r: '你把价目表改了。\n\n改完发现，同一张纸上别的所贴着更低的价。' },
        { t: '联合几家一起不接', check: { s: 'social', dc: 48 },
          ok: { r: '四家里有三家签了。\n\n两周后，价钱按旧的算，协会没有再发通知。', eff: { money: 12000, social: 2, flag: 'of_held_rate' } },
          no: { r: '有两家当晚就接了。\n\n第二天早上，只有你这一家的门上贴着“暂无委托”。', eff: { money: -3000, mind: -2, social: -1 } } },
        { t: '换一片区接活', eff: { wit: 1, flag: 'of_moved_area' }, r: '你开始跑另一边，路上多花四十分钟。\n\n那边的价钱高一点，人也不认识你。' },
      ] },
    { id: 'of_kept_serials', age: [24, 80], req: { job: 'fixer', flag: 'kept_serials' }, w: 9, title: '本子上的编号',
      text: '新接的委托里，委托人报出一个编号，说是“一批货”的批次号。\n\n你把它和你本子上抄的那串对了一遍。\n\n只差最后一位。',
      choices: [
        { t: '把本子拿出来对照', eff: { wit: 2, mind: -1, flag: 'of_matched_serials' }, r: '你把两串写在一起，中间画了一道竖线。\n\n差的这一位，正好是工坊招牌背面那行粉笔字缺的那个数。' },
        { t: '装作没听出来', eff: { mind: -2, flag: 'of_ignored_serials' }, r: '你照常报了价，照常接了单。\n\n回家路上，你把本子从内袋换到了包底。' },
        c('拿本子去问那个收尾人', 'social', 46,
          o('他认得那串编号', '“这一批不该存在。”他说，“你别接了。”\n\n他把号码要走了，留下一个空白的受理单。', null, { flag: 'of_asked_fixer_serials', mind: 1 }),
          o('他说记不清了', '他翻了一页，又翻回去，最后说记不清。\n\n你看着他的手，那只手一直在压着本子。', null, { mind: -1, flag: 'of_fixer_played_dumb' })),
      ] },

    // —— 3 组跨年回响 ——
    { id: 'of_receipt_kept', age: [22, 70], req: { job: 'fixer' }, w: 8, title: '一张收据',
      text: '整理旧单子时，你翻出一张五年前的收据。\n\n那单委托的委托人早就搬走了，尾款也没结。\n\n收据背面有一行字，是他的手写住址。',
      choices: [
        { t: '按旧地址去找', eff: { queue: ['of_receipt_back', 6], flag: 'of_sought_old_client' }, r: '地址还在，楼也还在。\n\n门房说那家人搬走了，但没有说搬去哪。\n\n你把收据留下了。' },
        { t: '把收据撕掉', eff: { mind: 1 }, r: '纸很脆，撕的时候掉了一层灰。\n\n账本上那一页，你用笔划掉了。' },
      ] },
    { id: 'of_receipt_back', manual: true, age: [26, 90], w: 1,
      text: '六年后，一个陌生人在事务所门口等你，手里拿着一只旧信封。\n\n“我父亲走之前让我送过来的。”\n\n信封里是当年的尾款，一分不少，钞票旧得发软。',
      eff: { money: 15000, mind: 1, flag: 'of_old_client_paid' } },

    { id: 'of_junior_band', age: [22, 70], req: { job: 'fixer' }, w: 8, title: '绷带',
      text: '新人手腕上缠着绷带，说是自己划的。\n\n绷带打得不对，绕的方向反了。\n\n他把袖子往下拉了拉，问你今天的单子在哪。',
      choices: [
        { t: '把自己的打法学给他看', eff: { social: 1, queue: ['of_band_back', 4], flag: 'of_taught_bandage' }, r: '他学得很慢，学到第三遍才会。\n\n“这样就不会掉了。”他说。' },
        { t: '不问，把单子给他', eff: { mind: -1, queue: ['of_band_back', 4], flag: 'of_ignored_bandage' }, r: '他拿了单子就出去了，手腕上的绷带露在外面。\n\n那天他回来得很晚。' },
      ] },
    { id: 'of_band_back', manual: true, age: [24, 85], w: 1,
      text: '四年后，一个不认识的年轻人来所里，说他哥哥教过他一种缠绷带的方法。\n\n他把袖子卷起来给你看，绕的方向是对的。\n\n“他说是被一个人教的。”',
      eff: { mind: 2, social: 1, flag: 'of_band_passed' } },

    { id: 'of_sign_paint', age: [22, 70], req: { job: 'fixer' }, w: 8, title: '招牌的字',
      text: '招牌上的字掉了一块漆。\n\n补漆的人说原来的颜色配不出来，只能整个重刷。\n\n重刷要关门半天，那半天可能就少一单。',
      choices: [
        { t: '关门，整个重刷', eff: { money: -3000, queue: ['of_paint_back', 5], flag: 'of_repainted' }, r: '刷完的招牌亮得刺眼，邻居说像新开的。\n\n那半天确实少了一单。' },
        { t: '只补那一块', eff: { money: -500, queue: ['of_paint_back', 5], flag: 'of_patched_sign' }, r: '补的那块颜色不一样，远看像一块疤。\n\n代表说这样好，知道是哪一块。' },
      ] },
    { id: 'of_paint_back', manual: true, age: [26, 90], w: 1,
      text: '五年后，这条街上的招牌统一换成了铁皮的。\n\n新牌子是领的，不要钱，字是印的，一样大。\n\n你那块旧招牌被收走时，还有人拿手摸了一下补过的那一块。',
      eff: { mind: -1, flag: 'of_sign_gone' } },
  ]);
})();
