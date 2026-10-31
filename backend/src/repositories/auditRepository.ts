import { prisma } from '../lib/prisma.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateAuditLogInput {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface AuditFilterOptions extends PaginationOptions {
  actorUserId?: string;
  entityType?: string;
  entityId?: string;
}

export class AuditRepository {
  static async create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValues: data.oldValues,
        newValues: data.newValues,
      },
    });
  }

  static async findMany(options: AuditFilterOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.actorUserId) where.actorUserId = options.actorUserId;
    if (options.entityType) where.entityType = options.entityType;
    if (options.entityId) where.entityId = options.entityId;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actorUser: {
            select: {
              id: true,
              role: true,
              employee: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
