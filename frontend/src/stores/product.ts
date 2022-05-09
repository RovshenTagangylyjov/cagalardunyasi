import { defineStore } from 'pinia';
import { Loading } from 'quasar';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import { notifySuccess, notifyError } from 'src/helpers/notify';
import { AxiosError, AxiosResponse } from 'axios';
import { useCategory } from '.';
import {
  BaseProduct,
  Product,
  Category,
  ListResponseData,
  Rating,
} from 'src/types';

export const useProduct = defineStore('product', {
  state: () => {
    return {
      count: -1,
      products: [] as Product[],
      product: {
        id: -1,
        name_tk: '',
        name_rus: '',
        description_tk: '',
        description_rus: '',
        images: [],
        from_age: null,
        to_age: null,
        female: false,
        male: false,
        price: null,
        stock: null,
        categories: [],
        is_active: true,
      } as Product | BaseProduct,
    };
  },
  getters: {
    getProduct(state) {
      return (id: number): Product => {
        return state.products.filter((product) => product.id === id)[0];
      };
    },

    isFetchedAll(state) {
      return state.products.length === state.count;
    },

    getCategories(state) {
      return (id: number): Category[] => {
        const categoryStore = useCategory();
        const product = state.products.find(
          (product) => product.id === id
        ) as Product;

        return categoryStore.categories.filter((category) =>
          product.categories.includes(category.id)
        );
      };
    },
    getCategoryNames() {
      return (id: number): string[] => {
        const categoryNames: string[] = [];
        this.getCategories(id).forEach((category) =>
          categoryNames.push(category.name_tk)
        );

        return categoryNames;
      };
    },
  },
  actions: {
    async fetch(id: number) {
      const response = await api.get(`products/${id}/`);
      return response.data as Product;
    },

    async getOrFetch(id: number) {
      this.product = this.getProduct(id) || (await this.fetch(id));
    },

    fetchList(urlSearchParams?: URLSearchParams) {
      const query_params = urlSearchParams?.toString()
        ? `?${urlSearchParams.toString()}`
        : '';

      return new Promise<ListResponseData<Product>>((resolve, reject) => {
        api
          .get(`products/${query_params}`)
          .then((response: AxiosResponse<ListResponseData<Product>>) => {
            const data = response.data;
            this.$state.count = data.count;
            this.$state.products.push(...data.results);

            resolve(data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          });
      });
    },

    create(product: BaseProduct) {
      return new Promise<Product>((resolve, reject) => {
        Loading.show();
        api
          .post('products/', product)
          .then((response: AxiosResponse<Product>) => {
            this.$state.product = response.data;

            notifySuccess(i18n.global.t('notify.productCreated'));
            resolve(response.data);
          })
          .catch((err: AxiosError<Product>) => {
            notifyError(err.message);
            reject(err);
          })
          .finally(() => {
            Loading.hide();
          });
      });
    },

    update(product: Product) {
      return new Promise<Product>((resolve, reject) => {
        Loading.show();
        api
          .put(`products/${product.id}/`, product)
          .then((response: AxiosResponse<Product>) => {
            this.$state.product = response.data;

            notifySuccess(i18n.global.t('notify.productUpdated'));
            resolve(response.data);
          })
          .catch((err: AxiosError<Product>) => {
            notifyError(err.message);
            reject(err);
          })
          .finally(() => Loading.hide());
      });
    },

    partialUpdate(product: Partial<Product>) {
      return new Promise<Product>((resolve, reject) => {
        Loading.show();
        api
          .patch(`products/${product.id as number}/`, product)
          .then((response: AxiosResponse<Product>) => {
            notifySuccess(i18n.global.t('notify.productUpdated'));

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
      return new Promise((resolve, reject) => {
        Loading.show();
        api
          .delete(`products/${id}/`)
          .then((response: AxiosResponse) => {
            notifySuccess(i18n.global.t('notify.productDeleted'));

            resolve(response);
          })
          .catch((err: AxiosError<Product>) => {
            notifyError(err.message);
            reject(err);
          })
          .finally(() => {
            Loading.hide();
          });
      });
    },

    rate(product: number, rate: number, rating?: number) {
      if (rating) return this.updateRating(rating, rate);
      else return this.createRating(product, rate);
    },

    updateRating(rating: number, rate: number) {
      return new Promise<Rating>((resolve, reject) => {
        api
          .patch(`ratings/${rating}/`, { rate })
          .then((response: AxiosResponse<Rating>) => {
            (this.$state.product as Product).users_rating = response.data;
            resolve(response.data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          });
      });
    },

    createRating(product: number, rate: number) {
      return new Promise<Rating>((resolve, reject) => {
        api
          .post('ratings/', { product, rate })
          .then((response: AxiosResponse<Rating>) => {
            (this.$state.product as Product).users_rating = response.data;
            resolve(response.data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          });
      });
    },

    toggleIsFavorite(productId: number) {
      return new Promise<{ is_favorite: boolean }>((resolve, reject) => {
        api
          .post(`products/${productId}/like/`)
          .then((response: AxiosResponse<{ is_favorite: boolean }>) => {
            const isFavorite = response.data.is_favorite;
            if ((this.$state.product as Product).id === productId)
              (this.$state.product as Product).is_favorite = isFavorite;

            const favedProductIndex = this.$state.products.findIndex(
              (product) => product.id === productId
            );

            if (favedProductIndex >= 0)
              this.$state.products[favedProductIndex].is_favorite = isFavorite;

            resolve(response.data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          });
      });
    },
  },
});
