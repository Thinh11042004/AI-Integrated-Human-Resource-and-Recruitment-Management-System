const { z } = require('zod');
const prisma = require('../prisma');
const ApiError = require('../utils/apiError');

const updateSchema = z.object({
  headline: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  yearsExp: z.number().int().min(0).max(60).optional().nullable(),
  bio: z.string().optional().nullable(),
  defaultResumeId: z.string().optional().nullable()
});

const ensureOwnership = (req) => {
  if (req.user.role === 'CANDIDATE' && req.user.id !== req.params.userId) {
    throw new ApiError(403, 'You can only access your own profile');
  }
};

const getCandidate = async (req, res) => {
  ensureOwnership(req);
  const candidate = await prisma.candidate.findFirst({
    where: { userId: req.params.userId },
    include: {
      user: true,
      resumes: true
    }
  });

  if (!candidate) {
    throw new ApiError(404, 'Candidate not found');
  }

  res.json(candidate);
};

const updateCandidate = async (req, res) => {
  ensureOwnership(req);
  const payload = updateSchema.parse(req.body);

  if (payload.defaultResumeId) {
    const resume = await prisma.resume.findFirst({
      where: { id: payload.defaultResumeId, candidate: { userId: req.params.userId } }
    });
    if (!resume) {
      throw new ApiError(400, 'Default resume must belong to this candidate');
    }
  }

  const candidate = await prisma.candidate.update({
    where: { userId: req.params.userId },
    data: {
      headline: payload.headline ?? undefined,
      skills: payload.skills ?? undefined,
      yearsExp: payload.yearsExp ?? undefined,
      bio: payload.bio ?? undefined,
      defaultResumeId: payload.defaultResumeId ?? undefined
    },
    include: {
      user: true,
      resumes: true
    }
  });

  res.json(candidate);
};

module.exports = {
  getCandidate,
  updateCandidate
};