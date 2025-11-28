# Video Analyses

This folder contains individual video analysis data files. Each video has its own file for easier management and organization.

## Structure

Each video analysis file exports a `VideoExample` object that contains:
- Video metadata (path, duration, resolution, description)
- Prompt matching patterns and keywords
- Complete analysis results (IP attribution, safety checks, video analysis, etc.)

## Adding a New Video Analysis

To add a new video analysis:

### Step 1: Create a new file

Create a new TypeScript file in this folder with a descriptive name (use kebab-case):
```
my-new-video.ts
```

### Step 2: Define the analysis

Copy the structure from an existing file (e.g., `spiderman-doom.ts`) and fill in your video's data:

```typescript
import { VideoExample } from '../examples';

export const myNewVideoAnalysis: VideoExample = {
  id: 'example_6', // Use a unique ID
  name: 'My Video Name',
  promptPattern: 'keyword1|keyword2|keyword3', // Regex pattern for matching
  promptKeywords: ['keyword1', 'keyword2', 'keyword3'], // Keywords for matching
  video: {
    path: '/path/to/your/video.mp4',
    duration: 30.0, // Duration in seconds
    resolution: '1080p',
    description: 'Description of your video',
  },
  results: {
    // ... complete analysis results
  },
};
```

### Step 3: Register the analysis

Add your new analysis to `index.ts`:

1. Import your analysis:
```typescript
import { myNewVideoAnalysis } from './my-new-video';
```

2. Add it to the `VIDEO_ANALYSES` array:
```typescript
export const VIDEO_ANALYSES: VideoExample[] = [
  spidermanDoomAnalysis,
  cocaColaAnalysis,
  appleIphoneAnalysis,
  mcdonaldsAnalysis,
  samsungGalaxyAnalysis,
  myNewVideoAnalysis, // Add your new analysis here
];
```

### Step 4: Test

The video analysis will automatically be available for matching when users enter prompts that match your `promptPattern` or contain your `promptKeywords`.

## File Naming Convention

- Use kebab-case: `my-video-name.ts`
- Be descriptive: `spiderman-doom.ts` is better than `video1.ts`
- Match the video content or brand name

## Example Files

- `spiderman-doom.ts` - Spider-Man vs. Doctor Doom video
- `coca-cola.ts` - Coca-Cola commercial
- `apple-iphone.ts` - Apple iPhone showcase
- `mcdonalds.ts` - McDonald's food ad
- `samsung-galaxy.ts` - Samsung Galaxy ad

## Notes

- Each file should export a single `VideoExample` object
- The `id` field must be unique across all video analyses
- The `promptPattern` is used for regex matching (case-insensitive)
- The `promptKeywords` array is used for keyword-based scoring
- All timestamps are generated dynamically using `new Date().toISOString()`

