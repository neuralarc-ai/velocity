# Strand AI PoC - Quick Reference Guide

## 🚀 Quick Commands

### Setup
```bash
# Initial setup
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python scripts/load_preloaded_assets.py

# Verify setup
python scripts/verify_setup.py
```

### Run Demo
```bash
# Basic demo
python scripts/run_demo.py

# With custom prompt
python scripts/run_demo.py --prompt "Your custom prompt"

# Verbose output
python scripts/run_demo.py --verbose
```

### Testing
```bash
# All tests
pytest

# Critical tests only
pytest -m critical

# Specific test set
pytest tests/test_matrix/test_baseline.py

# With coverage
pytest --cov=src --cov-report=html
```

---

## 📁 Key Files Reference

### Configuration Files
| File | Purpose | Priority |
|------|---------|----------|
| `config/settings.py` | Application settings | Critical |
| `config/models_config.yaml` | AI model configs | High |
| `config/attribution_config.yaml` | Attribution settings | High |
| `config/safety_rules.yaml` | Safety guardrails | Critical |
| `.env` | Environment variables | Critical |

### Core Implementation Files
| File | Purpose | Implements |
|------|---------|------------|
| `src/core/pipeline.py` | Main pipeline | FR1.1 |
| `src/core/logger.py` | Execution logging | FR1.4 |
| `src/retrieval/retriever.py` | IP retrieval | FR3.1 |
| `src/attribution/initial_attribution.py` | Initial attribution | FR4 |
| `src/attribution/final_attribution.py` | Final attribution | FR8 |
| `src/attribution/embedding_comparison.py` | Similarity comparison | FR7 |
| `src/safety/pre_generation_check.py` | Pre-gen safety | FR2 |
| `src/safety/post_generation_check.py` | Post-gen safety | FR10 |
| `src/generation/video_model.py` | Video generation | FR4.1 |
| `src/analysis/video_analyzer.py` | Video analysis | FR4.2 |

### Scripts
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `scripts/run_demo.py` | Run PoC demo | Demo execution |
| `scripts/load_preloaded_assets.py` | Load assets | Initial setup |
| `scripts/verify_setup.py` | Verify installation | After setup |
| `scripts/generate_test_report.py` | Generate test report | After testing |

---

## 🎯 Implementation Priorities

### Milestone 1 (Days 1-7) - CRITICAL
**Goal**: Deliver working framework with stubs

**Must Complete**:
1. ✅ `config/settings.py` - Configuration system
2. ✅ `src/core/logger.py` - Logging system
3. ✅ `src/core/pipeline.py` - Pipeline with stubs
4. ✅ `src/models/*.py` - All data models
5. ✅ `scripts/run_demo.py` - Demo script
6. ✅ `scripts/load_preloaded_assets.py` - Asset loader
7. ✅ Pre-loaded assets in `data/preloaded/`

**Deliverables**:
- Working demo that executes all 10 steps
- All steps log properly
- Stubs return mock data
- Demo completes in <60 seconds

---

### Phase 2 (Days 8-14) - HIGH PRIORITY
**Goal**: Implement core attribution logic

**Must Complete**:
1. `src/retrieval/vector_db.py` - Vector DB integration
2. `src/retrieval/embeddings.py` - Embedding generation
3. `src/retrieval/retriever.py` - IP retrieval (FR3.1)
4. `src/attribution/initial_attribution.py` - Initial attribution (FR4)
5. `src/attribution/algorithms.py` - Attribution algorithms
6. `src/attribution/embedding_comparison.py` - Similarity (FR7)

**Tests to Pass**:
- Test 1.1: Single IP Logo
- Test 2.1: High Similarity Match
- Test 2.2: Medium Similarity Match

---

### Phase 3 (Days 15-21) - HIGH PRIORITY
**Goal**: Implement generation and safety

**Must Complete**:
1. `src/generation/video_model.py` - Video model integration
2. `src/generation/prompt_augmentation.py` - Prompt augmentation (FR3.3)
3. `src/generation/model_adapters/` - Model adapters
4. `src/safety/pre_generation_check.py` - Pre-gen safety (FR2)
5. `src/safety/post_generation_check.py` - Post-gen safety (FR10)
6. `src/attribution/final_attribution.py` - Final attribution (FR8)

**Tests to Pass**:
- Test 5.1: Pre-Gen Safety Pass
- Test 5.2: Pre-Gen Safety Fail
- Test 5.3: Post-Gen Safety Pass
- Test 7.1: Processing Speed

---

### Phase 4 (Days 22-28) - MEDIUM PRIORITY
**Goal**: Complete testing and optimization

**Must Complete**:
1. All remaining test matrix tests
2. Performance optimization
3. Documentation completion
4. Bug fixes

---

## 🔍 Common Code Patterns

### Pattern 1: Pipeline Step Template

```python
def _step_X_name(self, input_data) -> OutputType:
    """Step X: Description"""
    step_name = "step_name"
    self.logger.log_step_start(step_name, input=input_data)
    start_time = time.time()
    
    try:
        # Step logic here
        result = process_data(input_data)
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
        
    except Exception as e:
        self.state.add_failed_step(step_name, e)
        self.logger.log_step_error(step_name, e)
        raise
```

### Pattern 2: Attribution Calculation Template

```python
def calculate_attribution(self, ip_elements: List[IPContent]) -> AttributionResult:
    """Calculate attribution scores"""
    
    # Calculate individual scores
    scores = {}
    for ip in ip_elements:
        score = self._calculate_ip_score(ip)
        scores[ip.owner] = score
    
    # Normalize to 100%
    total = sum(scores.values())
    normalized = {k: v/total for k, v in scores.items()}
    
    # Calculate confidence
    confidence = self._calculate_confidence(scores)
    
    return AttributionResult(
        total_score=sum(normalized.values()),
        confidence=confidence,
        ip_attributions=normalized,
        calculation_type="initial",
        algorithm_used="weighted_average"
    )
```

### Pattern 3: Safety Check Template

```python
def check(self, content, context) -> SafetyResult:
    """Perform safety check"""
    
    violations = []
    
    # Check each rule
    for rule in self.rules:
        if not self._evaluate_rule(rule, content, context):
            violations.append(rule['id'])
    
    # Calculate contamination (for post-gen)
    contamination = self._calculate_contamination(content)
    
    return SafetyResult(
        passed=len(violations) == 0 and contamination < self.threshold,
        check_type=self.check_type,
        violations=violations,
        contamination_score=contamination
    )
```

---

## 📊 Key Metrics to Track

### Attribution Metrics
- **Initial Attribution Score**: Expected IP usage (0.0-1.0)
- **Final Attribution Score**: Actual IP usage (0.0-1.0)
- **Confidence Score**: Confidence in attribution (0.0-1.0)
- **Variance**: |Final - Initial| / Initial
- **Per-IP Attribution**: Individual owner scores

### Safety Metrics
- **Pre-Gen Pass Rate**: % of prompts passing pre-gen check
- **Post-Gen Pass Rate**: % of videos passing post-gen check
- **Contamination Score**: Unintended IP presence (0.0-1.0)
- **Violation Count**: Number of safety violations
- **False Positive Rate**: Safe content incorrectly blocked
- **False Negative Rate**: Unsafe content incorrectly allowed

### Performance Metrics
- **Attribution Time**: Time to calculate attribution (ms)
- **Safety Check Time**: Time for safety checks (ms)
- **Retrieval Time**: Time for vector retrieval (ms)
- **Generation Time**: Time for video generation (ms)
- **Total Pipeline Time**: End-to-end execution (ms)
- **Throughput**: Videos processed per minute

### Embedding Metrics
- **Similarity Score**: Cosine similarity (0.0-1.0)
- **Match Classification**: High/Medium/Low/None
- **Retrieval Accuracy**: % of relevant IP retrieved
- **Query Time**: Vector DB query time (ms)

---

## 🎯 Critical Test Scenarios

### Scenario 1: Perfect Attribution Match
```python
# Initial: Nike logo detected at 0.95 confidence
# Final: Nike logo present at 0.94 confidence
# Variance: 1% (within ±5% threshold)
# Result: ✅ PASS
```

### Scenario 2: Multi-IP Attribution
```python
# Initial: Nike logo (50%), Adidas product (50%)
# Final: Nike logo (48%), Adidas product (52%)
# Variance: 2% per IP (within threshold)
# Result: ✅ PASS
```

### Scenario 3: Safety Block
```python
# Pre-Gen: Unlicensed IP detected
# Action: Block generation
# Result: ✅ PASS (correctly blocked)
```

### Scenario 4: Contamination Detection
```python
# Post-Gen: Unexpected brand appears (7% contamination)
# Threshold: 5%
# Action: Flag for review
# Result: ✅ PASS (correctly flagged)
```

---

## 📋 Checklist for Each Module

### Before Implementing a Module

- [ ] Read module documentation in Implementation Guide
- [ ] Review functional requirements (FR)
- [ ] Check data models needed
- [ ] Identify dependencies on other modules
- [ ] Review test scenarios for this module

### During Implementation

- [ ] Follow code patterns from examples
- [ ] Add comprehensive logging
- [ ] Handle errors gracefully
- [ ] Write unit tests as you go
- [ ] Document key decisions

### After Implementation

- [ ] Run unit tests for module
- [ ] Run integration tests
- [ ] Check code coverage (>80%)
- [ ] Update documentation
- [ ] Review with team

---

## 🔗 Quick Links

### Documentation
- [Project Structure](STRAND_AI_PROJECT_STRUCTURE.md) - Complete file structure
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Step-by-step implementation
- [Setup Instructions](SETUP_INSTRUCTIONS.md) - Environment setup
- [Testing Framework](TESTING_FRAMEWORK.md) - Testing guidelines

### External Resources
- [PRD](strand_ai_demo_prd.md.pdf) - Product requirements
- [Testing Matrix](attribution_testing_matrix.pdf) - Test scenarios
- [SoW](Statement of Work) - Contract details

---

## 💡 Pro Tips

### Development Tips
1. **Start with stubs** - Get the pipeline working end-to-end first
2. **Log everything** - Comprehensive logging is critical for demos
3. **Test incrementally** - Don't wait until the end to test
4. **Use fixtures** - Create reusable test fixtures
5. **Mock external APIs** - Don't depend on external services for tests

### Demo Tips
1. **Practice the demo** - Run it multiple times before presenting
2. **Have backup data** - Keep multiple test videos ready
3. **Monitor logs** - Watch logs during demo for issues
4. **Explain as you go** - Narrate each step for investors
5. **Show the numbers** - Highlight attribution scores and variance

### Debugging Tips
1. **Check logs first** - `data/logs/pipeline_logs/strand_ai.log`
2. **Use verbose mode** - `python scripts/run_demo.py --verbose`
3. **Test components individually** - Isolate the problem
4. **Verify environment** - Run `scripts/verify_setup.py`
5. **Check API connectivity** - Test external services separately

---

## 📞 Emergency Contacts

### Technical Issues
- **Neural Arc Team**: [contact info]
- **AWS Support**: For MemoryDB issues
- **Model Provider**: For API issues

### Documentation Issues
- Review this Quick Reference
- Check Implementation Guide
- Contact project lead

---

## 🎓 Learning Resources

### Vector Databases
- [Redis Vector Similarity](https://redis.io/docs/stack/search/reference/vectors/)
- [Amazon MemoryDB](https://docs.aws.amazon.com/memorydb/)

### Embeddings
- [Sentence Transformers](https://www.sbert.net/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)

### Video Processing
- [OpenCV Python](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [MoviePy](https://zulko.github.io/moviepy/)

### Testing
- [Pytest Documentation](https://docs.pytest.org/)
- [Testing Best Practices](https://docs.pytest.org/en/stable/goodpractices.html)

---

## 📊 Success Checklist

### Milestone 1 Checklist
- [ ] All configuration files created
- [ ] All data models implemented
- [ ] Pipeline with stubs working
- [ ] Logging system functional
- [ ] Pre-loaded assets loaded
- [ ] Demo script runs successfully
- [ ] All 10 steps execute
- [ ] Execution completes in <60s
- [ ] No critical failures

### PoC Completion Checklist
- [ ] All stubs replaced with real logic
- [ ] Vector DB integration working
- [ ] Attribution calculations accurate (>95%)
- [ ] Safety controls functional
- [ ] Video generation integrated
- [ ] All critical tests passing
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Demo ready for investors

---

## 🔢 Key Numbers to Remember

### Attribution Targets
- **Initial Confidence**: >95%
- **Final Confidence**: >90%
- **Variance Threshold**: ±5%
- **Processing Time**: <2 seconds

### Similarity Thresholds
- **High Match**: >0.90
- **Medium Match**: 0.70-0.90
- **Low Match**: 0.30-0.70
- **No Match**: <0.30

### Safety Thresholds
- **Contamination**: <5%
- **False Positive**: <5%
- **False Negative**: <1%

### Performance Targets
- **Total Pipeline**: <60 seconds
- **Attribution Calc**: <2 seconds
- **Safety Check**: <500ms
- **Embedding Gen**: <1 second
- **Throughput**: >20 videos/min

---

## 🚨 Common Pitfalls to Avoid

### 1. Hardcoding Values
❌ **Wrong**: `if score > 0.85:`  
✅ **Right**: `if score > settings.MIN_CONFIDENCE_SCORE:`

### 2. Missing Logging
❌ **Wrong**: Silent execution  
✅ **Right**: Log every step with timestamps

### 3. Ignoring Errors
❌ **Wrong**: `try: ... except: pass`  
✅ **Right**: Proper error handling and logging

### 4. Not Using Stubs
❌ **Wrong**: Trying to implement everything at once  
✅ **Right**: Start with stubs, replace incrementally

### 5. Skipping Tests
❌ **Wrong**: "I'll test it later"  
✅ **Right**: Write tests as you implement

---

## 📈 Progress Tracking

### Daily Checklist
- [ ] Morning: Review yesterday's progress
- [ ] Plan: Identify today's tasks
- [ ] Implement: Write code with tests
- [ ] Test: Run relevant test suite
- [ ] Document: Update docs with changes
- [ ] Commit: Push code with clear messages
- [ ] Evening: Review logs and metrics

### Weekly Checklist
- [ ] Review all completed modules
- [ ] Run full test suite
- [ ] Check code coverage
- [ ] Update documentation
- [ ] Demo to team
- [ ] Plan next week's tasks

---

## 🎬 Demo Execution Checklist

### Before Demo
- [ ] Verify environment setup
- [ ] Load pre-loaded assets
- [ ] Test demo script 3+ times
- [ ] Check logs are clean
- [ ] Prepare backup videos
- [ ] Review key metrics to highlight

### During Demo
- [ ] Explain the problem statement
- [ ] Show the pipeline flow
- [ ] Highlight attribution scores
- [ ] Demonstrate safety controls
- [ ] Show variance within threshold
- [ ] Display execution logs
- [ ] Answer questions confidently

### After Demo
- [ ] Collect feedback
- [ ] Document issues encountered
- [ ] Update demo script if needed
- [ ] Share results with team

---

## 🔧 Debugging Quick Reference

### Check Logs
```bash
# View latest logs
tail -f data/logs/pipeline_logs/strand_ai.log

# Search for errors
grep "ERROR" data/logs/pipeline_logs/strand_ai.log

# View specific step
grep "initial_attribution" data/logs/pipeline_logs/strand_ai.log
```

### Test Individual Components
```python
# Test vector DB
from src.retrieval.vector_db import VectorDatabase
db = VectorDatabase()
db.connect()
db.ping()

# Test attribution
from src.attribution.initial_attribution import InitialAttributionCalculator
calc = InitialAttributionCalculator()
result = calc.calculate(ip_elements)

# Test safety
from src.safety.pre_generation_check import PreGenerationSafetyChecker
checker = PreGenerationSafetyChecker()
result = checker.check(prompt, context)
```

### Verify Data
```bash
# Check pre-loaded assets
ls -lh data/preloaded/videos/
cat data/preloaded/prompts/hardcoded_prompt.txt
cat data/preloaded/embeddings/qa_embeddings.json

# Check generated content
ls -lh data/generated/videos/
```

---

## 📞 Quick Support

### Issue: Pipeline Fails
1. Check logs: `tail -f data/logs/pipeline_logs/strand_ai.log`
2. Run verification: `python scripts/verify_setup.py`
3. Test individual steps
4. Check environment variables

### Issue: Tests Failing
1. Run single test: `pytest tests/path/to/test.py::test_name -v`
2. Check fixtures: Review `tests/conftest.py`
3. Verify test data exists
4. Check test markers

### Issue: Performance Slow
1. Profile code: Use `cProfile`
2. Check database queries
3. Review caching strategy
4. Optimize embeddings

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Created By**: Helium AI (Neural Arc Inc.)