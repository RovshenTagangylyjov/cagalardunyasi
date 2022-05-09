<script setup lang="ts">
import { QBtnProps } from 'quasar';

withDefaults(
  defineProps<{ modelValue: number; stock: number; loading?: boolean }>(),
  { loading: false }
);
defineEmits<{ (e: 'update:modelValue', newValue: number): void }>();

const btnProps: QBtnProps = {
  padding: 'sm',
  size: '.8rem',
};
</script>

<template>
  <q-btn-group @click.prevent>
    <q-btn
      icon="remove"
      v-bind="btnProps"
      :disabled="modelValue === 1 || loading"
      @click.stop.prevent="$emit('update:modelValue', modelValue - 1)"
    />
    <q-btn v-bind="btnProps" :label="modelValue" :loading="loading" />
    <q-btn
      icon="add"
      v-bind="btnProps"
      :disabled="modelValue === stock || loading"
      @click.stop.prevent="$emit('update:modelValue', modelValue + 1)"
    />
  </q-btn-group>
</template>
