import { build } from 'esbuild';
import { readdir } from 'fs/promises';
import path from 'path';

const inputDir = path.resolve('src/workers');
const outputDir = path.resolve('public/workers');

async function buildAllWorkers() {
  const files = await readdir(inputDir);

  const tsFiles = files.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  await Promise.all(
    tsFiles.map(async (file) => {
      const nameWithoutExt = path.parse(file).name;
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${nameWithoutExt}.js`);

      await build({
        entryPoints: [inputPath],
        bundle: true,
        outfile: outputPath,
        format: 'iife',
        target: ['es2020'],
        platform: 'browser',
      });

      console.log(`✔ Built ${file} → ${outputPath}`);
    }),
  );
}

buildAllWorkers().catch((err) => {
  console.error('❌ Worker build failed:', err);
  process.exit(1);
});
