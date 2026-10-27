/* 主动行动：玩家在侧栏选择，下一年年初执行。
 * ACTIONS: { 名称, 描述, req 显示条件, ev 触发的事件 id（或函数）, pre 执行前的效果, cd 冷却年数 }
 */
(function () {
  const W = (n) => n * 10000;
  CITY.ACTIONS = {
    license: { name: '考收尾人证', desc: '参加하나协会的资格考试', req: { age: [17, 45], noflag: 'fixer_license', nojob: ['finger', 'kurokumo', 'distorted', 'book', 'heishou'] }, ev: 'fx_license', cd: 1 },
    wingexam: { name: '参加翼的招考', desc: '数千人争一个名额', req: { age: [18, 48], nojob: ['wing', 'retired', 'distorted', 'book', 'finger'], noflag: ['wg_exam_wait', 'wg_offer'] }, ev: 'wg_exam', cd: 3 },
    findjob: { name: '找工作', desc: '换一份糊口的活', req: { age: [16, 64], job: ['none', 'labor', 'shop', 'chef'] }, ev: 'act_findjob', cd: 1 },
    quit: { name: '辞职', desc: '不干了', req: { age: [16, 99], nojob: ['none', 'student', 'retired', 'distorted', 'book', 'finger', 'kurokumo', 'heishou'] }, ev: 'act_quit', cd: 1 },
    gang: { name: '去找帮派入伙', desc: '在后巷，这也是一条路', req: { age: [14, 45], loc: 'backstreet', nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'fixer', 'wing', 'distorted', 'book'], noflag: 'finger_quit' }, pre: { flag: 'want_gang' }, ev: 'y_gang_join', cd: 3 },
    move: { name: '搬去别的区', desc: '换个地方重新开始', req: { age: [16, 90], loc: 'backstreet' }, ev: 'act_move', cd: 2 },
    gonest: { name: '申请搬进巢', desc: '需要一大笔钱和担保', req: { age: [18, 80], loc: 'backstreet', money: [W(300), null] }, ev: 'act_gonest', cd: 3 },
    casino: { name: '去J公司赌场', desc: '也许今晚就是转机', req: { age: [18, 90], money: [W(1), null] }, ev: 'act_casino', cd: 1 },
    pros: { name: '做义体手术', desc: '更强的身体，更少的自己', req: { age: [18, 80], money: [W(30), null] }, ev: 'act_pros', cd: 2 },
    clinic: { name: '去诊所看病', desc: '体魄恢复，钱包变薄', req: { age: [10, 130], st: { body: [null, 55] }, money: [W(2), null] }, ev: 'act_clinic', cd: 1 },
    dojo: { name: '拜师学艺', desc: '花钱请人教你打架', req: { age: [12, 50], money: [W(5), null], nojob: ['distorted', 'book'] }, ev: 'act_dojo', cd: 2 },
    school: { name: '上夜校', desc: '花钱读书', req: { age: [14, 70], money: [W(3), null], nojob: ['distorted', 'book'] }, ev: 'act_school', cd: 2 },
    date: { name: '去认识一个人', desc: '在都市里，孤独是一种奢侈', noHint: 1, req: { age: [18, 60], spouse: false, nojob: ['distorted', 'book'] }, ev: 'act_date', cd: 2 },
    propose: { name: '求婚', desc: '和那个人一起过下去', noHint: 1, req: { age: [18, 70], spouse: false, flag: 'act_dating' }, ev: 'act_propose', cd: 1 },
    child: { name: '要一个孩子', desc: '让另一个人来到都市', noHint: 1, req: { age: [20, 48], spouse: true, nojob: ['distorted', 'book'] }, ev: 'act_child', cd: 3 },
    office: { name: '开一家事务所', desc: '自己当代表', req: { job: 'fixer', rank: [1, 5], noflag: 'office_own', money: [W(100), null] }, ev: 'fx_open_office', cd: 3 },
    retire: { name: '退休', desc: '放下这一切', req: { age: [45, 130], nojob: ['none', 'student', 'retired', 'distorted', 'book', 'finger'] }, ev: 'act_retire', cd: 1 },
    // ---------- 稀有路线的主动入口 ----------
    seekLib: { name: '打听图书馆的邀请函', desc: '据说进去的人能得到想要的书', planReq: { age: [15, 89], wy: [-1, -1], noflag: ['library_invited', 'library_seek'], nojob: ['distorted', 'book'] }, req: { age: [16, 90], wy: [0, 0], noflag: ['library_invited', 'library_seek'], nojob: ['distorted', 'book'] }, pre: { flag: 'library_seek' }, ev: 'act_seeklib', cd: 1 },
    kk: { name: '去黑云会拜门', desc: '需要一手好刀法', req: { age: [16, 45], loc: 'backstreet', st: { skill: [40, null] }, nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'wing', 'distorted', 'book'], noflag: ['kk_member', 'finger_quit'] }, ev: 'sy_kk_gate', cd: 3 },
    blade: { name: '寻找剑契组', desc: '贫穷而骄傲的剑客们', req: { age: [16, 50], loc: 'backstreet', any: [{ flag: 'blade_contact' }, { trait: '剑术天分' }, { st: { skill: [50, null] } }], nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'wing', 'distorted', 'book'], noflag: 'blade_member' }, ev: 'sy_blade_gate', cd: 3 },
    finger: { name: '托人引荐给手指', desc: '一旦进去，就很难出来', req: { age: [18, 50], job: 'syndicate', st: { skill: [40, null] }, noflag: ['finger_member', 'finger_quit'] }, ev: (S) => { const g = ['sy_thumb_gate', 'sy_index_gate', 'sy_middle_gate', 'sy_ring_gate']; return g[Math.floor(S.rng.next() * g.length)]; }, cd: 4 },
    hunt: { name: '主动接高风险委托', desc: '功绩与名声来得更快，也更容易死', req: { job: 'fixer', age: [18, 70] }, ev: 'act_hunt', cd: 2 },
    donate: { name: '捐给孤儿院', desc: '把钱交给需要的人', req: { age: [18, 130], money: [W(50), null] }, ev: 'act_donate', cd: 3 },
  };
  CITY.actionList = (S) => Object.keys(CITY.ACTIONS).filter((k) => {
    const A = CITY.ACTIONS[k];
    if (A.cd && S.last['act_' + k] != null && S.age - S.last['act_' + k] < A.cd) return false;
    return CITY.test(S, S.rulesVersion >= 4 && A.planReq || A.req);
  });

  const newDistrict = (S) => { let d; do { d = S.rng.int(1, 25); } while (d === S.d); S.d = d; S.home = d + '区后巷'; };

  CITY.addEvents('actions', [
    { id: 'act_seeklib', manual: true, title: '雾边的红信封',
      text: '你绕着旧L巢塌陷的封锁线转了三天。白雾从地底深处翻涌上来，把警戒桩腐蚀得斑驳发黑。\n\n暗巷里有人神神叨叨地兜售所谓“图书馆的门路”，也有断了半截胳膊的老收尾人蹲在马路牙子上抽烟，冷笑着劝你别去送死：\n\n“那座怪物建筑不需要你去找。只要你身上有它看得上的筹码——那封烫着金印的红信封，自己会钻进你怀里。”',
      choices: [
        { t: '把真名与战绩挂上各大事务所悬赏栏', eff: { fame: 4, flag: 'library_seek' },
          r: '你在三家情报中介的公开名录上押了真名，注明专接涉关“图书馆”的死单。\n\n不到半个月，酒馆里开始有人对着你的背影指指点点——像在估量一本还没装订成册的书。' },
        { t: '砸三万眼向黑市贩子买“引荐名单”', req: { money: [30000, null] }, res: [
          { w: 1, r: '贩子数完钞票，隔天就卷铺盖人间蒸发了。\n\n你没买到任何邀请函，但“有个疯子花三万眼买死路”的笑话传遍了半条街，反倒让你的名字进了某些人的视野。', eff: { money: -30000, fame: 2, flag: 'library_seek' } },
          { w: 1, r: '那人用极细的钢笔，把你的生平与执念抄在一张带有焦糊味的羊皮纸上。\n\n“等着吧，”他把纸页塞进白雾弥漫的邮筒，“要是司书们觉得你的故事够分量，门就会在你脚底下打开。”', eff: { money: -30000, flag: 'library_seek' } },
        ] },
        { t: '掐灭念头，转身离开白雾边缘', eff: { unflag: 'library_seek' },
          r: '你后退两步，把鞋底沾上的灰白雾水在石阶上蹭干净。\n\n转身走出巷口时，背后那团浓得化不开的雾气里，似乎传来了书页哗啦翻动的轻响。' },
      ] },
    { id: 'act_hunt', manual: true, title: '压箱底的红印死单',
      text: (S) => '你推开事务所联络员递来的常规巡逻表，伸手抽出了公告栏最底层那张边缘发黑的紧急委托。\n\n上面盖着하나协会的鲜红风险章，报酬栏后面跟着一长串令人眼热的零，而“前任执行小队”那一栏已经被黑笔划掉了三个名字。\n\n以你如今 ' + S.job.rank + ' 阶收尾人的斤两，这单生意要么让你一战成名，要么让你变成明早垃圾车里的碎肉。',
      choices: [
        { t: '按上手印，独自接下最凶险的主攻位', check: { s: ['skill', 'body'], dc: 55, mod: (S) => (9 - S.job.rank) * 0.02 },
          ok: { r: '你提着卷刃的武器从死人堆里走了出来，风衣下摆拧得出半碗血水。\n\n交割信物甩上柜台时，整间事务所鸦雀无声。你的评级档案上，重重添上了一笔越阶强攻的战绩。', eff: [(S) => { const p = Math.round(([0, 450, 220, 110, 60, 30, 15, 9, 6, 3.5][S.job.rank] || 3) * 15000); S.money += p; }, { merit: 3, fame: 4, cnt: { req: 2 }, skill: 2 }] },
          no: { r: '委托书上的情报至少瞒报了一个威胁等级。\n\n你在撤退途中被硬生生震碎了护具，攥着半截止血钳爬回后巷诊所，命虽然捡了回来，名声与骨头却一块儿折了。', eff: { body: -15, mind: -5, fame: -2, risk: [0.15, '主动接下了一份没人敢接的委托，没能回来。'] } } },
        { t: '挑一份情报齐全的次高危清剿单', check: { s: ['skill', 'wit'], dc: 40 },
          ok: { r: '你提前两个钟头摸清了排风管道与退路，刀口没多沾一滴废血便割下了目标的信物。\n\n不算惊天动地的壮举，但同行提起你的名字时，都得认一句“手底下干净”。', eff: { merit: 2, fame: 1, cnt: { req: 1 } } },
          no: { r: '撤离时撞上了对方埋在门框里的工坊诡雷。\n\n你拿左肩硬扛了一记弹片才保住任务物品，抚恤金刚好和医药费抵了个精光。', eff: { body: -5, merit: 1 } } },
      ] },
    { id: 'act_findjob', manual: true, title: '电线杆上的招工纸',
      text: S => S.used.act_findjob > 2
        ? '电线杆上的旧招工启事被酸雨泡烂了一层，底下又糊上了新的一层。\n\n在这个连尸体都能按斤回收的后巷，只要你还喘着气、手脚还没被清道夫啃光，就总能找着一口拿命换的馊饭。'
        : S.used.act_findjob > 1
          ? '你又站在了街口的招工栏前。前天招夜班保安的那家铺子已经钉上了白木板，旁边新贴出几张字迹潦草的急聘。'
          : '兜里的眼已经见了底。你踩着污水沟边的烂泥，把整条街电线杆上的招工启事从头摸到尾——没有一份工作问你有什么理想，他们只看你的骨头能熬几个通宵。',
      choices: [
        { t: '去后巷铁匠工坊当学徒', req: { any: [{ trait: '巧手' }, { st: { wit: [40, null] } }] }, eff: { job: { id: 'mech', org: '后巷工坊 学徒', rank: 0 } },
          r: '满脸焊疤的老师傅捏了捏你的指骨，随手把一把沾满机油的扭力扳手丢进你怀里。\n\n“先去把墙角那三箱从死人身上拆下来的二手义肢洗干净，少一颗螺丝拿你手指头抵。”' },
        { t: '去地下黑诊所打下手', req: { st: { wit: [50, null] } }, eff: { job: { id: 'doctor', org: '后巷诊所 助手', rank: 0 } },
          r: '叼着烟头的黑医只问了你一句晕不晕血。\n\n上工头一个钟头，你就抱着一只还在神经抽搐的改装机械臂，替他往切口上狂喷廉价止血胶。' },
        { t: '应聘巢内外包公司的底层文书', req: { st: { wit: [45, null] } }, check: { s: ['wit', 'social'], dc: 52 },
          ok: { r: '你把唯唯诺诺的敬语背得滚瓜烂熟，总算拿下了那张印着“临时通行”的灰色工牌。\n\n从明天起，你每天天不亮就得排两个钟头的安检长队，去替巢里的体面人核对堆积如山的报销单。', eff: { job: { id: 'clerk', org: '巢内外包公司 职员' } } },
          no: { r: '人事主管拿两根手指捻起你的履历，瞥见“后巷”两个字的瞬间就松手任它滑进了碎纸机。\n\n“下一位。”他连眼皮都没抬一下。', eff: { mind: -2 } } },
        { t: '去通宵营业的拉面馆后厨帮工', eff: { job: { id: 'chef', org: '后巷餐馆 帮厨', rank: 0 } },
          r: '后厨的抽油烟机像个垂死的老头一样哮喘。你系上结满猪油硬壳的围裙，在滚烫的骨汤蒸汽里一站就是十四个钟头，下班时连头发丝里都是合成调味粉的味儿。' },
        { t: '去街角二十四小时便利店看夜班', eff: { job: { id: 'shop', org: '便利店 店员' } },
          r: '店长拍了拍收银台底下一根焊着铁钉的实心钢管，又指了指凌晨三点十三分自动落锁的防爆卷帘门：\n\n“抢钱的耗子用钢管招呼；要是听见清道夫的响动，谁敲门也别开。”' },
        { t: '在货场与废墟间卖苦力打零工', eff: { job: { id: 'labor', org: '后巷零工' } },
          r: '抗水泥、掏暗渠、替火并完的帮派洗地砖。哪儿给现钱你就往哪儿钻，肩膀上的血泡磨成厚茧，一天挣来的眼刚够填饱当晚的肚子。' },
      ] },
    { id: 'act_quit', manual: true, title: '把工牌拍回桌上',
      text: (S) => '你在「' + (S.job.org || '这口泥潭') + '」里已经整整熬了 ' + S.job.years + ' 年。\n\n今天清晨推门前，你看着玻璃窗上自己那张麻木发灰的脸，手里的钥匙怎么也插不进锁孔。',
      choices: [
        { t: '摘下工牌，掉头走人', eff: { job: { id: 'none' }, mind: 4 },
          r: '你把磨白了边的工牌往台面上一叩，没听管事在背后骂骂咧咧的扣薪威胁，大步迈出了门槛。\n\n后巷浑浊的冷风灌进肺里，你居然久违地觉得这口气是属于自己的。' },
        { t: '揉揉僵硬的脸，推门打卡', eff: { mind: -1 },
          r: '你想起月底还要交的房租和账单，手指松了又紧，最终还是默默推开门，走回了那个熟悉的位置。' },
      ] },
    { id: 'act_move', manual: true, title: '连夜卷铺盖换区',
      text: S => S.used.act_move > 2
        ? '这已经是第三次把全部家当塞进蛇皮袋了。不用列清单，稍微值点钱的早就换成了路费，剩下的破烂连巷口的耗子都懒得抢。\n\n黑车司机叼着烟敲方向盘，催你赶在深宵前上车。'
        : S.used.act_move > 1
          ? '你又一次拆下了窗框上的防盗铁插销。在这座都市里，没有哪个后巷能让人真正扎下根来。\n\n跨区黑车的起步价还是雷打不动的一万眼。'
          : '楼下的帮派换了旗号，房东带着打手挨家挨户重签涨价租约。你趁着夜色把全部家当捆进三只纸箱，叫来了一辆敢走夜路的跨区敞篷货车。',
      choices: [
        { t: '挑个租金最贱的陌生区落脚', eff: [{ money: -30000, mind: 2 }, newDistrict],
          r: '货车在颠簸的烂路上狂奔了两个钟头，把你卸在了{home}。\n\n新租的半地下室墙壁渗着碱花，但至少今晚敲门催命的人找不到这儿。' },
        { t: '花四万眼向情报贩子买个安稳街区', check: { s: 'social', dc: 45 },
          ok: { r: '贩子指点你搬进了{home}一条受大帮派严令庇护的商业内街。\n\n每个月的卫生费贵了点，但夜里十点以后走在街上，不用再随时把手按在刀柄上了。', eff: [{ money: -40000, mind: 4 }, newDistrict] },
          no: { r: '黑心贩子拿去年还没火并的老黄历糊弄了你。\n\n你刚把箱子搬进{home}的新屋，窗外就炸开了两伙帮派抢地盘的燃烧瓶火光。', eff: [{ money: -40000, mind: -3 }, newDistrict] } },
        { t: '咬牙退掉货车，留在原处硬扛', r: '你赔了司机五百眼空跑费，又把捆死的纸箱一刀刀割开，听着门外走远的皮靴声叹了口气。' },
      ] },
    { id: 'act_gonest', manual: true, title: '通往巢的窄门',
      text: '想从后巷的泥淖里爬进高墙之内的“巢”，明面上要跨过三座大山：两百五十万眼的无犯罪保证金、连续三年的高额纳税记录，以及一位正式巢民的连坐担保。\n\n地下茶室里，戴金丝眼镜的移民中介敲着计算器对你说，只要肯出天价买一张“洗白档案”，前两条都可以替你移花接木。',
      choices: [
        { t: '砸下两百五十万眼，赌这一张通行证', check: { s: ['social', 'wit'], dc: 50 },
          ok: { r: '整整三个月的提心吊胆后，印着翼徽防伪激光的正式居住卡终于落进了你手心。\n\n跨过巢与后巷的武装检疫闸门那天，你回头望了一眼灰暗杂乱的旧街区，呼吸到了第一口带着消毒水味的恒温空气。', eff: { money: -2500000, loc: { loc: 'nest' }, fn: (S) => { S.wing = S.rng.pick(['K', 'R', 'T', 'W', 'U', 'N', 'J']); S.home = S.wing + '巢'; }, flag: 'moved_nest', mind: 3 } },
          no: { r: '约好交接证件的那天，茶室人去楼空，只剩桌上一张盖着假章的废纸。\n\n一百五十万眼定金被洗劫一空，你在检疫站冰冷的铁栅栏外跪了半宿，听见耳边响起嗡嗡的杂音。', eff: { money: -1500000, mind: -8, dist: 3 } } },
        { t: '按住钱袋，不蹚这趟浑水', r: '你盯着中介镜片后闪烁的贪婪目光，冷静地合上皮包起身告辞。\n\n握在自己手里的两百多万眼，足够你在后巷活得像个土皇帝了。' },
      ] },
    { id: 'act_casino', manual: true, title: 'J公司愿力赌场',
      text: S => S.used.act_casino > 1
        ? 'J巢外围的分号赌厅永远亮如白昼。荷官胸口别着装满“愿力贴纸”的翡翠胸针，每一枚筹码落下，都像在抽取桌边赌徒骨髓里的气运。\n\n你捏着钞票走上红毯，眼角余光先扫了一遍后巷当铺的偏门。'
        : 'J公司的赌场里没有挂钟，也没有一扇能看见天色的窗。空气里浮动着催生多巴胺的甜腻熏香，荷官戴着纯白手套，微笑着转动镌刻着奇点符文的轮盘——在这里，连“好运”本身都是可以明码标价典当的商品。',
      choices: [
        { t: '买一万眼散筹试试水', res: [
          { w: 4, r: '象牙滚珠擦着你的号码滑进了隔壁槽。一万眼转瞬化为乌有，推门走出赌厅时，后巷的冷雨正好浇在脸上。', eff: { money: -10000 } },
          { w: 3, r: '赢了两把小的，又在第三把连本带利吐了回去。你及时收手，只折了三千眼茶水钱。', eff: { money: -3000, mind: 1 } },
          { w: 2, r: '滚珠稳稳咬中单数！你揣着翻了三倍的筹码兑出现金，荷官标准的微笑连一毫米都没变过。', eff: { money: 30000, mind: 2 } },
        ] },
        { t: '红着眼押上一半身家，买一张愿力贴纸', res: [
          { w: 5, r: '贴在手背上的廉价愿力符纸咔嚓碎裂。你眼睁睁看着半辈子攒下的血汗钱被长柄木耙拢进庄家槽里，耳膜嗡嗡作响。', eff: { money: '-50%', mind: -6, dist: 3 } },
          { w: 4, r: '金光在轮盘边缘一闪，赔率翻倍！周围输红眼的赌徒纷纷朝你投来贪婪而忌惮的视线。', eff: { money: '50%', mind: 2, fame: 1 } },
          { w: 1, r: '通杀全场的暴击赔率！你用外套兜着沉甸甸的成捆大钞走出柜台时，两个揣着怀刃的影子已经贴上了你的后脚跟。', eff: [{ money: '120%' }, { next: 'act_casino_after' }] },
        ] },
        { t: '签下J公司当铺的活体借据，借钱翻本', req: { money: [null, 50000] }, res: [
          { w: 6, r: '借来的三十万筹码在十分钟内烧成了灰。穿黑西装的催收员笑眯眯地收起按了血手印的契约：“没钱不要紧，您的好运、寿命和内脏，我们分期慢慢取。”', eff: { money: -300000, mind: -5, flag: 'casino_debt' } },
          { w: 1, r: '绝境中的孤注一掷居然押中了豹子！你当场赎回那张要命的活体契约，浑身虚汗地发誓这辈子再也不碰轮盘一下。', eff: { money: 300000 } },
        ] },
      ] },
    { id: 'act_casino_after', manual: true, title: '赌厅外巷的脚步声',
      text: '拐进没有路灯的死水巷时，身后那两双钉铁掌的皮靴突然加快了步点，金属出鞘的轻吟被夜风送进耳廓。',
      choices: [
        { t: '死命抱紧钱袋，钻进地形复杂的排污暗巷', check: { s: 'body', dc: 50 },
          ok: { r: '你一脚踹翻路边的馊水桶绊住追兵，猫腰钻进通宵面馆的后厨烟道，硬是一分钱没丢地甩掉了尾巴。', eff: { body: -1 } },
          no: { r: '你在湿滑的青苔台阶上崴了脚，被两记闷棍砸在后腰上。等你在泥水里咳着血爬起来，怀里的钞票已经被摸走了大半。', eff: { money: '-60%', body: -6 } } },
        { t: '猛然转身，拔出随身兵刃迎头痛击', check: { s: 'skill', dc: 55 },
          ok: { r: '刀光在窄巷里暴起！你一击挑飞领头劫匪的半截耳朵，剩下那人看清你狠辣的路数，拖着同伙狼狈逃窜。', eff: { fame: 1 } },
          no: { r: '对方是老练的帮派刀手。混战中你被铁管砸断了两根手指，只能眼睁睁看着他们拎走你的钱袋扬长而去。', eff: { money: '-70%', body: -8 } } },
        { t: '主动分出一半横财，抛在地上买路', eff: { money: '-50%' },
          r: '你停下脚步，把一半钞票扔在路灯下，缓缓后退五步。\n\n那两人用刀尖拨了拨钱捆，吹了声口哨，没再往死里逼你。在J巢外围，这叫懂规矩的“散财保命钱”。' },
      ] },
    { id: 'act_pros', manual: true, title: '义体改造手术台',
      text: S => S.used.act_pros > 2
        ? '无影灯第三次在你头顶亮起。老技师连麻药风险告知都省了，直接拿记号笔在你仅存的原生皮肉上画切割线：\n\n“再往下改，下雨天你连自己是人是铁都分不清喽。”'
        : S.used.act_pros > 1
          ? '你又闻到了那股烧灼骨髓与润滑油混杂的焦臭味。技师拧亮头顶的放大镜，拿扳手敲了敲你上回改装的金属接口：“旧件磨损得挺快啊，这回想换哪块肉？”'
          : '诊所的天花板上悬着一整排浸泡在防锈液里的机械肢体与复眼镜头。满手油污的外科技师拨弄着骨锯，用看猪肉铺一样的眼神打量你：“血肉之躯一碰就碎。说吧，预算够换哪个档次的铁骨头？”',
      choices: [
        { t: '换装后巷拆车厂拼装的二手义肢（30万眼）', eff: { money: -300000, pros: 1 }, res: [
          { w: 6, r: '骨锯切开神经的剧痛让你差点咬碎槽牙。接上去的二手铁臂力量大增，只是每次握拳都会发出轻微的液压漏气声。', eff: { body: 4, skill: 2, mind: -2 } },
          { w: 3, r: '手术算是成了，但那条不知道从哪个死人身上扒下来的义肢似乎还残留着前主人的神经反射，半夜总在被窝里自己抽搐。', eff: { body: 3, mind: -4, dist: 3 } },
          { w: 1, r: '劣质合金引发了剧烈的神经排异！伤口化脓高烧了整整一个月，拆掉重焊后身体反而比手术前更垮了。', eff: { body: -8, mind: -3 } },
        ] },
        { t: '定制正规工坊出厂的军规级义体（120万眼）', req: { money: [1200000, null] }, eff: { money: -1200000, pros: 1, body: 8, skill: 4, mind: -2 },
          r: '带有Tres协会认证钢印的崭新合金骨骼严丝合缝地嵌入躯干。\n\n你走下手术台，随手一拳便将测试用的水泥桩砸得粉碎——除了皮肤不再有冷暖知觉，这具身体堪称完美。' },
        { t: '摘除原生眼球，植入多光谱战术义眼（50万眼）', req: { money: [500000, null] }, eff: { money: -500000, pros: 1, wit: 4, skill: 2, mind: -2 },
          r: '视神经接通的瞬间，暗巷里的热源、心跳与灰尘轨迹纤毫毕现。\n\n至于那颗被丢进医疗废料桶的原生眼珠，你连看都没再多看一眼。' },
        { t: '按住发凉的胳膊，推门离开手术室', r: '骨锯空转的嗡鸣声让你后背发毛。你从皮革手术椅上翻身下来，技师在身后幽幽地笑了一声：\n\n“别急，在这座城市混，早晚有一天你是被人抬着推进来的。”' },
      ] },
    // 首次看病展开成一次真正的就诊；之后只留一句“又去了一趟”，避免同一段挂号描写反复出现。
    { id: 'act_clinic', manual: true, title: '白大褂与绿药水',
      text: (S) => S.used.act_clinic <= 1
        ? '诊所的走廊像一道冷酷的分水岭：掏得出大钞的人直接进里间打K公司再生针；没钱的穷鬼只能攥着染血的硬纸号牌，在长凳上排队等赤脚大夫拿粗线缝肉。\n\n墙上的灯箱广告昼夜闪烁：“K公司HP安瓿——只要脑袋还在，三秒还你完好如初~”'
        : ['你熟门熟路地撩开染血的塑料门帘，大夫连眼皮都没抬，照着旧刀口又给你敷了一层黑膏药。',
          '候诊长凳上的伤患又换了一茬。大夫翻出你那张磨破边的病历卡，把新添的骨裂和缝针费记在最底下。',
          '你一言不发地把衣袖卷到肩头，熟练地咬住止痛木塞，等着那套已经挨过无数回的清创流程。'],
      eff: (S) => {
        if (S.used.act_clinic <= 1) return;
        S.money -= 20000;
        const g = Math.min(18, 55 - S.st.body);
        S.st.body += Math.max(4, g);
      },
      choices: [
        { t: '排普通号，挨刀清创慢慢缝合', req: { fn: (S) => S.used.act_clinic <= 1 },
          eff: { money: -5000, body: 6, mind: -1 },
          r: '你在浓重的血腥与消毒水味里等了四个钟头，麻药劲儿只够撑半程。\n\n走出诊所时，你的伤口被缝得像条丑陋的蜈蚣，怀里揣着三包苦得发呕的消炎粉。' },
        { t: '砸十二万眼，直接注射正牌K公司HP安瓿', req: { fn: (S) => S.used.act_clinic <= 1, money: [W(12), null] },
          eff: { money: -W(12), body: 18, mind: 1 },
          r: '冰凉的翡翠色药液推入静脉，断裂的骨茬与翻卷的皮肉发出一阵令人牙酸的蠕动声，当着你的面迅速弥合如初。\n\n唯一无法被奇点治愈的，是你瞬间瘪下去一大截的钱包。' },
        { t: '背出上次的伤情与药方，要求只拿内服药', req: { fn: (S) => S.used.act_clinic <= 1 },
          check: { s: 'wit', dc: 40 },
          ok: { r: '你准确报出了止血散与抗生素的配比，省下了黑心大夫巧立名目的检查费。\n\n大夫啧了一声，把药包丢给你，顺手把进货渠道的底价单也塞进了袋底。', eff: { money: -8000, body: 8, wit: 1 } },
          no: { r: '大夫冷笑着说你报的老方子早就停产了，硬给你开了三盒包装花哨的高价合成药剂，结账时差点把你的裤兜掏空。', eff: { money: -26000, body: 3 } } },
      ] },
    // 首次拜师：从三个门路里挑一个；之后只写练了什么，不再重开一遍招徒场景。
    { id: 'act_dojo', manual: true, title: '学一门杀人保命的手艺',
      text: (S) => S.used.act_dojo <= 1
        ? '在都市里，赤手空拳就等于把脖子洗干净递给别人。你四处打听能教真本事的门路：面摊后院住着个退隐的老收尾人，破庙屋檐下坐着个抱刀假寐的流浪剑客，而正街二楼则挂着一家专收有钱学徒的工坊武馆铜牌。'
        : S.st.skill >= 70
          ? ['你又跟着师父苦练了一整年。如今他已不再拆解招式，只拿真刀实枪逼你在方寸之地闪避，教你如何在换命的瞬间比敌人少流一滴血。',
            '这一年的对练安静得出奇。师父让你把最拿手的杀招硬生生砍掉后半截收势：“记住，能一寸刺穿喉咙，就绝不要挥满一尺。”']
          : ['又是一年冬练三九。同一记劈砍重复了上万次，直到虎口老茧裂开又长平，师父才点头说你的刀尖终于不会在出鞘时乱晃了。',
            '这一年你学的全是挨打与滚地。师父拿着包铁木棍把你抽得满地找牙：“先学会怎么在泥水里护住心口，再跟老子谈怎么耍威风！”'],
      eff: (S) => { if (S.used.act_dojo <= 1) return; S.money -= 8000; S.st.skill = Math.min(100, S.st.skill + 3); S.st.body = Math.min(100, S.st.body + 1); },
      choices: [
        { t: '拜面摊后院的独眼老收尾人为师（5万眼）', req: { fn: (S) => S.used.act_dojo <= 1 },
          eff: { money: -50000, skill: 6, body: 2, flag: 'fixer_dream' },
          r: '老家伙收了钱，第一天先教你往裤裆里藏石灰粉，第二天教你分辨哪家工坊的防刺背心腋下有死角。\n\n“收尾人不是骑士，”他一边拿砂纸磨着铁指虎一边骂，“活下来领到尾款的才叫收尾人，死在巷子里的那叫路边垃圾！”' },
        { t: '提着烈酒，去求那位落魄剑客指点一二', req: { fn: (S) => S.used.act_dojo <= 1, any: [{ trait: '剑术天分' }, { flag: 'blade_contact' }, { flag: 'saw_blade' }] },
          check: { s: 'mind', dc: 45 },
          ok: { r: '剑客拔开酒塞灌了一大口，随手折断一根枯枝，在满地落叶间斩出了一道快得让人眼底刺痛的弧线。\n\n你对着那道刀痕苦练了三百个日夜。岁末雪落时，他拍了拍腰间的旧刀鞘：“去跟剑契组那帮疯子打声招呼吧，就说是我教出来的。”', eff: { skill: 10, flag: 'blade_contact', trait: '剑术天分' } },
          no: { r: '那股视死如归的凛冽杀气让你连握木刀的手都在发抖。熬了不到半年，你终究没能迈过那道心坎，灰溜溜地断了念想。', eff: { skill: 3 } } },
        { t: '交十五万眼高昂学费，进正规工坊武馆', req: { fn: (S) => S.used.act_dojo <= 1, money: [150000, null] },
          eff: { money: -150000, skill: 5, body: 4, social: 2 },
          r: '武馆铺着昂贵的减震橡胶垫，陪练全是退役的协会低阶科员。你不仅把基础步伐与格挡锤炼得扎扎实实，还在更衣室里混熟了几个家里有门路的巢内子弟。' },
      ] },
    // 首次上夜校：选一个班；之后只写续课，不再重讲一遍报名处。
    { id: 'act_school', manual: true, title: '废仓库二楼的夜校',
      text: (S) => S.used.act_school <= 1
        ? (S.loc === 'outskirts'
          ? '拾荒营地最深处的破集装箱里，几个曾从都市流亡出来的老学究支起了黑板。教材是从遗迹和垃圾山里刨出来的残缺公文、旧账册与机械图谱。煤油灯的火苗突突跳动，你攒下的钱只够报一门课。'
          : '夜校开在一座废弃纺织厂的二楼，窗户用瓦楞铁皮钉死了一半。落魄的教书先生敲着生锈的铁黑板，上面粉笔写着三门保命手艺：看穿卖身契的公文课、算清高利贷的记账课，以及拆装废铁的工科课。')
        : ['你又交了一期夜校学费。老师把印着油墨味的补充讲义拍在你桌上，催促大家赶在凌晨两点半前抄完笔记——谁也不想在下课路上撞见清道夫。',
          '教室里的灯泡换了一颗瓦数更小的。你翻开去年的旧笔记本，发现那些曾经像天书一样的协会公文条款，如今一眼就能看穿里面的文字陷阱。',
          '这学期的老先生病倒了，替课的是个被翼裁员的前任文书。他讲课从来不按教材，专挑大公司合同里怎么把死人算成“自愿离职”的阴损招数讲。',
          '外头的雨砸得铁皮屋顶砰砰乱响。你借着微弱的灯光演算完最后一页图纸，揉了揉酸涩发胀的眼眶，感觉脑子里多了点谁也抢不走的东西。'],
      eff: (S) => { if (S.used.act_school <= 1) return; S.money -= 30000; S.st.wit = Math.min(100, S.st.wit + 3); S.st.body = Math.max(0, S.st.body - 0.5); },
      choices: [
        { t: '专攻识字、都市律法与合同防坑', req: { fn: (S) => S.used.act_school <= 1 },
          eff: { money: -30000, wit: 8, body: -1, flag: ['literate', 'schooled'] },
          r: '整整一学期，老师都在拿真实的违约死刑案例当教材。\n\n结课那天，你终于学会了在按手印前先拿放大镜找夹缝里的免责小字——这门手艺在都市里抵得上三条命。' },
        { t: '专攻复利核算、帮派流水与做假账', req: { fn: (S) => S.used.act_school <= 1 },
          eff: { money: -30000, wit: 5, body: -1, flag: ['literate', 'schooled', 'numerate'], cnt: { numerate: 1 } },
          r: '算盘珠子拨得噼啪作响。你学会了怎么把高利贷的利滚利拆解到每一个钟头，也看懂了商铺两套账本背后的猫腻。' },
        { t: '研读工坊机械原理与义体电路图', req: { fn: (S) => S.used.act_school <= 1, st: { wit: [40, null] } },
          eff: { money: -30000, wit: 4, skill: 3, flag: ['literate', 'schooled'] },
          r: '你顶着满手电烙铁烫出的水泡，把一台报废的工坊动力核心拆散又重装。\n\n当齿轮重新咬合轰鸣的那一刻，你摸清了钢铁与火药的脾气。' },
      ] },
    { id: 'act_date', manual: true, title: '霓虹灯下的两个影子',
      text: S => S.used.act_date > 2
        ? '你已经习惯了这种带着防备的试探。落座点单时，对方没有先背诵自己的资产与工牌等级，而是看着你袖口磨出的毛边，轻轻问了一句你今天上工累不累。'
        : S.used.act_date > 1
          ? (S.loc === 'nest' ? '介绍人又攒了一场四十分钟的速配茶局。桌对面的巢内职员推了推眼镜，开门见山地问你：万一哪天丢了翼的饭碗，你愿不愿意一起退去后巷苟活。' : '深夜面摊的塑料棚下，那个熟悉的空位又坐上了人。热气腾腾的骨汤端上来时，对方主动把筷子筒往你手边推了推，问你叫什么名字。')
          : (S.loc === 'nest' ? '在巢里，连恋爱都是按适格率匹配的。相亲对象准时在咖啡馆落座，翻开你的信用报告，第一个问题是你每个月还剩多少自由支配的时数，第二个问题是你名下有没有背过担保债。' : '常去的那家深夜小面馆里，总有个人和你踩着同一个钟点进门，点同一碗最便宜的猪骨汤面。今晚店里满座，全屋只剩下你桌子对面那把缺了角的塑料凳。'),
      choices: [
        { t: '放下戒备，主动跟对方聊起这操蛋的日子', check: { s: 'social', dc: 42 },
          ok: { r: '从飞涨的物价聊到各自老板的臭脸，你们不知不觉一直聊到面馆老板开始翻椅子收摊。\n\n站在凌晨微凉的街口告别时，对方笑着报出了自己的真名：{lover}。', eff: [(S) => { S.vars.lover = CITY.randName(S.rng, S.gender === 'm' ? (S.rng.chance(0.85) ? 'f' : 'm') : (S.rng.chance(0.85) ? 'm' : 'f')); }, { flag: 'act_dating', mind: 4 }] },
          no: { r: '你的寒暄在都市人厚重的防备心面前撞了南墙。对方礼貌而疏离地笑了笑，三口两口喝完汤便起身结账，消失在夜色里。', eff: { mind: -2 } } },
        { t: '大方掏出一万眼，加两碟真肉小菜请客', req: { money: [10000, null] }, check: { s: ['social', 'money'], dc: 35 },
          ok: { r: '卤牛肉的香气让紧绷的气氛一下子软了下来。对方有些不好意思地收起零钱包，和你约定了下礼拜换家馆子回请——你记住了{lover}笑起来眼角的弧度。', eff: [(S) => { S.vars.lover = CITY.randName(S.rng, S.gender === 'm' ? (S.rng.chance(0.85) ? 'f' : 'm') : (S.rng.chance(0.85) ? 'm' : 'f')); }, { flag: 'act_dating', money: -10000, mind: 3 }] },
          no: { r: '对方摇了摇头，坚持把属于自己的那份面钱压在碗底：“无功不受禄，咱们还是两清比较好。”', eff: { mind: -2 } } },
        { t: '闷头吃完自己的面，谁也不招惹', r: '在这座朝不保夕的城市里，多一份牵挂就多一处软肋。你抹了抹嘴，竖起衣领独自走回了冷清的住处。' },
      ] },
    { id: 'act_propose', manual: true, title: '两把焊在一起的钥匙',
      text: S => S.used.act_propose > 1
        ? '那枚用工坊废料打磨成的指环还在你贴胸的内袋里，被体温焐得发烫。这一回，你没有在楼道口犹豫徘徊，一口气迈上了台阶。'
        : '你和' + (S.vars.lover || '对方') + '已经在风雨里搭伙走了这么远。口袋里揣着一枚攒了小半年才打出来的素圈戒指，你在那扇亮着暖黄灯光的窗下站了很久，直到凌晨的寒气浸透了鞋底。',
      choices: [
        { t: '敲开房门，把戒指和后半生一起递过去', check: { s: ['social', 'mind'], dc: 40 },
          ok: { r: '{lover}盯着你掌心里那枚不算名贵的指环，眼圈忽然红了，扑哧笑出声来：\n\n“在明天都不知道谁先喂清道夫的地方谈一辈子……行啊，算我陪你疯一回。”', eff: [{ spouse: 'new', flag: 'married', unflag: 'act_dating', mind: 6, ach: 'act_married' }] },
          no: { r: '{lover}盯着戒指看了很久，手指蜷缩了一下，终究还是替你合上了掌心：“对不起，我连自己的命都快护不住了，不敢再拖累你。”\n\n次月月底，那扇窗户再也没有亮起过。', eff: { unflag: 'act_dating', mind: -6 } } },
        { t: '摸了摸干瘪的钱袋，把话咽回肚子里', r: '你想起下个月还没着落的账单，终究没敢把那枚戒指掏出来，只说是顺路送来两盒刚出锅的夜宵。' },
      ] },
    { id: 'act_child', manual: true, req: { spouse: true, nojob: ['distorted', 'book'] }, title: '多添一副小碗筷',
      text: '熄灯之后，你和{spouse}听着窗外远处传来的警笛声，在被窝里小声商量了整整一夜。\n\n在都市里生养一个孩子，意味着要替他攒够二十年的口粮、疫苗、学费与居住税，意味着你们从此有了一块哪怕拿命去填也绝不能退让的软肋。',
      choices: [
        { t: '咬紧牙关，迎接这个新生命来到人间', res: [
          { w: 7, r: '十个月的提心吊胆后，{kid}在啼哭声中平安落地。\n\n抱起那团只有几斤重、温热柔软的小肉团时，你和{spouse}相视一笑，连日熬红的眼底满是劫后余生般的温柔。', eff: { kid: 1, mind: 5, money: -40000, fn: S => CITY.initLoveChild(S) } },
          { w: 2, r: '喝了一整年苦涩的调理药剂，肚子却始终没有动静。诊所大夫叹着气说常年劳损与辐射灰伤了底子，让你们别太强求。', eff: { mind: -2 } },
        ] },
        { t: '握紧彼此的手，决定不让孩子来这世上受苦', eff: { mind: 1 },
          r: '你们默默收起了攒下的育婴钱。在这座连呼吸都要计费的钢铁丛林里，两个人能相依为命地活到白头，就已经是天大的侥幸了。' },
      ] },
    { id: 'act_retire', manual: true, title: '卸下鞍具的日子',
      text: (S) => S.job.years
        ? '你顶着「' + CITY.jobTitle(S) + '」的头衔，在这座吃人不吐骨头的机器里整整运转了 ' + S.job.years + ' 年。\n\n清晨洗脸时，你看着镜子里两鬓斑白、满身暗伤的自己，那张磨得看不清年轻模样的小小工牌正静静躺在洗手台边。'
        : '手头这份卖命的营生，不知不觉已经干到了骨头缝发酸的岁数。\n\n清晨洗脸时，你看着镜子里两鬓斑白的自己，忽然觉得是时候停下来歇一口气了。',
      choices: [
        { t: '交还全套行头，正式退隐养老', eff: { job: { id: 'retired' }, mind: 5 },
          r: '你办完了最后一道交接手续，把陪伴半生的饭碗彻底留在了身后。\n\n走出大门的那一刻，没有鲜花也没有欢送，但头顶难得放晴的天空却让你长长地舒了一口气。' },
        { t: '把护腰勒紧一扣，再替家里多挣一年', r: '你擦干脸上的水珠，重新把工牌挂回胸前。趁着这把老骨头还能动弹，再多攒一点傍身的棺材本吧。' },
      ] },
    { id: 'act_donate', manual: true, title: '后巷深处的教会孤儿院',
      text: S => S.used.act_donate > 2
        ? '老修女听见脚步声就知道是你来了。她没再客套寒暄，只是眼眶微红地拉开抽屉，把每一笔买米、买药、修补漏雨屋顶的流水账摊在你面前。'
        : S.used.act_donate > 1
          ? '你又一次拎着大包小包拐进了那座破败的孤儿院。上次出钱修补过的铁皮屋顶没再漏风，二十几个瘦骨嶙峋的半大孩子正排着队等分热菜汤。'
          : '你穿过污水横流的暗巷，停在一座由旧礼拜堂改建的孤儿院门前。头发花白的老修女正往一锅清得照见人影的麦片粥里掺水，二十多个没爹没娘的孩子眼巴巴地盯着铁勺。',
      choices: [
        { t: '拍下三十万眼，替孩子们买足过冬的粮药', eff: { money: -300000, mind: 5, fame: 2, cnt: { donate: 1 } },
          r: '老修女颤抖着双手画了个十字，给你写下一张字迹工整的收据。\n\n孩子们围上来七嘴八舌地道谢，最小的那个偷偷往你手心里塞了一颗舍不得吃的糖纸球。' },
        { t: '倾囊捐出一半身家，把整座危房翻修加固', eff: { money: '-50%', mind: 8, fame: 5, cnt: { donate: 2 }, ach: 'act_donor' },
          r: '看着支票上那个足以在巢里买套房的数字，老修女捂住嘴久久说不出话来。\n\n入冬前，孤儿院换上了厚实的防爆铁门与暖气管道——哪怕三点十三分的深宵降临，这群孩子也有了一处绝不会塌陷的屋檐。' },
        { t: '隔着铁栅栏看了一会儿，默默离开', r: '你在寒风里站了片刻，摸了摸自己同样不算宽裕的口袋，终究还是轻轻叹了口气，转身没入巷尾。' },
      ] },
  ]);

  CITY.addAch({
    act_married: { name: '在都市里结婚', desc: '主动求婚，并且被答应了。', tier: 'uncommon', group: '羁绊' },
    act_donor: { name: '新屋顶', desc: '把一半身家捐给了孤儿院。', tier: 'rare', group: '人生' },
  });

  // ---------- 路线线索 ----------
  // 把“现在还不能做”的行动写成一句缺什么，让玩家看得见入口，而不是只能猜。
  const asArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const JOB_WORD = { none: '无业', student: '学生', labor: '零工', shop: '店员', chef: '厨师', mech: '工坊技师', doctor: '诊所医生', clerk: '巢内职员', research: '研究员', fixer: '收尾人', wing: '翼的职员', syndicate: '帮派成员', finger: '手指成员', kurokumo: '黑云会', blade: '剑契组', heishou: '黑兽', lccb: 'LCCB', retired: '退休', distorted: '扭曲体', book: '书' };
  const LOC_WORD = { nest: '巢', backstreet: '后巷', outskirts: '郊区' };
  const ERA_WORD = { lob: '脑叶公司时代', fall: '白夜黑昼', lib: '图书馆时期', dist: '扭曲时代' };
  const FLAG_WORD = {
    act_dating: '先认识一个人', fixer_license: '先考到收尾人证', blade_contact: '先与剑契组的人有来往',
    office_own: '先有自己的事务所', library_seek: '先打听过邀请函', library_invited: '先拿到邀请函',
    wg_offer: '先等到翼的录用通知', wg_exam_wait: '先等招考结果', finger_member: '先加入一个手指',
    kk_member: '先加入黑云会', blade_member: '先加入剑契组', fixer_dream: '先在心里种下收尾人的念头',
    want_gang: '先决定去投帮派', saw_blade: '先在夜里见过那个剑客',
  };

  // 返回 null 表示这条要求无从努力（身份已经不符、时代已过），不该当作线索展示。
  function reasonsFor(S, q) {
    if (!q || typeof q === 'function') return null;
    const out = [];
    if (q.age) {
      const a = Array.isArray(q.age) ? q.age : [q.age, null];
      // 还要等六年以上的入口先不提示，免得面板变成一张远期愿望清单。
      if (a[0] != null && S.age < a[0] - 6) return null;
      if (a[0] != null && S.age < a[0]) out.push({ neg: 0, t: '要满 ' + a[0] + ' 岁' });
      if (a[1] != null && S.age > a[1]) out.push({ neg: 1, t: '已经过了年纪' });
    }
    if (q.money != null) { const lo = Array.isArray(q.money) ? q.money[0] : q.money; if (lo != null && S.money < lo) out.push({ neg: 0, t: '需要 ' + CITY.fmtMoney(lo) }); }
    if (q.st) for (const k in q.st) { const lo = Array.isArray(q.st[k]) ? q.st[k][0] : q.st[k]; if (lo != null && (CITY.stat ? CITY.stat(S, k) : S.st[k]) < lo) out.push({ neg: 0, t: '需要' + CITY.STAT_NAMES[k] + ' ' + lo }); }
    if (q.job && !asArr(q.job).includes(S.job.id)) out.push({ neg: 0, t: '需要先成为' + asArr(q.job).map((j) => JOB_WORD[j] || j).join('或') });
    if (q.nojob && asArr(q.nojob).includes(S.job.id)) out.push({ neg: 1, t: '现在的身份做不了' });
    if (q.rank) { const a = Array.isArray(q.rank) ? q.rank : [q.rank, null]; if (a[0] != null && S.job.rank < a[0]) out.push({ neg: 0, t: '需要 ' + a[0] + ' 阶以上' }); if (a[1] != null && S.job.rank > a[1]) out.push({ neg: 0, t: '需要先升到 ' + a[1] + ' 阶以内' }); }
    for (const f of asArr(q.flag)) if (!S.flags[f]) out.push({ neg: 0, t: FLAG_WORD[f] || '还差一个条件' });
    for (const f of asArr(q.noflag)) if (S.flags[f]) out.push({ neg: 1, t: '' });
    for (const f of asArr(q.trait)) if (!S.traits.includes(f)) out.push({ neg: 0, t: '需要特质「' + f + '」' });
    for (const f of asArr(q.notrait)) if (S.traits.includes(f)) out.push({ neg: 1, t: '' });
    if (q.dist != null) { const lo = Array.isArray(q.dist) ? q.dist[0] : q.dist; if (lo != null && S.dist < lo) out.push({ neg: 0, t: '需要内心杂音更深（当前 ' + Math.round(S.dist) + '/' + lo + '）' }); }
    if (q.loc && !asArr(q.loc).includes(S.loc)) out.push({ neg: 1, t: '只能在' + asArr(q.loc).map((x) => LOC_WORD[x] || x).join('或') + '做' });
    if (q.wy) out.push({ neg: 1, t: '' });
    if (q.era && (!S.rulesVersion || S.rulesVersion < 8 || !asArr(q.era).includes(CITY.eraOf(S.wy)))) out.push({ neg: 1, t: '' });
    if (q.spouse === true && !(S.spouse && S.spouse.alive)) out.push({ neg: 0, t: '需要一位伴侣' });
    if (q.spouse === false && S.spouse && S.spouse.alive) out.push({ neg: 1, t: '' });
    if (q.fn && !String(q.fn).includes('rulesVersion')) return null;
    if (q.any) {
      const alts = q.any.map((x) => reasonsFor(S, x)).filter(Boolean);
      if (!alts.length) return null;
      if (alts.some((r) => !r.length)) return []; // 其实已经满足
      const best = alts.slice().sort((a, b) => a.length - b.length)[0];
      out.push(...best);
    }
    return out;
  }
  CITY.actionHints = function (S, limit) {
    if (S.age < 13) return []; // 孩子不需要一张路线清单
    const out = [];
    for (const k of Object.keys(CITY.ACTIONS)) {
      const A = CITY.ACTIONS[k];
      if (A.noHint) continue;
      const q = (S.rulesVersion >= 4 && A.planReq) || A.req;
      if (!q || CITY.test(S, q)) continue;
      const rs = reasonsFor(S, q);
      if (!rs || !rs.length || rs.some((r) => r.neg)) continue;
      if (A.cd && S.last['act_' + k] != null && S.age - S.last['act_' + k] < A.cd) continue; // 冷却中不算线索
      const uniq = [...new Set(rs.map((r) => r.t).filter(Boolean))];
      if (!uniq.length || uniq.length > 2) continue; // 差三样以上的入口还不算“看得见”
      out.push({ k, name: A.name, why: uniq.join('，'), n: uniq.length });
    }
    out.sort((a, b) => a.n - b.n);
    return out.slice(0, limit || 3);
  };
})();
