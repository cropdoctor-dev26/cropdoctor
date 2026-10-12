const diseaseInfo = new Proxy({}, {
  get: function (target, key) {
    if (typeof key !== "string") return undefined;

    const name = key
      .replace(/___/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const lower = name.toLowerCase();

    // Crop name
    const crop = name.split(" ")[0];

    // Healthy crop
    if (lower.includes("healthy")) {
      return {
        crop: crop,
        disease: "Healthy",
        symptoms:
          "No major disease symptoms are indicated by the AI prediction. The plant appears healthy.",
        causes:
          "No disease was detected in the submitted image.",
        treatment:
          "No disease treatment is required. Continue normal crop care.",
        tips:
          "Maintain proper watering, nutrition, sunlight, field hygiene, and regularly monitor the plant for changes."
      };
    }

    // Apple Scab
    if (lower.includes("apple scab")) {
      return {
        crop: "Apple",
        disease: "Apple Scab",
        symptoms:
          "Olive-green to brown spots may appear on leaves and fruit. Severe infection can cause leaf drop and distorted fruit.",
        causes:
          "Apple scab is caused by a fungal pathogen and is favored by cool, wet and humid conditions.",
        treatment:
          "Remove infected fallen leaves and follow locally recommended fungicide management practices.",
        tips:
          "Keep the orchard clean, improve air circulation, remove infected material, and monitor during wet weather."
      };
    }

    // Black Rot
    if (lower.includes("black rot")) {
      return {
        crop: crop,
        disease: "Black Rot",
        symptoms:
          "Dark brown or black lesions may develop on leaves, stems, or fruit. Infected fruit can eventually shrivel.",
        causes:
          "Black rot is generally caused by fungal infection and can spread under warm, wet conditions.",
        treatment:
          "Remove affected plant material and follow locally recommended disease-management practices.",
        tips:
          "Avoid prolonged leaf wetness, remove infected debris, improve air circulation, and monitor the crop regularly."
      };
    }

    // Bacterial Blight / Bacterial Spot
    if (
      lower.includes("bacterial blight") ||
      lower.includes("bacterial spot")
    ) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Water-soaked or dark spots may appear on leaves, stems, or fruit. Lesions can enlarge and cause yellowing or leaf damage.",
        causes:
          "The disease is caused by bacterial pathogens and can spread through infected plant material, water splash, and wet conditions.",
        treatment:
          "Remove severely affected material where practical and follow locally recommended bacterial-disease management practices.",
        tips:
          "Avoid overhead watering, use clean planting material, maintain field hygiene, and avoid working with plants when foliage is wet."
      };
    }

    // Powdery Mildew
    if (lower.includes("powdery mildew")) {
      return {
        crop: crop,
        disease: "Powdery Mildew",
        symptoms:
          "White or gray powder-like growth may appear on leaves, shoots, or other plant surfaces. Leaves may curl or become distorted.",
        causes:
          "Powdery mildew is caused by fungal pathogens and is favored by humid conditions and poor air circulation.",
        treatment:
          "Remove severely affected plant material where practical and use locally recommended fungicide or cultural-management practices.",
        tips:
          "Improve air circulation, avoid excessive humidity around foliage, remove infected material, and monitor new growth."
      };
    }

    // Rust
    if (lower.includes("rust")) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Rust-colored, orange, brown, or reddish powdery spots may appear on leaves. Severe infection can reduce healthy leaf area.",
        causes:
          "Rust diseases are caused by fungal pathogens and can spread rapidly under favorable humid conditions.",
        treatment:
          "Remove severely infected material where practical and follow locally recommended fungicide practices.",
        tips:
          "Maintain good air circulation, avoid prolonged leaf wetness, remove infected debris, and monitor the crop regularly."
      };
    }

    // Leaf Blight
    if (
      lower.includes("leaf blight") ||
      lower.includes("northern leaf blight") ||
      lower.includes("maydis") ||
      lower.includes("turcicum")
    ) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Elongated or irregular brown, tan, or gray lesions may develop on leaves. Severe infection can cause extensive leaf drying.",
        causes:
          "Leaf blight is commonly associated with fungal pathogens and can spread under warm, humid or wet conditions.",
        treatment:
          "Remove infected crop residue where practical and follow locally recommended fungicide and crop-management practices.",
        tips:
          "Use healthy planting material, rotate crops where appropriate, manage crop residue, and monitor leaves regularly."
      };
    }

    // Wilt
    if (lower.includes("wilt")) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Leaves may wilt, yellow, droop, or dry even when soil moisture is adequate. In some cases, vascular discoloration may occur.",
        causes:
          "Wilt diseases can be caused by soil-borne fungal or other pathogens that interfere with water movement inside the plant.",
        treatment:
          "Remove severely affected plants where practical and follow locally recommended disease-management practices. Avoid spreading contaminated soil or plant material.",
        tips:
          "Use healthy planting material, maintain field hygiene, rotate crops where appropriate, and monitor plants for early wilting."
      };
    }

    // False Smut
    if (lower.includes("false smut")) {
      return {
        crop: "Rice",
        disease: "False Smut",
        symptoms:
          "Individual rice grains may be replaced by yellowish-green to orange fungal balls that later become darker.",
        causes:
          "False smut is caused by a fungal pathogen and is favored by humid conditions during crop flowering and grain development.",
        treatment:
          "Remove affected material where practical and follow locally recommended fungicide-management practices.",
        tips:
          "Use balanced fertilizer, avoid excessive nitrogen, maintain suitable field conditions, and monitor the crop around flowering."
      };
    }

    // Leaf Spot
    if (
      lower.includes("leaf spot") ||
      lower.includes("cercospora") ||
      lower.includes("alternaria") ||
      lower.includes("curvularia")
    ) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Small brown, dark, tan, or irregular spots may appear on leaves. Spots can enlarge and merge, causing leaf yellowing or drying.",
        causes:
          "Leaf-spot diseases are commonly associated with fungal pathogens and can spread under humid or wet conditions.",
        treatment:
          "Remove severely affected plant material where practical and follow locally recommended fungicide-management practices.",
        tips:
          "Maintain field hygiene, avoid prolonged leaf wetness, provide good air circulation, and monitor new leaves regularly."
      };
    }

    // Downy Mildew
    if (lower.includes("downy mildew")) {
      return {
        crop: crop,
        disease: name,
        symptoms:
          "Yellow, pale, or irregular patches may develop on leaves, sometimes with fuzzy growth on the underside under humid conditions.",
        causes:
          "Downy mildew is caused by oomycete pathogens and is favored by cool or humid conditions and prolonged leaf wetness.",
        treatment:
          "Remove severely affected material where practical and follow locally recommended disease-management practices.",
        tips:
          "Improve air circulation, reduce prolonged leaf wetness, avoid excessive irrigation, and monitor the crop closely."
      };
    }

    // Esca / Black Measles
    if (lower.includes("esca") || lower.includes("black measles")) {
      return {
        crop: crop,
        disease: "Esca (Black Measles)",
        symptoms:
          "Leaves may develop yellow or brown areas with characteristic spotting, while fruit may show dark spots or poor development.",
        causes:
          "Esca is associated with fungal pathogens affecting grapevine wood and can become more noticeable as vines age.",
        treatment:
          "Remove severely affected plant material where practical and follow locally recommended vineyard disease-management practices.",
        tips:
          "Use healthy planting material, protect pruning wounds where recommended, remove severely affected wood, and monitor vines regularly."
      };
    }

    // Generic fallback — still gives useful information
    return {
      crop: crop || "Unknown Crop",
      disease: name || "Unknown Condition",
      symptoms:
        `${name} has been detected by the AI model. Look for abnormal leaf spots, discoloration, wilting, lesions, damaged fruit, or unusual growth on the plant.`,
      causes:
        `${name} may be associated with a plant disease caused by fungal, bacterial, viral, environmental, or other factors. The exact cause should be confirmed using agricultural guidance.`,
      treatment:
        `Management depends on the specific disease. Remove severely affected material where appropriate and follow locally recommended treatment practices for ${name}.`,
      tips:
        "Monitor the crop regularly, maintain good field hygiene, use healthy planting material, avoid unnecessary leaf wetness, and follow recommended crop-management practices."
    };
  }
});

export default diseaseInfo;