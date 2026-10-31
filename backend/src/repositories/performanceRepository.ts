import { prisma } from '../lib/prisma.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateSnapshotInput {
  employeeId: string;
  reviewCycleId: string;
  overallScore: number;
  kpiAchievementScore: number;
  managerRating: number;
  snapshotData: Record<string, any>;
}

export class PerformanceRepository {
  static async upsertSnapshot(data: CreateSnapshotInput) {
    return prisma.performanceSnapshot.upsert({
      where: {
        employeeId_reviewCycleId: {
          employeeId: data.employeeId,
          reviewCycleId: data.reviewCycleId,
        },
      },
      update: {
        overallScore: data.overallScore,
        kpiAchievementScore: data.kpiAchievementScore,
        managerRating: data.managerRating,
        snapshotData: data.snapshotData,
        calculatedAt: new Date(),
      },
      create: {
        employeeId: data.employeeId,
        reviewCycleId: data.reviewCycleId,
        overallScore: data.overallScore,
        kpiAchievementScore: data.kpiAchievementScore,
        managerRating: data.managerRating,
        snapshotData: data.snapshotData,
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
        reviewCycle: true,
      },
    });
  }

  static async findSnapshot(employeeId: string, reviewCycleId: string) {
    return prisma.performanceSnapshot.findUnique({
      where: {
        employeeId_reviewCycleId: { employeeId, reviewCycleId },
      },
      include: {
        employee: true,
        reviewCycle: true,
      },
    });
  }

  static async findSnapshotsByEmployee(employeeId: string, options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.performanceSnapshot.findMany({
        where: { employeeId },
        skip,
        take: limit,
        orderBy: { calculatedAt: 'desc' },
        include: { reviewCycle: true },
      }),
      prisma.performanceSnapshot.count({ where: { employeeId } }),
    ]);

    return {
      data: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getDepartmentPerformanceSummary(departmentId: string, reviewCycleId: string) {
    const snapshots = await prisma.performanceSnapshot.findMany({
      where: {
        reviewCycleId,
        employee: { departmentId },
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, designation: true } },
      },
    });

    if (snapshots.length === 0) {
      return {
        totalEvaluated: 0,
        averageOverallScore: 0,
        averageKpiScore: 0,
        averageManagerRating: 0,
        snapshots: [],
      };
    }

    const total = snapshots.length;
    const avgOverall = snapshots.reduce((acc, s) => acc + Number(s.overallScore), 0) / total;
    const avgKpi = snapshots.reduce((acc, s) => acc + Number(s.kpiAchievementScore), 0) / total;
    const avgManager = snapshots.reduce((acc, s) => acc + Number(s.managerRating), 0) / total;

    return {
      totalEvaluated: total,
      averageOverallScore: Number(avgOverall.toFixed(2)),
      averageKpiScore: Number(avgKpi.toFixed(2)),
      averageManagerRating: Number(avgManager.toFixed(2)),
      snapshots,
    };
  }
}
