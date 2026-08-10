/* ==========================================================================
   GABYHART STITCHES — Main JS
   Every feature checks for its own DOM targets and fails silently if absent.
   No feature may throw and interrupt the features that run after it.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();

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


  /* ---- FEATURE: Lightbox with prev/next navigation ---- */
  (function initLightbox() {
    try {
      var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
      var lightbox = document.querySelector('.lightbox');
      if (!triggers.length || !lightbox) return;

      var lightboxImg = lightbox.querySelector('.lightbox__image');
      var closeBtn = lightbox.querySelector('.lightbox__close');
      var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
      var nextBtn = lightbox.querySelector('.lightbox__nav--next');
      var counter = lightbox.querySelector('.lightbox__counter');
      if (!lightboxImg) return;

      var currentIndex = 0;

      var showAtIndex = function (index) {
        currentIndex = (index + triggers.length) % triggers.length;
        var trigger = triggers[currentIndex];
        var src = trigger.getAttribute('data-lightbox');
        var alt = trigger.getAttribute('data-alt') || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        if (counter) counter.textContent = (currentIndex + 1) + ' / ' + triggers.length;
      };

      var openLightbox = function (index) {
        showAtIndex(index);
        lightbox.classList.add('is-open');
        document.body.classList.add('nav-open');
      };

      var closeLightbox = function () {
        lightbox.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      };

      triggers.forEach(function (trigger, index) {
        trigger.addEventListener('click', function () {
          openLightbox(index);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (prevBtn) prevBtn.addEventListener('click', function () { showAtIndex(currentIndex - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { showAtIndex(currentIndex + 1); });

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showAtIndex(currentIndex - 1);
        if (e.key === 'ArrowRight') showAtIndex(currentIndex + 1);
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

  /* ---- FEATURE: Shop Tabs (Shop / Prices / Sizing) ---- */
  (function initShopTabs() {
    try {
      var tabButtons = document.querySelectorAll('[data-tab-btn]');
      var tabPanels = document.querySelectorAll('[data-tab-panel]');
      if (!tabButtons.length || !tabPanels.length) return;

      tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab-btn');

          tabButtons.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');

          tabPanels.forEach(function (panel) {
            var show = panel.getAttribute('data-tab-panel') === target;
            panel.hidden = !show;
          });
        });
      });
    } catch (err) {
      console.error('[shop tabs]', err);
    }
  })();

  /* ---- FEATURE: Product Detail Toggle (accordion, one open at a time) ---- */
  (function initProductToggle() {
    try {
      var toggleButtons = document.querySelectorAll('[data-product-toggle]');
      var detailPanels = document.querySelectorAll('[data-product-detail]');
      if (!toggleButtons.length || !detailPanels.length) return;

      toggleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-product-toggle');
          var targetPanel = document.querySelector('[data-product-detail="' + target + '"]');
          if (!targetPanel) return;

          var wasOpen = !targetPanel.hidden;

          detailPanels.forEach(function (panel) { panel.hidden = true; });
          targetPanel.hidden = wasOpen;

          if (!wasOpen && targetPanel.scrollIntoView) {
            targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    } catch (err) {
      console.error('[product toggle]', err);
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
function initThemeToggle() {
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('gh-theme', theme); } catch (e) {}
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

  btn.addEventListener('click', function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

function initStoryVideoAutoplay() {
  var video = document.querySelector('.home-story__video');
  if (!video) return;
  if (!('IntersectionObserver' in window)) { video.play().catch(function(){}); return; }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        video.play().catch(function(){});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(video);
}
document.addEventListener('DOMContentLoaded', initStoryVideoAutoplay);
