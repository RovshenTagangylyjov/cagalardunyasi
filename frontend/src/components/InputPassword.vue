<script setup lang="ts">
import { ref, computed } from 'vue';
import { rules } from 'src/helpers/validation';

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newValue: string): void;
}>();
const password = computed({
  get: () => props.modelValue,
  set: (newValue) => emits('update:modelValue', newValue),
});

const isPasswordVisible = ref<boolean>(false);
</script>

<template>
  <q-input
    class="col"
    v-model="password"
    :rules="[rules.required]"
    :type="isPasswordVisible ? 'text' : 'password'"
    :label="$t('user.password')"
    outlined
    lazy-rules
  >
    <template v-slot:append>
      <q-icon
        :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPasswordVisible = !isPasswordVisible"
      />
    </template>
  </q-input>
</template>
