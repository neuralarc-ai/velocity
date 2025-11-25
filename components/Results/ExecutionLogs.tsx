'use client';

import { useEffect, useState } from 'react';
import { pipelineLogger } from '@/lib/logger';
import { LogEntry } from '@/lib/models';
import { RiFileListLine, RiCloseLine } from 'react-icons/ri';

export default function ExecutionLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Update logs periodically
    const interval = setInterval(() => {
      setLogs(pipelineLogger.getLogs());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <RiFileListLine className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Execution Logs</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
            {logs.length} entries
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <RiCloseLine
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No logs yet</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${getLogColor(log.level)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.event}</span>
                      {log.step && (
                        <span className="px-2 py-0.5 bg-white/50 rounded text-xs">
                          {log.step}
                        </span>
                      )}
                    </div>
                    <span className="text-xs opacity-70">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  {log.duration_ms !== undefined && (
                    <div className="text-xs opacity-80 mt-1">
                      Duration: {log.duration_ms.toFixed(2)}ms
                    </div>
                  )}
                  {log.error && (
                    <div className="text-xs mt-1 font-medium">Error: {log.error}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

