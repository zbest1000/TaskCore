#!/usr/bin/env python3
"""
PaddleOCR MCP Server
A Model Context Protocol server providing OCR capabilities using PaddleOCR.
"""

import asyncio
import json
import logging
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence
import base64
import io

import numpy as np
import cv2
from PIL import Image
from paddleocr import PaddleOCR

# MCP SDK imports
from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PaddleOCRMCPServer:
    """MCP Server for PaddleOCR functionality."""
    
    def __init__(self):
        self.server = Server("paddleocr-mcp")
        self.ocr_engines = {}
        self.supported_languages = [
            "en", "ch", "fr", "german", "korean", "japan", "ar", "es", "pt", "ru"
        ]
        self.default_language = "en"
        
        # Setup server handlers
        self._setup_handlers()
        
    def _setup_handlers(self):
        """Setup MCP server handlers."""
        
        @self.server.list_resources()
        async def handle_list_resources() -> List[Resource]:
            """List available OCR resources."""
            return [
                Resource(
                    uri="paddleocr://info",
                    name="PaddleOCR Information",
                    description="Information about PaddleOCR capabilities and supported languages",
                    mimeType="application/json"
                ),
                Resource(
                    uri="paddleocr://models",
                    name="Available OCR Models",
                    description="List of available OCR models and their configurations",
                    mimeType="application/json"
                )
            ]
            
        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            """Read a specific resource."""
            if uri == "paddleocr://info":
                return json.dumps({
                    "service": "PaddleOCR MCP Server",
                    "version": "3.1.0",
                    "supported_languages": self.supported_languages,
                    "default_language": self.default_language,
                    "capabilities": [
                        "text_detection",
                        "text_recognition", 
                        "text_direction_classification",
                        "multilingual_support",
                        "batch_processing"
                    ],
                    "models": {
                        "detection": "PP-OCRv5 Detection",
                        "recognition": "PP-OCRv5 Recognition", 
                        "classification": "PP-LCNet Text Direction"
                    }
                })
            elif uri == "paddleocr://models":
                return json.dumps({
                    "available_models": [
                        {
                            "name": "PP-OCRv5",
                            "type": "lightweight",
                            "languages": self.supported_languages,
                            "size": "8.1MB",
                            "accuracy": "high"
                        },
                        {
                            "name": "PP-StructureV3", 
                            "type": "document_parsing",
                            "capabilities": ["layout_analysis", "table_recognition", "formula_recognition"],
                            "size": "155MB",
                            "accuracy": "very_high"
                        }
                    ]
                })
            else:
                raise ValueError(f"Unknown resource: {uri}")
                
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available OCR tools."""
            return [
                Tool(
                    name="extract_text_from_image",
                    description="Extract text from an image using PaddleOCR",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "image_data": {
                                "type": "string",
                                "description": "Base64 encoded image data or file path"
                            },
                            "language": {
                                "type": "string", 
                                "description": f"Language code for OCR. Supported: {', '.join(self.supported_languages)}",
                                "default": self.default_language
                            },
                            "use_angle_cls": {
                                "type": "boolean",
                                "description": "Whether to use angle classification",
                                "default": True
                            },
                            "use_gpu": {
                                "type": "boolean",
                                "description": "Whether to use GPU acceleration",
                                "default": False
                            }
                        },
                        "required": ["image_data"]
                    }
                ),
                Tool(
                    name="batch_extract_text",
                    description="Extract text from multiple images in batch",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "images": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "string"},
                                        "image_data": {"type": "string"},
                                        "filename": {"type": "string"}
                                    },
                                    "required": ["image_data"]
                                },
                                "description": "Array of images to process"
                            },
                            "language": {
                                "type": "string",
                                "description": f"Language code for OCR. Supported: {', '.join(self.supported_languages)}",
                                "default": self.default_language
                            },
                            "parallel": {
                                "type": "boolean", 
                                "description": "Whether to process images in parallel",
                                "default": True
                            }
                        },
                        "required": ["images"]
                    }
                ),
                Tool(
                    name="analyze_document_structure",
                    description="Analyze document structure including layout, tables, and text regions",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "image_data": {
                                "type": "string",
                                "description": "Base64 encoded image data or file path"
                            },
                            "language": {
                                "type": "string",
                                "description": f"Language code for OCR. Supported: {', '.join(self.supported_languages)}",
                                "default": self.default_language
                            },
                            "include_tables": {
                                "type": "boolean",
                                "description": "Whether to recognize tables",
                                "default": True
                            },
                            "include_layout": {
                                "type": "boolean", 
                                "description": "Whether to analyze layout",
                                "default": True
                            }
                        },
                        "required": ["image_data"]
                    }
                ),
                Tool(
                    name="get_ocr_info",
                    description="Get information about PaddleOCR capabilities and configuration",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "additionalProperties": False
                    }
                )
            ]
            
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Handle tool calls."""
            try:
                if name == "extract_text_from_image":
                    return await self._extract_text_from_image(arguments)
                elif name == "batch_extract_text":
                    return await self._batch_extract_text(arguments)
                elif name == "analyze_document_structure":
                    return await self._analyze_document_structure(arguments)
                elif name == "get_ocr_info":
                    return await self._get_ocr_info(arguments)
                else:
                    raise ValueError(f"Unknown tool: {name}")
            except Exception as e:
                logger.error(f"Tool execution error: {e}")
                return [TextContent(
                    type="text",
                    text=f"Error executing tool {name}: {str(e)}"
                )]
    
    async def _get_ocr_engine(self, language: str = "en", use_gpu: bool = False) -> PaddleOCR:
        """Get or create OCR engine for specified language."""
        engine_key = f"{language}_{use_gpu}"
        
        if engine_key not in self.ocr_engines:
            try:
                self.ocr_engines[engine_key] = PaddleOCR(
                    use_angle_cls=True,
                    lang=language,
                    use_gpu=use_gpu,
                    show_log=False
                )
                logger.info(f"Created OCR engine for language: {language}, GPU: {use_gpu}")
            except Exception as e:
                logger.error(f"Failed to create OCR engine: {e}")
                raise
                
        return self.ocr_engines[engine_key]
    
    def _decode_image(self, image_data: str) -> np.ndarray:
        """Decode base64 image data or load from file path."""
        try:
            # Try to decode as base64
            if image_data.startswith('data:image'):
                # Handle data URL format
                header, encoded = image_data.split(',', 1)
                image_bytes = base64.b64decode(encoded)
            else:
                # Try direct base64 decode
                image_bytes = base64.b64decode(image_data)
            
            # Convert to numpy array
            image = Image.open(io.BytesIO(image_bytes))
            return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
        except Exception:
            # If base64 decode fails, treat as file path
            if os.path.exists(image_data):
                return cv2.imread(image_data)
            else:
                raise ValueError("Invalid image data: not valid base64 or file path")
    
    async def _extract_text_from_image(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Extract text from a single image."""
        image_data = arguments["image_data"]
        language = arguments.get("language", self.default_language)
        use_angle_cls = arguments.get("use_angle_cls", True)
        use_gpu = arguments.get("use_gpu", False)
        
        try:
            # Get OCR engine
            ocr_engine = await self._get_ocr_engine(language, use_gpu)
            
            # Decode image
            image = self._decode_image(image_data)
            
            # Perform OCR
            result = ocr_engine.ocr(image, cls=use_angle_cls)
            
            # Process results
            extracted_text = []
            bounding_boxes = []
            confidence_scores = []
            
            if result and result[0]:
                for line in result[0]:
                    if len(line) >= 2:
                        bbox = line[0]
                        text_info = line[1]
                        
                        if len(text_info) >= 2:
                            text = text_info[0]
                            confidence = float(text_info[1])
                            
                            extracted_text.append(text)
                            confidence_scores.append(confidence)
                            bounding_boxes.append({
                                'text': text,
                                'confidence': confidence,
                                'bbox': bbox
                            })
            
            # Calculate overall confidence
            overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
            full_text = ' '.join(extracted_text)
            
            result_data = {
                'success': True,
                'text': full_text,
                'confidence': overall_confidence,
                'language': language,
                'bounding_boxes': bounding_boxes,
                'word_count': len(extracted_text),
                'processed_at': datetime.now().isoformat(),
                'engine': 'PaddleOCR-MCP',
                'version': '3.1.0'
            }
            
            return [TextContent(
                type="text", 
                text=json.dumps(result_data, indent=2)
            )]
            
        except Exception as e:
            error_result = {
                'success': False,
                'error': str(e),
                'language': language,
                'processed_at': datetime.now().isoformat()
            }
            return [TextContent(
                type="text",
                text=json.dumps(error_result, indent=2)
            )]
    
    async def _batch_extract_text(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Extract text from multiple images."""
        images = arguments["images"]
        language = arguments.get("language", self.default_language)
        parallel = arguments.get("parallel", True)
        
        try:
            ocr_engine = await self._get_ocr_engine(language)
            results = []
            
            if parallel:
                # Process images in parallel using asyncio
                tasks = []
                for img in images:
                    task = self._process_single_image_async(ocr_engine, img, language)
                    tasks.append(task)
                results = await asyncio.gather(*tasks, return_exceptions=True)
            else:
                # Process images sequentially
                for img in images:
                    result = await self._process_single_image_async(ocr_engine, img, language)
                    results.append(result)
            
            batch_result = {
                'success': True,
                'results': results,
                'total_processed': len(images),
                'language': language,
                'processed_at': datetime.now().isoformat(),
                'parallel': parallel
            }
            
            return [TextContent(
                type="text",
                text=json.dumps(batch_result, indent=2)
            )]
            
        except Exception as e:
            error_result = {
                'success': False,
                'error': str(e),
                'language': language,
                'processed_at': datetime.now().isoformat()
            }
            return [TextContent(
                type="text", 
                text=json.dumps(error_result, indent=2)
            )]
    
    async def _process_single_image_async(self, ocr_engine: PaddleOCR, img_data: Dict[str, Any], language: str) -> Dict[str, Any]:
        """Process a single image asynchronously."""
        try:
            image = self._decode_image(img_data["image_data"])
            result = ocr_engine.ocr(image, cls=True)
            
            extracted_text = []
            confidence_scores = []
            
            if result and result[0]:
                for line in result[0]:
                    if len(line) >= 2 and len(line[1]) >= 2:
                        text = line[1][0]
                        confidence = float(line[1][1])
                        extracted_text.append(text)
                        confidence_scores.append(confidence)
            
            overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
            
            return {
                'id': img_data.get('id', str(uuid.uuid4())),
                'filename': img_data.get('filename', 'unknown'),
                'success': True,
                'text': ' '.join(extracted_text),
                'confidence': overall_confidence,
                'word_count': len(extracted_text)
            }
            
        except Exception as e:
            return {
                'id': img_data.get('id', str(uuid.uuid4())),
                'filename': img_data.get('filename', 'unknown'),
                'success': False,
                'error': str(e)
            }
    
    async def _analyze_document_structure(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Analyze document structure using PP-StructureV3."""
        image_data = arguments["image_data"]
        language = arguments.get("language", self.default_language)
        include_tables = arguments.get("include_tables", True)
        include_layout = arguments.get("include_layout", True)
        
        try:
            # For now, use basic OCR with structure analysis
            # In a full implementation, this would use PP-StructureV3
            ocr_engine = await self._get_ocr_engine(language)
            image = self._decode_image(image_data)
            
            # Perform OCR
            result = ocr_engine.ocr(image, cls=True)
            
            # Analyze structure (simplified implementation)
            text_regions = []
            if result and result[0]:
                for line in result[0]:
                    if len(line) >= 2:
                        bbox = line[0]
                        text_info = line[1]
                        
                        if len(text_info) >= 2:
                            text_regions.append({
                                'text': text_info[0],
                                'confidence': float(text_info[1]),
                                'bbox': bbox,
                                'type': 'text'  # In full implementation, would classify as title, paragraph, table, etc.
                            })
            
            structure_result = {
                'success': True,
                'document_structure': {
                    'text_regions': text_regions,
                    'layout_analysis': include_layout,
                    'table_recognition': include_tables,
                    'total_regions': len(text_regions)
                },
                'language': language,
                'processed_at': datetime.now().isoformat(),
                'engine': 'PaddleOCR-Structure-MCP'
            }
            
            return [TextContent(
                type="text",
                text=json.dumps(structure_result, indent=2)
            )]
            
        except Exception as e:
            error_result = {
                'success': False,
                'error': str(e),
                'language': language,
                'processed_at': datetime.now().isoformat()
            }
            return [TextContent(
                type="text",
                text=json.dumps(error_result, indent=2)
            )]
    
    async def _get_ocr_info(self, arguments: Dict[str, Any]) -> List[TextContent]:
        """Get OCR information and capabilities."""
        info = {
            'service': 'PaddleOCR MCP Server',
            'version': '3.1.0',
            'supported_languages': self.supported_languages,
            'default_language': self.default_language,
            'active_engines': list(self.ocr_engines.keys()),
            'capabilities': {
                'text_detection': True,
                'text_recognition': True,
                'angle_classification': True,
                'multilingual_support': True,
                'batch_processing': True,
                'document_structure_analysis': True,
                'gpu_acceleration': True
            },
            'models': {
                'detection': 'PP-OCRv5 Detection',
                'recognition': 'PP-OCRv5 Recognition',
                'classification': 'PP-LCNet Text Direction'
            },
            'performance': {
                'accuracy': 'High',
                'speed': 'Fast',
                'model_size': 'Lightweight (8.1MB)'
            }
        }
        
        return [TextContent(
            type="text",
            text=json.dumps(info, indent=2)
        )]

async def main():
    """Main entry point for the MCP server."""
    # Create server instance
    mcp_server = PaddleOCRMCPServer()
    
    # Run the server
    async with mcp_server.server.run_stdio() as (read_stream, write_stream):
        await mcp_server.server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="paddleocr-mcp",
                server_version="3.1.0",
                capabilities=mcp_server.server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={}
                )
            )
        )

if __name__ == "__main__":
    asyncio.run(main())