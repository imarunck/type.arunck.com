// about.js - small UI for /about page

document.addEventListener('DOMContentLoaded', function () {
  // Set copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav state (main.js handles broader nav, but ensure correct initial state)
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    if (window.innerWidth <= 640) navList.style.display = 'none';
  }

  // Copy email to clipboard
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');
  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', async function () {
      const email = emailLink.getAttribute('href').replace('mailto:', '') || emailLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.textContent = 'Copied';
        setTimeout(() => copyEmailBtn.textContent = 'Copy', 1500);
      } catch (err) {
        // fallback: select & prompt
        alert('Copy email: ' + email);
      }
    });
  }
});
