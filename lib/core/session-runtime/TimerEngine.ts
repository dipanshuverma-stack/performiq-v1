import { Emitter } from "../event-bus/createEmitter";
import { TimerEvents, SessionSnapshot } from "../../../components/practice/core/types";

export class TimerEngine {
  private sessionId: string;
  private events: Emitter<TimerEvents>;
  
  private status: SessionSnapshot["status"] = "idle";
  private elapsedMs: number = 0;
  private startTime: number | null = null;
  private intervalId: any = null;

  // 🎯 Stable Snapshot Cache Line matching your SessionSnapshot type profile
  private snapshot: SessionSnapshot = { status: "idle", elapsedMs: 0 };

  constructor(sessionId: string, events: Emitter<TimerEvents>) {
    this.sessionId = sessionId;
    this.events = events;

    // Attempt to pre-seed elapsedMs if local cache exists during initialization
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`pm_runtime_cache_${this.sessionId}`);
        if (cached) {
          const parsed = JSON.parse(cached) as SessionSnapshot;
          this.status = parsed.status === "running" ? "paused" : parsed.status; // Safe-guard against active states on crash
          this.elapsedMs = parsed.elapsedMs;
          this.updateSnapshot();
        }
      } catch (_) {
        // Safe fallback if local storage parsing errors out
      }
    }
  }

  private updateSnapshot() {
    this.snapshot = {
      status: this.status,
      elapsedMs: this.elapsedMs,
    };
  }

  private emit(eventName: keyof TimerEvents) {
    // Structural allocation control line: Only allocate on actual mutation frames
    this.updateSnapshot();
    
    // Fire the stable snapshot across your pre-configured event-bus pipeline
    this.events.emit(eventName, this.snapshot);
  }

  /**
   * Handles strict initial boot execution routines from an 'idle' baseline.
   */
  public start() {
    if (this.status !== "idle") return;

    this.status = "running";
    this.startTime = Date.now();

    this.intervalId = setInterval(() => {
      if (this.startTime) {
        this.elapsedMs = Date.now() - this.startTime;
        this.emit("tick");
      }
    }, 100);

    this.emit("start");
  }

  /**
   * Re-anchors elapsed parameters cleanly out of a historical 'paused' frame.
   */
  public resume() {
    if (this.status !== "paused") return;

    this.status = "running";
    // Delta mathematical calculation offset line
    this.startTime = Date.now() - this.elapsedMs;

    this.intervalId = setInterval(() => {
      if (this.startTime) {
        this.elapsedMs = Date.now() - this.startTime;
        this.emit("tick");
      }
    }, 100);

    this.emit("resume");
  }

  public pause() {
    if (this.status !== "running") return;
    this.status = "paused";
    if (this.intervalId) clearInterval(this.intervalId);
    this.emit("pause");
  }

  public reset() {
    this.status = "idle";
    this.elapsedMs = 0;
    this.startTime = null;
    if (this.intervalId) clearInterval(this.intervalId);
    this.emit("reset");
  }

  public finish(): SessionSnapshot {
    this.status = "finished";
    if (this.intervalId) clearInterval(this.intervalId);
    this.emit("finish");
    return this.snapshot;
  }

  public getSnapshot(): SessionSnapshot {
    return this.snapshot; // 🔄 Returns the identical memory reference during standard render loops
  }

  public destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}