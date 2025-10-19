const express = require('express');
const jobController = require('../controllers/jobController');

const router = express.Router();

// Job CRUD operations
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Job-specific operations
router.get('/:id/candidates', jobController.getJobCandidates);
router.post('/:id/apply', jobController.applyToJob);
router.get('/:id/matches', jobController.getJobMatches);

// Job analytics
router.get('/:id/analytics', jobController.getJobAnalytics);

module.exports = router;

