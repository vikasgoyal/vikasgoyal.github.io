/*
 * annotate.js: presenter tools for vikasgoyal.github.io articles.
 *
 * Turn on:  add ?present to the URL, or press Shift+P on the page.
 * Tools:    H highlight · D draw · L laser · F focus (arrow keys step sections)
 *           U undo · C clear ink · 1/2/3 colour · Esc tool off · Shift+P exit
 *
 * Highlights are saved in this browser only (localStorage, per page) and only
 * appear in presenter mode, so prepared highlights are there when you present
 * and visitors never see them. Pen ink is for the moment and isn't saved.
 *
 * Optional page hooks:
 *   data-annotate-root on the element holding the article (default: article/main)
 *   data-annotate-sections="css selector" on that element for focus-mode stops
 */
(function () {
  'use strict';

  var STORE_KEY = 'annotate:v1:' + location.pathname;
  var COLORS = {
    yellow: { hl: 'rgba(255, 214, 0, 0.55)', ink: '#d97706', swatch: '#facc15' },
    green:  { hl: 'rgba(52, 211, 153, 0.45)', ink: '#047857', swatch: '#34d399' },
    pink:   { hl: 'rgba(244, 114, 182, 0.45)', ink: '#db2777', swatch: '#f472b6' }
  };
  var COLOR_ORDER = ['yellow', 'green', 'pink'];

  var active = false;
  var tool = null;
  var color = 'yellow';
  var root, ui, canvas, ctx, laser, toast;
  var strokes = [];
  var current = null;
  var history = [];
  var focusIdx = -1;
  var toastTimer;

  // ---------- setup ----------

  function findRoot() {
    return document.querySelector('[data-annotate-root]') ||
      document.querySelector('article') ||
      document.querySelector('main') ||
      document.body;
  }

  function injectStyles() {
    if (document.getElementById('anno-styles')) return;
    var css = [
      '.anno-ui{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:4px;padding:6px;border-radius:999px;background:rgba(17,24,39,.94);box-shadow:0 12px 32px rgba(0,0,0,.28);font:600 13px/1 system-ui,-apple-system,Segoe UI,sans-serif;user-select:none;-webkit-user-select:none}',
      '.anno-ui button{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;min-width:34px;padding:0 11px;border-radius:999px;color:#e5e7eb;cursor:pointer;white-space:nowrap}',
      '.anno-ui button:hover{background:rgba(255,255,255,.12)}',
      '.anno-ui button:focus-visible{outline:2px solid #60a5fa;outline-offset:1px}',
      '.anno-ui button[aria-pressed="true"]{background:#f9fafb;color:#111827}',
      '.anno-ui .anno-sep{width:1px;height:20px;margin:0 4px;background:rgba(255,255,255,.2)}',
      '.anno-ui .anno-swatch{padding:0;min-width:26px;width:26px;height:26px}',
      '.anno-ui .anno-swatch span{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.25)}',
      '.anno-ui .anno-swatch[aria-pressed="true"]{background:transparent}',
      '.anno-ui .anno-swatch[aria-pressed="true"] span{box-shadow:0 0 0 2px #111827,0 0 0 4px #f9fafb}',
      '.anno-ui kbd{font:inherit;font-size:11px;opacity:.55}',
      '.anno-canvas{position:absolute;left:0;top:0;z-index:2147482000;pointer-events:none;touch-action:auto}',
      'body.anno-tool-pen .anno-canvas{pointer-events:auto;touch-action:none;cursor:crosshair}',
      'body.anno-tool-highlight [data-anno-root]{cursor:text}',
      'body.anno-tool-laser,body.anno-tool-laser *{cursor:none!important}',
      '.anno-laser{position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(239,68,68,.9);box-shadow:0 0 0 6px rgba(239,68,68,.25),0 0 18px 6px rgba(239,68,68,.45);pointer-events:none;z-index:2147483001;display:none}',
      'body.anno-tool-laser .anno-laser{display:block}',
      'mark.anno-hl{color:inherit;border-radius:3px;padding:0 1px;box-decoration-break:clone;-webkit-box-decoration-break:clone}',
      'mark.anno-hl[data-c="yellow"]{background:' + COLORS.yellow.hl + '}',
      'mark.anno-hl[data-c="green"]{background:' + COLORS.green.hl + '}',
      'mark.anno-hl[data-c="pink"]{background:' + COLORS.pink.hl + '}',
      'body.anno-tool-highlight mark.anno-hl{cursor:pointer}',
      'body.anno-focus .anno-stop{transition:opacity .25s ease,filter .25s ease;opacity:.18;filter:grayscale(.6)}',
      'body.anno-focus .anno-stop.anno-current{opacity:1;filter:none}',
      'body.anno-focus .anno-stop{scroll-margin-top:16px}',
      '.anno-toast{position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:2147483000;padding:8px 14px;border-radius:10px;background:rgba(17,24,39,.94);color:#f9fafb;font:500 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;pointer-events:none;opacity:0;transition:opacity .2s}',
      '.anno-toast.anno-show{opacity:1}',
      '@media print{.anno-ui,.anno-canvas,.anno-laser,.anno-toast{display:none!important}}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'anno-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function button(label, title, onClick, opts) {
    var b = document.createElement('button');
    b.type = 'button';
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = label;
    b.addEventListener('click', function (e) { e.stopPropagation(); onClick(); });
    if (opts && opts.toggle) b.setAttribute('aria-pressed', 'false');
    if (opts && opts.data) b.dataset[opts.data[0]] = opts.data[1];
    return b;
  }

  function sep() {
    var s = document.createElement('span');
    s.className = 'anno-sep';
    return s;
  }

  function buildUI() {
    ui = document.createElement('div');
    ui.className = 'anno-ui';
    ui.setAttribute('role', 'toolbar');
    ui.setAttribute('aria-label', 'Presenter tools');

    ui.appendChild(button('Highlight <kbd>H</kbd>', 'Highlight text (H). Click a highlight to remove it.', function () { setTool('highlight'); }, { toggle: true, data: ['tool', 'highlight'] }));
    ui.appendChild(button('Draw <kbd>D</kbd>', 'Draw on the page (D)', function () { setTool('pen'); }, { toggle: true, data: ['tool', 'pen'] }));
    ui.appendChild(button('Laser <kbd>L</kbd>', 'Laser pointer (L)', function () { setTool('laser'); }, { toggle: true, data: ['tool', 'laser'] }));
    ui.appendChild(button('Focus <kbd>F</kbd>', 'Focus one section at a time (F). Arrow keys move between sections.', toggleFocus, { toggle: true, data: ['tool', 'focus'] }));
    ui.appendChild(sep());
    COLOR_ORDER.forEach(function (c, i) {
      var b = button('<span style="background:' + COLORS[c].swatch + '"></span>', c.charAt(0).toUpperCase() + c.slice(1) + ' (' + (i + 1) + ')', function () { setColor(c); }, { toggle: true, data: ['color', c] });
      b.classList.add('anno-swatch');
      ui.appendChild(b);
    });
    ui.appendChild(sep());
    ui.appendChild(button('Undo <kbd>U</kbd>', 'Undo last highlight or stroke (U)', undo));
    ui.appendChild(button('Clear ink <kbd>C</kbd>', 'Clear all drawing (C)', clearInk));
    ui.appendChild(button('Clear highlights', 'Remove all saved highlights on this page', clearHighlights));
    ui.appendChild(sep());
    ui.appendChild(button('Exit', 'Leave presenter mode (Shift+P)', disable));

    document.body.appendChild(ui);
  }

  function refreshUI() {
    if (!ui) return;
    ui.querySelectorAll('[data-tool]').forEach(function (b) {
      var t = b.dataset.tool;
      var on = t === 'focus' ? document.body.classList.contains('anno-focus') : t === tool;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    ui.querySelectorAll('[data-color]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.color === color ? 'true' : 'false');
    });
  }

  function showToast(text) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'anno-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('anno-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('anno-show'); }, 2600);
  }

  // ---------- tools ----------

  function setTool(next) {
    tool = tool === next ? null : next;
    ['highlight', 'pen', 'laser'].forEach(function (t) {
      document.body.classList.toggle('anno-tool-' + t, tool === t);
    });
    if (tool !== 'highlight') {
      var sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    }
    refreshUI();
  }

  function setColor(c) {
    color = c;
    refreshUI();
  }

  // ---------- highlights ----------

  function skipNode(n) {
    var p = n.parentNode;
    if (!p || !p.closest) return true;
    return !!p.closest('svg, script, style, textarea, .anno-ui, .anno-toast');
  }

  function rootTextNodes() {
    var out = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return skipNode(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  function wrapRange(range, c, id) {
    var nodes = rootTextNodes().filter(function (n) {
      return range.intersectsNode(n) && n.nodeValue.trim() !== '';
    });
    var made = 0;
    nodes.forEach(function (n) {
      var s = 0;
      var e = n.nodeValue.length;
      if (n === range.startContainer) s = range.startOffset;
      if (n === range.endContainer) e = range.endOffset;
      if (s >= e) return;
      if (e < n.nodeValue.length) n.splitText(e);
      if (s > 0) n = n.splitText(s);
      var m = document.createElement('mark');
      m.className = 'anno-hl';
      m.dataset.c = c;
      m.dataset.id = id;
      n.parentNode.insertBefore(m, n);
      m.appendChild(n);
      made++;
    });
    return made;
  }

  function unwrap(id) {
    var marks = root.querySelectorAll('mark.anno-hl' + (id ? '[data-id="' + id + '"]' : ''));
    var parents = [];
    marks.forEach(function (m) {
      var p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
      if (parents.indexOf(p) < 0) parents.push(p);
    });
    parents.forEach(function (p) { p.normalize(); });
  }

  function offsetOf(node, offset, nodes) {
    var total = 0;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) return total + offset;
      total += nodes[i].nodeValue.length;
    }
    return -1;
  }

  function positionAt(charOffset, nodes, preferNext) {
    var total = 0;
    for (var i = 0; i < nodes.length; i++) {
      var len = nodes[i].nodeValue.length;
      if (charOffset < total + len || (!preferNext && charOffset === total + len)) {
        return { node: nodes[i], offset: charOffset - total };
      }
      total += len;
    }
    return null;
  }

  function saveHighlights() {
    var nodes = rootTextNodes();
    var groups = {};
    root.querySelectorAll('mark.anno-hl').forEach(function (m) {
      var id = m.dataset.id;
      var text = m.firstChild;
      if (!text || text.nodeType !== 3) return;
      var start = offsetOf(text, 0, nodes);
      var end = start + text.nodeValue.length;
      if (start < 0) return;
      if (!groups[id]) groups[id] = { id: id, c: m.dataset.c, start: start, end: end };
      groups[id].start = Math.min(groups[id].start, start);
      groups[id].end = Math.max(groups[id].end, end);
    });
    var list = Object.keys(groups).map(function (k) { return groups[k]; });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }

  function restoreHighlights() {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]') || []; } catch (e) { list = []; }
    list.forEach(function (h) {
      var nodes = rootTextNodes();
      var a = positionAt(h.start, nodes, true);
      var b = positionAt(h.end, nodes, false);
      if (!a || !b) return;
      var r = document.createRange();
      try {
        r.setStart(a.node, a.offset);
        r.setEnd(b.node, b.offset);
        wrapRange(r, h.c, h.id);
      } catch (e) { /* page changed since this highlight was saved */ }
    });
  }

  function onMouseUp(e) {
    if (!active || tool !== 'highlight') return;
    if (ui && ui.contains(e.target)) return;
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    var range = sel.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;
    var id = 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (wrapRange(range, color, id)) {
      history.push({ type: 'hl', id: id });
      saveHighlights();
    }
    sel.removeAllRanges();
  }

  function onClick(e) {
    if (!active) return;
    var mark = e.target.closest && e.target.closest('mark.anno-hl');
    if (mark && tool === 'highlight') {
      var sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      unwrap(mark.dataset.id);
      saveHighlights();
      return;
    }
    if (document.body.classList.contains('anno-focus') && !(ui && ui.contains(e.target))) {
      var stop = e.target.closest && e.target.closest('.anno-stop');
      if (stop) focusOn(stops().indexOf(stop), false);
    }
  }

  function clearHighlights() {
    if (!root.querySelector('mark.anno-hl')) { showToast('No highlights on this page'); return; }
    if (!window.confirm('Remove all saved highlights on this page?')) return;
    unwrap(null);
    history = history.filter(function (h) { return h.type !== 'hl'; });
    saveHighlights();
  }

  // ---------- pen ----------

  function sizeCanvas() {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    var w = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function drawStroke(s) {
    if (s.points.length < 1) return;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(s.points[0][0], s.points[0][1]);
    for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i][0], s.points[i][1]);
    if (s.points.length === 1) ctx.lineTo(s.points[0][0] + 0.1, s.points[0][1]);
    ctx.stroke();
  }

  function redraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(drawStroke);
  }

  function pagePoint(e) {
    return [e.pageX, e.pageY];
  }

  function onPenDown(e) {
    if (tool !== 'pen') return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    current = { color: COLORS[color].ink, points: [pagePoint(e)] };
    strokes.push(current);
    drawStroke(current);
  }

  function onPenMove(e) {
    if (!current) return;
    current.points.push(pagePoint(e));
    var p = current.points;
    ctx.strokeStyle = current.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p[p.length - 2][0], p[p.length - 2][1]);
    ctx.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
    ctx.stroke();
  }

  function onPenUp() {
    if (!current) return;
    history.push({ type: 'stroke' });
    current = null;
  }

  function clearInk() {
    strokes = [];
    history = history.filter(function (h) { return h.type !== 'stroke'; });
    redraw();
  }

  // ---------- laser ----------

  function onPointerMove(e) {
    if (tool === 'laser' && laser) {
      laser.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }
  }

  // ---------- focus ----------

  function stops() {
    var sel = root.getAttribute('data-annotate-sections');
    var list = sel ? Array.prototype.slice.call(root.querySelectorAll(sel)) :
      Array.prototype.slice.call(root.children).filter(function (el) { return /^(SECTION|HEADER)$/.test(el.tagName); });
    if (!list.length) list = Array.prototype.slice.call(root.querySelectorAll('section'));
    return list;
  }

  function toggleFocus() {
    var on = !document.body.classList.contains('anno-focus');
    var list = stops();
    if (on && !list.length) { showToast('No sections found to focus'); return; }
    document.body.classList.toggle('anno-focus', on);
    if (on) {
      list.forEach(function (el) { el.classList.add('anno-stop'); });
      var mid = window.innerHeight * 0.35;
      var idx = 0;
      list.forEach(function (el, i) { if (el.getBoundingClientRect().top <= mid) idx = i; });
      focusOn(idx, false);
    } else {
      document.querySelectorAll('.anno-stop').forEach(function (el) { el.classList.remove('anno-stop', 'anno-current'); });
      focusIdx = -1;
    }
    refreshUI();
  }

  function focusOn(i, scroll) {
    var list = stops();
    if (i < 0 || i >= list.length) return;
    focusIdx = i;
    list.forEach(function (el, j) { el.classList.toggle('anno-current', j === i); });
    if (scroll) list[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- undo ----------

  function undo() {
    var last = history.pop();
    if (!last) { showToast('Nothing to undo'); return; }
    if (last.type === 'stroke') {
      strokes.pop();
      redraw();
    } else if (last.type === 'hl') {
      unwrap(last.id);
      saveHighlights();
    }
  }

  // ---------- keyboard ----------

  function typing(e) {
    var t = e.target;
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }

  function onKey(e) {
    if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      active ? disable() : enable();
      return;
    }
    if (!active || e.shiftKey) return;
    var k = e.key.toLowerCase();
    var focusing = document.body.classList.contains('anno-focus');
    if (k === 'h') setTool('highlight');
    else if (k === 'd') setTool('pen');
    else if (k === 'l') setTool('laser');
    else if (k === 'f') toggleFocus();
    else if (k === 'u') undo();
    else if (k === 'c') clearInk();
    else if (k === '1' || k === '2' || k === '3') setColor(COLOR_ORDER[Number(k) - 1]);
    else if (k === 'escape') { if (tool) setTool(tool); else if (focusing) toggleFocus(); }
    else if (focusing && (k === 'arrowdown' || k === 'arrowright' || k === 'pagedown' || k === ' ')) { e.preventDefault(); focusOn(Math.min(focusIdx + 1, stops().length - 1), true); }
    else if (focusing && (k === 'arrowup' || k === 'arrowleft' || k === 'pageup')) { e.preventDefault(); focusOn(Math.max(focusIdx - 1, 0), true); }
    else return;
  }

  // ---------- lifecycle ----------

  function enable() {
    if (active) return;
    active = true;
    root = findRoot();
    root.setAttribute('data-anno-root', '');
    injectStyles();
    buildUI();

    canvas = document.createElement('canvas');
    canvas.className = 'anno-canvas';
    document.body.appendChild(canvas);
    canvas.addEventListener('pointerdown', onPenDown);
    canvas.addEventListener('pointermove', onPenMove);
    canvas.addEventListener('pointerup', onPenUp);
    canvas.addEventListener('pointercancel', onPenUp);
    sizeCanvas();

    laser = document.createElement('div');
    laser.className = 'anno-laser';
    document.body.appendChild(laser);

    restoreHighlights();
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', onClick);
    document.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', sizeCanvas);
    refreshUI();
    showToast('Presenter mode · H highlight · D draw · L laser · F focus · Shift+P to exit');
  }

  function disable() {
    if (!active) return;
    active = false;
    setTool(null);
    tool = null;
    if (document.body.classList.contains('anno-focus')) toggleFocus();
    unwrap(null);
    strokes = [];
    history = [];
    [ui, canvas, laser, toast].forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
    ui = canvas = laser = toast = ctx = null;
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('click', onClick);
    document.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', sizeCanvas);
    ['highlight', 'pen', 'laser'].forEach(function (t) { document.body.classList.remove('anno-tool-' + t); });
    if (root) root.removeAttribute('data-anno-root');
  }

  document.addEventListener('keydown', onKey);

  function autoStart() {
    if (new URLSearchParams(location.search).has('present')) {
      // Let pages that render their article after load (e.g. from markdown) finish first.
      setTimeout(enable, 300);
    }
  }

  if (document.readyState === 'complete') autoStart();
  else window.addEventListener('load', autoStart);

  window.Annotate = { enable: enable, disable: disable };
})();
