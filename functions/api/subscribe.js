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
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email) {
      return new Response('Email required', { status: 400 });
    }

    // 1. Stripe customer (source of truth for identity)
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({ email });
      customerId = newCustomer.id;
    }

    // 2. D1 write (subscriber registry)
    try {
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
    }

    // 3. Postmark welcome email
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
        `Unsubscribe: ${unsubUrl}`
      ].join('\n');

      await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN
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
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' }
          ],
          MessageStream: 'outbound'
        })
      });
    }

    return Response.redirect(new URL('/success', request.url), 302);

  } catch (err) {
    console.error('Subscribe Error:', err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
