/* 后巷的店与工坊（批次 2）：便利店夜班、工坊磨字两个故事包 + 20 个事件。
 * 写法见 docs/STYLE_REFERENCE.md。跨包咬合：fed_thief / kept_serials 会在后续批次被读取。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  // ============ 故事包 1：便利店夜班（shop） ============
  p({ id: 'shop_counter', pack: 'B2', title: '两点十七分', route: 'shop', person: 'old_shen', theme: '生计', age: [18, 60], sources: ['S01'] }, [
    ['两点十七分',
      '凌晨两点十七分，店里只剩冷柜的嗡嗡声。\n\n一个孩子把罐头塞进外套，塞得很慢，像在等你抬头。\n\n门口的风铃没有响。他进来的时候，风铃就没有响。',
      [
        o('叫住他', '他僵在原地，手还插在外套里。\n\n冷柜的嗡嗡声忽然显得很响。', { seen: 'stop' }, { mind: 1 }),
        o('低头继续理货', '你把手里那排罐头摆正，摆得很久。\n\n脚步声退了出去。风铃还是没有响。', { seen: 'blind' }, { mind: -1 }, { goto: 2 }),
        o('把一袋过期面包推到手边', '你背对着他，把面包放在货架最外沿，然后走到另一排去。\n\n回来时面包不见了，罐头也不见了。', { seen: 'feed' }, { flag: 'fed_thief' }, { goto: 2 }),
      ]],
    ['他说了什么',
      '他没有跑。\n\n把罐头从外套里拿出来，放在柜台上，摆得很正，标签朝着你。\n\n“我妹妹发烧。”他说，“她只喝得下这个。”',
      [
        o('让他拿走，钱我垫', '你从自己口袋里数出钱，扔进收银机。\n\n他抱着罐头退出去，一直退到门口才转身。', { deal: 'pay' }, { money: -1200, flag: 'fed_thief', mind: 2 }, { trust: 1, goto: 3 }),
        o('按规矩，东西留下', '他把罐头推回来，推得很慢。\n\n“行。”\n\n他走出去的时候，肩膀缩着。', { deal: 'rule' }, { mind: -2, flag: 'took_from_child' }, { goto: 2 }),
        c('问他妹妹在哪个楼', 'social', 42,
          o('他报了门牌，报得太快', '那栋楼你送过货。三楼住着一户姓梁的，去年就搬空了。\n\n他还在等你说点什么。', { deal: 'ask', house: true }, { wit: 2, flag: 'knows_child_house' }, { goto: 2 }),
          o('他含糊过去', '他说了个大概的方向，手一直在裤缝上蹭。\n\n你没有再问。他把罐头推回来，走了。', { deal: 'vague' }, { mind: -1 }, { goto: 2 })),
      ]],
    ['少了三罐',
      S => NM(S, 'old_shen') + '把盘点单推给你。\n\n上面少了三罐。\n\n“昨晚只有你一个人。”\n\n她没有说要扣钱，只是把笔放在单子上，笔尖朝着你。',
      [
        o('承认是自己拿了', '她看了你一会儿，把单子叠起来。\n\n“下次说一声。”\n\n扣的钱从她自己的工钱里出，你是后来才知道的。', { blame: 'self' }, { money: -3000, mind: 1 }, { trust: 1 }),
        o('说不知道', '她没再问，把笔收回去。\n\n那三个罐头记在损耗里，损耗记在这一栏，这一栏年底要算。', { blame: 'none' }, { mind: -2 }, { trust: -1 }),
        o('把她不知道的那件事说出来', '她听完，先把单子上的数改了，然后才问那个孩子在哪个门牌。\n\n“三罐。”她说，“记我头上。”', { blame: 'child' }, { money: 0, mind: 2, flag: 'shen_knows_child' }, { req: { anyflag: ['fed_thief', 'knows_child_house'] }, trust: 2 }),
      ]],
    ['风铃第二次没响',
      '第二周，风铃又没响。\n\n那个孩子站在门外，身边跟着一个更小的，抱着他的腿。\n\n两个孩子都没有进来。库房里传来沈姐点货的声音。',
      [
        o('把两个都让进来', '你开了一罐，倒进两只纸杯，让小的那只捧着。\n\n他们在货架最里面蹲着喝完，走的时候把杯子叠好放在了门口。', { second: 'in' }, { money: -900, mind: 3, flag: 'fed_thief' }),
        o('只让小的进来', '小的那只进来，坐在门口的塑料凳上，喝完就睡着了。\n\n大的那只一直站在玻璃外面，看着，没有敲门。', { second: 'half' }, { mind: 1 }),
        o('关掉一半的灯，装作打烊', '你把靠门那排灯关了。\n\n玻璃上就只剩你的影子。他们看了一会儿，走了。', { second: 'out' }, { mind: -2, flag: 'turned_away_child' }),
      ]],
    ['三年后的柜台',
      S => (S.flags.shen_knows_child ? '三年后，' + NM(S, 'old_shen') + '把店转给了你。\n\n她说自己要去照顾姐姐，走之前只交代了一句：损耗那一栏，别写假数。' : '三年后，' + NM(S, 'old_shen') + '把店转给了你。\n\n交接那天下着雨，她把钥匙放在柜台上，看了看收银机，什么也没说。') + '\n\n盘货时，你在柜台缝隙里摸到一张过期面包的标签，日期是那个孩子来的那晚。',
      [
        o('把标签贴在收银机内侧', '以后每年盘货都会看见它。\n\n你没有跟任何人提过这张标签。', null, { mind: 2, flag: 'kept_bread_tag' }, { end: '你接手了那家便利店，收银机内侧贴着一张过期面包的标签。' }),
        o('扔掉，按新价目重排', '你把整排货架重新排过，价目贴得整整齐齐。\n\n夜里风铃响过两次，都是风。', null, { money: 6000, mind: -1 }, { end: '你接手了那家便利店，把旧价目和旧事一起清了出去。' }),
      ]],
  ]);

  // ============ 故事包 2：工坊磨字（mech） ============
  p({ id: 'mech_ground', pack: 'B2', title: '把编号磨掉', route: 'mech', person: 'master_ge', theme: '手艺', age: [18, 65], sources: ['S01'] }, [
    ['磨亮一点',
      '有人送来一把刀，要求磨亮。\n\n“刃口不用动。”他说，“把柄上那串编号磨掉就行。”\n\n刀身的血已经擦过，擦得很干净，连刀镡的缝里都是。',
      [
        o('问编号为什么要磨', '他把刀往台面上推了推，推到一半停住。\n\n“换过我弟弟的手。”\n\n这句话他说得很快，像早就准备好了。', { ask: true }, { wit: 1 }),
        o('直接接活，磨掉', '你没问。机器响起来的时候，他一直站在门口。\n\n磨完他付了钱，多给了一成。', { ask: false, ground: true }, { money: 5000, mind: -2, flag: 'ground_serials' }, { trust: -1, goto: 2 }),
        o('不接这活', '他把刀收回鞘里。\n\n“那我换一家。”\n\n他走的时候没有关门。', { ask: false }, { mind: 1 }, { end: '你拒绝过一把要磨掉编号的刀。' }),
      ]],
    ['谁的字',
      '编号是工坊打的钢印，下面还有一行更小的字，是买家自己刻的。\n\n刻得很浅，只够认出一个姓。\n\n“梁”。',
      [
        o('照他说的磨掉', '钢印下面的那一行先淡下去，然后连钢印也平了。\n\n磨到最后一层，你想起父亲说过，磨掉的字比写上去的留得久。', { ground: true }, { money: 4000, mind: -2, flag: 'ground_serials' }, { goto: 2 }),
        c('先把编号抄下来', 'wit', 40,
          o('抄清楚了，连缺口的位置', '你把纸折成四折，塞进工具箱最底层。\n\n那一串数字短得像一个门牌号。', { copy: true }, { wit: 2, flag: 'copied_serials' }, { goto: 2 }),
          o('抄错了一位', '你照着念了两遍，第二遍就和第一遍不一样。\n\n磨完以后再想核对，已经没有东西可对了。', { copy: false }, { mind: -1, flag: 'copied_serials_wrong' }, { goto: 2 })),
        o('把刀留下，让他改天来取', '他犹豫了一下，说“好”，但第二天又来了两次。\n\n刀一直放在货架最上层，没有动。', { keep: true }, { mind: -1, flag: 'kept_blade' }, { goto: 2 }),
      ]],
    ['收尾人',
      '三天后，一个收尾人进店，把一张照片放在台面上。\n\n照片里是同一把刀，刀柄上的编号拍得很清楚。\n\n“这把刀最后一次被人看见，是在这条巷子。”\n\n里间传来磨东西的声音，一直没有停。',
      [
        o('说没见过', '他把照片收回去，道了谢。\n\n走到门口他停下，回头看了一眼里间。', { say: 'no' }, { mind: -2, flag: 'lied_to_fixer' }, { trust: -1 }),
        o('把抄的编号给他', '他对照了很久，把照片翻过来写了一行字。\n\n“以后有人问起，就说没看见。”\n\n他留下一个号码。', { say: 'serials' }, { money: 6000, fame: 1, flag: ['gave_serials', 'fixer_number'] }, { req: { flag: 'copied_serials' }, trust: 1 }),
        c('问那刀犯了什么事', 'social', 46,
          o('他讲了一半', '“……死的是他弟弟。”\n\n他没有再往下说。里间的磨声停了，过了一会儿又响起来。', { say: 'ask', case: true }, { wit: 2, flag: 'knows_blade_case' }),
          o('他没回答', '“把照片放着就行。”他说完就走了。\n\n照片留在了台面上，正对着里间那扇门。', { say: 'ask' }, { mind: -1 })),
      ]],
    ['里间的磨声',
      S => '收尾人走后，' + NM(S, 'master_ge') + '从里间出来，手上还捏着那块磨石。\n\n“你说了什么？”\n\n他没有提高声音。磨石上的粉末一直在往下掉。',
      [
        o('照实说', '他把磨石放在台面上，坐了一会儿。\n\n“他弟弟欠了人钱。”他说，“欠钱的人不配被记住名字，是这个意思吗。”\n\n他不是在问你。', { replied: 'true' }, { mind: -2, flag: 'ge_told_truth' }, { trust: 1 }),
        o('说没说', '他点点头，回去继续磨东西。\n\n那天下午他把同一块铁磨了三遍，磨到发亮又磨回去。', { replied: 'lie' }, { mind: -1 }, { trust: -1 }),
        o('反问他为什么留着这把刀', '他愣了一下。\n\n“留着好。”他说，“留着就还有一天能问清楚。”', { replied: 'ask' }, { wit: 2, flag: 'ge_kept_blade' }, { trust: 2 }),
      ]],
    ['招牌',
      S => (S.flags.gave_serials ? '半年后，工坊换了块新招牌，旧的那块被拆下来立在墙角。\n\n' + NM(S, 'master_ge') + '说有人来问过那把刀，问得很细，走的时候留下一句“案子结了”。' : '半年后，工坊换了块新招牌，旧的那块被拆下来立在墙角。\n\n' + NM(S, 'master_ge') + '还是每天开炉，只是不再接来路不明的活。') + '\n\n他把招牌翻过来，背面用粉笔写着一行编号，已经擦过很多次，还看得清。',
      [
        o('把那行编号也擦掉', '你擦到一半，他按住你的手。\n\n“留着吧。”\n\n粉笔灰落在他的手背上。', null, { mind: 1, flag: 'ge_erased_serials' }, { end: '你把工坊招牌背面的编号擦掉了，师傅让你停手。' }),
        o('把它抄进自己的本子', '你抄得很仔细，连粉笔断口的斜度都照着画。\n\n师傅看见了，什么也没说。', null, { wit: 2, flag: 'kept_serials' }, { end: '你把工坊招牌背面的那行编号抄进了自己的本子。' }),
      ]],
  ]);

  // ============ 20 个事件 ============
  C.addEvents('wares', [
    // —— 6 个无选项 ——
    { id: 'wr_cold_case', age: [16, 90], w: 11, repeat: true, cd: 12,
      text: '冷柜的玻璃上结了一层白霜。\n\n有人用手指在上面写过字，又擦掉了。\n\n只剩最后一个笔画，冻在那里，谁也认不出是什么字。' },
    { id: 'wr_label_peel', age: [16, 90], req: { loc: 'backstreet' }, w: 10, repeat: true, cd: 12,
      text: '货架上有一罐没贴标签的东西。\n\n老板说那是“样品”，让你别卖。\n\n它在同一个位置放了两年，瓶身一点灰都没有。' },
    { id: 'wr_workshop_light', age: [14, 90], w: 10, repeat: true, cd: 12,
      text: '天快亮的时候，整条巷子只有工坊还亮着。\n\n磨东西的声音一夜没停。\n\n你路过时听出了节奏：两长一短，再停一停。' },
    { id: 'wr_serial_wall', age: [16, 90], w: 9, repeat: true, cd: 14,
      text: '工坊后墙上用粉笔写满了编号，一层压一层。\n\n师傅说这是修过的东西，怕忘。\n\n最下面那一行已经看不清了，只有一道很深的横。' },
    { id: 'wr_door_bell', age: [16, 90], w: 10, repeat: true, cd: 12,
      text: '店门上的风铃断了线，垂在半空。\n\n老板说换一根要花钱，先将就着用。\n\n于是之后的每个人进来，都只有一声很轻的响。' },
    { id: 'wr_mech_burnt', age: [18, 90], w: 9, repeat: true, cd: 13,
      text: '有人拿来一件烧坏的义手，说是“自己烧的”。\n\n关节里的线全熔在一起了，像一小团灰色的树根。\n\n他没说是怎么烧的，你也没问出价钱。' },

    // —— 6 个抉择 ——
    { id: 'wr_refund', age: [16, 85], req: { job: 'shop' }, w: 10, title: '退货',
      text: '一个男人拿回一盒开过的药，说要退。\n\n盒子里少了两支，剩下的摆得很整齐。\n\n“不管用。”他说，“我老婆吃了两天。”',
      choices: [
        { t: '按规矩不退', eff: { mind: -1, money: 0 }, r: '他把盒子收回去，站在门口看了很久的价目表。\n\n走的时候他说了句什么，你没听清。' },
        { t: '自己掏钱退给他', eff: { money: -2600, mind: 2, flag: 'refunded_medicine' }, r: '他数了两遍钱，数完把手在裤子上擦了擦，才伸过来握。\n\n他的手很凉。' },
        { t: '问清楚是什么病', check: { s: 'social', dc: 42 },
          ok: { r: '他说了个病名，你听懂了三分。\n\n你把柜台下面那盒便宜的对症的推给他，没收钱。', eff: { money: -800, mind: 2, social: 1 } },
          no: { r: '他忽然不说了。\n\n“算了。”\n\n他把药盒拿走了，没有再提退货。', eff: { mind: -1 } } },
      ] },
    { id: 'wr_wrong_change', age: [16, 85], req: { job: 'shop' }, w: 10, title: '多找的钱',
      text: '你回到柜台才发现，刚才多找了五千眼。\n\n那人已经出门，走的是往深宵方向去的路。\n\n收银机开着，抽屉里少的那沓纸还在晃。',
      choices: [
        { t: '追出去', check: { s: 'body', dc: 40 },
          ok: { r: '你在巷口追上他。他把钱递回来，笑着说“我还以为你看出来了”。\n\n笑得很自然，你后来一直想那句话。', eff: { money: 5000, wit: 1, flag: 'chased_change' } },
          no: { r: '你追到巷口，人已经没了。\n\n回来时收银机还开着，你又多找了下一个客人两百。', eff: { money: -5200, body: -2 } } },
        { t: '自己补上', eff: { money: -5000, mind: 1 }, r: '你把钱放回去，账对上了。\n\n那五千眼是你三天的工钱。' },
        { t: '等他自己送回来', eff: { mind: -1, flag: 'waited_refund' }, r: '你留了三天。\n\n第四天盘点，那笔钱记在损耗里。' },
      ] },
    { id: 'wr_serial_ask', age: [16, 80], req: { job: 'mech' }, w: 10, title: '磨不磨',
      text: '客人站在你身后看你磨。\n\n“磨得再深一点。”他说，“磨到看不出原来是什么。”\n\n钢印下面还有一层，是你没见过的另一种打法。',
      choices: [
        { t: '照他说的磨穿', eff: { money: 3000, mind: -3, flag: 'ground_deep' }, r: '磨到最后，金属薄了一层，透光。\n\n他拿起来对着灯看了看，很满意。' },
        { t: '停在钢印下面那一层', check: { s: 'skill', dc: 45 },
          ok: { r: '你留下了一道很淡的痕，不仔细看是平的。\n\n他皱了皱眉，收下了。你记住那个位置。', eff: { money: 2500, skill: 2, flag: 'kept_faint_mark' } },
          no: { r: '手一滑，磨穿了一角。\n\n他把刀拿走了，没有付钱，也没有骂你。', eff: { money: -2000, mind: -2 } } },
        { t: '把活推给师傅', eff: { mind: -1, social: 1 }, r: '师傅看了一眼，说“这活我不接”。\n\n客人走后，他把那把刀的照片钉在了后墙上。' },
      ] },
    { id: 'wr_night_customer', age: [18, 85], w: 9, title: '不说话的客人',
      text: '凌晨进来一个人，在货架之间走了三趟。\n\n什么都没拿。\n\n最后他在收银台前放下三枚硬币，说“不用找了”，然后出去了。',
      choices: [
        { t: '收下', eff: { money: 300, mind: -1 }, r: '三枚硬币，面值加起来不够买一瓶水。\n\n你把它们单独放在抽屉的角落。' },
        { t: '追出去还给他', check: { s: 'social', dc: 38 },
          ok: { r: '他在门口站着没走。\n\n“买你今晚别看我的脸。”\n\n你把硬币收回去了。', eff: { mind: 2, flag: 'saw_his_face' } },
          no: { r: '你追到门外，巷子里没有人。\n\n硬币还在手里，凉的。', eff: { mind: -2, dist: 2 } } },
        { t: '把硬币扔进捐款箱', eff: { mind: 1 }, r: '箱子上贴着“互助”两个字，字掉了一半。\n\n硬币落进去，声音很轻。' },
      ] },
    { id: 'wr_tool_theft', age: [16, 70], req: { job: 'mech' }, w: 9, title: '少了一把',
      text: '下午收工，工具少了一把。\n\n那把是师傅的，柄上刻着他的姓。\n\n今天进过工坊的，除了你只有两个人。',
      choices: [
        { t: '去问那两个学徒', check: { s: 'social', dc: 42 },
          ok: { r: '问到第二个时，他从袖子里把刀抽出来，说“借一下”。\n\n柄上的姓被磨掉了一半。', eff: { social: 1, flag: 'found_tool', mind: -1 } },
          no: { r: '两个人都说没看见。\n\n师傅最后没有追究，只是把剩下的工具全锁进了柜子，钥匙自己带着。', eff: { mind: -2 } } },
        { t: '自己赔一把', eff: { money: -4500, mind: 1 }, r: '你买了把新的，柄上没刻字。\n\n师傅收下了，说“用不着”，但一直放在手边。' },
        { t: '告诉师傅', eff: { flag: 'told_master', social: -1 }, r: '他听完只“嗯”了一声。\n\n那两个人第二天就不在工坊了。你没有再问。' },
      ] },
    { id: 'wr_bad_batch', age: [18, 85], req: { job: 'mech' }, w: 9, title: '同一批',
      text: '同一批做出来的零件，有六个装不上。\n\n量具是昨天刚校过的。\n\n订单明天交，返工来不及，交出去也许没人发现。',
      choices: [
        { t: '照交', eff: { money: 8000, mind: -2, flag: 'shipped_bad_batch' }, r: '货装上车的时候，你数了两次箱号。\n\n三周后没有人来找。你开始留意每一封来信。' },
        { t: '说出这件事', check: { s: 'social', dc: 45 },
          ok: { r: '师傅看了那六个零件，把订单往后推了三天。\n\n赔的违约金从他那一份里扣。', eff: { money: -3000, mind: 2 } },
          no: { r: '“你量错了。”他说。\n\n他当着你的面把量具重新校了一遍，校完让你自己再量。', eff: { mind: -2, skill: 1 } } },
        { t: '自己偷偷返工', check: { s: 'skill', dc: 50 },
          ok: { r: '你磨了两夜，把六个全改好了。\n\n交完货睡了一整天，梦里还在量。', eff: { body: -3, skill: 2, flag: 'fixed_batch' } },
          no: { r: '有两个改坏了。\n\n交出去的货里混着它们，你没有再看那批订单的编号。', eff: { body: -3, money: 3000, mind: -2 } } },
      ] },

    // —— 跨批次回响：读老王那条线的结局 ——
    { id: 'wr_lu_ledger', age: [20, 85], req: { anyflag: ['lu_apprentice', 'lu_debt', 'lu_kept_recipe', 'lu_own_recipe'] }, w: 10, title: '赊账册上的名字',
      text: S => '店里的赊账册翻到中间，' + C.contactName(S, 'old_lu') + '的名字出现了四次。\n\n每一行都写着“下月”。\n\n最后一行是空白的，只画了一道横。',
      choices: [
        { t: '替他把这一页结掉', eff: { money: -6000, mind: 2, flag: 'paid_lu_debt' }, r: '你把钱数好放在柜台上，让老板在那一行写“清”。\n\n老板写完，把笔停了一下，又添了两个字：人已不在。' },
        { t: '合上账本，什么也不说', eff: { mind: -1 }, r: '你把账本推回柜台底下，推得很轻。\n\n那天之后，你每次进店都会先看一眼柜台。' },
        { t: '问老板能不能把那一页留着', check: { s: 'social', dc: 40 },
          ok: { r: '老板撕下那一页递给你。\n\n“留着吧。他当年也是这么站着说话的。”', eff: { mind: 2, flag: 'kept_lu_page' } },
          no: { r: '老板摇头，说账不能拆页。\n\n他把账本收进去，锁上了抽屉。', eff: { mind: -1 } } },
      ] },

    // —— 4 组跨年回响（事件 + manual 后续）——
    { id: 'wr_marked_bill', age: [16, 85], w: 9, title: '记号',
      text: '收来的钞票里有一张，边角用铅笔画了一道很小的叉。\n\n你现在才想起来，这是上礼拜你亲手找出去的那张。\n\n它怎么会在这条街的另一头。',
      choices: [
        { t: '留着，下次再花出去', eff: { money: 2000, queue: ['wr_marked_bill_back', 5], flag: 'kept_marked_bill' }, r: '你把它夹在账本最后一页。\n\n之后每一笔过手的钱，你都看一眼边角。' },
        { t: '撕掉', eff: { money: -2000, mind: -1 }, r: '你把它撕成四片，扔进炉子。\n\n纸烧起来的时候，那道铅笔印最后才黑。' },
      ] },
    { id: 'wr_marked_bill_back', manual: true, age: [20, 95], w: 1,
      text: '五年后，你在另一个人的账本里看见那张钞票——同一个位置，同一道叉。\n\n它被夹在账本最后一页，和你的习惯一模一样。',
      eff: { mind: -2, flag: 'bill_came_back' } },

    { id: 'wr_take_name', age: [18, 80], req: { job: 'shop' }, w: 9, title: '赊账本',
      text: '柜台下有本赊账册，最上面几页是很久以前的字。\n\n有一个人名被划掉了三次，又写回来三次。\n\n最新那一行写着“下月还”。',
      choices: [
        { t: '把这个人找出来', eff: { flag: 'sought_debtor', queue: ['wr_debtor_back', 7], mind: -1 }, r: '你按门牌找过去，楼还在，人也还在。\n\n他没让你进门。' },
        { t: '把那一页撕掉', eff: { mind: 1, flag: 'tore_page' }, r: '撕的时候纸很脆。\n\n老板问起，你说潮了。' },
      ] },
    { id: 'wr_debtor_back', manual: true, age: [22, 95], w: 1,
      text: '七年后，一个陌生人进店，问你还在不在。\n\n他掏出一沓钱，旧的，用橡皮筋捆着。\n\n“赊账册上还有我一页。”',
      eff: { money: 9000, mind: 1, flag: 'debtor_paid' } },

    { id: 'wr_apprentice_mark', age: [16, 70], req: { job: 'mech' }, w: 8, title: '刻错的一刀',
      text: '学徒把刻字的位置算错了，一刀下去划在柄的正面。\n\n他站在那里等你骂他。\n\n师傅不在。',
      choices: [
        { t: '教他怎么补', eff: { skill: 1, social: 1, queue: ['wr_mark_back', 6], flag: 'taught_apprentice' }, r: '你们用一根更细的针，把划痕改成了一道槽。\n\n装上去以后，反而好握。' },
        { t: '让他自己想办法', eff: { mind: -1, queue: ['wr_mark_back', 6], flag: 'left_apprentice' }, r: '他第二天拿来一把自己刻坏的木头柄，练了一夜。\n\n那柄留在了工坊角落。' },
      ] },
    { id: 'wr_mark_back', manual: true, age: [20, 90], w: 1,
      text: '六年后，一个年轻技师带着自己的第一件作品来工坊。\n\n他把东西放在台面上，柄的正面有一道很细的槽。\n\n“这个位置，”他说，“当年有人教过。”',
      eff: { mind: 2, social: 1, flag: 'apprentice_returned' } },

    { id: 'wr_roof_sign', age: [16, 85], w: 8, title: '招牌上的字',
      text: '招牌缺了一个字。\n\n补一块新的要三千眼，不补也不会有人把店认错。\n\n下雨的时候，缺字那个位置会漏水，正好滴在门口。',
      choices: [
        { t: '花钱补上', eff: { money: -3000, queue: ['wr_sign_back', 4], flag: 'fixed_sign' }, r: '新字比旧字亮，一看就知道是后补的。\n\n路过的人都说好。' },
        { t: '放个桶接水', eff: { money: -200, mind: -1, queue: ['wr_sign_back', 4], flag: 'bucket_sign' }, r: '桶一直放在门口。\n\n客人进门要先跨过它。' },
      ] },
    { id: 'wr_sign_back', manual: true, age: [20, 90], w: 1,
      text: '四年后，这条街重新编号，招牌上的字全都被要求换掉。\n\n新牌子是统一发的，白底黑字，一样大。\n\n旧招牌被人买走了一块，你只听说买的人拿去当了床板。',
      eff: { mind: -1, flag: 'street_renumbered' } },
  ]);
})();
