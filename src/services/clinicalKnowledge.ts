/**
 * StreeSure Clinical Knowledge Layer
 *
 * This is a small, versioned rule/knowledge layer, not a diagnostic engine.
 * Claims are intentionally conservative and include provenance so the UI/API
 * can explain where a rule came from.
 *
 * Primary source:
 * 2023 International Evidence-based Guideline for PCOS (International PCOS Network,
 * Monash University / ASRM / ESHRE / Endocrine Society collaborators).
 */

import { ScreeningAnswers } from '../types';

export type KnowledgeApplicability = 'adult' | 'adolescent' | 'all';

export interface ClinicalKnowledgeClaim {
  id: string;
  title: string;
  statement: string;
  applicability: KnowledgeApplicability;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
}

export interface ClinicalKnowledgeAssessment {
  population: 'adult' | 'adolescent' | 'unspecified';
  diagnosticFramework: string;
  relevantClaims: ClinicalKnowledgeClaim[];
  criteriaContext: {
    ovulatoryDysfunction: boolean;
    hyperandrogenismClinicalSignal: boolean;
    polycysticOvaryOrAmhReported: boolean;
    exclusionNeeded: boolean;
  };
  guardrails: string[];
  provenance: {
    guideline: string;
    version: string;
    sourceUrl: string;
  };
}

const SOURCE = {
  name: '2023 International Evidence-based Guideline for PCOS',
  version: '2023 International PCOS Guideline',
  url: 'https://www.monash.edu/medicine/mchri/pcos/guideline',
};

const CLAIMS: ClinicalKnowledgeClaim[] = [
  {
    id: 'adult-two-of-three',
    title: 'Adult diagnostic framework',
    statement: 'In adults, PCOS diagnosis is based on two of three domains—ovulatory dysfunction, clinical/biochemical hyperandrogenism, and polycystic ovaries (or AMH as an alternative marker of polycystic ovarian morphology)—after excluding other relevant causes.',
    applicability: 'adult',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
  {
    id: 'adult-irregular-plus-hyperandrogen',
    title: 'When irregular cycles and hyperandrogenism are present',
    statement: 'In adults with both irregular menstrual cycles and hyperandrogenism, ultrasound or AMH is not required to establish the diagnostic framework.',
    applicability: 'adult',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
  {
    id: 'amh-not-single-test',
    title: 'AMH is not a standalone diagnostic test',
    statement: 'AMH should not be used as a single test to diagnose PCOS.',
    applicability: 'adult',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
  {
    id: 'adolescent-two-features',
    title: 'Adolescent diagnostic framework',
    statement: 'In adolescents, both ovulatory dysfunction and clinical/biochemical hyperandrogenism are required for diagnosis after excluding other disorders that can mimic PCOS.',
    applicability: 'adolescent',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
  {
    id: 'adolescent-no-ultrasound-amh',
    title: 'Adolescent imaging/AMH guardrail',
    statement: 'Pelvic ultrasound for polycystic ovarian morphology and AMH should not be used to diagnose PCOS during adolescence because of limited specificity.',
    applicability: 'adolescent',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
  {
    id: 'insulin-resistance-not-routine-diagnostic-test',
    title: 'Insulin resistance testing limitation',
    statement: 'Routine clinical measurement of insulin resistance is not recommended as a diagnostic test for PCOS because commonly available measures are inaccurate.',
    applicability: 'all',
    sourceName: SOURCE.name,
    sourceUrl: SOURCE.url,
    sourceVersion: SOURCE.version,
  },
];

function getPopulation(answers: ScreeningAnswers): ClinicalKnowledgeAssessment['population'] {
  const age = answers.basicProfile?.age;
  if (typeof age !== 'number' || !Number.isFinite(age) || age <= 0) return 'unspecified';
  return age < 18 ? 'adolescent' : 'adult';
}

export function assessClinicalKnowledge(answers: ScreeningAnswers): ClinicalKnowledgeAssessment {
  const population = getPopulation(answers);
  const cycleIrregular = answers.cycleRegularity !== 'regular_21_35' || answers.periodSkippingFrequency !== 'never';
  const clinicalHyperandrogenism =
    answers.increasedFacialHair !== 'none' ||
    answers.increasedBodyHair !== 'none' ||
    answers.persistentAcne === 'persistent_adult_cystic' ||
    answers.scalpHairThinning === 'noticeable_crown_thinning';
  const polycysticOrAmh = answers.previousPelvicUltrasound === 'polyfollicular_cysts_seen';

  const relevantClaims = CLAIMS.filter((claim) => claim.applicability === 'all' || claim.applicability === population);
  const guardrails: string[] = [
    'StreeSure provides screening support and education; it does not establish a diagnosis.',
    'A screening score must not be treated as a substitute for clinical assessment or exclusion of other causes.',
    'Hormone medicines and other medical conditions can change the interpretation of menstrual or androgen-related features.',
  ];

  if (population === 'adolescent') {
    guardrails.push('For adolescents, do not use ultrasound morphology or AMH as the diagnostic basis in this software workflow.');
  }
  if (population === 'unspecified') {
    guardrails.push('Age was not available, so age-specific diagnostic guidance is intentionally not applied.');
  }

  return {
    population,
    diagnosticFramework: population === 'adolescent'
      ? 'Adolescent framework: ovulatory dysfunction + clinical/biochemical hyperandrogenism, with exclusion of mimicking disorders.'
      : population === 'adult'
        ? 'Adult framework: two of three domains may support diagnosis after exclusion of other causes; StreeSure only screens for patterns and does not diagnose.'
        : 'Age-specific diagnostic framework cannot be selected until age is known.',
    relevantClaims,
    criteriaContext: {
      ovulatoryDysfunction: cycleIrregular,
      hyperandrogenismClinicalSignal: clinicalHyperandrogenism,
      polycysticOvaryOrAmhReported: polycysticOrAmh,
      exclusionNeeded: true,
    },
    guardrails,
    provenance: {
      guideline: SOURCE.name,
      version: SOURCE.version,
      sourceUrl: SOURCE.url,
    },
  };
}
