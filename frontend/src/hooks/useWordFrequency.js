export default function useWordFrequency(text, showAlert, setAiResult, setPreviewMode, pushHistory) {
    const handleWordFrequency = () => {
        if (!text) return
        const words = text.toLowerCase().match(/[a-z\u00C0-\u024F]+(?:'[a-z]+)?/gi)
        if (!words || words.length === 0) { showAlert('No words found', 'info'); return }
        const freq = {}
        for (const w of words) {
            const lower = w.toLowerCase()
            freq[lower] = (freq[lower] || 0) + 1
        }
        const entries = Object.entries(freq).sort((a, b) => b[1] - a[1])
        const total = words.length
        const unique = entries.length
        const lines = [
            `**Total words:** ${total} | **Unique:** ${unique}`,
            '',
            '| # | Word | Count | % |',
            '|---|------|------:|---:|',
        ]
        entries.forEach(([word, count], i) => {
            const pct = ((count / total) * 100).toFixed(1)
            lines.push(`| ${i + 1} | ${word} | ${count} | ${pct}% |`)
        })
        const result = lines.join('\n')
        setAiResult({ label: 'Word Frequency', result })
        setPreviewMode('result')
        if (pushHistory) pushHistory('Word Frequency', text, result, { toolId: 'word_freq', toolType: 'local' })
        showAlert(`${unique} unique words found`, 'success')
    }

    return { handleWordFrequency }
}
