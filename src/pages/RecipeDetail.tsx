import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRecipe } from '../hooks/useRecipes';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useRecipe(id!);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500">Error loading recipe: {error.message}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Recipe not found</p>
      </div>
    );
  }

  const totalCost = recipe.ingredients?.reduce((total, item) => {
    return total + (item.quantity * (item.ingredient?.price_per_unit || 0));
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/recipes"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{recipe.category}</p>
              {recipe.description && (
                <p className="mt-4 text-gray-700">{recipe.description}</p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
              <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ingredient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recipe.ingredients?.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {item.ingredient?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {item.quantity} {item.ingredient?.unit}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          ${item.ingredient?.price_per_unit.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                          ${(item.quantity * (item.ingredient?.price_per_unit || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                        Total Cost
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                        ${totalCost?.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}