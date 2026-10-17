/* 翼的十一条街（批次 B10）：R公司孵化场外围、N公司名册与钉锤、J公司当铺的利息。
 * 三个故事包 + 12 个事件 + 4 个跨年后续。
 * 写法见 docs/STYLE_REFERENCE.md，术语见 docs/CONTENT_GUIDE.md。
 * 跨年回响：wr_hatch_wait / wn_nail_echo / wj_ledger_interest / wj_ledger_stub。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const d = (S, id) => (C.storyData(S, id) || { data: {} }).data;
  const R = { job: 'wing', fn: S => S.vars.wg_route === 'R' };
  const N = { job: 'wing', fn: S => S.vars.wg_route === 'N' };
  const J = { job: 'wing', fn: S => S.vars.wg_route === 'J' };

  // ============ 故事包 1：孵化场外面的名单（r_hatch） ============
  p({ id: 'r_hatch', pack: 'B10', title: '孵化场的名单', route: 'wing_R', person: 'r_hatch_mate', theme: '风险', age: [20, 55], sources: ['S13'] }, [
    ['送交单',
      S => '教官把一张送交单压在桌上，纸面留着别人的指印。\n\n明天一批人进孵化场，经手人那一栏空着。\n\n' + NM(S, 'r_hatch_mate') + '把名单转过来，指尖压在一个编号上：这一格没填装备尺寸。\n\n“签吧。”他说，“签完钱就到账。”',
      [
        o('在经手人一栏签上名字', '你把名字写在最下面一格，写得很小。\n\n第二天队伍在院里站成两排，那个编号的人光着脚。\n\n补贴当天到账。', { sign: 'blank' }, { money: 12000, merit: 1, flag: 'wr_hatch_signed_blank' }, { trust: 1 }),
        c('先问那一格为什么空着', 'social', 46,
          o('他说那一格是他自己划的', '他把单子抽回去，用笔尖点了一点。\n\n“那一格的人不用装备。”\n\n他签完就走。你在院里听见里面在点名。', { sign: 'asked' }, { money: 12000, wit: 2, flag: 'wr_hatch_asked_blank' }, { trust: -1 }),
          o('他说签不签随你', '他把单子推回来，说不签就让下一个人来。\n\n你签了，补贴少一半。\n\n他站在你身后，没有说话。', { sign: 'half' }, { money: 6000, mind: -2, flag: 'wr_hatch_asked_refused' }, { trust: 1 })),
        o('把单子推回去', '你把单子推到桌沿，纸角翘起来又落下。\n\n教官叫了下一个名字。\n\n那一批出发时，那个编号没有出现在队伍里。', { sign: 'refused' }, { mind: -1, flag: 'wr_hatch_refused_sign' }, { trust: -2, goto: 2 }),
      ]],
    ['墙上那张纸',
      S => '送交单交上去以后，走廊尽头贴出一张纸。\n\n纸上只有编号，一个编号后面一个格子。\n\n格子里先是铅笔的横，过一会儿有人来改成叉。\n\n' + NM(S, 'r_hatch_mate') + '站在你旁边，一个一个数过去。\n\n“叉就是不用等了。”他说。',
      [
        o('站到换班再走', '你站到墙上的灯换成另一盏。\n\n最后一个格子被划掉的时候，走廊里已经没有人。\n\n回去的路上他买了一瓶水，分成两半。', { waited: 'till' }, { body: -2, mind: -1, flag: 'wr_hatch_waited_wall' }, { trust: 1, goto: 3 }),
        o('回去干活，明天再看', '第二天那张纸被撕掉了，新的贴在同一个位置。\n\n你没有找到昨天那个编号。\n\n午饭后点名，人数比上周少了两个。', { waited: 'left' }, { merit: 1, money: 4000, flag: 'wr_hatch_left_wall' }, { trust: -1 }),
        c('问他叉有没有改回来的', 'social', 44,
          o('他说有过一次', '“就一次。”他说，“那人回来以后不认得自己的编号。”\n\n他说完就不往下说了。\n\n你们站到灯换颜色。', { waited: 'story' }, { mind: -2, wit: 2, flag: 'wr_hatch_heard_x_back' }, { trust: 2 }),
          o('他说别问这些', '他把手插进口袋，往楼梯口走。\n\n你在纸前面又站了一会儿，才想起自己也从那张纸上走过。', { waited: 'shut' }, { mind: -1, flag: 'wr_hatch_question_shut' }, { trust: -1 })),
      ]],
    ['回来的三个',
      '这一批进去四个，出来三个。\n\n第三个站在门口不进来，一直数自己的手指。\n\n数到第七根，他就从头再数一遍。\n\n同批的人说别管，点完名就收工。',
      [
        o('去把护士叫来', '护士来得很快，把他带到走廊另一头。\n\n另外两个自己换了衣服。\n\n其中一个把柜门关得很响。', { comeback: 'nurse' }, { money: -3000, mind: -2, flag: 'wr_hatch_called_nurse' }, { trust: -1 }),
        o('照规矩点名，让他自己站进队', '队列里没人给他让位置，他自己挤了进去。\n\n点名时他答了“到”，答得比谁都快。\n\n那天没有人体检不合格。', { comeback: 'queue' }, { merit: 1, money: 2000, mind: -3, flag: 'wr_hatch_counted_him' }, { trust: 1 }),
        c('握着他的手腕，让他数你的手指', 'mind', 48,
          o('他顺着数到了十', '数到十的时候他抬头看你，眼里有一点认出人的意思。\n\n他跟着你走回队列。\n\n第二天他仍不会扣护具。', { comeback: 'counted' }, { body: -1, mind: 1, flag: 'wr_hatch_counted_ten' }, { trust: 2, goto: 4 }),
          o('他甩开了你的手', '他退了半步，把手指捏成拳头藏到背后。\n\n教官在走廊那头叫编号，他自己走过去了。\n\n你留在原地，手里还留着他腕骨的印。', { comeback: 'shook' }, { mind: -2, body: -1, flag: 'wr_hatch_shook_off' }, { trust: -1, goto: 4 })),
      ]],
    ['装备柜',
      '回来的三个人在器械间换衣服。\n\n其中一个护具扣了三次，每次都反着。\n\n他的编号打在领口，字是对的。\n\n柜门上写的尺码，比他身上那套大两号。',
      [
        o('替他把扣子扣好', '扣好以后他低头看了很久，像在确认这东西长在谁身上。\n\n他没有说谢，只问明天几点点名。\n\n你把时间报给他，他重复了一遍。', { gear: 'helped' }, { body: -1, mind: -1, flag: 'wr_hatch_buckled' }, { trust: 1 }),
        c('去仓库换一套合身的', 'wit', 45,
          o('旧账上那一格填反了', '仓库的人翻出旧账，那一格的数字确实颠倒了。\n\n换回来的尺码刚好。\n\n他穿上以后第一次自己扣好了扣子。', { gear: 'fitted' }, { money: -2000, wit: 2, flag: 'wr_hatch_fixed_size' }, { trust: 2 }),
          o('仓库说这个月不再发', '你在窗口站到下班。\n\n回去时他已经把那套大的穿惯了，袖子卷了两折，用胶带粘住。\n\n胶带是护士给的。', { gear: 'big' }, { mind: -2, flag: 'wr_hatch_size_refused' }, { trust: -1 })),
        o('回宿舍，不插手', '你从他背后走过去，柜门关得很轻。\n\n第二天他还在器械间，扣子仍旧扣反着。\n\n没有人再提这件事。', { gear: 'left' }, { mind: -1, merit: 1, flag: 'wr_hatch_left_gear' }, { trust: -1 }),
      ], 1],
    ['第二批',
      '第二年春天，又一张送交单。\n\n同一栏，同样空着。\n\n同批的人把笔搁在纸上，没有推给你，也没有说话。\n\n走廊尽头那张纸换了新的，编号只写了一半。',
      [
        o('签，自己去把那一格量了', '你借了软尺，替那个编号量脚长和肩宽。\n\n单子被退回来重打，补贴扣掉一半。\n\n第二批进去那天，那个人脚上有靴子。', { second: 'filled' }, { money: -6000, wit: 1, flag: 'wr_hatch_filled_second' }, { trust: -1 }),
        o('签，照上次一样空着交上去', '你签在经手人那一栏，字比去年大了一点。\n\n贴出来的纸上，那一格很快画了叉。\n\n补贴当天到账。', { second: 'blank' }, { money: 12000, mind: -2, flag: 'wr_hatch_blank_second' }, { trust: 1 }),
        o('不签，把笔还给他', '你把笔放在纸上，没有拿起来。\n\n他自己签了，签完看了你一眼。\n\n那年的取暖费由几个人平摊，少了你那份补贴，你只能自己补上。', { second: 'refused' }, { mind: 2, money: -3000, flag: 'wr_hatch_refused_second' }, { trust: -2 }),
      ], 3],
    ['同批的人',
      S => {
        const v = d(S, 'r_hatch');
        const tail = v.second === 'filled' ? '第二批里那个编号，后来一直留在点名册上，没有被划掉。'
          : v.second === 'blank' ? '第二批里那个编号，你只在贴出来的纸上见过一次。'
            : v.second === 'refused' ? '你没有签的那张单子，换了别人的名字。'
              : '后来你没再问过那一格为什么空着。';
        return '又过了几年，走廊尽头那面墙不再贴纸。\n\n' + tail + '\n\n同批的人还在，吃饭时你们坐同一张桌。\n\n他饭前点一次名，饭后再点一次，从来不点自己的。';
      },
      [
        o('和他一起把下一批的编号念完', '你们站在院子里，一个编号一个编号念下去，念到最后一个也没有念错。\n\n没有人抬头。', null, { money: 15000, merit: 1, flag: 'wr_hatch_read_next' }, { trust: 2, end: '你和同批的人把下一批的编号念完，一个也没有念错。' }),
        o('申请调离孵化场这条线', '申请批得很快。\n\n交接那天你把名单和钥匙一起放下。\n\n接手的年轻人问那一格为什么空着，你说照规矩办。', null, { mind: 2, money: -8000, flag: 'wr_hatch_left_line' }, { trust: -1, end: '你调离了孵化场这条线，名单从此由别人经手。' }),
        o('把一张送交单的存根留下', '存根折成四折，塞进内袋。\n\n上面的字过了几年就看不清了，纸还在。\n\n他问过一次那是什么，你说是一张收据。', null, { wit: 1, money: 5000, flag: 'wr_hatch_kept_stub' }, { trust: 1, end: '你把一张送交单的存根留了很多年，纸上的字早就看不清了。' }),
      ]],
  ]);

  // ============ 故事包 2：名册上的资格（n_nail） ============
  p({ id: 'n_nail', pack: 'B10', title: '名册上的资格', route: 'wing_N', person: 'n_inquisitor', theme: '规矩', age: [20, 55], sources: ['S19'] }, [
    ['复核单',
      S => '登记台的玻璃上有一道旧裂纹。\n\n' + NM(S, 'n_inquisitor') + '把一张复核单从窗口底下推进来，指甲在纸面上刮了一下。\n\n单子上三个名字，后面各空一栏。\n\n“核一下还在不在营养剂名册上。”他说，“在册的，我带走。”\n\n他没有说不在册的会怎么样。',
      [
        o('照名字一栏一栏核', '三个人都在册。你把“在”写进三栏，盖了章。\n\n他收起单子，把三支营养剂留在窗台上。\n\n“给他们的。”他说完就走。', { first: 'all' }, { money: 4000, merit: 1, flag: 'wn_nail_named_three' }, { trust: 1 }),
        o('把最后那个名字划掉', '你把笔尖压在那一栏上划了一道。\n\n他看了那道划痕，点了点头。\n\n“那就两个。”\n\n那一栏后面照旧空着。', { first: 'erased' }, { money: 4000, mind: -3, flag: 'wn_nail_erased_name' }, { trust: -1 }),
        c('问不在册的算什么', 'social', 46,
          o('他说不在册的不算在里面', '他说得很平常，像在说一件办公用品。\n\n“名册上没有的，审判官不管。”\n\n他把单子抽回去，让你重核一遍。', { first: 'asked' }, { wit: 2, mind: -2, flag: 'wn_nail_learned_rule' }, { trust: 1 }),
          o('他让你只管核', '他把手指在窗口上敲了两下。\n\n后面等着的人往前挪了一步。\n\n你核完三个名字，盖章的时候手很稳。', { first: 'shut' }, { mind: -1, money: 4000, flag: 'wn_nail_rule_shut' }, { trust: -1 })),
      ]],
    ['发放日',
      '营养剂十五号发，铝管上压着编号，一管顶一天。\n\n队伍从走廊排到楼梯口，没有人说话。\n\n排到一半，前面有人被叫出队伍：册子上找不到他的门牌。\n\n他手里还捏着上个月的铝管，捏得变了形。',
      [
        o('翻册子替他补上门牌', '你在那一行补了三个字，是搬过一次的旧号。\n\n铝管发下去，他低头就咬开了。\n\n审判官在队尾翻了一页，什么也没说。', { issue: 'fixed' }, { body: -1, wit: 1, flag: 'wn_nail_fixed_door' }, { trust: -1, goto: 3 }),
        o('照册子办，让开路', '他被请到走廊另一头，队伍很快接上。\n\n他的铝管留在台面上，编号朝上。\n\n审判官走过来，用两根手指把它夹走。', { issue: 'removed' }, { money: 3000, mind: -3, flag: 'wn_nail_let_him_go' }, { trust: 1 }),
        c('把自己那一支先给他', 'mind', 46,
          o('他接过去，没有看你', '你把铝管塞进他手里，让他先咬开。\n\n登记员看见了，什么也没记。\n\n这个月你少一支，下个月不会补。', { issue: 'gave' }, { body: -3, mind: 1, flag: 'wn_nail_gave_ration' }, { trust: -1 }),
          o('他把手背到身后', '他退了半步，不敢接。\n\n审判官在队尾看着这边，看了很久。\n\n你手里那支铝管一直没有送出去。', { issue: 'refused' }, { mind: -2, flag: 'wn_nail_ration_refused' }, { trust: -1 })),
      ]],
    ['铁皮箱',
      '走廊拐角挂着一只铁皮箱，投口边缘磨得发亮。\n\n每天早上都有人往里塞纸，塞的时候用袖子挡着。\n\n今天箱口露出一角，纸比普通的厚，上面两个字是你认得的笔迹。',
      [
        o('把那张纸抽出来', '纸上是你的名字和门牌。\n\n写字的人把“经常”写成了“经长”，这个错字你见过很多次。\n\n你把纸捏在手里，走到走廊尽头才想起松手。', { box: 'own' }, { mind: -4, wit: 1, flag: 'wn_nail_found_own' }, { trust: -1, goto: 4 }),
        o('把整个箱子交给审判官', '他接过去，没有打开，先掂了掂。\n\n“今天比昨天多。”\n\n第二天箱子换了一只新的，投口更窄。', { box: 'handed' }, { money: 5000, mind: -2, flag: 'wn_nail_handed_box' }, { trust: 2 }),
        o('不碰，照常上楼', '你从箱子旁边走过去，脚步放得很匀。\n\n纸角在你身后翘着，一直翘到中午。\n\n下午再路过，它已经不在了。', { box: 'left' }, { mind: -1, flag: 'wn_nail_left_box' }, { trust: -1 }),
      ], 0],
    ['资格确认',
      '复核单换成了正式的一页，下面排着一整栏名字。\n\n审判官把印章放在纸边上，没有先按下去。\n\n“签了这一栏，他们三个就按规矩办。”\n\n“不签也行。”他说，“换个人来签。”',
      [
        o('签字，把章按下去', '你签在经手人那一栏，章按得很正。\n\n他把纸对折，折痕压在名字上。\n\n“你签字比上一个工整。”', { confirm: 'signed' }, { money: 12000, merit: 2, mind: -3, flag: 'wn_nail_signed_confirm' }, { trust: 2 }),
        o('不签，让他换人', '他把纸收回去，没有生气。\n\n“会换的。”\n\n第二天那张纸上换了别人的字，比你签得还快。', { confirm: 'refused' }, { money: -5000, mind: 2, flag: 'wn_nail_refused_confirm' }, { trust: -2 }),
        c('先核这一栏里的第三个人', 'wit', 48,
          o('第三个已经不在册上', '你翻出名册，指给他看：这一行三个月前就划掉了。\n\n他把那一栏划掉。\n\n“少一个。”他说，“下次核清楚再来。”', { confirm: 'checked' }, { wit: 2, mind: -1, flag: 'wn_nail_caught_dead' }, { trust: 1, goto: 5 }),
          o('册子正好缺了这一页', '你翻了两遍，缺的那一页就是他要的那一栏。\n\n“那就按单子办。”他把印章按下去，又把纸推给你。\n\n你按了第二个章。', { confirm: 'missing' }, { mind: -3, merit: 1, flag: 'wn_nail_missing_page' }, { trust: -1 })),
      ]],
    ['轮到你了',
      S => {
        const v = d(S, 'n_nail');
        const before = v.box === 'own' ? '那张纸最后还是进了档案柜，只是经手人那一栏换成了别人。'
          : v.box === 'handed' ? '你交上去的铁皮箱，后来在名单上留下一整页名字。'
            : '检举箱那几个月比平时满，纸一张比一张厚。';
        return before + '\n\n名单换了新的一页，你的名字排在第四个。\n\n登记台的抽屉被清空了，锁挂在一边。\n\n' + NM(S, 'n_inquisitor') + '站在窗口外面，手里没有复核单。';
      },
      [
        o('自己走过去', '你把抽屉钥匙放在台面上，跟他走。\n\n走廊很长，两侧的门都关着。\n\n走到一半他放慢半步，让你走在前面。', { last: 'walked' }, { mind: -3, body: -2, flag: 'wn_nail_walked_self' }, { trust: 2 }),
        o('先问他名册上还有没有我', '他停了一下。\n\n“有。”他说，“所以我才来。”\n\n这句话让你把腿迈了出去。', { last: 'asked' }, { wit: 2, mind: -2, flag: 'wn_nail_asked_roster' }, { trust: 1 }),
        c('回登记台把自己的那一页撕下来', 'wit', 50,
          o('撕下来的只有半张', '半张上编号和门牌都在，名字被裁掉了。\n\n他接过去看了一眼，放进口袋。\n\n“那你还算在册。”', { last: 'torn' }, { wit: 2, money: -3000, flag: 'wn_nail_tore_page' }, { trust: 1 }),
          o('抽屉是空的', '名册前一天夜里就被调走了。\n\n你摸到抽屉底，摸到一枚旧印章。\n\n他把抽屉替你关上。', { last: 'empty' }, { mind: -3, body: -1, flag: 'wn_nail_empty_drawer' }, { trust: -1 })),
      ], 1],
    ['冬天',
      S => {
        const v = d(S, 'n_nail');
        const mid = v.last === 'walked' ? '走廊的灯一盏一盏亮起来，你跟在他后面走。'
          : v.last === 'asked' ? '他在前面走，你在后面数自己的脚步。'
            : v.last === 'torn' ? '撕下来的半张纸塞在内袋，纸边硌着肋骨。'
              : v.last === 'empty' ? '空抽屉的味道留在手上，是铁和灰。'
                : '那张单子少了一个人，被退回来重打。';
        return '冬天来得比往年早。\n\n' + mid + '\n\n营养剂还是十五号发，铝管上的编号换了一套。\n\n登记台的玻璃裂纹还在，只是比去年长了半寸。';
      },
      [
        o('把名册上自己那一行重新抄正', '你照册子的格式重抄了一遍，字比原来正。\n\n抄完盖章，章按得很准。\n\n第二天你照常上班，没有人问起那份单子。', null, { money: 8000, mind: 1, flag: 'wn_nail_rewrote_own' }, { trust: 1, end: '你留在登记台，名册上你自己那一行是你抄正的。' }),
        o('跟着他走过那条走廊', '走廊另一头的门开着，里面只有一张桌子和两把椅子。\n\n他把椅子拉开，让你先坐。\n\n桌上的纸是空白的。', null, { mind: -2, money: -2000, flag: 'wn_nail_into_room' }, { trust: 2, end: '你跟着审判官走过那条走廊，名册上你的名字后面添了一个章。' }),
        o('带走营养剂名册的一页', '那一页上有三十七个名字，多数你核过。\n\n纸塞进内袋，比一张钞票厚。\n\n第二天登记台换了新的名册，编号从一排起。', null, { wit: 1, money: -4000, flag: 'wn_nail_took_page' }, { trust: -2, end: '你带走了营养剂名册上的一页，上面有三十七个名字。' }),
      ]],
  ]);

  // ============ 故事包 3：当票上的利息（j_ledger） ============
  p({ id: 'j_ledger', pack: 'B10', title: '最后一把筹码', route: 'wing_J', person: 'j_floor_boss', theme: '生计', age: [20, 58], sources: ['S20'] }, [
    ['当票',
      S => '开门的时候他已经等在门口，手里捏着一张当票，纸边软得像布。\n\n押的是一块表，赎期到今天中午。\n\n利息按天算，他数出来的钱差了七百眼。\n\n' + NM(S, 'j_floor_boss') + '在柜台里面翻账，翻得很慢。\n\n“差得不多。”他说，“你自己定。”',
      [
        o('照规矩，到中午就上柜', '你把话说完，他点了点头，像早就知道。\n\n中午之前他没有再来。\n\n那块表第二天进了柜子第二层，标签换了一个新价。', { ticket: 'closed' }, { money: 6000, mind: -2, flag: 'wj_ledger_closed_ticket' }, { trust: 1 }),
        o('让他补上七百眼再续三天', '你把续期写在票背面，写完吹了吹。\n\n他数了三遍钱，第三遍数完才推过来。\n\n那三天他一次也没来。', { ticket: 'extended' }, { money: 3000, mind: -1, flag: 'wj_ledger_extended_ticket' }, { trust: -1 }),
        c('去查这张票的原始记录', 'wit', 46,
          o('原始记录上还押着表链', '入库那一栏写着怀表一块、附链一条。\n\n出库单上只有表。\n\n他看了很久，说链子早就卖了。\n\n那天表没有上柜。', { ticket: 'checked' }, { wit: 2, money: 2000, flag: 'wj_ledger_found_chain' }, { trust: -1 }),
          o('原始记录缺了那一页', '你翻了半个上午，缺的那页正好是入库那一栏。\n\n中午的钟敲过，票按过期算。\n\n他没有再说话，把票留在柜台上就走了。', { ticket: 'missing' }, { mind: -3, flag: 'wj_ledger_missing_record' }, { trust: 1 })),
      ]],
    ['中午以后',
      '中午的钟响过，表进了柜子第二层，标签上的价是新的。\n\n下午三点他和一个熟人一起进来，站在柜台前看那层柜子。\n\n熟人替他数钱，数得很快。\n\n他一直没有抬头。',
      [
        o('告诉他标签上的价', '你说完，他把钱数到一半就停了。\n\n熟人接过话，说可以先借给他。\n\n两个人走到门口才吵起来，声音压得很低。', { shelf: 'told' }, { money: 3000, mind: -2, flag: 'wj_ledger_told_price' }, { trust: 1 }),
        o('把表取出来，按旧价给他', '你把表推过去，他伸手接得很慢。\n\n熟人那叠钱没有用上，收回口袋里。\n\n出门时他戴上表，走了两步又摘下来看。', { shelf: 'old_price' }, { money: 8000, social: 1, mind: -1, flag: 'wj_ledger_old_price' }, { trust: -1 }),
        c('去后面问主管能不能留一天', 'social', 45,
          o('主管同意留到明天中午', '你把话带到柜台外面。\n\n他站在那儿算了一会儿，算完说不用了。\n\n晚上他又来了。', { shelf: 'held' }, { wit: 1, money: -1000, flag: 'wj_ledger_held_day' }, { trust: 1 }),
          o('主管说标签已经贴了', '标签不能改。\n\n你回去的时候他们已经走了。\n\n柜子第二层空了一格，第二天又满上。', { shelf: 'label' }, { mind: -2, flag: 'wj_ledger_label_fixed' }, { trust: -1, goto: 3 })),
      ], 0],
    ['最后一晚',
      '晚上十点，他把一只信封推上柜台，要换筹码。\n\n信封里的钱刚好够赎那张当票，也刚好够换一盘。\n\n他说先换一盘。\n\n主管在你身后看着，没有出声。',
      [
        o('照数兑给他', '你数出筹码，一枚一枚推过去。\n\n他抓的时候没抓稳，掉了一枚。\n\n弯腰去捡之前，他先在桌上数了一遍。', { chips: 'gave' }, { money: 8000, mind: -2, flag: 'wj_ledger_gave_chips' }, { trust: 1 }),
        c('把他推到当票窗口', 'social', 46,
          o('他站着想了很久', '他把信封收回去，赎了那张票。\n\n表链断过一截，用焊锡接的。\n\n他戴上表，走的时候没有往赌桌那边看。', { chips: 'redeemed' }, { money: 2000, social: 1, flag: 'wj_ledger_redeemed_first' }, { trust: 1 }),
          o('他说你算什么东西', '他把信封按在柜台上。\n\n主管过来把信封收进抽屉，让你回后面清点。\n\n那天他在赌桌边坐到凌晨。', { chips: 'pushed' }, { money: -1000, mind: -2, flag: 'wj_ledger_pushed_him' }, { trust: -1 })),
        o('不兑，让他明天再来', '你把信封推回去，说明天柜台九点开。\n\n他站着没走，站到保安过来。\n\n第二天他没有来。', { chips: 'refused' }, { mind: 1, money: -500, flag: 'wj_ledger_refused_chips' }, { trust: -1, goto: 4 }),
      ], 0],
    ['换锁',
      S => {
        const v = d(S, 'j_ledger');
        const mid = v.chips === 'gave' ? '一盘筹码撑不了多久。凌晨三点他从赌桌边下来，袖口是空的。'
          : v.chips === 'redeemed' ? '那天晚上他没有上赌桌。'
            : v.chips === 'pushed' ? '那一盘的最后几枚，他推给了一个不认识的人。'
              : v.chips === 'refused' ? '你把信封推回去的时候，他的手指在纸边按了很久。'
                : '表走了以后，柜子第二层空了一格。';
        return mid + '\n\n过了几天你去他住的那条街，房东正在换锁。\n\n门里只剩一只空表盒，盒盖内侧粘着一张当票的存根。\n\n房东把盒子递过来，你接住了。';
      },
      [
        o('把表盒收下来', '盒子很轻，里面垫的绒布已经压平了。\n\n你把它带回柜台，放在账本下面。\n\n后来搬过两次家，它一直跟着。', { box: 'kept' }, { mind: 1, money: -2000, flag: 'wj_ledger_kept_box' }, { trust: 1 }),
        o('问房东他欠了几个月', '房东翻出本子，念了一个数。\n\n你把这个数记在当票存根的背面。\n\n那笔钱没有人来收。', { box: 'debt' }, { wit: 1, money: -3000, flag: 'wj_ledger_asked_rent' }, { trust: -1 }),
        o('什么都不接，回柜台', '你下楼的时候，房东把盒子放进了垃圾袋。\n\n第二天柜子第二层又满了。\n\n你再没见过那个编号。', { box: 'left' }, { mind: -1, merit: 1, flag: 'wj_ledger_left_box' }, { trust: -1 }),
      ], 3],
    ['又过了几年',
      '后来的第三年，有人拿着一张当票来柜台，票上的编号你查不到。\n\n来的人说这是他父亲留下的，票背面写着这只柜子的号。\n\n他问还能不能赎。\n\n柜子第二层早就换过三批货。',
      [
        o('替他查那三年的账', '你在旧账里翻到那一页，写着“逾期处理”。\n\n来的人看了很久，把票折好收起来。\n\n他没有再问那块表去了哪。', { later: 'checked' }, { wit: 2, money: -1000, flag: 'wj_ledger_checked_years' }, { trust: 1 }),
        o('告诉他赎不回来了', '你说得很清楚，连期限也一并说清。\n\n他点点头，问能不能看看那只柜子。\n\n柜门打开，里面是别人的东西。', { later: 'refused' }, { mind: -2, money: 1000, flag: 'wj_ledger_told_no' }, { trust: -1 }),
        c('问主管能不能按原票折价', 'social', 48,
          o('主管同意折一半', '你按折价把钱算给他，收回了那张票。\n\n他把钱数了两遍，第二遍数得很慢。\n\n出门前他问，表是不是还有链子。', { later: 'half' }, { money: -6000, social: 1, flag: 'wj_ledger_folded_price' }, { trust: 1 }),
          o('主管说票过期就是纸', '你把话原样带出去。\n\n他把票留在柜台上，没有拿走。\n\n那张纸后来夹进了账本。', { later: 'paper' }, { mind: -2, wit: 1, flag: 'wj_ledger_stub_kept' }, { trust: -1 })),
      ]],
    ['柜子第二层',
      S => {
        const v = d(S, 'j_ledger');
        const mid = v.later === 'half' ? '那张票收回以后，柜子第二层空出半格。'
          : v.later === 'refused' ? '你说赎不回来的那天，他把票留在了柜台上。'
            : v.later === 'checked' ? '那一页“逾期处理”后来你没有再翻过。'
              : v.later === 'paper' ? '那张过期的票夹在账本里，纸比账本还硬。'
                : '三年里柜子换过三批货，你只记得其中一只表盒。';
        return '柜台换了新的玻璃，裂纹没有了。\n\n' + mid + '\n\n主管调去了别的楼层，走之前把柜钥匙交给你。\n\n“别把过期的东西留着。”他说。';
      },
      [
        o('把柜子第二层清空', '你把里面的东西一件件登记，逾期的全部上柜。\n\n清到最后一格，摸到一只空表盒。\n\n你在登记本上写了“表盒一只”。', null, { money: 10000, merit: 1, flag: 'wj_ledger_cleared_shelf' }, { trust: 1, end: '你清空了柜子第二层，登记本上多了一只空表盒。' }),
        o('把那只空表盒留在原处', '盒子放在第二层最里面，标签朝下。\n\n新来的账房问过一次，你说那一格不用清。\n\n这一格留了很多年。', null, { mind: 2, money: -2000, flag: 'wj_ledger_kept_shelf_box' }, { trust: -1, end: '你把一只空表盒留在柜子第二层，标签朝下放了很多年。' }),
        o('把钥匙交回去，不接这一层', '你把钥匙放在主管桌上，说自己只管单据。\n\n他没有劝，把钥匙收进抽屉。\n\n那一层后来换了别人管。', null, { mind: 1, money: -5000, flag: 'wj_ledger_refused_key' }, { trust: -2, end: '你把柜钥匙交了回去，从此只管当铺和赌场之间的单据。' }),
      ]],
  ]);

  // ============ 12 个事件 ============
  C.addEvents('wings4', [
    // —— R公司：4 个 ——
    { id: 'wr_hatch_yard', age: [20, 55], req: R, w: 11, repeat: true, cd: 12,
      text: '送人的车停在院子外面，车厢没有窗，只有一道缝。\n\n上车的人按编号排队，一个个自己爬上去。\n\n最后一个上去之前回头看了一眼。\n\n院子里没有人告诉他要看谁。' },
    { id: 'wr_hatch_sleeve', age: [20, 55], req: R, w: 9, title: '空的那一格',
      text: '仓库发装备，按名单上的尺寸配。\n\n排到一个人的时候，册子上那一格是空的。\n\n仓库的人把一套均码放在台面上，说不合身就自己改。\n\n那人把袖子卷起来两折，又放下。',
      choices: [
        { t: '用休息时间把袖子改好', eff: { body: -2, wit: 1, flag: 'wr_hatch_mended_sleeve' }, r: '你把袖子拆开，照着他的胳膊重新缝。\n\n线是仓库里最粗的那种，缝完扎手。\n\n他穿上试了一次，把手臂举到与肩齐。' },
        { t: '替他向仓库要一套新的', check: { s: 'social', dc: 44 },
          ok: { r: '仓库的人翻了很久的账，从最下面抽出一套。\n\n“下不为例。”\n\n那套衣服上没有编号，他穿了两天才被人问起。', eff: { money: -1500, social: 1, flag: 'wr_hatch_new_gear' } },
          no: { r: '仓库把册子合上，说空着的那一格本来就不该有装备。\n\n第二天他仍穿着均码，袖口是胶带粘住的。\n\n胶带是他自己带来的。', eff: { mind: -2, flag: 'wr_hatch_gear_refused' } } },
        { t: '照册子发，不多说', eff: { merit: 1, money: 4000, mind: -1 }, r: '你在那一格下面写了一个“无”。\n\n名单交上去，月底的补贴多算了半天。\n\n那套衣服他穿到换季。' },
      ] },
    { id: 'wr_hatch_slot', age: [20, 55], req: R, w: 9, title: '顶上去的位置',
      text: '训练场上少一个人，名单上那一行被划掉了。\n\n教官问你要不要顶他的位置，顶的话这一轮补贴照满算。\n\n那个位置在最前面。\n\n旁边的人在调护具的带子，调得很慢。',
      choices: [
        { t: '顶上去', eff: { money: 9000, body: -4, skill: 1, merit: 1 }, r: '你站到最前面，护具的带子勒进肩窝。\n\n这一轮下来，内侧磨出一道白痕。\n\n补贴到账那天，划掉的那一行换了新名字。' },
        { t: '问那个位置原来是谁的', check: { s: 'wit', dc: 42 },
          ok: { r: '名册上这一行的号码是后补的，笔迹和别的行不一样。\n\n你把这件事记在心里，没有说出去。\n\n那天你没有顶。', eff: { wit: 2, mind: -1, flag: 'wr_hatch_patched_row' } },
          no: { r: '教官报了个编号，报得很快。\n\n你没记住。\n\n下午点名，那个编号没有出现在任何一队里。', eff: { mind: -2 } } },
        { t: '推掉，说自己护具不合', eff: { money: -2000, body: 1, flag: 'wr_hatch_stepped_back' }, r: '教官看了你一眼，把你的名字挪到下一轮。\n\n医务室给你换了副新带子，收工本费两千眼。\n\n下一轮的补贴少一档。' },
      ] },
    { id: 'wr_hatch_wait', age: [20, 55], req: R, w: 8, title: '批次名单',
      text: '又一批送进去了，名单贴在更衣室门后。\n\n你在那张纸前面站着，看编号一行行往下排。\n\n排到最后一个，纸就没了。\n\n哨声在走廊那头响起来。',
      choices: [
        { t: '等第一批的消息', eff: { queue: ['wr_hatch_back', 6], flag: 'wr_hatch_waited_batch', mind: -1 }, r: '你每天下班都去看那张纸。\n\n铅笔的横线一天比一天多。\n\n第六天，纸被撕走了。' },
        { t: '把编号抄进本子', eff: { queue: ['wr_hatch_back', 6], wit: 1, flag: 'wr_hatch_copied_batch' }, r: '你抄下最后七个编号，抄得很小。\n\n本子塞进内袋的时候，纸边硌着肋骨。\n\n第二年你才又翻开它。' },
      ] },
    { id: 'wr_hatch_back', manual: true, age: [20, 70], req: R, w: 1,
      text: '六年后，更衣室门后那面墙重新刷过漆。\n\n一个陌生人在门口叫你，报出一个编号，问是不是你写的。\n\n那是你本子上最后一个。\n\n他说他出来了，问你还记不记得那张纸。',
      eff: { mind: 2, flag: 'wr_hatch_name_back' } },

    // —— N公司：4 个 ——
    { id: 'wn_nail_tube', age: [20, 55], req: N, w: 11, repeat: true, cd: 12,
      text: '营养剂十五号发，铝管上压着编号，一管顶一天。\n\n领的时候要报门牌，报错了就记在另一栏。\n\n今天有个门牌报错了两次。\n\n第二次他自己改正，改得很顺。' },
    { id: 'wn_nail_steps', age: [20, 55], req: N, w: 10, repeat: true, cd: 13,
      text: '队伍从走廊排到楼梯口，没有人说话。\n\n有个人的鞋跟在响，响了很久才停。\n\n前面的人回头看了一次，又转回去。\n\n整条队伍里只剩一个脚步声。' },
    { id: 'wn_nail_slip', age: [20, 55], req: N, w: 9, title: '折成四折的纸',
      text: '铁皮箱的投口每天清一次，清出来的纸要登记。\n\n今天有一张折成四折，纸很硬。\n\n登记完这张纸该进档案柜。\n\n柜门开着，里面已经放了很多同样硬的纸。',
      choices: [
        { t: '照流程登记，写清经手人', eff: { money: 5000, merit: 1, flag: 'wn_nail_logged_slip' }, r: '你写了自己的工号，写完盖章。\n\n柜门关上前，你看见最上面那张纸的日期是今天。\n\n同一天，同一种折法。' },
        { t: '把折痕拆开看一眼', check: { s: 'mind', dc: 45 },
          ok: { r: '里面是两行字，一个门牌，还有一个“常”字。\n\n你把纸按原样折回去。\n\n折痕对得很准，纸角却比原来软了。', eff: { wit: 2, mind: -3, flag: 'wn_nail_read_slip' } },
          no: { r: '纸太硬，折痕撕开一道口子。\n\n你把口子压在下面交上去。\n\n第二天有人来问这张纸是谁经手的。', eff: { mind: -2, flag: 'wn_nail_torn_slip' } } },
        { t: '原样放进柜子，不登记', eff: { mind: -1, flag: 'wn_nail_slip_unlogged' }, r: '你把纸推进去，柜门合上。\n\n当天下午清点，数目少了一张。\n\n没有人问少的是哪一张。' },
      ] },
    { id: 'wn_nail_echo', age: [20, 55], req: N, w: 8, title: '钉子压着的名字',
      text: '登记台下面压着一枚旧钉子，钉帽磨圆了。\n\n上一任经手人留下的，谁也没扔。\n\n单子太多压不住的时候，就拿它压着。\n\n今天单子上有一个名字，你认得。',
      choices: [
        { t: '照核，把名字报上去', eff: { queue: ['wn_nail_back', 5], money: 6000, merit: 1, flag: 'wn_nail_reported_name' }, r: '你把“在册”写在那一栏。\n\n钉子压在纸角上，压得很稳。\n\n他的营养剂下个月还会发，发到哪一天你不知道。' },
        { t: '把名字从册子上划掉', eff: { queue: ['wn_nail_back', 5], money: -3000, mind: -2, flag: 'wn_nail_struck_name' }, r: '你划的时候用了直尺，划得很直。\n\n那一栏空出来，营养剂照发。\n\n他从此不在任何一份复核单上。' },
      ] },
    { id: 'wn_nail_back', manual: true, age: [20, 70], req: N, w: 1,
      text: '五年后，走廊尽头的墙换了新名单。\n\n一个不认识的人来登记台找你，报的是他父亲的门牌。\n\n他说父亲最后那几年一直领营养剂。\n\n“所以他还算在册，对吧。”',
      eff: { mind: 1, flag: 'wn_nail_son_asked' } },

    // —— J公司：4 个 ——
    { id: 'wj_ledger_soft', age: [20, 58], req: J, w: 11, repeat: true, cd: 12,
      text: '柜台底下压着一叠过期当票，纸都发软了。\n\n最上面那张的赎期是三年前，押的是一枚戒指。\n\n戒指早就卖了，票还留着。\n\n有人问起，就说找不到了。' },
    { id: 'wj_ledger_interest', age: [20, 58], req: J, w: 8, title: '写满的格子',
      text: '当票的利息一天一算，写在票背面那些小格子里。\n\n有人的格子写满了，续到第三张纸。\n\n今天他带来一只旧表盒，说盒子也算。\n\n盒子是空的。',
      choices: [
        { t: '把空盒收下，记进抵押栏', eff: { queue: ['wj_ledger_interest_back', 4], money: 3000, flag: 'wj_ledger_took_box' }, r: '你在抵押栏写了“表盒一只”。\n\n写完自己看了一眼，把“空”字划掉。\n\n利息续上了三天。' },
        { t: '不收，让他把盒子带回去', eff: { queue: ['wj_ledger_interest_back', 4], money: -1000, mind: 1, flag: 'wj_ledger_refused_box' }, r: '他把盒子抱在怀里走了。\n\n那张当票过期了，表进了柜子第二层。\n\n盒子还给他留着。' },
      ] },
    { id: 'wj_ledger_interest_back', manual: true, age: [20, 70], req: J, w: 1,
      text: '四年后，有人来柜台问一只表盒。\n\n他说盒盖内侧粘着一张很小的纸条，是当票的复印件。\n\n他说父亲去年走了，盒子是整理东西时找到的。\n\n“这个能抵多少。”',
      eff: { money: 2000, mind: -1, flag: 'wj_ledger_box_back' } },
    { id: 'wj_ledger_stub', age: [20, 58], req: J, w: 8, title: '地上的存根',
      text: '凌晨两点，赌场里只剩三桌。\n\n收筹码的托盘压在手上有点沉，边沿磨得发亮。\n\n地上有一张掉落的当票存根，被踩过。\n\n编号你认得。',
      choices: [
        { t: '把存根捡起来，夹进账本', eff: { queue: ['wj_ledger_stub_back', 7], wit: 1, mind: -1, flag: 'wj_ledger_kept_stub' }, r: '你把存根上的鞋印擦掉。\n\n纸被踩得很软，夹进账本时压出一道折。\n\n这张存根在账本里放了很多年。' },
        { t: '扫进簸箕，一起倒掉', eff: { queue: ['wj_ledger_stub_back', 7], money: 4000, mind: 1, flag: 'wj_ledger_swept_stub' }, r: '簸箕里的东西倒进后巷的桶。\n\n托盘清点完，你多拿了半班的车钱。\n\n回柜台时，那三桌已经散了。' },
      ] },
    { id: 'wj_ledger_stub_back', manual: true, age: [20, 70], req: J, w: 1,
      text: '七年后，赌场换了地毯。\n\n新来的账房抱来一摞旧账，问哪些还要留着。\n\n里面有没有那张存根，你没有翻。\n\n“都扔了吧。”有人说。',
      eff: { mind: 1, flag: 'wj_ledger_stub_gone' } },
  ]);
})();
