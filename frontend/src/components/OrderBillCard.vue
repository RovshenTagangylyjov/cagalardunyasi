<script setup lang="ts">
import { DollarToManat } from 'src/helpers/product';
defineProps<{ price: number }>();
</script>

<template>
  <q-card class="text-grey-9">
    <q-card-section>
      <div class="text-h6">{{ $t('text.bill') }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="text-caption row justify-between">
        <span>{{ $t('text.total') }}</span>
        <span class="text-primary"> {{ DollarToManat(price) }}TMT</span>
      </div>
    </q-card-section>
  </q-card>
</template>
