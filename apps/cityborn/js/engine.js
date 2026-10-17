/* 生于都市 —— 人生模拟引擎
 * 纯数据驱动：事件、特质、职业、成就都在 js/data/ 下注册。
 * 事件 DSL 说明见 docs/CONTENT_GUIDE.md
 */
(function () {
  'use strict';
  const CITY = (window.CITY = window.CITY || {});
  CITY.events = CITY.events || [];
  CITY.ach = CITY.ach || {};
  CITY.addEvents = function (mod, list) {
    for (const e of list) { e.mod = mod; CITY.events.push(e); }
  };
  CITY.addAch = function (map) { Object.assign(CITY.ach, map); };

  // ---------- 随机数 ----------
  function hashStr(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0);
  }
  function makeRng(seedStr) {
    let a = hashStr(String(seedStr)) || 1;
    const next = function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      chance: (p) => next() < p,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      wpick: function (arr, wf) {
        let tot = 0; const ws = arr.map((x) => { const w = Math.max(0, wf(x)); tot += w; return w; });
        if (tot <= 0) return null;
        let r = next() * tot;
        for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r < 0) return arr[i]; }
        return arr[arr.length - 1];
      },
    };
  }
  CITY.makeRng = makeRng;

  const STATS = ['body', 'mind', 'wit', 'skill', 'social'];
  CITY.STAT_NAMES = { body: '体魄', mind: '理智', wit: '才智', skill: '武艺', social: '人脉', money: '眼', fame: '名声', dist: '扭曲' };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ---------- 世界时代 ----------
  // 都市纪年以“光之种”散播为 0 年。
  CITY.eraOf = function (wy) {
    if (wy < -1) return 'lob';     // 脑叶公司仍是翼
    if (wy === -1) return 'fall';  // L公司崩溃、白昼与暗夜
    if (wy <= 0) return 'lib';     // 图书馆时期
    return 'dist';                 // 扭曲时期
  };

  // 每段人生冻结自己的阅读历史；读档不会受后来完成的人生影响。
  CITY.copyMemory = function (m) {
    m = m && typeof m === 'object' ? m : {};
    const counts = (o) => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {})
      .filter(([k, v]) => k.length < 200 && Number.isFinite(v) && v > 0).map(([k, v]) => [k, Math.min(10000, Math.floor(v))]));
    return { events: counts(m.events), branches: counts(m.branches), groups: counts(m.groups), outcomes: counts(m.outcomes), deaths: counts(m.deaths),
      births: Array.isArray(m.births) ? m.births.filter((b) => b && typeof b === 'object').slice(-12).map((b) => ({
        loc: String(b.loc || ''), home: String(b.home || ''), era: String(b.era || ''), eraBand: String(b.eraBand || ''),
        thread: String(b.thread || ''), traits: Array.isArray(b.traits) ? b.traits.filter((t) => typeof t === 'string').slice(0, 3) : [],
      })) : [] };
  };
  CITY.varietyPick = function (S, list, weight, field, key = (x) => x) {
    const recent = S.memory.births;
    return S.rng.wpick(list, (x) => {
      const value = key(x), count = recent.filter((b) => b[field] === value).length;
      const last = recent[recent.length - 1], previous = recent[recent.length - 2];
      return weight(x) / Math.sqrt(1 + count) * (last && last[field] === value ? 0.2 : 1)
        * (previous && previous[field] === value ? 0.65 : 1);
    });
  };

  // ---------- 状态 ----------
  function newState(opt) {
    opt = opt || {};
    const seed = opt.seed || String(Date.now() % 1e9) + Math.floor(Math.random() * 1e6);
    const rng = makeRng(seed);
    const S = {
      seed, rng, name: opt.name || '', gender: opt.gender || (rng.chance(0.5) ? 'm' : 'f'),
      age: 0, alive: true, wy: 0, birthWY: 0,
      loc: 'backstreet', d: 1, wing: '', home: '',
      fam: { wealth: 1, parents: 'both', sib: 0 },
      st: { body: 40, mind: 40, wit: 30, skill: 10, social: 30 },
      money: 0, fame: 0, dist: 0,
      traits: [], flags: {}, c: {}, used: {}, last: {},
      job: { id: 'none', org: '', rank: 0, merit: 0, years: 0 },
      spouse: null, kids: [], pros: 0,
      log: [], titles: [], queue: [], focus: 'play',
      death: null, lastWords: '', epitaph: '', ach: [],
      vars: {}, rulesVersion: [1, 2, 3, 4, 5].includes(opt.rulesVersion) ? opt.rulesVersion : 5,
      items: {}, equipment: {}, traitOrigins: {}, traitJournal: [], itemJournal: [],
      memory: CITY.copyMemory(opt.memory || (CITY.store && CITY.store.load().variety)),
      discovered: { events: {}, branches: {}, groups: {}, outcomes: {} }, life: null,
    };
    S._seenChoices = new Set(Object.keys(S.memory.branches).map((k) => k.slice(0, k.lastIndexOf(':'))));
    CITY.birth(S, opt);
    if (S.rulesVersion >= 2 && CITY.initLifeThread) CITY.initLifeThread(S);
    S.birthWY = S.wy; S.birthLoc = S.loc; S.birthHome = S.home;
    S.birthTraits = S.traits.slice();
    if (S.rulesVersion >= 3 && CITY.initPossessions) CITY.initPossessions(S);
    if (S.rulesVersion >= 4 && CITY.initStories) CITY.initStories(S);
    S.peak = Object.assign({}, S.st);
    return S;
  }
  CITY.newState = newState;
  CITY.birthRecord = (S) => ({ loc: S.birthLoc, home: S.birthHome, era: CITY.eraOf(S.birthWY),
    eraBand: S.birthWY < -30 ? 'early' : S.birthWY < 1 ? 'eve' : 'after',
    thread: S.life ? S.life.id : '', traits: (S.birthTraits || S.traits).slice(0, 3) });

  // ---------- 文本模板 ----------
  function fmt(S, t) {
    if (t == null) return '';
    if (typeof t === 'function') t = t(S);
    if (Array.isArray(t)) t = S.rng.pick(t);
    return String(t)
      .replace(/\[([^\[\]]*\|[^\[\]]*)\]/g, (_, s) => S.rng.pick(s.split('|')))
      .replace(/\{(\w+)\}/g, (m, k) => {
        const v = CITY.tvars[k];
        if (v) return v(S);
        if (S.vars[k] != null) return S.vars[k];
        return m;
      });
  }
  CITY.fmt = fmt;
  CITY.tvars = {
    name: (S) => S.name,
    d: (S) => S.d,
    wing: (S) => S.wing,
    home: (S) => S.home,
    org: (S) => S.job.org || '某处',
    rank: (S) => S.job.rank,
    job: (S) => CITY.jobTitle(S),
    spouse: (S) => (S.spouse ? S.spouse.name : '那个人'),
    kid: (S) => (S.kids.length ? S.kids[S.kids.length - 1].name : '孩子'),
    ta: (S) => (S.gender === 'f' ? '她' : '他'),
    sta: (S) => (S.spouse ? (S.spouse.g === 'f' ? '她' : '他') : 'ta'),
    age: (S) => S.age,
    rname: (S) => CITY.randName(S.rng, S.rng.chance(0.5) ? 'm' : 'f'),
    office: (S) => S.vars.office || S.job.org || '某事务所',
    sib: (S) => S.vars.sib || '兄弟姐妹',
  };

  // ---------- 条件 ----------
  function inRange(v, r) {
    if (r == null) return true;
    if (typeof r === 'number') return v >= r;
    return v >= (r[0] == null ? -Infinity : r[0]) && v <= (r[1] == null ? Infinity : r[1]);
  }
  const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  function test(S, q) {
    if (!q) return true;
    if (typeof q === 'function') return !!q(S);
    if (q.age && !inRange(S.age, q.age)) return false;
    if (q.wy && !inRange(S.wy, q.wy)) return false;
    if (q.era && !arr(q.era).includes(CITY.eraOf(S.wy))) return false;
    if (q.loc && !arr(q.loc).includes(S.loc)) return false;
    if (q.gender && S.gender !== q.gender) return false;
    if (q.job && !arr(q.job).includes(S.job.id)) return false;
    if (q.nojob && arr(q.nojob).includes(S.job.id)) return false;
    if (q.rank && !inRange(S.job.rank, q.rank)) return false;
    if (q.org && !arr(q.org).includes(S.job.org)) return false;
    for (const f of arr(q.flag)) if (!S.flags[f]) return false;
    for (const f of arr(q.noflag)) if (S.flags[f]) return false;
    if (q.anyflag && !arr(q.anyflag).some((f) => S.flags[f])) return false;
    for (const f of arr(q.trait)) if (!S.traits.includes(f)) return false;
    for (const f of arr(q.notrait)) if (S.traits.includes(f)) return false;
    if (q.item && !arr(q.item).every((id) => CITY.hasItem && CITY.hasItem(S, id))) return false;
    if (q.notitem && arr(q.notitem).some((id) => CITY.hasItem && CITY.hasItem(S, id))) return false;
    if (q.st) for (const k in q.st) if (!inRange(CITY.stat ? CITY.stat(S, k) : S.st[k], q.st[k])) return false;
    if (q.money != null && !inRange(S.money, q.money)) return false;
    if (q.fame != null && !inRange(S.fame, q.fame)) return false;
    if (q.dist != null && !inRange(S.dist, q.dist)) return false;
    if (q.pros != null && !inRange(S.pros, q.pros)) return false;
    if (q.cnt) for (const k in q.cnt) if (!inRange(S.c[k] || 0, q.cnt[k])) return false;
    if (q.spouse === true && !(S.spouse && S.spouse.alive)) return false;
    if (q.spouse === false && S.spouse && S.spouse.alive) return false;
    if (q.kids != null && !inRange(S.kids.filter((k) => k.alive).length, q.kids)) return false;
    if (q.fam && q.fam.wealth != null && !inRange(S.fam.wealth, q.fam.wealth)) return false;
    if (q.fam && q.fam.parents && !arr(q.fam.parents).includes(S.fam.parents)) return false;
    if (q.home && !arr(q.home).includes(S.home)) return false;
    if (q.wing && !arr(q.wing).includes(S.wing)) return false;
    if (q.used && !arr(q.used).every((id) => S.used[id])) return false;
    if (q.notused && arr(q.notused).some((id) => S.used[id])) return false;
    if (q.fn && !q.fn(S)) return false;
    if (q.any && !q.any.some((x) => test(S, x))) return false;
    if (q.not && test(S, q.not)) return false;
    return true;
  }
  CITY.test = test;

  // ---------- 效果 ----------
  function apply(S, e, out) {
    if (!e) return;
    if (typeof e === 'function') { e(S, out); return; }
    if (Array.isArray(e)) { for (const x of e) apply(S, x, out); return; }
    if (e.st) for (const k in e.st) S.st[k] = clamp(S.st[k] + e.st[k], 0, 100);
    for (const k of STATS) if (e[k] != null) S.st[k] = clamp(S.st[k] + (k === 'mind' && e[k] < 0 ? e[k] * 0.75 : e[k]), 0, 100);
    if (e.money != null) {
      if (typeof e.money === 'string' && e.money.endsWith('%')) S.money = Math.round(S.money * (1 + parseFloat(e.money) / 100));
      else S.money += e.money;
    }
    if (e.fame != null) S.fame = clamp(S.fame + e.fame, 0, 100);
    if (e.dist != null) S.dist = clamp(S.dist + (e.dist > 0 ? e.dist * 1.1 : e.dist), 0, 100);
    for (const f of arr(e.flag)) S.flags[f] = true;
    for (const f of arr(e.unflag)) delete S.flags[f];
    if (e.cnt) for (const k in e.cnt) S.c[k] = (S.c[k] || 0) + e.cnt[k];
    if (e.set) Object.assign(S.vars, e.set);
    for (const t of arr(e.untrait)) {
      if (S.rulesVersion >= 3 && CITY.removeTrait) CITY.removeTrait(S, t);
      else S.traits = S.traits.filter((x) => x !== t);
    }
    for (const t of arr(e.trait)) {
      if (S.rulesVersion >= 3 && CITY.gainTrait) CITY.gainTrait(S, t);
      else if (!S.traits.includes(t)) S.traits.push(t);
    }
    if (S.rulesVersion >= 3 && CITY.changeItems) { CITY.changeItems(S, e.unitem, -1); CITY.changeItems(S, e.item, 1); }
    if (e.pros) S.pros += e.pros;
    if (e.job) {
      const j = e.job;
      if (S.rulesVersion >= 4 && j.id && j.id !== S.job.id && S.job.id === 'fixer') {
        for (const f of ['assoc', 'as_zwei', 'as_shi', 'as_liu', 'as_seven', 'as_dieci', 'as_cinq', 'as_oufi', 'as_devyat', 'as_tres', 'office_member', 'office_own', 'freelance', 'section_director']) {
          if (S.flags[f]) { S.flags['曾任_' + f] = true; delete S.flags[f]; }
        }
      }
      if (j.id && j.id !== S.job.id) { S.job = { id: j.id, org: '', rank: 0, merit: 0, years: 0 }; S.flags['曾任_' + j.id] = true; }
      if (j.org != null) S.job.org = fmt(S, j.org);
      if (j.rank != null) S.job.rank = j.rank;
      if (j.merit != null) S.job.merit = Math.max(0, S.job.merit + j.merit);
      if (j.promote) { const J = CITY.JOBS[S.job.id]; if (J && J.promote) J.promote(S, j.promote); else S.job.rank += j.promote; S.job.merit = 0; }
    }
    if (e.merit) S.job.merit = Math.max(0, S.job.merit + e.merit);
    if (e.loc) { S.loc = e.loc.loc || S.loc; if (e.loc.d != null) S.d = e.loc.d; if (e.loc.home) S.home = fmt(S, e.loc.home); }
    if (e.spouse === 'new' || (e.spouse && typeof e.spouse === 'object')) {
      const g = S.gender === 'm' ? (S.rng.chance(0.85) ? 'f' : 'm') : (S.rng.chance(0.85) ? 'm' : 'f');
      S.spouse = Object.assign({ name: CITY.randName(S.rng, g), g, alive: true, since: S.age,
        ...(S.rulesVersion >= 4 ? { id: 'spouse:' + (S.c.relationshipSerial = (S.c.relationshipSerial || 0) + 1) } : {}) }, typeof e.spouse === 'object' ? e.spouse : {});
      if (S.vars.lover) S.spouse.name = S.vars.lover;
    } else if (e.spouse === 'die' && S.spouse) { S.spouse.alive = false; S.flags.widowed = true; }
    else if (e.spouse === 'leave' && S.spouse) { S.spouse.alive = false; S.spouse.left = true; S.flags.divorced = true; }
    if (e.kid) {
      for (let i = 0; i < e.kid; i++) {
        const g = S.rng.chance(0.5) ? 'm' : 'f';
        S.kids.push({ name: CITY.randName(S.rng, g), g, alive: true, born: S.age,
          ...(S.rulesVersion >= 4 ? { id: 'kid:' + (S.c.relationshipSerial = (S.c.relationshipSerial || 0) + 1) } : {}) });
      }
    }
    if (e.kidDie) { const k = S.kids.filter((k) => k.alive); if (k.length) S.rng.pick(k).alive = false; }
    for (const t of arr(e.title)) { const tt = fmt(S, t); if (!S.titles.includes(tt)) S.titles.push(tt); }
    for (const a of arr(e.ach)) unlock(S, a);
    if (e.queue) for (const q of Array.isArray(e.queue[0]) ? e.queue : [e.queue]) S.queue.push({ id: q[0], at: S.age + (q[1] || 1) });
    if (e.next) out && (out.next = e.next);
    if (e.fn) e.fn(S, out);
    if (e.death) { S.alive = false; S.death = fmt(S, e.death); }
    if (e.risk) { let p = e.risk[0]; for (const t of S.traits) { const T = CITY.TRAITS[t]; if (T && T.luck) p -= T.luck; } if (S.rng.chance(Math.max(0, p))) { S.alive = false; S.death = fmt(S, e.risk[1]); } }
  }
  CITY.apply = apply;

  function unlock(S, id) {
    if (!S.ach.includes(id)) { S.ach.push(id); CITY.hooks.ach && CITY.hooks.ach(id, S); }
  }

  // ---------- 判定 ----------
  // 硬币判定（仿边狱公司的事件判定）：
  //   最终威力 = 基础威力 + 正面硬币数 × 硬币威力，≥ 判定阈值即成功。
  //   基础威力来自属性（每10点=1），硬币正面概率来自理智（类似理智值对硬币的影响）。
  //   硬币数量与威力因事件而异（由事件id决定，也可在 check 里写 coins / cp 指定）。
  const COIN_SETS = [[2, 5], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2]];
  CITY.coinSpec = function (S, ck, key) {
    let v = 0;
    for (const s of arr(ck.s)) v += s === 'money' ? Math.min(100, S.money / 1000) : s === 'fame' ? S.fame : CITY.stat ? CITY.stat(S, s) : S.st[s] || 0;
    v /= arr(ck.s).length || 1;
    if (ck.mod) v += ck.mod(S) * 50; // 旧的概率修正：0.1 ≈ 5点属性
    const bonuses = S.rulesVersion >= 3 && CITY.checkBonuses ? CITY.checkBonuses(S, ck, key) : [];
    v += clamp(bonuses.reduce((n, b) => n + (b.bonus || 0), 0), -15, 15);
    let n, cp;
    if (ck.coins) { n = ck.coins; cp = ck.cp || Math.max(2, Math.round(10 / n)); }
    else { const set = COIN_SETS[hashStr(String(key || '')) % COIN_SETS.length]; n = set[0]; cp = ck.cp || set[1]; }
    const base = Math.max(0, Math.round(v / 10));
    let h = 0.5 + ((CITY.stat ? CITY.stat(S, 'mind') : S.st.mind) - 50) / 111;
    for (const t of S.traits) { const T = CITY.TRAITS[t]; if (T && T.luck) h += T.luck; }
    h += clamp(bonuses.reduce((n, b) => n + (b.heads || 0), 0), -0.12, 0.12);
    h = clamp(h, 0.05, 0.95);
    const k0 = Math.ceil(n / 2);
    let target = Math.round((ck.dc || 50) / 10) + k0 * cp;
    target = Math.min(target, base + n * cp); // 至少保留“全部正面”的可能
    const P = (T) => { let p = 0; for (let k = 0; k <= n; k++) if (base + k * cp >= T) p += binom(n, k) * Math.pow(h, k) * Math.pow(1 - h, n - k); return p; };
    if (ck.max != null) while (P(target) > ck.max && target <= base + n * cp) target++;
    if (ck.min != null) while (P(target) < ck.min && target > 0) target--;
    const need = Math.max(0, Math.ceil((target - base) / cp)); // 成功所需的最少正面数
    return { n, cp, base, h, target, need, p: P(target), bonuses, stat: arr(ck.s).map((s) => CITY.STAT_NAMES[s]).join('/') };
  };
  function binom(n, k) { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; }
  CITY.checkP = (S, ck, key) => CITY.coinSpec(S, ck, key).p;
  CITY.oddsLabel = function (p) {
    if (p >= 0.8) return '极高';
    if (p >= 0.6) return '高';
    if (p >= 0.4) return '普通';
    if (p >= 0.2) return '低';
    return '极低';
  };

  // ---------- 日志 ----------
  function log(S, text, kind, ev) {
    if (!text) return;
    const ent = { age: S.age, wy: S.wy, text, kind: kind || 'n', ev: ev || '' };
    S.log.push(ent);
    CITY.hooks.log && CITY.hooks.log(ent, S);
  }
  CITY.log = log;
  CITY.hooks = {};

  // ---------- 事件执行 ----------
  const byId = () => {
    if (!CITY._idx || CITY._idxN !== CITY.events.length) {
      CITY._idx = {}; for (const e of CITY.events) CITY._idx[e.id] = e; CITY._idxN = CITY.events.length;
    }
    return CITY._idx;
  };
  CITY.getEvent = (id) => byId()[id];

  function eligible(S, e) {
    if (e.manual || e.birth) return false;
    if (e.age && !inRange(S.age, e.age)) return false;
    if (!e.repeat && S.used[e.id]) return false;
    // 同一生不再重播环境日常；强制剧情、职业晋升和主动行动各按自身规则处理。
    if (S.rulesVersion >= 2 && !e.choices && !e.force && S.used[e.id]) return false;
    if (e.repeat && e.cd && S.last[e.id] != null && S.age - S.last[e.id] < e.cd) return false;
    if (!test(S, e.req)) return false;
    if (CITY.storyEligible && !CITY.storyEligible(S, e)) return false;
    return true;
  }
  CITY.eligible = eligible;

  CITY.eventWeight = function (S, e) {
    const base = typeof e.w === 'function' ? e.w(S) : e.w == null ? 10 : e.w;
    if (S.rulesVersion < 2 || e.force || e.manual) return base;
    const seen = S.memory.events[e.id] || 0;
    let novelty = seen ? Math.max(0.035, 1 / Math.pow(1 + seen, 1.65)) : 4;
    // 有没走过的选项时，给熟悉的事件留下重访的机会；不替玩家选择。
    if (e.choices && seen) {
      const available = e.choices.map((c, i) => ({ c, i })).filter(({ c }) => test(S, c.req));
      if (available.some(({ i }) => !S._seenChoices.has(e.id + '#' + i))) novelty *= 1.8;
    }
    const used = S.used[e.id] || 0;
    if (used) novelty *= 0.12 / (used * used);
    const recent = S.life && S.life.recentMods || [];
    const rhythm = recent.slice(-2).includes(e.mod) ? 0.65 : 1;
    const affinity = S.life && S.life.mods.includes(e.mod) ? 1.8 : 1;
    // 已打开的后续入口优先于新的独立插曲，仍须通过原有条件。
    const q = e.req;
    const continuity = q && typeof q === 'object' && (q.flag || q.used) ? 1.4 : 1;
    const story = CITY.storyWeight ? CITY.storyWeight(S, e) : 1;
    return base * novelty * rhythm * affinity * continuity * story;
  };

  // 运行一个事件：可能产生选择（异步）。返回 Promise
  async function runEvent(S, e) {
    if (e.story && (!CITY.storyCanRun || !CITY.storyCanRun(S, e))) return;
    if (CITY.hooks.pace && !e.birth) await CITY.hooks.pace(S, e);
    const previousEvent = S._event;
    S._event = e;
    try {
    S.used[e.id] = (S.used[e.id] || 0) + 1;
    S.last[e.id] = S.age;
    S.discovered.events[e.id] = 1;
    if (CITY.rememberStoryEvent) CITY.rememberStoryEvent(S, e);
    if (S.life && !e.manual && !e.force && !e.birth) {
      S.life.recentMods.push(e.mod);
      S.life.recentMods = S.life.recentMods.slice(-4);
    }
    const out = {};
    const kind = e.tag === 'major' || e.star ? 'star' : e.choices ? 'choice' : 'n';
    apply(S, e.eff, out);
    if (S.rulesVersion >= 3 && !e.choices && CITY.afterSimpleEvent) CITY.afterSimpleEvent(S, e);
    const text = fmt(S, e.text);
    const choices = (e.choices || []).filter((c) => test(S, c.req));
    if (choices.length) {
      const view = choices.map((c) => {
        const v = { t: fmt(S, c.t), hint: c.hint ? fmt(S, c.hint) : '' };
        if (c.check) { const sp = CITY.coinSpec(S, c.check, e.id + '#' + c.t); v.coin = sp; v.p = sp.p; v.odds = CITY.oddsLabel(sp.p); v.stat = sp.stat; }
        return v;
      });
      log(S, text, 'q', e.id);
      const idx = await CITY.hooks.choose(S, e, text, view);
      const c = choices[idx] || choices[0];
      const choiceIndex = e.choices.indexOf(c);
      let res, judged = null;
      if (c.check) {
        const sp = CITY.coinSpec(S, c.check, e.id + '#' + c.t);
        const flips = []; for (let i = 0; i < sp.n; i++) flips.push(S.rng.chance(sp.h));
        const total = sp.base + flips.filter(Boolean).length * sp.cp;
        const ok = total >= sp.target;
        judged = Object.assign({ flips, total, ok }, sp);
        if (CITY.hooks.coins) await CITY.hooks.coins(S, judged);
        res = ok ? c.ok : c.no;
        S.vars._ok = ok;
      } else if (c.res) {
        res = S.rng.wpick(c.res, (r) => (typeof r.w === 'function' ? r.w(S) : r.w == null ? 1 : r.w) * (test(S, r.req) ? 1 : 0));
      } else res = c;
      const branch = judged ? (judged.ok ? 'ok' : 'no') : c.res ? 'r' + c.res.indexOf(res) : 'direct';
      S.discovered.branches[e.id + '#' + choiceIndex + ':' + branch] = 1;
      log(S, '▸ ' + fmt(S, c.t) + (judged ? (judged.ok ? '　〔判定成功〕' : '　〔判定失败〕') : ''), 'pick', e.id);
      if (res) {
        const o2 = {};
        const before = CITY.snap(S);
        const baseBefore = Object.assign({}, S.st);
        apply(S, res.eff, o2);
        if (c !== res) apply(S, c.eff, o2);
        const extra = S.rulesVersion >= 3 && CITY.afterEventResult ? CITY.afterEventResult(S, e, c, res, judged, baseBefore) : '';
        const rt = fmt(S, res.r) + (extra || '');
        log(S, rt, res.star || e.star ? 'star' : 'r', e.id);
        if (o2.next) out.next = o2.next;
        const nextE = out.next && byId()[out.next];
        const chain = !!(nextE && nextE.story && nextE.choices && nextE.choices.length && test(S, nextE.req));
        if (CITY.hooks.result) await CITY.hooks.result(S, { text: rt, judged, deltas: CITY.diff(before, CITY.snap(S), S), chain });
      } else if (CITY.hooks.result) await CITY.hooks.result(S, { text: '', judged, deltas: [] });
    } else {
      log(S, text, kind, e.id);
    }
    if (CITY.sweepStories) CITY.sweepStories(S);
    if (out.next && S.alive) {
      const n = byId()[out.next];
      if (n && test(S, n.req)) await runEvent(S, n);
    }
    if (CITY.hooks.update) CITY.hooks.update(S);
    } finally { S._event = previousEvent; }
  }
  CITY.runEvent = runEvent;

  // ---------- 状态快照与差异（用于向玩家展示“这次选择改变了什么”） ----------
  CITY.snap = (S) => ({ st: Object.fromEntries(STATS.map((k) => [k, CITY.stat ? CITY.stat(S, k) : S.st[k]])), items: Object.fromEntries(Object.entries(S.items || {}).map(([id, x]) => [id, x.count])), money: S.money, fame: S.fame, dist: S.dist, job: CITY.jobTitle ? CITY.jobTitle(S) : '', traits: S.traits.slice(), titles: S.titles.slice(), pros: S.pros, spouse: S.spouse ? S.spouse.name + (S.spouse.alive ? '' : '×') : '', kids: S.kids.filter((k) => k.alive).length, home: S.home, alive: S.alive });
  CITY.diff = function (a, b, S) {
    const D = [];
    for (const k of STATS) { const d = Math.round(b.st[k] - a.st[k]); if (d) D.push({ k, label: CITY.STAT_NAMES[k], v: d }); }
    const dm = Math.round(b.money - a.money); if (dm) D.push({ k: 'money', label: '资金', v: dm, text: (dm > 0 ? '+' : '') + CITY.fmtMoney(dm) });
    const df = Math.round(b.fame - a.fame); if (df) D.push({ k: 'fame', label: '名声', v: df });
    const dd = Math.round(b.dist - a.dist); if (Math.abs(dd) >= 2) D.push({ k: 'dist', label: dd > 0 ? '内心的杂音变大了' : '内心平静了一些', v: dd > 0 ? -1 : 1, text: '' });
    if (b.job !== a.job) D.push({ k: 'job', label: '身份', text: b.job, v: 0 });
    for (const t of b.traits) if (!a.traits.includes(t)) D.push({ k: 'trait', label: '获得特质', text: t, v: 1 });
    for (const t of a.traits) if (!b.traits.includes(t)) D.push({ k: 'trait', label: '失去特质', text: t, v: -1 });
    for (const id of new Set([...Object.keys(a.items || {}), ...Object.keys(b.items || {})])) {
      const d = ((b.items || {})[id] || 0) - ((a.items || {})[id] || 0);
      if (d) D.push({ k: 'item', label: d > 0 ? '获得物品' : '交出物品', text: ((CITY.ITEMS && CITY.ITEMS[id] || {}).name || id) + (Math.abs(d) > 1 ? ' ×' + Math.abs(d) : ''), v: Math.sign(d) });
    }
    for (const t of b.titles) if (!a.titles.includes(t)) D.push({ k: 'title', label: '名号', text: t, v: 1 });
    if (b.pros > a.pros) D.push({ k: 'pros', label: '义体', text: '+' + (b.pros - a.pros) + ' 处', v: 0 });
    if (b.spouse !== a.spouse) D.push({ k: 'spouse', label: '伴侣', text: !b.spouse ? '离开了' : b.spouse.endsWith('×') ? '失去了' + b.spouse.slice(0, -1) : b.spouse, v: b.spouse && !b.spouse.endsWith('×') ? 1 : -1 });
    if (b.kids !== a.kids) D.push({ k: 'kids', label: '子女', text: (b.kids > a.kids ? '+' : '') + (b.kids - a.kids), v: b.kids > a.kids ? 1 : -1 });
    if (b.home !== a.home) D.push({ k: 'home', label: '住处', text: b.home, v: 0 });
    if (a.alive && !b.alive) D.push({ k: 'death', label: '死亡', text: '', v: -1 });
    return D;
  };

  // ---------- 一年 ----------
  CITY.yearTick = async function (S) {
    S.age += 1; S.wy += 1;
    S.job.years += 1;
    if (CITY.hooks.update) CITY.hooks.update(S);
    if (S.rulesVersion >= 3) S.c['focus_' + S.focus] = (S.c['focus_' + S.focus] || 0) + 1;
    const out = [];
    // 1) 年度方针与职业的被动影响
    const F = CITY.FOCUS[S.focus];
    if (F && F.tick && (!F.req || test(S, F.req))) F.tick(S);
    const J = CITY.JOBS[S.job.id];
    if (J && J.tick) J.tick(S);
    for (const t of S.traits) { const T = CITY.TRAITS[t]; if (T && T.tick) T.tick(S); }
    CITY.passive && CITY.passive(S);
    for (const k of STATS) if (S.st[k] > (S.peak[k] || 0)) S.peak[k] = S.st[k];
    S.c.debtMax = Math.max(S.c.debtMax || 0, S.c.debtYears || 0);
    // 1.5) 玩家选择的主动行动
    if (S.act && S.alive) {
      const k = S.act; S.act = null;
      const A = CITY.ACTIONS && CITY.ACTIONS[k];
      if (A && test(S, A.req)) {
        S.last['act_' + k] = S.age;
        log(S, '你决定：' + A.name + '。', 'sys');
        if (A.pre) apply(S, A.pre);
        const e = byId()[typeof A.ev === 'function' ? A.ev(S) : A.ev];
        if (e) await runEvent(S, e);
      }
    }
    // 2) 强制事件（世界大事/剧情）
    const forced = CITY.events.filter((e) => e.force && eligible(S, e)).sort((a, b) => (b.pri || 0) - (a.pri || 0));
    for (const e of forced) { if (!S.alive) break; if (eligible(S, e)) await runEvent(S, e); }
    // 3) 队列事件
    if (CITY.sweepStories) CITY.sweepStories(S);
    const due = S.queue.filter((q) => q.at <= S.age);
    S.queue = S.queue.filter((q) => q.at > S.age);
    for (const q of due) {
      if (!S.alive) break;
      const e = byId()[q.id];
      if (e && test(S, e.req)) await runEvent(S, e);
    }
    // 4) 随机事件
    if (S.alive) {
      const pool = CITY.events.filter((e) => !e.force && eligible(S, e));
      const majors = pool.filter((e) => e.choices);
      const minors = pool.filter((e) => !e.choices);
      const wf = (e) => CITY.eventWeight(S, e);
      const qCount = () => S.log.filter((l) => l.age === S.age && l.kind === 'q').length;
      // 职业事件（条件里限定了 job 的事件）每年单独抽一次，让职业线有足够的推进
      const isCareer = (e) => e.req && typeof e.req === 'object' && e.req.job && S.job.id !== 'none';
      const career = majors.filter(isCareer);
      const familiarOnly = pool => S.rulesVersion >= 4 && pool.length && pool.every(e => S.memory.events[e.id]);
      const careerChance = familiarOnly(career) ? 0.3 : 0.6;
      if (career.length && qCount() < 1 && S.rng.chance(careerChance)) {
        const e = S.rng.wpick(career, wf); if (e) await runEvent(S, e);
      }
      const general = majors.filter((e) => !isCareer(e) && eligible(S, e));
      const pMajor = S.age < 4 ? 0.12 : S.age < 12 ? 0.5 : qCount() ? 0.4 : 0.7;
      if (S.alive && qCount() < 1 && general.length && S.rng.chance(pMajor * (familiarOnly(general) ? 0.5 : 1))) {
        const e = S.rng.wpick(general, wf); if (e) await runEvent(S, e);
      }
      let nMin = S.age < 3 ? 1 : 1 + (S.rng.chance(0.45) ? 1 : 0);
      if (S.rulesVersion >= 2) {
        const fresh = minors.filter((e) => !S.memory.events[e.id]).length;
        // 池子变薄时允许安静的一年，避免把剩下几条日常反复塞满。
        nMin = minors.length < 6 ? (S.rng.chance(0.5) ? 1 : 0) : 1 + (fresh >= 8 && S.rng.chance(0.3) ? 1 : 0);
        if (S.rulesVersion >= 4 && fresh === 0 && S.rng.chance(0.65)) nMin = 0;
      }
      for (let i = 0; i < nMin && S.alive; i++) {
        const left = minors.filter((e) => eligible(S, e));
        if (!left.length) break;
        const e = S.rng.wpick(left, wf); if (e) await runEvent(S, e);
      }
    }
    // 5) 生死
    if (S.alive) {
      const p = CITY.mortality(S);
      if (S.rng.chance(p)) { S.alive = false; S.death = CITY.deathCause(S); log(S, S.death, 'death'); }
    }
    if (S.alive && S.age >= 130) { S.alive = false; S.death = '在漫长到不合常理的岁月之后，安静地停止了呼吸。'; log(S, S.death, 'death'); }
    if (!S.alive && !S.log.some((l) => l.kind === 'death')) log(S, S.death || '死了。', 'death');
    if (!S.alive && CITY.sweepStories) CITY.sweepStories(S);
    CITY.hooks.update && CITY.hooks.update(S);
    return S.alive;
  };

  // ---------- 出生事件 ----------
  CITY.startLife = async function (S) {
    const births = CITY.events.filter((e) => e.birth && test(S, e.req));
    const wf = (e) => S.rulesVersion >= 2 ? CITY.eventWeight(S, e) : (e.w == null ? 10 : e.w);
    const b = S.rng.wpick(births, wf);
    if (b) await runEvent(S, b);
    CITY.hooks.update && CITY.hooks.update(S);
  };

  // ---------- 结算 ----------
  CITY.finish = function (S) {
    if (CITY.sweepStories) CITY.sweepStories(S);
    for (const id in CITY.ach) {
      const A = CITY.ach[id];
      if (A.test && !S.ach.includes(id)) { try { if (A.test(S)) S.ach.push(id); } catch (_) {} }
    }
    S.epitaph = CITY.makeEpitaph ? CITY.makeEpitaph(S) : '';
    return S;
  };

  // ---------- 存档 ----------
  const KEY = 'citylife.v1'; // 见闻与往生录（与判定方式无关，沿用）
  CITY.store = {
    load() {
      let d;
      try { d = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
      if (!d || typeof d !== 'object' || Array.isArray(d)) d = {};
      if (!d.ach || typeof d.ach !== 'object') d.ach = {};
      if (!Array.isArray(d.lives)) d.lives = [];
      d.variety = CITY.copyMemory(d.variety);
      return d;
    },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} },
    clearAll() {
      try {
        const keys = new Set(['citylife.v1', 'citylife.cur2', 'citylife.cur3', 'citylife.cur4', 'citylife.cur5', 'citylife.step', 'citylife.sfx']);
        for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && key.startsWith('citylife.')) keys.add(key); }
        for (const key of keys) localStorage.removeItem(key);
        return true;
      } catch (_) { return false; }
    },
    record(S) {
      if (S._recorded) return S._recorded.slice();
      const d = this.load();
      const now = Date.now();
      const fresh = [];
      for (const a of S.ach) { if (!d.ach[a]) { d.ach[a] = now; fresh.push(a); } }
      d.lives.unshift({
        name: S.name, g: S.gender, age: S.age, home: S.home, job: CITY.jobTitle(S, true), death: S.death,
        titles: S.titles.slice(0, 6), seed: S.seed, t: now, words: S.lastWords, ach: S.ach.length,
        birthHome: S.birthHome, thread: S.life ? S.life.id : '',
      });
      d.lives = d.lives.slice(0, 60);
      d.total = (d.total || 0) + 1;
      for (const key of ['events', 'branches', 'groups', 'outcomes']) for (const id of Object.keys(S.discovered[key] || {})) {
        d.variety[key][id] = Math.min(10000, (d.variety[key][id] || 0) + 1);
      }
      if (S.death) d.variety.deaths[S.death] = Math.min(10000, (d.variety.deaths[S.death] || 0) + 1);
      d.variety.births.push(CITY.birthRecord(S));
      d.variety.births = d.variety.births.slice(-12);
      this.save(d);
      S._recorded = fresh.slice();
      return fresh;
    },
  };
})();
