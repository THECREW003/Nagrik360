from services.groq_service import ask_groq

URGENT_KEYWORDS = ["fire", "collapse", "injury", "electrocution", "flood", "gas leak"]

def detect_priority(text: str) -> str:
    if any(word in text.lower() for word in URGENT_KEYWORDS):
        return "Critical"

    prompt = (
        "Rate the urgency of this civic complaint as exactly one word: "
        "Low, Medium, High, or Critical. Respond with only that word.\n\n"
        f"Complaint: {text}"
    )
    return ask_groq(prompt).strip()