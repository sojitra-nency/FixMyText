import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query({
      query: () => '/api/v1/subscription/status',
      providesTags: ['Subscription'],
    }),

    // Razorpay: create order for Pro upgrade (one-time payment)
    createProCheckout: builder.mutation({
      query: () => ({ url: '/api/v1/subscription/checkout', method: 'POST' }),
    }),

    // Razorpay: verify Pro payment
    verifyProPayment: builder.mutation({
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
  useCreateProCheckoutMutation,
  useVerifyProPaymentMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi
