# Strand AI PoC - Setup Instructions

## 🚀 Quick Start Guide

This guide will help you set up the Strand AI PoC development environment from scratch.

---

## 📋 Prerequisites

### Required Software
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Docker** (optional, for local Redis testing) - [Download](https://www.docker.com/products/docker-desktop)

### Required Accounts & Access
- **AWS Account** - For Amazon MemoryDB for Redis
- **AI Model API Keys** - For selected video generation model (LTX-Video or Mochi 1)
- **GitHub Account** (optional) - For version control

---

## 🔧 Step-by-Step Setup

### Step 1: Create Project Directory

```bash
# Create and navigate to project directory
mkdir strand-ai-poc
cd strand-ai-poc

# Initialize git repository
git init
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Verify activation (should show venv path)
which python  # macOS/Linux
where python  # Windows
```

### Step 3: Create Project Structure

```bash
# Create all directories
mkdir -p config
mkdir -p src/{core,retrieval,attribution,safety,generation,analysis,models,utils,api}
mkdir -p src/generation/model_adapters
mkdir -p data/{preloaded/{videos,embeddings,prompts},generated/videos,logs/pipeline_logs}
mkdir -p tests/{unit,integration,test_matrix}
mkdir -p scripts
mkdir -p docs/{architecture,api,testing,decisions}
mkdir -p notebooks

# Create __init__.py files for Python packages
touch src/__init__.py
touch src/core/__init__.py
touch src/retrieval/__init__.py
touch src/attribution/__init__.py
touch src/safety/__init__.py
touch src/generation/__init__.py
touch src/generation/model_adapters/__init__.py
touch src/analysis/__init__.py
touch src/models/__init__.py
touch src/utils/__init__.py
touch src/api/__init__.py
touch tests/__init__.py
touch tests/unit/__init__.py
touch tests/integration/__init__.py
touch tests/test_matrix/__init__.py
touch config/__init__.py
```

### Step 4: Create Requirements File

```bash
cat > requirements.txt << 'EOF'
# Core Framework
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
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
```

### Step 5: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### Step 6: Create .gitignore

```bash
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
.pytest_cache/
.coverage
htmlcov/
.tox/

# Logs
*.log
data/logs/

# Generated content
data/generated/
*.mp4
*.avi
*.mov

# OS
.DS_Store
Thumbs.db

# Jupyter
.ipynb_checkpoints/
*.ipynb

# Documentation
docs/_build/
EOF
```

### Step 7: Create Environment Variables File

```bash
cat > .env << 'EOF'
# Environment Configuration
ENV=development
DEBUG=true

# Vector Database (Amazon MemoryDB for Redis)
MEMORYDB_HOST=your-memorydb-endpoint.amazonaws.com
MEMORYDB_PORT=6379
MEMORYDB_PASSWORD=your-secure-password
MEMORYDB_SSL=true
MEMORYDB_DB=0

# AI Video Model Configuration
VIDEO_MODEL=ltx-video
VIDEO_MODEL_API_KEY=your-video-model-api-key
VIDEO_MODEL_ENDPOINT=https://api.example.com/v1/generate

# AI Analysis Model Configuration
ANALYSIS_MODEL=clip
ANALYSIS_MODEL_API_KEY=your-analysis-model-api-key

# Attribution Settings
ATTRIBUTION_VARIANCE_THRESHOLD=0.05
MIN_CONFIDENCE_SCORE=0.90
MIN_SIMILARITY_THRESHOLD=0.70

# Safety Settings
CONTAMINATION_THRESHOLD=0.05
ENABLE_PRE_GEN_CHECK=true
ENABLE_POST_GEN_CHECK=true

# Performance Settings
MAX_EXECUTION_TIME=60
ENABLE_CACHING=true

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=data/logs/pipeline_logs/strand_ai.log
EOF
```

**⚠️ IMPORTANT**: Update the placeholder values in `.env` with your actual credentials!

### Step 8: Create .env.example (Template)

```bash
cat > .env.example << 'EOF'
# Environment Configuration
ENV=development
DEBUG=true

# Vector Database (Amazon MemoryDB for Redis)
MEMORYDB_HOST=your-memorydb-endpoint.amazonaws.com
MEMORYDB_PORT=6379
MEMORYDB_PASSWORD=your-secure-password
MEMORYDB_SSL=true
MEMORYDB_DB=0

# AI Video Model Configuration
VIDEO_MODEL=ltx-video  # or mochi
VIDEO_MODEL_API_KEY=your-video-model-api-key
VIDEO_MODEL_ENDPOINT=https://api.example.com/v1/generate

# AI Analysis Model Configuration
ANALYSIS_MODEL=clip  # or videomae
ANALYSIS_MODEL_API_KEY=your-analysis-model-api-key

# Attribution Settings
ATTRIBUTION_VARIANCE_THRESHOLD=0.05
MIN_CONFIDENCE_SCORE=0.90
MIN_SIMILARITY_THRESHOLD=0.70

# Safety Settings
CONTAMINATION_THRESHOLD=0.05
ENABLE_PRE_GEN_CHECK=true
ENABLE_POST_GEN_CHECK=true

# Performance Settings
MAX_EXECUTION_TIME=60
ENABLE_CACHING=true

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=data/logs/pipeline_logs/strand_ai.log
EOF
```

### Step 9: Create README.md

```bash
cat > README.md << 'EOF'
# Strand AI PoC - IP Attribution System

## Overview
Proof-of-Concept demonstration of Strand AI's core capabilities for tracking licensed IP usage in AI-generated video content.

## Features
- ✅ IP Attribution Calculation (Initial & Final)
- ✅ Vector-based IP Retrieval
- ✅ Pre & Post-Generation Safety Controls
- ✅ AI Video Generation Integration
- ✅ Comprehensive Execution Logging

## Quick Start

### Prerequisites
- Python 3.11+
- AWS Account (for MemoryDB)
- AI Model API Keys

### Installation
```bash
# Clone repository
git clone <repository-url>
cd strand-ai-poc

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Load pre-loaded assets
python scripts/load_preloaded_assets.py

# Run demo
python scripts/run_demo.py
```

## Documentation
- [Project Structure](STRAND_AI_PROJECT_STRUCTURE.md)
- [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- [Setup Instructions](SETUP_INSTRUCTIONS.md)
- [Testing Framework](TESTING_FRAMEWORK.md)

## Project Structure
```
strand-ai-poc/
├── config/          # Configuration files
├── src/             # Source code
├── data/            # Data directory
├── tests/           # Test suite
├── scripts/         # Utility scripts
├── docs/            # Documentation
└── notebooks/       # Jupyter notebooks
```

## Testing
```bash
# Run all tests
pytest

# Run specific test suite
pytest tests/unit/
pytest tests/integration/
pytest tests/test_matrix/

# Run with coverage
pytest --cov=src tests/
```

## License
Proprietary - Neural Arc Inc.

## Contact
For questions or support, contact the Neural Arc team.
EOF
```

---

## 🔐 AWS MemoryDB Setup

### Step 1: Create MemoryDB Cluster

```bash
# Using AWS CLI
aws memorydb create-cluster \
    --cluster-name strand-ai-poc \
    --node-type db.r6g.large \
    --engine-version 7.0 \
    --num-shards 1 \
    --num-replicas-per-shard 1 \
    --subnet-group-name your-subnet-group \
    --security-group-ids sg-xxxxxxxxx \
    --tls-enabled
```

### Step 2: Get Connection Details

```bash
# Get cluster endpoint
aws memorydb describe-clusters \
    --cluster-name strand-ai-poc \
    --query 'Clusters[0].ClusterEndpoint.Address' \
    --output text
```

### Step 3: Update .env File

```bash
# Update MEMORYDB_HOST with the endpoint from above
MEMORYDB_HOST=strand-ai-poc.xxxxxx.memorydb.us-east-1.amazonaws.com
```

### Step 4: Test Connection

```python
# test_connection.py
import redis
from config.settings import settings

try:
    r = redis.Redis(
        host=settings.MEMORYDB_HOST,
        port=settings.MEMORYDB_PORT,
        password=settings.MEMORYDB_PASSWORD,
        ssl=True,
        decode_responses=True
    )
    
    # Test connection
    r.ping()
    print("✅ Successfully connected to MemoryDB!")
    
    # Test set/get
    r.set('test_key', 'test_value')
    value = r.get('test_key')
    print(f"✅ Test value: {value}")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

---

## 🎬 AI Model Setup

### Option 1: LTX-Video

```bash
# Get API key from LTX-Video provider
# Update .env
VIDEO_MODEL=ltx-video
VIDEO_MODEL_API_KEY=your-ltx-video-api-key
VIDEO_MODEL_ENDPOINT=https://api.ltx-video.com/v1/generate
```

### Option 2: Mochi 1

```bash
# Get API key from Mochi provider
# Update .env
VIDEO_MODEL=mochi
VIDEO_MODEL_API_KEY=your-mochi-api-key
VIDEO_MODEL_ENDPOINT=https://api.mochi.com/v1/generate
```

### Test Video Model Connection

```python
# test_video_model.py
import requests
from config.settings import settings

headers = {
    "Authorization": f"Bearer {settings.VIDEO_MODEL_API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "prompt": "A test video",
    "duration": 5
}

try:
    response = requests.post(
        settings.VIDEO_MODEL_ENDPOINT,
        headers=headers,
        json=data
    )
    response.raise_for_status()
    print("✅ Video model API connection successful!")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Video model API connection failed: {e}")
```

---

## 📦 Load Pre-loaded Assets

### Step 1: Create Hard-coded Prompt

```bash
mkdir -p data/preloaded/prompts
cat > data/preloaded/prompts/hardcoded_prompt.txt << 'EOF'
A professional athlete wearing Nike shoes running on a track
EOF
```

### Step 2: Create Demo Embeddings

```bash
# Run the asset loading script
python scripts/load_preloaded_assets.py
```

### Step 3: Add Demo Video

```bash
# Place your demo video in the preloaded videos directory
# The video should be named: demo_video.mp4
cp /path/to/your/demo_video.mp4 data/preloaded/videos/demo_video.mp4
```

**Note**: If you don't have a demo video, the stub implementation will use a placeholder path.

---

## ✅ Verify Installation

### Run Verification Script

```bash
cat > scripts/verify_setup.py << 'EOF'
"""
Verify Setup
Check that all components are properly configured
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def check_python_version():
    """Check Python version"""
    import sys
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print("✅ Python version: {}.{}.{}".format(version.major, version.minor, version.micro))
        return True
    else:
        print("❌ Python version: {}.{}.{} (requires 3.11+)".format(version.major, version.minor, version.micro))
        return False

def check_dependencies():
    """Check required dependencies"""
    required = [
        'fastapi', 'pydantic', 'redis', 'numpy', 
        'pytest', 'structlog', 'pyyaml'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package)
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} missing")
            missing.append(package)
    
    return len(missing) == 0

def check_environment():
    """Check environment variables"""
    from config.settings import settings
    
    checks = [
        ('MEMORYDB_HOST', settings.MEMORYDB_HOST),
        ('VIDEO_MODEL', settings.VIDEO_MODEL),
        ('VIDEO_MODEL_API_KEY', settings.VIDEO_MODEL_API_KEY),
    ]
    
    all_ok = True
    for name, value in checks:
        if value and 'your-' not in str(value):
            print(f"✅ {name} configured")
        else:
            print(f"❌ {name} not configured (update .env)")
            all_ok = False
    
    return all_ok

def check_directories():
    """Check required directories exist"""
    required_dirs = [
        'config', 'src', 'data', 'tests', 'scripts', 'docs'
    ]
    
    all_ok = True
    for dir_name in required_dirs:
        if Path(dir_name).exists():
            print(f"✅ {dir_name}/ exists")
        else:
            print(f"❌ {dir_name}/ missing")
            all_ok = False
    
    return all_ok

def check_preloaded_assets():
    """Check pre-loaded assets"""
    assets = [
        'data/preloaded/prompts/hardcoded_prompt.txt',
        'data/preloaded/embeddings/qa_embeddings.json',
    ]
    
    all_ok = True
    for asset in assets:
        if Path(asset).exists():
            print(f"✅ {asset} exists")
        else:
            print(f"⚠️  {asset} missing (run load_preloaded_assets.py)")
            all_ok = False
    
    return all_ok

def main():
    """Run all verification checks"""
    print("\n🔍 Verifying Strand AI PoC Setup\n")
    print("="*60 + "\n")
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Environment Variables", check_environment),
        ("Directory Structure", check_directories),
        ("Pre-loaded Assets", check_preloaded_assets),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n{name}:")
        print("-"*40)
        result = check_func()
        results.append(result)
    
    print("\n" + "="*60)
    if all(results):
        print("✅ All checks passed! Setup is complete.")
        print("\nNext steps:")
        print("1. Run: python scripts/run_demo.py")
        print("2. Review logs in: data/logs/pipeline_logs/")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
EOF

# Run verification
python scripts/verify_setup.py
```

---

## 🧪 Run First Test

```bash
# Run the demo
python scripts/run_demo.py

# Expected output:
# 🚀 Initializing Strand AI Pipeline...
# ⚙️  Executing pipeline...
# ================================================================================
# STRAND AI POC - EXECUTION RESULTS
# ================================================================================
# ...
# ✅ Demo completed successfully!
```

---

## 🐛 Troubleshooting

### Issue 1: Module Not Found

**Error**: `ModuleNotFoundError: No module named 'src'`

**Solution**:
```bash
# Add src to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Or run from project root
cd /path/to/strand-ai-poc
python scripts/run_demo.py
```

### Issue 2: Environment Variables Not Loading

**Error**: Settings validation error

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check file contents
cat .env

# Reinstall python-dotenv
pip install --upgrade python-dotenv
```

### Issue 3: Redis Connection Failed

**Error**: `redis.exceptions.ConnectionError`

**Solution**:
```bash
# Check MemoryDB endpoint
aws memorydb describe-clusters --cluster-name strand-ai-poc

# Verify security group allows inbound on port 6379
# Verify subnet group configuration
# Check VPC and network connectivity
```

### Issue 4: Permission Denied

**Error**: `PermissionError: [Errno 13] Permission denied`

**Solution**:
```bash
# Check directory permissions
ls -la data/

# Create directories with proper permissions
mkdir -p data/logs/pipeline_logs
chmod 755 data/logs/pipeline_logs
```

---

## 📚 Next Steps

After successful setup:

1. **Review Documentation**
   - Read [Project Structure](STRAND_AI_PROJECT_STRUCTURE.md)
   - Read [Implementation Guide](IMPLEMENTATION_GUIDE.md)

2. **Run Tests**
   ```bash
   pytest tests/unit/
   ```

3. **Start Development**
   - Implement vector retrieval module
   - Implement attribution algorithms
   - Integrate video model

4. **Monitor Logs**
   ```bash
   tail -f data/logs/pipeline_logs/strand_ai.log
   ```

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Use .env.example as template

2. **Rotate API keys regularly**
   - Update in .env
   - Update in AWS Secrets Manager (production)

3. **Use IAM roles for AWS access**
   - Don't hardcode AWS credentials
   - Use instance profiles or IAM roles

4. **Secure MemoryDB**
   - Enable TLS/SSL
   - Use strong passwords
   - Restrict security group access

---

## 📞 Support

For setup issues:
- Check troubleshooting section above
- Review error logs in `data/logs/`
- Contact Neural Arc team

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Created By**: Helium AI (Neural Arc Inc.)