"use client";

import React, { useState } from "react";
import { Subject } from "@prisma/client";
import { syllabus } from "@/config/syllabus";

import { usePracticeTimer } from "@/lib/practice/usePracticeTimer";
import { savePracticeSession } from "@/app/actions/practice";
import { PracticeSessionData } from "./core/session-types";
import { PracticeDifficulty } from "@/lib/practice/types";

import { PracticeHero } from "./practice-hero";
import { PracticeStatsGrid } from "@/components/practice/practice-stats-grid";
import { PracticeSetup } from "@/components/practice/practice-setup";
import { RunningPanel } from "./panels/RunningPanel";
import { ReviewPanel } from "./panels/ReviewPanel";
import { RecentSessionsPanel } from "./panels/RecentSessionsPanel";
import { GlassCard } from "@/components/ui/glass-card";

import AchievementUnlockDialog from "@/components/achievements/achievement-unlock-dialog";
import { type UnlockResult } from "@/lib/achievements/unlock";

type CombinedSessionSnapshot = {
  status: "finished";
  elapsedMs: number;
  attempts: { result: "correct" | "incorrect"; durationMs: number }[];
};

interface PracticeDashboardProps {
  recentSessions: PracticeSessionData[];
}

export function PracticeDashboard({ recentSessions: initialSessions }: PracticeDashboardProps) {
  const [recentSessions, setRecentSessions] = useState<PracticeSessionData[]>(initialSessions);
  const [phase, setPhase] = useState<"setup" | "running" | "review" | "success">("setup");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const savingRef = React.useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const [subject, setSubject] = useState<Subject>(Subject.QUANTITATIVE_APTITUDE);
  const [topic, setTopic] = useState<string>(() => syllabus[Subject.QUANTITATIVE_APTITUDE]?.[0] ?? "");
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>("MIXED");
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [savedSnapshotCache, setSavedSnapshotCache] = useState<CombinedSessionSnapshot | null>(null);

  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockResult[]>([]);

  const handleStartTransition = () => setPhase("running");

  const handleRunningFinishHandshake = (finalSnapshot: CombinedSessionSnapshot) => {
    setSavedSnapshotCache(finalSnapshot);
    setPhase("review");
  };

  const handleCommitMetricsPipeline = async () => {
    if (savingRef.current || !savedSnapshotCache) return;
    savingRef.current = true;
    setIsSaving(true);
    setErrorBanner(null);

    const { attempts, elapsedMs } = savedSnapshotCache;
    const totalQuestions = attempts.length;
    const correctQuestions = attempts.filter((a) => a.result === "correct").length;
    const durationSeconds = Math.max(1, Math.floor(elapsedMs / 1000));
    const computedAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    const validationPayload = {
      subject,
      topic,
      totalQuestions,
      correctQuestions,
      durationSeconds,
      difficulty,
      notes: sessionNotes,
      confidenceScore: 3,
    };

    const optimisticRecord: PracticeSessionData = {
      id: `optimistic-${Date.now()}`,
      subject,
      topic,
      durationSeconds,
      accuracy: computedAccuracy,
      createdAt: new Date(),
      attemptsCount: totalQuestions,
    };

    setRecentSessions((prev) => [optimisticRecord, ...prev]);

    try {
      const response = await savePracticeSession(validationPayload);
      
      if (response.success) {
        setRecentSessions((prev) =>
          prev.map((item) =>
            item.id === optimisticRecord.id
              ? {
                  id: response.data.id,
                  subject: response.data.subject,
                  topic: response.data.topic,
                  durationSeconds: response.data.durationSeconds,
                  accuracy: response.data.accuracy,
                  createdAt: new Date(response.data.createdAt),
                  attemptsCount: response.data.totalQuestions,
                }
              : item
          )
        );

        if (response.unlockedAchievements.length > 0) {
          setUnlockedAchievements(response.unlockedAchievements);
          setShowAchievementDialog(true);
        }

        setSavedSnapshotCache(null);
        setPhase("success");
        return;
      }

      setRecentSessions((prev) => prev.filter((item) => item.id !== optimisticRecord.id));
      setErrorBanner(response.error ?? "Failed to save practice session.");
    } catch {
      setRecentSessions((prev) => prev.filter((item) => item.id !== optimisticRecord.id));
      setErrorBanner("Unexpected error while saving practice session.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleResetTransition = () => {
    savingRef.current = false;
    setIsSaving(false);
    setSavedSnapshotCache(null);
    setSessionNotes("");
    setSubject(Subject.QUANTITATIVE_APTITUDE);
    setTopic(syllabus[Subject.QUANTITATIVE_APTITUDE]?.[0] ?? "");
    setDifficulty("MIXED");
    setErrorBanner(null);
    setPhase("setup");
  };

  const totalSessions = recentSessions.length;
  const totalQuestions = recentSessions.reduce((sum, session) => sum + session.attemptsCount, 0);
  const averageAccuracy = totalSessions === 0 ? 0 : Math.round(recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / totalSessions);
  const totalPracticeHours = Number((recentSessions.reduce((sum, session) => sum + (session.durationSeconds ?? 0), 0) / 3600).toFixed(1));

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      {phase === "setup" && (
        <>
          <PracticeHero subject={subject} topic={topic} difficulty={difficulty} />
          <PracticeStatsGrid
            totalSessions={totalSessions}
            totalQuestions={totalQuestions}
            averageAccuracy={averageAccuracy}
            totalPracticeHours={totalPracticeHours}
          />
        </>
      )}

      {phase === "setup" && (
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Practice Workspace</h2>
          <p className="text-muted-foreground mt-1 text-[15px]">
            Configure and complete focused practice sessions.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Setup Area */}
        <div className="lg:col-span-8 space-y-6">
          {errorBanner && (
            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-xl text-sm text-destructive">
              ⚠️ {errorBanner}
            </div>
          )}

          {phase === "setup" && (
            <GlassCard className="p-1 sm:p-7 lg:p-8">
              <PracticeSetup
                subject={subject}
                setSubject={setSubject}
                topic={topic}
                setTopic={setTopic}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                onStart={handleStartTransition}
              />
            </GlassCard>
          )}

          {phase === "running" && (
            <ActiveWorkspaceWrapper
              topic={topic}
              subject={subject}
              onHandshakeFinish={handleRunningFinishHandshake}
            />
          )}

          {phase === "review" && savedSnapshotCache && (
            <ReviewPanel
              topic={topic}
              subject={subject}
              elapsedMs={savedSnapshotCache.elapsedMs}
              attemptsCount={savedSnapshotCache.attempts.length}
              accuracy={
                savedSnapshotCache.attempts.length > 0
                  ? Math.round(
                      (savedSnapshotCache.attempts.filter((a) => a.result === "correct").length /
                        savedSnapshotCache.attempts.length) * 100
                    )
                  : 0
              }
              currentQpm={
                savedSnapshotCache.elapsedMs > 0
                  ? savedSnapshotCache.attempts.length / (savedSnapshotCache.elapsedMs / 60000)
                  : 0
              }
              sessionNotes={sessionNotes}
              setSessionNotes={setSessionNotes}
              onDiscard={handleResetTransition}
              onCommit={handleCommitMetricsPipeline}
              isSaving={isSaving}
            />
          )}

          {phase === "success" && (
            <div className="text-center py-12">
              <GlassCard className="max-w-md mx-auto p-10 space-y-6">
                <div className="text-6xl">✅</div>
                <h3 className="text-3xl font-bold">Session Saved</h3>
                <p className="text-muted-foreground">Your performance has been recorded.</p>
                <button
                  onClick={handleResetTransition}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all"
                >
                  Start Another Session
                </button>
              </GlassCard>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        {phase === "setup" && (
          <div className="lg:col-span-4">
            <RecentSessionsPanel recentSessions={recentSessions} />
          </div>
        )}
      </div>

      {/* Achievement Unlock Dialog */}
      <AchievementUnlockDialog
        open={showAchievementDialog}
        achievements={unlockedAchievements}
        onClose={() => {
          setShowAchievementDialog(false);
          setUnlockedAchievements([]);
        }}
      />
    </div>
  );
}

// ActiveWorkspaceWrapper
interface ActiveWorkspaceWrapperProps {
  topic: string;
  subject: Subject;
  onHandshakeFinish: (finalSnapshot: CombinedSessionSnapshot) => void;
}

function ActiveWorkspaceWrapper({ topic, subject, onHandshakeFinish }: ActiveWorkspaceWrapperProps) {
  const { elapsedMs, start, finish, pause, resume, isPaused } = usePracticeTimer();
  const [attempts, setAttempts] = React.useState<
    { result: "correct" | "incorrect"; durationMs: number }[]
  >([]);

  React.useEffect(() => {
    start();
  }, [start]);

  const handlePauseAndReview = () => {
    const finalElapsedMs = finish();
    onHandshakeFinish({
      status: "finished",
      elapsedMs: finalElapsedMs,
      attempts,
    });
  };

  const attemptsCount = attempts.length;
  const correctCount = attempts.filter((a) => a.result === "correct").length;
  const incorrectCount = attempts.length - correctCount;
  const accuracy = attemptsCount === 0 ? 0 : Math.round((correctCount / attemptsCount) * 100);
  const currentQpm = elapsedMs === 0 ? 0 : attemptsCount / (elapsedMs / 60000);
  const targetQpm = 1.67;

  return (
    <RunningPanel
      topic={topic}
      subject={subject}
      attemptsCount={attemptsCount}
      correctCount={correctCount}
      incorrectCount={incorrectCount}
      accuracy={accuracy}
      currentQpm={currentQpm}
      targetQpm={targetQpm}
      elapsedMs={elapsedMs}
      isPaused={isPaused}
      onPause={pause}
      onResume={resume}
      logQuestion={(result) =>
        setAttempts((prev) => [...prev, { result, durationMs: elapsedMs }])
      }
      undoLastQuestion={() => setAttempts((prev) => prev.slice(0, -1))}
      onPauseAndReview={handlePauseAndReview}
    />
  );
}