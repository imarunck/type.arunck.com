// main.js - small UI interactions for pages

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year if the footer loads immediately.
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

  // Variable-weight demo (if variable is available)
  const weightRange = document.getElementById('weightRange');
  const specimen = document.getElementById('specimenText');

  function setSpecimenWeight(w) {
    if (!specimen) return;
    specimen.style.fontVariationSettings = `"wght" ${w}`;
    specimen.style.fontWeight = Math.round((w / 100));
  }

  if (weightRange && specimen) {
    setSpecimenWeight(weightRange.value);
    weightRange.addEventListener('input', function () { setSpecimenWeight(this.value); });
  }

  loadPartial('/partials/header.html', 'site-header', initHeader);
  loadPartial('/partials/footer.html', 'site-footer', function () {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });
});

function loadPartial(url, elementId, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (el.innerHTML.trim()) {
    if (callback) callback();
    return;
  }

  fetch(url)
    .then(res => res.text())
    .then(html => {
      el.innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(`${elementId} load failed:`, err));
}

function initHeader() {
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? 'none' : 'flex';
    });
  }

  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === '/' && window.location.pathname === '/') {
      link.setAttribute('aria-current', 'page');
    } else if (linkHref !== '/' && window.location.pathname.startsWith(linkHref)) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
