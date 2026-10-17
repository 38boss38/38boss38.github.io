/* Seven / Dieci / Cinq 三个协会的外围工作（批次 14）：核稿、抄本、代打。
 * 只写协会接的普通委托；不编造职衔与制度，不写原作角色。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);

  // ============ 故事包 1：Seven协会 多出来的一行 ============
  p({ id: 'seven_case', pack: 'B14', title: '多出来的一行', route: 'as_seven', person: 'seven_analyst', theme: '调查', age: [20, 55], sources: ['S07'] }, [
    ['别人的结论',
      S => '卷宗里有三样东西：一份转写、一张门禁纸、一份已经写完的报告。\n\n结论那一段不是你写的，字透到纸背，笔比你用力。\n\n' + NM(S, 'seven_analyst') + '把笔帽拧开，又扣上：“核一遍，签个字。”',
      [
        c('把转写和门禁纸对一遍', 'wit', 45,
          o('时间对不上。', '门禁纸比转写晚了四十分钟，报告把两处写成了同一刻。\n\n你把对不上的地方圈出来，一共圈了三处。', { gap: true }, { wit: 2, flag: 'se_found_gap' }, { trust: 1 }),
          o('你按错了一行。', '你把下午读成上午，核稿上签了名才发现。\n\n他没有说什么，只在签名旁边留了一块空白，等补一句说明。', { gap: false }, { mind: -2, flag: 'se_misread' })),
        o('照抄结论，签上名字', '你抄完，签了名，笔在纸上多按了一秒。\n\n他把两份报告叠齐，装进同一个袋子，像是同一件事的两个版本。', { signed: true }, { money: 3000, flag: 'se_signed_draft' }, { trust: 1 }),
        o('去问这一段是谁写的', '你去了档案区。登记本摊着，最后一个名字的墨还没干透。\n\n写结论的人坐在最里面那张桌上，没有抬头。', { asked: 'writer' }, { wit: 1, flag: 'se_asked_writer' }, { goto: 2 }),
      ]],
    ['不肯签字的人',
      '证人在七层，门开一条缝，门链还挂着。\n\n他说那天下午他在场，也说他不会去协会那间有窗的屋子里说话。\n\n“窗外站着人。”',
      [
        c('问他能不能就在门口说一遍', 'social', 46,
          o('他把门链取下来了。', '他说到一半，楼道里有人上楼，他就改成讲煤球。\n\n脚步过去以后，他接着说完了。', { words: 'door' }, { social: 1, wit: 1, flag: 'se_heard_door' }),
          o('他开始谈价钱。', '谈得很细，细到把开口和签字分成两种价。\n\n等你回到正题，他已经把门关到只剩一条缝。', { words: 'price' }, { money: -800, mind: -2, flag: 'se_priced_words' })),
        c('照他说的位置，把时刻推回去算', 'wit', 47,
          o('算出来的时间和门禁对得上。', '差的那四十分钟就是人上楼的那一段。\n\n他把这个说法讲了两遍，第二遍只讲了一半，就停下来看你。', { words: 'counted' }, { wit: 2, flag: 'se_counted_time' }),
          o('你算错了。', '你把楼层数错了一层，推出来的时间提前了半个钟头。\n\n他没有纠正，只是把门关上了。', { words: 'wrong' }, { mind: -2, flag: 'se_miscounted' })),
        o('给他路费，请他去协会', '他收了钱，第二天来了，坐在窗边，一句话也没说。\n\n登记表上“证词”那一栏，最后写的是“拒绝陈述”。', { words: 'paid' }, { money: -2000, flag: 'se_paid_witness' }),
      ]],
    ['划掉的一段',
      S => '清样摊在桌上，' + NM(S, 'seven_analyst') + '用红笔圈住第二页下面那一段。\n\n“这段删掉。不是因为它是假的。”\n\n红笔停在句号上，墨洇开一点，像一颗很小的痘。',
      [
        c('问他能不能只删名字', 'social', 45,
          o('他同意了。', '事实留着，名字换成“一名在场者”。\n\n改过的地方他读了两遍，第二遍读得很轻。', { par: 'nameless' }, { social: 1, merit: 1, flag: 'se_kept_fact' }, { trust: 1 }),
          o('他把那一页撕了下来。', '撕得很整齐，沿着折痕，纸叠成小方块进了内袋。\n\n第二天清样少了一页，档案袋上的封条是新的。', { par: 'torn' }, { mind: -2, flag: 'se_page_torn' })),
        o('照他说的删掉', '你划掉四行，划得很直。\n\n清样印出来，第二页下面留着一块空白，比别处矮一行。', { par: 'cut' }, { money: 4000, merit: 1, flag: 'se_cut_par' }, { trust: 1 }),
        o('把那段抄进自己的本子', '你抄得很快，字挤在一起。\n\n本子塞进内袋时，他把红笔盖上，看了你一眼，什么也没说。', { par: 'copied' }, { wit: 1, flag: 'se_copied_par' }, { trust: -1 }),
      ]],
    ['第二稿',
      S => '第二稿换了新封面，编号比上一份高一位。\n\n' + (S.flags.se_found_gap ? '你圈出的三处，新稿改了两处，第三处挪到了附页。' : S.flags.se_misread ? '你核错的那一处没有改，旁边多了一行别人的批注。' : '没有人提上一稿，纸却比原来薄。') + '\n\n' + NM(S, 'seven_analyst') + '把笔推过来：“哪一份是真的？”',
      [
        c('把两份逐条对着读', 'wit', 48,
          o('只差一处时间。', '你把两个时刻并排写在纸边上。\n\n他看了很久，在新稿那一行旁边画了一个很小的勾。', { diff: 'time' }, { wit: 2, money: 6000, flag: 'se_diff_time' }, { trust: 1 }),
          o('读到第三遍，茶被端走了。', '他让别人重做了一稿。你被调去核别人的稿，桌上换了一叠更旧的卷宗。\n\n新来的那份报告，结论那一段又是打印的。', { diff: 'missed' }, { mind: -3, flag: 'se_reassigned' })),
        o('把第二稿压在最下面', '你说两份都留档。\n\n他点了点头，把新稿塞进最底下那格，格子里的纸压得很实。', { diff: 'buried' }, { mind: 1, flag: 'se_buried_draft' }, { trust: -1 }),
        o('两份都交上去，不选', '你花了一千二百眼，把两份各印了一份，钉在一起。\n\n袋子交上去时，收发的人翻了翻，问哪份是要办的。', { diff: 'both' }, { money: -1200, flag: 'se_both_filed' }, { goto: 5 }),
      ]],
    ['第七行',
      '报告归档第三天，有人在楼下等你。\n\n他手里是那份报告的抄件，第七行写着他的名字，后面跟了一个“疑”字。\n\n“我不是来吵的。我在那栋楼里还有一份工。”',
      [
        c('查这句是从哪来的', 'wit', 47,
          o('来源是转写里的一句口误。', '你写了勘误，附上原话的位置。\n\n一周后他的名字后面换成了“已核”，字很小，压在原来那个字上面。', { fix: 'errata' }, { merit: 1, wit: 1, flag: 'se_filed_errata' }),
          o('你没有查出来。', '你在档案区坐了两天，只找到一份同名的旧记录。\n\n第三天下楼，那个人没有再来。听说他辞了工。', { fix: 'none' }, { mind: -3, flag: 'se_lost_job' })),
        o('让他自己上楼去问', '你把门牌指给他看。\n\n他上去了一次，下来时手里还是那张抄件，折过了，折痕很清楚。', { fix: 'sent' }, { mind: -1, flag: 'se_sent_upstairs' }),
        o('把抄件留下，给他两千眼', '他收了钱，把抄件留给你。\n\n纸上第七行被他的手指按得发亮。', { fix: 'bought' }, { money: -2000, flag: 'se_bought_copy' }),
      ]],
    ['归档以后',
      S => '一个月后，卷宗装进档案袋，袋口压了封条。\n\n' + (S.flags.se_filed_errata ? '那个名字后面的字换过了，换得很轻。' : S.flags.se_lost_job ? '那张抄件还在你的抽屉里，第七行被手指按得发亮。' : '没有人再提第二页下面那块空白。') + '\n\n' + NM(S, 'seven_analyst') + '把新的一叠放在你桌上，没有说是哪件事。',
      [
        o('留下，接着核别人的稿', '你把新卷宗抱回工位，先翻到最后一页看结论。\n\n结论那一段还是打印的，页边留着很宽的空白。', null, { money: 14000, flag: 'se_stayed' }, { end: '你留在Seven协会，继续替别人核那些已经写完的结论。' }),
        o('申请调去档案区', '调令三个月后下来。最后一天你把笔交回柜台。\n\n笔帽上有一圈牙印，不是你的。', null, { money: 4000, mind: 1, flag: 'se_moved_archive' }, { end: '你从Seven协会的核稿桌调去了档案区，此后经手的都是封好的袋子。' }),
        o('把手里的案子原样退回去', '你把卷宗码齐，压上镇纸。\n\n退单上“原因”一栏你写了两行，写完又划掉一行。', null, { mind: 2, money: -1000, flag: 'se_returned_case' }, { end: '你把那件案子退回了Seven协会的收发口，没有签自己的名字。' }),
      ]],
  ]);

  // ============ 故事包 2：Dieci协会 要交出去的那本书 ============
  p({ id: 'dieci_copy', pack: 'B14', title: '要交出去的那本书', route: 'as_dieci', person: 'dieci_curator', theme: '知识', age: [20, 55], sources: ['S08'] }, [
    ['书脊里的字',
      S => '一本收来的旧书摊在桌上，纸比现在的薄，翻页要托着。\n\n书脊内侧有一行铅笔字：“借阅者：不还。”\n\n' + NM(S, 'dieci_curator') + '把抄本推过来：“交出去以前，你自己决定抄哪一页。”',
      [
        c('抄下书脊里那行字', 'wit', 44,
          o('铅笔下面还有一行。', '第二行更淡，是一个门牌号，末尾的数字被磨掉了。\n\n你把它抄进本子，抄完对着灯又看了一遍。', { line: 2 }, { wit: 1, flag: 'de_second_line' }, { trust: 1 }),
          o('你一擦，字就没了。', '橡皮是借的，擦下来的黑粉沾在指腹上。\n\n书脊内侧只剩一道浅凹痕，什么都没有。', { line: 0 }, { mind: -1, flag: 'de_line_gone' }, { trust: -1 })),
        o('抄正文第一页', '你抄得慢，抄到一半手腕发酸。\n\n抄本交上去时，他把两本并排比了比厚度。', { copied: 1 }, { money: 2500, flag: 'de_copied_first' }, { trust: 1 }),
        o('先问清楚是谁要这本书', '你去了登记台。委托人的名字写在最上面，下面那一栏是空的。\n\n登记的人说，栏空着的意思是不用来取。', { asked: true }, { wit: 1, flag: 'de_asked_owner' }, { goto: 2 }),
      ]],
    ['抱着册子的人',
      '救济窗口外站着一个人，怀里抱着一本册子。\n\n册子被水泡过，纸粘成一块，只能从侧面看出有字。\n\n他说他不要钱，只想知道里面写的是谁的名字。',
      [
        c('一页一页拆开', 'wit', 47,
          o('第七页还能认。', '你认出三个名字，其中一个是他母亲的。\n\n他把册子抱回去，抱得比来时松。', { names: 3 }, { wit: 1, merit: 1, flag: 'de_three_names' }, { trust: 1 }),
          o('纸一碰就碎。', '碎屑落在桌上，像一层灰。\n\n第二天他又来了，手里换了一本，说是邻居家的。', { names: 0 }, { mind: -2, flag: 'de_pages_crumbled' })),
        o('给他一张救济券，让他明天来', '你写了日期，把券按在他手里。\n\n他收下，走出两步又回头，问册子能不能先放在这里。', { voucher: true }, { money: -1500, flag: 'de_gave_voucher' }, { trust: 1 }),
        o('让他把册子留下，改天再来', '你用一张旧报纸把册子包好，写上他的姓。\n\n报纸上有一则旧招聘，日期是三年前。', { kept: true }, { wit: 1, flag: 'de_left_ledger' }, { goto: 3 }),
      ]],
    ['半瓶药水',
      S => '抄本用的药水只剩半瓶，瓶身贴着价钱：三千眼。\n\n' + NM(S, 'dieci_curator') + '说这瓶算协会的，也可以算你的。\n\n瓶底沉着一层白的，摇一摇才化开。',
      [
        c('照着标签自己配一瓶', 'wit', 48,
          o('配出来的深一点。', '抄出来的字比原书黑，干得也快。\n\n省下的钱你拿去买了纸，纸还剩半叠，压在柜子最下层。', { ink: 'mixed' }, { money: 1800, wit: 1, flag: 'de_mixed_ink' }, { trust: 1 }),
          o('第三遍时纸烧出一个洞。', '洞正好落在名字上，边缘焦黑。\n\n那一页只好裁掉，书薄了一点，裁口是新的。', { ink: 'burned' }, { money: -1200, mind: -2, flag: 'de_burned_page' })),
        c('跟馆长说先赊着', 'social', 45,
          o('他同意记在账上。', '月底从工钱里扣，扣得很干净。\n\n那半瓶药水你抄完了，瓶子留着，瓶底那层白还在。', { ink: 'credit' }, { money: -3000, merit: 1, flag: 'de_ink_on_credit' }, { trust: 1 }),
          o('他让你自己想办法。', '他把账本合上，推回抽屉。\n\n你回到桌边，只抄了能抄的那几页。', { ink: 'refused' }, { mind: -1, flag: 'de_ink_refused' })),
        o('不抄了，原样交出去', '你把书合上，扣好布套。\n\n委托人来取时问了一句有没有抄本，你说没有。他点点头，把书抱走了。', { ink: 'none' }, { mind: 1, flag: 'de_handed_raw', queue: ['de_echo_book', 5] }, { goto: 4 }),
      ]],
    ['交接单',
      '委托人来取书，带了一只布套，尺寸不合。\n\n交接单上有两栏：件数，已知内容。\n\n笔在纸上停着，他自己也没有先填。',
      [
        c('把已知内容写清楚', 'social', 46,
          o('他接受了那行字。', '你写：正文完整，来历不明。\n\n他看了一遍，把单子折好，收进内袋。', { sheet: 'known' }, { money: 8000, merit: 1, flag: 'de_wrote_known' }, { trust: 1 }),
          o('他把单子推回来。', '他要求把“来历不明”划掉，你没有划。\n\n他把书收回布套，说改天再来，布套留在了桌上。', { sheet: 'refused' }, { mind: -1, flag: 'de_struck_line' })),
        o('只写件数', '你写了一。\n\n他看了看那一栏空白，笑了一下，把书抱走。', { sheet: 'count' }, { money: 5000, flag: 'de_count_only' }, { trust: -1 }),
        o('把抄本一起给他', '你把抄本放在书上面，两本一般厚。\n\n他愣了一下，接过去，问了价，你没报。', { sheet: 'withcopy' }, { money: 2000, flag: 'de_gave_copy' }, { req: { flag: 'de_copied_first' }, goto: 5 }),
      ]],
    ['书回来的那天',
      S => '一个月后，那本书又回到窗口，包在一张旧报纸里。\n\n书脊内侧多了一行新字，铅笔，写得很轻：“已经还了。”\n\n' + (S.flags.de_second_line ? '你抄过的那两行下面，多了一个很小的对勾。' : '送书的人没有留下名字，报纸的日期是上个月的。'),
      [
        c('把新字和旧字一起抄下来', 'wit', 45,
          o('两行字不是一个人写的。', '新字笔画轻，收尾往上挑。\n\n你抄完，把纸压在书下面。', { note: 'both' }, { wit: 1, merit: 1, flag: 'de_copied_both' }, { trust: 1 }),
          o('铅笔一写就断。', '你换了三支，抄出来的字歪得很。\n\n再看书脊，新字淡了一半，像是被手擦过。', { note: 'broken' }, { mind: -2, flag: 'de_scribe_broke' })),
        o('把书放回架上，不再登记', '你把书推到最里面，书脊朝里。\n\n登记册上那一行留着，没有销掉，墨已经干了。', { note: 'shelved' }, { mind: 1, flag: 'de_shelved_book' }),
        o('去查送书的人', '你按报纸上的发行点问了两家。\n\n第二家的伙计说，那天买报的人多，记不住。', { note: 'asked' }, { wit: 1, money: -600, flag: 'de_asked_sender' }, { goto: 5 }),
      ]],
    ['架子上',
      S => '架子上又添了几本，编号一直排下去。\n\n' + (S.flags.de_wrote_known ? '那张交接单你留了底，压在最下面。' : S.flags.de_count_only ? '有一张只写了件数的单子，字很少。' : '桌上的布套一直没有等到人来取。') + '\n\n' + NM(S, 'dieci_curator') + '问你下个月想留在窗口，还是搬去后面整理。',
      [
        o('留在窗口，继续登记', '你把笔拴回柜台，绳子换了一根新的。\n\n第二天来的人比前一天多一个。', null, { money: 12000, flag: 'de_stayed_window' }, { end: '你留在Dieci协会的救济窗口，继续一笔一笔登记进来和出去的东西。' }),
        o('搬去后面整理书', '后面的屋子没有窗，灯管有一支在闪。\n\n你把第一批书按编号排好，排到一半就明白哪几本不会有人来取。', null, { money: 5000, wit: 1, flag: 'de_moved_back' }, { end: '你从Dieci协会的窗口搬到后面那间屋子，开始整理没有人来取的书。' }),
        o('把抄本交上去', '你把抄本放在登记台上，说了原书的来历。\n\n他翻了翻，问：“这些是你抄的？”', null, { merit: 1, mind: -1, flag: 'de_handed_copy' }, { req: { flag: 'de_copied_first' }, end: '你把抄本交回Dieci协会，让它和原书一起归档。' }),
      ]],
  ]);

  // ============ 故事包 3：Cinq协会 第二副手套 ============
  p({ id: 'cinq_second', pack: 'B14', title: '第二副手套', route: 'as_cinq', person: 'cinq_seconds', theme: '决斗', age: [20, 55], sources: ['S06'] }, [
    ['桌上的一只手套',
      S => '信封里没有挑战书，只有一只手套，平放在一张纸卡上。\n\n纸卡背面是时间与地点，字是打印的。\n\n' + NM(S, 'cinq_seconds') + '把表摘下来放在旁边：“这个支部的手套，不扔。”',
      [
        c('问清这个支部怎么应战', 'social', 45,
          o('要放回桌上。', '他说这一带把摔在地上的手套捡回来放好，才算应下；扔回去是另一种意思。\n\n你把手套摆正，指尖朝外。', { form: 'table' }, { social: 1, flag: 'cq_learned_form' }, { trust: 1 }),
          o('他以为你在取笑。', '他把手套收回信封，站起来，椅子在地上刮了一声。\n\n第二天协会的板子上多了你的名字，写在你没答应过的那一栏。', { form: 'wrong' }, { mind: -2, flag: 'cq_name_on_board' })),
        o('照自己支部的规矩，扔回去', '你把手套摔在门外的地上，摔得很响。\n\n路过的人停下来看。有人把手套捡起来，拍掉灰，放回信封。', { form: 'thrown' }, { fame: 1, mind: -1, flag: 'cq_threw_glove' }, { trust: -1 }),
        o('先把纸卡上的时间记下来', '你把时间写在手心里，写完把手握起来。\n\n回去的路上，那只手套的样子比时间记得更清楚。', { form: 'noted' }, { wit: 1, flag: 'cq_noted_time' }, { goto: 2 }),
      ]],
    ['包着的手',
      '要你代打的人坐在长椅上，右手指头包着，包了三年。\n\n他说他不是不敢。\n\n他把手套从口袋里掏出来，又塞回去，口袋的衬里翻在外面。',
      [
        c('问他这一场是怎么来的', 'social', 47,
          o('是一句话引出来的。', '那人当众讲了他女儿的事，讲完就走了。\n\n“我没追。我回家把手包上了。”', { why: 'words' }, { social: 1, flag: 'cq_heard_words' }),
          o('他把话咽了回去。', '他只说“你打你的”。\n\n后来你从别人嘴里听到另一个版本，两个版本连日子都对不上。', { why: 'hidden' }, { mind: -2, flag: 'cq_two_versions' })),
        o('收下他放在膝上的纸袋', '纸袋里是定金，数得很整齐，最上面一张是旧钞。\n\n他把纸袋推过来的时候，没有看你的脸。', { why: 'paid' }, { money: 6000, flag: 'cq_took_deposit' }),
        o('不问，先去场地', '你到的时候线还没画完。\n\n画线的人用一截粉笔，粉笔短得要捏着写。', { why: 'early' }, { wit: 1, flag: 'cq_went_early' }, { goto: 3 }),
      ]],
    ['线',
      '仓房的地上画了两道线，线外站着十几个人。\n\n一个支部一个画法。这里线内算，退到线外算输，出了仓房算弃权。\n\n计秒的人把表举起来：“铃响以后不许再进半步。”',
      [
        c('先沿线走一遍', 'body', 45,
          o('线画得比看上去窄。', '你沿内侧走到头，走到第二个角就知道了退路在哪。\n\n粉笔在你鞋底留了一道白。', { line: 'walked' }, { body: 1, flag: 'cq_walked_line' }, { trust: 1 }),
          o('你踩掉了半截线。', '画线的人没有再补，只说“心里记住”。\n\n上场以后，所有人都按那条看不见的线站。', { line: 'smudged' }, { mind: -2, flag: 'cq_line_smudged' })),
        o('问计秒的人铃怎么响', '他把表翻过来给你看，铃在背面，很小。\n\n“响一声。不会响第二声。”', { line: 'bell' }, { wit: 1, flag: 'cq_asked_bell' }, { trust: 1 }),
        o('不看了，去线的另一头等', '你站到对面，等到灯点上。\n\n对面的人来得比你晚，手套戴得很慢。', { line: 'wait' }, { mind: 1, flag: 'cq_waited_other' }),
      ]],
    ['铃响过以后',
      '铃响过一次。\n\n对手退到线里半步，你的刀还在半空，围观的人没有出声。\n\n计秒的人看着你，手指按在表上，没有按下去。',
      [
        c('收刀，退回线外', 'skill', 46,
          o('你退得干净。', '刀尖在地上点了一下，铃才响第二遍。\n\n计秒的人把表放下，说这一场到此为止。', { endfight: 'stopped' }, { money: 12000, merit: 1, skill: 1, flag: 'cq_stopped_clean' }, { trust: 1 }),
          o('你退晚了半步。', '鞋跟在线上蹭出一道白，围观的人开始说话。\n\n话不是对你说的，是对着场地外那边说的。', { endfight: 'late' }, { body: -3, money: 6000, mind: -2, flag: 'cq_late_step' })),
        o('趁铃没响第二遍，再补一下', '你补了一下，很快。\n\n对面的人倒在线里，手套从手里松开，滑出去半掌。\n\n客户在场地外拍了两下手，没有人跟着拍。', { endfight: 'extra' }, { money: 18000, fame: 1, mind: -2, flag: 'cq_extra_blow' }, { trust: -1 }),
        o('把刀插回鞘里，走出仓房', '你没有等铃。走到门口时，身后才响了一声。\n\n门外的风把汗吹冷了。', { endfight: 'walked' }, { mind: 1, flag: 'cq_walked_out' }, { goto: 5 }),
      ]],
    ['场地边上的一句话',
      S => '收拾东西的时候，场地边上有人在说话。\n\n' + (S.flags.cq_two_versions ? '他讲的版本和你听到的两个都不一样，日子却算得正好是今天。' : '他讲的是要你上场的那个委托人，讲他为什么三年不敢用右手。') + '\n\n他说得很轻，可是这个仓房的回声很好。',
      [
        c('当众把话接过来', 'social', 47,
          o('你只说了三句。', '第一句是日期，第二句是线在哪，第三句是那个人今天没有上场。\n\n说完没有人接话，说话的人把手插进兜里。', { public: 'spoke' }, { fame: 1, social: 1, flag: 'cq_spoke_public' }, { trust: 1 }),
          o('你的声音不够。', '你说到第二句时，他们已经转身去收线了。\n\n那句话被别人的笑声截断，剩半句留在仓房里。', { public: 'cut' }, { mind: -2, flag: 'cq_word_cut' })),
        o('不说，把地上那条线擦掉', '你用鞋底蹭了两下，粉笔印淡了一半。\n\n剩下的一半明天还会在。', { public: 'erased' }, { mind: 1, flag: 'cq_erased_line' }),
        o('把那只手套捡起来', '手套是那个人的，戴了很久，掌心磨得发亮。\n\n你把它放在场地边的箱子上，没有交给他本人。', { public: 'glove' }, { wit: 1, flag: 'cq_picked_glove' }, { goto: 5 }),
      ]],
    ['下一场的纸卡',
      S => '协会的板子上换了一张新的排期。\n\n' + (S.flags.cq_spoke_public ? '你的名字旁边有人用铅笔写了两个字，写完没有擦。' : '你的名字还在老位置，下面多了一行小字。') + '\n\n' + NM(S, 'cinq_seconds') + '把下一场的纸卡推过来，手套压在纸卡上。',
      [
        o('接下下一场', '你把表戴回手腕，先对了一遍时间。\n\n下一场的线上，站着另一个人。', null, { money: 15000, skill: 1, flag: 'cq_took_next' }, { end: '你留在Cinq协会，接着替别人站到线上，也接着数那一声铃。' }),
        o('改做计秒与画线', '你把表挂在腰上，学着在正确的时刻按下去。\n\n按早了会有人说，按晚了没有人说。', null, { money: 6000, wit: 1, flag: 'cq_became_seconds' }, { end: '你从Cinq协会的线上退下来，改做计秒和画线的人。' }),
        o('把手套还回去，退掉这一行', '你把两只手套一起放在登记台上，摆正。\n\n登记的人看了看，问你要不要留个联系方式。', null, { mind: 2, money: -1500, flag: 'cq_left_duels' }, { end: '你把Cinq协会的手套还了回去，此后再没有站到任何一条线上。' }),
      ]],
  ]);

  // ============ 12 个事件 ============
  C.addEvents('assoc_b', [
    // —— Seven协会：4 个 ——
    { id: 'se_blank_line', age: [20, 58], req: { job: 'fixer', flag: 'as_seven' }, w: 10,
      text: '报告抄了三份，第三份的第九行空着。\n\n前两份那里是同一个名字，笔迹比你的老。\n\n科长把空着的那份抽出来：“交这个。”',
      eff: { mind: -1, flag: 'se_saw_blank', queue: ['se_echo_blank', 6] } },

    { id: 'se_wrong_report', age: [20, 58], req: { job: 'fixer', flag: 'as_seven' }, w: 10, title: '写早的两个小时',
      text: '一份交上去的报告被退回来，第二页夹着一张便条。\n\n错的地方只有一处：时间写早了两个小时。\n\n改这一处，后面三页的推论都要动。',
      choices: [
        { t: '把后面三页重写一遍', check: { s: 'wit', dc: 45 },
          ok: { r: '你重算到天亮。重写的三页比原来的短，结论只剩半句。\n\n科长把两稿并排看完，选了短的那份。', eff: { wit: 1, money: 4000, flag: 'se_rewrote_three' } },
          no: { r: '改到第二页你才发现，原来的推论靠的正是那段时间。\n\n整份报告作废，重排的号从新的一号开始，先交的那份要追回来。', eff: { mind: -2, money: -1500, flag: 'se_voided_report' } } },
        { t: '只改时间，注明推论未复核', check: { s: 'social', dc: 44 },
          ok: { r: '科长在页脚那行字下面签了名，签得很小。\n\n三个月后有人来调这份报告，只调了那一页。', eff: { money: 2000, flag: 'se_noted_unchecked' } },
          no: { r: '他把纸推回来，说页脚不是写解释的地方。\n\n你重抄了一遍，改过的地方用铅笔打了勾，勾在灯下很显眼。', eff: { money: -800, mind: -1, flag: 'se_crossed_note' } } },
        { t: '原样再交一次，认这一处错', eff: { fame: -1, mind: -1, flag: 'se_resubmitted' },
          r: '你把便条夹回去，重新签了名。\n\n退稿的章盖过两次，第二次正好压在第一次上面。' },
      ] },

    { id: 'se_witness', age: [20, 58], req: { job: 'fixer', flag: 'as_seven' }, w: 9, title: '摊子后面的布帘',
      text: '证人在巷口修鞋，摊子后面挂着一块布帘。\n\n他说那天下午他在场，也说他不会去协会的屋子里说话。\n\n“那间屋子有窗。窗外站着人。”',
      choices: [
        { t: '问他能不能就在这里说一遍', check: { s: 'social', dc: 45 },
          ok: { r: '他把锥子放下。说到一半有人经过，他就改成讲鞋掌。\n\n人走了，他接着说完了。', eff: { wit: 2, money: 3000, flag: 'se_heard_stall' } },
          no: { r: '他开始给你讲价钱，讲得很细。\n\n等你回到正题，他已经把你的鞋拿去钉后跟了。鞋钉好，一只比另一只高半分。', eff: { money: -600, mind: -2, flag: 'se_heel_raised' } } },
        { t: '照他说的位置推算时刻', check: { s: 'wit', dc: 47 },
          ok: { r: '你按他站的位置和太阳的角度推出一个时段，正好扣掉门禁纸上空的那四十分钟。\n\n他把这个说法又复述了一遍，复述得很慢。', eff: { wit: 2, flag: 'se_counted_time' } },
          no: { r: '你把楼层算错一层，推出来的时间提前了半个钟头。\n\n他没有纠正，只把布帘拉了一半。', eff: { mind: -2, flag: 'se_miscounted' } } },
        { t: '给他路费，请他去协会', eff: { money: -2000, flag: 'se_paid_witness' },
          r: '他收了钱，第二天来了，坐在窗边，一句话也没说。\n\n登记表上“证词”那一栏，最后写的是“拒绝陈述”。' },
      ] },

    { id: 'se_echo_blank', manual: true, age: [26, 90], req: { job: 'fixer', flag: 'as_seven' }, w: 1,
      text: '六年后，旧档案清出一批待销毁的报告。\n\n你翻开一份，第九行空着，空得很干净。\n\n纸角有你的签名，日期在签名之前。',
      eff: { mind: -2, wit: 1, flag: 'se_echo_blank' } },

    // —— Dieci协会：4 个 ——
    { id: 'de_book_return', age: [20, 58], req: { job: 'fixer', flag: 'as_dieci' }, w: 10,
      text: '还回来的书里夹着一张借阅单，日期是十一年前。\n\n单子上的名字被水泡过，只剩一个姓。\n\n管理员把书放回架上，没有把单子抽出来。' },

    { id: 'de_ink_price', age: [20, 58], req: { job: 'fixer', flag: 'as_dieci' }, w: 10, title: '按页收钱',
      text: '抄一页五十眼，抄本的钱当场结清。\n\n摊在你面前的是一本借来的书，还书的日子在后天。\n\n书里夹着一张纸条，上面写着：抄完请把纸条留下。',
      choices: [
        { t: '连夜抄完前面三十页', check: { s: 'body', dc: 46 },
          ok: { r: '你抄到天亮，最后一页的字开始发飘。\n\n还书那天书是干的，纸条被你放回了原处。', eff: { money: 1500, body: -1, flag: 'de_copied_night', queue: ['de_echo_book', 5] } },
          no: { r: '抄到第二十页你睡着了，笔尖在纸上划出一道。\n\n第二天书按时还了，那一页没有补，纸条你留着。', eff: { money: 600, mind: -2, flag: 'de_ink_smear', queue: ['de_echo_book', 5] } } },
        { t: '拿纸条去问馆长', check: { s: 'social', dc: 45 },
          ok: { r: '他把还书的日期往后挪了两天，纸条留在他那里。\n\n你抄完了，抄得很稳。', eff: { money: 800, merit: 1, flag: 'de_borrowed_days' } },
          no: { r: '他把纸条收进抽屉，说书明天就得还。\n\n你当晚只抄了能抄的十一页。', eff: { mind: -1, flag: 'de_return_tomorrow' } } },
        { t: '只抄自己用得上的几页', eff: { wit: 1, flag: 'de_copied_half' },
          r: '你挑了三页，抄得很慢。\n\n书还回去的时候，纸条还在里面，你没有动它。' },
      ] },

    { id: 'de_relief_queue', age: [20, 58], req: { job: 'fixer', flag: 'as_dieci' }, w: 10,
      text: '救济窗口今天发面包，一人一份，发到只剩半箱。\n\n队伍最后的人没有往前挤，只把手里的书举了举。\n\n发东西的人说书不能换面包。' },

    { id: 'de_echo_book', manual: true, age: [25, 90], req: { job: 'fixer', flag: 'as_dieci' }, w: 1,
      text: '五年后，你在救济站的架子上认出那本书。\n\n书脊换了，里面那页还在，只是字比记忆中淡。\n\n借阅卡上多了一行，写着“已还”，没有日期。',
      eff: { mind: -1, wit: 1, flag: 'de_echo_book' } },

    // —— Cinq协会：4 个 ——
    { id: 'cq_spare_glove', age: [20, 58], req: { job: 'fixer', flag: 'as_cinq' }, w: 10,
      text: '更衣室的柜子里放着一副备用手套，比你的小一号。\n\n左手的虎口磨穿了，右手几乎是新的。\n\n柜门上贴着名字，被刮掉了。',
      eff: { mind: -1, flag: 'cq_saw_spare', queue: ['cq_echo_glove', 5] } },

    { id: 'cq_proxy', age: [20, 58], req: { job: 'fixer', flag: 'as_cinq' }, w: 10, title: '不出巷口',
      text: '这一场在一条巷子里，两边各站几个人。\n\n这里的规矩和别处不一样：不出巷口，谁先出谁输。\n\n要你代打的人把手包给你看：指头是弯的，弯了三年。',
      choices: [
        { t: '在巷口前收住', check: { s: 'skill', dc: 46 },
          ok: { r: '你在巷口前收了半步，对手的刀砍在墙上，掉下一层灰。\n\n有人喊了一声好，也有人没有出声。', eff: { money: 12000, merit: 1, skill: 1, flag: 'cq_stopped_at_mouth', queue: ['cq_echo_word', 7] } },
          no: { r: '你收晚了一步，鞋跟踩到了巷口那道线。\n\n对手没说什么，围观的人开始说话，声音不大，刚好够你听见。', eff: { body: -3, money: 6000, mind: -2, flag: 'cq_over_mouth', queue: ['cq_echo_word', 7] } } },
        { t: '先问清巷口怎么算', check: { s: 'social', dc: 45 },
          ok: { r: '他们用脚在地上补了一道横线，比巷口往里收了半掌。\n\n你记住了那道线，走过去时没有人再提醒。', eff: { social: 1, money: 9000, flag: 'cq_asked_mouth' } },
          no: { r: '你问了两遍，问得他们笑起来。\n\n笑完有人重画，画得比原来靠外，靠外得像在照顾你。', eff: { fame: -1, mind: -1, flag: 'cq_mouth_widened' } } },
        { t: '不打了，把定金退回去', eff: { money: -3000, flag: 'cq_refused_duel' },
          r: '你把定金的纸袋放在巷口的台阶上。\n\n有人把它捡起来，弹了弹上面的灰。这一场换给了别人，第二天就有人接。' },
      ] },

    { id: 'cq_echo_glove', manual: true, age: [25, 90], req: { job: 'fixer', flag: 'as_cinq' }, w: 1,
      text: '五年后，协会换新柜子，旧柜子搬去走廊尽头。\n\n你在最下层摸到那副小一号的手套。虎口磨穿的地方被人补过，针脚很粗。\n\n手套里塞着一张纸条：明天下午，老地方。落款是一只手画的秒针。',
      eff: { mind: 1, flag: 'cq_echo_glove', queue: ['cq_echo_word', 1] } },

    { id: 'cq_echo_word', manual: true, age: [27, 90], req: { job: 'fixer', flag: 'as_cinq' }, w: 1,
      text: '七年后，一场普通的决斗上，有人在场地边提起你的名字。\n\n他说的事情你没有做过，说得很轻。\n\n计秒的人把表按停，说时间到了。',
      eff: { mind: -2, wit: 1, flag: 'cq_echo_word' } },
  ]);
})();
