-- ============================================================
-- DESTRUCTIVE RESET — first-time empty-database setup ONLY.
-- DO NOT run against a live database with subscriber data.
-- Use functions/api/schema.sql (safe migration) instead.
-- ============================================================

DROP TABLE IF EXISTS subscriber_events;
DROP TABLE IF EXISTS subscriber_topics;
DROP TABLE IF EXISTS subscribers;

CREATE TABLE subscribers (
    stripe_customer_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',
    tier TEXT DEFAULT 'free',
    marketing_status TEXT DEFAULT 'warm',
    has_payment_method INTEGER DEFAULT 0,
    lead_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriber_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_email TEXT NOT NULL,
    topic_id INTEGER NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subscriber_email, topic_id)
);

CREATE TABLE subscriber_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_email TEXT NOT NULL,
    event_type TEXT NOT NULL,
    topic_id INTEGER,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
