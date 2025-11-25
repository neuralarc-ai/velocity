'use client';

import { useState } from 'react';
import { RiBarChartLine } from 'react-icons/ri';

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  yAxisMax?: number;
  yAxisStep?: number;
  className?: string;
}

export default function BarChart({
  title,
  data,
  yAxisMax = 100,
  yAxisStep = 10,
  className = '',
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <RiBarChartLine className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Always use yAxisMax (100) as the maximum for scaling
  const maxValue = yAxisMax;
  const yAxisLabels: number[] = [];
  for (let i = 0; i <= yAxisMax; i += yAxisStep) {
    yAxisLabels.push(i);
  }

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const highestItem = sortedData[0];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <RiBarChartLine className="w-5 h-5 text-gray-600" />
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      </div>
      
      <div className="mb-4">
        <div className="flex items-end gap-4" style={{ height: '256px' }}>
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-full pr-3 border-r border-gray-200">
            {yAxisLabels.reverse().map((label) => (
              <span key={label} className="text-xs font-medium text-gray-500">
                {label}%
              </span>
            ))}
          </div>
          
          {/* Bars */}
          <div className="flex-1 flex items-end gap-4" style={{ height: '100%' }}>
            {sortedData.map((item, index) => {
              // item.value is already a percentage (e.g., 58 means 58%)
              // Height should be exactly item.value as percentage of chart height
              // Chart height is 256px, so 58% = 58% of 256px = 148.48px
              const heightPercent = Math.min(item.value, 100);
              const isHovered = hoveredIndex === index;
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center group relative"
                  style={{ height: '100%' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip - positioned just above the bar top */}
                  {isHovered && (
                    <div className="absolute px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap" style={{ bottom: `calc(${heightPercent}% - 2px)`, left: '50%', transform: 'translateX(-50%) translateY(-100%)' }}>
                      <div className="font-semibold mb-1">{item.label}</div>
                      <div className="text-gray-300">Attribution: {item.value.toFixed(1)}%</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bar Container - Full height (256px) for proper scaling */}
                  <div className="w-full h-full flex flex-col items-center justify-end relative">
                    {/* The bar itself - height is percentage of 256px container */}
                    <div
                      className={`w-full rounded-t transition-all duration-300 cursor-pointer ${
                        isHovered 
                          ? 'bg-green-600 shadow-lg' 
                          : 'bg-green-500 hover:bg-green-550'
                      }`}
                      style={{ 
                        height: `${heightPercent}%`,
                        minHeight: '4px',
                        width: '100%',
                      }}
                    />
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* X-axis labels - positioned below the chart area */}
        <div className="flex items-start gap-4 mt-2" style={{ paddingLeft: 'calc(3rem + 12px)' }}>
          {sortedData.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div key={index} className="flex-1 text-center">
                <span className={`text-xs font-medium transition-all ${
                  isHovered ? 'text-gray-900 font-semibold scale-105' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-600">Total Sources: </span>
              <span className="font-bold text-gray-900">{data.length}</span>
            </div>
            {highestItem && (
              <div>
                <span className="text-gray-600">Highest: </span>
                <span className="font-bold text-gray-900">
                  {highestItem.label} ({highestItem.value.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Calculation Method: Relevance Score Based
          </div>
        </div>
      </div>
    </div>
  );
}
