<script setup lang="ts">
import { ref } from 'vue';
import type { ProductImage } from 'src/types';
import { processImage, loadImage } from 'src/helpers/filepond';
import vueFilePond from 'vue-filepond';
import {
  FilePond,
  FilePondInitialFile,
  FilePondServerConfigProps,
} from 'filepond';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
// import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.min.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';

// Create component
const VueFilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageExifOrientation
);

const props = defineProps<{ images?: ProductImage[] }>();
const imageUrls = ref<FilePondInitialFile[]>([]);
const filepond = ref<FilePond>();

defineExpose({ ref: filepond });

props.images?.forEach((image) => {
  const imageFile: FilePondInitialFile = {
    source: String(image.path),
    options: {
      type: 'local',
    },
  };
  imageUrls.value.push(imageFile);
});

const imageUploadApi: FilePondServerConfigProps = {
  server: {
    process: processImage,
    load: loadImage,
    revert: null,
  },
};
</script>

<template>
  <VueFilePond
    ref="filepond"
    name="path"
    :files="imageUrls"
    :label-idle="`${$t('label.dropImagesHere')}...`"
    :allow-multiple="true"
    :allow-reorder="true"
    :drop-validation="true"
    :check-validity="true"
    item-insert-location="after"
    max-file-size="3MB"
    image-crop-aspect-ratio="1:1"
    accepted-file-types="image/jpeg"
    v-bind="imageUploadApi"
  />
</template>
