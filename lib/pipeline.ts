/**
 * Main Pipeline Orchestration
 * Implements FR1.1 - Code Execution Framework
 */

import {
  PipelineResult,
  PipelineState,
  AttributionResult,
  SafetyResult,
  StepStatus,
} from './models';
import { pipelineLogger } from './logger';
import { matchPromptToExample, VideoExample } from './examples';
import { database } from './database';

// Simulate async delay for realistic execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class StrandPipeline {
  private state: PipelineState | null = null;
  private logger = pipelineLogger;

  async execute(prompt: string): Promise<PipelineResult> {
    // Match prompt to example
    const matchedExample = matchPromptToExample(prompt);
    
    if (!matchedExample) {
      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.logger.logStepError('pipeline_execution', new Error('No matching example found'), { prompt });
      return this.createFailureResult('No matching example found for the given prompt', {});
    }
    
    // Initialize execution state
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.state = {
      execution_id: executionId,
      current_step: 'initialization',
      current_step_status: 'pending',
      completed_steps: [],
      failed_steps: [],
      context: { matched_example_id: matchedExample.id },
      results: {},
      errors: [],
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      step_durations: {},
    };

    this.logger.logStepStart('pipeline_execution', { 
      execution_id: executionId,
      matched_example: matchedExample.name,
    });
    const startTime = Date.now();

    try {
      // Use hardcoded results from matched example
      const results: Record<string, unknown> = {};

      // Step 1: Prompt Input
      results['prompt'] = await this.step1PromptInput(prompt);

      // Step 2: Vector Retrieval (use example data)
      results['retrieved_context'] = await this.step2VectorRetrievalWithExample(
        prompt,
        matchedExample
      );

      // Step 3: Initial Attribution (use example data)
      results['initial_attribution'] = matchedExample.results.initial_attribution;
      await this.logStep('initial_attribution', 300);

      // Step 4: Pre-Generation Safety Check (use example data)
      results['pre_gen_safety'] = matchedExample.results.pre_gen_safety;
      await this.logStep('pre_generation_safety', 100);

      // Check if safety passed - if not, mark video generation as failed but continue analysis
      const preSafety = results['pre_gen_safety'] as SafetyResult;
      let generationBlocked = false;
      if (!preSafety.passed) {
        this.logger.logStepError(
          'pre_generation_safety',
          new Error('Safety check failed'),
          { violations: preSafety.violations }
        );
        generationBlocked = true;
        // Mark this step as failed but continue
        if (this.state) {
          this.state.failed_steps.push('pre_generation_safety');
        }
      }

      // Step 5: Prompt Augmentation (use example data)
      results['augmented_prompt'] = matchedExample.results.augmented_prompt;
      await this.logStep('prompt_augmentation', 150);

      // Step 6: Video Generation (use example data)
      results['generated_video'] = matchedExample.results.generated_video;
      if (generationBlocked) {
        // Mark video generation as failed
        this.logger.logStepError(
          'video_generation',
          new Error('Video generation blocked due to pre-generation safety check failure'),
          { reason: 'IP conflict detected' }
        );
        if (this.state) {
          this.state.failed_steps.push('video_generation');
          this.updateState('video_generation', 0, 'failed');
          // Mark all subsequent steps as skipped
          const subsequentSteps = [
            'post_generation_safety',
            'final_attribution',
            'video_analysis',
          ];
          subsequentSteps.forEach(step => {
            this.state!.failed_steps.push(step);
            this.updateState(step, 0, 'failed');
          });
        }
        await delay(100); // Short delay to show failure
        // Skip remaining steps when generation fails - still populate results for display
        results['post_gen_safety'] = matchedExample.results.post_gen_safety;
        results['final_attribution'] = matchedExample.results.final_attribution;
        results['video_analysis'] = matchedExample.results.video_analysis;
      } else {
        await this.logStep('video_generation', 1000);

        // Step 7: Post-Generation Safety Check (use example data)
        results['post_gen_safety'] = matchedExample.results.post_gen_safety;
        await this.logStep('post_generation_safety', 150);

        // Check if safety passed - log error but continue to show analysis
        const postSafety = results['post_gen_safety'] as SafetyResult;
        if (!postSafety.passed) {
          this.logger.logStepError(
            'post_generation_safety',
            new Error('Safety check failed'),
            { violations: postSafety.violations }
          );
          if (this.state) {
            this.state.failed_steps.push('post_generation_safety');
          }
        }

        // Step 8: Final Attribution (use example data)
        results['final_attribution'] = matchedExample.results.final_attribution;
        await this.logStep('final_attribution', 400);

        // Step 9: Video Analysis (use example data)
        results['video_analysis'] = matchedExample.results.video_analysis;
        await this.logStep('video_analysis', 250);
      }

      // Step 10: Logging and Display
      const finalResult = await this.step10LoggingAndDisplay(results);

      // Calculate total duration
      const totalDuration = Date.now() - startTime;
      if (this.state) {
        this.state.total_duration_ms = totalDuration;
        this.state.completed_at = new Date().toISOString();
      }

      // Determine final status - if generation was blocked, mark as failed but include all results
      const hasFailures = generationBlocked || (this.state?.failed_steps.length ?? 0) > 0;
      if (hasFailures) {
        finalResult.status = 'failed';
        finalResult.error = generationBlocked 
          ? 'Video generation blocked due to IP conflict. Analysis completed.'
          : 'Some pipeline steps failed. Analysis completed.';
      }

      // Add matched example info to result
      (finalResult as any).matched_example_id = matchedExample.id;
      (finalResult as any).matched_example_name = matchedExample.name;

      // Save to database
      const logs = this.logger.getLogs();
      await database.saveExecution(prompt, matchedExample.id, finalResult, logs);

      this.logger.logStepEnd('pipeline_execution', totalDuration, {
        execution_id: executionId,
        status: hasFailures ? 'failed' : 'success',
        example_id: matchedExample.id,
      });

      return finalResult;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.logStepError('pipeline_execution', err, { execution_id: executionId });
      return this.createFailureResult(err.message, {});
    }
  }

  private async logStep(stepName: string, duration: number): Promise<void> {
    this.logger.logStepStart(stepName);
    await delay(duration);
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration);
  }

  private async step2VectorRetrievalWithExample(
    prompt: string,
    example: VideoExample
  ): Promise<Record<string, unknown>> {
    const stepName = 'vector_retrieval';
    this.logger.logStepStart(stepName, { prompt, example_id: example.id });
    const startTime = Date.now();
    await delay(200);

    const result = example.results.retrieved_context;

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration, { 
      retrieved_count: result.retrieved_ips.length,
      example_id: example.id,
    });
    return result;
  }

  private async step1PromptInput(prompt: string): Promise<Record<string, unknown>> {
    const stepName = 'prompt_input';
    this.logger.logStepStart(stepName, { prompt });
    const startTime = Date.now();
    await delay(50); // Simulate processing

    const result = {
      original_prompt: prompt,
      processed_prompt: prompt.trim(),
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step2VectorRetrieval(prompt: string): Promise<Record<string, unknown>> {
    const stepName = 'vector_retrieval';
    this.logger.logStepStart(stepName, { prompt });
    const startTime = Date.now();
    await delay(200); // Simulate DB query

    // STUB: Return pre-loaded context
    const result = {
      retrieved_ips: [
        {
          id: 'ip_001',
          type: 'logo',
          owner: 'Nike',
          name: 'Nike Swoosh',
          relevance_score: 0.95,
        },
      ],
      retrieval_method: 'stub',
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration, { retrieved_count: 1 });
    return result;
  }

  private async step3InitialAttribution(
    retrievedContext: Record<string, unknown>
  ): Promise<AttributionResult> {
    const stepName = 'initial_attribution';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(300); // Simulate calculation

    // STUB: Return mock attribution
    const result: AttributionResult = {
      total_score: 0.85,
      confidence: 0.92,
      ip_attributions: { Nike: 0.85 },
      calculation_type: 'initial',
      algorithm_used: 'stub_weighted_average',
      details: {},
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logAttribution('initial', result as unknown as Record<string, unknown>);
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step4PreGenerationSafety(
    prompt: string,
    context: Record<string, unknown>
  ): Promise<SafetyResult> {
    const stepName = 'pre_generation_safety';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(100); // Simulate check

    // STUB: Always pass for demo
    const result: SafetyResult = {
      passed: true,
      check_type: 'pre_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.0,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: {},
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logSafetyCheck('pre_generation', true);
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step5PromptAugmentation(
    prompt: string,
    context: Record<string, unknown>
  ): Promise<string> {
    const stepName = 'prompt_augmentation';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(150); // Simulate augmentation

    // STUB: Simple augmentation
    const retrievedIps = (context.retrieved_ips as Array<{ name: string }>) || [];
    let augmented = prompt;
    if (retrievedIps.length > 0) {
      const ipNames = retrievedIps.map(ip => ip.name);
      augmented = `${prompt} featuring ${ipNames.join(', ')}`;
    }

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration, { augmented_prompt: augmented });
    return augmented;
  }

  private async step6VideoGeneration(augmentedPrompt: string): Promise<Record<string, unknown>> {
    const stepName = 'video_generation';
    this.logger.logStepStart(stepName, { prompt: augmentedPrompt });
    const startTime = Date.now();
    await delay(1000); // Simulate video generation

    // STUB: Return mock video path
    const result = {
      video_path: 'data/preloaded/videos/demo_video.mp4',
      duration: 5.0,
      resolution: '1080p',
      model_used: 'stub',
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step7PostGenerationSafety(
    video: Record<string, unknown>
  ): Promise<SafetyResult> {
    const stepName = 'post_generation_safety';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(150); // Simulate check

    // STUB: Always pass for demo
    const result: SafetyResult = {
      passed: true,
      check_type: 'post_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.02,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: {},
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logSafetyCheck('post_generation', true, { contamination: 0.02 });
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step8FinalAttribution(
    video: Record<string, unknown>,
    originalContext: Record<string, unknown>
  ): Promise<AttributionResult> {
    const stepName = 'final_attribution';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(400); // Simulate calculation

    // STUB: Return mock attribution with small variance
    const result: AttributionResult = {
      total_score: 0.84,
      confidence: 0.90,
      ip_attributions: { Nike: 0.84 },
      calculation_type: 'final',
      algorithm_used: 'stub_weighted_average',
      variance_from_initial: -0.01, // 1% lower than initial
      details: {},
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logAttribution('final', result as unknown as Record<string, unknown>);
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step9VideoAnalysis(video: Record<string, unknown>): Promise<Record<string, unknown>> {
    const stepName = 'video_analysis';
    this.logger.logStepStart(stepName);
    const startTime = Date.now();
    await delay(250); // Simulate analysis

    // STUB: Return mock analysis
    const result = {
      analysis: 'Video contains Nike logo, athletic shoe product, duration 5 seconds',
      detected_objects: ['logo', 'shoe', 'person'],
      detected_brands: ['Nike'],
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    this.updateState(stepName, duration, 'completed');
    this.logger.logStepEnd(stepName, duration);
    return result;
  }

  private async step10LoggingAndDisplay(results: Record<string, unknown>): Promise<PipelineResult> {
    const stepName = 'logging_and_display';
    this.logger.logStepStart(stepName);

    // Create summary
    const summary: PipelineResult = {
      execution_id: this.state?.execution_id || 'unknown',
      status: 'success',
      total_duration_ms: this.state?.total_duration_ms,
      completed_steps: this.state?.completed_steps || [],
      failed_steps: this.state?.failed_steps || [],
      results: {
        prompt: results['prompt'] as PipelineResult['results']['prompt'],
        retrieved_context: results['retrieved_context'] as PipelineResult['results']['retrieved_context'],
        initial_attribution: results['initial_attribution'] as AttributionResult,
        pre_gen_safety: results['pre_gen_safety'] as SafetyResult,
        augmented_prompt: results['augmented_prompt'] as string,
        generated_video: results['generated_video'] as PipelineResult['results']['generated_video'],
        post_gen_safety: results['post_gen_safety'] as SafetyResult,
        final_attribution: results['final_attribution'] as AttributionResult,
        video_analysis: results['video_analysis'] as PipelineResult['results']['video_analysis'],
      },
    };

    this.logger.logPipelineSummary(summary as unknown as Record<string, unknown>);
    this.logger.logStepEnd(stepName, 0);
    return summary;
  }

  private updateState(stepName: string, duration: number, status: StepStatus): void {
    if (!this.state) return;

    this.state.current_step = stepName;
    this.state.current_step_status = status;
    this.state.step_durations[stepName] = duration;
    this.state.updated_at = new Date().toISOString();

    if (status === 'completed') {
      this.state.completed_steps.push(stepName);
    } else if (status === 'failed') {
      this.state.failed_steps.push(stepName);
    }
  }

  private createFailureResult(
    errorMessage: string,
    partialResults: Record<string, unknown>
  ): PipelineResult {
    return {
      execution_id: this.state?.execution_id || 'unknown',
      status: 'failed',
      error: errorMessage,
      partial_results: partialResults,
      completed_steps: this.state?.completed_steps || [],
      failed_steps: this.state?.failed_steps || [],
      results: {} as PipelineResult['results'],
    };
  }

  getState(): PipelineState | null {
    return this.state;
  }
}

