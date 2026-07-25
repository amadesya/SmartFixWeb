export enum Role {
    Client = 0,
    Technician = 1,
    Admin = 2
}

export enum RequestStatus {
  New = 'New',
  InProgress = 'InProgress',
  Ready = 'Ready',
  Closed = 'Closed',
  Rejected = 'Rejected',
}

export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.New]: 'Новая',
  [RequestStatus.InProgress]: 'В работе',
  [RequestStatus.Ready]: 'Готова',
  [RequestStatus.Closed]: 'Закрыта',
  [RequestStatus.Rejected]: 'Отклонена',
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  phone?: string;
  avatar?: string;
  token?: string;
  password?: string;
  personalDiscount?: number;
  bonusPoints?: number;
  clientNotes?: string;
  totalSpent?: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface ServiceDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
}


export interface RepairRequest {
  id: number;
  clientName: string;
  clientId: number;
  device: string;
  issueDescription: string;
  status: RequestStatus;
  technicianId?: number;
  technicianName?: string;
  comments: { author: string; text: string; date: string }[];
  createdAt: string;
  CompletedAt: string;
  price: number | null;
  discountedPrice?: number | null
  isPaid: boolean;
  repairServices?: any[]; 
  repairParts?: any[];
  hasReview?: boolean;
  deviceName?: string | null;
}

export interface CommentDto {
    id: number;               
    repairRequestId: number;   
    userId: number;            
    text: string;              
    date: string | Date;       
    
    userName?: string; 
}

export interface AuthResponseDto {
    id: number;
    token: string;
    name: string;
    email: string;
    role: number;
    isVerified: boolean;
    phone?: string;
    avatar?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface PartType {
    id: number;
    name: string;
}

export interface Part {
    id: number;
    name: string;
    stockQuantity: number;
    purchasePrice: number;
    typeId: number;
    type?: PartType; 
}

export interface Review {
    id: number;
    body: string;
    rating: number;
    createdAt: string; 
    authorName: string;
    authorAvatar: string | null;
    authorEmail: string;
    userId?: number;
    parentId?: number;
    ParentId?: number | null;
    repairRequestId?: number | null;
    deviceName?: string | null;

    replies?: Review[];
}

export interface CreateReviewDto {
    userId: number;
    body: string;
    rating: number;
    parentId?: number | null;
    repairRequestId?: number | null;
}

export interface RepairServiceDto {
    id: number;
    repairRequestId: number;
    serviceId: number;
    serviceName: string; 
    priceAtTheTime: number;
}

export interface RepairRequestDto {
    id: number;
    clientId: number;
    clientName: string;
    technicianId?: number;
    technicianName?: string;
    device: string;
    issueDescription: string;
    status: string;
    
    // Новые финансовые поля
    price?: number;          // Общая сумма за услуги
    masterBonus?: number;    // Начисленная премия
    partsCost?: number;      // Себестоимость запчастей
    
    isPaid: boolean;
    createdAt: string;   
    completedAt?: string;    

    repairServices: RepairServiceDto[];
    repairParts: RepairPartDto[]; 
}

export interface MasterStatsDto {
    masterName: string;
    doneRequests: number;    
    totalRevenue: number;   
    averageRating: number;  
}

export interface CompleteRepairPayload {
    serviceIds: number[]; 
}

export interface RepairPartDto {
    id: number;
    repairRequestId: number;
    sparePartId: number;
    
    sparePartName: string; 
    
    quantity: number;
    
    priceAtTheTime: number; 
    
    totalLinePrice: number; 
}

// Добавь тип запчасти
export interface SparePart {
    id: number;
    name: string;
    stockQuantity: number;
    purchasePrice: number;
    price?: number;
    type?: PartType; 
}

export interface SparePartType {
    id: number;
    name: string;
}
