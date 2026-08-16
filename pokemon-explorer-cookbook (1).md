# Pokemon Explorer — Build Cookbook

A complete architecture and execution guide for building the Pokemon Explorer assignment on Next.js App Router. This document is planning only. No code is written here. Follow it top to bottom when you start building.

---

## 1. Stack and Rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router | Server Components cut client JS, native caching, file based routing gives you the details route for free |
| Language | TypeScript, strict mode | Assignment explicitly rewards typed code, catches API shape mistakes early |
| Styling | Tailwind CSS v4 | Fast to build a real design system with tokens, no runtime cost |
| Icons | lucide-react | Consistent stroke based icon set, tree shakeable |
| Animation | Motion (Framer Motion successor, `motion/react`) | Card hover, modal transitions, skeleton shimmer |
| State (client, small) | Zustand | Favorites, theme, recently viewed — no provider hell, persists easily |
| Data fetching | Native `fetch` inside Server Components, plus a thin typed client | PokeAPI has no auth, no need for React Query on the server; use it only if you add client side infinite scroll |
| Deployment | Vercel | Zero config for Next.js, image optimization works out of the box |

Do not add Redux, do not add a heavy state library, do not add a UI kit like MUI or Chakra. The assignment penalizes anything that looks templated. Hand rolled components on Tailwind read as senior work; a component library reads as a shortcut.

---

## 2. Mental Model Before You Touch Code

Think in four layers, and never let a layer know about the layer two steps away from it.

```
PokeAPI (external)
   |
Data layer            lib/pokemon/*.ts        -> knows the API shape, nothing else does
   |
Server Components     app/**/page.tsx         -> fetch data, pass plain typed props down
   |
Presentational UI     components/**           -> pure, receive props, some are client for interactivity
```

A component never calls `fetch("https://pokeapi.co/...")` directly. If you ever type a raw PokeAPI URL inside a `.tsx` file that is not in `lib/pokemon/`, stop and move it.

### Server vs Client, decided once, not per file

Default everything to a Server Component. Add `"use client"` only to the leaf that genuinely needs one of these:
- `useState` / `useEffect` / `useReducer`
- Browser APIs (`localStorage`, `IntersectionObserver`, `matchMedia`)
- Event handlers that do more than navigate (`onClick` that opens a modal, toggles favorite, debounces a search)

Concretely in this project, the client boundary sits at:
- `SearchBar` (debounced input, writes to URL)
- `TypeFilterBar` (toggle buttons, writes to URL)
- `LoadMoreButton` / infinite scroll sentinel
- `FavoriteButton`
- `ThemeToggle`
- `PokemonCard` only if you animate hover with Motion; otherwise keep it a Server Component and do hover purely in CSS (`hover:` classes need no JS, so prefer this)
- `CompareTray` (bonus feature)

Everything else — the grid, the page shell, the stat bars, the details layout — stays server rendered. This is the single biggest signal of a senior Next.js submission versus a bootcamp one: most tutorials slap `"use client"` on every file out of fear. You will not.

---

## 3. Folder Structure

```
src/
├── app/
│   ├── layout.tsx                 root layout, fonts, ThemeProvider, html/body
│   ├── globals.css                Tailwind entry, CSS variables, keyframes
│   ├── page.tsx                   home: reads searchParams, renders PokemonGrid
│   ├── loading.tsx                route level skeleton for home
│   ├── error.tsx                  route level error boundary for home
│   ├── not-found.tsx              global 404
│   └── pokemon/
│       └── [name]/
│           ├── page.tsx           details route, generateMetadata for share links
│           ├── loading.tsx        details skeleton
│           └── error.tsx          details error boundary (handles "not found")
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx             logo, ThemeToggle, nav
│   │   └── Footer.tsx
│   │
│   ├── pokemon/
│   │   ├── PokemonCard.tsx        single card, type-tinted
│   │   ├── PokemonGrid.tsx        responsive grid wrapper
│   │   ├── PokemonImage.tsx       next/image wrapper with fallback + blur
│   │   ├── TypeBadge.tsx          pill, one per type
│   │   ├── StatBar.tsx            single animated stat row
│   │   ├── StatBlock.tsx          groups all 6 StatBars
│   │   ├── AbilityList.tsx
│   │   └── MoveList.tsx
│   │
│   ├── controls/
│   │   ├── SearchBar.tsx          client, debounced, syncs ?search=
│   │   ├── TypeFilterBar.tsx      client, syncs ?type=
│   │   ├── SortMenu.tsx           bonus, syncs ?sort=
│   │   └── LoadMoreButton.tsx     client, fetch-more, or InfiniteScrollSentinel.tsx
│   │
│   ├── favorites/
│   │   ├── FavoriteButton.tsx     client, reads/writes Zustand store
│   │   └── FavoritesDrawer.tsx    bonus, side panel of saved pokemon
│   │
│   ├── theme/
│   │   └── ThemeToggle.tsx        client, next-themes
│   │
│   ├── feedback/
│   │   ├── CardSkeleton.tsx
│   │   ├── DetailsSkeleton.tsx
│   │   ├── ErrorState.tsx         reusable, takes title/message/retry
│   │   └── EmptyState.tsx         reusable, takes icon/title/message
│   │
│   └── ui/                        tiny primitives, no business logic
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Modal.tsx              if you choose modal over route for details
│       └── Container.tsx
│
├── lib/
│   ├── pokemon/
│   │   ├── client.ts              fetchJson wrapper: timeout, error normalization
│   │   ├── queries.ts             getPokemonList, getPokemonByName, getPokemonByType, searchPokemon
│   │   ├── transform.ts           raw PokeAPI JSON -> your clean domain types
│   │   └── constants.ts           TYPE_COLORS, PAGE_SIZE, STAT_LABELS
│   ├── utils.ts                   cn(), formatPokemonId(), capitalize()
│   └── store/
│       ├── favorites-store.ts     Zustand + persist middleware
│       └── compare-store.ts       bonus
│
├── types/
│   └── pokemon.ts                 Pokemon, PokemonListItem, PokemonType, Stat, Ability
│
└── styles/
    └── (Tailwind config lives at repo root: tailwind.config.ts)
```

Rules that keep this clean as it grows:
- A file in `components/pokemon/` never imports from `lib/pokemon/client.ts` directly. It receives already-shaped data as props.
- A file in `lib/pokemon/` never imports React. It is framework agnostic fetch and transform logic, testable in isolation.
- `types/pokemon.ts` is the single source of truth for shapes. Both `lib/pokemon/transform.ts` and every component import from here.

---

## 4. Types First

Write `types/pokemon.ts` before anything else. The PokeAPI raw response is noisy (nested `pokemon.type`, `pokemon.stat`, arrays of arrays). Never let that noise leak past `lib/pokemon/transform.ts`. Define your own clean shapes:

- `PokemonListItem` — the small shape used in the grid: id, name, image url, types, a couple of stats if you want stat-based sort
- `Pokemon` — the full shape used on the details page: everything above plus height, weight, abilities, full stats array, moves (trimmed to a reasonable count, the raw API returns hundreds)
- `PokemonType` — a union of the 18 known type strings, not `string`, so `TYPE_COLORS[type]` is exhaustive and type-checked
- `Stat` — `{ name: string; base: number }`
- `ApiError` — a discriminated union: `{ kind: "not-found" } | { kind: "network" } | { kind: "unknown"; status?: number }`

The transform functions in `lib/pokemon/transform.ts` take raw fetch JSON and return these clean types. This is where you decide, once, how many moves to keep, how to pick the artwork URL (prefer `sprites.other["official-artwork"].front_default`, fall back to `sprites.front_default`), and how to round stats for the bars.

---

## 5. The Data Layer

### 5.1 `lib/pokemon/client.ts`

One function, `fetchJson<T>(url, revalidate)`, that:
- Sets a sane timeout using `AbortController`
- Passes Next's caching hint: `fetch(url, { next: { revalidate: 3600 } })` — Pokemon data almost never changes, cache it for an hour so repeat visits and the details page are instant
- Throws a typed error (map `res.status === 404` to `ApiError.kind === "not-found"`, network failures to `"network"`, everything else to `"unknown"`)
- Never swallows errors silently. The caller decides what to render, this layer only classifies what happened.

### 5.2 `lib/pokemon/queries.ts`

Expose intention-named functions, not raw endpoints:

- `getPokemonList({ limit, offset })` → fetches `/pokemon`, then for each item fetches its detail in parallel with `Promise.all` (the list endpoint gives you name and url only, not image or types, so you need the follow-up call for a real card). Cap `limit` at 20 for Load More batches so this stays fast.
- `getPokemonByName(name)` → for the details route and for search
- `getPokemonByType(type)` → hits `/type/{type}`, which returns `pokemon: [{ pokemon: { name, url } }]`; you then need details for each (or a lighter card that only needs name/id/sprite, fetched in parallel, capped and paginated client side since some types return 100+ entries)
- `searchPokemonByName(query)` → PokeAPI has no fuzzy search endpoint. Two honest approaches, pick one and document the choice in your README:
  1. Simple and correct: treat search as "fetch exact name," since `/pokemon/{name}` is the only name-based endpoint. Debounce input, on submit hit `getPokemonByName`, show not-found state on 404. This is what the assignment example (`/?search=pikachu`) literally shows.
  2. Nicer UX, more work: on app start (or via a cached route handler), fetch the full name list once (`/pokemon?limit=1300`, it's just names and urls, small payload), cache it, and do client side substring filtering as the user types, so partial queries like "pika" show suggestions before they hit enter. Only build this if time allows after core requirements are solid. If you build it, cache the full name list at the module level or in a route handler with `revalidate: 86400` so you fetch it once per day, not once per request.

### 5.3 Why this indirection matters

If PokeAPI changes a field name tomorrow, you edit `transform.ts` once. If you had inlined `fetch` calls inside twelve components, you would edit twelve files. This is the difference reviewers are trained to notice.

---

## 6. Routing and URL State

Treat the URL as your application state for anything shareable: search term, active type filter, sort, and pagination offset. This gives you the assignment's bonus "shareable" behavior for free, and it means back/forward browser navigation works correctly without extra code.

- `app/page.tsx` reads `searchParams: { search?: string; type?: string; sort?: string }` (Next 15 passes this as a Promise in Server Components, await it)
- It calls the right `lib/pokemon/queries.ts` function based on which params are present: search present → `getPokemonByName`; type present and no search → `getPokemonByType`; neither → `getPokemonList` with the default offset
- `SearchBar` and `TypeFilterBar` are client components that update the URL via `useRouter().push` combined with `useSearchParams`, wrapped in `useTransition` so the pending state can drive a subtle loading indicator without a full page flash
- Debounce the search input at 300 to 400ms before pushing the URL update, so you are not refetching on every keystroke

### Details route

`app/pokemon/[name]/page.tsx`:
- `params: Promise<{ name: string }>`, await it, call `getPokemonByName`
- On a 404 from the data layer, call Next's `notFound()` so `error.tsx`/`not-found.tsx` in that segment renders your "Pokemon not found" state instead of a generic crash
- Add `generateMetadata` so the shared URL has a proper title and OG description ("Pikachu — Electric type Pokemon, base stats and abilities"), this is a small touch that reads as production quality
- Add `generateStaticParams` for the first 151 or so Pokemon if you want ISR-style pre-rendering for the classics, optional but a nice performance flex worth one sentence in your README

If you decide a modal reads better than a route (both are allowed by the brief), still back the modal with the route: open `/pokemon/pikachu` as a route normally, and additionally intercept it as a modal using Next's Parallel and Intercepting Routes (`@modal` slot, `(.)pokemon/[name]`) so a card click opens a modal over the grid, but a direct link or refresh still lands on the full page. This is the single most "senior Next.js" move available in this assignment and is worth doing if you have time, because it is exactly what production apps like Instagram-style photo grids or ecommerce quick-views do.

---

## 7. Component Contracts

Keep every component's props narrow and typed. A few concrete contracts to lock in before writing JSX:

- `PokemonCard({ pokemon: PokemonListItem })` — renders id badge, image, name, type badges, tinted background derived from `TYPE_COLORS[pokemon.types[0]]`. Wrapped in a Next `<Link href={`/pokemon/${pokemon.name}`}>`, so it works with no JS and is crawlable.
- `PokemonGrid({ pokemon: PokemonListItem[] })` — a plain responsive grid, no data fetching inside it.
- `TypeBadge({ type: PokemonType; size?: "sm" | "md" })` — the single place that maps a type string to a color and an icon/emoji, imported everywhere a type shows up (card, filter bar, details page) so the mapping is defined exactly once in `lib/pokemon/constants.ts` and only rendered here.
- `StatBar({ label: string; value: number; max?: number })` — max defaults to 255 (the real ceiling for base stats), width is `value/max * 100%`, animate the width in with Motion on mount, color the fill based on value thresholds (below 50 muted, 50 to 90 the type accent, above 90 a stronger tone).
- `ErrorState({ title, message, onRetry? })` and `EmptyState({ title, message, icon? })` — these two components are used in at least four different failure scenarios each, so build them once, generically, and reuse. Never write a bespoke "not found" block inside a page file.

---

## 8. Loading, Error, and Empty States — Exact Placement

Next's App Router gives you this almost free if you use the file conventions correctly instead of hand rolling `if (loading)` everywhere.

| File | Fires when | Shows |
|---|---|---|
| `app/loading.tsx` | Home route is fetching (search, filter, or initial load, since these are server fetches inside a Server Component) | Grid of `CardSkeleton`, same column count as the real grid so there is no layout jump |
| `app/pokemon/[name]/loading.tsx` | Details route is fetching | `DetailsSkeleton` matching the real layout: big image block, name/id block, badge row, six stat bar placeholders |
| `app/error.tsx` | An uncaught throw in the home route's data fetching (network down, 500, unexpected shape) | `ErrorState` with "Something went wrong / We could not load Pokemon" and a Retry button calling the `reset()` function Next passes in |
| `app/pokemon/[name]/error.tsx` | Uncaught throw in details fetching that is not the handled 404 case | Same `ErrorState` pattern, scoped to this segment |
| Inside `app/pokemon/[name]/page.tsx`, on 404 | Pokemon genuinely does not exist | Call `notFound()`, which renders `not-found.tsx` in that segment: friendly "Pokemon not found, try another name" |
| Inside `page.tsx`, after a successful fetch that returns zero results (type filter with no matches, or a search whose result set is empty) | Not an error, just nothing to show | `EmptyState`, "No Pokemon found, try a different search or filter" |

The distinction that separates a strong submission from a mediocre one: a failed network call and a legitimately empty result set are different states with different copy, and you must not collapse them into one generic "no data" screen. A 404 on `/pokemon/qwerty` is not an error, it is an expected outcome you designed for.

For `Load More`, the loading state is local, not route level: the button itself shows a small spinner and disables while the next batch fetches, the existing grid stays mounted and does not skeleton-flash.

---

## 9. Design System

Follow this as a token system, not ad hoc Tailwind classes scattered across components. Define these once in `tailwind.config.ts` / `globals.css` and reference them everywhere.

### 9.1 Direction

Clean, light-first product feel with a dark mode that is a genuine second theme, not an inverted filter. Think of a well made product page for a physical collectible line: soft neutral background, generous white space, the color comes from the Pokemon types themselves, not from your own brand chrome. The types are already a built-in, rich, recognizable color system, so your job is to be a clean stage for them rather than compete with them.

### 9.2 Color tokens

Base palette, CSS variables so dark mode is a variable swap, not a duplicated class set:

- `--bg` — near white (`#FAFAF8`) in light, near black-blue (`#0B0E14`) in dark
- `--surface` — card background, `#FFFFFF` light / `#151922` dark
- `--border` — hairline, `#E8E6E1` light / `#242938` dark
- `--text-primary`, `--text-muted`
- `--accent` — a single neutral brand accent used sparingly for focus rings and primary buttons only, do not use it for type related UI

Type colors, one clear hex per type, stored as a typed record in `lib/pokemon/constants.ts`:

```
normal, fire, water, electric, grass, ice, fighting, poison,
ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy
```

Each type gets a `{ bg, text, ring }` triplet so a badge, a card tint, and a stat bar fill all pull from the same source and never drift out of sync.

### 9.3 Typography

Pick one confident display face for the wordmark and headings (something with real character, like a rounded geometric sans or a slightly condensed grotesk, not the default Inter-everywhere look) and pair it with a clean, highly legible body face for stats, descriptions, and UI copy. Two families total. Set a real type scale (for example 12/14/16/20/28/40) instead of relying on Tailwind's default sizes untouched, and give headings deliberate tracking and weight so the hierarchy is unmistakable at a glance.

### 9.4 Shape and elevation

- Cards: rounded-2xl, 1px hairline border in light mode, no border in dark mode (elevation via subtle shadow instead)
- Shadows: one soft, low-opacity shadow used consistently, do not stack multiple shadow classes
- Spacing: stick to a consistent scale, do not mix arbitrary pixel paddings with Tailwind's spacing scale

### 9.5 Motion

- Card hover: scale to 1.02 to 1.03 and lift shadow slightly, 150 to 200ms ease-out, pure CSS transition, no JS needed
- Skeleton shimmer: a CSS keyframe gradient sweep, not a spinner
- Stat bars: width animates in from 0 on mount using Motion, staggered 40 to 60ms per bar so they cascade rather than all snapping at once
- Route/modal transitions: fade plus slight translate-y, 200ms, respect `prefers-reduced-motion` by disabling non-essential motion when that media query is set
- Do not animate everything. Pick three or four moments and make them good instead of animating twelve things shallowly.

### 9.6 Responsive grid

- Mobile (below 640px): 2 columns
- Tablet (640 to 1024px): 3 columns
- Desktop (above 1024px): 4 to 5 columns
- Use CSS grid with `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))` as an alternative to hard breakpoints if you want it to self-adjust without exact breakpoint tuning
- Search bar and filter bar stack vertically on mobile, sit inline on desktop
- Details page: stacked single column on mobile (image, then info, then stats), two column layout on desktop (image left, info and stats right)

---

## 10. Interaction Details Worth Getting Right

- **Search input**: show a clear button (x icon) once there is text, show a small inline spinner in the input itself while the debounced fetch is pending, not a full page skeleton, so typing feels responsive.
- **Type filter**: active type gets a filled pill in that type's color with a checkmark or ring, inactive types are outlined. "All" is always present and clears the `type` param.
- **Load More**: button shows a count, "Load 20 more," disables and shows a spinner mid-fetch, and after the new batch renders, keep scroll position stable (do not scroll to top).
- **Favorites**: heart icon top-right corner of the card, filled and colored when active, a small scale-pop animation on toggle, persisted through Zustand's `persist` middleware to `localStorage` so it survives refresh.
- **Dark mode**: use `next-themes`, respect system preference by default, toggle persists, and make sure you set `suppressHydrationWarning` on `<html>` in the root layout to avoid the theme flash warning.
- **Keyboard (bonus)**: Escape closes any open modal/drawer, Enter on a focused card opens it, Tab order follows visual order, every interactive element has a visible focus ring using the accent token, not the browser default outline removed with nothing replacing it.

---

## 11. Performance Checklist

- Use `next/image` for every Pokemon sprite and artwork image, with explicit `width`/`height` (official artwork is consistently 475x475) so there is no layout shift, and `sizes` set correctly for the responsive grid.
- Cache PokeAPI responses with `next: { revalidate: 3600 }` on every fetch in `lib/pokemon/client.ts`, this data is effectively static.
- Batch the follow-up detail fetches for a list page with `Promise.all`, not a sequential loop, or your Load More button will feel sluggish.
- For the type filter, which can return 100+ Pokemon for common types, paginate client side after the initial fetch rather than rendering everything, and consider fetching only the first batch of details up front, lazily fetching the rest as the user scrolls or clicks Load More within that filtered set.
- Keep the client JavaScript bundle small: this is what disciplined Server/Client component splitting buys you, verify with `next build` output which routes are shipping large client bundles.

---

## 12. Accessibility Baseline (Non-Bonus Items You Should Just Do)

- Every image has meaningful `alt` text ("Pikachu official artwork"), not empty or generic.
- Buttons that are icon-only (favorite heart, theme toggle, close) have `aria-label`.
- Color is never the only signal: a type badge has both color and text, an active filter has both color and an icon/ring, not color alone.
- Form input (`SearchBar`) has an associated `<label>` (visually hidden is fine) not just a `placeholder`.
- Maintain a real heading hierarchy: one `h1` per page, not multiple, headings not skipped for visual sizing reasons.

---

## 13. State Management Boundaries

Keep this simple, resist the urge to centralize everything:

- **URL (searchParams)**: search term, active type, sort order, list offset — anything that should survive a refresh and be shareable
- **Zustand + persist**: favorites list, theme preference if you are not using `next-themes` for it, recently viewed list if you build that bonus
- **Local component state**: input's raw typed value before debounce, modal open/closed if not URL-driven, hover/focus UI states
- **Server state**: everything fetched from PokeAPI lives in Server Components and is passed down as props; do not duplicate it into client state unless a client component needs to mutate a local copy (for example, client side pagination within a type filter result set)

Do not reach for Zustand or Context for anything that fits in the URL. Do not reach for the URL for anything that is purely ephemeral UI state like "is this dropdown open."

---

## 14. Build Order (Follow This Sequence)

Building out of order is the most common way this kind of project stalls halfway with a messy middle. Do it in this order and each step is demoable on its own.

1. **Types and data layer**: `types/pokemon.ts`, `lib/pokemon/client.ts`, `queries.ts`, `transform.ts`, `constants.ts`. Verify with a throwaway `console.log` in a temporary Server Component, delete once confirmed.
2. **Design tokens**: Tailwind config, CSS variables for light/dark, font setup in `layout.tsx`, the `TYPE_COLORS` map.
3. **Static grid, no interactivity**: `PokemonGrid`, `PokemonCard`, `TypeBadge`, home `page.tsx` fetching a fixed first page. Get this looking genuinely good before adding a single interactive feature.
4. **Loading and error states**: `app/loading.tsx`, `app/error.tsx`, `CardSkeleton`, `ErrorState`, `EmptyState`. Temporarily throw an error on purpose to verify `error.tsx` actually renders.
5. **Details route**: `[name]/page.tsx`, `[name]/loading.tsx`, `[name]/error.tsx`, `not-found.tsx`, `StatBar`, `StatBlock`, `AbilityList`, `MoveList`.
6. **Search**: `SearchBar` client component, URL wiring, not-found handling for a bad search.
7. **Type filter**: `TypeFilterBar`, URL wiring, empty-state handling for a filter with zero results.
8. **Load More**: `LoadMoreButton`, offset tracked in URL or local state depending on whether you want it shareable (URL is more correct here).
9. **Responsive pass**: audit every screen at 375px, 768px, 1280px, fix the grid, the filter bar wrapping, the details page column stacking.
10. **Bonus features, in this order**: URL-based details (already done if you followed step 5 as a route, not a modal), dark mode, favorites, sort, compare, keyboard accessibility, intercepted-route modal if time allows.
11. **Polish pass**: hover states, motion, focus rings, empty edge cases (search with only whitespace, type filter combined with an active search term), README.

---

## 15. README Structure to Fill In At The End

Use the exact section headers the assignment asks for, and write real content, not placeholders:

```
# Pokemon Explorer
## Features
## Tech Stack
## API Used
## Installation
## Running Locally
## Project Structure
## Challenges Faced
## Future Improvements
```

For "Challenges Faced," be specific and honest: something like the PokeAPI having no name-search endpoint and how you handled it, or the type endpoint returning large result sets and how you paginated them client side, reads far better than a vague sentence. For "Future Improvements," list the bonus items you did not get to, this shows you scoped deliberately rather than ran out of time by accident.

---

## 16. Quality Bar Before You Call It Done

Walk through this list literally, on a real deployed build, not just localhost:

- Search for a real Pokemon, a misspelled name, and an empty string. All three behave correctly.
- Filter by a common type (water, normal) and a rare one (ice, dragon). Both render, both handle the empty case if you type a nonsense filter combination.
- Click Load More until you hit the end of a small type-filtered set. It should not error, it should indicate there is nothing more to load.
- Open a details page directly by URL (not by clicking a card) to confirm the route genuinely works standalone.
- Refresh on a details page. No flash of unstyled content, no theme flicker.
- Turn off network (devtools offline mode) and trigger a fetch. `error.tsx` renders with a working Retry.
- Resize from mobile to desktop slowly, nothing breaks or overlaps at in-between widths.
- Tab through the entire homepage using only the keyboard. Every control is reachable and visibly focused.
- Toggle dark mode, refresh, confirm it persisted.
- Favorite a Pokemon, refresh, confirm it persisted.

If every item on this list is true, the submission meets the brief's own final test: it feels like a real product, not a page that displays API data.
