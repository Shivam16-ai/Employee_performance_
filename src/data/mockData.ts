import { User, Department, PerformanceCycle, Goal, PerformanceReview, TimelineEvent } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Elena Vance',
    email: 'elena.vance@apex-epms.com',
    role: 'admin',
    designation: 'VP of Human Capital & Organization Strategy',
    department: 'People & Organization',
    joinedDate: '2021-03-15',
    status: 'active',
    performanceScore: 4.85,
    activeGoalsCount: 4,
    reviewStatus: 'completed',
  },
  {
    id: 'usr_mgr_chen',
    name: 'Marcus Chen',
    email: 'marcus.chen@apex-epms.com',
    role: 'manager',
    designation: 'Engineering Director, Enterprise Systems',
    department: 'Engineering & Technology',
    joinedDate: '2022-01-10',
    status: 'active',
    performanceScore: 4.7,
    activeGoalsCount: 6,
    reviewStatus: 'completed',
  },
  {
    id: 'usr_emp_jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@apex-epms.com',
    role: 'employee',
    designation: 'Senior Cloud Systems Architect',
    department: 'Engineering & Technology',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    joinedDate: '2023-06-01',
    status: 'active',
    performanceScore: 4.6,
    activeGoalsCount: 3,
    reviewStatus: 'pending_acknowledgement',
  },
  {
    id: 'usr_emp_okafor',
    name: 'David Okafor',
    email: 'david.okafor@apex-epms.com',
    role: 'employee',
    designation: 'Staff Product Designer & Systems Lead',
    department: 'Product & Architecture',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    joinedDate: '2023-09-12',
    status: 'active',
    performanceScore: 4.4,
    activeGoalsCount: 3,
    reviewStatus: 'completed',
  },
  {
    id: 'usr_emp_patel',
    name: 'Aisha Patel',
    email: 'aisha.patel@apex-epms.com',
    role: 'employee',
    designation: 'Principal Machine Learning Engineer',
    department: 'Engineering & Technology',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    joinedDate: '2022-11-20',
    status: 'active',
    performanceScore: 4.9,
    activeGoalsCount: 4,
    reviewStatus: 'completed',
  },
  {
    id: 'usr_emp_torres',
    name: 'Carlos Torres',
    email: 'carlos.torres@apex-epms.com',
    role: 'employee',
    designation: 'Quantitative Risk Analyst',
    department: 'Quantitative Research',
    joinedDate: '2024-02-01',
    status: 'active',
    performanceScore: 3.9,
    activeGoalsCount: 2,
    reviewStatus: 'in_progress',
  },
  {
    id: 'usr_emp_zhao',
    name: 'Mei-Ling Zhao',
    email: 'meiling.zhao@apex-epms.com',
    role: 'employee',
    designation: 'Senior Infrastructure SRE',
    department: 'Engineering & Technology',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    joinedDate: '2023-04-15',
    status: 'active',
    performanceScore: 4.3,
    activeGoalsCount: 3,
    reviewStatus: 'completed',
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_eng',
    name: 'Engineering & Technology',
    headName: 'Marcus Chen',
    headEmail: 'marcus.chen@apex-epms.com',
    employeeCount: 34,
    avgPerformance: 4.52,
    budgetUtilization: 94.2,
    activeGoals: 78
  },
  {
    id: 'dept_prod',
    name: 'Product & Architecture',
    headName: 'Nadia Solis',
    headEmail: 'nadia.solis@apex-epms.com',
    employeeCount: 18,
    avgPerformance: 4.41,
    budgetUtilization: 89.6,
    activeGoals: 42
  },
  {
    id: 'dept_quant',
    name: 'Quantitative Research',
    headName: 'Julian Sterling',
    headEmail: 'julian.sterling@apex-epms.com',
    employeeCount: 12,
    avgPerformance: 4.68,
    budgetUtilization: 91.0,
    activeGoals: 31
  },
  {
    id: 'dept_ops',
    name: 'Global Operations',
    headName: 'Evelyn Brooks',
    headEmail: 'evelyn.brooks@apex-epms.com',
    employeeCount: 22,
    avgPerformance: 4.25,
    budgetUtilization: 86.4,
    activeGoals: 49
  },
  {
    id: 'dept_hr',
    name: 'People & Organization',
    headName: 'Elena Vance',
    headEmail: 'elena.vance@apex-epms.com',
    employeeCount: 8,
    avgPerformance: 4.75,
    budgetUtilization: 98.1,
    activeGoals: 19
  }
];

export const INITIAL_PERFORMANCE_CYCLES: PerformanceCycle[] = [
  {
    id: 'cycle_q4_2026',
    name: 'Q4 2026 Executive Performance Cycle',
    quarter: 'Q4',
    year: 2026,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    status: 'active',
    completionRate: 78.4,
    totalEligible: 94
  },
  {
    id: 'cycle_q3_2026',
    name: 'Q3 2026 Mid-Year Strategic Evaluation',
    quarter: 'Q3',
    year: 2026,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 'closed',
    completionRate: 100.0,
    totalEligible: 88
  },
  {
    id: 'cycle_q1_2027',
    name: 'Q1 2027 Annual Strategic Horizon',
    quarter: 'Q1',
    year: 2027,
    startDate: '2027-01-01',
    endDate: '2027-03-31',
    status: 'upcoming',
    completionRate: 0.0,
    totalEligible: 102
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_01',
    title: 'Zero-Downtime Distributed Database Migration',
    description: 'Lead architecture transition of core transaction engine to geo-replicated partitioned storage with sub-15ms p99 latency guarantees.',
    category: 'Technical',
    startDate: '2026-10-05',
    deadline: '2026-12-15',
    priority: 'urgent',
    assignedEmployeeId: 'usr_emp_jenkins',
    assignedEmployeeName: 'Sarah Jenkins',
    department: 'Engineering & Technology',
    associatedKpiIds: ['kpi_01', 'kpi_02'],
    kpis: [
      {
        id: 'kpi_01',
        name: 'P99 Latency SLA Target',
        unit: 'ms',
        targetValue: 15,
        actualValue: 13.8,
        weight: 60,
        direction: 'lower_is_better',
        updateFrequency: 'weekly',
        lastUpdated: '2026-10-28'
      },
      {
        id: 'kpi_02',
        name: 'Data Consistency Check Passed',
        unit: '%',
        targetValue: 100,
        actualValue: 100,
        weight: 40,
        direction: 'higher_is_better',
        updateFrequency: 'weekly',
        lastUpdated: '2026-10-28'
      }
    ],
    progressTrackingMethod: 'kpi_linked',
    progressPercentage: 88,
    status: 'on_track',
    milestones: [
      { id: 'm1', title: 'Schema isolation & shadow traffic replication', completed: true, dueDate: '2026-10-20' },
      { id: 'm2', title: 'Failover resilience drill under 50k QPS simulation', completed: true, dueDate: '2026-11-05' },
      { id: 'm3', title: 'Final read-write master cutover validation', completed: false, dueDate: '2026-12-10' }
    ]
  },
  {
    id: 'goal_02',
    title: 'Design System Unification Across Enterprise Suites',
    description: 'Synthesize tokenized component architecture across 4 flagship corporate products with strict AA accessibility compliance.',
    category: 'Operational',
    startDate: '2026-10-01',
    deadline: '2026-12-20',
    priority: 'high',
    assignedEmployeeId: 'usr_emp_okafor',
    assignedEmployeeName: 'David Okafor',
    department: 'Product & Architecture',
    associatedKpiIds: ['kpi_03'],
    kpis: [
      {
        id: 'kpi_03',
        name: 'Design System Adoption Rate',
        unit: '%',
        targetValue: 90,
        actualValue: 84,
        weight: 100,
        direction: 'higher_is_better',
        updateFrequency: 'biweekly',
        lastUpdated: '2026-10-27'
      }
    ],
    progressTrackingMethod: 'manual',
    progressPercentage: 75,
    status: 'on_track',
    milestones: [
      { id: 'm4', title: 'Audit legacy color and typography tokens', completed: true, dueDate: '2026-10-15' },
      { id: 'm5', title: 'Figma and React variable synchronization bridge', completed: true, dueDate: '2026-11-10' },
      { id: 'm6', title: 'Developer component documentation published', completed: false, dueDate: '2026-12-15' }
    ]
  },
  {
    id: 'goal_03',
    title: 'Distributed Inference Pipeline Optimization',
    description: 'Deploy quantised LLM inference serving layer targeting 3.2x throughput increase for real-time document intelligence.',
    category: 'Strategic',
    startDate: '2026-10-01',
    deadline: '2026-12-30',
    priority: 'urgent',
    assignedEmployeeId: 'usr_emp_patel',
    assignedEmployeeName: 'Aisha Patel',
    department: 'Engineering & Technology',
    associatedKpiIds: ['kpi_04'],
    kpis: [
      {
        id: 'kpi_04',
        name: 'Inference Throughput (tokens/sec)',
        unit: 'tokens/s',
        targetValue: 3200,
        actualValue: 3450,
        weight: 100,
        direction: 'higher_is_better',
        updateFrequency: 'weekly',
        lastUpdated: '2026-10-29'
      }
    ],
    progressTrackingMethod: 'kpi_linked',
    progressPercentage: 95,
    status: 'completed',
    milestones: [
      { id: 'm7', title: 'Kernel optimization & TensorRT engine compilation', completed: true, dueDate: '2026-10-25' },
      { id: 'm8', title: 'Multi-GPU dynamic batching runtime', completed: true, dueDate: '2026-11-15' },
      { id: 'm9', title: 'Production stress benchmark report', completed: true, dueDate: '2026-12-01' }
    ]
  },
  {
    id: 'goal_04',
    title: 'Internal Engineering Mentorship & Knowledge Transfer',
    description: 'Organize biweekly distributed systems symposiums and mentor 2 junior engineers through system design milestones.',
    category: 'Leadership',
    startDate: '2026-10-01',
    deadline: '2026-12-31',
    priority: 'medium',
    assignedEmployeeId: 'usr_emp_jenkins',
    assignedEmployeeName: 'Sarah Jenkins',
    department: 'Engineering & Technology',
    associatedKpiIds: ['kpi_05'],
    kpis: [
      {
        id: 'kpi_05',
        name: 'Symposium Sessions Completed',
        unit: 'sessions',
        targetValue: 6,
        actualValue: 4,
        weight: 100,
        direction: 'higher_is_better',
        updateFrequency: 'biweekly',
        lastUpdated: '2026-10-26'
      }
    ],
    progressTrackingMethod: 'manual',
    progressPercentage: 67,
    status: 'on_track',
    milestones: [
      { id: 'm10', title: 'Curriculum definition & guest speaker schedule', completed: true, dueDate: '2026-10-12' },
      { id: 'm11', title: 'Mid-quarter mentee design review assessments', completed: true, dueDate: '2026-11-20' },
      { id: 'm12', title: 'Final architecture showcase presentation', completed: false, dueDate: '2026-12-28' }
    ]
  }
];

export const INITIAL_REVIEWS: PerformanceReview[] = [
  {
    id: 'rev_q4_jenkins',
    employeeId: 'usr_emp_jenkins',
    employeeName: 'Sarah Jenkins',
    employeeRole: 'Senior Cloud Systems Architect',
    department: 'Engineering & Technology',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    period: 'Q4 2026',
    goalCompletionRate: 88,
    kpiAchievementRate: 94,
    overallScore: 4.7,
    categoryScores: [
      { category: 'Strategic Execution', score: 5, comment: 'Exceptional ownership of the zero-downtime database overhaul; completed migration ahead of risk threshold.' },
      { category: 'Technical Excellence', score: 5, comment: 'High technical rigor; architected fault-tolerant patterns that prevented systemic failures.' },
      { category: 'Collaborative Leadership', score: 4, comment: 'Strong empathy and mentoring across junior engineers during biweekly symposiums.' },
      { category: 'Innovation & Impact', score: 5, comment: 'Pioneered shadow traffic replication tooling now adopted department-wide.' }
    ],
    writtenFeedback: {
      strengths: 'Sarah consistently displays deep architectural foresight, rigorous benchmarking standards, and a calming influence during critical incident investigations.',
      areasForGrowth: 'Consider delegating the initial exploratory prototyping phases to junior staff to multiply organizational leverage and scale technical leadership further.',
      forwardLookingGoals: 'Lead the multi-region failover initiative in Q1 2027 and serve as primary architecture sponsor for the upcoming Infrastructure Guild.'
    },
    status: 'published',
    publishedAt: '2026-10-28 17:30 UTC',
    employeeAcknowledged: false
  },
  {
    id: 'rev_q4_okafor',
    employeeId: 'usr_emp_okafor',
    employeeName: 'David Okafor',
    employeeRole: 'Staff Product Designer & Systems Lead',
    department: 'Product & Architecture',
    managerId: 'usr_mgr_chen',
    managerName: 'Marcus Chen',
    period: 'Q4 2026',
    goalCompletionRate: 75,
    kpiAchievementRate: 85,
    overallScore: 4.4,
    categoryScores: [
      { category: 'Strategic Execution', score: 4, comment: 'Clear alignment with product roadmaps and robust sprint delivery.' },
      { category: 'Technical Excellence', score: 5, comment: 'Unrivaled token precision and strict adherence to WCAG AA accessibility standards.' },
      { category: 'Collaborative Leadership', score: 4, comment: 'Effective cross-functional bridges between engineering and product managers.' },
      { category: 'Innovation & Impact', score: 4, comment: 'Modernized the unified component catalog across 4 disparate products.' }
    ],
    writtenFeedback: {
      strengths: 'David brings unmatched craft and design integrity to enterprise workflows, simplifying complex data interactions into intuitive canvases.',
      areasForGrowth: 'Accelerate the documentation pipeline to prevent front-end engineers from unblocking custom styling patterns independently.',
      forwardLookingGoals: 'Expand the design system to support localized RTL layouts and dense financial data grids.'
    },
    status: 'published',
    publishedAt: '2026-10-25 14:15 UTC',
    employeeAcknowledged: true,
    acknowledgedAt: '2026-10-26 09:40 UTC',
    employeeComments: 'Grateful for the constructive feedback regarding component documentation velocity. Excited for the multi-region expansions!'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    date: '2026-10-28',
    title: 'Q4 2026 Performance Review Published',
    type: 'review_published',
    description: 'Marcus Chen completed and officially published the Q4 2026 Performance Review. Overall rating: 4.7 / 5.0 (Exceeds Expectations).',
    author: 'Marcus Chen',
    scoreDelta: '+0.2 from Q3',
    relatedId: 'rev_q4_jenkins'
  },
  {
    id: 't2',
    date: '2026-10-24',
    title: 'Database Migration Milestone Validated',
    type: 'milestone_reached',
    description: 'Failover resilience drill successfully concluded with 50,000 QPS load test simulation showing zero dropped connections.',
    author: 'Sarah Jenkins',
    relatedId: 'goal_01'
  },
  {
    id: 't3',
    date: '2026-10-18',
    title: 'P99 Latency KPI Benchmark Recorded',
    type: 'kpi_updated',
    description: 'Telemetry captured 13.8ms p99 latency against target SLA of 15.0ms (108% achievement rate).',
    author: 'System Telemetry',
    scoreDelta: '13.8ms',
    relatedId: 'kpi_01'
  },
  {
    id: 't4',
    date: '2026-10-05',
    title: 'New Strategic Goal Assigned',
    type: 'goal_created',
    description: 'Assigned "Zero-Downtime Distributed Database Migration" by Marcus Chen with urgent priority and Q4 deadline.',
    author: 'Marcus Chen',
    relatedId: 'goal_01'
  },
  {
    id: 't5',
    date: '2026-09-30',
    title: 'Q3 2026 Performance Review Acknowledged',
    type: 'review_acknowledged',
    description: 'Official acknowledgement signature confirmed by Sarah Jenkins with overall rating of 4.5 / 5.0.',
    author: 'Sarah Jenkins',
    scoreDelta: '4.5 / 5.0'
  }
];

export const CINEMATIC_WORKPLACE_SCENES = [
  {
    id: 'scene_boardroom_dusk',
    title: 'Executive Strategic Boardroom',
    subtitle: 'High-Altitude Governance & Strategy',
    image: '/assets/aistudio/image_e877ba8d.png',
    timecode: '00:14:08',
    location: 'Tower One — Floor 68',
    cameraMotion: 'Slow cinematic push-in across polished granite reflection',
    aperture: 'f/2.8 · 50mm Anamorphic'
  },
  {
    id: 'scene_glass_facade',
    title: 'Global Innovation Headquarters',
    subtitle: 'Architectural Transparency & Scale',
    image: '/assets/aistudio/image_ff9dfd3f.png',
    timecode: '00:28:16',
    location: 'Corporate Campus Alpha',
    cameraMotion: 'Slow horizontal pedestal pan along illuminated atrium',
    aperture: 'f/4.0 · 35mm Prime'
  },
  {
    id: 'scene_wood_penthouse',
    title: 'Executive Leadership Suite',
    subtitle: 'Confidential Performance Calibration',
    image: '/assets/aistudio/image_166c1911.png',
    timecode: '00:45:22',
    location: 'Manhattan Sky Suite',
    cameraMotion: 'Gentle tilt-up showcasing vaulted architectural ceiling',
    aperture: 'f/2.0 · 40mm Cine'
  },
  {
    id: 'scene_marble_fireplace',
    title: 'Corner Office Architecture',
    subtitle: 'Continuous Mentorship & Alignment',
    image: '/assets/aistudio/image_60252676.png',
    timecode: '01:02:11',
    location: 'Horizon Tower — Suite 520',
    cameraMotion: 'Slow diagonal glide toward panoramic metropolitan view',
    aperture: 'f/2.8 · 28mm Wide'
  },
  {
    id: 'scene_gold_conference',
    title: 'Executive Council Chamber',
    subtitle: 'Annual Performance & Compensation Review',
    image: '/assets/aistudio/image_1a75d416.png',
    timecode: '01:19:04',
    location: 'Metropolitan Core Room 1',
    cameraMotion: 'Controlled slow tracking shot with deep cinematic perspective',
    aperture: 'f/1.8 · 85mm Portrait'
  }
];
