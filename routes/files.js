const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/annexe', (req, res) => res.sendFile(path.resolve('public/30-days-notice.pdf')));
router.get('/lca', (req, res) => res.sendFile(path.resolve('public/Licensing-agreement-ENGLISH.pdf')));
router.get('/ppo', (req, res) => res.sendFile(path.resolve('public/Privacy-Policy-for-Okayemotions.pdf')));
router.get('/tc', (req, res) => res.sendFile(path.resolve('public/Terms-and-Conditions.pdf')));

module.exports = router;