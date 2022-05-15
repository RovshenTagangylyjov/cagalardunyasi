<script setup lang="ts">
import ProductQuantity from './ProductQuantity.vue';
import ButtonBase from './ButtonBase.vue';
import type { CartItem, Product } from 'src/types';
import { useCart } from 'src/stores';
import { computed, ref, inject } from 'vue';
import { DollarToManat } from 'src/helpers/product';

const props = defineProps<{ cartItem: CartItem }>();
const isEditable = inject<boolean>('isEditable', false);
const cart = useCart();
const loading = ref<boolean>(false);

const quantity = computed({
  get() {
    return props.cartItem.quantity;
  },
  set(newQuantity: number) {
    loading.value = true;
    void cart
      .updateQuantity(props.cartItem, newQuantity)
      .then(() => (loading.value = false));
  },
});
</script>

<template>
  <q-item
    :to="{
      name: 'ProductDetail',
      params: { id: cartItem.product.id, slug: cartItem.product.slug },
    }"
    class="rounded-borders q-px-sm"
  >
    <q-item-section class="col-4 col-sm-2">
      <q-img :src="cartItem.product.images[0].path" :ratio="1" />
    </q-item-section>

    <q-item-section class="col-8 col-sm-6 q-pl-sm">
      <q-item-label>
        {{ cartItem.product[`name_${$i18n.locale}` as keyof Product] }}
      </q-item-label>
      <q-item-label caption>
        {{ cartItem.product[`description_${$i18n.locale}` as keyof Product] }}
      </q-item-label>
    </q-item-section>

    <q-item-section class="col-4 col-sm-2 text-center text-grey-9">
      <div>
        <ProductQuantity
          v-if="isEditable"
          v-model="quantity"
          :stock="cartItem.product.stock"
          :loading="loading"
        />
        <div v-else class="text-h6">{{ quantity }}</div>
      </div>
    </q-item-section>

    <q-item-section side class="col-8 col-sm-2">
      <q-item-label class="price text-primary">
        {{ DollarToManat(cartItem.product.price) }} TMT
      </q-item-label>
      <q-item-label caption v-if="isEditable">
        <ButtonBase icon="delete" @click.prevent.stop="cart.remove(cartItem)" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped lang="scss">
.q-item {
  flex-wrap: wrap !important;

  & .q-item__section {
    margin: 0;
  }
}
</style>
