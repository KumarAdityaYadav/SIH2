export type Role = 'USER' | 'ASHA' | 'DOCTOR' | 'NGO' | 'ADMIN';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export type ScreeningLevel = 'GREEN' | 'ORANGE' | 'RED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  preferredLanguage: LanguageCode;
  age?: number;
  location?: string;
  emergencyContact?: string;
  createdAt: string;
  healthProfileCompleted?: boolean;
}

export interface HealthProfile {
  userId: string;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  location: string;
  preferredLanguage: LanguageCode;
  
  // Menstrual History
  ageAtMenarche: number;
  typicalCycleLengthDays: number;
  typicalPeriodDurationDays: number;
  cycleRegularity: 'regular' | 'somewhat_irregular' | 'very_irregular' | 'absent_for_months';
  lastPeriodDate: string;
  missedPeriodsPast6Months: number;
  majorRecentChanges: string;
  heavyBleeding: boolean;
  severePainCramps: boolean;
  spottingBetweenPeriods: boolean;

  // Medical History
  previousPcosEvaluation: 'never' | 'suspected' | 'diagnosed_by_doctor' | 'unsure';
  thyroidHistory: 'none' | 'hypothyroidism' | 'hyperthyroidism' | 'unsure';
  diabetesMetabolic: 'none' | 'prediabetes' | 'type2_diabetes' | 'gestational' | 'unsure';
  highBloodPressure: boolean;
  surgeries: string;
  currentMedications: string;
  allergies: string;
  updatedAt: string;
}

export interface BasicProfile {
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number; // Automatically calculated = weightKg / (heightM * heightM)
  waistCircumferenceCm?: number;
  familyHistoryPcos: boolean;
  familyHistoryDiabetes: boolean;
  knownDiabetes: boolean;
  knownThyroid: boolean;
  currentHormonalMeds: boolean;
}

export interface MenstrualProfile {
  averageCycleLengthDays: number;
  shortestCycleDays?: number;
  longestCycleDays?: number;
  periodsInLast12Months?: number;
  cycleRegularity: 'regular_21_35' | 'infrequent_over_35' | 'frequent_under_21' | 'absent_3_months_plus';
  frequentlyOver35Days: boolean;
  frequentlyUnder21Days: boolean;
  anyCycleOver90Days: boolean;
  averageBleedingDays: number;
  heavyBleeding: boolean;
  recentChangeInPattern: boolean;
}

export interface SymptomProfile {
  // CORE FEATURES
  excessFacialBodyHair: 'none' | 'mild' | 'moderate_to_severe';
  persistentSevereAcne: 'none' | 'mild' | 'moderate_to_severe';
  scalpHairThinning: 'none' | 'mild' | 'moderate_to_severe';
  menstrualIrregularityPresent: boolean;

  // SUPPORTING FEATURES
  acanthosisSkinChanges: boolean;
  unexplainedWeightChange: 'none' | 'moderate' | 'significant';
  chronicFatigue: boolean;
  sleepIssues: boolean;
  moodChanges: boolean;
  pelvicDiscomfort: boolean;
}

export interface MetabolicMeasurementEntry {
  value?: number;
  unit: 'mg/dL';
  source: 'MANUAL' | 'LAB_REPORT' | 'DEVICE' | 'DEMO';
  fastingStatus?: 'FASTING' | 'NON_FASTING' | 'UNKNOWN';
  timestamp?: string;
  qualityStatus?: 'VALID' | 'INVALID' | 'QUALITY_WARNING';
  deviceId?: string;
  isMeasured: boolean;
}

export interface MetabolicProfile {
  glucose?: MetabolicMeasurementEntry;
  triglycerides?: MetabolicMeasurementEntry;
  totalCholesterol?: MetabolicMeasurementEntry;
  hdl?: MetabolicMeasurementEntry;
  ldl?: MetabolicMeasurementEntry;
  systolicBp?: number;
  diastolicBp?: number;
  waistCircumferenceCm?: number;
}

export interface HardwareMeasurementItem {
  measurementId: string;
  sessionId: string;
  parameter: 'GLUCOSE' | 'TRIGLYCERIDES' | 'TOTAL_CHOLESTEROL' | 'HDL' | 'LDL';
  value: number;
  unit: 'mg/dL';
  timestamp: string;
  source: 'DEVICE' | 'DEMO';
  deviceId?: string;
  firmwareVersion?: string;
  qualityStatus: 'VALID' | 'INVALID' | 'QUALITY_WARNING';
  fastingStatus: 'FASTING' | 'NON_FASTING' | 'UNKNOWN';
  errorMessage?: string;
}

export interface StreeSureUnifiedScreeningSession {
  basicProfile: BasicProfile;
  menstrualProfile: MenstrualProfile;
  symptomProfile: SymptomProfile;
  metabolicProfile: MetabolicProfile;
  hardwareMeasurements: HardwareMeasurementItem[];
}

export interface ScreeningAnswers {
  // Category A: Menstrual Patterns
  cycleRegularity: 'regular_21_35' | 'infrequent_over_35' | 'frequent_under_21' | 'absent_3_months_plus';
  periodSkippingFrequency: 'never' | 'occasionally' | 'frequently_multiple_times_a_year';
  recentPatternChange: boolean;
  heavyProlongedBleeding: boolean;
  daysBetweenPeriods: number;
  lastPeriodDate: string;

  // Category B: Hyperandrogen-related Features
  increasedFacialHair: 'none' | 'mild' | 'moderate_to_severe';
  increasedBodyHair: 'none' | 'mild' | 'moderate_to_severe';
  persistentAcne: 'none' | 'mild_occasional' | 'persistent_adult_cystic';
  scalpHairThinning: 'none' | 'mild_shedding' | 'noticeable_crown_thinning';
  suddenHairChanges: boolean;

  // Category C: Metabolic / General Health
  unexplainedWeightGain: 'none' | 'moderate' | 'significant_difficulty_losing';
  familyDiabetesHistory: boolean;
  elevatedBloodSugarHistory: boolean;
  bloodPressureElevated: boolean;
  physicalActivityLevel: 'sedentary' | 'moderate_1_2_days' | 'active_3_plus_days';
  sleepQuality: 'good' | 'average' | 'poor_insomnia_apnea';

  // Category D: Reproductive / Gynecological History
  difficultyConceiving: 'not_applicable' | 'no' | 'trying_over_6_months' | 'trying_over_12_months';
  previousPelvicUltrasound: 'never' | 'normal' | 'polyfollicular_cysts_seen' | 'unsure';
  previousHormonalTesting: 'never' | 'normal' | 'elevated_androgens_lh_fsh' | 'unsure';

  // Category E: Differential Context
  knownThyroidDisorder: boolean;
  highStressRecentEvents: boolean;
  majorHealthChanges: boolean;
  currentHormonalMeds: boolean;

  // Category F: Family History
  familyPcosHistory: boolean;
  familyCardiovascularMetabolic: boolean;

  // Extended Unified Profiles (Optional on answers for smooth inter-op)
  basicProfile?: BasicProfile;
  menstrualProfile?: MenstrualProfile;
  symptomProfile?: SymptomProfile;
  metabolicProfile?: MetabolicProfile;
  hardwareMeasurements?: HardwareMeasurementItem[];
}

export interface CategoryBreakdown {
  categoryKey: 'menstrual' | 'hyperandrogen' | 'metabolic' | 'reproductive' | 'differential' | 'family';
  categoryTitle: string;
  score: number;
  maxScore: number;
  status: 'low' | 'moderate' | 'high';
  observations: string[];
}

export interface ScreeningExplainabilityBreakdown {
  menstrualPatternScore: number; // e.g. out of 40
  clinicalSymptomsScore: number; // e.g. out of 30
  metabolicContextScore: number; // e.g. out of 20
  supportingContextScore: number; // e.g. out of 10
  totalScore: number; // 0 - 100
}

export interface ScreeningResult {
  id: string;
  userId: string;
  date: string;
  level: ScreeningLevel;
  levelTitle: string;
  levelDescription: string;
  pcosPattern: 'LOW' | 'MODERATE' | 'HIGH';
  overallScore: number; // 0 - 100
  pointBreakdown?: ScreeningExplainabilityBreakdown;
  categories: CategoryBreakdown[];
  contributingFactors: string[];
  whatItMeans: string[];
  whatItDoesNotMean: string[];
  recommendedNextSteps: string[];
  disclaimer: string;
  answers: ScreeningAnswers;
  
  // Unified Session Data & Hardware Integration
  basicProfile?: BasicProfile;
  menstrualProfile?: MenstrualProfile;
  symptomProfile?: SymptomProfile;
  metabolicProfile?: MetabolicProfile;
  hardwareMeasurements?: HardwareMeasurementItem[];
  completenessPercentage?: number;
  isDataComplete?: boolean;
  missingCriticalInfo?: string[];
  mlRiskProbability?: number;
  mlRiskLabel?: 'lower_screening_signal' | 'higher_screening_signal';
  modelVersion?: string;
  mlThreshold?: number;
  safetyAssessment?: {
    priority: 'routine' | 'prompt_clinical_review' | 'urgent_care_guidance';
    canUseMlSignal: boolean;
    mlSuppressedReason?: string;
    flags: string[];
    missingRequiredFields: string[];
    qualityWarnings: string[];
    userMessage: string;
    clinicianMessage: string;
    disclaimer: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  fullName?: string;
  photo: string;
  photoUrl?: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  yearsOfExperience?: number;
  languages: string[];
  languagesSpoken?: string[];
  consultationFee: number;
  consultationFeeInr?: number;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  about: string;
  bio?: string;
  hospitalAffiliation: string;
  hospitalClinic?: string;
  availableSlots: any;
  isVerified: boolean;
  teleconsultationAvailable?: boolean;
}

export interface Consultation {
  id: string;
  userId: string;
  userName?: string;
  patientName?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  date?: string;
  time?: string;
  scheduledAt?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'scheduled' | 'completed' | 'cancelled';
  type?: 'VIDEO' | 'IN_PERSON';
  mode?: 'video' | 'audio' | 'chat';
  fee?: number;
  consultationFeeInr?: number;
  paymentStatus?: 'PAID' | 'PENDING';
  screeningLevelSummary?: ScreeningLevel;
  sharedScreeningSummary?: string;
  meetingLink?: string;
  notes?: string;
  patientNotes?: string;
  doctorClinicalNotes?: string;
  prescriptionSummary?: string;
  createdAt?: string;
}

export interface PeriodLog {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  cycleLengthDays?: number;
  periodDurationDays?: number;
  flow?: 'light' | 'medium' | 'heavy' | 'spotting';
  flowIntensity?: 'spotting' | 'light' | 'medium' | 'heavy';
  painLevel?: number; // 1 - 5
  symptoms: string[];
  mood: 'calm' | 'happy' | 'tired' | 'anxious' | 'irritable' | 'crampy' | string;
  notes?: string;
  createdAt?: string;
}

export interface AshaWorker {
  id: string;
  name: string;
  workerCode: string;
  villageCluster: string;
  district: string;
  state: string;
  phone: string;
  assignedBeneficiariesCount: number;
  screeningsCompletedCount: number;
  referralsMadeCount: number;
}

export interface Beneficiary {
  id: string;
  ashaWorkerId: string;
  fullName: string;
  age: number;
  village?: string;
  villageWard?: string;
  phone?: string;
  contactNumber?: string;
  preferredLanguage?: LanguageCode;
  consentGiven: boolean;
  screeningStatus?: 'pending' | 'completed';
  screeningResultLevel?: 'GREEN' | 'ORANGE' | 'RED';
  latestScreeningLevel?: ScreeningLevel;
  latestScreeningDate?: string;
  referralStatus: 'NONE' | 'REFERRED_TO_PHC' | 'REFERRED_TO_GYNECOLOGIST' | 'FOLLOW_UP_COMPLETED' | 'none' | 'referred_to_phc' | 'completed';
  notes?: string;
  createdAt?: string;
}

export type AshaBeneficiary = Beneficiary;

export interface NGO {
  id: string;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  headquarters: string;
  isVerified: boolean;
  totalCampaignsCount: number;
  totalWomenReached: number;
  logo: string;
}

export interface Campaign {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  villageLocation?: string;
  villageDistrict?: string;
  district?: string;
  state?: string;
  date?: string;
  campaignDate?: string;
  topics?: string[];
  assignedAshaWorkers?: string[];
  ashaWorkersInvolved?: number;
  kitsDistributed?: number;
  targetParticipants?: number;
  targetBeneficiaries?: number;
  actualParticipants?: number;
  screenedBeneficiaries?: number;
  screeningsConducted?: number;
  referralsMade?: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'upcoming' | 'active' | 'completed' | 'planned';
  description?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  doctorAuthor?: string;
  category: 'pcos_basics' | 'menstrual_health' | 'symptoms' | 'myths_facts' | 'lifestyle' | 'nutrition' | string;
  readTimeMinutes: number;
  summary?: string;
  bodyParagraphs?: string[];
  content?: string;
  audioDuration?: string;
  tags?: string[];
  featuredImage?: string;
  keyTakeaways?: string[];
}

export type EducationalContent = EducationalArticle;

export interface MythFact {
  id: string;
  myth: string;
  fact: string;
  explanation?: string;
  category: string;
}

export interface DeliveryPartner {
  id: string;
  name?: string;
  partnerType: 'ZEPTO_RURAL' | 'BLINKIT_GRAMIN' | 'ASHA_EXPRESS' | 'SHADOWFAX_MEDIC' | 'SOS_DRONE';
  partnerLabel: string;
  logoBadge: string;
  estimatedMinutes: string | number;
  estimatedTime?: string;
  deliveryFee: number;
  deliveryFeeInr?: number;
  isFreeSubsidized?: boolean;
  riderName: string;
  riderPhone?: string;
  phone?: string;
  riderPhoto: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  currentLocationName: string;
  nearestHubName?: string;
  distanceKm: number;
  badgeText?: string;
  isFastest?: boolean;
  discreetPackaging?: boolean;
  status?: 'ONLINE' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED';
}

export interface VillageDarkStore {
  id: string;
  name: string;
  block: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  deliveryRadiusKm: number;
  avgDeliveryTimeMinutes: number;
  activeRidersCount: number;
  stockStatus?: 'INSTANT_AVAILABLE' | 'HIGH_STOCK' | 'RESTOCKING';
  inventoryCount: {
    tablets: number;
    hotBags: number;
    patches: number;
    pads: number;
    cups: number;
    smartDevices: number;
  };
  contactNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'biodegradable_pads' | 'reusable_cloth_pads' | 'menstrual_cups' | 'intimate_hygiene' | 'pain_relief' | 'nutrition_supplements' | 'smart_devices' | string;
  description: string;
  price: number;
  priceInr?: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount?: number;
  image: string;
  imageUrl?: string;
  inStock?: boolean;
  ecoFriendly?: boolean;
  isSubsidized?: boolean;
  ruralAffordableBadge?: boolean;
  features?: string[];
  usageInstructions?: string;
  safetyCertifications?: string[];
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    villageOrCity: string;
    district: string;
    pincode: string;
  };
  paymentMethod: 'COD' | 'UPI_SIMULATED' | 'CARD_SIMULATED';
  createdAt: string;
}

export interface HealthJourneyStep {
  id: string;
  date: string;
  title: string;
  category: 'ONBOARDING' | 'SCREENING' | 'ASHA_SUPPORT' | 'DOCTOR_CONSULT' | 'PERIOD_LOG' | 'LIFESTYLE';
  description: string;
  badge: string;
  level?: ScreeningLevel;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalScreenings: number;
  screeningBreakdown: {
    green: number;
    orange: number;
    red: number;
  };
  totalConsultations: number;
  ashaAssistedScreenings: number;
  campaignReach: number;
  activeNgoPartners: number;
  totalCareStoreOrders: number;
  monthlyTrends: { month: string; screenings: number; consultations: number }[];
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SCREENING' | 'APPOINTMENT' | 'PERIOD' | 'CAMPAIGN' | 'INFO';
  date: string;
  isRead: boolean;
}

// PROGRESS TRACKING & RECOVERY METRICS
export interface DailyWellnessLog {
  id: string;
  date: string; // YYYY-MM-DD
  userId: string;
  waterGlasses: number; // target 8-10
  sleepHours: number; // target 7-9
  stepsCount: number; // target 8000
  exerciseMinutes: number;
  exerciseCompleted: boolean;
  exerciseType?: string;
  crampsSeverity: number; // 0 (none) - 5 (severe)
  acneSeverity: number; // 0 - 5
  bloatingSeverity: number; // 0 - 5
  moodLevel: 'peaceful' | 'energetic' | 'neutral' | 'fatigued' | 'anxious' | 'irritable';
  stressLevel: number; // 1 (low) - 5 (high)
  supplementsTaken: string[]; // ['Myo-Inositol', 'Spearmint Tea', 'Vitamin D3', 'Omega-3', 'Methi Water']
  remediesUsed: string[]; // ['Fenugreek Seed Water', 'Spearmint Infusion', 'Turmeric Milk']
  dietAdherence: 'strict_low_gi' | 'balanced' | 'high_sugar_cheat';
  notes?: string;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  titleHi: string;
  category: 'STREAK' | 'EXERCISE' | 'REMEDIES' | 'CYCLE' | 'CONSULTATION';
  description: string;
  descriptionHi: string;
  iconName: string;
  achieved: boolean;
  achievedDate?: string;
  progressPercent: number;
  badgeTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
}

export interface SymptomTrendRecord {
  month: string;
  avgCycleLength: number;
  crampScore: number;
  acneScore: number;
  energyScore: number;
  insulinScore: number;
}

// EXERCISE PORTAL
export type ExerciseCategory = 'yoga' | 'strength' | 'liss_cardio' | 'cycle_synced' | 'pelvic_core' | 'cortisol_reset';

export type CyclePhase = 'all' | 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface ExerciseRoutine {
  id: string;
  title: string;
  titleHi: string;
  category: ExerciseCategory;
  cyclePhase: CyclePhase;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Gentle';
  caloriesBurnEstimate: number;
  pcosBenefits: string[];
  pcosBenefitsHi: string[];
  hormonalImpact: string;
  hormonalImpactHi: string;
  equipmentNeeded: string[];
  thumbnailUrl: string;
  instructorName: string;
  instructorRole: string;
  steps: {
    stepNumber: number;
    name: string;
    nameHi: string;
    durationSeconds: number;
    instructions: string;
    instructionsHi: string;
    focusCue: string;
  }[];
}

// HOME REMEDIES PORTAL
export type RemedyCategory = 'hormonal_balance' | 'cramp_relief' | 'insulin_metabolic' | 'anti_androgen' | 'gut_bloating' | 'sleep_stress';

export interface HomeRemedy {
  id: string;
  name: string;
  nameHi: string;
  botanicalOrAltName?: string;
  category: RemedyCategory;
  targetSymptoms: string[];
  targetSymptomsHi: string[];
  summary: string;
  summaryHi: string;
  mechanismOfAction: string;
  mechanismOfActionHi: string;
  preparationTimeMinutes: number;
  ingredients: {
    item: string;
    itemHi: string;
    quantity: string;
  }[];
  steps: {
    stepNumber: number;
    instruction: string;
    instructionHi: string;
  }[];
  bestTimeToConsume: string;
  bestTimeToConsumeHi: string;
  contraindicationsAndSafety: string;
  contraindicationsAndSafetyHi: string;
  clinicalBacking: string;
  doctorEndorsementQuote?: string;
  iconType: 'herbal_tea' | 'seed' | 'spice' | 'oil_pack' | 'decoction' | 'milk';
  rating: number;
  reviewCount: number;
}
