const { employees, candidates, jobOpenings, interviewSchedules } = require('../data/sampleData');

class HrService {
  constructor() {
    this.employees = employees;
    this.candidates = candidates;
    this.jobOpenings = jobOpenings;
    this.interviewSchedules = interviewSchedules;
  }

  // Employee methods
  getEmployees() {
    return this.employees;
  }

  getEmployeeById(id) {
    return this.employees.find(employee => employee.id === id);
  }

  getEmployeePerformance(id) {
    const employee = this.getEmployeeById(id);
    if (!employee) {
      return null;
    }

    const velocity = employee.performanceScore * 0.35 + employee.potentialScore * 0.4 + employee.engagementScore * 0.25;
    const growthTrajectory = Math.round((employee.potentialScore + employee.engagementScore) / 2);
    const successionReadiness = employee.potentialScore > 85 && employee.engagementScore > 80;

    const focusAreas = [];
    if (employee.engagementScore < 80) {
      focusAreas.push('Đẩy mạnh 1:1 và chương trình ghi nhận thành tích để tăng gắn kết.');
    }
    if (employee.performanceScore < 85) {
      focusAreas.push('Xây lộ trình coaching nâng cao hiệu suất dựa trên dữ liệu OKR.');
    }

    return {
      employee,
      velocity: Math.round(velocity),
      growthTrajectory,
      successionReadiness,
      focusAreas,
      learningPaths: this.buildLearningPaths(employee)
    };
  }

  // Candidate methods
  getCandidates() {
    return this.candidates;
  }

  // Job methods
  getJobs() {
    return this.jobOpenings.map(job => ({
      ...job,
      matches: this.calculateTopMatchesForJob(job, 3)
    }));
  }

  // Interview methods
  getInterviewSchedules() {
    return this.interviewSchedules;
  }

  // Analytics
  getAnalytics() {
    const activeContractors = this.employees.filter(emp => emp.employmentType !== 'Full-time').length;
    const openRoles = this.jobOpenings.filter(job => job.status === 'Open').length;
    const averageTimeToFill = 34;

    const candidatePipeline = this.candidates.reduce(
      (acc, candidate) => ({
        ...acc,
        [candidate.status]: (acc[candidate.status] || 0) + 1
      }),
      {
        Sourcing: 0,
        Screening: 0,
        Interviewing: 0,
        Offer: 0,
        Hired: 0
      }
    );

    const skillFrequency = new Map();
    this.jobOpenings.forEach(job => {
      job.requiredSkills.concat(job.niceToHaveSkills).forEach(skill => {
        skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
      });
    });

    const topSkills = Array.from(skillFrequency.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      headcount: this.employees.length,
      activeContractors,
      openRoles,
      averageTimeToFill,
      candidatePipeline,
      diversityRatio: 0.47,
      retentionRisk: 0.18,
      topSkillsInDemand: topSkills,
      learningEngagement: [
        { program: 'AI Literacy Program', completionRate: 0.82, uplift: 0.27 },
        { program: 'Leadership Accelerator', completionRate: 0.75, uplift: 0.19 },
        { program: 'Modern Recruiting Ops', completionRate: 0.68, uplift: 0.23 }
      ],
      productivityTrend: [
        { month: 'Nov', value: 72 },
        { month: 'Dec', value: 75 },
        { month: 'Jan', value: 79 },
        { month: 'Feb', value: 83 },
        { month: 'Mar', value: 84 }
      ]
    };
  }

  // AI Insights
  getWorkforceInsight() {
    const highPotentialEmployees = this.employees
      .filter(emp => emp.potentialScore > 85)
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        readinessWindow: emp.potentialScore > 90 ? '6 tháng' : '9-12 tháng'
      }));

    const teamsAtRisk = this.employees
      .filter(emp => emp.engagementScore < 80)
      .map(emp => ({
        department: emp.department,
        riskLevel: 'Medium',
        reason: `Điểm gắn kết ${emp.engagementScore} - khuyến nghị coaching với ${emp.manager}.`
      }));

    return {
      workforceStabilityIndex: 0.71,
      highPotentialEmployees,
      teamsAtRisk,
      hiringOpportunities: [
        { department: 'Product Design', recommendation: 'Bổ sung designer cấp Senior để giảm tải roadmap Q2.' },
        { department: 'People Operations', recommendation: 'Triển khai Data Analyst để tăng năng lực dự báo.' }
      ],
      automationOpportunities: [
        {
          process: 'Sàng lọc hồ sơ kỹ thuật',
          impact: 'Tiết kiệm 12 giờ/tuần cho đội tuyển dụng.',
          aiAssist: 'Áp dụng scoring tự động dựa trên skill graph.'
        },
        {
          process: 'Theo dõi OKR phòng ban',
          impact: 'Giảm 35% thời gian tổng hợp báo cáo.',
          aiAssist: 'Sinh insight hàng tuần từ dữ liệu hiệu suất.'
        }
      ],
      learningSuggestions: [
        { skill: 'Prompt Engineering cho HRBP', priority: 'High', audience: 'People Partners' },
        { skill: 'AI-assisted Interviewing', priority: 'Medium', audience: 'Recruiters' },
        { skill: 'Storytelling bằng dữ liệu', priority: 'Medium', audience: 'Toàn công ty' }
      ]
    };
  }

  // AI Methods
  summarizeCandidate(payload) {
    const candidate = payload.candidateId
      ? this.candidates.find(item => item.id === payload.candidateId)
      : null;

    if (!candidate) {
      return {
        summary: 'Không tìm thấy ứng viên trong hệ thống. Vui lòng cung cấp candidateId hợp lệ hoặc truyền thông tin chi tiết để hệ thống phân tích.'
      };
    }

    const focus = payload.narrativeFocus ?? 'career';
    const focusNarrative = {
      career: `Tổng quan sự nghiệp: ${candidate.name} có ${candidate.experienceYears} năm kinh nghiệm ở vai trò ${candidate.headline.toLowerCase()}.`,
      culture: `Phù hợp văn hóa: Điểm cultural fit ${candidate.culturalFitScore}/100 với các hành vi nổi bật về hợp tác và học hỏi nhanh.`,
      skills: `Năng lực chuyên môn: nổi bật ở ${candidate.skills.slice(0, 3).join(', ')} và vẫn có thể phát triển sâu hơn ở ${candidate.skills.slice(3).join(', ') || 'các kỹ năng bổ trợ'}.`
    }[focus];

    const learningRec = candidate.skills.includes('LLM Prompting')
      ? 'Có thể dẫn dắt các workshop nội bộ về ứng dụng GenAI trong HR.'
      : 'Đề xuất ghi danh khóa Prompt Engineering để tăng khả năng tương tác với hệ thống AI.';

    return {
      candidate,
      focus,
      summary: [
        focusNarrative,
        `Các thành tích nổi bật: ${candidate.resumeHighlights.join('; ')}.`,
        `Khuyến nghị phát triển: ${learningRec}`
      ].join(' ')
    };
  }

  matchCandidateToJob(payload) {
    const candidate = this.candidates.find(item => item.id === payload.candidateId);
    const job = this.jobOpenings.find(item => item.id === payload.jobId);

    if (!candidate || !job) {
      return {
        candidateId: payload.candidateId,
        jobId: payload.jobId,
        matchScore: 0,
        matchedSkills: [],
        missingSkills: [],
        recommendations: ['Không tìm thấy ứng viên hoặc vị trí phù hợp trong dữ liệu.']
      };
    }

    const matchedSkills = job.requiredSkills.filter(skill => candidate.skills.includes(skill));
    const missingSkills = job.requiredSkills.filter(skill => !candidate.skills.includes(skill));
    const niceMatches = job.niceToHaveSkills.filter(skill => candidate.skills.includes(skill));

    const baseScore = matchedSkills.length / job.requiredSkills.length;
    const experienceBoost = Math.min(candidate.experienceYears / 10, 0.2);
    const cultureBoost = candidate.culturalFitScore / 500;
    const matchScore = Math.round((baseScore + experienceBoost + cultureBoost + niceMatches.length * 0.05) * 100);

    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Gợi ý đào tạo nhanh về ${missingSkills.join(', ')} để đạt chuẩn yêu cầu.`);
    }
    if (candidate.status !== 'Interviewing') {
      recommendations.push('Đẩy ứng viên sang vòng phỏng vấn kỹ thuật trong 48 giờ.');
    }
    if (candidate.lastInteraction) {
      recommendations.push(`Gửi cập nhật pipeline trong vòng 24 giờ kể từ mốc ${candidate.lastInteraction}.`);
    }

    return {
      candidateId: candidate.id,
      jobId: job.id,
      matchScore,
      matchedSkills: matchedSkills.concat(niceMatches),
      missingSkills,
      recommendations
    };
  }

  generateInterviewFeedback(payload) {
    const candidate = this.candidates.find(item => item.id === payload.candidateId);
    const schedule = this.interviewSchedules.find(item => item.candidateId === payload.candidateId);

    const baseSummary = candidate
      ? `${candidate.name} thể hiện ${candidate.interviewScore >= 85 ? 'rất' : ''} tự tin trong vòng phỏng vấn.`
      : 'Ứng viên thể hiện tiềm năng, cần thêm dữ liệu để đánh giá đầy đủ.';

    const contextualNote = schedule
      ? `Vòng hiện tại: ${schedule.stage} với mức độ cảm xúc ${Math.round(schedule.sentimentScore * 100)}%.`
      : 'Chưa có lịch phỏng vấn trong hệ thống.';

    const strengths = payload.strengths?.length
      ? payload.strengths
      : candidate
        ? [`Kỹ năng nổi trội: ${candidate.skills.slice(0, 2).join(', ')}`]
        : ['Chưa xác định điểm mạnh rõ ràng.'];

    const improvements = payload.improvementAreas?.length
      ? payload.improvementAreas
      : ['Đề nghị bổ sung ví dụ định lượng để tăng tính thuyết phục.'];

    return {
      candidateId: payload.candidateId,
      narrative: `${baseSummary} ${contextualNote}`,
      strengths,
      improvementAreas: improvements,
      nextSteps: [
        'Gửi recap cho ứng viên trong 24 giờ.',
        'Cập nhật hệ thống ATS với feedback chuẩn hóa.',
        'Chuẩn bị bộ câu hỏi follow-up phù hợp với vòng tiếp theo.'
      ]
    };
  }

  // Private methods
  buildLearningPaths(employee) {
    const needsLeadership = employee.title.toLowerCase().includes('manager') || employee.title.toLowerCase().includes('lead');
    const needsTechnical = employee.department === 'Engineering' || employee.department === 'Data & AI';

    const paths = [];

    if (needsLeadership) {
      paths.push({
        name: 'Executive Coaching with AI Reflection',
        impact: 'Tăng 18% điểm lãnh đạo theo đánh giá 360 độ.',
        focus: 'Phát triển tư duy chiến lược và coaching đội ngũ.'
      });
    }

    if (needsTechnical) {
      paths.push({
        name: 'Modern Architecture for AI Products',
        impact: 'Rút ngắn 25% thời gian đưa tính năng ra thị trường.',
        focus: 'Thiết kế dịch vụ sự kiện và orchestration AI.'
      });
    }

    if (employee.engagementScore < 85) {
      paths.push({
        name: 'Well-being & Resilience Program',
        impact: 'Tăng điểm eNPS trung bình 12 điểm sau 6 tuần.',
        focus: 'Thiết lập thói quen bền vững và quản trị năng lượng.'
      });
    }

    return paths;
  }

  calculateTopMatchesForJob(job, topN) {
    const insights = this.candidates
      .map(candidate => this.matchCandidateToJob({ candidateId: candidate.id, jobId: job.id }))
      .sort((a, b) => b.matchScore - a.matchScore);

    return insights.slice(0, topN);
  }
}

module.exports = new HrService();
