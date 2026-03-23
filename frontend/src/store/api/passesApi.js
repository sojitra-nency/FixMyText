import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'
import { BROWSER_REGION } from '../../utils/region'

export const passesApi = createApi({
  reducerPath: 'passesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Passes', 'Credits'],
  endpoints: (builder) => ({
    // Catalog (public)
    getPassCatalog: builder.query({
      query: () => `/api/v1/passes/catalog?region=${BROWSER_REGION || 'US'}`,
    }),

    // Active passes & credits (authenticated)
    getActivePasses: builder.query({
      query: () => '/api/v1/passes/active',
      providesTags: ['Passes', 'Credits'],
    }),

    // Razorpay: create order for pass purchase
    createPassOrder: builder.mutation({
      query: (body) => ({ url: '/api/v1/passes/order', method: 'POST', body }),
    }),

    // Razorpay: create order for credit purchase
    createCreditOrder: builder.mutation({
      query: (body) => ({ url: '/api/v1/passes/credit-order', method: 'POST', body }),
    }),

    // Razorpay: verify payment after modal success
    verifyPayment: builder.mutation({
      query: (body) => ({ url: '/api/v1/passes/verify', method: 'POST', body }),
      invalidatesTags: ['Passes', 'Credits'],
    }),

    // Spin wheel
    spinWheel: builder.mutation({
      query: () => ({ url: '/api/v1/passes/spin', method: 'POST' }),
      invalidatesTags: ['Passes', 'Credits'],
    }),

  }),
})

export const {
  useGetPassCatalogQuery,
  useGetActivePassesQuery,
  useCreatePassOrderMutation,
  useCreateCreditOrderMutation,
  useVerifyPaymentMutation,
  useSpinWheelMutation,
} = passesApi
