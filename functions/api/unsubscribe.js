const SITE = 'https://agent.elevationary.com';

async function verifyToken(email, token, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  let sigBytes;
  try {
    sigBytes = Uint8Array.from(atob(token), c => c.charCodeAt(0));
  } catch {
    return false;
  }
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(email));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    return Response.redirect(`${SITE}/unsubscribed/?status=invalid`, 302);
  }

  if (env.UNSUBSCRIBE_SECRET) {
    const valid = await verifyToken(email, token, env.UNSUBSCRIBE_SECRET);
    if (!valid) {
      return Response.redirect(`${SITE}/unsubscribed/?status=invalid`, 302);
    }
  }

  try {
    await env.DB.prepare(
      "UPDATE subscribers SET status = 'unsubscribed' WHERE email = ?"
    ).bind(email).run();
  } catch (dbErr) {
    console.error('D1 unsubscribe error:', dbErr);
  }

  return Response.redirect(`${SITE}/unsubscribed/`, 302);
}
