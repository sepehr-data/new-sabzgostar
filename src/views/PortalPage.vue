<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch  } from 'vue'
import DatePicker from 'vue3-persian-datetime-picker'
import { useToast } from 'vue-toastification'
import bankForm from '@/assets/pdfs/bank-form.pdf'
import bimeForm from '@/assets/pdfs/bime-form.pdf'
import userIco from '@/assets/img/user.svg'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  // در dev مقدار متغیّر را در .env قرار دهید:  VITE_API_BASE_URL=http://localhost:5000/api/v1
  baseURL: '/api/v1',
  timeout: 10_000
})

const router = useRouter()
const toast = useToast()

const companies = ref<Array<{ id: number; name: string }>>([])



// fetch the companies list
async function fetchCompanies() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  try {
    const resp = await api.get(
        '/companies',
        { headers: { Authorization: `Bearer ${token}` } }
    )
    companies.value = resp.data.companies
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'خطا در دریافت فهرست شرکت‌ها')
  }
}

// call it once on mount
onMounted(fetchCompanies)

/** Steps **/
const steps = [
  'اطلاعات فردی',
  'اسکن مدارک',
  'قرارداد',
  'تایید اطلاعات'
]
const currentStep = ref(1)
function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}
// Fix nextStep to await upload when on step 2
async function nextStep() {
  if (currentStep.value === 3 && !contractAccepted.value) {
    toast.error('لطفاً ابتدا قرارداد را بپذیرید')
    return
  }
  if (currentStep.value === 2) {
    const ok = await uploadDocuments()
    if (!ok) {
      // stay on step 2 so user can retry
      return
    }
  }
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

function logout () {
  localStorage.removeItem('token')
  router.push('/login')
}

async function goToMainpage() {
  const token = localStorage.getItem('token')
  if (!token) {
    return toast.error('لطفاً ابتدا وارد شوید')
  }

  try {
    await api.post('/kavenegar',
        {
          pattern: 'sabzgostar-verify'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
    )
    await router.push({ name: 'Landing' })
    } catch (err: any) {
    toast.error(
        err.response?.data?.msg ||
        'خطا در ارتباط به تامیین کننده، لطفا دوباره تلاش کنید.'
    )
  }
}

// ➍ New method to pull down the PDF (with JWT) and force a download:
async function downloadContract() {
  const token = localStorage.getItem('token')
  if (!token) {
    return toast.error('لطفاً ابتدا وارد شوید')
  }

  try {
    const resp = await api.get(
        '/generate-contract',
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
    )

    // build a blob and object-URL
    const blob = new Blob([resp.data], { type: 'application/pdf' })
    const url  = URL.createObjectURL(blob)

    // trigger browser download
    const a = document.createElement('a')
    a.href        = url
    a.download    = `${form.firstName}_${form.lastName}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err: any) {
    toast.error(
        err.response?.data?.msg ||
        'خطا در دانلود قرارداد. لطفاً مجدداً تلاش کنید'
    )
  }
}

const userError = ref('')
const birthDateError = ref('')
const fatherNameError = ref('')
const lastNameError = ref('')
const birthPlaceError = ref('')
const nationalIdError = ref('')
const seriesNationError = ref('')
const genderError = ref('')
const phoneError = ref('')
const telephoneError = ref('')
const emailError = ref('')
const addressError = ref('')
const postalCodeError = ref('')
const companyError = ref('')
const jobTitleError = ref('')
const accountNumberError = ref('')
const cardNumberError = ref('')
const shebaNumberError = ref('')
const educationError = ref('')

/** Step 1 form data **/
const genderMap = {
  'مرد': 1,
  'زن':  2
}


const form = reactive({
  firstName: '',
  lastName: '',
  fatherName: '',
  nationalId: '',
  serialId: '',
  birthPlace: '',
  birthDate: '',
  gender: '',
  telephone: '',
  phone: '',
  email: '',
  postalCode: '',
  address: '',
  company_id: '' as number | '',
  jobTitle: '',
  accountNumber: '',
  cardNumber: '',
  shebaNumber: '',
  education: ''
})

/** Step 2 documents setup **/
const docs = [
  { label: 'عکس پروفایل', key: 'profile' },
  { label: 'اسکن کارت ملی (صفحه اصلی)', key: 'idFront' },
  { label: 'اسکن کارت ملی (پشت صفحه)', key: 'idBack' },
  { label: 'اسکن صفحه اول شناسنامه', key: 'ssn1' },
  { label: 'اسکن صفحه دوم شناسنامه', key: 'ssn2' },
  { label: 'اسکن صفحه سوم شناسنامه', key: 'ssn3' },
  { label: 'اسکن صفحه چهارم شناسنامه', key: 'ssn4' },
  { label: 'اسکن صفحه پنجم شناسنامه', key: 'ssn5' },
  { label: 'اسکن صفحه ششم شناسنامه', key: 'ssn6' },
  { label: 'اسکن مدرک تحصیلی', key: 'eduDoc' },
  { label: 'اسکن امضا', key: 'signature' },
  { label: 'اسکن صفحه اول فرم بیمه تامین اجتماعی', key: 'bime1' },
  { label: 'اسکن صفحه دوم فرم بیمه تامین اجتماعی', key: 'bime2' },
  { label: 'اسکن صفحه اول فرم افتتاح بانک', key: 'bank1' },
  { label: 'اسکن صفحه دوم فرم افتتاح بانک', key: 'bank2' },
]

// This object maps your UI keys → the backend field names
const fieldMap = {
  profile:   'profile',
  idFront:   'national_front',
  idBack:    'national_back',
  ssn1:      'national_id_card1',
  ssn2:      'national_id_card2',
  ssn3:      'national_id_card3',
  ssn4:      'national_id_card4',
  ssn5:      'national_id_card5',
  ssn6:      'national_id_card6',
  eduDoc:    'degree_file',
  signature: 'sign_item',
  bime1:     'bime_card1',
  bime2:     'bime_card2',
  bank1:     'bank_item1',
  bank2:     'bank_item2',
}

const contractUrl = ref<string>('')   // will become our blob URL


// -----------------------------
// 2) Fetch the contract when we hit step 3
// -----------------------------
async function fetchContract() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  try {
    const resp = await api.get(
        '/generate-contract',
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
    )
    // create a blob URL and swap out the embed src
    const blob = new Blob([resp.data], { type: resp.data.type })
    contractUrl.value = URL.createObjectURL(blob)
  } catch (err: any) {
    // if the browser can’t render Word docs, flag to show download link
    pdfSupported.value = false
    // toast.error(
    //     err.response?.data?.msg ||
    //     'خطا در تولید قرارداد. لطفاً مجدداً تلاش کنید'
    // )
  }
}

watch(currentStep, (step) => {
  if (step === 3 && !contractUrl.value) {
    fetchContract()
  }
})

const uploads = reactive<Record<string, File|null>>(
    docs.reduce((acc, d) => ({ ...acc, [d.key]: null }), {})
)
const activeDoc = ref<string|null>(null)

function selectDoc(key: string) {
  activeDoc.value = key
}

// call this when step 2 is submitted
async function uploadDocuments() {
  const token = localStorage.getItem('token')
  if (!token) {
    return toast.error('لطفاً ابتدا وارد شوید')
  }

  // build FormData from `uploads`, not from the unused `selectedFiles`
  const formData = new FormData()
  for (const uiKey of Object.keys(fieldMap)) {
    const file = uploads[uiKey]
    if (file) {
      formData.append(fieldMap[uiKey], file)
    }
  }

  try {
    const resp = await api.post(
        '/upload-files',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
    )
    toast.success(resp.data.msg)
    return true
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'خطا در آپلود مدارک')
    return false
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    userError.value = 'لطفاً دوباره وارد شوید'
    return
  }

  try {
    const response = await api.get(
        '/user-info',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
    )
    if (response.data) {
      form.lastName = response.data.last_name
      form.firstName = response.data.first_name
      form.birthDate = response.data.birth_date
      form.fatherName = response.data.father_name
      form.nationalId = response.data.national_id
      form.gender = response.data.gender
      form.serialId = response.data.natioan_serie
      form.telephone = response.data.home_phone
      form.phone = response.data.phone
      form.email = response.data.email
      form.address = response.data.address
      form.postalCode = response.data.postal_code
      form.jobTitle = response.data.job_name
      form.accountNumber = response.data.bank_card
      form.cardNumber = response.data.credit_card_no
      form.address = response.data.address
      form.organization = response.data.company_name
      form.shebaNumber = response.data.sheba_card_no
    }
  } catch (err) {
    // you could parse err.response.data for validation messages
    console.error('Failed to fetch profile:', err)
    // optional: set an error message
    lastNameError.value = 'خطا در دریافت اطلاعات کاربر.'
  }
})

async function saveStep1() {
  let isOk = true
  userError.value = ''
  birthDateError.value = ''
  fatherNameError.value = ''
  lastNameError.value = ''
  nationalIdError.value = ''
  seriesNationError.value = ''
  genderError.value = ''
  phoneError.value = ''
  emailError.value = ''
  addressError.value = ''
  postalCodeError.value = ''
  companyError.value = ''
  jobTitleError.value = ''
  accountNumberError.value = ''
  cardNumberError.value = ''
  shebaNumberError.value = ''
  educationError.value = ''

  if (!form.firstName) {
    userError.value = 'لطفاً نام را وارد کنید'
    toast.error(userError.value)
    isOk = false
  }

  if (!form.birthDate) {
    birthDateError.value = '*لطفا تاریخ تولد را وارد نمایید'
    toast.error(birthDateError.value)
    isOk = false
  }

  if (!form.gender) {
    genderError.value = '*لطفا جنسیت را وارد نمایید'
    toast.error(genderError.value)
    isOk = false
  }

  if (!form.birthPlace) {
    birthPlaceError.value = '*لطفا محل تولد را وارد نمایید'
    toast.error(birthPlaceError.value)
    isOk = false
  }

  if (!form.fatherName) {
    fatherNameError.value = '*لطفا نام پدر را وارد نمایید'
    toast.error(fatherNameError.value)
    isOk = false
  }

  if (!form.lastName) {
    lastNameError.value = '*لطفا نام خانوادگی را وارد نمایید'
    toast.error(lastNameError.value)
    isOk = false
  }



  if (!form.nationalId) {
    nationalIdError.value = '*لطفا شماره ملی را وارد نمایید'
    toast.error(nationalIdError.value)
    isOk = false
  }

  if (!form.telephone) {
    telephoneError.value = '*لطفا تلفن ثابت را وارد نمایید'
    toast.error(telephoneError.value)
    isOk = false
  }

  if (!form.phone) {
    phoneError.value = '*لطفا تلفن همراه را وارد نمایید'
    toast.error(phoneError.value)
    isOk = false
  }



  if (!form.address) {
    addressError.value = '*لطفا آدرس را وارد نمایید'
    toast.error(addressError.value)
    isOk = false
  }



  if (!form.company_id) {
    companyError.value = '*لطفا نام سازمان را وارد نمایید'
    toast.error(companyError.value)
    isOk = false
  }

  if (!form.jobTitle) {
    jobTitleError.value = '*لطفا عنوان شغلی را وارد نمایید'
    toast.error(jobTitleError.value)
    isOk = false
  }

  if (!form.accountNumber) {
    accountNumberError.value = '*لطفا شماره حساب را وارد نمایید'
    toast.error(accountNumberError.value)
    isOk = false
  }

  if (!form.cardNumber) {
    cardNumberError.value = '*لطفا شماره کارت را وارد نمایید'
    toast.error(cardNumberError.value)
    isOk = false
  }

  if (!form.shebaNumber) {
    shebaNumberError.value = '*لطفا تلفن همراه را وارد نمایید'
    toast.error(shebaNumberError.value)
    isOk = false
  }

  if (!form.education) {
    educationError.value = '*لطفا تلفن همراه را وارد نمایید'
    toast.error(educationError.value)
    isOk = false
  }

  if (!isOk) {
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    // not logged in — bail out
    userError.value = 'لطفاً دوباره وارد شوید'
    return
  }

    try {
    await api.post('/update/user',
        {
          first_name: form.firstName,
          last_name: form.lastName,
          father_name: form.fatherName,
          national_id: form.nationalId,
          birth_date: form.birthDate,
          gender: genderMap[form.gender],
          nation_serie: form.serialId,
          home_phone: form.telephone,
          email: form.email,
          address: form.address,
          postal_code: form.postalCode,
          company_id: form.company_id,
          job_name: form.jobTitle,
          bank_card: form.accountNumber,
          credit_card_no: form.cardNumber,
          degree: form.education,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
      toast.success('اطلاعات با موفقیت ارسال شد')
  } catch (err: any) {
    const msg = err.response?.data?.message || 'خطا در ارسال اطلاعات'
    toast.error(msg)
  }
}

const progressWidth = computed(() => {
  const totalSegments = steps.length - 1
  if (totalSegments <= 0) return '0%'
  const completed = currentStep.value - 1
  const pct = (completed / totalSegments) * 100
  return `${pct}%`
})

/* 🔵 این تابع در نسخهٔ قبلی بود و حالا دوباره اضافه می‌کنیم */
function handleFileChange(key: string, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (!file) return

  // فایل را در شیء reactive ذخیره می‌کنیم
  uploads[key] = file

  // همان فایل را به عنوان Doc فعال تنظیم می‌کنیم
  activeDoc.value = key
}

/** URL پیش‌نمایش فایل انتخاب‌شده  **/
let prevUrl: string | null = null
const previewUrl = computed(() => {
  // اگر هیچ سند فعالی انتخاب نشده است
  if (!activeDoc.value) return ''
  const file = uploads[activeDoc.value]
  if (!file) return ''

  // جلوگیری از نشت حافظه
  if (prevUrl) window.URL.revokeObjectURL(prevUrl)

  prevUrl = window.URL.createObjectURL(file)
  console.log(prevUrl)
  return prevUrl
})

/** Step 3: Contract **/
const pdfSupported = ref(true)
const contractAccepted = ref(false)
</script>

<template>
  <div class="relative flex bg-base-200 min-h-screen">
    <!-- Main content -->
    <main class="flex-grow p-4 lg:p-6 overflow-auto">
      <div class="tooltip tooltip-bottom absolute bottom-6  top-0 left-6 z-30" data-tip="خروج">
        <button
            @click="logout"
            class="btn btn-ghost btn-circle text-error hover:bg-error/20"
        >
          <!-- heroicons: arrow-left-on-rectangle -->
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>

          <!-- show the word on ≥ sm screens only -->
          <span class="hidden sm:inline whitespace-nowrap">خروج</span>
        </button>
      </div>
      <!-- Step bar -->
      <!-- put dir="rtl" on the wrapper so everything flips automatically -->
      <!-- Step bar  -------------------------------------------------------------->
      <div class="relative py-8 overflow-x-auto" dir="rtl">
        <!-- gray track -->
        <div class="absolute inset-x-8 top-1/2 transform -translate-y-1/2 h-1 bg-gray-300 rounded-full"></div>

        <!-- green progress track (unchanged) -->
        <div
            class="absolute inset-y-0 right-8 top-1/2 transform -translate-y-1/2 h-1 bg-green-700 rounded-full
             transition-all duration-500 ease-out origin-right"
            :style="{ width: progressWidth }"
        ></div>

        <!-- steps -->
        <ul class="relative flex justify-between items-center px-8">
          <li v-for="(label, idx) in steps" :key="idx" class="flex flex-col items-center">
            <!-- circle -->
            <div
                :class="[
            'w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold shadow-lg transition-all duration-300',
            idx + 1 <= currentStep
              ? 'text-white'
              : 'bg-white text-gray-400 ring-4 ring-gray-200'
          ]"
                :style="idx + 1 <= currentStep
            ? { backgroundColor: '#40916c' }
            : {}"
            >
              {{ idx + 1 }}
            </div>
            <!-- label -->
            <span
                :class="[
            'mt-3 text-sm transition-colors duration-300',
            idx + 1 <= currentStep ? 'text-green-700' : 'text-gray-400'
          ]"
            >
          {{ label }}
        </span>
          </li>
        </ul>
      </div>


      <!-- Step 1: Personal Info -->
      <div v-if="currentStep === 1" class="bg-white rounded-lg shadow p-6 space-y-6">
        <!-- بخش اول: مشخصات فردی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات فردی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام</span></label>
                <input v-model="form.firstName" class="input input-bordered w-full input-sm" />
                <p v-if="userError" class="text-sm text-red-500 mb-2">{{ userError }}</p>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام خانوادگی</span></label>
                <input v-model="form.lastName" class="input input-bordered w-full input-sm" />
                <p v-if="lastNameError" class="text-sm text-red-500 mb-2">{{ lastNameError }}</p>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">نام پدر</span></label>
                <input v-model="form.fatherName" class="input input-bordered w-full input-sm" />
                <p v-if="fatherNameError" class="text-sm text-red-500 mb-2">{{ fatherNameError }}</p>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">شماره ملی</span></label>
                <input v-model="form.nationalId" class="input input-bordered w-full input-sm" />
                <p v-if="nationalIdError" class="text-sm text-red-500 mb-2">{{ nationalIdError }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="form-control">
                <label class="label"><span class="label-text-alt">محل تولد</span></label>
                <input v-model="form.birthPlace" class="input input-bordered w-full input-sm" />
                <p v-if="birthPlaceError" class="text-sm text-red-500 mb-2">{{ birthPlaceError }}</p>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">تاریخ تولد</span></label>
                <DatePicker
                    v-model="form.birthDate"
                    format="jYYYY/jMM/jDD"
                    placeholder="تاریخ تولد"
                    class="input input-bordered w-full input-sm"
                />
                <p v-if="birthDateError" class="text-sm text-red-500 mb-2">{{ birthDateError }}</p>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text-alt">جنسیت</span></label>
                <select v-model="form.gender" class="select select-bordered w-full input-sm">
                  <option disabled value="">انتخاب کنید</option>
                  <option>مرد</option>
                  <option>زن</option>
                </select>
                <p v-if="genderError" class="text-sm text-red-500 mb-2">{{ genderError }}</p>
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
              <p v-if="telephoneError" class="text-sm text-red-500 mb-2">{{ telephoneError }}</p>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره موبایل</span></label>
              <input v-model="form.phone" class="input input-bordered w-full input-sm" />
              <p v-if="phoneError" class="text-sm text-red-500 mb-2">{{ phoneError }}</p>
            </div>

            <div class="lg:col-span-2 form-control">
              <label class="label"><span class="label-text-alt">آدرس</span></label>
              <input v-model="form.address" class="input input-bordered w-full input-sm" />
              <p v-if="addressError" class="text-sm text-red-500 mb-2">{{ addressError }}</p>
            </div>

          </div>
        </div>

        <!-- بخش سوم: عنوان شغلی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">عنوان شغلی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">نام سازمان</span></label>

              <select
                  v-model="form.company_id"
                  class="select select-bordered w-full input-sm"
              >
                <option disabled value="">انتخاب کنید</option>
                <option
                    v-for="c in companies"
                    :key="c.id"
                    :value="c.id"
                >{{ c.name }}</option>
              </select>
              <p v-if="companyError" class="text-sm text-red-500 mb-2">{{ companyError }}</p>
              <p v-if="companyError" class="text-sm text-red-500 mb-2">{{ companyError }}</p>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text-alt">عنوان شغلی</span></label>
              <input v-model="form.jobTitle" class="input input-bordered w-full input-sm" />
              <p v-if="jobTitleError" class="text-sm text-red-500 mb-2">{{ jobTitleError }}</p>
            </div>
          </div>
        </div>

        <!-- بخش چهارم: حساب بانکی -->
        <div>
          <h4 class="text-green-700 font-semibold mb-3">مشخصات حساب بانکی</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره حساب</span></label>
              <input v-model="form.accountNumber" class="input input-bordered w-full input-sm" />
              <p v-if="accountNumberError" class="text-sm text-red-500 mb-2">{{ accountNumberError }}</p>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره کارت</span></label>
              <input v-model="form.cardNumber" class="input input-bordered w-full input-sm" />
              <p v-if="cardNumberError" class="text-sm text-red-500 mb-2">{{ cardNumberError }}</p>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">شماره شبا</span></label>
              <input v-model="form.shebaNumber" class="input input-bordered w-full input-sm" />
              <p v-if="shebaNumberError" class="text-sm text-red-500 mb-2">{{ shebaNumberError }}</p>
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
                <option>سیکل</option>
                <option>دیپلم</option>
                <option>لیسانس</option>
                <option>فوق لیسانس</option>
                <option>دکترا</option>
              </select>
              <p v-if="educationError" class="text-sm text-red-500 mb-2">{{ educationError }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button
              @click="saveStep1"
              class="btn btn-success"
              style="--btn-primary-bg: #16a34a; --btn-primary-color: white"
          >
            ثبت
          </button>
          <button
              @click="nextStep"
              class="btn btn-success"
              style="--btn-primary-bg: #16a34a; --btn-primary-color: white"
          >
            مرحله بعدی
          </button>
        </div>
      </div>

      <!-- Step 2: Document Uploads -->
      <div v-if="currentStep === 2" class="bg-white rounded-lg shadow p-6 space-y-6">
        <h4 class="text-green-700 font-semibold mb-3">اسکن مدارک</h4>
        <div class="grid grid-cols-3 gap-4">
          <!-- Preview area -->
          <div class="col-span-2 border border-dashed border-gray-300 rounded-lg h-128 flex items-center justify-center text-gray-400">
            <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="پیش‌نمایش"
                class="max-h-full max-w-full"
            />
            <span v-else>پیش‌نمایش تصویر</span>
          </div>

          <!-- Buttons list -->
          <div class="space-y-2 text-right">
            <label
                v-for="doc in docs"
                :key="doc.key"
                class="btn btn-outline btn-sm w-full justify-start flex"
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

        <p>کاربر گرامی، بر روی کاغذ سفید با خودکار آبی امضا کنید و عکس امضا را آپلود فرمایید</p>

        <label class="btn btn-outline btn-success relative overflow-hidden">
          دانلود فرم خام افتتاح حساب بانک مسکن
          <!-- this link now sits on top of the label, fills it 100%, and is transparent -->
          <a
              :href="bankForm"
              download
              class="absolute inset-0 block cursor-pointer"
              style="opacity: 0;"
          ></a>
        </label>
        <br>
        <label class="btn btn-outline btn-success relative overflow-hidden">
          دانلود فرم خام بیمه تامین اجتماعی
          <a :href="bimeForm" download class="absolute inset-0 block cursor-pointer" style="opacity: 0;"></a>
        </label>

        <div class="flex justify-between mt-6">
          <button
              @click="prevStep"
              class="btn btn-error"
              style="--btn-primary-bg:#dc2626;--btn-primary-color:white"
          >
            مرحله قبلی
          </button>
          <button
              @click="nextStep"
              class="btn btn-success"
              style="--btn-primary-bg:#16a34a;--btn-primary-color:white"
          >
            مرحله بعدی
          </button>
        </div>
      </div>

      <!-- Step 3: Confirmation (Placeholder) -->
      <!-- Step 3: Contract Preview & Acceptance -->
      <!-- Step 3 – قرارداد همکاری -->
      <div v-if="currentStep === 3" class="bg-white rounded-lg shadow p-6 space-y-6">
        <h4 class="text-green-700 font-semibold mb-3">قرارداد همکاری</h4>

        <!-- embed PDF directly -->
        <h4>قرارداد همکاری</h4>

        <embed
            v-if="contractUrl"
            :src="contractUrl"
            type="application/pdf"
            style="width:100%; height:700px;"
        />

        <p v-else class="text-center text-gray-500">
          در حال تولید قرارداد…
        </p>

        <label class="form-control flex items-center gap-2 cursor-pointer">
          <input
              type="checkbox"
              v-model="contractAccepted"
              class="checkbox checkbox-success"
          />
          <span>من تمامی مفاد قرارداد را مطالعه کرده و می‌پذیرم.</span>
        </label>

        <!-- ➋ Replace your <a :href="contractUrl" download> with: -->
        <p class="mt-4">
          پیش‌نمایش قرارداد پشتیبانی نمی‌شود. برای دانلود روی
          <a
              href="#"
              @click.prevent="downloadContract"
              class="link link-primary"
          >
            دانلود قرارداد
          </a>
          کلیک کنید.
        </p>

        <div class="flex justify-between mt-6">
          <button
              @click="prevStep"
              class="btn btn-error"
              style="--btn-primary-bg:#dc2626;--btn-primary-color:white"
          >
            مرحله قبلی
          </button>
          <button
              @click="nextStep"
              class="btn btn-success"
              style="--btn-primary-bg:#16a34a;--btn-primary-color:white"
          >
            مرحله بعدی
          </button>
        </div>
      </div>

      <div
          v-if="currentStep === 4"
          class="flex flex-col items-center justify-center py-12"
      >
        <div
            class="w-full max-w-md bg-green-50 border border-green-200 rounded-lg shadow-lg p-8 text-center"
        >
          <!-- ✅ Confirmation icon (optional) -->
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mx-auto mb-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <!-- ✔ check mark -->
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4"
            />
            <!-- ○ circle -->
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>

          <!-- 📄 Message -->
          <p class="text-gray-700 leading-relaxed">
            اطلاعات شما با موفقیت ثبت شد. پس از بررسی و تأیید کارشناسان شرکت
            <span class="font-semibold text-green-700">سبزگستر گوارشک</span>، پیامک
            تایید برای شما ارسال خواهد شد.
          </p>

          <!-- 🔘 Back to main page -->
          <button
              @click="goToMainpage"
              class="btn btn-success mt-6 w-full"
              style="--btn-success-bg: #1b4332; --btn-success-color: white;"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>


      <!-- TODO: Steps 3–5 -->
    </main>
  </div>
</template>

<style scoped>
.btn-primary {
  --btn-primary-bg: #74c69d;
  --btn-primary-color: white;
}
</style>
