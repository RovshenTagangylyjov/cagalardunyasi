import { preFetch } from 'quasar/wrappers';
import { api } from 'boot/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useProduct } from 'src/stores';
import { Loading } from 'quasar';
import { Product } from 'src/types';

export default {
  preFetch: preFetch(async ({ store, currentRoute, redirect }) => {
    Loading.show();

    const productStore = useProduct(store);
    const id = Number(currentRoute.params.id);
    let error = false;
    let product = productStore.getProduct(id);

    if (!product) {
      await api
        .get(`products/${id}`)
        .then((response: AxiosResponse<Product>) => {
          product = response.data;
        })
        .catch((e: AxiosError<Product>) => {
          if (e.response?.status === 404) redirect({ name: 'NotFound' });
          error = true;
        });
    }

    if (!error) {
      productStore.product = product;
    }

    Loading.hide();
  }),
};
