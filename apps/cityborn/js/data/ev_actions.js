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
    date: { name: '去认识一个人', desc: '在都市里，孤独是一种奢侈', req: { age: [18, 60], spouse: false, nojob: ['distorted', 'book'] }, ev: 'act_date', cd: 2 },
    propose: { name: '求婚', desc: '和那个人一起过下去', req: { age: [18, 70], spouse: false, flag: 'act_dating' }, ev: 'act_propose', cd: 1 },
    child: { name: '要一个孩子', desc: '让另一个人来到都市', req: { age: [20, 48], spouse: true, nojob: ['distorted', 'book'] }, ev: 'act_child', cd: 3 },
    office: { name: '开一家事务所', desc: '自己当代表', req: { job: 'fixer', rank: [1, 5], noflag: 'office_own', money: [W(100), null] }, ev: 'fx_open_office', cd: 3 },
    retire: { name: '退休', desc: '放下这一切', req: { age: [45, 130], nojob: ['none', 'student', 'retired', 'distorted', 'book', 'finger'] }, ev: 'act_retire', cd: 1 },
    // ---------- 稀有路线的主动入口 ----------
    seekLib: { name: '打听图书馆的邀请函', desc: '据说进去的人能得到想要的书', req: { age: [16, 90], wy: [0, 0], noflag: ['library_invited', 'library_seek'], nojob: ['distorted', 'book'] }, pre: { flag: 'library_seek' }, ev: 'act_seeklib', cd: 1 },
    kk: { name: '去黑云会拜门', desc: '需要一手好刀法', req: { age: [16, 45], loc: 'backstreet', st: { skill: [40, null] }, nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'wing', 'distorted', 'book'], noflag: ['kk_member', 'finger_quit'] }, ev: 'sy_kk_gate', cd: 3 },
    blade: { name: '寻找剑契组', desc: '贫穷而骄傲的剑客们', req: { age: [16, 50], loc: 'backstreet', any: [{ flag: 'blade_contact' }, { trait: '剑术天分' }, { st: { skill: [50, null] } }], nojob: ['syndicate', 'finger', 'kurokumo', 'blade', 'heishou', 'wing', 'distorted', 'book'], noflag: 'blade_member' }, ev: 'sy_blade_gate', cd: 3 },
    finger: { name: '托人引荐给手指', desc: '一旦进去，就很难出来', req: { age: [18, 50], job: 'syndicate', st: { skill: [40, null] }, noflag: ['finger_member', 'finger_quit'] }, ev: (S) => { const g = ['sy_thumb_gate', 'sy_index_gate', 'sy_middle_gate', 'sy_ring_gate']; return g[Math.floor(S.rng.next() * g.length)]; }, cd: 4 },
    hunt: { name: '主动接高风险委托', desc: '功绩与名声来得更快，也更容易死', req: { job: 'fixer', age: [18, 70] }, ev: 'act_hunt', cd: 2 },
    donate: { name: '捐给孤儿院', desc: '把钱交给需要的人', req: { age: [18, 130], money: [W(50), null] }, ev: 'act_donate', cd: 3 },
  };
  CITY.actionList = (S) => Object.keys(CITY.ACTIONS).filter((k) => {
    const A = CITY.ACTIONS[k];
    if (A.cd && S.last['act_' + k] != null && S.age - S.last['act_' + k] < A.cd) return false;
    return CITY.test(S, A.req);
  });

  const newDistrict = (S) => { let d; do { d = S.rng.int(1, 25); } while (d === S.d); S.d = d; S.home = d + '区后巷'; };

  CITY.addEvents('actions', [
    { id: 'act_seeklib', manual: true, title: '邀请函',
      text: '你去旧L公司附近转了几天。路边有人兜售“邀请函的门路”，也有人劝你别找死。一个落魄的收尾人说，图书馆会把邀请函寄给“有故事的人”——名气越大，越容易收到。',
      choices: [
        { t: '把自己的名字留在事务所的公告栏上', eff: { fame: 4, flag: 'library_seek' }, r: '你在好几家事务所的公告栏上留了名字和住址。几天后，有人开始在街上多看你两眼。' },
        { t: '花钱买“门路”', req: { money: [30000, null] }, res: [
          { w: 1, r: '卖门路的人收了钱，第二天就不见了。不过，你的名字确实传开了——作为一个上当的傻子。', eff: { money: -30000, fame: 2, flag: 'library_seek' } },
          { w: 1, r: '那人把你的名字写进了一份名单，说名单会“送到该送的地方”。你不知道那是什么意思。', eff: { money: -30000, flag: 'library_seek' } },
        ] },
        { t: '还是算了', eff: { unflag: 'library_seek' }, r: '你转身离开。身后那栋建筑的窗户里，似乎有灯光闪了一下。' },
      ] },
    { id: 'act_hunt', manual: true, title: '高风险委托',
      text: (S) => '你去事务所的公告栏前挑委托，专挑那些别人不敢接的。报酬栏上的数字很好看，情报栏却写得很空。以你现在' + S.job.rank + '阶的身手——',
      choices: [
        { t: '接下最危险的那一份', check: { s: ['skill', 'body'], dc: 55, mod: (S) => (9 - S.job.rank) * 0.02 },
          ok: { r: '你活着回来了。事务所的人看你的眼神变了，协会的评级记录上多了一行字。', eff: [(S) => { const p = Math.round(([0, 450, 220, 110, 60, 30, 15, 9, 6, 3.5][S.job.rank] || 3) * 15000); S.money += p; }, { merit: 3, fame: 4, cnt: { req: 2 }, skill: 2 }] },
          no: { r: '情报是错的。你拖着伤回到事务所，委托被判定为失败。', eff: { body: -15, mind: -5, fame: -2, risk: [0.15, '主动接下了一份没人敢接的委托，没能回来。'] } } },
        { t: '挑一份稳妥些的', check: { s: ['skill', 'wit'], dc: 40 },
          ok: { r: '委托顺利完成。不算漂亮，但足够扎实。', eff: { merit: 2, fame: 1, cnt: { req: 1 } } },
          no: { r: '出了点岔子，好在没有大碍。', eff: { body: -5, merit: 1 } } },
      ] },
    { id: 'act_findjob', manual: true, title: '找工作',
      text: '你翻遍了电线杆上的招工启事，又托熟人问了一圈。有几个地方愿意要你。',
      choices: [
        { t: '工坊学徒', req: { any: [{ trait: '巧手' }, { st: { wit: [40, null] } }] }, eff: { job: { id: 'mech', org: '后巷工坊 学徒', rank: 0 } }, r: '师傅看了看你的手，扔给你一把扳手。' },
        { t: '诊所助手', req: { st: { wit: [50, null] } }, eff: { job: { id: 'doctor', org: '后巷诊所 助手', rank: 0 } }, r: '诊所的医生说，你只要不晕血就行。你第一天就见到了一整条被扯下来的手臂。' },
        { t: '巢里的外包公司', req: { st: { wit: [45, null] } }, check: { s: ['wit', 'social'], dc: 52 },
          ok: { r: '一家给翼做外包的公司录用了你。你每天要过两道检查站去上班。', eff: { job: { id: 'clerk', org: '巢内外包公司 职员' } } },
          no: { r: '面试官看了一眼你的住址，就把简历放到了另一摞里。', eff: { mind: -2 } } },
        { t: '餐馆帮厨', eff: { job: { id: 'chef', org: '后巷餐馆 帮厨', rank: 0 } }, r: '你每天在油烟里站十二个小时。' },
        { t: '便利店店员', eff: { job: { id: 'shop', org: '便利店 店员' } }, r: '店长把收银台下的铁棍指给你看。' },
        { t: '零工', eff: { job: { id: 'labor', org: '后巷零工' } }, r: '什么活都干，什么活都干不长。' },
      ] },
    { id: 'act_quit', manual: true, title: '辞职',
      text: (S) => '你在' + (S.job.org || '这份工作') + '干了' + S.job.years + '年。今天早上，你在门口站了很久，没有进去。',
      choices: [
        { t: '递交辞呈', eff: { job: { id: 'none' }, mind: 4 }, r: '你把工牌放在了桌上。走出门的时候，阳光很刺眼。' },
        { t: '还是算了', eff: { mind: -1 }, r: '你推开门，像往常一样走了进去。' },
      ] },
    { id: 'act_move', manual: true, title: '搬家',
      text: '你把所有家当塞进了三个箱子。搬家的车钱是一万眼，新住处的押金另算。',
      choices: [
        { t: '随便找个区', eff: [{ money: -30000, mind: 2 }, newDistrict], r: '你搬到了{home}。这里的面馆比原来的难吃一点，房租便宜一点。' },
        { t: '打听哪个区更太平', check: { s: 'social', dc: 45 },
          ok: { r: '有人给你推荐了{home}。这里的帮派规矩比较多，但至少讲规矩。', eff: [{ money: -40000, mind: 4 }, newDistrict] },
          no: { r: '你打听到的消息是错的。{home}比原来的地方乱得多。', eff: [{ money: -40000, mind: -3 }, newDistrict] } },
        { t: '不搬了', r: '你又把箱子拆开了。' },
      ] },
    { id: 'act_gonest', manual: true, title: '巢的居住资格',
      text: '巢的居住资格审查要三样东西：一大笔保证金、一份稳定收入证明、一位巢内居民的担保。中介说，前两样可以“想办法”。',
      choices: [
        { t: '花钱打点一切', check: { s: ['social', 'wit'], dc: 50 },
          ok: { r: '三个月后，你拿到了一张薄薄的居住证。巢里的空气闻起来像消毒水。', eff: { money: -2500000, loc: { loc: 'nest' }, fn: (S) => { S.wing = S.rng.pick(['K', 'R', 'T', 'W', 'U', 'N', 'J']); S.home = S.wing + '巢'; }, flag: 'moved_nest', mind: 3 } },
          no: { r: '中介带着你的保证金消失了。', eff: { money: -1500000, mind: -8, dist: 3 } } },
        { t: '算了', r: '你想了想，那笔钱够你在后巷活很多年。' },
      ] },
    { id: 'act_casino', manual: true, title: 'J公司赌场',
      text: '赌场里没有窗户，也没有钟。荷官的笑容是标准化的，筹码的兑换率每天都不一样。',
      choices: [
        { t: '小赌怡情（1万眼）', res: [
          { w: 4, r: '你输光了。走出赌场时，天已经亮了。', eff: { money: -10000 } },
          { w: 3, r: '你赢了一点，又输了回去。', eff: { money: -3000, mind: 1 } },
          { w: 2, r: '你赢了三万眼。荷官的笑容一点都没变。', eff: { money: 30000, mind: 2 } },
        ] },
        { t: '押上一半身家', res: [
          { w: 5, r: '你输了。', eff: { money: '-50%', mind: -6, dist: 3 } },
          { w: 4, r: '押下的那半份筹码翻了倍。周围的人开始用一种奇怪的眼神看你。', eff: { money: '50%', mind: 2, fame: 1 } },
          { w: 1, r: '你赢了一大笔。出门的时候，有两个人跟上了你。', eff: [{ money: '120%' }, { next: 'act_casino_after' }] },
        ] },
        { t: '借钱接着赌', req: { money: [null, 50000] }, res: [
          { w: 6, r: '你欠下了赌场的债。他们说，可以用别的东西还。', eff: { money: -300000, mind: -5, flag: 'casino_debt' } },
          { w: 1, r: '你一把翻身，还清了所有的债。你发誓再也不来了。', eff: { money: 300000 } },
        ] },
      ] },
    { id: 'act_casino_after', manual: true, title: '跟踪',
      text: '那两个人在第三个路口加快了脚步。',
      choices: [
        { t: '跑', check: { s: 'body', dc: 50 }, ok: { r: '你钻进了一家通宵营业的面馆，从后门溜走了。', eff: { body: -1 } }, no: { r: '他们追上了你，拿走了大半的钱。', eff: { money: '-60%', body: -6 } } },
        { t: '回头面对他们', check: { s: 'skill', dc: 55 }, ok: { r: '他们看清了你的眼神，转身走了。', eff: { fame: 1 } }, no: { r: '你被打断了两根手指，钱也没了。', eff: { money: '-70%', body: -8 } } },
        { t: '分他们一半', eff: { money: '-50%' }, r: '他们数了数钱，满意地走了。这在后巷叫“过路费”。' },
      ] },
    { id: 'act_pros', manual: true, title: '义体诊所',
      text: '诊所的墙上挂满了义体样品：手臂、腿、眼球、脊椎。医生戴着一只闪着蓝光的义眼，说你的身体“还有很多可以改进的地方”。',
      choices: [
        { t: '廉价的二手义体（30万眼）', eff: { money: -300000, pros: 1 }, res: [
          { w: 6, r: '新手臂的接口有点松，但能用。', eff: { body: 4, skill: 2, mind: -2 } },
          { w: 3, r: '装上之后，你总觉得它在夜里自己动。', eff: { body: 3, mind: -4, dist: 3 } },
          { w: 1, r: '排异反应让你在床上躺了一个月。', eff: { body: -8, mind: -3 } },
        ] },
        { t: '工坊正品（120万眼）', req: { money: [1200000, null] }, eff: { money: -1200000, pros: 1, body: 8, skill: 4, mind: -2 }, r: '手术很顺利。你握了握拳，听见了精密齿轮转动的声音。' },
        { t: '义眼（50万眼）', req: { money: [500000, null] }, eff: { money: -500000, pros: 1, wit: 4, skill: 2, mind: -2 }, r: '世界变得很清楚，清楚得有点过分。' },
        { t: '我再想想', r: '医生耸耸肩：“下次来的时候，可能就不是你自己走进来的了。”' },
      ] },
    { id: 'act_clinic', manual: true,
      text: '你去诊所做了一次全面的治疗。医生在账单上写了很长一串数字。',
      eff: [{ money: -20000 }, (S) => { const g = Math.min(20, 55 - S.st.body); S.st.body += Math.max(5, g); if (S.money > 500000 && S.st.body < 50) { S.money -= 150000; S.st.body += 10; } }] },
    { id: 'act_dojo', manual: true, title: '拜师',
      text: '你打听到几个愿意收徒的人：一个退休的收尾人，一个来历不明的剑客，还有一家正规的格斗道场。',
      choices: [
        { t: '跟退休收尾人学（5万眼）', eff: { money: -50000, skill: 6, body: 2, flag: 'fixer_dream' }, r: '他教你的第一课是：“打不过就跑，跑不掉就装死。”第二课才是怎么出刀。' },
        { t: '跟来历不明的剑客学', req: { any: [{ trait: '剑术天分' }, { flag: 'blade_contact' }, { flag: 'saw_blade' }] }, check: { s: 'mind', dc: 45 },
          ok: { r: '他只教你一招，你练了一整年。年底，他说你可以去找“剑契组”的人了。', eff: { skill: 10, flag: 'blade_contact', trait: '剑术天分' } },
          no: { r: '你受不了他的沉默和他的刀，半年后就走了。', eff: { skill: 3 } } },
        { t: '去正规道场（15万眼）', req: { money: [150000, null] }, eff: { money: -150000, skill: 5, body: 4, social: 2 }, r: '道场很干净，教练很专业，学员里有一半是巢里来的有钱人。' },
      ] },
    { id: 'act_school', manual: true,
      text: '你报名了夜校。白天干活，晚上上课，回家的路上要算好时间，绝不能拖到三点。',
      eff: { money: -30000, wit: 6, body: -1, flag: ['literate', 'schooled'] } },
    { id: 'act_date', manual: true, title: '相识',
      text: (S) => S.loc === 'nest' ? '同事给你安排了一场相亲。对方准时到了，第一个问题是你的年收入，第二个问题是你有没有债。' : '常去的面馆里，有个人每天都和你在同一时间出现，坐在同一个位置。今天，只剩下你旁边那一个空座了。',
      choices: [
        { t: '主动搭话', check: { s: 'social', dc: 42 },
          ok: { r: '你们聊到面馆打烊。临走时，对方说了自己的名字：{lover}。', eff: [(S) => { S.vars.lover = CITY.randName(S.rng, S.gender === 'm' ? (S.rng.chance(0.85) ? 'f' : 'm') : (S.rng.chance(0.85) ? 'm' : 'f')); }, { flag: 'act_dating', mind: 4 }] },
          no: { r: '对方礼貌地笑了笑，低头继续吃面。', eff: { mind: -2 } } },
        { t: '请对方吃一顿', req: { money: [10000, null] }, check: { s: ['social', 'money'], dc: 35 },
          ok: { r: '对方犹豫了一下，接受了。你们约好下周再见。对方叫{lover}。', eff: [(S) => { S.vars.lover = CITY.randName(S.rng, S.gender === 'm' ? (S.rng.chance(0.85) ? 'f' : 'm') : (S.rng.chance(0.85) ? 'm' : 'f')); }, { flag: 'act_dating', money: -10000, mind: 3 }] },
          no: { r: '对方说不用了，自己付了钱。', eff: { mind: -2 } } },
        { t: '算了', r: '你吃完面，和往常一样一个人回家。' },
      ] },
    { id: 'act_propose', manual: true, title: '求婚',
      text: '你和{lover}已经认识一段时间了。你攥着口袋里的戒指，在楼下站了很久。',
      choices: [
        { t: '说出口', check: { s: ['social', 'mind'], dc: 40 },
          ok: { r: '{lover}愣了一下，然后笑了。“在都市里结婚，你可真有勇气。”', eff: [{ spouse: 'new', flag: 'married', unflag: 'act_dating', mind: 6, ach: 'act_married' }] },
          no: { r: '{lover}沉默了很久，说：“我还没准备好。”第二个月，对方搬去了别的区。', eff: { unflag: 'act_dating', mind: -6 } } },
        { t: '再等等', r: '你把戒指放回了抽屉。' },
      ] },
    { id: 'act_child', manual: true, req: { spouse: true, nojob: ['distorted', 'book'] }, title: '孩子',
      text: '你和{spouse}谈了一整夜。在都市里养一个孩子，意味着二十年的花销，和二十年的担惊受怕。',
      choices: [
        { t: '要一个孩子', res: [
          { w: 7, r: '几个月后，{kid}出生了。哭声很响，邻居敲了两次墙。', eff: { kid: 1, mind: 5, money: -40000, fn: S => CITY.initLoveChild(S) } },
          { w: 2, r: '一年过去了，什么都没有发生。医生说，再试试。', eff: { mind: -2 } },
        ] },
        { t: '还是不要了', eff: { mind: 1 }, r: '你们决定就这样，两个人过。' },
      ] },
    { id: 'act_retire', manual: true, title: '退休',
      text: (S) => '你做' + CITY.jobTitle(S) + '已经' + S.job.years + '年了。',
      choices: [
        { t: '退休', eff: { job: { id: 'retired' }, mind: 5 }, r: '你收拾好了自己的东西。最后一天下班，没有人送你。' },
        { t: '再干一年', r: '还不是时候。' },
      ] },
    { id: 'act_donate', manual: true, title: '捐款',
      text: '你走进了后巷的一家孤儿院。院长是个瘦小的修女，屋里有二十多个孩子在抢一碗粥。',
      choices: [
        { t: '捐出30万眼', eff: { money: -300000, mind: 5, fame: 2, cnt: { donate: 1 } }, r: '修女给了你一张手写的收据。孩子们排着队对你说谢谢，有几个说得很敷衍。' },
        { t: '捐出一半身家', eff: { money: '-50%', mind: 8, fame: 5, cnt: { donate: 2 }, ach: 'act_donor' }, r: '修女看着那个数字，很久没有说话。第二年，孤儿院换了新屋顶。' },
        { t: '只是看看', r: '你在门口站了一会儿，走了。' },
      ] },
  ]);

  CITY.addAch({
    act_married: { name: '在都市里结婚', desc: '主动求婚，并且被答应了。', tier: 'uncommon', group: '羁绊' },
    act_donor: { name: '新屋顶', desc: '把一半身家捐给了孤儿院。', tier: 'rare', group: '人生' },
  });
})();
