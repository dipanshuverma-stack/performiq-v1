import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask, deleteTask } from "@/app/actions/task";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Combined relational fetch pass retrieving precise database fields
  const userWithTasks = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      tasks: {
        select: {
          id: true,
          title: true,
          completed: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!userWithTasks) {
    redirect("/login");
  }

  const tasks = userWithTasks.tasks;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Task Manager
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Keep track of daily study goals, assignment tasks, and preparation steps.
        </p>
      </div>

      {/* Task Insertion Form Box */}
      <form
        action={createTask}
        className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <input
          name="title"
          required
          placeholder="Add a new checklist target..."
          className="border border-gray-200 rounded-lg px-4 py-2.5 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 active:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Add Task
        </button>
      </form>

      {/* Task Checklist Items Iteration Frame */}
      {tasks.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-3 select-none">📋</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Your Checklist is Clear
          </h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Break your goals down by adding milestone steps using the utility input tool above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, index) => {
            // Contextually pre-bind actions to anchor them cleanly away from runtime loop structures
            const toggleTaskAction = toggleTask.bind(null, task.id);
            const deleteTaskAction = deleteTask.bind(null, task.id);

            return (
              <div
                key={`${task.id}-${index}`}
                className={`border rounded-xl p-4 flex items-center justify-between transition-all group ${
                  task.completed
                    ? "bg-green-50/40 border-green-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Stable Bound Completion Checkbox Form Component */}
                  <form action={toggleTaskAction} className="shrink-0 flex items-center">
                    <button
                      type="submit"
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        task.completed
                          ? "bg-green-600 border-green-600 text-white focus:ring-green-500"
                          : "border-gray-300 hover:border-gray-400 bg-white focus:ring-gray-900"
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>

                  <span
                    className={`text-sm font-medium truncate pr-4 ${
                      task.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                {/* Stable Bound Disposal Execution Form Component */}
                <form action={deleteTaskAction} className="shrink-0">
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}