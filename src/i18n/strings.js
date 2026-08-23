/**
 * UI localization strings (FR-6.4). A tiny in-repo i18n layer — no dependency.
 *
 * Structure is KEY-first: every key defines all supported languages, so a
 * missing translation is a structural (test-catchable) error, and `t()` can
 * always fall back to the default language. Item names are translated via
 * terms.js. Catalog product names are content data and are NOT translated here.
 *
 * `{name}`-style placeholders are interpolated by `t(key, lang, vars)`.
 */

export const SUPPORTED_LANGS = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'hi-IN', 'zh-CN']
export const DEFAULT_LANG = 'en-US'

const S = {
  // Header + language picker
  'header.subtitle': {
    'en-US': 'Voice shopping list',
    'es-ES': 'Lista de compras por voz',
    'fr-FR': 'Liste de courses vocale',
    'de-DE': 'Sprachgesteuerte Einkaufsliste',
    'hi-IN': 'वॉइस शॉपिंग सूची',
    'zh-CN': '语音购物清单',
  },
  'lang.label': {
    'en-US': 'Language',
    'es-ES': 'Idioma',
    'fr-FR': 'Langue',
    'de-DE': 'Sprache',
    'hi-IN': 'भाषा',
    'zh-CN': '语言',
  },
  'theme.toDark': {
    'en-US': 'Switch to dark theme',
    'es-ES': 'Cambiar a tema oscuro',
    'fr-FR': 'Passer au thème sombre',
    'de-DE': 'Zu dunklem Design wechseln',
    'hi-IN': 'डार्क थीम पर स्विच करें',
    'zh-CN': '切换到深色主题',
  },
  'theme.toLight': {
    'en-US': 'Switch to light theme',
    'es-ES': 'Cambiar a tema claro',
    'fr-FR': 'Passer au thème clair',
    'de-DE': 'Zu hellem Design wechseln',
    'hi-IN': 'लाइट थीम पर स्विच करें',
    'zh-CN': '切换到浅色主题',
  },

  // Status bar
  'status.ready': {
    'en-US': 'Ready',
    'es-ES': 'Listo',
    'fr-FR': 'Prêt',
    'de-DE': 'Bereit',
    'hi-IN': 'तैयार',
    'zh-CN': '就绪',
  },
  'status.listening': {
    'en-US': 'Listening…',
    'es-ES': 'Escuchando…',
    'fr-FR': 'Écoute…',
    'de-DE': 'Hört zu…',
    'hi-IN': 'सुन रहा है…',
    'zh-CN': '正在聆听…',
  },
  'status.thinking': {
    'en-US': 'Thinking…',
    'es-ES': 'Pensando…',
    'fr-FR': 'Réflexion…',
    'de-DE': 'Denkt nach…',
    'hi-IN': 'सोच रहा है…',
    'zh-CN': '正在思考…',
  },
  'status.hint': {
    'en-US': 'Say “add milk” or “find apples under $5”',
    'es-ES': 'Di “añade leche” o “busca manzanas por menos de $5”',
    'fr-FR': 'Dites “ajoute du lait” ou “trouve des pommes à moins de 5 $”',
    'de-DE': 'Sag “Milch hinzufügen” oder “Äpfel unter 5 $ finden”',
    'hi-IN': '“दूध जोड़ें” या “$5 से कम में सेब खोजें” कहें',
    'zh-CN': '说“添加牛奶”或“查找5美元以下的苹果”',
  },

  // Mic button
  'mic.idle': {
    'en-US': 'Tap to speak',
    'es-ES': 'Toca para hablar',
    'fr-FR': 'Appuyez pour parler',
    'de-DE': 'Zum Sprechen tippen',
    'hi-IN': 'बोलने के लिए टैप करें',
    'zh-CN': '点击说话',
  },
  'mic.listening': {
    'en-US': 'Listening… tap to stop',
    'es-ES': 'Escuchando… toca para parar',
    'fr-FR': 'Écoute… appuyez pour arrêter',
    'de-DE': 'Hört zu… zum Stoppen tippen',
    'hi-IN': 'सुन रहा है… रोकने के लिए टैप करें',
    'zh-CN': '正在聆听…点击停止',
  },
  'mic.processing': {
    'en-US': 'Thinking…',
    'es-ES': 'Pensando…',
    'fr-FR': 'Réflexion…',
    'de-DE': 'Denkt nach…',
    'hi-IN': 'सोच रहा है…',
    'zh-CN': '正在思考…',
  },
  'mic.unavailable': {
    'en-US': 'Voice unavailable',
    'es-ES': 'Voz no disponible',
    'fr-FR': 'Voix indisponible',
    'de-DE': 'Sprache nicht verfügbar',
    'hi-IN': 'वॉइस अनुपलब्ध',
    'zh-CN': '语音不可用',
  },

  // Typed input fallback
  'input.placeholderPromoted': {
    'en-US': 'Type a command, e.g. “add 2 apples”',
    'es-ES': 'Escribe un comando, p. ej. “añade 2 manzanas”',
    'fr-FR': 'Tapez une commande, p. ex. “ajoute 2 pommes”',
    'de-DE': 'Befehl eingeben, z. B. “2 Äpfel hinzufügen”',
    'hi-IN': 'कोई कमांड लिखें, जैसे “2 सेब जोड़ें”',
    'zh-CN': '输入命令，例如“添加2个苹果”',
  },
  'input.placeholder': {
    'en-US': 'Or type a command…',
    'es-ES': 'O escribe un comando…',
    'fr-FR': 'Ou tapez une commande…',
    'de-DE': 'Oder Befehl eingeben…',
    'hi-IN': 'या कोई कमांड लिखें…',
    'zh-CN': '或输入命令…',
  },
  'input.formLabel': {
    'en-US': 'Type a command',
    'es-ES': 'Escribe un comando',
    'fr-FR': 'Tapez une commande',
    'de-DE': 'Befehl eingeben',
    'hi-IN': 'कोई कमांड लिखें',
    'zh-CN': '输入命令',
  },
  'input.ariaLabel': {
    'en-US': 'Type a shopping command',
    'es-ES': 'Escribe un comando de compra',
    'fr-FR': 'Tapez une commande d’achat',
    'de-DE': 'Einkaufsbefehl eingeben',
    'hi-IN': 'शॉपिंग कमांड लिखें',
    'zh-CN': '输入购物命令',
  },
  'input.send': {
    'en-US': 'Send command',
    'es-ES': 'Enviar comando',
    'fr-FR': 'Envoyer la commande',
    'de-DE': 'Befehl senden',
    'hi-IN': 'कमांड भेजें',
    'zh-CN': '发送命令',
  },

  // Suggestions
  'suggestions.title': {
    'en-US': 'Suggestions',
    'es-ES': 'Sugerencias',
    'fr-FR': 'Suggestions',
    'de-DE': 'Vorschläge',
    'hi-IN': 'सुझाव',
    'zh-CN': '建议',
  },
  'suggestions.swap': {
    'en-US': 'Swap',
    'es-ES': 'Cambio',
    'fr-FR': 'Alternative',
    'de-DE': 'Ersatz',
    'hi-IN': 'विकल्प',
    'zh-CN': '替换',
  },
  'suggestions.season': {
    'en-US': 'In season',
    'es-ES': 'De temporada',
    'fr-FR': 'De saison',
    'de-DE': 'Saisonal',
    'hi-IN': 'मौसमी',
    'zh-CN': '当季',
  },
  'suggestions.reorder': {
    'en-US': 'Reorder',
    'es-ES': 'Recomprar',
    'fr-FR': 'Racheter',
    'de-DE': 'Nachbestellen',
    'hi-IN': 'फिर से खरीदें',
    'zh-CN': '再次购买',
  },
  'suggestions.addAction': {
    'en-US': '{tag}: add {label}',
    'es-ES': '{tag}: añadir {label}',
    'fr-FR': '{tag} : ajouter {label}',
    'de-DE': '{tag}: {label} hinzufügen',
    'hi-IN': '{tag}: {label} जोड़ें',
    'zh-CN': '{tag}：添加 {label}',
  },

  // Empty state
  'empty.title': {
    'en-US': 'Your list is empty',
    'es-ES': 'Tu lista está vacía',
    'fr-FR': 'Votre liste est vide',
    'de-DE': 'Deine Liste ist leer',
    'hi-IN': 'आपकी सूची खाली है',
    'zh-CN': '您的清单是空的',
  },
  'empty.subtitle': {
    'en-US': 'Tap the mic and speak naturally — or type. Try one of these:',
    'es-ES': 'Toca el micrófono y habla con naturalidad — o escribe. Prueba uno de estos:',
    'fr-FR': 'Appuyez sur le micro et parlez naturellement — ou tapez. Essayez l’un de ceux-ci :',
    'de-DE': 'Tippe auf das Mikrofon und sprich ganz natürlich — oder tippe. Probiere eines davon:',
    'hi-IN': 'माइक पर टैप करें और स्वाभाविक रूप से बोलें — या टाइप करें। इनमें से कोई आज़माएँ:',
    'zh-CN': '点击麦克风自然地说话——或输入。试试这些：',
  },
  'empty.examples': {
    'en-US': ['add 2 bottles of milk', 'add bread and eggs', 'find apples under $5'],
    'es-ES': ['añade 2 botellas de leche', 'añade pan y huevos', 'busca manzanas por menos de $5'],
    'fr-FR': ['ajoute 2 bouteilles de lait', 'ajoute du pain et des œufs', 'trouve des pommes à moins de 5 $'],
    'de-DE': ['2 Flaschen Milch hinzufügen', 'Brot und Eier hinzufügen', 'Äpfel unter 5 $ finden'],
    'hi-IN': ['दूध की 2 बोतलें जोड़ें', 'ब्रेड और अंडे जोड़ें', '$5 से कम में सेब खोजें'],
    'zh-CN': ['添加2瓶牛奶', '添加面包和鸡蛋', '查找5美元以下的苹果'],
  },

  // Shopping list
  'list.itemsOne': {
    'en-US': '{count} item',
    'es-ES': '{count} artículo',
    'fr-FR': '{count} article',
    'de-DE': '{count} Artikel',
    'hi-IN': '{count} आइटम',
    'zh-CN': '{count} 件商品',
  },
  'list.itemsOther': {
    'en-US': '{count} items',
    'es-ES': '{count} artículos',
    'fr-FR': '{count} articles',
    'de-DE': '{count} Artikel',
    'hi-IN': '{count} आइटम',
    'zh-CN': '{count} 件商品',
  },
  'list.done': {
    'en-US': '{count} done',
    'es-ES': '{count} hechos',
    'fr-FR': '{count} terminés',
    'de-DE': '{count} erledigt',
    'hi-IN': '{count} पूर्ण',
    'zh-CN': '已完成 {count}',
  },
  'list.clear': {
    'en-US': 'Clear',
    'es-ES': 'Vaciar',
    'fr-FR': 'Vider',
    'de-DE': 'Leeren',
    'hi-IN': 'साफ़ करें',
    'zh-CN': '清空',
  },
  'list.confirmClear': {
    'en-US': 'Clear your whole list?',
    'es-ES': '¿Vaciar toda tu lista?',
    'fr-FR': 'Vider toute votre liste ?',
    'de-DE': 'Ganze Liste leeren?',
    'hi-IN': 'क्या आपकी पूरी सूची साफ़ करें?',
    'zh-CN': '清空整个清单？',
  },

  // Search results
  'search.resultsFor': {
    'en-US': 'Results for “{label}”',
    'es-ES': 'Resultados para “{label}”',
    'fr-FR': 'Résultats pour “{label}”',
    'de-DE': 'Ergebnisse für “{label}”',
    'hi-IN': '“{label}” के परिणाम',
    'zh-CN': '“{label}”的结果',
  },
  'search.under': {
    'en-US': 'under {price}',
    'es-ES': 'por menos de {price}',
    'fr-FR': 'à moins de {price}',
    'de-DE': 'unter {price}',
    'hi-IN': '{price} से कम',
    'zh-CN': '{price} 以下',
  },
  'search.noMatches': {
    'en-US': 'No matches for “{label}”',
    'es-ES': 'Sin resultados para “{label}”',
    'fr-FR': 'Aucun résultat pour “{label}”',
    'de-DE': 'Keine Treffer für “{label}”',
    'hi-IN': '“{label}” के लिए कोई मिलान नहीं',
    'zh-CN': '没有“{label}”的匹配项',
  },
  'search.tryOther': {
    'en-US': 'Try a different term, brand, or price.',
    'es-ES': 'Prueba con otro término, marca o precio.',
    'fr-FR': 'Essayez un autre terme, une autre marque ou un autre prix.',
    'de-DE': 'Versuche einen anderen Begriff, eine andere Marke oder einen anderen Preis.',
    'hi-IN': 'कोई अलग शब्द, ब्रांड या कीमत आज़माएँ।',
    'zh-CN': '尝试其他词语、品牌或价格。',
  },
  'search.add': {
    'en-US': 'Add',
    'es-ES': 'Añadir',
    'fr-FR': 'Ajouter',
    'de-DE': 'Hinzufügen',
    'hi-IN': 'जोड़ें',
    'zh-CN': '添加',
  },
  'search.close': {
    'en-US': 'Close search',
    'es-ES': 'Cerrar búsqueda',
    'fr-FR': 'Fermer la recherche',
    'de-DE': 'Suche schließen',
    'hi-IN': 'खोज बंद करें',
    'zh-CN': '关闭搜索',
  },
  'search.addAria': {
    'en-US': 'Add {name} to list',
    'es-ES': 'Añadir {name} a la lista',
    'fr-FR': 'Ajouter {name} à la liste',
    'de-DE': '{name} zur Liste hinzufügen',
    'hi-IN': '{name} को सूची में जोड़ें',
    'zh-CN': '将 {name} 添加到清单',
  },
  'search.itemsFallback': {
    'en-US': 'items',
    'es-ES': 'artículos',
    'fr-FR': 'articles',
    'de-DE': 'Artikel',
    'hi-IN': 'आइटम',
    'zh-CN': '商品',
  },

  // List row (aria-labels)
  'row.markBought': {
    'en-US': 'Mark {name} as bought',
    'es-ES': 'Marcar {name} como comprado',
    'fr-FR': 'Marquer {name} comme acheté',
    'de-DE': '{name} als gekauft markieren',
    'hi-IN': '{name} को खरीदा हुआ चिह्नित करें',
    'zh-CN': '将 {name} 标记为已购买',
  },
  'row.markNotBought': {
    'en-US': 'Mark {name} as not bought',
    'es-ES': 'Marcar {name} como no comprado',
    'fr-FR': 'Marquer {name} comme non acheté',
    'de-DE': '{name} als nicht gekauft markieren',
    'hi-IN': '{name} को नहीं खरीदा हुआ चिह्नित करें',
    'zh-CN': '将 {name} 标记为未购买',
  },
  'row.decrease': {
    'en-US': 'Decrease {name} quantity',
    'es-ES': 'Disminuir cantidad de {name}',
    'fr-FR': 'Diminuer la quantité de {name}',
    'de-DE': 'Menge von {name} verringern',
    'hi-IN': '{name} की मात्रा घटाएँ',
    'zh-CN': '减少 {name} 的数量',
  },
  'row.increase': {
    'en-US': 'Increase {name} quantity',
    'es-ES': 'Aumentar cantidad de {name}',
    'fr-FR': 'Augmenter la quantité de {name}',
    'de-DE': 'Menge von {name} erhöhen',
    'hi-IN': '{name} की मात्रा बढ़ाएँ',
    'zh-CN': '增加 {name} 的数量',
  },
  'row.quantity': {
    'en-US': 'Quantity {qty}',
    'es-ES': 'Cantidad {qty}',
    'fr-FR': 'Quantité {qty}',
    'de-DE': 'Menge {qty}',
    'hi-IN': 'मात्रा {qty}',
    'zh-CN': '数量 {qty}',
  },
  'row.delete': {
    'en-US': 'Delete {name}',
    'es-ES': 'Eliminar {name}',
    'fr-FR': 'Supprimer {name}',
    'de-DE': '{name} löschen',
    'hi-IN': '{name} हटाएँ',
    'zh-CN': '删除 {name}',
  },

  // Toasts + voice errors
  'toast.added': {
    'en-US': 'Added {name}',
    'es-ES': 'Añadido {name}',
    'fr-FR': '{name} ajouté',
    'de-DE': '{name} hinzugefügt',
    'hi-IN': '{name} जोड़ा गया',
    'zh-CN': '已添加 {name}',
  },
  'error.micBlocked': {
    'en-US': 'Microphone blocked — allow it in your browser, or just type below.',
    'es-ES': 'Micrófono bloqueado — permítelo en tu navegador o simplemente escribe abajo.',
    'fr-FR': 'Micro bloqué — autorisez-le dans votre navigateur, ou tapez ci-dessous.',
    'de-DE': 'Mikrofon blockiert — erlaube es im Browser oder tippe einfach unten.',
    'hi-IN': 'माइक्रोफ़ोन अवरुद्ध — इसे अपने ब्राउज़र में अनुमति दें, या नीचे टाइप करें।',
    'zh-CN': '麦克风被阻止——请在浏览器中允许，或直接在下方输入。',
  },
  'error.noMic': {
    'en-US': 'No microphone found — type your command instead.',
    'es-ES': 'No se encontró micrófono — escribe tu comando.',
    'fr-FR': 'Aucun micro détecté — tapez votre commande à la place.',
    'de-DE': 'Kein Mikrofon gefunden — gib deinen Befehl stattdessen ein.',
    'hi-IN': 'कोई माइक्रोफ़ोन नहीं मिला — इसके बजाय अपना कमांड टाइप करें।',
    'zh-CN': '未找到麦克风——请改为输入命令。',
  },
  'error.generic': {
    'en-US': 'Voice error — please try again, or type below.',
    'es-ES': 'Error de voz — inténtalo de nuevo o escribe abajo.',
    'fr-FR': 'Erreur vocale — réessayez ou tapez ci-dessous.',
    'de-DE': 'Sprachfehler — bitte erneut versuchen oder unten tippen.',
    'hi-IN': 'वॉइस त्रुटि — कृपया पुनः प्रयास करें, या नीचे टाइप करें।',
    'zh-CN': '语音错误——请重试，或在下方输入。',
  },
  // The recognizer never started: a browser that exposes the API without
  // implementing it (common in in-app and non-Safari iOS browsers).
  'error.voiceNoStart': {
    'en-US': 'Voice didn’t start — this browser may not support it. Type below instead.',
    'es-ES': 'La voz no se inició — este navegador puede no admitirla. Escribe abajo.',
    'fr-FR': 'La voix n’a pas démarré — ce navigateur ne la prend peut-être pas en charge. Tapez ci-dessous.',
    'de-DE': 'Sprache startete nicht — dieser Browser unterstützt sie möglicherweise nicht. Tippe unten.',
    'hi-IN': 'वॉइस शुरू नहीं हुई — यह ब्राउज़र इसका समर्थन नहीं कर सकता। नीचे टाइप करें।',
    'zh-CN': '语音未启动——此浏览器可能不支持。请在下方输入。',
  },
  // Session opened and closed without a transcript — silence, a muted mic, or a
  // phone that handed the audio elsewhere. A nudge, not a failure.
  'hint.noSpeech': {
    'en-US': 'Didn’t hear anything — tap the mic and speak, or type below.',
    'es-ES': 'No se escuchó nada — toca el micrófono y habla, o escribe abajo.',
    'fr-FR': 'Rien entendu — appuyez sur le micro et parlez, ou tapez ci-dessous.',
    'de-DE': 'Nichts gehört — tippe auf das Mikrofon und sprich, oder tippe unten.',
    'hi-IN': 'कुछ सुनाई नहीं दिया — माइक पर टैप करके बोलें, या नीचे टाइप करें।',
    'zh-CN': '没有听到声音——点击麦克风说话，或在下方输入。',
  },

  // Shown by <ErrorBoundary> when a render throws. The app can't recover in
  // place, so the only action offered is a reload — the list itself survives
  // in localStorage, which is worth saying so the user doesn't fear losing it.
  'error.crashTitle': {
    'en-US': 'Something broke',
    'es-ES': 'Algo se rompió',
    'fr-FR': 'Une erreur est survenue',
    'de-DE': 'Etwas ist kaputtgegangen',
    'hi-IN': 'कुछ टूट गया',
    'zh-CN': '出现故障',
  },
  'error.crashBody': {
    'en-US': 'The app hit an unexpected error. Your shopping list is safe — reloading should fix it.',
    'es-ES': 'La app encontró un error inesperado. Tu lista de compras está a salvo — recargar debería solucionarlo.',
    'fr-FR': 'L’application a rencontré une erreur inattendue. Votre liste de courses est intacte — un rechargement devrait résoudre le problème.',
    'de-DE': 'In der App ist ein unerwarteter Fehler aufgetreten. Deine Einkaufsliste ist sicher — ein Neuladen sollte helfen.',
    'hi-IN': 'ऐप में एक अनपेक्षित त्रुटि आई। आपकी शॉपिंग सूची सुरक्षित है — रीलोड करने से ठीक हो जाना चाहिए।',
    'zh-CN': '应用遇到意外错误。您的购物清单是安全的——重新加载应该可以解决问题。',
  },
  'error.crashReload': {
    'en-US': 'Reload the app',
    'es-ES': 'Recargar la app',
    'fr-FR': 'Recharger l’application',
    'de-DE': 'App neu laden',
    'hi-IN': 'ऐप रीलोड करें',
    'zh-CN': '重新加载应用',
  },

  // Command feedback (describeCommand / useCommandRunner) — {name} may carry a
  // quantity/unit prefix; item names themselves are user data, not translated.
  'cmd.removed': {
    'en-US': 'Removed {name}',
    'es-ES': 'Eliminado {name}',
    'fr-FR': '{name} supprimé',
    'de-DE': '{name} entfernt',
    'hi-IN': '{name} हटाया गया',
    'zh-CN': '已移除 {name}',
  },
  'cmd.notOnList': {
    'en-US': '“{name}” wasn’t on your list',
    'es-ES': '“{name}” no estaba en tu lista',
    'fr-FR': '“{name}” n’était pas dans votre liste',
    'de-DE': '“{name}” war nicht auf deiner Liste',
    'hi-IN': '“{name}” आपकी सूची में नहीं था',
    'zh-CN': '“{name}”不在您的清单中',
  },
  'cmd.updated': {
    'en-US': 'Updated {name} to {qty}',
    'es-ES': '{name} actualizado a {qty}',
    'fr-FR': '{name} mis à jour à {qty}',
    'de-DE': '{name} auf {qty} aktualisiert',
    'hi-IN': '{name} को {qty} किया गया',
    'zh-CN': '已将 {name} 更新为 {qty}',
  },
  'cmd.notOnListYet': {
    'en-US': '“{name}” isn’t on your list yet',
    'es-ES': '“{name}” aún no está en tu lista',
    'fr-FR': '“{name}” n’est pas encore dans votre liste',
    'de-DE': '“{name}” ist noch nicht auf deiner Liste',
    'hi-IN': '“{name}” अभी आपकी सूची में नहीं है',
    'zh-CN': '“{name}”还不在您的清单中',
  },
  'cmd.cleared': {
    'en-US': 'Cleared your list',
    'es-ES': 'Lista vaciada',
    'fr-FR': 'Liste vidée',
    'de-DE': 'Liste geleert',
    'hi-IN': 'आपकी सूची साफ़ कर दी गई',
    'zh-CN': '已清空您的清单',
  },
  'cmd.foundOne': {
    'en-US': 'Found {count} result for “{label}”',
    'es-ES': '{count} resultado para “{label}”',
    'fr-FR': '{count} résultat pour “{label}”',
    'de-DE': '{count} Ergebnis für “{label}”',
    'hi-IN': '“{label}” के लिए {count} परिणाम मिला',
    'zh-CN': '找到 {count} 个“{label}”的结果',
  },
  'cmd.foundOther': {
    'en-US': 'Found {count} results for “{label}”',
    'es-ES': '{count} resultados para “{label}”',
    'fr-FR': '{count} résultats pour “{label}”',
    'de-DE': '{count} Ergebnisse für “{label}”',
    'hi-IN': '“{label}” के लिए {count} परिणाम मिले',
    'zh-CN': '找到 {count} 个“{label}”的结果',
  },
  'cmd.unknown': {
    'en-US': 'I didn’t catch that — try “add milk” or “remove bread”.',
    'es-ES': 'No entendí eso — prueba “añade leche” o “elimina pan”.',
    'fr-FR': 'Je n’ai pas compris — essayez “ajoute du lait” ou “retire du pain”.',
    'de-DE': 'Das habe ich nicht verstanden — versuche “Milch hinzufügen” oder “Brot entfernen”.',
    'hi-IN': 'मैं समझ नहीं पाया — “दूध जोड़ें” या “ब्रेड हटाएँ” आज़माएँ।',
    'zh-CN': '我没听清——试试“添加牛奶”或“移除面包”。',
  },
  'cmd.error': {
    'en-US': 'Something went wrong — please try again.',
    'es-ES': 'Algo salió mal — inténtalo de nuevo.',
    'fr-FR': 'Une erreur s’est produite — veuillez réessayer.',
    'de-DE': 'Etwas ist schiefgelaufen — bitte versuche es erneut.',
    'hi-IN': 'कुछ गलत हो गया — कृपया पुनः प्रयास करें।',
    'zh-CN': '出了点问题——请重试。',
  },

  // Category headers (keys mirror CATEGORIES in services/command.js)
  'category.produce': {
    'en-US': 'Produce',
    'es-ES': 'Frutas y verduras',
    'fr-FR': 'Fruits et légumes',
    'de-DE': 'Obst & Gemüse',
    'hi-IN': 'फल और सब्ज़ियाँ',
    'zh-CN': '果蔬',
  },
  'category.dairy': {
    'en-US': 'Dairy',
    'es-ES': 'Lácteos',
    'fr-FR': 'Produits laitiers',
    'de-DE': 'Milchprodukte',
    'hi-IN': 'डेयरी',
    'zh-CN': '乳制品',
  },
  'category.bakery': {
    'en-US': 'Bakery',
    'es-ES': 'Panadería',
    'fr-FR': 'Boulangerie',
    'de-DE': 'Backwaren',
    'hi-IN': 'बेकरी',
    'zh-CN': '烘焙食品',
  },
  'category.meat': {
    'en-US': 'Meat',
    'es-ES': 'Carne',
    'fr-FR': 'Viande',
    'de-DE': 'Fleisch',
    'hi-IN': 'मांस',
    'zh-CN': '肉类',
  },
  'category.seafood': {
    'en-US': 'Seafood',
    'es-ES': 'Mariscos',
    'fr-FR': 'Fruits de mer',
    'de-DE': 'Meeresfrüchte',
    'hi-IN': 'समुद्री भोजन',
    'zh-CN': '海鲜',
  },
  'category.frozen': {
    'en-US': 'Frozen',
    'es-ES': 'Congelados',
    'fr-FR': 'Surgelés',
    'de-DE': 'Tiefkühl',
    'hi-IN': 'फ्रोज़न',
    'zh-CN': '冷冻食品',
  },
  'category.pantry': {
    'en-US': 'Pantry',
    'es-ES': 'Despensa',
    'fr-FR': 'Épicerie',
    'de-DE': 'Vorratskammer',
    'hi-IN': 'पैंट्री',
    'zh-CN': '食品储藏',
  },
  'category.snacks': {
    'en-US': 'Snacks',
    'es-ES': 'Aperitivos',
    'fr-FR': 'En-cas',
    'de-DE': 'Snacks',
    'hi-IN': 'स्नैक्स',
    'zh-CN': '零食',
  },
  'category.beverages': {
    'en-US': 'Beverages',
    'es-ES': 'Bebidas',
    'fr-FR': 'Boissons',
    'de-DE': 'Getränke',
    'hi-IN': 'पेय पदार्थ',
    'zh-CN': '饮料',
  },
  'category.household': {
    'en-US': 'Household',
    'es-ES': 'Hogar',
    'fr-FR': 'Maison',
    'de-DE': 'Haushalt',
    'hi-IN': 'घरेलू सामान',
    'zh-CN': '家居用品',
  },
  'category.personal-care': {
    'en-US': 'Personal Care',
    'es-ES': 'Cuidado personal',
    'fr-FR': 'Soins personnels',
    'de-DE': 'Körperpflege',
    'hi-IN': 'व्यक्तिगत देखभाल',
    'zh-CN': '个人护理',
  },
  'category.other': {
    'en-US': 'Other',
    'es-ES': 'Otros',
    'fr-FR': 'Autres',
    'de-DE': 'Sonstiges',
    'hi-IN': 'अन्य',
    'zh-CN': '其他',
  },
}

/** All translation keys — used by tests to assert full language coverage. */
export const STRING_KEYS = Object.keys(S)

/** Languages that actually define a value for `key` (test/diagnostic helper). */
export const langsFor = (key) => (S[key] ? Object.keys(S[key]) : [])

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
}

/**
 * Translate `key` into `lang`, interpolating `{var}` placeholders from `vars`.
 * Falls back to DEFAULT_LANG for a missing language, and returns the key itself
 * if it's unknown (so a typo is visible rather than silently blank).
 *
 * @param {string} key   dot-namespaced string key
 * @param {string} lang  BCP-47 code (one of SUPPORTED_LANGS)
 * @param {object} [vars] interpolation values
 * @returns {string|string[]} the translated string, or an array for list keys
 */
export function t(key, lang, vars) {
  const entry = S[key]
  if (!entry) return key
  const val = entry[lang] ?? entry[DEFAULT_LANG]
  if (Array.isArray(val)) return val.map((v) => interpolate(v, vars))
  return interpolate(val, vars)
}

/** Base language subtag ("es" from "es-ES") — for the <html lang> attribute. */
export const baseLang = (lang) => (lang || DEFAULT_LANG).split('-')[0]
