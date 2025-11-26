import { PipelineResult } from '@/lib/models';

interface SafetyChecksProps {
  result: PipelineResult;
}

export default function SafetyChecks({ result }: SafetyChecksProps) {
  const safetyData = result.results?.post_gen_safety;

  if (!safetyData) {
    return <div>No safety check data available.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Post-Generation Safety Checks</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Passed:</span>
          <span className={`font-medium ${safetyData.passed ? 'text-green-600' : 'text-red-600'}`}>
            {safetyData.passed ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Contamination Score:</span>
          <span className="font-medium text-gray-900">
            {(safetyData.contamination_score * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
