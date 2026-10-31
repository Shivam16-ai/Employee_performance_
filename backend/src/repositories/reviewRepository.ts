import { prisma } from '../lib/prisma.js';
import { ReviewStatus, ReviewCycleStatus } from '../generated/prisma/client.js';
import { PaginationOptions, PaginatedResult } from '../types/index.js';

export interface CreateReviewCycleInput {
  name: string;
  startDate: Date;
  endDate: Date;
  reviewDeadline: Date;
  status?: ReviewCycleStatus;
}

export interface CreateReviewInput {
  employeeId: string;
  reviewerId: string;
  reviewCycleId: string;
  overallScore?: number;
  managerFeedback?: string;
  status?: ReviewStatus;
}

export interface UpdateReviewInput {
  overallScore?: number;
  managerFeedback?: string | null;
  employeeComments?: string | null;
  status?: ReviewStatus;
  publishedAt?: Date | null;
  acknowledgedAt?: Date | null;
  version?: number;
}

export interface AddReviewRatingInput {
  reviewId: string;
  category: string;
  rating: number;
  comments?: string;
}

export interface ReviewFilterOptions extends PaginationOptions {
  employeeId?: string;
  reviewerId?: string;
  reviewCycleId?: string;
  status?: ReviewStatus;
}

export class ReviewRepository {
  // Cycle Operations
  static async createCycle(data: CreateReviewCycleInput) {
    return prisma.reviewCycle.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        reviewDeadline: data.reviewDeadline,
        status: data.status ?? ReviewCycleStatus.UPCOMING,
      },
    });
  }

  static async findCycleById(id: string) {
    return prisma.reviewCycle.findUnique({
      where: { id },
      include: {
        _count: { select: { reviews: true, snapshots: true } },
      },
    });
  }

  static async findCycles(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.reviewCycle.findMany({
        skip,
        take: limit,
        orderBy: { [options.sortBy || 'startDate']: options.sortOrder || 'desc' },
        include: {
          _count: { select: { reviews: true } },
        },
      }),
      prisma.reviewCycle.count(),
    ]);

    return {
      data: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Review Operations
  static async createReview(data: CreateReviewInput) {
    return prisma.review.create({
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        reviewCycleId: data.reviewCycleId,
        overallScore: data.overallScore,
        managerFeedback: data.managerFeedback,
        status: data.status ?? ReviewStatus.DRAFT,
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
        reviewCycle: true,
        ratings: true,
      },
    });
  }

  static async findReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
        },
        reviewer: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true },
        },
        reviewCycle: true,
        ratings: true,
      },
    });
  }

  static async findReviewByEmployeeAndCycle(employeeId: string, reviewCycleId: string) {
    return prisma.review.findUnique({
      where: {
        employeeId_reviewCycleId: { employeeId, reviewCycleId },
      },
      include: {
        employee: true,
        reviewer: true,
        reviewCycle: true,
        ratings: true,
      },
    });
  }

  static async findReviews(options: ReviewFilterOptions = {}): Promise<PaginatedResult<any>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.employeeId) where.employeeId = options.employeeId;
    if (options.reviewerId) where.reviewerId = options.reviewerId;
    if (options.reviewCycleId) where.reviewCycleId = options.reviewCycleId;
    if (options.status) where.status = options.status;

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [options.sortBy || 'createdAt']: options.sortOrder || 'desc' },
        include: {
          employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true } },
          reviewer: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
          reviewCycle: true,
          ratings: true,
        },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      data: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async updateReview(id: string, data: UpdateReviewInput) {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        employee: true,
        reviewer: true,
        reviewCycle: true,
        ratings: true,
      },
    });
  }

  static async upsertRating(data: AddReviewRatingInput) {
    return prisma.reviewRating.upsert({
      where: {
        reviewId_category: {
          reviewId: data.reviewId,
          category: data.category,
        },
      },
      update: {
        rating: data.rating,
        comments: data.comments,
      },
      create: {
        reviewId: data.reviewId,
        category: data.category,
        rating: data.rating,
        comments: data.comments,
      },
    });
  }

  static async getRatingsForReview(reviewId: string) {
    return prisma.reviewRating.findMany({
      where: { reviewId },
      orderBy: { category: 'asc' },
    });
  }
}
