import { AsteroidParams, PreDefinedAsteroid } from '../types/asteroid';
import { Rocket, Gauge, Compass } from 'lucide-react';

interface ParametersPanelProps {
  params: AsteroidParams;
  onParamsChange: (params: AsteroidParams) => void;
  preDefinedAsteroids: PreDefinedAsteroid[];
  onSelectPreDefined: (asteroid: PreDefinedAsteroid) => void;
}

export default function ParametersPanel({
  params,
  onParamsChange,
  preDefinedAsteroids,
  onSelectPreDefined
}: ParametersPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Asteroid Parameters
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Pre-defined Asteroids
            </label>
            <select
              className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              onChange={(e) => {
                const asteroid = preDefinedAsteroids[parseInt(e.target.value)];
                if (asteroid) onSelectPreDefined(asteroid);
              }}
              defaultValue=""
            >
              <option value="">Custom Parameters</option>
              {preDefinedAsteroids.map((asteroid, idx) => (
                <option key={asteroid.name} value={idx}>
                  {asteroid.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Diameter
              </label>
              <span className="text-cyan-400 font-mono font-semibold">
                {params.diameter}m
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="10"
              value={params.diameter}
              onChange={(e) =>
                onParamsChange({ ...params, diameter: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100m</span>
              <span>1000m</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">Velocity</label>
              <span className="text-cyan-400 font-mono font-semibold">
                {params.velocity} km/s
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="1"
              value={params.velocity}
              onChange={(e) =>
                onParamsChange({ ...params, velocity: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10 km/s</span>
              <span>70 km/s</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Impact Angle
              </label>
              <span className="text-cyan-400 font-mono font-semibold">
                {params.impactAngle}°
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="1"
              value={params.impactAngle}
              onChange={(e) =>
                onParamsChange({ ...params, impactAngle: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>15°</span>
              <span>90°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
