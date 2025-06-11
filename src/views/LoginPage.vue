<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

// State
const step = ref<'phone' | 'otp'>('phone')
const phoneNumber = ref('')
const otpCode = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Emits
const emit = defineEmits<{
  (e: 'authenticated', token: string): void
}>()

// Send OTP to the provided phone number
async function sendOtp() {
  errorMessage.value = ''
  if (!phoneNumber.value) {
    errorMessage.value = 'لطفاً شماره تلفن را وارد کنید'
    return
  }
  loading.value = true
  try {
    await axios.post('/api/send-otp', { phone: phoneNumber.value })
    step.value = 'otp'
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'خطا در ارسال پیامک'
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
    const response = await axios.post('/api/verify-otp', {
      phone: phoneNumber.value,
      otp: otpCode.value
    })
    // Assuming server returns a JWT or session token
    emit('authenticated', response.data.token)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'کد تایید اشتباه است'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div class="card w-full max-w-md bg-white shadow-lg">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">ورود / ثبت نام</h2>
        <div v-if="step === 'phone'">
          <label class="label">
            <span class="label-text">شماره تلفن</span>
          </label>
          <input
              v-model="phoneNumber"
              type="tel"
              placeholder="09XXXXXXXXX"
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
</template>

<style scoped>
/* Customize button colors if needed */
.btn-primary {
  --btn-primary-bg: #74c69d;
  --btn-primary-color: white;
}
.btn-secondary {
  --btn-secondary-bg: #38a169;
  --btn-secondary-color: white;
}
</style>
