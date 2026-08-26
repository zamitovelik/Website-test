/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Адрес бэкенда в продакшене, например https://api.example.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
