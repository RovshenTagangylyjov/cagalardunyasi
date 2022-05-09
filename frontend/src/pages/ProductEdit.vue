<script lang="ts">
import GetOrRedirectProduct from 'src/composables/GetOrRedirectProduct';

export default { ...GetOrRedirectProduct };
</script>

<script setup lang="ts">
import ProductCreateForm from 'components/ProductCreateForm.vue';
import TheImageUpload from 'components/TheImageUpload.vue';
import { ref } from 'vue';
import { useProduct } from 'src/stores';
import { FilePond, FilePondFile } from 'filepond';
import { getOrdererdProductImages } from 'src/helpers/filepond';
import { Product } from 'src/types';
import { useRouter } from 'vue-router';

const productStore = useProduct();
const router = useRouter();
const product = productStore.product as Product;
const filepond = ref<{ ref: FilePond }>();

async function updateProduct() {
  product.images = getOrdererdProductImages(
    filepond.value?.ref.getFiles() as FilePondFile[]
  );

  await productStore.update(product).then(async () => {
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
    <q-form @submit="updateProduct">
      <div class="row justify-between q-py-md">
        <div class="col-12 col-md-6 q-px-sm q-col-gutter-md">
          <ProductCreateForm v-if="product" v-model="product" />
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
          @click="
            $router.push({
              name: 'ProductDetail',
              params: { id: product.id, slug: product.slug },
            })
          "
        />
        <q-btn
          color="primary"
          type="submit"
          :label="$t('label.save')"
          class="q-ml-sm q-px-lg"
        />
      </div>
    </q-form>
  </q-page>
</template>
