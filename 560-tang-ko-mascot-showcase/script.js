// Tailwind Configuration
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'brand-yellow': '#fcd34d',
          'brand-brown': '#5c4033',
          'brand-gray': '#e5e7eb',
        },
        fontFamily: {
          sans: ['Kanit', 'sans-serif'],
        },
      }
    }
  };
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Intersection Observer for Scroll Animations & Staggered Reveal
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If it's a section, fade it in
          if (entry.target.tagName.toLowerCase() === 'section') {
            entry.target.classList.add('animate-fade-in');
            obs.unobserve(entry.target);
          }
          // If it's a stagger wrapper, reveal children
          if (entry.target.classList.contains('stagger-wrapper')) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      if (!section.id || section.id !== 'home') {
        section.classList.add('opacity-0');
        observer.observe(section);
      }
    });

    document.querySelectorAll('.stagger-wrapper').forEach(wrapper => {
      observer.observe(wrapper);
    });

    // 2. Mascot 3D Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(el => {
      const wrapper = el.closest('.tilt-wrapper');
      if (!wrapper) return;

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max tilt 15deg
        const rotateY = ((x - centerX) / centerX) * 15;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });

      wrapper.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });

    // 3. Back to Top & ScrollSpy
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      // Show/Hide Back to Top
      if (backToTopBtn) {
        if (currentScroll > 500) {
          backToTopBtn.classList.add('show-back-to-top');
        } else {
          backToTopBtn.classList.remove('show-back-to-top');
        }
      }

      // ScrollSpy Logic
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (currentScroll >= (sectionTop - sectionHeight / 3)) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('nav-active');
        }
      });
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
});
