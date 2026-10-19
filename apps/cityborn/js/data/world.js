/* 世界基础数据：出生、姓名、特质、职业、年度方针、死亡 */
(function () {
  'use strict';
  const CITY = window.CITY;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ---------- 姓名 ----------
  const NM = {
    m: ['阿尔诺', '安东', '马克', '伊万', '雅各', '杰克', '弗兰茨', '卡尔', '彼得', '马尔科', '雷蒙', '伯纳德', '亚历克斯', '西蒙', '汉斯', '路德', '巴斯蒂安', '米哈伊尔', '列昂', '萨沙', '诺亚', '本', '托马斯', '维克多', '埃里克', '亚伦', '鲁本', '奥斯卡', '克劳斯', '马蒂亚斯',
      '敏俊', '东焕', '在贤', '成浩', '俊熙', '泰俊', '贤宇', '振宇', '尚民', '永哲', '光洙', '哲秀',
      '健太', '隼人', '诚', '龙之介', '秀一', '弘树', '凉介',
      '子轩', '明远', '承宇', '浩然', '景行', '少卿', '文渊', '书衡'],
    f: ['安娜贝尔', '莉莎', '伊莎贝拉', '玛尔塔', '玛丽', '露西', '克洛伊', '娜塔莎', '塔妮娅', '奥尔加', '薇拉', '艾琳', '莉莉', '莎拉', '朱莉', '安娜', '海伦', '爱丽丝', '莫妮卡', '妮娜', '罗莎', '艾玛', '佩特拉', '黛西', '卡莉娜', '茱蒂', '芙蕾雅', '米娅', '洛蕾塔', '格蕾塔',
      '秀贤', '智恩', '瑞妍', '多英', '惠珍', '敏智', '恩菲', '允儿', '素妍', '佳恩', '彩琳', '夏恩',
      '千夏', '美雪', '葵', '凛', '纱织', '真由', '琴音',
      '婉清', '若兰', '雨桐', '晚晴', '思瑶', '映雪', '清漪', '云舒'],
    sur: ['金', '朴', '李', '崔', '郑', '韩', '尹', '姜', '徐', '林', '宋', '黄', '张', '王', '贾', '史', '陆', '沈'],
  };
  // 名字列表按文化分段：西式 30 / 韩式 12 / 日式 7 / 中式 8；姓氏与名字的文化相匹配
  const SEG = [[0, 30, null], [30, 42, ['金', '朴', '李', '崔', '郑', '韩', '尹', '姜', '徐']], [42, 49, ['佐藤', '高桥', '渡边', '山本', '中村', '小林', '松本', '井上']], [49, 57, ['林', '宋', '黄', '张', '王', '陆', '沈', '许']]];
  CITY.randName = function (rng, g) {
    const list = NM[g === 'f' ? 'f' : 'm'];
    const i = Math.floor(rng.next() * list.length), given = list[i];
    const seg = SEG.find((x) => i >= x[0] && i < x[1]);
    if (seg && seg[2] && rng.chance(0.65)) return rng.pick(seg[2]) + given;
    return given;
  };

  // ---------- 翼 ----------
  // 只使用设定中确有其巢的翼；数字区号不与翼字母硬绑定，避免与设定冲突。
  CITY.WINGS = {
    K: { name: 'K公司', w: 10, desc: '翠绿的HP安瓿能瞬间重塑碎裂的骨肉，只要你付得起账单' },
    L: { name: 'L公司', w: 10, desc: '脑叶公司。从深不见底的地下抽取脑啡肽，点亮整座都市的长夜', era: ['lob'] },
    R: { name: 'R公司', w: 8, desc: '孵化场日夜轰鸣，豢养着第四集团军佣兵的武力之翼' },
    T: { name: 'T公司', w: 8, desc: '连色彩与每日钟点都能明码标价、按秒征收的时间之翼' },
    W: { name: 'W公司', w: 10, desc: '承诺“十秒钟准点抵达”，运营着跨区WARP列车的空间之翼' },
    U: { name: 'U公司', w: 6, desc: '坐拥浩瀚大湖与无数船只，以共鸣音叉锚定航道与规则的翼' },
    H: { name: 'H公司', w: 6, desc: '朱门深院的鸿园与世家大族盘踞之地，药膳与长生秘方暗流涌动' },
    N: { name: 'N公司', w: 6, desc: '纯白建筑林立，兜售经验罐头、狂热崇拜纯粹肉体与钉锤的翼' },
    J: { name: 'J公司', w: 6, desc: '不夜的轮盘赌场与铁栅当铺遍地开花，连气运与心愿皆可封存典当的翼' },
  };

  // ---------- 出生 ----------
  CITY.birth = function (S, opt) {
    const r = S.rng;
    S.wy = opt.wy != null ? opt.wy : opt.era === 'lob' ? r.int(-55, -25) : opt.era === 'dist' ? r.int(1, 8) : r.int(-50, 5);
    if (S.rulesVersion >= 2 && opt.wy == null && !opt.era) {
      const band = CITY.varietyPick(S, ['early', 'eve', 'after'], (x) => ({ early: 40, eve: 35, after: 25 }[x]), 'eraBand');
      S.wy = band === 'early' ? r.int(-55, -31) : band === 'eve' ? r.int(-30, -3) : r.int(1, 8);
    }
    if (!S.name) S.name = CITY.randName(r, S.gender);
    const roll = r.next();
    const birthplace = S.rulesVersion >= 2
      ? CITY.varietyPick(S, ['backstreet', 'nest', 'outskirts'], (x) => ({ backstreet: 62, nest: 28, outskirts: 10 }[x]), 'loc')
      : roll < 0.2 ? 'nest' : roll < 0.97 ? 'backstreet' : 'outskirts';
    const era = CITY.eraOf(S.wy);
    if (birthplace === 'nest') {
      S.loc = 'nest';
      const ws = Object.keys(CITY.WINGS).filter((k) => !CITY.WINGS[k].era || CITY.WINGS[k].era.includes(era));
      S.wing = S.rulesVersion >= 2
        ? CITY.varietyPick(S, ws, (k) => CITY.WINGS[k].w, 'home', (k) => k + '巢')
        : r.wpick(ws, (k) => CITY.WINGS[k].w);
      S.home = S.wing + '巢';
      S.d = r.int(1, 25);
      S.fam.wealth = r.chance(0.25) ? 3 : 2;
    } else if (birthplace === 'backstreet') {
      S.loc = 'backstreet';
      S.d = r.int(1, 25);
      S.home = S.d + '区后巷';
      S.fam.wealth = r.wpick([0, 1, 2], (w) => [35, 50, 15][w]);
    } else {
      S.loc = 'outskirts';
      S.d = 0;
      S.home = '郊区';
      S.fam.wealth = 0;
    }
    const pr = r.next();
    S.fam.parents = pr < 0.62 ? 'both' : pr < 0.76 ? 'mother' : pr < 0.86 ? 'father' : 'none';
    if (S.loc === 'nest' && S.fam.parents === 'none') S.fam.parents = 'both';
    S.fam.sib = r.wpick([0, 1, 2, 3], (n) => [40, 35, 18, 7][n]);
    if (S.fam.parents === 'none') S.fam.sib = 0;
    if (S.fam.sib) S.vars.sib = r.pick(['哥哥', '姐姐', '弟弟', '妹妹']);
    const base = { 0: [30, 35, 20, 8, 25], 1: [38, 40, 28, 8, 30], 2: [45, 45, 38, 8, 32], 3: [50, 48, 45, 8, 35] }[S.fam.wealth];
    ['body', 'mind', 'wit', 'skill', 'social'].forEach((k, i) => (S.st[k] = clamp(base[i] + r.int(-8, 8), 5, 70)));
    S.money = [500, 3000, 30000, 300000][S.fam.wealth];
    // 特质
    const pool = Object.keys(CITY.TRAITS).filter((k) => { const T = CITY.TRAITS[k]; return T.birth !== false && (!T.req || CITY.test(S, T.req)); });
    const n = r.chance(0.3) ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const left = pool.filter((k) => !S.traits.includes(k) && !(CITY.TRAITS[k].ex || []).some((x) => S.traits.includes(x))
        && (S.rulesVersion < 3 || !S.traits.some((x) => (CITY.TRAITS[x].ex || []).includes(k))));
      const t = r.wpick(left, (k) => {
        const previous = S.rulesVersion >= 2 ? S.memory.births.slice(-3).filter((b) => (b.traits || []).includes(k)).length : 0;
        return (CITY.TRAITS[k].w || 10) / (1 + previous * 1.5);
      });
      if (!t) break;
      S.traits.push(t);
      CITY.TRAITS[t].on && CITY.TRAITS[t].on(S);
    }
    S.focus = 'play';
  };
  CITY.wealthName = (w) => ['赤贫', '拮据', '小康', '富裕'][w];
  CITY.parentsName = { both: '父母双全', mother: '由母亲抚养', father: '由父亲抚养', none: '无父无母' };

  // ---------- 特质 ----------
  // w: 抽取权重; on: 出生时; tick: 每年; luck: 判定加成
  CITY.TRAITS = {
    '强韧体魄': { w: 10, desc: '骨头比后巷的铁管还硬几分，挨上两记闷棍也能咬牙爬起来。', on: (S) => (S.st.body += 15), ex: ['体弱多病'] },
    '体弱多病': { w: 7, desc: '打小就是个药罐子，吹一阵后巷的冷风都能咳上半个月。', on: (S) => (S.st.body -= 15), ex: ['强韧体魄'] },
    '聪慧': { w: 10, desc: '脑子转得极快，无论是工坊图纸还是合同里的霸王条款都一点就透。', on: (S) => (S.st.wit += 15) },
    '战斗直觉': { w: 6, desc: '刀尖还没破风，你的肌肉就已经先一步替你做出了格挡反应。', on: (S) => (S.st.skill += 12) },
    '讨人喜欢': { w: 9, desc: '天生带着几分让人放下戒心的亲和力，连冷脸管事都愿意多跟你说两句。', on: (S) => (S.st.social += 12) },
    '坚韧心志': { w: 8, desc: '心肠像淬过火的老铁，再血腥的场面也休想轻易压垮你的神智。', on: (S) => (S.st.mind += 15), tick: (S) => (S.dist = Math.max(0, S.dist - 1)) },
    '神经过敏': { w: 6, desc: '窗外掉根铁钉都能让你惊出一身冷汗，整夜盯着门栓睡不踏实。', on: (S) => (S.st.mind -= 10), ex: ['坚韧心志'] },
    '浓烈的执念': { w: 5, desc: '心底死死攥着某样绝不肯放手的东西——在都市里，这往往是一切奇迹与扭曲的温床。', tick: (S) => (S.dist += 0.6) },
    '好运': { w: 5, desc: '流弹偏寸、赌盘翻红。在朝不保夕的都市里，这比任何奇点造物都金贵。', luck: 0.06, ex: ['霉运'] },
    '霉运': { w: 5, desc: '塌方的天花板与走火的流弹总能精准地找上你，连喝凉水都塞牙。', luck: -0.06, ex: ['好运'] },
    '义体亲和': { w: 5, desc: '你的神经天生契合冰冷的钢铁，换上改装义肢就像原本就长在身上一样顺手。' },
    '过目不忘': { w: 5, desc: '扫过一眼的账目、街图与面孔，像拿钢针刻在脑仁里一样分毫不差。', on: (S) => (S.st.wit += 8) },
    '巧手': { w: 7, desc: '十指灵巧稳当，拆装发条、焊接线路或是缝合血口子都游刃有余。' },
    '剑术天分': { w: 4, desc: '握住刀柄的那一刻，呼吸与刀锋自然连成一线，手腕稳得不晃分毫。', on: (S) => (S.st.skill += 6) },
    '能说会道': { w: 8, desc: '见人说人话、见鬼说鬼话，三言两语就能把死局盘活。', on: (S) => (S.st.social += 6), ex: ['沉默寡言'] },
    '沉默寡言': { w: 7, desc: '平时半天憋不出一句话，却在暗处把每个人的动作与软肋记了满肚子。', on: (S) => (S.st.mind += 5, S.st.social -= 5), ex: ['能说会道'] },
    '夜行者': { w: 5, desc: '天生对黑暗与时刻有着野兽般的警觉，永远知道哪一分钟必须退回门内。' },
    '好胃口': { w: 6, desc: '铁打的肠胃，无论是合成淀粉糊还是来历不明的后巷肉派都能面不改色地咽下去。', on: (S) => (S.st.body += 5) },
    '冷血': { w: 4, desc: '路边的冻骨与身旁的惨叫都很难在你的瞳孔里惊起半点波澜。', on: (S) => (S.st.mind += 6, S.st.social -= 6) },
    '烂好人': { w: 6, desc: '在这座连善意都要收税的都市里，你偏偏还改不掉伸手拉人一把的毛病。', on: (S) => (S.st.social += 5), ex: ['冷血'] },
    '贪财': { w: 6, desc: '这世上没有什么歌声，比钞票点算声与眼落进钱袋的叮当声更动听。' },
    '美貌': { w: 6, desc: '一副万里挑一的好皮囊，无论在体面的巢还是肮脏的后巷都会招来额外的注视。', on: (S) => (S.st.social += 6) },
    '大胃袋': { w: 0, desc: '' },
    '家族遗物': { w: 3, desc: '贴身藏着一件长辈留下的古旧器物，上面磨平的刻痕似乎牵连着某段往事。', req: { loc: ['backstreet', 'outskirts'] } },
    '名门之后': { w: 3, desc: '你的姓氏在巢内高层的酒会上还算叫得响，生来便比旁人多一笔丰厚的启动金。', req: { loc: 'nest' }, on: (S) => (S.st.social += 8, S.money += 200000) },
    '郊区之子': { w: 30, desc: '你在都市高墙之外的废土降生，从小听着非人怪物的嘶吼磨出了钢筋般的神经。', req: { loc: 'outskirts' }, on: (S) => (S.st.body += 8, S.st.mind += 5) },
    '早熟': { w: 7, desc: '还没长到灶台高，就已经看懂了大人们在柴米油盐与生死面前的脸色。', on: (S) => (S.st.mind += 6, S.st.wit += 4) },
  };
  delete CITY.TRAITS['大胃袋'];

  // ---------- 职业 ----------
  const W = (n) => n * 10000;
  // 零协会译名：拇指 士兵/指挥官/二老板；食指 苦行者/传令员/代行者；中指 幼弟(幼妹)/幼兄(幼姊)/父辈；环指 野兽派学徒/讲解员
  CITY.FINGER_RANKS = {
    thumb: ['拇指 士兵', '拇指 指挥官', '拇指 二老板', '拇指 二老板'],
    index: ['食指 苦行者', '食指 代行者', '食指 代行者', '食指 代行者'],
    middle: ['中指 幼弟', '中指 幼兄', '中指 父辈', '中指 父辈'],
    middle_f: ['中指 幼妹', '中指 幼姊', '中指 父辈', '中指 父辈'],
    ring: ['环指 野兽派学徒', '环指 野兽派讲解员', '环指 野兽派讲解员', '环指 大师'],
  };
  CITY.JOBS = {
    none: { name: (S) => (S.age < 6 ? '幼童' : S.age < 18 ? '无所事事的孩子' : '无业'), income: (S) => (S.age >= 18 ? -W(2) : 0), danger: 0 },
    student: { name: (S) => S.job.org || '学生', income: (S) => (S.loc === 'nest' ? -W(3) : -W(0.5)), danger: 0 },
    labor: { name: (S) => S.job.org || '后巷零工', income: (S) => W(3 + S.job.rank), danger: 0.003 },
    shop: { name: (S) => S.job.org || '店员', income: (S) => W(4 + S.job.rank * 2), danger: 0.002 },
    chef: { name: (S) => S.job.org || '厨师', income: (S) => W(5 + S.job.rank * 3), danger: 0.002 },
    mech: { name: (S) => S.job.org || '工坊技师', income: (S) => W(6 + S.job.rank * 6), danger: 0.003 },
    doctor: { name: (S) => S.job.org || '后巷诊所医生', income: (S) => W(8 + S.job.rank * 5), danger: 0.003 },
    clerk: { name: (S) => S.job.org || '巢内公司职员', income: (S) => W(12 + S.job.rank * 6), danger: 0.001 },
    research: { name: (S) => S.job.org || '研究员', income: (S) => W(18 + S.job.rank * 10), danger: 0.002 },
    fixer: {
      name: (S) => (S.flags.color ? (S.vars.colorName ? '特色「' + S.vars.colorName + '」' : '特色') : (S.job.org ? S.job.org + ' ' : '') + S.job.rank + '阶收尾人'),
      income: (S) => (S.flags.color ? W(800) : W([0, 300, 150, 80, 40, 22, 12, 7, 4, 2][S.job.rank] || 2)),
      danger: (S) => (S.flags.color ? 0.015 : 0.008 + (S.job.rank >= 7 ? 0.008 : 0.004)),
      promote: (S, n) => { S.job.rank = Math.max(1, S.job.rank - n); },
      tick: (S) => { S.st.skill = Math.min(100, S.st.skill + (S.st.skill < 60 ? 1.2 : 0.5)); S.st.body = Math.min(100, S.st.body + 0.4); if (S.focus === 'work') { S.c.req = (S.c.req || 0) + 1; } if (S.st.skill >= 40 + (9 - S.job.rank) * 5) S.job.merit += 1; },
    },
    wing: {
      name: (S) => S.job.org || ((S.vars.wingJob || S.wing + '公司') + ' 职员'),
      income: (S) => W(20 + S.job.rank * 12),
      danger: (S) => (S.vars.wingDanger || 0.003),
    },
    syndicate: { name: (S) => (S.job.org || '后巷帮派') + ' 成员', income: (S) => W(3 + S.job.rank * 4), danger: 0.025 },
    finger: {
      name: (S) => { const R = CITY.FINGER_RANKS[S.vars.finger + (S.vars.finger === 'middle' && S.gender === 'f' ? '_f' : '')] || ['手指 成员']; return R[Math.min(R.length - 1, S.job.rank)] || R[0]; },
      income: (S) => W(10 + S.job.rank * 25), danger: 0.03,
    },
    kurokumo: { name: (S) => ['黑云会 若众', '黑云会 若众', '黑云会 副会长', '黑云会 会长'][Math.min(3, S.job.rank)], income: (S) => W(8 + S.job.rank * 20), danger: 0.025 },
    blade: { name: (S) => (S.job.rank >= 2 ? '剑契组 头领' : '剑契组 杀手'), income: (S) => W(2 + S.job.rank * 2), danger: 0.03 },
    heishou: { name: (S) => '黑兽 - ' + (S.vars.branch || '卯'), income: (S) => W(15 + S.job.rank * 20), danger: 0.02 },
    lccb: { name: (S) => 'LCCB ' + (['职员', '职员', '系长', '科长'][Math.min(3, S.job.rank)]), income: (S) => W(25 + S.job.rank * 15), danger: 0.025 },
    retired: { name: (S) => '退休' + (S.flags['曾任_fixer'] ? '收尾人' : ''), income: (S) => -W(1), danger: 0 },
    distorted: { name: (S) => S.vars.distName || '扭曲体', income: () => 0, danger: 0.03 },
    book: { name: () => '图书馆中的一本书', income: () => 0, danger: 0 },
  };
  CITY.jobTitle = function (S, final) {
    const J = CITY.JOBS[S.job.id] || CITY.JOBS.none;
    let n = typeof J.name === 'function' ? J.name(S) : J.name;
    if (final && S.job.id === 'none' && S.age >= 18) n = '无固定职业';
    return n;
  };

  // ---------- 年度方针 ----------
  const up = (S, k, n) => { const v = S.st[k]; const g = v > 80 ? n * 0.3 : v > 60 ? n * 0.6 : n; S.st[k] = clamp(v + g, 0, 100); };
  CITY.FOCUS = {
    play: { name: '玩耍', age: [0, 13], desc: '在巷弄与瓦砾间疯跑 · 体魄↑ 理智↑ 人脉↑', tick: (S) => { up(S, 'social', 1.2); up(S, 'mind', 0.8); up(S, 'body', 0.8); } },
    study: { name: '读书', age: [6, 99], desc: '苦读条文与算学 · 才智↑', tick: (S) => { up(S, 'wit', 2.6); S.st.body -= 0.3; } },
    train: { name: '锻炼', age: [8, 99], desc: '打磨筋骨与刀术 · 体魄↑ 武艺↑', tick: (S) => { up(S, 'body', 1.6); up(S, 'skill', 1.8); } },
    friends: { name: '交际', age: [8, 99], desc: '走动人情与酒局 · 人脉↑', tick: (S) => { up(S, 'social', 2.4); up(S, 'mind', 0.4); } },
    street: { name: '街头厮混', age: [10, 25], desc: '暗巷摸爬滚打 · 武艺↑ 人脉↑，惹祸↑', req: { loc: ['backstreet', 'outskirts'] }, tick: (S) => { up(S, 'skill', 1.6); up(S, 'social', 1); S.c.street = (S.c.street || 0) + 1; } },
    work: { name: '埋头工作', age: [14, 99], desc: '拿命熬夜赶工 · 收入↑ 功绩↑ 理智↓', tick: (S) => { S.money += Math.max(5000, CITY.income(S) * 0.25); S.job.merit += 1; S.st.mind -= 0.8; } },
    rest: { name: '休养', age: [14, 99], desc: '闭门养伤喘息 · 体魄↑ 理智↑ 收入↓', tick: (S) => { up(S, 'mind', 2.4); up(S, 'body', 1.2); S.money -= Math.max(0, CITY.income(S) * 0.3); S.dist = Math.max(0, S.dist - 3); } },
  };
  CITY.focusList = (S) => Object.keys(CITY.FOCUS).filter((k) => { const F = CITY.FOCUS[k]; return S.age >= F.age[0] && S.age <= F.age[1] && (!F.req || CITY.test(S, F.req)); });

  CITY.income = function (S) {
    const J = CITY.JOBS[S.job.id] || CITY.JOBS.none;
    return typeof J.income === 'function' ? J.income(S) : J.income || 0;
  };

  // ---------- 每年被动 ----------
  CITY.passive = function (S) {
    // 收入
    if (S.age >= 14 || S.job.id !== 'none') S.money += Math.round(CITY.income(S) * (0.8 + S.rng.next() * 0.4));
    // 家庭供养
    if (S.age < 18 && S.fam.parents !== 'none') S.money += [800, 1500, 3000, 20000][S.fam.wealth];
    if (S.age < 16 && S.money < 0) S.money = 0; // 孩子的债由大人背着
    // 衰老
    if (S.age > 45) S.st.body = clamp(S.st.body - (S.age > 70 ? 2.2 : S.age > 58 ? 1.4 : 0.7), 0, 100);
    if (S.age > 65) S.st.wit = clamp(S.st.wit - 0.5, 0, 100);
    if (S.age > 50) S.st.skill = clamp(S.st.skill - 0.6, 0, 100);
    // 人会慢慢习惯：理智与体魄向常态回归（伤病之后的恢复）
    const mBase = 50 + (S.spouse && S.spouse.alive ? 5 : 0) + (S.traits.includes('坚韧心志') ? 8 : 0) - (S.traits.includes('神经过敏') ? 8 : 0);
    if (S.st.mind < mBase) S.st.mind += (mBase - S.st.mind) * 0.15;
    if (S.age < 50 && S.st.body < 45) S.st.body += (45 - S.st.body) * 0.1;
    // 理智低下累积扭曲
    const effectiveMind = CITY.stat ? CITY.stat(S, 'mind') : S.st.mind;
    if (effectiveMind < 15) S.dist += 2;
    else if (effectiveMind > 60) S.dist = Math.max(0, S.dist - 1.2);
    else if (effectiveMind > 45) S.dist = Math.max(0, S.dist - 0.5);
    // 债务
    if (S.money < 0) { S.c.debtYears = (S.c.debtYears || 0) + 1; S.st.mind = clamp(S.st.mind - 2, 0, 100); S.flags.debt = true; }
    else { S.c.debtYears = 0; delete S.flags.debt; }
    S.dist = clamp(S.dist, 0, 100);
    for (const k in S.st) S.st[k] = clamp(S.st[k], 0, 100);
  };

  // ---------- 死亡率 ----------
  // 规则7：第一段人生在12岁前不会死去，让新玩家至少走到能自己做决定的年纪。
  CITY.protectedChild = S => S.rulesVersion >= 7 && S.firstLife && S.age < 12;
  CITY.mortality = function (S) {
    const a = S.age;
    if (CITY.protectedChild(S)) return 0;
    let p = a < 2 ? 0.01 : a < 15 ? 0.0015 : a < 40 ? 0.002 : 0.002 + 0.002 * Math.exp((a - 40) / 10);
    if (S.loc === 'backstreet') p += 0.002;
    // 郊区仍然危险，但孩子多半有大人看着；规则7把童年的额外风险降到成年的三分之一。
    if (S.loc === 'outskirts') p += S.rulesVersion >= 7 && a < 15 ? 0.005 : 0.015;
    const J = CITY.JOBS[S.job.id];
    if (J && J.danger) p += typeof J.danger === 'function' ? J.danger(S) : J.danger;
    const body = CITY.stat ? CITY.stat(S, 'body') : S.st.body;
    if (body < 15) p *= 2.2; else if (body < 30) p *= 1.4; else if (body > 70) p *= 0.7;
    if (S.flags.debt && (S.c.debtYears || 0) > 2) p += 0.01;
    if (S.flags.immortal) p = 0;
    if (S.flags.bloodfiend) p = Math.min(p, 0.004);
    return Math.min(0.9, p);
  };

  CITY.deathCause = function (S) {
    const r = S.rng, a = S.age, j = S.job.id;
    const C = [];
    const add = (w, t) => C.push({ w, t });
    if (a < 3) { add(10, '还没学会说话，便因一场来势汹汹的高烧停止了呼吸。后巷的黑诊所当晚紧闭着铁门。'); add(4, '在一个供暖断绝的刺骨寒冬里，再也没能从摇篮中醒来。'); }
    if (a < 14) {
      if (a >= 3) {
        add(6, '染上了一场谁也叫不出名字的急症。家里的罐子翻了个底朝天，也没凑出买半支稀释安瓿的钱。');
        add(3, '在街口追逐玩耍时，被一辆赶着送货、毫无减速的改装重卡撞飞进了污水沟。');
        if (S.loc === 'backstreet') { add(5, '某个阴沉的傍晚攥着零钱出门跑腿，从此再也没有回到那扇铁门后面。'); add(3, '放学路上误入两伙帮派火并的十字街口，呼啸的流弹从不挑拣孩子的胸膛。'); }
        if (S.loc === 'outskirts') add(6, '在营地铁丝网外捡拾废铁时，被沙暴里伸出的一只冰冷巨爪无声地拖进了废墟。');
        if (S.loc === 'nest') add(4, '一场突如其来的器质性病变，即便送进了巢内洁白无菌的综合医院也没能抢救回来。');
      }
      return r.wpick(C, (x) => x.w / (S.rulesVersion >= 2 ? Math.sqrt(1 + (S.memory.deaths[x.t] || 0)) : 1)).t;
    }
    if (a >= 60) { add(20, '在某个寻常的深夜里，于睡梦中安静地停止了呼吸。'); add(10, '一场大病抽干了最后一点油水，卧床半月后再也没能站起来。'); add(6, '某天清晨端坐在窗边的旧藤椅上，迎着灰白的天色永远闭上了眼睛。'); }
    if (S.loc === 'backstreet') { add(5, '凌晨三点十三分之后还没能跑回家门。第二天清晨，巷子里只剩下一只咬烂的鞋——后巷深宵的清道夫来过了。'); add(4, '在昏暗的死胡同里被几个红了眼的耗子捅穿了脾脏。对方只是想翻走你兜里的几百眼零钞。'); add(2, '下班途中被卷进两家帮派争夺地盘的血战，流弹不认人。'); }
    if (S.loc === 'outskirts') add(8, '在郊区的铅灰荒原上，被某种人类语言无法形容的怪物拖进了地缝深处。');
    if (j === 'fixer') { add(18, '在一次收尾人委托中力竭殉职。事务所只给家里寄去了一份不到三行字的阵亡通知单。'); add(6, '委托目标的真实威胁评级远超情报所写，你在交锋的第三合便被连刀带人劈碎在了现场。'); add(3, '在任务交割点被利欲熏心的同行从背后捅穿了心脏，连悬赏带性命一块儿换了别人的功绩。'); }
    if (j === 'syndicate' || j === 'kurokumo' || j === 'finger') { add(16, '在帮派内部的血腥清洗中倒在了自家堂口的地板上。'); add(5, '被高阶收尾人半夜踹开了房门——委托书上的任务内容只有冷冰冰的“清除”二字。'); }
    if (j === 'finger' && S.vars.finger === 'index') add(10, '未能在规定时限内完成纺织机降下的指令，迎来了食指代行者的处刑。');
    if (j === 'blade') add(14, '在某条落雨暗巷的尽头，与对手同时拔刀出鞘。最终只有一个人缓缓收刀入鞘，而那个人不是你。');
    if (j === 'wing') { add(8, '死于一场被严密封锁消息的“公司内部业务事故”。保密协议扣完违约金后，抚恤金准时打进了家属账户。'); }
    if (S.flags.debt && a >= 18) add(8, '到底没能还上滚雪球般的高利贷。催债人带着黑医踹开门，收走了你身上所有能按斤变卖的零件与器官。');
    if (S.st.body < 25) add(8, '长年透支的破败身躯终于熬干了最后一滴灯油，在某个清晨彻底散了架。');
    if (S.pros >= 3) add(4, '全身多处改装义体在某个雨夜爆发了致命的连锁排异与神经短路。');
    add(2, '在下班回家的路上，遭遇了一场连收尾人都不愿深究原因的离奇事故。');
    add(1, '在都市某处突发的高危灾害波及下，连同半条街的建筑一起化作了瓦砾。');
    const era = CITY.eraOf(S.wy);
    if (era === 'dist') { add(4, '被一只毫无征兆在街角破茧而出的扭曲体正面波及。等协会的讨伐队赶到拉起警戒线时，现场已经没有活口了。'); add(2, '在一次高危扭曲讨伐的封锁区边缘，被穿透铁板的重武器流弹击中。'); }
    if (era === 'lob') add(2, '死于一场被各大报纸轻描淡写报道为“地下能源管线例行检修”的惨烈事故。');
    if (S.flags.debt && a >= 18) add(3, '在一个滴水成冰的寒冬，因为欠债交不起暖气费与药钱，悄无声息地冻僵在了硬板床上。');
    if (a >= 18 && a < 60) { add(2, '在街边面馆埋头吃面时，被邻桌突然暴起的收尾人死斗掀飞的刀气割断了喉咙。'); add(1, '收到了一份门牌号写错一格的“目标清除”委托——直到刀锋临头，对方才发现杀错了人。'); }
    if (S.job.id === 'chef') add(3, '后厨年久失修的高压燃气罐在晚高峰轰然炸裂。');
    if (S.job.id === 'mech') add(3, '工作台上一件正在带电调试的禁忌工坊兵器突然失控走火。');
    if (S.job.id === 'doctor') add(3, '手术台上一名神智错乱的帮派伤员醒来后，没有掏诊金，而是直接抓起了托盘里的解剖刀。');
    if (S.job.id === 'labor') add(3, '码头货场锈蚀的钢丝吊索在半空崩断，数吨重的集装箱砸落下来。');
    return r.wpick(C, (x) => x.w / (S.rulesVersion >= 2 ? Math.sqrt(1 + (S.memory.deaths[x.t] || 0)) : 1)).t;
  };

  // ---------- 墓志 ----------
  CITY.makeEpitaph = function (S) {
    const birthplace = S.rulesVersion >= 2 ? S.birthHome : S.home;
    const personal = S.rulesVersion >= 2 && CITY.lifeSummary ? CITY.lifeSummary(S) : '';
    if (S.age < 16) return '生于' + birthplace + '，只活了' + S.age + '年。都市没有记住这个名字，但总有人记得。' + personal;
    const parts = [];
    parts.push('生于' + birthplace + '，');
    if (S.titles.length) parts.push('人称「' + S.titles[S.titles.length - 1] + '」，');
    parts.push('作为' + CITY.jobTitle(S, true) + '，');
    parts.push('活了' + S.age + '年。');
    if (S.rulesVersion >= 4 && CITY.storySummary) parts.push(CITY.storySummary(S));
    if (S.rulesVersion >= 2) {
      if (personal) parts.push(personal);
      else if (S.spouse && S.spouse.alive) parts.push('你们共用那把门钥匙，已经' + (S.age - S.spouse.since) + '年。');
      else if (S.c.req >= 10) parts.push('委托记录上留下了' + S.c.req + '次结算。');
      else if (S.flags.widowed && S.spouse && !S.spouse.left) parts.push('你比' + S.spouse.name + '多活了几年。');
      else if (S.flags['曾任_wing']) parts.push('公司曾给过你一个编号，后来又收了回去。');
      else if (S.birthHome !== S.home) parts.push('最后的住址已经离出生的地方很远。');
    }
    return parts.join('');
  };

  CITY.fmtMoney = function (n) {
    const s = n < 0 ? '-' : '';
    n = Math.abs(n);
    if (n >= 1e8) return s + (n / 1e8).toFixed(2).replace(/\.?0+$/, '') + '亿眼';
    if (n >= 1e4) return s + (n / 1e4).toFixed(1).replace(/\.0$/, '') + '万眼';
    return s + Math.round(n) + '眼';
  };
})();
