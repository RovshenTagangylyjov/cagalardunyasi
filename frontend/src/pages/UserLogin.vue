<script setup lang="ts">
import InputPassword from 'components/InputPassword.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QInput } from 'quasar';
import type { UserLogin } from 'src/types';
import { rules } from 'src/helpers/validation';
import { useSession } from 'src/stores';

const router = useRouter();
const session = useSession();
const loginForm = ref<UserLogin>({
  username: null,
  password: '',
});

const login = async () => {
  await session
    .login(loginForm.value)
    .then(() => router.push({ name: 'MainPage' }));
};
</script>

<template>
  <q-page style="padding-top: 0">
    <q-card
      style="max-width: 500px"
      :flat="$q.screen.lt.sm"
      class="q-mx-auto q-my-lg"
    >
      <q-form @submit.prevent="login">
        <q-card-section class="row justify-center q-py-none">
          <q-img src="~assets/logo.png" width="7rem" :ratio="1" />
        </q-card-section>
        <q-card-section class="column q-py-none">
          <q-input
            class="col"
            v-model="loginForm.username"
            :rules="[rules.required]"
            type="number"
            prefix="+993"
            :label="$t('user.phoneNumber')"
            outlined
          />
          <InputPassword v-model="loginForm.password" />
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-btn
            icon="how_to_reg"
            :label="$t('label.register')"
            flat
            color="primary"
            :to="{ name: 'UserRegister' }"
          />
          <q-btn
            :label="$t('label.login')"
            icon="login"
            type="submit"
            flat
            color="primary"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
