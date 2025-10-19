// const express = require('express');
// const candidateController = require('../controllers/candidateController');

// const router = express.Router();

// // Candidate CRUD operations
// router.get('/', candidateController.getAllCandidates);
// router.get('/:id', candidateController.getCandidateById);
// router.post('/', candidateController.createCandidate);
// router.put('/:id', candidateController.updateCandidate);
// router.delete('/:id', candidateController.deleteCandidate);

// // Candidate-specific operations
// router.post('/:id/upload-resume', candidateController.uploadResume);
// router.get('/:id/jobs', candidateController.getCandidateJobs);
// router.post('/:id/parse-cv', candidateController.parseCV);

// // Candidate analytics
// router.get('/:id/analytics', candidateController.getCandidateAnalytics);

// module.exports = router;

const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { getCandidate, updateCandidate } = require('../controllers/candidateController');

const router = express.Router();

router.get('/:userId', authenticate, asyncHandler(getCandidate));
router.patch('/:userId', authenticate, authorize('CANDIDATE', 'HR', 'ADMIN'), asyncHandler(updateCandidate));

module.exports = router;