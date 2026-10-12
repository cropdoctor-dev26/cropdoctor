import os
import shutil

# CHANGE ONLY THIS PATH to your 2023 Plant Path 999 photos folder
SOURCE = r"C:\Users\Anjali\Downloads\Long 2023 Plant Path 999 photos"
OUTPUT = r"C:\Users\Anjali\cropdoctor\backend\dataset\Wheat"

classes = {
    "yellowrust": "Yellow_Rust",
    "brownrust": "Brown_Rust",
    "healthy": "Healthy",
    "mildew": "Mildew",
    "septoria": "Septoria"
}

for folder in classes.values():
    os.makedirs(os.path.join(OUTPUT, folder), exist_ok=True)

count = 0

for filename in os.listdir(SOURCE):
    lower_name = filename.lower()

    for keyword, folder in classes.items():
        if lower_name.startswith(keyword):
            source_file = os.path.join(SOURCE, filename)
            destination = os.path.join(OUTPUT, folder, filename)

            shutil.copy2(source_file, destination)
            count += 1
            break

print("Done!")
print("Images sorted:", count)
print("Dataset location:", OUTPUT)