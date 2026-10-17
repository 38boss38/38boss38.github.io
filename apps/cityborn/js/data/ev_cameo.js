/* 擦肩：31 个与三部曲有关的远观／擦肩事件 + 14 个成就。
 * 原则：原作角色只作为背景出现——远远看见、听说、擦肩而过，
 * 不与玩家交谈、不成为熟人、不改变任何原作走向；也不替他们补写设定里没有的事实。
 * 权重很低，并且一局最多遇上两次——擦肩之所以有意思，是因为它不常见。
 */
(function () {
  'use strict';
  const events = [];
  const seen = (id, req, text, ach, w, eff) => events.push({
    id: 'cm_' + id, age: [14, 95],
    req: { ...(req || {}), cnt: { cameo: [null, 1] } },
    w: w == null ? 2 : w, repeat: true, cd: 30, text,
    eff: { cnt: { cameo: 1 }, ...(ach ? { ach } : {}), ...(eff || {}) },
  });

  // ---------- 事务所与工坊：招牌、车、被熏黑的徽章 ----------
  seen('dawn', { loc: 'backstreet' }, '一个收尾人从你身边跑过去，披风边角还在冒烟。他袖子上别着黎明事务所的徽章，徽章被熏黑了一半。', 'cm_dawn');
  seen('fullstop', { loc: ['nest', 'backstreet'] }, '句点事务所的门口停着一辆没有标志的车。有人把一份委托单折成很小的方块，从门缝里塞了进去。');
  seen('hook', { loc: 'backstreet' }, '吊钩事务所的车停在巷口，后厢门开着，里面挂着一排钩子。钩子上什么都没有，绳结却像是刚解开的。');
  seen('molar', { loc: ['nest', 'backstreet'] }, '臼齿事务所的招牌是一颗放大的臼齿，齿面上缺了一角。路过的人都不看它。');
  seen('firefist', { loc: 'backstreet' }, '炎拳事务所的人在路边烤火，火是从拳套上引出来的。烤完，他们拿一把随手捡的刮刀，把那层软下来的东西从拳套上刮下去。');
  seen('fanghunt', { loc: 'backstreet' }, '猎牙事务所的墙上挂了一整面牙，按大小排开。最下面那一排很小，守店的人说那是野兽的。');
  seen('multicrack', { loc: ['nest', 'backstreet'] }, '多裂纹事务所的每扇窗都裂着，裂纹用透明胶带贴着。里面的人照样办公，没有人提换窗。');
  seen('rose', { loc: 'backstreet' }, '玫瑰扳手工坊的门开着，里头传来一下一下拧紧的声音。你的鞋面落了一层很细的灰，师傅说不用擦——擦不掉。', null, 4);

  // ---------- 边狱公司：车、钟表、十二个人 ----------
  seen('bus', { era: 'dist' }, '一辆暗红色的巴士停在路口，车身上写着边狱公司。车门开着，没有人下车，也没有人上车。', 'cm_bus', 4);
  seen('clock', { era: 'dist' }, '车门边站着一个头是钟表的人。表的指针一直在走，他一直没有动，经过的人都绕着车门走。', 'cm_clock', 3);
  seen('twelve', { era: 'dist' }, '面馆里进来十几个人，穿一样的制服，把两张桌子拼在一起。其中一个把菜单上的价钱从头念了一遍，念完才坐下。', 'cm_twelve', 4);
  seen('red_coat', { era: 'dist' }, '便利店门口站着一个穿红外套的男人，眼睛是红的。他在等车，车来得很准时。店员等他走远了，才小声说那辆车是“公司”的。');
  seen('driver', { era: 'dist' }, '巴士的司机个子很小，踮着脚才够得着水箱盖。她加完水，又把地上的水迹擦干净了。', null, 2);
  seen('goldbough', { era: 'dist' }, '黑市上有人卖“金枝的碎片”，纸包里其实是一根镀了铜的树枝，底下还留着灯管的接口。买的人问了两句，卖的人就改了口，说“差不多”。', 'cm_goldbough', 3);

  // ---------- 图书馆与邀请函（图书馆在本作中只存在于 wy -1~0，因此两条都限定 lib 时代） ----------
  seen('library', { era: 'lib' }, '街的尽头多了一栋没有门牌的建筑，窗户里全是书。第二天你再经过，楼还在，路口的人却说没注意过。', 'cm_library', 4);
  // 这封信不设 library_invited：玩家没有拆，图书馆的入口仍是关着的。
  seen('envelope', { era: 'lib', noflag: 'library_invited' }, '你的信箱里有一封没有邮戳的信。信封很厚，摸得出里面有一张硬卡。你没有拆。', 'cm_envelope', 3, { mind: -1 });

  // ---------- 只存在于传闻里的名字 ----------
  seen('carmen', {}, '墙上有人写了“卡门”两个字，写得很用力，像是写给谁看的。第二天再看，字被人用灰盖掉了，只留下笔画的凹痕。', null, 2);
  seen('redmist', { era: ['lib', 'dist'] }, '几个老人在面摊说殷红迷雾的事，说到一半，其中一个摆摆手说算了。剩下的就都低头吃面。', 'cm_redmist', 3);
  seen('reverb', { era: ['lib', 'dist'] }, '收音机里在讲苍蓝残响的旧事，讲到关键处插进一段洗衣粉广告。广告放完，节目已经换成了天气预报。', 'cm_reverb', 3);
  seen('moses', {}, '面馆角落里坐着一个抽烟斗的女人，桌上摊着一叠照片。对面的人一直在说，她只偶尔点头。走的时候，她把照片收进一只旧箱子。', 'cm_moses', 3);

  // ---------- 公司、禁忌与墙外 ----------
  seen('lccb', { era: 'dist' }, '路口拉着封锁带，带子上印着LCCB。勘察的人蹲在地上量了很久，站起来时扶了一下膝盖。');
  seen('lce', { era: 'dist' }, '有人沿街采样，把一小瓶东西贴上标签，标签上写了一串编号。他抬头看了看天，又低头写了一个数字。');
  seen('claw', { era: ['lib', 'dist'] }, '路口站着一个穿深色西装的人，一动不动。原本堵在街上的帮派一个个绕开了，没有人说话。半小时后，那个人不在了。', 'cm_claw', 3);
  seen('taboo', {}, '街口贴了新的禁忌告示，第三条被人刮掉了。旁边有人小声说，刮掉的这条是上个月才加上去的。', 'cm_taboo', 4);
  seen('blood', { era: 'dist' }, '雨里走过一个穿礼服的人，贴着屋檐，始终没让衣服沾到水。有人低声说了句什么，旁边的人立刻把他拉走了。');
  seen('lake', { era: 'dist' }, '从大湖方向来的船靠了岸，下船的人都不说话。只有一个人回头看了一眼湖面，看了很久。');
  seen('smoke', {}, '老人讲烟霾战争，讲到自己那一队还剩几个人时停住了，说记不清了，然后把杯子里的酒喝完。', 'cm_smoke', 3);
  seen('lob_hire', { era: 'lob' }, '脑叶公司的外墙下贴着一张招工告示，纸上印着一句“我们需要你”。有人在下面用炭笔写了一行：真的吗。', 'cm_lob', 4);

  // ---------- 没有对话的交集：只碰一下，不留下关系 ----------
  seen('table', { era: 'dist' }, '面馆里几个穿同样制服的人先走了。桌上留的钱比该付的多，老板数完，把多出来的几张单独压在柜台下面。', null, 3);
  seen('glove', { era: 'dist' }, '台阶上留着一只湿手套。你捡起来交给路边的人，他摇头说不是他的，你只好又放回原处。', null, 2);
  seen('ember', { loc: 'backstreet' }, '你从玫瑰扳手工坊门口经过，门里有人在磨什么东西，溅出一粒火星，落在你的袖子上。里头的人头也没抬，说了句“拍掉”。', null, 2);

  CITY.addEvents('cameo', events);
  CITY.addAch({
    cm_dawn: { name: '黎明之前', desc: '在街上遇见一名披风还在冒烟的黎明事务所收尾人。', tier: 'rare', group: '擦肩', hidden: true, hint: '有些事务所的活，从别人的衣服上就能看出来。' },
    cm_bus: { name: '红色巴士', desc: '看见一辆写着边狱公司的暗红色巴士停在路口。', tier: 'rare', group: '擦肩', hidden: true, hint: '它总是停在需要它的地方。' },
    cm_clock: { name: '钟表头', desc: '看见一个头是钟表的人站在车门外。', tier: 'epic', group: '擦肩', hidden: true, hint: '指针在走，人不动。' },
    cm_twelve: { name: '十二个人', desc: '在面馆里遇见十几个穿着同样制服的人。', tier: 'rare', group: '擦肩', hidden: true, hint: '有人把菜单从头念到了尾。' },
    cm_library: { name: '不该存在的建筑', desc: '看见一栋窗户里全是书的楼。', tier: 'epic', group: '擦肩', hidden: true, hint: '第二天它还在，别人却说没注意过。' },
    cm_envelope: { name: '没有邮戳', desc: '在信箱里收到一封很厚的、没有邮戳的信。', tier: 'epic', group: '擦肩', hidden: true, hint: '被寄到“有故事的人”手里。' },
    cm_redmist: { name: '没说下去', desc: '听见老人提起殷红迷雾，又自己住了口。', tier: 'rare', group: '擦肩', hidden: true, hint: '有些名字在后巷不能说完。' },
    cm_moses: { name: '烟斗与照片', desc: '在面馆看见一个抽烟斗的女人在查一件事。', tier: 'rare', group: '擦肩', hidden: false, hint: '她把照片收进了一只旧箱子。' },
    cm_claw: { name: '绕开的那条街', desc: '看见整条街的帮派为一个穿西装的人让路。', tier: 'legend', group: '擦肩', hidden: true, hint: '有时候禁忌不需要写出来。' },
    cm_taboo: { name: '被刮掉的第三条', desc: '看见一张刚加上去就被刮掉的禁忌。', tier: 'rare', group: '擦肩', hidden: false, hint: '告示也会改主意。' },
    cm_goldbough: { name: '纸包里的东西', desc: '在黑市上看见有人拿镀铜的树枝当金枝卖。', tier: 'rare', group: '擦肩', hidden: true, hint: '灯管接口还没拆干净。' },
    cm_reverb: { name: '插播广告', desc: '在广播里听见苍蓝残响的旧事，又被广告打断。', tier: 'rare', group: '擦肩', hidden: true, hint: '都市的广播总在最要紧的地方换节目。' },
    cm_smoke: { name: '记不清了', desc: '听老人讲烟霾战争，讲到最后他不再往下说。', tier: 'rare', group: '擦肩', hidden: true, hint: '有些队伍只剩几个人时最好别数。' },
    cm_lob: { name: '真的吗', desc: '在脑叶公司的招工告示下面看见一行炭笔字。', tier: 'rare', group: '擦肩', hidden: true, hint: '“我们需要你”下面总有人回一句。' },
  });
})();
