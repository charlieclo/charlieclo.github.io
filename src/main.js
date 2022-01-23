import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/tailwind.scss'

const app = createApp(App)

/* Vue Router */
app.use(router)
/* Vuex */
app.use(store)

app.mount('#app')
