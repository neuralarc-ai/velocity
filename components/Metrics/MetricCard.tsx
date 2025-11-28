'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  status?: 'Complete' | 'Passed' | 'Approved' | string;
  icon?: ReactNode;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  description,
  status,
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {icon && (
        <div className="mb-3 text-gray-600">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-gray-900 mb-2">{title}</h4>
      {status ? (
        <button className={`w-full mb-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
          status === 'Complete' || status === 'Passed'
            ? 'bg-brand-dark-green text-white hover:opacity-90'
            : status === 'Approved'
            ? 'bg-brand-orange text-white hover:opacity-90'
            : 'bg-brand-dark-green text-white hover:opacity-90'
        }`}>
          {status}
        </button>
      ) : (
        <div className="mb-2 text-2xl font-bold text-gray-900">{value}</div>
      )}
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

