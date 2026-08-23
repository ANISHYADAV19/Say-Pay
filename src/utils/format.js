/** Display helpers. Item names are stored lowercase; title-case for the UI. */
export const titleCase = (s) => (s || '').replace(/\b\w/g, (c) => c.toUpperCase())

const currencyMap = {
  'en-US': { style: 'currency', currency: 'USD' },
  'es-ES': { style: 'currency', currency: 'EUR' },
  'fr-FR': { style: 'currency', currency: 'EUR' },
  'de-DE': { style: 'currency', currency: 'EUR' },
  'hi-IN': { style: 'currency', currency: 'INR' },
  'zh-CN': { style: 'currency', currency: 'CNY' },
}

/** Format currency based on active language/locale */
export const money = (n, lang = 'en-US') => {
  const config = currencyMap[lang] || currencyMap['en-US']
  try {
    return new Intl.NumberFormat(lang, config).format(n)
  } catch {
    const symbol = lang === 'hi-IN' ? '₹' : (lang === 'zh-CN' ? '¥' : (['es-ES', 'fr-FR', 'de-DE'].includes(lang) ? '€' : '$'))
    return `${symbol}${Number(n).toFixed(2)}`
  }
}
