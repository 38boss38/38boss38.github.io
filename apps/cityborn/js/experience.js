/* 阅读、报价和人生回顾：只读取状态，不投随机数，也不执行事件效果。 */
(function () {
  'use strict';
  const C = window.CITY;
  function payment(balance, effect) {
    if (Array.isArray(effect)) return effect.reduce((state, x) => {
      const next = payment(state.balance, x); return { balance: next.balance, paid: state.paid + next.paid };
    }, { balance, paid: 0 });
    if (!effect || typeof effect !== 'object') return { balance, paid: 0 };
    const next = typeof effect.money === 'number' ? balance + effect.money
      : typeof effect.money === 'string' && /^-?\d+(\.\d+)?%$/.test(effect.money) ? Math.round(balance * (1 + parseFloat(effect.money) / 100)) : balance;
    return { balance: next, paid: Math.max(0, balance - next) };
  }
  C.choiceCosts = function (S, choice) {
    const source = choice.costEffects || { base: choice.eff, ok: choice.ok?.eff, no: choice.no?.eff, res: choice.res?.filter(x => C.test(S, x.req)).map(x => x.eff) };
    const base = payment(S.money, source.base);
    const cost = effect => Math.round(base.paid + payment(base.balance, effect).paid);
    if (choice.check) {
      const ok = cost(source.ok), no = cost(source.no);
      return { max: Math.max(ok, no), text: ok === no ? (ok ? '支出 ' + C.fmtMoney(ok) : '') : '成功支出 ' + C.fmtMoney(ok) + ' · 失败支出 ' + C.fmtMoney(no) };
    }
    const amounts = source.res?.length ? source.res.map(cost) : [base.paid];
    const low = Math.min(...amounts), high = Math.max(...amounts);
    return { max: high, text: high ? '支出 ' + (low === high ? C.fmtMoney(high) : C.fmtMoney(low) + '～' + C.fmtMoney(high)) : '' };
  };
  function consequential(effect) {
    if (Array.isArray(effect)) return effect.some(consequential);
    if (typeof effect === 'function') return true;
    return !!effect && typeof effect === 'object' && (typeof effect.fn === 'function'
      || (effect.body ?? effect.st?.body ?? 0) <= -10 || (effect.mind ?? effect.st?.mind ?? 0) <= -15 || (effect.dist || 0) >= 10
      || ['job', 'loc', 'spouse', 'kid', 'kidDie', 'pros', 'death', 'risk', 'next', 'queue'].some(k => effect[k] != null));
  }
  // 规则7：只有会改写人生走向的选择才停下时间——换工作、搬家、婚育、生死、重伤或一大笔钱。
  // 剧情节点、后续和函数效果不再自动算“重大”；函数只在源码里动到这些状态时才算。
  const LIFE_CHANGING = /.job|job:|.loc|loc:|spouse|kids|kidDie|.alive|death|.pros|home|setJob|startJob|leaveJob/;
  function lifeChanging(effect, v8) {
    if (Array.isArray(effect)) return effect.some(x => lifeChanging(x, v8));
    if (typeof effect === 'function') return (v8 ? /\.job\s*=|\bjob\s*:\s*\{|\.loc\s*=|\bloc\s*:\s*\{|spouse|kids|kidDie|\.alive\s*=|death|setJob|startJob|leaveJob|joinAssoc|joinFinger|hire\(/ : LIFE_CHANGING).test(String(effect));
    if (!effect || typeof effect !== 'object') return false;
    if (v8) {
      return (typeof effect.fn === 'function' && /\.job\s*=|\bjob\s*:\s*\{|\.loc\s*=|\bloc\s*:\s*\{|spouse|kids|kidDie|\.alive\s*=|death|setJob|startJob|leaveJob|joinAssoc|joinFinger|hire\(/.test(String(effect.fn)))
        || (effect.body ?? effect.st?.body ?? 0) <= -14 || (effect.mind ?? effect.st?.mind ?? 0) <= -18 || (effect.dist || 0) >= 15
        || ['job', 'loc', 'spouse', 'kid', 'kidDie', 'death'].some(k => effect[k] != null)
        || (effect.risk && effect.risk[0] >= 0.12);
    }
    return (typeof effect.fn === 'function' && LIFE_CHANGING.test(String(effect.fn)))
      || (effect.body ?? effect.st?.body ?? 0) <= -10 || (effect.mind ?? effect.st?.mind ?? 0) <= -15 || (effect.dist || 0) >= 10
      || ['job', 'loc', 'spouse', 'kid', 'kidDie', 'pros', 'death', 'risk'].some(k => effect[k] != null);
  }
  C.isMajorChoice = function (S, event, choices = event.choices || []) {
    if (S.rulesVersion >= 8) {
      if (event.star || event.tag === 'major') return true;
      if (event.story) {
        const A = C.STORIES && C.STORIES[event.story.id];
        if (A && event.story.step === A.nodes.length - 1) return true;
      }
      return choices.some(choice => {
        const source = choice.costEffects;
        const effects = source ? [source.base, source.ok, source.no, ...(source.res || [])] : [choice.eff, choice.ok?.eff, choice.no?.eff, ...(choice.res || []).filter(x => C.test(S, x.req)).map(x => x.eff)];
        const price = C.choiceCosts(S, choice).max;
        return effects.some(x => lifeChanging(x, true)) || price >= 80000 || price >= Math.max(30000, Math.max(0, S.money) * 0.65);
      });
    }
    if (S.rulesVersion >= 7) {
      if (event.force || event.star || event.tag === 'major') return true;
      return choices.some(choice => {
        const source = choice.costEffects;
        const effects = source ? [source.base, source.ok, source.no, ...(source.res || [])] : [choice.eff, choice.ok?.eff, choice.no?.eff, ...(choice.res || []).filter(x => C.test(S, x.req)).map(x => x.eff)];
        const price = C.choiceCosts(S, choice).max;
        return effects.some(x => lifeChanging(x, false)) || price >= 30000 || price >= Math.max(5000, Math.max(0, S.money) * 0.4);
      });
    }
    if (event.manual || event.story || event.force || event.star || event.tag === 'major') return true;
    return choices.some(choice => {
      const source = choice.costEffects;
      const effects = source ? [source.base, source.ok, source.no, ...(source.res || [])] : [choice.eff, choice.ok?.eff, choice.no?.eff, ...(choice.res || []).filter(x => C.test(S, x.req)).map(x => x.eff)];
      const price = C.choiceCosts(S, choice).max;
      return effects.some(consequential) || price >= 20000 || price >= Math.max(1000, Math.max(0, S.money) * 0.2);
    });
  };
  C.choiceSeconds = (text, options, S) => S && S.rulesVersion >= 8
    ? Math.min(18, Math.max(7, Math.ceil((String(text).length + options.reduce((n, o) => n + o.t.length, 0)) / 26) + 5))
    : Math.min(60, Math.max(18, Math.ceil((String(text).length + options.reduce((n, o) => n + o.t.length + (o.hint || '').length + (o.cost || '').length, 0)) / 7) + 8));
  C.smartPickChoice = function (S, opts) {
    let best = 0, bestScore = -1e9;
    opts.forEach((o, i) => {
      let sc = (o.p != null ? o.p * 2 : 1) - (/拒绝|不参与|不接|算了|离开|放弃|退缩|不管/.test(o.t) ? 1.5 : 0) + (i === 0 ? 0.15 : 0);
      if (o.cost && S.money < 20000) sc -= 0.8;
      if (sc > bestScore) { bestScore = sc; best = i; }
    });
    return best;
  };
  C.lifeHighlights = function (S, limit = 6) {
    const candidates = [];
    for (let i = 0; i < S.log.length; i++) {
      const entry = S.log[i], event = C.getEvent(entry.ev);
      if (!entry.age || !entry.text || ['q', 'pick', 'sys', 'death'].includes(entry.kind)) continue;
      const result = !!entry.choice || entry.kind === 'r' || S.log[i - 1]?.kind === 'pick' && S.log[i - 1].ev === entry.ev;
      if (!result && entry.kind !== 'star') continue;
      const impacts = entry.impacts || [];
      if (event?.story && S.stories?.[event.story.id]?.status === 'declined' && !impacts.length) continue;
      let score = result ? 4 : 1;
      if (event?.story) score += 3;
      if (event?.req && (event.req.flag || event.req.anyflag || event.req.used)) score += 3;
      if (impacts.some(d => ['job', 'home', 'spouse', 'kids', 'parents', 'title'].includes(d.k))) score += 8;
      if (impacts.some(d => ['item', 'trait'].includes(d.k))) score += 3;
      if (impacts.some(d => d.k === 'money' && Math.abs(d.v) >= 20000)) score += 2;
      if (entry.kind === 'star' && result) score += 2;
      if (entry.notes?.length && !impacts.length) score = Math.min(score, 2);
      candidates.push({ age: entry.age, ev: entry.ev, group: event?.story?.id || entry.ev || 'world:' + entry.age, score,
        text: (event?.title ? event.title + '：' : '') + entry.text, index: i });
    }
    const chosen = [], groups = new Set();
    for (const candidate of candidates.sort((a, b) => b.score - a.score || b.age - a.age || b.index - a.index)) {
      if (groups.has(candidate.group)) continue;
      groups.add(candidate.group); chosen.push(candidate);
      if (chosen.length >= limit) break;
    }
    return chosen.sort((a, b) => a.age - b.age || a.index - b.index);
  };
})();
