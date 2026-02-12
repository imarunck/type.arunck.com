document.addEventListener("DOMContentLoaded", function () {

  const specimen = document.getElementById("specimen");
  const styleSelect = document.getElementById("styleSelect");
  const sizeSelect = document.getElementById("sizeSelect");

  if (!specimen) return;

  // change font style
  if (styleSelect) {
    styleSelect.addEventListener("change", function () {
      specimen.style.fontFamily = `"${this.value}"`;
    });

    // initialize
    specimen.style.fontFamily = `"${styleSelect.value}"`;
  }

  // change size
  if (sizeSelect) {
    sizeSelect.addEventListener("change", function () {
      specimen.style.fontSize = this.value + "px";
    });

    specimen.style.fontSize = sizeSelect.value + "px";
  }

});
