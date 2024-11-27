export interface ResultProduct {
  user: {
    username: string;
    name: string;
    lastname: string;
  };
  products: Products[];
}

export interface Products {
  id: string;
  name: string;
}
