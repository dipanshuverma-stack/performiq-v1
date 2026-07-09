I think this is the right time to freeze the reward design before writing any code. Here's a structured version that is consistent, scalable, and matches PerformIQ's philosophy.

---

# PerformIQ Reward System v1

## Design Principles

* Reward **discipline**, not intelligence.
* Reward **execution**, not planning alone.
* Weekly rewards measure **execution**.
* Monthly rewards measure **consistency**.
* Penalties are approximately **50% of the corresponding reward** where applicable.
* Milestone bonuses have **no penalties**.
* Maximum **15 planner tasks/day** count toward rewards.

---

# Weekly Reward Engine

Weekly rewards are earned from four categories.

## 1. Planner Rewards

### Base Reward

| Activity                | Points |
| ----------------------- | -----: |
| Complete 1 planner task |     +5 |
| Miss 1 planner task     |   -2.5 |

Maximum planner tasks counted:

```text
15 tasks/day
```

---

### Completion Bonus

Complete **all** planned tasks.

| Planned Tasks | Bonus |
| ------------: | ----: |
|           1–5 |   +10 |
|             6 | +12.5 |
|             7 |   +15 |
|             8 | +17.5 |
|             9 |   +20 |
|            10 | +22.5 |
|            11 |   +25 |
|            12 | +27.5 |
|            13 |   +30 |
|            14 | +32.5 |
|            15 |   +35 |

Formula

```text
Bonus = 10 + (Tasks − 5) × 2.5
```

Only awarded when **every planned task is completed**.

---

### Examples

5 planned

```text
5 completed

25 + 10

= 35
```

---

10 planned

```text
10 completed

50 + 22.5

= 72.5
```

---

10 planned

```text
9 completed

45

-2.5

No Bonus

=42.5
```

---

# 2. Practice Rewards

Only the **highest milestone** counts each day.

| Practice Time | Reward |
| ------------- | -----: |
| 10 min        |     +2 |
| 15 min        |     +5 |
| 30 min        |    +15 |
| 45 min        |    +20 |
| 60 min        |    +25 |
| 90 min        |    +35 |
| 120+ min      |    +45 |

Penalty

| Activity    | Penalty |
| ----------- | ------: |
| No practice |     -10 |

---

Example

95 min

Reward

```text
+35

NOT

+2
+5
+15
+20
+25
+35
```

---

# 3. Mock Rewards

| Activity    |    Reward |
| ----------- | --------: |
| First Mock  |       +30 |
| Second Mock | +10 Bonus |

Penalty

| Activity                   | Penalty |
| -------------------------- | ------: |
| Planned mock not attempted |     -15 |

Maximum

```text
2 rewarded mocks/day
```

---

# 4. Recovery Bonus

| Activity                    | Reward |
| --------------------------- | -----: |
| Return after 1 missed day   |     +5 |
| Return after 2+ missed days |    +10 |

This encourages users to restart after missing study days.

---

# 5. Weekly Excellence Bonus

Reward users for a disciplined week.

### Requirements

* Planner completion ≥90%
* Practice completed on at least 6 days
* All planned mocks completed
* No full planner day skipped
* No practice day skipped

Reward

```text
+100
```

No penalty if not achieved.

---

# Monthly Reward Engine

Monthly rewards focus on **consistency**, not daily execution.

## Daily Consistency (Streak)

A day counts if the user completes **at least one meaningful study activity**:

* Planner
* Practice
* Mock

Missing a day resets the streak.

| Streak                   | Reward |
| ------------------------ | -----: |
| 3 days                   |    +10 |
| 7 days                   |    +25 |
| 14 days                  |    +50 |
| 21 days                  |    +75 |
| 30 days                  |   +120 |
| Every additional 30 days |   +120 |

These rewards are applied to the **monthly** total only.

---

# Reward Limits

## Planner

* Maximum tasks counted/day: **15**
* Maximum completion bonus/day: **+35**

## Practice

* Highest milestone only

## Mock

* Maximum rewarded mocks/day: **2**

---

# Reward Log

Every reward should create a log entry.

Example

| Date | Module   | Reason               | Points |
| ---- | -------- | -------------------- | -----: |
| Mon  | Planner  | Completed Task       |     +5 |
| Mon  | Planner  | Missed Task          |   -2.5 |
| Mon  | Planner  | Completed All Tasks  |  +22.5 |
| Tue  | Practice | 60 min Practice      |    +25 |
| Wed  | Mock     | Logged Mock          |    +30 |
| Thu  | Recovery | Returned After Break |     +5 |
| Sun  | Weekly   | Excellence Bonus     |   +100 |

---

# Future Dashboard

## Weekly Rewards

* Total Weekly Points
* Planner Points
* Practice Points
* Mock Points
* Recovery Bonus
* Weekly Excellence Bonus
* Weekly Trend

## Monthly Rewards

* Total Monthly Points
* Current Streak
* Consistency Rewards
* Monthly Breakdown
* Reward History

---

## Suggested implementation roadmap

1. **Phase 1:** Database (`RewardLog`, reward calculations, scheduler)
2. **Phase 2:** Automatic rewards for Planner, Practice, and Mock events
3. **Phase 3:** Weekly evaluation job (Excellence Bonus)
4. **Phase 4:** Monthly evaluation job (Streak rewards)
5. **Phase 5:** Reward dashboard and history

This keeps the implementation modular while allowing you to expand the reward system later without changing its core design.
