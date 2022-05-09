<script setup lang="ts">
import DrawerAdminNav from 'components/DrawerAdminNav.vue';
import DrawerFilterProduct from 'components/DrawerFilterProduct.vue';
import ButtonBase from 'components/ButtonBase.vue';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const isAdminNavOpen = ref($q.screen.gt.md);
const isFilterProductOpen = ref(false);
</script>

<template>
  <q-layout view="hHh lpR lFf">
    <q-header style="line-height: 3" v-if="$q.screen.lt.md">
      <q-toolbar>
        <ButtonBase
          icon="menu"
          @click="isAdminNavOpen = !isAdminNavOpen"
          aria-label="Menu"
        />
        <q-toolbar-title shrink class="q-pl-none">
          <q-img src="~assets/logo.png" :ratio="1" width="3em" />
          Çagalar Dünýäsi
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <DrawerAdminNav v-model="isAdminNavOpen" />
    <DrawerFilterProduct
      v-if="$route.name === 'AdminInventory'"
      v-model="isFilterProductOpen"
    />

    <q-page-container>
      <router-view v-model:isFilterDrawerOpen="isFilterProductOpen" />
    </q-page-container>
  </q-layout>
</template>
