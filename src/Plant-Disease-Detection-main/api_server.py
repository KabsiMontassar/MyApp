import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from model_loader import load_model, preprocess_image, predict_disease
import tensorflow as tf
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])  # Enable CORS specifically for Angular

# Determine file paths
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "PDD_completemodel.h5")
labels_path = os.path.join(current_dir, "class_labels.json")

# Load the disease diagnosis model
logger.info(f"Loading model from {model_path}...")
try:
    model = load_model(model_path)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Load class labels
try:
    with open(labels_path, "r") as f:
        class_labels = json.load(f)
    logger.info(f"Loaded {len(class_labels)} class labels")
except Exception as e:
    logger.error(f"Error loading class labels: {str(e)}")
    raise

# Disease treatments dictionary
TREATMENTS = {
    "Apple - Apple Scab": "Rake and destroy fallen leaves, prune for good air circulation, apply fungicides like captan or sulfur before rainy periods, and plant resistant apple varieties.",
    "Apple - Black Rot": "Prune and remove infected branches, destroy fallen leaves and fruit, apply copper-based fungicides, and ensure proper spacing between trees.",
    "Apple - Cedar Apple Rust": "Remove nearby juniper or cedar trees if possible, apply fungicides like myclobutanil, and plant resistant apple varieties.",
    "Apple - Healthy": "Your apple tree appears healthy! Continue regular maintenance, including pruning, watering, and monitoring for pests or disease symptoms.",
    "Background without Leaves": "No plants detected. Please upload an image containing leaves to diagnose.",
    "Blueberry - Healthy": "Your blueberry plant is healthy! Ensure consistent watering, proper mulching, and protect it from frost during early spring.",
    "Cherry - Powdery Mildew": "Remove infected leaves, avoid overhead watering, ensure good air circulation, and apply fungicides containing sulfur or potassium bicarbonate.",
    "Cherry - Healthy": "Your cherry tree is healthy! Continue providing proper care, including regular pruning, watering, and monitoring for pests or diseases.",
    "Corn - Cercospora Leaf Spot (Gray Leaf Spot)": "Rotate crops annually, apply fungicides like strobilurins or triazoles, and ensure good field drainage and proper plant spacing.",
    "Corn - Common Rust": "Apply fungicides containing propiconazole or azoxystrobin, plant resistant corn varieties, and avoid overhead irrigation.",
    "Corn - Northern Leaf Blight": "Rotate crops, plant resistant varieties, and apply fungicides like mancozeb or strobilurin when symptoms first appear.",
    "Corn - Healthy": "Your corn plant looks healthy! Continue to monitor for any signs of disease and ensure proper spacing for airflow.",
    "Grape - Black Rot": "Remove mummified berries and infected leaves, prune for good air circulation, and apply fungicides such as myclobutanil or captan.",
    "Grape - Esca (Black Measles)": "Prune and destroy infected parts, practice proper vineyard sanitation, and avoid mechanical injuries to the vines.",
    "Grape - Leaf Blight (Isariopsis Leaf Spot)": "Remove and destroy infected leaves, apply fungicides containing copper, and ensure proper spacing for air circulation.",
    "Grape - Healthy": "Your grapevine is healthy! Maintain regular pruning, proper watering, and monitoring for pests or diseases.",
    "Orange - Huanglongbing (Citrus Greening)": "Unfortunately, there is no cure. Remove and destroy infected trees, control psyllid populations using insecticides, and plant disease-free certified saplings.",
    "Peach - Bacterial Spot": "Apply copper-based bactericides, remove and destroy infected leaves and fruit, and plant resistant peach varieties.",
    "Peach - Healthy": "Your peach tree looks healthy! Continue regular care, including pruning, fertilizing, and monitoring for pests or diseases.",
    "Pepper (Bell) - Bacterial Spot": "Apply fixed copper sprays, avoid overhead irrigation, remove infected plants, and practice crop rotation.",
    "Pepper (Bell) - Healthy": "Your bell pepper plant looks healthy! Ensure adequate sunlight, watering, and keep monitoring for any pests or diseases.",
    "Potato - Early Blight": "Remove infected leaves, apply fungicides with active ingredients like chlorothalonil, and ensure proper spacing between plants.",
    "Potato - Late Blight": "Apply fungicides like mancozeb or chlorothalonil, remove and destroy infected plants, and avoid overhead watering.",
    "Potato - Healthy": "Your potato plant looks healthy! Maintain proper watering, ensure good soil drainage, and monitor for any signs of disease.",
    "Raspberry - Healthy": "Your raspberry plant is healthy! Ensure proper support, regular pruning, and protect it from pests and harsh weather conditions.",
    "Soybean - Healthy": "Your soybean crop is healthy! Monitor regularly for any signs of disease or pests, and maintain proper crop rotation.",
    "Squash - Powdery Mildew": "Apply fungicides with sulfur or potassium bicarbonate, remove infected leaves, and ensure good air circulation.",
    "Strawberry - Leaf Scorch": "Remove infected leaves, avoid overhead watering, and apply fungicides like captan or mancozeb.",
    "Strawberry - Healthy": "Your strawberry plants are healthy! Maintain consistent watering, ensure good air circulation, and protect from frost.",
    "Tomato - Bacterial Spot": "Remove infected leaves, apply fixed copper sprays, and avoid overhead irrigation. Ensure proper plant spacing.",
    "Tomato - Early Blight": "Remove infected leaves, apply fungicides containing chlorothalonil or copper, and mulch around plants to prevent soil splashing.",
    "Tomato - Late Blight": "Apply fungicides like chlorothalonil or mancozeb, remove infected plants, and ensure proper spacing for airflow.",
    "Tomato - Leaf Mold": "Remove infected leaves, ensure proper air circulation, and apply fungicides containing chlorothalonil or copper.",
    "Tomato - Septoria Leaf Spot": "Remove and destroy infected leaves, apply fungicides like mancozeb, and avoid overhead watering.",
    "Tomato - Spider Mites (Two-Spotted Spider Mite)": "Spray the undersides of leaves with water, apply horticultural oils or insecticidal soaps, and maintain humidity around plants.",
    "Tomato - Target Spot": "Remove infected leaves, apply fungicides like chlorothalonil, and ensure proper spacing between plants for air circulation.",
    "Tomato - Tomato Yellow Leaf Curl Virus": "Remove infected plants, control whitefly populations with insecticides, and plant resistant tomato varieties.",
    "Tomato - Tomato Mosaic Virus": "Remove infected plants, sterilize tools, and avoid handling plants when wet.",
    "Tomato - Healthy": "Your tomato plant is healthy! Maintain regular watering, ensure adequate sunlight, and monitor for pests or diseases."
}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API server is running"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'status': 'error',
                'message': 'Model not loaded'
            }), 500
        
        # Check if class labels are loaded
        if not class_labels:
            return jsonify({
                'status': 'error',
                'message': 'Class labels not loaded'
            }), 500
        
        # Return success if all checks passed
        return jsonify({
            'status': 'ok',
            'message': 'API server is running',
            'version': '1.0.0',
            'modelLoaded': True,
            'classLabelsLoaded': True,
            'numClassLabels': len(class_labels)
        })
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    try:
        # Load and validate the image
        file = request.files['image']
        
        # Check file type
        filename = file.filename.lower()
        if not any(filename.endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            return jsonify({'error': 'Invalid image format. Only JPG, JPEG and PNG are supported.'}), 400
        
        # Read image file
        image_bytes = file.read()
        
        # Check file size
        if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
            return jsonify({'error': 'Image too large. Maximum size is 10MB.'}), 400
        
        # Process the image
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        except Exception as img_error:
            return jsonify({'error': f'Invalid image: {str(img_error)}'}), 400
        
        # Convert PIL Image to numpy array
        img_array = np.array(image)
        
        # Check if image is empty or corrupted
        if img_array.size == 0 or img_array.shape[0] == 0 or img_array.shape[1] == 0:
            return jsonify({'error': 'Invalid image: Image is empty or corrupted'}), 400
        
        # Preprocess image
        preprocessed_img = preprocess_image(img_array)
        
        # Check if the image is of a plant leaf
        is_leaf = getattr(preprocessed_img, 'is_leaf', True)
        logger.info(f"Image leaf detection result: {is_leaf}")
        
        # Make prediction
        disease_label, confidence = predict_disease(model, preprocessed_img, class_labels)
        
        # Format confidence as percentage
        confidence_pct = f"{confidence:.1f}%"
        
        # For non-plant images, add a special message
        if not is_leaf or "Background" in disease_label or "without Leaves" in disease_label:
            treatment = "This doesn't appear to be a plant leaf image. Please upload an image clearly showing a plant leaf for accurate disease diagnosis."
            result = f"<strong>Result:</strong> {disease_label}<br>"
            result += f"<strong>Confidence:</strong> {confidence_pct}<br><br>"
            result += f"<strong>Note:</strong><br>{treatment}"
        else:
            # Get treatment if available
            treatment = TREATMENTS.get(
                disease_label, 
                "No specific treatment information available for this condition. Consult with an agricultural expert."
            )
            
            # Format result
            result = f"<strong>Diagnosis:</strong> {disease_label.replace('_', ' ')}<br>"
            result += f"<strong>Confidence:</strong> {confidence_pct}<br><br>"
            result += f"<strong>Recommended Treatment:</strong><br>{treatment}"
        
        return jsonify({
            'result': result,
            'diagnosis': disease_label,
            'confidence': confidence,
            'treatment': treatment,
            'is_plant_leaf': is_leaf
        })
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
