const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const brandLink = document.querySelector('.brand');
const siteHeader = document.querySelector('.site-header');
const navOverlay = document.createElement('div');

navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

let lastScrollY = window.scrollY;

function updateMobileHeaderVisibility() {
  if (!siteHeader) {
    return;
  }

  if (window.innerWidth > 1020) {
    siteHeader.classList.remove('site-header--hidden');
    lastScrollY = window.scrollY;
    return;
  }

  if (document.body.classList.contains('nav-open')) {
    siteHeader.classList.remove('site-header--hidden');
    lastScrollY = window.scrollY;
    return;
  }

  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  if (currentScrollY < 30 || delta < -6) {
    siteHeader.classList.remove('site-header--hidden');
  } else if (delta > 6) {
    siteHeader.classList.add('site-header--hidden');
  }

  lastScrollY = currentScrollY;
}

function setNavState(isOpen) {
  if (!navToggle || !navLinks) {
    return;
  }

  navLinks.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', isOpen);
  navOverlay.classList.toggle('is-visible', isOpen);
}

if (brandLink) {
  brandLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');

    if (!targetId || targetId === '#' || targetId === '#top') {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

if (navToggle && navLinks) {
  setNavState(false);

  navToggle.addEventListener('click', () => {
    const isOpen = !navLinks.classList.contains('is-open');
    setNavState(isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setNavState(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('is-open')) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !navLinks.contains(target) && !navToggle.contains(target)) {
      setNavState(false);
    }
  });

  navOverlay.addEventListener('click', () => {
    setNavState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setNavState(false);
      navToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020 && navLinks.classList.contains('is-open')) {
      setNavState(false);
    }

    updateMobileHeaderVisibility();
  });
}

window.addEventListener('scroll', updateMobileHeaderVisibility, { passive: true });
window.addEventListener('resize', updateMobileHeaderVisibility);
updateMobileHeaderVisibility();

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll('img[src^="images/"]').forEach((img) => {
  img.addEventListener('error', () => {
    if (!img.dataset.fallbackTried) {
      img.dataset.fallbackTried = 'true';
      const fallbackSrc = img.getAttribute('src').replace(/^images\//, '');
      img.setAttribute('src', fallbackSrc);
    }
  });
});
