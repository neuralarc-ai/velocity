'use client';

import { RiMoneyDollarCircleLine, RiCheckboxCircleLine, RiCloseCircleLine, RiAlertLine } from 'react-icons/ri';

interface MonetizationStatusProps {
  approved: boolean;
  result?: {
    post_gen_safety?: {
      passed: boolean;
      contamination_score: number;
      violations?: string[];
    };
    final_attribution?: {
      details?: {
        status?: string;
        legal_reality?: string;
      };
    };
  };
}

export default function MonetizationStatus({ approved, result }: MonetizationStatusProps) {
  // Check if this is the Spider-Man example (high contamination = blocked)
  const isBlocked = result?.post_gen_safety?.contamination_score !== undefined && result.post_gen_safety.contamination_score > 0.9;
  const hasViolations = result?.post_gen_safety?.violations && result.post_gen_safety.violations.length > 0;

  if (isBlocked || hasViolations || !approved) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monetization Status</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <RiCloseCircleLine className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">Verdict: IMPOSSIBLE / EXTREME RISK</p>
              <p className="text-sm text-red-700 mb-3">
                Content cannot be monetized due to copyright infringement and high contamination risk.
              </p>
              <div className="space-y-2 mt-3">
                <div className="bg-white rounded p-3 border border-red-100">
                  <p className="text-sm font-semibold text-red-900 mb-1">Blocker 1: Copyright Strike</p>
                  <p className="text-xs text-red-700">
                    Guaranteed target for Disney's Content ID system. Monetization will be blocked, and all revenue (if any is generated before detection) will be claimed by Disney, or the video will receive a Copyright Strike.
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-red-100">
                  <p className="text-sm font-semibold text-red-900 mb-1">Blocker 2: YouTube Partner Program</p>
                  <p className="text-xs text-red-700">
                    Fails the "Original and Authentic" test under the Reused Content policy, jeopardizing channel monetization approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <RiAlertLine className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">Final Recommendation</p>
              <p className="text-sm text-yellow-700 mb-2">
                Do not monetize. Upload only as a non-commercial, non-monetized hobby project.
              </p>
              <p className="text-sm text-yellow-700">
                <strong>Mandatory Action:</strong> If uploaded, you must check the "Altered/Synthetic" content box in YouTube Studio.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RiMoneyDollarCircleLine className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Monetization Status</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <RiCheckboxCircleLine className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">Attribution Complete</p>
            <p className="text-sm text-gray-600">All IP sources properly attributed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <RiCheckboxCircleLine className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">Release Approved</p>
            <p className="text-sm text-gray-600">Content cleared for monetization</p>
          </div>
        </div>

        <button className="w-full mt-6 px-6 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          <RiCheckboxCircleLine className="w-5 h-5" />
          All Compliance Checks Passed
        </button>
      </div>
    </div>
  );
}

