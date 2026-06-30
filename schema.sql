-- Database Schema for TACT Content OS

-- Enable uuid-ossp extension if needed (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    tone_of_voice TEXT,
    markets TEXT[], -- Array of target markets/countries
    platforms JSONB DEFAULT '[]'::jsonb, -- Array of publishing platforms
    content_verticals TEXT[], -- Array of content verticals
    brand_colors JSONB DEFAULT '{}'::jsonb,
    brand_fonts JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Content Pieces Table
CREATE TABLE IF NOT EXISTS content_pieces (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    platform VARCHAR(50),
    content_type VARCHAR(50),
    content_vertical VARCHAR(50),
    title TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) DEFAULT 'campaign',
    effort_level VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_content_pieces_brand_id ON content_pieces(brand_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_brand_id_date ON calendar_events(brand_id, event_date);
