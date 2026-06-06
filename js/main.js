// main.js - small UI interactions for the index page

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fonts list interactions (home page)
  function bindClickable(selector) {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      const target = el.dataset.target || el.closest('.font-item')?.dataset.href;
      if (!target) return;
      el.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey) {
          window.open(target, '_blank');
        } else {
          window.location.href = target;
        }
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            window.open(target, '_blank');
          } else {
            window.location.href = target;
          }
        }
      });
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
  }

  bindClickable('.font-name');
  bindClickable('.font-desc.clickable');

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? 'none' : 'flex';
    });
  }

  // Variable-weight demo (if variable is available)
  const weightRange = document.getElementById('weightRange');
  const specimen = document.getElementById('specimenText');

  function setSpecimenWeight(w) {
    if (!specimen) return;
    // If variable font is installed (GTN), use 'font-variation-settings'
    specimen.style.fontVariationSettings = `"wght" ${w}`;
    // Fallback for non-variable fonts: adjust font-weight property
    specimen.style.fontWeight = Math.round((w / 100));
  }

  if (weightRange && specimen) {
    setSpecimenWeight(weightRange.value);
    weightRange.addEventListener('input', function () { setSpecimenWeight(this.value); });
  }

  // Navigation logic remains visible on mobile, no hamburger menu needed.



});

const navLinks = document.querySelectorAll('.nav-list a');

navLinks.forEach(link => {
  const linkHref = link.getAttribute('href');
  if (linkHref !== '/' && window.location.pathname.startsWith(linkHref)) {
    link.setAttribute('aria-current', 'page');
  }
});


fetch("/partials/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("site-footer").innerHTML = html;

    // update year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  })
  .catch(err => console.error("Footer load failed:", err));
