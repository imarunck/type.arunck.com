// blog.js - small interactions for blog index

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Make whole post-card clickable (image/title/excerpt already link)
  const cards = document.querySelectorAll('.post-card');
  cards.forEach(card => {
    const target = card.dataset.href;
    if (!target) return;
    card.addEventListener('click', function (e) {
      // If user clicked an interactive element (link/button), let default happen
      const interactive = e.target.closest('a, button, input');
      if (interactive) return;
      // allow cmd/ctrl to open in new tab
      if (e.ctrlKey || e.metaKey) {
        window.open(target, '_blank');
      } else {
        window.location.href = target;
      }
    });
    // make card keyboard-focusable
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = target;
      }
    });
  });

  // Ensure nav initial state for small screens (main.js also handles this)
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    if (window.innerWidth <= 640) navList.style.display = 'none';
  }

});
