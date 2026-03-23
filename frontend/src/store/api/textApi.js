import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from './baseQuery'
import { getVisitorId } from '../../hooks/useFingerprint'

export const textApi = createApi({
  reducerPath: 'textApi',
  baseQuery: createBaseQueryWithReauth((headers) => {
    // Always send visitor fingerprint for server-side trial tracking
    headers.set('X-Visitor-Id', getVisitorId())
  }),
  endpoints: (builder) => ({
    transformText: builder.mutation({
      query: ({ endpoint, text, ...params }) => ({
        url: endpoint,
        method: 'POST',
        body: { text, ...params },
      }),
    }),
  }),
})

export const { useTransformTextMutation } = textApi
