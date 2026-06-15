// Replace placeholders below with direct ZIP/download links for each font.
window.fontLinks = {
  gtn: "https://github.com/sanchaya/karnata-gtn-typeface/releases/download/1-5-00-GTN/KarnataGTN.1-5-00.zip",
  wesleyan: "https://github.com/sanchaya/karnata-wesleyan-mission-press-typeface/releases/download/Version_2.5/KarnataWesleyanMissionPress-Version.2.5.zip",
  german: "https://github.com/sanchaya/karnata-german-mission-press-typeface/releases/download/Release_1.5/karnata-german-mission-press-typeface-1.5.zip",
  bandipur: "https://github.com/sanchaya/karnata-bandipur/releases/download/3.0/KarnataBandipur3.0.zip",
  anchu: "https://github.com/imarunck/Anchu/releases/download/Releases/Anchu-Kannada-Regular.zip",
  sriraju: "https://github.com/imarunck/Sri-Raju-Fonts/releases/download/Release/Sri-Raju-fonts-1.0.zip"
};

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("[data-download-id]");
  buttons.forEach(button => {
    const id = button.dataset.downloadId;
    if (!id) return;
    const href = window.fontLinks?.[id] || "#";
    button.href = href;
    if (href && href !== "#") {
      button.target = "_blank";
      button.rel = "noopener";
    } else {
      button.removeAttribute("target");
      button.removeAttribute("rel");
    }
  });
});
