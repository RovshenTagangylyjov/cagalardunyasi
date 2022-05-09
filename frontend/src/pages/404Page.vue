<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
      <q-btn
        class="q-mt-xl q-ml-md"
        color="white"
        text-color="blue"
        unelevated
        label="Go Back"
        no-caps
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>
