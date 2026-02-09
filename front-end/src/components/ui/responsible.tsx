"use client";

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface Task {
  id: string;
  targetScore: number;
  completed: boolean;
  assignedAt: string;
  game: {
    id: number;
    title: string;
    image: string;
    value: number;
  };
}

interface TaskResponse {
  task: Task | null;
  timeRemaining: number;
  isNew?: boolean;
  message?: string;
}

const Responsible = () => {
  const [taskData, setTaskData] = useState<TaskResponse | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Task[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [taskRes, histRes] = await Promise.all([
          api.get("/task/current"),
          api.get("/task/history"),
        ]);
        if (mounted) {
          setTaskData(taskRes.data);
          setCountdown(Math.max(0, taskRes.data.timeRemaining || 0));
          setHistory(histRes.data || []);
        }
      } catch (err) {
        if (mounted) setError("Failed to load tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]);

  const completeTask = async () => {
    if (!taskData?.task || completing) return;
    setCompleting(true);
    try {
      const res = await api.post("/task/complete", { taskId: taskData.task.id });
      if (res.data.success) {
        setTaskData({ ...taskData, task: null, message: "Task completed! +10 points" });
        const histRes = await api.get("/task/history");
        setHistory(histRes.data || []);
      }
    } catch (err) {
      setError("Failed to complete task");
    } finally {
      setCompleting(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/task/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getGamePath = (title: string) => {
    return `/${title.split(" ")[0].toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Daily Tasks
        </h1>
        <p className="text-gray-400 mb-8">
          Complete tasks every hour to earn bonus points!
        </p>

        {taskData?.task ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#1f1f3a] to-[#2a2a4a] rounded-2xl p-8 shadow-2xl border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
                ACTIVE TASK
              </span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-300">Time: {formatTime(countdown)}</span>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative"
              >
                <img
                  src={taskData.task.game.image}
                  alt={taskData.task.game.title}
                  className="w-40 h-40 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
              </motion.div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{taskData.task.game.title}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Target Score:</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {taskData.task.targetScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Reward:</span>
                    <span className="text-xl font-bold text-green-400">+10 Points</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Link href={getGamePath(taskData.task.game.title)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-shadow"
                    >
                      Play Now
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={completeTask}
                    disabled={completing}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-shadow disabled:opacity-50"
                  >
                    {completing ? "Completing..." : "Complete Task"}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-black/30 rounded-xl">
              <p className="text-sm text-gray-400">
                Reach the target score in {taskData.task.game.title} to complete this task
                and earn 10 bonus points! The task will refresh every hour.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#1f1f3a] to-[#2a2a4a] rounded-2xl p-8 shadow-2xl border border-gray-500/20 text-center"
          >
            <div className="text-6xl mb-4">&#9200;</div>
            <h2 className="text-2xl font-bold mb-2">No Active Task</h2>
            <p className="text-gray-400 mb-4">{taskData?.message || "Next task coming soon!"}</p>
            <div className="text-4xl font-bold text-purple-400">{formatTime(countdown)}</div>
            <p className="text-sm text-gray-500 mt-2">until next task</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowHistory(!showHistory)}
          className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-semibold transition-colors"
        >
          {showHistory ? "Hide" : "Show"} Task History
        </motion.button>

        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-3"
          >
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No task history yet</p>
            ) : (
              history.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`p-4 rounded-xl flex items-center justify-between ${
                    task.completed
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-red-900/20 border border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={task.game.image}
                      alt={task.game.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{task.game.title}</p>
                      <p className="text-sm text-gray-400">
                        Target: {task.targetScore} points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        task.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {task.completed ? "Completed +10" : "Failed"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(task.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Responsible;