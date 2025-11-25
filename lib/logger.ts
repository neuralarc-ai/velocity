/**
 * Execution Logging System
 * Implements FR1.4 - Log every execution step
 */

import { LogEntry } from './models';

export class PipelineLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  logStepStart(stepName: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'step_started',
      step: stepName,
      status: 'started',
      ...data,
    };
    this.addLog(entry);
  }

  logStepEnd(stepName: string, durationMs: number, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'step_completed',
      step: stepName,
      status: 'completed',
      duration_ms: durationMs,
      ...data,
    };
    this.addLog(entry);
  }

  logStepError(stepName: string, error: Error, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      event: 'step_failed',
      step: stepName,
      status: 'failed',
      error: error.message,
      error_type: error.constructor.name,
      ...data,
    };
    this.addLog(entry);
  }

  logAttribution(attributionType: string, result: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'attribution_calculated',
      attribution_type: attributionType,
      total_score: result.total_score,
      confidence: result.confidence,
      ip_attributions: result.ip_attributions,
    };
    this.addLog(entry);
  }

  logSafetyCheck(checkType: string, passed: boolean, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'safety_check_completed',
      check_type: checkType,
      passed,
      ...data,
    };
    this.addLog(entry);
  }

  logPipelineSummary(summary: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'pipeline_completed',
      ...summary,
    };
    this.addLog(entry);
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${entry.level.toUpperCase()}] ${entry.event}`, entry);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByStep(stepName: string): LogEntry[] {
    return this.logs.filter(log => log.step === stepName);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Global logger instance
export const pipelineLogger = new PipelineLogger();

