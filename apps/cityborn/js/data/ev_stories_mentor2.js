/* 带出来的人 · 之二（批次 27）：三年后，他做的和你教的不一样了。
 * 入口承接批次 25 的三种收束；这一包写"你在他身上看见自己"。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const AFTER = { anyflag: ['mentor_left_it', 'mentor_took_back', 'mentor_fixed_thrice', 'mentor_stored', 'mentor_at_window'] };

  p({ id: 'mentor_second', pack: 'B27', title: '他改过的那一步', route: 'human', person: 'mentor_child', theme: '前情', age: [34, 78], sources: ['S01'], req: AFTER, fixture: S => { S.flags.mentor_left_it = true; } }, [
    ['他开了个摊子',
      S => '有人告诉你，' + NM(S, 'mentor_child') + '在别的区开了自己的摊子。\n\n“生意还行。”传话的人说，“就是做的跟你不太一样。”\n\n他把地址写在烟盒背面，字很潦草。',
      [
        o('去看一趟', '坐了四十多分钟的车。\n\n摊子在一个路口，比你的小，收拾得很干净。\n\n他背对着门口，正在做那件你教过的事。', { went: 'yes' }, { body: -1, mind: 1 }),
        o('先不去', '你把烟盒收进抽屉。\n\n之后的几个月，你偶尔会想起他做的和你不太一样这件事。', { went: 'no' }, { mind: -1 }, { goto: 3 }),
        c('先问传话的人，他改了什么', 'social', 44,
          o('对方说他把最后一步省了', '“省了以后快一倍。”传话的人说，“他说反正看不出来。”\n\n他说这话的时候在看你。', null, { wit: 2, mind: -1, flag: 'mentor_heard_change' }),
          o('对方说不清', '“我又不懂这个。”\n\n他把烟盒又推给你一次，这次推得很正。', null, { wit: 1 })),
      ]],
    ['他手上那一步',
      '你站在摊子外面看了一会儿。\n\n他确实把最后一步省了。省得很熟练，不是第一次。\n\n做出来的东西看不出差别，只有拿在手里才知道。',
      [
        o('进去，直接说', '他抬头看见你，先愣了一下，然后把手里的东西放下。\n\n“你来了。”\n\n他没有把手上的活收起来。', { said: 'now' }, { mind: -1, flag: 'mentor_said_face' }),
        o('等他做完这一件再说', '你站在旁边，看他做完三件。\n\n第四件的时候，他自己停下来了。\n\n“你是不是看出来了。”', { said: 'after' }, { wit: 1 }),
        o('什么也不说，转身走', '你走出十几步，他在后面叫了一声。\n\n你没有回头。\n\n那个声音停在原处。', { said: 'left' }, { mind: -2 }, { end: '你看见他改了你教的那一步，没有说一句话就走了。' }),
      ]],
    ['他为什么改',
      S => '“一天多做四件。”他说，“一个月能多挣两千多眼。”\n\n他把手在围裙上擦了擦。\n\n“我知道你说过不能省。我算过了，一百件里坏一件。”',
      [
        o('问他那一件坏了怎么算', '“退回来我赔。”他说得很快，像是早就想过。\n\n“赔两件的钱。”\n\n他说完自己也停了一下，可能在算这个账到底对不对。', { why: 'cost' }, { wit: 2, mind: -1, flag: 'mentor_asked_cost' }),
        o('说这样会被人看出来', '“那就等被看出来再说。”\n\n他说完把围裙解了下来，搭在椅背上。', { why: 'later' }, { mind: -2 }),
        o('问他这一年过得怎么样', '他愣了一下，说“还行”。\n\n然后又补了一句：“刚开的时候，一天卖不出去一件。”', { why: 'life' }, { mind: 2, flag: 'mentor_asked_life' }, { trust: 2, goto: 3 }),
      ]],
    ['你要不要管',
      '摊子前没有客人。\n\n他给你倒了一杯水，杯子是新的，杯沿有一道很细的划痕。\n\n“你要是说不该这么干，我就改回去。”他说，“不过我得少睡两个小时。”',
      [
        o('说改回去，慢一点没关系', '他把水杯推到你面前，自己坐下。\n\n“行。”\n\n那个字说得很轻，但他没有再讨价还价。', { verdict: 'revert' }, { mind: 1, flag: 'mentor_told_revert' }, { trust: 2 }),
        o('说你自己看着办', '他点点头，把杯子收走了。\n\n“我明白了。”\n\n你后来想，他明白的可能不是你的意思。', { verdict: 'free' }, { mind: -1, flag: 'mentor_left_choice' }),
        o('说先教他怎么看那一件坏的', '你把那件拿起来，指了三个地方。\n\n他学得很快，学到第二个就点头。\n\n“那这一步……还是有用的。”他说。', { verdict: 'teach' }, { wit: 2, mind: 2, flag: 'mentor_taught_check' }, { trust: 2 }),
      ]],
    ['回去的路上',
      S => (S.flags.mentor_told_revert ? '回去的车上你一直在想那两小时。\n\n他答应了，但你没问他少睡的两小时从哪儿来。' : S.flags.mentor_left_choice ? '回去的车上你一直在想自己那句话。\n\n“你自己看着办”听起来像信任，也像撇清。' : '回去的车上你在想那三个地方。\n\n他学得快，快到让你有点不安——也许他早就知道，只是没人指过。') + '\n\n车窗外是别的区，招牌一个接一个往后退。',
      [
        o('下次再去一趟', '你知道自己还会去。\n\n不是因为不放心，是因为想看看他后来怎么做。', null, { mind: 1, flag: 'mentor_will_return' }, { end: '你打算再去看看他后来怎么做。' }),
        o('不去了', '你想，这大概就是教一个人该有的结尾。\n\n他把剩下的路自己走了。', null, { mind: 2, flag: 'mentor_let_go' }, { end: '你决定不再去看他怎么做，把剩下的路留给他。' }),
      ]],
  ]);

  C.addEvents('mentor2', [
    { id: 'm2_his_sign', age: [34, 85], w: 10, repeat: true, cd: 14,
      text: '你在别的区看见一块招牌，字体跟你那儿很像。\n\n不是同一家，只是像。\n\n你在门口站了一会儿，没有进去。' },
    { id: 'm2_his_way', age: [34, 85], w: 9, repeat: true, cd: 14,
      text: '你现在做活的时候，偶尔会用上别人的手法。\n\n那是你从一个更年轻的人那里看来的。\n\n你从来没跟他说过。' },
    { id: 'm2_same_mistake', age: [36, 85], w: 9, repeat: true, cd: 15,
      text: '你发现自己也在省一步。\n\n省得很熟练，不是第一次。\n\n做完那件东西，你在灯下看了很久。' },
    { id: 'm2_his_name_card', age: [38, 90], w: 8, repeat: true, cd: 15,
      text: '一张名片夹在旧账本里，纸上只有一个名字和一个地址。\n\n地址那一栏被人划掉过一次，重新写在下面。\n\n你认得那个笔迹。' },
  ]);

  C.addEvents('mentor2b', [
    { id: 'm2_ask_his_opinion', age: [36, 80], w: 9, title: '他反过来问你',
      text: '他来问你一件事，是他自己拿不定主意的那种。\n\n“你那时候是怎么决定的。”他说。\n\n你想起自己那时候根本没决定，是被推着走的。',
      choices: [
        { t: '照实说，是被推着走的', eff: { mind: 2, flag: 'm2_told_truth' }, r: '他听完，沉默了一会儿。\n\n“那我也等被推一下。”他说。\n\n他说这话的时候是笑着的。' },
        { t: '编一个像样的理由', eff: { wit: 1, mind: -1, flag: 'm2_made_up_reason' }, r: '你讲得很顺。\n\n他认真听完，点了两次头。\n\n后来他真的照着做了。' },
        { t: '反问他现在最怕什么', check: { s: 'social', dc: 46 },
          ok: { r: '他说怕做出来的东西没人要。\n\n“跟你当年怕的一样吗。”\n\n你说一样。', eff: { wit: 2, mind: 1, flag: 'm2_asked_fear' } },
          no: { r: '他说“没什么好怕的”。\n\n说完就不看你了。', eff: { mind: -1 } } },
      ] },
  ]);
})();
