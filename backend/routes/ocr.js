const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const { traceable } = require('langsmith/traceable');

// Wrap the Gemini generation call in a traceable function
const runGeminiOcr = traceable(async (base64Image, mimeType, prompt) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      temperature: 0.1,
    }
  });

  return response;
}, { name: "Gemini OCR Extraction", run_type: "llm" });

// Configure multer for in-memory file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('invoice'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  // Check if API key is set properly
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log("Mock OCR Mode: Gemini API Key not found or is default.");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data for demonstration
    return res.json({
      amount: 45.99,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      description: 'Mocked Groceries from OCR',
      category: 'Food',
      mocked: true,
      rawText: "This is a mock OCR extraction because GEMINI_API_KEY is not set."
    });
  }

  try {
    // Convert buffer to base64 for Gemini API
    const base64Image = req.file.buffer.toString('base64');
    
    // Create the prompt to extract specific JSON structure
    const prompt = `
      Analyze this invoice/receipt image and extract the following information.
      Return ONLY a raw JSON object with the following keys, no markdown blocks, no backticks, no other text:
      {
        "amount": (number, the total amount on the invoice. If not found, return 0),
        "date": (string, in YYYY-MM-DD format. If not found, use today's date),
        "time": (string, in HH:MM format using 24-hour clock. If not found, return empty string),
        "description": (string, a brief 2-4 word summary of what the invoice is for or the merchant name),
        "category": (string, categorize the expense e.g. Food, Utilities, Shopping, Travel, General)
      }
    `;

    const response = await runGeminiOcr(base64Image, req.file.mimetype, prompt);

    const responseText = response.text;
    
    // Clean up potential markdown formatting if the model still includes it
    let cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const extractedData = JSON.parse(cleanJson);
      res.json({
        amount: extractedData.amount || 0,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        time: extractedData.time || new Date().toTimeString().split(' ')[0].substring(0, 5),
        description: extractedData.description || 'Extracted Invoice',
        category: extractedData.category || 'General',
        rawText: responseText,
        mocked: false
      });
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      res.status(500).json({ message: 'Failed to parse extracted data' });
    }

  } catch (err) {
    console.error("OCR Error with Gemini:", err);
    res.status(500).json({ message: 'Error processing image: ' + err.message });
  }
});

module.exports = router;
