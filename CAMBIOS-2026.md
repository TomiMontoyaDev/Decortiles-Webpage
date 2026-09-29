# Cambios web DECORTILES — septiembre 2026

## 1. Fotos del catálogo (IMPORTANTE antes de publicar)

El catálogo ahora es el mismo del `index.html` (90 referencias) y lee las fotos desde:

```
public/images/Primera entrega/...
public/images/Segunda entrega/...
public/images/Tercera entrega/...
public/images/Sanitarios/...
public/images/Lavamanos/...
```

Las 5 carpetas (las mismas del catálogo HTML) van dentro de `public/images/`, junto a `blog`, `catalogo`, `colecciones` e `icons`. Los nombres de carpetas y archivos deben quedar exactamente iguales (mayúsculas, espacios y extensión .png/.jpeg), porque el hosting distingue mayúsculas.
Si falta alguna foto, la tarjeta muestra un patrón de baldosa con el nombre (no una imagen rota).

## 2. Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Productos (nombre, formato, datos de caja, foto) | `lib/catalog-data.ts` |
| Productos destacados del home | `FEATURED_IDS` en `lib/catalog-data.ts` |
| Años de experiencia, WhatsApp, sedes, horario | `lib/site.ts` |
| Home | `app/page.tsx` |
| Catálogo (filtros, búsqueda, sanitarios, lavamanos, modal) | `components/decortiles/Catalog.tsx` |
| Estilos (colores originales: blanco, grises, azul plateado) | `app/decortiles.css` — la paleta está al inicio, en `:root` |

## 3. Colores y animaciones

- Se conservan los colores originales del sitio: fondo blanco, textos grises y acentos azul plateado
  (`--silver-blue-*` de `globals.css`), footer oscuro y fotos con sombra negra. Del catálogo HTML se tomó
  solo la organización y el diseño (hero, colección especial, filtros, tarjetas, sanitarios/lavamanos, banner).
- Animaciones nuevas: contadores (+13, 90+), cinta de categorías en movimiento, partículas flotantes en los
  héroes, barra de progreso de lectura bajo el menú, cortina al aparecer las fotos de proyectos, brillo que
  recorre los botones, íconos que giran en "Por qué DECORTILES", latido del botón de WhatsApp en sedes,
  títulos con entrada desenfocada. Todo se desactiva solo si el usuario tiene "reducir movimiento".

## 4. Lo que pidió William

- Sin precios en ninguna parte (se cotiza con asesor).
- © 2025 → © 2026.
- Se eliminó el catálogo vacío (el que dependía de la API de WordPress).
- "Más de 13 años" en todo el sitio (home, footer, quiénes somos, contacto).
- Foto del hero con el camión (`interior2.jpeg`) retirada; ahora el hero rota entre fotos de porcelanato gran formato.
- Texto principal: "Encuentra el acabado ideal para transformar tu espacio…" con CTA "Explorar catálogo" y "Hablar con un asesor".
- "Por qué elegirnos": "Te ayudamos a elegir bien para tu proyecto." + tarjetas Importadores directos / Disponibilidad y variedad / Asesoría personalizada.
- "Somos líderes en la industria…" reemplazado por "Experiencia que se nota en cada elección."

## 5. Estructura del home

Hero → Categorías → Productos destacados → Por qué DECORTILES → Proyectos/ambientes → +13 años → Sedes → Cotización.

## 6. Rutas del catálogo

- `/catalogo/` todo el catálogo
- `/catalogo/porcelanatos/`, `/catalogo/pisos/`, `/catalogo/paredes/`, `/catalogo/sanitarios/`, `/catalogo/lavamanos/`
- `/catalogo/porcelana-sanitaria/` (ruta antigua, muestra sanitarios)

## 7. Archivos eliminados (ya no se usan)

`ProductCatalog`, `ProductCatalogWrapper`, `SanitaryCatalog`, `ceramics-catalog`, `CategoryIndex`,
`FeaturedProducts`, `OutletProducts`, `shared/DynamicCategoryMenu` (todos leían la API de WordPress con precios).
`lib/api.ts` se conserva por si se vuelve a conectar WordPress.

## 8. Foto principal nueva (cuando William la envíe)

1. Guarda la foto en `public/images/hero-principal.jpg` (horizontal, mínimo 1920 px de ancho).
2. En `app/page.tsx`, dentro de `HERO_SLIDES`, pon como primera línea:
   `{ src: "/images/hero-principal.jpg", pos: "center 50%" },`
   (puedes borrar las otras si quieres una sola foto fija).

## 9. Nota

El build usa Google Fonts (`next/font/google`); necesita internet al compilar (Vercel/hosting normal lo tiene).
