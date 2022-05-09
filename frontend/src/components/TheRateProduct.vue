<script setup lang="ts">
import { ref, computed } from 'vue';
import { Rating } from 'src/types';
import { useProduct } from 'src/stores';

const productStore = useProduct();
const props = defineProps<{ rating: Rating | null; product: number }>();
const loading = ref<boolean>(false);
const usersRate = computed({
  get: () => props.rating?.rate || 0,
  set: (rate: number) => {
    loading.value = true;
    productStore
      .rate(props.product, rate, props.rating?.id)
      .finally(() => (loading.value = false));
  },
});
const isRateOpen = ref<boolean>(false);
</script>

<template>
  <div class="q-mt-lg">
    <q-list :bordered="isRateOpen">
      <q-expansion-item
        group="accardion"
        icon="star"
        :label="$t('product.rate')"
        v-model="isRateOpen"
        header-class="text-primary"
      >
        <q-card>
          <q-card-section class="row justify-between items-center">
            <q-rating
              v-model="usersRate"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              color="yellow-12"
              size="2rem"
              no-dimming
            />
            <q-spinner v-if="loading" color="primary" size="30px" />
            <q-icon
              v-else-if="usersRate"
              name="done"
              size="1rem"
              color="positive"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
