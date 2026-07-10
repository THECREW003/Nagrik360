from services.groq_service import transcribe_audio

def process_voice_complaint(file_path: str) -> str:
    text = transcribe_audio(file_path)
    return text