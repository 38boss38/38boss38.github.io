/* 交织网三（批次 24）：把货场那箱货收束掉。
 * 一条线从第一批的夜班开始，经过工坊的编号、事务所的卷宗、协会的材料，
 * 到这里必须有人付出代价——不是玩家一定赢，而是这件事终于有了一个说法。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const LEDGER = { anyflag: ['cargo_confessed', 'cargo_silent', 'cargo_lied', 'cargo_evidence', 'cargo_covered', 'echo2_signed_case', 'echo2_told_case', 'echo2_saw_file', 'kept_serials', 'gave_serials'] };

  p({ id: 'echo_close', pack: 'B24', title: '归档', route: 'human', person: 'echo_clerk', theme: '前情', age: [26, 72], sources: ['S02'], req: LEDGER, fixture: S => { S.flags.cargo_confessed = true; } }, [
    ['一张通知',
      '门上贴着一张通知，纸是新的，字是印的。\n\n“关于旧案卷宗归档的说明。”下面一行小字：相关人员可在十五日内提出异议。\n\n十五日之后，纸会被撕掉，卷宗会被移到最里面那排架子上。',
      [
        o('当天就去问', S => '窗口排了四个人。\n\n轮到你时，里面的人把一份表推出来，说他只负责收表，不负责看内容。\n\n表上第一栏写着“与本案的关系”。', { act: 'ask' }, { wit: 1, mind: -1 }),
        o('先把通知抄下来', S => '你抄得很仔细，连下面那行小字的间距都照着写。\n\n抄到“异议”两个字时，笔停了一下。\n\n这两个字看起来很轻。', { act: 'copy' }, { wit: 2, flag: 'close_copied_notice' }),
        o('把通知撕掉', S => '撕下来的时候，纸在门上留了一块比周围干净的长方形。\n\n第二天那个位置贴了同样一张。', { act: 'tear' }, { mind: -1, flag: 'close_tore_notice' }, { goto: 2 }),
      ]],
    ['那张表',
      S => '表上要填三样：姓名、与本案的关系、以及“是否要求复核”。\n\n' + NM(S, 'echo_clerk') + '在旁边等着，手里捏着一支笔，笔帽咬出了牙印。\n\n“想清楚再写。”他说，“复核要重新作证，作证会被记下来。”',
      [
        o('写“要求复核”', '你写完，他看了一眼，把笔帽扣上。\n\n“那就要有人重新听一遍。”他说，“包括你当年说的那句。”', { form: 'review' }, { mind: -2, flag: 'close_asked_review' }, { trust: 1 }),
        o('写“不要求”', '他收表的时候没有多问。\n\n“这样最省事。”他说。\n\n他把你的表放在最下面那一叠。', { form: 'no' }, { money: 3000, mind: -1, flag: 'close_declined_review' }),
        c('问复核要重听哪些话', 'social', 46,
          o('他念了三条', '三条里有一条是你没想起来的。\n\n“这条是别人说的。”他说，“说你那天在场。”\n\n他念的时候一直看着纸。', null, { wit: 2, mind: -2, flag: 'close_heard_three' }, { trust: 1 }),
          o('他说他也不清楚', '“我就是收表的。”\n\n他把表推回来一点，让你自己再想想。\n\n窗口后面有人在催。', null, { mind: -1 })),
      ]],
    ['重听',
      S => (S.flags.close_asked_review ? '半个月后，一间小屋子里坐了三个人。\n\n他们问得很少，问完就在本子上写。\n\n写到某一处，其中一个抬头看了你一眼，又低下去。' : '你没有要求复核。\n\n归档那天你路过那栋楼，看见有人抱着纸箱出来，箱子很旧，用胶带缠了两道。'),
      [
        o('把当年那句改口', '你把话说完，屋子里安静了一会儿。\n\n“前后不一致。”其中一个人说。\n\n他把本子合上，没有说你撒谎。', { hear: 'changed' }, { mind: -3, fame: -1, flag: 'close_changed_story' }),
        o('照当年的说法再说一遍', '说完你才发现，自己记得的比当年更清楚。\n\n他们记完，让你签了字。\n\n签字的时候，笔迹比平时重。', { hear: 'same' }, { mind: 1, flag: 'close_same_story' }, { trust: 1 }),
        o('说记不清了', '他们互相看了一眼。\n\n“记不清也是一种回答。”\n\n他们把那一栏写成“无法确认”，然后请你在旁边按了指印。', { hear: 'blank' }, { mind: -2, flag: 'close_could_not' }),
      ]],
    ['归档之后',
      S => '卷宗被移到最里面那排架子上。\n\n' + NM(S, 'echo_clerk') + '说，那排架子不常开，钥匙在一个人手里。\n\n“其实也没什么。”他说，“就是以后查，要等。”\n\n他把这句话说完，又补了一句：“那个孩子去年结了婚。”',
      [
        o('问他是怎么知道这些的', '“我在这儿坐了十九年。”他说，“什么事都从窗口过。”\n\n他把窗口的挡板放下来一半，正好挡住外面的人。', null, { wit: 2, mind: 1, flag: 'close_knew_clerk' }, { end: '你从一个坐了十九年的窗口那里，知道了那件事的后来。' }),
        o('什么也不问，转身走', '门外的天已经暗了。\n\n你走到街口才想起来，自己一次也没问过那个孩子叫什么。', null, { mind: -1, flag: 'close_never_asked_name' }, { end: '你没有问那个孩子叫什么，就走出了那栋楼。' }),
        o('去那排架子看一眼', '门锁着。\n\n你隔着玻璃往里看，纸箱一直堆到天花板，每一个都一样。\n\n你分不出哪一个是那一箱。', null, { wit: 1, mind: -2, flag: 'close_looked_shelves' }, { end: '你隔着玻璃看过那排架子，分不出哪一箱是自己那一箱。' }),
      ]],
  ]);

  C.addEvents('echoes3', [
    { id: 'e3_closure', age: [26, 85], w: 10, repeat: true, cd: 15,
      text: '这件事到今天算是完了。\n\n你原以为会有个声音，或者有人来道谢。\n\n结果只是一张纸被归到另一个位置。' },
    { id: 'e3_window_gap', age: [26, 85], req: { loc: ['nest', 'backstreet'] }, w: 9, repeat: true, cd: 15,
      text: '办事窗口的挡板只放到一半。\n\n你能看见里面的人，他看不见你的脸。\n\n这大概是有意这么做的。' },
    { id: 'e3_old_file', age: [28, 85], w: 9, repeat: true, cd: 15,
      text: '一份旧材料的边上有一道折痕，折过很多次。\n\n你把它抚平，纸在折痕上裂开了一点点。\n\n裂开的地方正好压着一个名字。' },
    { id: 'e3_same_room', age: [28, 90], w: 8, repeat: true, cd: 16,
      text: '你在一间屋子里坐下，之前有人坐过这里。\n\n椅子还温着，桌上的水杯外面有一圈水渍。\n\n登记本上，上一行还没写完。' },

    { id: 'e3_asked_again', age: [26, 85], w: 9, title: '又来问一次',
      text: '有人来问同一件事，问法比上次细致。\n\n他手里拿着一份复印件，边角有你的签名。\n\n“这次只问一句。”他说，“你当时害怕吗。”',
      choices: [
        { t: '说怕', eff: { mind: 1, flag: 'e3_said_afraid' }, r: '他点了点头，把这一句原样写下来。\n\n写完之后他抬起头，说“我也是”。\n\n然后他把本子合上了。' },
        { t: '说不怕', eff: { wit: 1, flag: 'e3_said_not_afraid' }, r: '他没有追问，只写了个“否”。\n\n“这个也要归档。”他说。\n\n他走的时候，复印件留在桌上。' },
        { t: '反问他为什么问这个', check: { s: 'social', dc: 44 },
          ok: { r: '“因为卷宗里没有这一栏。”他说，“但我觉得应该有人问。”\n\n他把笔收起来，没有再记。', eff: { wit: 2, mind: 2, flag: 'e3_he_asked_for_himself' } },
          no: { r: '他把这个问题记在了最后一行，写完就合上。\n\n“不用答了。”', eff: { mind: -1 } } },
      ] },

    { id: 'e3_paid_back', age: [28, 85], w: 9, title: '补偿',
      text: '一封信通知你去领一笔钱，金额不大，写在一张表上。\n\n表后面附着一句话：本款项不构成对任何事实的认定。\n\n领款要签字，签字要写明身份。',
      choices: [
        { t: '去领，签了', eff: { money: 12000, mind: -2, flag: 'e3_took_compensation' }, r: '窗口的人点了两遍钱，让你在第二页再签一次。\n\n“这一页是给上面看的。”他说。' },
        { t: '不领', eff: { mind: 2, flag: 'e3_refused_compensation' }, r: '你把通知折好放回去。\n\n后来那笔钱怎么处理，没有人再跟你说过。' },
        { t: '领，但把钱捐出去', eff: { money: 0, fame: 1, mind: 1, flag: 'e3_gave_compensation' }, r: '你把钱捐给了那家教会孤儿院。\n\n院长收据上写的是“无名氏”。\n\n你看着这三个字看了一会儿。' },
      ] },

    { id: 'e3_last_shelf', age: [34, 90], w: 9, title: '最后一次',
      text: '那份卷宗要被销毁了。\n\n销毁之前有一段时间可以申请查阅。\n\n申请表放在窗口，笔用绳子拴着。',
      choices: [
        { t: '申请查阅', check: { s: 'social', dc: 48 },
          ok: { r: '你被允许看二十分钟，不能抄，不能带走。\n\n你翻到最后一页，发现有几行是后来补的，字迹不是任何一个人的。', eff: { wit: 2, mind: -1, flag: 'e3_read_dossier' } },
          no: { r: '申请被退回来了，理由一栏写着“与本人无直接关系”。\n\n你把表放回窗口，笔荡了两下。', eff: { mind: -2 } } },
        { t: '不申请', eff: { mind: 1, flag: 'e3_skipped_dossier' }, r: '销毁那天你没有去。\n\n后来你听说那批纸被压成了别的纸，卖给了印刷厂。' },
      ] },

    { id: 'e3_marked_paper', age: [30, 90], w: 8, title: '同一批纸',
      text: '你买的一本旧账簿，纸有点发黄。\n\n翻到中间，有几页的边上留着盖章的痕迹，被裁掉了大半。\n\n剩下那半个章，你认得。',
      choices: [
        { t: '把那一页撕下来', eff: { queue: ['e3_paper_back', 6], wit: 1, flag: 'e3_kept_page' }, r: '你把它夹进自己的本子里。\n\n这一页很轻，比别的纸都轻。' },
        { t: '整本一起收好', eff: { queue: ['e3_paper_back', 6], mind: 1, flag: 'e3_kept_book' }, r: '你把账簿放进柜子最上层。\n\n以后再买本子，都会先翻到中间看一眼。' },
      ] },
    { id: 'e3_paper_back', manual: true, age: [36, 95], w: 1,
      text: '六年后，一个收旧纸的人上门，说你那一本他愿意按“有章”的价钱收。\n\n“有人专门收这种。”他说，“拿去做别的簿子。”\n\n你没有卖。',
      eff: { mind: 1, flag: 'e3_refused_paper_buyer' } },
  ]);
})();
