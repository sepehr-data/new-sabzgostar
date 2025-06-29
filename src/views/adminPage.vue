<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import DatePicker from 'vue3-persian-datetime-picker'
import moment from 'moment-jalaali'
import { useToast } from 'vue-toastification'

import filterIco   from '@/assets/img/filter.svg'
import searchIco   from '@/assets/img/search.svg'
import userIco     from '@/assets/img/user.svg'
import companyIco  from '@/assets/img/company.svg'
import notifyIco   from '@/assets/img/message.svg'
import contractIco from '@/assets/img/contract.svg'

/* ────────── basic utilities ────────── */
const router = useRouter()
const toast  = useToast()

/* ────────── state: declare FIRST ────────── */
const activeTab = ref<'users' | 'companies' | 'notify' | 'contract'>('users')

/* users */
const users        = ref<any[]>([])
const currentPage  = ref(1)
const perPage      = ref(10)
const totalPages   = ref(0)
const userSearch   = ref('')

/* companies */
const companies     = ref<any[]>([])
const companySearch = ref('')

/* notify */
const notifyUser    = ref<number | null>(null)
const notifyMessage = ref('')

/* contract */
const contractStart      = ref<string | null>(null)
const contractEnd        = ref<string | null>(null)
const contractNationalId = ref('')

/* UI helpers */
const fatherFilter = ref('')
const birthFilter  = ref('')

/* ────────── axios instance ────────── */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://194.180.11.84:5000/api/v1',
  timeout: 10_000,
})

/* ────────── computed props ────────── */
const pages = computed(() =>
    Array.from({ length: totalPages.value }, (_, i) => i + 1)
)

const filteredUsers = computed(() =>
    users.value.filter(u => {
      const matchSearch = [u.name, u.nationalId].some(f =>
          f.includes(userSearch.value),
      )
      const matchFather = fatherFilter.value
          ? u.father_name.includes(fatherFilter.value)
          : true
      const matchBirth = birthFilter.value
          ? u.birth_date.includes(birthFilter.value)
          : true
      return matchSearch && matchFather && matchBirth
    }),
)

const paginatedUsers = computed(() =>
    filteredUsers.value.slice(
        (currentPage.value - 1) * perPage.value,
        currentPage.value * perPage.value,
    ),
)

const filteredCompanies = computed(() =>
    companies.value.filter(c => c.name.includes(companySearch.value)),
)

/* ────────── functions (fetchUsers etc.) ────────── */

async function generateContract() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }

  // 1️⃣ Prepare payload
  const payload = {
    national_id: contractNationalId.value,
    start_date:  contractStart.value,   // e.g. "1404/04/05"
    end_date:    contractEnd.value,
  }

  let pdfBlob: Blob
  try {
    // 2️⃣ Call backend
    const resp = await api.post(
        '/generate-contract/date',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',         // important for binary PDF
          validateStatus: status => status >= 200 && status < 300
        }
    )
    pdfBlob = resp.data
  } catch (err: any) {
    // 3️⃣ Error handling
    if (err.response?.status === 403) {
      toast.error('شما دسترسی لازم را ندارید')
    } else if (err.response?.status === 404) {
      toast.error('کاربر با این کد ملی پیدا نشد')
    } else if (err.response?.status === 400) {
      toast.error(err.response.data.msg || 'اطلاعات امضا موجود نیست')
    }
    return
  }


  // 4️⃣ Trigger download
  const url = window.URL.createObjectURL(pdfBlob)
  const a   = document.createElement('a')
  // optionally extract filename from Content-Disposition:
  const cd = resp.headers['content-disposition'] || ''
  const match = /filename="?(.+)"?/.exec(cd)
  const filename = match ? match[1] : `contract_${payload.national_id}.pdf`

  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)

  toast.success('قرارداد با موفقیت تولید و دانلود شد')
}


async function searchUsers() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  if (userSearch.value.length < 1) {
    await fetchUsers()
    return
  }

  try {
    const resp = await api.get(
        '/users/search',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q:        userSearch.value,    // the search term
            page:     1,                   // always reset to page 1 on new search
            per_page: perPage.value
          }
        }
    )
    users.value      = resp.data.users
    totalPages.value = resp.data.pages
    currentPage.value = 1
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'خطا در جستجوی کاربران')
  }
}

// --- fetch from backend ---
async function fetchUsers() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }

  try {
    const resp = await api.get(
        '/users',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page:     currentPage.value,
            per_page: perPage.value,
          }
        }
    )
    users.value      = resp.data.users
    totalPages.value = resp.data.pages
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'خطا در دریافت کاربران')
  }
}

// --- page controls ---
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUsers()
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchUsers()
  }
}

const acceptUser = async(userId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  try {
    const resp = await api.get(
        `/users/${userId}/accept`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
    );
    toast.success(resp.data.msg);  // "کاربر با موفقیت تایید شد"
  } catch (err: any) {
    if (err.response?.status === 403) {
      toast.error("شما دسترسی لازم را ندارید");
    } else {
      toast.error("خطا در تایید کاربر. لطفاً دوباره تلاش کنید.");
    }
  }
}

const rejectUser = async(userId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  try {
    const resp = await api.get(
        `/users/${userId}/reject`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
    );
    toast.success(resp.data.msg);
  } catch (err: any) {
    if (err.response?.status === 403) {
      toast.error("شما دسترسی لازم را ندارید");
    } else {
      toast.error("خطا در تایید کاربر. لطفاً دوباره تلاش کنید.");
    }
  }
}

const downloadUser = async (userId) => {
  const token = localStorage.getItem('token')
  let blobData

  // 1️⃣ Only wrap the axios call in the first try/catch
  try {
    const resp = await api.get(
        `/users/${userId}/download`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: status => status >= 200 && status < 300
        }
    )
    blobData = resp.data
  } catch (err) {
    // If the HTTP request itself errors, show the error toast and bail out
  }


  // 2️⃣ We got the blob successfully—now kick off the browser download:
  const blob  = new Blob([blobData], { type: 'application/zip' })
  const url   = window.URL.createObjectURL(blob)
  const a     = document.createElement('a')
  a.href      = url
  a.download  = `user_${userId}_files.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)

  // 3️⃣ And only _after_ everything above has run do we show success:
  toast.success('دانلود با موفقیت انجام شد')
}

// Notification state
const messageTemplates = ref([
  { id: 'pickup', name: 'اعلان دریافت کالا', message: 'سلام! کالای شما آماده تحویل در انبار است. لطفاً تا پایان روز مراجعه نمایید.' },
  { id: 'reminder', name: 'یادآوری پرداخت', message: 'یادآوری: لطفاً رسید پرداختی خود را تا ۲۴ ساعت آینده ارسال کنید.' },
  { id: 'promotion', name: 'تبلیغاتی', message: 'با عرض سلام. پیشنهاد ویژه امروز: خرید با ۲۰٪ تخفیف فقط تا انتهای روز!' },
  { id: 'feedback', name: 'درخواست بازخورد', message: 'سلام! ممنون از خرید شما. لطفاً نظرات خود را با ما به اشتراک بگذارید.' },
  { id: 'custom', name: 'سفارشی', message: '' },
])
const selectedTemplate = ref<string>('')

function applyTemplate() {
  const tpl = messageTemplates.value.find(t => t.id === selectedTemplate.value)
  notifyMessage.value = tpl ? tpl.message : ''
}


// New: load companies from server
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
    if (err.response?.status === 403) {
      toast.error('شما دسترسی لازم را ندارید')
    } else {
      toast.error('خطا در دریافت فهرست شرکت‌ها')
    }
  }
}

function logout () {
  localStorage.removeItem('token')
  router.push('/login')
}

// actions (stubs)
function editCompany(id: number)  { console.log('ویرایش شرکت', id) }
function deleteCompany(id: number){ console.log('حذف شرکت', id) }
function sendNotification()       { console.log('ارسال پیامک', notifyUser.value) }

// section 4

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false })

// **NEW** for modal
const showCompanyModal   = ref(false)
const newCompanyName     = ref('')
const newCompanyStart    = ref<string|null>(null)
const newCompanyEnd      = ref<string|null>(null)

function openCompanyModal() {
  newCompanyName.value  = ''
  newCompanyStart.value = null
  newCompanyEnd.value   = null
  showCompanyModal.value = true
}

async function addCompany() {
  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('لطفاً ابتدا وارد شوید')
    return
  }
  if (!newCompanyName.value || !newCompanyStart.value || !newCompanyEnd.value) {
    toast.error('لطفاً همه فیلدها را پر کنید')
    return
  }

  // format dates to "YYYY/MM/DD"
  const start = moment(newCompanyStart.value, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
  const end   = moment(newCompanyEnd.value,   'YYYY/MM/DD').format('jYYYY/jMM/jDD')

  try {
    const resp = await api.post(
        '/add/company',
        {
          name:       newCompanyName.value,
          start_date: start,
          end_date:   end
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    )
    // push the returned company into your list
    companies.value.push(resp.data)
    toast.success('شرکت با موفقیت ثبت شد')
    showCompanyModal.value = false
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'خطا در ثبت شرکت')
  }
}

/* ────────── life-cycle & watchers (declare LAST) ────────── */
onMounted(() => {
  // load the correct list once when the component mounts
  if (activeTab.value === 'companies') fetchCompanies()
  else fetchUsers()
})

watch(
    activeTab,
    tab => {
      if (tab === 'users') fetchUsers()
      else if (tab === 'companies') fetchCompanies()
    },
    { immediate: false },
)

</script>


<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="menu bg-gray-800 text-gray-400 w-60 p-4">
      <ul>
        <li>
          <a
              :class="{ 'active bg-[#4c956c] text-white': activeTab==='users' }"
              @click="activeTab='users'"
          >
        <span class="inline-block w-5 h-5 mr-2">
          <img :src="userIco" alt="کاربر" class="w-full h-full" />
        </span>
            کاربران
          </a>
        </li>
        <li>
          <a
              :class="{ 'active bg-[#4c956c] text-white': activeTab==='companies' }"
              @click="activeTab='companies'"
          >
        <span class="inline-block w-5 h-5 mr-2">
          <img :src="companyIco" alt="شرکت" class="w-full h-full" />
        </span>
            شرکت‌ها
          </a>
        </li>
        <li>
          <a
              :class="{ 'active bg-[#4c956c] text-white': activeTab==='notify' }"
              @click="activeTab='notify'"
          >
        <span class="inline-block w-5 h-5 mr-2">
          <img :src="notifyIco" alt="ارسال یادآوری" class="w-full h-full" />
        </span>
            ارسال یادآوری
          </a>
        </li>
        <li>
          <a
              :class="{ 'active bg-[#4c956c] text-white': activeTab==='contract' }"
              @click="activeTab='contract'"
          >
        <span class="inline-block w-5 h-5 mr-2">
          <img :src="contractIco" alt="تولید قرارداد" class="w-full h-full" />
        </span>
            تولید قرارداد
          </a>
        </li>
      </ul>
    </aside>
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

    <!-- Main -->
    <main class="flex-1 p-6 bg-base-100 overflow-y-auto">
      <!-- Users -->
      <section v-if="activeTab==='users'">
        <h2 class="text-2xl font-semibold mb-4">مدیریت کاربران</h2>

        <!-- search + filter buttons -->
        <div class="flex flex-wrap items-center mb-4 space-x-2">
          <!-- fixed-width on sm+ screens, full width on xs -->
          <input
              v-model="userSearch"
              type="text"
              placeholder="جستجو نام یا کد ملی"
              class="input input-bordered w-full sm:w-64"
          />

          <button
              @click="searchUsers"
              class="btn btn-primary flex-shrink-0"
          >
            <span class="flex items-center">
              <img :src="searchIco" alt="جستجو" class="w-5 h-5 ml-2" />
              جستجو
            </span>
          </button>

          <!--          <label-->
          <!--              for="filter-modal"-->
          <!--              class="btn btn-neutral flex-shrink-0"-->
          <!--          >-->
          <!--            <span class="flex items-center">-->
          <!--              <img :src="filterIco" alt="فیلتر" class="w-5 h-5 ml-2" />-->
          <!--              فیلتر-->
          <!--            </span>-->
          <!--          </label>-->
        </div>

        <!-- users table -->
        <table class="table table-zebra w-full">
          <thead class="bg-gray-200 text-gray-800">
          <tr>
            <th class="px-2 py-1">ردیف</th>
            <th class="px-2 py-1"> نام</th>
            <th class="px-2 py-1">شماره</th>
            <th class="px-2 py-1">نام سازمان</th>
            <th class="px-2 py-1">کد ملی</th>
            <th class="px-2 py-1  text-center">عملیات</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="u in paginatedUsers" :key="u.id" class="hover">
            <td>{{u.id}}</td>
            <td>{{u.name}}</td>
            <td><span style="direction:ltr;unicode-bidi:isolate">{{u.phone}}</span></td>
            <td>{{u.company}}</td>
            <td>{{u.nationalId}}</td>
            <td class="space-x-2 text-center">
              <button @click="downloadUser(u.id)" class="btn btn-sm btn-neutral">دانلود</button>
              <button @click="acceptUser(u.id)"   class="btn btn-sm btn-primary">تایید</button>
              <button @click="rejectUser(u.id)"   class="btn btn-sm btn-accent">عدم تایید</button>
            </td>
          </tr>
          <tr v-if="!paginatedUsers.length">
            <td colspan="6" class="text-center text-gray-500 py-4">موردی یافت نشد</td>
          </tr>
          </tbody>
        </table>

        <!-- pagination -->
        <div class="flex justify-center items-center space-x-2 mt-4">
          <button @click="prevPage" :disabled="currentPage===1" class="btn btn-outline btn-sm">قبلی</button>
          <button v-for="p in pages" :key="p" @click="currentPage=p"
                  :class="['btn btn-sm', currentPage===p?'btn-primary':'btn-outline']">{{p}}</button>
          <button @click="nextPage" :disabled="currentPage===totalPages" class="btn btn-outline btn-sm">بعدی</button>
        </div>
      </section>

      <!-- Companies -->
      <section v-else-if="activeTab==='companies'">
        <h2 class="text-2xl font-semibold mb-4">مدیریت شرکت‌ها</h2>
        <div class="modal" :class="{ 'modal-open': showCompanyModal }">
          <div
              class="modal-box w-11/12 max-w-3xl h-[80vh] max-h-[50vh] overflow-y-auto relative">
            <!-- close button -->
            <button
                class="btn btn-sm btn-circle absolute left-2 top-2"
                @click="showCompanyModal = false"
            >✕</button>

            <h3 class="text-lg font-bold mb-4">افزودن شرکت</h3>

            <div class="form-control mb-3">
              <label class="label"><span class="label-text">نام شرکت</span></label>
              <input
                  v-model="newCompanyName"
                  type="text"
                  placeholder="نام شرکت"
                  class="input input-bordered w-full"
              />
            </div>

            <div class="form-control mb-3">
              <label class="label"><span class="label-text">تاریخ شروع قرارداد</span></label>
              <DatePicker
                  v-model="newCompanyStart"
                  type="date"
                  format="YYYY/MM/DD"
                  displayFormat="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ"
                  locale="fa"
                  class="w-full"
              />
            </div>

            <div class="form-control mb-6">
              <label class="label"><span class="label-text">تاریخ پایان قرارداد</span></label>
              <DatePicker
                  v-model="newCompanyEnd"
                  type="date"
                  format="YYYY/MM/DD"
                  displayFormat="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ"
                  locale="fa"
                  class="w-full"
              />
            </div>

            <div class="modal-action">
              <button class="btn btn-ghost " @click="showCompanyModal = false">لغو</button>
              <button class="btn btn-primary" @click="addCompany">ثبت شرکت</button>
            </div>
          </div>
        </div>

        <div class="flex mb-4">
          <input v-model="companySearch" type="text" placeholder="جستجو شرکت..." class="input input-bordered flex-1"/>
          <button @click="openCompanyModal" class="btn btn-primary ml-2">افزودن شرکت</button>
        </div>
        <ul class="space-y-2">
          <li v-for="c in filteredCompanies" :key="c.id" class="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <span>{{c.name}}</span>
            <div class="space-x-2">
              <button @click="editCompany(c.id)"   class="btn btn-sm btn-ghost">ویرایش</button>
              <button @click="deleteCompany(c.id)" class="btn btn-sm btn-error">حذف</button>
            </div>
          </li>
          <li v-if="!filteredCompanies.length" class="text-center text-gray-500 py-4">موردی یافت نشد</li>
        </ul>
      </section>

      <!-- Notify -->
      <section v-else-if="activeTab==='notify'">
        <h2 class="text-2xl font-semibold mb-6">ارسال یادآوری</h2>

        <div class="card bg-white shadow-lg rounded-lg p-6 space-y-6">
          <!-- top row: template + user picker -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Template Selector -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">انتخاب قالب پیام</span>
              </label>
              <select
                  v-model="selectedTemplate"
                  @change="applyTemplate"
                  class="select select-bordered w-full"
              >
                <option disabled value="">انتخاب کنید</option>
                <option v-for="t in messageTemplates" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <!-- User Picker -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">انتخاب کاربر</span>
              </label>
              <select v-model="notifyUser" class="select select-bordered w-full">
                <option disabled value="">انتخاب کنید</option>
                <option
                    v-for="u in users"
                    :key="u.id"
                    :value="u.id"
                >
                  {{ u.name }} — {{ u.phone }}
                </option>
              </select>
            </div>
          </div>

          <!-- Message Box -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">متن پیام</span>
            </label>
            <textarea
                v-model="notifyMessage"
                rows="4"
                class="textarea textarea-bordered w-full"
                placeholder="متن پیام"
            ></textarea>
          </div>

          <!-- Send Button -->
          <div class="flex justify-end">
            <button
                @click="sendNotification"
                :disabled="!notifyUser || !notifyMessage"
                class="btn btn-primary px-8"
            >
              ارسال پیامک
            </button>
          </div>
        </div>
      </section>



      <section v-else-if="activeTab==='contract'">
        <h2 class="text-2xl font-semibold mb-6">تولید قرارداد</h2>

        <div class="card bg-white shadow-lg p-6 rounded-lg">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <!-- National ID -->
            <div class="form-control">
              <label class="label"><span class="label-text">کد ملی کاربر</span></label>
              <input
                  v-model="contractNationalId"
                  type="text"
                  placeholder="مثال: 0922476755"
                  class="input input-bordered w-full"
              />
            </div>

            <!-- Start Date -->
            <div class="form-control">
              <label class="label"><span class="label-text">تاریخ شروع</span></label>
              <DatePicker
                  v-model="contractStart"
                  format="jYYYY/jMM/jDD"
                  placeholder="شروع قرارداد"
                  locale="fa"
                  class="w-full"
              />
            </div>

            <!-- End Date -->
            <div class="form-control">
              <label class="label"><span class="label-text">تاریخ پایان</span></label>
              <DatePicker
                  v-model="contractEnd"
                  type="date"
                  format="jYYYY/jMM/jDD"
                  placeholder="پایان قرارداد"
                  locale="fa"
                  class="w-full"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
                @click="generateContract"
                :disabled="!contractNationalId || !contractStart || !contractEnd"
                class="btn btn-primary px-8"
            >
              تولید
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Filter Modal -->
    <input type="checkbox" id="filter-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">فیلتر کاربران</h3>
        <label class="block mb-2">نام پدر</label>
        <input v-model="fatherFilter" type="text" placeholder="نام پدر" class="input input-bordered w-full mb-4"/>
        <label class="block mb-2">تاریخ تولد (بخشی)</label>
        <input v-model="birthFilter" type="text" placeholder="مثال: 1404/03" class="input input-bordered w-full mb-4"/>
        <div class="modal-action">
          <label for="filter-modal" class="btn">لغو</label>
          <label for="filter-modal" class="btn btn-primary">اعمال فیلتر</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu a {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: block;
}
.menu a.active {
  /* DaisyUI active styling */
}
</style>

