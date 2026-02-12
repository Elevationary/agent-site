DROP TABLE IF EXISTS subscribers;
CREATE TABLE subscribers (
    stripe_customer_id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'inactive', -- active, inactive, churned
    tier TEXT DEFAULT 'free', -- free, premium
    marketing_status TEXT DEFAULT 'unknown', -- cold, warm, customer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
