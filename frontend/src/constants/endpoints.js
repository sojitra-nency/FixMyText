/**
 * API endpoint paths for the FixMyText backend.
 * Used with RTK Query's transformText mutation.
 */

export const ENDPOINTS = {
  // Transform
  UPPERCASE: '/api/v1/text/uppercase',
  LOWERCASE: '/api/v1/text/lowercase',
  INVERSE_CASE: '/api/v1/text/inversecase',
  SENTENCE_CASE: '/api/v1/text/sentencecase',
  TITLE_CASE: '/api/v1/text/titlecase',
  UPPER_CAMEL_CASE: '/api/v1/text/upper-camel-case',
  LOWER_CAMEL_CASE: '/api/v1/text/lower-camel-case',
  SNAKE_CASE: '/api/v1/text/snake-case',
  KEBAB_CASE: '/api/v1/text/kebab-case',

  // Whitespace
  REMOVE_EXTRA_SPACES: '/api/v1/text/remove-extra-spaces',
  REMOVE_ALL_SPACES: '/api/v1/text/remove-all-spaces',
  REMOVE_LINE_BREAKS: '/api/v1/text/remove-line-breaks',
  STRIP_HTML: '/api/v1/text/strip-html',
  REMOVE_ACCENTS: '/api/v1/text/remove-accents',
  TOGGLE_SMART_QUOTES: '/api/v1/text/toggle-smart-quotes',

  // Encoding
  BASE64_ENCODE: '/api/v1/text/base64-encode',
  BASE64_DECODE: '/api/v1/text/base64-decode',
  URL_ENCODE: '/api/v1/text/url-encode',
  URL_DECODE: '/api/v1/text/url-decode',
  HEX_ENCODE: '/api/v1/text/hex-encode',
  HEX_DECODE: '/api/v1/text/hex-decode',
  MORSE_ENCODE: '/api/v1/text/morse-encode',
  MORSE_DECODE: '/api/v1/text/morse-decode',

  // Text Tools
  REVERSE: '/api/v1/text/reverse',
  SORT_LINES_ASC: '/api/v1/text/sort-lines-asc',
  SORT_LINES_DESC: '/api/v1/text/sort-lines-desc',
  REMOVE_DUPLICATE_LINES: '/api/v1/text/remove-duplicate-lines',
  REVERSE_LINES: '/api/v1/text/reverse-lines',
  NUMBER_LINES: '/api/v1/text/number-lines',
  ROT13: '/api/v1/text/rot13',

  // Escape / Unescape
  JSON_ESCAPE: '/api/v1/text/json-escape',
  JSON_UNESCAPE: '/api/v1/text/json-unescape',
  HTML_ESCAPE: '/api/v1/text/html-escape',
  HTML_UNESCAPE: '/api/v1/text/html-unescape',

  // Developer Tools
  FORMAT_JSON: '/api/v1/text/format-json',
  JSON_TO_YAML: '/api/v1/text/json-to-yaml',
  CSV_TO_JSON: '/api/v1/text/csv-to-json',
  JSON_TO_CSV: '/api/v1/text/json-to-csv',

  // AI Tools
  GENERATE_HASHTAGS: '/api/v1/text/generate-hashtags',
  GENERATE_SEO_TITLES: '/api/v1/text/generate-seo-titles',
  GENERATE_META_DESCRIPTIONS: '/api/v1/text/generate-meta-descriptions',
  GENERATE_BLOG_OUTLINE: '/api/v1/text/generate-blog-outline',
  SHORTEN_FOR_TWEET: '/api/v1/text/shorten-for-tweet',
  REWRITE_EMAIL: '/api/v1/text/rewrite-email',
  EXTRACT_KEYWORDS: '/api/v1/text/extract-keywords',
  TRANSLATE: '/api/v1/text/translate',
  TRANSLITERATE: '/api/v1/text/transliterate',
  SUMMARIZE: '/api/v1/text/summarize',
  FIX_GRAMMAR: '/api/v1/text/fix-grammar',
  PARAPHRASE: '/api/v1/text/paraphrase',
  CHANGE_TONE: '/api/v1/text/change-tone',
  ANALYZE_SENTIMENT: '/api/v1/text/analyze-sentiment',
  LENGTHEN_TEXT: '/api/v1/text/lengthen-text',
  ELI5: '/api/v1/text/eli5',
  PROOFREAD: '/api/v1/text/proofread',
  GENERATE_TITLE: '/api/v1/text/generate-title',
  REFACTOR_PROMPT: '/api/v1/text/refactor-prompt',
  CHANGE_FORMAT: '/api/v1/text/change-format',
}
