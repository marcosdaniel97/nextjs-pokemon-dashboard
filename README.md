# Dash8 — Pokémon Dashboard

Dashboard construido con **Next.js 16 (App Router)** que sirve como proyecto de práctica sobre distintas estrategias de renderizado y manejo de estado en Next.js: generación estática, estado de cliente, estado global con Redux y persistencia en `localStorage`. Usa la [PokeAPI](https://pokeapi.co/) como fuente de datos.

## Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Estado global | [Redux Toolkit](https://redux-toolkit.js.org) + [React Redux](https://react-redux.js.org) |
| Íconos | [react-icons](https://react-icons.github.io/react-icons) |
| Lenguaje | TypeScript |
| Lint | ESLint 9 (`eslint-config-next`) |
| Datos externos | [PokeAPI](https://pokeapi.co/api/v2) |

## Requisitos previos

- Node.js 20+ (según `@types/node`)
- npm (hay `package-lock.json` versionado; también funcionaría con yarn/pnpm/bun)

## Scripts de ejecución

```bash
# Instalar dependencias
npm install

# Levantar el servidor de desarrollo (http://localhost:3000)
npm run dev

# Generar el build de producción
npm run build

# Servir el build de producción ya generado
npm start

# Ejecutar el linter (ESLint)
npm run lint
```

> `npm run dev` incluye Fast Refresh. Las páginas de detalle de Pokémon (`/dashboard/pokemon/[id]` y `/dashboard/pokemons/[name]`) usan `generateStaticParams`, por lo que en `npm run build` se pre-generan las 151 páginas de la primera generación de Pokémon contra la PokeAPI.

## Estructura del proyecto

```
src/
├── app/                        # Rutas (App Router)
│   ├── layout.tsx              # Layout raíz: fuentes Geist + <Providers> (Redux)
│   ├── page.tsx                # "/" → redirect a /dashboard/main
│   ├── not-found.tsx           # 404 global (incluye Sidebar)
│   ├── api/
│   │   └── counter/route.ts    # Route Handler GET/POST → { method, count: 100 }
│   └── dashboard/
│       ├── layout.tsx          # Layout del dashboard: Sidebar + contenido
│       ├── main/page.tsx       # Home del dashboard (WidgetsGrid)
│       ├── counter/page.tsx    # Demo de estado de cliente (CartCounter)
│       ├── pokemons/page.tsx   # Listado estático de 151 Pokémon
│       ├── pokemons/[name]/    # Detalle de Pokémon por nombre (SSG)
│       ├── pokemon/[id]/       # Detalle de Pokémon por id (SSG)
│       └── favorites/page.tsx  # Favoritos (estado global de Redux)
│
├── components/                 # Componentes de layout/dashboard compartidos
│   ├── sidebar/                # Sidebar + SidebarMenuItem (navegación activa por ruta)
│   └── dashboard/               # WidgetsGrid + SimpleWidget
│
├── pokemons/                   # Módulo de dominio "pokemons"
│   ├── components/             # PokemonGrid, PokemonCard, FavoritePokemons
│   └── interfaces/             # Tipos: SimplePokemon, Pokemon, PokemonResponse
│
├── shopping-cart/               # Módulo de dominio "shopping-cart"
│   └── components/CartCounter.tsx
│
└── store/                      # Redux Toolkit
    ├── index.ts                # configureStore + hooks tipados (useAppDispatch/useAppSelector)
    ├── Providers.tsx           # <Provider> de Redux + hidratación de favoritos desde localStorage
    ├── counter/counterSlice.ts # Slice del contador (count, isReady)
    ├── pokemons/pokemons.ts    # Slice de favoritos (toggleFavorite, setFavoritePokemons)
    └── middlewares/
        └── localstorage-middleware.ts  # Middleware que persiste favoritos en localStorage
```

Cada módulo de dominio (`pokemons`, `shopping-cart`) expone su API pública a través de un `index.ts` (barrel export), y lo mismo hace `components/index.ts` para los componentes compartidos.

## Funcionalidades / rutas

| Ruta | Qué demuestra | Detalle |
|---|---|---|
| `/` | Redirección | Redirige de inmediato a `/dashboard/main` |
| `/dashboard/main` | Dashboard general | Muestra `WidgetsGrid`, que lee `state.counter.count` desde Redux |
| `/dashboard/counter` | **Client-side state** | `CartCounter` (`'use client'`) usa Redux (`counterSlice`) para +1/-1; al montar hace `fetch('/api/counter')` para inicializar el contador |
| `/dashboard/pokemons` | **Generación estática ("dinámica")** | Trae 151 Pokémon de la PokeAPI en un Server Component async |
| `/dashboard/pokemons/[name]` y `/dashboard/pokemon/[id]` | **SSG con `generateStaticParams`** | Pre-generan en build time las páginas de detalle de cada uno de los 151 Pokémon; `fetch` usa `next.revalidate` para ISR |
| `/dashboard/favorites` | **Global state (Redux) + localStorage** | Lee `state.pokemons.favorites`; si está vacío muestra `NoFavorites` |

### API interna

- `GET /api/counter` y `POST /api/counter` (`src/app/api/counter/route.ts`): responden `{ method, count: 100 }`. Es un endpoint de ejemplo usado por `CartCounter` para simular la carga inicial del contador desde un backend.

### Store de Redux

- **`counter`**: `count`, `isReady`. Acciones: `initCounterState`, `addOne`, `substractOne`, `resetCount`.
- **`pokemons`**: `favorites` (diccionario `id -> SimplePokemon`). Acciones: `toggleFavorite`, `setFavoritePokemons`.
- **Persistencia**: los favoritos se guardan en `localStorage` bajo la clave `favorite-pokemons`, tanto dentro del propio reducer (`toggleFavorite`) como mediante `localStorageMiddleware` (actualmente comentado en `store/index.ts`). Al montar la app, `Providers.tsx` hidrata el store leyendo esa clave.

## Notas y deuda técnica conocida

Estas observaciones surgen de comentarios `TODO` y código deshabilitado presente en el repo:

- `store/pokemons/pokemons.ts`: escribe en `localStorage` directamente desde el reducer (marcado como `//TODO: No se debe hacer en Redux`); la alternativa correcta (`localStorageMiddleware`) existe pero está deshabilitada en `store/index.ts`.
- Varias páginas de detalle de Pokémon (`pokemon/[id]`, `pokemons/[name]`) tienen un `//TODO: cambiar esto en un futuro` sobre la estrategia de `cache`/`revalidate` del `fetch`.
- Hay `console.log` de debugging dejados en `CartCounter`, `Providers` y las páginas de detalle de Pokémon.
- No hay tests configurados en el proyecto (`npm test` no existe como script).

## Despliegue

Al ser un proyecto Next.js estándar, se puede desplegar directamente en [Vercel](https://vercel.com/new) u otra plataforma compatible con Next.js siguiendo la [documentación oficial de despliegue](https://nextjs.org/docs/app/building-your-application/deploying).
