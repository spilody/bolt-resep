import React from 'react';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { useRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from '../hooks/useRecipes';
import { RecipeModal } from '../components/RecipeModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { CreateRecipe, Recipe } from '../types/recipes';
import { Link } from 'react-router-dom';

export function Recipes() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | undefined>();

  const { data, isLoading, error } = useRecipes({ page, search });
  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe(selectedRecipe?.id || '');
  const deleteMutation = useDeleteRecipe();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCreateOrUpdate = async (formData: CreateRecipe) => {
    try {
      if (selectedRecipe) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      setSelectedRecipe(undefined);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(undefined);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const totalPages = Math.ceil((data?.total || 0) / 10);

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500">Error loading recipes: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Recipes</h1>
          <button
            onClick={() => {
              setSelectedRecipe(undefined);
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-md border border-gray-300">
              <div className="flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-md border-0 px-3 py-2 text-sm focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Ingredients
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : data?.recipes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No recipes found
                    </td>
                  </tr>
                ) : (
                  data?.recipes.map((recipe) => ( Continuing the Recipes.tsx file content from where we left off:

                    <tr key={recipe.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {recipe.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {recipe.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {recipe.total_ingredients || 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setIsModalOpen(true);
                          }}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(recipe.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(undefined);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedRecipe}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(undefined);
        }}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}