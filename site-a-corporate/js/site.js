/* Concept A, Corporate (after Brio): hero arc, scroll-driven flavour story, why stepper,
   order desk, recipes, distributor band. Shared pieces live in ../shared/js. */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var F = MB.flavours, N = F.length;
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- Hero: bottles on an arc, the page takes the colour of the one in front ---------- */
  var hero = $('#hero'), stage = $('#stage'), holder = $('.hero__bottles', stage);
  var nameEl = $('.hero__name', hero), metaEl = $('.hero__meta', hero);
  var active = 0, timer = 0, userTook = false;
  // x: share of half the stage width, y: share of bottle height, r: degrees, s: scale
  var POS = [
    { x: 0, y: 0, r: 0, s: 1, o: 1 },
    { x: 0.3, y: 0.05, r: 7, s: 0.76, o: 1 },
    { x: 0.58, y: 0.1, r: 13, s: 0.6, o: 1 },
    { x: 0.86, y: 0.14, r: 20, s: 0.5, o: 1 },
    { x: 1.16, y: 0.2, r: 26, s: 0.44, o: 0 }
  ];
  holder.innerHTML = F.map(function (f, i) {
    return '<button class="hbottle" type="button" data-i="' + i + '" aria-label="Show HOLA ' + MB.esc(f.name) + '">' +
      '<img src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="" width="251" height="921"></button>';
  }).join('');
  $('.hero__dots', hero).innerHTML = F.map(function (f, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + MB.esc(f.name) + '"></button>';
  }).join('');
  var bottles = $$('.hbottle', holder), dots = $$('.hero__dots button', hero);

  function offset(i) {
    var d = ((i - active) % N + N) % N;
    return d > N / 2 ? d - N : d;
  }
  function layout() {
    var half = holder.clientWidth / 2, bh = holder.clientHeight;
    bottles.forEach(function (b, i) {
      var d = offset(i), a = Math.min(Math.abs(d), 4), sign = d < 0 ? -1 : 1, p = POS[a];
      b.style.setProperty('--x', (sign * p.x * half).toFixed(1) + 'px');
      b.style.setProperty('--y', (p.y * bh).toFixed(1) + 'px');
      b.style.setProperty('--r', (sign * p.r) + 'deg');
      b.style.setProperty('--s', p.s);
      b.style.setProperty('--z', 10 - a);
      b.style.setProperty('--o', p.o);
      b.classList.toggle('is-hidden', !p.o);
      b.classList.toggle('is-active', d === 0);
      b.tabIndex = d === 0 ? 0 : -1;
      b.setAttribute('aria-label', d === 0 ? 'HOLA ' + F[i].name + ': open tasting notes' : 'Show HOLA ' + F[i].name);
    });
    var f = F[active], t = MB.tones[f.id];
    hero.style.setProperty('--hero-bg', t.bg);
    hero.style.setProperty('--hero-on', t.ink);
    nameEl.textContent = f.name;
    nameEl.setAttribute('aria-label', 'HOLA ' + f.name + ', open tasting notes');
    metaEl.innerHTML = '<span>' + pad(active + 1) + ' / ' + pad(N) + '</span><span>' + MB.esc(f.line) + '</span>';
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === active ? 'true' : 'false'); });
  }
  function go(to, fromUser) {
    active = (to % N + N) % N;
    layout();
    if (fromUser) stopAuto(true);
  }
  function stopAuto(forGood) { clearInterval(timer); timer = 0; if (forGood) userTook = true; }
  function startAuto() {
    if (userTook || timer || MB.reducedMotion()) return;
    timer = setInterval(function () { go(active + 1); }, 5000);
  }
  holder.addEventListener('click', function (e) {
    var b = e.target.closest('.hbottle');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (i === active) MB.openFlavour(F[i].id); else go(i, true);
  });
  $$('[data-dir]', hero).forEach(function (btn) {
    btn.addEventListener('click', function () { go(active + +btn.getAttribute('data-dir'), true); });
  });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });
  nameEl.addEventListener('click', function () { stopAuto(true); MB.openFlavour(F[active].id); });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
  });
  hero.addEventListener('pointerenter', function () { stopAuto(false); });
  hero.addEventListener('pointerleave', startAuto);
  hero.addEventListener('focusin', function () { stopAuto(false); });
  addEventListener('resize', layout);

  // The one orchestrated entrance: bottles rise into the arc from the centre out
  stage.classList.add('is-entering');
  layout();
  bottles.forEach(function (b, i) { b.style.transitionDelay = (MB.reducedMotion() ? 0 : 120 + Math.abs(offset(i)) * 110) + 'ms'; });
  var ready = $$('img', holder).map(function (img) { return img.decode ? img.decode().catch(function () {}) : null; });
  Promise.race([Promise.all(ready), new Promise(function (r) { setTimeout(r, 1400); })]).then(function () {
    requestAnimationFrame(function () {
      stage.classList.remove('is-entering');
      setTimeout(function () { bottles.forEach(function (b) { b.style.transitionDelay = ''; }); startAuto(); }, 1500);
    });
  });

  /* ---------- Flavour story: one screen of scroll per flavour ----------
     Every fade and move follows the scroll position (no timed transitions), so the story goes
     exactly as fast as the reader scrolls, and a resting scroll settles on a whole flavour. */
  var taste = $('#flavours'), pin = $('.taste__pin', taste), slidesBox = $('.taste__slides', taste);
  var HOLD = 0.55; // share of each flavour's screen where it simply stays put
  taste.style.setProperty('--n', N);
  slidesBox.innerHTML = F.map(function (f, i) {
    var t = MB.tones[f.id];
    return '<article class="taste__slide" data-i="' + i + '" style="--on:' + t.ink + '" aria-hidden="true">' +
      '<div class="taste__copy"><p class="taste__eyebrow">' + pad(i + 1) + ' &middot; ' + f.kind + '</p>' +
      '<h3 class="taste__name">' + MB.esc(f.name) + '</h3>' +
      '<p class="taste__line">' + MB.esc(f.line) + '</p>' +
      '<ul class="taste__notes">' + f.notes.map(function (n) { return '<li>' + MB.esc(n) + '</li>'; }).join('') + '</ul>' +
      '<div class="taste__cta"><button class="btn btn--light" type="button" data-quick-add="' + f.id + '" data-cases="5">' + MB.icon('basket') + 'Add 5 cases</button>' +
      '<button class="taste__more" type="button" data-flavour="' + f.id + '">Tasting notes</button></div></div>' +
      '<div class="taste__media"><div class="taste__photo"><img src="' + MB.img('macro/' + f.id + '.webp') + '" alt="" width="880" height="1100" loading="lazy"></div>' +
      '<img class="taste__bottle" src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="HOLA ' + MB.esc(f.name) + ' bottle" width="251" height="921" loading="lazy"></div>' +
      '</article>';
  }).join('');
  $('.taste__dots', taste).innerHTML = F.map(function (f, i) {
    return '<button type="button" data-i="' + i + '" style="--c:' + MB.tones[f.id].bg + '" aria-label="' + MB.esc(f.name) + '"></button>';
  }).join('');
  var tdots = $$('.taste__dots button', taste), tActive = -1;
  var parts = $$('.taste__slide', taste).map(function (s) {
    return { el: s, copy: $('.taste__copy', s), photo: $('.taste__photo', s), bottle: $('.taste__bottle', s) };
  });
  var RGB = F.map(function (f) {
    var h = MB.tones[f.id].bg;
    return [1, 3, 5].map(function (k) { return parseInt(h.substr(k, 2), 16); });
  });
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (t) { return t * t * (3 - 2 * t); };

  // u runs 0..N down the section; d is the place inside the current flavour's screen;
  // e is how far the hand-over to the next flavour has got (0 while holding)
  function tasteState() {
    var r = taste.getBoundingClientRect(), span = taste.offsetHeight - innerHeight;
    var u = clamp(-r.top / span, 0, 1) * N, i = Math.min(N - 1, Math.floor(u)), d = u - i;
    return { r: r, span: span, u: u, i: i, d: d, e: i < N - 1 ? clamp((d - HOLD) / (1 - HOLD), 0, 1) : 0 };
  }
  function place(p, o) {
    p.copy.style.opacity = o.copyO.toFixed(3);
    p.copy.style.transform = 'translateY(calc(-50% + ' + o.copyY.toFixed(1) + 'px))';
    p.photo.style.opacity = o.photoO.toFixed(3);
    p.photo.style.transform = 'scale(' + o.photoS.toFixed(4) + ')';
    p.bottle.style.opacity = o.bottleO.toFixed(3);
    p.bottle.style.transform = 'translateY(' + o.bottleY.toFixed(1) + 'px) rotate(' + o.bottleR.toFixed(2) + 'deg)';
  }
  function renderTaste() {
    var s = tasteState(), i = s.i, e = smooth(s.e), h = clamp(s.d / HOLD, 0, 1);
    var reduced = MB.reducedMotion(), active = s.e >= 0.5 ? i + 1 : i;
    pin.style.setProperty('--p', (s.u / N).toFixed(4));
    var a = RGB[i], b = RGB[Math.min(N - 1, i + 1)], m = reduced ? (active > i ? 1 : 0) : clamp((s.e - 0.15) / 0.7, 0, 1);
    pin.style.backgroundColor = 'rgb(' + a.map(function (c, k) { return Math.round(c + (b[k] - c) * m); }).join(',') + ')';
    parts.forEach(function (p, k) {
      var near = reduced ? k === active : k === i || (k === i + 1 && s.e > 0);
      p.el.classList.toggle('is-near', near);
      if (!near) return;
      if (reduced) place(p, { copyO: 1, copyY: 0, photoO: 1, photoS: 1, bottleO: 1, bottleY: 0, bottleR: 8 });
      else if (k === i) place(p, {
        copyO: 1 - clamp(e / 0.5, 0, 1), copyY: -44 * e,
        photoO: 1 - clamp((e - 0.25) / 0.6, 0, 1), photoS: 1.04 - 0.04 * h - 0.05 * e,
        bottleO: 1 - clamp((e - 0.2) / 0.55, 0, 1), bottleY: 14 - 26 * h - 100 * e, bottleR: 10 - 4 * h - 16 * e
      });
      else place(p, {
        copyO: clamp((e - 0.5) / 0.5, 0, 1), copyY: 44 * (1 - e),
        photoO: clamp((e - 0.15) / 0.6, 0, 1), photoS: 1.04 + 0.06 * (1 - e),
        bottleO: clamp((e - 0.25) / 0.55, 0, 1), bottleY: 14 + 120 * (1 - e), bottleR: 10 + 14 * (1 - e)
      });
    });
    if (active === tActive) return;
    tActive = active;
    pin.style.color = MB.tones[F[active].id].ink;
    parts.forEach(function (p, k) {
      p.el.classList.toggle('is-active', k === active);
      p.el.setAttribute('aria-hidden', k === active ? 'false' : 'true');
      $$('button', p.el).forEach(function (bt) { bt.tabIndex = k === active ? 0 : -1; });
    });
    tdots.forEach(function (dot, k) { dot.setAttribute('aria-current', k === active ? 'true' : 'false'); });
  }

  // When scrolling stops halfway between two flavours, glide to the nearer whole one
  function settleTaste() {
    if (!MB.lenis || document.documentElement.classList.contains('mb-modal-open')) return;
    var s = tasteState();
    if (s.r.top > 1 || s.r.bottom < innerHeight - 1 || s.e <= 0.01 || s.e >= 0.99) return;
    var to = s.e < 0.5 ? s.i + HOLD - 0.002 : s.i + 1.002;
    MB.scrollTo(s.r.top + scrollY + to / N * s.span, { duration: 0.7 });
  }
  var tRaf = 0, tSettle = 0;
  addEventListener('scroll', function () {
    cancelAnimationFrame(tRaf);
    tRaf = requestAnimationFrame(renderTaste);
    clearTimeout(tSettle);
    tSettle = setTimeout(settleTaste, 170);
  }, { passive: true });
  addEventListener('resize', renderTaste);
  tdots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      var top = taste.getBoundingClientRect().top + scrollY, span = taste.offsetHeight - innerHeight;
      MB.scrollTo(top + (i + HOLD / 2) / N * span, { duration: 1.1 });
    });
  });
  renderTaste();

  /* ---------- Why HOLA ---------- */
  var REASONS = [
    { icon: 'list', flavour: 'berry', stat: '10', label: 'flavours from one supplier', text: 'Seven soft drinks and three energy drinks on one order, so your shelf and your fridge stay full and varied.' },
    { icon: 'spark', flavour: 'mojito', stat: '60', label: 'years of the same few flavours. Until HOLA.', text: 'Mojito, Rosé, Sweet Limão and Mango Special give your customers something new next to the usual cola and orange.' },
    { icon: 'coins', flavour: 'orange', stat: 'KSh', label: 'save your shilling, prosper', text: 'HOLA sits at a price point that suits Kenyan shoppers, so stock keeps turning in kiosks, shops and supermarkets.' },
    { icon: 'pin', flavour: 'cola', stat: '100%', label: 'made in Kenya, by Kenyans', text: 'Local production keeps lead times short and restocks steady, without waiting on imports.' }
  ];
  var why = $('#why'), wi = 0, whyBottle = $('.why__bottle', why), whyTabs = $('.why__tabs', why);
  whyTabs.innerHTML = REASONS.map(function (r, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + MB.esc(r.label) + '">' + MB.icon(r.icon) + '</button>';
  }).join('');
  function showWhy(i, animate) {
    wi = (i + REASONS.length) % REASONS.length;
    var r = REASONS[wi], t = MB.tones[r.flavour];
    why.style.setProperty('--w-bg', t.bg);
    why.style.setProperty('--w-on', t.ink);
    $('.why__stat', why).textContent = r.stat;
    $('.why__label', why).textContent = r.label;
    $('.why__text', why).textContent = r.text;
    $('.why__count', why).textContent = pad(wi + 1) + ' / ' + pad(REASONS.length);
    $$('button', whyTabs).forEach(function (b, k) { b.setAttribute('aria-pressed', k === wi ? 'true' : 'false'); });
    var src = MB.img('bottles/' + r.flavour + '.webp');
    if (animate && !MB.reducedMotion()) {
      whyBottle.classList.add('is-swap');
      setTimeout(function () { whyBottle.src = src; whyBottle.classList.remove('is-swap'); }, 300);
      [$('.why__stat', why), $('.why__label', why), $('.why__text', why)].forEach(function (el, k) {
        el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: k * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    } else {
      whyBottle.src = src;
    }
  }
  showWhy(0, false);
  $$('[data-why-dir]', why).forEach(function (b) { b.addEventListener('click', function () { showWhy(wi + +b.getAttribute('data-why-dir'), true); }); });
  $$('button', whyTabs).forEach(function (b) { b.addEventListener('click', function () { showWhy(+b.getAttribute('data-i'), true); }); });

  /* ---------- Order desk ---------- */
  MB.orderDesk($('#order-desk'), { viz: 'bar' });

  /* ---------- Recipes ---------- */
  var TAB_ICONS = { food: 'utensils', mocktail: 'citrus', cocktail: 'martini' };
  var rtabs = $('.rtabs'), rgrid = $('#recipe-grid');
  rtabs.innerHTML = MB.recipeTypes.map(function (t, i) {
    return '<button type="button" role="tab" id="rtab-' + t.id + '" aria-controls="recipe-grid" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-type="' + t.id + '">' +
      MB.icon(TAB_ICONS[t.id]) + t.name + '</button>';
  }).join('');
  function showRecipes(type) {
    $$('[role="tab"]', rtabs).forEach(function (b) {
      var on = b.getAttribute('data-type') === type;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    rgrid.setAttribute('aria-labelledby', 'rtab-' + type);
    rgrid.innerHTML = MB.recipes.filter(function (r) { return r.type === type; }).map(function (r, i) {
      var t = MB.tones[r.flavour];
      return '<button class="rc" type="button" data-recipe="' + r.id + '" style="--bg:' + t.bg + ';--on:' + t.ink + ';animation-delay:' + (i * 60) + 'ms">' +
        '<span class="rc__photo"><img src="' + MB.img(r.img) + '" alt="" width="800" height="1000" loading="lazy"></span>' +
        '<span class="rc__body"><span class="rc__meta"><span>' + r.serves + '</span><span>' + r.time + '</span></span>' +
        '<span class="rc__name">' + MB.esc(r.name) + '</span></span>' +
        '<img class="rc__bottle" src="' + MB.img('bottles/' + r.flavour + '.webp') + '" alt="" width="251" height="921" loading="lazy"></button>';
    }).join('');
  }
  rtabs.addEventListener('click', function (e) {
    var b = e.target.closest('[role="tab"]');
    if (b) showRecipes(b.getAttribute('data-type'));
  });
  rtabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var tabs = $$('[role="tab"]', rtabs), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    showRecipes(next.getAttribute('data-type'));
  });
  showRecipes('food');

  /* ---------- Social: HOLA's own photos, each one opens their Instagram ---------- */
  var SNAPS = [
    { img: 'life/mojito-field.webp', cap: 'Mojito in the sun' },
    { img: 'life/poolside.webp', cap: 'Poolside line-up' },
    { img: 'life/rose-sunset.webp', cap: 'Rosé at sunset' },
    { img: 'life/hands-four.webp', cap: 'Pick your flavour' },
    { img: 'life/orange-leaves.webp', cap: 'Bright, bold Orange' },
    { img: 'life/cola-glass.webp', cap: 'Cola over ice' }
  ];
  $('#social-photos').innerHTML = SNAPS.map(function (s) {
    return '<a class="sp" href="' + MB.company.instagram + '" target="_blank" rel="noopener" aria-label="' + MB.esc(s.cap) + '. See more on HOLA&rsquo;s Instagram (opens in a new tab)">' +
      '<img src="' + MB.img(s.img) + '" alt="" width="1050" height="1400" loading="lazy">' +
      '<span class="sp__over" aria-hidden="true">' + MB.icon('instagram') + '@hola_beverages</span></a>';
  }).join('');

  /* ---------- Distributors, FAQ, footer ---------- */
  $('#partner-chips').innerHTML = MB.partners.map(function (p) {
    return '<button type="button" data-partner="' + p.id + '">' + MB.icon(p.icon) + MB.esc(p.short) + '</button>';
  }).join('');
  $('#faq-list').innerHTML = MB.faq.map(function (item, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + MB.esc(item.q) + MB.icon('plus') + '</summary><p>' + MB.esc(item.a) + '</p></details>';
  }).join('');
  $('#footer-flavours').innerHTML = F.map(function (f) {
    return '<button type="button" data-flavour="' + f.id + '">' + MB.esc(f.name) + '</button>';
  }).join('');
  $('#footer-dots').innerHTML = F.map(function (f) { return '<span style="--c:' + MB.tones[f.id].bg + '"></span>'; }).join('');

  /* ---------- Nav state ---------- */
  var links = $$('.nav a');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['hero', 'flavours', 'why', 'order', 'recipes', 'distributor', 'story', 'social', 'faq', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

  /* ---------- Shared parts ---------- */
  MB.smoothScroll();
  MB.hydrateIcons(document);
  MB.headerScroll($('.header'));
  MB.bindOrderCount();
  MB.liteYouTube($('.story__video'));
  MB.initForm($('#dist-form'));
  MB.chat.init({
    title: 'HOLA trade assistant',
    subtitle: 'Replies instantly',
    launcher: 'Trade assistant',
    teaser: 'Ordering for your shop or bar? I can help with stock, recipes and delivery.'
  });
})();
