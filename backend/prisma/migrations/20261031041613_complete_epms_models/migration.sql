-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProgressMode" AS ENUM ('MANUAL', 'AUTOMATIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "MeasurementDirection" AS ENUM ('HIGHER_IS_BETTER', 'LOWER_IS_BETTER');

-- CreateEnum
CREATE TYPE "ReviewCycleStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "employeeCode" VARCHAR(50) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "designation" VARCHAR(150) NOT NULL,
    "departmentId" UUID NOT NULL,
    "managerId" UUID,
    "dateOfJoining" DATE NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startDate" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progressMode" "ProgressMode" NOT NULL DEFAULT 'HYBRID',
    "manualProgress" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "manualWeight" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "kpiWeight" DECIMAL(5,2) NOT NULL DEFAULT 50.00,
    "calculatedProgress" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "createdBy" VARCHAR(100),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "measurementUnit" VARCHAR(50) NOT NULL,
    "measurementDirection" "MeasurementDirection" NOT NULL DEFAULT 'HIGHER_IS_BETTER',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_kpis" (
    "id" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "kpiId" UUID NOT NULL,
    "targetValue" DECIMAL(12,4) NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "goal_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_records" (
    "id" UUID NOT NULL,
    "goalKpiId" UUID NOT NULL,
    "actualValue" DECIMAL(12,4) NOT NULL,
    "recordedBy" VARCHAR(100) NOT NULL,
    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "kpi_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_cycles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reviewDeadline" DATE NOT NULL,
    "status" "ReviewCycleStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "review_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "reviewCycleId" UUID NOT NULL,
    "overallScore" DECIMAL(3,2),
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "managerFeedback" TEXT,
    "employeeComments" TEXT,
    "publishedAt" TIMESTAMPTZ,
    "acknowledgedAt" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_ratings" (
    "id" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "review_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_progress_history" (
    "id" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "previousProgress" DECIMAL(5,2) NOT NULL,
    "newProgress" DECIMAL(5,2) NOT NULL,
    "changedBy" VARCHAR(100) NOT NULL,
    "changeReason" TEXT NOT NULL,
    "changedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_progress_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_snapshots" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "reviewCycleId" UUID NOT NULL,
    "overallScore" DECIMAL(3,2) NOT NULL,
    "kpiAchievementScore" DECIMAL(5,2) NOT NULL,
    "managerRating" DECIMAL(3,2) NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "calculatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeCode_key" ON "employees"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE INDEX "employees_managerId_idx" ON "employees"("managerId");

-- CreateIndex
CREATE INDEX "employees_employmentStatus_idx" ON "employees"("employmentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE INDEX "goals_employeeId_idx" ON "goals"("employeeId");

-- CreateIndex
CREATE INDEX "goals_status_idx" ON "goals"("status");

-- CreateIndex
CREATE INDEX "goals_dueDate_idx" ON "goals"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_name_key" ON "kpis"("name");

-- CreateIndex
CREATE INDEX "goal_kpis_goalId_idx" ON "goal_kpis"("goalId");

-- CreateIndex
CREATE INDEX "goal_kpis_kpiId_idx" ON "goal_kpis"("kpiId");

-- CreateIndex
CREATE UNIQUE INDEX "goal_kpis_goalId_kpiId_key" ON "goal_kpis"("goalId", "kpiId");

-- CreateIndex
CREATE INDEX "kpi_records_goalKpiId_idx" ON "kpi_records"("goalKpiId");

-- CreateIndex
CREATE INDEX "kpi_records_recordedAt_idx" ON "kpi_records"("recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "review_cycles_name_key" ON "review_cycles"("name");

-- CreateIndex
CREATE INDEX "reviews_employeeId_idx" ON "reviews"("employeeId");

-- CreateIndex
CREATE INDEX "reviews_reviewerId_idx" ON "reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "reviews_reviewCycleId_idx" ON "reviews"("reviewCycleId");

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_employeeId_reviewCycleId_key" ON "reviews"("employeeId", "reviewCycleId");

-- CreateIndex
CREATE INDEX "review_ratings_reviewId_idx" ON "review_ratings"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "review_ratings_reviewId_category_key" ON "review_ratings"("reviewId", "category");

-- CreateIndex
CREATE INDEX "goal_progress_history_goalId_idx" ON "goal_progress_history"("goalId");

-- CreateIndex
CREATE INDEX "goal_progress_history_changedAt_idx" ON "goal_progress_history"("changedAt");

-- CreateIndex
CREATE INDEX "performance_snapshots_employeeId_idx" ON "performance_snapshots"("employeeId");

-- CreateIndex
CREATE INDEX "performance_snapshots_reviewCycleId_idx" ON "performance_snapshots"("reviewCycleId");

-- CreateIndex
CREATE UNIQUE INDEX "performance_snapshots_employeeId_reviewCycleId_key" ON "performance_snapshots"("employeeId", "reviewCycleId");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_idx" ON "audit_logs"("actorUserId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_kpis" ADD CONSTRAINT "goal_kpis_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_kpis" ADD CONSTRAINT "goal_kpis_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "kpis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_records" ADD CONSTRAINT "kpi_records_goalKpiId_fkey" FOREIGN KEY ("goalKpiId") REFERENCES "goal_kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewCycleId_fkey" FOREIGN KEY ("reviewCycleId") REFERENCES "review_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_ratings" ADD CONSTRAINT "review_ratings_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_progress_history" ADD CONSTRAINT "goal_progress_history_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_snapshots" ADD CONSTRAINT "performance_snapshots_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_snapshots" ADD CONSTRAINT "performance_snapshots_reviewCycleId_fkey" FOREIGN KEY ("reviewCycleId") REFERENCES "review_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
