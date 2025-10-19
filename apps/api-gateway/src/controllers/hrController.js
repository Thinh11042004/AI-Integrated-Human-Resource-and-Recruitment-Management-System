const hrService = require('../services/hrService');

class HrController {
  // Employee endpoints
  async getEmployees(req, res) {
    try {
      const employees = hrService.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = hrService.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEmployeePerformance(req, res) {
    try {
      const { id } = req.params;
      const performance = hrService.getEmployeePerformance(id);
      
      if (!performance) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Candidate endpoints
  async getCandidates(req, res) {
    try {
      const candidates = hrService.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Job endpoints
  async getJobs(req, res) {
    try {
      const jobs = hrService.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Interview endpoints
  async getInterviews(req, res) {
    try {
      const interviews = hrService.getInterviewSchedules();
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Analytics endpoints
  async getAnalytics(req, res) {
    try {
      const analytics = hrService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // AI endpoints
  async getWorkforceInsight(req, res) {
    try {
      const insight = hrService.getWorkforceInsight();
      res.json(insight);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async summarizeCandidate(req, res) {
    try {
      const result = hrService.summarizeCandidate(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async matchCandidateToJob(req, res) {
    try {
      const result = hrService.matchCandidateToJob(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateInterviewFeedback(req, res) {
    try {
      const result = hrService.generateInterviewFeedback(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new HrController();
