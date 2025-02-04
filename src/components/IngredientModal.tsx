import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIngredientSchema, type CreateIngredient, type Ingredient, type Unit } from '../types/ingredients';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIngredient) => void;
  ingredient?: Ingredient;
  isLoading?: boolean;
}

const units: Unit[] = ['kg', 'g', 'pcs', 'l', 'ml'];

export function IngredientModal({
  isOpen,
  onClose,
  onSubmit,
  ingredient,
  isLoading,
}: IngredientModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateIngredient>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: ingredient || {
      name: '',
      price_per_unit: 0,
      unit: 'pcs',
      stock: 0,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(ingredient || {
        name: '',
        price_per_unit: 0,
        unit: 'pcs',
        stock: 0,
      });
    }
  }, [isOpen, ingredient, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            {ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
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
              <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700">
                Price per Unit
              </label>
              <input
                type="number"
                id="price_per_unit"
                step="0.01"
                {...register('price_per_unit', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.price_per_unit && (
                <p className="mt-1 text-sm text-red-600">{errors.price_per_unit.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                id="unit"
                {...register('unit')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.toUpperCase()}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                step="0.01"
                {...register('stock', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}