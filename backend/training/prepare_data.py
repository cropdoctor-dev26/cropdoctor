import os
import shutil

# Your main dataset location
DATASET_DIR = r"C:\Users\Anjali\Downloads\CropDoctor_Dataset"

# PlantVillage organized folder
PLANTVILLAGE_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "PlantVillage_full_organized"
)

# Where cleaned training data will be created
OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "processed_data"
)

# Start fresh
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)

os.makedirs(OUTPUT_DIR)

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def copy_images(source_folder, class_name):
    if not os.path.exists(source_folder):
        print(f"NOT FOUND: {source_folder}")
        return

    destination = os.path.join(OUTPUT_DIR, class_name)
    os.makedirs(destination, exist_ok=True)

    count = 0

    for root, _, files in os.walk(source_folder):
        for file in files:
            if file.lower().endswith(IMAGE_EXTENSIONS):
                source = os.path.join(root, file)

                new_name = f"{class_name}_{count}{os.path.splitext(file)[1]}"
                target = os.path.join(destination, new_name)

                shutil.copy2(source, target)
                count += 1

    print(f"{class_name}: {count} images copied")


# =========================
# COTTON
# =========================

cotton_folder = os.path.join(
    DATASET_DIR,
    "Cotton",
    "Cotton_Augmented_Dataset"
)

cotton_classes = {
    "aug_Alternaria_Leaf": "cotton_alternaria_leaf",
    "aug_Bacterial_Blight": "cotton_bacterial_blight",
    "aug_Fusarium_Wilt": "cotton_fusarium_wilt",
    "aug_Healthy_Leaf": "cotton_healthy",
    "aug_Verticillium_Wilt": "cotton_verticillium_wilt",
}

for folder, class_name in cotton_classes.items():
    copy_images(
        os.path.join(cotton_folder, folder),
        class_name
    )


# =========================
# RICE
# =========================

rice_folder = os.path.join(DATASET_DIR, "Rice","Rice")

copy_images(
    os.path.join(rice_folder, "Healthy"),
    "rice_healthy"
)

rice_disease_folder = os.path.join(rice_folder, "Disease")

if os.path.exists(rice_disease_folder):
    for disease in os.listdir(rice_disease_folder):
        path = os.path.join(rice_disease_folder, disease)

        if os.path.isdir(path):
            copy_images(
                path,
                "rice_" + disease.lower().replace(" ", "_")
            )

rice_pest_folder = os.path.join(rice_folder, "Insect Pests")

if os.path.exists(rice_pest_folder):
    for pest in os.listdir(rice_pest_folder):
        path = os.path.join(rice_pest_folder, pest)

        if os.path.isdir(path):
            copy_images(
                path,
                "rice_" + pest.lower().replace(" ", "_")
            )


# =========================
# MAIZE
# =========================

maize_folder = os.path.join(DATASET_DIR, "Maize","Maize")

copy_images(
    os.path.join(maize_folder, "Healthy"),
    "maize_healthy"
)

maize_disease_folder = os.path.join(maize_folder, "Disease")

if os.path.exists(maize_disease_folder):
    for disease in os.listdir(maize_disease_folder):
        path = os.path.join(maize_disease_folder, disease)

        if os.path.isdir(path):
            copy_images(
                path,
                "maize_" + disease.lower().replace(" ", "_")
            )

maize_pest_folder = os.path.join(maize_folder, "Insect Pests")

if os.path.exists(maize_pest_folder):
    for pest in os.listdir(maize_pest_folder):
        path = os.path.join(maize_pest_folder, pest)

        if os.path.isdir(path):
            copy_images(
                path,
                "maize_" + pest.lower().replace(" ", "_")
            )


# =========================
# PLANTVILLAGE
# =========================

print("\nAdding PlantVillage...")

if os.path.exists(PLANTVILLAGE_DIR):

    for class_folder in os.listdir(PLANTVILLAGE_DIR):

        source = os.path.join(
            PLANTVILLAGE_DIR,
            class_folder
        )

        if os.path.isdir(source):

            # Make PlantVillage class names safe for our model
            class_name = (
                "plantvillage_"
                + class_folder.lower()
                .replace("___", "_")
                .replace(" ", "_")
            )

            copy_images(source, class_name)

else:
    print("ERROR: PlantVillage_full_organized folder not found!")
    print(PLANTVILLAGE_DIR)


# =========================
# COMPLETE
# =========================

print("\nDATA PREPARATION COMPLETE!")
print("Processed data location:")
print(OUTPUT_DIR)