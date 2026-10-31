import { KPIRepository, CreateKPIInput, UpdateKPIInput, RecordKPIValueInput } from '../repositories/kpiRepository.js';
import { GoalProgressService } from './goalProgressService.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export class KPIService {
  static async createKPI(input: CreateKPIInput) {
    const existing = await KPIRepository.findByName(input.name);
    if (existing) {
      throw new AppError(`KPI with name '${input.name}' already exists`, 409);
    }
    return KPIRepository.create(input);
  }

  static async getKPIById(id: string) {
    const kpi = await KPIRepository.findById(id);
    if (!kpi) {
      throw new AppError(`KPI '${id}' not found`, 404);
    }
    return kpi;
  }

  static async listKPIs(options: any = {}) {
    return KPIRepository.findMany(options);
  }

  static async recordActualValue(input: RecordKPIValueInput) {
    const goalKpi = await prisma.goalKPI.findUnique({
      where: { id: input.goalKpiId },
      include: { kpi: true, goal: true },
    });

    if (!goalKpi) {
      throw new AppError(`Goal KPI link '${input.goalKpiId}' not found`, 404);
    }

    const record = await KPIRepository.addRecord(input);

    // Sync the parent goal's progress automatically
    await GoalProgressService.syncGoalProgress(
      goalKpi.goalId,
      input.recordedBy,
      `Recorded actual value ${input.actualValue} for KPI ${goalKpi.kpi.name}`
    );

    return record;
  }
}
