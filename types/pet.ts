import { PaginationParams, SortOrder } from './common';

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum PetAgeGroup {
  NEWBORN = 'newborn',
  YOUNG = 'young',
  ADULT = 'adult',
  SENIOR = 'senior',
}

export enum AdoptionStatus {
  NEW_INTAKE = 'new_intake',
  SEEKING = 'seeking',
  PENDING = 'pending',
  FOSTER = 'foster',
  ADOPTED = 'adopted',
  PERMANENT_FOSTER = 'permanent_foster',
}

export interface PetImage {
  id: string;
  petId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Species {
  id: number;
  name: string;
  description?: string;
}

export interface Breed {
  id: number;
  speciesId: number;
  name: string;
  description?: string;
  species?: Species;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  veterinarianId?: string;
  recordType: 'vaccination' | 'medication' | 'checkup' | 'surgery' | 'other';
  title: string;
  recordDate: string;
  cost?: number;
  currency?: 'vnd' | 'usd';
  diagnosis?: string;
  treatment?: string;
  nextDueDate?: string;
  notes?: string;
}

export interface Pet {
  id: string;
  petCode: string;
  name: string;
  speciesId: number;
  breedId: number;
  gender: PetGender;
  ageGroup: PetAgeGroup;
  color?: string;
  weight?: number;
  adoptionStatus: AdoptionStatus;
  description?: string;
  isVaccinated: boolean;
  isNeutered: boolean;
  healthSummary?: string;
  intakeDate: string;
  createdAt: string;
  updatedAt: string;
  species?: Species;
  breed?: Breed;
  images?: PetImage[];
  medicalRecords?: MedicalRecord[];
}

export interface PetQuery extends PaginationParams {
  petCode?: string;
  speciesId?: number;
  breedId?: number;
  gender?: PetGender;
  ageGroup?: PetAgeGroup;
  adoptionStatus?: AdoptionStatus;
  color?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PetSearch extends PaginationParams {
  text?: string;
  speciesId?: number;
  breedId?: number;
  gender?: PetGender;
  ageGroup?: PetAgeGroup;
  adoptionStatus?: AdoptionStatus;
}

export interface PetSearchResult {
  pet: Pet;
  similarityScore: number;
}
