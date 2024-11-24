const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Charge la clé API depuis le fichier .env
});

// Route pour générer une excuse
app.post('/generate-excuse', async (req, res) => {
  const { userInput, mode } = req.body;

  try {
    const prompt =
    mode === 'FUN'
      ? `Génère une excuse drôle et concise pour : "${userInput}". Réponse en une seule phrase.`
      : `Génère une excuse sérieuse et concise pour : "${userInput}". Réponse en une seule phrase.`;

    // Appelle l'API OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Utilise 'gpt-3.5-turbo' si tu n'as pas accès à GPT-4
      messages: [
        { role: 'system', content: 'Tu es un générateur d\'excuses.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 70,
    });

    const excuse = response.choices[0].message.content.trim();
    res.json({ excuse });
  } catch (error) {
    console.error('Erreur complète :', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Erreur avec l\'API OpenAI.' });
  }
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
