// Karnata-GTN.js - interactions for Karnata-GTN font page

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


const weightRange = document.getElementById("weightRange");
const weightVal = document.getElementById("weightVal");
const weightPreset = document.getElementById("weightPreset");
const specimen = document.getElementById("specimen");

function applyWeight(w) {
  weightRange.value = w;
  weightVal.textContent = w;

  if (specimen) {
    specimen.style.fontVariationSettings = `"wght" ${w}`;
    specimen.style.fontWeight = Math.round(w / 100) * 100; // fallback
  }
}

/* slider → specimen */
weightRange.addEventListener("input", () => {
  applyWeight(weightRange.value);
  weightPreset.value = Math.round(weightRange.value / 100) * 100;
});

/* preset → slider → specimen */
weightPreset.addEventListener("change", () => {
  applyWeight(weightPreset.value);
});

/* initialize */
applyWeight(weightRange.value);




// Animation for weight axis

const playBtn = document.getElementById("playWeight");

let playing = false;
let animFrame = null;
let direction = 1; // 1 = up, -1 = down
let currentWeight = Number(weightRange.value);

function animateWeight() {
  if (!playing) return;

  currentWeight += direction * 3; // change speed here

  if (currentWeight >= 900) {
    currentWeight = 900;
    direction = -1;
  } else if (currentWeight <= 400) {
    currentWeight = 400;
    direction = 1;
  }

  applyWeight(currentWeight);

  // keep preset selector in sync (rounded)
  weightPreset.value = Math.round(currentWeight / 100) * 100;

  animFrame = requestAnimationFrame(animateWeight);
}

playBtn.addEventListener("click", () => {
  playing = !playing;

  if (playing) {
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("playing");
    currentWeight = Number(weightRange.value);
    animateWeight();
  } else {
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("playing");
    cancelAnimationFrame(animFrame);
  }
});
