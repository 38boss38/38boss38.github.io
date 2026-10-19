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
    '老练': { birth: false, tone: 'good', desc: '从死人堆与委托单里爬出来的老油条，永远给撤退留着三分力气。战斗判定正面率提高3%。', checks: [{ stats: ['skill', 'body'], mods: combat, heads: 0.03 }] },
    '旧伤': { birth: false, tone: 'bad', desc: '没钱彻底清创而落下的陈年暗伤，每逢阴雨天便如碎玻璃刮骨。持有时体魄−5、武艺−2，可通过静养或手术根治。', mods: { body: -5, skill: -2 } },
    '余悸': { birth: false, tone: 'bad', desc: '肉体比脑子更早记住濒死的恐惧，听见铁器落地便本能拔刀。理智−3，战斗判定正面率降低4%，可逐渐克服。', mods: { mind: -3 }, checks: [{ stats: ['skill', 'body'], mods: combat, heads: -0.04 }] },
    '义体排异': { birth: false, tone: 'bad', desc: '金属神经接口与原生血肉日夜撕扯、发烫渗液。持有时体魄−4，义体亲和者免疫此症。', mods: { body: -4 }, ex: ['义体亲和'] },
    '识账': { birth: false, tone: 'good', desc: '落笔前先看清违约罚则与免责小字，绝不替旁人背黑锅。涉及才智的账务、契约与日常事务判定额外获得5点判定属性。', checks: [{ stats: ['wit'], mods: ['backstreet', 'syndicate', 'lifelines', 'progression'], bonus: 5 }] },
    '守诺': { birth: false, tone: 'good', desc: '在尔虞我诈的后巷里，你应下的准话比白纸黑字更管用。人脉+2，人脉判定正面率提高2%。', mods: { social: 2 }, checks: [{ stats: ['social'], heads: 0.02 }] },
    '疑心': { birth: false, tone: 'mixed', desc: '习惯把每个人的笑脸都在心里拆成三层算计，夜里睡觉总得拿椅子顶住门。才智+2、人脉−3，人脉判定正面率降低3%。', mods: { wit: 2, social: -3 }, checks: [{ stats: ['social'], heads: -0.03 }] },
    '长夜听觉': { birth: false, tone: 'good', desc: '能在管道盲音与深宵的风声里辨出常人听不见的暗码。异闻与世界模块的才智、理智判定额外获得5点判定属性。', checks: [{ stats: ['wit', 'mind'], mods: mystery, bonus: 5 }] },
    '精密手感': { birth: false, tone: 'good', desc: '指腹比激光卡尺更懂金属的脾气，盲拆微焊分毫不差。才智、武艺各+2；维修与工坊相关才智判定额外获得5点判定属性。', mods: { wit: 2, skill: 2 }, checks: [{ stats: ['wit'], mods: craft, bonus: 5 }] },
    '赌瘾': { birth: false, tone: 'bad', desc: '耳边总挥之不去J公司轮盘转动的脆响，发薪日不去赌桌押一把就浑身发抖。每年额外流失3000眼，可强制戒断。', tick: (S) => { S.money -= 3000; } },
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
    heirloom_badge: { name: '磨字家徽', kind: 'quest', rarity: 'rare', desc: '缝在旧夹袄内衬里的沉重金属徽章，正面的翼徽字母已被砂纸狠狠磨平，只剩背面几道浅得几乎摸不出的旧刻痕。' },
    patched_blanket: { name: '补过的毯子', kind: 'keepsake', rarity: 'common', slot: 'accessory', mods: { mind: 2 }, desc: '襁褓时裹在你身上的粗纺旧毯。四周打了七八块不同颜色的补丁，针脚或粗或细，显然经了好几双手的缝补。' },
    old_tools: { name: '旧维修工具', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 12, mods: { wit: 2 }, desc: '装在帆布卷袋里的螺丝刀与六角扳手，木柄早已被摩挲得油润发亮，拆装后巷的家电与低阶义体最为趁手。' },
    family_recipe: { name: '家里的汤方', kind: 'keepsake', rarity: 'common', desc: '被猪油与骨汤蒸汽浸得半透明的泛黄纸页，上面记着火候与几味便宜香料的配比，折痕里还残留着灶台边的暖意。' },
    residence_copy: { name: '居住登记副本', kind: 'keepsake', rarity: 'common', desc: '父母费尽心血为你办下的巢内出生登记复写件。纸角盖着防伪钢印，时刻提醒着你曾离高墙内的体面生活有多近。' },
    camp_compass: { name: '旧指南针', kind: 'gear', rarity: 'common', slot: 'accessory', minAge: 10, mods: { wit: 2 }, desc: '从郊区废墟里刨出来的黄铜罗盘，表蒙子裂了一道缝，指针卡死时得拿指节用力敲两下才肯在磁暴里重新转起来。', checks: [{ stats: ['wit'], mods: ['outskirts'], heads: 0.03 }] },
    fixer_license: { name: '收尾人证', kind: 'quest', rarity: 'rare', desc: '하나协会核发的金属磁性执照，内嵌防伪芯片与阶位编码。只要揣着它，你在都市里杀人与赴死就都算合法的买卖。' },
    handmade_knife: { name: '旧人打的刀', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '当年你抬手放过一马的故人亲手在炉前锻打的短刃。刀身没有刻任何工坊的铭文，唯有配重完美贴合你的掌心。' },
    workshop_blade: { name: '工坊制式长刃', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 6 }, desc: '正规持牌工坊出品的量产斩马刀，护手内侧打着清晰的Tres协会审验钢印，重心扎实，劈砍防暴护甲绝不卷刃。' },
    stigma_blade: { name: '烙印工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 8 }, desc: '扣动护手扳机时，整条刀脊便会亮起灼热的赤红烙印。斩铁如泥，只是随刀附带的过热免责条款比说明书还要厚。', checks: [{ stats: ['skill'], mods: combat, heads: 0.02 }] },
    cloud_blade: { name: '云工坊的刀', kind: 'weapon', rarity: 'epic', slot: 'weapon', minAge: 16, mods: { skill: 7 }, desc: '采用特殊轻量化合金锻造的细雪长刀，提在手里轻若无物，挥斩时却能在空气里拉出撕裂耳膜的凄厉啸音。' },
    allas_gloves: { name: '阿拉斯工坊的手套', kind: 'weapon', rarity: 'rare', slot: 'weapon', minAge: 16, mods: { skill: 4, body: 2 }, desc: '指节处嵌有微型冲击桩的重型战术手套，皮革内衬里还留着上一任主人搏命时攥出的深深指印。' },
    borrowed_blade: { name: '备用短刃', kind: 'weapon', rarity: 'common', slot: 'weapon', minAge: 16, mods: { skill: 3 }, desc: '协会器械库里按箱配发的制式防身短刀，谈不上什么名匠手笔，但胜在钢口皮实、拔刀利落。' },
    reinforced_coat: { name: '加固外套', kind: 'gear', rarity: 'rare', slot: 'armor', minAge: 14, mods: { body: 4 }, desc: '看似寻常的深灰长风衣，内衬实则混纺了清道夫甲壳纤维与防刺钢片，足以在暗巷的冷刀子下替你保住心口。' },
    hp_ampule: { name: 'K公司HP安瓿', kind: 'consumable', rarity: 'rare', max: 5, use: { body: 12, mind: 2 }, desc: '盛在铅封玻璃管里的翠绿荧光药液。扎进血管的瞬间便能令断骨重接、血肉疯长——单次消耗一支，恢复体魄12、理智2。' },
    repair_slip: { name: '盖章检修单', kind: 'quest', rarity: 'common', desc: '拍着护手细微裂纹的立可拍照片与工坊红章原件。在认章不认人的柜台前，这张薄纸顶得上好几万眼的返修费。' },
    inherited_pliers: { name: '师傅的旧钳子', kind: 'gear', rarity: 'rare', slot: 'accessory', minAge: 12, mods: { wit: 2, skill: 1 }, desc: '街角修理摊彻底歇业那天，老匠人留给你的平口钢丝钳。钳口的防滑齿已经磨平了一角，握柄上还带着两代人的手汗温度。' },
    workshop_key: { name: '修理摊钥匙', kind: 'quest', rarity: 'rare', desc: '盘下街角老榆木工作台时一并接过来的黄铜小钥匙。锁簧有些老化，插进去得稍微往上抬半寸才能拧开工具匣。' },
    marked_lamp: { name: '刻名台灯', kind: 'keepsake', rarity: 'rare', desc: '你年少学艺时亲手焊好点火簧片的那盏黄铜台灯，底座内侧还留着你用钢针刻下的名字缩写，兜兜转转又回到了你桌上。' },
    shared_textbook: { name: '合抄的教材页', kind: 'quest', rarity: 'rare', desc: '归还借来的旧教材前，你与少年时的同伴趴在煤油灯下一笔一划合抄的精华讲义。纸边挤着两种笔迹的批注。' },
    red_thread_key: { name: '红绳旧钥匙', kind: 'keepsake', rarity: 'common', desc: '系着褪色红棉绳的铁门旧钥匙。即便后来搬离了那栋整层共用一只水龙头的筒子楼，你也一直没舍得把它从钥匙圈上摘下来。' },
    route_map: { name: '手记路线图', kind: 'quest', rarity: 'rare', desc: '用炭笔在牛皮纸上细细标注的跨区货运图，连哪处排污涵洞能绕开检查站、哪班末班车几点熄火都记的一清二楚。' },
    loan_note: { name: '分期借条', kind: 'quest', rarity: 'rare', desc: '把三万眼救命钱拆成零碎期数的手写借据。落款处的签名力透纸背，压着一枚清晰的红印泥指模。' },
    original_tape: { name: '管道原声带', kind: 'quest', rarity: 'rare', desc: '贴着供暖铁管录下的旧式磁带，电流嘶鸣声里夹杂着半串神秘的换防数字与漫长的呼吸空白，从未被后来的录音覆盖。' },
    nameless_photo: { name: '裁去姓名的合照', kind: 'quest', rarity: 'epic', desc: '从旧档案室深处领回的泛黄黑白合照。照片下方的姓名栏被人用刀片齐根裁去，豁口宽度恰好与那枚磨字家徽严丝合缝。' },
    reply_corner: { name: '无字回信的一角', kind: 'keepsake', rarity: 'epic', desc: '寄自一栋早已化作瓦砾的旧楼的信封残角。里面没有半个字，只有半张旧照——画中人的衣领上，赫然别着与你一模一样的家徽。' },
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
