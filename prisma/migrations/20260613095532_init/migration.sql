-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('UNRESOLVED', 'IN_PROGRESS', 'MASTERED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "MistakeType" AS ENUM ('CONCEPTUAL', 'SILLY', 'GUESS', 'TIME_MANAGEMENT', 'CALCULATION', 'QUESTION_MISREAD');

-- CreateEnum
CREATE TYPE "MockType" AS ENUM ('PRELIMS', 'MAINS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" TEXT NOT NULL,
    "session_uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" "Difficulty",
    "total_questions" INTEGER NOT NULL,
    "correctQuestions_questions" INTEGER NOT NULL,
    "incorrectQuestions_questions" INTEGER NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "accuracy" REAL NOT NULL,
    "qpm" REAL NOT NULL,
    "mistake_count" INTEGER NOT NULL DEFAULT 0,
    "revision_status" "RevisionStatus" NOT NULL DEFAULT 'UNRESOLVED',
    "confidence_score" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exam_type" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "readiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mistakes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT,
    "question" TEXT NOT NULL,
    "notes" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mistake_type" "MistakeType" NOT NULL,

    CONSTRAINT "mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mistake_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "explanation" TEXT,
    "mock_test_id" TEXT,
    "question" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mistake_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_subject_performances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mock_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "attempted" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "incorrectQuestions" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "time_spent" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_subject_performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_tests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "title" TEXT,
    "mock_type" "MockType",
    "score" REAL NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "attempted_questions" INTEGER NOT NULL DEFAULT 0,
    "correctQuestions_answers" INTEGER NOT NULL DEFAULT 0,
    "incorrectQuestions_answers" INTEGER NOT NULL DEFAULT 0,
    "unattempted_questions" INTEGER NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL,
    "percentile" REAL,
    "rank" INTEGER,
    "duration" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_topic_performances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mock_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrectQuestions" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_topic_performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revisions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "revision_count" INTEGER NOT NULL DEFAULT 0,
    "next_revision" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_progresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic_name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "topic_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_confidence_score_idx" ON "practice_sessions"("user_id", "confidence_score");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_created_at_idx" ON "practice_sessions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_revision_status_idx" ON "practice_sessions"("user_id", "revision_status");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_subject_idx" ON "practice_sessions"("user_id", "subject");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_topic_idx" ON "practice_sessions"("user_id", "topic");

-- CreateIndex
CREATE UNIQUE INDEX "practice_sessions_user_id_session_uuid_key" ON "practice_sessions"("user_id", "session_uuid");

-- CreateIndex
CREATE INDEX "exam_profiles_is_active_idx" ON "exam_profiles"("is_active");

-- CreateIndex
CREATE INDEX "exam_profiles_user_id_idx" ON "exam_profiles"("user_id");

-- CreateIndex
CREATE INDEX "mistakes_resolved_idx" ON "mistakes"("resolved");

-- CreateIndex
CREATE INDEX "mistakes_subject_idx" ON "mistakes"("subject");

-- CreateIndex
CREATE INDEX "mistakes_user_id_idx" ON "mistakes"("user_id");

-- CreateIndex
CREATE INDEX "mistake_entries_resolved_idx" ON "mistake_entries"("resolved");

-- CreateIndex
CREATE INDEX "mistake_entries_subject_idx" ON "mistake_entries"("subject");

-- CreateIndex
CREATE INDEX "mistake_entries_topic_idx" ON "mistake_entries"("topic");

-- CreateIndex
CREATE INDEX "mistake_entries_user_id_idx" ON "mistake_entries"("user_id");

-- CreateIndex
CREATE INDEX "mock_subject_performances_mock_id_idx" ON "mock_subject_performances"("mock_id");

-- CreateIndex
CREATE INDEX "mock_subject_performances_subject_idx" ON "mock_subject_performances"("subject");

-- CreateIndex
CREATE INDEX "mock_subject_performances_user_id_idx" ON "mock_subject_performances"("user_id");

-- CreateIndex
CREATE INDEX "mock_tests_created_at_idx" ON "mock_tests"("created_at");

-- CreateIndex
CREATE INDEX "mock_tests_mock_type_idx" ON "mock_tests"("mock_type");

-- CreateIndex
CREATE INDEX "mock_tests_user_id_idx" ON "mock_tests"("user_id");

-- CreateIndex
CREATE INDEX "mock_topic_performances_mock_id_idx" ON "mock_topic_performances"("mock_id");

-- CreateIndex
CREATE INDEX "mock_topic_performances_subject_idx" ON "mock_topic_performances"("subject");

-- CreateIndex
CREATE INDEX "mock_topic_performances_topic_idx" ON "mock_topic_performances"("topic");

-- CreateIndex
CREATE INDEX "mock_topic_performances_user_id_idx" ON "mock_topic_performances"("user_id");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "revisions_user_id_next_revision_idx" ON "revisions"("user_id", "next_revision");

-- CreateIndex
CREATE UNIQUE INDEX "revisions_user_id_topic_key" ON "revisions"("user_id", "topic");

-- CreateIndex
CREATE INDEX "study_sessions_user_id_idx" ON "study_sessions"("user_id");

-- CreateIndex
CREATE INDEX "tasks_user_id_idx" ON "tasks"("user_id");

-- CreateIndex
CREATE INDEX "topic_progresses_user_id_subject_completed_idx" ON "topic_progresses"("user_id", "subject", "completed");

-- CreateIndex
CREATE UNIQUE INDEX "topic_progresses_user_id_subject_topic_name_key" ON "topic_progresses"("user_id", "subject", "topic_name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_profiles" ADD CONSTRAINT "exam_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistakes" ADD CONSTRAINT "mistakes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_entries" ADD CONSTRAINT "mistake_entries_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "mock_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_entries" ADD CONSTRAINT "mistake_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_subject_performances" ADD CONSTRAINT "mock_subject_performances_mock_id_fkey" FOREIGN KEY ("mock_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_subject_performances" ADD CONSTRAINT "mock_subject_performances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_topic_performances" ADD CONSTRAINT "mock_topic_performances_mock_id_fkey" FOREIGN KEY ("mock_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_topic_performances" ADD CONSTRAINT "mock_topic_performances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_progresses" ADD CONSTRAINT "topic_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
