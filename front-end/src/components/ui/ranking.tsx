"use client";

import { useApi } from "@/app/hooks/useApi";
import { useDebounce } from "@/app/hooks/useDebounce";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const Ranking = () => {
    const [name, setName] = useState("");
    const [mark, setMark] = useState<boolean>(false);
    const [filter, setFilter] = useState<"all" | "following">("all");
    const debouncedName = useDebounce(name, 300);

    const { data: users, setData: setUsers, loading, request } = useApi<any[]>();
    const [all, setAll] = useState<any[]>([]);

    useEffect(() => {
        async function getAllUsers() {
            const data = await request(async () => {
                const res = await api.get("/auth/getAll");
                return res.data;
            });
            setAll(data);
        }
        getAllUsers();
    }, []);

    useEffect(() => {
        async function search() {
            if (debouncedName === "") {
                setUsers(all);
            } else {
                await request(async () => {
                    const res = await api.get(`/auth/getAllByName/${debouncedName}`);
                    return res.data;
                });
            }
        }
        search();
    }, [debouncedName, all]);

    async function handleFollow(id: string) {
        setMark(true);
        await api.post("/chat/follow", { targetUserId: id });
        setMark(false);
    }

    const getMedalColor = (rank: number) => {
        if (rank === 1) return "from-yellow-400 to-yellow-600";
        if (rank === 2) return "from-gray-300 to-gray-500";
        if (rank === 3) return "from-amber-600 to-amber-800";
        return "from-purple-600 to-pink-600";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Leaderboard
                        </h1>
                        <p className="text-gray-400">Top players ranked by score</p>
                    </div>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Search players..."
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none transition-colors w-64"
                    />
                </div>

                <div className="flex gap-3 mb-6">
                    {["all", "following"].map((f) => (
                        <motion.button
                            key={f}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(f as "all" | "following")}
                            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                                filter === f
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </motion.button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {users?.map((u: any, id: number) => (
                            <motion.div
                                key={u.id || id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: id * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                    id < 3
                                        ? "bg-gradient-to-r from-white/10 to-white/5 border-yellow-500/30"
                                        : "bg-white/5 border-white/10 hover:border-purple-500/30"
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMedalColor(id + 1)} flex items-center justify-center font-bold text-lg shadow-lg`}>
                                    {id + 1}
                                </div>

                                <img
                                    src={u.previewURL || "/avt.jpg"}
                                    alt={u.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                />

                                <div className="flex-1">
                                    <p className="font-bold text-lg">{u.name}</p>
                                    <p className="text-sm text-gray-400">Player</p>
                                </div>

                                <div className="text-right mr-4">
                                    <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        {Math.floor(u.score).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">points</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleFollow(u.id)}
                                    disabled={mark}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-shadow disabled:opacity-50"
                                >
                                    Follow
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Ranking;