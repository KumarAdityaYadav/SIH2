import model from '../../ml/model.json';
import { ScreeningAnswers } from '../types';

type ModelInput = number[];

export interface MlScreeningSignal {
  probability: number;
  label: 'lower_screening_signal' | 'higher_screening_signal';
  threshold: number;
  modelVersion: string;
  featuresUsed: string[];
  disclaimer: string;
}

function encode(answers: ScreeningAnswers): ModelInput {
  const basic = answers.basicProfile;
  const bmi = Number.isFinite(basic?.bmi) && (basic?.bmi ?? 0) > 0
    ? Number(basic?.bmi)
    : Number.isFinite(basic?.heightCm) && Number(basic?.heightCm) > 0 && Number(basic?.weightKg) > 0
      ? Number(basic!.weightKg) / Math.pow(Number(basic!.heightCm) / 100, 2)
      : 25;

  return [
    answers.familyPcosHistory || basic?.familyHistoryPcos ? 1 : 0,
    bmi >= 25 || answers.unexplainedWeightGain !== 'none' ? 1 : 0,
    answers.cycleRegularity === 'regular_21_35' ? 0 : 1,
    answers.unexplainedWeightGain === 'significant_difficulty_losing' ? 1 : answers.unexplainedWeightGain === 'moderate' ? 0.5 : 0,
    answers.increasedFacialHair === 'moderate_to_severe' || answers.increasedFacialHair === 'mild' ? 1 : 0,
    answers.increasedBodyHair === 'moderate_to_severe' || answers.increasedBodyHair === 'mild' ? 1 : 0,
    0,
    answers.persistentAcne !== 'none' ? 1 : 0,
    answers.persistentAcne === 'persistent_adult_cystic' ? 1 : 0,
    answers.scalpHairThinning !== 'none' ? 1 : 0,
    Math.max(0, Number(basic?.weightKg) || 0),
    Math.max(0, Number(basic?.heightCm) / 100 || 0),
    bmi,
  ];
}

export function predictPcosRisk(answers: ScreeningAnswers): MlScreeningSignal {
  const x = encode(answers);
  const z = x.reduce((sum, value, i) => {
    const scale = Number(model.scale[i]) || 1;
    return sum + ((value - Number(model.mean[i])) / scale) * Number(model.coefficients[i]);
  }, Number(model.intercept));
  const probability = 1 / (1 + Math.exp(-Math.max(-35, Math.min(35, z))));

  return {
    probability,
    label: probability >= Number(model.threshold) ? 'higher_screening_signal' : 'lower_screening_signal',
    threshold: Number(model.threshold),
    modelVersion: String(model.modelVersion),
    featuresUsed: ['family history', 'BMI/overweight context', 'cycle regularity', 'weight change', 'facial/body hair', 'acne', 'hair loss', 'weight', 'height', 'BMI'],
    disclaimer: 'Model output is a screening-support signal from a retrospective research dataset. It does not diagnose or rule out PCOS.',
  };
}
