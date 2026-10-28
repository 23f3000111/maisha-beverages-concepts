/* Order desk: pick stock by the case, add business details, choose delivery, review, send.
   Both concepts use this markup and skin it in their own CSS. opts.viz picks the summary
   picture: 'bar' (a mix bar) or 'crate' (a crate of bottle caps that fills as you add). */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var C = MB.company;
  var STEPS = ['Pick your stock', 'Your business', 'Delivery', 'Review and send'];
  var CRATE = 24;

  function workingDays(n) {
    var out = [], d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < n) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }
  function dayLabel(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function longDay(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }

  function radio(name, value, label, sub, icon, checked) {
    return '<label class="od-choice"><input type="radio" name="' + name + '" value="' + MB.esc(value) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="od-choice__box">' + (icon ? '<span class="od-choice__icon">' + MB.icon(icon) + '</span>' : '') +
      '<span class="od-choice__text"><strong>' + MB.esc(label) + '</strong>' + (sub ? '<span>' + MB.esc(sub) + '</span>' : '') + '</span>' +
      MB.icon('check', 'od-choice__tick') + '</span></label>';
  }

  MB.orderDesk = function (root, opts) {
    opts = opts || {};
    var viz = opts.viz || 'bar';
    var step = 1, reached = 1, tried = {}, sentRecord = null;
    var days = workingDays(8);

    var itemsHTML = MB.skus.map(function (s) {
      var t = MB.tones[s.id];
      return '<li class="od-item" data-id="' + s.id + '" data-group="' + s.group + '" style="--c:' + s.color + ';--bg:' + t.bg + ';--on:' + t.ink + '">' +
        '<button class="od-item__add" type="button" aria-label="Add a case of HOLA ' + MB.esc(s.name) + '">' +
        '<img src="' + MB.img('bottles/' + s.id + '.webp') + '" alt="" width="251" height="921" loading="lazy">' +
        '<span class="od-item__plus" aria-hidden="true">' + MB.icon('plus') + '</span></button>' +
        '<div class="od-item__info"><span class="od-item__name">' + MB.esc(s.short) + '</span><span class="od-item__kind">' + s.kind + '</span></div>' +
        MB.stepperHTML(s.id, 0, 'Cases of HOLA ' + s.name) + '</li>';
    }).join('');

    root.classList.add('od', 'od--' + viz);
    root.innerHTML =
      '<ol class="od-steps">' + STEPS.map(function (t, i) {
        return '<li><button type="button" data-goto="' + (i + 1) + '"' + (i ? ' disabled' : ' aria-current="step"') + '>' +
          '<span class="od-steps__n">' + (i + 1) + '</span><span class="od-steps__t">' + t + '</span></button></li>';
      }).join('') + '</ol>' +
      '<div class="od-grid">' +
      '<form class="od-main" id="od-form" novalidate>' +

      // 1. stock
      '<section class="od-panel" data-panel="1">' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Pick your stock</h3>' +
      '<div class="od-filter" role="group" aria-label="Show flavours">' +
      '<button type="button" data-filter="all" aria-pressed="true">All ten</button>' +
      '<button type="button" data-filter="soft" aria-pressed="false">Soft drinks</button>' +
      '<button type="button" data-filter="energy" aria-pressed="false">Energy</button></div></div>' +
      '<div class="od-repeat" hidden></div>' +
      '<ul class="od-items">' + itemsHTML + '</ul>' +
      '<p class="od-hint">Tap a bottle to add a case, or type the number of cases.</p></section>' +

      // 2. business
      '<section class="od-panel" data-panel="2" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Your business</h3><p class="od-panel__sub">So the trade desk knows who to call and where you trade.</p></div>' +
      '<div class="od-fields">' +
      '<div class="field"><label for="od-name">Your name *</label><input id="od-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="od-business">Business name *</label><input id="od-business" name="business" autocomplete="organization"></div>' +
      '<div class="field"><label for="od-phone">Phone *</label><input id="od-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field"><label for="od-email">Email</label><input id="od-email" name="email" type="email" autocomplete="email" placeholder="you@business.co.ke"></div>' +
      '<div class="field"><label for="od-type">Business type *</label><select id="od-type" name="type">' + MB.optionsHTML(MB.businessTypes, 'Select business type') + '</select></div>' +
      '<div class="field"><label for="od-county">County *</label><select id="od-county" name="county">' + MB.optionsHTML(MB.counties, 'Select county') + '</select></div>' +
      '<div class="field"><label for="od-town">Town or area *</label><input id="od-town" name="town" placeholder="For example Thika Road, Ruiru"></div>' +
      '<fieldset class="field"><legend>Do you buy HOLA already?</legend><div class="od-choices od-choices--row">' +
      radio('status', 'Existing customer', 'Yes, I do', '', '', true) + radio('status', 'New to HOLA', 'Not yet', '', '', false) + '</div></fieldset>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="distributor" value="yes"><span>I would like to become a HOLA distributor in my area</span></label></div>' +
      '<div class="od-dist field--full" hidden>' +
      '<div class="field"><label for="od-volume">Expected monthly volume</label><select id="od-volume" name="volume">' + MB.optionsHTML(MB.volumes, 'Select a range') + '</select></div>' +
      '<fieldset class="field"><legend>Own delivery vehicles?</legend><div class="od-choices od-choices--row">' +
      radio('vehicles', 'Yes', 'Yes', '', '', false) + radio('vehicles', 'No', 'No', '', '', false) + radio('vehicles', 'Planning to', 'Planning to', '', '', false) + '</div></fieldset>' +
      '</div></div></section>' +

      // 3. delivery
      '<section class="od-panel" data-panel="3" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Delivery</h3><p class="od-panel__sub">Pick a day that suits you. The trade desk confirms it when they call.</p></div>' +
      '<div class="od-fields">' +
      '<fieldset class="field field--full"><legend>How should it reach you? *</legend><div class="od-choices od-choices--two">' +
      radio('method', 'Deliver', 'Deliver to my business', 'Our truck or your nearest distributor', 'truck', true) +
      radio('method', 'Collect', 'I will collect', 'From Spectrum Business Park, Baba Dogo Road', 'factory', false) + '</div></fieldset>' +
      '<fieldset class="field field--full"><legend class="od-day-legend">Delivery day *</legend><div class="od-days">' +
      days.map(function (d, i) {
        return '<label class="od-day"><input type="radio" name="date" value="' + d.toISOString().slice(0, 10) + '"><span><b>' +
          d.toLocaleDateString('en-GB', { weekday: 'short' }) + '</b>' + d.getDate() + '<i>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</i></span></label>';
      }).join('') + '</div></fieldset>' +
      '<fieldset class="field field--full"><legend>Time of day</legend><div class="od-choices od-choices--row">' +
      radio('time', 'Morning, 8am to 12pm', 'Morning', '8am to 12pm', 'sun', true) + radio('time', 'Afternoon, 12pm to 5pm', 'Afternoon', '12pm to 5pm', 'clock', false) + '</div></fieldset>' +
      '<div class="field field--full od-address"><label for="od-address">Delivery address or landmark *</label><textarea id="od-address" name="address" rows="2" placeholder="Building, street and a landmark the driver can find"></textarea></div>' +
      '<fieldset class="field field--full"><legend>How do you plan to pay?</legend><div class="od-choices od-choices--row">' +
      ['M-Pesa', 'Bank transfer', 'Cash on delivery', 'On account'].map(function (p, i) { return radio('pay', p, p, '', i === 0 ? 'wallet' : '', i === 0); }).join('') +
      '</div><p class="od-small">Payment terms are agreed with the trade desk before anything is loaded.</p></fieldset>' +
      '<div class="field field--full"><label for="od-notes">Anything else for the driver or the trade desk?</label><textarea id="od-notes" name="notes" rows="2" placeholder="Opening hours, parking, a second contact"></textarea></div>' +
      '</div></section>' +

      // 4. review
      '<section class="od-panel" data-panel="4" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Review and send</h3><p class="od-panel__sub">Check the details. Nothing is charged online.</p></div>' +
      '<div class="od-review"></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="consent"><span>I agree to be contacted by Maisha Beverages about this order. *</span></label></div>' +
      '<p class="form__status" role="alert"></p></section>' +

      // done
      '<section class="od-panel od-done" data-panel="done" tabindex="-1" hidden></section>' +
      '</form>' +

      '<aside class="od-summary" aria-label="Your order">' +
      '<div class="od-summary__head"><h3>Your order</h3><span class="od-summary__count" aria-live="polite"></span></div>' +
      '<div class="od-viz" aria-hidden="true"></div>' +
      '<p class="od-viz__note"></p>' +
      '<ul class="od-lines"></ul>' +
      '<p class="od-empty">Nothing in your order yet. Tap a bottle to add your first case.</p>' +
      '<p class="od-note">' + MB.icon('phone') + '<span>Trade prices and case sizes are confirmed by phone before anything is loaded.</span></p>' +
      '<div class="od-actions"><button class="btn btn--primary od-next" type="button"></button>' +
      '<button class="od-back" type="button" hidden>' + MB.icon('left') + 'Back</button></div>' +
      '<p class="od-error" role="alert"></p>' +
      '</aside></div>';

    var form = $('.od-main', root), summary = $('.od-summary', root);
    var nextBtn = $('.od-next', root), backBtn = $('.od-back', root), errBox = $('.od-error', root);
    var vizBox = $('.od-viz', root), vizNote = $('.od-viz__note', root);
    MB.hydrateIcons(root);

    if (viz === 'crate') {
      vizBox.innerHTML = '<div class="od-crate">' + new Array(CRATE + 1).join('<span class="od-cap"></span>') + '</div>';
    } else {
      vizBox.innerHTML = '<div class="od-bar"></div><div class="od-big"><strong>0</strong><span>cases</span></div>';
    }

    /* ---------- Rules per step ---------- */
    var R = MB.formRules;
    var RULES = {
      2: { name: R.name, business: R.business, phone: R.phone, email: R.email, type: R.type, county: R.county, town: R.town },
      3: {
        method: function (v) { return !!v || 'Choose delivery or collection.'; },
        date: function (v, f) { return !!v || (f.elements.method.value === 'Collect' ? 'Pick a collection day.' : 'Pick a delivery day.'); },
        address: function (v, f) { return f.elements.method.value !== 'Deliver' || v.trim().length > 4 || 'Add an address or a landmark the driver can find.'; }
      },
      4: { consent: R.consent }
    };
    [2, 3, 4].forEach(function (n) { MB.liveValidate(form, RULES[n], function () { return tried[n]; }); });

    /* ---------- Paint: items, summary, picture ---------- */
    function paint() {
      var o = MB.order.get(), lines = MB.order.lines(o), total = MB.order.total(o);
      $$('.od-item', root).forEach(function (li) {
        var q = o[li.getAttribute('data-id')] || 0, input = $('input', li);
        if (document.activeElement !== input) input.value = q;
        li.classList.toggle('is-in', q > 0);
      });
      $('.od-summary__count', root).textContent = MB.cases(total);
      $('.od-empty', root).hidden = total > 0;
      summary.classList.toggle('is-empty', !total);
      $('.od-lines', root).innerHTML = lines.map(function (l) {
        return '<li style="--c:' + l.sku.color + '"><span class="od-lines__dot"></span><span class="od-lines__name">' + MB.esc(l.sku.short) + '</span>' +
          '<span class="od-lines__qty"><button type="button" data-line="' + l.sku.id + '" data-d="-1" aria-label="One case less of ' + MB.esc(l.sku.name) + '">' + MB.icon('minus') + '</button>' +
          '<b>' + l.qty + '</b><button type="button" data-line="' + l.sku.id + '" data-d="1" aria-label="One case more of ' + MB.esc(l.sku.name) + '">' + MB.icon('plus') + '</button></span>' +
          '<button class="od-lines__x" type="button" data-line="' + l.sku.id + '" data-d="x" aria-label="Remove ' + MB.esc(l.sku.name) + '">' + MB.icon('close') + '</button></li>';
      }).join('');
      paintViz(lines, total);
      paintRepeat(total);
      nextLabel();
    }

    function shares(lines, slots) {
      var total = lines.reduce(function (t, l) { return t + l.qty; }, 0);
      if (!total) return [];
      if (total <= slots) return lines.reduce(function (a, l) { for (var i = 0; i < l.qty; i++) a.push(l.sku.color); return a; }, []);
      var parts = lines.map(function (l) { var exact = l.qty / total * slots; return { c: l.sku.color, n: Math.floor(exact), r: exact % 1 }; });
      var left = slots - parts.reduce(function (t, p) { return t + p.n; }, 0);
      parts.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, left).forEach(function (p) { p.n++; });
      return parts.reduce(function (a, p) { for (var i = 0; i < p.n; i++) a.push(p.c); return a; }, []);
    }

    function paintViz(lines, total) {
      if (viz === 'crate') {
        var caps = shares(lines, CRATE);
        $$('.od-cap', vizBox).forEach(function (cap, i) {
          var c = caps[i] || '';
          if (cap.getAttribute('data-c') !== c) {
            cap.setAttribute('data-c', c);
            cap.style.setProperty('--c', c || 'transparent');
            cap.classList.toggle('is-on', !!c);
            if (c && !MB.reducedMotion()) cap.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1.12)', opacity: 1, offset: .7 }, { transform: 'scale(1)' }], { duration: 360, easing: 'ease-out' });
          }
        });
        var mix = MB.cases(total) + ' across ' + lines.length + (lines.length === 1 ? ' flavour' : ' flavours');
        vizNote.textContent = !total ? 'An empty crate, ready for your mix.' : total <= CRATE ? mix + '. Each cap is one case.' : mix + ', shown as shares of the crate.';
      } else {
        $('.od-bar', vizBox).innerHTML = lines.map(function (l) {
          return '<span style="flex:' + l.qty + ';background:' + l.sku.color + '" title="' + MB.esc(l.sku.short) + ', ' + MB.cases(l.qty) + '"></span>';
        }).join('');
        $('.od-big strong', vizBox).textContent = total;
        $('.od-big span', vizBox).textContent = total === 1 ? 'case' : 'cases';
        vizNote.textContent = lines.length ? 'Your mix across ' + lines.length + (lines.length === 1 ? ' flavour.' : ' flavours.') : 'Mix any flavours in one order.';
      }
    }

    function paintRepeat(total) {
      var box = $('.od-repeat', root), last = MB.order.history().slice(-1)[0];
      if (!last || total || step !== 1) { box.hidden = true; return; }
      var n = last.lines.reduce(function (t, l) { return t + (+l.qty || 0); }, 0);
      box.innerHTML = '<span class="od-repeat__icon">' + MB.icon('repeat') + '</span><span><strong>Welcome back.</strong> Repeat your order from ' +
        MB.esc(new Date(last.sent).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + ': ' + MB.cases(n) + ' across ' + last.lines.length +
        (last.lines.length === 1 ? ' flavour' : ' flavours') + '.</span><button class="btn btn--sm btn--ghost" type="button" data-repeat>Repeat order</button>';
      box.hidden = false;
    }

    function nextLabel() {
      var labels = { 1: 'Continue to your details', 2: 'Continue to delivery', 3: 'Review your order', 4: 'Send order request' };
      nextBtn.innerHTML = '<span>' + labels[step] + '</span>' + MB.icon(step === 4 ? 'send' : 'right');
      backBtn.hidden = step === 1;
    }

    /* ---------- Steps ---------- */
    function show(n, focus) {
      step = n;
      reached = Math.max(reached, n);
      $$('.od-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== String(n); });
      $$('[data-goto]', root).forEach(function (b) {
        var k = +b.getAttribute('data-goto');
        b.disabled = k > reached;
        if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.parentNode.classList.toggle('is-done', k < n || (k <= reached && k !== n));
      });
      root.setAttribute('data-step', n);
      errBox.textContent = '';
      if (n === 4) buildReview();
      paint();
      if (focus) {
        var top = root.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * .6) MB.scrollTo(root);
        var h = $('[data-panel="' + n + '"] .od-panel__title', root);
        if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, MB.reducedMotion() ? 0 : 450);
      }
    }

    function check(n) {
      if (n === 1) {
        if (!MB.order.total()) { errBox.textContent = 'Add at least one case to continue.'; return false; }
        return true;
      }
      tried[n] = true;
      var bad = MB.validateForm(form, RULES[n]);
      if (bad) {
        var count = $$('[data-panel="' + n + '"] [aria-invalid="true"]', root).length;
        errBox.textContent = count === 1 ? 'One field needs attention.' : count + ' fields need attention.';
        bad.focus();
        return false;
      }
      return true;
    }

    function next() {
      if (step === 'done') return;
      if (!check(step)) return;
      if (step < 4) show(step + 1, true); else send();
    }

    function val(n) {
      var el = form.elements[n];
      return el ? String(el.value || '').trim() : '';
    }

    function details() {
      var d = val('date') ? new Date(val('date') + 'T12:00:00') : null;
      return {
        name: val('name'), business: val('business'), phone: val('phone'), email: val('email'), type: val('type'),
        county: val('county'), town: val('town'), status: val('status'), distributor: form.elements.distributor.checked,
        volume: val('volume'), vehicles: val('vehicles'), method: val('method'), date: d, time: val('time'),
        address: val('address'), pay: val('pay'), notes: val('notes')
      };
    }

    function buildReview() {
      var d = details(), lines = MB.order.lines();
      var rows = function (list) {
        return '<dl>' + list.filter(function (r) { return r[1]; }).map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + MB.esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
      };
      $('.od-review', root).innerHTML =
        '<article class="od-block"><header><h4>' + MB.icon('basket') + 'Stock</h4><button type="button" data-goto="1">' + MB.icon('edit') + 'Edit</button></header>' +
        '<ul class="od-block__lines">' + lines.map(function (l) {
          return '<li style="--c:' + l.sku.color + '"><img src="' + MB.img('bottles/' + l.sku.id + '.webp') + '" alt="" width="251" height="921"><span>' + MB.esc(l.sku.name) + '</span><b>' + MB.cases(l.qty) + '</b></li>';
        }).join('') + '</ul></article>' +
        '<article class="od-block"><header><h4>' + MB.icon('store') + 'Business</h4><button type="button" data-goto="2">' + MB.icon('edit') + 'Edit</button></header>' +
        rows([['Name', d.name], ['Business', d.business + (d.type ? ', ' + d.type : '')], ['Phone', d.phone], ['Email', d.email], ['Area', d.town + ', ' + d.county],
          ['Customer', d.status], ['Distributor', d.distributor ? 'Wants to become a distributor' + (d.volume ? ', ' + d.volume : '') : '']]) + '</article>' +
        '<article class="od-block"><header><h4>' + MB.icon('truck') + 'Delivery</h4><button type="button" data-goto="3">' + MB.icon('edit') + 'Edit</button></header>' +
        rows([['Method', d.method === 'Collect' ? 'Collect from Baba Dogo Road' : 'Deliver to my business'], ['Day', d.date ? longDay(d.date) : ''], ['Time', d.time],
          ['Address', d.method === 'Deliver' ? d.address : ''], ['Payment', d.pay], ['Notes', d.notes]]) + '</article>';
      MB.hydrateIcons($('.od-review', root));
    }

    function send() {
      nextBtn.disabled = true;
      nextBtn.classList.add('is-busy');
      var d = details(), lines = MB.order.lines();
      var record = {
        ref: MB.reference('HOLA'), sent: new Date().toISOString(),
        lines: lines.map(function (l) { return { id: l.sku.id, name: l.sku.name, qty: l.qty }; }),
        details: Object.assign({}, d, { date: d.date ? d.date.toISOString().slice(0, 10) : '' })
      };
      setTimeout(function () {
        MB.order.remember(record);
        sentRecord = { record: record, d: d, lines: lines };
        MB.order.save({});
        nextBtn.disabled = false;
        nextBtn.classList.remove('is-busy');
        done();
        if (opts.onSent) opts.onSent(record);
      }, MB.reducedMotion() ? 200 : 1000);
    }

    function done() {
      var r = sentRecord.record, d = sentRecord.d, lines = sentRecord.lines;
      var total = lines.reduce(function (t, l) { return t + l.qty; }, 0);
      var day = d.date ? longDay(d.date) : 'your chosen day';
      var panel = $('[data-panel="done"]', root);
      panel.innerHTML = '<div class="od-done__badge">' + MB.icon('check') + '</div>' +
        '<h3 class="od-done__title">Order request sent</h3>' +
        '<p class="od-done__lead">Thanks, ' + MB.esc(d.name.split(' ')[0]) + '. The trade desk will call <strong>' + MB.esc(d.phone) + '</strong> to confirm prices and stock for ' +
        MB.esc(d.business) + ', then lock in ' + MB.esc(day) + '.</p>' +
        '<dl class="od-done__meta"><div><dt>Reference</dt><dd>' + r.ref + '</dd></div><div><dt>Total</dt><dd>' + MB.cases(total) + '</dd></div>' +
        '<div><dt>' + (d.method === 'Collect' ? 'Collection' : 'Delivery') + '</dt><dd>' + MB.esc(dayLabel(d.date || new Date())) + ', ' + MB.esc((d.time || '').split(',')[0].toLowerCase()) + '</dd></div></dl>' +
        '<ol class="od-track">' +
        '<li class="is-done"><span></span><div><strong>Order request received</strong><p>Just now, reference ' + r.ref + '</p></div></li>' +
        '<li><span></span><div><strong>Prices and stock confirmed</strong><p>The trade desk calls you on ' + MB.esc(d.phone) + '</p></div></li>' +
        '<li><span></span><div><strong>Loaded at Baba Dogo Road</strong><p>The morning of ' + MB.esc(day) + '</p></div></li>' +
        '<li><span></span><div><strong>' + (d.method === 'Collect' ? 'Ready for collection' : 'Delivered to ' + MB.esc(d.town)) + '</strong><p>' + MB.esc(d.time || '') + '</p></div></li></ol>' +
        '<ul class="od-done__lines">' + lines.map(function (l) {
          return '<li style="--c:' + l.sku.color + '"><img src="' + MB.img('bottles/' + l.sku.id + '.webp') + '" alt="" width="251" height="921"><span>' + MB.esc(l.sku.short) + '</span><b>' + l.qty + '</b></li>';
        }).join('') + '</ul>' +
        '<div class="od-done__actions"><button class="btn btn--primary" type="button" data-print>' + MB.icon('print') + 'Print order summary</button>' +
        '<button class="btn btn--ghost" type="button" data-new>' + MB.icon('repeat') + 'Start a new order</button>' +
        '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + 'Call ' + C.phone + '</a></div>';
      step = 'done';
      root.setAttribute('data-step', 'done');
      root.classList.add('is-done');
      $$('.od-panel', root).forEach(function (p) { p.hidden = p !== panel; });
      $$('[data-goto]', root).forEach(function (b) { b.disabled = true; b.removeAttribute('aria-current'); b.parentNode.classList.add('is-done'); });
      panel.focus({ preventScroll: true });
      var top = root.getBoundingClientRect().top;
      if (top < 0) MB.scrollTo(root);
    }

    function restart() {
      form.reset();
      tried = {};
      reached = 1;
      root.classList.remove('is-done');
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      $$('.field__error', form).forEach(function (el) { el.textContent = ''; });
      $$('.has-error', form).forEach(function (el) { el.classList.remove('has-error'); });
      $('.od-dist', root).hidden = true;
      show(1, true);
    }

    function printOrder() {
      var r = sentRecord.record, d = sentRecord.d;
      var box = document.createElement('div');
      box.className = 'od-print';
      box.innerHTML = '<h1>HOLA order request ' + r.ref + '</h1><p>Maisha Beverages Limited, ' + C.street + ', ' + C.city + '. Trade line ' + C.phone + '.</p>' +
        '<table><thead><tr><th>Flavour</th><th>Cases</th></tr></thead><tbody>' + r.lines.map(function (l) { return '<tr><td>HOLA ' + MB.esc(l.name) + '</td><td>' + l.qty + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<p><strong>' + MB.esc(d.business) + '</strong>, ' + MB.esc(d.name) + ', ' + MB.esc(d.phone) + '<br>' + MB.esc(d.town) + ', ' + MB.esc(d.county) + '</p>' +
        '<p>' + (d.method === 'Collect' ? 'Collection' : 'Delivery') + ': ' + MB.esc(d.date ? longDay(d.date) : '') + ', ' + MB.esc(d.time) + (d.address ? '<br>' + MB.esc(d.address) : '') + '</p>' +
        '<p>Prices and stock are confirmed by the trade desk by phone.</p>';
      document.body.appendChild(box);
      var clean = function () { box.remove(); removeEventListener('afterprint', clean); };
      addEventListener('afterprint', clean);
      window.print();
      setTimeout(clean, 1500);
    }

    /* ---------- Events ---------- */
    root.addEventListener('click', function (e) {
      var t = e.target;
      var add = t.closest('.od-item__add');
      if (add) {
        var li = add.closest('.od-item');
        MB.order.add(li.getAttribute('data-id'), 1);
        errBox.textContent = '';
        if (!MB.reducedMotion()) add.querySelector('img').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px) rotate(-4deg)' }, { transform: 'translateY(0)' }], { duration: 320, easing: 'ease-out' });
        return;
      }
      var stepBtn = t.closest('.qty [data-step]');
      if (stepBtn && root.contains(stepBtn)) {
        var box = stepBtn.closest('.qty');
        MB.order.set(box.getAttribute('data-qty'), MB.stepperValue(box) + +stepBtn.getAttribute('data-step'));
        errBox.textContent = '';
        return;
      }
      var line = t.closest('[data-line]');
      if (line) {
        var id = line.getAttribute('data-line'), dd = line.getAttribute('data-d');
        MB.order.set(id, dd === 'x' ? 0 : MB.order.qty(id) + +dd);
        return;
      }
      var go = t.closest('[data-goto]');
      if (go && !go.disabled) { show(+go.getAttribute('data-goto'), true); return; }
      var filter = t.closest('[data-filter]');
      if (filter) {
        var f = filter.getAttribute('data-filter');
        $$('[data-filter]', root).forEach(function (b) { b.setAttribute('aria-pressed', b === filter ? 'true' : 'false'); });
        $$('.od-item', root).forEach(function (li) { li.hidden = f !== 'all' && li.getAttribute('data-group') !== f; });
        return;
      }
      if (t.closest('[data-repeat]')) {
        var last = MB.order.history().slice(-1)[0], o = {};
        last.lines.forEach(function (l) { o[l.id] = +l.qty || 0; });
        MB.order.save(o);
        MB.toast('Your last order is back in the crate');
        return;
      }
      if (t.closest('[data-print]')) { printOrder(); return; }
      if (t.closest('[data-new]')) { restart(); }
    });

    root.addEventListener('change', function (e) {
      var box = e.target.closest('.qty');
      if (box) { MB.order.set(box.getAttribute('data-qty'), MB.stepperValue(box)); return; }
      if (e.target.name === 'distributor') $('.od-dist', root).hidden = !e.target.checked;
      if (e.target.name === 'method') {
        var collect = e.target.value === 'Collect';
        $('.od-address', root).hidden = collect;
        $('.od-day-legend', root).textContent = collect ? 'Collection day *' : 'Delivery day *';
      }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.closest('.qty input')) {
        e.preventDefault();
        var box = e.target.closest('.qty');
        MB.order.set(box.getAttribute('data-qty'), MB.stepperValue(box));
      }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); next(); });
    nextBtn.addEventListener('click', next);
    backBtn.addEventListener('click', function () { if (step > 1) show(step - 1, true); });
    document.addEventListener('mb:order', function () { if (step !== 'done') paint(); });

    show(1, false);

    return {
      goTo: function (n) { if (step !== 'done' && n <= reached) show(n, true); },
      restart: restart
    };
  };
})();
