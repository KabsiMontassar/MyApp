import os
import tensorflow as tf
import numpy as np
import cv2
import logging
import timm
from PIL import ImageEnhance, ImageFilter

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_model(model_path):
    """
    Load the plant disease detection model
    
    Args:
        model_path: Path to the .h5 model file or a model name from Hugging Face Hub
        
    Returns:
        Loaded TensorFlow model
    """
    try:
        logger.info(f"Loading model from {model_path}")
        
        # Set memory growth to prevent TF from allocating all GPU memory at once
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logger.info(f"Found {len(gpus)} GPU(s), memory growth set")
            except RuntimeError as e:
                logger.warning(f"Memory growth setting failed: {e}")
        
        # Try different loading strategies
        if isinstance(model_path, str) and os.path.exists(model_path) and model_path.endswith('.h5'):
            # Local .h5 file
            if not os.path.exists(model_path):
                error_msg = f"Model file not found at {model_path}"
                logger.error(error_msg)
                raise FileNotFoundError(error_msg)
            
            model = tf.keras.models.load_model(model_path, compile=False)
            logger.info(f"Model loaded successfully from local file. Input shape: {model.input_shape}")
        elif isinstance(model_path, str) and ('/' in model_path or model_path.startswith('@')):
            # Try loading from Hugging Face Hub
            try:
                import timm
                model = timm.create_model(model_path, pretrained=True)
                logger.info(f"Model loaded successfully from Hugging Face Hub")
            except Exception as hub_error:
                logger.error(f"Failed to load from Hugging Face: {str(hub_error)}")
                raise
        else:
            # Already a model object
            model = model_path
            logger.info(f"Using provided model object")
            
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def is_plant_leaf_image(image, threshold=0.3):
    """
    Check if the image likely contains a plant leaf
    
    Args:
        image: Input image (numpy array)
        threshold: Green color threshold
        
    Returns:
        Boolean indicating if image likely contains a plant leaf
    """
    try:
        # Create a mask for green color
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        
        # Green range in HSV
        lower_green = np.array([25, 40, 40])
        upper_green = np.array([100, 255, 255])
        
        # Create a mask
        mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Calculate percentage of green pixels
        green_pixel_ratio = np.sum(mask > 0) / (image.shape[0] * image.shape[1])
        
        # Check edges - leaves typically have distinct edges
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        edge_ratio = np.sum(edges > 0) / (image.shape[0] * image.shape[1])
        
        logger.info(f"Green pixel ratio: {green_pixel_ratio:.4f}, Edge ratio: {edge_ratio:.4f}")
        
        # Return True if the green ratio is above threshold and has sufficient edges
        return green_pixel_ratio > threshold and edge_ratio > 0.01
    except Exception as e:
        logger.error(f"Error in leaf detection: {str(e)}")
        return True  # Default to true in case of errors to not block processing

def enhance_leaf_image(image):
    """
    Enhance the leaf image for better feature extraction
    
    Args:
        image: PIL Image object
        
    Returns:
        Enhanced PIL Image
    """
    try:
        # Convert to PIL if numpy array
        if isinstance(image, np.ndarray):
            from PIL import Image
            image = Image.fromarray(image.astype('uint8'))
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.3)
        
        # Enhance color
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.2)
        
        # Sharpen
        image = image.filter(ImageFilter.SHARPEN)
        
        return np.array(image)
    except Exception as e:
        logger.warning(f"Image enhancement failed: {str(e)}")
        # Return original if enhancement fails
        if isinstance(image, np.ndarray):
            return image
        else:
            return np.array(image)

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocess the image for model input
    
    Args:
        image: Input image (numpy array from OpenCV)
        target_size: Target size for model input (default: 224x224)
        
    Returns:
        Preprocessed image ready for model input
    """
    try:
        # Convert BGR to RGB if from OpenCV
        if len(image.shape) == 3 and image.shape[2] == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Check if the image is a plant leaf
        is_leaf = is_plant_leaf_image(image)
        
        # Store original image for reference
        original_image = image.copy()
        
        if is_leaf:
            # Enhance leaf features if it's a plant leaf
            image = enhance_leaf_image(image)
        
        # Resize image
        image_resized = cv2.resize(image, target_size)
        
        # Convert to float and normalize
        image_normalized = image_resized.astype(np.float32) / 255.0
        
        # Expand dimensions to create batch
        image_batch = np.expand_dims(image_normalized, axis=0)
        
        # Attach metadata to the batch (using a custom attribute)
        setattr(image_batch, 'is_leaf', is_leaf)
        
        logger.info(f"Image preprocessed successfully. Is leaf: {is_leaf}")
        return image_batch
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def predict_disease(model, preprocessed_image, class_labels):
    """
    Predict disease from preprocessed image
    
    Args:
        model: Loaded TensorFlow model
        preprocessed_image: Preprocessed image batch
        class_labels: Dictionary mapping class indices to labels
        
    Returns:
        Tuple of (predicted disease label, confidence percentage)
    """
    try:
        # Check if the image contains a leaf
        # This attribute is set during preprocessing
        is_leaf = getattr(preprocessed_image, 'is_leaf', True)
        
        if not is_leaf:
            # Return the "Background without Leaves" class directly
            # Find the index of this class or use a safe default
            background_idx = None
            for idx, label in class_labels.items():
                if "Background" in label or "without Leaves" in label:
                    background_idx = idx
                    break
            
            if background_idx:
                return class_labels[background_idx], 100.0
            else:
                # Use a safe default if we can't find the background class
                return "Background without Leaves", 100.0
        
        # Make prediction for leaf images
        predictions = model.predict(preprocessed_image)
        
        # Get the predicted class index
        predicted_class_idx = np.argmax(predictions[0])
        
        # Get confidence score
        confidence = float(predictions[0][predicted_class_idx] * 100)
        
        # Convert to label
        label = class_labels.get(str(predicted_class_idx), f"Unknown class {predicted_class_idx}")
        
        return label, confidence
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        raise
