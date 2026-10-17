/* 带出来的人（批次 25）：你教过的那个人回来找你。
 * 入口只要求“你教过谁一件具体的事”，三条前情（事务所新人、面摊掌勺、工坊学徒）会走到同一次见面。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const TAUGHT = { anyflag: ['of_taught_bandage', 'of_passed_on', 'lu_apprentice', 'taught_apprentice', 'of_covered_junior', 'of_junior_stayed', 'cmn_found_key', 'e2_gave_work', 'fed_thief', 'cmn_took_child_in', 'of_told_him_rules'] };

  p({ id: 'mentor_return', pack: 'B25', title: '他带回来的东西', route: 'human', person: 'mentor_child', theme: '前情', age: [30, 75], sources: ['S01'], req: TAUGHT, fixture: S => { S.flags.of_taught_bandage = true; } }, [
    ['门口的人',
      S => (S.flags.of_taught_bandage || S.flags.of_covered_junior || S.flags.of_junior_stayed ? '门口站着一个穿旧外套的年轻人，手里拎着两瓶酒。\n\n“你不记得我。”他说，“你给我缠过一次绷带。”\n\n他把袖子卷起来，露出手腕内侧——绊的方向是对的。'
        : S.flags.lu_apprentice ? '门口站着一个年轻人，手里端着一只搪瓷碗，碗里是汤。\n\n“按你写的加。”他说，“三种料，顺序没错。”\n\n碗沿有一道缺口。'
        : '门口站着一个年轻人，手里拿着一块磨过的铁片。\n\n“这个位置。”他指着铁片边缘，“你说过，磨到这里就该停。”\n\n铁片很薄，透光。'),
      [
        o('让他进来', '他进门时在门口蹭了两下鞋，蹭得很仔细。\n\n他把东西放在桌上，坐得笔直。', { met: 'in' }, { mind: 1 }),
        o('在门口听他说完', '他说了很长时间，中间没有停。\n\n楼道里的灯灭了一次，又亮起来。', { met: 'door' }, { mind: -1 }),
        o('说记错了，不是我', '他愣了一下，把东西收回手里。\n\n“那可能是我记错了。”\n\n他下楼的时候，脚步很轻。', { met: 'deny' }, { mind: -2 }, { end: '你没有认那个人，他拎着东西走了。' }),
      ]],
    ['他学的那件事',
      S => (S.flags.of_taught_bandage ? '“后来我又给三个人缠过。”他说，“有一个没救回来。”\n\n“缠得没错。”他说，“是伤太重。”'
        : S.flags.lu_apprentice ? '“我照着那张纸做了两年。”他说，“第一年难吃，第二年有人说像。”\n\n“第三年，我把水加多了。”'
        : '“我磨坏了四个。”他说，“第五个才停在对的地方。”\n\n他把铁片翻过来，背面有一道很深的划痕。'),
      [
        o('问他现在做什么', '他说在一家小厂里做活，不忙的时候替人修东西。\n\n“跟你那会儿一样。”他说。', { asked: 'work' }, { wit: 1 }),
        o('问他为什么来', '他把手里的东西往前推了推。\n\n“我一直想问一句。”他说，“当时你为什么教我。”\n\n他说完就不看你了。', { asked: 'why' }, { mind: -1 }),
        c('问他那三年最难的是哪一段', 'social', 44,
          o('他说是第二年冬天', '“没有人来买。”他说，“我站在摊子后面，一站站一天。”\n\n“那时候我想，教我的人是不是也这样站过。”', null, { wit: 2, mind: 1, flag: 'mentor_heard_winter' }, { trust: 1 }),
          o('他说记不清了', '“反正过来了。”\n\n他把酒瓶的封口转了两圈。', null, { mind: -1 })),
      ]],
    ['他要还的东西',
      '他从口袋里摸出一样东西，放在桌上。\n\n不是钱。是你当年给他的那件：一把旧工具、一张方子、或者一块用过的手套。\n\n“我用完了。”他说。',
      [
        o('收下', '东西回到手里，比记忆里轻。\n\n“还能用。”他说，“我修过。”', { back: 'kept' }, { wit: 1, item: 'mentor_tool', flag: 'mentor_took_back' }, { trust: 1 }),
        o('让他留着', '他没有推辞，把它揣回口袋。\n\n“那我以后再给人。”他说。', { back: 'gave' }, { mind: 2, flag: 'mentor_left_it' }, { trust: 2 }),
        o('问他用坏了没有', '他笑了一下，说“坏过三次”。\n\n“每次都是我修好的。”\n\n他说这话的时候，语气和当年你教他时一样。', { back: 'asked' }, { wit: 2, flag: 'mentor_fixed_thrice' }),
      ]],
    ['他走以后',
      S => (S.flags.mentor_left_it ? '他走后，桌上留着一小片磨下来的铁屑。\n\n不是他带来的，是那件东西本来就在掉。' : '他走后，你把那件东西放在手里翻了两遍。\n\n它上面多了一道不属于你的划痕。') + '\n\n窗外有人在收摊，铁架拖过地面，声音很长。',
      [
        o('把它放回工具盒里', '你把它放在最上面，和别的放一起。\n\n盒子合上的时候，里面的东西互相碰了一下。', null, { mind: 1, flag: 'mentor_stored' }, { end: '你把他还回来的东西放回工具盒最上面。' }),
        o('打开窗，让收摊的声音进来', '铁架声停了一会儿，又响起来。\n\n你站在窗边，看了很久。', null, { mind: 2, flag: 'mentor_at_window' }, { end: '你打开窗听了一会儿收摊的声音。' }),
      ]],
  ]);

  C.addEvents('mentor', [
    { id: 'mt_second_hand', age: [30, 85], w: 11, repeat: true, cd: 13,
      text: '你用的那把工具换了一次柄。\n\n新柄比旧的粗一点，握久了手会酸。\n\n你还是用着，没有换回去。' },
    { id: 'mt_someone_watching', age: [28, 80], w: 10, repeat: true, cd: 13,
      text: '有人在你看不见的地方学你的手法。\n\n你后来在别处看到同样的动作，做得很生，但方向是对的。\n\n你没有过去纠正。' },
    { id: 'mt_old_note', age: [30, 85], w: 9, repeat: true, cd: 14,
      text: '一张旧便条贴在柜门内侧，字被油烟熏黄。\n\n上面写着三行步骤，第三行被人用笔加了一句“别省火”。\n\n不是你写的。' },
    { id: 'mt_young_hands', age: [34, 85], w: 9, repeat: true, cd: 14,
      text: '一个年轻人来问路，问的是你以前常去的那条巷。\n\n你说那条巷子去年封了。\n\n他说“那我再找找”，走得很快。' },

    { id: 'mt_ask_teach', age: [32, 78], w: 10, title: '能不能教',
      text: '有人来问你，能不能教他做你手上这活。\n\n他说不要工钱，只要跟着看。\n\n他手上全是旧茧，不是新手。',
      choices: [
        { t: '教他，但要他自己上手', eff: { social: 1, mind: 2, flag: 'mt_taught_again' }, r: '第一天他做坏了三件。\n\n第二天做坏一件。\n\n第三天他做完一件，捧着它看了很久才放下。' },
        { t: '让他先干三个月杂活', eff: { money: 3000, flag: 'mt_hard_apprentice' }, r: '他扫了三个月地，一句话也没抱怨。\n\n第四个月开始，他才被允许碰工具。' },
        { t: '说不教', eff: { mind: -1 }, r: '他点点头，走了。\n\n过了一个月，你在街对面看见他跟着另一个人学，学的不是这一行。' },
      ] },

    { id: 'mt_his_failure', age: [36, 80], w: 9, title: '他搞砸了',
      text: '你教过的那个人把一件事做坏了。\n\n不是手艺的问题，是他为了赶时间省了一步。\n\n他站在门口，等你说话。',
      choices: [
        { t: '让他自己回去补', eff: { mind: 1, flag: 'mt_sent_back' }, r: '他第二天回来的时候，手上多了一道新的口子。\n\n“补好了。”他说。\n\n你没有问他是怎么补的。' },
        { t: '替他补上', check: { s: 'skill', dc: 46 },
          ok: { r: '你做完，他一直在旁边看。\n\n“这一步我当时没想到。”他说。\n\n“我教过。”你说。', eff: { skill: 1, social: 1, flag: 'mt_fixed_for_him' } },
          no: { r: '你也补不好。\n\n两个人对着那件东西站了很久，最后还是把坏的留下了。', eff: { mind: -2 } } },
        { t: '骂他一顿', eff: { social: -1, mind: -1, flag: 'mt_scolded' }, r: '他站着没吭声，等你骂完。\n\n“我知道了。”他说。\n\n他后来再没做过那一步。' },
      ] },

    { id: 'mt_his_name_used', age: [38, 85], w: 9, title: '有人提起你的名字',
      text: '你听说有人在外面提起你，说是跟你学的。\n\n说的那件事你没教过。\n\n传话的人问你，是不是有这么回事。',
      choices: [
        { t: '说没有', eff: { mind: 1, flag: 'mt_denied_link' }, r: '传话的人点点头，走了。\n\n后来那个名字还在传，只是不再挨着你。' },
        { t: '说有，但更正那一条', check: { s: 'social', dc: 44 },
          ok: { r: '你说清了自己教过什么，没教过什么。\n\n传话的人听完，把这两句分开记了。', eff: { wit: 2, social: 1, flag: 'mt_corrected' } },
          no: { r: '你说了很多，越说越像辩解。\n\n对方最后只说了一句“知道了”。', eff: { mind: -2, social: -1 } } },
        { t: '不管', eff: { mind: -1 }, r: '你什么也没说。\n\n那件事后来变成了另一个样子，和你已经没有关系。' },
      ] },

    { id: 'mt_gift_back', age: [36, 85], w: 8, title: '他送来的东西',
      text: '门口放着一只纸袋，里面是他做的第一件成品。\n\n做得很粗，边角没磨平。\n\n袋子上写着一行字：“做坏了九件，这是第十件。”',
      choices: [
        { t: '留着', eff: { queue: ['mt_gift_back2', 8], item: 'mentor_tool', mind: 2, flag: 'mt_kept_gift' }, r: '你把它放在柜子上，边角朝里。\n\n每过一阵就得挪一次位置，免得积灰。' },
        { t: '用它', eff: { queue: ['mt_gift_back2', 8], wit: 1, skill: 1, flag: 'mt_used_gift' }, r: '边角硌手，你用布缠了两圈。\n\n用久了，缠布的地方磨出了光。' },
      ] },
    { id: 'mt_gift_back2', manual: true, age: [44, 95], w: 1,
      text: '八年后，那件东西还在。\n\n边角被你磨过、补过，和当初他送来时已经不一样。\n\n有客人问这是谁做的，你说“一个学的人”。',
      eff: { mind: 2, flag: 'mt_gift_aged' } },
  ]);
})();
