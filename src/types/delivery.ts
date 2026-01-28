export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'issue' | 'refused';

export type OccurrenceType = 'damage' | 'refused' | 'partial' | 'reschedule' | 'other';

export interface Delivery {
  id: string;
  nf: string;
  client: string;
  address: string;
  city: string;
  items: number;
  status: DeliveryStatus;
  priority: 'high' | 'medium' | 'low';
  scheduledTime?: string;
  phone?: string;
  notes?: string;
}

export interface Occurrence {
  id: string;
  deliveryId: string;
  type: OccurrenceType;
  description: string;
  photos: string[];
  createdAt: Date;
}

export interface Receipt {
  id: string;
  deliveryId: string;
  photo: string;
  signature?: string;
  receiverName: string;
  receiverDoc?: string;
  createdAt: Date;
}
