<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import { QBtn } from 'quasar';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newVal: boolean): void;
}>();
const isMini = ref<boolean>(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (newVal) => emits('update:modelValue', newVal),
});

interface NavProps {
  icon: string;
  to: Partial<RouteLocationNormalized>;
  label: string;
}

const navProps = computed((): NavProps[] => {
  return [
    {
      icon: 'local_shipping',
      label: i18n.t('label.orders'),
      to: { name: 'AdminOrders' },
    },
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
    // TODO: Add Users to Admin page
    // {
    //   icon: 'person',
    //   label: i18n.t('label.users'),
    //   to: { name: 'AdminUsers' },
    // },
  ];
});

const baseBtn: Partial<QBtn> = {
  flat: true,
  color: 'grey',
  outline: true,
};

const collapseBtn: Partial<QBtn> = {
  ...baseBtn,
  label: 'Collapse',
  icon: 'keyboard_double_arrow_left',
};

const collapseBtnMini: Partial<QBtn> = {
  ...baseBtn,
  icon: 'keyboard_double_arrow_right',
};
</script>

<template>
  <q-drawer
    show-if-above
    v-model="isOpen"
    side="left"
    :mini="isMini"
    elevated
    class="column justify-between"
  >
    <q-list>
      <q-item
        class="q-pl-none"
        v-if="$q.screen.gt.sm"
        :to="{ name: 'MainPage' }"
      >
        <q-item-section avatar>
          <q-img src="~assets/logo.png" :ratio="1" width="4em" height="4em" />
        </q-item-section>

        <q-item-section>
          <q-item-label header> Çagalar Dünýäsi </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-for="(nav, index) in navProps"
        :key="index"
        :to="nav.to"
      >
        <q-item-section v-if="nav.icon" avatar>
          <q-icon :name="nav.icon" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ nav.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      v-if="$q.screen.gt.sm"
      @click="isMini = !isMini"
      v-bind="isMini ? collapseBtnMini : collapseBtn"
    />
    <q-btn
      v-else
      @click="isOpen = !isOpen"
      v-bind="baseBtn"
      label="Close Sidebar"
      icon="close"
    />
  </q-drawer>
</template>
