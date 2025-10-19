const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { listJobs, getJob, createJob, updateJob } = require('../controllers/jobController');

const router = express.Router();

router.get('/', asyncHandler(listJobs));
router.get('/:id', asyncHandler(getJob));
router.post('/', authenticate, authorize('HR', 'ADMIN'), asyncHandler(createJob));
router.patch('/:id', authenticate, authorize('HR', 'ADMIN'), asyncHandler(updateJob));

module.exports = router;