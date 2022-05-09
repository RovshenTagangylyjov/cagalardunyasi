import { LocationQueryRaw, LocationQueryValue } from 'vue-router';
import { QInputProps } from 'quasar';

export interface BaseImage {
  path: string;
}

export interface ProductImage extends BaseImage {
  order: number;
}

export interface Image extends BaseImage {
  hash: string;
}

export interface BaseProduct {
  name_tk: string;
  name_rus: string;
  description_tk: string;
  description_rus: string;
  images: ProductImage[];
  from_age: number | null;
  to_age: number | null;
  female: boolean;
  male: boolean;
  price: number | null;
  stock: number | null;
  categories: number[];
  is_active: boolean;
}

export interface Product extends BaseProduct {
  id: number;
  slug: string;
  from_age: number;
  to_age: number;
  price: number;
  stock: number;
  average_rating: number;
  rate_count: number;
  is_favorite: boolean;
  users_rating: Rating | null;
  total_solt: number;
  date_created: string;
  date_updated: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export interface FilePondFiles {
  source: string;
  options: {
    type: string;
  };
}

export interface Category {
  id: number;
  name_tk: string;
  name_rus: string;
  slug: string;
  date_created: string;
  date_updated: string;
}

export interface ListResponseData<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

export interface ProductFilter extends LocationQueryRaw {
  categories?: LocationQueryValue[] | string[];
  from_age?: LocationQueryValue | number;
  to_age?: LocationQueryValue | number;
  from_price?: LocationQueryValue | number;
  to_price?: LocationQueryValue | number;
  ordering?: LocationQueryValue | string;
  male?: LocationQueryValue | string;
  female?: LocationQueryValue | string;
}

export interface ProductQuery extends ProductFilter {
  search?: LocationQueryValue | string;
  ordering?: LocationQueryValue | string;
  favorites?: LocationQueryValue | string;
}

export interface OrderForm {
  cart_id: number;
  address_id: number;
  note?: string;
}

export interface Order {
  id: number;
  cart: Cart;
  address: Address;
  status: string;
  note?: string;
  total_price: number;
  date_updated: number;
  date_created: string;
}

export interface Address {
  id?: number;
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
}

export interface User {
  username: number;
  first_name: string;
  last_name: string;
  permissions: string[];
  addresses: Required<Address>[];
  orders: Order[];
  is_staff: boolean;
}

export interface UserLogin {
  username: number | null;
  password: string;
}

export interface UserRegister extends UserLogin {
  first_name: string;
  last_name: string;
  password2: string;
}

export interface InputProps<T> extends Partial<QInputProps> {
  model: keyof T;
}

export interface AccessToken {
  access: string;
}

export interface TokenPair extends AccessToken {
  refresh: string;
}

export interface Management {
  dollar: number;
}

export interface Rating {
  id: number;
  rate: number;
  date_created: string;
  date_updated: string;
}
