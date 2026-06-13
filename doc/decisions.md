# Architecture Decisions

## AD-001
Foundation:
Next.js 15 + Prisma + PostgreSQL + NextAuth

Reason:
Production-ready architecture.

---

## AD-002
Gemini Usage:
On-demand only.

Reason:
Reduce quota consumption and cost.

---

## AD-003
AI Cache:
12 hours.

Reason:
Prevent repeated Gemini calls.

---

## AD-004
Readiness Score:
Rule-based.

Reason:
No AI required.

---

## AD-005
Analytics:
Rule-based.

Reason:
Faster and cheaper than AI.

---

## AD-006
Prelims/Mains:
Separate tracking.

Reason:
Matches actual banking exam preparation.

---

## AD-007
Enhanced Mock Logger:
Highest priority V2 feature.

Reason:
All analytics depend on quality data.