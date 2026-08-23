/**
 * English parser lexicon (en-US). The reference shape every other lexicon
 * follows — ported verbatim from the original hardcoded constants in rules.js,
 * so English parsing is byte-for-byte unchanged by the multilingual refactor.
 *
 * Word lists are compiled to regexes by ./index.js (escaped, spelling-variant
 * expanded, sorted longest-first). Structural patterns — prices and quantity
 * updates, where word order differs per language — are authored here directly.
 */
export default {
  lang: 'en',

  // Latin script: \b works, and words are space-separated.
  wordBoundary: true,
  spaced: true,

  numbers: {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
    eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, dozen: 12, couple: 2,
    few: 3, several: 3, half: 1,
  },

  units: [
    'bottle', 'bottles', 'can', 'cans', 'box', 'boxes', 'bag', 'bags', 'carton',
    'cartons', 'pack', 'packs', 'packet', 'packets', 'jar', 'jars', 'loaf',
    'loaves', 'bunch', 'bunches', 'dozen', 'kg', 'kilogram', 'kilograms', 'kilo',
    'kilos', 'g', 'gram', 'grams', 'gm', 'l', 'litre', 'litres', 'liter',
    'liters', 'ml', 'lb', 'lbs', 'pound', 'pounds', 'piece', 'pieces', 'pcs',
    'slice', 'slices', 'cup', 'cups', 'tin', 'tins', 'roll', 'rolls', 'bar',
    'bars', 'tube', 'tubes', 'stick', 'sticks', 'head', 'heads', 'pint',
    'pints', 'quart', 'quarts', 'gallon', 'gallons',
  ],

  /** Connector between a unit and the noun — "2 bottles OF milk". */
  partitive: ['of'],

  /** Never part of an item name; trimmed from both ends of the extracted item. */
  filler: ['of', 'some', 'the', 'a', 'an', 'please', 'for', 'me', 'my', 'to', 'i', 'we', 'you'],

  /** "…to my shopping list" — removed wholesale before item extraction. */
  listPhrases: [
    'to my shopping list', 'to the shopping list', 'from my shopping list',
    'from the shopping list', 'on my shopping list', 'in my shopping list',
    'off my shopping list', 'to my list', 'to the list', 'from my list',
    'from the list', 'on my list', 'in my list', 'off my list', 'to my cart',
    'from my cart', 'to the cart', 'to my basket', 'from my basket',
    'my shopping list', 'the shopping list', 'my list', 'the list', 'my cart',
    'the cart', 'my basket', 'the basket', 'please', 'for me',
  ],

  verbs: {
    add: [
      'add', 'need', 'want to buy', 'want', 'buy', 'get me', 'get', 'grab',
      'put', 'include', 'purchase', 'remember', 'pick up', 'would like to',
      'would like', "i'd like", "i'll", 'wanna', 'gotta', 'have to', 'gimme',
    ],
    remove: [
      'remove', 'delete', 'drop', 'discard', 'erase', 'take off', 'take out',
      'get rid of', 'cross off', 'cross out',
    ],
    clear: [
      'clear', 'empty', 'reset', 'wipe', 'start over', 'delete everything',
      'clear everything', 'remove everything', 'delete all', 'clear all',
      'remove all', 'delete the whole list', 'clear the whole list',
    ],
    search: [
      'find', 'search', 'look for', 'show me', 'look up', 'do you have', 'any',
    ],
  },

  /**
   * Quantity updates. `detect` is deliberately looser than `extract`: a phrasing
   * we recognize but can't pull numbers out of should escalate to the LLM rather
   * than silently fall through to "add".
   */
  update: {
    detect: [/\b(?:change|update|set)\b.*\bto\b/, /\bmake\s+it\b/],
    extract: [
      { re: /\b(?:change|update|set)\s+(.+?)\s+to\s+(\d+|[a-z]+)\b/, item: 1, qty: 2 },
      { re: /\bmake\s+it\s+(\d+|[a-z]+)\s*(.*)$/, item: 2, qty: 1 },
    ],
  },

  /** Ordered; first match wins. Capture group 1 is the amount. */
  price: [
    /\bunder\s*(?:\$|₹)?\s*(\d+(?:\.\d+)?)/,
    /\bbelow\s*(?:\$|₹)?\s*(\d+(?:\.\d+)?)/,
    /\bless\s+than\s*(?:\$|₹)?\s*(\d+(?:\.\d+)?)/,
    /\bcheaper\s+than\s*(?:\$|₹)?\s*(\d+(?:\.\d+)?)/,
    /(?:\$|₹)\s*(\d+(?:\.\d+)?)\s*(?:or\s+less|and\s+under)?/,
  ],

  /** Unit words allowed in a "500g"-style size filter. */
  sizeUnits: ['kg', 'g', 'ml', 'l', 'litre', 'liter', 'oz', 'pack', 'lb', 'pound'],

  /** The organic/bio filter — always normalized to the catalog tag 'organic'. */
  organic: ['organic'],

  /** Left-over connective noise stripped from a search query. */
  searchNoise: [
    'for', 'dollar', 'dollars', 'buck', 'bucks', 'price', 'priced', 'cost',
    'under', 'below', 'less than', 'or less', 'and under',
  ],
}
