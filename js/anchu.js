// anchu.js - interactions for anchu font page

document.addEventListener('DOMContentLoaded', function () {
  // Common behaviors from main.js are also loaded; set year if not already
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Weight slider controlling variable axis (wght) with fallback
  const weightRange = document.getElementById('weightRange');
  const weightVal = document.getElementById('weightVal');
  const specimen = document.getElementById('specimen');
  const nameDisplay = document.getElementById('nameDisplay');
  const sizeSelect = document.getElementById('sizeSelect');

  function setWeight(w) {
    if (specimen) {
      // Apply variable font axis (modern browsers)
      specimen.style.fontVariationSettings = `"wght" ${w}`;
    }
    if (nameDisplay) nameDisplay.style.fontVariationSettings = `"wght" ${w}`;
    if (weightVal) weightVal.textContent = w;
    // fallback: also set fontWeight (rounded)
    const fallback = Math.round(w / 100) * 100;
    if (specimen) specimen.style.fontWeight = fallback;
    if (nameDisplay) nameDisplay.style.fontWeight = fallback;
  }

  if (weightRange) {
    setWeight(weightRange.value);
    weightRange.addEventListener('input', function () {
      setWeight(this.value);
    });
  }

  // Size selector
  if (sizeSelect && specimen) {
    sizeSelect.addEventListener('change', function () {
      specimen.style.fontSize = this.value + 'px';
    });
    // initialize
    specimen.style.fontSize = sizeSelect.value + 'px';
  }

  // Make sure specimen's pasted text preserves newlines – nothing special needed, contentEditable handles it.

  // Accessibility: ensure specimen is focusable
  if (specimen && !specimen.hasAttribute('tabindex')) specimen.setAttribute('tabindex', '0');

  // If user wants to copy a direct CSS snippet easily – small helper (not shown visually)
  // Example: clicking downloadBtn could record intended CSS in clipboard (optional)
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      // No-op here; link will navigate to download. You may implement analytics or confirm dialog if needed.
      // Example: ensure external downloads open in new tab if you later add target="_blank"
    });
  }
});
