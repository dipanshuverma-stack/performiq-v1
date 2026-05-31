import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createTask,
  toggleTask,
  deleteTask,
} from "@/app/actions/task";

export default async function TasksPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Tasks
      </h1>

      <form
        action={createTask}
        className="flex gap-3 mb-8"
      >
        <input
          name="title"
          placeholder="Add a new task..."
          className="border rounded-lg px-4 py-2 flex-1"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border rounded-lg p-4 flex items-center justify-between ${
              task.completed
                ? "bg-green-100 border-green-500"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <form
                action={async () => {
                  "use server";
                  await toggleTask(task.id);
                }}
              >
                <button
                  type="submit"
                  className="text-xl"
                >
                  {task.completed ? "✅" : "⬜"}
                </button>
              </form>

              <span
                className={
                  task.completed
                    ? "line-through text-gray-500"
                    : ""
                }
              >
                {task.title}
              </span>
            </div>

            <form
              action={async () => {
                "use server";
                await deleteTask(task.id);
              }}
            >
              <button
                type="submit"
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}