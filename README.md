# Pokémon Explorer

A production-oriented Pokémon search and details application built with Next.js 15 App Router, TypeScript, Tailwind CSS, and PokeAPI.

Built to showcase how I approach modern frontend engineering, from server-first architecture and typed API integration to client-side state management, incremental pagination, URL-driven state, responsive UI, accessibility, and resilient user experiences. The focus was on building a maintainable product with clear boundaries between data, application logic, and presentation.

---

## Features

- **Server-First Architecture**: Uses Server Components by default and introduces Client Components only where browser interaction or client-side state is required, keeping the client boundary intentionally small.
- **Incremental Offset Pagination**: Uses Next.js Server Actions to fetch only the next 20 Pokémon and append them to the existing client-side list without refetching previously loaded results.
- **URL-Based Search**: Syncs active search queries and type filters (`?search=` and `?type=`) directly with the browser URL, preserving state on page reloads and supporting back/forward navigation.
- **Compare Pokemon**: Allows selecting up to two Pokemon from the main grid or dynamic detail pages to view a side-by-side base stats comparison modal, highlighting winning parameters.
- **Interactive Sorting**: Allows ordering cards dynamically by ID, Name, Attack, Speed, or HP, synchronized with a `?sort=` URL parameter.
- **Persistent Favorites Drawer**: Client-side state managed via Zustand and stored in local storage, mounted inside a React Portal to escape backdrop filter clipping.
- **Light & Dark Theme**: Seamless support using next-themes with Tailwind v4 class-based dark mode selector strategy.
- **UX Resiliency**: Route-level loading skeletons, error boundaries, inline retries, and friendly empty states.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Vanilla CSS variables
- **State Management**: Zustand (with persist middleware)
- **Theme**: Next Themes

---

## API Used

- **PokeAPI** (`https://pokeapi.co/api/v2`)
  - `/pokemon?limit={limit}&offset={offset}` (List pagination query)
  - `/pokemon/{name}` (Detailed attributes query)
  - `/type/{type}` (Type filter search query)

---

## Installation

Clone the repository and install project dependencies using npm:
```bash
npm install
```

---

## Running Locally

Start the local development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run TypeScript and lint verification checks:
```bash
npx tsc --noEmit
npm run lint
```

---

## Project Structure

```
pipeline-ai-assignment/
├── app/
│   ├── page.tsx                   # Home: Server fetch, renders PokemonListContainer
│   ├── layout.tsx                 # Root layout, ThemeProvider, Header
│   ├── loading.tsx                # Route-level loading skeleton
│   ├── error.tsx                  # Route-level error boundary
│   ├── not-found.tsx              # Global 404 handler
│   └── pokemon/
│       └── [name]/
│           └── page.tsx           # Detail route with generateMetadata
├── components/
│   ├── compare/                   # CompareButton, CompareTray, CompareModal
│   ├── controls/                  # SearchBar, TypeFilterBar, LoadMoreButton, SortSelector
│   ├── favorites/                 # FavoriteButton, FavoritesDrawer
│   ├── feedback/                  # CardSkeleton, DetailsSkeleton, ErrorState, EmptyState
│   ├── layout/                    # Header and Footer
│   ├── pokemon/                   # PokemonCard, PokemonGrid, PokemonListContainer
│   └── theme/                     # ThemeToggle, ThemeProvider
├── lib/
│   ├── pokemon/
│   │   ├── client.ts              # fetchJson wrapper (timeout, revalidate caching)
│   │   ├── queries.ts             # getPokemonList, getPokemonByName, getPokemonByType
│   │   ├── transform.ts           # PokeAPI data mapper
│   │   └── actions.ts             # fetchMorePokemon and getPokemonDetailsForCompare Actions
│   └── store/
│       ├── favorites-store.ts     # Zustand persistent favorites store
│       └── compare-store.ts       # Zustand compare store
└── types/
    └── pokemon.ts                 # Strict domain models
```

---

## Challenges Faced

1. **Designing the Server/Client Boundary**: Keeping the application server-first while still supporting interactive features such as Load More, favorites, theme switching, and URL-based filtering required carefully limiting Client Components to where browser-side state or interaction was actually needed.
2. **Correct Incremental Pagination**: Moving from increasing-limit requests to true offset pagination required handling accumulated client state and ensuring each Load More request fetched only the next batch without refetching previously loaded results.
3. **Combining Search, Filtering, and Pagination**: Search and type filtering introduced an ordering problem where paginating before filtering could skip valid results. The data flow was redesigned so filtering is applied before pagination.
4. **Working Within PokeAPI's Constraints**: PokeAPI does not provide a dedicated fuzzy search endpoint, so exact searches and partial name searches required different data-fetching strategies while keeping the UI experience consistent.
5. **Responsive UI Layering**: Interactive elements such as the favorites drawer, sticky header, theme controls, and responsive layouts required careful handling of positioning, stacking, and viewport behavior across screen sizes.

---

## Future Improvements

- **Evolution Chains**: Displaying the progressive evolution lifecycle of each Pokemon on the detail view.
- **Comparison Stats Radar Chart**: Visualizing relative stats strengths of two selected Pokemon side-by-side using an SVG radar chart.
- **Virtualized Grid Rendering**: Using windowing/virtualization for rendering very large type-filtered result grids to optimize CPU layout load.
- **Request Cancellation**: Aborting active debounce search requests if a user types another keyword quickly.
