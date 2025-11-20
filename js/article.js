// article.js - small interactions for article page

document.addEventListener('DOMContentLoaded', function () {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // copy link button
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.textContent = 'Link copied';
        setTimeout(() => copyBtn.textContent = 'Copy link', 1500);
      } catch (e) {
        alert('Copy this link: ' + window.location.href);
      }
    });
  }

  // share buttons: open simple share windows
  const shareButtons = document.querySelectorAll('.share-btn[data-service]');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const svc = btn.dataset.service;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';
      if (svc === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      } else if (svc === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'noopener');
    });
  });

  // Ensure keyboard nav for feature image (accessibility)
  const featureImg = document.querySelector('.feature-image img');
  if (featureImg && !featureImg.hasAttribute('tabindex')) featureImg.setAttribute('tabindex', '0');

  // Ensure nav initial state on mobile (main.js handles general nav)
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) if (window.innerWidth <= 640) navList.style.display = 'none';
});
