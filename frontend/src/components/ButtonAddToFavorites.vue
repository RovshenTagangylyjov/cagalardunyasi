<script setup lang="ts">
import ButtonBase from './ButtonBase.vue';
import { ref, inject } from 'vue';
import { useProduct, useSession } from 'src/stores';

defineProps<{ isFavorite: boolean | undefined; productId: number }>();
const emits = defineEmits<{
  (e: 'toggleIsFavorite', id: number, isFavorite: boolean): void;
}>();

const productStore = useProduct();
const session = useSession();
const loading = ref<boolean>(false);
const isReadOnly = inject<boolean>('isFavReadOnly', false);

const toggleIsFavorite = async (id: number) => {
  loading.value = true;
  await productStore.toggleIsFavorite(id).then(({ is_favorite }) => {
    emits('toggleIsFavorite', id, is_favorite);
  });
  loading.value = false;
};
</script>

<template>
  <ButtonBase
    :icon="isFavorite ? 'favorite' : 'favorite_border'"
    text-color="red"
    :disabled="isReadOnly"
    @click="
      session.isAuthenticated
        ? toggleIsFavorite(productId)
        : $router.push({ name: 'UserLogin' })
    "
    :loading="loading"
  />
</template>
