from services.groq_service import ask_groq

CATEGORIES = ["Roads", "Water Supply", "Electricity", "Sanitation", "Public Safety", "Other"]

def classify_complaint(text: str) -> str:
    prompt = (
        f"Classify this civic complaint into exactly one category from {CATEGORIES}. "
        f"Respond with only the category name, nothing else.\n\nComplaint: {text}"
    )
    return ask_groq(prompt).strip()