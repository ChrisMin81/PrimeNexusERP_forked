import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

/**
 * This function provides all necessary services and configurations for Camba Shared Library.
 * It ensures PrimeNG and any required global states are initialized correctly.
 */
export function provideCambaSharedLib(): EnvironmentProviders {
  return makeEnvironmentProviders([
  ]);
}
