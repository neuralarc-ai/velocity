'use client';

import { RiEditLine } from 'react-icons/ri';

interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  title?: string;
}

export default function PromptInput({ prompt, onChange, disabled, title = 'Prompt Input' }: PromptInputProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <RiEditLine className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter your creative prompt:
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompt here..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white"
        rows={4}
        disabled={disabled}
      />
    </div>
  );
}

