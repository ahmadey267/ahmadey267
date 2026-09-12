/* Haviy Global Services — interactions */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- masthead ---- */
  var mast = document.querySelector('.masthead');
  if (mast) {
    var solid = function () { mast.classList.toggle('solid', window.scrollY > 40); };
    solid();
    window.addEventListener('scroll', solid, { passive: true });
  }

  /* ---- drawer ---- */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    var setDrawer = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) { setDrawer(false); burger.focus(); }
    });
  }

  /* ---- reveal ---- */
  var rv = document.querySelectorAll('.rv');
  if (rv.length) {
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
      rv.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 5, 4) * 80 + 'ms';
        io.observe(el);
      });
    } else {
      rv.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---- counters ---- */
  var nums = document.querySelectorAll('[data-to]');
  if (nums.length && 'IntersectionObserver' in window && !reduced) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target;
        var to = parseFloat(el.getAttribute('data-to'));
        var t0 = performance.now();
        var tick = function (now) {
          var k = Math.min((now - t0) / 1100, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { co.observe(el); });
  }

  /* ---- cursor preview on the services index ---- */
  var peek = document.querySelector('.peek');
  var rows = document.querySelectorAll('.index-row[data-pic]');
  if (peek && rows.length && !reduced && window.matchMedia('(min-width: 1100px)').matches) {
    var img = peek.querySelector('img');
    var x = 0, y = 0, cx = 0, cy = 0, running = false;
    var loop = function () {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      peek.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)' +
        (peek.classList.contains('on') ? ' scale(1)' : ' scale(.9)');
      if (running) requestAnimationFrame(loop);
    };
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        img.src = row.getAttribute('data-pic');
        peek.classList.add('on');
        if (!running) { running = true; requestAnimationFrame(loop); }
      });
      row.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
    });
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (cx === 0 && cy === 0) { cx = x; cy = y; }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { peek.classList.remove('on'); running = false; });
  }

  /* ---- jump rail active state ---- */
  var jumps = document.querySelectorAll('.jump a');
  if (jumps.length && 'IntersectionObserver' in window) {
    var targets = [];
    jumps.forEach(function (a) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) targets.push(t);
    });
    var jo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        jumps.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { jo.observe(t); });
  }

  /* ---- hero quick enquiry hands off to the contact form ---- */
  var quick = document.getElementById('quickbar');
  if (quick) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(quick);
      var q = new URLSearchParams();
      ['service', 'date', 'pax'].forEach(function (k) {
        var v = (d.get(k) || '').toString().trim();
        if (v) q.set(k, v);
      });
      window.location.href = 'contact.html' + (q.toString() ? '?' + q : '') + '#enquiry';
    });
  }

  /* ---- contact form ---- */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var pre = function (name, value) {
      if (!value) return;
      var el = form.elements[name];
      if (!el) return;
      if (el.tagName === 'SELECT') {
        var found = Array.prototype.some.call(el.options, function (o) { return o.value === value; });
        if (found) el.value = value;
      } else {
        el.value = value;
      }
    };
    pre('service', params.get('service'));
    pre('date', params.get('date'));
    pre('pax', params.get('pax'));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var g = function (k) { return (d.get(k) || '').toString().trim(); };
      var body = [
        'Name: ' + g('name'),
        'Email: ' + g('email'),
        'Phone: ' + g('phone'),
        'Service: ' + g('service'),
        'Date: ' + (g('date') || 'Not specified'),
        'Passengers: ' + (g('pax') || 'Not specified'),
        '',
        'Details:',
        g('message')
      ].join('\n');
      var note = document.getElementById('notice');
      if (note) {
        note.textContent = 'Opening your email application with this enquiry ready to send. If nothing opens, write to info@hgs.co.ke or call +254 726 920 016.';
        note.classList.add('show');
      }
      window.location.href = 'mailto:info@hgs.co.ke?subject=' +
        encodeURIComponent('Enquiry: ' + (g('service') || 'General')) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---- year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
