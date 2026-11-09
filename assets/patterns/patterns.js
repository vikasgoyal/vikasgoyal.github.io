/* Agentic Pattern Library: catalog filters and the copy button on the template page. */
(function () {
  var hub = document.querySelector("[data-hub]");
  if (hub) {
    var KEY = "apl-filters";
    var state = { track: "all", family: "all", mat: "all", axis: "all", q: "" };
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) { state.track = saved.track || "all"; state.family = saved.family || "all"; state.mat = saved.mat || "all"; state.axis = saved.axis || "all"; }
    } catch (e) {}

    var chips = hub.querySelectorAll(".chip");
    var entries = document.querySelectorAll(".entry");
    var sections = document.querySelectorAll("[data-family-section], [data-track-section]");
    var q = document.getElementById("q");
    var count = document.getElementById("count");
    var empty = document.getElementById("empty");

    function apply() {
      // Family chips only show for the selected track
      chips.forEach(function (c) {
        if (c.dataset.k === "family" && c.dataset.track) {
          c.hidden = state.track !== "all" && c.dataset.track !== state.track;
          if (c.hidden && state.family === c.dataset.v) state.family = "all";
        }
      });
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(state[c.dataset.k] === c.dataset.v)); });
      var term = state.q.trim().toLowerCase(), shown = 0;
      entries.forEach(function (e) {
        var ok = (state.track === "all" || e.dataset.track === state.track) &&
                 (state.family === "all" || e.dataset.family === state.family) &&
                 (state.mat === "all" || e.dataset.mat === state.mat) &&
                 (state.axis === "all" || (" " + e.dataset.axes + " ").indexOf(" " + state.axis + " ") > -1) &&
                 (!term || e.dataset.text.indexOf(term) > -1);
        e.hidden = !ok; if (ok) shown++;
      });
      sections.forEach(function (s) { s.hidden = !s.querySelector(".entry:not([hidden])"); });
      count.textContent = shown + " of " + entries.length;
      empty.hidden = shown > 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        state[c.dataset.k] = c.dataset.v;
        try { localStorage.setItem(KEY, JSON.stringify({ track: state.track, family: state.family, mat: state.mat, axis: state.axis })); } catch (e) {}
        apply();
      });
    });
    q.addEventListener("input", function () { state.q = q.value; apply(); });
    apply();
  }

  var copy = document.getElementById("copy");
  if (copy) {
    copy.addEventListener("click", function () {
      var pre = document.getElementById("skeleton"), toast = document.getElementById("toast");
      function done(msg) { toast.textContent = msg; toast.hidden = false; setTimeout(function () { toast.hidden = true; }, 1800); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(pre);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        done("Selected, press Ctrl+C");
      }
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(function () { done("Copied"); }, fallback);
      else fallback();
    });
  }
})();
