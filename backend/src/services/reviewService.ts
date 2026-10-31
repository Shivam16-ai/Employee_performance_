import { ReviewRepository, CreateReviewCycleInput, CreateReviewInput, UpdateReviewInput, AddReviewRatingInput, ReviewFilterOptions } from '../repositories/reviewRepository.js';
import { EmployeeRepository } from '../repositories/employeeRepository.js';
import { ReviewStatus } from '../generated/prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

export class ReviewService {
  // Cycle Operations
  static async createReviewCycle(input: CreateReviewCycleInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const deadline = new Date(input.reviewDeadline);

    if (end < start) {
      throw new AppError('Cycle end date cannot be earlier than start date', 400);
    }
    if (deadline < end) {
      throw new AppError('Review deadline cannot be earlier than cycle end date', 400);
    }

    return ReviewRepository.createCycle({
      ...input,
      startDate: start,
      endDate: end,
      reviewDeadline: deadline,
    });
  }

  static async getCycleById(id: string) {
    const cycle = await ReviewRepository.findCycleById(id);
    if (!cycle) {
      throw new AppError(`Review cycle '${id}' not found`, 404);
    }
    return cycle;
  }

  static async listCycles(options: any = {}) {
    return ReviewRepository.findCycles(options);
  }

  // Review Operations
  static async createReview(input: CreateReviewInput) {
    // 1. Verify employee exists
    const employee = await EmployeeRepository.findById(input.employeeId);
    if (!employee) {
      throw new AppError(`Employee '${input.employeeId}' not found`, 404);
    }

    // 2. Verify reviewer exists
    const reviewer = await EmployeeRepository.findById(input.reviewerId);
    if (!reviewer) {
      throw new AppError(`Reviewer '${input.reviewerId}' not found`, 404);
    }

    // 3. Verify cycle exists
    await this.getCycleById(input.reviewCycleId);

    // 4. Check for duplicate review for this employee & cycle
    const existing = await ReviewRepository.findReviewByEmployeeAndCycle(
      input.employeeId,
      input.reviewCycleId
    );
    if (existing) {
      throw new AppError(
        `An active performance review already exists for employee '${employee.firstName} ${employee.lastName}' in this review cycle`,
        409
      );
    }

    return ReviewRepository.createReview(input);
  }

  static async getReviewById(id: string) {
    const review = await ReviewRepository.findReviewById(id);
    if (!review) {
      throw new AppError(`Review '${id}' not found`, 404);
    }
    return review;
  }

  static async listReviews(options: ReviewFilterOptions = {}) {
    return ReviewRepository.findReviews(options);
  }

  static async addRating(input: AddReviewRatingInput) {
    const review = await this.getReviewById(input.reviewId);

    if (review.status === ReviewStatus.PUBLISHED) {
      throw new AppError('Cannot alter ratings on a published review without a formal amendment', 400);
    }

    // Validate rating is between 1.0 and 5.0
    if (input.rating < 1.0 || input.rating > 5.0) {
      throw new AppError('Evaluation rating must be between 1.0 and 5.0', 400);
    }

    await ReviewRepository.upsertRating(input);

    // Recalculate average overall score across categories
    const ratings = await ReviewRepository.getRatingsForReview(input.reviewId);
    const avgScore =
      ratings.reduce((acc, r) => acc + Number(r.rating), 0) / ratings.length;

    await ReviewRepository.updateReview(input.reviewId, {
      overallScore: Number(avgScore.toFixed(2)),
    });

    return this.getReviewById(input.reviewId);
  }

  static async publishReview(reviewId: string) {
    const review = await this.getReviewById(reviewId);

    if (review.status === ReviewStatus.PUBLISHED) {
      throw new AppError('Review is already published', 400);
    }

    if (!review.ratings || review.ratings.length === 0) {
      throw new AppError('Cannot publish a review with no evaluation ratings', 400);
    }

    return ReviewRepository.updateReview(reviewId, {
      status: ReviewStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  static async acknowledgeReview(reviewId: string, employeeComments?: string) {
    const review = await this.getReviewById(reviewId);

    // Business rule: Acknowledgement must happen strictly after publication
    if (review.status !== ReviewStatus.PUBLISHED) {
      throw new AppError(
        'Review must be officially published before employee acknowledgement can be recorded',
        400
      );
    }

    if (review.acknowledgedAt) {
      throw new AppError('Review has already been formally acknowledged', 409);
    }

    return ReviewRepository.updateReview(reviewId, {
      acknowledgedAt: new Date(),
      employeeComments: employeeComments ?? review.employeeComments,
    });
  }
}
