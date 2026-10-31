import { prisma } from '../lib/prisma.js';
import { EmploymentStatus } from '../generated/prisma/client.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateEmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  departmentId: string;
  managerId?: string;
  dateOfJoining: Date;
  employmentStatus?: EmploymentStatus;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  departmentId?: string;
  managerId?: string | null;
  employmentStatus?: EmploymentStatus;
}

export interface EmployeeFilterOptions extends PaginationOptions {
  departmentId?: string;
  managerId?: string;
  employmentStatus?: EmploymentStatus;
  search?: string;
}

export class EmployeeRepository {
  static async create(data: CreateEmployeeInput) {
    return prisma.employee.create({
      data: {
        employeeCode: data.employeeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        designation: data.designation,
        departmentId: data.departmentId,
        managerId: data.managerId,
        dateOfJoining: data.dateOfJoining,
        employmentStatus: data.employmentStatus ?? EmploymentStatus.ACTIVE,
      },
      include: {
        department: true,
        manager: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, email: true },
        },
      },
    });
  }

  static async findById(id: string, includeFullProfile = false) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        manager: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, email: true },
        },
        user: {
          select: { id: true, role: true, isActive: true, lastLoginAt: true },
        },
        ...(includeFullProfile
          ? {
              directReports: {
                select: { id: true, firstName: true, lastName: true, employeeCode: true, designation: true },
              },
              _count: {
                select: { goals: true, reviewsReceived: true, directReports: true },
              },
            }
          : {}),
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.employee.findUnique({
      where: { email },
      include: { department: true, manager: true, user: true },
    });
  }

  static async findByCode(employeeCode: string) {
    return prisma.employee.findUnique({
      where: { employeeCode },
      include: { department: true, manager: true, user: true },
    });
  }

  static async findMany(options: EmployeeFilterOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.departmentId) where.departmentId = options.departmentId;
    if (options.managerId) where.managerId = options.managerId;
    if (options.employmentStatus) where.employmentStatus = options.employmentStatus;
    if (options.search) {
      where.OR = [
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { employeeCode: { contains: options.search, mode: 'insensitive' } },
        { designation: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [options.sortBy || 'createdAt']: options.sortOrder || 'desc',
        },
        include: {
          department: true,
          manager: {
            select: { id: true, firstName: true, lastName: true, employeeCode: true },
          },
          user: {
            select: { id: true, role: true, isActive: true },
          },
        },
      }),
      prisma.employee.count({ where }),
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

  static async update(id: string, data: UpdateEmployeeInput) {
    return prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
        manager: true,
      },
    });
  }

  static async getDirectReports(managerId: string) {
    return prisma.employee.findMany({
      where: { managerId, employmentStatus: EmploymentStatus.ACTIVE },
      include: {
        department: true,
        user: { select: { id: true, role: true } },
      },
      orderBy: { firstName: 'asc' },
    });
  }
}
