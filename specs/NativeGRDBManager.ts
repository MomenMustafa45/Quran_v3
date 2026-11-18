// specs/NativeGRDBManager.ts
import type { CodegenTypes, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// UnsafeObject maps to ReadableMap (Android) / NSDictionary (iOS), same as the
// previous `Object`, so the generated native signatures are unchanged.
// Callers narrow these with concrete types (see src/database/connection.ts).
export interface Spec extends TurboModule {
  openDatabase(): Promise<boolean>;
  closeDatabase(): Promise<boolean>;
  isDatabaseOpen(): Promise<boolean>;
  executeQuery(
    query: string,
    parameters: CodegenTypes.UnsafeObject,
  ): Promise<CodegenTypes.UnsafeObject>;
  executeRawQuery(query: string): Promise<CodegenTypes.UnsafeObject>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GRDBManager');
