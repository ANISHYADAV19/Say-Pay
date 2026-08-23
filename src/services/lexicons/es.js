/**
 * Spanish parser lexicon (es-ES). See ./en.js for the shape.
 *
 * Accented verbs ("añade", "muéstrame") are matched in both their accented and
 * folded spellings — the compiler in ./index.js expands them, because es-ES
 * recognizers drop accents unpredictably.
 */
export default {
  lang: 'es',
  wordBoundary: true,
  spaced: true,

  numbers: {
    un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
    siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, docena: 12,
    par: 2, medio: 1, media: 1, unos: 3, unas: 3, varios: 3, varias: 3,
  },

  units: [
    'botella', 'botellas', 'lata', 'latas', 'caja', 'cajas', 'bolsa', 'bolsas',
    'cartón', 'cartones', 'paquete', 'paquetes', 'tarro', 'tarros', 'frasco',
    'frascos', 'barra', 'barras', 'manojo', 'manojos', 'docena', 'docenas',
    'kg', 'kilo', 'kilos', 'kilogramo', 'kilogramos', 'g', 'gramo', 'gramos',
    'l', 'litro', 'litros', 'ml', 'lb', 'libra', 'libras', 'pieza', 'piezas',
    'rodaja', 'rodajas', 'taza', 'tazas', 'rollo', 'rollos', 'tubo', 'tubos',
    'unidad', 'unidades',
  ],

  partitive: ['de'],

  filler: [
    'de', 'del', 'algo', 'algunos', 'algunas', 'el', 'la', 'los', 'las', 'un',
    'una', 'por favor', 'para', 'mí', 'me', 'mi', 'mis', 'a', 'y', 'yo',
  ],

  listPhrases: [
    'a mi lista de la compra', 'a la lista de la compra', 'de mi lista de la compra',
    'en mi lista de la compra', 'a mi lista de compras', 'de mi lista de compras',
    'a mi lista', 'a la lista', 'de mi lista', 'de la lista', 'en mi lista',
    'en la lista', 'a mi carrito', 'de mi carrito', 'a la cesta', 'de la cesta',
    'mi lista de la compra', 'la lista de la compra', 'mi lista', 'la lista',
    'mi carrito', 'el carrito', 'la cesta', 'por favor', 'para mí',
  ],

  verbs: {
    add: [
      'añade', 'añadir', 'añado', 'agrega', 'agregar', 'agrego', 'pon', 'poner',
      'mete', 'meter', 'compra', 'comprar', 'necesito', 'quiero', 'quisiera',
      'me gustaría', 'dame', 'apunta', 'anota', 'incluye', 'tengo que comprar',
    ],
    remove: [
      'quita', 'quitar', 'elimina', 'eliminar', 'borra', 'borrar', 'saca',
      'sacar', 'retira', 'retirar', 'tacha', 'suprime',
    ],
    clear: [
      'vacía la lista', 'vaciar la lista', 'limpia la lista', 'limpiar la lista',
      'borra la lista', 'borrar la lista', 'borra todo', 'borrar todo',
      'elimina todo', 'quita todo', 'vacía', 'vaciar', 'reinicia', 'reiniciar',
      'empieza de nuevo', 'de cero',
    ],
    search: [
      'busca', 'buscar', 'encuentra', 'encontrar', 'muestra', 'muéstrame',
      'enséñame', 'hay', 'tienes', 'tienen', 'tenéis', 'algún', 'alguna',
    ],
  },

  update: {
    detect: [/\b(?:cambia|cambiar|pon|poner|actualiza|ajusta)\b.*\ba\b/, /\bque\s+sean\b/],
    extract: [
      { re: /\b(?:cambia|cambiar|pon|poner|actualiza|ajusta)\s+(.+?)\s+a\s+(\d+|[a-záéíóúñ]+)\b/, item: 1, qty: 2 },
      { re: /\bque\s+sean\s+(\d+|[a-záéíóúñ]+)\s*(.*)$/, item: 2, qty: 1 },
    ],
  },

  price: [
    /\bpor\s+menos\s+de\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bmenos\s+de\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bmenores?\s+a\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\b(?:bajo|debajo\s+de)\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\bm[áa]s\s+baratos?\s+que\s*\$?\s*(\d+(?:\.\d+)?)/,
    /\$\s*(\d+(?:\.\d+)?)/,
  ],

  sizeUnits: ['kg', 'g', 'ml', 'l', 'litro', 'litros', 'oz', 'pack', 'lb', 'libra', 'kilo', 'gramos'],

  organic: ['orgánico', 'orgánica', 'orgánicos', 'orgánicas', 'ecológico', 'ecológica', 'bio'],

  // NB: "de" is deliberately absent — it's a genitive that carries meaning
  // inside item names ("aceite de oliva", "leche de almendras"), and stripping
  // it would stop the canonical lookup from resolving them. cleanItem still
  // trims it from the ends via `filler`.
  searchNoise: [
    'por', 'para', 'dólar', 'dólares', 'euro', 'euros', 'precio', 'cuesta',
    'menos de', 'debajo de', 'bajo',
  ],
}
