# Strand AI PoC - Implementation Guide

## 🎯 Purpose
This guide provides step-by-step instructions for implementing each module of the Strand AI PoC. Use this alongside the Project Structure document to build the system.

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Module Implementation Order](#module-implementation-order)
3. [Detailed Module Guides](#detailed-module-guides)
4. [Testing Guidelines](#testing-guidelines)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Docker (for MemoryDB local testing)
- Git
- AWS Account (for MemoryDB for Redis)
- API Keys for selected AI models

### Initial Setup

#### 1. Clone and Setup Repository
```bash
# Create project directory
mkdir strand-ai-poc
cd strand-ai-poc

# Initialize git
git init

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create .gitignore
cat > .gitignore << EOF
venv/
__pycache__/
*.pyc
.env
*.log
data/generated/
data/logs/
.pytest_cache/
.coverage
*.mp4
*.avi
EOF
```

#### 2. Create Project Structure
```bash
# Create all directories
mkdir -p config src/{core,retrieval,attribution,safety,generation,analysis,models,utils,api}
mkdir -p src/generation/model_adapters
mkdir -p data/{preloaded/{videos,embeddings,prompts},generated/videos,logs/pipeline_logs}
mkdir -p tests/{unit,integration,test_matrix}
mkdir -p scripts docs/{architecture,api,testing,decisions}
mkdir -p notebooks

# Create __init__.py files
find src tests -type d -exec touch {}/__init__.py \;
```

#### 3. Setup Dependencies
```bash
# Create requirements.txt
cat > requirements.txt << EOF
# Core Framework
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0

# Vector Database
redis==5.0.1
redis-om==0.2.1

# AI/ML
openai==1.3.0
anthropic==0.7.0
transformers==4.35.0
torch==2.1.0
sentence-transformers==2.2.2

# Video Processing
opencv-python==4.8.1.78
moviepy==1.0.3
pillow==10.1.0

# Data Processing
numpy==1.26.2
pandas==2.1.3

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
pytest-mock==3.12.0

# Utilities
pyyaml==6.0.1
requests==2.31.0
aiohttp==3.9.1
tenacity==8.2.3

# Logging & Monitoring
structlog==23.2.0
python-json-logger==2.0.7
EOF

# Install dependencies
pip install -r requirements.txt
```

#### 4. Setup Environment Variables
```bash
# Create .env file
cat > .env << EOF
# Environment
ENV=development
DEBUG=true

# Vector Database (Amazon MemoryDB for Redis)
MEMORYDB_HOST=your-memorydb-endpoint.amazonaws.com
MEMORYDB_PORT=6379
MEMORYDB_PASSWORD=your-password
MEMORYDB_SSL=true

# AI Models
VIDEO_MODEL=ltx-video  # or mochi
VIDEO_MODEL_API_KEY=your-api-key
VIDEO_MODEL_ENDPOINT=https://api.example.com/v1/generate

ANALYSIS_MODEL=clip
ANALYSIS_MODEL_API_KEY=your-api-key

# Attribution Settings
ATTRIBUTION_VARIANCE_THRESHOLD=0.05
MIN_CONFIDENCE_SCORE=0.90
MIN_SIMILARITY_THRESHOLD=0.70

# Safety Settings
CONTAMINATION_THRESHOLD=0.05
ENABLE_PRE_GEN_CHECK=true
ENABLE_POST_GEN_CHECK=true

# Performance
MAX_EXECUTION_TIME=60
ENABLE_CACHING=true
LOG_LEVEL=INFO
EOF
```

---

## 📦 Module Implementation Order

### Phase 1: Foundation (Milestone 1 - Days 1-7)

#### Priority 1: Configuration & Logging
**Files to Create**:
1. `config/settings.py`
2. `src/core/logger.py`
3. `src/models/pipeline_state.py`

#### Priority 2: Core Pipeline with Stubs
**Files to Create**:
1. `src/core/pipeline.py`
2. `src/core/orchestrator.py`

#### Priority 3: Pre-loaded Assets
**Files to Create**:
1. `scripts/load_preloaded_assets.py`
2. `data/preloaded/prompts/hardcoded_prompt.txt`

#### Priority 4: Demo Script
**Files to Create**:
1. `scripts/run_demo.py`

---

### Phase 2: Core Functionality (Days 8-21)

#### Week 2: Retrieval & Attribution
**Implementation Order**:
1. Vector Database Integration
2. Embedding Generation
3. IP Retrieval
4. Initial Attribution
5. Embedding Comparison

#### Week 3: Generation & Safety
**Implementation Order**:
1. Video Model Integration
2. Prompt Augmentation
3. Pre-Generation Safety
4. Post-Generation Safety
5. Final Attribution

---

## 🔧 Detailed Module Guides

### Module 1: Configuration System

#### File: `config/settings.py`

```python
"""
Application Settings
Centralized configuration management using Pydantic
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    
    # Vector Database
    MEMORYDB_HOST: str
    MEMORYDB_PORT: int = 6379
    MEMORYDB_PASSWORD: str
    MEMORYDB_SSL: bool = True
    MEMORYDB_DB: int = 0
    
    # AI Models
    VIDEO_MODEL: str = "ltx-video"
    VIDEO_MODEL_API_KEY: str
    VIDEO_MODEL_ENDPOINT: str
    
    ANALYSIS_MODEL: str = "clip"
    ANALYSIS_MODEL_API_KEY: Optional[str] = None
    
    # Attribution
    ATTRIBUTION_VARIANCE_THRESHOLD: float = 0.05
    MIN_CONFIDENCE_SCORE: float = 0.90
    MIN_SIMILARITY_THRESHOLD: float = 0.70
    
    # Safety
    CONTAMINATION_THRESHOLD: float = 0.05
    ENABLE_PRE_GEN_CHECK: bool = True
    ENABLE_POST_GEN_CHECK: bool = True
    
    # Performance
    MAX_EXECUTION_TIME: int = 60
    ENABLE_CACHING: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "data/logs/pipeline_logs/strand_ai.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()
```

**Implementation Notes**:
- Use Pydantic for type validation
- Load from .env file automatically
- Provide sensible defaults
- Document each setting

---

#### File: `config/models_config.yaml`

```yaml
# AI Model Configurations

video_models:
  ltx_video:
    name: "LTX-Video"
    api_endpoint: "${VIDEO_MODEL_ENDPOINT}"
    api_key: "${VIDEO_MODEL_API_KEY}"
    max_duration: 10  # seconds
    resolution: "1080p"
    aspect_ratio: "16:9"
    default_params:
      guidance_scale: 7.5
      num_inference_steps: 50
      seed: null  # Random if null
    
  mochi:
    name: "Mochi 1"
    api_endpoint: "${VIDEO_MODEL_ENDPOINT}"
    api_key: "${VIDEO_MODEL_API_KEY}"
    max_duration: 8
    resolution: "720p"
    aspect_ratio: "16:9"
    default_params:
      temperature: 0.7
      top_p: 0.9

analysis_models:
  clip:
    name: "CLIP ViT-L/14"
    model_name: "openai/clip-vit-large-patch14"
    device: "cuda"  # or "cpu"
    batch_size: 8
    
  videomae:
    name: "VideoMAE"
    model_name: "MCG-NJU/videomae-base"
    device: "cuda"
    batch_size: 4
```

---

#### File: `config/attribution_config.yaml`

```yaml
# Attribution Algorithm Configuration

attribution:
  # Algorithm selection
  algorithm: "weighted_average"  # Options: weighted_average, max_pooling, hierarchical
  
  # Feature weights
  weights:
    visual: 0.6
    audio: 0.3
    temporal: 0.1
  
  # Similarity thresholds (from Testing Matrix)
  thresholds:
    high_match: 0.90      # Derivative content
    medium_match: 0.70    # Modified content
    low_match: 0.30       # Style influence
    no_match: 0.30        # Unrelated
  
  # Reconciliation settings
  reconciliation:
    enable: true
    max_variance: 0.05     # ±5% tolerance
    flag_threshold: 0.10   # Flag if variance > 10%
    
  # Multi-IP handling
  multi_ip:
    enable: true
    equal_split: false     # If false, use weighted attribution
    min_contribution: 0.05 # Minimum 5% to be counted
    
  # Nested IP handling
  nested_ip:
    enable: true
    parent_weight: 0.6
    child_weight: 0.4
```

---

#### File: `config/safety_rules.yaml`

```yaml
# IP Safety Guardrail Rules

safety_rules:
  # Pre-Generation Rules
  pre_generation:
    - id: "no_unlicensed_ip"
      name: "No Unlicensed IP"
      description: "Block prompts referencing unlicensed IP"
      severity: "critical"
      action: "block"
      enabled: true
      
    - id: "license_compliance"
      name: "License Compliance Check"
      description: "Verify license terms allow usage"
      severity: "critical"
      action: "block"
      enabled: true
      
    - id: "restricted_brands"
      name: "Restricted Brand Check"
      description: "Block restricted brand mentions"
      severity: "high"
      action: "block"
      enabled: true
      restricted_list:
        - "competitor_brand_1"
        - "competitor_brand_2"
  
  # Post-Generation Rules
  post_generation:
    - id: "unauthorized_ip_detection"
      name: "Unauthorized IP Detection"
      description: "Detect unauthorized IP in generated content"
      severity: "critical"
      action: "flag"
      enabled: true
      
    - id: "contamination_check"
      name: "Model Contamination Check"
      description: "Check for model contamination"
      severity: "high"
      threshold: 0.05  # 5% threshold
      action: "flag"
      enabled: true
      
    - id: "prompt_alignment"
      name: "Prompt Alignment Check"
      description: "Verify generated content aligns with prompt"
      severity: "medium"
      action: "warn"
      enabled: true

# Contamination detection settings
contamination:
  threshold: 0.05
  check_frequency: "always"  # always, sample, never
  sample_rate: 1.0  # 100% of videos
```

---

### Module 2: Logging System

#### File: `src/core/logger.py`

```python
"""
Execution Logging System
Implements FR1.4 - Log every execution step
"""

import structlog
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
from config.settings import settings

class PipelineLogger:
    """Structured logger for pipeline execution"""
    
    def __init__(self, log_file: Optional[str] = None):
        """Initialize logger with structured logging"""
        self.log_file = log_file or settings.LOG_FILE
        self._setup_logging()
        self.logger = structlog.get_logger()
        
    def _setup_logging(self):
        """Setup structured logging configuration"""
        # Ensure log directory exists
        Path(self.log_file).parent.mkdir(parents=True, exist_ok=True)
        
        # Configure structlog
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            cache_logger_on_first_use=True,
        )
        
        # Setup file handler
        logging.basicConfig(
            format="%(message)s",
            level=getattr(logging, settings.LOG_LEVEL),
            handlers=[
                logging.FileHandler(self.log_file),
                logging.StreamHandler()
            ]
        )
    
    def log_step_start(self, step_name: str, **kwargs):
        """Log the start of a pipeline step"""
        self.logger.info(
            "step_started",
            step=step_name,
            status="started",
            **kwargs
        )
    
    def log_step_end(self, step_name: str, duration_ms: float, **kwargs):
        """Log the end of a pipeline step"""
        self.logger.info(
            "step_completed",
            step=step_name,
            status="completed",
            duration_ms=duration_ms,
            **kwargs
        )
    
    def log_step_error(self, step_name: str, error: Exception, **kwargs):
        """Log a step error"""
        self.logger.error(
            "step_failed",
            step=step_name,
            status="failed",
            error=str(error),
            error_type=type(error).__name__,
            **kwargs
        )
    
    def log_attribution(self, attribution_type: str, result: Dict[str, Any]):
        """Log attribution calculation results"""
        self.logger.info(
            "attribution_calculated",
            attribution_type=attribution_type,
            total_score=result.get("total_score"),
            confidence=result.get("confidence"),
            ip_attributions=result.get("ip_attributions"),
        )
    
    def log_safety_check(self, check_type: str, passed: bool, **kwargs):
        """Log safety check results"""
        self.logger.info(
            "safety_check_completed",
            check_type=check_type,
            passed=passed,
            **kwargs
        )
    
    def log_pipeline_summary(self, summary: Dict[str, Any]):
        """Log complete pipeline execution summary"""
        self.logger.info(
            "pipeline_completed",
            **summary
        )

# Global logger instance
pipeline_logger = PipelineLogger()
```

**Usage Example**:
```python
from src.core.logger import pipeline_logger

# Log step start
pipeline_logger.log_step_start("initial_attribution", prompt="demo prompt")

# Log step end
pipeline_logger.log_step_end("initial_attribution", duration_ms=1850, score=0.85)

# Log attribution
pipeline_logger.log_attribution("initial", {
    "total_score": 0.85,
    "confidence": 0.92,
    "ip_attributions": {"Nike": 0.85}
})
```

---

### Module 3: Data Models

#### File: `src/models/ip_content.py`

```python
"""
IP Content Data Model
Represents intellectual property content
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import numpy as np

class IPContent(BaseModel):
    """IP content model"""
    
    id: str = Field(..., description="Unique IP identifier")
    type: str = Field(..., description="IP type: logo, character, music, product")
    owner: str = Field(..., description="IP owner/rights holder")
    name: str = Field(..., description="IP name/title")
    
    # Embedding data
    embedding: Optional[List[float]] = Field(None, description="Vector embedding")
    embedding_model: Optional[str] = Field(None, description="Model used for embedding")
    
    # Metadata
    metadata: Dict = Field(default_factory=dict, description="Additional metadata")
    
    # License information
    license_terms: Dict = Field(default_factory=dict, description="License terms")
    license_type: Optional[str] = Field(None, description="License type")
    licensed: bool = Field(True, description="Whether IP is licensed")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            np.ndarray: lambda v: v.tolist()
        }
    
    def get_embedding_array(self) -> Optional[np.ndarray]:
        """Convert embedding list to numpy array"""
        if self.embedding:
            return np.array(self.embedding)
        return None
    
    def set_embedding_array(self, embedding: np.ndarray):
        """Set embedding from numpy array"""
        self.embedding = embedding.tolist()
```

---

#### File: `src/models/attribution_result.py`

```python
"""
Attribution Result Data Model
Represents attribution calculation results
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime

class AttributionResult(BaseModel):
    """Attribution calculation result"""
    
    # Scores
    total_score: float = Field(..., ge=0.0, le=1.0, description="Total attribution score")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence in attribution")
    
    # IP-specific attributions
    ip_attributions: Dict[str, float] = Field(
        ..., 
        description="Attribution scores per IP owner"
    )
    
    # Calculation details
    calculation_type: str = Field(..., description="initial or final")
    algorithm_used: str = Field(..., description="Algorithm used for calculation")
    
    # Metadata
    details: Dict = Field(default_factory=dict, description="Additional details")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    # Reconciliation (for final attribution)
    variance_from_initial: Optional[float] = Field(None, description="Variance from initial")
    reconciliation_notes: Optional[str] = Field(None, description="Reconciliation notes")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def get_variance_percentage(self) -> Optional[float]:
        """Get variance as percentage"""
        if self.variance_from_initial is not None:
            return self.variance_from_initial * 100
        return None
    
    def is_within_threshold(self, threshold: float = 0.05) -> bool:
        """Check if variance is within acceptable threshold"""
        if self.variance_from_initial is None:
            return True
        return abs(self.variance_from_initial) <= threshold
```

---

#### File: `src/models/safety_result.py`

```python
"""
Safety Check Result Data Model
Represents safety check results
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class SafetyResult(BaseModel):
    """Safety check result"""
    
    # Check result
    passed: bool = Field(..., description="Whether safety check passed")
    check_type: str = Field(..., description="pre_generation or post_generation")
    
    # Violations
    violations: List[str] = Field(default_factory=list, description="List of violations")
    violation_details: List[Dict] = Field(
        default_factory=list, 
        description="Detailed violation information"
    )
    
    # Contamination (for post-generation)
    contamination_score: float = Field(0.0, ge=0.0, le=1.0, description="Contamination score")
    contamination_threshold: float = Field(0.05, description="Threshold used")
    
    # Metadata
    timestamp: datetime = Field(default_factory=datetime.now)
    details: Dict = Field(default_factory=dict, description="Additional details")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def get_violation_summary(self) -> str:
        """Get human-readable violation summary"""
        if not self.violations:
            return "No violations detected"
        return f"{len(self.violations)} violation(s): {', '.join(self.violations)}"
    
    def is_contaminated(self) -> bool:
        """Check if content is contaminated above threshold"""
        return self.contamination_score > self.contamination_threshold
```

---

#### File: `src/models/pipeline_state.py`

```python
"""
Pipeline State Data Model
Tracks pipeline execution state
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum

class StepStatus(str, Enum):
    """Step execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"

class PipelineState(BaseModel):
    """Pipeline execution state"""
    
    # Execution tracking
    execution_id: str = Field(..., description="Unique execution ID")
    current_step: str = Field(..., description="Current step name")
    current_step_status: StepStatus = Field(StepStatus.PENDING, description="Current step status")
    
    # Step history
    completed_steps: List[str] = Field(default_factory=list, description="Completed steps")
    failed_steps: List[str] = Field(default_factory=list, description="Failed steps")
    
    # Execution context
    context: Dict[str, Any] = Field(default_factory=dict, description="Execution context")
    
    # Results storage
    results: Dict[str, Any] = Field(default_factory=dict, description="Step results")
    
    # Error tracking
    errors: List[Dict] = Field(default_factory=list, description="Error history")
    
    # Timestamps
    started_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")
    
    # Performance metrics
    total_duration_ms: Optional[float] = Field(None, description="Total execution time")
    step_durations: Dict[str, float] = Field(
        default_factory=dict, 
        description="Duration per step in ms"
    )
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def add_completed_step(self, step_name: str, duration_ms: float):
        """Mark step as completed"""
        self.completed_steps.append(step_name)
        self.step_durations[step_name] = duration_ms
        self.updated_at = datetime.now()
    
    def add_failed_step(self, step_name: str, error: Exception):
        """Mark step as failed"""
        self.failed_steps.append(step_name)
        self.errors.append({
            "step": step_name,
            "error": str(error),
            "error_type": type(error).__name__,
            "timestamp": datetime.now().isoformat()
        })
        self.updated_at = datetime.now()
    
    def is_completed(self) -> bool:
        """Check if pipeline is completed"""
        return self.completed_at is not None
    
    def has_errors(self) -> bool:
        """Check if pipeline has errors"""
        return len(self.errors) > 0
```

---

### Module 4: Core Pipeline (with Stubs)

#### File: `src/core/pipeline.py`

```python
"""
Main Pipeline Orchestration
Implements FR1.1 - Code Execution Framework
"""

import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime

from src.core.logger import pipeline_logger
from src.models.pipeline_state import PipelineState, StepStatus
from src.models.attribution_result import AttributionResult
from src.models.safety_result import SafetyResult
from config.settings import settings

class StrandPipeline:
    """Main pipeline orchestrator for Strand AI PoC"""
    
    def __init__(self):
        """Initialize pipeline"""
        self.logger = pipeline_logger
        self.state: Optional[PipelineState] = None
        
    def execute(self, prompt: str) -> Dict[str, Any]:
        """
        Execute complete pipeline
        
        Args:
            prompt: Input text prompt
            
        Returns:
            Complete pipeline results
        """
        # Initialize execution state
        execution_id = str(uuid.uuid4())
        self.state = PipelineState(
            execution_id=execution_id,
            current_step="initialization"
        )
        
        self.logger.log_step_start("pipeline_execution", execution_id=execution_id)
        start_time = time.time()
        
        try:
            # Execute pipeline steps
            results = {}
            
            # Step 1: Prompt Input
            results['prompt'] = self._step_1_prompt_input(prompt)
            
            # Step 2: Vector Retrieval
            results['retrieved_context'] = self._step_2_vector_retrieval(prompt)
            
            # Step 3: Initial Attribution
            results['initial_attribution'] = self._step_3_initial_attribution(
                results['retrieved_context']
            )
            
            # Step 4: Pre-Generation Safety Check
            results['pre_gen_safety'] = self._step_4_pre_generation_safety(
                prompt, 
                results['retrieved_context']
            )
            
            # Check if safety passed
            if not results['pre_gen_safety'].passed:
                self.logger.log_step_error(
                    "pre_generation_safety",
                    Exception("Safety check failed"),
                    violations=results['pre_gen_safety'].violations
                )
                return self._create_failure_result("Pre-generation safety check failed", results)
            
            # Step 5: Prompt Augmentation
            results['augmented_prompt'] = self._step_5_prompt_augmentation(
                prompt,
                results['retrieved_context']
            )
            
            # Step 6: Video Generation
            results['generated_video'] = self._step_6_video_generation(
                results['augmented_prompt']
            )
            
            # Step 7: Post-Generation Safety Check
            results['post_gen_safety'] = self._step_7_post_generation_safety(
                results['generated_video']
            )
            
            # Check if safety passed
            if not results['post_gen_safety'].passed:
                self.logger.log_step_error(
                    "post_generation_safety",
                    Exception("Safety check failed"),
                    violations=results['post_gen_safety'].violations
                )
                return self._create_failure_result("Post-generation safety check failed", results)
            
            # Step 8: Final Attribution
            results['final_attribution'] = self._step_8_final_attribution(
                results['generated_video'],
                results['retrieved_context']
            )
            
            # Step 9: Video Analysis
            results['video_analysis'] = self._step_9_video_analysis(
                results['generated_video']
            )
            
            # Step 10: Logging and Display
            final_result = self._step_10_logging_and_display(results)
            
            # Calculate total duration
            total_duration = (time.time() - start_time) * 1000
            self.state.total_duration_ms = total_duration
            self.state.completed_at = datetime.now()
            
            self.logger.log_step_end(
                "pipeline_execution",
                duration_ms=total_duration,
                execution_id=execution_id,
                status="success"
            )
            
            return final_result
            
        except Exception as e:
            self.logger.log_step_error("pipeline_execution", e, execution_id=execution_id)
            return self._create_failure_result(str(e), {})
    
    def _step_1_prompt_input(self, prompt: str) -> Dict[str, Any]:
        """Step 1: Process prompt input"""
        step_name = "prompt_input"
        self.logger.log_step_start(step_name, prompt=prompt)
        start_time = time.time()
        
        # Process prompt
        result = {
            "original_prompt": prompt,
            "processed_prompt": prompt.strip(),
            "timestamp": datetime.now().isoformat()
        }
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_2_vector_retrieval(self, prompt: str) -> Dict[str, Any]:
        """Step 2: Vector retrieval (STUB for Milestone 1)"""
        step_name = "vector_retrieval"
        self.logger.log_step_start(step_name, prompt=prompt)
        start_time = time.time()
        
        # STUB: Return pre-loaded context
        result = {
            "retrieved_ips": [
                {
                    "id": "ip_001",
                    "type": "logo",
                    "owner": "Nike",
                    "name": "Nike Swoosh",
                    "relevance_score": 0.95
                }
            ],
            "retrieval_method": "stub",
            "timestamp": datetime.now().isoformat()
        }
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration, retrieved_count=1)
        
        return result
    
    def _step_3_initial_attribution(self, retrieved_context: Dict) -> AttributionResult:
        """Step 3: Initial attribution calculation (STUB for Milestone 1)"""
        step_name = "initial_attribution"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Return mock attribution
        result = AttributionResult(
            total_score=0.85,
            confidence=0.92,
            ip_attributions={"Nike": 0.85},
            calculation_type="initial",
            algorithm_used="stub_weighted_average"
        )
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_attribution("initial", result.dict())
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_4_pre_generation_safety(self, prompt: str, context: Dict) -> SafetyResult:
        """Step 4: Pre-generation safety check (STUB for Milestone 1)"""
        step_name = "pre_generation_safety"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Always pass for demo
        result = SafetyResult(
            passed=True,
            check_type="pre_generation",
            violations=[],
            contamination_score=0.0
        )
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_safety_check("pre_generation", True)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_5_prompt_augmentation(self, prompt: str, context: Dict) -> str:
        """Step 5: Prompt augmentation (STUB for Milestone 1)"""
        step_name = "prompt_augmentation"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Simple augmentation
        ip_context = context.get('retrieved_ips', [])
        if ip_context:
            ip_names = [ip['name'] for ip in ip_context]
            augmented = f"{prompt} featuring {', '.join(ip_names)}"
        else:
            augmented = prompt
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration, augmented_prompt=augmented)
        
        return augmented
    
    def _step_6_video_generation(self, augmented_prompt: str) -> Dict[str, Any]:
        """Step 6: Video generation (STUB for Milestone 1)"""
        step_name = "video_generation"
        self.logger.log_step_start(step_name, prompt=augmented_prompt)
        start_time = time.time()
        
        # STUB: Return mock video path
        result = {
            "video_path": "data/preloaded/videos/demo_video.mp4",
            "duration": 5.0,
            "resolution": "1080p",
            "model_used": "stub",
            "timestamp": datetime.now().isoformat()
        }
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_7_post_generation_safety(self, video: Dict) -> SafetyResult:
        """Step 7: Post-generation safety check (STUB for Milestone 1)"""
        step_name = "post_generation_safety"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Always pass for demo
        result = SafetyResult(
            passed=True,
            check_type="post_generation",
            violations=[],
            contamination_score=0.02
        )
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_safety_check("post_generation", True, contamination=0.02)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_8_final_attribution(self, video: Dict, original_context: Dict) -> AttributionResult:
        """Step 8: Final attribution calculation (STUB for Milestone 1)"""
        step_name = "final_attribution"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Return mock attribution with small variance
        result = AttributionResult(
            total_score=0.84,
            confidence=0.90,
            ip_attributions={"Nike": 0.84},
            calculation_type="final",
            algorithm_used="stub_weighted_average",
            variance_from_initial=-0.01  # 1% lower than initial
        )
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_attribution("final", result.dict())
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_9_video_analysis(self, video: Dict) -> Dict[str, Any]:
        """Step 9: Basic video analysis (STUB for Milestone 1)"""
        step_name = "video_analysis"
        self.logger.log_step_start(step_name)
        start_time = time.time()
        
        # STUB: Return mock analysis
        result = {
            "analysis": "Video contains Nike logo, athletic shoe product, duration 5 seconds",
            "detected_objects": ["logo", "shoe", "person"],
            "detected_brands": ["Nike"],
            "timestamp": datetime.now().isoformat()
        }
        
        duration = (time.time() - start_time) * 1000
        self.state.add_completed_step(step_name, duration)
        self.logger.log_step_end(step_name, duration_ms=duration)
        
        return result
    
    def _step_10_logging_and_display(self, results: Dict) -> Dict[str, Any]:
        """Step 10: Final logging and result display"""
        step_name = "logging_and_display"
        self.logger.log_step_start(step_name)
        
        # Create summary
        summary = {
            "execution_id": self.state.execution_id,
            "status": "success",
            "total_duration_ms": self.state.total_duration_ms,
            "completed_steps": self.state.completed_steps,
            "results": {
                "initial_attribution": results['initial_attribution'].dict(),
                "final_attribution": results['final_attribution'].dict(),
                "pre_gen_safety": results['pre_gen_safety'].dict(),
                "post_gen_safety": results['post_gen_safety'].dict(),
                "video_analysis": results['video_analysis'],
                "generated_video": results['generated_video']
            }
        }
        
        self.logger.log_pipeline_summary(summary)
        self.logger.log_step_end(step_name, duration_ms=0)
        
        return summary
    
    def _create_failure_result(self, error_message: str, partial_results: Dict) -> Dict[str, Any]:
        """Create failure result"""
        return {
            "execution_id": self.state.execution_id if self.state else "unknown",
            "status": "failed",
            "error": error_message,
            "partial_results": partial_results,
            "completed_steps": self.state.completed_steps if self.state else [],
            "failed_steps": self.state.failed_steps if self.state else []
        }
```

**Key Implementation Notes**:
- All steps are implemented as stubs for Milestone 1
- Each step logs start, end, and duration
- Safety checks can block execution
- State is tracked throughout execution
- Errors are handled gracefully

---

### Module 5: Demo Script

#### File: `scripts/run_demo.py`

```python
"""
Run PoC Demonstration
Execute the complete Strand AI pipeline
"""

import sys
import argparse
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.pipeline import StrandPipeline
from src.core.logger import pipeline_logger
import json

def load_hardcoded_prompt() -> str:
    """Load the hard-coded demo prompt"""
    prompt_file = Path("data/preloaded/prompts/hardcoded_prompt.txt")
    if prompt_file.exists():
        return prompt_file.read_text().strip()
    else:
        # Default prompt if file doesn't exist
        return "A professional athlete wearing Nike shoes running on a track"

def print_results(results: dict, verbose: bool = False):
    """Print pipeline results in a readable format"""
    print("\n" + "="*80)
    print("STRAND AI POC - EXECUTION RESULTS")
    print("="*80 + "\n")
    
    print(f"Execution ID: {results['execution_id']}")
    print(f"Status: {results['status'].upper()}")
    print(f"Total Duration: {results.get('total_duration_ms', 0):.2f}ms\n")
    
    if results['status'] == 'failed':
        print(f"❌ Error: {results['error']}\n")
        return
    
    # Print results
    res = results['results']
    
    print("📊 INITIAL ATTRIBUTION")
    print("-" * 40)
    initial = res['initial_attribution']
    print(f"Total Score: {initial['total_score']:.2f}")
    print(f"Confidence: {initial['confidence']:.2f}")
    print(f"IP Attributions: {json.dumps(initial['ip_attributions'], indent=2)}\n")
    
    print("🛡️  PRE-GENERATION SAFETY CHECK")
    print("-" * 40)
    pre_safety = res['pre_gen_safety']
    print(f"Status: {'✅ PASSED' if pre_safety['passed'] else '❌ FAILED'}")
    if pre_safety['violations']:
        print(f"Violations: {', '.join(pre_safety['violations'])}\n")
    else:
        print("No violations detected\n")
    
    print("🎬 VIDEO GENERATION")
    print("-" * 40)
    video = res['generated_video']
    print(f"Video Path: {video['video_path']}")
    print(f"Duration: {video['duration']}s")
    print(f"Resolution: {video['resolution']}\n")
    
    print("🛡️  POST-GENERATION SAFETY CHECK")
    print("-" * 40)
    post_safety = res['post_gen_safety']
    print(f"Status: {'✅ PASSED' if post_safety['passed'] else '❌ FAILED'}")
    print(f"Contamination Score: {post_safety['contamination_score']:.2%}\n")
    
    print("📊 FINAL ATTRIBUTION")
    print("-" * 40)
    final = res['final_attribution']
    print(f"Total Score: {final['total_score']:.2f}")
    print(f"Confidence: {final['confidence']:.2f}")
    print(f"IP Attributions: {json.dumps(final['ip_attributions'], indent=2)}")
    if final['variance_from_initial'] is not None:
        variance_pct = final['variance_from_initial'] * 100
        print(f"Variance from Initial: {variance_pct:+.2f}%\n")
    
    print("🔍 VIDEO ANALYSIS")
    print("-" * 40)
    analysis = res['video_analysis']
    print(f"Analysis: {analysis['analysis']}")
    print(f"Detected Objects: {', '.join(analysis['detected_objects'])}")
    print(f"Detected Brands: {', '.join(analysis['detected_brands'])}\n")
    
    print("✅ COMPLETED STEPS")
    print("-" * 40)
    for i, step in enumerate(results['completed_steps'], 1):
        print(f"{i}. {step}")
    
    print("\n" + "="*80 + "\n")
    
    if verbose:
        print("\n📋 FULL RESULTS (JSON)")
        print("-" * 40)
        print(json.dumps(results, indent=2, default=str))

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Run Strand AI PoC Demo")
    parser.add_argument(
        "--prompt",
        type=str,
        default="hardcoded",
        help="Prompt to use (default: hardcoded from file)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print verbose output including full JSON results"
    )
    
    args = parser.parse_args()
    
    # Load prompt
    if args.prompt == "hardcoded":
        prompt = load_hardcoded_prompt()
        print(f"\n📝 Using hard-coded prompt: {prompt}\n")
    else:
        prompt = args.prompt
        print(f"\n📝 Using custom prompt: {prompt}\n")
    
    # Initialize and execute pipeline
    print("🚀 Initializing Strand AI Pipeline...\n")
    pipeline = StrandPipeline()
    
    print("⚙️  Executing pipeline...\n")
    results = pipeline.execute(prompt)
    
    # Print results
    print_results(results, verbose=args.verbose)
    
    # Exit with appropriate code
    if results['status'] == 'success':
        print("✅ Demo completed successfully!")
        sys.exit(0)
    else:
        print("❌ Demo failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

**Usage**:
```bash
# Run with hard-coded prompt
python scripts/run_demo.py

# Run with custom prompt
python scripts/run_demo.py --prompt "A basketball player with Nike shoes"

# Run with verbose output
python scripts/run_demo.py --verbose
```

---

### Module 6: Asset Loading Script

#### File: `scripts/load_preloaded_assets.py`

```python
"""
Load Pre-loaded Assets
Implements FR1.2 - Pre-loaded video and embeddings
"""

import sys
from pathlib import Path
import json
import numpy as np

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import settings

def create_hardcoded_prompt():
    """Create hard-coded demo prompt"""
    prompt_file = Path("data/preloaded/prompts/hardcoded_prompt.txt")
    prompt_file.parent.mkdir(parents=True, exist_ok=True)
    
    prompt = "A professional athlete wearing Nike shoes running on a track"
    prompt_file.write_text(prompt)
    
    print(f"✅ Created hard-coded prompt: {prompt}")

def create_demo_embeddings():
    """Create demo Q&A embeddings"""
    embeddings_file = Path("data/preloaded/embeddings/qa_embeddings.json")
    embeddings_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Create mock embeddings
    embeddings = {
        "question": "What brand is featured in the video?",
        "answer": "Nike",
        "question_embedding": np.random.rand(768).tolist(),  # Mock 768-dim embedding
        "answer_embedding": np.random.rand(768).tolist(),
        "metadata": {
            "ip_id": "ip_001",
            "ip_type": "logo",
            "ip_owner": "Nike",
            "ip_name": "Nike Swoosh"
        }
    }
    
    with open(embeddings_file, 'w') as f:
        json.dump(embeddings, f, indent=2)
    
    print(f"✅ Created demo embeddings: {embeddings_file}")

def verify_demo_video():
    """Verify demo video exists"""
    video_file = Path("data/preloaded/videos/demo_video.mp4")
    
    if video_file.exists():
        print(f"✅ Demo video exists: {video_file}")
    else:
        print(f"⚠️  Demo video not found: {video_file}")
        print("   Please place a demo video at this location")

def main():
    """Load all pre-loaded assets"""
    print("\n🔧 Loading Pre-loaded Assets for Strand AI PoC\n")
    print("="*60 + "\n")
    
    # Create assets
    create_hardcoded_prompt()
    create_demo_embeddings()
    verify_demo_video()
    
    print("\n" + "="*60)
    print("✅ Asset loading complete!\n")

if __name__ == "__main__":
    main()
```

**Usage**:
```bash
python scripts/load_preloaded_assets.py
```

---

## 🧪 Testing Guidelines

### Test Structure

#### File: `tests/conftest.py`

```python
"""
Pytest Configuration
Shared fixtures and configuration
"""

import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.pipeline import StrandPipeline
from src.models.ip_content import IPContent
from src.models.attribution_result import AttributionResult
from src.models.safety_result import SafetyResult

@pytest.fixture
def sample_prompt():
    """Sample prompt for testing"""
    return "A professional athlete wearing Nike shoes"

@pytest.fixture
def sample_ip_content():
    """Sample IP content for testing"""
    return IPContent(
        id="ip_001",
        type="logo",
        owner="Nike",
        name="Nike Swoosh",
        embedding=[0.1] * 768,
        licensed=True
    )

@pytest.fixture
def sample_attribution_result():
    """Sample attribution result for testing"""
    return AttributionResult(
        total_score=0.85,
        confidence=0.92,
        ip_attributions={"Nike": 0.85},
        calculation_type="initial",
        algorithm_used="weighted_average"
    )

@pytest.fixture
def sample_safety_result():
    """Sample safety result for testing"""
    return SafetyResult(
        passed=True,
        check_type="pre_generation",
        violations=[],
        contamination_score=0.0
    )

@pytest.fixture
def pipeline():
    """Pipeline instance for testing"""
    return StrandPipeline()
```

---

#### File: `tests/unit/test_pipeline.py`

```python
"""
Unit Tests for Pipeline
"""

import pytest
from src.core.pipeline import StrandPipeline

def test_pipeline_initialization():
    """Test pipeline initialization"""
    pipeline = StrandPipeline()
    assert pipeline is not None
    assert pipeline.logger is not None

def test_pipeline_execution(sample_prompt):
    """Test complete pipeline execution"""
    pipeline = StrandPipeline()
    results = pipeline.execute(sample_prompt)
    
    assert results['status'] == 'success'
    assert 'execution_id' in results
    assert 'results' in results
    assert len(results['completed_steps']) > 0

def test_prompt_input_step(sample_prompt):
    """Test prompt input step"""
    pipeline = StrandPipeline()
    result = pipeline._step_1_prompt_input(sample_prompt)
    
    assert result['original_prompt'] == sample_prompt
    assert 'processed_prompt' in result
    assert 'timestamp' in result

def test_initial_attribution_stub():
    """Test initial attribution stub"""
    pipeline = StrandPipeline()
    context = {"retrieved_ips": []}
    result = pipeline._step_3_initial_attribution(context)
    
    assert result.total_score > 0
    assert result.confidence > 0
    assert result.calculation_type == "initial"

def test_safety_check_stub():
    """Test safety check stub"""
    pipeline = StrandPipeline()
    result = pipeline._step_4_pre_generation_safety("test prompt", {})
    
    assert result.passed == True
    assert result.check_type == "pre_generation"
    assert len(result.violations) == 0
```

---

## 🔄 Common Patterns

### Pattern 1: Error Handling

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_external_api(endpoint: str, data: dict):
    """Call external API with retry logic"""
    try:
        response = requests.post(endpoint, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"API call failed: {e}")
        raise
```

### Pattern 2: Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_embedding(text: str) -> np.ndarray:
    """Get embedding with caching"""
    # Expensive embedding generation
    return generate_embedding(text)
```

### Pattern 3: Context Management

```python
from contextlib import contextmanager

@contextmanager
def pipeline_step(step_name: str, logger):
    """Context manager for pipeline steps"""
    logger.log_step_start(step_name)
    start_time = time.time()
    try:
        yield
    finally:
        duration = (time.time() - start_time) * 1000
        logger.log_step_end(step_name, duration_ms=duration)
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Import Errors
**Problem**: `ModuleNotFoundError: No module named 'src'`  
**Solution**: Ensure you're running from project root and src is in PYTHONPATH

```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python scripts/run_demo.py
```

#### Issue 2: Environment Variables Not Loading
**Problem**: Settings not loading from .env  
**Solution**: Verify .env file exists and python-dotenv is installed

```bash
pip install python-dotenv
cat .env  # Verify file exists
```

#### Issue 3: Vector DB Connection Failed
**Problem**: Cannot connect to MemoryDB  
**Solution**: Check connection string and network access

```python
# Test connection
import redis
r = redis.Redis(
    host=settings.MEMORYDB_HOST,
    port=settings.MEMORYDB_PORT,
    password=settings.MEMORYDB_PASSWORD,
    ssl=True
)
r.ping()  # Should return True
```

---

## 📚 Next Steps

### After Milestone 1

1. **Implement Vector Retrieval**
   - Replace stub in `_step_2_vector_retrieval`
   - Implement `src/retrieval/vector_db.py`
   - Test with real embeddings

2. **Implement Attribution Logic**
   - Replace stubs in `_step_3_initial_attribution` and `_step_8_final_attribution`
   - Implement `src/attribution/algorithms.py`
   - Test with various IP scenarios

3. **Integrate Video Model**
   - Replace stub in `_step_6_video_generation`
   - Implement model adapter
   - Test video generation

4. **Implement Safety Controls**
   - Replace stubs in safety checks
   - Implement `src/safety/guardrails.py`
   - Test with violation scenarios

5. **Execute Testing Matrix**
   - Implement all 38 tests
   - Document results
   - Optimize performance

---

## 📞 Support

For implementation questions:
- Review PRD Section 6 (Functional Requirements)
- Review Testing Matrix for test scenarios
- Check logs in `data/logs/pipeline_logs/`
- Contact Neural Arc team

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Created By**: Helium AI (Neural Arc Inc.)