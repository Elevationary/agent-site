
import Stripe from 'stripe';

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

    const priceId = plan === 'annual'
        ? context.env.STRIPE_PRICE_ID_ANNUAL
        : plan === 'monthly'
            ? context.env.STRIPE_PRICE_ID_MONTHLY
            : null;

    if (!priceId) {
        return new Response(JSON.stringify({
            error: 'Invalid plan',
            debug_plan: plan,
            debug_monthly_set: !!context.env.STRIPE_PRICE_ID_MONTHLY,
            debug_annual_set: !!context.env.STRIPE_PRICE_ID_ANNUAL,
        }), {
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
