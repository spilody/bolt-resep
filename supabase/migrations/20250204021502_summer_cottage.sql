/*
  # Create ingredients table

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `price_per_unit` (numeric, not null)
      - `unit` (text, not null)
      - `stock` (numeric, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `ingredients` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_per_unit numeric NOT NULL CHECK (price_per_unit > 0),
  unit text NOT NULL,
  stock numeric NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ingredients"
  ON ingredients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ingredients"
  ON ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients"
  ON ingredients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients"
  ON ingredients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ingredients_updated_at
  BEFORE UPDATE ON ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();