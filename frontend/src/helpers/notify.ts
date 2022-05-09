import { Notify } from 'quasar';

export const notifySuccess = (text: string) => {
  Notify.create({
    message: text,
    color: 'positive',
    icon: 'done',
    position: 'bottom-right',
  });
};

export const notifyError = (text: string) => {
  Notify.create({
    message: text,
    color: 'negative',
    icon: 'error_outline',
    position: 'bottom-right',
  });
};
