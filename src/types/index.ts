export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
  quantity: number;
  category: Category;
  brand: Brand;
};

export type ProductsResponse = {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
  };
  data: Product[];
};


export type CartItem = {
  _id: string;
  count: number;
  price: number;
  product: {
    id: string;
    title: string;
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
  };
};

export type Cart = {
  _id: string;
  totalCartPrice: number;
  products: CartItem[];
};


export type Review = {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { _id: string; name: string };
};

export type Order = {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress?: { details: string; phone: string; city: string };
  cartItems: {
    _id: string;
    count: number;
    price: number;
    product: { id: string; title: string; imageCover: string };
  }[];
};