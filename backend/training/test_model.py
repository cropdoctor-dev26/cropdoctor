import tensorflow as tf
import json

model = tf.keras.models.load_model("training/cropdoctor_model.keras")
IMAGE_PATH = "training/aug_verticillium_(86).png"

with open("training/class_names.json", "r") as f:
    class_names = json.load(f)

print("Model loaded successfully!")
print("Number of classes:", len(class_names))
print("Classes:")

for i, name in enumerate(class_names):
    print(i, "->", name)
# -------------------------
# PREDICT TEST IMAGE
# -------------------------

img = tf.keras.utils.load_img(
    IMAGE_PATH,
    target_size=(224, 224)
)

img_array = tf.keras.utils.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

predictions = model.predict(img_array)

predicted_index = tf.argmax(predictions[0]).numpy()
predicted_class = class_names[predicted_index]
confidence = float(predictions[0][predicted_index]) * 100

print("\n==============================")
print("AI PREDICTION")
print("==============================")
print("Predicted class:", predicted_class)
print("Confidence:", round(confidence, 2), "%")