# PaddleOCR MCP Server Integration for TaskCore

## Overview

This document describes the integration of PaddleOCR with the Model Context Protocol (MCP) server in the TaskCore platform. This integration enables AI agents and applications to perform Optical Character Recognition (OCR) tasks through standardized MCP interfaces.

## Architecture

The PaddleOCR MCP integration consists of two main components:

1. **PaddleOCR REST API Service** (`services/paddleocr/app.py`)
   - Provides traditional HTTP REST endpoints for OCR functionality
   - Handles file uploads and image processing
   - Supports batch processing and multiple languages

2. **PaddleOCR MCP Server** (`services/paddleocr/mcp_server.py`)
   - Implements the Model Context Protocol for OCR capabilities
   - Provides standardized tools and resources for AI agents
   - Supports async processing and comprehensive error handling

## Key Features

### OCR Capabilities
- **Multi-language Support**: English, Chinese, French, German, Korean, Japanese, Arabic, Spanish, Portuguese, Russian
- **High Accuracy**: Uses PaddleOCR 3.1.0 with PP-OCRv5 models
- **Text Detection & Recognition**: Comprehensive text extraction with bounding boxes
- **Angle Classification**: Automatic text orientation detection
- **Document Structure Analysis**: Layout detection and text region classification

### MCP Protocol Support
- **Standard Tools**: 4 main tools for various OCR operations
- **Resource Endpoints**: Service information and model configurations
- **Error Handling**: Comprehensive error reporting and validation
- **Async Operations**: Non-blocking processing for better performance

### Integration Points
- **Claude Desktop**: Direct integration with Claude conversations
- **Cursor IDE**: OCR tools available in development workflow
- **LiteLLM Proxy**: Unified API access through LiteLLM
- **TaskCore Services**: Integration with punch-list and knowledge services

## Deployment

### Docker Compose Services

The integration adds two new services to the TaskCore platform:

```yaml
# Original OCR REST API
paddleocr:
  build: ./services/paddleocr
  ports: ["8888:8888"]
  
# New MCP Server
paddleocr-mcp:
  build:
    context: ./services/paddleocr
    dockerfile: Dockerfile.mcp
  ports: ["8889:8889"]
  depends_on: [paddleocr]
```

### Service Endpoints

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| PaddleOCR API | 8888 | HTTP REST | Traditional API endpoints |
| PaddleOCR MCP | 8889 | MCP/stdio | Model Context Protocol server |

## MCP Tools Reference

### 1. extract_text_from_image
Extract text from a single image with detailed analysis.

**Input Schema:**
```json
{
  "image_data": "base64_encoded_image_or_path",
  "language": "en",
  "use_angle_cls": true,
  "use_gpu": false
}
```

**Output:**
```json
{
  "success": true,
  "text": "Extracted text content",
  "confidence": 0.95,
  "bounding_boxes": [...],
  "language": "en",
  "word_count": 10,
  "processed_at": "2025-01-08T12:00:00Z"
}
```

### 2. batch_extract_text
Process multiple images efficiently in parallel or sequential mode.

**Input Schema:**
```json
{
  "images": [
    {
      "id": "img_1",
      "image_data": "base64_data",
      "filename": "document1.jpg"
    }
  ],
  "language": "en",
  "parallel": true
}
```

### 3. analyze_document_structure
Analyze document layout and structure for complex documents.

**Input Schema:**
```json
{
  "image_data": "base64_encoded_image",
  "language": "en",
  "include_tables": true,
  "include_layout": true
}
```

### 4. get_ocr_info
Get service information, capabilities, and configuration.

**Output:**
```json
{
  "service": "PaddleOCR MCP Server",
  "version": "3.1.0",
  "supported_languages": [...],
  "capabilities": {...},
  "models": {...}
}
```

## Integration Examples

### Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "paddleocr": {
      "command": "python",
      "args": ["/path/to/taskcore/services/paddleocr/mcp_server.py"],
      "env": {
        "PYTHONPATH": "/path/to/taskcore/services/paddleocr",
        "PADDLEOCR_LANG": "en"
      }
    }
  }
}
```

### Cursor IDE Configuration

Add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "paddleocr": {
      "url": "stdio://python",
      "args": ["/path/to/taskcore/services/paddleocr/mcp_server.py"]
    }
  }
}
```

### LiteLLM Proxy Integration

Add to LiteLLM configuration:

```yaml
mcp_servers:
  paddleocr:
    url: "http://localhost:8889/mcp"
    transport: "http"
    description: "PaddleOCR text extraction service"
    auth_type: "none"
```

## TaskCore Service Integration

### Punch List Service Integration

The punch-list service can now use MCP tools for enhanced document processing:

```python
# In punch-list service
async def process_document_with_mcp(image_path):
    mcp_client = PaddleOCRMCPClient()
    await mcp_client.connect()
    
    # Extract text and analyze structure
    ocr_result = await mcp_client.extract_text_from_image(image_path)
    structure = await mcp_client.analyze_document_structure(image_path)
    
    # Process results for punch list items
    punch_items = extract_punch_items(ocr_result, structure)
    
    await mcp_client.disconnect()
    return punch_items
```

### Knowledge Service Integration

Enhanced document indexing with structured text extraction:

```python
# In knowledge service
async def index_document_with_mcp(document):
    mcp_client = PaddleOCRMCPClient()
    await mcp_client.connect()
    
    # Extract structured text
    structure = await mcp_client.analyze_document_structure(document.image_path)
    
    # Create knowledge entries with proper structure
    knowledge_entries = create_structured_entries(structure)
    
    await mcp_client.disconnect()
    return knowledge_entries
```

## Configuration Management

### Environment Variables

Key environment variables for the MCP server:

```bash
# Core OCR settings
PADDLEOCR_LANG=en
PADDLEOCR_USE_GPU=false
PADDLEOCR_USE_ANGLE_CLS=true

# MCP server settings
MCP_SERVER_PORT=8889
LOG_LEVEL=INFO

# Performance settings
MAX_BATCH_SIZE=10
MAX_WORKERS=4
```

### Configuration File

The service uses `config.yaml` for detailed configuration:

```yaml
ocr:
  default_language: "en"
  supported_languages: ["en", "ch", "fr", ...]
  use_angle_cls: true
  use_gpu: false

mcp:
  protocol_version: "2025-03-26"
  tools: [...]
  resources: [...]

performance:
  max_workers: 4
  max_batch_size: 10
  cache_size: 100
```

## Monitoring and Observability

### Health Checks

Both services provide health check endpoints:

```bash
# REST API health check
curl http://localhost:8888/health

# MCP server health check
curl http://localhost:8889/health
```

### Logging

Comprehensive logging is configured for both services:

- **Application logs**: `/app/logs/paddleocr.log`
- **MCP server logs**: `/app/logs/paddleocr-mcp.log`
- **Error logs**: Captured and formatted for debugging

### Metrics

Key metrics are tracked:
- Request count and processing time
- Error rates and types
- Memory and CPU usage
- OCR accuracy scores

## Performance Optimization

### Recommended Settings

For production deployment:

```yaml
# config.yaml
performance:
  max_workers: 8          # Adjust based on CPU cores
  max_batch_size: 20      # Higher for batch processing
  cache_size: 200         # Increase for better caching
  
ocr:
  use_gpu: true           # Enable if GPU available
  max_image_size: 20971520 # 20MB for high-res images
```

### Resource Requirements

- **CPU**: 4+ cores recommended
- **Memory**: 4GB+ RAM (8GB+ with GPU)
- **Storage**: 10GB+ for models and cache
- **GPU**: Optional, provides 2x speed improvement

## Troubleshooting

### Common Issues

1. **MCP Connection Failed**
   ```bash
   # Check if server is running
   docker ps | grep paddleocr-mcp
   
   # Check logs
   docker logs paddleocr-mcp
   ```

2. **OCR Accuracy Issues**
   - Verify image quality (300+ DPI recommended)
   - Use correct language parameter
   - Enable angle classification for rotated text

3. **Performance Issues**
   - Enable GPU acceleration if available
   - Increase worker count for parallel processing
   - Use batch processing for multiple images

### Debugging

Enable debug mode for detailed logging:

```bash
# In docker-compose.yml
environment:
  - LOG_LEVEL=DEBUG
  - DEBUG=true
```

## Security Considerations

### Input Validation
- File size limits (10MB default)
- Extension validation for uploaded images
- Path sanitization for security

### Rate Limiting
- 100 requests per minute per IP
- Configurable through environment variables

### Network Security
- Services run on internal Docker network
- Only necessary ports exposed externally

## Future Enhancements

### Planned Features
1. **PP-StructureV3 Integration**: Advanced document parsing
2. **Custom Model Support**: Load custom OCR models
3. **Webhook Support**: Async processing notifications
4. **Multi-tenant Support**: Isolated processing per tenant

### Performance Improvements
1. **Model Caching**: Intelligent model loading
2. **Result Caching**: Cache OCR results for duplicate images
3. **Distributed Processing**: Scale across multiple instances

## Conclusion

The PaddleOCR MCP server integration provides TaskCore with powerful OCR capabilities accessible through standardized protocols. This enables AI agents, development tools, and custom applications to seamlessly integrate text extraction functionality into their workflows.

The dual-service architecture (REST API + MCP server) ensures compatibility with both traditional applications and modern AI-powered tools, making TaskCore a comprehensive platform for document processing and productivity enhancement.