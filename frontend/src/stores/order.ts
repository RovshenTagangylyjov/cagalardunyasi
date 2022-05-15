import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import { notifySuccess, notifyError } from 'src/helpers/notify';
import type { Order, OrderForm, ListResponseData } from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { useCart } from '.';
import { Loading } from 'quasar';

export const useOrder = defineStore('order', {
  state: () => {
    return {
      count: -1,
      orders: [] as Order[],
      order: {} as Order,
    };
  },

  getters: {
    getOrder(state) {
      return (id: number): Order => {
        return state.orders.filter((order) => order.id === id)[0];
      };
    },

    isFetchedAll(state) {
      return state.orders.length === state.count;
    },
  },

  actions: {
    async create(order: OrderForm) {
      const cart = useCart();
      return new Promise((resolve, reject) => {
        api
          .post('orders/', order)
          .then(async (response: AxiosResponse<Order>) => {
            this.orders.push(response.data);

            notifySuccess(i18n.global.t('notify.orderCreated'));
            await cart.reset();
            resolve(response.data);
          })
          .catch((error: AxiosError) => reject(error));
      });
    },

    fetchList(urlSearchParams?: URLSearchParams) {
      const query_params = urlSearchParams?.toString()
        ? `?${urlSearchParams.toString()}`
        : '';

      return new Promise<ListResponseData<Order>>((resolve, reject) => {
        api
          .get(`orders/${query_params}`)
          .then((response: AxiosResponse<ListResponseData<Order>>) => {
            const data = response.data;
            this.$state.count = data.count;
            this.$state.orders.push(...data.results);

            resolve(data);
          })
          .catch((err: AxiosError) => {
            notifyError(err.message);
            reject(err);
          });
      });
    },

    partialUpdate(order: Partial<Order>) {
      return new Promise<Order>((resolve, reject) => {
        Loading.show();
        api
          .patch(`orders/${order.id as number}/`, order)
          .then((response: AxiosResponse<Order>) => {
            notifySuccess(i18n.global.t('notify.orderUpdated'));
            resolve(response.data);
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
