import {
  User,
  Department,
  PerformanceCycle,
  Goal,
  PerformanceReview,
  TimelineEvent,
  UserRole
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_PERFORMANCE_CYCLES,
  INITIAL_GOALS,
  INITIAL_REVIEWS,
  INITIAL_TIMELINE
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'epms_users_v2',
  DEPARTMENTS: 'epms_departments_v2',
  CYCLES: 'epms_cycles_v2',
  GOALS: 'epms_goals_v2',
  REVIEWS: 'epms_reviews_v2',
  TIMELINE: 'epms_timeline_v2',
  CURRENT_USER_ID: 'epms_current_user_id_v2'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export class StorageService {
  static getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static saveUsers(users: User[]): void {
    safeSet(STORAGE_KEYS.USERS, users);
  }

  static getDepartments(): Department[] {
    return safeGet<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  static saveDepartments(depts: Department[]): void {
    safeSet(STORAGE_KEYS.DEPARTMENTS, depts);
  }

  static getCycles(): PerformanceCycle[] {
    return safeGet<PerformanceCycle[]>(STORAGE_KEYS.CYCLES, INITIAL_PERFORMANCE_CYCLES);
  }

  static saveCycles(cycles: PerformanceCycle[]): void {
    safeSet(STORAGE_KEYS.CYCLES, cycles);
  }

  static getGoals(): Goal[] {
    return safeGet<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  }

  static saveGoals(goals: Goal[]): void {
    safeSet(STORAGE_KEYS.GOALS, goals);
  }

  static getReviews(): PerformanceReview[] {
    return safeGet<PerformanceReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static saveReviews(reviews: PerformanceReview[]): void {
    safeSet(STORAGE_KEYS.REVIEWS, reviews);
  }

  static getTimeline(): TimelineEvent[] {
    return safeGet<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
  }

  static saveTimeline(events: TimelineEvent[]): void {
    safeSet(STORAGE_KEYS.TIMELINE, events);
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (storedId) {
      const match = users.find(u => u.id === storedId);
      if (match) return match;
    }
    // Default to Admin Elena Vance
    return users[0];
  }

  static setCurrentUser(userId: string): User {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    return this.getCurrentUser();
  }

  static addGoal(goal: Goal): void {
    const goals = this.getGoals();
    goals.unshift(goal);
    this.saveGoals(goals);

    // Add timeline event
    const events = this.getTimeline();
    events.unshift({
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: `New Goal Assigned: ${goal.title}`,
      type: 'goal_created',
      description: goal.description,
      author: 'Marcus Chen',
      relatedId: goal.id
    });
    this.saveTimeline(events);
  }

  static updateGoalProgress(goalId: string, progress: number, milestoneId?: string): void {
    const goals = this.getGoals();
    const target = goals.find(g => g.id === goalId);
    if (target) {
      target.progressPercentage = Math.min(100, Math.max(0, progress));
      if (target.progressPercentage === 100) {
        target.status = 'completed';
      } else if (target.progressPercentage < 40) {
        target.status = 'at_risk';
      } else {
        target.status = 'on_track';
      }
      if (milestoneId) {
        const ms = target.milestones.find(m => m.id === milestoneId);
        if (ms) ms.completed = true;
      }
      this.saveGoals(goals);

      // Record milestone timeline
      const events = this.getTimeline();
      events.unshift({
        id: `t_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `Goal Progress Updated to ${target.progressPercentage}%`,
        type: 'milestone_reached',
        description: `Progress updated on "${target.title}".`,
        author: target.assignedEmployeeName,
        relatedId: target.id
      });
      this.saveTimeline(events);
    }
  }

  static publishReview(review: PerformanceReview): void {
    const reviews = this.getReviews();
    const existingIndex = reviews.findIndex(r => r.id === review.id);
    const updatedReview = {
      ...review,
      status: 'published' as const,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = updatedReview;
    } else {
      reviews.unshift(updatedReview);
    }
    this.saveReviews(reviews);

    // Update employee status
    const users = this.getUsers();
    const emp = users.find(u => u.id === review.employeeId);
    if (emp) {
      emp.reviewStatus = 'pending_acknowledgement';
      emp.performanceScore = review.overallScore;
      this.saveUsers(users);
    }

    // Add timeline event
    const events = this.getTimeline();
    events.unshift({
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: `${review.period} Review Published for ${review.employeeName}`,
      type: 'review_published',
      description: `Evaluation score: ${review.overallScore}/5.0 by ${review.managerName}.`,
      author: review.managerName,
      scoreDelta: `${review.overallScore}/5.0`,
      relatedId: review.id
    });
    this.saveTimeline(events);
  }

  static acknowledgeReview(reviewId: string, comments?: string): void {
    const reviews = this.getReviews();
    const rev = reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.employeeAcknowledged = true;
      rev.acknowledgedAt = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
      if (comments) rev.employeeComments = comments;
      this.saveReviews(reviews);

      // Update employee status
      const users = this.getUsers();
      const emp = users.find(u => u.id === rev.employeeId);
      if (emp) {
        emp.reviewStatus = 'completed';
        this.saveUsers(users);
      }

      // Add timeline event
      const events = this.getTimeline();
      events.unshift({
        id: `t_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `${rev.period} Review Formally Acknowledged`,
        type: 'review_acknowledged',
        description: `Official acknowledgement verified by ${rev.employeeName}. Digital audit seal attached.`,
        author: rev.employeeName,
        relatedId: rev.id
      });
      this.saveTimeline(events);
    }
  }

  static addEmployee(user: User): void {
    const users = this.getUsers();
    users.unshift(user);
    this.saveUsers(users);

    // Update department count
    const depts = this.getDepartments();
    const dept = depts.find(d => d.name === user.department);
    if (dept) {
      dept.employeeCount += 1;
      this.saveDepartments(depts);
    }
  }

  static addCycle(cycle: PerformanceCycle): void {
    const cycles = this.getCycles();
    cycles.unshift(cycle);
    this.saveCycles(cycles);
  }

  static resetToDefault(): void {
    localStorage.clear();
  }
}
