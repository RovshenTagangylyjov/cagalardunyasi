import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import { Loading } from 'quasar';
import { AxiosResponse, AxiosError } from 'axios';
import { notifySuccess, notifyError } from 'src/helpers/notify';
import { Category } from 'src/types';

export const useCategory = defineStore('category', {
  state: () => {
    return {
      categories: [] as Category[],
    };
  },
  actions: {
    fetch() {
      return new Promise((resolve, reject) => {
        api
          .get('categories/')
          .then((response: AxiosResponse<Category[]>) => {
            this.categories = response.data;
            resolve(response.data);
          })
          .catch((err: AxiosError) => reject(err));
      });
    },
    create(category: Category) {
      Loading.show();
      return new Promise<Category>((resolve, reject) => {
        api
          .post('categories/', category)
          .then((response: AxiosResponse<Category>) => {
            this.categories.push(response.data);

            notifySuccess(i18n.global.t('notify.categoryCreated'));
            resolve(response.data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          })
          .finally(() => Loading.hide());
      });
    },
    partialUpdate(category: Partial<Category>) {
      return new Promise<Category>((resolve, reject) => {
        Loading.show();
        api
          .patch(`categories/${category.id as number}/`, category)
          .then((response: AxiosResponse<Category>) => {
            notifySuccess(i18n.global.t('notify.categoryUpdated'));
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          })
          .finally(() => Loading.hide());
      });
    },

    delete(id: number) {
      return new Promise<void>((resolve, reject) => {
        Loading.show();
        api
          .delete(`categories/${id}/`)
          .then(() => {
            this.categories = this.categories.filter(
              (category) => category.id !== id
            );

            notifySuccess(i18n.global.t('notify.categoryDeleted'));
            resolve();
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          })
          .finally(() => Loading.hide());
      });
    },
  },
});
