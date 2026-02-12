import Stripe from 'stripe';

export async function onRequestPost(context) {
    const { request, env } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    try {
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return new Response('Email required', { status: 400 });
        }

        // 1. Create Stripe Customer (Identity)
        // We check if they exist first ideally, but for now we create or get.
        const customers = await stripe.customers.list({ email: email, limit: 1 });
        let customerId;

        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            const newCustomer = await stripe.customers.create({ email: email });
            customerId = newCustomer.id;
        }

        // 2. Write to D1 (Registry)
        // Status 'free' until they pay
        try {
            // Check existence
            const existing = await env.DB.prepare(
                'SELECT * FROM subscribers WHERE email = ?'
            ).bind(email).first();

            if (!existing) {
                await env.DB.prepare(
                    'INSERT INTO subscribers (stripe_customer_id, email, status, tier, marketing_status) VALUES (?, ?, ?, ?, ?)'
                ).bind(customerId, email, 'active', 'free', 'warm').run();
            }
        } catch (dbErr) {
            console.error('D1 Error:', dbErr);
            // Don't fail the request just because DB write failed? Maybe strictly we should.
            // For now, proceed to email.
        }

        // 3. Send Postmark Welcome (Delivery)
        if (env.POSTMARK_SERVER_TOKEN) {
            await fetch('https://api.postmarkapp.com/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN
                },
                body: JSON.stringify({
                    "From": "james@elevationary.com", // TODO: Configurable Sender
                    "To": email,
                    "Subject": "Welcome to Elevationary",
                    "HtmlBody": "<strong>Welcome!</strong> You are now subscribed to the free tier.",
                    "TextBody": "Welcome! You are now subscribed to the free tier.",
                    "MessageStream": "outbound" // Transactional stream
                })
            });
        }

        // Redirect to Success Page
        return Response.redirect(new URL('/success', request.url), 302);

    } catch (err) {
        console.error('Subscribe Error:', err);
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}

