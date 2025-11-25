'use client';

import { RiMoneyDollarCircleLine, RiCheckboxCircleLine } from 'react-icons/ri';

interface MonetizationStatusProps {
  approved: boolean;
}

export default function MonetizationStatus({ approved }: MonetizationStatusProps) {
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

