/**
 * French parser lexicon (fr-FR). See ./en.js for the shape.
 *
 * Elisions ("j'ai", "d'huile") arrive with either a typographic or an ASCII
 * apostrophe depending on the recognizer; ./index.js expands both spellings.
 */
export default {
  lang: 'fr',
  wordBoundary: true,
  spaced: true,

  numbers: {
    un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
    huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, douzaine: 12, demi: 1,
    demie: 1, quelques: 3, plusieurs: 3,
  },

  units: [
    'bouteille', 'bouteilles', 'boîte', 'boîtes', 'canette', 'canettes',
    'sachet', 'sachets', 'sac', 'sacs', 'paquet', 'paquets', 'pot', 'pots',
    'bocal', 'bocaux', 'brique', 'briques', 'tranche', 'tranches', 'botte',
    'bottes', 'douzaine', 'douzaines', 'kg', 'kilo', 'kilos', 'kilogramme',
    'kilogrammes', 'g', 'gramme', 'grammes', 'l', 'litre', 'litres', 'ml',
    'lb', 'livre', 'livres', 'pièce', 'pièces', 'tasse', 'tasses', 'rouleau',
    'rouleaux', 'tube', 'tubes', 'barre', 'barres', 'unité', 'unités',
  ],

  partitive: ['de', 'du', "d'", 'des', 'de la'],

  filler: [
    'du', 'de', 'des', 'de la', "d'", 'le', 'la', 'les', 'un', 'une', 'un peu',
    'quelques', "s'il te plaît", "s'il vous plaît", 'pour', 'moi', 'ma', 'mon',
    'mes', 'à', 'et', 'je',
  ],

  listPhrases: [
    'à ma liste de courses', 'à la liste de courses', 'de ma liste de courses',
    'sur ma liste de courses', 'dans ma liste de courses', 'à ma liste',
    'à la liste', 'de ma liste', 'de la liste', 'sur ma liste', 'dans ma liste',
    'à mon panier', 'de mon panier', 'dans le panier', 'ma liste de courses',
    'la liste de courses', 'ma liste', 'la liste', 'mon panier', 'le panier',
    "s'il te plaît", "s'il vous plaît", 'pour moi',
  ],

  verbs: {
    add: [
      'ajoute', 'ajouter', 'rajoute', 'rajouter', 'mets', 'mettre', 'achète',
      'acheter', "j'ai besoin de", "j'ai besoin d'", "j'ai besoin", 'il me faut',
      'je veux', 'je voudrais', 'prends', 'prendre', 'note', 'inclus', 'il faut',
    ],
    remove: [
      'enlève', 'enlever', 'supprime', 'supprimer', 'retire', 'retirer',
      'efface', 'effacer', 'ôte', 'raye', 'barre',
    ],
    clear: [
      'vide la liste', 'vider la liste', 'efface la liste', 'effacer la liste',
      'supprime la liste', 'supprime tout', 'supprimer tout', 'efface tout',
      'effacer tout', 'enlève tout', 'vide', 'vider', 'réinitialise',
      'réinitialiser', 'on recommence', 'recommence',
    ],
    search: [
      'trouve', 'trouver', 'cherche', 'chercher', 'recherche', 'montre-moi',
      'montre', 'affiche', 'as-tu', 'avez-vous', 'il y a', 'y a-t-il',
    ],
  },

  update: {
    detect: [/\b(?:change|changer|passe|mets|mettre|modifie)\b.*\b(?:à|a|en)\b/, /\bmets\s+en\b/],
    extract: [
      { re: /\b(?:change|changer|passe|mets|mettre|modifie)\s+(.+?)\s+(?:à|a|en)\s+(\d+|[a-zàâçéèêëîïôûùüÿœ]+)\b/, item: 1, qty: 2 },
    ],
  },

  price: [
    /\b(?:à\s+)?moins\s+de\s*(?:\$|€)?\s*(\d+(?:\.\d+)?)/,
    /\ben\s+dessous\s+de\s*(?:\$|€)?\s*(\d+(?:\.\d+)?)/,
    /\bsous\s*(?:\$|€)?\s*(\d+(?:\.\d+)?)/,
    /\bpas\s+plus\s+de\s*(?:\$|€)?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:\$|€|euros?|dollars?)/,
    /(?:\$|€)\s*(\d+(?:\.\d+)?)/,
  ],

  sizeUnits: ['kg', 'g', 'ml', 'l', 'litre', 'litres', 'oz', 'pack', 'lb', 'livre', 'kilo', 'grammes'],

  organic: ['bio', 'biologique', 'biologiques'],

  // "de"/"du"/"des" stay out — they carry meaning inside item names
  // ("huile d'olive", "lait d'amande") and `filler` already trims them off the ends.
  searchNoise: [
    'pour', 'dollar', 'dollars', 'euro', 'euros', 'prix', 'coûte',
    'moins de', 'en dessous de', 'sous',
  ],
}
