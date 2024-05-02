import { createApp } from 'vue'
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import { worker } from './_mock/index'
import pinia from '@/stores'
import 'element-plus/dist/index.css'

// async function enableMocking() {
//   console.log('enableMocking')

//   const { worker } = await import('./_mock/index')

//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and ready to intercept requests.
//   return worker.start()
// }

// enableMocking()
worker.start({ onUnhandledRequest: 'bypass' })
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue))
  app.component(key, component)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
