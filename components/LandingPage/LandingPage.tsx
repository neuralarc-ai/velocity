'use client';

import { useState } from 'react';
import { VIDEO_EXAMPLES } from '@/lib/examples';
import { RiEditLine, RiMicLine, RiShieldCheckLine } from 'react-icons/ri';

interface LandingPageProps {
  onStartAnalysis: (prompt: string) => void;
}

export default function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const [prompt, setPrompt] = useState('');

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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Velocity</h1>
          <p className="text-xl text-gray-600 mb-4">IP Attribution & Safety Platform</p>
          <p className="text-base text-gray-500">Protect your AI-generated content with comprehensive IP tracking and safety validation</p>
        </div>

        {/* Main Input Card */}
        <div className="bg-gradient-to-br from-[#f5f5f0] to-[#e8e8e3] rounded-2xl p-8 mb-8 shadow-lg">
          <div className="mb-6">
            <p className="text-gray-700 text-lg mb-2">
              Enter your creative prompt for video generation. Velocity will analyze IP attribution, perform safety checks, and validate content for monetization.
            </p>
            <p className="text-gray-600 text-sm">
              Describe the video content you want to generate. Include details about objects, scenes, actions, and any brand or IP elements.
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., 'athlete wearing Nike shoes running on a track' or 'people drinking Coca-Cola at a beach party'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-400"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Or, try an example:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {VIDEO_EXAMPLES.map(example => (
              <button
                key={example.id}
                onClick={() => setPrompt(example.video.description)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        {/* Start Analysis Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <RiShieldCheckLine className="w-5 h-5" />
            Start IP Analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
