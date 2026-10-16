/* 羁绊：65 个事件，12 个成就。
 * 连锁线：童年分饼 → 十年后帮派／收尾人／翼的旧友 → 三年后的立场冲突。
 * 连锁线：共患难 → 两年后借款 → 三年后还款或背叛 → 两年后葬礼。
 * 连锁线：五种相识 → 次年告白 → 次年结婚 → 十二年纪念 → 白头。
 * 连锁线：争吵 → 两年后修补或离婚 → 三年后的旧地址。
 * 连锁线：伴侣遇害 → 两年后线索 → 三年后的复仇余波。
 * 连锁线：伴侣异状 → 次年求助或扭曲 → 两年后归还遗物。
 * 连锁线：生子 → 两年后养育 → 四年后教育 → 十年后职业选择 → 五年后成年 → 十二年后来信。
 * 连锁线：孩子失踪 → 次年搜寻 → 两年后认领物／生还后的生活。
 * 连锁线：父母老去 → 三年后照护 → 三年后临终 → 次年遗产。
 * 连锁线：手足求助 → 四年后的包裹。
 * 连锁线：家族遗物 → 三年后旧址 → 五年后档案 → 七年后回信。
 */
(function () {
  'use strict';
  // 队列不检查事件 age；阶段条件、关系身份须在 req 内检查。
  const sameUnion = (S) => S.spouse && S.spouse.alive && S.spouse.since === S.vars.lv_union && S.age - S.spouse.since >= 12;
  const trackedChild = S => S.vars.lv_childBorn == null ? null : S.kids.find(k => k.born === S.vars.lv_childBorn);
  const childHere = S => {
    const k = trackedChild(S);
    return !!(k && k.alive && !S.flags.lv_missing);
  };
  const loseChild = S => { const k = trackedChild(S); if (k) k.alive = false; };
  // 每次生育只在尚未跟踪孩子时初始化；后来的手足不重置队列。
  CITY.initLoveChild = S => {
    if (S.vars.lv_childBorn != null || !S.kids.length) return;
    const k = S.kids[0];
    S.vars.lv_childBorn = k.born;
    S.vars.lv_kidName = k.name;
    S.flags.lv_parent = true;
    S.queue.push({ id: 'lv_child_cost', at: Math.max(S.age + 1, k.born + 2) });
  };
  const meet = (S) => { S.vars.lover = CITY.randName(S.rng, S.rng.chance(0.5) ? 'f' : 'm'); };
  CITY.addEvents('love', [
    { id: 'lv_half_bread', age: [6, 11], w: 16, title: '半块饼',
      text: '楼梯拐角总坐着一个和你差不多大的孩子。今天那孩子捧着一块烤焦的饼，没有水，咽得直噎。你手里正好有一瓶水。你们从没问过对方住几楼。',
      choices: [
        { t: '拿水换半块饼', r: '饼掰得一大一小，你们互相推让小的那块，最后都没吃饱。临走前，那孩子问了你的门牌号，用钉子刻在自己的铁杯底下。', eff: { social: 2, flag: 'lv_playmate', queue: ['lv_reunion', 10] } },
        { t: '把水留给自己', r: '你拧紧瓶盖走开了。后来楼梯口换了新锁，你再没碰见那个孩子，也始终不知道对方住在哪层。', eff: { body: 1, mind: -1 } },
      ] },
    { id: 'lv_reunion', manual: true, req: { flag: 'lv_playmate', age: [16, 90] }, title: '杯底的门牌',
      text: '十年后，你排队买面时被人叫住。对方举起一只缺口的铁杯，杯底刻着你小时候的门牌号——是当年分饼的那个孩子。你认得杯子，却认不出这张脸。',
      choices: [
        { t: '问起这些年的去向', res: [
          { w: 4, r: '对方掀开外衣，露出帮派的纹身。面摊老板瞥见了，往你们两人碗里各多加了一勺肉，眼睛始终没敢抬。', eff: { flag: 'lv_friend_gang', social: 2, queue: ['lv_old_debt', 3] } },
          { w: 4, r: '对方亮出收尾人证，证上的照片比本人干净得多。“找不到别的活，才去考的。”说话时，那人手腕上的新绷带还在渗血。', eff: { flag: 'lv_friend_fixer', social: 2, queue: ['lv_old_debt', 3] } },
          { w: 3, r: '对方胸前别着翼的工作证，下意识把它翻了个面。午休只剩七分钟，面来不及吃完，你们只交换了号码。', eff: { flag: 'lv_friend_wing', social: 2, queue: ['lv_old_debt', 3] } },
        ] },
        { t: '请这碗面然后告辞', r: '你替两人付了面钱。对方说下次再聚，你点头答应，却没留下自己现在的住址。', eff: { money: -600, mind: 1 } },
      ] },
    { id: 'lv_old_debt', manual: true, req: { anyflag: ['lv_friend_gang', 'lv_friend_fixer', 'lv_friend_wing'] }, title: '同一条街',
      text: (S) => S.flags.lv_friend_gang ? '三年后，进了帮派的旧友带人堵在你邻居门口，来讨一笔三年前的旧债。邻居缩在门后不敢出声。旧友看见你，先把那只缺口杯塞回了包里。' : S.flags.lv_friend_fixer ? '三年后，当了收尾人的旧友找上门：委托要找的人就住在你这栋楼。对方拿着一张模糊的照片，请你指出是哪扇门。这单的报酬，刚好够那人换一只新义手。' : '三年后，在翼里工作的旧友隔着巢的检查口递来一张名单，上面有一个你熟悉的后巷住址。对方说，只要你确认那户人住哪，自己的合同就能续下去。',
      choices: [
        { t: '帮旧友确认住址', r: '你指出了那扇门。旧友给你转了一笔钱，备注是“面钱”。那户人的窗帘此后再没拉开。', eff: { money: 12000, mind: -4 } },
        { t: '劝旧友换一种办法', check: { s: 'social', dc: 50 }, ok: { r: '旧友沉默很久，只肯宽限一天。你赶去敲门报信时，屋里的人已经在卷被褥，准备连夜搬走。', eff: { social: 3, mind: 1 } }, no: { r: '“你还以为我们在分饼？”旧友收起杯子，把你推到一边。你的肩膀撞在门框上，疼了好几天。', eff: { body: -3, social: -2 } } },
        { t: '提前给住户报信', r: '你借口买烟，从后门递进一张纸。天亮后，那扇门里只剩一只空箱子，旧友的号码也打不通了。', eff: { money: -3000, social: -2, mind: 2 } },
      ] },
    { id: 'lv_shared_rubble', age: [16, 55], w: 9, title: '同一块水泥板',
      text: '街口一场爆炸，把你和一个陌生人压在同一块水泥板下。对方的手还能撑，你的脚还能蹬。外面有人在翻伤者的钱包，脚步越来越近。',
      choices: [
        { t: '配合着挪开水泥板', check: { s: ['body', 'wit'], dc: 40 }, eff: { flag: 'lv_comrade', queue: ['lv_friend_loan', 2] }, ok: { r: '你数到三，两个人一起把板子顶开。爬出来后，对方撕了衣角替你包扎，又问清你住在哪，说改天来看你。', eff: { body: -2, social: 3 } }, no: { r: '板子没顶开，你的脚先脱了臼。对方硬把你拖进水沟，两人躲到清晨才敢出来，互相搀着去诊所接了骨。', eff: { body: -5, money: -8000, social: 2 } } },
        { t: '扔出钱包求人搬板', res: [
          { w: 3, r: '外面的人拿走钱包，顺手撬开板子把你拽了出去。没人管另一头的陌生人，那只手还朝你伸着。', eff: { money: '-30%', mind: -3 } },
          { w: 2, r: '那人拿走钱包就走了，没有回头。你们一直被压到下午才被人挖出来，谁也没力气问对方的名字。', eff: { money: '-30%', body: -4 } },
        ] },
      ] },
    { id: 'lv_friend_loan', manual: true, req: { flag: 'lv_comrade' }, title: '借条背面',
      text: '两年后，当年一起从水泥板下爬出来的朋友敲开你的门，想借两万眼，说是替家里还债。对方站在门链外不肯进屋，眼睛一直盯着地面。',
      choices: [
        { t: '借出两万眼', r: '你让对方写了借条和还款日期。那人一笔一画写得很慢，按完手印，说三年内一定还上。', eff: { money: -20000, flag: 'lv_lent', queue: ['lv_loan_due', 3] } },
        { t: '给两千眼不写借条', r: '对方接过钱，道了谢，始终没有进屋。门链被拉直又放松的那一声，你记了很久。', eff: { money: -2000, mind: -1, queue: ['lv_friend_funeral', 5] } },
        { t: '留下钱付自己的房租', r: '你说自己也快交不上房租了。对方点点头，没再多说，转身去敲隔壁的门。', eff: { social: -1 } },
      ] },
    { id: 'lv_loan_due', manual: true, req: { flag: 'lv_lent' }, title: '到期的号码',
      text: '还款日过了一个月，朋友终于接了电话。听筒那头还有别人在念你的住址。朋友说那是替自己送钱的人，叫你今晚在家等着，别出门。',
      choices: [
        { t: '在家等那笔钱', res: [
          { w: 3, r: '敲门的是个跑腿的孩子，递来一个信封。里面有两万两千眼，连本带息，还多塞了一把零钱。', eff: { money: 22000, mind: 3, ach: 'lv_repaid', queue: ['lv_friend_funeral', 2] } },
          { w: 2, r: '半夜门被踹开，闯进来的人里就有你的朋友。对方翻走了你的积蓄，从头到尾没看你一眼。', eff: { money: '-35%', body: -4, mind: -6, flag: 'lv_betrayed', queue: ['lv_friend_funeral', 2] } },
        ] },
        { t: '查清送款人的身份', check: { s: 'wit', dc: 45 }, ok: { r: '你追问送钱的人叫什么，问到第三遍，电话断了。你连夜躲去别处。天亮后朋友发来一句“别回去”，从此再没提那笔钱。', eff: { money: -3000, mind: -2, flag: 'lv_betrayed', queue: ['lv_friend_funeral', 2] } }, no: { r: '你没问出什么，想从前门溜走，却在楼梯下撞见几个等着的人。朋友站在最后面，当着你的面把借条揉成了一团。', eff: { money: -12000, body: -3, flag: 'lv_betrayed', queue: ['lv_friend_funeral', 2] } } },
      ] },
    { id: 'lv_friend_funeral', manual: true, title: '凑出来的葬礼',
      text: '那位患难的朋友死了，消息是从你们当年接骨的诊所传来的。来吊唁的人各自带了一只纸杯，凑起来刚好一桌。葬礼的钱还没凑齐，遗照下摆着一只募捐的铁盒。',
      choices: [
        { t: '补上葬礼缺的钱', r: '你把钱放进铁盒，葬礼总算能办完。散席时，你只带走了自己用过的那只纸杯。', eff: { money: -10000, mind: -2, ach: 'lv_paper_cup' } },
        { t: '留到最后再走', r: '别人都走了，你留下来帮忙折桌子、扫地。取下遗照时你才看清，照片里的人穿着那天从废墟里爬出来时的外套。', eff: { mind: -3, social: 1, ach: 'lv_paper_cup' } },
      ] },
    { id: 'lv_meet_office', age: [18, 48], req: { job: 'fixer', spouse: false, noflag: 'lv_interest' }, w: 15 * 4, title: '备用绷带',
      text: '你带着伤回到事务所，药箱里最后一卷绷带已经被人用掉了。可你桌上多了一卷新的，压着一张便条：“下回至少把血擦了再坐沙发。”是一位同事的字。',
      choices: [
        { t: '请同事吃一顿夜饭', r: '你们挑了离事务所最近的面摊。对方先检查了你的伤口，才拆开筷子，面一直泡到发软。', eff: { money: -1500, flag: 'lv_interest', fn: meet, queue: ['lv_confess', 1] } },
        { t: '买两卷绷带归还', r: '你把绷带锁进公用药箱。那张便条也一起放进去，后来被拿来记止血药的缺货数量。', eff: { money: -800, skill: 1 } },
      ] },
    { id: 'lv_meet_client', age: [18, 50], req: { job: ['fixer', 'mech', 'doctor'], spouse: false, noflag: 'lv_interest' }, w: 11 * 4, title: '结清之后',
      text: '一位已经结清账的客户，把外套忘在了你这里，几天后才来取。对方站在门口，先问你几点下班，又说外套其实不急着拿。你听懂了这句话。',
      choices: [
        { t: '约在下班后交还', r: '你把外套带到路口，对方却穿了件更薄的。你们在关门前的店里坐了一小时，各买一杯热水。', eff: { mind: 1, flag: 'lv_interest', fn: meet, queue: ['lv_confess', 1] } },
        { t: '请人把外套送回', r: '你托跑腿的把外套送了回去。之后再见面，你们只谈正事，对方没有再落下任何东西。', eff: { money: -500, mind: 1 } },
      ] },
    { id: 'lv_meet_regular', age: [18, 48], req: { job: ['shop', 'chef'], spouse: false, noflag: 'lv_interest' }, w: 15 * 4, title: '最后一桌',
      text: '有个常客连着几周都坐最后一桌，点同样便宜的东西。今天店里停电，对方举着一盏缠满胶布的小灯，替你照着数零钱，顺口问你明天休不休息。',
      choices: [
        { t: '约对方明天去修灯', r: '修灯的钱比灯还贵。你们各出一半，修灯师傅问灯归谁，两个人同时指向对方，师傅笑出了声。', eff: { money: -1200, flag: 'lv_interest', fn: meet, queue: ['lv_confess', 1] } },
        { t: '照常送客关店', r: '你借灯照完最后一枚硬币，再递回去。常客第二天没来，桌上的水杯也少洗了一只。', eff: { money: 600, mind: -1 } },
      ] },
    { id: 'lv_meet_nest', age: [20, 50], req: { loc: 'nest', spouse: false, noflag: 'lv_interest' }, w: 13 * 4, title: '相亲附件',
      text: '巢里的相亲，介绍人订的桌子只能坐四十分钟。对方一坐下，就把自己的负债证明压在菜单上，等你也拿出一份。服务员来点菜时，你们同时翻到了最便宜的那页。',
      choices: [
        { t: '如实交换债务记录', r: '对方看完数字，先问你的还款日是哪天。你们商量着错开约饭的日期，免得月底都拿不出钱。', eff: { money: -1800, flag: 'lv_interest', fn: meet, queue: ['lv_confess', 1] } },
        { t: '付清自己的茶钱离席', r: '你说了声抱歉，起身离开，介绍费一分没少。对方低头喝着茶，没有拦你。', eff: { money: -2500, mind: -1 } },
      ] },
    { id: 'lv_meet_night', age: [18, 48], req: { loc: 'backstreet', spouse: false, noflag: 'lv_interest' }, w: 14 * 4, title: '三点十二分',
      text: '凌晨三点十二分，后巷深宵就要开始。你和一个陌生人同时挤进一间出租屋，房东收了钱就锁死了门。屋里没有椅子，对方把唯一的箱子推给你，自己用背抵住摇晃的门。',
      choices: [
        { t: '一起守到深宵结束', r: '你们轮流贴着门听外面的动静，谁也没合眼。天亮后，对方把号码写在你手背上。你一路攥着拳头回家，怕汗把字洇掉。', eff: { money: -3000, mind: -1, flag: 'lv_interest', fn: meet, queue: ['lv_confess', 1] } },
        { t: '付自己那份就走', r: '外面一安静，你就付了自己那份钱，开门离开。对方仍靠在门上，朝你点了点头，没问你的名字。', eff: { money: -1500, mind: -2 } },
      ] },
    { id: 'lv_confess', manual: true, req: { flag: 'lv_interest', spouse: false }, title: '多配一把钥匙',
      text: '你和{lover}认识一年了。路过配钥匙的摊位时，你想起对方每次都站在你家门口，提着快凉掉的饭，等你摸出钥匙。也许该多配一把了。',
      choices: [
        { t: '问愿不愿意一起住', check: { s: 'social', dc: 40 }, ok: { r: '{lover}没说话，直接把自己的钥匙圈递了过来。圈上早就空出了一个位置。你们搬到了一起。', eff: { money: -2000, flag: 'lv_engaged', queue: ['lv_wedding', 1] } }, no: { r: '{lover}说还没想好。那天你什么也没配。此后你们见面越来越少，慢慢就断了联系。', eff: { mind: -3, unflag: 'lv_interest' } } },
        { t: '继续各住各的', r: '你只问了晚饭吃什么。后来你们的班次错开，饭盒在门口放了一夜，谁也没再提起钥匙。', eff: { mind: 1, unflag: 'lv_interest' } },
      ] },
    { id: 'lv_wedding', manual: true, req: { flag: 'lv_engaged', spouse: false }, title: '两张签名',
      text: '你和{lover}决定结婚。两人坐在借来的折叠桌前填登记表，借来的笔只剩一点墨。窗外有人吆喝着卖烤肠，你们算了算，办一桌小宴要花掉不少积蓄。',
      choices: [
        { t: '登记并办一桌小宴', r: '你们把名字写在同一张纸上。墨水断了一次，后半个字是对方替你描深的，纸边留着一粒米。', eff: { money: -18000, spouse: 'new', flag: ['married', 'lv_marriage'], unflag: ['lv_interest', 'lv_engaged', 'lv_spouse_pros', 'lv_help'], ach: 'lv_two_names', fn: (S) => { S.vars.lv_union = S.spouse.since; }, next: 'lv_wedding_fee', queue: ['lv_anniversary', 12] } },
        { t: '推迟两年再结', r: '你们把空白的登记表带回家，压在枕头底下。钱得先留着过日子，桌子和那支笔都还了回去。', eff: { mind: -1, queue: ['lv_wedding', 2] } },
        { t: '就此分开', r: '订好的场地只退回一半定金。对方把那把一起配的钥匙放在桌上，没说再见就走了。', eff: { money: -4000, mind: -4, unflag: ['lv_interest', 'lv_engaged'] } },
      ] },
    { id: 'lv_wedding_fee', manual: true, req: { spouse: true }, title: '门口加的一席',
      text: '婚宴刚端上热汤，三个收保护费的帮派成员挤进门来。领头的说，新成了家，就得另交一份。{spouse}悄悄把登记表收进衣服里，桌上的汤还冒着热气。',
      choices: [
        { t: '付钱让他们离开', r: '你们付了钱，那几人又顺走一瓶酒才走。{spouse}重新热了两碗汤，原来那两碗已经凉透了。', eff: { money: -12000, mind: -2 } },
        { t: '拿旧租约谈价', check: { s: 'social', dc: 50 }, ok: { r: '你说这栋楼的房东已经替全楼交过这一季。领头的只收了点酒钱，临走顺走一盘肉，桌边空出三个位子。', eff: { money: -2000, social: 2 } }, no: { r: '领头的把你的租约按进汤碗里。你只好补足了钱，{spouse}用餐巾吸干租约上的汤水，印章还是晕开了一角。', eff: { money: -18000, mind: -3 } } },
      ] },
    { id: 'lv_anniversary', manual: true, req: { spouse: true, notused: 'lv_anniversary', fn: sameUnion }, title: '十二年的租约',
      text: '你和{spouse}结婚整整十二年了。房东换过好几任，你们一直住在一起。{sta}忽然说起婚礼那天被顺走的那盘肉，说自己一口都没吃上。',
      choices: [
        { t: '买回那天没吃到的肉', r: '肉比记忆里薄了些。{spouse}把肥的部分拨到你碗里，你又拨回去，最后两个人各吃了一半。', eff: { money: -2400, mind: 4, ach: 'lv_twelve_leases' } },
        { t: '把钱存进医药信封', r: '{spouse}在信封上写下今天的日期，把钱塞了进去。你们热了剩饭，就着窗外的雨声吃完了。', eff: { mind: 2, social: 1 } },
      ] },
    { id: 'lv_shared_shift', age: [20, 70], req: { spouse: true }, w: 12, repeat: true, cd: 6,
      text: '{spouse}这周上夜班，你上白班，两人碰不上面，只能靠门口的饭盒传纸条，越写越短。今天饭盒里只有“盐没了”三个字，旁边多放了一颗剥好的鸡蛋。', eff: { money: -1500, mind: 1 } },
    { id: 'lv_joint_debt', age: [20, 65], req: { spouse: true }, w: 9, title: '共同签字人',
      text: '{spouse}找到一份收入更高的工作，但对方要先收六万眼押金，得去借贷，还要你一起签字担保。你看见{sta}已经把旧工作服上的名牌拆了下来。',
      choices: [
        { t: '承担一半押金', res: [
          { w: 4, r: '新工作是真的，按时发薪，只是没有招工广告上写的那么多。{spouse}领到第一笔钱那天，买回一小袋橘子。', eff: { money: -10000, mind: 2 } },
          { w: 2, r: '招工处是个骗局，一夜之间人去楼空。你们轮流拨那个空号，押金没了，借来的钱还得照还。', eff: { money: -30000, mind: -4 } },
        ] },
        { t: '请对方暂缓辞工', check: { s: 'social', dc: 40 }, ok: { r: '{spouse}把名牌缝了回去。你们商量到半夜，决定先自己攒够一半，再考虑借钱。', eff: { mind: 1, money: -2000 } }, no: { r: '{spouse}没有再提贷款，也没有把名牌缝回去。晚饭少了一份，两个人都说自己不饿。', eff: { mind: -3, social: -1 } } },
      ] },
    { id: 'lv_quarrel', age: [22, 65], req: { spouse: true }, w: 10, title: '没带回来的钱',
      text: '{spouse}发现家里少了一笔钱，问你花到哪去了。你们越吵越凶，早就不是为了那点钱。灶上的锅烧干了，两个人都看见了，谁也不肯先去关火。',
      choices: [
        { t: '关火后把账讲清楚', check: { s: ['mind', 'social'], dc: 40 }, eff: { fn: (S) => { S.vars.lv_quarrelUnion = S.spouse.since; }, queue: ['lv_mend', 2] }, ok: { r: '你关了火，把那笔钱的去向一五一十说清。{spouse}没说原谅，只把空锅泡进水里，给你让出了洗锅的位置。', eff: { mind: -1 } }, no: { r: '话越解释越像借口。{spouse}转身去关火，你听见锅底碰到水池，声音比刚才的争吵还响。', eff: { mind: -4 } } },
        { t: '收拾东西搬出去', r: '你装走两件衣服就出了门，这段婚姻到此为止。楼梯灯坏了，你摸着墙下楼，才发现钥匙还攥在手里。', eff: { spouse: 'leave', flag: 'divorced', money: -8000, mind: -5, queue: ['lv_old_address', 3] } },
      ] },
    { id: 'lv_mend', manual: true, req: { spouse: true, fn: (S) => S.spouse.since === S.vars.lv_quarrelUnion }, title: '拆开的袖口',
      text: '那次争吵过去两年了，你们之间一直隔着点什么。今天{sta}坐在灯下拆旧衣服的袖口，忽然问你：下次换房，要不要找一间能放下两把椅子的屋子？',
      choices: [
        { t: '一起挑房并补好袖口', r: '你们挑了一间稍贵的房子。搬家那天，{spouse}先把补好袖口的衣服挂进新衣柜，两把椅子并排摆在窗边。', eff: { money: -12000, mind: 3, ach: 'lv_mended' } },
        { t: '提出各找各的住处', r: '{spouse}把针插回线轴，点了点头。你们分了家当，连那两把旧椅子也一人一把。', eff: { spouse: 'leave', flag: 'divorced', money: -5000, mind: -3, queue: ['lv_old_address', 3] } },
      ] },
    { id: 'lv_old_address', manual: true, req: { flag: 'divorced' },
      text: '离婚三年后，前任托人把一个纸包转给你，里面是你落下的半卷缝衣线。纸上没有问候，只写着“别再寄到这里”。你付了跑腿钱，把那个旧地址从本子上划掉了。', eff: { money: -600, mind: -2 } },
    { id: 'lv_prosthetic', age: [22, 70], req: { spouse: true }, w: 9, title: '试用的手',
      text: '{spouse}的手受伤后一直发抖，做不了工。工坊让{sta}试戴了一只义手，握杯子稳稳当当。师傅说，带保修的新款最贵，翻新旧款便宜一半，不装的话也可以去诊所慢慢做康复。',
      choices: [
        { t: '买下有保修的义手', r: '{spouse}第一次用新手替你拧瓶盖，力道没收住，把盖子捏裂了。两人对着碎盖子愣了一会儿，一起笑出了声。', eff: { money: -65000, mind: 3, flag: 'lv_spouse_pros', fn: S => { S.vars.lv_prosSpouse = S.spouse.name; S.vars.lv_prosSince = S.spouse.since; } } },
        { t: '选翻新的旧款', res: [
          { w: 4, r: '旧义手偶尔嗡嗡作响，好在能拿稳工具。夜里你常被那阵嗡鸣吵醒，听着听着，又睡着了。', eff: { money: -25000, mind: 1, flag: 'lv_spouse_pros', fn: S => { S.vars.lv_prosSpouse = S.spouse.name; S.vars.lv_prosSince = S.spouse.since; } } },
          { w: 2, r: '接头很快松了。{spouse}拆下义手放回盒里，工坊却说外壳划伤，不能按原价退货。', eff: { money: -25000, mind: -3 } },
        ] },
        { t: '先支付康复诊疗费', r: '你陪{spouse}每周去一次诊所。练习夹豆子的碗带回了家，晚上吃饭时仍会用到。', eff: { money: -12000, mind: -1 } },
      ] },
    { id: 'lv_murder', age: [25, 65], req: { spouse: true }, w: 2, star: true, title: '认领通知',
      text: '{spouse}死了。通知上说，有人寻仇认错了人。你去领回一袋遗物，衣服口袋里还装着替你买的药。袋子上贴的名字，还写错了一个字。',
      eff: { spouse: 'die', mind: -9, dist: 5 },
      choices: [
        { t: '保留证物追查', r: '你花钱托人弄来现场记录，上面写着凶手真正要找的那户人的门牌。你把记录和那包药放在一起，药一直没拆。', eff: { money: -12000, flag: 'lv_vengeance', queue: ['lv_murder_trace', 2] } },
        { t: '领回遗物后搬家', r: '你让人改正了袋子上的名字，然后搬了家。那包药和那只常用的碗装在同一个箱子里，新屋的柜子比从前窄了一半。', eff: { money: -8000, mind: -2 } },
      ] },
    { id: 'lv_murder_trace', manual: true, req: { flag: 'lv_vengeance' }, title: '没有涂掉的名字',
      text: '两年后，你托的收尾人查到了凶手的住处。对方说，凶手把杀错人这件事当作“已经了结”。报告末页列着几个被划掉的名字，都是凶手处理过的人，最下面一行是你的名字。',
      choices: [
        { t: '雇人讨回这笔血债', res: [
          { w: 3, r: '几天后，收尾人给你看了一张照片，只拍到一双鞋和一片地板。“办完了。”对方说完，此后不再回答任何关于这个人的问题。', eff: { money: -90000, mind: -3, flag: 'lv_revenge_paid', queue: ['lv_revenge_echo', 3] } },
          { w: 2, r: '收尾人退回一半定金，说凶手背后有人，不能再追。报告被收走了，你手里只剩一份被涂黑大半的复印件。', eff: { money: -45000, mind: -5, queue: ['lv_revenge_echo', 3] } },
        ] },
        { t: '自己去核实地址', check: { s: ['skill', 'wit'], dc: 65 }, ok: { r: '你在那扇门外守了六天，终于等到穿那双鞋的人。你离开时，那人倒在门内，鞋尖朝着屋里。你没有回头。', eff: { body: -4, mind: -5, flag: ['killed', 'lv_revenge_paid'], queue: ['lv_revenge_echo', 3] } }, no: { r: '门后等着不止一个人。你丢下武器才逃出去，复印件上的地址被自己的血浸得看不清了。', eff: { body: -12, money: -15000, mind: -5, queue: ['lv_revenge_echo', 3] } } },
        { t: '封起报告停止追查', r: '你把报告装进档案袋，写上日期，不再追了。收尾人没有劝你，临走前把末页上你的名字撕了下来。', eff: { money: -6000, mind: 1, queue: ['lv_revenge_echo', 3] } },
      ] },
    { id: 'lv_revenge_echo', manual: true, req: { flag: 'lv_vengeance' },
      text: '又过了三年，诊所打来电话，问那种药还要不要照旧每月寄。你这才知道，那包药是长期替你订下的。电话那头等着你回答，你最后只请对方把收件人改成自己的名字。', eff: { mind: -2, ach: 'lv_closed_account' } },
    { id: 'lv_wrong_voice', age: [22, 68], req: { spouse: true, era: 'dist' }, w: 5, title: '门后的低语',
      text: '{spouse}开始对着一部早已断线的旧电话说话，一说就是半夜。{sta}说电话那头的人答应了，家里再也不用为钱发愁。那截断线被攥得发黑。你知道，这可能是扭曲的前兆。',
      choices: [
        { t: '请人陪着寻求诊疗', r: '候诊时，{spouse}一直攥着那截断线。医生开了药，让你留下联络方式，说夜里出事就立刻打电话，但诊所不会派人上门。', eff: { money: -22000, flag: 'lv_help', fn: (S) => { S.vars.lv_voiceUnion = S.spouse.since; }, queue: ['lv_voice_end', 1] } },
        { t: '请假在家陪伴', r: '你把工作日划掉一整排。{spouse}愿意吃饭，却仍替电话另一头留着一把椅子，不许你挪动。', eff: { money: -12000, mind: -3, fn: (S) => { S.vars.lv_voiceUnion = S.spouse.since; }, queue: ['lv_voice_end', 1] } },
      ] },
    { id: 'lv_voice_end', manual: true, req: { spouse: true, era: 'dist', fn: (S) => S.spouse.since === S.vars.lv_voiceUnion }, title: '没付出的代价',
      text: '一年后的夜里，{spouse}把旧电话抱到桌边，说这是最后一通了。{sta}的影子顺着桌腿往上爬，已经不像人的形状。你喊了一声名字，听筒里也传出了你的声音。',
      choices: [
        { t: '反复叫名字等候回应', check: { s: ['mind', 'social'], dc: 55, mod: (S) => S.flags.lv_help ? 0.15 : 0 }, ok: { r: '{spouse}终于松开电话，问你为什么没去上班。那把多余的椅子搬走了，墙上的影子仍留了很久。', eff: { mind: -4, money: -18000, ach: 'lv_answered' } }, no: { r: '电话壳裂开，里面挤出不属于人的肢体。你被赶来的人拖出门外。隔着封条，你还能听见它用那个熟悉的声音说话。', eff: { spouse: 'die', mind: -10, dist: 7, queue: ['lv_returned_phone', 2] } } },
        { t: '撤出房间请人封锁', r: '你退出房间，花钱请收尾人来处理。对方不肯承诺能带回谁。事后他们还回来的只有几件物品，没有人。', eff: { spouse: 'die', money: -40000, mind: -7, queue: ['lv_returned_phone', 2] } },
      ] },
    { id: 'lv_returned_phone', manual: true,
      text: '两年后，有人把那只空电话壳送还给你，说是清场时留下的遗物，要你付保管费。你摇了摇，里面掉出一枚旧纽扣，是你从前替对方缝过好几回的那颗。', eff: { money: -3000, mind: -3 } },
    { id: 'lv_gray_hair', age: [55, 100], req: { spouse: true, fn: (S) => S.age - S.spouse.since >= 30 }, w: 18, star: true,
      text: '你替{spouse}剪去耳边的白发。三十多年里，镜子换过，剪刀换过，{sta}仍嫌你剪得太短。地上的碎发扫进同一只簸箕，晚饭的水正好烧开。', eff: { mind: 5, ach: 'lv_gray_together' } },
    { id: 'lv_spouse_last', age: [65, 100], req: { spouse: true, fn: (S) => S.age - S.spouse.since >= 20 }, w: 3, star: true, title: '另一边的床',
      text: '{spouse}病了很久，已经起不来床。床边摆着温水和小药盒，{sta}嫌你把药分得太细，又忽然问起你们第一次见面那天吃了什么。窗外的送货车照常停在楼下。',
      choices: [
        { t: '停工陪完最后几天', r: '你讲完那顿饭，水也凉了。医生来时，你还握着另一只手，药盒里整整齐齐剩着明天的份。', eff: { spouse: 'die', money: -20000, mind: -7 } },
        { t: '付钱请人轮班照护', r: '你请了照护员轮班，自己照常上工。最后那天你赶回来时，人已经走了，照护员把水杯洗净，放在了床头。', eff: { spouse: 'die', money: -35000, mind: -5 } },
      ] },
    { id: 'lv_birth', age: [21, 45], force: true, req: { spouse: true, nojob: ['distorted', 'book'], kids: [0, 0], fn: (S) => S.rng.chance(0.5) }, w: 70, title: '第三份口粮',
      text: '你和{spouse}商量要不要一个孩子。诊所报了从检查到生产的全部价钱，不便宜。回家路上，{sta}在旧货摊前停下，看了很久一张没有床垫的小床。',
      choices: [
        { t: '筹钱迎接孩子', r: '几个月后，小床搬进屋里。哭声响起来时，你们才发现量错了门宽，床再也没法完整地抬出去。', eff: { money: -28000, kid: 1, fn: S => CITY.initLoveChild(S) } },
        { t: '先还清眼前的欠款', r: '你们决定先不要孩子，没有买那张床。之后每次路过旧货摊，{spouse}都会加快脚步。', eff: { money: -2000, mind: -1 } },
      ] },
    { id: 'lv_child_cost', manual: true, req: { kids: [1, null], fn: childHere }, title: '长得太快',
      text: '{lv_kidName}两岁了，去年的鞋已经穿不下。房租和看病的钱又各涨了一回，你把自己的午饭省掉，还是凑不够一双新鞋。',
      choices: [
        { t: '接额外的夜工', r: '你回家时，孩子已经睡了。新鞋摆在床边，鞋尖塞着纸，家里说这样还能再多穿一阵。', eff: { money: 8000, body: -3, mind: -2, queue: ['lv_school', 4] } },
        { t: '买旧鞋保住休息时间', r: '你洗掉鞋垫上原来的名字，再写上新的。{lv_kidName}追着晾鞋的绳子跑，傍晚才肯让你取下来。', eff: { money: -5000, mind: 2, queue: ['lv_school', 4] } },
      ] },
    { id: 'lv_school', manual: true, req: { kids: [1, null], fn: childHere }, title: '入学的地址栏',
      text: '{lv_kidName}到了上学的年纪。巢里的学校要查住址，学费很贵；后巷的教室挤在铺子楼上，便宜但简陋。孩子拿着两张招生广告，只问哪张背面能画画。',
      choices: [
        { t: '申请巢内学校', req: { loc: 'nest', money: [60000, null] }, r: '学校终于收下了孩子。开学那天，{lv_kidName}捧着新书一页页地翻，惊讶地告诉你，一页都没缺。', eff: { money: -60000, flag: 'lv_school_nest', queue: ['lv_child_dream', 10] } },
        { t: '送进后巷教室', r: '你付钱买了一把能折起的椅子。孩子每天自己带去，放学后带回来，椅背很快刻满了算式。', eff: { money: -10000, flag: 'lv_school_street', queue: ['lv_child_dream', 10] } },
        { t: '在家教字并找学徒位置', r: '你用送货单教字，熟人答应让孩子大些再进店。纸上的“欠款”两字学得最快，也最先会写。', eff: { money: -3000, mind: -2, flag: 'lv_school_home', queue: ['lv_child_dream', 10] } },
      ] },
    { id: 'lv_school_bill', age: [28, 65], req: { kids: [1, null], anyflag: ['lv_school_nest', 'lv_school_street'], fn: (S) => childHere(S) && S.age - S.vars.lv_childBorn < 16 }, w: 10, title: '课外收费',
      text: '{lv_kidName}带回一张额外收费通知，要求明天交钱。你问不交会怎样，孩子把书包放到椅子底下，说老师会安排去另一间教室，那里不用带书。',
      choices: [
        { t: '挤出钱补交', r: '第二天孩子仍带着书去上课。晚饭少了一道菜，你说是店里卖光了，孩子把通知揉进了口袋。', eff: { money: -8000, mind: -1 } },
        { t: '去找校方核对项目', check: { s: 'wit', dc: 45 }, ok: { r: '通知抄错了名单，学校退掉大半费用。你等了半天，孩子一直坐在走廊里替你抱着外套。', eff: { money: -1000, wit: 2 } }, no: { r: '每个收费项目都有一枚章。你没能争下来，回家时，孩子已经把书重新包好了封皮。', eff: { money: -9000, mind: -2 } } },
      ] },
    { id: 'lv_child_ampule', age: [23, 65], req: { kids: [1, null], fn: (S) => childHere(S) && S.age - S.vars.lv_childBorn < 16 }, w: 8, title: '玻璃里的价钱',
      text: '{lv_kidName}被坠落的铁架压伤了腿。医生把一支K公司的HP安瓿摆在灯下，报了价，说钱到了才开封。孩子盯着里面的液体，以为你们在挑饮料。',
      choices: [
        { t: '支付安瓿和处置费用', r: '药液推进去，伤口当晚就合上了。孩子醒来先找那只空玻璃管，非要攥在手里才肯睡。', eff: { money: -70000, mind: 2, ach: 'lv_empty_ampule' } },
        { t: '接受普通手术慢慢养伤', res: [
          { w: 5, r: '石膏拆掉后，孩子走路仍有些跛。你把门槛削低，木屑扫了几遍，屋里还是留着新木头味。', eff: { money: -18000, mind: -2 } },
          { w: 1, r: '伤口一直不见好，又做了两次手术。最后一次，医生没有让你进去。你带回家的只有一只小鞋。', eff: { money: -24000, fn: loseChild, mind: -10, dist: 4, queue: ['lv_child_memorial', 2] } },
        ] },
      ] },
    { id: 'lv_child_dream', manual: true, req: { kids: [1, null], fn: childHere }, title: '想考的证',
      text: '{lv_kidName}把收尾人资格的资料放到桌上，说满十八岁就去考。孩子比划了一下广告里那把武器，手指碰倒水杯，赶紧先拿布擦干纸。',
      choices: [
        { t: '出钱找人教基本功', r: '教练先教孩子怎么搬伤员，半个月都没让碰刀。到了第二个月，孩子不再照着广告摆姿势了。', eff: { money: -28000, flag: 'lv_child_fixer', queue: ['lv_child_adult', 5] } },
        { t: '介绍一份工坊学徒工作', check: { s: 'social', dc: 45 }, ok: { r: '孩子答应先做一段时间。第一笔工钱买了护目镜，那份资格资料仍放在抽屉最上层。', eff: { money: -8000, flag: 'lv_child_trade', queue: ['lv_child_adult', 5] } }, no: { r: '介绍人收了钱却没给位置。孩子收起资料，开始自己找事务所，你只能再付一套护具的钱。', eff: { money: -16000, mind: -3, flag: 'lv_child_fixer', queue: ['lv_child_adult', 5] } } },
        { t: '让孩子自己决定', res: [
          { w: 3, r: '孩子把资料带走了，留下当天的晚饭钱。此后每次回家，鞋底都比上一次磨得更薄。', eff: { mind: -2, flag: 'lv_child_fixer', queue: ['lv_child_adult', 5] } },
          { w: 3, r: '孩子后来收起了资料，找了份搬货的工。你没问是不是因为钱，桌上也再没出现那张武器广告。', eff: { mind: 1, flag: 'lv_child_trade', queue: ['lv_child_adult', 5] } },
        ] },
      ] },
    { id: 'lv_child_adult', manual: true, req: { kids: [1, null], fn: childHere }, title: '自己的门牌',
      text: (S) => S.flags.lv_child_fixer ? '{lv_kidName}拿着新收尾人证回家，证上的照片拍得很紧张。孩子说租到了事务所附近的房间，临走先检查了你门上的插销。' : '{lv_kidName}带回第一张长期工作合同，手指上有洗不净的油。孩子已经租好房，把新地址抄给你，纸条背面还列着缺少的锅碗。',
      choices: [
        { t: '出钱添一套锅碗', r: '你把锅裹进旧被单，送到那个窄得转不开身的屋子。孩子请你留下吃饭，锅里的水烧了很久。', eff: { money: -10000, mind: 4, flag: 'lv_child_grown', queue: ['lv_child_letter', 12] } },
        { t: '把攒下的钱交给孩子', r: '钱不多，每张都摊得很平。孩子只拿走一半，把另一半塞回你的药盒底下，没有让你站起来送。', eff: { money: -5000, mind: 2, flag: 'lv_child_grown', queue: ['lv_child_letter', 12] } },
      ] },
    { id: 'lv_child_letter', manual: true, req: { kids: [1, null], fn: childHere },
      text: '搬走十二年后，{lv_kidName}寄来一张汇款单。附言先写工作，划掉，又写“按时吃饭”。你认出那个写歪的字，和从前送货单背面的一样，墨水也洇了一点。', eff: { money: 18000, mind: 4, ach: 'lv_return_address' } },
    { id: 'lv_child_missing', age: [30, 70], req: { kids: [1, null], fn: (S) => childHere(S) && S.age - S.vars.lv_childBorn >= 8 }, w: 3, star: true, title: '空着的鞋架',
      text: '{lv_kidName}没有按说好的时间回家。你找到最后那家店，老板只记得有辆车停过。门口贴满寻人纸，新贴的一层盖住了旧照片的半张脸。', eff: { flag: 'lv_missing', mind: -5 },
      choices: [
        { t: '雇事务所沿途查找', r: '接待人按时间计费，问你要查到哪一天。你把所有零钱倒在桌上，让对方先写一个星期。', eff: { money: -40000, flag: 'lv_search_paid', queue: ['lv_child_search', 1] } },
        { t: '自己拿照片逐户问', r: '你把照片包进透明袋，免得被雨打坏。走到第三条街时，照片上的笑脸已被手指挡住了一半。', eff: { money: -5000, body: -3, queue: ['lv_child_search', 1] } },
      ] },
    { id: 'lv_child_search', manual: true, req: { flag: 'lv_missing', fn: S => { const k = trackedChild(S); return !!(k && k.alive); } }, title: '一年的路',
      text: '找了整整一年，有人给你看一张货仓的照片。门边有一只你认得的鞋，却没拍到人。送照片的人说，要先收钱，才告诉你货仓在哪。',
      choices: [
        { t: '带人去核实货仓', check: { s: ['social', 'wit'], dc: 45, mod: (S) => S.flags.lv_search_paid ? 0.15 : 0 }, eff: { money: -15000, unflag: 'lv_missing' }, ok: { r: '孩子缩在仓后，听见你的声音才抬头。回家的车上，{lv_kidName}一直攥着车门，你替孩子扣了两次安全带。', eff: { mind: 5, flag: 'lv_found', ach: 'lv_found_again' } }, no: { r: '货仓里只剩几包封好的遗物和一张死亡登记。你翻开那只鞋，鞋里缝着的，正是你亲手写上的名字。', eff: { fn: loseChild, mind: -10, dist: 5, queue: ['lv_child_memorial', 2] } } },
        { t: '把材料交给登记处等候', r: '登记处收下材料，没说要等多久。你回家等着，此后电话每响一次，你都要先深吸一口气。', eff: { money: -2000, queue: ['lv_missing_parcel', 2] } },
      ] },
    { id: 'lv_missing_parcel', manual: true, req: { flag: 'lv_missing' },
      text: '两年后，登记处寄来一袋认不出主人的物品，让你自己辨认。你一件件摊开，没有一件像孩子用过的。你把袋子退了回去，门边的鞋架仍空着一格。', eff: { mind: -4 } },
    { id: 'lv_found_silence', age: [30, 80], req: { flag: 'lv_found', kids: [1, null], fn: childHere }, w: 12, title: '不问的那一年',
      text: '{lv_kidName}回来后不肯关灯。你路过房门，总能听见门锁被反复试开。今天灯泡烧坏了，孩子拿着它站在走廊，迟迟没有往暗处走。',
      choices: [
        { t: '换灯并付钱请人疏导', r: '孩子没有讲货仓里的事，只开始肯独自去买灯泡。你把备用的一只放在门口，纸盒没有封上。', eff: { money: -14000, mind: 2 } },
        { t: '搬床到门外陪住', r: '你的背被折叠床硌得发疼。几周后，孩子第一次替你关掉走廊灯，却把房门留着一条缝。', eff: { body: -2, mind: 1 } },
      ] },
    { id: 'lv_child_memorial', manual: true,
      text: '两年后，你清理柜子，翻出一只没配对的小鞋。鞋里塞着一团揉紧的纸，展开是孩子画的一只歪歪扭扭的猫。你把纸折回原样，放回去时没再塞得那么紧。', eff: { mind: -4 } },
    { id: 'lv_child_late_visit', age: [55, 95], req: { flag: 'lv_child_grown', kids: [1, null], fn: childHere }, w: 12, title: '来检查门锁的人',
      text: '{lv_kidName}来看你，先试了门锁，再把药按日期分开。你嫌孩子把字写得太大，孩子说不这样你就不看，语气和你从前催人上学时一样。',
      choices: [
        { t: '让孩子留下吃饭', r: '你端锅时手有些抖，孩子自然地接过去。饭后那人赶着回去上工，临走又试了一次门锁。', eff: { money: -1800, mind: 4 } },
        { t: '让孩子先赶回工作', r: '孩子留下几份热过就能吃的饭。你站在门口看楼梯灯一层层亮，又慢慢一层层熄掉。', eff: { mind: 1, money: 3000 } },
      ] },
    { id: 'lv_parents_aging', age: [25, 50], req: { fam: { parents: ['both', 'mother', 'father'] }, noflag: 'parents_dead' }, w: 14, title: '旧屋的台阶',
      text: '你回旧屋取东西，发现家里把米袋拆成了几个小包。家长说大袋便宜，只是如今搬不动。门口那级台阶还在，边缘被鞋跟磨得发圆。',
      choices: [
        { t: '出钱改低台阶', r: '工人敲掉半截水泥，留下新旧两种颜色。家长嫌花钱，却在送你出门时走得比来时快一些。', eff: { money: -10000, mind: 2, queue: ['lv_parent_care', 3] } },
        { t: '拆包后分批搬进去', r: '你一袋袋搬进厨房，发现角落已经放着好几个空米袋。家长说下次别专程跑，袋子还够用。', eff: { body: -1, mind: 1, queue: ['lv_parent_care', 3] } },
      ] },
    { id: 'lv_parent_care', manual: true, req: { fam: { parents: ['both', 'mother', 'father'] }, noflag: 'parents_dead' }, title: '轮班表',
      text: '三年后，家里的老人已经没法自己做饭，得有人定时送去。你可以花钱请照护机构，也可以缩短工时自己跑。你把自己的排班表摊在桌上，算了一整晚。',
      choices: [
        { t: '请人送饭照护', r: '照护员每天按时送饭。你第一次回去探望时，家长把饭盒洗得干干净净，一只只摞在窗台上。', eff: { money: -36000, mind: 1, queue: ['lv_parent_last', 3] } },
        { t: '缩短工时亲自往返', r: '你学会在两班车之间热饭。等你坐下来吃自己的那份，汤上总浮着一层薄薄的油皮。', eff: { money: -15000, body: -3, mind: -1, queue: ['lv_parent_last', 3] } },
      ] },
    { id: 'lv_parent_last', manual: true, req: { fam: { parents: ['both', 'mother', 'father'] }, noflag: 'parents_dead' }, title: '留下来的号码',
      text: (S) => S.fam.parents === 'both' ? '父亲病重住进了诊所，母亲守在床边。她打来电话，反复叮嘱家里的证件放在柜子第二层。你早就记住了，仍应了一遍。电话那头，护士正在换输液瓶。' : '家里最后一位老人病重住进了诊所，怕你找不到证件，反复说在柜子第二层。你早就记住了，仍应了一遍。电话那头，护士正在换输液瓶。',
      choices: [
        { t: '请假去守在床边', res: [
          { w: 1, req: { fam: { parents: 'both' } }, r: '你陪母亲送走父亲，替她收好证件。回旧屋时，她仍把米分成小袋，却只肯给自己留一袋。', eff: { money: -18000, mind: -6, fn: (S) => { S.fam.parents = 'mother'; }, queue: ['lv_parent_last', 3] } },
          { w: 1, req: { fam: { parents: ['mother', 'father'] } }, r: '你赶到时，床边还有一张空椅子。几天后，护士让你带走证件，你终于打开那个一直没动过的抽屉。', eff: { money: -18000, mind: -6, flag: 'parents_dead', fn: (S) => { S.fam.parents = 'none'; }, queue: ['lv_inheritance', 1] } },
        ] },
        { t: '付费安排好后续手续', res: [
          { w: 1, req: { fam: { parents: 'both' } }, r: '你签完父亲的所有手续，接母亲回旧屋。她把多余的药盒洗干净，晾在窗台上，说自己往后也用得着。', eff: { money: -30000, mind: -5, fn: (S) => { S.fam.parents = 'mother'; }, queue: ['lv_parent_last', 3] } },
          { w: 1, req: { fam: { parents: ['mother', 'father'] } }, r: '你花钱请人料理了一切，自己没能守在床边。遗物送来那天，第二层抽屉的钥匙也在里面。', eff: { money: -30000, mind: -5, flag: 'parents_dead', fn: (S) => { S.fam.parents = 'none'; }, queue: ['lv_inheritance', 1] } },
        ] },
      ] },
    { id: 'lv_inheritance', manual: true, req: { flag: 'parents_dead' }, title: '遗产清单',
      text: '旧屋整理了一年。家里留下一点存款，也留下一些没还完的欠款。你清点钥匙时多数出一把，认出是你小时候弄丢、为此被罚站了一下午的那把。',
      choices: [
        { t: '结清费用退还旧屋', res: [
          { w: 3, r: '扣完所有费用，还剩一小笔钱。你把最后一把钥匙交回去，房东试锁时，门仍要抬一下才能关。', eff: { money: 16000, mind: -2 } },
          { w: 2, r: '存款不够还清欠款，你自己补了差额。交出钥匙后，你的包轻了许多，走路时再没有叮当声。', eff: { money: -12000, mind: -3 } },
        ] },
        { t: '付钱多留旧屋一年', r: '你买了清洁用品，却没动墙上的身高线。下次来时，水杯里积着灰，杯底还有一道旧裂纹。', eff: { money: -24000, mind: 1 } },
      ] },
    { id: 'lv_sibling_request', age: [18, 55], req: { fn: (S) => S.fam.sib > 0 }, w: 11, title: '同一个旧门牌',
      text: '你的兄弟姐妹找上门来，说在别的区找到一份工作，想离开这里，只差一笔押金，还想请你做担保人。对方连行李箱都借好了，就立在门边。',
      choices: [
        { t: '借钱但不替人担保', r: '你分几次把钱借了过去，但没在担保书上签字。对方答应安顿下来后，给你寄一张新住处门口的照片。', eff: { money: -20000, queue: ['lv_sibling_parcel', 4] } },
        { t: '帮忙核实招工地址', check: { s: 'wit', dc: 40 }, ok: { r: '你按地址找过去，那里没有招工的牌子，只有几把空椅子——是骗局。你们把借来的行李箱还了回去，押金一分没交。', eff: { money: -2000, social: 2, queue: ['lv_sibling_parcel', 4] } }, no: { r: '你打电话去问，对方每句话都答得很顺，你没听出破绽。出发当天才知道那里根本没人，你垫的车费也打了水漂。', eff: { money: -8000, mind: -2, queue: ['lv_sibling_parcel', 4] } } },
      ] },
    { id: 'lv_sibling_parcel', manual: true, req: { fn: (S) => S.fam.sib > 0 },
      text: '四年后，你的兄弟姐妹寄来一只旧行李箱，说小房间放不下了。箱里塞着几包干粮，底下是你们从前争着用的那只杯子，缺口已经磨得不割嘴。', eff: { money: 3000, mind: 3 } },
    { id: 'lv_heirloom', age: [15, 40], req: { trait: '家族遗物' }, w: 16, title: '磨平的字母',
      text: '家族留下的徽章卡进了衣服内衬。你拆线取出，发现背面磨平的字母旁还有几道刻痕，像是一个门牌号。附近的旧货商想买下它，却不肯说为什么要。',
      choices: [
        { t: '付钱拓印刻痕查地址', r: '旧货商拓下刻痕，收了钱，答应托人去查，让你三年后再来问。你把徽章缝回内衬，拓印纸折得比徽章还小。', eff: { money: -8000, flag: 'lv_heirloom_kept', queue: ['lv_heirloom_address', 3] } },
        { t: '卖掉徽章补贴生活', r: '旧货商称了重量，把钞票压在秤上。你走出门后摸了摸内衬，线还在，里面已经空了。', eff: { money: 18000, untrait: '家族遗物', mind: -2 } },
      ] },
    { id: 'lv_heirloom_address', manual: true, req: { trait: '家族遗物', flag: 'lv_heirloom_kept' }, title: '已拆掉的楼',
      text: '三年后，你按刻痕找到那栋旧楼，楼已经拆得只剩地基。看守人说，这里存着一份与你同姓的人家留下的档案，看守人翻出领取条款：登记后还得等五年，持徽章才能领取。',
      choices: [
        { t: '交钱登记五年后来取', r: '你只写了姓，没写名字。看守人没有追问，把那页登记压进一摞同样泛黄的纸里，提醒你五年后再来。', eff: { money: -12000, queue: ['lv_heirloom_archive', 5] } },
        { t: '带着徽章离开', r: '看守人把单子收了回去。你拍下地基的位置，照片里只有一片积水，自己的倒影站在正中。', eff: { mind: 1 } },
      ] },
    { id: 'lv_heirloom_archive', manual: true, req: { trait: '家族遗物' }, title: '空白的一页',
      text: '五年后，你领到了那个档案袋，封口完好。里面有一张合照，所有人的脸都被裁掉，只剩几双一样的鞋；还有一份名单，最后一行空着。空白姓名栏印着一道横线。你把徽章放上去，宽度正好盖住它，两端都没有多出。',
      choices: [
        { t: '拓印徽章寄回档案处', r: '你没有在空白处写名字，只把徽章的拓印夹进袋里寄了回去。档案处收了一大笔钱，说回信要等很久。', eff: { money: -16000, mind: -2, queue: ['lv_heirloom_reply', 7] } },
        { t: '封存档案不再追问', r: '你把徽章和照片分开放。回家后缝好内衬，那条空白横线藏在柜子最底下，没有被补上。', eff: { mind: 2 } },
      ] },
    { id: 'lv_heirloom_reply', manual: true, req: { trait: '家族遗物' }, star: true,
      text: '七年后，回信里没有字，只有合照裁掉的一角。你认不出照片上的脸，那人的衣领却别着同一枚徽章。邮戳来自早已拆掉的旧楼，日期是昨天。', eff: { mind: -3, dist: 2, ach: 'lv_unwritten_name' } },
    { id: 'lv_neighbor_key', age: [18, 65], w: 8, title: '备用钥匙',
      text: '邻居要连上三天班，托你替屋里的老人送饭，把钥匙放进你掌心。钥匙上系着一根油腻的红绳，门后还有另外三把锁，你都得记住顺序。',
      choices: [
        { t: '答应送饭收下钥匙', r: '老人每次都数你带来的饭盒。第三天邻居回来，多付了饭钱，又把钥匙留了一夜才取走。', eff: { money: -1000, social: 3, mind: 1 } },
        { t: '介绍收费送饭的人', r: '你替邻居找了个收钱送饭的人。邻居把钥匙收回去，红绳重新拴回腰上，你的掌心留下一小道油印。', eff: { social: 1, mind: -1 } },
      ] },
    { id: 'lv_guarded_letter', age: [18, 70], w: 8, title: '替人保管的信',
      text: '旧同事把一封封好的信交给你，说要出一趟远门，七天内没回来，就替他照地址寄出去。收件人一栏只写着“家里”，下面的门牌号涂改过两次。',
      choices: [
        { t: '照日期寄出', res: [
          { w: 4, r: '第八天人没回来，你把信寄了出去。几周后同事却回来了，听说信已寄出，在你门口坐了很久，最后只向你借了一支笔。', eff: { money: -600, social: 2, mind: -1 } },
          { w: 2, r: '信被退回，地址已经不存在。你把邮戳朝下压进抽屉，同事也没有回来取，信封一直没拆。', eff: { money: -600, mind: -3 } },
        ] },
        { t: '退回信请对方另找人', r: '同事把信塞进外套，点头说也好。你们照旧交接工具，往后几天，对方的口袋总鼓着一角。', eff: { social: -1, mind: 1 } },
      ] },
    { id: 'lv_double_bowl', age: [20, 75], req: { spouse: true }, w: 10,
      text: '晚饭只剩一碗热汤，{spouse}说自己在外面吃过。你在垃圾袋里看见两张空的代餐包装，把汤重新倒回锅里，加了半碗水，烧开后分成两份。', eff: { money: -400, mind: 2 } },
    { id: 'lv_child_drawing', age: [25, 60], req: { kids: [1, null], fn: (S) => childHere(S) && S.age - S.vars.lv_childBorn >= 4 && S.age - S.vars.lv_childBorn <= 12 }, w: 12,
      text: '{lv_kidName}画了你们住的房子，每扇窗都涂成亮黄色。纸上没画催租单，也没画门后的铁棍。你找了一块没被水泡软的墙，把画贴到孩子够得着的位置。', eff: { mind: 2 } },
    { id: 'lv_parent_recipe', age: [18, 60], req: { fam: { parents: ['both', 'mother', 'father'] }, noflag: 'parents_dead' }, w: 10,
      text: '家里打来电话，教你做那道便宜的炖菜。说到调料时，对方让你少放一半，说如今的盐贵。你照做了，端出来的味道与小时候一样淡。', eff: { money: -500, mind: 2 } },
    { id: 'lv_old_group', age: [45, 85], w: 8,
      text: '旧通讯录里有人约聚餐。群里的名字每年少几个，这回只订了一张小桌。你们都提早到了，谁也没坐空出来的那一边，服务员便撤走了那里的杯子。', eff: { money: -1800, mind: -1, social: 1 } },
    { id: 'lv_sibling_photo', age: [30, 80], req: { fn: (S) => S.fam.sib > 0 }, w: 10,
      text: '你的兄弟姐妹发来一张旧照，问墙角那个人是不是你。照片只拍到半截衣袖，你们为此争了半小时，最后仍没分清，却把那年的饭价都想起来了。', eff: { mind: 2, social: 1 } },
    { id: 'lv_spouse_maintenance', age: [25, 80], req: { spouse: true, flag: 'lv_spouse_pros', fn: S => S.spouse.name === S.vars.lv_prosSpouse && S.spouse.since === S.vars.lv_prosSince }, w: 12, repeat: true, cd: 5,
      text: '{spouse}坐在桌边给义手做维护。零件按大小排在餐巾上，你替{sta}扶着台灯。屋里只剩螺丝刀转动的细响，饭要等手指装好才能开。', eff: { money: -6000, mind: 1 } },
    { id: 'lv_child_first_gift', age: [40, 80], req: { flag: 'lv_child_grown', kids: [1, null], fn: childHere }, w: 12,
      text: '{lv_kidName}给你买了一双新鞋，尺码大了半号。你说塞点纸就能穿，孩子没接话。第二天一早，门口摆着一双小半号的同款，孩子已经赶去上工了。', eff: { mind: 3 } },
    { id: 'lv_empty_contact', age: [55, 90], req: { flag: 'parents_dead' }, w: 8,
      text: '办手续时，表格要求写紧急联系人。你习惯地填了旧屋的号码，写到最后一位才停下。窗口的人递来修正液，瓶口干了，你只好再领一张表。', eff: { mind: -2 } },
    { id: 'lv_late_knock', age: [25, 75], w: 7, title: '门外叫你的人',
      text: '有人在门外叫你的名字，说是从前借过你工具的熟人。声音很像，鞋底刮地的习惯也像。你把手放到门链上，忽然想不起那人是否早已死了。',
      choices: [
        { t: '隔门问工具的缺口', check: { s: 'wit', dc: 45 }, ok: { r: '对方答得上来，还隔门骂你记仇。你只开一条缝收下工具，手柄上的缺口确实没变。', eff: { social: 2, mind: 1 } }, no: { r: '门外答错了，你却没及时松手。门缝里伸进一把刀，划破手背后，又很快缩了回去。', eff: { body: -3, mind: -2 } } },
        { t: '关灯等脚步离开', r: '门外的人等了一会儿，把东西放下就走了。清晨你没找到工具，只在门口捡到一截断掉的锁片。', eff: { mind: -1, money: -1200 } },
      ] },
  ]);
  CITY.addAch({
    lv_repaid: { name: '连本带息', desc: '借给患难朋友的钱如约归还。', tier: 'uncommon', group: '羁绊' },
    lv_paper_cup: { name: '最后一个纸杯', desc: '参加患难朋友的葬礼。', tier: 'common', group: '羁绊' },
    lv_two_names: { name: '两张签名', desc: '与相识的人登记结婚。', tier: 'common', group: '羁绊' },
    lv_twelve_leases: { name: '续租十二年', desc: '与同一位伴侣度过婚后的第十二年。', tier: 'rare', group: '羁绊' },
    lv_mended: { name: '补过的袖口', desc: '争吵两年后，与伴侣一起选择新的住处。', tier: 'uncommon', group: '羁绊' },
    lv_closed_account: { name: '更正名单', desc: '在追查伴侣遇害的多年之后收到一通旧电话。', tier: 'rare', group: '羁绊', hidden: true, hint: '有些记录隔了几年仍要更正。' },
    lv_answered: { name: '有人应声', desc: '在伴侣出现扭曲征兆时唤回应答。', tier: 'epic', group: '羁绊', hidden: true, hint: '留意家里接不上线的电话。' },
    lv_gray_together: { name: '同一只簸箕', desc: '与同一位伴侣相守三十年以上，见到彼此白发。', tier: 'legend', group: '羁绊' },
    lv_empty_ampule: { name: '空玻璃管', desc: '付钱用HP安瓿救治受伤的孩子。', tier: 'uncommon', group: '羁绊' },
    lv_return_address: { name: '回信地址', desc: '收到搬出家门十二年的孩子寄来的汇款单。', tier: 'rare', group: '羁绊' },
    lv_found_again: { name: '再扣一次安全带', desc: '把失踪的孩子接回家。', tier: 'epic', group: '羁绊' },
    lv_unwritten_name: { name: '没有填上的名字', desc: '追查家族遗物，收到旧楼寄来的无字回信。', tier: 'epic', group: '羁绊', hidden: true, hint: '旧衣内衬里或许还缝着东西。' },
  });
})();

/* 补充：第二个孩子（可重复） */
CITY.addEvents('love', [
  { id: 'lv_another_child', age: [23, 44], force: true, req: { spouse: true, nojob: ['distorted', 'book'], kids: [1, 2], fn: (S) => S.rng.chance(0.15) }, repeat: true, cd: 4, w: 25, title: '又一张小床',
    text: '你数着屋里现有的小床。一天晚上，{spouse}问你：家里还挤得下一个吗？',
    choices: [
      { t: '再要一个孩子', r: '几个月后，家里又多了一个哭声。旧小床修了修，接着用。', eff: { kid: 1, money: -30000, mind: 2, fn: S => CITY.initLoveChild(S) } },
      { t: '一个就够了', r: '你们把多出来的那点钱存了起来，留给现在这个孩子。', eff: { money: 5000, mind: 1 } },
    ] },
]);
