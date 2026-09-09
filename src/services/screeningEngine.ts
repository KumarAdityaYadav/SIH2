import {
  BasicProfile,
  CategoryBreakdown,
  HardwareMeasurementItem,
  MenstrualProfile,
  MetabolicProfile,
  ScreeningAnswers,
  ScreeningExplainabilityBreakdown,
  ScreeningLevel,
  ScreeningResult,
  SymptomProfile,
} from '../types';
import { predictPcosRisk } from './mlScreening';
import { assessClinicalSafety } from './clinicalSafety';

export function calculateCompleteness(answers: ScreeningAnswers): {
  percentage: number;
  isComplete: boolean;
  missingCriticalFields: string[];
} {
  const missing: string[] = [];
  let completedCount = 0;
  const totalWeight = 10;

  // 1. Basic Profile
  if (answers.basicProfile?.age && answers.basicProfile.age > 0) completedCount += 2;
  else missing.push('Age');

  if (answers.basicProfile?.weightKg && answers.basicProfile?.heightCm) completedCount += 1;

  // 2. Menstrual Pattern
  if (answers.cycleRegularity || answers.menstrualProfile?.cycleRegularity) {
    completedCount += 3;
  } else {
    missing.push('Menstrual cycle regularity');
  }

  // 3. Symptoms
  if (answers.increasedFacialHair !== undefined || answers.symptomProfile?.excessFacialBodyHair !== undefined) {
    completedCount += 2;
  } else {
    missing.push('PCOS-associated symptom profile');
  }

  // 4. Metabolic / Hardware measurements
  if (
    answers.metabolicProfile?.glucose?.isMeasured ||
    (answers.hardwareMeasurements && answers.hardwareMeasurements.length > 0) ||
    answers.familyDiabetesHistory !== undefined
  ) {
    completedCount += 2;
  }

  const percentage = Math.min(100, Math.round((completedCount / totalWeight) * 100));

  return {
    percentage,
    isComplete: missing.length === 0,
    missingCriticalFields: missing,
  };
}

export function calculateScreeningResult(
  userId: string,
  answers: ScreeningAnswers
): ScreeningResult {
  // Extract or fallback profiles
  const basic: BasicProfile = answers.basicProfile || {
    age: 23,
    heightCm: 160,
    weightKg: 62,
    bmi: 24.2,
    familyHistoryPcos: answers.familyPcosHistory || false,
    familyHistoryDiabetes: answers.familyDiabetesHistory || false,
    knownDiabetes: answers.elevatedBloodSugarHistory || false,
    knownThyroid: answers.knownThyroidDisorder || false,
    currentHormonalMeds: answers.currentHormonalMeds || false,
  };

  const menstrual: MenstrualProfile = answers.menstrualProfile || {
    averageCycleLengthDays: answers.daysBetweenPeriods || 35,
    cycleRegularity: answers.cycleRegularity || 'regular_21_35',
    frequentlyOver35Days: answers.cycleRegularity === 'infrequent_over_35',
    frequentlyUnder21Days: answers.cycleRegularity === 'frequent_under_21',
    anyCycleOver90Days: answers.cycleRegularity === 'absent_3_months_plus',
    averageBleedingDays: 5,
    heavyBleeding: answers.heavyProlongedBleeding || false,
    recentChangeInPattern: answers.recentPatternChange || false,
  };

  const symptoms: SymptomProfile = answers.symptomProfile || {
    excessFacialBodyHair:
      answers.increasedFacialHair === 'moderate_to_severe'
        ? 'moderate_to_severe'
        : answers.increasedFacialHair === 'mild'
        ? 'mild'
        : 'none',
    persistentSevereAcne:
      answers.persistentAcne === 'persistent_adult_cystic'
        ? 'moderate_to_severe'
        : answers.persistentAcne === 'mild_occasional'
        ? 'mild'
        : 'none',
    scalpHairThinning:
      answers.scalpHairThinning === 'noticeable_crown_thinning'
        ? 'moderate_to_severe'
        : answers.scalpHairThinning === 'mild_shedding'
        ? 'mild'
        : 'none',
    menstrualIrregularityPresent:
      menstrual.cycleRegularity !== 'regular_21_35',
    acanthosisSkinChanges: false,
    unexplainedWeightChange:
      answers.unexplainedWeightGain === 'significant_difficulty_losing'
        ? 'significant'
        : answers.unexplainedWeightGain === 'moderate'
        ? 'moderate'
        : 'none',
    chronicFatigue: answers.sleepQuality === 'poor_insomnia_apnea',
    sleepIssues: answers.sleepQuality === 'poor_insomnia_apnea',
    moodChanges: answers.highStressRecentEvents || false,
    pelvicDiscomfort: false,
  };

  const metabolic: MetabolicProfile = answers.metabolicProfile || {};
  const hardwareMeasurements: HardwareMeasurementItem[] =
    answers.hardwareMeasurements || [];

  // ==========================================
  // DETERMINISTIC SCORING ENGINE (Max 100)
  // 1. Menstrual Pattern: Max 40
  // 2. Clinical Symptoms: Max 30
  // 3. Metabolic Context: Max 20
  // 4. Supporting Context: Max 10
  // ==========================================

  // 1. Menstrual Pattern (Max 40)
  let menstrualScore = 0;
  const menstrualObs: string[] = [];

  if (menstrual.anyCycleOver90Days || menstrual.cycleRegularity === 'absent_3_months_plus') {
    menstrualScore += 35;
    menstrualObs.push('Prolonged cycle absence (>90 days amenorrhea pattern)');
  } else if (menstrual.frequentlyOver35Days || menstrual.cycleRegularity === 'infrequent_over_35') {
    menstrualScore += 26;
    menstrualObs.push('Infrequent cycles typically exceeding 35 days (oligomenorrhea)');
  } else if (menstrual.frequentlyUnder21Days || menstrual.cycleRegularity === 'frequent_under_21') {
    menstrualScore += 16;
    menstrualObs.push('Cycles recurring in under 21 days (polymenorrhea)');
  } else {
    menstrualObs.push('Predictable menstrual rhythm reported within typical 21–35 day interval');
  }

  if (menstrual.heavyBleeding) {
    menstrualScore += 6;
    menstrualObs.push('Heavy or prolonged menstrual flow reported');
  }

  if (menstrual.recentChangeInPattern) {
    menstrualScore += 4;
    menstrualObs.push('Recent shift in cycle predictability or duration');
  }

  menstrualScore = Math.min(menstrualScore, 40);

  // 2. Clinical Symptoms / Hyperandrogenism (Max 30)
  let symptomsScore = 0;
  const symptomsObs: string[] = [];

  if (symptoms.excessFacialBodyHair === 'moderate_to_severe') {
    symptomsScore += 14;
    symptomsObs.push('Moderate to prominent coarse facial/body hair growth (hirsutism pattern)');
  } else if (symptoms.excessFacialBodyHair === 'mild') {
    symptomsScore += 7;
    symptomsObs.push('Mild excess hair growth noted');
  }

  if (symptoms.persistentSevereAcne === 'moderate_to_severe') {
    symptomsScore += 9;
    symptomsObs.push('Persistent adult or cystic acne');
  } else if (symptoms.persistentSevereAcne === 'mild') {
    symptomsScore += 4;
  }

  if (symptoms.scalpHairThinning === 'moderate_to_severe') {
    symptomsScore += 8;
    symptomsObs.push('Noticeable scalp hair thinning or crown shedding');
  } else if (symptoms.scalpHairThinning === 'mild') {
    symptomsScore += 3;
  }

  if (symptoms.acanthosisSkinChanges) {
    symptomsScore += 5;
    symptomsObs.push('Darkened skin velvety patches (acanthosis-like appearance)');
  }

  symptomsScore = Math.min(symptomsScore, 30);

  // 3. Metabolic Context (Max 20)
  // Hardware contributes ONLY to the metabolic context, never standalone PCOS diagnosis
  let metabolicScore = 0;
  const metabolicObs: string[] = [];

  // Check hardware measurements or metabolic entries
  const glucoseVal = metabolic.glucose?.value;
  const tgVal = metabolic.triglycerides?.value;
  const cholVal = metabolic.totalCholesterol?.value;
  const hdlVal = metabolic.hdl?.value;

  if (glucoseVal !== undefined && glucoseVal > 0) {
    if (glucoseVal >= 126) {
      metabolicScore += 8;
      metabolicObs.push(`Elevated blood glucose (${glucoseVal} mg/dL)`);
    } else if (glucoseVal >= 100) {
      metabolicScore += 5;
      metabolicObs.push(`Impaired fasting glucose (${glucoseVal} mg/dL)`);
    } else {
      metabolicObs.push(`Fasting glucose in physiological target (${glucoseVal} mg/dL)`);
    }
  } else if (basic.knownDiabetes || answers.elevatedBloodSugarHistory) {
    metabolicScore += 6;
    metabolicObs.push('Reported history of elevated blood sugar');
  }

  if (tgVal !== undefined && tgVal >= 150) {
    metabolicScore += 5;
    metabolicObs.push(`Elevated triglycerides (${tgVal} mg/dL)`);
  }

  if (cholVal !== undefined && cholVal >= 200) {
    metabolicScore += 3;
    metabolicObs.push(`Elevated total cholesterol (${cholVal} mg/dL)`);
  }

  if (hdlVal !== undefined && hdlVal < 50) {
    metabolicScore += 3;
    metabolicObs.push(`Low HDL protective cholesterol (${hdlVal} mg/dL)`);
  }

  if (symptoms.unexplainedWeightChange === 'significant') {
    metabolicScore += 4;
    metabolicObs.push('Difficulty managing metabolic weight');
  } else if (symptoms.unexplainedWeightChange === 'moderate') {
    metabolicScore += 2;
  }

  if (basic.familyHistoryDiabetes) {
    metabolicScore += 3;
    metabolicObs.push('Family history of Type 2 diabetes');
  }

  metabolicScore = Math.min(metabolicScore, 20);

  // 4. Supporting Context (Max 10)
  let supportingScore = 0;
  const supportingObs: string[] = [];

  if (basic.familyHistoryPcos || answers.familyPcosHistory) {
    supportingScore += 5;
    supportingObs.push('First-degree family history of PCOS');
  }

  if (answers.previousPelvicUltrasound === 'polyfollicular_cysts_seen') {
    supportingScore += 6;
    supportingObs.push('Prior ultrasound indicated polyfollicular morphology');
  }

  if (symptoms.chronicFatigue || symptoms.sleepIssues) {
    supportingScore += 2;
    supportingObs.push('Reported chronic fatigue or unrefreshing sleep');
  }

  if (basic.knownThyroid) {
    supportingScore += 2;
    supportingObs.push('Known thyroid condition (relevant differential factor)');
  }

  supportingScore = Math.min(supportingScore, 10);

  // TOTAL CALCULATION (0 - 100)
  const totalScore = Math.min(
    100,
    menstrualScore + symptomsScore + metabolicScore + supportingScore
  );

  const pointBreakdown: ScreeningExplainabilityBreakdown = {
    menstrualPatternScore: menstrualScore,
    clinicalSymptomsScore: symptomsScore,
    metabolicContextScore: metabolicScore,
    supportingContextScore: supportingScore,
    totalScore,
  };

  // Rule Check: High metabolic risk with normal menstrual and no clinical symptoms must NOT automatically become high PCOS risk.
  // Rule Check: Strong menstrual irregularity + strong symptoms remains high even if metabolic is normal.
  const hasStrongPcosFeatures =
    (menstrualScore >= 26 && symptomsScore >= 14) ||
    (menstrualScore >= 35 && symptomsScore >= 7);

  let pcosPattern: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let level: ScreeningLevel = 'GREEN';
  let levelTitle = 'Low Pattern of PCOS-Associated Features';
  let levelDescription =
    'Your responses show a low pattern of PCOS-associated features. Continue tracking your menstrual health and maintaining routine preventive wellness.';

  if (hasStrongPcosFeatures || totalScore >= 55) {
    // If elevated purely because of metabolic score without menstrual/symptom clustering, downgrade PCOS pattern to moderate
    if (menstrualScore < 16 && symptomsScore < 10 && metabolicScore >= 12) {
      pcosPattern = 'MODERATE';
      level = 'ORANGE';
      levelTitle = 'Moderate Pattern (Primary Metabolic Focus)';
      levelDescription =
        'Your responses show metabolic considerations while your menstrual rhythm is relatively preserved. Clinical review is beneficial for overall metabolic wellness.';
    } else {
      pcosPattern = 'HIGH';
      level = 'RED';
      levelTitle = 'Prominent Pattern of PCOS-Associated Features';
      levelDescription =
        'Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation by a gynecologist or endocrinologist.';
    }
  } else if (
    totalScore >= 28 ||
    menstrualScore >= 20 ||
    symptomsScore >= 12 ||
    metabolicScore >= 10
  ) {
    pcosPattern = 'MODERATE';
    level = 'ORANGE';
    levelTitle = 'Moderate Pattern of PCOS-Associated Features';
    levelDescription =
      'Your responses show some features that may warrant clinical evaluation and ongoing menstrual logging.';
  }

  // Categories for compatibility & detailed breakdown
  const categories: CategoryBreakdown[] = [
    {
      categoryKey: 'menstrual',
      categoryTitle: 'Menstrual Pattern',
      score: menstrualScore,
      maxScore: 40,
      status: menstrualScore >= 24 ? 'high' : menstrualScore >= 12 ? 'moderate' : 'low',
      observations: menstrualObs,
    },
    {
      categoryKey: 'hyperandrogen',
      categoryTitle: 'Clinical Symptoms (Hyperandrogenism)',
      score: symptomsScore,
      maxScore: 30,
      status: symptomsScore >= 18 ? 'high' : symptomsScore >= 8 ? 'moderate' : 'low',
      observations: symptomsObs,
    },
    {
      categoryKey: 'metabolic',
      categoryTitle: 'Metabolic Context',
      score: metabolicScore,
      maxScore: 20,
      status: metabolicScore >= 12 ? 'high' : metabolicScore >= 6 ? 'moderate' : 'low',
      observations: metabolicObs,
    },
    {
      categoryKey: 'differential',
      categoryTitle: 'Supporting & Family History',
      score: supportingScore,
      maxScore: 10,
      status: supportingScore >= 6 ? 'moderate' : 'low',
      observations: supportingObs,
    },
  ];

  const contributingFactors: string[] = [
    ...menstrualObs,
    ...symptomsObs,
    ...metabolicObs,
    ...supportingObs,
  ];

  const whatItMeans: string[] = [
    'Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation.',
    'Your metabolic measurements provide additional health-risk context for comprehensive preventive care.',
  ];

  const whatItDoesNotMean: string[] = [
    'This is NOT a medical diagnosis of PCOS or any specific condition.',
    'Hardware measurements do not directly detect or diagnose PCOS on their own.',
    'This screening does not replace an in-person clinical exam or doctor evaluation.',
  ];

  const recommendedNextSteps: string[] = [
    'Schedule a consultation with a registered Gynecologist via StreeSure for clinical evaluation.',
    'Maintain an ongoing menstrual log in the StreeSure Period Tracker to share objective timeline data with your doctor.',
    'Share your metabolic profile with your healthcare provider for integrated lifestyle guidance.',
  ];

  const completeness = calculateCompleteness(answers);
  const safetyAssessment = assessClinicalSafety(answers);
  const mlSignal = safetyAssessment.canUseMlSignal ? predictPcosRisk(answers) : null;

  return {
    id: 'scr_' + Math.random().toString(36).substring(2, 9),
    userId,
    date: new Date().toISOString(),
    level,
    levelTitle,
    levelDescription,
    pcosPattern,
    overallScore: totalScore,
    pointBreakdown,
    categories,
    contributingFactors,
    whatItMeans,
    whatItDoesNotMean,
    recommendedNextSteps,
    disclaimer:
      'StreeSure provides preliminary risk screening and health education. It does not diagnose PCOS or replace evaluation by a qualified healthcare professional. Demo measurements are simulated and are not real clinical measurements.',
    answers,
    basicProfile: basic,
    menstrualProfile: menstrual,
    symptomProfile: symptoms,
    metabolicProfile: metabolic,
    hardwareMeasurements,
    completenessPercentage: completeness.percentage,
    isDataComplete: completeness.isComplete,
    missingCriticalInfo: completeness.missingCriticalFields,
    mlRiskProbability: mlSignal?.probability,
    mlRiskLabel: mlSignal?.label,
    modelVersion: mlSignal?.modelVersion,
    mlThreshold: mlSignal?.threshold,
    safetyAssessment,
  };
}

export const defaultMockScreeningAnswers: ScreeningAnswers = {
  cycleRegularity: 'infrequent_over_35',
  periodSkippingFrequency: 'frequently_multiple_times_a_year',
  recentPatternChange: true,
  heavyProlongedBleeding: true,
  daysBetweenPeriods: 42,
  lastPeriodDate: '2026-07-10',

  increasedFacialHair: 'moderate_to_severe',
  increasedBodyHair: 'mild',
  persistentAcne: 'persistent_adult_cystic',
  scalpHairThinning: 'mild_shedding',
  suddenHairChanges: false,

  unexplainedWeightGain: 'significant_difficulty_losing',
  familyDiabetesHistory: true,
  elevatedBloodSugarHistory: false,
  bloodPressureElevated: false,
  physicalActivityLevel: 'moderate_1_2_days',
  sleepQuality: 'poor_insomnia_apnea',

  difficultyConceiving: 'not_applicable',
  previousPelvicUltrasound: 'unsure',
  previousHormonalTesting: 'never',

  knownThyroidDisorder: false,
  highStressRecentEvents: true,
  majorHealthChanges: false,
  currentHormonalMeds: false,

  familyPcosHistory: true,
  familyCardiovascularMetabolic: false,

  basicProfile: {
    age: 23,
    heightCm: 162,
    weightKg: 66,
    bmi: 25.1,
    waistCircumferenceCm: 82,
    familyHistoryPcos: true,
    familyHistoryDiabetes: true,
    knownDiabetes: false,
    knownThyroid: false,
    currentHormonalMeds: false,
  },

  menstrualProfile: {
    averageCycleLengthDays: 42,
    shortestCycleDays: 32,
    longestCycleDays: 58,
    periodsInLast12Months: 7,
    cycleRegularity: 'infrequent_over_35',
    frequentlyOver35Days: true,
    frequentlyUnder21Days: false,
    anyCycleOver90Days: false,
    averageBleedingDays: 6,
    heavyBleeding: true,
    recentChangeInPattern: true,
  },

  symptomProfile: {
    excessFacialBodyHair: 'moderate_to_severe',
    persistentSevereAcne: 'moderate_to_severe',
    scalpHairThinning: 'mild',
    menstrualIrregularityPresent: true,
    acanthosisSkinChanges: false,
    unexplainedWeightChange: 'significant',
    chronicFatigue: true,
    sleepIssues: true,
    moodChanges: true,
    pelvicDiscomfort: false,
  },

  metabolicProfile: {
    glucose: {
      value: 112,
      unit: 'mg/dL',
      source: 'DEMO',
      fastingStatus: 'FASTING',
      isMeasured: true,
      timestamp: new Date().toISOString(),
      qualityStatus: 'VALID',
    },
    triglycerides: {
      value: 168,
      unit: 'mg/dL',
      source: 'DEMO',
      fastingStatus: 'FASTING',
      isMeasured: true,
      timestamp: new Date().toISOString(),
      qualityStatus: 'VALID',
    },
    totalCholesterol: {
      value: 208,
      unit: 'mg/dL',
      source: 'DEMO',
      fastingStatus: 'FASTING',
      isMeasured: true,
      timestamp: new Date().toISOString(),
      qualityStatus: 'VALID',
    },
    hdl: {
      value: 44,
      unit: 'mg/dL',
      source: 'DEMO',
      fastingStatus: 'FASTING',
      isMeasured: true,
      timestamp: new Date().toISOString(),
      qualityStatus: 'VALID',
    },
    ldl: {
      value: 130,
      unit: 'mg/dL',
      source: 'DEMO',
      fastingStatus: 'FASTING',
      isMeasured: true,
      timestamp: new Date().toISOString(),
      qualityStatus: 'VALID',
    },
    systolicBp: 122,
    diastolicBp: 80,
    waistCircumferenceCm: 82,
  },

  hardwareMeasurements: [
    {
      measurementId: 'm_demo_glc',
      sessionId: 'hw_sess_demo',
      parameter: 'GLUCOSE',
      value: 112,
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      source: 'DEMO',
      deviceId: 'STREESURE-PROTOTYPE-01',
      firmwareVersion: 'v2.4-MVP',
      qualityStatus: 'VALID',
      fastingStatus: 'FASTING',
    },
    {
      measurementId: 'm_demo_tg',
      sessionId: 'hw_sess_demo',
      parameter: 'TRIGLYCERIDES',
      value: 168,
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      source: 'DEMO',
      deviceId: 'STREESURE-PROTOTYPE-01',
      firmwareVersion: 'v2.4-MVP',
      qualityStatus: 'VALID',
      fastingStatus: 'FASTING',
    },
    {
      measurementId: 'm_demo_chol',
      sessionId: 'hw_sess_demo',
      parameter: 'TOTAL_CHOLESTEROL',
      value: 208,
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      source: 'DEMO',
      deviceId: 'STREESURE-PROTOTYPE-01',
      firmwareVersion: 'v2.4-MVP',
      qualityStatus: 'VALID',
      fastingStatus: 'FASTING',
    },
  ],
};
