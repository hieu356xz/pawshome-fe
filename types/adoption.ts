import { Pet } from "./pet";

export enum AdoptionRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  userId: string;
  applicantName: string;
  email: string;
  phone?: string;
  address?: string;
  reason: string;
  experience?: string;
  hasOtherPets?: boolean;
  otherPetsDetail?: string;
  livingSituation?: string;
  hasYard?: boolean;
  commitment?: string;
  status: AdoptionRequestStatus;
  notes?: string;
  reviewerId?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  pet?: Pet;
  user?: any;
}
