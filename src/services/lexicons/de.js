/**
 * German parser lexicon (de-DE). See ./en.js for the shape.
 *
 * German puts the verb last and often splits it ("füge Milch hinzu"), which the
 * parser handles for free: detection is a `test` (position-independent) and the
 * strip regex is global, so both halves of a separable verb are removed.
 *
 * Umlauts are matched as written, accent-folded ("äpfel"/"apfel") and
 * transliterated ("aepfel") — see utils/text.js.
 */
export default {
  lang: 'de',
  wordBoundary: true,
  spaced: true,

  numbers: {
    ein: 1, eine: 1, einen: 1, eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5,
    sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12,
    dutzend: 12, paar: 2, halb: 1, halbe: 1, einige: 3, mehrere: 3,
  },

  units: [
    'flasche', 'flaschen', 'dose', 'dosen', 'schachtel', 'schachteln', 'karton',
    'kartons', 'packung', 'packungen', 'paket', 'pakete', 'beutel', 'tüte',
    'tüten', 'glas', 'gläser', 'becher', 'laib', 'laibe', 'bund', 'scheibe',
    'scheiben', 'stück', 'stücke', 'dutzend', 'kg', 'kilo', 'kilogramm', 'g',
    'gramm', 'l', 'liter', 'ml', 'lb', 'pfund', 'tasse', 'tassen', 'rolle',
    'rollen', 'tube', 'tuben', 'riegel', 'stange', 'stangen', 'kopf',
  ],

  // German uses a bare genitive/apposition — "2 Flaschen Milch", no connector.
  partitive: [],

  filler: [
    'etwas', 'ein', 'eine', 'einen', 'der', 'die', 'das', 'den', 'dem', 'bitte',
    'für', 'mich', 'mir', 'mein', 'meine', 'meinen', 'zum', 'zur', 'und', 'ich',
    'noch',
  ],

  listPhrases: [
    'auf meine einkaufsliste', 'auf die einkaufsliste', 'von meiner einkaufsliste',
    'von der einkaufsliste', 'zu meiner einkaufsliste', 'in meine einkaufsliste',
    'auf meine liste', 'auf die liste', 'von meiner liste', 'von der liste',
    'zu meiner liste', 'in meine liste', 'in den warenkorb', 'aus dem warenkorb',
    'meine einkaufsliste', 'die einkaufsliste', 'meine liste', 'die liste',
    'der warenkorb', 'den warenkorb', 'bitte', 'für mich',
  ],

  verbs: {
    add: [
      'hinzufügen', 'hinzu', 'füge', 'dazu', 'kaufen', 'kauf', 'kaufe',
      'besorge', 'besorgen', 'brauche', 'brauchen', 'will', 'möchte',
      'ich hätte gerne', 'nimm', 'notiere', 'schreibe', 'setze auf die liste',
    ],
    remove: [
      'entfernen', 'entferne', 'entfern', 'lösche', 'löschen', 'streiche',
      'streichen', 'nimm weg', 'weg', 'raus', 'runter',
    ],
    clear: [
      'liste leeren', 'liste löschen', 'lösche die liste', 'leere die liste',
      'alles löschen', 'lösche alles', 'alles entfernen', 'entferne alles',
      'leeren', 'leere', 'zurücksetzen', 'von vorne', 'neu anfangen',
    ],
    search: [
      'finden', 'finde', 'suchen', 'suche', 'such', 'zeige mir', 'zeige', 'zeig',
      'gibt es', 'habt ihr', 'haben sie', 'hast du',
    ],
  },

  update: {
    detect: [/\b(?:ändere|andere|aendere|setze|mach|mache|ändern)\b.*\bauf\b/, /\bmach\s+(?:es|daraus)\b/],
    extract: [
      { re: /\b(?:ändere|andere|aendere|setze|mach|mache|ändern)\s+(.+?)\s+auf\s+(\d+|[a-zäöüß]+)\b/, item: 1, qty: 2 },
      { re: /\bmach\s+(?:es|daraus)\s+(\d+|[a-zäöüß]+)\s*(.*)$/, item: 2, qty: 1 },
    ],
  },

  price: [
    /\bunter\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bweniger\s+als\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bbis\s+(?:zu\s+)?\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bg[üu]nstiger\s+als\s*\$?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:\$|€|euros?|dollars?)/,
    /\$\s*(\d+(?:\.\d+)?)/,
  ],

  sizeUnits: ['kg', 'g', 'ml', 'l', 'liter', 'oz', 'pack', 'lb', 'pfund', 'kilo', 'gramm'],

  organic: ['bio', 'biologisch', 'biologische', 'öko'],

  searchNoise: [
    'für', 'dollar', 'euro', 'euros', 'preis', 'kostet', 'unter',
    'weniger als', 'bis zu',
  ],
}
