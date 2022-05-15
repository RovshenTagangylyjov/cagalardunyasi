<script setup lang="ts">
import { computed, ref } from 'vue';
import { QInput, Cookies } from 'quasar';
import { rules } from 'src/helpers/validation';
import { useUser, useAddresses } from 'src/stores';
import type { Address } from 'src/types';

const props = defineProps<{
  orderNote: string;
  addressForm: Address;
}>();
const user = useUser();
const addresses = useAddresses();

const firstName = ref<QInput>();
const lastName = ref<QInput>();
const phoneNumber = ref<QInput>();
const addressText = ref<QInput>();

defineExpose([firstName, lastName, phoneNumber, addressText]);
const emits = defineEmits<{
  (e: 'update:orderNote', newNote: string): void;
  (e: 'update:addressForm', newAddress: Address): void;
}>();

const note = computed({
  get: () => props.orderNote,
  set: (newNote) => emits('update:orderNote', newNote),
});

const address = computed({
  get: () => props.addressForm,
  set: (newAddress) => emits('update:addressForm', newAddress),
});

if (addresses.$state.length > 0) address.value = addresses.$state[0];
else {
  if (user.username)
    address.value = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.username,
      address: '',
    };
  else {
    const address_id = Cookies.get('addressid');
    if (address_id) {
      await addresses.fetchAddress(address_id);
      address.value = addresses.$state[0];
    }
  }
}
</script>

<template>
  <div class="row q-px-sm justify-around q-gutter-md">
    <q-input
      ref="firstName"
      outlined
      :label="$t('user.firstName')"
      v-model.trim.lazy="address.first_name"
      :rules="[rules.required]"
      lazy-rules
      class="col-12 col-sm-5"
    />
    <q-input
      ref="lastName"
      outlined
      :label="$t('user.lastName')"
      v-model.trim.lazy="address.last_name"
      :rules="[rules.required]"
      lazy-rules
      class="col-12 col-sm-5"
    />
    <q-input
      ref="phoneNumber"
      outlined
      type="number"
      :label="$t('user.phoneNumber')"
      v-model.number.lazy="address.phone_number"
      :rules="[rules.required, rules.phoneNumber]"
      lazy-rules
      class="col-12 col-sm-5"
      prefix="+993"
    />
    <q-input
      ref="addressText"
      outlined
      :label="$t('user.address')"
      v-model.trim.lazy="address.address"
      :rules="[rules.required]"
      lazy-rules
      class="col-12 col-sm-5"
    />
    <q-input
      outlined
      autogrow
      :label="$t('label.note')"
      v-model.trim.lazy="note"
      class="col-12 col-sm-11"
    />
  </div>
</template>
