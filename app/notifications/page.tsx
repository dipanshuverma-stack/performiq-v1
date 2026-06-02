import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ReadButton from "@/components/notifications/read-button";
import { generateNotifications } from "@/lib/notifications/generate-notifications";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true, // Performance optimization: only load the ID needed for joins
    },
  });

  if (!user) {
    redirect("/login");
  }

  // 1. Core Fix: Generate dynamic records first, but keep notifications optimized next
  await generateNotifications(user.id);

  // 2. Core Fix: Enforce pagination limit boundaries and explicit selection properties
  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      message: true,
      read: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50, // Strict performance guard: do not dump the whole database table over the wire
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">
            🔔
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Notifications
          </h2>

          <p className="text-gray-600 mb-2">
            You're all caught up.
          </p>

          <p className="text-gray-500">
            Notifications will appear here for
            revision reminders, performance alerts,
            and study recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {notification.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <ReadButton id={notification.id} />
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}