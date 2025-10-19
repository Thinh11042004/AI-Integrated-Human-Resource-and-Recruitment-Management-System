const { jobOpenings } = require('../data/sampleData');
const aiService = require('./aiService');

class JobService {
  constructor() {
    this.jobs = jobOpenings;
    this.applications = []; // In-memory storage for applications
  }

  // Get all jobs with filtering and pagination
  async getAllJobs({ status, department, level, page = 1, limit = 10 }) {
    let filteredJobs = [...this.jobs];

    // Apply filters
    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    if (department) {
      filteredJobs = filteredJobs.filter(job => job.department === department);
    }
    if (level) {
      filteredJobs = filteredJobs.filter(job => job.level === level);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Add AI matches for each job
    const jobsWithMatches = paginatedJobs.map(job => ({
      ...job,
      matches: this.calculateTopMatchesForJob(job, 3)
    }));

    return jobsWithMatches;
  }

  // Get job by ID
  async getJobById(id) {
    const job = this.jobs.find(job => job.id === id);
    if (!job) return null;

    return {
      ...job,
      matches: this.calculateTopMatchesForJob(job, 5),
      applications: this.getJobApplications(id)
    };
  }

  // Create new job
  async createJob(jobData) {
    const newJob = {
      id: `JOB-${Date.now()}`,
      ...jobData,
      status: 'Open',
      postedAt: new Date().toISOString(),
      applications: []
    };

    this.jobs.push(newJob);
    return newJob;
  }

  // Update job
  async updateJob(id, updateData) {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) return null;

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.jobs[jobIndex];
  }

  // Delete job
  async deleteJob(id) {
    const jobIndex = this.jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) return false;

    this.jobs.splice(jobIndex, 1);
    return true;
  }

  // Get candidates for a job
  async getJobCandidates(jobId) {
    const jobApplications = this.getJobApplications(jobId);
    return jobApplications.map(app => ({
      ...app.candidate,
      applicationDate: app.applicationDate,
      status: app.status,
      matchScore: app.matchScore
    }));
  }

  // Apply to job
  async applyToJob(jobId, applicationData) {
    const job = this.jobs.find(job => job.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== 'Open') {
      throw new Error('Job is not accepting applications');
    }

    // Calculate AI match score
    const matchScore = await aiService.calculateJobMatch(jobId, applicationData.candidateId);

    const application = {
      id: `APP-${Date.now()}`,
      jobId,
      candidateId: applicationData.candidateId,
      candidate: applicationData.candidate,
      resumeUrl: applicationData.resumeUrl,
      coverLetter: applicationData.coverLetter,
      applicationDate: new Date().toISOString(),
      status: 'Applied',
      matchScore
    };

    this.applications.push(application);
    return application;
  }

  // Get job matches (AI-powered)
  async getJobMatches(jobId) {
    const job = this.jobs.find(job => job.id === jobId);
    if (!job) return [];

    return this.calculateTopMatchesForJob(job, 10);
  }

  // Get job analytics
  async getJobAnalytics(jobId) {
    const job = this.jobs.find(job => job.id === jobId);
    if (!job) return null;

    const applications = this.getJobApplications(jobId);
    const totalApplications = applications.length;
    const avgMatchScore = applications.reduce((sum, app) => sum + app.matchScore, 0) / totalApplications || 0;

    return {
      jobId,
      totalApplications,
      avgMatchScore: Math.round(avgMatchScore),
      applicationsByStatus: this.groupApplicationsByStatus(applications),
      topSkills: this.extractTopSkills(applications),
      timeToFill: this.calculateTimeToFill(job),
      conversionRate: this.calculateConversionRate(applications)
    };
  }

  // Private helper methods
  getJobApplications(jobId) {
    return this.applications.filter(app => app.jobId === jobId);
  }

  calculateTopMatchesForJob(job, topN) {
    // This would integrate with AI service for real matching
    // For now, return mock data
    return [
      {
        candidateId: 'CAN-101',
        matchScore: 85,
        matchedSkills: job.requiredSkills.slice(0, 2),
        missingSkills: job.requiredSkills.slice(2),
        recommendations: ['Strong technical fit', 'Schedule technical interview']
      },
      {
        candidateId: 'CAN-102',
        matchScore: 78,
        matchedSkills: job.requiredSkills.slice(0, 1),
        missingSkills: job.requiredSkills.slice(1),
        recommendations: ['Good cultural fit', 'Consider for junior role']
      }
    ].slice(0, topN);
  }

  groupApplicationsByStatus(applications) {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
  }

  extractTopSkills(applications) {
    const skillCounts = {};
    applications.forEach(app => {
      if (app.candidate && app.candidate.skills) {
        app.candidate.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));
  }

  calculateTimeToFill(job) {
    const postedDate = new Date(job.postedAt);
    const now = new Date();
    return Math.ceil((now - postedDate) / (1000 * 60 * 60 * 24)); // days
  }

  calculateConversionRate(applications) {
    const hired = applications.filter(app => app.status === 'Hired').length;
    return totalApplications > 0 ? Math.round((hired / applications.length) * 100) : 0;
  }
}

module.exports = new JobService();

