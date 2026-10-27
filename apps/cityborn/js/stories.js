/* 剧情包、固定配角与承诺。随机只用本局种子，所有状态由输入重放恢复。 */
(function () {
  'use strict';
  const C = window.CITY;
  C.STORIES = {};
  // 剧情包的效果写在选项规格里，会被包进函数；这里另存一份，供静态检查工具读取。
  C.storyEffects = [];
  const list = x => x == null ? [] : Array.isArray(x) ? x : [x];
  const active = S => Object.values(S.stories || {}).filter(x => x.status === 'active');
  C.initStories = S => { S.stories = {}; S.contacts = {}; S.storyRhythm = []; S.storyYear = { age: -1, steps: 0 }; };
  C.storyData = (S, id) => (S.stories || {})[id];
  C.storyPerson = (S, id) => {
    const x = C.storyData(S, id), person = x && S.contacts[x.person];
    return person ? person.name : '对方';
  };
  // 跨剧情包共用同一个人物：只要 person 写成同一个 id，名字与信任就会延续。
  C.contactName = (S, person) => {
    const p = S.contacts && S.contacts[person];
    return p ? p.name : '对方';
  };
  C.contactTrust = (S, person) => (S.contacts && S.contacts[person] ? S.contacts[person].trust : 0);
  // 世界阶段是叙事窗口，不标作真实都市纪年，也不把后期章节每隔数年重演一次。
  C.worldStage = S => S.wy < -1 ? 'lob' : S.wy === -1 ? 'fall' : S.wy === 0 ? 'lib' : S.wy < 3 ? 'aftermath' : 'limbus';
  const human = S => S.alive && !['book', 'distorted'].includes(S.job.id);
  C.storyRoutes = {
    human, labor: S => human(S) && S.job.id === 'labor', shop: S => human(S) && S.job.id === 'shop',
    chef: S => human(S) && S.job.id === 'chef', mech: S => human(S) && S.job.id === 'mech',
    doctor: S => human(S) && S.job.id === 'doctor', clerk: S => human(S) && S.job.id === 'clerk',
    research: S => human(S) && S.job.id === 'research', student: S => human(S) && S.job.id === 'student',
    none: S => human(S) && S.age >= 18 && S.job.id === 'none',
    child: S => human(S) && S.age >= 6 && S.age < 18,
    fixer: S => human(S) && S.job.id === 'fixer',
    // 不区分具体翼的“翼职员”路线，用于写跨翼通用的处境（通勤、考核、调岗、离职）。
    wing_any: S => human(S) && S.job.id === 'wing' && C.worldStage(S) !== 'limbus',
    office: S => human(S) && S.job.id === 'fixer' && !!S.flags.office_member && !S.flags.assoc,
    owner: S => human(S) && S.job.id === 'fixer' && !!S.flags.office_own && !S.flags.assoc,
    freelance: S => human(S) && S.job.id === 'fixer' && !!S.flags.freelance && !S.flags.assoc,
    high: S => human(S) && S.job.id === 'fixer' && S.job.rank <= 3,
    syndicate: S => human(S) && S.job.id === 'syndicate',
    kurokumo: S => human(S) && S.job.id === 'kurokumo', blade: S => human(S) && S.job.id === 'blade',
    heishou: S => human(S) && !!S.flags.sy_beast_delivery,
    lccb: S => human(S) && S.job.id === 'lccb' && C.worldStage(S) === 'limbus',
    outskirts: S => human(S) && S.loc === 'outskirts',
    lake: S => human(S) && (S.flags.lake || S.flags.lake_job || S.vars.wg_route === 'U'),
    ego: S => human(S) && !!S.flags.ego, distorted: S => S.alive && S.job.id === 'distorted',
    blood: S => human(S) && !!S.flags.bloodfiend,
    library: S => human(S) && S.wy === 0,
    returned: S => human(S) && !!S.flags.library_returned,
    family: S => human(S) && !!(S.spouse && S.spouse.alive || S.kids.some(k => k.alive) || S.fam.parents !== 'none'),
    late: S => human(S) && S.age >= 45,
  };
  for (const key of ['zwei', 'shi', 'liu', 'seven', 'dieci', 'cinq', 'oufi', 'devyat', 'tres']) {
    C.storyRoutes['as_' + key] = S => C.storyRoutes.fixer(S) && !!S.flags.assoc && !!S.flags['as_' + key];
  }
  for (const key of ['thumb', 'index', 'middle', 'ring']) {
    C.storyRoutes[key] = S => human(S) && S.job.id === 'finger' && S.vars.finger === key;
  }
  for (const code of Object.keys(C.WINGS)) {
    C.storyRoutes['wing_' + code] = S => human(S) && S.job.id === 'wing' && S.vars.wg_route === code
      && (code !== 'L' || C.worldStage(S) === 'lob');
  }
  const gate = (S, A) => (C.storyRoutes[A.route] || human)(S) && (!A.req || C.test(S, A.req))
    && (!A.window || A.window.includes(C.worldStage(S)));
  const isFactionRoute = r => !['human', 'child', 'family', 'late', 'none', 'student'].includes(r);
  C.storyCanRun = (S, e) => {
    if (S.rulesVersion < 4 || !S.alive) return false;
    const A = C.STORIES[e.story.id], x = C.storyData(S, A.id);
    if (e.story.step === 0) {
      const act = active(S);
      const maxSlots = S.rulesVersion >= 8
        ? (isFactionRoute(A.route) ? (act.filter(s => isFactionRoute(C.STORIES[s.id]?.route)).length < 2 && act.length < 4) : act.length < 3)
        : act.length < 2;
      return !x && gate(S, A) && S.age >= A.age[0] && S.age <= A.age[1]
        && maxSlots && S.storyYear.age !== S.age;
    }
    return !!(x && x.status === 'active' && x.next === e.story.step && x.due <= S.age && gate(S, A)
      && (A.route !== 'family' || x.family === familyKey(S)));
  };
  const familyKey = S => S.spouse && S.spouse.alive ? S.spouse.id || 'spouse:' + S.spouse.since + ':' + S.spouse.name
    : S.kids.some(k => k.alive) ? S.kids.find(k => k.alive).id || 'child:' + S.kids.find(k => k.alive).born + ':' + S.kids.find(k => k.alive).name : 'parents';
  C.storyEligible = (S, e) => {
    if (e.story) return C.storyCanRun(S, e);
    if (S.rulesVersion < 4) return true;
    if (e.repeat && /^(fx_req_|fx_as_|fx2_)/.test(e.id) && !e.force && S.used[e.id]) return false;
    // 先完成手头的约定，避免旧的随机职业片段在同年强行改换岗位。
    if (S.storyYear.age === S.age && S.storyYear.steps >= 2 && !e.force && e.choices) return false;
    return true;
  };
  C.storyWeight = (S, e) => {
    if (S.rulesVersion < 4 || e.manual || e.force) return 1;
    const group = e.story ? e.story.id : e.content ? e.content.group : e.id;
    const seen = S.memory.groups[group] || 0;
    const theme = e.story ? e.story.theme : e.content && e.content.theme;
    const boost = S.rulesVersion >= 8 && e.story && isFactionRoute(e.story.route) ? (S.job.years <= 3 ? 2.8 : 1.7) : 1;
    return boost / Math.pow(1 + seen, 0.8) * (theme && S.storyRhythm.slice(-2).includes(theme) ? 0.35 : 1);
  };
  C.rememberStoryEvent = (S, e) => {
    if (S.rulesVersion < 4) return;
    S.discovered.groups[e.story ? e.story.id : e.content ? e.content.group : e.id] = 1;
    if (e.content && e.choices && !e.manual && !e.force) { S.storyRhythm.push(e.content.theme); S.storyRhythm = S.storyRhythm.slice(-6); }
  };
  function enter(S, A) {
    if (S.storyYear.age !== S.age) S.storyYear = { age: S.age, steps: 0 };
    S.storyYear.steps++;
    if (S.stories[A.id]) return;
    // 同一生活人物可再会；各职业保留一位主要联系人，切换职业也不改旧人的名字。
    let person = A.person || A.id;
    if (A.route === 'family') person += ':' + familyKey(S);
    const familyName = A.route === 'family' ? S.spouse && S.spouse.alive ? S.spouse.name : S.kids.some(k => k.alive) ? S.kids.find(k => k.alive).name : '家人' : '';
    if (!S.contacts[person]) {
      // 规则7：名字跟着正文里的“他／她”走，避免“玛丽……他说”。
      // 与旧规则相同：只有真的要起新名字时才投这枚硬币，保持随机序列。
      const fixed = familyName || (A.person === 'lifeline' ? S.vars.lf_name : '');
      const coin = fixed ? '' : S.rng.chance(0.5) ? 'm' : 'f', g = S.rulesVersion >= 7 ? A.gender : coin;
      S.contacts[person] = { name: fixed || C.randName(S.rng, g), g, trust: 0, visits: 0 };
    }
    S.contacts[person].visits++;
    S.stories[A.id] = { id: A.id, status: 'active', person, next: 0, since: S.age, due: S.age,
      home: S.home, employer: S.job.org, family: familyKey(S), data: {}, decisions: [], summary: '', world: C.worldStage(S) };
    if (A.init) A.init(S, S.stories[A.id].data);
    S.storyRhythm.push(A.theme); S.storyRhythm = S.storyRhythm.slice(-6);
  }
  function close(S, A, status, ending) {
    const x = S.stories[A.id];
    if (!x || x.status !== 'active') return;
    x.status = status; x.ended = S.age; x.ending = ending;
    x.summary = A.endings && A.endings[ending] || ending;
    S.discovered.outcomes[A.id + ':' + ending] = 1;
    if (S.alive) { for (const id of x.borrowed || []) C.removeItem(S, id); x.borrowed = []; }
    S.queue = S.queue.filter(q => !(C.getEvent(q.id) || {}).story || C.getEvent(q.id).story.id !== A.id);
  }
  C.closeStory = (S, id, status, ending) => close(S, C.STORIES[id], status, ending);
  C.sweepStories = S => {
    if (S.rulesVersion < 4) return;
    for (const x of active(S)) {
      const A = C.STORIES[x.id];
      const stale = S.rulesVersion >= 8 && x.due && S.age - x.due >= 5 && !S.queue.some(q => q.id === A.nodes[x.next]?.id);
      const reason = !S.alive ? '未竟' : !gate(S, A) ? '离开' : A.local && x.home !== S.home ? '迁居'
        : A.route === 'syndicate' && x.employer !== S.job.org ? '改换帮派'
        : A.route === 'family' && x.family !== familyKey(S) ? '关系改变'
        : stale ? '搁置' : '';
      if (!reason) continue;
      close(S, A, 'interrupted', reason);
      if (S.alive) C.log(S, '「' + A.title + '」暂告一段落。' + (A.exit || ''), 'sys');
    }
  };
  // 内容工厂只负责身份与推进；每个节点的选择、线索和结果由作者分别写出。
  C.addStory = A => {
    if (C.STORIES[A.id]) throw new Error('重复剧情包：' + A.id);
    if (!C.storyRoutes[A.route]) throw new Error('未知剧情路线：' + A.route);
    A.age ||= [18, 85]; C.STORIES[A.id] = A;
    if (!A.gender) {
      const text = JSON.stringify(A.nodes, (k, v) => typeof v === 'function' ? String(v) : v);
      A.gender = (text.match(/她(?!们)/g) || []).length > (text.match(/他(?!们)/g) || []).length ? 'f' : 'm';
    }
    const advance = (S, step, spec, out) => {
      const x = S.stories[A.id];
      if (spec.data) Object.assign(x.data, typeof spec.data === 'function' ? spec.data(S, x.data) : spec.data);
      x.decisions.push(spec.key || spec.t);
      const p = S.contacts[x.person]; p.trust = Math.max(-3, Math.min(3, p.trust + (spec.trust || 0)));
      if (spec.effect) C.apply(S, spec.effect, out);
      if (spec.borrow) for (const id of list(spec.borrow)) {
        if (!C.hasItem(S, id) && C.gainItem(S, id)) (x.borrowed ||= []).push(id);
      }
      if (spec.end || step === A.nodes.length - 1) {
        const ending = spec.end || spec.t;
        close(S, A, ending === '拒绝' ? 'declined' : 'completed', ending);
        if (ending !== '拒绝') x.summary = C.fmt(S, A.endings && A.endings[ending] || spec.r);
        return;
      }
      x.next = spec.goto == null ? step + 1 : typeof spec.goto === 'function' ? spec.goto(S, x.data) : spec.goto;
      if (!Number.isInteger(x.next) || x.next <= step || x.next >= A.nodes.length) throw new Error('无效剧情分歧：' + A.id);
      // 规则7：一段故事一年只走一步，除非作者明确写了 gap: 0（同一个晚上接着发生的事）。
      // 规则8：阵营故事与短篇允许在同一年推进两步（step % 2 === 0 时紧接推进），让玩家在有限寿命内走完更多写好的故事。
      // 图书馆一类只存在一年的窗口仍按旧节奏，否则故事会在窗口关闭时被打断。
      const fastWindow = A.route === 'library' || (A.window && A.window.every(w => ['fall', 'lib'].includes(w)));
      const v8 = S.rulesVersion >= 8 && !fastWindow;
      const v7 = S.rulesVersion === 7 && !fastWindow;
      const delay = A.nodes[step].gap == null ? (v8 ? (step % 2 === 1 ? 1 : 0) : v7 ? 1 : step % 3 === 2 ? 1 : 0) : A.nodes[step].gap;
      x.due = S.age + delay;
      const next = A.nodes[x.next].id;
      if (!delay && S.storyYear.steps < (v8 || v7 ? 2 : 3)) out.next = next;
      else { x.due = Math.max(x.due, S.age + 1); S.queue.push({ id: next, at: x.due }); }
    };
    const option = (spec, step) => {
      const make = branch => ({ r: branch.r, eff: (S, out) => advance(S, step, { ...spec, ...branch }, out) });
      for (const x of [spec, spec.ok, spec.no]) if (x && x.effect) C.storyEffects.push(x.effect);
      return { t: spec.t, ...(spec.hint ? { hint: spec.hint } : {}),
        costEffects: spec.check ? { ok: { ...spec, ...spec.ok }.effect, no: { ...spec, ...spec.no }.effect } : { base: spec.effect },
        ...(spec.req ? { req: spec.req } : {}),
        ...(spec.check ? { check: spec.check, ok: make(spec.ok), no: make(spec.no) } : make(spec)) };
    };
    A.appendOption = (step, spec) => {
      A.nodes[step].options.push(spec);
      C.getEvent(A.nodes[step].id).choices.push(option(spec, step));
    };
    const job = ({ labor: 'labor', shop: 'shop', chef: 'chef', mech: 'mech', doctor: 'doctor', clerk: 'clerk', research: 'research',
      student: 'student', fixer: 'fixer', office: 'fixer', owner: 'fixer', freelance: 'fixer', high: 'fixer',
      syndicate: 'syndicate', kurokumo: 'kurokumo', blade: 'blade', lccb: 'lccb', distorted: 'distorted' })[A.route]
      || (A.route.startsWith('as_') ? 'fixer' : A.route.startsWith('wing_') ? 'wing' : ['thumb', 'index', 'middle', 'ring'].includes(A.route) ? 'finger' : null);
    A.module ||= A.route.startsWith('as_') || ['fixer', 'office', 'owner', 'freelance', 'high'].includes(A.route) ? 'fixer2'
      : A.route.startsWith('wing_') || ['clerk', 'research'].includes(A.route) ? 'wing'
      : ['thumb', 'index', 'middle', 'ring', 'syndicate', 'kurokumo', 'blade', 'heishou'].includes(A.route) ? 'syndicate'
      : ['lccb', 'lake', 'blood'].includes(A.route) ? 'limbus' : ['ego', 'distorted', 'library', 'returned'].includes(A.route) ? 'beyond'
      : A.route === 'outskirts' ? 'outskirts' : A.route === 'child' ? 'child2' : A.route === 'family' ? 'love' : A.route === 'late' ? 'late' : 'backstreet';
    C.addEvents(A.module, A.nodes.map((N, step) => ({ id: N.id, title: N.title, text: N.text,
      age: A.age, w: A.w || 18, story: { id: A.id, step, route: A.route, theme: A.theme, sources: A.sources },
      ...(step ? { manual: true } : {}), req: { ...(job ? { job } : {}), fn: S => C.storyCanRun(S, { story: { id: A.id, step } }) },
      eff: S => enter(S, A), choices: (step || N.options.some(o => o.end === '拒绝') ? N.options : [...N.options, {
        t: '这次先不参与', r: '', end: '拒绝',
      }]).map(o => option(o, step)) })));
  };
  // 作者使用的短记法，仍生成普通、可检查的事件和选项。
  C.storyNode = (id, title, text, options, gap) => ({ id, title, text, options, ...(gap == null ? {} : { gap }) });
  C.storyOption = (t, r, data, effect, extra) => ({ t, r, ...(data ? { data } : {}), ...(effect ? { effect } : {}), ...extra });
  C.storyCheck = (t, stat, dc, ok, no, extra) => ({ t, check: { s: stat, dc }, ok, no, ...extra });
  C.storyPack = (A, rows) => C.addStory({ ...A, nodes: rows.map((row, i) => ({
    id: 'ex_' + A.id + '_' + (i + 1), title: row[0], text: row[1],
    options: row[2], ...(row[3] == null ? {} : { gap: row[3] }),
  })) });
  C.storyEntries = S => C.events.filter(e => e.story && e.story.step === 0 && C.storyCanRun(S, e));
  C.storyNext = S => active(S).map(x => C.getEvent(C.STORIES[x.id].nodes[x.next].id)).find(e => C.storyCanRun(S, e));
  C.storySummary = S => {
    const done = Object.values(S.stories || {}).filter(x => x.status === 'completed');
    const x = done[done.length - 1];
    return x ? '你与' + C.storyPerson(S, x.id) + '经历过「' + C.STORIES[x.id].title + '」。' + (x.summary === '完成' ? '' : x.summary) : '';
  };
  C.installStoryActions = () => {
    C.ACTIONS.visit = { name: '处理手头的约定', desc: '回到已经接下的事情里', req: { fn: S => S.rulesVersion >= 4 && !!C.storyNext(S) }, ev: S => C.storyNext(S)?.id, cd: 1 };
    C.ACTIONS.findstory = { name: '打听身边的事', desc: '寻找当前身份能参与的新经历', req: { fn: S => S.rulesVersion >= 4 && C.storyEntries(S).length > 0 },
      ev: S => S.rng.wpick(C.storyEntries(S), e => C.eventWeight(S, e))?.id, cd: 2 };
    C.ACTIONS.associations = { name: '打听协会的招募', desc: '达到条件后，主动接触愿意面谈的协会', req: { age: [20, 55], job: 'fixer', rank: [1, 6], noflag: ['assoc', 'office_own'], fn: S => S.rulesVersion >= 4 }, ev: 'fx_assoc_invite', cd: 3 };
    C.ACTIONS.beastwork = { name: '打听H公司方向的运货差事', desc: '以普通帮工的身份接触外围运输', req: { age: [18, 70], loc: 'backstreet', nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'distorted', 'book'], noflag: ['finger_quit'], fn: S => (S.rulesVersion >= 8 || S.wing === 'H') && S.rulesVersion >= 4 && !S.used.sy_beast_road }, ev: 'sy_beast_road', cd: 3 };
  };
})();
