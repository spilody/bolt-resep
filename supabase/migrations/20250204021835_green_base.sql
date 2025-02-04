/*
  # Create recipes and recipe ingredients tables

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `user_id` (uuid, foreign key to auth.users)

    - `recipe_ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key to recipes)
      - `ingredient_id` (uuid, foreign key to ingredients)
      - `quantity` (numeric, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE RESTRICT NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, ingredient_id)
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Policies for recipes
CREATE POLICY "Users can view their own recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recipe_ingredients
CREATE POLICY "Users can view recipe ingredients through recipes"
  ON recipe_ingredients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage recipe ingredients through recipes"
  ON recipe_ingredients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

-- Update triggers
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_ingredients_updated_at
  BEFORE UPDATE ON recipe_ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();