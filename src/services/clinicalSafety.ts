import { ScreeningAnswers, ScreeningResult } from '../types';

export type SafetyPriority = 'routine' | 'prompt_clinical_review' | 'urgent_care_guidance';

export interface ClinicalSafetyAssessment {
  priority: SafetyPriority;
  canUseMlSignal: boolean;
  mlSuppressedReason?: string;
  flags: string[];
  missingRequiredFields: string[];
  qualityWarnings: string[];
  userMessage: string;
  clinicianMessage: string;
  disclaimer: string;
}

const VALID_CYCLES = new Set(['regular_21_35', 'infrequent_over_35', 'frequent_under_21', 'absent_3_months_plus']);
const VALID_HAIR = new Set(['none', 'mild', 'moderate_to_severe']);
const VALID_ACNE = new Set(['none', 'mild_occasional', 'persistent_adult_cystic']);
const VALID_WEIGHT = new Set(['none', 'moderate', 'significant_difficulty_losing']);

function finitePositive(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Safety is deliberately conservative. It does not diagnose PCOS and does not
 * invent an emergency from incomplete information. It decides whether the ML
 * signal is fit to display and whether the user should be directed to clinical
 * review based on information already present in the screening form.
 */
export function assessClinicalSafety(answers: ScreeningAnswers, result?: ScreeningResult): ClinicalSafetyAssessment {
  const missing: string[] = [];
  const warnings: string[] = [];
  const flags: string[] = [];

  if (!VALID_CYCLES.has(answers.cycleRegularity)) missing.push('cycle regularity');
  if (!Number.isFinite(answers.daysBetweenPeriods) || answers.daysBetweenPeriods <= 0) missing.push('days between periods');
  if (!VALID_HAIR.has(answers.increasedFacialHair)) missing.push('facial hair response');
  if (!VALID_HAIR.has(answers.increasedBodyHair)) missing.push('body hair response');
  if (!VALID_ACNE.has(answers.persistentAcne)) missing.push('acne response');
  if (!VALID_WEIGHT.has(answers.unexplainedWeightGain)) missing.push('weight-change response');

  const basic = answers.basicProfile;
  if (basic) {
    if (!finitePositive(basic.age)) warnings.push('Age is missing or outside the expected positive range.');
    if (!finitePositive(basic.heightCm)) warnings.push('Height is missing or outside the expected positive range.');
    if (!finitePositive(basic.weightKg)) warnings.push('Weight is missing or outside the expected positive range.');
    if (finitePositive(basic.heightCm) && finitePositive(basic.weightKg) && (!finitePositive(basic.bmi) || basic.bmi < 10 || basic.bmi > 80)) {
      warnings.push('BMI could not be reliably verified from the supplied height and weight.');
    }
  }

  if (answers.knownThyroidDisorder) flags.push('Known thyroid disorder may affect menstrual patterns and should be considered during clinical review.');
  if (answers.currentHormonalMeds) flags.push('Current hormonal medicines may affect bleeding patterns and symptom interpretation.');
  if (answers.highStressRecentEvents) flags.push('Recent stress may influence cycle timing and symptoms.');
  if (answers.majorHealthChanges) flags.push('Recent health changes may affect the reported pattern.');

  if (answers.cycleRegularity === 'absent_3_months_plus' || answers.daysBetweenPeriods > 90) {
    flags.push('A prolonged gap between periods was reported; clinical evaluation is appropriate rather than relying on an ML score alone.');
  }
  if (answers.heavyProlongedBleeding) {
    flags.push('Heavy or prolonged bleeding was reported; seek clinical advice, particularly if it is severe, persistent, or causing weakness/dizziness.');
  }

  const missingOrInvalid = missing.length > 0 || warnings.length > 0;
  let priority: SafetyPriority = 'routine';
  if (answers.cycleRegularity === 'absent_3_months_plus' || answers.daysBetweenPeriods > 90 || answers.heavyProlongedBleeding) {
    priority = 'prompt_clinical_review';
  }

  const canUseMlSignal = !missingOrInvalid;
  const mlSuppressedReason = canUseMlSignal ? undefined : 'ML signal suppressed because required screening inputs are missing or invalid.';

  return {
    priority,
    canUseMlSignal,
    mlSuppressedReason,
    flags,
    missingRequiredFields: missing,
    qualityWarnings: warnings,
    userMessage: priority === 'prompt_clinical_review'
      ? 'Some reported findings deserve clinical review. StreeSure does not use its ML score to override that guidance.'
      : 'This is a screening-support result. It does not confirm or rule out PCOS.',
    clinicianMessage: missingOrInvalid
      ? 'Review missing/invalid inputs before interpreting the ML signal.'
      : 'Review the screening pattern, context flags, and clinical history; the ML signal is supportive only.',
    disclaimer: 'Safety assessment is a software guardrail, not a diagnosis or emergency triage system. For severe or rapidly worsening symptoms, use local urgent medical services.',
  };
}
