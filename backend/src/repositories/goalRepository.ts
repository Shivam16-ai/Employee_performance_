import { prisma } from '../lib/prisma.js';
import { GoalStatus, ProgressMode } from '../generated/prisma/client.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateGoalInput {
  employeeId: string;
  title: string;
  description?: string;
  startDate: Date;
  dueDate: Date;
  status?: GoalStatus;
  progressMode?: ProgressMode;
  manualProgress?: number;
  manualWeight?: number;
  kpiWeight?: number;
  calculatedProgress?: number;
  createdBy?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  startDate?: Date;
  dueDate?: Date;
  status?: GoalStatus;
  progressMode?: ProgressMode;
  manualProgress?: number;
  manualWeight?: number;
  kpiWeight?: number;
  calculatedProgress?: number;
}

export interface GoalFilterOptions extends PaginationOptions {
  employeeId?: string;
  status?: GoalStatus;
  progressMode?: ProgressMode;
  search?: string;
}

export interface AddGoalKPIInput {
  goalId: string;
  kpiId: string;
  targetValue: number;
  weight: number;
}

export interface AddGoalProgressHistoryInput {
  goalId: string;
  previousProgress: number;
  newProgress: number;
  changedBy: string;
  changeReason: string;
}

export class GoalRepository {
  static async create(data: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        dueDate: data.dueDate,
        status: data.status ?? GoalStatus.NOT_STARTED,
        progressMode: data.progressMode ?? ProgressMode.HYBRID,
        manualProgress: data.manualProgress ?? 0,
        manualWeight: data.manualWeight ?? 50,
        kpiWeight: data.kpiWeight ?? 50,
        calculatedProgress: data.calculatedProgress ?? 0,
        createdBy: data.createdBy,
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
        goalKpis: { include: { kpi: true } },
      },
    });
  }

  static async findById(id: string) {
    return prisma.goal.findUnique({
      where: { id },
    });
  }

  static async findByIdWithDetails(id: string) {
    return prisma.goal.findUnique({
      where: { id },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
        goalKpis: {
          include: {
            kpi: true,
            kpiRecords: {
              orderBy: { recordedAt: 'desc' },
              take: 5,
            },
          },
        },
        progressHistory: {
          orderBy: { changedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  static async findMany(options: GoalFilterOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.employeeId) where.employeeId = options.employeeId;
    if (options.status) where.status = options.status;
    if (options.progressMode) where.progressMode = options.progressMode;
    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [options.sortBy || 'createdAt']: options.sortOrder || 'desc' },
        include: {
          employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
          goalKpis: { include: { kpi: true } },
        },
      }),
      prisma.goal.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async update(id: string, data: UpdateGoalInput) {
    return prisma.goal.update({
      where: { id },
      data,
      include: {
        goalKpis: { include: { kpi: true } },
      },
    });
  }

  static async addKPI(data: AddGoalKPIInput) {
    return prisma.goalKPI.create({
      data: {
        goalId: data.goalId,
        kpiId: data.kpiId,
        targetValue: data.targetValue,
        weight: data.weight,
      },
      include: { kpi: true },
    });
  }

  static async removeKPI(goalId: string, kpiId: string) {
    return prisma.goalKPI.delete({
      where: {
        goalId_kpiId: { goalId, kpiId },
      },
    });
  }

  static async findGoalKpis(goalId: string) {
    return prisma.goalKPI.findMany({
      where: { goalId },
      include: {
        kpi: true,
        kpiRecords: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });
  }

  static async addProgressHistory(data: AddGoalProgressHistoryInput) {
    return prisma.goalProgressHistory.create({
      data: {
        goalId: data.goalId,
        previousProgress: data.previousProgress,
        newProgress: data.newProgress,
        changedBy: data.changedBy,
        changeReason: data.changeReason,
      },
    });
  }

  static async getProgressHistory(goalId: string) {
    return prisma.goalProgressHistory.findMany({
      where: { goalId },
      orderBy: { changedAt: 'desc' },
    });
  }
}
