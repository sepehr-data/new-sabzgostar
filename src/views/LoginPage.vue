<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import jwt_decode from 'vue-jwt-decode'
import bgImg from '@/assets/img/login_bg_final.png'
import { saveToken } from '@/auth'

// Router
const router = useRouter()

/* ─────  Axios instance  ───── */
const api = axios.create({
  // در dev مقدار متغیّر را در .env قرار دهید:  VITE_API_BASE_URL=http://localhost:5000/api/v1
  baseURL: 'http://194.180.11.84:5000/api/v1',
  timeout: 10_000
})

// Mode: "user" (OTP) or "admin" (username/password)
const mode = ref<'user' | 'admin'>('user')

// Common state
const loading = ref(false)

// ——— User (OTP) state ———
const step = ref<'phone' | 'otp'>('phone')
const phone = ref('')
const otp = ref('')
const userError = ref('')

// ——— Admin state ———
const username = ref('')
const password = ref('')
const adminError = ref('')


interface JWTPayload { role?: 'user' | 'admin' }

function getRoleFromToken(token: string): 'user' | 'admin' | null {
  try {
    // decode() returns `any`, so we just assert it’s our payload shape
    const decoded = jwt_decode(token) as JWTPayload
    return decoded.role ?? null
  } catch {
    return null
  }
}

// On component mount, check for existing token & redirect
onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    const role = getRoleFromToken(token)
    if (role === 'user') {
      router.replace({ name: 'Portal' })
    } else if (role === 'admin') {
      router.replace({ name: 'Admin' })
    }
  }
})

// Send OTP
async function sendOtp() {
  userError.value = ''
  if (!phone.value) {
    userError.value = 'لطفاً شماره تلفن را وارد کنید'
    return
  }
  loading.value = true
  try {
    await api.post('/register-user', { phone: phone.value })
    step.value = 'otp'
  } catch (err: any) {
    userError.value = err.response?.data?.message || 'خطا در ارسال پیامک'
  } finally {
    loading.value = false
  }
}

// Verify OTP
async function verifyOtp() {
  userError.value = ''
  if (!otp.value) {
    userError.value = 'لطفاً کد تأیید را وارد کنید'
    return
  }
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    let response = await api.post('/verify-user', {
      phone: phone.value,
      verify: otp.value
    })
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    saveToken(response.data.token)
    router.push({ name: 'Portal' })
  } catch (err: any) {
    userError.value = err.response?.data?.message || 'کد تأیید اشتباه است'
  } finally {
    loading.value = false
  }
}

// Admin login
async function loginAdmin() {
  adminError.value = ''
  if (!username.value || !password.value) {
    adminError.value = 'نام کاربری و رمز عبور را وارد کنید'
    return
  }
  loading.value = true
  try {
    let response = await api.post('/admin/login', {
      username: username.value,
      password: password.value
    })
    saveToken(response.data.token)
    router.push({ name: 'Admin' })

  } catch (err: any) {
    adminError.value = err.response?.data?.message || 'خطا در ورود ادمین'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="hero relative min-h-screen bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImg})` }">


    <div class="min-h-screen flex items-center justify-center bg-gray-80 p-4">
      <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden
         flex flex-col h-96"
      >
        <!-- Tabs -->
        <div class="flex bg-gray-50 p-1">
          <button
              @click="mode = 'user'; step='phone'; userError='';"
              class="flex-1 py-2 text-center font-medium transition rounded-full"
              :class="mode === 'user'
              ? 'bg-[#40916c] text-white'
              : 'text-gray-600 hover:bg-gray-200'"
          >
            کاربر
          </button>
          <button
              @click="mode = 'admin';"
              class="flex-1 py-2 text-center font-medium transition rounded-full"
              :class="mode === 'admin'
              ? 'bg-[#40916c] text-white'
              : 'text-gray-600 hover:bg-gray-200'"
          >
            ادمین
          </button>
        </div>

        <div class="p-8 flex-1 overflow-y-auto">
          <!-- Title -->
          <h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">
            <span v-if="mode==='user'">
              {{ step==='phone' ? 'ورود / ثبت نام' : 'تأیید کد' }}
            </span>
            <span v-else>ورود ادمین</span>
          </h2>

          <!-- USER MODE -->
          <div v-if="mode === 'user'">
            <!-- Step 1: Phone -->
            <div v-if="step === 'phone'">
              <label class="block text-gray-700 mb-1">شماره تلفن</label>
              <input
                  v-model="phone"
                  type="tel"
                  placeholder="+989151001410"
                  class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
              <p v-if="userError" class="text-sm text-red-500 mb-2">{{ userError }}</p>
              <button
                  @click="sendOtp"
                  :disabled="loading"
                  class="w-full py-2 rounded-lg text-white font-medium transition"
                  :class="loading
                  ? 'bg-[#40916c] opacity-50 cursor-not-allowed'
                  : 'bg-[#40916c] hover:bg-[#17422c]'"
              >
                {{ loading ? 'در حال ارسال...' : 'ارسال کد تأیید' }}
              </button>
            </div>

            <!-- Step 2: OTP -->
            <div v-else>
              <label class="block text-gray-700 mb-1">کد تأیید</label>
              <input
                  v-model="otp"
                  type="text"
                  placeholder="کد ۵ رقمی"
                  class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
              <p v-if="userError" class="text-sm text-red-500 mb-2">{{ userError }}</p>
              <button
                  @click="verifyOtp"
                  :disabled="loading"
                  class="w-full py-2 rounded-lg text-white font-medium transition mb-2"
                  :class="loading
                  ? 'bg-[#40916c] opacity-50 cursor-not-allowed'
                  : 'bg-[#40916c] hover:bg-[#17422c]'"
              >
                {{ loading ? 'در حال بررسی...' : 'تأیید کد' }}
              </button>
              <button
                  @click.prevent="step='phone'; userError=''; otp='';"
                  class="block mx-auto text-sm text-gray-500 hover:text-[#1b4332]"
              >
                تغییر شماره تلفن
              </button>
            </div>
          </div>

          <!-- ADMIN MODE -->
          <div v-else>
            <label class="block text-gray-700 mb-1">نام کاربری</label>
            <input
                v-model="username"
                type="text"
                placeholder="نام کاربری ادمین"
                class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />

            <label class="block text-gray-700 mb-1">رمز عبور</label>
            <input
                v-model="password"
                type="password"
                placeholder="رمز عبور"
                class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />

            <p v-if="adminError" class="text-sm text-red-500 mb-2">{{ adminError }}</p>
            <button
                @click="loginAdmin"
                :disabled="loading"
                class="w-full py-2 rounded-lg text-white font-medium transition"
                :class="loading
                ? 'bg-[#40916c] opacity-50 cursor-not-allowed'
                : 'bg-[#40916c] hover:bg-[#17422c]'"
            >
              {{ loading ? 'در حال ورود...' : 'ورود' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* All styling via Tailwind CSS utilities; no additional CSS needed */
</style>
