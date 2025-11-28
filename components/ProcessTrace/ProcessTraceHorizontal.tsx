'use client';

import { useState, useEffect, useRef } from 'react';
import { RiTimeLine, RiCheckboxCircleLine, RiLoader4Line } from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending';
  description: string;
  details?: string[];
  icon?: React.ReactNode;
}

interface ProcessTraceHorizontalProps {
  steps: ProcessStep[];
  currentStep?: number;
}

export default function ProcessTraceHorizontal({ steps, currentStep }: ProcessTraceHorizontalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousStepsRef = useRef<ProcessStep[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrolledStepRef = useRef<number | null>(null);

  const isStepCompleted = (status: string) => {
    return status === 'Complete' || status === 'Passed' || status === 'Approved';
  };

  const isStepRunning = (status: string) => {
    return status === 'Running';
  };

  // Auto-scroll to current step horizontally
  useEffect(() => {
    if (!scrollContainerRef.current || !currentStep || steps.length === 0) return;

    const container = scrollContainerRef.current;
    const activeElement = container.querySelector(`[data-step-id="${currentStep}"]`) as HTMLElement;
    
    if (activeElement && lastScrolledStepRef.current !== currentStep) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      // Calculate scroll position to center the active step
      const scrollOffset = elementRect.left - containerRect.left - (containerRect.width / 2) + (elementRect.width / 2);
      
      container.scrollTo({
        left: container.scrollLeft + scrollOffset,
        behavior: 'smooth'
      });
      
      lastScrolledStepRef.current = currentStep;
    }
  }, [currentStep, steps]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complete':
      case 'Passed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-lime-green/50 text-brand-dark-green border border-brand-lime-green">
            {status}
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-dark-green text-white">
            {status}
          </span>
        );
      case 'Running':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-orange text-white animate-pulse">
            {status}
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-cream/50 text-gray-600 border border-brand-mint-green/30">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-mint-green/50 text-brand-dark-green">
            {status}
          </span>
        );
    }
  };

  const completedCount = steps.filter(s => isStepCompleted(s.status)).length;
  const totalSteps = steps.length;

  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <RiTimeLine className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-bold text-gray-900">Process Trace</h3>
          </div>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <RiTimeLine className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Process Started</h4>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Enter a prompt and click Generate to begin the pipeline execution. Steps will appear here in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiTimeLine className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-bold text-gray-900">Process Trace</h3>
          </div>
          <span className="text-xs text-gray-500">
            {completedCount} of {totalSteps} completed
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Steps */}
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto scroll-smooth p-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex gap-4 min-w-max">
          {steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.status);
            const isRunning = isStepRunning(step.status);
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                data-step-id={step.id}
                className="flex-shrink-0 w-64 transition-all duration-300"
              >
                {/* Step Card */}
                <div
                  className={`bg-white rounded-xl border-2 p-4 shadow-md transition-all duration-300 h-full flex flex-col ${
                    isRunning
                      ? 'border-brand-orange bg-brand-mint-green/30'
                      : isCompleted
                      ? 'border-brand-lime-green bg-brand-lime-green/20'
                      : 'border-brand-mint-green/20 bg-white'
                  } ${isActive ? 'ring-2 ring-brand-orange ring-offset-2 shadow-lg' : ''}`}
                >
                  {/* Step Number and Title */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="text-xs font-bold text-gray-400 block mb-1.5">STEP {step.id}</span>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{step.title}</h4>
                    </div>
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">{step.description}</p>

                  {/* Timeline Indicator */}
                  <div className="flex items-center justify-center mt-auto">
                    <div
                      className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-brand-dark-green shadow-lg'
                          : isRunning
                          ? 'bg-brand-orange shadow-lg animate-pulse'
                          : 'bg-brand-mint-green/50'
                      }`}
                    >
                      {isCompleted && (
                        <RiCheckboxCircleLine className="w-6 h-6 text-white" />
                      )}
                      {isRunning && (
                        <RiLoader4Line className="w-6 h-6 text-white animate-spin" />
                      )}
                      {!isCompleted && !isRunning && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

