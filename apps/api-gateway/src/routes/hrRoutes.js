const express = require('express');
const hrController = require('../controllers/hrController');

const router = express.Router();

// Employee routes
router.get('/employees', hrController.getEmployees);
router.get('/employees/:id', hrController.getEmployeeById);
router.get('/employees/:id/performance', hrController.getEmployeePerformance);

// Candidate routes
router.get('/candidates', hrController.getCandidates);

// Job routes
router.get('/jobs', hrController.getJobs);

// Interview routes
router.get('/interviews', hrController.getInterviews);

// Analytics routes
router.get('/analytics', hrController.getAnalytics);

// AI routes
router.get('/ai/insights', hrController.getWorkforceInsight);
router.post('/ai/candidate-summary', hrController.summarizeCandidate);
router.post('/ai/match', hrController.matchCandidateToJob);
router.post('/ai/interview-feedback', hrController.generateInterviewFeedback);

module.exports = router;
