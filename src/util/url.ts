import { Recipe } from '../models/recipe.js';

export function createUrlFromRecipe(recipe: Recipe): string {
  if (!recipe)
    throw new Error('Cannot create url from null or undefined recipe');
  return `https://www.ah.nl/allerhande/recept/R-R${recipe.id}/${recipe.slug}`;
}
