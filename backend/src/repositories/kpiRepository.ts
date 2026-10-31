import { prisma } from '../lib/prisma.js';
import { MeasurementDirection } from '../generated/prisma/client.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateKPIInput {
  name: string;
  description?: string;
  measurementUnit: string;
  measurementDirection?: MeasurementDirection;
}

export interface UpdateKPIInput {
  name?: string;
  description?: string;
  measurementUnit?: string;
  measurementDirection?: MeasurementDirection;
}

export interface RecordKPIValueInput {
  goalKpiId: string;
  actualValue: number;
  recordedBy: string;
  notes?: string;
}

export class KPIRepository {
  static async create(data: CreateKPIInput) {
    return prisma.kPI.create({
      data: {
        name: data.name,
        description: data.description,
        measurementUnit: data.measurementUnit,
        measurementDirection: data.measurementDirection ?? MeasurementDirection.HIGHER_IS_BETTER,
      },
    });
  }

  static async findById(id: string) {
    return prisma.kPI.findUnique({
      where: { id },
      include: {
        _count: { select: { goalKpis: true } },
      },
    });
  }

  static async findByName(name: string) {
    return prisma.kPI.findUnique({
      where: { name },
    });
  }

  static async findMany(options: PaginationOptions & { search?: string; direction?: MeasurementDirection } = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.direction) where.measurementDirection = options.direction;
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.kPI.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [options.sortBy || 'name']: options.sortOrder || 'asc' },
      }),
      prisma.kPI.count({ where }),
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

  static async update(id: string, data: UpdateKPIInput) {
    return prisma.kPI.update({
      where: { id },
      data,
    });
  }

  static async addRecord(data: RecordKPIValueInput) {
    return prisma.kPIRecord.create({
      data: {
        goalKpiId: data.goalKpiId,
        actualValue: data.actualValue,
        recordedBy: data.recordedBy,
        notes: data.notes,
      },
    });
  }

  static async getRecordsForGoalKPI(goalKpiId: string) {
    return prisma.kPIRecord.findMany({
      where: { goalKpiId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  static async getLatestRecordForGoalKPI(goalKpiId: string) {
    return prisma.kPIRecord.findFirst({
      where: { goalKpiId },
      orderBy: { recordedAt: 'desc' },
    });
  }
}
