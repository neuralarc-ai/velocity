'use client';

import { VIDEO_EXAMPLES } from '@/lib/examples';
import { RiVideoLine, RiCheckboxCircleLine } from 'react-icons/ri';

interface MatchedExampleProps {
  exampleId: string | null;
}

export default function MatchedExample({ exampleId }: MatchedExampleProps) {
  if (!exampleId) return null;

  const example = VIDEO_EXAMPLES.find(e => e.id === exampleId);
  if (!example) return null;

  return (
    <div className="bg-primary-50 rounded-lg border border-primary-200 p-4 mb-6">
      <div className="flex items-start gap-3">
        <RiCheckboxCircleLine className="w-5 h-5 text-primary-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <RiVideoLine className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-primary-900">Matched Example</h3>
          </div>
          <p className="text-sm font-medium text-primary-800 mb-1">{example.name}</p>
          <p className="text-xs text-primary-700">{example.video.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {example.results.retrieved_context.retrieved_ips.map((ip, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium"
              >
                {ip.owner} - {ip.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

