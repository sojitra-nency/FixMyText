import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
    useGetTemplatesQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
} from '../store/api/userDataApi'

const STORAGE_KEY = 'tu-templates'

function loadTemplates() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function saveTemplates(templates) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export default function useTemplates(text, setText, showAlert) {
    const accessToken = useSelector((s) => s.auth.accessToken)
    const isAuthenticated = !!accessToken

    // Local state (used when not authenticated, or as initial value)
    const [localTemplates, setLocalTemplates] = useState(loadTemplates)
    const [templateName, setTemplateName] = useState('')

    // RTK Query — DB-backed templates when authenticated
    const { data: dbTemplates } = useGetTemplatesQuery(undefined, { skip: !isAuthenticated })
    const [apiCreate] = useCreateTemplateMutation()
    const [apiUpdate] = useUpdateTemplateMutation()
    const [apiDelete] = useDeleteTemplateMutation()

    // Persist local templates to localStorage (fallback for unauthenticated users)
    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => saveTemplates(localTemplates), 500)
            return () => clearTimeout(timer)
        }
    }, [localTemplates, isAuthenticated])

    // Use DB templates when authenticated, local otherwise
    const templates = isAuthenticated && dbTemplates
        ? dbTemplates.map(t => ({ name: t.name, text: t.text, id: t.id, createdAt: t.created_at, updatedAt: t.updated_at }))
        : localTemplates

    const handleSaveTemplate = useCallback(async () => {
        const name = templateName.trim()
        if (!name) { showAlert('Enter a template name', 'danger'); return }
        if (!text) { showAlert('Nothing to save', 'danger'); return }

        if (isAuthenticated) {
            const existing = templates.find(t => t.name === name)
            try {
                if (existing?.id) {
                    await apiUpdate({ id: existing.id, name, text }).unwrap()
                    showAlert(`Template "${name}" updated`, 'success')
                } else {
                    await apiCreate({ name, text }).unwrap()
                    showAlert(`Template "${name}" saved`, 'success')
                }
            } catch {
                showAlert('Failed to save template', 'danger')
            }
        } else {
            const exists = localTemplates.findIndex(t => t.name === name)
            if (exists >= 0) {
                setLocalTemplates(prev => prev.map((t, i) => i === exists ? { ...t, text, updatedAt: Date.now() } : t))
                showAlert(`Template "${name}" updated`, 'success')
            } else {
                setLocalTemplates(prev => [...prev, { name, text, createdAt: Date.now(), updatedAt: Date.now() }])
                showAlert(`Template "${name}" saved`, 'success')
            }
        }
        setTemplateName('')
    }, [templateName, text, isAuthenticated, templates, localTemplates, showAlert, apiCreate, apiUpdate])

    const handleLoadTemplate = useCallback((idx) => {
        const t = templates[idx]
        if (!t) return
        setText(t.text)
        showAlert(`Template "${t.name}" loaded`, 'success')
    }, [templates, setText, showAlert])

    const handleDeleteTemplate = useCallback(async (idx) => {
        const t = templates[idx]
        if (!t) return

        if (isAuthenticated && t.id) {
            try {
                await apiDelete(t.id).unwrap()
                showAlert(`Template "${t.name}" deleted`, 'success')
            } catch {
                showAlert('Failed to delete template', 'danger')
            }
        } else {
            const name = localTemplates[idx].name
            setLocalTemplates(prev => prev.filter((_, i) => i !== idx))
            showAlert(`Template "${name}" deleted`, 'success')
        }
    }, [templates, isAuthenticated, localTemplates, showAlert, apiDelete])

    const saveDirectly = useCallback(async (name, content) => {
        if (!name || !content) return

        if (isAuthenticated) {
            const existing = templates.find(t => t.name === name)
            try {
                if (existing?.id) {
                    await apiUpdate({ id: existing.id, name, text: content }).unwrap()
                } else {
                    await apiCreate({ name, text: content }).unwrap()
                }
                showAlert(`Template "${name}" saved`, 'success')
            } catch {
                showAlert('Failed to save template', 'danger')
            }
        } else {
            const exists = localTemplates.findIndex(t => t.name === name)
            if (exists >= 0) {
                setLocalTemplates(prev => prev.map((t, i) => i === exists ? { ...t, text: content, updatedAt: Date.now() } : t))
                showAlert(`Template "${name}" updated`, 'success')
            } else {
                setLocalTemplates(prev => [...prev, { name, text: content, createdAt: Date.now(), updatedAt: Date.now() }])
                showAlert(`Template "${name}" saved`, 'success')
            }
        }
    }, [isAuthenticated, templates, localTemplates, showAlert, apiCreate, apiUpdate])

    return {
        templates, templateName, setTemplateName,
        handleSaveTemplate, handleLoadTemplate, handleDeleteTemplate, saveDirectly,
    }
}
