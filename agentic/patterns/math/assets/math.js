/* ==========================================================================
   Agentic Math Models — shared helpers
   /agentic/patterns/math/assets/math.js
   Exposes window.MM. No dependencies; KaTeX auto-render is used if loaded.
   ========================================================================== */
(function () {
  "use strict";
  const MM = {};
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------- Formatting ---------- */
  MM.pct = (x, d = 1) => (x * 100).toFixed(d).replace(/\.0+$/, "") + "%";
  MM.pctFixed = (x, d = 1) => (x * 100).toFixed(d) + "%";
  MM.num = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d).replace(/\.0+$/, "") : "∞");
  MM.clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  /* ---------- Shared state with two-way binding ----------
     Inputs: any <input data-key="name"> (range or number). Several inputs may share a key.
     Outputs: <output data-out="name" data-fmt="pct|num|int"> mirror the raw value.
     render(state) is called after every change. */
  MM.state = function (initial, render) {
    const s = Object.assign({}, initial);
    const inputs = () => document.querySelectorAll("[data-key]");
    const sync = (from) => {
      inputs().forEach((el) => {
        if (el === from) return;
        const k = el.dataset.key;
        if (!(k in s)) return;
        const scale = parseFloat(el.dataset.scale || "1");
        el.value = +(s[k] * scale).toFixed(4);
      });
      document.querySelectorAll("[data-out]").forEach((o) => {
        const k = o.dataset.out;
        if (!(k in s)) return;
        const f = o.dataset.fmt;
        o.textContent = f === "pct" ? MM.pct(s[k], parseInt(o.dataset.dp || "1", 10))
          : f === "int" ? String(Math.round(s[k])) : MM.num(s[k], parseInt(o.dataset.dp || "2", 10));
      });
      render(s);
    };
    inputs().forEach((el) => {
      el.addEventListener("input", () => {
        const k = el.dataset.key;
        const scale = parseFloat(el.dataset.scale || "1");
        let v = parseFloat(el.value);
        if (!Number.isFinite(v)) return;
        const min = el.min !== "" ? parseFloat(el.min) : -Infinity;
        const max = el.max !== "" ? parseFloat(el.max) : Infinity;
        v = MM.clamp(v, min, max) / scale;
        s[k] = v;
        sync(el);
      });
      if (el.type === "number") el.addEventListener("change", () => sync(null));
    });
    sync(null);
    return s;
  };

  /* ---------- Line chart (SVG) ----------
     MM.lineChart(svg, {
       x: {min, max, label, ticks?: [values], fmt?: v => label}, y: {min, max, label, pct: true},
       series: [{cls: "s-fault", points: [[x, y], ...]}],
       markerX: number, targetY: number, dots: [{x, y, cls}]
     }) */
  MM.lineChart = function (svg, o) {
    const W = 640, H = 340, m = { t: 14, r: 16, b: 46, l: 52 };
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const sx = (x) => m.l + ((x - o.x.min) / (o.x.max - o.x.min)) * iw;
    const sy = (y) => m.t + ih - ((y - o.y.min) / (o.y.max - o.y.min)) * ih;
    const el = (tag, attrs, parent = svg) => {
      const n = document.createElementNS(SVG_NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      parent.appendChild(n);
      return n;
    };
    const ticks = (lo, hi, count) => {
      const step = niceStep((hi - lo) / count);
      const out = [];
      for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
      return out;
    };
    const g = el("g", { class: "axis" });
    ticks(o.y.min, o.y.max, 5).forEach((v) => {
      el("line", { class: "gridline", x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v) }, g);
      const t = el("text", { x: m.l - 8, y: sy(v) + 4, "text-anchor": "end" }, g);
      t.textContent = o.y.pct ? Math.round(v * 100) + "%" : v;
    });
    (o.x.ticks || ticks(o.x.min, o.x.max, 6)).forEach((v) => {
      const t = el("text", { x: sx(v), y: H - m.b + 18, "text-anchor": "middle" }, g);
      t.textContent = o.x.fmt ? o.x.fmt(v) : v;
    });
    el("line", { x1: m.l, x2: W - m.r, y1: sy(o.y.min), y2: sy(o.y.min) }, g);
    if (o.x.label) el("text", { class: "axis-label", x: m.l + iw / 2, y: H - 8, "text-anchor": "middle" }).textContent = o.x.label;
    if (o.y.label) el("text", { class: "axis-label", x: -(m.t + ih / 2), y: 14, transform: "rotate(-90)", "text-anchor": "middle" }).textContent = o.y.label;
    if (o.targetY != null) el("line", { class: "target", x1: m.l, x2: W - m.r, y1: sy(o.targetY), y2: sy(o.targetY) });
    if (o.markerX != null) el("line", { class: "marker", x1: sx(o.markerX), x2: sx(o.markerX), y1: m.t, y2: m.t + ih });
    o.series.forEach((s) => {
      const d = s.points.map((p, i) => (i ? "L" : "M") + sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1)).join("");
      el("path", { class: "series " + (s.cls || ""), d });
    });
    (o.dots || []).forEach((p) => el("circle", { class: p.cls, cx: sx(p.x), cy: sy(p.y), r: 4.5 }));
  };
  /* ---------- Bar chart (SVG) ----------
     MM.barChart(svg, {
       bars: [{x, y, y0, cls}],        // x: category position, y: value, y0: optional base for stacking
       x: {min, max, label, tickEvery}, y: {max, label, pct: true},
       markerX: number                 // optional dashed vertical line, e.g. a budget
     }) */
  MM.barChart = function (svg, o) {
    const W = 640, H = 320, m = { t: 14, r: 16, b: 46, l: 52 };
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const span = o.x.max - o.x.min + 1, bw = iw / span;
    const sx = (x) => m.l + (x - o.x.min) * bw;
    const sy = (y) => m.t + ih - (y / o.y.max) * ih;
    const el = (tag, attrs) => {
      const n = document.createElementNS(SVG_NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      svg.appendChild(n);
      return n;
    };
    const yStep = niceStep(o.y.max / 4);
    for (let v = 0; v <= o.y.max + 1e-9; v += yStep) {
      el("line", { class: "gridline", x1: m.l, x2: W - m.r, y1: sy(v), y2: sy(v) });
      el("text", { x: m.l - 8, y: sy(v) + 4, "text-anchor": "end" }).textContent =
        o.y.pct ? +(v * 100).toFixed(1) + "%" : +v.toFixed(2);
    }
    const every = o.x.tickEvery || 5;
    for (let x = o.x.min; x <= o.x.max; x++) {
      if (x % every === 0 || x === o.x.min)
        el("text", { x: sx(x) + bw / 2, y: H - m.b + 18, "text-anchor": "middle" }).textContent = x;
    }
    o.bars.forEach((b) => {
      const y0 = b.y0 || 0, top = sy(Math.min(o.y.max, y0 + b.y)), h = Math.max(0, sy(y0) - top);
      el("rect", { class: "bar " + (b.cls || ""), x: sx(b.x) + Math.min(1, bw * 0.1), y: top, width: Math.max(1, bw - Math.min(2, bw * 0.2)), height: h });
    });
    if (o.markerX != null) {
      const x = sx(o.markerX) + bw;
      el("line", { class: "marker", x1: x, x2: x, y1: m.t, y2: m.t + ih });
    }
    el("line", { class: "axis-base", x1: m.l, x2: W - m.r, y1: sy(0), y2: sy(0) });
    if (o.x.label) el("text", { class: "axis-label", x: m.l + iw / 2, y: H - 8, "text-anchor": "middle" }).textContent = o.x.label;
    if (o.y.label) el("text", { class: "axis-label", x: -(m.t + ih / 2), y: 14, transform: "rotate(-90)", "text-anchor": "middle" }).textContent = o.y.label;
  };

  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  }

  /* ---------- Tabs (role=tablist) ---------- */
  MM.tabs = function (root) {
    const btns = root.querySelectorAll('[role="tab"]');
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => {
        const on = x === b;
        x.setAttribute("aria-selected", on);
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      root.dispatchEvent(new CustomEvent("tabchange", { detail: b.getAttribute("aria-controls") }));
    }));
  };

  /* ---------- Copy buttons for .code blocks ---------- */
  function initCopy() {
    document.querySelectorAll(".code").forEach((wrap) => {
      const pre = wrap.querySelector("pre");
      if (!pre || wrap.querySelector(".copy")) return;
      const b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = "Copy";
      b.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(pre.innerText); b.textContent = "Copied"; }
        catch (e) { b.textContent = "Select and copy"; }
        setTimeout(() => (b.textContent = "Copy"), 1600);
      });
      wrap.appendChild(b);
    });
  }

  /* ---------- Table of contents from section h2[id] ---------- */
  function initToc() {
    const toc = document.querySelector(".toc ol");
    if (!toc) return;
    const heads = [...document.querySelectorAll(".section h2[id]")];
    heads.forEach((h) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${h.id}">${h.dataset.toc || h.textContent}</a>`;
      toc.appendChild(li);
    });
    const links = [...toc.querySelectorAll("a")];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach((h) => io.observe(h));
  }

  /* ---------- KaTeX ---------- */
  function initMath() {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }

  MM.ready = (fn) => (document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn));
  MM.ready(() => { initCopy(); initToc(); });
  window.addEventListener("load", initMath);

  window.MM = MM;
})();
