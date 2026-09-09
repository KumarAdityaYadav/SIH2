import {
  HardwareMeasurement,
  MeasurementParameter,
  MeasurementQuality,
} from './types';

export interface ParameterRangeConfig {
  param: MeasurementParameter;
  minPlausible: number;
  maxPlausible: number;
  unit: 'mg/dL';
  normalRangeLabel: string;
  warningLow?: number;
  warningHigh?: number;
}

export const PARAMETER_CONFIGS: Record<MeasurementParameter, ParameterRangeConfig> = {
  GLUCOSE: {
    param: 'GLUCOSE',
    minPlausible: 40,
    maxPlausible: 500,
    unit: 'mg/dL',
    normalRangeLabel: '70 - 99 mg/dL (Fasting) / <140 mg/dL (Random)',
    warningLow: 60,
    warningHigh: 125,
  },
  TRIGLYCERIDES: {
    param: 'TRIGLYCERIDES',
    minPlausible: 30,
    maxPlausible: 1000,
    unit: 'mg/dL',
    normalRangeLabel: '<150 mg/dL',
    warningHigh: 150,
  },
  TOTAL_CHOLESTEROL: {
    param: 'TOTAL_CHOLESTEROL',
    minPlausible: 50,
    maxPlausible: 600,
    unit: 'mg/dL',
    normalRangeLabel: '<200 mg/dL',
    warningHigh: 200,
  },
  HDL: {
    param: 'HDL',
    minPlausible: 10,
    maxPlausible: 150,
    unit: 'mg/dL',
    normalRangeLabel: '>50 mg/dL (Optimal for women)',
    warningLow: 45,
  },
  LDL: {
    param: 'LDL',
    minPlausible: 20,
    maxPlausible: 400,
    unit: 'mg/dL',
    normalRangeLabel: '<100 mg/dL',
    warningHigh: 130,
  },
};

export interface ValidationResult {
  isValid: boolean;
  qualityStatus: MeasurementQuality;
  message?: string;
}

export function validateMeasurement(
  measurement: Partial<HardwareMeasurement>
): ValidationResult {
  if (!measurement.parameter || !PARAMETER_CONFIGS[measurement.parameter]) {
    return {
      isValid: false,
      qualityStatus: 'INVALID',
      message: 'Measurement parameter could not be identified.',
    };
  }

  const config = PARAMETER_CONFIGS[measurement.parameter];

  if (typeof measurement.value !== 'number' || isNaN(measurement.value)) {
    return {
      isValid: false,
      qualityStatus: 'INVALID',
      message: 'Measurement could not be validated. Numeric value missing.',
    };
  }

  if (
    measurement.value < config.minPlausible ||
    measurement.value > config.maxPlausible
  ) {
    return {
      isValid: false,
      qualityStatus: 'INVALID',
      message: `Measurement value (${measurement.value} ${measurement.unit || 'mg/dL'}) is outside physiological plausible range (${config.minPlausible}-${config.maxPlausible} mg/dL). Please repeat the measurement.`,
    };
  }

  if (measurement.qualityStatus === 'QUALITY_WARNING') {
    return {
      isValid: true,
      qualityStatus: 'QUALITY_WARNING',
      message: 'Measurement quality has minor sensor variance warning.',
    };
  }

  if (measurement.qualityStatus === 'INVALID') {
    return {
      isValid: false,
      qualityStatus: 'INVALID',
      message: 'Measurement quality is insufficient. Please repeat the measurement.',
    };
  }

  return {
    isValid: true,
    qualityStatus: 'VALID',
  };
}

export function validateManualMetabolicInput(
  parameter: MeasurementParameter,
  value: number
): ValidationResult {
  const config = PARAMETER_CONFIGS[parameter];
  if (!config) {
    return { isValid: false, qualityStatus: 'INVALID', message: 'Unknown parameter' };
  }

  if (isNaN(value) || value <= 0) {
    return { isValid: false, qualityStatus: 'INVALID', message: 'Please enter a positive numeric value.' };
  }

  if (value < config.minPlausible || value > config.maxPlausible) {
    return {
      isValid: false,
      qualityStatus: 'INVALID',
      message: `Value must be between ${config.minPlausible} and ${config.maxPlausible} mg/dL.`,
    };
  }

  return {
    isValid: true,
    qualityStatus: 'VALID',
  };
}
