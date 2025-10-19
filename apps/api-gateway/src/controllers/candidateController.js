const candidateService = require('../services/candidateService');

class CandidateController {
  // Get all candidates
  async getAllCandidates(req, res) {
    try {
      const { status, skills, experience, page = 1, limit = 10 } = req.query;
      const candidates = await candidateService.getAllCandidates({ 
        status, skills, experience, page, limit 
      });
      
      res.json({
        success: true,
        data: candidates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: candidates.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get candidate by ID
  async getCandidateById(req, res) {
    try {
      const { id } = req.params;
      const candidate = await candidateService.getCandidateById(id);
      
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      
      res.json({ success: true, data: candidate });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new candidate
  async createCandidate(req, res) {
    try {
      const candidateData = req.body;
      const newCandidate = await candidateService.createCandidate(candidateData);
      
      res.status(201).json({ 
        success: true, 
        data: newCandidate,
        message: 'Candidate created successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Update candidate
  async updateCandidate(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCandidate = await candidateService.updateCandidate(id, updateData);
      
      if (!updatedCandidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      
      res.json({ 
        success: true, 
        data: updatedCandidate,
        message: 'Candidate updated successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Delete candidate
  async deleteCandidate(req, res) {
    try {
      const { id } = req.params;
      const deleted = await candidateService.deleteCandidate(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Candidate not found' });
      }
      
      res.json({ 
        success: true, 
        message: 'Candidate deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Upload resume
  async uploadResume(req, res) {
    try {
      const { id } = req.params;
      const resumeData = req.body;
      
      const result = await candidateService.uploadResume(id, resumeData);
      
      res.json({ 
        success: true, 
        data: result,
        message: 'Resume uploaded successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get jobs for candidate
  async getCandidateJobs(req, res) {
    try {
      const { id } = req.params;
      const jobs = await candidateService.getCandidateJobs(id);
      
      res.json({ success: true, data: jobs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Parse CV
  async parseCV(req, res) {
    try {
      const { id } = req.params;
      const { cvText } = req.body;
      
      const parsedData = await candidateService.parseCV(id, cvText);
      
      res.json({ 
        success: true, 
        data: parsedData,
        message: 'CV parsed successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get candidate analytics
  async getCandidateAnalytics(req, res) {
    try {
      const { id } = req.params;
      const analytics = await candidateService.getCandidateAnalytics(id);
      
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CandidateController();

