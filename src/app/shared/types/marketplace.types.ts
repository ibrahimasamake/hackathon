export interface ProductCardModel {
  id: number;
  title: string;
  farmerName: string;
  location: string;
  price: number;
  currency: string;
  unit: string;
  quantity: number;
  imageUrl: string;
  freshnessLabel: 'Fresh' | 'Today' | 'Aging';
}

export interface FarmerCardModel {
  id: number;
  farmName: string;
  ownerName: string;
  region: string;
  verified: boolean;
}
