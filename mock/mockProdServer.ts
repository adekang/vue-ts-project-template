import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import type { Recordable } from 'vite-plugin-mock'

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all
const modules = import.meta.glob('./**/*.ts', { eager: true })
const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_'))
    return

  mockModules.push(...(modules as Recordable)[key].default)
})

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
