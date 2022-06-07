import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/scss/main.scss'

import BaseSpinner from './components/ui/BaseSpinner.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueAxios, axios)

app.component('base-spinner', BaseSpinner)

app.mount('#app')
