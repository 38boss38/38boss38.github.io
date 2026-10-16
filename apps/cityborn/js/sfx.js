/* 音效：全部用 WebAudio 实时合成，不需要音频文件。
 * 投币是重点：旋转时的金属颤音、正面的清脆“叮”、反面的闷响、威力累加的计数声、判定成功/失败的定音。
 */
(function () {
  'use strict';
  const KEY = 'citylife.sfx';
  let ctx = null, master = null, verb = null, enabled = true, volume = 0.7;
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) { enabled = s.on !== false; volume = s.vol != null ? s.vol : 0.7; } } catch (_) {}

  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    // 简单的混响：一段衰减噪声做卷积
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 1.4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    verb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    verb.connect(wet).connect(master);
    master.connect(ctx.destination);
    return ctx;
  }
  // 浏览器要求用户交互后才能出声
  ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); }, { capture: true }));

  const now = () => ctx.currentTime;
  function out(node, dry, wet) {
    const g = ctx.createGain(); g.gain.value = dry == null ? 1 : dry; node.connect(g).connect(master);
    if (wet) { const w = ctx.createGain(); w.gain.value = wet; node.connect(w).connect(verb); }
  }
  // 一个带包络的振荡器
  function tone(o) {
    const t = now() + (o.at || 0);
    const osc = ctx.createOscillator(); osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + (o.glide || o.d));
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v || 0.2, t + (o.a || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    let n = osc.connect(g);
    if (o.lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; n = g.connect(f); }
    out(n, 1, o.wet);
    osc.start(t); osc.stop(t + o.d + 0.05);
  }
  function noise(o) {
    const t = now() + (o.at || 0), len = Math.ceil(ctx.sampleRate * o.d);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = o.ft || 'bandpass'; f.frequency.setValueAtTime(o.f || 2000, t); if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.d); f.Q.value = o.q || 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.v || 0.1, t + (o.a || 0.003)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    out(src.connect(f).connect(g), 1, o.wet);
    src.start(t); src.stop(t + o.d + 0.02);
  }
  // 金属音：几组不成谐波关系的分音
  function metal(f, v, d, at, wet) {
    [1, 2.76, 5.4, 8.93].forEach((m, i) => tone({ f: f * m, v: v / (1 + i * 1.6), d: d / (1 + i * 0.5), at, a: 0.002, wet: wet == null ? 0.5 : wet }));
  }

  const SFX = {
    // 界面
    click() { tone({ f: 1800, f2: 1200, d: 0.05, v: 0.05, type: 'triangle' }); noise({ f: 4000, d: 0.025, v: 0.03, q: 2 }); },
    hover() { tone({ f: 2400, d: 0.03, v: 0.015, type: 'sine' }); },
    toggle(on) { tone({ f: on ? 900 : 700, f2: on ? 1350 : 500, d: 0.08, v: 0.06, type: 'triangle' }); },
    open() { noise({ f: 300, f2: 1400, d: 0.28, v: 0.05, q: 0.7, ft: 'lowpass' }); tone({ f: 110, d: 0.4, v: 0.08, lp: 600, wet: 0.4 }); },
    close() { noise({ f: 1400, f2: 300, d: 0.18, v: 0.035, q: 0.7, ft: 'lowpass' }); },
    pick() { tone({ f: 660, d: 0.12, v: 0.08, type: 'triangle', wet: 0.3 }); tone({ f: 990, d: 0.18, v: 0.05, at: 0.05, type: 'sine', wet: 0.3 }); },
    next() { tone({ f: 520, f2: 780, d: 0.12, v: 0.06, type: 'triangle' }); },
    year() { tone({ f: 196, d: 0.6, v: 0.05, lp: 900, wet: 0.6 }); metal(1568, 0.012, 0.5, 0.02, 0.8); },
    statUp() { tone({ f: 880, f2: 1320, d: 0.1, v: 0.025, type: 'sine' }); },
    statDown() { tone({ f: 330, f2: 220, d: 0.14, v: 0.03, type: 'triangle', lp: 1200 }); },
    coinsMoney() { metal(2600, 0.03, 0.12); metal(3100, 0.025, 0.12, 0.06); },
    ach(tier) {
      const base = { common: 659, uncommon: 698, rare: 784, epic: 880, legend: 988, myth: 1047 }[tier] || 700;
      [1, 1.25, 1.5, 2].forEach((m, i) => tone({ f: base * m, d: 0.6 - i * 0.08, v: 0.05, at: i * 0.07, type: 'sine', wet: 0.7 }));
    },
    death() { tone({ f: 55, d: 3.2, v: 0.22, a: 0.6, lp: 400, wet: 0.8 }); tone({ f: 82.4, d: 3, v: 0.12, a: 0.8, lp: 500, at: 0.2, wet: 0.8 }); noise({ f: 200, d: 2.5, v: 0.04, ft: 'lowpass', a: 1, wet: 0.6 }); },
    birth() { [523, 659, 784].forEach((f, i) => tone({ f, d: 1.2, v: 0.05, at: i * 0.12, a: 0.05, wet: 0.8 })); },

    // ---------- 投币判定 ----------
    judgeOpen() { tone({ f: 73.4, d: 0.9, v: 0.14, a: 0.01, lp: 300, wet: 0.5 }); noise({ f: 800, f2: 120, d: 0.5, v: 0.06, ft: 'lowpass' }); metal(1200, 0.02, 0.6, 0.05, 0.9); },
    // 硬币弹起、旋转：高频颤音 + 轻微摩擦
    coinToss(i) {
      const p = 1 + (i || 0) * 0.04;
      metal(2200 * p, 0.05, 0.25, 0, 0.4);
      for (let k = 0; k < 5; k++) tone({ f: 5200 * p - k * 120, d: 0.03, v: 0.012, at: 0.04 + k * 0.045, type: 'sine' });
      noise({ f: 6000, d: 0.2, v: 0.012, q: 4, at: 0.02 });
    },
    // 正面：清脆、明亮、带回响
    heads(i) {
      const p = 1 + (i || 0) * 0.06;
      metal(1760 * p, 0.12, 0.9, 0, 0.8);
      tone({ f: 3520 * p, d: 0.5, v: 0.04, type: 'sine', at: 0.01, wet: 0.8 });
      noise({ f: 7000, d: 0.04, v: 0.06, q: 1.5 });
    },
    // 反面：闷、短、偏低
    tails() {
      tone({ f: 180, f2: 120, d: 0.16, v: 0.16, type: 'triangle', lp: 700 });
      metal(620, 0.04, 0.18, 0, 0.15);
      noise({ f: 900, d: 0.06, v: 0.05, q: 0.8 });
    },
    // 威力累加时的计数声，越接近阈值音越高
    power(r) { tone({ f: 440 + 660 * Math.min(1.3, r), d: 0.07, v: 0.04, type: 'square', lp: 2600 }); },
    reached() { [1, 1.5].forEach((m, i) => tone({ f: 880 * m, d: 0.3, v: 0.05, at: i * 0.05, type: 'sine', wet: 0.6 })); },
    success() {
      tone({ f: 65.4, d: 0.8, v: 0.25, a: 0.005, lp: 260, wet: 0.4 });
      noise({ f: 300, d: 0.25, v: 0.12, ft: 'lowpass' });
      [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone({ f, d: 1.4, v: 0.07, at: 0.06 + i * 0.05, a: 0.01, type: i % 2 ? 'sine' : 'triangle', wet: 0.9 }));
      metal(2093, 0.05, 1.4, 0.12, 1);
    },
    fail() {
      tone({ f: 98, f2: 49, d: 0.9, v: 0.28, a: 0.005, lp: 340, wet: 0.5 });
      noise({ f: 500, f2: 80, d: 0.5, v: 0.12, ft: 'lowpass' });
      [311.1, 293.7].forEach((f, i) => tone({ f, d: 1.1, v: 0.06, at: 0.08 + i * 0.12, type: 'triangle', lp: 1400, wet: 0.7 }));
    },
  };

  window.SFX = {
    play(name, ...a) { if (!enabled) return; if (!init()) return; if (ctx.state === 'suspended') ctx.resume(); try { SFX[name] && SFX[name](...a); } catch (_) {} },
    get on() { return enabled; },
    set on(v) { enabled = !!v; save(); },
    get vol() { return volume; },
    set vol(v) { volume = Math.max(0, Math.min(1, v)); if (master) master.gain.value = volume; save(); },
  };
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ on: enabled, vol: volume })); } catch (_) {} }
})();
