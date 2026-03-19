import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTransformTextMutation } from '../store/api/textApi'
import { ENDPOINTS } from '../constants/endpoints'

export default function useAiTools(text, setText, setMarkdownMode, setPreviewMode, showAlert, pushHistory) {
    const { accessToken } = useSelector((s) => s.auth)
    const [aiResult, setAiResult] = useState(null)
    const [toneSetting, setToneSetting] = useState('formal')
    const [formatSetting, setFormatSetting] = useState('paragraph')
    const [translateLang, setTranslateLang] = useState('Spanish')
    const [translitLang, setTranslitLang] = useState('Hindi')

    const [transformText] = useTransformTextMutation()

    const hasMarkdown = (str) => /[|#*\-]{2,}|^\s*[•\-\d]+[.)]\s|^\|.+\|$/m.test(str)

    const callAi = async (endpoint, label, errorMsg) => {
        if (!text) return
        if (!accessToken) {
            showAlert('Please log in to use AI tools', 'warning')
            return
        }
        const original = text
        try {
            const data = await transformText({ endpoint, text }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`${label} generated`, 'success')
        } catch (err) {
            if (err.status === 429) {
                showAlert(err.data?.detail || 'Daily AI limit reached. Upgrade to Pro for unlimited access.', 'warning')
            } else {
                showAlert(err.data?.detail || errorMsg, 'danger')
            }
        }
    }

    const handleHashtags         = () => callAi(ENDPOINTS.GENERATE_HASHTAGS,         'Hashtags',          'Could not generate hashtags. Please try again.')
    const handleSeoTitles        = () => callAi(ENDPOINTS.GENERATE_SEO_TITLES,        'SEO Titles',        'Could not generate SEO titles. Please try again.')
    const handleMetaDescriptions = () => callAi(ENDPOINTS.GENERATE_META_DESCRIPTIONS, 'Meta Descriptions', 'Could not generate meta descriptions. Please try again.')
    const handleBlogOutline      = () => callAi(ENDPOINTS.GENERATE_BLOG_OUTLINE,      'Blog Outline',      'Could not generate blog outline. Please try again.')
    const handleTweetShorten     = () => callAi(ENDPOINTS.SHORTEN_FOR_TWEET,          'Tweet',             'Could not shorten for tweet. Please try again.')
    const handleEmailRewrite     = () => callAi(ENDPOINTS.REWRITE_EMAIL,              'Email',             'Could not rewrite email. Please try again.')
    const handleKeywords         = () => callAi(ENDPOINTS.EXTRACT_KEYWORDS,           'Keywords',          'Could not extract keywords. Please try again.')
    const handleSummarize        = () => callAi(ENDPOINTS.SUMMARIZE,                  'Summary',           'Could not summarize text. Please try again.')
    const handleFixGrammar       = () => callAi(ENDPOINTS.FIX_GRAMMAR,                'Grammar Fix',       'Could not fix grammar. Please try again.')
    const handleParaphrase       = () => callAi(ENDPOINTS.PARAPHRASE,                 'Paraphrase',        'Could not paraphrase text. Please try again.')
    const handleSentiment        = () => callAi(ENDPOINTS.ANALYZE_SENTIMENT,          'Sentiment',         'Could not analyze sentiment. Please try again.')
    const handleLengthenText     = () => callAi(ENDPOINTS.LENGTHEN_TEXT,              'Lengthened',        'Could not lengthen text. Please try again.')
    const handleEli5             = () => callAi(ENDPOINTS.ELI5,                       'ELI5',              'Could not simplify text. Please try again.')
    const handleProofread        = () => callAi(ENDPOINTS.PROOFREAD,                  'Proofread',         'Could not proofread text. Please try again.')
    const handleGenerateTitle    = () => callAi(ENDPOINTS.GENERATE_TITLE,             'Titles',            'Could not generate titles. Please try again.')
    const handleRefactorPrompt   = () => callAi(ENDPOINTS.REFACTOR_PROMPT,            'Prompt Refactored', 'Could not refactor prompt. Please try again.')

    const handleChangeFormat = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Format (${formatSetting})`
            const data = await transformText({ endpoint: ENDPOINTS.CHANGE_FORMAT, text, format: formatSetting }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Reformatted as ${formatSetting}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || 'Could not change format. Please try again.', 'danger')
        }
    }

    const handleChangeTone = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Tone (${toneSetting})`
            const data = await transformText({ endpoint: ENDPOINTS.CHANGE_TONE, text, tone: toneSetting }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Tone changed to ${toneSetting}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || 'Could not change tone. Please try again.', 'danger')
        }
    }

    const handleTranslate = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Translation (${translateLang})`
            const data = await transformText({ endpoint: ENDPOINTS.TRANSLATE, text, target_language: translateLang }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Translated to ${translateLang}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || 'Could not translate text. Please try again.', 'danger')
        }
    }

    const handleTransliterate = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Transliteration (${translitLang})`
            const data = await transformText({ endpoint: ENDPOINTS.TRANSLITERATE, text, target_language: translitLang }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Transliterated to ${translitLang} script`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || 'Could not transliterate text. Please try again.', 'danger')
        }
    }

    const handleAiAccept = () => {
        if (aiResult) {
            setText(aiResult.result)
            if (hasMarkdown(aiResult.result)) setMarkdownMode(true)
            setAiResult(null)
        }
    }

    const handleAiDismiss = () => setAiResult(null)

    return {
        aiResult, setAiResult, hasMarkdown,
        toneSetting, setToneSetting,
        formatSetting, setFormatSetting,
        translateLang, setTranslateLang,
        translitLang, setTranslitLang,
        handleHashtags, handleSeoTitles, handleMetaDescriptions, handleBlogOutline,
        handleTweetShorten, handleEmailRewrite, handleKeywords,
        handleSummarize, handleFixGrammar, handleParaphrase,
        handleSentiment, handleLengthenText,
        handleEli5, handleProofread, handleGenerateTitle, handleRefactorPrompt,
        handleChangeFormat, handleChangeTone, handleTranslate, handleTransliterate,
        handleAiAccept, handleAiDismiss,
    }
}
