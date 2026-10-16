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
    K: { name: 'K公司', w: 10, desc: '以HP安瓿与再生技术闻名的翼' },
    L: { name: 'L公司', w: 10, desc: '脑叶公司。以“能源”供给整座都市', era: ['lob'] },
    R: { name: 'R公司', w: 8, desc: '豢养第四集团军的翼' },
    T: { name: 'T公司', w: 8, desc: '掌管“时间”的翼' },
    W: { name: 'W公司', w: 10, desc: '运营WARP列车的翼' },
    U: { name: 'U公司', w: 6, desc: '临着大湖的翼' },
    H: { name: 'H公司', w: 6, desc: '鸿园与贾家所在的翼' },
    N: { name: 'N公司', w: 6, desc: '钉与锤活跃的翼' },
    J: { name: 'J公司', w: 6, desc: '赌场与当铺林立的翼' },
  };

  // ---------- 出生 ----------
  CITY.birth = function (S, opt) {
    const r = S.rng;
    S.wy = opt.wy != null ? opt.wy : opt.era === 'lob' ? r.int(-55, -25) : opt.era === 'dist' ? r.int(1, 8) : r.int(-50, 5);
    if (!S.name) S.name = CITY.randName(r, S.gender);
    const roll = r.next();
    const era = CITY.eraOf(S.wy);
    if (roll < 0.2) {
      S.loc = 'nest';
      const ws = Object.keys(CITY.WINGS).filter((k) => !CITY.WINGS[k].era || CITY.WINGS[k].era.includes(era));
      S.wing = r.wpick(ws, (k) => CITY.WINGS[k].w);
      S.home = S.wing + '巢';
      S.d = r.int(1, 25);
      S.fam.wealth = r.chance(0.25) ? 3 : 2;
    } else if (roll < 0.97) {
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
    const pool = Object.keys(CITY.TRAITS).filter((k) => { const T = CITY.TRAITS[k]; return !T.req || CITY.test(S, T.req); });
    const n = r.chance(0.3) ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const left = pool.filter((k) => !S.traits.includes(k) && !(CITY.TRAITS[k].ex || []).some((x) => S.traits.includes(x)));
      const t = r.wpick(left, (k) => CITY.TRAITS[k].w || 10);
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
    '强韧体魄': { w: 10, desc: '骨头比别人硬一点。', on: (S) => (S.st.body += 15), ex: ['体弱多病'] },
    '体弱多病': { w: 7, desc: '从小就常往诊所跑。', on: (S) => (S.st.body -= 15), ex: ['强韧体魄'] },
    '聪慧': { w: 10, desc: '学什么都快。', on: (S) => (S.st.wit += 15) },
    '战斗直觉': { w: 6, desc: '身体比脑子先一步做出反应。', on: (S) => (S.st.skill += 12) },
    '讨人喜欢': { w: 9, desc: '总能交到朋友。', on: (S) => (S.st.social += 12) },
    '坚韧心志': { w: 8, desc: '很难被击垮。', on: (S) => (S.st.mind += 15), tick: (S) => (S.dist = Math.max(0, S.dist - 1)) },
    '神经过敏': { w: 6, desc: '风吹草动都会让你睡不着。', on: (S) => (S.st.mind -= 10), ex: ['坚韧心志'] },
    '浓烈的执念': { w: 5, desc: '一旦认定了什么，就不会放手。', tick: (S) => (S.dist += 0.6) },
    '好运': { w: 5, desc: '在都市里，这比什么都珍贵。', luck: 0.06, ex: ['霉运'] },
    '霉运': { w: 5, desc: '坏事总是先找上你。', luck: -0.06, ex: ['好运'] },
    '义体亲和': { w: 5, desc: '身体对义体几乎没有排异反应。' },
    '过目不忘': { w: 5, desc: '看过一遍的东西就能记住。', on: (S) => (S.st.wit += 8) },
    '巧手': { w: 7, desc: '修理、拼装、缝补，样样在行。' },
    '剑术天分': { w: 4, desc: '握住刀的时候，手很稳。', on: (S) => (S.st.skill += 6) },
    '能说会道': { w: 8, desc: '三言两语就能把人说动。', on: (S) => (S.st.social += 6), ex: ['沉默寡言'] },
    '沉默寡言': { w: 7, desc: '不爱说话，但记得每一件事。', on: (S) => (S.st.mind += 5, S.st.social -= 5), ex: ['能说会道'] },
    '夜行者': { w: 5, desc: '你天生知道什么时候该待在屋里。' },
    '好胃口': { w: 6, desc: '什么都能吃下去。真的，什么都。', on: (S) => (S.st.body += 5) },
    '冷血': { w: 4, desc: '别人的死活很难打动你。', on: (S) => (S.st.mind += 6, S.st.social -= 6) },
    '烂好人': { w: 6, desc: '明知会吃亏，还是会伸出手。', on: (S) => (S.st.social += 5), ex: ['冷血'] },
    '贪财': { w: 6, desc: '眼的声音最好听。' },
    '美貌': { w: 6, desc: '无论走到哪里都会被多看两眼。', on: (S) => (S.st.social += 6) },
    '大胃袋': { w: 0, desc: '' },
    '家族遗物': { w: 3, desc: '家里传下来一件不知道来历的旧物。', req: { loc: ['backstreet', 'outskirts'] } },
    '名门之后': { w: 3, desc: '你的家族在巢里还算有些名气。', req: { loc: 'nest' }, on: (S) => (S.st.social += 8, S.money += 200000) },
    '郊区之子': { w: 30, desc: '你在都市之外出生，见过墙外的东西。', req: { loc: 'outskirts' }, on: (S) => (S.st.body += 8, S.st.mind += 5) },
    '早熟': { w: 7, desc: '还没长大，就已经懂了很多事。', on: (S) => (S.st.mind += 6, S.st.wit += 4) },
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
    play: { name: '玩耍', age: [0, 13], desc: '小孩子就该玩。', tick: (S) => { up(S, 'social', 1.2); up(S, 'mind', 0.8); up(S, 'body', 0.8); } },
    study: { name: '读书', age: [6, 99], desc: '才智↑', tick: (S) => { up(S, 'wit', 2.6); S.st.body -= 0.3; } },
    train: { name: '锻炼', age: [8, 99], desc: '体魄↑ 武艺↑', tick: (S) => { up(S, 'body', 1.6); up(S, 'skill', 1.8); } },
    friends: { name: '交际', age: [8, 99], desc: '人脉↑', tick: (S) => { up(S, 'social', 2.4); up(S, 'mind', 0.4); } },
    street: { name: '街头厮混', age: [10, 25], desc: '武艺↑ 人脉↑，惹祸↑', req: { loc: ['backstreet', 'outskirts'] }, tick: (S) => { up(S, 'skill', 1.6); up(S, 'social', 1); S.c.street = (S.c.street || 0) + 1; } },
    work: { name: '埋头工作', age: [14, 99], desc: '收入↑ 功绩↑ 理智↓', tick: (S) => { S.money += Math.max(5000, CITY.income(S) * 0.25); S.job.merit += 1; S.st.mind -= 0.8; } },
    rest: { name: '休养', age: [14, 99], desc: '体魄↑ 理智↑ 收入↓', tick: (S) => { up(S, 'mind', 2.4); up(S, 'body', 1.2); S.money -= Math.max(0, CITY.income(S) * 0.3); S.dist = Math.max(0, S.dist - 3); } },
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
    if (S.st.mind < 15) S.dist += 2;
    else if (S.st.mind > 60) S.dist = Math.max(0, S.dist - 1.2);
    else if (S.st.mind > 45) S.dist = Math.max(0, S.dist - 0.5);
    // 债务
    if (S.money < 0) { S.c.debtYears = (S.c.debtYears || 0) + 1; S.st.mind = clamp(S.st.mind - 2, 0, 100); S.flags.debt = true; }
    else { S.c.debtYears = 0; delete S.flags.debt; }
    S.dist = clamp(S.dist, 0, 100);
    for (const k in S.st) S.st[k] = clamp(S.st[k], 0, 100);
  };

  // ---------- 死亡率 ----------
  CITY.mortality = function (S) {
    const a = S.age;
    let p = a < 2 ? 0.01 : a < 15 ? 0.0015 : a < 40 ? 0.002 : 0.002 + 0.002 * Math.exp((a - 40) / 10);
    if (S.loc === 'backstreet') p += 0.002;
    if (S.loc === 'outskirts') p += 0.015;
    const J = CITY.JOBS[S.job.id];
    if (J && J.danger) p += typeof J.danger === 'function' ? J.danger(S) : J.danger;
    if (S.st.body < 15) p *= 2.2; else if (S.st.body < 30) p *= 1.4; else if (S.st.body > 70) p *= 0.7;
    if (S.flags.debt && (S.c.debtYears || 0) > 2) p += 0.01;
    if (S.flags.immortal) p = 0;
    if (S.flags.bloodfiend) p = Math.min(p, 0.004);
    return Math.min(0.9, p);
  };

  CITY.deathCause = function (S) {
    const r = S.rng, a = S.age, j = S.job.id;
    const C = [];
    const add = (w, t) => C.push({ w, t });
    if (a < 3) { add(10, '还没学会说话，就因一场高烧离开了。后巷的诊所当晚没有开门。'); add(4, '在一个寒冷的冬天，没能醒来。'); }
    if (a < 14) {
      if (a >= 3) {
        add(6, '得了一场谁也说不清的病。家里凑不出买安瓿的钱。');
        add(3, '在街上玩的时候，被一辆没有减速的货车撞倒了。');
        if (S.loc === 'backstreet') { add(5, '一个傍晚出门买东西，再也没有回来。'); add(3, '被卷进了大人们的一场火并，流弹不认人。'); }
        if (S.loc === 'outskirts') add(6, '在营地外面玩耍时，被某种东西拖走了。');
        if (S.loc === 'nest') add(4, '一场突发的病，连巢里的医院也没能救回来。');
      }
      return r.wpick(C, (x) => x.w).t;
    }
    if (a >= 60) { add(20, '在睡梦中安静地停止了呼吸。'); add(10, '病倒之后，没能再站起来。'); add(6, '某天清晨坐在窗边，再也没有动过。'); }
    if (S.loc === 'backstreet') { add(5, '凌晨三点之后还没有回家。第二天，巷子里只剩下一滩血迹。清道夫来过了。'); add(4, '在后巷被一伙不认识的人捅了一刀。对方只是想要钱包。'); add(2, '被卷入两个帮派的火并之中。流弹不认人。'); }
    if (S.loc === 'outskirts') add(8, '在郊区，被某种说不出名字的东西拖走了。');
    if (j === 'fixer') { add(18, '在一次委托中殉职。事务所寄来了一份简短的通知。'); add(6, '委托目标比情报里写的要强得多。'); add(3, '被同行出卖，死在了交接现场。'); }
    if (j === 'syndicate' || j === 'kurokumo' || j === 'finger') { add(16, '在帮派的清算中倒下了。'); add(5, '被收尾人找上门来。委托内容是“清除”。'); }
    if (j === 'finger' && S.vars.finger === 'index') add(10, '没能完成指令。');
    if (j === 'blade') add(14, '在某条巷子的尽头，与对手同时拔刀。只有一个人收刀入鞘，那不是你。');
    if (j === 'wing') { add(8, '死于一次“业务事故”。公司的赔偿金准时到账。'); }
    if (S.flags.debt && a >= 18) add(8, '还不上债。有人来收走了能变卖的一切，包括你的身体。');
    if (S.st.body < 25) add(8, '身体终于撑不下去了。');
    if (S.pros >= 3) add(4, '义体出现了严重的排异反应。');
    add(2, '在下班路上，遭遇了一场谁也说不清原因的事故。');
    add(1, '死在一场城市级灾害的波及之中。');
    const era = CITY.eraOf(S.wy);
    if (era === 'dist') { add(4, '被一只突然出现在街角的扭曲体波及。讨伐队赶到时，已经来不及了。'); add(2, '在一次扭曲讨伐的封锁区边缘，被流弹击中。'); }
    if (era === 'lob') add(2, '死于一场被报道为“能源设施检修”的事故。');
    if (S.flags.debt && a >= 18) add(3, '在一个寒冷的冬天，交不起暖气费，也交不起药钱。');
    if (a >= 18 && a < 60) { add(2, '在面馆里吃面的时候，被卷进了邻桌的一场冲突。'); add(1, '收到了一份写错地址的“清除”委托——被清除的人是你。'); }
    if (S.job.id === 'chef') add(3, '后厨的燃气罐爆炸了。');
    if (S.job.id === 'mech') add(3, '一件正在调试的工坊武器突然启动了。');
    if (S.job.id === 'doctor') add(3, '一个病人醒来后，没有付钱，而是拿起了手术刀。');
    if (S.job.id === 'labor') add(3, '货场的吊绳断了。');
    return r.wpick(C, (x) => x.w).t;
  };

  // ---------- 墓志 ----------
  CITY.makeEpitaph = function (S) {
    if (S.age < 16) return '生于' + S.home + '，只活了' + S.age + '年。都市没有记住这个名字，但总有人记得。';
    const parts = [];
    parts.push('生于' + S.home + '，');
    if (S.titles.length) parts.push('人称「' + S.titles[S.titles.length - 1] + '」，');
    parts.push('作为' + CITY.jobTitle(S, true) + '，');
    parts.push('活了' + S.age + '年。');
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
