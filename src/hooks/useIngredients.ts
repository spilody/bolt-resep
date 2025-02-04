import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { CreateIngredient, Ingredient, UpdateIngredient } from '../types/ingredients';

const INGREDIENTS_KEY = 'ingredients';

interface UseIngredientsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useIngredients({ page = 1, limit = 10, search = '' }: UseIngredientsOptions = {}) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: [INGREDIENTS_KEY, { page, limit, search }],
    queryFn: async () => {
      let query = supabase
        .from('ingredients')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        ingredients: data as Ingredient[],
        total: count || 0,
      };
    },
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredient: CreateIngredient) => {
      const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredient)
        .select()
        .single();

      if (error) throw error;
      return data as Ingredient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
    },
  });
}

export function useUpdateIngredient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredient: UpdateIngredient) => {
      const { data, error } = await supabase
        .from('ingredients')
        .update(ingredient)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Ingredient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
    },
  });