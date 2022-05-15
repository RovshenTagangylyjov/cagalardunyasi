import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import type { Address } from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { api } from 'boot/axios';
import { notifyError } from 'src/helpers/notify';
import { useSession } from './session';

export const useAddresses = defineStore('addresses', {
  state: (): Required<Address>[] => {
    return [];
  },

  actions: {
    fetchAddress(addressId: string) {
      return new Promise<Address>((resolve, reject) => {
        api
          .get(`addresses/${addressId}/`)
          .then((response: AxiosResponse<Required<Address>>) => {
            this.$state.push(response.data);
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },

    createAddress(address: Address) {
      return new Promise<Address>((resolve, reject) => {
        const session = useSession();
        api
          .post('addresses/', address)
          .then((response: AxiosResponse<Required<Address>>) => {
            this.$state.push(response.data);

            if (!session.isAuthenticated)
              Cookies.set('addressid', response.data.id.toString(), {
                sameSite: 'None',
                secure: true,
              });

            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },

    updateAddress(address: Required<Address>) {
      return new Promise<Address>((resolve, reject) => {
        api
          .put(`addresses/${address.id.toString()}/`, address)
          .then((response: AxiosResponse<Required<Address>>) => {
            const index = this.$state.findIndex(
              (adrs) => (adrs.id = response.data.id)
            );
            this.$state[index] = response.data;
            resolve(response.data);
          })
          .catch((error: AxiosError) => reject(error));
      });
    },

    login(addresses: Required<Address>[]) {
      Cookies.remove('addressid');
      if (addresses.length > 0) this.$state = addresses;
    },
  },
});
