<script lang="ts">
import { useCategory, useCart, useSession, useManagement } from 'src/stores';
import { Loading, LocalStorage } from 'quasar';
import { useI18n } from 'vue-i18n';

export default {
  async preFetch() {
    Loading.show();
    await useSession().initialize();
    await useManagement().initialize();
    await useCart().initialize();
    await useCategory().fetch();
    Loading.hide();
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' });
    locale.value = LocalStorage.getItem('lang') || 'tk';
  },
};
</script>
<template>
  <router-view />
</template>
