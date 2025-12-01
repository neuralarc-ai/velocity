'use client';

import { useState, useEffect, useRef } from 'react';
import { RiTimeLine, RiCheckboxCircleLine, RiLoader4Line, RiErrorWarningLine, RiFileTextLine, RiLightbulbLine, RiShieldCheckLine, RiDatabaseLine, RiBarChartLine, RiRefreshLine, RiVideoLine, RiEyeLine, RiAlertLine, RiMoneyDollarCircleLine, RiCloseLine, RiForbidLine } from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending' | 'Failed' | 'Blocked' | 'Skipped';
  description: string;
  details?: string[];
  icon?: React.ReactNode;
}

interface ProcessTraceProps {
  steps: ProcessStep[];
  currentStep?: number;
}

export default function ProcessTrace({ steps, currentStep }: ProcessTraceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousStepsRef = useRef<ProcessStep[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrolledStepRef = useRef<number | null>(null);
  const getStepIcon = (stepId: number, status: string) => {
    const iconClass = "w-5 h-5";
    
    if (status === 'Complete' || status === 'Passed' || status === 'Approved') {
      return <RiCheckboxCircleLine className={`${iconClass} text-brand-dark-green`} />;
    }
    if (status === 'Failed' || status === 'Blocked') {
      return <RiCloseLine className={`${iconClass} text-red-500`} />;
    }
    if (status === 'Skipped') {
      return <RiForbidLine className={`${iconClass} text-gray-400`} />;
    }
    if (status === 'Running') {
      return <RiLoader4Line className={`${iconClass} text-brand-orange animate-spin`} />;
    }
    
    // Default icons for each step
    const stepIcons: Record<number, React.ReactNode> = {
      1: <RiFileTextLine className={`${iconClass} text-gray-400`} />,
      2: <RiLightbulbLine className={`${iconClass} text-gray-400`} />,
      3: <RiShieldCheckLine className={`${iconClass} text-gray-400`} />,
      4: <RiDatabaseLine className={`${iconClass} text-gray-400`} />,
      5: <RiBarChartLine className={`${iconClass} text-gray-400`} />,
      6: <RiRefreshLine className={`${iconClass} text-gray-400`} />,
      7: <RiVideoLine className={`${iconClass} text-gray-400`} />,
      8: <RiEyeLine className={`${iconClass} text-gray-400`} />,
      9: <RiBarChartLine className={`${iconClass} text-gray-400`} />,
      10: <RiAlertLine className={`${iconClass} text-gray-400`} />,
      11: <RiShieldCheckLine className={`${iconClass} text-gray-400`} />,
      12: <RiMoneyDollarCircleLine className={`${iconClass} text-gray-400`} />,
    };
    
    return stepIcons[stepId] || <RiTimeLine className={`${iconClass} text-gray-400`} />;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold transition-all";
    
    switch (status) {
      case 'Complete':
        return (
          <span className={`${baseClasses} bg-brand-lime-green/50 text-brand-dark-green border border-brand-lime-green`}>
            Complete
          </span>
        );
      case 'Passed':
        return (
          <span className={`${baseClasses} bg-brand-lime-green/50 text-brand-dark-green border border-brand-lime-green`}>
            Passed
          </span>
        );
      case 'Approved':
        return (
          <span className={`${baseClasses} bg-brand-dark-green text-white border border-brand-dark-green`}>
            Approved
          </span>
        );
      case 'Failed':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 border border-red-300`}>
            Failed
          </span>
        );
      case 'Blocked':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 border border-red-300`}>
            Blocked
          </span>
        );
      case 'Skipped':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-500 border border-gray-300`}>
            Skipped
          </span>
        );
      case 'Running':
        return (
          <span className={`${baseClasses} bg-brand-mint-green/50 text-brand-orange border border-brand-orange animate-pulse`}>
            Running...
          </span>
        );
      case 'Pending':
        return (
          <span className={`${baseClasses} bg-brand-cream/50 text-gray-500 border border-brand-mint-green/30`}>
            Pending
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-brand-cream/50 text-gray-500 border border-brand-mint-green/30`}>
            {status}
          </span>
        );
    }
  };

  const isStepCompleted = (status: string) => {
    return status === 'Complete' || status === 'Passed' || status === 'Approved';
  };

  const isStepFailed = (status: string) => {
    return status === 'Failed' || status === 'Blocked';
  };

  const isStepSkipped = (status: string) => {
    return status === 'Skipped';
  };

  const isStepRunning = (status: string) => {
    return status === 'Running';
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-brand-mint-green/30 bg-brand-cream/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center">
            <RiTimeLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Process Trace</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {steps.length > 0 ? (
                <>
                  {steps.filter(s => isStepCompleted(s.status)).length} completed
                  {steps.filter(s => isStepFailed(s.status)).length > 0 && ` • ${steps.filter(s => isStepFailed(s.status)).length} failed`}
                  {steps.filter(s => isStepSkipped(s.status)).length > 0 && ` • ${steps.filter(s => isStepSkipped(s.status)).length} skipped`}
                </>
              ) : 'Real-time execution tracking'}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Container */}
      <div ref={scrollContainerRef} className="flex-1 p-6 scroll-smooth">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <RiTimeLine className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Process Started</h4>
            <p className="text-sm text-gray-500 max-w-xs">
              Enter a prompt and click Generate to begin the pipeline execution. Steps will appear here in real-time.
            </p>
          </div>
          ) : (
            <div className="relative">

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = isStepCompleted(step.status);
                const isFailed = isStepFailed(step.status);
                const isSkipped = isStepSkipped(step.status);
                const isRunning = isStepRunning(step.status);
                const isActive = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    data-step-id={step.id}
                    className={`relative pl-14 transition-all duration-300 ${
                      isActive ? 'scale-[1.02]' : ''
                    }`}
                  >
                    {/* Step Card */}
                    <div
                      className={`bg-white rounded-xl border-2 p-5 shadow-sm transition-all duration-300 ${
                        isRunning
                          ? 'border-brand-orange bg-brand-mint-green/30 shadow-md'
                          : isFailed
                          ? 'border-red-300 bg-red-50/50'
                          : isSkipped
                          ? 'border-gray-400 bg-gray-100/80 opacity-75'
                          : isCompleted
                          ? 'border-brand-lime-green bg-brand-lime-green/20'
                          : 'border-brand-mint-green/20 bg-white'
                      } ${isActive ? 'ring-2 ring-brand-orange ring-offset-2' : ''}`}
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Step Info */}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-gray-400 block mb-1">STEP {step.id}</span>
                            <h4 className={`text-base font-bold mb-2 ${
                              isFailed ? 'text-red-700 line-through' : 
                              isSkipped ? 'text-gray-600 line-through decoration-2' : 
                              'text-gray-900'
                            }`}>{step.title}</h4>
                            <p className={`text-sm leading-relaxed ${
                              isFailed ? 'text-red-600' : 
                              isSkipped ? 'text-gray-600 italic' : 
                              'text-gray-600'
                            }`}>{step.description}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0 ml-4">
                          {getStatusBadge(step.status)}
                        </div>
                      </div>

                      {/* Step Details */}
                      {step.details && step.details.length > 0 && (
                        <div className={`mt-4 pt-4 border-t ${
                          isSkipped ? 'border-gray-300' : 'border-gray-100'
                        }`}>
                          <div className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                  isSkipped ? 'bg-gray-500' : 'bg-gray-400'
                                }`} />
                                <p className={`text-xs leading-relaxed ${
                                  isSkipped ? 'text-gray-600 italic' : 'text-gray-600'
                                }`}>{detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-6 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-brand-dark-green shadow-lg shadow-brand-lime-green/50'
                          : isFailed
                          ? 'bg-red-500 shadow-lg shadow-red-500/50'
                          : isSkipped
                          ? 'bg-gray-400 shadow-lg shadow-gray-400/50'
                          : isRunning
                          ? 'bg-brand-orange shadow-lg shadow-brand-orange/50 animate-pulse'
                          : 'bg-brand-mint-green/50'
                      }`}
                    >
                      {isCompleted && (
                        <RiCheckboxCircleLine className="w-6 h-6 text-white" />
                      )}
                      {isFailed && (
                        <RiCloseLine className="w-6 h-6 text-white" />
                      )}
                      {isSkipped && (
                        <RiForbidLine className="w-6 h-6 text-white" />
                      )}
                      {isRunning && (
                        <RiLoader4Line className="w-6 h-6 text-white animate-spin" />
                      )}
                      {!isCompleted && !isFailed && !isSkipped && !isRunning && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {steps.length > 0 && (
        <div className="p-4 border-t border-brand-mint-green/30 bg-brand-cream/30">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-dark-green" />
                <span className="text-gray-600">
                  Completed: <span className="font-semibold text-brand-dark-green">
                    {steps.filter(s => isStepCompleted(s.status)).length}
                  </span>
                </span>
              </div>
              {steps.some(s => isStepRunning(s.status)) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-gray-600">
                    Running: <span className="font-semibold text-brand-orange">1</span>
                  </span>
                </div>
              )}
              {steps.some(s => isStepFailed(s.status)) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-600">
                    Failed: <span className="font-semibold text-red-600">{steps.filter(s => isStepFailed(s.status)).length}</span>
                  </span>
                </div>
              )}
              {steps.some(s => isStepSkipped(s.status)) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600">
                    Skipped: <span className="font-semibold text-gray-500">{steps.filter(s => isStepSkipped(s.status)).length}</span>
                  </span>
                </div>
              )}
            </div>
            <span className="text-gray-500">
              Total: <span className="font-semibold text-gray-700">{steps.length}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
