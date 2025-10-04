import { useState, useEffect } from 'react';
import { Globe, Orbit, ChevronLeft, ChevronRight } from 'lucide-react';
import ImpactMap from './components/ImpactMap';
import ParametersPanel from './components/ParametersPanel';
import MetricsDisplay from './components/MetricsDisplay';
import MitigationPanel from './components/MitigationPanel';
import TrajectoryViewer from './components/TrajectoryViewer';
import {
  ImpactLocation,
  AsteroidParams,
  ImpactMetrics,
  PreDefinedAsteroid,
  MitigationStrategy,
  DeflectionResult
} from './types/asteroid';
import { calculateImpact, simulateDeflection, isOceanLocation } from './utils/calculations';

const preDefinedAsteroids: PreDefinedAsteroid[] = [
  { name: 'Apophis', diameter: 370, velocity: 30, angle: 45 },
  { name: 'Bennu', diameter: 490, velocity: 28, angle: 60 },
  { name: '2011 AG5', diameter: 140, velocity: 25, angle: 35 }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [impactLocation, setImpactLocation] = useState<ImpactLocation | null>(null);
  const [asteroidParams, setAsteroidParams] = useState<AsteroidParams>({
    diameter: 500,
    velocity: 20,
    impactAngle: 45
  });
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [trajectoryViewerOpen, setTrajectoryViewerOpen] = useState(false);
  const [showDeflection, setShowDeflection] = useState(false);

  useEffect(() => {
    if (impactLocation) {
      setIsCalculating(true);
      setTimeout(() => {
        const isOcean = isOceanLocation(impactLocation.lat, impactLocation.lng);
        const calculatedMetrics = calculateImpact(asteroidParams, isOcean);
        setMetrics(calculatedMetrics);
        setIsCalculating(false);
      }, 800);
    }
  }, [impactLocation, asteroidParams]);

  const handleSelectPreDefined = (asteroid: PreDefinedAsteroid) => {
    setAsteroidParams({
      diameter: asteroid.diameter,
      velocity: asteroid.velocity,
      impactAngle: asteroid.angle
    });
  };

  const handleSimulateDeflection = (strategy: MitigationStrategy): DeflectionResult => {
    const result = simulateDeflection(asteroidParams, strategy);
    setShowDeflection(result.success);
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI1MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjc3RhcnMpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 h-screen flex flex-col">
        <header className="bg-black/60 backdrop-blur-sm border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/50">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    ASTEROID IMPACT SIMULATOR
                  </h1>
                  <p className="text-sm text-gray-400">
                    Defending Earth from Impactor-2025
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrajectoryViewerOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                <Orbit className="w-5 h-5" />
                View 3D Trajectory
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside
            className={`bg-black/40 backdrop-blur-sm border-r border-cyan-500/30 transition-all duration-300 ${
              sidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden`}
          >
            <div className="h-full overflow-y-auto p-6 space-y-6">
              <ParametersPanel
                params={asteroidParams}
                onParamsChange={setAsteroidParams}
                preDefinedAsteroids={preDefinedAsteroids}
                onSelectPreDefined={handleSelectPreDefined}
              />

              <div className="border-t border-cyan-500/20 pt-6">
                <MitigationPanel
                  asteroidParams={asteroidParams}
                  onSimulate={handleSimulateDeflection}
                />
              </div>
            </div>
          </aside>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-cyan-600 hover:bg-cyan-500 p-2 rounded-r-lg transition-all duration-300 shadow-lg"
            style={{ left: sidebarOpen ? '320px' : '0' }}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4">
              <ImpactMap
                onLocationSelect={setImpactLocation}
                impactLocation={impactLocation}
                metrics={metrics}
              />
            </div>

            <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/30">
              <MetricsDisplay metrics={metrics} isCalculating={isCalculating} />
            </div>
          </main>
        </div>
      </div>

      <TrajectoryViewer
        isOpen={trajectoryViewerOpen}
        onClose={() => setTrajectoryViewerOpen(false)}
        showDeflection={showDeflection}
      />
    </div>
  );
}

export default App;
