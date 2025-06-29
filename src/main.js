import { createApp } from 'vue'
import App           from './App.vue'
import router        from './router'

import 'vue-toastification/dist/index.css'
import '@/assets/toast.css'
import '@/assets/style.css'
import Toast from 'vue-toastification'


createApp(App)
    .use(router)
    .use(Toast, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
    })
    .mount('#app')
