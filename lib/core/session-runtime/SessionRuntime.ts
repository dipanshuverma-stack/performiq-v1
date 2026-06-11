import { createEmitter, Emitter } from "../event-bus/createEmitter";
import { TimerEngine } from "../session-timer/TimerEngine";
import { TimerEvents, SessionSnapshot } from "../session-timer/types";

export class SessionRuntime {
  public sessionId: string;
  public events: Emitter<TimerEvents>;
  public timer: TimerEngine;
  
  private cleanups: (() => void)[] = [];
  private isAutosaving = false;
  private cacheKey: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.events = createEmitter<TimerEvents>();
    this.timer = new TimerEngine(sessionId, this.events);
    this.cacheKey = `pm_runtime_cache_${this.sessionId}`;

    this.initializeSubsystems();
  }

  private initializeSubsystems() {
    // Subsystem 1: Local Storage Cache Persistence Pipeline
    this.cleanups.push(
      this.events.on("tick", (snap) => this.writeToLocalCache(snap)),
      this.events.on("pause", (snap) => this.writeToLocalCache(snap)),
      this.events.on("finish", () => this.clearLocalCache())
    );

    // Subsystem 2: Tab Visibility / Crash Mitigation Interceptor
    if (typeof window !== "undefined") {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          this.writeToLocalCache(this.timer.getSnapshot());
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      this.cleanups.push(() => 
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      );
    }
  }

  // Cloud API Orchestration Hook (Invoked via Parent Manager Frameworks)
  public async syncWithCloud(autosaveAction: (snapshot: SessionSnapshot) => Promise<any>) {
    const snapshot = this.timer.getSnapshot();
    if (snapshot.status !== "running" || this.isAutosaving) return;

    this.isAutosaving = true;
    try {
      await autosaveAction(snapshot);
    } catch (err) {
      console.error("[SessionRuntime] Background cloud sync failure:", err);
    } finally {
      this.isAutosaving = false;
    }
  }

  private writeToLocalCache(snapshot: SessionSnapshot) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(snapshot));
    } catch (err) {
      console.error("[SessionRuntime] Cache persistence fallback failed:", err);
    }
  }

  private clearLocalCache() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.cacheKey);
  }

  public destroy() {
    this.timer.destroy();
    this.cleanups.forEach((cleanup) => cleanup());
    this.events.clear();
  }
}