/* 带出来的人 · 之三（批次 31）：他的做法比你的好。
 * 承接批次 27 的三种收束；这一包写"你回去跟他学一次"。
 */
(function () {
  'use strict';
  const C = window.CITY, p = C.storyPack, o = C.storyOption, c = C.storyCheck;
  const NM = (S, id) => C.contactName(S, id);
  const AFTER = { anyflag: ['mentor_told_revert', 'mentor_left_choice', 'mentor_taught_check', 'mentor_will_return', 'mentor_let_go'] };

  p({ id: 'mentor_third', pack: 'B31', title: '反过来学一次', route: 'human', person: 'mentor_child', theme: '前情', age: [38, 82], sources: ['S01'], req: AFTER, fixture: S => { S.flags.mentor_told_revert = true; } }, [
    ['听说他改回来了',
      S => '有人跟你说，' + NM(S, 'mentor_child') + '把当初省掉的那一步又加回去了。\n\n“加回去以后，比原来还快。”传话的人说，“不知道他怎么弄的。”\n\n你把这句话在心里放了两天。',
      [
        o('去一趟', '你去了。摊子比上次大了一点，多了一张桌子。\n\n他正在做那件你教过的事，手上的顺序和你不一样。', { went: 'yes' }, { body: -1, mind: 1 }),
        c('托人问他是怎么弄的', 'social', 44,
          o('托人问他是怎么弄的', '“他说这东西说不清，得看。”\n\n传话的人摊了摊手。\n\n你把手里的活停了半天。', null, { wit: 1, mind: -1, flag: 'mentor_heard_refused' }),
          o('托人问他是怎么弄的', '听上去很简单，简单到你觉得哪里不对。\n\n照他说的试了一次，做坏了。', null, { wit: 2, mind: -2, flag: 'mentor_tried_described' })),
        o('不去，也不问', '你把这件事放下了。\n\n之后你照旧用自己那套，只是偶尔会想他那句“比原来还快”。', { went: 'no' }, { mind: -1 }, { goto: 3 }),
      ]],
    ['他手上的顺序',
      '他做给你看了一遍，没有解释。\n\n同一个动作，他拆成了两段，中间多停了一下。\n\n那一停很短，短到不像是有意的。',
      [
        o('问他中间那一下是什么', '“等它自己到位。”他说。\n\n他把手上的东西转了个角度，让你看那一处。\n\n“以前我硬压，压坏了再补。”', { asked: 'wait' }, { wit: 2, mind: 1, flag: 'mentor_learned_wait' }),
        c('照着他的顺序试一遍', 'skill', 48,
          o('照着他的顺序试一遍', '第一次就成了。\n\n他站在旁边看，没有说话，等你做完才把手上的工具放下。', null, { skill: 2, mind: 2, flag: 'mentor_copied_way' }),
          o('照着他的顺序试一遍', '你在那一停上犹豫了，东西滑了。\n\n“不怪你。”他说，“这个得做坏几次才摸得着。”', null, { body: -2, skill: 1, flag: 'mentor_failed_copy' })),
        o('说这不合规矩', '“规矩是谁定的。”他问得很轻。\n\n不是顶嘴，是真的在问。\n\n你答不上来。', { asked: 'rule' }, { mind: -2, flag: 'mentor_defended_rule' }),
      ]],
    ['他讲给你听',
      S => '他讲了很久，讲得比当年你教他时还细。\n\n中间他停下来两次，去招呼客人，回来接着讲，从断的地方接上。\n\n“我以前觉得你那样慢。”他说，“后来才知道是稳。”',
      [
        o('说他说得比你好', '他摇头。\n\n“我是从你那儿学的。”\n\n他说完就去洗工具了，水声很大。', { said: 'praise' }, { mind: 2, flag: 'mentor_praised_him' }, { trust: 2 }),
        o('问他还有没有别的', '他想了想，说还有两处。\n\n然后他讲了一处，另一处说“你自己会碰到”。', { said: 'more' }, { wit: 2, flag: 'mentor_more_tricks' }, { trust: 1 }),
        o('什么也不说，记在心里', '你把顺序在心里过了三遍。\n\n走的时候他送你到路口，没有问你看会了没有。', { said: 'silent' }, { wit: 1, mind: 1 }),
      ]],
    ['回去以后',
      '回到自己的台子前，你照他的顺序做了一件。\n\n不快，但一次就成了。\n\n第二件更快一点。',
      [
        o('把这个顺序教给下一个人', '你教的时候，学的人也嫌慢。\n\n你说“先这么慢着”，说完自己愣了一下。\n\n这句话是你当年的原话。', { pass: 'teach' }, { social: 1, mind: 2, flag: 'mentor_passed_again' }, { end: '你把他改过的顺序又教给了下一个人。' }),
        o('自己用着，不往外说', '这套顺序成了你手上的事。\n\n没有人问过你为什么这么做，也没有人看出来。', { pass: 'keep' }, { wit: 1, flag: 'mentor_kept_secret' }, { end: '你把他改过的顺序自己用着，没有告诉别人。' }),
        o('再去找他，把这套东西一起弄明白', '你们在摊子上待到收摊。\n\n最后他关灯的时候说了句：“这个可以再改。”\n\n你说好。', { pass: 'together' }, { mind: 3, social: 1, flag: 'mentor_work_together' }, { end: '你和他一起把那一套又改了一次。' }),
      ]],
  ]);

  C.addEvents('mentor3', [
    { id: 'm3_his_tool', age: [40, 90], w: 9, repeat: true, cd: 15,
      text: '你手上这件的握法，是从他那儿学来的。\n\n用久了，柄上磨出的位置和你原来的不一样。\n\n现在两处都磨亮了。' },
    { id: 'm3_slower_now', age: [40, 90], w: 9, repeat: true, cd: 15,
      text: '你做得比以前慢。\n\n做完的东西比以前少，退回来的也少。\n\n这个账你算过，算得很清楚。' },
    { id: 'm3_third_hand', age: [44, 92], w: 8, repeat: true, cd: 16,
      text: '有个更年轻的人来问你，能不能学。\n\n他说他看过你做的东西。\n\n你说“先看三个月”。' },
  ]);
})();
