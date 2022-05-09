import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';

import { useCart } from './cart';
import { useProduct } from './product';
import { useUser } from './user';
import { useOrder } from './order';
import { useSession } from './session';
import { useAddresses } from './address';
import { useCategory } from './category';
import { useManagement } from './management';

export {
  useCart,
  useProduct,
  useCategory,
  useUser,
  useOrder,
  useSession,
  useAddresses,
  useManagement,
};

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
