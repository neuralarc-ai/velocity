'use client';

import { PipelineResult } from '@/lib/models';
import { RiCheckboxCircleLine, RiAlertLine } from 'react-icons/ri';

interface SafetyChecksProps {
  result: PipelineResult;
}

export default function SafetyChecks({ result }: SafetyChecksProps) {
  const safetyData = result.results?.post_gen_safety;

  if (!safetyData) {
    return <div>No safety check data available.</div>;
  }

  const contaminationScore = (safetyData.contamination_score * 100).toFixed(2);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RiCheckboxCircleLine className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Post-Generation Safety Checks</h3>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className={`text-3xl font-bold mb-1 ${safetyData.passed ? 'text-green-600' : 'text-red-600'}`}>
            {safetyData.passed ? 'Yes' : 'No'}
          </div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiCheckboxCircleLine className={`w-4 h-4 ${safetyData.passed ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <p className="text-xs text-gray-600">Passed</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{contaminationScore}%</div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiAlertLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Contamination Score</p>
        </div>
      </div>
    </div>
  );
}
