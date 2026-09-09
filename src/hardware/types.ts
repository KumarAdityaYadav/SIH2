export type MeasurementParameter =
  | 'GLUCOSE'
  | 'TRIGLYCERIDES'
  | 'TOTAL_CHOLESTEROL'
  | 'HDL'
  | 'LDL';

export type MeasurementSource = 'MANUAL' | 'LAB_REPORT' | 'DEVICE' | 'DEMO';

export type MeasurementQuality = 'VALID' | 'INVALID' | 'QUALITY_WARNING';

export type FastingStatus = 'FASTING' | 'NON_FASTING' | 'UNKNOWN';

export type HardwareStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'MEASURING'
  | 'COMPLETED'
  | 'ERROR';

export interface HardwareMeasurement {
  measurementId: string;
  sessionId: string;
  parameter: MeasurementParameter;
  value: number;
  unit: 'mg/dL';
  timestamp: string;
  source: 'DEVICE' | 'DEMO';
  deviceId?: string;
  firmwareVersion?: string;
  qualityStatus: MeasurementQuality;
  fastingStatus: FastingStatus;
  errorMessage?: string;
}

export interface MetabolicEntry {
  value?: number;
  unit: 'mg/dL' | 'mmHg' | 'cm';
  source: MeasurementSource;
  fastingStatus?: FastingStatus;
  timestamp?: string;
  qualityStatus?: MeasurementQuality;
  deviceId?: string;
  isMeasured: boolean;
}

export interface HardwareMeasurementProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<HardwareStatus>;
  startMeasurement(parameter: MeasurementParameter): Promise<void>;
  readMeasurement(parameter?: MeasurementParameter): Promise<HardwareMeasurement>;
  readAllAvailableMeasurements(): Promise<HardwareMeasurement[]>;
}
