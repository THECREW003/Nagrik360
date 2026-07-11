const { GoogleGenerativeAI } = require('@google/generative-ai');
const { classifyNagarik360Complaint, mapCategoryToDepartment } = require('./nagrik360ClassificationService');

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
 * Classify a complaint using the Nagarik360 scoring system.
 * This delegates to the dedicated Nagarik360 classification service
 * which uses the strict system prompt with safety/severity/time_sensitivity scoring.
 *
 * @param {string} title - Complaint title
 * @param {string} description - Full complaint description
 * @param {Object} [options] - Additional context
 * @param {string} [options.imageDescription] - Image analysis text
 * @param {string} [options.address] - Location address
 * @param {string} [options.nearbyLandmarks] - Nearby landmarks
 * @param {number} [options.duplicateCount] - Number of similar reports
 * @returns {Object} Classification result with Nagarik360 scoring
 */
const classifyComplaint = async (title, description, options = {}) => {
  try {
    const {
      imageDescription = '',
      address = '',
      nearbyLandmarks = '',
      duplicateCount = 0,
    } = options;

    // Combine title and description for full complaint text
    const complaintText = `Title: ${title}\nDescription: ${description}`;

    const nagarikResult = await classifyNagarik360Complaint(
      complaintText,
      imageDescription,
      address,
      nearbyLandmarks,
      duplicateCount
    );

    // Map Nagarik360 category to the legacy category system for backward compatibility
    const legacyCategoryMap = {
      'Pothole': 'Roads & Infrastructure',
      'Drainage': 'Roads & Infrastructure',
      'Garbage': 'Sanitation',
      'IllegalDumping': 'Sanitation',
      'WaterLeakage': 'Water Supply',
      'Flooding': 'Water Supply',
      'StreetLight': 'Electricity',
      'Electrical': 'Electricity',
      'NoisePollution': 'Public Safety',
      'Other': 'Other',
    };

    const legacyCategory = legacyCategoryMap[nagarikResult.category] || 'Other';

    // Map scores to priority
    const avgScore = (nagarikResult.safety_score + nagarikResult.severity_score + nagarikResult.time_sensitivity_score) / 3;
    let priority = 'medium';
    if (avgScore >= 70) priority = 'critical';
    else if (avgScore >= 50) priority = 'high';
    else if (avgScore >= 25) priority = 'medium';
    else priority = 'low';

    return {
      summary: nagarikResult.summary || description.substring(0, 200),
      category: nagarikResult.category,
      legacyCategory,
      department: nagarikResult.department,
      priority,
      sentiment: nagarikResult.safety_score >= 60 ? 'urgent' : 'neutral',
      confidence: Math.round((nagarikResult.safety_score + nagarikResult.severity_score + nagarikResult.time_sensitivity_score) / 3),
      // Nagarik360 scoring fields
      safety_score: nagarikResult.safety_score,
      severity_score: nagarikResult.severity_score,
      time_sensitivity_score: nagarikResult.time_sensitivity_score,
      reasoning: nagarikResult.reasoning,
      detected_keywords: nagarikResult.detected_keywords || [],
      nagrik_department: nagarikResult.department,
    };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // Fallback classification
    return {
      summary: description.substring(0, 200),
      category: 'Other',
      legacyCategory: 'Other',
      department: 'General Administration',
      priority: 'medium',
      sentiment: 'neutral',
      confidence: 0,
      safety_score: 0,
      severity_score: 0,
      time_sensitivity_score: 0,
      reasoning: 'Automatic classification failed. Default fallback applied.',
      detected_keywords: [],
      nagrik_department: 'General Administration',
    };
  }
};

const detectDuplicate = async (title, description, existingComplaints) => {
  try {
    const client = getGenAI();
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const existingText = existingComplaints
      .map((c, i) => `Complaint ${i + 1}: Title: "${c.title}", Description: "${c.description.substring(0, 300)}"`)
      .join('\n');

    const prompt = `
You are a duplicate complaint detection system.
Compare the new complaint with existing complaints and determine if it's a duplicate.

New Complaint:
Title: "${title}"
Description: "${description}"

Existing Complaints:
${existingText}

Is this a duplicate? Respond with ONLY a JSON object:
{
  "isDuplicate": true/false,
  "duplicateOf": index (0-based, or -1 if not duplicate),
  "confidence": 0-100,
  "reason": "brief explanation"
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    if (text.startsWith('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error('Duplicate Detection Error:', error.message);
    return { isDuplicate: false, duplicateOf: -1, confidence: 0, reason: '' };
  }
};

module.exports = { classifyComplaint, detectDuplicate };