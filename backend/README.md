# GoSubsidy — Real Razorpay Integration

## 1. Backend dependency

From the backend folder:

```bash
npm install razorpay
```

If your backend does not already have Express:

```bash
npm install express
```

## 2. Add environment variables

Create/update the backend `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
PORT=4000
```

Never put `RAZORPAY_KEY_SECRET` in React/Vite `.env` variables that start with `VITE_`.

## 3. Add the backend route

Copy `paymentRoutes.js` to:

```text
backend/routes/paymentRoutes.js
```

Then add to your existing Express server:

```js
import paymentRoutes from "./routes/paymentRoutes.js";

app.use(express.json());
app.use("/api/payment", paymentRoutes);
```

If your server already calls `app.use(express.json())`, do not add it twice.

## 4. Replace the frontend PaymentModal

Copy `PaymentModal.jsx` to:

```text
src/components/premium/PaymentModal.jsx
```

The frontend now:
- creates the order on your server;
- opens the official Razorpay Checkout;
- lets Razorpay handle UPI, Cards and Net Banking;
- sends the successful checkout response to your backend;
- waits for server-side signature verification;
- only then calls `onSuccess()`.

## 5. Test mode

Create Razorpay Test Mode API keys in the Razorpay Dashboard.

Razorpay requires an Order to be created server-side before Checkout. The Checkout uses that `order_id`. The Key Secret must remain on the server. See the official documentation:
https://razorpay.com/docs/developer-tools/integrations/standard-checkout/

## 6. IMPORTANT: Supabase entitlement

The included `/api/payment/verify` verifies the Razorpay signature, but it intentionally does not yet write the entitlement to Supabase.

For production, the backend should create/update:

```text
user_entitlements
```

after successful verification, using the authenticated user's ID.

Do not use localStorage as the source of truth for paid access.

## 7. Production

Before accepting real money:
- switch to Live Mode keys;
- configure auto-capture;
- add webhook handling;
- store order/payment IDs;
- make entitlement creation idempotent;
- verify the signature server-side;
- keep the Key Secret server-only;
- use HTTPS.
