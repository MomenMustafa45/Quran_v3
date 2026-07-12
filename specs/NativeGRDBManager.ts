// specs/NativeGRDBManager.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  openDatabase(): Promise<boolean>;
  closeDatabase(): Promise<boolean>;
  isDatabaseOpen(): Promise<boolean>;
  executeQuery(query: string, parameters: Object): Promise<Object>;
  executeRawQuery(query: string): Promise<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GRDBManager');
