/**
 * Services Export
 * 
 * Central export point for all business logic services
 */

export { licenseService } from './licenseService';
export { vehicleService } from './vehicleService';
export { violationService } from './violationService';

// Re-export all individual functions for convenience
export * from './licenseService';
export * from './vehicleService';
export * from './violationService';

// Default export with all services
export default {
  license: require('./licenseService').licenseService,
  vehicle: require('./vehicleService').vehicleService,
  violation: require('./violationService').violationService,
};
