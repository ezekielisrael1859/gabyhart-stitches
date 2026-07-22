/* ==========================================================================
   GABYHART STITCHES — Main JS
   Every feature checks for its own DOM targets and fails silently if absent.
   No feature may throw and interrupt the features that run after it.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- FEATURE: Mobile Nav Toggle ---- */
  (function initNavToggle() {
    try {
      var toggle = document.querySelector('.nav-toggle');
      var nav = document.querySelector('.site-nav');
      if (!toggle || !nav) return;

      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('nav-open', isOpen);
      });

      var navLinks = nav.querySelectorAll('.site-nav__link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        });
      });
    } catch (err) {
      console.error('[nav-toggle]', err);
    }
  })();

  /* ---- FEATURE: WhatsApp Float — fade in after ~300px scroll ---- */
  (function initWhatsappFloat() {
    try {
      var floatBtn = document.querySelector('.whatsapp-float');
      if (!floatBtn) return;

      var toggleVisibility = function () {
        if (window.scrollY > 300) {
          floatBtn.classList.add('is-visible');
        } else {
          floatBtn.classList.remove('is-visible');
        }
      };

      toggleVisibility();
      window.addEventListener('scroll', toggleVisibility, { passive: true });
    } catch (err) {
      console.error('[whatsapp-float]', err);
    }
  })();

  /* ---- FEATURE: Scroll Reveal ---- */
  (function initScrollReveal() {
    try {
      var revealEls = document.querySelectorAll('.reveal');
      if (!revealEls.length) return;

      if (!('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(function (el) { observer.observe(el); });
    } catch (err) {
      console.error('[scroll-reveal]', err);
    }
  })();

  /* ---- FEATURE: Gallery / Shop Filters (stub — activates when filter UI exists) ---- */
  (function initFilters() {
    try {
      var filterButtons = document.querySelectorAll('[data-filter]');
      var filterItems = document.querySelectorAll('[data-category]');
      if (!filterButtons.length || !filterItems.length) return;

      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-filter');

          filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          filterItems.forEach(function (item) {
            var category = item.getAttribute('data-category');
            var show = target === 'all' || target === category;
            item.style.display = show ? '' : 'none';
          });
        });
      });
    } catch (err) {
      console.error('[filters]', err);
    }
  })();

  /* ---- FEATURE: Lightbox (stub — activates when gallery images exist) ---- */
  (function initLightbox() {
    try {
      var triggers = document.querySelectorAll('[data-lightbox]');
      var lightbox = document.querySelector('.lightbox');
      if (!triggers.length || !lightbox) return;

      var lightboxImg = lightbox.querySelector('.lightbox__image');
      var closeBtn = lightbox.querySelector('.lightbox__close');
      if (!lightboxImg) return;

      var openLightbox = function (src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('is-open');
        document.body.classList.add('nav-open');
      };

      var closeLightbox = function () {
        lightbox.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      };

      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var src = trigger.getAttribute('data-lightbox');
          var alt = trigger.getAttribute('data-alt') || '';
          openLightbox(src, alt);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    } catch (err) {
      console.error('[lightbox]', err);
    }
  })();

  /* ---- FEATURE: Booking Form — Multi-step (stub — activates on booking.html) ---- */
  (function initFormSteps() {
    try {
      var form = document.querySelector('[data-multistep-form]');
      if (!form) return;

      var steps = form.querySelectorAll('[data-step]');
      var nextButtons = form.querySelectorAll('[data-step-next]');
      var prevButtons = form.querySelectorAll('[data-step-prev]');
      if (!steps.length) return;

      var currentStep = 0;

      var showStep = function (index) {
        steps.forEach(function (step, i) {
          step.style.display = i === index ? '' : 'none';
        });
      };

      showStep(currentStep);

      nextButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
          }
        });
      });

      prevButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
          }
        });
      });
    } catch (err) {
      console.error('[form-steps]', err);
    }
  })();

  /* ---- FEATURE: Subtle Parallax (single moment — hero only, stub) ---- */
  (function initParallax() {
    try {
      var parallaxEl = document.querySelector('[data-parallax]');
      if (!parallaxEl) return;

      var handleParallax = function () {
        var offset = window.scrollY;
        parallaxEl.style.transform = 'translateY(' + (offset * 0.15) + 'px)';
      };

      window.addEventListener('scroll', handleParallax, { passive: true });
    } catch (err) {
      console.error('[parallax]', err);
    }
  })();

  /* ---- FEATURE: Sticky Book a Fitting bar (shows after hero scrolled past) ---- */
  (function initStickyCta() {
    try {
      var bar = document.querySelector('.sticky-cta');
      var hero = document.querySelector('.hero');
      if (!bar || !hero) return;

      var toggleBar = function () {
        var heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
          bar.classList.add('is-visible');
        } else {
          bar.classList.remove('is-visible');
        }
      };

      window.addEventListener('scroll', toggleBar, { passive: true });
    } catch (err) {
      console.error('[sticky-cta]', err);
    }
  })();

  /* ---- FEATURE: Animated stat counters (counts up when scrolled into view) ---- */
  (function initStatCounters() {
    try {
      var counters = document.querySelectorAll('.stat-item__number');
      if (!counters.length) return;

      var animateCount = function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var current = 0;
        var step = Math.max(1, Math.ceil(target / 40));
        var tick = function () {
          current += step;
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = current;
            requestAnimationFrame(tick);
          }
        };
        tick();
      };

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      counters.forEach(function (el) { observer.observe(el); });
    } catch (err) {
      console.error('[stat-counters]', err);
    }
  })();

});

/* ==========================================================================
   PAYMENT CONFIG — gateway-agnostic stub
   Swap `provider` and `init` logic here once Gabriel confirms gateway
   (Paystack / Flutterwave / Moniepoint). "Pay Now" buttons call
   window.GabyhartPayment.start(orderDetails) — wrapped defensively so
   missing config never breaks the rest of the site.
   ========================================================================== */
window.GabyhartPayment = (function () {
  var config = {
    provider: null, // 'paystack' | 'flutterwave' | 'moniepoint' — TBD
    publicKey: null // TBD once gateway confirmed
  };

  function start(orderDetails) {
    try {
      if (!config.provider) {
        console.warn('[payment] Gateway not yet configured.');
        alert('Online payment is being set up. Please contact us via WhatsApp to complete your order.');
        return;
      }
      // Gateway-specific init will go here once confirmed.
    } catch (err) {
      console.error('[payment]', err);
    }
  }

  return { start: start, config: config };
})();