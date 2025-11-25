/**
 * Data Models for Strand AI PoC
 * TypeScript models matching the Python Pydantic models
 */

export interface IPContent {
  id: string;
  type: 'logo' | 'character' | 'music' | 'product';
  owner: string;
  name: string;
  embedding?: number[];
  embedding_model?: string;
  metadata: Record<string, unknown>;
  license_terms: Record<string, unknown>;
  license_type?: string;
  licensed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttributionResult {
  total_score: number;
  confidence: number;
  ip_attributions: Record<string, number>;
  calculation_type: 'initial' | 'final';
  algorithm_used: string;
  details: Record<string, unknown>;
  timestamp: string;
  variance_from_initial?: number;
  reconciliation_notes?: string;
}

export interface SafetyResult {
  passed: boolean;
  check_type: 'pre_generation' | 'post_generation';
  violations: string[];
  violation_details: Array<Record<string, unknown>>;
  contamination_score: number;
  contamination_threshold: number;
  timestamp: string;
  details: Record<string, unknown>;
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface PipelineState {
  execution_id: string;
  current_step: string;
  current_step_status: StepStatus;
  completed_steps: string[];
  failed_steps: string[];
  context: Record<string, unknown>;
  results: Record<string, unknown>;
  errors: Array<{
    step: string;
    error: string;
    error_type: string;
    timestamp: string;
  }>;
  started_at: string;
  updated_at: string;
  completed_at?: string;
  total_duration_ms?: number;
  step_durations: Record<string, number>;
}

export interface PipelineResult {
  execution_id: string;
  status: 'success' | 'failed';
  error?: string;
  total_duration_ms?: number;
  completed_steps: string[];
  failed_steps: string[];
  results: {
    prompt: {
      original_prompt: string;
      processed_prompt: string;
      timestamp: string;
    };
    retrieved_context: {
      retrieved_ips: Array<{
        id: string;
        type: string;
        owner: string;
        name: string;
        relevance_score: number;
      }>;
      retrieval_method: string;
      timestamp: string;
    };
    initial_attribution: AttributionResult;
    pre_gen_safety: SafetyResult;
    augmented_prompt: string;
    generated_video: {
      video_path: string;
      duration: number;
      resolution: string;
      model_used: string;
      timestamp: string;
    };
    post_gen_safety: SafetyResult;
    final_attribution: AttributionResult;
    video_analysis: {
      analysis: string;
      detected_objects: string[];
      detected_brands: string[];
      timestamp: string;
    };
  };
  partial_results?: Record<string, unknown>;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warning' | 'debug';
  event: string;
  step?: string;
  status?: string;
  duration_ms?: number;
  [key: string]: unknown;
}

