import { Recipe } from '../models/recipe.js';

export function getWeightedRating(recipe: Recipe): number {
  return (recipe?.rating?.average || 0) * (recipe?.rating?.count || 0);
}
