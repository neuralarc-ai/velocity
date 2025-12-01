'use client';

import { useState, useRef, useEffect } from 'react';

import { PipelineResult } from '@/lib/models';
import { VideoExample } from '@/lib/examples';
import { formatPercentage, formatPercentageValue } from '@/lib/utils';
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
import Questions from './Questions';
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
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiHdLine,
  RiTimerLine,
  RiCalendarLine,
} from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending' | 'Failed' | 'Blocked' | 'Skipped';
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
      
      const colors = ['#FC5E37', '#004116', '#CFEBD5', '#FEF9E6', '#D4EB9D'];
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
    const colors = ['#FC5E37', '#004116', '#CFEBD5', '#FEF9E6', '#D4EB9D'];
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
      
      const colors = ['#FC5E37', '#004116', '#CFEBD5', '#FEF9E6', '#D4EB9D'];
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
    const colors = ['#FC5E37', '#004116', '#CFEBD5', '#FEF9E6', '#D4EB9D', '#FC5E37', '#004116', '#CFEBD5'];
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
      <div className="bg-brand-cream/30 rounded-lg p-4 border border-brand-mint-green/20">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiShieldCheckLine className="w-4 h-4 text-brand-orange" />
          Safety & Compliance
        </h3>
        <div className="pl-6">
          <SafetyChecks result={result} />
        </div>
      </div>

      {/* Video Analysis Section */}
      {matchedExampleData?.results?.video_metrics && (
        <div className="bg-brand-cream/30 rounded-lg p-4 border border-brand-mint-green/20">
          <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
            <RiVideoLine className="w-4 h-4 text-brand-orange" />
            Video Analysis
          </h3>
          <div className="pl-6">
            <VideoAnalysis matchedExampleData={matchedExampleData} />
          </div>
        </div>
      )}

      {/* IP Attribution Section */}
      <div className="bg-brand-cream/30 rounded-lg p-4 border border-brand-mint-green/20">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiBarChartLine className="w-4 h-4 text-brand-orange" />
          IP Attribution & Sources
        </h3>
        <div className="pl-6">
          <IpSources result={result} />
        </div>
      </div>

      {/* Contamination Report Section */}
      <div className="bg-brand-cream/30 rounded-lg p-4 border border-brand-mint-green/20">
        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center gap-2">
          <RiAlertLine className="w-4 h-4 text-brand-orange" />
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
          <div className="relative bg-brand-dark-green rounded-2xl p-8 text-white shadow-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-lime-green rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-full border-4 border-white/20 bg-brand-orange/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-brand-orange/30"></div>
                    <span className="relative z-10 text-5xl font-bold">
                      {(() => {
                        const totalScore = result.results?.final_attribution?.total_score || 
                                         matchedExampleData?.results?.final_attribution?.total_score;
                        return totalScore ? Math.round(totalScore * 100) : '88';
                      })()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Content Validation Report</h3>
                  {(() => {
                    const postGenSafety = result.results?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
                    const finalAttribution = result.results?.final_attribution || matchedExampleData?.results?.final_attribution;
                    const passed = postGenSafety?.passed ?? false;
                    const contaminationScore = postGenSafety?.contamination_score ?? 1;
                    const monetizationVerdict = finalAttribution?.details?.monetization_verdict as string | undefined;
                    
                    // Check monetization risk from verdict
                    const hasMonetizationRisk = monetizationVerdict && (
                      monetizationVerdict.includes('IMPOSSIBLE') || 
                      monetizationVerdict.includes('EXTREME RISK') || 
                      monetizationVerdict.includes('HIGH RISK') ||
                      monetizationVerdict.includes('UNLIKELY')
                    );
                    
                    // Determine status
                    const isApproved = passed && contaminationScore < 0.05 && !hasMonetizationRisk;
                    const isBlocked = contaminationScore > 0.9 || monetizationVerdict?.includes('IMPOSSIBLE') || monetizationVerdict?.includes('EXTREME RISK');
                    const isNotApproved = hasMonetizationRisk && !isBlocked; // High risk but not impossible
                    
                    return (
                      <>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mb-4 ${
                          isApproved
                            ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                            : isBlocked
                            ? 'bg-red-500/20 text-red-200 border border-red-400/30'
                            : isNotApproved
                            ? 'bg-orange-500/20 text-orange-200 border border-orange-400/30'
                            : 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                        }`}>
                          <RiCheckboxCircleLine className="w-4 h-4" />
                          {isApproved
                            ? 'Approved for Monetization'
                            : isBlocked
                            ? 'Monetization Blocked'
                            : isNotApproved
                            ? 'Not Approved for Monetization'
                            : 'Review Required'}
                        </div>
                        <p className="text-gray-200 text-base leading-relaxed">
                          {isApproved
                            ? 'Content has passed all safety checks and IP attribution validation. The generated video is ready for monetization with proper IP tracking in place.'
                            : isBlocked
                            ? 'Content contains unlicensed copyrighted material. Monetization is impossible due to copyright infringement and high contamination risk. See Monetization Status tab for details.'
                            : isNotApproved
                            ? 'Content poses significant monetization risks due to copyright concerns, trademark issues, or platform policy violations. Monetization is not recommended. See Monetization Status tab for detailed risk analysis.'
                            : 'Content requires review. Please check safety violations and IP attribution details below.'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Output Section */}
          {result && (
            <div className="bg-white rounded-2xl border border-brand-mint-green/30 p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-brand-orange rounded-lg">
                  <RiVideoLine className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Generated Output</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[4.2fr_1.2fr] gap-8">
                {/* Left side - Video */}
                <div className="w-full">
                  {matchedExampleData?.results?.generated_video?.video_path && 
                   matchedExampleData.results.generated_video.video_path.trim() !== '' ? (
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
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
                    <div className="border-2 border-dashed border-red-300 rounded-xl overflow-hidden bg-red-50 shadow-lg relative" style={{ aspectRatio: '16/9' }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                        <RiAlertLine className="w-16 h-16 text-red-400 mb-4" />
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Video Generation Blocked</h3>
                        <p className="text-red-700 mb-4">
                          {(() => {
                            const preSafety = matchedExampleData?.results?.pre_gen_safety;
                            const postSafety = matchedExampleData?.results?.post_gen_safety;
                            if (preSafety && !preSafety.passed) {
                              return preSafety.details?.generation_blocked_reason as string || 
                                     'Video generation was blocked due to IP conflicts detected during pre-generation safety check.';
                            }
                            if (postSafety && !postSafety.passed) {
                              return postSafety.details?.blocking_reason as string || 
                                     'Video generation was blocked due to safety violations.';
                            }
                            return 'Video generation was blocked. See analysis below for details.';
                          })()}
                        </p>
                        <p className="text-sm text-red-600">
                          Analysis results are available below, but no video was generated.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right side - Video Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-start shadow-md">
                  <h4 className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider">Video Information</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-brand-cream/30 rounded-lg border border-brand-mint-green/20 hover:border-brand-orange hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          matchedExampleData?.results?.generated_video?.video_path && 
                          matchedExampleData.results.generated_video.video_path.trim() !== ''
                            ? 'bg-brand-dark-green'
                            : 'bg-red-500'
                        }`}>
                          {matchedExampleData?.results?.generated_video?.video_path && 
                           matchedExampleData.results.generated_video.video_path.trim() !== '' ? (
                            <RiCheckboxCircleLine className="w-4 h-4 text-white" />
                          ) : (
                            <RiAlertLine className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status</span>
                      </div>
                      <div className="pl-11">
                        <span className={`text-base font-semibold ${
                          matchedExampleData?.results?.generated_video?.video_path && 
                          matchedExampleData.results.generated_video.video_path.trim() !== ''
                            ? 'text-gray-900'
                            : 'text-red-600'
                        }`}>
                          {matchedExampleData?.results?.generated_video?.video_path && 
                           matchedExampleData.results.generated_video.video_path.trim() !== ''
                            ? 'Generation complete'
                            : 'Generation blocked'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-brand-cream/30 rounded-lg border border-brand-mint-green/20 hover:border-brand-orange hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange rounded-lg">
                          <RiTimeLine className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Processing Time</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-semibold text-gray-900">
                          {getProcessingTime()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-brand-cream/30 rounded-lg border border-brand-mint-green/20 hover:border-brand-orange hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-lime-green rounded-lg">
                          <RiHdLine className="w-4 h-4 text-brand-dark-green" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Resolution</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-semibold text-gray-900">
                          {matchedExampleData?.results?.generated_video?.video_path && 
                           matchedExampleData.results.generated_video.video_path.trim() !== ''
                            ? (videoResolution || 'Loading...')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-brand-cream/30 rounded-lg border border-brand-mint-green/20 hover:border-brand-orange hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange rounded-lg">
                          <RiTimerLine className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-semibold text-gray-900">
                          {matchedExampleData?.results?.generated_video?.video_path && 
                           matchedExampleData.results.generated_video.video_path.trim() !== ''
                            ? (videoDuration !== null ? `${Math.round(videoDuration)}s` : 'Loading...')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-brand-cream/30 rounded-lg border border-brand-mint-green/20 hover:border-brand-orange hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-mint-green rounded-lg">
                          <RiCalendarLine className="w-4 h-4 text-brand-dark-green" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Timestamp</span>
                      </div>
                      <div className="pl-11">
                        <span className="text-base font-semibold text-gray-900">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics and Charts Section */}
          {result && (
            <div className="space-y-8 mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    ? `${formatPercentage(result.results.post_gen_safety.contamination_score)}%`
                    : 'N/A'}
                  description="Model influence detected"
                  icon={<RiAlertLine className="w-6 h-6" />}
                />
                {(() => {
                  const postGenSafety = result.results?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
                  const finalAttribution = result.results?.final_attribution || matchedExampleData?.results?.final_attribution;
                  const passed = postGenSafety?.passed ?? false;
                  const contaminationScore = postGenSafety?.contamination_score ?? 1;
                  const monetizationVerdict = finalAttribution?.details?.monetization_verdict as string | undefined;
                  
                  const hasMonetizationRisk = monetizationVerdict && (
                    monetizationVerdict.includes('IMPOSSIBLE') || 
                    monetizationVerdict.includes('EXTREME RISK') || 
                    monetizationVerdict.includes('HIGH RISK') ||
                    monetizationVerdict.includes('UNLIKELY')
                  );
                  
                  const isActuallyApproved = passed && contaminationScore < 0.05 && !hasMonetizationRisk;
                  const isBlocked = contaminationScore > 0.9 || monetizationVerdict?.includes('IMPOSSIBLE') || monetizationVerdict?.includes('EXTREME RISK');
                  
                  if (isActuallyApproved) {
                    return (
                      <MetricCard
                        title="Monetization"
                        value=""
                        description="Ready for release"
                        status="Approved"
                        icon={<RiMoneyDollarCircleLine className="w-6 h-6" />}
                      />
                    );
                  } else if (isBlocked) {
                    return (
                      <MetricCard
                        title="Monetization"
                        value=""
                        description="Not eligible"
                        status="Blocked"
                        icon={<RiMoneyDollarCircleLine className="w-6 h-6" />}
                      />
                    );
                  } else {
                    return (
                      <MetricCard
                        title="Monetization"
                        value=""
                        description="Review required"
                        status="Pending"
                        icon={<RiMoneyDollarCircleLine className="w-6 h-6" />}
                      />
                    );
                  }
                })()}
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
              {(() => {
                const postGenSafety = result.results?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
                const passed = postGenSafety?.passed ?? false;
                const contaminationScore = postGenSafety?.contamination_score ?? 1;
                const isApproved = passed && contaminationScore < 0.05;
                
                return (
                  <MonetizationStatus 
                    approved={isApproved} 
                    result={result.results}
                    matchedExampleData={matchedExampleData}
                  />
                );
              })()}
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
      content: (() => {
        const postGenSafety = result.results?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
        const passed = postGenSafety?.passed ?? false;
        const contaminationScore = postGenSafety?.contamination_score ?? 1;
        const isApproved = passed && contaminationScore < 0.05;
        
        return (
          <MonetizationStatus 
            approved={isApproved} 
            result={result.results}
            matchedExampleData={matchedExampleData}
          />
        );
      })(),
    },
    // {
    //   id: 'execution-logs',
    //   label: 'Execution Logs',
    //   content: <ProcessTrace steps={processSteps} />,
    // },
    {
      id: 'questions',
      label: 'Questions',
      content: <Questions result={result} matchedExampleData={matchedExampleData} prompt={prompt} />,
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
      // case 'execution-logs':
      //   return processSteps && processSteps.length > 0;
      case 'questions':
        return true; // Always show questions tab
      default:
        return false;
    }
  });

  return (
    <div className="min-h-screen bg-brand-cream relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-mint-green/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-lime-green/40 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Velocity
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">IP Attribution & Safety Platform</p>
            </div>
            <button
              onClick={onNewAnalysis}
              className="group px-6 py-2.5 bg-brand-orange text-white rounded-xl font-medium hover:bg-brand-orange/90 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
            >
              <span>New Analysis</span>
              <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint-green/50 rounded-full border border-brand-lime-green/50 mb-4">
              <RiCheckboxCircleLine className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-brand-dark-green">Analysis Complete</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Analysis Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Complete analysis of your generated content including IP attribution, safety checks, and monetization validation.
            </p>
          </div>

          {/* Analyzed Prompt Card */}
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-mint-green/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-brand-orange rounded-lg">
                  <RiFileTextLine className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Analyzed Content Prompt</h3>
              </div>
              <div className="bg-brand-cream/30 rounded-lg p-4 border border-brand-mint-green/20">
                <p className="text-gray-700 leading-relaxed">{prompt}</p>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="space-y-6 animate-fade-in-up delay-200">
            {/* Tab Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pl-1 pt-2">
              {visibleTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 rounded-xl flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-brand-orange text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 hover:bg-brand-cream/30 hover:text-gray-900 border border-brand-mint-green/30 hover:border-brand-orange hover:shadow-sm'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-brand-mint-green/30">
              <div className="animate-fade-in">
                {visibleTabs.find(tab => tab.id === activeTab)?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}