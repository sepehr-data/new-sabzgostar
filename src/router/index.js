import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage   from '../views/LoginPage.vue'
import DownloadPage from '../views/DownloadsPage.vue'
import ContactsPage from '../views/ContactsPage.vue'
import PortalPage from '@/views/PortalPage.vue'
import AdminPage from '@/views/adminPage.vue'
import About from "@/views/About.vue";

import { isLoggedIn, getUserRole, HasTokenExpire } from '@/auth'

const routes = [
    {
        path: '/',      name: 'Landing', component: LandingPage,
        meta: { requiresAuth: false, requiresAdmin: false }
    },
    {
        path: '/login', name: 'Login',   component: LoginPage,
        meta: { requiresAuth: false, requiresAdmin: false }
    },
    {
        path: '/about', name: 'About', component: About,
        meta: { requiresAuth: false, requiresAdmin: false }
    },
    {
        path: '/downloads', name: 'Downloads', component: DownloadPage,
        meta: { requiresAuth: false, requiresAdmin: false }
    },
    {
        path: '/contacts', name: 'Contacts', component: ContactsPage,
        meta: { requiresAuth: false, requiresAdmin: false }
    },
    {
        path: '/portal', name: 'Portal', component: PortalPage,
        meta: { requiresAuth: true, requiresAdmin: false }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (HasTokenExpire()) {

    }
    const loggedIn = isLoggedIn()
    // 1) require login?
    if (to.meta.requiresAuth === true && !loggedIn) {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    // 2) require admin?
    if (to.meta.requiresAdmin === true && getUserRole() !== 'admin') {
        // you’re either not logged in or not an admin
        return next({ name: 'Landing' })
    }
    next()
})

export default router
