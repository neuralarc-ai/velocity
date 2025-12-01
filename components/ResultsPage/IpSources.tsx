'use client';

import { PipelineResult } from '@/lib/models';
import { RiBarChartLine } from 'react-icons/ri';
import { formatPercentage } from '@/lib/utils';

interface IpSourcesProps {
  result: PipelineResult;
}

export default function IpSources({ result }: IpSourcesProps) {
  const ipAttributions = result.results?.initial_attribution?.ip_attributions;

  if (!ipAttributions) {
    return <div>No IP source data available.</div>;
  }

  const entries = Object.entries(ipAttributions);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RiBarChartLine className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">IP Sources</h3>
      </div>

      {/* Metrics Cards */}
      <div className={`grid gap-4 ${
        entries.length === 1 ? 'grid-cols-1' :
        entries.length === 2 ? 'grid-cols-2' :
        entries.length === 3 ? 'grid-cols-3' :
        'grid-cols-3'
      }`}>
        {entries.map(([source, value]) => {
          const percentage = formatPercentage(Number(value));
          return (
            <div key={source} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{percentage}%</div>
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                <RiBarChartLine className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-600">{source}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
