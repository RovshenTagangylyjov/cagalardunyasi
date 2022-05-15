<script setup lang="ts">
import ButtonAddToCart from 'components/ButtonAddToCart.vue';
import ButtonAddToFavorites from './ButtonAddToFavorites.vue';
import { ref } from 'vue';
import type { Product } from 'src/types';
import { DollarToManat } from 'src/helpers/product';

defineProps<{ product: Product }>();
defineEmits<{ (e: 'route'): void }>();
const isHovered = ref<boolean>(false);
</script>

<template>
  <router-link
    :to="{
      name: 'ProductDetail',
      params: { slug: product.slug, id: product.id },
    }"
  >
    <q-card
      class="shadow-transition"
      :flat="!isHovered"
      @mouseover="isHovered = true"
      @mouseout="isHovered = false"
      @click="$emit('route')"
    >
      <q-card-section
        class="shadow-transition"
        :class="{ 'img-shadow': !isHovered }"
      >
        <q-img
          v-if="product.images.length > 0"
          :src="product.images[0].path"
          :ratio="1"
          fit="cover"
          :alt="product[`name_${$i18n.locale}` as keyof Product]?.toString()"
        >
          <ButtonAddToFavorites
            :isFavorite="product.is_favorite"
            :product-id="product.id"
            class="absolute-top-right all-pointer-events"
            @click.prevent.stop
            size=".8rem"
          />
        </q-img>
      </q-card-section>
      <q-card-section>
        <div class="title">
          {{ product[`name_${$i18n.locale}` as keyof Product] }}
        </div>
        <div class="rating">
          <q-rating
            :model-value="product.average_rating"
            readonly
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            color="yellow-12"
            size="1rem"
            no-dimming
          />
        </div>
        <div class="price text-no-wrap">
          <span> {{ DollarToManat(product.price) }} TMT </span>
        </div>
        <ButtonAddToCart @click.prevent.stop :product="product" />
      </q-card-section>
    </q-card>
  </router-link>
</template>

<style scoped lang="scss">
.q-card {
  .q-card__section {
    * {
      line-height: 1.3;
    }

    &[class*='img-shadow'] {
      border-radius: $generic-border-radius;
      box-shadow: 0 2px 10px 1px rgb(0 0 0 / 5%) !important;
    }

    .title {
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
}
</style>
