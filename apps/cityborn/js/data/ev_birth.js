/* 出生 */
CITY.addEvents('birth', [
  // ---------- 巢 ----------
  { id: 'b_nest_a', birth: true, req: { loc: 'nest', fam: { wealth: [3, 3] } }, w: 10, star: true,
    text: '你出生在{home}顶层恒温公寓的无菌产房里。落地窗外，翼的巨型塔楼把灰白的天空切割成规整的几何块。\n\n护士拧开一支翠绿色的K公司HP安瓿滴在脐带切口上。血珠还没滚落，皮肉就已经愈合得连一丝褶皱都看不见了。' },
  { id: 'b_nest_b', birth: true, req: { loc: 'nest', fam: { wealth: [2, 2], parents: 'both' } }, w: 10, star: true,
    text: '你出生在{home}。父母都是{wing}公司下属企业的合同雇员，为了给你办下那张印着防伪水印的巢内出生许可，他们省吃俭用排了整整七年的队。\n\n把你的名字录入终端那天，父亲盯着绿色的“审核通过”看了很久，才敢伸手抱你。' },
  { id: 'b_nest_c', birth: true, req: { loc: 'nest', fam: { wealth: [2, 3] } }, w: 6, star: true,
    text: '你出生在{home}的附属综合医院。同一天、同一层分娩区，一共生下了十二个婴儿。\n\n护士照着秒表给你们脚腕扣上塑料编码环。你是第07号，啼哭声被隔音玻璃死死关在育婴室里。' },
  { id: 'b_nest_l', birth: true, req: { loc: 'nest', wing: 'L' }, w: 30, star: true,
    text: '你出生在L巢。这里的街道昼夜通明，没有一盏路灯会闪烁——源源不断的脑啡肽正从脑叶公司深不见底的地下抽出，供养着整座都市。\n\n产房窗外飘着宣传飞艇的广播，邻居们都笑着祝贺你们，说生在L巢的孩子一辈子都不用担心停电。',
    eff: { flag: 'lnest' } },

  // ---------- 后巷 ----------
  { id: 'b_bs_poor', birth: true, req: { loc: 'backstreet', fam: { wealth: [0, 0] } }, w: 10, star: true,
    text: '你出生在{home}一间没有窗户的地下隔间里。排气扇早就锈死了，屋里弥漫着铁锈与廉价煤油炉的气味。\n\n接生的是对门缺了两根手指的老太太。她用烧酒洗了洗剪刀，事后只收了你们家半锅滚烫的杂菜汤。' },
  { id: 'b_bs_poor2', birth: true, req: { loc: 'backstreet', fam: { wealth: [0, 0] } }, w: 8, star: true,
    text: '你出生在{home}。母亲生下你的那个凌晨，正好撞上三点十三分的后巷深宵。\n\n铁门外传来令人牙酸的金属刮擦声与某种液体的吸溜声，母亲死死咬着毛巾没敢发出一声喊叫。天亮开门时，门外的石板路被舔舐得干干净净，连一滴血迹都没剩下。' },
  { id: 'b_bs_mid', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 1], parents: 'both' } }, w: 10, star: true,
    text: '你出生在{home}。父母在街角支着一口日夜不熄的骨汤锅卖拉面。\n\n你的第一张摇篮是两个拼起来的“三千味”面粉纸箱，底下垫着旧棉袄，闻起来永远有一股猪骨和焦葱的香气。' },
  { id: 'b_bs_mid2', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 1] } }, w: 8, star: true,
    text: '你出生在{home}的一家地下黑诊所。外间刚抬走一个被砍断胳膊的帮派混混，里间就铺上了干净的塑料布。\n\n满身烟草味的医生收了双倍接生费，理由是“夜里十点以后算急诊加班”。' },
  { id: 'b_bs_mid3', birth: true, req: { loc: 'backstreet', fam: { wealth: [1, 2], parents: ['both', 'father'] } }, w: 6, star: true,
    text: '你出生在{home}。父亲在街尾的铁匠工坊当学徒，指甲缝里常年嵌着洗不掉的黑色机油与铁屑。\n\n第一次抱你之前，他拿粗砂肥皂把双手搓得通红脱皮，还是只敢用垫了干净毛巾的小臂托着你。' },
  { id: 'b_bs_rich', birth: true, req: { loc: 'backstreet', fam: { wealth: [2, 2] } }, w: 10, star: true,
    text: '你出生在{home}。家里在正街上有两间带防盗铁门的铺面，在后巷算得上体面人家。\n\n满月那天，桌上摆着真肉罐头，父亲则在后门毕恭毕敬地给收保护费的帮派头目递上了一只厚信封。' },
  { id: 'b_bs_fixer', birth: true, req: { loc: 'backstreet', fam: { parents: ['both', 'mother', 'father'] } }, w: 4, star: true,
    text: '你出生在{home}。你的家长是一名9阶收尾人，赶回产房时，工坊制式大衣的下摆还在往下滴着别人的血。\n\n那只满是老茧、还缠着止血绷带的手轻轻碰了碰你的脸颊，留下一道淡淡的铁腥味。',
    eff: { flag: 'fixer_parent', skill: 3 } },
  { id: 'b_bs_orphan', birth: true, req: { loc: 'backstreet', fam: { parents: 'none' } }, w: 40, star: true,
    text: '你在{home}垃圾站旁的避风角里被人捡到。\n\n装你的塑料工具箱里塞满了撕碎的旧报纸，胸口别着半张烟盒纸，上面用歪歪扭扭的炭笔写着你的名字。',
    eff: { flag: 'orphan', mind: -3 } },
  { id: 'b_bs_orphan2', birth: true, req: { loc: 'backstreet', fam: { parents: 'none' } }, w: 25, star: true,
    text: '你还没断奶的那年冬天，父母为了赶一趟高价夜班货，没能在凌晨三点十三分前跑回屋里。\n\n街坊们分走了屋里仅剩的锅碗，把你连同一床薄毯塞进了后巷的教会孤儿院。',
    eff: { flag: ['orphan', 'orphanage'] } },

  // ---------- 郊区 ----------
  { id: 'b_out', birth: true, req: { loc: 'outskirts' }, w: 10, star: true,
    text: '你出生在都市高墙之外的郊区。这里没有翼的奇点庇护，没有首脑的禁忌，只有漫天黄沙与叫不出名字的怪物。\n\n你的家人用生锈的集装箱铁皮在废墟底下围出一间矮屋，靠在辐射灰与瓦砾堆里刨食求生。',
    eff: { flag: 'outskirts_born' } },
  { id: 'b_out2', birth: true, req: { loc: 'outskirts' }, w: 6, star: true,
    text: '你出生在郊区一节倾覆的列车残骸里。\n\n母亲后来总念叨，你落地啼哭的那一刻，车窗外铅灰色的地平线上，有什么比山岭还要庞大的黑影正踩着废墟缓缓走过，震得车顶的铁锈簌簌直掉。',
    eff: { flag: 'outskirts_born', dist: 3 } },

  // ---------- 通用兜底 ----------
  { id: 'b_any', birth: true, w: 1, star: true, text: '你出生在{home}。窗外的霓虹灯牌闪了一下，这座吞吐着千万条性命的都市，甚至没有察觉又多了一口呼吸。' },
]);

/* 幼年 0–5 */
CITY.addEvents('infant', [
  { id: 'i_first_word', age: [1, 2], w: 20, text: ['你学会的第一个词是“妈妈”。大人愣了一下，把粗糙的手指放进你手心。', '你学会的第一个词是“饿”。在后巷，会喊饿的孩子才抢得到勺子。', '你学会的第一个词是“别开门”。那是大人们天黑以后挂在嘴边最多的话。', '你学会的第一个词是“眼”——家里每一顿饭、每一颗药，大人数来数去都离不开这个字。'] },
  { id: 'i_walk', age: [1, 2], w: 20, text: '你在凹凸不平的水泥地上学会了走路。第一次迎面摔破膝盖的时候，你咬着嘴唇自己爬了起来，一声没哭。', eff: { body: 1 } },
  { id: 'i_sick', age: [0, 4], w: 8, text: '你毫无征兆地发了一场高烧，浑身滚烫地烧了三天三夜，糊里糊涂间总看见天花板上有无数只眼睛在转。', eff: { body: -4 },
    choices: null },
  { id: 'i_sick_bs', age: [0, 4], req: { loc: 'backstreet', fam: { wealth: [0, 1] } }, w: 8,
    title: '高烧',
    text: '你烧得连哭都哭不出声了。\n\n黑诊所的医生捏开你的眼皮看了看，从铁盒里摸出一支掺了水的次品K公司安瓿——哪怕是稀释货，也抵得上家里整整两个月的伙食费。',
    choices: [
      { t: '（家人）买下安瓿', eff: { money: -6000 }, r: '冰凉的绿液推入血管，不到半个钟头，你滚烫的额头就退了热。\n\n接下来整整两个月，家里的锅里再没飘过半点油星。' },
      { t: '（家人）用冷水毛巾硬熬', res: [
        { w: 6, r: '熬到第四天清晨，你出了一身透汗，居然自己把命捡了回来。', eff: { body: 2 } },
        { w: 3, r: '烧是退了，但肺里落下了病根，一到阴雨天就咳个不停。', eff: { body: -10 } },
        { w: 1, r: '退烧醒来后，你的眼神变了。每当夜深人静，你总能听见墙壁深处有人在用很温柔的声音叫你的名字。', eff: { mind: -5, dist: 6, flag: 'hears_voices' } },
      ] },
    ] },
  { id: 'i_night', age: [2, 5], req: { loc: 'backstreet', fam: { parents: ['both', 'mother'] } }, w: 10, text: '某个深夜，你被窗外密集的金属碰撞声与惨叫吵醒。\n\n母亲一把捂住你的嘴，将你死死按在怀里，连心跳都快得发抖。那是你第一次知道，凌晨三点十三分之后的八十分钟，叫做“后巷深宵”。', eff: { mind: -2, flag: 'knows_night' } },
  { id: 'i_toy', age: [2, 5], req: { loc: 'nest' }, w: 10, text: '家里给你买了一只发条塑料偶。\n\n它是翼下属玩具厂的滞销品，每天早上六点准时咔哒咔哒地转过头，用走音的电子女声对你说：“今天也要做个有价值的市民哦~”' },
  { id: 'i_ramen', age: [3, 5], req: { loc: 'backstreet' }, w: 10, text: '生日那天，大人破例在你的合成面里卧了一颗真正的卤蛋。蛋黄沙软浓郁的香气，成了你童年记忆里最奢侈的亮色。', eff: { mind: 2 } },
  { id: 'i_ampule_scar', age: [3, 5], w: 6, text: '你从锈蚀的铁楼梯上滚了下来，眉骨磕出一道深口子。家里舍不得买再生药，只拿粗线缝了三针，从此你额角多了一条蜈蚣似的浅疤。', eff: { body: -1 } },
  { id: 'i_sibling', age: [2, 5], req: { fam: { parents: ['both'] } }, w: 6, text: '家里添了一个皱巴巴的{sib}。看着大人把原本属于你的半碗糊糊分出去一半，你蹲在床角，还不太明白什么叫“一家人”。', eff: { fn: (S) => { S.fam.sib += 1; S.vars.sib = S.rng.pick(['弟弟', '妹妹']); } } },
  { id: 'i_parent_lost', age: [1, 5], req: { loc: 'backstreet', fam: { parents: ['both'] } }, w: 4, star: true,
    text: '你的父亲在一个雨天出门上工，再也没有回来。没有尸首，没有抚恤，甚至没人知道他死在了哪条巷子里。\n\n母亲贴了三个月的寻人启事，最后默默把饭桌上的第三副碗筷收进了柜底。',
    eff: { fn: (S) => { S.fam.parents = 'mother'; }, mind: -4, flag: 'father_lost' } },
  { id: 'i_orphan_meal', age: [3, 5], req: { flag: 'orphanage' }, w: 12, text: '孤儿院的修女总逼着你们在喝稀麦片粥前闭眼祈祷。你不知道都市的天空上有什么神明在听，只知道谁睁眼偷看，谁碗里的面包就会被收走。' },
  { id: 'i_out_beast', age: [2, 5], req: { loc: 'outskirts' }, w: 14, text: '你在营地的铁丝网外撞见了一头长满人类眼球的瘦高怪兽。那几十只布满血丝的眼睛齐刷刷地盯着你看了很久，最后竟慢吞吞地转身钻进了沙暴里。\n\n找来的大人们瘫在地上，说你把一辈子的运气都用在这五分钟里了。', eff: { dist: 2, mind: 1 } },
  { id: 'i_gift', age: [4, 5], req: { trait: '家族遗物' }, w: 30, text: '你在贴身的夹袄里摸到了家里传下来的那件旧物：一枚沉甸甸、非金非铁的暗哑徽章，背面的翼徽已经被砂纸狠狠磨平了。\n\n衬布里缝着一张发黄的字条：“哪怕饿死，也别拿去当铺。”', eff: { flag: 'heirloom_seen' } },
]);

