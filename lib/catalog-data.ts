// ============================================================
// CATÁLOGO DECORTILES 2026 — fuente única de productos
// Generado a partir del catálogo HTML (index.html) — 90 referencias.
//
// Para agregar / editar un producto basta con tocar este arreglo.
// Las fotos van en /public/images/<carpeta>/<archivo>
//   (Primera entrega, Segunda entrega, Tercera entrega, Sanitarios, Lavamanos)
// No se manejan precios en la web: todo se cotiza con un asesor.
// ============================================================

export type CategoryId = "porcelanatos" | "paredes" | "pisos" | "sanitarios" | "lavamanos";

export interface CatalogProduct {
  id: string;
  category: CategoryId;
  /** "mallas" = mosaicos / cristanac dentro de Paredes */
  subtype?: "mallas";
  name: string;
  /** Línea + formato, ej. "Porcelanato 60×120" */
  collection: string;
  /** Etiqueta opcional: Mate, Brillante, HG… */
  tag?: string;
  /** Formato en cm, ej. "60×120 cm" */
  size?: string;
  /** Datos de caja: m² / kg / piezas */
  box?: string[];
  image: string;
}

export const PRODUCTS: CatalogProduct[] = [
  {"id": "p001", "category": "porcelanatos", "name": "Porcelanato Black gold brillante", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/1.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p002", "category": "porcelanatos", "name": "Porcelanato Labelo Chevron Satin", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/2.png", "tag": "Glossy", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p003", "category": "porcelanatos", "name": "Porcelanato Black Empire", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/3.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p004", "category": "porcelanatos", "name": "Porcelanato Essence Blue Matt", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/4.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p005", "category": "porcelanatos", "name": "Porcelanato SM002LT Rustic Mate", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/5.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p006", "category": "porcelanatos", "name": "Porcelanato Delton Black HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/6.png", "tag": "Brillo", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p007", "category": "porcelanatos", "name": "Porcelanato Narciso Aqua HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/7.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p008", "category": "porcelanatos", "name": "Porcelanato Moonlite Carving Mate", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/8.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p009", "category": "porcelanatos", "name": "Porcelanato Venzo Natural HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/9.png", "tag": "Brillante", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p010", "category": "porcelanatos", "name": "Porcelanato Indigo White HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/10.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p011", "category": "porcelanatos", "name": "Porcelanato White Gold HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/11.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p012", "category": "porcelanatos", "name": "Porcelanato Venato Gold", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/12.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p013", "category": "porcelanatos", "name": "Porcelanato Cimeelio Red HG", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/13.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p014", "category": "porcelanatos", "name": "Porcelanato Ice Berge HG Brillo", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/14.png", "tag": "Brillante", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p015", "category": "porcelanatos", "name": "Porcelanato Grey Waves Mate", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/15.png", "tag": "Mate", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p016", "category": "porcelanatos", "name": "Porcelanato Charnel Gold", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/16.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p017", "category": "porcelanatos", "name": "Porcelanato Golden Texture", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/17.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p018", "category": "porcelanatos", "name": "Porcelanato Enigma White Brilante", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/18.png", "tag": "Brillante", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p019", "category": "porcelanatos", "name": "Porcelanato Empirial White Mate", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/19.png", "tag": "Mate", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p020", "category": "porcelanatos", "name": "Porcelanato Calacata Grey", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/20.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p021", "category": "porcelanatos", "name": "Porcelanato Cloud White Matt", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/21.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p022", "category": "porcelanatos", "name": "Porcelanato 1710 Glossy", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/22.png", "tag": "Glossy", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p023", "category": "porcelanatos", "name": "Porcelanato Hexa Marble White", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/23.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p024", "category": "porcelanatos", "name": "Porcelanato Treak Wood", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/24.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p025", "category": "porcelanatos", "name": "Porcelanato Cava Beige", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/25.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p026", "category": "porcelanatos", "name": "Porcelanato Mosaico Terra Smool", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/26.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p027", "category": "porcelanatos", "name": "Porcelanato Stone Beige Wood", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/27.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p028", "category": "porcelanatos", "name": "Porcelanato Stone Aqua", "collection": "Porcelanato 60×120", "image": "/images/Tercera entrega/1.jpeg", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p029", "category": "porcelanatos", "name": "Porcelanato Vibren SKY", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/28.png", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p030", "category": "porcelanatos", "name": "Porcelanato Ecuador", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/31.jpeg", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p031", "category": "porcelanatos", "name": "Porcelanato Duque Grey", "collection": "Porcelanato 60×60", "image": "/images/Segunda entrega/11.png", "size": "60×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p032", "category": "porcelanatos", "name": "Porcelanato Urban Grey 60x60", "collection": "Porcelanato 60×60", "image": "/images/Segunda entrega/13.png", "tag": "Urban", "size": "60×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p033", "category": "porcelanatos", "name": "Porcelanato Armania H.G", "collection": "Porcelanato 60×120", "image": "/images/Primera entrega/30.jpeg", "size": "60×120 cm", "box": ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"]},
  {"id": "p034", "category": "paredes", "name": "Fachada Relieve 3D Grey", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/1.png", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p035", "category": "paredes", "name": "Fachada Silken Verde", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/4.png", "tag": "HG", "size": "30×60 cm", "box": ["1.08 m² x caja", "32 kg x caja", "6 piezas x caja"]},
  {"id": "p036", "category": "paredes", "name": "Fachada Chennai", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/6.png", "tag": "HG", "size": "30×60 cm", "box": ["0.90 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p037", "category": "paredes", "name": "Fachada R 7116D", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/8.png", "tag": "HG", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p038", "category": "paredes", "name": "Fachada Everest Espacato 8207", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/9.png", "tag": "HG", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p039", "category": "paredes", "name": "Fachada 3D Sanb Blue", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/10.png", "tag": "Mate", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p040", "category": "paredes", "name": "Fachada Relieve Natural Mix", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/16.png", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p041", "category": "paredes", "name": "Fachada Silken Gris", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/17.png", "size": "30×60 cm", "box": ["1.08 m² x caja", "32 kg x caja", "6 piezas x caja"]},
  {"id": "p042", "category": "paredes", "name": "Fachada Olimpia Mix Mate", "collection": "Paredes 38×56", "image": "/images/Segunda entrega/20.png", "tag": "Mate", "size": "38×56 cm", "box": ["1.74 m² x caja", "32 kg x caja", "8 piezas x caja"]},
  {"id": "p043", "category": "paredes", "name": "Pared Lexus", "collection": "Paredes 45×90", "image": "/images/Segunda entrega/21.png", "size": "45×90 cm", "box": ["1.62 m² x caja", "32 kg x caja", "4 piezas x caja"]},
  {"id": "p044", "category": "paredes", "name": "Pared Vintage Azul", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/22.png", "subtype": "mallas", "size": "30×60 cm", "box": ["0.90 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p045", "category": "paredes", "name": "Pared Esmaltada Fussion", "collection": "Paredes 45×90", "image": "/images/Segunda entrega/23.png", "subtype": "mallas", "size": "45×90 cm", "box": ["1.62 m² x caja", "32 kg x caja", "4 piezas x caja"]},
  {"id": "p046", "category": "paredes", "name": "Piso/Pared Acari Grafito", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/47.png", "size": "30×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "10 piezas x caja"]},
  {"id": "p047", "category": "paredes", "name": "Fachada Slate 06", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/26.png", "subtype": "mallas", "size": "30×60 cm", "box": ["0.90 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p048", "category": "paredes", "name": "Piso Pared Triboli", "collection": "Paredes 43×90", "image": "/images/Segunda entrega/29.png", "subtype": "mallas", "size": "43×90 cm", "box": ["1.54 m² x caja", "32 kg x caja", "4 piezas x caja"]},
  {"id": "p049", "category": "paredes", "name": "Pared Arequipa Mix Brillo", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/30.png", "subtype": "mallas", "size": "30×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "10 piezas x caja"]},
  {"id": "p050", "category": "paredes", "name": "Cristanac Opal Blue", "collection": "Mallas 30×30", "image": "/images/Segunda entrega/31.png", "subtype": "mallas", "size": "30×30 cm", "box": ["1 m² x caja", "12 kg x caja", "11 piezas x caja"]},
  {"id": "p051", "category": "paredes", "name": "Pared San Martin Danna Gold", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/39.png", "size": "30×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "10 piezas x caja"]},
  {"id": "p052", "category": "paredes", "name": "Fachada Morrocan", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/38.png", "size": "30×60 cm", "box": ["0.90 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p053", "category": "paredes", "name": "Piso/Pared Larice Greige Mate", "collection": "Pisos 30×60", "image": "/images/Segunda entrega/35.png", "size": "30×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "10 piezas x caja"]},
  {"id": "p054", "category": "paredes", "name": "Pared Malaga Turquesa E-6064", "collection": "Paredes 30×45", "image": "/images/Tercera entrega/2.jpeg", "size": "30×45 cm", "box": ["0.81 m² x caja", "10.5 kg x caja", "6 piezas x caja"]},
  {"id": "p055", "category": "paredes", "name": "Pared Altea White E-6020", "collection": "Paredes 30×45", "image": "/images/Tercera entrega/3.jpeg", "size": "30×45 cm", "box": ["0.81 m² x caja", "10.5 kg x caja", "6 piezas x caja"]},
  {"id": "p056", "category": "paredes", "name": "Pared Castellon Grey E-6050", "collection": "Paredes 30×45", "image": "/images/Tercera entrega/4.jpeg", "size": "30×45 cm", "box": ["0.81 m² x caja", "10.5 kg x caja", "6 piezas x caja"]},
  {"id": "p057", "category": "paredes", "name": "Pared Grid Navy 30x60", "collection": "Paredes 30×60", "image": "/images/Segunda entrega/46.png", "size": "30×60 cm", "box": ["1.62 m² x caja", "20 kg x caja", "8 piezas x caja"]},
  {"id": "p058", "category": "paredes", "name": "Pared Alicante Ocre", "collection": "Paredes 30×45", "image": "/images/Tercera entrega/5.jpeg", "size": "30×45 cm", "box": ["0.81 m² x caja", "10.5 kg x caja", "6 piezas x caja"]},
  {"id": "p059", "category": "paredes", "name": "Pared Yungay Marron", "collection": "Mallas 30×60", "image": "/images/Segunda entrega/34.png", "subtype": "mallas", "size": "30×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "10 piezas x caja"]},
  {"id": "p060", "category": "pisos", "name": "Piso Pierna Celeste", "collection": "Pisos 30×30", "image": "/images/Segunda entrega/36.png", "size": "30×30 cm", "box": ["2.34 m² x caja", "32 kg x caja", "25 piezas x caja"]},
  {"id": "p061", "category": "pisos", "name": "Piso 45925 Tampa", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/37.png", "size": "45×45 cm", "box": ["2.25 m² x caja", "28 kg x caja", "11 piezas x caja"]},
  {"id": "p062", "category": "pisos", "name": "Piso Piedra Gris", "collection": "Pisos 60×60", "image": "/images/Segunda entrega/40.png", "size": "60×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p063", "category": "pisos", "name": "Piso Caramelo 45818", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/41.png", "size": "45×45 cm", "box": ["2.25 m² x caja", "28 kg x caja", "11 piezas x caja"]},
  {"id": "p064", "category": "pisos", "name": "Piso Carrara Luz 45831", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/42.png", "size": "45×45 cm", "box": ["1.80 m² x caja", "28 kg x caja", "11 piezas x caja"]},
  {"id": "p065", "category": "pisos", "name": "Piso Summer Dark", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/43.png", "size": "45×45 cm", "box": ["1.33 m² x caja", "28 kg x caja", "12 piezas x caja"]},
  {"id": "p066", "category": "pisos", "name": "Piso Carrara Lux", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/44.png", "size": "45×45 cm", "box": ["1.62 m² x caja", "20 kg x caja", "8 piezas x caja"]},
  {"id": "p067", "category": "pisos", "name": "Piso Belaya Gris", "collection": "Pisos 51×51", "image": "/images/Segunda entrega/45.png", "size": "51×51 cm", "box": ["1.82 m² x caja", "32 kg x caja", "7 piezas x caja"]},
  {"id": "p068", "category": "pisos", "name": "Piso Andrea", "collection": "Pisos 44×45", "image": "/images/Segunda entrega/48.png", "size": "44×45 cm", "box": ["2.23 m² x caja", "32 kg x caja", "11 piezas x caja"]},
  {"id": "p069", "category": "pisos", "name": "Piso Cadis", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/49.png", "size": "45×45 cm", "box": ["1.62 m² x caja", "20 kg x caja", "8 piezas x caja"]},
  {"id": "p070", "category": "pisos", "name": "Piso Piedra Blanco", "collection": "Pisos 60×60", "image": "/images/Segunda entrega/50.png", "size": "60×60 cm", "box": ["1.80 m² x caja", "32 kg x caja", "5 piezas x caja"]},
  {"id": "p071", "category": "pisos", "name": "Piso Rustico Adagio Beige 56583", "collection": "Pisos 56×56", "image": "/images/Segunda entrega/12.png", "size": "56×56 cm", "box": ["2.20 m² x caja", "32 kg x caja", "7 piezas x caja"]},
  {"id": "p072", "category": "pisos", "name": "Piso Madera Remini 56550", "collection": "Pisos 56×56", "image": "/images/Segunda entrega/14.png", "tag": "Madera", "size": "56×56 cm", "box": ["1.88 m² x caja", "24 kg x caja", "6 piezas x caja"]},
  {"id": "p073", "category": "pisos", "name": "Piso Onix Cinza 56584", "collection": "Pisos 56×56", "image": "/images/Segunda entrega/18.png", "tag": "Onix", "size": "56×56 cm", "box": ["1.88 m² x caja", "24 kg x caja", "6 piezas x caja"]},
  {"id": "p074", "category": "pisos", "name": "Piso Ceral Triton Rustico", "collection": "Pisos 61×61", "image": "/images/Segunda entrega/2.png", "tag": "HG", "size": "61×61 cm", "box": ["2.65 m² x caja", "32 kg x caja", "7 piezas x caja"]},
  {"id": "p075", "category": "pisos", "name": "Piso Onyx Storm", "collection": "Pisos 30×60", "image": "/images/Segunda entrega/5.png", "tag": "HG", "size": "30×60 cm", "box": ["1.08 m² x caja", "19 kg x caja", "6 piezas x caja"]},
  {"id": "p076", "category": "pisos", "name": "Piso Geometric Grey", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/7.png", "tag": "HG", "size": "45×45 cm", "box": ["1.80 m² x caja", "28 kg x caja", "11 piezas x caja"]},
  {"id": "p077", "category": "pisos", "name": "Piso San Gabriel 45832", "collection": "Pisos 45×45", "image": "/images/Segunda entrega/33.png", "size": "45×45 cm", "box": ["2.25 m² x caja", "32 kg x caja", "11 piezas x caja"]},
  {"id": "p078", "category": "sanitarios", "name": "Porcelana Sanitario ZT-904", "collection": "Sanitarios Premium", "image": "/images/Sanitarios/ZT-904.jpeg", "box": ["45 kg x caja", "1 pieza x caja"]},
  {"id": "p079", "category": "sanitarios", "name": "Porcelana Sanitario ZT-S200", "collection": "Sanitarios Premium", "image": "/images/Sanitarios/ZT-S200.jpeg", "box": ["45 kg x caja", "1 pieza x caja"]},
  {"id": "p080", "category": "sanitarios", "name": "Porcelana Sanitario ZT-S200-R1", "collection": "Sanitarios Premium", "image": "/images/Sanitarios/ZT-S200-R1.jpeg", "box": ["45 kg x caja", "1 pieza x caja"]},
  {"id": "p081", "category": "sanitarios", "name": "Porcelana Sanitario ZT-S334", "collection": "Sanitarios Premium", "image": "/images/Sanitarios/ZT-S334.jpeg", "box": ["45 kg x caja", "1 pieza x caja"]},
  {"id": "p082", "category": "lavamanos", "name": "Lavamanos ZT 8043 Alongado", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/1.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p083", "category": "lavamanos", "name": "Lavamanos ZT 8022C", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/2.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p084", "category": "lavamanos", "name": "Lavamanos ZT 3018A-R14", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/3.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p085", "category": "lavamanos", "name": "Lavamanos ZT 2023B", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/4.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p086", "category": "lavamanos", "name": "Lavamanos ZT 3027", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/5.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p087", "category": "lavamanos", "name": "Lavamanos ZT 3017A-M2", "collection": "Lavamanos Premium", "image": "/images/Lavamanos/6.jpeg", "box": ["18 kg x caja", "1 pieza x caja"]},
  {"id": "p088", "category": "lavamanos", "name": "Placa ZT ES50", "collection": "Placa Sanitaria", "image": "/images/Lavamanos/7.jpeg", "box": ["1 kg x caja", "1 pieza x caja"]},
  {"id": "p089", "category": "lavamanos", "name": "Placa ZT E50", "collection": "Placa Sanitaria", "image": "/images/Lavamanos/8.jpeg", "box": ["1 kg x caja", "1 pieza x caja"]},
  {"id": "p090", "category": "lavamanos", "name": "Placa ZT ES60", "collection": "Placa Sanitaria", "image": "/images/Lavamanos/9.jpeg", "box": ["1 kg x caja", "1 pieza x caja"]},
];

// ------------------------------------------------------------
// Categorías (orden de los filtros y del menú)
// ------------------------------------------------------------
export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "porcelanatos", label: "Porcelanatos", blurb: "Gran formato para pisos y muros" },
  { id: "pisos", label: "Pisos", blurb: "Cerámica de alto tránsito" },
  { id: "paredes", label: "Paredes", blurb: "Revestimientos, mallas y mosaicos" },
  { id: "sanitarios", label: "Sanitarios", blurb: "Porcelana sanitaria línea premium" },
  { id: "lavamanos", label: "Lavamanos", blurb: "Lavamanos y placas sanitarias" },
];

export type SpecIcon = "size" | "layers" | "slip" | "seal" | "floor" | "wall" | "deco" | "ceramic";

/** Especificaciones rápidas por tipo de producto (mismas reglas del catálogo HTML) */
export function getSpecs(p: CatalogProduct): { icon: SpecIcon; label: string }[] {
  switch (p.category) {
    case "porcelanatos":
      return [
        { icon: "size", label: p.size ?? "60×120 cm" },
        { icon: "layers", label: "Acabado Premium" },
        { icon: "slip", label: "Antideslizante" },
        { icon: "seal", label: "Sellado 100%" },
        { icon: "floor", label: "Piso / Pared" },
      ];
    case "paredes":
      if (p.subtype === "mallas")
        return [
          { icon: "size", label: p.size ?? "30×30 cm" },
          { icon: "deco", label: "Mosaico Decorativo" },
          { icon: "seal", label: "Sellado 100%" },
          { icon: "wall", label: "Pared / Decoración" },
        ];
      return [
        { icon: "size", label: p.size ?? "30×60 cm" },
        { icon: "layers", label: "Acabado Premium" },
        { icon: "slip", label: "Antideslizante" },
        { icon: "seal", label: "Sellado 100%" },
        { icon: "wall", label: "Pared" },
      ];
    case "pisos":
      return [
        { icon: "size", label: p.size ?? "45×45 cm" },
        { icon: "layers", label: "Acabado Mate" },
        { icon: "slip", label: "Antideslizante" },
        { icon: "seal", label: "Sellado 100%" },
        { icon: "floor", label: "Piso" },
      ];
    case "sanitarios":
      return [
        { icon: "ceramic", label: "Cerámica Vitrificada" },
        { icon: "layers", label: "Línea Premium" },
      ];
    case "lavamanos":
      return [
        { icon: "ceramic", label: "Cerámica Vitrificada" },
        { icon: "seal", label: "Sellado 100%" },
      ];
  }
}

/** Ruta segura para imágenes con espacios en el nombre de carpeta */
export const imgSrc = (path: string) => encodeURI(path);

/** Productos que se muestran como "destacados" en el home */
export const FEATURED_IDS = ["p001", "p003", "p009", "p029", "p036", "p050", "p062", "p078"];

/** Producto de la colección especial (bloque destacado del catálogo, no está en la grilla) */
export const SPECIAL_PRODUCT: CatalogProduct = {
  id: "featured-sm001h",
  category: "porcelanatos",
  name: "Porcelanato Mosaico Terra SM001H",
  collection: "Colección Especial 2026",
  size: "60×120 cm",
  box: ["1.44 m² x caja", "27 kg x caja", "2 piezas x caja"],
  image: "/images/Primera entrega/29.png",
};

export const findProduct = (id: string): CatalogProduct | undefined =>
  id === SPECIAL_PRODUCT.id ? SPECIAL_PRODUCT : PRODUCTS.find((p) => p.id === id);

/** Miniatura WebP generada con `npm run thumbs` (carrito, checkout, dashboard) */
export const thumbSrc = (path: string) =>
  path.replace(/^\/images\/([^/]+)\/([^/]+)\.\w+$/, "/images/thumbs/$1/$2.webp");

/** Sanitarios y lavamanos son fotos de producto sobre blanco: se muestran completas, sin recortar */
export const isObjectPhoto = (p?: CatalogProduct) => p?.category === "sanitarios" || p?.category === "lavamanos";
