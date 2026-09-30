/* QC Title — interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Nav scroll state --- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Accordion --- */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var body = acc.querySelector('.acc__a');
      var open = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc.open .acc__a').forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  });

  /* --- Order form: composes an email to orders@ with every field filled in.
         Static host, no backend — the order lands in the same inbox as a
         direct email would. --- */
  var form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var g = function (n) { var el = form.elements[n]; return el ? (el.value || '').trim() : ''; };
      var addr = g('address');
      var lines = [
        'NEW TITLE ORDER — QC Title',
        '',
        'Contact name:      ' + g('name'),
        'Company / firm:    ' + (g('company') || '—'),
        'Email:             ' + g('email'),
        'Phone:             ' + g('phone'),
        '',
        'Property address:  ' + addr,
        'County:            ' + g('county'),
        'State:             ' + g('state'),
        'Transaction type:  ' + g('txn'),
        'My role:           ' + g('role'),
        'Target closing:    ' + (g('closing') || '—'),
        '',
        'Notes / special instructions:',
        (g('notes') || '—'),
        '',
        '(Please attach the contract or any related documents to this email.)'
      ];
      var subject = 'New Title Order — ' + (addr || g('name'));
      var href = 'mailto:' + form.dataset.to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var msg = document.getElementById('form-msg');
      if (msg) {
        msg.innerHTML = 'Your email app should open with the order filled in. If it does not, email the details to <a href="mailto:' + form.dataset.to + '"><strong>' + form.dataset.to + '</strong></a> or call <a href="tel:' + form.dataset.tel + '"><strong>' + form.dataset.phone + '</strong></a>.';
        msg.classList.add('show');
      }
      window.location.href = href;
    });
  }

  /* --- Current year --- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
