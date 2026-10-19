(function () {
  Object.assign(window.CITY.ITEMS, {
    field_medkit: { name: '小卷急救绷带', kind: 'consumable', unit: '卷', rarity: 'common', max: 3, desc: '浸过廉价止血药水的粗纱布卷。比不上K公司安瓿的立竿见影，但足够在暗巷里替你按住翻开的皮肉。', use: { body: 4 } },
    blood_stick: { name: '血棒', kind: 'consumable', rarity: 'uncommon', max: 3, desc: '将凝固的血液与防腐剂压成块状的干瘪口粮。味如嚼蜡，却能暂时压下血魔血管深处那股抓心挠肝的干渴。', useReq: { flag: 'bloodfiend' }, use: { body: 1, mind: 1 } },
    mended_scabbard: { name: '补过的旧剑鞘', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '鞘口用硬牛皮与蜡线重新扩补过半分，拔刀出鞘时再也不会卡顿滞涩。每一针都是同伴当着你的面勒紧的。', mods: { skill: 2 } },
    work_gloves: { name: '合手的工作手套', kind: 'gear', slot: 'accessory', minAge: 12, rarity: 'common', desc: '没有任何名贵工坊的烫金徽记，但掌心与虎口垫了厚实的防滑翻毛皮，拧滚烫的阀门或握刀柄都不会打滑。', mods: { body: 1, wit: 1 } },
    camp_seeds: { name: '营地试种的种子', kind: 'quest', rarity: 'uncommon', desc: '从耐碱野草与老作物里筛出来的干瘪种子，带着郊区冻土的土腥气。能不能在下一个春天发芽，全看造化与照料。' },
    patched_case: { name: '修好搭扣的工具箱', kind: 'gear', slot: 'accessory', minAge: 16, rarity: 'uncommon', desc: '换上了新黄铜搭扣的铁皮工具箱。里头的木格按你摸黑拿取的习惯一一隔开，拎在手里连半声零件乱晃的脆响都没有。', mods: { wit: 2, body: 1 } },
    route_token: { name: '刻着路口记号的木片', kind: 'keepsake', rarity: 'common', desc: '用猎刀削平的硬木牌，上面刻着只有郊区老向导才看得懂的避风暗号与水源箭头。' },
    lu_key: { name: '面摊的铜钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '被油烟与手汗盘得金黄温润的旧铜钥匙，齿口有一道焊补过的豁痕。哪怕街角的面摊换了招牌，它依然稳稳躺在你的贴身衣袋里。' },
    old_tape: { name: '一小段旧录音', kind: 'keepsake', rarity: 'common', desc: '录着半截街头叫卖声的旧磁带。喊到一半，录音里的那个人自己先扑哧笑出了声，随后便是长长的、只有风声的空白。' },
    clinic_key: { name: '后门的手写钥匙', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '拿废锁片亲手锉出来的备用钥匙，柄上歪歪扭扭刻着门牌。魏医生把这把钥匙塞进你手心，就等于把黑诊所最后的退路也托付给了你。' },
    jr_cloth: { name: '裹刀的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '浸着刀油与淡淡血腥气的粗麻布，四角已被锋利的刀鞘磨出了毛边。有人用它抱了整整三年的刀，临走时却唯独把它留给了你。' },
    mentor_tool: { name: '他做坏九件之后的那一件', kind: 'keepsake', rarity: 'uncommon', minAge: 16, desc: '倒角略显粗糙的手打钢制工具，握得太紧还是会硌疼掌骨。送你的人说前九件全砸进了废铁桶，唯独这第十件还算拿得出手。' },
    carrier_cloth: { name: '缝成围裙的那块布', kind: 'keepsake', rarity: 'common', minAge: 16, desc: '原本是挑夫在肩膀上垫了十几年重货的老帆布，如今被细心裁开、改成了一条挡油烟的厚围裙，系带处已磨得起了毛球。' },
  });
})();
