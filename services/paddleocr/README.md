# PaddleOCR MCP Server Integration

This service provides PaddleOCR capabilities through both REST API and Model Context Protocol (MCP) server interfaces.

## Overview

The PaddleOCR service integrates the powerful PaddleOCR 3.1.0 engine with MCP protocol support, enabling OCR functionality for AI agents and applications. It supports multiple languages, batch processing, and document structure analysis.

## Features

### Core OCR Capabilities
- **Text Detection & Recognition**: High-accuracy text extraction from images
- **Multi-language Support**: English, Chinese, French, German, Korean, Japanese, Arabic, Spanish, Portuguese, Russian
- **Angle Classification**: Automatic text orientation detection and correction
- **Batch Processing**: Process multiple images efficiently
- **Document Structure Analysis**: Layout detection, table recognition, and text region classification

### MCP Protocol Support
- **Standard MCP Tools**: Extract text, batch process, analyze document structure
- **Resource Endpoints**: OCR service info and model configurations
- **Async Processing**: Non-blocking operations for better performance
- **Error Handling**: Comprehensive error reporting and logging

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │    │  Flask REST API  │    │  PaddleOCR      │
│   (Claude, etc) │◄──►│  (Port 8888)     │◄──►│  Engine         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Server    │    │  HTTP Endpoints  │    │  PP-OCRv5       │
│   (stdio/tcp)   │    │  /ocr/*          │    │  Models         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Docker & Docker Compose
- PaddlePaddle 2.5.2+
- 4GB+ RAM recommended

### Docker Setup (Recommended)

1. **Build the service:**
```bash
cd services/paddleocr
docker-compose build
```

2. **Start the service:**
```bash
docker-compose up -d
```

3. **Verify installation:**
```bash
curl http://localhost:8888/health
```

### Local Development Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Start REST API server:**
```bash
python app.py
```

3. **Start MCP server:**
```bash
python mcp_server.py
```

## Usage

### REST API Endpoints

#### Extract Text from Single Image
```bash
curl -X POST http://localhost:8888/ocr/extract \
  -F "file=@image.jpg"
```

#### Batch Process Multiple Images
```bash
curl -X POST http://localhost:8888/ocr/batch \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

#### Get Supported Languages
```bash
curl http://localhost:8888/ocr/languages
```

### MCP Server Integration

#### Configuration for Claude Desktop
Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "paddleocr": {
      "command": "python",
      "args": ["/path/to/services/paddleocr/mcp_server.py"],
      "env": {
        "PYTHONPATH": "/path/to/services/paddleocr"
      }
    }
  }
}
```

#### Configuration for Cursor IDE
```json
{
  "mcpServers": {
    "paddleocr": {
      "url": "stdio://python",
      "args": ["/path/to/services/paddleocr/mcp_server.py"]
    }
  }
}
```

#### Configuration for LiteLLM Proxy
```yaml
mcp_servers:
  paddleocr:
    url: "http://localhost:8889/mcp"
    transport: "http"
    description: "PaddleOCR text extraction service"
```

### MCP Tools Available

#### 1. extract_text_from_image
Extract text from a single image with detailed results.

**Parameters:**
- `image_data` (required): Base64 encoded image or file path
- `language` (optional): Language code (default: "en")
- `use_angle_cls` (optional): Enable angle classification (default: true)
- `use_gpu` (optional): Use GPU acceleration (default: false)

**Example:**
```json
{
  "name": "extract_text_from_image",
  "arguments": {
    "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
    "language": "en",
    "use_angle_cls": true
  }
}
```

#### 2. batch_extract_text
Process multiple images in parallel or sequential mode.

**Parameters:**
- `images` (required): Array of image objects with id, image_data, filename
- `language` (optional): Language code (default: "en")
- `parallel` (optional): Process in parallel (default: true)

#### 3. analyze_document_structure
Analyze document layout and structure.

**Parameters:**
- `image_data` (required): Base64 encoded image or file path
- `language` (optional): Language code (default: "en")
- `include_tables` (optional): Detect tables (default: true)
- `include_layout` (optional): Analyze layout (default: true)

#### 4. get_ocr_info
Get service information and capabilities.

### Python Client Example

```python
from mcp_client import PaddleOCRMCPClient
import asyncio

async def main():
    client = PaddleOCRMCPClient()
    await client.connect()
    
    # Extract text from image
    result = await client.extract_text_from_image(
        "document.jpg", 
        language="en"
    )
    print(f"Extracted text: {result['text']}")
    
    # Batch process
    batch_result = await client.batch_extract_text([
        "image1.jpg", "image2.jpg", "image3.jpg"
    ])
    print(f"Processed {batch_result['total_processed']} images")
    
    await client.disconnect()

asyncio.run(main())
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PADDLEOCR_LANG` | Default language for OCR | `en` |
| `PADDLEOCR_USE_GPU` | Enable GPU acceleration | `false` |
| `PADDLEOCR_USE_ANGLE_CLS` | Enable angle classification | `true` |
| `MCP_SERVER_PORT` | MCP server port | `8889` |
| `LOG_LEVEL` | Logging level | `INFO` |

### Supported Languages

| Code | Language | Model Support |
|------|----------|---------------|
| `en` | English | ✅ Full |
| `ch` | Chinese (Simplified) | ✅ Full |
| `fr` | French | ✅ Full |
| `german` | German | ✅ Full |
| `korean` | Korean | ✅ Full |
| `japan` | Japanese | ✅ Full |
| `ar` | Arabic | ✅ Full |
| `es` | Spanish | ✅ Full |
| `pt` | Portuguese | ✅ Full |
| `ru` | Russian | ✅ Full |

## Performance & Optimization

### Model Performance
- **PP-OCRv5**: 8.1MB lightweight model
- **Accuracy**: >95% on standard datasets
- **Speed**: ~100ms per image (CPU), ~50ms (GPU)
- **Memory**: 1-2GB RAM usage

### Optimization Tips
1. **Use GPU**: Set `use_gpu=true` for 2x speed improvement
2. **Batch Processing**: Process multiple images together
3. **Language Selection**: Use specific language codes for better accuracy
4. **Image Preprocessing**: Ensure good image quality and resolution

## Troubleshooting

### Common Issues

#### 1. MCP Server Connection Failed
```bash
# Check if server is running
ps aux | grep mcp_server.py

# Check logs
tail -f /var/log/paddleocr-mcp.log
```

#### 2. OCR Low Accuracy
- Ensure good image quality (300+ DPI)
- Use correct language parameter
- Enable angle classification for rotated text
- Preprocess images (contrast, noise reduction)

#### 3. Memory Issues
- Reduce batch size
- Use GPU mode to offload processing
- Monitor memory usage with `htop`

#### 4. Dependency Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check PaddlePaddle installation
python -c "import paddle; print(paddle.__version__)"
```

### Logs and Monitoring

- **Application Logs**: `/app/logs/paddleocr.log`
- **MCP Server Logs**: `/app/logs/mcp-server.log`
- **Health Check**: `GET /health`
- **Metrics**: Available at `/metrics` (Prometheus format)

## Development

### Adding New Features

1. **New OCR Tools**: Add methods to `PaddleOCRMCPServer` class
2. **Custom Preprocessing**: Extend `_decode_image` method
3. **New Languages**: Update `supported_languages` list
4. **Performance Monitoring**: Add metrics collection

### Testing

```bash
# Run unit tests
python -m pytest tests/

# Test MCP server
python mcp_client.py

# Test REST API
curl http://localhost:8888/health
```

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

## Integration Examples

### With Claude Desktop
Use PaddleOCR directly in Claude conversations for image text extraction.

### With Cursor IDE
Access OCR tools in your development workflow through MCP integration.

### With LiteLLM Proxy
Route OCR requests through LiteLLM for unified API access.

### With Custom Applications
Use the Python client library or REST API for custom integrations.

## API Reference

### REST API Documentation
- OpenAPI spec available at: `/docs`
- Interactive testing: `/redoc`

### MCP Protocol Documentation
- Tools schema: Available via `tools/list` MCP call
- Resources: Available via `resources/list` MCP call

## Security Considerations

- **Input Validation**: All image inputs are validated
- **File Size Limits**: Max 10MB per image
- **Rate Limiting**: 100 requests per minute per IP
- **Sanitization**: File paths and inputs are sanitized
- **CORS**: Configured for secure cross-origin requests

## License

This service integrates PaddleOCR (Apache 2.0 License) with MCP protocol support.

## Support

- **Documentation**: This README and inline code comments
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Community**: PaddleOCR community forums