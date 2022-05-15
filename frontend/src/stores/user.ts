import { defineStore } from 'pinia';
import type { User } from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { api } from 'boot/axios';
import { useCart, useAddresses } from '.';

export const useUser = defineStore('user', {
  state: () => {
    return {} as User;
  },
  actions: {
    async initialize() {
      const cart = useCart();
      const addresses = useAddresses();

      await this.fetchUser();
      await cart.login().catch(async (error: AxiosError) => {
        if (error.response?.status === 404) await cart.createCart();
      });
      addresses.login(this.$state.addresses);
    },
    fetchUser() {
      return new Promise<User>((resolve, reject) => {
        api
          .get('accounts/me/')
          .then((response: AxiosResponse<User>) => {
            this.$state = response.data;
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      });
    },
  },
});
