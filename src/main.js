import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/scss/main.scss'

import BaseSpinner from './components/ui/BaseSpinner.vue'
import BaseLightBox from './components/ui/BaseLightBox.vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(store)
app.use(router)
app.use(pinia)
app.use(VueAxios, axios)

app.component('BaseSpinner', BaseSpinner)
app.component('BaseLightBox', BaseLightBox)

app.mount('#app')
