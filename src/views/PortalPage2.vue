<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// steps & navigation
const steps = [
  'اطلاعات فردی',
  'اسکن مدارک',
  'تکمیل اطلاعات بیمه',
  'قرارداد',
  'تایید اطلاعات'
]
const currentStep = ref(2)

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}
function nextStep() {
  if (currentStep.value < steps.length) currentStep.value++
}

// document list
const docs = [
  { label: 'عکس پروفایل',         key: 'profile' },
  { label: 'اسکن کارت ملی (صفحه اصلی)',   key: 'idFront' },
  { label: 'اسکن کارت ملی (پشت صفحه)',    key: 'idBack' },
  { label: 'اسکن صفحه اول شناسنامه',     key: 'ssn1' },
  { label: 'اسکن صفحه دوم شناسنامه',     key: 'ssn2' },
  { label: 'اسکن صفحه سوم شناسنامه',     key: 'ssn3' },
  { label: 'اسکن صفحه چهارم شناسنامه',    key: 'ssn4' },
  { label: 'اسکن صفحه پنجم شناسنامه',     key: 'ssn5' },
  { label: 'اسکن صفحه ششم شناسنامه',      key: 'ssn6' },
  { label: 'اسکن مدرک تحصیلی',         key: 'eduDoc' },
  { label: 'اسکن امضا',               key: 'signature' },
  { label: 'دانلود فرم خام',           key: 'bankForm' }
]

// track uploads & active preview
const uploads = reactive<Record<string, File|null>>(
    docs.reduce((acc, d) => ({ ...acc, [d.key]: null }), {})
)
const activeDoc = ref<string|null>(null)

function selectDoc(key: string) {
  activeDoc.value = key
}
function handleFileChange(key: string, e: Event) {
  const input = e.target as HTMLInputElement
  uploads[key] = input.files?.[0] ?? null
}
</script>

<template>
  <div class="flex bg-base-200 min-h-screen">
    <!-- main content -->
    <main class="flex-grow p-4 lg:p-6 overflow-auto">
      <!-- step bar -->
      <div class="mb-4">
        <ul class="steps w-full mb-2 flex justify-center space-x-6 rtl:space-x-reverse">
          <li
              :class="[
              'step',
              currentStep.value > 1   ? 'step-primary' : '',
            ]"
          >{{ steps[0] }}</li>
          <li
              :class="[
              'step',
              currentStep.value === 2 ? 'step-warning' : '',
              currentStep.value > 2   ? 'step-primary' : ''
            ]"
          >{{ steps[1] }}</li>
          <li class="step">{{ steps[2] }}</li>
          <li class="step">{{ steps[3] }}</li>
          <li class="step">{{ steps[4] }}</li>
        </ul>
        <div class="border-b-2 border-green-600"></div>
      </div>

      <!-- upload panel -->
      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <!-- preview area -->
          <div
              class="col-span-2 border border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400"
          >
            <template v-if="activeDoc && uploads[activeDoc]">
              <img
                  :src="URL.createObjectURL(uploads[activeDoc]!)"
                  alt="پیش‌نمایش"
                  class="max-h-full max-w-full"
              />
            </template>
            <template v-else>
              پیش‌نمایش تصویر
            </template>
          </div>

          <!-- document buttons -->
          <div class="space-y-2 text-right">
            <label
                v-for="doc in docs"
                :key="doc.key"
                class="btn btn-outline btn-sm w-full justify-end flex"
                @click="selectDoc(doc.key)"
            >
              {{ doc.label }}
              <input
                  type="file"
                  class="hidden"
                  @change="e => handleFileChange(doc.key, e)"
              />
            </label>
          </div>
        </div>

        <p>
          کاربر گرامی، بر روی کاغذ سفید با خودکار آبی امضا کنید و عکس امضا را آپلود فرمایید
        </p>
        <p>
          کاربر گرامی، فایل فرم بانکی را دانلود کنید و بعد از پر کردن آن آپلود فرمایید
        </p>
        <button class="btn btn-outline btn-sm">فرم بانکی</button>

        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="btn" style="--btn-primary-bg: #dc2626; --btn-primary-color: white;">
            مرحله‌ی قبلی
          </button>
          <button @click="nextStep" class="btn" style="--btn-primary-bg: #16a34a; --btn-primary-color: white;">
            مرحله‌ی بعدی
          </button>
        </div>
      </div>
    </main>

    <!-- sidebar -->
    <aside class="w-56 shadow-md h-screen sticky top-0">
      <ul class="menu p-4 space-y-2 text-sm">
        <li tabindex="0">
          <a class="font-semibold">فرم مشخصات فردی پرسنل</a>
          <ul class="p-2 bg-base-100">
            <li><a>فرم مشخصات فردی پرسنل</a></li>
            <li><a>تمدید قرارداد</a></li>
            <li><a>داشبورد</a></li>
            <li><a>تنظیمات تمدید قرارداد</a></li>
          </ul>
        </li>
        <li><a>تمدید قرارداد</a></li>
        <li><a>داشبورد</a></li>
        <li><a>تنظیمات تمدید قرارداد</a></li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
/* override DaisyUI btn colors inline where needed */
</style>
