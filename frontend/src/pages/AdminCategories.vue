<script setup lang="ts">
import DialogCreateCategory from 'components/DialogCreateCategory.vue';
import DialogConfirmDelete from 'components/DialogConfirmDelete.vue';
import ButtonBase from 'components/ButtonBase.vue';
import { ref } from 'vue';
import { QTable, QTableColumn } from 'quasar';
import { useCategory } from 'src/stores';
import type { Category } from 'src/types';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const categoryStore = useCategory();
const selected = ref<Category[]>([]);
const isCreateCategoryVisible = ref(false);
const isDeleteConfirmVisible = ref(false);
const columns: QTableColumn<Category>[] = [
  {
    name: 'name_tk',
    label: i18n.t('product.nameTk'),
    align: 'center',
    field: 'name_tk',
    sortable: true,
  },
  {
    name: 'name_rus',
    label: i18n.t('product.nameRus'),
    align: 'center',
    field: 'name_rus',
    sortable: true,
  },
  {
    name: 'date_updated',
    label: i18n.t('product.dateUpdated'),
    align: 'center',
    field: 'date_updated',
    sortable: true,
    required: true,
  },
  {
    name: 'date_created',
    label: i18n.t('product.dateCreated'),
    align: 'center',
    field: 'date_created',
    sortable: true,
    required: true,
  },
];

const savePopup = async (id: number, name: keyof Category, value: string) => {
  const category: Partial<Category> = { id, [name]: value };
  await categoryStore.partialUpdate(category);
};

const deleteCategories = async () => {
  for (const category of selected.value)
    await categoryStore
      .delete(category.id)
      .then(
        () =>
          (selected.value = selected.value.filter(
            (selectedCategory) => selectedCategory.id !== category.id
          ))
      );
};
</script>

<template>
  <q-page class="q-pa-xl window-height">
    <DialogCreateCategory
      v-if="isCreateCategoryVisible"
      v-model="isCreateCategoryVisible"
    />
    <DialogConfirmDelete
      v-model="isDeleteConfirmVisible"
      :item-name="$t('product.category')"
      @confirm="deleteCategories"
    />
    <q-table
      class="admin-table"
      title="categoryStore"
      :rows="categoryStore.categories"
      :columns="columns"
      :rows-per-page-options="[0]"
      binary-state-sort
      selection="multiple"
      row-key="id"
      v-model:selected="selected"
    >
      <template v-slot:top="props">
        <ButtonBase
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
        <div class="q-table__title q-ml-md">
          {{ $t('product.category', 2) }}
        </div>
        <ButtonBase
          icon="add"
          class="q-ml-md"
          color="primary"
          :flat="false"
          @click="isCreateCategoryVisible = !isCreateCategoryVisible"
        />
        <q-space />
        <ButtonBase
          icon="delete"
          :flat="false"
          color="negative"
          v-if="selected.length > 0"
          @click="isDeleteConfirmVisible = !isDeleteConfirmVisible"
        />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" multiple />
          </q-td>
          <q-td key="name_tk" :props="props">
            {{ props.row.name_tk }}
            <q-popup-edit
              v-model="props.row.name_tk"
              buttons
              v-slot="scope"
              @save="(value) => savePopup(props.row.id, 'name_tk', value)"
            >
              <q-input v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="name_rus" :props="props">
            {{ props.row.name_rus }}
            <q-popup-edit
              v-model="props.row.name_rus"
              buttons
              v-slot="scope"
              @save="(value) => savePopup(props.row.id, 'name_rus', value)"
            >
              <q-input v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="date_updated" :props="props">
            {{ props.row.date_updated }}
          </q-td>
          <q-td key="date_created" :props="props">
            {{ props.row.date_created }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>
