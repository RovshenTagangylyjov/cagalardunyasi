<script setup lang="ts">
import ButtonBase from './ButtonBase.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const filterCount = ref<number>(0);

watch(
  () => route.query,
  () => {
    filterCount.value = Object.keys(route.query).length;
    if (route.query.search) filterCount.value--;
  },
  { immediate: true }
);
</script>

<template>
  <ButtonBase icon="tune" class="q-ml-md">
    <q-badge color="red" floating rounded :label="filterCount" />
  </ButtonBase>
</template>
