'use client';

import { RiAlertLine, RiCheckboxCircleLine, RiShieldCheckLine } from 'react-icons/ri';

interface ContaminationReportProps {
  contamination: number;
  licensed: number;
  threshold: number;
}

export default function ContaminationReport({
  contamination,
  licensed,
  threshold,
}: ContaminationReportProps) {
  const passed = contamination < threshold;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RiAlertLine className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Contamination Analysis Report</h3>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{contamination}%</div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiAlertLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Model Contamination</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{licensed}%</div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiCheckboxCircleLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Licensed Content</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <button className="w-full mb-2 px-3 py-2 bg-black text-white rounded text-sm font-medium">
            {passed ? 'Passed' : 'Failed'}
          </button>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiShieldCheckLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Threshold Check</p>
        </div>
      </div>

      {/* Detection Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detection Summary</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <RiCheckboxCircleLine className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">
              Contamination level within acceptable threshold (&lt; {threshold}%)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <RiCheckboxCircleLine className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">No unlicensed IP detected in output</p>
          </div>
          <div className="flex items-start gap-2">
            <RiCheckboxCircleLine className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">Model influence properly tracked and documented</p>
          </div>
          <div className="flex items-start gap-2">
            <RiAlertLine className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">Minimal training data influence from base model</p>
          </div>
        </div>
      </div>
    </div>
  );
}

