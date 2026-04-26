-- ============================================================
-- SAFE MIGRATION — safe to re-run against live database.
-- Uses CREATE TABLE IF NOT EXISTS throughout.
-- No DROP TABLE statements here — see scripts/d1-reset.sql
-- for first-time empty-database setup only.
-- ============================================================

-- Core subscriber registry
CREATE TABLE IF NOT EXISTS subscribers (
    stripe_customer_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',          -- active, unsubscribed, cancelled
    tier TEXT DEFAULT 'free',              -- free, tier1, tier2, tier3
    marketing_status TEXT DEFAULT 'warm',  -- cold, warm, customer
    has_payment_method INTEGER DEFAULT 0,  -- 1 if Stripe payment method on file
    lead_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topic subscriptions (which of the 20 swimlanes each subscriber receives)
CREATE TABLE IF NOT EXISTS subscriber_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_email TEXT NOT NULL,
    topic_id INTEGER NOT NULL,             -- 1–20 per Master Business Plan §3.3
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subscriber_email, topic_id)
);

-- Engagement events (opens, clicks, paywall hits — fed by Postmark webhooks)
CREATE TABLE IF NOT EXISTS subscriber_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_email TEXT NOT NULL,
    event_type TEXT NOT NULL,              -- open, click, paywall_click, bounce, unsubscribe
    topic_id INTEGER,
    metadata TEXT,                         -- JSON string for additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
