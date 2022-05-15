import { defineStore } from 'pinia';
import { Loading, LocalStorage } from 'quasar';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import type {
  UserLogin,
  TokenPair,
  AccessToken,
  UserRegister,
  User,
} from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { notifyError, notifySuccess } from 'src/helpers/notify';
import { useUser, useCart } from 'src/stores';

export const useSession = defineStore('session', {
  state: () => {
    return {
      isAuthenticated: false,
      accessToken: '',
      refreshToken: LocalStorage.getItem('refreshToken') as string | '',
      isInitialized: false,
    };
  },

  actions: {
    async initialize() {
      if (this.$state.refreshToken) await this.refreshToken();
      if (this.$state.isAuthenticated) {
        const user = useUser();
        await user.initialize();
      }
      this.isInitialized = true;
    },

    login(form: UserLogin) {
      const user = useUser();
      return new Promise<TokenPair>((resolve, reject) => {
        Loading.show();
        api
          .post('token/', form)
          .then(async (response: AxiosResponse<TokenPair>) => {
            LocalStorage.set('refreshToken', response.data.refresh);
            this.$state.refreshToken = response.data.refresh;
            this.updateToken(response.data);

            await user.initialize();

            notifySuccess(i18n.global.t('notify.loggedIn'));
            resolve(response.data);
          })
          .catch((error: AxiosError<{ detail: string }>) => {
            const error_messages = error.response?.data;
            if (error_messages?.detail) {
              notifyError(error_messages.detail);
              reject(error_messages.detail);
            }
            reject(error);
          })
          .finally(() => Loading.hide());
      });
    },

    register(form: UserRegister) {
      const cart = useCart();
      return new Promise<User>((resolve, reject) => {
        Loading.show();
        api
          .post('accounts/', { ...form, cart_id: cart.id })
          .then((response: AxiosResponse<User>) => {
            const user = useUser();
            user.$patch(response.data);

            notifySuccess(i18n.global.t('notify.registered'));

            resolve(response.data);
          })
          .catch((error: AxiosError<UserRegister>) => {
            const error_messages = error.response?.data;
            if (error_messages?.username) {
              notifyError(error_messages.username.toString());
            }
            reject(error);
          })
          .finally(() => Loading.hide());
      });
    },

    async logout() {
      Loading.show();

      LocalStorage.remove('refreshToken');

      const cart = useCart();
      const user = useUser();

      this.$reset();
      user.$reset();
      cart.$reset();

      await cart.initialize();

      Loading.hide();

      notifySuccess(i18n.global.t('notify.loggedOut'));
    },

    refreshToken() {
      this.$state.accessToken = '';

      const payload = {
        refresh: this.$state.refreshToken,
      };

      return new Promise<AccessToken>((resolve, reject) => {
        api
          .post('token/refresh/', payload)
          .then((response: AxiosResponse<AccessToken>) => {
            this.updateToken(response.data);
            resolve(response.data);
          })
          .catch(async (error: AxiosError) => {
            notifyError(error.message);
            if (error.response?.status === 401) await this.logout();
            reject(error);
          });
      });
    },

    updateToken(token: AccessToken) {
      this.$state.isAuthenticated = true;
      this.$state.accessToken = token.access;
    },
  },
});
