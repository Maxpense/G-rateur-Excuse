const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' })); // Autorise toutes les origines
app.use(express.json()); // Remplace body-parser

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Charge la clé API depuis les variables d'environnement
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
      model: 'gpt-3.5-turbo',
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
const PORT = process.env.PORT || 3000; // Utilise le port de Render ou 3000 en local
app.listen(PORT, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
