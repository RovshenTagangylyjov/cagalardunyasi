<script setup lang="ts">
import { ref, computed } from 'vue';
import { QFabActionProps } from 'quasar';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const isOpen = ref<boolean>(false);
const actionProps = computed((): QFabActionProps[] => {
  return [
    {
      icon: 'inventory',
      label: i18n.t('label.inventory'),
      to: { name: 'AdminInventory' },
    },
    {
      icon: 'category',
      label: i18n.t('product.category', 2),
      to: { name: 'AdminCategories' },
    },
    {
      icon: 'local_shipping',
      label: i18n.t('label.orders'),
      to: { name: 'AdminOrders' },
    },
    // TODO: Add Users to Admin page
    // {
    //   icon: 'person',
    //   label: i18n.t('label.users'),
    // },
  ];
});
</script>

<template>
  <q-fab
    v-model="isOpen"
    vertical-actions-align="right"
    color="primary"
    icon="admin_panel_settings"
    label="Admin"
    label-position="left"
    direction="up"
    square
  >
    <q-fab-action
      v-for="(props, index) in actionProps"
      :key="index"
      v-bind="props"
      label-position="left"
      color="primary"
      square
    />
  </q-fab>
</template>
