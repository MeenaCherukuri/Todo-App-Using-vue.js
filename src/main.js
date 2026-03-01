import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import tooltipDirective from './directives/tooltip'
import './main.css'

const app = createApp(App)
app.use(router)
app.directive('tooltip', tooltipDirective)
app.mount('#app')
