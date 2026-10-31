-- CreateTable
CREATE TABLE "_epms_system_migration_log" (
    "id" TEXT NOT NULL,
    "migration" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_epms_system_migration_log_pkey" PRIMARY KEY ("id")
);
