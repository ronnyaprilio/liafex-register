export interface CartItem {
  code: string;
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

export interface Product {
  code: string;
  name: string;
  price: number;
  discount: number;
  image: string;
}