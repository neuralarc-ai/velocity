# Strand AI PoC - Technical Decisions & Rationale

## 🎯 Purpose
This document captures critical technical decisions, their rationale, and alternatives considered. This is a living document that should be updated as decisions are made during implementation.

---

## 📋 Decision Log

### Decision 1: AI Video Model Selection

**Status**: 🟡 Pending (Milestone 1 Deliverable)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team + Strand AI

#### Options Considered

##### Option A: LTX-Video
**Pros**:
- High quality output (1080p)
- Longer duration support (10 seconds)
- Good API documentation
- Proven reliability

**Cons**:
- Higher API costs
- Slower generation time
- May require more compute

**Technical Specs**:
- Max Duration: 10 seconds
- Resolution: 1080p
- Aspect Ratio: 16:9
- API Endpoint: `https://api.ltx-video.com/v1/generate`

##### Option B: Mochi 1
**Pros**:
- Faster generation
- Lower API costs
- Good for PoC demonstrations
- Simpler integration

**Cons**:
- Lower resolution (720p)
- Shorter duration (8 seconds)
- Less mature API

**Technical Specs**:
- Max Duration: 8 seconds
- Resolution: 720p
- Aspect Ratio: 16:9
- API Endpoint: `https://api.mochi.com/v1/generate`

#### Recommendation
**TBD** - To be decided based on:
1. API availability and access
2. Cost considerations for PoC
3. Quality requirements for investor demo
4. Integration complexity

#### Implementation Impact
- Model adapter pattern allows easy switching
- Configuration-driven selection
- No code changes needed to switch models

---

### Decision 2: AI Analysis Model Selection

**Status**: 🟡 Pending (Milestone 1 Deliverable)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Options Considered

##### Option A: CLIP (OpenAI)
**Pros**:
- Excellent for image-text alignment
- Well-documented and widely used
- Good for logo/brand detection
- Pre-trained on large dataset

**Cons**:
- Primarily image-focused (not video-native)
- May need frame extraction
- Limited temporal understanding

**Technical Specs**:
- Model: `openai/clip-vit-large-patch14`
- Embedding Dimension: 768
- Input: Images or video frames

##### Option B: VideoMAE
**Pros**:
- Native video understanding
- Temporal feature extraction
- Good for action recognition
- Open source

**Cons**:
- Less mature than CLIP
- Smaller pre-training dataset
- May need fine-tuning

**Technical Specs**:
- Model: `MCG-NJU/videomae-base`
- Embedding Dimension: 768
- Input: Video clips

#### Recommendation
**CLIP** - Recommended for PoC because:
1. Better for brand/logo detection (critical for IP attribution)
2. More stable and well-documented
3. Easier integration
4. Sufficient for PoC demonstration

#### Implementation Impact
- Use frame extraction for video analysis
- Sample frames at 1fps for analysis
- Combine frame embeddings for video representation

---

### Decision 3: Attribution Algorithm

**Status**: 🟡 Pending (Milestone 2 Deliverable)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Options Considered

##### Option A: Weighted Average
**Description**: Calculate weighted average of IP element scores

**Formula**:
```
Attribution_Score = Σ(weight_i × similarity_i) / Σ(weight_i)
```

**Pros**:
- Simple and interpretable
- Easy to explain to investors
- Fast computation
- Handles multiple IP elements

**Cons**:
- May not capture complex relationships
- Equal weighting may not be optimal

##### Option B: Max Pooling
**Description**: Use maximum similarity score

**Formula**:
```
Attribution_Score = max(similarity_1, similarity_2, ..., similarity_n)
```

**Pros**:
- Very simple
- Fast computation
- Clear dominant IP identification

**Cons**:
- Ignores other IP contributions
- Not suitable for multi-IP scenarios

##### Option C: Hierarchical Attribution
**Description**: Tree-based attribution for nested IP

**Pros**:
- Handles nested IP (e.g., character wearing branded clothing)
- More accurate for complex scenarios
- Captures IP relationships

**Cons**:
- More complex to implement
- Harder to explain
- Slower computation

#### Recommendation
**Weighted Average** - Recommended because:
1. Balances simplicity and accuracy
2. Easy to explain to investors
3. Handles multi-IP scenarios
4. Fast enough for real-time use

#### Implementation Details
```python
def weighted_attribution(ip_elements: List[IPContent], similarities: List[float]) -> dict:
    """
    Calculate weighted attribution
    
    Weights based on:
    - Visual prominence: 0.6
    - Audio presence: 0.3
    - Temporal duration: 0.1
    """
    weights = {
        'visual': 0.6,
        'audio': 0.3,
        'temporal': 0.1
    }
    
    total_score = 0
    attributions = {}
    
    for ip, similarity in zip(ip_elements, similarities):
        weight = weights.get(ip.type, 0.5)
        score = weight * similarity
        attributions[ip.owner] = attributions.get(ip.owner, 0) + score
        total_score += score
    
    # Normalize to 100%
    if total_score > 0:
        attributions = {k: v/total_score for k, v in attributions.items()}
    
    return attributions
```

---

### Decision 4: Embedding Similarity Metric

**Status**: ✅ Decided  
**Decision Date**: November 24, 2025  
**Decision Maker**: Neural Arc Team

#### Decision
**Cosine Similarity** - Selected as primary similarity metric

#### Rationale
1. **Standard in industry**: Widely used for vector similarity
2. **Normalized**: Returns values in [-1, 1] range
3. **Efficient**: Fast computation with numpy
4. **Interpretable**: Easy to understand and explain

#### Formula
```python
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

#### Thresholds (from Testing Matrix)
- **High Match**: >0.90 (derivative content)
- **Medium Match**: 0.70-0.90 (modified content)
- **Low Match**: 0.30-0.70 (style influence)
- **No Match**: <0.30 (unrelated)

#### Alternatives Considered
- **Euclidean Distance**: Less interpretable, not normalized
- **Dot Product**: Not normalized, scale-dependent
- **Jaccard Similarity**: Better for sets, not vectors

---

### Decision 5: Vector Database

**Status**: ✅ Decided (Per SoW)  
**Decision Date**: November 20, 2025  
**Decision Maker**: Strand AI (Client Requirement)

#### Decision
**Amazon MemoryDB for Redis** - Required by SoW

#### Rationale
1. **Client requirement**: Specified in SoW
2. **Vector support**: Native vector similarity search
3. **Performance**: In-memory, low latency
4. **Scalability**: Handles high throughput
5. **AWS integration**: Easy integration with AWS services

#### Configuration
```python
# Connection settings
MEMORYDB_HOST = "strand-ai-poc.xxxxxx.memorydb.us-east-1.amazonaws.com"
MEMORYDB_PORT = 6379
MEMORYDB_SSL = True
MEMORYDB_PASSWORD = "secure-password"

# Performance settings
CONNECTION_POOL_SIZE = 10
QUERY_TIMEOUT = 5000  # ms
MAX_RETRIES = 3
```

#### Alternatives (Not Applicable)
- Pinecone: Not specified in SoW
- Weaviate: Not specified in SoW
- Milvus: Not specified in SoW

---

### Decision 6: Attribution Variance Threshold

**Status**: 🟡 Pending (Milestone 2 Deliverable)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Proposed Value
**±5%** - Initial vs Final attribution variance

#### Rationale
1. **Reasonable tolerance**: Accounts for generation variability
2. **Investor confidence**: Shows system consistency
3. **Achievable**: Based on preliminary testing
4. **Industry standard**: Common in ML systems

#### Formula
```python
variance = abs(final_score - initial_score) / initial_score
acceptable = variance <= 0.05  # 5%
```

#### Scenarios
- **0-2% variance**: Excellent match
- **2-5% variance**: Good match (acceptable)
- **5-10% variance**: Flag for review
- **>10% variance**: Significant discrepancy (investigate)

#### Testing
- Test Set 1 will validate this threshold
- Adjust based on test results
- Document final decision in Milestone 2

---

### Decision 7: Contamination Threshold

**Status**: ✅ Decided (Per Testing Matrix)  
**Decision Date**: November 23, 2025  
**Decision Maker**: Neural Arc Team

#### Decision
**5%** - Maximum acceptable contamination level

#### Rationale
1. **Specified in Testing Matrix**: Clear requirement
2. **Industry standard**: Common threshold for ML contamination
3. **Investor confidence**: Shows strong IP protection
4. **Achievable**: Realistic for current AI models

#### Implementation
```python
def check_contamination(video_path: str) -> float:
    """
    Calculate contamination score
    
    Returns:
        float: Contamination score (0.0-1.0)
    """
    # Detect unexpected IP in video
    unexpected_ip = detect_unauthorized_ip(video_path)
    
    # Calculate contamination percentage
    contamination = len(unexpected_ip) / total_detectable_ip
    
    return contamination

# Usage
contamination = check_contamination(video_path)
if contamination > 0.05:
    # Flag for review
    flag_contaminated_content(video_path, contamination)
```

---

### Decision 8: Logging Format

**Status**: ✅ Decided  
**Decision Date**: November 24, 2025  
**Decision Maker**: Neural Arc Team

#### Decision
**Structured JSON Logging** with structlog

#### Rationale
1. **Machine-readable**: Easy to parse and analyze
2. **Structured data**: Consistent format across all logs
3. **Searchable**: Easy to query specific fields
4. **Audit trail**: Complete execution history
5. **Investor demo**: Can show detailed execution flow

#### Format
```json
{
  "timestamp": "2025-11-24T10:30:00.123Z",
  "level": "info",
  "event": "step_completed",
  "step": "initial_attribution",
  "status": "completed",
  "duration_ms": 1850,
  "total_score": 0.85,
  "confidence": 0.92,
  "ip_attributions": {
    "Nike": 0.85
  }
}
```

#### Benefits for Demo
- Show real-time execution
- Highlight key metrics
- Demonstrate transparency
- Provide audit trail

---

### Decision 9: Error Handling Strategy

**Status**: ✅ Decided  
**Decision Date**: November 24, 2025  
**Decision Maker**: Neural Arc Team

#### Decision
**Fail-Fast with Graceful Degradation**

#### Strategy
1. **Critical Errors**: Stop pipeline, log error, return failure
2. **Non-Critical Errors**: Log warning, continue with defaults
3. **Retryable Errors**: Retry with exponential backoff (3 attempts)
4. **User Errors**: Validate input, return clear error message

#### Implementation
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_external_api(endpoint: str, data: dict):
    """Call external API with retry logic"""
    try:
        response = requests.post(endpoint, json=data, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logger.error("API timeout")
        raise
    except requests.exceptions.RequestException as e:
        logger.error(f"API error: {e}")
        raise
```

#### Rationale
1. **PoC focus**: Prioritize demo stability over comprehensive error handling
2. **Investor demo**: Must not fail during presentation
3. **Clear feedback**: Errors should be logged and visible
4. **Future-proof**: Pattern scales to production

---

### Decision 10: Testing Strategy

**Status**: ✅ Decided  
**Decision Date**: November 24, 2025  
**Decision Maker**: Neural Arc Team

#### Decision
**Pyramid Testing Strategy** with focus on critical path

#### Strategy
```
        /\
       /  \
      / E2E \
     /--------\
    /Integration\
   /--------------\
  /   Unit Tests   \
 /------------------\
```

**Distribution**:
- **Unit Tests**: 60% (fast, isolated)
- **Integration Tests**: 30% (module interactions)
- **E2E Tests**: 10% (complete pipeline)

#### Critical Tests (Must Pass for Milestone 1)
1. Test 1.1: Single IP Logo
2. Test 2.1: High Similarity Match
3. Test 5.1: Pre-Gen Safety Pass
4. Test 5.3: Post-Gen Safety Pass
5. Test 7.1: Processing Speed

#### Rationale
1. **Fast feedback**: Unit tests run quickly
2. **Comprehensive coverage**: All levels tested
3. **Critical path focus**: Prioritize investor demo scenarios
4. **Scalable**: Easy to add more tests

---

### Decision 11: Prompt Augmentation Strategy

**Status**: 🟡 Pending (Phase 2)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Options Considered

##### Option A: Simple Concatenation
**Description**: Append IP context to original prompt

**Example**:
```
Original: "A dog playing with a ball"
IP Context: "Nike logo, Basketball product"
Augmented: "A dog playing with a ball featuring Nike logo and Basketball product"
```

**Pros**:
- Simple to implement
- Easy to understand
- Fast processing

**Cons**:
- May not preserve prompt intent
- Limited control over IP placement

##### Option B: Template-Based
**Description**: Use templates to structure augmented prompt

**Example**:
```
Template: "{original_prompt} with {ip_elements} prominently featured"
Result: "A dog playing with a ball with Nike logo and Basketball prominently featured"
```

**Pros**:
- More control over structure
- Consistent formatting
- Better model understanding

**Cons**:
- Requires template design
- Less flexible

##### Option C: LLM-Based Augmentation
**Description**: Use LLM to intelligently merge prompt and IP

**Pros**:
- Natural language integration
- Context-aware placement
- Highest quality

**Cons**:
- Adds latency
- Additional API costs
- More complex

#### Recommendation
**Start with Option A (Simple Concatenation)** for Milestone 1, then evaluate Option B or C based on results.

---

### Decision 12: Multi-IP Attribution Strategy

**Status**: 🟡 Pending (Phase 2)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Proposed Approach
**Equal Split with Weighted Adjustment**

#### Algorithm
```python
def multi_ip_attribution(ip_elements: List[IPContent], similarities: List[float]) -> dict:
    """
    Multi-IP attribution algorithm
    
    Steps:
    1. Start with equal split (100% / n)
    2. Adjust based on similarity scores
    3. Adjust based on visual prominence
    4. Normalize to 100%
    """
    n = len(ip_elements)
    base_score = 1.0 / n
    
    attributions = {}
    for ip, similarity in zip(ip_elements, similarities):
        # Base score adjusted by similarity
        score = base_score * similarity
        attributions[ip.owner] = score
    
    # Normalize
    total = sum(attributions.values())
    if total > 0:
        attributions = {k: v/total for k, v in attributions.items()}
    
    return attributions
```

#### Test Scenarios
- **2 IP Elements**: 50/50 split adjusted by similarity
- **3 IP Elements**: 33/33/33 split adjusted by similarity
- **Nested IP**: Parent 60%, Child 40%

---

### Decision 13: Safety Rule Engine Design

**Status**: 🟡 Pending (Phase 3)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Proposed Design
**Rule-Based Engine with YAML Configuration**

#### Architecture
```python
class GuardrailEngine:
    def __init__(self, rules_file: str):
        self.rules = self._load_rules(rules_file)
    
    def evaluate(self, content: dict, rule_type: str) -> List[str]:
        """Evaluate content against rules"""
        violations = []
        
        for rule in self.rules[rule_type]:
            if not self._check_rule(rule, content):
                violations.append(rule['id'])
        
        return violations
```

#### Rule Types
1. **Blocklist Rules**: Block specific IP/brands
2. **License Rules**: Verify license compliance
3. **Content Rules**: Check content appropriateness
4. **Contamination Rules**: Detect unexpected IP

#### Benefits
- **Flexible**: Easy to add/modify rules
- **Transparent**: Rules visible in YAML
- **Auditable**: Clear rule evaluation
- **Scalable**: Can add complex rules

---

### Decision 14: Performance Optimization Strategy

**Status**: 🟡 Pending (Phase 4)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Proposed Optimizations

##### 1. Caching Strategy
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_embedding(text: str) -> np.ndarray:
    """Cache embeddings for repeated queries"""
    return generate_embedding(text)
```

##### 2. Batch Processing
```python
def process_batch(prompts: List[str]) -> List[dict]:
    """Process multiple prompts in parallel"""
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(pipeline.execute, p) for p in prompts]
        return [f.result() for f in futures]
```

##### 3. Connection Pooling
```python
# Redis connection pool
pool = redis.ConnectionPool(
    host=settings.MEMORYDB_HOST,
    port=settings.MEMORYDB_PORT,
    max_connections=10,
    decode_responses=True
)
```

##### 4. Async Operations
```python
async def async_pipeline_execute(prompt: str):
    """Async pipeline execution"""
    # Use async/await for I/O operations
    retrieved = await async_retrieve(prompt)
    generated = await async_generate(prompt)
    return await async_analyze(generated)
```

---

### Decision 15: Testing Thresholds

**Status**: 🟡 Pending (Milestone 2 Deliverable)  
**Decision Date**: TBD  
**Decision Maker**: Neural Arc Team

#### Proposed Thresholds

##### Attribution Thresholds
| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Min Confidence | 0.90 | High confidence required |
| Min Similarity | 0.70 | Medium match threshold |
| Max Variance | 0.05 | ±5% tolerance |

##### Safety Thresholds
| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Contamination | 0.05 | 5% max contamination |
| False Positive | 0.05 | 5% max false blocks |
| False Negative | 0.01 | 1% max missed violations |

##### Performance Thresholds
| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Attribution Time | 2000ms | Fast enough for real-time |
| Safety Check | 500ms | Minimal overhead |
| Total Pipeline | 60000ms | Acceptable for demo |
| DB Query | 100ms | Low latency |

#### Validation
- Test against Test Matrix scenarios
- Adjust based on actual performance
- Document final values in Milestone 2

---

## 🔄 Decision Review Process

### When to Review Decisions
1. **After Milestone 1**: Review model selections
2. **After Phase 2**: Review attribution algorithm
3. **After Phase 3**: Review safety thresholds
4. **Before PoC Delivery**: Review all decisions

### Review Criteria
- Does it meet functional requirements?
- Is it performant enough?
- Is it explainable to investors?
- Is it scalable to production?
- Are there better alternatives?

### Decision Update Process
1. Document new information
2. Re-evaluate alternatives
3. Make new decision
4. Update implementation
5. Update tests
6. Update documentation

---

## 📊 Decision Impact Matrix

| Decision | Impact on | Risk Level | Reversibility |
|----------|-----------|------------|---------------|
| Video Model | Generation quality, cost | Medium | High |
| Analysis Model | Attribution accuracy | High | Medium |
| Attribution Algorithm | Accuracy, performance | High | Medium |
| Similarity Metric | Comparison accuracy | Medium | Low |
| Vector DB | Performance, scalability | Low | Low |
| Variance Threshold | Acceptance criteria | High | High |
| Contamination Threshold | Safety effectiveness | High | High |
| Logging Format | Observability | Low | High |
| Error Handling | Demo stability | High | Medium |
| Testing Strategy | Quality assurance | Medium | High |

---

## 🎯 Open Questions

### Technical Questions
1. **Q**: What is the optimal embedding dimension?  
   **Status**: 🟡 Pending  
   **Impact**: Performance and accuracy

2. **Q**: Should we use frame sampling or full video analysis?  
   **Status**: 🟡 Pending  
   **Impact**: Processing time and accuracy

3. **Q**: How to handle audio-visual attribution separation?  
   **Status**: 🟡 Pending  
   **Impact**: Multi-modal attribution accuracy

4. **Q**: What is the optimal cache size for embeddings?  
   **Status**: 🟡 Pending  
   **Impact**: Memory usage and performance

### Business Questions
1. **Q**: What is the acceptable cost per video generation?  
   **Status**: 🟡 Pending  
   **Impact**: Model selection

2. **Q**: What is the target accuracy for investor confidence?  
   **Status**: 🟡 Pending  
   **Impact**: Algorithm selection

3. **Q**: What are the priority IP types for PoC?  
   **Status**: 🟡 Pending  
   **Impact**: Feature prioritization

---

## 📝 Decision Documentation Template

### Decision: [Title]

**Status**: 🔴 Not Started | 🟡 Pending | ✅ Decided  
**Decision Date**: [Date]  
**Decision Maker**: [Name/Team]  
**Reviewers**: [Names]

#### Context
[Why is this decision needed?]

#### Options Considered
1. **Option A**: [Description]
   - Pros: [List]
   - Cons: [List]

2. **Option B**: [Description]
   - Pros: [List]
   - Cons: [List]

#### Decision
[What was decided and why?]

#### Rationale
[Detailed reasoning]

#### Implementation Impact
[How does this affect implementation?]

#### Risks & Mitigation
[Potential risks and how to mitigate]

#### Success Metrics
[How to measure if decision was correct]

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Created By**: Helium AI (Neural Arc Inc.)  
**Status**: Living Document - Update as decisions are made