import { z } from 'zod';

export const unitSchema = z.enum(['kg', 'g', 'pcs', 'l', 'ml']);
export type Unit = z.infer<typeof unitSchema>;

export const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  price_per_unit: z.number().positive('Price must be greater than 0'),
  unit: unitSchema,
  stock: z.number().min(0, 'Stock cannot be negative'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid()
});

export const createIngredientSchema = ingredientSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true
});

export const updateIngredientSchema = createIngredientSchema.partial();

export type Ingredient = z.infer<typeof ingredientSchema>;
export type CreateIngredient = z.infer<typeof createIngredientSchema>;
export type UpdateIngredient = z.infer<typeof updateIngredientSchema>;