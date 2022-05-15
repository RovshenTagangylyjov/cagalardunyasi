<script setup lang="ts">
import ButtonBase from './ButtonBase.vue';
import { ref } from 'vue';
import type { ProductImage } from 'src/types';

defineProps<{ images: ProductImage[] }>();
const slide = ref<number>(0);
const fullscreen = ref<boolean>(false);
</script>

<template>
  <q-carousel
    :vertical="!$q.screen.lt.sm"
    swipeable
    animated
    arrows
    keep-alive
    height="20rem"
    v-model="slide"
    v-model:fullscreen="fullscreen"
    thumbnails
    infinite
  >
    <q-carousel-slide
      v-for="image of images"
      :key="image.order"
      :name="image.order"
      :img-src="image.path"
      style="background-image: none"
    >
      <q-img fit="contain" :src="image.path" class="full-width full-height" />
    </q-carousel-slide>
    <template v-slot:control>
      <q-carousel-control position="top-left" :offset="[18, 18]">
        <ButtonBase
          color="white"
          text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen"
        />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>
