<script lang="ts">
import { preFetch } from 'quasar/wrappers';
import { api } from 'boot/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useOrder } from 'src/stores';
import { Loading } from 'quasar';
import { Order } from 'src/types';

export default {
  preFetch: preFetch(async ({ store, currentRoute, redirect }) => {
    Loading.show();

    const orderStore = useOrder(store);
    const id = Number(currentRoute.params.id);
    let error = false;
    let order = orderStore.getOrder(id);

    if (!order) {
      await api
        .get(`orders/${id}`)
        .then((response: AxiosResponse<Order>) => {
          order = response.data;
        })
        .catch((e: AxiosError<Order>) => {
          if (e.response?.status === 404) redirect({ name: 'NotFound' });
          error = true;
        });
    }

    if (!error) {
      orderStore.order = order;
    }

    Loading.hide();
  }),
};
</script>

<script setup lang="ts">
import OrderCart from 'components/OrderCart.vue';
import OrderBillCard from 'components/OrderBillCard.vue';
import OrderAddressCard from 'components/OrderAddressCard.vue';
import OrderSelectStatus from 'components/OrderSelectStatus.vue';
import { useUser } from 'src/stores';

const orderStore = useOrder();
const user = useUser();
</script>

<template>
  <q-page
    class="row justify-around"
    :class="[
      {
        'column reverse': $q.screen.lt.md,
      },
      $q.screen.gt.sm ? 'q-gutter-x-lg' : 'q-gutter-y-lg',
    ]"
  >
    <q-card class="col-12 col-md-8 q-ml-none">
      <q-card-section>
        <div class="text-h6">{{ $t('text.cart') }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>
          <OrderCart :cart="orderStore.order.cart" />
        </div>
      </q-card-section>
    </q-card>
    <div class="col q-gutter-y-lg" :class="{ 'q-mt-none': !$q.screen.gt.sm }">
      <q-card :class="{ 'q-mt-none': !$q.screen.gt.sm }">
        <q-card-section
          class="text-caption row justify-between items-center text-grey-9"
        >
          <span class="text-h6">{{ $t('label.status') }}</span>
          <OrderSelectStatus
            :readonly="!user.$state.is_staff"
            v-model="orderStore.order.status"
            @update:model-value="
              (value) =>
                orderStore.partialUpdate({
                  id: orderStore.order.id,
                  status: value,
                })
            "
          />
        </q-card-section>
      </q-card>
      <OrderBillCard :price="orderStore.order.total_price" />
      <OrderAddressCard
        :address="orderStore.order.address"
        :note="orderStore.order.note"
      />
    </div>
  </q-page>
</template>
