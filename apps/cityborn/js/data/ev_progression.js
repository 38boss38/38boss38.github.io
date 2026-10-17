/* 将已有的经历、物件和新成长节点接到同一套状态上。 */
(function () {
  'use strict';
  const C = window.CITY;
  const living = { nojob: ['distorted', 'book'], fn: (S) => S.rulesVersion >= 3 };
  C.afterSimpleEvent = function (S, e) {
    if (e.id === 'b_bs_mid') C.gainItem(S, 'family_recipe');
    if (e.id === 'b_bs_mid3') C.gainItem(S, 'old_tools');
    if (e.id === 'i_gift') C.gainItem(S, 'heirloom_badge');
    if (e.id === 'lv_heirloom_reply') C.gainItem(S, 'reply_corner');
  };
  C.afterEventResult = function (S, e, choice, result, judged, before) {
    const i = e.choices.indexOf(choice), notes = [];
    if (judged) {
      const stat = Array.isArray(choice.check.s) ? choice.check.s : [choice.check.s];
      if (judged.ok) S.c.checkWins = (S.c.checkWins || 0) + 1;
      if (stat.some((s) => ['skill', 'body'].includes(s))) {
        const key = judged.ok ? 'combatWins' : 'combatFailures'; S.c[key] = (S.c[key] || 0) + 1;
      }
      if (judged.ok && stat.includes('social')) S.c.socialWins = (S.c.socialWins || 0) + 1;
    }
    if (S.flags.fixer_license) C.gainItem(S, 'fixer_license');
    else if (S.flags.fx2_revoked) C.removeItem(S, 'fixer_license');
    const give = (id, text) => { if (C.gainItem(S, id) && text) notes.push(text); };
    const physicalWeapon = (id, body = false) => {
      S.st.skill = before.skill; if (body) S.st.body = before.body;
      give(id);
    };
    if (e.id === 'fx_buy_weapon') physicalWeapon(['stigma_blade', 'cloud_blade', 'allas_gloves'][i], i === 2);
    if (e.id === 'fx_req_workshop' && judged && judged.ok) physicalWeapon('workshop_blade');
    if (e.id === 'fx_as_tres' && i === 1) physicalWeapon('borrowed_blade');
    if (e.id === 'fx_spared_back' && /亲手打的刀/.test(String(result.r))) physicalWeapon('handmade_knife');
    if (e.id === 'fx2_maintenance' && i === 0) give('repair_slip');
    if (e.id === 'lf_tools_adult' && i === 0) give('workshop_key', '锁住工具匣的小钥匙也一并交给了你。');
    if (e.id === 'lf_tools_adult' && i === 1) give('inherited_pliers');
    if (e.id === 'lf_tools_late' && S.flags.lf_bench) give('marked_lamp', '工作台角落那盏刻着你名字的灯，你一直没有卖。');
    if (e.id === 'lf_study_youth' && i === 0) give('shared_textbook', '交还前，你们把常用的几页合抄下来，各留一份。');
    if (e.id === 'lf_neighbor_adult' && i === 1) give('red_thread_key', '你把新钥匙系上红绳，留在随身的衣袋里。');
    if (e.id === 'lf_road_youth' && i === 0) give('route_map', '回去以后，你把车站和回程时刻画在一张纸上。');
    if (e.id === 'lf_debt_adult' && i === 0) give('loan_note');
    if (e.id === 'lf_voices_youth' && i === 0) give('original_tape');
    if (e.id === 'lv_heirloom' && i === 1) C.removeItem(S, 'heirloom_badge');
    if (e.id === 'lv_heirloom_archive') give('nameless_photo');
    if (e.id === 'act_casino' && S.money < (S.vars.pg_beforeBet || 0)) S.c.gamblingLosses = (S.c.gamblingLosses || 0) + 1;
    return notes.join('');
  };
  // 使用原物件的后续选项，身份和旧前置仍需同时满足。
  function addChoice(id, choice) { const e = C.getEvent(id); if (e) e.choices.push(choice); }
  addChoice('fx2_service', { t: '出示检修原件要求免单', req: { item: 'repair_slip' },
    r: '新技师逐项比对原件，把新换的零件号写在旧单背面。你没有付第二次钱。', eff: { skill: 2, mind: 2 } });
  addChoice('lf_study_adult', { t: '拿合抄页替人核对条件', req: { item: 'shared_textbook' },
    r: '你按当年的笔记逐项核对。对方缺的不是担保，而是一个已经搬走的部门地址。你们把材料改好了。',
    eff: { wit: 2, social: 2, trait: '识账', queue: ['lf_study_late', 14] } });
  addChoice('lf_road_late', { t: '沿手记路线带对方走一程', req: { item: 'route_map' },
    r: '有一处旧站已经封了，你们照着旁边补写的小路绕过去，赶上了下一班车。对方把自己的新地址也写在图背面。',
    eff: { social: 3, trait: '守诺', set: { lifeLegacy: '你保留的路线图背面，多过一个陌生人的住址。' } } });
  const voiceChoice = { t: '拿原带请对方逐句辨认', req: { item: 'original_tape' },
    r: '对方辨出其中一段是换班点数，另一段仍听不清。你在原来的空白处补上解释，没有擦掉录音。',
    eff: { wit: 2, trait: '长夜听觉', flag: 'lf_explained', queue: ['lf_voices_late', 15] } };
  C.getEvent('lf_voices_adult').choices[1] = voiceChoice;
  // 遗物真实离手以后不能凭空出示。
  for (const id of ['lv_heirloom_address', 'lv_heirloom_archive', 'lv_heirloom_reply']) {
    const e = C.getEvent(id); if (e) e.req = { ...e.req, item: 'heirloom_badge' };
  }
  const casino = C.getEvent('act_casino');
  if (casino) casino.eff = [casino.eff, { fn: (S) => { S.vars.pg_beforeBet = S.money; } }];

  C.addEvents('progression', [
    { id: 'pg_training', age: [16, 70], req: { ...living, notrait: '强韧体魄', cnt: { focus_train: [10, null] }, st: { body: [55, null] } }, w: 16, title: '身体记住了',
      text: '你练完惯常的那一组动作，才发现今天还没有喘。陪练的人让你再加一组，说下次真有人追上来，不会等你把气喘匀。', choices: [
        { t: '加一组，练到动作不散', r: '最后几下很难看，你还是收好了姿势。第二天醒来，酸痛的位置和刚开始练时已经不同。', eff: { trait: '强韧体魄', body: -2 } },
        { t: '留些力气去干活', r: '你洗净手，赶去下一班工。身体不是摆来给人看的，还得靠它吃饭。', eff: { money: 8000, mind: 2 } },
      ] },
    { id: 'pg_reading', age: [14, 75], req: { ...living, notrait: '过目不忘', cnt: { focus_study: [8, null] }, st: { wit: [50, null] } }, w: 16, title: '翻到同一页',
      text: '夜校的老师念到一半停下，让你接着往下说。你没翻书，竟然记得后面那一段，连去年在页边改过的错字都记得。', choices: [
        { t: '把记忆的方法教给同桌', r: '你讲了半天，同桌只学会一半。你这才发现，自己记住的是句子之间的次序。', eff: { trait: '过目不忘', social: 1 } },
        { t: '用来多接一份校对', r: '你核对了几夜，把报酬数了两遍。书上的字还是那些字，眼睛已经有点发酸。', eff: { money: 15000, body: -1 } },
      ] },
    { id: 'pg_fixer_instinct', age: [20, 75], req: { ...living, job: 'fixer', notrait: '老练', cnt: { combatWins: [6, null] } }, w: 18, title: '提前一步',
      text: '委托人还没说完，你已经看向了第二个出口。同行问你怎么知道那里会有人，你答不上来，只是记得以前有人站过相似的位置。', choices: [
        { t: '换掉原来的进场路线', r: '你们避开了一个糟糕的角度。回来后，你在委托单上多画了一条线，提醒自己下次也别省这一步。', eff: { trait: '老练', skill: 1 } },
        { t: '把经验传给同行', r: '对方把你说的几处位置记好，分给你一部分情报费。你们没有互报真名。', eff: { social: 3, money: 10000 } },
      ] },
    { id: 'pg_speech', age: [18, 75], req: { ...living, notrait: '能说会道', cnt: { socialWins: [6, null] }, st: { social: [45, null] } }, w: 14, title: '等对方说完',
      text: '对方把已经说过的话又讲了一遍，语气却变了。你没有急着接，等到最后，终于听见真正不肯退让的是哪一项。', choices: [
        { t: '从那一项重新谈起', r: '你们谈妥了条件。临走时，对方说你比从前会说话，你记得自己其实少说了很多。', eff: { trait: '能说会道' } },
        { t: '把条件写下来，各自核对', r: '纸上删去几句好听话，只剩双方肯负责的部分。你拿走自己的一份。', eff: { trait: '识账', wit: 1 } },
      ] },
    { id: 'pg_old_wound', age: [18, 85], req: { ...living, notrait: '旧伤', st: { body: [null, 30] } }, w: 12, title: '下雨前的旧伤',
      text: '你还没看见雨，伤处已经开始酸。医生问上次受伤后休息了多久，你报了个数，他把笔放下，又问了一遍。', choices: [
        { t: '继续工作，先忍过去', r: '你把绷带扎紧。伤口表面早已长好，里面那点不对劲却没有消失。', eff: { trait: '旧伤', money: 10000 } },
        { t: '付费处理，停工养伤', req: { money: [50000, null] }, r: '你把下一笔活推掉，按时换药。恢复得很慢，总算没有再一变天就疼。', eff: { money: -50000, body: 5 } },
        { t: '少接一点活，慢慢养', r: '收入少了一截。你把能坐着做的事挪到一起，尽量不再用坏掉的地方硬撑。', eff: { money: -15000, body: 2, mind: -1 } },
      ] },
    { id: 'pg_aftershock', age: [18, 80], req: { ...living, notrait: ['余悸', '神经过敏'], cnt: { combatFailures: [5, null] }, st: { mind: [null, 45] } }, w: 12, title: '手比记忆更快',
      text: '有人在你身后碰倒一把椅子。你猛地躲开，碰翻了自己面前的碗。周围的人看着你，你知道刚才那个动作是从哪里学来的。', choices: [
        { t: '收拾碎片，装作没事', r: '你赔了碗钱。此后每次背对门坐下，肩膀都很难真正松开。', eff: { trait: '余悸', money: -500 } },
        { t: '请熟悉的人陪着练习', r: '你们约定先出声，再从背后靠近。第一天只练了几次，你就得停下来。', eff: { money: -8000, mind: 3 } },
      ] },
    { id: 'pg_recovery', age: [16, 100], req: { ...living, any: [{ trait: '旧伤' }, { trait: '余悸' }, { trait: '神经过敏' }, { trait: '体弱多病' }] }, w: 13, title: '把这一处治完',
      text: '诊所提出一个完整疗程，费用要八万眼。医生没有保证你会变得更强，只说不要每次好一点就立刻停药复工。', choices: [
        { t: '做完疗程再复工', req: { money: [80000, null] }, r: '你按约定回来复查。最后一张缴费单拿到手时，那种一直拖着的疼痛或惊跳已经减轻了。', eff: { money: -80000, untrait: ['旧伤', '余悸', '神经过敏', '体弱多病'], body: 3, mind: 3 } },
        { t: '先按休养计划慢慢来', req: { cnt: { focus_rest: [6, null] } }, r: '你把休息当成固定要做的事。变化很小，过了很久才发现，自己又能背对门坐一会儿。', eff: { money: -10000, untrait: '余悸', mind: 3 } },
        { t: '现在还负担不起', r: '你收好价目表。等攒够钱之前，先记住哪些动作不能硬做。', eff: { wit: 1 } },
      ] },
    { id: 'pg_steady', age: [20, 90], req: { ...living, notrait: '坚韧心志', cnt: { focus_rest: [8, null] }, st: { mind: [60, null] } }, w: 14, title: '先把呼吸找回来',
      text: '事情出了岔子，周围的人都在催。你先让自己慢慢呼吸，等手不再抖，才去处理还能处理的部分。并不是第一次了。', choices: [
        { t: '按顺序把事情做完', r: '你没有一下子想完所有坏结果。等眼前这一件办完，下一件才有地方落脚。', eff: { trait: '坚韧心志' } },
        { t: '陪最慌张的人待一会儿', r: '你们没有聊太多。对方把杯里的水喝完，终于肯松开一直攥着的手。', eff: { social: 3, mind: 2 } },
      ] },
    { id: 'pg_nerves', age: [18, 85], req: { ...living, notrait: ['神经过敏', '余悸'], cnt: { combatFailures: [5, null] }, st: { mind: [null, 30] } }, w: 10, title: '总在半夜醒来',
      text: '你已经连续几夜在同一个时刻醒来。白天有人把门关得重一点，你也会立刻看过去。医生问你是不是最近经历过什么，你没有马上回答。', choices: [
        { t: '照常接活，等它自己过去', r: '你把咖啡兑得更浓。后来连楼上挪椅子的声音，也能让你突然坐直。', eff: { trait: '神经过敏', money: 8000 } },
        { t: '停一阵，处理睡眠问题', req: { money: [20000, null] }, r: '医生让你按时复诊。最开始的几晚仍不好过，但你终于睡过了那个时刻。', eff: { money: -20000, mind: 5 } },
        { t: '请熟人替自己接几天班', r: '你欠下一份人情，没欠下一笔药钱。那几天你睡得很浅，至少不用再赶着出门。', eff: { social: -2, mind: 2 } },
      ] },
    { id: 'pg_handy', age: [18, 75], req: { ...living, job: ['mech', 'doctor'], notrait: '巧手', cnt: { focus_work: [6, null] } }, w: 14, title: '手里的分寸',
      text: '你把工具放下，才发现原本需要旁人扶着的那一步，今天独自就做完了。旧同事看了一眼，说下次可以试着接更细的活。', choices: [
        { t: '把做法练到稳定下来', r: '你没有急着加价，先把同样的动作练了很多遍。后来再碰到那一步，手里已经有了分寸。', eff: { trait: '巧手', skill: 1 } },
        { t: '先把这笔活结清', r: '你把工具擦净，收入收好。等下次有空，再考虑那些更细的活。', eff: { money: 12000 } },
      ] },
    { id: 'pg_mechanic', age: [20, 80], req: { ...living, job: 'mech', notrait: '精密手感', fn: (S) => S.rulesVersion >= 3 && S.job.years >= 6 }, w: 16, title: '不用再量第二遍',
      text: '你摸到零件边缘的一点偏差，量具上的数字正好和你猜的一样。新学徒问你量具是不是坏了，你让对方先摸一摸，再去看数字。', choices: [
        { t: '把这一点手感慢慢教清楚', r: '对方练坏了几个废件，终于分得出来。你留下自己用惯的那套工具，继续做下一单。', eff: { trait: '精密手感', item: 'old_tools', social: 1 } },
        { t: '接下更精细的订单', r: '你加了价，也加了检验次数。贵一点的东西，坏起来赔得也更多。', eff: { money: 30000, wit: 2 } },
      ] },
    { id: 'pg_implant_reaction', age: [18, 90], req: { ...living, pros: [2, null], notrait: ['义体亲和', '义体排异'] }, w: 8, title: '接口发热',
      text: '义体接口比周围皮肤更热。医生看过旧手术单，问你要用便宜的抑制方案，还是重新适配整套接口。', choices: [
        { t: '先用便宜的抑制方案', r: '红肿被压下去，隔几天又冒出来。你开始随身多带一卷干净绷带。', eff: { money: -10000, trait: '义体排异' } },
        { t: '付钱重新适配', req: { money: [150000, null] }, r: '复查了几次，温度才降回正常。医生让你把新的接口参数留好。', eff: { money: -150000, body: 2 } },
      ] },
    { id: 'pg_implant_care', age: [18, 100], req: { ...living, trait: '义体排异' }, w: 14, title: '重新适配',
      text: '旧接口又红了。这次医生找到了匹配的零件，价格仍不便宜。你可以现在做，也可以继续拿抑制药。', choices: [
        { t: '更换匹配零件', req: { money: [100000, null] }, r: '你照着新的参数复查了几次。最后一次拆开绷带时，接口周围没有再发红。', eff: { money: -100000, untrait: '义体排异' } },
        { t: '暂时续药', r: '你把下一次复查的日子记在药袋上。至少这周，接口没有继续发热。', eff: { money: -8000, body: 2 } },
      ] },
    { id: 'pg_armorer', age: [18, 75], req: { ...living, job: ['fixer', 'syndicate', 'finger', 'kurokumo', 'blade'], money: [80000, null], notitem: 'reinforced_coat' }, w: 10, title: '能挡住的地方',
      text: '工坊把一件加固外套挂在灯下，指出里层耐割材料覆盖的范围。八万眼，不保证挡住所有东西，只保证没有用普通布冒充。', choices: [
        { t: '买下，穿在常服外面', r: '你活动了一下肩膀。外套略重，内侧的针脚收得很齐。', eff: { money: -80000, item: 'reinforced_coat' } },
        { t: '留着钱做别的准备', r: '你把外套挂回原处。老板没有劝，只把覆盖范围又指给下一个人看。', eff: { mind: 1 } },
      ] },
    { id: 'pg_ampule', age: [16, 85], req: { ...living, money: [50000, null] }, w: 8, title: '留一支备用',
      text: '熟悉的诊所在出售封装完好的K公司HP安瓿。一支五万眼，包装上写着一次性使用。医生问你是现在用，还是带走备用。', choices: [
        { t: '买一支，留在随身药包', req: { fn: (S) => !S.items.hp_ampule || S.items.hp_ampule.count < 5 }, r: '你收好未拆封的安瓿，避开衣袋里容易碰碎它的硬物。', eff: { money: -50000, item: 'hp_ampule' } },
        { t: '现在就在诊所用掉', r: '医生拆开包装，核对剂量。药效上来以后，你才发现自己一直在咬牙。', eff: { money: -50000, body: 12, mind: 2 } },
        { t: '暂时不买', r: '你把包装放回柜台。医生收进背光的柜子里。', eff: {} },
      ] },
    { id: 'pg_relic_return', age: [25, 85], req: { ...living, item: 'original_tape', trait: '长夜听觉' }, w: 9, title: '原带的另一面',
      text: '修录音机的人发现，你留下的原带另一面还有一小段没听过的换班口述。有人出钱买这盘带子，也有人说最好留着原件。', choices: [
        { t: '保留原件，只卖拷贝', r: '对方少付了一半的钱。你把原带放回旧盒，盒边那些磨损仍和小时候一样。', eff: { money: 12000, wit: 2 } },
        { t: '连同原件一起转让', r: '你当面数清三万眼。回去以后，柜子里空出一小块地方。', eff: { money: 30000, unitem: 'original_tape', trait: '疑心' } },
      ] },
    { id: 'pg_oath', age: [20, 85], req: { ...living, notrait: '守诺', anyflag: ['lf_trusted', 'lf_doors', 'fx2_mate_trust'] }, w: 12, title: '别人记得的那件事',
      text: '你托人问一件麻烦事，对方没有先问报酬，而是提起你以前办完的一件小事。你没想到，还有人一直记得。', choices: [
        { t: '把这次约定也说清楚', r: '你没有许诺自己办不到的部分。对方点头，把剩下的要求从头讲了一遍。', eff: { trait: '守诺' } },
        { t: '这次只谈一笔现钱', r: '你们把价钱谈妥，谁也没有拿旧事抵账。', eff: { money: 10000, social: -1 } },
      ] },
    { id: 'pg_gambling', age: [18, 85], req: { ...living, notrait: '赌瘾', cnt: { gamblingLosses: [3, null] } }, w: 12, title: '下一次总会不同',
      text: '你把上次亏掉的钱又算了一遍。赌场送来免费入场的邀请，日期正好是发薪日。你盯着“免费”两个字看了很久。', choices: [
        { t: '收好邀请，再试一次', r: '还没到那一天，你已经开始盘算下注的数目。吃饭时，也会想起筹码碰在一起的声音。', eff: { trait: '赌瘾' } },
        { t: '扔掉邀请，把损失记清', r: '你把亏掉的数目记在最显眼的地方，没有写“下次赢回来”。', eff: { mind: -2, trait: '识账' } },
      ] },
    { id: 'pg_quit_gambling', age: [18, 100], req: { ...living, trait: '赌瘾' }, w: 15, title: '发薪日不走那条路',
      text: '你把发薪后的安排排满，尽量不经过赌场。熟人说可以替你保管一部分钱，直到那阵想去的冲动过去。', choices: [
        { t: '照计划熬过一段时间', r: '你几次站在岔路口，最后还是拐去了面馆。桌上没有筹码，只有一碗吃得很慢的面。', eff: { money: -10000, untrait: '赌瘾', mind: 2 } },
        { t: '还是自己管着钱', r: '你没有答应。发薪那天，把钱数了很久才收起来。', eff: { mind: -1 } },
      ] },
  ]);
})();
