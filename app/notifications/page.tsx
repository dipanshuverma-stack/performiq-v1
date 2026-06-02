import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ReadButton from "@/components/notifications/read-button";
import { generateNotifications }
from "@/lib/notifications/generate-notifications";

export default async function NotificationsPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return null;
  }
  await generateNotifications(user.id);
  const notifications =
    await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Notifications
      </h1>

      <div className="space-y-4">
        {notifications.map(
          (notification) => (
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
                  <ReadButton
                    id={notification.id}
                  />
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}