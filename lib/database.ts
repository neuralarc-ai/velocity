/**
 * Database Integration for Real-time Data
 * Currently uses localStorage for client-side, but structured for easy DB swap
 */

import { PipelineResult, LogEntry } from './models';

export interface DatabaseRecord {
  id: string;
  prompt: string;
  example_id: string;
  result: PipelineResult;
  logs: LogEntry[];
  created_at: string;
  updated_at: string;
}

class Database {
  private storageKey = 'strand_ai_executions';
  private maxRecords = 100;

  /**
   * Save execution result to database
   */
  async saveExecution(
    prompt: string,
    exampleId: string,
    result: PipelineResult,
    logs: LogEntry[]
  ): Promise<string> {
    const record: DatabaseRecord = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      example_id: exampleId,
      result,
      logs,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const records = this.getAllRecords();
    records.push(record);

    // Keep only last maxRecords
    if (records.length > this.maxRecords) {
      records.splice(0, records.length - this.maxRecords);
    }

    this.saveRecords(records);
    return record.id;
  }

  /**
   * Get all execution records
   */
  getAllRecords(): DatabaseRecord[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from database:', error);
      return [];
    }
  }

  /**
   * Get execution by ID
   */
  getExecutionById(id: string): DatabaseRecord | null {
    const records = this.getAllRecords();
    return records.find(r => r.id === id) || null;
  }

  /**
   * Get recent executions
   */
  getRecentExecutions(limit: number = 10): DatabaseRecord[] {
    const records = this.getAllRecords();
    return records
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  /**
   * Get executions by example ID
   */
  getExecutionsByExample(exampleId: string): DatabaseRecord[] {
    const records = this.getAllRecords();
    return records.filter(r => r.example_id === exampleId);
  }

  /**
   * Clear all records
   */
  clearAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Save records to storage
   */
  private saveRecords(records: DatabaseRecord[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    total_executions: number;
    by_example: Record<string, number>;
    average_duration_ms: number;
  } {
    const records = this.getAllRecords();
    const byExample: Record<string, number> = {};
    let totalDuration = 0;
    let countWithDuration = 0;

    records.forEach(record => {
      byExample[record.example_id] = (byExample[record.example_id] || 0) + 1;
      if (record.result.total_duration_ms) {
        totalDuration += record.result.total_duration_ms;
        countWithDuration++;
      }
    });

    return {
      total_executions: records.length,
      by_example: byExample,
      average_duration_ms: countWithDuration > 0 ? totalDuration / countWithDuration : 0,
    };
  }
}

// Export singleton instance
export const database = new Database();

