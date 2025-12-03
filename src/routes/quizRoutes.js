const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/generate-questions', async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }
        const data = await aiService.generateQuestions(topic);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-feedback', async (req, res) => {
    try {
        const { topic, score, total, questions, userAnswers } = req.body;
        if (!topic || score === undefined || !total) {
            return res.status(400).json({ error: 'Topic, score, and total are required' });
        }
        const data = await aiService.generateFeedback(topic, score, total, questions, userAnswers);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
