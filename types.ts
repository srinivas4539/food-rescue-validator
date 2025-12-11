
export interface FoodAnalysisResult {
  food_name: string;
  category: string;
  quantity_estimate: string;
  weight_kg?: number; // Added for logistics logic
  freshness_status: string;
  safety_flag: boolean;
  expiry_window: string;
  allergens: string[];
  safety_reason: string;
}

export interface ChefAnalysisResult {
  ingredients_detected: string[];
  recipes: {
    recipe_name: string;
    prep_time: string;
    steps: string[];
  }[];
}

export interface NgoRequest {
  id: string;
  organization_name: string;
  required_diet: 'Veg' | 'Non-Veg' | 'Vegan';
  required_quantity: number;
  distance_km: number;
  contact_person: string;
  phone: string;
}

export interface MatchResult {
  match_score: number;
  reason: string;
  recommended_action: 'Approve' | 'Reject' | 'Manual Review';
}

export interface SafetyCheckData {
  prepTime: string;
  temperature: 'Hot (>60°C)' | 'Cold (<5°C)' | 'Room Temp';
  isCovered: boolean;
  shelfLife: number;
  isPacked: boolean;
  agreesToCompliance: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type AppMode = 'VALIDATOR'; // Removed 'CHEF'
export type Language = 'en' | 'hi' | 'es' | 'te';

// --- NEW TYPES FOR ROLE-BASED SYSTEM ---

export type UserRole = 'DONOR' | 'NGO' | 'ADMIN' | 'VOLUNTEER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  safetyScore?: number; // For Donors (0-100)
  organization?: string;
  notifications?: number;
  internshipStartDate?: string; // ISO Date string for NGO/Volunteers
  phone?: string;
  rewardPoints?: number;
  badges?: string[];
}

export interface DonationRecord {
  id: string;
  foodName: string;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';
  quantity: string;
  ngoName?: string;
}

export interface ViolationRecord {
  id: string;
  userId: string;
  userName: string;
  violationType: string;
  date: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
}

// NGO Staff Management Types
export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // ISO Timestamp
  checkOut?: string; // ISO Timestamp
  shift: ShiftType;
  hoursWorked?: number;
  earnings?: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface WalletData {
  balance: number;
  totalEarnings: number;
  lastPayoutDate?: string;
}