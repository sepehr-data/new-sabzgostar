<script setup lang="ts">
import pdfIco from '@/assets/img/document.svg'
import docxIco from '@/assets/img/docx.svg'
interface Download {
  name: string
  description: string
  url: string
}

// لیست فایل‌های قابل دانلود
const downloads: Download[] = [
  { name: 'فرم بیمه.pdf', description: 'فرم بیمه تامین اجتماعی', url: '/docs/plan.pdf' },
  { name: 'bank-form.pdf', description: 'فرم بانک مسکن', url: '/docs/contract.pdf' }
]

// آیکن فایل بر اساس فرمت
const getIcon = (fileName: string) => {
  if (fileName.toLowerCase().endsWith('.pdf')) return pdfIco
  if (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) return docxIco
  return '📁'
}
</script>

<template>
  <!-- Hero Section -->
  <div class="hero h-32 bg-[#1b4332]/80 mb-6">
    <div class="hero-content text-center text-white">
      <div>
        <h2 class="text-2xl md:text-3xl font-semibold">دانلود مدارک رسمی</h2>
        <p class="mt-1 text-sm md:text-base">فایل‌های مهم و رسمی شرکت را می‌توانید از این بخش دریافت کنید</p>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-4">
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="table table-zebra w-full">
        <thead>
        <tr>
          <th>ردیف</th>
          <th>نام فایل</th>
          <th>توضیحات</th>
          <th>فرمت</th>
          <th>عملیات</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(file, idx) in downloads" :key="file.url">
          <th>{{ idx + 1 }}</th>
          <td class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-xl"> <img :src="getIcon(file.name)" alt="user icon" class="w-5 h-5" /></span>
            <span>{{ file.name }}</span>
          </td>
          <td>{{ file.description }}</td>
          <td>{{ file.name.split('.').pop() }}</td>
          <td>
            <a
                :href="file.url"
                :download="file.name"
                class="btn btn-sm btn-outline"
                style="--btn-primary-bg: #74c69d; --btn-primary-color: white; --btn-primary-border: transparent"
            >
              دانلود
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* RTL spacing fix */
.rtl\:space-x-reverse {
  --space-x-reverse: 1;
}
</style>
