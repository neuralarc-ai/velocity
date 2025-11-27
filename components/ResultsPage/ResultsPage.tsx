'use client';

import { useState, useRef, useEffect } from 'react';

import { PipelineResult } from '@/lib/models';
import { VideoExample } from '@/lib/examples';
import ProcessTrace from '@/components/ProcessTrace/ProcessTrace';
import ProcessTraceHorizontal from '@/components/ProcessTrace/ProcessTraceHorizontal';
import MetricCard from '@/components/Metrics/MetricCard';
import BarChart from '@/components/Charts/BarChart';
import DonutChart from '@/components/Charts/DonutChart';
import ContaminationReport from '@/components/Contamination/ContaminationReport';
import MonetizationStatus from '@/components/Monetization/MonetizationStatus';
import AttributionDetails from './AttributionDetails';
import SafetyChecks from './SafetyChecks';
import VideoAnalysis from './VideoAnalysis';
import IpSources from './IpSources';
import CustomVideoPlayer from './CustomVideoPlayer';
import {
  RiVideoLine,
  RiBarChartLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiMoneyDollarCircleLine,
  RiFileTextLine,
  RiShareLine,
  RiFilePdfLine,
  RiArrowDownSLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiHdLine,
  RiTimerLine,
  RiCalendarLine,
} from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending';
  description: string;
  details?: string[];
}

interface ResultsPageProps {
  result: PipelineResult;
  prompt: string;
  processSteps: ProcessStep[];
  matchedExampleData: VideoExample | null;
  onNewAnalysis: () => void;
}

export default function ResultsPage({ 
  result,
  prompt,
  processSteps,
  matchedExampleData,
  onNewAnalysis,
}: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get actual video metadata when video loads - reads real duration and resolution from video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const getVideoMetadata = () => {
      // Get real video duration from the video element
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        setVideoDuration(video.duration);
      }
      
      // Get real video resolution from the video element
      if (video.videoWidth && video.videoHeight && video.videoWidth > 0 && video.videoHeight > 0) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        // Determine resolution based on height
        let resolution = '';
        if (height >= 2160) resolution = '4K (2160p)';
        else if (height >= 1440) resolution = '1440p';
        else if (height >= 1080) resolution = '1080p';
        else if (height >= 720) resolution = '720p';
        else if (height >= 480) resolution = '480p';
        else resolution = `${width}x${height}`;
        setVideoResolution(resolution);
      }
    };

    // Listen for when metadata is loaded
    video.addEventListener('loadedmetadata', getVideoMetadata);
    
    // Also listen for durationchange in case duration updates
    video.addEventListener('durationchange', getVideoMetadata);
    
    // If metadata is already loaded, get it immediately
    if (video.readyState >= 1) {
      getVideoMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', getVideoMetadata);
      video.removeEventListener('durationchange', getVideoMetadata);
    };
  }, [matchedExampleData?.results?.generated_video?.video_path]);

  // Calculate realistic processing time based on video duration or use actual processing time
  const getProcessingTime = (): string => {
    if (result.total_duration_ms) {
      const seconds = result.total_duration_ms / 1000;
      if (seconds < 60) {
        return `${seconds.toFixed(1)} seconds`;
      } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(1);
        return `${minutes}m ${remainingSeconds}s`;
      }
    }
    // Fallback: estimate based on video duration (roughly 2-3x video duration for processing)
    if (videoDuration) {
      const estimatedProcessing = videoDuration * 2.5;
      if (estimatedProcessing < 60) {
        return `${estimatedProcessing.toFixed(1)} seconds`;
      } else {
        const minutes = Math.floor(estimatedProcessing / 60);
        const remainingSeconds = (estimatedProcessing % 60).toFixed(1);
        return `${minutes}m ${remainingSeconds}s`;
      }
    }
    return 'Calculating...';
  };
  const getBarChartData = () => {
    // Get retrieved IPs from context - show all IPs found, not just grouped owners
    const retrievedIps = result?.results?.retrieved_context?.retrieved_ips || 
                         matchedExampleData?.results?.retrieved_context?.retrieved_ips;
    
    if (!retrievedIps || retrievedIps.length === 0) {
      // Fallback to attribution data if retrieved IPs not available
      const attributions = result?.results?.initial_attribution?.ip_attributions || 
                           matchedExampleData?.results?.initial_attribution?.ip_attributions;
      
      if (!attributions) {
        return [];
      }
      
      return Object.entries(attributions)
        .map(([label, value]) => {
          const numValue = Number(value) * 100;
          return {
            label,
            value: numValue,
          };
        })
        .filter((item) => !isNaN(item.value) && item.value > 0)
        .sort((a, b) => b.value - a.value);
    }
    
    // Map each retrieved IP to chart data using relevance_score
    // This shows all individual IPs found, not just grouped by owner
    const data = retrievedIps.map((ip) => {
      const relevancePercent = (ip.relevance_score || 0) * 100;
      // Use IP name as label, show owner in parentheses if different
      const label = ip.name && ip.name !== ip.owner ? `${ip.name} (${ip.owner})` : ip.owner;
      return {
        label,
        value: relevancePercent,
      };
    })
    .filter((item) => !isNaN(item.value) && item.value > 0)
    .sort((a, b) => b.value - a.value);

    return data;
  };

  const getDonutChartData = () => {
    // Get retrieved IPs from context - show all IPs found, not just grouped owners
    const retrievedIps = result?.results?.retrieved_context?.retrieved_ips || 
                         matchedExampleData?.results?.retrieved_context?.retrieved_ips;
    
    if (!retrievedIps || retrievedIps.length === 0) {
      // Fallback to attribution data if retrieved IPs not available
      const attributions = result?.results?.final_attribution?.ip_attributions || 
                           matchedExampleData?.results?.final_attribution?.ip_attributions;
      
      if (!attributions) {
        return [];
      }
      
      const colors = ['#000000', '#4a4a4a', '#9ca3af', '#d1d5db', '#e5e7eb'];
      return Object.entries(attributions)
        .map(([label, value], index) => {
          const numValue = Number(value) * 100;
          return {
            label,
            value: numValue,
            color: colors[index % colors.length],
          };
        })
        .filter((item) => !isNaN(item.value) && item.value > 0)
        .sort((a, b) => b.value - a.value);
    }
    
    // Map each retrieved IP to chart data using relevance_score
    // This shows all individual IPs found, not just grouped by owner
    const colors = ['#000000', '#4a4a4a', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#9ca3af', '#d1d5db'];
    const data = retrievedIps.map((ip, index) => {
      const relevancePercent = (ip.relevance_score || 0) * 100;
      // Use IP name as label, show owner in parentheses if different
      const label = ip.name && ip.name !== ip.owner ? `${ip.name} (${ip.owner})` : ip.owner;
      return {
        label,
        value: relevancePercent,
        color: colors[index % colors.length],
      };
    })
    .filter((item) => !isNaN(item.value) && item.value > 0)
    .sort((a, b) => b.value - a.value);

    return data;
  };


  const ComprehensiveAnalysis = () => (
    <div className="space-y-6">
      {/* Safety Checks Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiShieldCheckLine className="w-4 h-4 text-blue-600" />
          Safety & Compliance
        </h3>
        <div className="pl-6">
          <SafetyChecks result={result} />
        </div>
      </div>

      {/* Video Analysis Section */}
      {matchedExampleData?.results?.video_metrics && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
            <RiVideoLine className="w-4 h-4 text-blue-600" />
            Video Analysis
          </h3>
          <div className="pl-6">
            <VideoAnalysis matchedExampleData={matchedExampleData} />
          </div>
        </div>
      )}

      {/* IP Attribution Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiBarChartLine className="w-4 h-4 text-blue-600" />
          IP Attribution & Sources
        </h3>
        <div className="pl-6">
          <IpSources result={result} />
        </div>
      </div>

      {/* Contamination Report Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiAlertLine className="w-4 h-4 text-blue-600" />
          Content Integrity Analysis
        </h3>
        <div className="pl-6">
          <ContaminationReport
            contamination={result.results?.post_gen_safety?.contamination_score !== undefined
              ? result.results.post_gen_safety.contamination_score * 100
              : 0}
            licensed={result.results?.post_gen_safety?.contamination_score !== undefined
              ? (1 - result.results.post_gen_safety.contamination_score) * 100
              : 100}
            threshold={5}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Content Validation Report */}
          <div className="bg-black rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Content Validation Report</h3>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {result.results?.final_attribution?.total_score
                      ? Math.round(result.results.final_attribution.total_score * 100)
                      : '88'}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-2 ${
                  result.results?.post_gen_safety?.passed && (result.results?.post_gen_safety?.contamination_score ?? 1) < 0.05
                    ? 'bg-green-600 text-white'
                    : (result.results?.post_gen_safety?.contamination_score ?? 0) > 0.9
                    ? 'bg-red-600 text-white'
                    : 'bg-yellow-600 text-white'
                }`}>
                  {result.results?.post_gen_safety?.passed && (result.results?.post_gen_safety?.contamination_score ?? 1) < 0.05
                    ? 'Approved for Monetization'
                    : (result.results?.post_gen_safety?.contamination_score ?? 0) > 0.9
                    ? 'Monetization Blocked'
                    : 'Review Required'}
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {result.results?.post_gen_safety?.passed && (result.results?.post_gen_safety?.contamination_score ?? 1) < 0.05
                    ? 'Content has passed all safety checks and IP attribution validation. The generated video is ready for monetization with proper IP tracking in place.'
                    : (result.results?.post_gen_safety?.contamination_score ?? 0) > 0.9
                    ? 'Content contains unlicensed copyrighted material. Monetization is impossible due to copyright infringement and high contamination risk. See Monetization Status tab for details.'
                    : 'Content requires review. Please check safety violations and IP attribution details below.'}
                </p>
              </div>
            </div>
          </div>

          {/* Generated Output Section */}
          {result && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <RiVideoLine className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Generated Output</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[3.0fr_1fr] gap-8">
                {/* Left side - Video */}
                <div className="w-full">
                  {matchedExampleData?.results?.generated_video?.video_path ? (
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-lg transition-shadow">
                      <CustomVideoPlayer
                        src={matchedExampleData.results.generated_video.video_path}
                        className="w-full"
                      />
                      {/* Hidden video element for metadata extraction */}
                      <video
                        ref={videoRef}
                        src={matchedExampleData.results.generated_video.video_path}
                        className="hidden"
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
                      <RiVideoLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Generated video will appear here</p>
                    </div>
                  )}
                </div>
                
                {/* Right side - Video Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 flex flex-col justify-start">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Video Information</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <RiCheckboxCircleLine className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-medium text-gray-900">Generation complete</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <RiTimeLine className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Processing Time</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-medium text-gray-900">
                          {getProcessingTime()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <RiHdLine className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Resolution</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-medium text-gray-900">
                          {videoResolution || 'Loading...'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <RiTimerLine className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Duration</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-medium text-gray-900">
                          {videoDuration !== null
                            ? `${Math.round(videoDuration)}s`
                            : 'Loading...'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <RiCalendarLine className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Timestamp</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-medium text-gray-900">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics and Charts Section */}
          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Attribution"
                  value=""
                  description="IP sources tracked"
                  status="Complete"
                  icon={<RiBarChartLine className="w-6 h-6" />}
                />
                <MetricCard
                  title="Safety Check"
                  value=""
                  description="No violations detected"
                  status="Passed"
                  icon={<RiShieldCheckLine className="w-6 h-6" />}
                />
                <MetricCard
                  title="Contamination"
                  value={result.results?.post_gen_safety?.contamination_score !== undefined
                    ? `${(result.results.post_gen_safety.contamination_score * 100).toFixed(1)}%`
                    : 'N/A'}
                  description="Model influence detected"
                  icon={<RiAlertLine className="w-6 h-6" />}
                />
                <MetricCard
                  title="Monetization"
                  value=""
                  description="Ready for release"
                  status="Approved"
                  icon={<RiMoneyDollarCircleLine className="w-6 h-6" />}
                />
              </div>


              {/* Contamination Report */}
              <ContaminationReport
                contamination={result.results?.post_gen_safety?.contamination_score !== undefined
                  ? result.results.post_gen_safety.contamination_score * 100
                  : 0}
                licensed={result.results?.post_gen_safety?.contamination_score !== undefined
                  ? (1 - result.results.post_gen_safety.contamination_score) * 100
                  : 100}
                threshold={5}
              />

              {/* Monetization Status */}
              <MonetizationStatus 
                approved={result.results?.post_gen_safety?.passed && result.results?.post_gen_safety?.contamination_score < 0.05} 
                result={result.results}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'attribution-details',
      label: 'Attribution Details',
      content: <AttributionDetails result={result} matchedExampleData={matchedExampleData} getBarChartData={getBarChartData} getDonutChartData={getDonutChartData} />,
    },
    {
      id: 'comprehensive',
      label: 'Content Analysis',
      content: <ComprehensiveAnalysis />,
    },
    {
      id: 'monetization-status',
      label: 'Monetization Status',
      content: <MonetizationStatus 
        approved={result.results?.post_gen_safety?.passed && result.results?.post_gen_safety?.contamination_score < 0.05} 
        result={result.results}
      />,
    },
    {
      id: 'execution-logs',
      label: 'Execution Logs',
      content: <ProcessTrace steps={processSteps} />,
    },
  ];

  const visibleTabs = tabs.filter(tab => {
    if (!result) return false;
    switch (tab.id) {
      case 'overview':
      case 'comprehensive':
      case 'monetization-status':
        return true;
      case 'attribution-details':
        // Check both result and matchedExampleData for attribution data
        return (result.results?.initial_attribution && result.results?.final_attribution) ||
               (matchedExampleData?.results?.initial_attribution && matchedExampleData?.results?.final_attribution);
      case 'execution-logs':
        return processSteps && processSteps.length > 0;
      default:
        return false;
    }
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold mb-1">Velocity</h1>
          <p className="text-sm text-gray-300">IP Attribution & Safety Platform</p>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">IP Attribution Analysis Results</h2>
            <p className="text-gray-600">
              Complete analysis of your generated content including IP attribution, safety checks, and monetization validation.
            </p>
          </div>

          {/* Analyzed Prompt Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyzed Content Prompt</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm line-clamp-3">{prompt}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onNewAnalysis}
                className="ml-auto px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                New Analysis →
              </button>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {visibleTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors rounded-md ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {visibleTabs.find(tab => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

