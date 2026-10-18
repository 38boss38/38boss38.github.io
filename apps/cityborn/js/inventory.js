/* 不依赖页面状态的角色栏呈现，便于验证名称与说明的转义。 */
(function () {
  const C = window.CITY;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kinds = { weapon: '武器', gear: '装备', quest: '线索', keepsake: '纪念', consumable: '消耗品' };
  const marks = { weapon: '刃', gear: '具', quest: '证', keepsake: '忆', consumable: '药' };
  C.traitsMarkup = function (S, opened = []) {
    return S.traits.map((id) => {
      const T = C.TRAITS[id] || {}, o = S.traitOrigins[id], tone = T.tone || (['体弱多病', '神经过敏', '霉运'].includes(id) ? 'bad' : 'good');
      return '<details class="trait-entry" data-trait="' + esc(id) + '"' + (opened.includes(id) ? ' open' : '') + '><summary class="chip t ' + tone + '" title="' + esc(C.traitText(S, id)) + '">' + esc(id) + (o && !o.born ? '<i class="trait-earned" aria-label="后天获得">·</i>' : '') + '</summary><div class="trait-description">' + esc(C.traitText(S, id)).replace(/\n/g, '<br>') + '</div></details>';
    }).join('');
  };
  C.inventoryMarkup = function (S, opened = [], busy = '') {
    const ids = Object.keys(S.items).filter((id) => C.ITEMS[id] && C.hasItem(S, id));
    if (!ids.length) return '<p class="inventory-empty">口袋里暂时没有值得记下的东西。</p>';
    return ids.map((id) => {
      const I = C.ITEMS[id], entry = S.items[id], equipped = I.slot && S.equipment[I.slot] === id;
      const inactive = !S.alive || ['book', 'distorted'].includes(S.job.id), blocked = inactive || !!busy;
      let actions = '';
      if (I.slot) actions += '<button type="button" data-item="' + esc(id) + '" data-item-action="' + (equipped ? 'unequip' : 'equip') + '"' + (blocked || S.age < (I.minAge || 0) ? ' disabled' : '') + '>' + (equipped ? '收起' : S.age < (I.minAge || 0) ? I.minAge + '岁后装备' : '装备') + '</button>';
      if (I.use) actions += '<button type="button" data-item="' + esc(id) + '" data-item-action="use"' + (blocked || I.useReq && !C.test(S, I.useReq) ? ' disabled' : '') + '>使用一' + esc(I.unit || '支') + '</button>';
      if (busy && actions) actions += '<p class="item-wait">' + esc(busy) + '</p>';
      const effect = I.mods ? '装备后：' + C.modText(I.mods) : I.use ? '使用后：' + C.modText(I.use) : I.kind === 'quest' ? '后续事件可能用到，不会自动消耗。' : '留下来的一段经历。';
      return '<details class="inventory-item rarity-' + esc(I.rarity || 'common') + '" data-possession="' + esc(id) + '"' + (opened.includes(id) ? ' open' : '') + '><summary><span class="item-mark" aria-hidden="true">' + marks[I.kind] + '</span><span class="item-heading"><b>' + esc(I.name) + '</b><small>' + kinds[I.kind] + (equipped ? inactive && S.alive ? ' · 暂不生效' : ' · 已装备' : '') + '</small></span><span class="item-count">' + (entry.count > 1 ? '×' + entry.count : '⌄') + '</span></summary><div class="item-description"><p>' + esc(I.desc) + '</p><p class="item-effect">' + esc(effect) + '</p><p class="item-origin">' + entry.age + '岁 · ' + esc(entry.source) + '</p>' + (actions ? '<div class="item-actions">' + actions + '</div>' : '') + '</div></details>';
    }).join('');
  };
  C.storiesMarkup = function (S) {
    const status = { active: '约定未了', completed: '已经历', interrupted: '暂别', declined: '婉拒' };
    const entries = Object.values(S.stories || {});
    const current = entries.filter(x => x.status === 'active');
    const past = entries.filter(x => x.status !== 'active' && x.status !== 'declined').slice(-4).reverse();
    const card = x => {
      const A = C.STORIES[x.id], name = C.storyPerson(S, x.id);
      // 未了的约定只写和谁、还没结束；下一段叫什么、何时发生，不提前告诉玩家。
      const detail = x.status === 'active' ? '' : x.summary;
      return '<div class="story-note"><b>' + esc(A.title) + '</b><small>' + esc(name) + ' · ' + status[x.status] + '</small>' + (detail ? '<p>' + esc(detail) + '</p>' : '') + '</div>';
    };
    return (current.length ? current.map(card).join('') : '<p class="inventory-empty">眼下没有未了的约定。</p>')
      + (past.length ? '<details class="story-past"><summary>记得的人与事</summary>' + past.map(card).join('') + '</details>' : '');
  };
})();
