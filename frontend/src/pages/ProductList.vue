<script setup lang="ts">
import ProductCard from 'components/ProductCard.vue';
import ButtonOpenFilter from 'components/ButtonOpenFilter.vue';
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter, RouteRecordName } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { QInfiniteScroll, QSelectOption, QInfiniteScrollProps } from 'quasar';
import { ListResponseData, ProductQuery, Product } from 'src/types';
import { useProduct } from 'src/stores';
import { generateQueryParams } from 'src/helpers/queryParams';

const props = defineProps<{ isLeftDrawerOpen: boolean }>();
const emits = defineEmits<{
  (e: 'update:isLeftDrawerOpen', newValue: boolean): void;
}>();
const isFilterOpen = computed({
  get: () => props.isLeftDrawerOpen,
  set: (newValue: boolean) => emits('update:isLeftDrawerOpen', newValue),
});
const pageSize = 10;
const productStore = useProduct();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const infiniteScroll = ref<QInfiniteScroll>();
const loading = ref<boolean>(false);
const ordering = ref<string>(
  route.query.ordering ? (route.query.ordering as string) : '-date_created'
);
const orderingOptions = computed((): QSelectOption<string>[] => {
  return [
    { label: i18n.t('sort.mostPopular'), value: '-total_solt' },
    { label: i18n.t('sort.recentlyAdded'), value: '-date_created' },
    { label: i18n.t('sort.priceLowToHigh'), value: 'price' },
    { label: i18n.t('sort.priceHighToLow'), value: '-price' },
    { label: i18n.t('sort.rating'), value: '-rate' },
  ];
});

watch(ordering, async () => {
  let query: ProductQuery = {
    ...route.query,
    ordering: ordering.value,
  };

  if (query.ordering === '-date_created') delete query.ordering;

  await router.push({
    name: route.name as RouteRecordName,
    query: query,
  });
});

const unwatch = watch(
  () => route.query,
  () => {
    productStore.products = [];
    infiniteScroll.value?.stop();
    infiniteScroll.value?.reset();
    infiniteScroll.value?.resume();
    infiniteScroll.value?.trigger();
  },
  { deep: true }
);

const infiniteScrollProps: QInfiniteScrollProps = {
  offset: 50,
  onLoad: (index, done) => {
    loading.value = true;
    const urlSearchParams = generateQueryParams(
      pageSize,
      (index - 1) * pageSize,
      route.query
    );

    void productStore
      .fetchList(urlSearchParams)
      .then((data: ListResponseData<Product>) => {
        if (!data.next) infiniteScroll.value?.stop();
        loading.value = false;

        done();
      });
  },
};
</script>

<template>
  <q-page>
    <div class="row items-center q-px-sm-md text-grey-9">
      <div class="col text-h6" v-if="productStore.count >= 0">
        <span v-if="$route.query.favorites">{{ $t('text.favorites') }}</span>
        {{ productStore.count }}
      </div>

      <q-space />

      <q-select
        :loading="loading"
        v-model="ordering"
        :label="$t('sort.sorting')"
        :options="orderingOptions"
        emit-value
        map-options
      />
      <ButtonOpenFilter @click="isFilterOpen = !isFilterOpen" />
    </div>

    <q-separator spaced=".7rem" />

    <q-infinite-scroll
      ref="infiniteScroll"
      class="row q-gutter-lg justify-around"
      v-bind="infiniteScrollProps"
    >
      <template v-if="productStore.products.length > 0">
        <ProductCard
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
          @route="unwatch"
          class="col-5 col-sm-3 col-lg-2"
        />
      </template>

      <template v-else-if="!loading">
        <div class="column items-center">
          <q-icon name="smart_toy" size="20em" color="grey" />
        </div>
      </template>
      <!-- class="col-12 row justify-center q-ma-lg" -->
      <template v-slot:loading>
        <div class="row justify-center q-ma-lg" style="width: 100vw">
          <q-spinner color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>
