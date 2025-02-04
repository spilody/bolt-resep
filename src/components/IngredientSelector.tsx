import React from 'react';
import { Search } from 'lucide-react';
import { useIngredients } from '../hooks/useIngredients';
import type { Ingredient } from '../types/ingredients';

interface IngredientSelectorProps {
  onSelect: (ingredient: Ingredient) => void;
  selectedIds?: string[];
  className?: string;
}

export function IngredientSelector({ onSelect, selectedIds = [], className = '' }: IngredientSelectorProps) {
  const [search, setSearch] = React.useState('');
  const { data, isLoading, error } = useIngredients({ search, limit: 100 });

  const filteredIngredients = React.useMemo(() => {
    return data?.ingredients.filter(ingredient => !selectedIds.includes(ingredient.id)) || [];
  }, [data?.ingredients, selectedIds]);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading ingredients: {error.message}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center rounded-md border border-gray-300">
        <div className="flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border-0 px-3 py-2 text-sm focus:outline-none focus:ring-0"
        />
      </div>

      <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            No ingredients found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredIngredients.map((ingredient) => (
              <li
                key={ingredient.id}
                onClick={() => onSelect(ingredient)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                    <p className="text-xs text-gray-500">
                      ${ingredient.price_per_unit} per {ingredient.unit}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Stock: {ingredient.stock} {ingredient.unit}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}