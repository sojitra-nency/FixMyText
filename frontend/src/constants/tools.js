import { ENDPOINTS } from './endpoints'

/* ═══════════════════════════════════════════════════════
   Tool & Category Configuration — Data-driven tool system
   ═══════════════════════════════════════════════════════ */

export const PERSONAS = {
  writer:    { label: 'Writer / Blogger', icon: '✍️', defaultTab: 'writing' },
  student:   { label: 'Student',          icon: '📚', defaultTab: 'writing' },
  developer: { label: 'Developer',        icon: '💻', defaultTab: 'code' },
  social:    { label: 'Social Media',     icon: '📱', defaultTab: 'ai' },
  explorer:  { label: 'Just Exploring',   icon: '🔍', defaultTab: 'popular' },
}

export const USE_CASE_TABS = [
  { id: 'popular',   label: 'Popular',      icon: '✨', color: 'violet' },
  { id: 'writing',   label: 'Writing',      icon: '✍️', color: 'pink' },
  { id: 'transform', label: 'Transform',    icon: '🔄', color: 'violet' },
  { id: 'code',      label: 'Code & Data',  icon: '💻', color: 'gray' },
  { id: 'ai',        label: 'AI Magic',     icon: '🤖', color: 'pink' },
  { id: 'language',  label: 'Language',      icon: '🌐', color: 'indigo' },
  { id: 'encode',    label: 'Encode',       icon: '🔒', color: 'indigo' },
  { id: 'export',    label: 'Export',        icon: '📤', color: 'emerald' },
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

export const TOOLS = [
  // ──────────────── Transform ────────────────
  { id: 'uppercase',     label: 'UPPERCASE',    description: 'Convert all text to capital letters',       icon: 'AA',  color: 'violet', tabs: ['transform','popular'], type: 'api', endpoint: ENDPOINTS.UPPERCASE,        successMsg: 'Converted to uppercase',     keywords: ['upper','caps','capital'] },
  { id: 'lowercase',     label: 'Lowercase',    description: 'Convert all text to small letters',         icon: 'aa',  color: 'violet', tabs: ['transform','popular'], type: 'api', endpoint: ENDPOINTS.LOWERCASE,        successMsg: 'Converted to lowercase',     keywords: ['lower','small'] },
  { id: 'title_case',    label: 'Title Case',   description: 'Capitalize the first letter of each word',  icon: 'Tt',  color: 'violet', tabs: ['transform'],           type: 'api', endpoint: ENDPOINTS.TITLE_CASE,       successMsg: 'Converted to title case',    keywords: ['title','capitalize','heading'] },
  { id: 'sentence_case', label: 'Sentence',     description: 'Capitalize only the first letter of each sentence', icon: 'Ss.', color: 'violet', tabs: ['transform'], type: 'api', endpoint: ENDPOINTS.SENTENCE_CASE,    successMsg: 'Converted to sentence case', keywords: ['sentence'] },
  { id: 'toggle_case',   label: 'Toggle',       description: 'Swap uppercase and lowercase letters',      icon: 'aA',  color: 'violet', tabs: ['transform'],           type: 'api', endpoint: ENDPOINTS.INVERSE_CASE,     successMsg: 'Case toggled',               keywords: ['toggle','swap','inverse'] },
  { id: 'pascal_case',   label: 'PascalCase',   description: 'Join words with each one capitalized',      icon: 'PP',  color: 'violet', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.UPPER_CAMEL_CASE, successMsg: 'Converted to PascalCase',    keywords: ['pascal','camel'] },
  { id: 'camel_case',    label: 'camelCase',    description: 'Join words, first lowercase then capitalized', icon: 'cc', color: 'violet', tabs: ['transform','code'],    type: 'api', endpoint: ENDPOINTS.LOWER_CAMEL_CASE, successMsg: 'Converted to camelCase',     keywords: ['camel'] },
  { id: 'snake_case',    label: 'snake_case',   description: 'Join words with underscores',               icon: 's_c', color: 'violet', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.SNAKE_CASE,       successMsg: 'Converted to snake_case',    keywords: ['snake','underscore'] },
  { id: 'kebab_case',    label: 'kebab-case',   description: 'Join words with hyphens',                   icon: 'k-c', color: 'violet', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.KEBAB_CASE,       successMsg: 'Converted to kebab-case',    keywords: ['kebab','hyphen','dash'] },

  // ──────────────── Whitespace ────────────────
  { id: 'trim_extra',    label: 'Trim Extra',    description: 'Remove extra spaces between words',        icon: '⎵→',  color: 'slate', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_EXTRA_SPACES,  successMsg: 'Extra spaces removed',    keywords: ['trim','space','extra','whitespace'] },
  { id: 'no_breaks',     label: 'No Breaks',     description: 'Remove all line breaks from text',         icon: '↵✕',  color: 'slate', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_LINE_BREAKS,   successMsg: 'Line breaks removed',     keywords: ['line break','newline','remove'] },
  { id: 'strip_all',     label: 'Strip All',     description: 'Remove every space and whitespace',        icon: '✕⎵',  color: 'slate', tabs: ['transform'],            type: 'api', endpoint: ENDPOINTS.REMOVE_ALL_SPACES,    successMsg: 'All spaces removed',      keywords: ['strip','all spaces'] },
  { id: 'strip_html',    label: 'Strip HTML',    description: 'Remove all HTML tags from text',           icon: '</>',  color: 'slate', tabs: ['transform','code'],     type: 'api', endpoint: ENDPOINTS.STRIP_HTML,           successMsg: 'HTML tags removed',       keywords: ['html','strip','tags','clean'] },
  { id: 'no_accents',    label: 'No Accents',    description: 'Remove accent marks from characters',      icon: 'àa',  color: 'slate', tabs: ['transform','language'],  type: 'api', endpoint: ENDPOINTS.REMOVE_ACCENTS,       successMsg: 'Accents removed',         keywords: ['accent','diacritic','normalize'] },
  { id: 'toggle_quotes', label: 'Toggle Quotes', description: 'Switch between smart and straight quotes', icon: '""',  color: 'slate', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.TOGGLE_SMART_QUOTES,  successMsg: 'Quotes toggled',          keywords: ['quotes','smart','curly'] },

  // ──────────────── Text Tools ────────────────
  { id: 'reverse',       label: 'Reverse',       description: 'Reverse all characters in your text',     icon: '⟲',   color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REVERSE,                successMsg: 'Text reversed',               keywords: ['reverse','flip','backward'] },
  { id: 'sort_asc',      label: 'Sort A→Z',      description: 'Sort lines alphabetically A to Z',        icon: 'A↑Z', color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.SORT_LINES_ASC,         successMsg: 'Lines sorted A → Z',          keywords: ['sort','alphabetical','ascending'] },
  { id: 'sort_desc',     label: 'Sort Z→A',      description: 'Sort lines reverse-alphabetically',       icon: 'Z↓A', color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.SORT_LINES_DESC,        successMsg: 'Lines sorted Z → A',          keywords: ['sort','descending','reverse'] },
  { id: 'deduplicate',   label: 'Deduplicate',   description: 'Remove duplicate lines from text',        icon: '⊟',   color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REMOVE_DUPLICATE_LINES, successMsg: 'Duplicate lines removed',     keywords: ['duplicate','unique','dedupe','remove'] },
  { id: 'reverse_lines', label: 'Rev Lines',     description: 'Reverse the order of all lines',          icon: '⇵',   color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.REVERSE_LINES,          successMsg: 'Lines reversed',              keywords: ['reverse','lines','order'] },
  { id: 'number_lines',  label: 'Number',        description: 'Add line numbers to each line',           icon: '1.',   color: 'teal', tabs: ['transform'],             type: 'api', endpoint: ENDPOINTS.NUMBER_LINES,           successMsg: 'Lines numbered',              keywords: ['number','lines','count'] },
  { id: 'rot13',         label: 'ROT13',         description: 'Shift each letter by 13 positions',       icon: 'R13', color: 'teal', tabs: ['transform','encode'],    type: 'api', endpoint: ENDPOINTS.ROT13,                  successMsg: 'ROT13 applied',               keywords: ['rot13','cipher','encode'] },
  { id: 'find_replace',  label: 'Find & Replace', description: 'Search and replace text patterns',       icon: '⌕↺',  color: 'teal', tabs: ['transform','popular'],   type: 'drawer', panelId: 'find',                                                                    keywords: ['find','replace','search','regex'] },

  // ──────────────── Encoding ────────────────
  { id: 'base64_enc',    label: 'Base64 Enc',    description: 'Encode text to Base64 format',            icon: '64↑', color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.BASE64_ENCODE,  successMsg: 'Base64 encoded',   keywords: ['base64','encode'] },
  { id: 'base64_dec',    label: 'Base64 Dec',    description: 'Decode Base64 text back to normal',       icon: '64↓', color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.BASE64_DECODE,  successMsg: 'Base64 decoded',   keywords: ['base64','decode'] },
  { id: 'url_enc',       label: 'URL Encode',    description: 'Encode text for use in URLs',             icon: '%+',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.URL_ENCODE,     successMsg: 'URL encoded',      keywords: ['url','encode','percent'] },
  { id: 'url_dec',       label: 'URL Decode',    description: 'Decode URL-encoded text',                 icon: '%-',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.URL_DECODE,     successMsg: 'URL decoded',      keywords: ['url','decode'] },
  { id: 'hex_enc',       label: 'Hex Enc',       description: 'Convert text to hexadecimal',             icon: '0x',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HEX_ENCODE,     successMsg: 'Hex encoded',      keywords: ['hex','hexadecimal','encode'] },
  { id: 'hex_dec',       label: 'Hex Dec',       description: 'Convert hexadecimal back to text',        icon: 'x0',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HEX_DECODE,     successMsg: 'Hex decoded',      keywords: ['hex','decode'] },
  { id: 'morse_enc',     label: 'Morse Enc',     description: 'Convert text to Morse code',              icon: '·—',  color: 'indigo', tabs: ['encode'],               type: 'api', endpoint: ENDPOINTS.MORSE_ENCODE,   successMsg: 'Morse encoded',    keywords: ['morse','code','encode'] },
  { id: 'morse_dec',     label: 'Morse Dec',     description: 'Convert Morse code back to text',         icon: '—·',  color: 'indigo', tabs: ['encode'],               type: 'api', endpoint: ENDPOINTS.MORSE_DECODE,   successMsg: 'Morse decoded',    keywords: ['morse','decode'] },
  { id: 'md5',           label: 'MD5',           description: 'Generate an MD5 hash of your text',       icon: '#5',  color: 'indigo', tabs: ['encode','code'],        type: 'local', handlerKey: 'handleMd5',                                          keywords: ['md5','hash'] },
  { id: 'sha256',        label: 'SHA-256',       description: 'Generate a SHA-256 hash of your text',    icon: '#2',  color: 'indigo', tabs: ['encode','code'],        type: 'local', handlerKey: 'handleSha256',                                       keywords: ['sha','sha256','hash'] },
  { id: 'json_esc',      label: 'JSON Esc',      description: 'Escape special characters for JSON',      icon: 'J↑',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.JSON_ESCAPE,    successMsg: 'JSON escaped',     keywords: ['json','escape'] },
  { id: 'json_unesc',    label: 'JSON Unesc',    description: 'Unescape JSON special characters',        icon: 'J↓',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.JSON_UNESCAPE,  successMsg: 'JSON unescaped',   keywords: ['json','unescape'] },
  { id: 'html_esc',      label: 'HTML Esc',      description: 'Escape HTML entities in text',            icon: 'H↑',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HTML_ESCAPE,    successMsg: 'HTML escaped',     keywords: ['html','escape','entities'] },
  { id: 'html_unesc',    label: 'HTML Unesc',    description: 'Unescape HTML entities back to text',     icon: 'H↓',  color: 'indigo', tabs: ['encode','code'],        type: 'api', endpoint: ENDPOINTS.HTML_UNESCAPE,  successMsg: 'HTML unescaped',   keywords: ['html','unescape'] },

  // ──────────────── Developer ────────────────
  { id: 'json_fmt',      label: 'JSON Fmt',      description: 'Format and prettify JSON data',           icon: '{}',  color: 'gray', tabs: ['code','popular'],         type: 'api', endpoint: ENDPOINTS.FORMAT_JSON,    successMsg: 'JSON formatted',    keywords: ['json','format','prettify','beautify'] },
  { id: 'json_yaml',     label: 'JSON→YAML',     description: 'Convert JSON to YAML format',             icon: '→Y',  color: 'gray', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.JSON_TO_YAML,   successMsg: 'Converted to YAML', keywords: ['json','yaml','convert'] },
  { id: 'html_fmt',      label: 'HTML Fmt',      description: 'Format and prettify HTML code',           icon: '<>',  color: 'gray', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatHtml',                                    keywords: ['html','format','prettify'] },
  { id: 'css_fmt',       label: 'CSS Fmt',       description: 'Format and prettify CSS code',            icon: '#:',  color: 'gray', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatCss',                                     keywords: ['css','format','prettify'] },
  { id: 'js_fmt',        label: 'JS Fmt',        description: 'Format and prettify JavaScript code',     icon: 'JS',  color: 'gray', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatJs',                                      keywords: ['javascript','js','format'] },
  { id: 'ts_fmt',        label: 'TS Fmt',        description: 'Format and prettify TypeScript code',     icon: 'TS',  color: 'gray', tabs: ['code'],                   type: 'local', handlerKey: 'handleFormatTs',                                      keywords: ['typescript','ts','format'] },
  { id: 'fmt_settings',  label: 'Fmt Settings',  description: 'Configure formatter options',             icon: '⚙',   color: 'gray', tabs: ['code'],                   type: 'drawer', panelId: 'fmt',                                                   keywords: ['format','settings','config'] },
  { id: 'csv_json',      label: 'CSV→JSON',      description: 'Convert CSV data to JSON format',         icon: 'C→J', color: 'gray', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.CSV_TO_JSON,    successMsg: 'CSV converted to JSON',  keywords: ['csv','json','convert'] },
  { id: 'json_csv',      label: 'JSON→CSV',      description: 'Convert JSON data to CSV format',         icon: 'J→C', color: 'gray', tabs: ['code'],                   type: 'api', endpoint: ENDPOINTS.JSON_TO_CSV,    successMsg: 'JSON converted to CSV',  keywords: ['json','csv','convert'] },
  { id: 'jwt_decode',    label: 'JWT Decode',    description: 'Decode and inspect a JWT token',          icon: 'JWT', color: 'gray', tabs: ['code'],                   type: 'local', handlerKey: 'handleJwtDecode',                                     keywords: ['jwt','token','decode','auth'] },
  { id: 'regex_test',    label: 'Regex Test',    description: 'Test regular expressions on your text',   icon: '.*',  color: 'gray', tabs: ['code'],                   type: 'drawer', panelId: 'regex',                                                 keywords: ['regex','regular expression','test','pattern'] },

  // ──────────────── AI Tools ────────────────
  { id: 'fix_grammar',   label: 'Fix Grammar',    description: 'Automatically fix grammar mistakes',     icon: 'G',   color: 'pink', tabs: ['writing','ai','popular'], type: 'ai', handlerKey: 'handleFixGrammar',    keywords: ['grammar','fix','correct','spelling'] },
  { id: 'paraphrase',    label: 'Paraphrase',     description: 'Rewrite text with different words',      icon: '↻',   color: 'pink', tabs: ['writing','ai','popular'], type: 'ai', handlerKey: 'handleParaphrase',    keywords: ['paraphrase','rewrite','rephrase'] },
  { id: 'proofread',     label: 'Proofread',      description: 'Check text for errors and improvements', icon: '✓',   color: 'pink', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleProofread',     keywords: ['proofread','check','review','edit'] },
  { id: 'summarize',     label: 'Summarize',      description: 'Create a short summary of your text',    icon: 'Σ',   color: 'pink', tabs: ['writing','ai','popular'], type: 'ai', handlerKey: 'handleSummarize',     keywords: ['summarize','summary','shorten','brief'] },
  { id: 'eli5',          label: 'ELI5',           description: 'Explain text in simple, easy words',     icon: '5',   color: 'pink', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleEli5',          keywords: ['eli5','explain','simple','easy'] },
  { id: 'lengthen',      label: 'Lengthen',       description: 'Expand and add more detail to your text', icon: '⊕',  color: 'pink', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleLengthenText', keywords: ['lengthen','expand','longer','detail'] },
  { id: 'email_rewrite', label: 'Email Rewrite',  description: 'Rewrite text as a professional email',   icon: '✉',   color: 'pink', tabs: ['writing','ai'],           type: 'ai', handlerKey: 'handleEmailRewrite',  keywords: ['email','rewrite','professional'] },
  { id: 'tweet_shorten', label: 'Tweet Shorten',  description: 'Shorten text to fit in a tweet',         icon: '✂',   color: 'pink', tabs: ['ai','popular'],           type: 'ai', handlerKey: 'handleTweetShorten',  keywords: ['tweet','shorten','twitter','x'] },
  { id: 'hashtags',      label: 'Hashtags',       description: 'Generate relevant hashtags for content',  icon: '#',   color: 'pink', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleHashtags',      keywords: ['hashtag','social','generate'] },
  { id: 'seo_titles',    label: 'SEO Titles',     description: 'Generate SEO-optimized title suggestions', icon: 'SEO', color: 'pink', tabs: ['ai'],                  type: 'ai', handlerKey: 'handleSeoTitles',     keywords: ['seo','title','search','optimize'] },
  { id: 'meta_desc',     label: 'Meta Desc',      description: 'Generate meta descriptions for SEO',     icon: 'M:',  color: 'pink', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleMetaDescriptions', keywords: ['meta','description','seo'] },
  { id: 'blog_outline',  label: 'Blog Outline',   description: 'Create a structured blog post outline',  icon: '¶',   color: 'pink', tabs: ['ai','writing'],           type: 'ai', handlerKey: 'handleBlogOutline',   keywords: ['blog','outline','structure','plan'] },
  { id: 'keywords',      label: 'Keywords',       description: 'Extract important keywords from text',   icon: '⊕',   color: 'pink', tabs: ['ai','writing'],           type: 'ai', handlerKey: 'handleKeywords',      keywords: ['keyword','extract','important'] },
  { id: 'sentiment',     label: 'Sentiment',      description: 'Analyze the emotional tone of text',     icon: '♡',   color: 'pink', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleSentiment',     keywords: ['sentiment','emotion','feeling','analyze'] },
  { id: 'gen_title',     label: 'Gen Title',      description: 'Generate catchy titles for your content', icon: 'H',   color: 'pink', tabs: ['ai','writing'],          type: 'ai', handlerKey: 'handleGenerateTitle', keywords: ['title','generate','headline'] },
  { id: 'refactor_prompt', label: 'Refactor Prompt', description: 'Improve and optimize your AI prompt', icon: '↹',   color: 'pink', tabs: ['ai'],                    type: 'ai', handlerKey: 'handleRefactorPrompt', keywords: ['prompt','refactor','improve','ai'] },

  // AI with selectors
  { id: 'change_format', label: 'Format',         description: 'Change the format of your text',         icon: '⬡',   color: 'pink', tabs: ['ai','writing'],           type: 'select', handlerKey: 'handleChangeFormat', selectKey: 'formatSetting', setterKey: 'setFormatSetting', options: [['paragraph','Paragraph'],['bullets','Bullet Points'],['paragraph-bullets','Para + Points'],['numbered','Numbered List'],['qna','Q&A'],['table','Table'],['tldr','TL;DR + Detail'],['headings','With Headings']], keywords: ['format','paragraph','bullets','table'] },
  { id: 'change_tone',   label: 'Tone',           description: 'Change the tone of your writing',        icon: '🎭',  color: 'pink', tabs: ['ai','writing'],           type: 'select', handlerKey: 'handleChangeTone', selectKey: 'toneSetting', setterKey: 'setToneSetting', options: [['formal','Formal'],['casual','Casual'],['friendly','Friendly']], keywords: ['tone','formal','casual','friendly'] },
  { id: 'translate',     label: 'Translate',       description: 'Translate your text to another language', icon: '🌐', color: 'pink', tabs: ['language','ai','popular'], type: 'select', handlerKey: 'handleTranslate', selectKey: 'translateLang', setterKey: 'setTranslateLang', options: [['Spanish','Spanish'],['French','French'],['German','German'],['Hindi','Hindi'],['Chinese','Chinese'],['Japanese','Japanese'],['Korean','Korean'],['Portuguese','Portuguese'],['Italian','Italian'],['Arabic','Arabic'],['Russian','Russian'],['Dutch','Dutch'],['Turkish','Turkish'],['Bengali','Bengali']], keywords: ['translate','language','spanish','french','hindi','chinese'] },
  { id: 'transliterate', label: 'Translit',        description: 'Write text in another script',           icon: 'अ',  color: 'pink', tabs: ['language','ai'],           type: 'select', handlerKey: 'handleTransliterate', selectKey: 'translitLang', setterKey: 'setTranslitLang', options: [['Hindi','Hindi'],['Arabic','Arabic'],['Chinese','Chinese'],['Japanese','Japanese'],['Korean','Korean'],['Russian','Russian'],['Greek','Greek'],['Thai','Thai'],['Bengali','Bengali'],['Tamil','Tamil'],['Telugu','Telugu'],['Gujarati','Gujarati'],['Kannada','Kannada'],['Urdu','Urdu']], keywords: ['transliterate','script','hindi','arabic','urdu'] },

  // ──────────────── Compare & Generate ────────────────
  { id: 'compare',       label: 'Compare',         description: 'Compare two texts side by side',         icon: '⇄',  color: 'purple', tabs: ['transform'],             type: 'drawer', panelId: 'compare',    keywords: ['compare','diff','difference'] },
  { id: 'random_text',   label: 'Random Text',     description: 'Generate random placeholder text',       icon: '¶',  color: 'amber',  tabs: ['transform'],             type: 'drawer', panelId: 'randtext',   keywords: ['random','lorem','placeholder','generate'] },
  { id: 'password',      label: 'Password',        description: 'Generate a strong random password',      icon: '⚿',  color: 'amber',  tabs: ['transform','popular'],   type: 'drawer', panelId: 'password',   keywords: ['password','generate','random','security'] },

  // ──────────────── Utilities ────────────────
  { id: 'templates',     label: 'Templates',       description: 'Start with pre-made text templates',     icon: '📋', color: 'amber',   tabs: ['writing'],              type: 'drawer', panelId: 'templates',  keywords: ['template','preset','starter'] },
  { id: 'word_freq',     label: 'Word Freq',       description: 'Analyze word frequency in your text',    icon: 'W#', color: 'purple',   tabs: ['writing'],              type: 'local', handlerKey: 'handleWordFrequency', keywords: ['word','frequency','count','analyze'] },

  // ──────────────── Actions ────────────────
  { id: 'markdown',      label: 'Markdown',        description: 'Preview text as rendered Markdown',      icon: 'MD', color: 'indigo',   tabs: ['export','code'],        type: 'action', handlerKey: 'handleMarkdownMode', keywords: ['markdown','preview','render'] },
  { id: 'save_txt',      label: 'Save TXT',        description: 'Download text as a .txt file',           icon: '.txt', color: 'gray',   tabs: ['export'],               type: 'action', handlerKey: 'handleDownloadTxt',  keywords: ['download','save','txt','file'] },
  { id: 'save_pdf',      label: 'Save PDF',        description: 'Download text as a .pdf file',           icon: '.pdf', color: 'gray',   tabs: ['export'],               type: 'action', handlerKey: 'handleDownloadPdf',  keywords: ['download','save','pdf','file'] },
  { id: 'save_docx',     label: 'Save DOCX',       description: 'Download text as a .docx file',          icon: '.doc', color: 'gray',   tabs: ['export'],               type: 'action', handlerKey: 'handleDownloadDocx', keywords: ['download','save','docx','word','file'] },
  { id: 'save_json',     label: 'Save JSON',       description: 'Download text as a .json file',          icon: '{↓}', color: 'gray',   tabs: ['export','code'],         type: 'action', handlerKey: 'handleDownloadJson', keywords: ['download','save','json','file'] },
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
  { phrases: ['download','save','export'],                                  toolIds: ['save_txt','save_pdf','save_docx'] },
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
  { id: 'export_something',   text: 'Export your text in any format',          xp: 50, check: (ops) => ops.some(o => o.id?.startsWith('save_')) },
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
