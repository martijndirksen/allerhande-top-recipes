import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'process';
import { Course } from '../models/course.js';

export async function determineCourse(): Promise<Course> {
  console.log('Choose course');
  let i = 0;
  for (let c of Object.keys(Course).filter((x) => isNaN(+x))) {
    console.log(`[${++i}] \t${c}`);
  }

  const rl = createInterface({ input, output });

  return new Promise((resolve, _) => {
    rl.question('Your selection: ', (answer) => {
      resolve(Course[(+answer - 1) as unknown as keyof typeof Course]);
      rl.close();
    });
  });
}
