import { PerformanceRepository } from '../repositories/performanceRepository.js';
import { EmployeeRepository } from '../repositories/employeeRepository.js';
import { ReviewRepository } from '../repositories/reviewRepository.js';
import { GoalRepository } from '../repositories/goalRepository.js';
import { GoalProgressService } from './goalProgressService.js';
import { AppError } from '../middleware/errorHandler.js';

export class PerformanceService {
  /**
   * Generates a frozen historical snapshot of an employee's performance for a given cycle.
   */
  static async generateEmployeeSnapshot(employeeId: string, reviewCycleId: string) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee) {
      throw new AppError(`Employee '${employeeId}' not found`, 404);
    }

    const cycle = await ReviewRepository.findCycleById(reviewCycleId);
    if (!cycle) {
      throw new AppError(`Review cycle '${reviewCycleId}' not found`, 404);
    }

    // 1. Fetch Goals and calculate aggregate KPI progress
    const goalsResult = await GoalRepository.findMany({ employeeId, limit: 100 });
    const goals = goalsResult.data;

    let totalGoalProgress = 0;
    const goalSummaries = [];

    for (const g of goals) {
      const calc = await GoalProgressService.calculateGoalProgress(g.id);
      totalGoalProgress += calc.combinedProgress;
      goalSummaries.push({
        goalId: g.id,
        title: g.title,
        progress: calc.combinedProgress,
        kpiProgress: calc.kpiProgress,
      });
    }

    const averageGoalProgress = goals.length > 0 ? totalGoalProgress / goals.length : 0;

    // 2. Fetch Review and Ratings
    const review = await ReviewRepository.findReviewByEmployeeAndCycle(employeeId, reviewCycleId);
    const managerRating = review && review.overallScore ? Number(review.overallScore) : 0;

    // 3. Composite score (e.g. 50% Goal KPI delivery + 50% Manager Evaluation Rating normalized to 5.0)
    // KPI delivery (0-100) normalized to 5 scale: (avgGoalProgress / 100) * 5
    const normalizedKpiScore = (averageGoalProgress / 100) * 5;
    const overallCompositeScore = managerRating > 0
      ? (normalizedKpiScore * 0.5) + (managerRating * 0.5)
      : normalizedKpiScore;

    const snapshotData = {
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.employeeCode,
      department: employee.department.name,
      designation: employee.designation,
      reviewCycleName: cycle.name,
      goalsEvaluatedCount: goals.length,
      goals: goalSummaries,
      reviewStatus: review ? review.status : 'NO_REVIEW',
      reviewPublishedAt: review?.publishedAt,
      reviewAcknowledgedAt: review?.acknowledgedAt,
    };

    return PerformanceRepository.upsertSnapshot({
      employeeId,
      reviewCycleId,
      overallScore: Number(overallCompositeScore.toFixed(2)),
      kpiAchievementScore: Number(averageGoalProgress.toFixed(2)),
      managerRating: Number(managerRating.toFixed(2)),
      snapshotData,
    });
  }

  static async getEmployeeSnapshot(employeeId: string, reviewCycleId: string) {
    const snapshot = await PerformanceRepository.findSnapshot(employeeId, reviewCycleId);
    if (!snapshot) {
      throw new AppError('Performance snapshot not found for this employee and cycle', 404);
    }
    return snapshot;
  }

  static async getDepartmentSummary(departmentId: string, reviewCycleId: string) {
    return PerformanceRepository.getDepartmentPerformanceSummary(departmentId, reviewCycleId);
  }
}
