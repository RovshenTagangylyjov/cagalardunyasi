<script setup lang="ts">
import DrawerFilterProduct from 'components/DrawerFilterProduct.vue';
import TheUserOptionsDialog from 'components/TheUserOptionsDialog.vue';
import TheAdminNavFab from 'components/TheAdminNavFab.vue';
import ButtonBase from 'components/ButtonBase.vue';
import SelectLanguage from 'components/SelectLanguage.vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QInputProps, QBtnProps } from 'quasar';
import { mdiInstagram } from '@quasar/extras/mdi-v6';
import { useCart, useUser, useSession } from 'src/stores';

const route = useRoute();
const router = useRouter();
const cart = useCart();
const user = useUser();
const session = useSession();
const isFilterOpen = ref(false);
const showTheUserOptionsDialog = ref(false);
const searchText = ref(
  route.query.search ? (route.query.search as string) : ''
);

const search = () => {
  const { search: _, ...query } = route.query;
  _;
  if (searchText.value) query.search = searchText.value;

  void router.push({
    name: 'ProductList',
    query,
  });
};

const searchProps: QInputProps = {
  modelValue: searchText.value,
  outlined: true,
  clearable: true,
  dense: true,
  dark: true,
  color: 'grey-1',
  labelColor: 'grey-1',
  clearIcon: 'clear',
  onClear: search,
};

const btnProps: QBtnProps = {
  size: '.9em',
  color: 'white',
};
</script>

<template>
  <q-layout view="hHh lPR fff">
    <q-header style="line-height: 3">
      <q-toolbar class="justify-between section q-mx-auto">
        <q-toolbar-title shrink>
          <q-img
            src="~assets/logo.png"
            :ratio="1"
            width="5em"
            height="3em"
            class="cursor-pointer"
            @click="$router.push({ name: 'MainPage' })"
          />
        </q-toolbar-title>
        <q-input
          v-if="!$q.screen.lt.sm"
          v-bind="searchProps"
          :label="$t('label.search')"
          v-model="searchText"
          style="width: 400px"
          @keyup.enter="search"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-1" />
          </template>
        </q-input>
        <div class="row flex-nowrap inline q-gutter-lg">
          <SelectLanguage />
          <ButtonBase
            icon="person"
            v-bind="btnProps"
            @click="showTheUserOptionsDialog = !showTheUserOptionsDialog"
          />
          <ButtonBase
            :to="
              session.isAuthenticated
                ? { name: 'ProductList', query: { favorites: true } }
                : { name: 'UserLogin' }
            "
            icon="favorite"
            v-bind="btnProps"
          />
          <ButtonBase
            :to="{ name: 'Order' }"
            icon="shopping_cart"
            v-bind="btnProps"
          >
            <q-badge color="red" floating rounded :label="cart.getCount" />
          </ButtonBase>
        </div>
      </q-toolbar>
      <q-toolbar class="section q-mx-auto q-pb-sm" v-if="$q.screen.lt.sm">
        <q-input v-bind="searchProps" @keyup.enter="search" class="full-width">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-1" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <DrawerFilterProduct
      v-model="isFilterOpen"
      v-if="$route.name === 'ProductList'"
    />
    <TheUserOptionsDialog v-model="showTheUserOptionsDialog" />
    <TheAdminNavFab
      v-if="user.$state.is_staff"
      class="fixed-bottom-right q-mb-xl q-mr-sm z-max"
    />

    <q-page-container>
      <router-view v-model:isLeftDrawerOpen="isFilterOpen" />
    </q-page-container>

    <q-footer>
      <q-toolbar class="justify-between section q-mx-auto">
        <q-toolbar-title shrink>
          <q-img src="~assets/logo.png" :ratio="1" width="3em" height="3em" />
        </q-toolbar-title>
        <div>
          <q-icon :name="mdiInstagram" left size="1.5rem" />
          <span class="text-caption">cagalardunyasi.gv</span>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
