export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  transaction_ref: string;
}