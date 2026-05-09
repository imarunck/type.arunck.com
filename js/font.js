// font.js - Consolidated interactions for font pages

document.addEventListener("DOMContentLoaded", function () {
  // Common behaviors
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const testerContainer = document.getElementById("type-tester-container");
  if (testerContainer) {
    fetch("/partials/typetester.html")
      .then(res => res.text())
      .then(html => {
        testerContainer.innerHTML = html;
        initFontInteractions();
      })
      .catch(err => {
        console.error("Failed to load type tester:", err);
        initFontInteractions(); // Try anyway
      });
  } else {
    initFontInteractions();
  }

  function initFontInteractions() {
    const specimen = document.getElementById("specimen");
    const nameDisplay = document.getElementById("nameDisplay");
    const sizeSelect = document.getElementById("sizeSelect");
    const styleSelect = document.getElementById("styleSelect");

    const weightRange = document.getElementById("weightRange");
    const weightVal = document.getElementById("weightVal");
    const weightPreset = document.getElementById("weightPreset");
    const playBtn = document.getElementById("playWeight");

    if (!specimen) return;
    if (!specimen.hasAttribute("tabindex")) specimen.setAttribute("tabindex", "0");

    // Load default text from markdown
    fetch("/partials/typetester.md")
      .then(res => res.text())
      .then(md => {
        const html = md.replace(/\n/g, '<br>');
        specimen.innerHTML = html;
      })
      .catch(err => {
        console.error("Failed to load type tester text:", err);
      });

    // Retrieve saved text from localStorage
    const savedText = localStorage.getItem("typeTesterText");
    if (savedText) {
      specimen.innerHTML = savedText;
    }

    // Save text on input
    specimen.addEventListener("input", function () {
      localStorage.setItem("typeTesterText", specimen.innerHTML);
    });

    // Determine if it's a variable font based on body data attribute or presence of weight range
    const isVariable = document.body?.dataset?.variable === "true" || !!weightRange;

    // 1. Size Selector
    if (sizeSelect) {
      sizeSelect.addEventListener("change", function () {
        specimen.style.fontSize = this.value + "px";
      });
      // initialize
      specimen.style.fontSize = sizeSelect.value + "px";
    }

    // 2. Style Selector (e.g. Sriraju)
    if (styleSelect) {
      styleSelect.addEventListener("change", function () {
        specimen.style.fontFamily = `"${this.value}"`;
      });
      // initialize
      specimen.style.fontFamily = `"${styleSelect.value}"`;
    }

    // 3. Variable Font Logic (e.g. Anchu, Karnata-GTN)
    if (isVariable) {
      if (playBtn) playBtn.style.display = "";

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

      if (weightRange) {
        weightRange.addEventListener("input", () => {
          applyWeight(weightRange.value);
          if (weightPreset) {
            weightPreset.value = String(Math.round(Number(weightRange.value) / 100) * 100);
          }
        });
        // initialize
        applyWeight(weightRange.value);
      }

      if (weightPreset) {
        weightPreset.addEventListener("change", () => {
          applyWeight(weightPreset.value);
        });
      }

      // 4. Play Button Animation (apply to variable fonts only)
      if (playBtn && weightRange) {
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
          if (weightPreset) {
            weightPreset.value = String(Math.round(currentWeight / 100) * 100);
          }
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
    } else {
      // Hide play button if not a variable font
      if (playBtn) playBtn.style.display = "none";
    }

    // 5. Download Button Hook (Optional)
    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        // Optional: Add analytics or confirmation dialog
      });
    }
  }
});
