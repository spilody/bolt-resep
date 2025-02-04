import { z } from 'zod';
import { ingredientSchema } from './ingredients';

export const recipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid()
});

export const recipeIngredientSchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  ingredient_id: z.string().uuid(),
  quantity: z.number().positive('Quantity must be greater than 0'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  // Include the ingredient details when joined
  ingredient: ingredientSchema.optional()
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  ingredients: z.array(z.object({
    ingredient_id: z.string().uuid(),
    quantity: z.number().positive('Quantity must be greater than 0')
  })).min(1, 'At least one ingredient is required')
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;