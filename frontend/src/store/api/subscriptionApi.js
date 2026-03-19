import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query({
      query: () => '/api/v1/subscription/status',
      providesTags: ['Subscription'],
    }),

    // Razorpay: create subscription for Pro upgrade
    createProSubscription: builder.mutation({
      query: () => ({ url: '/api/v1/subscription/checkout', method: 'POST' }),
    }),

    // Razorpay: verify subscription payment
    verifyProSubscription: builder.mutation({
      query: (body) => ({ url: '/api/v1/subscription/verify', method: 'POST', body }),
      invalidatesTags: ['Subscription'],
    }),

    // Cancel Pro subscription
    cancelSubscription: builder.mutation({
      query: () => ({ url: '/api/v1/subscription/cancel', method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetSubscriptionStatusQuery,
  useCreateProSubscriptionMutation,
  useVerifyProSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi
