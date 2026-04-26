import Stripe from 'stripe';

// Three-path premium gating for paywall links in free newsletters.
// Called with POST { email, content_key } — returns { path, redirect_url }.
//
// Path A — not a subscriber:        redirect to /unlock/ (full paywall)
// Path B — free, no CC on file:     redirect to /unlock/ with Stripe checkout pre-selected
// Path C — free, CC on file:        redirect to /activate/ (one-click upgrade confirmation)
// Path D — paid subscriber:         redirect to the content URL directly

const SITE = 'https://agent.elevationary.com';

export async function onRequestPost(context) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  let email, contentKey;
  try {
    const body = await request.json();
    email = body.email;
    contentKey = body.content_key;
  } catch {
    return Response.redirect(`${SITE}/unlock/`, 302);
  }

  if (!email) return Response.redirect(`${SITE}/unlock/`, 302);

  const subscriber = await env.DB.prepare(
    'SELECT tier, status, has_payment_method FROM subscribers WHERE email = ?'
  ).bind(email).first();

  // Path A — not a subscriber at all
  if (!subscriber || subscriber.status !== 'active') {
    return new Response(JSON.stringify({ path: 'A', redirect: `${SITE}/unlock/` }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Path D — already paid
  if (subscriber.tier !== 'free') {
    const contentUrl = contentKey ? `${SITE}/premium/${contentKey}/` : `${SITE}/premium/`;
    return new Response(JSON.stringify({ path: 'D', redirect: contentUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Free subscriber — check CC on file
  if (subscriber.has_payment_method) {
    // Path C — one-click activate
    const activateUrl = `${SITE}/activate/?email=${encodeURIComponent(email)}${contentKey ? `&next=${encodeURIComponent(contentKey)}` : ''}`;
    return new Response(JSON.stringify({ path: 'C', redirect: activateUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Path B — free, no CC → standard checkout
  return new Response(JSON.stringify({ path: 'B', redirect: `${SITE}/unlock/` }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
