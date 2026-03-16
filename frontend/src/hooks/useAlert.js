/**
 * useAlert — manages stackable toast notifications.
 *
 * Usage:
 *   const { alerts, showAlert, dismissAlert } = useAlert();
 */
import { useState, useCallback, useRef } from 'react';

let nextId = 0;

export function useAlert() {
    const [alerts, setAlerts] = useState([]);
    const timers = useRef({});

    const dismissAlert = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const showAlert = useCallback((message, type = 'info', options = {}) => {
        const id = ++nextId;
        const duration = options.duration ?? (type === 'danger' ? 5000 : type === 'warning' ? 4000 : 2500);

        setAlerts((prev) => {
            // Cap at 5 visible toasts
            const next = prev.length >= 5 ? prev.slice(1) : prev;
            return [...next, { id, msg: message, type }];
        });

        if (duration > 0) {
            timers.current[id] = setTimeout(() => dismissAlert(id), duration);
        }

        return id;
    }, [dismissAlert]);

    // Backwards compatibility: expose `alert` as the latest alert (for components still using old API)
    const alert = alerts.length > 0 ? alerts[alerts.length - 1] : null;

    return { alert, alerts, showAlert, dismissAlert };
}
