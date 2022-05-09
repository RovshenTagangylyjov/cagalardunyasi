<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import {
  useRoute,
  useRouter,
  RouteRecordName,
  LocationQueryValue,
} from 'vue-router';
import { QBtn } from 'quasar';
import { useCategory } from 'src/stores';
import { ProductFilter, ProductQuery } from 'src/types';
import { DollarToManat, ManatToDollar } from 'src/helpers/product';

const props = defineProps<{ modelValue: boolean }>();
const route = useRoute();
const router = useRouter();
const categoryStore = useCategory();
const emits = defineEmits<{
  (e: 'update:modelValue', filterOpen: boolean): void;
}>();

const filterOpen = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emits('update:modelValue', newValue),
});

const defaultFilters: ProductFilter = {
  categories: [],
  female: 'true',
  male: 'true',
};
const filter = ref<ProductFilter>({ ...defaultFilters });

watch(
  () => route.query,
  (query) => {
    filter.value = { ...defaultFilters };
    if (query.female && !query.male) {
      filter.value.male = 'false';
    }
    if (!query.female && query.male) {
      filter.value.female = 'false';
    }

    if (Object.keys(query).length > 0)
      filter.value = { ...filter.value, ...query };

    if (query.from_price)
      filter.value.from_price = DollarToManat(Number(query.from_price));
    if (query.to_price)
      filter.value.to_price = DollarToManat(Number(query.to_price));

    if (query.categoreis && query.categories?.constructor !== Array)
      filter.value.categories = [query.categories as LocationQueryValue];
  },
  { immediate: true, deep: true }
);

const doFilter = () => {
  const query: ProductQuery = {};

  if (route.query.search) query.search = route.query.search as string;
  if (route.query.favorites) query.favorites = route.query.favorites as string;

  if (filter.value.categories && filter.value.categories.length > 0)
    query.categories = filter.value.categories;
  if (filter.value.from_age) query.from_age = filter.value.from_age;
  if (filter.value.to_age) query.to_age = filter.value.to_age;
  if (filter.value.from_price)
    query.from_price = ManatToDollar(Number(filter.value.from_price));
  if (filter.value.to_price)
    query.to_price = ManatToDollar(Number(filter.value.to_price));
  if (filter.value.female === 'true' && filter.value.male === 'false')
    query.female = 'true';
  if (filter.value.male === 'true' && filter.value.female === 'false')
    query.male = 'true';

  if (route.query.ordering) query.ordering = route.query.ordering as string;

  void router.push({
    name: route.name as RouteRecordName,
    query,
  });
};

const clearFilter = () => {
  filter.value = { ...defaultFilters };
};
</script>

<template>
  <q-drawer v-model="filterOpen" side="right" elevated>
    <q-list>
      <q-item-label class="row justify-between" header>
        <div class="text-h6 text-grey-9 text-weight-light text-capitalize">
          {{ $t('label.filter', 2) }}
        </div>
        <q-btn
          flat
          icon="close"
          @click="filterOpen = !filterOpen"
          color="grey"
          class="q-pa-sm q-pr-none"
        />
      </q-item-label>
      <q-expansion-item expand-separator :label="$t('label.gender')">
        <div class="row justify-around">
          <q-checkbox
            :label="$t('product.female')"
            val="female"
            true-value="true"
            false-value="false"
            v-model="filter.female"
          />
          <q-checkbox
            :label="$t('product.male')"
            val="male"
            true-value="true"
            false-value="false"
            v-model="filter.male"
          />
        </div>
      </q-expansion-item>
      <q-expansion-item expand-separator :label="$t('label.age')">
        <div class="row q-pa-md">
          <q-input
            type="number"
            class="col"
            outlined
            v-model.number="filter.from_age"
            :label="$t('product.fromAge')"
          />
          <q-icon class="col-1" name="minus" />
          <q-input
            type="number"
            class="col"
            outlined
            v-model.number="filter.to_age"
            :label="$t('product.toAge')"
          />
        </div>
      </q-expansion-item>

      <q-expansion-item expand-separator :label="$t('product.price')">
        <div class="row q-pa-md">
          <q-input
            type="number"
            class="col"
            outlined
            v-model.number="filter.from_price"
            :label="$t('product.fromPrice')"
            suffix="TMT"
          />
          <q-icon class="col-1" name="minus" />
          <q-input
            type="number"
            class="col"
            outlined
            v-model.number="filter.to_price"
            :label="$t('product.toPrice')"
            suffix="TMT"
          />
        </div>
      </q-expansion-item>

      <q-expansion-item expand-separator :label="$t('product.categories')">
        <div class="column q-pa-md">
          <q-checkbox
            v-for="category in categoryStore.$state.categories"
            :key="category.id"
            :label="category[`name_${$i18n.locale}`]"
            :val="category.slug"
            v-model="filter.categories"
          />
        </div>
      </q-expansion-item>
    </q-list>
    <div class="row justify-between q-px-md q-py-lg">
      <q-btn
        :label="$t('label.clear')"
        icon-right="cleaning_services"
        @click="clearFilter"
        color="primary"
        outline
      />
      <q-btn
        :label="$t('label.filter')"
        icon-right="filter_alt"
        @click="doFilter"
        color="primary"
        outline
      />
    </div>
  </q-drawer>
</template>
