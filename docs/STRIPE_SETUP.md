# Stripe Setup Guide

Follow these steps to generate the required keys and product IDs for the Elevationary Agents site.

## 1. Create Account & Get Keys
1.  Log in to [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Ensure you are in **Test Mode** (toggle in top-right) for now.
3.  Go to **Developers** > **API keys**.
4.  Copy the **Publishable key** (starts with `pk_test_...`).
    *   *Note:* You do not need the Secret key yet for client-side checkout, but save it (`sk_test_...`) for future webhook verification.

## 2. Create the Product
1.  Go to **Products** > **Add Product**.
2.  **Name:** `Agent Insider Subscription`
3.  **Description:** `Monthly access to premium AI signals...`
4.  **Image:** Upload `assets/og-consulting-60.png` (optional).
5.  **Pricing Information:**
    *   **Pricing Model:** Standard pricing
    *   **Price:** $19.00
    *   **Recurring:** Monthly
6.  Click **Save product**.

## 3. Get the Price ID
1.  On the product page you just created, look for the **Pricing** section.
2.  Copy the **API ID** for the price (starts with `price_...`).
    *   *Important:* Do not use the Product ID (`prod_...`), use the **Price ID**.

## 4. Update Environment
Update your `.env` file (or provide to Agent):
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
```
