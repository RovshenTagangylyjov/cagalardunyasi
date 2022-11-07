import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useSession } from 'src/stores';
import { sleep } from 'src/helpers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

interface AxiosRetryConfig extends AxiosRequestConfig {
  _retry: boolean;
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

export const config: AxiosRequestConfig = {
  baseURL: '/api/',
  withCredentials: true,
};

const api = axios.create(config);

export default boot(({ app, store, router }) => {
  const session = useSession(store);

  api.interceptors.request.use((config) => {
    if (session.accessToken)
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.accessToken}`,
      };
    return config;
  });

  api.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as AxiosRetryConfig;
    if (error.config && error.response) {
      // if (error.response.status === 401) {
      //   if (!config._retry) {
      //     console.log(config._retry);
      //     config._retry = true;
      //     await session.refreshToken();
      //     return api(config);
      //   }
      //   await router.push({ name: 'MainPage' });
      // }
    }

    if (error && !error.response) {
      await sleep(1000);
      return api(config);
    }

    return Promise.reject(error);
  });
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
