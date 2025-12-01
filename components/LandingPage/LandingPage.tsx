'use client';

import { useState } from 'react';
import { VIDEO_EXAMPLES } from '@/lib/examples';
import { 
  RiShieldCheckLine, 
  RiSparklingFill, 
  RiArrowRightLine,
  RiLightbulbFlashLine,
  RiSearchLine,
  RiBarChartLine,
  RiShieldStarLine
} from 'react-icons/ri';

interface LandingPageProps {
  onStartAnalysis: (prompt: string) => void;
}

export default function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onStartAnalysis(prompt);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-mint-green/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-lime-green/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-brand-dark-green mb-6 leading-tight">
              Velocity
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-light">
              Protect Your AI-Generated Content
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Comprehensive IP tracking, safety validation, and monetization verification for your creative content
            </p>
          </div>

          {/* Main Input Card */}
          <div className="mb-12 animate-fade-in-up">
            <div className={`relative bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200 transition-all duration-300 ${
              isFocused ? 'ring-4 ring-blue-500/20 border-blue-500 scale-[1.01]' : 'hover:shadow-xl'
            }`}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-brand-orange rounded-lg">
                    <RiLightbulbFlashLine className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Describe Your Content</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Enter your creative prompt for video generation. Velocity will analyze IP attribution, perform comprehensive safety checks, and validate content for monetization.
                </p>
              </div>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your prompt here..."
                  className="w-full px-6 py-4 border-2 border-brand-mint-green/30 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange resize-none bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 text-lg leading-relaxed"
                  rows={6}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-gray-400">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Enter</kbd>
                  <span>to submit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mb-12 animate-fade-in-up delay-200">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                <RiSearchLine className="w-5 h-5 text-gray-500" />
                Try an example
              </h3>
              <p className="text-sm text-gray-500">Click to load a sample prompt</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {VIDEO_EXAMPLES.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setPrompt(example.video.description)}
                  className="group px-6 py-3 bg-white border border-brand-mint-green/30 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-mint-green/30 hover:border-brand-orange hover:text-brand-dark-green hover:shadow-md transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex items-center gap-2">
                    {example.name}
                    <RiArrowRightLine className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Start Analysis Button */}
          <div className="flex justify-center animate-fade-in-up delay-300">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="group relative px-10 py-5 bg-brand-orange text-white rounded-2xl font-semibold text-lg hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <RiShieldCheckLine className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Start IP Analysis</span>
              <RiArrowRightLine className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-400">
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-mint-green/30 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-brand-mint-green/50 rounded-lg w-fit mb-4">
                <RiBarChartLine className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IP Attribution</h3>
              <p className="text-sm text-gray-600">Comprehensive tracking and analysis of intellectual property elements</p>
            </div>
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-lime-green/30 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-brand-lime-green/50 rounded-lg w-fit mb-4">
                <RiShieldCheckLine className="w-6 h-6 text-brand-dark-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Checks</h3>
              <p className="text-sm text-gray-600">Automated validation against safety rules and compliance standards</p>
            </div>
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-brand-mint-green/30 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-brand-dark-green rounded-lg w-fit mb-4">
                <RiShieldStarLine className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Monetization Ready</h3>
              <p className="text-sm text-gray-600">Validate content for safe monetization and distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
