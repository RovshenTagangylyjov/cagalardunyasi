<script setup lang="ts">
import OrderSelectStatus from 'components/OrderSelectStatus.vue';
import ButtonBase from 'components/ButtonBase.vue';
import { ref, computed, nextTick, watch } from 'vue';
import { QTable, QTableProps, QTableColumn, QVirtualScroll } from 'quasar';
import { useRoute, useRouter, RouteRecordName } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useOrder } from 'src/stores';
import { generateQueryParams } from 'src/helpers/queryParams';
import { Order, ProductQuery } from 'src/types';
import { DollarToManat } from 'src/helpers/product';

const orderStore = useOrder();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const pageSize = 100;
const loading = ref(false);
const table = ref<QTable>();
const search = ref<string>(
  route.query.search ? (route.query.search as string) : ''
);

orderStore.$reset();

const sortDetail = computed(() => {
  let sortBy = route.query.ordering
    ? (route.query.ordering as string)
    : 'order';

  let descending = true;
  if (sortBy[0] === '-') {
    descending = false;
    sortBy = sortBy.slice(1);
  }

  return { sortBy, descending };
});

const pagination = ref({
  rowsPerPage: 0,
  rowsNumber: orderStore.count,
  ...sortDetail.value,
});

const columns: QTableColumn<Order>[] = [
  {
    name: 'id',
    label: 'id',
    align: 'left',
    field: 'id',
    sortable: true,
  },
  {
    name: 'address__phone_number',
    label: i18n.t('user.phoneNumber', 2),
    align: 'center',
    field: (row) => row.address.phone_number,
    sortable: true,
  },
  {
    name: 'address__first_name',
    label: i18n.t('user.firstName', 2),
    align: 'center',
    field: (row) => row.address.first_name,
    sortable: true,
  },
  {
    name: 'address__last_name',
    label: i18n.t('user.lastName', 2),
    align: 'center',
    field: (row) => row.address.last_name,
    sortable: true,
  },
  {
    name: 'address__address',
    label: i18n.t('user.address', 2),
    align: 'center',
    field: (row) => row.address.address,
    sortable: true,
  },
  {
    name: 'total_price',
    label: `${i18n.t('label.totalPrice')} ($)`,
    align: 'center',
    field: 'total_price',
    sortable: true,
  },
  {
    name: 'total_price_tmt',
    label: `${i18n.t('label.totalPrice')} (TMT)`,
    align: 'center',
    field: (row) => DollarToManat(row.total_price),
    sortable: true,
  },
  {
    name: 'order',
    label: i18n.t('label.status'),
    align: 'center',
    field: 'status',
    sortable: true,
    required: true,
  },
  {
    name: 'date_updated',
    label: i18n.t('product.dateUpdated'),
    align: 'center',
    field: 'date_updated',
    sortable: true,
    required: true,
  },
  {
    name: 'date_created',
    label: i18n.t('product.dateCreated'),
    align: 'center',
    field: 'date_created',
    sortable: true,
    required: true,
  },
];

const refresh = async () => {
  orderStore.$reset();

  await nextTick(() => {
    table.value?.resetVirtualScroll();
    table.value?.resetVirtualScroll();
  });
};

const unwatch = watch(
  () => route.query,
  async () => await refresh()
);

const onScroll: QVirtualScroll['onVirtualScroll'] = ({ index, to, ref }) => {
  if (loading.value || index < to || orderStore.isFetchedAll) return;

  loading.value = true;

  const urlSearchParams = generateQueryParams(pageSize, to + 1, route.query);

  void orderStore.fetchList(urlSearchParams).then(async () => {
    pagination.value.rowsNumber = orderStore.count;

    await nextTick(() => {
      ref.refresh();
      loading.value = false;
    });
  });
};

const onRequest: QTableProps['onRequest'] = (props) => {
  let { sortBy, descending } = props.pagination;
  const search = props.filter;

  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  let query: ProductQuery = { ...route.query };

  if (search) query.search = search;
  else delete query.search;

  if (sortBy) {
    sortBy = descending ? sortBy : `-${sortBy}`;
    query.ordering = sortBy;
  } else delete query.sortBy;

  if (query.ordering === 'order') delete query.ordering;

  void router.push({
    name: route.name as RouteRecordName,
    query: query,
  });
};

const goToOrder = async (id: number) => {
  unwatch();
  await router.push({ name: 'OrderDetail', params: { id } });
};
</script>

<template>
  <q-page class="q-pa-xl window-height">
    <q-table
      ref="table"
      class="admin-table"
      title="Orders"
      :rows="orderStore.orders"
      :columns="columns"
      :loading="loading"
      virtual-scroll
      :virtual-scroll-slice-size="40"
      :rows-per-page-options="[0]"
      v-model:filter="search"
      v-model:pagination="pagination"
      binary-state-sort
      @request="onRequest"
      @virtual-scroll="onScroll"
    >
      <template v-slot:top="props">
        <ButtonBase
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
        <div class="q-table__title q-ml-md">{{ $t('label.orders') }}</div>
        <q-space />
        <ButtonBase icon="refresh" @click="refresh" :loading="loading" />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="search"
          clearable
          clear-icon="close"
          :label="$t('label.search')"
          class="q-ml-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" @click="goToOrder(props.row.id)">
          <q-td key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td key="address__phone_number" :props="props">
            +993 {{ props.row.address.phone_number }}
          </q-td>
          <q-td key="address__first_name" :props="props">
            {{ props.row.address.first_name }}
          </q-td>
          <q-td key="address__last_name" :props="props">
            {{ props.row.address.last_name }}
          </q-td>
          <q-td key="address__address" :props="props">
            {{ props.row.address.address }}
          </q-td>
          <q-td key="total_price" @click.stop :props="props"
            >{{ props.row.total_price }} $
          </q-td>
          <q-td key="total_price_tmt" :props="props"
            >{{ DollarToManat(props.row.total_price) }} TMT</q-td
          >
          <q-td key="order" @click.stop :props="props">
            <OrderSelectStatus
              v-model="props.row.status"
              @update:model-value="
                (newValue: string) =>
                  orderStore.partialUpdate({
                    id: props.row.id,
                    status: newValue,
                  })
              "
            />
          </q-td>
          <q-td key="date_updated" :props="props">
            {{ props.row.date_updated }}
          </q-td>
          <q-td key="date_created" :props="props">
            {{ props.row.date_created }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>
