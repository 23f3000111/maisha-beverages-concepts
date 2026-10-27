/* Concept A, Corporate: page behaviour */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var F = MB.flavours, N = F.length;
  var C = MB.company;

  /* ---------- Who we supply ---------- */
  $('#partner-grid').innerHTML = MB.partners.map(function (p) {
    return '<button class="p-card card3d" type="button" data-partner="' + p.id + '">' +
      '<span class="tile">' + MB.icon(p.icon) + '</span>' +
      '<span class="p-card__title">' + MB.esc(p.name) + '</span><span class="p-card__text">' + MB.esc(p.line) + '</span>' +
      '<span class="p-card__go">See how we work together' + MB.icon('right') + '</span></button>';
  }).join('');

  /* ---------- Range ---------- */
  $('#range-grid').innerHTML = F.map(function (f) {
    return '<button class="f-card card3d" type="button" data-flavour="' + f.id + '" style="--c:' + f.color + '" aria-label="HOLA ' + MB.esc(f.name) + ', ' + f.kind + '. ' + MB.esc(f.line) + '">' +
      '<span class="f-card__shadow" aria-hidden="true"></span>' +
      '<img class="f-card__bottle" src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="" width="251" height="921" loading="lazy">' +
      '<span class="f-card__more" aria-hidden="true">' + MB.icon('plus') + '</span>' +
      '<span class="kind-chip" style="--c:' + f.color + '">' + f.kind + '</span>' +
      '<span class="f-card__name">' + MB.esc(f.name) + '</span>' +
      '<span class="f-card__line">' + MB.esc(f.line) + '</span></button>';
  }).join('');

  function markPicked() {
    var list = MB.enquiry.get();
    $$('.f-card').forEach(function (c) { c.classList.toggle('is-picked', list.indexOf(c.getAttribute('data-flavour')) > -1); });
  }
  markPicked();
  document.addEventListener('mb:enquiry', markPicked);

  /* ---------- FAQ + footer links ---------- */
  $('#faq-list').innerHTML = MB.faq.map(function (item, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + MB.esc(item.q) + MB.icon('plus') + '</summary><p>' + MB.esc(item.a) + '</p></details>';
  }).join('');
  $('#footer-flavours').innerHTML = F.map(function (f) {
    return '<button type="button" data-flavour="' + f.id + '">' + MB.esc(f.name) + '</button>';
  }).join('');

  /* ---------- Hero carousel: bottles on an arc, the active one in front ---------- */
  var stage = $('#stage');
  var holder = $('.stage__bottles', stage);
  var nameEl = $('.stage__name', stage), lineEl = $('.stage__line', stage);
  var active = 0, timer = 0, userTook = false;
  // x: share of half the stage width, y: share of bottle height, r: degrees, s: scale, o: opacity
  var POS = [
    { x: 0, y: 0, r: 0, s: 1, o: 1 },
    { x: 0.37, y: 0.07, r: 7, s: 0.72, o: 1 },
    { x: 0.64, y: 0.13, r: 12, s: 0.56, o: 1 },
    { x: 0.84, y: 0.17, r: 16, s: 0.45, o: 0.92 },
    { x: 0, y: 0.24, r: 0, s: 0.36, o: 0 }
  ];

  holder.innerHTML = F.map(function (f, i) {
    return '<button class="bottle" type="button" data-i="' + i + '" aria-label="Show HOLA ' + MB.esc(f.name) + '">' +
      '<img src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="" width="251" height="921"' + (i < 4 || i > 5 ? '' : ' loading="lazy"') + '></button>';
  }).join('');
  $('.stage__dots', stage).innerHTML = F.map(function (f, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + MB.esc(f.name) + '" style="--dot:' + f.color + '"></button>';
  }).join('');
  var bottles = $$('.bottle', holder), dots = $$('.stage__dots button', stage);

  function offset(i) {
    var d = ((i - active) % N + N) % N;
    return d > N / 2 ? d - N : d;
  }

  function layout() {
    var half = holder.clientWidth / 2, bh = bottles[0].offsetHeight || 400;
    bottles.forEach(function (b, i) {
      var d = offset(i), a = Math.min(Math.abs(d), 4), sign = d < 0 ? -1 : 1, p = POS[a];
      b.style.setProperty('--x', (sign * p.x * half).toFixed(1) + 'px');
      b.style.setProperty('--y', (-p.y * bh).toFixed(1) + 'px');
      b.style.setProperty('--r', (sign * p.r) + 'deg');
      b.style.setProperty('--s', p.s);
      b.style.setProperty('--z', 10 - a);
      b.style.setProperty('--o', p.o);
      b.classList.toggle('is-active', d === 0);
      b.classList.toggle('is-hidden', p.o === 0);
      b.tabIndex = d === 0 ? 0 : -1;
      b.setAttribute('aria-label', d === 0 ? 'HOLA ' + F[i].name + ': open tasting notes' : 'Show HOLA ' + F[i].name);
    });
    var f = F[active];
    stage.style.setProperty('--glow', f.color);
    nameEl.textContent = 'HOLA ' + f.name;
    lineEl.textContent = f.kind + '. ' + f.line;
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === active ? 'true' : 'false'); });
  }

  function go(to, fromUser) {
    active = (to % N + N) % N;
    layout();
    if (fromUser) stopAuto(true);
  }

  function stopAuto(forGood) {
    clearInterval(timer);
    timer = 0;
    if (forGood) userTook = true;
  }
  function startAuto() {
    if (userTook || timer || MB.reducedMotion()) return;
    timer = setInterval(function () { go(active + 1); }, 4800);
  }

  holder.addEventListener('click', function (e) {
    var b = e.target.closest('.bottle');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (i === active) MB.openFlavour(F[i].id); else go(i, true);
  });
  $$('[data-dir]', stage).forEach(function (btn) {
    btn.addEventListener('click', function () { go(active + +btn.getAttribute('data-dir'), true); });
  });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });
  $('[data-open-current]', stage).addEventListener('click', function () { stopAuto(true); MB.openFlavour(F[active].id); });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
  });
  stage.addEventListener('pointerenter', function () { stopAuto(false); });
  stage.addEventListener('pointerleave', startAuto);
  stage.addEventListener('focusin', function () { stopAuto(false); });
  addEventListener('resize', layout);

  // One orchestrated entrance: bottles rise into the arc from the centre out
  stage.classList.add('is-entering');
  layout();
  bottles.forEach(function (b, i) { b.style.transitionDelay = (MB.reducedMotion() ? 0 : 150 + Math.abs(offset(i)) * 110) + 'ms'; });
  var ready = $$('img', holder).slice(0, 4).map(function (img) { return img.decode ? img.decode().catch(function () {}) : null; });
  Promise.race([Promise.all(ready), new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
    requestAnimationFrame(function () {
      layout();
      stage.classList.remove('is-entering');
      setTimeout(function () { bottles.forEach(function (b) { b.style.transitionDelay = ''; }); startAuto(); }, 1500);
    });
  });

  /* ---------- Why stock HOLA ---------- */
  var REASONS = [
    { icon: 'coins', title: 'Priced to move', text: 'Save your shilling, prosper. HOLA sits at a price point that suits Kenyan shoppers, so stock keeps turning in shops, kiosks and supermarkets.' },
    { icon: 'spark', title: 'Flavours shoppers can’t find elsewhere', text: 'Mojito, Rosé, Sweet Limão and Mango Special give your customers something new next to the usual cola and orange.' },
    { icon: 'eye', title: 'Labels that sell from the fridge', text: 'Bold, patterned labels in ten colours stand out in a crowded cooler door and on a busy shelf.' },
    { icon: 'factory', title: 'Made in Nairobi, close to your stores', text: 'Local production keeps lead times short and restocks steady, without waiting on imports.' }
  ];
  var why = $('#why-panel'), wi = 0;
  var slides = $$('.why__slide', why), pills = $('.why__pills', why);
  pills.innerHTML = REASONS.map(function (r, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + MB.esc(r.title) + '">' + MB.icon(r.icon) + '</button>';
  }).join('');
  function showWhy(i, animate) {
    wi = (i + REASONS.length) % REASONS.length;
    var r = REASONS[wi];
    $('.why__title', why).textContent = r.title;
    $('.why__text', why).textContent = r.text;
    $('.why__count span', why).textContent = wi + 1;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === wi); });
    $$('button', pills).forEach(function (b, k) { b.setAttribute('aria-pressed', k === wi ? 'true' : 'false'); });
    if (animate && !MB.reducedMotion()) {
      [$('.why__title', why), $('.why__text', why)].forEach(function (el, k) {
        el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: k * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    }
  }
  showWhy(0, false);
  $$('[data-why-dir]', why).forEach(function (b) { b.addEventListener('click', function () { showWhy(wi + +b.getAttribute('data-why-dir'), true); }); });
  $$('button', pills).forEach(function (b) { b.addEventListener('click', function () { showWhy(+b.getAttribute('data-i'), true); }); });

  /* ---------- Dialogs ---------- */
  function flavourHTML(id) {
    var f = MB.flavour(id), i = F.indexOf(f), prev = F[(i - 1 + N) % N], next = F[(i + 1) % N], on = MB.enquiry.has(id);
    return '<article class="fm" style="--c:' + f.color + '" data-id="' + id + '">' +
      '<div class="fm__media"><img src="' + MB.img('studio/' + id + '.webp') + '" alt="HOLA ' + MB.esc(f.name) + ' bottle, studio photograph" width="548" height="910"></div>' +
      '<div class="fm__body"><span class="kind-chip" style="--c:' + f.color + '">' + f.kind + '</span>' +
      '<h2 class="fm__name">HOLA ' + MB.esc(f.name) + '</h2>' +
      '<p class="fm__desc">' + MB.esc(f.desc) + '</p>' +
      '<ul class="fm__notes">' + f.notes.map(function (n) { return '<li>' + MB.esc(n) + '</li>'; }).join('') + '</ul>' +
      '<dl class="fm__specs"><div><dt>Format</dt><dd>Single-serve PET bottle</dd></div><div><dt>Best served</dt><dd>Ice cold</dd></div><div><dt>Trade packs</dt><dd>Cases, priced by volume</dd></div></dl>' +
      '<div class="fm__actions"><button class="btn btn--primary' + (on ? ' is-on' : '') + '" type="button" data-add="' + id + '">' +
      (on ? MB.icon('check') + 'On your enquiry' : MB.icon('plus') + 'Add to my enquiry') + '</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + 'Call the trade line</a></div>' +
      '<div class="fm__nav"><button type="button" data-go="' + prev.id + '">' + MB.icon('left') + MB.esc(prev.name) + '</button>' +
      '<button type="button" data-go="' + next.id + '">' + MB.esc(next.name) + MB.icon('right') + '</button></div>' +
      '</div></article>';
  }

  function addButtonState(btn, on) {
    btn.classList.toggle('is-on', on);
    btn.innerHTML = on ? MB.icon('check') + 'On your enquiry' : MB.icon('plus') + 'Add to my enquiry';
  }

  function handleAdd(btn) {
    var id = btn.getAttribute('data-add');
    var on = MB.enquiry.toggle(id);
    var name = (MB.flavour(id) || MB.energyRange.find(function (e) { return e.id === id; })).name;
    if (btn.classList.contains('btn--primary')) addButtonState(btn, on);
    else btn.innerHTML = (on ? MB.icon('check') + 'On your enquiry' : MB.icon('plus') + 'Add to my enquiry');
    MB.toast(on ? name + ' added to your enquiry' : name + ' removed from your enquiry');
  }

  MB.openFlavour = function (id) {
    var open = $('dialog.mb-dialog[open] .fm');
    if (open) { open.outerHTML = flavourHTML(id); return; }
    MB.modal.open(flavourHTML(id), {
      label: 'HOLA ' + MB.flavour(id).name,
      onOpen: function (d) {
        d.querySelector('.mb-dialog__panel').addEventListener('click', function (e) {
          var add = e.target.closest('[data-add]'), nav = e.target.closest('[data-go]');
          if (add) handleAdd(add);
          if (nav) {
            var fm = d.querySelector('.fm');
            fm.outerHTML = flavourHTML(nav.getAttribute('data-go'));
            var again = d.querySelector('[data-go="' + nav.getAttribute('data-go') + '"]');
            if (again) again.focus();
          }
        });
      }
    });
  };

  function openPartner(id) {
    var p = MB.partners.find(function (x) { return x.id === id; });
    MB.modal.open('<div class="pm"><span class="tile">' + MB.icon(p.icon) + '</span><h2>' + MB.esc(p.name) + '</h2>' +
      '<p class="pm__line">' + MB.esc(p.line) + '</p><ul class="pm__points">' +
      p.points.map(function (t) { return '<li>' + MB.icon('check') + '<span>' + MB.esc(t) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="pm__actions"><button class="btn btn--primary" type="button" data-start>Start your enquiry</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + 'Call ' + C.phone + '</a></div></div>', {
      label: p.name, className: 'mb-dialog--narrow',
      onOpen: function (d) {
        d.querySelector('[data-start]').addEventListener('click', function () { MB.prefillForm({ type: MB.partnerToType[id] }); });
      }
    });
  }

  function openEnergy() {
    MB.modal.open('<div class="em"><div class="em__head"><span class="kind-chip" style="--c:#5A2E96">Energy drinks</span>' +
      '<h2>HOLA Energy, three ways</h2><p>Carbonated energy drinks with explosive flavour. Stock all three to give shoppers a choice of kick.</p></div>' +
      '<div class="em__grid">' + MB.energyRange.map(function (e) {
        var on = MB.enquiry.has(e.id);
        return '<article class="em__item"><img src="' + MB.img(e.img) + '" alt="' + MB.esc(e.name) + ' bottle" width="600" height="995">' +
          '<div><h3>' + MB.esc(e.name) + '</h3><p>' + MB.esc(e.desc) + '</p>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-add="' + e.id + '">' + (on ? MB.icon('check') + 'On your enquiry' : MB.icon('plus') + 'Add to my enquiry') + '</button></div></article>';
      }).join('') + '</div></div>', {
      label: 'HOLA Energy range',
      onOpen: function (d) {
        d.addEventListener('click', function (e) { var add = e.target.closest('[data-add]'); if (add) handleAdd(add); });
      }
    });
  }

  document.addEventListener('click', function (e) {
    var fl = e.target.closest('[data-flavour]'), pa = e.target.closest('[data-partner]');
    if (fl) MB.openFlavour(fl.getAttribute('data-flavour'));
    if (pa) openPartner(pa.getAttribute('data-partner'));
    if (e.target.closest('[data-open-energy]')) openEnergy();
    if (e.target.closest('[data-open-chat]')) MB.chat.open();
  });

  /* ---------- Nav state ---------- */
  var links = $$('.nav a');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['partners', 'range', 'why', 'story', 'distributor', 'faq', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

  /* ---------- Wire up shared parts ---------- */
  MB.hydrateIcons(document);
  MB.headerScroll($('.header'));
  MB.tilt($$('.card3d'), 6);
  MB.liteYouTube($('.story__video'));
  MB.initForm($('#dist-form'));
  MB.chat.init({
    title: 'HOLA trade assistant',
    subtitle: 'Replies instantly',
    launcher: 'Trade assistant',
    teaser: 'Looking to stock HOLA? I can help with prices, flavours and delivery.'
  });
})();
