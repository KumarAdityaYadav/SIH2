import { DemoHardwareAdapter } from './demoHardwareAdapter';
import { WebBluetoothHardwareAdapter, isWebBluetoothSupported } from './webBluetoothAdapter';
import { HardwareMeasurementProvider } from './types';

let activeProvider: HardwareMeasurementProvider | null = null;

export function getHardwareProvider(mode: 'auto' | 'bluetooth' | 'demo' = 'auto'): HardwareMeasurementProvider {
  if (activeProvider) return activeProvider;

  const envMode = ((import.meta as any).env?.VITE_STREESURE_HARDWARE_MODE || mode) as string;
  if (envMode === 'demo') activeProvider = new DemoHardwareAdapter();
  else if (envMode === 'bluetooth' || (envMode === 'auto' && isWebBluetoothSupported())) {
    activeProvider = new WebBluetoothHardwareAdapter();
  } else {
    activeProvider = new DemoHardwareAdapter();
  }
  return activeProvider;
}

export function resetHardwareProvider(): void {
  activeProvider = null;
}

export * from './types';
export * from './validation';
export * from './demoHardwareAdapter';
export * from './webBluetoothAdapter';
