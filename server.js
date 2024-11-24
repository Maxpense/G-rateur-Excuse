const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors({ origin: '*' })); // Autorise toutes les origines
app.use(express.json()); // Middleware pour gérer les JSON

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Charge la clé API depuis les variables d'environnement
});

// Route pour générer une excuse
app.post('/generate-excuse', async (req, res) => {
  const { userInput, mode } = req.body;

  try {
    // Prompt adapté en fonction du mode
    const prompt = mode === 'FUN'
      ? `En tant qu'expert en excuses créatives et humoristiques, génère une excuse drôle et loufoque pour la situation suivante : "${userInput}". 
         L'excuse doit respecter les critères suivants :
         - Être extrêmement créative et unique
         - Contenir une pointe d'absurdité tout en restant compréhensible
         - Apporter une touche d'humour universel qui ne dépend pas de références spécifiques
         - Tenir en **une seule phrase** concise mais percutante.`
      : `En tant que conseiller professionnel, génère une excuse crédible et appropriée pour la situation suivante : "${userInput}". 
         L'excuse doit respecter les critères suivants :
         - Être formulée de manière professionnelle et respectueuse
         - Être réaliste et adaptée à un contexte sérieux
         - Apporter une solution diplomatique pour préserver les relations
         - Tenir en **une seule phrase**, polie et bien structurée.`;

    // Appel à l'API OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un expert en excuses, capable de générer des réponses adaptées à chaque contexte.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 70,
    });

    // Récupérer et renvoyer l'excuse générée
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
