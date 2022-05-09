<script setup lang="ts">
import TheImageUpload from 'components/TheImageUpload.vue';
import ProductCreateForm from 'components/ProductCreateForm.vue';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useProduct } from 'src/stores';
import { BaseProduct } from 'src/types';
import { FilePond, FilePondFile } from 'filepond';
import { getOrdererdProductImages } from 'src/helpers/filepond';

const $q = useQuasar();
const router = useRouter();
const filepond = ref<{ ref: FilePond }>();
const productStore = useProduct();
const product = productStore.product as BaseProduct;

async function createProduct() {
  product.images = getOrdererdProductImages(
    filepond.value?.ref.getFiles() as FilePondFile[]
  );

  await productStore.create(product).then(async (product) => {
    await router.replace({
      name: 'ProductDetail',
      params: { id: product.id, slug: product.slug },
    });
  });
}
</script>

<template>
  <q-page>
    <q-separator spaced="1rem" v-if="!$q.screen.lt.md" />
    <q-form @submit="createProduct">
      <div class="row justify-between q-py-md">
        <div class="col-12 col-md-6 q-px-sm q-col-gutter-sm">
          <ProductCreateForm v-model="product" />
        </div>

        <q-separator
          spaced="1rem"
          class="full-width"
          style="height: 1px"
          v-if="$q.screen.lt.md"
        />
        <q-separator spaced="1rem" vertical v-if="!$q.screen.lt.md" />

        <div class="col-12 col-md-5 q-px-sm">
          <TheImageUpload ref="filepond" :images="product.images" />
        </div>
      </div>

      <div class="row justify-between q-px-sm">
        <q-btn
          color="grey"
          :label="$t('label.cancel')"
          :to="{ name: 'AdminInventory' }"
        />
        <q-btn
          color="primary"
          :label="$t('label.save')"
          type="submit"
          class="q-ml-sm q-px-lg"
        />
      </div>
    </q-form>
  </q-page>
</template>
