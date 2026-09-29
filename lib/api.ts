// FUnciones de APi para consumir endpoints de wordpress

const API_BASE = 'https://www.decorcolombiatiles.com/api'; // usamos proxy para evitar CORS ya que no podemos acceder a la api de wordpress desde el frontend por ser localhost

// Interfaces basadas en wordpress API estructura response
export interface ProductACF {
  formato: string;
  metros_por_caja: string;
  unidades_por_caja: string;
  precio: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  acf: ProductACF;
  image: string;
  categories: Category[];
  link: string;
}

// Fetch todos los productos
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/products.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products: Product[] = await response.json();
    return products;
  } catch {
    // Error fetching products
    return [];
  }
}


export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  total_pages: number;
  per_page: number;
}


export async function fetchProductsPaginated(page = 1, perPage = 50): Promise<PaginatedResponse<Product>> {
  try {
    const response = await fetch(`${API_BASE}/products.php?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PaginatedResponse<Product> = await response.json();
    return data;
  } catch {
    // Error fetching products with pagination
    return {
      data: [],
      total: 0,
      page: 1,
      total_pages: 0,
      per_page: perPage
    };
  }
}


export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE}/categories.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories: Category[] = await response.json();
    return categories;
  } catch {

    return [];
  }
}

// Fetch products by category
export async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const products = await fetchProducts();
    if (categorySlug === 'all') {
      return products;
    }
    
    return products.filter(product => 
      product.categories.some(cat => 
        cat.slug === categorySlug || 
        (cat.children && cat.children.some(child => child.slug === categorySlug))
      )
    );
  } catch {
    // Error fetching products by category
    return [];
  }
}

export async function fetchProductsByCategoryPaginated(
  categorySlug: string, 
  page = 1, 
  perPage = 50
): Promise<PaginatedResponse<Product>> {
  try {
    const url = categorySlug === 'all' 
      ? `${API_BASE}/products.php?page=${page}&per_page=${perPage}`
      : `${API_BASE}/products.php?page=${page}&per_page=${perPage}&category=${categorySlug}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PaginatedResponse<Product> = await response.json();
    return data;
  } catch {

    return {
      data: [],
      total: 0,
      page: 1,
      total_pages: 0,
      per_page: perPage
    };
  }
}


export function getFlattenedCategories(categories: Category[]): Category[] {
  const flattened: Category[] = [];
  
  function flatten(cats: Category[]) {
    cats.forEach(cat => {
      flattened.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children);
      }
    });
  }
  
  flatten(categories);
  return flattened;
}


export interface DisplayProduct {
  id: string;
  name: string;
  finish: string;
  size: string;
  pattern: string;
  color: string;
  image: string;
  price: string;
  link: string;
  categories: string[];
}

export function convertToDisplayProduct(product: Product): DisplayProduct {
  return {
    id: product.id.toString(),
    name: product.name,
    finish: product.categories.find(cat => cat.name.includes('Brillante')) ? 'Brillante' : 'Mate',
    size: product.acf.formato || 'N/A',
    pattern: product.categories.find(cat => cat.name.includes('Porcelanato')) ? 'Porcelanato' : 'Cerámica',
    color: 'Variado', // This could be enhanced if you add color info to ACF
    image: product.image,
    price: product.acf.precio || 'Consultar',
    link: product.link,
    categories: product.categories.map(cat => cat.name)
  };
} 