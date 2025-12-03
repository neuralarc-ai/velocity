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

  /**
   * Log augmented prompt (input before video generation/v03)
   * This is the prompt that will be sent to the video generation model
   */
  logAugmentedPrompt(
    originalPrompt: string,
    augmentedPrompt: string,
    context: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'augmented_prompt_generated',
      step: 'prompt_augmentation',
      original_prompt: originalPrompt,
      augmented_prompt: augmentedPrompt,
      context: context,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('STEP 5: PROMPT AUGMENTATION - Preparing Input for Video Generation');
    
    console.log('Before generating the video, we enhance your original prompt with additional context about intellectual property (IP) elements that were found. This helps the video generation model understand what content to create while being aware of IP considerations.');
    
    console.log('\nYOUR ORIGINAL PROMPT:');
    console.log(`"${originalPrompt}"`);
    
    // Extract retrieved IPs for better display - handle nested structure
    let retrievedIPs: Array<{ name: string; owner: string; type: string; relevance_score?: number }> | undefined;
    
    if (context.retrieved_ips) {
      if (Array.isArray(context.retrieved_ips)) {
        retrievedIPs = context.retrieved_ips as Array<{ name: string; owner: string; type: string; relevance_score?: number }>;
      } else if (typeof context.retrieved_ips === 'object' && 'retrieved_ips' in context.retrieved_ips) {
        const nestedContext = context.retrieved_ips as { retrieved_ips: Array<{ name: string; owner: string; type: string; relevance_score?: number }> };
        retrievedIPs = nestedContext.retrieved_ips;
      }
    }
    
    if (retrievedIPs && retrievedIPs.length > 0) {
      console.log('\nINTELLECTUAL PROPERTY ELEMENTS FOUND:');
      retrievedIPs.forEach((ip, index) => {
        const relevance = ip.relevance_score ? ` (${(ip.relevance_score * 100).toFixed(0)}% match)` : '';
        console.log(`${index + 1}. ${ip.name} - Owner: ${ip.owner}, Type: ${ip.type}${relevance}`);
      });
    }
    
    console.log('\nENHANCED PROMPT (Sent to Video Generation Model):');
    console.log(`"${augmentedPrompt}"`);
    
    console.log('\nThe enhanced prompt includes your original idea plus information about any copyrighted characters, brands, or content that might be relevant. This helps ensure the generated video is created with full awareness of IP considerations.');
    
    console.log(`\nProcessed at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log Gemini video analysis call (input and output)
   * This shows what was sent to Gemini and what it returned
   */
  logVideoAnalysis(
    videoPath: string,
    inputData: {
      video_path: string;
      duration: number;
      resolution: string;
      model_used: string;
      augmented_prompt?: string;
    },
    analysisOutput: {
      analysis: string;
      detected_objects: string[];
      detected_brands: string[];
      timestamp: string;
    }
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'video_analysis_completed',
      step: 'video_analysis',
      video_path: videoPath,
      input: inputData,
      output: analysisOutput,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('STEP 9: VIDEO ANALYSIS - AI Analysis of Generated Video');
    
    console.log('After the video is generated, we use Google Gemini AI to analyze the video content. Gemini examines every frame to identify objects, characters, brands, and other elements present in the video. This helps us verify what was actually created compared to what was requested.');
    
    console.log('\nINFORMATION SENT TO GEMINI AI:');
    console.log(`Video File: ${inputData.video_path}`);
    console.log(`Video Length: ${inputData.duration} seconds`);
    console.log(`Video Quality: ${inputData.resolution}`);
    console.log(`Generation Model: ${inputData.model_used}`);
    if (inputData.augmented_prompt) {
      console.log(`Original Request (Enhanced Prompt): "${inputData.augmented_prompt.substring(0, 200)}${inputData.augmented_prompt.length > 200 ? '...' : ''}"`);
    }
    
    console.log('\nGEMINI AI ANALYSIS RESULTS:');
    const cleanAnalysis = this.stripMarkdown(analysisOutput.analysis);
    console.log(`Detailed Analysis: ${cleanAnalysis}`);
    
    if (analysisOutput.detected_objects && analysisOutput.detected_objects.length > 0) {
      const objectsList = analysisOutput.detected_objects.map(obj => obj.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
      console.log(`Objects Detected in Video: ${objectsList}`);
    }
    
    if (analysisOutput.detected_brands && analysisOutput.detected_brands.length > 0) {
      console.log(`Brands/Companies Identified: ${analysisOutput.detected_brands.join(', ')}`);
    }
    
    console.log('\nThis analysis helps us compare what you asked for versus what was actually created. It identifies any copyrighted characters, brands, or content that appear in the video, which is crucial for understanding IP risks and monetization potential.');
    
    console.log(`\nAnalysis completed at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Strip markdown formatting from text
   */
  private stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .trim();
  }

  /**
   * Log Amazon MemoryDB video fetch failure
   * Shows when no video is found in MemoryDB
   */
  logMemoryDBVideoFetchFailure(
    prompt: string,
    queryDetails?: {
      search_method?: string;
      query_time_ms?: number;
    }
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      event: 'memorydb_video_fetch_failed',
      step: 'video_retrieval',
      prompt: prompt,
      query_details: queryDetails,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('AMAZON MEMORYDB: Video Fetch Operation - No Video Found');
    
    console.log('When you enter a prompt, the system queries Amazon MemoryDB to find and retrieve the most relevant video based on your input. In this case, no matching video was found in the database.');
    
    console.log('\nQUERY INPUT:');
    console.log(`User Prompt: "${prompt}"`);
    
    if (queryDetails) {
      const details: string[] = [];
      if (queryDetails.search_method) {
        details.push(`Search Method: ${queryDetails.search_method}`);
      }
      if (queryDetails.query_time_ms) {
        details.push(`Query Time: ${queryDetails.query_time_ms}ms`);
      }
      if (details.length > 0) {
        console.log(`MEMORYDB QUERY DETAILS: ${details.join(', ')}`);
      }
    }
    
    console.log('\nMEMORYDB RESPONSE:');
    console.log('No video found - No matching video was found in the database for the given prompt.');
    console.log('Status: Query completed but no results returned.');
    
    console.log('\nWhen no video is found in MemoryDB, the pipeline cannot proceed with video analysis. The system will return an error indicating that no matching example was found for the given prompt.');
    
    console.log(`\nQuery completed at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log Amazon MemoryDB video fetch when match found but no video exists
   * Shows when a match is found but generation was blocked (no video file)
   */
  logMemoryDBVideoFetchNoVideo(
    prompt: string,
    matchedExampleId: string,
    matchedExampleName: string,
    queryDetails?: {
      search_method?: string;
      match_score?: number;
      query_time_ms?: number;
      reason?: string;
    }
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      event: 'memorydb_video_fetch_no_video',
      step: 'video_retrieval',
      prompt: prompt,
      matched_example_id: matchedExampleId,
      matched_example_name: matchedExampleName,
      query_details: queryDetails,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('AMAZON MEMORYDB: Video Fetch Operation - Match Found But No Video Available');
    
    console.log('When you enter a prompt, the system queries Amazon MemoryDB to find and retrieve the most relevant video based on your input. A matching analysis record was found in the database, but no actual video file exists because video generation was blocked.');
    
    console.log('\nQUERY INPUT:');
    console.log(`User Prompt: "${prompt}"`);
    
    if (queryDetails) {
      const details: string[] = [];
      if (queryDetails.search_method) {
        details.push(`Search Method: ${queryDetails.search_method}`);
      }
      if (queryDetails.match_score !== undefined) {
        details.push(`Match Score: ${(queryDetails.match_score * 100).toFixed(1)}%`);
      }
      if (queryDetails.query_time_ms) {
        details.push(`Query Time: ${queryDetails.query_time_ms}ms`);
      }
      if (details.length > 0) {
        console.log(`MEMORYDB QUERY DETAILS: ${details.join(', ')}`);
      }
    }
    
    console.log('\nMEMORYDB RESPONSE:');
    console.log(`Matched Analysis Record ID: ${matchedExampleId}`);
    console.log(`Matched Analysis Name: ${matchedExampleName}`);
    console.log(`Video Path: No video file available`);
    console.log(`Status: Match found in database, but no video exists because generation was blocked.`);
    
    if (queryDetails?.reason) {
      console.log(`Reason: ${queryDetails.reason}`);
    }
    
    console.log('\nA matching analysis record was found in MemoryDB with complete IP attribution, safety checks, and analysis data. However, no actual video file exists because video generation was prevented (likely due to IP conflicts or safety violations). The analysis data is still available for review, but there is no video to load or analyze.');
    
    console.log(`\nQuery completed at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log Amazon MemoryDB video fetch operation
   * Shows when a video is fetched from MemoryDB based on the prompt
   */
  logMemoryDBVideoFetch(
    prompt: string,
    matchedExampleId: string,
    matchedExampleName: string,
    videoPath: string,
    queryDetails?: {
      search_method?: string;
      match_score?: number;
      query_time_ms?: number;
    }
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'memorydb_video_fetch',
      step: 'video_retrieval',
      prompt: prompt,
      matched_example_id: matchedExampleId,
      matched_example_name: matchedExampleName,
      video_path: videoPath,
      query_details: queryDetails,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('AMAZON MEMORYDB: Video Fetch Operation');
    
    console.log('When you enter a prompt, the system queries Amazon MemoryDB to find and retrieve the most relevant video based on your input. MemoryDB stores pre-analyzed videos with their associated metadata, IP information, and analysis results.');
    
    console.log('\nQUERY INPUT:');
    console.log(`User Prompt: "${prompt}"`);
    
    if (queryDetails) {
      const details: string[] = [];
      if (queryDetails.search_method) {
        details.push(`Search Method: ${queryDetails.search_method}`);
      }
      if (queryDetails.match_score !== undefined) {
        details.push(`Match Score: ${(queryDetails.match_score * 100).toFixed(1)}%`);
      }
      if (queryDetails.query_time_ms) {
        details.push(`Query Time: ${queryDetails.query_time_ms}ms`);
      }
      if (details.length > 0) {
        console.log(`MEMORYDB QUERY DETAILS: ${details.join(', ')}`);
      }
    }
    
    console.log('\nMEMORYDB RESPONSE:');
    console.log(`Matched Video ID: ${matchedExampleId}`);
    console.log(`Video Name: ${matchedExampleName}`);
    console.log(`Video Path: ${videoPath}`);
    
    console.log('\nMemoryDB allows us to quickly retrieve pre-analyzed videos and their complete analysis data, including IP attributions, safety checks, and Gemini analysis results. This enables fast response times while maintaining comprehensive analysis data.');
    
    console.log(`\nFetched at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log Amazon MemoryDB video load operation
   * Shows when a video is successfully loaded from MemoryDB
   */
  logMemoryDBVideoLoad(
    videoPath: string,
    videoMetadata: {
      duration: number;
      resolution: string;
      file_size?: number;
      format?: string;
    },
    loadTimeMs?: number
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'memorydb_video_load',
      step: 'video_loading',
      video_path: videoPath,
      video_metadata: videoMetadata,
      load_time_ms: loadTimeMs,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('AMAZON MEMORYDB: Video Loaded Successfully');
    
    console.log('After fetching the video reference from MemoryDB, the actual video file is loaded into memory. This video will be used for the Gemini AI analysis that follows.');
    
    const metadataParts: string[] = [`Video Path: ${videoPath}`, `Duration: ${videoMetadata.duration} seconds`, `Resolution: ${videoMetadata.resolution}`];
    if (videoMetadata.file_size) {
      const sizeMB = (videoMetadata.file_size / (1024 * 1024)).toFixed(2);
      metadataParts.push(`File Size: ${sizeMB} MB`);
    }
    if (videoMetadata.format) {
      metadataParts.push(`Format: ${videoMetadata.format}`);
    }
    if (loadTimeMs) {
      metadataParts.push(`Load Time: ${loadTimeMs}ms`);
    }
    
    console.log('\nVIDEO METADATA:');
    console.log(metadataParts.join(', '));
    
    console.log('\nThe video must be fully loaded before analysis can begin. Once loaded, Gemini AI can process the video frames to identify objects, brands, and other content elements.');
    
    console.log(`\nLoaded at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log that analysis will be performed on the fetched video
   * Shows the connection between MemoryDB fetch and analysis
   */
  logAnalysisOnFetchedVideo(
    videoPath: string,
    source: 'memorydb',
    analysisType: 'gemini'
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'analysis_on_fetched_video',
      step: 'video_analysis',
      video_path: videoPath,
      source: source,
      analysis_type: analysisType,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('ANALYSIS PIPELINE: Using Fetched Video');
    
    console.log('The video that was fetched from Amazon MemoryDB is now ready for analysis. Gemini AI will analyze this specific video to identify content, objects, brands, and intellectual property elements.');
    
    console.log('\nVIDEO SOURCE:');
    console.log(`Video Path: ${videoPath}`);
    console.log(`Source: ${source === 'memorydb' ? 'Amazon MemoryDB' : source}`);
    console.log(`Analysis Engine: ${analysisType === 'gemini' ? 'Google Gemini 3.0 Pro Preview' : analysisType}`);
    
    console.log('\nAll analysis results are based on the actual video content fetched from MemoryDB. This ensures that IP detection, object recognition, and brand identification are performed on the exact video that will be used, maintaining accuracy and consistency.');
    
    console.log(`\nReady for analysis at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  /**
   * Log what the code found during analysis
   * This shows the comparison between expected (from prompt) vs actual (from analysis)
   */
  logAnalysisFindings(
    expectedIPs: Array<{ name: string; owner: string; type: string }>,
    detectedObjects: string[],
    detectedBrands: string[],
    analysisText: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      event: 'analysis_findings',
      step: 'video_analysis',
      expected_ips: expectedIPs,
      detected_objects: detectedObjects,
      detected_brands: detectedBrands,
      analysis_text: analysisText,
    };
    this.addLog(entry);
    
    // Console output with clear explanations
    console.group('COMPARISON: Expected vs. Actually Detected in Video');
    
    console.log('We compare what intellectual property (IP) elements we expected to find based on your prompt versus what the AI actually detected in the generated video. This helps identify any discrepancies or unexpected content.');
    
    if (expectedIPs && expectedIPs.length > 0) {
      console.log('\nINTELLECTUAL PROPERTY WE EXPECTED TO FIND (Based on your prompt and our IP database search):');
      const expectedList = expectedIPs.map((ip, index) => `${index + 1}. ${ip.name} (Owner: ${ip.owner}, Type: ${ip.type})`).join('; ');
      console.log(expectedList);
    } else {
      console.log('\nINTELLECTUAL PROPERTY WE EXPECTED TO FIND: No specific IP elements were expected based on the prompt.');
    }
    
    if (detectedObjects && detectedObjects.length > 0) {
      const formattedObjects = detectedObjects.map(obj => obj.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      console.log(`\nOBJECTS & ELEMENTS ACTUALLY DETECTED IN VIDEO (What Gemini AI found when analyzing the video frames): ${formattedObjects.join(', ')}`);
    }
    
    if (detectedBrands && detectedBrands.length > 0) {
      console.log(`\nBRANDS & COMPANIES ACTUALLY DETECTED IN VIDEO (Brands that appear in the video - important for copyright considerations): ${detectedBrands.join(', ')}`);
    }
    
    const cleanAnalysisText = this.stripMarkdown(analysisText);
    console.log(`\nCOMPLETE AI ANALYSIS REPORT: ${cleanAnalysisText}`);
    
    const expectedCount = expectedIPs?.length || 0;
    const detectedCount = detectedObjects?.length || 0;
    const brandCount = detectedBrands?.length || 0;
    
    let summaryText = `SUMMARY: Expected IP Elements: ${expectedCount}, Objects Detected: ${detectedCount}, Brands Identified: ${brandCount}`;
    
    if (expectedCount > 0 && detectedCount > 0) {
      const matchRatio = Math.min(expectedCount, detectedCount) / Math.max(expectedCount, detectedCount);
      if (matchRatio >= 0.8) {
        summaryText += ', Match Quality: High - Most expected elements were found';
      } else if (matchRatio >= 0.5) {
        summaryText += ', Match Quality: Moderate - Some expected elements were found';
      } else {
        summaryText += ', Match Quality: Low - Few expected elements were found';
      }
    }
    
    console.log(`\n${summaryText}`);
    
    console.log('\nThis comparison helps verify that the video generation process created what was requested, and identifies any unexpected copyrighted content that might have appeared. This is critical for understanding IP risks and monetization eligibility.');
    
    console.log(`\nComparison completed at: ${new Date(entry.timestamp).toLocaleString()}`);
    console.groupEnd();
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    // Console logging is handled by ProcessingPage component with formatted output
    // Removed console.log here to avoid duplicate/unformatted logs
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

