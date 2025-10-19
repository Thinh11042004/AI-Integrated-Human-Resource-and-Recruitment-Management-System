const natural = require('natural');

class AIService {
  constructor() {
    this.tfidf = new natural.TfIdf();
    this.documents = [];
    this.documentTypes = []; // 'job' or 'candidate'
    this.documentIds = [];
  }

  // Add document to TF-IDF corpus
  addDocument(id, text, type) {
    this.tfidf.addDocument(text);
    this.documents.push(text);
    this.documentTypes.push(type);
    this.documentIds.push(id);
  }

  // Calculate job-candidate match score using TF-IDF + cosine similarity
  async calculateJobMatch(jobId, candidateId) {
    try {
      // Get job and candidate data
      const job = this.getJobById(jobId);
      const candidate = this.getCandidateById(candidateId);
      
      if (!job || !candidate) {
        return 0;
      }

      // Create text representations
      const jobText = this.createJobText(job);
      const candidateText = this.createCandidateText(candidate);

      // Calculate TF-IDF vectors
      const jobVector = this.calculateTFIDFVector(jobText);
      const candidateVector = this.calculateTFIDFVector(candidateText);

      // Calculate cosine similarity
      const similarity = this.calculateCosineSimilarity(jobVector, candidateVector);

      // Apply bonus for skill matches
      const skillBonus = this.calculateSkillBonus(job, candidate);

      // Final score (0-100)
      const finalScore = Math.round((similarity * 70) + (skillBonus * 30));

      return Math.min(100, Math.max(0, finalScore));
    } catch (error) {
      console.error('Error calculating job match:', error);
      return 0;
    }
  }

  // Generate interview questions based on job requirements
  async generateInterviewQuestions(jobId, candidateId) {
    try {
      const job = this.getJobById(jobId);
      const candidate = this.getCandidateById(candidateId);
      
      if (!job || !candidate) {
        return [];
      }

      const questions = [];

      // Technical questions based on required skills
      job.requiredSkills.forEach(skill => {
        if (!candidate.skills.includes(skill)) {
          questions.push({
            type: 'technical',
            skill: skill,
            question: `How would you approach learning ${skill} if you were to work on this project?`,
            difficulty: 'medium',
            category: 'skill_gap'
          });
        } else {
          questions.push({
            type: 'technical',
            skill: skill,
            question: `Can you describe your experience with ${skill} and provide a specific example?`,
            difficulty: 'medium',
            category: 'experience'
          });
        }
      });

      // Behavioral questions
      questions.push({
        type: 'behavioral',
        question: 'Tell me about a time when you had to learn a new technology quickly. How did you approach it?',
        difficulty: 'easy',
        category: 'learning_ability'
      });

      questions.push({
        type: 'behavioral',
        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
        difficulty: 'medium',
        category: 'problem_solving'
      });

      // Role-specific questions
      if (job.level === 'Senior' || job.level === 'Lead') {
        questions.push({
          type: 'leadership',
          question: 'How do you mentor junior developers and ensure knowledge transfer?',
          difficulty: 'hard',
          category: 'leadership'
        });
      }

      return questions.slice(0, 8); // Limit to 8 questions
    } catch (error) {
      console.error('Error generating interview questions:', error);
      return [];
    }
  }

  // Parse CV text and extract key information
  async parseCV(cvText) {
    try {
      const tokens = natural.WordTokenizer().tokenize(cvText.toLowerCase());
      const stopWords = natural.stopwords;
      
      // Remove stop words and extract meaningful terms
      const meaningfulTerms = tokens.filter(token => 
        !stopWords.includes(token) && 
        token.length > 2 && 
        /^[a-zA-Z]+$/.test(token)
      );

      // Extract skills (common tech terms)
      const techSkills = this.extractTechSkills(meaningfulTerms);
      
      // Extract experience years
      const experienceYears = this.extractExperienceYears(cvText);
      
      // Extract education
      const education = this.extractEducation(cvText);

      return {
        skills: techSkills,
        experienceYears,
        education,
        rawText: cvText,
        processedTerms: meaningfulTerms.slice(0, 100) // Limit for performance
      };
    } catch (error) {
      console.error('Error parsing CV:', error);
      return {
        skills: [],
        experienceYears: 0,
        education: [],
        rawText: cvText,
        processedTerms: []
      };
    }
  }

  // Private helper methods
  createJobText(job) {
    return [
      job.title,
      job.description,
      job.requiredSkills.join(' '),
      job.niceToHaveSkills.join(' '),
      job.department,
      job.level
    ].join(' ').toLowerCase();
  }

  createCandidateText(candidate) {
    return [
      candidate.headline,
      candidate.skills.join(' '),
      candidate.resumeHighlights.join(' '),
      candidate.desiredRole
    ].join(' ').toLowerCase();
  }

  calculateTFIDFVector(text) {
    const tokens = natural.WordTokenizer().tokenize(text);
    const vector = {};
    
    tokens.forEach(token => {
      vector[token] = (vector[token] || 0) + 1;
    });

    return vector;
  }

  calculateCosineSimilarity(vectorA, vectorB) {
    const keysA = Object.keys(vectorA);
    const keysB = Object.keys(vectorB);
    const allKeys = new Set([...keysA, ...keysB]);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    allKeys.forEach(key => {
      const a = vectorA[key] || 0;
      const b = vectorB[key] || 0;
      
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    });

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  calculateSkillBonus(job, candidate) {
    const requiredSkills = job.requiredSkills;
    const candidateSkills = candidate.skills;
    
    const matchedSkills = requiredSkills.filter(skill => 
      candidateSkills.includes(skill)
    );
    
    const niceToHaveMatches = job.niceToHaveSkills.filter(skill => 
      candidateSkills.includes(skill)
    );

    const requiredMatchRatio = matchedSkills.length / requiredSkills.length;
    const niceToHaveBonus = niceToHaveMatches.length * 0.1;

    return Math.min(1, requiredMatchRatio + niceToHaveBonus);
  }

  extractTechSkills(terms) {
    const techSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'vue', 'angular',
      'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql',
      'aws', 'docker', 'kubernetes', 'git', 'linux', 'api', 'rest',
      'graphql', 'redis', 'elasticsearch', 'machine', 'learning', 'ai'
    ];

    return terms.filter(term => techSkills.includes(term));
  }

  extractExperienceYears(text) {
    const experienceRegex = /(\d+)\s*(?:years?|năm)\s*(?:of\s*)?(?:experience|kinh nghiệm)/i;
    const match = text.match(experienceRegex);
    return match ? parseInt(match[1]) : 0;
  }

  extractEducation(text) {
    const educationKeywords = ['bachelor', 'master', 'phd', 'university', 'college', 'đại học', 'thạc sĩ'];
    return educationKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  getJobById(jobId) {
    // This would typically fetch from database
    // For now, return mock data
    return {
      id: jobId,
      title: 'Senior Software Engineer',
      description: 'Build scalable web applications using modern technologies',
      requiredSkills: ['javascript', 'react', 'node', 'sql'],
      niceToHaveSkills: ['typescript', 'aws', 'docker'],
      department: 'Engineering',
      level: 'Senior'
    };
  }

  getCandidateById(candidateId) {
    // This would typically fetch from database
    // For now, return mock data
    return {
      id: candidateId,
      headline: 'Full-stack Developer with 5 years experience',
      skills: ['javascript', 'react', 'node', 'python'],
      resumeHighlights: ['Built scalable applications', 'Led team of 3 developers'],
      desiredRole: 'Senior Software Engineer'
    };
  }
}

module.exports = new AIService();

