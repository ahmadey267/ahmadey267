/* Haviy Global Services — site interactions */
(function () {
  'use strict';

  /* Sticky header shadow */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('is-open', !open);
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
      });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* Scroll reveal */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        observer.observe(el);
      });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* Counting statistics */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countObserver.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var duration = 1200;
        var step = function (now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* Active section highlight on the services jump navigation */
  var jumpLinks = document.querySelectorAll('.jump-nav a');
  if (jumpLinks.length && 'IntersectionObserver' in window) {
    var sections = [];
    jumpLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) sections.push(section);
    });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        jumpLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* Enquiry form: compose a structured email for the team */
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var value = function (key) { return (data.get(key) || '').toString().trim(); };
      var lines = [
        'Name: ' + value('name'),
        'Email: ' + value('email'),
        'Phone: ' + value('phone'),
        'Service required: ' + value('service'),
        'Preferred date: ' + (value('date') || 'Not specified'),
        '',
        'Details:',
        value('message')
      ];
      var subject = 'Service enquiry: ' + (value('service') || 'General');
      var href = 'mailto:info@hgs.co.ke?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Your email client is opening with the enquiry ready to send. If nothing opens, please write to info@hgs.co.ke or call +254 726 920 016.';
        status.classList.add('is-visible');
      }
      window.location.href = href;
    });
  }

  /* Current year in the footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
