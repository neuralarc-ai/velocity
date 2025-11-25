'use client';

import { PipelineResult } from '@/lib/models';
import { RiCheckboxCircleLine, RiErrorWarningLine, RiBarChartLine, RiShieldCheckLine, RiVideoLine, RiSearchLine } from 'react-icons/ri';

interface ResultsDisplayProps {
  result: PipelineResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { status, results, total_duration_ms, error } = result;

  if (status === 'failed') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiErrorWarningLine className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Execution Failed</h2>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-red-800 font-medium mb-2">Error:</p>
          <p className="text-red-700">{error || 'Unknown error occurred'}</p>
        </div>
        {result.completed_steps.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Completed steps: {result.completed_steps.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiCheckboxCircleLine className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">Execution Summary</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold text-green-600">Success</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {total_duration_ms ? `${(total_duration_ms / 1000).toFixed(2)}s` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Steps Completed</p>
            <p className="text-lg font-semibold text-gray-900">{result.completed_steps.length}/10</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Execution ID</p>
            <p className="text-sm font-mono text-gray-700 truncate">{result.execution_id}</p>
          </div>
        </div>
      </div>

      {/* Initial Attribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiBarChartLine className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900">Initial Attribution</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Score</span>
            <span className="text-lg font-semibold text-gray-900">
              {(results.initial_attribution.total_score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Confidence</span>
            <span className="text-lg font-semibold text-gray-900">
              {(results.initial_attribution.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">IP Attributions:</p>
            <div className="space-y-1">
              {Object.entries(results.initial_attribution.ip_attributions).map(([owner, score]) => (
                <div key={owner} className="flex justify-between text-sm">
                  <span className="text-gray-600">{owner}</span>
                  <span className="font-medium text-gray-900">{(Number(score) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Checks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiShieldCheckLine className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Safety Checks</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Pre-Generation</span>
              <span
                className={`text-sm font-semibold ${
                  results.pre_gen_safety.passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {results.pre_gen_safety.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            {results.pre_gen_safety.violations.length > 0 && (
              <p className="text-xs text-red-600">
                Violations: {results.pre_gen_safety.violations.join(', ')}
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Post-Generation</span>
              <span
                className={`text-sm font-semibold ${
                  results.post_gen_safety.passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {results.post_gen_safety.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Contamination Score</span>
              <span>{(results.post_gen_safety.contamination_score * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Attribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiBarChartLine className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900">Final Attribution</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Score</span>
            <span className="text-lg font-semibold text-gray-900">
              {(results.final_attribution.total_score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Confidence</span>
            <span className="text-lg font-semibold text-gray-900">
              {(results.final_attribution.confidence * 100).toFixed(1)}%
            </span>
          </div>
          {results.final_attribution.variance_from_initial !== undefined && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Variance from Initial</span>
                <span
                  className={`text-sm font-semibold ${
                    Math.abs(results.final_attribution.variance_from_initial) <= 0.05
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {(results.final_attribution.variance_from_initial * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <RiSearchLine className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Video Analysis</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Analysis:</p>
            <p className="text-sm text-gray-600">{results.video_analysis.analysis}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Detected Objects:</p>
            <div className="flex flex-wrap gap-2">
              {results.video_analysis.detected_objects.map((obj, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Detected Brands:</p>
            <div className="flex flex-wrap gap-2">
              {results.video_analysis.detected_brands.map((brand, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

