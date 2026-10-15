export type SubscriptionTier = 'freemium' | 'basic' | 'premium';

export interface UserProfile {
  name: string;
  avatar: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  startingWeightKg: number;
  medicalConditions: string[]; // e.g. 'Type 2 Diabetes', 'Pre-diabetes', 'Hypertension', 'None'
  primaryGoal: 'rapid_weight_loss' | 'sustainable_fat_loss' | 'muscle_gain' | 'hyrox_prep' | 'metabolic_health';
  dailyCalorieBudget: number;
  streakDays: number;
  streakFrozen: boolean;
  fitPoints: number;
  subscriptionTier: SubscriptionTier;
  referralCode: string;
  referredCount: number;
  insuranceCorporateProvider?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  portionSize: string;
  imageUrl?: string;
  timestamp: string;
  aiAnalyzed?: boolean;
  healthScore?: number; // 1-100
  notes?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  hourlyRate: number; // SGD/USD
  rating: number;
  reviewCount: number;
  specialties: ('Weight Loss' | 'Diabetes & Medical' | 'Hyrox & Endurance' | 'Strength & Conditioning' | 'Clinical Nutrition' | 'Senior Mobility')[];
  experienceYears: number;
  bio: string;
  certifications: string[];
  partnerAffiliation?: string; // e.g. 'ActiveSG Master Trainer', 'Hyrox Global Coach', 'Clinical Dietitian'
  availableSlots: string[]; // e.g. ['09:00 AM', '11:30 AM', '03:00 PM', '06:00 PM']
  nextAvailableDate: string;
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerRole: string;
  trainerAvatar: string;
  sessionType: '1-on-1 Online Consultation' | 'Personal Workout Session' | 'Dietary Review & Meal Planning' | 'Form Check & Hyrox Prep';
  date: string;
  timeSlot: string;
  cost: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
  calendarSynced: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'trainer';
  trainerId: string;
  text: string;
  timestamp: string;
  hasAudio?: boolean;
  audioDuration?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  repsOrDuration: string;
  targetMuscle: string;
  instruction: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'Hyrox Conditioning' | 'Fat Burn HIIT' | 'Low-Impact Diabetic Cardio' | 'Full Body Strength' | 'ActiveSG Core Circuit';
  durationMin: number;
  caloriesBurned: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  partnerBadge?: string;
  thumbnail: string;
  exercises: WorkoutExercise[];
}

export interface InBodyRecord {
  date: string;
  weightKg: number;
  bodyFatPercentage: number;
  skeletalMuscleMassKg: number;
  visceralFatLevel: number;
  bmrKcal: number;
  scanLocation: string; // e.g. 'ActiveSG Bishan', 'InBody Clinic Orchard'
}

export interface DeviceConnection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSynced: string;
  metrics: string;
}

export interface RewardItem {
  id: string;
  title: string;
  partnerName: string;
  category: 'F&B Healthy Food' | 'Gym Passes' | 'Sporting Events' | 'Medical & Devices';
  pointsRequired: number;
  retailValue: string;
  imageUrl: string;
  description: string;
  claimedCode?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'workout' | 'consultation' | 'inbody_scan' | 'meal_prep' | 'community_event';
  description: string;
  locationOrUrl?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  phaseTitle: string;
  focus: string;
  targetLossKg: number;
  dailyCalorieTarget: number;
  tasks: { id: string; title: string; category: string; completed: boolean }[];
}
