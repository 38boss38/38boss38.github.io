/* 特质与随身物品。基础属性保存在 st，持有加成在使用时计算，避免反复装备累计属性。 */
(function () {
  'use strict';
  const C = window.CITY;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const list = (x) => x == null ? [] : Array.isArray(x) ? x : [x];
  const combat = ['fixer', 'fixer2', 'actions', 'syndicate', 'progression'];
  const craft = ['backstreet', 'fixer2', 'lifelines', 'progression'];
  const mystery = ['strange', 'beyond', 'world', 'progression'];
  Object.assign(C.TRAITS, {
    '老练': { birth: false, tone: 'good', desc: '反复执行委托后学会留力。战斗判定正面率+3%。', checks: [{ stats: ['skill', 'body'], mods: combat, heads: 0.03 }] },
    '旧伤': { birth: false, tone: 'bad', desc: '阴雨天作痛的陈旧刀口。体魄−5、武艺−2，可治疗。', mods: { body: -5, skill: -2 } },
    '余悸': { birth: false, tone: 'bad', desc: '身体比记忆更早想起危险。理智−3，战斗正面率−4%，可克服。', mods: { mind: -3 }, checks: [{ stats: ['skill', 'body'], mods: combat, heads: -0.04 }] },
    '义体排异': { birth: false, tone: 'bad', desc: '金属接口反复发炎渗液。体魄−4，义体亲和者免疫。', mods: { body: -4 }, ex: ['义体亲和'] },
    '识账': { birth: false, tone: 'good', desc: '落笔前先看清费用与罚则。账务与日常才智判定属性+5。', checks: [{ stats: ['wit'], mods: ['backstreet', 'syndicate', 'lifelines', 'progression'], bonus: 5 }] },
    '守诺': { birth: false, tone: 'good', desc: '道上的人记得你办事敞亮。人脉+2，人脉判定正面率+2%。', mods: { social: 2 }, checks: [{ stats: ['social'], heads: 0.02 }] },
    '疑心': { birth: false, tone: 'mixed', desc: '每句话都要在心里盘三遍。才智+2、人脉−3，人脉正面率−3%。', mods: { wit: 2, social: -3 }, checks: [{ stats: ['social'], heads: -0.03 }] },
    '长夜听觉': { birth: false, tone: 'good', desc: '能从盲音与风声里分出暗码。异闻模块才智、理智判定属性+5。', checks: [{ stats: ['wit', 'mind'], mods: mystery, bonus: 5 }] },
    '精密手感': { birth: false, tone: 'good', desc: '指腹比卡尺更懂金属脾气。才智、武艺+2，维修才智判定属性+5。', mods: { wit: 2, skill: 2 }, checks: [{ stats: ['wit'], mods: craft, bonus: 5 }] },
    '赌瘾': { birth: false, tone: 'bad', desc: '总惦记着J公司轮盘的响声。每年流失3000眼，可戒除。', tick: (S) => { S.money -= 3000; } },
  });
  const learned = { 强韧体魄: { body: 8 }, 体弱多病: { body: -6 }, 聪慧: { wit: 6 }, 战斗直觉: { skill: 5 },
    讨人喜欢: { social: 5 }, 坚韧心志: { mind: 6 }, 神经过敏: { mind: -6 }, 过目不忘: { wit: 4 },
    剑术天分: { skill: 4 }, 能说会道: { social: 4 }, 沉默寡言: { mind: 3, social: -3 }, 好胃口: { body: 3 },
    冷血: { mind: 3, social: -3 }, 烂好人: { social: 3 }, 早熟: { wit: 2, mind: 2 } };
  for (const [id, mods] of Object.entries(learned)) C.TRAITS[id].gainMods = mods;
  for (const id of ['名门之后', '郊区之子', '家族遗物']) C.TRAITS[id].birthOnly = true;
  C.TRAITS['义体亲和'].ex = ['义体排异'];
  C.TRAITS['巧手'].checks = [{ stats: ['wit', 'skill'], mods: craft, bonus: 5 }];
  C.TRAITS['夜行者'].checks = [{ stats: ['mind'], mods: ['strange', 'world', 'progression'], heads: 0.03 }];

  C.ITEMS = {
    heirloom_badge: { name: '磨字家徽', kind: 'quest', rarity: 'rare', desc: '缝在内衬里的沉重徽章，正面翼徽已被磨平，背面留有几道浅刻痕。' },
    patched_blanket: { name: '补过的毯子', kind: 'keepsake', rarity: 'common', slot: 'accessory', mods: { mind: 2 }, desc: '襁褓时裹着你的旧毯子，边缘的针脚出自好几双手。' },
    old_tools: { name: '旧维修工具', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 12, mods: { wit: 2 }, desc: '木柄磨得油亮的螺丝刀与扳手，修日常器物最趁手。' },
    family_recipe: { name: '家里的汤方', kind: 'keepsake', rarity: 'common', desc: '浸着油点的泛黄纸页，记着家里熬骨汤的火候与香料配比。' },
    residence_copy: { name: '居住登记副本', kind: 'keepsake', rarity: 'common', desc: '父母为你保留的巢内出生登记复写件，盖着防伪钢印。' },
    camp_compass: { name: '旧指南针', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 10, mods: { wit: 2 }, desc: '表蒙裂了一道缝的黄铜罗盘，敲一下才肯转，用于郊区辨路。', checks: [{ stats: ['wit'], mods: ['outskirts'], heads: 0.03 }] },
    fixer_license: { name: '收尾人证', kind: 'quest', rarity: 'rare', desc: '하나协会核发的金属磁性执照，内嵌防伪芯片与阶位编码。' },
    handmade_knife: { name: '旧人打的刀', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '当年放过的人亲手锻打的短刃，没有工坊商标，配重极贴合掌心。' },
    workshop_blade: { name: '工坊制式长刃', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 6 }, desc: '护手内侧打着Tres协会审验钢印，重心扎实，劈砍不卷刃。' },
    stigma_blade: { name: '烙印工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 8 }, desc: '出鞘时刀脊亮起赤红烙印，附带的过热免责条款比说明书还长。', checks: [{ stats: ['skill'], mods: combat, heads: 0.02 }] },
    cloud_blade: { name: '云工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 7 }, desc: '轻量化合金锻造的长刀，提在手里极轻，挥斩时却带起凄厉啸音。' },
    allas_gloves: { name: '阿拉斯工坊的手套', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 4, body: 2 }, desc: '嵌有冲击桩的重型战术手套，衬里还留着原主攥出的深痕。' },
    borrowed_blade: { name: '备用短刃', kind: 'weapon', rarity: 'common', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '协会器械库配发的制式短刀，胜在钢口皮实、拔刀利落。' },
    reinforced_coat: { name: '加固外套', kind: 'gear', rarity: 'rare', slot: 'armor', minAge: 14, mods: { body: 4 }, desc: '里层混纺了清道夫甲壳纤维与防刺衬垫，足够在暗巷冷刀下护住心口。' },
    hp_ampule: { name: 'K公司HP安瓿', kind: 'consumable', rarity: 'rare', max: 5, use: { body: 12, mind: 2 }, desc: '盛在铅封玻璃管里的翠绿再生药液。消耗一支，恢复体魄12、理智2。' },
    repair_slip: { name: '盖章检修单', kind: 'quest', rarity: 'common', desc: '拍着护手裂纹的照片与工坊红章原件，多年后仍能拿来核对保修。' },
    inherited_pliers: { name: '师傅的旧钳子', kind: 'gear', rarity: 'rare', slot: 'accessory', minAge: 12, mods: { wit: 2, skill: 1 }, desc: '修理摊歇业时带走的平口钳，钳齿磨平了一点，握柄带着两代人的手温。' },
    workshop_key: { name: '修理摊钥匙', kind: 'quest', rarity: 'rare', desc: '盘下旧工作台时接过的黄铜小钥匙，开锁时得稍微往上抬半寸。' },
    marked_lamp: { name: '刻名台灯', kind: 'keepsake', rarity: 'rare', desc: '你年少学艺时修好的黄铜台灯，底座内侧留着你刻下的名字。' },
    shared_textbook: { name: '合抄的教材页', kind: 'quest', rarity: 'rare', desc: '归还教材前两人合抄的几页讲义，纸边留着两种字迹的批注。' },
    red_thread_key: { name: '红绳旧钥匙', kind: 'keepsake', rarity: 'common', desc: '旧住处留下的铁门钥匙，搬家后仍一直系在那根红棉绳上。' },
    route_map: { name: '手记路线图', kind: 'quest', rarity: 'rare', desc: '用炭笔标注了检查站、涵洞与末班车时刻的路线图。' },
    loan_note: { name: '分期借条', kind: 'quest', rarity: 'rare', desc: '把三万眼救命钱拆成小额期数的手写借据，压着清晰的红手印。' },
    original_tape: { name: '管道原声带', kind: 'quest', rarity: 'rare', desc: '贴着供暖铁管录下的旧磁带，电流声里夹着半串数字与漫长空白。' },
    nameless_photo: { name: '裁去姓名的合照', kind: 'quest', rarity: 'epic', desc: '从旧档案室领回的黑白合照，裁空的姓名栏宽度恰好与家徽吻合。' },
    reply_corner: { name: '无字回信的一角', kind: 'keepsake', rarity: 'epic', desc: '寄自拆迁旧楼的信封残角，半张旧照里的衣领别着同一枚家徽。' },
  };
  const source = (S, label) => {
    const e = S._event, groups = { birth: '出生登记', infant: '幼年的旧物', fixer: '收尾人的委托', fixer2: '事务所的旧事', love: '家人与旧物', lifelines: '旧人的消息' };
    const title = e && (e.title || groups[e.mod]);
    const person = e && e.story && C.storyPerson ? C.storyPerson(S, e.story.id) : e && e.mod === 'lifelines' ? S.vars.lf_name : '';
    return { age: S.age, event: e ? e.id : '', source: label || (title ? title + (person ? ' · ' + person : '') : '') || (S.age ? '这一年的经历' : '出生时随身携带') };
  };
  C.hasItem = (S, id) => !!(S.items && S.items[id] && S.items[id].count > 0);
  C.gainTrait = function (S, id, label) {
    const T = C.TRAITS[id]; if (!T || T.birthOnly || S.traits.includes(id)) return false;
    for (const other of S.traits.slice()) if ((T.ex || []).includes(other) || ((C.TRAITS[other] || {}).ex || []).includes(id)) C.removeTrait(S, other, label);
    S.traits.push(id); S.traitOrigins[id] = { ...source(S, label), born: false };
    S.traitJournal.push({ id, gained: true, ...source(S, label) }); return true;
  };
  C.removeTrait = function (S, id, label) {
    if (!S.traits.includes(id)) return false;
    S.traits = S.traits.filter((t) => t !== id); delete S.traitOrigins[id];
    S.traitJournal.push({ id, gained: false, ...source(S, label) }); return true;
  };
  C.gainItem = function (S, id, count = 1, label) {
    const I = C.ITEMS[id]; if (!I || !Number.isInteger(count) || count <= 0) return false;
    const old = S.items[id], n = Math.min(I.max || 1, (old ? old.count : 0) + Math.floor(count));
    if (old && old.count === n) return false;
    S.items[id] = old ? { ...old, count: n } : { count: n, ...source(S, label) };
    S.itemJournal.push({ id, gained: true, ...source(S, label) });
    if (I.slot && !S.equipment[I.slot] && S.age >= (I.minAge || 0)) S.equipment[I.slot] = id;
    return true;
  };
  C.removeItem = function (S, id, count = 1) {
    if (!C.hasItem(S, id) || !Number.isInteger(count) || count <= 0) return false;
    S.items[id].count -= Math.floor(count);
    if (S.items[id].count <= 0) { delete S.items[id]; for (const slot in S.equipment) if (S.equipment[slot] === id) delete S.equipment[slot]; }
    S.itemJournal.push({ id, gained: false, ...source(S) }); return true;
  };
  C.changeItems = function (S, value, direction) {
    if (!value) return;
    if (typeof value === 'string') (direction > 0 ? C.gainItem : C.removeItem)(S, value);
    else if (Array.isArray(value)) value.forEach((x) => C.changeItems(S, x, direction));
    else for (const [id, count] of Object.entries(value)) (direction > 0 ? C.gainItem : C.removeItem)(S, id, count);
  };
  const activeItems = (S) => ['book', 'distorted'].includes(S.job.id) ? []
    : Object.values(S.equipment || {}).filter((id) => C.hasItem(S, id) && S.age >= (C.ITEMS[id].minAge || 0));
  C.statBonus = function (S, key) {
    if (S.rulesVersion < 3) return 0;
    let value = 0;
    for (const id of S.traits) {
      const T = C.TRAITS[id] || {}, o = S.traitOrigins[id];
      value += (T.mods || {})[key] || 0;
      if (o && !o.born) value += (T.gainMods || {})[key] || 0;
    }
    for (const id of activeItems(S)) value += (C.ITEMS[id].mods || {})[key] || 0;
    return clamp(value, -25, 25);
  };
  C.stat = (S, key) => clamp((S.st[key] || 0) + C.statBonus(S, key), 0, 100);
  C.checkBonuses = function (S, check, key) {
    const event = C.getEvent(String(key || '').split('#')[0]), result = [];
    const add = (name, rules) => { for (const r of rules || []) if ((!r.stats || r.stats.some((s) => list(check.s).includes(s))) && (!r.mods || event && r.mods.includes(event.mod))) result.push({ name, bonus: r.bonus || 0, heads: r.heads || 0 }); };
    for (const id of S.traits) add(id, (C.TRAITS[id] || {}).checks);
    for (const id of activeItems(S)) add(C.ITEMS[id].name, C.ITEMS[id].checks);
    return result;
  };
  C.modText = (mods) => Object.entries(mods || {}).map(([k, v]) => C.STAT_NAMES[k] + (v > 0 ? '+' : '') + v).join('、');
  C.traitText = function (S, id) {
    const T = C.TRAITS[id] || {}, o = S.traitOrigins[id], mods = { ...(T.mods || {}) };
    if (o && !o.born) for (const [k, v] of Object.entries(T.gainMods || {})) mods[k] = (mods[k] || 0) + v;
    return (T.desc || '') + (Object.keys(mods).length ? '\n持有加成：' + C.modText(mods) : '')
      + '\n' + (o && !o.born ? o.age + '岁 · ' + o.source : '先天特质');
  };
  C.inventoryAction = function (S, action) {
    const I = C.ITEMS[action.id]; if (!S.alive || S._event || ['book', 'distorted'].includes(S.job.id) || S.rulesVersion < 3 || !I || !C.hasItem(S, action.id)) return false;
    if (action.type === 'equip') {
      if (!I.slot || S.age < (I.minAge || 0) || S.equipment[I.slot] === action.id) return false;
      S.equipment[I.slot] = action.id; C.log(S, '你装备了' + I.name + '。', 'sys'); return true;
    }
    if (action.type === 'unequip') {
      if (!I.slot || S.equipment[I.slot] !== action.id) return false;
      delete S.equipment[I.slot]; C.log(S, '你收起了' + I.name + '。', 'sys'); return true;
    }
    if (action.type === 'use') {
      if (!I.use || I.useReq && !C.test(S, I.useReq)) return false;
      C.removeItem(S, action.id); C.apply(S, I.use); C.log(S, '你使用了一' + (I.unit || '支') + I.name + '。', 'sys'); return true;
    }
    return false;
  };
  C.initPossessions = function (S) {
    for (const id of S.traits) S.traitOrigins[id] = { age: 0, born: true, source: '先天特质' };
    if (S.traits.includes('家族遗物')) C.gainItem(S, 'heirloom_badge');
    if (S.fam.parents === 'none') C.gainItem(S, 'patched_blanket');
    else if (S.loc === 'nest') C.gainItem(S, 'residence_copy');
    else if (S.loc === 'outskirts') C.gainItem(S, 'camp_compass');
    else if (S.traits.includes('巧手')) C.gainItem(S, 'old_tools');
  };
})();
