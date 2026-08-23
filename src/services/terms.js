import { fold } from '../utils/text.js'
import { baseLang, DEFAULT_LANG, SUPPORTED_LANGS } from '../i18n/strings.js'

export const TERMS = {
  // substitutes keys
  milk: { 'en-US': 'milk', 'es-ES': 'leche', 'fr-FR': 'lait', 'de-DE': 'Milch', 'hi-IN': 'दूध', 'zh-CN': '牛奶' },
  butter: { 'en-US': 'butter', 'es-ES': 'mantequilla', 'fr-FR': 'beurre', 'de-DE': 'Butter', 'hi-IN': 'मक्खन', 'zh-CN': '黄油' },
  sugar: { 'en-US': 'sugar', 'es-ES': 'azúcar', 'fr-FR': 'sucre', 'de-DE': 'Zucker', 'hi-IN': 'चीनी', 'zh-CN': '糖' },
  bread: { 'en-US': 'bread', 'es-ES': 'pan', 'fr-FR': 'pain', 'de-DE': 'Brot', 'hi-IN': 'ब्रेड', 'zh-CN': '面包' },
  rice: { 'en-US': 'rice', 'es-ES': 'arroz', 'fr-FR': 'riz', 'de-DE': 'Reis', 'hi-IN': 'चावल', 'zh-CN': '米饭' },
  pasta: { 'en-US': 'pasta', 'es-ES': 'pasta', 'fr-FR': 'pâtes', 'de-DE': 'Nudeln', 'hi-IN': 'पास्ता', 'zh-CN': '意式面食' },
  flour: { 'en-US': 'flour', 'es-ES': 'harina', 'fr-FR': 'farine', 'de-DE': 'Mehl', 'hi-IN': 'आटा', 'zh-CN': '面粉' },
  cream: { 'en-US': 'cream', 'es-ES': 'crema', 'fr-FR': 'crème', 'de-DE': 'Sahne', 'hi-IN': 'क्रीम', 'zh-CN': '奶油' },
  cheese: { 'en-US': 'cheese', 'es-ES': 'queso', 'fr-FR': 'fromage', 'de-DE': 'Käse', 'hi-IN': 'चीज़', 'zh-CN': '奶酪' },
  eggs: { 'en-US': 'eggs', 'es-ES': 'huevos', 'fr-FR': 'œufs', 'de-DE': 'Eier', 'hi-IN': 'अंडे', 'zh-CN': '鸡蛋' },
  chicken: { 'en-US': 'chicken', 'es-ES': 'pollo', 'fr-FR': 'poulet', 'de-DE': 'Hühnchen', 'hi-IN': 'चिकन', 'zh-CN': '鸡肉' },
  beef: { 'en-US': 'beef', 'es-ES': 'ternera', 'fr-FR': 'bœuf', 'de-DE': 'Rindfleisch', 'hi-IN': 'गोमांस', 'zh-CN': '牛肉' },
  soda: { 'en-US': 'soda', 'es-ES': 'refresco', 'fr-FR': 'soda', 'de-DE': 'Limonade', 'hi-IN': 'सोडा', 'zh-CN': '苏打水' },
  chips: { 'en-US': 'chips', 'es-ES': 'patatas fritas', 'fr-FR': 'chips', 'de-DE': 'Chips', 'hi-IN': 'चिप्स', 'zh-CN': '薯片' },
  coffee: { 'en-US': 'coffee', 'es-ES': 'café', 'fr-FR': 'café', 'de-DE': 'Kaffee', 'hi-IN': 'कॉफ़ी', 'zh-CN': '咖啡' },
  yogurt: { 'en-US': 'yogurt', 'es-ES': 'yogur', 'fr-FR': 'yaourt', 'de-DE': 'Joghurt', 'hi-IN': 'दही', 'zh-CN': '酸奶' },
  mayonnaise: { 'en-US': 'mayonnaise', 'es-ES': 'mayonesa', 'fr-FR': 'mayonnaise', 'de-DE': 'Mayonnaise', 'hi-IN': 'मेयोनेज़', 'zh-CN': '美乃滋' },
  salt: { 'en-US': 'salt', 'es-ES': 'sal', 'fr-FR': 'sel', 'de-DE': 'Salz', 'hi-IN': 'नमक', 'zh-CN': '盐' },
  'orange juice': { 'en-US': 'orange juice', 'es-ES': 'zumo de naranja', 'fr-FR': 'jus d\'orange', 'de-DE': 'Orangensaft', 'hi-IN': 'संतरे का रस', 'zh-CN': '橙汁' },
  'ice cream': { 'en-US': 'ice cream', 'es-ES': 'helado', 'fr-FR': 'glace', 'de-DE': 'Eis', 'hi-IN': 'आइसक्रीम', 'zh-CN': '冰淇淋' },

  // substitutes values
  'oat milk': { 'en-US': 'oat milk', 'es-ES': 'leche de avena', 'fr-FR': 'lait d\'avoine', 'de-DE': 'Hafermilch', 'hi-IN': 'ओट्स का दूध', 'zh-CN': '燕麦奶' },
  'almond milk': { 'en-US': 'almond milk', 'es-ES': 'leche de almendras', 'fr-FR': 'lait d\'amande', 'de-DE': 'Mandelmilch', 'hi-IN': 'बादाम का दूध', 'zh-CN': '杏仁奶' },
  'soy milk': { 'en-US': 'soy milk', 'es-ES': 'leche de soja', 'fr-FR': 'lait de soja', 'de-DE': 'Sojamilch', 'hi-IN': 'सोया दूध', 'zh-CN': '豆奶' },
  margarine: { 'en-US': 'margarine', 'es-ES': 'margarina', 'fr-FR': 'margarine', 'de-DE': 'Margarine', 'hi-IN': 'मार्जरीन', 'zh-CN': '人造黄油' },
  'olive oil': { 'en-US': 'olive oil', 'es-ES': 'aceite de oliva', 'fr-FR': 'huile d\'olive', 'de-DE': 'Olivenöl', 'hi-IN': 'जैतून का तेल', 'zh-CN': '橄榄油' },
  honey: { 'en-US': 'honey', 'es-ES': 'miel', 'fr-FR': 'miel', 'de-DE': 'Honig', 'hi-IN': 'शहद', 'zh-CN': '蜂蜜' },
  jaggery: { 'en-US': 'jaggery', 'es-ES': 'jaggery', 'fr-FR': 'jaggery', 'de-DE': 'Jaggery', 'hi-IN': 'गुड़', 'zh-CN': '粗糖' },
  'maple syrup': { 'en-US': 'maple syrup', 'es-ES': 'jarabe de arce', 'fr-FR': 'sirop d\'érable', 'de-DE': 'Ahornsirup', 'hi-IN': 'मेपल सिरप', 'zh-CN': '枫糖浆' },
  'whole wheat bread': { 'en-US': 'whole wheat bread', 'es-ES': 'pan de trigo integral', 'fr-FR': 'pain complet', 'de-DE': 'Vollkornbrot', 'hi-IN': 'व्हीट ब्रेड', 'zh-CN': '全麦面包' },
  'multigrain bread': { 'en-US': 'multigrain bread', 'es-ES': 'pan multigrano', 'fr-FR': 'pain multicéréales', 'de-DE': 'Mehrkornbrot', 'hi-IN': 'मल्टीग्रेन ब्रेड', 'zh-CN': '杂粮面包' },
  sourdough: { 'en-US': 'sourdough', 'es-ES': 'masa madre', 'fr-FR': 'pain au levain', 'de-DE': 'Sauerteig', 'hi-IN': 'खमीर वाली ब्रेड', 'zh-CN': '酸面包' },
  'brown rice': { 'en-US': 'brown rice', 'es-ES': 'arroz integral', 'fr-FR': 'riz complet', 'de-DE': 'brauner Reis', 'hi-IN': 'भूरा चावल', 'zh-CN': '糙米' },
  quinoa: { 'en-US': 'quinoa', 'es-ES': 'quinoa', 'fr-FR': 'quinoa', 'de-DE': 'Quinoa', 'hi-IN': 'क्विनोआ', 'zh-CN': '藜麦' },
  'whole wheat pasta': { 'en-US': 'whole wheat pasta', 'es-ES': 'pasta de trigo integral', 'fr-FR': 'pâtes complètes', 'de-DE': 'Vollkornnudeln', 'hi-IN': 'व्हीट पास्ता', 'zh-CN': '全麦意面' },
  'rice noodles': { 'en-US': 'rice noodles', 'es-ES': 'fideos de arroz', 'fr-FR': 'nouilles de arroz', 'de-DE': 'Reisnudeln', 'hi-IN': 'राइस नूडल्स', 'zh-CN': '米粉' },
  'almond flour': { 'en-US': 'almond flour', 'es-ES': 'harina de almendra', 'fr-FR': 'farine d\'amande', 'de-DE': 'Mandelmehl', 'hi-IN': 'बादाम का आटा', 'zh-CN': '杏仁粉' },
  'whole wheat flour': { 'en-US': 'whole wheat flour', 'es-ES': 'harina de trigo integral', 'fr-FR': 'farine de blé complet', 'de-DE': 'Vollkornmehl', 'hi-IN': 'गेहूं का आटा', 'zh-CN': '全麦面粉' },
  'coconut cream': { 'en-US': 'coconut cream', 'es-ES': 'crema de coco', 'fr-FR': 'crème de coco', 'de-DE': 'Kokoscreme', 'hi-IN': 'नारियल की क्रीम', 'zh-CN': '椰子奶油' },
  'vegan cheese': { 'en-US': 'vegan cheese', 'es-ES': 'queso vegano', 'fr-FR': 'fromage végétalien', 'de-DE': 'veganer Käse', 'hi-IN': 'वेगन पनीर', 'zh-CN': '素奶酪' },
  'cottage cheese': { 'en-US': 'cottage cheese', 'es-ES': 'requesón', 'fr-FR': 'fromage cottage', 'de-DE': 'Hüttenkäse', 'hi-IN': 'कुटीर पनीर', 'zh-CN': '茅屋奶酪' },
  'egg substitute': { 'en-US': 'egg substitute', 'es-ES': 'sustituto de huevo', 'fr-FR': 'substitut d\'œuf', 'de-DE': 'Eiersatz', 'hi-IN': 'अंडे का विकल्प', 'zh-CN': '代鸡蛋' },
  tofu: { 'en-US': 'tofu', 'es-ES': 'tofu', 'fr-FR': 'tofu', 'de-DE': 'Tofu', 'hi-IN': 'टोफू', 'zh-CN': '豆腐' },
  paneer: { 'en-US': 'paneer', 'es-ES': 'paneer', 'fr-FR': 'paneer', 'de-DE': 'Paneer', 'hi-IN': 'पनीर', 'zh-CN': '印度奶酪' },
  chickpeas: { 'en-US': 'chickpeas', 'es-ES': 'garbanzos', 'fr-FR': 'pois chiches', 'de-DE': 'Kichererbsen', 'hi-IN': 'चने', 'zh-CN': '鹰嘴豆' },
  mushrooms: { 'en-US': 'mushrooms', 'es-ES': 'champiñones', 'fr-FR': 'champignons', 'de-DE': 'Pilze', 'hi-IN': 'मशरूम', 'zh-CN': '蘑菇' },
  lentils: { 'en-US': 'lentils', 'es-ES': 'lentejas', 'fr-FR': 'lentilles', 'de-DE': 'Linsen', 'hi-IN': 'दाल', 'zh-CN': '扁豆' },
  kombucha: { 'en-US': 'kombucha', 'es-ES': 'kombucha', 'fr-FR': 'kombucha', 'de-DE': 'Kombucha', 'hi-IN': 'कोम्बुचा', 'zh-CN': '康普茶' },
  popcorn: { 'en-US': 'popcorn', 'es-ES': 'palomitas de maíz', 'fr-FR': 'pop-corn', 'de-DE': 'Popcorn', 'hi-IN': 'पॉपकॉर्न', 'zh-CN': '爆米花' },
  'trail mix': { 'en-US': 'trail mix', 'es-ES': 'mezcla de frutos secos', 'fr-FR': 'mélange du randonneur', 'de-DE': 'Studentenfutter', 'hi-IN': 'ट्रेल मिक्स', 'zh-CN': '坚果杂烩' },
  matcha: { 'en-US': 'matcha', 'es-ES': 'matcha', 'fr-FR': 'matcha', 'de-DE': 'Matcha', 'hi-IN': 'माचा', 'zh-CN': '抹茶' },
  'coconut yogurt': { 'en-US': 'coconut yogurt', 'es-ES': 'yogur de coco', 'fr-FR': 'yaourt de coco', 'de-DE': 'Kokosjoghurt', 'hi-IN': 'नारियल का दही', 'zh-CN': '椰子酸奶' },
  hummus: { 'en-US': 'hummus', 'es-ES': 'hummus', 'fr-FR': 'houmous', 'de-DE': 'Hummus', 'hi-IN': 'हम्मस', 'zh-CN': '鹰嘴豆泥' },
  'low-sodium salt': { 'en-US': 'low-sodium salt', 'es-ES': 'sal baja en sodio', 'fr-FR': 'sel à faible teneur en sodium', 'de-DE': 'natriumarmes Salz', 'hi-IN': 'कम सोडियम वाला नमक', 'zh-CN': '低钠盐' },
  'fresh oranges': { 'en-US': 'fresh oranges', 'es-ES': 'naranjas frescas', 'fr-FR': 'oranges fraîches', 'de-DE': 'frische Orangen', 'hi-IN': 'ताजे संतरे', 'zh-CN': '新鲜橙子' },
  'grapefruit juice': { 'en-US': 'grapefruit juice', 'es-ES': 'zumo de pomelo', 'fr-FR': 'jus de pamplemousse', 'de-DE': 'Greipfruitsaft', 'hi-IN': 'चकोतरे का रस', 'zh-CN': '葡萄柚汁' },
  'frozen yogurt': { 'en-US': 'frozen yogurt', 'es-ES': 'yogur helado', 'fr-FR': 'yaourt glacé', 'de-DE': 'Frozen Yogurt', 'hi-IN': 'फ्रोजन योगर्ट', 'zh-CN': '冻酸奶' },
  sorbet: { 'en-US': 'sorbet', 'es-ES': 'sorbete', 'fr-FR': 'sorbet', 'de-DE': 'Sorbet', 'hi-IN': 'शर्बत', 'zh-CN': '雪葩' },

  // seasonal values
  oranges: { 'en-US': 'oranges', 'es-ES': 'naranjas', 'fr-FR': 'oranges', 'de-DE': 'Orangen', 'hi-IN': 'संतरे', 'zh-CN': '橙子' },
  kale: { 'en-US': 'kale', 'es-ES': 'col rizada', 'fr-FR': 'chou frisé', 'de-DE': 'Grünkohl', 'hi-IN': 'केल', 'zh-CN': '羽衣甘蓝' },
  grapefruit: { 'en-US': 'grapefruit', 'es-ES': 'pomelo', 'fr-FR': 'pamplemousse', 'de-DE': 'Grapefruit', 'hi-IN': 'चकोतरा', 'zh-CN': '葡萄柚' },
  leeks: { 'en-US': 'leeks', 'es-ES': 'puerros', 'fr-FR': 'poireaux', 'de-DE': 'Lauch', 'hi-IN': 'लीक', 'zh-CN': '韭葱' },
  pomegranate: { 'en-US': 'pomegranate', 'es-ES': 'granada', 'fr-FR': 'grenade', 'de-DE': 'Granatapfel', 'hi-IN': 'अनार', 'zh-CN': '石榴' },
  cabbage: { 'en-US': 'cabbage', 'es-ES': 'col', 'fr-FR': 'chou', 'de-DE': 'Kohl', 'hi-IN': 'पत्तागोभी', 'zh-CN': '包菜' },
  broccoli: { 'en-US': 'broccoli', 'es-ES': 'brócoli', 'fr-FR': 'brocoli', 'de-DE': 'Brokkoli', 'hi-IN': 'ब्रोकली', 'zh-CN': '西兰花' },
  kiwi: { 'en-US': 'kiwi', 'es-ES': 'kiwi', 'fr-FR': 'kiwi', 'de-DE': 'Kiwi', 'hi-IN': 'कीवी', 'zh-CN': '猕猴桃' },
  lemons: { 'en-US': 'lemons', 'es-ES': 'limones', 'fr-FR': 'citrons', 'de-DE': 'Zitronen', 'hi-IN': 'नींबू', 'zh-CN': '柠檬' },
  spinach: { 'en-US': 'spinach', 'es-ES': 'espinacas', 'fr-FR': 'épinards', 'de-DE': 'Spinat', 'hi-IN': 'पालक', 'zh-CN': '菠菜' },
  asparagus: { 'en-US': 'asparagus', 'es-ES': 'espárragos', 'fr-FR': 'asperges', 'de-DE': 'Spargel', 'hi-IN': 'एस्परैगस', 'zh-CN': '芦笋' },
  peas: { 'en-US': 'peas', 'es-ES': 'guisantes', 'fr-FR': 'petits pois', 'de-DE': 'Erbsen', 'hi-IN': 'मटर', 'zh-CN': '豌豆' },
  artichoke: { 'en-US': 'artichoke', 'es-ES': 'alcachofa', 'fr-FR': 'artichaut', 'de-DE': 'Artischocke', 'hi-IN': 'हाथीचक्र', 'zh-CN': '朝鲜蓟' },
  'spring onions': { 'en-US': 'spring onions', 'es-ES': 'cebolletas', 'fr-FR': 'oignons nouveaux', 'de-DE': 'Frühlingszwiebeln', 'hi-IN': 'हरा प्याज', 'zh-CN': '小葱' },
  strawberries: { 'en-US': 'strawberries', 'es-ES': 'fresas', 'fr-FR': 'fraises', 'de-DE': 'Erdbeeren', 'hi-IN': 'स्ट्रॉबेरी', 'zh-CN': '草莓' },
  radish: { 'en-US': 'radish', 'es-ES': 'rábano', 'fr-FR': 'radis', 'de-DE': 'Radieschen', 'hi-IN': 'मूली', 'zh-CN': '萝卜' },
  rhubarb: { 'en-US': 'rhubarb', 'es-ES': 'ruibarbo', 'fr-FR': 'rhubarbe', 'de-DE': 'Rhabarber', 'hi-IN': 'रेवंदचीनी', 'zh-CN': '大黄' },
  cherries: { 'en-US': 'cherries', 'es-ES': 'cerezas', 'fr-FR': 'cerises', 'de-DE': 'Kirschen', 'hi-IN': 'चेरी', 'zh-CN': '樱桃' },
  apricots: { 'en-US': 'apricots', 'es-ES': 'albaricoques', 'fr-FR': 'abricots', 'de-DE': 'Aprikosen', 'hi-IN': 'खुबानी', 'zh-CN': '杏子' },
  zucchini: { 'en-US': 'zucchini', 'es-ES': 'calabacín', 'fr-FR': 'courgette', 'de-DE': 'Zucchini', 'hi-IN': 'तोरी', 'zh-CN': '西葫芦' },
  lettuce: { 'en-US': 'lettuce', 'es-ES': 'lechuga', 'fr-FR': 'laitue', 'de-DE': 'Salat', 'hi-IN': 'सलाद पत्ता', 'zh-CN': '生菜' },
  peaches: { 'en-US': 'peaches', 'es-ES': 'melocotones', 'fr-FR': 'pêches', 'de-DE': 'Pfirsiche', 'hi-IN': 'आड़ू', 'zh-CN': '桃子' },
  blueberries: { 'en-US': 'blueberries', 'es-ES': 'arándanos', 'fr-FR': 'myrtilles', 'de-DE': 'Blaubeeren', 'hi-IN': 'ब्लूबेरी', 'zh-CN': '蓝莓' },
  cucumber: { 'en-US': 'cucumber', 'es-ES': 'pepino', 'fr-FR': 'concombre', 'de-DE': 'Gurke', 'hi-IN': 'खीरा', 'zh-CN': '黄瓜' },
  corn: { 'en-US': 'corn', 'es-ES': 'maíz', 'fr-FR': 'maïs', 'de-DE': 'Mais', 'hi-IN': 'मक्का', 'zh-CN': '玉米' },
  watermelon: { 'en-US': 'watermelon', 'es-ES': 'sandía', 'fr-FR': 'pastèque', 'de-DE': 'Wassermelone', 'hi-IN': 'तरबूज', 'zh-CN': '西瓜' },
  tomatoes: { 'en-US': 'tomatoes', 'es-ES': 'tomates', 'fr-FR': 'tomates', 'de-DE': 'Tomaten', 'hi-IN': 'टमाटर', 'zh-CN': '番茄' },
  plums: { 'en-US': 'plums', 'es-ES': 'ciruelas', 'fr-FR': 'prunes', 'de-DE': 'Pflaumen', 'hi-IN': 'आलूबुखारा', 'zh-CN': '李子' },
  mango: { 'en-US': 'mango', 'es-ES': 'mango', 'fr-FR': 'mangue', 'de-DE': 'Mango', 'hi-IN': 'आम', 'zh-CN': '芒果' },
  grapes: { 'en-US': 'grapes', 'es-ES': 'uvas', 'fr-FR': 'raisins', 'de-DE': 'Weintrauben', 'hi-IN': 'अंगूर', 'zh-CN': '葡萄' },
  apples: { 'en-US': 'apples', 'es-ES': 'manzanas', 'fr-FR': 'pommes', 'de-DE': 'Äpfel', 'hi-IN': 'सेब', 'zh-CN': '苹果' },
  figs: { 'en-US': 'figs', 'es-ES': 'higos', 'fr-FR': 'figues', 'de-DE': 'Feigen', 'hi-IN': 'अंजीर', 'zh-CN': '无花果' },
  pears: { 'en-US': 'pears', 'es-ES': 'peras', 'fr-FR': 'poires', 'de-DE': 'Birnen', 'hi-IN': 'नाशपाती', 'zh-CN': '梨' },
  pumpkin: { 'en-US': 'pumpkin', 'es-ES': 'calabaza', 'fr-FR': 'citrouille', 'de-DE': 'Kürbis', 'hi-IN': 'कद्दू', 'zh-CN': '南瓜' },
  'sweet potato': { 'en-US': 'sweet potato', 'es-ES': 'batata', 'fr-FR': 'patate douce', 'de-DE': 'Süßkartoffel', 'hi-IN': 'शकरकंद', 'zh-CN': '红薯' },
  cranberries: { 'en-US': 'cranberries', 'es-ES': 'arándanos rojos', 'fr-FR': 'canneberges', 'de-DE': 'Preiselbeeren', 'hi-IN': 'क्रेनबेरी', 'zh-CN': '蔓越莓' },
  'brussels sprouts': { 'en-US': 'brussels sprouts', 'es-ES': 'coles de Bruselas', 'fr-FR': 'choux de Bruxelles', 'de-DE': 'Rosenkohl', 'hi-IN': 'ब्रसेल्स स्प्राउट्स', 'zh-CN': '抱子甘蓝' },
  carrots: { 'en-US': 'carrots', 'es-ES': 'zanahorias', 'fr-FR': 'carottes', 'de-DE': 'Karotten', 'hi-IN': 'गाजर', 'zh-CN': '胡萝卜' },
  potatoes: { 'en-US': 'potatoes', 'es-ES': 'patatas', 'fr-FR': 'pommes de terre', 'de-DE': 'Kartoffeln', 'hi-IN': 'आलू', 'zh-CN': '土豆' },

  // catalog specific nouns/items
  'organic apples': { 'en-US': 'organic apples', 'es-ES': 'manzanas orgánicas', 'fr-FR': 'pommes biologiques', 'de-DE': 'Bio-Äpfel', 'hi-IN': 'ऑर्गेनिक सेब', 'zh-CN': '有机苹果' },
  bananas: { 'en-US': 'bananas', 'es-ES': 'plátanos', 'fr-FR': 'bananes', 'de-DE': 'Bananen', 'hi-IN': 'केले', 'zh-CN': '香蕉' },
  'organic bananas': { 'en-US': 'organic bananas', 'es-ES': 'plátanos orgánicos', 'fr-FR': 'bananes biologiques', 'de-DE': 'Bio-Bananen', 'hi-IN': 'ऑर्गेनिक केले', 'zh-CN': '有机香蕉' },
  'baby spinach': { 'en-US': 'baby spinach', 'es-ES': 'espinacas tiernas', 'fr-FR': 'pousses d\'épinards', 'de-DE': 'Babyspinat', 'hi-IN': 'बेबी पालक', 'zh-CN': '嫩菠菜' },
  'roma tomatoes': { 'en-US': 'roma tomatoes', 'es-ES': 'tomates roma', 'fr-FR': 'tomates roma', 'de-DE': 'Roma-Tomaten', 'hi-IN': 'रोमा टमाटर', 'zh-CN': '罗马番茄' },
  avocados: { 'en-US': 'avocados', 'es-ES': 'aguacates', 'fr-FR': 'avocats', 'de-DE': 'Avocados', 'hi-IN': 'एवोकैडो', 'zh-CN': '牛油果' },
  'whole milk': { 'en-US': 'whole milk', 'es-ES': 'leche entera', 'fr-FR': 'lait entier', 'de-DE': 'Vollmilch', 'hi-IN': 'फुल क्रीम दूध', 'zh-CN': '全脂牛奶' },
  'organic whole milk': { 'en-US': 'organic whole milk', 'es-ES': 'leche entera orgánica', 'fr-FR': 'lait entier biologique', 'de-DE': 'Bio-Vollmilch', 'hi-IN': 'ऑर्गेनिक फुल क्रीम दूध', 'zh-CN': '有机全脂牛奶' },
  'cheddar cheese': { 'en-US': 'cheddar cheese', 'es-ES': 'queso cheddar', 'fr-FR': 'fromage cheddar', 'de-DE': 'Cheddar-Käse', 'hi-IN': 'चेडर पनीर', 'zh-CN': '切达奶酪' },
  'salted butter': { 'en-US': 'salted butter', 'es-ES': 'mantequilla con sal', 'fr-FR': 'beurre demi-sel', 'de-DE': 'gesalzene Butter', 'hi-IN': 'नमकीन मक्खन', 'zh-CN': '咸黄油' },
  'white bread': { 'en-US': 'white bread', 'es-ES': 'pan blanco', 'fr-FR': 'pain blanc', 'de-DE': 'Weißbrot', 'hi-IN': 'सफेद ब्रेड', 'zh-CN': '白面包' },
  bagels: { 'en-US': 'bagels', 'es-ES': 'bagels', 'fr-FR': 'bagels', 'de-DE': 'Bagels', 'hi-IN': 'बेगल्स', 'zh-CN': '百吉饼' },
  croissants: { 'en-US': 'croissants', 'es-ES': 'cruasanes', 'fr-FR': 'croissants', 'de-DE': 'Croissants', 'hi-IN': 'क्रोइसैन', 'zh-CN': '羊角面包' },
  'chicken breast': { 'en-US': 'chicken breast', 'es-ES': 'pechuga de pollo', 'fr-FR': 'blanc de poulet', 'de-DE': 'Hähnchenbrust', 'hi-IN': 'चिकन ब्रेस्ट', 'zh-CN': '鸡胸肉' },
  'ground beef': { 'en-US': 'ground beef', 'es-ES': 'carne picada de ternera', 'fr-FR': 'bœuf haché', 'de-DE': 'Rinderhackfleisch', 'hi-IN': 'पिसा हुआ गोमांस', 'zh-CN': '牛绞肉' },
  bacon: { 'en-US': 'bacon', 'es-ES': 'bacon', 'fr-FR': 'bacon', 'de-DE': 'Speck', 'hi-IN': 'बेकन', 'zh-CN': '培根' },
  'atlantic salmon': { 'en-US': 'atlantic salmon', 'es-ES': 'salmón del atlántico', 'fr-FR': 'saumon de l\'atlantique', 'de-DE': 'Atlantischer Lachs', 'hi-IN': 'अटलांटिक सैल्मन', 'zh-CN': '大西洋鲑鱼' },
  'canned tuna': { 'en-US': 'canned tuna', 'es-ES': 'atún en lata', 'fr-FR': 'thon en boîte', 'de-DE': 'Thunfischkonserve', 'hi-IN': 'डिब्बाबंद टूना', 'zh-CN': '金枪鱼罐头' },
  'cold brew coffee': { 'en-US': 'cold brew coffee', 'es-ES': 'café cold brew', 'fr-FR': 'café cold brew', 'de-DE': 'Cold Brew Kaffee', 'hi-IN': 'कोल्ड ब्रू कॉफ़ी', 'zh-CN': '冷萃咖啡' },
  'basmati rice': { 'en-US': 'basmati rice', 'es-ES': 'arroz basmati', 'fr-FR': 'riz basmati', 'de-DE': 'Basmati-Reis', 'hi-IN': 'बासमती चावल', 'zh-CN': 'बासमती चावल' },
  spaghetti: { 'en-US': 'spaghetti', 'es-ES': 'espaguetis', 'fr-FR': 'spaghetti', 'de-DE': 'Spaghetti', 'hi-IN': 'स्पेगेटी', 'zh-CN': '意面' },
  'peanut butter': { 'en-US': 'peanut butter', 'es-ES': 'mantequilla de cacahuete', 'fr-FR': 'beurre de cacahuète', 'de-DE': 'Erdnussbutter', 'hi-IN': 'मूंगफली का मक्खन', 'zh-CN': '花生酱' },
  'potato chips': { 'en-US': 'potato chips', 'es-ES': 'patatas fritas de bolsa', 'fr-FR': 'chips de pomme de terre', 'de-DE': 'Kartoffelchips', 'hi-IN': 'आलू के चिप्स', 'zh-CN': '马铃薯片' },
  'dark chocolate': { 'en-US': 'dark chocolate', 'es-ES': 'chocolate negro', 'fr-FR': 'chocolat noir', 'de-DE': 'Dunkle Schokolade', 'hi-IN': 'डार्क चॉकलेट', 'zh-CN': '黑巧克力' },
  toothpaste: { 'en-US': 'toothpaste', 'es-ES': 'pasta de dientes', 'fr-FR': 'dentifrice', 'de-DE': 'Zahnpasta', 'hi-IN': 'टूथपेस्ट', 'zh-CN': '牙膏' },
  'organic toothpaste': { 'en-US': 'organic toothpaste', 'es-ES': 'pasta de dientes orgánica', 'fr-FR': 'dentifrice biologique', 'de-DE': 'Bio-Zahnpasta', 'hi-IN': 'ऑर्गेनिक टूथपेस्ट', 'zh-CN': '有机牙膏' },
  shampoo: { 'en-US': 'shampoo', 'es-ES': 'champú', 'fr-FR': 'shampooing', 'de-DE': 'Shampoo', 'hi-IN': 'शैम्पू', 'zh-CN': '洗发水' },
  'dish soap': { 'en-US': 'dish soap', 'es-ES': 'lavavajillas', 'fr-FR': 'liquide vaisselle', 'de-DE': 'Spülmittel', 'hi-IN': 'बर्तन धोने का साबुन', 'zh-CN': '洗洁精' },
  'paper towels': { 'en-US': 'paper towels', 'es-ES': 'papel de cocina', 'fr-FR': 'essuie-tout', 'de-DE': 'Küchenrolle', 'hi-IN': 'कागज के तौलिये', 'zh-CN': '纸巾' },
}

export const ALIASES = {
  'en-US': {
    apple: 'apples',
    banana: 'bananas',
    orange: 'oranges',
    lemon: 'lemons',
    strawberry: 'strawberries',
    peach: 'peaches',
    blueberry: 'blueberries',
    tomato: 'tomatoes',
    plum: 'plums',
    grape: 'grapes',
    fig: 'figs',
    pear: 'pears',
    carrot: 'carrots',
    potato: 'potatoes',
    egg: 'eggs',
    mushroom: 'mushrooms',
    pea: 'peas',
    leek: 'leeks',
    bagel: 'bagels',
    croissant: 'croissants',
    chickpea: 'chickpeas',
    lentil: 'lentils',
    herb: 'herbs',
    chip: 'chips',
    onion: 'onions',
    cherry: 'cherries',
    cabbage: 'cabbage',
    pumpkin: 'pumpkin',
    zucchini: 'zucchini',
  },
  'es-ES': {
    manzana: 'apples',
    plátano: 'bananas',
    platano: 'bananas',
    naranja: 'oranges',
    limón: 'lemons',
    limon: 'lemons',
    fresa: 'strawberries',
    melocotón: 'peaches',
    melocoton: 'peaches',
    arándano: 'blueberries',
    arandano: 'blueberries',
    tomate: 'tomatoes',
    ciruela: 'plums',
    uva: 'grapes',
    higo: 'figs',
    pera: 'pears',
    zanahoria: 'carrots',
    patata: 'potatoes',
    papa: 'potatoes',
    huevos: 'eggs',
    huevo: 'eggs',
    champiñón: 'mushrooms',
    champinon: 'mushrooms',
    guisante: 'peas',
    puerro: 'leeks',
    garbanzo: 'chickpeas',
    lenteja: 'lentils',
    hierba: 'herbs',
    leches: 'milk',
    leche: 'milk',
    cereza: 'cherries',
    cerezas: 'cherries',
  },
  'fr-FR': {
    pomme: 'apples',
    banane: 'bananas',
    citron: 'lemons',
    fraise: 'strawberries',
    pêche: 'peaches',
    peche: 'peaches',
    myrtille: 'blueberries',
    tomate: 'tomatoes',
    prune: 'plums',
    raisin: 'grapes',
    figue: 'figs',
    poire: 'pears',
    carotte: 'carrots',
    'pomme de terre': 'potatoes',
    œuf: 'eggs',
    oeuf: 'eggs',
    champignon: 'mushrooms',
    'petit pois': 'peas',
    poireau: 'leeks',
    'pois chiche': 'chickpeas',
    lentille: 'lentils',
    herbe: 'herbs',
    cerise: 'cherries',
    cerises: 'cherries',
  },
  'de-DE': {
    apfel: 'apples',
    aepfel: 'apples',
    banane: 'bananas',
    zitrone: 'lemons',
    erdbeere: 'strawberries',
    pfirsich: 'peaches',
    blaubeere: 'blueberries',
    tomate: 'tomatoes',
    pflaume: 'plums',
    weintraube: 'grapes',
    traube: 'grapes',
    feige: 'figs',
    birne: 'pears',
    karotte: 'carrots',
    moehre: 'carrots',
    möhre: 'carrots',
    kartoffel: 'potatoes',
    ei: 'eggs',
    pilz: 'mushrooms',
    erbse: 'peas',
    lauch: 'leeks',
    kichererbse: 'chickpeas',
    linse: 'lentils',
    kraut: 'herbs',
    kraeuter: 'herbs',
    kräuter: 'herbs',
    kirsche: 'cherries',
    kirschen: 'cherries',
  },
  'hi-IN': {
    doodh: 'milk',
    makhan: 'butter',
    ande: 'eggs',
    anda: 'eggs',
    chawal: 'rice',
    dal: 'lentils',
    seb: 'apples',
    tamatar: 'tomatoes',
    aalu: 'potatoes',
    aalo: 'potatoes',
    गाजरों: 'carrots',
    टमाटरों: 'tomatoes',
    केला: 'bananas',
    अंडा: 'eggs',
    मशरूमों: 'mushrooms',
  },
  'zh-CN': {
    苹果: 'apples',
    香蕉: 'bananas',
    橙子: 'oranges',
    柠檬: 'lemons',
    草莓: 'strawberries',
    桃子: 'peaches',
    蓝莓: 'blueberries',
    西红柿: 'tomatoes',
    番茄: 'tomatoes',
    李子: 'plums',
    葡萄: 'grapes',
    无花果: 'figs',
    梨: 'pears',
    胡萝卜: 'carrots',
    土豆: 'potatoes',
    洋芋: 'potatoes',
    马铃薯: 'potatoes',
    鸡蛋: 'eggs',
    蘑菇: 'mushrooms',
    豌豆: 'peas',
    韭葱: 'leeks',
    鹰嘴豆: 'chickpeas',
    扁豆: 'lentils',
    草药: 'herbs',
    樱桃: 'cherries',
  }
}

const langMaps = {}
const unionMap = new Map()

// Initialize maps for all supported languages
for (const lang of SUPPORTED_LANGS) {
  langMaps[lang] = new Map()
}

// Build translation maps
for (const [canonicalKey, translations] of Object.entries(TERMS)) {
  for (const [lang, val] of Object.entries(translations)) {
    const fVal = fold(val)
    if (fVal && langMaps[lang]) {
      langMaps[lang].set(fVal, canonicalKey)
      // also fold and set the canonical key itself in the language map, in case the user speaks it in English
      langMaps[lang].set(fold(canonicalKey), canonicalKey)
      unionMap.set(fVal, canonicalKey)
    }
    unionMap.set(fold(canonicalKey), canonicalKey)
  }
}

// Build alias maps
for (const [lang, aliases] of Object.entries(ALIASES)) {
  for (const [alias, canonicalKey] of Object.entries(aliases)) {
    const fAlias = fold(alias)
    if (fAlias && langMaps[lang]) {
      langMaps[lang].set(fAlias, canonicalKey)
      unionMap.set(fAlias, canonicalKey)
    }
  }
}

/**
 * @param {string} name
 * @param {string} [lang]
 * @returns {string|null} canonical key or null
 */
export function toCanonical(name, lang) {
  if (!name || typeof name !== 'string') return null
  const folded = fold(name)

  if (lang) {
    // 1. Try exact match on full language tag map
    if (langMaps[lang]?.has(folded)) {
      return langMaps[lang].get(folded)
    }
    // 2. Try match on base language tag (e.g. 'es' for 'es-MX')
    const base = baseLang(lang)
    const baseFull = SUPPORTED_LANGS.find(l => baseLang(l) === base)
    if (baseFull && langMaps[baseFull]?.has(folded)) {
      return langMaps[baseFull].get(folded)
    }
  }

  // 3. Fallback to union map
  if (unionMap.has(folded)) {
    return unionMap.get(folded)
  }
  return null
}

/**
 * @param {string} name
 * @param {string} [lang]
 * @returns {string} localized name or raw name verbatim
 */
export function displayName(name, lang) {
  if (!name) return ''
  const canonical = toCanonical(name, lang) || name
  const record = TERMS[canonical]
  if (record) {
    return record[lang] || record[DEFAULT_LANG] || name
  }
  return name
}
