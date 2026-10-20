/* FraudSignal: nav, email CTAs, analytics */
(function () {
  var EMAIL = 'david@fraudsignal.io';
  var SUBJECTS = {
    general: 'Book a call',
    audit: 'Risk Audit',
    interim: 'Interim Head of Risk',
    fractional: 'Fractional Head of Risk'
  };

  function track(name, props) {
    if (window.plausible) window.plausible(name, { props: props });
  }

  // Every CTA opens an email with the offer in the subject line
  document.querySelectorAll('[data-offer]').forEach(function (el) {
    var offer = el.getAttribute('data-offer');
    el.setAttribute('href', 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(SUBJECTS[offer] || SUBJECTS.general));
    el.addEventListener('click', function () {
      track('Book a call click', { offer: offer, location: el.getAttribute('data-loc') || '' });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]:not([data-offer])').forEach(function (el) {
    el.addEventListener('click', function () { track('Email click', {}); });
  });

  // Sticky nav: rule on scroll, mobile menu
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    var btn = header.querySelector('.menu-btn');
    if (btn) {
      var setOpen = function (open) {
        header.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      btn.addEventListener('click', function () { setOpen(!header.classList.contains('open')); });
      header.querySelectorAll('.navlinks a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('open')) { setOpen(false); btn.focus(); }
      });
    }
  }
})();
