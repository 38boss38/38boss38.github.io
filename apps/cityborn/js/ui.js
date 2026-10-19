(function () {
  'use strict';
  const CITY = window.CITY;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const sfx = (n, ...a) => { if (window.SFX && !(typeof REPLAY !== 'undefined' && REPLAY)) window.SFX.play(n, ...a); };
  // 通用按钮点击音（判定/结果按钮另有专属音效）
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.closest('#cc-opts') || b.id === 'cr-next' || b.id === 'btn-sfx') return;
    sfx('click');
  }, true);
  const QUOTES = [
    '在都市，活到自然老死本身就是一种罕见的才能。',
    '凌晨三点十三分之后，听见任何敲门声都别开锁。',
    '翼的羽翼之下是温暖的巢，羽毛照不到的阴影里全是后巷。',
    '收尾人只认白纸黑字的委托与眼，不问善恶。',
    '所有人都在拼命抢夺着什么，哪怕只是锅里多出的一颗卤蛋。',
    '这座都市从不缺奇点与奇迹，只是每一份奇迹都在暗中标好了血肉的价码。',
    '规矩就是规矩。触犯首脑禁忌的人，连后悔的时间都不会有。',
    '十秒钟的WARP列车准点到站，没人关心车厢在次元缝隙里熬过了多少年。',
    '食指的纺织机永不停歇，只要照着黑纸条上的指令去做，就不必再为选择而痛苦。',
    'K公司的翠绿安瓿能长出被打碎的骨肉，只要你还得起下个月的分期账单。',
    '在T公司的街道上，连抬头看一眼彩色的天空都是富人的特权。',
    '当耳边响起那个温柔得让人想哭的声音时，握紧你手里的刀，或者顺从地化作怪物。',
    '如果收到了一封烫着金印的红色邀请函——愿你在那里找到想要的书。',
  ];
  const ERA_NAME = { lob: '脑叶公司时代', fall: 'L公司崩溃', lib: '图书馆时期', dist: '扭曲时代' };
  const ERA_SHORT = { lob: '脑叶', fall: '白夜黑昼', lib: '图书馆', dist: '扭曲' };
  const TIERS = { common: '常见', uncommon: '少见', rare: '稀有', epic: '史诗', legend: '传说', myth: '神话' };
  const TIER_ORDER = ['myth', 'legend', 'epic', 'rare', 'uncommon', 'common'];

  // ---------- 导航 ----------
  function go(name) {
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === 'scr-' + name));
    if (name === 'codex') renderCodex();
    if (name === 'lives') renderLives();
    if (name === 'title') { $('#title-quote').textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)]; renderContinue(); }
  }
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));

  // 分段按钮
  const segVal = {};
  $$('.seg').forEach((seg) => {
    segVal[seg.dataset.name] = 'r';
    seg.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return;
      $$('button', seg).forEach((x) => x.classList.toggle('on', x === b));
      segVal[seg.dataset.name] = b.dataset.v;
    });
  });

  // ---------- 游戏状态 ----------
  const Q = new URLSearchParams(location.search);
  let S = null, speed = 1, auto = false, running = false, runId = 0, yearBusy = false;
  let pendingChoice = null;
  let lastOpt = null;
  // 每一年的长度按这一年产生的文字量计算（×1 时约每字 45 毫秒），速度档位只是倍率
  let yearDur = 4500, yearT = 0, yearStepped = false, stepMode = false, timedChoices = false, resultPending = null, DEMO_MS = 0;
  const MODAL_KINDS = { q: 1, pick: 1, r: 1 };
  function calcYearDur(age) {
    let chars = 0;
    for (const l of S.log) if (l.age === age) chars += MODAL_KINDS[l.kind] ? l.text.length * 0.25 : l.text.length;
    if (DEMO_MS) return DEMO_MS * 4;
    if (S.rulesVersion >= 2 && !chars) return 1500;
    return Math.max(4200, Math.min(12000, 3000 + chars * 40));
  }
  function updateBar() {
    const f = $('#yb-fill'), lb = $('#yb-label');
    if (!f) return;
    const r = Math.min(1, yearT / yearDur);
    f.style.transform = 'scaleX(' + r.toFixed(4) + ')';
    const bar = $('#yearbar');
    const majorOpen = !!(pendingChoice && pendingChoice.major);
    const halted = !speed || majorOpen || resultPending;
    bar.classList.toggle('halt', !!halted);
    bar.classList.toggle('full', r >= 1);
    lb.classList.toggle('halt', !!halted);
    lb.textContent = !S || !S.alive ? '' : majorOpen || resultPending ? '时间已停止' : !speed ? (r >= 1 && stepMode ? '按空格进入下一年' : '已暂停 · 空格继续') : '距离 ' + (S.age + 1) + ' 岁';
  }

  $('#birth-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = $('#f-name').value.trim();
    const g = segVal.gender === 'r' ? null : segVal.gender;
    const era = segVal.era === 'r' ? null : segVal.era;
    const seed = $('#f-seed').value.trim() || null;
    startGame({ name, gender: g, era, seed });
  });

  async function startGame(opt) {
    yearBusy = true;
    lastOpt = opt;
    runId++;
    const myRun = runId;
    // 第一段人生受童年保护；这个判断写进存档，读档重放时保持一致。
    const firstLife = opt.firstLife != null ? opt.firstLife : !(CITY.store.load().total || 0);
    S = CITY.newState(Object.assign({}, opt, { rulesVersion: opt.rulesVersion || 7, firstLife }));
    REC = { format: S.rulesVersion >= 6 ? 6 : 5, o: { name: opt.name || '', gender: opt.gender || null, era: opt.era || null, seed: S.seed,
      rulesVersion: S.rulesVersion, firstLife, memory: CITY.copyMemory(S.memory) }, p: [], y: [], x: [] };
    $('#log').innerHTML = '';
    userScrolled = false; lastLogTop = 0; $('#log-latest').hidden = true;
    $('#lifegrid').innerHTML = '';
    yearBlocks = {};
    $('#death').hidden = true; $('#choice').hidden = true; $('#menu').hidden = true; document.body.classList.remove('choice-open');
    go('game');
    setSpeed(speed || 1);
    renderAll();
    await makeMates();
    if (opt.replay) {
      await replayLife(opt.replay, myRun);
      if (myRun !== runId) return;
      yearBusy = false;
      renderAll();
      if (!S.alive) { clearCur(); onDeath(); return; }
      setSpeed(0); toast('已恢复到 ' + S.age + ' 岁。按空格继续。');
      loop(myRun);
      return;
    }
    if (!Q.get('demo')) {
      const go2 = await showBirthCard();
      if (myRun !== runId) return;
      if (go2 === 'reroll') {
        const memory = CITY.copyMemory(S.memory);
        memory.births.push(CITY.birthRecord(S));
        startGame({ name: opt.name, gender: opt.gender, era: opt.era, memory, rulesVersion: S.rulesVersion, firstLife }); return;
      }
    }
    await CITY.startLife(S);
    yearBusy = false;
    renderAll();
    yearDur = calcYearDur(0) + 1500;
    loop(myRun);
  }
  // ---------- 同年出生的人：与玩家同步流逝的三段陌生人生 ----------
  let MATES = [];
  const MATE_HOOKS = { choose: (m, e, t, v) => Promise.resolve(Math.floor(m.rng.next() * v.length)) };
  async function asMate(fn) { const saved = CITY.hooks; CITY.hooks = MATE_HOOKS; try { await fn(); } finally { CITY.hooks = saved; } }
  async function makeMates() {
    MATES = [0, 1, 2].map((i) => CITY.newState({ seed: S.seed + '#' + i, wy: S.birthWY,
      rulesVersion: S.rulesVersion, memory: {} }));
    await asMate(async () => { for (const m of MATES) await CITY.startLife(m); });
  }
  async function tickMates() {
    await asMate(async () => {
      for (const m of MATES) {
        if (!m.alive || m.age >= S.age) continue;
        const fl = CITY.focusList(m); m.focus = fl[Math.floor(m.rng.next() * fl.length)];
        if (m.age > 16 && m.rng.chance(0.2)) { const al = CITY.actionList(m); if (al.length) m.act = al[Math.floor(m.rng.next() * al.length)]; }
        await CITY.yearTick(m);
      }
    });
  }
  function mateLine(m) {
    const st = m.alive ? CITY.jobTitle(m) : '死于 ' + m.age + ' 岁';
    return '<div class="mate' + (m.alive ? '' : ' dead') + '"><b>' + esc(m.name) + '</b><span>' + esc(m.home) + '</span><em>' + esc(st) + '</em>' + (m.alive ? '' : '<small>' + esc(m.death || '') + '</small>') + '</div>';
  }
  function renderMates() { const el = $('#mates'); if (el) el.innerHTML = MATES.map(mateLine).join(''); }

  // ---------- 存档：记录种子与所有输入，读档时重放 ----------
  let REC = null, REPLAY = null;
  const CUR = 'citylife.cur6';
  function saveCur() { try { if (REC && S && S.alive) localStorage.setItem(CUR, JSON.stringify(Object.assign({ age: S.age, name: S.name, job: CITY.jobTitle(S) }, REC))); } catch (_) {} }
  function clearCur() { try { localStorage.removeItem(CUR); localStorage.removeItem('citylife.cur5'); } catch (_) {} }
  function loadCur() {
    for (const key of [CUR, 'citylife.cur5']) {
      try { const c = JSON.parse(localStorage.getItem(key)); if (c && [5, 6].includes(c.format)) return c; } catch (_) {}
    }
    return null;
  }
  async function replayLife(rec, myRun) {
    REPLAY = { p: rec.p, i: 0 };
    const quiet = CITY.hooks.ach; CITY.hooks.ach = null;
    let itemCursor = 0;
    const replayItems = (at, beforeEvent) => {
      while (itemCursor < (rec.x || []).length && rec.x[itemCursor].at === at && rec.x[itemCursor].beforeEvent === beforeEvent) {
        const action = rec.x[itemCursor++];
        if (!CITY.inventoryAction(S, action)) throw new Error('物品操作记录无法恢复');
        REC.x.push({ ...action });
      }
    };
    const beforeEvent = CITY.hooks.beforeEvent;
    CITY.hooks.beforeEvent = (state, event, serial) => { if (state === S) replayItems(REC.y.length, serial); };
    try {
      await CITY.startLife(S);
      replayItems(0);
      for (const [f, a] of rec.y) {
        if (myRun !== runId || !S.alive) break;
        S.focus = f; S.act = a || null;
        REC.y.push([f, a]);
        await CITY.yearTick(S);
        await tickMates();
        replayItems(REC.y.length);
      }
      if (itemCursor !== (rec.x || []).length) throw new Error('物品操作记录未能完整恢复');
    } finally { REPLAY = null; CITY.hooks.ach = quiet; CITY.hooks.beforeEvent = beforeEvent; }
  }
  function renderContinue() {
    const c = loadCur();
    let el = $('#btn-continue');
    if (!c) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('button'); el.id = 'btn-continue'; el.type = 'button'; el.className = 'btn-continue'; $('#birth-form').appendChild(el); el.addEventListener('click', () => { const c2 = loadCur(); if (c2) startGame(Object.assign({}, c2.o, { replay: c2 })); }); }
    el.innerHTML = '继续上一段人生<small>' + esc(c.name || c.o.name) + ' · ' + c.age + '岁 · ' + esc(c.job || '') + '</small>';
  }
  function showBirthCard() {
    return new Promise((resolve) => {
      const d = CITY.store.load();
      $('#bc-no').textContent = '都市第 ' + String((d.total || 0) + 1).padStart(6, '0') + ' 号登记 · 种子 ' + S.seed;
      $('#bc-name').textContent = S.name + (S.gender === 'f' ? '　♀' : '　♂');
      const rows = [
        ['出生地', S.home + (S.loc === 'nest' ? '（' + (CITY.WINGS[S.wing] ? CITY.WINGS[S.wing].desc : '') + '）' : S.loc === 'outskirts' ? '（都市之外）' : '')],
        ['时代', ERA_NAME[CITY.eraOf(S.wy)] + (CITY.eraOf(S.wy) === 'lob' ? ' · 距白夜黑昼还有 ' + (-1 - S.wy) + ' 年' : '')],
        ['家境', CITY.wealthName(S.fam.wealth) + ' · ' + CITY.parentsName[S.fam.parents] + (S.fam.sib ? ' · 有一个' + (S.vars.sib || '兄弟姐妹') : '')],
      ];
      if (S.life) rows.push(['家中旧事', S.life.intro]);
      $('#bc-rows').innerHTML = rows.map((r) => '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>').join('');
      $('#bc-traits').innerHTML = S.traits.map((t) => '<div class="bc-t"><b>' + esc(t) + '</b><small>' + esc((CITY.TRAITS[t] || {}).desc || '') + '</small></div>').join('');
      const m = $('#birthcard');
      m.hidden = false;
      const done = (v) => { m.hidden = true; $('#bc-go').onclick = $('#bc-reroll').onclick = null; resolve(v); };
      sfx('birth');
      $('#bc-go').onclick = () => done('go');
      $('#bc-reroll').onclick = () => done('reroll');
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 一年不再在开头把事件全部倒出来：引擎每运行一个事件前调用 pace，
  // 让进度条在这段时间里继续走，事件就会分散到这一年中。
  const yearPaused = () => !S || !S.alive || speed <= 0 || pendingChoice || resultPending || !$('#menu').hidden;
  function advanceYear(dt, allowStep) {
    if (yearPaused()) return false;
    yearT += dt * speed;
    if (allowStep && yearT >= yearDur && stepMode && !yearStepped) {
      yearStepped = true; lastSpeed = speed || lastSpeed; setSpeed(0);
    }
    updateBar();
    return yearT >= yearDur;
  }
  async function waitResume(myRun) {
    while (myRun === runId && (speed <= 0 || !$('#menu').hidden)) await sleep(100);
    return myRun === runId;
  }
  async function waitYearEnd(myRun) {
    while (true) {
      if (myRun !== runId) return false;
      await sleep(50);
      const done = advanceYear(50, true);
      if (done && speed > 0) return true;
      if (!S.alive) return false;
    }
  }
  async function paceYear(S0, e) {
    if (REPLAY || !yearBusy || !S0 || S0.age <= 0) return;
    renderInventory();
    const myRun = runId;
    const budget = DEMO_MS ? 120 : Math.min(3000, Math.max(800, yearDur * (e.choices ? 0.3 : 0.18)));
    let spent = 0;
    while (spent < budget) {
      if (myRun !== runId || !S0.alive) return;
      await sleep(50);
      if (!yearPaused()) spent += 50 * speed;
      advanceYear(50, false);
    }
  }
  CITY.hooks.pace = paceYear;

  async function loop(myRun) {
    running = true;
    while (S.alive) {
      if (!(await waitResume(myRun))) return;
      if (REC) REC.y.push([S.focus, S.act || '']);
      yearT = 0; yearStepped = false; updateBar();
      yearBusy = true;
      try {
        await CITY.yearTick(S);
        if (myRun !== runId) return;
        yearBusy = false;
        await tickMates();
        if (myRun !== runId) return;
        renderAll(); saveCur();
        const ok = await waitYearEnd(myRun);
        if (!ok && !S.alive) break;
      } finally { if (myRun === runId) yearBusy = false; }
      renderAll();
      saveCur();
      yearDur = calcYearDur(S.age);
    }
    running = false;
    clearCur();
    onDeath();
  }

  // ---------- 钩子 ----------
  let yearBlocks = {};

  // 把过碎的分段重新合成 2–3 段；整段太长的，再按句末分开。
  // 目标是读起来像一段话，而不是“每句话都换行”。
  function prose(text) {
    if (typeof text !== 'string' || !text) return text;
    const splitSentences = (s) => {
      const out = []; let buf = '', depth = 0;
      for (const ch of s) {
        buf += ch;
        if (ch === '“' || ch === '「') depth++;
        else if (ch === '”' || ch === '」') depth = Math.max(0, depth - 1);
        if (!depth && '。！？'.includes(ch)) { out.push(buf); buf = ''; }
      }
      if (buf.trim()) out.push(buf);
      return out;
    };
    const group = (parts, target, max) => {
      const out = []; let cur = '';
      for (const s of parts) {
        if (cur && (len(cur) + len(s) > max || len(cur) >= target)) { out.push(cur.trim()); cur = s; }
        else cur += s;
      }
      if (cur.trim()) out.push(cur.trim());
      return out;
    };
    const len = (s) => [...s].length;
    let paras = text.replace(/\r/g, '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    if (!paras.length) return text;
    if (paras.length === 1) {
      const ss = splitSentences(paras[0]);
      if (ss.length >= 2 && len(paras[0]) >= 90) paras = group(ss, 52, 76);
    }
    // 较长的原稿至少保留两段，避免把作者安排的转折重新粘成一整块。
    // 很短的结果仍可合为一段，过碎的正文收拢到 2–3 段。
    const minParas = len(paras.join('')) >= 65 ? 2 : 1;
    let merged = true;
    while (merged && paras.length > minParas) {
      merged = false;
      for (let i = 0; i < paras.length - 1; i++) {
        if (len(paras[i]) + len(paras[i + 1]) <= 88) {
          paras[i] = paras[i] + paras[i + 1];
          paras.splice(i + 1, 1);
          merged = true;
          break;
        }
      }
    }
    while (paras.length > 3) {
      let at = 0, best = Infinity;
      for (let i = 0; i < paras.length - 1; i++) {
        const n = len(paras[i]) + len(paras[i + 1]);
        if (n < best) { best = n; at = i; }
      }
      paras[at] = paras[at] + paras[at + 1];
      paras.splice(at + 1, 1);
    }
    return paras.join('\n\n');
  }

  function sceneFor(blk, ent) {
    const body = $('.yr-body', blk);
    if (ent.kind === 'sys') { blk._scene = null; blk._sceneKey = null; return body; }
    const key = ent.ev || ('k:' + ent.kind + ':' + String(ent.text || '').slice(0, 12));
    if (blk._scene && blk._sceneKey === key) return blk._scene;
    const sc = document.createElement('div');
    sc.className = 'scene' + (ent.kind === 'star' ? ' is-star' : '') + (ent.kind === 'death' ? ' is-death' : '');
    const e = ent.ev && CITY.getEvent ? CITY.getEvent(ent.ev) : null;
    if (e && e.title) {
      const h = document.createElement('div');
      h.className = 'scene-title';
      h.textContent = e.title;
      sc.appendChild(h);
    }
    body.appendChild(sc);
    blk._scene = sc; blk._sceneKey = key;
    return sc;
  }

  CITY.hooks.log = function (ent) {
    const log = $('#log');
    let blk = yearBlocks[ent.age];
    if (!blk) {
      $$('.yr.cur', log).forEach((x) => x.classList.remove('cur'));
      blk = document.createElement('div');
      blk.className = 'yr cur';
      const era = ERA_SHORT[CITY.eraOf(ent.wy)];
      blk.innerHTML = '<div class="yr-age">' + ent.age + '<small>' + era + '</small></div><div class="yr-body"></div>';
      log.appendChild(blk);
      yearBlocks[ent.age] = blk;
    }
    const host = sceneFor(blk, ent);
    const p = document.createElement('p');
    p.className = 'e-' + ent.kind;
    p.textContent = prose(ent.text);
    if (!REPLAY && !MODAL_KINDS[ent.kind]) {
      const n = (blk._n = (blk._n || 0) + 1) - 1;
      p.style.animationDelay = Math.round(n * 520 / Math.max(1, speed)) + 'ms';
    } else p.style.animationDelay = '0ms';
    host.appendChild(p);
    if (ent.choice && ent.impacts && ent.impacts.length) {
      const changes = document.createElement('div'); changes.className = 'inline-result';
      changes.innerHTML = resultChanges({ deltas: ent.impacts, notes: ent.notes });
      host.appendChild(changes);
    }
    stickBottom();
  };
  function stickBottom() {
    const log = $('#log');
    if (!userScrolled) log.scrollTop = log.scrollHeight;
    $('#log-latest').hidden = !userScrolled;
  }
  let userScrolled = false, lastLogTop = 0;
  const readingHistory = () => { userScrolled = true; lastLogTop = $('#log').scrollTop; $('#log-latest').hidden = false; };
  $('#log').addEventListener('wheel', ev => { if (ev.deltaY < 0) readingHistory(); }, { passive: true });
  $('#log').addEventListener('touchstart', readingHistory, { passive: true });
  $('#log').addEventListener('keydown', ev => { if (['PageUp', 'Home', 'ArrowUp'].includes(ev.key)) readingHistory(); });
  $('#log').addEventListener('scroll', () => {
    const log = $('#log');
    if (userScrolled && log.scrollTop >= lastLogTop && log.scrollHeight - log.scrollTop - log.clientHeight <= 2) { userScrolled = false; $('#log-latest').hidden = true; }
    lastLogTop = log.scrollTop;
  }, { passive: true });
  $('#log-latest').addEventListener('click', () => { userScrolled = false; stickBottom(); });

  let lastPick = '';
  let lastChoiceMajor = false;
  const oddsLv = (p) => (p >= 0.8 ? 5 : p >= 0.6 ? 4 : p >= 0.4 ? 3 : p >= 0.2 ? 2 : 1);
  const coinDots = (n) => '<span class="cr-coins">' + '<i></i>'.repeat(n) + '</span>';

  // 日常选择留在正文里；默认等待读完，可在设置中开启按篇幅计时。
  function showInlineChoice(S, e, text, opts, resolve) {
    const blk = yearBlocks[S.age];
    const body = blk && $('.yr-body', blk);
    const wrap = document.createElement('div');
    wrap.className = 'inline-choice';
    wrap.innerHTML = '<div class="ic-head"><span class="ic-label">日常选择</span><span class="ic-timer"><i></i></span><span class="ic-left"></span></div><div class="ic-opts"></div>';
    const box = $('.ic-opts', wrap);
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'ic-opt';
      const odds = o.coin ? '<span class="odds o' + oddsLv(o.p) + '">' + esc(o.odds) + ' ' + Math.round(o.p * 100) + '%</span>' : '';
      b.innerHTML = '<span class="ic-n">' + (i + 1) + '</span><span class="ic-t">' + esc(o.t) + (o.hint ? '<span class="hint">' + esc(o.hint) + '</span>' : '') + (o.cost ? '<span class="choice-cost">' + esc(o.cost) + '</span>' : '') + '</span>' + odds;
      b.addEventListener('click', () => done(i));
      box.appendChild(b);
    });
    if (body) body.appendChild(wrap); else $('#log').appendChild(wrap);
    stickBottom();
    const duration = CITY.choiceSeconds(text, opts);
    let left = duration, autoWait = 0, lastTick = performance.now();
    const fill = $('.ic-timer i', wrap), leftEl = $('.ic-left', wrap), timerBar = $('.ic-timer', wrap), label = $('.ic-label', wrap);
    const showClock = () => {
      timerBar.hidden = !timedChoices && !auto;
      label.textContent = auto ? '日常选择 · 自动' : '日常选择';
      leftEl.textContent = auto || !timedChoices ? '' : Math.max(0, Math.ceil(left)) + 's';
      fill.style.width = (auto ? 100 : Math.max(0, left / duration * 100)).toFixed(1) + '%';
    };
    showClock();
    const done = (i) => {
      if (!pendingChoice || pendingChoice.done !== done) return;
      clearInterval(pendingChoice.timer);
      clearInterval(pendingChoice.clock);
      pendingChoice = null;
      if (REC) REC.p.push(i);
      lastPick = opts[i] ? opts[i].t : '';
      $$('.ic-opt', wrap).forEach((b, j) => b.classList.add(j === i ? 'picked' : 'dim'));
      setTimeout(() => { wrap.remove(); resolve(i); }, 180);
    };
    pendingChoice = { done, n: opts.length, major: false, timer: 0, clock: 0 };
    const timerId = setInterval(() => {
      if (!pendingChoice || pendingChoice.done !== done) { clearInterval(timerId); return; }
      const now = performance.now(), dt = Math.min(1, (now - lastTick) / 1000); lastTick = now;
      showClock();
      if (speed <= 0 || !$('#menu').hidden) return;
      if (auto) autoWait += dt;
      else if (timedChoices) left -= dt;
      if (auto && autoWait >= 1.1 || !auto && timedChoices && left <= 0) {
        clearInterval(timerId);
        const i = Math.floor(Math.random() * opts.length);
        if (!auto) toast('时间到 · 自动选择「' + (opts[i] ? opts[i].t : '') + '」');
        done(i);
      }
    }, 100);
    pendingChoice.timer = timerId;
    // 小抉择不暂停世界：年份进度继续走，只是引擎在等这个选择。
    const clockId = setInterval(() => {
      if (!pendingChoice || pendingChoice.done !== done) { clearInterval(clockId); return; }
      if (speed > 0 && $('#menu').hidden && !resultPending) {
        yearT = Math.min(yearDur * 0.92, yearT + 50 * speed);
        updateBar();
      }
    }, 50);
    pendingChoice.clock = clockId;
  }

  CITY.hooks.choose = function (S, e, text, opts, decision = {}) {
    if (REPLAY) { const i = REPLAY.p[REPLAY.i++]; if (REC) REC.p.push(i); return Promise.resolve(i == null ? 0 : Math.min(i, opts.length - 1)); }
    renderAll(false);
    const balance = $('#pc-money');
    cancelAnimationFrame(balance._raf); balance._v = S.money; balance.textContent = CITY.fmtMoney(S.money);
    return new Promise((resolve) => {
      const major = decision.major == null ? CITY.isMajorChoice(S, e) : decision.major;
      lastChoiceMajor = major;
      if (!major) { showInlineChoice(S, e, text, opts, resolve); return; }
      const card = $('#choice');
      const inner = $('.choice-card', card);
      inner.scrollTop = 0;
      inner.classList.remove('judging', 'resolved');
      $('#cc-judge').hidden = true; $('#cc-result').hidden = true;
      $('#cc-timer').hidden = true;
      $('#cc-age').textContent = S.age + ' 岁 · 重大抉择' + (e.title ? ' · ' + e.title : '');
      $('#cc-text').textContent = prose(text);
      $('#cc-foot').textContent = '按 1–' + opts.length + ' 选择';
      const box = $('#cc-opts');
      box.hidden = false;
      box.innerHTML = '';
      opts.forEach((o, i) => {
        const b = document.createElement('button');
        b.style.animationDelay = (120 + i * 70) + 'ms';
        let odds = '', row = '';
        if (o.coin) {
          const c = o.coin, lv = oddsLv(o.p);
          b.className = 'has-check';
          odds = '<span class="odds o' + lv + '">' + o.odds + ' ' + Math.round(o.p * 100) + '%</span>';
          row = '<span class="coinrow"><b>' + esc(o.stat) + '判定</b><span>基础威力 <em>' + c.base + '</em></span>' + coinDots(c.n) + '<span>硬币威力 <em>+' + c.cp + '</em></span><span>判定阈值 <em>' + c.target + '</em></span><span>' + needText(c) + '</span></span>';
          if (c.bonuses && c.bonuses.length) row += '<span class="hint check-bonuses">' + esc(c.bonuses.map((x) => x.name + (x.bonus ? ' 判定属性' + (x.bonus > 0 ? '+' : '') + x.bonus : '') + (x.heads ? ' 正面率' + (x.heads > 0 ? '+' : '') + Math.round(x.heads * 100) + '%' : '')).join('、')) + '</span>';
        }
        b.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="ot">' + esc(o.t) + (o.hint ? '<span class="hint">' + esc(o.hint) + '</span>' : '') + (o.cost ? '<span class="choice-cost">' + esc(o.cost) + '</span>' : '') + '</span>' + odds + row;
        b.addEventListener('click', () => done(i));
        box.appendChild(b);
      });
      if (card.hidden) sfx('open');
      card.hidden = false;
      card.classList.remove('closing');
      document.body.classList.add('choice-open');
      requestAnimationFrame(() => {
        const pad = Math.min(window.innerHeight * 0.8, inner.offsetHeight + 28);
        document.documentElement.style.setProperty('--choice-pad', Math.round(pad) + 'px');
        stickBottom();
      });
      const done = (i) => {
        if (!pendingChoice || pendingChoice.done !== done) return;
        pendingChoice = null; if (REC) REC.p.push(i); lastPick = opts[i] ? opts[i].t : '';
        $$('button', box).forEach((b, j) => b.classList.add(j === i ? 'picked' : 'dim'));
        sfx('pick');
        resultPending = true; // 等待投币与结果
        updateBar();
        setTimeout(() => resolve(i), 260);
      };
      pendingChoice = { done, n: opts.length, major: true };
      updateBar();
      if (auto) autoLater(() => done(Math.floor(Math.random() * opts.length)), 1100, () => pendingChoice && pendingChoice.done === done);
    });
  };

  const needText = (c) => c.need <= 0 ? '无需正面' : c.need > c.n ? '全部正面也不够' : '需 <em>' + c.need + '</em>/' + c.n + ' 枚正面';

  // 投币演出：结果在引擎里已经确定，这里只负责一枚一枚地揭晓
  CITY.hooks.coins = async function (S, J) {
    if (REPLAY || !lastChoiceMajor) return;
    const fast = auto ? 0.55 : 1;
    const inner = $('#choice .choice-card');
    inner.classList.add('judging');
    const max = J.base + J.n * J.cp;
    const jg = $('#cc-judge');
    jg.innerHTML = '<div class="jg-head">' + esc(J.stat) + '判定 <small>成功率 ' + Math.round(J.p * 100) + '% · ' + needText(J) + ' · 每枚正面率 ' + Math.round(J.h * 100) + '%（理智越高越容易正面）</small></div>' +
      '<div class="jg-power"><span class="jg-lab">最终威力</span><span class="jg-num" id="jg-num">' + J.base + '</span><span class="jg-sep">/</span><span class="jg-th">' + J.target + '</span><span class="jg-lab">判定阈值</span></div>' +
      '<div class="jg-meter"><i id="jg-fill" style="width:' + (J.base / max * 100) + '%"></i><b style="left:' + Math.min(100, J.target / max * 100) + '%"></b></div>' +
      '<div class="jg-coins">' + J.flips.map(() => '<span class="coin spin"><span class="cf h">正</span><span class="cf t">反</span><em>+' + J.cp + '</em></span>').join('') + '</div>' +
      '<div class="jg-stamp" id="jg-stamp"></div>';
    jg.hidden = false;
    $('#cc-opts').hidden = true;
    $('#cc-foot').textContent = '投掷硬币中……';
    sfx('judgeOpen');
    J.flips.forEach((_, i) => setTimeout(() => sfx('coinToss', i), 120 + i * 70));
    await sleep(500 * fast);
    let total = J.base;
    const coins = $$('.coin', jg);
    for (let i = 0; i < J.flips.length; i++) {
      await sleep(380 * fast);
      const c = coins[i];
      c.classList.remove('spin');
      c.classList.add(J.flips[i] ? 'heads' : 'tails');
      sfx(J.flips[i] ? 'heads' : 'tails', i);
      if (J.flips[i]) {
        total += J.cp;
        const num = $('#jg-num');
        num.textContent = total; num.classList.remove('bump'); void num.offsetWidth; num.classList.add('bump');
        $('#jg-fill').style.width = Math.min(100, total / max * 100) + '%';
        setTimeout(() => sfx('power', total / J.target), 90);
        if (total >= J.target && !jg.classList.contains('reached')) { jg.classList.add('reached'); setTimeout(() => sfx('reached'), 160); }
      }
    }
    await sleep(380 * fast);
    const st = $('#jg-stamp');
    st.textContent = J.ok ? '判定成功' : '判定失败';
    sfx(J.ok ? 'success' : 'fail');
    st.className = 'jg-stamp show ' + (J.ok ? 'ok' : 'no');
    await sleep(900 * fast);
  };

  const D_ICON = { body: '体魄', mind: '理智', wit: '才智', skill: '武艺', social: '人脉' };
  function autoLater(done, ms, current) {
    let elapsed = 0;
    const timer = setInterval(() => {
      if (!auto || !current()) { clearInterval(timer); return; }
      if (speed <= 0 || !$('#menu').hidden) return;
      elapsed += 100;
      if (elapsed >= ms) { clearInterval(timer); done(); }
    }, 100);
  }
  function resultChanges(R) {
    const chips = R.deltas.map((d, i) => {
      const cls = d.v > 0 ? 'up' : d.v < 0 ? 'down' : 'neu';
      const val = d.text != null ? d.text : (d.v > 0 ? '+' : '') + d.v;
      return '<span class="dchip ' + cls + '" style="animation-delay:' + (250 + i * 90) + 'ms"><b>' + esc(d.label) + '</b>' + (val ? ' ' + esc(val) : '') + '</span>';
    }).join('');
    return chips ? '<div class="cr-chips">' + chips + '</div>' : '';
  }
  CITY.hooks.result = function (S, R) {
    if (REPLAY) { resultPending = null; renderAll(); return Promise.resolve(); }
    if (!lastChoiceMajor) {
      const host = yearBlocks[S.age]?._scene;
      if (host && S.rulesVersion < 6) {
        const result = document.createElement('div'); result.className = 'inline-result';
        result.innerHTML = (R.judged ? '<span class="ir-verdict ' + (R.judged.ok ? 'ok' : 'no') + '">' + (R.judged.ok ? '判定成功' : '判定失败') + '</span>' : '') + resultChanges(R);
        host.appendChild(result); stickBottom();
      }
      if (!DEMO_MS) yearDur = Math.max(yearDur, yearT + Math.min(8000, 2000 + (R.text || '').length * 45));
      resultPending = null; renderAll(); return Promise.resolve();
    }
    return new Promise((resolve) => {
      renderAll();
      const box = $('#cc-result');
      const inner = $('#choice .choice-card');
      inner.classList.add('resolved');
      $('#cc-opts').hidden = true;
      box.innerHTML = (lastPick ? '<div class="cr-pick">▸ ' + esc(lastPick) + (R.judged ? (R.judged.ok ? '<span class="ok">判定成功</span>' : '<span class="no">判定失败</span>') : '') + '</div>' : '') + (R.text ? '<p class="cr-text">' + esc(prose(R.text)) + '</p>' : '') +
        resultChanges(R) + '<button class="cr-next" id="cr-next">' + (R.chain ? '继续这段经历' : '继续') + ' <small>空格 / 回车</small></button>';
      box.hidden = false;
      requestAnimationFrame(() => {
        inner.scrollTop = Math.max(0, box.offsetTop - 32);
        const pad = Math.min(window.innerHeight * 0.8, inner.offsetHeight + 28);
        document.documentElement.style.setProperty('--choice-pad', Math.round(pad) + 'px');
        stickBottom();
      });
      $('#cc-foot').textContent = '';
      const finish = () => {
        if (resultPending !== finish) return;
        resultPending = null;
        lastChoiceMajor = false;
        document.body.classList.remove('choice-open');
        sfx('next');
        const card = $('#choice');
        card.classList.add('closing');
        setTimeout(() => { if (!pendingChoice) card.hidden = true; card.classList.remove('closing'); }, 220);
        updateBar();
        setTimeout(resolve, 230);
      };
      resultPending = finish;
      $('#cr-next').addEventListener('click', finish);
      setTimeout(() => { try { $('#cr-next').focus({ preventScroll: true }); } catch (_) {} }, 50);
      if (auto) autoLater(finish, Math.max(1400, (R.text || '').length * 35), () => resultPending === finish);
    });
  };
  CITY.hooks.update = () => renderAll();
  CITY.hooks.ach = (id) => {
    const A = CITY.ach[id]; if (!A) return;
    const d = document.createElement('div');
    d.className = 'ach-toast t-' + A.tier;
    d.innerHTML = '<small>获得见闻 · ' + TIERS[A.tier] + '</small><b>' + esc(A.name) + '</b>';
    const box = $('#ach-toasts'); box.appendChild(d);
    sfx('ach', A.tier);
    setTimeout(() => d.classList.add('out'), 3200);
    setTimeout(() => d.remove(), 3800);
  };

  // ---------- 渲染 ----------
  function renderAll(refreshPlans = true) {
    if (!S) return;
    $('#tb-name').textContent = S.name + (S.gender === 'f' ? ' ♀' : ' ♂');
    $('#tb-era').textContent = ERA_NAME[CITY.eraOf(S.wy)] + ' · ' + S.home;
    $('#tb-age').textContent = S.age;
    $('#pc-job').textContent = CITY.jobTitle(S);
    $('#pc-home').textContent = '生于' + S.birthHome + (S.home !== S.birthHome ? ' · 现居' + S.home : '') + ' · ' + CITY.wealthName(S.fam.wealth) + ' · ' + CITY.parentsName[S.fam.parents];
    renderStats();
    const m = $('#pc-money');
    tweenMoney(m, S.money);
    m.classList.toggle('neg', S.money < 0);
    const ageEl = $('#tb-age');
    if (ageEl._v !== S.age) { if (ageEl._v != null) { ageEl.classList.remove('tick'); void ageEl.offsetWidth; ageEl.classList.add('tick'); if (!REPLAY && S.age > ageEl._v) sfx('year'); } ageEl._v = S.age; }
    $('#pc-fame').textContent = fameName(S.fame);
    const openTraits = $$('#pc-traits details[open]').map((el) => el.dataset.trait);
    $('#pc-traits').innerHTML = CITY.traitsMarkup(S, openTraits);
    renderInventory();
    const historyOpen = $('#stories-list details[open]');
    $('#stories-list').innerHTML = CITY.storiesMarkup(S);
    if (historyOpen && $('#stories-list details')) $('#stories-list details').open = true;
    const rel = [];
    if (S.spouse) rel.push((S.spouse.alive ? '伴侣：' : S.spouse.left ? '前任：' : '亡故的伴侣：') + S.spouse.name);
    const kids = S.kids.filter((k) => k.alive);
    if (S.kids.length) rel.push('子女：' + S.kids.map((k) => k.name + (k.alive ? '' : '（已故）')).join('、'));
    $('#pc-rel').innerHTML = rel.map(esc).join('<br>');
    $('#pc-titles').innerHTML = S.titles.length ? '名号：' + S.titles.map((t) => '<b>' + esc(t) + '</b>').join(' / ') : '';
    if (refreshPlans) { renderFocus(); renderActs(); }
    renderGrid();
    renderMates();
    renderCond();
  }
  let shownStats = null, statOwner = null, statSfxLock = false;
  function renderStats() {
    const st = $('#stats');
    const keys = ['body', 'mind', 'wit', 'skill', 'social'];
    if (statOwner !== S || !st.children.length) {
      statOwner = S; shownStats = null;
      st.innerHTML = keys.map((k) => '<div class="stat" data-k="' + k + '"><span class="k">' + CITY.STAT_NAMES[k] + '</span><span class="bar"><i></i></span><span class="v"></span></div>').join('');
    }
    keys.forEach((k, i) => {
      const v = Math.round(CITY.stat(S, k));
      const row = st.children[i];
      const bonus = CITY.statBonus(S, k);
      row.title = '基础 ' + Math.round(S.st[k]) + (bonus ? ' · 特质与装备 ' + (bonus > 0 ? '+' : '') + bonus : '');
      row.classList.toggle('low', v < 20);
      $('i', row).style.width = v + '%';
      $('.v', row).textContent = v;
      if (shownStats && !REPLAY) {
        const d = v - shownStats[k];
        if (d) {
          const f = document.createElement('span');
          f.className = 'sfloat ' + (d > 0 ? 'up' : 'down');
          f.textContent = (d > 0 ? '+' : '') + d;
          row.appendChild(f);
          setTimeout(() => f.remove(), 1600);
          row.classList.remove('flash-up', 'flash-down'); void row.offsetWidth; row.classList.add(d > 0 ? 'flash-up' : 'flash-down');
          if (!statSfxLock) { statSfxLock = true; setTimeout(() => (statSfxLock = false), 120); sfx(d > 0 ? 'statUp' : 'statDown'); }
        }
      }
    });
    shownStats = {}; keys.forEach((k) => (shownStats[k] = Math.round(CITY.stat(S, k))));
  }
  function renderInventory() {
    const box = $('#inventory-list');
    const opened = $$('details[open]', box).map((el) => el.dataset.possession);
    $('#inventory-count').textContent = Object.values(S.items).reduce((n, x) => n + x.count, 0) + ' 件';
    const busy = pendingChoice || resultPending ? '完成眼前的选择后，就能整理物品。' : S._event ? '这一段经历结束后，就能整理物品。' : yearBusy && S.rulesVersion < 6 ? '这段旧人生请在年末暂停后整理物品。' : '';
    box.innerHTML = CITY.inventoryMarkup(S, opened, busy);
  }
  $('#inventory-list').addEventListener('click', (ev) => {
    const button = ev.target.closest('button[data-item-action]'); if (!button || !S) return;
    if (pendingChoice || resultPending || !$('#birthcard').hidden || S._event || yearBusy && S.rulesVersion < 6) { toast(pendingChoice || resultPending ? '先完成眼前的选择，再整理随身物品。' : '这一段经历尚未结束，继续时间后就能整理物品。'); return; }
    const action = { id: button.dataset.item, type: button.dataset.itemAction };
    if (!CITY.inventoryAction(S, action)) return;
    if (REC) REC.x.push({ at: REC.y.length, ...(yearBusy ? { beforeEvent: (S.eventSerial || 0) + 1 } : {}), ...action });
    renderAll(); if (!yearBusy) saveCur();
    toast((action.type === 'use' ? '已使用：' : action.type === 'equip' ? '已装备：' : '已收起：') + CITY.ITEMS[action.id].name);
  });
  function tweenMoney(el, to) {
    const from = el._v == null || REPLAY ? to : el._v;
    el._v = to;
    if (from === to) { el.textContent = CITY.fmtMoney(to); return; }
    const t0 = performance.now(), dur = 700;
    el.classList.remove('m-up', 'm-down'); void el.offsetWidth; el.classList.add(to > from ? 'm-up' : 'm-down');
    if (to > from && to - from >= 10000) sfx('coinsMoney');
    cancelAnimationFrame(el._raf);
    const step = (t) => {
      const r = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - r, 3);
      el.textContent = CITY.fmtMoney(Math.round(from + (to - from) * e));
      if (r < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }
  function fameName(f) {
    if (f >= 90) return '整座都市都流传着这个名字';
    if (f >= 70) return '各区事务所与堂口皆知其名';
    if (f >= 45) return '在几条街区与同行间叫得响字号';
    if (f >= 20) return '附近街坊与熟客认得你的脸';
    return '芸芸众生里的无名之辈';
  }
  function renderFocus() {
    const list = CITY.focusList(S);
    if (!list.includes(S.focus)) S.focus = list.includes('work') && S.job.id !== 'none' && S.age >= 18 ? 'work' : list[0];
    const html = list.map((k) => {
      const F = CITY.FOCUS[k];
      return '<button data-f="' + k + '" class="' + (S.focus === k ? 'on' : '') + '">' + F.name + '<small>' + F.desc + '</small></button>';
    }).join('');
    $('#focus').innerHTML = html;
  }
  function renderActs() {
    const list = CITY.actionList ? CITY.actionList(S) : [];
    if (S.act && !list.includes(S.act)) S.act = null;
    let html = list.length ? list.map((k) => { const A = CITY.ACTIONS[k]; return '<button data-a="' + k + '" class="' + (S.act === k ? 'on' : '') + '" title="' + esc(A.desc) + '">' + A.name + '</button>'; }).join('') : '<span class="muted" style="font-size:12px">眼下没有多余的门路可走，只能先熬过今年。</span>';
    // 路线线索：把还锁着的入口写清缺什么，不代替玩家作决定。
    const tips = S.alive && CITY.actionHints ? CITY.actionHints(S, 3) : [];
    if (tips.length) html += '<div class="act-tips">' + tips.map((t) => '<span><b>' + esc(t.name) + '</b>' + esc(t.why) + '</span>').join('') + '</div>';
    $('#acts').innerHTML = html;
  }
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('.acts button'); if (!a || !S || !S.alive) return;
    S.act = S.act === a.dataset.a ? null : a.dataset.a;
    renderActs();
    if (S.act) toast('明年年初：' + CITY.ACTIONS[S.act].name);
  });
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('.focus button'); if (!b || !S) return;
    S.focus = b.dataset.f; renderFocus();
  });
  function renderGrid() {
    const g = $('#lifegrid');
    const n = Math.max(S.age + 1, 80);
    const kinds = {};
    for (const l of S.log) {
      const k = l.kind === 'death' ? 'death' : l.kind === 'star' ? 'star' : l.kind === 'q' ? 'q' : 'n';
      const pr = { death: 4, star: 3, q: 2, n: 1 };
      if (!kinds[l.age] || pr[k] > pr[kinds[l.age]]) kinds[l.age] = k;
    }
    let h = '';
    for (let i = 0; i < n; i++) h += '<i class="' + (i <= S.age ? kinds[i] || 'n' : '') + '" title="' + i + '岁"></i>';
    g.innerHTML = h;
  }
  function renderCond() {
    const c = [];
    if (S.job.id === 'fixer' && CITY.fxNeed) {
      if (S.job.rank > 1) {
        const n = CITY.fxNeed(S.job.rank), m = Math.min(n, Math.floor(S.job.merit));
        c.push('<div class="prog"><span>晋升功绩 · 距' + (S.job.rank - 1) + '阶</span><b>' + m + ' / ' + n + '</b><i style="width:' + (m / n * 100) + '%"></i></div>');
      } else if (!S.flags.color) {
        const f = Math.min(55, Math.round(S.fame)), q = Math.min(14, S.c.req || 0), k = Math.min(70, Math.round(S.st.skill));
        c.push('<div class="prog"><span>通往特色 · 名声</span><b>' + f + ' / 55</b><i style="width:' + (f / 55 * 100) + '%"></i></div>');
        c.push('<div class="prog"><span>通往特色 · 完成委托</span><b>' + q + ' / 14</b><i style="width:' + (q / 14 * 100) + '%"></i></div>');
        c.push('<div class="prog"><span>通往特色 · 武艺</span><b>' + k + ' / 70</b><i style="width:' + (k / 70 * 100) + '%"></i></div>');
      }
    }
    c.push('时代：' + ERA_NAME[CITY.eraOf(S.wy)]);
    c.push('收入：约 ' + CITY.fmtMoney(CITY.income(S)) + ' / 年');
    if (S.pros) c.push('义体：' + S.pros + ' 处');
    if (S.flags.debt) c.push('<span class="warnc">负债累累（催收人随时登门）</span>');
    if (S.dist >= 70) c.push('<span class="violet">耳畔正回荡着那个温柔如暖阳的劝诱声</span>');
    else if (S.dist >= 40) c.push('<span class="violet">心底的裂隙正渗出挥之不去的执念与低语</span>');
    if (CITY.stat(S, 'body') < 20) c.push('<span class="warnc">肉体濒临油尽灯枯</span>');
    if (CITY.stat(S, 'mind') < 20) c.push('<span class="warnc">理智之弦濒临崩断</span>');
    $('#cond').innerHTML = c.join('<br>');
  }

  // ---------- 控制 ----------
  function setSpeed(sp) {
    speed = sp;
    $$('#speed button').forEach((b) => b.classList.toggle('on', +b.dataset.sp === sp));
    updateBar();
  }
  let lastSpeed = 1;
  $('#speed').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; const sp = +b.dataset.sp; if (sp) lastSpeed = sp; setSpeed(sp); });
  $('#btn-auto').addEventListener('click', () => {
    auto = !auto; $('#btn-auto').classList.toggle('on', auto);
    if (auto && pendingChoice) pendingChoice.done(Math.floor(Math.random() * pendingChoice.n));
    if (auto && typeof resultPending === 'function') resultPending();
  });
  document.body.appendChild($('#menu'));
  function openSettings() {
    const activeLife = !!S && $('#scr-game').classList.contains('active');
    $('#mc-life').hidden = !activeLife;
    $('#menu [data-m="resume"]').textContent = activeLife ? '继续' : '返回';
    $('#menu').hidden = false;
  }
  $('#btn-menu').addEventListener('click', openSettings);
  $('#btn-title-settings').addEventListener('click', openSettings);
  $('#menu').addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b) { if (ev.target.id === 'menu') $('#menu').hidden = true; return; }
    const m = b.dataset.m;
    if (m === 'purge') { $('#stock-clear').hidden = false; $('#stock-cancel').focus(); return; }
    // 开关留在面板里，直接看到状态变化
    if (m === 'step') { stepMode = !stepMode; renderSwitches(); try { localStorage.setItem('citylife.step', stepMode ? '1' : ''); } catch (_) {} return; }
    if (m === 'timed') { timedChoices = !timedChoices; renderSwitches(); try { localStorage.setItem('citylife.timed-choices', timedChoices ? '1' : ''); } catch (_) {} return; }
    $('#menu').hidden = true;
    if (m === 'restart') clearCur(), startGame({ name: S.name, gender: S.gender, era: lastOpt && lastOpt.era });
    if (m === 'quit') { runId++; pendingChoice = null; $('#choice').hidden = true; document.body.classList.remove('choice-open'); go('title'); }
    if (m === 'abandon') { runId++; pendingChoice = null; clearCur(); $('#choice').hidden = true; document.body.classList.remove('choice-open'); go('title'); }
  });
  $('#stock-cancel').addEventListener('click', () => { $('#stock-clear').hidden = true; $('#menu [data-m="purge"]').focus(); });
  $('#stock-confirm').addEventListener('click', () => {
    if (!CITY.store.clearAll()) { toast('无法完成整理：浏览器没有允许清除存档。'); return; }
    runId++; REC = null; pendingChoice = null; resultPending = null;
    location.reload();
  });
  document.addEventListener('keydown', (ev) => {
    if (!$('#stock-clear').hidden) {
      if (ev.key === 'Escape') { ev.preventDefault(); $('#stock-clear').hidden = true; $('#menu [data-m="purge"]').focus(); }
      if (ev.key === 'Tab') {
        ev.preventDefault();
        const first = $('#stock-cancel'), last = $('#stock-confirm');
        (document.activeElement === first ? last : first).focus();
      }
      return;
    }
    if (!$('#menu').hidden) { if (ev.key === 'Escape') $('#menu').hidden = true; return; }
    if (!$('#scr-game').classList.contains('active')) return;
    if (ev.target.tagName === 'INPUT') return;
    if (typeof resultPending === 'function' && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); resultPending(); return; }
    if (resultPending) return;
    if (pendingChoice && /^[1-9]$/.test(ev.key)) { const i = +ev.key - 1; if (i < pendingChoice.n) pendingChoice.done(i); ev.preventDefault(); return; }
    if (ev.key === ' ') { ev.preventDefault(); if (speed) { lastSpeed = speed; setSpeed(0); } else setSpeed(lastSpeed || 1); }
    if (ev.key === ']') setSpeed(speed >= 2 ? 4 : speed === 1 ? 2 : 1);
    if (ev.key === '[') setSpeed(speed === 4 ? 2 : 1);
  });

  // ---------- 死亡 ----------
  let fresh = [];
  function onDeath() {
    sfx('death');
    CITY.finish(S);
    fresh = CITY.store.record(S);
    renderGrid();
    $('#dc-name').textContent = S.name;
    $('#dc-years').textContent = '享年 ' + S.age + ' 岁 · ' + ERA_NAME[CITY.eraOf(S.birthWY)] + ' — ' + ERA_NAME[CITY.eraOf(S.wy)];
    $('#dc-cause').textContent = S.death;
    const flat = (t) => String(t || '').replace(/\s*\n+\s*/g, ''); // 摘录的段落在卡片里接成一段
    $('#dc-epi').textContent = flat(S.epitaph);
    $('#dc-titles').innerHTML = S.titles.map((t) => '<span>' + esc(t) + '</span>').join('');
    const pick = CITY.lifeHighlights(S);
    $('#dc-mates').innerHTML = MATES.length ? '<div class="side-h">与你同年出生的人</div>' + MATES.map((m) => '<div class="dm"><b>' + esc(m.name) + '</b>　' + esc(m.home) + ' · ' + (m.alive ? '仍然活着，' + esc(CITY.jobTitle(m)) : '享年' + m.age + '岁，' + esc(CITY.jobTitle(m, true)) + '。' + esc(m.death || '')) + '</div>').join('') : '';
    $('#dc-tl').innerHTML = pick.map((l) => '<li><b>' + l.age + '岁</b>' + esc(flat(l.text).length > 100 ? flat(l.text).slice(0, 98) + '……' : flat(l.text)) + '</li>').join('');
    const achs = S.ach.map((id) => [id, CITY.ach[id]]).filter((x) => x[1]).sort((a, b) => TIER_ORDER.indexOf(a[1].tier) - TIER_ORDER.indexOf(b[1].tier));
    const shown = achs.filter(([id]) => fresh.includes(id)).concat(achs.filter(([id]) => !fresh.includes(id))).slice(0, 8);
    $('#dc-ach').innerHTML = (achs.length ? '<div class="side-h">这一生的见闻 · ' + achs.length + ' 项（新 ' + fresh.length + '）</div>' : '') + shown.map(([id, A], i) => '<div class="ach-row" style="animation-delay:' + (i * 0.08) + 's"><span class="tier t-' + A.tier + '">' + TIERS[A.tier] + '</span><div>' + esc(A.name) + '<small>' + esc(A.desc) + '</small></div>' + (fresh.includes(id) ? '<span class="new">NEW</span>' : '') + '</div>').join('') + (achs.length > 8 ? '<div class="ach-more">……以及另外 ' + (achs.length - 8) + ' 项，可在见闻录中查看</div>' : '');
    $('#dc-words').value = '';
    $('#death').hidden = false;
  }
  function saveWords() {
    const w = $('#dc-words').value.trim();
    if (!w || !S) return;
    S.lastWords = w;
    const d = CITY.store.load();
    if (d.lives[0] && d.lives[0].seed === S.seed) { d.lives[0].words = w; CITY.store.save(d); }
  }
  $('#dc-again').addEventListener('click', () => { saveWords(); startGame({ era: lastOpt && lastOpt.era }); });
  $('#dc-home').addEventListener('click', () => { saveWords(); $('#death').hidden = true; go('title'); });
  $('#dc-review').addEventListener('click', () => { saveWords(); $('#death').hidden = true; toast('点击右上角 ⋯ 可回到标题'); });
  $('#dc-copy').addEventListener('click', () => {
    saveWords();
    const lines = ['【生于都市】' + S.name + '的一生', S.epitaph, '死因：' + S.death, S.titles.length ? '名号：' + S.titles.join('、') : '', S.lastWords ? '留言：' + S.lastWords : '', '——', ...S.log.filter((l) => l.kind !== 'pick').map((l) => l.age + '岁　' + l.text), '', '种子：' + S.seed];
    const txt = lines.filter((x) => x !== '').join('\n');
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('已复制到剪贴板')).catch(() => {
      const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('已复制到剪贴板'); } catch (_) { toast('复制失败'); }
      ta.remove();
    });
  });
  function toast(t) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }

  // ---------- 见闻录 ----------
  function renderCodex() {
    const d = CITY.store.load();
    const groups = {};
    for (const id in CITY.ach) { const A = CITY.ach[id]; (groups[A.group || '其他'] = groups[A.group || '其他'] || []).push([id, A]); }
    let got = 0, tot = 0;
    let h = '';
    const ORDER = ['出生', '童年', '后巷', '翼与巢', '收尾人', '帮派与手指', '羁绊', '时代', '扭曲与光', '边狱时代', '都市怪谈', '日常', '人生', '余生', '死亡'];
    const gk = Object.keys(groups).sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
    for (const g of gk) {
      const list = groups[g].sort((a, b) => TIER_ORDER.indexOf(b[1].tier) - TIER_ORDER.indexOf(a[1].tier));
      h += '<div class="codex-group"><h3>' + esc(g) + '</h3><div class="codex-grid">';
      for (const [id, A] of list) {
        tot++;
        const has = !!d.ach[id]; if (has) got++;
        h += '<div class="cx' + (has ? '' : ' locked') + '"><span class="tier t-' + A.tier + '">' + TIERS[A.tier] + '</span><b>' + (has || !A.hidden ? esc(A.name) : '？？？') + '</b><small>' + (has ? esc(A.desc) : esc(A.hint || (A.hidden ? '尚未见闻' : A.desc))) + '</small></div>';
      }
      h += '</div></div>';
    }
    $('#codex').innerHTML = h || '<div class="empty">书页尚空，你还未在这座都市留下任何见闻。</div>';
    $('#codex-count').textContent = got + ' / ' + tot;
  }
  function renderLives() {
    const d = CITY.store.load();
    $('#lives-count').textContent = '共 ' + (d.total || 0) + ' 次人生';
    $('#lives').innerHTML = d.lives.length ? d.lives.map((l) => '<div class="life"><b>' + esc(l.name) + '</b>　' + esc(l.job) + ' · 享年' + l.age + '岁<div>' + esc(l.death) + '</div>' + (l.titles && l.titles.length ? '<div class="meta">名号：' + l.titles.map(esc).join('、') + '</div>' : '') + (l.words ? '<div class="words">“' + esc(l.words) + '”</div>' : '') + '<div class="meta">生于' + esc(l.home) + ' · ' + new Date(l.t).toLocaleString() + ' · 种子 ' + esc(l.seed) + '</div></div>').join('') : '<div class="empty">名录尚空，还没有人走完这一生。</div>';
  }

  function renderSfxBtn() { const b = $('#btn-sfx'); if (!b || !window.SFX) return; b.classList.toggle('on', window.SFX.on); b.textContent = window.SFX.on ? '♪' : '♪̸'; b.title = window.SFX.on ? '音效：开' : '音效：关'; }
  $('#btn-sfx').addEventListener('click', () => { window.SFX.on = !window.SFX.on; renderSfxBtn(); if (window.SFX.on) window.SFX.play('toggle', true); });
  const vol = $('#m-vol');
  if (vol && window.SFX) { vol.value = Math.round(window.SFX.vol * 100); vol.addEventListener('input', () => { window.SFX.vol = vol.value / 100; }); vol.addEventListener('change', () => window.SFX.play('heads', 0)); }
  renderSfxBtn();
  function renderSwitches() {
    for (const [id, on] of [['#m-step', stepMode], ['#m-timed', timedChoices]]) { $(id).classList.toggle('on', on); $(id).setAttribute('aria-pressed', on); }
  }
  try { stepMode = localStorage.getItem('citylife.step') === '1'; } catch (_) {}
  try { timedChoices = localStorage.getItem('citylife.timed-choices') === '1'; } catch (_) {}
  renderSwitches();
  go('title');

  // 调试：?demo=种子&ms=每年毫秒&choice=1（停在选择上）
  if (Q.get('demo')) {
    if (Q.get('ms')) DEMO_MS = +Q.get('ms');
    auto = !Q.get('choice');
    $('#btn-auto').classList.toggle('on', auto);
    speed = 4;
    startGame({ seed: Q.get('demo'), era: Q.get('era') || null });
  }
  if (Q.get('page')) go(Q.get('page'));
})();
