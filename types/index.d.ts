import {
  Product,
  Customer,
  Order,
  InventoryMovement,
  User,
  Organization,
  Settings,
  Warehouse,
  OrderItem,
  Activity,
  CustomerType,
  OrderStatus,
  PaymentStatus,
  PaymentType,
  InventoryStatus,
  MovementType,
  UserRole,
} from "@prisma/client";

// Extended Types with Relations
export interface ExtendedProduct extends Product {
  warehouse: {
    name: string;
    location: string | null;
  };
  orderItems: OrderItem[];
  movements: InventoryMovement[];
}

export interface ExtendedOrder extends Order {
  customer: {
    name: string;
    email: string;
  };
  items: (OrderItem & {
    product: {
      name: string;
      sku: string;
    };
  })[];
  movements: InventoryMovement[];
}

export interface ExtendedCustomer extends Customer {
  orders: Order[];
}

export interface ExtendedInventoryMovement extends InventoryMovement {
  product: {
    name: string;
    sku: string;
  };
  user: {
    name: string | null;
  };
  order?: {
    orderNumber: string;
  };
}

export interface ExtendedUser extends User {
  organization: Organization;
  activities: Activity[];
  inventoryMovements: InventoryMovement[];
}

export interface ExtendedOrganization extends Organization {
  users: User[];
  customers: Customer[];
  products: Product[];
  warehouses: Warehouse[];
  orders: Order[];
  settings: Settings | null;
}

// Form Data Types
export type ProductFormData = Pick<
  Product,
  | "name"
  | "sku"
  | "description"
  | "quantity"
  | "minStock"
  | "status"
  | "location"
  | "warehouseId"
>;

export type OrderFormData = {
  customerId: string;
  paymentType: PaymentType;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export type CustomerFormData = Pick<
  Customer,
  "name" | "email" | "phone" | "type" | "address"
>;

export type InventoryMovementFormData = {
  type: MovementType;
  productId: string;
  quantity: number;
  reference?: string;
  notes?: string;
};

export type SettingsFormData = Pick<
  Settings,
  "lowStockThreshold" | "currency" | "notificationEmail" | "metadata"
>;

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  organizationId: string;
}

export interface Session {
  user: SessionUser;
}

// Dashboard Types
export interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: ExtendedOrder[];
  recentMovements: ExtendedInventoryMovement[];
}

// Report Types
export interface SalesReport {
  status: OrderStatus;
  _count: number;
  _sum: {
    total: number | null;
  };
}

export interface InventoryReport {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  warehouse: {
    name: string;
  };
}

export interface MovementsReport {
  type: MovementType;
  _count: number;
  _sum: {
    quantity: number | null;
  };
}
