/* 出生 */
CITY.addEvents('birth', [
  // ---------- 巢 ----------
  { id: 'b_nest_a', birth: true, req: { loc: 'nest', fam: { wealth: [3, 3] } }, w: 10, star: true,
    text: '你出生在{home}一栋高层公寓里。窗外的天空被翼的大楼切成整齐的方块。护士用K公司的安瓿处理了脐带的伤口，一点疤都没留下。' },
  { id: 'b_nest_b', birth: true, req: { loc: 'nest', fam: { wealth: [2, 2], parents: 'both' } }, w: 10, star: true,
    text: '你出生在{home}。父母都是{wing}公司下属企业的职员，为了让你拿到巢的居住资格，他们已经排了很多年的队。' },
  { id: 'b_nest_c', birth: true, req: { loc: 'nest', fam: { wealth: [2, 3] } }, w: 6, star: true,
    text: '你出生在{home}的综合医院。同一天，同一层楼，还有十一个孩子出生。护士按出生时间给你们挂上了编号牌，你是第七个。' },
  { id: 'b_nest_l', birth: true, req: { loc: 'nest', wing: 'L' }, w: 30, star: true,
    text: '你出生在L巢。这里的灯从不熄灭——整座都市的“能源”都来自脑叶公司。邻居说，这是全都市最安全的地方之一。',
    eff: { flag: 'lnest' } },

  // ---------- 后巷 ----------
  { id: 'b_bs_poor', birth: true, req: { loc: 'backstreet', fam: { wealth: [0, 0] } }, w: 10, star: true,
    text: '你出生在{home}一间没有窗户的出租屋里。接生的是隔壁的老太太，报酬是一碗热汤。' },
  { id: 'b_bs_poor2', birth: true, req: { loc: 'backstreet', fam: { wealth: [0, 0] } }, w: 8, star: true,
    text: '你出生在{home}。母亲生下你的那天凌晨，楼下传来了很长一段时间的惨叫声。没有人开门。到了早上，楼道被清洗得干干净净。' },
  { id: 'b_bs_mid', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 1], parents: 'both' } }, w: 10, star: true,
    text: '你出生在{home}。父母在街角经营着一家小小的拉面摊，你的第一张床是两个装面粉的纸箱。' },
  { id: 'b_bs_mid2', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 1] } }, w: 8, star: true,
    text: '你出生在{home}的一家地下诊所。医生收了双倍的钱，因为那天是周末。' },
  { id: 'b_bs_mid3', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 2], parents: ['both', 'father'] } }, w: 6, star: true,
    text: '你出生在{home}。父亲在工坊里做学徒，手上常年带着机油味。他抱你的时候，特意把手洗了三遍。' },
  { id: 'b_bs_rich', birth: true, req: { loc: 'backstreet', fam: { wealth: [2, 2] } }, w: 10, star: true,
    text: '你出生在{home}。家里在这一带有两间铺面，在后巷算是殷实人家。家里每个月都要往帮派那里送一个信封。' },
  { id: 'b_bs_fixer', birth: true, req: { loc: 'backstreet', fam: { parents: ['both', 'mother', 'father'] } }, w: 4, star: true,
    text: '你出生在{home}。你的家长是一名收尾人，你出生那天，这位家长身上还缠着没拆的绷带。',
    eff: { flag: 'fixer_parent', skill: 3 } },
  { id: 'b_bs_orphan', birth: true, req: { loc: 'backstreet', fam: { parents: 'none' } }, w: 40, star: true,
    text: '你在{home}的一条巷子里被人发现。裹着你的毯子上别着一张纸条，上面只写了你的名字。',
    eff: { flag: 'orphan', mind: -3 } },
  { id: 'b_bs_orphan2', birth: true, req: { loc: 'backstreet', fam: { parents: 'none' } }, w: 25, star: true,
    text: '你出生后没多久，父母就在一个凌晨没有回家。邻居们说，那天是后巷深宵。你被送进了一家由教会经营的孤儿院。',
    eff: { flag: ['orphan', 'orphanage'] } },

  // ---------- 郊区 ----------
  { id: 'b_out', birth: true, req: { loc: 'outskirts' }, w: 10, star: true,
    text: '你出生在都市之外的郊区。这里没有翼的庇护，没有首脑的禁忌，营地外的生物大多叫不出名字。你的家人住在一处废弃设施的残骸里，靠拾荒为生。',
    eff: { flag: 'outskirts_born' } },
  { id: 'b_out2', birth: true, req: { loc: 'outskirts' }, w: 6, star: true,
    text: '你出生在郊区一辆废弃的车厢里。母亲后来说，你出生那晚，远处的地平线上有什么巨大的东西缓缓走过。',
    eff: { flag: 'outskirts_born', dist: 3 } },

  // ---------- 通用兜底 ----------
  { id: 'b_any', birth: true, w: 1, star: true, text: '你出生在{home}。都市并没有注意到又多了一个人。' },
]);

/* 幼年 0–5 */
CITY.addEvents('infant', [
  { id: 'i_first_word', age: [1, 2], w: 20, text: ['你学会的第一个词是“妈妈”。', '你学会的第一个词是“饭”。', '你学会的第一个词是“不要”。', '你学会的第一个词是“眼”——你听大人说得最多的就是这个字。'] },
  { id: 'i_walk', age: [1, 2], w: 20, text: '你学会了走路。第一次摔倒的时候，你没有哭。', eff: { body: 1 } },
  { id: 'i_sick', age: [0, 4], w: 8, text: '你发了一场高烧，烧了三天三夜。', eff: { body: -4 },
    choices: null },
  { id: 'i_sick_bs', age: [0, 4], req: { loc: 'backstreet', fam: { wealth: [0, 1] } }, w: 8,
    title: '高烧',
    text: '你发了一场高烧，烧了两天还没有退。诊所的医生说，用一支K公司的安瓿就能好，价格是家里两个月的饭钱。',
    choices: [
      { t: '（家人）买下安瓿', eff: { money: -6000 }, r: '安瓿打下去不到一个小时，你就退烧了。家里吃了两个月的白粥。' },
      { t: '（家人）再熬一熬', res: [
        { w: 6, r: '第四天，你奇迹般地退烧了。', eff: { body: 2 } },
        { w: 3, r: '烧退了，但你的身体从此就不太好。', eff: { body: -10 } },
        { w: 1, r: '烧退了。从那以后，你偶尔会听到别人听不到的声音。', eff: { mind: -5, dist: 6, flag: 'hears_voices' } },
      ] },
    ] },
  { id: 'i_night', age: [2, 5], req: { loc: 'backstreet', fam: { parents: ['both', 'mother'] } }, w: 10, text: '某天夜里，你被外面的声音吵醒。母亲捂住你的嘴，一动不动地抱着你，直到天亮。那是你第一次知道“后巷深宵”。', eff: { mind: -2, flag: 'knows_night' } },
  { id: 'i_toy', age: [2, 5], req: { loc: 'nest' }, w: 10, text: '你得到了一个会说话的玩具。它是某个翼的子公司生产的，每天早上会用甜美的声音提醒你“要做个有用的人”。' },
  { id: 'i_ramen', age: [3, 5], req: { loc: 'backstreet' }, w: 10, text: '你第一次吃到了加蛋的拉面。那是你记忆中最早的幸福。', eff: { mind: 2 } },
  { id: 'i_ampule_scar', age: [3, 5], w: 6, text: '你从楼梯上摔了下来，额头上留下了一道疤。', eff: { body: -1 } },
  { id: 'i_sibling', age: [2, 5], req: { fam: { parents: ['both'] } }, w: 6, text: '家里多了一个{sib}。你不太确定该怎么对待这个皱巴巴的小东西。', eff: { fn: (S) => { S.fam.sib += 1; S.vars.sib = S.rng.pick(['弟弟', '妹妹']); } } },
  { id: 'i_parent_lost', age: [1, 5], req: { loc: 'backstreet', fam: { parents: ['both'] } }, w: 4, star: true,
    text: '你的父亲某天出门上工，再也没有回来。没有尸体，没有消息。母亲找了三个月，然后不再提起这件事。',
    eff: { fn: (S) => { S.fam.parents = 'mother'; }, mind: -4, flag: 'father_lost' } },
  { id: 'i_orphan_meal', age: [3, 5], req: { flag: 'orphanage' }, w: 12, text: '孤儿院的修女教你们饭前祈祷。你不知道该向谁祈祷，只记得祈祷完才能吃饭。' },
  { id: 'i_out_beast', age: [2, 5], req: { loc: 'outskirts' }, w: 14, text: '你在营地边看到了一只长着许多眼睛的动物。它看了你很久，然后走开了。大人们说，你运气很好。', eff: { dist: 2, mind: 1 } },
  { id: 'i_gift', age: [4, 5], req: { trait: '家族遗物' }, w: 30, text: '你在贴身的旧布包里发现了家里传下来的那件东西：一枚看不出材质的徽章，背面刻着一个已经磨平的字母。包里夹着一张字条：“别拿给别人看。”', eff: { flag: 'heirloom_seen' } },
]);
