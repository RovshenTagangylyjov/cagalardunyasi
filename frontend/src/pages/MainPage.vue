<script setup lang="ts">
import HeadCarousel from 'components/TheHeadCarousel.vue';
import AgeList from 'components/TheAgeList.vue';
import ProductCardSwiper from 'components/ProductCardSwiper.vue';
import { useCategory } from 'src/stores';
import { ref } from 'vue';
import { QInfiniteScroll, QInfiniteScrollProps } from 'quasar';
import type { Category } from 'src/types';

const categoryStore = useCategory();
const page = ref<number>(categoryStore.$state.categories.length ? 1 : 0);

const infiniteScroll = ref<QInfiniteScroll>();
const infiniteScrollProps: QInfiniteScrollProps = {
  onLoad: (_: number, done: CallableFunction) => {
    page.value += 2;

    if (page.value >= categoryStore.categories.length) {
      page.value = categoryStore.categories.length;
      infiniteScroll.value?.stop();
    }

    done();
  },
};
</script>

<template>
  <q-page>
    <HeadCarousel class="q-mb-xl" />
    <q-separator spaced="1rem" />
    <AgeList class="q-my-xl" />
    <Suspense>
      <ProductCardSwiper class="q-my-xl" :label="$t('sort.recentlyAdded')" />
      <template #fallback>
        <div class="row justify-center">
          <q-spinner color="primary" class="text-center" size="40px" />
        </div>
      </template>
    </Suspense>
    <Suspense>
      <ProductCardSwiper
        class="q-my-xl"
        :label="$t('sort.mostPopular')"
        :filter="{ ordering: '-total_sold' }"
      />
      <template #fallback>
        <div class="row justify-center">
          <q-spinner color="primary" class="text-center" size="40px" />
        </div>
      </template>
    </Suspense>
    <Suspense>
      <ProductCardSwiper
        class="q-my-xl"
        :label="$t('product.female')"
        :filter="{ female: 'true' }"
      />
      <template #fallback>
        <div class="row justify-center">
          <q-spinner color="primary" class="text-center" size="40px" />
        </div>
      </template>
    </Suspense>
    <Suspense>
      <ProductCardSwiper
        class="q-my-xl"
        :label="$t('product.male')"
        :filter="{ male: 'true' }"
      />
      <template #fallback>
        <div class="row justify-center">
          <q-spinner color="primary" class="text-center" size="40px" />
        </div>
      </template>
    </Suspense>
    <q-infinite-scroll
      ref="infiniteScroll"
      v-bind="infiniteScrollProps"
      :offset="100"
    >
      <template
        v-for="(_, index) in page"
        :key="categoryStore.categories[index].id"
      >
        <Suspense>
          <ProductCardSwiper
            class="q-my-xl"
            :filter="{ categories: [categoryStore.categories[index].slug] }"
            :label="
              categoryStore.categories[index][`name_${$i18n.locale}` as keyof Category].toString()
            "
          />
          <template #fallback>
            <div class="row justify-center" style="min-height: 300px">
              <q-spinner color="primary" class="text-center" size="40px" />
            </div>
          </template>
        </Suspense>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>
