
import Stripe from 'stripe';

const PRICE_IDS = {
    monthly: 'price_1S9FswC5seLx7yR7SztdL6JE',
    annual:  'price_1S9FswC5seLx7yR7l17qdjXM',
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
        return new Response(JSON.stringify({ error: 'Invalid plan' }), {
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
