import { VideoExample } from '@/lib/examples';

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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Analysis</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Frames Analyzed:</span>
          <span className="font-medium text-gray-900">{videoMetrics.frames_analyzed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Embedding Matches:</span>
          <span className="font-medium text-gray-900">{videoMetrics.embedding_matches}</span>
        </div>
      </div>
    </div>
  );
}
