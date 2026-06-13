"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PracticePhase, QuestionAttempt, PracticeDifficulty } from "../types";
import { syllabus } from "@/config/syllabus"; 

export function usePracticeSession(
  sessionId: string,
  initialSubject: keyof typeof syllabus,
  initialTopic: string,
  snapshot: { status: string; elapsedMs: number },
  startTimer: () => void,
  pauseTimer: () => void,
  resetTimer: () => void,
  finishTimer: () => void
) {
  const [phase, setPhase] = useState<PracticePhase>("setup");
  const [subject, setSubject] = useState<keyof typeof syllabus>(initialSubject);
  const [topic, setTopic] = useState<string>(initialTopic);
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>("Mixed ⭐");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");
  
  const lastAttemptTimeRef = useRef<number>(0);

  // 1. HYDRATION: Load snapshot from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`session-${sessionId}`);
    if (savedData) {
      try {
        const { attempts, sessionNotes } = JSON.parse(savedData);
        setAttempts(attempts);
        setSessionNotes(sessionNotes);
      } catch (e) {
        console.error("Failed to load session snapshot", e);
      }
    }
  }, [sessionId]);

  // 2. PERSISTENCE: Save to localStorage whenever state changes
  useEffect(() => {
    if (phase === "running" || phase === "paused") {
      const data = { attempts, sessionNotes };
      localStorage.setItem(`session-${sessionId}`, JSON.stringify(data));
    }
  }, [attempts, sessionNotes, phase, sessionId]);

  // Auto-Pause Protection Engine
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (phase === "running") pauseTimer();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [phase, pauseTimer]);

  const startSession = useCallback(() => {
    setAttempts([]);
    setSessionNotes("");
    lastAttemptTimeRef.current = 0;
    setPhase("running");
    startTimer();
  }, [startTimer]);

  const logQuestion = useCallback((result: "correct" | "incorrectQuestions") => {
    const totalElapsed = snapshot.elapsedMs;
    const itemDuration = totalElapsed - lastAttemptTimeRef.current;
    lastAttemptTimeRef.current = totalElapsed;

    setAttempts((prev) => [
      ...prev,
      { result, timestamp: Date.now(), elapsedMs: itemDuration, difficulty }
    ]);
  }, [snapshot.elapsedMs, difficulty]);

  const undoLastQuestion = useCallback(() => {
    if (attempts.length === 0) return;
    setAttempts((prev) => {
      const updated = prev.slice(0, -1);
      lastAttemptTimeRef.current = updated.reduce((sum, item) => sum + item.elapsedMs, 0);
      return updated;
    });
  }, [attempts]);

  const endTrackingRun = useCallback(() => {
    pauseTimer();
    setPhase("review");
  }, [pauseTimer]);

  const saveAndComplete = useCallback(() => {
    finishTimer();
    // Clear snapshot after completion so it doesn't auto-load next time
    localStorage.removeItem(`session-${sessionId}`);
    setPhase("success");
  }, [finishTimer, sessionId]);

  const resetToDashboard = useCallback(() => {
    resetTimer();
    setPhase("setup");
  }, [resetTimer]);

  return {
    phase, setPhase,
    subject, setSubject,
    topic, setTopic,
    difficulty, setDifficulty,
    attempts, sessionNotes, setSessionNotes,
    startSession, logQuestion, undoLastQuestion,
    endTrackingRun, saveAndComplete, resetToDashboard
  };
}