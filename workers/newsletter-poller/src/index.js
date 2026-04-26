// Newsletter Manifest Poller — Cloudflare Worker (cron: every hour)
// Reads daily manifests from R2, checks approval records, orchestrates
// Postmark broadcast sends per topic, pages James via Telegram on completion or failure.
//
// Manifest spec: /Users/jamesszmak/Antigravity_Data/Newsletter/docs/archives/
//   Content Manifest Spec — Agent Interface_26_04_24.md

const SITE = 'https://agent.elevationary.com';
const POSTMARK_API = 'https://api.postmarkapp.com';
const FIRST_RUN_KEY = 'newsletter/meta/poller-first-run-done.json';

// Series → Postmark broadcast stream
const STREAM_MAP = {
  nonprofit: 'nonprofit',
  corporate: 'corporate',
};

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

// ─── Send one topic to all its subscribers ───────────────────────────────────

async function sendTopic(env, topic, content, date) {
  const stream = STREAM_MAP[topic.series] || 'nonprofit';
  const subject = topic.free.subject_line;
  const unsubBase = `${SITE}/api/unsubscribe`;

  // Get all active subscribers for this topic
  const rows = await env.DB.prepare(
    `SELECT s.email FROM subscribers s
     JOIN subscriber_topics st ON s.email = st.subscriber_email
     WHERE st.topic_id = ? AND s.status = 'active'`
  ).bind(topic.topic_id).all();

  if (!rows.results?.length) {
    console.log(`Topic ${topic.topic_id}: no subscribers, skipping`);
    return 0;
  }

  // Build message batch (Postmark: max 500 per request)
  const BATCH_SIZE = 500;
  let sent = 0;

  for (let i = 0; i < rows.results.length; i += BATCH_SIZE) {
    const chunk = rows.results.slice(i, i + BATCH_SIZE);
    const messages = await Promise.all(chunk.map(async ({ email }) => {
      const unsubToken = env.UNSUBSCRIBE_SECRET
        ? await generateUnsubToken(email, env.UNSUBSCRIBE_SECRET) : '';
      const unsubUrl = `${unsubBase}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubToken)}`;

      return {
        From: `Elevationary Thinking <newsletter@elevationary.com>`,
        ReplyTo: 'replies@elevationary.com',
        To: email,
        Subject: subject,
        TextBody: `${content}\n\n---\nYou're receiving this because you subscribed at agent.elevationary.com.\nUnsubscribe: ${unsubUrl}`,
        HtmlBody: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;max-width:680px;">${escapeHtml(content)}</pre>
          <p style="font-size:0.8em;color:#999;">You're receiving this because you subscribed at agent.elevationary.com.<br>
          <a href="${unsubUrl}">Unsubscribe</a></p>`,
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
    await env.NEWSLETTER_BUCKET.put(
      FIRST_RUN_KEY,
      JSON.stringify({ first_run_at: new Date().toISOString() })
    );
  }
}

// ─── Main poll logic ─────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function poll(env) {
  try {
    await _poll(env);
  } catch (err) {
    console.error('[poller] unhandled error:', err);
    await tgPage(env, `❌ <b>Poller crashed</b>\n${err.message}`);
  }
}

async function _poll(env) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  console.log(`[poller] running for ${today}`);

  // Check first-run notification
  await checkFirstRun(env);

  // 1. Read manifest
  const manifestKey = `newsletter/manifests/daily/${today}.json`;
  const manifestObj = await env.NEWSLETTER_BUCKET.get(manifestKey);
  if (!manifestObj) {
    console.log(`[poller] no manifest for ${today}, skipping`);
    return;
  }
  let manifest;
  try { manifest = JSON.parse(await manifestObj.text()); }
  catch (e) { throw new Error(`Malformed manifest JSON for ${today}: ${e.message}`); }

  // 2. Read approval record
  const approvalKey = `newsletter/approved/daily/${today}.json`;
  const approvalObj = await env.NEWSLETTER_BUCKET.get(approvalKey);
  if (!approvalObj) {
    console.log(`[poller] no approval record for ${today}, skipping`);
    return;
  }
  let approval;
  try { approval = JSON.parse(await approvalObj.text()); }
  catch (e) { throw new Error(`Malformed approval JSON for ${today}: ${e.message}`); }

  // 3. Skip ORS test approvals
  if (approval.notes && approval.notes.includes('ORS test')) {
    console.log(`[poller] ORS test approval detected for ${today} — no-op`);
    return;
  }

  // 4. Check send_at scheduling
  if (approval.send_at) {
    const sendAt = new Date(approval.send_at);
    if (Date.now() < sendAt.getTime()) {
      console.log(`[poller] send_at is ${approval.send_at}, not yet time`);
      return;
    }
  }

  // 5. Check idempotency — don't re-send if already sent today
  const sentKey = `newsletter/sent/daily/${today}.json`;
  const alreadySent = await env.NEWSLETTER_BUCKET.get(sentKey);
  if (alreadySent) {
    console.log(`[poller] already sent for ${today}, skipping`);
    return;
  }

  // 6. Process topics
  const results = { sent: [], failed: [], skipped: [] };

  for (const topic of manifest.topics) {
    if (topic.status !== 'complete') {
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: topic.status });
      continue;
    }

    try {
      const contentObj = await env.NEWSLETTER_BUCKET.get(topic.free.r2_key);
      if (!contentObj) {
        results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: 'content not found in R2' });
        continue;
      }
      const content = await contentObj.text();
      const recipientCount = await sendTopic(env, topic, content, today);
      results.sent.push({ id: topic.topic_id, title: topic.topic_title, recipients: recipientCount });
    } catch (err) {
      console.error(`Topic ${topic.topic_id} send error:`, err);
      results.failed.push({ id: topic.topic_id, title: topic.topic_title, reason: err.message });
    }
  }

  // 7. Write sent record (idempotency)
  await env.NEWSLETTER_BUCKET.put(sentKey, JSON.stringify({
    sent_at: new Date().toISOString(),
    results,
  }));

  // 8. Telegram: failures
  if (results.failed.length) {
    const failList = results.failed.map(f => `• Topic ${f.id} (${f.title}): ${f.reason}`).join('\n');
    await tgPage(env, `⚠️ <b>${today} send — ${results.failed.length} topic(s) failed:</b>\n${failList}`);
  }

  // 9. Telegram: completion summary
  const totalRecipients = results.sent.reduce((sum, t) => sum + t.recipients, 0);
  await tgPage(env,
    `✅ <b>${today} send complete</b>\n` +
    `Topics sent: ${results.sent.length} | Failed: ${results.failed.length} | Skipped: ${results.skipped.length}\n` +
    `Total recipient sends: ${totalRecipients}`
  );

  console.log(`[poller] done. sent=${results.sent.length} failed=${results.failed.length}`);
}

// ─── Worker export ───────────────────────────────────────────────────────────

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(poll(env));
  },

  // HTTP handler for manual trigger / health check
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/poll' && request.method === 'POST') {
      const auth = request.headers.get('Authorization');
      if (auth !== `Bearer ${env.POLLER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      ctx.waitUntil(poll(env));
      return new Response(JSON.stringify({ triggered: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ status: 'newsletter-poller', cron: '0 * * * *' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
