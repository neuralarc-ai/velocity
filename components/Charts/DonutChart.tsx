'use client';

import { useState, useEffect } from 'react';
import { RiTimeLine } from 'react-icons/ri';
import { formatPercentageValue } from '@/lib/utils';

interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutChartData[];
  metrics?: { label: string; value: string | number }[];
  className?: string;
}

export default function DonutChart({
  title,
  data,
  metrics,
  className = '',
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <RiTimeLine className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  // Create donut chart segments
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Outer radius and inner radius for donut
    const outerRadius = 45;
    const innerRadius = 25;
    
    // Convert angles to radians (starting from top, so -90 degrees offset)
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate outer arc points
    const outerX1 = 50 + outerRadius * Math.cos(startRad);
    const outerY1 = 50 + outerRadius * Math.sin(startRad);
    const outerX2 = 50 + outerRadius * Math.cos(endRad);
    const outerY2 = 50 + outerRadius * Math.sin(endRad);
    
    // Calculate inner arc points (going backwards)
    const innerX1 = 50 + innerRadius * Math.cos(endRad);
    const innerY1 = 50 + innerRadius * Math.sin(endRad);
    const innerX2 = 50 + innerRadius * Math.cos(startRad);
    const innerY2 = 50 + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    // Create donut path: start at outer point, arc to next outer point, line to inner, arc back, close
    const path = `M ${outerX1} ${outerY1} 
                  A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerX2} ${outerY2}
                  L ${innerX1} ${innerY1}
                  A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX2} ${innerY2}
                  Z`;

    return {
      ...item,
      percentage,
      angle,
      path,
      startAngle,
      endAngle,
    };
  });

  if (!mounted) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <RiTimeLine className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <RiTimeLine className="w-5 h-5 text-gray-600" />
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Chart */}
        <div className="relative w-48 h-48 flex-shrink-0" style={{ minHeight: '192px' }}>
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            style={{ transform: 'rotate(-90deg)' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {segments.map((segment, index) => {
              const isHovered = hoveredIndex === index;
              
              return (
                <path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="1.5"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    opacity: isHovered ? 1 : hoveredIndex !== null ? 0.5 : 1,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>
          
          {/* Center text - shows only hovered segment percentage */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {hoveredIndex !== null && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentageValue(segments[hoveredIndex].value)}%
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 pt-2">
          <div className="space-y-3">
            {segments.map((item, index) => {
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 transition-all ${
                    isHovered ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="w-4 h-4 flex-shrink-0 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1 font-medium">{metric.label}</div>
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
