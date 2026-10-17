/* 郊区成年人生：45 个事件（39 个带选项），8 个成就。
 * 连锁线：封井与新井——os_water → 3 年后 os_water_return。
 * 连锁线：交换秤砣——os_scale → 2 年后 os_scale_return。
 * 连锁线：首领的钥匙——os_chief → 3 年后 os_chief_return。
 * 连锁线：两营共用的路——os_neighbor → 2 年后 os_neighbor_return。
 * 连锁线：遗物的报价——os_relic → 3 年后 os_relic_return。
 * 连锁线：收尾人的向导——os_guide → 2 年后 os_guide_return。
 * 连锁线：废墟路标——os_marker → 4 年后 os_marker_return。
 * 连锁线：借出去的屋顶——os_shelter → 3 年后 os_shelter_return。
 */
(function () {
  'use strict';
  const enterCity = (S) => { S.d = S.rng.int(1, 25); S.home = S.d + '区后巷'; };
  CITY.addEvents('outskirts', [
    { id: 'os_water', age: [18, 90], req: { loc: 'outskirts' }, w: 14, title: '水桶里的膜',
      text: '井水放过一夜，表面浮起一层灰膜。有人已经喝了两天，说只是铁锈。\n\n你把桶挪开，桶底留下一个擦不掉的圆印。营地剩下的净水只够分三天。',
      choices: [
        { t: '出物资封井另挖', r: '你交出储备，和几个人把井口钉住。新的坑还没有水，分水的碗先小了一圈。', eff: { money: -6000, body: -2, flag: 'os_well', queue: ['os_water_return', 3] } },
        { t: '只买自己的净水', r: '你把桶做了记号。每次有人伸手借水，你都得把桶拖回床底。', eff: { money: -2500, mind: -2 } },
        { t: '试着过滤再用', check: { s: 'wit', dc: 40 },
          ok: { r: '布和炭拦下了灰膜。你只拿它洗工具，入口的水仍得去换。', eff: { wit: 2, money: -800 } },
          no: { r: '煮水的锅结了硬壳。你病了半个月，把锅和剩下的水一起埋掉。', eff: { body: -7, money: -1500 } } },
      ] },
    { id: 'os_water_return', age: [21, 100], manual: true, req: { loc: 'outskirts', flag: 'os_well' }, title: '第三年的井绳',
      text: '新井的绳子磨断了。三年前出过力的人可以先领水，死者的家属却不在名单上，仍拿着旧碗来排队。\n\n看井的人把名单递给你，空白处只剩两行。',
      choices: [
        { t: '把死者家属也列入配水', r: '你出钱换了井绳，每户少分半碗，给死者的家属也添上名字。轮到你时，桶底只响了几声。', eff: { social: 3, money: -1500, ach: 'os_water_ach' } },
        { t: '保住自己的份额', r: '你的桶先装满了，省下了另买水的钱。井边争执还在继续，你把绳头接好，没有再看名单。', eff: { money: 4000, mind: -2 } },
      ] },
    { id: 'os_scale', age: [18, 90], req: { loc: 'outskirts' }, w: 12, title: '空心秤砣',
      text: '换粮的商人用同一只秤收铁、卖盐。你发现他收铁时总会换一枚秤砣，那枚砣落在桌上的声音很空。\n\n后面的人把袋子往前推，催你快点。',
      choices: [
        { t: '记下车牌再当众换砣', check: { s: 'social', dc: 38 }, eff: { flag: 'os_scale_exposed', queue: ['os_scale_return', 2] },
          ok: { r: '你记好车牌，上前换回秤砣。他补了你一袋粮，收摊时逐个记下围观者的脸。', eff: { money: 3500, social: 2 } },
          no: { r: '你记好车牌才上前，仍没人肯作证。商人把你的袋子扔回泥里，说明年仍是这个价。', eff: { mind: -2, money: -1000 } } },
        { t: '私下要一份封口粮', r: '他给了你半袋粮，把收来的铁掺上沙，堆进待卖的货里。你拎起粮袋，没有再出声。', eff: { money: 2500, mind: -1 } },
      ] },
    { id: 'os_scale_return', age: [20, 100], manual: true, req: { loc: 'outskirts', flag: 'os_scale_exposed' }, title: '第二辆粮车',
      text: '两年后，另一辆粮车停在旧摊位。\n\n你拿旧车牌的笔记问行情，司机说愿意收废铁，但少了重量要由你补足。旧商人的车还停在远处。',
      choices: [
        { t: '借砝码逐袋复称', check: { s: 'wit', dc: 38 },
          ok: { r: '你剔出几袋藏石头的铁，逐袋称准。司机付了货款和帮忙收货的报酬，空粮袋在车边堆了一摞。', eff: { money: 6000, social: 3, ach: 'os_scale_ach' } },
          no: { r: '你漏看了一袋夹着泥的铁。司机倒出来复称，你补了差价和运费，他仍只肯先收半车。', eff: { money: -4000, wit: 1 } } },
        { t: '只卖自己的铁', r: '你不肯替别人担保，只领走自己的粮。司机又等了一天，车最后只装满一角。', eff: { money: 2000 } },
      ] },
    { id: 'os_chief', age: [18, 90], req: { loc: 'outskirts' }, title: '留下的钥匙',
      text: '营地首领死在床上，枕头下面有三把仓库钥匙。两个接班的人各说自己保管过粮食。\n\n他们请你作证，你只记得上次领到的袋子里有很多砂。',
      choices: [
        { t: '要求先开仓清点', r: '仓门开了，最里面的粮袋已经发黑。你被推去记账，从此每一袋短缺都有人来问你。', eff: { wit: 2, social: -1, flag: 'os_keeper', queue: ['os_chief_return', 3] } },
        { t: '支持愿意付钱的人', r: '你收了钱，替他举起手。另一人把自己的板凳搬到了营地最远的角落。', eff: { money: 5000, mind: -2 } },
        { t: '退出围着仓库的人群', r: '晚些时候仓门上多了一把新锁。你的配给没有变，但领粮得重新排队。', eff: { social: -1 } },
      ] },
    { id: 'os_chief_return', age: [21, 100], manual: true, req: { loc: 'outskirts', flag: 'os_keeper' }, title: '账本上的洞',
      text: '你记了三年的账。新首领让你把失踪的一批粮记成霉损，作为交换，你可以拿走仓库角落的一只箱子。\n\n账本上已经写了日期，只差数量。',
      choices: [
        { t: '把实数抄到仓门上', check: { s: 'social', dc: 42 },
          ok: { r: '领粮的人堵住仓门。首领交出了备用钥匙，你也交出了自己的，改成两个人一起开仓。', eff: { fame: 2, social: 3, ach: 'os_keys_ach' } },
          no: { r: '账页被扯走了。你连同铺盖被赶出仓房，在熟人的棚下住了半个冬天。', eff: { money: -5000, mind: -4 } } },
        { t: '拿箱子交回账本', r: '箱子里是干粮。第二天有人来问少发的份额，你指了指首领的新住处。', eff: { money: 7000, mind: -3 } },
      ] },
    { id: 'os_neighbor', age: [18, 90], req: { loc: 'outskirts' }, title: '另一边的脚印',
      text: '通往废料场的小路上多了另一座营地的脚印。你们的人扣住了对方一辆手推车，车上只有空桶。\n\n双方都说先发现了路边那根倒下的管子。',
      choices: [
        { t: '归还车并约定轮用', r: '你赔了一顿饭，让两边各在管子上刻一道线。谁也不肯先收刀，饭还是吃完了。', eff: { money: -2000, flag: 'os_route_pact', queue: ['os_neighbor_return', 2] } },
        { t: '抢先封住小路', check: { s: 'skill', dc: 40 },
          ok: { r: '他们退回去了。你们多收了一车废铁，往后每次出营都得留人看背后。', eff: { money: 6000, skill: 2, mind: -2 } },
          no: { r: '推车被砸了，铁片划开你的肩膀。两边各自抬走伤者，管子留在原地。', eff: { body: -8, money: -2500 } } },
      ] },
    { id: 'os_neighbor_return', age: [20, 100], manual: true, req: { loc: 'outskirts', flag: 'os_route_pact' }, title: '轮不到的日子',
      text: '邻营的人在约定之外的日子赶来，说他们的水坑干了，急着捡铁换水。\n\n管子上的刻痕还在，你们也已把今天的废铁算进了下个月的口粮。',
      choices: [
        { t: '借路换以后的运力', r: '他们拿绳结作凭据，次月来帮你们搬走了最重的机器壳。你另掏了这几天的粮钱。', eff: { money: -2500, social: 4, ach: 'os_pact_ach' } },
        { t: '按约定拦住他们', r: '他们推着空桶绕路。你保住一车废铁，把那根刻过线的管子拖回了营地。', eff: { money: 4500, mind: -2 } },
      ] },
    { id: 'os_relic', age: [18, 90], req: { loc: 'outskirts' }, w: 12, title: '合不上的盒子',
      text: '你从地下翻出一只小盒，盖子总差一线合不上。\n\n来收旧物的人叫它“遗物”，报价比你整车废铁都高，却始终不肯摘下手套，还要你指出挖到它的地方。',
      choices: [
        { t: '留盒子只卖出土记录', r: '他买走记录，给盒子画了个编号。你没有打开它，把它单独埋在睡铺以外。', eff: { money: 3000, flag: 'os_relic_kept', queue: ['os_relic_return', 3] } },
        { t: '连盒子一起卖掉', res: [
          { w: 4, r: '他隔着厚布装箱，逐张付了现金。你数了两遍，足够换一年的口粮。', eff: { money: 30000, mind: -1 } },
          { w: 1, r: '他先把盒子锁进车，再说你碰坏了表面。尾款只剩原先的十分之一。', eff: { money: 3000, mind: -3 } },
        ] },
      ] },
    { id: 'os_relic_return', age: [21, 100], manual: true, req: { loc: 'outskirts', flag: 'os_relic_kept' }, title: '编号的买家',
      text: '工坊派来的人报出了三年前给盒子编的号码。他说盒子只是待检旧物，却带了三层箱子来装。\n\n他不肯解释用途，只隔着桌子问你埋在哪里。',
      choices: [
        { t: '收齐现金让他们装箱', check: { s: 'social', dc: 40 },
          ok: { r: '你坚持在箱锁扣上以前点完钱。对方取走盒子，连埋盒处的土也带了一袋。', eff: { money: 48000, unflag: 'os_relic_kept', ach: 'os_relic_ach' } },
          no: { r: '他们只肯按旧报价收购。你接受了，看着那三层箱子逐层扣紧。', eff: { money: 18000, unflag: 'os_relic_kept' } } },
        { t: '拒绝出售继续埋着', r: '来人把空箱子套好，搬回车上。盒子仍在原处，你搬开了附近的睡铺，空出的地方再没人租。', eff: { mind: -2 } },
      ] },
    { id: 'os_guide', age: [18, 85], req: { loc: 'outskirts' }, w: 14, title: '走到断桥为止',
      text: '三个收尾人找向导去一座废弃设施。他们有武器、地图和不合适的鞋。\n\n你在地图上指出断桥，说只能带到那里；领队问，多付钱能否带过桥。',
      choices: [
        { t: '限定路线再带队', check: { s: ['wit', 'body'], dc: 40 }, eff: { flag: 'os_guided', queue: ['os_guide_return', 2] },
          ok: { r: '你把他们带到断桥，赶在变天前绕路返回。领队付清报酬，脱下鞋，倒出里面积的沙。', eff: { money: 18000, wit: 2 } },
          no: { r: '回程的低地已经积水。你们丢下工具爬回高处，误期的钱从报酬里扣了。', eff: { money: 6000, body: -5, mind: -2 } } },
        { t: '收加价继续深入', check: { s: ['skill', 'wit'], dc: 58 }, eff: { flag: 'os_guided', queue: ['os_guide_return', 2] },
          ok: { r: '他们取到一截包严的零件。你背着伤员回到桥边，报酬装了两个信封。', eff: { money: 38000, body: -3 } },
          no: { r: '灯光照到了桥下正在移动的轮廓。你被绳子拖回岸边，裤腿里面全是血。', eff: { body: -12, mind: -5, money: 5000, dist: 3, risk: [0.12, '在断桥下方，被照明灯惊动的东西拖入了暗处。'] } } },
        { t: '卖路线不随行', r: '你在纸上标出折返点，拿了画图的钱。他们问桥下有什么，你说没有看清。', eff: { money: 3500 } },
      ] },
    { id: 'os_guide_return', age: [20, 100], manual: true, req: { loc: 'outskirts', flag: 'os_guided' }, title: '改过的地图',
      text: '那位领队隔了两年带着新队员回来。地图上仍留着你的折返点，这回委托人却要求沿直线走。\n\n他用手压住地图，让你算算绕路要多走几天。',
      choices: [
        { t: '坚持绕行并重订报酬', check: { s: 'social', dc: 42 },
          ok: { r: '领队同意绕行，也争取到了多走两天的报酬。返程点人时，一个队员还在低头挑鞋底的刺。人齐了。', eff: { money: 24000, social: 2, ach: 'os_guide_ach' } },
          no: { r: '委托人不肯加钱。领队付了问路费，把地图卷好。新队员还在等他下令出发。', eff: { money: 2000, mind: -1 } } },
        { t: '收钱卖图让他们自己走', r: '你收钱交出补画的地图，指出哪些地方没有探过。领队把图递给新队员，临走又问了一遍断桥的位置。', eff: { money: 7000, mind: -2 } },
      ] },
    { id: 'os_marker', age: [18, 90], req: { loc: 'outskirts' }, title: '路边的红布',
      text: '一名老拾荒者用红布给安全的路做记号，死后没人接着换。\n\n岔路口最后一块布已褪成灰色，箭头也看不清了。新来的人认错方向，正往时有塌陷的低地走。',
      choices: [
        { t: '买布重走一遍路线', r: '你只标自己走过的地面，在低地前多打了一个结。用掉的布本来够补一件外衣。', eff: { money: -2200, body: -1, flag: 'os_marked', queue: ['os_marker_return', 4] } },
        { t: '喊住他们后拆掉旧布', r: '他们折返回来，问你路在哪。你指了一个大致方向，口袋里装着拆下的灰布。', eff: { mind: -1, wit: 1 } },
      ] },
    { id: 'os_marker_return', age: [22, 100], manual: true, req: { loc: 'outskirts', flag: 'os_marked' }, title: '多出来的结',
      text: '四年后，你发现路标多了自己没打过的结。有人沿你的记号添出了新路，尽头摆着一排空鞋。\n\n你没有看到脚印，也认不出那些鞋的主人。',
      choices: [
        { t: '拆新结逐户告知', r: '你花了三天找齐走这条路的人。旧路还能用，红布以后每季都得由两个人一起核对。', eff: { body: -2, social: 3, wit: 2 } },
        { t: '停止维护自己的路段', r: '你把自己打的结也拆了。有人为绕路骂你，你没有带他们去看那些鞋。', eff: { mind: -3, social: -1 } },
      ] },
    { id: 'os_shelter', age: [18, 90], req: { loc: 'outskirts' }, title: '屋檐下的空位',
      text: '搬来的两个人问能否借你的棚檐睡一季。他们带着一卷缝棚的线，鞋底都磨穿了。\n\n空位能放下两个人，也能放下你打算过冬用的燃料。',
      choices: [
        { t: '腾地方换他们修棚', r: '他们把线用到了最后一寸。你少囤了几捆燃料，半夜能听见屋檐下两个人轮流咳嗽。', eff: { money: -1800, social: 2, flag: 'os_sheltered', queue: ['os_shelter_return', 3] } },
        { t: '卖给他们一张旧篷布', r: '你收了几件工具，把篷布交过去。新棚搭在不远处，风一卷起沙，便只听得见篷布拍打的声音。', eff: { money: 2000 } },
      ] },
    { id: 'os_shelter_return', age: [21, 100], manual: true, req: { loc: 'outskirts', flag: 'os_sheltered' }, title: '缝线的价钱',
      text: '当年借住的人回来了一位，替别的营地运粮。车轴坏了，他想拿粮换你的工具，也问你能否一起修车。\n\n手腕上仍系着当年那卷缝线留下的纸芯。',
      choices: [
        { t: '帮忙修好再分运费', check: { s: 'wit', dc: 38 },
          ok: { r: '你削了垫片，车撑到了下个营地。他带回运费和你的工具，另一人的消息仍没有。', eff: { money: 8000, social: 3 } },
          no: { r: '轴在半路又裂了。你们背回能搬动的粮，工具留在了车底。', eff: { money: -2000, body: -3 } } },
        { t: '按市价收粮换工具', r: '他数了两次粮袋，搬下说好的数目，拿走工具。你们提起修过的棚顶，没有提起另一个人。', eff: { money: 3500, mind: -1 } },
      ] },

    { id: 'os_scrap', age: [18, 100], req: { loc: 'outskirts' }, repeat: true, cd: 4, title: '嵌在墙里的铜',
      text: '废弃设施的墙缝里露出一截铜线。前面的人只剪走了外层，剩下的连着一块松动的顶板。\n\n你背篓里的铁片还不够换回今天消耗的干粮。',
      choices: [
        { t: '支住顶板再取线', check: { s: 'wit', dc: 36 },
          ok: { r: '你用短管顶住裂口，抽出一卷完整的线。离开时，短管已经弯了。', eff: { money: 6500, body: -1 } },
          no: { r: '顶板比预想的重。你扔掉背篓滚出门，碎石在身后落了很久。', eff: { body: -6, money: -1200 } } },
        { t: '剪外头够得着的一段', r: '你没有伸手进裂缝。铜线只换来一点盐，干粮还得从储备里拿。', eff: { money: 1200, body: -1 } },
      ] },
    { id: 'os_barter', age: [18, 100], req: { loc: 'outskirts' }, repeat: true, cd: 4, title: '一双合脚的靴子',
      text: '交换摊上有双合脚的靴子，内衬还没磨破。摊主不要眼，只要你背包里的扳手。\n\n你的旧鞋进了沙，扳手却是拆大块废料时唯一够长的工具。',
      choices: [
        { t: '换靴子改捡小件', r: '你把旧鞋留给摊主，踩着新鞋走回去。下一次看见螺栓，你试了试手，还是放下了。', eff: { body: 3, money: -2500 } },
        { t: '留扳手补鞋底', r: '你找了薄铁片垫进鞋里。脚底的水泡破了，拆下来的机器壳倒卖了一个好价。', eff: { body: -3, money: 4000 } },
      ] },
    { id: 'os_boundary_check', age: [18, 100], req: { loc: 'outskirts' }, title: '逐件摊开',
      text: '都市边界的一处交易点要查每件货物。检查者用棍尖拨你的包，让你解释一块没有铭牌的金属从哪里来。\n\n后面的商人已经开始计算等候的费用。',
      choices: [
        { t: '交代来路留下样品', check: { s: 'social', dc: 38 },
          ok: { r: '他留下一小块作样品，放行了余下的货。你把货卖给摊主，钱比预计的少了一点。', eff: { money: 9000, social: 1 } },
          no: { r: '他让你把整块金属留下。你带着其余杂货折返，运费已经花完。', eff: { money: -2000, mind: -2 } } },
        { t: '背包返回营地', r: '你把散开的货重新扎好。排在后面的人立刻填上你空出的位置。', eff: { money: -1000, body: -1 } },
      ] },
    { id: 'os_extortion', age: [18, 100], req: { loc: 'outskirts' }, title: '第二笔搬运费',
      text: '卖完货，替你看车的人要再收一笔钱。他说刚才有人打算砸车，是他劝住的。\n\n车轮旁插着一把刀，你来时没在价目纸上见过这一项。',
      choices: [
        { t: '付钱尽快推走车', r: '他抽走刀，顺手替你推了一把。回程你少买了半袋粮，车至少没有坏。', eff: { money: -2500, mind: -1 } },
        { t: '请旁边摊主作证', check: { s: 'social', dc: 43 },
          ok: { r: '摊主说他一直坐在这里，没见有人砸车。你请摊主吃了饭，那人没有追来。', eff: { money: -600, social: 2 } },
          no: { r: '摊主低头擦秤。看车的人踢坏了辐条，你花钱找人修车，拖车时磨破的手掌还在渗血。', eff: { body: -4, money: -4000 } } },
      ] },
    { id: 'os_false_pass', age: [18, 100], req: { loc: 'outskirts' }, title: '印得很新的纸',
      text: '有人在边界兜售“包进城”的凭条，红印没有干。他指着远处一条路，说带这张纸就不会被盘问。\n\n纸背面还有上一家商铺没刮净的价签。',
      choices: [
        { t: '付一半等他带路', res: [
          { w: 3, r: '他说去取另一半印章，转过车厢便消失了。你等到收摊，路也没找到。', eff: { money: -3500, mind: -2 } },
          { w: 2, r: '纸没有用。他倒真认识路，你跟到一条后巷，剩下的钱换来一把出租屋钥匙。', eff: { money: -7000, loc: { loc: 'backstreet' }, fn: enterCity, flag: 'from_outskirts', ach: 'os_enter_ach' } },
        ] },
        { t: '找来买货的人问路', r: '你拿半袋废铁，换来了几处落脚点的地址。卖凭条的人收了摊，又到远处的车后吆喝起来。', eff: { money: -800, wit: 2 } },
      ] },
    { id: 'os_ruin', age: [18, 90], req: { loc: 'outskirts' }, title: '向下的楼梯',
      text: '废墟底层有一段干净的楼梯，灰尘停在第七阶。你的灯照不到转角，系在腰上的绳子只够往下二十步。\n\n同行的人说，干净的地方总有好东西。',
      choices: [
        { t: '在绳长以内探查', check: { s: 'wit', dc: 43 },
          ok: { r: '你拆下墙边完整的阀门，没走过第七阶。买家只按金属重量付钱。', eff: { money: 7000, wit: 2 } },
          no: { r: '绳子忽然绷紧，灯撞在台阶上。你爬回地面，腰间多了一圈紫痕。', eff: { body: -6, mind: -3, dist: 2 } } },
        { t: '封住入口去别处捡', r: '你用碎板挡住楼梯。同行的人骂你胆小，回程仍走在你的灯光里。', eff: { money: 1200, social: -1 } },
      ] },
    { id: 'os_beast', age: [18, 100], req: { loc: 'outskirts' }, title: '围栏外的呼吸',
      text: '围栏外有什么贴着地面呼吸，几根横杆随之起落。守夜的人想敲铁盆吓走它。你只能看到一片没有接缝的表面，看不出头朝哪边。',
      choices: [
        { t: '熄灯从另一侧撤走', r: '你们放弃了外面的储物棚。天亮后横杆恢复原样，棚里的袋子却全空了。', eff: { money: -4500, mind: -2 } },
        { t: '牵绳摸去取回储物', check: { s: ['body', 'skill'], dc: 48 },
          ok: { r: '你沿地面拖回两个袋子，绳上沾了透明的东西。剩下的袋子你没有再碰。', eff: { money: 3000, mind: -3, dist: 2 } },
          no: { r: '压住绳子的东西把你拖倒。守夜的人抓住你的胳膊，割断腰间的绳，才把你拉回围栏。你的腿几天都不能弯。', eff: { body: -10, mind: -4, dist: 3, risk: [0.08, '在营地围栏外，被看不清形状的东西压住了。'] } } },
      ] },
    { id: 'os_storm', age: [18, 100], req: { loc: 'outskirts' }, title: '横着下的雨',
      text: '雨带着细碎的硬粒，横着打穿了棚壁。\n\n有人说先等一等，免得白扔物资；你的被褥已经湿了一半，外面连接几座棚子的绳子正在一根根断开。',
      choices: [
        { t: '弃棚躲进低矮涵洞', r: '你抱着粮袋挤进涵洞，水一直漫到膝盖。回去时棚已经不在了，铺位要重新搭。', eff: { money: -5000, body: -2 } },
        { t: '顶着雨加固外壁', check: { s: 'body', dc: 43 },
          ok: { r: '你用两块车板撑到风停，手背留下细密的伤口。干被褥换回了一点修棚的钱。', eff: { body: -3, money: 2500 } },
          no: { r: '车板翻过来压住你。邻居用撬棍抬起一角，棚顶和粮袋都冲走了。', eff: { body: -8, money: -3500 } } },
      ] },
    { id: 'os_fuel', age: [18, 100], req: { loc: 'outskirts' }, title: '烧什么',
      text: '寒冷来得比粮车早。你找到几块带漆的板材，烧过的人说烟会让牙床发麻。\n\n干净的燃料要拿盐去换，锅里还有最后一把需要煮开的豆子。',
      choices: [
        { t: '换燃料少放盐', r: '汤没有味道，火烧得很稳。你把剩下的盐用纸包好，明天还要拿它换针线。', eff: { money: -1800, mind: 1 } },
        { t: '在棚外烧漆板', res: [
          { w: 3, r: '风一直朝空地吹。你守到豆子煮熟，把结在锅边的黑渣刮掉了。', eff: { body: -1, money: 800 } },
          { w: 2, r: '风掉了头。你捂着嘴搬锅，眼泪流到看不见脚下，咳嗽拖了很久。', eff: { body: -5, mind: -1 } },
        ] },
      ] },
    { id: 'os_medicine', age: [18, 100], req: { loc: 'outskirts' }, title: '药盒上的日期',
      text: '来营地卖药的人带了一箱刮掉日期的药片，说都市里的人有钱才会挑剔。你的伤口正发热。\n\n他肯收眼，也肯收你那把还能关严的钳子。',
      choices: [
        { t: '只买有完整包装的药', r: '他从车底拿出另一小盒，价钱翻了几倍。伤口慢慢消肿，你的粮袋也轻了。', eff: { money: -4000, body: 2 } },
        { t: '换散药赌一回', res: [
          { w: 3, r: '药片很苦，热退了。你把剩下的两片用干纸包住，没有写下药名。', eff: { money: -1200, body: 1 } },
          { w: 2, r: '你吐掉了晚饭。伤口没有变好，最后还是找人清掉了烂肉。', eff: { money: -2000, body: -5, mind: -2 } },
        ] },
      ] },
    { id: 'os_burial', age: [18, 100], req: { loc: 'outskirts' }, title: '少一个背包',
      text: '同行的拾荒者没能从落石下面出来。\n\n他的背包压在你能碰到的地方，里头有粮，也有写着营地位置的布条。\n\n返程少一个人，能背的东西反而多了。',
      choices: [
        { t: '把包送回他的住处', r: '收包的人先数粮，再拿走布条。她分给你一小把，问路是不是已经不能走了。', eff: { money: -1000, mind: -2, social: 2 } },
        { t: '留下粮替他堆石头', r: '你把布条压在石缝里，粮分进自己的袋子。回去路上，你记住了另一条绕行线。', eff: { money: 3000, mind: -3, wit: 1 } },
      ] },
    { id: 'os_map', age: [18, 100], req: { loc: 'outskirts' }, title: '有日期的地图',
      text: '一个都市人愿意买你画的地图，要求标出最近经过的路线。他尤其想要空白处的名称。\n\n你没有见过那些地方，只见过几个从那边跑回来的人。',
      choices: [
        { t: '标日期并保留空白', r: '他按画满一半的价钱付账。你把确实走过的路线又描了一遍，没有添地名。', eff: { money: 4000, wit: 1 } },
        { t: '按传闻填满地图', res: [
          { w: 3, r: '他满意地卷起纸，多给了几张钱。那些地方有了名字，你仍不知道它们在哪里。', eff: { money: 9000, mind: -2 } },
          { w: 2, r: '他拿出另一张地图，指着你画穿山体的线。你赔掉纸钱和一顿饭。', eff: { money: -2000, social: -2 } },
        ] },
      ] },
    { id: 'os_caravan', age: [18, 100], req: { loc: 'outskirts' }, w: 8, title: '车尾的空位',
      text: '一支商队要进都市，车尾能捎一个人，代价是沿途帮他们装卸。\n\n领队把空位量给你看，恰好能蜷着腿坐下。你营地里的东西最多只能带一包。',
      choices: [
        { t: '带一包东西上车', r: '你卸完最后一箱货，在一条后巷领到工钱。领队把你放下的位置圈在纸上，往后的路要自己找。', eff: { body: -3, money: 5000, loc: { loc: 'backstreet' }, fn: enterCity, flag: 'from_outskirts', ach: 'os_enter_ach' } },
        { t: '留下替他们装这一车', r: '你搬到日落，领到一小袋粮。车尾的空位装了最后一件货，用绳子捆得很紧。', eff: { money: 3000, body: -2 } },
      ] },
    { id: 'os_evacuation', age: [18, 100], req: { loc: 'outskirts' }, w: 8, title: '搬走以前',
      text: '营地后方的地面连续几夜传来低响，插下的铁杆第二天总会歪。\n\n大家决定搬走，一拨去更远的高地，一拨去都市边缘。两边都要你出搬运的钱。',
      choices: [
        { t: '随车向都市走', r: '你们在后巷合租了一间堆过杂物的房。半夜没有地底的低响，楼上却一直有人拖椅子。', eff: { money: -8000, mind: -2, loc: { loc: 'backstreet' }, fn: enterCity, flag: 'from_outskirts', ach: 'os_enter_ach' } },
        { t: '带棚布搬到高地', r: '你们把棚子一根根重新立好。旧营地还能望见，却没有人肯回去拿剩下的铁杆。', eff: { money: -4000, body: -2, mind: -1 } },
      ] },
    { id: 'os_oldage', age: [40, 100], req: { loc: 'outskirts' }, w: 14, title: '背篓轻下来',
      text: '你已经背不动从前那么多废铁。年轻人问你愿不愿意守库，报酬是每天一份饭，丢东西则要赔。\n\n你翻出旧背带，上面接过的绳头比原绳还多。',
      choices: [
        { t: '接下守库的轮值', r: '你把钩锁安在坐着能碰到的地方。天亮交班时，对方和你一起逐件数完工具。', eff: { body: 2, money: 4000, ach: 'os_stay_ach' } },
        { t: '继续挑小件拾荒', r: '你把背篓截短一半，沿熟路慢慢走。那天收回来的东西刚好够饭钱。', eff: { body: -2, money: 5500, ach: 'os_stay_ach' } },
      ] },
    { id: 'os_workshop', age: [18, 100], req: { loc: 'outskirts' }, title: '工坊的样品袋',
      text: '来找材料的工坊技师递给你三只封口袋。他要不同废墟的锈粉，不能混装，也不要你尝试加热。\n\n报酬按袋付，破了的袋子和受伤的手都不赔。',
      choices: [
        { t: '照要求分点取样', check: { s: 'wit', dc: 38 },
          ok: { r: '三只袋子各装一小撮。技师戴着手套验收，付了钱，把你的铲子也买走了。', eff: { money: 10000, wit: 2, body: -1 } },
          no: { r: '一只袋子在回程漏了，粉末灼伤了手腕。你剪掉沾粉的袖口，剩下两袋的报酬付完清创和工具钱，只余一点。', eff: { money: 2000, body: -4 } } },
        { t: '只替他搬运设备', r: '你不碰样品，背着空箱跟到路口。他按搬运工的价钱付款，连封口袋也数了一遍。', eff: { money: 3500, body: -2 } },
      ] },
    { id: 'os_watch', age: [18, 100], req: { loc: 'outskirts' }, title: '三点十三分',
      text: '一个从都市逃来的人坚持三点十三分必须锁门。他把营地仅有的挂钟调准，问你谁来执行。\n\n外面没有清道夫的脚步，远处却有一盏灯总比钟声先亮。',
      choices: [
        { t: '按本地动静安排轮岗', check: { s: 'wit', dc: 37 },
          ok: { r: '你记下灯亮和地面震动的时刻，提前搬走外棚的粮。挂钟仍走着，只用来交班。', eff: { wit: 2, mind: -1, money: 2500 } },
          no: { r: '你们守错了方向，另一边的围栏倒了。搬到仓房后，谁也没再争论几点锁门。', eff: { money: -3500, mind: -3 } } },
        { t: '加一把锁轮流醒着', r: '你们睡得很浅。那盏灯没有靠近，锁门的人每天照旧检查门板上的抓痕。', eff: { money: -1000, mind: -2, body: -1 } },
      ] },

    { id: 'os_echo_rent', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, w: 16, title: '登记表上的籍贯',
      text: '房东把“郊区”两个字圈了起来，说查不到从前的地址，押金得加一份。\n\n你报出住过的营地和废弃设施，他把笔悬在表上，问你有没有带门牌号。',
      choices: [
        { t: '补押金换收据', r: '你看着他逐项写明金额。门牌号终于有了，过去住过的地方被归进“其他”。', eff: { money: -6000, mind: -1 } },
        { t: '找愿意担保的邻居', check: { s: 'social', dc: 40 },
          ok: { r: '邻居签了字，要你替他搬两个月的货。房东划掉加收项，没划掉籍贯上的圈。', eff: { social: 2, body: -2 } },
          no: { r: '没人肯签。你付了临时铺位的钱，等找到新住处，又交了一次押金。', eff: { money: -8000, mind: -2 } } },
      ] },
    { id: 'os_echo_water', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, w: 15, title: '拧开的水',
      text: '后巷水管停了半天，你先把所有空罐摆在墙边。\n\n来水时，邻居说用不着这样；水流很快又细下去，他便来借两个罐子。管壁里还有细沙摩擦的声音。',
      choices: [
        { t: '分一半罐子共同存水', r: '你们把取水日期写在罐盖上。地方挤了一点，停水那晚谁也没去买摊上的高价水。', eff: { money: -1000, social: 3 } },
        { t: '卖罐子补这次水费', r: '邻居付钱拿走空罐。你剩下的罐子装满了水，恰好排在床脚，不妨碍开门。', eff: { money: 1800, mind: -1 } },
      ] },
    { id: 'os_echo_buyer', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, title: '橱窗里的旧物',
      text: '橱窗里一件郊区旧物的标价是你记得的几十倍。店主听出口音，问你能否再带几件来，只付采购价。\n\n标签上的出土地点，你从来没听人这样叫过。',
      choices: [
        { t: '收费辨认来源不保真', check: { s: 'wit', dc: 40 },
          ok: { r: '你指出包装上旧营地的绳结，拒绝给东西起名字。他买下这条线索，换掉了标签。', eff: { money: 6000, wit: 1 } },
          no: { r: '你只认得绳结。他说这不值钱，你付了路费，回去翻了翻仍留在包里的旧绳。', eff: { money: -600, mind: -1 } } },
        { t: '介绍运货的人抽佣', res: [
          { w: 3, r: '对方只带来普通零件。店主挑走几件，付了你介绍费，余下的又装回车里。', eff: { money: 3500, social: 1 } },
          { w: 1, r: '两边为价钱吵起来，运货的人不肯再见你。店主也收回了佣金约定。', eff: { social: -3, mind: -2 } },
        ] },
      ] },
    { id: 'os_echo_taboo', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, title: '先读告示',
      text: '你想拆走路边一件闲置设备，被同行的人拽住。\n\n他指着墙上的当地告示，说这里不是郊区，没人用不等于可以拿。几行小字贴在旧广告的下面。',
      choices: [
        { t: '付钱请他读完告示', r: '你把注意事项抄在纸上，连他不确定的部分也标出来。设备留在路边，晚饭钱少了一半。', eff: { money: -1500, wit: 2 } },
        { t: '放回工具另找零工', r: '你去搬了半天货，没有再碰那件设备。回去时看见别人拆它，旁边站着一个收钱的人。', eff: { money: 2000, body: -2, mind: -1 } },
      ] },
    { id: 'os_echo_parcel', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, title: '送不到门口的包裹',
      text: '你攒出一包针线、药和盐，想托人送回郊区。\n\n运货的人问营地有没有换地方；他只答应送到旧路口，至于谁来领取，要你自己想办法通知。',
      choices: [
        { t: '多付钱托他打听后再送', res: [
          { w: 3, r: '两个月后，他带回一截熟悉的绳结。收货的人问过你的地址，你让他下次再带一包。', eff: { money: -5000, mind: 3, social: 1 } },
          { w: 2, r: '他没找到人，把东西退了回来。盐受了潮，药盒仍封着，打听的钱不退。', eff: { money: -2500, mind: -3 } },
        ] },
        { t: '留下包裹等可靠消息', r: '你把袋口扎好，放回床底。过了一个月，做饭时先从里面取了盐。', eff: { money: -800, mind: -1 } },
      ] },
    { id: 'os_echo_roof', age: [18, 100], req: { loc: 'backstreet', anyflag: ['from_outskirts', 'outskirts_born'] }, title: '不会被吹走的屋顶',
      text: '雨落在铁皮屋顶上。你醒来先摸绑棚子的绳，手指碰到的是房东刷过的墙。\n\n楼下有人问你会不会修漏处，听说郊区来的人什么都能凑合用。',
      choices: [
        { t: '按修补面积收钱', check: { s: 'wit', dc: 36 },
          ok: { r: '你找到了松动的接缝，开价时算上垫片。对方付了钱，没再让你顺便修别的东西。', eff: { money: 5000, wit: 1 } },
          no: { r: '补过的地方没漏，水从另一处流下来。你退回一半工钱，踩着湿梯子回房。', eff: { money: 1000, body: -2 } } },
        { t: '拒绝并买根备用绳', r: '你把绳子塞进床边的包。雨声一直没有变，直到天亮，你才慢慢睡过去。', eff: { money: -500, mind: 2 } },
      ] },

    { id: 'os_minor_teeth', age: [18, 100], req: { loc: 'outskirts' }, w: 12,
      text: '捡来的齿轮刚好能给汤锅垫脚。有人说齿距太齐，像是工坊做的；你刮了半天，刮不下齿根夹着的东西，最后把它翻了个面。', eff: { mind: -1 } },
    { id: 'os_minor_receipt', age: [18, 100], req: { loc: 'outskirts' }, w: 12,
      text: '风吹来一张都市饮料店的传单。一杯饮料的价钱，能换营地几天的水。\n\n你把纸翻过来，背面没有字，正好用来记下次交易要带的东西。', eff: { wit: 1 } },
    { id: 'os_minor_seam', age: [18, 100], req: { loc: 'outskirts' }, w: 12,
      text: '你用从废衣上拆下的线补好袖口。几种颜色在腕边接成一圈，其中一截太短，只够打结。吃饭时，那个结总在碗沿上轻轻刮一下。', eff: { mind: 1 } },
    { id: 'os_minor_silence', age: [18, 100], req: { loc: 'outskirts' }, w: 10,
      text: '早上，惯常能听见的滴水声停了。全营地的人都少说了几句话。\n\n午后有人找到裂开的管口，接回一只桶，第一滴落下时，才有人开始洗锅。', eff: { mind: -1 } },
    { id: 'os_minor_marks', age: [18, 100], req: { loc: 'outskirts' }, w: 12,
      text: '交易回来的麻袋印着某家公司的名字。你把它裁成两块门帘，各分到半个字。\n\n夜里有人来借火，站在门口看了一会儿，问这是不是你新起的名字。', eff: { social: 1 } },
    { id: 'os_minor_bowl', age: [18, 100], req: { loc: 'outskirts' }, w: 12,
      text: '营地添了一只没有裂口的碗。大家轮着用它量粮，少了从前那只豁口掉出去的几粒。\n\n你把旧碗收在脚边，用来盛修工具时拆下的螺母。', eff: { money: 500, mind: 1 } },
  ]);

  CITY.addAch({
    os_water_ach: { name: '井绳还在', desc: '封井三年后，为新井重新分配水额。', tier: 'uncommon', group: '郊区', hidden: false, hint: '出资另挖水井，等到需要重排名单的时候。' },
    os_scale_ach: { name: '净重', desc: '揭穿秤砣后，与新粮车按净重完成交易。', tier: 'uncommon', group: '郊区', hidden: false, hint: '记住换粮人的秤与车。' },
    os_keys_ach: { name: '两把钥匙', desc: '公开仓库实数，令两人共同管理仓门。', tier: 'rare', group: '郊区', hidden: true, hint: '记账的人也会被要求改账。' },
    os_pact_ach: { name: '路还能借', desc: '以暂借拾荒路换来邻营的运力。', tier: 'uncommon', group: '郊区', hidden: false, hint: '一顿饭定下的约定，往后还要再谈。' },
    os_relic_ach: { name: '先数现金', desc: '保留遗物多年后，在装箱前收齐货款。', tier: 'rare', group: '郊区', hidden: true, hint: '当年留在盒子上的编号，也许还会有人来问。' },
    os_guide_ach: { name: '折返点', desc: '再次受雇时，坚持让收尾人绕行并按新约结账。', tier: 'rare', group: '郊区', hidden: false, hint: '再有人来问路时，别忘记上次没能走通的地方。' },
    os_stay_ach: { name: '截短的背篓', desc: '年过四十，仍在郊区安排自己的生计。', tier: 'uncommon', group: '郊区', hidden: false, hint: '留在郊区，直到背不动从前的重量。' },
    os_enter_ach: { name: '有了门牌', desc: '成年后从郊区进入都市后巷。', tier: 'common', group: '郊区', hidden: false, hint: '交易的人与搬迁的人，都可能带你进城。' },
  });
})();
