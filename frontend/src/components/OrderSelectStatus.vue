<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{ modelValue: string; readonly?: boolean }>(),
  { readonly: false }
);
defineEmits<{ (e: 'update:modelValue', newValue: string): void }>();

const i18n = useI18n();
const status = ref<string>(props.modelValue);
const statusOptions = computed(() => {
  return [
    {
      label: i18n.t('status.pending'),
      value: 'PND',
    },
    {
      label: i18n.t('status.awaitingShipment'),
      value: 'ASH',
    },
    {
      label: i18n.t('status.shipping'),
      value: 'SHP',
    },
    {
      label: i18n.t('status.completed'),
      value: 'CMP',
    },
    {
      label: i18n.t('status.cancelled'),
      value: 'CNC',
    },
  ];
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PND':
      return 'warning';
    case 'ASH':
      return 'info';
    case 'SHP':
      return 'accent';
    case 'CMP':
      return 'positive';
    case 'CNC':
      return 'negative';
  }
};

const getStatusLabel = (statusValue: string) => {
  return statusOptions.value.find((status) => status.value === statusValue)
    ?.label;
};
</script>

<template>
  <div
    v-if="readonly"
    class="text-body"
    :class="`text-${getStatusColor(status)}`"
  >
    {{ getStatusLabel(status) }}
  </div>
  <q-select
    v-else
    v-model="status"
    :options="statusOptions"
    option-value="value"
    option-label="label"
    emit-value
    map-options
    filled
    dense
    transition-show="scale"
    transition-hide="scale"
    bg-color="white"
    @update:model-value="(newValue) => $emit('update:modelValue', newValue)"
  >
    <template #prepend>
      <div
        class="text-bold full-height border-radius"
        :class="`bg-${getStatusColor(status)}`"
        style="width: 5px"
      />
    </template>
  </q-select>
</template>
