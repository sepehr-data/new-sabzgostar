<!-- src/components/TypingHeading.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

/**
 * Props interface
 */
interface Props {
  /** The text to type out */
  title: string
}

/** Define props with TS */
const props = defineProps<Props>()

/** Reactive state for what's been displayed so far */
const displayedText = ref<string>('')

/** Internal index pointer */
let idx = 0

/** Typing speed in ms */
const speed = 150

/**
 * Kick off the typing animation
 */
function startTyping() {
  // reset in case this is a re-run
  displayedText.value = ''
  idx = 0

  const timer = setInterval(() => {
    if (idx < props.title.length) {
      displayedText.value += props.title[idx]
      idx++
    } else {
      clearInterval(timer)
    }
  }, speed)
}

// start on-mount
onMounted(startTyping)

// if the prop ever changes, restart the animation
watch(() => props.title, startTyping)
</script>

<template>
  <h2 class="text-5xl font-bold mb-4 whitespace-pre inline-flex items-center">
    {{ displayedText }}
    <span class="cursor inline-block ml-1">&nbsp;</span>
  </h2>
</template>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.cursor {
  animation: blink 1s step-end infinite;
  width: 0.5rem;
  background-color: currentColor;
  height: 1.2em;
}
</style>
