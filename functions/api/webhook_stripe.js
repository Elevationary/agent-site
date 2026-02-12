import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { request, env } = context;

    // Stripe Webhook Logic
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const signature = request.headers.get('stripe-signature');

    // Read the raw body
    const body = await request.text();
    let event;

    try {
        // In production, we must verify the signature
        if (env.STRIPE_WEBHOOK_SECRET) {
            event = await stripe.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);
        } else {
            // Fallback for dev/test
            event = JSON.parse(body);
        }
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const customerEmail = invoice.customer_email || invoice.email; // Fallback

        console.log(`💰 Payment Succeeded for ${customerEmail} (${customerId})`);

        if (customerEmail) {
            // 1. Update Identity (D1)
            try {
                // Check if user exists
                const existing = await env.DB.prepare(
                    'SELECT * FROM subscribers WHERE email = ?'
                ).bind(customerEmail).first();

                if (existing) {
                    await env.DB.prepare(
                        'UPDATE subscribers SET status = ?, stripe_customer_id = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
                    ).bind('active', customerId, customerEmail).run();
                } else {
                    await env.DB.prepare(
                        'INSERT INTO subscribers (stripe_customer_id, email, status, tier, marketing_status) VALUES (?, ?, ?, ?, ?)'
                    ).bind(customerId, customerEmail, 'active', 'premium', 'customer').run();
                }
                console.log(`✅ D1 Updated for ${customerEmail}`);
            } catch (e) {
                console.error('❌ D1 Update Failed:', e);
            }

            // 2. Feedback Loop (Instantly) -> Stop Marketing
            if (env.INSTANTLY_API_KEY) {
                try {
                    const instantlyResponse = await fetch('https://api.instantly.ai/api/v1/lead/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.INSTANTLY_API_KEY}`
                        },
                        body: JSON.stringify({
                            email: customerEmail,
                            delete_from_all_campaigns: true
                        })
                    });

                    const instResult = await instantlyResponse.json();
                    console.log(`🔥 Instantly Removal:`, instResult);
                } catch (e) {
                    console.error('❌ Instantly API Call Failed:', e);
                }
            }
        }
    }

    return new Response('Event Received', { status: 200 });
}
