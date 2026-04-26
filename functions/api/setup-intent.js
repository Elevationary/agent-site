import Stripe from 'stripe';

// Returns a Stripe SetupIntent client_secret for optional CC capture at subscribe time.
// The frontend confirms the SetupIntent with Stripe.js, then passes the resulting
// payment_method_id to /api/subscribe.
export async function onRequestPost(context) {
  const { env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  try {
    const setupIntent = await stripe.setupIntents.create({
      usage: 'off_session',
      payment_method_types: ['card'],
    });

    return new Response(JSON.stringify({ client_secret: setupIntent.client_secret }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('SetupIntent error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
