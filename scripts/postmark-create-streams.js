#!/usr/bin/env node
// Creates 20 Postmark broadcast message streams (one per topic) and writes
// the resulting stream ID map to config/postmark-streams.json.
// Safe to re-run — skips streams that already exist (409 = already exists).

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../config/postmark-streams.json');
const TOKEN = process.env.POSTMARK_SERVER_TOKEN;

if (!TOKEN) {
  console.error('POSTMARK_SERVER_TOKEN not set');
  process.exit(1);
}

const TOPICS = [
  { topic_id: 1,  topic_title: 'AI for Marketing & Outreach',                series: 'nonprofit', audience: 'Comms & development teams' },
  { topic_id: 2,  topic_title: 'AI for Fundraising Campaigns',               series: 'nonprofit', audience: 'Development leaders' },
  { topic_id: 3,  topic_title: 'AI for Donor Stewardship',                   series: 'nonprofit', audience: 'Donor relations teams' },
  { topic_id: 4,  topic_title: 'AI for Volunteer Engagement',                series: 'nonprofit', audience: 'Volunteer coordinators' },
  { topic_id: 5,  topic_title: 'AI for Program Delivery',                    series: 'nonprofit', audience: 'Program directors' },
  { topic_id: 6,  topic_title: 'AI for Advocacy & Awareness',                series: 'nonprofit', audience: 'Policy & comms teams' },
  { topic_id: 7,  topic_title: 'AI for Grant Prospecting & Reporting',       series: 'nonprofit', audience: 'Grants & institutional giving teams' },
  { topic_id: 8,  topic_title: 'AI for Impact Measurement',                  series: 'nonprofit', audience: 'Impact & reporting teams' },
  { topic_id: 9,  topic_title: 'AI for Organizational Readiness',            series: 'nonprofit', audience: 'Executive & operations leaders' },
  { topic_id: 10, topic_title: 'Leadership AIm - Nonprofit Edition',         series: 'nonprofit', audience: 'C-Suite' },
  { topic_id: 11, topic_title: 'AI for Marketing & Demand Generation',       series: 'corporate', audience: 'CMOs, growth leaders' },
  { topic_id: 12, topic_title: 'AI for Sales & Revenue Operations',          series: 'corporate', audience: 'CROs, revenue ops leaders' },
  { topic_id: 13, topic_title: 'AI for Customer Success',                    series: 'corporate', audience: 'CS leaders, account managers' },
  { topic_id: 14, topic_title: 'AI for Workforce & Partner Enablement',      series: 'corporate', audience: 'HR, partnerships' },
  { topic_id: 15, topic_title: 'AI for Product & Service Delivery',          series: 'corporate', audience: 'Operations & delivery leaders' },
  { topic_id: 16, topic_title: 'AI for Brand Influence & Thought Leadership',series: 'corporate', audience: 'Marketing & comms execs' },
  { topic_id: 17, topic_title: 'AI for Strategic Partnerships',              series: 'corporate', audience: 'Biz dev, enterprise sales' },
  { topic_id: 18, topic_title: 'AI for Business Intelligence & Performance', series: 'corporate', audience: 'Strategy, ops, finance' },
  { topic_id: 19, topic_title: 'AI for Digital Transformation',              series: 'corporate', audience: 'CIOs, COOs, CEOs' },
  { topic_id: 20, topic_title: 'Leadership AIm - Corporate Edition',         series: 'corporate', audience: 'C-Suite' },
];

async function createStream(topic) {
  const streamId = `topic-${topic.topic_id}`;
  const res = await fetch('https://api.postmarkapp.com/message-streams', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': TOKEN,
    },
    body: JSON.stringify({
      ID: streamId,
      Name: topic.topic_title,
      MessageStreamType: 'Broadcasts',
      Description: `${topic.audience} (${topic.series})`,
      SubscriptionManagementConfiguration: {
        UnsubscribeHandlingType: 'Postmark',
      },
    }),
  });

  const body = await res.json();

  if (res.ok) {
    console.log(`  ✓ Created: ${streamId} — ${topic.topic_title}`);
    return { streamId, ...body };
  } else if (res.status === 409) {
    console.log(`  ↩ Exists:  ${streamId} — ${topic.topic_title}`);
    return { streamId, ID: streamId, existing: true };
  } else {
    console.error(`  ✗ Failed:  ${streamId} — ${res.status} ${JSON.stringify(body)}`);
    return null;
  }
}

async function main() {
  console.log('Creating 20 Postmark broadcast streams...\n');

  const results = {};
  for (const topic of TOPICS) {
    const result = await createStream(topic);
    if (result) {
      results[topic.topic_id] = {
        stream_id: `topic-${topic.topic_id}`,
        topic_title: topic.topic_title,
        series: topic.series,
        audience: topic.audience,
      };
    }
  }

  writeFileSync(CONFIG_PATH, JSON.stringify(results, null, 2));
  console.log(`\nStream map written to config/postmark-streams.json`);
  console.log(`Total: ${Object.keys(results).length}/20 streams ready`);
}

main().catch(err => { console.error(err); process.exit(1); });
