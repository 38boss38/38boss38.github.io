/* 收尾人
 * 连锁线：
 * - 资格考试 → 选择事务所 / 自由收尾人 → 委托 → 하나协会评级晋升 → 1阶 → 特色
 * - 事务所代表之死 → 继承或解散
 * - 协会招募（Zwei / し / 六 / Seven / Dieci / Cinq / Öufi / Девять / Tres）→ 各协会专属事件
 * - 放过的目标（fx_spared → fx_spared_back）
 * - 违约（fx_broke_contract → Öufi协会 找上门）
 * - 自己开事务所（office_own → 招人 → 对手事务所）
 * - 断臂 → 义体收尾人
 * - 退休 → 余生（ev_late）
 */
(function () {
  const OFFICE_NAMES = ['灯塔', '黑伞', '铁钉', '白鸦', '红线', '晨钟', '石楠', '夜莺', '青铜', '碎镜', '银针', '方舟', '灰烬', '罗盘', '三叉', '野犬', '长夜', '锈锚', '纸鹤', '玻璃', '秤砣', '旧钟', '黄铜', '雨衣', '北风', '烛芯', '刻度', '楔子'];
  const PAY = [0, 450, 220, 110, 60, 30, 15, 9, 6, 3.5];
  const pay = (mult) => (S) => {
    const base = S.flags.color ? 1200 : PAY[S.job.rank] || 3;
    const p = Math.round(base * 10000 * (mult || 1) * (0.8 + S.rng.next() * 0.4));
    S.money += p; S.vars.pay = CITY.fmtMoney(p);
  };
  const need = (r) => 1 + Math.ceil((9 - r) / 3) + (r <= 2 ? 2 : 0);
  CITY.fxNeed = need;
  const ok = (m, f, mult) => [{ merit: m || 1, cnt: { req: 1 }, fame: f || 1, skill: 1 }, pay(mult)];
  const hurt = (b, pd, cause) => [{ body: -b, mind: -2 }, (S) => { if (pd && S.rng.chance(pd)) { S.alive = false; S.death = cause || '在委托中殉职。事务所寄来了一份简短的通知。'; } }];
  const LOW = { job: 'fixer', rank: [7, 9] }, MID = { job: 'fixer', rank: [4, 6] }, HIGH = { job: 'fixer', rank: [1, 3] };
  const officeName = (S) => S.rng.pick(OFFICE_NAMES) + '事务所';
  const ASSOC = {
    zwei: { n: 'Zwei协会', d: '以护卫与保护为业的协会' },
    shi: { n: 'し协会', d: '以暗杀为业的协会' },
    liu: { n: '六协会', d: '以火焰与团队作战闻名的协会' },
    seven: { n: 'Seven协会', d: '负责调查与情报的协会' },
    dieci: { n: 'Dieci协会', d: '追求“知识”、也做救济的协会' },
    cinq: { n: 'Cinq协会', d: '崇尚决斗与规则的协会' },
    oufi: { n: 'Öufi协会', d: '监督合约履行、惩罚违约者的协会' },
    devyat: { n: 'Девять协会', d: '无论如何都会把东西送到的协会' },
    tres: { n: 'Tres协会', d: '与工坊和武器流通打交道的协会' },
  };
  CITY.ASSOC = ASSOC;

  CITY.addEvents('fixer', [
    // ---------- 入行 ----------
    { id: 'fx_license', manual: true, title: '收尾人资格考试', star: true,
      text: '하나协会的考场设在一栋灰色大楼的地下。笔试考都市法规与禁忌常识，实技考试则是和一名9阶收尾人交手三分钟——只要还站着就算合格。去年的合格率是百分之十一。',
      choices: [
        { t: '全力以赴', check: { s: ['skill', 'body'], dc: 38 },
          ok: { r: '三分钟到的时候，你满嘴是血，但还站着。考官在你的表格上盖了章。你拿到了收尾人证，9阶。', eff: { flag: 'fixer_license', job: { id: 'fixer', rank: 9 }, next: 'fx_office_pick' } },
          no: { r: '第四十秒，你就躺在了地上。考官叹了口气：“明年再来吧，如果你还活着。”', eff: { body: -4, mind: -2, flag: 'fx_failed_once' } } },
        { t: '靠笔试拉分', check: { s: 'wit', dc: 50 },
          ok: { r: '你的笔试几乎满分。实技考试你只是一直在躲，但考官说，“会躲也是本事”。你拿到了收尾人证，9阶。', eff: { flag: 'fixer_license', job: { id: 'fixer', rank: 9 }, next: 'fx_office_pick' } },
          no: { r: '你在“违反禁忌时的处置流程”那一题上写错了。考官说，这种人进了后巷活不过一周。', eff: { mind: -2, flag: 'fx_failed_once' } } },
        { t: '临阵退缩', eff: { mind: 1, unflag: 'want_fixer' }, r: '你在考场门口站了很久，最后转身离开了。报名费不退。' },
      ] },
    { id: 'fx_license_late', age: [18, 36], req: { nojob: ['fixer', 'finger', 'kurokumo', 'distorted', 'book'], noflag: 'fixer_license', any: [{ flag: 'fixer_dream' }, { flag: 'fx_failed_once' }, { st: { skill: [45, null] } }] }, w: 8, title: '收尾人',
      text: (S) => S.flags.fx_failed_once ? '하나协会的考试又要开始了。上一次的失败还记忆犹新。' : '一个熟人说，以你的身手，去当收尾人比现在挣得多得多。하나协会的考试下个月开始报名。',
      choices: [
        { t: '报名', eff: { next: 'fx_license' }, r: '你交了报名费。' },
        { t: '算了，现在的日子也还行', eff: { mind: 1 }, r: '你把报名表塞进了抽屉。' },
      ] },
    { id: 'fx_office_pick', manual: true, title: '何去何从',
      text: '刚拿到收尾人证的9阶收尾人，在后巷里一抓一大把。你得决定在哪里接活。',
      choices: [
        { t: '加入一家小事务所', eff: { fn: (S) => { S.job.org = officeName(S); S.vars.office = S.job.org; }, flag: 'office_member' }, r: '你加入了{org}。代表是个话不多的中年人，他给了你一张工位和一句话：“别死在委托里，会影响事务所的评级。”' },
        { t: '加入稍有名气的事务所', check: { s: ['skill', 'social'], dc: 50 },
          ok: { r: '你通过了面试，加入了{org}。这里的前辈都很强，你是最弱的那个。', eff: { fn: (S) => { S.job.org = officeName(S); S.vars.office = S.job.org; }, flag: ['office_member', 'good_office'], skill: 2 } },
          no: { r: '面试官看了你的资料，说了句“下一位”。你最后还是去了一家小事务所。', eff: { fn: (S) => { S.job.org = officeName(S); S.vars.office = S.job.org; }, flag: 'office_member' } } },
        { t: '当自由收尾人', eff: { fn: (S) => { S.job.org = '自由'; }, flag: 'freelance', social: -1 }, r: '你在终端上注册了接单账号。没有人罩着你，也没有人抽你的成。' },
      ] },

    // ---------- 低阶委托（9–7阶） ----------
    { id: 'fx_req_cat', age: [16, 70], req: LOW, w: 20, repeat: true, cd: 6, title: '委托：寻猫',
      text: '委托人是一位老太太，她的猫三天没回家了。报酬不高，但她说那只猫是她唯一的家人。',
      choices: [
        { t: '挨家挨户地找', check: { s: 'social', dc: 30 },
          ok: { r: '你在两条街外的一家餐馆后厨找到了它，再晚一天它就要变成“特价炖肉”了。老太太哭着付了钱。', eff: ok(1, 1, 0.4) },
          no: { r: '你找了一周，只找到了一个项圈。你把项圈还给了老太太，没收钱。', eff: { mind: -2 } } },
        { t: '敷衍了事', eff: [{ mind: -1 }, pay(0.2)], r: '你随便抓了一只差不多的猫交差。老太太看了很久，什么都没说，付了钱。' },
      ] },
    { id: 'fx_req_debt', age: [16, 70], req: LOW, w: 22, repeat: true, cd: 4, title: '委托：讨债',
      text: '一家放贷公司委托你去催收一笔欠款。欠债的是个在工厂上班的男人，家里有两个孩子。',
      choices: [
        { t: '照规矩办事', check: { s: ['skill', 'social'], dc: 35 },
          ok: { r: '他把钱交了出来——你没问是从哪里凑的。你拿到了报酬，{pay}。', eff: ok(1, 1) },
          no: { r: '他抄起扳手冲了过来。你没想到一个工人能打得这么狠。', eff: hurt(6) } },
        { t: '替他求情，延期一个月', check: { s: 'social', dc: 50 },
          ok: { r: '放贷公司勉强同意了。一个月后，他真的把钱还上了。你只拿到了一半的报酬。', eff: [{ mind: 2, cnt: { req: 1 }, merit: 1 }, pay(0.5)] },
          no: { r: '委托人很不满，在你的评价里写了“办事不力”。', eff: { merit: -1, mind: 1 } } },
        { t: '拒绝', r: '你推掉了这单。后巷里永远有人愿意接。' },
      ] },
    { id: 'fx_req_rats', age: [16, 70], req: LOW, w: 22, repeat: true, cd: 3, title: '委托：驱逐耗子',
      text: '一条商店街被一伙耗子骚扰了好几个月。商户们凑了钱，委托你把他们赶走。',
      choices: [
        { t: '直接动手', check: { s: 'skill', dc: 35 },
          ok: { r: '耗子们比你想象的还要不经打。商户们请你喝了一杯，报酬是{pay}。', eff: ok(1, 2) },
          no: { r: '他们人比情报上多了一倍。你逃了出来，背上多了三道口子。', eff: hurt(7, 0.03) } },
        { t: '找到头目谈判', check: { s: ['social', 'wit'], dc: 40 },
          ok: { r: '你查到了头目的住处，在他家门口等到了半夜。他第二天就带人搬走了。', eff: ok(1, 1) },
          no: { r: '头目觉得你在虚张声势。第二天，商店街的一家铺子被烧了。', eff: { mind: -3, fame: -1 } } },
      ] },
    { id: 'fx_req_guard', age: [16, 70], req: LOW, w: 20, repeat: true, cd: 3, title: '委托：守夜',
      text: '一家当铺老板委托你守一晚上的店，据说有人打算今晚来抢一件刚收进来的货。',
      choices: [
        { t: '守在店里', check: { s: ['body', 'skill'], dc: 38 },
          ok: { r: '凌晨一点，三个蒙面人撬开了后门。你让他们原路躺了出去。老板很满意，{pay}。', eff: ok(1, 1) },
          no: { r: '来的人带着工坊武器。你挡下了第一刀，没挡住第二刀。', eff: hurt(9, 0.04) } },
        { t: '问清楚是什么货', check: { s: 'wit', dc: 45 },
          ok: { r: '老板支支吾吾地说，是一件从某个死去的收尾人身上扒下来的东西。你多收了一倍的钱，守了一夜，平安无事。', eff: ok(1, 1, 2) },
          no: { r: '老板不肯说。那一夜什么都没发生，但你总觉得柜台后面有东西在看你。', eff: [{ dist: 2 }, pay(0.8)] } },
      ] },
    { id: 'fx_req_missing', age: [16, 70], req: LOW, w: 20, repeat: true, cd: 5, title: '委托：寻人',
      text: '一个女人委托你寻找她失踪的丈夫。他最后一次出现，是在凌晨两点五十分的一家酒吧。',
      choices: [
        { t: '去酒吧调查', check: { s: ['wit', 'social'], dc: 40 },
          ok: { r: '你查到了他的下落：他欠了帮派的钱，躲在一间地下室里。你把他带了回去。女人给了你钱，然后给了他一耳光。', eff: ok(1, 1) },
          no: { r: '酒保说，那天三点之前他就离开了。三点之后的事情，就不归人管了。你把这句话转告给了女人。', eff: { mind: -2 } } },
        { t: '直接告诉她可能的结果', eff: { mind: -1, money: 2000 }, r: '你说，凌晨三点前没回家的人，大多不会再回来了。她说她知道，她只是需要一个人告诉她。她还是付了你一点钱。' },
      ] },
    { id: 'fx_req_escort', age: [16, 70], req: LOW, w: 18, repeat: true, cd: 4, title: '委托：护送',
      text: '一个年轻的工坊学徒要把一箱零件从{d}区送到隔壁区，委托你一路护送。',
      choices: [
        { t: '走大路', check: { s: 'skill', dc: 36 },
          ok: { r: '一路上只遇到了两伙不长眼的耗子。学徒请你吃了一碗面。{pay}。', eff: ok(1, 1) },
          no: { r: '你们在桥下被伏击了。箱子被抢走，学徒被打断了腿。', eff: [{ merit: -1, body: -4, fame: -1 }] } },
        { t: '抄近路', res: [
          { w: 6, r: '近路很顺利，你们提前到了。学徒说你是他见过最靠谱的收尾人。', eff: ok(1, 1) },
          { w: 3, r: '近路穿过一片被扭曲污染过的街区。你们绕了很久才出来，学徒的头发白了一半。', req: { era: 'dist' }, eff: [{ dist: 3 }, pay(0.8)] },
          { w: 3, r: '近路上有一个帮派在设卡收过路费。你付了钱，报酬里扣掉了一半。', eff: pay(0.5) },
        ] },
      ] },
    { id: 'fx_req_lie', age: [16, 70], req: { job: 'fixer', rank: [5, 9] }, w: 8, title: '委托：报复',
      text: '委托人说，有个男人杀了他的弟弟，他要你“讨个公道”。目标住址、作息、照片一应俱全。准备得太充分了。',
      choices: [
        { t: '先查一查目标', check: { s: 'wit', dc: 45 },
          ok: { r: '你查到了：目标是委托人的生意伙伴，根本没有什么弟弟。你退了定金，委托人的脸色很难看。', eff: { wit: 2, mind: 1, flag: 'fx_lie_seen' } },
          no: { r: '你什么都没查到，只好按原计划行事。', eff: { next: 'fx_req_lie2' } } },
        { t: '直接执行', eff: { next: 'fx_req_lie2' }, r: '收尾人不问理由。' },
        { t: '拒绝', r: '你推掉了。你不喜欢这种“准备充分”的委托人。' },
      ] },
    { id: 'fx_req_lie2', manual: true, title: '目标',
      text: '目标在家里。他开门的时候，身后站着一个五六岁的孩子。',
      choices: [
        { t: '完成委托', check: { s: 'skill', dc: 40 },
          ok: { r: '你完成了委托。孩子没有哭，只是一直看着你。你拿到了{pay}。', eff: [...ok(1, 1, 1.5), { flag: 'killed', cnt: { kills: 1 }, dist: 5, mind: -4 }] },
          no: { r: '他比你想象的更难对付。你负了伤，他带着孩子逃走了。', eff: hurt(8) } },
        { t: '放他走', eff: { flag: 'fx_spared', queue: ['fx_spared_back', 8], merit: -1, mind: 2 }, r: '你让他带着孩子离开这个区，永远别回来。你对委托人说目标已经跑了。委托人不信，但也没办法。' },
      ] },
    { id: 'fx_spared_back', manual: true, req: { flag: 'fx_spared' }, star: true,
      text: '多年后，当年那扇门的事又有了回音。',
      choices: [{ t: '收下这份谢意', res: [
        { w: 1, r: '一个年轻人在街上拦住你。“那天你让我和我爸离开了那个区。”他如今在工坊工作，递给你一把亲手打的刀。', eff: { mind: 4, skill: 2 } },
        { w: 1, r: '你的终端收到十万眼匿名转账，附言只有一句：“谢谢你那天开了门。”', eff: { mind: 4, money: 100000 } },
      ] }] },

    // ---------- 中阶委托（6–4阶） ----------
    { id: 'fx_req_boss', age: [18, 70], req: MID, w: 22, repeat: true, cd: 4, title: '委托：清除',
      text: '委托内容：清除{d}区某帮派的头目。帮派有二十多人，头目身上装了三处战斗义体。',
      choices: [
        { t: '正面突破', check: { s: 'skill', dc: 58 },
          ok: { r: '你一个人从一楼打到了五楼。头目的义体手臂现在挂在你事务所的墙上。{pay}。', eff: [...ok(2, 3), { flag: 'killed', cnt: { kills: 1 } }] },
          no: { r: '你打到三楼就打不动了，被人拖着丢进了河里。', eff: hurt(12, 0.12, '在一次清除帮派的委托中，被丢进了河里。') } },
        { t: '摸清作息，等他落单', check: { s: 'wit', dc: 55 },
          ok: { r: '你在他情妇家的楼下等了九天。第十天，委托完成了。{pay}。', eff: [...ok(2, 2), { flag: 'killed', cnt: { kills: 1 } }] },
          no: { r: '你暴露了。那个帮派悬赏你的人头，你在外面躲了半年。', eff: { mind: -6, fame: -2, flag: 'gang_bounty' } } },
        { t: '找同行联手', check: { s: 'social', dc: 50 },
          ok: { r: '你和另外两个收尾人分了报酬，也分了风险。三个人都活着回来了。', eff: ok(1, 2, 0.5) },
          no: { r: '找来的同行在最后关头卷钱跑了。你一个人收拾了残局。', eff: hurt(8, 0.05) } },
      ] },
    { id: 'fx_req_witness', age: [18, 70], req: MID, w: 20, repeat: true, cd: 4, title: '委托：保护证人',
      text: '一名目击了“某种不该看到的东西”的会计，需要被安全送到另一个区。至少有两拨人想让他闭嘴。',
      choices: [
        { t: '接下', check: { s: ['skill', 'wit'], dc: 55 },
          ok: { r: '三天三夜，换了七个藏身处。你把他送到了。他到最后都没说他看到了什么。{pay}。', eff: ok(2, 2) },
          no: { r: '第二天夜里，他死在了你身边。子弹是从很远的地方打来的。你什么都没看到。', eff: { merit: -2, mind: -5, fame: -2 } } },
        { t: '拒绝', r: '太烫手了。后来你听说，接下这单的收尾人和证人一起失踪了。' },
      ] },
    { id: 'fx_req_hostage', age: [18, 70], req: MID, w: 20, repeat: true, cd: 4, title: '委托：救人',
      text: '某个小企业主的女儿被绑架了。绑匪要五千万眼。企业主付不起，于是付你一百万眼。',
      choices: [
        { t: '潜入救人', check: { s: ['skill', 'wit'], dc: 56 },
          ok: { r: '你带着那个女孩从通风管道里爬了出来。她一路都没哭，出来之后才哭。{pay}。', eff: ok(2, 3) },
          no: { r: '绑匪发现了你。混战之中，女孩受了伤。你把她带了出来，但她失去了一只眼睛。', eff: [{ body: -6, mind: -4 }, pay(0.3)] } },
        { t: '假扮付赎金的人', check: { s: 'social', dc: 58 },
          ok: { r: '你提着一箱假钞走了进去，带着女孩走了出来。绑匪打开箱子的时候，你已经在三条街外了。', eff: ok(2, 2) },
          no: { r: '绑匪一眼就看穿了你。你挨了一枪，但还是把女孩抢了出来。', eff: [...hurt(10, 0.06), pay(0.6)] } },
      ] },
    { id: 'fx_req_duel', age: [18, 60], req: { job: 'fixer', rank: [3, 6] }, w: 8, title: '挑战',
      text: '一个别的事务所的收尾人找上门来，说想和你“切磋一下”。他的眼神告诉你，他想要的是你的阶级排名。',
      choices: [
        { t: '应战', check: { s: 'skill', dc: 60 },
          ok: { r: '你赢了。他捂着伤口走了，临走前说：“下次不会这样。”', eff: { fame: 4, skill: 2, merit: 1, flag: 'fx_rival' } },
          no: { r: '你输了。在后巷，输给同阶的收尾人，意味着下个月的委托会少一半。', eff: { fame: -3, body: -6, merit: -1 } } },
        { t: '婉拒', eff: { fame: -1 }, r: '他嗤笑一声走了。第二天，附近都在传你“不敢应战”。' },
      ] },
    { id: 'fx_req_wing', age: [20, 65], req: MID, w: 9, repeat: true, cd: 6, title: '委托：翼的外包',
      text: '一个翼的子公司委托你潜入竞争对手的仓库，取回一份“被盗的技术资料”。合同上的保密条款有七页。',
      choices: [
        { t: '签字', check: { s: 'wit', dc: 55 },
          ok: { r: '你拿到了资料。按照合同，你在交付之后接受了一次“记忆整理”。你不记得自己看到了什么，只记得报酬很丰厚：{pay}。', eff: [...ok(2, 1, 1.6), { mind: -2 }] },
          no: { r: '仓库里有你没想到的安保。你逃了出来，但合同里写着：失败者自负一切后果。', eff: hurt(10, 0.08, '在为某个翼的子公司执行委托时失踪。合同上写着，失败者自负一切后果。') } },
        { t: '拒绝', r: '和翼打交道的收尾人，要么很有钱，要么很快就死了。' },
      ] },
    { id: 'fx_req_dist', age: [18, 70], req: { job: 'fixer', rank: [2, 7], era: 'dist' }, w: 14, repeat: true, cd: 3, title: '委托：讨伐扭曲',
      text: (S) => '协会发布了一则扭曲讨伐委托，评级为' + (S.job.rank <= 4 ? '都市恶疾' : '都市传说') + '。据说那个扭曲体原本是一家面包店的店主，现在整条街都闻得到烤焦的甜味。',
      choices: [
        { t: '参加讨伐', check: { s: ['skill', 'mind'], dc: 58 },
          ok: { r: '它倒下的时候，变回了一个瘦小的中年男人。他的手里还攥着一块面包。{pay}。', eff: [...ok(2, 3, 1.3), { mind: -3, dist: 2 }] },
          no: { r: '讨伐队一半的人没能回来。你回来了，但你每晚都会梦见那股甜味。', eff: [...hurt(10, 0.1, '在一次扭曲讨伐中，没能回来。'), { dist: 6 }] } },
        { t: '负责外围封锁', eff: [{ cnt: { req: 1 }, merit: 1 }, pay(0.4)], r: '你守在封锁线外面，听了一整夜里面的声音。' },
        { t: '拒绝', r: '扭曲讨伐的委托，从来不缺送死的人。' },
      ] },
    { id: 'fx_req_workshop', age: [18, 70], req: MID, w: 8, title: '委托：失窃的工坊武器',
      text: '一家工坊的展品被偷了——一把还没正式发售的新型武器。工坊代表说，如果你找回来，可以让你优先购买。',
      choices: [
        { t: '追查', check: { s: ['wit', 'social'], dc: 52 },
          ok: { r: '你在J公司的当铺里找到了它，当铺老板说是一个9阶收尾人拿来典当的。工坊代表兑现了承诺，以成本价把同型号的武器卖给了你。', eff: [...ok(2, 1, 0.6), { skill: 5, money: -200000, flag: 'workshop_weapon' }] },
          no: { r: '线索断在了一个死人身上。工坊代表很失望。', eff: { merit: -1 } } },
        { t: '拒绝', r: '你推掉了。偷工坊东西的人，一般都有些本事。' },
      ] },

    // ---------- 高阶委托（3–1阶 / 特色） ----------
    { id: 'fx_req_finger', age: [20, 70], req: HIGH, w: 22, repeat: true, cd: 4, title: '委托：手指',
      text: '委托人希望你“处理”一个手指的据点。委托书上没有写是哪根手指，只写着报酬：一个让你眼睛发直的数字。',
      choices: [
        { t: '接下', check: { s: 'skill', dc: 75 },
          ok: { r: '你做到了。那一夜之后，你的名字被写进了某本账簿里——你不确定那是好事还是坏事。{pay}。', eff: [...ok(3, 6, 1.5), { flag: ['killed', 'finger_enemy'], cnt: { kills: 1 } }] },
          no: { r: '你低估了他们。', eff: hurt(14, 0.3, '死在了一个手指的据点里。尸体被摆成了某种“作品”的样子。') } },
        { t: '拒绝', r: '能活到现在的高阶收尾人，都知道什么样的委托不能接。' },
      ] },
    { id: 'fx_req_nightmare', age: [20, 70], req: HIGH, w: 20, repeat: true, cd: 5, title: '委托：都市梦魇',
      text: '一则都市梦魇级的委托发到了你的终端上。参加的事务所和协会科室名单很长，名单上的很多名字，你只在传闻中听说过。',
      choices: [
        { t: '参加', check: { s: ['skill', 'body', 'mind'], dc: 72 },
          ok: { r: '你活了下来，并且在最后的那一击中，有你的一份。之后一个月，后巷里都有人在谈论你。{pay}。', eff: [...ok(3, 8, 2), { mind: -3 }] },
          no: { r: '你记不太清那一夜发生了什么，只记得到处都是光和声音。', eff: [...hurt(16, 0.25, '在一则都市梦魇级的委托中，与其他几十名收尾人一同阵亡。'), { dist: 5 }] } },
        { t: '不去', r: '报酬再高，也得有命花。' },
      ] },
    { id: 'fx_req_star', age: [22, 70], req: { job: 'fixer', rank: [1, 1] }, w: 12, title: '委托：都市之星',
      text: '这是一则都市之星级的委托。你看完了全部情报，在桌前坐了一个晚上。',
      choices: [
        { t: '接下', check: { s: ['skill', 'mind'], dc: 85 },
          ok: { r: '你完成了它。整座都市的收尾人都知道了你的名字。', star: true, eff: [...ok(4, 15, 3), { flag: 'star_request', title: '完成都市之星委托的人', ach: 'fx_star' }] },
          no: { r: '这是你接的最后一个委托。', eff: { death: '死于一则都市之星级的委托。现场没有留下可以辨认的东西。' } } },
        { t: '放弃', r: '你把委托转给了一位特色。三天后，那位特色完成了它。' },
      ] },

    // ---------- 晋升 ----------
    { id: 'fx_promote', force: true, repeat: true, cd: 1, req: { job: 'fixer', rank: [2, 9], fn: (S) => S.job.merit >= need(S.job.rank) }, title: '评级', star: true,
      text: (S) => '하나协会通知你参加评级审查。你最近的委托记录已经足够申请' + (S.job.rank - 1) + '阶了。',
      choices: [
        { t: '参加审查', check: { s: ['skill', 'wit'], dc: 35, mod: (S) => (S.job.rank <= 3 ? 0.05 : S.job.rank <= 5 ? 0.12 : 0.2) },
          ok: { r: (S) => '审查通过。你的收尾人证上的数字变成了' + S.job.rank + '。', eff: { job: { promote: 1 }, fame: 3 } },
          no: { r: '审查官说你的“综合评价”还差一点。你下次还可以再来。', eff: { merit: -2 } } },
        { t: '暂时不升', eff: { merit: -1 }, r: '阶级越高，接到的委托就越要命。你决定再等等。' },
      ] },
    { id: 'fx_grade1', force: true, req: { job: 'fixer', rank: [1, 1], noflag: 'fx_g1' }, star: true,
      text: '你成为了1阶收尾人。整座都市里，能走到这一步的人屈指可数。你走在后巷里，开始有人在背后低声议论你的名字。',
      eff: { flag: 'fx_g1', fame: 10, ach: 'fx_g1' } },
    { id: 'fx_color', force: true, req: { job: 'fixer', rank: [1, 1], flag: 'fx_g1', noflag: 'color', fame: [55, null], cnt: { req: [14, null] }, st: { skill: [70, null] } }, title: '特色', star: true,
      text: '하나协会寄来了一封信。信里说，鉴于你的功绩，协会决定授予你“特色”的称号——都市最顶尖的收尾人才配拥有的称号。你需要为自己选一个名字，或者让都市替你选。',
      choices: [
        { t: '「琥珀之刃」', eff: { set: { colorName: '琥珀之刃' } }, r: '从今天起，你是特色「琥珀之刃」。' },
        { t: '「灰烬残光」', eff: { set: { colorName: '灰烬残光' } }, r: '从今天起，你是特色「灰烬残光」。' },
        { t: '「铁灰守望」', eff: { set: { colorName: '铁灰守望' } }, r: '从今天起，你是特色「铁灰守望」。' },
        { t: '让都市替你决定', eff: { fn: (S) => { S.vars.colorName = S.rng.pick(['靛青回声', '白银誓约', '翠绿沉眠', '赭石猎犬', '雾灰行者', '鸦黑弦音']); } }, r: '没过多久，后巷里的人开始叫你「{colorName}」。' },
      ],
      eff: { flag: 'color', fame: 20, ach: 'fx_color', fn: (S) => { S.titles.push('特色'); } } },

    // ---------- 事务所 ----------
    { id: 'fx_office_boss_dies', age: [20, 60], req: { job: 'fixer', flag: 'office_member', noflag: 'office_own' }, w: 6, title: '代表之死', star: true,
      text: '{org}的代表在一次委托中死了。事务所里剩下的几个人看着你——你是除了代表之外阶级最高的人。',
      choices: [
        { t: '接手事务所', req: { rank: [1, 6] }, eff: { flag: 'office_own', fame: 3, social: 2 }, r: '你坐上了代表的椅子。椅子上还留着他的烟味。' },
        { t: '解散事务所', eff: { unflag: 'office_member', fn: (S) => { S.job.org = '自由'; }, flag: 'freelance' }, r: '你们把代表的东西分了，各自散去。你成了自由收尾人。' },
        { t: '去为他报仇', check: { s: 'skill', dc: 58 },
          ok: { r: '你找到了那个人，替代表画上了句号。事务所的人都跟定了你。', eff: { flag: ['office_own', 'killed'], fame: 4, cnt: { kills: 1 } } },
          no: { r: '你差点死在同一个人手里。事务所散了。', eff: { body: -10, unflag: 'office_member', fn: (S) => { S.job.org = '自由'; } } } },
      ] },
    { id: 'fx_open_office', age: [24, 60], req: { job: 'fixer', rank: [1, 5], noflag: 'office_own', money: [1000000, null] }, w: 10, title: '开事务所',
      text: '你攒下了一笔钱。在后巷开一家事务所，需要租一间办公室、去하나协会登记、再雇几个人——以及向附近的帮派打声招呼。',
      choices: [
        { t: '开！', eff: { money: -800000, flag: 'office_own', fn: (S) => { S.job.org = (S.vars.myOffice = S.name.slice(0, 1) + S.rng.pick(['', '氏']) + '事务所'); }, unflag: 'freelance' }, r: '{org}开张了。第一个上门的不是委托人，而是来收“管理费”的人。' },
        { t: '起个响亮的名字再开', eff: { money: -800000, flag: 'office_own', fn: (S) => { S.job.org = (S.vars.myOffice = S.rng.pick(['破晓', '回声', '无名', '最后一班车', '凌晨两点五十九分', '白线', '雨后']) + '事务所'); }, unflag: 'freelance' }, r: '{org}开张了。招牌是你亲手挂上去的。' },
        { t: '再等等', r: '你觉得自己还没准备好。' },
      ] },
    { id: 'fx_office_recruit', age: [24, 65], req: { job: 'fixer', flag: 'office_own' }, w: 10, title: '新人',
      text: '一个刚拿到收尾人证的年轻人来你的事务所面试。他的履历一片空白，眼神却很亮。',
      choices: [
        { t: '收下他', eff: { flag: 'has_junior', social: 2, queue: ['fx_junior_fate', 4] }, r: '你给了他一张工位，和当年你听过的那句话。' },
        { t: '劝他回去', eff: { mind: 1 }, r: '你说这行不适合他。他很失望地走了。你不知道自己做得对不对。' },
      ] },
    { id: 'fx_junior_fate', manual: true, req: { flag: 'has_junior' },
      text: '你带过的新人已有一阵没来事务所。前台留着一份与你有关的消息。',
      choices: [{ t: '查看留下的消息', res: [
        { w: 1, r: '新人升到了6阶。他约你喝酒，说想自己出去闯一闯。你带着旧武器去赴约，把它送给了他。', eff: { mind: 1, social: 2 } },
        { w: 1, r: '新人死在一次委托里。遗物中有张便条，上面写着“要变得像代表一样”。你把纸摊平，收进抽屉。', eff: { mind: -4 } },
      ] }] },
    { id: 'fx_rival_office', age: [24, 65], req: { job: 'fixer', flag: 'office_own' }, w: 7, title: '同行',
      text: '隔壁街新开了一家事务所，开张第一周就用半价抢走了你三个老客户。',
      choices: [
        { t: '跟着降价', eff: { money: -200000, social: 1 }, r: '一场价格战打了半年。最后对方撑不住，关门了。你也没挣到什么钱。' },
        { t: '上门“拜访”', check: { s: 'skill', dc: 55 },
          ok: { r: '你们“友好地交流”了一下。对方的代表从此见了你就绕道走。', eff: { fame: 2 } },
          no: { r: '对方的代表比你想的要强。你被打了出来，丢尽了脸。', eff: { fame: -4, body: -5 } } },
        { t: '提升服务质量', check: { s: ['wit', 'social'], dc: 50 },
          ok: { r: '你的客户们慢慢都回来了。“还是你们靠得住。”', eff: { fame: 2, money: 100000 } },
          no: { r: '没什么用。在后巷，便宜就是道理。', eff: { money: -100000 } } },
      ] },
    { id: 'fx_betrayal', age: [20, 65], req: { job: 'fixer' }, w: 5, title: '背叛',
      text: '交接委托物的时候，你的同伴突然把刀对准了你。“抱歉，对方出的价更高。”',
      choices: [
        { t: '反击', check: { s: 'skill', dc: 55 },
          ok: { r: '你活下来了，他没有。你把他的收尾人证寄回了하나协会。', eff: { flag: 'killed', cnt: { kills: 1 }, mind: -4, dist: 3, social: -3 } },
          no: { r: '刀刺进了你的腹部。', eff: hurt(14, 0.35, '被同伴出卖，死在了委托物的交接现场。') } },
        { t: '提出双倍价钱', check: { s: 'social', dc: 55 },
          ok: { r: '他犹豫了。最后，你们一起把委托物交给了出价最高的人。这件事你谁也没说。', eff: { money: 300000, mind: -3 } },
          no: { r: '他笑了：“你没有那么多钱。”', eff: hurt(10, 0.2, '被同伴出卖，死在了委托物的交接现场。') } },
      ] },

    // ---------- 装备与身体 ----------
    { id: 'fx_buy_weapon', age: [18, 65], req: { job: 'fixer', money: [500000, null], noflag: 'workshop_weapon' }, w: 9, title: '工坊武器',
      text: '一家工坊在搞展销。你看中了一把武器，但它要花掉一大笔钱。',
      choices: [
        { t: '买下烙印工坊的刀', eff: { money: -450000, skill: 6, flag: 'workshop_weapon', set: { weapon: '烙印工坊的刀' } }, r: '刀身在出鞘时会泛起一层微光。拿在手里，你觉得自己的阶级好像高了一阶。' },
        { t: '买下云工坊的刀', eff: { money: -400000, skill: 5, flag: 'workshop_weapon', set: { weapon: '云工坊的刀' } }, r: '轻得像握着一缕风。' },
        { t: '买下阿拉斯工坊的手套', eff: { money: -350000, skill: 4, body: 2, flag: 'workshop_weapon', set: { weapon: '阿拉斯工坊的手套' } }, r: '戴上之后，一拳能打穿砖墙。' },
        { t: '还是用自己的旧家伙', r: '它陪你走了很远。你还舍不得换。' },
      ] },
    { id: 'fx_arm_lost', age: [18, 70], req: { job: 'fixer' }, w: 4, title: '断臂', star: true,
      text: '一次委托中，你的右臂被齐肩斩断了。委托完成了，但你躺在诊所里，看着空荡荡的袖管。',
      choices: [
        { t: '装上战斗义体', req: { money: [600000, null] }, eff: { money: -600000, pros: 1, skill: 3, body: -3, mind: -3 }, r: '新手臂的力量是原来的三倍。每到阴雨天，接口处都会隐隐作痛。' },
        { t: '装上廉价义体', eff: { money: -150000, pros: 1, skill: -4, mind: -2 }, r: '这条手臂不太听话，有时会在半夜自己握拳。' },
        { t: '注射再生安瓿', req: { money: [1500000, null] }, eff: { money: -1500000, body: 2 }, r: '手臂长回来了。新长出来的皮肤上没有任何疤痕，也没有你小时候烫伤的那个印记。' },
        { t: '就这样吧', eff: { skill: -10, mind: -4 }, r: '你学着用左手握刀。' },
      ] },
    { id: 'fx_augment', age: [20, 60], req: { job: 'fixer', rank: [1, 6], money: [1000000, null] }, w: 6, title: '强化手术',
      text: '后巷的义体诊所推出了新的强化手术套餐：神经加速、骨骼强化、皮下装甲。医生说，你的身体“还有很大的改造空间”。',
      choices: [
        { t: '全套', eff: { money: -1000000, pros: 2, body: 8, skill: 4, mind: -5 }, res: [
          { w: 7, r: '手术很成功。你照镜子的时候，有那么一瞬间没认出自己。' },
          { w: 2, r: '手术后的第三天，你出现了排异反应，高烧了一个星期。', eff: { body: -10 } },
          { w: 1, req: { trait: '义体亲和' }, r: '你的身体对义体毫无排斥。医生说，他从没见过这么完美的适配。', eff: { body: 6, skill: 4, title: '义体收尾人' } },
        ] },
        { t: '只做神经加速', eff: { money: -400000, pros: 1, skill: 5, mind: -2 }, r: '世界变慢了。你能看清子弹出膛时的火光。' },
        { t: '不做', r: '你更相信自己的血肉。' },
      ] },

    // ---------- 协会 ----------
    { id: 'fx_assoc_invite', age: [20, 55], req: { job: 'fixer', rank: [1, 6], noflag: ['assoc', 'office_own'] }, w: 20, title: '协会',
      text: (S) => { const keys = Object.keys(ASSOC); const pick = pool => S.rulesVersion >= 4 && CITY.STORIES ? S.rng.wpick(pool, k => 1 / Math.pow(1 + Object.values(CITY.STORIES).filter(A => A.route === 'as_' + k).reduce((n, A) => n + (S.memory.groups[A.id] || 0), 0), 1.4)) : S.rng.pick(pool); const a = pick(keys), b = pick(keys.filter((k) => k !== a)); S.vars.asA = a; S.vars.asB = b; return '有两个协会的人先后来找你。' + ASSOC[a].n + '——' + ASSOC[a].d + '；' + ASSOC[b].n + '——' + ASSOC[b].d + '。加入协会，意味着稳定的委托，也意味着要服从协会的规矩。'; },
      choices: [
        { t: (S) => '加入' + ASSOC[S.vars.asA].n, eff: (S) => joinAssoc(S, S.vars.asA), r: (S) => '你成为了' + S.job.org + '的一员。' },
        { t: (S) => '加入' + ASSOC[S.vars.asB].n, eff: (S) => joinAssoc(S, S.vars.asB), r: (S) => '你成为了' + S.job.org + '的一员。' },
        { t: '都拒绝', r: '你还是喜欢自己说了算。' },
      ] },
    { id: 'fx_as_zwei', age: [20, 65], req: { flag: 'as_zwei', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Zwei协会',
      text: 'Zwei协会接到了一份长期护卫的委托：保护一个巢里的富商度过他“仇人很多”的一个月。科长把盾牌交给你：“记住，我们是保护者。”',
      choices: [
        { t: '寸步不离', check: { s: ['body', 'mind'], dc: 55 },
          ok: { r: '一个月里有四次刺杀，你挡下了全部。富商在合同到期的那天解雇了你们，连句谢谢都没说。{pay}。', eff: ok(2, 2) },
          no: { r: '第三次刺杀的时候，你替他挨了一刀。富商活了下来，你在医院里躺了两个月。', eff: [...hurt(12, 0.05), pay(0.8)] } },
        { t: '主动出击，先找到刺客', check: { s: ['skill', 'wit'], dc: 60 },
          ok: { r: '你在刺客动手之前找到了他。科长说你“不像Zwei的人”，但还是给你记了功。', eff: ok(2, 2, 1.2) },
          no: { r: '你离开岗位的那一晚，富商遇刺了。科长给你记了过，处分单压在你的委托记录上。', eff: { merit: -3, mind: -3 } } },
      ] },
    { id: 'fx_as_shi', age: [20, 65], req: { flag: 'as_shi', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'し协会',
      text: 'し协会的委托总是很简单：一个名字，一个地址，一个期限。这一次的目标是一位慈善家。',
      choices: [
        { t: '完成', check: { s: 'skill', dc: 58 },
          ok: { r: '干净利落。第二天的报纸说他死于心脏病。{pay}。', eff: [...ok(2, 1, 1.3), { flag: 'killed', cnt: { kills: 1 }, mind: -2 }] },
          no: { r: '他的保镖比情报里多。你撤退了，但し协会不喜欢失败的人。', eff: { merit: -3, body: -6, fame: -2 } } },
        { t: '先调查他是不是该死', check: { s: 'wit', dc: 55 },
          ok: { r: '他的慈善机构是个器官中转站。你完成委托的时候，手一点都没抖。', eff: [...ok(2, 1, 1.3), { flag: 'killed', cnt: { kills: 1 } }] },
          no: { r: '你什么都没查到。最后你还是完成了委托，只是那个晚上，你喝了很多酒。', eff: [...ok(1, 0), { flag: 'killed', cnt: { kills: 1 }, mind: -5, dist: 3 }] } },
      ] },
    { id: 'fx_as_liu', age: [20, 65], req: { flag: 'as_liu', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: '六协会',
      text: '六协会的训练从凌晨四点开始。科长说，火焰要在你的身体里烧起来，才能在战场上烧起来。今天，科里要去清剿一个盘踞在旧工厂里的帮派。',
      choices: [
        { t: '和科员们并肩冲锋', check: { s: ['skill', 'body'], dc: 55 },
          ok: { r: '旧工厂烧了一整夜。你们一个人都没少。科长拍了拍你的肩膀。{pay}。', eff: ok(2, 2) },
          no: { r: '你的阵型出了破绽，一个科员为了掩护你受了重伤。科长什么都没说，你却比挨了骂还难受。', eff: { merit: -2, mind: -4, body: -4 } } },
        { t: '提出更好的战术', check: { s: 'wit', dc: 58 },
          ok: { r: '科长采纳了你的方案。战斗结束得比预想快了一半。', eff: ok(2, 2, 1.1) },
          no: { r: '科长听完说：“六协会不需要聪明人，需要的是一条心。”', eff: { merit: -1 } } },
      ] },
    { id: 'fx_as_seven', age: [20, 65], req: { flag: 'as_seven', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Seven协会',
      text: 'Seven协会要你调查一家企业的资金流向。你在一堆账本里泡了两周，发现了一个不该发现的名字。',
      choices: [
        { t: '如实上报', check: { s: 'wit', dc: 55 },
          ok: { r: '科长看完报告，把它放进了碎纸机。“做得很好。你什么都没看到。”{pay}。', eff: ok(2, 1, 1.2) },
          no: { r: '你的报告里有一处疏漏，被对方抓住了。协会不得不出面替你善后。', eff: { merit: -2, fame: -2 } } },
        { t: '把情报卖给第三方', check: { s: 'social', dc: 62 },
          ok: { r: '你拿到了一笔可观的钱。协会没有发现——至少目前没有。', eff: { money: 2000000, flag: 'seven_leak', dist: 2 } },
          no: { r: '协会发现了。', eff: { death: '因为出卖情报，被Seven协会处理掉了。' } } },
      ] },
    { id: 'fx_as_dieci', age: [20, 65], req: { flag: 'as_dieci', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Dieci协会',
      text: 'Dieci协会的科员们相信，知识是需要被“消化”的。今天的任务是去后巷的救济站分发食物——顺便保护它不被抢劫。',
      choices: [
        { t: '守住救济站', check: { s: ['skill', 'social'], dc: 48 },
          ok: { r: '一整天，排队的人一直排到了街尾。没有人来闹事——也可能是看到了你。', eff: [{ merit: 2, cnt: { req: 1 }, mind: 3, fame: 2 }, pay(0.6)] },
          no: { r: '一伙人冲进来抢走了半车物资。科长说，“这也是一种知识。”', eff: { merit: -1, mind: -2 } } },
        { t: '和科长讨论“知识”', check: { s: 'wit', dc: 55 },
          ok: { r: '你们聊到了深夜。你好像理解了一点什么，但说不清楚。', eff: { wit: 5, mind: 2 } },
          no: { r: '科长说你还没有准备好“消化”这些东西。', eff: { wit: 1 } } },
      ] },
    { id: 'fx_as_cinq', age: [20, 65], req: { flag: 'as_cinq', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Cinq协会',
      text: 'Cinq协会受理了一场决斗的见证与执行。决斗双方之一临阵退缩，按照协会的规则，你需要代替他出战。',
      choices: [
        { t: '按规矩出战', check: { s: 'skill', dc: 60 },
          ok: { r: '你赢了。对手倒下的时候，向你行了一个标准的礼。{pay}。', eff: [...ok(2, 3), { skill: 2 }] },
          no: { r: '你输了，但输得很体面。对手没有补刀。', eff: { body: -10, fame: 1, merit: -1 } } },
        { t: '拒绝代战', eff: { merit: -3, fame: -3 }, r: '科长冷冷地看着你：“规则就是规则。”你在协会的处境变得很难看。' },
      ] },
    { id: 'fx_as_oufi', age: [20, 65], req: { flag: 'as_oufi', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Öufi协会',
      text: '一个商人违反了合约。Öufi协会派你去执行违约惩罚——合约上写得清清楚楚：违约者需以“等价之物”赔偿。',
      choices: [
        { t: '照合约执行', check: { s: 'skill', dc: 52 },
          ok: { r: '你按照合约上的条款，一项一项地执行了。商人全程都在哭。{pay}。', eff: [...ok(2, 1), { mind: -3, dist: 2 }] },
          no: { r: '商人雇了收尾人保护自己。合约没能执行，协会对你很失望。', eff: { merit: -2, body: -5 } } },
        { t: '找出合约的漏洞', check: { s: 'wit', dc: 60 },
          ok: { r: '你发现对方也有违约行为。双方的惩罚相互抵消了。科长看了你很久，说：“你很适合这里。”', eff: ok(2, 2, 1.1) },
          no: { r: '合约无懈可击。你只能照章执行。', eff: [...ok(1, 0), { mind: -4 }] } },
      ] },
    { id: 'fx_as_devyat', age: [20, 65], req: { flag: 'as_devyat', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Девять协会',
      text: 'Девять协会的规矩只有一条：包裹必须送到。这一次的包裹要穿过三个帮派的地盘。',
      choices: [
        { t: '硬闯', check: { s: ['skill', 'body'], dc: 56 },
          ok: { r: '你送到了。收件人打开包裹，里面是一封手写的信。{pay}。', eff: ok(2, 2) },
          no: { r: '你在第二个帮派的地盘里被截住了。包裹被抢走，你被打成重伤。', eff: [...hurt(12, 0.08), { merit: -2 }] } },
        { t: '绕路', check: { s: 'wit', dc: 50 },
          ok: { r: '你绕了四个区，晚了一天，但送到了。科长说，晚到的包裹也是送到了。', eff: ok(1, 1) },
          no: { r: '你迷路了，最后在后巷深宵之前找到了一间废弃的仓库躲了起来。包裹第二天才送到。', eff: [{ mind: -3 }, pay(0.5)] } },
      ] },
    { id: 'fx_as_tres', age: [20, 65], req: { flag: 'as_tres', job: 'fixer' }, w: 12, repeat: true, cd: 5, title: 'Tres协会',
      text: 'Tres协会查到一批来源不明的工坊武器在后巷流通。你的任务是找到源头。',
      choices: [
        { t: '顺藤摸瓜', check: { s: ['wit', 'social'], dc: 55 },
          ok: { r: '源头是一个被关掉的工坊的前员工，他在地下室里偷偷仿制。你没收了全部存货。{pay}。', eff: ok(2, 2) },
          no: { r: '线索断了。几周后，一把仿制的武器在某次火并中炸膛，死了七个人。', eff: { merit: -1, mind: -3 } } },
        { t: '私吞一把', eff: { skill: 3, flag: 'workshop_weapon', dist: 1 }, r: '你挑了一把最趁手的，剩下的交了上去。没人发现。' },
      ] },
    { id: 'fx_assoc_promote', age: [25, 65], req: { flag: 'assoc', job: 'fixer', rank: [1, 4], noflag: 'section_director' }, w: 6, title: '科长',
      text: '{org}的科长退休了。上面的人问你，愿不愿意接手这个科。',
      choices: [
        { t: '接手', eff: { flag: 'section_director', fame: 6, fn: (S) => { S.job.org = S.job.org.replace(/(\d)科$/, '$1科 科长'); if (!/科长/.test(S.job.org)) S.job.org += ' 科长'; } }, r: '你成了{org}。你的办公桌上多了一摞文件，和一沓阵亡科员的家属联系方式。' },
        { t: '我只想当一线收尾人', r: '你推掉了。上面的人说你“不识抬举”。' },
      ] },

    // ---------- 杂事 ----------
    { id: 'fx_night_job', age: [18, 65], req: { job: 'fixer' }, w: 7, title: '深宵的委托',
      text: '凌晨两点四十分，你接到一单急件：去{d}区取一样东西，必须在三点十三分之前送到。报酬是平时的三倍。',
      choices: [
        { t: '接', check: { s: ['body', 'wit'], dc: 52, mod: (S) => (S.traits.includes('夜行者') ? 0.25 : 0) },
          ok: { r: '三点十一分，你把东西交到了委托人手里。他关门的时候，街上的路灯开始熄灭。{pay}。', eff: [...ok(1, 1, 3), { mind: -2 }] },
          no: { r: '三点十二分，你还在半路上。路灯熄了。你把急件塞进怀里，钻进了最近的一个下水道口。', eff: { body: -10, mind: -6, dist: 4, risk: [0.3, '接下了一单必须在凌晨三点十三分之前送达的急件。没能赶到。'] } } },
        { t: '不接', r: '你把终端扣在桌上，继续睡觉。' },
      ] },
    { id: 'fx_famous_meet', age: [18, 65], req: { job: 'fixer' }, w: 4, title: '传闻中的人',
      text: '一次大型委托的集合点，你远远地看到了一个人。周围的收尾人自动给他让出了一圈空地，有人低声说：“那是特色。”',
      choices: [
        { t: '上前打招呼', res: [
          { w: 6, r: '他看了你一眼，没有说话。那一眼让你在原地站了很久。', eff: { mind: -1, skill: 1 } },
          { w: 3, r: '他说：“别死得太早。”这是你这辈子听过的最好的建议。', eff: { mind: 3 } },
          { w: 1, r: '他问你叫什么名字。你说了。他点点头，说记住了。你不知道这是好事还是坏事。', eff: { fame: 3 } },
        ] },
        { t: '远远地看着', eff: { skill: 1 }, r: '那一次委托，你只看到了他出手的一瞬间。你花了很多年去模仿那一瞬间。' },
      ] },
    { id: 'fx_quit', age: [40, 75], req: { job: 'fixer' }, w: (S) => (S.age > 55 ? 30 : 8), title: '金盆洗手',
      text: (S) => '你当了' + S.job.years + '年收尾人。最近，你在委托里的反应慢了一点点——在这一行，一点点就足够要命了。',
      choices: [
        { t: '退休', eff: { job: { id: 'retired' }, mind: 4 }, r: '你把收尾人证锁进了抽屉。第一个不用接委托的早晨，你不知道该做什么。' },
        { t: '再干几年', eff: { mind: -1 }, r: '你还放不下。也许是放不下钱，也许是放不下别的什么。' },
        { t: '转去教新人', req: { rank: [1, 5] }, eff: { job: { id: 'retired' }, social: 4, flag: 'teacher' }, r: '你在后巷开了一间小小的道场。来学的人不多，但每一个你都认真教。' },
      ] },
    { id: 'fx_freelance_scam', age: [18, 60], req: { job: 'fixer', flag: 'freelance' }, w: 8, title: '自由的代价',
      text: '你完成了委托，委托人却不肯付尾款。他说，你是自由收尾人，没有事务所替你撑腰。',
      choices: [
        { t: '用你的方式讨回来', check: { s: 'skill', dc: 45 },
          ok: { r: '他最后付了双倍。“误会，都是误会。”', eff: { money: 120000, fame: 1 } },
          no: { r: '他雇的保镖把你打了出去。', eff: { body: -6, fame: -2 } } },
        { t: '向하나协会投诉', check: { s: 'wit', dc: 50 },
          ok: { r: '协会出面了。委托人不仅付了钱，还被记入了黑名单。', eff: { money: 80000 } },
          no: { r: '投诉被驳回，理由是“证据不足”。', eff: { mind: -2 } } },
        { t: '认栽', eff: { mind: -3 }, r: '你在笔记本上记下了他的名字。' },
      ] },
    { id: 'fx_broke_contract', age: [20, 65], req: { job: 'fixer', rank: [3, 8] }, w: 5, title: '违约',
      text: '你同时接了两单委托，现在才发现它们互相冲突：一个要你保护某人，另一个要你杀掉同一个人。',
      choices: [
        { t: '违约其中一单', eff: { flag: 'fx_broke_contract', queue: ['fx_oufi_visit', 2], money: 200000 }, r: '你选了报酬更高的那一单。另一个委托人说，他会找Öufi协会。' },
        { t: '两单都退', eff: { money: -100000, fame: -2 }, r: '你赔了两份违约金。在这一行，信誉比命贵。' },
        { t: '设法两单都完成', check: { s: 'wit', dc: 70 },
          ok: { r: '你让目标“死”了一次，又让他换了身份活下去。两个委托人都很满意。你觉得自己是个天才。', eff: { money: 500000, wit: 3, fame: 3 } },
          no: { r: '你的计划在最后一步出了岔子。两个委托人都想要你的命。', eff: { flag: 'fx_broke_contract', queue: ['fx_oufi_visit', 1], fame: -3 } } },
      ] },
    { id: 'fx_oufi_visit', manual: true, req: { flag: 'fx_broke_contract' }, title: 'Öufi协会',
      text: '两个穿制服的人出现在你的门口。“根据合约第十四条，违约方需以等价之物赔偿。我们来执行。”',
      choices: [
        { t: '赔钱', req: { money: [500000, null] }, eff: { money: -500000 }, r: '他们清点了金额，在合约上盖了一个章，礼貌地离开了。' },
        { t: '赔上一只手', eff: { body: -10, pros: 1, mind: -5 }, r: '他们的动作很专业，几乎不疼。' },
        { t: '反抗', check: { s: 'skill', dc: 72 },
          ok: { r: '你打伤了他们，逃出了这个区。但你知道，Öufi协会从不放弃。', eff: { flag: 'oufi_hunted', fame: -5 } },
          no: { r: '他们很专业。', eff: { death: '违反了合约。Öufi协会依约执行了赔偿。' } } },
      ] },
  ]);

  function joinAssoc(S, k) {
    const sec = S.rng.int(3, S.rulesVersion >= 4 ? 6 : 7);
    const dir = S.rng.chance(0.4) ? S.rng.pick(['东部', '西部', '南部', '北部']) : '';
    S.job.org = ASSOC[k].n + ' ' + dir + sec + '科';
    S.flags.assoc = true; S.flags['as_' + k] = true;
    delete S.flags.office_member; delete S.flags.freelance;
    S.fame = Math.min(100, S.fame + 4);
  }

  CITY.addAch({
    fx_license: { name: '收尾人', desc: '拿到了하나协会的收尾人证。', tier: 'common', group: '收尾人', test: (S) => !!S.flags.fixer_license },
    fx_g5: { name: '中坚', desc: '成为5阶收尾人。', tier: 'uncommon', group: '收尾人', test: (S) => S.flags.fixer_license && S.job.id === 'fixer' && S.job.rank <= 5 || S.flags.fx_g1 },
    fx_g3: { name: '高阶收尾人', desc: '成为3阶收尾人。', tier: 'rare', group: '收尾人', test: (S) => (S.job.id === 'fixer' && S.job.rank <= 3) || S.flags.fx_g1 },
    fx_g1: { name: '1阶', desc: '成为1阶收尾人。', tier: 'epic', group: '收尾人' },
    fx_color: { name: '特色', desc: '被授予“特色”的称号。', tier: 'legend', group: '收尾人', hidden: true, hint: '走到收尾人的顶点之上。' },
    fx_star: { name: '都市之星', desc: '完成了一则都市之星级的委托。', tier: 'legend', group: '收尾人', hidden: true, hint: '接下那则委托，并且活下来。' },
    fx_assoc: { name: '协会的人', desc: '加入了某个收尾人协会。', tier: 'uncommon', group: '收尾人', test: (S) => !!S.flags.assoc },
    fx_director: { name: '科长', desc: '成为协会的科长。', tier: 'rare', group: '收尾人', test: (S) => !!S.flags.section_director },
    fx_office: { name: '代表', desc: '拥有了自己的事务所。', tier: 'uncommon', group: '收尾人', test: (S) => !!S.flags.office_own },
    fx_100: { name: '百单', desc: '一生完成了100件以上的委托。', tier: 'rare', group: '收尾人', test: (S) => (S.c.req || 0) >= 100 },
    fx_retire: { name: '金盆洗手', desc: '作为收尾人活着退休了。', tier: 'rare', group: '收尾人', test: (S) => S.job.id === 'retired' && S.flags.fixer_license },
    fx_spared: { name: '开门的人', desc: '多年前放过的人回来道谢。', tier: 'rare', group: '收尾人', hidden: true, hint: '收尾人不问理由——但你问了。', test: (S) => !!S.used.fx_spared_back },
    fx_cyborg: { name: '义体收尾人', desc: '身上装了三处以上的义体。', tier: 'uncommon', group: '收尾人', test: (S) => S.pros >= 3 && S.flags.fixer_license },
    fx_oufi: { name: '等价之物', desc: '被Öufi协会上门执行了违约赔偿。', tier: 'rare', group: '收尾人', hidden: true, hint: '合约就是合约。', test: (S) => !!S.used.fx_oufi_visit },
    fx_die9: { name: '9阶的末路', desc: '作为9阶收尾人死去。', tier: 'common', group: '收尾人', test: (S) => S.job.id === 'fixer' && S.job.rank === 9 },
  });
})();
