import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { CreateRecipe, Recipe, RecipeIngredient, UpdateRecipe } from '../types/recipes';

const RECIPES_KEY = 'recipes';

interface UseRecipesOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useRecipes({ page = 1, limit = 10, search = '' }: UseRecipesOptions = {}) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: [RECIPES_KEY, { page, limit, search }],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        recipes: data as Recipe[],
        total: count || 0,
      };
    },
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: [RECIPES_KEY, id],
    queryFn: async () => {
      // Get recipe details
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (recipeError) throw recipeError;

      // Get recipe ingredients with ingredient details
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          *,
          ingredient:ingredients (*)
        `)
        .eq('recipe_id', id);

      if (ingredientsError) throw ingredientsError;

      return {
        ...recipe,
        ingredients: ingredients as RecipeIngredient[],
      };
    },
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecipe) => {
      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert recipe ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(
          data.ingredients.map(ingredient => ({
            recipe_id: recipe.id,
            ...ingredient,
          }))
        );

      if (ingredientsError) throw ingredientsError;

      return recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
    },
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRecipe) => {
      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          name: data.name,
          description: data.description,
          category: data.category,
        })
        .eq('id', id);

      if (recipeError) throw recipeError;

      if (data.ingredients) {
        // Delete existing ingredients
        const { error: deleteError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', id);

        if (deleteError) throw deleteError;

        // Insert new ingredients
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(
            data.ingredients.map(ingredient => ({
              recipe_id: id,
              ...ingredient,
            }))
          );

        if (ingredientsError) throw ingredientsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
    },
  });
}