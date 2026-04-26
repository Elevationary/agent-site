import Stripe from 'stripe';

const SITE = 'https://agent.elevationary.com';

async function generateUnsubToken(email, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  try {
    // Accept both JSON (full form) and formData (quick inline form on /unlock/)
    let email, topics = [], paymentMethodId = null;
    const contentType = request.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      topics = Array.isArray(body.topics) ? body.topics.map(Number) : [];
      paymentMethodId = body.payment_method_id || null;
    } else {
      const formData = await request.formData();
      email = formData.get('email');
      topics = formData.getAll('topics').map(Number);
    }

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Stripe customer (identity anchor)
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({ email });
      customerId = newCustomer.id;
    }

    // 2. Attach payment method if provided (optional CC capture via SetupIntent)
    let hasPaymentMethod = 0;
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      hasPaymentMethod = 1;
    }

    // 3. D1 write — fail hard; do not send welcome email to unregistered subscriber
    const existing = await env.DB.prepare(
      'SELECT stripe_customer_id, has_payment_method FROM subscribers WHERE email = ?'
    ).bind(email).first();

    if (!existing) {
      await env.DB.prepare(
        `INSERT INTO subscribers
         (stripe_customer_id, email, status, tier, marketing_status, has_payment_method)
         VALUES (?, ?, 'active', 'free', 'warm', ?)`
      ).bind(customerId, email, hasPaymentMethod).run();
    } else if (hasPaymentMethod && !existing.has_payment_method) {
      // Upgrade has_payment_method flag if CC was just added
      await env.DB.prepare(
        'UPDATE subscribers SET has_payment_method = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
      ).bind(email).run();
    }

    // 4. Persist topic subscriptions — require at least one valid topic when topics provided
    const validTopics = topics.filter(t => t >= 1 && t <= 20);
    if (topics.length > 0 && validTopics.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid topics selected. Choose at least one topic (1–20).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    for (const topicId of validTopics) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO subscriber_topics (subscriber_email, topic_id) VALUES (?, ?)`
      ).bind(email, topicId).run();
    }

    // 5. Postmark welcome email
    if (env.POSTMARK_SERVER_TOKEN) {
      const unsubToken = env.UNSUBSCRIBE_SECRET
        ? await generateUnsubToken(email, env.UNSUBSCRIBE_SECRET)
        : '';
      const unsubUrl = `${SITE}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubToken)}`;

      const htmlBody = `
        <p>Welcome to Elevationary Thinking.</p>
        <p>Every free "3-2-1" briefing cuts through the clutter — signals on AI agents, agentic commerce, and the strategies to do more, better, faster. Informed. Inspired. Challenged.</p>
        <p>Ready to go deeper? Premium analysis is one step away at <a href="${SITE}">agent.elevationary.com</a>.</p>
        <p style="margin-top:2rem;font-size:0.85em;color:#999;">
          You're receiving this because you signed up at agent.elevationary.com.<br>
          <a href="${unsubUrl}" style="color:#999;">Unsubscribe</a>
        </p>
      `.trim();

      const textBody = [
        'Welcome to Elevationary Thinking.',
        '',
        'Every free "3-2-1" briefing cuts through the clutter — signals on AI agents, agentic commerce, and the strategies to do more, better, faster. Informed. Inspired. Challenged.',
        '',
        `Ready to go deeper? Premium analysis is one step away at ${SITE}.`,
        '',
        '---',
        `You're receiving this because you signed up at agent.elevationary.com.`,
        `Unsubscribe: ${unsubUrl}`,
      ].join('\n');

      const pmRes = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
        },
        body: JSON.stringify({
          From: 'Elevationary Thinking <newsletter@elevationary.com>',
          ReplyTo: 'replies@elevationary.com',
          To: email,
          Subject: 'Welcome to Elevationary Thinking',
          HtmlBody: htmlBody,
          TextBody: textBody,
          Headers: [
            { Name: 'List-Unsubscribe', Value: `<${unsubUrl}>` },
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' },
          ],
          MessageStream: 'outbound',
        }),
      });

      if (!pmRes.ok) {
        const pmErr = await pmRes.text();
        throw new Error(`Postmark error ${pmRes.status}: ${pmErr}`);
      }
    }

    // JSON callers get a JSON response; form callers get a redirect
    if (contentType.includes('application/json')) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return Response.redirect(new URL('/success', request.url), 302);

  } catch (err) {
    console.error('Subscribe Error:', err);
    if ((request.headers.get('Content-Type') || '').includes('application/json')) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
