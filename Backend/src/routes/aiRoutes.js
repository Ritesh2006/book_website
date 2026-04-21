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
          content: `You are 'Llama 3', the high-intelligence AI Librarian for the BookHaven platform. 
          Your goal is to provide creative, insightful, and beautifully structured literary advice.
          
          GUIDELINES:
          1. PERSONA: You are sophisticated, warm, and exceptionally well-read. Use a friendly but professional librarian tone.
          2. FORMATTING: ALWAYS use Markdown to make your answers eye-catching.
             - Use **bold** for book titles or key concepts.
             - Use bullet points for lists of recommendations.
             - Use horizontal rules (---) to separate different sections of a long answer.
             - Use '#' or '##' for headings if describing a complex topic.
          3. CREATIVITY: Don't just list books. Explain WHY they are special. Use evocative adjectives.
          4. CONTEXT: You know everything about literature, research papers, and digital preservation.
          5. LENGTH: Keep responses concise but information-rich (max 350 tokens).`
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile", // Use a more powerful model if available
      temperature: 0.8,
      max_tokens: 600,
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
