const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Admin dashboard
router.get('/dashboard', adminController.getDashboard);

// System management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// System analytics
router.get('/analytics', adminController.getSystemAnalytics);
router.get('/reports', adminController.generateReport);

// AI management
router.get('/ai/status', adminController.getAIStatus);
router.post('/ai/train', adminController.trainAIModel);

module.exports = router;


