import { ImpactMetrics } from '../types/asteroid';
import { Zap, Target, Activity, Users, Waves } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: ImpactMetrics | null;
  isCalculating: boolean;
}

export default function MetricsDisplay({ metrics, isCalculating }: MetricsDisplayProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select an impact location on the map to calculate metrics
      </div>
    );
  }

  const metricCards = [
    {
      icon: Zap,
      label: 'Impact Energy',
      value: metrics.energy.toLocaleString(),
      unit: 'MT TNT',
      color: 'text-red-400'
    },
    {
      icon: Target,
      label: 'Crater Diameter',
      value: metrics.craterDiameter,
      unit: 'km',
      color: 'text-orange-400'
    },
    {
      icon: Activity,
      label: 'Seismic Magnitude',
      value: metrics.seismicMagnitude,
      unit: 'Richter',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      label: 'Affected Population',
      value: metrics.affectedPopulation.toLocaleString(),
      unit: 'people',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {metricCards.map((metric) => (
        <div
          key={metric.label}
          className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className={`w-5 h-5 ${metric.color}`} />
            <h4 className="text-xs text-gray-400 uppercase tracking-wider">
              {metric.label}
            </h4>
          </div>
          <div className={`text-2xl font-bold ${metric.color} font-mono`}>
            {metric.value}
          </div>
          <div className="text-xs text-gray-500 mt-1">{metric.unit}</div>
        </div>
      ))}

      {metrics.tsunamiRisk && (
        <div className="col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-sm border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Waves className="w-6 h-6 text-blue-400" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                Tsunami Warning
              </h4>
              <p className="text-white text-lg font-bold">
                Expected height: {metrics.tsunamiHeight}m
              </p>
              <p className="text-blue-300 text-sm mt-1">
                Coastal areas within 500km at severe risk
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
