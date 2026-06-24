import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ReadButton from "@/components/notifications/read-button";
import { generateNotifications } from "@/lib/notifications/generate-notifications";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) redirect("/login");

  // Generate fresh notifications
  await generateNotifications(user.id);

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      message: true,
      read: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Notifications</h1>
        <p className="text-slate-400 mt-2">Stay updated with your progress and reminders</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#0E121B] border border-white/[0.08] rounded-3xl p-12 text-center">
          <div className="text-6xl mb-6">🔔</div>
          <h2 className="text-2xl font-bold mb-3">You're All Caught Up</h2>
          <p className="text-slate-400 max-w-sm mx-auto">
            Notifications for revision reminders, performance alerts, and study recommendations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "bg-[#0E121B] border border-white/[0.08] rounded-3xl p-6 transition-all",
                !notification.read && "border-blue-500/30 bg-blue-500/[0.03]"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">{notification.title}</h3>
                  <p className="text-slate-400 mt-2 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <ReadButton id={notification.id} />
                )}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                {new Date(notification.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}