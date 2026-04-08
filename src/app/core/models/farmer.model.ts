export interface FarmerProfileApi {
  id: number;
  userId: number;
  fullName: string;
  farmName: string;
  phone: string;
  town: string;
  region: string;
  bio: string;
  avatarUrl: string | null;
  verified: boolean;
}
