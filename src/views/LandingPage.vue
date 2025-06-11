<script setup lang="ts">
import TypingAnimation from '@/components/typeAnimation.vue'
import bgImg from '@/assets/img/background_img.png'
import contactsIco from '@/assets/img/contacts.svg'
import archiveIco from '@/assets/img/archive.svg'
import userIco from '@/assets/img/user.svg'
</script>

<template>
  <div
      class="hero relative min-h-screen bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImg})` }"
  >
    <!-- overlay to fade the background for readability -->
    <div class="hero-overlay  bg-opacity-50 absolute inset-0"></div>

    <div class="hero-content relative text-center text-neutral-content">
      <div class="max-w-md">
        <!-- Typing Heading -->
        <TypingAnimation title="سبز گستر گوارشک" />

        <p class="py-2 text-lg">شرکت مهندسی خدماتی سبزگستر گوارشک</p>

        <div class="mt-6 flex justify-center gap-4">
          <router-link to="/login" class="btn btn-neutral">
            <img :src="userIco" alt="user icon" class="w-5 h-5" />
            ورود / ثبت نام
          </router-link>

          <router-link to="/contacts" class="btn btn-neutral flex items-center gap-2">
            <img :src="contactsIco" alt="contacts icon" class="w-5 h-5" />
            <span>تماس با ما</span>
          </router-link>

          <router-link to="/downloads" class="btn btn-neutral">
            <img :src="archiveIco" alt="archive icon" class="w-5 h-5" />
            دانلود مدارک
          </router-link>
        </div>
        <br>
        <router-link to="/about">
          در باره ما بیشتر بخوانید
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed; DaisyUI and Tailwind handle overlays and text colors. */
</style>
