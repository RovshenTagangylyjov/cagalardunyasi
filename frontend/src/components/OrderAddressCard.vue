<script setup lang="ts">
import type { Address } from 'src/types';

defineProps<{ address: Address; note: string | undefined }>();
</script>

<template>
  <q-card class="text-grey-9">
    <q-card-section>
      <div class="text-h6">{{ $t('user.address', 3) }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="text-caption row justify-between">
        <span>{{ $t('user.firstName', 2) }}:</span>
        <span class="text-primary">{{ address.first_name }}</span>
      </div>
      <div class="text-caption row justify-between">
        <span>{{ $t('user.lastName', 2) }}:</span>
        <span class="text-primary">{{ address.last_name }}</span>
      </div>
      <div class="text-caption row justify-between">
        <span>{{ $t('user.phoneNumber', 2) }}:</span>
        <span class="text-primary">+993 {{ address.phone_number }}</span>
      </div>
      <div class="text-caption row justify-between">
        <span>{{ $t('user.address', 2) }}:</span>
        <span class="text-primary">+993 {{ address.address }}</span>
      </div>
      <div class="text-caption row justify-between" v-if="note">
        <span>Note:</span>
        <span class="text-primary">{{ note }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>
