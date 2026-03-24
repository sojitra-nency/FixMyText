import { ENDPOINTS } from './endpoints'

/* ═══════════════════════════════════════════════════════
   Tool & Category Configuration — Data-driven tool system
   ═══════════════════════════════════════════════════════ */

export const PERSONAS = {
  writer:    { label: 'Writer / Blogger', icon: '✍️', defaultTab: 'writing' },
  student:   { label: 'Student',          icon: '📚', defaultTab: 'writing' },
  developer: { label: 'Developer',        icon: '💻', defaultTab: 'code' },
  social:    { label: 'Social Media',     icon: '📱', defaultTab: 'ai' },
  explorer:  { label: 'Just Exploring',   icon: '🔍', defaultTab: 'all' },
}

export const USE_CASE_TABS = [
  { id: 'all',       label: 'All Tools',     icon: '📦', color: 'gray' },
  { id: 'writing',   label: 'Writing',      icon: '✍️', color: 'pink' },
  { id: 'transform', label: 'Transform',    icon: '🔄', color: 'violet' },
  { id: 'code',      label: 'Code & Data',  icon: '💻', color: 'gray' },
  { id: 'ai',        label: 'AI Magic',     icon: '🤖', color: 'pink' },
  { id: 'language',  label: 'Language',      icon: '🌐', color: 'indigo' },
  { id: 'encode',    label: 'Encode',       icon: '🔒', color: 'indigo' },
]

/*
  Tool type:
    'api'     → calls callApi(endpoint, successMsg)
    'ai'      → calls ai.handleXxx()
    'local'   → calls a local handler (e.g. handleMd5)
    'drawer'  → opens a drawer panel via togglePanel(panelId)
    'action'  → clipboard, export, mode toggles
    'select'  → tools with a dropdown selector (translate, tone, format)
*/

// Group definitions — order determines display order (like VSCode Source Control sections)
export const TOOL_GROUPS = [
  { id: 'case',       label: 'Case Transform' },
  { id: 'whitespace', label: 'Whitespace' },
  { id: 'lines',      label: 'Lines & Sort' },
  { id: 'encoding',   label: 'Encoding' },
  { id: 'hashing',    label: 'Hashing' },
  { id: 'developer',  label: 'Developer Tools' },
  { id: 'ai_writing', label: 'AI Writing' },
  { id: 'ai_content', label: 'AI Content' },
  { id: 'language',   label: 'Language' },
  { id: 'compare',    label: 'Compare' },
  { id: 'generate',   label: 'Generate' },
  { id: 'utility',    label: 'Utilities' },
]

export const TOOLS = [
  // ──────────────── Case Transform ────────────────
  { id: 'camel_case',    label: 'camelCase',    description: 'Join words, first lowercase then capitalized', icon: 'cc', color: 'violet', group: 'case', tabs: ['transform','code'],    type: 'api', endpoint: ENDPOINTS.LOWER_CAMEL_CASE, successMsg: 'Converted to camelCase',     keywords: ['camel'] },
  { id: 'kebab_case',    label: 'kebab-case',   description: 'Join words with hyphens',                   icon: 'k-c', color: 'violet', group: 'case', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.KEBAB_CASE,       successMsg: 'Converted to kebab-case',    keywords: ['kebab','hyphen','dash'] },
  { id: 'lowercase',     label: 'Lowercase',    description: 'Convert all text to small letters',         icon: 'aa',  color: 'violet', group: 'case', tabs: ['transform'], type: 'api', endpoint: ENDPOINTS.LOWERCASE,        successMsg: 'Converted to lowercase',     keywords: ['lower','small'] },
  { id: 'pascal_case',   label: 'PascalCase',   description: 'Join words with each one capitalized',      icon: 'PP',  color: 'violet', group: 'case', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.UPPER_CAMEL_CASE, successMsg: 'Converted to PascalCase',    keywords: ['pascal','camel'] },
  { id: 'sentence_case', label: 'Sentence Case', description: 'Capitalize only the first letter of each sentence', icon: 'Ss.', color: 'violet', group: 'case', tabs: ['transform'], type: 'api', endpoint: ENDPOINTS.SENTENCE_CASE,    successMsg: 'Converted to sentence case', keywords: ['sentence'] },
  { id: 'snake_case',    label: 'snake_case',   description: 'Join words with underscores',               icon: 's_c', color: 'violet', group: 'case', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.SNAKE_CASE,       successMsg: 'Converted to snake_case',    keywords: ['snake','underscore'] },
  { id: 'title_case',    label: 'Title Case',   description: 'Capitalize the first letter of each word',  icon: 'Tt',  color: 'violet', group: 'case', tabs: ['transform'],           type: 'api', endpoint: ENDPOINTS.TITLE_CASE,       successMsg: 'Converted to title case',    keywords: ['title','capitalize','heading'] },
  { id: 'toggle_case',   label: 'Toggle Case',  description: 'Swap uppercase and lowercase letters',      icon: 'aA',  color: 'violet', group: 'case', tabs: ['transform'],           type: 'api', endpoint: ENDPOINTS.INVERSE_CASE,     successMsg: 'Case toggled',               keywords: ['toggle','swap','inverse'] },
  { id: 'uppercase',     label: 'UPPERCASE',    description: 'Convert all text to capital letters',       icon: 'AA',  color: 'violet', group: 'case', tabs: ['transform'], type: 'api', endpoint: ENDPOINTS.UPPERCASE,        successMsg: 'Converted to uppercase',     keywords: ['upper','caps','capital'] },

  // ──────────────── Whitespace ────────────────
  { id: 'no_accents',    label: 'No Accents',    description: 'Remove accent marks from characters',      icon: 'àa',  color: 'slate', group: 'whitespace', tabs: ['transform','language'],  type: 'api', endpoint: ENDPOINTS.REMOVE_ACCENTS,       successMsg: 'Accents removed',         keywords: ['accent','diacritic','normalize'] },
  { id: 'no_breaks',     label: 'No Line Breaks', description: 'Remove all line breaks from text',         icon: '↵✕',  color: 'slate', group: 'whitespace', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_LINE_BREAKS,   successMsg: 'Line breaks removed',     keywords: ['line break','newline','remove'] },
  { id: 'strip_all',     label: 'Strip All Spaces', description: 'Remove every space and whitespace',        icon: '✕⎵',  color: 'slate', group: 'whitespace', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_ALL_SPACES,    successMsg: 'All spaces removed',      keywords: ['strip','all spaces'] },
  { id: 'strip_html',    label: 'Strip HTML',    description: 'Remove all HTML tags from text',           icon: '</>',  color: 'slate', group: 'whitespace', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.STRIP_HTML,           successMsg: 'HTML tags removed',       keywords: ['html','strip','tags','clean'] },
  { id: 'toggle_quotes', label: 'Toggle Quotes', description: 'Switch between smart and straight quotes', icon: '""',  color: 'slate', group: 'whitespace', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.TOGGLE_SMART_QUOTES,  successMsg: 'Quotes toggled',          keywords: ['quotes','smart','curly'] },
  { id: 'trim_extra',    label: 'Trim Extra Spaces', description: 'Remove extra spaces between words',        icon: '⎵→',  color: 'slate', group: 'whitespace', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_EXTRA_SPACES,  successMsg: 'Extra spaces removed',    keywords: ['trim','space','extra','whitespace'] },

  // ──────────────── Lines & Sort ────────────────
  { id: 'deduplicate',   label: 'Deduplicate',   description: 'Remove duplicate lines from text',        icon: '⊟',   color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REMOVE_DUPLICATE_LINES, successMsg: 'Duplicate lines removed',     keywords: ['duplicate','unique','dedupe','remove'] },
  { id: 'find_replace',  label: 'Find & Replace', description: 'Search and replace text patterns',       icon: '⌕↺',  color: 'teal', group: 'lines', tabs: ['transform'],   type: 'drawer', panelId: 'find',                                                                    keywords: ['find','replace','search','regex'] },
  { id: 'number_lines',  label: 'Number Lines',  description: 'Add line numbers to each line',           icon: '1.',   color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.NUMBER_LINES,           successMsg: 'Lines numbered',              keywords: ['number','lines','count'] },
  { id: 'reverse',       label: 'Reverse',       description: 'Reverse all characters in your text',     icon: '⟲',   color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REVERSE,                successMsg: 'Text reversed',               keywords: ['reverse','flip','backward'] },
  { id: 'reverse_lines', label: 'Reverse Lines', description: 'Reverse the order of all lines',          icon: '⇵',   color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REVERSE_LINES,          successMsg: 'Lines reversed',              keywords: ['reverse','lines','order'] },
  { id: 'sort_asc',      label: 'Sort A→Z',      description: 'Sort lines alphabetically A to Z',        icon: 'A↑Z', color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.SORT_LINES_ASC,         successMsg: 'Lines sorted A → Z',          keywords: ['sort','alphabetical','ascending'] },
  { id: 'sort_desc',     label: 'Sort Z→A',      description: 'Sort lines reverse-alphabetically',       icon: 'Z↓A', color: 'teal', group: 'lines', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.SORT_LINES_DESC,        successMsg: 'Lines sorted Z → A',          keywords: ['sort','descending','reverse'] },

  // ──────────────── Encoding & Hashing ────────────────
  { id: 'base64_dec',    label: 'Base64 Decode', description: 'Decode Base64 text back to normal',       icon: '64↓', color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.BASE64_DECODE,  successMsg: 'Base64 decoded',   keywords: ['base64','decode'] },
  { id: 'base64_enc',    label: 'Base64 Encode', description: 'Encode text to Base64 format',            icon: '64↑', color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.BASE64_ENCODE,  successMsg: 'Base64 encoded',   keywords: ['base64','encode'] },
  { id: 'hex_dec',       label: 'Hex Decode',    description: 'Convert hexadecimal back to text',        icon: 'x0',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HEX_DECODE,     successMsg: 'Hex decoded',      keywords: ['hex','decode'] },
  { id: 'hex_enc',       label: 'Hex Encode',    description: 'Convert text to hexadecimal',             icon: '0x',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HEX_ENCODE,     successMsg: 'Hex encoded',      keywords: ['hex','hexadecimal','encode'] },
  { id: 'html_esc',      label: 'HTML Escape',   description: 'Escape HTML entities in text',            icon: 'H↑',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HTML_ESCAPE,    successMsg: 'HTML escaped',     keywords: ['html','escape','entities'] },
  { id: 'html_unesc',    label: 'HTML Unescape', description: 'Unescape HTML entities back to text',     icon: 'H↓',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HTML_UNESCAPE,  successMsg: 'HTML unescaped',   keywords: ['html','unescape'] },
  { id: 'json_esc',      label: 'JSON Escape',   description: 'Escape special characters for JSON',      icon: 'J↑',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.JSON_ESCAPE,    successMsg: 'JSON escaped',     keywords: ['json','escape'] },
  { id: 'json_unesc',    label: 'JSON Unescape', description: 'Unescape JSON special characters',        icon: 'J↓',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.JSON_UNESCAPE,  successMsg: 'JSON unescaped',   keywords: ['json','unescape'] },
  { id: 'md5',           label: 'MD5',           description: 'Generate an MD5 hash of your text',       icon: '#5',  color: 'indigo', group: 'hashing', tabs: ['encode','code'],        type: 'local', handlerKey: 'handleMd5',                                          keywords: ['md5','hash'] },
  { id: 'morse_dec',     label: 'Morse Decode',  description: 'Convert Morse code back to text',         icon: '—·',  color: 'indigo', group: 'encoding', tabs: ['encode'],               type: 'api', endpoint: ENDPOINTS.MORSE_DECODE,   successMsg: 'Morse decoded',    keywords: ['morse','decode'] },
  { id: 'morse_enc',     label: 'Morse Encode',  description: 'Convert text to Morse code',              icon: '·—',  color: 'indigo', group: 'encoding', tabs: ['encode'],               type: 'api', endpoint: ENDPOINTS.MORSE_ENCODE,   successMsg: 'Morse encoded',    keywords: ['morse','code','encode'] },
  { id: 'rot13',         label: 'ROT13',         description: 'Shift each letter by 13 positions',       icon: 'R13', color: 'teal',   group: 'encoding', tabs: ['transform','encode'],    type: 'api', endpoint: ENDPOINTS.ROT13,                  successMsg: 'ROT13 applied',               keywords: ['rot13','cipher','encode'] },
  { id: 'sha256',        label: 'SHA-256',       description: 'Generate a SHA-256 hash of your text',    icon: '#2',  color: 'indigo', group: 'hashing', tabs: ['encode','code'],        type: 'local', handlerKey: 'handleSha256',                                       keywords: ['sha','sha256','hash'] },
  { id: 'url_dec',       label: 'URL Decode',    description: 'Decode URL-encoded text',                 icon: '%-',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.URL_DECODE,     successMsg: 'URL decoded',      keywords: ['url','decode'] },
  { id: 'url_enc',       label: 'URL Encode',    description: 'Encode text for use in URLs',             icon: '%+',  color: 'indigo', group: 'encoding', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.URL_ENCODE,     successMsg: 'URL encoded',      keywords: ['url','encode','percent'] },

  // ──────────────── Developer Tools ────────────────
  { id: 'css_fmt',       label: 'CSS Format',    description: 'Format and prettify CSS code',            icon: '#:',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatCss',                                     keywords: ['css','format','prettify'] },
  { id: 'csv_json',      label: 'CSV→JSON',      description: 'Convert CSV data to JSON format',         icon: 'C→J', color: 'gray', group: 'developer', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.CSV_TO_JSON,    successMsg: 'CSV converted to JSON',  keywords: ['csv','json','convert'] },
  { id: 'html_fmt',      label: 'HTML Format',   description: 'Format and prettify HTML code',           icon: '<>',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatHtml',                                    keywords: ['html','format','prettify'] },
  { id: 'js_fmt',        label: 'JavaScript Format', description: 'Format and prettify JavaScript code',     icon: 'JS',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatJs',                                      keywords: ['javascript','js','format'] },
  { id: 'json_csv',      label: 'JSON→CSV',      description: 'Convert JSON data to CSV format',         icon: 'J→C', color: 'gray', group: 'developer', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.JSON_TO_CSV,    successMsg: 'JSON converted to CSV',  keywords: ['json','csv','convert'] },
  { id: 'json_fmt',      label: 'JSON Format',   description: 'Format and prettify JSON data',           icon: '{}',  color: 'gray', group: 'developer', tabs: ['code'],         type: 'api', endpoint: ENDPOINTS.FORMAT_JSON,    successMsg: 'JSON formatted',    keywords: ['json','format','prettify','beautify'] },
  { id: 'json_yaml',     label: 'JSON→YAML',     description: 'Convert JSON to YAML format',             icon: '→Y',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.JSON_TO_YAML,   successMsg: 'Converted to YAML', keywords: ['json','yaml','convert'] },
  { id: 'jwt_decode',    label: 'JWT Decode',    description: 'Decode and inspect a JWT token',          icon: 'JWT', color: 'gray', group: 'developer', tabs: ['code'],                   type: 'local', handlerKey: 'handleJwtDecode',                                     keywords: ['jwt','token','decode','auth'] },
  { id: 'regex_test',    label: 'Regex Tester',  description: 'Test regular expressions on your text',   icon: '.*',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'drawer', panelId: 'regex',                                                 keywords: ['regex','regular expression','test','pattern'] },
  { id: 'ts_fmt',        label: 'TypeScript Format', description: 'Format and prettify TypeScript code',     icon: 'TS',  color: 'gray', group: 'developer', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatTs',                                      keywords: ['typescript','ts','format'] },

  // ──────────────── AI Writing ────────────────
  { id: 'eli5',          label: 'Explain Simply', description: 'Explain text in simple, easy words',     icon: '5',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleEli5',          keywords: ['eli5','explain','simple','easy'] },
  { id: 'email_rewrite', label: 'Email Rewrite',  description: 'Rewrite text as a professional email',   icon: '✉',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleEmailRewrite',  keywords: ['email','rewrite','professional'] },
  { id: 'fix_grammar',   label: 'Fix Grammar',    description: 'Automatically fix grammar mistakes',     icon: 'G',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'], type: 'ai', handlerKey: 'handleFixGrammar',    keywords: ['grammar','fix','correct','spelling'] },
  { id: 'lengthen',      label: 'Lengthen',       description: 'Expand and add more detail to your text', icon: '⊕',  color: 'pink', group: 'ai_writing', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleLengthenText', keywords: ['lengthen','expand','longer','detail'] },
  { id: 'paraphrase',    label: 'Paraphrase',     description: 'Rewrite text with different words',      icon: '↻',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'], type: 'ai', handlerKey: 'handleParaphrase',    keywords: ['paraphrase','rewrite','rephrase'] },
  { id: 'proofread',     label: 'Proofread',      description: 'Check text for errors and improvements', icon: '✓',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleProofread',     keywords: ['proofread','check','review','edit'] },
  { id: 'summarize',     label: 'Summarize',      description: 'Create a short summary of your text',    icon: 'Σ',   color: 'pink', group: 'ai_writing', tabs: ['writing','ai'], type: 'ai', handlerKey: 'handleSummarize',     keywords: ['summarize','summary','shorten','brief'] },
  { id: 'change_format', label: 'Change Format',  description: 'Change the format of your text',         icon: '⬡',   color: 'pink', group: 'ai_writing', tabs: ['ai','writing'],           type: 'select', handlerKey: 'handleChangeFormat', selectKey: 'formatSetting', setterKey: 'setFormatSetting', options: [['paragraph','Paragraph'],['bullets','Bullet Points'],['paragraph-bullets','Para + Points'],['numbered','Numbered List'],['qna','Q&A'],['table','Table'],['tldr','TL;DR + Detail'],['headings','With Headings']], keywords: ['format','paragraph','bullets','table'] },
  { id: 'change_tone',   label: 'Change Tone',    description: 'Change the tone of your writing',        icon: '♪',   color: 'pink', group: 'ai_writing', tabs: ['ai','writing'],           type: 'select', handlerKey: 'handleChangeTone', selectKey: 'toneSetting', setterKey: 'setToneSetting', options: [['formal','Formal'],['casual','Casual'],['friendly','Friendly']], keywords: ['tone','formal','casual','friendly'] },

  // ──────────────── AI Content ────────────────
  { id: 'blog_outline',  label: 'Blog Outline',   description: 'Create a structured blog post outline',  icon: '¶',   color: 'pink', group: 'ai_content', tabs: ['ai','writing'],           type: 'ai', handlerKey: 'handleBlogOutline',   keywords: ['blog','outline','structure','plan'] },
  { id: 'gen_title',     label: 'Generate Title', description: 'Generate catchy titles for your content', icon: 'H',   color: 'pink', group: 'ai_content', tabs: ['ai','writing'],          type: 'ai', handlerKey: 'handleGenerateTitle', keywords: ['title','generate','headline'] },
  { id: 'hashtags',      label: 'Hashtags',       description: 'Generate relevant hashtags for content',  icon: '#',   color: 'pink', group: 'ai_content', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleHashtags',      keywords: ['hashtag','social','generate'] },
  { id: 'keywords',      label: 'Keywords',       description: 'Extract important keywords from text',   icon: '⊕',   color: 'pink', group: 'ai_content', tabs: ['ai','writing'],           type: 'ai', handlerKey: 'handleKeywords',      keywords: ['keyword','extract','important'] },
  { id: 'meta_desc',     label: 'Meta Description', description: 'Generate meta descriptions for SEO',     icon: 'M:',  color: 'pink', group: 'ai_content', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleMetaDescriptions', keywords: ['meta','description','seo'] },
  { id: 'refactor_prompt', label: 'Refactor Prompt', description: 'Improve and optimize your AI prompt', icon: '↹',   color: 'pink', group: 'ai_content', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleRefactorPrompt', keywords: ['prompt','refactor','improve','ai'] },
  { id: 'seo_titles',    label: 'SEO Title Generator', description: 'Generate SEO-optimized title suggestions', icon: 'SEO', color: 'pink', group: 'ai_content', tabs: ['ai'],                  type: 'ai', handlerKey: 'handleSeoTitles',     keywords: ['seo','title','search','optimize'] },
  { id: 'sentiment',     label: 'Sentiment Analysis', description: 'Analyze the emotional tone of text',     icon: '♡',   color: 'pink', group: 'ai_content', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleSentiment',     keywords: ['sentiment','emotion','feeling','analyze'] },
  { id: 'tweet_shorten', label: 'Tweet Shorten',  description: 'Shorten text to fit in a tweet',         icon: '✂',   color: 'pink', group: 'ai_content', tabs: ['ai'],           type: 'ai', handlerKey: 'handleTweetShorten',  keywords: ['tweet','shorten','twitter','x'] },

  // ──────────────── Language ────────────────
  { id: 'translate',     label: 'Translate',       description: 'Translate your text to another language', icon: 'A文', color: 'pink', group: 'language', tabs: ['language','ai'], type: 'select', handlerKey: 'handleTranslate', selectKey: 'translateLang', setterKey: 'setTranslateLang', options: [['Spanish','Spanish'],['French','French'],['German','German'],['Hindi','Hindi'],['Chinese','Chinese'],['Japanese','Japanese'],['Korean','Korean'],['Portuguese','Portuguese'],['Italian','Italian'],['Arabic','Arabic'],['Russian','Russian'],['Dutch','Dutch'],['Turkish','Turkish'],['Bengali','Bengali']], keywords: ['translate','language','spanish','french','hindi','chinese'] },
  { id: 'transliterate', label: 'Transliterate',   description: 'Write text in another script',           icon: 'अ',  color: 'pink', group: 'language', tabs: ['language','ai'],           type: 'select', handlerKey: 'handleTransliterate', selectKey: 'translitLang', setterKey: 'setTranslitLang', options: [['Hindi','Hindi'],['Arabic','Arabic'],['Chinese','Chinese'],['Japanese','Japanese'],['Korean','Korean'],['Russian','Russian'],['Greek','Greek'],['Thai','Thai'],['Bengali','Bengali'],['Tamil','Tamil'],['Telugu','Telugu'],['Gujarati','Gujarati'],['Kannada','Kannada'],['Urdu','Urdu']], keywords: ['transliterate','script','hindi','arabic','urdu'] },

  // ──────────────── Generate & Compare ────────────────
  { id: 'compare',       label: 'Compare',         description: 'Compare two texts side by side',         icon: '⇄',  color: 'purple', group: 'compare', tabs: ['transform'],             type: 'drawer', panelId: 'compare',    keywords: ['compare','diff','difference'] },
  { id: 'password',      label: 'Password Generator', description: 'Generate a strong random password',      icon: '⚿',  color: 'amber',  group: 'generate', tabs: ['transform'],   type: 'drawer', panelId: 'password',   keywords: ['password','generate','random','security'] },
  { id: 'random_text',   label: 'Random Text',     description: 'Generate random placeholder text',       icon: '¶',  color: 'amber',  group: 'generate', tabs: ['transform'],             type: 'drawer', panelId: 'randtext',   keywords: ['random','lorem','placeholder','generate'] },

  // ──────────────── Utilities ────────────────
  { id: 'word_freq',     label: 'Word Frequency',  description: 'Analyze word frequency in your text',    icon: 'W#', color: 'purple', group: 'utility',   tabs: ['writing'],              type: 'local', handlerKey: 'handleWordFrequency', keywords: ['word','frequency','count','analyze'] },
]

// ── Smart Suggestion Rules ────────────────────────────────
export const SMART_SUGGESTION_RULES = [
  { test: (t) => { try { JSON.parse(t); return true } catch { return false } },             toolIds: ['json_fmt','json_yaml','json_esc'] },
  { test: (t) => /<[a-z][\s\S]*>/i.test(t),                                                 toolIds: ['strip_html','html_fmt','html_esc'] },
  { test: (t) => t === t.toUpperCase() && /[A-Z]/.test(t),                                   toolIds: ['lowercase','title_case','sentence_case'] },
  { test: (t) => /[?&][\w]+=(%[0-9A-F]{2}|[\w]+)/i.test(t),                                 toolIds: ['url_dec'] },
  { test: (t) => /^[A-Za-z0-9+/=\n]{20,}$/.test(t.trim()),                                  toolIds: ['base64_dec'] },
  { test: (t) => t.split('\n').length > 5 && new Set(t.split('\n')).size < t.split('\n').length, toolIds: ['deduplicate','sort_asc'] },
  { test: (t) => t.split(/\s+/).length > 80,                                                 toolIds: ['summarize','eli5','keywords'] },
  { test: (t) => t.split(/\s+/).length > 20 && t.split(/\s+/).length <= 80,                  toolIds: ['fix_grammar','paraphrase','proofread'] },
  { test: (t) => /^(dear|hi|hello|hey|to whom)/i.test(t.trim()),                             toolIds: ['email_rewrite','change_tone'] },
  { test: (t) => /^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(t.trim()), toolIds: ['jwt_decode'] },
  { test: (t) => /\.(css|scss)\s*\{/m.test(t) || /^\s*[.#@][\w-]+\s*\{/m.test(t),          toolIds: ['css_fmt'] },
  { test: (t) => /function\s+\w+|const\s+\w+\s*=|=>\s*\{/m.test(t),                        toolIds: ['js_fmt'] },
]

// ── Search Intent Mapping ────────────────────────────────
export const SEARCH_INTENTS = [
  { phrases: ['make shorter','shorten','condense','reduce','brief'],       toolIds: ['summarize','tweet_shorten'] },
  { phrases: ['make longer','expand','elaborate','lengthen','more detail'], toolIds: ['lengthen'] },
  { phrases: ['fix grammar','correct','spelling','grammar check'],         toolIds: ['fix_grammar','proofread'] },
  { phrases: ['rewrite','rephrase','different words'],                      toolIds: ['paraphrase'] },
  { phrases: ['translate','language','spanish','french','hindi'],           toolIds: ['translate'] },
  { phrases: ['format json','prettify json','beautify json'],              toolIds: ['json_fmt'] },
  { phrases: ['format code','prettify','beautify'],                        toolIds: ['json_fmt','html_fmt','css_fmt','js_fmt'] },
  { phrases: ['encode','encoding','base64'],                               toolIds: ['base64_enc','url_enc','hex_enc'] },
  { phrases: ['decode','decoding'],                                         toolIds: ['base64_dec','url_dec','hex_dec'] },
  { phrases: ['hash','checksum','md5','sha'],                              toolIds: ['md5','sha256'] },
  { phrases: ['convert case','uppercase','lowercase','capitalize'],        toolIds: ['uppercase','lowercase','title_case'] },
  { phrases: ['compare','diff','difference'],                              toolIds: ['compare'] },
  { phrases: ['generate password','random password','strong password'],     toolIds: ['password'] },
  { phrases: ['explain simply','eli5','simple words','easy'],              toolIds: ['eli5'] },
  { phrases: ['email','professional email'],                                toolIds: ['email_rewrite'] },
  { phrases: ['hashtag','social media','twitter'],                          toolIds: ['hashtags','tweet_shorten'] },
  { phrases: ['seo','search engine','title tag','meta'],                   toolIds: ['seo_titles','meta_desc'] },
  { phrases: ['sort','alphabetical','order'],                               toolIds: ['sort_asc','sort_desc'] },
  { phrases: ['remove duplicate','unique lines','dedupe'],                  toolIds: ['deduplicate'] },
  { phrases: ['regex','regular expression','pattern match'],               toolIds: ['regex_test'] },
  { phrases: ['jwt','token','decode token'],                                toolIds: ['jwt_decode'] },
  { phrases: ['yaml','convert yaml'],                                       toolIds: ['json_yaml'] },
  { phrases: ['csv','spreadsheet'],                                         toolIds: ['csv_json','json_csv'] },
  { phrases: ['tone','formal','casual','friendly'],                         toolIds: ['change_tone'] },
  { phrases: ['outline','blog','plan','structure'],                         toolIds: ['blog_outline'] },
  { phrases: ['keyword','extract','important words'],                       toolIds: ['keywords'] },
  { phrases: ['sentiment','emotion','feel','mood'],                         toolIds: ['sentiment'] },
]

// ── Achievement Definitions ────────────────────────────────
export const ACHIEVEMENTS = [
  // Getting started
  { id: 'first_step',     label: 'First Step',       description: 'Use your first tool',                icon: '🎯', condition: (s) => s.totalOps >= 1 },
  { id: 'getting_warmed', label: 'Getting Warmed Up', description: 'Perform 10 operations',             icon: '🌱', condition: (s) => s.totalOps >= 10 },
  { id: 'power_user',     label: 'Power User',       description: 'Perform 100 operations',             icon: '💪', condition: (s) => s.totalOps >= 100 },
  { id: 'unstoppable',    label: 'Unstoppable',      description: 'Perform 500 operations',             icon: '🚀', condition: (s) => s.totalOps >= 500 },
  // Discovery
  { id: 'explorer_10',    label: 'Curious Mind',     description: 'Discover 10 different tools',         icon: '🔍', condition: (s) => s.discoveredTools.length >= 10 },
  { id: 'explorer_25',    label: 'Explorer',         description: 'Discover 25 different tools',         icon: '🗺️', condition: (s) => s.discoveredTools.length >= 25 },
  { id: 'explorer_50',    label: 'Pathfinder',       description: 'Discover 50 different tools',         icon: '🧭', condition: (s) => s.discoveredTools.length >= 50 },
  { id: 'completionist',  label: 'Completionist',    description: 'Discover all 70+ tools',              icon: '🏆', condition: (s) => s.discoveredTools.length >= 70 },
  // Speed & sessions
  { id: 'chain_master',   label: 'Chain Master',     description: 'Use 3+ tools in one session',         icon: '⛓️', condition: (s) => s.sessionOps >= 3 },
  { id: 'marathon',       label: 'Marathon',         description: 'Use 10+ tools in one session',        icon: '🏃', condition: (s) => s.sessionOps >= 10 },
  { id: 'speed_demon',    label: 'Speed Demon',      description: 'Apply 5 tools in under 60 seconds',   icon: '⚡', condition: (s) => s.speedCount >= 5 },
  // Categories
  { id: 'ai_explorer',    label: 'AI Explorer',      description: 'Use 10 different AI tools',           icon: '🤖', condition: (s) => s.aiToolsUsed >= 10 },
  { id: 'code_wrangler',  label: 'Code Wrangler',    description: 'Use 5 developer tools',               icon: '💻', condition: (s) => s.devToolsUsed >= 5 },
  { id: 'polyglot',       label: 'Polyglot',         description: 'Translate to 5 different languages',   icon: '🌍', condition: (s) => s.languagesUsed >= 5 },
  // Streaks
  { id: 'streak_3',       label: 'On a Roll',        description: 'Maintain a 3-day streak',             icon: '🔥', condition: (s) => s.streak >= 3 },
  { id: 'streak_star',    label: 'Streak Star',      description: 'Maintain a 7-day streak',             icon: '🔥', condition: (s) => s.streak >= 7 },
  { id: 'streak_legend',  label: 'Streak Legend',    description: 'Maintain a 30-day streak',            icon: '👑', condition: (s) => s.streak >= 30 },
  // Volume
  { id: 'word_crafter',   label: 'Word Crafter',     description: 'Process 10,000+ characters',          icon: '✍️', condition: (s) => s.totalChars >= 10000 },
  { id: 'novelist',       label: 'Novelist',         description: 'Process 100,000+ characters',         icon: '📖', condition: (s) => s.totalChars >= 100000 },
  // Social
  { id: 'favorite_fan',   label: 'Favorite Fan',     description: 'Star 5 tools as favorites',           icon: '⭐', condition: (s) => s.favoritesCount >= 5 },
  { id: 'pipeline_pro',   label: 'Pipeline Pro',     description: 'Save 3 pipelines',                    icon: '🔗', condition: (s) => s.savedPipelines >= 3 },
  { id: 'night_owl',      label: 'Night Owl',        description: 'Use a tool after midnight',           icon: '🦉', condition: (s) => s.nightOwl },
  { id: 'early_bird',     label: 'Early Bird',       description: 'Use a tool before 7 AM',              icon: '🐦', condition: (s) => s.earlyBird },
]

// ── Quest Templates ────────────────────────────────
export const QUEST_TEMPLATES = [
  // Combo quests
  { id: 'combo_ai_transform', text: 'Use an AI tool + a Transform tool',       xp: 50, check: (ops) => ops.some(o => o.tab === 'ai') && ops.some(o => o.tab === 'transform') },
  { id: 'combo_writing_code', text: 'Use a Writing tool + a Code tool',        xp: 50, check: (ops) => ops.some(o => o.tab === 'writing') && ops.some(o => o.tab === 'code') },
  { id: 'paraphrase_tone',    text: 'Use Paraphrase + Change Tone',            xp: 50, check: (ops) => ops.some(o => o.id === 'paraphrase') && ops.some(o => o.id === 'change_tone') },
  { id: 'grammar_proofread',  text: 'Use Fix Grammar + Proofread',             xp: 50, check: (ops) => ops.some(o => o.id === 'fix_grammar') && ops.some(o => o.id === 'proofread') },
  { id: 'encode_decode',      text: 'Encode and then Decode something',        xp: 50, check: (ops) => ops.some(o => o.id?.includes('_enc')) && ops.some(o => o.id?.includes('_dec')) },
  { id: 'upper_lower',        text: 'Use UPPERCASE + Lowercase on text',       xp: 40, check: (ops) => ops.some(o => o.id === 'uppercase') && ops.some(o => o.id === 'lowercase') },
  { id: 'eli5_summarize',     text: 'Use ELI5 + Summarize on text',            xp: 50, check: (ops) => ops.some(o => o.id === 'eli5') && ops.some(o => o.id === 'summarize') },
  { id: 'translate_tone',     text: 'Translate text + Change its Tone',         xp: 60, check: (ops) => ops.some(o => o.id === 'translate') && ops.some(o => o.id === 'change_tone') },
  // Discovery quests
  { id: 'try_new_tool',       text: 'Try a tool you\'ve never used before',    xp: 50, check: (ops) => ops.some(o => o.isNew) },
  { id: 'try_2_new',          text: 'Discover 2 new tools today',              xp: 75, check: (ops) => ops.filter(o => o.isNew).length >= 2 },
  { id: 'try_3_new',          text: 'Discover 3 new tools today',              xp: 100, check: (ops) => ops.filter(o => o.isNew).length >= 3 },
  // Category quests
  { id: 'use_3_categories',   text: 'Use tools from 3 different categories',   xp: 50, check: (ops) => new Set(ops.map(o => o.tab)).size >= 3 },
  { id: 'use_4_categories',   text: 'Use tools from 4 different categories',   xp: 75, check: (ops) => new Set(ops.map(o => o.tab)).size >= 4 },
  { id: 'all_transform',      text: 'Use 3 different Transform tools',         xp: 50, check: (ops) => new Set(ops.filter(o => o.tab === 'transform').map(o => o.id)).size >= 3 },
  { id: 'all_writing',        text: 'Use 3 different Writing tools',           xp: 50, check: (ops) => new Set(ops.filter(o => o.tab === 'writing').map(o => o.id)).size >= 3 },
  { id: 'all_ai',             text: 'Use 3 different AI tools',                xp: 60, check: (ops) => new Set(ops.filter(o => o.tab === 'ai').map(o => o.id)).size >= 3 },
  // Volume quests
  { id: 'pipeline_3',         text: 'Apply 3+ tools to the same text',         xp: 50, check: (ops) => ops.length >= 3 },
  { id: 'pipeline_5',         text: 'Apply 5+ tools in one session',           xp: 75, check: (ops) => ops.length >= 5 },
  { id: 'pipeline_10',        text: 'Use 10 tools in a single session',        xp: 100, check: (ops) => ops.length >= 10 },
  { id: 'speed_burst',        text: 'Use 3 tools within 60 seconds',           xp: 60, check: (ops) => { if (ops.length < 3) return false; const r = ops.slice(-3); return (r[2].time - r[0].time) < 60000 } },
  // Specific tool quests
  { id: 'use_word_freq',      text: 'Analyze your text with Word Frequency',   xp: 40, check: (ops) => ops.some(o => o.id === 'word_frequency') },
  { id: 'use_title_gen',      text: 'Generate a title for your text',          xp: 40, check: (ops) => ops.some(o => o.id === 'title_generator') },
  { id: 'use_json_format',    text: 'Format some JSON or code',                xp: 40, check: (ops) => ops.some(o => o.id === 'json_format' || o.id === 'format_code') },
  { id: 'use_markdown',       text: 'Convert text to Markdown',                xp: 40, check: (ops) => ops.some(o => o.id === 'markdown') },
  { id: 'use_slug',           text: 'Generate a URL slug from text',           xp: 40, check: (ops) => ops.some(o => o.id === 'slug') },
  { id: 'use_lorem',          text: 'Generate some Lorem Ipsum text',          xp: 30, check: (ops) => ops.some(o => o.id === 'lorem_ipsum') },
  { id: 'use_reverse',        text: 'Reverse your text for fun',               xp: 30, check: (ops) => ops.some(o => o.id === 'reverse') },
]

// ── Level Thresholds ────────────────────────────────
export const LEVELS = [
  { level: 1,  xp: 0,     title: 'Beginner' },
  { level: 2,  xp: 100,   title: 'Novice' },
  { level: 3,  xp: 250,   title: 'Apprentice' },
  { level: 4,  xp: 500,   title: 'Explorer' },
  { level: 5,  xp: 800,   title: 'Word Crafter' },
  { level: 6,  xp: 1200,  title: 'Tool Smith' },
  { level: 7,  xp: 1700,  title: 'Artisan' },
  { level: 8,  xp: 2300,  title: 'Expert' },
  { level: 9,  xp: 3000,  title: 'Text Wizard' },
  { level: 10, xp: 3800,  title: 'Master Editor' },
  { level: 11, xp: 4800,  title: 'Grand Master' },
  { level: 12, xp: 6000,  title: 'Sage' },
  { level: 13, xp: 7500,  title: 'Virtuoso' },
  { level: 14, xp: 9500,  title: 'Mythic' },
  { level: 15, xp: 12000, title: 'Text Legend' },
]
