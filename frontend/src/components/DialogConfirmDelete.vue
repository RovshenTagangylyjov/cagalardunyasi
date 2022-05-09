<script setup lang="ts">
import ButtonBase from 'components/ButtonBase.vue';
import { computed } from 'vue';

const props = defineProps<{ modelValue: boolean; itemName: string }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: boolean): void;
  (e: 'confirm'): void;
}>();
const show = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emits('update:modelValue', newValue),
});
</script>

<template>
  <q-dialog v-model="show" persistent>
    <q-card class="q-px-md q-py-sm">
      <q-card-section class="row items-center justify-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm text-negative text-body2">{{
          $t('text.deleteConfirm', { item: itemName })
        }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <ButtonBase :label="$t('label.cancel')" v-close-popup />
        <ButtonBase
          :label="$t('label.delete')"
          color="negative"
          v-close-popup
          @click="emits('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
