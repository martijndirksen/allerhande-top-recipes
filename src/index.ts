import { fetchRecipes } from './api/client.js';
import { writeRecipesToTextFile } from './output/text.js';

(async function () {
  const recipes = await fetchRecipes();

  console.log(`Fetched ${recipes.length} recipes`);

  await writeRecipesToTextFile(recipes);

  console.log('Wrote output to output.txt');
})();
