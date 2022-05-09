<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: boolean): void;
}>();

const isRead = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => {
    emits('update:modelValue', newValue);
  },
});
</script>

<template>
  <p class="text-red">Dine Turkmenbashy</p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum esse
    inventore, repudiandae consectetur blanditiis exercitationem aut nihil sed
    eius accusantium, dignissimos omnis ducimus provident sint dolorum atque
    ullam ut suscipit dicta, quo quae assumenda deleniti adipisci! Architecto
    consequatur eligendi corporis deleniti ad fug*iat rerum! Exercitationem
    incidunt eaque dolore consectetur delectus.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum esse
    inventore, repudiandae consectetur blanditiis exercitationem aut nihil sed
    eius accusantium, dignissimos omnis ducimus provident sint dolorum atque
    ullam ut suscipit dicta, quo quae assumenda deleniti adipisci! Architecto
    consequatur eligendi corporis deleniti ad fugiat rerum! Exercitationem
    incidunt eaque dolore consectetur delectus.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum esse
    inventore, repudiandae consectetur blanditiis exercitationem aut nihil sed
    eius accusantium, dignissimos omnis ducimus provident sint dolorum atque
    ullam ut suscipit dicta, quo quae assumenda deleniti adipisci! Architecto
    consequatur eligendi corporis deleniti ad fugiat rerum! Exercitationem
    incidunt eaque dolore consectetur delectus.
  </p>
  <q-checkbox
    v-model="isRead"
    class="text-weight-bold"
    :label="$t('text.deliveryPolicyAccept')"
  />
</template>
