'use client';

import { RiMoneyDollarCircleLine, RiCheckboxCircleLine, RiCloseCircleLine, RiAlertLine } from 'react-icons/ri';

interface MonetizationStatusProps {
  approved: boolean;
  result?: {
    post_gen_safety?: {
      passed: boolean;
      contamination_score: number;
      violations?: string[];
      violation_details?: Array<{
        violation_type?: string;
        severity?: string;
        description?: string;
      }>;
    };
    final_attribution?: {
      details?: {
        status?: string;
        legal_reality?: string;
        monetization_verdict?: string;
      };
      ip_attributions?: Record<string, number>;
    };
    retrieved_context?: {
      retrieved_ips?: Array<{
        owner: string;
        name: string;
      }>;
    };
  };
  matchedExampleData?: {
    results?: {
      retrieved_context?: {
        retrieved_ips?: Array<{
          owner: string;
          name: string;
        }>;
      };
      final_attribution?: {
        ip_attributions?: Record<string, number>;
        details?: {
          status?: string;
          legal_reality?: string;
          monetization_verdict?: string;
        };
      };
      post_gen_safety?: {
        passed: boolean;
        contamination_score: number;
        violations?: string[];
        violation_details?: Array<{
          violation_type?: string;
          severity?: string;
          description?: string;
        }>;
      };
    };
  } | null;
}

export default function MonetizationStatus({ approved, result, matchedExampleData }: MonetizationStatusProps) {
  // Get data from result or matchedExampleData
  const postGenSafety = result?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
  const finalAttribution = result?.final_attribution || matchedExampleData?.results?.final_attribution;
  
  // Check if this is blocked (high contamination = blocked)
  const contaminationScore = postGenSafety?.contamination_score ?? 1;
  const isBlocked = contaminationScore > 0.9;
  const hasViolations = postGenSafety?.violations && postGenSafety.violations.length > 0;
  
  // Check monetization risk from verdict
  const monetizationVerdict = finalAttribution?.details?.monetization_verdict as string | undefined;
  const hasMonetizationRisk = monetizationVerdict && (
    monetizationVerdict.includes('IMPOSSIBLE') || 
    monetizationVerdict.includes('EXTREME RISK') || 
    monetizationVerdict.includes('HIGH RISK') ||
    monetizationVerdict.includes('UNLIKELY')
  );
  
  // Only show approved if truly safe (passed, low contamination, no violations, no monetization risk)
  const isActuallyApproved = approved && 
                             contaminationScore < 0.05 && 
                             !hasViolations && 
                             !hasMonetizationRisk &&
                             !isBlocked;

  // Extract copyright holder from IP attributions or retrieved IPs
  const getCopyrightHolder = (): string => {
    // Use the finalAttribution already defined above
    if (finalAttribution?.ip_attributions) {
      const entries = Object.entries(finalAttribution.ip_attributions);
      if (entries.length > 0) {
        // Sort by score and get the highest
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        const topOwner = sorted[0][0];
        // Extract just the company name (remove actor likeness, etc.)
        if (topOwner.includes('Arka Media Works')) {
          return 'Arka Media Works';
        }
        if (topOwner.includes('Marvel') || topOwner.includes('Sony')) {
          return 'Sony/Marvel';
        }
        return topOwner;
      }
    }
    
    // Fallback to retrieved IPs from result or matchedExampleData
    const retrievedIps = result?.retrieved_context?.retrieved_ips || matchedExampleData?.results?.retrieved_context?.retrieved_ips;
    if (retrievedIps && retrievedIps.length > 0) {
      const topIp = retrievedIps[0];
      if (topIp.owner.includes('Arka Media Works')) {
        return 'Arka Media Works';
      }
      if (topIp.owner.includes('Marvel') || topIp.owner.includes('Sony')) {
        return 'Sony/Marvel';
      }
      return topIp.owner;
    }
    
    // Default fallback
    return 'the rights holder';
  };

  const copyrightHolder = getCopyrightHolder();

  if (isBlocked || hasViolations || !isActuallyApproved) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monetization Status</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <RiCloseCircleLine className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">Verdict: IMPOSSIBLE / EXTREME RISK</p>
              <p className="text-sm text-red-700 mb-3">
                Content cannot be monetized due to copyright infringement and high contamination risk.
              </p>
              <div className="space-y-2 mt-3">
                <div className="bg-white rounded p-3 border border-red-100">
                  <p className="text-sm font-semibold text-red-900 mb-1">Blocker 1: Copyright Claim & Revenue Block</p>
                  <p className="text-xs text-red-700">
                    Guaranteed target for {copyrightHolder}'s Content ID system. Monetization will be blocked, and all revenue (if any is generated before detection) will be claimed by {copyrightHolder}, or the video will receive a Copyright Strike.
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-red-100">
                  <p className="text-sm font-semibold text-red-900 mb-1">Blocker 2: Platform Partner Program</p>
                  <p className="text-xs text-red-700">
                    Fails the "Original and Authentic" test under platform Reused Content policies, jeopardizing channel monetization approval on major video platforms.
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
                <strong>Mandatory Action:</strong> If uploaded to any video platform, you must acknowledge the copyright ownership and declare any synthetic or altered content in the platform's content disclosure settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show approved state if truly safe
  if (isActuallyApproved) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <RiMoneyDollarCircleLine className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monetization Status</h3>
        </div>

        <div className="space-y-3">
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

          <button className="w-full mt-3 px-6 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <RiCheckboxCircleLine className="w-5 h-5" />
            All Compliance Checks Passed
          </button>
        </div>
      </div>
    );
  }

  // If not actually approved but not blocked, show warning/not approved state
  if (hasMonetizationRisk && !isBlocked) {
    return (
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <RiMoneyDollarCircleLine className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monetization Status</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <RiAlertLine className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900 mb-1">Monetization Not Recommended</p>
              <p className="text-sm text-orange-700 mb-3">
                Content poses significant monetization risks. See details below.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: show blocked state (already handled above, but this is a fallback)
  return null;
}

