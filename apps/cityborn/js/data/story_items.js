(function () {
  Object.assign(window.CITY.ITEMS, {
    field_medkit: { name: '小卷急救绷带', kind: 'consumable', unit: '卷', rarity: 'common', max: 3, desc: '只够处理一次普通擦伤。不是HP安瓿，也不能替代复诊。', use: { body: 4 } },
    blood_stick: { name: '血棒', kind: 'consumable', rarity: 'uncommon', max: 3, desc: '供血魔使用的有限替代供给。不能根治对鲜血的渴望，也不能让任何伤势都立刻复原。', useReq: { flag: 'bloodfiend' }, use: { body: 1, mind: 1 } },
    mended_scabbard: { name: '补过的旧剑鞘', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '补口略宽，拔剑时不再刮住。缝线是同伴当面试过的。', mods: { skill: 2 } },
    work_gloves: { name: '合手的工作手套', kind: 'gear', slot: 'accessory', minAge: 12, rarity: 'common', desc: '没有名贵工坊的花纹，掌心磨过，做细活时不容易打滑。', mods: { body: 1, wit: 1 } },
    camp_seeds: { name: '营地试种的种子', kind: 'quest', rarity: 'uncommon', desc: '只在附近土壤里试种过。能否长好，要靠水、照看和下一季的实际结果。' },
    patched_case: { name: '修好搭扣的工具箱', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '里面只有普通工具，空位按自己常用的顺序隔开。不会装进无限的东西。', mods: { wit: 2, body: 1 } },
    route_token: { name: '刻着路口记号的木片', kind: 'keepsake', rarity: 'common', desc: '营地向导认得上面的普通记号。它不是通往所有地方的许可。' },
    lu_key: { name: '面摊的铜钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '钥匙柄被手磨得发亮，齿口有一处补过的痕。摊子换了主人，它还在你身上。' },
    old_tape: { name: '一小段旧录音', kind: 'keepsake', rarity: 'common', desc: '叫卖声放到一半，那个人自己笑了。带子后面是大段空白。' },
    clinic_key: { name: '后门的手写钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '钥匙柄是拆下来的旧锁片，上面的字是自己刻的。魏医生把它交出来，等于把这间诊所的后路也交了出来。' },
    jr_cloth: { name: '裹刀的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '布角被刀鞘磨出了毛边。有人用它抱了三年的刀，走的时候把它留下了。' },
    mentor_tool: { name: '他做坏九件之后的那一件', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '边角没磨平，握久了会硌手。送的人说做坏了九件，这是第十件。' },
    carrier_cloth: { name: '缝成围裙的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '肩上垫了十几年的那块布，被剪开缝成了围裙。带子磨得快断了。' },
  });
})();
