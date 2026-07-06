// lib/analytics/cached.ts
import { cache } from "react";
import { getReadinessEngine } from "./readiness-engine";
import { getWeakTopics } from "./weak-topic-analytics";
import { getPracticeConsistency } from "./practice-consistency";
import { getPracticeAnalytics } from "./practice-analytics";

// Centralized cached versions
export const cachedReadinessEngine = cache(getReadinessEngine);
export const cachedWeakTopics = cache(getWeakTopics);
export const cachedPracticeConsistency = cache(getPracticeConsistency);
export const cachedPracticeAnalytics = cache(getPracticeAnalytics);