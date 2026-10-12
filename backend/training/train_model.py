 from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import tensorflow as tf
import numpy as np
import json
import os

# -------------------------
# PATHS
# -------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "Training",
    "cropdoctor_model.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "Training",
    "class_names.json"
)

# -------------------------
# LOAD AI MODEL
# -------------------------

MODEL = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

print("AI model loaded successfully!")
print("Number of classes:", len(CLASS_NAMES))

# -------------------------
# PREDICTION
# -------------------------

def predict_image(image):

    image = image.resize((224, 224))

    img_array = np.array(image, dtype=np.float32)

    img_array = np.expand_dims(img_array, axis=0)

    # Same preprocessing used during training
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(
        img_array
    )

    predictions = MODEL.predict(img_array, verbose=0)

    predicted_index = int(np.argmax(predictions[0]))

    predicted_class = CLASS_NAMES[predicted_index]

    confidence = float(
        predictions[0][predicted_index]
    ) * 100

    return predicted_class, confidence


# -------------------------
# FASTAPI
# -------------------------

app = FastAPI(
    title="CropDoctor API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# HOME
# -------------------------

@app.get("/")
def home():
    return {
        "message": "CropDoctor Backend is running!",
        "model_loaded": True,
        "classes": len(CLASS_NAMES)
    }


# -------------------------
# ANALYZE CROP
# -------------------------

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        predicted_class, confidence = predict_image(image)

        return {
            "success": True,
            "prediction": predicted_class,
            "confidence": round(confidence, 2)
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


# -------------------------
# UPLOAD IMAGE
# -------------------------

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    contents = await file.read()

    with open(file.filename, "wb") as f:
        f.write(contents)

    return {
        "filename": file.filename,
        "message": "Image uploaded and saved successfully"
    }