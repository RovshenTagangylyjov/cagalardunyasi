<script setup lang="ts">
import OrderCartItem from './OrderCartItem.vue';
import { Cart } from 'src/types';

defineProps<{ cart: Cart }>();
</script>

<template>
  <q-list separator class="rounded-borders" v-if="cart.items.length > 0">
    <template v-for="item in cart.items" :key="item.product.id">
      <OrderCartItem :cartItem="item" />
    </template>
  </q-list>

  <div v-else class="column justify-center items-center">
    <q-icon
      name="add_shopping_cart"
      size="15em"
      color="grey"
      @click="$router.push({ name: 'ProductList' })"
    />
  </div>
</template>
