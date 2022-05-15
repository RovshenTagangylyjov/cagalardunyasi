import type { ProductImage, BaseImage } from 'src/types';
import { api, config as BaseConfig } from 'boot/axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
  ProcessServerConfigFunction,
  LoadServerConfigFunction,
  FilePondFile,
} from 'filepond';

export const processImage: ProcessServerConfigFunction = (
  fieldName,
  file,
  metadata,
  load,
  error,
  progress,
  abort
) => {
  // fieldName is the name of the input field
  // file is the actual file object to send
  const formData = new FormData();
  formData.append(fieldName, file, file.name);

  // Axios config
  const controller = new AbortController();
  const config: AxiosRequestConfig = {
    ...BaseConfig,
    signal: controller.signal,
    onUploadProgress: (progressEvent: ProgressEvent) => {
      // Should call the progress method to update the progress to 100% before calling load
      // (endlessMode, loadedSize, totalSize)
      progress(true, progressEvent.loaded, progressEvent.total);
    },
  };

  api
    .post('images/', formData, config)
    .then((response: AxiosResponse<BaseImage>) => {
      // Should call the load method when done and pass the returned server file id
      // this server file id is then used later on when reverting or restoring a file
      // so your server knows which file to return without exposing that info to the client
      load(response.data.path);
    })
    .catch((err: AxiosError) => error(err.message));

  // Should expose an abort method so the request can be cancelled
  return {
    abort: () => {
      // This function is entered if the user has tapped the cancel button
      controller.abort();

      // Let FilePond know the request has been cancelled
      abort();
    },
  };
};

export const loadImage: LoadServerConfigFunction = (
  source: string,
  load,
  error,
  progress,
  abort
) => {
  // Axios config
  const controller = new AbortController();
  const config: AxiosRequestConfig = {
    baseURL: '',
    responseType: 'blob',
    signal: controller.signal,
    onUploadProgress: (progressEvent: ProgressEvent) => {
      // Should call the progress method to update the progress to 100% before calling load
      // (endlessMode, loadedSize, totalSize)
      progress(true, progressEvent.loaded, progressEvent.total);
    },
  };

  // Should request a file object from the server here
  api
    .get(source, config)
    // Should call the load method with a file object or blob when done
    .then((response: AxiosResponse<Blob>) => {
      load(response.data);
    })
    // Can call the error method if something is wrong, should exit after
    .catch((err: string) => void error(err));

  // Should expose an abort method so the request can be cancelled
  return {
    abort: () => {
      // User tapped cancel, abort our ongoing actions here
      controller.abort();
      // Let FilePond know the request has been cancelled
      abort();
    },
  };
};

export const getOrderedProductImages = (files: FilePondFile[]) => {
  const images: ProductImage[] = [];
  files.forEach((image, index) => {
    images.push({
      path: image.serverId,
      order: index,
    });
  });

  return images;
};
