/* Pop-ups shared by both concepts: flavour, energy range, partner type and recipe.
   Markup is the same on both sites; each concept styles .fm, .em, .pm and .rm itself. */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var F = MB.flavours, C = MB.company;
  var DEFAULT_CASES = 5;

  function tone(id) { var t = MB.tones[id]; return '--bg:' + t.bg + ';--on:' + t.ink; }
  function inOrderText(id) {
    var q = MB.order.qty(id);
    return q ? 'In your order: <strong>' + MB.cases(q) + '</strong>' : 'Not in your order yet';
  }
  function addRow(id, label) {
    return '<div class="add-row" data-add-row="' + id + '">' + MB.stepperHTML(id, DEFAULT_CASES, 'Cases of HOLA ' + label) +
      '<button class="btn btn--primary" type="button" data-add-cases="' + id + '">' + MB.icon('basket') + '<span>Add ' + MB.cases(DEFAULT_CASES) + '</span></button>' +
      '<p class="add-row__in" aria-live="polite">' + inOrderText(id) + '</p></div>';
  }
  function recipesFor(id) { return MB.recipes.filter(function (r) { return r.flavour === id || r.also === id; }); }

  /* Steppers inside pop-ups only change the number; the Add button commits it */
  function wire(d, rerender) {
    var panel = d.querySelector('.mb-dialog__panel');
    panel.addEventListener('click', function (e) {
      var t = e.target;
      var st = t.closest('.qty [data-step]');
      if (st) {
        var box = st.closest('.qty'), input = box.querySelector('input');
        input.value = Math.max(1, MB.stepperValue(box) + +st.getAttribute('data-step'));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      var add = t.closest('[data-add-cases]');
      if (add) {
        var id = add.getAttribute('data-add-cases'), row = add.closest('[data-add-row]');
        var n = Math.max(1, MB.stepperValue(row.querySelector('.qty')));
        MB.addToOrder(id, n);
        return;
      }
      var both = t.closest('[data-add-recipe]');
      if (both) {
        both.getAttribute('data-add-recipe').split(',').forEach(function (id) { MB.order.add(id, DEFAULT_CASES); });
        MB.toast(both.getAttribute('data-toast'));
        return;
      }
      var rec = t.closest('[data-recipe]');
      if (rec) { MB.openRecipe(rec.getAttribute('data-recipe')); return; }
      var go = t.closest('[data-go]');
      if (go && rerender) { rerender(go.getAttribute('data-go'), go.getAttribute('data-go-kind')); return; }
      if (t.closest('[data-view-order]')) { e.preventDefault(); MB.go('#order'); }
    });
    panel.addEventListener('input', function (e) {
      var box = e.target.closest('.qty');
      if (!box) return;
      var row = box.closest('[data-add-row]'), btn = row && row.querySelector('[data-add-cases] span');
      if (btn) btn.textContent = 'Add ' + MB.cases(Math.max(1, MB.stepperValue(box)));
    });
    var sync = function () {
      $$('[data-add-row]', d).forEach(function (row) {
        row.querySelector('.add-row__in').innerHTML = inOrderText(row.getAttribute('data-add-row'));
      });
    };
    document.addEventListener('mb:order', sync);
    d.addEventListener('close', function () { document.removeEventListener('mb:order', sync); });
  }

  /* Swap the content of an open pop-up, or open a new one */
  function present(html, label, className, rerender) {
    var open = $('dialog.mb-dialog[open]:not(.is-closing)');
    if (open && open.classList.contains(className)) {
      var body = open.querySelector('.mb-dialog__panel > :first-child');
      body.outerHTML = html;
      open.setAttribute('aria-label', label);
      MB.hydrateIcons(open);
      open.querySelector('.mb-dialog__panel').scrollTop = 0;
      open.scrollTop = 0;
      return open;
    }
    if (open) MB.modal.close(open);
    return MB.modal.open(html, { label: label, className: className, onOpen: function (d) { wire(d, rerender); } });
  }

  /* ---------- Flavour ---------- */
  function flavourHTML(id) {
    var f = MB.flavour(id), i = F.indexOf(f), prev = F[(i - 1 + F.length) % F.length], next = F[(i + 1) % F.length];
    var recs = recipesFor(id);
    return '<article class="fm" style="--c:' + f.color + ';' + tone(id) + '" data-id="' + id + '">' +
      '<div class="fm__media"><img src="' + MB.img('studio/' + id + '.webp') + '" alt="HOLA ' + MB.esc(f.name) + ' bottle, studio photograph" width="548" height="910"></div>' +
      '<div class="fm__body"><p class="fm__kind">' + f.kind + '</p>' +
      '<h2 class="fm__name">HOLA ' + MB.esc(f.name) + '</h2>' +
      '<p class="fm__desc">' + MB.esc(f.desc) + '</p>' +
      '<ul class="fm__notes">' + f.notes.map(function (n) { return '<li>' + MB.esc(n) + '</li>'; }).join('') + '</ul>' +
      '<dl class="fm__specs"><div><dt>Format</dt><dd>Single-serve PET bottle</dd></div><div><dt>Best served</dt><dd>Ice cold</dd></div><div><dt>Trade packs</dt><dd>Cases, priced by volume</dd></div></dl>' +
      (recs.length ? '<div class="fm__pairs"><h3>Try it with</h3><div>' + recs.map(function (r) {
        return '<button type="button" data-recipe="' + r.id + '"><img src="' + MB.img(r.img) + '" alt="" width="800" height="1000">' + MB.esc(r.name) + '</button>';
      }).join('') + '</div></div>' : '') +
      addRow(id, f.name) +
      '<div class="fm__nav"><button type="button" data-go="' + prev.id + '">' + MB.icon('left') + MB.esc(prev.name) + '</button>' +
      '<button type="button" data-go="' + next.id + '">' + MB.esc(next.name) + MB.icon('right') + '</button></div>' +
      '</div></article>';
  }
  MB.openFlavour = function (id) {
    if (id === 'energy-red' || id === 'energy-green') return MB.openEnergy();
    present(flavourHTML(id), 'HOLA ' + MB.flavour(id).name, 'mb-dialog--flavour', function (next) { MB.openFlavour(next); });
  };

  /* ---------- Energy range ---------- */
  MB.openEnergy = function () {
    present('<div class="em"><div class="em__head"><p class="fm__kind">Energy drinks</p><h2>HOLA Energy, three ways</h2>' +
      '<p>Carbonated energy drinks with explosive flavour. Stock all three to give shoppers a choice of kick.</p></div>' +
      '<div class="em__grid">' + MB.energyRange.map(function (e) {
        return '<article class="em__item" style="--c:' + e.color + ';' + tone(e.id) + '">' +
          '<div class="em__shot"><img src="' + MB.img('bottles/' + e.id + '.webp') + '" alt="' + MB.esc(e.name) + ' bottle" width="251" height="921"></div>' +
          '<h3>' + MB.esc(e.name) + '</h3><p>' + MB.esc(e.desc) + '</p>' + addRow(e.id, e.name) + '</article>';
      }).join('') + '</div></div>', 'HOLA Energy range', 'mb-dialog--energy');
  };

  /* ---------- Partner type ---------- */
  MB.openPartner = function (id) {
    var p = MB.partners.find(function (x) { return x.id === id; });
    var d = present('<div class="pm"><span class="pm__icon">' + MB.icon(p.icon) + '</span><h2>' + MB.esc(p.name) + '</h2>' +
      '<p class="pm__line">' + MB.esc(p.line) + '</p><ul class="pm__points">' +
      p.points.map(function (t) { return '<li>' + MB.icon('check') + '<span>' + MB.esc(t) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="pm__actions"><button class="btn btn--primary" type="button" data-pm-order>' + MB.icon('basket') + 'Start an order</button>' +
      '<button class="btn btn--ghost" type="button" data-pm-apply>' + (id === 'distributor' ? 'Apply to distribute' : 'Ask the trade team') + '</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + 'Call ' + C.phone + '</a></div></div>', p.name, 'mb-dialog--narrow');
    d.querySelector('[data-pm-order]').addEventListener('click', function () { MB.go('#order'); });
    d.querySelector('[data-pm-apply]').addEventListener('click', function () { MB.prefillForm({ type: MB.partnerToType[id] }); });
  };

  /* ---------- Recipe ---------- */
  function recipeHTML(id) {
    var r = MB.recipe(id), i = MB.recipes.indexOf(r), N = MB.recipes.length;
    var prev = MB.recipes[(i - 1 + N) % N], next = MB.recipes[(i + 1) % N];
    var f = MB.flavour(r.flavour), also = r.also ? MB.flavour(r.also) : null;
    var type = MB.recipeTypes.find(function (t) { return t.id === r.type; });
    var ids = [r.flavour].concat(also ? [r.also] : []);
    var label = also ? 'Add 5 cases each of ' + f.name + ' and ' + also.name : 'Add 5 cases of HOLA ' + f.name;
    var toast = also ? '5 cases each of ' + f.name + ' and ' + also.name + ' added to your order' : '5 cases of ' + f.name + ' added to your order';
    return '<article class="rm" style="--c:' + f.color + ';' + tone(r.flavour) + '" data-id="' + id + '">' +
      '<div class="rm__media"><img class="rm__photo" src="' + MB.img(r.img) + '" alt="' + MB.esc(r.name) + '" width="800" height="1000">' +
      '<img class="rm__bottle" src="' + MB.img('bottles/' + r.flavour + '.webp') + '" alt="" width="251" height="921">' +
      (also ? '<img class="rm__bottle rm__bottle--also" src="' + MB.img('bottles/' + r.also + '.webp') + '" alt="" width="251" height="921">' : '') +
      (r.credit ? '<a class="rm__credit" href="' + r.credit.url + '" target="_blank" rel="noopener">Photo: ' + MB.esc(r.credit.by) + ', ' + r.credit.licence + '</a>' : '') + '</div>' +
      '<div class="rm__body"><p class="rm__meta"><span>' + type.one + '</span><span>' + r.serves + '</span><span>' + r.time + '</span></p>' +
      '<h2 class="rm__name">' + MB.esc(r.name) + '</h2><p class="rm__intro">' + MB.esc(r.intro) + '</p>' +
      '<div class="rm__cols"><div><h3>You need</h3><ul>' + r.need.map(function (x) { return '<li>' + MB.esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div><h3>Method</h3><ol>' + r.steps.map(function (x) { return '<li>' + MB.esc(x) + '</li>'; }).join('') + '</ol></div></div>' +
      '<p class="rm__tip"><strong>For your menu</strong>' + MB.esc(r.tip) + '</p>' +
      (r.type === 'cocktail' ? '<p class="rm__legal">Contains alcohol. Serve responsibly, to adults over 18 only.</p>' : '') +
      '<div class="rm__actions"><button class="btn btn--primary" type="button" data-add-recipe="' + ids.join(',') + '" data-toast="' + MB.esc(toast) + '">' + MB.icon('basket') + MB.esc(label) + '</button>' +
      '<button class="btn btn--ghost" type="button" data-go="' + r.flavour + '" data-go-kind="flavour">About HOLA ' + MB.esc(f.name) + '</button></div>' +
      '<div class="fm__nav"><button type="button" data-go="' + prev.id + '">' + MB.icon('left') + MB.esc(prev.name) + '</button>' +
      '<button type="button" data-go="' + next.id + '">' + MB.esc(next.name) + MB.icon('right') + '</button></div></div></article>';
  }
  MB.openRecipe = function (id) {
    present(recipeHTML(id), MB.recipe(id).name, 'mb-dialog--recipe', function (to, kind) {
      if (kind === 'flavour') MB.openFlavour(to); else MB.openRecipe(to);
    });
  };

  /* One delegated listener for every trigger on the page */
  document.addEventListener('click', function (e) {
    if (e.target.closest('dialog')) return;
    var t = e.target;
    var fl = t.closest('[data-flavour]'), pa = t.closest('[data-partner]'), re = t.closest('[data-recipe]'), add = t.closest('[data-quick-add]');
    if (add) { e.preventDefault(); MB.addToOrder(add.getAttribute('data-quick-add'), +(add.getAttribute('data-cases') || DEFAULT_CASES)); return; }
    if (fl) { e.preventDefault(); MB.openFlavour(fl.getAttribute('data-flavour')); return; }
    if (pa) { e.preventDefault(); MB.openPartner(pa.getAttribute('data-partner')); return; }
    if (re) { e.preventDefault(); MB.openRecipe(re.getAttribute('data-recipe')); return; }
    if (t.closest('[data-open-energy]')) { MB.openEnergy(); return; }
    if (t.closest('[data-open-chat]') && MB.chat && MB.chat.open) MB.chat.open();
  });
})();
