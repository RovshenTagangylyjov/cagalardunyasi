<script setup lang="ts">
import ButtonOpenFilter from 'components/ButtonOpenFilter.vue';
import ButtonBase from 'components/ButtonBase.vue';
import { ref, computed, nextTick, watch } from 'vue';
import { useRoute, useRouter, RouteRecordName } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { QTable, QTableProps, QTableColumn, QVirtualScroll } from 'quasar';
import { useProduct, useManagement } from 'src/stores';
import { generateQueryParams } from 'src/helpers/queryParams';
import { Product, ProductQuery, Category } from 'src/types';
import { DollarToManat } from 'src/helpers/product';

const props = defineProps<{ isFilterDrawerOpen: boolean }>();
const emits = defineEmits<{
  (e: 'update:isFilterDrawerOpen', newValue: boolean): void;
}>();
const isFilterOpen = computed({
  get: () => props.isFilterDrawerOpen,
  set: (newValue: boolean) => emits('update:isFilterDrawerOpen', newValue),
});
const productStore = useProduct();
const management = useManagement();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const pageSize = 100;
const loading = ref(false);
const table = ref<QTable>();
const search = ref<string>(
  route.query.search ? (route.query.search as string) : ''
);

productStore.$reset();

const sortDetail = computed(() => {
  let sortBy = route.query.ordering
    ? (route.query.ordering as string)
    : '-date_created';

  let descending = true;
  if (sortBy[0] === '-') {
    descending = false;
    sortBy = sortBy.slice(1);
  }

  return { sortBy, descending };
});

const pagination = ref({
  rowsPerPage: 0,
  rowsNumber: productStore.count,
  ...sortDetail.value,
});

const columns: QTableColumn<Product>[] = [
  {
    name: 'id',
    label: 'id',
    align: 'center',
    field: 'id',
    sortable: true,
  },
  {
    name: `name_${i18n.locale.value}`,
    label: i18n.t('product.name'),
    align: 'left',
    field: `name_${i18n.locale.value}` as keyof Product,
    sortable: true,
  },
  {
    name: 'categories',
    label: i18n.t('product.categories'),
    align: 'left',
    field: (row) => {
      let categoryNames: string[] = [];
      productStore
        .getCategories(row.id)
        .forEach((category) =>
          categoryNames.push(
            category[`name_${i18n.locale.value}` as keyof Category] as string
          )
        );
      return categoryNames.join(', ');
    },
  },
  {
    name: 'price',
    label: `${i18n.t('product.price')} ($)`,
    align: 'center',
    field: 'price',
    sortable: true,
  },
  {
    name: 'price',
    label: `${i18n.t('product.price')} (TMT)`,
    align: 'center',
    field: (row) => DollarToManat(row.price),
    sortable: true,
  },
  {
    name: 'stock',
    label: i18n.t('product.stock'),
    align: 'center',
    field: 'stock',
    sortable: true,
  },

  {
    name: 'total_solt',
    label: i18n.t('product.totalSolt'),
    align: 'center',
    field: 'total_solt',
    sortable: true,
  },
  {
    name: 'date_updated',
    label: i18n.t('product.dateUpdated'),
    align: 'center',
    field: 'date_updated',
    sortable: true,
    required: false,
  },
  {
    name: 'date_created',
    label: i18n.t('product.dateCreated'),
    align: 'center',
    field: 'date_created',
    sortable: true,
    required: false,
  },
];

const refresh = async () => {
  productStore.products = [];

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
  if (loading.value || index < to || productStore.isFetchedAll) return;

  loading.value = true;

  const urlSearchParams = generateQueryParams(pageSize, to + 1, route.query);

  void productStore
    .fetchList(urlSearchParams)
    .then(() => {
      pagination.value.rowsNumber = productStore.count;
    })
    .finally(
      () =>
        void nextTick(() => {
          ref.refresh();
          loading.value = false;
        })
    );
};

const onRequest: QTableProps['onRequest'] = (props) => {
  let { sortBy, descending } = props.pagination;
  const search = props.filter as string;

  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  let query: ProductQuery = { ...route.query };

  if (search) query.search = search;
  else delete query.search;

  if (sortBy) {
    sortBy = descending ? sortBy : `-${sortBy}`;
    query.ordering = sortBy;
  } else delete query.sortBy;

  if (query.ordering === '-date_created') delete query.ordering;

  void router.push({
    name: route.name as RouteRecordName,
    query: query,
  });
};

const goToProduct = async (id: number, slug: string) => {
  unwatch();
  await router.push({ name: 'ProductDetail', params: { id, slug } });
};

const savePopup = async (
  id: number,
  name: keyof Product,
  value: string | number
) => {
  const product: Partial<Product> = { id, [name]: value };
  await productStore.partialUpdate(product);
};
</script>

<template>
  <q-page class="q-pa-xl window-height">
    <q-table
      ref="table"
      class="admin-table"
      title="Products"
      :rows="productStore.products"
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
        <div class="q-table__title q-ml-md">
          {{ management.dollar }}$
          <q-popup-edit
            v-model="management.dollar"
            buttons
            @save="(value) => management.updateDollar(value)"
            v-slot="scope"
          >
            <q-input
              type="number"
              v-model.number="scope.value"
              dense
              autofocus
            />
          </q-popup-edit>
        </div>
        <ButtonBase
          icon="add"
          :to="{ name: 'ProductCreate' }"
          class="q-ml-md"
          color="primary"
          :flat="false"
        />
        <q-space />
        <ButtonBase icon="refresh" @click="refresh" :loading="loading" />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="search"
          :label="$t('label.search')"
          class="q-ml-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <ButtonOpenFilter @click="isFilterOpen = !isFilterOpen" />
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="goToProduct(props.row.id, props.row.slug)"
          :class="{
            'bg-warning': props.row.stock < 10 && props.row.stock > 0,
            'bg-negative text-white': props.row.stock <= 0,
            'bg-grey': !props.row.is_active,
          }"
        >
          <q-td
            key="id"
            @click="goToProduct(props.row.id, props.row.slug)"
            :props="props"
          >
            {{ props.row.id }}
          </q-td>
          <q-td :key="`name_${$i18n.locale}`" :props="props">
            {{ props.row[`name_${$i18n.locale}`] }}
          </q-td>
          <q-td key="categories" :props="props">
            {{ productStore.getCategoryNames(props.row.id).join(', ') }}
          </q-td>
          <q-td key="price" @click.stop :props="props">
            {{ props.row.price }} $
            <q-popup-edit
              v-model.number="props.row.price"
              buttons
              v-slot="scope"
              @save="(value) => savePopup(props.row.id, 'price', value)"
            >
              <q-input
                type="number"
                step="0.01"
                min="0"
                v-model.number="scope.value"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props">
            {{ DollarToManat(props.row.price) }} TMT
          </q-td>
          <q-td key="stock" @click.stop :props="props">
            {{ props.row.stock }}
            <q-popup-edit
              v-model="props.row.stock"
              buttons
              v-slot="scope"
              @save="(value) => savePopup(props.row.id, 'stock', value)"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="total_solt" :props="props">
            {{ props.row.total_solt }}
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
