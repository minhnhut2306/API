const express = require('express');
const router = express.Router();
const searchHistoryController = require('../controllers/searchHistoryController');


router.post('/search-history/save', async (req, res) => {
    const { userId, keyword } = req.body;

    try {
        const result = await searchHistoryController.saveSearchHistory(userId, keyword);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/search-history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const history = await searchHistoryController.getSearchHistory(userId);
        res.status(200).json(history); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/search-history/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID for deletion:', id);

    try {
        const result = await searchHistoryController.deleteSearchHistory(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in delete route:', error);
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
