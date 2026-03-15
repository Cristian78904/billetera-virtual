const express = require('express');
const router = express.Router();

router.get('/saldo', (req, res) => {
    res.json({ message: 'Saldo de cuenta' });
});

module.exports = router;