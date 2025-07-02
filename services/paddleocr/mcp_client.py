#!/usr/bin/env python3
"""
PaddleOCR MCP Client Example
Demonstrates how to connect to and use the PaddleOCR MCP server.
"""

import asyncio
import json
import base64
import logging
from typing import Dict, Any, List
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PaddleOCRMCPClient:
    """Example client for PaddleOCR MCP Server."""
    
    def __init__(self, server_url: str = "stdio://paddleocr-mcp-server"):
        self.server_url = server_url
        self.client = None
        
    async def connect(self):
        """Connect to the MCP server."""
        try:
            # In a real implementation, you would use the MCP client SDK
            # For now, this is a placeholder for the connection logic
            logger.info(f"Connecting to MCP server at {self.server_url}")
            # self.client = MCPClient(self.server_url)
            # await self.client.connect()
            logger.info("Connected to PaddleOCR MCP Server")
        except Exception as e:
            logger.error(f"Failed to connect to MCP server: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from the MCP server."""
        if self.client:
            # await self.client.disconnect()
            logger.info("Disconnected from MCP server")
    
    def encode_image_to_base64(self, image_path: str) -> str:
        """Encode an image file to base64."""
        try:
            with open(image_path, 'rb') as image_file:
                encoded = base64.b64encode(image_file.read()).decode('utf-8')
                return f"data:image/jpeg;base64,{encoded}"
        except Exception as e:
            logger.error(f"Failed to encode image {image_path}: {e}")
            raise
    
    async def list_available_tools(self) -> List[Dict[str, Any]]:
        """List all available tools from the MCP server."""
        try:
            # Mock response for demonstration
            tools = [
                {
                    "name": "extract_text_from_image",
                    "description": "Extract text from an image using PaddleOCR",
                    "parameters": ["image_data", "language", "use_angle_cls", "use_gpu"]
                },
                {
                    "name": "batch_extract_text", 
                    "description": "Extract text from multiple images in batch",
                    "parameters": ["images", "language", "parallel"]
                },
                {
                    "name": "analyze_document_structure",
                    "description": "Analyze document structure including layout, tables, and text regions",
                    "parameters": ["image_data", "language", "include_tables", "include_layout"]
                },
                {
                    "name": "get_ocr_info",
                    "description": "Get information about PaddleOCR capabilities and configuration",
                    "parameters": []
                }
            ]
            logger.info(f"Available tools: {[tool['name'] for tool in tools]}")
            return tools
        except Exception as e:
            logger.error(f"Failed to list tools: {e}")
            raise
    
    async def extract_text_from_image(self, image_path: str, language: str = "en", 
                                    use_angle_cls: bool = True, use_gpu: bool = False) -> Dict[str, Any]:
        """Extract text from a single image."""
        try:
            # Encode image to base64
            image_data = self.encode_image_to_base64(image_path)
            
            # Prepare arguments
            arguments = {
                "image_data": image_data,
                "language": language,
                "use_angle_cls": use_angle_cls,
                "use_gpu": use_gpu
            }
            
            # Mock OCR result for demonstration
            result = {
                "success": True,
                "text": "Sample extracted text from the image",
                "confidence": 0.95,
                "language": language,
                "bounding_boxes": [
                    {
                        "text": "Sample text",
                        "confidence": 0.95,
                        "bbox": [[10, 10], [100, 10], [100, 30], [10, 30]]
                    }
                ],
                "word_count": 2,
                "processed_at": "2025-01-08T12:00:00",
                "engine": "PaddleOCR-MCP",
                "version": "3.1.0"
            }
            
            logger.info(f"OCR completed for {image_path}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to extract text from {image_path}: {e}")
            raise
    
    async def batch_extract_text(self, image_paths: List[str], language: str = "en", 
                                parallel: bool = True) -> Dict[str, Any]:
        """Extract text from multiple images."""
        try:
            # Prepare images data
            images = []
            for i, path in enumerate(image_paths):
                image_data = self.encode_image_to_base64(path)
                images.append({
                    "id": f"img_{i}",
                    "image_data": image_data,
                    "filename": Path(path).name
                })
            
            arguments = {
                "images": images,
                "language": language,
                "parallel": parallel
            }
            
            # Mock batch result
            results = []
            for img in images:
                results.append({
                    "id": img["id"],
                    "filename": img["filename"],
                    "success": True,
                    "text": f"Sample text from {img['filename']}",
                    "confidence": 0.92,
                    "word_count": 3
                })
            
            batch_result = {
                "success": True,
                "results": results,
                "total_processed": len(image_paths),
                "language": language,
                "processed_at": "2025-01-08T12:00:00",
                "parallel": parallel
            }
            
            logger.info(f"Batch OCR completed for {len(image_paths)} images")
            return batch_result
            
        except Exception as e:
            logger.error(f"Failed to process batch OCR: {e}")
            raise
    
    async def analyze_document_structure(self, image_path: str, language: str = "en",
                                       include_tables: bool = True, include_layout: bool = True) -> Dict[str, Any]:
        """Analyze document structure."""
        try:
            image_data = self.encode_image_to_base64(image_path)
            
            arguments = {
                "image_data": image_data,
                "language": language,
                "include_tables": include_tables,
                "include_layout": include_layout
            }
            
            # Mock structure analysis result
            structure_result = {
                "success": True,
                "document_structure": {
                    "text_regions": [
                        {
                            "text": "Document Title",
                            "confidence": 0.98,
                            "bbox": [[50, 20], [200, 20], [200, 40], [50, 40]],
                            "type": "title"
                        },
                        {
                            "text": "This is a paragraph of text in the document.",
                            "confidence": 0.93,
                            "bbox": [[50, 60], [300, 60], [300, 80], [50, 80]], 
                            "type": "paragraph"
                        }
                    ],
                    "layout_analysis": include_layout,
                    "table_recognition": include_tables,
                    "total_regions": 2
                },
                "language": language,
                "processed_at": "2025-01-08T12:00:00",
                "engine": "PaddleOCR-Structure-MCP"
            }
            
            logger.info(f"Document structure analysis completed for {image_path}")
            return structure_result
            
        except Exception as e:
            logger.error(f"Failed to analyze document structure: {e}")
            raise
    
    async def get_ocr_info(self) -> Dict[str, Any]:
        """Get OCR service information."""
        try:
            info = {
                "service": "PaddleOCR MCP Server",
                "version": "3.1.0",
                "supported_languages": ["en", "ch", "fr", "german", "korean", "japan", "ar", "es", "pt", "ru"],
                "default_language": "en",
                "active_engines": ["en_False", "ch_False"],
                "capabilities": {
                    "text_detection": True,
                    "text_recognition": True,
                    "angle_classification": True,
                    "multilingual_support": True,
                    "batch_processing": True,
                    "document_structure_analysis": True,
                    "gpu_acceleration": True
                },
                "models": {
                    "detection": "PP-OCRv5 Detection",
                    "recognition": "PP-OCRv5 Recognition",
                    "classification": "PP-LCNet Text Direction"
                },
                "performance": {
                    "accuracy": "High",
                    "speed": "Fast",
                    "model_size": "Lightweight (8.1MB)"
                }
            }
            
            logger.info("Retrieved OCR service information")
            return info
            
        except Exception as e:
            logger.error(f"Failed to get OCR info: {e}")
            raise

async def demo_usage():
    """Demonstrate usage of the PaddleOCR MCP client."""
    client = PaddleOCRMCPClient()
    
    try:
        # Connect to server
        await client.connect()
        
        # List available tools
        tools = await client.list_available_tools()
        print("Available Tools:")
        for tool in tools:
            print(f"  - {tool['name']}: {tool['description']}")
        
        # Get OCR info
        print("\n=== OCR Service Information ===")
        info = await client.get_ocr_info()
        print(json.dumps(info, indent=2))
        
        # Example image OCR (you would need actual image files)
        # result = await client.extract_text_from_image("sample_image.jpg", language="en")
        # print("\n=== OCR Result ===")
        # print(json.dumps(result, indent=2))
        
        # Example batch OCR
        # batch_result = await client.batch_extract_text(["image1.jpg", "image2.jpg"])
        # print("\n=== Batch OCR Result ===")
        # print(json.dumps(batch_result, indent=2))
        
        # Example document structure analysis
        # structure = await client.analyze_document_structure("document.jpg")
        # print("\n=== Document Structure ===")
        # print(json.dumps(structure, indent=2))
        
    except Exception as e:
        logger.error(f"Demo failed: {e}")
    finally:
        # Disconnect
        await client.disconnect()

if __name__ == "__main__":
    print("PaddleOCR MCP Client Demo")
    print("=" * 40)
    asyncio.run(demo_usage())