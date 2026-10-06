-- Create saved_listings table
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Policies are dropped before being created so this migration can be re-run
-- safely on databases where they already exist (Postgres has no
-- CREATE POLICY IF NOT EXISTS).

-- Users can view their own saves
DROP POLICY IF EXISTS "Users can view own saves" ON saved_listings;
CREATE POLICY "Users can view own saves"
  ON saved_listings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own saves
DROP POLICY IF EXISTS "Users can insert own saves" ON saved_listings;
CREATE POLICY "Users can insert own saves"
  ON saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own saves
DROP POLICY IF EXISTS "Users can delete own saves" ON saved_listings;
CREATE POLICY "Users can delete own saves"
  ON saved_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Allow counting saves for any listing (seller visibility)
DROP POLICY IF EXISTS "Anyone can count saves" ON saved_listings;
CREATE POLICY "Anyone can count saves"
  ON saved_listings FOR SELECT
  USING (true);
