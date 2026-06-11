(function () {
  'use strict';

  // ===== RESPECT REDUCED MOTION =====
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== IMAGE FALLBACK HANDLER =====
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      handleBrokenImage(img);
    }
  });

  function handleBrokenImage(img) {
    img.style.display = 'none';
    var parent = img.parentElement;
    if (!parent) return;
    if (parent.classList.contains('branch-img')) {
      parent.style.background = 'linear-gradient(135deg, #0B1F3A, #132c52)';
      parent.style.minHeight = '220px';
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';
      var placeholder = document.createElement('span');
      placeholder.textContent = '🏛';
      placeholder.style.fontSize = '3.5rem';
      placeholder.style.opacity = '0.3';
      parent.appendChild(placeholder);
    } else if (parent.classList.contains('hero-bg')) {
      img.remove();
    }
  }

  // ===== NAVBAR SCROLL EFFECT =====
  var navbar = document.getElementById('navbar');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ===== MOBILE HAMBURGER =====
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== FADE-IN ON SCROLL (IntersectionObserver) =====
  if (!prefersReducedMotion) {
    var fadeElements = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
      var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

      fadeElements.forEach(function (el) {
        fadeObserver.observe(el);
      });
    } else {
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  } else {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===== COUNTER ANIMATION =====
  var counters = document.querySelectorAll('.counter');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);

        if (counter.dataset.target === '89') {
          counter.textContent = current;
          var suffix = counter.nextElementSibling;
          if (suffix && suffix.classList.contains('stat-suffix')) {
            suffix.textContent = current === 89 ? '.6%' : '.6%';
          }
        } else {
          counter.textContent = current.toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (counter.dataset.target === '89') {
            counter.textContent = '89';
          } else {
            counter.textContent = target.toLocaleString();
          }
        }
      }

      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var statsSection = document.querySelector('.stats');
    if (statsSection) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statsSection);
    }
  } else {
    animateCounters();
  }

  // ===== TESTIMONIALS CAROUSEL =====
  var carouselTrack = document.getElementById('carouselTrack');
  var carouselDots = document.getElementById('carouselDots');

  if (carouselTrack && carouselDots) {
    var slides = carouselTrack.querySelectorAll('.carousel-slide');
    var totalSlides = slides.length;
    var currentIndex = 0;
    var autoplayInterval;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.setAttribute('aria-label', i + 1 + '-chi slayd');
      carouselDots.appendChild(dot);
    });

    var dots = carouselDots.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      carouselTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      dots.forEach(function (d) { d.classList.remove('active'); });
      dots[currentIndex].classList.add('active');
    }

    function startAutoplay() {
      stopAutoplay();
      if (!prefersReducedMotion) {
        autoplayInterval = setInterval(function () {
          goToSlide(currentIndex + 1);
        }, 4000);
      }
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-index'), 10);
        goToSlide(index);
        startAutoplay();
      });
    });

    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  // ===== FORM VALIDATION =====
  var form = document.getElementById('enrollForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    var nameInput = document.getElementById('formName');
    var phoneInput = document.getElementById('formPhone');
    var courseSelect = document.getElementById('formCourse');
    var branchSelect = document.getElementById('formBranch');

    var fields = [
      { el: nameInput, validate: function (v) { return v.trim().length >= 2; }, msg: 'Ismingizni kiriting (kamida 2 harf)' },
      { el: phoneInput, validate: function (v) { return /^[\+\d\s\-\(\)]{7,20}$/.test(v.trim()); }, msg: 'Telefon raqamni togri kiriting' },
      { el: courseSelect, validate: function (v) { return v !== ''; }, msg: 'Kursni tanlang' },
      { el: branchSelect, validate: function (v) { return v !== ''; }, msg: 'Filialni tanlang' }
    ];

    function validateField(field) {
      var group = field.el.closest('.form-group');
      var errorEl = group.querySelector('.form-error');
      var isValid = field.validate(field.el.value);
      if (!isValid) {
        group.classList.add('error');
        if (errorEl) errorEl.textContent = field.msg;
      } else {
        group.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      }
      return isValid;
    }

    fields.forEach(function (f) {
      f.el.addEventListener('blur', function () { validateField(f); });
      f.el.addEventListener('input', function () {
        var group = f.el.closest('.form-group');
        if (group.classList.contains('error')) {
          validateField(f);
        }
      });
      f.el.addEventListener('change', function () {
        if (f.el.tagName === 'SELECT') validateField(f);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      fields.forEach(function (f) {
        if (!validateField(f)) allValid = false;
      });

      if (allValid) {
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS (fallback for CSS scroll-behavior) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== CLOSE MOBILE MENU ON RESIZE =====
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
