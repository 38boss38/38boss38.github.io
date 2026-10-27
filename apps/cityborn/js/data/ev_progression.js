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
    r: '新技师拿放大镜核对过护手裂纹的钢印原件，二话没说替你换上了全新轴承，一分返修费都没敢多收。', eff: { skill: 2, mind: 2 } });
  addChoice('lf_study_adult', { t: '拿合抄页替人核对条件', req: { item: 'shared_textbook' },
    r: '你翻出当年两人合抄的旧讲义逐条比对，一眼看穿合同里埋着的空壳部门地址，当场替对方改平了陷阱条款。',
    eff: { wit: 2, social: 2, trait: '识账', queue: ['lf_study_late', 14] } });
  addChoice('lf_road_late', { t: '沿手记路线带对方走一程', req: { item: 'route_map' },
    r: '主干道早已拉起封锁线，你们照着旧图纸背面标注的排污涵洞绕了过去，赶在末班车熄火前踏上了站台。',
    eff: { social: 3, trait: '守诺', set: { lifeLegacy: '你保留的路线图背面，多过一个陌生人的住址。' } } });
  const voiceChoice = { t: '拿原带请对方逐句辨认', req: { item: 'original_tape' },
    r: '对方戴着耳机反复倒带，从刺耳的电流声里辨出了守夜人的换班暗号。你在磁带盒内侧补上注释，原封不动地留住了那段空白。',
    eff: { wit: 2, trait: '长夜听觉', flag: 'lf_explained', queue: ['lf_voices_late', 15] } };
  C.getEvent('lf_voices_adult').choices[1] = voiceChoice;
  // 遗物真实离手以后不能凭空出示。
  for (const id of ['lv_heirloom_address', 'lv_heirloom_archive', 'lv_heirloom_reply']) {
    const e = C.getEvent(id); if (e) e.req = { ...e.req, item: 'heirloom_badge' };
  }
  const casino = C.getEvent('act_casino');
  if (casino) casino.eff = [casino.eff, { fn: (S) => { S.vars.pg_beforeBet = S.money; } }];
  C.ACTIONS.blackmarket = {
    name: '逛黑市与工坊展',
    desc: '花钱购置高阶护具、保命药剂或奇点秘物',
    req: { age: [18, 95], money: [150000, null], nojob: ['distorted', 'book'], fn: S => S.rulesVersion >= 8 },
    ev: 'act_blackmarket',
    cd: 2,
  };
  C.ACTIONS.seekego = {
    name: '直面心底的低语',
    desc: '当内心的杂音越发清晰时，主动在长夜里做出决断',
    req: { age: [16, 95], era: 'dist', dist: [24, null], nojob: ['distorted', 'book'], noflag: ['distorted', 'wd_voice_chosen'], fn: S => S.rulesVersion >= 8 },
    ev: 'wd_inner_voice',
    cd: 2,
  };

  C.addEvents('progression', [
    { id: 'pg_training', age: [16, 70], req: { ...living, notrait: '强韧体魄', cnt: { focus_train: [10, null] }, st: { body: [55, null] } }, w: 16, title: '挨揍熬出来的硬骨头',
      text: '负重跑完最后五条暗巷，你扶着生锈的消防梯吐出一口白气，胸腔里居然不再像破风箱那样火辣辣地疼了。\n\n陪练的老手用铁棍敲了敲你的肩胛骨，问你还加不加练：“真到了被人堵进死胡同的那天，谁会等你喘匀了气再落刀？”', choices: [
        { t: '往沙袋上再绑两块铅板，练到脱力为止', r: '汗水混着血痂把背心浸透了三层。第二天从硬板床上爬起来时，你捏了捏双拳，感觉这副皮囊终于扛得住后巷的钝器了。', eff: { trait: '强韧体魄', body: -2 } },
        { t: '见好就收，留着力气去应付明早的差事', r: '你拧干毛巾擦净脖子上的汗，按时锁门歇息。身体是拿来挣饭吃的本钱，犯不着在训练场上先把自己折腾废了。', eff: { money: 8000, mind: 2 } },
      ] },
    { id: 'pg_reading', age: [14, 75], req: { ...living, notrait: '过目不忘', cnt: { focus_study: [8, null] }, st: { wit: [50, null] } }, w: 16, title: '刻进脑仁里的字行',
      text: '夜校的煤油灯芯爆了个灯花，讲课的先生突然合上发黄的条例册，点名让你接着往下背。\n\n你甚至没低头看一眼讲义，连那页纸右下角被人用红笔批注的三行违约罚则都一字不差地背了出来。', choices: [
        { t: '把拆解记忆的诀窍拆给同桌听', r: '你拿着铅笔头在草稿纸上画了半宿的结构图。\n\n教会同桌一半的时候，你自己反倒把整套条文的脉络彻底烙进了脑子里。', eff: { trait: '过目不忘', social: 1 } },
        { t: '趁着脑子好使，去接两份急件校对私活', r: '你熬了三个通宵，替一家外包商核完了整箱错漏百出的货单，换回一沓崭新的钞票和两只布满血丝的眼睛。', eff: { money: 15000, body: -1 } },
      ] },
    { id: 'pg_fixer_instinct', age: [20, 75], req: { ...living, job: 'fixer', notrait: '老练', cnt: { combatWins: [6, null] } }, w: 18, title: '闻出埋伏的鼻翼',
      text: '雇主还在唾沫横飞地介绍仓库地形，你的视线却已经越过他的肩膀，死死锁在了二楼那扇半掩的排风百叶窗上。\n\n旁边的搭档顺着你的目光摸上刀柄，压低嗓子问你怎么知道上头藏着火枪手——你答不上来，只是死人堆里滚多了，连空气里火药受潮的味儿都闻得出来。', choices: [
        { t: '当场推翻原定路线，从盲区绕后破门', r: '你们贴着滴水的墙根摸上二楼，在枪手扣扳机前拧断了他的脖子。\n\n打那以后，无论接多急的单子，你进门前都会先给自己的退路留三秒钟。', eff: { trait: '老练', skill: 1 } },
        { t: '把这套看风水的保命经验卖给同行', r: '你在烟盒背面画下三处最容易藏冷枪的死角，换了同行半包好烟和一笔可观的线报费。', eff: { social: 3, money: 10000 } },
      ] },
    { id: 'pg_speech', age: [18, 75], req: { ...living, notrait: '能说会道', cnt: { socialWins: [6, null] }, st: { social: [45, null] } }, w: 14, title: '听弦外之音的耳朵',
      text: '谈判桌对面的中间人把茶杯端起来又放下，车轱辘话来回倒了三遍，嗓门却一次比一次虚。\n\n你稳稳当当地靠在椅背上没接茬，直到他额角渗出冷汗，才终于听清他真正死保的底牌究竟是哪一条。', choices: [
        { t: '顺着他的软肋，一刀切进正题', r: '不过三言两语，原本僵持不下的分成比例便顺着你的意思定了盘。散场时对方苦笑着拍拍你的肩，说跟你这种人打交道实在太费神。', eff: { trait: '能说会道' } },
        { t: '把口头试探全压成白纸黑字的免责单', r: '你拔出钢笔，把一切漂亮场面话统统划掉，只留下双方违约时该剁哪只手的硬条款。', eff: { trait: '识账', wit: 1 } },
      ] },
    { id: 'pg_old_wound', age: [18, 85], req: { ...living, notrait: '旧伤', st: { body: [null, 30] } }, w: 12, title: '阴雨天钻心的骨缝',
      text: '外头的铅云还没落雨，你肋骨下那道前年留下的旧刀口就已经像塞了把碎玻璃似的隐隐作痛。\n\n黑诊所的大夫用听诊器按了按你的胸口，摘下眼镜问你上次拆线后歇了几天——听完你报的数字，他像看疯子一样把笔摔在了桌上。', choices: [
        { t: '往嘴里塞两粒止痛片，绑紧护腰照常出工', r: '药片压住了表层的抽痛，却压不住骨膜深处的磨损。从这天起，每逢变天，你的动作都会比平时慢上半拍。', eff: { trait: '旧伤', money: 10000 } },
        { t: '掏五万眼买半支稀释安瓿，停工彻底清创', req: { money: [50000, null] }, r: '大夫切开长歪的陈旧疤痕重新对接神经。你在床上老老实实躺了半个月，总算把那股钻心的阴寒拔干净了。', eff: { money: -50000, body: 5 } },
        { t: '推掉重体力活，调去干坐冷板凳的轻省差事', r: '进账顿时少了一大截，但不用再每天咬着牙搬重物，发炎的骨缝总算能慢慢喘口气了。', eff: { money: -15000, body: 2, mind: -1 } },
      ] },
    { id: 'pg_aftershock', age: [18, 80], req: { ...living, notrait: ['余悸', '神经过敏'], cnt: { combatFailures: [5, null] }, st: { mind: [null, 45] } }, w: 12, title: '比脑子更快拔刀的手',
      text: '面馆里，邻桌的食客不小心碰倒了铁皮筷子筒。\n\n清脆的哐当声刚响了一半，你已经本能地掀翻桌子滚进墙角，拔出一半的刀刃死死抵在胸前——直到满屋子人像看怪物一样盯着你，你才发现手背上全是冷汗。', choices: [
        { t: '默默掏钱赔了碎碗，把刀插回鞘里', r: '你低着头数出零钞。从那以后，无论去哪家馆子吃饭，只要后背没有严严实实地贴着水泥墙，你就连一口热汤都咽不下去。', eff: { trait: '余悸', money: -500 } },
        { t: '花钱请老搭档陪你做脱敏训练', r: '整整半个月，你强迫自己闭着眼坐在噪杂的工坊旁听铁器砸地声。虽然偶尔还是会惊跳，但至少手指不再死死扣着扳机了。', eff: { money: -8000, mind: 3 } },
      ] },
    { id: 'pg_recovery', age: [16, 100], req: { ...living, any: [{ trait: '旧伤' }, { trait: '余悸' }, { trait: '神经过敏' }, { trait: '体弱多病' }] }, w: 13, title: '把亏空的底子补回来',
      text: '一位从巢内医院退下来的老医师翻看完你厚厚一沓病历，开出了一份整整三个月的深度调理方案。\n\n“八万眼，不包你脱胎换骨，”老医师敲着药方说，“但能把你这几年拿命换钱留下的暗病和惊悸连根拔掉，前提是你这仨月绝不能再见血。”', choices: [
        { t: '咬牙付清八万眼，关掉终端安心静养', req: { money: [80000, null] }, r: '温热的药浴与规律的睡眠一点点抚平了紧绷的神经。当你拿到最后一张复查合格单时，久违地睡了一个没有噩梦的整觉。', eff: { money: -80000, untrait: ['旧伤', '余悸', '神经过敏', '体弱多病'], body: 3, mind: 3 } },
        { t: '靠这几年攒下的休养习惯，自己慢慢调理', req: { cnt: { focus_rest: [6, null] } }, r: '你每天雷打不动地早睡、泡脚、晒后巷顶楼那半小时的太阳。没花大钱，但某天清晨醒来，你发现自己终于不再听见风声就心悸了。', eff: { money: -10000, untrait: '余悸', mind: 3 } },
        { t: '把药方折好揣进怀里，等攒够钱再说', r: '八万眼不是个小数目。你记下了老医师叮嘱的几条忌口，打算先靠护具和止痛片再撑一阵子。', eff: { wit: 1 } },
      ] },
    { id: 'pg_steady', age: [20, 90], req: { ...living, notrait: '坚韧心志', cnt: { focus_rest: [8, null] }, st: { mind: [60, null] } }, w: 14, title: '泰山崩于前而呼吸不乱',
      text: '警报拉响的那一刻，整条走廊的人都在尖叫着往安全门挤。\n\n唯独你站在原地，先深深吸进一口带着铁锈味的空气，等颤抖的指尖彻底稳住，才蹲下身一格格系紧靴带——在都市里见惯了天塌下来的场面，慌乱早就成了最没用的累赘。', choices: [
        { t: '按部就班清点手头工具，从侧翼撤离', r: '别人撞得头破血流时，你已经顺着备用检修道安然脱身。只要脑子里的弦不断，这世上就少有能把你逼上绝路的死局。', eff: { trait: '坚韧心志' } },
        { t: '顺手拽住身边吓傻的新人，带他一起走', r: '你一巴掌拍醒那个满脸鼻涕眼泪的倒霉蛋，拎着他的后领走出了封锁区。事后他千恩万谢，成了你最忠实的耳目。', eff: { social: 3, mind: 2 } },
      ] },
    { id: 'pg_nerves', age: [18, 85], req: { ...living, notrait: ['神经过敏', '余悸'], cnt: { combatFailures: [5, null] }, st: { mind: [null, 30] } }, w: 10, title: '凌晨三点的幻听',
      text: '你已经连续十几个夜晚在凌晨三点整猛然惊醒，浑身冷汗地盯着房门插销。\n\n哪怕白天走在光天化日的街上，只要身后有人的皮鞋声跟得近了半步，你的后颈就会像被刀尖抵住一样瞬间炸起寒毛。', choices: [
        { t: '灌下双倍劣质黑咖啡，硬顶着黑眼圈上工', r: '你的眼窝深陷得像两口枯井，一点点风吹草动都能让你像受惊的野猫一样弓起背脊。', eff: { trait: '神经过敏', money: 8000 } },
        { t: '花两万眼去买镇静剂与隔音耳塞', req: { money: [20000, null] }, r: '白色药片带着一股化学合成的苦味，但至少让你在后巷深宵的刮擦声里重新找回了四五个钟头的沉睡。', eff: { money: -20000, mind: 5 } },
        { t: '拉下脸皮，求相熟的同僚替你顶几天夜班', r: '你欠下了一笔不小的人情，把自己关在拉严窗帘的屋里昏睡了三天三夜，总算把快要崩断的神经拉了回来。', eff: { social: -2, mind: 2 } },
      ] },
    { id: 'pg_handy', age: [18, 75], req: { ...living, job: ['mech', 'doctor'], notrait: '巧手', cnt: { focus_work: [6, null] } }, w: 14, title: '盲拆不出错的十指',
      text: '等你在昏暗的应急灯下把最后一根直径不到半毫米的传动铜丝焊好，才猛然发觉刚才那套原本需要两个人配合的精密工序，自己一个人单手就干完了。\n\n旁边的老师傅摘下护目镜端详了半晌，啧啧称奇地说你这双手总算开窍了。', choices: [
        { t: '趁热打铁，把盲拆与微焊练成肌肉本能', r: '你拿报废的义体核心又反复拆装了上百遍，直到闭着眼睛也能听出齿轮咬合的毫厘误差。', eff: { trait: '巧手', skill: 1 } },
        { t: '把修好的急件交割变现，先改善伙食', r: '你擦净手上的焊锡膏，拿着丰厚的加急手工费去吃了一顿热气腾腾的真肉火锅。', eff: { money: 12000 } },
      ] },
    { id: 'pg_mechanic', age: [20, 80], req: { ...living, job: 'mech', notrait: '精密手感', fn: (S) => S.rulesVersion >= 3 && S.job.years >= 6 }, w: 16, title: '比卡尺更准的指腹',
      text: '你的拇指肚刚在工坊送来的新刀坯上一抹，眉头就皱了起来：“偏了零点三毫米，淬火时肯定要裂。”\n\n新来的学徒半信半疑地拿激光卡尺一量，读数分毫不差。他目瞪口呆地问你是不是在手指里装了扫描义体。', choices: [
        { t: '抓着学徒的手，教他怎么用肉掌摸出金属纹理', r: '学徒磨破了三层指皮才摸出一点门道。你把那套陪伴自己多年的老旧维修工具擦得锃亮，手底下的活计愈发炉火纯青。', eff: { trait: '精密手感', item: 'old_tools', social: 1 } },
        { t: '挂出“大师精修”的招牌，专接高阶收尾人的定制单', r: '你的工时费翻了一倍，送上门来的也全是动辄沾着都市恶疾血液的凶险兵器。', eff: { money: 30000, wit: 2 } },
      ] },
    { id: 'pg_implant_reaction', age: [18, 90], req: { ...living, pros: [2, null], notrait: ['义体亲和', '义体排异'] }, w: 8, title: '发烫渗液的金属接口',
      text: '身上的义体改装超过两处后，你的原生血肉终于开始了反扑。\n\n金属底座与锁骨咬合的地方整夜发烫，渗出带着铁锈味的黄水。黑医翻着你杂乱的改装记录，问你是打一针便宜的免疫抑制剂糊弄过去，还是花大价钱把整套神经底座翻新重接。', choices: [
        { t: '打一万眼的廉价抑制针，拿纱布缠紧了继续干', r: '红肿暂时消了下去，但每隔十天半个月就会卷土重来。你的金属肢体和肉身之间，从此多了一道永远合不拢的排异鸿沟。', eff: { money: -10000, trait: '义体排异' } },
        { t: '狠心掏十五万眼，换装生物相容性镀层底座', req: { money: [150000, null] }, r: '手术刀刮去坏死增生的肉芽，换上了温润的铂金神经桥接器。两次复查过后，接口处终于不再像揣着块烙铁了。', eff: { money: -150000, body: 2 } },
      ] },
    { id: 'pg_implant_care', age: [18, 100], req: { ...living, trait: '义体排异' }, w: 14, title: '根治排异的定制转接环',
      text: '折磨了你许久的义体接口又在阴雨天肿成了紫黑色。\n\n万幸这回工坊刚到了一批同型号的原厂神经缓冲环，技师拍着胸口保证，只要十万眼就能帮你把排异的病根彻底除掉。', choices: [
        { t: '付清十万眼，躺上手术台更换原厂缓冲环', req: { money: [100000, null] }, r: '随着最后一枚微型定位销咔哒落锁，折磨你日夜难安的灼痛感终于如潮水般退去，机械与骨骼重新合二为一。', eff: { money: -100000, untrait: '义体排异' } },
        { t: '囊中羞涩，先开八千眼的消炎药膏顶一阵', r: '冰凉的药膏抹上发烫的金属接缝，勉强换来了这个礼拜的安生。', eff: { money: -8000, body: 2 } },
      ] },
    { id: 'pg_armorer', age: [18, 75], req: { ...living, job: ['fixer', 'syndicate', 'finger', 'kurokumo', 'blade'], money: [80000, null], notitem: 'reinforced_coat' }, w: 10, title: '内衬蛛丝钢板的防具',
      text: '相熟的工坊掌柜从内室拎出一件看似不起眼的深灰长风衣，拔出匕首对着衣摆狠刺了一记——刀尖只留下一点白印。\n\n“八万眼，里层混纺了清道夫甲壳纤维与工坊防刺衬垫，”掌柜实话实说，“挡不住重火器和高阶工坊刀，但足够替你在暗巷冷刀子底下省一条命。”', choices: [
        { t: '爽快付下八万眼，当场披在身上', r: '风衣上身沉甸甸的，领口剪裁却极利落，丝毫不耽误拔刀的动作。', eff: { money: -80000, item: 'reinforced_coat' } },
        { t: '嫌分量压身，留着现金作周转', r: '你掂了掂风衣的份量还是放回了衣架，掌柜也不恼，转手就挂上了高阶收尾人的预订区。', eff: { mind: 1 } },
      ] },
    { id: 'pg_ampule', age: [16, 85], req: { ...living, money: [50000, null] }, w: 8, title: '渠道流出的正牌HP安瓿',
      text: '常去的黑诊所大夫神秘兮兮地拉上百叶窗，从铅封冷藏盒里摸出一支泛着妖异翠绿荧光的玻璃管——那是没兑过一滴水的原装K公司HP安瓿。\n\n“五万眼一支，从巢内急救车上顺出来的保命仙丹，过这村可没这店了。”', choices: [
        { t: '买下一支，塞进贴身防震药囊留着救命', req: { fn: (S) => !S.items.hp_ampule || S.items.hp_ampule.count < 5 }, r: '你小心翼翼地将那抹翠绿锁进内衬暗袋。在刀口舔血的都市里，这就等于随身多揣了半条命。', eff: { money: -50000, item: 'hp_ampule' } },
        { t: '当场扎进胳膊，修复这几年的陈年暗伤', r: '翠绿药液入体的瞬间，全身骨骼噼啪作响，连长年劳损的腰背都变得轻快无比。', eff: { money: -50000, body: 12, mind: 2 } },
        { t: '摇摇头，不花这笔冤枉钱', r: '大夫遗憾地咂咂嘴，把冷藏盒重新锁进了保险柜。', eff: {} },
      ] },
    { id: 'pg_relic_return', age: [25, 85], req: { ...living, item: 'original_tape', trait: '长夜听觉' }, w: 9, title: '旧磁带B面的暗码',
      text: '修古董音响的老匠人把你珍藏多年的那盘管道原声带翻到了B面，用降噪磁头放出了最后三十秒。\n\n刺啦作响的盲音底下，赫然藏着一段当年地下设施换防时的物资坐标口述。闻讯而来的情报贩子当场开出三万眼，要连盒带带子一起买断。', choices: [
        { t: '只卖转录副本，把童年的原带留在身边', r: '贩子骂骂咧咧地砍了一半价钱拿走拷贝。你摩挲着磁带盒上熟悉的磨损痕迹，把原件锁回了抽屉深处。', eff: { money: 12000, wit: 2 } },
        { t: '三万眼一手交钱一手交货，彻底了断旧事', r: '你数清钞票交出原带，从此看谁都觉得像是在打听那段坐标的暗探，夜里睡觉都得多顶一把椅子在门后。', eff: { money: 30000, unitem: 'original_tape', trait: '疑心' } },
      ] },
    { id: 'pg_oath', age: [20, 85], req: { ...living, notrait: '守诺', anyflag: ['lf_trusted', 'lf_doors', 'fx2_mate_trust'] }, w: 12, title: '千金难买的实在名声',
      text: '你去黑市托人打听一桩棘手的门路，原本以为免不了要被中间人扒一层皮，不料对方看清你的脸后，竟直接免去了验资押金：\n\n“几年前那桩天塌下来的烂摊子，你硬是没丢下搭档独自跑路——在这条街上，你的口头准话比白纸黑字好使。”', choices: [
        { t: '立下字据，把这回的权限与风险也敞亮说明', r: '你一如既往地不画大饼、不留暗坑。道上的朋友纷纷传开，说把后背交给你这种人最让人踏实。', eff: { trait: '守诺' } },
        { t: '在商言商，不拿昔日人情抵扣今天的现钱', r: '你坚持按规矩一手交钱一手办差，虽然少了几分江湖热络，却也免去了日后扯不清的人情债。', eff: { money: 10000, social: -1 } },
      ] },
    { id: 'pg_gambling', age: [18, 85], req: { ...living, notrait: '赌瘾', cnt: { gamblingLosses: [3, null] } }, w: 12, title: '指尖挥之不去的筹码声',
      text: '你在账本上把输给J公司赌场的那几笔窟窿反复加减了十来遍，越算心口越像有一团邪火在烧。\n\n偏偏这时，门缝里滑进一张印着烫金轮盘的贵宾体验券，上面用诱人的红字印着：“发薪日之夜，您的好运正在赌桌旁等您领回~”', choices: [
        { t: '把体验券揣进怀里，坚信下一把定能翻盘', r: '还没熬到发薪日，你连端碗喝汤时手指都在桌沿上神经质地敲击押注——J公司的奇点毒钩，已经彻底咬进了你的脑髓。', eff: { trait: '赌瘾' } },
        { t: '把烫金券撕得粉碎，将亏损总额贴在床头警醒', r: '你拿红笔把输掉的血汗钱狠狠圈在墙上，发誓哪怕剁掉手指头，也绝不再给轮盘送一分钱。', eff: { mind: -2, trait: '识账' } },
      ] },
    { id: 'pg_quit_gambling', age: [18, 100], req: { ...living, trait: '赌瘾' }, w: 15, title: '把发薪日的自己锁在屋里',
      text: '又到了月底发饷的日子。街角J公司分号那阵叮当作响的轮盘欢呼声顺着风飘过来，勾得你手心直冒冷汗。\n\n老朋友看出了你的魂不守舍，主动伸手要替你锁起大半工资，陪你熬过最难捱的这三天。', choices: [
        { t: '把钱袋交出去，绑紧双手硬熬过戒断期', r: '你在屋里满头大汗地转了整整两宿，第三天傍晚终于平静地走进面馆，点了一碗踏踏实实的热汤面。', eff: { money: -10000, untrait: '赌瘾', mind: 2 } },
        { t: '推开朋友的手，嘴硬说自己能管住钱袋', r: '你死死攥着钞票走回住处，一整夜都在听窗外虚幻的筹码碰撞声，半点睡意也无。', eff: { mind: -1 } },
      ] },
    { id: 'act_blackmarket', manual: true, title: '地下工坊与黑市专场',
      text: '凭着熟人引路与验资铜牌，你踏进了设在跨区交界防空洞里的地下黑市展销厅。\n\n防弹玻璃柜台后摆着从各大工坊与翼区流出的硬货：从能救命的K公司原装再生安瓿、平息精神躁动的精炼脑啡肽，到价值连城的T公司校准怀表与高阶防弹西装。掌柜戴着白手套，只认现钞不问来历。',
      choices: [
        { t: '购置K公司正牌HP安瓿与脑啡肽安神剂（15万眼）', req: { money: [150000, null] }, eff: { money: -150000, item: ['hp_ampule', 'enkephalin_box'] },
          r: '十五万眼划走，掌柜将一支翠绿的K公司再生安瓿与一盒墨绿的脑啡肽安神剂锁进防震小盒递给你。揣着这两样保命底牌，走夜路都踏实了三分。' },
        { t: '定制高阶工坊防弹西装与武器精修（35万眼）', req: { money: [350000, null], notitem: 'udjat_suit' }, eff: { money: -350000, item: 'udjat_suit', skill: 2 },
          r: '三十五万眼入账！裁缝出身的老工坊技师当场替你量体改衬，换上这身内嵌奇点防刺纤维的笔挺西装，顺手将你的随身兵刃校准了重心。' },
        { t: '拍下T公司校准怀表（60万眼）', req: { money: [600000, null], notitem: 't_pocket_watch' }, eff: { money: -600000, item: 't_pocket_watch', wit: 2 },
          r: '六十万眼巨款拍在桌上！当你将那枚沉甸甸的T公司黄铜怀表贴身收好时，周围嘈杂的脚步声在耳中仿佛都清晰慢放了半拍。' },
        { t: '只花五万眼打点情报贩子，抹除近期黑账追踪', req: { money: [50000, null] }, eff: { money: -50000, social: 3, mind: 3, dist: -5 },
          r: '你花五万眼请Seven协会外围的熟手替你洗净了近一年的行踪底档，顺带拿到了几条最新的街区避险风声。' },
      ] },
    // ---------- 打破按部就班的都市随机风浪（规则8新增） ----------
    { id: 'pg_shake_syndicate', age: [20, 58], req: { ...living, loc: 'backstreet', job: ['labor', 'shop', 'chef', 'mech', 'doctor'], fn: S => S.rulesVersion >= 8 }, w: 18, title: '血洗整条街的火并夜', star: true,
      text: '你按部就班上下工的这条熟街，在一夜之间换了天——两伙争夺辖区的后巷帮派把战场直接烧到了你干活的铺子门口！\n\n当你在硝烟与血泊中撬开变形的卷帘门时，原本的管事已经倒在血泊里没了声息。幸存的几个伙计六神无主地围着你，而踩着尸体走来的帮派刀手正提着滴血的砍刀，冷冷问你这间铺子往后跟谁姓。',
      choices: [
        { t: '接过染血的钥匙，带头盘下铺子当掌柜', check: { s: ['wit', 'social'], dc: 46 },
          ok: { r: '你压下狂跳的心脏，当场与帮派新头目立下三七分账的字据，正式坐上了掌柜交椅！从今天起，你不再是替人卖命的学徒杂役了。', eff: { job: { promote: 1 }, money: 25000, fame: 3, mind: -2 } },
          no: { r: '新头目嫌你资历太浅镇不住场子，一脚踹翻了账桌，勒令你交出两万眼保命钱才放你离开。', eff: { money: -20000, mind: -3, dist: 3 } } },
        { t: '捡起地上死人留下的工坊短刃，转身去考收尾人或投黑道', eff: { skill: 5, flag: ['fixer_dream', 'gang_contact'], dist: 2, item: 'borrowed_blade' },
          r: '看着像蚂蚁一样被人轻易碾死的管事，你彻底明白在这座都市里老实本分只会沦为刀下鱼肉。你将那把染血的制式短刃插进腰间，眼神彻底冷了下来。' },
        { t: '趁夜收拾细软搬去别的街区，避开是非旋涡', eff: { money: -10000, mind: 2, fn: S => { S.d = (S.d % 25) + 1; S.home = S.d + '区后巷'; } },
          r: '你没有贪恋那点微薄的工钱，连夜搭上跨区货运板车换了落脚点。身后那条街的火光映红了半边夜空。' },
      ] },
    { id: 'pg_shake_nest', age: [22, 58], req: { ...living, loc: 'nest', job: ['clerk', 'research'], fn: S => S.rulesVersion >= 8 }, w: 18, title: '突如其来的部门清洗', star: true,
      text: '早会铃响起的那一刻，整层写字楼的电梯被内卫队全部锁死！公司高层的一场专利倾轧波及了你们整个外包事业部，昨天的直属上司今天已经被装进了概念焚化炉的废料袋。\n\n审查官将一份紧急破格提拔书与一份高危封口调令并排拍在你面前——按部就班混日子的温床彻底碎了，你必须在十秒内做出抉择。',
      choices: [
        { t: '抓住权力真空，签下军令状接管核心业务组', check: { s: ['wit', 'social'], dc: 52 },
          ok: { r: '你顶着全层楼瘫软同事的目光，面不改色地签字接过了部门权限密钥！薪水与职级连跳两格，你也正式踏入了翼与巢吃人不吐骨头的权力牌局。', eff: { job: { promote: 1 }, money: 50000, fame: 4, mind: -3 } },
          no: { r: '你在内卫队的测谎仪前露了怯，虽然保住了眼下的饭碗，却被罚没了本季度的全部绩效，心底深处多了一道挥之不去的阴影。', eff: { money: -25000, mind: -4, dist: 4 } } },
        { t: '趁乱卷走一份未加密的地下渠道名录，辞职单干', eff: { job: { id: 'none' }, money: 80000, wit: 3, flag: ['fixer_dream', 'wing_contact'], dist: 2 },
          r: '你看透了在格子间里给人当替罪羊的宿命，暗中拷走一份价值八万眼的灰色渠道名单后当场递交辞呈。走出写字楼大门的那一刻，整座都市的风浪向你迎面扑来！' },
      ] },
    { id: 'pg_shake_anomaly', age: [18, 65], req: { ...living, era: 'dist', noflag: 'ego', fn: S => S.rulesVersion >= 8 }, w: 16, title: '被扭曲领域吞没的归途', star: true,
      text: '下工回家的必经之路，今晚突然被一片浓稠如墨的诡异迷雾吞没——街角那家开了十年的钟表铺彻底化作了一尊滴答作响的血肉齿轮怪胎！\n\n周围的路人尖叫着四散奔逃，而你却在震耳欲聋的钟摆声里，听见自己胸腔深处传来了一阵前所未有的强烈共鸣。',
      choices: [
        { t: '逆着人流拔刃上前，从怪物爪下抢救被困街坊', check: { s: ['skill', 'mind'], dc: 50 },
          ok: { r: '你在扭曲领域的狂暴压迫下硬生生劈开一条血路，将两名被齿轮咬住衣角的街坊拖出了迷雾！赶来接管的收尾人科长对你的胆魄大为震惊，当场向你抛出了橄榄枝与丰厚赏金。', eff: { money: 40000, skill: 3, fame: 4, dist: 4, flag: 'fixer_dream' } },
          no: { r: '怪物的钟摆余波狠狠扫中你的胸口！你在剧痛与耳鸣中跌出迷雾边界，脑海里那个温柔而危险的低语声却比以往任何时候都更加清晰。', eff: { body: -8, mind: -4, dist: 9 } } },
        { t: '驻足凝视迷雾核心，倾听心底翻涌的渴望', eff: { dist: 10, wit: 2, mind: -2 },
          r: '你没有逃跑，而是站在警戒线边缘静静注视着那尊由执念化作的庞然大物。你清晰地感觉到，自己心底某把锁住多年的枷锁正在咔嚓松动。' },
        { t: '咬紧牙关捂住双耳，从侧街排水巷迅速撤离', eff: { mind: 2, body: -1 },
          r: '你强迫自己移开视线，绕了整整三条街才回到住处。虽然避开了直接的污染，但你知道平静的日常已经一去不复返了。' },
      ] },
  ]);
})();
