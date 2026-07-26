import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const images = [
  "about.png",
  "campaign-creators-gMsnXqILjp4-unsplash.jpg",
  "christina-wocintechchat-com-m-4PU-OC8sW98-unsplash.jpg",
  "christina-wocintechchat-com-m-rg1y72eKw6o-unsplash.jpg",
  "christina-wocintechchat-com-m-vzfgh3RAPzM-unsplash.jpg",
  "dmagical1.jpeg",
  "dmagical4.jpeg",
  "fatemeh-rezvani-MnPWB-ybjHQ-unsplash.jpg",
  "founders.jpeg",
  "istockphoto-2230831852-1024x1024.jpg",
  "Magical scent cover page (2).png",
  "nastuh-abootalebi-yWwob8kwOCk-unsplash.jpg",
  "partner with us.jpg",
  "partnership.jpg",
  "scott-graham-5fNmWej4tAA-unsplash.jpg",
  "uk-black-tech-dfmsZyFVi_I-unsplash.jpg",
  "where.png"
];

const sourceDirectory = path.resolve("image");
const outputDirectory = path.join(sourceDirectory, "optimized");
await mkdir(outputDirectory, { recursive: true });

for (const filename of images) {
  const source = path.join(sourceDirectory, filename);
  const output = path.join(outputDirectory, `${path.parse(filename).name}.webp`);
  await sharp(source)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(output);
}

console.log(`Optimized ${images.length} images in ${outputDirectory}`);
