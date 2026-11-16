/**
 * Green Haven Residences - Navigation & Header Logic
 * Handles sticky scroll state, mobile drawer, active navigation links, and accessibility.
 */

export function initNavigation() {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navContainer = document.getElementById('navContainer');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header Scroll Effect
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Hamburger Toggle
  function openMobileNav() {
    if (!navContainer || !navToggle) return;
    navContainer.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navContainer || !navToggle) return;
    navContainer.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navContainer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeMobileNav();
      }
    });
  });

  // ESC key closes mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navContainer && navContainer.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Highlight Current Active Page
  highlightActiveLink();
}

export function highlightActiveLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href) return;

    const target = href.toLowerCase().split('/').pop().replace('.html', '');
    const currentFile = currentPath.split('/').pop().replace('.html', '') || 'index';

    if (
      (currentFile === '' || currentFile === 'index') && (target === 'index' || target === '')
    ) {
      link.classList.add('active');
    } else if (currentFile !== 'index' && currentFile.includes(target)) {
      link.classList.add('active');
    }
  });
}

// Auto-run if loaded as standard script
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
  });
}
