<script setup lang="ts">
import { computed } from 'vue';
import type { BaseProduct } from 'src/types';
import { useCategory } from 'src/stores';
import { maxLength, rules } from 'src/helpers/validation';

const props = defineProps<{ modelValue: BaseProduct }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: BaseProduct): void;
}>();
const product = computed({
  get: () => props.modelValue,
  set: (newValue) => emits('update:modelValue', newValue),
});
const categoryStore = useCategory();
</script>

<template>
  <div class="row q-gutter-sm">
    <q-input
      outlined
      v-model="product.name_tk"
      :label="$t('product.nameTk')"
      counter
      class="col"
      :rules="[maxLength(100), rules.required]"
    />
    <q-input
      outlined
      v-model="product.name_rus"
      counter
      :label="$t('product.nameRus')"
      class="col"
      :rules="[maxLength(100), rules.required]"
    />
  </div>
  <div class="row">
    <q-input
      outlined
      v-model="product.description_tk"
      :label="$t('product.descTk')"
      counter
      autogrow
      class="col"
      :rules="[maxLength(2500)]"
    />
  </div>
  <div class="row">
    <q-input
      outlined
      v-model="product.description_rus"
      :label="$t('product.descRus')"
      counter
      autogrow
      class="col"
      :rules="[maxLength(2500)]"
    />
  </div>
  <div class="row q-gutter-sm">
    <q-input
      :label="$t('product.fromAge')"
      type="number"
      outlined
      v-model.number="product.from_age"
      class="col"
      :rules="[rules.required]"
    />
    <q-input
      :label="$t('product.toAge')"
      type="number"
      outlined
      v-model.number="product.to_age"
      class="col"
      :rules="[
        rules.required,
        () =>
          (product.from_age &&
            product.to_age &&
            product.from_age <= product.to_age) ||
          '\'From Age\' must be less than \'To Age\'',
      ]"
    />
  </div>
  <div class="row q-gutter-sm">
    <div class="col">
      <q-checkbox :label="$t('product.female')" v-model="product.female" />
    </div>
    <div class="col">
      <q-checkbox :label="$t('product.male')" v-model="product.male" />
    </div>
  </div>
  <div class="row">
    <q-select
      v-model="product.categories"
      :options="categoryStore.categories"
      option-value="id"
      option-label="name_tk"
      :label="$t('product.category', 2)"
      multiple
      emit-value
      map-options
      outlined
      class="col"
      :rules="[(val) => val.length > 0 || 'This field is required.']"
    />
  </div>
  <div class="row q-gutter-sm">
    <q-input
      type="number"
      step="0.01"
      min="0"
      outlined
      v-model.number="product.price"
      :label="$t('product.price')"
      class="col"
      :rules="[rules.required]"
    >
      <template v-slot:append> <q-icon name="attach_money" /> </template>
    </q-input>
    <q-input
      type="number"
      outlined
      v-model.number="product.stock"
      :label="$t('product.stock')"
      class="col"
      :rules="[(val) => val >= 0]"
    />
  </div>

  <div class="row q-gutter-sm">
    <q-checkbox :label="$t('product.isActive')" v-model="product.is_active" />
  </div>
</template>
