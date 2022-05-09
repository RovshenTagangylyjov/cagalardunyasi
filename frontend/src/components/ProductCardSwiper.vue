<script setup lang="ts">
import ButtonBase from './ButtonBase.vue';
import 'swiper/css';
import 'swiper/css/autoplay';

import { api } from 'boot/axios';
import { Autoplay, FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import ProductCard from './ProductCard.vue';
import { Product, ListResponseData, ProductFilter } from 'src/types';
import { notifyError } from 'src/helpers/notify';
import { provide } from 'vue';

const props = defineProps<{ filter?: ProductFilter; label: string }>();
const query = props.filter
  ? '?' + new URLSearchParams(props.filter).toString()
  : '';
const products: Product[] = [];

try {
  const response = await api.get(`products/${query}`);
  const data = response.data as ListResponseData<Product>;
  products.push(...data.results);
} catch (err) {
  notifyError(err as string);
}

provide('isFavReadOnly', true);
</script>

<template>
  <div class="container" v-if="products.length > 0">
    <div class="row q-px-sm justify-between">
      <div class="text-h6 text-weight-light">{{ props.label }}</div>
      <ButtonBase
        size="lg"
        icon="arrow_forward"
        :to="{ name: 'ProductList', query: filter ? filter : {} }"
      />
    </div>
    <swiper
      :modules="[Autoplay, FreeMode]"
      :speed="750"
      loop
      free-mode
      grab-cursor
      :autoplay="{
        delay: 3e3,
        disableOnInteraction: false,
      }"
      :breakpoints="{
        0: { slidesPerView: 2, spaceBetween: 14, slidesPerGroup: 1 },
        576: { slidesPerView: 3, spaceBetween: 14, slidesPerGroup: 2 },
        768: { slidesPerView: 4, spaceBetween: 28, slidesPerGroup: 3 },
        992: { slidesPerView: 5, spaceBetween: 28 },
      }"
    >
      <swiper-slide
        v-for="product in products"
        :key="product.id"
        class="q-py-sm"
      >
        <ProductCard :product="product" />
      </swiper-slide>
    </swiper>
  </div>
</template>
