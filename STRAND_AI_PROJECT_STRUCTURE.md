# Strand AI PoC - Complete Project Structure & Implementation Guide

## 📋 Project Overview

**Project Name**: Strand AI Platform Core Capabilities Demo (PoC)  
**Version**: 1.0  
**Purpose**: Demonstrate IP attribution and safety controls for AI-generated video content  
**Timeline**: Milestone 1 - 7 working days | Full PoC - Long-term milestone  

---

## 🎯 Core Objectives

1. **Inspire Investor Confidence** - Demonstrate IP protection and monetization capabilities
2. **Track Licensed IP Usage** - Implement attribution system for multimedia content
3. **Enforce IP Guardrails** - Pre and post-generation safety controls
4. **Provide Auditable Pipeline** - Complete logging and transparency

---

## 📁 Complete Project Structure

```
strand-ai-poc/
├── README.md                          # Project overview and quick start
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
│
├── config/                            # Configuration files
│   ├── __init__.py
│   ├── settings.py                    # Application settings
│   ├── models_config.yaml             # AI model configurations
│   ├── attribution_config.yaml        # Attribution algorithm settings
│   └── safety_rules.yaml              # IP safety guardrail rules
│
├── src/                               # Source code
│   ├── __init__.py
│   │
│   ├── core/                          # Core pipeline orchestration
│   │   ├── __init__.py
│   │   ├── pipeline.py                # Main execution pipeline (FR1.1)
│   │   ├── orchestrator.py            # Step orchestration logic
│   │   └── logger.py                  # Execution logging (FR1.4)
│   │
│   ├── retrieval/                     # Vector retrieval & RAG
│   │   ├── __init__.py
│   │   ├── vector_db.py               # MemoryDB for Redis integration
│   │   ├── embeddings.py              # Embedding generation
│   │   └── retriever.py               # IP context retrieval (FR3.1)
│   │
│   ├── attribution/                   # Attribution calculation
│   │   ├── __init__.py
│   │   ├── initial_attribution.py     # Initial attribution (FR4)
│   │   ├── final_attribution.py       # Final attribution (FR8)
│   │   ├── embedding_comparison.py    # Similarity comparison (FR7)
│   │   ├── algorithms.py              # Attribution algorithms
│   │   └── reconciliation.py          # Score reconciliation logic
│   │
│   ├── safety/                        # IP Safety controls
│   │   ├── __init__.py
│   │   ├── pre_generation_check.py    # Pre-gen safety (FR2)
│   │   ├── post_generation_check.py   # Post-gen safety (FR10)
│   │   ├── guardrails.py              # Safety rule engine
│   │   └── contamination_detector.py  # Model contamination detection
│   │
│   ├── generation/                    # Video generation
│   │   ├── __init__.py
│   │   ├── video_model.py             # AI video model integration
│   │   ├── prompt_augmentation.py     # Prompt enhancement (FR3.3)
│   │   └── model_adapters/            # Model-specific adapters
│   │       ├── __init__.py
│   │       ├── ltx_video.py           # LTX-Video adapter
│   │       └── mochi.py               # Mochi 1 adapter
│   │
│   ├── analysis/                      # Video analysis
│   │   ├── __init__.py
│   │   ├── video_analyzer.py          # Basic AI video analysis (FR4.2)
│   │   ├── content_detector.py        # Content detection
│   │   └── feature_extractor.py       # Feature extraction
│   │
│   ├── models/                        # Data models
│   │   ├── __init__.py
│   │   ├── ip_content.py              # IP content model
│   │   ├── attribution_result.py      # Attribution result model
│   │   ├── safety_result.py           # Safety check result model
│   │   └── pipeline_state.py          # Pipeline execution state
│   │
│   ├── utils/                         # Utility functions
│   │   ├── __init__.py
│   │   ├── video_utils.py             # Video processing utilities
│   │   ├── embedding_utils.py         # Embedding utilities
│   │   ├── metrics.py                 # Performance metrics
│   │   └── validators.py              # Input validation
│   │
│   └── api/                           # API endpoints (optional)
│       ├── __init__.py
│       ├── app.py                     # FastAPI/Flask application
│       ├── routes.py                  # API routes
│       └── schemas.py                 # Request/response schemas
│
├── data/                              # Data directory
│   ├── preloaded/                     # Pre-loaded assets (FR1.2)
│   │   ├── videos/
│   │   │   └── demo_video.mp4         # Pre-loaded demo video
│   │   ├── embeddings/
│   │   │   └── qa_embeddings.json     # Pre-loaded Q&A embeddings
│   │   └── prompts/
│   │       └── hardcoded_prompt.txt   # Hard-coded demo prompt (FR1.3)
│   │
│   ├── generated/                     # Generated content
│   │   └── videos/                    # AI-generated videos
│   │
│   └── logs/                          # Execution logs
│       └── pipeline_logs/             # Pipeline execution logs
│
├── tests/                             # Test suite
│   ├── __init__.py
│   ├── conftest.py                    # Pytest configuration
│   │
│   ├── unit/                          # Unit tests
│   │   ├── test_attribution.py
│   │   ├── test_safety.py
│   │   ├── test_retrieval.py
│   │   └── test_generation.py
│   │
│   ├── integration/                   # Integration tests
│   │   ├── test_pipeline.py
│   │   └── test_end_to_end.py
│   │
│   └── test_matrix/                   # Testing matrix implementation
│       ├── test_baseline.py           # Test Set 1: Baseline Attribution
│       ├── test_embedding.py          # Test Set 2: Embedding Comparison
│       ├── test_derivative.py         # Test Set 3: Derivative Content
│       ├── test_multi_ip.py           # Test Set 4: Multi-IP Content
│       ├── test_safety.py             # Test Set 5: Safety Controls
│       ├── test_edge_cases.py         # Test Set 6: Edge Cases
│       └── test_performance.py        # Test Set 7: Performance
│
├── scripts/                           # Utility scripts
│   ├── setup_environment.sh           # Environment setup
│   ├── load_preloaded_assets.py       # Load demo assets
│   ├── run_demo.py                    # Run PoC demonstration
│   └── generate_test_data.py          # Generate test data
│
├── docs/                              # Documentation
│   ├── architecture/
│   │   ├── system_architecture.md     # Technical architecture diagram
│   │   ├── data_flow.md               # Data flow documentation
│   │   └── component_design.md        # Component design details
│   │
│   ├── api/
│   │   └── api_documentation.md       # API documentation
│   │
│   ├── testing/
│   │   ├── testing_strategy.md        # Testing approach
│   │   ├── test_scenarios.md          # Test scenarios
│   │   └── acceptance_criteria.md     # Acceptance criteria
│   │
│   └── decisions/
│       ├── attribution_methodology.md # Attribution design decisions
│       ├── testing_thresholds.md      # Testing threshold values
│       └── model_selection.md         # AI model selection rationale
│
└── notebooks/                         # Jupyter notebooks (optional)
    ├── attribution_experiments.ipynb  # Attribution algorithm experiments
    ├── embedding_analysis.ipynb       # Embedding similarity analysis
    └── performance_profiling.ipynb    # Performance profiling
```

---

## 🔧 Detailed File Explanations

### 1. Core Pipeline (`src/core/`)

#### `pipeline.py` - Main Execution Pipeline
**Purpose**: Orchestrates the entire PoC flow from prompt input to final result  
**Key Responsibilities**:
- Execute the 10-step pipeline defined in the PRD
- Coordinate between all modules (retrieval, attribution, safety, generation)
- Handle execution state management
- Implement FR1.1 (Code Execution Framework)

**Key Functions**:
```python
class StrandPipeline:
    def execute(self, prompt: str) -> PipelineResult:
        """Execute complete pipeline"""
        
    def _step_1_prompt_input(self, prompt: str)
    def _step_2_vector_retrieval(self, prompt: str)
    def _step_3_initial_attribution(self, retrieved_context)
    def _step_4_pre_generation_safety(self, prompt, context)
    def _step_5_prompt_augmentation(self, prompt, context)
    def _step_6_video_generation(self, augmented_prompt)
    def _step_7_post_generation_safety(self, video)
    def _step_8_final_attribution(self, video, original_ip)
    def _step_9_video_analysis(self, video)
    def _step_10_logging_and_display(self, results)
```

**Implementation Notes**:
- Use state machine pattern for step execution
- Implement rollback mechanism for failed steps
- Log every step transition (FR1.4)
- Handle both positive and negative paths

---

#### `orchestrator.py` - Step Orchestration Logic
**Purpose**: Manages step execution order and dependencies  
**Key Responsibilities**:
- Validate step prerequisites
- Handle step failures and retries
- Manage execution context between steps
- Implement circuit breaker pattern

**Key Functions**:
```python
class PipelineOrchestrator:
    def execute_step(self, step_name: str, context: dict)
    def validate_prerequisites(self, step_name: str)
    def handle_step_failure(self, step_name: str, error: Exception)
    def get_next_step(self, current_step: str)
```

---

#### `logger.py` - Execution Logging
**Purpose**: Implements FR1.4 - comprehensive execution logging  
**Key Responsibilities**:
- Log every pipeline step with timestamps
- Record input/output for each step
- Track attribution scores and safety check results
- Generate audit trail for investor demonstration

**Log Format**:
```json
{
  "timestamp": "2025-11-24T10:30:00Z",
  "step": "initial_attribution",
  "status": "success",
  "input": {...},
  "output": {...},
  "duration_ms": 1850,
  "metadata": {...}
}
```

---

### 2. Retrieval Module (`src/retrieval/`)

#### `vector_db.py` - MemoryDB for Redis Integration
**Purpose**: Interface with Amazon MemoryDB for Redis (Vector DB)  
**Key Responsibilities**:
- Connect to MemoryDB cluster
- Store and retrieve vector embeddings
- Perform similarity searches
- Handle connection pooling and retries

**Key Functions**:
```python
class VectorDatabase:
    def connect(self, connection_string: str)
    def store_embedding(self, id: str, embedding: np.ndarray, metadata: dict)
    def search_similar(self, query_embedding: np.ndarray, top_k: int)
    def get_embedding(self, id: str)
```

**Configuration**:
- Connection string from environment variables
- Connection pool size: 10
- Timeout: 5 seconds
- Retry policy: 3 attempts with exponential backoff

---

#### `embeddings.py` - Embedding Generation
**Purpose**: Generate embeddings for text and video content  
**Key Responsibilities**:
- Generate text embeddings for prompts
- Generate video embeddings for content
- Normalize embeddings for comparison
- Cache embeddings for performance

**Key Functions**:
```python
class EmbeddingGenerator:
    def generate_text_embedding(self, text: str) -> np.ndarray
    def generate_video_embedding(self, video_path: str) -> np.ndarray
    def normalize_embedding(self, embedding: np.ndarray) -> np.ndarray
```

**Model Selection** (TBD in Milestone 1):
- Text: OpenAI text-embedding-3-large or Sentence-BERT
- Video: CLIP or VideoMAE

---

#### `retriever.py` - IP Context Retrieval
**Purpose**: Implements FR3.1 - Vector retrieval based on input prompt  
**Key Responsibilities**:
- Query vector DB with prompt embedding
- Retrieve relevant IP context
- Rank results by relevance
- Return top-k IP elements

**Key Functions**:
```python
class IPRetriever:
    def retrieve_ip_context(self, prompt: str, top_k: int = 5) -> List[IPContent]
    def rank_results(self, results: List[dict]) -> List[IPContent]
    def filter_by_threshold(self, results: List[dict], min_score: float)
```

**Retrieval Strategy**:
- Use cosine similarity for ranking
- Minimum relevance threshold: 0.7 (TBD in Milestone 1)
- Return top 5 most relevant IP elements

---

### 3. Attribution Module (`src/attribution/`)

#### `initial_attribution.py` - Initial Attribution (FR4)
**Purpose**: Calculate expected IP usage before video generation  
**Key Responsibilities**:
- Analyze retrieved IP context
- Calculate attribution scores for each IP element
- Aggregate scores across multiple IP elements
- Return initial attribution result

**Key Functions**:
```python
class InitialAttributionCalculator:
    def calculate(self, retrieved_context: List[IPContent]) -> AttributionResult
    def score_ip_element(self, ip_element: IPContent, prompt: str) -> float
    def aggregate_scores(self, scores: List[float]) -> AttributionResult
```

**Algorithm** (TBD in Milestone 1):
- Weighted average based on relevance scores
- Normalize to 100% total attribution
- Track individual IP owner contributions

---

#### `final_attribution.py` - Final Attribution (FR8)
**Purpose**: Calculate actual IP usage in generated video  
**Key Responsibilities**:
- Analyze generated video content
- Compare with original IP embeddings
- Calculate final attribution scores
- Reconcile with initial attribution

**Key Functions**:
```python
class FinalAttributionCalculator:
    def calculate(self, video_path: str, original_ip: List[IPContent]) -> AttributionResult
    def extract_video_features(self, video_path: str) -> np.ndarray
    def compare_with_original(self, video_features, ip_embeddings)
    def reconcile_with_initial(self, final_score, initial_score)
```

**Reconciliation Logic**:
- Target variance: ±5% (TBD in Milestone 1)
- Flag significant deviations for review
- Log reconciliation details

---

#### `embedding_comparison.py` - Similarity Comparison (FR7)
**Purpose**: Implements FR7 - Embedding comparison approach  
**Key Responsibilities**:
- Calculate cosine similarity between embeddings
- Implement similarity thresholds
- Detect derivative content
- Handle multi-element comparisons

**Key Functions**:
```python
class EmbeddingComparator:
    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float
    def classify_similarity(self, score: float) -> str  # High/Medium/Low/None
    def detect_derivative(self, original, generated) -> bool
```

**Similarity Thresholds** (from Testing Matrix):
- High Match: >0.90
- Medium Match: 0.70-0.90
- Low Match: 0.30-0.70
- No Match: <0.30

---

#### `algorithms.py` - Attribution Algorithms
**Purpose**: Core attribution calculation algorithms  
**Key Responsibilities**:
- Implement weighted attribution
- Handle multi-IP scenarios
- Calculate nested IP attribution
- Provide algorithm variants for testing

**Key Algorithms**:
```python
def weighted_attribution(ip_elements: List[IPContent], weights: List[float]) -> dict
def multi_ip_attribution(ip_elements: List[IPContent]) -> dict
def nested_ip_attribution(parent_ip: IPContent, child_ip: IPContent) -> dict
```

---

#### `reconciliation.py` - Score Reconciliation Logic
**Purpose**: Reconcile initial vs final attribution scores  
**Key Responsibilities**:
- Compare initial and final scores
- Calculate variance
- Flag discrepancies
- Generate reconciliation report

**Key Functions**:
```python
class AttributionReconciler:
    def reconcile(self, initial: AttributionResult, final: AttributionResult) -> ReconciliationResult
    def calculate_variance(self, initial_score, final_score) -> float
    def flag_discrepancies(self, variance: float, threshold: float) -> bool
```

---

### 4. Safety Module (`src/safety/`)

#### `pre_generation_check.py` - Pre-Generation Safety (FR2)
**Purpose**: Implements FR2 - Pre-generation IP safety check  
**Key Responsibilities**:
- Validate prompt against IP guardrails
- Check for restricted IP references
- Verify license compliance
- Block unsafe prompts

**Key Functions**:
```python
class PreGenerationSafetyChecker:
    def check(self, prompt: str, ip_context: List[IPContent]) -> SafetyResult
    def validate_against_guardrails(self, prompt: str) -> bool
    def check_restricted_ip(self, prompt: str) -> List[str]
    def verify_license(self, ip_context: List[IPContent]) -> bool
```

**Safety Rules**:
- No unlicensed IP references
- No restricted brand mentions
- No prohibited content types
- License terms compliance

---

#### `post_generation_check.py` - Post-Generation Safety (FR10)
**Purpose**: Implements FR10 - Post-generation IP safety check  
**Key Responsibilities**:
- Analyze generated video for IP violations
- Detect unauthorized IP appearance
- Check for contamination
- Validate against original prompt

**Key Functions**:
```python
class PostGenerationSafetyChecker:
    def check(self, video_path: str, original_prompt: str) -> SafetyResult
    def detect_unauthorized_ip(self, video_path: str) -> List[str]
    def check_contamination(self, video_path: str) -> float
    def validate_against_prompt(self, video_path: str, prompt: str) -> bool
```

**Contamination Threshold**: <5% (from Testing Matrix)

---

#### `guardrails.py` - Safety Rule Engine
**Purpose**: Centralized safety rule management  
**Key Responsibilities**:
- Load safety rules from configuration
- Evaluate rules against content
- Provide rule explanations
- Support rule versioning

**Key Functions**:
```python
class GuardrailEngine:
    def load_rules(self, config_path: str)
    def evaluate_rule(self, rule_id: str, content: dict) -> bool
    def get_rule_explanation(self, rule_id: str) -> str
```

---

#### `contamination_detector.py` - Model Contamination Detection
**Purpose**: Detect unintended IP in generated content  
**Key Responsibilities**:
- Analyze video for unexpected IP
- Calculate contamination score
- Compare with known IP database
- Flag contaminated content

**Key Functions**:
```python
class ContaminationDetector:
    def detect(self, video_path: str) -> ContaminationResult
    def calculate_contamination_score(self, video_features) -> float
    def identify_contaminating_ip(self, video_features) -> List[str]
```

---

### 5. Generation Module (`src/generation/`)

#### `video_model.py` - AI Video Model Integration
**Purpose**: Interface with selected AI video generation model  
**Key Responsibilities**:
- Call AI video model API
- Handle model-specific parameters
- Manage generation timeouts
- Return generated video

**Key Functions**:
```python
class VideoModelClient:
    def generate(self, prompt: str, **kwargs) -> str  # Returns video path
    def check_model_status(self) -> bool
    def get_model_info(self) -> dict
```

**Model Selection** (TBD in Milestone 1):
- Option 1: LTX-Video
- Option 2: Mochi 1
- Fallback: Stable Video Diffusion

---

#### `prompt_augmentation.py` - Prompt Enhancement (FR3.3)
**Purpose**: Implements FR3.3 - Augment prompt with IP context  
**Key Responsibilities**:
- Merge original prompt with IP context
- Format for model consumption
- Preserve IP attribution markers
- Optimize for model performance

**Key Functions**:
```python
class PromptAugmenter:
    def augment(self, original_prompt: str, ip_context: List[IPContent]) -> str
    def format_ip_context(self, ip_context: List[IPContent]) -> str
    def add_attribution_markers(self, prompt: str) -> str
```

**Augmentation Strategy**:
```
Original: "A dog playing with a ball"
IP Context: [Logo: "Nike", Product: "Basketball"]
Augmented: "A dog playing with a Nike basketball, featuring the Nike logo"
```

---

#### `model_adapters/` - Model-Specific Adapters
**Purpose**: Provide model-specific implementations  
**Key Responsibilities**:
- Handle model-specific API calls
- Convert parameters to model format
- Parse model responses
- Implement retry logic

**Adapter Pattern**:
```python
class BaseModelAdapter(ABC):
    @abstractmethod
    def generate(self, prompt: str, **kwargs) -> str
    
class LTXVideoAdapter(BaseModelAdapter):
    def generate(self, prompt: str, **kwargs) -> str:
        # LTX-Video specific implementation
        
class MochiAdapter(BaseModelAdapter):
    def generate(self, prompt: str, **kwargs) -> str:
        # Mochi 1 specific implementation
```

---

### 6. Analysis Module (`src/analysis/`)

#### `video_analyzer.py` - Basic AI Video Analysis (FR4.2)
**Purpose**: Implements FR4.2 - Basic AI video analysis  
**Key Responsibilities**:
- Analyze generated video content
- Extract visual features
- Detect objects and scenes
- Generate analysis report

**Key Functions**:
```python
class VideoAnalyzer:
    def analyze(self, video_path: str) -> AnalysisResult
    def extract_features(self, video_path: str) -> dict
    def detect_objects(self, video_path: str) -> List[str]
    def generate_report(self, analysis_data: dict) -> str
```

**Analysis Output Example**:
```
"Analysis: Video contains a dog and a ball, Nike logo visible at 0:03, 
basketball product featured throughout, duration 5 seconds"
```

---

#### `content_detector.py` - Content Detection
**Purpose**: Detect specific content types in video  
**Key Responsibilities**:
- Detect logos and brands
- Identify products
- Recognize characters
- Detect audio elements

**Key Functions**:
```python
class ContentDetector:
    def detect_logos(self, video_path: str) -> List[Logo]
    def detect_products(self, video_path: str) -> List[Product]
    def detect_characters(self, video_path: str) -> List[Character]
    def detect_audio(self, video_path: str) -> AudioAnalysis
```

---

#### `feature_extractor.py` - Feature Extraction
**Purpose**: Extract features for attribution and analysis  
**Key Responsibilities**:
- Extract visual features (color, shape, texture)
- Extract temporal features (motion, transitions)
- Extract audio features (music, speech)
- Generate feature vectors

**Key Functions**:
```python
class FeatureExtractor:
    def extract_visual_features(self, video_path: str) -> np.ndarray
    def extract_temporal_features(self, video_path: str) -> np.ndarray
    def extract_audio_features(self, video_path: str) -> np.ndarray
    def combine_features(self, visual, temporal, audio) -> np.ndarray
```

---

### 7. Models (`src/models/`)

#### Data Models
**Purpose**: Define data structures for the entire system  

**Key Models**:

```python
# ip_content.py
class IPContent:
    id: str
    type: str  # logo, character, music, product
    owner: str
    embedding: np.ndarray
    metadata: dict
    license_terms: dict

# attribution_result.py
class AttributionResult:
    total_score: float
    ip_attributions: Dict[str, float]  # owner -> score
    confidence: float
    timestamp: datetime
    details: dict

# safety_result.py
class SafetyResult:
    passed: bool
    check_type: str  # pre_generation, post_generation
    violations: List[str]
    contamination_score: float
    timestamp: datetime

# pipeline_state.py
class PipelineState:
    current_step: str
    completed_steps: List[str]
    context: dict
    results: dict
    errors: List[Exception]
```

---

### 8. Configuration (`config/`)

#### `settings.py` - Application Settings
**Purpose**: Centralized configuration management  
**Key Settings**:
```python
class Settings:
    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    
    # Vector DB
    MEMORYDB_HOST: str
    MEMORYDB_PORT: int
    MEMORYDB_PASSWORD: str
    
    # AI Models
    VIDEO_MODEL: str  # "ltx-video" or "mochi"
    VIDEO_MODEL_API_KEY: str
    ANALYSIS_MODEL: str
    
    # Attribution
    ATTRIBUTION_VARIANCE_THRESHOLD: float = 0.05
    MIN_CONFIDENCE_SCORE: float = 0.90
    
    # Safety
    CONTAMINATION_THRESHOLD: float = 0.05
    ENABLE_PRE_GEN_CHECK: bool = True
    ENABLE_POST_GEN_CHECK: bool = True
    
    # Performance
    MAX_EXECUTION_TIME: int = 60  # seconds
    ENABLE_CACHING: bool = True
```

---

#### `models_config.yaml` - AI Model Configurations
**Purpose**: Model-specific configurations  
**Content**:
```yaml
video_models:
  ltx_video:
    api_endpoint: "https://api.ltx-video.com/v1/generate"
    max_duration: 10  # seconds
    resolution: "1080p"
    default_params:
      guidance_scale: 7.5
      num_inference_steps: 50
      
  mochi:
    api_endpoint: "https://api.mochi.com/v1/generate"
    max_duration: 8
    resolution: "720p"
    default_params:
      temperature: 0.7
      
analysis_models:
  clip:
    model_name: "openai/clip-vit-large-patch14"
    device: "cuda"
```

---

#### `attribution_config.yaml` - Attribution Algorithm Settings
**Purpose**: Attribution calculation configurations  
**Content**:
```yaml
attribution:
  algorithm: "weighted_average"  # weighted_average, max_pooling, hierarchical
  
  weights:
    visual: 0.6
    audio: 0.3
    temporal: 0.1
    
  thresholds:
    min_similarity: 0.70
    high_similarity: 0.90
    variance_tolerance: 0.05
    
  reconciliation:
    enable: true
    max_variance: 0.05
    flag_threshold: 0.10
```

---

#### `safety_rules.yaml` - IP Safety Guardrail Rules
**Purpose**: Define IP safety rules  
**Content**:
```yaml
safety_rules:
  pre_generation:
    - id: "no_unlicensed_ip"
      description: "Block prompts referencing unlicensed IP"
      severity: "critical"
      action: "block"
      
    - id: "license_compliance"
      description: "Verify license terms allow usage"
      severity: "critical"
      action: "block"
      
  post_generation:
    - id: "unauthorized_ip_detection"
      description: "Detect unauthorized IP in generated content"
      severity: "critical"
      action: "flag"
      
    - id: "contamination_check"
      description: "Check for model contamination"
      severity: "high"
      threshold: 0.05
      action: "flag"
```

---

### 9. Testing (`tests/`)

#### Test Structure
**Purpose**: Comprehensive testing framework aligned with Testing Matrix  

**Test Categories**:

1. **Unit Tests** (`tests/unit/`)
   - Test individual functions and classes
   - Mock external dependencies
   - Fast execution (<1 second per test)

2. **Integration Tests** (`tests/integration/`)
   - Test module interactions
   - Use test database and models
   - Moderate execution time (<10 seconds per test)

3. **Test Matrix** (`tests/test_matrix/`)
   - Implement all 38 tests from Testing Matrix
   - Organized by test sets (1-7)
   - Includes acceptance criteria validation

**Example Test Structure**:
```python
# tests/test_matrix/test_baseline.py
class TestBaselineAttribution:
    def test_1_1_single_ip_logo(self):
        """Test 1.1: Single IP Element - Logo"""
        # Load pre-loaded video with logo
        # Calculate initial attribution
        # Generate video
        # Calculate final attribution
        # Assert: Initial vs Final within ±5%
        
    def test_1_2_single_ip_character(self):
        """Test 1.2: Single IP Element - Character"""
        # Similar structure
```

---

### 10. Scripts (`scripts/`)

#### `setup_environment.sh` - Environment Setup
**Purpose**: Automated environment setup  
**Actions**:
- Install Python dependencies
- Configure environment variables
- Setup Vector DB connection
- Load pre-loaded assets
- Verify installation

---

#### `load_preloaded_assets.py` - Load Demo Assets
**Purpose**: Load pre-loaded assets into system (FR1.2)  
**Actions**:
- Load demo video into data/preloaded/videos/
- Load Q&A embeddings into Vector DB
- Load hard-coded prompt
- Verify asset integrity

---

#### `run_demo.py` - Run PoC Demonstration
**Purpose**: Execute the complete PoC demonstration  
**Usage**:
```bash
python scripts/run_demo.py --prompt "hardcoded" --verbose
```

**Actions**:
- Initialize pipeline
- Execute all 10 steps
- Display results
- Generate execution log

---

### 11. Documentation (`docs/`)

#### `architecture/system_architecture.md`
**Purpose**: Technical architecture diagram and description  
**Content**:
- System components diagram
- Data flow diagrams
- Integration points
- Scalability considerations

---

#### `decisions/attribution_methodology.md`
**Purpose**: Document attribution design decisions (Milestone 2 deliverable)  
**Content**:
- Selected attribution algorithm
- Reconciliation logic
- Accuracy targets
- Rationale for decisions

---

#### `decisions/testing_thresholds.md`
**Purpose**: Document testing threshold values (Milestone 2 deliverable)  
**Content**:
- Embedding similarity thresholds
- Relevance score thresholds
- Contamination thresholds
- Rationale for values

---

## 🚀 Implementation Phases

### Phase 1: Milestone 1 (Days 1-7)

**Deliverables**:
1. ✅ Model Selection (AI Video Model + Analysis Model)
2. ✅ Code Execution Framework with Stubs
3. ✅ Pre-loaded Assets (Video, Embeddings, Prompt)
4. ✅ Execution Logging
5. ✅ Basic Project Structure

**Priority Files**:
- `src/core/pipeline.py` (with stubs)
- `src/core/logger.py`
- `config/settings.py`
- `data/preloaded/` (all assets)
- `scripts/run_demo.py`

**Stub Implementation**:
```python
# Example stub for FR2 (Pre-Generation Safety)
def pre_generation_safety_check(prompt: str, context: dict) -> SafetyResult:
    """Stub: Pre-generation IP safety check"""
    logger.info("[STUB] Executing pre-generation safety check")
    # Stub logic: Always pass for demo
    return SafetyResult(
        passed=True,
        check_type="pre_generation",
        violations=[],
        contamination_score=0.0,
        timestamp=datetime.now()
    )
```

---

### Phase 2: Core Implementation (Days 8-21)

**Focus**: Implement working logic for critical functional requirements  

**Priority Order**:
1. **Vector Retrieval** (FR3.1)
   - Implement `src/retrieval/vector_db.py`
   - Implement `src/retrieval/retriever.py`
   - Test with pre-loaded embeddings

2. **Initial Attribution** (FR4)
   - Implement `src/attribution/initial_attribution.py`
   - Implement `src/attribution/algorithms.py`
   - Test with retrieved context

3. **Video Generation** (FR4.1)
   - Implement `src/generation/video_model.py`
   - Implement model adapter (LTX-Video or Mochi)
   - Test with augmented prompt

4. **Final Attribution** (FR8)
   - Implement `src/attribution/final_attribution.py`
   - Implement `src/attribution/embedding_comparison.py` (FR7)
   - Test with generated video

5. **Safety Controls** (FR2, FR10)
   - Implement `src/safety/pre_generation_check.py`
   - Implement `src/safety/post_generation_check.py`
   - Test with sample content

---

### Phase 3: Integration & Testing (Days 22-28)

**Focus**: End-to-end integration and testing  

**Activities**:
1. Integrate all modules into pipeline
2. Execute Test Set 1 (Baseline Attribution)
3. Execute Test Set 2 (Embedding Comparison)
4. Execute Test Set 5 (Safety Controls)
5. Execute Test Set 7 (Performance)
6. Fix critical bugs
7. Optimize performance

---

### Phase 4: Documentation & Delivery (Days 29-35)

**Focus**: Complete documentation and prepare for delivery  

**Deliverables**:
1. Technical Architecture Diagram
2. Attribution Methodology Document
3. Testing Thresholds Document
4. API Documentation
5. User Guide
6. Acceptance Testing Report

---

## 📊 Success Metrics

### Milestone 1 Success Criteria
- ✅ Model selections documented
- ✅ Code execution framework functional
- ✅ All stubs implemented and logging
- ✅ Pre-loaded assets loaded successfully
- ✅ Demo runs without critical failures
- ✅ Delivery within 7 working days

### PoC Success Criteria
- ✅ All functional requirements (FR1.1 - FR4.2) implemented
- ✅ Initial attribution accuracy >95%
- ✅ Final attribution matches initial within ±5%
- ✅ Safety checks functional (FR2, FR10)
- ✅ End-to-end execution <60 seconds
- ✅ Zero critical failures during demo
- ✅ All critical tests passing (Test Sets 1, 2, 5, 7)

---

## 🎯 Critical Implementation Notes

### 1. Attribution Accuracy Target
**Requirement**: Final attribution must match initial within ±5%  
**Implementation**:
- Calculate variance: `|final_score - initial_score| / initial_score`
- Flag if variance > 0.05
- Log reconciliation details
- Provide explanation for variance

### 2. Embedding Similarity Thresholds
**From Testing Matrix**:
- High Match: >0.90 (derivative content)
- Medium Match: 0.70-0.90 (modified content)
- Low Match: 0.30-0.70 (style influence)
- No Match: <0.30 (unrelated)

### 3. Safety Contamination Threshold
**Requirement**: <5% contamination acceptable  
**Implementation**:
- Calculate contamination score
- Flag if score > 0.05
- Block content if score > 0.10
- Log contamination details

### 4. Performance Requirements
**Targets**:
- Attribution calculation: <2 seconds
- Embedding generation: <1 second
- Safety check: <500ms
- Total pipeline: <60 seconds

### 5. Logging Requirements
**Every step must log**:
- Step name and timestamp
- Input parameters
- Output results
- Duration
- Status (success/failure)
- Error details (if any)

---

## 🔐 Security & Compliance

### Confidentiality
- All IP assets handled securely
- No external data transmission without encryption
- Access controls on sensitive data
- Audit trail for all operations

### License Compliance
- Verify license terms before generation
- Track usage for monetization
- Block unlicensed IP usage
- Document license validation

---

## 📝 Next Steps

### Immediate Actions (Milestone 1)
1. ✅ Review and approve this structure
2. ✅ Select AI Video Model (LTX-Video vs Mochi 1)
3. ✅ Select AI Analysis Model (CLIP vs VideoMAE)
4. ✅ Obtain API keys and access
5. ✅ Setup development environment
6. ✅ Load pre-loaded assets
7. ✅ Implement code execution framework with stubs
8. ✅ Test demo execution

### Post-Milestone 1
1. Implement vector retrieval (FR3.1)
2. Implement initial attribution (FR4)
3. Implement video generation (FR4.1)
4. Implement final attribution (FR8)
5. Implement safety controls (FR2, FR10)
6. Execute testing matrix
7. Document design decisions
8. Prepare for investor demo

---

## 📞 Support & Questions

For questions or clarifications on this structure:
- Review PRD Section 6 (Functional Requirements)
- Review Testing Matrix for test scenarios
- Consult SoW Section 3 for deliverables
- Contact Neural Arc team for technical guidance

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Created By**: Helium AI (Neural Arc Inc.)  
**Status**: Ready for Implementation