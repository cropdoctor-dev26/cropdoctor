from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import tensorflow as tf
import numpy as np
import json 
import sqlite3

from datetime import datetime
MODEL = tf.keras.models.load_model("training/cropdoctor_model.keras")

with open("training/class_names.json", "r") as f:
    CLASS_NAMES = json.load(f)

print("AI model loaded successfully!")
def predict_image(image):
    image = image.resize((224, 224))
    
    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = MODEL.predict(img_array, verbose=0)

    predicted_index = np.argmax(predictions[0])
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(predictions[0][predicted_index]) * 100

    return predicted_class, confidence
model = MODEL

class_names = [
    "Brown_Rust",
    "Healthy",
    "Mildew",
    "Septoria",
    "Yellow_Rust"
]
DB_NAME = "cropdoctor.db"

def create_database():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS diagnosis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prediction TEXT,
        confidence REAL,
        date_time TEXT
    )
    """)

    conn.commit()
    conn.close()

create_database()

app = FastAPI()
 
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:4174",
        "https://cropdoctor-git-main-cropdoctor-team.vercel.app",
        "https://cropdoctor-4jfn0wymd-cropdoctor-team.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "CropDoctor Backend is running!"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    try:
        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert("RGB")

        predicted_class, confidence = predict_image(image)
        conn = sqlite3.connect(DB_NAME)

        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO diagnosis_history
        (prediction, confidence, date_time)
        VALUES (?, ?, ?)
        """, (
        predicted_class,
        round(confidence, 2),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
      ))

        conn.commit()

        conn.close()

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
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()

    with open(file.filename, "wb") as f:
        f.write(contents)

    return {
        "filename": file.filename,
        "message": "Image uploaded and saved successfully"
    }
@app.get("/history")
def get_history():
    conn = sqlite3.connect("cropdoctor.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, prediction, confidence, date_time
        FROM diagnosis_history
        ORDER BY id DESC
    """)

    history = cursor.fetchall()
    conn.close()

    return {
        "history": [
            {
                "id": row[0],
                "prediction": row[1],
                "confidence": row[2],
                "date_time": row[3]
            }
            for row in history
        ]
    }

@app.delete("/history")
def delete_history():
    conn = sqlite3.connect(DB_NAME)

    try:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM diagnosis_history")
        deleted_count = cursor.fetchone()[0]

        cursor.execute("DELETE FROM diagnosis_history")
        conn.commit()

        return {
            "success": True,
            "deleted_count": deleted_count,
            "message": "Diagnosis history cleared successfully."
        }

    except Exception as e:
        conn.rollback()
        return {
            "success": False,
            "error": str(e)
        }

    finally:
        conn.close()

@app.delete("/history/{diagnosis_id}")
def delete_single_history(diagnosis_id: int):
    conn = sqlite3.connect(DB_NAME)

    try:
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM diagnosis_history WHERE id = ?",
            (diagnosis_id,)
        )

        deleted_count = cursor.rowcount
        conn.commit()

        if deleted_count == 0:
            return {
                "success": False,
                "message": "Diagnosis not found."
            }

        return {
            "success": True,
            "message": "Diagnosis deleted successfully."
        }

    except Exception as e:
        conn.rollback()
        return {
            "success": False,
            "error": str(e)
        }

    finally:
        conn.close()
