import Stripe from 'stripe';

// One-click paid subscription activation for free subscribers with a CC on file.
// Uses the customer's saved default payment method to create a subscription immediately.

const PRICE_IDS = {
  'individual-access-monthly':  'price_1TQO5YC5seLx7yR7Ns5OFTKW',
  'individual-access-annual':   'price_1TQO5YC5seLx7yR7NHApxJx6',
  'functional-bundle-monthly':  'price_1TQO5ZC5seLx7yR75QYkQz4r',
  'functional-bundle-annual':   'price_1TQO5ZC5seLx7yR7PqWkPpiD',
  'all-access-pass-monthly':    'price_1TQO5ZC5seLx7yR75aIDlqvX',
  'all-access-pass-annual':     'price_1TQO5aC5seLx7yR7i21lyVVq',
};

const TIER_MAP = {
  'individual-access-monthly':  'tier1',
  'individual-access-annual':   'tier1',
  'functional-bundle-monthly':  'tier2',
  'functional-bundle-annual':   'tier2',
  'all-access-pass-monthly':    'tier3',
  'all-access-pass-annual':     'tier3',
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  let email, plan;
  try {
    ({ email, plan } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!email || !plan || !PRICE_IDS[plan]) {
    return new Response(JSON.stringify({ error: 'Missing email or invalid plan' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const subscriber = await env.DB.prepare(
    'SELECT stripe_customer_id, has_payment_method FROM subscribers WHERE email = ?'
  ).bind(email).first();

  if (!subscriber?.has_payment_method) {
    return new Response(JSON.stringify({ error: 'No payment method on file. Please use the standard checkout.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Create subscription using saved payment method
  const subscription = await stripe.subscriptions.create({
    customer: subscriber.stripe_customer_id,
    items: [{ price: PRICE_IDS[plan] }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await env.DB.prepare(
      "UPDATE subscribers SET tier = ?, status = 'active', updated_at = CURRENT_TIMESTAMP WHERE email = ?"
    ).bind(TIER_MAP[plan], email).run();

    return new Response(JSON.stringify({ success: true, subscription_id: subscription.id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Subscription requires additional payment confirmation. Please use standard checkout.' }), {
    status: 402,
    headers: { 'Content-Type': 'application/json' },
  });
}
