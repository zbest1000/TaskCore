import os
import uuid
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from paddleocr import PaddleOCR
from PIL import Image
import numpy as np
import cv2

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize PaddleOCR
ocr_engine = None

def initialize_ocr():
    global ocr_engine
    try:
        # Initialize PaddleOCR with English language support
        ocr_engine = PaddleOCR(
            use_angle_cls=True,
            lang='en',
            use_gpu=False,  # Set to True if GPU is available
            show_log=False
        )
        logger.info("PaddleOCR initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize PaddleOCR: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        status = 'healthy' if ocr_engine else 'unhealthy'
        return jsonify({
            'status': status,
            'timestamp': datetime.now().isoformat(),
            'service': 'paddleocr',
            'version': '1.0.0'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/ocr/extract', methods=['POST'])
def extract_text():
    """Extract text from image using PaddleOCR"""
    try:
        if not ocr_engine:
            return jsonify({
                'success': False,
                'error': 'OCR engine not initialized'
            }), 500

        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400

        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        if file_extension not in allowed_extensions:
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Supported: PNG, JPG, JPEG, GIF, BMP, TIFF'
            }), 400

        # Save uploaded file temporarily
        upload_id = str(uuid.uuid4())
        temp_path = f'/app/uploads/{upload_id}.{file_extension}'
        file.save(temp_path)

        try:
            # Load and process image
            image = cv2.imread(temp_path)
            if image is None:
                return jsonify({
                    'success': False,
                    'error': 'Could not read image file'
                }), 400

            # Perform OCR
            result = ocr_engine.ocr(temp_path, cls=True)
            
            # Process results
            extracted_text = []
            bounding_boxes = []
            confidence_scores = []
            
            if result and result[0]:
                for line in result[0]:
                    if len(line) >= 2:
                        bbox = line[0]  # Bounding box coordinates
                        text_info = line[1]  # Text and confidence
                        
                        if len(text_info) >= 2:
                            text = text_info[0]
                            confidence = float(text_info[1])
                            
                            extracted_text.append(text)
                            confidence_scores.append(confidence)
                            bounding_boxes.append({
                                'text': text,
                                'confidence': confidence,
                                'position': {
                                    'x': float(bbox[0][0]),
                                    'y': float(bbox[0][1]),
                                    'width': float(bbox[2][0] - bbox[0][0]),
                                    'height': float(bbox[2][1] - bbox[0][1])
                                }
                            })

            # Calculate overall confidence
            overall_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0

            # Combine all text
            full_text = ' '.join(extracted_text)

            return jsonify({
                'success': True,
                'data': {
                    'id': upload_id,
                    'text': full_text,
                    'confidence': overall_confidence,
                    'boundingBoxes': bounding_boxes,
                    'language': 'en',
                    'processedAt': datetime.now().isoformat(),
                    'engine': 'PaddleOCR',
                    'version': '2.7.0'
                }
            })

        finally:
            # Clean up temporary file
            try:
                os.remove(temp_path)
            except OSError:
                pass

    except Exception as e:
        logger.error(f"OCR extraction error: {e}")
        return jsonify({
            'success': False,
            'error': 'OCR processing failed',
            'details': str(e)
        }), 500

@app.route('/ocr/batch', methods=['POST'])
def batch_extract_text():
    """Extract text from multiple images"""
    try:
        if not ocr_engine:
            return jsonify({
                'success': False,
                'error': 'OCR engine not initialized'
            }), 500

        files = request.files.getlist('files')
        if not files:
            return jsonify({
                'success': False,
                'error': 'No files provided'
            }), 400

        results = []
        for file in files:
            if file.filename == '':
                continue

            # Process each file (simplified version)
            try:
                upload_id = str(uuid.uuid4())
                file_extension = file.filename.rsplit('.', 1)[1].lower()
                temp_path = f'/app/uploads/{upload_id}.{file_extension}'
                file.save(temp_path)

                result = ocr_engine.ocr(temp_path, cls=True)
                
                extracted_text = []
                if result and result[0]:
                    for line in result[0]:
                        if len(line) >= 2 and len(line[1]) >= 2:
                            extracted_text.append(line[1][0])

                results.append({
                    'filename': file.filename,
                    'id': upload_id,
                    'text': ' '.join(extracted_text),
                    'success': True
                })

                # Clean up
                try:
                    os.remove(temp_path)
                except OSError:
                    pass

            except Exception as e:
                results.append({
                    'filename': file.filename,
                    'success': False,
                    'error': str(e)
                })

        return jsonify({
            'success': True,
            'data': results
        })

    except Exception as e:
        logger.error(f"Batch OCR error: {e}")
        return jsonify({
            'success': False,
            'error': 'Batch OCR processing failed',
            'details': str(e)
        }), 500

@app.route('/ocr/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages"""
    return jsonify({
        'success': True,
        'data': {
            'languages': [
                {'code': 'en', 'name': 'English'},
                {'code': 'ch', 'name': 'Chinese'},
                {'code': 'fr', 'name': 'French'},
                {'code': 'german', 'name': 'German'},
                {'code': 'korean', 'name': 'Korean'},
                {'code': 'japan', 'name': 'Japanese'}
            ],
            'default': 'en'
        }
    })

if __name__ == '__main__':
    # Create uploads directory
    os.makedirs('/app/uploads', exist_ok=True)
    
    # Initialize OCR engine
    initialize_ocr()
    
    # Start Flask app
    app.run(host='0.0.0.0', port=8888, debug=False)