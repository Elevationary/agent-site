import Stripe from 'stripe';

// Price IDs sourced from config/stripe-price-ids.json — regenerate via scripts/stripe-migrate-products.js
const PRICE_IDS = {
  'individual-access-monthly':  'price_1TQO5YC5seLx7yR7Ns5OFTKW',
  'individual-access-annual':   'price_1TQO5YC5seLx7yR7NHApxJx6',
  'functional-bundle-monthly':  'price_1TQO5ZC5seLx7yR75QYkQz4r',
  'functional-bundle-annual':   'price_1TQO5ZC5seLx7yR7PqWkPpiD',
  'all-access-pass-monthly':    'price_1TQO5ZC5seLx7yR75aIDlqvX',
  'all-access-pass-annual':     'price_1TQO5aC5seLx7yR7i21lyVVq',
};

export const onRequestPost = async (context) => {
  const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  let plan;
  try {
    const body = await context.request.json();
    plan = body.plan;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return new Response(JSON.stringify({ error: `Invalid plan: ${plan}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${new URL(context.request.url).origin}/premium/`,
      cancel_url: `${new URL(context.request.url).origin}/unlock/`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
