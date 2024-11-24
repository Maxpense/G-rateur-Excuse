const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route pour générer une excuse
app.post('/generate-excuse', async (req, res) => {
    const { userInput, mode } = req.body;

    if (!userInput || !mode) {
        return res.status(400).json({ error: 'Entrée utilisateur ou mode manquant.' });
    }

    try {
        const prompt = mode === 'FUN'
            ? `Génère une excuse drôle et unique pour : "${userInput}".`
            : `Génère une excuse sérieuse et professionnelle pour : "${userInput}".`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Tu es un expert en excuses créatives et professionnelles.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 50,
        });

        const excuse = response.choices[0].message.content.trim();
        res.json({ excuse });
    } catch (error) {
        console.error('Erreur OpenAI :', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur avec l\'API OpenAI.' });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur actif sur http://localhost:${PORT}`);
});
