<script setup lang="ts">
const ages = [
  {
    from_age: 0,
    to_age: 1,
  },
  {
    from_age: 2,
    to_age: 3,
  },
  {
    from_age: 4,
    to_age: 6,
  },
  {
    from_age: 7,
    to_age: 9,
  },
  {
    from_age: 10,
    to_age: 12,
  },
  {
    from_age: 12,
  },
];
</script>

<template>
  <div class="row justify-center ages q-gutter-lg">
    <q-item
      clickable
      v-for="(age, index) in ages"
      :key="index"
      :to="{ name: 'ProductList', query: age }"
    >
      <q-item-section class="text-center inset-shadow-down">
        <q-item-label v-if="age.to_age">
          {{ age.from_age }}-{{ age.to_age }}
        </q-item-label>
        <q-item-label v-else>{{ age.from_age }}+</q-item-label>
        <q-item-label caption>{{ $t('label.age') }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<style scoped lang="scss">
$shadow-color: $primary !important;
.ages {
  .q-item,
  .q-item__section {
    padding: 0;
    width: 7em;
    height: 7em;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: $primary;
  }
}
</style>
