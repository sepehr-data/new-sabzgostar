<script setup lang="ts">
import bgImg from '@/assets/img/background_img.png'
import TypingAnimation from '@/components/typeAnimation.vue'
</script>

<template>
  <!-- Hero Section -->
  <div class="hero relative h-30 bg-[#2d6a4f]/80">
    <div class="absolute inset-0 bg-[#2d6a4f]/80"></div>
    <div class="hero-content relative text-center text-white">
      <TypingAnimation title="درباره سبز گستر گوارشک" />
    </div>
  </div>

  <div class="container mx-auto py-12 px-4 space-y-12">
    <!-- Company Introduction -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <h2 class="text-3xl font-semibold mb-4">شرکت سبز گستر گوارشک</h2>
        <p class="text-gray-800 leading-relaxed mb-4">
          شرکت سبز گستر گوارشک در سال ۱۳۸۵ تأسیس شد و با ارائه خدمات مهندسی و خدماتی متنوع،
          به عنوان یکی از شرکت‌های پیشرو در صنعت شناخته می‌شود.
        </p>
        <p class="text-gray-800 leading-relaxed">
          این شرکت با بهره‌گیری از تیم متخصص و فناوری‌های نوین، متعهد به ارائه راهکارهای
          کارآمد و باکیفیت برای مشتریان خود است.
        </p>
      </div>
      <div>
        <img :src="bgImg" alt="About Us" class="rounded-lg shadow-lg w-full object-cover max-h-80" />
      </div>
    </div>

    <!-- Mission & Vision -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-white shadow-lg p-6">
        <h3 class="text-2xl font-semibold mb-2">ماموریت ما</h3>
        <p class="text-gray-700 leading-relaxed">
          ماموریت ما ارتقاء کیفیت زندگی مشتریان از طریق ارائه خدمات مهندسی دقیق، نوآورانه و پایدار است.
        </p>
      </div>
      <div class="card bg-white shadow-lg p-6">
        <h3 class="text-2xl font-semibold mb-2">چشم‌انداز ما</h3>
        <p class="text-gray-700 leading-relaxed">
          چشم‌انداز ما تبدیل شدن به پیشروترین شرکت مهندسی خدماتی در منطقه با تمرکز بر نوآوری
          و رضایت مشتری است.
        </p>
      </div>
    </div>

    <!-- Core Values -->
    <div>
      <h2 class="text-3xl font-semibold text-center mb-6">ارزش‌های ما</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <span class="text-4xl">🤝</span>
          <h4 class="mt-2 font-semibold">اصالت</h4>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <span class="text-4xl">🚀</span>
          <h4 class="mt-2 font-semibold">نوآوری</h4>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <span class="text-4xl">🌱</span>
          <h4 class="mt-2 font-semibold">پایداری</h4>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <span class="text-4xl">🎯</span>
          <h4 class="mt-2 font-semibold">تمرکز بر مشتری</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No extra CSS—Tailwind and DaisyUI handle styling */
</style>
