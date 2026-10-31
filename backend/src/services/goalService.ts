import { GoalRepository, CreateGoalInput, UpdateGoalInput, GoalFilterOptions, AddGoalKPIInput } from '../repositories/goalRepository.js';
import { EmployeeRepository } from '../repositories/employeeRepository.js';
import { KPIRepository } from '../repositories/kpiRepository.js';
import { GoalProgressService } from './goalProgressService.js';
import { ProgressMode } from '../generated/prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

export class GoalService {
  static async createGoal(input: CreateGoalInput) {
    // 1. Verify employee exists
    const employee = await EmployeeRepository.findById(input.employeeId);
    if (!employee) {
      throw new AppError(`Employee '${input.employeeId}' not found`, 404);
    }

    // 2. Validate dates
    const start = new Date(input.startDate);
    const due = new Date(input.dueDate);
    if (due < start) {
      throw new AppError('Due date cannot be earlier than start date', 400);
    }

    // 3. Validate progress mode & weights
    const mode = input.progressMode ?? ProgressMode.HYBRID;
    let manualWeight = input.manualWeight ?? 50;
    let kpiWeight = input.kpiWeight ?? 50;

    if (mode === ProgressMode.MANUAL) {
      manualWeight = 100;
      kpiWeight = 0;
    } else if (mode === ProgressMode.AUTOMATIC) {
      manualWeight = 0;
      kpiWeight = 100;
    } else {
      // HYBRID: weights must equal 100
      if (manualWeight + kpiWeight !== 100) {
        throw new AppError(`Manual weight (${manualWeight}) and KPI weight (${kpiWeight}) must sum to exactly 100%`, 400);
      }
    }

    // 4. Validate manual progress bounds [0, 100]
    const manualProgress = input.manualProgress ?? 0;
    if (manualProgress < 0 || manualProgress > 100) {
      throw new AppError('Progress value must be between 0 and 100', 400);
    }

    const calculatedProgress = mode === ProgressMode.MANUAL ? manualProgress : 0;

    return GoalRepository.create({
      ...input,
      startDate: start,
      dueDate: due,
      progressMode: mode,
      manualProgress,
      manualWeight,
      kpiWeight,
      calculatedProgress,
    });
  }

  static async getGoalById(id: string) {
    const goal = await GoalRepository.findByIdWithDetails(id);
    if (!goal) {
      throw new AppError(`Goal '${id}' not found`, 404);
    }
    return goal;
  }

  static async listGoals(options: GoalFilterOptions = {}) {
    return GoalRepository.findMany(options);
  }

  static async associateKPI(input: AddGoalKPIInput) {
    const goal = await this.getGoalById(input.goalId);
    const kpi = await KPIRepository.findById(input.kpiId);
    if (!kpi) {
      throw new AppError(`KPI '${input.kpiId}' not found`, 404);
    }

    if (input.weight <= 0 || input.weight > 100) {
      throw new AppError('KPI weight must be greater than 0 and less than or equal to 100%', 400);
    }

    // Check existing KPIs and total weight
    const existingKpis = await GoalRepository.findGoalKpis(input.goalId);
    const alreadyLinked = existingKpis.some((k) => k.kpiId === input.kpiId);
    if (alreadyLinked) {
      throw new AppError(`KPI '${kpi.name}' is already associated with this goal`, 409);
    }

    const currentTotalWeight = existingKpis.reduce((acc, k) => acc + Number(k.weight), 0);
    if (currentTotalWeight + input.weight > 100) {
      throw new AppError(
        `Total KPI weight would exceed 100% (Current: ${currentTotalWeight}%, Adding: ${input.weight}%)`,
        400
      );
    }

    const goalKpi = await GoalRepository.addKPI(input);

    // Recalculate goal progress
    await GoalProgressService.syncGoalProgress(
      input.goalId,
      'System (KPI Association)',
      `Associated KPI: ${kpi.name} with target ${input.targetValue} and weight ${input.weight}%`
    );

    return goalKpi;
  }

  static async removeKPI(goalId: string, kpiId: string) {
    await this.getGoalById(goalId);
    await GoalRepository.removeKPI(goalId, kpiId);

    // Recalculate goal progress
    await GoalProgressService.syncGoalProgress(
      goalId,
      'System (KPI Removal)',
      `Removed KPI: ${kpiId}`
    );
  }

  static async updateManualProgress(
    goalId: string,
    progress: number,
    actorName: string,
    reason: string
  ) {
    if (progress < 0 || progress > 100) {
      throw new AppError('Progress value must be between 0 and 100', 400);
    }

    const goal = await this.getGoalById(goalId);

    await GoalRepository.update(goalId, { manualProgress: progress });

    // Sync calculated progress and record history
    return GoalProgressService.syncGoalProgress(goalId, actorName, reason);
  }
}
