'use client';

import { useState, useEffect } from 'react';
import { StrandPipeline } from '@/lib/pipeline';
import { PipelineResult } from '@/lib/models';
import { VIDEO_EXAMPLES, matchPromptToExample, type VideoExample } from '@/lib/examples';
import { database } from '@/lib/database';
import ProcessTrace from '@/components/ProcessTrace/ProcessTrace';
import ProcessTraceHorizontal from '@/components/ProcessTrace/ProcessTraceHorizontal';
import MetricCard from '@/components/Metrics/MetricCard';
import BarChart from '@/components/Charts/BarChart';
import DonutChart from '@/components/Charts/DonutChart';
import ContaminationReport from '@/components/Contamination/ContaminationReport';
import MonetizationStatus from '@/components/Monetization/MonetizationStatus';
import PromptInput from '@/components/PromptInput/PromptInput';
import { RiPlayFill, RiCloseLine, RiVideoLine, RiBarChartLine, RiShieldCheckLine, RiAlertLine, RiMoneyDollarCircleLine, RiFileTextLine, RiTimeLine } from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending';
  description: string;
  details?: string[];
}

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [prompt, setPrompt] = useState('');
  const [matchedExample, setMatchedExample] = useState<string | null>(null);
  const [matchedExampleData, setMatchedExampleData] = useState<VideoExample | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

  // Initialize process steps - start with empty array
  useEffect(() => {
    if (!isRunning && processSteps.length === 0) {
      setProcessSteps([]);
    }
  }, [isRunning, processSteps.length]);

  const handleRunPipeline = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsRunning(true);
    setResult(null);
    setCurrentStep(0);
    setMatchedExample(null);

    // Initialize all steps as pending (but don't show them yet)
    const allSteps: ProcessStep[] = [
      {
        id: 1,
        title: 'Prompt Receipt',
        status: 'Pending',
        description: 'Original prompt received and validated',
      },
      {
        id: 2,
        title: 'Semantic Analysis',
        status: 'Pending',
        description: 'Prompt analyzed for creative intent',
      },
      {
        id: 3,
        title: 'ID Safety Check (Pre-Gen)',
        status: 'Pending',
        description: 'No safety violations detected in prompt',
      },
      {
        id: 4,
        title: 'Content Retrieval',
        status: 'Pending',
        description: 'Retrieved relevant IP sources',
      },
      {
        id: 5,
        title: 'Initial Attribution',
        status: 'Pending',
        description: 'Pre-generation attribution calculated',
      },
      {
        id: 6,
        title: 'Prompt Augmentation',
        status: 'Pending',
        description: 'Prompt enhanced with IP-specific guidance',
      },
      {
        id: 7,
        title: 'Video Generation',
        status: 'Pending',
        description: 'AI model executed with augmented prompt',
      },
      {
        id: 8,
        title: 'Output Analysis',
        status: 'Pending',
        description: 'Generated video analyzed frame-by-frame',
      },
      {
        id: 9,
        title: 'Final Attribution',
        status: 'Pending',
        description: 'Post-generation attribution verified',
      },
      {
        id: 10,
        title: 'Contamination Detection',
        status: 'Pending',
        description: 'Model contamination checked',
      },
      {
        id: 11,
        title: 'IP Safety Check (Post-Gen)',
        status: 'Pending',
        description: 'Output validated against IP safety rules',
      },
      {
        id: 12,
        title: 'Monetization Validation',
        status: 'Pending',
        description: 'Content approved for monetization',
      },
    ];
    
    // Start with empty steps - they'll be added one by one
    setProcessSteps([]);

    try {
      const pipeline = new StrandPipeline();
      
      // Simulate step-by-step execution - add steps one by one
      const addStep = (stepId: number, title: string, description: string, status: 'Complete' | 'Passed' | 'Approved' | 'Running', details?: string[]) => {
        const newStep: ProcessStep = {
          id: stepId,
          title,
          status,
          description,
          details,
        };
        
        setProcessSteps(prev => {
          // Check if step already exists
          const existingIndex = prev.findIndex(s => s.id === stepId);
          if (existingIndex >= 0) {
            // Update existing step
            return prev.map((step, idx) => 
              idx === existingIndex ? newStep : step
            );
          } else {
            // Add new step
            return [...prev, newStep];
          }
        });
        setCurrentStep(stepId);
      };

      // Step 1: Prompt Receipt
      addStep(1, 'Prompt Receipt', 'Original prompt received and validated', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(1, 'Prompt Receipt', 'Original prompt received and validated', 'Complete', [`Prompt: "${prompt}"`]);

      // Step 2: Semantic Analysis
      addStep(2, 'Semantic Analysis', 'Prompt analyzed for creative intent', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const matchedExample = matchPromptToExample(prompt);
      if (!matchedExample) {
        throw new Error('Failed to match prompt to example');
      }
      setMatchedExample(matchedExample.id);
      setMatchedExampleData(matchedExample);
      
      const analysisDetails = [
        `Intent: ${matchedExample.name} content creation`,
        `IP Elements: ${matchedExample.results.retrieved_context.retrieved_ips.map(ip => ip.name).join(', ')}`,
        `Detected Objects: ${matchedExample.results.video_analysis.detected_objects.join(', ')}`,
        `Brands: ${matchedExample.results.video_analysis.detected_brands.join(', ')}`,
      ];
      addStep(2, 'Semantic Analysis', 'Prompt analyzed for creative intent', 'Complete', analysisDetails);

      // Step 3: Safety Check
      addStep(3, 'ID Safety Check (Pre-Gen)', 'No safety violations detected in prompt', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(3, 'ID Safety Check (Pre-Gen)', 'No safety violations detected in prompt', 'Passed', ['Checked against 3 IP safety rules']);

      // Step 4: Content Retrieval
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Running');
      await new Promise(resolve => setTimeout(resolve, 500));
      const ipSources = matchedExample.results.retrieved_context.retrieved_ips;
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Complete', [
        `Retrieved ${ipSources.length} relevant IP sources`,
        ...ipSources.map(ip => `${ip.owner}: ${(ip.relevance_score * 100).toFixed(0)}% relevance`),
      ]);

      // Step 5: Initial Attribution
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const initialAttributions = Object.entries(matchedExample.results.initial_attribution.ip_attributions);
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Complete', [
        'Pre-generation attribution calculated',
        ...initialAttributions.map(([owner, score]) => `${owner}: ${(Number(score) * 100).toFixed(0)}%`),
      ]);

      // Step 6: Prompt Augmentation
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Complete', [
        'Prompt enhanced with IP-specific guidance',
        'Added cinematic lighting, composition, and style directives based on retrieved content',
      ]);

      // Step 7: Video Generation
      addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Running');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Complete', [
        'AI model executed with augmented prompt',
        `Model: Mochi-1 | Duration: ${matchedExample.results.generated_video.duration} seconds | Resolution: ${matchedExample.results.generated_video.resolution}`,
      ]);

      // Step 8: Output Analysis
      addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Running');
      await new Promise(resolve => setTimeout(resolve, 600));
      const framesAnalyzed = matchedExample.results.video_metrics?.frames_analyzed || 240;
      const embeddingMatches = matchedExample.results.video_metrics?.embedding_matches || 238;
      addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Complete', [
        'Generated video analyzed frame-by-frame',
        `Processed ${framesAnalyzed} frames | Extracted embeddings for comparison`,
      ]);

      // Step 9: Final Attribution
      addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const finalAttributions = Object.entries(matchedExample.results.final_attribution.ip_attributions);
      addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Complete', [
        'Post-generation attribution verified',
        ...finalAttributions.map(([owner, score]) => `${owner}: ${(Number(score) * 100).toFixed(0)}%`),
      ]);

      // Step 10: Contamination Detection
      addStep(10, 'Contamination Detection', 'Model contamination checked', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      const contamination = matchedExample.results.post_gen_safety.contamination_score * 100;
      addStep(10, 'Contamination Detection', 'Model contamination checked', 'Passed', [
        `Model contamination: ${contamination.toFixed(1)}%`,
        'Detected minimal influence from model training data. Within acceptable threshold.',
      ]);

      // Step 11: IP Safety Check
      addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Passed', [
        'Output validated against IP safety rules',
        'No violations detected in generated content.',
      ]);

      // Step 12: Monetization Validation
      addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Approved', [
        'Content approved for monetization',
        'All safety checks passed | Attribution complete | Ready for release.',
      ]);

      // Execute pipeline
      const finalResult = await pipeline.execute(prompt);
      setResult(finalResult);
    } catch (error) {
      console.error('Pipeline execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResult(null);
    setCurrentStep(0);
    setMatchedExample(null);
    setProcessSteps([]); // Clear all steps
  };

  // Get data for charts
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
      .filter(item => !isNaN(item.value) && item.value > 0)
      .sort((a, b) => b.value - a.value);
    
    return data;
  };

  const getDonutChartData = () => {
    if (!result || !result.results?.final_attribution?.ip_attributions) {
      return [];
    }
    const attributions = result.results.final_attribution.ip_attributions;
    // Use gray/black shades to match the image: black, dark gray, light gray
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
      .filter(item => !isNaN(item.value) && item.value > 0)
      .sort((a, b) => b.value - a.value);
    
    return data;
  };

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
          {/* Prompt Input */}
          <PromptInput
            prompt={prompt}
            onChange={setPrompt}
            disabled={isRunning}
          />

          {/* Example Prompts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <RiFileTextLine className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Example Prompts</h3>
              <span className="text-xs text-gray-500 ml-2">(Click to use)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {VIDEO_EXAMPLES.map((example) => (
                <button
                  key={example.id}
                  onClick={() => {
                    setPrompt(example.video.description);
                    setMatchedExample(example.id);
                  }}
                  className={`text-left p-4 rounded-lg border-2 text-sm transition-all hover:shadow-md ${
                    matchedExample === example.id
                      ? 'border-black bg-gray-50 ring-2 ring-black'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                  disabled={isRunning}
                >
                  <p className="font-semibold text-gray-900 mb-1">{example.name}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{example.video.description}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Select an example prompt above to quickly test the system, or enter your own custom prompt.
            </p>
          </div>

        {/* Top Controls Bar */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleRunPipeline}
            disabled={isRunning || !prompt.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RiPlayFill className="w-5 h-5" />
            Generate
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <RiCloseLine className="w-5 h-5" />
            Clear
          </button>
        </div>

        <div className="space-y-6">
          {/* Horizontal Process Trace - Always Visible */}
          <ProcessTraceHorizontal steps={processSteps} currentStep={currentStep} />

          {/* Generated Output Section - Only show after all steps complete */}
          {result && processSteps.length > 0 && processSteps.every(step => step.status === 'Complete' || step.status === 'Passed' || step.status === 'Approved') && (
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
                      {result.total_duration_ms ? `${(result.total_duration_ms / 1000).toFixed(1)} seconds` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-medium text-gray-900">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics and Charts Section - Only show after all steps complete */}
          {result && processSteps.length > 0 && processSteps.every(step => step.status === 'Complete' || step.status === 'Passed' || step.status === 'Approved') && (
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

              {/* Charts Section */}
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
                    metrics={matchedExampleData?.results.video_metrics ? [
                      { label: 'FRAMES ANALYZED', value: matchedExampleData.results.video_metrics.frames_analyzed.toString() },
                      { label: 'EMBEDDING MATCHES', value: matchedExampleData.results.video_metrics.embedding_matches.toString() },
                    ] : [
                      { label: 'FRAMES ANALYZED', value: '240' },
                      { label: 'EMBEDDING MATCHES', value: '238' },
                    ]}
                  />
                </div>
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
        </div>
      </div>
    </div>
  );
}
