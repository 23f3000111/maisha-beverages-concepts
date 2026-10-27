/* Form plumbing shared by the distributor form and the order desk: option lists, validation
   rules, inline errors and the confirmation panel. GitHub Pages has no server, so sent forms
   are kept in localStorage ("mb-enquiries", "mb-orders") until a real endpoint is wired in
   (see README). */
(function () {
  var MB = window.MB;

  MB.optionsHTML = function (list, placeholder) {
    return '<option value="">' + placeholder + '</option>' + list.map(function (v) {
      return '<option>' + MB.esc(v) + '</option>';
    }).join('');
  };

  function normalisePhone(v) { return v.replace(/[\s().-]/g, ''); }

  MB.formRules = {
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
    town: function (v) { return v.trim().length > 1 || 'Enter your town or area.'; },
    consent: function (v, form) { return form.elements.consent.checked || 'Tick the box so our trade team can contact you.'; }
  };

  function fieldWrap(el) {
    if (el instanceof RadioNodeList) el = el[0];
    return el.closest('.field') || el.parentElement;
  }

  MB.setFieldError = function (form, name, msg) {
    var el = form.elements[name];
    if (!el) return;
    var wrap = fieldWrap(el), err = wrap.querySelector('.field__error');
    var target = el instanceof RadioNodeList ? el[0] : el;
    if (!err) {
      err = document.createElement('p');
      err.className = 'field__error';
      err.id = form.id + '-' + name + '-error';
      wrap.appendChild(err);
    }
    if (msg) {
      err.textContent = msg;
      target.setAttribute('aria-invalid', 'true');
      target.setAttribute('aria-describedby', err.id);
      wrap.classList.add('has-error');
    } else {
      err.textContent = '';
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
      wrap.classList.remove('has-error');
    }
  };

  /* Run rules over the named fields (or every rule the form has a field for). Returns the
     first field that failed, so the caller can focus it. */
  MB.validateForm = function (form, rules) {
    rules = rules || MB.formRules;
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var ok = rules[name](el.value || '', form);
      MB.setFieldError(form, name, ok === true ? '' : ok);
      if (ok !== true && !firstBad) firstBad = el instanceof RadioNodeList ? el[0] : el;
    });
    return firstBad;
  };

  MB.liveValidate = function (form, rules, isOn) {
    rules = rules || MB.formRules;
    form.addEventListener('input', function (e) {
      if (!isOn() || !rules[e.target.name]) return;
      var ok = rules[e.target.name](e.target.value || '', form);
      MB.setFieldError(form, e.target.name, ok === true ? '' : ok);
    });
    form.addEventListener('change', function (e) {
      if (!isOn() || !rules[e.target.name]) return;
      if (e.target.name === 'county') MB.validateForm(form, rules);
      else {
        var ok = rules[e.target.name](e.target.value || '', form);
        MB.setFieldError(form, e.target.name, ok === true ? '' : ok);
      }
    });
  };

  MB.reference = function (prefix) {
    var d = new Date();
    return (prefix || 'MB') + '-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
  };

  /* The short distributor form */
  MB.initForm = function (form, opts) {
    opts = opts || {};
    var q = function (sel) { return form.querySelector(sel); };
    if (q('[data-fill="types"]')) q('[data-fill="types"]').innerHTML = MB.optionsHTML(MB.businessTypes, 'Business type');
    if (q('[data-fill="counties"]')) q('[data-fill="counties"]').innerHTML = MB.optionsHTML(MB.counties, 'County');
    if (q('[data-fill="volumes"]')) q('[data-fill="volumes"]').innerHTML = MB.optionsHTML(MB.volumes, 'Monthly volume');

    var tried = false;
    MB.liveValidate(form, MB.formRules, function () { return tried; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var bad = MB.validateForm(form);
      var live = q('.form__status');
      if (bad) {
        bad.focus();
        var count = MB.$$('[aria-invalid="true"]', form).length;
        if (live) live.textContent = count === 1 ? 'One field needs attention.' : count + ' fields need attention.';
        return;
      }
      if (live) live.textContent = '';
      var btn = q('[type="submit"]');
      btn.disabled = true;
      btn.classList.add('is-busy');
      var val = function (n) { return form.elements[n] ? String(form.elements[n].value || '').trim() : ''; };
      var data = {
        ref: MB.reference('MB'),
        sent: new Date().toISOString(),
        name: val('name'), business: val('business'), phone: val('phone'), email: val('email'),
        type: val('type'), county: val('county'), area: val('area'), volume: val('volume'), message: val('message')
      };
      setTimeout(function () {
        try {
          var all = JSON.parse(localStorage.getItem('mb-enquiries') || '[]');
          all.push(data);
          localStorage.setItem('mb-enquiries', JSON.stringify(all));
        } catch (err) { /* storage blocked: the confirmation still shows */ }
        var box = document.createElement('div');
        box.className = 'form-success';
        box.setAttribute('tabindex', '-1');
        box.innerHTML = (opts.success || MB.successHTML)(data, data.name.split(' ')[0]);
        form.hidden = true;
        form.parentNode.insertBefore(box, form.nextSibling);
        MB.hydrateIcons(box);
        box.focus();
        var again = box.querySelector('[data-action="again"]');
        if (again) again.addEventListener('click', function () {
          box.remove();
          form.reset();
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

  MB.successHTML = function (d, first) {
    return '<div class="form-success__badge">' + MB.icon('check') + '</div>' +
      '<h3 class="form-success__title">Request sent</h3>' +
      '<p class="form-success__lead">Thanks, ' + MB.esc(first) + '. Our trade team will call you on <strong>' + MB.esc(d.phone) +
      '</strong> to talk about supplying ' + MB.esc(d.business) + ' in ' + MB.esc(d.county) + '.</p>' +
      '<dl class="form-success__summary">' +
      '<div><dt>Reference</dt><dd>' + d.ref + '</dd></div>' +
      '<div><dt>Business type</dt><dd>' + MB.esc(d.type) + '</dd></div>' +
      (d.area ? '<div><dt>Areas you cover</dt><dd>' + MB.esc(d.area) + '</dd></div>' : '') +
      '</dl>' +
      '<div class="form-success__actions"><a class="btn btn--primary" href="' + MB.company.phoneHref + '">' + MB.icon('phone') +
      '<span>Call ' + MB.company.phone + '</span></a><button class="btn btn--ghost" type="button" data-action="again">Send another request</button></div>';
  };

  /* Pre-select a business type (or message) and bring the distributor form into view */
  MB.prefillForm = function (fields) {
    var form = MB.$('form[data-distributor]');
    if (!form) return;
    var success = form.parentNode.querySelector('.form-success');
    if (success && fields) {
      var again = success.querySelector('[data-action="again"]');
      if (again) again.click();
    }
    if (fields && fields.type && form.elements.type) form.elements.type.value = fields.type;
    if (fields && fields.message && form.elements.message && !form.elements.message.value) form.elements.message.value = fields.message;
    MB.go('#distributor', '#' + form.id + ' [name="name"]');
  };
})();
