const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

// Enhanced Llama 3 Bridge with Diagnostic Intelligence
router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const apiKey = process.env.GROQ_API_KEY;

    // Diagnostic Check: If the user hasn't replaced the placeholder or the key is missing
    if (!apiKey || apiKey.includes('your_actual_groq')) {
      console.error("CRITICAL: Groq API Key is missing or using placeholder.");
      return res.json({ 
        reply: "System Note: My live Llama 3 brain requires a valid API key. Please ensure GROQ_API_KEY is correctly set in your Backend/.env file and restart the server." 
      });
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Llama 3, the premium AI Library Assistant for BookHaven. You provide insightful, accurate, and professional literary advice. Keep your tone sophisticated but helpful."
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      max_tokens: 512,
    });

    const reply = chatCompletion.choices[0]?.message?.content;
    
    if (reply) {
      res.json({ reply });
    } else {
      throw new Error("Empty response from AI engine");
    }

  } catch (error) {
    console.error("Llama 3 Neural Error:", error.message);
    
    // Adaptive error response
    let statusMsg = "I'm currently upgrading my neural pathways. Please try again in 30 seconds!";
    if (error.message.includes('401') || error.message.includes('invalid_api_key')) statusMsg = "Identity Verification Failed: The Llama API Key provided appears to be invalid or missing.";
    if (error.message.includes('429')) statusMsg = "High Traffic Alert: Llama 3 is processing too many requests. Please wait a moment while I clear the queue.";

    res.json({ reply: statusMsg });
  }
});

module.exports = router;
