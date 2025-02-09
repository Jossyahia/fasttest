export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum PaymentType {
  PREPAID = "PREPAID",
  PAY_ON_DELIVERY = "PAY_ON_DELIVERY",
  CREDIT = "CREDIT",
}


export interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  total: number;
  createdAt: string;
  shippingAddress?: string;
  notes?: string;
}
