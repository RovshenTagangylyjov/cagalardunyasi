import { RouteRecordRaw } from 'vue-router';
import { Pinia } from 'pinia';

export default function (store: Pinia) {
  if (process.env.CLIENT && process.env.DEV) {
    console.log(store);
  }
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {
          name: 'MainPage',
          path: '',
          component: () => import('pages/MainPage.vue'),
        },
      ],
    },

    {
      path: '/products/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {
          name: 'ProductList',
          path: '',
          component: () => import('pages/ProductList.vue'),
          props: (route) => ({
            filter: route.query,
          }),
        },
        {
          name: 'ProductCreate',
          path: 'create/',
          component: () => import('pages/ProductCreate.vue'),
          meta: {
            adminOnly: true,
          },
        },
        {
          name: 'ProductDetail',
          path: ':slug~:id/',
          component: () => import('pages/ProductDetail.vue'),
          props: (route) => {
            const slug = route.params.slug;
            const id = route.params.id as string;

            return { slug, id: Number.parseInt(id, 10) };
          },
        },
        {
          name: 'ProductEdit',
          path: ':slug~:id/edit/',
          component: () => import('pages/ProductEdit.vue'),
          props: (route) => {
            const slug = route.params.slug;
            const id = route.params.id as string;

            return { slug, id: Number.parseInt(id, 10) };
          },
          meta: {
            adminOnly: true,
          },
        },
      ],
    },

    {
      path: '/orders/',
      component: () => import('layouts/MainLayout.vue'),

      children: [
        {
          name: 'Order',
          path: 'create/',
          component: () => import('pages/OrderStepper.vue'),
        },
        {
          name: 'OrderDetail',
          path: 'detail-:id/',
          component: () => import('pages/OrderDetail.vue'),
        },
      ],
    },

    {
      path: '/account/',
      component: () => import('layouts/SimpleLayout.vue'),

      children: [
        {
          name: 'UserRegister',
          path: 'register/',
          component: () => import('pages/UserRegister.vue'),
        },

        {
          name: 'UserLogin',
          path: 'login/',
          component: () => import('pages/UserLogin.vue'),
        },
      ],
    },

    {
      path: '/admin/',
      component: () => import('layouts/AdminLayout.vue'),

      children: [
        {
          name: 'AdminInventory',
          path: 'inventory/',
          component: () => import('pages/AdminInventory.vue'),
          meta: {
            adminOnly: true,
          },
        },
        {
          name: 'AdminCategories',
          path: 'categories/',
          component: () => import('pages/AdminCategories.vue'),
          meta: {
            adminOnly: true,
          },
        },
        {
          name: 'AdminOrders',
          path: 'orders/',
          component: () => import('pages/AdminOrders.vue'),
          meta: {
            adminOnly: true,
          },
        },
      ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('src/pages/404Page.vue'),
      name: 'NotFound',
    },
  ];
  return routes;
}
