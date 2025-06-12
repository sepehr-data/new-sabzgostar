
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import DatePicker from 'vue3-persian-datetime-picker'

const router = useRouter()

// Step bar
const steps = [
  'اطلاعات فردی',
  'اسکن مدارک',
  'تکمیل اطلاعات بیمه',
  'قرارداد',
  'تایید اطلاعات'
]
const currentStep = ref(1)

// All form data (we’ll render just step 1 here)
const form = reactive({
  // مشخصات فردی
  firstName: '',
  lastName: '',
  fatherName: '',
  nationalId: '',
  serialId: '',
  birthPlace: '',
  birthDate: '',
  gender: '',
  // مشخصات تماس
  telephone: '',
  mobile: '',
  email: '',
  postalCode: '',
  address: '',
  // عنوان شغلی
  organization: '',
  jobTitle: '',
  // مشخصات حساب بانکی
  accountNumber: '',
  cardNumber: '',
  // مشخصات تحصیلی
  education: ''
})

// Only advancing to the next step here
function nextStep() {
  if (currentStep.value < steps.length) currentStep.value++
}
</script>

<template>
  <div class="flex bg-base-200 min-h-screen">
    <!-- Main content -->
    <main class="flex-grow p-4 lg:p-6 overflow-auto">
      <!-- Step bar -->
      <div class="mb-4">
        <div class="flex items-center justify-center space-x-6 rtl:space-x-reverse">
          <ul class="steps w-full mb-8">
            <li :class="['step', currentStep >= 1 ? 'step-primary' : '']">اطلاعات فردی</li>
            <li :class="['step', currentStep >= 2 ? 'step-primary' : '']">اسکن مدارک</li>
            <li :class="['step', currentStep >= 3 ? 'step-primary' : '']">تکمیل اطلاعات بیمه</li>
            <li :class="['step', currentStep >= 4 ? 'step-primary' : '']">قرارداد</li>
            <li :class="['step', currentStep >= 5 ? 'step-primary' : '']">تایید اطلاعات</li>
          </ul>

        </div>
        <div class="border-b-2 border-green-600 mt-4"></div>
      </div>

      <!-- Step 1: همه اطلاعات (شامل بخش‌های ۵گانه) -->
      <div class="bg-white rounded-lg shadow p-6 space-y-6">
        <!-- بخش اول: مشخصات فردی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات فردی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام</span></label>
                <input v-model="form.firstName" class="input input-bordered w-full input-sm" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام خانوادگی</span></label>
                <input v-model="form.lastName" class="input input-bordered w-full input-sm" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام پدر</span></label>
                <input v-model="form.fatherName" class="input input-bordered w-full input-sm" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">شماره ملی</span></label>
                <input v-model="form.nationalId" class="input input-bordered w-full input-sm" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">سریال شناسنامه</span></label>
                <input v-model="form.serialId" class="input input-bordered w-full input-sm" />
              </div>
            </div>
            <div class="space-y-3">
              <div class="form-control">
                <label class="label"><span class="label-text-alt">محل تولد</span></label>
                <input v-model="form.birthPlace" class="input input-bordered w-full input-sm" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">تاریخ تولد</span></label>
                <DatePicker
                    v-model="form.birthDate"
                    format="jYYYY/jMM/jDD"
                    placeholder="تاریخ تولد"
                    class="input input-bordered w-full input-sm"
                />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">جنسیت</span></label>
                <select v-model="form.gender" class="select select-bordered w-full input-sm">
                  <option disabled value="">انتخاب کنید</option>
                  <option>مرد</option>
                  <option>زن</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- بخش دوم: مشخصات تماس -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات تماس</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">تلفن ثابت</span></label>
              <input v-model="form.telephone" class="input input-bordered w-full input-sm" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره موبایل</span></label>
              <input v-model="form.mobile" class="input input-bordered w-full input-sm" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">ایمیل</span></label>
              <input
                  v-model="form.email"
                  type="email"
                  class="input input-bordered w-full input-sm"
              />
            </div>
            <div class="lg:col-span-2 form-control">
              <label class="label"><span class="label-text-alt">آدرس</span></label>
              <input v-model="form.address" class="input input-bordered w-full input-sm" />
            </div>
            <div class="lg:col-span-2 form-control">
              <label class="label"><span class="label-text-alt">کد پستی</span></label>
              <input v-model="form.postalCode" class="input input-bordered w-full input-sm" />
            </div>
          </div>
        </div>

        <!-- بخش سوم: عنوان شغلی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">عنوان شغلی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">نام سازمان</span></label>
              <input
                  v-model="form.organization"
                  class="input input-bordered w-full input-sm"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">عنوان شغلی</span></label>
              <input v-model="form.jobTitle" class="input input-bordered w-full input-sm" />
            </div>
          </div>
        </div>

        <!-- بخش چهارم: حساب بانکی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات حساب بانکی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره حساب</span></label>
              <input
                  v-model="form.accountNumber"
                  class="input input-bordered w-full input-sm"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره کارت</span></label>
              <input v-model="form.cardNumber" class="input input-bordered w-full input-sm" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره شبا</span></label>
              <input
                  v-model="form.accountNumber"
                  class="input input-bordered w-full input-sm"
              />
            </div>
          </div>
        </div>

        <!-- بخش پنجم: تحصیلات -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات تحصیلی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">مدرک تحصیلی</span></label>
              <select v-model="form.education" class="select select-bordered w-full input-sm">
                <option disabled value="">انتخاب کنید</option>
                <option>دیپلم</option>
                <option>لیسانس</option>
                <option>فوق لیسانس</option>
                <option>دکترا</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">عنوان شغلی</span></label>
              <input v-model="form.jobTitle" class="input input-bordered w-full input-sm" />
            </div>
          </div>

        </div>

        <!-- Next button -->
        <div class="flex justify-start mt-6">
          <button @click="nextStep" class="btn btn-primary">مرحله بعدی</button>
        </div>
      </div>

    </main>


  </div>
</template>

<style scoped>
.btn-primary {
  --btn-primary-bg: #74c69d;
  --btn-primary-color: white;
}
</style>
