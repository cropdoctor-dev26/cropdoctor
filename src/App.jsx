import { useState } from "react";
import diseaseInfo from "./diseaseInfo";
function App() {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState("home");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
 const getWeather = () => {
  if (!navigator.geolocation) {
    alert("Location is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
        );

        if (!response.ok) {
          throw new Error("Weather request failed.");
        }

        const data = await response.json();
        setWeather(data.current);
      } catch (error) {
        console.error("Weather error:", error);
        alert("Could not fetch weather. Please try again.");
      }
    },
    (error) => {
      console.error("Location error:", error);
      alert(
        "Location access was denied or unavailable. Please allow location access and try again."
      );
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
};
 
const getHistory = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/history");
    const data = await response.json();

    setHistory(Array.isArray(data) ? data : data.history || []);
    setPage("history");
  } catch (error) {
    console.error(error);
    alert("Could not load diagnosis history.Check the backend.");
  }
};

const deleteHistory = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete all diagnosis history? This cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/history",
      { method: "DELETE" }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to delete history.");
    }

    setHistory([]);
    alert("Diagnosis history deleted successfully.");
  } catch (error) {
    console.error(error);
    alert("Could not delete diagnosis history.");
  }
};
 const deleteSingleDiagnosis = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this diagnosis?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/history/${id}`,
      { method: "DELETE" }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || data.message || "Failed to delete diagnosis."
      );
    }

    setHistory((previousHistory) =>
      previousHistory.filter((item) => item.id !== id)
    );

    alert("Diagnosis deleted successfully.");
  } catch (error) {
    console.error("Individual diagnosis deletion failed:", error);
    alert("Could not delete this diagnosis. Please check the backend.");
  }
};



  // -------------------------
  // SELECT IMAGE
  // -------------------------

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setImage(URL.createObjectURL(file));
    setResult(null);
  };

  // -------------------------
  // SEND IMAGE TO AI BACKEND
  // -------------------------

  const analyzeCrop = async () => {
    if (!selectedFile) {
      alert("Please select a crop image first.");
      return;
    }

    setScanning(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const info = diseaseInfo[data.prediction];
      console.log("PREDICTION:", data.prediction);
      console.log("DISEASE INFO:", info);

      setResult({
      ...data,
      info: info
    });

    setPage("result");

    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        error: "Could not connect to CropDoctor backend."
      });

      setPage("result");

    } finally {
      setScanning(false);
    }
  };
  // -------------------------
// HISTORY
// -------------------------

const filteredHistory = history.filter((item) => {
  const search = historySearch.toLowerCase();

  return (
    String(item.id).includes(search) ||
    String(item.prediction || "").toLowerCase().includes(search) ||
    String(item.confidence ?? "").includes(search) ||
    String(item.date_time || "").toLowerCase().includes(search)
  );
});


if (page === "history") {
  return (
    <div className="history-page">
      <header className="history-header">
        <span className="history-icon">📋</span>
        <h1>Diagnosis History</h1>
        <p>Every scan, one place. Track your plants' health.</p>
      </header>

      <section className="history-banner">
        <div>
          <h2>Your Plant Health Records 🌱</h2>
          <p>Review your previous AI diagnoses and confidence scores.</p>
        </div>
        <div className="history-count">
          <span>{history.length}</span>
          <small>Total Scans</small>
        </div>
      </section>

      <input
        className="history-search"
        type="text"
        placeholder="🔍 Search disease, ID, confidence or date..."
        value={historySearch}
        onChange={(e) => setHistorySearch(e.target.value)}
      />

      {history.length === 0 ? (
        <div className="history-empty">
          <span>🌿</span>
          <h2>No Diagnosis History Yet</h2>
          <p>Scan a plant to see your AI diagnosis records here.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="history-empty">
          <span>🔎</span>
          <h2>No Matching Records</h2>
          <p>Try another disease name, ID, confidence or date.</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item) => (
            <article className="history-card" key={item.id}>
              <div className="history-card-top">
                <div className="history-plant-icon">🌿</div>
                <div className="history-diagnosis">
                  <h3>
                    {String(item.prediction || "Unknown")
                      .replaceAll("_", " ")}
                  </h3>
                  <p>Diagnosis ID: #{item.id}</p>
                </div>
              </div>

              <div className="history-details">
                <div className="history-detail">
                  <span>🎯 Confidence</span>
                  <strong>{item.confidence}%</strong>
                </div>
                <div className="history-detail">
                  <span>🕒 Date & Time</span>
                  <strong>{item.date_time || "Not available"}</strong>
                </div>
              </div>

              <button
                className="history-delete-one"
                onClick={() => deleteSingleDiagnosis(item.id)}
              >
                🗑️ Delete This Diagnosis
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="history-actions">
        <button
          className="history-delete-all"
          onClick={deleteHistory}
          disabled={history.length === 0}
        >
          🗑️ Delete All History
        </button>

        <button
          className="history-back"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>
      </div>

      <p className="history-footer">
        🌱 CropDoctor — Growing a healthier tomorrow.
      </p>
    </div>
  );
}


  // -------------------------
  // MY CROPS
  // -------------------------

 
if (page === "crops") {
  return (
    <div className="crops-page">
      <div className="crops-header">
        <div>
          <p className="crops-tag">🌿 YOUR FARM DASHBOARD</p>
          <h1>🌱 My Crops</h1>
          <p className="crops-subtitle">
            Manage and monitor your crops with CropDoctor.
          </p>
        </div>
      </div>

      <div className="crops-banner">
        <div>
          <h2>Your crops, healthier future 💚</h2>
          <p>
            Monitor crop health and use AI disease analysis
            to help care for your plants.
          </p>
        </div>
        <div className="crops-banner-icon">🌾</div>
      </div>

      <div className="crops-grid">
        <div className="crop-card">
          <div className="crop-card-icon">🌾</div>
          <p className="crop-card-label">CROP COLLECTION</p>
          <h2>Multiple Crops</h2>
          <p>
            Upload a leaf image to analyze the crop and
            identify possible diseases.
          </p>
        </div>

        <div className="crop-card">
          <div className="crop-card-icon">💚</div>
          <p className="crop-card-label">CROP HEALTH</p>
          <h2>AI Monitoring</h2>
          <p>
            Use the AI Diagnosis feature to check plant
            health and view the prediction results.
          </p>
        </div>

        <div className="crop-card">
          <div className="crop-card-icon">🌤️</div>
          <p className="crop-card-label">SMART FARMING</p>
          <h2>Weather Insights</h2>
          <p>
            Check local weather conditions to help plan
            your farming activities.
          </p>
        </div>
      </div>

      <div className="crops-note">
        <span>🌿</span>
        <div>
          <h3>Care starts with observation</h3>
          <p>
            Regularly inspect your leaves and use CropDoctor
            when you notice unusual spots or color changes.
          </p>
        </div>
      </div>

      <button
        className="crops-back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}


  // -------------------------
  // DISEASES
  // -------------------------

   
if (page === "diseases") {
  return (
    <div className="diseases-page">
      <div className="diseases-header">
        <p className="diseases-tag">🌿 CROP HEALTH LIBRARY</p>
        <h1>🦠 Crop Diseases</h1>
        <p>
          Learn about common crop diseases and understand
          how to protect your plants.
        </p>
      </div>

      <div className="diseases-banner">
        <div>
          <h2>Healthy crops, better harvests 💚</h2>
          <p>
            Recognizing leaf changes early can help you take
            appropriate action to protect your crops.
          </p>
        </div>
        <span>🌾</span>
      </div>

      <div className="diseases-grid">
        <div className="disease-card">
          <div className="disease-icon">🍂</div>
          <span className="disease-label">LEAF DISEASE</span>
          <h2>Brown Spot</h2>
          <p>
            Often appears as brown spots on leaves.
            Observe the affected area and monitor changes.
          </p>
          <div className="disease-tip">
            🌱 Tip: Avoid unnecessary leaf wetness and
            inspect affected plants regularly.
          </div>
        </div>

        <div className="disease-card">
          <div className="disease-icon">🟠</div>
          <span className="disease-label">FUNGAL DISEASE</span>
          <h2>Rust</h2>
          <p>
            Rust diseases can cause orange, reddish or
            brown powdery spots on plant leaves.
          </p>
          <div className="disease-tip">
            🌱 Tip: Check both sides of the leaves and
            seek crop-specific treatment advice.
          </div>
        </div>

        <div className="disease-card">
          <div className="disease-icon">🌿</div>
          <span className="disease-label">FUNGAL DISEASE</span>
          <h2>Mildew</h2>
          <p>
            Some mildew diseases produce a white or
            grayish coating on plant surfaces.
          </p>
          <div className="disease-tip">
            🌱 Tip: Provide suitable airflow and avoid
            excessive moisture where appropriate.
          </div>
        </div>

        <div className="disease-card">
          <div className="disease-icon">💚</div>
          <span className="disease-label">PLANT CONDITION</span>
          <h2>Healthy</h2>
          <p>
            Healthy-looking leaves generally have
            consistent color and no obvious disease spots.
          </p>
          <div className="disease-tip">
            🌱 Tip: Continue regular monitoring and
            provide suitable water and nutrients.
          </div>
        </div>
      </div>

      <div className="diseases-reminder">
        <span>🔍</span>
        <div>
          <h3>Not sure what is affecting your crop?</h3>
          <p>
            Use the AI diagnosis feature to analyze a leaf
            image. Predictions are estimates, so confirm
            important treatment decisions with a qualified
            agricultural expert.
          </p>
        </div>
      </div>

      <button
        className="diseases-back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}


  // -------------------------
  // WEATHER
  // -------------------------

  
if (page === "weather") {
  return (
    <div className="weather-page">
      <div className="weather-header">
        <p className="weather-tag">🌿 SMART FARMING</p>
        <h1>☀️ Crop Weather</h1>
        <p>
          Stay updated with weather conditions to help
          care for your crops.
        </p>
      </div>

      <div className="weather-banner">
        <div>
          <h2>Weather for healthier crops 💚</h2>
          <p>
            Check temperature, humidity and weather
            conditions before planning farm activities.
          </p>
        </div>
        <span>🌤️</span>
      </div>

      <div className="weather-panel">
        <div className="weather-panel-heading">
          <span className="weather-sun-icon">🌤️</span>
          <div>
            <h2>Today's Weather</h2>
            <p>Your latest available weather information</p>
          </div>
        </div>

        {weather ? (
          <>
            <div className="weather-stats">
              <div className="weather-stat-card">
                <span>🌡️</span>
                <p>TEMPERATURE</p>
                <h3>{weather.temperature_2m}°C</h3>
              </div>

              <div className="weather-stat-card">
                <span>💧</span>
                <p>HUMIDITY</p>
                <h3>{weather.relative_humidity_2m}%</h3>
              </div>

              <div className="weather-stat-card">
                <span>🌦️</span>
                <p>WEATHER CODE</p>
                <h3>{weather.weather_code}</h3>
              </div>
            </div>

            <p className="weather-data-note">
              Weather code represents a weather condition.
              Its meaning depends on the weather service's
              code definitions.
            </p>
          </>
        ) : (
          <div className="weather-empty">
            <span>🌦️</span>
            <h3>Ready to check the weather?</h3>
            <p>
              Get the latest weather data available from
              your existing weather feature.
            </p>
          </div>
        )}

        <button
          className="weather-refresh-button"
          onClick={getWeather}
        >
          🌦️ Get Live Weather
        </button>
      </div>

      <div className="weather-tip">
        <span>🌱</span>
        <div>
          <h3>Smart Farming Tip</h3>
          <p>
            Consider temperature, humidity and local
            forecasts when planning watering and other
            farming activities.
          </p>
        </div>
      </div>

      <button
        className="weather-back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}


  // -------------------------
  // TIPS
  // -------------------------

  
if (page === "tips") {
  return (
    <div className="tips-page">
      <div className="tips-header">
        <p className="tips-tag">🌱 YOUR FARMING GUIDE</p>
        <h1>💡 Farming Tips</h1>
        <p>
          Simple everyday practices for healthier crops
          and better farm care.
        </p>
      </div>

      <div className="tips-banner">
        <div>
          <h2>Small steps, healthier crops 💚</h2>
          <p>
            Follow good farming practices, observe your
            plants and respond to problems early.
          </p>
        </div>
        <span>🌾</span>
      </div>

      <div className="tips-grid">
        <div className="tip-card">
          <div className="tip-icon">💧</div>
          <span className="tip-label">WATER MANAGEMENT</span>
          <h2>Water Wisely</h2>
          <p>
            Water your crops according to their needs,
            soil conditions and the weather.
          </p>
          <div className="tip-footer">
            🌿 Check soil moisture before watering.
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">☀️</div>
          <span className="tip-label">SUNLIGHT</span>
          <h2>Provide Enough Light</h2>
          <p>
            Make sure your crops receive the sunlight
            appropriate for their species and growth stage.
          </p>
          <div className="tip-footer">
            🌿 Follow crop-specific sunlight requirements.
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🍃</div>
          <span className="tip-label">PLANT CARE</span>
          <h2>Inspect Your Leaves</h2>
          <p>
            Check for unusual spots, yellowing, wilting
            and other changes in your plants.
          </p>
          <div className="tip-footer">
            🌿 Remove diseased leaves when appropriate.
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🔍</div>
          <span className="tip-label">DISEASE PREVENTION</span>
          <h2>Monitor Crop Health</h2>
          <p>
            Inspect plants regularly to notice possible
            pest damage or disease symptoms early.
          </p>
          <div className="tip-footer">
            🌿 Use AI diagnosis as a helpful first check.
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🌱</div>
          <span className="tip-label">SOIL CARE</span>
          <h2>Care for Your Soil</h2>
          <p>
            Maintain soil health with suitable nutrients
            and practices for your particular crop.
          </p>
          <div className="tip-footer">
            🌿 Avoid applying fertilizer without a need.
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🌤️</div>
          <span className="tip-label">WEATHER AWARENESS</span>
          <h2>Plan Around Weather</h2>
          <p>
            Consider upcoming rain, heat and humidity
            when planning farm activities.
          </p>
          <div className="tip-footer">
            🌿 Check CropDoctor's Weather page.
          </div>
        </div>
      </div>

      <div className="tips-reminder">
        <span>💚</span>
        <div>
          <h3>Every crop has different needs</h3>
          <p>
            Choose watering, sunlight, nutrition and
            disease-control practices according to your
            crop, soil and local agricultural guidance.
          </p>
        </div>
      </div>

      <button
        className="tips-back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}


  // -------------------------
  // RESULT
  // -------------------------

   if (page === "result") {
  const prediction = result?.prediction || "";

  const info = result?.info || null;

  return (
    <div>
      <h1>🩺 Crop Scan Result</h1>

      {result?.success ? (
        <>
          <h2>🌿 AI Prediction: {result.prediction}</h2>

          <p>
            📊 Confidence: {result.confidence}%
           {info && (
            <div>
             <h3>📖 About the Disease</h3>
             <p>{info.disease}</p>

             <h3>🔍 Symptoms</h3>
             <p>{info.symptoms}</p>

             <h3>🦠 Causes</h3>
             <p>{info.causes}</p>

             <h3>💊 Treatment</h3>
             <p>{info.treatment}</p>

             <h3>💡 Tips</h3>
             <p>{info.tips}</p>
           </div>
           )}
          </p>

          <p>
            🤖 Prediction generated by CropDoctor AI
          </p>
        </>
      ) : (
        <p>
          ❌ Error:{" "}
          {result?.error || "Could not analyze image."}
        </p>
      )}

      <button onClick={() => setPage("home")}>
        ← Back to Home
      </button>
    </div>
  );
}

  // -------------------------
  // HOME
  // -------------------------

   
  return (
    <div className="cropdoctor">
      <header className="cd-header">
        <div className="cd-logo">🌿 CropDoctor</div>

        <nav className="cd-nav">
          <button onClick={() => setPage("home")}>🏠 Home</button>
          <button onClick={() => setPage("crops")}>🌱 Crops</button>
          <button onClick={() => setPage("diseases")}>🦠 Diseases</button>
          <button onClick={() => setPage("weather")}>☀️ Weather</button>
          <button onClick={() => setPage("tips")}>💡 Tips</button>
          <button onClick={getHistory}>📋 History</button>
        </nav>
      </header>

      <main className="cd-main">
        <section className="cd-hero">
          <p className="cd-eyebrow">SMART FARMING · HEALTHIER FUTURE</p>
          <h1>Healthy Crops,<br /><span>Better Tomorrow</span></h1>
          <p className="cd-subtitle">
            Your intelligent farming companion. Detect crop diseases,
            understand plant health, and grow with confidence.
          </p>
        </section>

        <section className="cd-upload">
          <div className="cd-upload-icon">📸</div>
          <h2>Check Your Crop Health</h2>
          <p>Upload a clear image of a crop leaf for AI disease analysis.</p>

          <label className="cd-file-button">
            Choose Crop Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>

          {image && (
            <div className="cd-preview">
              <img src={image} alt="Selected crop" />
              <p>{selectedFile?.name}</p>
              <button
                className="cd-primary-button"
                onClick={analyzeCrop}
                disabled={scanning}
              >
                {scanning ? "🔄 Scanning..." : "🔍 Analyze Crop"}
              </button>
            </div>
          )}
        </section>

        <section className="cd-features">
          <h2>Explore CropDoctor</h2>
          <p className="cd-section-description">
            Everything you need to support healthier crops.
          </p>

          <div className="cd-card-grid">
            <button className="cd-feature-card" onClick={() => setPage("crops")}>
              <span>🌾</span>
              <h3>My Crops</h3>
              <p>Explore and monitor your crops.</p>
            </button>

            <button className="cd-feature-card" onClick={() => setPage("diseases")}>
              <span>🔬</span>
              <h3>Crop Diseases</h3>
              <p>Learn about common crop diseases.</p>
            </button>

            <button className="cd-feature-card" onClick={() => setPage("weather")}>
              <span>🌤️</span>
              <h3>Live Weather</h3>
              <p>Check local weather conditions.</p>
            </button>

            <button className="cd-feature-card" onClick={getHistory}>
              <span>📋</span>
              <h3>Diagnosis History</h3>
              <p>Review your previous AI scans.</p>
            </button>

            <button className="cd-feature-card" onClick={() => setPage("tips")}>
              <span>🌱</span>
              <h3>Expert Tips</h3>
              <p>Discover helpful crop-care practices.</p>
            </button>
          </div>
        </section>
      </main>

      <footer className="cd-footer">
        🌿 CropDoctor — Growing a healthier tomorrow.
      </footer>
    </div>
  );
}

export default App;

