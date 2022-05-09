<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocalStorage, QSelectProps } from 'quasar';

const { locale } = useI18n({ useScope: 'global' });
const localOptions: QSelectProps['options'] = [
  { value: 'tk', label: 'Tk' },
  { value: 'rus', label: 'Рус' },
];

watch(
  () => locale.value,
  (value) => LocalStorage.set('lang', value)
);
</script>

<template>
  <q-select
    v-model="locale"
    :options="localOptions"
    dense
    transition-show="scale"
    transition-hide="scale"
    borderless
    emit-value
    map-options
    options-dense
  />
</template>

<style scoped>
.q-select:deep(span),
.q-select:deep(i) {
  color: white;
}
</style>
