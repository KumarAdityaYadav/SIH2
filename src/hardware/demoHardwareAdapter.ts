import {
  HardwareMeasurement,
  HardwareMeasurementProvider,
  HardwareStatus,
  MeasurementParameter,
} from './types';
import { validateMeasurement } from './validation';

export class DemoHardwareAdapter implements HardwareMeasurementProvider {
  private status: HardwareStatus = 'DISCONNECTED';
  private sessionId: string = '';
  private deviceId: string = 'STREESURE-PROTOTYPE-01';
  private firmwareVersion: string = 'v2.4-MVP';

  // Deterministic demonstration values for the StreeSure screening prototype
  private static readonly DETERMINISTIC_MEASUREMENTS: Record<
    MeasurementParameter,
    { value: number; fastingStatus: 'FASTING' | 'NON_FASTING' | 'UNKNOWN' }
  > = {
    GLUCOSE: { value: 112, fastingStatus: 'FASTING' },
    TRIGLYCERIDES: { value: 168, fastingStatus: 'FASTING' },
    TOTAL_CHOLESTEROL: { value: 208, fastingStatus: 'FASTING' },
    HDL: { value: 44, fastingStatus: 'FASTING' },
    LDL: { value: 130, fastingStatus: 'FASTING' },
  };

  async connect(): Promise<void> {
    this.status = 'CONNECTING';
    // Simulate brief optical/BLE connection handshake
    await new Promise((resolve) => setTimeout(resolve, 800));
    this.sessionId = 'hw_sess_' + Math.random().toString(36).substring(2, 9);
    this.status = 'CONNECTED';
  }

  async disconnect(): Promise<void> {
    this.status = 'DISCONNECTED';
    this.sessionId = '';
  }

  async getStatus(): Promise<HardwareStatus> {
    return this.status;
  }

  async startMeasurement(parameter: MeasurementParameter): Promise<void> {
    if (this.status !== 'CONNECTED' && this.status !== 'COMPLETED') {
      throw new Error('Device must be connected before starting a measurement.');
    }
    this.status = 'MEASURING';
    // Brief hardware bio-sensing duration
    await new Promise((resolve) => setTimeout(resolve, 600));
    this.status = 'CONNECTED';
  }

  async readMeasurement(
    parameter: MeasurementParameter = 'GLUCOSE'
  ): Promise<HardwareMeasurement> {
    const data = DemoHardwareAdapter.DETERMINISTIC_MEASUREMENTS[parameter];
    const measurement: HardwareMeasurement = {
      measurementId: 'm_' + Math.random().toString(36).substring(2, 9),
      sessionId: this.sessionId || 'hw_sess_demo',
      parameter,
      value: data.value,
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      source: 'DEMO',
      deviceId: this.deviceId,
      firmwareVersion: this.firmwareVersion,
      qualityStatus: 'VALID',
      fastingStatus: data.fastingStatus,
    };

    const validation = validateMeasurement(measurement);
    if (!validation.isValid) {
      measurement.qualityStatus = 'INVALID';
      measurement.errorMessage = validation.message;
    }

    return measurement;
  }

  async readAllAvailableMeasurements(): Promise<HardwareMeasurement[]> {
    this.status = 'MEASURING';
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.status = 'COMPLETED';

    const params: MeasurementParameter[] = [
      'GLUCOSE',
      'TRIGLYCERIDES',
      'TOTAL_CHOLESTEROL',
      'HDL',
      'LDL',
    ];

    const measurements: HardwareMeasurement[] = [];

    for (const param of params) {
      const data = DemoHardwareAdapter.DETERMINISTIC_MEASUREMENTS[param];
      const m: HardwareMeasurement = {
        measurementId: 'm_' + Math.random().toString(36).substring(2, 9),
        sessionId: this.sessionId || 'hw_sess_demo',
        parameter: param,
        value: data.value,
        unit: 'mg/dL',
        timestamp: new Date().toISOString(),
        source: 'DEMO',
        deviceId: this.deviceId,
        firmwareVersion: this.firmwareVersion,
        qualityStatus: 'VALID',
        fastingStatus: data.fastingStatus,
      };

      const val = validateMeasurement(m);
      if (val.isValid) {
        measurements.push(m);
      }
    }

    return measurements;
  }
}
