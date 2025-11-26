import BarChart from '@/components/Charts/BarChart';
import DonutChart from '@/components/Charts/DonutChart';
import { PipelineResult, VideoExample } from '@/lib/models';

interface AttributionDetailsProps {
  result: PipelineResult;
  matchedExampleData: VideoExample | null;
  getBarChartData: () => any[];
  getDonutChartData: () => any[];
}

export default function AttributionDetails({
  result,
  matchedExampleData,
  getBarChartData,
  getDonutChartData,
}: AttributionDetailsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Attribution Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart
          title="Initial Attribution (Pre-Generation)"
          data={getBarChartData()}
          yAxisMax={100}
          yAxisStep={10}
        />
        <DonutChart
          title="Final Attribution (Post-Generation)"
          data={getDonutChartData()}
          metrics={
            matchedExampleData?.results.video_metrics
              ? [
                  {
                    label: 'FRAMES ANALYZED',
                    value: matchedExampleData.results.video_metrics.frames_analyzed.toString(),
                  },
                  {
                    label: 'EMBEDDING MATCHES',
                    value: matchedExampleData.results.video_metrics.embedding_matches.toString(),
                  },
                ]
              : [
                  { label: 'FRAMES ANALYZED', value: '240' },
                  { label: 'EMBEDDING MATCHES', value: '238' },
                ]
          }
        />
      </div>
    </div>
  );
}
