import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = r"models\wheat_disease_model.keras"

IMAGE_PATH = r"C:\Users\Anjali\Downloads\test_leaf.png"

model = tf.keras.models.load_model(MODEL_PATH)

class_names = [
    "Brown_Rust",
    "Healthy",
    "Mildew",
    "Septoria",
    "Yellow_Rust"
]

image = Image.open(IMAGE_PATH).convert("RGB")
image = image.resize((224, 224))

image_array = np.array(image) / 255.0
image_array = np.expand_dims(image_array, axis=0)

prediction = model.predict(image_array)

index = np.argmax(prediction[0])
confidence = prediction[0][index] * 100

print("Prediction:", class_names[index])
print("Confidence:", round(confidence, 2), "%")