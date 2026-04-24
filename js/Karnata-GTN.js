// Karnata-GTN.js - interactions for Karnata-GTN (variable) font page

document.addEventListener("DOMContentLoaded", function () {
  const specimen = document.getElementById("specimen");
  const nameDisplay = document.getElementById("nameDisplay");
  const sizeSelect = document.getElementById("sizeSelect");
  const weightRange = document.getElementById("weightRange");
  const weightVal = document.getElementById("weightVal");
  const weightPreset = document.getElementById("weightPreset");
  const playBtn = document.getElementById("playWeight");

  // Only show Play button for variable fonts/pages
  const isVariable = document.body?.dataset?.variable === "true";
  if (playBtn) playBtn.style.display = isVariable ? "" : "none";

  if (!specimen) return;
  if (!specimen.hasAttribute("tabindex")) specimen.setAttribute("tabindex", "0");

  function applyWeight(w) {
    if (weightRange) weightRange.value = String(w);
    if (weightVal) weightVal.textContent = String(w);

    specimen.style.fontVariationSettings = `"wght" ${w}`;
    specimen.style.fontWeight = Math.round(Number(w) / 100) * 100; // fallback

    if (nameDisplay) {
      nameDisplay.style.fontVariationSettings = `"wght" ${w}`;
      nameDisplay.style.fontWeight = Math.round(Number(w) / 100) * 100;
    }
  }

  // Variable controls wiring (only if present)
  if (isVariable && weightRange && weightPreset) {
    weightRange.addEventListener("input", () => {
      applyWeight(weightRange.value);
      weightPreset.value = String(Math.round(Number(weightRange.value) / 100) * 100);
    });

    weightPreset.addEventListener("change", () => {
      applyWeight(weightPreset.value);
    });

    applyWeight(weightRange.value);
  }

  // Size selector
  if (sizeSelect) {
    sizeSelect.addEventListener("change", function () {
      specimen.style.fontSize = this.value + "px";
    });
    specimen.style.fontSize = sizeSelect.value + "px";
  }

  // Weight animation (only if variable)
  if (isVariable && playBtn && weightRange && weightPreset) {
    let playing = false;
    let animFrame = null;
    let direction = 1;
    let currentWeight = Number(weightRange.value || 400);

    function animateWeight() {
      if (!playing) return;

      currentWeight += direction * 3;
      if (currentWeight >= 900) { currentWeight = 900; direction = -1; }
      else if (currentWeight <= 400) { currentWeight = 400; direction = 1; }

      applyWeight(currentWeight);
      weightPreset.value = String(Math.round(currentWeight / 100) * 100);
      animFrame = requestAnimationFrame(animateWeight);
    }

    playBtn.addEventListener("click", () => {
      playing = !playing;
      if (playing) {
        playBtn.textContent = "⏸ Pause";
        playBtn.classList.add("playing");
        currentWeight = Number(weightRange.value || 400);
        animateWeight();
      } else {
        playBtn.textContent = "▶ Play";
        playBtn.classList.remove("playing");
        if (animFrame) cancelAnimationFrame(animFrame);
      }
    });
  }
});
