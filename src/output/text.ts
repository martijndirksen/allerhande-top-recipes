import { promises as fs } from 'fs';
import process from 'process';
import path from 'path';
import { EOL } from 'os';
import { Recipe } from '../models/recipe.js';
import { createUrlFromRecipe } from '../util/url.js';

const FILE_NAME = 'output.txt';

export async function writeRecipesToTextFile(recipes: Recipe[]) {
  const content =
    recipes?.map((x, i) => `${i + 1}.\t ${createUrlFromRecipe(x)}`).join(EOL) ||
    'No recipes found';

  try {
    await fs.writeFile(path.join(process.cwd(), FILE_NAME), content);
  } catch (err) {
    throw new Error(`Could not write output file: ${err}`);
  }
}
