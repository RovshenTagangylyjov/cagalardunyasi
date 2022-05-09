<script setup lang="ts">
import OrderCart from 'components/OrderCart.vue';
import OrderForm from 'components/OrderForm.vue';
import OrderPolicy from 'components/OrderPolicy.vue';
import OrderBillCard from 'components/OrderBillCard.vue';
import { ref, computed, provide } from 'vue';
import { useRouter } from 'vue-router';
import { QStepper, QInput, useQuasar } from 'quasar';
import { useCart, useOrder, useAddresses } from 'src/stores';
import { isFormValid } from 'src/helpers/validation';
import { Address } from 'src/types';

const $q = useQuasar();
const router = useRouter();
const cart = useCart();
const addresses = useAddresses();
const orderStore = useOrder();
const stepper = ref<QStepper>();
const step = ref(1);
const isPolicyRead = ref(false);
const orderAddressForm = ref<QInput[]>([]);
const orderNote = ref<string>('');
const addressForm = ref<Address>({
  first_name: '',
  last_name: '',
  address: '',
} as Address);
provide('isEditable', true);

const isStepperNextActive = computed((): boolean => {
  if (step.value === 1 && cart.items.length === 0) return false;

  if (step.value === 3 && !isPolicyRead.value) return false;

  return true;
});

const doOrder = async () => {
  await orderStore
    .create({
      address_id: addresses.$state[0].id,
      cart_id: cart.id,
      note: orderNote.value,
    })
    .then(() => router.push({ name: 'MainPage' }));
};

const nextStep = async () => {
  if (step.value === 2) {
    if (isFormValid(orderAddressForm.value)) {
      $q.loading.show();
      if (addressForm.value?.id)
        await addresses.updateAddress(addressForm.value as Required<Address>);
      else await addresses.createAddress(addressForm.value as Address);
      $q.loading.hide();
    } else return;
  }

  if (step.value === 3) {
    if (isPolicyRead.value) {
      $q.loading.show();

      await doOrder();

      $q.loading.hide();
    } else return;
  }

  stepper.value?.next();
};
</script>

<template>
  <q-page
    class="row justify-around"
    :class="[
      { 'column reverse': $q.screen.lt.md },
      $q.screen.gt.sm ? 'q-gutter-x-lg' : 'q-gutter-y-lg',
    ]"
  >
    <div class="col-12 col-md-8">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        header-nav
        :contracted="$q.screen.lt.md"
      >
        <q-step
          :name="1"
          :title="`${$t('text.cart')} (${cart.getCount})`"
          icon="shopping_cart"
          :done="step > 1"
          :header-nav="step > 1"
        >
          <OrderCart :cart="cart.$state" />
        </q-step>

        <q-step
          :name="2"
          :title="$t('text.fillTheForm')"
          icon="person"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <Suspense>
            <OrderForm
              ref="orderAddressForm"
              v-model:addressForm="addressForm"
              v-model:orderNote="orderNote"
            />
          </Suspense>
        </q-step>

        <q-step
          :name="3"
          :title="$t('text.deliveryPolicy')"
          icon="policy"
          :header-nav="step > 3"
        >
          <OrderPolicy v-model="isPolicyRead" />
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step > 1"
              color="grey"
              @click="stepper?.previous()"
              :label="$t('label.back')"
            />
            <q-btn
              @click="nextStep"
              color="primary"
              :label="step === 3 ? $t('label.order') : $t('label.continue')"
              v-if="isStepperNextActive"
              class="float-right"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>

    <div class="col q-gutter-y-lg" :class="{ 'q-mt-none': !$q.screen.gt.sm }">
      <OrderBillCard
        :price="cart.totalPrice"
        :class="{ 'q-mt-none': !$q.screen.gt.sm }"
      />
    </div>
  </q-page>
</template>

<style lang="scss">
.q-stepper__nav::before {
  content: '';
  padding-left: 8px;
}

@media only screen and (max-width: 360px) {
  .q-stepper__step-inner {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>
