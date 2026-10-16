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

  // ---------- 状态 ----------
  function newState(opt) {
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
      vars: {},
    };
    CITY.birth(S, opt);
    S.birthWY = S.wy; S.birthLoc = S.loc; S.birthHome = S.home;
    S.peak = Object.assign({}, S.st);
    return S;
  }
  CITY.newState = newState;

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
    if (q.st) for (const k in q.st) if (!inRange(S.st[k], q.st[k])) return false;
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
    for (const t of arr(e.trait)) if (!S.traits.includes(t)) S.traits.push(t);
    for (const t of arr(e.untrait)) S.traits = S.traits.filter((x) => x !== t);
    if (e.pros) S.pros += e.pros;
    if (e.job) {
      const j = e.job;
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
      S.spouse = Object.assign({ name: CITY.randName(S.rng, g), g, alive: true, since: S.age }, typeof e.spouse === 'object' ? e.spouse : {});
      if (S.vars.lover) S.spouse.name = S.vars.lover;
    } else if (e.spouse === 'die' && S.spouse) { S.spouse.alive = false; S.flags.widowed = true; }
    else if (e.spouse === 'leave' && S.spouse) { S.spouse.alive = false; S.spouse.left = true; S.flags.divorced = true; }
    if (e.kid) {
      for (let i = 0; i < e.kid; i++) {
        const g = S.rng.chance(0.5) ? 'm' : 'f';
        S.kids.push({ name: CITY.randName(S.rng, g), g, alive: true, born: S.age });
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
    for (const s of arr(ck.s)) v += s === 'money' ? Math.min(100, S.money / 1000) : s === 'fame' ? S.fame : S.st[s] || 0;
    v /= arr(ck.s).length || 1;
    if (ck.mod) v += ck.mod(S) * 50; // 旧的概率修正：0.1 ≈ 5点属性
    let n, cp;
    if (ck.coins) { n = ck.coins; cp = ck.cp || Math.max(2, Math.round(10 / n)); }
    else { const set = COIN_SETS[hashStr(String(key || '')) % COIN_SETS.length]; n = set[0]; cp = ck.cp || set[1]; }
    const base = Math.max(0, Math.round(v / 10));
    let h = 0.5 + (S.st.mind - 50) / 111;
    for (const t of S.traits) { const T = CITY.TRAITS[t]; if (T && T.luck) h += T.luck; }
    h = clamp(h, 0.05, 0.95);
    const k0 = Math.ceil(n / 2);
    let target = Math.round((ck.dc || 50) / 10) + k0 * cp;
    target = Math.min(target, base + n * cp); // 至少保留“全部正面”的可能
    const P = (T) => { let p = 0; for (let k = 0; k <= n; k++) if (base + k * cp >= T) p += binom(n, k) * Math.pow(h, k) * Math.pow(1 - h, n - k); return p; };
    if (ck.max != null) while (P(target) > ck.max && target <= base + n * cp) target++;
    if (ck.min != null) while (P(target) < ck.min && target > 0) target--;
    return { n, cp, base, h, target, p: P(target), stat: arr(ck.s).map((s) => CITY.STAT_NAMES[s]).join('/') };
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
    if (e.repeat && e.cd && S.last[e.id] != null && S.age - S.last[e.id] < e.cd) return false;
    if (!test(S, e.req)) return false;
    return true;
  }
  CITY.eligible = eligible;

  // 运行一个事件：可能产生选择（异步）。返回 Promise
  async function runEvent(S, e) {
    S.used[e.id] = (S.used[e.id] || 0) + 1;
    S.last[e.id] = S.age;
    const out = {};
    const kind = e.tag === 'major' || e.star ? 'star' : e.choices ? 'choice' : 'n';
    apply(S, e.eff, out);
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
      log(S, '▸ ' + fmt(S, c.t) + (judged ? (judged.ok ? '　〔判定成功〕' : '　〔判定失败〕') : ''), 'pick', e.id);
      if (res) {
        const o2 = {};
        const before = CITY.snap(S);
        apply(S, res.eff, o2);
        if (c !== res) apply(S, c.eff, o2);
        const rt = fmt(S, res.r);
        log(S, rt, res.star || e.star ? 'star' : 'r', e.id);
        if (o2.next) out.next = o2.next;
        if (CITY.hooks.result) await CITY.hooks.result(S, { text: rt, judged, deltas: CITY.diff(before, CITY.snap(S), S) });
      } else if (CITY.hooks.result) await CITY.hooks.result(S, { text: '', judged, deltas: [] });
    } else {
      log(S, text, kind, e.id);
    }
    if (out.next && S.alive) {
      const n = byId()[out.next];
      if (n && test(S, n.req)) await runEvent(S, n);
    }
  }
  CITY.runEvent = runEvent;

  // ---------- 状态快照与差异（用于向玩家展示“这次选择改变了什么”） ----------
  CITY.snap = (S) => ({ st: Object.assign({}, S.st), money: S.money, fame: S.fame, dist: S.dist, job: CITY.jobTitle ? CITY.jobTitle(S) : '', traits: S.traits.slice(), titles: S.titles.slice(), pros: S.pros, spouse: S.spouse ? S.spouse.name + (S.spouse.alive ? '' : '×') : '', kids: S.kids.filter((k) => k.alive).length, home: S.home, alive: S.alive });
  CITY.diff = function (a, b, S) {
    const D = [];
    for (const k of STATS) { const d = Math.round(b.st[k] - a.st[k]); if (d) D.push({ k, label: CITY.STAT_NAMES[k], v: d }); }
    const dm = Math.round(b.money - a.money); if (dm) D.push({ k: 'money', label: '资金', v: dm, text: (dm > 0 ? '+' : '') + CITY.fmtMoney(dm) });
    const df = Math.round(b.fame - a.fame); if (df) D.push({ k: 'fame', label: '名声', v: df });
    const dd = Math.round(b.dist - a.dist); if (Math.abs(dd) >= 2) D.push({ k: 'dist', label: dd > 0 ? '内心的杂音变大了' : '内心平静了一些', v: dd > 0 ? -1 : 1, text: '' });
    if (b.job !== a.job) D.push({ k: 'job', label: '身份', text: b.job, v: 0 });
    for (const t of b.traits) if (!a.traits.includes(t)) D.push({ k: 'trait', label: '获得特质', text: t, v: 1 });
    for (const t of a.traits) if (!b.traits.includes(t)) D.push({ k: 'trait', label: '失去特质', text: t, v: -1 });
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
      const wf = (e) => (typeof e.w === 'function' ? e.w(S) : e.w == null ? 10 : e.w);
      const qCount = () => S.log.filter((l) => l.age === S.age && l.kind === 'q').length;
      // 职业事件（条件里限定了 job 的事件）每年单独抽一次，让职业线有足够的推进
      const isCareer = (e) => e.req && typeof e.req === 'object' && e.req.job && S.job.id !== 'none';
      const career = majors.filter(isCareer);
      if (career.length && qCount() < 2 && S.rng.chance(0.75)) {
        const e = S.rng.wpick(career, wf); if (e) await runEvent(S, e);
      }
      const general = majors.filter((e) => !isCareer(e) && eligible(S, e));
      const pMajor = S.age < 4 ? 0.15 : S.age < 12 ? 0.55 : qCount() ? 0.45 : 0.85;
      if (S.alive && qCount() < 2 && general.length && S.rng.chance(pMajor)) {
        const e = S.rng.wpick(general, wf); if (e) await runEvent(S, e);
      }
      let nMin = S.age < 3 ? 1 : 1 + (S.rng.chance(0.45) ? 1 : 0);
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
    CITY.hooks.update && CITY.hooks.update(S);
    return S.alive;
  };

  // ---------- 出生事件 ----------
  CITY.startLife = async function (S) {
    const births = CITY.events.filter((e) => e.birth && test(S, e.req));
    const wf = (e) => (e.w == null ? 10 : e.w);
    const b = S.rng.wpick(births, wf);
    if (b) await runEvent(S, b);
    CITY.hooks.update && CITY.hooks.update(S);
  };

  // ---------- 结算 ----------
  CITY.finish = function (S) {
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
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || { ach: {}, lives: [] }; } catch (_) { return { ach: {}, lives: [] }; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} },
    record(S) {
      const d = this.load();
      const now = Date.now();
      const fresh = [];
      for (const a of S.ach) { if (!d.ach[a]) { d.ach[a] = now; fresh.push(a); } }
      d.lives.unshift({
        name: S.name, g: S.gender, age: S.age, home: S.home, job: CITY.jobTitle(S, true), death: S.death,
        titles: S.titles.slice(0, 6), seed: S.seed, t: now, words: S.lastWords, ach: S.ach.length,
      });
      d.lives = d.lives.slice(0, 60);
      d.total = (d.total || 0) + 1;
      this.save(d);
      return fresh;
    },
  };
})();
