import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  Activity,
  Flame,
  Award
} from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";

interface ActivityItem {
  id: string;
  rewardType: string;
  title: string;
  description: string | null;
  points: number;
  createdAt: Date;
  isAchievement?: boolean;
}

interface PreparationJourneyProps {
  activities: ActivityItem[];
  achievements: any[];
}

const getIcon = (rewardType: string, isAchievement?: boolean) => {
  if (isAchievement) return Award;
  switch (rewardType) {
    case "PRACTICE":
      return BookOpen;
    case "PLANNER":
      return ClipboardCheck;
    case "MOCK":
      return Trophy;
    default:
      return BookOpen;
  }
};

const getActivityStyle = (rewardType: string, isAchievement?: boolean) => {
  if (isAchievement) {
    return {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500",
      badge: "ACHIEVEMENT UNLOCKED",
    };
  }
  switch (rewardType) {
    case "PRACTICE":
      return {
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        border: "border-indigo-500",
        badge: "PRACTICE",
      };
    case "MOCK":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500",
        badge: "MOCK TEST",
      };
    case "PLANNER":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500",
        badge: "PLANNER",
      };
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        border: "border-slate-500",
        badge: "ACTIVITY",
      };
  }
};

export function PreparationJourney({ activities, achievements }: PreparationJourneyProps) {
  // Step 10: Merge unlocked achievements with historical reward items seamlessly
  const unlockedItems: ActivityItem[] = achievements
    .filter((a) => a.users && a.users.length > 0)
    .map((a) => ({
      id: `ach-${a.id}`,
      rewardType: "ACHIEVEMENT",
      title: `${a.title} Unlocked`,
      description: a.description,
      points: a.xp ?? 0,
      createdAt: new Date(a.users[0].unlockedAt),
      isAchievement: true,
    }));

  const combinedTimeline = [...activities, ...unlockedItems].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const groupActivitiesByDate = (items: ActivityItem[]) => {
    const groups: { title: string; items: ActivityItem[] }[] = [
      { title: "TODAY", items: [] },
      { title: "YESTERDAY", items: [] },
      { title: "THIS WEEK", items: [] },
    ];

    items.forEach((item) => {
      const d = new Date(item.createdAt);
      if (isToday(d)) {
        groups[0].items.push(item);
      } else if (isYesterday(d)) {
        groups[1].items.push(item);
      } else {
        groups[2].items.push(item);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  };

  const groupedTimeline = groupActivitiesByDate(combinedTimeline);

  if (combinedTimeline.length === 0) {
    return (
      <section className="space-y-5">
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <Activity className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white">Your journey starts today</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Complete practice tasks or unlock your first achievement milestone to populate your map.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-8">
        {groupedTimeline.map((group) => (
          <div key={group.title} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground shrink-0">
                {group.title}
              </span>
              <div className="h-px w-full bg-white/[0.06]" />
            </div>

            <div className="space-y-4">
              {group.items.map((activity, index) => {
                const Icon = getIcon(activity.rewardType, activity.isAchievement);
                const style = getActivityStyle(activity.rewardType, activity.isAchievement);

                return (
                  <div key={activity.id} className="relative pl-8">
                    {index !== group.items.length - 1 && (
                      <div className="absolute left-4 top-7 bottom-0 w-px bg-white/10" />
                    )}
                    
                    <div
                      className={`
                        absolute left-[10px] top-5 h-3 w-3 rounded-full bg-[#0E121B] border-2 transition-colors duration-300 ${style.border}
                      `}
                    />

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4 items-center min-w-0">
                          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${style.bg}`}>
                            <Icon className={`h-4 w-4 ${style.text}`} />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-slate-200 text-sm truncate">
                                {activity.title}
                              </h3>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider border border-white/5 bg-white/[0.02] ${style.text}`}>
                                {style.badge}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.description ?? activity.rewardType}
                            </p>
                          </div>
                        </div>

                        {/* Step 9: Premium Badge Implementation Container */}
                        <div className="text-left md:text-right shrink-0 flex flex-row items-center justify-between md:flex-col md:items-end gap-2 md:gap-0">
                          {activity.points > 0 && (
                            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-amber-400 shadow-inner">
                              <span className="text-xs">⭐</span>
                              <span className="font-mono text-xs font-bold tabular-nums">
                                +{activity.points} XP
                              </span>
                            </div>
                          )}

                          <p className="text-[11px] text-muted-foreground md:mt-2 font-medium">
                            {formatDistanceToNow(activity.createdAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}