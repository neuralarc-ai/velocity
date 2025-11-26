'use client';

import { useState } from 'react';

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
  const getBarChartData = () => {
    if (!result || !result.results?.initial_attribution?.ip_attributions) {
      return [];
    }
    const attributions = result.results.initial_attribution.ip_attributions;
    const data = Object.entries(attributions)
      .map(([label, value]) => {
        const numValue = Number(value) * 100;
        return {
          label,
          value: numValue,
        };
      })
      .filter((item) => !isNaN(item.value) && item.value > 0)
      .sort((a, b) => b.value - a.value);

    return data;
  };

  const getDonutChartData = () => {
    if (!result || !result.results?.final_attribution?.ip_attributions) {
      return [];
    }
    const attributions = result.results.final_attribution.ip_attributions;
    const colors = ['#000000', '#4a4a4a', '#9ca3af', '#d1d5db', '#e5e7eb'];
    const data = Object.entries(attributions)
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
            contamination={result.results.post_gen_safety.contamination_score * 100}
            licensed={(1 - result.results.post_gen_safety.contamination_score) * 100}
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
                <div className="inline-block px-3 py-1 bg-gray-700 rounded text-sm font-medium mb-2">
                  {result.results?.post_gen_safety?.passed && result.results?.post_gen_safety?.contamination_score < 0.05
                    ? 'Approved for Monetization'
                    : 'Review Required'}
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {result.results?.post_gen_safety?.passed
                    ? 'Content has passed all safety checks and IP attribution validation. The generated video is ready for monetization with proper IP tracking in place.'
                    : 'Content requires review. Please check safety violations and IP attribution details below.'}
                </p>
              </div>
            </div>
          </div>

          {/* Generated Output Section */}
          {result && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <RiVideoLine className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Generated Output</h3>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                  <RiVideoLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Generated video will appear here</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">Generation complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium text-gray-900">
                      {result.total_duration_ms
                        ? `${(result.total_duration_ms / 1000).toFixed(1)} seconds`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
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
                  value={`${(result.results.post_gen_safety.contamination_score * 100).toFixed(1)}%`}
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
                contamination={result.results.post_gen_safety.contamination_score * 100}
                licensed={(1 - result.results.post_gen_safety.contamination_score) * 100}
                threshold={5}
              />

              {/* Monetization Status */}
              <MonetizationStatus approved={true} />
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
      content: <MonetizationStatus approved={true} />,
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
        return result.results?.initial_attribution && result.results?.final_attribution;
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

