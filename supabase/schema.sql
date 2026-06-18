-- ═══════════════════════════════════════════════════════════════
-- OUTORA — Database Schema
-- Run this in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── Bookings ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Customer
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- Booking details
  tent_slug     TEXT NOT NULL,
  date_from     DATE NOT NULL,
  date_to       DATE NOT NULL,
  guests        INT  NOT NULL CHECK (guests >= 1 AND guests <= 17),
  region        TEXT,

  -- Extras & delivery
  extra_ids     TEXT[] DEFAULT '{}',
  delivery_type TEXT,    -- 'self' | 'delivery' | 'pickup'
  car_size      TEXT,

  -- Pricing
  base_price    INT NOT NULL DEFAULT 0,
  extras_price  INT NOT NULL DEFAULT 0,
  discount      INT NOT NULL DEFAULT 0,
  total_price   INT NOT NULL DEFAULT 0,
  promo_code    TEXT,

  -- Status
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','cancelled','completed')),

  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
                 CHECK (payment_status IN ('unpaid','deposit_paid','paid','refunded')),
  payment_ref    TEXT,

  notes         TEXT,

  CONSTRAINT no_overlap EXCLUDE USING gist (
    tent_slug WITH =,
    daterange(date_from, date_to, '[)') WITH &&
  )
);

-- ─── Indexes ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS bookings_tent_dates ON bookings (tent_slug, date_from, date_to);
CREATE INDEX IF NOT EXISTS bookings_status     ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_created    ON bookings (created_at DESC);

-- ─── RLS: customers can only read their own booking by phone ──────
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin (service role) has full access — handled via SUPABASE_SECRET_KEY
-- Public: no direct access (all writes go through API routes)

-- ─── Blocked dates (manual blocks by admin) ───────────────────────
CREATE TABLE IF NOT EXISTS blocked_dates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tent_slug  TEXT NOT NULL,
  date_from  DATE NOT NULL,
  date_to    DATE NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Helper: check availability ──────────────────────────────────
-- Returns true if the tent is available for the given date range
CREATE OR REPLACE FUNCTION is_tent_available(
  p_tent_slug TEXT,
  p_from      DATE,
  p_to        DATE
) RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE tent_slug = p_tent_slug
      AND status NOT IN ('cancelled')
      AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)')
  )
  AND NOT EXISTS (
    SELECT 1 FROM blocked_dates
    WHERE tent_slug = p_tent_slug
      AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)')
  );
$$;

-- ─── Helper: get booked ranges for a tent ───────────────────────
CREATE OR REPLACE FUNCTION get_booked_ranges(p_tent_slug TEXT)
RETURNS TABLE (date_from DATE, date_to DATE) LANGUAGE sql STABLE AS $$
  SELECT date_from, date_to FROM bookings
  WHERE tent_slug = p_tent_slug AND status NOT IN ('cancelled')
  UNION ALL
  SELECT date_from, date_to FROM blocked_dates
  WHERE tent_slug = p_tent_slug;
$$;

-- ═══════════════════════════════════════════════════════════════
-- WHATSAPP — Messages log, opt-out, agent queue
-- ═══════════════════════════════════════════════════════════════

-- ─── Message log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  direction      TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  phone          TEXT NOT NULL,
  contact_name   TEXT,
  message_text   TEXT,
  template_name  TEXT,
  wa_message_id  TEXT,
  booking_id     UUID REFERENCES bookings(id) ON DELETE SET NULL,
  status         TEXT NOT NULL DEFAULT 'sent'
                 CHECK (status IN ('sent','delivered','read','failed','received','pending'))
);

CREATE INDEX IF NOT EXISTS wa_messages_phone   ON whatsapp_messages (phone);
CREATE INDEX IF NOT EXISTS wa_messages_booking ON whatsapp_messages (booking_id);

-- ─── Opt-out list ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_optout (
  phone      TEXT PRIMARY KEY,
  opted_out  BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Agent queue (messages needing human reply) ───────────────────
CREATE TABLE IF NOT EXISTS whatsapp_agent_queue (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  phone        TEXT NOT NULL,
  contact_name TEXT,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'assigned', 'resolved'))
);

-- ─── Promo codes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  code             TEXT NOT NULL UNIQUE,
  discount_percent INT  NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100),
  max_uses         INT,
  used_count       INT  NOT NULL DEFAULT 0,
  valid_from       DATE,
  valid_until      DATE,
  active           BOOLEAN NOT NULL DEFAULT true
);
