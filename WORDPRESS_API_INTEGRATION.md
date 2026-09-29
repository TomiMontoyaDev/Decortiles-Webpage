# Integración con WordPress API

## Endpoints utilizados

### 1. Productos
```
GET https://www.decorcolombiatiles.com/api/products.php
```

**Estructura de respuesta:**
```json
[
  {
    "id": 17,
    "name": "PORCELANATO STATUARIO CLASSIC",
    "acf": {
      "formato": "60X120",
      "metros_por_caja": "1,44",
      "unidades_por_caja": "2",
      "precio": "150.000"
    },
    "image": "https://www.decorcolombiatiles.com/wp/wp-content/uploads/2025/07/porcelanato.png",
    "categories": [...],
    "link": "https://www.decorcolombiatiles.com/wp/producto/porcelanato-statuario-classic/"
  }
]
```

### 2. Categorías
```
GET https://www.decorcolombiatiles.com/api/categories.php
```

**Estructura de respuesta:**
```json
[
  {
    "id": 6,
    "name": "Paredes",
    "slug": "paredes",
    "children": [
      {
        "id": 8,
        "name": "Exteriores",
        "slug": "exteriores",
        "children": []
      }
    ]
  }
]
```

## Archivos modificados

### 1. `lib/api.ts` (NUEVO)
- Funciones para consumir los endpoints de WordPress
- Interfaces TypeScript para tipado
- Funciones de conversión de datos

### 2. `components/ceramics-catalog.tsx`
- Reemplazados datos hardcodeados con llamadas a la API
- Integración con categorías dinámicas
- Estados de carga y error
- Filtros adaptados a la nueva estructura

### 3. `components/FeaturedProducts.tsx` (NUEVO)
- Componente para productos destacados en homepage
- Utiliza los primeros 4 productos de la API
- Estados de carga y error

### 4. `app/page.tsx`
- Reemplazada sección de productos destacados hardcodeada
- Integración con el nuevo componente FeaturedProducts

### 5. `app/globals.css`
- Agregadas utilidades CSS para line-clamp

## Funcionalidades implementadas

### Catálogo de Productos
- ✅ Carga dinámica de productos desde WordPress
- ✅ Filtros por tamaño, categoría 
- ✅ Modal de detalles del producto
- ✅ Enlaces a la página del producto en WordPress
- ✅ Manejo de estados de carga y error
- ✅ Precios mostrados cuando están disponibles

### Productos Destacados
- ✅ Muestra los primeros 4 productos de la API
- ✅ Enlaces directos al producto en WordPress
- ✅ Estados de carga con skeleton
- ✅ Imágenes reales de productos

### Categorías
- ✅ Carga dinámica de categorías con jerarquía
- ✅ Filtros adaptativos basados en categorías disponibles
- ✅ Soporte para subcategorías

## Mapeo de datos

| Campo WordPress | Campo Frontend | Descripción |
|----------------|----------------|-------------|
| `id` | `id` | ID único del producto |
| `name` | `name` | Nombre del producto |
| `acf.formato` | `size` | Tamaño/formato |
| `acf.precio` | `price` | Precio del producto |
| `image` | `image` | URL de la imagen |
| `categories` | `categories` | Array de categorías |
| `link` | `link` | URL del producto en WordPress |

## Manejo de errores

- **Sin conexión**: Muestra mensaje de error con botón de reintento
- **Productos vacíos**: Muestra mensaje informativo
- **Filtros sin resultados**: Opción para limpiar filtros
- **Imágenes faltantes**: Fallback a placeholder

## Mejoras futuras sugeridas

1. **Cache**: Implementar cache para reducir llamadas a la API
2. **Paginación**: Para manejar grandes cantidades de productos
3. **Búsqueda**: Agregar funcionalidad de búsqueda por texto
4. **Favoritos**: Sistema de productos favoritos
5. **Comparación**: Comparar productos lado a lado
6. **SEO**: Meta tags dinámicos basados en productos
7. **Productos relacionados**: Sugerencias basadas en categorías

## Comandos para desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Verificar tipos
npm run type-check
```

## Notas importantes

- Los endpoints deben estar accesibles y con CORS configurado
- Las imágenes deben tener URLs absolutas
- Se recomienda usar HTTPS para los endpoints en producción
- El frontend maneja graciosamente datos faltantes o malformados

## Solución de problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que el servidor WordPress permita peticiones desde tu dominio.

### Imágenes no cargan
Verifica que las URLs de las imágenes sean absolutas y accesibles públicamente.

### Datos faltantes
El frontend maneja datos faltantes con valores por defecto (ej: "N/A", "Consultar"). 