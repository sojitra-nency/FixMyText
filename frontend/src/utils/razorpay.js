/**
 * Opens the Razorpay checkout modal for one-time payments (passes/credits).
 */
export function openRazorpayCheckout({ orderId, amount, currency, keyId, userEmail, userName, description, onSuccess, onFailure }) {
  if (!window.Razorpay) {
    onFailure?.('Payment service unavailable. Please refresh the page.')
    return
  }
  const options = {
    key: keyId,
    amount,
    currency: currency.toUpperCase(),
    name: 'FixMyText',
    description: description || 'Pass / Credits Purchase',
    order_id: orderId,
    prefill: { email: userEmail, name: userName },
    theme: { color: '#007ACC' },
    handler(response) {
      // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      onSuccess(response)
    },
    modal: {
      ondismiss() {
        onFailure?.('Payment cancelled')
      },
    },
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

/**
 * Opens the Razorpay checkout modal for subscriptions (Pro).
 */
export function openRazorpaySubscription({ subscriptionId, keyId, userEmail, userName, onSuccess, onFailure }) {
  if (!window.Razorpay) {
    onFailure?.('Payment service unavailable. Please refresh the page.')
    return
  }
  const options = {
    key: keyId,
    subscription_id: subscriptionId,
    name: 'FixMyText',
    description: 'Pro — Unlimited Access',
    prefill: { email: userEmail, name: userName },
    theme: { color: '#007ACC' },
    handler(response) {
      // response = { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
      onSuccess(response)
    },
    modal: {
      ondismiss() {
        onFailure?.('Subscription cancelled')
      },
    },
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

/**
 * Shared checkout flow: create order -> open Razorpay -> verify -> navigate.
 * Reduces duplication across pass, credit, and subscription purchase hooks.
 */
export async function executeCheckoutFlow({
  createOrder,
  openCheckout,
  verifyPayment,
  successPath,
  failPath,
  showAlert,
  navigate,
  errorMessage = 'Failed to create order. Please try again.',
}) {
  try {
    const orderData = await createOrder()
    openCheckout({
      ...orderData,
      onSuccess: async (response) => {
        try {
          await verifyPayment(response)
          navigate(successPath)
        } catch {
          navigate(failPath)
        }
      },
      onFailure: (msg) => showAlert?.(msg || 'Payment cancelled', 'info'),
    })
  } catch (err) {
    showAlert?.(err?.data?.detail || errorMessage, 'danger')
  }
}
