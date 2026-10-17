/* 手指内部（批次 5）：拇指的账与军阶礼仪、食指的指令与字面，两个故事包 + 16 个事件 + 4 个跨年后续。
 * 写法见 docs/STYLE_REFERENCE.md，术语见 docs/CONTENT_GUIDE.md。
 * 跨年回响：fg_thumb_receipt / fg_thumb_promised / fg_index_spare / fg_index_ink。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const d = (S, id) => (C.storyData(S, id) || { data: {} }).data;
  const FINGER = (finger) => ({ job: 'finger', fn: (S) => S.vars.finger === finger });

  // ============ 故事包 1：拇指的账与军阶（thumb） ============
  p({ id: 'thumb_debt', pack: 'B5', title: '替上级背的账', route: 'thumb', person: 'thumb_captain_mao', theme: '人情', age: [20, 55], sources: ['S21'] }, [
    ['经手人那一栏',
      '据点后间只点了一盏灯。\n\n指挥官把账簿推到灯下，翻到折了角的那一页。\n\n“这一笔今天不平。”他说，“要么你在这栏签字，要么他按规矩办。”\n\n笔只有半截，笔尖朝着你。',
      [
        o('在经手人一栏签自己的名字', '你写下名字，把三千眼数在桌上。\n\n他把钱收进抽屉，在那一行旁边添了一个字：转。\n\n“从今天起，他欠的是你。”', { claim: 'signed' }, { money: -3000, mind: -1, flag: 'carried_soldier_debt' }, { trust: 1, goto: 2 }),
        c('问这一笔是怎么欠下的', 'social', 45,
          o('他说是替班里垫的修枪钱', '“枪是班里的，字是他签的。”他说完，把那个人的号码报给你。\n\n你记在手心，又在巷口买了两包烟，托人去问那一班的人。\n\n烟钱比这件事该花的还多。', { claim: 'asked', origin: 'gun' }, { money: -800, wit: 2, flag: 'saw_debt_origin' }, { trust: 1 }),
          o('他说是欠了赌账', '你后来才知道赌账是编的。为了核这句话，你请那一班的人喝了一轮，花掉九百眼。\n\n真的那笔还压在账簿底下。\n\n灯芯短了一截，他没有再翻页。', { claim: 'asked', origin: 'lie' }, { money: -900, mind: -2, flag: 'told_wrong_origin' }, { trust: -1 })),
        o('把账簿合上，说按规矩办', '你退开半步，站到该站的位置。\n\n刀是那人自己带来的，垫在桌沿上。\n\n切下来的那一节被收进一只信封，和账簿一起锁进抽屉。', { claim: 'rule' }, { mind: -3, merit: 1, flag: 'let_finger_be_taken' }, { trust: 1, goto: 3 }),
      ]],
    ['修枪钱',
      '欠账的人在后间门口等你，工装袖口还沾着枪油。\n\n他说那把枪坏在别人手上，签字的是他。\n\n“我不是不还。”他说，“下个月轮值排满，能还上。”\n\n指挥官在里面翻账簿，门没有关。',
      [
        o('掏出三千眼替他把账平了', '你把钱数在柜台上，让管账的人在那一行写了一个“清”字。\n\n管账的人写完，抬头看了你一眼，把笔尖在纸上按了一下才收回去。\n\n他站在门口，没有说谢谢。', { paid: 'own' }, { money: -3000, mind: 2, flag: 'paid_soldier_debt' }, { trust: 1 }),
        o('让他把欠条改成你的名字', '他自己在欠条背面写下你的名字，写完吹了吹墨。\n\n你又数出两千眼给他，让他先去把袖口那件工装换掉。\n\n“这样我欠的是你。”他说。\n\n里面的翻页声停了一下。', { paid: 'note' }, { money: -2000, mind: 1, flag: ['carried_soldier_debt', 'soldier_owes_you'] }, { trust: -1 }),
        c('去工坊核对那张修枪的单子', 'wit', 48,
          o('底单上签的是另一个班的人', '抄单收了你四百眼。\n\n你把单号交给管账的人，那一行被划到了别人的页上。\n\n欠账的人跟在你后面，一直走到巷口才说了句什么，风把话吹散了。', { checked: true }, { money: -400, wit: 2, flag: 'found_real_signer' }, { trust: 1 }),
          o('工坊说底单早被收走了', '你付了四百眼，只拿到一张空白的抄件。\n\n工坊的人把你送到门口，说这种事以后别来问第二遍。\n\n账簿上那一行还在原处，折角更深了一点。', { checked: false }, { money: -400, mind: -2, flag: 'voucher_gone' }, { trust: -1 })),
      ]],
    ['开饭',
      S => {
        const claim = d(S, 'thumb_debt').claim;
        const row = claim === 'signed' ? '账簿上那一行现在写着你的名字，墨还没有干透。'
          : claim === 'rule' ? '账簿上那一行已经划掉，划得很重，透了纸背。'
            : S.flags.paid_soldier_debt ? '账簿上那一行写了“清”，字是管账的人代写的。'
              : S.flags.found_real_signer ? '账簿上那一行被划到了另一个班的页上。'
                : S.flags.soldier_owes_you ? '账簿上那一行换成了欠条，欠条在你口袋里。'
                  : '账簿上那一行还空着，折角朝上。';
        return '二老板来吃饭那天，后间换了新桌布。\n\n' + row + '\n\n指挥官在门口小声交代：他坐下之前，谁都不许动筷。\n\n你的位置在第三张桌最外面，碗沿有个缺口。';
      },
      [
        o('照交代的说：已清', '你说了那两个字，声音不高，刚好够桌上的人听见。\n\n二老板点了一下头，把筷子拿起来。\n\n散席时指挥官在你肩上按了一下，按得很短。', { reported: 'clear' }, { merit: 1, mind: -2, flag: 'reported_ledger_clear' }, { trust: 1 }),
        o('把账簿推过去，让他自己看', '二老板翻了两页，翻到折角那里停住。\n\n他把账簿合上，放在桌子正中间，没有说清还是不清。\n\n散席的账后来从你的份额里扣了三千眼。', { reported: 'open' }, { money: -3000, wit: 2, mind: -1, flag: 'showed_ledger_to_boss' }, { trust: -1 }),
        c('等二老板问起才答', 'mind', 48,
          o('他一直没问', '饭吃到一半，他把筷子放在碗沿上，说了句“这一页不错”。\n\n没有人接话。\n\n散席以后，指挥官多看了你一眼。', { reported: 'waited' }, { merit: 2, mind: 1, flag: 'silent_at_table' }, { trust: 1 }),
          o('他问的时候你嘴里还有饭', '你答得慢了半句。\n\n指挥官替你把话补完，补的是他的说法。\n\n二老板听完就笑了，桌上的人跟着笑，你也在里面。\n\n月底盘账，你少了九百眼。', { reported: 'late' }, { money: -900, mind: -2, flag: 'answered_by_captain' }, { trust: -1 })),
      ]],
    ['四千眼',
      '后间的灯还亮着，桌上摆着一把刀。\n\n又一个欠账的人站在桌前，欠四千眼，利滚了两个月。\n\n按规矩，这一根手指今天留下。\n\n指挥官把椅子往后挪了挪，给你让出说话的位置。',
      [
        o('替他把四千眼数出来', '你把钱推过桌面，推到账簿旁边。\n\n那人看着钱，没有伸手。\n\n指挥官把刀收回鞘里，说了句“下次早点”。\n\n他走出去的时候，腿是软的。', { second: 'paid' }, { money: -4000, mind: 1, flag: 'paid_second_debt' }, { trust: 1 }),
        c('请指挥官宽他到下一个轮值', 'social', 50,
          o('他答应宽一个轮值', '“一个轮值。”他说，“再不平，就不是手指了。”\n\n那人把刀收回鞘里，手一直在抖。\n\n你替他在账簿边上写了一个日子。', { second: 'extension' }, { wit: 1, merit: 1, flag: 'got_extension_for_debtor' }, { trust: 1 }),
          o('你替他求，就是替他担', '他把账簿推到你面前，笔也推过来。\n\n你签了，四千眼记在你的名下。\n\n那人低头看着桌沿，一直没有看你。', { second: 'rebound' }, { money: -4000, mind: -2, flag: 'plea_rebound' }, { trust: -1 })),
        o('把刀转过来，柄朝他', '刀柄碰到他的手，他握了两次才握稳。\n\n你站到该站的位置，看着桌面上那一小块空出来的地方。\n\n信封是早就备好的。', { second: 'watched' }, { merit: 2, mind: -3, flag: 'watched_finger_taken' }, { trust: 1 }),
      ]],
    ['轮值表',
      S => '下一轮的表贴在门后，你的名字在第一个。\n\n'
        + (d(S, 'thumb_debt').claim === 'rule' ? '表上有一个名字被划掉了，划痕是新的。\n\n' : '那个欠账的人还站在原来的位置上，袖口的枪油没有洗净。\n\n')
        + '指挥官用铅笔在你名字旁边画了个小圈：“第一个站前面的，不多话。”',
      [
        o('接下第一个位置', '你把表上的名字看了一遍，记下每一班换岗的时辰。\n\n那一轮你的份额比别人多一叠。\n\n巷子最里面那段没有灯。', { roster: 'first' }, { money: 8000, merit: 1, flag: 'took_first_slot' }, { trust: 1 }),
        c('请他把你挪到后面', 'social', 47,
          o('他把你挪到第四位', '你拿三千眼跟第四位的人换了位置，换得很安静。\n\n铅笔印擦得很淡，还看得见。\n\n那一晚你多睡了两个钟头。', { roster: 'fourth' }, { money: -3000, body: 2, flag: 'moved_down_roster' }, { trust: 1 }),
          o('表已经贴了', '他把铅笔收进胸袋，没有再说话。\n\n第二天你站在第一个，前面的巷子比平时黑。\n\n那一轮你的份额多两千眼。', { roster: 'first' }, { money: 2000, body: -3, mind: -2, flag: 'stood_first_anyway' }, { trust: -1 })),
        o('把表上被划掉的名字抄进本子', '你抄得很慢，连划痕的方向都照着画。\n\n指挥官看见了，没有问。\n\n本子塞回内袋的时候，纸边硌了一下肋骨。', { roster: 'copied' }, { wit: 1, money: 2000, flag: 'copied_struck_name' }, { trust: -1 }),
      ]],
    ['经手人后来',
      '后来你还能认出那本账簿的纸味。\n\n据点换了两个后间，管账的人也换过。\n\n你始终只叫他指挥官，从来没有问过名字。\n\n新本子的第一页总是空着，等第一个签字的人。',
      [
        o('把自己的名字写上去', '你在这本账簿上留下的字，比你领过的钱多。\n\n后来有人在那一页又添了一笔，用的也是你的笔迹。', null, { money: 12000, merit: 1, flag: 'thumb_debt_closed_own' }, { trust: 1, end: '你替人在拇指的账簿上背过账，那一页留着你的名字。' }),
        o('把笔放下，让那一页空着', '你学会了什么时候把笔放下。\n\n账簿换了新的一本，第一页空着，笔横在旁边。\n\n有人来问你签不签，你说等一下。', null, { money: 6000, mind: 1, flag: 'thumb_debt_left_blank' }, { trust: -1, end: '你在拇指学会了规矩，也学会了不把名字写在经手人那一栏。' }),
        o('把折角的那一页撕下来', '折角的那一页被你撕下来，折成很小一块，塞进内袋。\n\n它比一张钞票厚不了多少。\n\n后间的灯在身后灭了一盏。', null, { money: -1000, wit: 1, flag: 'thumb_debt_folded_page' }, { trust: -2, end: '你把拇指账簿上折角的那一页撕下来，一直带在身上。' }),
      ]],
  ]);

  // ============ 故事包 2：食指的指令与字面（index） ============
  p({ id: 'index_prescript', pack: 'B5', title: '折进去的半句', route: 'index', person: 'index_proxy_lin', theme: '规矩', age: [20, 60], sources: ['S22'] }, [
    ['折成四折的纸',
      S => NM(S, 'index_proxy_lin') + '在雨棚下等你，纸上还带着她袖口的潮气。\n\n指令折成四折：正午以前，把四十三号仓的门从外面锁上。\n\n“念三遍。”她说，“别问。”\n\n雨从棚沿滴下来，落在纸角上，晕开一小块。',
      [
        o('照字面去锁门', '你借来一把新锁，把门从外面扣上。\n\n门里响了两下，像有人用工具敲铁皮。\n\n回去时她只问了一句：锁上了没有。', { act: 'locked' }, { money: 6000, mind: -2, flag: 'locked_warehouse' }, { trust: 1, goto: 2 }),
        o('先到仓门口看一眼', '铁皮门只扣着一根铁丝。\n\n你在巷口花六百眼买了两只热的，推门进去。\n\n里面的人停下手里的活，没有人问你是谁。', { act: 'looked' }, { money: -600, mind: 1, flag: 'looked_in_warehouse' }, { trust: -1 }),
        o('买半支铅笔，把纸抄一遍', '你在巷口花两百眼买了半支铅笔和一张糙纸。\n\n抄到“锁上”两个字时，笔尖断了。\n\n你把抄件折好，和原纸分开放在两个口袋里。', { act: 'copied' }, { money: -200, wit: 1, flag: 'copied_prescript' }, { trust: -1 }),
      ]],
    ['仓里有人',
      '里面八个人在分拣旧螺栓，按长短码成三堆。\n\n墙角有个孩子躺在麻袋上，额上搭着一块湿布。\n\n有人把最里面那扇小门往身后挡了挡。\n\n挂钟指着十一点，门要在正午前锁上。',
      [
        o('叫他们先出来，再把门锁上', '八个人抱着东西出去，你把孩子背到巷口诊所。\n\n挂号花了一千二百眼。\n\n回来时门已经锁上，锁是你自己买的。', { act: 'warned' }, { money: -1200, mind: 2, flag: 'warned_warehouse_workers' }, { trust: -1, goto: 3 }),
        o('只锁外门，把侧门的插销拔掉', '外门照锁，侧门的插销你拔了半截，留出一条能过的缝。\n\n走的时候你听见里面有人挪动了那扇门。\n\n正午的钟响了两下。', { act: 'gap' }, { money: 6000, mind: -1, flag: 'left_side_door_open' }, { trust: 1 }),
        o('什么也不说，把门扣上', '你从外面扣上门，铁丝缠了两圈。\n\n第一下敲击在你转身以后。\n\n回去的路上你没有回头，鞋底沾了一层铁锈。', { act: 'locked' }, { money: 6000, mind: -3, flag: 'locked_warehouse' }, { trust: 1, goto: 4 }),
      ]],
    ['折痕上的半句',
      '回到据点，你把纸摊在灯下。\n\n折痕正好压着一行小字：直到里面的人数清点完毕。\n\n前一句是锁门，后一句是清点。\n\n纸上没有写谁来数，也没有写数完以后门要不要开。',
      [
        c('对着折痕把整段读出来', 'wit', 46,
          o('折痕下面还有一句', S => '你花五百眼从管账的人那里抄了仓里的旧账簿：八个在册。\n\n'
            + (S.flags.looked_in_warehouse ? '你数过里面，连墙角那个发烧的孩子，一共九个。' : '账簿上没有第九个名字，纸上也没有写谁该留下。')
            + '\n\n你把纸折回四折，折痕比原来深。', { read: 'full' }, { money: -500, wit: 2, flag: 'read_second_half' }, { trust: 1 }),
          o('只认出“完毕”两个字', '前后的笔画都被纸吃掉了。\n\n你把纸举高一点，灯影把折痕又压深了一层。\n\n灯油耗了一格。', { read: 'half' }, { money: -500, mind: -2, flag: 'half_read_prescript' }, { trust: -1 })),
        o('收工以后去问她另一半在哪', '你在巷口买了两只热的，等她下班。\n\n她接过一只，没有吃。\n\n“纸只有一张。”她说，“折进去的部分，不归我念。”', { read: 'asked' }, { money: -600, social: 1, flag: 'asked_for_other_half' }, { trust: 1 }),
        o('按自己的理解办，把纸收进本子', '你把纸折回四折，收进本子最里面。\n\n正午的钟敲过，你按自己理解的那一句把事办了。\n\n没有人来问你是怎么理解的。', { read: 'improvised' }, { money: 6000, mind: -2, flag: 'improvised_prescript' }, { trust: -1, goto: 4 }),
      ]],
    ['来核对的代行者',
      '正午差一刻，一个代行者来了，手里夹着一块夹板。\n\n“四十三号仓。”他对着手里的编号，“锁了没有？”\n\n夹板上那一行后面空着，等你一句话填。\n\n仓门在两条巷子外，钟楼正走最后一格。',
      [
        o('答：锁了', '他写下两个字，把夹板合上。\n\n“下一班来开。”\n\n他往仓门的方向走，你跟在后面，听见他皮鞋压过铁屑的声音。', { reported: 'yes' }, { money: 6000, merit: 1, flag: 'reported_locked' }, { trust: 1 }),
        o('答：里面还有人', '他抬眼看了你一下，把夹板翻到背面，用另一支笔写。\n\n“这一条要重跑。”\n\n他从你的份额里扣了两千眼，扣得很清楚。', { reported: 'no' }, { money: -2000, mind: 1, flag: 'reported_people_inside' }, { trust: -1 }),
        c('把纸背的半句指给他看', 'wit', 50,
          o('他改了那一行', '他对着灯看了很久，把夹板上那一行划掉，改成“待清点”。\n\n“这一句，传令员没有交上来。”\n\n仓门的事，他交给了下一班。', { reported: 'line' }, { money: 3000, wit: 2, flag: 'showed_folded_line' }, { trust: 1 }),
          o('他说只登记锁没锁', '“字面上的事，我管。字面以外，你管。”\n\n他在空白处等你签名，签完才走。\n\n那一行最后还是填了两个字。', { reported: 'blank' }, { money: -1000, mind: -2, flag: 'only_lock_counted' }, { trust: -1 })),
      ]],
    ['她鞋上的泥',
      S => '散班的时候，' + NM(S, 'index_proxy_lin') + '从后门进来，鞋上全是泥。\n\n她被扣了两千眼，这一条要重跑一遍。\n\n“这一次，”她把新的一张纸放在你手里，“你去锁门，我留下数人。”\n\n纸还是四折，边角比上一张旧。',
      [
        o('接过纸，替她跑这一趟', '你把两千眼推到她手边，纸揣进内袋。\n\n“数清楚。”你说。\n\n她数了两遍，第二遍数到一半就停了。', { final: 'ran' }, { money: -2000, body: -1, flag: 'ran_prescript_for_proxy' }, { trust: 1 }),
        o('把纸推回去，让她自己跑', '她把纸收回去，折好，放进袖子里。\n\n第二天她的位置空着。班里把她的份额按人头分了，你那份多了一千五百眼。', { final: 'refused' }, { money: 1500, mind: -2, flag: 'refused_proxy_run' }, { trust: -1 }),
        c('先问清这一条是谁写的', 'social', 52,
          o('折角上有半个指印', '“写的人不署名。谁折的谁送。”\n\n你把纸对着灯看：折角上的指印比她的手指小一圈。\n\n你给管灯油的多留了四百眼，这事没有说给第三个人。', { final: 'thumbprint' }, { money: -400, wit: 2, flag: 'found_folded_thumbprint' }, { trust: 1 }),
          o('她说问了也没用', '她把纸收回去，压在桌上抹平。\n\n“问了也没用。”\n\n她走的时候，鞋上的泥在门槛上留了两个印，第二天还在。', { final: 'refused_ask' }, { merit: -1, mind: -2, flag: 'question_refused_at_door' }, { trust: -1 })),
      ]],
    ['纸的另一半',
      '指令还会来。\n\n折成三折的、四折的、边角磨旧的，落在同一个雨棚下。\n\n你开始先看折角，再看正面的字。',
      [
        o('把两张都留着，等下一次核对', '你把锁门的那张和清点的那张夹在同一页里。\n\n来人核对时，两句话一起摊开。\n\n他看完，把其中一句抄走了，抄得很仔细。', null, { money: 4000, wit: 1, flag: 'kept_both_prescripts' }, { trust: 1, end: '你在食指留下了两张互相补足的指令，字面终于凑成一句完整的话。' }),
        o('只读摊平的那一面', '以后每一张纸，你都只读正面摊开的那一句。\n\n折进去的部分被你当成没有写过。\n\n她送纸来的时候，不再多看你。', null, { money: 9000, mind: -2, flag: 'read_only_flat_side' }, { trust: -1, end: '你只执行食指纸面上摊开的那一句，折进去的部分当作不存在。' }),
        o('把读折痕的办法教给下一个人', '你教新来的人先把纸对着灯，再看折角。\n\n“字面以外的事，”你说，“得自己担。”\n\n她站在门边看完，把下一张纸折好递给那人。', null, { money: -1000, social: 2, flag: 'taught_fold_reading' }, { trust: 1, end: '你把读折痕的办法教给了下一个替食指跑腿的人。' }),
      ]],
  ]);

  // ============ 16 个事件：6 个只有正文、6 个带选项、4 个跨年回响 ============
  C.addEvents('fingers2', [
    // —— 6 个无选项 ——
    { id: 'fg_thumb_boots', age: [18, 75], req: FINGER('thumb'), w: 10, repeat: true, cd: 10,
      text: '据点门口的靴子排成一行，鞋跟朝外。\n\n新来的人蹲着擦，擦到第三双才被告知：鞋跟朝里，表示人还在后间。\n\n那天有一双是朝里的，擦得比别的都亮。' },
    { id: 'fg_thumb_soup', age: [18, 75], req: FINGER('thumb'), w: 9, repeat: true, cd: 9,
      text: '后间的汤锅只放一次盐。\n\n二老板的碗先盛，碗沿有个缺口，管家每次都把缺口转到不朝他的一面。\n\n轮到你盛的时候，锅底只剩一层。' },
    { id: 'fg_thumb_gloves', age: [18, 75], req: FINGER('thumb'), w: 9, repeat: true, cd: 11,
      text: '白手套洗到发灰，还是要洗。\n\n洗的人在开饭前把它们一双双挂回门后的钉子上，指头朝下。\n\n有一双少了一个指套，一直挂在最里面。' },
    { id: 'fg_index_fold', age: [18, 75], req: FINGER('index'), w: 10, repeat: true, cd: 10,
      text: '指令纸的折法是规矩的一部分。\n\n三折是自己去办，四折是转给别人。\n\n你把一张纸折成了五折，传令员没有拆开，直接把它放进了炉子。' },
    { id: 'fg_index_clock', age: [18, 75], req: FINGER('index'), w: 9, repeat: true, cd: 9,
      text: '据点墙上的钟比外面的慢四分钟。\n\n没有人去调。\n\n等指令的人在钟底下站成一排，到点的时候，最先动的总是最外面那一个。' },
    { id: 'fg_index_wall', age: [18, 75], req: FINGER('index'), w: 8, repeat: true, cd: 12,
      text: '等指令的人在同一个墙根站着，站到第三年，墙上磨出一排鞋底的纹。\n\n新来的人问那是什么。\n\n没有人回答，他自己站到了最后一个位置上。' },

    // —— 6 个带选项（每个都含判定）——
    { id: 'fg_thumb_ledger_rows', age: [18, 75], req: FINGER('thumb'), w: 10, title: '抄错的一行',
      text: '指挥官让你把旧账簿抄到新本子上，抄完他再看。\n\n抄到第九行，数目比旧本子多了四千眼。\n\n旧本子上那一行被人用刀刮过，刮痕下面还看得见原来的笔画。',
      choices: [
        { t: '照抄，一个字不改', r: '你把四千眼照抄上去。\n\n他看完，在末尾签了字。\n\n旧账本被扔进炉子，纸边先卷起来。\n\n这一趟的工钱三千眼，当天就结了。', eff: { money: 3000, mind: -2, flag: 'copied_ledger_as_is' } },
        { t: '把那一行空着交上去', r: '你在第九行留了一道白，交上去。\n\n他没有问，只在空白旁边画了个圈。\n\n那一圈的墨很浓。\n\n买灯油的一千眼，是你自己掏的。', eff: { money: -1000, mind: 1, flag: 'left_row_blank' } },
        { t: '告诉他刮痕下面有字', check: { s: 'social', dc: 46 },
          ok: { r: '他把旧本子对着灯看了一会儿。\n\n“烧了。”他说。\n\n新本子上那一行，按刮痕底下的数目写。\n\n他额外给了你一千眼。', eff: { wit: 2, money: 1000, flag: 'checked_scrape' } },
          no: { r: '“旧本子已经废了。”\n\n他把新本子合上，让你抄第二遍，从头开始。\n\n那一夜你没有领到灯油，自己花六百眼买了一盏。', eff: { money: -600, mind: -2 } } },
      ] },
    { id: 'fg_thumb_kneel', age: [18, 75], req: FINGER('thumb'), w: 9, title: '跪在门口的人',
      text: '一个士兵在据点门口跪了半个钟头。\n\n他在二老板进门之前先开了口，按规矩要跪到下一班换岗。\n\n雨不大，他的制服肩头已经湿透。\n\n路过的人都不看他。',
      choices: [
        { t: '撑伞站到他旁边', r: '你把伞举过他的头顶，自己也淋湿了半边。\n\n换岗的人来了，看了一眼，没有多说。\n\n后来那把伞的柄一直有点弯。', eff: { body: -2, mind: 2, flag: 'stood_with_kneeling_soldier' } },
        { t: '去后间替他说一句', check: { s: 'social', dc: 48 },
          ok: { r: '指挥官听完，让人提前叫他起来。\n\n他起的时候腿是麻的，扶着门框站了一会儿才走。\n\n伞还在你手里。', eff: { social: 1, mind: 2, flag: 'asked_mercy_for_kneel' } },
          no: { r: '“他跪的是规矩，不是你的面子。”\n\n你回到门口，雨还在下。\n\n他又多跪了一刻钟。', eff: { social: -1, mind: -2 } } },
        { t: '从后门进去，不看', r: '后门通向厨房，你在门里闻到汤的味道。\n\n开饭的时候，门口那一块地已经干了。\n\n没有人提起他。', eff: { mind: -1 } },
      ] },
    { id: 'fg_thumb_package', age: [18, 75], req: FINGER('thumb'), w: 9, title: '渗水的纸包',
      text: '指挥官递给你一个纸包，让你送到斜街第三扇门。\n\n“不许拆，不许在路上停。”\n\n纸包底下渗出一小片暗色，沾在你手上，洗了两遍还留着。\n\n斜街那边正在查通行。',
      choices: [
        { t: '照送，路上不停', r: '你把纸包塞进外套，从查通行的人背后绕了过去。\n\n第三扇门开了半扇，接东西的人只伸出一只手。\n\n那只手上有油。\n\n他递出六张票子，数得很快。', eff: { money: 6000, mind: -2, flag: 'delivered_wet_package' } },
        { t: '拆开看一眼', check: { s: 'wit', dc: 42 },
          ok: { r: '里面是两截用油纸包着的枪管，还热。\n\n你照原样包回去，送到时迟了十分钟。\n\n接东西的人什么也没说，钱照付，扣了两千。', eff: { wit: 2, money: 4000, mind: -2, flag: 'saw_wet_package' } },
          no: { r: '纸一撕就破了。\n\n暗色的水顺着指缝流下来。\n\n你把它重新裹紧，送到的时候手上全是铁锈味。\n\n他嫌晚，只给了两千。', eff: { money: 2000, mind: -3, flag: 'tore_wet_package' } } },
        { t: '丢进排水沟，回去说送到了', r: '纸包沉下去，水面上浮起一层油。\n\n你回去复命，他看了你一眼，说：好。\n\n三天后有人来问斜街第三扇门的事。\n\n这一趟的钱照给，三千眼。', eff: { money: 3000, mind: -3, dist: 2, flag: 'dumped_package' } },
      ] },
    { id: 'fg_index_two_orders', age: [18, 75], req: FINGER('index'), w: 10, title: '一锁一开',
      text: '同一天送来两张纸。\n\n一张要你把修配所的门在黄昏前锁上，一张要在黄昏前把那扇门打开。\n\n两张的折法一样，折角上的指印也一样。\n\n修配所的人还在里面换零件。',
      choices: [
        { t: '按先送到的去锁', r: '你按先到的那张办了。\n\n修配所的人被关到天黑，隔着门骂了很久。\n\n第二张纸你没有再拿出来。\n\n这一条的份额四千眼，照发。', eff: { money: 4000, mind: -2, flag: 'obeyed_first_order' } },
        { t: '按后送到的去开', r: '门开了，里面的人出来时还在骂。\n\n你把两张纸一起折好，收进内袋。\n\n下一次送纸来的换了面孔。\n\n份额两千眼，照发。', eff: { money: 2000, mind: 1, flag: 'obeyed_second_order' } },
        { t: '拿两张纸去问她', check: { s: 'social', dc: 50 },
          ok: { r: '她把两张摊平，比了比纸边。\n\n“一张是补的。”她把补的那张撕成两半。\n\n修配所的门那天没有锁。\n\n这一条只算半份，三千眼。', eff: { wit: 2, money: 3000, flag: 'asked_about_two_orders' } },
          no: { r: '“你只管办。”\n\n她把两张都收走了，一张也没给你留。\n\n修配所的门那天没有锁，也没有人问为什么。\n\n按半份算，一千眼。', eff: { money: 1000, mind: -2, flag: 'orders_taken_away' } } },
      ] },
    { id: 'fg_index_envelope', age: [18, 75], req: FINGER('index'), w: 9, title: '信封上的旧名字',
      text: '指令要你把一封信送到七号院。\n\n信封上的名字被涂掉过一层，新写的字压在旧笔画上，露着半个“周”。\n\n七号院住着两户人。\n\n两扇门都开着一条缝。',
      choices: [
        { t: '按新名字送', r: '开门的人接过信，看了一眼信封，把它压在鞋柜上。\n\n“早改了。”他说。\n\n门关到一半，里面传来撕纸的声音。\n\n跑腿钱五千眼，当场结清。', eff: { money: 5000, mind: -1, flag: 'delivered_new_name' } },
        { t: '按旧名字送', r: '隔壁的老人接过信，手在信封上摸了很久。\n\n“这名字，五年没人叫了。”\n\n他把信放在桌上，没有拆。\n\n他只给了两千眼，说信旧了。', eff: { money: 2000, mind: 2, flag: 'delivered_old_name' } },
        { t: '两户都不送，回去问', check: { s: 'wit', dc: 44 },
          ok: { r: '她翻开登记簿，指着那一行：改过三次。\n\n“送最后一次的。”\n\n你回去，把信给了院子最里面那家。\n\n这一趟的跑腿钱多算了一份。', eff: { wit: 2, money: 6000, flag: 'asked_which_name' } },
          no: { r: '登记簿上那一行被墨水糊了。\n\n“随便你。”\n\n你把信带回去，在内袋里放了三天，边角磨软了。\n\n信没送到，只领到一千眼。', eff: { money: 1000, mind: -2, flag: 'kept_envelope' } } },
      ] },
    { id: 'fg_index_third_door', age: [18, 75], req: FINGER('index'), w: 9, title: '数到第三扇',
      text: '指令写：把东西放在第三扇门下面。\n\n那栋楼有两排门，一排朝街，一排朝院子。\n\n朝街的第三扇是空屋，门缝里塞满了广告纸。\n\n天快黑了，东西还在你手里。',
      choices: [
        { t: '数朝街的第三扇', r: '你把东西塞进门缝，广告纸被顶开一角。\n\n第二天再经过，那扇门开着，里面扫得很干净。\n\n东西不在了。\n\n跑腿钱四千眼，第二天结的。', eff: { money: 4000, mind: -1, flag: 'left_at_street_third' } },
        { t: '数朝院子的第三扇', r: '你绕进院子，第三扇门下有块被磨亮的石头。\n\n东西放上去，没有人出来。\n\n第二天石头还在，东西不在了。\n\n跑腿钱六千眼，一分没少。', eff: { money: 6000, wit: 1, flag: 'left_at_yard_third' } },
        { t: '敲门，问哪一扇算第三扇', check: { s: 'social', dc: 46 },
          ok: { r: '开门的人愣了一下，抬手指了指院子那一排。\n\n“从楼梯口数。”\n\n你放对了地方，他关门前说了声谢谢。\n\n跑腿钱三千眼，当场就结了。', eff: { social: 1, money: 3000, flag: 'asked_which_door' } },
          no: { r: '“不知道。”\n\n门关上了。\n\n你在两排门之间站到天全黑，最后把东西带回了据点。', eff: { mind: -2, flag: 'took_back_parcel' } } },
      ] },

    // —— 4 个跨年回响（无选项，eff 直接排后续）——
    { id: 'fg_thumb_receipt', age: [20, 70], req: FINGER('thumb'), w: 8,
      text: '收条上按了手印，撕成两半，一半留给你。\n\n指挥官说，这一半是账，另一半是话。\n\n你把纸片夹进本子，指印那一面朝里。',
      eff: { queue: ['fg_thumb_receipt_back', 6], flag: 'kept_receipt_half', mind: -1 } },
    { id: 'fg_thumb_promised', age: [20, 70], req: FINGER('thumb'), w: 8,
      text: '换班前，有人托你把一句话带到后间：他妹妹下个月出嫁。\n\n你答应了。\n\n那一班临时改了路线，你在车上把这句话过了两遍，回来时已经不需要说了。',
      eff: { queue: ['fg_thumb_promised_back', 5], flag: 'carried_unspoken_words', mind: -2 } },
    { id: 'fg_index_spare', age: [20, 70], req: FINGER('index'), w: 8,
      text: '你把一张没有执行的旧指令留下来，夹在本子最里面。\n\n纸上的日期已经过去两年。\n\n有时候翻到那一页，你会把纸摊平，再折回四折。',
      eff: { queue: ['fg_index_spare_back', 7], flag: 'kept_old_prescript', mind: -1 } },
    { id: 'fg_index_ink', age: [20, 70], req: FINGER('index'), w: 8,
      text: '据点墙上按手印，按完要用湿布擦掉。\n\n你那一次没有擦干净，留了半个指印在灰上。\n\n第二天，指印旁边多了另一个，比你的小。',
      eff: { queue: ['fg_index_ink_back', 4], flag: 'left_half_thumbprint', mind: 1 } },

    // —— 4 个 manual 后续 ——
    { id: 'fg_thumb_receipt_back', manual: true, age: [26, 95], w: 1,
      text: '六年后，管账的人拿着一沓旧收条来找你。\n\n最上面那张是半截的，边缘和你本子里那半对得上。\n\n“有人拿另一半来问过。”他说，“问的是你的名字。”\n\n那一笔已经从账簿上划掉了，六千眼要由你补上。',
      eff: { money: -6000, mind: -2, flag: 'receipt_came_back' } },
    { id: 'fg_thumb_promised_back', manual: true, age: [25, 95], w: 1,
      text: '五年后，你在换岗表上看见一个熟悉的名字。\n\n那人递给你一只小盒子，说是他妹妹托他带来的喜糖。\n\n“她等到开席才问，话怎么没带到。”\n\n盒子里的糖化了一半，纸粘在糖上。',
      eff: { mind: -3, social: 1, flag: 'promise_came_back' } },
    { id: 'fg_index_spare_back', manual: true, age: [27, 95], w: 1,
      text: '七年后，那张旧指令上的事被人重新办了一次。\n\n据点门口贴了新纸，字迹和旧纸一样。\n\n日期是昨天。\n\n你本子里那张的日期，还停在七年前。',
      eff: { dist: 3, mind: -2, flag: 'old_prescript_came_back' } },
    { id: 'fg_index_ink_back', manual: true, age: [24, 95], w: 1,
      text: '四年后，据点那面墙被重新刷过。\n\n刷墙的人说，灰底下全是手印，擦不掉，只能盖住。\n\n他指了指最上面那个，问是不是你的。\n\n你没有认。',
      eff: { mind: -1, wit: 1, flag: 'thumbprint_came_back' } },
  ]);
})();
