// Genera miniaturas WebP livianas para el carrito, checkout y dashboard.
//   npm run thumbs
// Lee public/images/<carpeta>/* y escribe public/images/thumbs/<carpeta>/<nombre>.webp
// Solo regenera las que faltan o cuyo original cambió.
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/images");
const FOLDERS = ["Primera entrega", "Segunda entrega", "Tercera entrega", "Sanitarios", "Lavamanos"];
const WIDTH = 480;

let made = 0;
for (const folder of FOLDERS) {
  const src = path.join(ROOT, folder);
  const out = path.join(ROOT, "thumbs", folder);
  await mkdir(out, { recursive: true });
  for (const file of await readdir(src)) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const from = path.join(src, file);
    const to = path.join(out, file.replace(/\.\w+$/, ".webp"));
    const [a, b] = await Promise.all([stat(from), stat(to).catch(() => null)]);
    if (b && b.mtimeMs >= a.mtimeMs) continue;
    await sharp(from).rotate().resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toFile(to);
    made++;
  }
}
console.log(`Miniaturas generadas: ${made}`);
