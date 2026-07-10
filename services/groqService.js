const Groq = require('groq-sdk');
const fs = require('fs');

let groq = null;

const getGroqClient = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groq = new Groq({ apiKey });
  }
  return groq;
};

const transcribeAudio = async (audioFilePath) => {
  try {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error('Audio file not found');
    }

    const client = getGroqClient();
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-large-v3',
      language: 'en',
      response_format: 'json',
    });

    return transcription.text;
  } catch (error) {
    console.error('Groq Whisper API Error:', error.message);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
};

module.exports = { transcribeAudio };