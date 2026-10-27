/* Distributor enquiry form: fills options from data, validates, shows a confirmation.
   GitHub Pages has no server, so enquiries are kept in localStorage ("mb-enquiries")
   until the form is pointed at a real endpoint (see README). */
(function () {
  var MB = window.MB;

  var FLAVOUR_CHIPS = MB.flavours.map(function (f) { return { id: f.id, name: f.name, color: f.color }; })
    .concat([
      { id: 'energy-red', name: 'Energy Red', color: '#D9381F' },
      { id: 'energy-green', name: 'Energy Green', color: '#4FA82A' }
    ]);

  function options(list, placeholder) {
    return '<option value="">' + placeholder + '</option>' + list.map(function (v) {
      return '<option>' + MB.esc(v) + '</option>';
    }).join('');
  }

  function normalisePhone(v) { return v.replace(/[\s().-]/g, ''); }

  var RULES = {
    name: function (v) { return v.trim().length > 1 || 'Enter your full name.'; },
    business: function (v) { return v.trim().length > 1 || 'Enter your business name.'; },
    phone: function (v, form) {
      var p = normalisePhone(v);
      if (!p) return 'Enter a phone number so the trade team can call you.';
      var abroad = form.elements.county && form.elements.county.value === 'Outside Kenya';
      if (abroad) return /^\+?\d{8,15}$/.test(p) || 'Enter a phone number with its country code.';
      return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(p) || 'Enter a Kenyan number, for example 0712 345 678.';
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address, or leave it blank.'; },
    type: function (v) { return !!v || 'Choose your business type.'; },
    county: function (v) { return !!v || 'Choose your county.'; },
    consent: function (v, form) { return form.elements.consent.checked || 'Tick the box so our trade team can contact you.'; }
  };

  function fieldWrap(el) { return el.closest('.field') || el.parentElement; }

  function setError(form, name, msg) {
    var el = form.elements[name];
    if (!el) return;
    var wrap = fieldWrap(el), err = wrap.querySelector('.field__error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field__error';
      err.id = form.id + '-' + name + '-error';
      wrap.appendChild(err);
    }
    if (msg) {
      err.textContent = msg;
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', err.id);
      wrap.classList.add('has-error');
    } else {
      err.textContent = '';
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      wrap.classList.remove('has-error');
    }
  }

  function validate(form) {
    var firstBad = null;
    Object.keys(RULES).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var ok = RULES[name](el.value || '', form);
      setError(form, name, ok === true ? '' : ok);
      if (ok !== true && !firstBad) firstBad = el;
    });
    return firstBad;
  }

  function reference() {
    var d = new Date();
    return 'MB-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
  }

  MB.initForm = function (form, opts) {
    opts = opts || {};
    var q = function (sel) { return form.querySelector(sel); };
    if (q('[data-fill="types"]')) q('[data-fill="types"]').innerHTML = options(MB.businessTypes, 'Select business type');
    if (q('[data-fill="counties"]')) q('[data-fill="counties"]').innerHTML = options(MB.counties, 'Select county');
    if (q('[data-fill="volumes"]')) q('[data-fill="volumes"]').innerHTML = options(MB.volumes, 'Select a range');

    var chips = q('[data-fill="flavours"]');
    if (chips) {
      chips.innerHTML = FLAVOUR_CHIPS.map(function (f) {
        return '<label class="chip" style="--c:' + f.color + '"><input type="checkbox" name="flavours" value="' + f.id + '">' +
          '<span class="chip__dot" aria-hidden="true"></span><span class="chip__name">' + MB.esc(f.name) + '</span>' +
          MB.icon('check', 'chip__tick') + '</label>';
      }).join('');
      var sync = function () {
        var want = MB.enquiry.get();
        MB.$$('input[name="flavours"]', chips).forEach(function (c) { c.checked = want.indexOf(c.value) > -1; });
      };
      sync();
      document.addEventListener('mb:enquiry', sync);
      chips.addEventListener('change', function () {
        MB.enquiry.set(MB.$$('input[name="flavours"]:checked', chips).map(function (c) { return c.value; }));
      });
    }

    var tried = false;
    form.addEventListener('input', function (e) {
      if (!tried || !RULES[e.target.name]) return;
      var ok = RULES[e.target.name](e.target.value || '', form);
      setError(form, e.target.name, ok === true ? '' : ok);
    });
    form.addEventListener('change', function (e) {
      if (tried && e.target.name === 'county') validate(form);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var bad = validate(form);
      if (bad) {
        bad.focus();
        var count = MB.$$('[aria-invalid="true"]', form).length;
        var live = q('.form__status');
        if (live) live.textContent = count === 1 ? 'One field needs attention.' : count + ' fields need attention.';
        return;
      }
      var btn = q('[type="submit"]');
      btn.disabled = true;
      btn.classList.add('is-busy');
      var data = {
        ref: reference(),
        sent: new Date().toISOString(),
        name: form.elements.name.value.trim(),
        business: form.elements.business.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        type: form.elements.type.value,
        county: form.elements.county.value,
        area: form.elements.area ? form.elements.area.value.trim() : '',
        volume: form.elements.volume ? form.elements.volume.value : '',
        vehicles: form.elements.vehicles ? (MB.$('input[name="vehicles"]:checked', form) || {}).value || '' : '',
        flavours: MB.$$('input[name="flavours"]:checked', form).map(function (c) { return c.value; }),
        message: form.elements.message ? form.elements.message.value.trim() : ''
      };
      setTimeout(function () {
        try {
          var all = JSON.parse(localStorage.getItem('mb-enquiries') || '[]');
          all.push(data);
          localStorage.setItem('mb-enquiries', JSON.stringify(all));
        } catch (err) { /* storage blocked: the confirmation still shows */ }
        var names = data.flavours.map(function (id) {
          var f = FLAVOUR_CHIPS.find(function (c) { return c.id === id; });
          return f ? f.name : id;
        });
        var first = data.name.split(' ')[0];
        var html = (opts.success || MB.successHTML)(data, first, names);
        var box = document.createElement('div');
        box.className = 'form-success';
        box.setAttribute('tabindex', '-1');
        box.innerHTML = html;
        form.hidden = true;
        form.parentNode.insertBefore(box, form.nextSibling);
        MB.hydrateIcons(box);
        box.focus();
        var again = box.querySelector('[data-action="again"]');
        if (again) again.addEventListener('click', function () {
          box.remove();
          form.reset();
          MB.enquiry.set([]);
          btn.disabled = false;
          btn.classList.remove('is-busy');
          tried = false;
          form.hidden = false;
          form.elements.name.focus();
        });
        if (opts.onSent) opts.onSent(data);
      }, MB.reducedMotion() ? 200 : 900);
    });
  };

  MB.successHTML = function (d, first, names) {
    return '<div class="form-success__badge">' + MB.icon('check') + '</div>' +
      '<h3 class="form-success__title">Enquiry sent</h3>' +
      '<p class="form-success__lead">Thanks, ' + MB.esc(first) + '. Our trade team will call you on <strong>' + MB.esc(d.phone) +
      '</strong> to talk about supplying ' + MB.esc(d.business) + ' in ' + MB.esc(d.county) + '.</p>' +
      '<dl class="form-success__summary">' +
      '<div><dt>Reference</dt><dd>' + d.ref + '</dd></div>' +
      '<div><dt>Business type</dt><dd>' + MB.esc(d.type) + '</dd></div>' +
      (d.volume ? '<div><dt>Monthly volume</dt><dd>' + MB.esc(d.volume) + '</dd></div>' : '') +
      (names.length ? '<div><dt>Flavours</dt><dd>' + MB.esc(names.join(', ')) + '</dd></div>' : '') +
      '</dl>' +
      '<div class="form-success__actions"><a class="btn btn--primary" href="' + MB.company.phoneHref + '">' + MB.icon('phone') +
      '<span>Call ' + MB.company.phone + '</span></a><button class="btn btn--ghost" type="button" data-action="again">Send another enquiry</button></div>';
  };

  /* Pre-select a business type (or message) and bring the form into view */
  MB.prefillForm = function (fields) {
    var form = MB.$('form[data-distributor]');
    if (!form) return;
    var success = form.parentNode.querySelector('.form-success');
    if (success && fields) {
      var again = success.querySelector('[data-action="again"]');
      if (again) again.click();
    }
    if (fields && fields.type) form.elements.type.value = fields.type;
    if (fields && fields.message && !form.elements.message.value) form.elements.message.value = fields.message;
    MB.go('#distributor', '#' + form.id + ' [name="name"]');
  };
})();
