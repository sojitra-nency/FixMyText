import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BROWSER_REGION } from '../utils/region'
import {
  useGetActivePassesQuery,
  useCreatePassOrderMutation,
  useCreateCreditOrderMutation,
  useVerifyPaymentMutation,
  useSpinWheelMutation,
} from '../store/api/passesApi'
import { openRazorpayCheckout, executeCheckoutFlow } from '../utils/razorpay'

export default function usePasses({ showAlert } = {}) {
  const { accessToken } = useSelector((s) => s.auth)
  const isAuthenticated = !!accessToken
  const navigate = useNavigate()

  const { data: activeData, refetch } = useGetActivePassesQuery(undefined, {
    skip: !isAuthenticated,
  })

  const [createPassOrder, { isLoading: passOrderLoading }] = useCreatePassOrderMutation()
  const [createCreditOrder, { isLoading: creditOrderLoading }] = useCreateCreditOrderMutation()
  const [verifyPayment] = useVerifyPaymentMutation()
  const [spinWheel, { isLoading: spinLoading }] = useSpinWheelMutation()

  const activePasses = activeData?.passes || []
  const activeCredits = activeData?.credits || []
  const totalCredits = activeData?.total_credits || 0

  const hasPassFor = useCallback((toolId) => {
    return activePasses.some(p => {
      const covers = p.tools_count === -1 || p.tool_ids.includes(toolId) || p.tool_ids.includes('*')
      const hasUses = p.uses_today < p.uses_per_day
      return covers && hasUses
    })
  }, [activePasses])

  // Buy a pass via Razorpay modal
  const handleBuyPass = useCallback(async (passId, toolIds = []) => {
    await executeCheckoutFlow({
      createOrder: () => createPassOrder({ pass_id: passId, tool_ids: toolIds, region: BROWSER_REGION || 'US' }).unwrap(),
      openCheckout: ({ order_id, amount, currency, key_id, user_email, user_name, onSuccess, onFailure }) =>
        openRazorpayCheckout({
          orderId: order_id, amount, currency, keyId: key_id,
          userEmail: user_email, userName: user_name,
          description: `FixMyText Pass — ${passId}`,
          onSuccess, onFailure,
        }),
      verifyPayment: (response) => verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        item_id: passId, item_type: 'pass', tool_ids: toolIds,
      }).unwrap(),
      successPath: '/dashboard?tab=subscription&purchase=success',
      failPath: '/dashboard?tab=subscription&purchase=verify-failed',
      showAlert,
      navigate,
    })
  }, [createPassOrder, verifyPayment, showAlert, navigate])

  // Buy credits via Razorpay modal
  const handleBuyCredits = useCallback(async (packId) => {
    await executeCheckoutFlow({
      createOrder: () => createCreditOrder({ pack_id: packId, region: BROWSER_REGION || 'US' }).unwrap(),
      openCheckout: ({ order_id, amount, currency, key_id, user_email, user_name, onSuccess, onFailure }) =>
        openRazorpayCheckout({
          orderId: order_id, amount, currency, keyId: key_id,
          userEmail: user_email, userName: user_name,
          description: `FixMyText Credits — ${packId}`,
          onSuccess, onFailure,
        }),
      verifyPayment: (response) => verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        item_id: packId, item_type: 'credit', tool_ids: [],
      }).unwrap(),
      successPath: '/dashboard?tab=subscription&purchase=success',
      failPath: '/dashboard?tab=subscription&purchase=verify-failed',
      showAlert,
      navigate,
    })
  }, [createCreditOrder, verifyPayment, showAlert, navigate])

  // Spin the wheel
  const handleSpin = useCallback(async () => {
    try {
      const result = await spinWheel().unwrap()
      return result
    } catch (err) {
      return { error: err.data?.detail || 'Spin failed' }
    }
  }, [spinWheel])

  return {
    activePasses,
    activeCredits,
    totalCredits,
    hasPassFor,
    handleBuyPass,
    handleBuyCredits,
    handleSpin,
    passOrderLoading,
    creditOrderLoading,
    spinLoading,
    refetchPasses: refetch,
  }
}
