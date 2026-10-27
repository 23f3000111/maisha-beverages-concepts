/* Shared UI helpers: icons, dialogs, 3D tilt, lite YouTube, toast, enquiry basket. */
(function () {
  var MB = window.MB = window.MB || {};
  var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');

  MB.reducedMotion = function () { return reduceQuery.matches; };
  MB.$ = function (sel, root) { return (root || document).querySelector(sel); };
  MB.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  MB.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* Line icons (paths after Lucide, ISC licence) */
  var P = {
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    up: '<path d="M7 17 17 7M8 7h9v9"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    nav: '<path d="M3 11 22 2l-9 19-2-8z"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.7a1 1 0 0 0-.2-.6l-3.5-4.3a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    boxes: '<path d="m7.5 4.3 9 5.1"/><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H5.1"/>',
    store: '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-.8 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2Z"/>',
    glass: '<path d="M15.2 22H8.8a2 2 0 0 1-2-1.8L5 3h14l-1.8 17.2a2 2 0 0 1-2 1.8Z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12.2-7.5a1 1 0 0 0 0-1.8L8.5 3.6A1 1 0 0 0 7 4.5Z" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4z"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/><path d="m16.7 13.9.7.7-2.8 2.8"/>',
    spark: '<path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
  };
  MB.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  };
  MB.hydrateIcons = function (root) {
    MB.$$('[data-icon]', root).forEach(function (el) {
      if (!el.firstElementChild) el.innerHTML = MB.icon(el.getAttribute('data-icon'));
    });
  };

  /* Dialogs: native <dialog> for focus trap, Esc and inert page */
  MB.modal = {
    open: function (html, opts) {
      opts = opts || {};
      var d = document.createElement('dialog');
      d.className = 'mb-dialog ' + (opts.className || '');
      d.innerHTML = '<div class="mb-dialog__panel">' + html +
        '<button class="mb-dialog__close" type="button" aria-label="Close">' + MB.icon('close') + '</button></div>';
      if (opts.label) d.setAttribute('aria-label', opts.label);
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target === d) MB.modal.close(d); });
      d.addEventListener('cancel', function (e) { e.preventDefault(); MB.modal.close(d); });
      d.querySelector('.mb-dialog__close').addEventListener('click', function () { MB.modal.close(d); });
      MB.hydrateIcons(d);
      d.showModal();
      document.documentElement.classList.add('mb-modal-open');
      if (opts.onOpen) opts.onOpen(d);
      return d;
    },
    close: function (d) {
      d = d || MB.$('dialog.mb-dialog[open]');
      if (!d || d.classList.contains('is-closing')) return;
      d.classList.add('is-closing');
      var done = function () {
        d.close();
        d.remove();
        if (!MB.$('dialog.mb-dialog[open]')) document.documentElement.classList.remove('mb-modal-open');
      };
      if (MB.reducedMotion()) done(); else setTimeout(done, 200);
    },
    closeAll: function () { MB.$$('dialog.mb-dialog[open]').forEach(function (d) { MB.modal.close(d); }); }
  };

  /* Pointer-driven 3D tilt: sets --rx, --ry, --mx, --my on each element */
  MB.tilt = function (els, max) {
    max = max || 6;
    if (MB.reducedMotion() || matchMedia('(hover: none)').matches) return;
    els.forEach(function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
          el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* YouTube loads only when asked: poster first, iframe on click */
  MB.liteYouTube = function (el) {
    var btn = el.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + el.getAttribute('data-yt') + '?autoplay=1&rel=0&modestbranding=1';
      f.title = el.getAttribute('data-title') || 'YouTube video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      el.classList.add('is-playing');
      el.replaceChildren(f);
      f.focus();
    }, { once: true });
  };

  MB.toast = function (msg) {
    var t = MB.$('.mb-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'mb-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = MB.icon('check') + '<span>' + MB.esc(msg) + '</span>';
    t.classList.add('is-on');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('is-on'); }, 2800);
  };

  /* Flavours a visitor wants to ask about; synced with the distributor form */
  MB.enquiry = {
    key: 'mb-enquiry-flavours',
    get: function () {
      try { return JSON.parse(sessionStorage.getItem(this.key)) || []; } catch (e) { return []; }
    },
    set: function (list) {
      try { sessionStorage.setItem(this.key, JSON.stringify(list)); } catch (e) { /* storage blocked */ }
      document.dispatchEvent(new CustomEvent('mb:enquiry', { detail: list }));
    },
    has: function (id) { return this.get().indexOf(id) > -1; },
    toggle: function (id) {
      var list = this.get(), i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      this.set(list);
      return i === -1;
    }
  };

  MB.headerScroll = function (el) {
    var on = function () { el.classList.toggle('is-scrolled', window.scrollY > 8); };
    on();
    addEventListener('scroll', on, { passive: true });
  };

  /* Scroll to a section, then optionally focus something inside it */
  MB.go = function (sel, focusSel) {
    var target = MB.$(sel);
    if (!target) return;
    MB.modal.closeAll();
    target.scrollIntoView({ behavior: MB.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (focusSel) {
      setTimeout(function () {
        var f = MB.$(focusSel);
        if (f) f.focus({ preventScroll: true });
      }, MB.reducedMotion() ? 0 : 650);
    }
  };

  document.addEventListener('DOMContentLoaded', function () { MB.hydrateIcons(document); });
})();
