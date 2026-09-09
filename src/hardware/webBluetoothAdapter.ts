import {
  HardwareMeasurement,
  HardwareMeasurementProvider,
  HardwareStatus,
  MeasurementParameter,
} from './types';
import { validateMeasurement } from './validation';

const DEFAULT_SERVICE_UUID = '7f4f0001-8b8f-4a6a-9a8a-5f5e8a9a1001';
const DEFAULT_CHARACTERISTIC_UUID = '7f4f0002-8b8f-4a6a-9a8a-5f5e8a9a1001';

interface BluetoothCharacteristicLike {
  readValue(): Promise<DataView>;
  startNotifications(): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
}

interface BluetoothDeviceLike {
  id: string;
  name?: string;
  gatt?: {
    connect(): Promise<{ getPrimaryService(uuid: string): Promise<{ getCharacteristic(uuid: string): Promise<BluetoothCharacteristicLike> }> }>;
  };
  addEventListener(type: string, listener: () => void): void;
}

function getConfig() {
  const env = (import.meta as any).env || {};
  return {
    serviceUuid: env.VITE_STREESURE_BLE_SERVICE_UUID || DEFAULT_SERVICE_UUID,
    characteristicUuid: env.VITE_STREESURE_BLE_CHARACTERISTIC_UUID || DEFAULT_CHARACTERISTIC_UUID,
  };
}

export function isWebBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

function decodePayload(view: DataView): unknown {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const text = new TextDecoder().decode(bytes).replace(/\0/g, '').trim();
  if (!text) throw new Error('The device returned an empty measurement payload.');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Unsupported device payload. Expected UTF-8 JSON.');
  }
}

const PARAMETER_ALIASES: Record<string, MeasurementParameter> = {
  glucose: 'GLUCOSE',
  glucose_mg_dl: 'GLUCOSE',
  triglycerides: 'TRIGLYCERIDES',
  triglycerides_mg_dl: 'TRIGLYCERIDES',
  total_cholesterol: 'TOTAL_CHOLESTEROL',
  cholesterol: 'TOTAL_CHOLESTEROL',
  hdl: 'HDL',
  ldl: 'LDL',
};

function normalizePayload(payload: any, sessionId: string, device: BluetoothDeviceLike): HardwareMeasurement[] {
  const rows = Array.isArray(payload?.measurements) ? payload.measurements : [payload];
  const results: HardwareMeasurement[] = [];

  for (const row of rows) {
    const rawParameter = String(row?.parameter || row?.type || '').toLowerCase();
    const parameter = PARAMETER_ALIASES[rawParameter];
    const value = Number(row?.value);
    if (!parameter || !Number.isFinite(value)) continue;

    const measurement: HardwareMeasurement = {
      measurementId: String(row?.measurementId || `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`),
      sessionId,
      parameter,
      value,
      unit: 'mg/dL',
      timestamp: row?.timestamp || new Date().toISOString(),
      source: 'DEVICE',
      deviceId: device.id,
      firmwareVersion: row?.firmwareVersion,
      qualityStatus: row?.qualityStatus || 'VALID',
      fastingStatus: row?.fastingStatus || 'UNKNOWN',
    };

    const validation = validateMeasurement(measurement);
    if (!validation.isValid) {
      measurement.qualityStatus = 'INVALID';
      measurement.errorMessage = validation.message;
    }
    results.push(measurement);
  }

  return results;
}

export class WebBluetoothHardwareAdapter implements HardwareMeasurementProvider {
  private status: HardwareStatus = 'DISCONNECTED';
  private device: BluetoothDeviceLike | null = null;
  private characteristic: BluetoothCharacteristicLike | null = null;
  private sessionId = '';
  private bufferedMeasurements: HardwareMeasurement[] = [];

  async connect(): Promise<void> {
    if (!isWebBluetoothSupported()) {
      throw new Error('Web Bluetooth is not supported in this browser. Use Chrome/Edge on a compatible device, or use Demo mode.');
    }

    this.status = 'CONNECTING';
    const { serviceUuid, characteristicUuid } = getConfig();
    const bluetooth = (navigator as any).bluetooth;
    try {
      const device = await bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }],
        optionalServices: [serviceUuid],
      });
      this.device = device;
      if (!device.gatt) throw new Error('The selected Bluetooth device does not expose GATT.');
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUuid);
      this.characteristic = await service.getCharacteristic(characteristicUuid);
      this.sessionId = `hw_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      this.bufferedMeasurements = [];
      this.status = 'CONNECTED';
      device.addEventListener('gattserverdisconnected', () => {
        this.status = 'DISCONNECTED';
        this.characteristic = null;
      });
    } catch (error) {
      this.status = 'ERROR';
      throw error instanceof Error ? error : new Error('Bluetooth connection failed.');
    }
  }

  async disconnect(): Promise<void> {
    try {
      const gatt = this.device?.gatt as any;
      if (gatt?.disconnect) gatt.disconnect();
    } finally {
      this.status = 'DISCONNECTED';
      this.device = null;
      this.characteristic = null;
      this.sessionId = '';
      this.bufferedMeasurements = [];
    }
  }

  async getStatus(): Promise<HardwareStatus> {
    return this.status;
  }

  async startMeasurement(parameter: MeasurementParameter): Promise<void> {
    if (!this.characteristic || this.status !== 'CONNECTED') {
      throw new Error('Connect the StreeSure Smart Kit before measuring.');
    }
    this.status = 'MEASURING';
    // The prototype protocol is read-based: the hardware exposes the latest JSON payload.
    // A future firmware command channel can be added without changing the provider interface.
    await this.readMeasurement(parameter);
    this.status = 'CONNECTED';
  }

  async readMeasurement(parameter: MeasurementParameter = 'GLUCOSE'): Promise<HardwareMeasurement> {
    if (!this.characteristic || !this.device) {
      throw new Error('No StreeSure Smart Kit is connected.');
    }
    const value = await this.characteristic.readValue();
    const measurements = normalizePayload(decodePayload(value), this.sessionId, this.device)
      .filter((item) => item.parameter === parameter);
    if (!measurements.length) throw new Error(`The device payload did not contain ${parameter}.`);
    const measurement = measurements[0];
    this.bufferedMeasurements = [...this.bufferedMeasurements.filter((m) => m.parameter !== parameter), measurement];
    return measurement;
  }

  async readAllAvailableMeasurements(): Promise<HardwareMeasurement[]> {
    if (!this.characteristic || !this.device) {
      throw new Error('No StreeSure Smart Kit is connected.');
    }
    this.status = 'MEASURING';
    try {
      const value = await this.characteristic.readValue();
      const measurements = normalizePayload(decodePayload(value), this.sessionId, this.device)
        .filter((item) => item.qualityStatus !== 'INVALID');
      this.bufferedMeasurements = measurements;
      if (!measurements.length) throw new Error('No valid supported measurements were received from the device.');
      return measurements;
    } finally {
      this.status = 'COMPLETED';
    }
  }
}
