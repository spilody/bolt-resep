import React from 'react';
import { X } from 'lucide-react';
import { RecipeForm } from './RecipeForm';
import type { CreateRecipe } from '../types/recipes';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecipe) => void;
  initialData?: Partial<CreateRecipe>;
  isLoading?: boolean;
}

export function RecipeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: RecipeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>

          <div className="mt-4">
            <RecipeForm
              onSubmit={onSubmit}
              initialData={initialData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}