<script setup lang="ts">
import InputPassword from 'components/InputPassword.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { QInput } from 'quasar';
import { UserRegister, InputProps } from 'src/types';
import { useSession } from 'src/stores';
import { rules } from 'src/helpers/validation';
import { useI18n } from 'vue-i18n';

const session = useSession();
const router = useRouter();
const i18n = useI18n();
const form = ref<UserRegister>({
  first_name: '',
  last_name: '',
  username: null,
  password: '',
  password2: '',
});

const register = async () => {
  await session.register(form.value).then(() =>
    session
      .login({
        username: form.value.username,
        password: form.value.password,
      })
      .then(() => router.push({ name: 'MainPage' }))
  );
};

const myRules = {
  ...rules,
  passwordSame: (password2: string) =>
    form.value.password === password2 || 'Password fields are not the same.',
};

const inputProps = computed((): InputProps<UserRegister>[] => {
  return [
    {
      model: 'first_name',
      label: i18n.t('user.firstName'),
      outlined: true,
      lazyRules: true,
      rules: [myRules.required],
    },
    {
      model: 'last_name',
      label: i18n.t('user.lastName'),
      outlined: true,
      lazyRules: true,
      rules: [myRules.required],
    },
    {
      model: 'username',
      type: 'number',
      label: i18n.t('user.phoneNumber'),
      prefix: '+993',
      outlined: true,
      lazyRules: true,
      rules: [myRules.required, myRules.phoneNumber],
    },
  ];
});
</script>

<template>
  <q-page style="padding-top: 0">
    <q-card
      style="max-width: 500px"
      :flat="$q.screen.lt.sm"
      class="q-mx-auto q-my-lg"
    >
      <q-form @submit="register">
        <q-card-section class="row justify-center q-py-none">
          <q-img src="~assets/logo.png" width="7rem" :ratio="1" />
        </q-card-section>
        <q-card-section class="column q-py-none">
          <q-input
            v-for="(input, index) in inputProps"
            :key="index"
            v-bind="input"
            class="col"
            v-model="form[input.model]"
          />
          <InputPassword
            v-model="form.password"
            :rules="[myRules.passwordLength]"
          />
          <InputPassword
            v-model="form.password2"
            :label="$t('user.passwordConfirm')"
            :rules="[myRules.passwordLength]"
          />
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-btn
            icon="login"
            :label="$t('label.login')"
            flat
            color="primary"
            :to="{ name: 'UserLogin' }"
          />
          <q-btn
            :label="$t('label.register')"
            type="submit"
            icon="how_to_reg"
            flat
            color="primary"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
