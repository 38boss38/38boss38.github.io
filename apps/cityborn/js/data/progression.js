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
    '老练': { birth: false, tone: 'good', desc: '反复执行委托后学会留力。战斗判定正面率提高3%。', checks: [{ stats: ['skill', 'body'], mods: combat, heads: 0.03 }] },
    '旧伤': { birth: false, tone: 'bad', desc: '没有养好的伤口。持有时体魄−5、武艺−2，可以治疗。', mods: { body: -5, skill: -2 } },
    '余悸': { birth: false, tone: 'bad', desc: '身体比记忆更早想起危险。理智−3，战斗判定正面率降低4%，可以逐渐克服。', mods: { mind: -3 }, checks: [{ stats: ['skill', 'body'], mods: combat, heads: -0.04 }] },
    '义体排异': { birth: false, tone: 'bad', desc: '接口反复发炎。持有时体魄−4，义体亲和者不会获得此特质。', mods: { body: -4 }, ex: ['义体亲和'] },
    '识账': { birth: false, tone: 'good', desc: '总先看费用和责任。涉及才智的账务、合同与日常事务判定额外获得5点判定属性。', checks: [{ stats: ['wit'], mods: ['backstreet', 'syndicate', 'lifelines', 'progression'], bonus: 5 }] },
    '守诺': { birth: false, tone: 'good', desc: '有人记得你把事情办完。人脉+2，人脉判定正面率提高2%。', mods: { social: 2 }, checks: [{ stats: ['social'], heads: 0.02 }] },
    '疑心': { birth: false, tone: 'mixed', desc: '每句话都要再想一遍。才智+2、人脉−3，人脉判定正面率降低3%。', mods: { wit: 2, social: -3 }, checks: [{ stats: ['social'], heads: -0.03 }] },
    '长夜听觉': { birth: false, tone: 'good', desc: '能从杂音里分出线索。异闻中的才智、理智判定额外获得5点判定属性。', checks: [{ stats: ['wit', 'mind'], mods: mystery, bonus: 5 }] },
    '精密手感': { birth: false, tone: 'good', desc: '知道哪颗螺钉不该再拧。才智、武艺各+2；维修相关模块的才智判定额外获得5点判定属性。', mods: { wit: 2, skill: 2 }, checks: [{ stats: ['wit'], mods: craft, bonus: 5 }] },
    '赌瘾': { birth: false, tone: 'bad', desc: '没去赌场的日子，也会花钱买一张下一次的门票。每年额外支出3000眼，可以戒除。', tick: (S) => { S.money -= 3000; } },
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
    heirloom_badge: { name: '磨字家徽', kind: 'quest', rarity: 'rare', desc: '内衬里那枚字母磨平的徽章。背面的几道刻痕很浅，还看不清它们原本是什么。' },
    patched_blanket: { name: '补过的毯子', kind: 'keepsake', rarity: 'common', slot: 'accessory', mods: { mind: 2 }, desc: '被找到时裹着你的毯子。边缘的针脚不是出自同一个人。' },
    old_tools: { name: '旧维修工具', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 12, mods: { wit: 2 }, desc: '握柄磨亮的小工具，大小刚好适合修理日常器物。' },
    family_recipe: { name: '家里的汤方', kind: 'keepsake', rarity: 'common', desc: '纸边都是油点。同一种汤，家里每次都煮得有一点不同。' },
    residence_copy: { name: '居住登记副本', kind: 'keepsake', rarity: 'common', desc: '家人为你保留的出生登记副本。它不是永久有效的工作证明。' },
    camp_compass: { name: '旧指南针', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 10, mods: { wit: 2 }, desc: '指针偶尔卡住，敲一下才肯继续转。用于郊区辨路。', checks: [{ stats: ['wit'], mods: ['outskirts'], heads: 0.03 }] },
    fixer_license: { name: '收尾人证', kind: 'quest', rarity: 'rare', desc: '协会核发的资格证明。执照被吊销时会被收回。', },
    handmade_knife: { name: '旧人打的刀', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '当年放过的人亲手打的刀。刀柄上没有工坊商标。' },
    workshop_blade: { name: '工坊制式长刃', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 6 }, desc: '检修编号刻在护手内侧。出厂编号比装饰更容易辨认。' },
    stigma_blade: { name: '烙印工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 8 }, desc: '出鞘时泛起微光。附带的检修条款写得比使用说明长。', checks: [{ stats: ['skill'], mods: combat, heads: 0.02 }] },
    cloud_blade: { name: '云工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 7 }, desc: '很轻。持刀时仍需记得，这不意味着刀口也轻。' },
    allas_gloves: { name: '阿拉斯工坊的手套', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 4, body: 2 }, desc: '加固的指节沉甸甸的，衬里仍能看见原主试戴留下的褶痕。' },
    borrowed_blade: { name: '备用短刃', kind: 'weapon', rarity: 'common', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '不是什么名贵武器，刃口和握柄都还能用。' },
    reinforced_coat: { name: '加固外套', kind: 'gear', rarity: 'rare', slot: 'armor', minAge: 14, mods: { body: 4 }, desc: '里层缝了耐割材料。只护住覆盖到的地方。' },
    hp_ampule: { name: 'K公司HP安瓿', kind: 'consumable', rarity: 'rare', max: 5, use: { body: 12, mind: 2 }, desc: '一次性治疗用品。使用后消耗一支，恢复体魄12、理智2。' },
    repair_slip: { name: '盖章检修单', kind: 'quest', rarity: 'common', desc: '护手裂纹的照片与编号。多年后仍能拿来核对保修。' },
    inherited_pliers: { name: '师傅的旧钳子', kind: 'gear', rarity: 'rare', slot: 'accessory', minAge: 12, mods: { wit: 2, skill: 1 }, desc: '修理摊关门时带走的那把，钳口已经磨平了一点。' },
    workshop_key: { name: '修理摊钥匙', kind: 'quest', rarity: 'rare', desc: '接手旧工作台后拿到的钥匙。开门时得往上抬一点。' },
    marked_lamp: { name: '刻名台灯', kind: 'keepsake', rarity: 'rare', desc: '你修好过的那盏灯，底座下留着名字。后来被交回你手里。' },
    shared_textbook: { name: '合抄的教材页', kind: 'quest', rarity: 'rare', desc: '交还教材前一起抄下的几页。纸边留着两个人的字，能帮助处理后来的材料。' },
    red_thread_key: { name: '红绳旧钥匙', kind: 'keepsake', rarity: 'common', desc: '共同住处留下的旧钥匙。搬家以后，它仍被系在那根红绳上。' },
    route_map: { name: '手记路线图', kind: 'quest', rarity: 'rare', desc: '记下过车站、费用和回程时刻的图，能用于带人走下一程。' },
    loan_note: { name: '分期借条', kind: 'quest', rarity: 'rare', desc: '三万眼分成很小的数目。对方亲手写下了名字。' },
    original_tape: { name: '管道原声带', kind: 'quest', rarity: 'rare', desc: '杂音、半串数字和听不清的空白。原带没有被猜测覆盖。' },
    nameless_photo: { name: '裁去姓名的合照', kind: 'quest', rarity: 'epic', desc: '从旧楼档案中领回。徽章的宽度正好盖住空白姓名栏。' },
    reply_corner: { name: '无字回信的一角', kind: 'keepsake', rarity: 'epic', desc: '寄自已经拆掉的旧楼。照片上的衣领别着同一枚家徽。' },
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
