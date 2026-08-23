/**
 * Chinese parser lexicon (zh-CN). See ./en.js for the shape.
 *
 * The one language where tokenization doesn't apply: `spaced: false`. There are
 * no word boundaries to split on, so ./index.js compiles bare alternations (as
 * for Hindi) and rules.js switches to regex-based extraction — quantity+measure
 * word pulled out by pattern, filler stripped wherever it appears rather than
 * only at the ends.
 *
 * Single-character verbs (加, 买, 找, 要) are kept because they're what people
 * actually say, and none of them occur inside any term in services/terms.js.
 * Longest-first ordering means 添加/查找 always win over their one-char forms.
 */
export default {
  lang: 'zh',
  wordBoundary: false,
  spaced: false,

  // NB: "一些" is filler, not a number — it's stripped before quantity
  // extraction runs, so listing it here would be dead weight.
  numbers: {
    一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
    十: 10, 十一: 11, 十二: 12, 一打: 12, 打: 12, 半: 1, 几: 3,
  },

  units: [
    '瓶', '罐', '盒', '袋', '包', '条', '根', '把', '串', '块', '片', '张',
    '个', '只', '斤', '公斤', '千克', '克', '升', '毫升', '磅', '打', '杯',
    '卷', '支', '棵', '头', '份', '箱', '桶',
  ],

  partitive: [],

  filler: ['的', '一些', '些', '请', '帮我', '我要', '我想', '给我', '和', '还有', '再'],

  listPhrases: [
    '到我的购物清单', '到购物清单里', '从我的购物清单', '到我的清单里',
    '从我的清单里', '到清单里', '从清单里', '到列表里', '从列表里',
    '加入购物车', '到购物车', '我的购物清单', '购物清单', '我的清单', '清单',
    '购物车', '请',
  ],

  verbs: {
    add: ['添加', '加入', '放入', '增加', '购买', '需要', '想要', '帮我买', '记下', '加', '买', '要'],
    remove: ['删除', '移除', '去掉', '拿掉', '划掉', '不要了', '不需要', '删掉', '取消'],
    clear: [
      '清空清单', '清空列表', '清空购物车', '清空', '清除全部', '清除所有',
      '删除全部', '删除所有', '全部删除', '全部清除', '重置', '重新开始',
    ],
    search: ['查找', '搜索', '寻找', '搜一下', '找一下', '有没有', '显示', '看看', '找'],
  },

  update: {
    detect: [/(?:改成|改为|变成|设为|设置为)/],
    extract: [
      { re: /^(.*?)(?:改成|改为|变成|设为|设置为)\s*(\d+|[一二三四五六七八九十两半打]+)/, item: 1, qty: 2 },
    ],
  },

  price: [
    /(\d+(?:\.\d+)?)\s*(?:美元|元|块|块钱)?\s*(?:以下|以内|以下的|之下|以内的)/,
    /(?:低于|少于|不超过|不到)\s*(?:\$|￥)?\s*(\d+(?:\.\d+)?)/,
    /(?:\$|￥)\s*(\d+(?:\.\d+)?)/,
  ],

  sizeUnits: ['kg', 'g', 'ml', 'l', '公斤', '千克', '克', '升', '毫升', '斤', '包'],

  organic: ['有机', '有机的'],

  searchNoise: [
    '美元', '元', '块钱', '价格', '价钱', '以下', '以内', '之下', '低于',
    '少于', '不超过', '不到',
  ],
}
