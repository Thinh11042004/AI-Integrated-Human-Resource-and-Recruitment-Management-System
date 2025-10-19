const express = require('express');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

// Candidate CRUD operations
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.createCandidate);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

// Candidate-specific operations
router.post('/:id/upload-resume', candidateController.uploadResume);
router.get('/:id/jobs', candidateController.getCandidateJobs);
router.post('/:id/parse-cv', candidateController.parseCV);

// Candidate analytics
router.get('/:id/analytics', candidateController.getCandidateAnalytics);

module.exports = router;

