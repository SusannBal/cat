# 📦 Catálogo de Productos

App web para crear, gestionar y exportar catálogos de productos en PDF.  
Tecnologías: **React + Vite · Supabase · Netlify**

---

## 🚀 Configuración paso a paso

### PASO 1 — Supabase

1. Ir a [supabase.com](https://supabase.com) → crear un proyecto nuevo
2. Ir a **SQL Editor** → pegar y ejecutar el contenido de `supabase-setup.sql`
3. Ir a **Project Settings > API** → copiar:
   - `Project URL` → esta es tu `VITE_SUPABASE_URL`
   - `anon public` key → esta es tu `VITE_SUPABASE_ANON_KEY`
4. Ir a **Storage** → verificar que el bucket `productos` fue creado (aparece como público)

### PASO 2 — Variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://XXXXXXXXXXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...tu_key...
```

### PASO 3 — Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

### PASO 4 — Deploy en Netlify

**Opción A — Drag & Drop (más fácil):**
1. Ejecutar `npm run build`
2. Arrastrar la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop)

**Opción B — Conectar repositorio (recomendado):**
1. Subir el proyecto a GitHub
2. En Netlify: New site from Git → seleccionar repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. En **Site settings > Environment variables** agregar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## ✨ Cómo usar la app

| Acción | Cómo |
|--------|------|
| Ver catálogo | Pantalla principal |
| Filtrar por categoría | Botones en la barra superior |
| Buscar producto | Campo de búsqueda |
| Agregar producto | Botón **"+ Nuevo producto"** |
| Editar / Borrar | Activar modo **"Editando"** → aparecen botones en cada card |
| Exportar PDF | Botón **"Exportar PDF"** → descarga automática |
| Cambiar título | Botón de engranaje ⚙️ → Configurar catálogo |

## 🖼️ Cambiar imágenes

Las imágenes se suben a Supabase Storage automáticamente al agregar/editar un producto.
También puedes gestionar los archivos directamente desde **Supabase Dashboard > Storage > productos**.

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── ProductCard.jsx     — Card individual de producto
│   ├── ProductModal.jsx    — Formulario agregar/editar
│   ├── CatalogView.jsx     — Vista del catálogo (se exporta a PDF)
│   └── SettingsModal.jsx   — Configuración del catálogo
├── lib/
│   ├── supabase.js         — Cliente Supabase
│   └── exportPdf.js        — Exportación a PDF
└── App.jsx                 — App principal
```
