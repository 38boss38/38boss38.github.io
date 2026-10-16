/* 扭曲与光：55 个事件（52 个带选项），10 个成就。
 * 连锁线：废货站白线 → 两年后的拆除通知。
 * 连锁线：都市怪谈 → 两年后的都市传说 → 三年后的都市恶疾。
 * 连锁线：隔墙试验 → 三年后的最后探访 → 极罕见地恢复人形 → 两年后的恢复登记。
 * 连锁线：E.G.O使用协议 → 两年后的损害清单。
 * 连锁线：声音的笔记 → 三年后的旧答复。
 * 连锁线：邀请函准备 → 同年多阶段接待 → 两年后的书页处理。
 * 连锁线：改变的曲调 → 三年后的隔音账单。
 * 连锁线：保存体检底片 → 两年后的复查。
 * 连锁线：保管工具箱 → 三年后的领取人。
 */
CITY.addEvents('beyond', [
  // 扭曲体的生活，避免把不同形态统一成一种身体。
  { id: 'by_boundary', req: { job: 'distorted' }, w: 18, title: '废货站的白线',
    text: '你在废货站停留了很久。拾荒者在入口画出白线，把捡来的东西堆在线外。你记得那里从前有个磅秤，工人吃饭时会把碗放在秤上。现在每当有人越线，你都想把他赶回去。',
    choices: [
      { t: '退到最里面', r: '拾荒者把白线往里挪了一点。你让出入口，剩下的地方只够自己停着。', eff: { mind: 2, dist: -3, flag: 'by_boundary_kept', queue: ['by_demolition', 2] } },
      { t: '赶走越线的人', check: { s: 'mind', dc: 48 }, ok: { r: '你等他退出去才停下。第二天，入口多了一块警告牌，字写得很大。', eff: { fame: 3, dist: 2 } }, no: { r: '你停下时，入口已经塌了。有人从瓦砾下爬出去，拖出很长的血迹。', eff: { mind: -4, dist: 4, fame: 5 } } },
    ] },
  { id: 'by_demolition', manual: true, req: { job: 'distorted', flag: 'by_boundary_kept' }, title: '白线以外',
    text: '两年后，废货站外停下拆除车。最早画白线的人把一张通知放在线外，等到天黑也没有进来。纸上印着施工日期，离今天只有三天。',
    choices: [
      { t: '在开工前离开', r: '你换了一个栖身处。旧货站倒下那天，灰尘一直飘到这里，遮住了半边天空。', eff: { body: -3, mind: -2, dist: -2 } },
      { t: '留下阻止拆除', check: { s: ['body', 'mind'], dc: 60 }, ok: { r: '第一台车退回去了。施工方增派了守卫，通知上的日期被红笔划掉。', eff: { body: -5, fame: 6, dist: 3 } }, no: { r: '车后跟着持械的人。你从塌掉的围墙逃走，原来的白线压在水泥下面。', eff: { body: -12, mind: -4, risk: [0.15, '在废货站拆除时被清除。'] } } },
    ] },
  { id: 'by_instinct', req: { job: 'distorted' }, w: 16, title: '重复的时刻',
    text: '每天报时一响，你都会沿墙来回巡视。今天有人把墙上的钟调快十分钟，你已经走到墙角，远处报时却还没响。你停在原地，忽然记起从前有一次上班迟到。',
    choices: [
      { t: '等真正的报时', check: { s: 'mind', dc: 45 }, ok: { r: '你停住了。报时响完，钟还在那里，你也没有非做什么不可。', eff: { mind: 3, dist: -4 } }, no: { r: '你想停下，身体却不听使唤。报时结束，你已来回走了两遍，关节磨得生疼。', eff: { body: -3, dist: 3 } } },
      { t: '毁掉那只钟', r: '碎钟挂在墙上，路人远远绕开。第二天，远处报时一响，你仍开始沿墙巡视。', eff: { mind: -1, fame: 2, dist: 1 } },
    ] },
  { id: 'by_hunters', req: { job: 'distorted' }, w: 12, title: '讨伐队',
    text: '协会派来的收尾人先沿街拉开封锁带，标出几处距离，最后才展开你的照片。照片拍的是去年，已经不像你了。队尾的人开始给街灯编号，编号的灯一盏盏亮起来。',
    choices: [
      { t: '趁封锁未合拢撤走', check: { s: ['wit', 'body'], dc: 48 }, ok: { r: '你绕过最后一盏灯。队伍没有追出封锁线，只在图上添了一支箭头。', eff: { body: -4, fame: -2 } }, no: { r: '退路比地图上窄。你撞开围挡，身后响起连续的武器声。', eff: { body: -12, mind: -5, risk: [0.2, '在协会讨伐队的封锁中被击倒。'] } } },
      { t: '冲开他们的阵形', check: { s: ['body', 'skill'], dc: 68 }, ok: { r: '他们拖着伤员退走。照片留在路上，背面写着尚未确认的能力。', eff: { body: -7, fame: 8, dist: 4 } }, no: { r: '他们等的就是你冲过来。街灯把每一处动作照得很清楚。', eff: { body: -15, mind: -5, risk: [0.3, '在冲击协会讨伐队时被围杀。'] } } },
    ] },
  { id: 'by_other', req: { job: 'distorted' }, w: 13, title: '另一个停留者',
    text: '废弃通道另一端也有个东西。它每次靠近墙壁，墙里就响起开会的掌声。你试着接近，掌声忽然停了，通道里只剩两种不太像呼吸的声音。',
    choices: [
      { t: '留出一半通道', res: [
        { w: 3, r: '它退回另一端。很长一段时间，你们不再同时经过中间那盏坏灯。', eff: { mind: 2, dist: -2, ach: 'by_neighbor' } },
        { w: 2, r: '掌声从你身后响起。逃出通道后，你许久还分不清哪一声属于自己。', eff: { body: -5, mind: -3, dist: 3 } },
      ] },
      { t: '退回地面', r: '地面正在下雨。你停在没人的雨棚下，通道里的掌声持续到天亮。', eff: { body: -2, mind: 1 } },
    ] },
  { id: 'by_family', req: { job: 'distorted', fn: (S) => S.fam.parents !== 'none' || !!(S.spouse && S.spouse.alive) || S.kids.some((k) => k.alive) }, w: 16, title: '认出来的人',
    text: '封锁带外有人喊出你从前的名字。是你的家人，隔得太远，看不清脸。对方拎着旧袋子，说装着你的东西。收尾人把他往后拦，他还在举那个袋子。',
    choices: [
      { t: '停在原处回应', check: { s: 'mind', dc: 50 }, ok: { r: '你只发出一点声音。对方却听见了，把袋子放在地上，退到封锁带外。', eff: { mind: 4, dist: -6, ach: 'by_name' } }, no: { r: '你想回答，身体先动了。对方被拉走，袋里的旧衣服散了一地。', eff: { mind: -5, dist: 4 } } },
      { t: '转向另一条街', r: '喊声跟了很远，后来停了。你没有回去找那个袋子。', eff: { mind: -2, dist: -3, fame: -2 } },
    ] },
  { id: 'by_rating', req: { job: 'distorted' }, w: 18, title: '都市怪谈',
    text: '有人把关于你的委托剪报钉在路口。威胁评级一栏印着“都市怪谈”，出没时刻却写错了。穿旧制服的人拿笔核对街景，离开前又拍下你停过的地方。',
    eff: { flag: 'by_rated', set: { byRating: '都市怪谈' }, queue: ['by_legend', 2] }, choices: [
      { t: '离开被记录的路线', r: '新的路线更难走，偶尔会遇到从未见过你的行人。有人当场丢下了货箱。', eff: { body: -3, fame: -3 } },
      { t: '留在熟悉的地方', r: '第二天，剪报多印了几张。你停留的位置被画成一个红圈。', eff: { mind: 2, fame: 5, dist: 2 } },
    ] },
  { id: 'by_legend', manual: true, req: { job: 'distorted', flag: 'by_rated' }, title: '都市传说',
    text: '两年后，新通告把你的威胁评级改成了“都市传说”。你没见过上面列出的全部事故，一张照片甚至来自另一条街。讨伐报酬涨了，核实的人也多带一把武器。',
    eff: { set: { byRating: '都市传说' } }, choices: [
      { t: '撤出有人居住的街区', r: '通告留在墙上。你沿着运货的旧路走，远处窗户里的灯逐渐少了。', eff: { body: -4, fame: -4, dist: -3 } },
      { t: '继续占住原来的路口', r: '人群改走别的路。你赶走试图通行的送货车，路口两侧的店铺开始关门。', eff: { fame: 5, dist: 3, queue: ['by_plague', 3] } },
    ] },
  { id: 'by_plague', manual: true, req: { job: 'distorted' }, title: '都市恶疾',
    text: '三年里，路口周围空了几栋楼。今天的通告将你的威胁评级改为“都市恶疾”，旧照片也被收起。带队的人站在远处读完资料，没有像前几次那样派人先试探。',
    eff: { set: { byRating: '都市恶疾' }, ach: 'by_rating' }, choices: [
      { t: '弃下占据的地方', check: { s: 'wit', dc: 50 }, ok: { r: '你在他们部署完成前离开。空楼留在身后，没有人追到新的藏身处。', eff: { mind: -3, fame: -5 } }, no: { r: '撤离路线已经有人等待。你穿过围墙，失去了一部分再也长不好的身体。', eff: { body: -12, mind: -5, risk: [0.2, '在升级后的讨伐行动中被清除。'] } } },
      { t: '利用旧楼抵挡进攻', check: { s: ['skill', 'body'], dc: 72 }, ok: { r: '队伍暂时撤走。最后一栋挡雨的楼也塌了，你停在裸露的地基上。', eff: { body: -9, mind: -4, fame: 8, dist: 4 } }, no: { r: '承重墙先于封锁线倒下。他们没有进入楼里，武器声从远处传来。', eff: { body: -15, mind: -6, risk: [0.35, '在据守空楼时被讨伐队击倒。'] } } },
    ] },
  { id: 'by_cure', req: { job: 'distorted' }, w: 12, title: '隔墙的尝试',
    text: '一个收尾人隔墙给你念旧商店的价目表。他想试试能不能让你恢复，箱里却只有录音机和绷带。他不肯保证什么，只要求墙上的灯亮起时，你能停止靠近。',
    choices: [
      { t: '按他的灯号停下', check: { s: 'mind', dc: 42 }, ok: { r: '他从头念了两遍，你都没有越过墙。走前，他在本子上记下日期。', eff: { mind: 2, dist: -4, flag: 'by_cure_trial', queue: ['by_cure_last', 3] } }, no: { r: '灯亮时，你没有停住。墙后传来拖动工具箱的声音，之后再没人念价目表。', eff: { mind: -3, body: -3, dist: 3 } } },
      { t: '避开他点亮的灯', r: '他留下一张写了日期的纸。雨把日期冲掉后，你才重新经过那里。', eff: { mind: 1, fame: -2 } },
    ] },
  { id: 'by_cure_last', manual: true, req: { job: 'distorted', flag: 'by_cure_trial' }, title: '最后一节电池',
    text: '三年后，收尾人的录音机换成更旧的一台。他一直没有找到疗法，委托费也花完了。今天他带来最后一节电池，录音里夹着你第一次停在墙外时的声音。',
    choices: [
      { t: '听完未经剪辑的录音', res: [
        { w: 1, r: '你听见录音里自己从前的呼吸声。再低头时，身上异样的部分正在消退，双腿却撑不住身体。他把外衣搭在恢复人形的你身上，退开等你站起来。', eff: { job: { id: 'none' }, body: -12, dist: -70, flag: 'wd_human_again', unflag: 'by_cure_trial', ach: 'by_human', queue: ['wd_human_papers', 2] } },
        { w: 49, r: '录音停了，你仍是现在的样子。他把机器留在线外，带走了空电池盒。', eff: { mind: 3, dist: -6, unflag: 'by_cure_trial' } },
      ] },
      { t: '推回那台录音机', r: '他捡起机器，没再开口。墙上的灯拆掉以后，那个小洞一直没有补。', eff: { mind: -1, dist: -3, unflag: 'by_cure_trial' } },
    ] },
  { id: 'by_smell', req: { job: 'distorted' }, w: 10, title: '洗衣粉的气味',
    text: '廉价洗衣粉的味道飘过来。你记得从前趁降价买整袋，提回家时袋角勒得很疼。现在你沿着气味走到洗衣房外，里面的人正把湿衣服搬离窗口。',
    choices: [
      { t: '等气味散去', r: '洗衣房关掉排风。你停到傍晚，才记起旧住处晾衣绳断过的位置。', eff: { mind: 2, dist: -3, body: -2 } },
      { t: '绕去没有窗的那面', r: '人们又开了排风。气味被吹向别处，你也换了一个方向。', eff: { mind: 1, fame: -2 } },
    ] },
  { id: 'by_poster', req: { job: 'distorted' }, w: 10, title: '观赏费',
    text: '有人在远处搭起台子，收钱让人看你。他给你编了很长的来历，观众听得发笑。旁边放着空笼，笼门远比你现在的身体小，笼底却没有灰尘。',
    choices: [
      { t: '靠近那只空笼', res: [
        { w: 3, r: '观众先跑了，收钱的人还在拆票箱。你停在笼外，看着他越急越拧不开箱上的螺丝。', eff: { fame: 4, dist: 2 } },
        { w: 1, r: '笼子只是诱饵。楼顶绳索收紧，你挣掉一块身体才退出空地。', eff: { body: -8, mind: -3 } },
      ] },
      { t: '躲进看不见的地方', r: '他把演出牌翻成暂停。你在狭窄的遮挡后听完一整天的退票争执。', eff: { body: -2, mind: 1, fame: -3 } },
    ] },
  { id: 'by_rescue', req: { job: 'distorted' }, w: 11, title: '倒塌的梯子',
    text: '火从旁边仓库烧起，一段逃生梯落在你面前。上面还有个人，抓住扶手不敢下来。他看见你时把喊声咽了回去，仓库里却又响起一声爆裂。',
    choices: [
      { t: '撑住梯子让他下去', check: { s: ['mind', 'body'], dc: 45 }, ok: { r: '他从你旁边滑下去，没有道谢。到了街口，他又回头看一次，随即钻进人群。', eff: { body: -5, dist: -4, mind: 2 } }, no: { r: '你把力量用错地方。梯子折下去，那人跳上货堆，腿弯成难看的角度。', eff: { body: -5, mind: -3, dist: 3 } } },
      { t: '移到火烧不到的地方', r: '你听见有人抛出绳子。过了一会儿，梯子落地的声响盖住其他声音。', eff: { mind: -2, body: 1 } },
    ] },
  { id: 'by_weather', req: { job: 'distorted' }, w: 9,
    text: '又到换季的时候，街上换了一批厚衣服。你辨不出身体哪里在觉得冷，却仍想找从前的外套。雨水冲掉墙上的寻人纸，只剩透明胶粘着的四个角。', eff: { mind: -1, dist: -1 } },
  { id: 'by_route', req: { job: 'distorted' }, w: 10, title: '送水的人',
    text: '送水车又经过你的藏身处。司机每次按两声喇叭，今天却只按一声。你等了很久，直到看见车门边挂着新的布带，才明白驾驶室里已经换了人。',
    choices: [
      { t: '让出原来的通路', r: '新司机小心地开过去。他没有按第二声，空桶仍发出熟悉的碰撞声。', eff: { mind: 2, dist: -2 } },
      { t: '追到车后确认', check: { s: 'mind', dc: 42 }, ok: { r: '你在碰到车斗前停下。司机跑了，空桶沿着斜坡滚出去好几个。', eff: { fame: 2, mind: -1 } }, no: { r: '车撞上路灯，水淌了一地。你找了很久，也没有找到从前那两声喇叭。', eff: { body: -5, mind: -3, dist: 3 } } },
    ] },

  // 自身展现的E.G.O，不与脑叶公司遗留装备混用。
  { id: 'by_ego_sleep', req: { flag: 'ego', nojob: 'distorted' }, w: 16, title: '睡着以后',
    text: '你醒来时，床架上多了一道与E.G.O轮廓相近的伤痕。楼下住户问昨夜是什么声音，手里拿着掉下去的螺丝。你摸了摸床边，掌心仍有使力后的酸痛。',
    choices: [
      { t: '赔钱后记录睡眠', r: '你先付修理费，后来睡前都把硬物搬远。你记下每次惊醒的时刻，楼下没再有人拿着螺丝找上门。', eff: { money: -6000, wit: 2, mind: 1 } },
      { t: '熬夜避免再次发生', res: [
        { w: 3, r: '你守着灯到天亮。白天端起饭碗时，手抖得很厉害。', eff: { body: -4, mind: -2, dist: 2 } },
        { w: 1, r: '你坐着睡着了。醒来时灯还亮着，桌上又添一道新痕。', eff: { money: -3000, body: -3, dist: 3 } },
      ] },
    ] },
  { id: 'by_ego_contract', age: [18, 100], req: { flag: 'ego', nojob: 'distorted' }, w: 14, title: '协会的记录表',
    text: '协会联络员请你按次记录E.G.O的使用情况，报酬不高，但可以介绍合适的委托。表格最后要填周围物品的损坏程度，密密麻麻分成九栏。',
    choices: [
      { t: '签下记录协议', r: '每次使用后，你都得数清坏了多少东西。联络员按时付钱，也收走每张副本。', eff: { money: 15000, flag: 'by_ego_records', queue: ['by_ego_claim', 2] } },
      { t: '购买委托筛选建议', r: '他在便条上划掉几种工作。你付了咨询费，没把名字留在表上。', eff: { money: -5000, wit: 2, social: 1 } },
    ] },
  { id: 'by_ego_claim', manual: true, req: { flag: 'by_ego_records', nojob: 'distorted' }, title: '九栏以外',
    text: '两年前的记录表被寄回，附着赔偿请求。住户说你用过E.G.O后，屋里总有异响。联络员没有断定原因，只问是否保留了原始记录。',
    choices: [
      { t: '逐项核对原始记录', check: { s: 'wit', dc: 50 }, ok: { r: '你找到错填的地址，只需赔那扇确实碰坏的窗。对方领钱后，请你以后绕远一点。', eff: { money: -4000, wit: 2, ach: 'by_ledger' } }, no: { r: '你记得使用时的感受，却记不起门牌。最终按折价和解，表上九栏一项没少。', eff: { money: -22000, mind: -3 } } },
      { t: '付钱结案终止协议', r: '你付清赔款，联络员收回剩余空表。此后不必再填那九栏，屋里的异响却还没查清。', eff: { money: -15000, mind: 1, unflag: 'by_ego_records' } },
    ] },
  { id: 'by_ego_wing', age: [18, 100], req: { flag: 'ego', nojob: 'distorted' }, w: 10, title: '保密附件',
    text: '某个翼的外包人员请你配合观测，按小时算钱。保密附件连你的梦也列为资料。对方把笔推来，说正文只有两页，附件不用急着看。',
    choices: [
      { t: '谈妥只记录外部表现', check: { s: 'social', dc: 58 }, ok: { r: '他们删去涉及梦境的条款，隔着玻璃完成观测。你领到的报酬少了一截，观察窗后的人始终没露面。', eff: { money: 26000, mind: -2, fame: 2 } }, no: { r: '你拒签补充条款，观测便中止了。离开时，他们还要你付已使用的场地费。', eff: { money: -8000, mind: -3, dist: 2 } } },
      { t: '交回附件离开', r: '你放弃报酬。外包人员换了个号码，当晚又打来一次。', eff: { mind: 2, social: -1 } },
    ] },
  { id: 'by_ego_gang', age: [16, 100], req: { flag: 'ego', nojob: 'distorted' }, w: 12, title: '预付的保护费',
    text: '帮派的人留下一叠钱，想让你站在收账的路口。他说不必动手，只要亮出E.G.O。钱底下压着店铺名单，有几家连招牌都很旧。',
    choices: [
      { t: '收钱站满一个下午', res: [
        { w: 3, r: '没有人反抗。店主递钱时一直看你，等你收起E.G.O才敢抬头找零。', eff: { money: 24000, mind: -3, dist: 3, fame: 3 } },
        { w: 1, r: '另一伙人带着收尾人来了。雇你的人先跑了，你自己付了伤药钱。', eff: { money: 5000, body: -8, dist: 3 } },
      ] },
      { t: '将钱推回去', r: '对方当面数了一遍。此后那条路上，你买东西再没拿到过赊账。', eff: { social: -2, mind: 2 } },
    ] },
  { id: 'by_ego_work', age: [18, 100], req: { flag: ['ego', 'fixer_license'], nojob: ['distorted', 'fixer', 'book'] }, w: 16, title: '合适的委托',
    text: '事务所看过你的收尾人证，愿意让你参加短期护送。代表说，E.G.O能做什么得在委托里看，这次只肯按9阶的待遇聘用你。他指着车门说，狭窄处记得收手。',
    choices: [
      { t: '接下短期护送', check: { s: ['skill', 'mind'], dc: 48 }, ok: { r: '你护住车里的人，报酬扣去了车门的修理费。你以9阶收尾人的身份留下，分到一张旧椅子。', eff: { job: { id: 'fixer', rank: 9, org: '临时护送事务所' }, flag: 'office_member', money: 18000, cnt: { req: 1 } } }, no: { r: '车里太窄，你没控制住力量。人送到了，事务所却不再续约。', eff: { money: -8000, body: -5, mind: -2 } } },
      { t: '只做一次路线勘查', r: '你记下低门洞和拐角。报酬少得多，没有人要求你当场展示。', eff: { money: 7000, wit: 2 } },
    ] },
  { id: 'by_ego_fixer', req: { flag: 'ego', job: 'fixer' }, w: 18, title: '同伴的站位',
    text: '同行想在你的E.G.O后方找掩护。他按普通护具的尺寸估算，站得太近。上次练习时，那个位置的地板留下深深一圈痕迹。委托方已经催你们出发。',
    choices: [
      { t: '延迟出发重排站位', r: '委托方扣掉迟到费用。交战时，同伴按新站位避开了你的力量，回来替你提了药箱。', eff: { money: 14000, social: 2, mind: -1, cnt: { req: 1 } } },
      { t: '在交战时收住力量', check: { s: ['skill', 'mind'], dc: 56 }, ok: { r: '你留下足够空隙，自己多挨了一下。报酬完整，绷带却不够用了。', eff: { money: 30000, body: -5, skill: 2, cnt: { req: 1 } } }, no: { r: '迟疑的那一刻，同伴被撞出掩护。急救费用先从你们的报酬里扣。', eff: { money: -6000, body: -8, mind: -4, dist: 3 } } },
    ] },
  { id: 'by_ego_slip', req: { flag: 'ego', nojob: 'distorted' }, w: 13, title: '没能停住',
    text: '争执已经结束，你的E.G.O却没有消退。柜台后的玻璃又裂了一条缝。对面的人放下武器，开始小声报价，问多少钱才能让你先停下来。',
    choices: [
      { t: '集中注意收回力量', check: { s: 'mind', dc: 55 }, ok: { r: '裂缝停在玻璃边缘。你赔了柜台，收起E.G.O才离开。对面的人终于松开攥紧的衣角。', eff: { money: -7000, mind: 3, dist: -3 } }, no: { r: '你停下来时柜台已经碎了。缝伤口的人让你把双手放在他看得见的地方。', eff: { money: -18000, body: -8, mind: -4, dist: 4 } } },
      { t: '退出人群自行承受', r: '你在空楼梯间撑到力量消退。墙皮落满衣领，第二天抬不起胳膊。', eff: { body: -10, mind: -2, dist: -2 } },
    ] },
  { id: 'by_ego_voice', req: { flag: 'ego', nojob: 'distorted' }, w: 16, title: '写下答复',
    text: '那道声音又在疲惫时出现。你分不清它从哪里来，只知道它说的事你从没告诉别人。桌上还有半本旧练习簿，你试着把听见的句子逐字写下。',
    choices: [
      { t: '留下句子和自己的答复', r: '你写到手腕酸痛，把不同意的地方逐条答在旁边。声音暂时低下去，你终于能睡了。', eff: { mind: -2, dist: -3, flag: 'by_voice_notes', queue: ['by_ego_answer', 3] } },
      { t: '用额外工作盖过声音', r: '你加做一夜的活。声音没有消失，只是变得和机器低鸣一样难以分辨。', eff: { money: 9000, body: -4, dist: 2 } },
    ] },
  { id: 'by_ego_answer', manual: true, req: { flag: ['ego', 'by_voice_notes'], nojob: 'distorted' }, title: '三年前的笔迹',
    text: '三年后，你翻出那几页答复。许多句子已想不起当时为什么要写，唯独提到那次失去的几行，仍让E.G.O隐隐浮现。你把纸压在桌上，隔壁正在敲松动的水管。',
    choices: [
      { t: '承认那件事仍会疼', check: { s: 'mind', dc: 48 }, ok: { r: '你没有照着声音说下去。它仍在那里，但合上本子后，你终于能先去修自己的水管。', eff: { mind: 5, dist: -10, skill: 3, ach: 'by_answer' } }, no: { r: '你停在同一句上，纸角被汗浸湿。水管修好了，那几页仍摊在桌上。', eff: { mind: -3, dist: 3, wit: 2 } } },
      { t: '烧掉纸张结束核对', r: '你等纸烧透才倒进垃圾桶。E.G.O消退了，本子缺页处露着短短的纸茬。', eff: { mind: 2, dist: -4, skill: -1 } },
    ] },
  { id: 'by_ego_doctor', req: { flag: 'ego', nojob: 'distorted' }, w: 10, title: '不在片子上',
    text: '体检片上看不见你的E.G.O。医生把疼痛归为普通劳损，给出两种药价。你试着解释，他把笔停在病历空栏上，等你说清疼的具体位置。',
    choices: [
      { t: '按记录接受普通治疗', res: [
        { w: 3, r: '药缓解了手臂酸痛，没有解释其他感觉。你至少能安稳提着饭盒回家。', eff: { money: -6000, body: 4 } },
        { w: 1, r: '药没有起效。医生补了一行病历，建议下次带完整记录来。', eff: { money: -6000, wit: 1 } },
      ] },
      { t: '停用几天自行观察', r: '你推掉需要力量的活。疼痛退下去了，少掉的工钱却补不回来。', eff: { money: -10000, body: 2, mind: 2 } },
    ] },
  { id: 'by_ego_copy', req: { flag: 'ego', nojob: 'distorted' }, w: 10, title: '仿制品',
    text: '橱窗里摆着模仿你E.G.O轮廓的武器。店主说只参考街上的照片，不保证效果。价签下还有小字：外形瑕疵属于正常现象，不予退换。',
    choices: [
      { t: '收费纠正握持处', check: { s: 'social', dc: 45 }, ok: { r: '他给了咨询费，改掉容易伤手的位置。新价签没有提到你的名字。', eff: { money: 6000, wit: 1, fame: 1 } }, no: { r: '他不肯付钱，仍记下你指出的位置。隔周橱窗换了新样品。', eff: { social: -1, mind: -2 } } },
      { t: '付钱买走展示照片', r: '他承认底片还有别的卖家。你把那张拍到住处门牌的照片撕掉。', eff: { money: -3000, mind: 2 } },
    ] },
  { id: 'by_ego_limit', req: { flag: 'ego', nojob: 'distorted' }, w: 12, title: '握不住的重量',
    text: '你照上次的方法展现E.G.O，肩膀却先垮了下来。雇主催你把货搬上坡，货箱上的重量标得清楚。隔壁出租的搬运车还空着，只是租金要吃掉大半报酬。',
    choices: [
      { t: '付租金使用搬运车', r: '货准时送到，净赚的钱很少。交还车时，轮上还缠着沿路捡来的绳头。', eff: { money: 3000, body: 1, dist: -2 } },
      { t: '再试一次撑到交货', check: { s: ['body', 'mind'], dc: 55 }, ok: { r: '你撑到了签收处。卸完货后，坐在空箱上等了很久才站起来。', eff: { money: 17000, body: -5, skill: 2, dist: 2 } }, no: { r: '力量中断，货砸在台阶上。雇主先核对损坏数量，再问你还站不站得起来。', eff: { money: -10000, body: -8, mind: -2, dist: 3 } } },
    ] },
  { id: 'by_ego_quiet', req: { flag: 'ego', nojob: 'distorted' }, w: 9,
    text: '今天没人要求你展示E.G.O。你替门轴上油，捡回桌下的勺子，又把鞋带系好。晚上关灯时，掌心仍和普通日子一样，留着购物袋勒出的红痕。', eff: { mind: 2, dist: -2 } },

  // 图书馆：准备不消耗纪年，接待全部发生在wy=0；进门前可退出。
  { id: 'by_invitation', age: [16, 100], force: true, pri: 45, req: { wy: [0, 0], noflag: ['library_book', 'library_returned', 'by_inv_prep'], nojob: ['distorted', 'book'], fn: (S) => S.rng.chance(S.job.id === 'fixer' ? 0.6 : S.fame >= 30 ? 0.45 : S.flags.library_seek ? 1 : 0.15) }, w: 24, star: true, title: '签名之前',
    text: (S) => (S.vars.by_hadInvitation ? '那封搁置的图书馆邀请函仍在。' : '图书馆的邀请函出现在你整理委托的桌上。') + '你先没有碰末尾的签名处，而是拿出纸，列出装备、同行者和想找的书。窗外有人推着货车经过，轮子磕过门槛的声音让你停了一下笔。',
    eff: [S => { S.vars.by_hadInvitation = !!S.flags.library_invited; }, { flag: ['library_invited', 'by_inv_prep'] }], choices: [
      { t: '先核对装备', r: '你把邀请函压在清单下面。纸上的签名处一直空着，外面修理铺还没关门。', eff: { next: 'by_lib_gear' } },
      { t: '封好信不再准备', r: '你把封口粘了两遍，将清单折好压在信下。夜里纸封轻轻翘起，你又伸手按平。', eff: { mind: 2, dist: 2 } },
    ] },
  { id: 'by_lib_gear', manual: true, req: { wy: [0, 0], flag: 'by_inv_prep' }, title: '修理清单',
    text: '工坊技师把你的装备拆在绒布上。他不保证这些能应付图书馆，只保证接口不会在今天松开。备用件要两万眼。他拧紧最后一处接口，让你亲手试试松紧。',
    choices: [
      { t: '购置备用件', req: { money: [20000, null] }, r: '你付钱买下备用件，逐个试过接口。技师把剩下的绒布也给了你。', eff: { money: -20000, flag: 'by_lib_equipped', next: 'by_lib_team' } },
      { t: '只做最低限度检修', r: '你换掉最松的两颗螺丝，把剩余的钱留作应急。备用接口仍有磨损。', eff: { money: -3000, next: 'by_lib_team' } },
    ] },
  { id: 'by_lib_team', manual: true, req: { wy: [0, 0], flag: 'by_inv_prep' }, title: '各自的签名',
    text: '两个也拿着邀请函的收尾人愿意同行，但要先谈书的分法。一个想拿知识，另一个只想拿书去换钱。三个人围着桌子，谁都没有先碰那支笔。',
    choices: [
      { t: '付费约定互相掩护', req: { money: [12000, null] }, res: [
        { w: 4, r: '他们收下钱，与你反复练习换位和掩护。最后一次有人漏看手势，你们便从头再练一遍。', eff: { money: -12000, flag: 'by_lib_team', next: 'by_lib_intel' } },
        { w: 1, r: '其中一人拿钱后离开，另一个也不再愿意等。你追到街口，只看见人群，回来时茶已经凉了。', eff: { money: -12000, mind: -2, next: 'by_lib_intel' } },
      ] },
      { t: '各找各的书', r: '谈话到这里结束。你不必分出收获，也不会有人按手势拉你一把。', eff: { mind: -1, next: 'by_lib_intel' } },
    ] },
  { id: 'by_lib_intel', manual: true, req: { wy: [0, 0], flag: 'by_inv_prep' }, title: '二手情报',
    text: '情报贩子卖的是从别人的准备笔记里抄来的资料。他没有进去过，纸上有好几处互相矛盾。一张接待示意图的页边写着“回来后补全”，下面却一行字也没有。',
    choices: [
      { t: '花钱核对资料来源', req: { money: [8000, null] }, check: { s: 'wit', dc: 45 }, eff: { money: -8000, next: 'by_lib_threshold' }, ok: { r: '你找出拼接的几段，把它们划掉。剩下的资料不多，几份笔记提到的进攻方向却能对上。', eff: { flag: 'by_lib_intel', wit: 1 } }, no: { r: '每一层抄本都指向另一层。你只拿到一叠纸，边角的批注也被抄错了。', eff: { mind: -2 } } },
      { t: '只抄公开的失踪名单', r: '名字占满一页。你把这页折进邀请函，付清复印费，没买那张示意图。', eff: { money: -500, mind: -1, next: 'by_lib_threshold' } },
    ] },
  { id: 'by_lib_threshold', manual: true, req: { wy: [0, 0], flag: 'by_inv_prep' }, star: true, title: '落笔处',
    text: '准备已做完，邀请函仍和刚收到时一样干净。你把装备放在桌边，又核对一次自己想要的书。笔尖悬在纸上，备用件贴着手腕，金属还是凉的。屋外的脚步声渐渐稀了。',
    choices: [
      { t: '签名进入图书馆', hint: '失败可能成为书；进门后无法自由退出', r: '笔尖离开纸时，周围的陈旧气味换成纸张的气味。你站在陌生地面上，桌子已经不在脚边。', eff: { flag: 'by_lib_entered', next: 'by_lib_shelves' } },
      { t: '收起笔取消赴邀', r: '你承担了准备的花费。今晚仍要回原来的地方睡觉，门锁也仍是那一把。', eff: { mind: 3, dist: -3 } },
    ] },
  { id: 'by_lib_shelves', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered' }, title: '想找的书',
    text: '书架沿着光亮延伸。你看见几本书的标题，正好对应自己想学的本领。远处有司书的身影，接待场地的灯光依次亮起，你握紧装备，走向亮处。',
    choices: [
      { t: '寻找战斗经验的书', r: '你记下那本书的位置。接待场地亮了起来，路上没有可以先试读的桌子。', eff: { flag: 'by_lib_seek_skill', next: 'by_lib_reception' } },
      { t: '寻找谋生技术的书', r: '书名里的术语你只懂一半。你记住书脊颜色，转向亮起来的场地。', eff: { flag: 'by_lib_seek_trade', next: 'by_lib_reception' } },
    ] },
  { id: 'by_lib_reception', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered' }, title: '接待开始',
    text: '灯光下的地面很平，没有适合埋伏的杂物。你迈出第一步就听见身侧的破空声。这里没有可供等待的旁观席，书架在远处，退路却不在原来的方向。',
    choices: [
      { t: '稳住站位再还击', check: { s: ['skill', 'mind'], dc: 62, mod: (S) => (S.flags.by_lib_equipped ? 0.12 : 0) + (S.flags.by_lib_team ? 0.1 : 0) }, ok: { r: '第一轮攻势过去，你仍站着。装备的接口发烫，书架还在视线边缘。', eff: { body: -5, flag: 'by_lib_opening', next: 'by_lib_verdict' } }, no: { r: '你错过半步，伤口从衣料下裂开。下一次攻势到来前，还来得及改变做法。', eff: { body: -10, mind: -3, next: 'by_lib_wound' } } },
      { t: '抢先打出缺口', check: { s: ['skill', 'body'], dc: 68, mod: (S) => S.flags.by_lib_intel ? 0.15 : 0 }, ok: { r: '你抢到一次出手的空隙，也挨了一记反击。灯光另一侧的脚步终于停顿。', eff: { body: -8, flag: 'by_lib_opening', next: 'by_lib_verdict' } }, no: { r: '对面的动作比笔记里更快。你收回手时，已经无法像进来时那样握稳。', eff: { body: -12, mind: -4, next: 'by_lib_wound' } } },
    ] },
  { id: 'by_lib_wound', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered' }, title: '缺了一拍',
    text: '你借着短暂空隙压住伤口。受伤的手臂抬不起来，只能不断侧身避开攻势。再撑一轮或许还能拿到书；若想省下体力熬到结束，就得丢掉沉重的装备，放弃争取收获。',
    choices: [
      { t: '带伤赌最后一轮', r: '你松开压伤口的手，把能动的部分重新摆回站位。地面已经很滑。', eff: { mind: -3, next: 'by_lib_verdict' } },
      { t: '弃下装备专心求生', check: { s: ['wit', 'mind'], dc: 52, mod: (S) => S.flags.by_lib_team ? 0.12 : 0 }, ok: { r: '你丢掉的装备已无法取回，伤口也还在流血。撑到接待结束后，你被送回街边，手里没有书。', eff: { money: -30000, body: -6, next: 'by_lib_loss' } }, no: { r: '你扔下装备，却没换来下一次呼吸的空隙。灯光忽然离得很远。', eff: { next: 'by_lib_book' } } },
    ] },
  { id: 'by_lib_verdict', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered' }, title: '最后一轮',
    text: '接待还没有结束。对面的攻势又从同一个方向袭来，这次你必须及时避开，才能还击。想要的书还在远处架上，你先把目光收回，盯住逼近的武器。',
    choices: [
      { t: '按准备过的节奏完成', check: { s: ['skill', 'mind'], dc: 68, mod: (S) => (S.flags.by_lib_opening ? 0.12 : 0) + (S.flags.by_lib_intel ? 0.12 : 0) + (S.flags.by_lib_equipped ? 0.08 : 0) }, ok: { r: '你避开最后一击，抓住空隙还击。接待终于结束，获准带走的书放在面前，你却很久才松开紧绷的手。', eff: { body: -6, next: 'by_lib_return' } }, no: { r: '你认出了动作，身体却已经跟不上。那本书的颜色在视野里慢慢淡去。', eff: { next: 'by_lib_book' } } },
      { t: '舍弃余力只求站到最后', check: { s: ['body', 'mind'], dc: 55 }, ok: { r: '你护着要害撑到接待结束，没有拿到书。回到街边时，腿还在发抖，连自己的脚步声也听不清了。', eff: { body: -10, next: 'by_lib_loss' } }, no: { r: '最后一点力量没有撑过这轮接待。你倒下时，地面没有想象中那么冷。', eff: { next: 'by_lib_book' } } },
    ] },
  { id: 'by_lib_book', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered' }, star: true,
    text: '你的视野压成一条很细的亮线。最后一页合上，书脊留下了你的名字。门外还留着你的行李，备用外衣搭在椅背上，袖口沾着修理铺的铁屑。',
    eff: { job: { id: 'book' }, flag: 'library_book', ach: 'by_book', death: '在图书馆的接待中成为了一本书。' } },
  { id: 'by_lib_return', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered', noflag: 'library_book' }, title: '带回街上的重量',
    text: '你抱着赢得的书回到街上。修理铺已经落锁，门前的灯照着你衣袖上尚未干透的血。翻开书时，几行叙述让你想起刚才的交战。手抖得翻不动下一页，你只好先把它合上。',
    eff: { flag: ['library_returned', 'by_lib_won'], fame: 5, mind: -5, ach: 'by_pages', queue: ['by_lib_after', 2] }, choices: [
      { t: '研读战斗经验', req: { flag: 'by_lib_seek_skill' }, r: '你把书分成几段读完。几种动作终于能做出来，夜里却常因同一个躲闪姿势惊醒。', eff: { skill: 12, body: -3, dist: 3 } },
      { t: '研读谋生技术', req: { flag: 'by_lib_seek_trade' }, r: '你终于读懂那些术语。试做成功的零件摆满小桌，返工耗掉的钱也不少。', eff: { wit: 10, skill: 3, money: -12000, dist: 2 } },
      { t: '把书卖给事先联系的买家', r: '买家不问伤口，只检查封面。钱足够换一套装备，你数了三遍才肯松手。', eff: { money: 100000, mind: -3, flag: 'by_lib_sold' } },
    ] },
  { id: 'by_lib_loss', manual: true, req: { wy: [0, 0], flag: 'by_lib_entered', noflag: 'library_book' }, title: '活着回到门外',
    text: '你回到熟悉的街边，听不清左侧传来的声音。手里没有书，走回住处的路却记得。房东隔着门喊了几句，又指指日历上圈出的日期。你这才想起房租还没交。',
    eff: { flag: ['library_returned', 'by_lib_loss'], mind: -6, social: -4, dist: 6, queue: ['by_lib_after', 2] }, choices: [
      { t: '先去诊所检查', r: '医生处理了伤口，没保证听力能恢复。你领药时站到窗口另一侧，重新听了一遍用法。', eff: { money: -20000, body: 3 } },
      { t: '先交房租保住住处', r: '你交完房租，扶着门框坐下，伤口还没处理。房东关门那一下，你只听见很闷的一声。', eff: { money: -6000, mind: 1, body: -3 } },
    ] },
  { id: 'by_lib_after', manual: true, req: { wy: [1, null], flag: 'library_returned', nojob: 'distorted', anyflag: ['by_lib_won', 'by_lib_loss'] }, title: '两年后的整理',
    text: (S) => S.flags.by_lib_loss ? '两年后，你清理衣柜，翻出赴邀那天留下的空书袋。听力没有完全回来，袋内还塞着当年的准备笔记。你倒出纸页，掉在身旁的几张仍听不见声响。' : S.flags.by_lib_sold ? '两年后，买家又来问你还有没有书。当年的钱早已用掉大半，只剩准备笔记和几页读书摘抄。买家把摘抄翻了两遍，问这些肯不肯卖。' : '两年后，你整理那本带回来的书。常翻的几页已经起毛，另一本笔记里抄着你读过的段落。现在有人愿意收购这些摘抄，条件是连当年的接待记录一起交出。',
    choices: [
      { t: '留下手里的纸张', r: '你把笔记重新归好，抚平折角，放回柜里。这次没有进账，夜里也没再被翻找纸页的声音惊醒。', eff: { mind: 2, dist: -3 } },
      { t: '出售剩余的接待记录', check: { s: 'social', dc: 48 }, ok: { r: '对方按残缺资料付款。你删掉住址，再把那段经历从头说了一遍。', eff: { money: 14000, mind: -3, dist: 2 } }, no: { r: '对方只想听到保证生还的办法。你说没有，他便拒绝交易，你白花了来回的车钱。', eff: { money: -3000, mind: -2 } } },
    ] },

  // 光的余波：仅写居民能观察到的变化；不把传闻当作确定机制。
  { id: 'by_song', age: [12, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 12, title: '邻居的新曲调',
    text: '邻居说自从见过那道光，睡梦里总有一小段曲调。他白天在门边哼，夜里也哼，唱到同一处就停。隔壁开始把空箱子贴在墙上，问你有没有便宜的隔音材料。',
    choices: [
      { t: '试着替他记下曲调', r: '你请他反复哼到天亮，仍少了末尾几拍。你把记谱的纸贴在纸箱背面，邻居又把箱子靠回墙上。', eff: { mind: -2, wit: 2, flag: 'by_song_written', queue: ['by_song_wall', 3] } },
      { t: '凑钱加装隔音板', r: '木板隔去一半声音。你睡得好了些，邻居却不再在楼道里和你说话。', eff: { money: -6000, mind: 2, social: -1 } },
    ] },
  { id: 'by_song_wall', manual: true, req: { wy: [1, null], flag: 'by_song_written', nojob: 'distorted' }, title: '隔音账单',
    text: '三年后，那位邻居已经搬走。新租客拆下隔音用的空箱子，发现背面还贴着你记的谱。房东正要把纸板拿去垫油漆桶，见你伸手便开了价。末尾仍缺同样几拍。',
    choices: [
      { t: '付钱取回写字的纸板', r: '你把纸板裁小，夹进旧本子。当天夜里没有听见曲调，隔壁的水龙头却一直在漏。', eff: { money: -4000, mind: 2, ach: 'by_unfinished' } },
      { t: '帮忙清理抵扣费用', check: { s: 'body', dc: 35 }, ok: { r: '你帮忙刮掉墙上的胶，房东把纸板给了你，没再要钱。新租客刷上白漆，等着味道散去。', eff: { body: -3, wit: 1, dist: -2 } }, no: { r: '胶下面的墙皮一块块掉落。你划破了手，还得赔钱补墙，纸板已被油漆浸透。', eff: { body: -3, money: -5000, mind: -1 } } },
    ] },
  { id: 'by_scan', age: [16, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 11, title: '重叠的底片',
    text: '诊所拿出你照过的片子，说同一张里有两层轮廓。你想起听人说过的那阵不分昼夜的光，医生却说也可能是设备故障。他把原片举到灯前，问你愿不愿意把它留下抵检查费。',
    choices: [
      { t: '付费保管原片等待复查', r: '你付清检查费，买了防潮袋把原片带走。医生让你下次复查时带来，别急着解释那两层轮廓。', eff: { money: -3000, flag: 'by_scan_saved', queue: ['by_scan_again', 2] } },
      { t: '让诊所留下片子', res: [
        { w: 3, r: '医生退还了已收的检查费，留下片子。下一位病人进去前，他先把设备擦了一遍。', eff: { money: 2000, wit: 1 } },
        { w: 1, r: '隔天片子被夹进宣传册，名字遮得不太严实。你花钱让他们撤掉那一页。', eff: { money: -4000, mind: -2, dist: 2 } },
      ] },
    ] },
  { id: 'by_scan_again', manual: true, req: { wy: [1, null], flag: 'by_scan_saved', nojob: 'distorted' }, title: '复查日',
    text: '两年后，诊所换了机器。新片上的轮廓很清楚，旧片的第二层却仍在。医生没法给它命名，病历写着“待观察”。你看见这个词下面还有上次的日期。',
    choices: [
      { t: '接受无结论的复查', r: '你付了检查费，把两张片子放在一起。防潮袋刚好装得下，不必另买。', eff: { money: -5000, mind: 2, dist: -3 } },
      { t: '出售匿名的对照资料', check: { s: 'wit', dc: 45 }, ok: { r: '你先删掉所有个人信息，再收取资料费。买家得到两张片子，没有得到你想要的解释。', eff: { money: 8000, wit: 2 } }, no: { r: '日期和门诊编号仍能对上。你撤回资料，白付了一笔整理费。', eff: { money: -3000, mind: -2 } } },
    ] },
  { id: 'by_box', age: [16, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 12, title: '没带走的工具箱',
    text: '邻居搬走时留下一个工具箱。他说被光照过以后，始终觉得该去做别的事，却说不清是什么。箱里工具码得很齐，最底层是一张没有写收件人的明信片。',
    choices: [
      { t: '替他保管工具箱', r: '你把箱子塞进床下，交了额外的储物费。他说等有了地址就寄明信片回来。', eff: { money: -2000, flag: 'by_box_kept', queue: ['by_box_heir', 3] } },
      { t: '当场折价买下工具', r: '他拿钱补了路费。你换掉生锈的扣件，把明信片还给他，没有问目的地。', eff: { money: -6000, skill: 2, wit: 2 } },
    ] },
  { id: 'by_box_heir', manual: true, req: { wy: [1, null], flag: 'by_box_kept', nojob: 'distorted' }, title: '来领箱子的人',
    text: '三年后，来领工具箱的是个年轻人。他带来一张明信片，背面写着箱扣断在哪一侧。原主人死在路上，卡片绕过好几个地址才寄到。他在门口等你找钥匙。',
    choices: [
      { t: '核对细节交还工具', check: { s: 'wit', dc: 38 }, ok: { r: '他知道最底层少了哪把扳手。你把箱子交给他。他换了几次手才提稳，箱底在门槛上轻轻磕了一下。', eff: { mind: 2, social: 1, ach: 'by_box_return' } }, no: { r: '有个细节对不上，你们改约白天再核实。你请人来辨认卡片，又花了一笔钱，箱子仍留在床下。', eff: { money: -2000, mind: -2 } } },
      { t: '收取三年的保管费', r: '他数的钱不够，你收下凑出来的五千眼。拿走箱子后，他没再问有没有别的遗物。', eff: { money: 5000, mind: -2, dist: 2 } },
    ] },
  { id: 'by_seed_rumor', age: [14, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 11, title: '从光里长出的东西',
    text: '夜校里有人说，那道光在每个人心里留了会生长的东西。他拿不出证据，带来的却是一整包付费讲义。你翻开一页，白夜黑昼的日期旁边印着新的收款号码。',
    choices: [
      { t: '付费听完再核对出处', check: { s: 'wit', dc: 42 }, eff: { money: -2000 }, ok: { r: '几段材料来自旧报，余下的全是他的猜测。你圈出来源，课后有人向你借那页看。', eff: { wit: 3, social: 1 } }, no: { r: '他把每次追问都指向下一堂课。你收起讲义，没留下预订费用。', eff: { mind: -2, dist: 2 } } },
      { t: '留下来擦完教室桌子', r: '老师免了当天场地费，传闻还是没有出处。你换了一盆水，洗掉桌上的粉笔字。', eff: { body: -2, mind: 2 } },
    ] },
  { id: 'by_dream_market', age: [16, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 10, title: '梦的登记处',
    text: '有人收集在那道光之后反复出现的梦。报酬按描述长度算，重复的梦只收一份。你前面的人讲了一座楼梯，记录员打开一摞资料，说这座今天已经收过了。',
    choices: [
      { t: '如实描述自己的梦', res: [
        { w: 3, r: '记录员付了很少的钱，问你能不能标出每次醒来的时刻。你回去后先藏起了床边的钟。', eff: { money: 3000, mind: -1, dist: 1 } },
        { w: 1, r: '同样的梦已经登记过。记录员不能告诉你是谁，你也没能拿到报酬。', eff: { mind: -2, dist: 3 } },
      ] },
      { t: '应聘整理匿名资料', check: { s: 'wit', dc: 40 }, ok: { r: '你把相似的描述放在一起。几夜没睡好，月底的临时工钱却按时到账。', eff: { money: 7000, mind: -3, wit: 2 } }, no: { r: '你把两份不同的描述订到一起。试工没通过，还赔了一盒装订针。', eff: { money: -500, mind: -1 } } },
    ] },
  { id: 'by_shift', age: [18, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 12, title: '忽然改行的人',
    text: '熟识的店员辞职去学修钟。他说见过那道光后，收银机的响声每天都让他难以忍受。老板扣了工资，要求有人替他补完今晚的班，才肯还押在店里的材料。',
    choices: [
      { t: '替他补完夜班', r: '你守到店铺关门，替他领回材料。他只凑出一千眼，另把第一张练习用的钟面留给你，边缘还没磨平。', eff: { body: -3, money: 1000, social: 2, dist: -2 } },
      { t: '买下他留下的工装', r: '钱够他补一点材料费。工装袖口印着店名，擦了几次也去不掉。', eff: { money: -3000, body: 1, mind: 1 } },
    ] },
  { id: 'by_lamp', age: [12, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 10, title: '必须亮着的灯',
    text: '楼上的住户自从那段不分昼夜的日子后，就不肯关灯睡觉。漏光照进你的窗，电费也被房东摊给整层。他已经换成最小的灯泡，仍觉得不够亮。',
    choices: [
      { t: '凑钱装遮光帘', r: '窗户暗下来了，走廊还亮着。你们各出一半钱，谁也没再说对方睡得容易。', eff: { money: -3500, mind: 2, social: 1 } },
      { t: '要求电费单独计量', check: { s: 'social', dc: 42 }, ok: { r: '房东退回多摊给你的两千眼，换了计费办法。楼上的灯变得更暗，但没有彻底熄过。', eff: { money: 2000, mind: -1 } }, no: { r: '争执拖了整晚，电费照摊。你花钱补了门缝，灯光仍从窗边漏进来。', eff: { money: -2000, mind: -2, dist: 1 } } },
    ] },
  { id: 'by_photo', age: [12, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 10, title: '曝光的合照',
    text: '照相馆挂出一张那段日子留下的合照，大半张都被光遮白了。拍照的人记得自己站在哪儿，老板却说客人记错了楼层。两人在橱窗前比画，指向同一块空白。',
    choices: [
      { t: '付钱翻拍空白的那一角', r: '你拿到一张几乎没有内容的照片。背面仍盖着日期章，足够证明那天照相馆开过门。', eff: { money: -1000, mind: 1, wit: 1 } },
      { t: '帮忙辨认残留的背景', check: { s: 'wit', dc: 38 }, ok: { r: '你从栏杆缺口认出位置。老板承认是自己记错了。客人把照片卷起，抱在胳膊里，走前向你点了点头。', eff: { social: 2, dist: -2 } }, no: { r: '你认错了楼层。他们重新争起来，你在卷帘门落下前离开。', eff: { mind: -1, social: -1 } } },
    ] },
  { id: 'by_support', age: [16, 100], req: { wy: [1, null], nojob: 'distorted' }, w: 11, title: '互相确认',
    text: '几个居民每周在面馆碰面，讲那些光照之后说不清的变化。今天有个人没有来，碗却已经点好了。店主问谁付这碗的钱，桌上的人各自低头找零钱。',
    choices: [
      { t: '付账后去确认缺席的人', res: [
        { w: 4, r: '他只是换了班，睡过头了。你把冷掉的面留在门口，回去时面馆已经收桌。', eff: { money: -2000, body: -1, mind: 2 } },
        { w: 1, r: '门已经被封起来。你把名字从下周的点菜单上划去，没有拿到更多消息。', eff: { money: -2000, mind: -3, dist: 3 } },
      ] },
      { t: '分摊面钱等下次碰面', r: '店主把面分进几只碗。有人约好下次提早来，空椅子一直留到打烊。', eff: { money: -500, social: 1, mind: -1 } },
    ] },
]);

CITY.addAch({
  by_neighbor: { name: '坏灯的两端', desc: '与另一个扭曲体暂时划定各自停留的地方。', tier: 'rare', group: '扭曲与光', hidden: true, hint: '通道里有两种呼吸声。' },
  by_name: { name: '袋子里的旧衣服', desc: '扭曲后回应认出自己的家人。', tier: 'epic', group: '扭曲与光', hidden: true, hint: '封锁带外，有人还在喊。' },
  by_rating: { name: '第三张通告', desc: '在数年间经历都市怪谈到都市恶疾的评级变化。', tier: 'epic', group: '扭曲与光', hidden: false },
  by_human: { name: '再次吸气', desc: '在最后一次录音试验中极罕见地恢复人形。', tier: 'myth', group: '扭曲与光', hidden: true, hint: '墙上的灯还留着一个小洞。' },
  by_ledger: { name: '九栏之外', desc: '靠原始记录核清E.G.O使用后的赔偿责任。', tier: 'uncommon', group: '扭曲与光', hidden: false },
  by_answer: { name: '先修水管', desc: '面对三年前的答复，学会与仍在的声音共处。', tier: 'epic', group: '扭曲与光', hidden: true, hint: '旧纸张上，有一句让你不愿再读。' },
  by_book: { name: '椅背上的外衣', desc: '经过准备后仍在图书馆接待中成为书。', tier: 'rare', group: '扭曲与光', hidden: true, hint: '出门前，椅背上还搭着一件衣服。' },
  by_pages: { name: '街上的书页', desc: '经历完整接待后带着想要的书回到街上。', tier: 'legend', group: '扭曲与光', hidden: true, hint: '先收好清单，再决定落笔。' },
  by_unfinished: { name: '少了几拍', desc: '三年后领回记着邻居曲调的纸板。', tier: 'uncommon', group: '扭曲与光', hidden: false },
  by_box_return: { name: '断扣的那一侧', desc: '保管三年后将工具箱交给核实过的领取人。', tier: 'uncommon', group: '扭曲与光', hidden: false },
});
