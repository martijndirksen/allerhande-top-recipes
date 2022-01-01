export interface RecipeRating {
  average?: number;
  count?: number;
}

class RecipeRatingImpl implements RecipeRating {
  average?: number;
  count?: number;

  constructor(data: any) {
    if (typeof data !== 'object')
      throw new Error('Cannot construct recipe from given source');

    if (data.hasOwnProperty('average')) this.average = +data['average'];
    if (data.hasOwnProperty('count')) this.count = +data['count'];
  }
}

export function createRecipeRating(data: any): RecipeRating {
  return new RecipeRatingImpl(data);
}
