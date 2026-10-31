export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  avatarUrl?: string;
  managerId?: string;
  managerName?: string;
  joinedDate: string;
  status: 'active' | 'on_leave';
  performanceScore: number; // 1.0 - 5.0
  activeGoalsCount: number;
  reviewStatus: 'completed' | 'in_progress' | 'pending_acknowledgement' | 'not_started';
}

export interface KPI {
  id: string;
  name: string;
  unit: string; // '%', 'ms', 'score', '$', 'units'
  targetValue: number;
  actualValue: number;
  weight: number; // percentage (e.g. 25)
  direction: 'higher_is_better' | 'lower_is_better';
  updateFrequency: 'weekly' | 'biweekly' | 'monthly';
  lastUpdated: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Strategic' | 'Operational' | 'Technical' | 'Leadership' | 'Growth';
  startDate: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  department: string;
  associatedKpiIds: string[];
  kpis?: KPI[];
  progressTrackingMethod: 'manual' | 'kpi_linked';
  progressPercentage: number;
  status: 'on_track' | 'at_risk' | 'completed' | 'delayed';
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    dueDate: string;
  }[];
}

export interface RatingCategoryScore {
  category: string;
  score: number; // 1 - 5
  comment: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  managerId: string;
  managerName: string;
  period: string; // e.g. "Q4 2026"
  goalCompletionRate: number; // %
  kpiAchievementRate: number; // %
  overallScore: number; // 1.0 - 5.0
  categoryScores: RatingCategoryScore[];
  writtenFeedback: {
    strengths: string;
    areasForGrowth: string;
    forwardLookingGoals: string;
  };
  status: 'draft' | 'published';
  publishedAt?: string;
  employeeAcknowledged: boolean;
  acknowledgedAt?: string;
  employeeComments?: string;
}

export interface Department {
  id: string;
  name: string;
  headName: string;
  headEmail: string;
  employeeCount: number;
  avgPerformance: number;
  budgetUtilization: number;
  activeGoals: number;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'calibration' | 'closed';
  completionRate: number;
  totalEligible: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: 'goal_created' | 'milestone_reached' | 'kpi_updated' | 'review_published' | 'feedback_given' | 'review_acknowledged';
  description: string;
  author: string;
  scoreDelta?: string;
  relatedId?: string;
}
