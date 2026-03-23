import { isRejectedWithValue } from '@reduxjs/toolkit'

/**
 * Global RTK Query error middleware.
 *
 * Only fires for **query** endpoints (GET requests) that fail silently
 * without component-level catch blocks. All mutations are handled
 * locally via .unwrap() + try/catch, so we skip them to avoid duplicates.
 */
export const errorMiddleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const { type: queryType } = action.meta?.arg ?? {}
        const endpoint = action.meta?.arg?.endpointName

        // Skip all mutations — they're handled at the component level
        if (queryType === 'mutation') {
            return next(action)
        }

        // Skip silent query endpoints (token refresh, getMe)
        const silentEndpoints = ['refresh', 'getMe', 'getPreferences', 'getGamification', 'getTemplates', 'getHistory', 'getHistoryStats']
        if (silentEndpoints.includes(endpoint)) {
            return next(action)
        }

        // Only fire for unhandled query failures
        const error = action.payload
        const detail = error?.data?.detail
        const message = typeof detail === 'string' ? detail : 'Something went wrong. Please try again.'

        window.dispatchEvent(
            new CustomEvent('rtk-api-error', {
                detail: { message, type: 'danger', endpoint, status: error?.status },
            })
        )
    }

    return next(action)
}
