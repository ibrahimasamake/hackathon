export interface OrderApi {
  id: number;
  productId: number;
  productTitle: string;
  buyerId: number;
  farmerUserId: number;
  quantity: number;
  note: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
}
