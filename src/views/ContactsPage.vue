<script setup lang="ts">
import bgImg from '@/assets/img/background_img.png'
// Static page, no additional script logic needed
</script>

<template>
  <!-- Hero with background image + dark overlay -->
  <div
      class="hero relative min-h-screen bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImg})` }"
  >
    <div class="hero-overlay bg-opacity-50 absolute inset-0"></div>

    <div class="container relative mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-10 text-white">
        <h2 class="text-4xl font-bold">تماس با ما</h2>
        <p class="text-green-200 mt-2">ما در سبز گستر گوارشک همیشه در دسترس هستیم</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Contact Info Card -->
        <div class="bg-white bg-opacity-90 rounded-xl shadow-xl p-8 space-y-8">
          <div class="flex items-start space-x-4 rtl:space-x-reverse">
            <span class="text-3xl text-[#74c69d]">📍</span>
            <div>
              <h3 class="text-xl font-semibold">آدرس</h3>
              <p class="text-gray-700">تهران، خیابان مثال، پلاک ۱۲۳</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 rtl:space-x-reverse">
            <span class="text-3xl text-[#74c69d]">📞</span>
            <div>
              <h3 class="text-xl font-semibold">تلفن</h3>
              <p class="text-gray-700">021-12345678</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 rtl:space-x-reverse">
            <span class="text-3xl text-[#74c69d]">✉️</span>
            <div>
              <h3 class="text-xl font-semibold">ایمیل</h3>
              <p class="text-gray-700">info@sabzgostar-gavareshk.ir</p>
            </div>
          </div>
          <div class="rounded-lg overflow-hidden">
            <!-- Embedded Google Map -->
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1234567890123!2d51.400000000000!3d35.689500000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0c0c0c0c0c0c%3A0xabcdefabcdefabcd!2sSabzGostar%20Gavareshk!5e0!3m2!1sfa!2sir!4v1610000000000"
                width="100%"
                height="250"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
            ></iframe>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div class="bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-800" for="name">
                نام و نام خانوادگی
              </label>
              <input
                  id="name"
                  type="text"
                  placeholder="نام شما"
                  class="input input-bordered w-full"
                  required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-800" for="email">
                ایمیل
              </label>
              <input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  class="input input-bordered w-full"
                  required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-800" for="message">
                پیام شما
              </label>
              <textarea
                  id="message"
                  rows="4"
                  placeholder="پیام خود را بنویسید"
                  class="textarea textarea-bordered w-full"
                  required
              ></textarea>
            </div>
            <button
                type="submit"
                class="btn-accent w-full"
                style="background-color: #74c69d; border-color: transparent"
            >
              ارسال پیام
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* RTL spacing fix */
.rtl\:space-x-reverse {
  --space-x-reverse: 1;
}
</style>
