import { Emitter } from "../event-bus/createEmitter";
import { TimerStatus, SessionSnapshot, TimerEvents } from "./types";

export class TimerEngine {
  private sessionId: string;
  private emitter: Emitter<TimerEvents>;
  
  private _status: TimerStatus = "idle";
  private startTime: number | null = null;
  private accumulatedTimeMs: number = 0;
  private wallClockStartedAt: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(sessionId: string, emitter: Emitter<TimerEvents>) {
    this.sessionId = sessionId;
    this.emitter = emitter;
  }

  public get status(): TimerStatus {
    return this._status;
  }

  public getSnapshot(): SessionSnapshot {
    let totalMs = this.accumulatedTimeMs;
    if (this._status === "running" && this.startTime !== null) {
      totalMs += performance.now() - this.startTime;
    }

    let pausedDurationMs = 0;
    if (this.wallClockStartedAt !== null) {
      const totalSessionLifetimeMs = Date.now() - this.wallClockStartedAt;
      pausedDurationMs = Math.max(0, totalSessionLifetimeMs - totalMs);
    }

    return {
      version: 1,
      sessionId: this.sessionId,
      status: this._status,
      elapsedMs: totalMs,
      startedAt: this.wallClockStartedAt,
      pausedDurationMs,
      lastUpdatedAt: Date.now(),
    };
  }

  public start() {
    if (this._status !== "idle") return;
    this.accumulatedTimeMs = 0;
    this.wallClockStartedAt = Date.now();
    this.startTime = performance.now();
    this._status = "running";

    this.emitter.emit("start", this.getSnapshot());
    this.startTicker();
  }

  public pause() {
    if (this._status !== "running") return;
    if (this.startTime !== null) {
      this.accumulatedTimeMs += performance.now() - this.startTime;
    }
    this.startTime = null;
    this._status = "paused";

    this.stopTicker();
    this.emitter.emit("pause", this.getSnapshot());
  }

  public resume() {
    if (this._status !== "paused") return;
    this.startTime = performance.now();
    this._status = "running";

    this.emitter.emit("resume", this.getSnapshot());
    this.startTicker();
  }

  public finish(): SessionSnapshot {
    if (this._status === "running" && this.startTime !== null) {
      this.accumulatedTimeMs += performance.now() - this.startTime;
    }
    
    const finalSnapshot: SessionSnapshot = {
      ...this.getSnapshot(),
      status: "idle",
    };

    this.destroy();
    this.emitter.emit("finish", finalSnapshot);
    return finalSnapshot;
  }

  public reset() {
    this.destroy();
    this.emitter.emit("reset", this.getSnapshot());
  }

  private startTicker() {
    this.stopTicker();
    this.intervalId = setInterval(() => {
      this.emitter.emit("tick", this.getSnapshot());
    }, 250); // 4Hz macro polling footprint
  }

  private stopTicker() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public destroy() {
    this.stopTicker();
    this._status = "idle";
    this.startTime = null;
    this.accumulatedTimeMs = 0;
    this.wallClockStartedAt = null;
  }
}