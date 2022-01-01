import { createRecipeRating, RecipeRating } from './recipe-rating.js';

export interface Recipe {
  id?: number;
  title?: string;
  slug?: string;
  rating?: RecipeRating;
}

class RecipeImpl implements Recipe {
  id?: number;
  title?: string;
  slug?: string;
  rating?: RecipeRating;

  constructor(data: any) {
    if (typeof data !== 'object')
      throw new Error('Cannot construct recipe from given source');

    if (data.hasOwnProperty('id')) this.id = +data['id'];
    if (data.hasOwnProperty('title')) this.title = data['title'];
    if (data.hasOwnProperty('slug')) this.slug = data['slug'];
    if (data.hasOwnProperty('rating'))
      this.rating = createRecipeRating(data['rating']);
  }
}

export function createRecipe(data: any): Recipe {
  return new RecipeImpl(data);
}
