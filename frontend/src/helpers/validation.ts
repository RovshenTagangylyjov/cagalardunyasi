import { QInput } from 'quasar';

export const isFormValid = (inputs: QInput[]) => {
  let valid = true;

  inputs.forEach((input) => {
    if (!input.validate()) valid = false;
  });

  return valid;
};

export const rules = {
  passwordLength: (val: string | number) =>
    val.toString().length >= 8 || 'Password must have minum 8 characters.',
  required: (val: string | number) => !!val || 'This field is required.',
  phoneNumber: (val: number) =>
    (61000000 <= val && val <= 65999999) || "It's not a valid phone number.",
  minLength: (length: number) => {
    return (val: string | number) =>
      val.toString().length >= length ||
      `Length must be GREATER than ${length}.`;
  },
  maxLength: (length: number) => {
    return (val: string | number) =>
      val.toString().length <= length || `Length must be LESS than ${length}.`;
  },
};

export const minLength = (length: number) => {
  return (val: string | number) =>
    val.toString().length >= length || `Length must be GREATER than ${length}.`;
};

export const maxLength = (length: number) => {
  return (val: string | number) =>
    val.toString().length <= length || `Length must be LESS than ${length}.`;
};
