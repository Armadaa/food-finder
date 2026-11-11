/* Food-Map Prototyp – Schritt 1 (Beispieldaten)
 *
 * WICHTIG FÜR DIE ECHTE VERSION:
 * Hier wird Leaflet + OpenStreetMap nur für diese Demo benutzt (kostenlos, kein Konto).
 * Die echte Version wechselt auf die Google-Maps-JavaScript-API, denn die Nutzungsbedingungen
 * von Google verlangen, dass Places-Daten auf einer Google-Karte angezeigt werden.
 * Außerdem: Daten von Google nicht dauerhaft speichern, Hinweis "Daten von Google" anzeigen.
 */
(function () {
  "use strict";

  var PLACES = window.PLACES;
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var TAGE_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  var KATS = [
    { id: "alle", name: "Alle", e: "🍴", col: "#ff7a45" },
    { id: "asiatisch", name: "Asiatisch", e: "🍜", col: "#ffb199" },
    { id: "burger", name: "Burger", e: "🍔", col: "#ffcf8a" },
    { id: "doener", name: "Döner", e: "🥙", col: "#d9e8a6" },
    { id: "pizza", name: "Pizza", e: "🍕", col: "#ffb3b3" },
    { id: "italienisch", name: "Italienisch", e: "🍝", col: "#ffdca0" },
    { id: "cafe", name: "Café/Bäckerei", e: "☕", col: "#e6cdb8" }
  ];
  var KAT = {}; KATS.forEach(function (k) { KAT[k.id] = k; });
  var TYPE_ICON = { "Restaurant": "🍽️", "Imbiss": "🥡", "Nur To-go": "🛍️" };
  var TYPES = ["Restaurant", "Imbiss", "Nur To-go"];
  var PRICE = ["€", "€€", "€€€"];

  /* ---------- Zeit (immer Europe/Berlin) ---------- */
  function berlinNow() {
    var q = new URLSearchParams(location.search).get("zeit"); // Test: ?zeit=6-23:00 (Tag 0=So..6=Sa)
    if (q) { var m = q.match(/^(\d)-(\d{1,2}):(\d{2})$/); if (m) return { day: +m[1], min: +m[2] * 60 + +m[3] }; }
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    return { day: day, min: +o.hour * 60 + +o.minute };
  }
  function toMin(s) { var a = s.split(":"); return +a[0] * 60 + +a[1]; }
  function fmt(min) { min = min % 1440; return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"); }
  function interval(p, day) { // [von, bis] in Minuten, bis kann > 1440 sein (nach Mitternacht)
    var h = p.h[day]; if (!h) return null;
    var a = toMin(h[0]), b = toMin(h[1]); if (b <= a) b += 1440; return [a, b];
  }
  function status(p) {
    var now = berlinNow(), cur = interval(p, now.day), prev = interval(p, (now.day + 6) % 7);
    if (prev && prev[1] > 1440 && now.min < prev[1] - 1440) { var r = prev[1] - 1440 - now.min; return mk(true, r, "bis " + fmt(prev[1])); }
    if (cur && now.min >= cur[0] && now.min < cur[1]) return mk(true, cur[1] - now.min, "bis " + fmt(cur[1]));
    if (cur && now.min < cur[0]) return { open: false, soon: false, text: "Geschlossen · öffnet um " + fmt(cur[0]) };
    for (var i = 1; i <= 7; i++) { // nächster Öffnungstag
      var d = (now.day + i) % 7, iv = interval(p, d);
      if (iv) return { open: false, soon: false, text: "Geschlossen · öffnet " + (i === 1 ? "morgen" : TAGE_KURZ[d]) + " um " + fmt(iv[0]) };
    }
    return { open: false, soon: false, text: "Geschlossen" };
    function mk(open, rest, bis) { var soon = rest <= 60; return { open: open, soon: soon, text: (soon ? "Schließt bald · " : "Geöffnet · ") + bis }; }
  }

  /* ---------- Platzhalterbilder (lokal erzeugt, kein Hotlinking) ---------- */
  function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  function photo(p, tab) {
    var k = KAT[p.k], s = p.id, hue = Math.floor(rnd(s) * 40) - 20, svg = "", W = 600, H = 420;
    var a = k.col, b = "#fff8f0";
    if (tab === "Essen") {
      svg = '<rect width="600" height="420" fill="#d9b48a"/><g opacity=".25">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<rect y="' + (i * 62) + '" width="600" height="3" fill="#7a4e24"/>'; }).join("") + '</g>' +
        '<circle cx="300" cy="215" r="165" fill="#fff" stroke="#e8e0d8" stroke-width="8"/><circle cx="300" cy="215" r="125" fill="' + a + '"/>' +
        '<text x="300" y="262" font-size="150" text-anchor="middle">' + k.e + '</text>' +
        '<circle cx="90" cy="90" r="40" fill="#fff" opacity=".6"/><text x="90" y="105" font-size="44" text-anchor="middle">' + ["🥗", "🍋", "🌶️", "🥤"][s % 4] + '</text>';
    } else if (tab === "Innen") {
      svg = '<rect width="600" height="420" fill="#f1e3d3"/><rect y="290" width="600" height="130" fill="#c9a37a"/>' +
        [120, 300, 480].map(function (x, i) { return '<line x1="' + x + '" y1="0" x2="' + x + '" y2="90" stroke="#555" stroke-width="3"/><path d="M' + (x - 38) + ' 130 Q' + x + ' 60 ' + (x + 38) + ' 130Z" fill="' + (i % 2 ? '#ffcf5a' : a) + '"/><ellipse cx="' + x + '" cy="132" rx="30" ry="8" fill="#fff6c8"/>'; }).join("") +
        [110, 300, 490].map(function (x) { return '<rect x="' + (x - 70) + '" y="270" width="140" height="16" rx="8" fill="#8a5a2b"/><rect x="' + (x - 6) + '" y="286" width="12" height="90" fill="#6b4220"/><rect x="' + (x - 40) + '" y="372" width="80" height="10" rx="5" fill="#6b4220"/><rect x="' + (x - 62) + '" y="230" width="34" height="48" rx="8" fill="#5b7f95"/><rect x="' + (x + 28) + '" y="230" width="34" height="48" rx="8" fill="#5b7f95"/>'; }).join("") +
        '<text x="300" y="215" font-size="46" text-anchor="middle" opacity=".85">' + k.e + '</text>';
    } else {
      var w = 360 + Math.floor(rnd(s + 3) * 60);
      svg = '<rect width="600" height="420" fill="#cfe6f7"/><circle cx="520" cy="70" r="40" fill="#ffe58a"/><rect y="350" width="600" height="70" fill="#9bb08a"/>' +
        '<rect x="' + (300 - w / 2) + '" y="110" width="' + w + '" height="245" fill="#f4e7da"/><rect x="' + (300 - w / 2) + '" y="95" width="' + w + '" height="26" fill="#a55a3a"/>' +
        '<rect x="' + (300 - w / 2 + 14) + '" y="150" width="' + (w - 28) + '" height="46" rx="8" fill="' + a + '"/><text x="300" y="190" font-size="38" text-anchor="middle">' + k.e + '</text>' +
        '<path d="M' + (300 - w / 2 + 10) + ' 210 h' + (w - 20) + ' l-12 34 h-' + (w - 44) + 'z" fill="#ff5a36"/>' +
        '<rect x="' + (300 - w / 2 + 28) + '" y="255" width="90" height="100" rx="6" fill="#7fb4d6"/><rect x="' + (300 + w / 2 - 128) + '" y="262" width="62" height="93" rx="6" fill="#6b4220"/>' +
        '<circle cx="90" cy="320" r="38" fill="#5aa05a"/><rect x="85" y="330" width="10" height="30" fill="#6b4220"/>';
    }
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' + svg + '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(out);
  }

  /* ---------- Zustand ---------- */
  var state = { kat: "alle", open: false, park: false, veg: false, types: [], prices: [], sel: null };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Karte ---------- */
  var map = L.map("map", { zoomControl: false, attributionControl: true, tap: true, zoomSnap: 0.5 }).setView([50.91, 6.91], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  window.__map = map; // nur zum Testen
  var layer = L.layerGroup().addTo(map);
  var markers = {};

  function visible(p) {
    if (state.kat !== "alle" && p.k !== state.kat) return false;
    if (state.park && !p.p) return false;
    if (state.veg && !p.v) return false;
    if (state.types.length && state.types.indexOf(p.t) < 0) return false;
    if (state.prices.length && state.prices.indexOf(p.pr) < 0) return false;
    if (state.open && !status(p).open) return false;
    return true;
  }

  function pinHtml(p, sel) {
    var st = status(p), cls = "pin" + (st.open ? (st.soon ? " soon" : "") : " closed") + (sel ? " sel" : "");
    return '<div class="' + cls + '"><span class="dot"></span><span class="ti">' + TYPE_ICON[p.t] + '</span><span class="st">★</span>' + p.r.toFixed(1).replace(".", ",") + '</div>';
  }

  function render(fit) {
    layer.clearLayers(); markers = {};
    var list = PLACES.filter(visible), pts = [];
    list.forEach(function (p) {
      var m = L.marker(p.c, { icon: L.divIcon({ className: "", html: pinHtml(p, state.sel === p.id), iconSize: null }), zIndexOffset: Math.round(p.r * 100), keyboard: false });
      m.on("click", function (e) { L.DomEvent.stopPropagation(e); select(p.id); });
      m.addTo(layer); markers[p.id] = m; pts.push(p.c);
    });
    $("count").textContent = list.length + (list.length === 1 ? " Ort" : " Orte");
    var old = document.querySelector(".empty"); if (old) old.remove();
    if (!list.length) { var d = document.createElement("div"); d.className = "empty"; d.textContent = "Keine Treffer – Filter lockern"; document.body.appendChild(d); }
    var n = (state.open ? 1 : 0) + (state.park ? 1 : 0) + (state.veg ? 1 : 0) + state.types.length + state.prices.length;
    $("filterBadge").hidden = !n; $("filterBadge").textContent = n;
    if (state.sel && !list.some(function (p) { return p.id === state.sel; })) closeCard();
    if (fit && state.kat === "alle" && !state.open && !state.park && !state.veg && !state.types.length && !state.prices.length) {
      map.setView([50.912, 6.905], 11.5, { animate: true }); // Startansicht: Hürth + Köln
    } else if (fit && pts.length) {
      var h = window.innerHeight;
      map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [30, 190], paddingBottomRight: [30, 40], maxZoom: 13, animate: true });
    }
  }

  /* ---------- Chips ---------- */
  var chips = $("chips");
  KATS.forEach(function (k) {
    var b = document.createElement("button");
    b.className = "chip" + (k.id === state.kat ? " on" : ""); b.dataset.id = k.id; b.setAttribute("role", "tab");
    b.innerHTML = "<span>" + k.e + "</span>" + k.name;
    b.onclick = function () {
      state.kat = k.id;
      [].forEach.call(chips.children, function (c) { c.classList.toggle("on", c.dataset.id === k.id); });
      closeCard(); render(true);
    };
    chips.appendChild(b);
  });

  /* ---------- Untere Karte ---------- */
  function tag(txt, ok) { return '<span class="tag' + (ok === false ? " no" : "") + '">' + txt + '</span>'; }
  function select(id) {
    var prev = state.sel; state.sel = id;
    [prev, id].forEach(function (i) { var p = PLACES.find(function (x) { return x.id === i; }); if (p && markers[i]) markers[i].setIcon(L.divIcon({ className: "", html: pinHtml(p, i === state.sel), iconSize: null })); });
    var p = PLACES.find(function (x) { return x.id === id; }), st = status(p), k = KAT[p.k];
    var c = $("card");
    c.innerHTML =
      '<div class="card-h"><div class="emo" style="background:' + k.col + '">' + k.e + '</div><div style="min-width:0;flex:1"><h3>' + p.n + '</h3><div class="sub">' + k.name + ' · ' + p.a + '</div>' +
      '<div class="status ' + (st.open ? (st.soon ? "soon" : "open") : "closed") + '">' + st.text + '</div></div><button class="x" aria-label="Schließen">✕</button></div>' +
      '<div class="tags">' + tag(TYPE_ICON[p.t] + " " + p.t) + tag(p.s ? "🪑 Sitzplätze" : "🪑 Keine Sitzplätze", !!p.s) + tag(p.p ? "🅿️ Parkplatz" : "🅿️ Kein Parkplatz", !!p.p) +
      tag(PRICE[p.pr - 1]) + (p.v ? tag("🥦 Vegetarisch") : "") + '<span class="tag rate">★ ' + p.r.toFixed(1).replace(".", ",") + '</span></div>' +
      '<button class="btn primary" id="toDetail">Details & Fotos ansehen</button>';
    c.hidden = false; c.querySelector(".x").onclick = closeCard; $("toDetail").onclick = function () { openDetail(p); };
    // Pin sichtbar über der Karte halten
    var pt = map.latLngToContainerPoint(p.c), target = { x: window.innerWidth / 2, y: window.innerHeight * 0.36 };
    map.panBy([pt.x - target.x, pt.y - target.y], { animate: true, duration: .35 });
  }
  function closeCard() {
    var id = state.sel; state.sel = null; $("card").hidden = true;
    var p = PLACES.find(function (x) { return x.id === id; });
    if (p && markers[id]) markers[id].setIcon(L.divIcon({ className: "", html: pinHtml(p, false), iconSize: null }));
  }
  map.on("click", closeCard);
  // Bei weit herausgezoomter Karte: kompakte Pins (nur Punkt + Bewertung), damit sich nichts überdeckt
  function zoomClass() { document.getElementById("map").classList.toggle("far", map.getZoom() < 12); }
  map.on("zoomend", zoomClass); zoomClass();

  /* ---------- Detailseite ---------- */
  function openDetail(p) {
    var st = status(p), k = KAT[p.k], now = berlinNow(), tab = "Essen";
    var d = $("detail");
    var hoursRows = [1, 2, 3, 4, 5, 6, 0].map(function (day) {
      var h = p.h[day];
      return '<div class="hr' + (day === now.day ? " today" : "") + '"><span>' + TAGE[day] + '</span><span>' + (h ? h[0] + " – " + h[1] : "Ruhetag") + '</span></div>';
    }).join("");
    d.innerHTML =
      '<div class="d-top"><button class="back" aria-label="Zurück">←</button><div class="t">' + p.n + '</div></div>' +
      '<div class="photo"><img id="ph" alt=""><span class="lbl" id="phl"></span></div>' +
      '<div class="tabs" id="tabs"><button class="on">Essen</button><button>Innen</button><button>Außen</button></div>' +
      '<div class="d-body"><h1>' + p.n + '</h1>' +
      '<div class="d-meta"><span class="stars">★ ' + p.r.toFixed(1).replace(".", ",") + '</span><span>' + PRICE[p.pr - 1] + '</span><span>' + k.e + ' ' + k.name + '</span><span>' + p.a + '</span></div>' +
      '<div class="status ' + (st.open ? (st.soon ? "soon" : "open") : "closed") + '">' + st.text + '</div>' +
      '<div class="grid">' +
      cell("🍽️", "Art", p.t) + cell("🪑", "Sitzplätze", p.s ? "Ja" : "Nein") + cell("🅿️", "Parkplatz", p.p ? "Ja" : "Nein") + cell("🥦", "Vegetarisch", p.v ? "Ja, Optionen" : "Kaum") + '</div>' +
      '<div class="ai"><h4>✨ KI-Zusammenfassung<span class="pill">Beispieltext</span></h4><p>' + p.ki + '</p></div>' +
      '<div class="hours"><h4>Öffnungszeiten</h4>' + hoursRows + '</div>' +
      '<span class="demo-pill">Beispieldaten – dieser Laden, die Fotos und der Text sind ausgedacht.</span>' +
      '<p class="note">Fotos sind Platzhalter. In der echten Version kommen sie von Google, automatisch nach Essen / Innen / Außen sortiert.</p></div>';
    function cell(ic, l, v) { return '<div class="cell"><span class="ic">' + ic + '</span><div><small>' + l + '</small><b>' + v + '</b></div></div>'; }
    function setTab(t) { tab = t; $("ph").src = photo(p, t); $("phl").textContent = "Platzhalterbild · " + t; [].forEach.call($("tabs").children, function (b) { b.classList.toggle("on", b.textContent === t); }); }
    [].forEach.call($("tabs").children, function (b) { b.onclick = function () { setTab(b.textContent); }; });
    d.querySelector(".back").onclick = function () { d.hidden = true; history.back && location.hash === "#detail" && history.back(); };
    setTab("Essen"); d.scrollTop = 0; d.hidden = false;
    if (location.hash !== "#detail") history.pushState(null, "", "#detail");
  }
  window.addEventListener("popstate", function () { $("detail").hidden = true; });

  /* ---------- Filter ---------- */
  function seg(el, items, key, labelFn) {
    items.forEach(function (it) {
      var b = document.createElement("button"); b.textContent = labelFn(it);
      b.onclick = function () {
        var i = state[key].indexOf(it); if (i >= 0) state[key].splice(i, 1); else state[key].push(it);
        b.classList.toggle("on"); render(false);
      };
      el.appendChild(b);
    });
  }
  seg($("fType"), TYPES, "types", function (t) { return TYPE_ICON[t] + " " + t; });
  seg($("fPrice"), [1, 2, 3], "prices", function (n) { return PRICE[n - 1]; });
  [["fOpen", "open"], ["fPark", "park"], ["fVeg", "veg"]].forEach(function (a) { $(a[0]).onchange = function () { state[a[1]] = this.checked; render(false); }; });
  function sheet(show) { $("filterSheet").hidden = !show; $("scrim").hidden = !show; }
  $("filterBtn").onclick = function () { sheet(true); };
  $("scrim").onclick = $("fDone").onclick = function () { sheet(false); render(true); };
  $("fReset").onclick = function () {
    state.open = state.park = state.veg = false; state.types = []; state.prices = [];
    ["fOpen", "fPark", "fVeg"].forEach(function (i) { $(i).checked = false; });
    [].forEach.call(document.querySelectorAll(".seg button"), function (b) { b.classList.remove("on"); });
    render(false);
  };

  render(true);
  // Pins alle 60 s aktualisieren (offen/geschlossen ändert sich mit der Uhrzeit)
  setInterval(function () { render(false); }, 60000);

  if ("serviceWorker" in navigator) window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
})();
