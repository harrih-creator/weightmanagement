import {
  UserProfile,
  FoodItem,
  Trainer,
  Booking,
  WorkoutRoutine,
  InBodyRecord,
  DeviceConnection,
  RewardItem,
  CalendarEvent,
  RoadmapWeek,
  Message
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  age: 32,
  gender: 'male',
  heightCm: 175,
  startingWeightKg: 86.4,
  currentWeightKg: 81.2,
  targetWeightKg: 73.0,
  medicalConditions: ['Pre-diabetes', 'Mild Hypertension'],
  primaryGoal: 'sustainable_fat_loss',
  dailyCalorieBudget: 1850,
  streakDays: 19,
  streakFrozen: false,
  fitPoints: 1680,
  subscriptionTier: 'basic',
  referralCode: 'VITAL-ALEX99',
  referredCount: 3,
  insuranceCorporateProvider: 'AIA Vitality Corporate Wellness'
};

export const SAMPLE_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f-1',
    name: 'Steamed Chicken Breast & Brown Rice Bowl',
    mealType: 'lunch',
    calories: 485,
    proteinG: 42,
    carbsG: 52,
    fatG: 9,
    fiberG: 6,
    glycemicIndex: 'Low',
    portionSize: '1 medium bowl (350g)',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    timestamp: 'Today, 12:45 PM',
    aiAnalyzed: true,
    healthScore: 94,
    notes: 'High lean protein with low GI complex carbs. Excellent for metabolic control.'
  },
  {
    id: 'f-2',
    name: 'Greek Yogurt with Blueberries & Chia Seeds',
    mealType: 'breakfast',
    calories: 260,
    proteinG: 21,
    carbsG: 28,
    fatG: 7,
    fiberG: 5,
    glycemicIndex: 'Low',
    portionSize: '200g serving',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    timestamp: 'Today, 08:15 AM',
    aiAnalyzed: true,
    healthScore: 98,
    notes: 'Probiotic rich, stable morning blood sugar release.'
  },
  {
    id: 'f-3',
    name: 'Grilled Salmon with Asparagus & Quinoa',
    mealType: 'dinner',
    calories: 520,
    proteinG: 38,
    carbsG: 34,
    fatG: 22,
    fiberG: 7,
    glycemicIndex: 'Low',
    portionSize: '1 plate (380g)',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
    timestamp: 'Yesterday, 07:30 PM',
    aiAnalyzed: true,
    healthScore: 96,
    notes: 'Omega-3 fatty acids support cardiovascular health and reduce inflammation.'
  }
];

export const DEMO_FOOD_LIBRARY = [
  {
    name: 'Avocado Toast with Poached Egg',
    category: 'Breakfast',
    calories: 340,
    proteinG: 14,
    carbsG: 26,
    fatG: 19,
    fiberG: 7,
    glycemicIndex: 'Low' as const,
    healthScore: 89,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
    portion: '1 slice sourdough + 1 egg + 1/2 avocado'
  },
  {
    name: 'Singapore Hainanese Chicken Rice (Steamed)',
    category: 'Lunch',
    calories: 580,
    proteinG: 35,
    carbsG: 68,
    fatG: 18,
    fiberG: 2,
    glycemicIndex: 'Medium' as const,
    healthScore: 78,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
    portion: 'Standard hawker portion (steamed breast meat, less oil)'
  },
  {
    name: 'Healthy Kale & Grilled Chicken Salad',
    category: 'Dinner',
    calories: 390,
    proteinG: 36,
    carbsG: 18,
    fatG: 17,
    fiberG: 8,
    glycemicIndex: 'Low' as const,
    healthScore: 96,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    portion: 'SaladStop! Earth Bowl equivalent'
  },
  {
    name: 'Mixed Berry & Protein Smoothie',
    category: 'Snack',
    calories: 220,
    proteinG: 25,
    carbsG: 24,
    fatG: 3,
    fiberG: 5,
    glycemicIndex: 'Low' as const,
    healthScore: 92,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    portion: '1 tall tumbler (400ml)'
  }
];

export const TRAINERS_LIST: Trainer[] = [
  {
    id: 'tr-1',
    name: 'Cheryl Lim, RD',
    role: 'Clinical Dietitian & Diabetes Specialist',
    avatar: 'https://images.unsplash.com/photo-1594824813589-20f5fa453733?auto=format&fit=crop&w=250&q=80',
    hourlyRate: 65,
    rating: 4.95,
    reviewCount: 142,
    specialties: ['Diabetes & Medical', 'Clinical Nutrition', 'Weight Loss'],
    experienceYears: 8,
    bio: 'Specialist in metabolic syndromic nutrition, reversing pre-diabetes through carb awareness and micro-nutrition adjustments without crash diets.',
    certifications: ['MSc Clinical Dietetics (NUS)', 'Certified Diabetes Educator (SADA)', 'ActiveSG Health Partner'],
    partnerAffiliation: 'Hospital & Clinic Referral Partner',
    availableSlots: ['09:00 AM', '11:00 AM', '02:30 PM', '05:00 PM'],
    nextAvailableDate: 'Tomorrow, 09:00 AM'
  },
  {
    id: 'tr-2',
    name: 'Marcus Vance',
    role: 'Hyrox Official Coach & Strength Specialist',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=250&q=80',
    hourlyRate: 80,
    rating: 4.98,
    reviewCount: 218,
    specialties: ['Hyrox & Endurance', 'Strength & Conditioning', 'Weight Loss'],
    experienceYears: 11,
    bio: 'Top 1% Hyrox finisher and functional body re-composition coach. Helping busy professionals burn fat while retaining explosive athletic power.',
    certifications: ['Hyrox Master Trainer Level 3', 'CSCS Certified', 'Gym Partner (Anytime & Fitness First)'],
    partnerAffiliation: 'Hyrox Singapore Official Partner',
    availableSlots: ['07:30 AM', '12:00 PM', '06:00 PM', '07:30 PM'],
    nextAvailableDate: 'Today, 06:00 PM'
  },
  {
    id: 'tr-3',
    name: 'Dr. Raymond Tay',
    role: 'Sports Physician & Senior Mobility Trainer',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
    hourlyRate: 95,
    rating: 4.91,
    reviewCount: 89,
    specialties: ['Senior Mobility', 'Diabetes & Medical', 'Weight Loss'],
    experienceYears: 14,
    bio: 'Specializes in safe, joint-friendly weight reduction for individuals aged 45-70 with knee arthritis, hypertension, or high BMI.',
    certifications: ['MBBS Sports Med', 'ACSM Certified Exercise Physiologist', 'Health365 Advisory Panel'],
    partnerAffiliation: 'Health365 Medical Network',
    availableSlots: ['10:00 AM', '01:00 PM', '04:00 PM'],
    nextAvailableDate: 'Friday, 10:00 AM'
  },
  {
    id: 'tr-4',
    name: 'Siti Nurhaliza',
    role: 'Holistic Fat Loss & Lifestyle Coach',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    hourlyRate: 45,
    rating: 4.88,
    reviewCount: 96,
    specialties: ['Weight Loss', 'Strength & Conditioning'],
    experienceYears: 6,
    bio: 'High energy, community-driven accountability coach. Focuses on habit loops, emotional eating mitigation, and home workout progression.',
    certifications: ['ACE Personal Trainer', 'Precision Nutrition Level 1', 'ActiveSG Group Instructor'],
    partnerAffiliation: 'ActiveSG Community Leader',
    availableSlots: ['08:00 AM', '10:30 AM', '03:30 PM', '06:30 PM'],
    nextAvailableDate: 'Thursday, 08:00 AM'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    trainerId: 'tr-1',
    trainerName: 'Cheryl Lim, RD',
    trainerRole: 'Clinical Dietitian & Diabetes Specialist',
    trainerAvatar: 'https://images.unsplash.com/photo-1594824813589-20f5fa453733?auto=format&fit=crop&w=250&q=80',
    sessionType: 'Dietary Review & Meal Planning',
    date: 'Oct 18, 2026',
    timeSlot: '11:00 AM - 11:45 AM',
    cost: 65,
    status: 'confirmed',
    meetingLink: 'https://vitalpact.meet/session/cheryl-alex',
    calendarSynced: true
  },
  {
    id: 'bk-102',
    trainerId: 'tr-2',
    trainerName: 'Marcus Vance',
    trainerRole: 'Hyrox Official Coach',
    trainerAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=250&q=80',
    sessionType: 'Form Check & Hyrox Prep',
    date: 'Oct 22, 2026',
    timeSlot: '06:00 PM - 07:00 PM',
    cost: 80,
    status: 'confirmed',
    location: 'ActiveSG Jurong East Stadium Gym',
    calendarSynced: true
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'trainer',
    trainerId: 'tr-1',
    text: 'Hi Alex! I reviewed your lunch log of the Steamed Chicken and Brown Rice. Great balance with the fiber! Your glucose response should stay very stable. Keep up this consistency!',
    timestamp: '1:15 PM'
  },
  {
    id: 'm-2',
    sender: 'user',
    trainerId: 'tr-1',
    text: 'Thanks Cheryl! I was worried about the carb count, but the portion slider helped me stay within the 50g carb limit.',
    timestamp: '1:20 PM'
  },
  {
    id: 'm-3',
    sender: 'trainer',
    trainerId: 'tr-1',
    text: 'Exactly! For dinner, try to pair your protein with green veggies. Remember to drink at least 500ml water before 5 PM to keep your streak alive!',
    timestamp: '1:22 PM',
    hasAudio: true,
    audioDuration: '0:24'
  }
];

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'wo-1',
    title: 'Hyrox Engine & Sled Push Conditioning',
    category: 'Hyrox Conditioning',
    durationMin: 35,
    caloriesBurned: 380,
    difficulty: 'Advanced',
    equipment: 'Kettlebells / Sled / Rower',
    partnerBadge: 'Hyrox Official Protocol',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    exercises: [
      { name: 'SkiErg or Battle Ropes', sets: 4, repsOrDuration: '60s work / 30s rest', targetMuscle: 'Full Body Lungs', instruction: 'Maintain high cadence, hinge hips back on each pull.' },
      { name: 'Sled Push / Loaded Crawl', sets: 4, repsOrDuration: '25 meters', targetMuscle: 'Quads & Glutes', instruction: 'Keep spine neutral, drive through midfoot.' },
      { name: 'Burpee Broad Jumps', sets: 3, repsOrDuration: '10 reps', targetMuscle: 'Cardio Explosiveness', instruction: 'Chest hits deck, spring forward landing soft.' },
      { name: 'Farmers Walk', sets: 4, repsOrDuration: '50 meters', targetMuscle: 'Grip & Core', instruction: 'Shoulders locked down, steady walking pace.' }
    ]
  },
  {
    id: 'wo-2',
    title: 'Low-Impact Glycemic Control Cardio',
    category: 'Low-Impact Diabetic Cardio',
    durationMin: 25,
    caloriesBurned: 195,
    difficulty: 'Beginner',
    equipment: 'Stationary Bike / Brisk Walk',
    partnerBadge: 'Clinical Medical Track',
    thumbnail: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=400&q=80',
    exercises: [
      { name: 'Gentle Warm-up March', sets: 1, repsOrDuration: '3 minutes', targetMuscle: 'Heart & Joints', instruction: 'Elevate knees comfortably to hip level.' },
      { name: 'Low Resistance Spin / Power Walk', sets: 1, repsOrDuration: '15 minutes', targetMuscle: 'Aerobic Base', instruction: 'RPE 5-6/10. Able to hold a conversation.' },
      { name: 'Bodyweight Chair Squats', sets: 3, repsOrDuration: '12 reps', targetMuscle: 'Legs & Glucose Sinks', instruction: 'Use a chair as depth target, stand tall squeezing glutes.' },
      { name: 'Wall Pushups & Calf Pumps', sets: 3, repsOrDuration: '15 reps', targetMuscle: 'Upper Body & Circulation', instruction: 'Controlled tempo, focus on deep rhythmic breathing.' }
    ]
  },
  {
    id: 'wo-3',
    title: 'Full Body Metabolic Fat Burn Circuit',
    category: 'Fat Burn HIIT',
    durationMin: 28,
    caloriesBurned: 310,
    difficulty: 'Intermediate',
    equipment: 'Dumbbells / Resistance Band',
    partnerBadge: 'ActiveSG Home Fitness',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80',
    exercises: [
      { name: 'Goblet Squats', sets: 4, repsOrDuration: '15 reps', targetMuscle: 'Lower Body', instruction: 'Hold dumbbell tight to chest, drive elbows inside knees.' },
      { name: 'Dumbbell Renegade Rows', sets: 3, repsOrDuration: '10 reps each side', targetMuscle: 'Back & Core', instruction: 'Prevent hip rotation during rowing stroke.' },
      { name: 'Mountain Climbers', sets: 3, repsOrDuration: '45 seconds', targetMuscle: 'Abs & Cardio', instruction: 'Sprint knees towards chest with stable shoulders.' },
      { name: 'Kettlebell Swings', sets: 4, repsOrDuration: '20 reps', targetMuscle: 'Hamstrings & Posterior Chain', instruction: 'Hinge at the hips, snap glutes forward at top.' }
    ]
  }
];

export const INBODY_RECORDS: InBodyRecord[] = [
  {
    date: 'Sep 01, 2026',
    weightKg: 86.4,
    bodyFatPercentage: 27.8,
    skeletalMuscleMassKg: 34.2,
    visceralFatLevel: 11,
    bmrKcal: 1720,
    scanLocation: 'ActiveSG Jurong West'
  },
  {
    date: 'Sep 22, 2026',
    weightKg: 83.8,
    bodyFatPercentage: 25.4,
    skeletalMuscleMassKg: 34.6,
    visceralFatLevel: 10,
    bmrKcal: 1740,
    scanLocation: 'ActiveSG Bishan'
  },
  {
    date: 'Oct 14, 2026',
    weightKg: 81.2,
    bodyFatPercentage: 23.2,
    skeletalMuscleMassKg: 35.1,
    visceralFatLevel: 8,
    bmrKcal: 1765,
    scanLocation: 'InBody Diagnostic Hub Raffles'
  }
];

export const CONNECTED_DEVICES: DeviceConnection[] = [
  {
    id: 'dev-1',
    name: 'Apple Watch Ultra 2',
    icon: 'Watch',
    connected: true,
    lastSynced: '10 mins ago',
    metrics: '9,420 steps · 540 active kcal · 68 bpm resting'
  },
  {
    id: 'dev-2',
    name: 'InBody Scale (InBody 770 / 270)',
    icon: 'Activity',
    connected: true,
    lastSynced: 'Yesterday',
    metrics: '23.2% Body Fat · 35.1kg Muscle · Visceral Level 8'
  },
  {
    id: 'dev-3',
    name: 'Health365 & ActiveSG Sync',
    icon: 'ShieldCheck',
    connected: true,
    lastSynced: '1 hour ago',
    metrics: 'Healthpoints: 2,450 HPB pts · ActiveSG Balance $35'
  },
  {
    id: 'dev-4',
    name: 'Garmin / Fitbit Tracker',
    icon: 'Smartphone',
    connected: false,
    lastSynced: 'Not connected',
    metrics: 'Sleep score & VO2 max telemetry ready'
  }
];

export const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew-1',
    title: '$15 SaladStop! Healthy Bowl Voucher',
    partnerName: 'SaladStop! Singapore',
    category: 'F&B Healthy Food',
    pointsRequired: 600,
    retailValue: 'SGD $15.00',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    description: 'Enjoy fresh nutritionist-approved grain bowls, superfood salads and whole wraps at any islandwide outlet.'
  },
  {
    id: 'rew-2',
    title: 'ActiveSG 5-Visit Gym & Pool Pass',
    partnerName: 'ActiveSG Government Programme',
    category: 'Gym Passes',
    pointsRequired: 800,
    retailValue: 'SGD $16.50',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    description: 'Full access to any ActiveSG public gym and swimming complex across Singapore.'
  },
  {
    id: 'rew-3',
    title: 'Hyrox Singapore 20% Race Registration Discount',
    partnerName: 'Hyrox Official',
    category: 'Sporting Events',
    pointsRequired: 1200,
    retailValue: 'SGD $38.00',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    description: 'Exclusive entry discount code for the upcoming Hyrox Open, Doubles, or Relay event at Singapore Expo.'
  },
  {
    id: 'rew-4',
    title: 'InBody Clinical Body Composition Scan',
    partnerName: 'InBody Diagnostic Clinic',
    category: 'Medical & Devices',
    pointsRequired: 1000,
    retailValue: 'SGD $45.00',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
    description: 'Full medical-grade segmental analysis: visceral fat rating, intracellular water, phase angle and muscle balance.'
  },
  {
    id: 'rew-5',
    title: 'Grain Healthy Meal Delivery $20 Voucher',
    partnerName: 'Grain F&B Singapore',
    category: 'F&B Healthy Food',
    pointsRequired: 750,
    retailValue: 'SGD $20.00',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    description: 'Chef-crafted wholesome meals delivered hot to your doorstep with exact macronutrient breakdown.'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Cardio & Strength: Hyrox Sled Prep',
    date: '2026-10-15',
    time: '06:00 PM',
    type: 'workout',
    description: 'ActiveSG Jurong East - Coach Marcus Vance',
    locationOrUrl: 'ActiveSG Jurong East Stadium Gym'
  },
  {
    id: 'ev-2',
    title: 'Dietary Consult: Cheryl Lim (RD)',
    date: '2026-10-18',
    time: '11:00 AM',
    type: 'consultation',
    description: 'Metabolic review & diabetic carbs balance',
    locationOrUrl: 'https://vitalpact.meet/session/cheryl-alex'
  },
  {
    id: 'ev-3',
    title: 'InBody Milestone Scan (Week 6 Check)',
    date: '2026-10-25',
    time: '10:00 AM',
    type: 'inbody_scan',
    description: 'Track body fat % & muscle retention',
    locationOrUrl: 'InBody Clinic Orchard'
  },
  {
    id: 'ev-4',
    title: 'ActiveSG Community Roadshow & Fitness Talk',
    date: '2026-10-28',
    time: '02:00 PM',
    type: 'community_event',
    description: 'Free hydration tests, roadshow signups, Health365 points booth',
    locationOrUrl: 'Bishan Community Sports Hall'
  }
];

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    weekNumber: 1,
    phaseTitle: 'Phase 1: Metabolic Reset & Baseline',
    focus: 'Stabilize insulin spikes, establish 1,850 kcal intake, sync wearable devices',
    targetLossKg: 0.8,
    dailyCalorieTarget: 1850,
    tasks: [
      { id: 't-1', title: 'Upload daily meal photos with AI Calorie Scanner', category: 'Nutrition', completed: true },
      { id: 't-2', title: 'Baseline InBody scan at ActiveSG', category: 'Biometrics', completed: true },
      { id: 't-3', title: 'Complete 30-min Low-Impact Cardio walk', category: 'Fitness', completed: true },
      { id: 't-4', title: 'Connect Apple Watch or Health365 tracker', category: 'Devices', completed: true }
    ]
  },
  {
    weekNumber: 2,
    phaseTitle: 'Phase 2: Muscle Preservation & Hyrox Strength',
    focus: 'Increase protein to 130g/day, introduce resistance training and sled pushing',
    targetLossKg: 0.7,
    dailyCalorieTarget: 1800,
    tasks: [
      { id: 't-5', title: '1-on-1 Consultation with Dietitian Cheryl Lim', category: 'Consult', completed: true },
      { id: 't-6', title: 'Hyrox Engine & Sled Push conditioning session', category: 'Fitness', completed: false },
      { id: 't-7', title: 'Maintain 7-day food logging streak', category: 'Habits', completed: true },
      { id: 't-8', title: 'Redeem SaladStop! healthy meal voucher', category: 'Nutrition', completed: false }
    ]
  },
  {
    weekNumber: 3,
    phaseTitle: 'Phase 3: Accelerated Fat Oxidation',
    focus: 'Caloric deficit optimization, HIIT intervals, visceral fat check',
    targetLossKg: 0.8,
    dailyCalorieTarget: 1750,
    tasks: [
      { id: 't-9', title: 'Bi-weekly InBody body fat scan review', category: 'Biometrics', completed: false },
      { id: 't-10', title: 'Group Hyrox bootcamp simulation', category: 'Fitness', completed: false },
      { id: 't-11', title: 'Refer 1 friend to earn 500 FitPoints', category: 'Community', completed: false }
    ]
  }
];
