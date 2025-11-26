import { PipelineResult } from '@/lib/models';

interface IpSourcesProps {
  result: PipelineResult;
}

export default function IpSources({ result }: IpSourcesProps) {
  const ipAttributions = result.results?.initial_attribution?.ip_attributions;

  if (!ipAttributions) {
    return <div>No IP source data available.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">IP Sources</h3>
      <div className="space-y-2 text-sm">
        {Object.entries(ipAttributions).map(([source, value]) => (
          <div key={source} className="flex justify-between">
            <span className="text-gray-600">{source}:</span>
            <span className="font-medium text-gray-900">{(Number(value) * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
