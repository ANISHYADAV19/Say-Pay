/** Display helpers. Item names are stored lowercase; title-case for the UI. */
export const titleCase = (s) => (s || '').replace(/\b\w/g, (c) => c.toUpperCase())

/** "$3.49" from 3.49 */
export const money = (n) => `$${Number(n).toFixed(2)}`
