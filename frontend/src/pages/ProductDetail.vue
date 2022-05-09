<script lang="ts">
import GetOrRedirectProduct from 'src/composables/GetOrRedirectProduct';
export default { ...GetOrRedirectProduct };
</script>

<script setup lang="ts">
import ProductDetailCarousel from 'components/ProductDetailCarousel.vue';
import TheRateProduct from 'components/TheRateProduct.vue';
import ButtonAddToCart from 'components/ButtonAddToCart.vue';
import ButtonAddToFavorites from 'components/ButtonAddToFavorites.vue';
import ProductQuantity from 'components/ProductQuantity.vue';
import DialogConfirmDelete from 'components/DialogConfirmDelete.vue';
import { ref } from 'vue';
import { useProduct, useUser } from 'src/stores';
import { Product } from 'src/types';
import { useRouter } from 'vue-router';
import { DollarToManat } from 'src/helpers/product';

const productStore = useProduct();
const user = useUser();
const router = useRouter();
const product = productStore.product as Product;
const quantity = ref<number>(1);
const showDeleteConfirm = ref(false);

const deleteProduct = async () => {
  await productStore.delete(product.id).then(() => router.go(-1));
};
</script>

<template>
  <q-page>
    <template v-if="user.$state.is_staff">
      <div class="row">
        <div class="text-h6 text-grey-9">
          {{ $t('product.totalSolt') }}: {{ product.total_solt }}
        </div>
        <q-space />
        <div>
          <q-btn
            :label="$t('label.delete')"
            color="negative"
            class="q-mr-md"
            icon="delete"
            @click="showDeleteConfirm = true"
          />
          <q-btn
            :label="$t('label.edit')"
            color="primary"
            icon="edit"
            :to="{
              name: 'ProductEdit',
              params: {
                id: product.id,
                slug: product.slug,
              },
            }"
          />
        </div>
      </div>
      <DialogConfirmDelete
        v-model="showDeleteConfirm"
        :item-name="$t('text.product')"
        @confirm="deleteProduct"
      />
      <q-separator spaced="1rem" v-if="$q.screen.lt.sm" />
    </template>
    <q-separator spaced="1rem" v-if="!$q.screen.lt.sm" />
    <div class="row justify-between">
      <div class="col-12 col-sm-8">
        <ProductDetailCarousel :images="product.images" />
      </div>

      <q-separator spaced="1rem" v-if="$q.screen.lt.sm" />
      <q-separator spaced="1rem" vertical v-if="!$q.screen.lt.sm" />

      <div class="col-12 col-sm-3">
        <div class="row justify-between">
          <q-rating
            v-model="product.average_rating"
            readonly
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            color="yellow-12"
            size="1rem"
            no-dimming
          />

          <ButtonAddToFavorites
            :isFavorite="product.is_favorite"
            :product-id="product.id"
          />
        </div>

        <div class="row text-h6">{{ product[`name_${$i18n.locale}`] }}</div>
        <div
          class="row text-caption text-justify"
          v-if="product[`description_${$i18n.locale}`]"
        >
          {{ product[`description_${$i18n.locale}`] }}
        </div>
        <div class="row justify-between items-center">
          <div class="price text-no-wrap text-subtitle text-bold">
            {{ DollarToManat(product.price) }} TMT
          </div>
          <ProductQuantity
            v-model="quantity"
            :stock="(product.stock as number)"
          />
        </div>

        <div class="row q-mt-sm items-center">
          <ButtonAddToCart
            :product="product"
            :quantity="quantity"
            padding="15px"
          />
        </div>

        <TheRateProduct :rating="product.users_rating" :product="product.id" />
      </div>
    </div>
  </q-page>
</template>
