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

  // Every CTA opens a small picker: Gmail, Outlook, default mail app, or copy.
  // A bare mailto: link does nothing for visitors without a desktop mail app.
  var dialog = null;
  function picker(subject) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'mail-dialog';
      dialog.setAttribute('aria-labelledby', 'mail-dialog-title');
      dialog.innerHTML =
        '<button class="x" type="button" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.75" fill="none"/></svg></button>' +
        '<div class="inner">' +
        '<div class="label sm">Book a call</div>' +
        '<h2 class="h3" id="mail-dialog-title">Email me to set up a time.</h2>' +
        '<div class="addr">' + EMAIL + '</div>' +
        '<div class="opts">' +
        '<a class="opt primary" data-k="gmail" target="_blank" rel="noopener">Gmail</a>' +
        '<a class="opt" data-k="outlook" target="_blank" rel="noopener">Outlook</a>' +
        '<a class="opt" data-k="app">Mail app</a>' +
        '<button class="opt" type="button" data-k="copy">Copy address</button>' +
        '</div></div>';
      document.body.appendChild(dialog);
      dialog.querySelector('.x').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      dialog.querySelectorAll('a.opt').forEach(function (a) {
        a.addEventListener('click', function () {
          track('Email client', { client: a.getAttribute('data-k') });
          setTimeout(function () { dialog.close(); }, 100);
        });
      });
      var copyBtn = dialog.querySelector('[data-k="copy"]');
      copyBtn.addEventListener('click', function () {
        var done = function () { copyBtn.textContent = 'Copied'; track('Email client', { client: 'copy' }); };
        if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, function () {});
        else { var r = document.createRange(); r.selectNodeContents(dialog.querySelector('.addr')); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      });
    }
    var su = encodeURIComponent(subject);
    var to = encodeURIComponent(EMAIL);
    dialog.querySelector('[data-k="gmail"]').href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + su;
    dialog.querySelector('[data-k="outlook"]').href = 'https://outlook.office.com/mail/deeplink/compose?to=' + to + '&subject=' + su;
    dialog.querySelector('[data-k="app"]').href = 'mailto:' + EMAIL + '?subject=' + su;
    dialog.querySelector('[data-k="copy"]').textContent = 'Copy address';
    if (dialog.showModal) dialog.showModal(); else location.href = 'mailto:' + EMAIL + '?subject=' + su;
  }

  document.querySelectorAll('[data-offer]').forEach(function (el) {
    var offer = el.getAttribute('data-offer');
    var subject = SUBJECTS[offer] || SUBJECTS.general;
    el.setAttribute('href', 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject));
    el.addEventListener('click', function (e) {
      track('Book a call click', { offer: offer, location: el.getAttribute('data-loc') || '' });
      e.preventDefault();
      picker(subject);
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
