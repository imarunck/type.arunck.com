// main.js - small UI interactions for the index page

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? 'none' : 'flex';
    });
    // ensure proper initial state on small screens
    if (window.innerWidth <= 640) navList.style.display = 'none';
  }

  // Variable-weight demo (if variable is available)
  const weightRange = document.getElementById('weightRange');
  const specimen = document.getElementById('specimenText');

  function setSpecimenWeight(w) {
    if (!specimen) return;
    // If variable font is installed (GTN), use 'font-variation-settings'
    specimen.style.fontVariationSettings = `"wght" ${w}`;
    // Fallback for non-variable fonts: adjust font-weight property
    specimen.style.fontWeight = Math.round((w/100));
  }

  if (weightRange && specimen) {
    setSpecimenWeight(weightRange.value);
    weightRange.addEventListener('input', function () { setSpecimenWeight(this.value); });
  }

  // Accessibility: close nav if clicked outside (mobile)
  document.addEventListener('click', function (e) {
    if (!navList || !navToggle) return;
    if (window.innerWidth > 640) return;
    if (!navList.contains(e.target) && e.target !== navToggle) {
      navList.style.display = 'none';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

});

const navLinks = document.querySelectorAll('.nav-list a');

navLinks.forEach(link => {
  const linkHref = link.getAttribute('href');
  if (linkHref !== '/' && window.location.pathname.startsWith(linkHref)) {
    link.setAttribute('aria-current', 'page');
  }
});
