// BEISPIELDATEN – alles ausgedacht! Keine echten Läden, keine echten Bewertungen.
// Die echte Version lädt später Daten live von der Google Places API.
(function () {
  // Öffnungszeiten: Wochentage 0=So ... 6=Sa. "ruhetag" = Liste von Tagen ohne Betrieb.
  // Schließzeit nach Mitternacht erlaubt (z. B. "02:00").
  function hrs(wochentags, am_we, ruhetag) {
    // wochentags = [von, bis] Mo–Fr, am_we = [von, bis] Sa/So
    var out = [];
    for (var d = 0; d < 7; d++) {
      if ((ruhetag || []).indexOf(d) >= 0) { out.push(null); continue; }
      var h = (d === 0 || d === 6) ? (am_we || wochentags) : wochentags;
      out.push(h);
    }
    return out;
  }

  var P = [
    // ---- Asiatisch
    { n: "Wok & Wunder", k: "asiatisch", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.4, v: 1, a: "Efferen", c: [50.9080, 6.8530], h: hrs(["11:30", "22:00"], ["12:00", "22:30"], [1]),
      ki: "Große Portionen, frische Zutaten, viele vegetarische Gerichte. Bei Hochbetrieb kann der Service etwas langsamer sein." },
    { n: "Nudel Nirvana", k: "asiatisch", t: "Imbiss", s: 1, p: 0, pr: 1, r: 4.1, v: 1, a: "Köln-Ehrenfeld", c: [50.9510, 6.9190], h: hrs(["11:00", "21:00"], ["12:00", "22:00"]),
      ki: "Schnell und günstig, die Brühe kommt gut an. Wenige Sitzplätze, mittags oft voll." },
    { n: "Bambus Bistro (Beispiel)", k: "asiatisch", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.6, v: 1, a: "Hürth-Mitte", c: [50.8790, 6.8760], h: hrs(["17:00", "22:30"], ["12:00", "23:00"], [2]),
      ki: "Gemütliches Ambiente, freundliches Personal, Sushi-Platten sehr beliebt. Reservieren am Wochenende empfohlen." },
    { n: "Sushi Sonnenaufgang", k: "asiatisch", t: "Nur To-go", s: 0, p: 0, pr: 2, r: 4.2, v: 1, a: "Köln-Innenstadt", c: [50.9400, 6.9500], h: hrs(["11:30", "20:30"], ["12:00", "20:00"], [0]),
      ki: "Nur zum Mitnehmen, schön verpackt und frisch. Preise etwas über dem Durchschnitt." },
    { n: "Drachenhof Express", k: "asiatisch", t: "Imbiss", s: 0, p: 1, pr: 1, r: 3.8, v: 0, a: "Hürth-Hermülheim", c: [50.8700, 6.8900], h: hrs(["11:00", "21:30"], ["11:00", "21:30"], [1]),
      ki: "Solide Standardgerichte, gute Mittagsmenüs. Wenig vegetarische Auswahl." },

    // ---- Burger
    { n: "Patty Palast", k: "burger", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.5, v: 1, a: "Hürth-Kendenich", c: [50.8650, 6.8500], h: hrs(["12:00", "22:00"], ["12:00", "23:00"]),
      ki: "Saftige Burger, große Portionen, eigene Soßen. Wartezeit am Wochenende manchmal lang." },
    { n: "Bun Brothers (Beispiel)", k: "burger", t: "Imbiss", s: 1, p: 0, pr: 1, r: 4.0, v: 1, a: "Köln-Sülz", c: [50.9170, 6.9280], h: hrs(["11:30", "23:00"], ["11:30", "00:30"]),
      ki: "Faire Preise, knusprige Pommes, veganer Burger überraschend gut. Innen eher laut." },
    { n: "Grillgott Burger", k: "burger", t: "Restaurant", s: 1, p: 1, pr: 3, r: 4.7, v: 1, a: "Köln-Lindenthal", c: [50.9330, 6.9050], h: hrs(["17:00", "23:00"], ["12:00", "23:00"], [1]),
      ki: "Hochwertiges Fleisch, kreative Burger, stylisches Lokal. Preislich im oberen Bereich." },
    { n: "Fast Frikadelle", k: "burger", t: "Nur To-go", s: 0, p: 0, pr: 1, r: 3.6, v: 0, a: "Köln-Neustadt", c: [50.9330, 6.9400], h: hrs(["11:00", "03:00"], ["11:00", "05:00"]),
      ki: "Praktisch für spätnachts, Essen kommt schnell. Qualität schwankt." },
    { n: "Cheesy Corner", k: "burger", t: "Imbiss", s: 1, p: 1, pr: 1, r: 4.2, v: 1, a: "Hürth-Efferen", c: [50.9020, 6.8620], h: hrs(["11:00", "21:00"], ["12:00", "21:00"], [0]),
      ki: "Freundliches Personal, guter Cheeseburger, kleine Terrasse. Sitzplätze begrenzt." },

    // ---- Döner
    { n: "Drehspieß Deluxe", k: "doener", t: "Imbiss", s: 1, p: 0, pr: 1, r: 4.5, v: 1, a: "Köln-Ehrenfeld", c: [50.9490, 6.9140], h: hrs(["10:00", "02:00"], ["10:00", "04:00"]),
      ki: "Üppig belegt, frisches Brot, scharfe Soße mit Kick. Spätabends oft Schlange." },
    { n: "Kebab Karussell", k: "doener", t: "Imbiss", s: 0, p: 1, pr: 1, r: 4.0, v: 1, a: "Hürth-Mitte", c: [50.8810, 6.8700], h: hrs(["10:30", "23:00"], ["11:00", "23:30"]),
      ki: "Schnell, günstig, ordentliche Portionen. Nur Stehtisch, aber Parkplatz vor der Tür." },
    { n: "Dürüm Dorado", k: "doener", t: "Nur To-go", s: 0, p: 0, pr: 1, r: 3.9, v: 1, a: "Köln-Innenstadt", c: [50.9370, 6.9560], h: hrs(["11:00", "01:00"], ["11:00", "03:00"]),
      ki: "Mitnehm-Klassiker für zwischendurch. Fleisch gut gewürzt, Salat manchmal welk." },
    { n: "Anatolischer Grill Beispiel", k: "doener", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.6, v: 1, a: "Köln-Porz", c: [50.8870, 7.0000], h: hrs(["11:00", "23:00"], ["11:00", "23:00"], [1]),
      ki: "Richtig gemütlich, Platten für mehrere Personen, sehr aufmerksamer Service." },
    { n: "Spieß & Sesam", k: "doener", t: "Imbiss", s: 1, p: 1, pr: 1, r: 4.3, v: 0, a: "Hürth-Gleuel", c: [50.8960, 6.8450], h: hrs(["11:00", "22:00"], ["12:00", "22:00"], [2]),
      ki: "Familiär geführt, große Döner, kurze Wartezeit. Sauber und freundlich." },

    // ---- Pizza
    { n: "Pizza Pronto Beispiel", k: "pizza", t: "Nur To-go", s: 0, p: 1, pr: 1, r: 4.1, v: 1, a: "Hürth-Hermülheim", c: [50.8740, 6.8830], h: hrs(["16:00", "22:30"], ["12:00", "22:30"]),
      ki: "Schnelle Abholung, dünner Boden, faire Preise. Keine Sitzgelegenheit." },
    { n: "Ofenfrisch & Co.", k: "pizza", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.5, v: 1, a: "Köln-Braunsfeld", c: [50.9380, 6.8830], h: hrs(["12:00", "22:30"], ["12:00", "23:00"], [1]),
      ki: "Holzofenpizza mit knusprigem Rand, nette Atmosphäre. Abends gut besucht." },
    { n: "Slice Studio", k: "pizza", t: "Imbiss", s: 1, p: 0, pr: 1, r: 4.0, v: 1, a: "Köln-Innenstadt", c: [50.9420, 6.9380], h: hrs(["11:30", "22:00"], ["12:00", "23:00"]),
      ki: "Pizza im Stück, ideal zum Mittag. Wenige Sitzplätze, wenig Platz." },
    { n: "Margherita Mond", k: "pizza", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.4, v: 1, a: "Hürth-Fischenich", c: [50.8860, 6.9020], h: hrs(["17:00", "22:30"], ["12:00", "22:30"], [1]),
      ki: "Große Auswahl, auch glutenfreie Böden. Service freundlich, manchmal etwas langsam." },

    // ---- Italienisch
    { n: "Trattoria Tramonto (Beispiel)", k: "italienisch", t: "Restaurant", s: 1, p: 1, pr: 3, r: 4.7, v: 1, a: "Köln-Marienburg", c: [50.9100, 6.9760], h: hrs(["17:30", "23:00"], ["12:00", "23:00"], [1]),
      ki: "Hausgemachte Pasta, ausgezeichnete Weinkarte, aufmerksamer Service. Gehobene Preise." },
    { n: "Nonnas Nudelhaus", k: "italienisch", t: "Restaurant", s: 1, p: 0, pr: 2, r: 4.3, v: 1, a: "Köln-Sülz", c: [50.9190, 6.9200], h: hrs(["12:00", "22:30"], ["12:00", "22:30"]),
      ki: "Wie bei Oma: große Portionen, einfache Küche, herzlich. Innen eher eng." },
    { n: "Pasta Pavillon", k: "italienisch", t: "Imbiss", s: 1, p: 1, pr: 1, r: 4.0, v: 1, a: "Hürth-Mitte", c: [50.8830, 6.8680], h: hrs(["11:30", "20:00"], ["12:00", "18:00"], [0]),
      ki: "Schnelle Mittagspasta zu kleinen Preisen. Abends früh geschlossen." },
    { n: "Osteria Oleander", k: "italienisch", t: "Restaurant", s: 1, p: 1, pr: 3, r: 4.8, v: 1, a: "Köln-Rodenkirchen", c: [50.8860, 6.9870], h: hrs(["18:00", "23:00"], ["12:00", "23:00"], [1, 2]),
      ki: "Besonderer Abend garantiert: kleine Karte, saisonal, tolle Desserts. Unbedingt reservieren." },

    // ---- Café / Bäckerei
    { n: "Krümelkunst Bäckerei", k: "cafe", t: "Nur To-go", s: 0, p: 1, pr: 1, r: 4.4, v: 1, a: "Hürth-Efferen", c: [50.9000, 6.8580], h: hrs(["06:00", "17:00"], ["07:00", "13:00"], [0]),
      ki: "Frische Brötchen ab früh morgens, freundliches Team. Kaffee zum Mitnehmen." },
    { n: "Café Kaffeekranz", k: "cafe", t: "Restaurant", s: 1, p: 0, pr: 2, r: 4.6, v: 1, a: "Köln-Ehrenfeld", c: [50.9460, 6.9230], h: hrs(["08:00", "18:00"], ["09:00", "19:00"]),
      ki: "Gemütlich, hausgemachte Kuchen, guter Cappuccino. Am Wochenende voll." },
    { n: "Bohne & Brot", k: "cafe", t: "Imbiss", s: 1, p: 1, pr: 1, r: 4.2, v: 1, a: "Hürth-Hermülheim", c: [50.8690, 6.8800], h: hrs(["07:00", "16:00"], ["08:00", "14:00"], [0]),
      ki: "Frühstück zu fairen Preisen, nettes Personal, WLAN vorhanden." },
    { n: "Zuckerschnute", k: "cafe", t: "Nur To-go", s: 0, p: 0, pr: 1, r: 3.9, v: 1, a: "Köln-Lindenthal", c: [50.9270, 6.9110], h: hrs(["07:30", "18:00"], ["08:00", "17:00"]),
      ki: "Süßes zum Mitnehmen, Croissants sehr gut. Kaffee ist nur Durchschnitt." },
    { n: "Morgenrot Café", k: "cafe", t: "Restaurant", s: 1, p: 1, pr: 2, r: 4.5, v: 1, a: "Köln-Junkersdorf", c: [50.9300, 6.8640], h: hrs(["08:00", "17:00"], ["09:00", "18:00"], [1]),
      ki: "Ruhige Lage, schöner Garten, ausgiebiges Frühstück. Etwas höhere Preise." },
    { n: "Rheinblick Eiscafé", k: "cafe", t: "Imbiss", s: 1, p: 0, pr: 2, r: 4.3, v: 1, a: "Köln-Deutz", c: [50.9380, 6.9700], h: hrs(["11:00", "21:00"], ["10:00", "22:00"]),
      ki: "Eis und Kaffee mit schöner Aussicht. Warteschlange bei gutem Wetter." },
    { n: "Sauerteig Studio", k: "cafe", t: "Nur To-go", s: 0, p: 1, pr: 2, r: 4.7, v: 1, a: "Hürth-Kendenich", c: [50.8680, 6.8280], h: hrs(["06:30", "15:00"], ["07:00", "13:00"], [0, 1]),
      ki: "Handwerkliches Brot, schnell ausverkauft. Früh kommen lohnt sich." }
  ];

  P.forEach(function (x, i) { x.id = i + 1; });
  window.PLACES = P;
})();
