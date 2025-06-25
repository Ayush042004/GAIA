import express from 'express';
import { OpenAI } from 'openai';




const router = express.Router();

// Initialize OpenAI with proper error handling
let openai: OpenAI | null = null;

try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
}

router.post('/', async (req, res) => {
  const { message } = req.body;
 
  // Validate input
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
 
  // If OpenAI is not configured, return fallback response
  if (!openai) {
    const fallbackResponse = {
      reply: "I'm having trouble connecting to my AI brain right now, but I can still help! Here are some general styling tips:\n\n• Start with one statement piece\n• Balance fitted and loose items\n• Add texture through accessories\n• Choose colors that make you feel confident\n• Most importantly - wear what makes YOU feel amazing! ✨",
      suggestions: ['Try again', 'Style advice', 'Outfit help']
    };
    return res.json(fallbackResponse);
  }
 
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful fashion stylist AI assistant. Provide friendly, helpful styling advice and respond in a conversational tone. Keep responses concise but informative.'
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
       
    const reply = chatCompletion.choices[0].message.content;
    res.json({
      reply,
      suggestions: [
        'Style advice',
        'Outfit recommendations',
        'Color coordination',
        'Accessory tips'
      ]
    });
  } catch (err) {
    console.error('OpenAI API Error:', err);
       
    // Provide a fallback response if OpenAI is unavailable
    const fallbackResponse = {
      reply: "I'm having trouble connecting to my AI brain right now, but I can still help! Here are some general styling tips:\n\n• Start with one statement piece\n• Balance fitted and loose items\n• Add texture through accessories\n• Choose colors that make you feel confident\n• Most importantly - wear what makes YOU feel amazing! ✨",
      suggestions: ['Try again', 'Style advice', 'Outfit help']
    };
       
    res.json(fallbackResponse);
  }
});

export default router;