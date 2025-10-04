import { useState } from 'react';
import { MitigationStrategy, DeflectionResult, AsteroidParams } from '../types/asteroid';
import { Shield, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface MitigationPanelProps {
  asteroidParams: AsteroidParams;
  onSimulate: (strategy: MitigationStrategy) => DeflectionResult;
}

export default function MitigationPanel({ asteroidParams, onSimulate }: MitigationPanelProps) {
  const [strategyType, setStrategyType] = useState<'kinetic' | 'gravity'>('kinetic');
  const [interventionTime, setInterventionTime] = useState(5);
  const [result, setResult] = useState<DeflectionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const deflectionResult = onSimulate({
        type: strategyType,
        interventionTime
      });
      setResult(deflectionResult);
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Mitigation Strategy
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-black/40 border border-cyan-500/30 rounded-lg cursor-pointer hover:border-cyan-500/60 transition-colors">
              <input
                type="radio"
                name="strategy"
                value="kinetic"
                checked={strategyType === 'kinetic'}
                onChange={() => setStrategyType('kinetic')}
                className="w-4 h-4 text-cyan-500"
              />
              <div className="flex-1">
                <div className="text-white font-medium">Kinetic Impactor</div>
                <div className="text-sm text-gray-400">
                  High-speed spacecraft collision
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-black/40 border border-cyan-500/30 rounded-lg cursor-pointer hover:border-cyan-500/60 transition-colors">
              <input
                type="radio"
                name="strategy"
                value="gravity"
                checked={strategyType === 'gravity'}
                onChange={() => setStrategyType('gravity')}
                className="w-4 h-4 text-cyan-500"
              />
              <div className="flex-1">
                <div className="text-white font-medium">Gravity Tractor</div>
                <div className="text-sm text-gray-400">
                  Gradual gravitational deflection
                </div>
              </div>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Intervention Time
              </label>
              <span className="text-cyan-400 font-mono font-semibold">
                {interventionTime} years
              </span>
            </div>
            <input
              type="range"
              min={strategyType === 'kinetic' ? 1 : 5}
              max={strategyType === 'kinetic' ? 10 : 15}
              step="1"
              value={interventionTime}
              onChange={(e) => setInterventionTime(parseInt(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{strategyType === 'kinetic' ? '1' : '5'} years</span>
              <span>{strategyType === 'kinetic' ? '10' : '15'} years</span>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSimulating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Simulating...
              </span>
            ) : (
              'SIMULATE DEFLECTION'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`p-4 rounded-lg border-2 ${
            result.success
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-red-900/20 border-red-500/50'
          } animate-fadeIn`}
        >
          <div className="flex items-center gap-3 mb-3">
            {result.success ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
            <div>
              <h4
                className={`text-lg font-bold ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {result.success ? 'Mission Success!' : 'Mission Failed'}
              </h4>
              <p className="text-sm text-gray-300">{result.newTrajectory}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Deflection Angle:</span>
              <span className="text-white font-mono">{result.deflectionAngle}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Miss Distance:</span>
              <span className="text-white font-mono">
                {result.missDistance.toLocaleString()} km
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
