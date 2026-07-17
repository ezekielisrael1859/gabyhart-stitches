/* ===================================================================
   GABYHART STITCHES — main.js
   Shared behavior across all pages.
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ============ FOOTER YEAR ============ */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ============ NAV TOGGLE (overlay menu) ============ */
  var navToggle = document.getElementById('nav-toggle');
  var navOverlay = document.getElementById('nav-overlay');

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', function () {
      var isOpen = navOverlay.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navOverlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is tapped
    navOverlay.querySelectorAll('.nav-overlay__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navOverlay.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============ WHATSAPP BUTTON — FADE IN AFTER SCROLL ============ */
  var whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    var showWhatsapp = function () {
      if (window.scrollY > 300) {
        whatsappBtn.classList.add('is-visible');
      } else {
        whatsappBtn.classList.remove('is-visible');
      }
    };
    showWhatsapp();
    window.addEventListener('scroll', showWhatsapp, { passive: true });
  }

  /* ============ SCROLL REVEAL (restrained, per design system) ============ */
  var revealTargets = document.querySelectorAll(
    '.page-hero, .founder-story, .approach-strip__item, .testimonial-card, ' +
    '.product-card, .price-ledger__group, .gallery-item, .fabric-type-card, ' +
    '.corporate-audience-card, .size-guide-step, .craft-strip, .fabric-story'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal-init');
      revealObserver.observe(el);
    });
  }

  /* ============ MONOGRAM PARALLAX (signature touch, page-hero only) ============ */
  var monogramTextures = document.querySelectorAll('.page-hero__monogram-texture');
  if (monogramTextures.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      var offset = window.scrollY * 0.15;
      monogramTextures.forEach(function (el) {
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }, { passive: true });
  }
  /* ============ GALLERY FILTER (gallery.html) ============ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryEmptyState = document.querySelector('[data-gallery-empty]');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var visibleCount = 0;
        galleryItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          var show = filter === 'all' || category === filter;
          item.hidden = !show;
          if (show) visibleCount++;
        });

        if (galleryEmptyState) {
          galleryEmptyState.hidden = visibleCount !== 0;
        }
      });
    });
  }

  /* ============ LIGHTBOX (gallery.html) ============ */
  var lightbox = document.querySelector('[data-lightbox]');
  var lightboxImg = document.querySelector('[data-lightbox-image]');
  var lightboxCaption = document.querySelector('[data-lightbox-caption]');
  var lightboxClose = document.querySelector('[data-lightbox-close]');
  var lightboxTriggers = document.querySelectorAll('[data-lightbox-trigger]');

  if (lightbox && lightboxTriggers.length) {
    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var img = trigger.querySelector('img');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.textContent = img.alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });

    var closeLightbox = function () {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ============ BOOKING FORM — 5-STEP LOGIC (booking.html) ============ */
  var bookingForm = document.querySelector('[data-booking-form]');
  if (bookingForm) {
    var steps = bookingForm.querySelectorAll('.booking-step');
    var progressSteps = document.querySelectorAll('[data-progress-step]');
    var currentStep = 1;
    var totalSteps = steps.length;

    var showStep = function (stepNum) {
      steps.forEach(function (step) {
        var num = parseInt(step.getAttribute('data-booking-step'), 10);
        step.classList.toggle('is-active', num === stepNum);
      });
      progressSteps.forEach(function (p) {
        var num = parseInt(p.getAttribute('data-progress-step'), 10);
        p.classList.toggle('is-active', num <= stepNum);
      });
      currentStep = stepNum;
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    bookingForm.querySelectorAll('[data-step-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (currentStep < totalSteps) showStep(currentStep + 1);
      });
    });

    bookingForm.querySelectorAll('[data-step-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (currentStep > 1) showStep(currentStep - 1);
      });
    });

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: wire to real submission endpoint (email service, form backend, or WhatsApp deep link)
      var successEl = document.querySelector('[data-booking-success]');
      if (successEl) {
        bookingForm.hidden = true;
        document.querySelector('[data-booking-progress]').hidden = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ============ CONTACT FORM (contact.html) ============ */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: wire to real submission endpoint
      contactForm.innerHTML = '<h2>Message sent.</h2><p>We\'ll get back to you shortly. You can also reach us directly on WhatsApp.</p>';
    });
  }

  /* ============ CORPORATE FORM (corporate.html) ============ */
  var corporateForm = document.querySelector('[data-corporate-form]');
  if (corporateForm) {
    corporateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: wire to real submission endpoint
      corporateForm.innerHTML = '<h2>Quote request received.</h2><p>We\'ll follow up with pricing and timeline shortly.</p>';
    });
  }

  /* ============ PAY NOW — GATEWAY-AGNOSTIC HOOK (shop/*.html) ============ */
  var payButtons = document.querySelectorAll('[data-pay-now]');
  payButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // TODO: swap this block for the confirmed gateway (Paystack / Flutterwave / Moniepoint)
      // Example shape once confirmed:
      // PaystackPop.setup({ key: 'PUBLIC_KEY', email: '...', amount: ..., callback: fn }).openIframe();
      alert('Payment gateway not yet connected. This will open checkout once Paystack/Flutterwave/Moniepoint is confirmed.');
    });
  });

});