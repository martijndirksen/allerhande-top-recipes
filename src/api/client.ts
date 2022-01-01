import fetch from 'node-fetch';
import { Course } from '../models/course.js';
import { Paged } from '../models/paged.js';
import { createRecipe, Recipe } from '../models/recipe.js';
import { getWeightedRating } from '../util/weighted-rating.js';

const endpoint = 'https://www.ah.nl/gql';

const PAGE_SIZE = 35;

const getCourseFilterValue = (course: Course): string => {
  switch (course) {
    case Course.Main:
      return 'hoofdgerecht';
    case Course.Side:
      return 'bijgerecht';
    case Course.Dessert:
      return 'dessert';
    case Course.Appetizer:
      return 'voorgerecht';
    case Course.Snack:
      return 'borrelhapje';
    case Course.Lunch:
      return 'lunch';
    case Course.Cake:
      return 'gebak';
    case Course.Breakfast:
      return 'ontbijt';
    case Course.Brunch:
      return 'brunch';
    case Course.DrinksWithoutAlcohol:
      return 'drankje-zonder-alcohol';
  }

  return 'hoofdgerecht';
};

const createPayload = (course: Course, skip: number, take: number) => [
  {
    operationName: 'recipeSearch',
    variables: {
      query: {
        filters: [
          { group: 'menugang', values: [getCourseFilterValue(course)] },
        ],
        sortBy: 'RATINGS',
        start: skip,
        size: take,
        favoriteRecipeIds: [],
      },
    },
    query: `
query recipeSearch($query: RecipeSearchParams!) {
  recipeSearch(query: $query) {
    ...recipeSearch
    __typename
  }
}

fragment recipeSearch on RecipeSearchResult {
  correctedSearchTerm
  filters {
    ...recipeSearchFilterGroup
    __typename
  }
  page {
    total
    __typename
  }
  result {
    ...recipeSummary
    __typename
  }
  __typename
}

fragment recipeSearchFilterGroup on RecipeSearchResultFilterGroup {
  label
  name
  filters {
    ...recipeSearchFilter
    __typename
  }
  __typename
}

fragment recipeSearchFilter on RecipeSearchResultFilter {
  count
  group
  label
  name
  selected
  __typename
}

fragment recipeSummary on RecipeSummary {
  id
  title
  slug
  rating {
    average
    count
    __typename
  }
  __typename
}
`,
  },
];

async function doFetchRecipes(
  course: Course,
  skip: number,
  take: number
): Promise<Paged<Recipe>> {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(createPayload(course, skip, take)),
    headers: {
      'Content-Type': 'application/json',
      'client-name': 'ah-allerhande',
      'client-version': '1.662.1',
    },
  });

  const data: any = await response.json();
  const queryData = data[0]?.data?.recipeSearch;

  if (data[0]?.errors?.length)
    throw new Error(`Server returned error: ${JSON.stringify(data)}`);

  if (queryData?.result?.length == null)
    throw new Error(`Unexpected response: ${JSON.stringify(data)}`);

  return {
    page: 1 + Math.floor(skip / take),
    pageCount: +queryData.page.total,
    items: queryData.result.map((x: unknown) => createRecipe(x)),
  };
}

export async function fetchRecipes(course: Course): Promise<Recipe[]> {
  const firstPage = await doFetchRecipes(course, 0, PAGE_SIZE);
  const results: Recipe[] = [...firstPage.items];

  for (let currentPage = 1; currentPage < firstPage.pageCount; currentPage++) {
    try {
      const page = await doFetchRecipes(
        course,
        currentPage * PAGE_SIZE,
        PAGE_SIZE
      );
      results.push(...page.items);
    } catch (err) {
      break; // More results are unavailable. Page count seems to include unfetchable items (when not filtering) so we just keep fetching until it fails
    }
  }

  return results.sort((a, b) => getWeightedRating(b) - getWeightedRating(a));
}
