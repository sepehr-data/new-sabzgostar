import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage   from '../views/LoginPage.vue'
import DownloadPage from '../views/DownloadsPage.vue'
import ContactsPage from '../views/ContactsPage.vue'
import PortalPage from '@/views/PortalPage.vue'
import PortalPage2 from "@/views/PortalPage2.vue";
import About from "@/views/About.vue";

const routes = [
    { path: '/',      name: 'Landing', component: LandingPage },
    { path: '/login', name: 'Login',   component: LoginPage },
    { path: '/about', name: 'About', component: About },
    { path: '/downloads', name: 'Downloads', component: DownloadPage },
    { path: '/contacts', name: 'Contacts', component: ContactsPage },
    { path: '/portal', name: 'Portal', component: PortalPage },
    { path: '/portal/step2', name: 'uploads', component: PortalPage2 },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
