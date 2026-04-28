// Newsletter Manifest Poller — Cloudflare Worker (cron: every hour)
// Polls R2 for daily + Sunday manifests, checks approvals, sends via Postmark,
// renders premium content to KV for subscriber access at /insights/{slug}/{date}/.
//
// Manifest spec: /Users/jamesszmak/Antigravity_Data/Newsletter/docs/archives/
//   Content Manifest Spec — Agent Interface_26_04_24.md

const SITE = 'https://agent.elevationary.com';
const POSTMARK_API = 'https://api.postmarkapp.com';
const FIRST_RUN_KEY = 'newsletter/meta/poller-first-run-done.json';
const UNRESOLVED_VENDORS_KEY = 'newsletter/meta/unresolved-vendors.json';

const STREAM_MAP = { nonprofit: 'nonprofit', corporate: 'corporate' };

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function slugify(title) {
  return title.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');   // collapse consecutive hyphens (e.g. "AIm - Nonprofit" → no triple dash)
}

// ─── Markdown → HTML renderer ─────────────────────────────────────────────────

function renderMarkdown(md) {
  const lines = md.split('\n');
  const html = [];
  let inList = false;

  for (const raw of lines) {
    let line = raw;

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<hr>');
      continue;
    }
    // Headers
    if (/^### /.test(line)) { html.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (/^## /.test(line))  { html.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (/^# /.test(line))   { html.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    // Blockquote
    if (/^> /.test(line))   { html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    // List item
    if (/^- /.test(line)) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    // Close list on non-list line
    if (inList && line.trim() !== '') { html.push('</ul>'); inList = false; }
    // Empty line → paragraph break
    if (line.trim() === '') { html.push(''); continue; }
    // Default: paragraph
    html.push(`<p>${inline(line)}</p>`);
  }
  if (inList) html.push('</ul>');
  return html.join('\n');
}

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// ─── [LINK:] placeholder resolver ────────────────────────────────────────────

async function resolveLinks(content, env) {
  const placeholders = [...content.matchAll(/\[LINK:\s*([^|]+?)\s*\|\s*([^\]]+?)\s*\]/g)];
  if (!placeholders.length) return { content, unresolved: [] };

  const unresolved = [];
  let resolved = content;

  for (const match of placeholders) {
    const [full, vendorName, keyword] = match;
    const row = await env.DB.prepare('SELECT url FROM vendors WHERE name = ?')
      .bind(vendorName.trim()).first().catch(() => null);

    if (row?.url) {
      resolved = resolved.replace(full,
        `<a href="${row.url}" rel="dofollow">${escapeHtml(vendorName.trim())}</a>`);
    } else {
      // Fall back to plain text, log for manual resolution
      resolved = resolved.replace(full, escapeHtml(vendorName.trim()));
      unresolved.push({ vendor: vendorName.trim(), keyword: keyword.trim() });
    }
  }
  return { content: resolved, unresolved };
}

async function logUnresolvedVendors(env, date, topicId, unresolved) {
  if (!unresolved.length) return;
  let existing = [];
  try {
    const obj = await env.NEWSLETTER_BUCKET.get(UNRESOLVED_VENDORS_KEY);
    if (obj) existing = JSON.parse(await obj.text());
  } catch {}
  existing.push(...unresolved.map(u => ({ ...u, date, topic_id: topicId, logged_at: new Date().toISOString() })));
  await env.NEWSLETTER_BUCKET.put(UNRESOLVED_VENDORS_KEY, JSON.stringify(existing));
}

// ─── Premium content publisher → KV ──────────────────────────────────────────

function stripFrontmatter(md) {
  if (!md.startsWith('---')) return { meta: {}, body: md };
  const end = md.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: md };
  const yaml = md.slice(3, end).trim();
  const body = md.slice(end + 4).trim();
  const meta = {};
  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':');
    if (colon > -1) {
      const key = line.slice(0, colon).trim();
      meta[key] = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body };
}

async function publishPremiumContent(env, topic, r2Key, date, isWeekEnding = false) {
  const obj = await env.NEWSLETTER_BUCKET.get(r2Key);
  if (!obj) return null;

  const raw = await obj.text();
  const { meta, body } = stripFrontmatter(raw);

  // Resolve [LINK:] placeholders
  const { content: linkedBody, unresolved } = await resolveLinks(body, env);
  if (unresolved.length) await logUnresolvedVendors(env, date, topic.topic_id, unresolved);

  // Substitute {{ARCHIVE_URL}}
  const archiveUrl = `${SITE}/insights/archive/`;
  const substituted = linkedBody.replace(/\{\{ARCHIVE_URL\}\}/g, archiveUrl);

  // Render Markdown → HTML
  const articleHtml = renderMarkdown(substituted);

  const slug = topic.topic_slug || slugify(topic.topic_title);
  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(meta.title || topic.topic_title)} — Elevationary Thinking</title>
<meta name="robots" content="noindex,nofollow">
<style>
  body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#1a202c}
  h1{font-size:1.8rem;font-weight:800;margin-bottom:0.5rem}
  h2{font-size:1.25rem;font-weight:700;margin-top:2rem}
  h3{font-size:1.05rem;font-weight:700;margin-top:1.5rem}
  blockquote{border-left:4px solid #3182ce;margin:1.5rem 0;padding:0.5rem 1rem;background:#ebf8ff;border-radius:0 8px 8px 0}
  hr{border:none;border-top:1px solid #e2e8f0;margin:2rem 0}
  a{color:#3182ce}
  ul{padding-left:1.5rem}
  .meta{font-size:0.85rem;color:#718096;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #e2e8f0}
  .footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #e2e8f0;font-size:0.8rem;color:#718096}
</style>
</head>
<body>
<div class="meta">
  <strong>Elevationary Thinking</strong> · ${topic.topic_title}<br>
  ${isWeekEnding ? `Week ending ${date}` : date} · ${topic.audience}
</div>
${articleHtml}
<div class="footer">
  You have premium access. <a href="${SITE}/unlock/">Manage subscription</a> ·
  <a href="${SITE}/insights/archive/">Browse archive</a>
</div>
</body>
</html>`;

  // Store in KV
  const kvKey = `premium:${date}:${topic.topic_id}`;
  if (env.PREMIUM_CONTENT) {
    await env.PREMIUM_CONTENT.put(kvKey, pageHtml, {
      metadata: { topic_id: topic.topic_id, date, slug, title: meta.title || topic.topic_title },
    });
  }

  return { slug, kvKey, unresolved: unresolved.length };
}

// ─── Telegram ───────────────────────────────────────────────────────────────

async function tgPage(env, message) {
  if (!env.TELEGRAM_API_KEY || !env.TELEGRAM_USER_ID) return;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_API_KEY}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_USER_ID,
      text: `📬 <b>Newsletter Poller</b>\n${message}`,
      parse_mode: 'HTML',
    }),
  }).catch(e => console.error('Telegram error:', e));
}

// ─── HMAC unsubscribe token ──────────────────────────────────────────────────

async function generateUnsubToken(email, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// ─── Postmark batch send ─────────────────────────────────────────────────────

async function sendBatch(env, messages) {
  const res = await fetch(`${POSTMARK_API}/email/batch`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify(messages),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Postmark batch error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Send free newsletter for one topic ─────────────────────────────────────

async function sendTopic(env, topic, content, date) {
  const stream = STREAM_MAP[topic.series] || 'nonprofit';
  const subject = topic.free.subject_line;
  const unsubBase = `${SITE}/api/unsubscribe`;

  const rows = await env.DB.prepare(
    `SELECT s.email FROM subscribers s
     JOIN subscriber_topics st ON s.email = st.subscriber_email
     WHERE st.topic_id = ? AND s.status = 'active'`
  ).bind(topic.topic_id).all();

  if (!rows.results?.length) return 0;

  const BATCH_SIZE = 500;
  let sent = 0;

  for (let i = 0; i < rows.results.length; i += BATCH_SIZE) {
    const chunk = rows.results.slice(i, i + BATCH_SIZE);
    const messages = await Promise.all(chunk.map(async ({ email }) => {
      const unsubToken = env.UNSUBSCRIBE_SECRET
        ? await generateUnsubToken(email, env.UNSUBSCRIBE_SECRET) : '';
      const unsubUrl = `${unsubBase}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubToken)}`;
      return {
        From: 'Elevationary Thinking <newsletter@elevationary.com>',
        ReplyTo: 'replies@elevationary.com',
        To: email,
        Subject: subject,
        TextBody: `${content}\n\n---\nYou're receiving this because you subscribed at agent.elevationary.com.\nUnsubscribe: ${unsubUrl}`,
        HtmlBody: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;max-width:680px;">${escapeHtml(content)}</pre>
          <p style="font-size:0.8em;color:#999;">You're receiving this because you subscribed at agent.elevationary.com.<br>
          <a href="${unsubUrl}" style="color:#999;">Unsubscribe</a></p>`,
        MessageStream: stream,
        Headers: [
          { Name: 'List-Unsubscribe', Value: `<${unsubUrl}>` },
          { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' },
        ],
      };
    }));
    await sendBatch(env, messages);
    sent += chunk.length;
  }
  return sent;
}

// ─── First-run notification ──────────────────────────────────────────────────

async function checkFirstRun(env) {
  const existing = await env.NEWSLETTER_BUCKET.get(FIRST_RUN_KEY);
  if (!existing) {
    await tgPage(env, '🟢 <b>Poller is live in production.</b>\nNewsletter Agent: approve_send.ts is now safe to use for real sends.');
    await env.NEWSLETTER_BUCKET.put(FIRST_RUN_KEY, JSON.stringify({ first_run_at: new Date().toISOString() }));
  }
}

// ─── Daily manifest poll ─────────────────────────────────────────────────────

async function pollDaily(env, today) {
  const manifestKey = `newsletter/manifests/daily/${today}.json`;
  const manifestObj = await env.NEWSLETTER_BUCKET.get(manifestKey);
  if (!manifestObj) { console.log(`[poller] no daily manifest for ${today}`); return; }

  let manifest;
  try { manifest = JSON.parse(await manifestObj.text()); }
  catch (e) { throw new Error(`Malformed daily manifest JSON for ${today}: ${e.message}`); }

  const approvalKey = `newsletter/approved/daily/${today}.json`;
  const approvalObj = await env.NEWSLETTER_BUCKET.get(approvalKey);
  if (!approvalObj) { console.log(`[poller] no daily approval for ${today}`); return; }

  let approval;
  try { approval = JSON.parse(await approvalObj.text()); }
  catch (e) { throw new Error(`Malformed daily approval JSON for ${today}: ${e.message}`); }

  if (approval.notes?.includes('ORS test')) { console.log(`[poller] ORS test approval for ${today} — skip`); return; }
  if (approval.send_at && Date.now() < new Date(approval.send_at).getTime()) { return; }

  const sentKey = `newsletter/sent/daily/${today}.json`;
  if (!env._FORCE && await env.NEWSLETTER_BUCKET.get(sentKey)) { console.log(`[poller] already sent daily ${today}`); return; }

  const results = { sent: [], failed: [], published: [] };

  for (const topic of manifest.topics) {
    if (topic.status !== 'complete') {
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: topic.status });
      continue;
    }
    try {
      // Send free newsletter
      const contentObj = await env.NEWSLETTER_BUCKET.get(topic.free.r2_key);
      if (!contentObj) { results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: 'free content missing' }); continue; }
      const content = await contentObj.text();
      const recipients = await sendTopic(env, topic, content, today);
      results.sent.push({ id: topic.topic_id, title: topic.topic_title, recipients });

      // Publish premium content to KV
      if (topic.premium?.r2_key) {
        const pub = await publishPremiumContent(env, topic, topic.premium.r2_key, today);
        if (pub) results.published.push({ id: topic.topic_id, slug: topic.topic_slug || pub.slug, unresolved: pub.unresolved });
      }
    } catch (err) {
      console.error(`Daily topic ${topic.topic_id} error:`, err);
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: err.message });
    }
  }

  await env.NEWSLETTER_BUCKET.put(sentKey, JSON.stringify({ sent_at: new Date().toISOString(), results }));

  if (results.failed.length) {
    const failList = results.failed.map(f => `• T${f.id}: ${f.reason}`).join('\n');
    await tgPage(env, `⚠️ <b>Daily ${today} — ${results.failed.length} failed:</b>\n${failList}`);
  }
  const totalRecipients = results.sent.reduce((s, t) => s + t.recipients, 0);
  await tgPage(env,
    `✅ <b>Daily ${today} complete</b>\n` +
    `Sent: ${results.sent.length} topics | Recipients: ${totalRecipients} | Failed: ${results.failed.length}\n` +
    `Published to KV: ${results.published.length} premium pages`
  );
}

// ─── Sunday manifest poll ────────────────────────────────────────────────────

async function pollSunday(env, today) {
  // Check if today is Sunday (day 0) — Sunday manifests use the Sunday date
  const dayOfWeek = new Date(today + 'T00:00:00Z').getUTCDay();
  if (dayOfWeek !== 0) return; // Only poll on Sundays

  const manifestKey = `newsletter/manifests/sunday/${today}.json`;
  const manifestObj = await env.NEWSLETTER_BUCKET.get(manifestKey);
  if (!manifestObj) { console.log(`[poller] no sunday manifest for ${today}`); return; }

  let manifest;
  try { manifest = JSON.parse(await manifestObj.text()); }
  catch (e) { throw new Error(`Malformed sunday manifest JSON: ${e.message}`); }

  const weekEnding = manifest.week_ending || today;
  const approvalKey = `newsletter/approved/sunday/${weekEnding}.json`;
  const approvalObj = await env.NEWSLETTER_BUCKET.get(approvalKey);
  if (!approvalObj) { console.log(`[poller] no sunday approval for ${weekEnding}`); return; }

  let approval;
  try { approval = JSON.parse(await approvalObj.text()); }
  catch (e) { throw new Error(`Malformed sunday approval JSON: ${e.message}`); }

  if (approval.notes?.includes('ORS test')) { return; }
  if (approval.send_at && Date.now() < new Date(approval.send_at).getTime()) { return; }

  const sentKey = `newsletter/sent/sunday/${weekEnding}.json`;
  if (await env.NEWSLETTER_BUCKET.get(sentKey)) { return; }

  const results = { sent: [], failed: [], published: [] };

  for (const topic of manifest.topics) {
    if (topic.status !== 'complete') {
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: topic.status });
      continue;
    }
    try {
      const contentObj = await env.NEWSLETTER_BUCKET.get(topic.free.r2_key);
      if (!contentObj) { results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: 'free content missing' }); continue; }
      const content = await contentObj.text();
      const recipients = await sendTopic(env, topic, content, weekEnding);
      results.sent.push({ id: topic.topic_id, title: topic.topic_title, recipients });

      if (topic.premium?.r2_key) {
        const pub = await publishPremiumContent(env, topic, topic.premium.r2_key, weekEnding, true);
        if (pub) results.published.push({ id: topic.topic_id, slug: topic.topic_slug || pub.slug, unresolved: pub.unresolved });
      }
    } catch (err) {
      console.error(`Sunday topic ${topic.topic_id} error:`, err);
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: err.message });
    }
  }

  await env.NEWSLETTER_BUCKET.put(sentKey, JSON.stringify({ sent_at: new Date().toISOString(), results }));

  if (results.failed.length) {
    const failList = results.failed.map(f => `• T${f.id}: ${f.reason}`).join('\n');
    await tgPage(env, `⚠️ <b>Sunday ${weekEnding} — ${results.failed.length} failed:</b>\n${failList}`);
  }
  const totalRecipients = results.sent.reduce((s, t) => s + t.recipients, 0);
  await tgPage(env,
    `✅ <b>Sunday ${weekEnding} complete</b>\n` +
    `Sent: ${results.sent.length} topics | Recipients: ${totalRecipients} | Failed: ${results.failed.length}\n` +
    `Published to KV: ${results.published.length} premium pages`
  );
}

// ─── Main poll ───────────────────────────────────────────────────────────────

async function poll(env) {
  try {
    await _poll(env);
  } catch (err) {
    console.error('[poller] unhandled error:', err);
    await tgPage(env, `❌ <b>Poller crashed</b>\n${err.message}`);
  }
}

async function _poll(env) {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`[poller] running for ${today}`);
  await checkFirstRun(env);
  await pollDaily(env, today);
  await pollSunday(env, today);
}

// ─── Worker export ───────────────────────────────────────────────────────────

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(poll(env));
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/poll' && request.method === 'POST') {
      const auth = request.headers.get('Authorization');
      if (auth !== `Bearer ${env.POLLER_SECRET}`) return new Response('Unauthorized', { status: 401 });
      const force = url.searchParams.get('force') === 'true';
      ctx.waitUntil(poll(force ? { ...env, _FORCE: true } : env));
      return new Response(JSON.stringify({ triggered: true, force }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ status: 'newsletter-poller', cron: '0 * * * *' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
