export interface ImpactLocation {
  lat: number;
  lng: number;
}

export interface AsteroidParams {
  diameter: number;
  velocity: number;
  impactAngle: number;
}

export interface ImpactMetrics {
  energy: number;
  craterDiameter: number;
  seismicMagnitude: number;
  affectedPopulation: number;
  tsunamiRisk: boolean;
  tsunamiHeight?: number;
}

export interface MitigationStrategy {
  type: 'kinetic' | 'gravity';
  interventionTime: number;
}

export interface DeflectionResult {
  success: boolean;
  deflectionAngle: number;
  newTrajectory: string;
  missDistance: number;
}

export interface PreDefinedAsteroid {
  name: string;
  diameter: number;
  velocity: number;
  angle: number;
}
