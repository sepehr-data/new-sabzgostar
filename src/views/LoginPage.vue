<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import bgImg from '@/assets/img/bg_login.png'

// Vue Router
const router = useRouter()

// State
const step = ref<'phone' | 'otp'>('phone')
const phoneNumber = ref('')
const otpCode = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Send OTP to the provided phone number
async function sendOtp() {
  errorMessage.value = ''
  if (!phoneNumber.value) {
    errorMessage.value = 'لطفاً شماره تلفن را وارد کنید'
    return
  }
  loading.value = true
  try {
    await axios.post('http://localhost:5000/api/otp/send', {
      phone: phoneNumber.value
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    step.value = 'otp'
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.response?.data?.message
        || err.message
        || 'خطا در ارسال پیامک'
  } finally {
    loading.value = false
  }
}

// Verify the OTP code
async function verifyOtp() {
  errorMessage.value = ''
  if (!otpCode.value) {
    errorMessage.value = 'لطفاً کد تایید را وارد کنید'
    return
  }
  loading.value = true
  try {
    const response = await axios.post('http://localhost:5000/api/otp/verify', {
      phone: phoneNumber.value,
      code: otpCode.value
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    // On success, navigate to portal
    router.push({ name: 'Portal' })
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'کد تایید اشتباه است'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="hero relative min-h-screen bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImg})` }"
  >
    <!-- overlay for readability -->
    <div class="absolute inset-0  bg-opacity-50"></div>

    <div class="relative w-full max-w-md px-4">
      <div class="card bg-white bg-opacity-95 shadow-lg">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">ورود / ثبت نام</h2>
          <div v-if="step === 'phone'">
            <label class="label">
              <span class="label-text">شماره تلفن</span>
            </label>
            <input
                v-model="phoneNumber"
                type="tel"
                placeholder="+989XXXXXXXXX"
                class="input input-bordered w-full mb-2"
            />
            <p v-if="errorMessage" class="text-sm text-red-500 mb-2">{{ errorMessage }}</p>
            <button
                @click="sendOtp"
                :disabled="loading"
                class="btn btn-primary w-full"
            >
              {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید' }}
            </button>
          </div>
          <div v-else>
            <label class="label">
              <span class="label-text">کد تایید</span>
            </label>
            <input
                v-model="otpCode"
                type="text"
                placeholder="کد ۵ رقمی"
                class="input input-bordered w-full mb-2"
            />
            <p v-if="errorMessage" class="text-sm text-red-500 mb-2">{{ errorMessage }}</p>
            <button
                @click="verifyOtp"
                :disabled="loading"
                class="btn btn-secondary w-full"
            >
              {{ loading ? 'در حال بررسی...' : 'تایید کد' }}
            </button>
            <button
                @click.prevent="step = 'phone'; errorMessage = ''; otpCode = ''"
                class="btn btn-link mt-2"
            >
              تغییر شماره تلفن
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Customize button colors */
.btn-primary {
  --btn-primary-bg: #74c69d;
  --btn-primary-color: white;
}
.btn-secondary {
  --btn-secondary-bg: #38a169;
  --btn-secondary-color: white;
}
</style>
