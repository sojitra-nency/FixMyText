# Razorpay Setup Guide

## 1. Get API Keys

1. Go to [Razorpay Dashboard → API Keys](https://dashboard.razorpay.com/app/keys)
2. Click **"Generate Test Key"** (or "Regenerate" if you already have one)
3. Copy **Key ID** (`rzp_test_...`) and **Key Secret**
4. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```
5. Restart the backend

> **Note**: Use `rzp_test_` keys for development. Switch to `rzp_live_` for production.

---

## 2. How It Works

Razorpay uses a **modal-based checkout** — no redirect to an external page:

```
1. User clicks "Buy Now" on pricing page
2. Frontend calls POST /api/v1/passes/order
3. Backend creates a Razorpay Order → returns {order_id, amount, currency, key_id}
4. Frontend opens the Razorpay checkout modal (UPI, cards, wallets, net banking)
5. User pays inside the modal
6. Modal returns {razorpay_payment_id, razorpay_order_id, razorpay_signature}
7. Frontend calls POST /api/v1/passes/verify
8. Backend verifies signature → grants pass/credits
```

---

## 3. Test a Payment

1. Start the app:
   ```bash
   docker compose --profile dev up
   ```
2. Go to `http://localhost:3000/pricing`
3. Sign in (or create an account)
4. Click **"Buy Now"** on any pass
5. Razorpay modal opens — use test credentials below

### Test Cards

| Card Number              | Scenario           |
|--------------------------|--------------------|
| `4111 1111 1111 1111`    | Visa — Success     |
| `5104 0600 0000 0008`    | Mastercard — Success |

- **Expiry**: Any future date (e.g., `12/26`)
- **CVV**: Any 3 digits (e.g., `123`)
- **OTP** (if prompted): `1234`

### Test UPI

| UPI ID              | Scenario  |
|---------------------|-----------|
| `success@razorpay`  | Success   |
| `failure@razorpay`  | Failure   |

### Test Net Banking

- Select any bank → auto-succeeds in test mode

---

## 4. Webhook Setup

### Do I need webhooks?

**No — webhooks are completely optional.** The app works 100% without them.

All payments (passes, credits, Pro subscription) are confirmed via the `/verify` endpoint that the frontend calls immediately after payment succeeds in the modal. Webhooks are only a safety net for rare production edge cases (e.g., user closes browser mid-payment).

**For development**: Leave `RAZORPAY_WEBHOOK_SECRET=` empty in `.env`. Skip webhook setup entirely.

**For production**: Optionally set up webhooks as a backup (see below).

### Production webhook setup (optional)

1. Go to [Razorpay Dashboard → Webhooks](https://dashboard.razorpay.com/app/webhooks)
2. Click **"Create New Webhook"**
3. Fill in:

| Field | Value |
|-------|-------|
| **Webhook URL** | `https://yourdomain.com/api/v1/subscription/webhook` |
| **Secret** | Generate or type a strong secret |
| **Events** | `payment.authorized`, `payment.captured` |

4. Click **Save**
5. Copy the secret → set in production `.env`:
   ```
   RAZORPAY_WEBHOOK_SECRET=your_secret_here
   ```

> **Note**: Only `payment.authorized` and `payment.captured` events are available on all Razorpay plans. Subscription events (`subscription.charged`, `subscription.cancelled`) require Razorpay's Subscriptions feature which may need activation on your account. These are not needed — the app handles Pro subscription lifecycle entirely via API calls (`/verify` and `/cancel` endpoints).

### How webhook verification works

```
1. Razorpay sends POST to your webhook URL with:
   - Body: JSON event payload
   - Header: x-razorpay-signature (HMAC-SHA256 of body using your secret)

2. Backend verifies:
   HMAC-SHA256(body, webhook_secret) == x-razorpay-signature

3. If valid → process the event
4. If invalid → reject with 400
5. If RAZORPAY_WEBHOOK_SECRET is empty → skip verification (dev mode)
```

### What webhook events do

| Event | When | What we do |
|-------|------|------------|
| `payment.authorized` | Payment authorized by bank | No action (wait for capture) |
| `payment.captured` | Payment money received | Backup grant — passes/credits already granted via `/verify` endpoint |

---

## 5. Pro Subscription

Pro subscription uses Razorpay's Subscriptions API. The backend **lazily creates a Razorpay Plan** (₹399/mo) on first Pro upgrade request — no manual setup needed.

### Pro subscription flow

```
1. User clicks "Upgrade to Pro"
2. POST /api/v1/subscription/checkout → creates Razorpay Subscription
3. Frontend opens Razorpay modal with subscription_id
4. User pays first month (UPI/card/wallet)
5. Modal returns {razorpay_subscription_id, razorpay_payment_id, razorpay_signature}
6. POST /api/v1/subscription/verify → backend verifies + activates Pro
7. Cancel: POST /api/v1/subscription/cancel → downgrades to free
```

> **Note**: Pro plan creation happens lazily on first upgrade request, not at server startup. This means the server starts instantly without needing to call the Razorpay API.

---

## 6. Environment Variables

```bash
# Required — payments won't work without these
RAZORPAY_KEY_ID=rzp_test_...          # From dashboard.razorpay.com/app/keys
RAZORPAY_KEY_SECRET=...                # Same page

# Optional — leave empty for development
# Only needed if you set up webhooks in production
RAZORPAY_WEBHOOK_SECRET=
```

---

## 7. Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| 503 "Payments not configured" | `RAZORPAY_KEY_ID` is empty in `.env` | Add Razorpay keys and restart backend |
| Backend hangs on startup | Old version — plan creation was blocking startup | Update code — plan creation is now lazy |
| `net::ERR_CONNECTION_RESET` on all APIs | Backend container crashed | Check `docker logs fixmytext-backend-dev` and restart |
| Razorpay modal doesn't open | SDK not loaded | Check `<script src="https://checkout.razorpay.com/v1/checkout.js">` in `frontend/index.html` |
| "Payment verification failed" | Wrong key secret | Verify `RAZORPAY_KEY_SECRET` in `.env` matches dashboard |
| Pro not activating after payment | Verify endpoint failed | Check browser console for errors on `/subscription/verify` call |
| `ModuleNotFoundError: razorpay` | Docker image not rebuilt after requirements change | Run `docker compose --profile dev up --build` |

---

## 8. Useful Links

- [Razorpay Dashboard](https://dashboard.razorpay.com) — manage keys, webhooks, payments
- [API Keys](https://dashboard.razorpay.com/app/keys) — generate test/live keys
- [Test Cards & UPI](https://razorpay.com/docs/payments/payments/test-card-upi-details/) — all test credentials
- [API Docs](https://razorpay.com/docs/api/) — full API reference
- [Payment Verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#verify-payment-signature)
- [Subscriptions API](https://razorpay.com/docs/payments/subscriptions/)
