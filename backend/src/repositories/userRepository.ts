import { prisma } from '../lib/prisma.js';
import { Role } from '../generated/prisma/client.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateUserInput {
  employeeId: string;
  passwordHash: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateUserInput {
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export class UserRepository {
  static async create(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        employeeId: data.employeeId,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.EMPLOYEE,
        isActive: data.isActive ?? true,
      },
      include: {
        employee: {
          include: { department: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        employee: {
          include: { department: true, manager: true },
        },
      },
    });
  }

  static async findByEmployeeId(employeeId: string) {
    return prisma.user.findUnique({
      where: { employeeId },
      include: {
        employee: {
          include: { department: true, manager: true },
        },
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        employee: {
          email: { equals: email, mode: 'insensitive' },
        },
      },
      include: {
        employee: {
          include: { department: true, manager: true },
        },
      },
    });
  }

  static async findMany(options: PaginationOptions & { role?: Role; isActive?: boolean } = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.role) where.role = options.role;
    if (options.isActive !== undefined) where.isActive = options.isActive;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [options.sortBy || 'createdAt']: options.sortOrder || 'desc' },
        include: {
          employee: {
            select: { id: true, firstName: true, lastName: true, email: true, employeeCode: true, department: true },
          },
        },
      }),
      prisma.user.count({ where }),
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

  static async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        employee: true,
      },
    });
  }
}
