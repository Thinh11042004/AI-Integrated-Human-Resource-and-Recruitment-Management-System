const { employees, candidates, jobOpenings } = require('../data/sampleData');

class AdminService {
  constructor() {
    this.users = [
      {
        id: 'USER-001',
        name: 'Admin User',
        email: 'admin@hrms.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01'
      },
      {
        id: 'USER-002',
        name: 'HR Manager',
        email: 'hr@hrms.com',
        role: 'hr',
        status: 'active',
        createdAt: '2024-01-02'
      }
    ];
  }

  // Get admin dashboard
  async getDashboard() {
    const totalJobs = jobOpenings.length;
    const totalCandidates = candidates.length;
    const totalEmployees = employees.length;
    const totalUsers = this.users.length;

    const openJobs = jobOpenings.filter(job => job.status === 'Open').length;
    const activeCandidates = candidates.filter(candidate => 
      ['Sourcing', 'Screening', 'Interviewing'].includes(candidate.status)
    ).length;

    const recentActivity = [
      {
        type: 'job_created',
        description: 'New job posted: Senior Software Engineer',
        timestamp: new Date().toISOString(),
        user: 'HR Manager'
      },
      {
        type: 'candidate_applied',
        description: 'Candidate applied to Lead Product Designer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'System'
      },
      {
        type: 'interview_scheduled',
        description: 'Interview scheduled for tomorrow',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'HR Manager'
      }
    ];

    return {
      overview: {
        totalJobs,
        totalCandidates,
        totalEmployees,
        totalUsers,
        openJobs,
        activeCandidates
      },
      recentActivity,
      systemHealth: {
        status: 'healthy',
        uptime: '99.9%',
        lastBackup: '2024-03-05',
        aiModelStatus: 'active'
      }
    };
  }

  // Get all users
  async getAllUsers() {
    return this.users;
  }

  // Create user
  async createUser(userData) {
    const newUser = {
      id: `USER-${Date.now()}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  // Update user
  async updateUser(id, updateData) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  // Delete user
  async deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Get system analytics
  async getSystemAnalytics() {
    const jobStats = {
      total: jobOpenings.length,
      open: jobOpenings.filter(job => job.status === 'Open').length,
      closed: jobOpenings.filter(job => job.status === 'Closed').length,
      onHold: jobOpenings.filter(job => job.status === 'On Hold').length
    };

    const candidateStats = {
      total: candidates.length,
      sourcing: candidates.filter(c => c.status === 'Sourcing').length,
      screening: candidates.filter(c => c.status === 'Screening').length,
      interviewing: candidates.filter(c => c.status === 'Interviewing').length,
      offer: candidates.filter(c => c.status === 'Offer').length,
      hired: candidates.filter(c => c.status === 'Hired').length
    };

    const skillDemand = this.calculateSkillDemand();
    const conversionRates = this.calculateConversionRates();

    return {
      jobStats,
      candidateStats,
      skillDemand,
      conversionRates,
      timeToFill: this.calculateAverageTimeToFill(),
      aiAccuracy: this.calculateAIAccuracy()
    };
  }

  // Generate report
  async generateReport(type, period = 'month') {
    const reportData = {
      type,
      period,
      generatedAt: new Date().toISOString(),
      data: {}
    };

    switch (type) {
      case 'recruitment':
        reportData.data = {
          jobsPosted: jobOpenings.length,
          applicationsReceived: candidates.length,
          interviewsConducted: candidates.filter(c => c.status === 'Interviewing').length,
          offersMade: candidates.filter(c => c.status === 'Offer').length,
          hires: candidates.filter(c => c.status === 'Hired').length
        };
        break;
      
      case 'performance':
        reportData.data = {
          avgTimeToFill: this.calculateAverageTimeToFill(),
          conversionRate: this.calculateConversionRates(),
          aiMatchAccuracy: this.calculateAIAccuracy(),
          userActivity: this.getUserActivity()
        };
        break;
      
      case 'ai':
        reportData.data = {
          totalMatches: this.calculateTotalMatches(),
          avgMatchScore: this.calculateAverageMatchScore(),
          modelAccuracy: this.calculateAIAccuracy(),
          processingTime: this.getAIProcessingTime()
        };
        break;
      
      default:
        throw new Error('Invalid report type');
    }

    return reportData;
  }

  // Get AI status
  async getAIStatus() {
    return {
      status: 'active',
      modelVersion: '1.0.0',
      lastTraining: '2024-03-01',
      accuracy: this.calculateAIAccuracy(),
      processingTime: this.getAIProcessingTime(),
      totalProcessed: this.calculateTotalMatches(),
      errors: 0
    };
  }

  // Train AI model
  async trainAIModel() {
    // Simulate AI model training
    return {
      status: 'training',
      progress: 0,
      estimatedTime: '2 hours',
      startedAt: new Date().toISOString()
    };
  }

  // Private helper methods
  calculateSkillDemand() {
    const skillCounts = {};
    jobOpenings.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  }

  calculateConversionRates() {
    const totalCandidates = candidates.length;
    const hired = candidates.filter(c => c.status === 'Hired').length;
    
    return {
      applicationToHire: totalCandidates > 0 ? Math.round((hired / totalCandidates) * 100) : 0,
      interviewToHire: 75, // Mock data
      offerToHire: 90 // Mock data
    };
  }

  calculateAverageTimeToFill() {
    // Mock calculation
    return 34; // days
  }

  calculateAIAccuracy() {
    // Mock AI accuracy calculation
    return 87; // percentage
  }

  calculateTotalMatches() {
    // Mock total matches processed
    return 156;
  }

  calculateAverageMatchScore() {
    // Mock average match score
    return 78;
  }

  getAIProcessingTime() {
    // Mock processing time
    return '0.5s';
  }

  getUserActivity() {
    return {
      activeUsers: this.users.filter(u => u.status === 'active').length,
      totalLogins: 1250, // Mock data
      avgSessionTime: '45 minutes'
    };
  }
}

module.exports = new AdminService();


