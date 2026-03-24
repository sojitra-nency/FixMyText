import { useRef } from 'react'

export default function useExport(setLoading, showAlert) {
    const outputRef = useRef('')

    const setOutputText = (text) => { outputRef.current = text }

    const triggerDownload = (blob, filename) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleDownloadTxt = () => {
        triggerDownload(new Blob([outputRef.current], { type: 'text/plain' }), 'fixmytext-output.txt')
        showAlert('Downloaded as TXT', 'success')
    }

    const handleDownloadJson = () => {
        triggerDownload(
            new Blob([JSON.stringify({ output: outputRef.current }, null, 2)], { type: 'application/json' }),
            'fixmytext-output.json'
        )
        showAlert('Downloaded as JSON', 'success')
    }

    const handleDownloadPdf = async () => {
        setLoading(true)
        try {
            const { jsPDF } = await import('jspdf')
            const doc = new jsPDF()
            const lines = doc.splitTextToSize(outputRef.current, 180)
            doc.text(lines, 14, 20)
            doc.save('fixmytext-output.pdf')
            showAlert('Downloaded as PDF', 'success')
        } catch (err) {
            showAlert('PDF export failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadDocx = async () => {
        setLoading(true)
        try {
            const { Document, Paragraph, TextRun, Packer } = await import('docx')
            const paragraphs = outputRef.current.split('\n').map(line =>
                new Paragraph({ children: [new TextRun(line)] })
            )
            const wordDoc = new Document({ sections: [{ properties: {}, children: paragraphs }] })
            const blob = await Packer.toBlob(wordDoc)
            triggerDownload(blob, 'fixmytext-output.docx')
            showAlert('Downloaded as DOCX', 'success')
        } catch (err) {
            showAlert('DOCX export failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadCsv = () => {
        triggerDownload(new Blob([outputRef.current], { type: 'text/csv' }), 'fixmytext-output.csv')
        showAlert('Downloaded as CSV', 'success')
    }

    const handleDownloadMd = () => {
        triggerDownload(new Blob([outputRef.current], { type: 'text/markdown' }), 'fixmytext-output.md')
        showAlert('Downloaded as Markdown', 'success')
    }

    return {
        setOutputText,
        handleDownloadTxt, handleDownloadJson, handleDownloadPdf, handleDownloadDocx, handleDownloadCsv, handleDownloadMd,
    }
}
