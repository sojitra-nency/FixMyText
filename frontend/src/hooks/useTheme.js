/**
 * useTheme — manages light/dark mode.
 * Syncs to DB when authenticated, falls back to localStorage.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../store/api/userDataApi';

const MODE_KEY = 'fmx_theme_mode';

function applyMode(mode) {
    if (mode === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
}

export function useTheme() {
    const [mode, setModeState] = useState(() => {
        const saved = localStorage.getItem(MODE_KEY) || 'dark';
        applyMode(saved);
        return saved;
    });

    const accessToken = useSelector((s) => s.auth.accessToken);
    const isAuthenticated = !!accessToken;
    const hydrated = useRef(false);

    const { data: prefs } = useGetPreferencesQuery(undefined, { skip: !isAuthenticated });
    const [updatePrefs] = useUpdatePreferencesMutation();

    // Hydrate from DB on first fetch
    useEffect(() => {
        if (prefs && !hydrated.current) {
            hydrated.current = true;
            if (prefs.theme && prefs.theme !== mode) {
                setModeState(prefs.theme);
                applyMode(prefs.theme);
                localStorage.setItem(MODE_KEY, prefs.theme);
            }
        }
    }, [prefs]);

    // Reset hydration on logout
    useEffect(() => {
        if (!isAuthenticated) hydrated.current = false;
    }, [isAuthenticated]);

    const setMode = useCallback((newMode) => {
        setModeState(newMode);
        applyMode(newMode);
        localStorage.setItem(MODE_KEY, newMode);
        if (isAuthenticated) {
            updatePrefs({ theme: newMode }).unwrap().catch(() => {});
        }
    }, [isAuthenticated, updatePrefs]);

    useEffect(() => { applyMode(mode); }, [mode]);

    return { mode, setMode }
}
