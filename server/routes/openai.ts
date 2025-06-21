import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv'; 

dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
const chatCompletion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful fashion stylist AI.' },
    { role: 'user', content: message },
  ],
});
   const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
});

export default router;