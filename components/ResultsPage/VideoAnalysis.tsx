'use client';

import { VideoExample } from '@/lib/examples';
import { RiFilmLine, RiLinksLine } from 'react-icons/ri';

interface VideoAnalysisProps {
  matchedExampleData: VideoExample | null;
}

export default function VideoAnalysis({ matchedExampleData }: VideoAnalysisProps) {
  const videoMetrics = matchedExampleData?.results?.video_metrics;

  if (!videoMetrics) {
    return <div>No video analysis data available.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RiFilmLine className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Video Analysis</h3>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{videoMetrics.frames_analyzed}</div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiFilmLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Frames Analyzed</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{videoMetrics.embedding_matches}</div>
          <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
            <RiLinksLine className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">Embedding Matches</p>
        </div>
      </div>
    </div>
  );
}
