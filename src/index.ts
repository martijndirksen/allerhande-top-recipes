import { determineCourse } from './input/filter-questionnaire.js';
import { fetchRecipes } from './api/client.js';
import { writeRecipesToTextFile } from './output/text.js';

(async function () {
  const course = await determineCourse();

  console.log('Fetching recipes, this might take a while...');

  const recipes = await fetchRecipes(course);

  console.log(`Fetched ${recipes.length} recipes`);

  await writeRecipesToTextFile(recipes);

  console.log('Wrote output to output.txt');
})();
