(function () {
  Object.assign(window.CITY.ITEMS, {
    field_medkit: { name: '小卷急救绷带', kind: 'consumable', unit: '卷', rarity: 'common', max: 3, desc: '浸过止血药水的粗纱布卷，只够应急处理一次普通外伤。', use: { body: 4 } },
    blood_stick: { name: '血棒', kind: 'consumable', rarity: 'uncommon', max: 3, desc: '凝血压制的干瘪口粮，味如嚼蜡，仅能暂时压下血魔的干渴。', useReq: { flag: 'bloodfiend' }, use: { body: 1, mind: 1 } },
    mended_scabbard: { name: '补过的旧剑鞘', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '鞘口用硬牛皮扩补过半分，拔刀不再卡顿。缝线是同伴当面试过的。', mods: { skill: 2 } },
    work_gloves: { name: '合手的工作手套', kind: 'gear', slot: 'accessory', minAge: 12, rarity: 'common', desc: '没有名贵工坊的徽记，但掌心垫了防滑皮，做细活或握刀都不打滑。', mods: { body: 1, wit: 1 } },
    camp_seeds: { name: '营地试种的种子', kind: 'quest', rarity: 'uncommon', desc: '在郊区耐碱土里试种过的干瘪种子，能否长好全看照料与水土。' },
    patched_case: { name: '修好搭扣的工具箱', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '换上新铜扣的铁皮工具箱，木格按你摸黑拿取的顺手位置隔开。', mods: { wit: 2, body: 1 } },
    route_token: { name: '刻着路口记号的木片', kind: 'keepsake', rarity: 'common', desc: '刻着避风暗号与水源箭头的硬木牌，郊区老向导都认得。' },
    lu_key: { name: '面摊的铜钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '被手汗盘亮的旧铜钥匙，齿口有一处补痕。摊子易主后仍留在你身边。' },
    old_tape: { name: '一小段旧录音', kind: 'keepsake', rarity: 'common', desc: '叫卖声放到一半，录音里的人自己先笑了，后面是大段风声空白。' },
    clinic_key: { name: '后门的手写钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '旧锁片锉成的备用钥匙。魏医生交出它，等于把诊所的后路也交给了你。' },
    jr_cloth: { name: '裹刀的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '被刀鞘磨出毛边的粗麻布。有人用它抱了三年的刀，走时留给了你。' },
    mentor_tool: { name: '他做坏九件之后的那一件', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '边角略硌手的手打工具。送的人说前九件全废了，这是第十件。' },
    carrier_cloth: { name: '缝成围裙的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '肩上垫了十几年重货的老帆布，被裁开缝成了围裙，带子已磨得发毛。' },
    udjat_suit: { name: '高阶工坊防弹西装', kind: 'gear', slot: 'armor', minAge: 18, rarity: 'epic', mods: { body: 8, social: 3 }, desc: '内衬多层高密度奇点防刺织物，表面看不出半点护甲痕迹，挨了一记重劈还能体面地系好扣子。' },
    t_pocket_watch: { name: 'T公司校准怀表', kind: 'gear', slot: 'accessory', minAge: 18, rarity: 'epic', mods: { wit: 5, skill: 3 }, checks: [{ stats: ['skill', 'wit'], heads: 0.04 }], desc: '内部封存着微量标准时间流速的黄铜怀表，在生死一线的交锋中能让你的视野比常人快上半拍。' },
    enkephalin_box: { name: '精炼脑啡肽安神剂', kind: 'consumable', unit: '盒', rarity: 'rare', max: 3, use: { mind: 18, dist: -12 }, desc: '装在墨绿防震管里的镇静制剂，能强行压平脑海深处躁动的杂音，恢复理智18并大幅平息内心杂音。' },
  });
})();
