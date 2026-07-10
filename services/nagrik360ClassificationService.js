const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/**
 * Nagarik360 Category → Department mapping
 */
const DEPARTMENT_MAP = {
  'Pothole': 'Roads Department',
  'Drainage': 'Roads Department',
  'Garbage': 'Sanitation Department',
  'IllegalDumping': 'Sanitation Department',
  'WaterLeakage': 'Water Board',
  'Flooding': 'Water Board',
  'StreetLight': 'Electrical Department',
  'Electrical': 'Electrical Department',
  'NoisePollution': 'Municipal Enforcement',
  'Other': 'General Administration',
};

const VALID_CATEGORIES = [
  'Pothole', 'Garbage', 'WaterLeakage', 'StreetLight',
  'Flooding', 'IllegalDumping', 'NoisePollution',
  'Drainage', 'Electrical', 'Other',
];

/**
 * Map a Nagarik360 category to its corresponding department name.
 */
const mapCategoryToDepartment = (category) => {
  return DEPARTMENT_MAP[category] || 'General Administration';
};

/**
 * Classify a complaint using the strict Nagarik360 system prompt.
 *
 * @param {string} complaintText - The citizen's complaint text.
 * @param {string} imageDescription - Optional image analysis description (may be empty).
 * @param {string} address - Location address.
 * @param {string} nearbyLandmarks - Nearby landmarks.
 * @param {number} duplicateCount - Number of citizens who reported the same issue.
 * @returns {Object} Parsed classification JSON.
 */
const classifyNagarik360Complaint = async (
  complaintText,
  imageDescription = '',
  address = '',
  nearbyLandmarks = '',
  duplicateCount = 0
) => {
  try {
    const client = getGenAI();
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const userPrompt = `
Complaint text: ${complaintText}
Image analysis (if available): ${imageDescription}
Location context: ${address}, near landmarks: ${nearbyLandmarks}
Number of citizens who reported this same issue: ${duplicateCount}

Analyze this complaint and return the JSON as specified.`;

    const systemPrompt = `You are the AI classification engine for Nagarik360, a civic complaint management system. You will receive a citizen's complaint (text, and optionally an image description) along with location context. Your job is to analyze it and return ONLY a valid JSON object — no markdown, no preamble, no explanation outside the JSON.

## Categories (choose exactly one):
Pothole, Garbage, WaterLeakage, StreetLight, Flooding, IllegalDumping, NoisePollution, Drainage, Electrical, Other

## Departments (map category to department):
Pothole/Drainage → Roads Department
Garbage/IllegalDumping → Sanitation Department
WaterLeakage/Flooding → Water Board
StreetLight/Electrical → Electrical Department
NoisePollution → Municipal Enforcement
Other → General Administration

## Scoring rubric (score each 0-100, be strict and consistent):

safety_score: How likely is this to cause injury or death?
- 90-100: Immediate danger (live wire, open manhole, collapsed structure)
- 60-89: High risk (large pothole near school, deep flooding)
- 30-59: Moderate risk (minor pothole, small water leak)
- 0-29: Low/no safety risk (noise complaint, cosmetic garbage)

severity_score: How bad is the issue itself, independent of danger?
- Based on scale/size described or shown (e.g. "huge crater" vs "small crack")

time_sensitivity_score: Will this get worse if not addressed soon?
- 90-100: Worsens hourly (flooding, live wire, sewage overflow)
- 40-89: Worsens over days (pothole, garbage pileup)
- 0-39: Stable, won't worsen (streetlight, minor noise)

## Output JSON schema (return exactly this structure):
{
  "category": "string from list above",
  "department": "string from list above",
  "safety_score": integer,
  "severity_score": integer,
  "time_sensitivity_score": integer,
  "reasoning": "one sentence explaining the scores, cite specific words/details from the complaint",
  "summary": "one sentence neutral summary for the officer dashboard",
  "detected_keywords": ["list", "of", "trigger", "words", "found"]
}

Be consistent: identical complaints should always get identical scores.
Do not inflate scores for dramatic language alone — score the actual situation described, not the tone of the complaint.`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    let text = response.text().trim();

    // Clean the response - remove markdown code blocks if present
    if (text.startsWith('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (text.startsWith('```')) {
      text = text.replace(/```/g, '');
    }

    const classification = JSON.parse(text);

    // Validate and ensure department is correct
    if (classification.category && !classification.department) {
      classification.department = mapCategoryToDepartment(classification.category);
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(classification.category)) {
      classification.category = 'Other';
      classification.department = 'General Administration';
    }

    return classification;
  } catch (error) {
    console.error('Nagarik360 Classification API Error:', error.message);
    // Fallback classification
    return {
      category: 'Other',
      department: 'General Administration',
      safety_score: 0,
      severity_score: 0,
      time_sensitivity_score: 0,
      reasoning: 'Could not classify automatically. Default fallback applied.',
      summary: complaintText.substring(0, 200),
      detected_keywords: [],
    };
  }
};

module.exports = {
  classifyNagarik360Complaint,
  mapCategoryToDepartment,
  VALID_CATEGORIES,
  DEPARTMENT_MAP,
};