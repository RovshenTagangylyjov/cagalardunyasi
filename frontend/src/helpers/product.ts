import { useManagement } from 'src/stores';

export const DollarToManat = (price: number) => {
  const management = useManagement();
  return (price * management.dollar).toFixed(2);
};

export const ManatToDollar = (price: number) => {
  const management = useManagement();
  return (price / management.dollar).toFixed(2);
};
