const { candidates } = require('../data/sampleData');
const aiService = require('./aiService');

class CandidateService {
  constructor() {
    this.candidates = candidates;
    this.resumes = []; // In-memory storage for resumes
  }

  // Get all candidates with filtering and pagination
  async getAllCandidates({ status, skills, experience, page = 1, limit = 10 }) {
    let filteredCandidates = [...this.candidates];

    // Apply filters
    if (status) {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.status === status);
    }
    if (skills) {
      const skillArray = skills.split(',');
      filteredCandidates = filteredCandidates.filter(candidate =>
        skillArray.some(skill => candidate.skills.includes(skill))
      );
    }
    if (experience) {
      const expYears = parseInt(experience);
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.experienceYears >= expYears
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    return paginatedCandidates;
  }

  // Get candidate by ID
  async getCandidateById(id) {
    const candidate = this.candidates.find(candidate => candidate.id === id);
    if (!candidate) return null;

    const resume = this.getCandidateResume(id);
    return {
      ...candidate,
      resume: resume || null
    };
  }

  // Create new candidate
  async createCandidate(candidateData) {
    const newCandidate = {
      id: `CAN-${Date.now()}`,
      ...candidateData,
      status: 'Sourcing',
      interviewScore: 0,
      culturalFitScore: 0,
      resumeHighlights: [],
      lastInteraction: new Date().toISOString()
    };

    this.candidates.push(newCandidate);
    return newCandidate;
  }

  // Update candidate
  async updateCandidate(id, updateData) {
    const candidateIndex = this.candidates.findIndex(candidate => candidate.id === id);
    if (candidateIndex === -1) return null;

    this.candidates[candidateIndex] = {
      ...this.candidates[candidateIndex],
      ...updateData,
      lastInteraction: new Date().toISOString()
    };

    return this.candidates[candidateIndex];
  }

  // Delete candidate
  async deleteCandidate(id) {
    const candidateIndex = this.candidates.findIndex(candidate => candidate.id === id);
    if (candidateIndex === -1) return false;

    this.candidates.splice(candidateIndex, 1);
    return true;
  }

  // Upload resume
  async uploadResume(candidateId, resumeData) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const resume = {
      id: `RESUME-${Date.now()}`,
      candidateId,
      fileName: resumeData.fileName,
      fileUrl: resumeData.fileUrl,
      uploadedAt: new Date().toISOString(),
      parsedData: null
    };

    // Remove existing resume for this candidate
    this.resumes = this.resumes.filter(r => r.candidateId !== candidateId);
    this.resumes.push(resume);

    return resume;
  }

  // Get jobs for candidate
  async getCandidateJobs(candidateId) {
    // This would typically query job applications
    // For now, return mock data
    return [
      {
        jobId: 'JOB-9001',
        jobTitle: 'Lead Product Designer',
        applicationDate: '2024-03-01',
        status: 'Interviewing',
        matchScore: 85
      },
      {
        jobId: 'JOB-9002',
        jobTitle: 'Senior Software Engineer',
        applicationDate: '2024-02-28',
        status: 'Applied',
        matchScore: 78
      }
    ];
  }

  // Parse CV
  async parseCV(candidateId, cvText) {
    try {
      const parsedData = await aiService.parseCV(cvText);
      
      // Update candidate with parsed data
      const candidateIndex = this.candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex !== -1) {
        this.candidates[candidateIndex] = {
          ...this.candidates[candidateIndex],
          skills: [...new Set([...this.candidates[candidateIndex].skills, ...parsedData.skills])],
          experienceYears: parsedData.experienceYears || this.candidates[candidateIndex].experienceYears,
          resumeHighlights: parsedData.processedTerms.slice(0, 5)
        };
      }

      // Update resume with parsed data
      const resumeIndex = this.resumes.findIndex(r => r.candidateId === candidateId);
      if (resumeIndex !== -1) {
        this.resumes[resumeIndex].parsedData = parsedData;
      }

      return parsedData;
    } catch (error) {
      throw new Error(`Failed to parse CV: ${error.message}`);
    }
  }

  // Get candidate analytics
  async getCandidateAnalytics(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return null;

    const jobs = await this.getCandidateJobs(candidateId);
    const totalApplications = jobs.length;
    const avgMatchScore = jobs.reduce((sum, job) => sum + job.matchScore, 0) / totalApplications || 0;

    return {
      candidateId,
      totalApplications,
      avgMatchScore: Math.round(avgMatchScore),
      applicationsByStatus: this.groupApplicationsByStatus(jobs),
      skillDistribution: this.analyzeSkillDistribution(candidate),
      experienceLevel: this.categorizeExperience(candidate.experienceYears),
      interviewReadiness: this.calculateInterviewReadiness(candidate)
    };
  }

  // Private helper methods
  getCandidateResume(candidateId) {
    return this.resumes.find(r => r.candidateId === candidateId);
  }

  groupApplicationsByStatus(jobs) {
    return jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
  }

  analyzeSkillDistribution(candidate) {
    const skillCategories = {
      'Frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
      'Backend': ['node', 'python', 'java', 'sql', 'mongodb', 'postgresql'],
      'DevOps': ['aws', 'docker', 'kubernetes', 'git', 'linux'],
      'AI/ML': ['machine', 'learning', 'ai', 'tensorflow', 'pytorch']
    };

    const distribution = {};
    Object.keys(skillCategories).forEach(category => {
      const categorySkills = candidate.skills.filter(skill =>
        skillCategories[category].includes(skill.toLowerCase())
      );
      distribution[category] = categorySkills.length;
    });

    return distribution;
  }

  categorizeExperience(experienceYears) {
    if (experienceYears < 2) return 'Junior';
    if (experienceYears < 5) return 'Mid-level';
    if (experienceYears < 8) return 'Senior';
    return 'Lead/Principal';
  }

  calculateInterviewReadiness(candidate) {
    const score = (candidate.interviewScore + candidate.culturalFitScore) / 2;
    if (score >= 85) return 'Ready';
    if (score >= 70) return 'Almost Ready';
    if (score >= 50) return 'Needs Preparation';
    return 'Not Ready';
  }
}

module.exports = new CandidateService();

