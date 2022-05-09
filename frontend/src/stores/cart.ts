import { defineStore } from 'pinia';
import { notifySuccess, notifyError } from 'src/helpers/notify';
import { Cart, CartItem, Product } from 'src/types';
import { AxiosResponse, AxiosError } from 'axios';
import { Cookies } from 'quasar';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';
import { useSession } from './session';

export const useCart = defineStore('cart', {
  state: (): Cart => {
    return {
      id: 0,
      items: [],
    };
  },
  getters: {
    getCount: (state) => {
      return state.items.length;
    },
    totalPrice: (state) => {
      return Number(
        state.items
          .reduce(
            (previousPrice, currentItem) =>
              previousPrice + currentItem.product.price,
            0
          )
          .toFixed(2)
      );
    },
    getCartItem: (state) => {
      return (product: Product) => {
        return state.items.find(
          (cartItem) => cartItem.product.id === product.id
        );
      };
    },
  },

  actions: {
    async reset() {
      this.$reset();
      Cookies.remove('cartid');
      await this.createCart();
    },

    fetchCart(cartId: string) {
      return new Promise<Cart>((resolve, reject) => {
        api
          .get(`carts/${cartId}/`)
          .then((response: AxiosResponse<Cart>) => {
            this.$state = response.data;
            resolve(response.data);
          })
          .catch((error: AxiosError<Cart>) => {
            Cookies.remove('cartid');
            reject(error);
          });
      });
    },

    createCart() {
      return new Promise<Cart>((resolve, reject) => {
        const session = useSession();
        api
          .post('carts/', { item_ids: {} })
          .then((response: AxiosResponse<Cart>) => {
            this.$state = response.data;

            if (!session.isAuthenticated) {
              Cookies.set('cartid', response.data.id.toString(), {
                sameSite: 'None',
                secure: true,
              });
            }

            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },

    async initialize() {
      const cartId = Cookies.get('cartid');
      if (cartId)
        return await this.fetchCart(cartId).catch(async (error: AxiosError) => {
          if (error.response?.status === 404) await this.createCart();
        });
    },

    async add(product: Product, quantity = 1) {
      if (this.$state.id === 0) await this.initialize();

      const cartItem = this.getCartItem(product);
      if (cartItem) {
        return this.updateQuantity(cartItem, cartItem.quantity + quantity);
      }

      return new Promise<CartItem>((resolve, reject) => {
        api
          .post('cart-items/', {
            cart: this.$state.id,
            product_id: product.id,
            quantity,
          })
          .then((response: AxiosResponse<CartItem>) => {
            this.$state.items.push(response.data);
            notifySuccess(i18n.global.t('notify.addedToCart'));
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },

    updateQuantity(cartItem: CartItem, quantity: number) {
      return new Promise<CartItem>((resolve, reject) => {
        api
          .patch(`cart-items/${cartItem.id}/`, { quantity })
          .then((response: AxiosResponse<CartItem>) => {
            cartItem.quantity = response.data.quantity;
            notifySuccess(i18n.global.t('notify.quantityUpdated'));

            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            notifyError(error.message);
            reject(error);
          });
      });
    },

    remove(cartItem: CartItem) {
      return new Promise<void>((resolve, reject) => {
        api
          .delete(`cart-items/${cartItem.id}/`)
          .then(() => {
            this.$state.items = this.$state.items.filter(
              (item) => cartItem.id !== item.id
            );

            notifySuccess(i18n.global.t('notify.removeFromCart'));

            resolve();
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      });
    },

    async login() {
      return new Promise<Cart>((resolve, reject) => {
        api
          .get('carts/my/')
          .then((response: AxiosResponse<Cart>) => {
            this.$state = response.data;
            Cookies.remove('cartid');
            resolve(response.data);
          })
          .catch((error: AxiosError) => reject(error));
      });
    },
  },
});
