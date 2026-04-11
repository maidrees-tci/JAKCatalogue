# MediCart HQ (JAKCatalogue)

React + TypeScript + Vite medical storefront. Production output is **static files** in `dist/` (no Node server required to host the app).

## Azure Static Web Apps

1. Create an **Azure Static Web App** and connect this repository (or deploy `dist/` from CI).
2. Build settings:
   - **App location:** `/` (repository root)
   - **Output location:** `dist`
   - **Build command:** `npm ci && npm run build`
3. `public/staticwebapp.config.json` is copied into **`dist/`** on build and sets **`navigationFallback`** to `/index.html` so React Router routes work on refresh.

### JAK Delivery SDK

Checkout loads **`/sdk/jakplug.js`** from **`public/sdk/jakplug.js`** (copied to `dist/sdk/`). The file is a vendored copy of the official script with **`WIDGET_URL`** and **`ALLOWED_ORIGIN`** set to **production** (`https://app.jakdelivery.com`), because the CDN script at `https://app.jakdelivery.com/sdk/jakplug.js` still embedded test dashboard URLs at last sync. Re-download from JAK and re-apply those two constants if you upgrade the SDK.

You can also host `dist/` on any static host (Blob Storage static website, CDN, Netlify, etc.) and apply the same SPA fallback rules there.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
