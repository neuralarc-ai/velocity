# Quick Start Guide - Run the Application

## Step-by-Step Instructions

### 1. Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages (Next.js, React, TypeScript, Tailwind CSS, etc.)

**Expected output**: You should see packages being installed. This may take 1-2 minutes.

### 2. Run the Development Server

Once installation is complete, run:

```bash
npm run dev
```

**Expected output**: 
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### 3. Open in Browser

Open your web browser and navigate to:

**http://localhost:3000**

You should see the Strand AI PoC interface!

### 4. Run the Pipeline

1. On the page, you'll see a "Run Pipeline" button
2. You can use the hard-coded prompt (checked by default) or enter a custom prompt
3. Click "Run Pipeline"
4. Watch the 10 steps execute in real-time
5. View the results, attribution scores, safety checks, and execution logs

## Troubleshooting

### Issue: "npm is not recognized"
**Solution**: Install Node.js from https://nodejs.org/ (version 18 or higher)

### Issue: Port 3000 already in use
**Solution**: 
- Close other applications using port 3000, OR
- Run: `npm run dev -- -p 3001` (uses port 3001 instead)

### Issue: Installation fails
**Solution**: 
- Make sure you have Node.js 18+ installed
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` to see specific errors

## Available Commands

- `npm run dev` - Start development server (use this!)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check for code issues
- `npm run type-check` - Check TypeScript types

## What to Expect

When you run the pipeline:
- ✅ All 10 steps will execute sequentially
- ✅ Each step will show as "running" then "completed"
- ✅ Results will display with:
  - Initial Attribution: ~85% (Nike)
  - Final Attribution: ~84% (Nike)
  - Variance: ~1% (within ±5% threshold)
  - Safety checks: Both PASSED
  - Video analysis: Detected objects and brands
- ✅ Execution logs will show all step details

## Next Steps

After running successfully:
- Try different prompts
- Explore the execution logs
- Review the results display
- Check the code structure in `lib/pipeline.ts` to see how it works

