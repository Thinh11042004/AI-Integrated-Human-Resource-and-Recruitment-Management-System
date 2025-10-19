const employees = [
  {
    id: 'EMP-001',
    name: 'Lan Nguyen',
    title: 'Engineering Manager',
    department: 'Engineering',
    location: 'Ho Chi Minh City',
    manager: 'Hoang Tran',
    employmentType: 'Full-time',
    startDate: '2017-04-10',
    skills: ['Leadership', 'React', 'Node.js', 'Team Coaching', 'OKRs'],
    salary: 4200,
    performanceScore: 92,
    potentialScore: 88,
    engagementScore: 86,
    lastPromotionDate: '2022-07-01',
    currentProjects: ['Talent Analytics Platform', 'AI Interview Coach'],
    certifications: ['Professional Scrum Master', 'Strategic Leadership']
  },
  {
    id: 'EMP-002',
    name: 'Minh Pham',
    title: 'Senior Data Scientist',
    department: 'Data & AI',
    location: 'Ha Noi',
    manager: 'Lan Nguyen',
    employmentType: 'Full-time',
    startDate: '2019-01-15',
    skills: ['Python', 'Machine Learning', 'LLM Ops', 'SQL', 'Azure ML'],
    salary: 3800,
    performanceScore: 95,
    potentialScore: 91,
    engagementScore: 90,
    lastPromotionDate: '2023-04-01',
    currentProjects: ['Skill Graph Intelligence', 'Interview Sentiment Analysis'],
    certifications: ['TensorFlow Developer', 'Azure Data Scientist']
  },
  {
    id: 'EMP-003',
    name: 'Thu Le',
    title: 'People Partner',
    department: 'People Operations',
    location: 'Da Nang',
    manager: 'Hoang Tran',
    employmentType: 'Full-time',
    startDate: '2020-09-01',
    skills: ['Employee Relations', 'Compensation', 'DEI', 'People Analytics'],
    salary: 2900,
    performanceScore: 87,
    potentialScore: 84,
    engagementScore: 93,
    lastPromotionDate: '2023-01-12',
    currentProjects: ['Remote Culture Program', 'Leadership Enablement'],
    certifications: ['SHRM-CP', 'People Analytics Certificate']
  },
  {
    id: 'EMP-004',
    name: 'Tuan Bui',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote - Singapore',
    manager: 'Lan Nguyen',
    employmentType: 'Contract',
    startDate: '2021-03-18',
    skills: ['TypeScript', 'Next.js', 'Design Systems', 'Web Performance'],
    salary: 3600,
    performanceScore: 89,
    potentialScore: 80,
    engagementScore: 82,
    lastPromotionDate: '2022-11-01',
    currentProjects: ['Unified Talent Portal'],
    certifications: ['AWS Developer Associate']
  }
];

const candidates = [
  {
    id: 'CAN-101',
    name: 'Quynh Vo',
    headline: 'Staff Product Designer focused on B2B SaaS',
    experienceYears: 8,
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'AI UX'],
    desiredRole: 'Lead Product Designer',
    location: 'Ho Chi Minh City',
    status: 'Interviewing',
    interviewScore: 86,
    culturalFitScore: 88,
    resumeHighlights: [
      'Scaled design system across 5 product lines',
      'Led AI-assisted onboarding redesign with +25% activation'
    ],
    lastInteraction: '2024-03-01'
  },
  {
    id: 'CAN-102',
    name: 'Hai Dang',
    headline: 'Full-stack Engineer specialized in HR Tech',
    experienceYears: 6,
    skills: ['Node.js', 'React', 'GraphQL', 'Microservices', 'AWS'],
    desiredRole: 'Senior Software Engineer',
    location: 'Remote - Kuala Lumpur',
    status: 'Screening',
    interviewScore: 80,
    culturalFitScore: 78,
    resumeHighlights: [
      'Built recruitment automation platform processing 1M resumes/year',
      'Optimized time-to-offer by 32% via workflow orchestration'
    ],
    lastInteraction: '2024-02-27'
  },
  {
    id: 'CAN-103',
    name: 'Trang Ho',
    headline: 'People Analytics Specialist with NLP background',
    experienceYears: 5,
    skills: ['Python', 'PowerBI', 'LLM Prompting', 'SQL', 'Storytelling'],
    desiredRole: 'People Analytics Lead',
    location: 'Ha Noi',
    status: 'Offer',
    interviewScore: 92,
    culturalFitScore: 90,
    resumeHighlights: [
      'Implemented attrition early warning scoring with 89% recall',
      'Rolled out learning personalization engine used by 5k employees'
    ],
    lastInteraction: '2024-03-03'
  }
];

const jobOpenings = [
  {
    id: 'JOB-9001',
    title: 'Lead Product Designer',
    department: 'Product Design',
    level: 'Lead',
    status: 'Open',
    locations: ['Ho Chi Minh City', 'Remote'],
    salaryRange: [3800, 5200],
    requiredSkills: ['Figma', 'Design Systems', 'User Research'],
    niceToHaveSkills: ['Motion Design', 'AI UX'],
    openings: 1,
    postedAt: '2024-02-10',
    hiringManager: 'Lan Nguyen',
    description: 'Lead the end-to-end design strategy for our talent intelligence products with strong focus on experimentation.'
  },
  {
    id: 'JOB-9002',
    title: 'Senior Software Engineer (Talent Intelligence)',
    department: 'Engineering',
    level: 'Senior',
    status: 'Open',
    locations: ['Remote - APAC'],
    salaryRange: [4200, 5800],
    requiredSkills: ['Node.js', 'React', 'Microservices', 'Event-driven Architecture'],
    niceToHaveSkills: ['LLM Ops', 'Elasticsearch'],
    openings: 2,
    postedAt: '2024-02-22',
    hiringManager: 'Lan Nguyen',
    description: 'Build AI-assisted hiring workflows and human capital knowledge graph services.'
  },
  {
    id: 'JOB-9003',
    title: 'People Analytics Lead',
    department: 'People Operations',
    level: 'Senior',
    status: 'On Hold',
    locations: ['Ha Noi', 'Remote'],
    salaryRange: [3600, 4800],
    requiredSkills: ['SQL', 'Python', 'People Analytics'],
    niceToHaveSkills: ['LLM Prompting', 'Storytelling'],
    openings: 1,
    postedAt: '2024-01-31',
    hiringManager: 'Hoang Tran',
    description: 'Drive talent insights and predictive people strategy partnering with leadership and operations teams.'
  }
];

const interviewSchedules = [
  {
    id: 'INT-5001',
    candidateId: 'CAN-101',
    jobId: 'JOB-9001',
    stage: 'Portfolio Review',
    interviewers: ['Lan Nguyen', 'Tuan Bui'],
    scheduledAt: '2024-03-06T09:30:00+07:00',
    feedbackSummary: 'Great storytelling, would like to probe design ops experience further.',
    sentimentScore: 0.74
  },
  {
    id: 'INT-5002',
    candidateId: 'CAN-102',
    jobId: 'JOB-9002',
    stage: 'Technical Deep Dive',
    interviewers: ['Minh Pham'],
    scheduledAt: '2024-03-05T14:00:00+07:00',
    feedbackSummary: 'Strong system design thinking, needs clarity on async processing patterns.',
    sentimentScore: 0.68
  },
  {
    id: 'INT-5003',
    candidateId: 'CAN-103',
    jobId: 'JOB-9003',
    stage: 'Executive Interview',
    interviewers: ['Hoang Tran'],
    scheduledAt: '2024-03-04T16:00:00+07:00',
    feedbackSummary: 'Exceptional business storytelling and stakeholder influence.',
    sentimentScore: 0.82
  }
];

module.exports = {
  employees,
  candidates,
  jobOpenings,
  interviewSchedules
};
