// Load partials
function loadPartial(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });

    refreshAds();
}

function refreshAds() {
  (adsbygoogle = window.adsbygoogle || []).push({});
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "partials/header.html");
  loadPartial("sidebar", "partials/sidebar.html");
  loadPartial("ads", "partials/ads.html");
  loadPartial("footer", "partials/footer.html");
});

const chapters = ['index.html', 'chapter1.html', 'chapter2.html'];

function goPrev() {
  const current = window.location.pathname.split("/").pop();
  const index = chapters.indexOf(current);
  if (index > 0) window.location.href = chapters[index - 1];
}

function goNext() {
  const current = window.location.pathname.split("/").pop();
  const index = chapters.indexOf(current);
  if (index < chapters.length - 1) window.location.href = chapters[index + 1];
}
