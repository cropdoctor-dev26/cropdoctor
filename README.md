# CropDoctor 🌱

## About the Project

CropDoctor is an AI-powered crop disease detection application. Users can upload a crop leaf image to receive a disease prediction, confidence score, and relevant disease information. The application also provides diagnosis history and weather information.

## Features

- AI-based crop disease prediction from uploaded images
- Predicted disease and confidence score
- Disease information and treatment guidance
- Diagnosis history
- Weather information
- Pastel-green user interface
- Web deployment and installable app experience

## Technologies Used

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- TensorFlow
- Pillow

**Other**
- SQLite for diagnosis history
- GitHub for source code management
- Vercel for frontend deployment
- Render for backend deployment

## Project Requirements

Install the following software before running the project locally:

- Node.js and npm
- Python
- Git (optional, for version control)

## Run the Frontend

Open a terminal in the main `cropdoctor` project folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Run the Backend

Open a terminal in VS Code and navigate to the backend folder:

```bash
cd backend
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

For local development, the backend is available at `http://127.0.0.1:8000`.

To view the API documentation, open `http://127.0.0.1:8000/docs` in your browser.


Activate your existing Python virtual environment if you have one, then install the backend dependencies using the project's existing requirements file, if available.

Start the FastAPI server using the command configured for your project. For example:

```bash
uvicorn main:app --reload
```

The backend normally runs at `http://127.0.0.1:8000`.

## How to Use CropDoctor

1. Open CropDoctor.
2. Select a crop leaf image.
3. Run the AI disease analysis.
4. Review the predicted disease and confidence score.
5. Read the available disease information and treatment guidance.
6. Open Diagnosis History to view saved scans.

## Deployment

The frontend is deployed using Vercel, and the backend is hosted on Render.

## Project Status

The application has working AI prediction, diagnosis history, and an installable app experience. Features should be verified against the deployed version before presenting the project.

## Future Improvements

- Expand and validate the crop disease dataset.
- Improve model accuracy and confidence calibration.
- Add more disease prevention and treatment resources.
- Improve mobile usability and accessibility.
