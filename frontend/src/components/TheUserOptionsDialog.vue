<script setup lang="ts">
import ButtonBase from 'components/ButtonBase.vue';
import { computed } from 'vue';
import { QBtnProps } from 'quasar';
import { useSession } from 'src/stores';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', newVal: boolean): void;
}>();
const session = useSession();

const show = computed({
  get: () => props.modelValue,
  set: (newVal: boolean) => emits('update:modelValue', newVal),
});

const btnProps: QBtnProps = {
  flat: true,
  stack: true,
  size: '1.5rem',
  color: 'grey',
  padding: '10px',
};
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <ButtonBase icon="close" v-close-popup />
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-img src="~assets/logo.png" :ratio="1" width="10em" height="8rem" />
      </q-card-section>

      <q-card-section class="q-pt-none row justify-around">
        <template v-if="!session.isAuthenticated">
          <q-btn
            icon="login"
            :label="$t('label.login')"
            v-bind="btnProps"
            :to="{ name: 'UserLogin' }"
          />
          <q-btn
            icon="how_to_reg"
            :label="$t('label.register')"
            v-bind="btnProps"
            :to="{ name: 'UserRegister' }"
          />
        </template>
        <template v-else>
          <q-btn
            icon="logout"
            :label="$t('label.logout')"
            v-bind="btnProps"
            @click="[session.logout(), (show = false)]"
            :to="{ name: 'MainPage' }"
          />
        </template>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.q-card {
  min-width: 50vw !important;
}
</style>
