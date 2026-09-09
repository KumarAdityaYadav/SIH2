import { ScreeningResult } from '../types';
import { assessClinicalSafety } from './clinicalSafety';
import { assessClinicalKnowledge, ClinicalKnowledgeAssessment } from './clinicalKnowledge';

export interface ClinicalIntelligence {
  headline: string;
  evidence: { label: string; detail: string; weight: 'primary' | 'supporting' }[];
  dataQuality: { completeness: number; missing: string[]; caveat: string };
  contextFlags: string[];
  nextSteps: string[];
  mlSignal?: { probability: number; label: string; modelVersion?: string };
  safetyNote: string;
  clinicalKnowledge: ClinicalKnowledgeAssessment;
}

export function buildClinicalIntelligence(result: ScreeningResult): ClinicalIntelligence {
  const pb = result.pointBreakdown;
  const evidence: ClinicalIntelligence['evidence'] = [];
  const contextFlags: string[] = [];

  if ((pb?.menstrualPatternScore ?? 0) >= 20 || result.menstrualProfile?.frequentlyOver35Days || result.menstrualProfile?.anyCycleOver90Days) {
    evidence.push({ label: 'Menstrual pattern', detail: 'Cycle timing or regularity contributed meaningfully to the screening signal.', weight: 'primary' });
  }
  if ((pb?.clinicalSymptomsScore ?? 0) >= 12 || result.symptomProfile?.excessFacialBodyHair === 'moderate_to_severe' || result.symptomProfile?.persistentSevereAcne === 'moderate_to_severe') {
    evidence.push({ label: 'Reported symptoms', detail: 'The reported hair, acne or scalp-hair pattern contributed to the screening signal.', weight: 'primary' });
  }
  if ((pb?.metabolicContextScore ?? 0) >= 10) {
    evidence.push({ label: 'Metabolic context', detail: 'Available metabolic information added supporting health context; it is not used as a standalone PCOS diagnosis.', weight: 'supporting' });
  }
  if ((pb?.supportingContextScore ?? 0) > 0) {
    evidence.push({ label: 'Family / supporting context', detail: 'Family history or other supporting information added context to the overall result.', weight: 'supporting' });
  }

  if (result.answers.knownThyroidDisorder) contextFlags.push('A known thyroid condition can affect menstrual patterns and should be considered during clinical review.');
  if (result.answers.currentHormonalMeds) contextFlags.push('Current hormonal medicines can affect bleeding patterns and symptom interpretation.');
  if (result.answers.highStressRecentEvents) contextFlags.push('Recent stress can influence cycle timing and symptoms.');
  if (result.answers.majorHealthChanges) contextFlags.push('Recent health changes may affect the reported pattern.');

  const missing = result.missingCriticalInfo || [];
  const completeness = result.completenessPercentage ?? 0;
  const safety = result.safetyAssessment || assessClinicalSafety(result.answers, result);
  const clinicalKnowledge = assessClinicalKnowledge(result.answers);
  contextFlags.push(...safety.flags);
  const mlProbability = safety.canUseMlSignal && typeof (result as any).mlRiskProbability === 'number' ? (result as any).mlRiskProbability : undefined;
  const modelVersion = typeof (result as any).modelVersion === 'string' ? (result as any).modelVersion : undefined;

  return {
    headline: result.levelTitle || 'Preliminary screening signal recorded',
    evidence,
    dataQuality: {
      completeness,
      missing,
      caveat: completeness < 80
        ? 'Some important information is missing, so this screening signal should be interpreted cautiously.'
        : 'The main screening fields were completed, but completeness does not establish diagnostic certainty.',
    },
    contextFlags,
    nextSteps: safety.priority === 'prompt_clinical_review'
      ? ['Arrange clinical review for the reported menstrual/bleeding pattern.', ...(result.recommendedNextSteps?.slice(0, 3) || [])]
      : (result.recommendedNextSteps?.slice(0, 4) || ['Discuss the result with a qualified healthcare professional if concerns persist.']),
    mlSignal: mlProbability === undefined ? undefined : {
      probability: Math.max(0, Math.min(1, mlProbability)),
      label: 'Model screening signal — not a diagnosis',
      modelVersion,
    },
    safetyNote: `${safety.userMessage} ${safety.disclaimer}`,
    clinicalKnowledge,
  };
}
