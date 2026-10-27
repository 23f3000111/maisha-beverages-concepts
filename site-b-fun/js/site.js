/* Concept B, Fun: page behaviour */
(function () {
  var MB = window.MB, $ = MB.$, $$ = MB.$$;
  var F = MB.flavours, N = F.length, C = MB.company;
  var hero = $('.hero');

  /* ---------- Arched title: stacked copies give the letters depth ---------- */
  var face = $('.arch__face'), depth = $('.arch__depth');
  for (var k = 9; k >= 1; k--) {
    var copy = face.cloneNode(true);
    copy.removeAttribute('class');
    copy.setAttribute('transform', 'translate(0 ' + (k * 1.6).toFixed(1) + ')');
    if (k > 6) copy.style.cssText = 'fill:#4A0606;stroke:#4A0606';
    depth.appendChild(copy);
  }

  /* ---------- Bottle fan ---------- */
  var FAN = ['limao', 'orange', 'energy', 'cola', 'rose', 'mojito', 'berry', 'mango'];
  var fan = $('#fan');
  fan.innerHTML = FAN.map(function (id, i) {
    var f = MB.flavour(id), off = i - (FAN.length - 1) / 2;
    return '<button class="fan__bottle" type="button" data-flavour="' + id + '" style="--a:' + (off * 9.5).toFixed(1) + 'deg;--z:' + (10 - Math.round(Math.abs(off))) + '" aria-label="HOLA ' + MB.esc(f.name) + ', tasting notes">' +
      '<span class="fan__name">' + MB.esc(f.name) + '</span>' +
      '<img src="' + MB.img('bottles/' + id + '.webp') + '" alt="" width="251" height="921"></button>';
  }).join('');

  /* ---------- Marquee ---------- */
  var items = F.map(function (f) {
    return '<span class="marquee__item"><span class="marquee__cap" style="--c:' + f.color + '"></span>' + MB.esc(f.name) + '</span>';
  }).join('');
  $('#marquee').innerHTML = items + items + items + items;

  /* ---------- Flavour cards with logo-style blobs ---------- */
  var BLOB1 = 'M47 42C70 14 128 8 160 30C190 51 197 98 180 130C163 162 120 190 80 182C40 174 12 140 14 104C16 76 30 60 47 42Z';
  var BLOB2 = 'M120 22C160 30 188 70 180 112C172 150 140 178 100 180C58 182 22 156 20 116C18 74 44 34 84 24C96 21 108 20 120 22Z';
  $('#flavour-grid').innerHTML = F.map(function (f, i) {
    return '<button class="fc card3d" type="button" data-flavour="' + f.id + '" style="--c:' + f.color + '" aria-label="HOLA ' + MB.esc(f.name) + ': ' + MB.esc(f.line) + '">' +
      '<span class="fc__art"><svg class="fc__blob" viewBox="0 0 200 200" aria-hidden="true">' +
      '<g transform="rotate(' + (i * 47 % 360) + ' 100 100)"><path class="b2" d="' + BLOB2 + '"/></g>' +
      '<g transform="rotate(' + (i * 83 % 360) + ' 100 100)"><path class="b1" d="' + BLOB1 + '" transform="translate(12 12) scale(.88)"/></g></svg>' +
      '<img class="fc__bottle" src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="" width="251" height="921" loading="lazy"></span>' +
      '<span class="fc__name">' + MB.esc(f.name) + '</span><span class="fc__line">' + MB.esc(f.line) + '</span>' +
      '<span class="fc__add" aria-hidden="true">' + MB.icon('plus') + '</span></button>';
  }).join('');
  function markPicked() {
    var list = MB.enquiry.get();
    $$('.fc').forEach(function (c) {
      var on = list.indexOf(c.getAttribute('data-flavour')) > -1;
      c.classList.toggle('is-picked', on);
      c.querySelector('.fc__add').innerHTML = MB.icon(on ? 'check' : 'plus');
    });
  }
  markPicked();
  document.addEventListener('mb:enquiry', markPicked);

  /* ---------- Partner pills, FAQ, footer ---------- */
  $('#partners-row').innerHTML = MB.partners.map(function (p) {
    return '<button class="ppill" type="button" data-partner="' + p.id + '">' + MB.icon(p.icon) + MB.esc(p.short) + '</button>';
  }).join('');
  $('#faq-list').innerHTML = MB.faq.map(function (item, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + MB.esc(item.q) + MB.icon('plus') + '</summary><p>' + MB.esc(item.a) + '</p></details>';
  }).join('');
  $('#footer-flavours').innerHTML = F.map(function (f) { return '<button type="button" data-flavour="' + f.id + '">' + MB.esc(f.name) + '</button>'; }).join('');

  /* ---------- Polaroids from HOLA's own posts ---------- */
  var SNAPS = [
    { img: 'life/mojito-field.webp', cap: 'Mojito with a view', alt: 'A hand holding HOLA Mojito over open grassland', rot: -7, ty: 14 },
    { img: 'life/orange-leaves.webp', cap: 'Orange in the garden', alt: 'HOLA Orange resting among green leaves', rot: 4, ty: -6 },
    { img: 'life/poolside.webp', cap: 'Poolside line-up', alt: 'HOLA Cola, Mango Special and Orange on a stone ledge by a pool', rot: -3, ty: 18 },
    { img: 'life/mango-hand.webp', cap: 'Mango Special', alt: 'Two hands framing a bottle of HOLA Mango Special', rot: 6, ty: -4 },
    { img: 'life/berry-flowers.webp', cap: 'Very Berry in bloom', alt: 'HOLA Very Berry standing among garden flowers', rot: -5, ty: 12 },
    { img: 'life/rose-sunset.webp', cap: 'Rosé hour', alt: 'HOLA Rosé glowing pink against a sunset', rot: 5, ty: -2 }
  ];
  $('#polaroids').innerHTML = SNAPS.map(function (s, i) {
    return '<button class="polaroid" type="button" data-snap="' + i + '" style="--rot:' + s.rot + 'deg;--ty:' + s.ty + 'px" aria-label="Open photo: ' + MB.esc(s.cap) + '">' +
      '<img src="' + MB.img(s.img) + '" alt="' + MB.esc(s.alt) + '" width="1050" height="1400" loading="lazy"><span>' + MB.esc(s.cap) + '</span></button>';
  }).join('');

  /* ---------- Dialogs ---------- */
  function flavourHTML(id) {
    var f = MB.flavour(id), i = F.indexOf(f), prev = F[(i - 1 + N) % N], next = F[(i + 1) % N], on = MB.enquiry.has(id);
    var img = f.fruit ? 'fruit/' + f.fruit + '.webp' : 'studio/' + id + '.webp';
    return '<article class="fm" style="--c:' + f.color + '">' +
      '<div class="fm__media"><img src="' + MB.img(img) + '" alt="HOLA ' + MB.esc(f.name) + ' bottle" width="900" height="1125"></div>' +
      '<div class="fm__body"><span class="tag tag--sm">' + f.kind + '</span>' +
      '<h2 class="fm__name">' + MB.esc(f.name) + '</h2><p class="fm__desc">' + MB.esc(f.desc) + '</p>' +
      '<ul class="fm__notes">' + f.notes.map(function (n) { return '<li>' + MB.esc(n) + '</li>'; }).join('') + '</ul>' +
      '<div class="fm__actions"><button class="btn btn--primary' + (on ? ' is-on' : '') + '" type="button" data-add="' + id + '">' +
      (on ? MB.icon('check') + 'On my order list' : MB.icon('plus') + 'Add to my order list') + '</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + 'Call us</a></div>' +
      '<div class="fm__nav"><button type="button" data-go="' + prev.id + '">' + MB.icon('left') + MB.esc(prev.name) + '</button>' +
      '<button type="button" data-go="' + next.id + '">' + MB.esc(next.name) + MB.icon('right') + '</button></div></div></article>';
  }

  function handleAdd(btn) {
    var id = btn.getAttribute('data-add');
    var on = MB.enquiry.toggle(id);
    var item = MB.flavour(id) || MB.energyRange.find(function (e) { return e.id === id; });
    btn.classList.toggle('is-on', on && btn.classList.contains('btn--primary'));
    btn.innerHTML = on ? MB.icon('check') + 'On my order list' : MB.icon('plus') + 'Add to my order list';
    MB.toast(on ? item.name + ' is on your order list' : item.name + ' removed from your order list');
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
            d.querySelector('.fm').outerHTML = flavourHTML(nav.getAttribute('data-go'));
            var again = d.querySelector('[data-go="' + nav.getAttribute('data-go') + '"]');
            if (again) again.focus();
          }
        });
      }
    });
  };

  function openPartner(id) {
    var p = MB.partners.find(function (x) { return x.id === id; });
    MB.modal.open('<div class="pm"><span class="pm__icon">' + MB.icon(p.icon) + '</span><h2>' + MB.esc(p.name) + '</h2>' +
      '<p class="pm__line">' + MB.esc(p.line) + '</p><ul class="pm__points">' +
      p.points.map(function (t) { return '<li>' + MB.icon('check') + '<span>' + MB.esc(t) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="pm__actions"><button class="btn btn--primary" type="button" data-start>Start my enquiry</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + MB.icon('phone') + C.phone + '</a></div></div>', {
      label: p.name, className: 'mb-dialog--narrow',
      onOpen: function (d) { d.querySelector('[data-start]').addEventListener('click', function () { MB.prefillForm({ type: MB.partnerToType[id] }); }); }
    });
  }

  function openEnergy() {
    MB.modal.open('<div class="em"><div class="em__head"><span class="tag tag--sm">Energy drinks</span><h2>HOLA Energy, three ways</h2>' +
      '<p>BOOM! Carbonated energy with explosive flavour. Pick one, or stock all three.</p></div><div class="em__grid">' +
      MB.energyRange.map(function (e) {
        var on = MB.enquiry.has(e.id);
        return '<article class="em__item"><img src="' + MB.img(e.img) + '" alt="' + MB.esc(e.name) + ' bottle" width="600" height="995"><div><h3>' + MB.esc(e.name) + '</h3><p>' + MB.esc(e.desc) + '</p>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-add="' + e.id + '">' + (on ? MB.icon('check') + 'On my order list' : MB.icon('plus') + 'Add to my order list') + '</button></div></article>';
      }).join('') + '</div></div>', {
      label: 'HOLA Energy range',
      onOpen: function (d) { d.addEventListener('click', function (e) { var add = e.target.closest('[data-add]'); if (add) handleAdd(add); }); }
    });
  }

  function snapHTML(i) {
    var s = SNAPS[i];
    return '<div class="lb" data-i="' + i + '"><div class="lb__img"><img src="' + MB.img(s.img) + '" alt="' + MB.esc(s.alt) + '" width="1050" height="1400"></div>' +
      '<div class="lb__side"><span class="tag tag--sm">' + (i + 1) + ' of ' + SNAPS.length + '</span><h2>' + MB.esc(s.cap) + '</h2><p>' + MB.esc(s.alt) + '.</p>' +
      '<p>More on <a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a> and <a href="' + C.facebook + '" target="_blank" rel="noopener">Facebook</a>.</p>' +
      '<div class="lb__nav"><button type="button" data-snap-go="' + ((i - 1 + SNAPS.length) % SNAPS.length) + '" aria-label="Previous photo">' + MB.icon('left') + '</button>' +
      '<button type="button" data-snap-go="' + ((i + 1) % SNAPS.length) + '" aria-label="Next photo">' + MB.icon('right') + '</button></div></div></div>';
  }
  function openSnap(i) {
    MB.modal.open(snapHTML(i), {
      label: 'HOLA photo', className: 'mb-dialog--wide',
      onOpen: function (d) {
        d.querySelector('.mb-dialog__panel').addEventListener('click', function (e) {
          var go = e.target.closest('[data-snap-go]');
          if (!go) return;
          var n = +go.getAttribute('data-snap-go');
          d.querySelector('.lb').outerHTML = snapHTML(n);
          d.querySelector('[data-snap-go="' + ((n + 1) % SNAPS.length) + '"]').focus();
        });
      }
    });
  }

  document.addEventListener('click', function (e) {
    var fl = e.target.closest('[data-flavour]'), pa = e.target.closest('[data-partner]'), sn = e.target.closest('[data-snap]');
    if (fl) MB.openFlavour(fl.getAttribute('data-flavour'));
    if (pa) openPartner(pa.getAttribute('data-partner'));
    if (sn) openSnap(+sn.getAttribute('data-snap'));
    if (e.target.closest('[data-open-energy]')) openEnergy();
    if (e.target.closest('[data-open-chat]')) MB.chat.open();
  });

  /* ---------- Nav state ---------- */
  var links = $$('.header__links a');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['story', 'flavours', 'shops', 'out-there', 'video', 'distributor', 'faq', 'find'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

  /* ---------- One entrance: the title lands, then the fan opens ---------- */
  var fanBottles = $$('.fan__bottle');
  hero.classList.add('is-entering');
  fanBottles.forEach(function (b, i) {
    b.style.transitionDelay = (MB.reducedMotion() ? 0 : 420 + Math.abs(i - 3.5) * 90) + 'ms';
  });
  var ready = $$('img', fan).map(function (img) { return img.decode ? img.decode().catch(function () {}) : null; });
  Promise.race([Promise.all(ready), new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
    requestAnimationFrame(function () {
      hero.classList.remove('is-entering');
      setTimeout(function () { fanBottles.forEach(function (b) { b.style.transitionDelay = ''; }); }, 1600);
    });
  });

  /* ---------- Shared parts ---------- */
  MB.hydrateIcons(document);
  MB.headerScroll($('.header'));
  MB.tilt($$('.card3d'), 7);
  MB.liteYouTube($('.mb-yt'));
  MB.initForm($('#dist-form'));
  MB.chat.init({
    title: 'HOLA trade assistant',
    subtitle: 'Replies instantly',
    launcher: 'Chat with us',
    teaser: 'Hola! Want HOLA in your shop? Ask me anything.',
    greeting: 'Hola! Ready to stock the most explosive flavours in town? I can help you become a distributor, pick flavours or reach our team.'
  });
})();
