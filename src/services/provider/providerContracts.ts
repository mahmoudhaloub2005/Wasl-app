export interface ProviderGeneratorRequest {
  generatorName: string;
  capacityKva: number;
  status: "active" | "inactive" | "maintenance";
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  defaultAmperePrice: number;
  notes?: string;
}

export interface ProviderAdvertisementRequest {
  title: string;
  description: string;
  image?: File | string | null;
  price?: number;
}

export interface ProviderInvoiceCreateRequest {
  subscriberId: string;
  subscriptionId: string;
  dueDate: string;
  currentReading: number;
  previousReading?: number;
}

export interface ProviderListResponse<TRecord> {
  items: TRecord[];
  total: number;
  page?: number;
  pageSize?: number;
}

export type ProviderNotificationType =
  | "invoice"
  | "payment"
  | "subscriber"
  | "complaint"
  | "generator"
  | "system";

export interface ProviderNotificationRecord {
  id: string;
  type: ProviderNotificationType;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  route?: string;
}

// TODO: Connect these frontend contracts to the real Provider backend endpoints
// after the backend owner provides exact URLs, methods, request bodies, response
// shapes, and authentication rules. Until then, Provider UI must not send
// automatic network requests for backend-dependent features.