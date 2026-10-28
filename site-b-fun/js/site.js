/* Concept B, Fun (after Sayian): flavour cards, supply cards, order desk, feed polaroids,
   mixes carousel, distributor form. Shared pieces live in ../shared/js. */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var F = MB.flavours;

  /* ---------- Explore flavours ---------- */
  var BADGES = { energy: 'Liquid gold', mojito: 'Mix me' };
  $('#flavour-grid').innerHTML = F.map(function (f) {
    var t = MB.tones[f.id];
    return '<article class="fcard" style="--bg:' + t.bg + ';--on:' + t.ink + '">' +
      (BADGES[f.id] ? '<span class="fcard__badge">' + BADGES[f.id] + '</span>' : '') +
      '<h3 class="fcard__name">' + MB.esc(f.name) + '</h3>' +
      '<button class="fcard__shot" type="button" ' + (f.id === 'energy' ? 'data-open-energy' : 'data-flavour="' + f.id + '"') + ' aria-label="HOLA ' + MB.esc(f.name) + ', tasting notes">' +
      '<img src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="" width="251" height="921" loading="lazy"></button>' +
      '<p class="fcard__line">' + MB.esc(f.id === 'energy' ? 'Our liquid gold, plus Red Berries and Green Peach & Lemongrass.' : f.line) + '</p>' +
      '<div class="fcard__btns"><button class="btn fcard__add" type="button" data-quick-add="' + f.id + '" data-cases="5">Add 5 cases</button>' +
      '<button class="btn fcard__more" type="button" ' + (f.id === 'energy' ? 'data-open-energy' : 'data-flavour="' + f.id + '"') + '>Details</button></div></article>';
  }).join('');

  /* ---------- Who we supply ---------- */
  $('#supply-grid').innerHTML = MB.partners.map(function (p) {
    return '<button class="scard" type="button" data-partner="' + p.id + '">' +
      '<span class="scard__line">&ldquo;' + MB.esc(p.line) + '&rdquo;</span>' +
      '<span class="scard__name">' + MB.esc(p.name) + '</span><span class="scard__go">See how we work together</span>' +
      '<span class="scard__icon">' + MB.icon(p.icon) + '</span></button>';
  }).join('');

  /* ---------- Order desk ---------- */
  MB.orderDesk($('#order-desk'), { viz: 'crate' });

  /* ---------- Feed polaroids ---------- */
  var SNAPS = [
    { img: 'life/mojito-field.webp', cap: 'Mojito in the sun', flavour: 'mojito', r: -6, y: 24 },
    { img: 'life/poolside.webp', cap: 'Poolside line-up', flavour: 'mango', r: 4, y: -6 },
    { img: 'life/rose-sunset.webp', cap: 'Rosé at sunset', flavour: 'rose', r: -3, y: 30 },
    { img: 'life/hands-four.webp', cap: 'Pick your flavour', flavour: 'berry', r: 5, y: 0 },
    { img: 'life/orange-leaves.webp', cap: 'Bright, bold Orange', flavour: 'orange', r: -5, y: 26 },
    { img: 'life/cola-glass.webp', cap: 'Cola over ice', flavour: 'cola', r: 3, y: 4 }
  ];
  $('#polaroids').innerHTML = SNAPS.map(function (s, i) {
    return '<button class="pol" type="button" data-snap="' + i + '" style="--r:' + s.r + 'deg;--y:' + s.y + 'px" aria-label="' + MB.esc(s.cap) + ', open photo">' +
      '<img src="' + MB.img(s.img) + '" alt="" width="1050" height="1400" loading="lazy">' +
      '<span class="pol__meta"><span class="pol__avatar"></span><span class="pol__handle">@hola_beverages</span><span class="pol__cap">' + MB.esc(s.cap) + '</span></span></button>';
  }).join('');
  $('#polaroids').addEventListener('click', function (e) {
    var b = e.target.closest('[data-snap]');
    if (!b) return;
    var s = SNAPS[+b.getAttribute('data-snap')], f = MB.flavour(s.flavour);
    MB.modal.open('<div class="lb"><img class="lb__img" src="' + MB.img(s.img) + '" alt="' + MB.esc(s.cap) + '" width="1050" height="1400">' +
      '<div class="lb__body"><p class="fm__kind">@hola_beverages</p><h2>' + MB.esc(s.cap) + '</h2><p>HOLA ' + MB.esc(f.name) + '. ' + MB.esc(f.line) + '</p>' +
      '<button class="btn btn--hot" type="button" data-quick-add="' + f.id + '" data-cases="5">Add 5 cases of ' + MB.esc(f.name) + '</button>' +
      '<a class="btn btn--ghost" href="' + MB.company.instagram + '" target="_blank" rel="noopener">More on Instagram</a></div></div>', {
      label: s.cap, className: 'mb-dialog--photo',
      onOpen: function (d) {
        d.addEventListener('click', function (ev) {
          var add = ev.target.closest('[data-quick-add]');
          if (add) MB.addToOrder(add.getAttribute('data-quick-add'), 5);
        });
      }
    });
  });

  /* ---------- Mixes carousel ---------- */
  var mtabs = $('.mtabs'), track = $('#mix-track');
  // Sideways swipes scroll the cards natively; up and down still glide the page
  track.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.lenisStopPropagation = true;
  }, { passive: true });
  var TYPES = [{ id: 'all', name: 'All mixes' }].concat(MB.recipeTypes);
  mtabs.innerHTML = TYPES.map(function (t, i) {
    return '<button type="button" role="tab" id="mtab-' + t.id + '" aria-controls="mix-track" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-type="' + t.id + '">' + t.name + '</button>';
  }).join('');
  function showMixes(type) {
    $$('[role="tab"]', mtabs).forEach(function (b) {
      var on = b.getAttribute('data-type') === type;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    track.setAttribute('aria-labelledby', 'mtab-' + type);
    track.innerHTML = MB.recipes.filter(function (r) { return type === 'all' || r.type === type; }).map(function (r, i) {
      var t = MB.tones[r.flavour], kind = MB.recipeTypes.find(function (x) { return x.id === r.type; });
      return '<button class="mix" type="button" data-recipe="' + r.id + '" style="--bg:' + t.bg + ';--on:' + t.ink + ';animation-delay:' + Math.min(i, 5) * 60 + 'ms">' +
        '<span class="mix__photo"><span class="mix__type">' + kind.one + '</span><img src="' + MB.img(r.img) + '" alt="" width="800" height="1000" loading="lazy"></span>' +
        '<span class="mix__bar"><span class="mix__name">' + MB.esc(r.name) + '</span>' + MB.icon('right') + '</span></button>';
    }).join('');
    track.scrollLeft = 0;
  }
  mtabs.addEventListener('click', function (e) {
    var b = e.target.closest('[role="tab"]');
    if (b) showMixes(b.getAttribute('data-type'));
  });
  mtabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var tabs = $$('[role="tab"]', mtabs), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    showMixes(next.getAttribute('data-type'));
  });
  $$('[data-mix]').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = $('.mix', track), step = card ? card.offsetWidth + 18 : 360;
      track.scrollBy({ left: +b.getAttribute('data-mix') * step * 2, behavior: MB.reducedMotion() ? 'auto' : 'smooth' });
    });
  });
  showMixes('all');

  /* ---------- FAQ + footer ---------- */
  $('#faq-list').innerHTML = MB.faq.slice(0, 5).map(function (item, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + MB.esc(item.q) + MB.icon('plus') + '</summary><p>' + MB.esc(item.a) + '</p></details>';
  }).join('');
  $('#footer-flavours').innerHTML = F.map(function (f) {
    return '<button type="button" ' + (f.id === 'energy' ? 'data-open-energy' : 'data-flavour="' + f.id + '"') + '>' + MB.esc(f.name) + '</button>';
  }).join('');

  /* ---------- Gentle parallax on the floating fruit ---------- */
  if (!MB.reducedMotion()) {
    var par = $$('.fruit');
    par.forEach(function (el, i) { el.setAttribute('data-par', ''); el.style.setProperty('--par', [-0.12, 0.1, -0.08, 0.14][i % 4]); });
    var raf = 0;
    var onScroll = function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        par.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          el.style.setProperty('--sy', Math.round(r.top));
        });
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Nav state ---------- */
  var links = $$('.nav a');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['hero', 'flavours', 'supply', 'order', 'feed', 'story', 'mixes', 'sell', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

  /* ---------- Shared parts ---------- */
  MB.smoothScroll();
  MB.hydrateIcons(document);
  MB.headerScroll($('.header'));
  MB.bindOrderCount();
  MB.liteYouTube($('.founder__video'));
  MB.initForm($('#dist-form'));
  MB.chat.init({
    title: 'HOLA helper',
    subtitle: 'Replies instantly',
    launcher: 'Ask HOLA',
    teaser: 'Hola! Want to order, sell HOLA or find a recipe? Ask me.'
  });
})();
