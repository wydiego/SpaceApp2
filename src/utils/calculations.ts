import { AsteroidParams, ImpactMetrics, MitigationStrategy, DeflectionResult } from '../types/asteroid';

const ASTEROID_DENSITY = 3000;
const EARTH_RADIUS = 6371;

export function calculateImpact(params: AsteroidParams, isOcean: boolean): ImpactMetrics {
  const radius = params.diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * ASTEROID_DENSITY;

  const velocityMs = params.velocity * 1000;
  const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
  const energyMegatons = kineticEnergy / (4.184 * Math.pow(10, 15));

  const craterDiameter = Math.pow(energyMegatons, 0.25) * 1.8;

  const seismicMagnitude = 0.67 * Math.log10(energyMegatons) + 5.87;

  const damageRadius = Math.pow(energyMegatons, 0.33) * 50;
  const affectedArea = Math.PI * Math.pow(damageRadius, 2);
  const averagePopulationDensity = 58;
  const affectedPopulation = Math.floor(affectedArea * averagePopulationDensity);

  const tsunamiRisk = isOcean && params.diameter > 200;
  const tsunamiHeight = tsunamiRisk ? Math.pow(energyMegatons, 0.2) * 15 : undefined;

  return {
    energy: Math.round(energyMegatons * 100) / 100,
    craterDiameter: Math.round(craterDiameter * 10) / 10,
    seismicMagnitude: Math.round(seismicMagnitude * 10) / 10,
    affectedPopulation,
    tsunamiRisk,
    tsunamiHeight: tsunamiHeight ? Math.round(tsunamiHeight * 10) / 10 : undefined
  };
}

export function simulateDeflection(
  params: AsteroidParams,
  strategy: MitigationStrategy
): DeflectionResult {
  const mass = (4 / 3) * Math.PI * Math.pow(params.diameter / 2, 3) * ASTEROID_DENSITY;

  let deflectionAngle = 0;
  let successProbability = 0;

  if (strategy.type === 'kinetic') {
    const impactorMass = 500;
    const impactorVelocity = 10000;
    const momentumTransfer = impactorMass * impactorVelocity;
    const velocityChange = momentumTransfer / mass;

    const timeToImpact = strategy.interventionTime * 365 * 24 * 3600;
    const distance = params.velocity * 1000 * timeToImpact;

    deflectionAngle = Math.atan(velocityChange * timeToImpact / distance) * (180 / Math.PI);

    successProbability = Math.min(0.95, strategy.interventionTime * 0.15);
  } else {
    const gravitationalAcceleration = 0.0001;
    const timeToImpact = strategy.interventionTime * 365 * 24 * 3600;
    const velocityChange = gravitationalAcceleration * timeToImpact;

    const distance = params.velocity * 1000 * timeToImpact;
    deflectionAngle = Math.atan(velocityChange * timeToImpact / distance) * (180 / Math.PI);

    successProbability = Math.min(0.98, strategy.interventionTime * 0.09);
  }

  const missDistance = 2 * EARTH_RADIUS * Math.sin(deflectionAngle * Math.PI / 180);
  const success = Math.random() < successProbability && missDistance > EARTH_RADIUS;

  return {
    success,
    deflectionAngle: Math.round(deflectionAngle * 1000) / 1000,
    newTrajectory: success ? 'Safe flyby' : 'Insufficient deflection',
    missDistance: Math.round(missDistance)
  };
}

export function isOceanLocation(lat: number, lng: number): boolean {
  const oceanRegions = [
    { minLat: -90, maxLat: 90, minLng: -180, maxLng: -30 },
    { minLat: -90, maxLat: 90, minLng: 30, maxLng: 180 },
    { minLat: -60, maxLat: -30, minLng: -30, maxLng: 30 },
  ];

  return oceanRegions.some(region =>
    lat >= region.minLat && lat <= region.maxLat &&
    lng >= region.minLng && lng <= region.maxLng
  );
}
