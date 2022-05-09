<script setup lang="ts">
import { ref } from 'vue';
const slide = ref<string>('1');
const autoplay = ref<boolean>(true);
</script>
<template>
  <q-carousel
    v-model="slide"
    keep-alive
    navigation
    arrows
    swipeable
    infinite
    :autoplay="autoplay ? 4000 : false"
    animated
    transition-prev="jump-right"
    transition-next="jump-left"
    @mouseenter="autoplay = false"
    @mouseleave="autoplay = true"
    padding
    height="450px"
    width="100%"
    control-color="white"
    class="bg-primary text-white shadow-3 rounded-borders"
  >
    <q-carousel-slide
      name="1"
      class="column no-wrap justify-center"
      img-src="~assets/images/head1.jpg"
      draggable="false"
      v-once
    >
      <div>
        <div class="text-h3">Something Big</div>
        <div class="text-subtitle1">
          And some bla bla bla and bla bla bladawdwdad
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn color="white" outline label="Explore Now" />
      </div>
    </q-carousel-slide>
    <q-carousel-slide
      name="2"
      class="column no-wrap justify-center"
      img-src="~assets/images/head2.jpg"
      draggable="false"
      v-once
    >
      <div>
        <div class="text-h3">Something Big</div>
        <div class="text-subtitle1">
          And some bla bla bla and bla bla bladawdwdad
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn color="white" outline label="Explore Now" />
      </div>
    </q-carousel-slide>
    <q-carousel-slide
      name="3"
      class="column no-wrap justify-center"
      img-src="~assets/images/head3.jpg"
      draggable="false"
      v-once
    >
      <div>
        <div class="text-h3">Something Big</div>
        <div class="text-subtitle1">
          And some bla bla bla and bla bla bladawdwdad
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn color="white" outline label="Explore Now" />
      </div>
    </q-carousel-slide>
    <q-carousel-slide
      name="4"
      class="column no-wrap justify-center"
      img-src="~assets/images/head4.jpg"
      draggable="false"
      v-once
    >
      <div>
        <div class="text-h3">Something Big</div>
        <div class="text-subtitle1">
          And some bla bla bla and bla bla bladawdwdad
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn color="white" outline label="Explore Now" />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>
