# Strand AI PoC - Next.js Setup Instructions

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
strand-ai-poc/
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main demo page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Pipeline/          # Pipeline execution components
│   └── Results/          # Results display components
├── lib/                   # Core business logic
│   ├── models.ts         # TypeScript type definitions
│   ├── pipeline.ts       # Pipeline execution logic
│   └── logger.ts        # Logging system
├── data/                  # Data directory
│   └── preloaded/        # Pre-loaded assets
└── public/               # Static assets
```

## Features Implemented

### Milestone 1 Deliverables
- ✅ Complete pipeline with 10 steps
- ✅ All steps implemented as functional stubs
- ✅ Real-time execution visualization
- ✅ Comprehensive logging system
- ✅ Results display with all metrics
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ TypeScript for type safety

### Pipeline Steps
1. Prompt Input - Process and validate input
2. Vector Retrieval - Retrieve IP context (stub)
3. Initial Attribution - Calculate expected usage (stub)
4. Pre-Gen Safety - Validate prompt (stub)
5. Prompt Augmentation - Enhance with IP context (stub)
6. Video Generation - Generate video (stub)
7. Post-Gen Safety - Validate content (stub)
8. Final Attribution - Calculate actual usage (stub)
9. Video Analysis - Analyze content (stub)
10. Logging & Display - Format results

## Usage

1. **Run Pipeline**
   - Use the hard-coded prompt or enter a custom one
   - Click "Run Pipeline" button
   - Watch the 10 steps execute in real-time

2. **View Results**
   - Initial and Final Attribution scores
   - Safety check results
   - Video analysis details
   - Execution logs

3. **Monitor Execution**
   - Real-time step progression
   - Execution logs with timestamps
   - Performance metrics

## Development

### Adding New Features
- Components go in `components/`
- Business logic goes in `lib/`
- Pages go in `app/`

### Styling
- Uses Tailwind CSS
- Configuration in `tailwind.config.js`
- Global styles in `app/globals.css`

### Type Safety
- All types defined in `lib/models.ts`
- TypeScript strict mode enabled
- Run `npm run type-check` to verify

## Troubleshooting

### Build Errors
- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint` to find linting errors

### Runtime Errors
- Check browser console for errors
- Verify all dependencies are installed
- Clear `.next` folder and rebuild

## Next Steps

After Milestone 1, implement:
- Real vector database integration
- Actual attribution algorithms
- Video generation API integration
- Real safety checks
- Enhanced error handling

