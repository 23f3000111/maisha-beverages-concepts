/* HOLA trade assistant: a rule-based chat that answers from site content and
   hands off to the form, phone or email. No server needed. */
(function () {
  var MB = window.MB;
  var C = MB.company;

  var DEFAULT_CHIPS = [
    { label: 'Place an order', say: 'I want to place an order' },
    { label: 'Become a distributor', say: 'I want to become a distributor' },
    { label: 'Get a price list', say: 'Can I get a price list?' },
    { label: 'Recipe ideas', say: 'Show me recipes and mixes' },
    { label: 'Talk to a person', say: 'I want to talk to a person' }
  ];

  function strip(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ');
  }

  var FLAVOUR_WORDS = {
    cola: /\bcola\b|\bcoke\b/, orange: /\borange\b/, mango: /\bmango\b/, limao: /\blimao\b|\blemon\b|\blemonade\b/,
    mojito: /\bmojito\b|\bmint\b|\blime\b/, berry: /\bberr(y|ies)\b/, rose: /\brose\b/, energy: /\benergy\b|\bboost\b/
  };

  var INTENTS = [
    { id: 'person', re: /\b(person|human|someone|agent|representative|real)\b|talk to|speak to/ },
    { id: 'distributor', re: /distribut|wholesal|stockist|become|partner|dealer|franchise|account|supply|supplier|resell|sell hola|stock hola|stock your|retail|\bshop\b|kiosk|duka|supermarket|minimart/ },
    { id: 'price', re: /price|cost|how much|\brate|\bbei\b|margin|discount|quote|quotation/ },
    { id: 'order', re: /\border|\bbuy\b|purchase|restock|minimum|\bmoq\b|bulk|cases?\b|crates?\b|basket|\bcart\b|deliver|transport|lead time|stock level/ },
    { id: 'recipes', re: /recipe|cocktail|mocktail|\bmix(es|er|ers)?\b|pair|food|ugali|nyama|choma|bbq|barbe?cue|grill|dawa|punch|menu idea/ },
    { id: 'events', re: /event|wedding|party|hotel|restaurant|\bbar\b|catering|conference/ },
    { id: 'location', re: /where|locat|address|office|factory|plant|visit|direction|\bmap\b|baba dogo|nairobi/ },
    { id: 'contact', re: /contact|phone|\bcall\b|number|email|e mail|\bmail\b|whatsapp|reach/ },
    { id: 'quality', re: /quality|kebs|certif|ingredient|sugar|calorie|halal|allergen|nutrition|expiry|shelf life|preservative/ },
    { id: 'jobs', re: /\bjobs?\b|career|vacanc|hiring|employ|internship|attachment/ },
    { id: 'company', re: /who are you|about|maisha|company|history|founded|\bteam\b|made in|kenyan|what is hola|meaning/ },
    { id: 'flavours', re: /flavou?r|range|product|drinks?\b|menu|portfolio|\bsku|what do you (make|sell)|sodas?\b/ },
    { id: 'thanks', re: /thank|asante|\bthx\b|great|perfect|\bcool\b|\bok\b|okay|nice/ },
    { id: 'bye', re: /\bbye\b|goodbye|kwaheri|see you|later/ },
    { id: 'greet', re: /\b(hi|hello|hey|hola|jambo|habari|mambo|sasa|niaje|good (morning|afternoon|evening))\b/ }
  ];

  function reply(intent, ctx) {
    var call = { label: 'Call ' + C.phone, href: C.phoneHref, icon: 'phone' };
    var mail = { label: 'Email ' + C.email, href: C.emailHref, icon: 'mail' };
    var form = { label: 'Open the distributor form', act: 'form', icon: 'list' };
    switch (intent) {
      case 'greet':
        return { text: 'Hola! I can help you stock HOLA, find a flavour or reach our trade team. What do you need?', chips: DEFAULT_CHIPS };
      case 'distributor':
        return { text: 'We are always looking for new partners. Fill in the short distributor form and our trade team will call you to agree your area, volumes and pricing.', actions: [form, call] };
      case 'price':
        return { text: 'Trade prices depend on your area and monthly volumes, so the team shares the current price list once they have your details.', actions: [{ label: 'Request a price list', act: 'form', message: 'Please send me your current trade price list.', icon: 'list' }, call] };
      case 'order':
        var have = MB.order.total();
        return { text: 'Use the order desk: pick your flavours by the case, choose a delivery day and the trade desk calls to confirm prices and stock.' + (have ? ' Your order so far: ' + MB.cases(have) + '.' : '') + ' Minimums depend on your area, and you can mix any flavours.', actions: [{ label: 'Open the order desk', act: 'order', icon: 'basket' }, call] };
      case 'recipes':
        return { text: 'HOLA goes with nyama choma, ugali and everything on the grill, and it mixes well. Pick one for the full recipe.', recipes: true };
      case 'events':
        return { text: 'HOLA Mojito, Rosé and Very Berry make easy alcohol free menus, and our party punch serves twelve from one bowl. Share your dates and volumes and we will quote.', actions: [{ label: 'Very Berry Party Punch', act: 'recipe', id: 'berry-punch', icon: 'citrus' }, { label: 'Order for an event', act: 'order', icon: 'basket' }, { label: 'Ask for an event quote', act: 'form', type: 'Events or institution', icon: 'calendar' }] };
      case 'location':
        return { text: 'You will find us at ' + C.street + ', ' + C.city + '. Postal address: ' + C.pobox + '.', actions: [{ label: 'Get directions', href: C.directions, icon: 'nav', ext: true }, { label: 'Show the map', act: 'map', icon: 'pin' }] };
      case 'contact':
      case 'person':
        return { text: 'Our trade team is on ' + C.phone + ' and ' + C.email + '. You can also leave your details in the form and they will call you back.', actions: [call, mail, form] };
      case 'quality':
        return { text: 'Ingredients and nutrition information are printed on every HOLA label. For product specifications or certificates, ask the trade team and they will send what you need.', actions: [mail] };
      case 'jobs':
        return { text: 'Thanks for your interest in working with us. Send your CV and the role you are interested in to ' + C.email + '.', actions: [{ label: 'Email your CV', href: 'mailto:' + C.email + '?subject=Job%20application', icon: 'mail' }] };
      case 'company':
        return { text: 'Maisha Beverages Limited makes HOLA soft drinks and energy drinks in Nairobi. HOLA means hello: hi, hello, jambo. Proudly made in Kenya, by Kenyans.', actions: [{ label: 'Watch our story', act: 'story', icon: 'play' }] };
      case 'flavours':
        return { text: 'There are seven soft drinks and three energy drinks. Pick one for tasting notes.', flavours: true };
      case 'flavour':
        var f = MB.flavour(ctx);
        return { text: 'HOLA ' + f.name + ': ' + f.desc, actions: [{ label: 'See ' + f.name + ' details', act: 'flavour', id: f.id, icon: 'eye' }, { label: 'Add 5 cases to my order', act: 'add', id: f.id, icon: 'basket' }] };
      case 'thanks':
        return { text: 'You are welcome! Anything else I can help with?', chips: DEFAULT_CHIPS };
      case 'bye':
        return { text: 'Asante! Just say hola any time.' };
      default:
        return { text: 'I am not sure about that one yet. I can help with flavours, becoming a distributor, prices and how to reach us. Or talk to a person on ' + C.phone + '.', chips: DEFAULT_CHIPS, actions: [call] };
    }
  }

  function understand(text) {
    var s = strip(text);
    var flavourHit = null;
    Object.keys(FLAVOUR_WORDS).forEach(function (id) { if (!flavourHit && FLAVOUR_WORDS[id].test(s)) flavourHit = id; });
    var hit = INTENTS.find(function (i) { return i.re.test(s); });
    if (flavourHit && (!hit || ['flavours', 'greet', 'thanks', 'company'].indexOf(hit.id) > -1)) return reply('flavour', flavourHit);
    return reply(hit ? hit.id : 'fallback');
  }

  MB.chat = {
    init: function (cfg) {
      cfg = cfg || {};
      var root = document.createElement('div');
      root.className = 'mb-chat';
      root.innerHTML =
        '<div class="mb-chat__teaser" hidden><button class="mb-chat__teaser-text" type="button">' + MB.esc(cfg.teaser || 'Looking to stock HOLA? Ask me anything.') + '</button>' +
        '<button class="mb-chat__teaser-x" type="button" aria-label="Dismiss">' + MB.icon('close') + '</button></div>' +
        '<section class="mb-chat__panel" id="mb-chat-panel" aria-label="' + MB.esc(cfg.title || 'HOLA trade assistant') + '" hidden>' +
        '<header class="mb-chat__head"><span class="mb-chat__avatar"><img src="' + MB.img('logo/hola-logo-flat.webp') + '" alt=""></span>' +
        '<span class="mb-chat__who"><strong>' + MB.esc(cfg.title || 'HOLA trade assistant') + '</strong><span><i class="mb-chat__live"></i>' + MB.esc(cfg.subtitle || 'Replies instantly') + '</span></span>' +
        '<button class="mb-chat__close" type="button" aria-label="Close chat">' + MB.icon('close') + '</button></header>' +
        '<div class="mb-chat__log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
        '<form class="mb-chat__form"><label class="visually-hidden" for="mb-chat-input">Type your question</label>' +
        '<input id="mb-chat-input" type="text" autocomplete="off" maxlength="300" placeholder="' + MB.esc(cfg.placeholder || 'Ask about flavours, prices, delivery') + '">' +
        '<button type="submit" aria-label="Send">' + MB.icon('send') + '</button></form></section>' +
        '<button class="mb-chat__launcher" type="button" aria-expanded="false" aria-controls="mb-chat-panel">' +
        '<span class="mb-chat__launcher-icon">' + MB.icon('chat') + '</span><span class="mb-chat__launcher-label">' + MB.esc(cfg.launcher || 'Trade assistant') + '</span></button>';
      document.body.appendChild(root);

      var panel = root.querySelector('.mb-chat__panel');
      var log = root.querySelector('.mb-chat__log');
      var launcher = root.querySelector('.mb-chat__launcher');
      var input = root.querySelector('#mb-chat-input');
      var teaser = root.querySelector('.mb-chat__teaser');
      var started = false;

      function scrollDown() { log.scrollTop = log.scrollHeight; }

      function addUser(text) {
        var m = document.createElement('div');
        m.className = 'mb-msg mb-msg--user';
        m.textContent = text;
        log.appendChild(m);
        scrollDown();
      }

      function renderBot(r) {
        var m = document.createElement('div');
        m.className = 'mb-msg mb-msg--bot';
        var html = '<p>' + MB.esc(r.text) + '</p>';
        if (r.flavours) {
          html += '<div class="mb-msg__flavours">' + MB.flavours.map(function (f) {
            return '<button type="button" class="mb-flav" style="--c:' + f.color + '" data-say="Tell me about ' + MB.esc(f.name) + '" data-flav="' + f.id + '">' +
              '<img src="' + MB.img('bottles/' + f.id + '.webp') + '" alt="">' + MB.esc(f.name) + '</button>';
          }).join('') + '</div>';
        }
        if (r.recipes) {
          html += '<div class="mb-msg__recipes">' + MB.recipes.map(function (x) {
            return '<button type="button" class="mb-rec" data-rec="' + x.id + '"><img src="' + MB.img(x.img) + '" alt="">' + MB.esc(x.name) + '</button>';
          }).join('') + '</div>';
        }
        if (r.actions) {
          html += '<div class="mb-msg__actions">' + r.actions.map(function (a, i) {
            var inner = MB.icon(a.icon || 'right') + '<span>' + MB.esc(a.label) + '</span>';
            if (a.href) return '<a class="mb-act" href="' + a.href + '"' + (a.ext ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>';
            return '<button type="button" class="mb-act" data-i="' + i + '">' + inner + '</button>';
          }).join('') + '</div>';
        }
        m.innerHTML = html;
        if (r.actions) {
          MB.$$('button.mb-act', m).forEach(function (b) {
            b.addEventListener('click', function () { act(r.actions[+b.getAttribute('data-i')]); });
          });
        }
        MB.$$('.mb-rec', m).forEach(function (b) {
          b.addEventListener('click', function () { MB.openRecipe(b.getAttribute('data-rec')); });
        });
        MB.$$('.mb-flav', m).forEach(function (b) {
          b.addEventListener('click', function () { ask(b.getAttribute('data-say'), reply('flavour', b.getAttribute('data-flav'))); });
        });
        log.appendChild(m);
        if (r.chips) renderChips(r.chips);
        scrollDown();
      }

      function renderChips(chips) {
        var old = log.querySelector('.mb-chat__chips');
        if (old) old.remove();
        var c = document.createElement('div');
        c.className = 'mb-chat__chips';
        chips.forEach(function (ch) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'mb-chip';
          b.textContent = ch.label;
          b.addEventListener('click', function () { ask(ch.say); });
          c.appendChild(b);
        });
        log.appendChild(c);
      }

      function botSay(r) {
        var typing = document.createElement('div');
        typing.className = 'mb-msg mb-msg--bot mb-msg--typing';
        typing.setAttribute('aria-label', 'Assistant is typing');
        typing.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(typing);
        scrollDown();
        setTimeout(function () { typing.remove(); renderBot(r); }, MB.reducedMotion() ? 150 : 550 + Math.min(r.text.length * 6, 700));
      }

      function ask(text, forced) {
        var old = log.querySelector('.mb-chat__chips');
        if (old) old.remove();
        addUser(text);
        botSay(forced || understand(text));
      }

      function act(a) {
        if (a.act === 'form') {
          close();
          MB.prefillForm({ type: a.type, message: a.message });
        } else if (a.act === 'map') {
          close();
          MB.go('#contact');
        } else if (a.act === 'story') {
          close();
          MB.go('#story');
        } else if (a.act === 'flavour' && MB.openFlavour) {
          MB.openFlavour(a.id);
        } else if (a.act === 'order') {
          close();
          MB.go('#order');
        } else if (a.act === 'recipe') {
          MB.openRecipe(a.id);
        } else if (a.act === 'add') {
          MB.order.add(a.id, 5);
          var f = MB.flavour(a.id);
          botSay({ text: '5 cases of ' + f.name + ' are in your order. You now have ' + MB.cases(MB.order.total()) + ' in total.', actions: [{ label: 'Open the order desk', act: 'order', icon: 'basket' }] });
        }
      }

      function open() {
        panel.hidden = false;
        teaser.hidden = true;
        root.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        try { sessionStorage.setItem('mb-chat-seen', '1'); } catch (e) { /* ignore */ }
        if (!started) {
          started = true;
          botSay({ text: cfg.greeting || 'Hola! I am the HOLA trade assistant. I can help you become a distributor, find a flavour or reach our team.', chips: DEFAULT_CHIPS });
        }
        setTimeout(function () { input.focus(); }, 60);
      }

      function close() {
        root.classList.remove('is-open');
        launcher.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }

      launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
      root.querySelector('.mb-chat__close').addEventListener('click', function () { close(); launcher.focus(); });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); launcher.focus(); } });
      root.querySelector('.mb-chat__form').addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        ask(v);
      });
      root.querySelector('.mb-chat__teaser-text').addEventListener('click', open);
      root.querySelector('.mb-chat__teaser-x').addEventListener('click', function () {
        teaser.hidden = true;
        try { sessionStorage.setItem('mb-chat-seen', '1'); } catch (e) { /* ignore */ }
      });

      var seen = false;
      try { seen = sessionStorage.getItem('mb-chat-seen') === '1'; } catch (e) { /* ignore */ }
      if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, cfg.teaserDelay || 6000);

      MB.chat.open = open;
      MB.chat.close = close;
    }
  };
})();
