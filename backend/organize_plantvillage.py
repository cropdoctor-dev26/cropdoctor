from datasets import load_dataset
from pathlib import Path

print("Loading PlantVillage-full...")

ds = load_dataset(
    "geraldmc/plantvillage-full",
    split="train",
    download_mode="reuse_dataset_if_exists"
)

output_dir = Path("PlantVillage_full_organized")
output_dir.mkdir(exist_ok=True)

print("Organizing images...")

for i, item in enumerate(ds):
    image = item["image"]
    class_name = item["class_label"]

    class_dir = output_dir / class_name
    class_dir.mkdir(exist_ok=True)

    image.save(class_dir / f"image_{i}.jpg")

    if i % 1000 == 0:
        print(f"Processed {i} images")

print("DONE!")

