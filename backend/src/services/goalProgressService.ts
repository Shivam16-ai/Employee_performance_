import { MeasurementDirection, ProgressMode, GoalStatus } from '../generated/prisma/client.js';
import { GoalRepository } from '../repositories/goalRepository.js';
import { prisma } from '../lib/prisma.js';

export interface KPIProgressResult {
  goalKpiId: string;
  kpiName: string;
  targetValue: number;
  actualValue: number;
  direction: MeasurementDirection;
  weight: number;
  achievementPercentage: number;
  weightedContribution: number;
}

export interface GoalProgressCalculationResult {
  goalId: string;
  mode: ProgressMode;
  manualProgress: number;
  manualWeight: number;
  kpiProgress: number;
  kpiWeight: number;
  combinedProgress: number;
  recommendedStatus: GoalStatus;
  kpiBreakdown: KPIProgressResult[];
}

export class GoalProgressService {
  /**
   * Calculates individual KPI achievement percentage based on measurement direction.
   * Handles edge cases such as zero targets and zero actuals gracefully.
   * Clamps individual achievement between 0% and 100% (or up to 100 for goal delivery).
   */
  static calculateKPIAchievement(
    target: number,
    actual: number,
    direction: MeasurementDirection = MeasurementDirection.HIGHER_IS_BETTER
  ): number {
    // Edge case 1: Target is zero or negative
    if (target <= 0) {
      if (direction === MeasurementDirection.HIGHER_IS_BETTER) {
        return actual >= 0 ? 100 : 0;
      } else {
        // Lower is better with target 0 (e.g. 0 defects)
        return actual <= 0 ? 100 : Math.max(0, 100 - actual * 10);
      }
    }

    // Edge case 2: Actual is zero
    if (actual <= 0) {
      if (direction === MeasurementDirection.HIGHER_IS_BETTER) {
        return 0;
      } else {
        // Lower is better and actual is 0 (0 downtime, 0 bugs) -> perfect achievement
        return 100;
      }
    }

    let percentage: number;
    if (direction === MeasurementDirection.HIGHER_IS_BETTER) {
      percentage = (actual / target) * 100;
    } else {
      // Lower is better (e.g. Target: 5 days, Actual: 4 days -> 125% -> capped at 100)
      percentage = (target / actual) * 100;
    }

    // Sensible boundary caps: [0, 100]
    return Math.min(100, Math.max(0, Number(percentage.toFixed(2))));
  }

  /**
   * Calculates overall goal progress combining manual progress and weighted KPI achievements.
   */
  static async calculateGoalProgress(goalId: string): Promise<GoalProgressCalculationResult> {
    const goal = await GoalRepository.findByIdWithDetails(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }

    const manualProgress = Number(goal.manualProgress);
    const manualWeight = Number(goal.manualWeight);
    const kpiWeight = Number(goal.kpiWeight);

    let kpiBreakdown: KPIProgressResult[] = [];
    let kpiTotalProgress = 0;

    if (goal.goalKpis && goal.goalKpis.length > 0) {
      let totalNormalizedWeight = 0;

      for (const gk of goal.goalKpis) {
        const target = Number(gk.targetValue);
        const weight = Number(gk.weight);
        totalNormalizedWeight += weight;

        // Fetch latest record or default to 0
        const latestRecord = gk.kpiRecords && gk.kpiRecords.length > 0 ? gk.kpiRecords[0] : null;
        const actual = latestRecord ? Number(latestRecord.actualValue) : 0;

        const achievement = this.calculateKPIAchievement(
          target,
          actual,
          gk.kpi.measurementDirection
        );

        const contribution = (achievement * weight) / 100;
        kpiTotalProgress += contribution;

        kpiBreakdown.push({
          goalKpiId: gk.id,
          kpiName: gk.kpi.name,
          targetValue: target,
          actualValue: actual,
          direction: gk.kpi.measurementDirection,
          weight,
          achievementPercentage: achievement,
          weightedContribution: Number(contribution.toFixed(2)),
        });
      }

      // If total weights were less than 100%, normalize
      if (totalNormalizedWeight > 0 && totalNormalizedWeight !== 100) {
        kpiTotalProgress = (kpiTotalProgress / totalNormalizedWeight) * 100;
      }
    }

    kpiTotalProgress = Math.min(100, Math.max(0, Number(kpiTotalProgress.toFixed(2))));

    // Determine combined progress based on mode
    let combinedProgress: number;
    if (goal.progressMode === ProgressMode.MANUAL) {
      combinedProgress = manualProgress;
    } else if (goal.progressMode === ProgressMode.AUTOMATIC) {
      combinedProgress = kpiTotalProgress;
    } else {
      // HYBRID
      combinedProgress =
        (manualProgress * manualWeight) / 100 + (kpiTotalProgress * kpiWeight) / 100;
    }

    combinedProgress = Math.min(100, Math.max(0, Number(combinedProgress.toFixed(2))));

    // Status recommendation
    let recommendedStatus = goal.status;
    if (combinedProgress === 100) {
      recommendedStatus = GoalStatus.COMPLETED;
    } else if (combinedProgress >= 40) {
      recommendedStatus = GoalStatus.ON_TRACK;
    } else if (combinedProgress > 0 && combinedProgress < 40) {
      recommendedStatus = GoalStatus.AT_RISK;
    }

    return {
      goalId,
      mode: goal.progressMode,
      manualProgress,
      manualWeight,
      kpiProgress: kpiTotalProgress,
      kpiWeight,
      combinedProgress,
      recommendedStatus,
      kpiBreakdown,
    };
  }

  /**
   * Recalculates and persists progress for a goal, logging history if progress changed.
   */
  static async syncGoalProgress(
    goalId: string,
    changedBy: string,
    changeReason: string
  ): Promise<number> {
    const calculation = await this.calculateGoalProgress(goalId);
    const goal = await GoalRepository.findById(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);

    const prevProgress = Number(goal.calculatedProgress);
    const newProgress = calculation.combinedProgress;

    // Use transaction to update progress and history atomically
    await prisma.$transaction(async (tx) => {
      await tx.goal.update({
        where: { id: goalId },
        data: {
          calculatedProgress: newProgress,
          status: calculation.recommendedStatus,
        },
      });

      if (prevProgress !== newProgress) {
        await tx.goalProgressHistory.create({
          data: {
            goalId,
            previousProgress: prevProgress,
            newProgress,
            changedBy,
            changeReason,
          },
        });
      }
    });

    return newProgress;
  }
}
