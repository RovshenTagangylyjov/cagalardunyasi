import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import type { Management } from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { notifyError, notifySuccess } from 'src/helpers/notify';

export const useManagement = defineStore('management', {
  state: (): Management => {
    return {
      dollar: 0,
    };
  },
  actions: {
    initialize() {
      return new Promise<Management>((resolve, reject) => {
        api
          .get('management/1/')
          .then((response: AxiosResponse<Management>) => {
            this.$state = response.data;

            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      });
    },

    updateDollar(dollar: number) {
      return new Promise<Management>((resolve, reject) => {
        api
          .patch('management/1/', { dollar })
          .then((response: AxiosResponse<Management>) => {
            this.$state = response.data;

            notifySuccess(i18n.global.t('notify.dollarUpdated'));
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },
  },
});
