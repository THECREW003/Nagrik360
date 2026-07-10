from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.complaint_classifier import classify_complaint
from services.priority_detection import detect_priority
from services.voice import process_voice_complaint
import shutil
import os

app = FastAPI(title="Nagrik360 AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "AI service running"}

@app.post("/analyze/text")
def analyze_text(complaint: str = Form(...)):
    category = classify_complaint(complaint)
    priority = detect_priority(complaint)
    return {"category": category, "priority": priority}

@app.post("/analyze/voice")
def analyze_voice(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        transcript = process_voice_complaint(temp_path)
        category = classify_complaint(transcript)
        priority = detect_priority(transcript)
        return {
            "transcript": transcript,
            "category": category,
            "priority": priority
        }
    finally:
        os.remove(temp_path)