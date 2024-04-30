/// <reference types="vite/client" />
// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'

//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

interface ImportMetaEnv {
  readonly VITE_APP_BASE: string
  readonly VITE_USE_MOCK: boolean
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_BASE: string
  readonly VITE_TIMEOUT: number
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
