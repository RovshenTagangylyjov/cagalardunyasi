<script setup lang="ts">
import ButtonBase from './ButtonBase.vue';
import { computed, reactive } from 'vue';
import { Category } from 'src/types';
import { useCategory } from 'src/stores';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: boolean): void;
}>();
const categories = useCategory();

const isPromptOpen = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emits('update:modelValue', newValue),
});

const categoryFrom = reactive({ name_tk: '', name_rus: '' });

const save = async () => {
  await categories
    .create(categoryFrom as Category)
    .then(() => (isPromptOpen.value = false));
};
</script>

<template>
  <q-dialog v-model="isPromptOpen" persistent>
    <q-card class="q-py-sm q-px-md">
      <q-form @submit="save">
        <q-card-section>
          <div class="text-h6">{{ $t('text.createCategory') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="Name Tk"
            v-model="categoryFrom.name_tk"
            autofocus
            :rules="[(val) => !!val]"
            @keyup.enter="save"
          />
          <q-input
            label="Name Rus"
            v-model="categoryFrom.name_rus"
            :rules="[(val) => !!val]"
            @keyup.enter="save"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <ButtonBase label="Cancel" v-close-popup />
          <ButtonBase label="Add Category" type="submit" @click="save" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
