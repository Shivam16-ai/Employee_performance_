import { prisma } from '../lib/prisma.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateDepartmentInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface DepartmentFilterOptions extends PaginationOptions {
  isActive?: boolean;
  search?: string;
}

export class DepartmentRepository {
  static async create(data: CreateDepartmentInput) {
    return prisma.department.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });
  }

  static async findByName(name: string) {
    return prisma.department.findUnique({
      where: { name },
    });
  }

  static async findMany(options: DepartmentFilterOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.isActive !== undefined) {
      where.isActive = options.isActive;
    }
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [options.sortBy || 'name']: options.sortOrder || 'asc',
        },
        include: {
          _count: {
            select: { employees: true },
          },
        },
      }),
      prisma.department.count({ where }),
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

  static async update(id: string, data: UpdateDepartmentInput) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.department.delete({
      where: { id },
    });
  }
}
