/* 世界事件：事件数 70；成就数 18。
 * 连锁线：停电时替邻居存放药品 → 两年后的空药瓶。
 * 连锁线：记录烟霾战争老兵的口述 → 三年后的遗物领取单。
 * 连锁线：脑叶公司求职信 → 两年后的录用或退信 → 白夜黑昼设施逃生 → 装备维护。
 * 连锁线：L巢撤离时带走旧钥匙 → 两年后的原址。
 * 连锁线：图书馆邀请函 → 生还后的纸页声 → 三年后的旧委托。
 * 连锁线：邻居扭曲时保留录音 → 两年后的讨伐名单。
 * 连锁线：接受自身扭曲 → 两年后的旧住址 → 极稀有的人形回归。
 * 连锁线：巴士经过时提供路线 → 两年后的封路通知。
 * 连锁线：金枝线索交易 → 两年后的买家追问。
 * 连锁线：大湖装船 → 两年后遇鲸 → 两年后的岸上结算。
 * 连锁线：清扫封锁中保管门牌 → 三年后的地址核验。
 */
// 扭曲的形态取决于这个人一生里放不下的东西
CITY.distForm = function (S) {
  if (S.vars._df) return S.vars._df;
  const F = [];
  const add = (w, n, t) => F.push({ w, n, t });
  add(3, '末班候车室', '你的身体折成了一间没有出口的候车室，每把椅子上都坐着一个等你答复的轮廓。路过的人只听得见报站声。你还记得自己的住址，却再也穿不过任何一扇普通的门。');
  add(2, '镜中的另一个人', '你的皮肤一片片翻成镜面。每一面镜子里都是你本该成为的样子，它们比你更早学会了微笑。路过的人看见的是他们自己，然后开始尖叫。');
  if (S.flags.debt || (S.c.debtMax || 0) >= 3) add(8, '永不结清的账簿', '你的肋骨一根根展开，变成写满数字的纸页。每一页的最后一行都是负数。你走过的地方，所有人的口袋都会变轻，而你永远算不清那笔账。');
  if (S.job.id === 'chef' || S.flags.cook_skill) add(8, '熬了一夜的汤锅', '你的胸腔变成了一口滚烫的汤锅，咕嘟咕嘟地响。香味飘过三条街，闻到的人都会忍不住走过来，排好队，一个接一个探身进锅里。没有人再直起身来。');
  if (S.flags.knows_night) add(6, '三点十二分的门', '你变成了一扇门，永远停在三点十二分。门后是安全的屋子，门前是后巷深宵。每一个敲门的人都能进来——你只是想让他们进来。');
  if (S.job.id === 'fixer' || S.flags.fixer_license) add(8, '未完成的委托书', '你的身体被无数张委托书层层裹住，每一张都盖着“未完成”的红章。你仍然在执行委托——只是已经分不清，哪一张写的是你自己的名字。');
  if (S.pros >= 2) add(8, '不再需要血肉的人', '义体从接口处开始生长，金属一寸寸吞没了剩下的血肉。最后连心跳都变成了齿轮的声音。你终于不会再疼了。');
  if (S.flags.widowed || S.kids.some((k) => !k.alive)) add(9, '空着的摇篮', '你的手臂伸长、弯曲，交织成一只巨大的摇篮，里面空无一物。你轻轻摇着它，哼着一首谁也听不懂的歌。靠近的人会被放进去。');
  if (S.st.social >= 60) add(5, '人群', '你身上长出了许多张脸，每一张都是你认识的人。它们七嘴八舌地说着话，你终于不再孤单了。');
  if (S.flags.killed) add(6, '一直在擦的刀', '你的手变成了刀，刀上的血怎么也擦不干净。你一遍遍地擦，擦掉了皮肤，擦掉了骨头，最后只剩下那把刀和永不停止的擦拭声。');
  return (S.vars._df = S.rng.wpick(F, (x) => x.w));
};
CITY.addEvents('world', [
  // 脑叶公司时代。
  { id: 'wd_energy', age: [6, 100], req: { era: 'lob' }, w: 12,
    text: '电线杆上贴着L公司的广告：画里每一扇窗户都亮着灯，底下印着“稳定供能”。\n\n你撕下一张折了几折，垫在家里摇晃的桌脚下。桌上的灯泡闪了一下，又亮了。', eff: { wit: 1 } },
  { id: 'wd_salary', age: [16, 70], req: { era: 'lob' }, w: 10, title: '薪水传闻',
    text: '面馆里有人报出脑叶公司员工的月薪，整个柜台都安静了一会儿。\n\n他说有个朋友在那里上班，可问起朋友具体做什么，他答不上来。面汤凉了，他还在一个个数那些零。',
    choices: [
      { t: '付钱买招聘地址', eff: { money: -3000, queue: ['wd_application', 2] }, r: '他把招聘地址写在一张油乎乎的餐巾纸上。你收好纸条，又花了两年才凑齐申请材料。' },
      { t: '留下吃完面', eff: { mind: 1 }, r: '你又要了一点热汤。那个人去了下一桌，重新报了一遍数字。' },
    ] },
  { id: 'wd_application', manual: true, req: { era: 'lob', noflag: 'lcorp_emp' }, title: '迟到的申请',
    text: '餐巾纸上的地址仍然有人收信。你把求职材料塞进信封，封口被手汗浸出一圈灰边。\n\n表格最后一栏要你填一个能长期收到通知的住处。',
    choices: [
      { t: '递交申请', check: { s: ['wit', 'mind'], dc: 52 },
        ok: { r: '你通过了几轮测试，被录用了。薪水每月按时到账；可你写回家的信里，没有一封提到过工作内容。', eff: { job: { id: 'wing', org: '脑叶公司' }, set: { wingJob: '脑叶公司员工' }, flag: ['lcorp_emp', 'wing_emp'], money: 40000 } },
        no: { r: '回信上只印着“不予录用”四个字。你把信封拆开压平，留下没印字的半张当草稿纸。', eff: { mind: -2, wit: 1 } } },
      { t: '撤回材料', eff: { money: -2000, mind: 2 }, r: '你把材料要了回来，已经交出的材料费却退不了。收信的人头也没抬，拆开了下一封申请。' },
    ] },
  { id: 'wd_lnest_lights', age: [8, 100], req: { era: 'lob' }, w: 8,
    text: '运输车司机带来一张L巢的夜景照片：广告牌和玻璃走廊亮成一片，亮得连街角都找不到影子。\n\n他看一次收一次钱，照片边缘已经被摸得发白。', eff: { mind: 1 } },
  { id: 'wd_abno_rumor', age: [12, 100], req: { era: 'lob' }, w: 8, title: '不能转述的故事',
    text: '一位醉客说，L公司的地下关着“异想体”。\n\n你问是什么，他用手比画了一阵，最后只说别相信它们看起来的样子。老板把他的杯子换成了水。',
    choices: [
      { t: '再请他喝一杯', res: [
        { w: 3, r: '他忽然闭了嘴，再也不肯往下说。你只记得他好几次伸手去摸领口，像在找一块工牌，可那里什么也没挂。', eff: { money: -1000, dist: 2 } },
        { w: 2, r: '他讲了一个会唱歌的东西。第二天你记不起曲调，只剩一整夜的头痛。', eff: { money: -1000, mind: -2, wit: 2 } },
      ] },
      { t: '替他叫车', eff: { money: -2000, social: 1 }, r: '司机让他坐在靠窗的一边。车开走时，他还在低头检查自己的手。' },
    ] },
  { id: 'wd_blackout', age: [14, 100], req: { era: 'lob' }, w: 10, title: '临时停电',
    text: '楼里停电，冰柜全停了。\n\n邻居抱着一盒必须冷藏的药来敲门——你家的小蓄电池还能让冷柜再撑几个小时。\n\n他问能不能挤出一点地方。药盒上贴着一个孩子的名字。',
    choices: [
      { t: '腾空冷柜放他的药', eff: { money: -4000, mind: 2, queue: ['wd_medicine', 2] }, r: '你把存粮全搬了出来，它们很快化成一袋温水。药盒挨着电池放好，邻居记下了你的门牌。' },
      { t: '收取保管费', eff: { money: 3000, dist: 2, queue: ['wd_medicine', 2] }, r: '他把钱数了两遍才递过来，手一直在抖。你把药盒塞进冷柜最里面，他在门口站了很久才走。' },
      { t: '关上门', eff: { mind: -1 }, r: '他又去了下一户。你听着敲门声往楼下移，先把自己的冷柜塞满。' },
    ] },
  { id: 'wd_medicine', manual: true,
    text: '两年前那位存药的邻居托人送来一个空药瓶，里面卷着几张钞票。纸条上写着：只凑得出这些。\n\n你把瓶子倒过来，一粒干燥剂落进掌心。', eff: { money: 5000, mind: 1 } },
  { id: 'wd_veteran', age: [12, 100], req: { era: 'lob' }, w: 10, title: '老兵的烟盒',
    text: '修鞋的老人提起烟霾战争。他不讲战术，只讲一双沾上东西后再也刷不干净的靴子。烟盒里没有烟，装着几颗不同型号的纽扣。',
    choices: [
      { t: '记下他的口述', eff: { wit: 2, mind: -2, queue: ['wd_veteran_box', 3] }, r: '他让你删掉几个名字，只留下靴子的尺码。你写完时，他已经靠着鞋架睡着了。' },
      { t: '买下旧靴', eff: { money: -2000, body: 1 }, r: '他给你找了一双没上过战场的。鞋底很厚，缝线有些歪。' },
    ] },
  { id: 'wd_veteran_box', manual: true, title: '领取通知',
    text: '修鞋的老人去世了。\n\n房东按你留下的地址找上门：遗物里有一只写着你名字的鞋盒，想领走，得先替老人补上欠的房租。\n\n盒上的标签把“烟霾战争”写错了一个字。',
    choices: [
      { t: '付钱领走鞋盒', eff: { money: -6000, ach: 'wd_smoke', mind: 1 }, r: '盒里只有那些纽扣，和你三年前记下的口述。你拿笔改好标签上的错字，房东在门口等你把钱数完。' },
      { t: '放弃领取', eff: { mind: -2 }, r: '房东把鞋盒扔上了楼下的垃圾车。车开走时，你听见纽扣在铁皮车厢里滚动的声音。' },
    ] },
  { id: 'wd_share', age: [18, 80], req: { era: 'lob' }, w: 7, title: '能源生意',
    text: '有人兜售L公司能源生意的转包份额。\n\n合同封面印着一盏金色的灯，末页盖的却是一家没听说过的小公司的章。\n\n介绍人说话时，指甲一直压在违约条款上。',
    choices: [
      { t: '投下两万眼', req: { money: [20000, null] }, eff: { money: -20000 }, res: [
        { w: 3, r: '两万眼本金投出后，你收到了第一笔一万两千眼的分成。本金仍压在合同里，信封比合同薄很多。', eff: { money: 12000, flag: 'wd_energy_share' } },
        { w: 2, r: '一周后，那间办公室变成了义体维修铺，你的两万眼也跟着没了。柜台下还垫着印有金色灯的广告。', eff: { mind: -3 } },
      ] },
      { t: '抄下违约条款', eff: { wit: 2, social: -1 }, r: '你把违约条款一字一字抄下来，抄满了半页。介绍人收起合同，再没请你喝过茶。' },
    ] },
  { id: 'wd_facility_letter', age: [18, 100], req: { era: 'lob', job: 'wing', flag: 'lcorp_emp', fn: S => S.vars.wg_route === 'L' }, w: 15,
    text: '你在设施里写了一封报平安的信。写到第二段时，发现能写的只剩伙食和天气。你把天气划掉，这里看不见外面的天。', eff: { money: 15000, mind: -2 } },
  { id: 'wd_supply_news', age: [6, 100], req: { era: 'lob' }, w: 10,
    text: '广播里的主持人念出能源供应增长的数字。楼下的工厂因此加开夜班，工人排队买提神药。\n\n你关窗时，窗框上落着一层细细的金属粉。', eff: { money: 1000, body: -1 } },

  // 白夜黑昼：不设年龄门槛；先记录世界事件，再处理设施与居住地。
  { id: 'wd_fall', force: true, pri: 100, star: true, req: { wy: [-1, -1], noflag: 'wd_fall_seen' },
    text: (S) => (S.age < 6 ? '你还太小，记不清那些日子。长大后，大人们说起它时总会压低声音：' : '') + '那一天，L巢的方向升起了一道光。之后的日子里，白昼与黑夜都变得不对劲——深夜亮得刺眼，正午却暗得要开灯。街上出现了说不出名字的东西，广播里一遍遍地播着“请勿外出”。人们后来把这段日子叫作“白夜黑昼”。等天空恢复原样时，脑叶公司已经倒下，不再是翼了。',
    eff: { flag: 'wd_fall_seen', mind: -4, dist: 5, ach: 'wd_fall' } },
  { id: 'wd_facility_fall', force: true, pri: 90, star: true, req: { wy: [-1, -1], flag: 'lcorp_emp', job: 'wing', fn: S => S.vars.wg_route === 'L', noflag: 'wd_facility_out' }, title: '设施内部',
    text: '警报与照明一起断了。你扶着设施里的墙走，手指划过一道还温热的裂口。\n\n更深处传来不该出现在走廊里的声音。出口在上方，装备存放处在另一头。',
    eff: { flag: 'wd_facility_out' }, choices: [
      { t: '沿应急梯往上爬', check: { s: ['body', 'mind'], dc: 40 },
        ok: { r: '你从一处侧门爬了出去，制服被钢筋撕开。发薪水的地方埋在了地下，再也没有人通知你上班。', eff: { job: { id: 'none' }, unflag: ['lcorp_emp', 'wing_emp'], body: -5, flag: 'wd_lcorp_survivor', ach: 'wd_employee' } },
        no: { r: '应急梯在下一层断了。你抓住的扶手和整面墙一起往下沉。', eff: { death: '没能离开崩溃中的脑叶公司设施。' } } },
      { t: '绕去取E.G.O装备', check: { s: ['skill', 'mind'], dc: 65 },
        ok: { r: '你拖着一件E.G.O装备穿过裂开的门。它的重量一直压在肩上，直到外面的风吹进领口。', eff: { job: { id: 'none' }, unflag: ['lcorp_emp', 'wing_emp'], body: -10, flag: ['wd_lcorp_survivor', 'wd_ego_gear'], ach: ['wd_employee', 'wd_salvage'], queue: ['wd_gear_cost', 2] } },
        no: { r: '你打开柜门时，背后的走廊已不再通向来处。警报短暂地响了一声。', eff: { death: '在寻找装备时被困于脑叶公司设施之中。' } } },
    ] },
  { id: 'wd_lnest_fall', force: true, pri: 80, req: { wy: [-1, -1], loc: 'nest', home: 'L巢', noflag: 'wd_lnest_left' }, title: '失效的住址',
    text: 'L巢的店铺接连钉上了木板。你的居住证还平平整整，柜台后面却已经没人核验。\n\n路口挤满了装着家具的车，有人在给搬家车开价，也有人只盯着车上的人开价。',
    eff: { flag: 'wd_lnest_left', unflag: 'lnest', ach: 'wd_lnest' }, choices: [
      { t: '付钱随车撤离', eff: { money: -20000, loc: { loc: 'backstreet', home: '{d}区后巷' }, queue: ['wd_old_key', 2] }, r: '车把你送进了后巷。你只带出一个箱子，旧家的钥匙还夹在衣袋里；新房东收下钱，没问你从哪里来。' },
      { t: '跟着人流步行', check: { s: 'body', dc: 35 },
        ok: { r: '你绕过两道路障，把最后一件家具换成了水，总算走进后巷。钥匙还在身上，那扇门已经很远了。', eff: { body: -4, money: -3000, loc: { loc: 'backstreet', home: '{d}区后巷' }, queue: ['wd_old_key', 2] } },
        no: { r: '半路上，你的行李被抢光，人也挨了几下。你在后巷一间出租屋里醒来，床边的赤脚医生正等着你醒来付钱。', eff: { body: -10, money: -15000, loc: { loc: 'backstreet', home: '{d}区后巷' }, queue: ['wd_old_key', 2] } } },
    ] },
  { id: 'wd_energy_fall', age: [12, 100], req: { era: 'fall' }, w: 20, title: '停供之后',
    text: '能源停供了。维修铺门口排满等着充电的义体使用者，柜台贴出新价，最底下写着“概不赊账”。\n\n你家那块备用电池已经被人问了三次，一次比一次开价高。',
    choices: [
      { t: '卖掉备用电池', eff: { money: 16000, body: -2 }, r: '买家当场接上线。你摸黑上楼，脚在最后一级台阶上踩空。' },
      { t: '留着过夜', eff: { money: -4000, mind: 2 }, r: '你留下了电池，饭钱却又涨了一截。灯每晚只开一小时，吃完饭就关掉。' },
    ] },
  { id: 'wd_share_fall', force: true, pri: 60, req: { wy: [-1, -1], flag: 'wd_energy_share', noflag: 'wd_share_closed' },
    text: '转包份额的兑付窗口空了。\n\n合同封面上的灯仍然印得很亮，接管债务的人却说，这根本不是L公司的合同。\n\n你排到傍晚，窗口拉下了铁帘，有人用粉笔在帘上写了个“空”字。', eff: { flag: 'wd_share_closed', money: -12000, mind: -3 } },
  { id: 'wd_old_key', manual: true, title: '原址',
    text: '搬离L巢两年后，一个路人给你看了一张旧街的照片。你住过的楼还在，阳台上晾着陌生人的衣服。\n\n衣袋里那把旧钥匙，已经把布磨出了一个小洞。',
    choices: [
      { t: '缝好衣袋留下钥匙', eff: { mind: -1, dist: -3 }, r: '你把钥匙另包了一层布。它不再割破衣料，也没有打开任何一扇门。' },
      { t: '卖给收废金属的人', eff: { money: 300, mind: 1 }, r: '对方连门牌都没问。旧家的重量只有秤上的一小格。' },
    ] },
  { id: 'wd_gear_cost', manual: true, req: { flag: 'wd_ego_gear' }, title: '装备的保养',
    text: '从设施带出来的E.G.O装备开始出现变化。工坊技师看了一眼就推回箱子，不肯按普通武器报价。\n\n你睡觉时把它放在门边，最近总觉得门边太近了。',
    choices: [
      { t: '花钱寻找懂行的人', eff: { money: -30000, skill: 4, mind: -2 }, r: '对方只做了有限的检查，叮嘱你少用。检查完，他洗了很久的手，才肯和你握手道别。' },
      { t: '封箱停止使用', eff: { unflag: 'wd_ego_gear', mind: 3, money: -3000 }, r: '你付钱把箱子寄存进偏僻的库房。管库房的人把它推到最里面一排，和别的货物隔开两个空位。' },
    ] },

  // 图书馆时期。
  { id: 'wd_library_news', force: true, pri: 50, req: { wy: [0, 0], noflag: 'wd_library_news' },
    text: '旧L公司的地址上，一夜之间出现了一座谁也没见过的建筑。人们叫它“图书馆”。\n\n报纸说，收到邀请函的人可以进去寻找自己想要的书——前提是赢下馆里的“接待”。\n\n同一版面上，印着越来越长的失踪者名单。街边卖旧书的人把摊子挪远了两条巷子。', eff: { flag: 'wd_library_news', wit: 1 } },
  { id: 'wd_invitation', age: [16, 100], req: { wy: [0, 0], noflag: ['library_invited', 'by_inv_prep'] }, w: (S) => S.job.id === 'fixer' ? 60 : S.fame >= 30 ? 40 : 6, star: true, title: '邀请函',
    text: '你收到了一封图书馆的邀请函。信上说，馆里有你想要的书，只要在末尾签名赴约。\n\n一个见过同样信封的人往后退了半步：进去的人很多，回来的人很少。',
    eff: { flag: 'library_invited', ach: 'wd_invited' }, choices: [
      { t: '签名赴邀', hint: '没有任何准备就进去', eff: { flag: ['by_inv_prep', 'by_lib_entered'], next: 'by_lib_shelves' }, r: '你签下名字。纸张的气味涌上来，脚下的地板换成了陌生的地面。' },
      { t: '_unused_', req: { fn: () => false }, check: { s: ['skill', 'mind'], dc: 85, max: 0.12 },
        ok: { r: '你赢下了接待，活着回到了街上。司书和书架都留在记忆里；握紧空拳时，你仍能感觉到掌心有另一种重量。', eff: { flag: 'library_returned', skill: 6, mind: -6, title: '归还者', ach: 'wd_returned', queue: ['wd_page_echo', 2] } },
        no: { r: '灯光落在摊开的纸页上。有人拿起书，书脊上出现了你的名字。', eff: { job: { id: 'book' }, flag: 'library_book', ach: 'wd_book', death: '变成了图书馆中的一本书。' } } },
      { t: '把信压在抽屉底', eff: { dist: 3, mind: 1, flag: 'wd_refused_library' }, r: '你没签名。后来每次找东西，都要先把那只抽屉整个拉出来。' },
    ] },
  { id: 'wd_library_rating', req: { wy: [0, 0] }, w: 20,
    text: '图书馆被评为都市恶疾。公告上列出了接取委托的要求，下面很快贴满了事务所的名片。\n\n午后一场雨，几张名片上的电话号码糊成了同一团黑。', eff: { mind: -1, next: 'wd_library_escalation' } },
  { id: 'wd_library_escalation', manual: true, req: { wy: [0, 0], used: 'wd_library_rating' },
    text: '这一年里，图书馆的评级又被提到了都市梦魇，后来连“都市之星”的说法也传开了。\n\n旧公告还没刮干净，新的就盖了上去。接委托的窗口前，少了几张熟面孔。', eff: { dist: 2 } },
  { id: 'wd_library_missing', age: [14, 100], req: { wy: [0, 0] }, w: 15, title: '没有回信',
    text: '附近一家事务所的收尾人全都带着邀请函进了图书馆，只剩一个接线员守着电话。\n\n你之前付给他们一笔定金，托办的事还没人去做，现在也没人能做了。',
    choices: [
      { t: '去讨回定金', check: { s: 'social', dc: 45 },
        ok: { r: '接线员从自己的工资里退了你一部分。她在墙上的名单里划掉你的名字，那张名单已经很长了。', eff: { money: 6000, mind: -1 } },
        no: { r: '门锁换了，里面的电话还在响。你在门口等到隔壁店铺打烊，也没人来开门，来回的车费也白花了。', eff: { money: -2000, dist: 3 } } },
      { t: '把这笔账卖给收债人', eff: { money: 1500, social: -1 }, r: '收债人只肯付零头。他把你的凭证夹进一本厚册子，里面全是同一个月关门的事务所。' },
    ] },
  { id: 'wd_library_color', age: [10, 100], req: { wy: [0, 0] }, w: 10,
    text: '有人在酒馆说，图书馆里出现过殷红迷雾。另一个人说那不可能，第三个人问他们敢不敢亲自去看。\n\n桌边终于安静下来，只听见杯底碰着木头。', eff: { wit: 1, dist: 1 } },
  { id: 'wd_page_echo', manual: true, req: { flag: 'library_returned' }, title: '纸页声',
    text: '离开图书馆两年了，你拔出武器时仍会听见翻书的声音，有时一页，有时很多页。\n\n你在衣袋里放了一张真正的纸，想分清那声音是不是从它那里来的。',
    choices: [
      { t: '记录每一次声音', eff: { wit: 3, mind: -3, queue: ['wd_return_contract', 3] }, r: '记录本很快写满日期。你发现有些声音早于危险，也有些只是窗外的风。' },
      { t: '丢掉记录本', eff: { mind: 3, skill: -1, queue: ['wd_return_contract', 3] }, r: '纸页在垃圾桶里展开。第二天你照常出门，手里只拿着真正需要的东西。' },
    ] },
  { id: 'wd_return_contract', manual: true, req: { flag: 'library_returned' }, title: '五年前的委托',
    text: '一个陌生人拿着一份旧委托来找你，日期是图书馆出现的那一年。\n\n他说当初接单的人进了图书馆，再没回来；他问你还记不记得，馆里那些人最后手里拿着什么。',
    choices: [
      { t: '逐项描述记得的东西', check: { s: 'wit', dc: 55 },
        ok: { r: '他只抄下了一把刀的样子，按约付了钱。你没问他打算去哪儿找。', eff: { money: 18000, mind: -2 } },
        no: { r: '说到刀柄时，你把两个人记混了。对方收起笔，一个字也没再问就走了。', eff: { mind: -4, dist: 4 } } },
      { t: '退回这份委托', eff: { mind: 1, social: -1 }, r: '你说记不清了。他在门外站了一阵，把纸重新折回原来的痕迹。' },
    ] },
  { id: 'wd_library_end', force: true, req: { wy: [1, 1], noflag: 'wd_library_gone' },
    text: '图书馆的消息忽然从公告上消失了。有人说一切结束了，有人说只是被搬到了看不见的地方。\n\n旧址方向的路仍不通，绕路的车费也没有降回来。', eff: { flag: 'wd_library_gone', dist: 2 } },
  { id: 'wd_unsigned_letter', age: [18, 100], req: { wy: [2, null], flag: 'wd_refused_library' }, w: 15, title: '没签名的纸',
    text: '搬家时，你又摸到了那封没签名的邀请函。\n\n帮你抬桌子的人问这是什么，你把抽屉推了回去，听见信纸在里面滑动。\n\n那封信还能不能用，你不想知道。',
    choices: [
      { t: '单独封存邀请函', eff: { money: -1000, mind: -1, dist: -3 }, r: '你买来一只文件盒，把信单独封好。搬运工在盒子上写了个“轻”字，搬的时候却用了两只手。' },
      { t: '连同旧抽屉一起丢掉', eff: { money: -3000, mind: 2 }, r: '你连抽屉带桌子一起扔了，又花钱买了一张新的。新抽屉拉开时很顺，里面什么声音也没有。' },
    ] },

  // 光与扭曲。
  { id: 'wd_distortion_news', age: [4, 130], force: true, pri: 40, star: true, req: { wy: [1, 3], noflag: 'wd_knows_dist' },
    text: '图书馆消失之后，光像雨一样落在了整座都市。\n\n没过多久，你第一次在新闻里听见“扭曲”这个词：一个普通人，在某种强烈的情绪里，变成了怪物。\n\n报道很快转入路段封闭通知。卖报人把那张照片折在里面，怕吓跑只来买天气预报的客人。', eff: { flag: 'wd_knows_dist', dist: 2 } },
  { id: 'wd_light_dream', age: [8, 100], req: { era: 'dist' }, w: 10,
    text: '你梦见光落在很多人的肩上，醒来时掌心还是暖的。隔壁正在为欠款争吵，墙上的裂缝没有合拢。\n\n你坐到闹钟响完，才去拿昨天剩下的饭。', eff: { mind: 1, dist: 2 } },
  { id: 'wd_witness', age: [12, 100], req: { era: 'dist', nojob: 'distorted' }, w: 12, title: '站牌下面',
    text: '站牌下有个人一直在对着空气道歉，领口里却钻出一片片细长的金属。他正在扭曲。\n\n末班车关门开走了，他还保持着鞠躬的姿势，额头已经抵到了自己变形的膝盖。\n\n旁边还站着几个吓呆的乘客。',
    choices: [
      { t: '拖走旁边的乘客', check: { s: 'body', dc: 45 },
        ok: { r: '你把一个吓僵的人拖进店门，玻璃随即从外面裂开。店主在地上加了一道门闩。', eff: { body: -3, social: 2, ach: 'wd_witness' } },
        no: { r: '你的袖子被金属片割开。逃进巷口时，手臂已失去知觉。', eff: { body: -10, mind: -3, ach: 'wd_witness' } } },
      { t: '绕到另一条街', eff: { money: -3000, dist: 4, ach: 'wd_witness' }, r: '你花钱借道一间店的后门。身后传来玻璃碎裂声，店主一边收钱一边插上了门闩。' },
    ] },
  { id: 'wd_hunt', age: [18, 100], req: { era: 'dist', job: 'fixer' }, w: 18, title: '扭曲讨伐',
    text: '协会转来一份扭曲体讨伐委托，附了三张照片。拍的是同一条街，目标在每张里的样子都不一样。\n\n报酬里加了一笔风险补贴，情报栏只写着“原为人类”。',
    choices: [
      { t: '接下讨伐委托', check: { s: ['skill', 'wit'], dc: 62 },
        ok: { r: '你盯着它不断变化的轮廓，一次次调整出手的位置，终于砍倒了它。领报酬时，你的手还在发抖。', eff: { money: 65000, body: -5, dist: 4, cnt: { req: 1 }, ach: 'wd_hunter' } },
        no: { r: '照片里那块空地，已经被它的身体吞了进去。你扔下武器才逃出来。委托失败，新武器的钱得自己掏。', eff: { money: -18000, body: -14, mind: -5 } } },
      { t: '只做外围警戒', res: [
        { w: 4, r: '你拦下三辆货车，守到收尾人撤出。报酬刚好够换掉磨坏的靴底。', eff: { money: 12000, mind: -1 } },
        { w: 1, r: '警戒线也被卷了进去。你从铁丝下面钻过，背上留下一排伤口。', eff: { money: 8000, body: -7 } },
      ] },
    ] },
  { id: 'wd_neighbor', age: [14, 100], req: { era: 'dist', nojob: 'distorted' }, w: 12, title: '隔壁的录音',
    text: '邻居被解雇后，整天反复播放一段主管骂人的录音。\n\n今晚，那声音是从墙里传出来的：他的门向内弯折，门缝里露出一排牙齿。他扭曲了。\n\n走廊上的人让你别再喊他的名字。',
    choices: [
      { t: '带着录音撤离', check: { s: 'wit', dc: 43 },
        ok: { r: '你从门外的旧终端拷出录音备份，跑下楼时把装钱的外套落在了屋里。文件末尾，还有一段他提醒自己买洗衣粉的语音。', eff: { money: -5000, dist: 5, flag: 'wd_neighbor_tape', queue: ['wd_neighbor_list', 2] } },
        no: { r: '终端在你手里裂成两半，尖叫声钻进耳朵。你连鞋都没换就逃下了楼，屋里的东西一件也没带出来。', eff: { body: -6, mind: -4, money: -8000 } } },
      { t: '封住楼梯口报警', eff: { money: -3000, mind: -3, dist: 3 }, r: '你报出地址，接线员让你重复目标特征。楼里的灯一层层熄灭，你没等到问答结束。' },
    ] },
  { id: 'wd_neighbor_list', manual: true, req: { flag: 'wd_neighbor_tape' }, title: '讨伐名单上的住户',
    text: '两年后，你在一份扭曲讨伐名单上认出了旧楼门口的照片。联系人正在收集目标变成怪物之前的资料。\n\n你存下的录音还能播放，背景里录着你上楼时的咳嗽声。',
    choices: [
      { t: '交出录音领取报酬', eff: { money: 18000, mind: -3, ach: 'wd_neighbor' }, r: '联系人只截取主管说话的部分。他说这可能有用，把你的咳嗽声一并删了。' },
      { t: '抹掉自己的声音再交', eff: { money: 5000, wit: 2, ach: 'wd_neighbor' }, r: '剪辑花掉你大半天。联系人按残缺资料付款，没有询问缺失的几秒。' },
    ] },
  { id: 'wd_inner_voice', age: [14, 100], req: { era: 'dist', dist: [28, null], nojob: 'distorted', noflag: ['distorted', 'wd_voice_chosen'] }, w: (S) => 6 + (S.dist - 28) * 1.5, star: true, title: '答复',
    text: '那道声音并不响，却盖过了周围所有动静。它似乎知道你一直不肯说出口的事。\n\n指甲下长出一圈陌生的纹路，镜里的你比你更早露出了笑容。',
    eff: { flag: 'wd_voice_chosen' }, choices: [
      { t: '拒绝那个答案', check: { s: ['mind', 'wit'], dc: 52, mod: (S) => (S.traits.includes('坚韧心志') ? 0.12 : 0) + (S.flags.library_returned ? 0.12 : 0) + (S.spouse && S.spouse.alive ? 0.06 : 0) + (S.kids.some((k) => k.alive) ? 0.06 : 0) },
        ok: { r: '你咬住自己的名字，一遍遍念。纹路退到掌心，又凝成一件只属于你的东西。它很沉，你必须自己握住。', eff: { flag: 'ego', title: '未答应的人', dist: -35, mind: 5, skill: 5, ach: 'wd_ego', queue: ['wd_ego_daily', 2] } },
        no: { r: '你还想再说一个字，喉咙却换了形状。镜子里的东西终于与你同时动了。', eff: { next: 'wd_become_distorted' } } },
      { t: '接受声音的说法', eff: { next: 'wd_become_distorted' }, r: '你松开了紧握的手。那些被压在里面的形状，沿着骨头长了出来。' },
      { t: '用疼痛打断声音', res: [
        { w: 3, r: '血落在地上，声音暂时停了。诊所的人让你先付钱，再说明伤是怎么来的。', eff: { body: -15, money: -20000, dist: -20, mind: -4 } },
        { w: 1, r: '你没能分清哪一部分还属于自己。最后的疼痛比声音短。', eff: { death: '在试图阻止自身扭曲时失血而死。' } },
      ] },
    ] },
  { id: 'wd_become_distorted', manual: true, req: { era: 'dist', nojob: 'distorted' }, star: true,
    text: (S) => CITY.distForm(S).t,
    eff: [(S) => { const f = CITY.distForm(S); S.vars.distName = f.n; S.titles.push(f.n); }, { job: { id: 'distorted' }, flag: 'distorted', dist: 20, ach: 'wd_distorted', queue: ['wd_distorted_home', 2] }] },
  { id: 'wd_distorted_home', manual: true, req: { job: 'distorted' }, title: '旧门口',
    text: '两年后，你又停在记忆中的楼前。楼下换了卖早餐的人，他把摊车推远，留下一只没装完的纸碗。\n\n你身体里还有一小部分，记得从前的门牌。',
    choices: [
      { t: '重复自己的名字', res: [
        { w: 6, r: '那个名字终于只从一张嘴里说出来。你跪在路边，身体重新有了明确的边界。', eff: { job: { id: 'none' }, dist: -65, body: -12, flag: 'wd_human_again', ach: 'wd_human', queue: ['wd_human_papers', 2] } },
        { w: 39, r: '名字从你身上发出来时，已经变成了别的声音。窗户里的人拉上窗帘，你沿着没人的路继续走。', eff: { mind: -3, dist: -3 } },
      ] },
      { t: '离开这条街', eff: { mind: 2, dist: -5 }, r: '你绕开早餐摊。很久以后，你才不再记得那条街。' },
    ] },
  { id: 'wd_human_papers', manual: true, req: { flag: 'wd_human_again', nojob: 'distorted' }, title: '恢复登记',
    text: '柜员让你证明自己是登记里失踪的那个人。旧指纹能对上，失踪期间的去向却没法填。\n\n你看见表格背面印着对扭曲体知情不报的处理条款。',
    choices: [
      { t: '只填写失踪', eff: { money: -12000, mind: -2 }, r: '柜员收取补办费，在空栏盖了待核验。你终于能租一间写自己名字的房。' },
      { t: '放弃旧身份', eff: { money: -25000, social: -4 }, r: '你从别处买来一套材料。新名字念起来很生，租约上却容得下。' },
    ] },
  { id: 'wd_ego_daily', manual: true, req: { flag: 'ego', nojob: 'distorted' }, title: '收起之后',
    text: '那件E.G.O出现两年后，房东仍把你当普通租客催缴水费。你练习着收起它，再拿起杯子。\n\n杯沿很薄，稍一用力就会留下缺口。',
    choices: [
      { t: '付钱租地方练习', eff: { money: -16000, skill: 3, mind: 2 }, r: '你从握紧练到放开。租场的人只关心地板上新增了多少划痕。' },
      { t: '接活补贴家用', check: { s: 'skill', dc: 55 },
        ok: { r: '报酬够你撑过这个月，还买了一套厚壁的杯子。缺口的旧杯被你留在练习的角落。', eff: { money: 24000, dist: 3 } },
        no: { r: '你控制不住收手的时机。报酬被扣作赔偿，杯子仍只能捏着把手用。', eff: { money: -10000, mind: -3 } } },
    ] },
  { id: 'wd_cure_ad', age: [16, 100], req: { era: 'dist', nojob: 'distorted' }, w: 8, title: '保证不扭曲',
    text: '诊所贴出“保证不扭曲”的广告。候诊者被要求先交全款，再在一张很长的知情书上签名。\n\n你翻到最后一页，发现保证的期限只有治疗当天。',
    choices: [
      { t: '付费做一次咨询', res: [
        { w: 3, r: '医生让你说完一件烦心事，没有开药。出门时你轻松了一点，钱包也一样。', eff: { money: -8000, dist: -5 } },
        { w: 2, r: '他按同一张纸念完全部建议。你在门外听见他又从第一条开始念。', eff: { money: -8000, mind: -2 } },
      ] },
      { t: '拿走空白知情书', eff: { wit: 1, mind: 1 }, r: '纸的背面很干净。你用它包了晚饭的馒头，馒头皮上印出了几行“本人自愿”。' },
    ] },
  { id: 'wd_claim', age: [18, 100], req: { era: 'dist' }, w: 9, title: '理赔范围',
    text: '保险业务员问，毁掉你那面墙的是扭曲体还是普通怪物。你拿出照片，他说照片只能证明墙没了。\n\n两类事故的赔付金额差了整整一位数。',
    choices: [
      { t: '花钱找现场证人', check: { s: 'social', dc: 48 },
        ok: { r: '证人记得墙里伸出过一只手。业务员这才按扭曲事故赔付，数钱时眉头一直没松开。', eff: { money: 18000, mind: -1 } },
        no: { r: '证人不肯落笔。你付了跑腿费，照片又被退回同一个透明袋里。', eff: { money: -5000, mind: -2 } } },
      { t: '接受最低赔付', eff: { money: 5000, dist: 2 }, r: '你领了钱。新砌的墙薄了一层，隔壁烧开水的声音听得清清楚楚。' },
    ] },
  { id: 'wd_street_memorial', age: [8, 100], req: { era: 'dist' }, w: 9,
    text: '路口有人摆下一束纸花，纪念在扭曲事件里死去的家属。\n\n清洁工挪开花束，先擦掉下面的污痕，再放回原处。花上的名字少了半个笔画。', eff: { mind: -1, dist: 1 } },
  { id: 'wd_false_alarm', age: [12, 100], req: { era: 'dist' }, w: 10, title: '错误警报',
    text: '车厢里有人尖叫，说一名乘客的手正在扭曲。那人把外套袖子卷起，露出卡住的廉价义体。\n\n车仍停着，司机说重新发车需要等巡查人员确认。',
    choices: [
      { t: '替他解释机械故障', check: { s: 'wit', dc: 38 },
        ok: { r: '你指出松脱的接头，巡查员记下型号。那位乘客低头把袖子拉得更长。', eff: { social: 2, mind: 1 } },
        no: { r: '你说错了一个零件名，也被留下问话。离开时，末班车已经走了。', eff: { money: -3000, mind: -2 } } },
      { t: '下车另找路线', eff: { money: -2000, body: -1 }, r: '你走了很长一段路。原来的车后来从身旁驶过，车窗后挤满沉默的脸。' },
    ] },
  { id: 'wd_human_rumor', age: [10, 100], req: { era: 'dist' }, w: 7,
    text: '有人说扭曲的人也能恢复原样。讲述者拿不出姓名，只能指出某条早已改名的街。你去看过一次，那里只有补办身份材料的广告。', eff: { wit: 1, dist: -2 } },
  { id: 'wd_ego_offer', age: [18, 100], req: { era: 'dist', flag: 'ego', nojob: 'distorted' }, w: 10, title: '演示费',
    text: '中间人请你在买家面前展示E.G.O。他把报价单推过来，要求写明能否复制、能否转让。\n\n你没回答，他又添了一栏“能否从持有者身上取出”。',
    choices: [
      { t: '只做一次演示', check: { s: 'social', dc: 58 },
        ok: { r: '你先收钱，再让他们隔着防护玻璃看。演示结束，你数清跟在身后的脚步才离开。', eff: { money: 35000, fame: 3, dist: 3 } },
        no: { r: '买家把演示说成验货，要求扣款。你付出一些伤，才拿回自己带来的东西。', eff: { body: -8, money: -5000, mind: -3 } } },
      { t: '撕掉报价单离开', eff: { social: -2, mind: 2 }, r: '中间人问你能不能留下联系方式。你把写着地址的那一角也带走了。' },
    ] },
  { id: 'wd_distorted_hunger', req: { era: 'dist', job: 'distorted' }, w: 15,
    text: '街边店铺在你的影子靠近前关了门。你记得里面的汤是什么味道，却记不起该怎样把它送进身体。\n\n你发出的声音已经不像人声，店主把铁门又压低了一点。', eff: { mind: -2, dist: 2 } },
  { id: 'wd_lockdown', age: [14, 100], req: { era: 'dist', nojob: 'distorted' }, w: 10, title: '扭曲封锁',
    text: '前方三条路同时封闭，围挡上没有预计解除的时间。你要送的货开始渗水，收货方只肯按准点到达付款。\n\n绕行路线经过一段没有照明的阶梯。',
    choices: [
      { t: '扛货走阶梯', check: { s: 'body', dc: 47 },
        ok: { r: '你把货压在肩上跑完最后一段。签收人先看表，再看你流血的手。', eff: { money: 10000, body: -3 } },
        no: { r: '箱子在台阶上摔开，水灌进你的鞋里。收货方让你照价赔偿，一分也没少。', eff: { money: -12000, body: -5 } } },
      { t: '等到封锁解除', eff: { money: -4000, mind: 1 }, r: '你在亮着灯的地方等到天亮。封锁解除时，货已经过了保质期，收货方一分钱也没付。' },
    ] },

  // 后来的街头、大湖与血魔。
  { id: 'wd_bus', age: [12, 100], req: { wy: [3, null] }, w: 10, title: '奇怪的巴士',
    text: '一辆奇怪的巴士停在街口，车身的泥盖住了大半标识。有人下来询问前面能否通车。\n\n你瞥见车窗后几件不同的武器，卖早餐的立刻收起外摆的桌子。',
    choices: [
      { t: '画出能通车的路线', eff: { social: 1, money: 2000, queue: ['wd_bus_detour', 2], ach: 'wd_bus' }, r: '对方买走你的草图，没有让你上车。车开走后，地上留下两道很深的轮印。' },
      { t: '退回店内等车走', eff: { mind: 1, ach: 'wd_bus' }, r: '你隔着玻璃看它拐弯。车尾消失后，早餐摊重新把桌子搬到原来的位置。' },
    ] },
  { id: 'wd_bus_detour', manual: true,
    text: '两年前你画给巴士的那条近路被封了。通知说，旧设施附近正在清理危险物。\n\n你翻出草稿，发现当时只标了路宽，没标沿途住着哪些人。', eff: { wit: 2, mind: -2 } },
  { id: 'wd_limbus_rumor', age: [12, 100], req: { wy: [3, null] }, w: 9,
    text: '酒馆里有人说那辆巴士属于边狱公司，乘客总在旧设施附近出现。\n\n他把听来的事写成情报卖给你，字迹下还有上一位买家留下的油渍。你只付了半张纸的钱。', eff: { money: -500, wit: 1 } },
  { id: 'wd_bus_passengers', age: [10, 100], req: { wy: [3, null] }, w: 8,
    text: '街角几个人争论巴士上的乘客。有人说见过头部像钟表的人，另一个说那只是商店橱窗的倒影。\n\n你看向他们指的玻璃，里面只有一排待售的闹钟，全部停在不同的时刻。', eff: { wit: 1, dist: 1 } },
  { id: 'wd_bough', age: [18, 100], req: { wy: [3, null] }, w: 8, title: '会发光的枝条',
    text: '废料贩子说有人在高价收购“金枝”，问你肯不肯买一份地点情报，再转手卖掉。\n\n他只给你看地图的一角：上面画着旧L公司设施的标记，纸却是新印的。',
    choices: [
      { t: '买下线索再转手', res: [
        { w: 3, r: '买家没有压价，只问你是否留了副本。你说没有，把地图推过桌面。', eff: { money: 12000, flag: 'wd_bough_deal', queue: ['wd_bough_buyer', 2] } },
        { w: 2, r: '转手时你才发现，两个买家手里早就有同样的地图。你的钱白花了，只换回一份印得更清楚的副本。', eff: { money: -15000, wit: 2 } },
      ] },
      { t: '只记住贩子的脸', eff: { wit: 1, dist: 1 }, r: '他把地图收回夹层，又向下一位路人说起从未告诉过别人的地点。' },
    ] },
  { id: 'wd_bough_buyer', manual: true, req: { flag: 'wd_bough_deal' }, title: '地图的副本',
    text: '买地图的人两年后又来找你，左袖下面空着。他问那份地图是不是唯一一份。\n\n你看见他带来的照片上有一条金色的细线，也有几个被划掉的名字。',
    choices: [
      { t: '退回部分佣金', eff: { money: -10000, mind: 1 }, r: '他收下钱，没有说够不够。照片仍朝上放在桌面，直到你先把它翻过去。' },
      { t: '坚持只是转卖', check: { s: 'social', dc: 60 },
        ok: { r: '你给出废料贩子的常去地点。他把地址抄好，没有留下照片。', eff: { social: -2, dist: 3 } },
        no: { r: '他不信。你被拖到门外挨了一顿打，赔出去的钱比当初的佣金还多。', eff: { money: -20000, body: -7 } } },
    ] },
  { id: 'wd_manchaland', age: [14, 100], req: { wy: [4, null] }, w: 7, title: '游乐园传单',
    text: '风把一张拉·曼却领的传单吹到脚边。画上的笑脸没有褪色，折痕里却夹着暗红的污渍。\n\n拾荒者劝你别按图找路，说有些游乐园不是给人游玩的。',
    choices: [
      { t: '打听传单的来处', res: [
        { w: 6, r: '卖旧物的人说起血魔和血袋，随即要求另付情报费。你只记下了这两个词。', eff: { money: -2000, dist: 3 } },
        { w: 3, r: '有人愿意带你见识传单背后的生意。他约在无人的仓库，要求你独自过去。', eff: { next: 'wd_blood_offer' } },
      ] },
      { t: '把传单留在地上', eff: { mind: 1 }, r: '你绕开那张纸。鞋底带起的风又把它推近排水沟一些。' },
    ] },
  { id: 'wd_blood_offer', manual: true, req: { noflag: 'bloodfiend' }, title: '仓库的帘子',
    text: '帘子后的人闻起来像生锈的铁。地上有拖动过的痕迹，他问你是否愿意换一种活法。\n\n你看不清他的脸，只看见门边堆着几件被掏空的外衣。',
    choices: [
      { t: '答应留下', res: [
        { w: 5, r: '你醒来时，饥饿已经换了含义。带你来的人称你为眷属，把第一道命令说得很慢。', eff: { flag: 'bloodfiend', body: 12, mind: -8, dist: 10, title: '帘后的眷属', ach: 'wd_blood' } },
        { w: 19, r: '他没有给你新名字。你被拖到帘子后，成了下一次招待用的血袋。', eff: { flag: 'wd_bloodbag', ach: 'wd_blood', death: '在陌生的仓库中沦为血袋。' } },
      ] },
      { t: '趁帘子落下时逃走', check: { s: 'body', dc: 60 },
        ok: { r: '你翻过货架，门外的光刺得眼睛流泪。外衣留在里面，你没有回去取。', eff: { body: -5, money: -5000, mind: -3 } },
        no: { r: '门闩从外面扣上了。你听见另一个来客问，这里是不是传单上的入口。', eff: { flag: 'wd_bloodbag', ach: 'wd_blood', death: '在逃离血魔的仓库时被制成血袋。' } } },
    ] },
  { id: 'wd_lake_port', age: [18, 60], req: { era: 'dist', nojob: 'distorted' }, w: 4, title: '大湖的装船单',
    text: '港口中间人招临时船工，预付钱比岸上的零工多。他翻到安全条款，念得比工资快。\n\n大湖在仓库尽头露出一小片水面，远处的汽笛声很低。',
    choices: [
      { t: '签下出海单', eff: { money: 18000, flag: ['lake_job', 'lake'], queue: ['wd_whale', 2] }, r: '你领到一套不合身的防水衣。船长让你先学口令，别急着学看风景。' },
      { t: '留在岸上搬货', eff: { money: 6000, body: -2 }, r: '你扛完最后一箱，船已经离岸。防波堤挡住了水面，仓库仍有货要搬。' },
    ] },
  { id: 'wd_whale', manual: true, req: { flag: 'lake_job' }, title: '遇鲸', star: true,
    text: '两年后的一次航行，船底下的阴影迟迟没有过去。船长让所有人停声。\n\n你透过舷侧看见鲸的一部分，原本当作水面的东西慢慢升高，遮住了远处的灯。',
    eff: { flag: 'lake', ach: 'wd_whale' }, choices: [
      { t: '照口令抛掉货物', check: { s: ['body', 'mind'], dc: 48 },
        ok: { r: '箱子砸进水里，船终于倾向另一边。你跟着人群回舱，直到靠岸才解开手上的绳结。', eff: { money: -10000, body: -3, queue: ['wd_lake_settlement', 2] } },
        no: { r: '绳索拖住你的脚。有人割断它，你掉回甲板，留下来的货不够抵偿损失。', eff: { money: -25000, body: -12, queue: ['wd_lake_settlement', 2] } } },
      { t: '冒险保住货舱', check: { s: ['skill', 'body'], dc: 78 },
        ok: { r: '你压住舱门，熬到船身重新平稳。船长什么也没说，靠岸后多分了你一份钱。', eff: { money: 50000, body: -8, queue: ['wd_lake_settlement', 2] } },
        no: { r: '舱门和你一起离开了甲板。冰冷的湖水灌进口鼻，有人把一根缆绳甩到了你手边。', eff: { body: -15, mind: -6, risk: [0.45, '在大湖遇鲸时随货舱一同沉没。'], queue: ['wd_lake_settlement', 2] } } },
    ] },
  { id: 'wd_lake_settlement', manual: true, title: '岸上的结算',
    text: '遇鲸两年后，保险公司终于来信。要拿到赔偿，你得证明当年抛进湖里的箱子确实装着货。信纸带着仓库里的潮气。',
    choices: [
      { t: '找当年的船工作证', check: { s: 'social', dc: 50 },
        ok: { r: '你找到两个还活着的船工，他们各写了一份证词。钱到账那天，你把那件防水衣也扔了。', eff: { money: 22000, mind: 1, unflag: 'lake_job' } },
        no: { r: '旧号码一半停了机，一半换了主人。你白跑了几个码头，最后推掉了下一趟出海。', eff: { money: -4000, mind: -2, unflag: 'lake_job' } } },
      { t: '折价接受结算', eff: { money: 8000, unflag: 'lake_job', mind: 1 }, r: '你领走折价后的钱，把防水衣挂上二手市场。袖口的盐渍洗不掉了。' },
    ] },
  { id: 'wd_pequod', age: [14, 100], req: { era: 'dist', flag: 'lake' }, w: 12,
    text: '码头上有人提起裴廓德号，说它一直在追一头鲸。你问他是否亲眼见过，他把话转到酒钱上。\n\n窗外一条船正在离港，船名被缆绳挡住了。', eff: { wit: 1, mind: -1 } },

  // 跨时代：禁忌、远景与普通人的账单。
  { id: 'wd_taboo_notice', age: [10, 100], w: 10, title: '禁忌告示',
    text: '街口换了新的禁忌告示。印刷铺说旧版本作废，但重印费照付。\n\n一个不识字的人请你念给他听，他把每条都刻成很短的记号，刻在自己的饭盒上。',
    choices: [
      { t: '逐条念完', eff: { social: 2, wit: 1, money: -1000 }, r: '你耽误了当日的工时。那人请你再念一次最难记的一条，拿袖口擦净饭盒。' },
      { t: '买一份告示带走', eff: { money: -500, wit: 2 }, r: '你把告示贴在门内。纸背的胶有些松，最下面几条总是卷起来。' },
    ] },
  { id: 'wd_arbiter', age: [12, 100], req: { nojob: 'distorted' }, w: 2, star: true,
    text: '远处的封锁线后，有个黑金色的人影走过。有人低声说是调律者，立刻被同伴捂住嘴。\n\n你退进地下通道，再上来时，那一侧的楼群已看不出原来的形状。', eff: { mind: -5, dist: 4, ach: 'wd_head' } },
  { id: 'wd_claw', age: [12, 100], req: { nojob: 'distorted' }, w: 2, star: true,
    text: '街道尽头出现一个被称作爪牙的身影。你只来得及看清轮廓，周围的人就扑向最近的门。\n\n铁门合上后，外面响过几声；守门的人始终没有松手。', eff: { body: -2, mind: -4, ach: 'wd_head' } },
  { id: 'wd_district_clear', age: [14, 100], w: 3, title: '被划掉的区',
    text: '有人说某个区被整片清扫了。地图摊老板用黑纸盖住了传闻里的位置。\n\n逃出来的人在路边找能证明自己旧地址的人，手里攥着一块烧黑的门牌，可没人愿意停下来作证。',
    choices: [
      { t: '替一个人保管门牌', eff: { money: -2000, mind: -2, queue: ['wd_address_check', 3] }, r: '他把门牌交给你，说等安顿好再来取。背面刻着几个孩子的身高。' },
      { t: '买张新地图离开', eff: { money: -1000, wit: 1 }, r: '老板把黑纸也算进价钱。你卷好地图，经过那些等待的人时没有停步。' },
    ] },
  { id: 'wd_address_check', manual: true, title: '地址核验',
    text: '三年后，来领门牌的是一个陌生女人。她说牌子的主人死了，能证明身份的材料只剩这个。\n\n你翻过铁片，背面的身高刻痕停在同一年。',
    choices: [
      { t: '核对旧描述后交还', check: { s: 'wit', dc: 42 },
        ok: { r: '她说出了刻痕旁边的小字。你递过铁片，她用布包好，空袋子留在你的桌上。', eff: { mind: 2, social: 1 } },
        no: { r: '你们记得的细节对不上。她留下地址，你把铁片放回原处，仍不知道该寄给谁。', eff: { mind: -2, dist: 2 } } },
      { t: '直接交给她', eff: { mind: -1, dist: -2 }, r: '她道了谢。门牌离开桌面后，下面留着一块没被灰尘盖住的长方形。' },
    ] },
  { id: 'wd_inspection', age: [16, 100], w: 8, title: '来历不明的零件',
    text: '旧货摊老板把一个没有厂标的零件塞给你，求你带过检查口。他说只是少了发票。\n\n检查人员正在逐件拍照，旁边挂着关于禁忌的告示。',
    choices: [
      { t: '要求先当面申报', res: [
        { w: 4, r: '零件被当场扣下，老板在人群里骂你多事。你回头时，他已经把摊位往后挪了三米。', eff: { social: -1, wit: 2 } },
        { w: 1, r: '老板突然转身跑了。你被扣留到深夜，出来时摊位已经空了。', eff: { money: -6000, mind: -3 } },
      ] },
      { t: '放下零件离开', eff: { mind: 1, money: -1000 }, r: '你绕过检查口，另付了一段路费。老板没有再叫你，零件留在秤盘里。' },
    ] },
  { id: 'wd_price_index', age: [12, 100], w: 10,
    text: '报纸说今年物价趋于稳定。你翻出十年前的账本：如今一碗面多出来的钱，在当年够再买一碗。\n\n店主说，碗的大小可没变。你量了量，没接话。', eff: { money: -1000, wit: 1 } },
  { id: 'wd_siren', age: [6, 100], w: 9,
    text: '午后的警报响了很久，没有人说为什么。\n\n你和一群陌生人挤进地下库房。头顶有沉重的东西缓缓经过，灰尘从灯罩边落下来。\n\n解除通知播完，大家默默散开。你摸口袋时，钱包里少了一千五百眼。', eff: { money: -1500, mind: -1 } },
  { id: 'wd_era_archive', age: [18, 100], w: 7, title: '旧报纸',
    text: '旧报纸按重量出售。你翻到当年那张纸，头条已经没人提起，边角的招工广告却仍像今天见过的。\n\n摊主催你，要看内容就不能只按废纸价算。',
    choices: [
      { t: '买下那一期', eff: { money: -1000, wit: 2 }, r: '你把它夹进旧书里。几处铅字掉了墨，正好缺了那些后来再没听过的名字。' },
      { t: '买一捆当包装纸', eff: { money: -500, mind: 1 }, r: '你用旧头条包住容易磕坏的杯子。搬到新住处时，杯子没有裂。' },
    ] },
  { id: 'wd_quiet_year', age: [12, 100], w: 9,
    text: '街道这一年没有换名字。修锁的人还在原来的摊位，墙上的逃生路线也没有添新箭头。\n\n楼下的面馆还是那个价钱，老板照旧多给你半勺汤。', eff: { mind: 2, dist: -2 } },
]);

CITY.addAch({
  wd_smoke: { name: '鞋盒里的战争', desc: '领走烟霾战争老兵留下的纽扣与口述。', tier: 'uncommon', group: '时代', hidden: false },
  wd_fall: { name: '白夜黑昼', desc: '活着经历了L公司倒下的那一年。', tier: 'common', group: '时代', hidden: false },
  wd_employee: { name: '最后一次下班', desc: '从崩溃的脑叶公司设施中逃出。', tier: 'rare', group: '时代', hidden: false },
  wd_salvage: { name: '带出地下的重量', desc: '在设施崩溃时带走一件E.G.O装备。', tier: 'epic', group: '扭曲与光', hidden: true, hint: '有些行李比逃生更沉。' },
  wd_lnest: { name: '旧居住证', desc: '在L巢失去庇护后迁出。', tier: 'uncommon', group: '时代', hidden: false },
  wd_invited: { name: '签名之前', desc: '收到图书馆的邀请函。', tier: 'uncommon', group: '时代', hidden: false },
  wd_returned: { name: '归还者', desc: '从图书馆活着回来。', tier: 'legend', group: '扭曲与光', hidden: true, hint: '纸页之外仍有街道。' },
  wd_book: { name: '书脊上的名字', desc: '成为图书馆中的一本书。', tier: 'rare', group: '时代', hidden: true, hint: '有一种结局被摆上书架。' },
  wd_witness: { name: '错过末班车', desc: '在站牌旁亲眼目睹扭曲。', tier: 'common', group: '扭曲与光', hidden: false },
  wd_hunter: { name: '风险补贴', desc: '完成协会转交的扭曲讨伐委托。', tier: 'rare', group: '扭曲与光', hidden: false },
  wd_neighbor: { name: '录音的余音', desc: '让两年前保存的邻居录音进入讨伐资料。', tier: 'uncommon', group: '扭曲与光', hidden: false },
  wd_ego: { name: '自己握住', desc: '在抗拒自身扭曲时显现E.G.O。', tier: 'epic', group: '扭曲与光', hidden: true, hint: '有个答案必须由你来说。' },
  wd_distorted: { name: '扭曲', desc: '自身扭曲成了另一种东西。', tier: 'epic', group: '扭曲与光', hidden: true, hint: '有一站一直无人下车。' },
  wd_human: { name: '边界', desc: '在扭曲后极罕见地恢复人形。', tier: 'myth', group: '扭曲与光', hidden: true, hint: '记住仍能念出的那个名字。' },
  wd_bus: { name: '让出转弯处', desc: '在街头见过那辆奇怪的巴士。', tier: 'common', group: '时代', hidden: false },
  wd_blood: { name: '帘子后面', desc: '见识了血魔所说的另一种活法。', tier: 'legend', group: '扭曲与光', hidden: true, hint: '传单的折痕里有暗红的污渍。' },
  wd_whale: { name: '水面升高', desc: '在大湖航行中遇见鲸。', tier: 'rare', group: '时代', hidden: false },
  wd_head: { name: '关上那扇门', desc: '在远处目睹首脑的执行者。', tier: 'rare', group: '时代', hidden: true, hint: '有些轮廓看清以前就该离开。' },
});
