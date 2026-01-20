
import Stripe from 'stripe';

export const onRequestPost = async (context) => {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16', // Pinning version for stability
        httpClient: Stripe.createFetchHttpClient(), // Ensure native fetch is used
    });

    try {
        // secure: strictly defined price to avoid client-side manipulation
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: context.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
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
