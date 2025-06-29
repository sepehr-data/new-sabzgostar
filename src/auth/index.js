import VueJwtDecode  from 'vue-jwt-decode';


export function isLoggedIn() {
    return !!localStorage.getItem('token')
}

export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getUserRole() {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        const decoded = VueJwtDecode.decode(token)
        return decoded.role
    } catch {

        return null
    }
}

export function HasTokenExpire() {
    const token = localStorage.getItem('token')
    if (!token) return true
    try {
        const decoded = VueJwtDecode.decode(token)
        return decoded.exp < Date.now()
    } catch {
        return true
    }
}