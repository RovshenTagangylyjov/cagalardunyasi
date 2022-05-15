<script setup lang="ts">
import { computed, ref } from 'vue';
import { QBtnProps } from 'quasar';
import { useCart } from 'src/stores';
import type { Product } from 'src/types';
import { useI18n } from 'vue-i18n';

interface Props {
  product: Product;
  quantity?: number;
}

const props = withDefaults(defineProps<Props>(), { quantity: 1 });
const cart = useCart();
const i18n = useI18n();
const success = ref(props.product.stock === 0);
const loading = ref(false);

const button = computed((): QBtnProps => {
  return {
    label: i18n.t('label.addToCart'),
    color: 'primary',
    icon: 'add_shopping_cart',
  };
});

const buttonSuccess = computed(() => {
  return {
    label: i18n.t('label.addedToCart'),
    color: 'positive',
    icon: 'done',
    disable: true,
  };
});

const addToCart = async () => {
  loading.value = true;
  await cart.add(props.product, props.quantity).then(() => {
    success.value = true;
    setTimeout(() => (success.value = false), 1500);
  });

  loading.value = false;
};
</script>

<template>
  <q-btn
    v-bind="success ? buttonSuccess : button"
    :loading="loading"
    size=".5rem"
    class="full-width q-px-none q-mt-sm add-to-cart"
    :class="{ success }"
    @click="addToCart"
  />
</template>

<style scoped lang="scss">
.add-to-cart {
  transition: all 0.3s ease;
  max-width: 100%;
}

.success {
  cursor: not-allowed;
}
</style>
