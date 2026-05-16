export type Role = 'SUPERADMIN' | 'ADMIN' | 'CLIENTE';
export type PlanType = 'BRONCE' | 'ORO' | 'PREMIUM';
export type UnitType = 'PIEZA' | 'KILO' | 'GRAMO' | 'LITRO';
export type PaymentMethod = 'TRANSFERENCIA' | 'WAFACASH' | 'CASHPLUS';
export type PaymentStatus = 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO';
export type TenantStatus = 'ACTIVO' | 'SUSPENDIDO' | 'EXPIRADO';
export type DebtStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'CANCELADO';
export type TicketStatus = 'ABIERTO' | 'EN_PROCESO' | 'CERRADO';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role: Role;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  banner?: string;
  description?: string;
  primaryColor: string;
  status: TenantStatus;
  planId?: string;
  subscriptionExpires?: Date;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  durationDays: number;
  maxClients: number;
  maxProducts: number;
  features: string[];
}

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  photo?: string;
  email?: string;
  address?: string;
  totalDebt: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  unitType: UnitType;
  stock?: number;
  photo?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
}

export interface Debt {
  id: string;
  tenantId: string;
  clientId: string;
  totalAmount: number;
  paidAmount: number;
  status: DebtStatus;
  createdAt: Date;
}

export interface Payment {
  id: string;
  tenantId: string;
  clientId: string;
  debtId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalClients: number;
  totalDebt: number;
  totalPaid: number;
  totalPending: number;
  clientsThisMonth: number;
  debtThisMonth: number;
  paidThisMonth: number;
}

export interface SyncItem {
  id: string;
  tenantId: string;
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Record<string, unknown>;
  synced: boolean;
  createdAt: Date;
}