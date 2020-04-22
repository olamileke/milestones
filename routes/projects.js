const express = require('express');
const router = express.Router();
const ProjectsController = require('../controllers/projects');
const authGuard = require('../guards/guards').authGuard;

router.get('/dashboard', authGuard , ProjectsController.getDashboard);

router.get('/create', authGuard ,ProjectsController.getCreate);

module.exports = router;