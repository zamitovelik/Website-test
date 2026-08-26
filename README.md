# Apogee

Pixel-exact hero landing section built with Vite 5 + React 18 + TypeScript 5.5 + Tailwind CSS 3.4.

## Scripts

```
npm install
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Structure

```
index.html
src/main.tsx
src/App.tsx
src/index.css          # global reset + entrance keyframes
src/components/Hero.tsx # nav, hero copy, revenue card, mobile menu
```

All entrance animations are pure CSS keyframes with `animationDelay` and `forwards` fill —
no IntersectionObserver, no animation library.
