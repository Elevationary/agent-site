// Premium content gating Worker — /insights/{slug}/{date}/
// Checks subscriber tier, serves rendered HTML from KV, or redirects to /unlock/.

const SITE = 'https://agent.elevationary.com';

// Slug → topic_id map (must stay in sync with Master Business Plan §3.3)
const SLUG_TO_TOPIC = {
  'ai-for-marketing-and-outreach': 1,
  'ai-for-fundraising-campaigns': 2,
  'ai-for-donor-stewardship': 3,
  'ai-for-volunteer-engagement': 4,
  'ai-for-program-delivery': 5,
  'ai-for-advocacy-and-awareness': 6,
  'ai-for-grant-prospecting-and-reporting': 7,
  'ai-for-impact-measurement': 8,
  'ai-for-organizational-readiness': 9,
  'leadership-aim-nonprofit-edition': 10,
  'ai-for-marketing-and-demand-generation': 11,
  'ai-for-sales-and-revenue-operations': 12,
  'ai-for-customer-success': 13,
  'ai-for-workforce-and-partner-enablement': 14,
  'ai-for-product-and-service-delivery': 15,
  'ai-for-brand-influence-and-thought-leadership': 16,
  'ai-for-strategic-partnerships': 17,
  'ai-for-business-intelligence-and-performance': 18,
  'ai-for-digital-transformation': 19,
  'leadership-aim-corporate-edition': 20,
};

export async function onRequestGet(context) {
  const { params, env, request } = context;
  const slug = params.slug;
  const date = params.date;

  if (!slug || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.redirect(`${SITE}/unlock/`, 302);
  }

  const topicId = SLUG_TO_TOPIC[slug];
  if (!topicId) return Response.redirect(`${SITE}/unlock/`, 302);

  // Get subscriber email from cookie or session (Phase 1: query string for direct links)
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    // No email — redirect to unlock with return URL
    const returnUrl = encodeURIComponent(`${SITE}/insights/${slug}/${date}/`);
    return Response.redirect(`${SITE}/unlock/?next=${returnUrl}`, 302);
  }

  // Check subscriber access
  const subscriber = await env.DB.prepare(
    'SELECT tier, status FROM subscribers WHERE email = ?'
  ).bind(email).first().catch(() => null);

  // Path A: not a subscriber
  if (!subscriber || subscriber.status !== 'active') {
    return Response.redirect(`${SITE}/unlock/`, 302);
  }

  // Path B: free subscriber → redirect to unlock
  if (subscriber.tier === 'free') {
    return Response.redirect(`${SITE}/unlock/`, 302);
  }

  // Path D: paid subscriber → serve from KV
  if (!env.PREMIUM_CONTENT) {
    return new Response('Content service unavailable', { status: 503 });
  }

  const kvKey = `premium:${date}:${topicId}`;
  const html = await env.PREMIUM_CONTENT.get(kvKey);

  if (!html) {
    return new Response(`
      <html><body style="font-family:system-ui;max-width:600px;margin:4rem auto;padding:1rem;text-align:center;">
        <h1>Content not yet available</h1>
        <p>This edition hasn't been published yet. Check back shortly.</p>
        <p><a href="${SITE}">← Back to home</a></p>
      </body></html>
    `, { status: 404, headers: { 'Content-Type': 'text/html' } });
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'private, no-store',
    },
  });
}
