import React from 'react';
import { X } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRecipeSchema, type CreateRecipe } from '../types/recipes';
import { IngredientSelector } from './IngredientSelector';
import type { Ingredient } from '../types/ingredients';

interface RecipeFormProps {
  onSubmit: (data: CreateRecipe) => void;
  initialData?: Partial<CreateRecipe>;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Main Course',
  'Appetizer',
  'Dessert',
  'Beverage',
  'Side Dish',
  'Snack',
];

export function RecipeForm({ onSubmit, initialData, isLoading }: RecipeFormProps) {
  const [step, setStep] = React.useState(1);
  const [selectedIngredient, setSelectedIngredient] = React.useState<Ingredient | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRecipe>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      category: '',
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const ingredients = watch('ingredients');

  const selectedIds = React.useMemo(() => {
    return ingredients?.map(i => i.ingredient_id) || [];
  }, [ingredients]);

  const calculateCost = () => {
    return fields.reduce((total, field, index) => {
      const ingredient = selectedIngredient;
      if (!ingredient) return total;
      return total + (ingredient.price_per_unit * ingredients[index].quantity);
    }, 0);
  };

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    append({ ingredient_id: ingredient.id, quantity: 1 });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Recipe Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                {...register('category')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <IngredientSelector
              onSelect={handleIngredientSelect}
              selectedIds={selectedIds}
              className="mb-4"
            />

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`ingredients.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-6 text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-medium text-gray-900">Recipe Summary</h3>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{watch('name')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{watch('category')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="text-sm text-gray-900">{watch('description')}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
              <ul className="mt-4 space-y-2">
                {fields.map((field, index) => (
                  <li key={field.id} className="flex justify-between text-sm">
                    <span className="text-gray-900">
                      {ingredients[index].quantity} units
                    </span>
                    <span className="text-gray-500">
                      ${(ingredients[index].quantity * (selectedIngredient?.price_per_unit || 0)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total Cost</span>
                  <span className="text-base font-medium text-gray-900">
                    ${calculateCost().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderStep()}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Previous
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Recipe'}
          </button>
        )}
      </div>
    </form>
  );
}