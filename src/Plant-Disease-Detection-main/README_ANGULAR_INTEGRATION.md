# Plant Disease Detection Integration with Angular

This README explains how to run the plant disease detection model as part of the Angular application.

## Setup

The integration consists of two parts:
1. A Flask API server that serves the plant disease detection model
2. An Angular component that communicates with the API

## Running the Flask API Server

The API server uses Flask to serve the plant disease detection model. To run it:

1. Make sure you have the required Python packages installed:

```bash
pip install flask flask-cors pillow numpy tensorflow
```

2. Navigate to the Plant-Disease-Detection-main directory:

```bash
cd src/Plant-Disease-Detection-main
```

3. Run the API server:

```bash
python api_server.py
```

The server will start on http://localhost:5000.

## How the Integration Works

When a user clicks on the "Detect Plant Diseases" widget on the home page, a modal window opens allowing them to:

1. Upload an image of a plant leaf
2. Submit the image for analysis
3. View the detection results, including:
   - The diagnosed plant disease (or confirmation of health)
   - Confidence level of the diagnosis
   - Recommended treatment

## Technical Details

- **Frontend**: The Angular component (`PlantDiseaseDetectionComponent`) is a standalone component integrated into the home page.
- **Backend**: A Flask API server exposes an endpoint at `/predict` that accepts image uploads and returns prediction results.
- **Model**: The plant disease detection model is loaded using TensorFlow and can identify various plant diseases.

## Troubleshooting

If you encounter any issues:

- Ensure the Flask API server is running at http://localhost:5000
- Check the browser console for any errors
- Verify that the image upload format is supported (JPG, PNG)
- Ensure the python model and class_labels.json files are present in the correct location
