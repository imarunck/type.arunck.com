// fonts.js - interactions for /fonts/index.html

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year (reused)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Make name buttons and clickable descriptions navigate to the font page
  function bindClickable(selector){
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      const target = el.dataset.target || el.closest('.font-item')?.dataset.href;
      if (!target) return;
      el.addEventListener('click', function (e) {
        // allow ctrl/cmd + click to open in new tab
        if (e.ctrlKey || e.metaKey) {
          window.open(target, '_blank');
        } else {
          window.location.href = target;
        }
      });
      // keyboard activation via Enter
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
      // Make sure element is focusable if it's not already (for <p> desc)
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
  }

  bindClickable('.font-name');
  bindClickable('.font-desc.clickable');

  // If the page is loaded on a small screen, ensure nav toggle behavior is consistent
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    if (window.innerWidth <= 640) navList.style.display = 'none';
  }
});
